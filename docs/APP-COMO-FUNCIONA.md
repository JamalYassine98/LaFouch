# App LaFouch — como funciona (mapa para não criar colisão, botão repetido ou lixo)

Leia ANTES de criar tela, botão, ACT ou módulo. Ao mudar o app, atualize este arquivo no mesmo commit.

## Regras anti-lixo
- Antes de criar botão/tela: procurar aqui se já existe função parecida. Se existe, REUSAR ou SUBSTITUIR (nunca ter 2).
- Todo ACT novo precisa de um botão `data-act` (ou estar na lista "chamados direto" abaixo).
- Textos padrão: "Cancelar", "Fechar", "Sim, excluir" — usar sempre `lfJanela`, não criar diálogo novo.
- Rodar `python3 tools/deadcode.py` antes do commit: não pode aumentar o número de funções sem uso.
- Produto tem UMA fonte de verdade: o item do estoque. Site, atacado, WhatsApp, Marketing e Destaque só LEEM dele.

## Estrutura
- 129 módulos em `src/` (~48.600 linhas), juntados em ordem alfabética por `node build.js` → `www/app.js` (um IIFE).
- Ações: `ACT[nome]` disparadas por `data-act` / `data-id`. Janelas: `lfJanela({titulo, monta})`. Avisos: `lfToast`, `popErr`.
- Salvar: `saveSoon()`; chaves salvas em `99-render-persistencia.js` (~l.294); nuvem em `SYNC_CFG` (`05-sync.js`).
- Exporta `window.__LF` para testes (`tests/run.py`, 292 testes).

## Telas (`www/index.html`)
v-inicio · v-estoque (Produtos: abas Inventário / Vendas / Catálogo WhatsApp / Loja online) · v-caixa · v-ped (pedidos) · v-clientes · v-hist · v-dash · v-dia · v-fx (câmbio) · v-desp · v-vendas · v-onl · v-notif · v-ajustes.
Início: blocos `INI_PADRAO` em `89-inicio.js` (estoque, caixa, fx, desp, hist, hoje, din, giro, prec, ajustes, ped, msg, anl, tem, ata, cli, cont, lotes). Vendas, Catálogo e Loja online saíram do Início (são abas de Produtos).

## Mapa por assunto (módulos)
- Estoque/Inventário: 10, 11, 12, 13, 14, 50, 51, 52, 53-faixas, 98-inv-limpo, 98-graus-cor, 98-graus-folha, 97-contagem.
- Cadastro de produto (ENTRADAS — redundante, ver abaixo): 12 (cadastro), 13 (lote rápido), 84 (cadastro rápido), 85 (novo modelo + cores e fotos), 80–83 (leitor/OCR de etiqueta), 30, 87-nota-compra, 97-entrada-de-novo, 98-graus-cor.
- Fotos (REDUNDANTE): 31 (fila de foto), 86-completar-fotos (`fotoPend`), 87-foto-modelo, 87-camera-gaveta, 97-estudio (`estChaves`, `S.fotoNota`), 97-estudio-giro, 97-fotos-padrao, 20-imagem-base.
- Venda/caixa: 60, 62, 58, 95-caixa, 98-carrinho, 98-fechamento, 95-reserva, 97-pagamento-auto, 97-cupons.
- Pedidos do site: 95-pedidos, 97-site-pediu, 96-loja-online (`vitProduto`, `VIT_CAMPOS`), 97-vitrine, 97-site-v2, 97-site-auto, 97-ofertas-site, 96-preco-site, 97-giro-site, 97-vistas-site.
- Preço: 96-tabelas-preco, 97-preco-auto, 65-sugestoes, 41-moeda-campos (futuro "contador virtual", S188).
- Compartilhar/Marketing (REDUNDANTE): 97-compartilhar, 97-enviar-bonito, 97-enviar-catalogo, 97-marketing (`S.mkt`), 97-tema.
- Clientes/atacado: 96-clientes, 96-atacado, 97-brindes, 97-modo-cliente.
- Finanças: 56, 57-financas, 98-financeiro, 92-despesas, 91-cambio + 97-cambio-aba (DUPLICADO), 97-lamoneda, 97-objetivos.
- Histórico: 93-historico, 97-hist-busca, 97-arquivo-vendas.
- Nuvem/sync (5 módulos): 05-sync, 97-sync, 97-sync2, 97-nuvem, 97-nuvem-segura, 97-push.
- Ajustes: 96-ajustes + 97-ajustes-lista (DUPLICADO), 97-catalogo-ajustes, 59-seguranca.
- Animação (4 módulos): 88-movimento, 88-movimento-novo, 98-anim-novas, 98-botoes-anim.
- Navegação: 90-navegacao-dashboard, 95-barra-grupos(-icones), 98-botoes-barra, 97-busca-unica (`BU_FUN`), 89-gestos-ficha.
- Notificações: 89-notificacoes (tela v-notif) + sino (DUPLICA).

