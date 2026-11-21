# Como fazer: parte 4b, Preços (8 aprovados escritos direto na tela) · S435 ESBOCO → APP · 21/11

Aprovados: **135h, 149l (parte Preços), 149p, 149pl, 149fe, 149pg, 149sc, 149dup**. Com eles também valem o **149t**
(título h1, já previsto na 4a) e o **esboço 37** (20/11 23:42): ícone de linha de lista em cinza e link solto declarado na criação.
O resultado esperado está em work/kit/base_app.py (os JS desses ids). A imagem de hoje × proposta, no simulador v587, está em
work/s435/comofazer/prec_hoje.png e prec_prop.png. Os 149pl e 149fe se juntam: a linha "Preço automático" vive só dentro de FERRAMENTAS.

## A tela final (de cima para baixo)
1. "‹ GIRO E PREÇOS" · **h1 Preços** · "Margem e preço por tipo" (149t).
2. **Sem o cabeçalho "Contador"** (avatar C + "revisado …"), conforme o 149sc.
3. Os 4 números em grade, com linhas finas: Margem média real (▲/▼ N pts) · Lucro por peça · Contas do mês cobertas (faltam N peças) · Preços para corrigir.
   - O número usa a letra do texto (Roboto, com números de mesma largura), não a Fraunces (135h). A Fraunces fica só no h1.
   - **Nenhum dos 4 é tocável** (149dup): sem data-act, sem role=button e sem cursor.
4. PARA DECIDIR ESTA SEMANA · N:
   - "N preços para corrigir ⌄" abre no lugar (a lista pcCorpo, como hoje).
   - Uma linha por tema: "Black Friday em N dias" · "Por quê ›" ou "Ver ›".
   - Uma linha por assunto do preço automático ("Pôr N peças em oferta", "N peças voltam ao preço") · "ver um por um". Cada peça fica guardada e abre no "ver um por um".
   - Uma linha por tabela de atacado: "Tabela X: N peças com margem baixa" · "abaixo de 10% · a menor está em N%" · "Ajustar tabela ›", que abre **a tabela X** (149dup). Hoje todas abrem a lista geral.
   - "Aceitar os N preços" aparece só se houver oferta ou volta para aceitar.
   - **Sem a linha "Pré-graduados · preço por linha"** (149pg).
5. FERRAMENTAS (149fe): três linhas de lista de 64 px (ícone 24 · título 16 · frase 13 · ›), com o ícone em **cinza** (esboço 37 substitui o "ícone rosa"):
   - Calculadora de preço — "quanto cobrar pelo custo e pelo lote" → cntCalc
   - E se…? — "dólar, contas, desconto ou meta: o que muda" → cntEse
   - Preço automático — "ligado|desligado · revisado DD/MM HH:MM · em Ajustes" → Ajustes, abrindo a linha Preços (149pl/149sc)
6. Quando o preço automático está ligado, fica "Esta semana · N ajustes" (a lista com desfazer, de precosAutoHtml). É o número do que já mudou, e o lugar dele é aqui.
7. **Sai "REGRAS DO CONTADOR"** inteiro de Preços (149p): o interruptor (paSwitchHtml, com a prévia paPrev) e "Contas, taxas e meta" (dFold cfg) mudam de lugar.

Links (149l): "Por quê ›", "Ver ›", "Ajustar tabela ›". Começam com maiúscula, rosa, 15 px, sem sublinhado e com ›.
Nascem da função única de link do esboço 37 (`lkSolto`), e não do pad100.

## Ajustes (149p), junto com o esboço 37 (3 blocos)
- No bloco LOJA, depois de Site: a linha **Preços** ⌄ (ícone etiqueta), com o valor "automático ligado|desligado".
- Ao abrir, aparecem no lugar: o interruptor Preço automático (paSwitchHtml + paPrev) e a dobra "Contas, taxas e meta"
  (paMetaHtml + precosCfgHtml + pagamentoHtml), as mesmas funções de hoje, só chamadas daqui.
