{/*
Como buena practica, los imports siguen un orden que nos ayuda a facilitar la lectura de codigo:
1. Importaciones de react
2. Importaciones de terceros
3. Importaciones (propias) personalizadas
4. Importaciones de css al último
*/}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ItemCounter } from './shopping-cart/ItemCounter'


// De esta forma asignamos los valores, aunque de momento están 'hardcodeados'.
{/*
¿Qué pasa si queremos que los valores sean 'dinámicos'? Generamos una nueva interface --> ItemInCart 
*/}
interface ItemsCart {
  productName: string,
  quantity: number,
}

const ItemsInCart: ItemsCart[] = [
  { productName: 'Nintendo Switch 2', quantity: 5 },
  { productName: 'Xbox Series S', quantity: 5 },
  { productName: 'PS Vita', quantity: 5 },
  { productName: 'PC Gamer', quantity: 5 },
]


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>Carrito de compras</h1>
    {ItemsInCart.map(({ productName, quantity }) => (
      // React usa key para identificar cada elemento de la lista entre renderizados.
      // Debe ser estable y única entre hermanos; aquí usamos productName porque no se repite.
      <ItemCounter key={productName} name={productName} quantity={quantity} ></ItemCounter>
    ))}
  </StrictMode>,
)
