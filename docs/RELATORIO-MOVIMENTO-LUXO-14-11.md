# Relatório: todo o movimento do site e do app, pela lógica de luxo — 14/11/2026

Pedido do dono (14/11 00:56): versão de luxo para TODAS as animações e interações; estudar tudo, corrigir tudo, e passar o relatório antes de implementar. **Nada foi implementado.**

Como foi feito: `work/s253/inv.py` leu o código inteiro e listou cada animação desenhada, onde é usada, quanto dura e o que foge do padrão; `work/s248` e `work/s249` tocaram em cada controle visível e mediram o que se mexe ao abrir e fechar; `work/s253/fluxo.py` percorreu o cadastro (Adicionar → Ler haste com câmera falsa).

## 1 · O padrão de luxo (o que vale para tudo)

1. **Origem:** o que abre nasce do que foi tocado e volta para lá ao fechar.
2. **Simetria:** fechar é o inverso de abrir, em cerca de 65% do tempo.
3. **Direção:** ir entra de um lado, voltar sai pelo outro; o que vem de um ícone entra pelo lado dele.
4. **Profundidade:** o que fica atrás recua um pouco e escurece (desfoque só em aparelho forte).
5. **Calma:** desaceleração longa (curva `.16,1,.3,1` para entrar, `.4,0,.2,1` para sair). Nada quica, balança ou treme.
6. **Três tempos:** 0,2 s (pequeno) · 0,32 s (médio) · 0,46 s (grande). Toque responde em 0,08 s.
7. **Fila curta:** itens em fila de 16 a 22 ms, tudo pronto em até 0,56 s.
8. **Sem fim só para "carregando"** — e um carregador só, fino e discreto. Chamar atenção = 1 ou 2 passadas.
9. **Liso:** animar deslocamento, escala e transparência; nunca largura, altura, posição, sombra ou brilho.

## 2 · Em números

| | Site | App |
|---|---|---|
| Animações desenhadas | 91 | 137 |
| Manter | 31 | 31 |
| Ajustar (curva/tempo) | 30 | 70 |
| Trocar (quique, balanço, tremida, sem fim, carregador) | 11 | 32 |
| Apagar (sem uso) | 19 | 4 |
| Transições | 250 | 166 |
| Tempos diferentes nas transições | 28 | 22 |
| Transições sem a curva de luxo | 201 | 143 |
| Transições que mexem em tamanho/posição | 15 | 12 |
| Animações feitas por código (animate / quadro a quadro / relógio) | 48 / 50 / 20 | 49 / 42 / 40 |

## 3 · Os dois pontos que o dono citou

### 3.1 · A tela de "carregando" do app (hoje: amadora)
- **Hoje:** fundo preto a 38% e uma pílula no topo com o texto e três pontinhos que piscam trocando o texto (".", "..", "..."). É a mesma em 16 chamadas do código: Analisando código, Analisando foto, Carregando foto, Comparando com o estoque, Lendo a nota, Conferindo a foto, Padronizando N de M, Preparando a foto, Aplicando a luz de estúdio, Gravando o vídeo, Montando o Status. Fica até 75 s sem mostrar avanço. Além dela existem mais 8 carregadores diferentes (anéis de 0,7 a 1,7 s, brilho que varre, barrinhas, anel que pulsa) e a tela de importar cópia com anel grosso de 4 px, brilho que estoura a 1,9× e barra em degradê.
- **Luxo:** um cartão só, no centro, que nasce do botão tocado (0,32 s) e volta para ele (0,2 s); fundo recua e escurece. Dentro: a miniatura da foto que está sendo lida (quando há foto) com um fio de luz que passa devagar; a frase em serifada; uma linha de progresso fina — real quando há contagem ("3 de 12"), suave e contínua quando não há; as etapas trocam com transparência ("Lendo o código" → "Medidas" → "Cor"). Sem pontinhos, sem anel grosso, sem degradê. Um carregador único (anel de 1,5 px, 1 volta por segundo) substitui os outros 8 em botões e listas.
- **Decisão sua:** mostrar um "Cancelar" discreto depois de 4 s (hoje não existe; é função nova).

### 3.2 · O leitor do código da haste (hoje: amador)
- **Hoje (visto no simulador com câmera falsa):** tela preta, o vídeo só numa faixa, quatro cantos brancos grossos, uma linha rosa-neon que varre sem parar (1,5 s, animando posição), "Analisando código" com os pontinhos, a régua de zoom no visual azul padrão do navegador, botão branco de disparo e ícone de galeria. A "pílula" branca à esquerda da faixa é o canto de cima-esquerda desenhado com 104 px de altura em vez de 30 (os outros três têm 30): parece defeito, não função.
- **Luxo:** o botão "Ler haste" cresce até virar o leitor (origem) e o leitor encolhe de volta ao fechar; o vídeo ocupa a tela inteira com um véu escuro suave fora da faixa; cantos finos (1,5 px) que respiram só enquanto procura; sai a linha neon; quando acha o texto, a faixa ganha um fio claro e o código lido aparece em serifada acima dela (0,32 s) com uma vibração curta; zoom vira uma régua fina própria (1× · 2× · 3×) na cor do texto; a dica some sozinha em 3 s; ✕ e galeria no padrão dos botões novos. Todas as funções ficam.

