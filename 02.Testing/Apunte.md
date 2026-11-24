# Apuntes — 02. Introducción Testing

## ¿Para qué sirve el testing?

Una prueba (*test*) es **código que comprueba que otro código hace lo que debe**. Sirve para:

- **Detectar errores antes que el usuario.** Si rompes algo, la prueba falla en tu máquina y no en producción.
- **Cambiar código sin miedo.** Al refactorizar o añadir funcionalidades, las pruebas te confirman que lo que ya funcionaba sigue funcionando. Esto se llama prueba de **regresión**.
- **Documentar el comportamiento.** Una prueba bien escrita explica qué se espera de un componente o de una función: "al hacer click en +1, el contador sube".
- **Ahorrar tiempo.** Ejecutar 200 pruebas lleva segundos; comprobar lo mismo a mano en el navegador lleva mucho más.

---

## Tipos de pruebas

| Tipo | Qué prueba | Velocidad | Cantidad recomendada |
|---|---|---|---|
| **Unitarias** | Una sola pieza aislada (una función, un componente) | Muy rápidas | **Muchas** |
| **Integración** | Varias piezas trabajando juntas | Medias | Menos que las unitarias |
| **E2E** (*End to End*) | Un flujo completo, como lo haría un usuario real en el navegador | Lentas | Pocas |

Esto se conoce como la **pirámide de testing**: una base grande de pruebas unitarias, menos de integración en el medio y pocas E2E en la punta.

```
        /\        E2E          → pocas, lentas, prueban la app entera
       /  \
      /----\      Integración  → algunas
     /      \
    /--------\    Unitarias    → muchas, rápidas, aisladas
```

### 1. Pruebas unitarias
Son las más recomendadas. Cómo deben ser:
1. **Atómicas:** prueban **una sola cosa** y tienen la menor cantidad posible de dependencias. Son simples.
2. **Sin dependencias de otros componentes:** si el componente usa una API o a otro componente, se reemplaza por un **mock** (una versión falsa y controlada) para probar solo la pieza que interesa.
3. **Especializadas:** cada prueba verifica un comportamiento concreto. Si falla, sabes exactamente qué se rompió.

*Ejemplo con lo que ya hiciste:* comprobar que `ItemCounter` muestra el `name` que recibe, o que al pulsar `+1` el contador pasa de 5 a 6.

### 2. Pruebas de integración
1. Comprueban **cómo funcionan en conjunto** varios elementos (por ejemplo, la lista de `main.tsx` junto con varios `ItemCounter`).
2. **No deben ser más numerosas que las unitarias.** Son más lentas y más difíciles de mantener, así que hay menos (ver la pirámide).

### 3. Pruebas End to End (E2E)
1. **Prueban un flujo completo de principio a fin**, como un usuario real: abrir la página, añadir productos al carrito, pagar... Se ejecutan en un navegador real.
2. **Tienen un objetivo específico:** cada prueba cubre un flujo concreto (por ejemplo, "el usuario puede completar una compra").
3. **Casos extremos:** también se usan para someter la app a situaciones límite o poco probables (datos vacíos, conexión que falla, el usuario hace algo inesperado).
   > Matiz: como son lentas, se reservan para los **flujos críticos**. La mayoría de los casos extremos de una función concreta (un valor negativo, un string vacío) se prueban de forma más barata con pruebas **unitarias**.

---

## Características de una buena prueba

Todas las pruebas deben ser:

| Característica | Por qué |
|---|---|
| **Fáciles de escribir** | Si cuesta mucho escribirlas, se dejan de escribir. |
| **Fáciles de leer** | Otra persona (o tú dentro de 3 meses) debe entender qué se prueba sin esfuerzo. |
| **Rápidas** | Se ejecutan muchas veces al día. Si tardan, nadie las ejecuta. |
| **Flexibles** | Deben probar el **comportamiento** (lo que ve y hace el usuario), no los detalles internos. Así no se rompen cada vez que reorganizas el código. |

---

## El patrón AAA (*Arrange, Act, Assert*)

Es una forma de **estructurar cada prueba** en tres pasos, siempre en el mismo orden:

1. **Arrange (preparar):** las importaciones e inicializaciones; todo lo necesario para probar (datos, renderizar el componente, mocks).
2. **Act (actuar):** aplicar el estímulo, es decir, llamar a un método, simular un click o escribir en un input.
3. **Assert (afirmar):** comprobar qué tuvo que haber pasado después del estímulo.

