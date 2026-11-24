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
│   ├── main.tsx          ← monta React dentro de index.html (hoy renderiza la lista de ItemCounter)
│   ├── FirstStepsApp.tsx ← primer componente: JSX y Fragment
│   ├── MyAwesomeApp.tsx  ← expresiones en JSX, estilos en línea
│   └── shopping-cart/
│       ├── ItemCounter.tsx         ← props + useState + eventos
│       └── ItemCounter.module.css  ← CSS Modules
│   (la plantilla traía App.tsx, App.css, index.css y assets/, que ya se borraron)
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

## Lo visto en `src/`, archivo por archivo

### 1. `FirstStepsApp.tsx`: el primer componente

```tsx
export function FirstStepsApp() {
  return (
    <>
      <h1>Hola Mundo</h1>
      <button>Click me</button>
    </>
  )
}
```

- **Un componente es una función que devuelve JSX.** React la ejecuta y pinta lo que devuelve.
- **El nombre va en PascalCase** (`FirstStepsApp`). Así React distingue `<button>` (etiqueta HTML, en minúscula) de `<FirstStepsApp />` (tu componente). Si lo escribes en minúscula, React lo trata como una etiqueta HTML desconocida.
- **Solo puede haber un elemento raíz.** Para devolver varios elementos sin añadir un `<div>` extra, se usa un **Fragment**: `<>...</>`. El Fragment agrupa los elementos, pero no aparece en el DOM.
- `export function X` es un **export con nombre**, así que se importa con llaves: `import { X } from './X'`. Con `export default` se importa sin llaves.

### 2. `MyAwesomeApp.tsx`: expresiones dentro de JSX

**Función tradicional y función flecha** son equivalentes para crear un componente:
```tsx
export function MyAwesomeApp() { return <h1>Hola</h1> }        // tradicional
export const MyAwesomeApp = () => { return <h1>Hola</h1> }      // flecha
```
> En tu archivo los títulos están cruzados: el comentario `//!Función tradicional` está encima del ejemplo con flecha.

**Las llaves `{}` son el puente entre JSX y JavaScript.** Dentro solo pueden ir **expresiones**, es decir, algo que produce un valor (`count + 1`, `isActive ? 'a' : 'b'`, `lista.map(...)`). No pueden ir **sentencias** (`if`, `for`, `const x = ...`). Por eso se usa el ternario.

**Qué hace React con cada tipo de valor dentro de `{}`:**

| Valor | Qué se ve en pantalla |
|---|---|
| `string`, `number` | El texto o el número |
| `true`, `false`, `null`, `undefined` | **Nada**. Por eso `{isActive}` no muestra nada y hay que usar un ternario. |
| Array (`['a','b']`) | Sus elementos pegados: `ab`. Para separarlos: `.join(', ')` o `.map()` |
| Objeto (`{ zipCode: ... }`) | **Error**: *"Objects are not valid as a React child"*. Para mostrarlo: `JSON.stringify(obj)` |

**Constantes fuera o dentro del componente:**
- **Fuera:** se crean **una sola vez** cuando se carga el archivo. Úsalo para valores fijos (`phrase`, `myStyles`).
- **Dentro:** se vuelven a crear **en cada render**. Úsalo para lo que depende de las props o del estado.

**Estilos en línea con `style`:**
- Recibe un **objeto**, no un string. Las propiedades van en camelCase (`backgroundColor`, no `background-color`). Un número sin unidad se interpreta como `px` (`padding: 10` equivale a `10px`).
- `style={{ ... }}`: las llaves de fuera son las de JSX (abren una expresión) y las de dentro son el objeto.
- Con una constante: **`style={myStyles}`**, con una sola pareja de llaves.
  > Corrección a tu comentario: `style={{ myStyles }}` **está mal**. Crea el objeto `{ myStyles: {...} }`, que no es un estilo válido.
- `CSSProperties` es el **tipo** de TypeScript para ese objeto. Se importa con `import type { CSSProperties } from 'react'` porque solo existe en TypeScript y desaparece al compilar.