## 4 · Interações, uma a uma (hoje → luxo)

### Site
| Nº | Interação | Hoje (medido) | Luxo |
|---|---|---|---|
| S1 | Abrir a peça / voltar | troca de página 0,6 s para entrar e 0,28 s para sair; quadro parado de ~200 ms | a foto do cartão tocado cresce até virar a foto da peça e volta para o cartão; 0,46 / 0,3 s; montar antes de animar |
| S2 | Menu | abre com itens em fila até 1,05 s; fecha em 0,53 s | gaveta desliza em 0,4 s, itens em fila de 16 ms, página recua; fecha tudo junto em 0,26 s |
| S3 | Busca | abre da lupa em 0,42 s; fecha seca | **aprovado (S252):** cresce da lupa e volta para ela, página recua, lista em fila |
| S4 | Sacola | abre seca; fecha em 0,3 s com texto por cima de texto | **aprovado (S252):** desliza inteira da direita e sai por lá |
| S5 | Minha conta (abas) | a janela inteira refaz a entrada | **aprovado (S252):** pílula desliza, conteúdo vem do lado da aba |
| S6 | Filtros | folha sobe em 0,28 s; fundo em 0,2 s | folha sobe em 0,46 s desacelerando, página recua; fecha em 0,3 s |
| S7 | Cartões do catálogo | entram em 0,6 s (foto 0,7 s) com a curva antiga | 0,46 s, fila de 22 ms só na primeira tela; mouse na peça (aprovado S247); toque afunda |
| S8 | Favoritar | 1,9 s de efeitos; contador da sacola estoura a 1,7× | **aprovado:** coração até a sacola em 0,62 s; o número troca rolando, sem estourar |
| S9 | "Adicionado à sacola" | janela aparece em 0,42 s com check em 0,4–0,6 s | nasce do botão Comprar e vai para a sacola; 0,46 / 0,3 s |
| S10 | Destaque (carrossel) | foto aproxima em 6,2 s, linha de tempo de 6 s | manter; troca de slide com cruzamento de 0,46 s |
| S11 | WhatsApp | 2 pulsos (já feito); vira aba animando largura e altura | mesmo visual, animando escala e deslocamento |
| S12 | ~~Palco da peça~~ | **CORRIGIDO 14/11:** flutuar, brilho, reflexo e respirar existem no código mas pertencem ao palco antigo do Início, que está escondido; a página da peça de hoje não tem nenhum efeito sem fim | apagar o código antigo; nada a decidir |
| S13 | ~~Capa, lema e selo~~ | **CORRIGIDO 14/11:** também são da capa antiga, escondida hoje | apagar o código antigo |
| S14 | Abertura do site | logo em 3 tempos (1,2 · 1,0 · 0,8 s) + saída 0,8 s | 1 vez por visita, até 1,2 s no total |
| S15 | Pedido confirmado | check com brilho que estoura a 1,8×, anel girando sem fim, coração 1,2 s, confete, etiqueta que balança sem fim | check desenhado em 0,46 s, valor em serifada, etiqueta parada. **Decisão sua:** tirar o confete (recomendo) |
| S16 | Conta criada | check com anel de 0,9 s e giro de 0,7 s | o mesmo check do S15 |
| S17 | Teste de formato do rosto | setas se mexem sem fim (2,6 s); toque estoura a 1,2× com brilho | setas dão 2 passadas e param; toque afunda |
| S18 | Mochi | padrão próprio aprovado (brilhos e pisca sem fim) | manter; só a curva |
| S19 | Temáticas | enfeites encerram aos 10 s | manter |
| S20 | Puxar para atualizar e carregadores | anel 0,8–1,0 s + ícone que pulsa 1,4 s | o carregador único |
| S21 | Avisos (toast) | aparece em 0,2 s | sobe 8 px e aparece em 0,32 s; sai em 0,2 s |
| S22 | ~~Brilho do botão da capa~~ | **CORRIGIDO 14/11:** é da capa antiga, escondida hoje | apagar o código antigo |
| S23 | Etiqueta de estoque e Últimas unidades | pulso sem fim | manter o das Últimas (seu pedido); a etiqueta respira igual |
| S24 | Trocar tema, olho da senha, opções do pagamento | 0,6 · 0,35 · 0,22 s | só curva e tempos |

