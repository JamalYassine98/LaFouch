# Relatório S217 — teste em tudo + esboços pedidos (13/11/2026)
ESBOÇO, nada implementado. Arquivos: work/s217/s217_1..5 · padrão: work/s217/padrao.py · teste: work/s217/testa.py (dados em teste.json).

## Teste "em tudo" do padrão dos 2 grupos (hoje × proposta, olho do designer, parado e depois de rolar)
- 114 casos: 17 aparelhos (320 a 2560, em pé/deitado, notebook com mouse e virado tablet) × Início e catálogo completo; + 7 temáticas, letra grande e muito grande, e português em 4 aparelhos (celular, iPad, notebook, monitor).
- Resultado: 0 erros · 104 melhoras · 21 pioras.
| Piora | Quantas | Onde | Causa |
|---|---|---|---|
| tampado | 12 | iPad em pé no Início (todas as temáticas, PT, letra 2) + celulares 320 e 360 | WhatsApp fica em cima de um cartão quando para — é o defeito do WhatsApp, não das colunas |
| toque<40 | 3 | catálogo nos celulares 320/360 | +1 alvo pequeno visível (cabe mais conteúdo na tela) |
| letra<11 | 3 | catálogo em 360×800, 412, 430 | mais rótulos pequenos visíveis na tela (os mesmos rótulos de hoje) |
| texto cortado | 2 | monitor 2K (2 nomes) e tablet 600 (2 nomes) | cartão mais estreito corta o nome de teste |
| cortado | 1 | iPad em pé, letra muito grande | WhatsApp |
- Depois do teste: mudei o limite de 4 colunas para 900 px (iPad deitado continua 4 × 4 como hoje). Reconferido só iPad deitado e celular deitado (sem piora nas colunas; WhatsApp de novo).
- QR da Mochi conferido em 1280, 1366, 1536, 1920 e 2560: cabe em todos menos 1280×720 (passa 6 px). Corrigir encurtando o espaço acima do cartão.
- NÃO testado: quadros da Mochi e da transição fora do 1366; temáticas nos 13 aparelhos restantes; 2-em-1 de verdade; celular de verdade.

## Colunas (Início × catálogo): hoje → proposta
320–430: 2×2 → 2×2 (margem igual) · 600: 2×3 → 3×3 · 768/820: 4×3 → 3×3 · celular deitado 844: 4×3 → 3×3 · iPad deitado 1024: 4×4 → 4×4 · notebooks 1280–1536: 4×4 → 4×4 (mesma coluna) · 1920 e 2560: 4×6 → 4×4.

## Movimento (padrão proposto)
- 3 tempos: 0,2 s (toque/realce) · 0,32 s (mudança de layout, ex. notebook→tablet) · 0,48 s (entrada de conteúdo, ex. QR). Uma curva só: cubic-bezier(.2,.8,.2,1). Entrada = surgir + subir 12 px. Nada pula: muda tamanho, não posição.
- No máximo 1 animação sem fim por tela (hoje: anel do WhatsApp e ponto do "Última unidad" ao mesmo tempo).
- Respeitar "reduzir movimento" do aparelho (o site já tem 17 regras disso).

## Mochi
- Computador: vira a varinha, olha para o código, o QR surge em 0,48 s, ela aponta e fala (s217_4). Empezar continua valendo.
- VOZ: precisa gravar 2 falas × 2 idiomas (≈ 300 letras no total). Só gravo com autorização de créditos do ElevenLabs.

## O que mais recomendo
1. WhatsApp "inteiro ou escondido" — é a causa de 13 das 21 pioras e do defeito que o dono viu.
2. Abrir o ☰ no PC sem pulo (hoje 0,11–0,15; bom < 0,1).
3. Peça no celular pequeno sem pulo ao carregar (0,109).
4. Uma animação sem fim por tela.
