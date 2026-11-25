import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import type { Medication } from '../data/types'
import { ean13Modules } from '../lib/barcode'

/*
 * Drawn pictures used by the prototype (no real photos):
 *  - PackagePhoto: picture of the medicine box shown in search results (step S1: "photo of the pack")
 *  - Ean13Barcode / BlisterPicture / QrPicture: demo codes to try the scanner and the blister photo
 */

export function PackagePhoto({ med, className = 'w-40' }: { med: Medication; className?: string }) {
  return (
    <svg viewBox="0 0 200 130" role="img" aria-label={`${med.name} ${med.strength}`} className={`no-invert h-auto ${className}`}>
      <defs>
        <linearGradient id={`side-${med.id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      {/* box: front + top + side for a simple 3D look */}
      <polygon points="20,30 160,30 180,15 40,15" fill="#f1f5f9" stroke="#94a3b8" />
      <polygon points="160,30 180,15 180,105 160,120" fill={`url(#side-${med.id})`} stroke="#94a3b8" />
      <rect x="20" y="30" width="140" height="90" fill="#ffffff" stroke="#94a3b8" />
      <rect x="20" y="30" width="140" height="22" fill={med.packColor} />
      <text x="28" y="46" fontSize="13" fontWeight="700" fill="#ffffff" fontFamily="system-ui, sans-serif">{med.name}</text>
      <text x="28" y="72" fontSize="15" fontWeight="700" fill="#0f172a" fontFamily="system-ui, sans-serif">{med.strength}</text>
      <text x="28" y="88" fontSize="8.5" fill="#334155" fontFamily="system-ui, sans-serif">{med.form.slice(0, 30)}</text>
      <rect x="28" y="96" width="44" height="14" rx="2" fill="none" stroke={med.packColor} />
      <text x="33" y="106" fontSize="8" fontWeight="700" fill={med.packColor} fontFamily="system-ui, sans-serif">DEMO</text>
      {/* small barcode stripes on the box */}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={110 + i * 3} y="94" width={i % 3 === 0 ? 2 : 1} height="18" fill="#0f172a" />
      ))}
    </svg>
  )
}

/** EAN-13 barcode as SVG (scannable). */
export function Ean13Barcode({ code, className = 'w-56' }: { code: string; className?: string }) {
  const modules = ean13Modules(code)
  const quiet = 11
  const width = modules.length + quiet * 2
  return (
    <svg viewBox={`0 0 ${width} 70`} role="img" aria-label={`Barcode ${code}`} className={`no-invert h-auto bg-white ${className}`} shapeRendering="crispEdges">
      <rect width={width} height="70" fill="#ffffff" />
      {modules.split('').map((bit, i) =>
        bit === '1' ? <rect key={i} x={quiet + i} y="4" width="1" height={isGuard(i) ? 58 : 52} fill="#000000" /> : null,
      )}
      <text x={width / 2} y="68" fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace" fill="#000000">{code}</text>
    </svg>
  )
}

const isGuard = (i: number) => i < 3 || (i >= 45 && i < 50) || i >= 92

/** Blister strip with the product name printed on it (for the "photo of the blister" demo). */
export function BlisterPicture({ text, className = 'w-64' }: { text: string; className?: string }) {
  return (
    <svg viewBox="0 0 320 150" role="img" aria-label={text} className={`no-invert h-auto ${className}`}>
      <rect width="320" height="150" rx="10" fill="#e5e7eb" stroke="#9ca3af" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <ellipse cx={40 + i * 60} cy="45" rx="20" ry="14" fill="#f8fafc" stroke="#9ca3af" />
          <ellipse cx={40 + i * 60} cy="45" rx="12" ry="7" fill="#ffffff" />
        </g>
      ))}
      <rect x="14" y="80" width="292" height="56" rx="6" fill="#ffffff" />
      <text x="160" y="118" fontSize="30" fontWeight="800" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">{text}</text>
    </svg>
  )
}

/** QR code (as SVG, generated in the browser – no internet needed). */
export function QrPicture({ value, className = 'w-40', label }: { value: string; className?: string; label: string }) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    let alive = true
    QRCode.toString(value, { type: 'svg', margin: 2, errorCorrectionLevel: 'M' }).then((s) => alive && setSvg(s))
    return () => {
      alive = false
    }
  }, [value])
  return <div role="img" aria-label={label} className={`no-invert bg-white ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />
}

/** Save an on-screen SVG as a PNG file (used on the demo page). */
export async function downloadSvgAsPng(svgElement: SVGElement | null, filename: string, scale = 4): Promise<void> {
  if (!svgElement) return
  const xml = new XMLSerializer().serializeToString(svgElement)
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = svgUrl
  })
  const vb = (svgElement as SVGSVGElement).viewBox?.baseVal
  const w = (vb?.width || img.width) * scale
  const h = (vb?.height || img.height) * scale
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(img, 0, 0, w, h)
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = filename
  a.click()
}