## Redundâncias conhecidas (12/11/2026) — remover só com esboço aprovado
1. 10+ caminhos para cadastrar produto → proposta: Ficha única (S190).
2. 5+ filas/telas de foto (31, 86, 87, Estúdio, giro, fotos-padrão) → Estúdio vira etapa da Ficha.
3. 4 módulos de compartilhar → 1 só (Marketing lê a Ficha).
4. 2 telas de câmbio (91 e 97-cambio-aba).
5. 2 módulos de Ajustes.
6. 4 módulos de animação.
7. Tela Notificações x sino.
8. 53-linhas escondido (sem acesso).
9. 5 módulos de nuvem/sync.

## Código morto (tools/deadcode.py, 23 funções)
btolSugere, splitAbre, usdParaCampo, metaDiaHtml, perigosoHtml, siteSwitch, nvFld, nvOpcoes, nvCampo, nvAutoCard, marcaOk, dTabsHtml, periodoHtml, fxGraficos, trocarMoedasHtml, faltamHtml, pedStLabel, pedImg, resLibera, resRestaDe, mcAjHtml, avSomDe, apHistHtml.

## ACT sem botão (12)
fadd, fdel, faixaauto, volauto, lojaRecarregar, nvAgora, nvRestaurar, pautoTog, fichaTog, dPerEsc, exemplo; `estAbre` é chamado direto (ok).

## Fluxo do produto hoje
Cadastro (vários caminhos) → item no estoque → fotos (Estúdio OU fila 86 OU 31) → `vitProduto` copia campos para o site → Marketing/WhatsApp montam texto por conta própria (não leem descrição única) → Destaque usa vendas/vistas (`nvDestaque`).

## Voltar (S187, 12/11/2026)
- `src/99b-voltar-janela.js`: abrir uma peça no Catálogo (`S.vRef`) ou no Inventário (`S.det`/`S.open`) cria 1 passo no histórico (pela `prodTopo` e pelo `render`); o voltar do celular fecha a peça e a lista volta na mesma rolagem (`S._volY`). Fechar pelo botão da tela tira o passo que sobrou (`history.back` ignorado no `navVolta`).

## PIX automático (S197, 12/11/2026)
- Itaú (13/11, v496): venda da loja em Pix/guaranis e pedido do site pago por alias ficam esperando o aviso do Itaú (info@itau.com.py, "Moneda y Monto: Gs."); o robô lê o e-mail e a função pix confirma pelo valor em Gs.
- `src/97z-pix-email.js`: pedido do site pago por PIX e venda da loja "Venda · PIX" são confirmados pelo e-mail do Nubank (robô `work/pix/robo-pix.gs` → função `pix`). A espera da venda da loja nasce no servidor (`pixEspera`); sem par vai para `pixSemPar`.

