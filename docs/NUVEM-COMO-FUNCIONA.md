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
| `seloOk(req, res, porta)` | App Check (modo em functions/selo.js). |

## Pagamento automático pelo e-mail do banco (pix.js; atualizado em 20/11/2026)
- **Ficha do pedido:** `conferePedido` confere o pedido do site com o catálogo e o valor a pagar com a cotação de `config/site` (`Presente.confere` → `pagar`). Pedido dentro da regra ganha a ficha `pixEspera/<pedido>` (`tipo: 'site'`, `conf: true`, `moeda`, `valor`, `teto`, `nome`, `itens`), que o app não apaga. Pedido suspeito, de teste ou com erro não ganha ficha e nunca é confirmado sozinho.
- **Robô (`Pix.recebe`):** uma regra só para Nubank, Itaú e Banco Familiar. Valor exato → esse pedido; a mais até o `teto` (total cheio) → também vale; a menos → "sem par". Nome e hora só desempatam.
- **Confirmar = segurar a peça como paga** (`Reserva.pagar`, a mesma regra do app). Se a peça já foi para outra pessoa: "sem par" com `motivo: 'sem-peca'` e o pedido, nunca "pago" sem a peça.
- **Tudo ou nada:** se der erro no meio, o e-mail volta a "não visto" e o robô tenta de novo.
- **Robô do Gmail (work/pix/robo-pix.gs, Apps Script; o dono cola):** os bancos num lugar só (`BANCOS`); o e-mail só vale se a PRIMEIRA linha `Authentication-Results: mx.google.com` (a do próprio Gmail) aprovar o DKIM/DMARC do banco, ou se a cadeia de reenvio que o Gmail aprovou (`arc=pass`) trouxer o DKIM do banco. Manda também o pagador e a hora do Nubank (só desempate). Travas: `functions/teste-robo.js`.

## Travas (functions/teste-*.js; o GitHub roda todas antes de publicar)
- `teste-portas.js`: as 15 portas respondem certo a método errado, corpo vazio, ação inválida, corpo em texto e dono sem login; as portas do site usam uma lista só; cada peça comum aparece num lugar só; os avisos ao celular.
- `teste-email.js`: um só envio de e-mail · `teste-selo.js`: toda porta pública chama o selo.
- No ar: `tools/sonda-nuvem.sh` confere as portas publicadas (sem login, sem gravar). Roda no fim de "Publicar a nuvem" e sozinho pelo workflow "Conferir a nuvem no ar":
  `gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/conferir-nuvem.yml/dispatches -f ref=main`
