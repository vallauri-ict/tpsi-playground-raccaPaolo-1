let modulo = require("modulo.js");

//  richiamo la funzione anonima
modulo();
modulo.esplicita();
let somma = modulo.somma(2,3);
let prod = modulo.moltiplicazione(2,3);

console.log(somma,prod);

console.log(modulo.json);
modulo.json.setNome('Deto');
console.log(modulo.json.nome);

console.log(modulo.myClass);