## Polarizado (S195, 12/11/2026)
- Ficha da peça (`src/10-estoque-detalhe.js`, bloco de atributos): só em solar aparece "Polarizado?" (Polarizado / Não polarizado) em `S.attr[ref].polarizado`. `vitProduto` (`src/96-loja-online.js`) manda `pol` (true/false; vazio = null, aí o site olha o nome). `pol` está em `VIT_CAMPOS`.

## Lucro real (S200, 12/11/2026)
- `src/97y-lucro-real.js`: `lrVenda(venda)` = preço ÷ 1,10 (IVA da venda sai) − custo (`rep`, já com o frete da compra rateado no lote) − IVA da compra (10% do custo; `S.ivaCompraPct` muda) − taxa − frete da entrega pago pela loja (`freteLoja`); desconto (cupom/Leve 2) já está no preço. Sem crédito fiscal.
- Ficha da peça (inventário): cartão recolhível `.lrcard` no fim (`renderDetail` embrulhado) com a conta da última venda (ou do preço de hoje) e "Se vender com…" (cupom 10%, Leve 2, delivery se houver `S.fretes`).
- Dinheiro (Números › Dinheiro): dobra "Lucro real do mês" (`lucroRealHtml`, `lrMes`) com IVA, custo+IVA da compra, taxas, fretes, descontos e as peças de mais/menos lucro (toque abre a peça: `ACT.lrpeca`).

## Nota / comprovante da loja (12/11/2026)
- `src/97-nota.js`: chave "Emitir nota fiscal" aparece sempre (estrangeiro também). LIGADA → comprovante com dados da nota (paraguaio com RUC: nome + RUC; estrangeiro ou paraguaio sem RUC: Sin nombre / RUC X) + Imprimir. DESLIGADA → só registra a venda: sem comprovante na tela e sem Imprimir (`#notaPap` e `.vimp` escondidos; `ACT.notaImp` recusa).

## Cupom e fretes no app (S194/S192, 12/11/2026)
- `src/97-cupons.js`: no caixa o cupom é sempre cheio; peça em que o % furaria o piso fica sem cupom (aviso "Peça sem cupom"). Tipos: sai o VIP (botão removido da ficha do cliente em `96-clientes.js`), entra "Cliente fiel" (10% a cada 3 compras pagas, feito pelo servidor). Sem teto do mês (só mostra quanto os cupons deram).
- `src/97x-fretes.js`: Ajustes › Pedidos do site › "Transportadoras do Delivery": preço (G$) e liga/desliga de PedidosYa, Bolt, Tiemsa e MCGroup → `config/site.fretes` (o site lê). `S.fretes` fica salvo no aparelho.

## Guardião (S189, 12/11/2026)
- `src/97w-guardiao.js`: `guardChecks()` confere no aparelho (sem internet) Dinheiro (caixa, contas em 3 dias, câmbio > 24 h), Estoque e preço (estoque negativo, peça sem custo, venda abaixo do piso sem motivo, publicada sem foto), Site e pedidos (pago não separado +2 h, PIX esperando > 15 min, comprovante aguardando conferência, atacadista com trocas estranhas quando existir `ataTrocasEstranhas`), Aparelhos e cópias (sincronização, cópia > 7 dias, lote sem detalhe).
- Início: cartão `.guardC` (até 3 avisos + "Ver todas") ou linha verde "Tudo certo · conferido HH:MM". `ACT.guardAbre` abre todas por assunto; "silenciar" = 7 dias (`S.guardMudo`). Urgentes entram no sino (`atencaoItens` embrulhado).

## Compartilhar (S185, 12/11/2026)
- `src/97v-compartilhar-s185.js` entra no "Enviar bonito" (agora com o título "Compartilhar"; `s185Liga(E, J, app)`): TIPO DE ENVIO Cliente (varejo) | Lojista (atacado). Cliente: Link com foto (1 peça = `lafouch.com/p/CÓDIGO.html`; várias = `lafouch.com/s/REF.REF~Nome`, que o site abre como "Separado para vos"), Cartões (o envio de sempre) ou Capa de status (1080×1920, até 4 peças + link). Lojista: Catálogo PDF (tabela escolhida, por categoria, cor com quantidade, graus, preço US$, mínimo, validade 30 dias; impressão → "Salvar como PDF") ou Planilha (CSV). Fica registrado na ficha do cliente (`cli.env` com `modo`).

