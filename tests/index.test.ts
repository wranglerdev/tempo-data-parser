import { tempo } from '../src/index';

describe('Parser Tempo (PT-BR) - Suite Completa', () => {
  // Data base fixa para garantir consistência: 2026-05-08 (Sexta-feira)
  // Aniversários e feriados dependem desse ano.
  const refDate = new Date(2026, 4, 8); 

  describe('1. Palavras-Chave Simples', () => {
    test('hoje, amanhã, ontem', () => {
      expect(tempo('hoje', { referenceDate: refDate })).toBe('2026-05-08');
      expect(tempo('amanhã', { referenceDate: refDate })).toBe('2026-05-09');
      expect(tempo('ontem', { referenceDate: refDate })).toBe('2026-05-07');
      expect(tempo('anteontem', { referenceDate: refDate })).toBe('2026-05-06');
      expect(tempo('o dia antes de ontem', { referenceDate: refDate })).toBe('2026-05-06');
      expect(tempo('depois de amanhã', { referenceDate: refDate })).toBe('2026-05-10');
    });
  });

  describe('2. Dias da Semana e Relativos Simples', () => {
    test('dias da semana diretos (esta/próxima/passada)', () => {
      // 08/05/2026 é Sexta-feira
      expect(tempo('esta sexta', { referenceDate: refDate })).toBe('2026-05-08');
      expect(tempo('próxima sexta', { referenceDate: refDate })).toBe('2026-05-15');
      expect(tempo('sexta passada', { referenceDate: refDate })).toBe('2026-05-01');
      
      expect(tempo('este domingo', { referenceDate: refDate })).toBe('2026-05-10');
      expect(tempo('domingo passado', { referenceDate: refDate })).toBe('2026-05-03');
      expect(tempo('próxima segunda', { referenceDate: refDate })).toBe('2026-05-11');
      expect(tempo('segunda', { referenceDate: refDate })).toBe('2026-05-11'); // Resolve pra frente
    });

    test('daqui a / há / em X tempo', () => {
      expect(tempo('daqui a 3 dias', { referenceDate: refDate })).toBe('2026-05-11');
      expect(tempo('em 3 dias', { referenceDate: refDate })).toBe('2026-05-11');
      expect(tempo('daqui a 2 semanas', { referenceDate: refDate })).toBe('2026-05-22');
      expect(tempo('há 5 dias', { referenceDate: refDate })).toBe('2026-05-03');
      expect(tempo('ha 1 mes', { referenceDate: refDate })).toBe('2026-04-08');
      expect(tempo('daqui a 2 anos', { referenceDate: refDate })).toBe('2028-05-08');
    });
  });

  describe('3. Formatos Numéricos e Textuais', () => {
    test('DD/MM/YYYY e derivados', () => {
      expect(tempo('15/12/2026', { referenceDate: refDate })).toBe('2026-12-15');
      expect(tempo('10-05-26', { referenceDate: refDate })).toBe('2026-05-10');
      expect(tempo('20/05', { referenceDate: refDate })).toBe('2026-05-20');
      expect(tempo('01-01-2027', { referenceDate: refDate })).toBe('2027-01-01');
    });

    test('Meses por extenso e ordinais', () => {
      expect(tempo('10 de maio', { referenceDate: refDate })).toBe('2026-05-10');
      expect(tempo('1 de janeiro', { referenceDate: refDate })).toBe('2026-01-01');
      expect(tempo('mai 10 26', { referenceDate: refDate })).toBe('2026-05-10');
      expect(tempo('1º de março', { referenceDate: refDate })).toBe('2026-03-01');
      expect(tempo('primeiro de março', { referenceDate: refDate })).toBe('2026-03-01');
      expect(tempo('o dia 20', { referenceDate: refDate })).toBe('2026-05-20');
      expect(tempo('dia 15', { referenceDate: refDate })).toBe('2026-05-15');
      expect(tempo('dez 25 2026', { referenceDate: refDate })).toBe('2026-12-25');
    });
  });

  describe('4. Feriados e Âncoras', () => {
    test('Datas fixas', () => {
      expect(tempo('natal', { referenceDate: refDate })).toBe('2026-12-25');
      expect(tempo('véspera de natal', { referenceDate: refDate })).toBe('2026-12-24');
      expect(tempo('ano novo', { referenceDate: refDate })).toBe('2026-01-01');
      expect(tempo('réveillon', { referenceDate: refDate })).toBe('2026-12-31');
    });

    test('Datas móveis (Cálculos específicos)', () => {
      expect(tempo('dia das mães', { referenceDate: refDate })).toBe('2026-05-10'); // 2º dom maio
      expect(tempo('dia dos pais', { referenceDate: refDate })).toBe('2026-08-09'); // 2º dom ago
      expect(tempo('páscoa', { referenceDate: refDate })).toBe('2026-04-05'); 
      expect(tempo('carnaval', { referenceDate: refDate })).toBe('2026-02-17'); 
    });
  });

  describe('5. Estruturais, Extremos e Composições', () => {
    test('Início e fim de períodos', () => {
      expect(tempo('início do ano', { referenceDate: refDate })).toBe('2026-01-01');
      expect(tempo('começo do ano', { referenceDate: refDate })).toBe('2026-01-01');
      expect(tempo('fim do ano', { referenceDate: refDate })).toBe('2026-12-31');
      expect(tempo('começo do mês', { referenceDate: refDate })).toBe('2026-05-01');
      expect(tempo('fim do mês', { referenceDate: refDate })).toBe('2026-05-31');
      expect(tempo('final do próximo mês', { referenceDate: refDate })).toBe('2026-06-30');
      expect(tempo('início da semana', { referenceDate: refDate })).toBe('2026-05-04'); // Seg
      expect(tempo('fim da semana', { referenceDate: refDate })).toBe('2026-05-10'); // Dom
    });

    test('Relativos estruturais', () => {
      expect(tempo('mês passado', { referenceDate: refDate })).toBe('2026-04-01');
      expect(tempo('próximo mês', { referenceDate: refDate })).toBe('2026-06-01');
      expect(tempo('este mês', { referenceDate: refDate })).toBe('2026-05-08');
      expect(tempo('ano passado', { referenceDate: refDate })).toBe('2025-01-01/2025-12-31');
      expect(tempo('ano que vem', { referenceDate: refDate })).toBe('2027-01-01/2027-12-31');
    });

    test('Composições com "antes de" e "depois de"', () => {
      expect(tempo('sexta antes do natal', { referenceDate: refDate })).toBe('2026-12-18');
      expect(tempo('domingo depois do dia das mães', { referenceDate: refDate })).toBe('2026-05-17');
      expect(tempo('segunda antes do fim do mes', { referenceDate: refDate })).toBe('2026-05-25');
    });
  });

  describe('6. Aritmética de Datas (+ / -)', () => {
    test('Matemática direta', () => {
      expect(tempo('hoje + 3 dias', { referenceDate: refDate })).toBe('2026-05-11');
      expect(tempo('hoje mais 3 dias', { referenceDate: refDate })).toBe('2026-05-11');
      expect(tempo('natal + 2', { referenceDate: refDate })).toBe('2026-12-27');
      expect(tempo('ontem menos 1 semana', { referenceDate: refDate })).toBe('2026-04-30');
      expect(tempo('fim de semana + 1 semana', { referenceDate: refDate })).toBe('2026-05-17'); // Cai no próximo domingo
      // O natal cai em 25, -2 = 23. E no ano novo?
      expect(tempo('ano novo - 2 dias', { referenceDate: refDate })).toBe('2025-12-30');
    });

    test('Matemática reversa (X tempo antes/depois)', () => {
      expect(tempo('3 dias antes do natal', { referenceDate: refDate })).toBe('2026-12-22');
      expect(tempo('2 semanas depois de amanhã', { referenceDate: refDate })).toBe('2026-05-23');
      expect(tempo('1 mes antes do carnaval', { referenceDate: refDate })).toBe('2026-01-17');
    });
  });

  describe('7. Intervalos (Ranges)', () => {
    test('Ranges explícitos', () => {
      expect(tempo('hoje a amanhã', { referenceDate: refDate })).toBe('2026-05-08/2026-05-09');
      expect(tempo('10 a 15 de maio', { referenceDate: refDate })).toBe('2026-05-10/2026-05-15');
      expect(tempo('segunda até sexta', { referenceDate: refDate })).toBe('2026-05-11/2026-05-15');
      expect(tempo('15/05 - 20/05', { referenceDate: refDate })).toBe('2026-05-15/2026-05-20');
      expect(tempo('natal ... ano novo', { referenceDate: refDate })).toBe('2026-12-25/2027-01-01');
      expect(tempo('ontem -> amanha', { referenceDate: refDate })).toBe('2026-05-07/2026-05-09');
    });

    test('Ranges mistos e com aritmética', () => {
      expect(tempo('hoje + 3 dias até hoje + 10 dias', { referenceDate: refDate })).toBe('2026-05-11/2026-05-18');
      expect(tempo('mes passado ate hoje', { referenceDate: refDate })).toBe('2026-04-01/2026-05-08');
      expect(tempo('2 meses atrás até hoje', { referenceDate: refDate })).toBe('2026-03-08/2026-05-08');
    });

    test('Ranges implícitos', () => {
      expect(tempo('fim de semana', { referenceDate: refDate })).toBe('2026-05-09/2026-05-10');
      expect(tempo('fds', { referenceDate: refDate })).toBe('2026-05-09/2026-05-10');
      expect(tempo('esta semana', { referenceDate: refDate })).toBe('2026-05-04/2026-05-10');
    });
  });

  describe('8. Tolerância a Erros (Fuzzy Matching)', () => {
    test('Correções leves em palavras-chave', () => {
      expect(tempo('amanah', { referenceDate: refDate })).toBe('2026-05-09'); // Fuzzy p/ amanhã
      expect(tempo('onem', { referenceDate: refDate })).toBe('2026-05-07'); // Fuzzy p/ ontem
    });

    test('Correções em meses e dias da semana', () => {
      expect(tempo('feveiro', { referenceDate: refDate })).toBe('2026-02-01'); // Fuzzy p/ fevereiro
      expect(tempo('quata', { referenceDate: refDate })).toBe('2026-05-13'); // Fuzzy p/ quarta
      expect(tempo('domngo', { referenceDate: refDate })).toBe('2026-05-10'); // Fuzzy p/ domingo
      expect(tempo('sabdo', { referenceDate: refDate })).toBe('2026-05-09'); // Fuzzy p/ sabado
      expect(tempo('dezembo', { referenceDate: refDate })).toBe('2026-12-01'); // Fuzzy p/ dezembro
    });

    test('Correções em feriados', () => {
      expect(tempo('natl', { referenceDate: refDate })).toBe('2026-12-25'); // Fuzzy p/ natal
      expect(tempo('reveilon', { referenceDate: refDate })).toBe('2026-12-31'); // Fuzzy p/ reveillon
    });
  });

  describe('10. Foco Profundo em Meses', () => {
    test('Ranges explícitos entre meses', () => {
      expect(tempo('15 de janeiro a 20 de fevereiro', { referenceDate: refDate })).toBe('2026-01-15/2026-02-20');
      expect(tempo('1 de marco ate 10 de maio', { referenceDate: refDate })).toBe('2026-03-01/2026-05-10');
      expect(tempo('10/10 a 05/11', { referenceDate: refDate })).toBe('2026-10-10/2026-11-05');
      // Intervalos que cruzam o ano implicitamente devem ajustar o ano (ex: Nov a Jan)
      expect(tempo('15 de novembro a 10 de janeiro', { referenceDate: refDate })).toBe('2026-11-15/2027-01-10'); 
    });

    test('Fuzzy matching extremo em nomes de meses', () => {
      // testando vários errinhos comuns de digitação em meses
      expect(tempo('janiero 15', { referenceDate: refDate })).toBe('2026-01-15');
      expect(tempo('feveiro 10', { referenceDate: refDate })).toBe('2026-02-10');
      expect(tempo('marrco 5', { referenceDate: refDate })).toBe('2026-03-05');
      expect(tempo('abril', { referenceDate: refDate })).toBe('2026-04-01'); // puro sem dia cai no dia 1
      expect(tempo('maoo 12', { referenceDate: refDate })).toBe('2026-05-12'); // 'maio' dist=1
      expect(tempo('juhno 20', { referenceDate: refDate })).toBe('2026-06-20');
      expect(tempo('jullho 25', { referenceDate: refDate })).toBe('2026-07-25');
      expect(tempo('agoto 5', { referenceDate: refDate })).toBe('2026-08-05');
      expect(tempo('setembo 10', { referenceDate: refDate })).toBe('2026-09-10');
      expect(tempo('otubro 15', { referenceDate: refDate })).toBe('2026-10-15');
      expect(tempo('novmebro 20', { referenceDate: refDate })).toBe('2026-11-20');
      expect(tempo('dezembo 25', { referenceDate: refDate })).toBe('2026-12-25');
    });

    test('Meses abreviados em pt-BR', () => {
      expect(tempo('10 jan 2026', { referenceDate: refDate })).toBe('2026-01-10');
      expect(tempo('fev 15', { referenceDate: refDate })).toBe('2026-02-15');
      expect(tempo('20 de mar', { referenceDate: refDate })).toBe('2026-03-20');
      expect(tempo('10 nov a 20 dez', { referenceDate: refDate })).toBe('2026-11-10/2026-12-20');
    });

    test('Bordas de meses específicos (inicio/fim)', () => {
      expect(tempo('inicio de fevereiro', { referenceDate: refDate })).toBe('2026-02-01');
      expect(tempo('fim de fevereiro', { referenceDate: refDate })).toBe('2026-02-28'); // 2026 não é bissexto
      expect(tempo('inicio de marco', { referenceDate: refDate })).toBe('2026-03-01');
      expect(tempo('fim de dezembro', { referenceDate: refDate })).toBe('2026-12-31');
    });

    test('Bordas de meses relativos', () => {
      expect(tempo('comeco do mes', { referenceDate: refDate })).toBe('2026-05-01');
      expect(tempo('final do mes', { referenceDate: refDate })).toBe('2026-05-31');
      expect(tempo('inicio do mes que vem', { referenceDate: refDate })).toBe('2026-06-01');
      expect(tempo('fim do mes passado', { referenceDate: refDate })).toBe('2026-04-30');
    });
  });

  describe('11. Novos Casos de Intervalos e "Pra"', () => {
    test('intervalos usando "pra" como delimitador', () => {
      expect(tempo('começo do ano pra março', { referenceDate: refDate })).toBe('2026-01-01/2026-03-01');
      expect(tempo('janeiro pra março', { referenceDate: refDate })).toBe('2026-01-01/2026-03-01');
      expect(tempo('segunda pra quarta', { referenceDate: refDate })).toBe('2026-05-11/2026-05-13');
    });

    test('começo do ano em diferentes combinações', () => {
      expect(tempo('do começo do ano até agora', { referenceDate: refDate })).toBe('2026-01-01/2026-05-08');
      expect(tempo('começo do ano até natal', { referenceDate: refDate })).toBe('2026-01-01/2026-12-25');
    });
  });

  describe('9. Casos Falhos ou Nulos', () => {
    test('Inputs inválidos devem retornar nulo', () => {
      expect(tempo('', { referenceDate: refDate })).toBeNull();
      expect(tempo('batata', { referenceDate: refDate })).toBeNull();
      expect(tempo('eu quero comer bolo', { referenceDate: refDate })).toBeNull();
    });
  });
});
