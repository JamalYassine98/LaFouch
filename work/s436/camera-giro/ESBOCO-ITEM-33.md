# Item 33 — Giro no celular real: clarão, volta que não fecha, "carrega e não faz nada" (20/11/2026)

Conserto por dentro (regra 6b): nenhuma tela, botão ou texto novo. Este arquivo é o esboço/"como fazer" (regra 11/12).
Pedido do dono (20/11 21:15–21:41, com dois vídeos da tela do celular):
1. dá um clarão ao tocar em gravar; 2. ao concluir a volta não fecha a câmera sozinho; 3. não separa a frente e a 3/4 e,
ao pedir o tratamento, "carrega mas não faz nada"; 4. no fim não guarda foto, nem vídeo, nem nada: "simplesmente some";
5. "o tratamento não está funcionando, use a versão do site como referência".

## O que os vídeos mostram (medido quadro a quadro)
- Toque em gravar aos 0,8 s do vídeo. Parede do fundo (RGB): antes 157/152/164 → 253/253/253 durante ~1 s → 153/154/155.
  No canto: "Este aparelho não deixa travar foco e luz" (a v585 tentou travar, viu a imagem mudar e soltou).
- A peça ficou parada até os 9,2 s da gravação; depois o prato girou. O quadro dos 57,8 s é igual ao dos 17,0 s:
  a volta dura ~40,8 s. A volta completou aos ~50 s e a câmera foi até 1:00 sem fechar.
- Depois: "Qual é a frente?" abriu no 1º quadro (rosado, ainda saindo do clarão); "Usar como 3/4" → "Aplicando a luz de
  estúdio" por 2,2 s → nada na tela.

## Causas (regra 12a)
1. **Clarão.** No Android o navegador do app (Chromium, `VideoCaptureCamera2.java`) não congela foco nem luz no valor em uso:
   - luz `manual` = automático DESLIGADO com `mLastExposureTimeNs` (o último tempo de exposição que ele guardou — para de ser
     atualizado no 1º `applyConstraints`, e a câmera do Estúdio manda o zoom ao abrir) e ISO só se a página mandar; o ISO que
     `getSettings()` devolve é o do PEDIDO, não o que o automático escolheu;
   - foco `manual` = lente na distância do PEDIDO (`1 / mCurrentFocusDistance`), não onde o foco automático a deixou;
   - branco `manual` = `CONTROL_AWB_LOCK` (trava de verdade, no ponto em que está); com temperatura vira um de 7 presets.
   Só o branco dá para travar sem mexer na imagem. A tentativa-e-conferência das v584/v585 era remendo (dependia de sorte).
2. **Volta não fecha.** `gtVolta` casava a gravação INTEIRA com ela mesma desde o 1º segundo — mas o começo é a peça parada
   (a própria câmera diz "Ligue o prato agora" depois do toque). Com o prato ligado aos 9 s a volta de 41 s nunca casa.
   A prova antiga do porteiro só girava desde o segundo 0. Além disso a volta tratada era sempre a do 1º segundo do vídeo
   (`t0 = min(1, …)`), isto é, com o trecho parado dentro.
3. **"Carrega e não faz nada" / "some".** `#lfToast` tinha z-index 270 e o Estúdio 360–430: todo aviso com o Estúdio aberto
   era desenhado ATRÁS dele (21 avisos). O app disse "Não deu a volta inteira…" e "Não achei a peça no quadro da frente" —
   ninguém viu. E a escolha à mão fechava a tela antes de tratar: sem peça no quadro, a gravação era jogada fora.
   (O tratamento de foto `estProcessa` não serve para o quadro cru da tenda: num quadro de frente do vídeo do dono deu nota 45
   com a "peça" = o quadro inteiro. Quem serve para a tenda é o `giroTrata` — o `trata_giro2.py` do site — que só roda com a volta.)

## Como fazer (jeito natural, um lugar só, apaga o que substitui)
- **Trava** (`c149Trava`, 98z-camera-u149f.js): só `whiteBalanceMode: 'manual'`. Saem `c149Olha`, `c149Mudou`, `C149_MUDOU`,
  a espera de 900 ms e todo valor (ISO, exposição, distância, temperatura). O texto diz o que está fixo de verdade.
- **Volta** (`gtVolta`/`gtFechou`/`gtPrimeira`, 97-giro-trata.js): os últimos 3 s × o que a câmera viu T antes; só trecho em que
  o prato girava vale como "uma volta antes"; brilho igualado (`gtIguala`). Uma regra para a câmera ao vivo e para o vídeo gravado.
- **Tratamento** (`giroTrata`): a volta tratada termina onde fechou (`t0 = fim − per`). Ao parar a gravação, vai sempre para o
  tratamento (com a volta ao vivo ou procurando a volta no vídeo); `giro-curto` → aviso + escolha à mão (`estGiroSemVolta`).
- **Aviso** (`#lfToast`, style.css): z-index 9990 — acima de toda tela/janela, abaixo do cadeado e do carregando.
- **Escolha à mão** (`estGiroEscolhe`): só fecha quando a frente serve (`estFotoServe`: achou a peça e nota 60+); senão avisa e
  volta ao passo da frente; erro fecha o carregando e avisa.
- **Diário** (`camDiario`): `[LF-CAM] …` no console (sai no `adb logcat`), para o próximo defeito de celular real ter números.

