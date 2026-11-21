# Esboço 43: Estúdio no padrão do app · S435 ESBOCO · 21/11 08:24

O dono disse que o Estúdio "não está nos padrões do app". Imagem: esboco_43_estudio_no_padrao.jpg (Hoje × Proposta, celular escuro).
Base: aprovados (base_app) + esboço 41 (Frente · 3/4 · Giro em cada peça). O 41c (Galeria do app) ainda espera o dono e não entrou.

## O que hoje foge do padrão (medido no simulador, v587 + base)
1. Abre **por cima de tudo** (`.estOv`, fixo): some a barra de baixo e o cabeçalho com logo e sino.
   O Estúdio está no grupo Peças (Inventário · Estúdio), mas não se comporta como tela do grupo.
2. Fecha com **"×"**. A regra 16 diz que lugar = "‹ voltar"; nenhuma outra tela do grupo tem ×.
3. Não tem "‹ PEÇAS". A frase debaixo do título tem 2 linhas de explicação, quando nas outras telas é uma frase curta.
4. O rótulo "NA FILA · 24" é **rosa**. Nas outras telas o rótulo é cinza (`.lbl`, `--mute`); rosa é cor de ação.
5. Cada linha tem **dois toques**: a linha (fotografar) e o link rosa da direita ("Ficha ›", e "Galeria ›" no 41).
   No resto do app, a linha inteira é um toque só, com "›" cinza.

## Proposta
- O Estúdio é uma **tela do grupo Peças**: cabeçalho do app (logo e sino), "‹ PEÇAS", título "Estúdio", frase "Fotos e giros das peças" e a barra de baixo.
- **"?" redondo** ao lado do título (o mesmo botão redondo do "+" do Inventário). A explicação de hoje ("Você só tira as fotos…") vai para dentro do "?".
- Sai o "×": volta pelo "‹ PEÇAS", arrastando da borda ou com o voltar do Android, como as outras telas.
- "Começar · 24 peças na fila" e "Peça nova, ainda sem cadastro ›" ficam iguais.
- Rótulo "NA FILA · 24" cinza (`.lbl`).
- **Cada linha é uma linha de lista com "›"** (a mesma família das listas dos grupos): foto, nome, cor e as marcas Frente · 3/4 · Giro.
  Tocar abre a **Galeria da peça** (esboço 41), onde estão "Tirar agora ›" e "Refazer ›".
  *Muda um detalhe do 41: lá, tocar na linha fotografava. Aqui a linha só tem um destino, e fotografar uma peça só fica dentro da Galeria.*
  Fotografar a fila inteira continua no "Começar".

## Como fazer (jeito natural, regra 12)
- O Estúdio vira uma **view** (`#v-est`), aberta pela navegação como as outras (`inicioGo('est')` → `setView('est')`), e não um overlay montado no `body`.
  Ele entra na pilha do grupo (`S.nvP = ['grp:g:pecas','est']`), então o "‹ PEÇAS", o arrastar e o voltar do Android vêm de graça (99c-navegacao-s435.js).
  Saem o `.estOv`, o `estX`/`data-e="fecha"` e o CSS do cabeçalho próprio (`.estHd`, `.estHdR`, `.estIc`, `.estX`).
- Título e frase pelo mesmo `.top` das outras telas. O "?" é o botão redondo `.pl78` com o ícone do conjunto e abre a ajuda de hoje (`estAjuda`).
- Linhas pela mesma marcação das listas (`.nvL` / `.nvTx`), com a foto no lugar do ícone. Sai o `.estFi` (o link da direita) e o CSS de `.estRw`/`.estIt`.
- Rótulo com `.lbl`. Sai o `.estLbl` rosa.
- A câmera (`estCam`) continua abrindo por cima, porque é a câmera. Ao fechar, volta para a tela Estúdio no mesmo ponto.
- **Trava no porteiro:**
  - Abrir o Estúdio mantém `#mainnav` visível e `S.nvP` termina em 'est'.
  - Não existe `.estOv` nem botão "×".
  - Cada linha da fila é `.nvL` com um toque só.
  - O rótulo tem a cor `--mute`.
