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
| APP | 65b/65c Inventário: páginas + Parados e sobrando + Contar o estoque | src/11-estoque-lista.js, src/97z4-inventario.js, src/53p-paginas.js, src/97-lista-compras.js, src/57-financas.js, src/97-contagem.js, www/style.css, tests/run.py |
| ESBOCO | esboço 67 — Titan, setor Histórico | work/s435/titan |
| IDEIAS | IDEIAS 06c v4: sem brilho | work/ideias/06-tematica |

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
- **34-plano-das-ferramentas** — partes 1 e 4 ✅ · APROVADO 22/11 02:22: próxima = comparador/portão com todas as telas do site (~25) → um jeito de medir → telas do app · dono quer renomear o 'porteiro' (esperando o nome)
- **34-qual-e-a-frente-com-o-tratamento-do-giro** — ✅ v587 (5.50.12, 20/11) — pedido do dono 20/11 22:18 ('corrija'); falta o dono testar no celular real
- **35-tratamento-do-giro-parava-no-celular** — ✅ v587 (5.50.12, 20/11) — falta o dono testar no celular real
- **35-varredura-codigo-morto** — ✅ fechada 21/11 (site 1795282455): 67% do programa roda nas provas; saíram 7 funções mortas no total hoje; o resto é fluxo de verdade fora do alcance do simulador — sem suspeito para mostrar
- **36-logo-leve** — REPROVADO pelo dono 21/11 10:26 (perde a nitidez) — o logo fica como está; esboço em work/obsoletos/s430/
- **36-prova-v468-nuvem-segura-instavel** — na fila — investigar (APP)
- **37-ajustes-pecas-grupo-escolha** — aprovado 20/11 23:42 — espera o 'implementar'
- **37-giro-camera-reta-e-peca-reta** — ✅ 40a v615 · 40b v616 · 40c v617 · escolha da frente com a cena torta v618 (por dentro) — falta conferir no celular
- **38-aviso-curto-acima-da-barra-e-com-cor** — ✅ v613 (cor pelo tipo) + v614 (um chão só, 8 px acima da barra/janela)
- **38-giro-tratamento-mais-rapido** — etapa 1 ✅ v607 (tempos no diário) · plano em work/s436/camera-giro/PLANO-ITEM-38.md: B (tratar por trás, resultado idêntico por construção) primeiro; A (ler cada quadro uma vez) ou C (placa gráfica) conforme o diário do celular — ESPERA um giro do dono na v607 + camera.txt
- **39-giro-frente-com-um-lado-apagado** — ✅ v588 (5.50.13, 21/11) — falta o dono testar no celular real; sem trava no porteiro
- **39-pagamento-parte-3-preco-exato** — APP ✅ v606 (5.50.31, 21/11): PIX sem par nas Pendências + janela Ligar a um pedido (chama reserva{acao:'ligar'}); testado com a nuvem simulada — falta um teste de ponta a ponta com a NUVEM real (um pixSemPar de teste) e o SITE terminar a parte dele
- **39-preco-exato-site** — ✅ publicado no site 1795274857 (21/11): sem final único; PIX = brl, Banco Familiar = total
- **40-hospedagem-app-firebase** — parte 1 ✅ 21/11 08:05 (lafouch-2f6bd.web.app, em paralelo) — partes 2 (APP) e 3 (dono) só no fim, antes de lançar
- **41-estudio-galeria-e-peca-na-camera** — ✅ 41a/41b: v619 (marcas) · v621 (câmera diz a peça) · v622 (Galeria da peça com giro no dedo) — 41c esboço pronto, esperando o dono
- **42-cores-e-fotos-nova-cor** — ✅ 42a v623 (sem 'Trocar foto') · 42b v624 ('+ Nova cor ›' com a janela, no Editar) — ficou de fora: sugerir a cor pela foto (precisa de esboço) e o Cadastro de peça nova (work/s436/42/PENDENTE-DONO.md)
- **43-esbocos-37** — ✅ 37a v608 · 37b v609 · 37c v610 · 37d v611+v612 (Ajustes em 3 blocos + Marca) — falta só a linha Instagram: espera o dono/nuvem (work/s436/37d/PENDENTE-DONO.md)
- **43-estudio-no-padrao** — aprovado 21/11 11:07 — espera o 'implementar'
- **43-implementar-tudo-em-partes** — ✅ feito (v589–v624) · lista final GUARDADA (dono 22/11 01:46): reentregar atualizada depois da fase do esboço 'famílias'; nada da lista se aplica antes
- **44-149s-superficie-caixa-e-vender** — esperando o dono — estudo em work/s436/4d/149s/ESTUDO.md: com o cartão plano na classe, Caixa e Vender/Catálogo (fora das 9 aprovadas) também mudam; imagens enviadas ao dono 21/11; nada publicado
- **44-cadastro-inventario-no-padrao** — aprovado 21/11 11:07 — espera o 'implementar'
- **44-teste-compra-e-vigia** — ✅ 21/11 11:30 — teste de compra de ponta a ponta 14/14 na nuvem de verdade (com limpeza) · vigia diário 06:37 (sonda + erros 24 h + selo) com recado no status
- **45-ideias-formato-preciso-e-elegante** — aprovado 21/11 17:25 — implementar DEPOIS que a SITE terminar tudo o que está na fila dela (dono 17:27)
- **45-peca-nasce-no-estudio** — aprovado 21/11 11:07 — espera o 'implementar'
- **46-liga-desliga-na-tela-do-assunto** — aprovado 22/11 01:22 — espera o 'implementar' (b Preços, c Pedidos só impressão, d Ajustes; Site no redesenho do painel)
- **47-painel-do-site-redesenho** — estudo feito — fica para depois (dono 21/11 12:12)
- **48-pecas-compras-parte-1** — aprovado (48a) 22/11 05:44 — vai no item 66 · 48b/48c superados (obsoletos)
- **49-selo-no-botao-que-resolve** — 49a REPROVADO · 49b superado pelo 58 (Modelos vira filtro) · 49c superado — fechado
- **50-giro-sobrando-e-lista** — superado pelo 52 (obsoletos 22/11)
- **52-desfazer-giro-e-precos** — 52b/52d/52e no item 65 · 52a vai com o Titan
- **53-destaque-da-semana-do-semp** — aprovado 22/11 05:56 — vai no item 68
- **54-precos-escritorio-do-guardiao** — aprovado 21/11 18:06 — espera o 'implementar' · setores e desconto no Vender a fazer
- **55-desconto-do-guardiao-no-vender** — SUPERADO 22/11 00:26 (obsoletos) pelos cupons no caixa — esboço novo a fazer; NÃO implementar
- **56-precificacao-guardiao-e-semp** — decidido em conversa (21/11 18:00–23:59) — esboços a fazer em partes
- **57-raio-x-de-precos** — aprovado 22/11 00:19 — espera o app estar pronto e as vendas reais (pedido à NUVEM cancelado)
- **58-painel-do-site** — aprovado (58a–58h) — vai no item 67 · painel web sai depois
- **59-ideias-ferramentas-pegam-antes** — aprovado 22/11 04:55 — espera o 'implementar' (SITE, plano das ferramentas)
- **60-voz-aviso-qr** — ✅ publicado no site 1795341195 (22/11): opção 1 do aviso (PT e ES) + volume padronizado nas 390 falas; dono: tom não precisa regravar
- **61-camadas-um-movimento** — aprovado 22/11 12:20 (+ setinha › cinza 12:22) — espera o 'implementar' (SITE)
- **64-tematica-campanha** — aprovado 22/11 14:07 — espera o 'implementar' (SITE)
- **65-efeito-do-evento** — esboço pronto — esperando o dono
- **65-familia-inventario-lista** — 65a ✅ v625 · 65b/65c ✅ v626 (páginas de 24, Parados e sobrando ›, Contar o estoque ›, tela Parados e sobrando) · a seguir 65d (+ com selo e janela Adicionar)
- **66-familia-compras** — na fila — 'implementar' do dono 22/11 12:51 · APP · 2º (3 partes)
- **67-familia-site-no-app** — na fila — 'implementar' do dono 22/11 12:51 · APP · 3º (SITE/IDEIAS: Campanha e ordem pelo Semp; painel web sai depois)
- **68-destaque-da-semana-semp** — PARADO — espera o Semp refeito sobre a base nova (Marketing 1c é de 20/11, sem 'implementar'); dono 22/11 14:33