### App
| Nº | Interação | Hoje (medido) | Luxo |
|---|---|---|---|
| A1 | Abertura do app | logo em 1,2 · 1,0 · 0,8 s + saída 0,8 s; letras que quicam (1 s) | até 1,2 s no total, sem quique |
| A2 | Trocar de tela | 1 movimento de 0,2 s (v508) | **aprovado (S252):** ir entra da direita, voltar da esquerda, 0,36 s |
| A3 | Barra | linha desliza animando posição e largura | mesma linha por deslocamento; sem pulinho (feito) |
| A4 | Início | atalhos em fila curta (feito); ao editar, os atalhos balançam sem fim; anel "fantasma" estoura a 1,6× | ao editar, o atalho sobe 2 px com sombra e mostra a alça, sem balançar; anel sem estouro |
| A5 | Janelas e folhas | 11 jeitos de abrir (0,18 a 0,8 s), um deles com mola; várias fecham secas | **aprovado (S252):** uma folha só — sobe em 0,46 s, tela de trás recua, fecha em 0,3 s; menus pequenos nascem do botão |
| A6 | Ficha do produto | foto cresce em 0,75 s; campos sobem em 0,5 s | a foto cresce a partir da miniatura tocada (0,46 s) e volta para ela; campos em fila de 22 ms |
| A7 | Adicionar produto | janela no topo (0,26 s); leitor e carregando como no item 3 | folha do padrão; leitor e carregando novos (item 3) |
| A8 | Cadastro rápido | cartão 0,45 s, brilho 0,9 s, campos acendem, ícone da câmera 1,1 s | cartão 0,32 s; campo reconhecido ganha fio claro por 0,46 s, sem brilho |
| A9 | Fotos | caixa da foto com brilho que varre (1,2 s sem fim); flash 0,28 s; luz de estúdio 0,8–1,5 s | brilho mais lento e claro (é carregador); flash mantém; luz em 0,46 s |
| A10 | Venda concluída | check que estoura, brilho de 1,6 s, faixa nova, botões de compartilhar que sobem e brilham (1,2 s), explosão de anel 0,9 s | check desenhado em 0,46 s + valor em serifada; compartilhar entra em fila; sem brilho nem explosão |
| A11 | Sino e contador | o sino balança (0,7 s) e pula; contador novo pulsa sem fim com sombra | o contador aparece suave; 2 pulsos de transparência e para |
| A12 | Avisos | 4 tipos (0,28 a 0,55 s para entrar, 0,26 a 0,35 s para sair) | um aviso só: desce em 0,32 s, sobe em 0,2 s, linha de tempo fina |
| A13 | Erros | 4 tremidas diferentes (0,4 a 0,55 s) | 1 deslocamento curto (6 px, 0,2 s) e fio vermelho; senha errada: os pontos esvaziam |
| A14 | Carregadores | 8 anéis e brilhos diferentes + pílula de pontinhos | o carregador único e a linha de progresso (item 3.1) |
| A15 | Nuvem | botão pulsa sem fim pedindo ação (1,3 s, com sombra), brilho que varre, salto de 0,6 s | estado calmo: ponto + frase; 2 pulsos de transparência |
| A16 | Apagar | "segurar para apagar" enche animando largura (0,9 s); tampa da lixeira 1,3 s | enche por escala; tampa em 0,46 s |
| A17 | Chips, abas e marcações | chip escolhido estoura a 1,2×; pílula das abas anima posição e largura | sem estouro; pílula por deslocamento |
| A18 | ~~Onda de tinta no toque~~ | **CORRIGIDO 14/11:** já foi desligada na v465 (os botões só afundam); sobrou o código | apagar o código que sobrou |
| A19 | Site dentro do app | botão do site com onda que estoura a 2,4×; luz de 1 s; ponto "ao vivo" com sombra | sem onda; ponto respira por transparência |
| A20 | Números e barras | números contam em 0,9 s; barras de meta crescem em 0,7 a 3 s animando largura; brilho na meta batida | contam em 0,48 s só ao entrar; barras por escala em 0,46 s; meta batida = fio claro |
| A21 | Senha e segurança | cartão 0,35 s, teclas, ficha 0,55 s | só curva e tempos |
| A22 | Tela vazia (Pedidos, Clientes) | desenho de 1,5 s que se repete | **aprovado:** 1 vez, 0,6 s |
| A23 | Modo cliente | anel de 5 s para sair | manter (funcional) |

## 5 · Lista completa — cada animação desenhada

