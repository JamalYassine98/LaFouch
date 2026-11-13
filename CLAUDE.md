# Regras do projeto LaFouch

- Antes de qualquer trabalho, leia docs/MEMORIA-PROJETO.md (decisões do dono e pendências) e atualize-o a cada decisão nova.
- App: antes de criar tela/botão/módulo, leia docs/APP-COMO-FUNCIONA.md e atualize-o no mesmo commit (pedido do dono, 12/11/2026).
- ESBOÇOS ANIMADOS: não mandar GIF (não carrega no celular do dono); mandar imagem com os quadros lado a lado (+ MP4 se precisar).
- ESBOÇOS: usar o design guardado e o kit (docs/DESIGN-SITE-E-APP.md, work/kit/kit.py) — telas reais, só injetar o que muda, 1 prévia (pedido do dono, 12/11/2026).
- Site (lafouch.com): antes de mexer, leia docs/SITE-COMO-FUNCIONA.md; ao atualizar ou modificar o site, atualize esse arquivo no mesmo commit (pedido do dono, 11/11/2026).

- ATUALIZAÇÃO 27/10/2026: o dono mandou NÃO gerar APK nem instalador do Windows (economizar tokens). Só gerar quando ele pedir. Continua valendo: testes, sw.js, commit/push em main.
- (Regra antiga, suspensa) Ao terminar qualquer mudança no app (src/, www/), depois de os testes passarem (python3 tests/run.py) e do commit/push em main, gerar SEMPRE os dois: o APK e o instalador do Windows. O dono pediu isso (25/10/2026).
  - APK: gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/build-apk.yml/dispatches -f ref=main
  - Windows: gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/build-windows.yml/dispatches -f ref=main
  - `gh workflow run` e GraphQL são bloqueados; usar o comando acima. Conferir com `gh run list`.
- Subir a versão do cache em www/sw.js (lafouch-vNNN) a cada release.
- DESIGNER/PORTEIRO (13/11/2026): testar TODAS as condições antes de esboço ou publicação: tema claro, escuro e temáticas, as 3 letras, celular/tablet/PC até 2560, logado/deslogado, com e sem biometria, contraste do texto.
- REGRA DE OURO (04/11/2026): sempre esboço primeiro (INCLUSIVE correção de bug); implementar só quando o dono avisar; guardar o aprovado em docs/MEMORIA-PROJETO.md; entregar EXATAMENTE o esboço aprovado, sem mudanças não pedidas.

## Economia de tokens (pedido do dono, 11/11/2026)
- Português, respostas curtas: no máximo 8 linhas, salvo se o dono pedir "detalhe".
- Formato: 1 linha com o que fez ou propõe · lista curta só do que ele precisa decidir ou saber · 1 linha com o próximo passo ou a pergunta. Tabela só para comparar números.
- Não repetir o pedido, não recapitular passos, não explicar o óbvio. Se faltar informação: UMA pergunta curta e parar.
- Palavras-chave do dono: ESBOÇO, IMPLEMENTAR, PUBLICAR, PARAR. Comandos podem vir em tags <tarefa> <onde> <modo> <limite> <contexto>; sem tags, extrair esses campos sozinho.
- "COMPRIMA:" no começo da mensagem = não executar; só reescrever o texto dele no formato das tags, com o mínimo de palavras e sem perder decisão.
- Usar a memória do projeto em vez de pedir histórico; ler trechos de arquivos, não arquivos inteiros; não reenviar arquivos que ele já tem.
- Mensagens no meio do trabalho só para: rascunho pronto, problema que muda o resultado, ou pergunta.
- ElevenLabs: nunca gravar (nem teste) sem o dono autorizar o valor em créditos.
- Sempre dizer o que foi testado no simulador e o que NÃO foi testado no celular.
