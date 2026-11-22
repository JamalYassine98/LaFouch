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