### Site
| Animação | Onde (código) | Hoje | Decisão | Correção |
|---|---|---|---|---|
| `amsp` | `.amsp` | 2.2 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |
| `amtk` | `.amtk` | 2.6 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |
| `arr` | `.arrive` | 1 s · efeito pesado, longa, curva padrão | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `cadd` | `.cadk .c` | 0.4/0.6 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `cadf` | `.cad` | 0.2 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `cadp` | `.cadb` | 0.42 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `cardout` | `.card.out` | 0.33 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `ccdraw` | `.cck svg path` | 0.45 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `ccpop` | `.cck` | 0.55 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `ccring` | `.cck::before` | 0.9 s · longa, curva padrão | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `ccsp` | `.cck .sp` | 0.7 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `ccup` | `.ccok h2` | 0.5 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `cfall` | `#pkok .cf` | tempo por variável | **Manter** | Dentro do padrão; só confirma a curva. |
| `ckpop` | `#layer .cfo.on::after` | 0.22 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `ctash` | `.cta .shn` | 4.2 s · sem fim · mexe no tamanho/posição | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `draw` | `.motto::after` | 1.2 s · longa, curva padrão | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `dsup` | `#dsh .dsp` | 0.28 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `efd` | `.stage[data-cx][data-fx~=cascata] .tag` | 0.6 s · curva padrão | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `efi` | `.stage[data-cx][data-fx~=cascata] img.pf` | 1 s · longa | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `evasa` | `.evfx .mo svg` | 0.28 s · sem fim ·  | **Manter** | Manter: já encerra com os enfeites aos 10 s. |
| `evbri` | `.evfx .sh` | 3.2 s · longa, curva padrão | **Manter** | Manter: 1 passada. |
| `evcai` | `.evfx .fl` | tempo por variável · sem fim ·  | **Manter** | Manter: já encerra sozinho aos 10 s. |
| `evpis` | `.evfx .br` | tempo por variável · sem fim ·  | **Manter** | Manter: já encerra sozinho aos 10 s. |
| `evvoa` | `.evfx .mo` | tempo por variável · curva padrão | **Manter** | Manter. |
| `fade` | `.scrim` | 0.2 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `farEl` | `ao tocar, o feedback */ .fcar.in .far.l` | 0.9 s · longa | **Ajustar** | Encurta para 0,46 s. |
| `farEr` | `.fcar.in .far.r` | 0.9 s · longa | **Ajustar** | Encurta para 0,46 s. |
| `farIl` | `ao tocar, o feedback */ .fcar.in .far.l` | 2.6 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |
| `farIr` | `.fcar.in .far.r` | 2.6 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |
| `farTl` | `.fcar.in .far.l.tap` | 0.45 s · quica, efeito pesado, curva padrão | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; troca brilho/sombra animada por transparência; curva de luxo. |
| `farTr` | `.fcar.in .far.r.tap` | 0.45 s · quica, efeito pesado, curva padrão | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; troca brilho/sombra animada por transparência; curva de luxo. |
| `fl` | `.hero::before` | 14/17 s · sem fim ·  | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `flo` | `.stage>svg,.stage>img` | 5.5 s · sem fim ·  | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `fup` | `.stage[data-cx][data-fx~=cascata]` | 0.9 s · longa | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `gzac` | `#gw .gzbt.acende .gzgo` | 0.5 s · curva padrão | **Manter** | Padrão próprio da Mochi, já aprovado; só entra na curva de luxo. |
| `gzgl` | `#gw .gzav.gzbr` | 1.6 s · sem fim · efeito pesado | **Manter** | Padrão próprio da Mochi, já aprovado; só entra na curva de luxo. |
| `gzpis` | `#gw .gzmu.gzpis` | 1.4 s · sem fim · efeito pesado | **Manter** | Padrão próprio da Mochi, já aprovado; só entra na curva de luxo. |
| `gzvpg` | `#gw .gzvp i` | 0.8 s · sem fim ·  | **Manter** | Padrão próprio da Mochi, já aprovado; só entra na curva de luxo. |
| `hb` | `#pkok .hrt` | 1.2 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `hdkb` | `#hdst .hdi img` | 6.2 s · longa, curva padrão | **Manter** | Manter: aproximação lenta da foto do Destaque (é o tempo do slide). |
| `hdpg` | `#hdst .hdots button.on::after` | 6 s · longa, curva padrão | **Manter** | Manter: linha de tempo do slide. |
| `hin` | `.hero h1,.hero p,.cta .btn,.gar` | 1.2 s · longa | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `hlvIn` | `#home .hlv` | 0.5 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `imgin` | `.pf` | 0.7 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `iout` | `#intro` | 0.8 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `ipulse` | `—` | tempo por variável · efeito pesado | **Apagar** | Não é usada em lugar nenhum. |
| `iw1` | `.ilogo .la` | 1.2 s · efeito pesado, longa | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s. |
| `iw2` | `.ilogo .lb` | 1 s · efeito pesado, longa | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s. |
| `iw3` | `.ilogo .lc` | 0.8 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `lfsoGrow` | `#sov.on .sopn` | 0.42 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `lfsoIn` | `#sov.on .sopn` | 0.3 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `lfsoInPc` | `#sov.on .sopn` | 0.3 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `lfsoTx` | `#sov.on .sopn>*` | 0.42 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `navIn` | `html[data-nav]::view-transition-new(root)` | 0.6 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `navOut` | `html[data-nav]::view-transition-old(root)` | 0.28 s · efeito pesado, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; curva de luxo. |
| `navPgIn` | `html .scrim.pg.navIn` | 0.38 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `navbIn` | `.navb.ent` | 0.5 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `navbSeta` | `.navb.ent svg` | 0.6 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `olho` | `.pwo.on svg` | 0.35 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `pgin` | `—` | tempo por variável ·  | **Apagar** | Não é usada em lugar nenhum. |
| `pgrise` | `l .scrim.pg>.panel,html .scrim.pg.acc>.panel` | 0.28 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `pisca` | `lf-site.js:3623` | 0.16 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `pkck` | `#pkok .pkc path` | 0.5 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `pkfi` | `#pkok` | 0.4 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `pkgl` | `#pkok .pkc u` | 1 s · quica, longa, curva padrão | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; encurta para 0,46 s; curva de luxo. |
| `pksp` | `#pkok .pkc .pks` | 0.9 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |
| `pktm` | `#pkok .pktm` | 1800 s · longa, curva padrão | **Manter** | Manter: é o relógio de 30 min do pagamento, não é enfeite. |
| `pkup` | `</style><style id="s201">.amwrap` | 0.4/0.45/0.5 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `pop` | `.badge.pop` | 0.5 s · quica, curva padrão | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; curva de luxo. |
| `ptrG` | `#ptr5.gira svg` | 0.8 s · sem fim | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `resp` | `lf-site.js:3617` | 2.6 s · sem fim ·  | **Manter** | Respiração e sombra da Mochi (padrão próprio). |
| `reveal` | `—` | tempo por variável · efeito pesado | **Apagar** | Não é usada em lugar nenhum. |
| `rfl` | `.stage .rfl i` | 3 s · sem fim · mexe no tamanho/posição | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `ring` | `.wa` | 3 s · sem fim · efeito pesado | **Manter** | Manter: já limitado a 2 voltas (S235). |
| `rise` | `#cmpbar` | 0.35/0.4/0.5 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `rsp` | `.stage[data-fx~=resp] img.pf` | 3.4 s · sem fim ·  | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `sg` | `.seal` | 9 s · sem fim ·  | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `shd` | `.stage` | 1.6 s · efeito pesado, longa, curva padrão | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `shine` | `.stage .shine,.ph .shine` | 4.5 s · sem fim ·  | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `sin` | `.stage` | 1.1 s · longa | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: capa/palco antigos do Início estão escondidos). |
| `slide` | `.panel` | 0.3 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `sofd` | `#dsh .dsp.dspc` | 0.18/0.2/0.25 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `soin` | `#sov .sopn` | 0.32 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `somb` | `lf-site.js:3619` | 2.6 s · sem fim ·  | **Manter** | Respiração e sombra da Mochi (padrão próprio). |
| `spin` | `—` | tempo por variável ·  | **Apagar** | Não é usada em lugar nenhum. |
| `swap` | `#theme.spin svg` | 0.6 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `tbeat` | `.tring svg` | 1.4 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |
| `tspin` | `.tring i` | 1 s · sem fim | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `ulinp` | `.ulin i` | 1.6 s · sem fim ·  | **Manter** | Manter sem fim (pedido do dono: pulso suave das Últimas unidades). |
| `wap` | `.wa` | 3.2 s · sem fim · efeito pesado | **Manter** | Manter: já limitado a 2 voltas (S235). |
| `wap2` | `.stk.u::before` | 1.6 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |

