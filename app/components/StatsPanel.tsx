'use client'

  import { useMemo } from 'react'
  import type { PackageRecord } from '@/types/bumblebee'

  interface StatsPanelProps {
    packages: PackageRecord[]
  }

  export function StatsPanel({ packages }: StatsPanelProps) {
    const ecosystemCounts = useMemo(() => {
      const counts: Record<string, number> = {}
      for (const pkg of packages) {
        counts[pkg.ecosystem] = (counts[pkg.ecosystem] ?? 0) + 1
      }
      return Object.entries(counts).sort((a, b) => b[1] - a[1])
    }, [packages])

    const behavior = useMemo(() => {
      let lifecycle = 0, high = 0, medium = 0, low = 0
      for (const pkg of packages) {
        if (pkg.has_lifecycle_scripts) lifecycle++
        if (pkg.confidence === 'high') high++
        else if (pkg.confidence === 'medium') medium++
        else if (pkg.confidence === 'low') low++
      }
      return { lifecycle, high, medium, low }
    }, [packages])

    return (
      <>
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
      </>
    )
  }