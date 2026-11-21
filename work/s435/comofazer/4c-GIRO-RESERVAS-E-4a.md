# Como fazer: parte 4c, Giro e Reservas (135d, 149r) + o que faltou da 4a (149t, 149d) · S435 ESBOCO → APP · 21/11

A v582 (4a) saiu com "0 diferenças", isto é, só a limpeza: 149t e 149d ainda não estão no app (conferido em src/98-dash-cabecalho.js:46,
onde `.dHdT` ainda é `<button>`). Resultado esperado: os JS/CSS desses ids em work/kit/base_app.py.

## 149t: título de verdade (h1), nada muda na tela
- Onde nasce: `98-dash-cabecalho.js:46` (e o cabeçalho que `98z-dashboard-s48.js:159` redesenha, que sai na limpeza da 4a).
- Jeito natural: o título é `<h1 class="dHdT">Nome</h1>`, sem `data-act`, sem `aria-haspopup` e sem o "⌄".
  Hoje o 99c-navegacao-s435.js tira o "⌄" e os atributos depois de desenhar (o laço em `nvDesenha`, `.dHdT`). Esse laço sai no mesmo passo.
  Se o `ACT.dVer` não tiver mais quem o chame, sai com ele (procurar com o app rodando: tocar em todos os títulos).
- O pad100 lista `.dHdT` no FORA100; com o esboço 37 essa lista inteira sai.

## 149d: Histórico, linhas "Semana…" na margem das outras
- Onde nasce: `.hSem` (97-hist-busca.js, as linhas de semana do mês). Jeito natural: a linha de semana usa a mesma
  linha de lista de dobra (64 px, título 16, frase 13, margem 0). O pad99 de 98z-s374d-padrao.js hoje junta dias e semanas num `.g99 h101` depois do desenho;
  o Histórico passa a desenhar já dentro do grupo de linhas, e o ramo "Histórico" do pad99 sai.

## 135d: Giro, as dobras sem cartão
- Hoje: as dobras do Giro (Lista de compras, Vitrine da semana, Retorno do estoque, Curva ABC, Perdas e sobras) são `section.card.fxF`
  que o pad99 embrulha num `.g99`; o 135d tira o fundo, a borda e o raio e põe a linha fina entre elas.
- Jeito natural: `dFold()` (89-dash-abas.js) já desenha a dobra como **linha de dobra** (sem `card`), com a linha fina em cima da
  primeira e embaixo de cada uma. Assim o CSS do 135d não precisa existir e o ramo `section.card.fxF` do pad99 sai.
  Vale para todas as telas que usam `dFold` (Preços › Contas, taxas e meta em Ajustes, Reservas): regra 13, a família inteira.
  Conferir no comparador cada tela que chama `dFold`.

## 149r: Reservas vai para Dinheiro
- Grupos: **Giro e preços = Giro · Preços** (frase "Giro e preços") e **Dinheiro = Caixa · Reservas · Despesas · Câmbio**
  (frase "Caixa, reservas, despesas e câmbio"). O link "Reservas ›" em Preços já saiu (dono 19/11 16:40).
- Hoje há **duas tabelas de famílias** em 98z-s374.js: `FAM7` (entra com `S.fam7`) e `FAM6` (entra com `S.fam6`), cada uma
  aplicada uma vez, e a 2ª refaz parte da 1ª. Jeito natural: **uma tabela só** `FAMILIAS` com todas (Peças, Dinheiro, Site,
  Clientes, Resultados, Giro e preços, Marketing) e um número de versão `S.famV`. Quando o número do app é maior que o guardado,
  aplica a tabela (a mesma função para a 1ª vez e para cada mudança), respeitando o grupo que o dono mexeu à mão
  (marca `g.mexido` quando ele usa "Gerenciar grupo"). Apagar `fam6Aplica`, `fam7Aplica`, `S.fam6` e `S.fam7` no mesmo passo.
  (Dono 20/11 15:28: tudo é teste, sem cliente real, então não há transição de dados a guardar além disso.)
- Frases dos grupos num lugar só: hoje há `NV_GF` (99c-navegacao-s435.js:17), `g.frase` e o `gp.frase` de 89-inicio.js:140.
  Fica só o `frase` da tabela `FAMILIAS`; o `NV_GF` e a linha 140 saem.

## Trava no porteiro
- `.dHdT` é `H1` em Dashboard, Giro, Preços e Reservas; nenhum `.dHdT` com `data-act`.
- `.hSem`: margem esquerda = a das linhas de dia; altura ≥ 64.
- Nenhum `section.card.fxF` dentro de `#v-dash` com fundo ou borda; a linha fina entre as dobras.
- Grupos: `g:gp.itens` = ['giro','prec']; `g:din.itens` = ['caixa','din','desp','fx']; aparelho com `S.famV` antigo recebe a tabela nova
  uma vez; grupo marcado `mexido` não é tocado.
- Comparador contra a base: 0 diferença sem motivo em Giro, Preços, Reservas, Histórico, Dinheiro e Início (claro e escuro).
