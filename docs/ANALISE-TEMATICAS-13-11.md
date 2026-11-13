# Análise das temáticas — 13/11/2026 (S223)

Pedido do dono: analisar tudo nas temáticas (preço, design, cores). Só leitura; nada foi mudado.
Medido em: celular 390 e notebook 1366 · Início, catálogo e peça · 8 estados (padrão, Natal, Halloween, Black Friday, Ano Novo dia, Ano Novo noite, Mães, Pais). Gerador: work/s223/temas.py e t2.py; fotos work/s223/img_*.

## 1. Como cada temática mexe no site

| Temática | Cor de destaque | Bloco Destaque | Cabeçalho | Enfeites animados |
|---|---|---|---|---|
| Padrão | vinho #8d3a69 | branco | rosado | 0 |
| Natal | vermelho #b3263a | verde escuro | creme | 14 (neve) |
| Halloween | laranja #d9651a | roxo quase preto | lilás | 2 |
| Black Friday | vermelho vivo #e11d48 | preto | preto | 0 |
| Ano Novo dia | dourado #a8854a | creme | branco | 10 (brilhos) |
| Ano Novo noite | dourado #a8854a | azul-marinho | azul-marinho | 10 |
| Mães | rosa #b8436f | rosa-vinho | rosado | 10 (pétalas) |
| Pais | bronze #b07a3a | azul-marinho | azulado | 6 |

## 2. Defeitos medidos (contraste texto × fundo; mínimo para ler bem = 4,5:1)

**Graves — não dá para ler / não dá para ver**
1. **Natal:** "Ver modelo" e "Ver catálogo" em vermelho sobre verde = **1,23:1**.
2. **Mães:** "Ver modelo" e "Ver catálogo" em rosa sobre rosa-vinho = **1,27:1**.
3. **Black Friday:** ícone "Mi cuenta" escuro sobre cabeçalho preto = **1,05:1** (some).
4. **Ano Novo noite:** ícone "Mi cuenta" azul sobre cabeçalho azul = **1:1** (some).

**Médios — lê com esforço**
5. Links na cor de destaque ("Ver todos", "Ver catálogo"): Halloween 3,26 · Ano Novo 3,43 (2,94 no Destaque do dia) · Pais 3,38 (3,18 no Destaque) · Black Friday 4,23 (3,63 no Destaque).
6. Enfeites passam por cima de botões e preços (não bloqueiam o toque, mas atravessam o texto): Natal 14, Mães 10, Ano Novo 10, Pais 6. O padrão de movimento proposto era no máximo 1 animação sem fim por tela.

**Vale em todas (já conhecido):** WhatsApp pela metade; Início passa da tela com letra grande (ATLAS §9).

## 3. Preço nas temáticas

- **Início:** o preço segue a cor de texto da temática (quase preto; branco dentro do bloco colorido). Contraste 6,5 a 18:1. Bom.
- **Catálogo e peça:** o preço é sempre o mesmo verde #14803f, em TODAS as temáticas. Contraste 5,0:1 no branco e 4,5–4,7:1 sobre o fundo colorido da página (no limite; passa por ser letra grande).
- **Efeito de design:** o verde vira uma cor a mais em cada temática. Natal = vermelho + verde escuro + verde do preço + vinho do Comprar. Halloween = laranja + roxo + verde + vinho. Black Friday = vermelho + preto + verde + vinho. São 4 cores de destaque na mesma tela.
- **Conclusão:** preço na cor de texto da temática (preto ou quase preto) resolve as 8 de uma vez, sem regra por temática, e iguala Início, catálogo e peça.

## 4. Botões

- **Comprar** é sempre o vinho da marca (#6f2250→#b4528a; branco em cima 4,65 a 10,39:1) em toda temática. Recomendo MANTER: é a âncora da identidade e o cliente sempre acha o mesmo botão.
- **Botão dentro do bloco colorido** usa a cor de destaque sobre um fundo da mesma família → é a causa dos defeitos 1 e 2.

## 5. Juízo de design

- **Pontos fortes:** todas mantêm logo, letras, cartões brancos arredondados e o Comprar vinho — a loja continua reconhecível. Ano Novo dia e Mães são as mais próximas da identidade. O bloco Destaque colorido dá clima sem repintar o site.
- **Pontos fracos:** cor de destaque usada como texto pequeno (dourado, bronze e laranja não têm contraste para isso); enfeites em excesso para um site que quer ser calmo; Black Friday e Ano Novo noite trocam o cabeçalho para escuro e um ícone ficou para trás.
- **Regras que eu proporia (uma vez, valem para as 8):**
  1. Dentro de bloco colorido, texto e botões são claros (branco/creme); a cor de destaque nunca fica sobre fundo da própria família.
  2. Cor de destaque só em enfeite, fio, selo e letra grande; link pequeno usa uma versão escurecida dela (≥ 4,5:1).
  3. Preço = cor de texto da temática. Oferta: antigo riscado cinza, novo na cor de texto, etiqueta pequena na cor de destaque.
  4. Todo ícone do cabeçalho segue a mesma cor (hoje "Mi cuenta" não segue no cabeçalho escuro).
  5. Enfeites: poucos, só no topo/bloco Destaque, nunca atravessando botão ou preço; parar depois de alguns segundos.
  6. Comprar e WhatsApp nunca mudam de cor.

## 6. O que foi e o que não foi testado

- Testado no simulador: 8 estados × 2 aparelhos (390 e 1366) × 3 telas, letra normal, espanhol.
- NÃO testado: temáticas com letra média/maior, em português, nos outros 14 aparelhos, menu/filtros/carrinho/Mochi, celular real. O efeito em venda não foi medido (site ainda fechado).
- Limite da medição: contraste sobre degradê foi calculado contra as cores das pontas do degradê.
