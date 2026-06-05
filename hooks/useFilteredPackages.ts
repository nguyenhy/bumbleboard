import { useMemo } from "react";
import {
  isPackage,
  type PackageRecord,
  type BumblebeeRecord,
  type Confidence,
} from "../types/bumblebee";

export type RiskFilter = "all" | "has-lifecycle-scripts";
export type SortField =
  | "package_name"
  | "project_path"
  | "ecosystem"
  | "confidence";
export type SortDir = "asc" | "desc";

const CONFIDENCE_RANK: Record<Confidence, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export interface Filters {
  ecosystem: string;
  risk: RiskFilter;
  confidence: Confidence | "all";
  search: string;
  sortField: SortField;
  sortDir: SortDir;
}

export interface FilteredResult {
  packages: PackageRecord[];
  ecosystems: string[];
}

const SEARCH_FIELDS = [
  "package_name",
  "normalized_name",
  "version",
  "ecosystem",
  "source_file",
  "project_path",
] as const;

function matchesSearch(pkg: PackageRecord, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return SEARCH_FIELDS.some((field) => pkg[field]?.toLowerCase().includes(q));
}

function compare(a: PackageRecord, b: PackageRecord, field: SortField): number {
  if (field === "confidence") {
    return CONFIDENCE_RANK[a.confidence] - CONFIDENCE_RANK[b.confidence];
  }
  const av = a[field] ?? "";
  const bv = b[field] ?? "";
  return av.localeCompare(bv);
}

export function useFilteredPackages(
  records: BumblebeeRecord[],
  filters: Filters,
): FilteredResult {
  const packages = useMemo(() => records.filter(isPackage), [records]);

  const ecosystems = useMemo(
    () => [...new Set(packages.map((p) => p.ecosystem))].sort(),
    [packages],
  );

  const filtered = useMemo(() => {
    const { ecosystem, risk, confidence, search, sortField, sortDir } = filters;
    const q = search.trim();

    const result = packages.filter((pkg) => {
      if (ecosystem !== "all" && pkg.ecosystem !== ecosystem) return false;
      if (risk === "has-lifecycle-scripts" && !pkg.has_lifecycle_scripts)
        return false;
      if (confidence !== "all" && pkg.confidence !== confidence) return false;
      if (q && !matchesSearch(pkg, q)) return false;
      return true;
    });

    result.sort((a, b) => {
      const cmp = compare(a, b, sortField);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [packages, filters]);

  return { packages: filtered, ecosystems };
}
