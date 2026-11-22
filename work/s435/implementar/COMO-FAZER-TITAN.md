# Família TITAN — como fazer · S435 ESBOCO → APP · 22/11

O Titan (ex-Guardião, nome do dono 22/11) é o DONO do preço. Estúdio = fotos · Catálogo = vendas · escritório do Titan = preços.
Inventário, Completar peça e Vender só MOSTRAM o preço; tocar abre a janela do Titan.
Essência (22/11 00:21): o Titan copia o jeito do dono e aprende; nada de tabela nem questionário.

Em 3 partes (regra 3): **Parte 1 = as telas** (este arquivo) · Parte 2 = o motor (mola, cotação, colchão, atacado, custo por compra) ·
Parte 3 = segundo plano (APP + NUVEM). Só entra na Fila com o "implementar" do dono.

---

## PARTE 1 — AS TELAS

Ordem de implementação. Cada passo vai até o fim antes do próximo, porque o caminho para Preços nunca pode ficar quebrado.

### 1. Nome: Guardião → Titan
- **Muda:** todo texto visível "Guardião" passa a "Titan" (Pendências, sino, Preços, Semp ↔ Titan).
- **Como fazer:**
  - O nome sai de **uma constante só** (`LF_TITAN='Titan'`), nunca escrito à mão em cada tela.
  - O código velho com o nome solto sai no mesmo passo.
- **Argus:** nenhum "Guardião" visível em nenhuma tela.

### 2. Início sem "Giro e preços" (52a)
- **Esboço:** work/s435/giroprecos/esboco_52a_inicio.jpg
- **Muda:** o grupo "Giro e preços" sai e Preços vira linha própria do Início.
  - Isso é seguro porque a tela Giro já sai na família Inventário (65).
  - Faz-se junto com o passo 3, para Preços nunca ficar sem caminho.

### 3. Preços = o escritório do Titan (54 + 46b)
- **Esboços:**
  - work/s435/guardiao/esboco_54_precos_guardiao_{escuro,claro}.jpg
  - work/s435/switch/esboco_46b_precos.jpg (com COMO-FAZER-46.md)
- **A tela, de cima para baixo:**
  1. "‹ Início" · h1 **"Preços"**, sem subtítulo (dono 22/11 14:46: tira descrição inútil como "o escritório do …") · pílula "○ Automático" ao lado do título (46b).
  2. "O Titan decide hoje · N": uma linha por assunto (preços para corrigir, oferta sugerida, evento). Some quando é 0.
  3. Setores em linhas ›: **Regras · Ofertas · Atacado · Ferramentas · Histórico**.
     - Atacado é uma linha só: "7 tabelas · …".
     - Ícones e rótulos em cinza (37b).
- **Sai:**
  - Os 4 números de margem (foram para Resultados › Dashboard do mês, 52e).
  - "Preço automático · em Ajustes ›".
  - A linha Preços de Ajustes (46d).
  - A dobra "Contas, taxas e meta" da janela Automático (foi para Regras).
- **Como fazer:**
  - A pílula é a função única `botaoEstado(chave)` do 46: ela desenha a pílula e abre a janela com o interruptor que já existe (`paSwitchHtml`) e a prévia (`paPrevia`).
  - O interruptor vale na hora, sem "Salvar".

### 4. Setor Regras (62)
- **Esboço:** work/s435/titan/esboco_62_regras_titan{,_claro}.jpg
- **Cada venda cobre:**
  - Contas do mês (› leva a Dinheiro).
  - Taxas da maquininha (débito/crédito).
  - IVA "incluído no preço · em guaranis": só mostra; o cálculo ÷ 11 já existe em src/97y-lucro-real.js.
  - "Colchão · reserva da mercadoria · N%" ⌄.
- **Dólar da loja:** "Cotação nos preços · travada · venda da casa G$ X · G$ Y" ⌄.
- **O Titan aprende com você:**
  - Vendas por mês ⌄, sem digitar.
  - Seu jeito de cobrar ⌄.
- **Seu objetivo:** Meta de lucro do mês. Não muda os preços.
- **Sai no mesmo passo:**
  - "Contas, taxas e meta" de Ajustes › Preços, com o "Dias de loja" digitado.
  - Do Câmbio: "Preços no site" e "Como o app te protege".

