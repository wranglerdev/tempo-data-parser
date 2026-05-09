export function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = Array(b.length + 1).fill(0).map(() => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) matrix[0]![i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j]![0] = j;

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j]![i] = Math.min(
        matrix[j]![i - 1]! + 1,
        matrix[j - 1]![i]! + 1,
        matrix[j - 1]![i - 1]! + indicator
      );
    }
  }
  return matrix[b.length]![a.length]!;
}

const fuzzyDictionary = [
  'amanha', 'hoje', 'ontem', 'anteontem', 
  'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', 
  'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo', 
  'proximo', 'proxima', 'passado', 'passada', 'semana', 'natal', 'pascoa', 'carnaval', 'reveillon',
  'mes', 'ano', 'dia', 'mais', 'menos', 'antes', 'depois', 'inicio', 'comeco', 'fim', 'final', 'atras', 'maes', 'pais',
  'meses', 'anos', 'dias', 'semanas',
  'esta', 'este', 'ate', 'ao', 'de', 'da', 'do', 'das', 'dos', 'a', 'o', 'que', 'vem',
  'agora', 'instante', 'momento', 'retrasado', 'retrasada', 'meados', 'virada', 'desde', 'ca',
  'daqui', 'uns', 'faz', 'tem', 'cada', 'ate', 'entre', 'horas'
];

const slangMap: Record<string, string> = {
  'hj': 'hoje',
  'onte': 'ontem',
  'atraz': 'atras',
  'amanha': 'amanha',
  'fds': 'fim de semana',
  'agorinha': 'agora'
};

const numberMap: Record<string, string> = {
  'um': '1', 'uma': '1',
  'dois': '2', 'duas': '2',
  'tres': '3',
  'quatro': '4',
  'cinco': '5',
  'seis': '6',
  'sete': '7',
  'oito': '8',
  'nove': '9',
  'vinte': '20',
  'trinta': '30'
};

export function fuzzyReplace(input: string): string {
  const words = input.split(/\s+/);
  return words.map(w => {
    // 1. Slang mapping
    if (slangMap[w]) return slangMap[w];
    
    // 2. Number mapping
    if (numberMap[w]) return numberMap[w];

    if (w.length < 4) return w; 
    
    let bestMatch = w;
    let minDist = Infinity;
    
    for (const correct of fuzzyDictionary) {
      const dist = levenshtein(w, correct);
      if (dist < minDist) {
        minDist = dist;
        bestMatch = correct;
      }
    }
    
    if (minDist === 0) return w;
    
    const tolerance = bestMatch.length >= 5 ? 2 : 1;
    if (minDist <= tolerance) {
      return bestMatch;
    }
    
    return w;
  }).join(' ');
}

export function normalizeString(str: string): string {
  let normalized = str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/º/g, '')
    .trim();
  
  // Substituições estruturais antes do fuzzy
  normalized = normalized
    .replace(/\bprimeiro\b/g, '1')
    .replace(/\b(neste|nesse)\s+(?:exato\s+)?(instante|momento)\b/g, 'agora')
    .replace(/\bvinte\s+e\s+um\b/g, '21')
    .replace(/\bvinte\s+e\s+dois\b/g, '22')
    .replace(/\bvinte\s+e\s+três\b/g, '23')
    .replace(/\bvinte\s+e\s+quatro\b/g, '24')
    .replace(/\bvinte\s+e\s+cinco\b/g, '25')
    .replace(/\btrinta\s+e\s+um\b/g, '31')
    .replace(/\batraz\b/g, 'atras')
    .replace(/\bpra\s+tras\b/g, 'atras')
    .replace(/\bdesde\s+o\b/g, 'desde')
    .replace(/\bdesde\s+a\b/g, 'desde');

  return fuzzyReplace(normalized);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const daysOfWeek: Record<string, number> = {
  'domingo': 0, 'dom': 0,
  'segunda': 1, 'seg': 1, 'segunda-feira': 1,
  'terca': 2, 'ter': 2, 'terca-feira': 2,
  'quarta': 3, 'qua': 3, 'quarta-feira': 3,
  'quinta': 4, 'qui': 4, 'quinta-feira': 4,
  'sexta': 5, 'sex': 5, 'sexta-feira': 5,
  'sabado': 6, 'sab': 6
};

export const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const mesesAbrev = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function calculateEaster(year: number): Date {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);

  return new Date(year, month - 1, day);
}