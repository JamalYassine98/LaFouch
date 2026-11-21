# IDEIAS 01 · Descubra seu formato — mais preciso e resultado elegante (para o SITE)

Pedido do dono 21/11 09:53: "melhorar para ser ainda mais preciso" e "mostrar o resultado de forma elegante; hoje fica um desenho em roxo do formato, de forma amadora".
Base: site real 1795264209 (catalogo 66daaf2), celular. Esboços: `esboco-01-resultado.jpg`, `esboco-02-camera.jpg`. Ferramentas: `copias.py`, `captura.py`, `camera.py`, `compara_formato.py`, `prancha.py`.

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

## Parte 2 — mais precisão (por dentro: só os avisos da câmera mudam)
Achado: o rosto-padrão do próprio leitor (`face_landmarker.task`, rosto médio de 468 pontos) sai hoje como **Diamante** — a conta favorece testa estreita. Causas:
- Os 478 pontos são convertidos para os 68 antigos (`M68`/`mp68`) e corrigidos por um ajuste fixo (`MOFF`) — régua emendada.
- Comprimento = (queixo − sobrancelha) × 1,5 (um chute); "largura" = pontos perto das orelhas (127↔356), não as maçãs; "testa" = sobrancelhas.
- Uma foto só (um quadro): qualquer tremida muda a proporção.
- Distância não é conferida: selfie de perto deforma (nariz maior, laterais somem → rosto mais estreito e comprido).
- A câmera ao vivo usa outra leitura (face-api pequena) e só descobre "rosto de lado" DEPOIS da foto.

Jeito natural:
1. **Medir direto nos 478 pontos endireitados** (`mpFront`, já existe): comprimento 10↔152, maçãs 234↔454, testa 54↔284, mandíbula 172↔397, queixo pelo ângulo 172-152-397. Saem `M68`, `mp68`, `MOFF` e o uso de `faMeasure` para a leitura de 478 (o face-api de 68 pontos fica só como reserva, já aprovado).
2. **Uma tabela só** `FORMAS` = proporções de referência de cada formato; ganha o mais perto (mesma conta para os 6; sai o bloco de 6 fórmulas de `faShape`). "Também tem traços de" continua igual (2º mais perto, se estiver perto). Âncora: o rosto-padrão do leitor = Oval; ajuste final uma vez com o modo teste que já existe (`?rostoTeste=1`) em pessoas cujo formato o dono conhece.
3. **Vários quadros**: depois do 3-2-1, ~1,5 s de vídeo no modo VIDEO do mesmo leitor; a medida é a mediana. Se variar demais, "Fique parado e tente de novo".
4. **Câmera ao vivo com a mesma leitura** (MediaPipe VIDEO no lugar do `TinyFaceDetector` no `camLoop`): antes de contar, confere a distância pela íris (11,7 mm; muito perto → "Afaste o celular: braço esticado") e a cabeça reta (giro/inclinação até ~10° → senão "Deixe a cabeça reta"). O "Rosto de lado" depois da foto deixa de acontecer pela câmera (fica só para foto da galeria).
5. Foto da galeria: mesma conta da parte 2.1–2.2 (um quadro só, como hoje).
- Travas no porteiro: rosto-padrão do leitor → Oval; o mesmo rosto girado 15° → mesmo formato; o resultado não muda entre 2 leituras do mesmo vídeo.

## Comparador Hoje × Proposta (regra 11) — `comp/relatorio.json`
- Sem falha nova em celular, celular letra 1,2×, tablet e PC.
- Início, Catálogo, Peça, página "Seu formato de rosto" e janela de abrir: 0 diferença (tablet · Peça: 31 "classe —→lx44" nos links do rodapé = a área de toque de 44 px entrando em tempos diferentes; esta proposta não mexe ali).
- Resultado: 14 diferenças, todas do esboço — `canvas#facv` sumiu, 2 `span.rzi` apareceram, `.faph`→`.faill` (184×184 → 224×176, fundo rosado) e por isso tudo abaixo sobe 6 px e a janela fica 6 px menor.
- Resultado com traços + Feminino: as mesmas + a dica certa (era a do 2º formato).

## Testado / não testado
- Simulador (Chromium, celular 386×858, letra 1× e 1,2×): resultado Hoje × Proposta, Feminino/Masculino/Todos, conserto dos "traços"; câmera com a câmera de teste (sem rosto).
- NÃO testado: rosto de pessoa real, celular real, a precisão nova (precisa de pessoas reais; só a parte 1 é visual e já está no esboço).
