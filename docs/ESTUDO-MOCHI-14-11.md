# Mochi quadro a quadro — 14/11/2026 (S255)

Só medição e proposta; nada implementado. Ferramentas: `work/s255/mede.py` (amostra o esqueleto a cada quadro: 45 s da chegada + 25 s depois de "Empezar"; 3.912 quadros a ~57 por segundo), `analisa.py` (números), `grafico.py` (linha do tempo `s255_mochi_linha_do_tempo.jpg`). Constantes das molas lidas em `catalogo/js/lf-site.js` (~l.3703–3776).

## O que foi medido

| Parte | Hoje (medido) | Leitura de designer |
|---|---|---|
| Piscar | a cada 3,75 s exatos (7,3 · 11,0 · 14,8 · 18,5 …); fecha e abre em 0,16 s iguais | metrônomo; é o que mais denuncia "robô" |
| Boca ao falar | abre a cada ~0,45 s em ritmo fixo (29 vezes em 12 s) | não acompanha a frase (no simulador o som estava bloqueado; pode ser o modo sem áudio) |
| Molas | passam do ponto: espelho 50% · óculos 32% · inclinar 26% · achatar 22% · virar 19% · braços 13%; assentam em 0,4–0,9 s | tudo quica; luxo chega sem balançar |
| Achatar e esticar o corpo | de 0,81 a 1,19 (±15–19%) | exagero de desenho infantil |
| Braços | até 2.400 graus por segundo; chegam e balançam | rápidos e secos |
| Andar pela tela | 276 px + 177 px em 0,73 s (até 40 px por quadro) | atravessa a tela num piscar; não dá para acompanhar |
| Olhar | 4 mudanças em 45 s; pupilas em 0,35 s | quase não olha para o que mostra |
| Parada | um gesto a cada 3–4 s (inclinar, ajeitar, pezinhos; no descanso: dança, pulinho, palminha, bocejo, tchau) | inquieta; em movimento 20–22% do tempo |
| Respirar | ciclo fixo de 2,6 s, 2,5 px e 1,2% | outro metrônomo |
| Corpo nos gestos | gira até 25°, pula 9 px | ok para comemorar, demais para explicar |

Não confirmado: rostos sobrepostos na troca de expressão (medi 0 quadros com dois rostos; a troca é quase seca) — a proposta "trocar atrás da piscada" continua válida como acabamento, não como correção de defeito.

## Propostas (ordem de impacto)

1. **Piscar vivo:** intervalo sorteado a cada vez entre 2,5 e 6 s; fecha em 0,07 s, abre em 0,13 s; 1 em cada 5 é dupla; pisca sempre que muda o olhar ou a expressão.
2. **Molas calmas:** amortecimento para passar no máximo 3–4% (óculos e espelho até 8%); quique de 10% só no gesto "comemora".
3. **Corpo contido:** achatar/esticar de ±5%; giro até 8° ao explicar; pulo e giro grandes só ao comemorar.
4. **Andar que se acompanha:** a travessia leva 1,1–1,3 s, sai devagar e chega devagar; os olhos vão primeiro para o destino (0,12 s antes); o corpo inclina 3° para o lado do movimento.
5. **Boca que fala:** com som, segue o volume da voz em 3 aberturas e fecha nas pausas; sem som, segue as sílabas da frase (ritmo variável) e fecha em vírgulas e pontos.
6. **Olhar com intenção:** olha para quem lê ao começar a frase, para o que aponta enquanto aponta, e volta; uma microvariação de olhar a cada 4–7 s.
7. **Braços em arco:** aceleram e desaceleram (pico ~900 graus por segundo), a mão chega 60 ms depois do braço.
8. **Parada serena:** 1 gesto a cada 10–16 s, só os calmos (olhar, ajeitar os óculos, respirar fundo); dança, pulinho, palminha e tchau saem do descanso e ficam para comemorar ou despedir.
9. **Respirar:** ciclo de ~4 s com variação de 10%, 1,5 px; sombra com 0,15 s de atraso.
10. **Acabamento:** troca de expressão atrás de uma piscada; balão troca por frase com transparência (0,2 s); brilhos e anel de voz por transparência, o anel reagindo ao volume; entra nascendo do botão que a chamou e volta para ele.

## Limites
- Simulador, sem som (bloqueado) e com câmera falsa; só a chegada e o começo do teste. Não medi: teste de leitura completo, resultado, comemoração, despedida, versão de computador.
- Tudo acima muda números do esqueleto (constantes das molas, tempos, sorteios); o desenho, a voz e as falas da Mochi ficam iguais.

## Vídeo Hoje × Proposta (S256, 14/11 01:29)

`work/s256/s256_video_mochi_hoje_x_proposta.mp4` (45 s, tempo real, sem som). A proposta roda numa CÓPIA do site (`/tmp/kitsite_mochi`) com 14 trocas de números no esqueleto (lista em `work/s256/video.py`): molas sem passar do ponto, achatar/esticar a 30%, piscar sorteado (2,5–6 s, 1 em 5 dupla, fecha rápido e abre devagar), respirar em 4 s, andar ~2× mais lento saindo e chegando devagar com os olhos indo primeiro, parada com 1 gesto a cada 10–16 s, e boca parada quando não há som.

Medido na proposta (40 s): piscadas em 10,4 · 15,8+16,0 · 18,8+19,1 · 22,2 · 27,2 · 30,0 · 34,9 s; boca abre 0 vezes; achatar ±3%; em movimento 15% do tempo (hoje 20%); sem erro de JS.

## Sem som (mudo pelo botão ou bloqueado pelo aparelho) — consulta do dono
- Hoje a boca mexe por relógio (`M.fala(ms)`: abre 2 de cada 3 batidas de 110–200 ms), com ou sem som.
- Proposta: sem som, a boca fica fechada num sorriso leve; ela "fala" pelo balão — olha para o balão quando a frase aparece, faz um aceno curto de cabeça no começo de cada frase e mantém os gestos. Com som, a boca segue o volume da voz.
