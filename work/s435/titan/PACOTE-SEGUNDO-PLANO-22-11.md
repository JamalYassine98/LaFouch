# Pacote "segundo plano" — aprovado pelo dono em 22/11 12:10–12:11 (ESBOCO/S435)

Por que: há dias em que ninguém abre o app (férias, doença). O celular passa a **acordar sozinho uma vez por dia**,
mesmo com o app fechado, e faz tudo **numa acordada só**, para poupar bateria. Nenhum custo.

| # | O que faz | Onde roda | Como fazer (jeito natural, regra 12) |
|---|---|---|---|
| 1 | Lê a **venda da casa** (La Moneda Jebai) | celular | Usa a mesma leitura de hoje (`lmBusca`, src/97-lamoneda.js), chamada pela acordada diária. A La Moneda bloqueia servidores, então a nuvem não serve. Grava em `S.lm.hist` e no `S.fxHist`, marcado como da casa. |
| 2 | Garante a **cópia na nuvem** | celular | Chama a mesma sincronização/cópia de hoje. Se falhar, tenta na próxima acordada e avisa no sino depois de 2 dias sem cópia. |
| 3 | **Titan confere a mola** com a cotação do dia | celular | Roda o teste único aprovado: o valor fácil mudou de degrau por 7 dias (subida) ou 30 dias (descida) → aviso no sino. Fora isso, não avisa nada. |
| 4 | Avisa **contas a vencer** no dia | celular | Notificação do aparelho com o mesmo texto do aviso de hoje (`avisosVenc`, src/92-despesas.js). Uma vez por conta e por dia. |
| 5 | Avisa **mensagens de clientes e de lojistas** na hora | nuvem → celular | O mesmo caminho do aviso de pedido do site (src/97-push.js + a função da nuvem). Mensagem nova = um aviso, com o mesmo som escolhido. |

## Notas

- A acordada usa a peça de tarefa em segundo plano do Android, no APK. Os itens 1 a 4 só valem para o APK, que sai quando o dono pedir.
  O item 5 precisa da NUVEM e do APK.
- O Android pode atrasar algumas horas para poupar bateria. A leitura do dia acontece mesmo assim, mas é preciso conferir em aparelho real.
- No Windows e no navegador nada muda: eles leem quando o app está aberto, como hoje.
- Trava: uma prova de que a acordada chama **uma** função (`acordadaDiaria`) com os 4 passos e de que nenhum passo busca o mercado.
