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

## Versão 2 (pedido do dono, 22/11 06:21–06:22): esta substitui as anteriores (regra 7)
- **Celular:** cada camada (menu, busca, carrinho) ocupa a **tela toda embaixo do topo**, sem desfoque.
  - O topo fica como hoje: ☰ e conta à esquerda, logo no centro, lupa e sacola à direita.
- **PC e tablet (≥ 900 px):** topo novo, com logo à esquerda e lupa · sacola · ☰ à direita, 24 px entre eles.
  - O botão Minha conta sai do topo e vira o cartão "Minha conta · Meus pedidos", que já está no topo do menu.
  - O menu abre do lado direito, porque o ☰ está à direita. A busca continua no centro. O fundo desfoca.
- **Nos dois:**
  - a camada cresce do botão tocado e volta para ele (420/280 ms, uma curva);
  - **o botão tocado vira ✕** no mesmo lugar e fecha a camada;
  - saem o ✕ e o título "MENU" de dentro do menu e o ✕ de dentro do carrinho (regra 12d).
  - O ✕ volta a ser o ícone quando a camada fecha, por qualquer caminho (✕, Esc, voltar ou tocar fora).
- **Como fazer, além do que está acima:**
  - a função `camada()` recebe o botão;
  - o estado "aberto" do botão é uma classe só, que troca o ícone pelo ✕;
  - a largura da camada vem de uma variável por aparelho: tela cheia no celular, 360 px (menu) ou 640 px (busca) no PC;
  - no PC, a ordem do `.bar` é só `order`, e o logo sai do `position:absolute`.
- **Vídeos:** `esboco-05b-celular.mp4` (Hoje | Proposta) e `esboco-05b-pc.mp4` (Hoje em cima, Proposta embaixo).
  - Os vídeos anteriores (topo A/B) vão para `work/obsoletos/` quando o dono aprovar.
- **Comparador:** 0 falhas novas em celular, celular com letra 1,2×, tablet e PC (`comp-8725*`).
  - Diferenças esperadas: os ícones do topo do PC mudam de lugar, o Minha conta some do topo do PC, as camadas abrem embaixo do topo, o site atrás recua no PC, e no celular a busca e o menu ficam em tela cheia.

## Versão 3 (dono 22/11 12:01): as camadas acompanham a temática
- **Causa:** cada tema muda cada peça com uma regra própria (48 regras só na Black Friday), e as camadas não estão nessa lista.
  - Por isso, na Black Friday, o topo é preto e o menu, a busca e o carrinho ficam cinza-claros.
  - O "Ofertas" do menu tem cor fixa (`#c0392b`), enquanto o da busca já usa a cor do tema.
- **Jeito natural (a mesma lógica do B6):**
  - cada tema só declara variáveis: o fundo do tema (cor + desenho de pontinhos), o texto, o texto apagado, a linha, o cartão e a cor de ação;
  - o topo e as três camadas leem essas mesmas variáveis, porque **a camada é a continuação do topo**;
  - os temas de topo escuro (Black Friday e Ano Novo à noite) trocam as variáveis só dentro da camada, e tudo lá dentro acompanha sem nenhuma regra nova;
  - nenhuma cor fixa dentro das camadas: "Ofertas" usa a cor de ação do tema, e o campo da busca usa o texto do tema com 7% de opacidade;
  - sai a cor fixa `#drw nav.dnv>a.dof{color:#c0392b}`.
  - Tema novo = só as variáveis; as camadas já saem certas.
- **Pranchas** (Hoje × Proposta):
  - `esboco-05c-temas-celular-1.jpg` (Black Friday, Ano Novo noite e dia, Natal);
  - `esboco-05c-temas-celular-2.jpg` (Halloween, Mães, Pais);
  - `esboco-05c-temas-pc.jpg` (Black Friday e Natal).
  - O tema foi forçado no simulador, por isso a faixa mostra o texto da Black Friday em todos.
- **Notado, sem mudar:** a setinha ">" é cinza no menu e da cor do tema na busca. É a mesma função com desenho diferente (regra 15). Fica para o dono decidir.
