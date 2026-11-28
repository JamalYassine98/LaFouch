# FASE 1 · rede de segurança — resultado do Argus (ESBOCO · 28/11/2026)
## Feito (commits f46a5396c, b641748a3, db3182776)
- **Plantas do app: 26 aprovadas** (6 do lote 1 + as 20 telas do mapa que faltavam, incl. Início), gravadas COMO ESTÃO HOJE,
  escuro e claro, com as ligações. Passo de planta por nome (sem números), estável.
- **Travas de limpeza ligadas** (motor/limpeza.py, nas portas do app e do site; foto de hoje em limpeza_base.json; só desce):
  função/ação 2× (5 hoje) · "!important" (1.582: 866 style.css + 716 loja.html) · arquivo novo fora de família / com nome de sessão ·
  cor/px soltos (10.488) · **uma regra só por assunto**: seletor em 2+ blocos (448) · a mesma frase em 2+ arquivos (83) ·
  "Últimas unidades" decidido em 2 arquivos (96-loja-online.js ≤3, 97-marketing.js ≤2) · .ulin definido 2× inteiro no loja.html
  (linhas 254 e 1823; +peças 1824/1826). Autoprova: as 7 pioras plantadas são pegas.
- **Tools/status.py** não publica mais ramo (trava tools/prova_status_ramo.py, de 27/11).
## Porta rápida do app (tudo como está)
- ok: autoprova (25) · plantas válidas (26) · **comparador: as 26 telas iguais às plantas** · todos os modos rodaram.
- **FALHA toques: 55** e **medidor nos modos: 5** — são DEFEITOS QUE JÁ EXISTEM no app de hoje, que as plantas novas revelaram. Ex. (Dashboard):
  "Pendências": o voltar do aparelho vai para o Início, não para o Dashboard · linhas de venda "abre ali mas não fecha no 2º toque" e
  "depois de toques rápidos para de responder" · "Dias anteriores no Histórico ›": o voltar não volta ao mesmo ponto (rolagem 762 → 0).
  Telas com mais achados: Dashboard, Compras (linhas "faltam…"), Pendências em várias telas, Fornecedores.
- não rodou: lógica do app (tests/run.py).
- **A rápida não coube no tempo**: com 26 plantas passou de 58 min (limite 10) — mesmo só com as telas diferentes + 3 que giram.
## Decisões para o dono / IDEIAS
1. Os 55 + 5 defeitos de hoje: (a) gravar como "defeitos conhecidos" de cada planta (aviso, não trava; só defeito NOVO trava) e
   consertar na ordem das fases — recomendação; ou (b) consertar antes de seguir.
2. Tempo do Argus com 26 telas: rodar as telas em paralelo (vários navegadores aqui / no GitHub) para a rápida voltar a ~10 min
   e a completa a ~30 min.
