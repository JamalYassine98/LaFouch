# Regras do projeto LaFouch

- Ao terminar qualquer mudança no app (src/, www/), depois de os testes passarem (python3 tests/run.py) e do commit/push em main, gerar SEMPRE os dois: o APK e o instalador do Windows. O dono pediu isso (25/10/2026).
  - APK: gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/build-apk.yml/dispatches -f ref=main
  - Windows: gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/build-windows.yml/dispatches -f ref=main
  - `gh workflow run` e GraphQL são bloqueados; usar o comando acima. Conferir com `gh run list`.
- Subir a versão do cache em www/sw.js (lafouch-vNNN) a cada release.
- Ideias novas: só desenvolver/mostrar imagens; implementar apenas quando o dono avisar.
