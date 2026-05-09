import { toISODate, daysOfWeek, meses, mesesAbrev, calculateEaster } from './utils';

export function parseSingleDate(input: string, ref: Date, contextDate?: Date): string | null {
  let mathVal = 0;
  let mathUnit: string | undefined;
  let cleanInput = input;

  const mathMatch = input.match(/\s+([+-]|mais|menos)\s*(\d+)(?:\s*(dia|semana|mes|ano)(?:es|s)?)?$/);
  if (mathMatch) {
    const op = (mathMatch[1] === '+' || mathMatch[1] === 'mais') ? 1 : -1;
    mathVal = parseInt(mathMatch[2]!) * op;
    mathUnit = mathMatch[3] || 'dia';
    cleanInput = input.replace(mathMatch[0], '').trim();
  }

  const date = getBaseDate(cleanInput, ref, contextDate);
  if (!date) return null;
  
  if (mathUnit) {
    if (mathUnit === 'dia') date.setDate(date.getDate() + mathVal);
    else if (mathUnit === 'semana') date.setDate(date.getDate() + mathVal * 7);
    else if (mathUnit === 'mes') date.setMonth(date.getMonth() + mathVal);
    else if (mathUnit === 'ano') date.setFullYear(date.getFullYear() + mathVal);
  }
  
  if (date.getFullYear() < 1950 || date.getFullYear() > 2200) return null;
  return toISODate(date);
}

