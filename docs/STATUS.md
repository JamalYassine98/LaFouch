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
| APP | 4b parte 1: preço automático vai para Ajustes › Preços (149p); sai REGRAS DO CONTADOR de Preços | src/89-dash-abas.js, src/96-ajustes.js, src/97-ajustes-lista.js, src/97z2-contador.js, tests/run.py |
| ESBOCO | esboço 41c: Galeria do app + câmera sem cadastro + cadastro escolhendo da Galeria | work/s435/giro |
| SITE | Internet fraca parte 1 (1ª tela dentro da página): estudo do robô das páginas + implementação por dentro | js/lf-site.js, index.html |

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
- **28-s5s7-nuvem** — ✅ completo: nuvem 20/11 23:52 + site 1795234339 ('Enviamos um e-mail para confirmar')
- **29-remendos-parte-4a-dashboard-dia-historico** — ✅ v582 (5.50.7, 20/11) — 0 diferenças em 60 telas · APP
- **29-s6-vip-nuvem** — ✅ publicado 20/11 15:40 (run 44793310738, sonda 0 falhas) — SITE manda o login no 'presentes' e no 'reservar' (recado 15:41)
- **30-s3-pedido-pela-nuvem** — ✅ completo: parte 1 (15:55) + parte 2 SITE v1795215331 (20:25) + parte 3 regras (20:08, run 44834391367; sonda no ar: criar pedido direto = 403)
- **30-vistas-pela-analise** — ✅ v583 (5.50.8, 20/11) · APP
- **31-urgente-camera-branca-ao-gravar-a-volta** — ✅ v584 (5.50.9, 20/11) — falta o dono testar no celular real · APP
- **31-visitas-num-lugar-so** — ✅ completo: APP v583 lê da análise · regras fecham vistas/ (20:08) · SITE tirou o vistaEnvia (v1795225493)
- **32-esc-filtros-carrinho-voltar-internet-fraca** — partes 1 e 2 ✅ site 1795225493 · internet fraca: parte 0 ✅ site 1795232856 (1ª visita não espera o selo) · partes 1–3: esboço pronto — esperando o dono (docs/PLANO-INTERNET-FRACA-21-11.md, com a medida em rede limpa)
- **32-urgente-camera-desfocada-ao-gravar** — ✅ v585 (5.50.10, 20/11) — falta o dono testar no celular real · APP
- **33-urgente-giro-no-celular-real** — ✅ v586 (5.50.11, 20/11) — falta o dono testar no celular real
- **34-plano-das-ferramentas** — esboço pronto — esperando o dono (docs/PLANO-FERRAMENTAS-21-11.md: 4 partes — um simulador, um jeito de medir, comparador único, porteiro só portão; decidir a ordem)
- **34-qual-e-a-frente-com-o-tratamento-do-giro** — ✅ v587 (5.50.12, 20/11) — pedido do dono 20/11 22:18 ('corrija'); falta o dono testar no celular real
- **35-tratamento-do-giro-parava-no-celular** — ✅ v587 (5.50.12, 20/11) — falta o dono testar no celular real
- **35-varredura-codigo-morto** — 4ª rodada feita (64% do programa roda nas provas): saíram 4 funções mortas certas (site 1795232856); 119 blocos (74 KB) só são alcançados por telas que as provas ainda não percorrem — próximo: uma prova por área (coração voando, cidade, recibo, pedido pago, código por e-mail, Google, câmera do rosto, modo loja, atacado) e depois os suspeitos vão ao dono com imagem
- **36-prova-v468-nuvem-segura-instavel** — na fila — investigar (APP)
- **37-ajustes-pecas-grupo-escolha** — aprovado 20/11 23:42 — espera o 'implementar'
- **37-giro-camera-reta-e-peca-reta** — aprovado 21/11 07:51: avisa E o tratamento endireita até ±3° — espera o 'implementar'
- **38-aviso-curto-acima-da-barra-e-com-cor** — aprovado 21/11 07:51 — espera o 'implementar'
- **38-giro-tratamento-mais-rapido** — na fila — APP, PRIORIDADE (dono 20/11 23:39: ~5 min por peça no celular não serve para 1.000 peças)
- **39-giro-frente-com-um-lado-apagado** — ✅ v588 (5.50.13, 21/11) — falta o dono testar no celular real; sem trava no porteiro
- **39-pagamento-parte-3-preco-exato** — aprovado 21/11 07:51 — espera o 'implementar' (ordem: NUVEM → SITE → APP)
- **40-hospedagem-app-firebase** — parte 1 ✅ 21/11 08:05 (lafouch-2f6bd.web.app, em paralelo) — partes 2 (APP) e 3 (dono) só no fim, antes de lançar
- **41-estudio-galeria-e-peca-na-camera** — 41 aprovado (07:51) · 41c esboço pronto — esperando o dono (Galeria do app; giro sempre grava; cadastro escolhe da Galeria)
- **42-cores-e-fotos-nova-cor** — aprovado 21/11 07:51 — espera o 'implementar'
- **43-implementar-tudo-em-partes** — em andamento — dono 21/11 08:03 'implementar tudo': uma parte por versão; começa pelo 4b Preços (3 partes)

