# IDEIAS 08f · menu do celular (C ou A) + topo do PC com links + idioma no rodapé · esperando o dono

**08c (22/11 21:43):** o dono recusou A (32 px) e B (fotos) por serem gritantes, e apontou a base errada: o Black Friday estava em vermelho, e a temática mais nova (06d/06e) é preta. Agora a base é /tmp/a6fe (06 + 06d/06e). Variantes novas:
- **C:** o menu de hoje, só sem o que não vende; as ferramentas na letra do corpo.
- **A suave:** Fraunces 24 px, sem linhas e sem setas; gênero e ferramentas em 15 px, em cinza ou no corpo.

A B saiu (foi para work/obsoletos/ideias-08/).

**08e (22/11 22:02):** o dono mostrou o menu da Madë no celular: uma letra só, um tamanho só, sem variação. A variante E (a que vale agora) segue isso:
- tudo na letra do corpo, com 17 px, peso normal e a cor do texto;
- sem linhas, sem rótulos e sem setas; cada linha com 56 px;
- os grupos se separam por 24 px de espaço (tipos · gênero · ferramentas · Atacado).

C, A suave e D foram para work/obsoletos/ideias-08/. **Decisão do dono:** a regra 16 diz que "›" quer dizer "sai daqui". A Madë não usa seta nos links diretos, e a E segue a Madë.

Estudo: REFERENCIAS.md (Madë, Gentle Monster, Jacques Marie Mage, Oliver Peoples). Base do esboço: a temática mais nova (/tmp/a6fe = 06 + 06d/06e).
Pintura só do esboço: pinta8.js (variante em `window.__l8v`). A versão anterior (08) foi para work/obsoletos/.
A identidade não muda: Fraunces, fundo creme, vinho só em "Ofertas", linhas finas.

## Comum (celular)
- **Saem do menu:**
  - o cartão da conta, porque a conta já está no topo;
  - os rótulos Comprar, Ferramentas e Para lojistas;
  - a seção Ajuda, que já está no rodapé;
  - o endereço e os termos, que já estão no rodapé;
  - o Idioma, que já é automático.
- **Fica no fim do menu:** "Atacado ›" em letra pequena e cinza.
- **Rodapé:** "Idioma: Português ›" numa linha pequena, logo abaixo de Termos · Privacidade. Abre a mesma escolha de idioma de hoje.

## A · palavras grandes
- Solar · Leitura · Armações · Ofertas em Fraunces 32 px, sem linhas e sem setas, com 8 px entre elas. Ofertas em vinho.
- Feminino · Masculino · Unissex numa linha de texto cinza, com 16 px e 24 px entre eles.
- Descubra o seu formato e Descubra o seu grau na letra do corpo com 16 px, 48 px abaixo.

## B · cartões com foto
- Solar, Leitura e Armações viram cartões brancos (cantos de 16 px, borda fina), com a foto de uma peça nossa à esquerda e o nome em Fraunces 24 px.
- Embaixo dos cartões: Ofertas em vinho, a linha Feminino · Masculino · Unissex de hoje e as duas ferramentas em letra do corpo.
- A foto de cada cartão vem do catálogo (a primeira peça com foto daquele tipo), sem escolha à mão.
- Hoje não há peça de leitura com foto: no esboço o cartão de Leitura usa uma armação.

## PC (900 px ou mais)
- **Topo:** sem ☰. Os links Solar · Leitura · Armações · Ofertas · Descubra ficam no centro (letra do corpo, 15 px). Só "Descubra" abre uma janelinha, com Seu formato · Seu grau.
- **À direita:** lupa · conta · sacola. A conta volta para o topo do PC, o que muda o topo aprovado no 05.
- **Janelinha:** cartão branco, borda fina, cantos de 12 px, sombra leve. Entra com a curva única.

## Jeito natural
- Montar o menu já enxuto no código que o desenha e apagar os blocos que saem e o CSS deles (no esboço foram só escondidos).
- No PC, não montar o ☰ nem a gaveta do menu.
- O seletor de idioma passa a ser montado no rodapé, e não no menu.

