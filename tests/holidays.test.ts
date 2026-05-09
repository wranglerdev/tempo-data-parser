import { tempo } from '../src/index';

describe('Tempo (PT-BR) - Feriados Bancários', () => {
  // Data base fixa para 2026 (baseado na lista do usuário)
  const refDate = new Date(2026, 4, 8); 
  const options = { referenceDate: refDate };

  test('Confraternização Universal (01/01)', () => {
    expect(tempo('confraternização universal', options)).toBe('2026-01-01');
    expect(tempo('ano novo', options)).toBe('2026-01-01');
  });

  test('Carnaval (16/02 e 17/02)', () => {
    // Geralmente 'carnaval' refere-se à terça-feira
    expect(tempo('carnaval', options)).toBe('2026-02-17');
    expect(tempo('terça-feira de carnaval', options)).toBe('2026-02-17');
    expect(tempo('segunda-feira de carnaval', options)).toBe('2026-02-16');
  });

  test('Sexta-Feira da Paixão (03/04)', () => {
    expect(tempo('sexta-feira da paixão', options)).toBe('2026-04-03');
    expect(tempo('sexta-feira santa', options)).toBe('2026-04-03');
  });

  test('Dia de Tiradentes (21/04)', () => {
    expect(tempo('tiradentes', options)).toBe('2026-04-21');
    expect(tempo('dia de tiradentes', options)).toBe('2026-04-21');
  });

  test('Dia do Trabalhador (01/05)', () => {
    expect(tempo('dia do trabalhador', options)).toBe('2026-05-01');
    expect(tempo('dia do trabalho', options)).toBe('2026-05-01');
  });

  test('Corpus Christi (04/06)', () => {
    expect(tempo('corpus christi', options)).toBe('2026-06-04');
  });

  test('Independência do Brasil (07/09)', () => {
    expect(tempo('independência do brasil', options)).toBe('2026-09-07');
    expect(tempo('sete de setembro', options)).toBe('2026-09-07');
  });

  test('Dia de Nossa Senhora Aparecida (12/10)', () => {
    expect(tempo('nossa senhora aparecida', options)).toBe('2026-10-12');
    expect(tempo('doze de outubro', options)).toBe('2026-10-12');
  });

  test('Dia de Finados (02/11)', () => {
    expect(tempo('finados', options)).toBe('2026-11-02');
    expect(tempo('dia de finados', options)).toBe('2026-11-02');
  });

  test('Proclamação da República (15/11)', () => {
    expect(tempo('proclamação da república', options)).toBe('2026-11-15');
  });

  test('Dia da Consciência Negra (20/11)', () => {
    expect(tempo('consciência negra', options)).toBe('2026-11-20');
    expect(tempo('dia da consciência negra', options)).toBe('2026-11-20');
  });

  test('Natal (25/12)', () => {
    expect(tempo('natal', options)).toBe('2026-12-25');
  });
});
