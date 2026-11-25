import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import { getMedications } from '../data/medications'
import { useI18n } from '../i18n/LanguageContext'
import { findByCode } from '../lib/search'
import { links, navigate } from '../lib/router'
import { BackLink, BarcodeIcon, btn, CameraIcon, Card, KeyboardIcon, PageTitle } from '../components/ui'

/*
 * Step S1 – camera barcode / QR scan (ZXing library, runs fully in the browser, works offline).
 * - Barcode (EAN-13) → exact match in the product database → product page (implicit confirmation)
 * - QR code from the printout (UC2) → opens the read-aloud page
 * - No match → "not found" (never a similar product)
 * Fallbacks (switching modality): photo of the barcode, type the name, photo of the blister.
 */
export function Scan() {
  const { t, lang } = useI18n()
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const [state, setState] = useState<'idle' | 'starting' | 'running' | 'reading'>('idle')
  const [message, setMessage] = useState<{ kind: 'error' | 'info'; text: string } | null>(null)

  const handleResult = (text: string) => {
    // A QR code from our printout contains a link to the read-aloud page.
    const hashIndex = text.indexOf('#/med/')
    if (hashIndex >= 0) {
      stopCamera()
      navigate(text.slice(hashIndex))
      return true
    }
    const med = findByCode(getMedications(lang), text)
    if (med) {
      stopCamera()
      navigate(links.overview(med.id, 'scan'))
      return true
    }
    setMessage({ kind: 'error', text: t.scan.notFound(text) })
    return false
  }

  const stopCamera = () => {
    controlsRef.current?.stop()
    controlsRef.current = null
    setState('idle')
  }

  const startCamera = async () => {
    setMessage(null)
    setState('starting')
    try {
      const reader = new BrowserMultiFormatReader()
      let lastWrong = ''
      controlsRef.current = await reader.decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
        if (!result) return
        const text = result.getText()
        if (text === lastWrong) return // do not repeat the same "not found" message
        if (!handleResult(text)) lastWrong = text
      })
      setState('running')
    } catch {
      setState('idle')
      setMessage({ kind: 'error', text: t.scan.cameraError })
    }
  }

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    stopCamera()
    setMessage({ kind: 'info', text: t.scan.reading })
    setState('reading')
    const url = URL.createObjectURL(file)
    try {
      const result = await new BrowserMultiFormatReader().decodeFromImageUrl(url)
      setMessage(null)
      handleResult(result.getText())
    } catch {
      setMessage({ kind: 'error', text: t.scan.notReadable })
    } finally {
      URL.revokeObjectURL(url)
      setState('idle')
    }
  }

  // Always release the camera when leaving the page.
  useEffect(() => () => controlsRef.current?.stop(), [])

  return (
    <div className="space-y-6">
      <BackLink href={links.home()}>{t.product.back}</BackLink>
      <div className="space-y-1">
        <PageTitle>{t.scan.title}</PageTitle>
        <p className="text-slate-600">{t.scan.intro}</p>
      </div>

      <Card className="overflow-hidden">
        <div className="relative aspect-[4/3] w-full bg-slate-900 sm:aspect-video">
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline aria-hidden="true" />
          {state !== 'running' && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-slate-200">
              <div className="space-y-3">
                <BarcodeIcon className="mx-auto size-16 opacity-80" />
                <p>{state === 'starting' ? t.scan.starting : t.scan.intro}</p>
              </div>
            </div>
          )}
          {state === 'running' && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-[12%] inset-y-[30%] rounded-xl border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          )}
        </div>
        <div className="flex flex-wrap gap-3 p-4">
          {state === 'running' ? (
            <button type="button" onClick={stopCamera} className={btn.secondary}>{t.scan.stop}</button>
          ) : (
            <button type="button" onClick={startCamera} disabled={state === 'starting' || state === 'reading'} className={`${btn.primary} py-4 text-lg`}>
              <CameraIcon className="size-6" /> {t.scan.start}
            </button>
          )}
          <label className={`${btn.secondary} cursor-pointer`}>
            <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
            {t.scan.upload}
          </label>
        </div>
        <p className="px-4 pb-4 text-sm text-slate-500">{t.scan.privacy}</p>
      </Card>

      {message && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className={`rounded-xl p-4 font-medium ${message.kind === 'error' ? 'bg-rose-50 text-rose-900' : 'bg-slate-100 text-slate-800'}`}>
          {message.text}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <a href={links.home()} onClick={() => setTimeout(() => document.getElementById('home-search')?.focus(), 50)} className={btn.secondary}>
          <KeyboardIcon className="size-5" /> {t.scan.typeInstead}
        </a>
        <a href={links.photo()} className={btn.secondary}>
          <CameraIcon className="size-5" /> {t.scan.photoInstead}
        </a>
      </div>
    </div>
  )
}
