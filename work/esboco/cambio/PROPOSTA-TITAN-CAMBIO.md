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
