# IDEIAS 05 · Menu, busca e carrinho com UM movimento (para o SITE)

Escolhas do dono (22/11): **crescer do botão + fundo desfocado**. Topo: **mostrar as duas** (A = como hoje; B = ☰ e lupa à esquerda, conta e sacola à direita).
Base: site do ar 1795333368. Inclui o B4 (topo some com o menu aberto depois de rolar), porque é a mesma causa: o topo precisa ficar parado e à vista.

## Causa (medido em DIAGNOSTICO.md)
Cada camada tem o seu próprio movimento. Na busca há 5 animações de entrada empilhadas na mesma peça (`lfsoIn`, `lfsoInPc`, `lfsoGrow`, `soin` e a do JS). No menu há 9 regras de `.dpn` e 14 de `#drw` mexendo em transição e transform. No carrinho há 12 de `.scrim.pg`.
Resultado: 3 tempos de abrir, 3 de fechar, 3 curvas, 3 direções e 3 fundos diferentes.

## Jeito natural (regra 12)
1. **Uma função só, `camada(el, botao, abre)`**, num arquivo próprio (`src/` da família "camadas"). Ela é usada pelo menu, pela busca e pelo carrinho.
   - Lê o centro do botão tocado e põe o `transform-origin` da camada nesse ponto.
   - Abrir: `scale .4→1`, `opacity 0→1`, 420 ms. Fechar: o inverso, 280 ms. Uma curva só, `cubic-bezier(.16,1,.3,1)`, nos dois sentidos.
   - Com "reduzir movimento": só opacidade, 150 ms.
2. **Um fundo só, `#fundo`**, abaixo do topo:
   - `backdrop-filter: blur(14px)` com véu `rgba(18,8,14,.22)`;
   - o site atrás recua `scale .97`;
   - aparece e some no mesmo tempo e curva da camada.
   - Ele substitui `.dsc` (menu), `.sosc` (busca) e o recuo do `#home`.
3. **Topo sempre à vista.** Toda camada começa embaixo do topo, numa medida só (`--topo`, lida uma vez ao abrir). O B4 acaba junto: a trava de rolagem fica só no `html`, sem `overflow:hidden` no `body`, e o topo continua `sticky`.
4. **Apaga no mesmo passo:**
   - as 5 animações da `.sopn`;
   - a transição `translateX(-102%)` da `.dpn` e as variantes de `#drw`;
   - o `translateX(100%)` da `.scrim.pg`;
   - as cascatas próprias dos itens do menu e da busca (o conteúdo vem junto com a camada);
   - `.dsc` e `.sosc`;
   - `html.lock body{overflow:hidden}`.
5. **Topo B** (se o dono escolher): só a ordem no `.bar` do celular: ☰ 1 · lupa 2 · logo 3 · conta 4 · sacola 5. Fica 2 botões de cada lado, com o logo no centro de verdade. PC não muda.
6. **Argus:** a regra 3 das ferramentas ("olho em movimento", Fila 59) passa a medir as três camadas: o mesmo tempo, a mesma curva, a origem no botão e o topo visível, com e sem rolagem.

## Arquivos
- `esboco-05-animacoes.mp4`: Hoje | Proposta topo A | Proposta topo B. Abre e fecha o menu, a busca e o carrinho; depois rola e abre o menu.
- `*-menu.png`, `*-busca.png`, `*-topo.png`: quadros parados.
- `video.py` (pintura + gravação), `mede.py` (medição), `compara_anim.py` (comparador), `comp-8724/`.

## Não testado
Aparelho real. O desfoque (`backdrop-filter`) custa mais em celular fraco: medir no Test Lab antes de publicar.

## PC e tablet (pedido do dono, 22/11 06:10)
A mesma regra, sem mudar nada: o menu cresce do ☰ e a busca da lupa (ela continua centralizada, com 640 px). O carrinho cresce da sacola. O fundo desfoca e o topo fica à vista.
O topo B é só do celular: no PC o topo não muda.
Vídeo: `esboco-05-animacoes-pc.mp4` (Hoje em cima, Proposta embaixo).
Comparador no PC e no tablet: 0 falhas novas. As diferenças são só três: o menu abre embaixo do topo, o site atrás recua e a busca desce para baixo do topo.