### 5. Setor Ofertas (63)
- **Esboço:** work/s435/titan/esboco_63_ofertas_titan{,_claro}.jpg
- **Ordem da tela:**
  1. h1 Ofertas com "+" redondo **na linha do título**, centro com centro (regra L2 de 22/11).
  2. **Ofertas no ar.**
  3. **Cupons:** "Folga de hoje · até X%" é a 1ª linha, depois Última peça e Black Friday.
     - Os cupons só MOSTRAM e levam a Clientes › Cartões (src/97-cupons.js), onde são criados. Nada de "+ cupom" aqui.
  4. **Como o Titan decide** ⌄.
- **O "+"** abre a janela Oferta (passo 6) com "escolher a peça" no topo.
- **Sai no mesmo passo:** os degraus FIXOS de parados (60 dias −5% … 120 = piso, src/97-preco-auto.js:10).

### 6. Ficha da peça + janela Oferta (64)
- **Esboço:** work/s435/titan/esboco_64_ficha_oferta.jpg
- **Ficha:**
  - Linhas só de mostrar, sem ícone: "Preço · Titan · G$ 25.000" e "Oferta · nenhuma" (ou "Em oferta · até 30/11 · G$ 23.000").
  - Tocar abre a janela Oferta.
  - No fim, 3 links iguais: Vender no Catálogo › · Fotografar no Estúdio › · **Ver no escritório do Titan ›**. Este último abre o Histórico só desta peça (passo 9).
- **Janela Oferta (UMA só, duas entradas: o "+" de Ofertas e a ficha):**
  - Campos: Preço normal · Preço da oferta (linha fina, sem caixa) · Desconto · Até DD/MM.
  - Aviso do Titan: mínimo, prejuízo por peça e folga de hoje.
  - Botão **Salvar**.
  - Fecha arrastando, tocando fora ou com Esc; "Sair sem salvar?" se mudou algo.
- **Sai no mesmo passo** (src/55-produtos-catalogo.js:245):
  - O campo "Preço (US$)" editável.
  - O botão "% Oferta".
  - Os atalhos −5%…−30%.
  - "Cancelar".
  - A data mm/dd/yyyy.

### 7. Atacado: margens no Titan, escolha no Atacado (65 + 65b)
- **Esboços:**
  - work/s435/titan/esboco_65_atacado_titan.jpg
  - work/s435/titan/esboco_65b_margens_atacado.jpg
- **Preços › Atacado:**
  - As 7 tabelas com a margem **calculada pelo Titan**, sempre com lucro: Óptica 56 · Vendedor 45 · 1K 36 · 2K 32 · 5K 29 · 10K 27%.
  - "Calculadas em DD/MM · próxima revisão …".
  - O cálculo é da Parte 2.
- **Tela Atacado:** 3 abas, Mensagens · Lojistas · Lotes.
  - A aba Tabela sai, porque virou o setor do Titan.
  - "Enviar catálogo" fica em Lojistas.
- **Conta do lojista (padrão de luxo):**
  - Um título, linhas finas.
  - **"Tabela de preço ›"**: o dono escolhe a tabela de cada lojista. Hoje o app põe sozinho a 1ª "Atacado".

### 8. Setor Ferramentas (66)
- **Esboço:** work/s435/titan/esboco_66_ferramentas_titan.jpg
- **Calculadora:**
  - Campos em linhas finas.
  - Usa o MESMO motor do Titan: varejo pelo jeito do dono, loja e site com a mesma cotação, atacado pelas tabelas do 65b.
- **E se…?:** perguntas em linhas ⌄, respondidas pela mola.
- **Sai** (src/97z2-contador.js:92–175):
  - A FAIXA Econômico/Intermediário/Luxo de margem fixa.
  - A fórmula antiga do atacado, com contas.
  - A folga extra do site.
  - "Usar estes preços".
  - "Vender tudo parado".

### 9. Um só Histórico do dia (67)
- **Esboço:** work/s435/titan/esboco_67_historico_do_dia.jpg
- **Muda:**
  - A tela real do dia (Resultados › Histórico › dia, src/98z-dashboard-s48.js) fica como está.
  - Só "Vendas do dia" vira **"Tudo do dia"**: venda, preço, mercadoria, troca de moeda, conta e pedido do site, do mais novo ao mais velho.
