# IDEIAS 09 · família de botões do site (23/11, parte 1: inventário) — esperando o dono

**Inventário:** `inventario.py` abre as 22 telas do roteiro único (o mesmo do comparador e do Argus) no celular 390, sem evento, no pacote aprovado (/tmp/a8k). Junta todo botão com texto e agrupa pelo desenho (fundo, texto, borda, cantos, altura e letra). Saída: `inventario.json` e a prancha `esboco-09-inventario-botoes.jpg`.

**Hoje há 29 desenhos de botão:**
- Principal: 10 desenhos.
  - Vinho em pílula (36 e 48 px) e vinho com degradê e ícone ("Comprar", "Abrir a câmera", "Ver este modelo").
  - Verde com cantos de 14 px ("Finalizar compra", "Solicitar orçamento", "Receber o código", "Quero estas").
- Secundário: 7 desenhos (contorno vinho em pílula, contorno com cantos 14, branco com borda preta, reto, "Voltar" cinza…).
- Link: 10 desenhos (vinho 13 a 16 px com pesos 500, 600 e 700; preto; cinza).
- Perigo: 2 desenhos.

**Família nova (uma regra num lugar só, para todos os botões; regra 13):**
1. **Principal:** vinho (`var(--ac)`; nos eventos, `--act`) cheio, em pílula, 48 px de altura. Letra do corpo 16 px, peso 500, texto branco. Um por tela. Sem degradê, sem ícone e sem verde.
2. **Secundário:** contorno de 1 px vinho, em pílula, 48 px (40 px dentro de listas). Texto vinho 16 px, peso 500, fundo transparente.
3. **Link:** só texto vinho, 15 px, peso 500, com › (ir) ou ‹ (voltar). Sem caixa e sem sublinhado; área de toque de 44 px.
4. **Perigo:** vermelho cheio, em pílula, 48 px, sempre com o link "Voltar" embaixo (regra 15). Em listas, só o texto vermelho.

**Para o dono decidir:**
- **"Continuar com Google":** pode ficar no padrão do Google, porque a marca do Google pede o botão dela.
- **Botões verdes que levam ao WhatsApp** ("Solicitar orçamento", "Quero estas"): eu recomendo que virem Principal vinho.

**Fora desta família** (cada uma com a sua regra): linhas do menu e do rodapé, abas, cartões, × de fechar, quantidade (− 1 +) e escolha de dois lados.

**Jeito natural:**
- As 4 classes num bloco só do CSS (`.b-p`, `.b-s`, `.b-l`, `.b-x`), e cada botão do site usa uma delas.
- Saem os estilos soltos: `.cs-b`, `.btn.w`, `.bb.p` com `.shn`, `.p2`, `.soall`, os verdes e os degradês.
- O Argus confere que nenhum botão fora dessas 4 classes aparece no roteiro.

## 09 v2 (23/11 00:38) — família ESTRUTURADA: papel × tamanho + marca (esperando o dono)
O dono pediu uma estrutura melhor: alguns botões não podem ser quebrados, como o "Sincronizar" da Conta do Google, que mora dentro de uma linha.
- **Papel** (o que o botão faz): Principal (vinho cheio, um por tela) · Secundário (contorno vinho) · Link (texto vinho com › ou ‹) · Perigo (vermelho).
- **Tamanho** (onde o botão está):
  - **Grande:** fim de um caminho, largura toda, 48 px.
  - **Médio:** no meio da tela, largura do texto, 48 px.
  - **Compacto:** dentro de uma linha ou de um cartão, 32 px, 14 px. A área de toque de 44 px fica por fora.
- **Onde cada um de hoje vai:**
  - **Principal Grande:** Comprar · R$ 95, Prosseguir com o pagamento, Finalizar compra, Iniciar sessão, Salvar, Solicitar orçamento, Receber o código, Quero estas.
  - **Principal Médio:** Começar e Abrir a câmera.
  - **Principal Compacto:** Comparar e Ver este modelo.
  - **Secundário Grande:** Sair da conta.
  - **Secundário Médio:** Ver modelo, Abrir no Google Maps e Precisa de ajuda.
  - **Secundário Compacto:** Sincronizar (Conta do Google) e Copiar (código PIX).
  - **Link:** um tamanho só. Dentro de uma frase, fica sublinhado ("aceita os Termos e Condições").
  - **Perigo:** Grande com "Voltar" (link) embaixo; em lista, só o texto vermelho ("Excluir minha conta").
