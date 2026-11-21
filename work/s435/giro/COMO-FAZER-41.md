# Esboço 41: Estúdio mostra o que cada peça tem · Galeria da peça · câmera diz para qual peça vai · S435 ESBOCO · 21/11

Pedido do dono (20/11 23:36, recado da APP): "no Estúdio não há nenhum indicativo de que a peça já tem fotos/giro, nem GALERIA para conferir
a frente, a 3/4 e TESTAR o giro (girar com o dedo)". Mais o caso real: o giro gravado pela fila caiu na 1ª peça da fila (BR44140) com a
armação de outra peça (BR44118). "Vale deixar claro, ANTES de gravar, para qual peça a foto vai."

Imagens:
- esboco_41a_estudio_lista.jpg: Hoje × Proposta × Galeria
- esboco_41b_camera_para_qual_peca.jpg: a câmera do giro, deitado

Base: app v587 + aprovados, dados de teste. Pela base, as 24 peças da fila têm a frente e não têm a 3/4 nem o giro.
A Galeria mostra o giro como o da BR44140 do teste do dono, só para mostrar o estado "tem giro".

## O que muda
1. **Lista do Estúdio:** debaixo da cor, três marcas sempre na mesma ordem, **Frente · 3/4 · Giro**: bolinha verde = tem, anel = falta.
   A frase "· falta a foto de 3/4" sai, porque as marcas dizem o mesmo e mais.
   O link da linha passa de "Ficha ›" a **"Galeria ›"**. A Galeria tem o "Ver a ficha da peça ›" no fim.
   Tocar na linha continua fotografando o que falta, como hoje.
2. **Galeria da peça** (lugar: tela própria, "‹ ESTÚDIO", título = nome da peça, frase = a cor):
   - FRENTE: a foto e "Refazer ›".
   - 3/4: a foto e "Refazer ›". Se faltar, o lugar tracejado "Falta a foto de 3/4" e "Tirar agora ›".
   - GIRO · 360°: o giro tratado. **Arrastar com o dedo gira** a peça, com a barra do ângulo, "136° de 360°" e "gravado hoje · 0:48", e "Refazer ›".
     Se faltar, o lugar tracejado e "Gravar agora ›".
   - Fim: "Ver a ficha da peça ›".
3. **Câmera do giro:** no lugar de "Giro · volta de 360°", "GIRO PARA" + **nome da peça** (até 2 linhas) + **cor** + **código**.
   Quem grava vê antes para qual peça vai. Se a lista não couber, a letra do grupo diminui (`c149Cabe`, conferido: os 10 itens cabem a 844×390).
   No modo Foto vale o mesmo ("FOTO PARA" + peça).

## Como fazer (jeito natural, regra 12)
- **O que a peça tem, num lugar só:** uma função `estTem(k)` → `{frente, tres4, giro}`:
  - frente = `S.fotos[k]` com nota ≥ 75 (a mesma regra da `estFila`)
  - 3/4 = `S.fotos[k+'|34']`
  - giro = `S.giroSite[ref]` (o giro é do modelo, então vale para todas as cores do mesmo ref)
  A `estFila` passa a usar `estTem` (hoje ela decide com a própria conta: linhas 30–34), e a lista e a Galeria leem dela. Sai a frase `sub` de "falta".
- **Galeria = uma tela** no arquivo do Estúdio (`estGaleria(k)`), aberta pela pilha da navegação (lugar, com "‹ ESTÚDIO").
  Os "Refazer ›" e "Tirar agora ›" chamam `estSessao([x])` com o passo certo (`frente`, `34`, giro). O mesmo caminho da fila; nenhum novo.
- **Girar com o dedo:** o site já tem o tocador do giro (catalogo `js/lf-site.js`, botão `data-g360`). O app usa **a mesma conta**:
  posição do dedo → quadro do giro. Aqui é para conferir antes de ir ao site. Se der para dividir o código entre os dois, melhor; se não, a regra é a mesma.
- **Câmera:** `estCam(ctx)` já recebe `ctx.ref` e `ctx.cor`. A `.ecTag` nasce com "GIRO PARA / FOTO PARA" + nome (`pn(ref)`) + cor + ref.
  Não deixa de ser texto fixo para virar outra coisa por cima.
  **Causa do caso BR44140:** a gravação vai para o `ctx.k` da sessão; se quem grava mudou a peça no prato, o app não sabe.
  O nome na tela é o aviso. Conferir a armação pela imagem (comparar com a frente já guardada) fica como ideia para depois.
- **Trava no porteiro:** cada linha do Estúdio tem 3 marcas que batem com `estTem`; "Galeria ›" abre a tela da peça certa;
  a `.ecTag` da câmera contém o ref da sessão; a lista de 10 itens cabe a 844×390 e 740×360.

## DECISÃO DO DONO (21/11 07:54) — substitui a condição de 07:51
"Ele faz gravar a volta, e se tiver cadastro acrescenta diretamente a peça e guarda na galeria; se não tiver, ele guarda na galeria,
e eu posso cadastrar o produto na aba de Inventário e escolher da galeria a foto desse produto para o cadastro."
- **Gravar a volta sempre funciona.**
- **Peça cadastrada:** o giro (com a frente e a 3/4) vai direto para a peça ("GIRO PARA" + nome, cor e código na câmera) e fica na Galeria.
- **Sem cadastro:** o giro fica na Galeria como **"sem peça"**. Na câmera aparece "GIRO SEM PEÇA · vai para a Galeria".
- **No cadastro (Inventário › Adicionar)** e no Editar › Cores e fotos: "Escolher da Galeria ›" abre os giros e fotos sem peça.
  Ao escolher, eles passam para a peça e a cor, e saem de "sem peça".
- Como fazer: um lugar só para o que foi gravado, a Galeria (`S.galeria`, itens `{id, ts, giro, frente, tres4, ref|null, cor|null}`).
  `giroGrava` sempre grava ali; com `ctx.ref` cadastrado, liga na hora (`galLiga(id, ref, cor)`, a mesma função do "Escolher da Galeria").
  Sem caminho paralelo: a Galeria da peça (esboço 41) e a "sem peça" leem a mesma lista.
- Esboço da parte nova (Galeria sem peça + "Escolher da Galeria" no cadastro): work/s435/giro/esboco_41c_*.jpg.