## Argus
- Cada link do topo do PC abre a vitrine certa.
- A janelinha cabe na tela.
- As linhas e os cartões do menu têm pelo menos 44 px de altura.
- "Idioma: Português ›" cabe numa linha (L4).

## 08f · menu do celular com 5 itens (22/11 22:07) — a variante que vale
- **Por quê:** o luxo da Madë vem de ter pouca coisa (5 itens) e muito espaço, não da letra. A E tinha 10 itens.
- **Itens:** Solar · Leitura · Armações · Ofertas · Descubra ›. Letra do corpo 17 px, peso normal, linhas de 60 px, sem linhas e sem setas; só o "Descubra" tem ›, porque abre por dentro.
- **Descubra:** abre no próprio menu com "‹ Descubra", Seu formato e Seu grau (os mesmos nomes da janelinha do PC).
- **Feminino · Masculino · Unissex:** saem do menu, porque já são abas da vitrine.
- **Atacado:** preso no pé do menu, com ícone de loja, como o Login da Madë.
- **Jeito natural:** o menu é montado só com esses itens; o "Descubra" é um sub-nível do mesmo menu (a mesma camada, sem tela nova), voltando com "‹ Descubra". Sai do código tudo o que foi escondido.

## 08f · sem evento + rodapé (22/11 22:14)
- **Sem evento:** fotos tiradas com a configuração sem data ativa (o relógio do esboço foi para 02/03/2027, por isso aparece "© 2027"). O menu F fica igual, em preto e creme.
- **Rodapé:** ganha a coluna **Descubra** (Seu formato · Seu grau), com as mesmas palavras do menu e do topo do PC.
  - **PC:** 4 colunas, marca · Comprar · Descubra · Ajuda.
  - **Celular:** Comprar à esquerda; Descubra e, embaixo dela, Ajuda à direita.
  - **Em todos:** "Idioma: Português ›" logo abaixo de Termos · Privacidade.
- **Achado:** sem evento, a faixa do topo aparece como uma linha preta vazia. Vem da base do esboço 06 (`#evbar{background:var(--act,#141414)}`) e não do site do ar. Na implementação, a faixa só existe quando há evento.

## 08g · a F com a letra da marca (22/11 22:43)
- **Itens:** os 5 itens (e Seu formato · Seu grau) em **Fraunces peso 400, 20 px**, todos iguais. O resto é igual à F: sem linhas, sem rótulos, só o "Descubra" com ›, Atacado preso no pé e fundo branco sem evento.
- **Fonte:** o site hoje pede a Fraunces só nos pesos 500 e 600. A G precisa do 400 no mesmo pedido de fontes (`wght@9..144,400;9..144,500;9..144,600`), e não de um arquivo à parte.
- **ACHADO no simulador:** a cópia de teste (`03-bugs-site/abas_video.py`) servia o arquivo da Fraunces **600 para todos os pesos**, então todos os esboços mostravam a Fraunces mais pesada do que o site do ar. Desde o 08g, as fotos usam os arquivos reais 400, 500 e 600 (pasta `fontes/`, licença OFL), carregados por `semev.py`.

## 08h · onde fica o idioma no rodapé (22/11 22:49) — 3 propostas, esperando o dono
- **A · faixa de baixo:** no PC, o globo e "Português ›" ficam à esquerda e Termos · Privacidade · © à direita (como a Oliver Peoples). No celular, uma linha própria acima dos termos.
- **B · bloco da marca:** o globo e "Português ›" logo abaixo de "Como chegar ›".
- **C · coluna própria:** coluna "Idioma" ao lado de Ajuda, com "Português" (o atual, em negrito) e "Español".
- A linha antiga ("Idioma: Português ›" embaixo dos termos) sai, porque parecia parte dos termos (dono).
- Pranchas: esboco-08h-idioma-celular.jpg e esboco-08h-idioma-pc.jpg (sem evento, fundo branco, fonte real).

## 08i · animação do rodapé, "subindo" (22/11 22:53) — esperando o dono
- **O dono escolheu a A** para o idioma (globo + "Português ›" à esquerda e termos à direita no PC; no celular, uma linha própria acima dos termos).
- **Animação:** quando o rodapé entra na tela (15% visível), cada bloco sobe 16 px e clareia, um depois do outro (70 ms entre eles): marca, Comprar, Descubra, Ajuda e a faixa de baixo.
  - Usa a mesma curva e o mesmo tempo das camadas aprovados no 05 (`cubic-bezier(.16,1,.3,1)`, 420 ms): uma curva só no site, regra 17.
  - Roda uma vez por visita. Com "reduzir movimento", o rodapé aparece direto.
