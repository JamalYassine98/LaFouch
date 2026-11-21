# IDEIAS 01 · Descubra seu formato — mais preciso e resultado elegante (para o SITE)

Pedido do dono 21/11 09:53: "melhorar para ser ainda mais preciso" e "mostrar o resultado de forma elegante; hoje fica um desenho em roxo do formato, de forma amadora".
Dono 21/11 10:21: "não tem como medir sob essas formas (perto, cabeça torta)?" e "precisamos atualizar a descrição dos formatos de rosto". Dono 21/11 12:13: "a descrição precisa ser dos modelos que combinam e não do formato do rosto". Dono 21/11 13:50: "a câmera precisa ser extremamente boa" (Parte A, abaixo na parte 2) + mais formatos e mais filtro (Parte B, a seguir).
Base: site real 1795269030, celular. Esboços: `esboco-01-resultado.jpg`, `esboco-02-camera.jpg` + vídeo `esboco-06-camera-video.mp4` (Parte A, Hoje × Proposta lado a lado, mesmo manequim e mesmo roteiro: virado → boca aberta → pouca luz → parado; Hoje ~20 s até o resultado, Proposta ~11 s; a versão anterior foi para work/obsoletos/ideias-01-camera-v1), `esboco-03-formatos.jpg`, `esboco-04-precisao.jpg`. Ferramentas: `copias.py`, `captura.py`, `camera2.py`, `video.py`, `manequim.py`, `serve.sh`, `vitrine.py`, `simula.py`, `compara_formato.py`, `prancha.py`.

## Aprovados incluídos
- 11/11 15:29–15:32 (dono): tirar o desenho em volta do rosto do cliente e trocar a foto pela **ilustração do formato** (opção A) — nunca implementado; é a parte 1 abaixo.
- 11/11 15:20 (dono): mais pontos = mais precisão, **sem regra nova por formato** (vale para a parte 2).
- 11/11 15:29 (dono): visual e análise **simples** (S178 recusado: nada de malha, %, "como medimos" para o cliente).
- 19/11 12:26: o formato da câmera fica só no celular do cliente, vale a última leitura (já é o `lf_rosto5`; nada muda).
- 19/11 12:17 caminho final câmera → modelos → Comparar → provador (esta ideia só melhora o 1º passo).

## Parte 1 — resultado elegante (muda tela: espera o "implementar")
O que muda (é tudo o que o comparador encontrou nas telas do formato):
1. Sai o círculo com a foto do cliente, o contorno roxo/branco e o anel de cor (`.faph` + o `canvas#facv`).
2. Entra um quadro rosado 224×176 (mesma cor do quadrinho `.rzp` da lista "Escolha o seu formato") com a ilustração do formato que deu: Todos = homem e mulher, Feminino = só ela, Masculino = só ele.
3. Conserto junto (erro de hoje): com "Seu rosto também tem traços de X", tocar em Feminino/Masculino trocava a dica e a contagem para o formato X (o código pegava o primeiro `[data-fause]`, que é o link do 2º formato).

Jeito natural (regra 12):
- `faResult(res)` passa a receber só o resultado (não precisa mais da foto): sai o parâmetro `cv` e o `r` dos que chamam (`faRun`), sai o bloco que desenha no canvas (≈10 linhas) e as regras `.faph`/`.faph canvas` do index.html.
- A ilustração é a MESMA peça da lista: `.rzi` com a máscara `f.m`/`f.f` (uma família só; nada de imagem nova). O quadro é `.faill`; a escolha de gênero só muda `data-fagenv` e o CSS esconde a outra (`.faill[data-fagenv=f] [data-g=m]…`) — nada é redesenhado.
- O formato do resultado fica em `.fares[data-faid]`; o clique de gênero lê dali (sai o `document.querySelector('[data-fause]')`).
- Trava no porteiro: prova "resultado do formato" — abre o resultado com `close:true`, toca Feminino e confere que a dica continua a do formato principal; e que não existe `canvas` nem foto dentro de `.fares`.
- i18n: nenhuma frase nova.