### App
| Animação | Onde (código) | Hoje | Decisão | Correção |
|---|---|---|---|---|
| `ajAnel` | `a do ícone (0,4 s) */ .ajR.ajSeg .ajIc:after` | 0.25 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `avBar` | `.avdentro .adb` | 4 s · longa, curva padrão | **Manter** | Manter: linha de tempo do aviso; só afinar. |
| `avDesce` | `.avdentro` | 0.45 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `avSobe` | `.avdentro.sai` | 0.35 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `bsPul` | `.bsolid.new .bi` | 1.4 s · sem fim · efeito pesado | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa; troca brilho/sombra animada por transparência. |
| `bsRing` | `.ring.tocando2` | 0.7 s · balança, longa, curva padrão | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `bsSpin` | `.lfa-spin` | 1 s · sem fim | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `bump` | `.bump` | 0.38 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `camLeitura` | `.bs:focus-within .ic.cam svg` | 1.1 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `camflash` | `.lffl` | 0.28/0.35 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `cas` | `.cascata .tl,.cascata .hero` | 0.5 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `cfEntra` | `.cfRow.entra` | 0.2/0.35/0.45 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `cgBrilho` | `.cg-par.top:after` | 0.9 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `cgIn` | `.cg-card` | 0.45 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `chkPop` | `.chk.on svg` | 0.28 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `cjDesenha` | `.cjC.on .k` | 0.5 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `cxMenuIn` | `irar/Melhorias/Conferir em gaveta */ .cxMenu` | 0.3 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `ebPop` | `.ebCk` | 0.28 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `edEntraD` | `10-estoque-detalhe.js:1356` | 0.32 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `edEntraE` | `—` | tempo por variável ·  | **Apagar** | Não é usada em lugar nenhum. |
| `enche` | `[data-act=impdel].segura::after` | 0.9 s · mexe no tamanho/posição, longa, curva padrão | **Ajustar** | Anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso); encurta para 0,46 s; curva de luxo. |
| `enterUp` | `.enter` | 0.26 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `fadein` | `.fadein` | 0.2/0.22/0.35 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `fantAnel` | `.fantAnel` | 0.5 s · quica, curva padrão | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; curva de luxo. |
| `fantIn` | `.tl.fant` | 0.28 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `fbSobe` | `#filtBox` | 0.32 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `fichaGrow` | `#detail.fichaIn .pbox` | 0.75 s · longa | **Ajustar** | Encurta para 0,46 s. |
| `fichaUp` | `#detail.fichaIn .detgrid>.col:last-child>*` | 0.5 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `fjF` | `.fjBk.in` | 0.25 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `fjS` | `.fjJn.in` | 0.32 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `growx` | `#splitBar i` | 0.7 s · longa | **Ajustar** | Encurta para 0,46 s. |
| `impG` | `.impSp` | 0.9 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |
| `impbar` | `#impOv .pb s` | 1.4 s · mexe no tamanho/posição, longa, curva padrão | **Ajustar** | Anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso); encurta para 0,46 s; curva de luxo. |
| `impck` | `#impOv .ic path` | 0.45 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `impfi` | `#impOv` | 0.25 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `impgl` | `#impOv .ic u` | 1 s · quica, longa, curva padrão | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; encurta para 0,46 s; curva de luxo. |
| `impsh` | `#impOv .er svg` | 0.45 s · treme, curva padrão | **Trocar** | Sai a tremida: 1 deslocamento curto (6 px, 0,2 s) e fio vermelho no campo; curva de luxo. |
| `impsp` | `#impOv .sp` | 0.8 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |
| `impup` | `#impOv .bx` | 0.35 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfBrilha` | `tBateu .bar i,.mtBateu [style*="background"]` | 0.8 s · efeito pesado, longa, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s; curva de luxo. |
| `lfDesenha` | `g path,.lfVazio svg circle,.lfVazio svg rect` | 1 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `lfEntra` | `.view.enter` | 0.2 s | **Manter** | Manter até entrar a troca de tela com direção (S252). |
| `lfEspIn` | `.lfEspCx` | 0.38 s · curva com mola | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `lfEspSai` | `.lfEspia.sai` | 0.2 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfGira` | `#lfPuxa.gira` | 0.7 s · sem fim | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `lfShm` | `.pbox:not(.lfOk)::after` | 1.2 s · sem fim | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `lfSobe` | `.lfVazio b` | 0.45 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfTopoIn` | `.lfTopo` | 0.55 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `lfTopoInB` | `.estBarra` | 0.4 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `lfTopoSai` | `.lfTopo.sai` | 0.3 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfTopoSaiB` | `.estBarra.sai` | 0.26 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfaAmb` | `.lfa-amb` | 0.8 s · efeito pesado, longa, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s; curva de luxo. |
| `lfaBot` | `.lfa-toast.b` | tempo por variável · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfaBump` | `.lfa-bump` | 0.5 s · quica, curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `lfaBurst` | `.lfa-lg.ok .rg` | 0.9 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `lfaCd` | `.lfa-toast .cd` | 5 s · mexe no tamanho/posição, longa, curva padrão | **Ajustar** | Anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso); encurta para 0,46 s; curva de luxo. |
| `lfaCol` | `.lfa-col` | 0.45 s · mexe no tamanho/posição, curva padrão | **Ajustar** | Anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso); curva de luxo. |
| `lfaDr` | `.lfa-dr path` | 0.5 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfaEq` | `.eq b` | 0.6 s · sem fim · mexe no tamanho/posição | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa; anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso). |
| `lfaExp` | `.lfa-exp` | 0.65 s · mexe no tamanho/posição, longa | **Ajustar** | Anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso); encurta para 0,46 s. |
| `lfaFade` | `.lfa-ov` | 0.2/0.25 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfaFadeO` | `.lfa-ov.sai` | 0.3 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfaFill` | `.lfa-fill` | 2 s · mexe no tamanho/posição, longa, curva padrão | **Ajustar** | Anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso); encurta para 0,46 s; curva de luxo. |
| `lfaFl` | `.lfa-fl` | 1.5 s · efeito pesado, longa, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s; curva de luxo. |
| `lfaIn` | `ó opacidade/posição/tamanho ===== */ .lfa-in` | 0.35/0.5 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `lfaPop` | `.lfa-pop` | 0.45 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `lfaRg` | `.lfa-lg .rg` | 1.8 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |
| `lfaSDn` | `.lfa-ov.sai .lfa-sh` | 0.35 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfaSUp` | `.lfa-sh` | 0.45/0.5 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `lfaShk` | `.lfa-shk` | 0.55 s · treme, curva padrão | **Trocar** | Sai a tremida: 1 deslocamento curto (6 px, 0,2 s) e fio vermelho no campo; curva de luxo. |
| `lfaSlr` | `.lfa-slr` | 0.5 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `lfaSpin` | `.lfa-sp` | 1.7 s · sem fim | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `lfaTop` | `.lfa-toast` | 0.4 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `lfbandown` | `.lfban.nova` | 0.5 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `lfbar` | `.vcf.cont .vpb i` | 3 s · longa, curva padrão | **Manter** | Manter: linha de tempo; só afinar. |
| `lfcp` | `.vcc.done .vck` | 0.55 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `lfd60` | `.vcc.done .vck path` | 0.5 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfdr` | `.lfban.nova .lfck circle` | 0.35/0.5 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfdraw` | `.lfallok path` | 0.6 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfgl` | `.vcc.done .vck` | 1.6 s · efeito pesado, longa, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s; curva de luxo. |
| `lfglowk` | `.lfglow` | 0.9 s · efeito pesado, longa, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s; curva de luxo. |
| `lfi1` | `#lfIntro .la` | 1.2 s · efeito pesado, longa | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s. |
| `lfi2` | `#lfIntro .lb` | 1 s · efeito pesado, longa | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s. |
| `lfi3` | `#lfIntro .lc` | 0.8 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `lfiOut` | `aFouch</title>  <style id="lfiCss"> #lfIntro` | 0.8 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `lfl` | `.lfbig span` | 1 s · quica, longa, curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; encurta para 0,46 s. |
| `lfm` | `.lfmed` | 0.45 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `lfpl` | `#lfSitePv .lv i` | 1.2 s · sem fim · efeito pesado | **Manter** | Manter: ponto "ao vivo" (é estado); trocar o brilho por respiração de transparência. |
| `lfpop` | `.lfok.on` | 0.45 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `lfrg` | `.lfrg` | 0.9 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `lfrot` | `.vspn` | 0.7/0.8 s · sem fim | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `lfshine` | `.bar.lfp i.sh:after` | 0.9 s · mexe no tamanho/posição, longa, curva padrão | **Ajustar** | Anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso); encurta para 0,46 s; curva de luxo. |
| `lfshk` | `.lfshake` | 0.5 s · treme, curva padrão | **Trocar** | Sai a tremida: 1 deslocamento curto (6 px, 0,2 s) e fio vermelho no campo; curva de luxo. |
| `lfsw` | `.lfl` | 1.5 s · sem fim · mexe no tamanho/posição | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa; anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso). |
| `lfup` | `.lfallok` | 0.5/0.55 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `lfwv` | `#edSiteBtn.lfwave:after` | 1 s · quica, longa, curva padrão | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; encurta para 0,46 s; curva de luxo. |
| `lixoTampa` | `#edLixeira.on svg` | 1.3 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `lsIn` | `.lsList` | 0.18 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `mcIn` | `ela pular) */ body.modoCli.mcAberto #vDetail` | 0.24 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `mlAnel` | `#mlWrap .brand.mcSeg .mlAnel circle` | 5 s · longa, curva padrão | **Manter** | Manter: anel de "segurar 5 s para sair" do modo cliente (funcional). |
| `msgpop` | `.msgpop` | 0.28 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `nvGira` | `.nvSp` | 0.75 s · sem fim | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `nvPede` | `.nvBtn.ask` | 1.3 s · sem fim · efeito pesado | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa; troca brilho/sombra animada por transparência. |
| `nvPula` | `.nvBtn.ok` | 0.6 s · efeito pesado, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; curva de luxo. |
| `nvTraco` | `.nvCk path` | 0.45 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `nvVarre` | `.nvBtn.busy::after` | 1.15 s · sem fim · mexe no tamanho/posição | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `nvokp` | `.nvf.okp` | 0.9 s · efeito pesado, longa, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s; curva de luxo. |
| `ofMola` | `#ofModal .ofModal` | 0.7/0.8 s · longa | **Ajustar** | Encurta para 0,46 s. |
| `ofPulso` | `.ofChips .chip.on` | 0.45 s · quica, curva padrão | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; curva de luxo. |
| `okb` | `.okflash` | 0.35 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `okdraw` | `.okck path` | 0.45 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `okpop` | `.okck` | 0.45 s · quica | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `pdFade` | `.pdOv` | 0.2 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `pdIn` | `.pdCard` | 0.35 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `pdSobe` | `.pdSh` | 0.3 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `pdTokIn` | `.pdTok` | 0.55 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `pdTrema` | `.pdKey.erra` | 0.4 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `popin` | `.popin` | 0.26 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `pulinho` | `98-botoes-anim.js:69` | 0.45 s · quica | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `pulinho2` | `.sino.toca i` | 0.4 s · quica, curva padrão | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto; curva de luxo. |
| `pulinhoN` | `—` | tempo por variável · quica | **Apagar** | Não é usada em lugar nenhum. |
| `qphIn` | `vai entrar (barra e Início) */ #mainnav .qph` | 0.22 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `ripa` | `.rip` | 0.6 s · curva padrão | **Apagar** | Código antigo que NÃO aparece hoje (conferido em 14/11: a onda de toque foi desligada na v465). |
| `shBrilho` | `.shA.pri .shI` | 1.2 s · efeito pesado, longa, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s; curva de luxo. |
| `shSobe` | `.shAp.in .shA` | 0.45 s · curva com mola | **Trocar** | Sai o quique: chega ao lugar desacelerando, sem passar do ponto. |
| `shVoa` | `.shA.voa .shI` | 0.4 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `siteLuz` | `.siteSpk` | 1 s · longa, curva padrão | **Ajustar** | Encurta para 0,46 s; curva de luxo. |
| `siteOnda` | `.siteWave` | 0.8 s · efeito pesado, longa, curva padrão | **Ajustar** | Troca brilho/sombra animada por transparência; encurta para 0,46 s; curva de luxo. |
| `slideInL` | `.slideL` | 0.38 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `slideInR` | `.slideR` | 0.38 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `spinr` | `.spinr` | 0.8 s · sem fim | **Trocar** | Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem. |
| `splitUp` | `#splitCard:not([hidden])` | 0.4 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `tabIn` | `.tabchip` | 0.28 s · curva padrão | **Ajustar** | Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s). |
| `telaSobe` | `—` | tempo por variável ·  | **Apagar** | Não é usada em lugar nenhum. |
| `toca` | `.sino.toca` | 0.7 s · balança, longa, curva padrão | **Trocar** | Sai o balanço: troca por aparecer suave; encurta para 0,46 s; curva de luxo. |
| `vlAbre` | `.vlSub` | 0.3 s | **Manter** | Dentro do padrão; só confirma a curva. |
| `wob` | `.twrap .tl` | 0.5 s · sem fim ·  | **Ajustar** | Deixa de ser sem fim: 1 ou 2 passadas e repousa. |