- **Jeito natural:**
  - um único observador de "entrou na tela", que serve para qualquer bloco que precise aparecer assim (uma regra num lugar só);
  - sem esconder nada antes do JS carregar (o estado inicial é posto pelo próprio JS);
  - a função `prepara()` do esboço vira a função do site.
- **Argus:**
  - sem o JS ou com "reduzir movimento", o rodapé aparece inteiro e visível;
  - a animação roda uma vez só.
- **Vídeos:** esboco-08i-rodape-celular.mp4 e esboco-08i-rodape-pc.mp4 (HOJE parado × PROPOSTA subindo).

### 08i v2 (22/11 23:08) — igual à Madë, em dois tempos (substitui o "subindo")
- **Medido no vídeo do dono:** a Madë não faz o rodapé subir. O rodapé inteiro aparece clareando (≈0,45 s) e, logo depois, o conteúdo aparece por dentro.
- **Nosso rodapé (visual não muda):**
  1. o `.lfft` vai de opacidade 0 a 1 em 450 ms;
  2. o conteúdo (`.in` e `.fbt`) faz o mesmo, começando 250 ms depois.
- Sem deslocamento, com a curva do site, uma vez por visita. Com "reduzir movimento", aparece direto.
- O "subindo" (v1) foi para work/obsoletos/ideias-08/.

### 08h2 (22/11 23:15) — faixa de baixo alinhada (o dono achou os termos desalinhados)
- **Causa:** na A, só a linha dos termos foi para a direita, e o reCAPTCHA ficou centrado embaixo dela: dois eixos no mesmo bloco, contra a regra L1.
- **Jeito natural:** a faixa de baixo é um bloco com duas margens.
  - No PC, o idioma fica na margem esquerda; os termos e o reCAPTCHA ficam juntos na margem direita, alinhados à direita.
  - No celular, tudo fica centrado.
- **Argus:** na faixa de baixo do PC, a borda direita dos termos e a do reCAPTCHA ficam na mesma posição (1 px).
- **Corrigido pelo dono (22/11 23:17):** a faixa de baixo fica CENTRADA em todos os aparelhos. Um embaixo do outro: "Português ›" (com o globo), Termos · Privacidade · ©, reCAPTCHA. A versão "idioma à esquerda, termos à direita" foi recusada.

## 08j · abrir busca, Minha conta e carrinho no pacote final (22/11 23:28)
- **Vídeos:** esboco-08j-camadas-celular.mp4 (lado a lado) e esboco-08j-camadas-pc.mp4 (um em cima do outro). Sem evento, fundo branco, fonte real.
- **ACHADO:** no PC, depois de fechar o carrinho, o desfoque do fundo ficava preso na tela. Aparece também no HOJE (a base aprovada do 05 v2).
  - **Causa:** a mesma do 05d. O carrinho saía por um "fantasma" (`#lfGhost`) fora da camada e escapava do movimento único, então o fundo nunca recebia o "fechar".
  - **Conserto no esboço:** só a parte "a camada sai no lugar" do 05d. A curva e o tempo continuam os aprovados. Vale para o PC e para o celular.
- **No PC da proposta:** a conta abre pelo ícone novo do topo (o ☰ saiu). No HOJE, ela só abria pelo cartão dentro do menu.

## 08k · as camadas vêm do LADO DO BOTÃO, com assinatura da La Fouch (22/11 23:34) — esperando o dono
- **Uma regra só, no lugar do "cresce do botão" (05) e do 05d:** a camada vem do lado do botão tocado.
  - **Celular:** ☰ e conta ficam à esquerda (camada entra pela esquerda); lupa e sacola ficam à direita (entra pela direita).
  - **PC:** lupa, conta e sacola ficam à direita (tudo entra pela direita).
  - A camada sai da borda da tela daquele lado, qualquer que seja a largura dela.
