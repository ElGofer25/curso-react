# Apuntes — 01-first-steps

## Crear el proyecto

```bash
npm create vite        # React → TypeScript + React Compiler → ESLint
cd 01-first-steps      # npm siempre se ejecuta donde está el package.json
npm install
npm run dev
```

> **Problema conocido (nov 2026):** la plantilla trae `typescript ~7.0.x`, pero `typescript-eslint` solo acepta `<6.1.0`, así que `npm install` falla con `ERESOLVE` (conflicto de *peer dependencies*).
> **Solución:** en `package.json` cambia `"typescript"` a `"~6.0.0"` y vuelve a ejecutar `npm install`.
> Evita usar `--legacy-peer-deps`: ignora el conflicto, pero ESLint puede fallar después.

---

## Estructura de archivos

```
01-first-steps/
├── index.html            ← punto de entrada REAL de la app
├── src/                  ← tu código (lo que procesa Vite)
│   ├── main.tsx          ← monta React dentro de index.html
│   ├── App.tsx           ← componente raíz
│   ├── App.css           ← estilos del componente App
│   ├── index.css         ← estilos globales
│   └── assets/           ← imágenes que se IMPORTAN desde el código
├── public/               ← archivos estáticos que se sirven tal cual
├── package.json          ← dependencias y scripts
├── package-lock.json     ← versiones exactas instaladas
├── vite.config.ts        ← configuración de Vite (plugins)
├── eslint.config.js      ← reglas del linter
├── tsconfig.json         ← "índice" que apunta a los otros dos tsconfig
├── tsconfig.app.json     ← TypeScript para el código del navegador (src/)
├── tsconfig.node.json    ← TypeScript para archivos que corren en Node (vite.config.ts)
├── .gitignore
├── node_modules/         ← dependencias instaladas (no se tocan ni se suben a git)
└── dist/                 ← resultado de `npm run build` (generado)
```

### Flujo de arranque: cómo llega React a la pantalla

```
index.html  ──<script src="/src/main.tsx">──▶  main.tsx  ──render(<App />)──▶  App.tsx
   <div id="root">  ◀─────────── React pinta todo aquí dentro ───────────┘
```

1. El navegador carga **`index.html`**. Contiene un `<div id="root"></div>` vacío y un `<script type="module" src="/src/main.tsx">`.
2. **`main.tsx`** busca ese div y crea ahí la raíz de React:
   ```tsx
   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <App />
     </StrictMode>,
   )
   ```
   - `createRoot` (de `react-dom/client`) conecta React con el DOM real.
   - El `!` es el *non-null assertion* de TypeScript: le dice al compilador "confía en mí, esto no es `null`". Hace falta porque `getElementById` devuelve `HTMLElement | null`.
   - `<StrictMode>` solo actúa en desarrollo. Ejecuta dos veces algunos renders y efectos para detectar errores (efectos sin limpieza, código impuro). No afecta a producción.
3. **`App.tsx`** es el componente raíz. De él cuelgan todos los demás componentes que crees.

> Idea clave: en Vite, **`index.html` está en la raíz y es el punto de entrada**, no un archivo dentro de `public/` como en Create React App. Vite lo lee y sigue los `import` a partir de él.

---

### `src/` — el código de la app

| Archivo | Rol |
|---|---|
| `main.tsx` | Arranque: monta `<App />` en `#root` e importa `index.css` (estilos globales). Casi nunca se toca. |
| `App.tsx` | Componente raíz. Una función que devuelve JSX y se exporta con `export default`. |
| `App.css` | Estilos que importa `App.tsx`. **Ojo:** importar un `.css` en un componente NO lo encapsula, porque el CSS acaba siendo global igualmente. |
| `index.css` | Estilos globales (variables CSS en `:root`, tipografía, modo claro/oscuro). |
| `assets/` | Imágenes que se **importan** desde el código (`import logo from './assets/react.svg'`). Vite las procesa: les añade un hash al nombre (`react-a1b2c3.svg`) para el caché, y si no las usas no las incluye en el build. |

**¿Por qué `.tsx` y no `.ts`?** `.tsx` es TypeScript **con JSX**. Si un archivo contiene `<etiquetas>`, tiene que ser `.tsx`. La lógica pura (utilidades, tipos) va en `.ts`.

