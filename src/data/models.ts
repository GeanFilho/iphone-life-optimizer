// Fontes: apple.com/iphone/compare, support.apple.com/108055 (limite de carga), cobertura de lançamento do 17e e do 18 Pro.
export type Feature =
  | 'island' // Dynamic Island (sem ela = notch)
  | 'promotion' // tela até 120 Hz
  | 'alwaysOn'
  | 'actionButton' // sem ele = chave de silenciar
  | 'cameraControl'
  | 'chargeLimit' // limite de carga 80–100% + ciclos em Saúde da Bateria (iPhone 15+)
  | 'appleIntelligence'
  | 'usbc'
  | 'magsafe'

export type Cameras = 'dual-diagonal' | 'dual-vertical' | 'triple' | 'single' | 'plateau-single' | 'plateau-triple'

export type Model = {
  id: string
  name: string
  year: number
  size: 'mini' | 'regular' | 'large'
  finish: 'aluminum' | 'steel' | 'titanium'
  cameras: Cameras
  features: Feature[]
}

const base: Feature[] = ['magsafe']
const iphone15: Feature[] = [...base, 'island', 'chargeLimit', 'usbc']
const pro15: Feature[] = [...iphone15, 'promotion', 'alwaysOn', 'actionButton', 'appleIntelligence']
const iphone16: Feature[] = [...iphone15, 'actionButton', 'cameraControl', 'appleIntelligence']
const pro16: Feature[] = [...iphone16, 'promotion', 'alwaysOn']
const e: Feature[] = ['chargeLimit', 'usbc', 'actionButton', 'appleIntelligence']

export const models: Model[] = [
  { id: 'iphone-13-mini', name: 'iPhone 13 mini', year: 2021, size: 'mini', finish: 'aluminum', cameras: 'dual-diagonal', features: base },
  { id: 'iphone-13', name: 'iPhone 13', year: 2021, size: 'regular', finish: 'aluminum', cameras: 'dual-diagonal', features: base },
  { id: 'iphone-13-pro', name: 'iPhone 13 Pro', year: 2021, size: 'regular', finish: 'steel', cameras: 'triple', features: [...base, 'promotion'] },
  { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', year: 2021, size: 'large', finish: 'steel', cameras: 'triple', features: [...base, 'promotion'] },
  { id: 'iphone-14', name: 'iPhone 14', year: 2022, size: 'regular', finish: 'aluminum', cameras: 'dual-diagonal', features: base },
  { id: 'iphone-14-plus', name: 'iPhone 14 Plus', year: 2022, size: 'large', finish: 'aluminum', cameras: 'dual-diagonal', features: base },
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', year: 2022, size: 'regular', finish: 'steel', cameras: 'triple', features: [...base, 'island', 'promotion', 'alwaysOn'] },
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', year: 2022, size: 'large', finish: 'steel', cameras: 'triple', features: [...base, 'island', 'promotion', 'alwaysOn'] },
  { id: 'iphone-15', name: 'iPhone 15', year: 2023, size: 'regular', finish: 'aluminum', cameras: 'dual-diagonal', features: iphone15 },
  { id: 'iphone-15-plus', name: 'iPhone 15 Plus', year: 2023, size: 'large', finish: 'aluminum', cameras: 'dual-diagonal', features: iphone15 },
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', year: 2023, size: 'regular', finish: 'titanium', cameras: 'triple', features: pro15 },
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', year: 2023, size: 'large', finish: 'titanium', cameras: 'triple', features: pro15 },
  { id: 'iphone-16', name: 'iPhone 16', year: 2024, size: 'regular', finish: 'aluminum', cameras: 'dual-vertical', features: iphone16 },
  { id: 'iphone-16-plus', name: 'iPhone 16 Plus', year: 2024, size: 'large', finish: 'aluminum', cameras: 'dual-vertical', features: iphone16 },
  { id: 'iphone-16-pro', name: 'iPhone 16 Pro', year: 2024, size: 'regular', finish: 'titanium', cameras: 'triple', features: pro16 },
  { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', year: 2024, size: 'large', finish: 'titanium', cameras: 'triple', features: pro16 },
  { id: 'iphone-16e', name: 'iPhone 16e', year: 2025, size: 'regular', finish: 'aluminum', cameras: 'single', features: e },
  { id: 'iphone-17', name: 'iPhone 17', year: 2025, size: 'regular', finish: 'aluminum', cameras: 'dual-vertical', features: pro16 },
  { id: 'iphone-air', name: 'iPhone Air', year: 2025, size: 'large', finish: 'titanium', cameras: 'plateau-single', features: pro16 },
  { id: 'iphone-17-pro', name: 'iPhone 17 Pro', year: 2025, size: 'regular', finish: 'aluminum', cameras: 'plateau-triple', features: pro16 },
  { id: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max', year: 2025, size: 'large', finish: 'aluminum', cameras: 'plateau-triple', features: pro16 },
  { id: 'iphone-17e', name: 'iPhone 17e', year: 2026, size: 'regular', finish: 'aluminum', cameras: 'single', features: [...e, 'magsafe'] },
  { id: 'iphone-18-pro', name: 'iPhone 18 Pro', year: 2026, size: 'regular', finish: 'aluminum', cameras: 'plateau-triple', features: pro16 },
  { id: 'iphone-18-pro-max', name: 'iPhone 18 Pro Max', year: 2026, size: 'large', finish: 'aluminum', cameras: 'plateau-triple', features: pro16 },
]

export const featureLabels: Record<Feature, string> = {
  island: 'Dynamic Island',
  promotion: 'ProMotion 120 Hz',
  alwaysOn: 'Tela Sempre Ativa',
  actionButton: 'Botão de Ação',
  cameraControl: 'Controle da Câmera',
  chargeLimit: 'Limite de carga',
  appleIntelligence: 'Apple Intelligence',
  usbc: 'USB‑C',
  magsafe: 'MagSafe',
}