## 6 · Transições (as mudanças de estado: cor, sombra, posição)

Regra única: os 3 tempos e a curva de luxo. As que hoje mexem em tamanho ou posição passam a usar deslocamento ou escala, com o mesmo visual:

- Site: `#atacado .atp button` anima `all`
- Site: `html body a.wa` anima `width`
- Site: `html body a.wa` anima `height`
- Site: `html body a.wa` anima `right`
- Site: `html body a.wa svg` anima `width`
- Site: `html body a.wa svg` anima `height`
- Site: `.sec h2::after` anima `width`
- Site: `.stage .dots button::before` anima `width`
- Site: `.dts i` anima `width`
- Site: `.cat .sub` anima `max-height`
- Site: `.cat .sub` anima `max-height`
- Site: `#pkok .cdx i u` anima `width`
- Site: `#gw .gzbar i` anima `width`
- Site: `#gw .gzfita` anima `top`
- Site: `artão pulsa enquanto ele explica */ #gw .gzav.gzrv` anima `margin-right`
- App: `.zsw:after` anima `left`
- App: `.nvtg i` anima `left`
- App: `.cpBar i` anima `width`
- App: `.pdProg i` anima `width`
- App: `.pdStep:after` anima `width`
- App: `.lfa-cnt i` anima `width`
- App: `.vprog-b i` anima `width`
- App: `.cdel` anima `max-height`
- App: `.trkTh` anima `width`
- App: `.scSw::after` anima `left`
- App: `.lcBar i` anima `width`
- App: `ACT.updgo = function ()` anima `width`

