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
| APP | 38 giro etapa 1: tempos por fase do tratamento no diário (sem mudar o resultado) | src/97-giro-trata.js, tests/run.py |
| ESBOCO | esboço 52 parte 2 — Retorno, Curva ABC e margens para Resultados | work/s435/giroprecos |

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
- **32-esc-filtros-carrinho-voltar-internet-fraca** — ✅ FECHADO pelo dono 21/11 11:13: Esc/voltar e carrinho no ar; internet fraca encerrada (31 s → ~14 s no 4G fraco). Partes restantes do plano guardadas, sem fila.
- **32-urgente-camera-desfocada-ao-gravar** — ✅ v585 (5.50.10, 20/11) — falta o dono testar no celular real · APP
- **33-urgente-giro-no-celular-real** — ✅ v586 (5.50.11, 20/11) — falta o dono testar no celular real
- **34-plano-das-ferramentas** — aprovado 21/11 07:57 · parte 1 ✅ (um simulador só, 21/11) · faltam: 4 (porteiro só portão) → 2 (um jeito de medir) → 3 (comparador único)
- **34-qual-e-a-frente-com-o-tratamento-do-giro** — ✅ v587 (5.50.12, 20/11) — pedido do dono 20/11 22:18 ('corrija'); falta o dono testar no celular real
- **35-tratamento-do-giro-parava-no-celular** — ✅ v587 (5.50.12, 20/11) — falta o dono testar no celular real
- **35-varredura-codigo-morto** — ✅ fechada 21/11 (site 1795282455): 67% do programa roda nas provas; saíram 7 funções mortas no total hoje; o resto é fluxo de verdade fora do alcance do simulador — sem suspeito para mostrar
- **36-logo-leve** — REPROVADO pelo dono 21/11 10:26 (perde a nitidez) — o logo fica como está; esboço em work/obsoletos/s430/
- **36-prova-v468-nuvem-segura-instavel** — na fila — investigar (APP)
- **37-ajustes-pecas-grupo-escolha** — aprovado 20/11 23:42 — espera o 'implementar'
- **37-giro-camera-reta-e-peca-reta** — aprovado 21/11 07:51: avisa E o tratamento endireita até ±3° — espera o 'implementar'
- **38-aviso-curto-acima-da-barra-e-com-cor** — aprovado 21/11 07:51 — espera o 'implementar'
- **38-giro-tratamento-mais-rapido** — na fila — APP · dono 21/11 10:01: prioridade é o tratamento CERTO; a meta de 5 min por peça deixa de ser dura (ele trata por trás na loja e termina em casa). Valem: REPROVADO menos quadros/resolução; APROVADO GPU; tudo no celular
- **39-giro-frente-com-um-lado-apagado** — ✅ v588 (5.50.13, 21/11) — falta o dono testar no celular real; sem trava no porteiro
- **39-pagamento-parte-3-preco-exato** — APP ✅ v606 (5.50.31, 21/11): PIX sem par nas Pendências + janela Ligar a um pedido (chama reserva{acao:'ligar'}); testado com a nuvem simulada — falta um teste de ponta a ponta com a NUVEM real (um pixSemPar de teste) e o SITE terminar a parte dele
- **39-preco-exato-site** — ✅ publicado no site 1795274857 (21/11): sem final único; PIX = brl, Banco Familiar = total
- **40-hospedagem-app-firebase** — parte 1 ✅ 21/11 08:05 (lafouch-2f6bd.web.app, em paralelo) — partes 2 (APP) e 3 (dono) só no fim, antes de lançar
- **41-estudio-galeria-e-peca-na-camera** — 41 aprovado (07:51) · 41c esboço pronto — esperando o dono (Galeria do app; giro sempre grava; cadastro escolhe da Galeria)
- **42-cores-e-fotos-nova-cor** — aprovado 21/11 07:51 — espera o 'implementar'
- **43-estudio-no-padrao** — aprovado 21/11 11:07 — espera o 'implementar'
- **43-implementar-tudo-em-partes** — em andamento — 4b ✅ · 4c ✅ · 4d: 136a/134/134b/134d ✅ v598–v605 · 149s esperando o dono (Fila 44) · 39 app ✅ v606 (5.50.31). Próximas: 38 giro → resto dos 52 → aprovados de 21/11
- **44-149s-superficie-caixa-e-vender** — esperando o dono — estudo em work/s436/4d/149s/ESTUDO.md: com o cartão plano na classe, Caixa e Vender/Catálogo (fora das 9 aprovadas) também mudam; imagens enviadas ao dono 21/11; nada publicado
- **44-cadastro-inventario-no-padrao** — aprovado 21/11 11:07 — espera o 'implementar'
- **44-teste-compra-e-vigia** — ✅ 21/11 11:30 — teste de compra de ponta a ponta 14/14 na nuvem de verdade (com limpeza) · vigia diário 06:37 (sonda + erros 24 h + selo) com recado no status
- **45-ideias-formato-preciso-e-elegante** — esboço pronto — esperando o dono (v4 21/11 13:50: parte A câmera; parte B tabela/filtro a seguir)
- **45-peca-nasce-no-estudio** — aprovado 21/11 11:07 — espera o 'implementar'
- **46-liga-desliga-na-tela-do-assunto** — esboço pronto — esperando o dono
- **47-painel-do-site-redesenho** — estudo feito — fica para depois (dono 21/11 12:12)
- **48-pecas-compras-parte-1** — esboço pronto — esperando o dono
- **49-selo-no-botao-que-resolve** — esboço pronto — esperando o dono
- **50-giro-sobrando-e-lista** — esboço pronto — esperando o dono
- **52-desfazer-giro-e-precos** — partes 1 e 2 aprovadas (15:38 e 16:17) — esperam o 'implementar' · partes 3–6 a fazer

