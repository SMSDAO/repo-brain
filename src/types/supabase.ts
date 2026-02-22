export type UserRole = 'admin' | 'operator' | 'viewer';

export type BrainStatus = 'green' | 'auto_fixable' | 'red';

export type RunType = 'doctor' | 'surgeon' | 'autopsy';

export type RunStatus = 'running' | 'success' | 'failed';

export type AlertSeverity = 'critical' | 'pathological' | 'warning';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  last_login_at: string | null;
}

export interface Brain {
  id: string;
  repo: string;
  status: BrainStatus;
  last_scan_at: string | null;
  risk_score: number;
  framework: string | null;
  languages: string[] | null;
  created_at: string;
}

export interface Run {
  id: string;
  brain_id: string;
  type: RunType;
  started_at: string;
  finished_at: string | null;
  status: RunStatus;
  logs_url: string | null;
  duration_ms: number | null;
}

export interface Alert {
  id: string;
  brain_id: string;
  severity: AlertSeverity;
  message: string;
  file: string | null;
  line: number | null;
  created_at: string;
  resolved: boolean;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at'> & { created_at?: string };
        Update: Partial<Omit<User, 'id'>>;
      };
      brains: {
        Row: Brain;
        Insert: Omit<Brain, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Brain, 'id'>>;
      };
      runs: {
        Row: Run;
        Insert: Omit<Run, 'id' | 'started_at'> & { id?: string; started_at?: string };
        Update: Partial<Omit<Run, 'id'>>;
      };
      alerts: {
        Row: Alert;
        Insert: Omit<Alert, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Alert, 'id'>>;
      };
    };
  };
}