Ejemplo con una función sencilla (la sintaxis es la de **Vitest**, la herramienta habitual en proyectos con Vite):

```ts
import { describe, test, expect } from 'vitest';

const sumar = (a: number, b: number) => a + b;

describe('sumar', () => {
  test('debe sumar dos números', () => {
    // 1. Arrange
    const a = 2;
    const b = 3;

    // 2. Act
    const resultado = sumar(a, b);

    // 3. Assert
    expect(resultado).toBe(5);
  });
});
```

- `describe` agrupa pruebas relacionadas.
- `test` (o su alias `it`) define una prueba. El texto describe el comportamiento esperado.
- `expect(valor).toBe(esperado)` es la afirmación. Si no se cumple, la prueba falla.

> Para componentes de React se suele usar **React Testing Library** junto con Vitest. Permite renderizar un componente, buscar elementos como lo haría un usuario (`getByText`, `getByRole`) y simular clicks (`fireEvent.click`). Lo veremos con más detalle en el curso.

---

## Mitos

1. **"Las pruebas hacen más lenta la aplicación."** Falso. El código de las pruebas **ni siquiera llega a producción**: vive en archivos aparte (`*.test.ts`) que no entran en el build.
2. **"Si la prueba pasa, el código está bien."** No necesariamente. Las pruebas también son código y **también pueden estar mal**. Una prueba mal planteada puede dar **falsos positivos** (pasa aunque el código tenga un error). Hay que tener claro **qué** se está probando. Un truco: rompe el código a propósito y comprueba que la prueba falla.
3. **"Hay que probarlo todo."** No es necesario, y en la práctica es casi imposible. Si una app te lleva un año de desarrollo, probar absolutamente todo podría llevarte otro año. Prioriza lo importante: la lógica de negocio, los flujos críticos y lo que se rompe con frecuencia.

---

## Cobertura (*coverage*)

Es un **porcentaje que indica cuánto de tu código se ejecutó durante las pruebas**. Cuanto más alto, mejor, pero **no hace falta pasar del 70-80 %**. A partir de ahí, cada punto extra cuesta mucho y aporta poco.

| Tipo | Qué mide | Ejemplo |
|---|---|---|
| **De líneas** | Qué porcentaje de líneas se ejecutó | 80 de 100 líneas → 80 % |
| **De ramas** | Si se recorrieron **todos los caminos** de cada `if`/`else`, ternario o `switch` | En `if (count === 1) return;` hay que probar cuando `count` es 1 **y** cuando no lo es |
| **De funciones** | Qué porcentaje de funciones se llamó al menos una vez | ¿Se ejecutaron `handleAdd` y `handleSubtract`? |
| **De condiciones** | Si cada parte de una condición compuesta fue `true` y `false` | En `a && b` hay que probar `a` y `b` por separado |

> **Ojo:** una cobertura alta **no garantiza** que las pruebas sean buenas. Mide qué código se **ejecutó**, no si se **comprobó** que el resultado fuera correcto. Una prueba sin `expect` puede subir la cobertura sin probar nada.

Con Vitest, la cobertura se obtiene con `npx vitest run --coverage`.

---

## Resumen

- **Testing** = código que verifica tu código. Detecta errores pronto y te permite refactorizar sin miedo.
- **Pirámide:** muchas unitarias, algunas de integración y pocas E2E.
- **Unitarias:** atómicas, aisladas (con mocks) y especializadas.
- **Buena prueba:** fácil de escribir, fácil de leer, rápida y flexible (prueba comportamiento, no detalles internos).
- **AAA:** *Arrange* (preparar) → *Act* (actuar) → *Assert* (comprobar).
- **Mitos:** los tests no llegan a producción, pueden tener errores (falsos positivos) y no hay que probarlo todo.
- **Cobertura:** de líneas, de ramas, de funciones y de condiciones. Un 70-80 % es suficiente, y una cobertura alta no implica que las pruebas sean buenas.

# Dependencia - Vitest

Ejecutamos el comando: npm install -D vitest
Después de ejecutarlo, agregaremos dos dependencias en el .json:
{
    "scripts":{
        "test": "vitest",
        "test:ui" :"vitest --ui",
        "coverage" :"vitest run --coverage"
    }
}


Para poder ejecutarlos, 