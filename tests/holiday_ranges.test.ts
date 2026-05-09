import { tempo } from '../src/index';

describe('Tempo (PT-BR) - Intervalos entre Feriados', () => {
  // Data base fixa para 2026
  const refDate = new Date(2026, 4, 8); 
  const options = { referenceDate: refDate };

  test('Intervalos fixos e móveis', () => {
    // Natal até Ano Novo
    expect(tempo('natal até ano novo', options)).toBe('2026-12-25/2027-01-01');
    
    // Carnaval até Páscoa
    expect(tempo('carnaval ... páscoa', options)).toBe('2026-02-17/2026-04-05');
    
    // Tiradentes até Dia do Trabalhador
    expect(tempo('tiradentes a dia do trabalhador', options)).toBe('2026-04-21/2026-05-01');
    
    // Independência até Nossa Senhora Aparecida
    expect(tempo('independência até aparecida', options)).toBe('2026-09-07/2026-10-12');
  });

  test('Intervalos com gírias e abreviações', () => {
    // Natal até Reveillon (com erro de digitação)
    expect(tempo('natal ate reveilon', options)).toBe('2026-12-25/2026-12-31');
    
    // Jan até Carnaval
    expect(tempo('jan até carnaval', options)).toBe('2026-01-01/2026-02-17');
  });

  test('Intervalos relativos a feriados', () => {
    // 3 dias antes do natal até o natal
    expect(tempo('3 dias antes do natal até natal', options)).toBe('2026-12-22/2026-12-25');
  });
});
