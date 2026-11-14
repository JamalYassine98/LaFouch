# Estúdio do app e o 360° completo — estudo e propostas (14/11/2026, S258)

Só leitura do código (`src/97-estudio.js`, `97-estudio-giro.js`, `97-giro-site.js`, `97-fotos-padrao.js`) e 3 telas vistas no simulador com câmera falsa (`work/s258/ve.py`). Nada implementado.

## Como é hoje
- Tela do Estúdio: 1 botão ("Começar · N peças na fila"), "Peça nova", a fila (no simulador: 24 peças, quase todas com "falta a foto de 3/4") e "Padronizar N fotos".
- Caminho principal: uma peça por vez, foto de frente e depois a de 3/4. O app clareia o fundo até 255 sem mexer na armação, enquadra em 3:2 e dá nota.
- Câmera: lente, ISO, velocidade, branco, foco, histograma, nível, moldura, avisos, 2 s, peaking.
- O giro (360) está escondido dentro do "?": filma 12 s no prato, guarda um quadro a cada 0,25 s (cerca de 48), o dono confirma numa régua o quadro da frente (o app sugere o mais simétrico) e o da 3/4. Saem frente + 3/4 + o VÍDEO do giro.
- O vídeo é comprimido e vai sozinho para o site; lá aparece o botão "360°" na peça e o selo "↻ 360°" no Destaque. É um vídeo que toca: o cliente não gira a peça.

## Leitura
- O 360 é tratado como extra, não como caminho. Por isso a fila acumula "falta a 3/4": cada ângulo é uma foto à parte.
- Do giro só se aproveitam 2 quadros e um vídeo. Os outros ~46 quadros, já filmados, são jogados fora.
- No site o 360 é passivo (vídeo), sem luz de estúdio quadro a quadro e sem fundo 255 garantido.

## Propostas — 360 completo ("um giro = tudo")
1. **O giro vira o caminho principal.** Uma volta no prato gera de uma vez: frente, 3/4 dos dois lados, perfil e costas (fotos), a peça giratória e o vídeo. A fila de "falta a 3/4" acaba.
2. **Peça giratória de verdade.** Dos quadros do giro saem 36 ângulos iguais (o app acha a volta completa comparando com o primeiro quadro e reparte por ângulo, não por tempo), todos com a mesma luz de estúdio, fundo 255, mesmo centro e mesmo tamanho, e a volta fecha sem pulo.
3. **No site:** na página da peça o cliente arrasta para girar, com inércia; ao chegar, a peça dá uma volta lenta e para (regra de luxo); toque duplo aproxima. Carrega 1 quadro e busca o resto só quando o cliente toca. Sem 360, tudo fica como hoje.
4. **No app:** girar com o dedo na ficha e no Catálogo (modo cliente no iPad da loja).
5. **Trocar de cor mantém o ângulo:** se a pessoa está vendo de 3/4 e toca em outra cor, a outra cor aparece no mesmo ângulo.
6. **Marketing:** o vídeo sai do giro tratado (rotação suave, fundo infinito, aproximações) em vez da gravação ao vivo que você reprovou como amadora; serve para Status e Destaque.
7. **Guia ao vivo na câmera:** anel de 0 a 360° que enche enquanto a peça gira, aviso de "prato rápido/lento demais" e de volta incompleta, antes de salvar.

## Propostas — Estúdio em geral
8. **Fila que mostra o que cada peça tem:** frente, 3/4, 360, nota — em vez de só "falta a 3/4"; ordenar por "mais vendidas sem 360".
9. **Câmera no padrão de luxo** (mesma linguagem do leitor aprovado): cantos finos, réguas próprias, menos caixas pretas; controles avançados recolhidos.
10. **Resultado em uma tela:** os ângulos escolhidos lado a lado, a nota de cada um e "refazer só este".
11. **Fundo infinito como segundo acabamento** (pergunta sua de 11/11): fundo 255 para catálogo; sombra suave de chão para Destaque e Marketing.
12. **Coerência entre peças:** o app compara tamanho, centro e clareza de cada peça com a média da loja e avisa a que destoa.

## O que eu não sei (preciso de você)
- Qual é o seu equipamento de 360: prato motorizado? quantos segundos por volta? tem luz/caixa próprias?
- O que "completo" quer dizer para você: girar com o dedo no site, mais ângulos de foto, vídeo melhor, ou tudo.
- Peso: 36 quadros por cor pesam mais que um vídeo; preciso medir com um giro real seu antes de prometer tamanho e velocidade no site.
- Não vi o giro funcionando (o simulador não tem prato nem câmera real) nem as telas de resultado.
