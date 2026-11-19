# Estudo do item C — estoque do site em mais de um lugar — 19/11/2026 (sessão de estudo, só leitura)

Pedido do dono (13:30): "Aprofunde o item C (estoque em dois lugares no site) em estudo e plano em partes, sem mexer em código."
Vem de docs/ESTUDO-DADOS-19-11.md, item C. **NADA foi mudado em src/, www/, functions/ nem no catalogo.**
Fontes lidas: functions/reserva.js, functions/index.js (função `reserva`), functions/atacado.js, firestore.rules, src/95-reserva.js, src/96-loja-online.js, src/55-produtos-catalogo.js, src/97s-atacado-conta.js, src/05-movimentos.js, www/loja/js/lf-site.js (cópia do site que está no ar; o ramo `limpo` do catalogo da S429 não foi lido).
Limite: não vi os dados reais da nuvem nem o aparelho do dono; os casos abaixo vêm da leitura do código, não de um erro visto acontecer.

## 1. Como é hoje (o estoque está em TRÊS lugares, não dois)
| Lugar | Quem grava | Quem lê | Quando atualiza |
|---|---|---|---|
| **A. App (S.items, cada aparelho)** — a verdade física | o próprio app (vendas, entradas, ajustes; movimentos entre aparelhos) | o app | na hora |
| **B. `produtos/<ref>`** — vitrine: `est` (total), `qs` (por cor), `gq`/`gc` (por grau), `aviso` ("Esgotado", "Última unidade"…) | o app (vitConfere a cada 1 min + vitFila quando algo muda) | o site (público) e a função `reserva` | só quando um aparelho do dono está aberto e com internet |
| **C. `estoque/<ref>`** — só reservas (`res: { pedido~cor: q, prazo, pago }`) | só a função `reserva` | o site (a cada 20 s), o app (balcão: `gLivre`) | na hora do pedido |
| **D. `atacadoPrecos/<tabela>`** — cópia do estoque por cor para o atacado (`cores: [cor, q]`) | o app, só ao criar/editar acesso ou lote (src/97s-atacado-conta.js `ataPublica`) | a função `atacado` (− separações de 30 min em `atacadoSep`) | **não acompanha as vendas** |

Conta que vale hoje: disponível no site = `qs[cor]` (B) − reservas vivas (C). A conta é feita em dois lugares com código separado: no servidor (functions/reserva.js `fisico − reservadoDe`) e no site (lf-site.js `aplicaEst`).

## 2. O que já está bom
1. Quem decide se dá para reservar é o servidor, numa transação (dois clientes ao mesmo tempo: só um leva).
2. O balcão já desconta as peças seguradas pelo site (`gLivre` em src/95-reserva.js) e confere de novo antes de fechar a venda.
3. Ao entregar, o app só solta a reserva DEPOIS de mandar o estoque novo ao site (`resFlush` espera o `vitPend`), para a peça não "voltar" por um instante.
4. Reserva órfã (pedido apagado) é solta sozinha depois de 10 min.

