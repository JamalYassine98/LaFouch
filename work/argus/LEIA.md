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