## Navegação (S184, 12/11/2026)
- `src/97u-navegacao-s184.js`: a ficha da peça (`renderDetail`, venda ou inventário) ganha no topo o caminho ("Catálogo › SP58110 · 3 de 16") e as 5 abas Vender · Estoque · Histórico · Site · Preço (`ACT.fnTab`; Histórico/Site/Preço aparecem dentro da ficha com `.fnAlt`; volta para a aba usada por último, `S.fnTab`). Deslizar para o lado passa para a próxima peça da lista de onde veio (`S.fnLista`). Inventário: botão "Vender esta".
- Códigos de peça viram link (`fnLinkifica` depois de cada `render`) no Histórico, Pedidos, Avisos, Clientes, Caixa e Dia. Recentes (5) embaixo da busca do Início (`S.recentes`: peças e clientes). Números: aba Online (`DTABS` + `onlResumoHtml`) e cartões de número que abrem a lista por trás (`FN_KPI`).
- `.noconta` (em `98-botoes-anim.js`): textos que não entram na contagem animada dos números (códigos, horários).

## Ficha única (S190, 12/11/2026)
- `src/97t-ficha-s190.js`: botão "Ficha N/6" na linha do caminho da ficha do inventário → `ACT.fichaAbre(ref)`: 6 etapas (Identidade, Cores e graus, Fotos, Preço/Contador, Canais, Texto de venda) com o que falta. Fotos: uma por cor + revisão do designer no aparelho (`fiRevisa`: foto escura ou fundo que não é branco → "Refazer agora" abre o Estúdio / "Manter assim" grava `S.fotoOk`). Texto automático sem cor (`fiTexto`, o mesmo do site) com "Corrigir (opcional)" em `S.desc` (vai ao site pelo `vitFila`); "Usar o automático" apaga a correção. Canais: Atacado liga/desliga por peça (`S.ataPub`). "Enviar no WhatsApp" abre o Compartilhar.

## Conta Atacadista/Mayorista (S191, 12/11/2026)
- `src/97s-atacado-conta.js`: Clientes › ficha › "Conta Atacadista/Mayorista" (`ACT.ataConta`: conta associada, não vence, 3 aparelhos, limite − +, "Cliente pode trocar aparelho", Pausar, Cancelar, cartão "Trocou N vezes em 30 dias · Bloquear trocas", remover aparelho, convite pelo WhatsApp) e Clientes › "Novo acesso atacado" (`ACT.ataNovo`: visitante, 3 dias, 3 aparelhos, não remove; `S.ataConvMax` convites ativos). Contas em `S.ataContas` + nuvem `atacadoContas/{id}`; preços da tabela em `atacadoPrecos/{tab}` (`ataPrecos`: só peças com estoque e `S.ataPub[ref] !== false`); pedidos chegam em `atacadoPedidos` (`ataPedidosBusca` → `S.ataPeds`). `ataTrocasEstranhas()` alimenta o guardião.
- Servidor: `functions/atacado.js` (função `atacado`: entrar com código por e-mail, confirma aparelho + token, catálogo, remove aparelho, pedido com mínimo). Site: lafouch.com/atacado?c=ID.

