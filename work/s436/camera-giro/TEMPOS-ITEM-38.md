# Item 38 — onde o tempo do tratamento do giro vai (S436 APP, 21/11/2026)

Medido no SIMULADOR (Chromium no servidor, sem celular), com o giro de referência de 24 s (work/s436/camera-giro/ponta_a_ponta.py),
360 quadros, largura de trabalho 960. O celular do dono levou ~5 min: cerca de 5× isto. Os números do celular virão do diário
(`[LF-CAM] tempos {…}`, gravado a partir da v607).

| Fase | ms | % | O que faz |
|---|---|---|---|
| abre | 117 | 0,2 | abre o vídeo |
| volta | 1.274 | 2 | assinaturas pequenas e a primeira volta inteira |
| fundo | 1.239 | 2 | 24 quadros para aprender o fundo |
| **medir** | **23.535** | **42** | 1ª passada: 360 quadros — onde a peça está e a nitidez |
| escolher | 1 | 0 | frente, passeio, recorte |
| **video** | **30.502** | **54** | 2ª passada: 360 quadros — recorta a peça, desenha e codifica o vídeo |
| quadros | 12 | 0 | imagem inteira dos graus pedidos |
| **total** | **56.680** | 100 | |

Dentro das fases: **busca = 20.668 ms (36%)** só para ir a cada quadro do vídeo (744 idas: 360 + 360 + 24), e **le = 4.436 ms (8%)**
para ler os pontos de cada quadro. O resto (~31,5 s, 56%) é a conta em cima dos pontos (JavaScript na tela principal) e a codificação.

## Prova de que medir não mudou o resultado
Mesmo vídeo, versão v606 × versão com os tempos: `info`, as 4 `fotos`, a `capa` e o `quadro` IDÊNTICOS (impressão digital sha256).
Os bytes do vídeo variam a cada rodada mesmo sem mudança (codificador), como já se sabia.

## O que isto diz para o plano (a escrever em PLANO-ITEM-38.md)
1. **Ir duas vezes a cada quadro custa 36%.** Uma passada só (ler cada quadro uma vez) corta ~1/3 do tempo sem mexer em conta nenhuma —
   mas a 2ª passada precisa da "caixa" que só existe depois de medir todos; é preciso guardar os quadros (memória) ou decodificar em fila.
2. **A conta em cima dos pontos (~56%)** é o que a placa gráfica (WebGL) pode fazer: diferença para o fundo, máscara, nitidez.
   Tem de dar o MESMO resultado: provar ponto a ponto contra a versão de hoje antes de trocar.
3. **Fora da tela principal** (Worker): não acelera, mas deixa o dono gravar a próxima cor enquanto trata.
4. Menos quadros e resolução menor estão REPROVADOS pelo dono (21/11 09:51).
