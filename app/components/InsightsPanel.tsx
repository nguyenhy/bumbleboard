'use client'

import { useMemo } from 'react'
import { isPackage, isDiagnostic, type BumblebeeRecord } from '@/types/bumblebee'

interface InsightsPanelProps {
	records: BumblebeeRecord[]
}

export function InsightsPanel({ records }: InsightsPanelProps) {
	const first = useMemo(() => records.find(isPackage), [records])

	const ecosystemCounts = useMemo(() => {
		const counts: Record<string, number> = {}
		for (const r of records) {
			if (isPackage(r)) counts[r.ecosystem] = (counts[r.ecosystem] ?? 0) + 1
		}
		return Object.entries(counts).sort((a, b) => b[1] - a[1])
	}, [records])

	const behavior = useMemo(() => {
		let lifecycle = 0, high = 0, medium = 0, low = 0
		for (const r of records) {
			if (!isPackage(r)) continue
			if (r.has_lifecycle_scripts) lifecycle++
			if (r.confidence === 'high') high++
			else if (r.confidence === 'medium') medium++
			else if (r.confidence === 'low') low++
		}
		return { lifecycle, high, medium, low }
	}, [records])

	const metadata = useMemo(() => {
		if (!first) return null
		const { endpoint, scanner_name, scanner_version, scan_time, profile } = first
		return {
			hostname: `${endpoint.hostname} (${endpoint.os} / ${endpoint.arch})`,
			user: `${endpoint.username} (UID: ${endpoint.uid})`,
			scanner: `${scanner_name} Engine ${scanner_version}`,
			time: new Date(scan_time).toLocaleString(),
			mode: `--profile ${profile}`,
		}
	}, [first])

	return (
		<section className="insights-section">
			<div className="insights-title"><span>📋</span> Text-Based Core Insights</div>
			<div className="insights-content">

				<div className="info-box">
					<div className="insights-title"><span>🖥️ </span> Structural Metadata Overview</div>
					{metadata ? (
						<pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{[
							'[ Host Machine Configuration ]',
							'---------------------------------------------',
							`Hostname:        ${metadata.hostname}`,
							`Target User:     ${metadata.user}`,
							`Scanner:         ${metadata.scanner}`,
							`Execution Time:  ${metadata.time}`,
							`Scan Context:    ${metadata.mode}`,
						].join('\n')}</pre>
					) : (
						<pre style={{ margin: 0 }}>{[
							'[ Host Machine Configuration ]',
							'---------------------------------------------',
							'Hostname:        --',
							'Target User:     --',
							'Scanner:         --',
							'Execution Time:  --',
							'Scan Context:    --',
						].join('\n')}</pre>
					)}
				</div>

				<div className="info-box">
					<div className="insights-title"><span>📦</span> Ecosystem Footprint Summary</div>
					<table className="matrix-table">
						<thead>
							<tr><th>Ecosystem</th><th>Count</th></tr>
						</thead>
						<tbody>
							{ecosystemCounts.length === 0 ? (
								<tr><td colSpan={2} style={{ color: 'var(--muted)' }}>No data</td></tr>
							) : ecosystemCounts.map(([eco, count]) => (
								<tr key={eco}>
									<td>{eco}</td>
									<td>{count.toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="info-box">
					<div className="insights-title"><span>⚠️ </span> Behavior Context Matrix</div>
					<div className="highlight-panel">
						<div>Lifecycle Script Execution Count: <strong>{behavior.lifecycle}</strong></div>
						<div style={{ marginTop: '0.5rem' }}>Identity Integrity Metrics:</div>
						<div>└─ High Confidence Matches: <strong>{behavior.high.toLocaleString()}</strong> entries</div>
						<div>└─ Medium/Partial Reference: <strong>{behavior.medium.toLocaleString()}</strong> entries</div>
						<div>└─ Evaluated Paths &amp; Constraints: <strong>{behavior.low.toLocaleString()}</strong> entries (Low)</div>
					</div>
				</div>

			</div>
		</section>
	)
}