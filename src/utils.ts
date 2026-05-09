export function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const width = a.length + 1;
  const matrix: number[] = new Array((b.length + 1) * width).fill(0);
  
  for (let i = 0; i <= a.length; i += 1) {
    matrix[i] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    matrix[j * width] = j;
  }
  
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      const val1 = matrix[j * width + (i - 1)] ?? 0;
      const val2 = matrix[(j - 1) * width + i] ?? 0;
      const val3 = matrix[(j - 1) * width + (i - 1)] ?? 0;
      matrix[j * width + i] = Math.min(val1 + 1, val2 + 1, val3 + indicator);
    }
  }
  return matrix[b.length * width + a.length] ?? 0;
}

const fuzzyDictionary = [
  'amanha', 'hoje', 'ontem', 'anteontem', 
  'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', 
  'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo', 
  'proximo', 'proxima', 'passado', 'passada', 'semana', 'natal', 'pascoa', 'carnaval', 'reveillon',
  'mes', 'ano', 'dia', 'mais', 'menos', 'antes', 'depois', 'inicio', 'comeco', 'fim', 'final', 'atras', 'maes', 'pais',
  'meses', 'anos', 'dias', 'semanas', 'esta', 'este', 'agora', 'instante', 'momento', 'retrasado', 'retrasada', 'meados', 'virada', 'desde',
  'daqui', 'uns', 'faz', 'tem', 'cada', 'ate', 'entre', 'horas',
  'santa', 'paixao', 'tiradentes', 'trabalhador', 'trabalho', 'corpus', 'christi', 'independencia', 'aparecida', 'finados', 'republica', 'consciencia', 'negra', 'universal'
];

const slangMap: Record<string, string> = {
  'hj': 'hoje', 'onte': 'ontem', 'ontê': 'ontem', 'atraz': 'atras', 'amanha': 'amanha', 'fds': 'fim de semana', 'agorinha': 'agora', 'msm': 'mesmo', 'agra': 'agora'
};

const numberMap: Record<string, string> = {
  'um': '1', 'uma': '1', 'dois': '2', 'duas': '2', 'tres': '3', 'quatro': '4', 'cinco': '5', 'seis': '6', 'sete': '7', 'oito': '8', 'nove': '9', 'vinte': '20', 'trinta': '30'
};

export function fuzzyReplace(input: string): string {
  const words = input.split(/\s+/);
  return words.map(w => {
    if (!w) return '';
    const sMatch = slangMap[w];
    if (sMatch !== undefined) return sMatch;
    
    const nMatch = numberMap[w];
    if (nMatch !== undefined) return nMatch;

    if (w.length < 4) return w; 
    let bestMatch = w;
    let minDist = Infinity;
    for (const correct of fuzzyDictionary) {
      const dist = levenshtein(w, correct);
      if (dist < minDist) { minDist = dist; bestMatch = correct; }
    }
    if (minDist === 0) return w;
    const tolerance = bestMatch.length >= 5 ? 2 : 1;
    if (minDist <= tolerance) return bestMatch;
    return w;
  }).join(' ').replace(/\s+/g, ' ').trim();
}

export function normalizeString(str: string): string {
  let normalized = str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ç/g, 'c').replace(/º/g, '').trim();
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
    .replace(/\bdesde\s+a\b/g, 'desde')
    .replace(/\bdo\s+comeco\b/g, 'comeco')
    .replace(/\bdo\s+inicio\b/g, 'inicio')
    .replace(/\bdias?\s+hoje\b/g, 'hoje')
    .replace(/\bdias?\s+de\s+hoje\b/g, 'hoje');

  normalized = fuzzyReplace(normalized);

  // Final noise removal (less aggressive)
  normalized = normalized.replace(/\b(?:ja|isso|foi|tipo|aconteceu|la|ai|pouco|noite|cedo|tarde|manha|uns|os|as)\b/g, ' ').replace(/\s+/g, ' ').trim();

  return normalized;
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