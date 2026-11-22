# IDEIAS 03 · Bugs do site mostrados pelo dono (22/11, PC) — NÃO corrigir: achar a causa e juntar numa lógica só
Site no ar: 1795331899 (lf-site.js). Visto no navegador do app no PC do dono (1129 px).

## B1 — Imagens dos cartões que trocam (Comece por aqui, Para lojistas, guias)
- Dono: "não faz sentido ficar trocando as armações para lojistas, os guias… com imagens o cliente se guia mais fácil; se a imagem fica trocando pode confundir". Quer como era originalmente: imagem fixa.
- Causa (lf-site.js `guiaFotos`, ~l.2280): o cartão usa a foto de uma PEÇA do catálogo: a do `img` do guia se estiver com foto e não esgotada; senão "a 1ª peça do tipo, com foto, não esgotada e ainda não usada" (`cat5()`). `formato` e `atacado` (Para lojistas) nem têm `img`. Ordem do catálogo, estoque ou foto mudam → a imagem muda.
## B2 — Armação "toda borrada" (erro do giro do app)
- É a foto do BR44140 (dados/f/BR44140_2269682824.jpg): lente direita estourada/sumida. Apareceu em Para lojistas porque o B1 a escolheu sozinho. Causa da foto: tratamento do giro no app (Estúdio); o site aceita qualquer foto publicada.
## B3 — Mochi: óculos altos demais (e "a Mochi voltou")
- Medido no cartão "Teste de leitura" (tema Black Friday): óculos `ocl` y 218–254, olhos y 222–250 → centrados nos olhos; a conferir com o dono o que é "alto" (olhos+óculos em relação ao corpo/chapéu?). O cartão desenha o Mochi desde o B4 (11/11); sem mudança recente achada.

## Marcas do dono (04:32) — 1 Mochi · 2–3 fotos do "Comece por aqui" · 4 foto do "Para lojistas" · 5 "Solicitar orçamento" · 6–7 bordas da página no fim (a explicar) · 8 menu
## B4 — Ao rolar e abrir o menu, o topo (logo) e a faixa somem
- Reproduzido (PC 1129 px, rolado 700 px, menu aberto): `.top` vai para y −700 (fora da tela).
- CAUSA medida: abrir menu/janela põe `html.lock`; duas regras repetidas (`html.lock,html.lock body{overflow:hidden!important}` e `.lock body{overflow:hidden!important}`) põem overflow:hidden também no BODY. Overflow:hidden faz o body virar a "caixa de rolagem" do topo grudado (`position:sticky`): o topo passa a grudar no body (que não rola) e volta para o lugar dele no começo da página, lá em cima.
- PROVA ao vivo: com `body` sem overflow (só o html travado) o topo e a faixa voltam no lugar (topo y 0) e a página continua travada. Teste tirado depois (o site ficou como no ar).
- Vale para os 4 lugares que travam a página (menu, janelas, busca, telas por cima): a mesma causa some com todos.
- O dono tem ideias de como deve ficar o topo com o menu aberto (esperando).

## B5 — Minha conta: barras de rolagem esquisitas em Endereços/Cartões (print do dono 04:44, Brave no PC, espanhol, site 1795333368)
- Print: aba "Direcciones" marcada, mas na tela aparece a lista de PEDIDOS (3IEX, VIBT), cortada, com barra vertical E horizontal no cartão da Minha conta.
- CAUSA (lf-site.js ~l.4404–4416, troca de aba "conteúdo cruzado"): ao trocar de aba o site COPIA o conteúdo velho para uma camada solta (`.mcOld`, position:absolute) dentro do próprio cartão (`aside.panel`, que tem `overflow:auto`), e anda com o velho e o novo para os lados (translateX ±14/22 px). O cartão encolhe para a aba nova, mas a camada velha continua com a altura da aba antiga → sobra para baixo (barra vertical) e para o lado (barra horizontal). No Windows as barras aparecem; no simulador (barras invisíveis) não.
- O conteúdo da aba velha visível com a aba nova marcada = a camada velha ainda na tela (ou o print pegou no meio da troca) — a conferir ao vivo.
- Lógica natural: as 4 abas num trilho só (lado a lado) dentro de uma caixa que corta (sem rolagem própria); trocar = andar o trilho; a altura segue a aba ativa; a pílula e o conteúdo saem do MESMO estado (st.mcAba). Sai a cópia `.mcOld` e o "replaceChild" do trilho de abas.
- 04:48 REPRODUZIDO na simulação (barras do Windows ligadas, conta e pedidos de teste): Hoje, a cada troca, barra vertical e/ou horizontal no cartão e o conteúdo da aba antiga aparecendo com a nova marcada (b5-barras.json; vídeos b5-abas-pc.mp4 e b5-abas-cel.mp4, Hoje × Proposta). Proposta (pintura): sem a cópia solta; o cartão corta para os lados, a altura anda até a aba nova e o conteúdo novo entra deslizando — sem barras.