- **Entrada e saída iguais:** 0,7 s, com a mesma curva nos dois sentidos (`cubic-bezier(.165,.84,.44,1)`: rápida no começo e pousando devagar), pelo mesmo caminho. O fundo do PC escurece e clareia no mesmo ritmo.
- **Assinatura da loja** (o dono pediu algo nosso, não cópia da Madë ou da Apple):
  1. **O fio:** uma linha de 2 px no vinho da marca (`var(--ac)`) na borda que vem na frente. Ela some quando a camada assenta, como o filete das nossas embalagens.
  2. **Os dois tempos:** a camada chega primeiro e o conteúdo aparece 250 ms depois (450 ms), igual ao rodapé. Na saída, o conteúdo some primeiro (200 ms) e a camada vai depois.
- **Técnico:**
  - O movimento usa a propriedade `translate`, e não `transform`, porque as regras das camadas têm `transform:none!important`, que bloqueia animação de transform.
  - A visibilidade do `#drw` espera 0,7 s para sumir.
- **Com "reduzir movimento":** abre e fecha direto.
- **Vídeos:** esboco-08k-lado-celular.mp4 e esboco-08k-lado-pc.mp4 (HOJE × PROPOSTA). Script: lado.py (cópia /tmp/a8k).

## 08l · parte 1: a busca só busca + o padrão da linha de peça (22/11 23:45) — esperando o dono
- **Saem da busca:** a frase "Busque pelo nome ou pelo código da peça." e "Ou veja por categoria" (Solar, Leitura, Armações, Ofertas, Atacado). As categorias já estão no menu G.
- **Campo vazio:** "Mais procurados", com 4 peças.
  - Visual: o rótulo na letra do corpo, 13 px cinza, alinhado com a foto das linhas.
  - Usa a mesma linha de peça dos resultados, montada pela mesma função (no esboço, as linhas foram copiadas da própria busca).
  - Quais peças: no site, as 4 mais vistas ou vendidas (Semp). No esboço, as 4 primeiras do Destaque automático (cfg.dauto).
- **Padrão da linha de peça (uma regra para todas as camadas):** nome em Fraunces 400, 17 px; código na letra do corpo, 13 px cinza; preço na letra do corpo, 15 px sem negrito.
- **"Ver todos os N resultados":** preso no pé da lista (sticky), sempre à vista. O nome em Fraunces deixou a linha mais alta, e o botão ficava cortado.
- **Pintura:** pinta9.js (entra em /tmp/a8k pelo lado.py). Prancha: esboco-08l-busca-celular.jpg.
- **Parte 2 (depois):** Minha conta e carrinho no mesmo padrão.
- **08l v2 (22/11 23:53) — busca vazia = UM bloco por vez (C).** O "Mais procurados" saiu: com os "vistos" ao lado, ficava contraditório (dono). Referências: Dior ("Trending" + "Search for") e Apple (atalhos em texto).
  - **Quem já viu peças:** "Vistos por último", com as 3 fotos que o site já guarda no aparelho (`lf_vistos`, até 6, `srVistos()`). Só o rótulo muda: sai a caixa-alta vinho e entra o rótulo padrão.
  - **Quem ainda não viu:** "Em alta", com 4 palavras em Fraunces 17 px (Redondo · Gatinho · Quadrado · Hexagonal). Tocar preenche a busca e mostra os resultados. No site, as palavras vêm do que mais se busca (Semp); no esboço, são formatos com peças.
  - **Rótulo padrão dos dois blocos:** letra do corpo, 13 px, cinza, alinhado com o conteúdo.
- **08l v3 (22/11 23:57):**
  - **Em alta:** tocar numa palavra faz o mesmo caminho do "Ver todos os N resultados". A busca fecha e o catálogo abre filtrado, com a etiqueta `"Gatinho" ×` (o botão também é `data-soall`, então é o mesmo código, sem caminho novo).
  - **Vistos por último:** passa a usar a mesma linha de peça dos resultados (foto, nome em Fraunces, código e preço), no lugar das 3 fotinhas soltas. No site, `srVistos()` monta as linhas com a mesma função dos resultados.
