# Titan mais inteligente na Casa de câmbio — proposta (ESBOCO · 27/11/2026, pedido do dono 09:54)

## Como é hoje (src/97-cambio-aba.js · fxPrevisao)
- A previsão de 7 dias é uma **reta das últimas 2 semanas (70%) + quanto o dólar está acima/abaixo da média (30%)**.
- A "certeza" sai do quanto a reta se encaixa (R²) — isso mede o passado, **não** se a previsão acerta.
- Os dados só entram **quando o app está aberto** (S.fxHist / La Moneda): dias sem abrir = buracos na série.
- Ninguém confere depois se a previsão acertou.

## Verdade importante
Câmbio de curto prazo é quase um "passeio aleatório": nenhum método prevê subida/descida de 7 dias com acerto muito alto.
Ganho real vem de: série completa, **medir o próprio acerto**, mostrar **faixa** em vez de chute e falar "sem tendência" quando não há.

## Proposta (em 4 fatias)
1. **Série sem buracos (nuvem):** a nuvem guarda a cotação da casa (La Moneda) de hora em hora, mais a referência oficial e o dólar
   no mundo e o real (que puxam o guaraní). Precisa de uma **rodada agendada** → só com autorização do dono (regra 23; cabe no grátis).
2. **Titan se confere:** cada previsão fica guardada; 7 dias depois ele compara com o que aconteceu. Placar visível:
   "acertou 9 de 12 nas últimas semanas". Abaixo de 55% de acerto ele diz **"sem tendência clara"** em vez de chutar.
3. **Faixa no lugar de seta:** "na próxima semana, entre G$ 7.760 e G$ 7.840 (8 em cada 10 vezes)", tirada das variações reais
   do próprio histórico. Mais útil para decidir quanto trocar.
4. **Vários sinais com peso que se ajusta sozinho:** tendência, volta à média, calendário (fim de mês, dezembro, safra — só se o
   histórico mostrar que valem), o real e o dólar no mundo. O peso de cada sinal sobe ou desce conforme o acerto dele (fatia 2).
   O selo continua (bom momento / esperar / está disparando), agora com o placar ao lado. Sugestão de trocar **em partes** quando
   a faixa for larga.
- Fora por enquanto: IA lendo notícias (custo e não supera os sinais simples de forma confiável).

## Regra 12
Sai a reta+R² (fxReta, a "certeza" por R²) no mesmo passo; um lugar só para a previsão (fxPrevisao) servindo selo, janela e gráfico.
Trava no Argus: previsão guardada e conferida; sem tendência abaixo de 55%; faixa calculada do histórico.

## Próximo passo
Dono escolhe → esboço da tela (Hoje × Proposta) da janela do dólar com placar e faixa → implementar.
