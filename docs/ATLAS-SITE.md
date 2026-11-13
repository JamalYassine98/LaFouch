# Atlas do site lafouch.com (medido em 13/11/2026)

Memória para esboços: NÃO inventar tela do zero. Medidas reais do site, em 16 aparelhos × 6 telas, parado e em movimento.
Gerar de novo: `python3 work/atlas/atlas.py 0 16 && python3 work/atlas/atlas.py junta && python3 work/atlas/relato.py` · dados: `work/atlas/atlas.json` · fotos reais: `work/atlas/img/<tela>_<largura>.jpg` (320, 390, 844, 768, 1366, 2560).
Limites: só tema claro padrão, idioma espanhol, letra normal, produtos de teste. Sem temáticas, sem letra maior, sem celular de verdade.

## 1. Padrão por aparelho (como o site se arruma hoje)

| Aparelho | Topo (alt.) | Vitrine Início | Catálogo | Margem | Título peça | Comprar na 1ª tela | ☰ |
|---|---|---|---|---|---|---|---|
| celular pequeno 320x568 | 62 | 2 col × 130 px | 2 col × 142 px | 13 | 30 px | NÃO | sim |
| celular 360x640 | 69 | 2 col × 147 px | 2 col × 160 px | 14 | 30 px | NÃO | sim |
| celular alto 360x800 | 69 | 2 col × 147 px | 2 col × 160 px | 14 | 30 px | NÃO | sim |
| iPhone 390x844 | 74 | 2 col × 159 px | 2 col × 174 px | 15 | 30 px | NÃO | sim |
| notebook 1366x768 | 77 | 4 col × 301 px | 4 col × 321 px | 16 | 43.712 px | NÃO | sim |
| notebook grande 1536x864 | 87 | 4 col × 317 px | 4 col × 362 px | 16 | 49.152 px | sim | sim |
| monitor 1920x1080 | 109 | 4 col × 317 px | 4 col × 295 px | 16 | 52 px | sim | sim |
| monitor 2K 2560x1440 | 109 | 4 col × 317 px | 4 col × 402 px | 16 | 52 px | sim | sim |
| celular grande 412x915 | 78 | 2 col × 169 px | 2 col × 184 px | 16 | 30 px | NÃO | sim |
| iPhone Max 430x932 | 82 | 2 col × 176 px | 2 col × 192 px | 17 | 30 px | NÃO | sim |
| celular deitado 844x390 | 77 | 4 col × 174 px | 3 col × 262 px | 16 | 33.76 px | NÃO | sim |
| tablet pequeno 600x960 | 82 | 2 col × 260 px | 3 col × 182 px | 17 | 30 px | NÃO | sim |
| iPad em pé 768x1024 | 92 | 4 col × 159 px | 3 col × 233 px | 19 | 30.72 px | NÃO | sim |
| iPad Air em pé 820x1180 | 92 | 4 col × 160 px | 3 col × 250 px | 19 | 32.8 px | NÃO | sim |
| iPad deitado 1024x768 | 92 | 4 col × 211 px | 4 col × 232 px | 19 | 32.768 px | NÃO | sim |
| notebook pequeno 1280x720 | 77 | 4 col × 281 px | 4 col × 300 px | 16 | 40.96 px | NÃO | sim |

## 2. Falhas com a tela parada (quantas telas × aparelhos)

| Regra | Telas | Onde (exemplos) | Exemplo |
|---|---|---|---|
| toque<24 | 40 | celular pequeno 320x568 inicio; celular pequeno 320x568 catalogo; celular pequeno 320x568 peca | 1 / 2 |
| toque<40 | 32 | celular pequeno 320x568 inicio; celular pequeno 320x568 catalogo; celular pequeno 320x568 peca | Menú / Buscar |
| letra<11 | 30 | celular pequeno 320x568 inicio; celular pequeno 320x568 catalogo; celular pequeno 320x568 peca | DESTACADO DE LA SEMANA / Delivery |
| fileira torta | 26 | notebook 1366x768 catalogo; notebook 1366x768 peca; notebook 1366x768 filtros | Comprar (57 px) |
| texto cortado | 17 | celular pequeno 320x568 catalogo; celular pequeno 320x568 peca; celular 360x640 catalogo | LLEGÓ ESTA SEMANA / Armazón de acetato morado |
| tampado | 17 | celular pequeno 320x568 peca; celular 360x640 peca; celular alto 360x800 peca | Inicio ← Armazones |
| apagado | 11 | celular pequeno 320x568 inicio; celular 360x640 inicio; celular alto 360x800 inicio | Hablar por WhatsApp |
| colados | 10 | celular pequeno 320x568 inicio; celular 360x640 inicio; celular alto 360x800 inicio | 1 / 2 |
| cortado | 9 | celular pequeno 320x568 inicio; celular 360x640 inicio; celular alto 360x800 inicio | Hablar por WhatsApp |