- **Uma linha = o MESMO molde das vendas** (`sl418L`):
  - título · "Tipo · quem · 22/11 às HH:MM" · valor (e "era G$ …") · ⌄.
  - O ⌄ só mostra (`sl418R`).
  - Desfazer fica onde a coisa mora: "Mudar na ficha ›" / "Ver as tabelas ›".
- **Três portas, um histórico. Sem abas: a porta é o filtro.**
  - Resultados: tudo.
  - Preços › Histórico (o escritório do Titan): só preços, com "Ver o dia inteiro ›".
  - Ficha › Histórico: só a peça, com "Dias anteriores ›".
- **Como fazer:**
  - **Um registro de acontecimentos só**, por exemplo `S.diaLog`, sincronizado pela nuvem como as vendas.
  - Cada parte do app escreve nele com uma função `lfDiaLog(tipo, …)`. Cada tela só filtra.
  - O "Voltar no tempo" local (src/97z-voltar-tempo.js, só neste aparelho) e o `S.pAuto.mudas` passam a escrever nesse registro, e o guardado solto deles sai.

### Provas novas no Argus (Parte 1)
- Nenhum "Guardião" visível.
- Preços abre pelo Início em 1 toque.
- Ficha sem campo de preço editável.
- Uma única janela Oferta (as duas entradas abrem a mesma função).
- O "+" na linha do título.
- Atacado com 3 abas.
- Conta do lojista com "Tabela de preço ›".
- Histórico: as 3 portas mostram as mesmas linhas da mesma fonte.

### Fora desta família (esboço ainda a fazer)
- Desconto no Vender/caixa (o 55 por peça foi superado por "cupons no caixa").
- Escada de preços (aprovada como ideia).
- Preço sugerido em Completar peça.
- Imprevistos.

---

## PARTE 2 — O MOTOR (por dentro; as telas da Parte 1 só mostram o que ele calcula)

Regra de ouro (dono 22/11 00:21): o Titan **copia o jeito do dono primeiro**. Nada de fórmula fixa de margem no varejo.
Cada item abaixo é **uma função só**, usada por todas as telas (regra 12c). O código velho que ela substitui sai no mesmo passo.

### A. Cotação: uma fonte, a casa de câmbio (estudo: work/s435/titan/ESTUDO-SAIDA-MERCADO-22-11.md)
- **`cotacaoPrecos()`** = venda da casa (La Moneda Jebai, `fxDaCasa`) + ~2%, arredondada de 100 em 100 para cima.
  Exemplo do dono: 6.550 → 6.700.
  - Loja e site usam a MESMA cotação.
  - A cotação fica **travada** e só muda pela mola (B).
- **Sem resposta da casa:** vale a última cotação da casa, com o aviso "cotação de DD/MM · a casa não respondeu". O valor inventado sai.
- **Sai no mesmo passo:**
  - `fetchFx` (open.er-api);
  - `fxHistReal` (currency-api);
  - `FX_MARGEM`/`FX_TETO`/`fxMargemInfo`;
  - `SITE_FOLGA`;
  - os avisos "Margem da loja subiu";
  - o "Valor de exemplo".
- **Fica:** `S.fx` e os seus usos (já recebem a casa). O histórico `S.fxHist` passa a ser só da casa.

### B. A mola (varejo) — aprovada 22/11 06:52
- **Preço da peça:** é guardado em guaranis, num valor fácil, e fica parado.
- **Conferência diária:** todo dia, **`titanMola(it)`** recalcula o preço justo: custo da compra (E) × jeito do dono para o tipo (F) × `cotacaoPrecos()`, arredondado ao valor fácil.
- **Quando o preço muda:** só se o valor fácil recalculado cair noutro degrau **7 dias seguidos na subida** ou **30 dias na descida**.
  - Na descida, o Titan propõe pelo sino e o dono aceita.
  - Gasto imprevisto **nunca** sobe preço.
- **Folga do dia:** é a diferença entre o preço parado e o preço justo do dia. É o **limite do desconto** em três lugares:
  - "Folga de hoje · até X%" em Ofertas (63);
  - o aviso da janela Oferta (64);
  - os cupons do caixa.
- **Com o dólar subindo:** a folga encolhe primeiro; o preço só sobe quando a mola chega no limite.
- **Sai:** os degraus fixos de parados (src/97-preco-auto.js:10). A revisão "toda segunda" do Preço automático passa a ser a mola diária.