**Comentarios dentro de JSX:** solo funciona `{/* comentario */}`.
> ⚠️ En tu archivo hay `<>  //Para llamar el valor...`. Dentro de JSX `//` **no es un comentario**: ese texto se muestra en pantalla. Cámbialo por `{/* ... */}`.
> Fuera del JSX (arriba del archivo, por ejemplo) basta con `//` o `/* */`. Envolverlos en `{}` funciona, pero no hace falta.

### 3. `main.tsx`: renderizar una lista

```tsx
interface ItemsCart { productName: string; quantity: number }

const ItemsInCart: ItemsCart[] = [
  { productName: 'Nintendo Switch 2', quantity: 5 },
  // ...
]

{ItemsInCart.map(({ productName, quantity }) => (
  <ItemCounter key={productName} name={productName} quantity={quantity} />
))}
```

- **Orden de los imports:** React, después librerías de terceros, después tus archivos y al final el CSS.
- **`interface`** describe la forma de cada objeto, y `ItemsCart[]` significa "un array de esos objetos". Si te falta una propiedad o escribes mal un nombre, TypeScript te avisa.
- **`.map()` convierte datos en JSX.** Por cada objeto devuelve un `<ItemCounter />`. Es la forma estándar de pintar listas porque `for` no puede ir dentro de `{}`.
- **Desestructuración en el parámetro:** `({ productName, quantity })` saca esas propiedades del objeto directamente.
- **`key`:**
  - Es obligatorio en listas. React lo usa para saber qué elemento es cuál entre un render y el siguiente.
  - Debe ser **único entre hermanos y estable**. El índice (`index`) es mala opción si la lista se reordena o se borran elementos, porque el **estado** de un elemento acabaría pasando a otro (ver hooks).
  - `key` no llega al componente como prop: `ItemCounter` no puede leerlo.
- **Pasar props:** `name={productName}`. El nombre de la izquierda es el de la prop que espera el hijo y el de la derecha es tu valor.

### 4. `shopping-cart/ItemCounter.tsx`: props, estado y eventos

**Props tipadas con interface y valor por defecto:**
```tsx
interface ItemCounterProps {
  name: string;
  quantity?: number;          // opcional
}
export const ItemCounter = ({ name, quantity = 1 }: ItemCounterProps) => { ... }
```
- Las props son los **parámetros** del componente. Llegan en un solo objeto, que se desestructura.
- `quantity = 1` es un valor por defecto de JavaScript. Se usa si la prop llega como `undefined`.
- Las props son de **solo lectura**: el hijo **nunca** las modifica. Para algo que cambia se usa **estado** (`useState`).

> **Corrección a tu comentario:** `quantity: number | undefined` **no es lo mismo** que `quantity?: number`.
> - `quantity?: number`: la prop **se puede omitir**. `<ItemCounter name="PS Vita" />` es válido.
> - `quantity: number | undefined`: la prop **es obligatoria**, aunque su valor pueda ser `undefined`. Tienes que escribirla siempre: `<ItemCounter name="PS Vita" quantity={undefined} />`.
> Para lo que querías (un valor por defecto si no la pasan), lo correcto es `quantity?: number`.

**Eventos:**
```tsx
<button onClick={handleAdd}>+1</button>                 // ✅ pasas la función
<button onClick={handleAdd()}>+1</button>               // ❌ la EJECUTAS al renderizar
<button onClick={() => setCount(count + 1)}>+1</button> // ✅ flecha si necesitas argumentos
```
- Los eventos van en camelCase (`onClick`, `onChange`).
- Se pasa **la referencia** a la función, y React la llama cuando ocurre el click.
- Por convención, las funciones manejadoras se llaman `handleAlgo`.

**Estilo condicional:** `color: count === 1 ? 'red' : 'black'`. Como el estilo se calcula en cada render, cambia solo cuando cambia `count`.

> ⚠️ **Ahora mismo `npm run build` falla:** `'CSSProperties' is declared but its value is never read`. Al comentar `myStyles`, el import quedó sin usar, y con `noUnusedLocals` eso es un error. Quita `type CSSProperties` del import.

### 5. Tres formas de dar estilos

