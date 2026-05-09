# Projeto Tempo

A biblioteca `tempo` realiza parse de linguagem natural (PT-BR) para datas e intervalos de datas.

## Estrutura de Código Ideal para Copiar e Colar

Esta biblioteca foi desenhada como uma dependência interna para ser facilmente **copiada e colada** (vendorizada) em projetos que precisem dessa funcionalidade, sem necessitar de uma publicação no NPM.

A estrutura de arquivos foi separada na pasta `src/` para ser bastante coesa e modular:

- `src/index.ts`: Ponto de entrada. Exporta a função principal `tempo` e os tipos. Contém a lógica de verificação de range (intervalos).
- `src/parser.ts`: Lógica detalhada do parser de datas simples, interpretando palavras-chave (hoje, amanhã), dias relativos, dias da semana e meses.
- `src/utils.ts`: Funções puras utilitárias (normalização de strings de caracteres especiais, formatação para ISO string e dicionários PT-BR de tempo).
- `src/types.ts`: Tipos e opções da biblioteca.
- `src/index.test.ts`: Conjunto de testes unitários para validar regressões caso a biblioteca seja adaptada no projeto destino.

**Como usar num projeto novo:**
Basta copiar a pasta `src` (ou os arquivos dela) para dentro do projeto destino (por exemplo: `utils/tempo/`) e importar a função.

## Inspiração e Evolução: hot-date

Para enriquecer as capacidades do `tempo`, utilizamos a excelente biblioteca web [hot-date](https://github.com/stolinski/hot-date) como base de inspiração e referência funcional.
Ela foca fortemente em input de linguagem natural para preenchimento de inputs de datas (ambiguity resolution e smart completation).

**Como achar informações e features inspiracionais no hot-date no futuro:**
1. Verifique os **testes** do repositório no Github para entender casos extremos (edge-cases) e padrões que o parser deles prevê:
   `https://github.com/stolinski/hot-date/tree/main/src` (procure por testes).
2. Explore a lógica do seu motor natural para mapear quais outras expressões ou tempos relativos eles suportam nativamente que poderiam enriquecer esta versão em português.
3. Observe a paridade do formato final de output que utilizamos, que segue o mesmo padrão deles:
   - Data Única (Single Date): `YYYY-MM-DD`
   - Intervalo (Range): `YYYY-MM-DD/YYYY-MM-DD`
