# Volta de emergência do site — 25/11/2026 23:43 (pedido do dono) · NADA PUBLICADO

Resultado: **nenhuma versão passou** nos dois critérios (compra pela nuvem + visual inteiro). Pela regra 7 do pedido, nada foi publicado; o dono decide.

## Candidatas (versões que foram ao ar no main, da mais nova para a mais velha)
| Versão | Data | Argus novo (compra pela nuvem, cupom) | Visual |
|---|---|---|---|
| f224c92 / de20a99 (no ar) … 4e9622f (20/11 19:55, pedido pela porta da nuvem) | 23/11 → 20/11 | f224c92 conferida: compra pela nuvem toda ok, cupom ok; só os 2 achados conhecidos ("+" passa o estoque; cupom forjado aparece) | **QUEBRADO** — camadas transparentes |
| e7a8672 … b81f3b9 (20/11 13:23, entrada da cópia limpa) | 20/11 | — (antes de 4e9622f o pedido ainda não ia pela porta da nuvem) | **QUEBRADO** — mesma causa |
| ef883de | 19/11 19:28 | **FALHA**: 0 chamadas ao pedido pela nuvem (perderia pedidos), sem selo do App Check (cupom e compra), reserva sem login, 1ª peça em 99 s no 4G fraco, sem robots.txt | inteiro |

Causa do visual quebrado (todas desde b81f3b9): a limpeza S430 de 19/11 17:10 (catalogo 2bd291d, entrou no main em b81f3b9) apagou as cores base do :root (--bg --pn --ln --ln2 --tx --mu --ac). Conferido: nenhuma versão de b81f3b9 em diante tem `--bg:#fbf7fa`; fotos de f224c92 e b81f3b9 (menu e peça) mostram a tela de baixo atravessando; ef883de inteira (foto ao lado).

Conclusão: não existe versão antiga que seja ao mesmo tempo segura (pedido pela nuvem, App Check) e inteira. A saída segura é andar para frente a partir da versão no ar desfazendo só a limpeza 2bd291d (67 de 95 trechos voltam sozinhos; 28 à mão) — espera a decisão do dono.

Arquivos: argus_ef883de.txt (saída completa do Argus novo na ef883de) · fotos_b81f3b9_x_ef883de.jpg (menu e peça: b81f3b9 à esquerda, ef883de à direita).
Testado: simulador do Argus novo (celular do dono). Não testado em aparelho real.