## 3. Falhas que só aparecem em MOVIMENTO (depois de rolar e parar)

| Regra | Telas | Onde (exemplos) | Exemplo |
|---|---|---|---|
| fileira torta | 29 | celular pequeno 320x568 inicio; celular pequeno 320x568 catalogo; celular 360x640 inicio | Solar cuadrado dorado (12 px) |
| toque<24 | 9 | celular pequeno 320x568 menu; celular 360x640 menu; celular alto 360x800 menu | Ver todos › |
| tampado | 21 | celular pequeno 320x568 inicio; celular pequeno 320x568 catalogo; celular 360x640 inicio | 1 ← La Fouch, todo en lentes / 2 ← La Fouch, todo en lentes |
| apagado | 25 | celular pequeno 320x568 catalogo; celular 360x640 catalogo; celular alto 360x800 catalogo | Hablar por WhatsApp |
| texto cortado | 11 | celular pequeno 320x568 inicio; celular 360x640 inicio; celular alto 360x800 inicio | Armazón de acetato morado / Armazón redondo rosa |
| letra<11 | 2 | iPhone 390x844 inicio; iPhone 390x844 peca | Delivery / Pago seguro |
| cortado | 1 | celular deitado 844x390 inicio | Hablar por WhatsApp |
| colados | 1 | celular deitado 844x390 inicio | 2 / 3 |

## 4. Movimentos do sistema

- Animações e transições longas (> 0,45 s) vistas: anim hdkb 6.2s 1 (96 telas); trans 0.6s opacity, transform (96 telas); anim ring 3s infinite (64 telas); anim pgrise 0.28s 1 (32 telas); anim hlvIn 0.5s 1 (32 telas); anim pop 0.5s 1 (16 telas); anim cadf 0.2s 1 (16 telas); anim cadp 0.42s 1 (16 telas); anim cadd 0.6s 1 (16 telas); anim cadd 0.4s 1 (16 telas); anim rise 0.6s 1 (15 telas); anim imgin 0.7s 1 (15 telas); anim ulinp 1.6s infinite (14 telas)
- Pulo de layout ao rolar (CLS > 0,05; bom é < 0,1): notebook grande 1536x864 menu = 0.15; notebook 1366x768 menu = 0.135; monitor 1920x1080 menu = 0.125; notebook pequeno 1280x720 menu = 0.11; celular pequeno 320x568 peca = 0.109; celular pequeno 320x568 carrinho = 0.109; celular 360x640 peca = 0.107; celular 360x640 carrinho = 0.107
- Cabeçalho muda de posição ao rolar em: nenhuma tela (fica sempre fixo)
- WhatsApp parado fora da tela ou meio transparente em: celular alto inicio, celular deitado inicio, celular grande inicio, celular inicio, celular pequeno inicio, iPad Air em pé inicio, iPad em pé inicio, iPhone Max inicio, iPhone inicio, tablet pequeno inicio — 10 combinações
- Voltar da peça devolve a posição da lista? celular pequeno: -134→-134 ok; celular: -116→-116 ok; celular alto: -116→-116 ok; iPhone: -101→-101 ok; notebook: 14→14 ok; notebook grande: 79→79 ok; monitor: 239→239 ok; monitor 2K: 239→239 ok; celular grande: -91→-91 ok; iPhone Max: -81→-81 ok; celular deitado: -93→-93 ok; tablet pequeno: -78→-78 ok; iPad em pé: -52→-52 ok; iPad Air em pé: -52→-52 ok; iPad deitado: -5→-5 ok; notebook pequeno: -19→-19 ok
- Telas em que a roda/dedo não rolou nada: celular pequeno 320x568 peca, celular 360x640 peca, notebook 1366x768 peca, notebook grande 1536x864 peca, monitor 1920x1080 catalogo, monitor 1920x1080 peca, monitor 2K 2560x1440 catalogo, monitor 2K 2560x1440 peca

## 5. O que o designer sabe (work/kit/olho.js — roda em todo esboço, parado e depois de rolar)

