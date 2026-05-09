import { tempo } from '../src/index';

describe('Tempo (PT-BR) - Testes do Mapa (map.md)', () => {
  // Data base: 2026-05-09 (Sábado)
  const refDate = new Date(2026, 4, 9);
  const options = { referenceDate: refDate };

  describe('NÚMEROS POR EXTENSO', () => {
    test('Converte números por extenso em datas relativas', () => {
      expect(tempo('dois meses atrás', options)).toBe('2026-03-09');
      expect(tempo('três meses atrás', options)).toBe('2026-02-09');
      expect(tempo('três dias atrás', options)).toBe('2026-05-06');
      expect(tempo('um mês atrás', options)).toBe('2026-04-09');
      expect(tempo('duas semanas atrás', options)).toBe('2026-04-25');
      expect(tempo('um ano atrás', options)).toBe('2025-05-09');
    });
  });

  describe('FRASES HUMANAS REAIS', () => {
    test('Interpreta frases coloquiais', () => {
      expect(tempo('faz dois meses', options)).toBe('2026-03-09');
      expect(tempo('já faz 2 meses', options)).toBe('2026-03-09');
      expect(tempo('isso foi há 2 meses', options)).toBe('2026-03-09');
      expect(tempo('isso aconteceu semana passada', options)).toBe('2026-05-02');
      expect(tempo('isso foi no mês passado', options)).toBe('2026-04-01');
      expect(tempo('foi ano passado', options)).toBe('2025-01-01/2025-12-31');
      expect(tempo('até os dias de hoje', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('desde janeiro até hoje', options)).toBe('2026-01-01/2026-05-09');
    });
  });

  describe('ERROS DE DIGITAÇÃO', () => {
    test('Resiliência a erros comuns', () => {
      expect(tempo('2 meses atraz', options)).toBe('2026-03-09');
      expect(tempo('2 mezes atrás', options)).toBe('2026-03-09');
      expect(tempo('2 mes atras', options)).toBe('2026-03-09');
      expect(tempo('onte', options)).toBe('2026-05-08');
      expect(tempo('amanha', options)).toBe('2026-05-10');
      expect(tempo('agra', options)).toBe('2026-05-09');
    });
  });

  describe('ABREVIAÇÕES', () => {
    test('Interpreta abreviações de meses e palavras', () => {
      expect(tempo('jan até mar', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('jan a mar', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('fev até abr', options)).toBe('2026-02-01/2026-04-01');
      expect(tempo('ago a dez', options)).toBe('2026-08-01/2026-12-01');
      expect(tempo('hj', options)).toBe('2026-05-09');
      expect(tempo('ontem msm', options)).toBe('2026-05-08');
    });
  });

  describe('INTERVALOS NATURAIS', () => {
    test('Interpreta intervalos complexos', () => {
      expect(tempo('de janeiro pra cá', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('dos últimos 2 meses pra cá', options)).toBe('2026-03-09/2026-05-09');
      expect(tempo('do começo do mês até hoje', options)).toBe('2026-05-01/2026-05-09');
      expect(tempo('do começo do ano até agora', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('mês passado inteiro', options)).toBe('2026-04-01/2026-04-30');
      expect(tempo('entre janeiro e março', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('entre jan e mar', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('de março até maio', options)).toBe('2026-03-01/2026-05-01');
    });
  });

  describe('RELATIVOS DIFÍCEIS', () => {
    test('Expressões relativas avançadas', () => {
      expect(tempo('anteontem', options)).toBe('2026-05-07');
      expect(tempo('depois de amanhã', options)).toBe('2026-05-11');
      expect(tempo('no início do mês passado', options)).toBe('2026-04-01');
      expect(tempo('meados do mês passado', options)).toBe('2026-04-15');
      expect(tempo('fim do mês passado', options)).toBe('2026-04-30');
      expect(tempo('começo do ano', options)).toBe('2026-01-01');
      expect(tempo('fim do ano', options)).toBe('2026-12-31');
    });
  });

  describe('DIA DA SEMANA', () => {
    test('Interpreta dias da semana relativos', () => {
      expect(tempo('sexta passada', options)).toBe('2026-05-08');
      expect(tempo('sexta que vem', options)).toBe('2026-05-15');
      expect(tempo('segunda passada', options)).toBe('2026-05-04');
      expect(tempo('segunda que vem', options)).toBe('2026-05-11');
      expect(tempo('esse sábado', options)).toBe('2026-05-09');
    });
  });

  describe('FORMATAÇÕES DIFERENTES', () => {
    test('Interpreta diversos formatos de data', () => {
      expect(tempo('2026-05-09', options)).toBe('2026-05-09');
      expect(tempo('09-05-2026', options)).toBe('2026-05-09');
      expect(tempo('09.05.2026', options)).toBe('2026-05-09');
      expect(tempo('9 de maio de 2026', options)).toBe('2026-05-09');
      expect(tempo('09 maio 2026', options)).toBe('2026-05-09');
    });
  });

  describe('CAÓTICOS / INTERNET BR', () => {
    test('Resiliência a gírias e informalidades extremas', () => {
      expect(tempo('faz tipo uns 2 meses', options)).toBe('2026-03-09');
      expect(tempo('lá pra uns 2 meses atrás', options)).toBe('2026-03-09');
      expect(tempo('ontem de noite', options)).toBe('2026-05-08');
      expect(tempo('hoje cedo', options)).toBe('2026-05-09');
      expect(tempo('mais cedo hoje', options)).toBe('2026-05-09');
      expect(tempo('agorinha pouco', options)).toBe('2026-05-09');
      expect(tempo('nesse momento aí', options)).toBe('2026-05-09');
      expect(tempo('da semana passada pra cá', options)).toBe('2026-05-02/2026-05-09');
    });
  });

  describe('ISO + INTERVALOS', () => {
    test('Combina formatos ISO com conectores', () => {
      expect(tempo('2026-01-01 até hoje', options)).toBe('2026-01-01/2026-05-09');
      expect(tempo('2026-01 até 2026-03', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('de 2026-05-01 até agora', options)).toBe('2026-05-01/2026-05-09');
    });
  });

  describe('EDGE CASES IMPORTANTES', () => {
    test('Retorna null para entradas inválidas ou absurdas', () => {
      expect(tempo('há há há', options)).toBeNull();
      expect(tempo('32/32/2026', options)).toBeNull();
      expect(tempo('mês 99', options)).toBeNull();
      expect(tempo('janeiro até banana', options)).toBeNull();
      expect(tempo('ontem amanhã semana passada', options)).toBeNull();
      expect(tempo('------------', options)).toBeNull();
      expect(tempo('999999 dias atrás', options)).toBeNull();
      expect(tempo('faz muito tempo', options)).toBeNull();
    });
  });

  describe('LOCAIS / REGIONAIS', () => {
    test('Interpreta coloquialismos regionais', () => {
      expect(tempo('faz uns 2 mês aí', options)).toBe('2026-03-09');
      expect(tempo('ontê', options)).toBe('2026-05-08');
      expect(tempo('agorinha', options)).toBe('2026-05-09');
      expect(tempo('semana retrasada', options)).toBe('2026-04-25'); // 9 de maio (Sáb) -> passada 2 de maio -> retrasada 25 de abr
      expect(tempo('mês retrasado', options)).toBe('2026-03-01');
      expect(tempo('ano retrasado', options)).toBe('2024-01-01/2024-12-31');
    });
  });
});
