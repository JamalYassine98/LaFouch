# Código morto no site (cópia limpa) — levantamento de 20/11, pedido do dono (só leitura; nada foi tirado)
Como o modo lista: função que ficou no código mas ninguém alcança, ou versão antiga escondida por baixo de uma nova.

1. **12 funções com a versão antiga escondida** (declaradas e depois trocadas por outra mais abaixo; a de cima nunca roda):
   aceitaCup, cupHtml, cupPecaHtml, mtjCarrega, drawBag, bag, gEntrar, pkPagar, enviarPedido, evAtivo, newsForm, livre.
2. **55 funções "embrulhadas"** (`var _f=f; f=function…` — remendo em cima de remendo; a regra 12 proíbe): product (8×), drawGrid (6×), openPanel (4×), bag (3×), closeLayer (3×), layer, lista, redraw, setHero, drawChips, drawFaces, vis, dstHtml, evAplica, navTitulo, vgrDraw, homeHtml, goTo, evAtivo, toggleFav, pkPagar, compare…
3. **Coisas escondidas à força** (`display:none!important`), candidatas a função removida que ficou no código — conferir uma a uma:
   botões #fbtn/#ftog dentro do catálogo; seção `hero` antiga; rodapé antigo (`footer`); busca antiga do topo, #theme (tema claro/escuro), #lgb, `.mobsearch` no topo; #cambio; .res; #cbl; setas/pontos do carrossel de rostos (.fcar .far, #fdots); brilho dos cartões com foto (.shine); `.hd .hnc`.
4. **Estilo que nenhuma tela usa:** só 1 classe de 838 (limpo depois das limpezas 1–4).
5. **Dados inventados de exemplo:** bloco "ficha técnica de exemplo" que inventa medidas a partir do código da peça (planta do banco, parte 1).
