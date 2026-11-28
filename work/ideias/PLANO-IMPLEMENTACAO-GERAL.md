# Plano de implementação — todas as sessões, em ordem (IDEIAS · 28/11/2026, pedido do dono 08:20–08:23)

Rascunho para o dono aprovar e para cada sessão conferir e responder (recado). **Até o dono liberar, a PAUSA de 27/11 continua.**
Princípio: uma fase por vez; dentro de cada fase, fatias MÍNIMAS (uma coisa por vez), cada uma com fotos antes/depois iguais (Argus),
seu próprio commit e volta de 1 comando. Nada de duas sessões no mesmo arquivo (status `comeco` trava). Dados reais nunca são tocados.

## Fase 1 — Rede de segurança (P0) · nenhuma tela muda
- ESBOCO: grava as plantas das 17 telas do app que faltam + o Início (como está HOJE).
- PLANTAS: grava as plantas do site (todas as temáticas, letras, línguas).
- ESBOCO/Argus: liga as travas — função/ação definida 2×; "!important" só pode cair; arquivo novo só dentro de família;
  cor/espaço/letra só por token; **uma regra só por assunto** (ex.: "Últimas unidades" — limiar em 2 lugares hoje).
- Teste: Argus completo verde com tudo como está. Dono: só aprova o fim da fase.

## Fase 2 — App sempre limpo no celular e no PC (atualiza-ao-vivo) · APP · já é o 1º da ordem
- APP termina o "atualiza-ao-vivo" (pacote inteiro www-<v>.zip, appPronto no 1º desenho, sai o LOADER; COMO-FAZER em work/esboco/atualiza/).
- Teste: Argus completo + teste-pc; ESBOCO dá o "OK ESBOCO".
- **NÃO gerar o APK ainda** — ver Fase 3 (um APK só para as duas coisas).

## Fase 3 — Celular de testes (aprovado 28/11 08:22) · APP + NUVEM
- APP: segunda versão do app, "LaFouch Teste", com outro identificador (instala AO LADO do oficial), apontando para dados de TESTE;
  relatório automático: quando algo falha, grava o erro + a tela atual numa área de testes da nuvem.
- NUVEM: área de testes separada dos dados reais + regras (só o app de teste escreve, só as sessões leem; nada de dado de cliente).
- ESBOCO: confere (é conserto "por dentro": nenhuma tela do app oficial muda).
- **Um APK só (oficial + teste) no fim desta fase, com o dono** (regra 21). A partir daqui: toda versão nova vai PRIMEIRO para o
  "LaFouch Teste"; o oficial só recebe o que passou nele.

## Fase 4 — Modularização em fatias mínimas · APP (app) e SITE (site), uma fatia por vez
- App: P1 núcleo + tokens → uma família por parte (Início → Dinheiro/Câmbio → Preços → as outras), PLANO-MODULAR.md.
- Site: mesmo método (acréscimo de 28/11): começa por "Últimas unidades" (uma função, um estilo .ulin) e pelas camadas do loja.html.
- Cada fatia: plantas iguais antes/depois; testada no "LaFouch Teste" antes de ir ao oficial.

## Fase 5 — Ideias aprovadas, já em código limpo (ordem a confirmar com o dono)
1. NUVEM: tomada única dos motores (Claude + Meta), chaves só nos segredos; teste de 1 semana do atendimento com conversas de mentira.
2. APP: Titan (câmbio + preços) e depois Semp (gaveta reaberta pelo dono quando ele disser).
3. Semp gera as fotos no ambiente B ponte (papel #F4EEEC · pedra #E9DFDC · tinta #2A1F27).
4. SITE: redesenho do Início (work/ideias/18-inicio-inteiro/APROVADOS-INICIO.md) — com as fotos do Semp.
5. O resto da Fila aprovada (itens "espera o implementar"), na ordem que o dono der.

## Quem faz o quê
APP (S436): src/ www/ · SITE (S429): catalogo/ www/loja · NUVEM: functions/ firestore.rules · ESBOCO (S435): plantas do app, Argus, OK ESBOCO ·
PLANTAS: plantas do site · IDEIAS: este plano, esboços do site, guia de luxo.

## Perguntas a cada sessão (responder por recado à IDEIAS)
- O que está pela metade agora (arquivo, commit, o que falta)?
- Algo neste plano atropela o seu trabalho ou está na ordem errada?
- Quanto tempo/créditos a sua parte pede?
