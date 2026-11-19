# Apunte: conceptos básicos de React

## ¿Qué es una librería?

Una **librería** es un conjunto de herramientas de código que utilizas para resolver tareas sin tener que escribir todo desde cero.

**Ejemplo:** React te ayuda a construir interfaces de usuario con botones, formularios y listas.

## ¿Qué es React?

**React es una librería de JavaScript para construir interfaces mediante componentes.** Un componente es una pieza reutilizable de la interfaz, como una tarjeta de producto.

```jsx
function Saludo() {
  return <h1>Hola, mundo</h1>;
}
```

Cuando cambian los datos que maneja React, como el estado de un componente, React calcula cómo debe quedar la interfaz y actualiza lo necesario.

## ¿Qué son JavaScript (JS) y TypeScript (TS)?

### Diferencias entre JavaScript y TypeScript

1. **JavaScript (JS):** lenguaje que permite añadir lógica e interacción a una página. Usa archivos `.js`; muchos errores se descubren al ejecutar el código.

2. **TypeScript (TS):** lenguaje basado en JavaScript que añade un sistema de tipos y permite detectar errores de tipos durante el desarrollo. Usa archivos `.ts` y se transforma en JavaScript para ejecutarse en el navegador.

```ts
let edad: number = 25;
// edad = "veinticinco"; // TypeScript marca un error: se esperaba un número.
```

**Idea clave:** los tipos ayudan a comprobar qué datos espera tu código; no validan por sí solos los datos que llegan de una API.

## ¿Qué son JSX y TSX?

**JSX** es una extensión de sintaxis que permite escribir código parecido a HTML dentro de JavaScript. Las llaves `{}` permiten insertar expresiones de JavaScript.

```jsx
const nombre = "Ana";
const saludo = <h1>Hola, {nombre}</h1>;
```

**TSX** permite usar JSX en TypeScript: combina esa forma de describir la interfaz con la comprobación de tipos.

- **`.jsx`**: JavaScript con JSX.
- **`.tsx`**: TypeScript con JSX.

El código JSX se transforma en JavaScript antes de ejecutarse en el navegador.

## ¿Qué es el DOM?

El **DOM** (*Document Object Model*) es la representación del documento HTML como un árbol de objetos. JavaScript puede modificarlo para cambiar el contenido de la página.

### Diferencias entre DOM real y DOM virtual

1. **DOM real:** es la estructura del documento que mantiene el navegador. El navegador lo usa, junto con los estilos, para dibujar lo que ves.

2. **DOM virtual:** es una representación de la interfaz que React mantiene en memoria. React compara la interfaz nueva con la anterior para decidir qué actualizar en el DOM real.

**Ejemplo:** si un contador cambia de `0` a `1`, React actualiza el texto correspondiente en el DOM real sin recargar toda la página.

## ¿Qué son los hooks?

Los **hooks** son funciones que permiten usar características de React dentro de componentes de función.

Por ejemplo, **`useState`** permite guardar un dato entre renderizados y solicitar una actualización cuando cambia.

```jsx
import { useState } from "react";

function Contador() {
  const [cuenta, setCuenta] = useState(0);

  return (
    <button onClick={() => setCuenta(actual => actual + 1)}>
      Clics: {cuenta}
    </button>
  );
}
```

- `cuenta`: valor actual; comienza en `0`.
- `setCuenta`: función para actualizarlo.
- Cada clic aumenta la cuenta y React actualiza la interfaz.

**Regla básica:** llama a los hooks en el nivel superior de un componente o de un hook propio, nunca dentro de condiciones o bucles.

## ¿Qué son los breaking changes?

Los **breaking changes** son cambios que rompen la compatibilidad con código que antes funcionaba. Al actualizar una herramienta, podrías tener que adaptar tu proyecto.

**Ejemplo:** una nueva versión de una librería elimina una función que utilizas; debes reemplazarla para que tu código siga funcionando.

> Se escribe **breaking changes**, no “braking changes”.

## ¿Qué diferencia hay entre una librería y un framework?

1. **Librería:** ofrece herramientas para tareas concretas y tú decides cómo integrarla en tu proyecto. Por ejemplo, **React** se centra en construir interfaces.

2. **Framework:** ofrece una estructura y convenciones para organizar una aplicación; define buena parte de cómo encaja tu código. Por ejemplo, **Next.js** utiliza React y añade soluciones como el enrutamiento.

**Para recordarlo:** una librería te da herramientas; un framework también te da una estructura de trabajo.

## ¿Qué es un linter?

Un **linter** es una herramienta que analiza tu código sin ejecutarlo para detectar posibles errores, malas prácticas y problemas según las reglas configuradas.

**Ejemplo:** puede avisarte si declaras una variable que nunca utilizas.

### ¿Qué es ESLint?

**ESLint** es un linter para JavaScript que también puede analizar TypeScript mediante herramientas adicionales. Permite configurar reglas y añadir plugins, por ejemplo, para revisar el uso de los hooks de React.

**Ventaja principal:** ofrece un ecosistema amplio de reglas, plugins y configuraciones para adaptar la revisión a tu proyecto.

### ¿Qué es Oxlint?

**Oxlint** es un linter para JavaScript y TypeScript, escrito en Rust y diseñado para analizar el código con rapidez.

**Ventaja principal:** la velocidad de análisis, especialmente útil en proyectos con muchos archivos.

### ¿Cuál escoger para este curso?

**ESLint** es una buena opción para seguir el curso por su ecosistema y sus integraciones con React y TypeScript. **Oxlint** es una alternativa si se prioriza la velocidad; conviene comprobar que cubra las reglas que necesita el proyecto.

**Idea clave:** un linter revisa reglas de calidad del código; TypeScript comprueba tipos y un formateador organiza su presentación. Son herramientas complementarias.
