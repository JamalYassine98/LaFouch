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
