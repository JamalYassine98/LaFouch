# Nuvem (functions/) — como funciona

Atualizado em 20/11/2026 pela sessão NUVEM · implementa. Quem mexe aqui é só a NUVEM (CLAUDE.md 1b).
Para publicar, veja docs/PUBLICAR-NUVEM-GITHUB.md.

## Peças comuns (regra 12c: cada uma num lugar só, no começo do index.js)
| Peça | Para que serve |
|---|---|
| `post(nome, opções, fn)` | Porta POST: recusa outro método (405), lê o corpo e trata o erro igual em todas. Só `reserva` (responde 200 + motivo), `avaliacao` e `novidades` (também leem com GET) e `comprovante` (página) não usam. |
| `corpo(req)` | Lê o corpo como objeto, seja JSON ou texto (o sendBeacon do site manda texto). |
| `tokenDe(req)` | Lê e confere o login de quem chama (`Authorization: Bearer …`). `ehDono` e `clienteDe` usam essa peça. |
| `falhou(res, nome, e)` | Erro esperado (`Falha`) → código e motivo dele (com os campos extras); qualquer outro erro → 500 `erro`. |
| `Falha` (functions/falha.js) | O único erro esperado de todos os módulos: `new Falha(motivo, status=400, extra)`. |
| `CORS_SITE` | Os endereços que podem chamar as portas do site (o site e as cópias de teste no computador). `seg` aceita só lafouch.com. |
| `emailResend(op)` | O único envio de e-mail (Resend). |
| `avisaAparelhos(filtra, msg)` | O único envio de aviso ao celular; tira da lista o aparelho que não existe mais. |
| `vipDe(req)` | S6: a Cliente VIP é a pessoa LOGADA (e-mail confirmado); o telefone vem do par e-mail ↔ telefone de um pagamento confirmado (`compradores/e…`.tel). Usado no "presentes" do cupom e na reserva de 3 h. |
| `ehVip(tel)`, `telDe(t)` | Cliente VIP e os 9 últimos números do telefone (`telDe` = `Cupom.telN`). |
| `Email.esc` (email.js) | O único escape de HTML dos e-mails. |
| `catalogoPisos()` | Todas as peças com os pisos (presente especial). |
| `hash(t, n)`, `urlFn(nome)`, `criaUmaVez(ref, o)` | Resumo sha256, endereço de uma função e "cria só se não existe". |
| `seloOk(req, res, porta)` | App Check (modo em functions/selo.js). Conta em seloDia/<dia> por porta, estado (com/sem/ruim) e origem (site = lafouch.com, local = localhost, robo = sem Origin: nossas sondas/testes ou robôs de fora), ex. `reserva_sem_site` (22/11). Para ligar o "exigir", olhar só os `_site`. |
| `redeDe(req)` / rede.js | Limites por rede (22/11): a mesma rede = IPv4 inteiro, IPv6 pelo bloco /64; números num lugar só (`LIMITE`: reserva 30, pedido 30 por rede e 5 por telefone, comp 10, cancel 20, avise 10, por hora) — 30 dá folga para a Black Friday no Wi-Fi da loja. (A "rede da loja" sem limite foi retirada pelo dono 22/11 15:10.) Reserva além do limite: `{ok:false, motivo:'espera'}` e o site segue o pedido sem segurar a peça. |