## 3. Onde os lugares podem discordar (achados, do mais grave ao menos)
| # | Caso | O que o cliente/dono vê | Onde está |
|---|---|---|---|
| **C0 (segurança, urgente)** | `estoque/` é público e mostra o número do pedido (`pid`) de cada reserva; a ação pública `cancelar` solta TODAS as reservas daquele número, **inclusive as pagas**, só com o número. Qualquer pessoa pode ler e soltar. | peça paga volta a aparecer e pode ser vendida duas vezes | firestore.rules `estoque` read: true · functions/index.js `PUBLICAS` + `cancelar → Reserva.liberar` |
| C1 | Venda no balcão com o app sem internet (ou fechado logo depois): `produtos.qs` fica com o número velho; o servidor aceita reserva de peça que já saiu | cliente paga por peça que não existe | functions/reserva.js `fisico()` lê só B |
| C2 | Com a **baixa automática desligada**, entregar o pedido solta a reserva sem tirar a peça do estoque | a peça vendida volta ao site até o dono registrar à mão | src/95-reserva.js linha 145 (`!S.baixaAuto` → `pend()` + `resFlush()`) |
| C3 | O atacado usa uma cópia própria do estoque que só é atualizada ao mexer no acesso/lote; não desconta reservas do site, e o site não desconta separações do atacado | loja atacadista vê "em estoque" o que já foi vendido; a mesma peça pode ser separada no atacado e reservada no site | functions/atacado.js `catalogo` + src/97s-atacado-conta.js `ataPrecos` |
| C4 | O site só corrige com as reservas quando TODAS as cores acabam: cor reservada continua "em estoque", e "Última unidade"/"Últimas 3" não descontam reserva | cliente escolhe a cor, vai pagar e recebe "Acabou de esgotar" | lf-site.js `aplicaEst` (só troca `aviso` para "Esgotado" com `livre<=0`) |
| C5 | Reserva é por cor, não por grau (`resItens` manda só ref/cor/q). Leitura com grau: o servidor não confere `gq/gc` | dois clientes reservam o mesmo grau que só tem 1 | lf-site.js `resItens` · functions/reserva.js `chave(pid, cor)` |
| C6 | Com `config/site.reserva` desligado, o site ignora `estoque/` | (só vale se o dono desligar a reserva) | lf-site.js `syncEstoque` |
| C7 (a conferir) | Todo aparelho do dono com nuvem roda `vitConfere` a cada minuto; um aparelho atrasado na sincronização pode mandar um `qs` velho por cima | número volta para trás por alguns minutos | src/96-loja-online.js `vitConfere` — precisa teste com 2 aparelhos |

## 4. Caminhos possíveis (nada decidido — o dono escolhe)
- **Caminho 1 — "Um número só, calculado no servidor" (recomendado para estudar primeiro):** o app continua dono do estoque físico e grava SÓ o físico por cor/grau num lugar (`estoque/<ref>.fis`, junto das reservas, ou mantém `produtos.qs`); a função devolve ao site um número pronto "livre por cor/grau" (físico − reservas − separações do atacado). `produtos` fica só com a vitrine (nome, preço, fotos, textos). O site e o atacado leem o mesmo número; a conta sai de lf-site.js e de atacado.js.
- **Caminho 2 — "Ajustes pequenos, mesma estrutura":** manter os lugares, mas (a) o site desconta reserva por cor e nos avisos, (b) o atacado passa a ler `produtos.qs` + reservas em vez da cópia própria, (c) consertar C0 e C2. Menos mudança; continua com duas contas para manter iguais.
- Em qualquer caminho, **C0 e C2 valem sozinhos** e podem ser esboçados já.

## 5. Plano em partes (cada parte: esboço → dono aprova → "implementar" → fila do STATUS → S429/S436 → teste → conferência)
| Parte | O quê | Frente / quem implementa | Teste |
|---|---|---|---|
| **P1 — Segurança da reserva (C0)** | esboço do conserto: o número do pedido deixa de ser público (ou `cancelar` só solta reserva NÃO paga e exige um segredo que só o cliente tem) | função + regras → sessão do SITE (S429), a combinar com o dono | teste da função (functions/teste-reserva.js) com tentativa de burlar: soltar reserva paga sem o segredo |
| **P2 — Entrega com baixa desligada (C2)** | esboço: com baixa desligada, a reserva só sai quando o dono registra a venda (ou o app avisa "registre a venda" e segura a peça) | APP (S436) | entregar pedido com baixa ligada/desligada, ver o site antes/depois |
| **P3 — Dicionário e regra única do "livre"** | doc só: o que é físico, reservado, separado e livre; um desenho do fluxo (app → nuvem → site/atacado). Junta com o item D (nomes curtos) | estudo (esta sessão) | conferência com o código |
| **P4 — Escolher Caminho 1 ou 2** | esboço das duas formas lado a lado com os casos C1–C5, custo de leituras na nuvem e o que muda em cada tela (site: cor esgotada, "Últimas unidades"; atacado: estoque ao vivo) | dono decide | — |
| **P5 — Implementar o caminho escolhido, em 3 passos** | (a) servidor calcula o livre e grava num lugar só; (b) site lê esse número (sai `aplicaEst`); (c) atacado lê o mesmo (sai a cópia em `atacadoPrecos`) — cada passo apaga o código velho junto | função/site → S429; app → S436 | site em todas as temáticas, celular/tablet/PC; reservar a última peça de 2 aparelhos; venda no balcão offline e voltar online; atacado e site na mesma peça; Test Lab só na cota grátis |
| **P6 — Grau (C5) e vários aparelhos (C7)** | reserva por cor+grau; conferir com 2 aparelhos se o número volta para trás | estudo → esboço | 2 aparelhos no Test Lab (cota grátis) |