| Regra | O que olha | De qual falha nasceu |
|---|---|---|
| cortado | clicável aparecendo pela metade na borda | WhatsApp pela metade (dono, 13/11) |
| apagado | clicável meio transparente | WhatsApp a 92% |
| largura | página mais larga que a tela | regra geral |
| tampado | clicável coberto por algo fixo/flutuante | minha proposta "WhatsApp sempre inteiro" tampava "Ver todos" |
| toque<24 / toque<40 | alvo pequeno para o dedo | auditoria (bolinhas 8×8) |
| colados | centros de dois alvos a menos de 24 px | minha proposta de área de 44 nas bolinhas se sobrepunha |
| texto cortado | texto com "…" | nomes cortados nos cartões (piorou no S215) |
| letra<11 | letra menor que 11 px | auditoria |
| texto sobre texto | dois textos ocupando o mesmo lugar | fiscal de 10/11 (título em cima do voltar) |
| fileira torta | cartões lado a lado com alturas ou preços desalinhados | preços desalinhados (S209/S214) |
| barras fixas | cabeçalho+rodapé fixos ocupando > 25% da tela | minha barra de categorias quase dobrou o cabeçalho |
| imagem quebrada | foto que não carregou | regra geral |

Regras de conduta do designer (não são medidas, são decisões do dono): ver docs/DESIGN-SITE-E-APP.md — identidade primeiro; não poluir; filtros enxutos; não mudar Ver modelo nem Comprar; um arquivo por tela; testar o que propõe ANTES de mandar (rodar olho.js no esboço e comparar com o "hoje": a proposta não pode criar falha nova).

## 6. Leitura do designer (o que os números dizem)
- PADRÃO QUEBRADO entre aparelhos: no tablet e no celular deitado a vitrine do Início e o catálogo usam colunas diferentes (600: 2 × 3; iPad: 4 × 3; celular deitado: 4 × 3). No monitor 1920 o cartão do catálogo (295 px) é MENOR que no notebook grande (362) e no 2K (402). O topo vai de 62 a 109 px sem uma regra clara.
- Comprar fica fora da 1ª tela em 13 de 16 aparelhos (todos os celulares e tablets e notebooks até 1366). Decisão do dono: Comprar não acompanha a rolagem — então o que pode subir é o conteúdo acima dele.
- WhatsApp fora da tela ou meio transparente, parado, no Início de 10 dos 16 aparelhos (todos os celulares e tablets).
- Pulo de layout: abrir o ☰ no PC (0,11–0,15) e a peça no celular pequeno (0,109) passam do limite bom (0,1).
- Voltar da peça devolve a posição da lista nos 16 aparelhos (certo, não mexer). Cabeçalho fica sempre fixo (certo).
- Alarmes falsos conhecidos nesta rodada: "tampado" contava conteúdo passando por baixo do cabeçalho (corrigido no olho.js depois da rodada); "fileira torta: Comprar" é o botão ao lado da quantidade; "não rolou" na peça do PC é porque a página cabe na tela. O designer aponta, quem decide se é falha sou eu olhando a foto.

## 7. Correção (13/11, depois de investigar)
- O "pulo de layout" ao abrir o ☰ no PC (0,11–0,15) e na peça do celular pequeno (0,109) era ALARME FALSO: quem se mexe é a página de trás (MAIN#topo sobe 62 px) já coberta pela camada aberta — o cliente não vê. Abrir o ☰ no PC mede 0; carregar o Início mede 0 (PC e celular).
- Regra nova para o designer: pulo de layout só conta se o elemento que se mexeu está VISÍVEL (não coberto). Sempre abrir a causa (qual elemento, de onde para onde) antes de recomendar.

## 8. Achados de 13/11 (S222)

- **Início mais larga que a tela com letra grande (defeito de hoje):** margem direita do conteúdo — iPad 768: 8 px (normal), −83 (média), −181 (maior); iPad 820: 58 / −31 / −129; celulares 320–430: 26–34 / 28–38 / 0 a −5. Conteúdo cortado à direita (3ª categoria, 4º cartão, "Retiro").
- **Margem livre à direita na Início, letra normal:** 320→26 · 360→28 · 390→31 · 412→32 · 430→34 · 600→34 · 768→8 · 820→58 · 844 deitado→48. Uma peça fixa de até 24 px (celular) cabe na margem sem cobrir nada.
- **Cabeçalho do celular está cheio:** ☰, conta, logo, busca, sacola; em 320 px não cabe um 6º item.
- **Catálogo no celular não tem WhatsApp** (`.ppop .wa{display:none}`); margem da grade ~14–17 px.
- **Regra nova:** testar as 3 letras em TODOS os aparelhos de toque (não só em 4). Ao medir um botão que anima, medir com a animação desligada.
