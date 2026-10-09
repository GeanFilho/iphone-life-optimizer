import { useSyncExternalStore } from 'react'

// ── Rota (hash) ── #/modelo · #/modelo/secao · #/modelo/secao/ajuste · #/modelo/plano[/ajuste]
const parse = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
let route = parse()
const LAST = 'ilo-last-model'
try {
  const last = localStorage.getItem(LAST)
  if (!route.length && last) {
    route = [last]
    history.replaceState(null, '', '#/' + last)
  }
} catch {
  /* sem storage: começa na escolha de modelo */
}
export const rememberModel = (id: string) => {
  try {
    localStorage.setItem(LAST, id)
  } catch {
    /* ok */
  }
}
const routeSubs = new Set<() => void>()

function commit(next: string[]) {
  // direção da animação de entrada da tela (ver .screen-content no CSS)
  document.documentElement.dataset.nav = next.length >= route.length ? 'forward' : 'back'
  route = next
  routeSubs.forEach((f) => f())
}

export function go(parts: string[], replace = false) {
  const url = '#/' + parts.join('/')
  if (replace) history.replaceState({ inApp: history.state?.inApp }, '', url)
  else history.pushState({ inApp: true }, '', url)
  commit(parts)
}

// Volta pelo histórico quando a navegação começou no app; senão sobe um nível (deep link).
export function back() {
  if (history.state?.inApp) history.back()
  else go(route.slice(0, -1), true)
}

addEventListener('popstate', () => commit(parse()))

export const useRoute = () =>
  useSyncExternalStore(
    (f) => (routeSubs.add(f), () => routeSubs.delete(f)),
    () => route,
  )

// ── Progresso (localStorage) ──
export type Status = 'done' | 'skipped'
type Progress = Record<string, Record<string, Status>>
const KEY = 'ilo-progress-v1'

let progress: Progress = (() => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
})()
const progressSubs = new Set<() => void>()
const EMPTY: Record<string, Status> = {}

function save(next: Progress) {
  progress = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* modo privado: progresso vale só nesta sessão */
  }
  progressSubs.forEach((f) => f())
}

export function setStatus(model: string, id: string, status: Status | null) {
  const forModel = { ...progress[model] }
  if (status) forModel[id] = status
  else delete forModel[id]
  save({ ...progress, [model]: forModel })
}

export const resetProgress = (model: string) => save({ ...progress, [model]: {} })

export const useProgress = (model: string) =>
  useSyncExternalStore(
    (f) => (progressSubs.add(f), () => progressSubs.delete(f)),
    () => progress[model] ?? EMPTY,
  )
