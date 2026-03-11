# RepoBrain Operator v1
# Autonomous multi-repo governance system

param(
    [string]$Org = "SMSDAO",
    [string]$Workspace = "$env:GITHUB_WORKSPACE/fleet",
    [int]$Workers = 8,
    [switch]$AutoMerge = $false,
    [switch]$ArchiveDead = $false
)

$ErrorActionPreference = "Stop"

function Write-Log($msg) {
    $t = Get-Date -Format "HH:mm:ss"
    Write-Host "[$t] $msg"
}

function Ensure-Workspace {
    if (!(Test-Path $Workspace)) {
        New-Item -ItemType Directory $Workspace | Out-Null
    }
}

function Get-Repos {
    Write-Log "Scanning organization..."
    $repos = gh repo list $Org --limit 1000 --json name,url | ConvertFrom-Json
    return $repos
}

function Clone-Repo($repo) {
    $path = Join-Path $Workspace $repo.name
    if (!(Test-Path $path)) {
        Write-Log "Cloning $($repo.name)"
        gh repo clone "$Org/$($repo.name)" $path
    }
    return $path
}

function Detect-Language($path) {
    if (Test-Path "$path/package.json") { return "node" }
    if (Test-Path "$path/requirements.txt") { return "python" }
    if (Test-Path "$path/Cargo.toml") { return "rust" }
    if (Test-Path "$path/go.mod") { return "go" }
    if (Test-Path "$path/pom.xml") { return "java" }
    if (Test-Path "$path/*.csproj") { return "dotnet" }
    if (Test-Path "$path/Dockerfile") { return "docker" }
    return "generic"
}

function Ensure-StandardFiles($path) {
    if (!(Test-Path "$path/README.md")) {
        "# Repo" | Out-File "$path/README.md"
    }

    if (!(Test-Path "$path/CHANGELOG.md")) {
        "## Initial" | Out-File "$path/CHANGELOG.md"
    }

    if (!(Test-Path "$path/bootstrap.ps1")) {
        @"
Write-Host "Bootstrap environment"
"@ | Out-File "$path/bootstrap.ps1"
    }

    if (!(Test-Path "$path/.gitignore")) {
        "node_modules`n.env`n.DS_Store" | Out-File "$path/.gitignore"
    }
}

function Remove-UnsafeWorkflows($path) {
    $wf = "$path/.github/workflows"
    if (!(Test-Path $wf)) { return }

    Get-ChildItem $wf -Filter *.yml | ForEach-Object {
        $c = Get-Content $_.FullName -Raw
        if ($c -match "pull_request_target") {
            Write-Log "Disabling unsafe workflow $($_.Name)"
            Rename-Item $_.FullName "$($_.FullName).disabled"
        }
    }
}

function Generate-CI($path, $lang) {
    $wfdir = "$path/.github/workflows"
    if (!(Test-Path $wfdir)) {
        New-Item -ItemType Directory $wfdir -Force | Out-Null
    }

    $ci = "$wfdir/ci.yml"
    if (Test-Path $ci) { return }

    switch ($lang) {
        "node" {
@"
name: CI
on: [push,pull_request]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install || true
      - run: npm test || true
"@
        }

        "python" {
@"
name: CI
on: [push,pull_request]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: pip install -r requirements.txt || true
      - run: pytest || true
"@
        }

        default {
@"
name: CI
on: [push,pull_request]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "generic repo"
"@
        }
    } | Out-File $ci
}

function Get-DefaultBranch($path) {
    Push-Location $path
    $branch = git remote show origin 2>$null | Select-String "HEAD branch" | ForEach-Object { $_ -replace '.*HEAD branch:\s*', '' }
    Pop-Location
    if ($branch) { return $branch.Trim() }
    return "main"
}

function Commit-And-PR($path, $repo) {
    Push-Location $path

    $err = git checkout -b repo-brain-repair 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Log "checkout: $err" }

    git add .
    $err = git commit -m "repo-brain: automated repair" 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Log "commit: $err" }

    $err = git push origin repo-brain-repair 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Log "push: $err" }

    $defaultBranch = Get-DefaultBranch $path
    $err = gh pr create `
        --title "RepoBrain automated repair" `
        --body "Adds CI, bootstrap and security fixes" `
        --base $defaultBranch `
        --head repo-brain-repair 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Log "pr create: $err" }

    if ($AutoMerge) {
        gh pr merge --auto --squash
    }

    Pop-Location
}

function Detect-DeadRepo($path) {
    Push-Location $path
    $last = git log -1 --format=%cd
    Pop-Location

    $d = [datetime]$last

    if ((Get-Date) - $d -gt (New-TimeSpan -Days 365)) {
        return $true
    }

    return $false
}

function Archive-Repo($repo) {
    if (!$ArchiveDead) { return }
    Write-Log "Archiving $($repo.name)"
    gh repo archive "$Org/$($repo.name)"
}

function Process-Repo($repo) {
    try {
        $path = Clone-Repo $repo
        $lang = Detect-Language $path

        Ensure-StandardFiles $path
        Remove-UnsafeWorkflows $path
        Generate-CI $path $lang
        Commit-And-PR $path $repo

        if (Detect-DeadRepo $path) {
            Archive-Repo $repo
        }
    }
    catch {
        Write-Log "Error processing $($repo.name): $_"
    }
}

function Start-Orchestrator {
    Ensure-Workspace

    $repos = Get-Repos

    Write-Log "$($repos.Count) repositories discovered"

    foreach ($repo in $repos) {
        Process-Repo $repo
    }
}

Start-Orchestrator
