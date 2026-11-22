# IDEIAS 06 · Temática estilo CAMPANHA (para o SITE)
Pedido do dono, 22/11 12:23: manter as datas, mas do jeito das lojas de luxo.

## Causa (achada no site do ar 1795333368)
1. **O visual da La Fouch não existe sozinho.** As cores de base (`--bg --pn --tx --mu --ln --ac`) só são declaradas dentro dos temas (`html[data-ev=…]{…}`). Sem evento ativo, essas variáveis ficam vazias.
2. **Cada tema pinta o site peça por peça:** são 131 regras que mudam cor, fundo e desenho de topo, rodapé, cartões, botões e camadas (lista em `removidas.txt`). Por isso cada tema novo quebra alguma coisa (B6, camadas, rodapé).

## Jeito natural (regra 12)
1. **Um lugar só para o visual da marca:** `:root{--bg --pn --tx --mu --ln --ln2 --ac}` (paleta neutra clara, a mesma o ano todo). O `--ac` é a cor de ação do momento: `var(--act, vinho da marca)`.
2. **Um tema só declara 4 coisas:**
   - o texto da faixa;
   - **uma** cor de acento (`--act`), que pinta a faixa, os botões de ação e os destaques ("Ofertas", preço, "Como chegar");
   - o chapéu do Mochi (como já é hoje);
   - o Destaque no formato **Campanha** (foto editorial da data). Esse está em espera; entra quando o dono tirar o destaque da espera e houver a foto.
3. **Saem** as 131 regras por peça, no mesmo passo. Ficam só as linhas `--act` de cada tema.
4. **Junto com os aprovados:**
   - IDEIAS 05: as camadas seguem a temática sozinhas, porque leem as mesmas variáveis;
   - setinha › cinza.
5. **Argus:** uma prova que falha se aparecer regra com `[data-ev=` que mude algo além de `--act`/`--evb`.

## Esboços (celular, Hoje × Proposta)
- `esboco-06-natal.jpg` e `esboco-06-bf.jpg`: início, meio, rodapé e menu aberto.
- **O que muda à vista:**
  - a faixa ganha a cor do acento (vermelho);
  - o fundo de pontinhos, o topo e o rodapé coloridos/pretos saem, e o site fica no visual neutro da marca;
  - os títulos pequenos ("TESTE DE LEITURA") ficam escuros;
  - o chapéu do Mochi fica.
- **Comparador:** 0 falhas novas (celular; `comp/`). As diferenças são as cores acima.
- **Em aberto para o dono:**
  - o rodapé fica claro (proposto) ou preto o ano todo?
  - os títulos pequenos ficam escuros (proposto) ou na cor do acento?
- `esboco-06-maes-pais.jpg`: Dia das Mães e Dia dos Pais, início e menu (pedido do dono, 12:35). Na proposta, o "Ofertas" do menu usa o acento do tema (aprovado na IDEIAS 05).

## 06b · Molde único de data, mostrado no Natal (dono 22/11 12:44, a partir de REFERENCIAS.md)
Toda data usa o MESMO molde, com 4 peças e nada mais:
1. **Faixa:** a mensagem e o aviso prático ("retirada no mesmo dia", "peça até X").
2. **Uma cor de acento** (`--act`), que pinta a faixa, o botão e o título pequeno do destaque.
3. **Mochi com o chapéu da data:** já existe hoje e não muda.
4. **Destaque Campanha no topo do Início** (o 3º formato do Destaque, recado do ESBOCO 06:04):
   - foto grande (a foto editorial da data, do post da semana do Semp; no esboço é a foto real da SL2265);
   - título pequeno com o nome da data, na cor do acento;
   - título serifado: uma frase só;
   - preço discreto da peça da foto;
   - **um** botão ("Ver presentes"), que abre o catálogo filtrado da data;
   - **seleção da data**: três escolhas de dois lados/pílulas ("Para ela · Para ele · Para todos"), que levam ao catálogo filtrado por gênero (`gen f/m/u` já existe nas peças).
- **Jeito natural:**
  - o painel do app ganha, no evento, só estes campos: faixa, cor, foto, título, peça da foto e seleção;
  - o site monta o Destaque Campanha com eles (uma função só, família "destaque");
  - sem o evento ativo, o bloco não aparece.