- **Marca (não muda):** "Continuar com Google" fica no desenho do Google, só alinhado aos nossos (pílula, 48 px).
- **Pode ir dentro do botão:** texto, e um valor quando ajuda a decidir ("Comprar · R$ 95"). Ícone, só na Marca.
- **Estados iguais em todos:**
  - carregando: "…" no mesmo tamanho;
  - desativado: 40% de opacidade;
  - apertado: escurece 8%.
- **Jeito natural:** classes num bloco só do CSS (`.b-p/.b-s/.b-l/.b-x` + `.b-g/.b-m/.b-c`). Saem os estilos soltos (verdes, degradês, cantos 12/14 e ícone dentro). O Argus reprova botão fora da família.
- **Prancha:** esboco-09b-familia-botoes.jpg.

## 09 v3 — preto no dia a dia, vinho só no caminho do dinheiro (esboco-09c)
- Mesma estrutura da v2 (papel × tamanho, classes .b-p/.b-s/.b-l/.b-x + .b-g/.b-m/.b-c, Marca Google intacta), num bloco só do CSS.
- .b-p = preto #141414 cheio. Novo modificador .b-$ (vinho) SÓ em: Comprar · R$ 95, Prosseguir com o pagamento, Finalizar compra. Nos eventos só o .b-$ pega a cor do evento.
- .b-s = contorno preto 1px · .b-l = texto preto com › (sublinhado só dentro de frase) · .b-x = vermelho.
- Saem no mesmo passo: verdes, degradês, vinho dos demais botões, cantos 12/14.

