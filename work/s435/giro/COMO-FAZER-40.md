# Esboço 40: câmera do giro, "Câmera reta" e "Peça reta" · S435 ESBOCO · 21/11 (pedido do dono 20/11 23:29, recado da APP)

Imagens:
- esboco_40_camera_reta_peca_reta_deitado.jpg: Hoje, celular torto, peça torta, tudo reto
- esboco_40_camera_reta_peca_reta_empe.jpg: em pé fica igual a hoje

Base: app v587, Estúdio › Começar › Vídeo, com a cena falsa do simulador e todos os aprovados.

## O que muda
1. **"Celular deitado" vira "Câmera reta"** (o mesmo item, um nível mais exigente). É verde só com o celular deitado **e** nivelado (|inclinação| ≤ 1°),
   lido pelo mesmo sensor do modo Foto (o `#ecLvl`, "Reto", 97-estudio.js:894). A frase diz o lado e os graus: "Endireite o celular: 3° para a direita".
   O **horizonte das guias** (as duas linhas laterais do 149cam-G) gira com a inclinação real e fica amarelo, com o número em graus.
   A linha tracejada branca mostra onde é o reto.
2. **Item novo "Peça reta"**, depois de "Peça no prato". Com a peça de frente, mede pela imagem **a altura do topo de cada lado da armação**
   (a caixa de cada metade da peça, a mesma medida do `medeQuadro`). Lados diferentes = armação torta no prato.
   A guia: um traço sobre o topo de cada lente, a linha tracejada no nível do lado mais alto e uma seta no lado que precisa subir.
   A frase: "Endireite a armação no prato: o lado direito está baixo".
3. **Em pé:** nada muda (só "Deite o celular", sem lista), como hoje.
4. A lista fica com 11 itens. Cabe na coluna da esquerda (conferido deitado a 844×390). A letra do grupo diminui só se precisar (`c149Cabe`, L4).

## Decisão aberta do dono (já registrada pela APP)
Só o aviso, ou também o tratamento (`gtTratador`/`giroTrata`) corrigir uma inclinação pequena girando o giro inteiro no mesmo ângulo?
Este esboço mostra **só o aviso**. Se o dono escolher corrigir, o "Peça reta" continua avisando e o tratamento endireita até ±3°, uma conta só para os 360 quadros.

## Como fazer (jeito natural, regra 12)
- **Um sensor, uma função:** o nível em graus hoje mora no modo Foto (97-estudio.js `ori` + `#ecLvl`).
  Ele passa para uma função só (ex.: `camNivel()` → graus ou null), usada pelo modo Foto **e** pelo conferidor do Vídeo
  (`confereGiro(mm, {emPe, nivel, …})`, 98z-camera-u149f.js). O `emPe` sai do tamanho do vídeo e o `nivel` sai do sensor.
- `C149_IT`: `['deitado','Celular deitado']` vira `['reto','Câmera reta']` e entra `['preta','Peça reta']` depois de `'peca'`.
  O `add('deitado',…)` da linha 54 vira o item `reto` (deitado **e** |nível| ≤ 1°). Sai o item velho: não ficam os dois.
- **Peça reta:** `medeQuadro` já acha a caixa da peça. Medir o topo da metade esquerda e da direita (a coluna de pixels escuros mais alta
  de cada metade) e guardar `mm.pecaTopo = {e, d}`. O item fica `ok` quando |e − d| ≤ 2% da altura do quadro, por 4 leituras seguidas
  (a mesma regra de "bons" dos outros itens).
- `c149Guias`: as linhas do horizonte nascem giradas por `nivel` (uma conta, sem desenho novo). Os traços da peça reta entram na mesma função, na mesma cor de regra (`C149_V`/`C149_A`).
- **Trava no porteiro:**
  - Com nível 3° o item `reto` fica `false` e a frase cita "3°". Com nível 0, fica `true`.
  - Uma cena com a peça girada 4° deixa `preta` em `false`; a cena reta deixa `true`.
  - A lista com 11 itens cabe (c149Cabe) a 844×390 e a 740×360.

## DECISÃO DO DONO (21/11 07:51): "Faz as duas coisas"
O aviso fica, como no esboço. **O tratamento também endireita**: no `giroTrata`, depois de achar a frente, mede a diferença de altura
dos dois lados nos quadros de frente. Se a inclinação for de até ±3°, gira os 360 quadros no mesmo ângulo (uma conta só, no mesmo recorte).
Acima de 3° não endireita: fica o aviso para refazer. A frente e a 3/4 saem do giro já endireitado. Trava: uma cena com a peça a 2° sai reta; a 5° não mexe e avisa.
- **Extra do dono (21/11 07:54):** se a peça já estiver reta, o tratamento **não mexe** (não gira nem reamostra os quadros).
  "Reta" é a inclinação medida abaixo da tolerância do item "Peça reta" (|e − d| ≤ 2% da altura, por volta de 0,5°). Trava: uma cena reta sai byte a byte igual ao tratamento sem a correção.
- **Extra do dono (21/11 07:54):** se a peça já está reta, o tratamento **não mexe** (nenhuma rotação nem reamostragem). Só endireita quando a inclinação medida passa da folga de "reta" (a mesma do item Peça reta, ≤ 2% de diferença de altura ≈ 1°). Trava: uma cena reta sai **idêntica** byte a byte ao tratamento sem a correção.
