import { RotateCcw, Repeat2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { featureLabels, models } from './data/models.ts'
import { sections, settings, settingsFor, type SectionId } from './data/settings.ts'
import { Phone } from './Phone.tsx'
import { DetailScreen, HomeScreen, PlanScreen, SectionScreen, SetupScreen, StatusBar } from './screens.tsx'
import { go, rememberModel, resetProgress, useProgress, useRoute } from './store.ts'

const fallbackModel = models.find((m) => m.id === 'iphone-17-pro')!

export default function App() {
  const route = useRoute()
  const [flipped, setFlipped] = useState(false)
  const model = models.find((m) => m.id === route[0])
  const progress = useProgress(model?.id ?? '')
  const items = model ? settingsFor(model) : []
  const done = items.filter((s) => progress[s.id]).length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0

  useEffect(() => {
    if (model) rememberModel(model.id)
  }, [model])

  const [, a, b] = route
  const sectionId = sections.some((s) => s.id === a) ? (a as SectionId) : undefined
  const detail = b ? settings.find((s) => s.id === b && items.includes(s)) : undefined
  const ctx = { model: model ?? fallbackModel, items, progress }

  let screen
  if (!model) screen = <SetupScreen />
  else if (detail) screen = <DetailScreen {...ctx} s={detail} backLabel={a === 'plano' ? 'Plano' : sections.find((s) => s.id === a)?.title ?? 'Voltar'} />
  else if (a === 'plano') screen = <PlanScreen {...ctx} />
  else if (sectionId) screen = <SectionScreen {...ctx} id={sectionId} />
  else screen = <HomeScreen {...ctx} />

  const shown = model ?? fallbackModel

  return (
    <div className="mx-auto grid min-h-dvh max-w-6xl items-center gap-x-16 gap-y-8 px-4 py-8 lg:grid-cols-[1fr_auto] lg:px-10">
      <aside className="order-2 mx-auto w-full max-w-md lg:order-1 lg:mx-0">
        <p className="text-[12px] font-semibold uppercase tracking-[.2em] text-white/40">iPhone Life Optimizer</p>
        <h1 className="mt-3 text-balance text-[34px] font-semibold leading-[1.1] tracking-tight lg:text-[46px]">
          Ajustes que valem a pena.
          <span className="block text-white/40">Sem mitos.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/60">
          Explore o aparelho e revise, um a um, os ajustes que preservam a bateria, o desempenho e a vida útil do seu iPhone.
        </p>

        <label className="mt-8 block text-[12px] font-semibold uppercase tracking-wider text-white/40" htmlFor="model">
          Modelo
        </label>
        <div className="select-wrap mt-2">
          <select id="model" value={model?.id ?? ''} onChange={(e) => go(e.target.value ? [e.target.value] : [], true)}>
            <option value="">{model ? 'Ver todos os modelos' : 'Escolha seu iPhone'}</option>
            {[...models].reverse().map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Recursos do modelo">
          {shown.features.map((f) => (
            <li key={f} className="chip">{featureLabels[f]}</li>
          ))}
        </ul>

        {model && (
          <div className="mt-8">
            <div className="flex items-baseline justify-between text-[13px]">
              <span className="text-white/60">Progresso geral</span>
              <span className="tabular-nums">{done} / {items.length}</span>
            </div>
            <div className="progress mt-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso da otimização">
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button className="ghost-btn" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}>
            <Repeat2 size={15} /> {flipped ? 'Ver a frente' : 'Ver a traseira'}
          </button>
          {model && done > 0 && (
            <button className="ghost-btn" onClick={() => confirm(`Apagar o progresso do ${model.name}?`) && resetProgress(model.id)}>
              <RotateCcw size={15} /> Redefinir progresso
            </button>
          )}
        </div>

        <p className="mt-8 border-t border-white/10 pt-5 text-[12px] leading-relaxed text-white/40">
          Este guia não altera nenhuma configuração do seu iPhone: todas as mudanças são feitas por você, em Ajustes. As recomendações consideram o
          iOS 26 e 27. Os nomes dos menus podem variar levemente entre versões. Itens marcados como “Fonte oficial Apple” têm link para a
          documentação; os demais são boas práticas técnicas. O progresso fica salvo apenas neste navegador.
        </p>
      </aside>

      <main className="order-1 lg:order-2">
        <Phone model={shown} flipped={flipped}>
          <StatusBar pct={pct} />
          <div className="screen-content" key={route.join('/')}>
            {screen}
          </div>
        </Phone>
      </main>
    </div>
  )
}
