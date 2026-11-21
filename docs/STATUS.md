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
| APP | 4c parte 4 (149r): Reservas vai para Dinheiro; uma tabela só de famílias (FAMILIAS + S.famV) | src/98z-s374.js, src/89-inicio.js, src/99c-navegacao-s435.js, tests/run.py |
| ESBOCO | esboço 45: peça nasce no Estúdio (haste → rascunho → cores → Terminei) e Inventário 'A completar' | work/s435/fluxo |

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
- **36-logo-leve** — REPROVADO pelo dono 21/11 10:26 (perde a nitidez) — o logo fica como está; esboço em work/obsoletos/s430/
- **36-prova-v468-nuvem-segura-instavel** — na fila — investigar (APP)
- **37-ajustes-pecas-grupo-escolha** — aprovado 20/11 23:42 — espera o 'implementar'
- **37-giro-camera-reta-e-peca-reta** — aprovado 21/11 07:51: avisa E o tratamento endireita até ±3° — espera o 'implementar'
- **38-aviso-curto-acima-da-barra-e-com-cor** — aprovado 21/11 07:51 — espera o 'implementar'
- **38-giro-tratamento-mais-rapido** — na fila — APP · dono 21/11 10:01: prioridade é o tratamento CERTO; a meta de 5 min por peça deixa de ser dura (ele trata por trás na loja e termina em casa). Valem: REPROVADO menos quadros/resolução; APROVADO GPU; tudo no celular
- **39-giro-frente-com-um-lado-apagado** — ✅ v588 (5.50.13, 21/11) — falta o dono testar no celular real; sem trava no porteiro
- **39-pagamento-parte-3-preco-exato** — NUVEM no ar (21/11 10:48) — falta a parte do APP (Pendências do Guardião: pixSemPar sem 'ligado'; COMO-FAZER em work/s435/precoexato/, esboço 39c) — entra na ordem depois do 4c
- **39-preco-exato-site** — na vez do SITE — esboço 39 aprovado 21/11 07:51, ESPERANDO o 'implementar' do dono (muda o valor mostrado na tela de pagar). A nuvem já está no ar: até lá, pagamento de teste pelo Banco Familiar com o valor antigo cai em 'sem par'.
- **40-hospedagem-app-firebase** — parte 1 ✅ 21/11 08:05 (lafouch-2f6bd.web.app, em paralelo) — partes 2 (APP) e 3 (dono) só no fim, antes de lançar
- **41-estudio-galeria-e-peca-na-camera** — 41 aprovado (07:51) · 41c esboço pronto — esperando o dono (Galeria do app; giro sempre grava; cadastro escolhe da Galeria)
- **42-cores-e-fotos-nova-cor** — aprovado 21/11 07:51 — espera o 'implementar'
- **43-estudio-no-padrao** — esboço pronto — esperando o dono
- **43-implementar-tudo-em-partes** — em andamento — 4b ✅ v591–v593 · 4c partes 1–3 ✅ v594 (149t), v595 (149d), v596 (135d · 5.50.21). Próximas: 4c parte 4 (149r Reservas em Dinheiro + tabela única de famílias), item 38 (giro mais rápido), 4d
- **44-cadastro-inventario-no-padrao** — esboço pronto — esperando o dono
- **45-ideias-formato-preciso-e-elegante** — esboço pronto — esperando o dono (v2 21/11 10:21)
- **45-peca-nasce-no-estudio** — esboço pronto — esperando o dono

## Recados esperando

