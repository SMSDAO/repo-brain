
export enum RepoStatus {
  GREEN = 'GREEN',
  AUTO_FIXABLE = 'AUTO_FIXABLE',
  RED = 'RED',
  UNKNOWN = 'UNKNOWN'
}

export interface Diagnosis {
  repo: string;
  status: RepoStatus;
  reason: string;
  languages: string[];
  framework: string;
  ci: string;
  timestamp: string;
  aiGuardComments?: string[];
  vulnerabilities?: number;
  workflows?: string[];
  jobs?: string[];
  copilotInstructions?: string;
  lastRunLogs?: string[];
}

export interface HealthReport {
  timestamp: string;
  mermedaPresent: boolean;
  jqPresent: boolean;
  nodePresent: boolean;
  fallbackPresent: boolean;
  missingScripts: string[];
  notExecutable: string[];
  dryRunErrors: string[];
}

export interface VitalsReport {
  repoSize: string;
  fileCount: string;
  largestDirs: string;
  commitCount: string;
  lastCommitAge: string;
  testDurationSec: number;
  buildDurationSec: number;
}

export interface FirewallRule {
  pattern: string;
  severity: 'CRITICAL' | 'WARNING';
  description: string;
}

export interface FirewallReport {
  installed: boolean;
  activeRules: FirewallRule[];
  lastInterceptedFiles: string[];
}

export interface AutopsyReport {
  runId: string;
  timestamp: string;
  treeSnapshot: string[];
  capturedFiles: string[];
  traces: Record<string, string>;
  envKeys: string[];
}

export interface BlackboxRecording {
  runId: string;
  timestamp: string;
  env: string;
  gitStatus: string;
  gitLog: string;
  trace: string;
}

export interface GenomeChange {
  file: string;
  change: 'added' | 'modified' | 'removed';
}

export interface GenomeReport {
  from: string;
  to: string;
  changes: GenomeChange[];
}

export interface ImmunizerReport {
  locked: boolean;
  hashFound: boolean;
  integrityOk: boolean;
  lastLockedAt: string;
  filesProtected: number;
  hash: string;
}

export interface FleetData {
  generatedAt: string;
  repos: Diagnosis[];
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}