## Recados esperando

- para **ESBOCO**: No ar: v598 (136a) e v599 (por dentro: renderDetail = fichaCorpo + fichaBotao/fichaBarra/fichaLucro/fichaPreco; saíram as 4 camadas; HTML idêntico). Próximo: 13
- para **ESBOCO**: No ar: v600 (links da ficha no fim, fichaLinks) e v601 (ficha do Inventário sem o cartão no celular; .pl.pick como linha de lista; rowLabel sem '· ' solto). Par
- para **ESBOCO**: No ar: v602 (ficha sem caixas: preço, % Oferta neutro, aviso em frase, No site e dobras em linhas — nascem sem a classe card) e v603 (134b Fornecedores: section
- para **ESBOCO**: No ar: v604 — 134d parte 1: 'Editar produto' na lfJanela (classe edJn; conteúdo #editModal/.edBx), sem Fechar; Esc/fora/arrastar saem sem salvar. Falta a pergun
- para **ESBOCO**: No ar: v605 — lfJanela com a opção mudou() (pergunta 'Sair sem salvar?' via lfConfirma; api.fecha(true) força). 'Editar produto' já usa; as outras janelas de cr
- para **ESBOCO**: No ar: v606 — 39 no app (Pendências com PIX sem par primeiro; janela 'Ligar a um pedido'). Diferença do esboço 39c: a linha do pedido diz 'pedido de hoje HH:MM'
- para **NUVEM**: 39 no APP publicado (v606): o app chama POST reserva {acao:'ligar', pix:<id do pixSemPar>, pedido:<sid do pedido>} com o token do dono e espera {ok:true}; lê de
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
- para **todas**: Ferramentas: agora existe UM simulador só — work/kit/sim.py (sim.navegador(pw) e sim.contexto(b, W, H, toque=…, dpr=…, lingua=…, escuro=…, camera=…)). kit.py, a

Histórico antigo (até 19/11 23:50): docs/status/historico-antigo.md


## Últimas mudanças (todas as sessões, mais nova em cima)

- 21/11 16:08 — SITE: Pendências: partes 1 e 2 fechadas; parte 3 (ferramentas) — parte 1 do plano FEITA (um simulador só; porteiro 232/0, comparador 0 diferenças). Faltam do plano: 4 → 2 → 3; e a parte 4 das pendências (esboços: bugs da Mochi, animação). Site no ar 1795282455.
- 21/11 15:59 — APP: v606 no ar: 39 preço exato (app). Próximo: 38 giro
- 21/11 15:52 — IDEIAS: IDEIAS: 01 — carregamento só na galeria (anotado no COMO-FAZER) — IDEIAS
- 21/11 15:49 — IDEIAS: IDEIAS: vídeo da câmera (esboco-06-camera-video.mp4) junto do item 45 — esperando o dono — IDEIAS
- 21/11 15:34 — APP: 149s etapa A: estudo feito e enviado ao dono (Caixa e Vender mudam fora das 9); nada publicado. Próximo: 39 preço exato
- 21/11 15:29 — APP: v605 no ar: 134d completo. Próximo: 149s superfície
- 21/11 15:06 — APP: v604 no ar: 134d parte 1. Próximo: 134d parte 2 (Sair sem salvar?)
- 21/11 14:34 — SITE: Pendências partes 1 e 2 FECHADAS (janelas conferidas; varredura 5ª rodada, site 1795282455, porteiro 232/0). PRÓXIMAS: parte 3 (plano das ferramentas 1→4→2→3) e parte 4 (esboços: bugs da Mochi, animação no lugar do brilho). No fim: lista única do que o dono faz e testa.
- 21/11 14:29 — APP: v603 no ar: 134b Fornecedores. Próximo: 134d Editar na janela de baixo
- 21/11 14:09 — IDEIAS: IDEIAS: 01 parte A (câmera) na Fila 45 — esperando o dono; parte B (tabela/filtro) a seguir — IDEIAS
- 21/11 14:07 — APP: v602 no ar: 134 ficha sem caixas. Próximo: 134b Fornecedores
- 21/11 13:45 — APP: v601 no ar: 134 ficha sem cartão + linhas. Próximo: 134 caixas
- 21/11 13:21 — APP: v600 no ar: 134 links no fim da ficha. Próximo: 134 linhas .pl.pick
- 21/11 13:03 — NUVEM: 39: site sem final único conferido (código + teste de compra 14/14). Falta só a parte do APP.
- 21/11 12:59 — APP: v599 no ar: ficha numa função só. Próximo: 134 (ficha sem cartão, links no fim)
- 21/11 12:42 — IDEIAS: IDEIAS: esboço 01 v3 (descrição = modelos que combinam) na Fila 45 — esperando o dono — IDEIAS
- 21/11 12:38 — APP: 4d parte 2: estudo feito, sem código (a ficha precisa primeiro juntar as camadas do renderDetail). v598 segue a última no ar
- 21/11 12:33 — SITE: Pendências parte 1 FECHADA: janelas 'Separado para você' e portal do atacado iguais à versão de 19/11 (fora os cartões novos). Site no ar 1795274857 (esboço 39). PRÓXIMA: parte 2 — provas das áreas sem medição (recibo, pedido pago, câmera do rosto por dentro, atacado por dentro, código por e-mail, Google) e suspeitos de código morto com imagem; depois parte 3 (ferramentas) e parte 4 (esboços Mochi e animação). No fim: lista única do que o dono precisa fazer e testar.
- 21/11 12:28 — SITE: Esboço 39 (preço exato) publicado no site 1795274857; porteiro 232 provas, 0 falhas. Dono 12:04: depois do 39, terminar as pendências e só então os testes de fluidez. PENDÊNCIAS DA SITE, na ordem: (1) janelas não conferidas contra 19/11 (resultado do rosto, pagamento, portal do atacado, separado, foto ampliada); (2) provas das áreas sem medição + suspeitos de código morto com imagem; (3) plano das ferramentas 1→4→2→3; (4) esboços para o dono: bugs da Mochi, animação no lugar do brilho. Dono 11:13: otimização = gargalos, travadas e bugs (não carregamento).
- 21/11 11:26 — NUVEM: Teste de compra de ponta a ponta (14/14, com limpeza) e vigia diário (1º recado: portas ok, 0 erros) no ar.
- 21/11 11:12 — SITE: Parte 2 (consulta em pedaço): PARADO antes de mexer — a medida com a Mochi separada mostra ganho de 33 KB (~1,3 s no 4G fraco), não ~3 s como eu tinha dito ao dono. Esperando o dono decidir: seguir assim mesmo, ou trocar pelas letras guardadas no próprio site. Nada foi mudado no site.
- 21/11 10:52 — IDEIAS: IDEIAS: esboço 01 v2 (medir mesmo perto/torto; descrição dos formatos; 2 erros achados) na Fila 45 — esperando o dono — IDEIAS
- 21/11 10:51 — SITE: Site 1795269030 publicado (por dentro): roupas do Mochi de Mães/Pais fora do programa (813 → 733 KB). Logo leve REPROVADO pelo dono (fica como está). Porteiro 232 provas, 0 falhas. PRÓXIMO: seguir a parte 2 (consulta do grau em pedaço próprio — estudo em work/s430/pedacos). Esperando o dono: 'implementar' do esboço 39 (preço exato).
- 21/11 10:29 — NUVEM: App Check: contagens lidas (workflow info). Funções do site chegam quase sempre sem selo → 'exigir' ainda NÃO pode ser ligado; pergunta ao SITE sobre o acFetch.
- 21/11 10:22 — SITE: 21/11 manhã: (1) URGENTE resolvido — câmera do formato do rosto e comparar voltaram (site 1795264209); (2) conferência contra a versão de 19/11: janelas soltas e avisos iguais; telas só com as mudanças aprovadas (work/s430/janelas/LEIA.md); (3) internet fraca: começo rápido + sem recarga na 1ª abertura (site 1795266930) — rede limpa: 4G fraco 31 s → ~15 s até a 1ª foto, 4G bom 6,1 → 1,8 s; (4) esperando o dono: 'implementar' do esboço 39 (preço exato, parte do site) e o esboço do logo leve (Fila 36). Porteiro 230 provas, 0 falhas. PRÓXIMO: internet fraca parte 2 (programa em pedaços).
