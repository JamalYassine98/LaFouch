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
