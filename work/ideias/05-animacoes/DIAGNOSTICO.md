# 05 — Animações do menu, carrinho e busca (medido no site 1795333368, 22/11)

| | Abre | Fecha | De onde vem | Fundo |
|---|---|---|---|---|
| Menu (☰) | 280 ms (.2,.8,.2,1), gaveta da esquerda; itens em cascata 260 ms (.16,1,.3,1) | 200 ms (.2,.8,.2,1) | esquerda | escurece (.dsc 250 ms) |
| Busca (lupa) | 440 ms (.16,1,.3,1), cresce da lupa (scale .7→1) | 260 ms (.4,0,.2,1) | o botão | site recua (scale .985) + escurece 320 ms |
| Carrinho (sacola) | 460 ms (.16,1,.3,1), página inteira da direita, abaixo do topo (y=112) | 300 ms (.4,0,.2,1) | direita | nenhum (troca de página /carrinho) |

## Causa
Não há uma regra única de movimento: cada camada nasceu com seu próprio tempo, curva, direção e fundo.
São 3 tempos de abrir, 3 de fechar, 3 curvas e 3 direções, contra a regra 17 (uma curva e um tempo).

## Lógica proposta (jeito natural, um lugar só)
- Uma só "camada que abre por cima", com: tempo de abrir, tempo de fechar (o inverso, mais rápido), uma curva, um fundo (recua + escurece).
- A direção vem do lado do botão que abriu: o que está à esquerda abre da esquerda, o que está à direita abre da direita.
- O topo (logo + faixa) fica sempre parado e visível. Isso também resolve o B4 (o topo sumia com o menu aberto depois de rolar).
- O código velho de cada uma das três sai no mesmo passo.