## Parte 2 (Parte A do dono) — câmera muito boa e medida precisa
Teste com um **manequim** (`manequim.py`: o rosto-padrão de 478 pontos do leitor desenhado em vídeo, sem pessoa real) na câmera do simulador, no site de verdade (`camera2.py`, `cap/c2.json`):
- **Virado 35°**: diz "Chegue um pouco mais perto" e nunca sai daí (a leitura ao vivo é a face-api pequena, que não vê giro).
- **Boca aberta**: conta 3-2-1, mede e dá **Diamante**; o mesmo manequim de boca fechada dá **Redondo** (3 leituras iguais).
- **Pouca luz**: tira a foto escura (só clareia a cópia para medir).
- **Tempo**: do "Perfeito!" ao resultado ~12 s no simulador (3-2-1 + ~8 s analisando a foto).
- Simulação (`simula.py`, `esboco-04-precisao.jpg`): o site endireita o giro mas não desfaz a distância — a mesma pessoa a 25 cm sai ~14% mais "comprida" do que a 45 cm.

Jeito natural (um leitor só, do começo ao fim):
1. **Leitor ao vivo = o da medida**: MediaPipe em modo VIDEO no `camLoop` (sai o `TinyFaceDetector` da câmera; face-api fica só de reserva, já aprovado), com `outputFaceBlendshapes:true` (o `face_blendshapes.tflite` já vem dentro do `face_landmarker.task` do site).
2. **Um aviso por vez, numa lista de prioridade** (uma função): sem rosto → pouca luz → rosto fora do oval → virado mais de ~30° ("Vire o rosto para a câmera") → boca aberta/sorriso/olhos fechados pelos blendshapes ("Feche a boca e relaxe o rosto") → tremido. Perto ou inclinado NÃO pede nada: corrige (item 4).
3. **Luz da tela**: com pouca luz (a mesma conta de brilho do `mpLuz`), o fundo em volta do oval fica quase branco e ilumina o rosto, como o "flash" da câmera frontal; volta ao normal ao sair.
4. **Medir mesmo perto ou torto**: endireitar (já existe, `mpFront`) e desfazer a perspectiva — distância pela íris (11,7 mm) e lente frontal típica; cada ponto volta ao tamanho real pela profundidade (x·(D−z)/f).
5. **Anel no lugar do 3-2-1**: quando está tudo certo, um anel verde enche em ~1,5 s em volta do oval lendo o vídeo; usa os quadros mais de frente, com a boca fechada, e tira a mediana. Se a 1ª metade e a 2ª metade derem formatos diferentes, mede de novo sozinho ("Mais um instante…"). O resultado sai na hora (sem a foto de ~8 s); o botão de foto continua para quem quiser tocar. **Tela "Analisando seu rosto…"** (dono 21/11 15:52): sai do caminho da câmera (o anel já é a espera); fica só para foto da galeria, e só enquanto analisa de verdade — sai a espera mínima artificial de 1,5 s do `faRun` (`wait=Math.max(0,1500-…)`).
6. **Medir direto nos 478 pontos**: comprimento 10↔152, maçãs 234↔454, testa 54↔284, mandíbula 172↔397, queixo pelo ângulo 172-152-397. Saem `M68`, `mp68`, `MOFF` e o `faMeasure` da leitura de 478.
7. **Uma conta para os formatos**: cada item da tabela FACES tem as proporções de referência; ganha o mais perto (sai o bloco de fórmulas de `faShape`). Âncora: rosto-padrão = Oval; ajuste final com o modo teste (`?rostoTeste=1`) em pessoas cujo formato o dono conhece.
- Travas no porteiro: o manequim (`manequim.py`) vira prova — de frente, perto, inclinado 10° e virado 15° dão o mesmo formato; boca aberta não mede; virado 35° pede "Vire o rosto"; `simula.py` dentro de 1%.
- A confirmar no celular real: os ~1,5 s do anel (o leitor precisa de ~10 quadros/s; com a placa de vídeo, `delegate:'GPU'`, que o site já usa).

