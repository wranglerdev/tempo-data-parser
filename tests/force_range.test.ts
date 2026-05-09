import { tempo } from '../src/index';

describe('Tempo (PT-BR) - Opção forceRange', () => {
  // Data base fixa: 2026-05-09 (Sábado)
  const refDate = new Date(2026, 4, 9);
  const options = { referenceDate: refDate, forceRange: true };

  test('Converte datas únicas no passado em um intervalo até a data de referência', () => {
    // "3 meses atrás" -> 2026-02-09 até 2026-05-09
    expect(tempo('3 meses atrás', options)).toBe('2026-02-09/2026-05-09');
    
    // "ontem" -> 2026-05-08 até 2026-05-09
    expect(tempo('ontem', options)).toBe('2026-05-08/2026-05-09');

    // "semana passada" -> 2026-05-02 até 2026-05-09
    expect(tempo('semana passada', options)).toBe('2026-05-02/2026-05-09');
  });

  test('Converte datas únicas no futuro em um intervalo da data de referência até a data futura', () => {
    // "daqui a 3 dias" -> 2026-05-09 até 2026-05-12
    expect(tempo('daqui a 3 dias', options)).toBe('2026-05-09/2026-05-12');
    
    // "amanhã" -> 2026-05-09 até 2026-05-10
    expect(tempo('amanhã', options)).toBe('2026-05-09/2026-05-10');

    // "próxima sexta" -> Sexta que vem é 2026-05-15. Intervalo: 2026-05-09/2026-05-15
    expect(tempo('próxima sexta', options)).toBe('2026-05-09/2026-05-15');
  });

  test('Não altera expressões que já retornam um intervalo', () => {
    expect(tempo('segunda até sexta', options)).toBe('2026-05-11/2026-05-15');
    expect(tempo('de janeiro pra cá', options)).toBe('2026-01-01/2026-05-09');
  });

  test('Retorna a data de referência espelhada se a data bater com "hoje"', () => {
    expect(tempo('hoje', options)).toBe('2026-05-09/2026-05-09');
    expect(tempo('agora', options)).toBe('2026-05-09/2026-05-09');
  });

  test('Retorna null para entradas inválidas mesmo com forceRange', () => {
    expect(tempo('32 de janeiro', options)).toBeNull();
    expect(tempo('batata', options)).toBeNull();
  });
});
