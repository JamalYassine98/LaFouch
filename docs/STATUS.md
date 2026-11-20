# STATUS — MONTADO AUTOMATICAMENTE por tools/status.py (NÃO editar à mão)

**Como usar (CLAUDE.md regra 1):** no começo de CADA pedido do dono: `python3 tools/status.py ler <SESSÃO>`; antes de mexer: `comeco`; ao terminar: `fim`; item da Fila: `fila`; recado: `recado`. Nunca editar este arquivo à mão.

## Onde está o estudo de cada parte (ler o que já existe, não refazer)
- App: docs/APP-MAPA.md (ler primeiro) · docs/APP-BOTOES.md · docs/APP-COMO-FUNCIONA.md · CODEMAP.md (módulos de src/)
- Site: docs/SITE-COMO-FUNCIONA.md · docs/ATLAS-SITE.md (medidas reais, 13/11)
- Decisões do dono: docs/MEMORIA-PROJETO.md · pendências: docs/FALTA-APROVAR-15-11.md (lista viva)

## Papéis (CLAUDE.md regra 1b)
- APP — implementa e publica: **S436** (só ela mexe em src/ e www/).
- SITE — implementa e publica: **S429**.
- NUVEM — implementa (functions/ e firestore.rules, segurança): **"NUVEM · implementa"** (antiga "Estudo · dados"); a publicação da função é o dono que roda no PC.
- Demais sessões: esboço, estudo e conferência.
- **Nomes das conversas no app do dono (aprovados 19/11 14:08)** — usar estes nomes ao falar com o dono:
  - "APP · implementa" = S436 · "SITE · implementa" = S429 · "Esboço · famílias" = S435 · "NUVEM · implementa" = sessão da nuvem e segurança (antiga "Estudo · dados"; estudo do item C em docs/ESTUDO-ESTOQUE-SITE-19-11.md).

## Em andamento

| Sessão | Agora | Arquivos marcados |
|---|---|---|
| APP | item 23: remendos parte 1 — render sem embrulho | src/99-render-persistencia.js, src/99b-voltar-janela.js, src/99c-navegacao-s435.js, src/98z-s374.js, src/98z-s374d-padrao.js, tests/run.py |
| ESBOCO | esboço ideia Semp parte 1 (tela do Semp) — só ideia, fora da fila | work/semp/ |
| SITE | limpeza 5: canto de selos (ramo esb-limpeza-ulin do catalogo) + prova do porteiro na regra aprovada | js/lf-site.js, index.html, work/fiscal/provas.py |

## Fila