## Parte 3 — descrição dos formatos (muda tela: espera o "implementar")
Achados:
- A regra que decide as peças de cada rosto está no APP (`ROSTO_DE` em src/64-identidade.js) e os textos do site foram escritos à mão em 4 lugares (`FACES.dica`, `RZ_C`, guia, `drawRes`) — e se contradizem: Diamante diz "gatinho ou ovais", mas peça gatinho é marcada Oval+Coração; Redondo recebe armação Oval; **nenhuma peça é Diamante nem Alongado** → o aviso diz "Rosto diamante · 18 modelos" e mostra o catálogo inteiro.
- No celular, o 1º toque num formato da lista (menos Oval) não faz nada: gira o carrossel escondido `#fcar` (`faceGo`); só o 2º toque abre o catálogo.
- O artigo "rosto" do guia nunca roda (`guiaAbre('rosto')` vai para a página do formato) — código morto, com o `FX5`.

Jeito natural (planta do banco aprovada 19/11 23:03: "o site calcula num lugar só … rosto"):
1. **Uma tabela só**: cada item de `FACES` tem `fm` (formatos de armação que combinam, com os nomes do app) e `pq` (por que combinam). A descrição é **dos modelos** e sai do `fm`: `faMod(f)` = "Quadradas, retangulares e hexagonais" (Oval, com 6+ formatos = "Quase todos os modelos"); `faDica(f)` = "Armações quadradas, retangulares e hexagonais: as linhas retas dão estrutura e alongam o rosto." Sai o `dica` escrito à mão, o `RZ_C` e o `f.dica=LFI.tn(f.dica)` do espanhol (as partes se traduzem uma a uma: nomes em `FMP` + `pq`).
2. O site calcula `p.rosto = rostoDe(p.fm)`; peça sem formato = nenhum rosto (sai o `['oval']` inventado). No APP saem `ROSTO_DE` e o campo `rosto` (recado para APP depois do "implementar").
3. Onde a descrição aparece, tudo pelo `faMod`/`faDica`: lista "Escolha o seu formato" (`<small>` = `faMod`, uma linha), resultado da câmera, aviso do catálogo (`drawRes`) e cartões do PC (`drawFaces`, com o `faMod` curto: 1 linha em todos, os desenhos ficam do mesmo tamanho — com a frase longa ficavam de tamanhos diferentes).
4. Toque na lista abre o catálogo do formato na hora: o desvio `faceGo` vale só para o carrossel `#fcar` (que só aparece no PC), nunca para a linha `.rzr`.
5. Sai o artigo "rosto" do guia + `FX5` (código morto).
6. Tabela proposta (confirmar com o dono; ES vai no lf-i18n.js):

| Rosto | Modelos que combinam (lista) | Por quê (resultado) |
|---|---|---|
| Oval | Quase todos os modelos | escolha pelo estilo. |
| Redondo | Quadradas, retangulares e hexagonais | as linhas retas dão estrutura e alongam o rosto. |
| Quadrado | Redondas, ovais e aviador | as curvas suavizam a mandíbula marcada. |
| Alongado | Aviador, quadradas e hexagonais | lentes altas e largas equilibram o comprimento. |
| Coração | Aviador, redondas e ovais | mais leves em cima e arredondadas embaixo, equilibram a testa. |
| Diamante | Gatinho e ovais | a parte de cima marcada equilibra as maçãs do rosto. |

Com as peças de hoje: Oval 18 · Redondo 10 · Alongado 8 · Quadrado 5 · Coração 5 · Diamante 3 (antes: Diamante e Alongado 0).
- Travas: toda peça com `fm` tem rosto; todo rosto tem ao menos uma armação; a descrição de cada rosto só cita formatos do seu `fm`; 1 toque na lista abre o catálogo.