## Pagamento automático pelo e-mail do banco (pix.js; atualizado em 20/11/2026)
- **Ficha do pedido:** `conferePedido` confere o pedido do site com o catálogo e o valor a pagar com a cotação de `config/site` (`Presente.confere` → `pagar`). Pedido dentro da regra ganha a ficha `pixEspera/<pedido>` (`tipo: 'site'`, `conf: true`, `moeda`, `valor` = o preço do carrinho, sem final único — 39, 21/11; `nome`, `itens`), que o app não apaga. Pedido suspeito, de teste ou com erro não ganha ficha e nunca é confirmado sozinho.
- **Robô (`Pix.recebe`):** uma regra só para Nubank, Itaú e Banco Familiar. Só o VALOR EXATO acha o pedido; vários iguais → vale o único com a reserva aberta (`Reserva.aberta`), depois nome e hora. O resto vai para `pixSemPar` com `motivo`: `sem-pedido`, `empate` (com `ids`) ou `sem-peca`.
- **Ligar na mão (39):** `reserva {acao:'ligar', pix:<id do pixSemPar>, pedido:<id>}`, só o dono: o mesmo caminho da confirmação automática; o `pixSemPar` fica com `ligado`.
- **Confirmar = segurar a peça como paga** (`Reserva.pagar`, a mesma regra do app). Se a peça já foi para outra pessoa: "sem par" com `motivo: 'sem-peca'` e o pedido, nunca "pago" sem a peça.
- **Tudo ou nada:** se der erro no meio, o e-mail volta a "não visto" e o robô tenta de novo.
- **Robô do Gmail (work/pix/robo-pix.gs, Apps Script; o dono cola):** os bancos num lugar só (`BANCOS`); o e-mail só vale se a PRIMEIRA linha `Authentication-Results: mx.google.com` (a do próprio Gmail) aprovar o DKIM/DMARC do banco, ou se a cadeia de reenvio que o Gmail aprovou (`arc=pass`) trouxer o DKIM do banco. Manda também o pagador e a hora do Nubank (só desempate). Travas: `functions/teste-robo.js`.

## Pedido pela nuvem (pedido.js; S3 parte 1, 20/11/2026)
- Porta `pedido`: POST `{id, doc}` com o mesmo documento que o site gravava direto em `pedidos/<id>` (pedido, `comp`, `cancel`, `avise`). Confere o formato (as regras que eram do firestore.rules), limita 10 por rede/hora (cancelamento 20) e 10 pedidos por telefone/hora, e só aceita comprovante/cancelamento de pedido que ela recebeu (`pedidoIds/<id>`) e que não foi pago. Mandar de novo o mesmo = igual a 1.
- Parte 2: o SITE passa a usar a porta. Parte 3: o firestore.rules fecha a criação direta em `pedidos/`.

## Novidades por e-mail (inscricao.js; S5 + S7)
- Inscrever (site ou "Avise-me") grava `inscricoes/<id>` com `conf: false` e manda 1 e-mail "Confirme" (no máximo 1 a cada 10 min por e-mail; 5 inscrições por rede por hora). O link (`novidades?confirmar=<id>&t=<código>`, vale 7 dias) marca `conf: true`.
- O e-mail do tema e a lista do painel só têm quem confirmou e não saiu (`Inscricao.vale`). A limpeza diária apaga a não confirmada de 7+ dias.

## Travas (functions/teste-*.js; o GitHub roda todas antes de publicar)
- `teste-portas.js`: as 15 portas respondem certo a método errado, corpo vazio, ação inválida, corpo em texto e dono sem login; as portas do site usam uma lista só; cada peça comum aparece num lugar só; os avisos ao celular.
- `teste-email.js`: um só envio de e-mail · `teste-selo.js`: toda porta pública chama o selo.
- No ar: `tools/sonda-nuvem.sh` confere as portas publicadas (sem login, sem gravar). Roda no fim de "Publicar a nuvem" e sozinho pelo workflow "Conferir a nuvem no ar":
  `gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/conferir-nuvem.yml/dispatches -f ref=main`
- **Teste de compra de ponta a ponta** (workflow "Teste de compra…", tools/teste-compra/compra.js; só quando chamado): reservar → pedido pela porta → ficha com o valor exato → PIX do robô simulado → pago, peça segura, token no lugar fechado → token pelo telefone (errado recusado) → aviso repetido = 1 → apaga tudo. O celular do dono recebe o aviso "Novo pedido … Teste automático (robô)".
  `gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/teste-compra.yml/dispatches -f ref=main`
- **Vigia diário** (workflow "Vigia diário da nuvem", tools/vigia-nuvem.sh; 06:37 no Paraguai): sonda, erros das funções nas últimas 24 h e selo de ontem → recado VIGIA → NUVEM no status.
