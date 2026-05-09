import { tempo } from './src/index';

/**
 * FORMATO:
 * input -> resultado esperado
 *
 * Observação:
 * Assumindo data atual = 2026-05-09
 */

const inputs = [
    // =========================
    // RELATIVOS SIMPLES
    // =========================

    // esperado: 2026-02-09
    '3 meses atrás',

    // esperado: 2026-03-09
    '2 meses atras',

    // esperado: 2026-05-02
    '7 dias atrás',

    // esperado: 2026-05-08
    'ontem',

    // esperado: 2026-05-09
    'hoje',

    // esperado: 2026-05-10
    'amanhã',

    // esperado: 2026-04-09
    '1 mês atrás',

    // esperado: 2025-05-09
    '1 ano atrás',

    // esperado: 2026-04-25
    'duas semanas atrás',

    // esperado: 2026-05-06
    '3 dias atras',

    // esperado: 2026-05-09
    'agora',

    // esperado: 2026-05-09
    'nesse instante',

    // esperado: 2026-05-09
    'neste momento',

    // =========================
    // INTERVALOS
    // =========================

    // esperado: 2026-03-09/2026-05-09
    '2 meses atrás até hoje',

    // esperado: 2026-01-01/2026-03-01
    'de janeiro a março',

    // esperado: 2026-01-01/2026-05-09
    'de janeiro até agora',

    // esperado: 2026-01-01/2026-05-09
    'de janeiro até hoje',

    // esperado: 2026-02-01/2026-04-01
    'de fevereiro até abril',

    // esperado: 2026-01-01/2026-12-01
    'de janeiro a dezembro',

    // esperado: 2026-04-09/2026-05-09
    'de 1 mês atrás até hoje',

    // esperado: 2026-05-02/2026-05-09
    'dos últimos 7 dias até hoje',

    // esperado: 2026-05-01/2026-05-09
    'do começo do mês até hoje',

    // esperado: 2026-01-01/2026-05-09
    'do início do ano até agora',

    // esperado: 2026-05-08/2026-05-09
    'de ontem até hoje',

    // esperado: 2026-05-01/2026-05-08
    'de primeiro de maio até ontem',

    // =========================
    // DATAS ABSOLUTAS
    // =========================

    // esperado: 2026-01-01
    '1 de janeiro de 2026',

    // esperado: 2026-12-25
    '25/12/2026',

    // esperado: 2026-05-09
    '09/05/2026',

    // esperado: 2024-02-29
    '29/02/2024',

    // esperado: 2026-07-15
    '15 de julho',

    // esperado: 2026-11-20
    '20 de novembro',

    // esperado: 2025-10-12
    '12 outubro 2025',

    // esperado: 2026-06-01
    'primeiro de junho',

    // =========================
    // GÍRIAS / VARIAÇÕES
    // =========================

    // esperado: 2026-05-08
    'ontê',

    // esperado: 2026-05-09
    'hj',

    // esperado: 2026-05-10
    'amanha',

    // esperado: 2026-03-09
    'faz 2 meses',

    // esperado: 2026-04-09
    'tem 1 mês',

    // esperado: 2026-05-06
    'faz 3 dias',

    // esperado: 2026-05-02
    'uma semana atrás',

    // esperado: 2026-04-09/2026-05-09
    'do mês passado pra cá',

    // esperado: 2026-01-01/2026-05-09
    'de janeiro pra hoje',

    // esperado: 2026-01-01/2026-03-01
    'jan até mar',

    // esperado: 2026-01-01/2026-03-01
    'jan a mar',

    // esperado: 2026-01-01/2026-03-01
    'janeiro até março',

    // esperado: 2026-01-01/2026-03-01
    'de jan até mar',

    // esperado: 2026-03-09/2026-05-09
    'dos últimos 2 meses',

    // esperado: 2026-04-09/2026-05-09
    'último mês',

    // esperado: 2026-05-02/2026-05-09
    'última semana',

    // esperado: 2026-05-08/2026-05-09
    'últimas 24 horas',

    // =========================
    // REGIONAIS / COLOQUIAIS
    // =========================

    // esperado: 2026-03-09
    '2 mês atrás',

    // esperado: 2026-03-09
    'faz uns 2 meses aí',

    // esperado: 2026-03-09
    'uns 2 meses atrás',

    // esperado: 2026-05-02
    'uma semana pra trás',

    // esperado: 2026-04-09
    'mês retrasado',
    // dependendo da regra pode ser:
    // 2026-03-01

    // esperado: 2026-04-01
    'mês passado',

    // esperado: 2026-06-01
    'mês que vem',

    // esperado: 2025-01-01/2025-12-31
    'ano passado',

    // esperado: 2027-01-01/2027-12-31
    'ano que vem',

    // esperado: 2026-05-09
    'agorinha',

    // esperado: 2026-05-09
    'nesse exato momento',

    // =========================
    // CASOS AMBÍGUOS
    // =========================

    // esperado: ??? (ambíguo)
    'sexta-feira',

    // esperado: ??? (próxima sexta?)
    'sexta que vem',

    // esperado: ??? (sexta passada?)
    'sexta retrasada',

    // esperado: ??? (depende do locale)
    '03/04/2026',

    // esperado: ??? (pode inferir ano atual)
    '10 de março',

    // =========================
    // EDGE CASES
    // =========================

    // esperado: erro/null
    '',

    // esperado: erro/null
    'banana',

    // esperado: erro/null
    '32 de janeiro',

    // esperado: erro/null
    'ontem amanhã',

    // esperado: erro/null
    '999 meses atrás',

    // esperado: erro/null
    'janeiro até banana',
];

console.log('--- Testes do Parser ---');

for (const entrada of inputs) {
    console.log(`Entrada: "${entrada}"`);
    console.log(`Resultado: ${tempo(entrada)}`);
    console.log('------------------------------\n');
}

console.log('--- Fim teste ---');