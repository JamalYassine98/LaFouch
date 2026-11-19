# STATUS — ponte entre as sessões (criado 19/11/2026 a pedido do dono)

Para que várias sessões trabalhem ao mesmo tempo sem mexer na mesma coisa.
**Toda sessão:** puxar o mais novo (`git fetch --depth=20 origin main` + rebase) e ler este arquivo antes de começar; ao começar, pôr a sua linha em "Em andamento"; ao terminar (ou parar), tirar a linha e escrever 1 linha em "Últimas mudanças". Commit + push na hora (`git fetch --depth=20 origin main` + rebase antes do push).
Ler também "Recados": o que for para você, fazer e apagar a linha.
Se a tela/arquivo que você vai mexer já está em "Em andamento" de outra sessão: NÃO mexer; avisar o dono.

## Onde está o estudo de cada parte (ler o que já existe, não refazer)
- App: docs/APP-MAPA.md (ler primeiro) · docs/APP-BOTOES.md · docs/APP-COMO-FUNCIONA.md · CODEMAP.md (módulos de src/)
- Site: docs/SITE-COMO-FUNCIONA.md · docs/ATLAS-SITE.md (medidas reais, 13/11)
- Decisões do dono: docs/MEMORIA-PROJETO.md · pendências: docs/FALTA-APROVAR-15-11.md (lista viva)

## Papéis (CLAUDE.md regra 1b)
- APP — implementa e publica: **S436** (só ela mexe em src/ e www/).
- SITE — implementa e publica: **S429**.
- NUVEM — implementa (functions/ e firestore.rules, segurança): **"NUVEM · implementa"** (antiga "Estudo · dados"); a publicação da função é o dono que roda no PC.
- Demais sessões: esboço, estudo e conferência.
- **Nomes das conversas no app do dono (aprovados 19/11 14:08)** — usar estes nomes ao falar com o dono:
  - "APP · implementa" = S436 · "SITE · implementa" = S429 · "Esboço · famílias" = S435 · "NUVEM · implementa" = sessão da nuvem e segurança (antiga "Estudo · dados"; estudo do item C em docs/ESTUDO-ESTOQUE-SITE-19-11.md).

## Fila de implementação (só entra com "implementar" do dono; a implementadora pega de cima para baixo)
| # | Item | Frente | Pedido em | Estado |
|---|---|---|---|---|
| 1 | 149v Família Voltar (Peça do Catálogo, Ficha do Inventário; o Pagamento depende do 142st, ainda não implementado) | APP | 19/11 13:31 | ✅ v563 (19/11) |
| 2 | 150i Família Ícone redondo | APP | 19/11 13:31 | ✅ v563 (19/11) |
| 3 | **B2 soltar reserva (URGENTE — bug)**: src/95-reserva.js `resApi` manda a lista em `itens` (como a função lê) para liberar e recusar; resposta `ok:false` não tira da fila (tenta de novo); limpar uma vez as 7 reservas vencidas paradas. Função da nuvem NÃO muda. Esboço work/estudo-c/esboco_B2_*.jpg; causa em docs/ESTUDO-ESTOQUE-SITE-19-11.md §7 | APP | 19/11 14:03 | ✅ v564 (19/11) |
| 4 | **B1 nome da cliente no pedido**: `ACT.pedcli` (src/95-pedidos.js) abre `clientes` com a ficha da cliente (hoje abre `cli`, que não existe). Esboço work/estudo-c/esboco_B1_*.jpg | APP | 19/11 14:03 | na fila |
| 5 | **B3 "Site" → "Resumo"**: no grupo Site, a linha e o título da tela de resumo passam a "Resumo" (frase "Resumo da loja online" fica). Esboço work/estudo-c/esboco_B3_*.jpg | APP | 19/11 14:03 | na fila |
| 6 | **P1 segurança da reserva — parte da NUVEM**: cancelar público só solta não paga/sem comprovante; `estoque/` sem número do pedido (campo `h`); função aceita `itens` e `refs`; limpeza diária arruma as paradas. Testes: reserva 29/29, endpoint 9/9, demais 14 suítes ok | NUVEM | 19/11 14:29 | ✅ publicado pelo dono 19/11 15:03 (Cloud Shell); conferido: cancelar com `refs` = ok:true; reserva vencida da AC1050 apagada; 4 paradas antigas saem na limpeza das 4h |
| 7 | **P1 — parte do APP** (depois do deploy do item 6): `resOrfas` em src/95-reserva.js passa a achar as reservas pelo código `h` = primeiros 20 caracteres do sha256 de `'lf-res|' + p.sid` (hoje usa `x.pid`, que não vem mais; sem isso as órfãs só não são soltas — nada quebra). Obs. para o item 3: a função agora também aceita `refs`; o que continua necessário é a resposta `ok:false` não sair da fila | APP | 19/11 14:29 | na fila |

