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
| APP | atualiza-ao-vivo (celular e PC): pacote inteiro www-<v>.zip, appPronto no 1º desenho, sai o LOADER | src/97-atualiza.js, src/01-build.js, www/index.html, build.js, desktop/, package.json, capacitor.config.json, .github/workflows/publicar-app.yml, .github/workflows/build-apk.yml |
| SITE | Ícone da conta no menu centralizado (aprovado e implementar, dono 26/11 06:55) | catalogo/index.html, catalogo/version.json, docs/SITE-COMO-FUNCIONA.md, docs/FALTA-APROVAR-15-11.md |

## Fila

- **00-volta-emergencia** — publicado — site 1795685498 (catalogo 17f3e97)
- **01-149v-familia-voltar-peca-do-catalogo-fic** — ✅ v563 (19/11) · APP · pedido 19/11 13:31
- **01-icone-conta-menu** — implementado — esperando o selo (não está no ar)
- **02-150i-familia-icone-redondo** — ✅ v563 (19/11) · APP · pedido 19/11 13:31
- **03-b2-soltar-reserva-urgente-bug-src-95-res** — ✅ v564 (19/11) · APP · pedido 19/11 14:03
- **04-b1-nome-da-cliente-no-pedido-act-pedcli** — ✅ v566 (19/11) · APP · pedido 19/11 14:03
- **05-b3-site-resumo-no-grupo-site-a-linha-e-o** — ✅ v572 (5.49.2, 20/11) · APP · pedido 19/11 14:03
- **06-p1-seguranca-da-reserva-parte-da-nuvem-c** — ✅ publicado pelo dono 19/11 15:03 (Cloud Shell); conferido: cancelar com `refs` = ok:true; reserva vencida da AC1050 apagada; 4 paradas antigas saem na limpeza das 4h · NUVEM · pedido 19/11 14:29
- **07-p1-parte-do-app-depois-do-deploy-do-item** — ✅ v565 (19/11) · APP · pedido 19/11 14:29
- **08-s1-s2-parte-1-nuvem-dono-implementar-19** — ✅ publicado pelo dono 19/11 15:44 (functions + regras); conferido: `conta` livre=ok, `reserva` token sem telefone certo = recusado · NUVEM · pedido 19/11 15:29
- **09-s1-s2-parte-2-site-depois-do-item-8-publ** — ✅ publicado no site 1795192682 (20/11 13:55, junto com a cópia limpa inteira)
- **10-s1-s2-parte-2-app-depois-do-item-8-publi** — ✅ v566 (19/11) — grava em reservasTok E ainda em reservas/ (o site antigo lê de lá); tirar o de reservas/ junto com o item 11 · APP · pedido 19/11 15:29
- **100-botao-principal** — decidido 23/11 11:25: continua só contorno (o design fica, só a cor muda)
- **100-traco-ultima-linha** — aprovado 25/11 08:13 (com traço sempre) — espera o 'implementar' (APP)
- **101-estudio-e-gerenciar-grupo** — Estúdio = esboço 43 aprovado 21/11, falta implementar (não precisa esboço novo); Gerenciar grupo › = aprovado (48a), dono decide se fica
- **101-so-a-cor-oficial** — aprovado 23/11 11:28 — vale para toda implementação (APP avisada)
- **102-natal-luxo** — superado pelo 103 (23/11 13:25)
- **103-natal-e-kits** — aprovado 23/11 13:24 · v3 com o cartão de luxo do Natal
- **105-plano-implementar-app** — IMPLEMENTAR — dono 23/11 13:55 ('implementar tudo de acordo com nossos planos'): APP segue work/s435/implementar/PLANO-IMPLEMENTAR-APP-23-11.md, uma parte por vez (1 base visual → 7 Marketing), consultando o dono a cada parte (regra 3); Estúdio fora
- **106-ofertas-da-data** — aprovado 24/11 00:45 — Parte 7 do plano
- **107-sem-internet** — aprovado — espera implementar
- **11-s1-s2-parte-3-nuvem-depois-dos-itens-9-e** — ✅ publicado 20/11 13:58 (run 44777476972: funções + regras; limpeza do token rodada na hora; sonda 0 falhas) — usuarios/ fechada, token só em reservasTok
- **12-p1b-orfas-nuvem-dono-implementar-16-12-e** — ✅ publicado pelo dono 19/11 16:21; conferido: `orfas` sem login = sem-permissao · NUVEM · pedido 19/11 16:12
- **13-p1b-orfas-app-depois-do-item-12-publicad** — ✅ v567 (19/11) · APP · pedido 19/11 16:12
- **14-urgente-interruptor-do-site-some-no-pain** — ✅ publicado no site (catalogo ef883de, 19/11 19:28); CONFERIDO pela S435 no simulador: com o site ligado e desligado o cartão do interruptor fica no topo (prova.py). Dono testou no celular 19/11 19:45: funcionou ✓ · SITE · pedido 19/11 19:03
- **15-camera-do-estudio-so-ela-pegar-antes-dos** — ✅ COMPLETO — parte 1 v568 · parte 2 v569 · parte 3 v570 (19/11) · APP · pedido 19/11 19:25
- **15-previas-de-link** — esboço pronto — esperando o dono
- **16-padrao-de-luxo** — estudo feito — base para o design de luxo da loja
- **16-peca-incompleta-nao-vai-ao-site** — ✅ v575 (5.50.0, 20/11) — marca e coleção obrigatórias; 19 peças de teste completas e marcadas · APP · pedido 19/11 23:07
- **17-inicio-com-modelos** — esboço pronto — esperando o dono
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
- **44-149s-superficie-caixa-e-vender** — publicado v632 (104: todas as telas sem cartão, catálogo 2 colunas)
- **44-cadastro-inventario-no-padrao** — publicado v634 (APP)
- **44-teste-compra-e-vigia** — ✅ 21/11 11:30 — teste de compra de ponta a ponta 14/14 na nuvem de verdade (com limpeza) · vigia diário 06:37 (sonda + erros 24 h + selo) com recado no status
- **45-ideias-formato-preciso-e-elegante** — aprovado 21/11 17:25 — implementar DEPOIS que a SITE terminar tudo o que está na fila dela (dono 17:27)
- **45-peca-nasce-no-estudio** — só o Adicionar publicado v634; o resto é Estúdio (fora)
- **46-liga-desliga-na-tela-do-assunto** — publicado v633 (46 + 46b + 46c; Site ⏻ fica para o painel do Site 58a)
- **47-painel-do-site-redesenho** — estudo feito — fica para depois (dono 21/11 12:12)
- **48-pecas-compras-parte-1** — aprovado (48a) 22/11 05:44 — vai no item 66 · 48b/48c superados (obsoletos)
- **49-selo-no-botao-que-resolve** — 49a REPROVADO · 49b superado pelo 58 (Modelos vira filtro) · 49c superado — fechado
- **50-giro-sobrando-e-lista** — superado pelo 52 (obsoletos 22/11)
- **52-desfazer-giro-e-precos** — 52a publicado v635 (Preços é linha do Início) · 52b/52d/52e no item 65
- **53-destaque-da-semana-do-semp** — aprovado 22/11 05:56 — vai no item 68
- **54-precos-escritorio-do-guardiao** — escritório v635 · Regras v636 · Ofertas/ficha v637 · Atacado (65/65b) v638 · Ferramentas (66) e Histórico (67) nas próximas partes
- **55-desconto-do-guardiao-no-vender** — SUPERADO 22/11 00:26 (obsoletos) pelos cupons no caixa — esboço novo a fazer; NÃO implementar
- **56-precificacao-guardiao-e-semp** — decidido em conversa (21/11 18:00–23:59) — esboços a fazer em partes
- **57-raio-x-de-precos** — aprovado 22/11 00:19 — espera o app estar pronto e as vendas reais (pedido à NUVEM cancelado)
- **58-painel-do-site** — aprovado (58a–58h) — vai no item 67 · painel web sai depois
- **59-ideias-ferramentas-pegam-antes** — aprovado 22/11 04:55 — espera o 'implementar' (SITE, plano das ferramentas)
- **60-voz-aviso-qr** — ✅ publicado no site 1795341195 (22/11): opção 1 do aviso (PT e ES) + volume padronizado nas 390 falas; dono: tom não precisa regravar
- **61-camadas-um-movimento** — aprovado 22/11 12:20 (+ setinha › cinza 12:22) — espera o 'implementar' (SITE)
- **61b-curva-made** — RETIRADO 23/11 11:28 — já está dentro do 61c
- **61c-camada-do-lado** — aprovado 23/11 11:28 + conserto do topo 12:17 — espera o 'implementar' (SITE)
- **64-tematica-campanha** — aprovado 22/11 14:07 — espera o 'implementar' (SITE)
- **65-efeito-do-evento** — aprovado 23/11 11:28 (06d campanha em câmera lenta) — espera o 'implementar' (SITE) e as fotos da data
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
- **73b-idioma-rodape** — aprovado 23/11 11:28 — espera o 'implementar' (SITE)
- **74-busca-e-padrao-camadas** — aprovado 23/11 00:17 (busca) e 00:30 (conta e carrinho) — espera o 'implementar' (SITE)
- **74-reserva-suspeita-titan** — SUPERADO pelo 74r v3 (aprovado 23/11 08:05)
- **74r-reserva-suspeita** — APP publicado v640 (sino + Pedidos + janela; lê suspeitas/ da nuvem e apaga ao resolver)
- **75-erros-do-site** — esboço pronto — esperando o dono (75a cartão Atacado no iPad · 75b camadas na peça deitada · 75d 'Ver modelo'; work/s435/siteerros/) · depois SITE
- **75-erros-site** — passado à SITE (recado 23/11 08:00) — não é da ESBOCO
- **75-familia-de-botoes** — aprovado 23/11 10:23; cor trocada pela oficial no 87 (10:52) — espera o 'implementar' (SITE)
- **76-post-semp** — 76c REPROVADO 23/11 11:23 (76d junto) — obsoletos
- **77-escada-de-precos** — aprovado 22/11 21:52 — espera o 'implementar' (vai com o Titan e o Completar do 45)
- **78-cupons-no-caixa** — SUPERADO pelo 98 v4 (23/11 10:14) — obsoletos
- **79-pode-tirar-e-imprevistos** — aprovado 22/11 22:57 — espera o 'implementar'
- **80-barras** — duplicado de 80-familia-barras (engano da APP) — ignorar
- **80-familia-barras** — publicado v632 (APP)
- **81-familia-botoes** — publicado v632 (APP)
- **82-varredura-campos** — publicado v632 (APP)
- **83-varredura-textos** — publicado v632 (APP)
- **84-varredura-icones** — publicado v632 (APP)
- **85-varredura-avisos** — publicado v632 (APP)
- **86-varredura-titulos-linhas** — publicado v632 + Ajustes aprovado v633 (APP)
- **87-cores-padronizadas** — APP publicado v632 (cor oficial); SITE falta
- **87-varredura-pilulas** — publicado v632 (APP)
- **88-duas-portas** — passos 1 e 2 publicados v634; passos 3 e 4 (Estúdio) esperam o Estúdio
- **88-formato-do-botao** — aprovado 23/11 11:05 (D · Lente 14 px) — espera o 'implementar' (SITE e APP)
- **89-aviso-amarelo-e-fornecedores** — publicado: 89a v632 · 89b v633 (APP)
- **93-tudo-arredondado** — aprovado 23/11 08:36 — espera o 'implementar'
- **94-de-por-honesto** — publicado v637 (de/por honesto: Catálogo, site, cartões, Marketing e a janela Oferta)
- **94-tematica-tres-camadas** — IMPLEMENTAR (dono 24/11 00:38) — com o SITE, na ordem da Fila
- **95-enfeites-traco** — IMPLEMENTAR (dono 24/11 00:38) junto do 94 — sem enfeite
- **95-mochi-luxo** — RECUSADO 23/11 14:46 (obsoletos) — fica só a trava dos braços
- **95-preco-de-mercado** — aprovado 23/11 08:36 — espera o 'implementar'
- **96-oferta-na-loja** — aprovado 23/11 10:14 — espera o 'implementar' (APP; regras do cupom → NUVEM)
- **97-frases-dos-cartoes** — pendente — estudar depois (dono 24/11 00:37)
- **98-carrinho-simples** — aprovado 23/11 13:37 (v6) — espera o 'implementar'
- **99-lucro-kit-realista** — 99b v2 aprovado · do 99d v2 só a contagem e 'Kit de Natal na caixa' (aprovado 13:47); janela superada pelo 103 · 99a cancelado (cartão de luxo no 98 v6)
- **argus-novo** — Partes 0–8 PRONTAS 26/11 — falta só o que depende do dono
- **argus-plantas-app** — APROVADO 26/11 12:28 — lote 1 gravado como aprovado; as outras 17 telas do mapa (planta = hoje) e o Início (= esboço) o ESBOCO grava em seguida
- **argus-plantas-site** — plano pronto — esperando o dono
- **argus-porta-app** — SEM SELO · completa · 2026-11-26 13:20 · 2 falha(s) · 56.4 min · commit 68c235fdb · passou do limite de 30 min
- **argus-porta-site** — SEM SELO · completa · 2026-11-26 07:13 · 3 falha(s) · 18.0 min · commit bdc439863
- **argus-regras-20-21** — APROVADO e feito 26/11 06:23
- **atualiza-ao-vivo** — implementar — 1º da ordem (dono 26/11 12:28)
- **inicio-consertos** — APROVADO 26/11 12:28 — implementar logo depois do atualiza-ao-vivo
- **inicio-peca-no-modelo-folha** — aprovado 27/11 08:34 — conceito do redesenho do Início; implementar quando o redesenho entrar (depois do Semp)
- **semp-1-criar** — NA GAVETA (dono 26/11 11:51) — NÃO implementar
- **semp-2-estudio** — NA GAVETA (dono 26/11 11:51)
- **site-desconto-exato** — esboço a fazer — depois do Argus (dono 24/11 21:01: o conserto do site vem depois)

