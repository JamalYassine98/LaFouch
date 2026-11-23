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
| IDEIAS | 09 parte 2: telas finais com os botões novos | work/ideias/09-botoes/ |

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
- **61b-curva-made** — esboço pronto — esperando o dono
- **61c-camada-do-lado** — esboço pronto — esperando o dono
- **64-tematica-campanha** — aprovado 22/11 14:07 — espera o 'implementar' (SITE)
- **65-efeito-do-evento** — esboço pronto — esperando o dono
- **65-familia-inventario-lista** — 65a ✅ v625 · 65b/65c ✅ v626 · 65e ✅ v627 · 65f ✅ v628 (Dashboard › Detalhes: Desempenho do mês ⌄ e Curva ABC ⌄) · falta: 65d (janela Adicionar — dúvida com o ESBOCO) e tirar a tela Giro (vai junto com o 66, quando Compras tiver a Lista de compras)
- **66-familia-compras** — parte 1 ✅ v629 · parte 2 ✅ v630 · parte 3 ✅ v631 (aprende sozinho; saem meta por dia, dias de loja e volume; Lista de compras sai do Giro) · falta só tirar a tela Giro (espera o ESBOCO: Perdas e sobras e Vitrine)
- **66-selecao-da-data** — esboço pronto — esperando o dono
- **67-familia-site-no-app** — na fila — 'implementar' do dono 22/11 12:51 · APP · 3º (SITE/IDEIAS: Campanha e ordem pelo Semp; painel web sai depois)
- **67-para-presente** — esboço pronto — esperando o dono
- **68-destaque-da-semana-semp** — liberado com o 70 — é a parte 6 do COMO-FAZER-MARKETING-70.md (esboço 71)
- **70-marketing-do-semp** — 'implementar' do dono 22/11 15:49 · setores aprovados 21:56 · COMO FAZER pronto: work/s435/implementar/COMO-FAZER-MARKETING-70.md (6 partes, a 6ª é o 68) · APP
- **72-pc-estilo-made** — esboço pronto — esperando o dono
- **73-menu-enxuto-luxo** — aprovado 22/11 22:47 (08g) — espera o 'implementar' (SITE)
- **73-setores-semp** — aprovado 22/11 21:56 — vai no item 70 (COMO-FAZER-MARKETING-70.md)
- **73b-idioma-rodape** — esboço pronto — esperando o dono
- **74-busca-e-padrao-camadas** — aprovado 23/11 00:17 (busca) e 00:30 (conta e carrinho) — espera o 'implementar' (SITE)
- **74-reserva-suspeita-titan** — esboço pronto — esperando o dono (work/s435/titan/reserva/esboco_74r_*) · depois APP + NUVEM
- **75-erros-do-site** — esboço pronto — esperando o dono (75a cartão Atacado no iPad · 75b camadas na peça deitada · 75d 'Ver modelo'; work/s435/siteerros/) · depois SITE
- **75-familia-de-botoes** — esboço pronto — esperando o dono (v3)
- **77-escada-de-precos** — aprovado 22/11 21:52 — espera o 'implementar' (vai com o Titan e o Completar do 45)
- **78-cupons-no-caixa** — aprovado 22/11 22:19 — espera o 'implementar' (vai com o Titan)
- **79-pode-tirar-e-imprevistos** — aprovado 22/11 22:57 — espera o 'implementar'
- **80-familia-barras** — aprovado 22/11 23:18 (80 + 80b) — espera o 'implementar' (junto com o 140C)
- **81-familia-botoes** — aprovado 22/11 23:40 (81 + 81b; 81c superado: apagar foto vira aviso com Desfazer, na varredura) — espera o 'implementar'
- **82-varredura-campos** — aprovado 22/11 23:49 — espera o 'implementar' · anotado: seta do Voltar no tempo (Títulos e linhas) e a família das pílulas ▾
- **83-varredura-textos** — aprovado 23/11 00:00 (v2 com o trilho 80) — espera o 'implementar'
- **84-varredura-icones** — aprovado 23/11 00:15 — com prova de alinhamento (centro do ícone × texto, 1 px) — espera o 'implementar'
- **85-varredura-avisos** — aprovado 23/11 00:19 (v2: aviso com Desfazer é neutro) — espera o 'implementar'
- **86-varredura-titulos-linhas** — aprovado 23/11 00:57 (v2, Ajustes no estado aprovado) — espera o 'implementar'

## Recados esperando

- para **APP**: Respostas (dono 22/11 19:3x). 65d: o 'como fazer' citava o 48b v3, que NUNCA foi aprovado — erro meu. O Adicionar aprovado é o dos esboços 44 + 45 (aprovados 21
- para **APP**: Conferência v626–v631 (fotos de work/s436/65b,65e,65f,66a,66b; só olhei as imagens, não rodei em aparelho real). ERROS: (1) GRAVE, regra H: em Parados e sobrand
- para **APP**: COMO FAZER do Semp pronto (dono aprovou os setores 22/11 21:56): work/s435/implementar/COMO-FAZER-MARKETING-70.md — itens 70 + 68, em 6 partes, com as imagens a
- para **SITE**: Respostas (ESBOCO, 22/11 20:45). 1) Esboços do SITE: os 61b curva-made, 65 efeito-do-evento, 66 seleção-da-data, 67 para-presente e 72 pc-estilo-made são da ses
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