- **Esboço:** `esboco-06b-molde-natal.jpg`.
- **Comparador:** 0 falhas novas (celular; `comp-molde/`).
- As pranchas da 06 foram refeitas com o topo com fundo próprio (antes o conteúdo passava por baixo do topo transparente).

## 06c · Animação do evento (dono 22/11 14:07–14:15)
- **Hoje** (`fx()` em lf-site.js):
  - já é **um efeito por data**: Natal 14 flocos caindo; Mães 10 pétalas; Pais e Ano Novo, brilhos; Halloween, 2 morcegos que voam **dentro** do destaque;
  - fica só no destaque `#home .hd`, dura **10 s** e some em 1,2 s;
  - respeita o "reduzir movimento".
- **Proposta:**
  - o mesmo efeito da data, mas **dentro da foto do Destaque Campanha**;
  - **menos peças** (Natal: 8 flocos finos) e **só 4 s** ao chegar; depois some em 1,2 s e não volta;
  - flocos com uma sombra leve, para aparecer em foto clara;
  - "reduzir movimento" continua sem efeito.
- **Jeito natural:** a mesma `fx()`, com o lugar trocado para a foto da campanha (`.lfcamp .ft`) e um tempo só (4 s) para todas as datas. Sai o `#home .hd` como lugar do efeito.
- **Vídeo:** `esboco-06c-efeito-natal.mp4`. Com a foto de produto em fundo branco a neve é discreta; com a foto editorial da data ela aparece mais.

### 06c v2 · Flocos com sensação de neve (dono 22/11 14:42): substitui os flocos da v1
O que dá a sensação de neve, mesmo com só 8 flocos:
- **Profundidade:** 3 flocos perto (11–14 px, levemente desfocados, um pouco mais rápidos) e 5 longe (4–6 px, nítidos, mais lentos).
- **Balanço:** cada floco cai oscilando de um lado para o outro (5–16 px, 1,6–2,6 s), porque neve não cai reta.
- **Queda lenta:** de 45 a 75 px por segundo.
- **Já começa nevando:** os flocos começam espalhados no ar e entram com um esmaecer suave, sem "chuva" saindo do topo.
- **Floco macio:** o miolo claro se desfaz na borda.
- **Cor da neve pelo brilho da foto:** em foto escura, branco; em foto clara, cinza-azulado (neve branca some em fundo branco).
  - Para isso, a foto da campanha ganha um campo "foto escura/clara" no painel. Uma variável só (`--nv1/--nv2`).
- **Continua igual:** só na foto da campanha, 4 s, some em 1,2 s, nada com "reduzir movimento".
- **Vídeo:** `esboco-06c-neve-natal.mp4`: Hoje | Proposta em foto clara | Proposta em foto escura (exemplo de fundo, sem foto real).
- **Recomendação para o dono:** a foto da campanha do Natal deve ter fundo escuro ou colorido, porque é nela que a neve aparece de verdade.

### 06c v3 · Movimento de LUXO (dono 22/11 14:57): substitui a neve (v1 e v2)
- **Por que mudar:** o dono achou o fundo escuro problemático e os flocos grandes. O estudo mostra que, no luxo, **o movimento mora na foto ou no filme da campanha**, lento, uma vez só, e serve para revelar e não para enfeitar.
  - Tiffany e Cartier: filme de campanha.
  - Sites de luxo: animação ambiente lenta, revelação suave, nada que distraia.
  - Por isso, **sem partículas** (neve, pétalas, brilhos piscando, morcegos).
- **Três movimentos, iguais em TODA data** (a data muda só a foto, a cor e o chapéu do Mochi):
  1. **A foto respira:** aproxima 4% em 8 s, uma vez.
  2. **Um brilho de luz** atravessa a foto uma vez (1,8 s, velocidade uniforme), como reflexo na lente.
  3. **O texto se revela:** título pequeno, título, preço, botão e seleção sobem 12 px e aparecem; 500 ms cada, 80 ms entre um e outro.
