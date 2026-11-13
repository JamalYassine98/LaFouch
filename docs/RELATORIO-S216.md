# Relatório S216 — padrão em 2 grupos + Mochi (13/11/2026)
ESBOÇO, nada implementado. Arquivos: work/s216/s216_1..9 (um por tela) · gerador work/s216/gera.py. Base: docs/ATLAS-SITE.md.

## 1. Os dois grupos
| Grupo | Quem entra | Como o site sabe |
|---|---|---|
| TOQUE | celular, tablet, notebook virado tablet | o comando principal é o dedo: `(pointer:coarse)` / `(hover:none)` |
| MOUSE | notebook e computador | o comando principal é mouse/touchpad: `(pointer:fine)` e `(hover:hover)` |
- Notebook que vira tablet: quando o teclado é dobrado/solto, o sistema troca o comando principal para o dedo e o site muda de grupo na hora, sem recarregar. Notebook com tela de toque mas usado com mouse continua MOUSE (certo).
- Limite: quem decide é o que o aparelho informa ao navegador. Alguns 2-em-1 só avisam depois de entrar no "modo tablet" do Windows. Não dá para testar isso no simulador; precisa de um aparelho de verdade.

## 2. Padrão de colunas (igual no Início e no catálogo)
| Grupo | Largura | Colunas | Margem | Hoje (Início × catálogo) |
|---|---|---|---|---|
| TOQUE | até 559 | 2 | 15 | 2 × 2, mas margem 31 × 15 |
| TOQUE | 560–1099 | 3 | 19–20 | 4 × 3 (cartão de 133 px no Início) |
| TOQUE | 1100+ | 4, no centro (máx. 1320) | — | 4 × 4, margens 55 × 16 |
| MOUSE | qualquer | 4, no centro (máx. 1320) | — | 1366: margens 55 × 16 · 1920: 4 × 6 colunas |
- TOQUE: abas de gênero, "Filtros ›" e "‹ Inicio" com 44 px de altura de toque (desenho igual).
- MOUSE: mantém efeitos de passar o mouse; alvos podem ser menores.

## 3. Mochi (teste de leitura)
| Situação | Hoje | Proposta |
|---|---|---|
| Aparelho sem câmera | pergunta "¿Puedo usar la cámara?" mesmo sem câmera (conferido: lista de câmeras vazia e a pergunta aparece) | não pergunta; vai direto ao passo dos 30 cm |
| Computador/notebook (grupo MOUSE) | nenhum aviso | cartão com QR + fala "sale mejor en el celular"; o mesmo botão Empezar continua no computador |
| Computador, passo da distância | "sostené el celular a 30 cm" | "ponete a 30 cm de la pantalla" (fala e título) |
- Como detecta câmera: `navigator.mediaDevices.enumerateDevices()` — diz se existe câmera sem pedir permissão. Sem câmera ou sem essa função = fluxo sem câmera.
- QR: usa o gerador que o site já tem (lfx/qr.js, do PIX); aponta para lafouch.com/?r=descubri-tu-graduacion (rota que já existe).
- VOZ: as falas da Mochi são gravadas. As 2 falas novas (aviso do celular e "30 cm de la pantalla", PT e ES) ficam SÓ EM TEXTO até o dono autorizar créditos do ElevenLabs.
- "Qual combina comigo?" (rosto) também usa câmera: mesma regra recomendada; não esboçado.

## 4. O que o olho do designer disse (hoje → proposta)
| Tela | Piorou | Melhorou |
|---|---|---|
| 1 celular Início | nada | — |
| 2 tablet Início | tampado 0→1 (WhatsApp sobre um cartão; defeito antigo do WhatsApp) | texto cortado 9→3 |
| 3 tablet catálogo | nada | toque<24 1→0, toque<40 5→0 |
| 4 notebook mouse | texto cortado 0→1 (cartão 321→301 px corta 1 nome) | — |
| 5 computador 1920 | nada | texto cortado 1→0 |
| 6 notebook tablet | texto cortado 0→1 (mesmo do 4) | toque<24 1→0, toque<40 5→0 |
| 7–8 Mochi PC | nada | — |
| 9 Mochi sem câmera | letra<11 0→1 (rótulo "PREPARANDO", que já existe nesse passo) | toque<40 2→1 |

## 5. Falhas e riscos da própria proposta
- Tablet com 3 colunas: a vitrine "Novedades" mostra 8 peças → sobra 1 fileira com 2. Corrigir mostrando 6 ou 9.
- Notebook: o cartão do catálogo encolhe 20 px e corta 1 nome com "…". Com o cartão real (formato + código) o texto é curto; conferir com produtos de verdade.
- 1920: de 6 para 4 colunas = menos peças por tela (cartões maiores). É a troca entre elegância e densidade.
- Não testado: 320, 600, celular deitado, iPad deitado, 2560, temáticas, letra maior, português, aparelho de verdade, 2-em-1 de verdade.
- QR no computador ocupa a parte de baixo da tela inicial do teste; em 1366×768 fica inteiro na 1ª tela (conferido na foto).