## 6. O que o dono precisa decidir
1. Fazer P1 (segurança) primeiro, antes de tudo? (recomendado)
2. A baixa automática está ligada no seu celular? Se sempre ligada, P2 pode ser só um aviso.
3. Caminho 1 ou 2 — só depois do esboço da P4.

## 7. Bugs que o dono viu no celular (19/11 13:41) — investigados só lendo + simulador; nada consertado
| # | O que o dono viu | Causa achada | Prova |
|---|---|---|---|
| B1 | Pedido › tocar no nome da cliente → tela preta | `ACT.pedcli` abre a tela `'cli'`, que não existe; a de clientes se chama `'clientes'` (src/95-pedidos.js linha 835; certo em src/89-inicio.js 257) | simulador: depois do toque `S.view = 'cli'`, sem tela |
| B2 | Cancelar pedido não "devolve" e continua reservado | no app o cancelar marca `canc` e manda soltar (`resSolta`). Na nuvem, a reserva do AC1050 **ainda existe** (vencida há ~67 h, por isso já não segura a peça: `produtos/AC1050` = 3, "Últimas 3 unidades"). Mais 6 reservas vencidas (SL2210, SL2275, SL2280, SL2300 ×3) nunca foram apagadas → o "liberar" do app não está chegando. Suspeita principal: `resApi` (src/95-reserva.js) só tenta de novo em erro 5xx/404; um 401/403 (login vencido) conta como "feito" e a fila é apagada sem soltar | leitura pública de `estoque/` e `produtos/AC1050` às 13:45 |
| B3 | Grupo Site › "Site" parece pular para o outro "Site" | no simulador abre certo a tela Resumo (‹ SITE / Site). O grupo e a tela têm o MESMO nome, então parece que não saiu do lugar. No celular do dono a lista do grupo está sem o estilo (texto centralizado rosa, sem linhas) → o celular parece estar com o CSS antigo (cache) e o JS novo | foto do dono × simulador (work: /home/claude/sim, fora do projeto) |
**B2 — causa CONFIRMADA (19/11 13:55):** o app manda o pedido de soltar com a lista em `refs` (src/95-reserva.js linhas 28–29, para liberar e recusar), mas a função só lê `itens` (functions/index.js linha 140). A lista chega vazia → a função responde "itens" (falha) → o app acha que deu certo e tira da fila. Resultado: **o app NUNCA consegue soltar reserva** — nem ao cancelar, nem ao entregar, nem ao recusar comprovante, nem as órfãs. Hoje não segura peça porque as 7 paradas não estavam pagas e já venceram; mas um pedido PAGO e entregue ficaria segurando a peça no site para sempre. O aviso de cancelado para o site chegou certo (`reservas/<pedido>` = cancelado). O dono viu "reservado" no site (página exata não confirmada).
Os testes da função (functions/teste-reserva.js) chamam a regra direto, sem passar pela chamada do app — por isso não pegaram.

## 8. ESBOÇO P1 — segurança da reserva (19/11 14:30, esperando o dono)
Esboço: work/estudo-c/esboco_P1_seguranca_reserva_{escuro,claro}.jpg (gerador esb_p1.py). Por dentro, sem tela nova.
1. "Cancelar" da cliente (ação pública) só solta reserva não paga e sem comprovante; paga/com comprovante só o dono pelo app.
2. A lista pública `estoque/` deixa de levar o número do pedido (vai um código embaralhado; o site só usa cor, quantidade e prazo). O app passa a achar as órfãs pelo mesmo código (1 ajuste em src/ → APP · implementa).
3. A função aceita a lista em `itens` ou `refs` — também conserta o "Cancelar" da cliente no site, que hoje não solta nada (B2b: o site manda `refs`, lf-site.js `pkCancela`).
Testes novos em functions/teste-reserva.js e teste-endpoint.js (tentativas de burlar). Publicar: o dono roda `firebase deploy --only functions` no PC (docs/DEPLOY-13-11.md).
Atenção: este repositório é público; detalhes de como abusar ficam fora dos docs até o conserto sair.
