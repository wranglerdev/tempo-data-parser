# Mapa de Evolução (Checklist)

Com base nas capacidades de linguagem natural testadas no [hot-date](https://github.com/stolinski/hot-date), aqui está o mapeamento de casos e variações a serem implementados no `tempo` futuramente para atingir paridade.

## 1. Formatos Numéricos e Textuais Complexos

- [x] Variações abreviadas de mês: `mar 1 86`, `m 1 86` (ex: `mai 10 26`, `m 10 26`)
- [x] Omissão do ano com ordinais: `march 1st` (ex: `1º de março`, `primeiro de março`)
- [x] Dias diretos com artigo: `the 20th`, `15th` (ex: `o dia 20`, `dia 15`)

## 2. Aritmética de Datas (Adição e Subtração)

O *hot-date* permite somar ou subtrair períodos a partir de uma data âncora usando sinais matemáticos ou linguagem equivalente (`+`, `-`, `mais`, `menos`).

- [x] `hoje + 9 dias`
- [x] `natal + 2 dias` (ou `natal + 2`)
- [x] `próxima segunda + 2 semanas`
- [x] `fim de semana + 1 semana`

## 3. Relativos e Períodos Complexos

- [x] `o dia antes de ontem` (sinônimo explícito de anteontem)
- [x] `em 3 dias` (sinônimo de daqui a 3 dias)
- [x] `início do ano` / `começo do ano`
- [x] `fim do mês` / `final do mês` / `fim do próximo mês`
- [x] `início da semana` / `começo da semana`
- [x] Meses relativos: `mês passado`, `próximo mês`, `este mês`
- [x] Anos relativos: `ano passado`, `ano que vem`, `este ano`

## 4. Feriados e Datas Comemorativas (Anchors)

- [x] `natal` (25 de dezembro)
- [x] `véspera de natal` (24 de dezembro)
- [x] `ano novo` / `réveillon` / `véspera de ano novo`
- [x] `dia das mães` (2º domingo de maio no Brasil)
- [x] `dia dos pais` (2º domingo de agosto no Brasil)
- [x] `carnaval` (Cálculo variável)
- [x] `páscoa` (Cálculo variável)
- [x] Dias da semana antes de eventos: `sexta antes do natal`

## 5. Ranges Complexos e Mistos

- [x] Ranges aritméticos: `hoje + 3 dias até hoje + 10 dias`
- [x] Ranges de relativos mistos: `2 meses atrás até hoje`
- [x] Ranges descritivos: `ontem a amanhã`, `sexta a segunda`
- [x] Variações no separador (além de ` a `, `-` e ` até `): `..`, `...`, `->`

## 6. Tolerância Avançada (Fuzzy Matching e Typos)

O *hot-date* é capaz de tolerar dezenas de erros de digitação comuns através de distâncias de Levenshtein ou expressões regulares flexíveis (ex: `tomorow`, `teusday`).

- [x] Tolerância para `amanhã` (ex: `amanah`, `amnhã`)
- [x] Tolerância para meses (ex: `fevereiro` -> `feveiro`, `fevereiro`)
- [x] Tolerância para dias da semana (ex: `quarta` -> `quata`, `domingo` -> `domngo`)

---

## Coisas para adicionar depois

abreviações (jan, fev, set)
erros ortográficos toleráveis (atraz, jantiro)
números por extenso (dois meses atrás)
intervalos naturais:
entre janeiro e março
de março pra cá
até semana passada
linguagem informal:
desde o começo do ano
da virada do ano até hoje
lá pra janeiro
expressões brasileiras:
anteontem
depois de amanhã
fim do mês
começo do ano
meados de abril
no natal
na páscoa
no carnaval
