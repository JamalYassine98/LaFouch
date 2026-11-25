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

## Limpeza e ferramentas novas (24–25/11, pedido do dono 21:26: "perfeito, limpo, sem redundância")
- Um lugar só: todo código que roda dentro da página mora em motor/js/ (base.js com o que é visível, o que se toca, a linha, o nome da tela e a janela; planta, família, tempo, voltar, relógio, loja) e setor_app/js/ (letra, biometria, erro ao salvar). Python e o emulador leem os MESMOS arquivos (motor/js.py). Os botões de perigo moram só em motor/perigo.py. Relógio parado igual no simulador e no Android (js/relogio.js).
- Gestos com o dedo de verdade (motor/dedo.py: arrasta): rolar (a tela rola, a barra de abas fica, nada rola de lado), arrastar a janela para fechar, tocar fora, e teclado subindo (o campo e o "Salvar" continuam à vista). Janela de baixo × caixa no meio da tela (regra 15).
- Estados: "erro ao salvar" (o app tem de avisar, e o aviso é igual em todas as telas), sem internet, reduzir movimento, PIN e biometria — todos na lista de modos; modo que não rodou = "não conferido" (trava).
- Contraste: texto legível sobre o fundo (padrão WCAG AA: 4,5:1; texto grande 3:1) no medidor único.
- Dados antigos na versão nova (motor/migracao.py): a loja guardada pela versão publicada e pela v641 abre igual na versão nova.
- Onde a diferença nasceu (motor/origem.py): busca binária nas versões; provado apontando a v635 como a que refez Preços.
- Tempo no Android (loja cheia, os mesmos limites de motor/tempo.py). O Android roda sem internet de fora, como o simulador (a cotação de verdade mudava números).
- Provas de novo, depois da limpeza: Parte 0 23/23 · 1 15/15 · 2 19/19 · 3 12/12 · 4 15/15 · 5 rápida 11/11 e completa 11/11 (16 etapas) · ferramentas novas (provas/parte6_ferramentas_novas.py) 12/12. Android: comparador 0 diferenças com as plantas de teste.

## O dedo de verdade (aprovado 25/11 08:13; o Argus gravava as linhas ⌄ do Ajustes como "não faz nada")
- motor/dedo.py — UM jeito de tocar para tudo (planta, toques, explorador, tempo, PIN, Android emulado): o dedo encosta no meio do botão e solta (no PC, o botão do mouse); se outra coisa está por cima, o dedo pega ela ("coberto por"). Saiu o clique por comando (A.tocar) e o motor/js/tempo.js (agora base.js: vigia/parou).
- O que o toque fez = RETRATO antes × depois (base.js: alvo/retrato/depois): sai para · abre a janela de baixo · abre o menu · abre ali · troca a escolha · mostra aviso · já é a escolha · nada. Saiu a regra "a página cresceu 8 px".
- Botão que não faz nada é falha (toques.regras); linha só de estado não pode ser botão.
- Letra grande do jeito do Android (motor/js/letra.js, abrir.abre(letra=…)): os tamanhos do CSS crescem antes de o app desenhar; o app continua descendo a letra quando não cabe. Serve ao app e ao site.
- O caminho até um setor de Preços mora num lugar só (planta.precos); as 7 cópias do caminho de Regras saíram.
- Trava (autoprova): linha que só abre com o dedo, aba que troca, menu solto, botão que não faz nada, letra 1,3× que ainda desce, tela que muda sozinha sem parar — 6 de 6 vistos.
- Tela parada que muda sozinha sem parar (motor/tempo.py: muda_sozinha; base.js: sozinha) = falha "laço", e os tempos de toque daquela tela ficam "não conferidos" (uma causa, um achado). Achado real 25/11: a barra de baixo do app muda 60×/s parada (recado à APP).
- A letra do simulador × a do Android (setor_app/emulador.py: letra_igual): mesmo texto, mesmo tamanho (até 0,5 px). Diferença achada 25/11: Compras 1,15× — o simulador desenha com Inter e o Android com Roboto (mais estreita), então só no simulador a lista desce um degrau de letra.

## Base de cada planta (dono 25/11 10:29)
- A planta de cada coisa = o último APROVADO dela, mesmo que ainda não implementado; onde não há esboço aprovado, a planta é o app real. O que o app não tem e o aprovado tem aparece como "falta implementar".
