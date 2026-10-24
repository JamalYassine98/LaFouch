# Mapa do código

Fonte em `src/*.js` (um IIFE só, concatenado em ordem alfabética por `node build.js` para `www/app.js`). Testes: `python3 tests/run.py` (~5 min). Código morto: `python3 tools/deadcode.py`.

Regras que valem em todo o projeto: o estado fica em `S`; `render()` redesenha tudo e grava (`saveSoon`); campos salvos estão em `PERSIST` (`99-render-persistencia.js`); a cada versão suba o nome do cache em `www/sw.js`.

| Módulo | Linhas | Primeira linha |
|---|---|---|
| `00-estado-utilitarios.js` | 850 | Estado global (S), tipos de peça, utilitários de DOM/texto e regras de dados (limpeza, lotes no caixa). |
| `05-movimentos.js` | 70 | Movimentos: todo fato de dinheiro ou estoque é gravado por aqui (livro + histórico juntos). |
| `10-estoque-detalhe.js` | 894 | Estoque: tela de detalhe de um código. |
| `11-estoque-lista.js` | 1259 | Estoque: lista, filtros e cartões das peças. |
| `12-estoque-filtros-cadastro.js` | 615 | Estoque: painéis de filtro, lista de códigos e abertura/fechamento do cadastro. |
| `13-estoque-lote-rapido.js` | 455 | Estoque: cadastro em lote a partir da foto e paleta de cores. |
| `20-imagem-segmentacao.js` | 938 | Imagem: canvas e recorte do objeto (modelo onnxruntime IS-Net/u2netp). |
| `21-imagem-branqueamento.js` | 2357 | Imagem: fundo branco sem cortar a armação. |
| `30-ocr-leitura.js` | 652 | Leitura do código da foto: OCR offline (Tesseract) e IA online. |
| `31-foto-fila-cartao.js` | 774 | Fila de fotos e cartão da foto (cadastro de nova peça). |
| `40-formatos-venda.js` | 422 | Formatadores, constantes e cálculo/registro de vendas. |
| `41-moeda-campos.js` | 50 | Campos de valor seguem a moeda principal (Ajustes). Os dados continuam guardados em G$ (ou US$ onde já era). |
| `50-categorias-tipos.js` | 517 | Categorias, formatos, cores, variações (C1–C6) e criação de tipos. |
| `51-lote-grupos.js` | 312 | Lotes de compra: grupos, custos e seleção de lote. |
| `52-lotes.js` | 1485 | Aba Lotes: lista, detalhe, formulário e leitura da nota. |
| `53-faixas.js` | 249 | Faixas de qualidade, piso de preço, brindes e sazonalidade. |
| `54-analises.js` | 475 | Análises: meta do mês, reposição, estoque parado, curva ABC, sugestão de margem e câmbio x piso. |
| `56-contas.js` | 129 | Contas em várias moedas, vencimentos e avisos. |
| `57-financas.js` | 569 | Finanças: resultado do mês, fluxo de caixa, retirada do dono, conferência de caixa, capital parado, dólar e pr |
| `57-separacao.js` | 420 | Separação das vendas por moeda, total convertido (botão G$/R$/US$), "Livre para você", plano de troca, colchão e reposição. |
| `58-pagamento.js` | 56 | Forma de pagamento da venda e taxas (maquininha, Pix). |
| `59-seguranca.js` | 437 | Segurança (PIN e biometria ao abrir) e cópias automáticas dos dados. |
| `60-vendas.js` | 346 | Aba Vendas. |
| `61-codigos-similares.js` | 181 | Códigos parecidos e utilitários do leitor de haste. |
| `62-pagamento-misto.js` | 266 | Pagamento em várias moedas, câmbio manual e troco devolvido em outra moeda. |
| `63-descarte.js` | 76 | Descarte: peças quebradas ou imprestáveis saem do estoque e viram prejuízo. |
| `64-identidade.js` | 196 | Identidade do modelo: nº interno, marca/material/público/coleção, nome e descrição automáticos |
| `65-sugestoes.js` | 199 | Sugestões ao digitar (no lugar da lista nativa do Android, que travava e aparecia torta) |
| `70-camera.js` | 774 | Câmera do app (visor, galeria, lanterna, prévia) e plano B nativo. |
| `80-leitor-dialogos.js` | 590 | Leitor de código: diálogos e fluxo de cadastro por foto. |
| `81-leitor-parse.js` | 299 | Leitor de haste: interpretação do texto lido (código, medida, variação). |
| `82-leitor-preprocessamento.js` | 633 | Leitor de haste: pré-processamento da imagem para o OCR. |
| `83-leitor-haste.js` | 308 | Leitor de haste: busca no estoque e tela do leitor. |
| `88-movimento.js` | 95 | Movimento: animações leves (opacidade e escala), desligadas se o aparelho pedir menos movimento. |
| `89-dash-abas.js` | 306 | Dashboard em abas (Resumo, Dinheiro, Giro, Preços), com "Atenção agora" e blocos que abrem ao toque. |
| `89-inicio.js` | 162 | Início: botões em "azulejo" (ícone em cima do nome) e barra de navegação de baixo |
| `89-notificacoes.js` | 99 | Notificações: o que precisa de atenção agora + registro dos alertas do dólar |
| `90-navegacao-dashboard.js` | 304 | Navegação entre abas e Dashboard. |
| `91-cambio.js` | 296 | Aba Câmbio: cotação, gráfico e atualização. |
| `92-despesas.js` | 251 | Aba Despesas. |
| `93-historico.js` | 568 | Aba Histórico: dias, vendas e registros. |
| `94-acoes.js` | 587 | Ações dos botões (data-act) e eventos globais. |
| `95-caixa.js` | 445 | Aba Caixa: carteira, conversão de moedas e reservas. |
| `95-pedidos.js` | 230 | Pedidos: pedidos do catálogo online para a loja (por enquanto lançados à mão; o catálogo online ligará aqui). |
| `96-ajustes.js` | 278 | Aba Ajustes: faixas, meta, contas e backup dos dados. |
| `97-contagem.js` | 308 | Contagem de estoque (aba Estoque): por produto, do mais valioso ao menos, com resumo em dinheiro. |
| `97-hist-busca.js` | 243 | Histórico: resumo por mês, busca, filtros, calendário e carregamento aos poucos. |
| `98-botoes-anim.js` | 412 | Animações dos botões: ondinha, realce deslizante, cascata, contagem, ✓, segurar para apagar, sino e arrastar. |
| `98-carrinho.js` | 420 | Carrinho: várias peças numa venda só; o piso vale para o total, não para cada peça. |
| `98-financeiro.js` | 387 | Ações e eventos da parte financeira (contas, fluxo, retirada, conferência, taxas). |
| `98-zexemplo.js` | 327 | Dados de exemplo: fotos desenhadas e cerca de 14 meses de histórico (para testar o app). |
| `99-render-persistencia.js` | 294 | Render geral e persistência (localStorage + IndexedDB). |

## Fluxo de venda
Produto → "Adicionar pedido" (`98-carrinho.js`, `S.cart`) → Pedido (`cartPainel`, passo `ped`) → Confirmar → Pagamento (passo `pag`, `95-caixa.js` + `62-pagamento-misto.js`) → `cartFinalizar`. O desconto é o que falta do valor recebido; `descAbrir` confirma e pede o motivo. Piso/trava: `cartPrevia` e `renderPiso` (`60-vendas.js`).

