- [Bumblebee Security Dashboard](#bumblebee-security-dashboard)
	- [What is Bumblebee Security Dashboard](#what-is-bumblebee-security-dashboard)
	- [Why You Need It](#why-you-need-it)
	- [Prerequisites](#prerequisites)
	- [How to Use](#how-to-use)
		- [Step 1: Run the Scan](#step-1-run-the-scan)
		- [Step 2: Open the Dashboard](#step-2-open-the-dashboard)
		- [Step 3: Load the Scan File](#step-3-load-the-scan-file)
		- [Step 4: Read the Sidebar Stats](#step-4-read-the-sidebar-stats)
		- [Step 5: Expand Core Insights](#step-5-expand-core-insights)
			- [Structural Metadata](#structural-metadata)
			- [Ecosystem Footprint](#ecosystem-footprint)
			- [Behavior Context Matrix](#behavior-context-matrix)
		- [Step 6: Filter and Sort](#step-6-filter-and-sort)
		- [Step 7: Read the Package List](#step-7-read-the-package-list)
		- [Step 8: Investigate a Package](#step-8-investigate-a-package)
			- [Details](#details)
			- [Copy Path](#copy-path)
	- [Understanding the Results](#understanding-the-results)
		- [Record Types](#record-types)
		- [Confidence Levels](#confidence-levels)
			- [High](#high)
			- [Medium](#medium)
			- [Low](#low)
		- [Severity Badges](#severity-badges)
		- [What "Active Threats" Means](#what-active-threats-means)
	- [Filters \& Sort Reference](#filters--sort-reference)

# Bumblebee Security Dashboard

## What is Bumblebee Security Dashboard

Bumblebee Security Dashboard is a browser-based tool for exploring and triaging the output of `bumblebee scan` — a command-line scanner that inventories installed packages, extensions, and developer tools on macOS and Linux machines.

You load a scan output file into the dashboard and get a filterable, searchable view of every discovered package and any exposure matches found against a threat catalog.

**No data leaves your machine:** all processing happens in your browser.

---

## Why You Need It

`bumblebee scan` writes structured output to stdout as NDJSON — one JSON object per line, one line per discovered item.

On a typical developer machine, a scan produces thousands of records across:

- npm packages
- Python packages
- Go modules
- Editor extensions
- Browser extensions
- Homebrew formulae
- MCP servers

Reading that raw output to answer questions such as:

> Which machines have a vulnerable package installed right now?

is not practical.

The dashboard solves the triage problem by:

- Parsing the file automatically
- Surfacing exposure matches immediately
- Allowing filtering by ecosystem
- Allowing filtering by risk context
- Allowing filtering by identity confidence

No queries or scripts required.

---

## Prerequisites

1. Install the Bumblebee CLI:

   ```bash
   go install github.com/perplexityai/bumblebee/cmd/bumblebee@latest
   ```

2. Generate a scan output file:

   ```bash
   bumblebee scan > my-scan.ndjson
   ```

3. Use a modern browser:
   - Chrome
   - Firefox
   - Edge
   - Safari

---

## How to Use

### Step 1: Run the Scan

Basic scan:

```bash
bumblebee scan > scan-output.ndjson
```

With exposure matching:

```bash
bumblebee scan --catalog /path/to/catalog.json > scan-output.ndjson
```

### Step 2: Open the Dashboard

Open the dashboard URL in your browser.

### Step 3: Load the Scan File

- Drag the `.ndjson` file onto the upload area, or
- Click to select the file

A progress indicator is shown during parsing.

Large files (40,000+ records) typically parse in a few seconds.

### Step 4: Read the Sidebar Stats

The sidebar displays:

- **Total Scanned Objects** — total package records
- **Total Ecosystem Diversity** — distinct ecosystems found
- **Active Threats Vector Count** — finding records (flashes if > 0)
- **Active Operational Caveats** — warning-level diagnostic records

### Step 5: Expand Core Insights

Click **Text-Based Core Insights** to expand:

#### Structural Metadata

- Hostname
- Operating system
- Architecture
- Username
- Scanner version
- Scan time
- Profile

#### Ecosystem Footprint

Count of packages per ecosystem.

Values reflect active filters.

#### Behavior Context Matrix

- Lifecycle script count
- Confidence-level breakdown

### Step 6: Filter and Sort

Use the filter bar to narrow results.

All filters are combined using logical **AND**.

### Step 7: Read the Package List

Each package card displays:

- `name@version`
- Ecosystem
- Package manager
- Confidence badge
- Severity badge (when a finding is matched)

### Step 8: Investigate a Package

#### Details

Opens a modal containing:

- Raw package JSON record
- Associated finding record (if present)

#### Copy Path

Copies a masked source path to the clipboard.

Example:

```text
/Users/<name>/...
```

becomes:

```text
~/...
```

---

## Understanding the Results

### Record Types

| Record Type    | What It Is                                          | Dashboard Behavior                                  |
| -------------- | --------------------------------------------------- | --------------------------------------------------- |
| `package`      | Installed package, extension, or tool found on disk | Listed, filtered, and sorted                        |
| `finding`      | Catalog match for a vulnerable or malicious package | Severity badge on card and visible in Details modal |
| `diagnostic`   | Scanner warning or error                            | Warning-level records counted as Active Caveats     |
| `scan_summary` | End-of-run summary record                           | Parsed but not listed                               |

---

### Confidence Levels

#### High

Identity determined from a definitive source such as:

- Lockfiles
- Install receipts

Safe to match against advisories.

#### Medium

Usually accurate but may be incomplete.

Example:

- Version range available
- Exact version unavailable

#### Low

Identity inferred from:

- File paths
- Partial metadata

Treat as a lead rather than a confirmed match.

---

### Severity Badges

| Severity | Meaning                                        |
| -------- | ---------------------------------------------- |
| CRITICAL | Immediate action warranted                     |
| HIGH     | Immediate action warranted                     |
| MEDIUM   | Significant risk; prioritize based on usage    |
| LOW      | Limited risk; review during normal maintenance |

**No badge** means no catalog match was found.

It does **not** mean the package is safe.

---

### What "Active Threats" Means

Active Threats equals the count of `finding` records.

A finding is created when the scan finds an exact match on:

- Ecosystem
- Package name
- Package version

against the catalog used during the scan.

If the scan was run **without** `--catalog`, this value is always **0**.

---

## Filters & Sort Reference

| Control             | Values                                               | Effect                                                                                |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Search              | Any text                                             | Matches package name, version, and source path. Case-insensitive. Debounced by 150ms. |
| Ecosystem           | All or specific ecosystem                            | Options are populated from ecosystems found in the loaded file.                       |
| Risk Context        | All / Has Lifecycle Scripts                          | Filters packages capable of executing code during install or removal.                 |
| Identity Confidence | All / High / Medium / Low                            | Filters by scanner confidence level.                                                  |
| Sort By             | Package Name / Project Path / Ecosystem / Confidence | Selects the sort field.                                                               |
| Direction           | Asc / Desc                                           | Selects sort direction.                                                               |
