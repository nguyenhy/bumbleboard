'use client'

import { useState, useMemo, useCallback } from 'react'
import { isFinding, type BumblebeeRecord } from '@/types/bumblebee'
import { useNDJSON } from '../hooks/useNDJSON'
import { useFilteredPackages, type Filters } from '@/hooks/useFilteredPackages'
import { Sidebar } from './Sidebar'
import { UploadArea } from './UploadArea'
import { FiltersBar } from './Filters'
import { MetadataBlock } from './MetadataBlock'
import { StatsPanel } from './StatsPanel'
import { PackageList, buildFindingsBySig } from './PackageList'

const DEFAULT_FILTERS: Filters = {
	ecosystem: 'all',
	risk: 'all',
	confidence: 'all',
	search: '',
	sortField: 'package_name',
	sortDir: 'asc',
}

export function SecurityDashboard() {
	const [insightsExpanded, setInsightsExpanded] = useState(false)

	const { records, status, progress, parse } = useNDJSON()
	const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

	const findings = useMemo(() => records.filter(isFinding), [records])
	const findingsBySig = useMemo(() => buildFindingsBySig(findings), [findings])

	const { packages, ecosystems } = useFilteredPackages(records, filters)

	const onFiltersChange = useCallback((next: Filters) => setFilters(next), [])

	return (
		<div className="dashboard-shell">
			<Sidebar records={records} />

			<main className="main-content">
				<header className="header">
					<h1>Bumblebee Security Dashboard</h1>
					<p>Visualize and filter NDJSON security scan results</p>
				</header>

				<UploadArea status={status} progress={progress} onFile={parse} />


				{
					!!packages.length
					&& (
						<section className="insights-section">
							<div
								className="insights-title"
								style={{ cursor: 'pointer', userSelect: 'none' }}
								onClick={() => setInsightsExpanded(v => !v)}
							>
								<span>📋</span>
								Text-Based Core Insights
								<span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--muted)' }}>
									{insightsExpanded ? '▲ collapse' : '▼ expand'}
								</span>
							</div>
							{insightsExpanded && (
								<div className="insights-content">
									<MetadataBlock records={records} />
									<StatsPanel packages={packages} />
								</div>
							)}
						</section>
					)
				}

				<FiltersBar filters={filters} ecosystems={ecosystems} onChange={onFiltersChange} />
				<PackageList packages={packages} findingsBySig={findingsBySig} />
			</main>
		</div>
	)
}