- **08l v4 (23/11 00:01):**
  - **Uma margem para a camada da busca inteira (L1):** o campo, os rótulos, as fotos dos vistos e as palavras de "Em alta" começam na mesma linha, a 16 px da borda (antes: 13 · 6 · 15 px). Medido: todos a 15,4 px na tela de 390 (zoom 0,96).
  - **Sai do Início o "Você estava vendo"** (`.hlv`, item 4 da "Navegação 2" de 08/11), porque a busca já mostra os vistos por último (dono).
    - **Apagar:** o embrulho `homeHtml` do `.hlv`, o CSS `.hlv*`, e `NAV_ST`, `lf_vis2` e `lf_uact` se nada mais usar.
    - **Fica:** `lf_vistos` / `navVistos()` (usados pela busca e pelo pedido de atacado).
- **08l v5 (23/11 00:15):**
  - **"Ver todos os N resultados"** vira um link discreto no fim da lista, no mesmo estilo do "Ver catálogo ›" do Início (`.p2`: texto vinho, 15 px, sem fundo e sem caixa, com ›). Não cobre mais nenhuma peça.
  - **A lista usa a altura que sobra na tela:** no celular, sai o limite fixo de 520 px do `#sores` e a camada inteira rola. O limite escondia o fim da lista mesmo com tela livre embaixo. O `position:sticky` da v1 saiu.

## 08m · parte 2: Minha conta e carrinho no padrão (23/11 00:22) — esperando o dono
- **Sem caixa por fora:** a conta não fica mais dentro de um cartão com borda. O conteúdo fica direto na camada, com a margem de 16 px da busca.
- **Título da tela:** Fraunces 400, 28 px ("Minha conta", "Seu carrinho"). O "· 2 itens" vai em corpo 15 cinza.
- **Abas da conta:** iguais às da vitrine. Texto 15 px cinza; a ativa fica escura e sublinhada no vinho. Saem a pílula vinho e a "pílula que desliza" (`.lfTk b`, `.lfPt`).
- **Campos em linhas finas (regra 15):** rótulo em corpo 13 cinza; o campo é só a linha de baixo, que fica vinho no foco. Saem as caixas.
- **Pedidos:** linhas separadas por um fio, sem cartões. O número do pedido vai em Fraunces 17. A situação vira texto pequeno, sem pílula: verde = pago, vermelho = cancelada.
- **Carrinho:** cada peça é a linha de peça padrão, sem cartão. O nome vai em Fraunces 17; código, "por unidade" e "Subtotal" em corpo 13 cinza; subtotal e total em corpo, sem negrito e sem verde.
- **Botões:** o principal ("Prosseguir com o pagamento", "Salvar") usa o vinho da marca, não o verde (regra 17: verde = certo, vinho = ação). O secundário ("Continuar comprando") é um link discreto.
- **Comparador (celular · Minha conta, Carrinho, Meus pedidos; base = pacote aprovado /tmp/a8g):** 0 falha nova.
- **Pranchas:** esboco-08m-conta-celular.jpg e esboco-08m-carrinho-celular.jpg. Pintura: pinta10.js.

## 08k2 — Minha conta (e Entrar) com a MESMA camada na entrada e na saída (dono 23/11 11:17) · esboco-08k2-lado-celular.mp4 (Hoje = 08k como foi enviado × Proposta)
Causa (medida no simulador): (1) o botão da conta (#contabtn) não estava na lista dos botões que abrem camada ('#mnb,#sbtn,#bagbtn'), porque era escondido no celular antes do 08g → a camada não sabia o lado, o ✕ não ia para o botão e tocar nele não fechava; (2) a conta/Entrar ("scrim.pg.acc/.auth", no centro) abria por outro caminho: o painel subia 10 px em 0,28 s (CSS pgrise) e a mcEntra subia os blocos um a um; só a saída passava pela camada (lado, 0,7 s).
Jeito natural: #contabtn entra na MESMA lista (origem + ✕ + fechar com history.back, igual ao carrinho); TODA camada do #layer abre pela camada() (o MutationObserver do #layer chama a camada quando entra uma .scrim.pg que ainda não animou); saem o pgrise das camadas e a mcEntra da primeira abertura. Pintura: pinta13.js + lado2.py (/tmp/a8m :8764).
