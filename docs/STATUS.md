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
| APP | item 28: remendos — trocas inteiras (mkAbre, cupAbre, estTutorial, dPer, dPerEsc, famNum, stAbre, avMin) | src/97-marketing.js, src/97-cupons.js, src/97-estudio.js, src/98-dash-cabecalho.js, src/97y-familias-s265.js, src/97-push.js, src/98z-s374.js, src/98z-s374d-padrao.js, src/98z-camera-s262.js, src/98z-dashboard-s48.js, tests/run.py |
| ESBOCO | esperando SITE publicar 09 e 20 e APP publicar 21 para conferir no comparador (entrar com nome de usuário, token do pedido pago, página da peça) | — |
| SITE | varredura de código morto medindo durante as provas do porteiro (work/fiscal/provas.py, só medição) | work/fiscal/provas.py |

## Fila

- **01-149v-familia-voltar-peca-do-catalogo-fic** — ✅ v563 (19/11) · APP · pedido 19/11 13:31
- **02-150i-familia-icone-redondo** — ✅ v563 (19/11) · APP · pedido 19/11 13:31
- **03-b2-soltar-reserva-urgente-bug-src-95-res** — ✅ v564 (19/11) · APP · pedido 19/11 14:03
- **04-b1-nome-da-cliente-no-pedido-act-pedcli** — ✅ v566 (19/11) · APP · pedido 19/11 14:03
- **05-b3-site-resumo-no-grupo-site-a-linha-e-o** — ✅ v572 (5.49.2, 20/11) · APP · pedido 19/11 14:03
- **06-p1-seguranca-da-reserva-parte-da-nuvem-c** — ✅ publicado pelo dono 19/11 15:03 (Cloud Shell); conferido: cancelar com `refs` = ok:true; reserva vencida da AC1050 apagada; 4 paradas antigas saem na limpeza das 4h · NUVEM · pedido 19/11 14:29
- **07-p1-parte-do-app-depois-do-deploy-do-item** — ✅ v565 (19/11) · APP · pedido 19/11 14:29
- **08-s1-s2-parte-1-nuvem-dono-implementar-19** — ✅ publicado pelo dono 19/11 15:44 (functions + regras); conferido: `conta` livre=ok, `reserva` token sem telefone certo = recusado · NUVEM · pedido 19/11 15:29
- **09-s1-s2-parte-2-site-depois-do-item-8-publ** — ✅ publicado no site 1795192682 (20/11 13:55, junto com a cópia limpa inteira)
- **10-s1-s2-parte-2-app-depois-do-item-8-publi** — ✅ v566 (19/11) — grava em reservasTok E ainda em reservas/ (o site antigo lê de lá); tirar o de reservas/ junto com o item 11 · APP · pedido 19/11 15:29
- **11-s1-s2-parte-3-nuvem-depois-dos-itens-9-e** — ✅ publicado 20/11 13:58 (run 44777476972: funções + regras; limpeza do token rodada na hora; sonda 0 falhas) — usuarios/ fechada, token só em reservasTok
- **12-p1b-orfas-nuvem-dono-implementar-16-12-e** — ✅ publicado pelo dono 19/11 16:21; conferido: `orfas` sem login = sem-permissao · NUVEM · pedido 19/11 16:12
- **13-p1b-orfas-app-depois-do-item-12-publicad** — ✅ v567 (19/11) · APP · pedido 19/11 16:12
- **14-urgente-interruptor-do-site-some-no-pain** — ✅ publicado no site (catalogo ef883de, 19/11 19:28); CONFERIDO pela S435 no simulador: com o site ligado e desligado o cartão do interruptor fica no topo (prova.py). Dono testou no celular 19/11 19:45: funcionou ✓ · SITE · pedido 19/11 19:03
- **15-camera-do-estudio-so-ela-pegar-antes-dos** — ✅ COMPLETO — parte 1 v568 · parte 2 v569 · parte 3 v570 (19/11) · APP · pedido 19/11 19:25
- **16-peca-incompleta-nao-vai-ao-site** — ✅ v575 (5.50.0, 20/11) — marca e coleção obrigatórias; 19 peças de teste completas e marcadas · APP · pedido 19/11 23:07
- **17-urgente-site-inventario-py-566-preso-no** — ✅ FEITO v571 (5.49.1) · APP · pedido 19/11 23:23
- **18-trava-dos-remendos-no-porteiro** — ✅ feito 20/11 01:20 (porteiro, sem versão do app: só teste) · APP · pedido 20/11 00:40
- **18-trava-dos-remendos** — na fila — o dono diz 'implementar' pelo prompt de 20/11 00:40 · APP
- **19-appcheck-parte-3-nuvem** — ✅ publicado pelo dono 20/11 08:11 (functions + regras); conferido: cupom sem selo responde normal (motivo nao), modo anotar
- **20-appcheck-parte-2-site** — ✅ publicado no site 1795192682 (20/11 13:55)
- **21-limpeza-5-canto-de-selos** — ✅ publicado no site 1795192682 (20/11 13:55): selos v2, faixa só no topo, sem modo lista
- **21-s1-s2-parte-3-app** — ✅ v580 (5.50.5, 20/11) — token e pixAuto só em reservasTok · APP
- **22-bug-entrar-na-nuvem-aparelho-novo** — ✅ v573 (5.49.3, 20/11) · APP · pedido 20/11 09:40
- **22-publicar-nuvem-pelo-github** — ✅ funcionando 20/11 08:41 — dono configurou (Cloud Shell); 1ª publicação de teste pelo GitHub: testes ok + Deploy complete
- **23-remendos-parte-1-render** — ✅ v574 (5.49.4, 20/11) — 0 diferenças em 60 telas · APP · pedido 20/11 09:40
- **24-pagamento-parte-1-nuvem** — ✅ publicado 20/11 12:53 (run 44767418936, sonda 0 falhas) — parte 2 (robô do Gmail) e parte 3 (site/app, esboço) a seguir
- **24-remendos-parte-3-confirmacoes** — ✅ v576 (5.50.1, 20/11) — 0 diferenças em 60 telas · APP
- **25-remendos-parte-2a-destinos** — ✅ v577 (5.50.2, 20/11) — 42 destinos × botões iguais; 0 diferenças em 60 telas · APP
- **26-remendos-parte-2b-grupos** — ✅ v578 (5.50.3, 20/11) — 9 estados de partida iguais; 0 diferenças em 60 telas · APP
- **27-remendos-parte-2c-setview-tabelas** — ✅ v579 (5.50.4, 20/11) — 42 destinos iguais; 0 diferenças em 60 telas · APP
- **28-remendos-trocas-inteiras** — em andamento · APP · ordem do dono 20/11 10:04