- **Curva:** a mesma das camadas (`.16,1,.3,1`). O brilho usa velocidade uniforme, para dar para ver.
- Nada disso roda com "reduzir movimento".
- **Jeito natural:**
  - uma família "campanha" no CSS com esses três movimentos;
  - começa quando o destaque aparece na tela;
  - **sai a `fx()`** inteira (neve, pétalas, brilhos e morcegos) e as `@keyframes evcai/evpis/evvoa/evasa`.
- **Vídeo:** `esboco-06c-luxo-natal.mp4` (Hoje | Proposta).

### 06c v4 (dono 22/11 15:02): o brilho sai, porque é clichê. Neve não combina: no Paraguai o Natal é no verão.
- **Ficam só dois movimentos**, iguais em toda data:
  - a foto da campanha "respira" (4% em 8 s, uma vez);
  - o texto se revela.
- **Recomendação (o caminho do luxo):** o movimento vem da **própria campanha**: um vídeo curto, mudo, em loop (6–8 s), filmado pelo Semp. Exemplos para o Natal paraguaio (verão): o sol batendo na lente, um tecido mexendo no vento, uma taça de clericó.
  - O site já aceita vídeo no destaque (`CFG.video` / `dmodo:'video'`). O Destaque Campanha usa **foto OU vídeo** no mesmo lugar, com a mesma regra.
  - Com vídeo, a foto não "respira", porque o próprio vídeo já é o movimento.
- **Vídeo:** `esboco-06c-luxo-natal.mp4` (Hoje | Proposta v4).

### 06d (dono 22/11 15:06): campanha em câmera lenta. Substitui as v3 e v4 do movimento, que o dono não chegou a ver de tão sutis.
- **O destaque da data passa a ter 3 fotos da campanha** (ou um vídeo). Cada uma fica 4,5 s na tela e se dissolve em 1,4 s na seguinte, aproximando 6% devagar enquanto aparece.
  - O nome e o preço da peça da foto trocam junto, com um fade.
- **O texto entra uma vez, coreografado:** título pequeno, título, preço, botão e seleção (700 ms, 120 ms entre um e outro).
- **Botão:** "**Descobrir a seleção**" no lugar de "Ver presentes". O verbo é de experiência e diz o que vem. Vale para toda data (sai o `b2` de cada tema).
- **Seleção:** Para ela · Para ele · Para todos.
- "Reduzir movimento": a 1ª foto fica parada e não troca.
- **Jeito natural:**
  - o destaque de evento que já existe (`EVD`/`.hd`) vira o Destaque Campanha, com `fotos[3]` ou `video`, e cada foto ligada a uma peça (ref) para o nome e o preço;
  - sai a `fx()` de partículas.
- **Vídeo:** `esboco-06d-campanha-natal.mp4`. Usa 3 fotos reais de peças (SL2265, SL2300, SL2270) no lugar das fotos do Semp.

### 06e · O Destaque Campanha em cada evento (dono 22/11 15:16)
| Data | Título pequeno | Título (o de hoje no site) | Botão | Seleção | Peças do esboço |
|---|---|---|---|---|---|
| Black Friday | Só esta semana | Black *Friday* | Descobrir as ofertas | Solar · Armações · Leitura | GR3340, SL2285, SL2255 |
| Natal | Natal La Fouch | Presenteie estilo neste *Natal* | Descobrir a seleção | Para ela · Para ele · Para todos | SL2265, SL2275, SL2260 |
| Ano Novo | Ano Novo | Ano novo, *novo olhar* | Descobrir a seleção | Solar · Armações · Leitura | SL2270, SL2250, BR44145 |
| Dia das Mães | Dia das Mães | Um presente com *carinho* | Descobrir a seleção | Solar · Armações · Leitura | SL2300, AC1055, SL2270 |
| Dia dos Pais | Dia dos Pais | Estilo para o seu *pai* | Descobrir a seleção | Solar · Armações · Leitura | SL2305, GR3345, SL2250 |
| Halloween | Halloween | Olhar *misterioso* | Descobrir a seleção | Solar · Gatinho · Armações | SL2255, BR44140, SL2285 |
- **Para todas:** a mesma estrutura, o mesmo movimento (06d), uma cor de acento (o *destaque* do título e o botão), o chapéu do Mochi e a faixa.
- **No painel do evento:** título pequeno, título, subtítulo, 3 fotos (ou vídeo) com a peça de cada uma, e a seleção (3 escolhas).
- **Pranchas:** `esboco-06e-eventos-1.jpg` (BF, Natal, Ano Novo) e `esboco-06e-eventos-2.jpg` (Mães, Pais, Halloween).