## 7 · O que NÃO consegui ver (não vou inventar)

- A tela de "carregando" em uso real: no simulador a leitura por foto não disparou; descrevi pelo código.
- O leitor com câmera de verdade (usei câmera falsa); a função do controle branco à esquerda da faixa.
- Estúdio, marketing (vídeo/Status), nota de compra, lotes, atacado, câmbio em uso, modo cliente, senha/biometria: li o código, não abri cada tela.
- No site: checkout completo, pagamento, pedido confirmado, teste de rosto e Mochi em uso — só pelo código.
- Fluidez real: nada foi visto em celular de verdade.
- **O inventário lê o código, não a tela:** três coisas que apontei (palco da peça, capa/selo, onda de toque) existem no código mas não aparecem hoje. Conferi as demais "sem fim" do site no Início, catálogo e peça: só o ponto das Últimas roda.
- A classificação da lista completa é automática (nome, tempo, curva, o que anima); pode haver erro pontual — já errei uma vez hoje ao chamar de "sem fim" os enfeites das temáticas, que encerram aos 10 s.

## 8 · Decisões que são suas (atualizado em 14/11 01:10)

1. ~~Efeitos do palco da peça~~ — **não existe mais na tela** (código antigo escondido). Nada a decidir; apagar.
2. Confete no pedido confirmado — **APROVADO tirar.**
3. ~~Onda de tinta no toque~~ — **já estava desligada** desde a v465. Nada a decidir; apagar o resto do código.
4. Atalhos balançando no modo editar do Início → vídeo `work/s254/s254_video_app_editar_inicio.mp4`.
5. "Cancelar" na tela de carregando → vídeo `work/s254/s254_video_app_carregando.mp4`.
6. Mochi: padrão próprio ou regra geral → vídeo `work/s254/s254_video_site_mochi.mp4`.

Exemplo extra: leitor da haste → `work/s254/s254_video_app_leitor_haste.mp4`.

## 9 · Ordem proposta para implementar (cada passo com esboço em vídeo antes, onde ainda não há)

1. Base: os 3 tempos, as 2 curvas e o carregador único (vale para tudo de uma vez).
2. App: folha única + troca de tela com direção (já em vídeo, S252).
3. App: cadastro — Adicionar, leitor da haste e carregando (precisa de esboço).
4. App: confirmações, avisos, erros, sino, nuvem.
5. Site: busca, sacola, abas (S252), menu, filtros, favoritar, cartões.
6. Site: abrir a peça com origem no cartão, palco, pedido confirmado.
7. Limpeza: apagar as sem uso, trocar largura/posição por deslocamento.
