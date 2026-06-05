'use client'

import { useMemo } from 'react'
import { isPackage, type BumblebeeRecord } from '@/types/bumblebee'

interface MetadataBlockProps {
	records: BumblebeeRecord[]
}

export function MetadataBlock({ records }: MetadataBlockProps) {
	const metadata = useMemo(() => {
		const first = records.find(isPackage)
		if (!first) return null
		const { endpoint, scanner_name, scanner_version, scan_time, profile } = first
		return {
			hostname: `${endpoint.hostname} (${endpoint.os} / ${endpoint.arch})`,
			user: `${endpoint.username} (UID: ${endpoint.uid})`,
			scanner: `${scanner_name} Engine ${scanner_version}`,
			time: new Date(scan_time).toLocaleString(),
			mode: `--profile ${profile}`,
		}
	}, [records])

	const lines = metadata ? [
		'[ Host Machine Configuration ]',
		'---------------------------------------------',
		`Hostname:        ${metadata.hostname}`,
		`Target User:     ${metadata.user}`,
		`Scanner:         ${metadata.scanner}`,
		`Execution Time:  ${metadata.time}`,
		`Scan Context:    ${metadata.mode}`,
	] : [
		'[ Host Machine Configuration ]',
		'---------------------------------------------',
		'Hostname:        --',
		'Target User:     --',
		'Scanner:         --',
		'Execution Time:  --',
		'Scan Context:    --',
	]

	return (
		<div className="info-box">
			<div className="insights-title"><span>🖥️ </span> Structural Metadata Overview</div>
			<pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{lines.join('\n')}</pre>
		</div>
	)
}