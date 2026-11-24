import { useState, type CSSProperties } from "react";

const myStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
};
interface ItemCounterProps {
    name: string;
    quantity: number | undefined; //Esto es lo mismo que esto: quantity?:number
};


// Props define el tipo de las props recibidas; desestructuramos name para usarlo directamente en el JSX.
// Cómo 'quantity' puede ser undefined, decimos que quantity = 1, así, si viene undefined, nosotros le damos valor por defecto 1
export const ItemCounter = ({ name, quantity = 1 }: ItemCounterProps) => {
    // useState(10) inicia el contador en 10. count es el valor actual y setCount lo actualiza.
    //const [count, setCount] = useState(10); Cómo ya tenemos una prop 'quantity' la podemos asignar dentro del setCount:
    const [count, setCount] = useState(quantity);

    //Con los siguientes handle podemos sumar o restar, dentro de ellos podemos setear condicionales
    const handleAdd = ()=>{ setCount(quantity+1) };
    const handleSubtract = ()=>{ 
        if(quantity === 1) return;
        setCount(quantity-1) };


    // const handleClick = ()=>{
    //     console.log(`Click on ${name}`)
    // };

    return (
        <section style={myStyles}>
            <span style={{
                width: 150,
            }}>
                {name}</span>
            <button onClick={handleAdd}>+1</button>
            <span>{count}</span>
            <button onClick={handleSubtract}>-1</button>
        </section>
    );
}

