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
| APP | item 39: peça clara perdia um lado no giro tratado — a caixa por onde a peça passa na volta também conta como peça | src/97-giro-trata.js, tests/run.py |
| ESBOCO | esboços do giro: câmera reta + peça reta · Estúdio mostra o que a peça já tem + galeria + para qual peça vai · cores mais fáceis | work/s435/giro |
| NUVEM | S5S7: publicar (dono: implementar 23:48) | functions/ |
| SITE | Noite 20→21/11 (dono dormindo): faixa do evento → plano das ferramentas → varredura de código morto com o site rodando | js/lf-site.js, index.html |

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
- **24-pagamento-parte-1-nuvem** — ✅ parte 1 (12:53) + ✅ parte 2: robô novo colado pelo dono 20/11 20:15, confereUltimos 7/7 autênticos (5 Nubank, 2 Banco Familiar) — falta a parte 3 (preço exato, esboço com o ESBOCO)
- **24-remendos-parte-3-confirmacoes** — ✅ v576 (5.50.1, 20/11) — 0 diferenças em 60 telas · APP
- **25-remendos-parte-2a-destinos** — ✅ v577 (5.50.2, 20/11) — 42 destinos × botões iguais; 0 diferenças em 60 telas · APP
- **26-remendos-parte-2b-grupos** — ✅ v578 (5.50.3, 20/11) — 9 estados de partida iguais; 0 diferenças em 60 telas · APP
- **27-remendos-parte-2c-setview-tabelas** — ✅ v579 (5.50.4, 20/11) — 42 destinos iguais; 0 diferenças em 60 telas · APP
- **28-remendos-trocas-inteiras** — ✅ v581 (5.50.6, 20/11) — 0 diferenças em 60 telas · APP
- **28-s5s7-nuvem** — nuvem PRONTA no ramo nuvem-s5s7 (16 provas) — espera o 'implementar' do dono; depois o SITE mostra 'Enviamos um e-mail para confirmar' quando a resposta tiver confirmar:true
- **29-remendos-parte-4a-dashboard-dia-historico** — ✅ v582 (5.50.7, 20/11) — 0 diferenças em 60 telas · APP
- **29-s6-vip-nuvem** — ✅ publicado 20/11 15:40 (run 44793310738, sonda 0 falhas) — SITE manda o login no 'presentes' e no 'reservar' (recado 15:41)
- **30-s3-pedido-pela-nuvem** — ✅ completo: parte 1 (15:55) + parte 2 SITE v1795215331 (20:25) + parte 3 regras (20:08, run 44834391367; sonda no ar: criar pedido direto = 403)
- **30-vistas-pela-analise** — ✅ v583 (5.50.8, 20/11) · APP
- **31-urgente-camera-branca-ao-gravar-a-volta** — ✅ v584 (5.50.9, 20/11) — falta o dono testar no celular real · APP
- **31-visitas-num-lugar-so** — ✅ completo: APP v583 lê da análise · regras fecham vistas/ (20:08) · SITE tirou o vistaEnvia (v1795225493)
- **32-esc-filtros-carrinho-voltar-internet-fraca** — partes 1 e 2 ✅ publicadas no site 1795225493 (20/11): Esc = voltar, carrinho por cima — porteiro 221 provas, 0 falhas · parte 3 (internet fraca): plano em partes sendo medido, vai ao dono como esboço
- **32-urgente-camera-desfocada-ao-gravar** — ✅ v585 (5.50.10, 20/11) — falta o dono testar no celular real · APP
- **33-urgente-giro-no-celular-real** — ✅ v586 (5.50.11, 20/11) — falta o dono testar no celular real
- **34-qual-e-a-frente-com-o-tratamento-do-giro** — ✅ v587 (5.50.12, 20/11) — pedido do dono 20/11 22:18 ('corrija'); falta o dono testar no celular real
- **35-tratamento-do-giro-parava-no-celular** — ✅ v587 (5.50.12, 20/11) — falta o dono testar no celular real
- **36-prova-v468-nuvem-segura-instavel** — na fila — investigar (APP)
- **37-ajustes-pecas-grupo-escolha** — aprovado 20/11 23:42 — espera o 'implementar'
- **37-giro-camera-reta-e-peca-reta** — na fila — esboço com o ESBOCO (pedido do dono 20/11 23:29)
- **38-giro-tratamento-mais-rapido** — na fila — APP, PRIORIDADE (dono 20/11 23:39: ~5 min por peça no celular não serve para 1.000 peças)
- **39-giro-frente-com-um-lado-apagado** — na fila — APP, urgente

## Recados esperando

