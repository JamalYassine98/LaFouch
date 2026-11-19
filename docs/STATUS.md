# STATUS — ponte entre as sessões (criado 19/11/2026 a pedido do dono)

Para que várias sessões trabalhem ao mesmo tempo sem mexer na mesma coisa.
**Toda sessão:** puxar o mais novo (`git fetch --depth=20 origin main` + rebase) e ler este arquivo antes de começar; ao começar, pôr a sua linha em "Em andamento"; ao terminar (ou parar), tirar a linha e escrever 1 linha em "Últimas mudanças". Commit + push na hora (`git fetch --depth=20 origin main` + rebase antes do push).
Se a tela/arquivo que você vai mexer já está em "Em andamento" de outra sessão: NÃO mexer; avisar o dono.

## Onde está o estudo de cada parte (ler o que já existe, não refazer)
- App: docs/APP-MAPA.md (ler primeiro) · docs/APP-BOTOES.md · docs/APP-COMO-FUNCIONA.md · CODEMAP.md (módulos de src/)
- Site: docs/SITE-COMO-FUNCIONA.md · docs/ATLAS-SITE.md (medidas reais, 13/11)
- Decisões do dono: docs/MEMORIA-PROJETO.md · pendências: docs/FALTA-APROVAR-15-11.md (lista viva)

## Em andamento
| Sessão (assunto) | Frente | Telas / arquivos | Desde |
|---|---|---|---|
| Site (S429 cópia limpa) | SITE | catalogo ramo `limpo` (index.html, js/lf-site.js) — fora do ar | 19/11 |

## Últimas mudanças (mais nova em cima; manter só as ~20 últimas)
- 19/11/2026 — acesso direto à nuvem liberado pelo dono (CLAUDE.md e MEMORIA-PROJETO atualizados).
- 19/11/2026 — criado este STATUS.md e a regra no CLAUDE.md.
