# iPhone Life Optimizer

Guia interativo, em português, para revisar os Ajustes do iPhone (13 ao 18 Pro) e preservar bateria, desempenho e vida útil. O app orienta; ele não altera nada no aparelho.

- Stack: Vite + React + TypeScript + Tailwind. iPhone desenhado em CSS 3D, sem WebGL.
- Dados: `src/data/models.ts` (recursos de hardware por modelo) e `src/data/settings.ts` (recomendações com `requires`/`lacks`).
- Progresso salvo em `localStorage`.

```sh
npm i && npm run build && npm test
```
