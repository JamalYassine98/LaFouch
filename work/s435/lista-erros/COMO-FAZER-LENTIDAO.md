# Lentidão com a loja cheia — achado do explorador do Titan (ESBOCO, 24/11/2026)
Cenário "cheio" do Titan (work/titan/explorador.py): 417 referências (11× as de teste) e 6.039 vendas (3×) — uma loja movimentada em um ano.
| | dados de teste | loja cheia |
|---|---|---|
| abrir o app | 1,3 s | 21 s |
| trocar de aba (Vender, Peças, Dinheiro) | 0,8 s | 8 s |
| Início | 0,8 s | 22 s |
| Preços | 0,4 s | 23 s |
Simulador de PC; no celular é pior. Com isso a loja trava num dia de evento — o que o dono pediu para nunca acontecer.

## Causa (regra 12a) — medida com o profiler (work/titan, /tmp/prof.py)
77% do tempo em três contas que, para CADA peça, percorrem TODAS as peças de novo (cresce ao quadrado):
- `effCusto(i)` (src/51-lote-grupos.js:139) — para achar a média do custo do mesmo modelo/cor, varre `S.items` inteiro a cada peça.
- `gOwn(g)` (src/51-lote-grupos.js:22) — varre `S.items` inteiro para cada lote.
- a conta de "peças por mês" (www/app.js ~7202) — para cada tipo, varre todas as peças chamando `effCusto` (tipos × peças × peças).

## Como fazer (jeito natural, um lugar só) — conserto "por dentro" (6b): nenhuma tela muda
- Um **índice de custos** montado UMA vez por mudança de peças (não por desenho): mapa `tipo|ref|cor → {q, c}` e `lote → {q, c}`, num lugar só (src/51-lote-grupos.js). `effCusto`, `gOwn` e a conta de peças por mês só LEEM o índice.
- O índice é refeito quando `S.items` muda (o mesmo ponto que hoje salva as peças) — nada de recalcular dentro de laço.
- Apaga as varreduras de dentro dos laços no mesmo passo (12d).
- Trava no Titan: o cenário "cheio" vira prova — trocar de aba com a loja cheia tem de ficar abaixo de 1 s no simulador.
