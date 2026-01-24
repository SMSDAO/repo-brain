
import { RepoStatus, Diagnosis, HealthReport, GenomeReport, AutopsyReport, ImmunizerReport, FleetData, VitalsReport, BlackboxRecording, FirewallReport } from './types';

export const MOCK_REPOS: Diagnosis[] = [
  {
    repo: 'nexus-api',
    status: RepoStatus.GREEN,
    reason: 'MERMEDA alignment verified. CI/CD verified via brain.verify.sh.',
    languages: ['node', 'typescript'],
    framework: 'next',
    ci: 'github-actions',
    timestamp: new Date().toISOString(),
    workflows: ['ci.yml', 'deploy.yml', 'dependency-health.yml'],
    jobs: ['build', 'test', 'deploy'],
    copilotInstructions: '- Fix plumbing, not logic.\n- Avoid subprocess unless critical.',
    lastRunLogs: [
      '🧠 [BRAIN] Phase 1-3: Detection completed (Node/Next)',
      '🧠 [BRAIN] Phase 8: Normalizing CI structure',
      '🧠 [BRAIN] Phase 11: Verification (Success)',
      '🧠 [BRAIN] Phase 12: AI Guard (Clear)',
      '✅ 15/15 phases successful'
    ]
  },
  {
    repo: 'vault-service',
    status: RepoStatus.RED,
    reason: 'Critical Security Violation: Hardcoded API keys and unsafe execution pattern.',
    languages: ['python'],
    framework: 'none',
    ci: 'github-actions',
    timestamp: new Date().toISOString(),
    aiGuardComments: [
      'CRITICAL: Hardcoded OPENAI_API_KEY detected in main.py:12',
      'RISK: Unsafe os.system usage detected in shell_utils.py'
    ],
    vulnerabilities: 2,
    workflows: ['ci.yml'],
    lastRunLogs: [
      '🧠 [BRAIN] Phase 12: AI Guard scan initiated...',
      '❌ [ai-guard] Flagged: main.py, shell_utils.py',
      '⚠️ Phase 12 failed security check'
    ]
  },
  {
    repo: 'contracts-core',
    status: RepoStatus.AUTO_FIXABLE,
    reason: 'Workflow drift detected in solidity-ci.yml.',
    languages: ['solidity'],
    framework: 'none',
    ci: 'none',
    timestamp: new Date().toISOString(),
    workflows: [],
    lastRunLogs: [
      '🧠 [BRAIN] Phase 9: Diagnosis (AUTO_FIXABLE)',
      '🛠️ [fix-safe] Correcting workflow path for Hardhat',
      '✅ Normalization pending'
    ]
  }
];

export const MOCK_HEALTH_REPORT: HealthReport = {
  timestamp: new Date().toISOString(),
  mermedaPresent: true,
  jqPresent: true,
  nodePresent: true,
  fallbackPresent: true,
  missingScripts: [],
  notExecutable: [],
  dryRunErrors: []
};

export const MOCK_VITALS: VitalsReport = {
  repoSize: "1.2G",
  fileCount: "14,502",
  largestDirs: "/node_modules (800M); /dist (200M); /src (150M); /public (50M); /.git (2M)",
  commitCount: "1,240",
  lastCommitAge: "2 hours ago",
  testDurationSec: 45,
  buildDurationSec: 120
};

export const MOCK_FIREWALL: FirewallReport = {
  installed: true,
  activeRules: [
    { pattern: 'OPENAI_API_KEY', severity: 'CRITICAL', description: 'Leakage of LLM secrets' },
    { pattern: 'child_process', severity: 'WARNING', description: 'Unsafe Shell execution' },
    { pattern: 'eval(', severity: 'CRITICAL', description: 'Arbitrary code injection' },
    { pattern: 'SECRET_KEY', severity: 'CRITICAL', description: 'Generic private token' },
    { pattern: 'os.system', severity: 'WARNING', description: 'Python shell escape risk' }
  ],
  lastInterceptedFiles: ['config/test_secrets.env', 'src/legacy_shell.py']
};

export const MOCK_BLACKBOX: BlackboxRecording = {
  runId: 'REC-20240525-001',
  timestamp: new Date().toISOString(),
  env: 'USER=brain\nPATH=/usr/local/bin:/usr/bin\nSHELL=/bin/bash\nBRAIN_VERSION=1.1.0',
  gitStatus: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean',
  gitLog: 'commit f2b3c4d (HEAD -> main)\nAuthor: Brain Bot <bot@repo-brain.ai>\nDate: Sat May 25 10:00:00 2024 +0000\n\n    chore: MERMEDA v1.1.0 sync',
  trace: '+ [brain.run.sh:12] log "Starting brain.run.sh"\n+ [brain.run.sh:14] mkdir -p .repo-brain/auto-comments\n+ [brain.run.sh:16] command -v jq\n+ [brain.run.sh:22] brain.detect.sh\n++ [brain.detect.sh:5] languages=(node typescript)\n++ [brain.detect.sh:12] ci=github-actions\n+ [brain.run.sh:24] brain.scan-actions.sh\n... [TRUNCATED] ...\n✅ Success'
};

export const MOCK_GENOME: GenomeReport = {
  from: 'v1.0.0',
  to: 'v1.1.0',
  changes: [
    { file: 'brain.doctor.sh', change: 'added' },
    { file: 'brain.firewall.sh', change: 'added' },
    { file: 'brain.blackbox.sh', change: 'added' },
    { file: 'brain.vitals.sh', change: 'added' },
    { file: 'brain.autopsy.sh', change: 'added' },
    { file: 'brain.surgeon.sh', change: 'added' },
    { file: 'brain.immunizer.sh', change: 'added' },
    { file: 'brain.run.sh', change: 'modified' }
  ]
};

export const MOCK_AUTOPSY: AutopsyReport = {
  runId: 'AUTOPSY-2024-05-25',
  timestamp: new Date().toISOString(),
  treeSnapshot: ['.repo-brain/brain.run.sh', 'MERMEDA.md'],
  capturedFiles: ['diagnosis.json', 'detect.json'],
  traces: {
    'brain.detect.sh': '+ Detect languages...\n+ languages=(node python)\n✅ Success',
    'brain.ai.guard.sh': '+ Scanning for secrets...\n+ Found RISK: main.py:12\n⚠️ Flagged'
  },
  envKeys: ['PATH', 'JQ_BIN', 'BRAIN_ROOT']
};

export const MOCK_IMMUNIZER: ImmunizerReport = {
  locked: true,
  hashFound: true,
  integrityOk: true,
  lastLockedAt: new Date().toISOString(),
  filesProtected: 15,
  hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
};

export const FLEET_SUMMARY: FleetData = {
  generatedAt: new Date().toISOString(),
  repos: MOCK_REPOS
};
