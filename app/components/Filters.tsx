'use client'

import { useCallback, useRef } from 'react'
import type { Filters, RiskFilter, SortField, SortDir } from '../hooks/useFilteredPackages'
import type { Confidence } from '@/types/bumblebee'

interface FiltersProps {
	filters: Filters
	ecosystems: string[]
	onChange: (filters: Filters) => void
}

const DEBOUNCE_MS = 150

export function FiltersBar({ filters, ecosystems, onChange }: FiltersProps) {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const update = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
		onChange({ ...filters, [key]: value })
	}, [filters, onChange])

	const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		if (timerRef.current) clearTimeout(timerRef.current)
		timerRef.current = setTimeout(() => update('search', value), DEBOUNCE_MS)
	}, [update])

	const onEcosystem = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => update('ecosystem', e.target.value), [update])
	const onRisk = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => update('risk', e.target.value as RiskFilter), [update])
	const onConfidence = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => update('confidence', e.target.value as Confidence | 'all'), [update])
	const onSortField = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => update('sortField', e.target.value as SortField), [update])
	const onSortDir = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => update('sortDir', e.target.value as SortDir), [update])

	return (
		<section className="filters">
			<div className="filter-group">
				<label htmlFor="search-filter">Search</label>
				<input
					id="search-filter"
					type="search"
					placeholder="name, version, path…"
					defaultValue={filters.search}
					onChange={onSearch}
				/>
			</div>

			<div className="filter-group">
				<label htmlFor="ecosystem-filter">Ecosystem</label>
				<select id="ecosystem-filter" value={filters.ecosystem} onChange={onEcosystem}>
					<option value="all">All Ecosystems</option>
					{ecosystems.map(eco => (
						<option key={eco} value={eco}>{eco}</option>
					))}
				</select>
			</div>

			<div className="filter-group">
				<label htmlFor="risk-filter">Risk Context</label>
				<select id="risk-filter" value={filters.risk} onChange={onRisk}>
					<option value="all">All</option>
					<option value="has-lifecycle-scripts">Has Lifecycle Scripts</option>
				</select>
			</div>

			<div className="filter-group">
				<label htmlFor="confidence-filter">Identity Confidence</label>
				<select id="confidence-filter" value={filters.confidence} onChange={onConfidence}>
					<option value="all">All</option>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
			</div>

			<div className="filter-group">
				<label htmlFor="sort-field">Sort By</label>
				<select id="sort-field" value={filters.sortField} onChange={onSortField}>
					<option value="package_name">Package Name</option>
					<option value="project_path">Project Path</option>
					<option value="ecosystem">Ecosystem</option>
					<option value="confidence">Confidence</option>
				</select>
			</div>

			<div className="filter-group">
				<label htmlFor="sort-dir">Direction</label>
				<select id="sort-dir" value={filters.sortDir} onChange={onSortDir}>
					<option value="asc">Asc ↑</option>
					<option value="desc">Desc ↓</option>
				</select>
			</div>
		</section>
	)
}