# IDEIAS 06 · Referências: como as gigantes do Paraguai e as marcas de luxo tratam as datas (22/11)

## Paraguai
- **Cellshop:** deu ao Black Friday o nome e a cor da própria marca: "Blue Friday" (20–23/11), com sorteio de um carro. É a maior campanha do ano da loja.
  - Lição: **a data veste a marca, e não a marca veste a data.**
- **Nissei:** o site mantém a cor da marca (amarelo `#fcb800`). O evento aparece numa **faixa no topo** ("Vení al Black Friday CDE…") e nos banners.
  - Tem um mascote/avatar, o TEN, que conduz as campanhas e os sorteios. É o mesmo papel do nosso Mochi.
- **Monalisa (luxo em CDE):** foco em marcas e na experiência, e não em pintar a loja.

## Luxo
- Cartier, Tiffany, Louis Vuitton, Hermès, Gucci e Prada **não fazem Black Friday**: desconto apaga a exclusividade.
- No Natal, a Cartier não muda as cores do site. Ela troca o conteúdo:
  - um **guia de presentes** ("Wishlist for Her / for Him");
  - um filme da campanha com o mascote dela, a pantera;
  - avisos práticos ("peça até 23/12 para chegar antes do Natal");
  - a **embalagem vermelha icônica** como símbolo.
- **Gentle Monster (óculos):** cada coleção vira um filme e uma campanha com foto forte; o site em si é neutro.

## O que isso quer dizer para a La Fouch (molde único para TODA data)
1. O site fica sempre com a identidade La Fouch (IDEIAS 06).
2. Toda data usa o mesmo molde, com 4 peças:
   - a **faixa** com a mensagem e o prazo;
   - **uma cor de acento**;
   - o **Mochi com o chapéu da data** (o nosso TEN/pantera);
   - o **Destaque Campanha**: foto da data e uma **seleção da data** ("Para ela", "Para ele", "Presentes até G$ 200.000"), como o guia de presentes da Cartier.
3. Na Black Friday, ter um nome próprio da casa, como fez a Cellshop. Por exemplo "La Fouch Week" ou "Semana Fouch". O nome fica para o dono escolher.
4. Os avisos práticos ficam na faixa ("retirada no mesmo dia", "peça até X para chegar").

## Parte 2 · Movimento e palavras (22/11 15:06)
### O site hoje
- O destaque de evento **já existe** (`EVD` em lf-site.js). Cada data tem `lab`, título com `<em>`, subtítulo e um 2º botão (`b2`):
  - Natal, Mães e Pais: "Ver presentes";
  - Halloween: "Ver a seleção";
  - BF: "Ver ofertas";
  - Ano Novo: "Ver catálogo".
- Logo, o Destaque Campanha deve ser **esse mesmo destaque transformado**, e não um bloco novo (regra 12).
- O site já usa uma curva só (`.16,1,.3,1`). O efeito da data hoje é `fx()` (partículas, 10 s).

### Luxo
- **Câmera lenta dá sensação de luxo:** estudo de Jung & Dubois (2023, Journal of Marketing Research). Sites de luxo usam fades longos.
- **O movimento da página inicial é a campanha:**
  - vídeo de desfile (Prada);
  - vídeo lento com close no produto (Richard Mille);
  - fotos que se dissolvem devagar (~1,2 s, "corte de cinema") com aproximação lenta e texto coreografado.
- **Botões:** verbos de experiência ("Descobrir", "Explorar") e específicos sobre o que se vai ver ("Shop New Arrivals"), nunca genéricos.
- **Não consultado:** os sites da Oliver Peoples e da Gentle Monster. A leitura precisava de uma permissão que ficou sem resposta.
