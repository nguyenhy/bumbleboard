- [bumbleboard](#bumbleboard)
	- [What it does](#what-it-does)
	- [What it does not do](#what-it-does-not-do)
	- [Prerequisites](#prerequisites)
	- [Quick start](#quick-start)
	- [Data format](#data-format)

# bumbleboard

A browser-based dashboard for visualizing [bumblebee](https://github.com/perplexityai/bumblebee) scan output.

## What it does

- Load a `.ndjson` file produced by `bumblebee scan` via drag-and-drop or file picker
- Browse all discovered packages across every ecosystem in a virtualized list (handles 40k+ records)
- Filter by ecosystem, risk context (lifecycle scripts), identity confidence, and free-text search
- Sort by package name, project path, ecosystem, or confidence
- See exposure findings surfaced inline — any package matched against a threat catalog shows a severity badge
- Inspect the raw JSON record for any package via a details modal
- Copy masked source file paths to clipboard

Everything runs in the browser. No data is sent anywhere.

## What it does not do

- It does not run scans. Use the [bumblebee CLI](https://github.com/perplexityai/bumblebee) for that.
- It does not fetch threat catalogs or make network requests of any kind.
- It does not store or persist scan data between sessions.

## Prerequisites

1. **A scan file** — run `bumblebee scan > output.ndjson` on the target machine. See the [bumblebee docs](https://github.com/perplexityai/bumblebee) for scan profiles, flags, and exposure catalog usage.
2. **A modern browser** — Chrome, Firefox, Edge, or Safari.

## Quick start

```sh
# 1. Produce a scan file with bumblebee
bumblebee scan --profile baseline > scan.ndjson

# 2. Open bumbleboard and drag scan.ndjson onto the upload area
```

## Data format

Bumbleboard reads the NDJSON output of `bumblebee scan`. The file contains four record types:

| `record_type`  | What it is                                                               |
| -------------- | ------------------------------------------------------------------------ |
| `package`      | An installed package, extension, or tool found on disk                   |
| `finding`      | A match against an exposure catalog (known vulnerable/malicious package) |
| `diagnostic`   | A scanner warning or error                                               |
| `scan_summary` | End-of-run metadata                                                      |

For the full record schema and field definitions see the [bumblebee output docs](https://github.com/perplexityai/bumblebee#output).