## Recados esperando

- para **ESBOCO**: PRONTO PARA CONFERIR — atualiza-ao-vivo (celular e PC) + 1b. Ramo app/atualiza-ao-vivo (commit 45e761ee, v642). Conserto por dentro, nenhuma tela muda. Feito pe
- para **NUVEM**: PENDENTE (24/11 13:55): pacote NÃO publicado = cupom da loja sem furos (c6a7064a) + VIP com e-mail + telefone completo (01997f87); publicar junto quando APP (e-
- para **NUVEM**: Vigia 24/11 17:21: portas: ok (38 conferências) erros das funções (24 h): nenhum selo de 2026-11-23: conta_sem_robo=1, pedido_sem_robo=1, reserva_sem_robo=2 
- para **NUVEM**: Vigia 25/11 16:34: portas: ok (38 conferências) erros das funções (24 h): nenhum selo de 2026-11-24: analise_com_site=8, analise_sem_robo=4, analise_sem_site=1,
- para **NUVEM**: Vigia 26/11 16:17: portas: ok (38 conferências) erros das funções (24 h): nenhum selo de 2026-11-25: analise_com_site=6, analise_sem_robo=163, conta_sem_robo=1,
- para **SITE**: Respostas (ESBOCO, 22/11 20:45). 1) Esboços do SITE: os 61b curva-made, 65 efeito-do-evento, 66 seleção-da-data, 67 para-presente e 72 pc-estilo-made são da ses
- para **SITE**: Esboço 75 (3 erros do site, conferência S435 22/11) passa para você decidir com o dono: work/s435/siteerros/esboco_75a_tablet_atacado.jpg (.hata em 2 colunas só
- para **SITE**: Para o site, quando o dono mandar implementar (aprovado 23/11 09:36–10:14; esboços work/s435/oferta96/): Minha conta › Cartões com a mensagem de presente 'A La 
- para **SITE**: IDEIAS → todas: o dono quer PADRONIZAR as cores (23/11 10:37). Cor oficial da marca: CMYK C47 M91 Y29 K8 = #943d6f na tela (FOGRA39→sRGB). Todas as outras saem 
- para **SITE**: IDEIAS → todas: o dono APROVOU (23/11 10:52) as cores padronizadas pela cor oficial #943d6f (Fila 87, work/ideias/10-cores/COMO-FAZER.md). Usar só essa família 
- para **SITE**: PEDIDO DO DONO (23/11 11:02): fazer o ESBOÇO DO SITE sobre os PRESENTES DA DATA. Decidido no app (esboço 99d, work/s435/lote99/esboco_99d_presente_da_data_*.jpg
- para **SITE**: IDEIAS → SITE: o dono APROVOU (23/11 11:05) o formato dos botões: 'Lente', canto 14 px (compacto 10 px), em toda a família e na caixa de quantidade — Fila 88, w
- para **SITE**: IDEIAS → SITE: esboços aprovados 09 (botões), 10 (cores #943d6f) e 11 (formato Lente) no main (e5c3687), work/ideias/*/COMO-FAZER.md.
- para **SITE**: Prova nova para o Argus/medidor (achado ESBOCO 23/11): o medidor não pegou um TEXTO encostando num BOTÃO de texto na mesma linha (frase da linha 'Cliente' sob o
- para **SITE**: IDEIAS → SITE: aprovados 23/11 11:28 (esperam o 'implementar'): 61c/08k2 camadas pelo lado do botão (com a correção da Minha conta: #contabtn na mesma lista e t
- para **SITE**: IDEIAS → SITE: no 61c/08k2 aprovado, mais um conserto achado pelo dono (11:45): o destaque subia 91 px ao abrir qualquer camada. Causa: regra v452 do index.html
- para **SITE**: Para o esboço dos presentes e Minha conta: o cartão do cliente no site (.pxc simples) difere do cartão de LUXO aprovado do e-mail (functions/email.js luxo()). O
- para **SITE**: IMPLEMENTAR (dono 24/11 00:38) itens 94+95 (temáticas). Como fazer: work/ideias/12-tematica-base/COMO-FAZER.md seções 12e e 12f-SUPERADO; base copia5.py. Resumo
- para **SITE**: Itens 94+95: a pasta work/ideias/12-tematica-base/ agora está no main (não tinha subido). COMO-FAZER.md (seções 12e e 12f-SUPERADO) e copia5.py completos. Falta
- para **SITE**: CLAUDE.md mudou (dono 24/11), releia: regra 2 (reler as regras antes de QUALQUER passo), 1b (a sessão de esboço confere ANTES de publicar; publicar só com o OK)
- para **SITE**: Aviso da NUVEM (dono 24/11 14:00, espera esboço da ESBOCO): no site o desconto passa a ser exato, sem cortar no milhar (descDe em lf-site.js). A nuvem aceita o 
- para **SITE**: Recebi os 2 recados e já pus no PLANO-ARGUS, Parte 7, sem mais nada: (1) modo do site 'sem temática' (evento vazio) como o normal, além de cada temática; (2) ba
- para **SITE**: Argus novo: conferência 'camadas' (work/argus/setor_site/etapas.py, so=['camadas']) pega o defeito de 25/11 — site de hoje: ACHADO em Peça, Carrinho e Menu; 19/
- para **SITE**: ARGUS NOVO (dono 26/11 06:23): o Argus antigo saiu (work/fiscal → work/obsoletos/argus-antigo-26-11) e o CLAUDE.md regra 20 mudou — releia. Publicar o site agor
- para **SITE**: DONO 26/11 06:27: EXCEÇÃO ÚNICA — o conserto das camadas (desfazer a limpeza 2bd291d) pode subir SEM o selo do Argus. Antes de publicar, confira com o Argus nov
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

- 27/11 08:45 — IDEIAS: v43 ferramentas: no PC folhas pelo conteúdo, centradas
- 27/11 08:43 — IDEIAS: v42 ferramentas com ícone de traço, separadas dos serviços
- 27/11 08:39 — IDEIAS: v41 ferramentas em folhas
- 27/11 08:35 — IDEIAS: v40 APROVADO: retrato e peça na mesma folha (Início)
- 27/11 08:34 — IDEIAS: v40 Lucien: retrato e peça na mesma folha; sem legenda de crédito
- 27/11 08:30 — IDEIAS: v39 Lucien como página de revista (crédito + peça no papel); aprovação identidade revista e cores do Semp guardada
- 27/11 08:11 — IDEIAS: v38 Lucien padrão Madë: foto fechada no rosto + página sobe com palco branco grande
- 27/11 08:07 — IDEIAS: Estudo §27: Madë × v37 (peça grande na ordem, página sobe sobre a foto, foto fechada no rosto)
- 27/11 07:58 — IDEIAS: v37 Lucien: a peça numa segunda foto em tom de pedra, placa sobre a borda, preço etiqueta
- 27/11 07:51 — IDEIAS: v35 provisório como base do bloco Lucien; natureza-morta pendente (precisa do PC/Flow)
- 26/11 12:29 — ESBOCO: aprovações 12:28 registradas (lista viva, memória, plantas lote 1 aprovadas, Fila, recado APP)
- 26/11 12:20 — ESBOCO: esboço consertos do Início (quadrados, plural, espaços, ›) na Fila
- 26/11 12:08 — ESBOCO: atualiza-ao-vivo: seção PC acrescentada; recado ao APP
- 26/11 12:07 — ESBOCO: esboço atualiza-ao-vivo (causa do 'voltou versões' + como fazer) na Fila; recado ao APP
- 26/11 11:40 — ESBOCO: Semp parte 1 aprovada → Fila implementar (3 fatias) + recado à APP; regra 6 nova no CLAUDE.md; parte 2 (Estúdio ↔ Marketing, Galeria) esboçada
- 26/11 09:28 — PLANTAS: Argus · site: 5 provas novas dos bugs corrigidos desde 19/11 (Esc = voltar, janela solta, Destaque sem piscar, link direto com foto, cartões com desenho); prova 7c 26/26, 7e 17/17; abertos: + do carrinho passa o estoque, topo some ao rolar e abrir o menu (B4)
- 26/11 09:01 — ESBOCO: Semp parte 1 (Marketing › Criar em 3 passos) esboçada: 12 imagens, COMO-FAZER, Fila semp-1-criar; decisões do Semp de 25/11 na lista viva e na memória; motor do Argus: atravessa pela caixa das letras
- 26/11 07:44 — PLANTAS: plano das plantas do site (34 telas, 7 lotes) enviado ao dono
- 26/11 06:26 — ESBOCO: Argus antigo eliminado (para obsoletos), regras 20/21 trocadas, SITE avisado
- 26/11 03:01 — ESBOCO: Argus partes 7e e 8 prontas (porta do site, selo por setor, relatório foto+vídeo, status automático, camadas, ponte app×site); provas todas ok; regras 20/21 e plantas esperando o dono
- 25/11 23:19 — ESBOCO: Argus Parte 7d pronta: regras do banco no emulador do Firebase 1558/1558 = planta da nuvem, 4/4 estragos vistos, 26 testes das funções ok; prova 12/12
- 25/11 22:36 — ESBOCO: Argus Parte 7c pronta: 10 conferências do site, prova 11/11; site de hoje 2 achados (+ passa o estoque; cupom forjado no aparelho aparece)
- 24/11 11:51 — NUVEM: Telefone completo com o país (fone.js) no lugar dos 9/6 últimos dígitos; 26/26 arquivos de teste ok (teste-fone novo com trava). Pacote do cupom + telefone NÃO publicado: espera APP/SITE + OK ESBOCO.
- 24/11 11:48 — NUVEM: VIP só com e-mail (dono 24/11). Testes 25/25 ok. Não publicado.
- 24/11 11:40 — NUVEM: Cupom sem furos (dono 24/11): loja = e-mail obrigatório e dono, um por vez em transação, e-mail no 7º dia sem duplicar, venda desfeita cancela; site = cartão pessoal só da conta do mesmo e-mail confirmado. 25/25 arquivos ok (75 provas no cupom). NÃO publicado.