- para **APP**: URGENTE (memória): seus commits de 20/11 10:05 (1a4c5d276) e 19:52 (7608aeb74) gravaram docs/MEMORIA-PROJETO.md e docs/FALTA-APROVAR-15-11.md só com a linha nov
- para **APP**: COMO FAZER 1/3 — parte 4b Preços (135h, 149l-Preços, 149p, 149pl, 149fe, 149pg, 149sc, 149dup; + 149t e esboço 37: ícones de lista cinza, link declarado na cria
- para **APP**: COMO FAZER 2/3 — 4c Giro e Reservas (135d, 149r) + o que faltou da 4a (149t, 149d — a v582 saiu só com a limpeza): work/s435/comofazer/4c-GIRO-RESERVAS-E-4a.md.
- para **APP**: COMO FAZER 3/3 — 149s (superfície, 9 telas) + 134/134b/134d e 136a (ficha do Inventário): work/s435/comofazer/4d-SUPERFICIE-E-FICHA.md. Pontos: .card (style.css
- para **SITE**: S5+S7 PUBLICADO na nuvem (dono: 'Implementar S5S7', 20/11 23:48; esboço privado S5S7 aprovado 10:02). Sua parte (a 1 frase do esboço; tela muda, então é impleme
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
- para **todas**: Memória e lista viva foram RECUPERADAS (20/11 23:59): tinham sido regravadas só com a linha nova (993 KB + 365 KB sumidos desde 10:05/19:52). Puxem o mais novo 

Histórico antigo (até 19/11 23:50): docs/status/historico-antigo.md


## Últimas mudanças (todas as sessões, mais nova em cima)

- 20/11 23:42 — APP: item 39 em estudo: comparei giroTrata com o trata_giro2.py do site (mesmas regras para achar a peça e as mesmas folgas); com 6 quadros reais do vídeo do dono a peça sai inteira — ainda NÃO reproduzi a frente com um lado apagado. Falta a gravação da pose de frente (pedi ao dono gravar a tela de novo). Nada publicado.
- 20/11 23:07 — APP: v587 no ar: (35) o tratamento do giro agora termina no celular — as duas bibliotecas vão dentro do app.js (o APK instalado não tinha os arquivos; a atualização só leva app.js e style.css); (34) 'Qual é a frente?' tira a frente e a 3/4 com o tratamento do giro. 343 provas, 0 falhas; reproduzido no simulador o erro do celular e o conserto. NÃO testado em aparelho real. Próximo: resultado do teste do dono (tempo do tratamento no celular); item 36 (prova v468 instável).
- 20/11 23:02 — NUVEM: Respondido ao SITE (cancelamento sem login aceito); visitas num lugar só completo.
- 20/11 22:47 — SITE: Fila 32 partes 1 e 2 publicadas no site 1795225493: Esc = voltar (uma regra), carrinho/conta por cima, avisos fecham com o voltar; vistas/ fora do site; cancelar por um caminho só. Porteiro 221 provas, 0 falhas; comparador 12 telas, 0 diferenças. Falta a parte 3 (internet fraca): medir em rede limpa e levar o plano ao dono.
- 20/11 22:13 — APP: v586 no ar (item 33, urgente): giro no celular real — sem clarão ao gravar (só trava de branco), a volta fecha com o prato ligado depois de gravar, avisos do Estúdio por cima da tela, gravação não se perde na escolha à mão; 341 provas, 0 falhas; ensaio de ponta a ponta no simulador. NÃO testado em aparelho real (o tratamento do giro nunca rodou num celular). Dono decide: escolha à mão do giro (sai ou fica?) e diário da câmera (fica?). Próximo: resultado do teste do dono; depois segue a ordem (limpezas por dentro por família).
- 20/11 21:21 — SITE: 3 esboços mandados ao dono (Fila 32): Esc nos Filtros, entrar→carrinho→voltar, internet fraca
- 20/11 21:10 — SITE: investigadas as 9 falhas do porteiro completo: 5 de animação eram da máquina de teste (provas de tempo agora rodam sozinhas), 2 eram provas velhas (Filtros, carrinho) — consertadas; reais: Esc não fecha os Filtros, conta→carrinho→voltar pula a tela de entrar, internet fraca ~12 s até a 1ª foto; contraste do painel intermitente. Nada mudou no site; esperando o dono
- 20/11 20:45 — APP: v585 publicado: URGENTE câmera desfocada/rosada ao gravar (foco, luz e branco só travam com o valor em uso; solta tudo se a imagem mudar). 339/339 no simulador; falta o dono testar no celular. Próximo: item 33 (quadro do giro com nota baixa não vira foto) — remendo pronto em /tmp/p33.py
- 20/11 20:33 — SITE: varredura rodada 3: 64% das funções rodam (porteiro completo + roteiros); faltam provas próprias de câmera do rosto, consulta do grau, atacado, conta, avaliação, recibo; o porteiro COMPLETO tem 9 falhas que o rápido não roda (animação da busca/menu, 4G fraco, Filtros, carrinho por cima da conta, contraste no painel)
- 20/11 20:19 — APP: v584 publicado: URGENTE câmera branca ao gravar a volta (trava de luz só com o valor em uso; solta se a imagem estourar). 339/339 no simulador; falta o dono testar no celular real
- 20/11 20:16 — NUVEM: Pagamento parte 2 no ar: dono colou o robô novo; confereUltimos 7/7 autênticos.
- 20/11 20:10 — NUVEM: S3 completo: regras fecham pedidos/ e vistas/ (publicado e conferido no ar, 403); sonda ganhou essa conferência; recado ao SITE para tirar o vistaEnvia morto.
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