### C. Colchão = reserva da mercadoria
- **Varejo:** **`colchao()`** (src/40-formatos-venda.js:201) passa a contar só duas coisas:
  - a alta da venda da casa **acima da cotação travada**;
  - a alta de custo do fornecedor em 90 dias.
  - Continua entre 5% e 25%, sem proteção dobrada com a folga da cotação.
- **Atacado:** colchão = **só a alta do fornecedor**. Começa em 3% e o Titan ajusta pelo que os fornecedores sobem de verdade.
- **Imprevistos:** ficam fora do colchão (são a conta "Provisão de imprevistos"; elaborar à parte).

### D. IVA
- Preço ÷ 11, sempre em guaranis. Já existe em src/97y-lucro-real.js.
- Vira **uma função só** (`ivaDe(g)`), usada também na Calculadora (66) e nas margens do atacado (G).

### E. Custo por compra — aprovado 22/11 13:40
- **Cada peça carrega o custo da compra em que veio.** Saem primeiro as mais antigas.
- **Compra nova mais cara:** muda só o preço das peças NOVAS. Vale para varejo e atacado.
- **Um custo só no app inteiro** (dono 22/11 14:39): preço, lucro e **"Reposição separada"** usam o custo da compra da peça que saiu.
  - A recompra é por VAGA: o ideal é a mesma peça que vendeu rápido, mas nem sempre dá.
  - O Semp escolhe o que entra, e o Titan aprova o preço.
  - O dinheiro separado vai para a vaga. O colchão (C) cobre se a mercadoria nova vier mais cara.
- **Sai por inteiro:** o `repUSD` (custo da última compra do modelo), no preço e na separação.

### F. O Titan aprende o jeito do dono — aprovado 22/11 00:21
- **`titanJeito(tipo)`:** o multiplicador do tipo, aprendido de três fontes:
  - os preços que o dono aceita ou digita no cadastro;
  - o preço cobrado na venda;
  - os descontos que ele dá.
- Nunca pede regra, tabela nem questionário.
- **Começo sem vendas:** o ponto de partida são os preços que ele já pôs nas peças.
- **De/por honesto (pacote 21/11 23:59):** o "de" só aparece se foi o preço praticado por **≥ 30 dias e com venda**. O Titan não deixa criar um "de" maior.

### G. Atacado — aprovado 22/11 13:19–13:55
- **Preço em US$** = custo da compra (E) × (1 + margem da tabela).
- **Margem calculada pelo Titan** (nunca digitada): margem = (1 + colchão do atacado) ÷ (10/11 − lucro alvo) − 1.
  - Lucro alvo por tabela: Óptica 25 · Vendedor 20 · 1K 15 · 2K 13 · 5K 11 · 10K 10%.
  - Com colchão de 3%, isso dá 56 · 45 · 36 · 32 · 29 · 27%.
  - O atacado **não paga as contas do mês**: elas ficam com o varejo. O atacado só precisa dar lucro bom.
- **Quando o US$ muda:** só com custo novo ou na revisão do Titan, ao criar um lote ou 1×/mês. Nunca no meio de um lote.
- **G$ e R$ do atacado:** seguem a **cotação da loja do DIA**, por uma função só (`ataConverte()`), nas tabelas, nos lotes e no catálogo do lojista.
  - **Só no atacado.** O varejo é a mola (B).
- **Lote:** **sai o congelamento de preço** (src/97s2-atacado-lotes.js:88). O lote fica só com a validade do catálogo.
- **Hoje** o guarani do catálogo de atacado fica preso na última publicação (`ataPrecos`, src/97s-atacado-conta.js:31). O APP passa a publicar o US$ e a cotação do dia.
  - A conta no site é da **SITE** (www/loja/js/lf-site.js ~100–130). Mando recado.
- **Testes de lote para lote:** com o ok do dono pelo sino.

### H. Lote de COMPRA não é peça (dono 22/11 15:25)
- No Inventário, um **lote de compra** (Inventário › Lotes, src/51-lote-grupos.js / 52-lotes.js) é a compra fechada que o dono ainda vai abrir para registrar as peças. Exemplo: "Lote Kazwini · 343".
- Ele **não entra** em nada que o Titan ou o Semp fazem com peças à venda: oferta, desconto, parado/giro, destaque, posts, mola.
- O "parado há N dias" dele é a idade da compra, não falta de venda.
- No 54 aprovado, a linha "Oferta para o Lote Kazwini" era desse engano. O "O Titan decide hoje" mostra só o que existe, calculado das peças registradas.
- O **lote do atacado** (pacote virtual que filtra o catálogo para o lojista e vira a caixa fechada do pedido) é outra coisa e continua como está na parte G.

