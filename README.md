# iPhone Life Optimizer

Guia interativo, em português, para revisar os Ajustes do iPhone e preservar bateria, desempenho e vida útil.

**🔗 https://iphone-life-optimizer.vercel.app**

O próprio iPhone é a interface: você escolhe seu modelo, toca nos "apps" da tela e descobre o que vale ativar, desativar ou manter. O app **não altera nada no aparelho**: as mudanças são feitas por você, em Ajustes.

## O que ele faz

- **24 modelos**, do iPhone 13 ao 18 Pro Max, cada um com seu hardware: notch ou Dynamic Island, chave de silenciar ou botão de Ação, Controle da Câmera, câmeras da traseira e tamanho.
- **Recomendações filtradas por modelo**, que só aparecem onde o recurso existe. Por exemplo, o limite de carga só vale do iPhone 15 em diante, e a Tela Sempre Ativa só nos modelos que a têm.
- **7 áreas**: Bateria, Tela e Brilho, Privacidade, Desempenho, Conectividade, Notificações e Segurança. Há ainda um **Plano** com tudo ordenado por prioridade.
- **Cada ajuste explica**:
  - onde fica no iPhone, o que faz e a recomendação;
  - benefícios, desvantagens e impacto esperado;
  - passo a passo e a fonte.
- **Progresso**: cada item pode ser marcado como concluído, ignorado ou pendente. Fica salvo no navegador.
- **Sem mitos**: nenhum percentual de economia inventado. Cada item indica se é **fonte oficial Apple** (com link) ou **boa prática** técnica.

## Stack

| | |
|---|---|
| Interface | React 19 + TypeScript |
| Build | Vite |
| Estilo | Tailwind CSS 4 + CSS próprio |
| Ícones | lucide-react |
| Deploy | Vercel (push na `main` publica) |

O iPhone é desenhado **só com CSS 3D**, sem imagens nem WebGL. Assim a tela do telefone é HTML de verdade: clicável, rolável e acessível. Navegação (hash + History API), progresso (`localStorage`) e animações usam recursos nativos do navegador, sem roteador nem gerenciador de estado.

## Rodando

```sh
npm install
npm run dev     # desenvolvimento
npm run build   # build de produção em dist/
npm test        # testes dos dados (node:test)
```

Requer Node 22.6 ou superior: os testes rodam TypeScript direto, com `--experimental-strip-types`.

## Estrutura

```
src/
├── data/
│   ├── models.ts      # modelos e seus recursos de hardware
│   ├── settings.ts    # seções, recomendações e o filtro por modelo
│   └── data.test.ts   # testes do filtro e da integridade dos dados
├── Phone.tsx          # o aparelho em 3D, inclinação e rolagem
├── screens.tsx        # telas internas: Olá, Início, Seção, Detalhe, Plano
├── store.ts           # rotas (hash) e progresso (localStorage)
├── App.tsx            # página: texto, seletor de modelo e progresso
└── index.css          # tema, telefone e visual iOS
```

## Adicionando conteúdo

### Um novo modelo

Em `src/data/models.ts`, adicione uma linha em `models`:

```ts
{ id: 'iphone-19', name: 'iPhone 19', year: 2027, size: 'regular', finish: 'aluminum',
  cameras: 'dual-vertical', features: ['island', 'promotion', 'alwaysOn', 'actionButton', 'cameraControl', 'chargeLimit', 'appleIntelligence', 'usbc', 'magsafe'] },
```

O visual (tamanho, câmeras, botões) e as recomendações se ajustam pelos campos. Não é preciso mexer em componente nenhum.

### Uma nova recomendação

Em `src/data/settings.ts`, adicione um item em `settings`. Para limitá-lo a certos aparelhos, use `requires` (o modelo precisa ter o recurso) ou `lacks` (o modelo não pode ter):

```ts
{
  id: 'meu-ajuste',
  section: 'battery',
  title: 'Nome do ajuste',
  summary: 'Uma linha para a lista.',
  path: ['Ajustes', 'Bateria'],          // omita se for um hábito, não um ajuste
  verdict: 'ativar',                     // ativar | desativar | manter | avaliar | habito
  priority: 2,                           // 1 alta · 2 média · 3 baixa
  what: '…', why: '…',
  pros: ['…'], cons: ['…'],
  impact: { bateria: '…' },
  steps: ['Abra Ajustes.', '…'],
  requires: ['chargeLimit'],
  availability: 'iPhone 15 e posteriores.',
  evidence: 'oficial',                   // oficial (documentado pela Apple) | geral (boa prática)
  source: 'https://support.apple.com/pt-br/…',
},
```

Rode `npm test`: ele confere IDs únicos, seções válidas e se todo modelo tem conteúdo em todas as seções.

## Precisão

- Os nomes de menus seguem o iOS 26/27 em português e foram conferidos nas páginas de suporte da Apple sempre que possível. Eles podem variar levemente entre versões.
- Todos os links de fonte foram verificados.
- Achou algo errado ou desatualizado? Abra uma issue com o modelo, a versão do iOS e o que aparece no seu aparelho.

## Observações técnicas

- **Firefox:** o Firefox não rola a tela dentro do aparelho em 3D com a roda do mouse. Nesse navegador a rolagem é feita manualmente (`useWheelFallback` em `Phone.tsx`).
- **Movimento reduzido:** com "reduzir movimento" ativado no sistema, a inclinação e as animações são desligadas.
- Nas telas de toque, o aparelho fica estático, sem inclinação.

---

Projeto independente, sem afiliação com a Apple. iPhone e iOS são marcas da Apple Inc.
