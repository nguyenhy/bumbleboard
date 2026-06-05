'use client'

import { useMemo } from 'react'
import { isFinding, isDiagnostic, isPackage, type BumblebeeRecord } from '@/types/bumblebee'

interface SidebarProps {
	records: BumblebeeRecord[]
}

interface Stats {
	totalPackages: number
	ecosystemDiversity: number
	activeThreats: number
	activeCaveats: number
}

function useStats(records: BumblebeeRecord[]): Stats {
	return useMemo(() => ({
		totalPackages: records.filter(isPackage).length,
		ecosystemDiversity: new Set(records.filter(isPackage).map(r => r.ecosystem)).size,
		activeThreats: records.filter(isFinding).length,
		activeCaveats: records.filter(r => isDiagnostic(r) && r.level === 'warn').length,
	}), [records])
}

interface CounterBoxProps {
	value: number
	label: string
	threat?: boolean
}

function CounterBox({ value, label, threat }: CounterBoxProps) {
	return (
		<div className="counter-box">
			<div className={`counter-value${threat ? ' threat' : ''}${threat && value > 0 ? ' flash' : ''}`}>
				{value.toLocaleString()}
			</div>
			<div className="counter-label">{label}</div>
		</div>
	)
}

export function Sidebar({ records }: SidebarProps) {
	const stats = useStats(records)

	return (
		<aside className="sidebar">
			<div className="sidebar-section">
				<div className="sidebar-title">
					<span>📊</span>
					High-Level Inventory Statistics
				</div>
				<div className="counter-widgets">
					<CounterBox value={stats.totalPackages} label="Total Scanned Objects" />
					<CounterBox value={stats.ecosystemDiversity} label="Total Ecosystem Diversity" />
					<CounterBox value={stats.activeThreats} label="Active Threats Vector Count" threat />
					<CounterBox value={stats.activeCaveats} label="Active Operational Caveats" />
				</div>
			</div>
		</aside>
	)
}