### Provas novas no Argus (Parte 2)
- Nenhum lote de compra aparece em oferta, parado, destaque ou "O Titan decide hoje".
- Nenhuma busca a open.er-api nem à currency-api.
- Loja = site.
- Venda 6.550 → 6.700.
- O preço não muda com 6 dias de alta e muda no 7º.
- Imprevisto não sobe preço.
- Folga 0% quando o preço está abaixo do mínimo.
- Compra nova cara não muda o preço da peça velha.
- Margens do atacado = 56/45/36/32/29/27 com colchão 3%.
- O guarani do lote muda quando a cotação do dia muda e o US$ não.
- "De" maior que o praticado é recusado.

---

## PARTE 3 — SEGUNDO PLANO (aprovado 22/11 12:10–12:11 · work/s435/titan/PACOTE-SEGUNDO-PLANO-22-11.md)

Por que existe: há dias sem abrir o app (férias, doença). O celular acorda **1×/dia sozinho**, com o app fechado, e faz tudo numa
acordada só, para poupar bateria. Sem custo.

### APP — uma função só: `acordadaDiaria()`, com 4 passos nesta ordem
1. **Lê a venda da casa.** Usa a mesma leitura de hoje (`lmBusca`, src/97-lamoneda.js) e grava no `S.fxHist` como da casa.
   - A nuvem não serve para isso: a La Moneda bloqueia servidores (erro 522).
2. **Garante a cópia na nuvem.** Usa a mesma sincronização de hoje. Se falhar, tenta de novo na próxima acordada e avisa no sino depois de 2 dias sem cópia.
3. **O Titan confere a mola** (Parte 2 · B) com a cotação do dia.
   - Só avisa no sino quando um preço precisa mudar (7 dias de alta / 30 de baixa). Fora isso, fica quieto.
   - Cada aviso também vira linha no Histórico do dia (Parte 1 · passo 9).
4. **Avisa as contas a vencer no dia.** Mesmo texto de hoje (`avisosVenc`, src/92-despesas.js), uma vez por conta por dia.

- **Onde vale:** só no APK, pela tarefa em segundo plano do Android. No Windows e no navegador nada muda: eles leem com o app aberto.
- **APK:** só sai quando o dono pedir (regra 21).

### NUVEM — avisar mensagens de clientes e de lojistas na hora
- Mensagem nova = um aviso no celular, com o mesmo som escolhido.
- Usa o mesmo caminho do aviso de pedido do site (src/97-push.js + a função da nuvem que já manda esse aviso), só com mais um gatilho: mensagem nova.
- **Quem faz:** a sessão NUVEM (functions/). O APP só mostra o aviso, que já sabe mostrar.

### Provas novas no Argus (Parte 3)
- A acordada chama **uma** função com os 4 passos, na ordem.
- Nenhum passo busca o mercado.
- A mola só avisa quando passa do limite.
- O aviso de conta sai uma vez por dia.

### Não dá para testar no simulador
- A acordada com o app fechado.
- O atraso do Android para poupar bateria.
- A leitura da La Moneda de verdade.

Esses três ficam para o aparelho real: Test Lab dentro dos 30 min grátis, ou o celular do dono.

---

## ORDEM DE ENTREGA DA FAMÍLIA (sugestão para a Fila)

1. Parte 1, passos 1–3 (nome, Início, escritório).
2. Parte 2, A + B + C + D (cotação, mola, colchão, IVA). Sem isso, Regras e Ofertas não têm números verdadeiros.
3. Parte 1, passos 4–6 (Regras, Ofertas, ficha + janela Oferta).
4. Parte 2, E + F (custo por compra, jeito do dono).
5. Parte 2 · G + Parte 1 · passo 7 (atacado). Junto, um recado à SITE para a conversão do dia no catálogo do lojista.
6. Parte 1, passos 8–9 (Ferramentas, Histórico).
7. Parte 3, primeiro a parte do APP; a da NUVEM em paralelo, pela sessão NUVEM.

Cada número é um item da Fila: implementar → testar → publicar → marcar feito com a versão. A ESBOCO confere as telas depois de cada publicação.
