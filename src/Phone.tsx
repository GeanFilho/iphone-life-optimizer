import { useEffect, useRef, type ReactNode } from 'react'
import type { Model } from './data/models.ts'

const lenses: Record<Model['cameras'], number> = {
  'dual-diagonal': 2,
  'dual-vertical': 2,
  triple: 3,
  single: 1,
  'plateau-single': 1,
  'plateau-triple': 3,
}

// Tilt segue o ponteiro só em telas com mouse e sem "reduzir movimento"; no resto, o aparelho fica estático (fallback).
function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = e.clientX / innerWidth - 0.5
        const y = e.clientY / innerHeight - 0.5
        el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${(x * 16).toFixed(2)}deg`)
        el.style.setProperty('--gx', `${50 + x * 60}%`)
        el.style.setProperty('--gy', `${50 + y * 60}%`)
      })
    }
    addEventListener('pointermove', onMove)
    return () => (removeEventListener('pointermove', onMove), cancelAnimationFrame(frame))
  }, [ref])
}

// ponytail: o Firefox entrega o wheel mas não rola a tela dentro do aparelho em 3D.
// Se a rolagem nativa não andou em 2 frames, rolamos na mão; no Chrome isso nunca dispara.
function useWheelFallback(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      const sc = el.querySelector<HTMLElement>('.screen-content')
      if (!sc) return
      const before = sc.scrollTop
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? sc.clientHeight : 1)
      requestAnimationFrame(() => requestAnimationFrame(() => sc.scrollTop === before && sc.scrollBy({ top: dy })))
    }
    el.addEventListener('wheel', onWheel, { passive: true })
    return () => el.removeEventListener('wheel', onWheel)
  }, [ref])
}

export function Phone({ model, flipped, children }: { model: Model; flipped: boolean; children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  useTilt(stage)
  useWheelFallback(screen)
  const has = (f: Model['features'][number]) => model.features.includes(f)

  return (
    <div ref={stage} className="phone-stage">
      <div className="phone-float">
        <div
          className={`phone size-${model.size} finish-${model.finish}`}
          data-flipped={flipped || undefined}
          role="region"
          aria-label={`${model.name} interativo`}
        >
          {/* botões laterais */}
          <span className={`btn btn-left-top ${has('actionButton') ? 'action' : 'mute'}`} />
          <span className="btn btn-vol-up" />
          <span className="btn btn-vol-down" />
          <span className="btn btn-side" />
          {has('cameraControl') && <span className="btn btn-camera-control" />}

          <div className="face front">
            <div className="screen" ref={screen}>
              <div className={has('island') ? 'island' : 'notch'} aria-hidden />
              {children}
              <div className="glare" aria-hidden />
            </div>
          </div>

          <div className="face back" aria-hidden>
            <div className={`cam cam-${model.cameras}`}>
              {Array.from({ length: lenses[model.cameras] }, (_, i) => (
                <span key={i} className="lens" />
              ))}
              <span className="flash" />
            </div>
            <span className="back-name">{model.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