| Forma | Ejemplo | ¿Encapsulado? |
|---|---|---|
| En línea | `style={{ color: 'red' }}` | Sí, pero no admite `:hover`, media queries, etc. |
| `.css` normal | `import './ItemCounter.css'` + `className="item-row"` | **No.** La clase es global y puede chocar con otra que se llame igual. |
| **CSS Modules** | `import styles from './ItemCounter.module.css'` + `className={styles.itemRow}` | **Sí.** Vite renombra la clase (`_itemRow_a1b2c`) para que sea única. |

- En JSX se escribe **`className`**, no `class`, porque `class` es una palabra reservada de JavaScript.
- Con CSS Modules, el archivo **tiene que** terminar en `.module.css`.
- Una clase con guion (`item-text`) no se puede leer como `styles.item-text`, porque JavaScript lo interpreta como una resta. Hay que escribir `styles['item-text']`. Por eso se recomienda nombrar las clases en camelCase (`itemText`).
- Tienes una clase `.red` que no usas. Podrías sustituir el estilo en línea por: `className={count === 1 ? styles.red : undefined}`.
- **Si una declaración CSS es inválida, el navegador la ignora sin avisar.** Te pasó dos veces: `display: felx` y `width: 150px,` (con coma en lugar de punto y coma).

---

## Hooks

### ¿Qué son? (respuesta a "¿casi todos son funciones?")

**Todos los hooks son funciones**, sin excepción. Lo que los hace especiales es que **"se enganchan" (*hook*) a funciones internas de React** que una función normal no puede usar: guardar estado entre renders, ejecutar efectos o leer un contexto.

- Se reconocen porque su nombre **empieza por `use`**: `useState`, `useEffect`, `useContext`...
- El único caso especial es `use` (React 19). También es una función, pero es el único hook que **sí** se puede llamar dentro de un `if` o un bucle. Por eso a veces se dice "casi todos": la diferencia está en las reglas, no en que sean funciones.

**¿Por qué hacen falta?** Un componente es una función que React **vuelve a ejecutar en cada render**. Fíjate en este ejemplo:

```tsx
export const ItemCounter = () => {
  let count = 5;                        // ❌
  const handleAdd = () => { count++ };  // cambia la variable...
  return <span>{count}</span>;          // ...pero la pantalla sigue mostrando 5
}
```
Falla por dos motivos:
1. **React no se entera** de que `count` cambió, así que no vuelve a renderizar.
2. Aunque volviera a renderizar, la función se ejecutaría desde cero y `let count = 5` **reiniciaría** el valor.

`useState` resuelve las dos cosas: **guarda el valor fuera de la función**, dentro de React, y **avisa a React para que vuelva a renderizar** cuando cambia.

### Reglas de los hooks (completando tu lista)

**1. Solo en el nivel superior del componente.** No se pueden llamar dentro de `if`, bucles, funciones anidadas ni **después de un `return` anticipado**.
- Tu regla 0 ("al inicio, antes del return") va bien encaminada. Lo importante es que **siempre se ejecuten todos, y en el mismo orden**, en cada render.
- **Por qué:** React no identifica cada hook por el nombre de la variable, sino por el **orden en que se llaman**. Internamente piensa "el 1.er `useState` de este componente es X, el 2.º es Y". Si un `if` se salta uno, los siguientes se desplazan y los valores se cruzan.

```tsx
// ❌ Mal
if (name === '') return null;          // return anticipado...
const [count, setCount] = useState(1); // ...a veces este hook no se ejecuta

if (count > 3) {
  const [x, setX] = useState(0);       // hook condicional
}

// ✅ Bien: primero todos los hooks y después las condiciones
const [count, setCount] = useState(1);
if (name === '') return null;
```

**2. Solo dentro de componentes de React o de *custom hooks*.** No se pueden llamar en funciones normales, en clases ni **dentro de manejadores de eventos**:
```tsx
const handleAdd = () => {
  const [x, setX] = useState(0);  // ❌ dentro de un handler
  setCount(count + 1);            // ✅ llamar al SETTER aquí sí está permitido
};
```

