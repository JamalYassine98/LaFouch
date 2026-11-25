# ARGUS — Agente de Revisão e Garantia Unificada de Sistemas (aprovado 24/11/2026 15:30)
Porteiro do site e do app: um motor só, dois setores. Plano: PLANO-ARGUS.md · estudo: ESTUDO-ARGUS.md.

## Parte 0 · chão firme (24/11, feita)
- motor/aparelhos.py — faixa de aparelhos por lógica (320 → 2560) + o celular do dono (aparelho_dono.json) como mais um; modos de cada setor.
- motor/loja.py — loja de teste do Argus (dados/loja_normal.json), no mesmo formato em que o app guarda; cenários normal, vazio, cheio, nomes_longos; relógio parado em 24/11/2026 15:00.
- motor/abrir.py — a porta do app (passa por work/kit/sim.py), com a loja entrando pelo armazenamento do app. A porta do site entra na Parte 7.
- provas/parte0_chao.py — relógio, loja, cenários, "mesma tela 2× = igual" (3 telas × 3 aparelhos × 2 temas) e a autoprova (1 ponto plantado tem de ser visto). Resultado 24/11: 23 de 23 ok.

## Parte 1 · a planta (24/11, feita)
- motor/esboco.py — o esboço é uma mudança no src/ (patch) aplicada numa CÓPIA do app em /tmp e montada com o build.js: feito com as peças de família, como a APP vai fazer; o src/ real nunca muda. Guardado em esbocos/<id>/ (mudanca.patch + base.txt).
- motor/planta.py — grava a planta: as peças que aparecem (texto, caixa, letra, cor, fundo, borda, desenho do ícone) nos dois temas, título e tela, cenário, relógio, caminho e as LIGAÇÕES (cada botão tocado de verdade: sai para…, abre ali, janela de baixo, nada; botão de perigo não é tocado). valida(): aprovada só com a linha na lista viva; substitui(): a anterior vai para work/obsoletos/argus-plantas.
- provas/parte1_planta.py — 15 de 15 (roda numa pasta de teste em /tmp, não suja as plantas de verdade): 3 telas gravadas e regravadas iguais (peças e ligações), esboço demo-iva na cópia ("IVA" e "10%" à direita) sem mexer no app real, proteção (pendente / inválida / aprovada) e a troca para obsoletos.

## Parte 2 · o comparador (24/11, feita)
- motor/compara.py — app × planta, peça por peça, pelo que aparece: posição e tamanho ±1 px; cor, fundo, borda, raio, letra iguais; ícone com o mesmo desenho e traço. Ruído (abre o app 2×): vira "não conferido", nunca some. Deslocamento em cascata vira UMA diferença.
- provas/parte2_compara.py — 19 de 19: app × a própria planta = igual (3 telas × 2 temas), autoprova com 10 estragos (todos vistos), cascata, ruído e o esboço demo-iva × app de hoje mostrando o que falta implementar.
- Saíram para work/obsoletos/titan-trocado-pelo-argus-parte2-24-11/: titan/compara.py, fichas/, indice.py, lado.py, triagem.py, molde_de_esboco.py, titan.py, moldes/, gabarito/, novo/.

## Parte 3 · toques, explorador e cobertura (24/11, feita)
- motor/toques.py — as ligações do app × as da planta (botão reconhecido pelo nome que aparece e pela ordem, nunca pelo nome do código) e as regras de toque: › sai e o voltar volta ao mesmo ponto · ⌄ abre ali, fecha no 2º toque, toques rápidos não deixam pela metade · janela de baixo sem "×"/"Fechar", fecha com Esc, tocando fora e arrastando, e pergunta "Sair sem salvar?".
- motor/explorador.py — parte das 5 abas e toca em tudo (menos perigo): lugares (tela + janela) com o caminho, erros do app a cada toque, cobertura do app.js (código morto) e o mapa (lugar sem planta = trava).
- provas/parte3_toques.py — 12 de 12 (a 1ª rodada deu 11/12: o botão quebrado na cópia demo-dobra-morta não era visto, porque o botão era reconhecido pelo nome do código; corrigido e as partes 1–2 rodadas de novo, 6/6; explorador, cobertura e mapa: 6/6 na 1ª rodada — 88 lugares, 235 toques, 4.213 funções medidas, função plantada vista como morta).
- Saíram para work/obsoletos/titan-trocado-pelo-argus-parte3-24-11/: titan/explorador.py, datas.sh.

