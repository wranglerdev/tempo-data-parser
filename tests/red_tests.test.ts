import { tempo } from '../src/index';

describe('Tempo (PT-BR) - Red Tests (Casos Desejados)', () => {
  // Data base: 2026-05-09 (Sábado)
  const refDate = new Date(2026, 4, 9);
  const options = { referenceDate: refDate };

  describe('1. Relativos Simples', () => {
    test('atrás / faz / tem', () => {
      expect(tempo('3 meses atrás', options)).toBe('2026-02-09');
      expect(tempo('2 meses atras', options)).toBe('2026-03-09');
      expect(tempo('7 dias atrás', options)).toBe('2026-05-02');
      expect(tempo('ontem', options)).toBe('2026-05-08');
      expect(tempo('hoje', options)).toBe('2026-05-09');
      expect(tempo('amanhã', options)).toBe('2026-05-10');
      expect(tempo('1 mês atrás', options)).toBe('2026-04-09');
      expect(tempo('1 ano atrás', options)).toBe('2025-05-09');
      expect(tempo('duas semanas atrás', options)).toBe('2026-04-25');
      expect(tempo('3 dias atras', options)).toBe('2026-05-06');
      expect(tempo('agora', options)).toBe('2026-05-09');
      expect(tempo('nesse instante', options)).toBe('2026-05-09');
      expect(tempo('neste momento', options)).toBe('2026-05-09');
    });
  });

  describe('2. Intervalos', () => {
    test('ranges com "até", "a", "pra"', () => {
      expect(tempo('2 meses atrás até hoje', options)).toBe('2026-03-09/2026-05-09');
      expect(tempo('de janeiro a março', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('de janeiro até agora', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('de janeiro até hoje', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('de fevereiro até abril', options)).toBe('2026-02-01/2026-04-01');
      expect(tempo('de janeiro a dezembro', options)).toBe('2026-01-01/2026-12-01');
      expect(tempo('de 1 mês atrás até hoje', options)).toBe('2026-04-09/2026-05-09');
      expect(tempo('dos últimos 7 dias até hoje', options)).toBe('2026-05-02/2026-05-09');
      expect(tempo('do começo do mês até hoje', options)).toBe('2026-05-01/2026-05-09');
      expect(tempo('do início do ano até agora', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('de ontem até hoje', options)).toBe('2026-05-08/2026-05-09');
      expect(tempo('de primeiro de maio até ontem', options)).toBe('2026-05-01/2026-05-08');
    });
  });

  describe('3. Datas Absolutas', () => {
    test('formatos variados', () => {
      expect(tempo('1 de janeiro de 2026', options)).toBe('2026-01-01');
      expect(tempo('25/12/2026', options)).toBe('2026-12-25');
      expect(tempo('09/05/2026', options)).toBe('2026-05-09');
      expect(tempo('29/02/2024', options)).toBe('2024-02-29');
      expect(tempo('15 de julho', options)).toBe('2026-07-15');
      expect(tempo('20 de novembro', options)).toBe('2026-11-20');
      expect(tempo('12 outubro 2025', options)).toBe('2025-10-12');
      expect(tempo('primeiro de junho', options)).toBe('2026-06-01');
    });
  });

  describe('4. Gírias / Variações', () => {
    test('informalidades e abreviações', () => {
      expect(tempo('ontê', options)).toBe('2026-05-08');
      expect(tempo('hj', options)).toBe('2026-05-09');
      expect(tempo('amanha', options)).toBe('2026-05-10');
      expect(tempo('faz 2 meses', options)).toBe('2026-03-09');
      expect(tempo('tem 1 mês', options)).toBe('2026-04-09');
      expect(tempo('faz 3 dias', options)).toBe('2026-05-06');
      expect(tempo('uma semana atrás', options)).toBe('2026-05-02');
      expect(tempo('do mês passado pra cá', options)).toBe('2026-04-09/2026-05-09');
      expect(tempo('de janeiro pra hoje', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('jan até mar', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('jan a mar', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('janeiro até março', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('de jan até mar', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('dos últimos 2 meses', options)).toBe('2026-03-09/2026-05-09');
      expect(tempo('último mês', options)).toBe('2026-04-09/2026-05-09');
      expect(tempo('última semana', options)).toBe('2026-05-02/2026-05-09');
      expect(tempo('últimas 24 horas', options)).toBe('2026-05-08/2026-05-09');
    });
  });

  describe('5. Regionais / Coloquiais', () => {
    test('linguagem natural BR', () => {
      expect(tempo('2 mês atrás', options)).toBe('2026-03-09');
      expect(tempo('faz uns 2 meses aí', options)).toBe('2026-03-09');
      expect(tempo('uns 2 meses atrás', options)).toBe('2026-03-09');
      expect(tempo('uma semana pra trás', options)).toBe('2026-05-02');
      
      // Ajustado de 2026-04-09 para 2026-03-09 (2 meses atrás) ou 2026-03-01 (mês retrasado)
      // O usuário sugeriu 2026-04-09 mas comentou "dependendo da regra pode ser: 2026-03-01"
      // Se hoje é Maio, Mês Passado = Abril, Mês Retrasado = Março.
      expect(tempo('mês retrasado', options)).toBe('2026-03-01');
      
      expect(tempo('mês passado', options)).toBe('2026-04-01');
      expect(tempo('mês que vem', options)).toBe('2026-06-01');
      expect(tempo('ano passado', options)).toBe('2025-01-01/2025-12-31');
      expect(tempo('ano que vem', options)).toBe('2027-01-01/2027-12-31');
      expect(tempo('agorinha', options)).toBe('2026-05-09');
      expect(tempo('nesse exato momento', options)).toBe('2026-05-09');
    });
  });

  describe('6. Casos Ambíguos', () => {
    test('inferências e ambiguidades', () => {
      // Como hoje é sábado (09/05), sexta-feira pode ser ontem ou próxima sexta.
      // Geralmente "sexta-feira" sozinho num sábado resolve para a anterior ou próxima dependendo da implementação.
      // O usuário não deu o esperado exato, mas vamos testar a existência de uma resolução.
      expect(tempo('sexta-feira', options)).not.toBeNull();
      expect(tempo('sexta que vem', options)).toBe('2026-05-15');
      expect(tempo('sexta retrasada', options)).toBe('2026-05-01'); // Sexta passada foi 08/05, retrasada 01/05? 
      // Ou 08/05 foi ontem. Se "sexta passada" é 08/05, "retrasada" é 01/05.
      
      expect(tempo('10 de março', options)).toBe('2026-03-10');
    });
  });

  describe('7. Edge Cases', () => {
    test('casos de erro ou limite', () => {
      expect(tempo('', options)).toBeNull();
      expect(tempo('banana', options)).toBeNull();
      expect(tempo('32 de janeiro', options)).toBeNull();
      expect(tempo('ontem amanhã', options)).toBeNull();
      expect(tempo('999 meses atrás', options)).toBeNull();
      expect(tempo('janeiro até banana', options)).toBeNull();
    });
  });

  describe('8. Categorias Extras', () => {
    test('abreviações', () => {
      expect(tempo('jan', options)).toBe('2026-01-01');
      expect(tempo('fev', options)).toBe('2026-02-01');
      expect(tempo('set', options)).toBe('2026-09-01');
    });

    test('erros ortográficos toleráveis', () => {
      expect(tempo('atraz', options)).toBe('2026-05-09'); // Depende se o parser trata como "hoje" + "atrás" ou ignora
      // Na verdade '3 dias atraz' -> '2026-05-06'
      expect(tempo('3 dias atraz', options)).toBe('2026-05-06');
      expect(tempo('jantiro', options)).toBe('2026-01-01'); // Fuzzy match para janeiro
    });

    test('números por extenso', () => {
      expect(tempo('dois meses atrás', options)).toBe('2026-03-09');
      expect(tempo('vinte e um de maio', options)).toBe('2026-05-21');
    });

    test('intervalos naturais', () => {
      expect(tempo('entre janeiro e março', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('de março pra cá', options)).toBe('2026-03-01/2026-05-09');
      expect(tempo('até semana passada', options)).toBe('2026-01-01/2026-05-03'); // Exemplo de fim da semana passada
    });

    test('linguagem informal e expressões BR', () => {
      expect(tempo('desde o começo do ano', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('da virada do ano até hoje', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('anteontem', options)).toBe('2026-05-07');
      expect(tempo('depois de amanhã', options)).toBe('2026-05-11');
      expect(tempo('meados de abril', options)).toBe('2026-04-15');
      expect(tempo('no natal', options)).toBe('2026-12-25');
    });
  });
});