## Parte 4 (Parte B do dono, 21/11 13:50 e 15:55 "concordo, continue") — mais formatos e menos opções (muda tela: espera o "implementar")
Esboço: `esboco-07-tabela-filtro.jpg` (`lista8.py`, `resultados.py`, `captura.py`).
1. **8 formatos** na mesma tabela `FACES`: + **Retangular** (comprido, mandíbula reta) e **Triangular** (mandíbula mais larga que a testa). Ordem: Oval, Redondo, Quadrado, Alongado, Retangular, Coração, Diamante, Triangular.
   - Falta a ilustração homem/mulher dos 2 novos, no mesmo traço das 6 de hoje (o dono decide quem faz; em 11/11 a IA não acertou e a recomendação foi um ilustrador). No esboço: quadro tracejado "a fazer".
   - Na conta (parte 2, item 7) cada formato tem proporções de referência; valores de partida (comprimento÷maçãs · testa÷maçãs · mandíbula÷maçãs · ângulo do queixo), a calibrar com o modo teste: Oval 1,15 · 0,82 · 0,78 · 124° (rosto-padrão) · Redondo 1,02 · 0,84 · 0,82 · 135° · Quadrado 1,05 · 0,90 · 0,90 · 132° · Alongado 1,30 · 0,82 · 0,76 · 124° · Retangular 1,30 · 0,90 · 0,90 · 130° · Coração 1,15 · 0,92 · 0,70 · 116° · Diamante 1,15 · 0,74 · 0,70 · 118° · Triangular 1,10 · 0,74 · 0,90 · 132°.
2. **As 3 melhores no resultado** ("As melhores para você"), com o cartão do site (`card5`, a mesma família da prateleira "Para o seu rosto" do Início) e o botão "Ver todos os N modelos ›".
   - **Filtro (uma função `faMelhores`, a mesma no resultado e na ordem do catálogo filtrado):** combina com o rosto (`p.rosto`, da tabela) + gênero escolhido (`genOk`) + com estoque; ordem: tamanho certo primeiro (frente da armação = 2×lente + ponte + 10 mm, a até 6 mm da largura do rosto medida pela íris), depois mais vendidas (`mv`), depois mais novas.
   - Medida da peça só a real (`p.med` do app); peça sem medida não entra no "tamanho certo" (nada inventado — hoje o site inventa `med` quando falta: sai junto, planta aprovada 19/11).
   - Sem peça para a escolha (ex.: Diamante + Masculino hoje): "Ainda não temos modelos masculinos para rosto diamante." e o botão vira "Ver o catálogo ›".
   - Para caber: a contagem sai da frase e vai para o botão; o tamanho fica numa linha ("Tamanho da armação: Médio · 132 a 144 mm"); a ilustração fica 192×144; o selo "Últimas N" não aparece no cartão pequeno (fica na página da peça).
   - Gênero trocado: ilustração, as 3 e o botão mudam juntos (o mesmo clique de hoje).
3. Próximo passo do caminho do dono (19/11 12:17): "Comparar as 3" → provador; não entra aqui (o Comparar será refeito).
- Travas: todo formato tem ao menos uma armação; as 3 do resultado sempre combinam, têm estoque e são do gênero escolhido; o botão mostra o mesmo número que o catálogo filtrado.

## Comparador Hoje × Proposta (regra 11) — `comp/relatorio.json` (com as partes 1–4)
- **Sem falha nova** em celular, celular letra 1,2×, tablet e PC. Início, Catálogo e Peça: 0 diferença.
- Página do formato (celular/tablet, 32–34): os `<small>` trocados (modelos que combinam) + as 2 linhas novas (Retangular, Triangular, com o quadro "a fazer").
- Resultado (80–81): foto/canvas → ilustração (`.faill`), frase nova, tamanho numa linha, as 3 peças (`button.hc` ×3), botão com o total, a lista por trás.
- PC (148–197): o carrossel com 8 cartões (2 com "a fazer"), a frase curta dos modelos em 1 linha, e o resultado como no celular.
- 1 toque em Diamante (155–255): Hoje fica na página × Proposta abre o catálogo.
- Câmera (Parte A): o comparador não abre a câmera; as diferenças estão na prancha `esboco-02-camera.jpg` e no vídeo `esboco-06-camera-video.mp4`.

## Testado / não testado
- Simulador (Chromium, celular 386×858, letra 1× e 1,2×): resultado, Feminino/Masculino/Todos, conserto dos "traços", lista e toque nos formatos (Diamante, Coração, Alongado), câmera de teste (sem rosto); correção de distância/giro só na simulação com o rosto-padrão.
- NÃO testado: rosto de pessoa real, celular real, a precisão nova (precisa de pessoas reais; só a parte 1 é visual e já está no esboço).