## Parte 4 · o medidor de família (24/11, feita)
- motor/familia.py — UM medidor com as regras 13–17: L1 eixo do bloco, L2 ícone no centro da linha, L3 espaços 8/16/24/32/48 entre blocos, L4 texto de uma linha não quebra nem corta, toque ≥ 44 px, "+" redondo, números (G$ 25.000 · US$ 3,79 · 18/11), cores da paleta oficial (lida do próprio CSS), ícones com um traço, movimento (uma curva e um tempo; nada se mexe com "reduzir movimento"), mesmo verbo, tela vazia = ícone + frase + explicação; e a família inteira em todas as telas (mesma função = mesma aparência).
- provas/parte4_familia.py — 15 de 15: autoprova com 14 defeitos plantados (cada um aparece como achado novo) + o medidor nos 40 primeiros lugares do explorador, nos dois temas e com "reduzir movimento". Achados do app em provas/parte4_achados_do_app_24-11.json (a conferir com as plantas na Parte 6: onde o dono aprovou diferente da regra, vale o aprovado e o Argus mostra o conflito).
- Saíram para work/obsoletos/titan-trocado-pelo-argus-parte4-24-11/: titan/familia.py, medir.py, prova_medidor.py, roteiro.py, relatorio/. Os medidores do kit (mede.js e outros) ficam até a Parte 7 (o Argus atual do site ainda usa).

## Parte 5 · setor App, a porta do app (24/11, feita)
- setor_app/modos.py — claro E escuro · as 3 letras do app (1×, 1,15×, 1,3×; no simulador o texto cresce na mesma proporção, a letra de verdade é no emulador) · biometria (tecla da digital) e PIN (cenários 'bloqueio' e 'biometria' na loja de teste).
- setor_app/porta.py — `rapida` (a cada passo) e `completa` (antes de publicar, só ela dá selo): autoprova · tests/run.py · plantas válidas · comparador · toques · medidor nos modos (5 aparelhos × 2 temas × 3 letras; o que é igual ao aprovado vira "regra × aprovado, o dono decide") · tempo com a loja cheia · mapa (lugar sem planta) · erros do passeio · código morto · segurança (provas da NUVEM) · selo.
- motor/tempo.py (abrir ≤ 3 s, toque ≤ 500 ms), motor/selo.py (selo só para o mesmo commit; o publicar confere — ligação no publicar na Parte 8, com o dono), motor/autoprova.py (estragos + versão antiga v641 reprovada nos erros conhecidos).
- Emulador Android (de graça, repositório público): .github/workflows/argus-android.yml + setor_app/no_emulador/ — tela do Xiaomi do dono (1221×2712, 3×), fuso America/Asuncion, letras reais 1,0/1,15/1,3, claro e escuro; coleta dentro do WebView do APK; setor_app/emulador.py busca e compara (falta/sobra + medidor). Medido: área útil do APK = 407 × 832 (as barras do Android ocupam 72) → o simulador passou a usar 407 × 832 para o celular do dono.
- provas/parte5_setor_app.py — 10 de 10 (rápida e completa). Porta completa com 2 plantas de TESTE: 12 etapas, autoprova ok, tests/run.py ok, comparador ok, sem selo por 4 etapas com falha (toques, medidor nos modos, tempo com a loja cheia, mapa) — achados reais do app em provas/parte5_porta_completa_24-11.json; Android em provas/parte5_android_24-11.json.
- Saíram para work/obsoletos/gabaritos-trocados-pelo-argus-parte5-24-11/: work/kit/base_app.py, work/s435/varredura/aprovados.py, work/s349/ap.py (os scripts antigos de esboço que os usavam ficam como registro).
