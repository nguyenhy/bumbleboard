export type Confidence = "high" | "medium" | "low";
export type Severity = "critical" | "high" | "medium" | "low";
export type Profile = "baseline" | "project" | "deep";
export type DiagnosticLevel = "info" | "warn" | "error";

export interface Endpoint {
  hostname: string;
  os: string;
  arch: string;
  username: string;
  uid: string;
  device_id?: string;
}

interface BaseRecord {
  record_id: string;
  schema_version: string;
  scanner_name: string;
  scanner_version: string;
  run_id: string;
  scan_time: string;
  endpoint: Endpoint;
  profile: Profile;
}

export interface PackageRecord extends BaseRecord {
  record_type: "package";
  ecosystem: string;
  package_name: string;
  normalized_name: string;
  version: string;
  project_path?: string;
  root_kind: string;
  package_manager?: string;
  source_type: string;
  source_file: string;
  has_lifecycle_scripts: boolean;
  confidence: Confidence;
}

export interface FindingRecord extends BaseRecord {
  record_type: "finding";
  finding_type: string;
  severity: Severity;
  catalog_id: string;
  catalog_name: string;
  ecosystem: string;
  package_name: string;
  normalized_name: string;
  version: string;
  root_kind: string;
  project_path?: string;
  source_type: string;
  source_file: string;
  confidence: Confidence;
  evidence: string;
}

export interface DiagnosticRecord extends BaseRecord {
  record_type: "diagnostic";
  level: DiagnosticLevel;
  message: string;
}

export interface ScanSummaryRecord extends BaseRecord {
  record_type: "scan_summary";
}

export type BumblebeeRecord =
  | PackageRecord
  | FindingRecord
  | DiagnosticRecord
  | ScanSummaryRecord;

// Type guards
export const isPackage = (r: BumblebeeRecord): r is PackageRecord =>
  r.record_type === "package";

export const isFinding = (r: BumblebeeRecord): r is FindingRecord =>
  r.record_type === "finding";

export const isDiagnostic = (r: BumblebeeRecord): r is DiagnosticRecord =>
  r.record_type === "diagnostic";
