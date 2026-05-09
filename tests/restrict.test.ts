import { tempo } from '../src/index';

describe('Tempo (PT-BR) - Opção restrictTo', () => {
  const refDate = new Date(2026, 4, 9); // 09/05/2026

  describe('Universo: month', () => {
    const options = { referenceDate: refDate, restrictTo: 'month' as const };

    test('deve permitir expressões baseadas em meses', () => {
      expect(tempo('3 meses atrás', options)).toBe('2026-02-09');
      expect(tempo('janeiro', options)).toBe('2026-01-01');
      expect(tempo('mês passado', options)).toBe('2026-04-01');
      expect(tempo('janeiro a março', options)).toBe('2026-01-01/2026-03-01');
      expect(tempo('de janeiro até agora', options)).toBe('2026-01-01/2026-05-09');
    });

    test('deve bloquear expressões de outras unidades', () => {
      expect(tempo('amanhã', options)).toBeNull();
      expect(tempo('daqui a 3 dias', options)).toBeNull();
      expect(tempo('ano que vem', options)).toBeNull();
      expect(tempo('natal', options)).toBeNull();
    });
  });

  describe('Universo: year', () => {
    const options = { referenceDate: refDate, restrictTo: 'year' as const };

    test('deve permitir expressões baseadas em anos', () => {
      expect(tempo('ano passado', options)).toBe('2025-01-01/2025-12-31');
      expect(tempo('2026', options)).toBe('2026-01-01');
      expect(tempo('daqui a 2 anos', options)).toBe('2028-05-09');
    });

    test('deve bloquear outras unidades', () => {
      expect(tempo('esta semana', options)).toBeNull();
      expect(tempo('hoje', options)).toBeNull();
      expect(tempo('dezembro', options)).toBeNull();
    });
  });

  describe('Universo: day', () => {
    const options = { referenceDate: refDate, restrictTo: 'day' as const };

    test('deve permitir expressões baseadas em dias específicos', () => {
      expect(tempo('amanhã', options)).toBe('2026-05-10');
      expect(tempo('quinta-feira', options)).toBe('2026-05-14'); // Ref é sábado (9)
      expect(tempo('dia 15', options)).toBe('2026-05-15');
      expect(tempo('15/12/2026', options)).toBe('2026-12-15');
    });

    test('deve bloquear outras unidades', () => {
      expect(tempo('mês passado', options)).toBeNull();
      expect(tempo('ano que vem', options)).toBeNull();
      expect(tempo('esta semana', options)).toBeNull();
    });
  });

  describe('Universo: week', () => {
    const options = { referenceDate: refDate, restrictTo: 'week' as const };

    test('deve permitir expressões de semana', () => {
      expect(tempo('semana que vem', options)).toBe('2026-05-16');
      expect(tempo('esta semana', options)).toBe('2026-05-04/2026-05-10');
      expect(tempo('fim de semana', options)).toBe('2026-05-09/2026-05-10');
    });

    test('deve bloquear outras unidades', () => {
      expect(tempo('hoje', options)).toBeNull();
      expect(tempo('janeiro', options)).toBeNull();
    });
  });

  describe('Universo: holiday', () => {
    const options = { referenceDate: refDate, restrictTo: 'holiday' as const };

    test('deve permitir feriados', () => {
      expect(tempo('natal', options)).toBe('2026-12-25');
      expect(tempo('páscoa', options)).toBe('2026-04-05');
      expect(tempo('tiradentes', options)).toBe('2026-04-21');
    });

    test('deve bloquear datas absolutas que coincidem com feriados', () => {
      expect(tempo('25/12/2026', options)).toBeNull();
    });
  });

  describe('Comportamento Padrão (all)', () => {
    test('deve funcionar normalmente sem restrição', () => {
      expect(tempo('hoje', { referenceDate: refDate })).toBe('2026-05-09');
      expect(tempo('janeiro', { referenceDate: refDate })).toBe('2026-01-01');
    });
  });
});
