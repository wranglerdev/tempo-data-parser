import { tempo } from '../src/index';

describe('Tempo (PT-BR) - Sinergia forceRange + restrictTo + Âncoras', () => {
  // Data base: 09/05/2026 (Sábado)
  const refDate = new Date(2026, 4, 9);
  const options = { referenceDate: refDate };

  describe('Sinergia: restrictTo: month + forceRange: true', () => {
    const monthOptions = { ...options, restrictTo: 'month' as const, forceRange: true };

    test('deve permitir e expandir "3 meses atrás"', () => {
      expect(tempo('3 meses atrás', monthOptions)).toBe('2026-02-09/2026-05-09');
    });

    test('deve permitir e manter range de meses "janeiro a março"', () => {
      expect(tempo('janeiro a março', monthOptions)).toBe('2026-01-01/2026-03-01');
    });

    test('deve permitir e manter range "de janeiro até agora"', () => {
      expect(tempo('de janeiro até agora', monthOptions)).toBe('2026-01-01/2026-05-09');
    });

    test('deve bloquear "começo do ano" (unidade year)', () => {
      expect(tempo('começo do ano', monthOptions)).toBeNull();
    });

    test('deve bloquear feriados (unidade holiday)', () => {
      expect(tempo('reveillon', monthOptions)).toBeNull();
      expect(tempo('natal', monthOptions)).toBeNull();
    });
  });

  describe('Sinergia: restrictTo: year + forceRange: true', () => {
    const yearOptions = { ...options, restrictTo: 'year' as const, forceRange: true };

    test('deve permitir e expandir "começo do ano"', () => {
      expect(tempo('começo do ano', yearOptions)).toBe('2026-01-01/2026-05-09');
    });

    test('deve permitir e manter range "ano passado"', () => {
      expect(tempo('ano passado', yearOptions)).toBe('2025-01-01/2025-12-31');
    });
  });

  describe('Novas Âncoras (Início, Meio, Fim)', () => {
    test('deve interpretar "começo do mês" como dia 1', () => {
      expect(tempo('começo do mês', options)).toBe('2026-05-01');
    });

    test('deve interpretar "meio do mês" como dia 15', () => {
      expect(tempo('meio do mês', options)).toBe('2026-05-15');
      expect(tempo('meados do mês', options)).toBe('2026-05-15');
    });

    test('deve interpretar "fim do mês" como último dia do mês', () => {
      expect(tempo('fim do mês', options)).toBe('2026-05-31');
    });

    test('deve interpretar "meio do ano" como 15 de junho', () => {
      expect(tempo('meio do ano', options)).toBe('2026-06-15');
    });
  });

  describe('Fuzzy para Feriados (Resiliência)', () => {
    test('deve aceitar variações de reveillon', () => {
      expect(tempo('reveion', options)).toBe('2026-12-31');
      expect(tempo('reveilon', options)).toBe('2026-12-31');
    });
  });
});