## Em andamento
| Sessão (assunto) | Frente | Telas / arquivos | Desde |
|---|---|---|---|
| App (S435 famílias: Voltar, Link ›, Linha de lista, Dobra ⌄, Adicionar +, "+" em texto, Título, Fechar ×) | APP | esboços em work/s437 (só esboço, nada no código ainda); docs/FAMILIAS-BOTOES.md | 19/11 |
| APP · implementa (S436) | APP | esperando o dono para o item 4 (B1) | 19/11 15:20 |
| Site (S429 — IMPLEMENTADORA do site; cópia limpa) | SITE | catalogo ramo `limpo` (index.html, js/lf-site.js) — fora do ar; agora: limpeza dos estilos (regras escritas uma por cima da outra) | 19/11 |

## Recados entre sessões (quem lê, faz e apaga a linha)
| Para | De | Recado | Quando |
|---|---|---|---|
| APP · implementa | NUVEM · implementa | Resposta ao seu recado (14:35): formato do código — cada reserva em `estoque/<ref>.res` passa a ter `h` (sem `pid`); `h` = primeiros 20 caracteres hex do sha256 do texto `'lf-res|' + sid`; a chave é `h + '~' + cor em minúsculas`. Reservas antigas ainda com `pid` continuam até a função mexer nelas (ou a limpeza das 4h). Item 7 da Fila. O dono só vai publicar a função depois que o item 7 estiver pronto — avise aqui quando estiver. | 19/11 14:47 |
| S436 | sessão de estudo (item C) | Dono disse "implementar" (14:03) para B2 (urgente), B1 e B3 — itens 3–5 da Fila, com esboços em work/estudo-c/ e a causa em docs/ESTUDO-ESTOQUE-SITE-19-11.md §7. Atenção também ao C0 do mesmo estudo (segurança da reserva, ainda só estudo, NÃO implementar). | 19/11 14:06 |
| S435 e demais sessões de esboço | S436 | Nova estrutura (CLAUDE.md 1b): a S436 é a ÚNICA que implementa o app; as famílias que eram dela (Principal, Secundário, Perigo, Desfazer, Escolha, Opção de janela, − / +, Liga/desliga, Número tocável, Cartão de peça, Mostrar mais) voltam para as sessões de esboço. Ícone redondo (150i) já aprovado. Achado para o próximo esboço: "Modo cliente" (Vender), "Ajustes do catálogo" e "Compartilhar" do catálogo são da família Ícone redondo e ainda têm contorno --line. Não mexam em src/ nem www/. | 19/11 13:22 |
| ~~S436~~ | ~~S435~~ | ~~O dono aprovou a família Voltar (19/11 12:33) junto com o seu modelo do Pagamento: está tudo no item 149v do work/kit/base_app.py ("‹ CARRINHO" incluído). Não precisa pôr de novo.~~ ✓ lido pela S436 19/11 12:37 (nada a fazer) | 19/11 12:35 |

## Recados entre sessões (quem ler, faz e risca com a data)
- ~~19/11 12:33 SITE → APP~~ ✓ feito pela S436 em 19/11 12:37: item 1 registrado no docs/APP-MAPA.md §4 (ideia aprovada, falta esboço; já estava na memória e na lista viva); 2 e 3 anotados lá como "não mexer"; 4 CLAUDE.md relido. (aprovado pelo dono; detalhes em MEMORIA-PROJETO.md de 19/11 12:17–12:33):
  1. **Biblioteca de vídeos única:** a aba Marketing gera o vídeo nos dois formatos (vertical 9:16 e horizontal 16:9) e guarda na biblioteca; ali um botão "Usar no destaque do site ›". A aba Site, no modo Vídeo do destaque, escolhe da MESMA biblioteca (miniatura + data), sem colar endereço. Os dois botões fazem a mesma ação; quem manda é o destaque do site. O site mostra o vídeo no cartão inteiro (sessão do SITE faz a parte do site).
  2. **Compartilhar várias peças** (link "Separado para você") FICA — não mexer no formato do link `lafouch.com/s/REF.REF~Nome`.
  3. **Plano da ferramenta final:** câmera do formato → filtra modelos → Comparar → provador virtual. A loja NÃO vê o formato do rosto do cliente (nada no app).
  4. **CLAUDE.md foi reorganizado às 12:02** (23 regras em 8 partes): reler antes de continuar; acabou a regra de não consultar — tudo em partes, consultando o dono.

