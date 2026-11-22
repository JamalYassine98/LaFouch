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
