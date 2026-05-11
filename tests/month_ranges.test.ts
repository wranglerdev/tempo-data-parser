import { tempo } from '../src/index';

/**
 * Suíte focada exclusivamente em ranges e pontos de mês, exercitando:
 *  - Todos os 12 meses por nome completo e abreviado
 *  - forceRange: true com entradas de mês
 *  - restrictTo: 'month' — filtro e comportamento esperado
 *  - forceRange + restrictTo: 'month' combinados
 *  - Ranges explícitos (mês A até mês B)
 *  - Ranges relativos (mês passado, próximo mês, etc.)
 *  - Bordas de mês (início, fim, meados)
 *  - Mês com ano explícito
 *  - Expressões mistas (relativo + mês)
 */
describe('Tempo (PT-BR) - Ranges de Mês', () => {
  // Ref: sábado 09/05/2026 — mesma data base dos testes principais
  const refDate = new Date(2026, 4, 9);

  // ───────────────────────────────────────────────────────────────────────
  // 1. Os 12 meses como ponto único (sem forceRange, sem restrictTo)
  // ───────────────────────────────────────────────────────────────────────
  describe('1. Todos os meses como ponto (nome completo)', () => {
    const opt = { referenceDate: refDate };

    test('janeiro a dezembro — retorna o primeiro dia de cada mês de 2026', () => {
      expect(tempo('janeiro',  opt)).toBe('2026-01-01');
      expect(tempo('fevereiro', opt)).toBe('2026-02-01');
      expect(tempo('março',    opt)).toBe('2026-03-01');
      expect(tempo('abril',    opt)).toBe('2026-04-01');
      expect(tempo('maio',     opt)).toBe('2026-05-01');
      expect(tempo('junho',    opt)).toBe('2026-06-01');
      expect(tempo('julho',    opt)).toBe('2026-07-01');
      expect(tempo('agosto',   opt)).toBe('2026-08-01');
      expect(tempo('setembro', opt)).toBe('2026-09-01');
      expect(tempo('outubro',  opt)).toBe('2026-10-01');
      expect(tempo('novembro', opt)).toBe('2026-11-01');
      expect(tempo('dezembro', opt)).toBe('2026-12-01');
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 2. Meses abreviados
  // ───────────────────────────────────────────────────────────────────────
  describe('2. Todos os meses abreviados (3 letras)', () => {
    const opt = { referenceDate: refDate };

    test('abreviações jan–dez', () => {
      expect(tempo('jan', opt)).toBe('2026-01-01');
      expect(tempo('fev', opt)).toBe('2026-02-01');
      expect(tempo('mar', opt)).toBe('2026-03-01');
      expect(tempo('abr', opt)).toBe('2026-04-01');
      expect(tempo('mai', opt)).toBe('2026-05-01');
      expect(tempo('jun', opt)).toBe('2026-06-01');
      expect(tempo('jul', opt)).toBe('2026-07-01');
      expect(tempo('ago', opt)).toBe('2026-08-01');
      expect(tempo('set', opt)).toBe('2026-09-01');
      expect(tempo('out', opt)).toBe('2026-10-01');
      expect(tempo('nov', opt)).toBe('2026-11-01');
      expect(tempo('dez', opt)).toBe('2026-12-01');
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 3. Mês com ano explícito
  // ───────────────────────────────────────────────────────────────────────
  describe('3. Mês com ano explícito', () => {
    const opt = { referenceDate: refDate };

    test('janeiro de 2025', () => {
      expect(tempo('janeiro de 2025', opt)).toBe('2025-01-01');
    });

    test('março 2027', () => {
      expect(tempo('março 2027', opt)).toBe('2027-03-01');
    });

    test('nov 2024', () => {
      expect(tempo('nov 2024', opt)).toBe('2024-11-01');
    });

    test('fev 2028 (futuro distante)', () => {
      expect(tempo('fev 2028', opt)).toBe('2028-02-01');
    });

    test('formato numérico 2026/01 → primeiro de janeiro de 2026', () => {
      expect(tempo('2026/01', opt)).toBe('2026-01-01');
    });

    test('formato numérico 2025/11 → primeiro de novembro de 2025', () => {
      expect(tempo('2025/11', opt)).toBe('2025-11-01');
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 4. Expressões relativas de mês (mês passado, próximo mês, etc.)
  // ───────────────────────────────────────────────────────────────────────
  describe('4. Expressões relativas de mês', () => {
    const opt = { referenceDate: refDate };

    test('mês passado → 2026-04-01', () => {
      expect(tempo('mês passado', opt)).toBe('2026-04-01');
    });

    test('mês retrasado → 2026-03-01', () => {
      expect(tempo('mês retrasado', opt)).toBe('2026-03-01');
    });

    test('próximo mês → 2026-06-01', () => {
      expect(tempo('próximo mês', opt)).toBe('2026-06-01');
    });

    test('mês que vem → 2026-06-01', () => {
      expect(tempo('mês que vem', opt)).toBe('2026-06-01');
    });

    test('este mês / mês → retorna a data de referência (dentro do mês)', () => {
      expect(tempo('este mês', opt)).toBe('2026-05-09');
    });

    test('3 meses atrás → 2026-02-09', () => {
      expect(tempo('3 meses atrás', opt)).toBe('2026-02-09');
    });

    test('2 meses atrás → 2026-03-09', () => {
      expect(tempo('2 meses atrás', opt)).toBe('2026-03-09');
    });

    test('daqui a 1 mês → 2026-06-09', () => {
      expect(tempo('daqui a 1 mês', opt)).toBe('2026-06-09');
    });

    test('daqui a 3 meses → 2026-08-09', () => {
      expect(tempo('daqui a 3 meses', opt)).toBe('2026-08-09');
    });

    test('em 6 meses → 2026-11-09', () => {
      expect(tempo('em 6 meses', opt)).toBe('2026-11-09');
    });

    test('faz 1 mês → 2026-04-09', () => {
      expect(tempo('faz 1 mês', opt)).toBe('2026-04-09');
    });

    test('tem 2 meses → 2026-03-09', () => {
      expect(tempo('tem 2 meses', opt)).toBe('2026-03-09');
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 5. Bordas de mês (início, fim, meados)
  // ───────────────────────────────────────────────────────────────────────
  describe('5. Bordas de mês', () => {
    const opt = { referenceDate: refDate };

    test('início do mês → 2026-05-01', () => {
      expect(tempo('início do mês', opt)).toBe('2026-05-01');
    });

    test('começo do mês → 2026-05-01', () => {
      expect(tempo('começo do mês', opt)).toBe('2026-05-01');
    });

    test('fim do mês → 2026-05-31', () => {
      expect(tempo('fim do mês', opt)).toBe('2026-05-31');
    });

    test('final do mês → 2026-05-31', () => {
      expect(tempo('final do mês', opt)).toBe('2026-05-31');
    });

    test('meados do mês → 2026-05-15', () => {
      expect(tempo('meados do mês', opt)).toBe('2026-05-15');
    });

    test('início do mês passado → 2026-04-01', () => {
      expect(tempo('início do mês passado', opt)).toBe('2026-04-01');
    });

    test('fim do mês passado → 2026-04-30', () => {
      expect(tempo('fim do mês passado', opt)).toBe('2026-04-30');
    });

    test('início do próximo mês → 2026-06-01', () => {
      expect(tempo('início do próximo mês', opt)).toBe('2026-06-01');
    });

    test('fim do próximo mês → 2026-06-30', () => {
      expect(tempo('fim do próximo mês', opt)).toBe('2026-06-30');
    });

    test('início de fevereiro → 2026-02-01', () => {
      expect(tempo('início de fevereiro', opt)).toBe('2026-02-01');
    });

    test('fim de fevereiro → 2026-02-28 (2026 não é bissexto)', () => {
      expect(tempo('fim de fevereiro', opt)).toBe('2026-02-28');
    });

    test('fim de fevereiro de 2024 → 2024-02-29 (2024 é bissexto)', () => {
      expect(tempo('fim de fevereiro de 2024', opt)).toBe('2024-02-29');
    });

    test('meados de março → 2026-03-15', () => {
      expect(tempo('meados de março', opt)).toBe('2026-03-15');
    });

    test('meados de outubro → 2026-10-15', () => {
      expect(tempo('meados de outubro', opt)).toBe('2026-10-15');
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 6. Ranges explícitos entre meses
  // ───────────────────────────────────────────────────────────────────────
  describe('6. Ranges explícitos mês A → mês B', () => {
    const opt = { referenceDate: refDate };

    test('"janeiro a março"', () => {
      expect(tempo('janeiro a março', opt)).toBe('2026-01-01/2026-03-01');
    });

    test('"de janeiro até março"', () => {
      expect(tempo('de janeiro até março', opt)).toBe('2026-01-01/2026-03-01');
    });

    test('"de fevereiro até abril"', () => {
      expect(tempo('de fevereiro até abril', opt)).toBe('2026-02-01/2026-04-01');
    });

    test('"de janeiro a dezembro"', () => {
      expect(tempo('de janeiro a dezembro', opt)).toBe('2026-01-01/2026-12-01');
    });

    test('"jan até mar"', () => {
      expect(tempo('jan até mar', opt)).toBe('2026-01-01/2026-03-01');
    });

    test('"jan a mar"', () => {
      expect(tempo('jan a mar', opt)).toBe('2026-01-01/2026-03-01');
    });

    test('"janeiro pra março"', () => {
      expect(tempo('janeiro pra março', opt)).toBe('2026-01-01/2026-03-01');
    });

    test('"fev ao abr"', () => {
      expect(tempo('fev ao abr', opt)).toBe('2026-02-01/2026-04-01');
    });

    test('"de jan até agora"', () => {
      expect(tempo('de jan até agora', opt)).toBe('2026-01-01/2026-05-09');
    });

    test('"de março pra cá"', () => {
      expect(tempo('de março pra cá', opt)).toBe('2026-03-01/2026-05-09');
    });

    test('"de janeiro até hoje"', () => {
      expect(tempo('de janeiro até hoje', opt)).toBe('2026-01-01/2026-05-09');
    });

    test('"entre janeiro e março"', () => {
      expect(tempo('entre janeiro e março', opt)).toBe('2026-01-01/2026-03-01');
    });

    test('"10 nov a 20 dez"', () => {
      expect(tempo('10 nov a 20 dez', opt)).toBe('2026-11-10/2026-12-20');
    });

    test('"15 de janeiro a 20 de fevereiro"', () => {
      expect(tempo('15 de janeiro a 20 de fevereiro', opt)).toBe('2026-01-15/2026-02-20');
    });

    test('"1 de março ate 10 de maio"', () => {
      expect(tempo('1 de março ate 10 de maio', opt)).toBe('2026-03-01/2026-05-10');
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 7. Ranges relativos de mês ("últimos N meses", "do mês passado pra cá")
  // ───────────────────────────────────────────────────────────────────────
  describe('7. Ranges relativos de mês', () => {
    const opt = { referenceDate: refDate };

    test('"do mês passado pra cá"', () => {
      expect(tempo('do mês passado pra cá', opt)).toBe('2026-04-09/2026-05-09');
    });

    test('"último mês"', () => {
      expect(tempo('último mês', opt)).toBe('2026-04-09/2026-05-09');
    });

    test('"últimos 2 meses"', () => {
      expect(tempo('últimos 2 meses', opt)).toBe('2026-03-09/2026-05-09');
    });

    test('"últimos 3 meses"', () => {
      expect(tempo('últimos 3 meses', opt)).toBe('2026-02-09/2026-05-09');
    });

    test('"dos últimos 6 meses"', () => {
      expect(tempo('dos últimos 6 meses', opt)).toBe('2025-11-09/2026-05-09');
    });

    test('"dos últimos 12 meses"', () => {
      expect(tempo('dos últimos 12 meses', opt)).toBe('2025-05-09/2026-05-09');
    });

    test('"mes passado inteiro"', () => {
      expect(tempo('mes passado inteiro', opt)).toBe('2026-04-01/2026-04-30');
    });

    test('"de 1 mês atrás até hoje"', () => {
      expect(tempo('de 1 mês atrás até hoje', opt)).toBe('2026-04-09/2026-05-09');
    });

    test('"de 3 meses atrás até hoje"', () => {
      expect(tempo('de 3 meses atrás até hoje', opt)).toBe('2026-02-09/2026-05-09');
    });

    test('"mês passado até hoje"', () => {
      expect(tempo('mês passado até hoje', opt)).toBe('2026-04-01/2026-05-09');
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 8. forceRange: true com entradas de mês
  // ───────────────────────────────────────────────────────────────────────
  describe('8. forceRange: true com meses', () => {
    const optFR = { referenceDate: refDate, forceRange: true };

    test('janeiro (passado) → 2026-01-01/2026-05-09', () => {
      expect(tempo('janeiro', optFR)).toBe('2026-01-01/2026-05-09');
    });

    test('fevereiro (passado) → 2026-02-01/2026-05-09', () => {
      expect(tempo('fevereiro', optFR)).toBe('2026-02-01/2026-05-09');
    });

    test('março (passado) → 2026-03-01/2026-05-09', () => {
      expect(tempo('março', optFR)).toBe('2026-03-01/2026-05-09');
    });

    test('abril (passado) → 2026-04-01/2026-05-09', () => {
      expect(tempo('abril', optFR)).toBe('2026-04-01/2026-05-09');
    });

    test('maio (coincide com mês atual) → 2026-05-01/2026-05-09', () => {
      // maio/2026 = 01/05 < ref 09/05 → passado
      expect(tempo('maio', optFR)).toBe('2026-05-01/2026-05-09');
    });

    test('junho (futuro) → 2026-05-09/2026-06-01', () => {
      expect(tempo('junho', optFR)).toBe('2026-05-09/2026-06-01');
    });

    test('dezembro (futuro) → 2026-05-09/2026-12-01', () => {
      expect(tempo('dezembro', optFR)).toBe('2026-05-09/2026-12-01');
    });

    test('mês passado (relativo, passado) → 2026-04-01/2026-05-09', () => {
      expect(tempo('mês passado', optFR)).toBe('2026-04-01/2026-05-09');
    });

    test('próximo mês (futuro) → 2026-05-09/2026-06-01', () => {
      expect(tempo('próximo mês', optFR)).toBe('2026-05-09/2026-06-01');
    });

    test('3 meses atrás (passado) → 2026-02-09/2026-05-09', () => {
      expect(tempo('3 meses atrás', optFR)).toBe('2026-02-09/2026-05-09');
    });

    test('daqui a 2 meses (futuro) → 2026-05-09/2026-07-09', () => {
      expect(tempo('daqui a 2 meses', optFR)).toBe('2026-05-09/2026-07-09');
    });

    test('início do mês (passado, 01/05 < 09/05) → 2026-05-01/2026-05-09', () => {
      expect(tempo('início do mês', optFR)).toBe('2026-05-01/2026-05-09');
    });

    test('fim do mês (futuro, 31/05 > 09/05) → 2026-05-09/2026-05-31', () => {
      expect(tempo('fim do mês', optFR)).toBe('2026-05-09/2026-05-31');
    });

    test('não altera um range explícito que já contém "/"', () => {
      expect(tempo('de janeiro até março', optFR)).toBe('2026-01-01/2026-03-01');
    });

    test('último mês (já é range) → não altera', () => {
      expect(tempo('último mês', optFR)).toBe('2026-04-09/2026-05-09');
    });

    test('retorna null para entrada inválida mesmo com forceRange', () => {
      expect(tempo('treze meses', optFR)).toBeNull();
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 9. restrictTo: 'month' — filtro de granularidade
  // ───────────────────────────────────────────────────────────────────────
  describe('9. restrictTo: "month" — filtro', () => {
    const optRM = { referenceDate: refDate, restrictTo: 'month' as const };

    describe('9a. Entradas válidas (devem passar)', () => {
      test('nome de mês simples', () => {
        expect(tempo('janeiro', optRM)).toBe('2026-01-01');
        expect(tempo('julho', optRM)).toBe('2026-07-01');
        expect(tempo('dezembro', optRM)).toBe('2026-12-01');
      });

      test('abreviação de mês', () => {
        expect(tempo('mar', optRM)).toBe('2026-03-01');
        expect(tempo('out', optRM)).toBe('2026-10-01');
      });

      test('mês com ano', () => {
        expect(tempo('março de 2025', optRM)).toBe('2025-03-01');
        expect(tempo('nov 2027', optRM)).toBe('2027-11-01');
      });

      test('expressões relativas de mês', () => {
        expect(tempo('mês passado', optRM)).toBe('2026-04-01');
        expect(tempo('próximo mês', optRM)).toBe('2026-06-01');
        expect(tempo('3 meses atrás', optRM)).toBe('2026-02-09');
      });

      test('range de meses', () => {
        expect(tempo('janeiro a março', optRM)).toBe('2026-01-01/2026-03-01');
        expect(tempo('de janeiro até agora', optRM)).toBe('2026-01-01/2026-05-09');
      });

      test('bordas de mês (início/fim contêm palavra "mês")', () => {
        expect(tempo('início do mês', optRM)).toBe('2026-05-01');
        expect(tempo('fim do mês', optRM)).toBe('2026-05-31');
      });
    });

    describe('9b. Entradas inválidas (devem retornar null)', () => {
      test('dia relativo → null', () => {
        expect(tempo('amanhã', optRM)).toBeNull();
        expect(tempo('hoje', optRM)).toBeNull();
        expect(tempo('ontem', optRM)).toBeNull();
      });

      test('dias relativos complexos → null', () => {
        expect(tempo('daqui a 3 dias', optRM)).toBeNull();
        expect(tempo('7 dias atrás', optRM)).toBeNull();
      });

      test('ano → null', () => {
        expect(tempo('ano que vem', optRM)).toBeNull();
        expect(tempo('2026', optRM)).toBeNull();
        expect(tempo('ano passado', optRM)).toBeNull();
      });

      test('semana → null', () => {
        expect(tempo('semana passada', optRM)).toBeNull();
        expect(tempo('esta semana', optRM)).toBeNull();
        expect(tempo('próxima semana', optRM)).toBeNull();
      });

      test('dia da semana → null', () => {
        expect(tempo('segunda-feira', optRM)).toBeNull();
        expect(tempo('sexta', optRM)).toBeNull();
      });

      test('feriado (sem mês no nome) → null', () => {
        expect(tempo('natal', optRM)).toBeNull();
        expect(tempo('carnaval', optRM)).toBeNull();
      });

      test('data numérica DD/MM/YYYY → null (dia-nível)', () => {
        expect(tempo('15/05/2026', optRM)).toBeNull();
        expect(tempo('01/01/2026', optRM)).toBeNull();
      });

      test('input inválido → null', () => {
        expect(tempo('batata', optRM)).toBeNull();
        expect(tempo('', optRM)).toBeNull();
      });
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 10. forceRange + restrictTo: 'month' combinados
  // ───────────────────────────────────────────────────────────────────────
  describe('10. forceRange + restrictTo: "month" combinados', () => {
    const optBoth = { referenceDate: refDate, forceRange: true, restrictTo: 'month' as const };

    test('janeiro (passado) → range até hoje', () => {
      expect(tempo('janeiro', optBoth)).toBe('2026-01-01/2026-05-09');
    });

    test('dezembro (futuro) → range de hoje', () => {
      expect(tempo('dezembro', optBoth)).toBe('2026-05-09/2026-12-01');
    });

    test('mês passado (passado) → range até hoje', () => {
      expect(tempo('mês passado', optBoth)).toBe('2026-04-01/2026-05-09');
    });

    test('próximo mês (futuro) → range de hoje', () => {
      expect(tempo('próximo mês', optBoth)).toBe('2026-05-09/2026-06-01');
    });

    test('range explícito já passado — não altera', () => {
      expect(tempo('de janeiro até março', optBoth)).toBe('2026-01-01/2026-03-01');
    });

    test('"amanhã" → null (filtrado por restrictTo)', () => {
      expect(tempo('amanhã', optBoth)).toBeNull();
    });

    test('"semana passada" → null (filtrado por restrictTo)', () => {
      expect(tempo('semana passada', optBoth)).toBeNull();
    });

    test('"2026" (só ano) → null (filtrado por restrictTo)', () => {
      expect(tempo('2026', optBoth)).toBeNull();
    });

    test('"natal" → null (feriado, sem nome de mês)', () => {
      expect(tempo('natal', optBoth)).toBeNull();
    });

    test('input inválido → null mesmo com ambas as opções', () => {
      expect(tempo('batata', optBoth)).toBeNull();
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 11. Casos limite de meses específicos (31 dias, 28/29 dias)
  // ───────────────────────────────────────────────────────────────────────
  describe('11. Limites de dias por mês', () => {
    const opt = { referenceDate: refDate };

    test('fim de janeiro → 31', () => {
      expect(tempo('fim de janeiro', opt)).toBe('2026-01-31');
    });

    test('fim de março → 31', () => {
      expect(tempo('fim de março', opt)).toBe('2026-03-31');
    });

    test('fim de abril → 30', () => {
      expect(tempo('fim de abril', opt)).toBe('2026-04-30');
    });

    test('fim de junho → 30', () => {
      expect(tempo('fim de junho', opt)).toBe('2026-06-30');
    });

    test('fim de setembro → 30', () => {
      expect(tempo('fim de setembro', opt)).toBe('2026-09-30');
    });

    test('fim de novembro → 30', () => {
      expect(tempo('fim de novembro', opt)).toBe('2026-11-30');
    });

    test('fim de fevereiro 2026 → 28 (não bissexto)', () => {
      expect(tempo('fim de fevereiro', opt)).toBe('2026-02-28');
    });

    test('fim de fevereiro 2024 → 29 (bissexto)', () => {
      expect(tempo('fim de fevereiro de 2024', opt)).toBe('2024-02-29');
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // 12. Ranges de mês cruzando o ano
  // ───────────────────────────────────────────────────────────────────────
  describe('12. Ranges de mês cruzando o ano', () => {
    const opt = { referenceDate: refDate };

    test('"novembro a janeiro" → nov/2026 a jan/2027 (cruzamento implícito)', () => {
      expect(tempo('novembro a janeiro', opt)).toBe('2026-11-01/2027-01-01');
    });

    test('"dezembro a fevereiro" → dez/2026 a fev/2027', () => {
      expect(tempo('dezembro a fevereiro', opt)).toBe('2026-12-01/2027-02-01');
    });

    test('"outubro de 2025 a janeiro de 2026" (anos explícitos)', () => {
      expect(tempo('outubro de 2025 a janeiro de 2026', opt)).toBe('2025-10-01/2026-01-01');
    });

    test('"desde o começo do ano" → 01/01/2026 até hoje', () => {
      expect(tempo('desde o começo do ano', opt)).toBe('2026-01-01/2026-05-09');
    });

    test('"do começo do ano até hoje"', () => {
      expect(tempo('do começo do ano até hoje', opt)).toBe('2026-01-01/2026-05-09');
    });
  });
});