## Provas
- Porteiro: "Item 33a" (trava), "Item 33c" (aviso por cima), "Item 33d" (escolha à mão), "S361 + item 33b" (volta com o prato
  ligado depois, luz variando, vídeo gravado).
- `detector_antigo_x_novo.js` + `estresse.js` (poses do giro de referência BR44118, ruído e luz medidos no vídeo do dono):
  prato de 18–45 s, parado 0–14 s → NOVO 299/300 certos (1 sem tempo em 60 s), 0 antes da hora, erro da volta ≤ 2°;
  ANTIGO 55/300 (141 nunca fecham). Caso do dono (9,2 s + 40,8 s): 60/60, fecha 1–2 s depois da volta.
- `video_do_dono.js` (assinaturas do vídeo do dono + a volta repetida): NOVO fecha aos 54 s, volta 40,99 s; ANTIGO não fecha.
- `ponta_a_ponta.py` (câmera = as poses de verdade, parado 9 s, volta 20 s, gravador e tratamento de verdade no simulador):
  fecha aos 31 s (volta 20,02), trata em 62 s, giro de 360 imagens começando pela frente, frente e 3/4 nota 100
  (`ponta_a_ponta_giro.jpg`, `ponta_a_ponta_fotos.jpg`). `video_gravado.py`: sem a volta ao vivo, o tratamento acha a volta no
  vídeo (19,99 s, começo aos 12,5 s); vídeo sem a volta inteira → `giro-curto`.

## NÃO testado em aparelho real
- Tudo acima rodou no simulador. No celular: a trava de branco, o tempo do tratamento (no PC ~60 s), o gravador H.264 do aparelho.
- Limite de 60 s (dono 19/11 20:01): com o prato de ~41 s por volta, ele precisa ser ligado até ~15 s depois do toque em gravar.

## Para o dono decidir (não mexi)
- A escolha à mão ("Qual é a frente?") quase nunca acha a peça no quadro cru da tenda. Proposta: sem a volta inteira, só avisar
  e pedir para gravar de novo (sem a tela de escolha). Sai ou fica?
- O diário `camDiario` é código novo que não está na planta (regra 12d): fica como ferramenta de conserto ou sai?

---

# Itens 34 e 35 (v587, 20/11/2026 22:30) — depois do teste do dono na v586

O dono testou a v586 e mandou dois prints: "Tratando o giro · 19% · Achando a frente" (22:25) e, dois minutos depois,
"Qual é a frente?" com o aviso "Não achei a peça no quadro da frente" (o aviso agora aparece). Sem clarão e a volta fechou.

## Item 35 — por que o tratamento parava no celular (causa de raiz)
- `giroTrata`, ao começar a gravar o giro tratado, pedia `giro/mp4-muxer.js` (ou `webm-muxer.js`) com um `<script>`.
- Esses dois arquivos entraram no projeto em 15/11 20:23 (v528). O último APK é de 15/11 13:49 (commit 39b183c50).
- A atualização automática só leva `app.js` e `style.css`. O resto de `www/` é o do APK. Logo, em todo aparelho com o aplicativo
  instalado, os dois arquivos NÃO EXISTEM: o tratamento nunca terminou fora do simulador. (`git diff 39b183c50 HEAD -- www/`:
  fora `www/loja/`, os únicos arquivos novos eram os três de `www/giro/`.)
- Reproduzido: v586 servida sem a pasta `giro/` → fecha a volta, trata até o fim de "Achando a frente", erro
  `biblioteca Mp4Muxer`, cai na escolha à mão (`reproducao_v586_sem_bibliotecas.txt`).
- Como fazer: o que o app precisa vai DENTRO do app.js. `lib/*.js` → `APP_LIBS` (texto) → `appLib` lê na hora do uso.
  Texto, e não código, porque as bibliotecas usam escrita de 2020 e o app é ES5: aparelho antigo não deixaria de abrir o app.
  Saem `gtLib` e `www/giro/`. Trava: lista `tests/www-do-apk.json` — arquivo novo em `www/` reprova o porteiro.
- Provas: `ponta_a_ponta_v587_sem_arquivo_solto.txt` (mesmo ensaio, agora termina: giro de 360 imagens + frente e 3/4 nota 100);
  com o gravador H.264 "desligado" à força, o caminho VP8/webm também termina (video/webm;gn=360).

## Item 34 — "corrija 'Qual é a frente?'" (dono 20/11 22:18)
- As duas imagens escolhidas iam cruas para o tratamento de FOTO, que não serve para a tenda.
- Como fazer: o tratamento de UMA imagem do giro sai de dentro do `giroTrata` para `gtTratador` (texto movido sem mudar) e a
  escolha à mão passa a usar ele (`giroFotos`: fundo aprendido de até 24 imagens da gravação).
- Equivalência do `giroTrata` antes × depois de mover: mesmo vídeo → `info`, fotos (0°, 45°, 90°, 200°), capa e quadro idênticos.
- Conferido com 38 quadros do vídeo do DONO (tenda e prato de verdade): as duas fotos saem de fundo branco, nota 100.

## NÃO testado em aparelho real (v587)
- O tratamento inteiro no celular (tempo; gravador H.264 do aparelho ou o VP8 de reserva). O diário `[LF-CAM]` mostra cada fase.
