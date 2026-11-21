✅ v587 (5.50.12, 20/11) — falta o dono testar no celular real
Causa de raiz: giro/mp4-muxer.js entrou no projeto depois do APK instalado e a atualização automática só leva app.js e style.css. As bibliotecas agora vão dentro do app.js (lib/ → APP_LIBS → appLib). Trava: tests/www-do-apk.json.
