//Podemos considerar dos opciones para la función: tradicional y de flecha

//!Función tradicional
{/*
Función de flecha    
    export const MyAwesomeApp = () =>{
    return(
        <>
            <h1>My first app</h1>
            <h3>By el gofer 25</h3>
        </>
        )
    }
*/}

//!Función de flecha
// Podemos asignar valores 'dinámicos' en cierto sentido
//Si nuestros valores nunca cambian, podemos declarar las constantes fuera de la función
import type { CSSProperties } from "react"; //Le ponemos type para que lo usemos con interface

const phrase = 'My first app';
const nickName = 'El gofer 25';

//También podemos darle un arreglo
const favoriteGames = ['Farcry primal', 'Zelda Botw', 'Fornite'];
const isActive = true;
//Objeto literal
const address = {
    zipCode: 'ABC-123',
    country: 'Canada',
}

const myStyles: CSSProperties = {
    backgroundColor: '#f0a3a3',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
}

{/*
    Las llaves son como un puente entre el tsx y javascript, todo lo que pongamos dentro de ellas
    se vuelven expresiones validas de javascript
*/}
export function MyAwesomeApp() {
    // Si dejamos las constantes dentro de la función, estos también forman parte del ciclo de ejecución de react.
    return (
        <>  //Para llamar el valor de una const usamos las llaves {name}
            <h1>{phrase}</h1>
            <h3>{nickName}</h3>

            <p>{favoriteGames.join(',  ')}</p>
            {/* <h1>{isActive}</h1> //Por si solo, un boolean no genera código en JS, podemos usar un ternario */}
            <p>{isActive ? 'Activo' : 'No activo'}</p>


            {/* 1. No podemos declarar un objeto literal como los componentes pasados, revienta react; en su lugar usamos el siguiente método:  JSON.stringify(SOMETHING) <---- Eso permite imprimir el objeto
            2. Para poder dar estilos, usamos style = {{}}. Por ejemplo: */}
            {/* style = {{
                backgroundColor: '#f0a3a3',
                borderRadius: 20,
                padding: 10,
                marginTop: 20,
            }}
            3. En lugar de dejar los styles 'hardcodeados' podemos declararlos dentro de una constante y asignarselos al styles así: styles = {{ myStyles }} */}

            <p style={myStyles}>
                {JSON.stringify(address)}
            </p>

        </>

    )
}