## Temas e conselheiro de desconto (S183, 12/11/2026)
- `src/97r-temas-s183.js` (e-mail aos inscritos no começo do tema: `temaMailTenta` → função `novidades` acao `tema`, 1 vez por tema e ano em `temaEnvios`): 20 dias antes do tema (`cupTemaProx`) o Início mostra `.temaC` (só se há o que sugerir) e o sino avisa. "Ver sugestão" (`ACT.temaVer`): grupos com % (`TEMA_REG`: Natal leitura 10/15, BF paradas 20/30 máx. 50%, Mães femininas 10/15, Pais masculinas 10/15, Ano Novo solares 10, Halloween sem), peças no piso, lucro médio antes → depois, quanto vender a mais para empatar, orçamento em US$ (→ G$/R$), resultado do ano passado. Sem desconto: novidades (30 dias) e as 3 mais vendidas (ordem pura, 90 dias). +5% nas paradas 60+ dias e +5% na última semana para quem não vendeu.
- "Aplicar" grava `S.temaOf` e o preço do site muda pelo `siteOfPct` (embrulhado) só entre o início e o fim; termina sozinho e guarda o resultado em `S.temaRes`; "Desfazer" no cartão.

## PIN (S182, 12/11/2026, jeito 1)
- `src/97q-pin-s182.js`: a tela `#lockScr` ganha o teclado da La Fouch (`#pinKb`: bolinhas + 0–9 + ⌫ + botão roxo da digital). O campo `#lockPin` fica escondido (`inputmode=none`, o teclado do celular não abre). Com o tamanho do PIN conhecido (`S.pinN`, gravado ao criar ou na 1ª entrada certa) entra sozinho ao completar e o "Entrar" some. A biometria NÃO abre sozinha (`mostrarLock`): só ao tocar no botão da digital.

## Lotes de atacado (S206, 13/11/2026)
- `src/97s2-atacado-lotes.js`: Clientes › "📦 Lotes atacado" (ou dentro da Conta Atacadista). "+ Criar lote": nome, tabela, filtro (tipo + material, ex.: todas as armações · Acetato; peças novas entram sozinhas), peças escolhidas `CÓDIGO=quantidade`, lojas (contas ativas), moeda inicial US$/Gs./R$, validade em dias. Salvar grava `atacadoLotes/{id}` com o preço US$ congelado de cada peça; só depois aparece "Enviar o link" (WhatsApp `lafouch.com/atacado?c=CONTA&l=LOTE`).
- Janela do lote: Ativo/Cancelado/Vencido, modelos, ✅ confirmados (`atacadoPedidos.lote`), 🧺 montando agora (`atacadoSep` dentro dos 30 min), ⛔ esgotaram; Editar e "Encerrar lote" (o link mostra "Lote finalizado").
- Conta Atacadista: "Moeda que ele vê primeiro" (`moeda` na conta). Guardião: "Lote de atacado vence amanhã".
- PIN v2: sempre 4 números, entra sozinho ao acertar (sem botão Entrar); digital cancelada não mostra erro; PIN antigo de outro tamanho → depois de entrar pede um novo de 4.

## Modo loja (S181, 13/11/2026)
- `src/97-modo-cliente2-loja.js`: com o Modo cliente ligado, o app abre por cima de tudo o próprio site (`www/loja/loja.html?loja=1&nosync`, copiado do repositório do site pelo `node build.js`). Funciona sem internet: o app manda por postMessage todo o inventário com estoque (`vitProduto` + fotos do app), de novo a cada 30 s.
- O cliente toca "Quero este" e junta em "Meu pedido"; "Chamar um vendedor" → o tablet apita, as peças entram no carrinho do app (cor pelo índice, grau, sem passar do estoque) e grava `lojaChama/{id}` (a função `avisarChama` manda o aviso para os celulares).
- Só abre se a cópia do site existir (APK novo); com APK antigo fica o modo cliente de antes. Sair: segurar o logo 5 s (anel roxo enche) ou 7 toques → PIN/biometria. Parado 2 min (o site avisa a atividade a cada 5 s) → o site volta ao início e o Meu pedido some.

