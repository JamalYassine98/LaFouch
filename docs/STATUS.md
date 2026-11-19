# STATUS — ponte entre as sessões (criado 19/11/2026 a pedido do dono)

Para que várias sessões trabalhem ao mesmo tempo sem mexer na mesma coisa.
**Toda sessão:** puxar o mais novo (`git fetch --depth=20 origin main` + rebase) e ler este arquivo antes de começar; ao começar, pôr a sua linha em "Em andamento"; ao terminar (ou parar), tirar a linha e escrever 1 linha em "Últimas mudanças". Commit + push na hora (`git fetch --depth=20 origin main` + rebase antes do push).
Ler também "Recados": o que for para você, fazer e apagar a linha.
Se a tela/arquivo que você vai mexer já está em "Em andamento" de outra sessão: NÃO mexer; avisar o dono.

## Onde está o estudo de cada parte (ler o que já existe, não refazer)
- App: docs/APP-MAPA.md (ler primeiro) · docs/APP-BOTOES.md · docs/APP-COMO-FUNCIONA.md · CODEMAP.md (módulos de src/)
- Site: docs/SITE-COMO-FUNCIONA.md · docs/ATLAS-SITE.md (medidas reais, 13/11)
- Decisões do dono: docs/MEMORIA-PROJETO.md · pendências: docs/FALTA-APROVAR-15-11.md (lista viva)

## Em andamento
| Sessão (assunto) | Frente | Telas / arquivos | Desde |
|---|---|---|---|
| App (S435 famílias de botões) | APP | só leitura do inventário: docs/FAMILIAS-BOTOES.md (novo), work/verif/familias2.py | 19/11 |
| Site (S429 cópia limpa) | SITE | catalogo ramo `limpo` (index.html, js/lf-site.js) — fora do ar | 19/11 |

## Recados entre sessões (quem lê, faz e apaga a linha)
| Para | De | Recado | Quando |
|---|---|---|---|
| — | — | — | — |

## Últimas mudanças (mais nova em cima; manter só as ~20 últimas)
- 19/11/2026 12:17 — sessão de apoio: ESBOÇO DE EXEMPLO da família Voltar no Pagamento (work/s436/esboco_voltar_*.jpg): "‹ Carrinho" 15 px → "‹ CARRINHO" versalete 12 px igual ao Câmbio. Esperando o dono; nada no código. S435: usar como modelo se o dono aprovar.
- 19/11/2026 11:50 — App v562 (5.45.0): NAVEGAÇÃO B refinada publicada (src/99c-navegacao-s435.js + bloco S435 do www/style.css; saiu o título com ⌄ de src/98z-grupo-flecha-s41.js). 318/318 testes; inventários (work/verif/inv, docs/INVENTARIO-*.md) refeitos. Não testado em aparelho real.
- 19/11/2026 12:02 — CLAUDE.md REORGANIZADO (23 regras em 8 partes, aprovado pelo dono). Toda sessão: reler o CLAUDE.md antes de continuar.
- 19/11/2026 — Site S429: cópia limpa no ramo `limpo` do catalogo (fora do ar) com os aprovados no código; análise ganhou `ramo2` (hoje=main × prop=limpo). Em andamento até o "implementar".
- 19/11/2026 — acesso direto à nuvem liberado pelo dono (CLAUDE.md e MEMORIA-PROJETO atualizados).
- 19/11/2026 — criado este STATUS.md e a regra no CLAUDE.md.
