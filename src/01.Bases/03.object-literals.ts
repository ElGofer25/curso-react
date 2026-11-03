
// Esto es un objeto literal
const persona = {
    firstName: "Juan",
    lastName: "Pérez",
    age: 30,
}

persona.firstName = "Carlos";

//Podemos hacer una copia. Aquí decimos que spiderman apunta al mismo espacio en memoria que persona. Aunque esto no se debe de hacer.
const spiderman = persona;
spiderman.firstName = "Peter";
spiderman.lastName = "Parker";

//Operador spread para hacer una copia de un objeto literal. Aquí decimos que spiderman apunta a un nuevo espacio en memoria. Esto rompe la referencia a primer nivel.
const spiderman2 = { ...persona };

console.log(persona);
console.log(spiderman);