## Recados esperando

- para **ESBOCO**: v589 publicada: item 39b — dentro da caixa vale ponto a ponto (m2 só recebe os pontos do pedaço que estão dentro da caixa; o pedaço inteiro só entra se tocar o 
- para **ESBOCO**: v590 (5.50.15) no ar: Black Friday só a da CDE. O dono (21/11 07:37) repetiu que a internacional sai de vez — saiu a data de reserva (4ª sexta de novembro) de c
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

- 21/11 08:04 — NUVEM: Hospedagem parte 1 no ar (app também em lafouch-2f6bd.web.app, sonda ok); S5S7 completo com o site; esboço do preço exato (Fila 39) visto — espera o dono.
- 21/11 07:58 — APP: v590 no ar: Black Friday só a da CDE (saiu a data internacional de reserva dos 3 calendários; trava no porteiro; 344/344). Próximo: 4b Preços
- 21/11 07:29 — APP: v589 no ar (item 39b, risco do ESBOCO corrigido). 343 provas. Próximo: 4b Preços (como fazer do ESBOCO).
- 21/11 02:04 — ESBOCO: Noite 20→21/11 (dono dormindo): (1) 'como fazer' dos 15 aprovados de Resultados/Preços para o APP em 3 partes — work/s435/comofazer/4b-PRECOS.md, 4c-GIRO-RESERVAS-E-4a.md, 4d-SUPERFICIE-E-FICHA.md; (2) conferidos: app v585–v588 (0 falha de tela; 1 falha da v586: aviso curto tampa a barra e sai sempre verde → esboço 38; risco no item 39 da v588 + prova sugerida) e site 1795225493, 1795232856, 1795234339 (comparador 0 falha); (3) esboço 39 pagamento parte 3 preço exato (achado: PIX sem par nunca é mostrado no app). Também esboços 40 câmera reta/peça reta, 41 Estúdio + Galeria + peça na câmera, 42 Cores e fotos sem Trocar foto e Nova cor fácil. Tudo na Fila como 'esboço pronto — esperando o dono'. NÃO testado em aparelho real.
- 21/11 01:13 — SITE: Noite 20→21/11 (dono dormindo): (1) memória e lista viva RECUPERADAS (1,3 MB regravados por engano em 20/11) + trava no status.py; (2) site 1795232856, por dentro: 1ª visita não espera o selo (rede limpa: 4G fraco 31→22 s até a 1ª foto; 4G bom 6,1→2,9 s), pedido tenta de novo sozinho 1x, cancelar 409 = feito, 4 funções mortas fora; (3) site 1795234339: novidades pede a confirmação do e-mail (S5, recado da NUVEM); porteiro 224 provas 0 falhas; (4) ESBOÇOS ESPERANDO O DONO: docs/PLANO-INTERNET-FRACA-21-11.md (partes 1–3) e docs/PLANO-FERRAMENTAS-21-11.md (4 partes); (5) faixa do evento já estava no ar desde 20/11; (6) varredura: 64% do programa roda nas provas, faltam provas de 9 áreas antes de mostrar suspeitos. DONO TESTAR no celular: abrir o site em aba anônima no 4G; inscrever um e-mail nas novidades (chega o e-mail de confirmar?); compra de teste até o PIX; cancelar um pedido pendente em Minha conta; voltar com Filtros, foto ampliada e aviso 'adicionado' abertos.
- 21/11 00:15 — APP: MADRUGADA 21/11 — feito: v588 no ar (item 39: armação clara não perde um lado no giro tratado; provado com as poses de referência a 45% do contraste, giro normal sem mudança; NÃO reproduzido com a gravação do dono; sem trava no porteiro). Memória restaurada (meu ajudante de publicar truncava o arquivo; consertado). NÃO feito: item 38 (tempo do tratamento) — sem os tempos por fase do celular eu mexeria no escuro; 4b Preços (como fazer recebido) — não comecei para não deixar tela pela metade. PARA O DONO CONFERIR NO APARELHO REAL: (1) v588: gravar a mesma armação bege — a frente sai com as DUAS lentes? (2) tempo de cada fase (diário [LF-CAM]: fundo, mede, grava) e se saiu mp4 ou webm; (3) o giro no site gira com o dedo e fecha sem pulo; (4) 'Qual é a frente?' — parar a gravação antes da volta e escolher: saem as duas fotos de fundo branco; (5) a linha 'Travado: branco' aparece e não há clarão; (6) avisos aparecem por cima do Estúdio. Pendências abertas: nota 100 em foto pela metade; item 36 (prova v468 instável); item 37 (câmera reta/peça reta, com o ESBOCO).
- 20/11 23:55 — NUVEM: Plano da hospedagem pronto (docs/PLANO-HOSPEDAGEM-20-11.md): o site já está na Cloudflare desde 16/11; falta tirar o APP do GitHub Pages — recomendação Firebase Hosting; espera 'Aprovado A/B'.
- 20/11 23:54 — NUVEM: S5+S7 publicado na nuvem e conferido no ar; recado ao SITE com a frase do esboço. Conferido depois da recuperação: minhas linhas na memória e na lista viva estão lá. Próximo: plano da hospedagem.
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