- 23/11 00:47 — IDEIAS: 09 v3 família de botões (preto + vinho só no dinheiro) enviada ao dono — Fila 75
- 23/11 00:40 — IDEIAS: 09 v2: família de botões estruturada (papel × tamanho + marca)
- 23/11 00:37 — IDEIAS: 09: inventário dos botões (29 desenhos → 4 tipos)
- 23/11 00:30 — IDEIAS: 08m parte 2 (conta e carrinho) APROVADA — guardada
- 23/11 00:29 — IDEIAS: 08m parte 2: conta e carrinho no padrão
- 23/11 00:17 — IDEIAS: 08l parte 1 (busca) APROVADA — guardada na lista viva e na memória
- 23/11 00:17 — IDEIAS: 08l v5: 'Ver todos' vira link discreto no fim da lista; lista sem limite fixo
- 23/11 00:04 — IDEIAS: 08l v4: busca com uma margem só + sai o 'Você estava vendo' do Início
- 22/11 23:59 — IDEIAS: 08l v3: em alta abre o catálogo; vistos na linha de peça
- 22/11 23:55 — IDEIAS: 08l v2: busca vazia C (vistos OU em alta)
- 22/11 20:21 — ESBOCO: partes 1–5 do 'terminar tudo menos o estúdio': respostas ao APP, conferência v626–v631, esboços 73s (setores do Semp), 74r (reserva suspeita), 75 (erros do site); parte 6 espera o dono
- 22/11 18:03 — APP: 66 partes 1–3 publicadas (v629–v631). Esperando o ESBOCO: Semp, 65d, Giro, Preços.
- 22/11 17:45 — SITE: Ferramentas parte 2 (2a+2b): medidor único work/kit/mede.js; comparador/fiscal/Argus usam; 5 de 5 erros de referência; 4 erros existentes achados (recado à ESBOCO). Próximo: 2c com a ESBOCO, depois parte 3.
- 22/11 15:42 — APP: Item 65 quase todo publicado (v626–v628); 65d e a saída do Giro dependem de resposta/66; 68 parado pelo ESBOCO; reserva suspeita espera esboço.
- 22/11 15:42 — APP: Item 65: v626 páginas + Parados e sobrando + Contar o estoque; v627 filtros Site + escolhas que cabem + balão B; v628 Dashboard Detalhes. 65d parado (dúvida). Giro sai com o 66.
- 22/11 15:25 — NUVEM: Reserva suspeita parte 1 publicada 03ff0f79 (funções + regras; run ok + sonda ok): suspeita.js grava suspeitas/<pedido> (5+ iguais ou 3+ reservas abertas da rede na hora), regras só dono lê/apaga, limpeza. 25/25 arquivos de teste ok (8 novos). Formato mandado ao APP; notificação liga depois do aviso no Titan.
- 22/11 15:15 — NUVEM: Rede da loja retirada (dono 15:10), publicado ccd38f42 (run ok + sonda ok). Ficam os limites por rede (IPv6 /64; reserva 30, pedido 30/rede, 5/telefone). Recado ao APP cancelado. 24/24 arquivos de teste ok.
- 22/11 15:08 — NUVEM: Limites por rede (aprovado 15:01) publicados 6abc9a63: rede.js um lugar só (IPv6 /64; reserva 30, pedido 30/rede, 5/telefone; rede da loja 12 h sem limite via reserva acao 'loja', só o dono). 24/24 arquivos de teste ok + sonda ok (inclui 'loja' sem login = 403). Recado ao APP para chamar 'loja'. Limite por pedido (3 iguais/10 peças) espera esboço do SITE (muda o carrinho).
- 22/11 14:57 — SITE: Ferramentas parte 1: comparador/Argus olha as 22 telas do site (roteiro único, nuvem simulada, logada); 50 combinações em 26 min, 0 diferenças; defeito plantado achado. Próximo: parte 2 (uma biblioteca de medidas).
- 22/11 14:50 — NUVEM: App Check parte 1 (por dentro, publicado c63201f1): a contagem seloDia agora separa a origem — porta_estado_site (clientes do lafouch.com), _local (testes no PC) e _robo (sondas, teste de compra, robôs). 7/7 testes do selo + 23 arquivos de teste ok; sonda ok. Próximo: 2–3 dias de contagem real do site; se o _sem_site for alto, esboço para o SITE (selo pedido ao abrir a página, não só na hora da chamada) antes de ligar o 'exigir'.
- 22/11 06:54 — SITE: Site 1795341195: voz da Mochi padronizada (390 falas, só ganho) + aviso do QR regravado (opção 1, 816 créditos); Destaque não pisca mais com o efeito do evento (lfMorph ignora camada viva). Argus 254 provas, 0 falhas. PRÓXIMO: ferramentas 1 (Argus com todas as telas) → 2 → 3; esboços Mochi/animação; item 45; depois do 58, tirar o painel web.
- 22/11 04:42 — SITE: Site 1795333368: URGENTE Mochi no cartão do Início (PC, PT/ES) consertado; antes, 1795331899: Destaque sem piscar + robots.txt. Argus 252 provas, 0 falhas. PRÓXIMO: ferramentas 1 (Argus com todas as telas) → 2 → 3; esboços Mochi/animação; item 45.
- 22/11 01:46 — APP: Lista final guardada para depois da fase 'famílias' (dono 22/11 01:46). APP parada, esperando o esboço aprovado + 'implementar'.
- 22/11 01:23 — APP: Lista final entregue (work/s436/LISTA-FINAL-DONO.md). Folha VER morta NÃO apagada: está ligada ao arrastar tela → barra, que ficou sem caminho — decisão do dono (item 14 da lista).
- 22/11 01:17 — APP: v624 publicada: 42b — Nova cor. Porteiro 375/375. Próximo: conferir o que ainda dá para fazer sem o dono; senão, a lista final.
