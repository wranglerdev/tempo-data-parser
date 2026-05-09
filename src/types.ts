export interface TempoOptions {
  /**
   * Data de referência para cálculos de dias relativos.
   * Se omitido, usará a data atual (new Date()).
   */
  referenceDate?: Date;
  /**
   * Se true, força que o retorno seja sempre um intervalo (range).
   * Se a entrada for uma data única, retorna um range entre ela e a data de referência.
   * @default false
   */
  forceRange?: boolean;
  /**
   * Limita a interpretação da data a um universo específico.
   * Se a entrada não pertencer a essa granularidade, retorna null.
   * @default 'all'
   */
  restrictTo?: 'day' | 'week' | 'month' | 'year' | 'holiday' | 'all';
}
