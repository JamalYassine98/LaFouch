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

## v2c (corrigida 27/11 10:13) — dois cérebros: o Titan e o Semp, conversando pelo que JÁ foi aprovado
Dono 10:13: "Titan de câmbio e preços é literalmente o Titan" · "o mural já tem esboços — cuidado com coisa duplicada" ·
"o plano de 20 dólares cobre… 5 dólares soa razoável, mas podemos ser extremamente eficientes".
- **Dois cérebros:** o **Titan** (câmbio + preços — uma memória, um aprendizado) e o **Semp** (marketing), cada um com as suas lições.
- **A conversa entre eles NÃO é tela nova:** é a conversa Semp ↔ Guardião (hoje Titan) já APROVADA como ideia em 20/11 19:35
  (Pendências: "Semp e Titan · para decidir" + "Ver a conversa ⌄"; Histórico: Tudo | Semp | Titan) — esboços em
  work/semp/esboco_semp2_pendencias_* e esboco_semp2_historico_*. O "mural" da v2c antiga sai (era duplicado).
- **Custo — só a API, com eficiência sem perder qualidade (dono 27/11 10:16: "não pretendo manter o plano e sim usar sua API"):**
  1. **O código faz a conta, o cérebro pensa:** a nuvem busca de graça as fontes fixas (La Moneda, referência oficial) e resume
     vendas/estoque/posts em números; o cérebro recebe só o resumo, nunca a base inteira.
  2. **Poucas buscas:** só notícias, 2 por dia no câmbio e ~5 por semana em preços (a busca é o item mais caro).
  3. **Instruções e lições em cache** (lidas quase de graça a cada dia) e **lote** para o que não é urgente (leitura do dia,
     aprendizado da semana: metade do preço).
  4. **Haiku no dia a dia; o Sonnet só** na lição semanal ou quando o Haiku marcar algo fora do normal (escalada).
  5. **Resposta curta e organizada** (campos, não redação).
  Estimativa: Titan câmbio ~US$ 0,70 · Titan preços ~US$ 0,30 · Semp ~US$ 0,20 → **~US$ 1–2/mês; teto US$ 3/mês** travado no servidor.

## v2d — Semp com mais espaço para estudar; Titan protege o ar de luxo (dono 27/11 10:20)
Dono: "o semp pode ser mais flexível, porque ele tem que estudar bastante" · "um produto de super luxo custar 10 dólares em vez de 60
tira o ar de luxo, apesar do produto ser de luxo".
- **Orçamento:** teto total **US$ 5/mês**: Titan ~US$ 1 (fixo, eficiente) · **Semp até ~US$ 4** — sessões de estudo semanais com o
  Sonnet (tendências do Instagram, marcas de luxo, o que funcionou nos posts da loja), guardadas como lições.
- **Preço também é marketing (o Titan concorda com o dono):** no luxo, preço baixo demais faz o cliente achar que a peça não é boa.
  Trilhos novos do Titan para as linhas de luxo:
  1. **Piso de luxo:** nunca abaixo do preço que posiciona a peça como luxo (referência: o preço da mesma marca/linha no mercado),
     mesmo parada — o piso de custo de hoje não basta.
  2. **Oferta discreta, não preço baixo na vitrine:** para luxo parado, em vez dos degraus visíveis (60/75/90/120 dias), cupom
     pessoal, brinde (estojo, ajuste, cordão), evento exclusivo ou combinação — o preço da etiqueta fica.
  3. **Âncora alta:** ao sugerir preço, o Titan olha para cima (quanto a peça vale no mercado de luxo), não só custo + margem.
  4. O Semp e o Titan combinam: oferta de luxo vira campanha "exclusiva", nunca "liquidação".
- Decisão do dono pendente: quais marcas/linhas contam como "luxo" (o Titan propõe a lista pelo preço de mercado; o dono confirma).