function getBaseDate(input: string, ref: Date, contextDate?: Date): Date | null {
  const date = new Date(ref);
  const baseYear = (contextDate || date).getFullYear();

  if (input === 'hoje' || input === 'agora' || input === 'atras') return date;
  if (input === 'amanha') return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  if (input === 'ontem') return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  if (input === 'anteontem' || input === 'o dia antes de ontem') return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2);
  if (input === 'depois de amanha') return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);

  if (input.startsWith('meados de ')) {
    const d = getBaseDate(input.replace('meados de ', ''), ref, contextDate);
    if (d) { d.setDate(15); return d; }
  }

  if (/^\d{1,2}$/.test(input) && contextDate) {
    const d = new Date(contextDate); d.setDate(parseInt(input));
    if (d.getDate() !== parseInt(input)) return null;
    return d;
  }
  
  const diaMatch = input.match(/^(?:o\s+)?dia\s+(\d{1,2})$/);
  if (diaMatch) {
    const d = new Date(date); d.setDate(parseInt(diaMatch[1]!));
    if (d.getDate() === parseInt(diaMatch[1]!)) return d;
  }

  if (input === 'mes passado') return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  if (input === 'mes retrasado') return new Date(date.getFullYear(), date.getMonth() - 2, 1);
  if (input === 'proximo mes' || input === 'mes que vem') return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  if (input === 'este mes' || input === 'neste mes' || input === 'mes') return date;

  if (input === 'ano passado') return new Date(date.getFullYear() - 1, 0, 1);
  if (input === 'ano que vem') return new Date(date.getFullYear() + 1, 0, 1);
  if (input === 'este ano' || input === 'neste ano' || input === 'ano') return new Date(date.getFullYear(), 0, 1);

  if (input === 'semana passada') { const d = new Date(date); d.setDate(d.getDate() - (d.getDay() || 7)); return d; }
  if (input === 'proxima semana' || input === 'semana que vem') { const d = new Date(date); d.setDate(d.getDate() + (8 - (d.getDay() || 7))); return d; }
  if (input === 'esta semana' || input === 'semana') { const d = new Date(date); d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1)); return d; }

  if (input === 'fim de semana' || input === 'fds') { const d = new Date(date); d.setDate(d.getDate() + (d.getDay() === 0 ? 0 : 7 - d.getDay())); return d; }

  if (input === 'natal' || input === 'no natal') return new Date(baseYear, 11, 25);
  if (input === 'vespera de natal') return new Date(baseYear, 11, 24);
  if (input === 'reveillon' || input === 'na virada do ano') return new Date(baseYear, 11, 31);
  if (input === 'ano novo') return new Date(baseYear, 0, 1);
  if (input === 'pascoa') return calculateEaster(baseYear);
  if (input === 'carnaval') { const d = calculateEaster(baseYear); d.setDate(d.getDate() - 47); return d; }
  if (input === 'dia das maes') { const d = new Date(baseYear, 4, 1); const dow = d.getDay(); d.setDate(1 + (dow === 0 ? 7 : (7 - dow) + 7)); return d; }
  if (input === 'dia dos pais') { const d = new Date(baseYear, 7, 1); const dow = d.getDay(); d.setDate(1 + (dow === 0 ? 7 : (7 - dow) + 7)); return d; }

  const startRegex = /^(inicio|comeco|fim|final|final do|fim do|inicio do|comeco do)\s+(do|de|da)\s+/;
  const startMatch = input.match(startRegex);
  if (startMatch) {
    const type = startMatch[1];
    const clean = input.replace(startRegex, '');
    if (clean === 'ano') {
       if (type.startsWith('fim') || type.startsWith('final')) return new Date(baseYear, 11, 31);
       return new Date(baseYear, 0, 1);
    }
    if (clean === 'semana') {
       const d = new Date(date); d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1));
       if (type.startsWith('fim') || type.startsWith('final')) d.setDate(d.getDate() + 6);
       return d;
    }
    const d = getBaseDate(clean, ref, contextDate);
    if (d) {
      if (type.startsWith('inicio') || type.startsWith('comeco')) { d.setDate(1); return d; }
      else { d.setMonth(d.getMonth() + 1); d.setDate(0); return d; }
    }
  }

  // Handle "X antes/depois de Y"
  const relRegex = /^(.*?)\s+(antes|depois)\s+(?:do|de|da)\s+(.*)$/;
  const relMatch = input.match(relRegex);
  if (relMatch) {
    const subject = relMatch[1]!.trim();
    const relation = relMatch[2];
    const anchor = relMatch[3]!.trim();
    const anchorDateStr = parseSingleDate(anchor, ref, contextDate);
    if (anchorDateStr) {
      const anchorDate = new Date(anchorDateStr + 'T12:00:00');
      // If subject is just a day of week, we want it relative to anchor without the default jump
      let res: Date | null = null;
      for (const [name, dow] of Object.entries(daysOfWeek)) {
        if (new RegExp(`\\b${name}\\b`).test(subject)) {
          res = new Date(anchorDate);
          const currentDow = res.getDay(); let diff = dow - currentDow;
          res.setDate(res.getDate() + diff);
          break;
        }
      }
      if (!res) res = getBaseDate(subject, anchorDate, anchorDate);

      if (res) {
        if (relation === 'antes' && res.getTime() >= anchorDate.getTime()) res.setDate(res.getDate() - 7);
        if (relation === 'depois' && res.getTime() <= anchorDate.getTime()) res.setDate(res.getDate() + 7);
        return res;
      }
      const mathPrefixMatch = subject.match(/^(\d+)\s+(dia|semana|mes|ano)(?:es|s)?$/);
      if (mathPrefixMatch) {
         const amount = parseInt(mathPrefixMatch[1]!); const unit = mathPrefixMatch[2]!;
         const mult = relation === 'antes' ? -1 : 1;
         const resDate = new Date(anchorDate);
         if (unit === 'dia') resDate.setDate(resDate.getDate() + amount * mult);
         else if (unit === 'semana') resDate.setDate(resDate.getDate() + amount * 7 * mult);
         else if (unit === 'mes') resDate.setMonth(resDate.getMonth() + amount * mult);
         else if (unit === 'ano') resDate.setFullYear(resDate.getFullYear() + amount * mult);
         return resDate;
      }
    }
  }

  const prefixRelMatch = input.match(/^(?:daqui a|\bem\b|ha|faz|tem|uns|ultimos?)\s+(?:uns\s+)?(\d+)\s+(dia|semana|mes|ano)(?:es|s)?/);
  if (prefixRelMatch) {
    const amount = parseInt(prefixRelMatch[1]!); const unit = prefixRelMatch[2]!;
    const mult = (input.includes('daqui a') || /\bem\b/.test(input)) ? 1 : -1;
    const res = new Date(date);
    if (unit === 'dia') res.setDate(res.getDate() + amount * mult);
    else if (unit === 'semana') res.setDate(res.getDate() + amount * 7 * mult);
    else if (unit === 'mes') res.setMonth(res.getMonth() + amount * mult);
    else if (unit === 'ano') res.setFullYear(res.getFullYear() + amount * mult);
    return res;
  }

  const suffixRelMatch = input.match(/^(\d+)\s+(dia|semana|mes|ano)(?:es|s)?\s+(atras|pra tras)/);
  if (suffixRelMatch) {
    const amount = parseInt(suffixRelMatch[1]!); const unit = suffixRelMatch[2]!;
    const res = new Date(date);
    if (unit === 'dia') res.setDate(res.getDate() - amount);
    else if (unit === 'semana') res.setDate(res.getDate() - amount * 7);
    else if (unit === 'mes') res.setMonth(res.getMonth() - amount);
    else if (unit === 'ano') res.setFullYear(res.getFullYear() - amount);
    return res;
  }

  for (const [name, dow] of Object.entries(daysOfWeek)) {
    const regex = new RegExp(`\\b${name}\\b`);
    if (regex.test(input)) {
      const res = new Date(date);
      const currentDow = res.getDay(); let diff = dow - currentDow;
      if (input.includes('proximo')) { if (diff <= 0) diff += 7; }
      else if (input.includes('retrasad')) { if (diff >= 0) diff -= 14; else diff -= 7; }
      else if (input.includes('passad')) { if (diff >= 0) diff -= 7; }
      else if (!input.includes('esta') && diff <= 0) diff += 7;
      res.setDate(res.getDate() + diff); return res;
    }
  }

  const ddmmyyyy = input.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
  if (ddmmyyyy) {
    const d = parseInt(ddmmyyyy[1]!); const m = parseInt(ddmmyyyy[2]!) - 1;
    let y = ddmmyyyy[3] ? parseInt(ddmmyyyy[3]) : date.getFullYear(); if (y < 100) y += 2000;
    const res = new Date(y, m, d); if (res.getDate() === d) return res;
  }

  for (let i = 0; i < 12; i++) {
    const regex = new RegExp(`\\b(?:${meses[i]}|${mesesAbrev[i]})\\b`);
    if (regex.test(input)) {
      const n = input.match(/\b\d+\b/g); 
      let d = 1;
      let y = baseYear;
      let foundDay = false;
      if (n) {
         for (const numStr of n) {
            const num = parseInt(numStr);
            if (num >= 1900 && num <= 2200) y = num;
            else if (num <= 31 && !foundDay) { d = num; foundDay = true; }
            else if (num < 100 && y === baseYear && numStr.length === 2 && foundDay) y = 2000 + num;
            else if (num > 31) return null; // Invalid day
         }
      }
      const res = new Date(y, i, d); if (res.getDate() === d) return res;
      return null;
    }
  }

  return null;
}
