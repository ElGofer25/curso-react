
//Podemos hacer referencia a una interfaz dentro de otra
interface Persona {
    firstName: string;
    lastName: string;
    age: number;
    address: Address; // Esto es mejor que poner street, number y city directamente en la interfaz Persona, ya que si queremos cambiar la dirección de una persona, podemos cambiarla en un solo lugar.
}
interface Address {
    street: string;
    number: number;
    city: string;
}


// Esto es un objeto literal
const persona: Persona = {
    firstName: "Juan",
    lastName: "Pérez",
    age: 30,
    address: {
        street: "Calle Falsa",
        number: 123,
        city: "Ciudad Ficticia",
    },
}

console.log(persona);

