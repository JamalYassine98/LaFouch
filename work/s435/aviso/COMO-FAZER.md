# Esboço 38: aviso curto (#lfToast) acima da barra e com a cor do tipo · S435 ESBOCO · 21/11 (achado na conferência da v586)

Imagens: esboco_aviso_curto_{escuro,claro}.jpg (celular, Despesas). Base: todos os aprovados (work/kit/base_app.py).

## Hoje (v587)
- A v586 subiu o `#lfToast` para z-index 9990, para aparecer por cima do Estúdio e da câmera. O lugar continuou `bottom:16px`,
  e por isso ele **tampa a barra de baixo inteira** (aviso 780–828 px, barra 777–844 px, celular 390×844) por uns 2–3 s.
  Na v584 ficava atrás da barra, com z-index 270. Os toques passam (`pointer-events:none`), mas a barra some debaixo dele.
- **Todo aviso sai verde**: são 109 chamadas de `lfToast(texto)` e uma cor só. Erros ("Não deu para verificar agora",
  "Não achei a peça no quadro da frente") e atenção ("Preencha à mão") saem com cor de "certo". Isso fere a regra 17.

## Proposta
- O aviso fica **8 px acima do que estiver embaixo**: a barra de baixo ou, com janela de baixo aberta, a borda de cima do botão dela.
  Na câmera, onde não há barra, fica a 16 px.
- Cor pelo tipo: certo = verde (`--ok/--okbg`) · atenção = amarelo (`--warn/--warnbg`) · erro = vermelho (`--bad/--badbg`) ·
  andamento ("Conferindo o código…") = neutro (`--fg/--panel2`). Letra 15/600, igual nos quatro.

## Como fazer (jeito natural, regra 12)
1. `lfToast(texto, tipo)` em src/88-movimento-novo.js, com tipo `'ok' | 'atencao' | 'erro' | 'andamento'`. Sem tipo, é `'ok'` (o padrão de hoje).
   Passar pelas 109 chamadas e dar o tipo a cada uma (a frase diz qual). A cor vem de uma classe no elemento (`.t-ok`, `.t-atencao` …), definida no CSS uma vez só.
2. **Um "chão" só:** a variável CSS `--chao` (altura ocupada embaixo) é escrita por quem ocupa o fundo: a barra quando aparece,
   `lfJanela` quando abre ou fecha, a câmera com 0. O `#lfToast`, o `#qchip`, o `#inLixo` e a `.estBarra` usam
   `bottom: calc(var(--chao) + 8px)`. Hoje cada um tem o próprio número (16, 86, 132, 18 px). Apagar esses números no mesmo passo.
3. A ordem de camadas fica a do item 12c (uma ordem só): o aviso vai acima de janela e câmera e abaixo de tranca e erro de salvar.
4. Trava no porteiro: aviso visível nunca cruza o retângulo da barra nem o do botão da janela aberta, em 390/820/1366 px.
   Cada chamada de `lfToast` tem tipo, e uma frase com "Não"/"erro" não usa `'ok'`.
