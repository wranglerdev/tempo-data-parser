import { tempo } from '../src/index';

/**
 * Suíte focada em casos-limite (outliers) que expõem comportamentos inesperados:
 *  - Prefixo "do dia" com datas numéricas em ranges (Bug #1)
 *  - Inferência de ano errada quando mês ainda não ocorreu (Bug #2)
 *  - Ranges que cruzam o ano
 *  - Datas absolutas no futuro em ranges
 *  - Datas inválidas dentro de ranges
 */
describe('Tempo (PT-BR) - Outliers & Edge Cases', () => {
  // Abril de 2026 — contexto relatado nos bugs
  const refDate = new Date(2026, 3, 15); // 15/04/2026 (quarta-feira)
  const opt = { referenceDate: refDate };

  // ─────────────────────────────────────────────────────────────────────────
  // BUG #1 — Prefixo "do dia" com formato numérico DD/MM/YYYY em ranges
  //
  // "05/11/2025 até hoje" funciona, mas "do dia 05/11/2025 até hoje" falha
  // porque o token "dia" fica junto ao número após strip do "do " e o parser
  // numérico não reconhece "dia 05 11 2025".
  // ─────────────────────────────────────────────────────────────────────────
  describe('Bug #1 — prefixo "do dia" com data numérica em range', () => {
    test('caso base funciona sem o prefixo', () => {
      expect(tempo('05/11/2025 até hoje', opt)).toBe('2025-11-05/2026-04-15');
    });

    test('[BUG] "Do dia 05/11/2025 até hoje" deve retornar o mesmo range', () => {
      expect(tempo('Do dia 05/11/2025 até hoje', opt)).toBe('2025-11-05/2026-04-15');
    });

    test('[BUG] "do dia 01/01/2026 até agora"', () => {
      expect(tempo('do dia 01/01/2026 até agora', opt)).toBe('2026-01-01/2026-04-15');
    });

    test('[BUG] "desde o dia 10/03/2026 até hoje"', () => {
      expect(tempo('desde o dia 10/03/2026 até hoje', opt)).toBe('2026-03-10/2026-04-15');
    });

    test('[BUG] "do dia 15/02/2026 até hoje"', () => {
      expect(tempo('do dia 15/02/2026 até hoje', opt)).toBe('2026-02-15/2026-04-15');
    });

    test('[BUG] "do dia 20/03/26 até hoje" (ano com 2 dígitos)', () => {
      expect(tempo('do dia 20/03/26 até hoje', opt)).toBe('2026-03-20/2026-04-15');
    });

    // Com mês por extenso — deve funcionar (controle, não é o bug)
    test('controle: "do dia 15 de março até hoje" funciona (mês por extenso)', () => {
      expect(tempo('do dia 15 de março até hoje', opt)).toBe('2026-03-15/2026-04-15');
    });

    test('controle: "do dia 1 de janeiro até hoje" funciona (mês por extenso)', () => {
      expect(tempo('do dia 1 de janeiro até hoje', opt)).toBe('2026-01-01/2026-04-15');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // BUG #2 — Mês por extenso sem ano em range: resolve para o futuro em vez
  // do passado quando o mês ainda não ocorreu no ano corrente em relação à
  // data de referência.
  //
  // "do dia 11 de novembro ate hoje" com ref=Abril 2026 deve retornar
  // 2025-11-11/2026-04-15, não 2026-11-11/2027-04-15.
  // ─────────────────────────────────────────────────────────────────────────
  describe('Bug #2 — inferência de ano em ranges com mês futuro', () => {
    test('[BUG] "do dia 11 de novembro ate hoje" — novembro ainda não ocorreu este ano', () => {
      expect(tempo('do dia 11 de novembro ate hoje', opt)).toBe('2025-11-11/2026-04-15');
    });

    test('[BUG] "de novembro ate hoje" — deve usar novembro do ano passado', () => {
      expect(tempo('de novembro ate hoje', opt)).toBe('2025-11-01/2026-04-15');
    });

    test('[BUG] "de outubro até hoje" — outubro ainda não ocorreu este ano', () => {
      expect(tempo('de outubro até hoje', opt)).toBe('2025-10-01/2026-04-15');
    });

    test('[BUG] "de setembro a hoje" — setembro ainda não ocorreu este ano', () => {
      expect(tempo('de setembro a hoje', opt)).toBe('2025-09-01/2026-04-15');
    });

    test('[BUG] "de maio a hoje" — maio ainda não ocorreu este ano (ref=abril)', () => {
      expect(tempo('de maio a hoje', opt)).toBe('2025-05-01/2026-04-15');
    });

    // Mês JÁ ocorrido — não deve alterar o ano (controle)
    test('controle: "de janeiro até hoje" — janeiro já passou, deve usar 2026', () => {
      expect(tempo('de janeiro até hoje', opt)).toBe('2026-01-01/2026-04-15');
    });

    test('controle: "de fevereiro ate hoje" — fevereiro já passou, deve usar 2026', () => {
      expect(tempo('de fevereiro ate hoje', opt)).toBe('2026-02-01/2026-04-15');
    });

    test('controle: "de março ate hoje" — março já passou, deve usar 2026', () => {
      expect(tempo('de março ate hoje', opt)).toBe('2026-03-01/2026-04-15');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Ranges cruzando o ano
  // ─────────────────────────────────────────────────────────────────────────
  describe('Ranges cruzando virada de ano', () => {
    test('novembro de 2025 a janeiro de 2026 (anos explícitos)', () => {
      expect(tempo('15/11/2025 até 15/01/2026', opt)).toBe('2025-11-15/2026-01-15');
    });

    test('natal até ano novo implícito (dez para jan)', () => {
      // natal=25/12/2026, ano novo=01/01/2027 → jan < dez, +1 ano no fim
      expect(tempo('natal até ano novo', opt)).toBe('2026-12-25/2027-01-01');
    });

    test('novembro a janeiro (sem ano, cruzamento implícito)', () => {
      // novembro > ref, mas start > end → +1 ano no end
      // Com ref=abril: novembro=nov/2026, janeiro=jan/2026 → end < start → +1 → jan/2027
      // Comportamento atual: 2026-11-01/2027-01-01
      expect(tempo('novembro a janeiro', opt)).toBe('2026-11-01/2027-01-01');
    });

    test('dezembro a fevereiro (sem ano)', () => {
      expect(tempo('dezembro a fevereiro', opt)).toBe('2026-12-01/2027-02-01');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Ranges futuros (data inicial e final ambas no futuro)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Ranges inteiramente no futuro', () => {
    test('"de hoje até amanhã"', () => {
      expect(tempo('de hoje até amanhã', opt)).toBe('2026-04-15/2026-04-16');
    });

    test('"de hoje até dezembro"', () => {
      expect(tempo('de hoje até dezembro', opt)).toBe('2026-04-15/2026-12-01');
    });

    test('"de hoje até natal"', () => {
      expect(tempo('de hoje até natal', opt)).toBe('2026-04-15/2026-12-25');
    });

    test('"de hoje até o fim do ano"', () => {
      expect(tempo('de hoje até o fim do ano', opt)).toBe('2026-04-15/2026-12-31');
    });

    test('"de maio até julho"', () => {
      expect(tempo('de maio até julho', opt)).toBe('2026-05-01/2026-07-01');
    });

    test('"de maio a dezembro" (ambos futuros)', () => {
      expect(tempo('de maio a dezembro', opt)).toBe('2026-05-01/2026-12-01');
    });

    test('"segunda até próxima sexta" como range futuro com datas absolutas', () => {
      expect(tempo('20/04/2026 até 24/04/2026', opt)).toBe('2026-04-20/2026-04-24');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Datas absolutas futuras como ponto único (não range)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Datas absolutas no futuro', () => {
    test('25/12/2026 — natal do corrente ano', () => {
      expect(tempo('25/12/2026', opt)).toBe('2026-12-25');
    });

    test('01/01/2027 — ano que vem', () => {
      expect(tempo('01/01/2027', opt)).toBe('2027-01-01');
    });

    test('15 de outubro de 2027', () => {
      expect(tempo('15 de outubro de 2027', opt)).toBe('2027-10-15');
    });

    test('2027 (só o ano)', () => {
      expect(tempo('2027', opt)).toBe('2027-01-01');
    });

    test('"daqui a 2 anos"', () => {
      expect(tempo('daqui a 2 anos', opt)).toBe('2028-04-15');
    });

    test('"próximo natal"', () => {
      expect(tempo('próximo natal', opt)).toBe('2026-12-25');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Datas inválidas dentro de ranges — deve retornar null
  // ─────────────────────────────────────────────────────────────────────────
  describe('Datas inválidas em ranges', () => {
    test('32 de março até hoje → null', () => {
      expect(tempo('32 de março até hoje', opt)).toBeNull();
    });

    test('29/02/2025 até hoje → null (2025 não é bissexto)', () => {
      expect(tempo('29/02/2025 até hoje', opt)).toBeNull();
    });

    test('31 de abril até hoje → null (abril tem 30 dias)', () => {
      expect(tempo('31 de abril até hoje', opt)).toBeNull();
    });

    test('banana até hoje → null', () => {
      expect(tempo('banana até hoje', opt)).toBeNull();
    });

    test('hoje até foobar → null', () => {
      expect(tempo('hoje até foobar', opt)).toBeNull();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Casos de ano bissexto em ranges
  // ─────────────────────────────────────────────────────────────────────────
  describe('Ano bissexto', () => {
    test('29/02/2024 (válido) em range', () => {
      expect(tempo('29/02/2024 até hoje', opt)).toBe('2024-02-29/2026-04-15');
    });

    test('29 de fevereiro de 2024 (válido, por extenso)', () => {
      expect(tempo('29 de fevereiro de 2024', opt)).toBe('2024-02-29');
    });

    test('29/02/2025 (inválido) → null', () => {
      expect(tempo('29/02/2025', opt)).toBeNull();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Ranges com "desde" + data explícita
  // ─────────────────────────────────────────────────────────────────────────
  describe('Prefixo "desde" em ranges', () => {
    test('"desde janeiro até hoje"', () => {
      expect(tempo('desde janeiro até hoje', opt)).toBe('2026-01-01/2026-04-15');
    });

    test('"desde 01/01/2026 até hoje"', () => {
      expect(tempo('desde 01/01/2026 até hoje', opt)).toBe('2026-01-01/2026-04-15');
    });

    test('"desde ontem"', () => {
      expect(tempo('desde ontem', opt)).toBe('2026-04-14/2026-04-15');
    });

    test('"desde 3 meses atrás"', () => {
      expect(tempo('desde 3 meses atrás', opt)).toBe('2026-01-15/2026-04-15');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Ranges com delimitadores pouco usuais
  // ─────────────────────────────────────────────────────────────────────────
  describe('Delimitadores de range alternativos', () => {
    test('"janeiro -> março"', () => {
      expect(tempo('janeiro -> março', opt)).toBe('2026-01-01/2026-03-01');
    });

    test('"janeiro...março"', () => {
      expect(tempo('janeiro...março', opt)).toBe('2026-01-01/2026-03-01');
    });

    test('"01/01/2026 - 31/03/2026"', () => {
      expect(tempo('01/01/2026 - 31/03/2026', opt)).toBe('2026-01-01/2026-03-31');
    });

    test('"jan ao mar"', () => {
      expect(tempo('jan ao mar', opt)).toBe('2026-01-01/2026-03-01');
    });
  });
});