#### Cor única por data (dono 22/11 15:22: "por que não o azul nos Pais? por que dois vermelhos?")
- **Causa:** no esboço eu usei o `--act` de hoje de cada tema, e ele não é a cor-assinatura da data. Nos Pais é o caramelo, mas a faixa é azul-marinho. A BF e o Natal eram dois vermelhos quase iguais.
- **Regra:** cada data tem UMA cor-assinatura, sem repetir com outra data. Ela pinta a faixa, o botão e o *destaque* do título.

| Data | Cor | Por quê |
|---|---|---|
| Black Friday | preto `#111111` | o próprio nome; o mais sóbrio |
| Natal | vermelho `#b3263a` | a cor clássica do Natal |
| Ano Novo | dourado `#8d703e` | brinde, brilho, sem clichê |
| Dia das Mães | rosa `#b8436f` | já era a cor da data |
| Dia dos Pais | azul-marinho `#1e2f4d` | o azul que o dono gosta; já era a faixa de hoje |
| Halloween | roxo `#5a2f72` | já era o roxo do tema; não repete o laranja do dourado |

- Todas têm texto branco legível no botão.

## 06f · Página da SELEÇÃO da data (dono 22/11 15:27): para onde leva "Descobrir a seleção"
- **Hoje:** o 2º botão do destaque de evento ("Ver presentes") leva a `#vitrine`, o catálogo comum com tudo.
- **Proposta:** a mesma tela do catálogo, com o mesmo componente e os mesmos cartões, em modo "seleção da data":
  - "‹ Início";
  - título serifado "Seleção de *Natal*", com a palavra da data na cor da data;
  - **faixa da campanha**: as mesmas fotos (ou vídeo) do destaque, se dissolvendo devagar;
  - uma frase: "Escolhidas pela La Fouch para presentear. Retirada no mesmo dia em Ciudad del Este.";
  - abas no desenho das abas do catálogo: **Todos · Para ela · Para ele** (o unissex aparece nas duas);
  - grade com **só as peças escolhidas para a data** (8 no Natal), com a contagem certa;
  - sem "Filtros ›", porque a seleção é curta.
- **Jeito natural:**
  - a vitrine ganha um modo `selecao` com a lista de refs, o título, a frase e as fotos, vindos do evento no painel;
  - as pílulas do destaque (Para ela / Para ele / Para todos) abrem essa mesma tela já na aba certa;
  - nenhum cartão novo; o rótulo da aba mantém o tamanho de letra do grupo (regra L4).
- **Aviso:** o preço no destaque deve usar o mesmo formatador dos cartões. No simulador em pt-BR os cartões mostram R$, e o destaque do esboço mostrava G$.
- **Esboço:** `esboco-06f-selecao-natal.jpg` (Hoje | Proposta em 3 alturas).

## 06g · "Para presente" no carrinho (dono 22/11 15:38)
- **Onde:** no carrinho, logo abaixo das peças, um cartão no mesmo desenho do cartão da peça.
- **O que tem:**
  - título "Para presente", com o ícone de presente (do mesmo conjunto de ícones do site);
  - a frase "Embalagem La Fouch e um cartão com a sua mensagem." e, durante a data, "Grátis no Natal.";
  - **escolha de dois lados: Não | Sim** (regra 15);
  - no Sim, abre ali mesmo (regra 16): campo em linha fina "Mensagem do cartão (opcional)", até 200 letras com contador, e "O pacote vai sem o preço.".
- **Pedido:** grava `presente:{sim, msg}`. O pedido no app mostra 🎁 e a mensagem, para quem monta o pacote.
- **Em aberto para o dono:**
  - a mensagem é impressa ou escrita à mão?
  - fora das datas é grátis ou tem um valor?
  - qual a regra de troca para quem ganhou?
- **Esboço:** `esboco-06g-presente.jpg` (Hoje | Proposta fechado | Proposta com "Sim" e mensagem).
