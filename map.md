
const inputs = [
    // =====================================================
    // NÚMEROS POR EXTENSO
    // =====================================================

    // esperado: 2026-03-09
    'dois meses atrás',

    // esperado: 2026-02-09
    'três meses atrás',

    // esperado: 2026-05-06
    'três dias atrás',

    // esperado: 2026-04-09
    'um mês atrás',

    // esperado: 2026-04-25
    'duas semanas atrás',

    // esperado: 2025-05-09
    'um ano atrás',

    // =====================================================
    // FRASES HUMANAS REAIS
    // =====================================================

    // esperado: 2026-03-09
    'faz dois meses',

    // esperado: 2026-03-09
    'já faz 2 meses',

    // esperado: 2026-03-09
    'isso foi há 2 meses',

    // esperado: 2026-05-02
    'isso aconteceu semana passada',

    // esperado: 2026-04-01
    'isso foi no mês passado',

    // esperado: 2025-01-01/2025-12-31
    'foi ano passado',

    // esperado: 2026-05-09
    'até os dias de hoje',

    // esperado: 2026-01-01/2026-05-09
    'desde janeiro até hoje',

    // =====================================================
    // ERROS DE DIGITAÇÃO
    // =====================================================

    // esperado: 2026-03-09
    '2 meses atraz',

    // esperado: 2026-03-09
    '2 mezes atrás',

    // esperado: 2026-03-09
    '2 mes atras',

    // esperado: 2026-05-08
    'onte',

    // esperado: 2026-05-10
    'amanha',

    // esperado: 2026-05-09
    'agra',

    // =====================================================
    // ABREVIAÇÕES
    // =====================================================

    // esperado: 2026-01-01/2026-03-01
    'jan até mar',

    // esperado: 2026-01-01/2026-03-01
    'jan a mar',

    // esperado: 2026-02-01/2026-04-01
    'fev até abr',

    // esperado: 2026-08-01/2026-12-01
    'ago a dez',

    // esperado: 2026-05-09
    'hj',

    // esperado: 2026-05-08
    'ontem msm',

    // =====================================================
    // INTERVALOS NATURAIS
    // =====================================================

    // esperado: 2026-01-01/2026-05-09
    'de janeiro pra cá',

    // esperado: 2026-03-09/2026-05-09
    'dos últimos 2 meses pra cá',

    // esperado: 2026-05-01/2026-05-09
    'do começo do mês até hoje',

    // esperado: 2026-01-01/2026-05-09
    'do começo do ano até agora',

    // esperado: 2026-04-01/2026-04-30
    'mês passado inteiro',

    // esperado: 2026-01-01/2026-03-01
    'entre janeiro e março',

    // esperado: 2026-01-01/2026-03-01
    'entre jan e mar',

    // esperado: 2026-03-01/2026-05-01
    'de março até maio',

    // =====================================================
    // RELATIVOS DIFÍCEIS
    // =====================================================

    // esperado: 2026-05-07
    'anteontem',

    // esperado: 2026-05-11
    'depois de amanhã',

    // esperado: 2026-04-01
    'no início do mês passado',

    // esperado: 2026-04-15 (aproximado)
    'meados do mês passado',

    // esperado: 2026-04-30
    'fim do mês passado',

    // esperado: 2026-01-01
    'começo do ano',

    // esperado: 2026-12-31
    'fim do ano',

    // =====================================================
    // DIA DA SEMANA
    // =====================================================

    // esperado: 2026-05-08
    'sexta passada',

    // esperado: 2026-05-15
    'sexta que vem',

    // esperado: 2026-05-04
    'segunda passada',

    // esperado: 2026-05-11
    'segunda que vem',

    // esperado: 2026-05-09
    'esse sábado',

    // =====================================================
    // HORÁRIOS (se suportar)
    // =====================================================

    // esperado: 2026-05-09T14:00:00
    'hoje às 14h',

    // esperado: 2026-05-10T08:30:00
    'amanhã 8:30',

    // esperado: 2026-05-08T22:00:00
    'ontem às 22h',

    // =====================================================
    // FORMATAÇÕES DIFERENTES
    // =====================================================

    // esperado: 2026-05-09
    '2026-05-09',

    // esperado: 2026-05-09
    '09-05-2026',

    // esperado: 2026-05-09
    '09.05.2026',

    // esperado: 2026-05-09
    '9 de maio de 2026',

    // esperado: 2026-05-09
    '09 maio 2026',

    // =====================================================
    // CAÓTICOS / INTERNET BR
    // =====================================================

    // esperado: 2026-03-09
    'faz tipo uns 2 meses',

    // esperado: 2026-03-09
    'lá pra uns 2 meses atrás',

    // esperado: 2026-05-08
    'ontem de noite',

    // esperado: 2026-05-09
    'hoje cedo',

    // esperado: 2026-05-09
    'mais cedo hoje',

    // esperado: 2026-05-09
    'agorinha pouco',

    // esperado: 2026-05-09
    'nesse momento aí',

    // esperado: 2026-05-02/2026-05-09
    'da semana passada pra cá',

    // =====================================================
    // ISO + INTERVALOS
    // =====================================================

    // esperado: 2026-01-01/2026-05-09
    '2026-01-01 até hoje',

    // esperado: 2026-01-01/2026-03-01
    '2026-01 até 2026-03',

    // esperado: 2026-05-01/2026-05-09
    'de 2026-05-01 até agora',

    // =====================================================
    // EDGE CASES IMPORTANTES
    // =====================================================

    // esperado: erro/null
    'há há há',

    // esperado: erro/null
    '32/32/2026',

    // esperado: erro/null
    'mês 99',

    // esperado: erro/null
    'janeiro até batata',

    // esperado: erro/null
    'ontem amanhã semana passada',

    // esperado: erro/null
    '------------',

    // esperado: erro/null
    '999999 dias atrás',

    // esperado: erro/null
    'faz muito tempo',

    // =====================================================
    // LOCAIS / REGIONAIS
    // =====================================================

    // esperado: 2026-03-09
    'faz uns 2 mês aí',

    // esperado: 2026-05-08
    'ontê',

    // esperado: 2026-05-09
    'agorinha',

    // esperado: 2026-05-02
    'semana retrasada',

    // esperado: 2026-04-01
    'mês retrasado',

    // esperado: 2025-01-01/2025-12-31
    'ano retrasado',

    // =====================================================
    // AMBIGUIDADE CONTROLADA
    // =====================================================

    // esperado: depende da regra
    'próximo domingo',

    // esperado: depende da regra
    'domingo agora',

    // esperado: depende da regra
    'essa semana',

    // esperado: depende da regra
    'próximo mês',

    // esperado: depende da regra
    'últimos dias',
];
