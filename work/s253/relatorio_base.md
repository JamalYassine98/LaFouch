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

{{NUM}}

## 3 · Os dois pontos que o dono citou

### 3.1 · A tela de "carregando" do app (hoje: amadora)
- **Hoje:** fundo preto a 38% e uma pílula no topo com o texto e três pontinhos que piscam trocando o texto (".", "..", "..."). É a mesma em 16 chamadas do código: Analisando código, Analisando foto, Carregando foto, Comparando com o estoque, Lendo a nota, Conferindo a foto, Padronizando N de M, Preparando a foto, Aplicando a luz de estúdio, Gravando o vídeo, Montando o Status. Fica até 75 s sem mostrar avanço. Além dela existem mais 8 carregadores diferentes (anéis de 0,7 a 1,7 s, brilho que varre, barrinhas, anel que pulsa) e a tela de importar cópia com anel grosso de 4 px, brilho que estoura a 1,9× e barra em degradê.
- **Luxo:** um cartão só, no centro, que nasce do botão tocado (0,32 s) e volta para ele (0,2 s); fundo recua e escurece. Dentro: a miniatura da foto que está sendo lida (quando há foto) com um fio de luz que passa devagar; a frase em serifada; uma linha de progresso fina — real quando há contagem ("3 de 12"), suave e contínua quando não há; as etapas trocam com transparência ("Lendo o código" → "Medidas" → "Cor"). Sem pontinhos, sem anel grosso, sem degradê. Um carregador único (anel de 1,5 px, 1 volta por segundo) substitui os outros 8 em botões e listas.
- **Decisão sua:** mostrar um "Cancelar" discreto depois de 4 s (hoje não existe; é função nova).

### 3.2 · O leitor do código da haste (hoje: amador)
- **Hoje (visto no simulador com câmera falsa):** tela preta, o vídeo só numa faixa, quatro cantos brancos grossos, uma linha rosa-neon que varre sem parar (1,5 s, animando posição), "Analisando código" com os pontinhos, a régua de zoom no visual azul padrão do navegador, botão branco de disparo e ícone de galeria. Há um controle branco vertical à esquerda da faixa cuja função não identifiquei no simulador.
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
| S12 | Página da peça · palco | flutua (5,5 s), brilho (4,5 s), reflexo (3 s), respiração (2,6–3,4 s) e sombra, todos sem fim; entrada de 0,9 a 1,6 s | a peça assenta uma vez em 0,46 s e fica parada; brilho passa 1 vez ao abrir. **Decisão sua:** esses efeitos são escolhidos por peça (`data-fx`); recomendo 1 passada só |
| S13 | Capa (hero), lema e selo | fundo se move em 14–17 s sem fim; selo gira em 9 s sem fim; textos entram em 1,2 s | fundo e selo parados; textos entram em fila em 0,46 s |
| S14 | Abertura do site | logo em 3 tempos (1,2 · 1,0 · 0,8 s) + saída 0,8 s | 1 vez por visita, até 1,2 s no total |
| S15 | Pedido confirmado | check com brilho que estoura a 1,8×, anel girando sem fim, coração 1,2 s, confete, etiqueta que balança sem fim | check desenhado em 0,46 s, valor em serifada, etiqueta parada. **Decisão sua:** tirar o confete (recomendo) |
| S16 | Conta criada | check com anel de 0,9 s e giro de 0,7 s | o mesmo check do S15 |
| S17 | Teste de formato do rosto | setas se mexem sem fim (2,6 s); toque estoura a 1,2× com brilho | setas dão 2 passadas e param; toque afunda |
| S18 | Mochi | padrão próprio aprovado (brilhos e pisca sem fim) | manter; só a curva |
| S19 | Temáticas | enfeites encerram aos 10 s | manter |
| S20 | Puxar para atualizar e carregadores | anel 0,8–1,0 s + ícone que pulsa 1,4 s | o carregador único |
| S21 | Avisos (toast) | aparece em 0,2 s | sobe 8 px e aparece em 0,32 s; sai em 0,2 s |
| S22 | Botão Comprar (brilho) | brilho passa a cada 4,2 s sem fim, animando posição | 1 passada quando o botão entra na tela |
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
| A18 | Toque nos botões | onda de tinta (0,6 s) em vários botões | **Decisão sua:** tirar a onda e ficar só o afundar (recomendo) |
| A19 | Site dentro do app | botão do site com onda que estoura a 2,4×; luz de 1 s; ponto "ao vivo" com sombra | sem onda; ponto respira por transparência |
| A20 | Números e barras | números contam em 0,9 s; barras de meta crescem em 0,7 a 3 s animando largura; brilho na meta batida | contam em 0,48 s só ao entrar; barras por escala em 0,46 s; meta batida = fio claro |
| A21 | Senha e segurança | cartão 0,35 s, teclas, ficha 0,55 s | só curva e tempos |
| A22 | Tela vazia (Pedidos, Clientes) | desenho de 1,5 s que se repete | **aprovado:** 1 vez, 0,6 s |
| A23 | Modo cliente | anel de 5 s para sair | manter (funcional) |

## 5 · Lista completa — cada animação desenhada

### Site
{{TAB_SITE}}

### App
{{TAB_APP}}

## 6 · Transições (as mudanças de estado: cor, sombra, posição)

Regra única: os 3 tempos e a curva de luxo. As que hoje mexem em tamanho ou posição passam a usar deslocamento ou escala, com o mesmo visual:

{{LAY}}

## 7 · O que NÃO consegui ver (não vou inventar)

- A tela de "carregando" em uso real: no simulador a leitura por foto não disparou; descrevi pelo código.
- O leitor com câmera de verdade (usei câmera falsa); a função do controle branco à esquerda da faixa.
- Estúdio, marketing (vídeo/Status), nota de compra, lotes, atacado, câmbio em uso, modo cliente, senha/biometria: li o código, não abri cada tela.
- No site: checkout completo, pagamento, pedido confirmado, teste de rosto e Mochi em uso — só pelo código.
- Fluidez real: nada foi visto em celular de verdade.
- A classificação da lista completa é automática (nome, tempo, curva, o que anima); pode haver erro pontual — já errei uma vez hoje ao chamar de "sem fim" os enfeites das temáticas, que encerram aos 10 s.

## 8 · Decisões que são suas

1. Efeitos do palco da peça (flutuar, brilho, reflexo, respirar): 1 passada só, ou manter sem fim?
2. Confete no pedido confirmado: tirar?
3. Onda de tinta no toque dos botões do app: tirar?
4. Atalhos balançando no modo editar do Início: trocar por "subir com sombra"?
5. "Cancelar" na tela de carregando depois de 4 s (função nova)?
6. Mochi: manter o padrão próprio (recomendo) ou entrar na regra geral?

## 9 · Ordem proposta para implementar (cada passo com esboço em vídeo antes, onde ainda não há)

1. Base: os 3 tempos, as 2 curvas e o carregador único (vale para tudo de uma vez).
2. App: folha única + troca de tela com direção (já em vídeo, S252).
3. App: cadastro — Adicionar, leitor da haste e carregando (precisa de esboço).
4. App: confirmações, avisos, erros, sino, nuvem.
5. Site: busca, sacola, abas (S252), menu, filtros, favoritar, cartões.
6. Site: abrir a peça com origem no cartão, palco, pedido confirmado.
7. Limpeza: apagar as sem uso, trocar largura/posição por deslocamento.
