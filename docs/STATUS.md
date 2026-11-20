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
| APP | item 31 URGENTE: câmera branca ao gravar a volta (trava de luz) | src/98z-camera-u149f.js, src/97-estudio-giro.js, tests/run.py |
| ESBOCO | 1) 'como fazer' dos 15 aprovados de Resultados/Preços para a APP · 2) conferir v579/v581/v582 · 3) esboço pagamento parte 3 (pedido da NUVEM) | docs/APROVADOS-POR-FAMILIA.md |
| NUVEM | S3 parte 3: fechar pedidos/ e vistas/ nas regras | firestore.rules |
| SITE | varredura de código morto: roteiros de mapa, câmera do rosto, consulta do grau, atacado, conta e avaliação (só medição) | work/s430/varredura |

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
- **28-remendos-trocas-inteiras** — ✅ v581 (5.50.6, 20/11) — 0 diferenças em 60 telas · APP
- **28-s5s7-nuvem** — nuvem PRONTA no ramo nuvem-s5s7 (16 provas) — espera o 'implementar' do dono; depois o SITE mostra 'Enviamos um e-mail para confirmar' quando a resposta tiver confirmar:true
- **29-remendos-parte-4a-dashboard-dia-historico** — ✅ v582 (5.50.7, 20/11) — 0 diferenças em 60 telas · APP
- **29-s6-vip-nuvem** — ✅ publicado 20/11 15:40 (run 44793310738, sonda 0 falhas) — SITE manda o login no 'presentes' e no 'reservar' (recado 15:41)
- **30-s3-pedido-pela-nuvem** — parte 1 ✅ nuvem 15:55 · parte 2 ✅ SITE publicado v1795215331 (20/11 20:25) · parte 3: NUVEM fecha a criação direta em pedidos/
- **30-vistas-pela-analise** — ✅ v583 (5.50.8, 20/11) · APP
- **31-urgente-camera-branca-ao-gravar-a-volta** — em andamento · APP · URGENTE do dono 20/11 19:55 (celular real, via ESBOCO)
- **31-visitas-num-lugar-so** — nuvem ✅ (porPeca na análise, 20/11 16:05) — APP lê da análise → SITE tira o vistaEnvia → NUVEM fecha vistas/ nas regras

## Recados esperando

- para **ESBOCO**: v583 (5.50.8) publicado 20/11 20:10 — item 30 (por dentro, pedido da NUVEM): as visitas por peça vêm da análise da nuvem; nenhuma tela muda. Para conferir: Mark
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
- para **todas**: Dono 20/11 15:28 (está no topo do docs/MEMORIA-PROJETO.md): TUDO até agora é teste — o site só abre ao público quando o projeto terminar. Não há inscritos, VIPs

Histórico antigo (até 19/11 23:50): docs/status/historico-antigo.md


## Últimas mudanças (todas as sessões, mais nova em cima)

- 20/11 20:03 — SITE: recados da NUVEM feitos e NO AR (site 1795215331): pedido pela porta 'pedido', login no cupom e na reserva (S6), 6 funções mortas fora; porteiro 208 provas 0 falhas; NUVEM avisada. Vistas espera o APP
- 20/11 19:53 — APP: v583 publicado: vistas por peça pela análise da nuvem (recado da NUVEM, S3); chamada à análise num lugar só; 338/338
- 20/11 19:45 — NUVEM: Lista docs/FALTA-PARA-LANCAR.md (o que falta para lançar, por quem faz) — pedido do dono 19:44.
- 20/11 19:44 — ESBOCO: Conferidos 09/20 (site) e 21 (app) no comparador + prova funcional: login por usuário e token do pedido pago batem; 0 falha nova na página da peça; recados para SITE e APP. Semp completo como ideia (todas as partes aprovadas). A seguir: conferir v579/v581/v582; esboço 'pagamento parte 3' pedido pela NUVEM; 'como fazer' dos 15 aprovados de Resultados/Preços pedido pela APP.
- 20/11 16:11 — SITE: varredura com o site rodando (60% das funções rodam nas provas); 6 funções mortas certas fora da CÓPIA LIMPA (15 KB; comparador 0 diferenças; porteiro 207 provas, 0 falhas) — ainda NÃO publicado; porteiro ajustado aos dados novos da loja (nomes mudaram, 18 peças)
- 20/11 15:58 — APP: v582 publicado: remendos parte 4a (Dashboard, dia, Histórico e Pendências com uma função cada; 0 diferenças em 60 telas; 337/337). Hoje: v573 a v582. Próximo: seguir por dentro (Preços, Peças, Site, Dinheiro…) enquanto a ESBOCO manda o 'como fazer' dos aprovados
- 20/11 15:57 — NUVEM: Análise com porPeca publicada (base para tirar a coleção vistas/ aberta); recados ao APP (ler da análise) e ao SITE (tirar o vistaEnvia depois).
- 20/11 15:42 — NUVEM: S3 parte 1 publicada e conferida no ar: porta 'pedido' (formato das regras, limites, comprovante só de pedido recebido e não pago); recado ao SITE com a parte 2.
- 20/11 15:33 — NUVEM: S6 publicado (VIP só para a cliente logada) e conferido no ar; recado ao SITE para mandar o login no presentes/reservar; tudo é teste até o lançamento (memória do projeto + recado a todas).
- 20/11 15:28 — APP: v581 publicado: trocas inteiras (8 funções com uma versão só; 0 diferenças em 60 telas; 336/336). Hoje: v573 a v581. Próximo: família Resultados/Preços (4a por dentro, depois os 15 aprovados)
- 20/11 15:25 — NUVEM: texto.js (e-mail válido e limpar texto num lugar só) publicado e conferido no ar; S5+S7 da nuvem pronto no ramo nuvem-s5s7 (espera implementar); pedido de esboço da parte 3 do pagamento ao ESBOCO; S6 precisa de ajuste antes (telefone da conta é a própria cliente que grava).
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
