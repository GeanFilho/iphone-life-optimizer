import { test } from 'node:test'
import assert from 'node:assert/strict'
import { models } from './models.ts'
import { sections, settings, settingsFor } from './settings.ts'

const byId = (id: string) => models.find((m) => m.id === id)!
const ids = (id: string) => settingsFor(byId(id)).map((s) => s.id)

test('ids únicos e seções válidas', () => {
  assert.equal(new Set(settings.map((s) => s.id)).size, settings.length)
  assert.equal(new Set(models.map((m) => m.id)).size, models.length)
  for (const s of settings) assert.ok(sections.some((x) => x.id === s.section), s.id)
})

test('filtro por recurso de hardware', () => {
  assert.ok(ids('iphone-13').includes('optimized-charging'))
  assert.ok(!ids('iphone-13').includes('charge-limit'))
  assert.ok(ids('iphone-15').includes('charge-limit'))
  assert.ok(!ids('iphone-15').includes('optimized-charging'))
  assert.ok(!ids('iphone-15').includes('adaptive-power')) // 15 base não tem Apple Intelligence
  assert.ok(ids('iphone-15-pro').includes('adaptive-power'))
  assert.ok(ids('iphone-14-pro').includes('always-on'))
  assert.ok(!ids('iphone-17e').includes('always-on'))
})

test('todo modelo tem conteúdo em todas as seções', () => {
  for (const m of models)
    for (const sec of sections) assert.ok(settingsFor(m).some((s) => s.section === sec.id), `${m.id}/${sec.id}`)
})
