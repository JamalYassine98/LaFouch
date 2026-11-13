# Estudo das animações do site e do app — 13/11/2026 (S228)

Só leitura + protótipo de esboço. Geradores: `work/s228/inv.py` (inventário lendo o código), `fluidez.py` e `anim.py` (quadros com o processador 4× mais lento, vídeo Hoje × Proposta).

## 1. O que existe hoje (contado no código)

| | Site | App |
|---|---|---|
| Animações desenhadas (keyframes) | 91 | 136 |
| Tempos diferentes nas animações | 39 | 36 |
| Tempos diferentes nas transições | 26 | 20 |
| Curva própria | quase nenhuma (padrão do navegador) | parte já usa a curva suave (.2,.8,.2,1) |
| Animações sem fim | 27 | 16 |
| Transições que animam "tudo" de uma vez | 122 | 60 |
| Animações que mexem no tamanho/posição da página | 2 | 10 |
| Respeita "reduzir movimento" do aparelho | sim | sim |

## 2. Fluidez medida (celular, processador 4× lento)

- Rolar (Início, catálogo, Inventário): liso no site (0 travadas); no Inventário do app 5% dos quadros atrasam.
- Abrir e fechar menu, filtros, sino: lisos.
- **Site · abrir uma peça:** um quadro parado de ~200 ms e, durante ~450 ms, o catálogo aparece por baixo da peça (as duas telas misturadas, texto sobre texto).
- **App · trocar de tela:** um quadro parado de 100 a 217 ms no começo (o app monta a tela e só depois anima).
- O travamento vem de MONTAR a tela, não da animação em si.

## 3. Juízo

- Não falta animação; falta **ritmo único**. Com 39 tempos e a curva padrão, cada parte do site se mexe de um jeito. No app o padrão bom já existe, mas só em parte.
- Animações sem fim demais para uma loja calma (27 e 16): pulso do WhatsApp, pontinho da última unidade, brilhos, flocos, setas.
- A troca de tela mistura duas telas por tempo demais (site) ou espera parada antes de começar (app).

## 4. Recomendações

1. **Padrão de movimento único, site e app:** 3 tempos (0,2 s toque e pequenos · 0,32 s painéis e trocas · 0,48 s entradas grandes) e 1 curva (.2,.8,.2,1).
2. **O toque responde na hora:** o botão afunda de leve em 0,08 s, antes de qualquer tela abrir.
3. **Sem fim só para "carregando".** Chamar atenção = 2 repetições e parar (WhatsApp, última unidade, brilhos).
4. **Troca de tela limpa:** a tela nova entra por cima e a de trás some logo, sem as duas legíveis ao mesmo tempo. Ir = entra da direita/de baixo; voltar = o inverso.
5. **Montar antes de animar** (código, não dá para mostrar em esboço): no site, preparar a peça antes de abrir; no app, desenhar a tela nova e só então animar — tira o quadro parado de 100–200 ms.
6. **Animar só posição e transparência**, nunca "tudo" nem tamanho (122 + 60 transições a revisar; 12 animações que mexem em tamanho).
7. **Temáticas:** já decidido no S224 (menos enfeites e fora do texto).

## 5. O protótipo do esboço

`anim.py` aplica as recomendações 1 a 3 por cima do site e do app reais (lê cada animação viva e ajusta tempo, curva e repetições). Vídeos `s228_movimento_site.mp4` e `s228_movimento_app.mp4`; quadros `s228_movimento_*_quadros.jpg`.
- Resultado: na abertura da peça a tela fica limpa em ~250 ms em vez de ~450 ms. O número de quadros travados NÃO muda (confirma que o travamento é de montar a tela — recomendação 5).

## 6. Não testado

Celular real (a fluidez verdadeira só se vê nele), temáticas com o padrão novo, Mochi (tem padrão próprio aprovado, não foi tocada), todas as janelas do app.
