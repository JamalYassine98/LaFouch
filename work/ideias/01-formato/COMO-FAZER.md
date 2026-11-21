# IDEIAS 01 · Descubra seu formato — mais preciso e resultado elegante (para o SITE)

Pedido do dono 21/11 09:53: "melhorar para ser ainda mais preciso" e "mostrar o resultado de forma elegante; hoje fica um desenho em roxo do formato, de forma amadora".
Dono 21/11 10:21: "não tem como medir sob essas formas (perto, cabeça torta)?" e "precisamos atualizar a descrição dos formatos de rosto". Dono 21/11 12:13: "a descrição precisa ser dos modelos que combinam e não do formato do rosto".
Base: site real 1795269030, celular. Esboços: `esboco-01-resultado.jpg`, `esboco-02-camera.jpg`, `esboco-03-formatos.jpg`, `esboco-04-precisao.jpg`. Ferramentas: `copias.py`, `captura.py`, `camera.py`, `vitrine.py`, `simula.py`, `compara_formato.py`, `prancha.py`.

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

## Parte 2 — mais precisão, medindo mesmo perto ou com a cabeça torta (por dentro: só "Medindo…" e o caso extremo aparecem)
Achados: o rosto-padrão do próprio leitor (`face_landmarker.task`) sai hoje como **Diamante**; e a simulação (`simula.py`, `esboco-04-precisao.jpg`) mostra que o site já endireita o giro, mas **não a distância**: a mesma pessoa a 25 cm sai ~14% mais "comprida" do que a 45 cm (é o "diamante que deu alongado"). Causas:
- Os 478 pontos viram os 68 antigos (`M68`/`mp68`) com um ajuste fixo (`MOFF`) — régua emendada; comprimento = (queixo − sobrancelha) × 1,5; "largura" perto das orelhas (127↔356).
- Uma foto só; a perspectiva da selfie (o que está mais perto da lente sai maior) nunca é desfeita.

Jeito natural — medir sempre, corrigindo, em vez de avisar:
1. **Endireitar** (já existe, `mpFront`) e **desfazer a perspectiva**: distância pela íris (11,7 mm) e lente frontal típica; cada ponto volta ao tamanho real pela sua profundidade (x·(D−z)/f). Perto, longe, virado até ~30° ou inclinado: mede igual. Sai o aviso de distância.
2. **Vários quadros**: depois do 3-2-1, ~1,5 s no modo VIDEO do mesmo leitor; usa os quadros mais de frente e tira a mediana. Só pede algo quando não dá para medir: virado mais de ~30° o tempo todo ("Vire o rosto para a câmera"; acima disso um lado do rosto some atrás do nariz e o leitor inventa esse lado).
3. **Medir direto nos 478 pontos**: comprimento 10↔152, maçãs 234↔454, testa 54↔284, mandíbula 172↔397, queixo pelo ângulo 172-152-397. Saem `M68`, `mp68`, `MOFF` e o `faMeasure` da leitura de 478 (face-api de 68 fica só de reserva, já aprovado).
4. **Uma conta para os 6**: cada formato da tabela FACES tem as proporções de referência; ganha o mais perto (sai o bloco de 6 fórmulas de `faShape`). Âncora: rosto-padrão do leitor = Oval; ajuste final uma vez com o modo teste (`?rostoTeste=1`) em pessoas cujo formato o dono conhece.
5. A câmera ao vivo usa a mesma leitura (sai o `TinyFaceDetector` do `camLoop`); o "Rosto de lado" depois da foto fica só para foto da galeria.
- Travas no porteiro: `simula.py` vira prova (rosto-padrão em 18/25/45 cm, virado 15°, inclinado 10° → mesmo formato e proporções dentro de 1%); rosto-padrão → Oval.

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

## Comparador Hoje × Proposta (regra 11) — `comp/relatorio.json` (celular, letra 1,2×, tablet) e `comp-PC/relatorio.json`
- **Sem falha nova** em nenhum aparelho. Início, Catálogo e Peça: 0 diferença.
- Página do formato (celular/tablet): 12 = os 6 `<small>` ("Combina: …" → os modelos da tabela).
- PC: 120 = os 6 cartões do carrossel (frase de 2 linhas → modelos em 1 linha; desenhos e botões sobem/crescem junto).
- Resultado: 27 (celular/tablet) = foto/canvas → ilustração (`.faph`→`.faill`, 2 `span.rzi`), frase nova, os 12 da lista por trás.
- 1 toque em Diamante: 155–255 = Hoje fica na página (nada acontece) × Proposta abre o catálogo com as 3 peças.

## Testado / não testado
- Simulador (Chromium, celular 386×858, letra 1× e 1,2×): resultado, Feminino/Masculino/Todos, conserto dos "traços", lista e toque nos formatos (Diamante, Coração, Alongado), câmera de teste (sem rosto); correção de distância/giro só na simulação com o rosto-padrão.
- NÃO testado: rosto de pessoa real, celular real, a precisão nova (precisa de pessoas reais; só a parte 1 é visual e já está no esboço).