**3. Los *custom hooks* (los que crees tú) también deben empezar por `use`** (`useCounter`). Así React y ESLint saben que deben aplicarles estas reglas.

> El plugin `eslint-plugin-react-hooks` (ya incluido en el proyecto) detecta estos errores: `npm run lint`.

---

### `useState` a fondo

```tsx
const [count, setCount] = useState(quantity);
//     │        │                    └─ valor inicial
//     │        └─ función para cambiarlo (setter)
//     └─ valor actual en ESTE render
```

- `useState` devuelve un **array de 2 elementos**, y la desestructuración `[a, b]` les pone nombre. Los nombres los eliges tú. La convención es `[algo, setAlgo]`.
- **Tipo:** TypeScript lo deduce del valor inicial (aquí `number`). Cuando no se puede deducir, se indica explícitamente: `useState<string[]>([])` o `useState<User | null>(null)`.

#### El ciclo completo (qué pasa al hacer click en +1)

```
1. Click → handleAdd() → setCount(6)
2. React guarda 6 y PROGRAMA un nuevo render (no es inmediato)
3. React vuelve a ejecutar la función ItemCounter entera
4. Esta vez useState(...) devuelve 6 (ignora el valor inicial)
5. Se genera el JSX nuevo → React compara con el anterior → actualiza en el DOM SOLO el <span> que cambió
```

#### 1. El valor inicial solo se usa en el primer render
`useState(quantity)` lee `quantity` **una sola vez**, al montar el componente. Si después el padre cambiara `quantity` a 10, `count` **no se actualizaría**. La prop solo sirve como "semilla" del estado. Por eso es habitual llamarla `initialQuantity`, para que quede claro.

#### 2. El estado es una "foto" de cada render
Dentro de un render, `count` es una **constante**. Llamar a `setCount` no cambia la variable que ya tienes, sino que pide un render nuevo con un valor nuevo:
```tsx
const handleAdd = () => {
  setCount(count + 1);
  console.log(count);   // ⚠️ sigue mostrando el valor VIEJO
};
```
Una consecuencia que suele pillar desprevenido:
```tsx
setCount(count + 1);
setCount(count + 1);    // count sigue siendo 5 en las dos líneas → resultado: 6, no 7
```
**Solución, la función actualizadora:** le pasas una función que recibe el valor más reciente:
```tsx
setCount(c => c + 1);
setCount(c => c + 1);   // → 7 ✅
```
**Regla práctica:** si el nuevo valor depende del anterior, usa `setX(prev => ...)`. Para un solo `+1` en un click, las dos formas funcionan.

#### 3. Cada instancia tiene su propio estado
En `main.tsx` renderizas 4 `<ItemCounter />` y **cada uno tiene su propio `count`**, independiente de los demás. El estado pertenece a **esa instancia en esa posición del árbol**, y por eso importa el `key`: si cambia el `key`, React considera que es otro componente y **reinicia su estado**.

#### 4. Objetos y arrays: nunca mutar, siempre crear uno nuevo
React decide si hay que volver a renderizar comparando la **referencia** (`Object.is(viejo, nuevo)`). Si modificas el mismo objeto, la referencia no cambia, así que React cree que no pasó nada.
```tsx
// ❌ Mutar: la pantalla NO se actualiza
items.push(nuevo);       setItems(items);
user.name = 'Diego';     setUser(user);

// ✅ Crear una copia nueva
setItems([...items, nuevo]);                            // agregar
setItems(items.filter(i => i.id !== id));               // eliminar
setItems(items.map(i => i.id === id ? {...i, qty: 2} : i)); // modificar uno
setUser({ ...user, name: 'Diego' });                    // cambiar una propiedad
```

#### 5. No guardes en el estado lo que puedes calcular
```tsx
const [count, setCount] = useState(1);
const isMinimum = count === 1;   // ✅ valor derivado: se recalcula en cada render
// ❌ no hagas otro useState para isMinimum: tendrías que mantener los dos sincronizados
```
Es lo que ya haces con `color: count === 1 ? 'red' : 'black'`.

