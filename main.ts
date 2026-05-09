import { tempo } from './src/index';

const inputs = [
    "3 meses atrás",
    "janeiro a março",
    "começo do ano",
    "reveion",
    "reveilon",
    "de janeiro até agora"
]

console.log('--- Testes do Parser ---');

for (const entrada of inputs) {
    console.log(`Entrada: "${entrada}"`);
    console.log(`Resultado: ${tempo(entrada, { restrictTo: "month", forceRange: true })}`);
    console.log('------------------------------\n');
}

console.log('--- Fim teste ---');