import type { CSSProperties } from "react";

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
export const ItemCounter = ({ name, quantity }: ItemCounterProps) => {
    return (
        <section style={myStyles}>
            <span style={{
                width: 150,
            }}>
                {name}</span>
            <button>+1</button>
            <span>{quantity}</span>
            <button>-1</button>
        </section>
    );
}

