'use client'

import { useRef, useCallback } from 'react'
import type { ParseStatus } from '../hooks/useNDJSON'

interface UploadAreaProps {
	status: ParseStatus
	progress: number
	onFile: (file: File) => void
}

const ACCEPTED = '.ndjson,.txt'

export function UploadArea({ status, progress, onFile }: UploadAreaProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const dragRef = useRef(false)

	const handleFile = useCallback((file: File | undefined) => {
		if (file) onFile(file)
	}, [onFile])

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		if (!dragRef.current) {
			dragRef.current = true
			e.currentTarget.classList.add('dragover')
		}
	}, [])

	const onDragLeave = useCallback((e: React.DragEvent) => {
		dragRef.current = false
		e.currentTarget.classList.remove('dragover')
	}, [])

	const onDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		dragRef.current = false
		e.currentTarget.classList.remove('dragover')
		handleFile(e.dataTransfer.files[0])
	}, [handleFile])

	const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		handleFile(e.target.files?.[0])
	}, [handleFile])

	const isParsing = status === 'parsing'

	return (
		<section className="upload-section">
			<div
				className="upload-area"
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				onClick={() => inputRef.current?.click()}
			>
				<input
					ref={inputRef}
					type="file"
					accept={ACCEPTED}
					onChange={onInputChange}
					style={{ display: 'none' }}
				/>
				{isParsing ? (
					<>
						<p>Parsing…</p>
						<progress value={progress} max={1} style={{ width: '100%' }} />
						<p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
							{Math.round(progress * 100)}%
						</p>
					</>
				) : (
					<>
						<p>Drag &amp; drop NDJSON file here</p>
						<p>or click to select</p>
					</>
				)}
			</div>
			{status === 'error' && (
				<p style={{ color: '#ef4444', fontSize: '0.875rem' }}>
					Failed to parse file. Check format and try again.
				</p>
			)}
		</section>
	)
}