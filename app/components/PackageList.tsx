'use client'

import { useRef, useCallback, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { PackageRecord, FindingRecord, Severity } from '@/types/bumblebee'
import { JsonModal } from './JsonModal'

interface PackageListProps {
	packages: PackageRecord[]
	findingsBySig: Map<string, FindingRecord>
}

export function buildFindingsBySig(findings: FindingRecord[]): Map<string, FindingRecord> {
	const map = new Map<string, FindingRecord>()
	for (const f of findings) {
		map.set(`${f.ecosystem}::${f.normalized_name}::${f.version}`, f)
	}
	return map
}

function pkgSig(pkg: PackageRecord): string {
	return `${pkg.ecosystem}::${pkg.normalized_name}::${pkg.version}`
}

function maskPath(path: string): string {
	return path.replace(/\/Users\/[^/]+/, '~').replace(/\/home\/[^/]+/, '~')
}

const SEVERITY_CLASS: Record<Severity, string> = {
	critical: 'badge-error',
	high: 'badge-error',
	medium: 'badge-warning',
	low: 'badge-safe',
}

const CONFIDENCE_CLASS = {
	high: 'badge-safe',
	medium: 'badge-warning',
	low: 'badge-error',
} as const

const ITEM_HEIGHT = 120

interface PackageCardProps {
	pkg: PackageRecord
	finding?: FindingRecord
	onDetails: (pkg: PackageRecord, finding?: FindingRecord) => void
}

function PackageCard({ pkg, finding, onDetails }: PackageCardProps) {
	const [copied, setCopied] = useState(false)
	const isFixture = pkg.source_file?.includes('selftest/fixtures')

	const onCopyPath = useCallback(() => {
		const raw = pkg.source_file ?? pkg.project_path ?? ''
		if (!raw) { alert('No path available'); return }
		const masked = maskPath(raw)
		navigator.clipboard.writeText(masked)
			.then(() => {
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			})
			.catch(() => alert('Failed to copy path'))
	}, [pkg])

	return (
		<div className="package-card">
			<div className="package-info">
				{isFixture && (
					<span className="badge badge-safe" style={{ marginBottom: '0.25rem', display: 'inline-block' }}>
						[Safe Test Fixture]
					</span>
				)}
				<div className="package-name">
					{pkg.package_name ?? pkg.normalized_name ?? '--'}@{pkg.version ?? '--'}
				</div>
				<div className="package-details">
					<span>{pkg.ecosystem}</span>
					{pkg.package_manager && <span>{pkg.package_manager}</span>}
					<span className={`badge ${CONFIDENCE_CLASS[pkg.confidence]}`}>
						{pkg.confidence.toUpperCase()}
					</span>
					{finding && (
						<span className={`badge ${SEVERITY_CLASS[finding.severity]}`}>
							{finding.severity.toUpperCase()}
						</span>
					)}
				</div>
			</div>
			<div className="package-actions">
				<button className="action-btn" onClick={() => onDetails(pkg, finding)}>Details</button>
				<button className="action-btn" onClick={onCopyPath}>
					{copied ? '✓ Copied' : 'Copy Path'}
				</button>
			</div>
		</div>
	)
}

export function PackageList({ packages, findingsBySig }: PackageListProps) {
	const parentRef = useRef<HTMLDivElement>(null)
	const [selected, setSelected] = useState<{ pkg: PackageRecord; finding?: FindingRecord } | null>(null)

	const virtualizer = useVirtualizer({
		count: packages.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ITEM_HEIGHT,
		overscan: 0,
		measureElement: el => el.getBoundingClientRect().height,
	})

	if (packages.length === 0) {
		return (
			<div className="package-list">
				<div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
					No packages match the current filters
				</div>
			</div>
		)
	}

	const currentItem = virtualizer.getVirtualItems()

	return (
		<>
			{selected && (
				<JsonModal
					pkg={selected.pkg}
					finding={selected.finding}
					onClose={() => setSelected(null)}
				/>
			)}

			<div className="package-list">
				<div ref={parentRef} className="virtual-scroll-container"
					style={{
						height: ITEM_HEIGHT * 10
					}}
				>
					<div style={{ position: 'relative', height: `${virtualizer.getTotalSize()}px`, }} >
						{virtualizer.getVirtualItems().map(item => {
							const pkg = packages[item.index]
							const finding = findingsBySig.get(pkgSig(pkg))
							return (
								<div
									key={item.key}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										transform: `translateY(${item.start}px)`,
									}}
								>
									<PackageCard
										pkg={pkg}
										finding={finding}
										onDetails={(p, f) => setSelected({ pkg: p, finding: f })}
									/>
								</div>
							)
						})}
					</div>
				</div>
			</div >
		</>
	)
}