# Regras do projeto LaFouch

- Antes de qualquer trabalho, leia docs/MEMORIA-PROJETO.md (decisões do dono e pendências) e atualize-o a cada decisão nova.

- ATUALIZAÇÃO 27/10/2026: o dono mandou NÃO gerar APK nem instalador do Windows (economizar tokens). Só gerar quando ele pedir. Continua valendo: testes, sw.js, commit/push em main.
- (Regra antiga, suspensa) Ao terminar qualquer mudança no app (src/, www/), depois de os testes passarem (python3 tests/run.py) e do commit/push em main, gerar SEMPRE os dois: o APK e o instalador do Windows. O dono pediu isso (25/10/2026).
  - APK: gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/build-apk.yml/dispatches -f ref=main
  - Windows: gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/build-windows.yml/dispatches -f ref=main
  - `gh workflow run` e GraphQL são bloqueados; usar o comando acima. Conferir com `gh run list`.
- Subir a versão do cache em www/sw.js (lafouch-vNNN) a cada release.
- REGRA DE OURO (04/11/2026): sempre esboço primeiro (INCLUSIVE correção de bug); implementar só quando o dono avisar; guardar o aprovado em docs/MEMORIA-PROJETO.md; entregar EXATAMENTE o esboço aprovado, sem mudanças não pedidas.