- O "Preço automático ›" de Ferramentas abre Ajustes com essa linha aberta (estado S.ajAb = 'preco' ou o que a lista de Ajustes já usa para abrir uma linha) e rola até ela.

## Como fazer (jeito natural, regra 12)
1. **Uma função só desenha a tela:** `precosTelaHtml()` no arquivo da família (ex.: src/9x-precos.js), chamada pelo ramo `prec` do
   89-dash-abas.js no lugar de `contadorHtml() + REGRAS DO CONTADOR`. Ela monta os blocos 1–6 de cima a partir dos dados
   (`cntSaude`, `cntDecisoes`, `invPrecosAcorrigir`, `temaAtual`, `tabLista`), já agrupados:
   - **Agrupar nos dados, não no HTML:** `cntDecisoes()` passa a devolver os grupos prontos, com `{t:'tab', tab, n, min}` por tabela e `{t:'pa', kind, n, itens}` por assunto.
     Hoje o s52 relê o HTML com regex ("Atacado X com margem N%") para reagrupar; esse caminho sai.
   - Os "Subir …" não entram (já estão nos "preços para corrigir"), como o s374 faz hoje removendo depois.
2. **Apagar no mesmo passo:**
   - src/98z-precos-s52.js inteiro (embrulho do contadorHtml e ACT.c52Ver; o "ver um por um" passa para a função nova com ACT próprio).
   - O embrulho do contadorHtml em src/98z-s374.js (o bloco "Subir N preços já está dentro…", x66L, tpl dos pré-graduados, o
     `pcAbre → x66` trocado no HTML) e `ACT.pgrAjusta`.
   - Em 97z2-contador.js: o `cntHd`, o `cntB` (Calculadora/E se viram linhas de Ferramentas) e o `cntKpi` com act.
     O `contadorHtml` antigo some; `cntDecisoes`, `cntSaude`, `cntCalc` e `cntEse` ficam.
   - 89-dash-abas.js: as linhas de REGRAS DO CONTADOR.
   - 149pg: `pgrPrecos()` (97-preco-auto.js) e o ramo `prePe/prePl` de 96-ajustes.js, que só serviam à folha "ajustar".
     **Não mexer em `S.faixas[].precos[tipo]`:** é a regra de todos os tipos (50-categorias-tipos.js:219) e continua.
   - O CSS `.cnt.lx .cntK b{font:…var(--display)}` e o que só servia ao `.cntHd` e ao `.cntB`.
3. **"Ajustar tabela ›" abre a sua tabela:** `data-act="tabsheet" data-id="<id da tabela>"`; `tabSheet(false, id)` abre já na tabela
   (destaca e rola até ela). Uma função para todas as linhas.
4. **Plural num lugar só (135h):** uma função `nDias(n)` ("1 dia", "N dias") usada pelo tema em cntDecisoes e no 97r-temas (linhas 85 e 129).
   *Suspeito para o dono:* hoje aparece "Black Friday em 0 dias". O 135h não decidiu o 0. Vai para a Fila como pergunta, e o texto não muda sem ele.
5. **Ícone de linha de lista:** as linhas de Ferramentas usam a mesma classe das linhas de lista do grupo (`.nvL`, `.nvIc` em `--mute`), sem estilo próprio.

## Trava no porteiro (regra 12e)
- Preços: nenhum `.cntK` com `data-act`, nenhum `.cntHd`, nenhuma linha "Pré-graduados · preço por linha", nenhum "REGRAS DO CONTADOR";
  FERRAMENTAS com 3 linhas na ordem acima; nenhum texto "1 dias".
- Cada "Ajustar tabela ›" abre uma tabela diferente (data-id distintos = número de tabelas com margem baixa).
- Ajustes: a linha Preços existe e, aberta, contém `#paCard` e a dobra `cfg`; tocar em "Preço automático ›" de Preços chega com ela aberta.
- Valores: os testes de números que já existem (S362–S374) continuam iguais. Comparador contra a base (hoje + aprovados): 0 diferença sem motivo,
  em claro e escuro, letra 1× e 1,3×.
