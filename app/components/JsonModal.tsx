'use client'

import { useEffect, useCallback } from 'react'
import type { PackageRecord, FindingRecord } from '@/types/bumblebee'

interface JsonModalProps {
	pkg: PackageRecord
	finding?: FindingRecord
	onClose: () => void
}

export function JsonModal({ pkg, finding, onClose }: JsonModalProps) {
	const onKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === 'Escape') onClose()
	}, [onClose])

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [onKeyDown])

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: 'rgba(0,0,0,0.5)',
				zIndex: 100,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '2rem',
			}}
			onClick={onClose}
		>
			<div
				style={{
					background: 'var(--surface)',
					border: '1px solid var(--border)',
					borderRadius: '8px',
					width: '100%',
					maxWidth: '720px',
					maxHeight: '80vh',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
				}}
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '1rem 1.5rem',
					borderBottom: '1px solid var(--border)',
					flexShrink: 0,
				}}>
					<div>
						<div style={{ fontWeight: 600 }}>
							{pkg.package_name ?? pkg.normalized_name}@{pkg.version}
						</div>
						<div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
							{pkg.ecosystem} · {pkg.package_manager ?? '--'}
						</div>
					</div>
					<button
						onClick={onClose}
						style={{
							background: 'transparent',
							border: '1px solid var(--border)',
							borderRadius: '4px',
							padding: '0.25rem 0.75rem',
							cursor: 'pointer',
							color: 'var(--fg)',
							fontSize: '0.875rem',
						}}
					>
						✕ Close
					</button>
				</div>

				{/* Body */}
				<div style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<div>
						<div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', marginBottom: '0.5rem' }}>
							Package Record
						</div>
						<pre style={{
							background: 'var(--bg)',
							border: '1px solid var(--border)',
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-all',
							margin: 0,
						}}>
							{JSON.stringify(pkg, null, 2)}
						</pre>
					</div>

					{finding && (
						<div>
							<div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#ef4444', marginBottom: '0.5rem' }}>
								⚠ Finding Record
							</div>
							<pre style={{
								background: 'var(--bg)',
								border: '1px solid rgba(239,68,68,0.3)',
								borderRadius: '6px',
								padding: '1rem',
								fontFamily: 'var(--font-mono)',
								fontSize: '0.8rem',
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-all',
								margin: 0,
							}}>
								{JSON.stringify(finding, null, 2)}
							</pre>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}