## Contador virtual (S188, 13/11/2026)
- `src/97z2-contador.js`: Números › Preços abre com o Contador — saúde (margem média real 30 dias com ▲/▼, lucro por peça, contas do mês cobertas + faltam N peças, abaixo do piso), "Para decidir esta semana" (preço automático `paPlano`, tema chegando, atacado com margem < 10%) com Aceitar tudo / Ver um por um (Aceitar · Agora não), frase dos descontos do mês, botões Calculadora de preço e E se…?.
- As regras de antes ficam recolhidas em "Regras do contador" (Preço automático, Abaixo do piso, Contas, taxas e meta). Mesmas regras: nunca abaixo do piso, máx. 10%/semana, cadeado vence.
- Ficha da peça: "De onde vem o preço" (barra repor/contas/colchão/taxa/lucro, piso, trava, faixa, site, atacado, quanto dá para descer).
- Calculadora: custo US$ + lote + tipo + faixa → balcão, site, atacado, piso, parecidos, tempo e lucro do lote; "Usar estes preços" anota (`S.cntCalc`) e copia.
- E se…?: dólar, contas +%, desconto numa categoria, cupom, vender tudo parado, meta do mês (só contas do app).
- Dias 1–5: Guardião "Fechamento do mês pronto" (resultado, margem por categoria, descontos).

## Passo 1 da simplificação (S231, 14/11/2026)
- `www/style.css`, bloco "S231" no fim: topo compacto (logo 52 px, `.wrap` com 10 px em cima) e toque de 44 px em lista FECHADA de classes (`.btn-sc`, `.chip`, `.pdSeg button`, `.ic`, `.pdLink`). NÃO usar regra geral em `.view button`: quebrou o teste v474 (graus por cor) e mudou botões que não deviam.
- Botões "Ver" dos avisos dizem o que abrem: `src/89-notificacoes.js` (Ver margem, Ver pedidos) e `src/89-dash-abas.js` (Ver conta, Ver câmbio, Ver preços, Ver reposição, Ver peças). Aviso novo: nunca só "Ver".
- Teste do atalho fantasma do Início (`tests/run.py` ~l.2666) segura no vazio em y=95 (era 150): com o topo compacto o vazio fica entre o logo e a busca.
- AINDA NÃO FEITO do S226/S228: letra mínima de 12 px, menu ao lado no computador, nova barra (Início · Produtos · Vendas · Dinheiro · Mais) e as fusões de telas. Ver docs/APP-NADA-SE-PERDE.md.

## Computador: menu ao lado (S232, 14/11/2026)
- `www/style.css`, bloco "S232": com mouse (`hover:hover` + `pointer:fine`) e 1100 px ou mais, `#mainnav` vira coluna fixa à esquerda (`--rail:232px`), o logo (`.top.logo-top`) fica fixo no canto por cima do menu, o sino fixo no alto à direita e `.wrap` ocupa o resto com conteúdo de até 1320 px. Ajustes é o último item, no pé do menu.
- `--lfz` repete o número do `zoom` de tela grande (1,15 / 1,3 / 1,5 / 2) para as contas de largura; se mudar o zoom, mudar `--lfz` junto.
- Toque (celular, tablet, notebook virado tablet) continua com a barra embaixo. O menu ainda tem só os 5 destinos de hoje; os outros (Pedidos, Clientes, Histórico…) entram com a estrutura nova (docs/APP-NADA-SE-PERDE.md).
- Alarme falso conhecido do olho.js no computador: "fileira torta" (logo sobre o menu).

## Produtos: chave Vender / Cuidar do estoque (S233, 14/11/2026)
- `src/97v-produtos-chave-s233.js` (`pcChave`, depois de cada `render`): põe a chave `.pcSeg` logo abaixo do `.top` do Catálogo (`v-vendas`) e do Inventário (`v-estoque`); tocar troca de tela com `setView` deslizando para o lado. Some no modo cliente e na tela do WhatsApp do catálogo. CSS no bloco "S233" do `style.css`.
- É o 1º passo da fusão Catálogo + Inventário (docs/APP-NADA-SE-PERDE.md). As duas telas e os dois botões da barra continuam existindo; a busca e a posição ainda NÃO passam de uma para a outra.
- Sem teste próprio em `tests/run.py` ainda (conferido à mão no simulador: celular claro/escuro e 1366).
