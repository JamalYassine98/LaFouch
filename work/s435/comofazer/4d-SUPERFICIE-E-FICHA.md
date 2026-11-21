# Como fazer 3/3: 149s (superfície, 9 telas) + 134 e 136a (ficha do Inventário) · S435 ESBOCO → APP · 21/11

Resultado esperado: os JS/CSS de 149s, 134, 134b, 134d e 136a em work/kit/base_app.py. Com isto fecham-se os 15 aprovados de Resultados/Preços.

## 149s: Família Superfície, conteúdo sem cartão
O aprovado tira fundo, borda, raio e recuo lateral em 9 telas: Preços, Pendências, Despesas, Reservas, Marketing, Post, Peça (#vDetail),
Lista de compras e Adicionar. O Início fica de fora (vai ser refeito). Hoje a base faz isso tela por tela, com 13 seletores.

**Jeito natural (um lugar só, regra 12c):** a superfície é a regra da classe, não de cada tela.
1. `.card` (style.css:48) passa a ser **bloco de conteúdo plano**: sem fundo, sem borda, sem raio e sem recuo lateral, só espaço em cima e embaixo.
   A linha fina entre os itens vem da linha de lista (`border-bottom: 1px solid var(--line2)`), não do cartão.
2. Quem precisa continuar com caixa (o Início, até ser refeito, e as janelas de baixo, que já têm a própria superfície `lfJanela`)
   usa uma classe com nome do que é, por exemplo `.cxIni`. Ela fica só onde a caixa é de propósito.
   Para achar quem precisa: abrir as 60 telas na v587 com `.card` plano e comparar com a base. Toda diferença fora das 9 telas e do Início vai ao dono com imagem (regra 12d).
3. `.note.n-warn` (11 arquivos) vira **texto de atenção**: amarelo `--warn`, sem caixa e sem ícone de fundo. Mesma classe, regra nova, em todo lugar.
4. Apagar no mesmo passo: o `.g99` de 98z-s374d-padrao.js (o pad99, que só embrulhava cartões para deixá-los parecidos com lista),
   `.mkDtG` (criado pelo mesmo arquivo), o CSS `.card.lcCard`, o `.cntD` com fundo e qualquer `background:var(--panel)` repetido nas 9 telas.
   Com o esboço 37, o pad100 também já saiu, e o 98z-s374d-padrao.js deve ficar vazio: apagar o arquivo.

## 134: Inventário, ficha da peça sem cartão e sem caixas (com 134b e 134d)
Onde nasce cada pedaço:
- Ficha: `10-estoque-detalhe.js` (seção "Catálogo do produto", as linhas `.pl.pick`).
- Abas: `97u-navegacao-s184.js` (`fnAlt`, `fnPn`, `fnAt`).
- Preço: `55-produtos-catalogo.js` (`#precoCard`).
- Site: `64-identidade.js` / `97-site-auto.js` (`#edSite`).
- Fornecedores: `52-lotes.js` (`#lotView`).

O que o aprovado quer:
- Abas Histórico / Site / Preço; links no fim, centralizados; "Adicionar" e "Editar" como **janela de baixo** (lfJanela) com um "Salvar".
- Sem "Fechar sem salvar"; fecha arrastando, tocando fora ou com Esc, e pergunta "Sair sem salvar?" se mudou (regra 15).
- Linhas `.pl.pick` = linha de lista de 44 px (nome à esquerda, valor cinza 13 à direita).
- Rótulos `.lbl` 11 px versalete; "Ver peças ⌄"; lixeira e Editar alinhados ao título (134b).

Jeito natural:
- Com o 149s, os cartões somem sozinhos. Não escrever CSS por id (`#precoCard`, `#edSite`, `#lotView>section.card`).
- `.pl.pick` desenhada como linha de lista na própria função de 10-estoque-detalhe.js. Sai o "· " que hoje é tirado depois (JS do 134).
- `#editModal` (134d): deixa de ser modal próprio e abre com `lfJanela({titulo:'Editar peça', …})`, a mesma janela de todas as outras.
  O botão "Fechar" e o modal velho (HTML e CSS do `#editModal`, `.edFoot`) saem no mesmo passo.
- 134b: a lixeira fica no fim da linha do título, alinhada pelo centro do texto (regra 14 L2), por flex na marcação.
  Hoje um JS mede e corrige `margin-top` com `getBoundingClientRect`; essa conta sai.
- O "fnAt" (links no fim) é colocado no fim pela própria função que desenha a aba. Hoje um JS o move de lugar depois.

## 136a: ficha, "Lucro real" e "De onde vem o preço"
- Onde nasce: `97y-lucro-real.js` (`details.lrcard`) e `97z2-contador.js` (`details.cntP`, cntPrecoHtml).
- O aprovado quer: as duas dobras com o **⌄ do conjunto de ícones** (o mesmo SVG de todas as dobras, que gira ao abrir) no lugar do
  triângulo do navegador; o valor encostado à direita; sem o "·" solto no fim do texto.
- Jeito natural: as duas usam a **mesma dobra do app** (a mesma de `dFold`, ver 4c), e não `<details>` com marcador escondido.
  Se o `<details>` ficar, o `summary` nasce com o ícone e o valor no lugar (marcação), sem o JS que insere `.b136` e sem o regex do "·".

## Trava no porteiro
- Nenhum elemento com `class~=card` com fundo diferente de transparente fora de Início e janelas (as 60 telas).
- `.note.n-warn`: cor `--warn`, sem fundo.
- Ficha: `#editModal` não existe; "Editar" abre `.ljJn`; nenhum "Fechar" na janela; nenhum `.pl.pick` com borda lateral.
- Lucro real e De onde vem o preço: o mesmo ícone de dobra das outras (comparar o `path` do SVG).
- Comparador contra a base nas 9 telas + Inventário › ficha + Fornecedores: 0 diferença sem motivo, claro e escuro, letra 1× e 1,3×.
