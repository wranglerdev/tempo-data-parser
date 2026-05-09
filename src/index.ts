import { TempoOptions } from './types';
import { normalizeString, toISODate } from './utils';
import { parseSingleDate } from './parser';

export * from './types';

export function tempo(input: string, options: TempoOptions = {}): string | null {
  if (!input) return null;
  const normalizedInput = normalizeString(input);
  const refDate = options.referenceDate || new Date();
  const ref = new Date(refDate);
  ref.setHours(0, 0, 0, 0);

  // 1. Ranges Estáticos
  if (normalizedInput === 'fim de semana' || normalizedInput === 'fds') {
    const sat = new Date(ref); const d = sat.getDay(); sat.setDate(sat.getDate() + (d === 0 ? -1 : 6 - d));
    const sun = new Date(sat); sun.setDate(sun.getDate() + 1);
    return `${toISODate(sat)}/${toISODate(sun)}`;
  }
  if (normalizedInput === 'esta semana' || normalizedInput === 'essa semana') {
    const mon = new Date(ref); const d = mon.getDay(); mon.setDate(mon.getDate() + (d === 0 ? -6 : 1 - d));
    const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
    return `${toISODate(mon)}/${toISODate(sun)}`;
  }
  if (normalizedInput === 'ano passado') { const y = ref.getFullYear() - 1; return `${y}-01-01/${y}-12-31`; }
  if (normalizedInput === 'ano retrasado') { const y = ref.getFullYear() - 2; return `${y}-01-01/${y}-12-31`; }
  if (normalizedInput === 'ano que vem') { const y = ref.getFullYear() + 1; return `${y}-01-01/${y}-12-31`; }
  
  if (normalizedInput === 'mes passado inteiro') {
    const d = new Date(ref); d.setMonth(d.getMonth() - 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return `${toISODate(start)}/${toISODate(end)}`;
  }

  if (normalizedInput === 'semana passada ca' || normalizedInput === 'da semana passada pra ca') {
    const start = new Date(ref); start.setDate(start.getDate() - 7);
    return `${toISODate(start)}/${toISODate(ref)}`;
  }

  if (/\bultimas?\b/.test(normalizedInput) || /\bultimos?\b/.test(normalizedInput) || normalizedInput === 'do mes passado pra ca') {
    const startInput = normalizedInput
      .replace(/\bultimas?\b/g, '1')
      .replace(/\bultimos?\b/g, '1')
      .replace(/\bs?\s*24\s*horas\b/g, ' dia')
      .replace('do mes passado pra ca', '1 mes atras');
    const finalStartInput = (startInput.includes('atras') || startInput.includes('passad')) ? startInput : startInput + ' atras';
    const start = parseSingleDate(finalStartInput, ref);
    if (start) return `${start}/${toISODate(ref)}`;
  }

  if (normalizedInput === 'desde o comeco do ano' || normalizedInput === 'da virada do ano ate hoje' || normalizedInput === 'da virada do ano ate agora' || normalizedInput === 'do comeco do ano ate agora' || normalizedInput === 'do comeco do ano ate hoje') {
    return `${ref.getFullYear()}-01-01/${toISODate(ref)}`;
  }

  const rangeDelims = [/\s+ate\s+/, /\s+ao\s+/, /->/, /\.\.\.\./, /\.\.\./, /\.\./, /\s+pra\s+ca\b/, /\s+e\s+/, /\s+-\s+/, /\s+a\s+/];

  // 2. Ranges por Conectores
  const entreMatch = normalizedInput.match(/^entre\s+(.*?)\s+e\s+(.*)$/);
  if (entreMatch && entreMatch[1] && entreMatch[2]) {
    const s = parseSingleDate(entreMatch[1].trim(), ref);
    const e = parseSingleDate(entreMatch[2].trim(), ref);
    if (s && e) return `${s}/${e}`;
    return null;
  }

  const rangeInput = normalizedInput.replace(/^(de|desde|dos|do|da|o|a)\s+/, '');
  
  const ultimosRangeMatch = rangeInput.match(/^ultimos?\s+(\d+)\s+(dia|semana|mes|ano)(?:es|s)?$/);
  if (ultimosRangeMatch && ultimosRangeMatch[1] && ultimosRangeMatch[2]) {
    const start = parseSingleDate(rangeInput + ' atras', ref);
    if (start) return `${start}/${toISODate(ref)}`;
  }

  for (const delim of rangeDelims) {
    if (delim.test(rangeInput)) {
      const parts = rangeInput.split(delim);
      if (parts.length === 2) {
        const sPart = parts[0]?.trim();
        let ePart = parts[1]?.trim();
        if (!sPart) continue;

        if (sPart === 'terca' || sPart === 'quarta' || sPart === 'quinta' || sPart === 'sexta' || sPart === 'segunda' || sPart === 'sabado' || sPart === 'domingo') {
           const dSrc = delim.source;
           if (dSrc === '\\s+a\\s+' || dSrc === '\\s+e\\s+') {
              const single = parseSingleDate(normalizedInput, ref);
              if (single && !normalizedInput.includes(' ate ') && !normalizedInput.includes(' ao ')) return single;
           }
        }

        if (!ePart && delim.source.includes('ca')) ePart = 'hoje';
        if (!ePart) continue;

        if (ePart === 'ca' || ePart === 'hoje' || ePart === 'agora') ePart = 'hoje';
        if (sPart === 'daqui' && (delim.source.includes(' a ') || delim.source.includes('\\s+a\\s+'))) continue;

        const s = parseSingleDate(sPart, ref, ref);
        const e = parseSingleDate(ePart, ref, s ? new Date(s + 'T12:00:00') : undefined);
        if (s && e) {
          const sO = new Date(s + 'T12:00:00'); const eO = new Date(e + 'T12:00:00');
          if (eO < sO && !ePart.includes('atras') && !ePart.includes('passad')) {
            eO.setFullYear(eO.getFullYear() + 1); return `${s}/${toISODate(eO)}`;
          }
          return `${s}/${e}`;
        }
        if (delim.source.includes('ate') || delim.source.includes('->') || delim.source.includes('\\.\\.\\.')) return null;
      }
    }
  }

  if (normalizedInput.startsWith('ate ') || normalizedInput.startsWith('desde ') || normalizedInput.startsWith('da ') || normalizedInput.startsWith('do ') || normalizedInput.startsWith('de ')) {
    const clean = normalizedInput.replace(/^(ate|desde|da|do|de|dos|o)\s+/, '').replace(/\s+(pra ca|ate hoje|ate agora)$/, '');
    const date = parseSingleDate(clean, ref);
    if (date) {
      if (normalizedInput.startsWith('ate')) {
        if (clean === 'semana passada') {
          const d = new Date(ref); d.setDate(d.getDate() - (d.getDay() || 7));
          const sun = new Date(d); sun.setDate(sun.getDate() + (sun.getDay() === 0 ? 0 : 7 - sun.getDay()));
          return `${ref.getFullYear()}-01-01/${toISODate(sun)}`;
        }
        const startOfYear = `${ref.getFullYear()}-01-01`;
        return `${startOfYear}/${date}`;
      }
      return `${date}/${toISODate(ref)}`;
    }
  }

  const rawResult = parseSingleDate(normalizedInput, ref);

  if (options.forceRange && rawResult && !rawResult.includes('/')) {
    const resDate = new Date(rawResult + 'T12:00:00');
    const refDateISO = toISODate(ref);
    if (resDate.getTime() < ref.getTime()) {
      return `${rawResult}/${refDateISO}`;
    } else if (resDate.getTime() > ref.getTime()) {
      return `${refDateISO}/${rawResult}`;
    } else {
      return `${rawResult}/${rawResult}`;
    }
  }

  return rawResult;
}
