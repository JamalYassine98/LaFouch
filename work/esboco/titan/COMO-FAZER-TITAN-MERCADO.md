# Titan que aprende o mercado — telas (esboço · ESBOCO · 27/11/2026) — esboco_titan_cambio.jpg · esboco_titan_precos.jpg
Base: app real v641 (motor do Argus, loja de teste). Proposta aprovada 27/11 10:23 (work/esboco/cambio/PROPOSTA-TITAN-CAMBIO.md v2–v2e).
Aprovados incluídos: janela do dólar (S418/126, sem ×), Preços = escritório do Titan (54 + 46b, "O Titan decide hoje"),
conversa Semp ↔ Titan (20/11 19:35, sem tela nova aqui). Textos da leitura = exemplo (vêm do cérebro).

## Câmbio › janela da moeda (src/97-cambio-aba.js)
- Sai o fjPrevTxt (reta + "certeza alta") e no lugar entra, depois do gráfico, a **leitura do Titan** guardada na nuvem:
  "LEITURA DO TITAN · HOJE 07:00" (lbl tiLb, 24 px acima) → linha da semana (▲/▼/— + faixa em G$ das cotações reais) →
  "POR QUÊ" com 2–3 motivos (✓ ajuda a loja · ! atrapalha) → "PLACAR" (acertos + a última lição).
- Mesmas linhas .fjMot de hoje (família da janela). Sem leitura ainda: "O Titan ainda está lendo o mercado".
- O pontilhado de 7 dias do gráfico passa a ir até o meio da faixa do Titan (um lugar só para a previsão).
- Regra 12: sai fxReta/fxPrevisao/fjPrevTxt; o selo da Reposição usa a mesma leitura.

## Preços › "O Titan decide hoje" (src/97z3-precos.js titanDecide)
- Nova linha quando uma peça de **luxo** parada pede ação: "Oferta discreta · <marca modelo>" / "Parada 70 dias · cupom + estojo, preço fica",
  ícone da família "oferta"; abre a peça com a proposta (cupom pessoal / brinde / evento) para o dono aceitar. A etiqueta nunca baixa.
- Mesma tiLinha das outras linhas (uma regra só).

## Achados do medidor que já existem HOJE (não são desta proposta — vão para a varredura de consertos)
Contraste do amarelo de atenção no claro (3,2–3,6:1: "5 com sugestão…", ▲/! da janela), espaços 10/18/38/73 px da janela e de Preços.

## Não testado
Simulador: escuro e claro, letra 1,0. Não testado: letras 1,15/1,3, tablet/PC, aparelho real, a leitura de verdade (depende da nuvem).