## 09 parte 2 — a família v3 nas telas reais (esboco-09d-telas-*.jpg; pintura: pinta11.js, cópia: copia.py → /tmp/a9b)
Jeito natural (regra 12): UM bloco "Botões" no CSS com os papéis e tamanhos; cada botão do site recebe a classe da família no HTML e os estilos soltos saem no mesmo passo (verde do .btn.w/#lojista, degradês do .rzg/.go/.btn.p/a.p, brilho .shn e ícone <em> do Comprar, cantos 12/14, vinho do .p1/.p2/.gsb/.cfx/.mp/.navb/[data-pzvolta]).
- Vinho (var(--ac), cor do evento): .bb.p Comprar · .cs-b do carrinho · [data-cadfin] Finalizar.
- Preto: .btn.w (Iniciar sessão, Salvar), #lojista, .gzgo Começar, .rzg/.btn.p Abrir a câmera, a.p Como chegar.
- Compacto (32): [data-cmpopen] (na barra preta: inverte, branco), .gsb Sincronizar, Ver este modelo do Comparar (.cmpc).
- Secundário: .p1 Ver modelo, a.s Abrir no Google Maps, .bsair Sair da conta. Copiar (PIX) vira link (o número não quebra).
- Links pretos: .p2, .cs-c, .lfgf, .mp, .cfx, .soall, .gzbk, .ajbk, voltar do topo; Termos dentro da frase sublinhado preto. Rodapé (08) não muda, só o "Como chegar ›" sai do vinho.
- Perigo: .dk.dr vermelho; aviso de confirmação em coluna: vermelho em cima, "Voltar" link embaixo (regra 15). .bexc texto vermelho sem ícone.
- Escolha Cédula/RUC: marcada em contorno preto (sai o rosa). Seta › das linhas: cinza.
- Letra de todos: corpo 15 px 500, espaçamento .02em, nunca quebra (white-space:nowrap; se não cabe, a letra do par vai a 14 — Mapa).
- Foco: no toque sem anel (o site foca o Finalizar sozinho); no teclado do PC, anel preto 2 px.
Comparador: 22 telas × celular e PC — 0 falha nova.

## 09e — 3 propostas de identidade (dono 23/11 07:46: "tirou toda a identidade"; mexi sem pedido em Sair da conta/Excluir)
- Voltam ao original: Sair da conta, Excluir minha conta, Cédula/RUC. Cancelar pedido fica como na v3 (aprovado).
- Voltam os ícones dentro dos botões (carrinho no Comprar, câmera, WhatsApp, sair), na cor do texto, 18 px.
- A = vinho liso em todo principal · B = degradê refinado (vinho escuro → vinho → vinho claro, sem brilho nem sombra) só em Comprar/Prosseguir/Finalizar, resto preto · C = esse degradê em todo principal.
- O degradê é feito da var(--ac) (color-mix), então nos eventos vira o degradê da cor do evento sozinho. Uma variável só (window.__b9v no esboço; no site, um valor no bloco Botões).
- Secundário contorno preto fino e links pretos nas três.

## 09g — só o botão Comprar, 5 propostas de luxo (work/ideias/09-botoes/comprar/esboco-09g-comprar.jpg; comprar.py)
Princípio (dono 23/11 08:28): a cor da marca é o vinho do logo — ela faz o papel do preto da Dior/Cartier. Família do app (81) é a referência.
A vinho liso · B etiqueta (caixa alta 13 px, espaço .16em) · C degradê refinado (#5e1d43 → --ac → #a2447c, sem brilho/sombra) · D "Comprar" em Fraunces · E estojo (vinho fundo #6f2250 + fio claro por dentro, caixa alta). Em todas sai o brilho (.shn) e a sombra; cor pela var(--ac) para seguir o evento.

## 09h — o Comprar em cores suaves (comprar/esboco-09h-comprar-suave.jpg; comprar2.py). Contraste conferido (≥ 4,5)
F rosé #f4e9ee + letra --ac + fio 1px (= principal do app, 81) · G malva #8c6377 + branco (5,0) · H rosé seda (degradê #f7eef2→#e9d2dd) + #7a2f5a + fio · I nude #ecdcd3 + #7a2f5a · J pó de rosa #c9a7b5 + #4a1c36.

## 09i — Comprar rosé/seda na cor do LOGO (#7c486c, medida no arquivo do logo) (comprar/esboco-09i-comprar-logo.jpg; comprar3.py)
K rosé #f5eef2 + letra/fio #7c486c (6,1) · L seda linear-gradient(120deg,#faf6f8,#efe3ea 55%,#f6eef3) + fio 1px rgba(124,72,108,.45) (≥5,4) · M = L + caixa alta 12,5 px .18em · N = M + fio duplo (estojo: 1px .5 / 3px fundo / 1px .28) · O = L + "Comprar" em Fraunces 400 18. Ícone do carrinho fino (traço 1,6) na cor do logo. Sem brilho, sem sombra.

## 09j — N2: o N refinado pelo estudo das marcas com cor própria (comprar/esboco-09j-comprar-n2.jpg; comprar4.py)
Estudo (DESIGN.md públicos em shadcn.io): Rare Beauty — ameixa só em letra e borda, nunca de fundo; pílula; caixa alta 10 px espaçada; ao passar o mouse inverte. Cartier — cor da marca só na ação mais importante; espaço da letra no lugar do peso. Van Cleef — sem botão cheio, fio fino, caixa alta 1,5 px.
N2: letra Inter 400 12 px, espaço .2em, caixa alta, cor do logo #7c486c · fundo quase branco (linear-gradient 120deg #fdfbfc → #f6eef2 → #fbf7f9) · fio duplo 1px .62 / 3px fundo / 1px .22 · preço em caixa própria depois de um fio 1px (sem o "·": no site o preço vira <span> próprio) · carrinho traço 1,4 · ao tocar: enche em #7c486c, letra branca, costura branca .35. Sem brilho nem sombra.

## 09l — N3: a delicadeza do N2 com a cor do logo cheia (dono 23/11 08:55: a cor do logo vai nos estojos e flanelas) (comprar/esboco-09l-comprar-n3.jpg; comprar5.py)
Fundo #7c486c (letra branca, contraste 7,0) · Inter 400 12 px, espaço .2em, caixa alta · costura: inset 4px na cor do fundo + 1px rgba(255,255,255,.42) · preço depois de um fio 1px branco .4 (preço em <span> próprio, sem "·") · carrinho traço 1,4 · flanela: radial-gradient(#86527b → #7c486c → #73415f), sem brilho · ao tocar: #6b3c5c (8,7), sem pular nem crescer. Sem sombra.
A cor do logo deve virar UMA variável (--logo-cor) usada no botão e nas peças da marca; no evento, a temática troca a variável.

## 09m — a cor do logo suavizada (comprar/esboco-09m-comprar-suave-logo.jpg; comprar6.py). Contraste da letra ≥ 4,5 em todos
S1 #906382 (logo + 15% branco) letra branca 4,9 · S2 #8d6380 (logo menos saturado) letra branca 5,0 · S3 fundo #e2d7df letra/costura #7c486c 5,0 · S4 fundo #d8c8d3 letra #4f2a44 7,5. Mesma letra e costura do N3.

## 09n — Comprar "menos é mais" (comprar/esboco-09n-comprar-menos.jpg; comprar7.py)
Só a palavra "COMPRAR": Inter 500 13 px, espaço .18em, caixa alta, centralizado; sem costura, sem carrinho, sem preço (o preço já está grande acima), sem sombra nem brilho.
P1 profundo #6f3e60 + branco (8,3) · P2 rosé #e2d7df + #7c486c (5,0); ao tocar enche em #7c486c com letra branca.

## 09o — P1 em tons mais suaves (comprar/esboco-09o-comprar-p1-suave.jpg; comprar8.py)
Mesmo P1 (só "COMPRAR", Inter 500 13 px, .18em, caixa alta, sem costura/ícone/preço): #6f3e60 (8,3) · #7f5773 suave (6,0, recomendação) · #88637f mais suave (5,1, limite) · P2 rosé #e2d7df + #7c486c.

## 09p — P1 suave com detalhes + família dos outros botões (comprar/esboco-09p-comprar-detalhes.jpg; familia/esboco-09p-familia.jpg)
Comprar: #7f5773; ao tocar #6f4a65; PC mouse em cima #8a627f (transição de cor 0,3 s, sem mover); adicionando = "···" no mesmo tamanho; adicionado = "ADICIONADO" por um instante e abre o aviso (sem verde); total "Total R$ 70" 13 px acima da linha só com quantidade > 1 (sai o preço de dentro do botão: o <small data-ptot> vira a linha do total); quantidade (.mq) 48 px, pílula, fio 1px #d9cfd5, alinhada ao centro com o botão.
Família: Principal = #7f5773 cheio, Inter 500 13 px .18em caixa alta, 48 px, um por tela, cor do evento nos eventos; ícone só WhatsApp/câmera (16 px, traço 1,4, antes da palavra); sem verde. Secundário = fio 1px + letra #7f5773. Compacto 32 px / 11 px (cheio dentro de cartão: Comparar, Ver este modelo; fio: Sincronizar, Copiar). Link = texto #7f5773 15 px frase normal com ›; dentro de frase sublinhado 1px. Não mudam: Cancelar pedido (aprovado), Google, Sair da conta, Excluir minha conta.
Uma regra só: --logo-cor (#7f5773) e suas variações de toque/mouse; app (81) e site usam a mesma.

## 09q — a família P1 suave aplicada nas telas reais (esboco-09q-telas-*.jpg; pintura pinta12.js; cópias copia4.py: Hoje /tmp/a9h :8762, Proposta /tmp/a9q :8761)
Jeito natural: UMA variável --lfc (#7f5773; nos eventos = --ac) com --lfc2 (toque) e --lfc3 (mouse), e um bloco "Botões" com 4 papéis. Saem no mesmo passo: verdes (.btn.w, #lojista, #manut .btn), degradês (.bb.p, .rzg, a.p, .go), brilho .shn, sombras, o carrinho e o preço de dentro do Comprar.
Principal: .bb.p, .btn.w, .cs-b, .gzgo, .rzg, .btn.p.ic, a.p (Mapa), #lojista, #manut .btn · Secundário: .p1, a.s · Compacto: [data-cmpopen], .cmpc .btn.p (espaço .08em no cartão estreito), .gsb · Link (--lfc): .p2, .cs-c, .lfgf, .mp (fora do rodapé), .cfx, .soall, voltar, Copiar.
Mapa: as duas saídas uma embaixo da outra, largura toda. Quantidade (.mq) 48 px com fio fino. Foco sem anel no toque. Não mudam: Cancelar pedido (v3 aprovado), Google, Sair da conta, Excluir minha conta, Cédula/RUC, rodapé.

## 09r — Comprar fosco × acetinado (comprar/esboco-09r-fosco-acetinado.jpg; comprar10.py)
Acetinado: radial-gradient(130% 220% at 50% 35%, #8d6683, #7f5773 52%, #73506a) · mais leve: (#86607c, #7f5773 55%, #79546f) · ao tocar: (#7b5a73, #6f4a65 52%, #64435c). Sem reflexo, sem sombra.

## 09 — APROVADO 23/11 10:23: a família do 09q com o principal ACETINADO do 09r
No bloco "Botões": principal = background:var(--lfc-cetim) onde --lfc-cetim: radial-gradient(130% 220% at 50% 35%, #8d6683 0%, #7f5773 52%, #73506a 100%) e, ao tocar, radial-gradient(130% 220% at 50% 35%, #7b5a73 0%, #6f4a65 52%, #64435c 100%). Nos eventos o cetim sai da var(--ac) com color-mix (+10% branco no centro, −8% preto na borda). Resto igual ao 09q.
