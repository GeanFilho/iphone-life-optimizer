import {
  BatteryMedium, Bell, Check, ChevronLeft, ChevronRight, CircleDashed, ExternalLink, Gauge, Hand, ListChecks, Minus, ShieldCheck, SunMedium, Wifi,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { models, type Model } from './data/models.ts'
import { priorityLabels, sections, verdictLabels, type SectionId, type Setting } from './data/settings.ts'
import { back, go, setStatus, type Status } from './store.ts'

export const sectionIcons: Record<SectionId, LucideIcon> = {
  battery: BatteryMedium,
  display: SunMedium,
  privacy: Hand,
  performance: Gauge,
  connectivity: Wifi,
  notifications: Bell,
  security: ShieldCheck,
}

type Ctx = { model: Model; items: Setting[]; progress: Record<string, Status> }

const reviewed = (items: Setting[], p: Ctx['progress']) => items.filter((s) => p[s.id]).length

// ── peças comuns ─────────────────────────────────────────────
export function StatusBar({ pct }: { pct: number }) {
  return (
    <div className="status-bar" aria-hidden>
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <Wifi size={14} strokeWidth={2.5} />
        <span className="sb-battery">
          <span style={{ width: `${Math.max(pct, 6)}%` }} />
        </span>
      </span>
    </div>
  )
}

function NavBar({ label }: { label: string }) {
  return (
    <button className="nav-back" onClick={back}>
      <ChevronLeft size={22} strokeWidth={2.5} />
      {label}
    </button>
  )
}

function StatusIcon({ status }: { status?: Status }) {
  if (status === 'done') return <span className="st st-done" aria-label="Concluído"><Check size={12} strokeWidth={3.5} /></span>
  if (status === 'skipped') return <span className="st st-skipped" aria-label="Ignorado"><Minus size={12} strokeWidth={3.5} /></span>
  return <span className="st st-pending" aria-label="Pendente" />
}

function Priority({ p }: { p: 1 | 2 | 3 }) {
  return (
    <span className="prio" aria-label={`Prioridade ${priorityLabels[p].toLowerCase()}`} title={`Prioridade ${priorityLabels[p]}`}>
      {[1, 2, 3].map((i) => (
        <i key={i} data-on={i <= 4 - p || undefined} />
      ))}
    </span>
  )
}

function Row({ s, status, to, showSection }: { s: Setting; status?: Status; to: string[]; showSection?: boolean }) {
  return (
    <li>
      <button className="row" onClick={() => go(to)}>
        <StatusIcon status={status} />
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate font-medium">{s.title}</span>
          <span className="block text-[13px] leading-snug text-white/50">
            {showSection ? `${sections.find((x) => x.id === s.section)!.title} · ` : ''}
            {s.summary}
          </span>
        </span>
        <Priority p={s.priority} />
        <ChevronRight size={16} className="shrink-0 text-white/30" />
      </button>
    </li>
  )
}

// ── telas ────────────────────────────────────────────────────
export function SetupScreen() {
  const years = [...new Set(models.map((m) => m.year))].reverse()
  return (
    <div className="px-5 pb-10 pt-16">
      <h1 className="text-[34px] font-bold tracking-tight">Olá</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-white/60">
        Qual é o seu iPhone? As recomendações se adaptam ao hardware de cada modelo.
      </p>
      {years.map((y) => (
        <section key={y} className="mt-6">
          <h2 className="group-title">{y}</h2>
          <ul className="group">
            {models
              .filter((m) => m.year === y)
              .map((m) => (
                <li key={m.id}>
                  <button className="row" onClick={() => go([m.id])}>
                    <span className="flex-1 text-left font-medium">{m.name}</span>
                    <ChevronRight size={16} className="text-white/30" />
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ))}
      <p className="mt-6 text-center text-[12px] text-white/40">Este guia não altera nada no seu aparelho.</p>
    </div>
  )
}

export function HomeScreen({ model, items, progress }: Ctx) {
  const done = reviewed(items, progress)
  const pct = Math.round((done / items.length) * 100)
  return (
    <div className="home px-5 pb-8 pt-14">
      <button className="widget" onClick={() => go([model.id, 'plano'])}>
        <svg viewBox="0 0 36 36" className="size-[76px] -rotate-90" aria-hidden>
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(255 255 255 / .12)" strokeWidth="3.5" />
          <circle
            cx="18" cy="18" r="15.5" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 97.4} 97.4`} className="transition-[stroke-dasharray] duration-700"
          />
        </svg>
        <span className="text-left">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/50">Otimização</span>
          <span className="block text-[28px] font-semibold leading-tight">{pct}%</span>
          <span className="block text-[13px] text-white/60">{done} de {items.length} revisados</span>
        </span>
      </button>

      <ul className="mt-7 grid grid-cols-4 gap-x-3 gap-y-5">
        {sections.map((sec) => {
          const Icon = sectionIcons[sec.id]
          const list = items.filter((s) => s.section === sec.id)
          const pending = list.length - reviewed(list, progress)
          return (
            <li key={sec.id}>
              <button className="app" onClick={() => go([model.id, sec.id])} aria-label={`${sec.title}, ${pending} pendentes`}>
                <span className="app-icon">
                  <Icon size={26} strokeWidth={1.75} />
                  {pending > 0 && <span className="badge">{pending}</span>}
                </span>
                <span className="app-label">{sec.short ?? sec.title}</span>
              </button>
            </li>
          )
        })}
        <li>
          <button className="app" onClick={() => go([model.id, 'plano'])}>
            <span className="app-icon app-icon-light">
              <ListChecks size={26} strokeWidth={1.75} />
            </span>
            <span className="app-label">Plano</span>
          </button>
        </li>
      </ul>

      <p className="mt-8 text-center text-[12px] leading-relaxed text-white/40">
        Toque em um app para explorar. Este guia orienta; quem muda os Ajustes é você.
      </p>
    </div>
  )
}

export function SectionScreen({ model, items, progress, id }: Ctx & { id: SectionId }) {
  const sec = sections.find((s) => s.id === id)!
  const list = items.filter((s) => s.section === id)
  return (
    <div className="pb-10">
      <NavBar label="Início" />
      <div className="px-5">
        <h1 className="text-[32px] font-bold tracking-tight">{sec.title}</h1>
        <p className="mt-1 text-[14px] text-white/55">{sec.blurb}</p>
        <p className="mt-3 text-[12px] font-medium uppercase tracking-wider text-white/40">
          {reviewed(list, progress)} de {list.length} revisados · {model.name}
        </p>
        <ul className="group mt-3">
          {list.map((s) => (
            <Row key={s.id} s={s} status={progress[s.id]} to={[model.id, id, s.id]} />
          ))}
        </ul>
        <Legend />
      </div>
    </div>
  )
}

function Legend() {
  return (
    <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/35">
      <Priority p={1} /> prioridade alta · <Priority p={3} /> baixa
    </p>
  )
}

export function PlanScreen({ model, items, progress }: Ctx) {
  const [onlyPending, setOnlyPending] = useState(true)
  const list = onlyPending ? items.filter((s) => !progress[s.id]) : items
  return (
    <div className="pb-10">
      <NavBar label="Início" />
      <div className="px-5">
        <h1 className="text-[32px] font-bold tracking-tight">Seu plano</h1>
        <p className="mt-1 text-[14px] text-white/55">Recomendações para o {model.name}, por prioridade.</p>
        <div className="segmented mt-4" role="tablist">
          {[true, false].map((v) => (
            <button key={String(v)} role="tab" aria-selected={onlyPending === v} onClick={() => setOnlyPending(v)}>
              {v ? 'Pendentes' : 'Todos'}
            </button>
          ))}
        </div>
        {([1, 2, 3] as const).map((p) => {
          const group = list.filter((s) => s.priority === p)
          if (!group.length) return null
          return (
            <section key={p} className="mt-5">
              <h2 className="group-title">Prioridade {priorityLabels[p].toLowerCase()}</h2>
              <ul className="group">
                {group.map((s) => (
                  <Row key={s.id} s={s} status={progress[s.id]} to={[model.id, 'plano', s.id]} showSection />
                ))}
              </ul>
            </section>
          )
        })}
        {!list.length && (
          <div className="mt-12 text-center">
            <Check className="mx-auto" size={40} />
            <p className="mt-3 font-semibold">Tudo revisado</p>
            <p className="mt-1 text-[14px] text-white/55">Volte de vez em quando: hábitos e atualizações do iOS mudam com o tempo.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const areaOrder = ['bateria', 'desempenho', 'privacidade', 'segurança', 'usabilidade'] as const

export function DetailScreen({ model, progress, s, backLabel }: Ctx & { s: Setting; backLabel: string }) {
  const status = progress[s.id]
  const mark = (v: Status | null) => setStatus(model.id, s.id, v)
  return (
    <div className="flex min-h-full flex-col">
      <NavBar label={backLabel} />
      <article className="flex-1 px-5 pb-6">
        <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-white/45">
          <span>Prioridade {priorityLabels[s.priority].toLowerCase()}</span>·
          <span>{s.evidence === 'oficial' ? 'Fonte oficial Apple' : 'Boa prática'}</span>
        </div>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight">{s.title}</h1>

        <div className={`verdict verdict-${s.verdict}`}>
          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-60">Recomendação</span>
          <span className="text-[19px] font-semibold">{verdictLabels[s.verdict]}</span>
        </div>

        {s.path ? (
          <ol className="crumbs" aria-label="Onde encontrar">
            {s.path.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-[13px] text-white/50">Não é um ajuste: é um hábito de uso.</p>
        )}

        <Block title="O que faz">{s.what}</Block>
        <Block title="Por que">{s.why}</Block>

        <div className="mt-5 grid gap-3">
          <ProsCons title="Benefícios" items={s.pros} sign="+" />
          <ProsCons title="Desvantagens" items={s.cons} sign="−" />
        </div>

        <h2 className="block-title">Impacto esperado</h2>
        <dl className="group">
          {areaOrder
            .filter((a) => s.impact[a])
            .map((a) => (
              <div key={a} className="px-4 py-2.5">
                <dt className="text-[12px] font-semibold uppercase tracking-wider text-white/45">{a}</dt>
                <dd className="text-[14px] leading-snug">{s.impact[a]}</dd>
              </div>
            ))}
        </dl>

        <h2 className="block-title">Passo a passo</h2>
        <ol className="steps">
          {s.steps.map((st) => (
            <li key={st}>{st}</li>
          ))}
        </ol>

        {s.availability && (
          <p className="note">
            <strong>Disponibilidade:</strong> {s.availability} Aparece aqui porque se aplica ao {model.name}.
          </p>
        )}
        {s.source && (
          <a className="source" href={s.source} target="_blank" rel="noreferrer">
            Ver documentação da Apple <ExternalLink size={13} />
          </a>
        )}
      </article>

      <div className="status-dock" role="group" aria-label="Marcar este ajuste">
        {(
          [
            ['done', 'Concluído', Check],
            ['skipped', 'Ignorado', Minus],
            [null, 'Pendente', CircleDashed],
          ] as const
        ).map(([v, label, Icon]) => (
          <button key={label} aria-pressed={(status ?? null) === v} onClick={() => mark(v)}>
            <Icon size={16} strokeWidth={2.5} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Block({ title, children }: { title: string; children: string }) {
  return (
    <>
      <h2 className="block-title">{title}</h2>
      <p className="text-[15px] leading-relaxed text-white/80">{children}</p>
    </>
  )
}

function ProsCons({ title, items, sign }: { title: string; items: string[]; sign: string }) {
  return (
    <div className="rounded-2xl bg-white/[.06] px-4 py-3">
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-white/45">{title}</h3>
      <ul className="mt-1.5 space-y-1">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-[14px] leading-snug">
            <span className="text-white/40">{sign}</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
