# Varredura de código morto com o site rodando (regra 12d) — 20/11
- `roda.py`: abre as telas e toca em tudo (1ª rodada, rasa: 987 de 2.023 funções rodaram).
- Medição dentro das provas do porteiro: `FISCAL_COB=1 python3 work/fiscal/porteiro.py completo` → `cob_*.json` (funções do lf-site.js que rodaram). 2ª rodada: 1.331 de 2.204 (60%).
- `rodada2_porteiro_completo_nunca_rodou.json`: blocos que nunca rodaram (873; 35% do arquivo). NÃO é lista de mortos: inclui fluxos que as provas não percorrem (mapa, câmera do rosto, consulta do grau, atacado, avaliação).
- Morto CERTO = nunca rodou E existe uma versão mais nova do mesmo nome: 6 funções (cupHtml, mtjCarrega + embrulho, gEntrar, pkPagar, enviarPedido, newsForm) — tiradas na cópia limpa em 20/11 (15 KB).
- Cuidado achado: 5 das "versões antigas" da leitura do texto RODAM (aceitaCup, cupPecaHtml, drawBag, bag, evAtivo): são embrulhadas, não mortas. Só lendo o texto elas teriam sido apagadas por engano.