- **01-149v-familia-voltar-peca-do-catalogo-fic** — ✅ v563 (19/11) · APP · pedido 19/11 13:31
- **02-150i-familia-icone-redondo** — ✅ v563 (19/11) · APP · pedido 19/11 13:31
- **03-b2-soltar-reserva-urgente-bug-src-95-res** — ✅ v564 (19/11) · APP · pedido 19/11 14:03
- **04-b1-nome-da-cliente-no-pedido-act-pedcli** — ✅ v566 (19/11) · APP · pedido 19/11 14:03
- **05-b3-site-resumo-no-grupo-site-a-linha-e-o** — ✅ v572 (5.49.2, 20/11) · APP · pedido 19/11 14:03
- **06-p1-seguranca-da-reserva-parte-da-nuvem-c** — ✅ publicado pelo dono 19/11 15:03 (Cloud Shell); conferido: cancelar com `refs` = ok:true; reserva vencida da AC1050 apagada; 4 paradas antigas saem na limpeza das 4h · NUVEM · pedido 19/11 14:29
- **07-p1-parte-do-app-depois-do-deploy-do-item** — ✅ v565 (19/11) · APP · pedido 19/11 14:29
- **08-s1-s2-parte-1-nuvem-dono-implementar-19** — ✅ publicado pelo dono 19/11 15:44 (functions + regras); conferido: `conta` livre=ok, `reserva` token sem telefone certo = recusado · NUVEM · pedido 19/11 15:29
- **09-s1-s2-parte-2-site-depois-do-item-8-publ** — na CÓPIA LIMPA (catalogo limpo, 20/11 08:40): simulador ok, comparador sem diferença, nuvem real 16/16 — falta entrar no site no ar (porteiro quebrado)
- **10-s1-s2-parte-2-app-depois-do-item-8-publi** — ✅ v566 (19/11) — grava em reservasTok E ainda em reservas/ (o site antigo lê de lá); tirar o de reservas/ junto com o item 11 · APP · pedido 19/11 15:29
- **11-s1-s2-parte-3-nuvem-depois-dos-itens-9-e** — PRONTA E TESTADA no ramo nuvem-parte3b (atualizada sobre o main de 20/11 09:55, com selo e limpeza 2; não publicada) — espera o item 09 (site) publicado e o item 21 (app)
- **12-p1b-orfas-nuvem-dono-implementar-16-12-e** — ✅ publicado pelo dono 19/11 16:21; conferido: `orfas` sem login = sem-permissao · NUVEM · pedido 19/11 16:12
- **13-p1b-orfas-app-depois-do-item-12-publicad** — ✅ v567 (19/11) · APP · pedido 19/11 16:12
- **14-urgente-interruptor-do-site-some-no-pain** — ✅ publicado no site (catalogo ef883de, 19/11 19:28); CONFERIDO pela S435 no simulador: com o site ligado e desligado o cartão do interruptor fica no topo (prova.py). Dono testou no celular 19/11 19:45: funcionou ✓ · SITE · pedido 19/11 19:03
- **15-camera-do-estudio-so-ela-pegar-antes-dos** — ✅ COMPLETO — parte 1 v568 · parte 2 v569 · parte 3 v570 (19/11) · APP · pedido 19/11 19:25
- **16-peca-incompleta-nao-vai-ao-site** — esboço v2 pronto e passado no comparador (work/s436/banco/esboco16_ficha_{celular,tablet,pc}_*.jpg + esboco16_pecas_teste.jpg), esperando o dono: marca e coleção obrigatórias? · APP · pedido 19/11 23:07
- **17-urgente-site-inventario-py-566-preso-no** — ✅ FEITO v571 (5.49.1) · APP · pedido 19/11 23:23
- **18-trava-dos-remendos-no-porteiro** — ✅ feito 20/11 01:20 (porteiro, sem versão do app: só teste) · APP · pedido 20/11 00:40
- **18-trava-dos-remendos** — na fila — o dono diz 'implementar' pelo prompt de 20/11 00:40 · APP
- **19-appcheck-parte-3-nuvem** — ✅ publicado pelo dono 20/11 08:11 (functions + regras); conferido: cupom sem selo responde normal (motivo nao), modo anotar
- **20-appcheck-parte-2-site** — na CÓPIA LIMPA (catalogo limpo, 20/11 08:40): simulador ok, comparador sem diferença, nuvem real 16/16 — falta entrar no site no ar (porteiro quebrado)
- **21-s1-s2-parte-3-app** — na fila — junto com o item 11
- **22-bug-entrar-na-nuvem-aparelho-novo** — ✅ v573 (5.49.3, 20/11) · APP · pedido 20/11 09:40
- **22-publicar-nuvem-pelo-github** — ✅ funcionando 20/11 08:41 — dono configurou (Cloud Shell); 1ª publicação de teste pelo GitHub: testes ok + Deploy complete
- **23-remendos-parte-1-render** — em andamento · APP · pedido 20/11 09:40

## Recados esperando

