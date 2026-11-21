# Esboço 44: cadastro do Inventário no padrão · S435 ESBOCO · 21/11 (diagnóstico aprovado pelo dono às 10:07)

Imagens (celular escuro, Hoje × Proposta):
- esboco_44a_adicionar.jpg: Inventário › Adicionar
- esboco_44b_passo1_modelo.jpg: Nova peça, passo 1 (o modelo)
- esboco_44c_passo2_cores.jpg: Nova peça, passo 2 (cores e fotos)

Base: aprovados (base_app) + 41 / 41c (Galeria do app, giros "sem peça") + 42 ("Nova cor" sem foto obrigatória, janela de baixo).

## O que muda
**Adicionar**
- O botão "Foto" vira **"Ler etiqueta"**, com o ícone de etiqueta. Faz o mesmo de hoje (`fmAnalisa`: código, grau e quantidade da etiqueta, caixa ou pacote), agora com o nome certo.
- Entra **"DA GALERIA · SEM PEÇA · N"**, com os cartões do 41c, acima de "Dar entrada de novo".
  Tocar num giro abre a Nova peça já com esse giro como a primeira cor.
- **Sai "Dar entrada de novo"** (dono 21/11 10:15: "polui a tela"). Dar entrada numa peça que já existe continua pela ficha (quantidade +) e por "Chegou mercadoria". Apagar `renderDeNovo`, `#addDeNovo` e o CSS deles (97-entrada-de-novo.js), se nada mais os usar.
- "Chegou mercadoria" e "Preencher à mão" ficam.

**Passo 1 · o modelo** (título "Nova peça", "Passo 1 de 2 · o modelo")
- **Campos em linha** (rótulo versalete 11 + linha fina), não em caixa. Isso vale para o Código da haste (com o ícone de ler à direita) e o Custo.
- Tipo fica no trilho de 4 opções, como hoje.
- **Formato, Material e Gênero viram linhas "escolher ›"**, que abrem a janela de baixo de escolher (tarefa).
  Depois de escolher, o valor aparece à direita, em cinza.
- "Mais detalhes (opcional)" vira linha com **⌄** e abre no lugar (ler).
  Dentro: Nome, Descrição (sem a frase "ao tirar a foto, o app sugere") e Lote de origem.
- O botão "Continuar · cores e fotos" fica **fixo embaixo** da janela, para não sumir rolando.

**Passo 2 · cores e fotos**
- **"‹ O MODELO"** em versalete, na família Voltar, no lugar do botão "‹" quadrado. O subtítulo diz "Passo 2 de 2 · código · tipo".
- "DA GALERIA · SEM PEÇA": tocar num giro faz dele uma cor desta peça (pede o nome da cor na janela "Nova cor" do 42).
- "CORES DESTA PEÇA · N": linha por cor, com a foto, "C1 · Preto", as marcas Frente · 3/4 · Giro (as do 41) e a quantidade −/+.
- **"+ Nova cor ›"**, a mesma do 42: a cor sem foto entra e a foto vem pelo Estúdio.
- **"No site"** em linha, com o interruptor, sem cartão.
- "Concluir" fica fixo embaixo. Sai "Toda cor liberada precisa de foto. TS1234", porque a regra continua mas o interruptor já explica sozinho.

## Como fazer (jeito natural, regra 12)
- **Campo:** uma função de campo de cadastro (linha), usada por todos os campos do cadastro e do Editar produto (134d).
  Sai a caixa `.in` só nesses formulários, e o tipo LINHA/CAIXA segue a regra 149c3.
- **Escolher:** Formato, Material e Gênero usam a mesma janela de escolha (`lfJanela` com a lista, a primeira opção marcada, "Salvar").
  Saem as pílulas com ▾ (`nv_fmt`/`nv_mat`/`nv_pub`) e o desenho próprio delas.
- **Mais detalhes:** a dobra do app (a mesma de `dFold`, ver 4c). Sai o `<details>` com o ▸ do navegador.
- **Botão fixo:** a janela de baixo grande já tem o lugar do botão embaixo (acabamento aprovado, `acabJan`). O "Continuar"/"Concluir" vai para lá.
- **"Foto" → "Ler etiqueta":** um só `btnFoto.onclick`. Hoje há dois (13-estoque-lote-rapido.js:439 e 87-foto-modelo.js:607, e o 2º apaga o 1º); o do arquivo 13 sai.
- **Cor nova:** a função única do 42 (`corNova`). A cor a partir do giro da Galeria chama `galLiga(id, ref, cor)` (41c).
- **Trava no porteiro:**
  - Nenhum `<details>` no cadastro.
  - Nenhum campo do cadastro com borda de caixa.
  - Formato, Material e Gênero abrem `.ljJn`.
  - Existe um só handler de `btnFoto`, e o rótulo é "Ler etiqueta".
  - O botão de seguir fica visível sem rolar, a 390×844.

## Atualizado pelo rumo de 21/11 10:43 (esboço 45)
- **Adicionar** fica só com **"Chegou mercadoria"** e **"Preencher à mão"**. Saem "Ler haste", "Ler etiqueta"/"Foto" (a peça com foto nasce no Estúdio) e "Da Galeria".
- O **passo 1 e o passo 2** deste esboço passam a ser o **"Preencher à mão"** (peça sem foto: pré-graduado em pacote, brinde).
  No passo 2 a cor entra **sem foto** ("a foto vem pelo Estúdio"). Sai a parte "Da Galeria".
- A peça com foto é completada pela janela "Completar" do 45.
