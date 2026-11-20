# Estudo — faixa do evento (BLACK FRIDAY) cobrindo o topo — 19/11/2026 (NUVEM · implementa, só leitura, para a SITE · implementa)

Pedido do dono (22:29): "a faixa do Black Friday tá quebrando" (foto: lafouch.com/conta no celular — a faixa preta cobre a parte de cima do topo; ícones e logo cortados).
Lido no catalogo `main` ef883de (19/11 19:28). NADA foi mudado.

## Causa (medida no simulador, 390 px, com o evento "bf" ligado)
| Tela | Faixa `#evbar` | Topo `.top` |
|---|---|---|
| Início | 0–33 px, `position: relative`, z 10001 | 33–107 px, `sticky` (fica embaixo da faixa) — certo |
| Conta / página da peça | 0–33 px, `relative`, z 10001 | **0–74 px, `fixed` em top:0**, z 35 → os 33 px de cima do topo ficam **debaixo da faixa** |

- A faixa é posta ANTES do `.top` (lf-site.js `evAplica`, ~linha 2135) e vive solta no fluxo da página.
- Na conta e na peça, a regra "v452 bugs: cabeçalho sempre visível…" (index.html ~linha 2173: `html.v5:has(#layer .scrim.pg) .top{position:fixed!important;top:0;…}`) prende o topo em `top:0` sem contar a faixa.
- Duas regras posicionam o alto da tela separadas (faixa e topo), cada uma com a sua camada (10001 e 35) — por isso uma cobre a outra.

## Jeito natural (CLAUDE.md regra 12 — sugestão; esboço com a SITE · implementa)
- A faixa passa a ser a **primeira linha do próprio topo** (dentro do `.top`), não um bloco solto antes dele. Assim, sticky ou fixed, a faixa e o topo andam juntos e nunca se cobrem, em todas as telas.
- Sai o `z-index:10001` e o `position:relative` próprios da faixa (12d: apaga o que substitui).
- Uma medida só do alto da tela (faixa + topo) para quem precisa descontar o topo (camadas que abrem por cima, carrinho para onde a peça voa).
- Trava (12e): prova no porteiro — com evento ligado, em todas as telas (início, catálogo, peça, conta, carrinho, pagamento), o `.top` nunca começa acima do fim da faixa.