### `public/` vs `src/assets/`

| | `public/` | `src/assets/` |
|---|---|---|
| Cómo se usa | Por URL absoluta: `href="/favicon.svg"` | Con `import` en el código |
| ¿Lo procesa Vite? | No, se copia tal cual a `dist/` | Sí: hash en el nombre, optimización, se descarta si no se usa |
| Cuándo usarlo | Archivos que necesitan un nombre fijo (favicon, `robots.txt`) | Imágenes que usan tus componentes |

---

### Archivos de configuración (raíz)

**`package.json`**: describe el proyecto.
- `dependencies`: lo que necesita la app en producción (`react`, `react-dom`).
- `devDependencies`: herramientas que solo se usan al desarrollar (Vite, TypeScript, ESLint, tipos `@types/*`).
- `scripts`:
  - `npm run dev`: servidor de desarrollo con **HMR** (*Hot Module Replacement*: guardas y el cambio aparece en el navegador sin recargar ni perder el estado).
  - `npm run build`: `tsc -b && vite build`. Primero **comprueba los tipos** (`tsc` no genera archivos, solo verifica) y después Vite empaqueta en `dist/`. Si hay un error de tipos, el build falla.
  - `npm run lint`: ejecuta ESLint.
  - `npm run preview`: sirve `dist/` para probar el build de producción en local.
- `"type": "module"`: los `.js` del proyecto usan ES Modules (`import`/`export`), no CommonJS (`require`).
- Versiones: `^19.3.1` acepta cualquier `19.x.x` (minor y patch); `~6.0.0` solo acepta `6.0.x` (patch).

**`package-lock.json`**: guarda las versiones **exactas** que se instalaron, para que todos tengan el mismo árbol de dependencias. Se sube a git y no se edita a mano.

**`vite.config.ts`**: configuración de Vite.
- `react()`: soporte para JSX y Fast Refresh (el HMR específico de React).
- `babel({ presets: [reactCompilerPreset()] })`: activa el **React Compiler**, que memoriza automáticamente componentes y valores. Por eso en este proyecto casi no hará falta escribir `useMemo`, `useCallback` ni `memo` a mano.

**`eslint.config.js`**: reglas del linter (formato *flat config*).
- `js.configs.recommended` y `tseslint.configs.recommended`: reglas base de JS y TS.
- `reactHooks`: aplica las **reglas de los hooks** (solo en el nivel superior del componente, nunca dentro de `if` ni bucles; dependencias correctas en `useEffect`).
- `reactRefresh`: avisa si un archivo exporta algo que rompe el HMR (por ejemplo, exportar componentes y no-componentes en el mismo archivo).

**Los tres `tsconfig`**: hay código que corre en **dos entornos distintos**.
- `tsconfig.json`: no compila nada (`"files": []`). Solo **referencia** los otros dos.
- `tsconfig.app.json`: para `src/` (navegador). Incluye `"lib": ["DOM"]` para que exista `document`, `"jsx": "react-jsx"` y `"types": ["vite/client"]` para poder importar `.css` y `.png`.
- `tsconfig.node.json`: para `vite.config.ts` (corre en Node). Sin DOM, con tipos de `node`.
- Opciones que vas a notar:
  - `noEmit: true`: TypeScript **solo verifica tipos**. Quien traduce TS a JS es Vite, no `tsc`.
  - `noUnusedLocals` / `noUnusedParameters`: una variable o un import sin usar es un **error** que rompe `npm run build`, no solo un aviso.

**`.gitignore`**: excluye `node_modules/` y `dist/`. Ambos se regeneran (`npm install` / `npm run build`).

---

### Resumen

- **Entrada:** `index.html` → `main.tsx` (`createRoot().render`) → `App.tsx`.
- **Vite** sirve el código sin empaquetar en desarrollo (ES Modules nativos, por eso arranca rápido) y empaqueta con **Rolldown** para producción.
- **TypeScript con `noEmit`:** solo verifica tipos; la transpilación la hace Vite.
- **`public/`** se copia tal cual; **`src/assets/`** se importa y se optimiza.
- **StrictMode** ejecuta dos veces renders y efectos, y solo en desarrollo.
- **React Compiler** hace la memoización automática, así que se usan menos `useMemo`/`useCallback`.