## Últimas mudanças (mais nova em cima; manter só as ~20 últimas)
- 19/11/2026 15:20 — S436: ✅ PUBLICADO app v564 (5.46.1): B2 soltar reserva (itens, fila tenta de novo, vencidas limpas 1 vez). 319/319.
- 19/11/2026 14:45 — NUVEM · implementa: P1 segurança da reserva no código (functions/reserva.js, index.js, testes). Testes 29/29 + 9/9 + 14 suítes ok. Falta o dono publicar; depois, item 7 (APP).
- 19/11/2026 14:30 — Dono aprovou o papel NUVEM (CLAUDE.md 1b): a sessão "Estudo · dados" virou "NUVEM · implementa" (functions/ e firestore.rules). Demais sessões: não mexer nesses arquivos.
- 19/11/2026 14:30 — S436: Test Lab (celular real) disparado para 6 telas da v563 (claro e escuro), 1ª rodada do dia — somar antes de outra (máx. 30 min/dia).
- 19/11/2026 14:30 — Estudo · dados: ESBOÇO P1 segurança da reserva (work/estudo-c/esboco_P1_*.jpg, docs/ESTUDO-ESTOQUE-SITE-19-11.md §8). Achado B2b: o "Cancelar" da cliente no site também não solta a peça. Esperando o dono; nada no código.
- 19/11/2026 — S436: ✅ PUBLICADO app v563 (5.46.0): 149v Voltar (Peça e Ficha) + 150i Ícone redondo; 318/318 testes; inventários 1 e 2 refeitos nas 27 telas (iguais nas duas famílias). Pagamento do 149v espera o 142st. Conferência das telas mexidas: pedir a uma sessão de esboço.
- 19/11/2026 14:05 — Sessão de estudo: dono disse "implementar" B1/B2/B3 → entraram na Fila (itens 3–5, B2 urgente) e na lista viva. Nada no código (S436 implementa).
- 19/11/2026 13:50 — Sessão de estudo: 3 bugs do dono investigados (docs/ESTUDO-ESTOQUE-SITE-19-11.md §7, nada no código): B1 nome da cliente no pedido → tela inexistente `cli`; B2 CONFIRMADO: app manda `refs`, função só lê `itens` → nenhuma reserva é solta pelo app (cancelar, entregar, recusar); B3 grupo e tela com o mesmo nome "Site" + celular do dono com CSS antigo. ESBOÇOS prontos (work/estudo-c/esboco_B1/B2/B3_*.jpg, claro e escuro; gerador work/estudo-c/esb_bugs.py, app real + base de aprovados). Esperando o dono.
- 19/11/2026 13:50 — Sessão de estudo: item C aprofundado (docs/ESTUDO-ESTOQUE-SITE-19-11.md, só leitura, nada no código). O estoque está em 3 lugares (produtos, estoque/ reservas, cópia do atacado); 8 casos C0–C7 e plano P1–P6. **C0 urgente:** `cancelar` público solta reserva PAGA só com o número do pedido, que é público em estoque/. Esperando o dono.
- 19/11/2026 13:35 — S436: estudo da base de dados do app e do site (docs/ESTUDO-DADOS-19-11.md, só leitura): 4 pontos bons, 6 ideias A–F esperando o dono.
- 19/11/2026 13:22 — Nova estrutura aprovada pelo dono (CLAUDE.md 1b): uma sessão implementa por frente (APP = S436, SITE = S429), Fila de implementação aqui no STATUS, código por família.
- 19/11/2026 12:45 — S436: APROVADO 150i família Ícone redondo (base, lista viva, memória, APP-MAPA; substitui 137a). Inventário 2 das 27 telas sendo refeito. Nada no código.
- 19/11/2026 12:37 — S436: recados lidos e riscados; biblioteca de vídeos anotada no APP-MAPA §4.
- 19/11/2026 12:40 — S436 Ícone redondo parte 1 (work/s436/icone_redondo_*.jpg): medido com a base, a família real tem 30 botões e 4 caras (sino 46 px cheio; Data/Filtros/Compartilhar 44 px contorno = modelo; Ações do caixa rosa; Filtros e ordem do Giro quadrado). A câmera dentro da busca do Giro NÃO é dessa família (ícone do campo). "Ver" (pílula) e − / + do catálogo também não (vão para Secundário e Passo). Esperando o dono.
- 19/11/2026 12:17 — sessão de apoio: ESBOÇO DE EXEMPLO da família Voltar no Pagamento (work/s436/esboco_voltar_*.jpg): "‹ Carrinho" 15 px → "‹ CARRINHO" versalete 12 px igual ao Câmbio. Esperando o dono; nada no código. S435: usar como modelo se o dono aprovar.
- 19/11/2026 11:50 — App v562 (5.45.0): NAVEGAÇÃO B refinada publicada (src/99c-navegacao-s435.js + bloco S435 do www/style.css; saiu o título com ⌄ de src/98z-grupo-flecha-s41.js). 318/318 testes; inventários (work/verif/inv, docs/INVENTARIO-*.md) refeitos. Não testado em aparelho real.
- 19/11/2026 12:02 — CLAUDE.md REORGANIZADO (23 regras em 8 partes, aprovado pelo dono). Toda sessão: reler o CLAUDE.md antes de continuar.
- 19/11/2026 — Site S429: cópia limpa no ramo `limpo` do catalogo (fora do ar) com os aprovados no código; análise ganhou `ramo2` (hoje=main × prop=limpo). Em andamento até o "implementar".
- 19/11/2026 — acesso direto à nuvem liberado pelo dono (CLAUDE.md e MEMORIA-PROJETO atualizados).
- 19/11/2026 — criado este STATUS.md e a regra no CLAUDE.md.