## Recados esperando

- para **APP**: URGENTE (dono 22/11 14:33) — 3 avisos para não errar: (1) item 68 Destaque da semana: NÃO implementar o 'Marketing 1c' do work/semp/ para abrir caminho — ele é 
- para **ESBOCO**: v626 publicada (65b/65c): conferir Inventário (páginas de 24, fim da lista com Parados e sobrando › e Contar o estoque ›) e a tela nova Parados e sobrando (celu
- para **ESBOCO**: Dúvida 65d (janela Adicionar): o como fazer diz 'Completar peça do Estúdio (selo) · Chegou mercadoria · Acessório' (48b v3, que foi para obsoletos), e o 44a (Ad
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
- para **todas**: NOME NOVO (dono 22/11 02:38): o conferidor do SITE que roda antes de publicar agora se chama ARGUS (Agente de Rastreamento e Gestão Unificada de Segurança) — an

Histórico antigo (até 19/11 23:50): docs/status/historico-antigo.md


## Últimas mudanças (todas as sessões, mais nova em cima)

- 22/11 15:00 — IDEIAS: IDEIAS 06c v3: movimento de luxo (Fila 65)
- 22/11 14:57 — SITE: Ferramentas parte 1: comparador/Argus olha as 22 telas do site (roteiro único, nuvem simulada, logada); 50 combinações em 26 min, 0 diferenças; defeito plantado achado. Próximo: parte 2 (uma biblioteca de medidas).
- 22/11 14:50 — NUVEM: App Check parte 1 (por dentro, publicado c63201f1): a contagem seloDia agora separa a origem — porta_estado_site (clientes do lafouch.com), _local (testes no PC) e _robo (sondas, teste de compra, robôs). 7/7 testes do selo + 23 arquivos de teste ok; sonda ok. Próximo: 2–3 dias de contagem real do site; se o _sem_site for alto, esboço para o SITE (selo pedido ao abrir a página, não só na hora da chamada) antes de ligar o 'exigir'.
- 22/11 14:48 — IDEIAS: IDEIAS 06c v2: neve com sensação de neve (Fila 65)
- 22/11 14:17 — IDEIAS: IDEIAS 06c esboço pronto (Fila 65): efeito do evento na foto da campanha
- 22/11 14:08 — IDEIAS: IDEIAS 06 APROVADO (Fila 64) — guardado na lista viva e memória
- 22/11 12:48 — IDEIAS: IDEIAS 06b esboço pronto: molde único de data (Natal), Fila 64
- 22/11 12:43 — IDEIAS: IDEIAS 06: estudo de referências (Cellshop, Nissei, Monalisa, Cartier, Gentle Monster) → molde único de data
- 22/11 12:36 — IDEIAS: IDEIAS 06: prancha Mães × Pais (Fila 64)
- 22/11 12:30 — IDEIAS: IDEIAS 06 esboço pronto (Fila 64): temática estilo campanha
- 22/11 12:22 — IDEIAS: IDEIAS 05: setinha › cinza aprovada e guardada (Fila 61)
- 22/11 12:20 — IDEIAS: IDEIAS 05 APROVADO (Fila 61) — guardado na lista viva e na memória; espera o implementar do SITE
- 22/11 06:54 — SITE: Site 1795341195: voz da Mochi padronizada (390 falas, só ganho) + aviso do QR regravado (opção 1, 816 créditos); Destaque não pisca mais com o efeito do evento (lfMorph ignora camada viva). Argus 254 provas, 0 falhas. PRÓXIMO: ferramentas 1 (Argus com todas as telas) → 2 → 3; esboços Mochi/animação; item 45; depois do 58, tirar o painel web.
- 22/11 04:42 — SITE: Site 1795333368: URGENTE Mochi no cartão do Início (PC, PT/ES) consertado; antes, 1795331899: Destaque sem piscar + robots.txt. Argus 252 provas, 0 falhas. PRÓXIMO: ferramentas 1 (Argus com todas as telas) → 2 → 3; esboços Mochi/animação; item 45.
- 22/11 01:46 — APP: Lista final guardada para depois da fase 'famílias' (dono 22/11 01:46). APP parada, esperando o esboço aprovado + 'implementar'.
- 22/11 01:23 — APP: Lista final entregue (work/s436/LISTA-FINAL-DONO.md). Folha VER morta NÃO apagada: está ligada ao arrastar tela → barra, que ficou sem caminho — decisão do dono (item 14 da lista).
- 22/11 01:17 — APP: v624 publicada: 42b — Nova cor. Porteiro 375/375. Próximo: conferir o que ainda dá para fazer sem o dono; senão, a lista final.
- 22/11 00:55 — APP: v623 publicada: 42a — sem 'Trocar foto'. Porteiro 374/374. Próximo: 42b (Nova cor).
- 22/11 00:33 — APP: v622 publicada: 41 parte 3 — Galeria da peça. Porteiro 372/373 (1 instável, 3× ok sozinha). Próximo: esboço 42 (Cores e fotos).
- 22/11 00:26 — ESBOCO: 21/11: esboços 43–45 aprovados; 46, 48, 49, 50, 51, 53 esperando o dono; 52 (partes 1 e 2) e 54 aprovados; precificação (Guardião dono do preço, escada, cupons no caixa, de/por honesto, arredondamento, mercado CDE>PY>BR, aprende com o dono) decidida; superados em work/obsoletos/s435-superados-21-11/; recados: APP (Leve 2 sai), SITE (robots.txt), NUVEM (App Check exigir; pedido de vendas cancelado)
- 22/11 00:10 — APP: v621 publicada: 41 parte 2 — a câmera diz para qual peça vai. Porteiro 372/372. Próximo: 41 parte 3 (Galeria da peça).
- 21/11 23:50 — SITE: Ferramentas partes 1 e 4 feitas (porteiro 233 provas, 0 falhas; comparador dentro do portão). Faltam: ferramentas 2 e 3; esboços da Mochi e da animação; depois o item 45 (Descubra seu formato, aprovado — implementar depois da fila). Site no ar 1795282455.
- 21/11 23:47 — APP: v620 publicada: Leve 2 do site fora do app (recado do dono feito). Porteiro 371/371. Próximo: 41 parte 2 (câmera diz para qual peça).
- 21/11 23:26 — APP: v619 publicada: 41 parte 1 — marcas Frente · 3/4 · Giro no Estúdio. Porteiro 370/370. Próximo: 41 parte 2 (câmera diz para qual peça).
- 21/11 23:05 — APP: v618 publicada (por dentro): a frente do giro é achada com a cena torta. Porteiro 369/369 + prova de ponta a ponta em 7 inclinações. Próximo: esboço 41 (Estúdio + Galeria).
