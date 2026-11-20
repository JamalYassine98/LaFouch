# Parte 2b (grupos) — desenho pronto para aplicar (S436, 20/11 12:50). NÃO aplicado ainda.

## iniLista: 6 camadas → uma função (src/89-inicio.js), mesma ordem de efeitos
Camadas de fora para dentro: s374c(fam95) → s374:426(fam80) → s374:332(rat66, fam63 — ANTES da velha) → s374:126(fam6) → s374:86(fam7b) → s374:41(fam7) → base.
Linearização fiel (a base atual vira `iniListaBase()`; nada mais muda de lugar):
```js
function iniLista() {
  if (!S.rat66) { S.rat66 = true; S.rateio = 'custo'; }
  if (!S.fam63) { S.fam63 = true; var gp = grpGet('g:pecas'); if (gp) { gp.itens = gp.itens.filter(x => ['lotes','repo','cont'].indexOf(x) < 0); gp.frase = 'Inventário e estúdio'; } }
  var l = iniListaBase();
  if (!S.fam7) { fam7Aplica(); iniListaBase(); var den = []; (S.grupos || []).forEach(g => { den = den.concat(g.itens); }); S.inicioT = S.inicioT.filter(x => den.indexOf(x) < 0); l = iniListaBase(); }
  if (!S.fam7b) { S.fam7b = true; var g = grpGet('g:site'); if (g && g.itens.indexOf('site') < 0) g.itens.unshift('site'); }
  if (!S.fam6 && S.fam7) { fam6Aplica(); l = iniListaBase(); }
  if (!S.fam80) { var m = grpGet('g:mkt'); if (m) { S.fam80 = true; if (m.itens.indexOf('cup') < 0) m.itens.push('cup'); m.frase = 'Posts, vídeos, temática e cartões'; } }
  if (!S.fam95 && S.fam6) { S.fam95 = true; /* bloco do s374c:19–31 igual */ saveSoon(); l = iniListaBase(); }
  return l;
}
```
Conferir antes de aplicar: fam7Aplica() liga S.fam7? fam6Aplica() liga S.fam6? (se não ligarem, a condição do passo seguinte muda.)
Prova: `equiv_grupos.py` (a fazer, no molde do equiv_nav.py): para vários estados guardados de partida (instalação nova; antes do fam7 com grupos e atalhos do dono; só fam7; fam7+fam6; tudo ligado), render() no antes × depois e comparar S.grupos, S.inicioT, S.barra e as marcas fam*.

## grpAbre: 2 camadas → uma função (src/95-barra-grupos.js)
A camada de fora (s374d:149) ganha da de dentro (s374:135) para g:mkt com fam — a de dentro (ACT.grpVer) NUNCA roda. Fica:
```js
function grpAbre(g) {
  if (g && g.id === 'g:mkt' && g.fam) S._gAt = g.id;
  inicioGo(g.ult && g.itens.indexOf(g.ult) >= 0 ? g.ult : g.itens[0]);
}
```
(devolve o mesmo que antes para quem usa o retorno: conferir chamadas com `return grpAbre(…)`.)

## grpTitulo (98z-grupo-flecha-s41:64 → trocada inteira no 99c:164, dentro de função) e as tabelas com chave repetida
- grpTitulo: a do s41 não roda mais; a do 99c é a que vale. O 99c mora dentro de um bloco: declarar a função do 99c com nome próprio e apontar o passo do render para ela; apagar a do s41 e o `aposRender(function () { grpTitulo(); })` que ficou na parte 1.
- Tabelas: BARRA_NOME.vendas (89-inicio × 98z-s374:19), BARRA_NOME.mkt (89-inicio × s374d:99), GRP_FRASE.{lotes,caixa,desp,fx,ped,anl,ata} (s41 × s374 × s374c), DT_FRASE.hoje (98-dash-cabecalho × s48:8): deixar só o valor que vale hoje (o último), no lugar da primeira definição.

## 2c: setView (98z-s374:210 zera segH e minHeight antes) → as 2 linhas entram no começo do setView (90-navegacao-dashboard.js); ações soltas despAb, dfold, famNum, stAbre.