- para **APP**: ORDEM DO DONO 20/11 10:04 (vale até acabar): seguir SEM consultar (só urgente: perda de dado, gasto, sem volta) até terminar TUDO que falta implementar; ESBOCO 
- para **ESBOCO**: Bug no tools/status.py (20/11 01:20): em puxa(), se o 2º rebase (depth 200) também falha, o rebase fica PELA METADE e o envia() faz commit e push no meio dele —
- para **ESBOCO**: Achados da noite (S436, 20/11) para conserto com esboço próprio, NÃO mexi: (1) TABLET 820 px, Inventário › ficha: os botões 'Ficha 5/6' e 'Preço' saem da tela e
- para **ESBOCO**: CORREÇÃO do meu recado da madrugada: o dono aprovou (20/11 08:17) COMPARADOR ÚNICO — o do site (work/s430/comparador/compara.py) com a lista de telas do app; NÃ
- para **ESBOCO**: v573 (5.49.3) publicado 20/11 10:30 — item 22: aparelho vazio e sem login › Início › cartão 'Seus dados estão na nuvem?' › Entrar agora abre Ajustes com a dobra
- para **todas**: **Dono (19/11 20:38): todas as sessões cometeram o erro de remendo em cima de remendo** (já pedido pelo menos 6 vezes: 17/11 20:45, 18/11 15:59, 19/11 09:49, re
- para **todas**: Cuidado: `git fetch --depth=20` às vezes não alcança o ponto comum e o rebase vira centenas de conflitos "add/add" (aconteceu comigo 19/11 15:10). Se aparecer, 
- para **todas**: CLAUDE.md regra 11 mudou (dono 20/11 00:07): todo esboço passa pelo comparador Hoje × Proposta; toda diferença precisa estar no esboço, diferença sem motivo = f
- para **todas**: Regras novas no CLAUDE.md (dono aprovou 20/11 08:21): 3b aprovação em lote (esboço pronto vai à Fila como 'esboço pronto — esperando o dono' e você segue no pró

Histórico antigo (até 19/11 23:50): docs/status/historico-antigo.md


## Últimas mudanças (todas as sessões, mais nova em cima)

- 20/11 10:04 — NUVEM: Dono decidiu no S5+S7: sem inscritos de verdade → ao implementar, apagar as inscrições atuais (novidades e avise-me); S5S7 e S6S3 aprovados, esperando 'implementar'.
- 20/11 10:03 — NUVEM: Anotado: dono aprovou S5+S7 e S6+S3 (esperando implementar; falta decidir inscritos atuais no S5+S7)
- 20/11 10:01 — APP: v573 publicado: item 22 bug do Entrar na nuvem em aparelho novo (328/328). Próximo: item 23 (remendos parte 1, render), esperando o 'pode' do dono
- 20/11 09:57 — NUVEM: Limpeza 2+3 (regra 12) publicadas e conferidas no ar: Falha única (14 cópias), post()/corpo/tokenDe/falhou nas portas, CORS_SITE (3 listas), avisaAparelhos (3 cópias), ehVip, catalogoPisos, hash, urlFn, telefone e escape de HTML num lugar só; respostas das 15 portas iguais antes×depois; travas teste-portas (17); sonda no ar automática no fim de cada publicação (0 falhas); doc NUVEM-COMO-FUNCIONA. Parte 3 (item 11) refeita no ramo nuvem-parte3b sobre o main novo, com espera do token; recados ao SITE (09 primeiro) e ao APP (21 só depois do 11).
- 20/11 09:55 — SITE: porteiro parte 1 feita (categoria vinda da loja): 24 → 11 falhas na cópia limpa; sobram 9 dos selos (limpeza 5), ícone da conta sem cor no mouse, 1 contraste no painel e 5 avisos visuais na página da peça a conferir
- 20/11 09:31 — SITE: itens 9 e 20 na cópia limpa (nuvem real 16/16); porteiro rodado na cópia limpa: 24 falhas, causa achada (13 provas presas numa categoria fixa sem peças) — esboço do conserto com o dono
- 20/11 09:25 — NUVEM: Limpeza 1 (regra 12): envio de e-mail num lugar só (emailResend) no lugar de 8 cópias + trava teste-email; 19 suítes ok; publicado pelo GitHub (run 44735365715, commit 0d97d3f).
- 20/11 08:40 — NUVEM: item 22 funcionando: 1ª publicação da nuvem pelo GitHub (testes + deploy) deu certo
- 20/11 08:36 — NUVEM: script de configuração do item 22 corrigido (para com erro; espera a conta nova)
- 20/11 08:33 — NUVEM: item 22 pronto: workflow publicar-nuvem.yml + tools/configura-publicar-nuvem.sh + docs/PUBLICAR-NUVEM-GITHUB.md; falta o dono configurar
- 20/11 08:22 — NUVEM: regras 3b, 3c e 6b no CLAUDE.md (aprovadas 08:21); item 22 (publicar a nuvem pelo GitHub) na Fila; recado para todas
- 20/11 08:18 — NUVEM: fila: S1/S2 parte 3 do app renumerado de 18 para 21
- 20/11 08:18 — APP: guardado o aprovado 20/11 08:17: comparador único (site + app, duas listas de telas); recados para SITE e ESBOCO; nada no código
- 20/11 08:12 — NUVEM: App Check parte 3 publicada e conferida (modo anotar). Próximo: ver seloDia/ depois da parte 2 do site; exigir só com novo ok do dono
- 20/11 02:51 — APP: NOITE 20/11 (dono dormindo), nada mexido em src/ nem www/: (1) B3 item 05 já estava publicado (v572) e foi CONFERIDO EM CELULAR REAL no Test Lab, claro e escuro (prints work/s436/testlab/). (2) Item 16 NÃO implementado; esboço v2 pronto e passado no comparador, celular/tablet/PC (work/s436/banco/esboco16_ficha_*.jpg) — falta o dono dizer se marca e coleção são obrigatórias. (3) PLANO DOS REMENDOS em 10 partes: docs/PLANO-REMENDOS-20-11.md (62 funções com 104 remendos); parte 1 (render) ENSAIADA numa cópia: 0 diferenças em 60 telas x 3 aparelhos, 327/327 testes. (4) BUG ACHADO, não consertado: aparelho novo/desconectado › Início › 'Entrar' na nuvem dá tela vazia (esboço work/s436/bug-nvir/). DECISÕES DO DONO: a) consertar o bug do Entrar? b) implementar a parte 1 dos remendos? c) item 16: marca e coleção obrigatórias? Na Fila esperando o site: 18-s1-s2-parte-3-app.
- 20/11 01:18 — SITE: comparador Hoje × Proposta refinado (work/s430/comparador/compara.py); test drive no esboço dos selos: acha só as 2 falhas reais
- 20/11 01:00 — APP: item 18: trava dos remendos no porteiro (tools/remendos.py, teto tests/teto-remendos.json); 327/327
- 20/11 00:36 — APP: v572 publicado: B3 (item 05) grupo Site › Resumo; 326/326
- 19/11 23:50 — ESBOCO: conferência
- 19/11 23:50 — ESBOCO: status automático implementado (tools/status.py, docs/status/, regra 1 do CLAUDE.md); fila, recados e em andamento migrados; conferidas as versões 569, 570 (câmera) e 571 (item 17)
