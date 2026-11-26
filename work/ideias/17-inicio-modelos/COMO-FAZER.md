# IDEIAS 17 · Início com modelos (desenho de conceito) · esboço pronto — esperando o dono (26/11 13:40; capa de tela inteira 13:50)

Pedido do dono (13:13–13:15): voltar ao assunto principal, o design do site e como ele funcionaria; "faz um esboço para ver como ficaria".
Base que fica: ../16-padrao-luxo/ESTUDO.md (rosé suave, vinho com fio dourado, Fraunces + Inter, #943d6f) e PRINCIPIOS-ELEGANCIA-SEMP.md (critério, não regra). Fotos: as duas do dono (café = campanha; estúdio = vitrine no rosto), em ../16-padrao-luxo/referencias-do-dono/.

## O que muda (feito em cima do site REAL, servido local, catalogo 17f3e97)
1. **Capa de tela inteira (ajuste do dono 13:23, como a Made):** a foto da modelo usando a peça cobre TODA a tela abaixo do topo (altura = tela − topo), com a peça inteira à vista. O texto fica POR CIMA da foto: em cima, o rótulo "DESTAQUE DA SEMANA" e o título em Fraunces com a palavra em itálico (rosé claro); embaixo, uma linha sobre a peça, o botão "Ver a peça" (contorno branco) e os pontinhos das 4 campanhas. Véu escuro suave em cima e embaixo (vinho #1f0d17) só para o texto ler bem. **Tocar em qualquer lugar da capa abre a página da peça** (o mesmo data-open do "Ver modelo" de hoje).
2. **Catálogo:** ao tocar numa peça, aparece a modelo usando a mesma peça (lugar marcado no 1º cartão; a foto vem do Semp quando a peça tiver).
3. **Bloco novo "Veja no rosto"** depois de Mais vendidos: a foto de vitrine no rosto, de ponta a ponta, sobre o rosé suave com luz diagonal; rótulo em maiúsculas espaçadas, título em Fraunces com "muda" em itálico na cor oficial, 2 linhas e "Ver catálogo ›".
4. O resto fica como está: topo, Delivery/Pagamento/Retirada, Compre por categoria, Novidades, Mais vendidos, Comece por aqui (imagens fixas), Para lojistas, Ajuda, rodapé.
- Em datas e na Black Friday de CDE, o destaque vira a edição da data no vinho profundo (12e, como os cupons) — não desenhado aqui.
- Página da peça (não desenhada aqui): vitrine → giro do Estúdio → modelo usando → preço e reserva.

Pranchas: esboco-17-inicio-parte1 (topo até Novidades) · parte2 (Novidades até Comece por aqui), HOJE × PROPOSTA. Gerador: conceito.py.

## Limites deste desenho (conceito, ainda não esboço final)
- Feito sem a nuvem (rede fechada aqui): as camadas de manutenção/sem internet foram tiradas para ver a página; os preços aparecem em R$ porque a página abriu em pt-BR.
- A linha "Acetato rosé com detalhe dourado na haste" descreve a foto: confirmar com a ficha da peça.
- A armação da foto do café parece a BR44140 (rosé, detalhe dourado na haste): **confirmar**. Ela não está no catálogo de hoje, por isso o título do destaque ficou "Armação LaFouch quadrada", sem preço.
- Ainda não passou pelo comparador nem tem todos os aprovados (73 menu, 74 busca, 75 botões, 87 cor oficial no site, 12e): entra quando o dono gostar da direção.
- Achado a conferir: na tela de 390 px a página fica com 406 px de largura (16 px sobrando para o lado), igual em HOJE.

## Como fazer (regra 12), quando aprovado
- O destaque passa a ter dois tipos de foto da mesma peça (campanha do Semp e vitrine); a campanha, quando existe, ocupa a largura toda; sem ela, fica o cartão de hoje.
- Cada peça do catálogo ganha a foto "no rosto" (Semp) como segunda imagem; tocar troca a imagem, no mesmo lugar.
- "Veja no rosto" é um bloco da família de seções do Início, com o fundo rosé suave do padrão, no mesmo arquivo da família.

## Parte 2 de 5 — selos + Compre por categoria (26/11, esboço; esperando o dono)
Arquivo: esboco-17-parte2-categorias.jpg (kit real, Hoje × Proposta). Gerador: parte2.py → parte2.js (inject do kit).
- Selos: ficam como estão (já são da família).
- 3 categorias como o site real: Solar · Leitura · Armações (dono 26/11 13:57: "esqueceu dos óculos de grau").
- Cartões de categoria: MESMO componente de hoje (cartão branco, arredondado, borda, rótulo Fraunces). Só a imagem muda:
  a modelo usando a peça, ocupando o topo do cartão em 3:4 (object-fit cover, foco 50% 20%). Solar: espera foto do Semp.
- Capa (parte 1): peça própria fora do #hdst (o carrossel antigo segue escrevendo nele); sangra só o recuo da coluna da página.
- Como fazer (regra 12): proporção 3:4 numa regra só do .hci das categorias; a imagem da categoria vem do Semp (campanha), não da peça.
- Designer do kit: nada novo além de "tampado" pelo botão do WhatsApp ao rolar (o WhatsApp já aparece "cortado" hoje — problema do site todo)
  e contraste da capa (falso: mede o texto contra o fundo da página, não contra a foto com o véu).

### 2b (dono 26/11 14:01: "3 colunas espremem as fotos"; "não só mulheres: separar feminino e masculino")
- Fileira 1: Feminino | Masculino — 2 cartões grandes (filtros reais do menu gen:f / gen:m; contagem conta unissex nos dois).
- Fileira 2: Solar · Leitura · Armações — desliza para o lado; cartão = (largura − 16)/2,4, a ponta do próximo mostra que desliza.
- Todos os cartões = o mesmo .hcat a do site (clonado), foto 3:4. Espaço entre as fileiras 16.
- Novidades e Mais vendidos com Feminino/Masculino: fica para a parte 3.

### 2c (dono 26/11 14:51 "Sim" à direção do ESTUDO.md §8) — substitui a 2b
- Feminino | Masculino = campanha: foto no cartão inteiro (3:4, arredondado 18 do .hcat), sem caixa/faixa/contagem; nome Fraunces 24 branco
  sobre o véu da capa (40% de baixo). Filtros reais gen:f / gen:m.
- Solar · Leitura · Armações = os cartões de hoje (a peça limpa), logo abaixo, 16 de espaço. Alterna tipo e tamanho de imagem.
- Masculino: espera a foto do Semp.
