# Família COMPRAS — "implementar" do dono 22/11 12:51

**Esboços:** work/s435/compras/esboco_48a_pecas.jpg · esboco_51_compras_por_vaga.jpg · esboco_51b_ninguem_tinha.jpg.
**Lógica (aprovada 22/11 05:45):** work/s435/compras/PARTE-A-LOGICA-DA-COMPRA.md. Ela é a fonte da regra: leia primeiro.

Compras serve **só para repor mercadoria** (dono 21/11). Ela não recebe parados nem sobrando.

## Em 3 partes (uma até o fim antes da próxima)

### Parte 1 — telas
- **Peças (48a):** ganha a 3ª linha **"Compras · Lista de compras e fornecedores ›"**, abaixo de Inventário e Estúdio.
- **Compras (51, quadro 1):**
  - "Para comprar · N vagas". Cada **vaga** é tipo · gênero · material · "faltam N · até US$ X".
  - O estado de cada vaga aparece em uma linha:
    - ★ estrela: "repor o mesmo SL2201";
    - no lugar de um fracasso;
    - pedida em DD/MM · esperando resposta;
    - fechado com X · esperando chegar.
  - No fim, o botão **"Pedir · N vagas sem fechar"**.
- **Tocar numa vaga (quadro 2):** janela de baixo com as alternativas para comprar já (3, com escolha de um lado) · "Fechei com… ›" · "Ninguém tinha ›" · Salvar.
- **Pedir (quadro 3):** uma mensagem só, **em espanhol**, com todas as vagas sem fechar.
  - O botão "Mandar" abre o compartilhar do WhatsApp, e o dono escolhe para quem manda (uma distribuidora ou várias). Não escolhe distribuidora antes.
  - Depois de mandar, as vagas ficam "pedida · esperando resposta", sem prazo.
- **Fechei com… (quadro 4):**
  - Linhas finas: Distribuidora › · Modelo (o mesmo / outro) › · Peças − N + · Custo por peça.
  - Uma linha do **Titan** (ex-Guardião) diz se a margem está boa. Use o contador que já existe (pisoPeca).
  - Salvar.
- **Ninguém tinha (51b):** 3 saídas.
  - Procurar parecido: abre a vaga para outro material ou formato que vende, ou para um custo um pouco maior.
  - Avisar quando aparecer: o Semp confere as distribuidoras e avisa no sino.
  - Deixar sem: só aparece se ninguém está na lista de espera.

### Parte 2 — a lista por vaga e pelo fluxo (Parte A §1, §2, §7)
- A lista é recalculada todo dia pelas vendas. Ela pede **vaga**, nunca acumula modelo velho.
- **O fluxo decide**, e a curva ABC e os "60 dias parado" não. O que importa é quanto a peça rende por dia (lucro × fluxo) acima ou abaixo da média que o Titan aprende.
  - Acima da média = estrela.
  - Abaixo da média, mesmo com oferta = fracasso, que vira alternativas das maiores tendências do mesmo tipo.
- Venda com oferta não decide sozinha. Conta o fluxo com o preço real que a peça teve e a margem desse preço.

### Parte 3 — aprende sozinho (Parte A §8)
- Saem dos Ajustes, no mesmo passo:
  - a meta de peças por dia por tipo (`S.metaDia`);
  - o volume por mês (`S.volume`);
  - os dias de loja (`S.diasLoja`).
- `volTipos` (src/53-faixas.js) passa a usar só as vendas reais. No começo usa as peças da primeira compra e compra **pouco**, mostrando "aprendendo · N dias de vendas".
- Fica a **meta de lucro do mês** (`S.metaUsd`), que é o objetivo pessoal do dono "como um jogo". Ela não entra na conta de compra.
- Fontes de dados, em ordem de peso:
  1. vendas do app;
  2. Analisador do site;
  3. lista de espera ("me avise"), ligada à **foto**;
  4. tendências da internet.

## Sai no mesmo passo
- A **Lista de compras** de dentro do Giro e o "como calcula".
- A aba Fornecedores do Inventário. Os fornecedores passam a ser "Fornecedores ›" no fim de Compras, uma tela de cada um.

## Trava
- Nenhuma vaga com modelo que já saiu da distribuidora fica acumulando.
- Vaga de fracasso nunca propõe o mesmo modelo.
- A mensagem do Pedir sai sempre em espanhol.

Testado só no simulador; NÃO testado em aparelho real.