#### 6. Otros detalles
- **Valor inicial costoso:** `useState(() => calcularAlgoPesado())`. Si pasas la función, React solo la ejecuta en el primer render.
- **Si guardas el mismo valor** (`setCount(5)` cuando ya vale 5), React puede saltarse el render.
- **StrictMode** ejecuta el componente **dos veces** en desarrollo. Si ves un `console.log` duplicado, es por eso, no es un error.
- **El bug que corregimos:** `setCount(quantity + 1)` usaba la prop, que **nunca cambia**, en lugar del estado. Siempre calculaba `5 + 1 = 6` y el contador se quedaba ahí. **Para leer el valor actual, usa siempre el estado (`count`), no la prop.**

---

### Otros hooks que vienen (aún no usados en el proyecto)

**`useEffect`: sincronizar el componente con algo externo** (pedir datos a una API, temporizadores, suscripciones, `document.title`).
```tsx
useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(id);   // limpieza: se ejecuta antes del siguiente efecto y al desmontar
}, []);                             // array de dependencias
```
| Dependencias | Cuándo se ejecuta |
|---|---|
| (sin array) | Después de **cada** render |
| `[]` | Una sola vez, al montar |
| `[count]` | Al montar y cada vez que cambia `count` |

- Se ejecuta **después** de que React pinta la pantalla, no durante el render.
- En desarrollo, StrictMode hace *montar → limpiar → montar* para comprobar que tu limpieza funciona.
- **No lo uses** para calcular valores derivados de props o estado: calcúlalos directamente (punto 5 de `useState`).

**`useContext`: leer un valor compartido sin pasarlo como prop por cada nivel** (lo que se llama *prop drilling*). Se usa para el tema, el usuario logueado o el carrito.
```tsx
const ThemeContext = createContext('light');
<ThemeContext value="dark"> ... </ThemeContext>    // quien lo provee
const theme = useContext(ThemeContext);            // quien lo lee, en cualquier nivel por debajo
```

**`useRef`: guardar un valor que persiste entre renders pero que NO provoca un render al cambiar**, o acceder a un elemento del DOM (`inputRef.current.focus()`).

**`useMemo` / `useCallback`: memorizar cálculos o funciones.** En este proyecto el **React Compiler** ya lo hace automáticamente, así que casi no los necesitarás.

### Tabla rápida: estado, props y variables

| | Props | Estado (`useState`) | Variable normal (`const`/`let`) |
|---|---|---|---|
| ¿Quién lo define? | El padre | El propio componente | El propio componente |
| ¿Se puede cambiar? | No (solo lectura) | Sí, con el setter | Sí, pero React no se entera |
| ¿Provoca un render al cambiar? | Sí (si el padre las cambia) | **Sí** | No |
| ¿Persiste entre renders? | — | **Sí** | No, se reinicia |

---

## Resumen

- **Entrada:** `index.html` → `main.tsx` (`createRoot().render`) → componentes.
- **Componente** = función en PascalCase que devuelve **un** elemento (usa `<>` si necesitas varios).
- **`{}` en JSX** = expresión JS. Booleanos, `null` y `undefined` no se muestran; los objetos se muestran con `JSON.stringify`.
- **Listas:** `.map()` + un `key` único y estable.
- **Props:** se tipan con `interface`, son de solo lectura y el valor por defecto se pone en la desestructuración. `?` hace que la prop sea opcional.
- **Eventos:** `onClick={handler}`, sin `()`.
- **Estilos:** con CSS Modules (`.module.css` + `styles.clase`) la clase queda encapsulada; el `.css` normal es global.
- **Hooks:** son funciones que empiezan por `use`. Se llaman siempre, en el mismo orden y en el nivel superior de un componente o de un custom hook.
- **`useState`:** el valor inicial solo cuenta en el primer render y el estado es una foto de cada render. Usa `setX(prev => ...)` cuando el nuevo valor dependa del anterior. Nunca mutes objetos ni arrays.
- **Vite** sirve ES Modules en desarrollo y empaqueta con Rolldown para producción. **TypeScript** (`noEmit`) solo verifica tipos, y un import sin usar rompe el build.
- **StrictMode** duplica renders y efectos, solo en desarrollo. El **React Compiler** hace la memorización automáticamente.