## Recados esperando

- para **APP**: COMO FAZER (jeito natural, regra 12) dos aprovados de hoje — NÃO copiar o código dos esboços (é pintura por cima: !important, estilo na linha, vigia que reaplic
- para **ESBOCO**: v579 (5.50.4) publicado 20/11 15:25 — item 27, remendos PARTE 2c: setView sem embrulho e nomes/frases das telas escritos uma vez (BARRA_NOME, GRP_FRASE, DT_FRAS
- para **ESBOCO**: v580 (5.50.5) publicado 20/11 16:05 — item 21 (por dentro, nuvem): código de entrega e confirmação automática do PIX só em reservasTok. Nenhuma tela muda. Para 
- para **ESBOCO**: Prompt do dono (20/11 12:26): use só o nome ESBOCO no status (nunca NUVEM, APP ou SITE). Já estão no ar o 09 e o 20 (site 1795192682) e o 21 (app v580). Confira
- para **ESBOCO**: Pedido de esboço (pagamento parte 3, preço exato — ideia do dono 20/11 12:30; estudo privado da NUVEM). Depois da conferência do 09/20/21. Telas só de celular: 
- para **todas**: **Dono (19/11 20:38): todas as sessões cometeram o erro de remendo em cima de remendo** (já pedido pelo menos 6 vezes: 17/11 20:45, 18/11 15:59, 19/11 09:49, re
- para **todas**: Cuidado: `git fetch --depth=20` às vezes não alcança o ponto comum e o rebase vira centenas de conflitos "add/add" (aconteceu comigo 19/11 15:10). Se aparecer, 
- para **todas**: CLAUDE.md regra 11 mudou (dono 20/11 00:07): todo esboço passa pelo comparador Hoje × Proposta; toda diferença precisa estar no esboço, diferença sem motivo = f
- para **todas**: Regras novas no CLAUDE.md (dono aprovou 20/11 08:21): 3b aprovação em lote (esboço pronto vai à Fila como 'esboço pronto — esperando o dono' e você segue no pró
- para **todas**: Dono 20/11 10:05: só a sessão 'NUVEM · implementa' usa o nome NUVEM no status. Quem anotou 'Anotado: dono aprovou S5+S7 e S6+S3' como NUVEM às 10:03 foi engano 
- para **todas**: tools/status.py consertado (recado SITE 01:20; regra 12, conserto por dentro 6b): um só caminho de puxar (busca funda + rebase com autostash); se não juntar ou 
- para **todas**: CLAUDE.md regra 12 mudou (dono 20/11 11:04): antes de propor qualquer solução, perguntar-se 'o que eu estou propondo é remendo?' — se for, refazer; só o que não
- para **todas**: CLAUDE.md regra 12d completada (dono 20/11 12:37): código morto se procura com o site/app RODANDO (abrir cada tela, tocar em tudo, cruzar com a planta aprovada)
- para **todas**: CLAUDE.md regra 16 ganhou os TRÊS TIPOS (dono 20/11 12:43): ler = linha com ⌄ (abre ali) · lugar = linha com › (outra tela com título e ‹ voltar) · tarefa = jan
- para **todas**: Dono 20/11 13:24: PC e notebooks vão ter um design próprio (mouse é outra interação). Até lá, esboços só de celular (e tablet quando couber) — não precisa desen
- para **todas**: CLAUDE.md regra 11 (dono 20/11 15:05): o código dos esboços é pintura por cima e NUNCA vai para o app/site; todo esboço vai à implementadora com o 'como fazer' 
- para **todas**: CLAUDE.md regra 11 enxugada (dono 20/11 15:15): fica só 'todo esboço vai à implementadora com o como fazer no jeito natural (regra 12)'; a frase 'código do esbo

Histórico antigo (até 19/11 23:50): docs/status/historico-antigo.md


## Últimas mudanças (todas as sessões, mais nova em cima)

- 20/11 14:32 — NUVEM: S1/S2 completo: nuvem parte 3 (13:58) + app item 21 (v580). Prompt entregue ao ESBOCO para conferir 09/20/21 no comparador.
- 20/11 14:18 — APP: 20/11: publicados v578 (remendos 2b grupos), v579 (2c setView e nomes das telas) e v580 (item 21: token e PIX automático em reservasTok). Espinha da limpeza completa. Próximo: trocas inteiras soltas e depois a família Resultados/Preços com os aprovados
- 20/11 14:18 — SITE: site 1795194969 no ar: foto da peça aparece por link direto (defeito de raiz), sem óculos desenhado nem brilho da Black Friday; porteiro 207 provas, 0 falhas. teste-giro fica. Próximo: varredura de código morto medindo durante as provas
- 20/11 13:56 — NUVEM: Parte 3 do S1/S2 (item 11) publicada depois do 09 do site: funções + regras, limpeza rodada na hora (workflow ganhou a opção 'limpeza'), sonda 0 falhas; recado ao APP para publicar o 21.
- 20/11 13:43 — SITE: CÓPIA LIMPA NO AR (site 1795192682): itens 9, 20 e 21 publicados; porteiro 0 falhas; NUVEM avisada. Varredura de código morto continua (medir durante as provas do porteiro)
- 20/11 13:27 — NUVEM: Pagamento parte 2 pronta (commit 8dd640d): robô do Gmail confia só na 1ª linha Authentication-Results do Gmail (ou ARC aprovado), bancos num lugar só, pagador+hora no Nubank, função confereUltimos para o dono conferir; travas teste-robo (12). Falta o dono colar no Apps Script.
- 20/11 13:14 — SITE: tema escuro fora da cópia limpa (comparador 0 diferenças, claro=escuro, porteiro 0 falhas); regra 12d completada; varredura com o site rodando: 1ª rodada superficial (987 de 2023 funções executadas) — próxima: medir durante as 205 provas do porteiro
- 20/11 12:55 — NUVEM: Pagamento parte 1 publicado e conferido no ar: servidor confere o valor a pagar (PIX e Banco Familiar), robô só confirma pedido com ficha conferida, confirmar segura a peça (sem venda dupla), pagamento não some em erro, uma regra para os bancos; +15 provas. Ramo parte 3 atualizado. Prompt entregue ao APP (com o ajuste do pixAuto no item 21).
- 20/11 12:54 — APP: v577 publicado: remendos parte 2a (inicioGo e navOn numa função só; 42 destinos iguais, 0 diferenças em 60 telas, 332/332). Próximo: parte 2b (grupos), desenho em work/s436/remendos/parte2b_notas.md
- 20/11 12:29 — SITE: PORTEIRO COM 0 FALHAS na cópia limpa (205 provas): ícone da conta consertado (saíram 3 regras de cor), 5 avisos da página da peça eram alarme falso da ferramenta (consertada). Cópia limpa pronta para o dono dizer 'publicar' — falta a resposta sobre a pasta teste-giro
- 20/11 12:07 — SITE: selos v2, faixa só no topo e fim do modo lista na cópia limpa; porteiro: 1 falha (ícone da conta sem cor no mouse) + 5 avisos visuais da página da peça; levantamento de código morto em work/s430/limpeza5/
- 20/11 12:04 — APP: 20/11 até 15:10 — publicados v573 (bug Entrar na nuvem), v574 (remendos parte 1: render), v575 (item 16: peça incompleta não vai ao site + peças de teste), v576 (remendos parte 3: confirmações); item 21 pronto no ramo app-item21 esperando a NUVEM. Próximo: remendos parte 2 (destinos/barra/grupos)
- 20/11 10:18 — SITE: limpeza 5 (canto de selos) como esboço no ramo, na Fila (item 21) esperando A ou B; porteiro no ramo: 2 falhas (ícone da conta, pulo do carrinho no PC) + 5 avisos visuais a conferir
- 20/11 10:04 — NUVEM: Dono decidiu no S5+S7: sem inscritos de verdade → ao implementar, apagar as inscrições atuais (novidades e avise-me); S5S7 e S6S3 aprovados, esperando 'implementar'.
- 20/11 10:03 — NUVEM: Anotado: dono aprovou S5+S7 e S6+S3 (esperando implementar; falta decidir inscritos atuais no S5+S7)
- 20/11 10:01 — APP: v573 publicado: item 22 bug do Entrar na nuvem em aparelho novo (328/328). Próximo: item 23 (remendos parte 1, render), esperando o 'pode' do dono
- 20/11 09:57 — NUVEM: Limpeza 2+3 (regra 12) publicadas e conferidas no ar: Falha única (14 cópias), post()/corpo/tokenDe/falhou nas portas, CORS_SITE (3 listas), avisaAparelhos (3 cópias), ehVip, catalogoPisos, hash, urlFn, telefone e escape de HTML num lugar só; respostas das 15 portas iguais antes×depois; travas teste-portas (17); sonda no ar automática no fim de cada publicação (0 falhas); doc NUVEM-COMO-FUNCIONA. Parte 3 (item 11) refeita no ramo nuvem-parte3b sobre o main novo, com espera do token; recados ao SITE (09 primeiro) e ao APP (21 só depois do 11).
- 20/11 09:55 — SITE: porteiro parte 1 feita (categoria vinda da loja): 24 → 11 falhas na cópia limpa; sobram 9 dos selos (limpeza 5), ícone da conta sem cor no mouse, 1 contraste no painel e 5 avisos visuais na página da peça a conferir
- 20/11 09:31 — SITE: itens 9 e 20 na cópia limpa (nuvem real 16/16); porteiro rodado na cópia limpa: 24 falhas, causa achada (13 provas presas numa categoria fixa sem peças) — esboço do conserto com o dono
- 20/11 09:25 — NUVEM: Limpeza 1 (regra 12): envio de e-mail num lugar só (emailResend) no lugar de 8 cópias + trava teste-email; 19 suítes ok; publicado pelo GitHub (run 44735365715, commit 0d97d3f).
- 20/11 08:40 — NUVEM: item 22 funcionando: 1ª publicação da nuvem pelo GitHub (testes + deploy) deu certo
- 20/11 08:36 — NUVEM: script de configuração do item 22 corrigido (para com erro; espera a conta nova)
- 20/11 08:18 — APP: guardado o aprovado 20/11 08:17: comparador único (site + app, duas listas de telas); recados para SITE e ESBOCO; nada no código
- 20/11 02:51 — APP: NOITE 20/11 (dono dormindo), nada mexido em src/ nem www/: (1) B3 item 05 já estava publicado (v572) e foi CONFERIDO EM CELULAR REAL no Test Lab, claro e escuro (prints work/s436/testlab/). (2) Item 16 NÃO implementado; esboço v2 pronto e passado no comparador, celular/tablet/PC (work/s436/banco/esboco16_ficha_*.jpg) — falta o dono dizer se marca e coleção são obrigatórias. (3) PLANO DOS REMENDOS em 10 partes: docs/PLANO-REMENDOS-20-11.md (62 funções com 104 remendos); parte 1 (render) ENSAIADA numa cópia: 0 diferenças em 60 telas x 3 aparelhos, 327/327 testes. (4) BUG ACHADO, não consertado: aparelho novo/desconectado › Início › 'Entrar' na nuvem dá tela vazia (esboço work/s436/bug-nvir/). DECISÕES DO DONO: a) consertar o bug do Entrar? b) implementar a parte 1 dos remendos? c) item 16: marca e coleção obrigatórias? Na Fila esperando o site: 18-s1-s2-parte-3-app.
- 20/11 01:18 — SITE: comparador Hoje × Proposta refinado (work/s430/comparador/compara.py); test drive no esboço dos selos: acha só as 2 falhas reais
