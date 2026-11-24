# IDEIAS 12 — temática em 3 camadas sobre a identidade fixa (dono 23/11 13:20 · "mesma base para a loja e pequenos ajustes na temática sem perder a identidade")
Esboços: esboco-12-natal.jpg, esboco-12-bf.jpg, esboco-12-maes.jpg (Início, Peça, Menu; Hoje = site do ar × Proposta). copia.py → /tmp/a12 (:8765); prancha.py.
Base da proposta: pacote aprovado (menu 08g, busca 08l, conta/carrinho 08m, camadas 08k/08k2, temática campanha 06/06e) + botões 09 + cor oficial 87 + formato Lente 88.
1) NUNCA MUDA (identidade): a cor da marca (#943d6f) no logo, nos botões acetinados, nos links e no rosé; letra; formato Lente; menu, topo e camadas.
2) MUDA NA DATA (uma variável só, --ac = --act da data; sem data = a cor da marca): o fundo creme, a faixa (cor e frase), o título pequeno do destaque e a palavra em itálico do título, o fio das camadas, o chapéu do Mochi.
3) SÓ NA DATA: o Destaque Campanha (fotos da data), a seleção (pílulas) e o "para presente".
Diferença para os aprovados de hoje (09 às 10:23 e 87 às 10:52): os botões NÃO viram a cor da data — ficam na cor da marca o ano todo. Também o botão do Destaque Campanha (.lfcamp .bt, que estava na cor da data) entra na família (principal, Grande, largura toda).
Jeito natural: no bloco Botões, --lfc é SEMPRE a cor da marca (sai o :root[data-ev]{--lfc:var(--ac)}); o :root{--ac:var(--act,#943d6f)} já existe (só troca o vinho antigo #8d3a69 pela cor oficial). Argus: prova que falha se um botão principal tiver cor diferente de --lfc com data ativa.
- Dono 23/11 14:03: fundo BRANCO também nas datas (sai o creme).

## 12b — "campanha forte" nas 6 datas (dono 23/11 14:07) · esboco-12b-campanhas-1.jpg (BF, Natal, Ano Novo) e -2 (Mães, Pais, Halloween); copia2.py → /tmp/a12b (:8766); prancha2.py
Fundo branco em tudo. Por data, só conteúdo: faixa com motivo para comprar (EVD.bar) · Destaque Campanha (frase, 3 fotos, 1 botão da família na cor da marca) que SUBSTITUI o destaque antigo da data (sai o EVD/.hd duplicado) · seleção da data (pílulas) · linha do GESTO no fim do cartão (cupom do evento e/ou kit estojo + flanela, embrulho e cartão — aprovados 23/11 09:37/12:17; sem valores inventados) · chapéu do Mochi (como hoje).
Textos (para o dono ajustar): BF "Black Friday" / ofertas · Natal "Presenteie estilo" / para ela, ele, todos / kit · Ano Novo "Comece o ano com outro olhar" / Redondos, Quadrados, Gatinho / cupom · Mães "Um presente com carinho" / kit + cartão com mensagem · Pais "Estilo que passa de pai para filho" / kit · Halloween "Um olhar misterioso" / Solar, Gatinho, Armações / cupom.
- Dono 23/11 14:19: botão da campanha = "VER A COLEÇÃO" (opção A; na BF "VER AS OFERTAS"); a página da seleção passa a se chamar "Coleção de <data>". Faixas curtas e sem emoji: "Natal · retirada no mesmo dia", "Black Friday · só esta semana", "Ano Novo La Fouch", "Dia das Mães · embrulho de presente", "Dia dos Pais · embrulho de presente", "Halloween · só esta semana". Esboços 12b refeitos.
- Dono 23/11 14:25: faixa = frase de efeito da data, sem promessa de entrega ("retirada no mesmo dia" sai também do subtítulo da campanha): Natal "Natal La Fouch · presentes para um novo olhar" · BF "Black Friday · poucas peças, por poucos dias" · Ano Novo "Ano Novo · veja o ano com outros olhos" · Mães "Dia das Mães · para o olhar que cuidou de você" · Pais "Dia dos Pais · o olhar que você herdou" · Halloween "Halloween · o mistério está no olhar". Subtítulos: "Peças escolhidas para presentear / para ela / para ele". Sai a frase do Ano Novo montada por fora do EVD (com o ano): uma fonte só para a faixa.

## 12c — "a vitrine da data" (dono 23/11 15:11: "bonito, mas do jeito que tá ou é muito seco, ou não é luxuoso") · esboco-12c-vitrine-1.jpg / -2.jpg · pinta12c.js · copia3.py → /tmp/a12c (:8767) · prancha3.py
O meio-termo: a loja continua branca e na cor da marca (12/12b); a data ganha UM lugar rico — a foto da campanha vira uma VITRINE:
fundo profundo na cor da data (2 tons, como veludo: Natal #5e1420→#9a2636 · Mães #7a2b4b→#b4557c · Pais #16233b→#2e4770 · Ano Novo #5b4824→#9c8048 · BF #0b0b0b→#2b2b2b · Halloween #26132f→#53305f), desenho de linhas finas douradas da data (estrelas, flores, risca de giz, bolhas, risca, luas; rgba(214,186,122,.55)), a peça num ARCO branco com fio dourado (o desenho das vitrines de joalheria), e o Mochi aprovado (10–11/11, com chapéu da data e braços, pelo caminho do site) no canto. Texto, botão (família 09) e seleção embaixo, no branco.
Jeito natural: cada data declara só {cor1, cor2, desenho}; o Destaque Campanha monta a vitrine igual para todas.

## 12d — TODAS as datas na cor oficial da loja (dono 23/11 15:25, depois do estudo "por que as marcas de luxo nunca mudam a cor") · esboco-12d-datas-cor-oficial-1.jpg / -2.jpg · copia4.py → /tmp/a12d (:8768) · prancha4.py
Regra: o acento de toda data É a cor da marca (#943d6f) — faixa, título pequeno, palavra em itálico, fio das camadas. Nenhuma data tem cor própria (saem os --act por tema: BF preto, Natal vermelho etc.). Fundo branco. A data fica só no CONTEÚDO: frase da faixa (estudo de luxo), campanha (fotos/filme do Semp no lugar das fotos de produto), seleção (Natal por estilo: Clássico · Ousado · Discreto), gesto da data, botão "VER A COLEÇÃO" (BF "VER AS OFERTAS").
Faixas: Natal "o presente é um olhar" · BF "Black Friday privada · poucos dias" · Ano Novo "um novo ano à vista" · Mães "tudo começou com o olhar dela" · Pais "para quem nos ensinou a enxergar" · Halloween "o que o olhar esconde".
Jeito natural: os html[data-ev=…]{--act:…} saem; :root{--ac:var(--act,#943d6f)} fica e o tema só declara textos/fotos/seleção/gesto.

## 12e · o cartão de hoje na cor oficial profunda (teste só no Natal, dono 23/11 15:41)
- Volta o destaque de hoje (#hdst): fundo profundo, peça num cartão branco (margem 14, canto 18), texto claro centralizado, 2 botões. Sai a campanha .lfcamp.
- Uma regra para todas as datas: `--lfprof1: color-mix(#943d6f 78%, preto)` → `--lfprof2: color-mix(#943d6f 48%, preto)` em 135°; enfeite da data por cima em branco suave; destaques em `--lfluz #f0e4eb`.
- Botão principal sobre fundo escuro: cheio rosé acetinado com letra #7f345f (mesma família aprovada, versão clara); o segundo é link claro.
- Frase do Natal sem "retirada no mesmo dia": "Peças escolhidas para presentear". Fundo do site branco; títulos na cor do texto.
- Base: copia5.py (/tmp/a12d → /tmp/a12e :8769).
- Ajustes (dono 16:36 "sim"): pontinhos (`--lfenf`) só no Natal e no Ano Novo; BF e Halloween mais fundos (62%→34% (leve clareada, dono 16:52) com preto); Mães mais suave (92%→64%). Mesma cor, só a profundidade muda.
- Comparador (compara12e.py, Início, celular/letra 1,2×/tablet/PC) em Natal, BF e Mães: 0 falha nova. As diferenças são as esperadas: faixa e frase novas, botões da família aprovada, fundo branco e títulos/rodapé na cor da loja (sem o verde), rodapé e menu do 08 aprovado.

## 12f · enfeites de traço fino + "Edição Noir" (dono 23/11 16:57)
- Sai o emoji do .hdeco; entra um desenho de traço único (1,3 px, #943d6f), 32 px, no canto da peça. Um mapa só por data (copia6.py, ENF): Natal estrela · Ano Novo brilho · Mães tulipa · Halloween lua crescente · Pais e BF sem enfeite.
- Implementação natural: o EVD guarda o nome do enfeite (deco:'estrela') e uma função desenha o SVG; nada de emoji.
- Halloween: título "Edição <em>Noir</em>" (o luxo trata o Halloween como a noite e como edição limitada, não como fantasia).

## Pasta refeita (IDEIAS, 24/11 03:45)
- A sessão de 23/11 não subiu esta pasta ao GitHub. Os textos e scripts (COMO-FAZER.md, copia*.py, prancha*.py, pinta12c.js, compara12e.py) foram refeitos a partir do registro da conversa, repetindo só as edições de texto, na mesma ordem. As regras do aprovado (12e + sem enfeite) estão completas acima.
- FALTAM as imagens (esboco-12*.jpg) e os relatórios do comparador (comp-12e-*): eram gerados de cópias do site em /tmp que se perderam. Para refazer é preciso recriar a corrente /tmp/a8k → a12 → a12d → a12e e rodar prancha5.py e compara12e.py.
