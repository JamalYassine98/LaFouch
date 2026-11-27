# Titan como IA que aprende o mercado do câmbio — proposta v2 (ESBOCO · 27/11/2026 10:02)
Dono: "a ideia é fazer o titan como uma IA que também aprende o mercado, para ter uma pequena ideia das mudanças do câmbio".
(v1 — só estatística da série — recusada: work/obsoletos/PROPOSTA-TITAN-CAMBIO-v1-27-11.md)

## Como funciona
1. **Lê o mercado todo dia (nuvem, de manhã):** o cérebro do Titan (Claude, pela API — o mesmo cérebro já aprovado para o Semp,
   chave só nos segredos do servidor) busca na internet o que mexe no guaraní: notícias do Banco Central do Paraguai, o real e o
   Brasil, o dólar no mundo e os juros dos EUA, soja e exportações, fim de mês/aguinaldo — e junta com a cotação da casa (La Moneda).
2. **Raciocina e escreve:** devolve em linguagem simples: tendência da semana (sobe / cai / estável), faixa provável, os 2–3 motivos
   ("o real caiu forte ontem", "safra entrando = mais dólar na praça") e o quanto confia.
3. **Aprende com o próprio acerto:** cada previsão fica guardada; 7 dias depois o Titan compara com o que aconteceu e escreve uma
   **lição** ("subestimei o efeito do real"). As lições e o placar entram na leitura do dia seguinte — é assim que ele vai
   conhecendo o mercado de Ciudad del Este/Asunción com o tempo.
4. **Na tela:** a janela do dólar mostra a leitura do dia do Titan, os motivos, a faixa e o placar ("acertou 9 de 12").
   O selo (bom momento / esperar / disparando) passa a usar essa leitura.

## Honestidade
É "uma pequena ideia", como o dono disse: o Titan mostra o placar sempre e diz quando não vê tendência.

## Custo (precisa de autorização — regra 23)
Uma leitura por dia com poucas buscas: estimativa de poucos dólares por mês (Haiku no dia a dia; o placar decide se vale mais).
Teto mensal travado no servidor, como no Semp. Nada roda antes do "autorizo".

## Regra 12
A previsão passa a ter UM lugar (a leitura do Titan guardada na nuvem); sai a reta+R² (fxReta/fxPrevisao) no mesmo passo.
Trava no Argus: leitura guardada e conferida após 7 dias; sem leitura = "Titan ainda lendo o mercado"; teto de gasto respeitado.

## v2b — Preços e marketing aprendendo juntos (dono 27/11 10:08: "o Titan pode ser ainda mais inteligente no aprendizado dos preços? Pq marketing e preço andam juntos")
Hoje (src/97-preco-auto.js) o preço segue regras fixas (degraus de oferta 60/75/90/120 dias, piso, 10% por semana, cadeado).
O cérebro passa a **aprender**, uma vez por semana (segunda, junto da revisão que já existe):
1. **Com as suas vendas:** quanto cada família/modelo vende em cada faixa de preço, quanto tempo fica parado, o que vende junto.
2. **Com o marketing:** o efeito de cada post/status/vídeo do Semp, cupom e evento nas vendas daquela peça nos dias seguintes.
3. **Com o câmbio:** a leitura do dia do Titan (custo em dólar → margem em guaraní) — o mesmo cérebro, uma leitura só.
4. **Com o mercado:** preços de referência da mesma peça na internet (Paraguai/Brasil), quando achar.
5. **Propõe em par:** preço + ação de marketing ("−5% no aviador + post do Semp na sexta"), com o motivo; guarda como
   experimento e, na semana seguinte, mede o resultado → **lição** + placar ("das 6 propostas, 4 venderam mais").
- As regras fixas viram **trilhos** que o cérebro nunca atravessa (piso, no máximo 10%/semana, cadeado, pré-graduado fixo,
  "vender rápido não sobe o preço" — S374) — mudar um trilho só com o dono.
- Um cérebro só para Câmbio, Preços e Semp (mesma chave, mesmo teto, mesmas lições guardadas).

## v2c — Três cérebros que conversam + custo menor (dono 27/11 10:10)
Dono: "Não é um cérebro só, pq eles podem se confundir, eles precisam comunicar entre si" · "15 dólares soa caro".
- **Três cérebros, cada um com a sua memória e as suas lições:** Titan Câmbio (leitura diária) · Titan Preços (semanal) · Semp (marketing).
- **Mural entre eles (nuvem):** cada um publica o que achou em frases curtas e lê o dos outros antes de decidir —
  Câmbio: "dólar deve subir ~1% na semana" → Preços segura a baixa do importado; Semp: "post do aviador sexta" → Preços mede o efeito;
  Preços: "aviador parado 70 dias" → pede ao Semp uma ação. O dono vê o mural (quem disse o quê, quando).
- **Custo:** Haiku em tudo no dia a dia; o Sonnet só na lição semanal. Menos buscas (câmbio 3/dia, preços ~10/semana).
  Estimativa: Câmbio ~US$ 1 · Preços ~US$ 0,50 · Semp ~US$ 1–3 → **~US$ 2–5/mês; teto proposto US$ 5/mês**.
- O plano de US$ 20 do Claude (chat) não pode ser usado pelo app sozinho: a API é cobrada à parte, pelo uso.
