import { toISODate, daysOfWeek, meses, mesesAbrev, calculateEaster } from './utils';

export function parseSingleDate(input: string, ref: Date, contextDate?: Date): string | null {
  let mathVal = 0;
  let mathUnit: string | undefined;
  let cleanInput = input;

  const mathMatch = cleanInput.match(/\s+([+-]|mais|menos)\s*(\d+)(?:\s*(dia|semana|mes|ano)(?:es|s)?)?$/);
  if (mathMatch && mathMatch[1] && mathMatch[2]) {
    const op = (mathMatch[1] === '+' || mathMatch[1] === 'mais') ? 1 : -1;
    mathVal = parseInt(mathMatch[2]) * op;
    mathUnit = mathMatch[3] || 'dia';
    cleanInput = cleanInput.replace(mathMatch[0], '').trim();
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
  
  const clean = input
    .replace(/[\-\.\/]/g, ' ')
    .replace(/\b(?:o|a|os|as|de|do|da|dos|das|no|na|em|pra|uns|tipo|mais|que)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Básicos
  if (clean === 'hoje' || clean === 'agora' || clean === 'atras') return date;
  if (clean === 'amanha') return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  if (clean === 'ontem') return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  if (clean === 'anteontem' || clean === 'dia antes ontem') return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2);
  if (clean === 'depois amanha' || clean === 'depois de amanha') return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);

  // 2. Relativos Complexos (Antes/Depois)
  const relRegex = /^(.*?)\s+(antes|depois)\s+(.*)$/;
  const relMatch = clean.match(relRegex);
  if (relMatch && relMatch[1] && relMatch[2] && relMatch[3]) {
    const subject = relMatch[1].trim();
    const relation = relMatch[2];
    const anchor = relMatch[3].trim();
    const anchorDateStr = parseSingleDate(anchor, ref, contextDate);
    if (anchorDateStr) {
      const anchorDate = new Date(anchorDateStr + 'T12:00:00');
      let resDate: Date | null = null;
      for (const [name, dow] of Object.entries(daysOfWeek)) {
        if (new RegExp(`\\b${name}\\b`).test(subject)) {
          resDate = new Date(anchorDate);
          const currentDow = resDate.getDay(); let diff = dow - currentDow;
          resDate.setDate(resDate.getDate() + diff);
          if (relation === 'antes' && diff >= 0) resDate.setDate(resDate.getDate() - 7);
          if (relation === 'depois' && diff <= 0) resDate.setDate(resDate.getDate() + 7);
          return resDate;
        }
      }
      if (!resDate) {
         const mathPrefixMatch = subject.match(/^(\d+)\s+(dia|semana|mes|ano)(?:es|s)?$/);
         if (mathPrefixMatch && mathPrefixMatch[1] && mathPrefixMatch[2]) {
            const amount = parseInt(mathPrefixMatch[1]); const unit = mathPrefixMatch[2];
            const mult = relation === 'antes' ? -1 : 1;
            const rd = new Date(anchorDate);
            if (unit === 'dia') rd.setDate(rd.getDate() + amount * mult);
            else if (unit === 'semana') rd.setDate(rd.getDate() + amount * 7 * mult);
            else if (unit === 'mes') rd.setMonth(rd.getMonth() + amount * mult);
            else if (unit === 'ano') rd.setFullYear(rd.getFullYear() + amount * mult);
            return rd;
         }
         resDate = getBaseDate(subject, anchorDate, anchorDate);
      }
      if (resDate) {
        if (relation === 'antes' && resDate.getTime() >= anchorDate.getTime()) resDate.setDate(resDate.getDate() - 7);
        if (relation === 'depois' && resDate.getTime() <= anchorDate.getTime()) resDate.setDate(resDate.getDate() + 7);
        return resDate;
      }
    }
  }

  // 3. Feriados
  const holidayMap: Record<string, () => Date> = {
    'vespera natal': () => new Date(baseYear, 11, 24),
    'confraternizacao universal': () => new Date(baseYear, 0, 1),
    'sexta feira santa': () => { const d = calculateEaster(baseYear); d.setDate(d.getDate() - 2); return d; },
    'sexta feira paixao': () => { const d = calculateEaster(baseYear); d.setDate(d.getDate() - 2); return d; },
    'segunda feira carnaval': () => { const d = calculateEaster(baseYear); d.setDate(d.getDate() - 48); return d; },
    'segunda carnaval': () => { const d = calculateEaster(baseYear); d.setDate(d.getDate() - 48); return d; },
    'terca feira carnaval': () => { const d = calculateEaster(baseYear); d.setDate(d.getDate() - 47); return d; },
    'terca carnaval': () => { const d = calculateEaster(baseYear); d.setDate(d.getDate() - 47); return d; },
    'nossa senhora aparecida': () => new Date(baseYear, 9, 12),
    'proclamacao republica': () => new Date(baseYear, 10, 15),
    'consciencia negra': () => new Date(baseYear, 10, 20),
    'dia trabalhador': () => new Date(baseYear, 4, 1),
    'dia trabalho': () => new Date(baseYear, 4, 1),
    'virada ano': () => new Date(baseYear, 11, 31),
    'corpus christi': () => { const d = calculateEaster(baseYear); d.setDate(d.getDate() + 60); return d; },
    'independencia': () => new Date(baseYear, 8, 7),
    'sete setembro': () => new Date(baseYear, 8, 7),
    'aparecida': () => new Date(baseYear, 9, 12),
    'doze outubro': () => new Date(baseYear, 9, 12),
    'republica': () => new Date(baseYear, 10, 15),
    'dia maes': () => { const d = new Date(baseYear, 4, 1); const dow = d.getDay(); d.setDate(1 + (dow === 0 ? 7 : (7 - dow) + 7)); return d; },
    'dia pais': () => { const d = new Date(baseYear, 7, 1); const dow = d.getDay(); d.setDate(1 + (dow === 0 ? 7 : (7 - dow) + 7)); return d; },
    'natal': () => new Date(baseYear, 11, 25),
    'reveillon': () => new Date(baseYear, 11, 31),
    'reveilon': () => new Date(baseYear, 11, 31),
    'reveion': () => new Date(baseYear, 11, 31),
    'ano novo': () => new Date(baseYear, 0, 1),
    'pascoa': () => calculateEaster(baseYear),
    'sexta paixao': () => { const d = calculateEaster(baseYear); d.setDate(d.getDate() - 2); return d; },
    'carnaval': () => { const d = calculateEaster(baseYear); d.setDate(d.getDate() - 47); return d; },
    'tiradentes': () => new Date(baseYear, 3, 21),
    'finados': () => new Date(baseYear, 10, 2)
  };
  const sortedHolidays = Object.keys(holidayMap).sort((a, b) => b.length - a.length);
  for (const key of sortedHolidays) {
    if (clean.includes(key)) {
      const fn = holidayMap[key];
      if (fn) return fn();
    }
  }

  // 4. Meados / Meio
  if (clean.startsWith('meados ') || clean.startsWith('meio ')) {
    const target = clean.replace(/^(meados|meio)\s+/, '');
    if (target === 'ano') return new Date(baseYear, 5, 15);
    if (target === 'mes') return new Date(date.getFullYear(), date.getMonth(), 15);
    const d = getBaseDate(target, ref, contextDate);
    if (d) { d.setDate(15); return d; }
  }

  // 5. Período
  const startRegex = /^(inicio|comeco|fim|final)\s+/;
  const startMatch = clean.match(startRegex);
  if (startMatch && startMatch[1]) {
    const type = startMatch[1];
    const cleanPart = clean.replace(startRegex, '').trim();
    if (cleanPart === 'ano') {
       if (type.startsWith('fim') || type.startsWith('final')) return new Date(baseYear, 11, 31);
       return new Date(baseYear, 0, 1);
    }
    if (cleanPart === 'semana') {
       const d = new Date(date); d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1));
       if (type.startsWith('fim') || type.startsWith('final')) d.setDate(d.getDate() + 6);
       return d;
    }
    if (cleanPart === 'mes') {
       const d = new Date(date);
       if (type.startsWith('fim') || type.startsWith('final')) {
          d.setMonth(d.getMonth() + 1); d.setDate(0);
       } else {
          d.setDate(1);
       }
       return d;
    }
    const d = getBaseDate(cleanPart, ref, contextDate);
    if (d) {
      if (type.startsWith('inicio') || type.startsWith('comeco')) { d.setDate(1); return d; }
      else { d.setMonth(d.getMonth() + 1); d.setDate(0); return d; }
    }
  }

  // 6. Números Diretos
  if (/^\b(19|20)\d{2}\b$/.test(clean)) {
    const y = parseInt(clean);
    return new Date(y, 0, 1);
  }
  if (/^\d{1,2}$/.test(clean)) {
    const d = new Date(contextDate || date); d.setDate(parseInt(clean));
    if (d.getDate() !== parseInt(clean)) return null;
    return d;
  }
  const diaMatch = clean.match(/^(?:dia\s+)?(\d{1,2})$/);
  if (diaMatch && diaMatch[1]) {
    const d = new Date(date); d.setDate(parseInt(diaMatch[1]));
    if (d.getDate() === parseInt(diaMatch[1])) return d;
  }

  // 7. Simples
  if (clean === 'mes passado') return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  if (clean === 'mes retrasado') return new Date(date.getFullYear(), date.getMonth() - 2, 1);
  if (clean === 'proximo mes' || clean === 'mes vem' || clean === 'mes que vem') return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  if (clean === 'este mes' || clean === 'neste mes' || clean === 'mes') return date;
  if (clean === 'ano passado') return new Date(date.getFullYear() - 1, 0, 1);
  if (clean === 'ano vem' || clean === 'ano que vem') return new Date(date.getFullYear() + 1, 0, 1);
  if (clean === 'ano retrasado') return new Date(date.getFullYear() - 2, 0, 1);
  if (clean === 'este ano' || clean === 'neste ano' || clean === 'ano') return new Date(date.getFullYear(), 0, 1);

  // 8. Semanas
  if (clean === 'semana passada') { const d = new Date(date); d.setDate(d.getDate() - 7); return d; }
  if (clean === 'semana retrasada') { const d = new Date(date); d.setDate(d.getDate() - 14); return d; }
  if (clean === 'proxima semana' || clean === 'semana vem' || clean === 'semana que vem') { const d = new Date(date); d.setDate(d.getDate() + 7); return d; }
  if (clean === 'esta semana' || clean === 'semana') { const d = new Date(date); d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1)); return d; }
  if (clean === 'fim semana' || clean === 'fds' || clean === 'fim de semana') { const d = new Date(date); d.setDate(d.getDate() + (d.getDay() === 0 ? 0 : 7 - d.getDay())); return d; }

  // 9. Prefixos
  const prefixRelMatch = input.match(/^(?:daqui|\bem\s+a\b|\bem\s+de\b|\bem\b|\bha\b|\bfaz\b|\btem\b|ultimos?)\s+(?:a\s+|de\s+)?(\d+)\s+(dia|semana|mes|ano)(?:es|s)?/);
  if (prefixRelMatch && prefixRelMatch[1] && prefixRelMatch[2]) {
    const amount = parseInt(prefixRelMatch[1]); const unit = prefixRelMatch[2];
    const mult = (input.includes('daqui') || /\bem\b/.test(input) || /\s+em\s+/.test(input)) ? 1 : -1;
    const res = new Date(date);
    if (unit === 'dia') res.setDate(res.getDate() + amount * mult);
    else if (unit === 'semana') res.setDate(res.getDate() + amount * 7 * mult);
    else if (unit === 'mes') res.setMonth(res.getMonth() + amount * mult);
    else if (unit === 'ano') res.setFullYear(res.getFullYear() + amount * mult);
    return res;
  }
  const suffixRelMatch = clean.match(/^(\d+)\s+(dia|semana|mes|ano)(?:es|s)?\s+(atras|pra tras)/);
  if (suffixRelMatch && suffixRelMatch[1] && suffixRelMatch[2]) {
    const amount = parseInt(suffixRelMatch[1]); const unit = suffixRelMatch[2];
    const res = new Date(date);
    if (unit === 'dia') res.setDate(res.getDate() - amount);
    else if (unit === 'semana') res.setDate(res.getDate() - amount * 7);
    else if (unit === 'mes') res.setMonth(res.getMonth() - amount);
    else if (unit === 'ano') res.setFullYear(res.getFullYear() - amount);
    return res;
  }

  // 10. Dias Semana
  for (const [name, dow] of Object.entries(daysOfWeek)) {
    if (new RegExp(`\\b${name}\\b`).test(clean)) {
      const res = new Date(date);
      const currentDow = res.getDay(); let diff = dow - currentDow;
      if (clean.includes('proximo')) { if (diff <= 0) diff += 7; }
      else if (clean.includes('retrasad')) { if (diff >= 0) diff -= 14; else diff -= 7; }
      else if (clean.includes('passad')) { if (diff >= 0) diff -= 7; }
      else if (input.includes('esse') || input.includes('este')) { if (diff < 0) diff += 7; }
      else if (!input.includes('esta') && diff <= 0) diff += 7;
      res.setDate(res.getDate() + diff); return res;
    }
  }

  // 11. Formatos Numéricos
  const yyyymmdd = clean.match(/^(\d{4}) (\d{1,2}) (\d{1,2})$/);
  if (yyyymmdd && yyyymmdd[1] && yyyymmdd[2] && yyyymmdd[3]) {
    const y = parseInt(yyyymmdd[1]); const m = parseInt(yyyymmdd[2]) - 1; const d = parseInt(yyyymmdd[3]);
    const res = new Date(y, m, d); if (res.getDate() === d) return res;
  }
  const ddmmyyyy = clean.match(/^(\d{1,2}) (\d{1,2})(?: (\d{2,4}))?$/);
  if (ddmmyyyy && ddmmyyyy[1] && ddmmyyyy[2]) {
    const d = parseInt(ddmmyyyy[1]); const m = parseInt(ddmmyyyy[2]) - 1;
    let y = ddmmyyyy[3] ? parseInt(ddmmyyyy[3]) : date.getFullYear(); if (y < 100) y += 2000;
    const res = new Date(y, m, d); if (res.getDate() === d) return res;
  }
  const yyyymm = clean.match(/^(\d{4}) (\d{1,2})$/);
  if (yyyymm && yyyymm[1] && yyyymm[2]) {
    const y = parseInt(yyyymm[1]); const m = parseInt(yyyymm[2]) - 1;
    return new Date(y, m, 1);
  }

  // 12. Mês por extenso
  for (let i = 0; i < 12; i++) {
    const regex = new RegExp(`\\b(?:${meses[i]}|${mesesAbrev[i]})\\b`);
    if (regex.test(clean)) {
      const n = clean.match(/\b\d+\b/g); 
      let d = 1; let y = baseYear; let foundDay = false;
      if (n) {
         for (const numStr of n) {
            const num = parseInt(numStr);
            if (num >= 1950 && num <= 2200) y = num;
            else if (num <= 31 && !foundDay) { d = num; foundDay = true; }
            else if (num < 100 && y === baseYear && numStr.length === 2 && foundDay) y = 2000 + num;
            else if (num > 31) return null;
         }
      }
      const res = new Date(y, i, d); if (res.getDate() === d) return res;
      return null;
    }
  }
  return null;
}
