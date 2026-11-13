# Animação da Mochi — referência (guardado em 13/11/2026 a pedido do dono)
Consultar ANTES de criar ou mudar qualquer movimento. Histórico: docs/MEMORIA-PROJETO.md (09/11, S55–S88; 10/11 chapéus).

## 1. Padrão de fluidez aprovado (S88, "para TODAS as animações", sem confete)
- Movimento por MOLAS (MOL no frame() do rig: sx, sy, inclinação, espelho, pulo dos óculos) — nada de transição seca de CSS.
- Deslocamento = PULO EM ARCO com antecipação (amassa antes), e pouso amassado (m.pula(x, y, duração, altura)). Nunca "esticar e errar": ela VAI até o lugar para apontar.
- Braços giram no ombro com mola (m.bracos); olhos e boca trocam com transição; respira; pisca sozinha a cada 3–4 s; a boca abre e fecha no ritmo da fala (m.fala / m.calou).
- Ponteiro: varinha com luva (m.vara liga/desliga, m.mira(ângulo, comprimento, ms), m.toca = toquinhos). Ângulos medidos em 13/11: 118–128 = para baixo (botão embaixo dela); 18–40 = para a esquerda (alvo ao lado).
- Olhar acompanha o alvo (m.olhaPara(x, y)); "sim" com a cabeça (m.sim).
- Zonas livres: a Mochi tem lugar próprio e não cobre texto nem quadro.

## 2. Braço e "pixels soltos" (o que o dono corrigiu várias vezes)
| Defeito visto | Causa | Regra que ficou |
|---|---|---|
| Braço cortado em alguns quadros (bocejo→tapinha) | pele da união cobrindo a borda; troca de camada no meio do gesto | união suave SÓ na raiz; o braço vai para a frente só quando a mão entra no corpo |
| Braço cortado no "ajusta os óculos" | cópia parcial só da mãozinha (maoFrente) | braço INTEIRO numa camada só; troca de camada com o braço PARADO no descanso |
| "Algo saindo do corpo" | união tipo massinha grande demais | braço em gota ATRÁS do corpo (S73); união curta |
| Pixel branco / cabeça saindo do chapéu | desenho sobreposto | conferir por máscara: pixels fora = 0 |
- REGRA: conferir TODOS os quadros das transições, não só os quadros-chave.
- Para movimento novo, preferir gestos que JÁ existem no site (pula, vara, mira, olhaPara, toca, sim, acena). Gesto novo que leve o braço para a frente do corpo = esboço em vídeo + conferência quadro a quadro antes.

## 3. Como conferir pixels soltos (método de 13/11, work/s218/video2.py)
- Gravar a MESMA animação com fundo escuro (ESCURO=1): a Mochi é rosa-clara e some no fundo rosado, então no fundo normal a máquina não separa o desenho.
- Em cada quadro (30 por segundo): achar a maior peça (o corpo) e listar qualquer pedaço separado perto dela.
- Alarmes falsos conhecidos: a luva (fica separada do corpo pela haste escura) e o desenho do código QR. Abrir os piores quadros ampliados e olhar.
- Limite: é vídeo comprimido, 1 tamanho de tela. A palavra final é do dono olhando o vídeo.

## 4. Animação do QR no computador (S219, esboço em vídeo, sem voz)
Roteiro (10,9 s): fala 1 → antecipa e pula em arco até o lado do código (0,76 s, altura 70) enquanto o cartão surge (0,48 s) → liga a varinha, aponta o código (ângulo 18) e olha para ele, dá toquinhos → fala 3, pula de volta ao lugar ao lado do Empezar → aponta o botão (ângulo 118), faz "sim" → cala e olha para a frente.
- Só usa gestos existentes; o braço fica sempre atrás do corpo (nenhuma troca de camada).
- Conferido: 324 quadros no fundo escuro (1366×768): nenhum pedaço solto do corpo ou do braço; os pedaços apontados eram a luva e o QR. Geometria conferida também em 1280×720 e 1920×1080 (ela pousa dentro da tela, ao lado do código).
- Cartão: texto à esquerda, código à direita, para ela pousar FORA do cartão, no espaço livre, sem cobrir nada.