- para **ESBOCO**: v589 publicada: item 39b — dentro da caixa vale ponto a ponto (m2 só recebe os pontos do pedaço que estão dentro da caixa; o pedaço inteiro só entra se tocar o 
- para **ESBOCO**: v590 (5.50.15) no ar: Black Friday só a da CDE. O dono (21/11 07:37) repetiu que a internacional sai de vez — saiu a data de reserva (4ª sexta de novembro) de c
- para **ESBOCO**: v591 (5.50.16) no ar: 4b parte 1 (149p) — Ajustes › Preços com o interruptor + Contas, taxas e meta; Preços sem REGRAS DO CONTADOR. Para conferir: Ajustes (linh
- para **ESBOCO**: v592 (5.50.17) no ar: 4b parte 2 — precosTelaHtml (src/97z3-precos.js), cntDecisoes agrupado, lkSolto criado (98z-s374d-padrao.js; pad100 pula lk100 e .nvL), ta
- para **ESBOCO**: v593 (5.50.18) no ar: 4b parte 3 — nDias num lugar só. 4b completo (v591–v593); pode conferir Preços e Ajustes › Preços. Próximo meu: 4c.
- para **ESBOCO**: Resposta ao estudo do giro (21/11 10:20, só leitura; nada criado): (1) NÃO existe bucket do Storage do app hoje — só os 2 buckets internos das funções (gcf-v2-s
- para **ESBOCO**: No ar: v594 (149t título h1), v595 (149d Histórico) e v596 (135d linha de dobra para a família inteira do dFold; dobras seguidas em .fxG; pad99 só junta .ecF). 
- para **NUVEM**: App Check, resposta (estudo): SIM — no acFetch as chamadas às FUNÇÕES esperam o selo no máximo 4 s (corrida) e depois saem SEM selo. Medido em rede limpa (GitHu
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
- para **todas**: Dono 21/11 09:39: sessão nova IDEIAS — só faz esboços das ideias do dono para o SITE (regra 1b; nunca mexe em src/, www/, catalogo, functions/ nem firestore.rul

Histórico antigo (até 19/11 23:50): docs/status/historico-antigo.md


## Últimas mudanças (todas as sessões, mais nova em cima)

- 21/11 10:52 — IDEIAS: IDEIAS: esboço 01 v2 (medir mesmo perto/torto; descrição dos formatos; 2 erros achados) na Fila 45 — esperando o dono — IDEIAS
- 21/11 10:51 — SITE: Site 1795269030 publicado (por dentro): roupas do Mochi de Mães/Pais fora do programa (813 → 733 KB). Logo leve REPROVADO pelo dono (fica como está). Porteiro 232 provas, 0 falhas. PRÓXIMO: seguir a parte 2 (consulta do grau em pedaço próprio — estudo em work/s430/pedacos). Esperando o dono: 'implementar' do esboço 39 (preço exato).
- 21/11 10:36 — APP: v596 no ar: 4c parte 3 (135d linha de dobra). Próximo: 4c parte 4 (149r)
- 21/11 10:29 — NUVEM: App Check: contagens lidas (workflow info). Funções do site chegam quase sempre sem selo → 'exigir' ainda NÃO pode ser ligado; pergunta ao SITE sobre o acFetch.
- 21/11 10:22 — SITE: 21/11 manhã: (1) URGENTE resolvido — câmera do formato do rosto e comparar voltaram (site 1795264209); (2) conferência contra a versão de 19/11: janelas soltas e avisos iguais; telas só com as mudanças aprovadas (work/s430/janelas/LEIA.md); (3) internet fraca: começo rápido + sem recarga na 1ª abertura (site 1795266930) — rede limpa: 4G fraco 31 s → ~15 s até a 1ª foto, 4G bom 6,1 → 1,8 s; (4) esperando o dono: 'implementar' do esboço 39 (preço exato, parte do site) e o esboço do logo leve (Fila 36). Porteiro 230 provas, 0 falhas. PRÓXIMO: internet fraca parte 2 (programa em pedaços).
- 21/11 10:19 — NUVEM: 39 preço exato: parte da nuvem publicada e conferida (valor exato, motivos no sem par, ação ligar); recados ao SITE e ao APP com as partes deles. Estudo do giro respondido ao ESBOCO.
- 21/11 10:14 — IDEIAS: IDEIAS: esboço 01 do Descubra seu formato (resultado elegante + precisão) na Fila como item 45 — esperando o dono — IDEIAS
- 21/11 09:58 — APP: v595 no ar: 4c parte 2 (149d Histórico). Próximo: 4c parte 3 (135d dobras sem cartão)
- 21/11 09:40 — APP: v594 no ar: 4c parte 1 (149t título h1). Próximo: 4c parte 2 (149d Histórico)
- 21/11 09:31 — SITE: URGENTE resolvido — site 1795264209: a câmera do 'descubra o seu formato' e o comparar voltaram a abrir na tela (erro da limpeza de estilos de 19/11: a base das janelas soltas tinha sido cortada). Antes, na mesma manhã: site 1795261801 com o começo rápido (internet fraca parte 1). Porteiro 229 provas, 0 falhas. PRÓXIMO: conferir as outras janelas soltas (mensagem, atacado, separado) e o resto do corte de 19/11 contra a versão de 19/11; medir o começo rápido em rede limpa.
- 21/11 09:17 — APP: 4b Preços completo: v591 (Ajustes › Preços), v592 (tela por uma função só + Ferramentas), v593 (nDias). Próximo: 4c
- 21/11 08:59 — APP: v592 no ar: 4b parte 2 (Preços por uma função só, Ferramentas). Próximo: 4b parte 3, depois 4c
- 21/11 08:34 — APP: v591 no ar: 4b parte 1 (preço automático em Ajustes › Preços). Próximo: 4b parte 2
- 21/11 08:04 — NUVEM: Hospedagem parte 1 no ar (app também em lafouch-2f6bd.web.app, sonda ok); S5S7 completo com o site; esboço do preço exato (Fila 39) visto — espera o dono.
- 21/11 07:58 — APP: v590 no ar: Black Friday só a da CDE (saiu a data internacional de reserva dos 3 calendários; trava no porteiro; 344/344). Próximo: 4b Preços
- 21/11 07:29 — APP: v589 no ar (item 39b, risco do ESBOCO corrigido). 343 provas. Próximo: 4b Preços (como fazer do ESBOCO).
- 21/11 02:04 — ESBOCO: Noite 20→21/11 (dono dormindo): (1) 'como fazer' dos 15 aprovados de Resultados/Preços para o APP em 3 partes — work/s435/comofazer/4b-PRECOS.md, 4c-GIRO-RESERVAS-E-4a.md, 4d-SUPERFICIE-E-FICHA.md; (2) conferidos: app v585–v588 (0 falha de tela; 1 falha da v586: aviso curto tampa a barra e sai sempre verde → esboço 38; risco no item 39 da v588 + prova sugerida) e site 1795225493, 1795232856, 1795234339 (comparador 0 falha); (3) esboço 39 pagamento parte 3 preço exato (achado: PIX sem par nunca é mostrado no app). Também esboços 40 câmera reta/peça reta, 41 Estúdio + Galeria + peça na câmera, 42 Cores e fotos sem Trocar foto e Nova cor fácil. Tudo na Fila como 'esboço pronto — esperando o dono'. NÃO testado em aparelho real.
- 21/11 01:13 — SITE: Noite 20→21/11 (dono dormindo): (1) memória e lista viva RECUPERADAS (1,3 MB regravados por engano em 20/11) + trava no status.py; (2) site 1795232856, por dentro: 1ª visita não espera o selo (rede limpa: 4G fraco 31→22 s até a 1ª foto; 4G bom 6,1→2,9 s), pedido tenta de novo sozinho 1x, cancelar 409 = feito, 4 funções mortas fora; (3) site 1795234339: novidades pede a confirmação do e-mail (S5, recado da NUVEM); porteiro 224 provas 0 falhas; (4) ESBOÇOS ESPERANDO O DONO: docs/PLANO-INTERNET-FRACA-21-11.md (partes 1–3) e docs/PLANO-FERRAMENTAS-21-11.md (4 partes); (5) faixa do evento já estava no ar desde 20/11; (6) varredura: 64% do programa roda nas provas, faltam provas de 9 áreas antes de mostrar suspeitos. DONO TESTAR no celular: abrir o site em aba anônima no 4G; inscrever um e-mail nas novidades (chega o e-mail de confirmar?); compra de teste até o PIX; cancelar um pedido pendente em Minha conta; voltar com Filtros, foto ampliada e aviso 'adicionado' abertos.
- 21/11 00:15 — APP: MADRUGADA 21/11 — feito: v588 no ar (item 39: armação clara não perde um lado no giro tratado; provado com as poses de referência a 45% do contraste, giro normal sem mudança; NÃO reproduzido com a gravação do dono; sem trava no porteiro). Memória restaurada (meu ajudante de publicar truncava o arquivo; consertado). NÃO feito: item 38 (tempo do tratamento) — sem os tempos por fase do celular eu mexeria no escuro; 4b Preços (como fazer recebido) — não comecei para não deixar tela pela metade. PARA O DONO CONFERIR NO APARELHO REAL: (1) v588: gravar a mesma armação bege — a frente sai com as DUAS lentes? (2) tempo de cada fase (diário [LF-CAM]: fundo, mede, grava) e se saiu mp4 ou webm; (3) o giro no site gira com o dedo e fecha sem pulo; (4) 'Qual é a frente?' — parar a gravação antes da volta e escolher: saem as duas fotos de fundo branco; (5) a linha 'Travado: branco' aparece e não há clarão; (6) avisos aparecem por cima do Estúdio. Pendências abertas: nota 100 em foto pela metade; item 36 (prova v468 instável); item 37 (câmera reta/peça reta, com o ESBOCO).
- 20/11 23:55 — NUVEM: Plano da hospedagem pronto (docs/PLANO-HOSPEDAGEM-20-11.md): o site já está na Cloudflare desde 16/11; falta tirar o APP do GitHub Pages — recomendação Firebase Hosting; espera 'Aprovado A/B'.
- 20/11 23:54 — NUVEM: S5+S7 publicado na nuvem e conferido no ar; recado ao SITE com a frase do esboço. Conferido depois da recuperação: minhas linhas na memória e na lista viva estão lá. Próximo: plano da hospedagem.
- 20/11 23:42 — APP: item 39 em estudo: comparei giroTrata com o trata_giro2.py do site (mesmas regras para achar a peça e as mesmas folgas); com 6 quadros reais do vídeo do dono a peça sai inteira — ainda NÃO reproduzi a frente com um lado apagado. Falta a gravação da pose de frente (pedi ao dono gravar a tela de novo). Nada publicado.
- 20/11 23:02 — NUVEM: Respondido ao SITE (cancelamento sem login aceito); visitas num lugar só completo.
- 20/11 22:47 — SITE: Fila 32 partes 1 e 2 publicadas no site 1795225493: Esc = voltar (uma regra), carrinho/conta por cima, avisos fecham com o voltar; vistas/ fora do site; cancelar por um caminho só. Porteiro 221 provas, 0 falhas; comparador 12 telas, 0 diferenças. Falta a parte 3 (internet fraca): medir em rede limpa e levar o plano ao dono.
- 20/11 21:21 — SITE: 3 esboços mandados ao dono (Fila 32): Esc nos Filtros, entrar→carrinho→voltar, internet fraca
