# ARGUS — Agente de Revisão e Garantia Unificada de Sistemas (aprovado 24/11/2026 15:30)
Porteiro do site e do app: um motor só, dois setores. Plano: PLANO-ARGUS.md · estudo: ESTUDO-ARGUS.md.

## Parte 0 · chão firme (24/11, feita)
- motor/aparelhos.py — faixa de aparelhos por lógica (320 → 2560) + o celular do dono (aparelho_dono.json) como mais um; modos de cada setor.
- motor/loja.py — loja de teste do Argus (dados/loja_normal.json), no mesmo formato em que o app guarda; cenários normal, vazio, cheio, nomes_longos; relógio parado em 24/11/2026 15:00.
- motor/abrir.py — a porta do app (passa por work/kit/sim.py), com a loja entrando pelo armazenamento do app. A porta do site entra na Parte 7.
- provas/parte0_chao.py — relógio, loja, cenários, "mesma tela 2× = igual" (3 telas × 3 aparelhos × 2 temas) e a autoprova (1 ponto plantado tem de ser visto). Resultado 24/11: 23 de 23 ok.

## Parte 1 · a planta (24/11, feita)
- motor/esboco.py — o esboço é uma mudança no src/ (patch) aplicada numa CÓPIA do app em /tmp e montada com o build.js: feito com as peças de família, como a APP vai fazer; o src/ real nunca muda. Guardado em esbocos/<id>/ (mudanca.patch + base.txt).
- motor/planta.py — grava a planta: as peças que aparecem (texto, caixa, letra, cor, fundo, borda, desenho do ícone) nos dois temas, título e tela, cenário, relógio, caminho e as LIGAÇÕES (cada botão tocado de verdade: sai para…, abre ali, janela de baixo, nada; botão de perigo não é tocado). valida(): aprovada só com a linha na lista viva; substitui(): a anterior vai para work/obsoletos/argus-plantas.
- provas/parte1_planta.py — 15 de 15 (roda numa pasta de teste em /tmp, não suja as plantas de verdade): 3 telas gravadas e regravadas iguais (peças e ligações), esboço demo-iva na cópia ("IVA" e "10%" à direita) sem mexer no app real, proteção (pendente / inválida / aprovada) e a troca para obsoletos.

## Parte 2 · o comparador (24/11, feita)
- motor/compara.py — app × planta, peça por peça, pelo que aparece: posição e tamanho ±1 px; cor, fundo, borda, raio, letra iguais; ícone com o mesmo desenho e traço. Ruído (abre o app 2×): vira "não conferido", nunca some. Deslocamento em cascata vira UMA diferença.
- provas/parte2_compara.py — 19 de 19: app × a própria planta = igual (3 telas × 2 temas), autoprova com 10 estragos (todos vistos), cascata, ruído e o esboço demo-iva × app de hoje mostrando o que falta implementar.
- Saíram para work/obsoletos/titan-trocado-pelo-argus-parte2-24-11/: titan/compara.py, fichas/, indice.py, lado.py, triagem.py, molde_de_esboco.py, titan.py, moldes/, gabarito/, novo/.

## Parte 3 · toques, explorador e cobertura (24/11, feita)
- motor/toques.py — as ligações do app × as da planta (botão reconhecido pelo nome que aparece e pela ordem, nunca pelo nome do código) e as regras de toque: › sai e o voltar volta ao mesmo ponto · ⌄ abre ali, fecha no 2º toque, toques rápidos não deixam pela metade · janela de baixo sem "×"/"Fechar", fecha com Esc, tocando fora e arrastando, e pergunta "Sair sem salvar?".
- motor/explorador.py — parte das 5 abas e toca em tudo (menos perigo): lugares (tela + janela) com o caminho, erros do app a cada toque, cobertura do app.js (código morto) e o mapa (lugar sem planta = trava).
- provas/parte3_toques.py — 12 de 12 (a 1ª rodada deu 11/12: o botão quebrado na cópia demo-dobra-morta não era visto, porque o botão era reconhecido pelo nome do código; corrigido e as partes 1–2 rodadas de novo, 6/6; explorador, cobertura e mapa: 6/6 na 1ª rodada — 88 lugares, 235 toques, 4.213 funções medidas, função plantada vista como morta).
- Saíram para work/obsoletos/titan-trocado-pelo-argus-parte3-24-11/: titan/explorador.py, datas.sh.

## Parte 4 · o medidor de família (24/11, feita)
- motor/familia.py — UM medidor com as regras 13–17: L1 eixo do bloco, L2 ícone no centro da linha, L3 espaços 8/16/24/32/48 entre blocos, L4 texto de uma linha não quebra nem corta, toque ≥ 44 px, "+" redondo, números (G$ 25.000 · US$ 3,79 · 18/11), cores da paleta oficial (lida do próprio CSS), ícones com um traço, movimento (uma curva e um tempo; nada se mexe com "reduzir movimento"), mesmo verbo, tela vazia = ícone + frase + explicação; e a família inteira em todas as telas (mesma função = mesma aparência).
- provas/parte4_familia.py — 15 de 15: autoprova com 14 defeitos plantados (cada um aparece como achado novo) + o medidor nos 40 primeiros lugares do explorador, nos dois temas e com "reduzir movimento". Achados do app em provas/parte4_achados_do_app_24-11.json (a conferir com as plantas na Parte 6: onde o dono aprovou diferente da regra, vale o aprovado e o Argus mostra o conflito).
- Saíram para work/obsoletos/titan-trocado-pelo-argus-parte4-24-11/: titan/familia.py, medir.py, prova_medidor.py, roteiro.py, relatorio/. Os medidores do kit (mede.js e outros) ficam até a Parte 7 (o Argus atual do site ainda usa).

## Parte 5 · setor App, a porta do app (24/11, feita)
- setor_app/modos.py — claro E escuro · as 3 letras do app (1×, 1,15×, 1,3×; no simulador o texto cresce na mesma proporção, a letra de verdade é no emulador) · biometria (tecla da digital) e PIN (cenários 'bloqueio' e 'biometria' na loja de teste).
- setor_app/porta.py — `rapida` (a cada passo) e `completa` (antes de publicar, só ela dá selo): autoprova · tests/run.py · plantas válidas · comparador · toques · medidor nos modos (5 aparelhos × 2 temas × 3 letras; o que é igual ao aprovado vira "regra × aprovado, o dono decide") · tempo com a loja cheia · mapa (lugar sem planta) · erros do passeio · código morto · segurança (provas da NUVEM) · selo.
- motor/tempo.py (abrir ≤ 3 s, toque ≤ 500 ms), motor/selo.py (selo só para o mesmo commit; o publicar confere — ligação no publicar na Parte 8, com o dono), motor/autoprova.py (estragos + versão antiga v641 reprovada nos erros conhecidos).
- Emulador Android (de graça, repositório público): .github/workflows/argus-android.yml + setor_app/no_emulador/ — tela do Xiaomi do dono (1221×2712, 3×), fuso America/Asuncion, letras reais 1,0/1,15/1,3, claro e escuro; coleta dentro do WebView do APK; setor_app/emulador.py busca e compara (falta/sobra + medidor). Medido: área útil do APK = 407 × 832 (as barras do Android ocupam 72) → o simulador passou a usar 407 × 832 para o celular do dono.
- provas/parte5_setor_app.py — 10 de 10 (rápida e completa). Porta completa com 2 plantas de TESTE: 12 etapas, autoprova ok, tests/run.py ok, comparador ok, sem selo por 4 etapas com falha (toques, medidor nos modos, tempo com a loja cheia, mapa) — achados reais do app em provas/parte5_porta_completa_24-11.json; Android em provas/parte5_android_24-11.json.
- Saíram para work/obsoletos/gabaritos-trocados-pelo-argus-parte5-24-11/: work/kit/base_app.py, work/s435/varredura/aprovados.py, work/s349/ap.py (os scripts antigos de esboço que os usavam ficam como registro).

## Limpeza e ferramentas novas (24–25/11, pedido do dono 21:26: "perfeito, limpo, sem redundância")
- Um lugar só: todo código que roda dentro da página mora em motor/js/ (base.js com o que é visível, o que se toca, a linha, o nome da tela e a janela; planta, família, tempo, voltar, relógio, loja) e setor_app/js/ (letra, biometria, erro ao salvar). Python e o emulador leem os MESMOS arquivos (motor/js.py). Os botões de perigo moram só em motor/perigo.py. Relógio parado igual no simulador e no Android (js/relogio.js).
- Gestos com o dedo de verdade (motor/dedo.py: arrasta): rolar (a tela rola, a barra de abas fica, nada rola de lado), arrastar a janela para fechar, tocar fora, e teclado subindo (o campo e o "Salvar" continuam à vista). Janela de baixo × caixa no meio da tela (regra 15).
- Estados: "erro ao salvar" (o app tem de avisar, e o aviso é igual em todas as telas), sem internet, reduzir movimento, PIN e biometria — todos na lista de modos; modo que não rodou = "não conferido" (trava).
- Contraste: texto legível sobre o fundo (padrão WCAG AA: 4,5:1; texto grande 3:1) no medidor único.
- Dados antigos na versão nova (motor/migracao.py): a loja guardada pela versão publicada e pela v641 abre igual na versão nova.
- Onde a diferença nasceu (motor/origem.py): busca binária nas versões; provado apontando a v635 como a que refez Preços.
- Tempo no Android (loja cheia, os mesmos limites de motor/tempo.py). O Android roda sem internet de fora, como o simulador (a cotação de verdade mudava números).
- Provas de novo, depois da limpeza: Parte 0 23/23 · 1 15/15 · 2 19/19 · 3 12/12 · 4 15/15 · 5 rápida 11/11 e completa 11/11 (16 etapas) · ferramentas novas (provas/parte6_ferramentas_novas.py) 12/12. Android: comparador 0 diferenças com as plantas de teste.

## O dedo de verdade (aprovado 25/11 08:13; o Argus gravava as linhas ⌄ do Ajustes como "não faz nada")
- motor/dedo.py — UM jeito de tocar para tudo (planta, toques, explorador, tempo, PIN, Android emulado): o dedo encosta no meio do botão e solta (no PC, o botão do mouse); se outra coisa está por cima, o dedo pega ela ("coberto por"). Saiu o clique por comando (A.tocar) e o motor/js/tempo.js (agora base.js: vigia/parou).
- O que o toque fez = RETRATO antes × depois (base.js: alvo/retrato/depois): sai para · abre a janela de baixo · abre o menu · abre ali · troca a escolha · mostra aviso · já é a escolha · nada. Saiu a regra "a página cresceu 8 px".
- Botão que não faz nada é falha (toques.regras); linha só de estado não pode ser botão.
- Letra grande do jeito do Android (motor/js/letra.js, abrir.abre(letra=…)): os tamanhos do CSS crescem antes de o app desenhar; o app continua descendo a letra quando não cabe. Serve ao app e ao site.
- O caminho até um setor de Preços mora num lugar só (planta.precos); as 7 cópias do caminho de Regras saíram.
- Trava (autoprova): linha que só abre com o dedo, aba que troca, menu solto, botão que não faz nada, letra 1,3× que ainda desce, tela que muda sozinha sem parar — 6 de 6 vistos.
- Tela parada que muda sozinha sem parar (motor/tempo.py: muda_sozinha; base.js: sozinha) = falha "laço", e os tempos de toque daquela tela ficam "não conferidos" (uma causa, um achado). Achado real 25/11: a barra de baixo do app muda 60×/s parada (recado à APP).
- A letra do simulador × a do Android (setor_app/emulador.py: letra_igual): mesmo texto, mesmo tamanho (até 0,5 px). Diferença achada 25/11: Compras 1,15× — o simulador desenha com Inter e o Android com Roboto (mais estreita), então só no simulador a lista desce um degrau de letra.

## Base de cada planta (dono 25/11 10:29)
- A planta de cada coisa = o último APROVADO dela, mesmo que ainda não implementado; onde não há esboço aprovado, a planta é o app real. O que o app não tem e o aprovado tem aparece como "falta implementar".

## Letras do Android e sinal × destino (aprovado 25/11 10:07)
- As telas de celular abrem num navegador que só enxerga as letras de um Android (motor/letras/android.conf: Roboto; serifa Liberation Serif; máquina DejaVu Sans Mono) — como no celular, "Segoe UI", "Inter", system-ui e sans-serif viram Roboto. O PC fica como está. Um navegador por tipo de letra (abrir.navegador_de). A Noto Serif do Android não está instalada aqui (a serifa ainda difere).
- O sinal bate com o destino (toques.regras, regras 15–16): "›" leva a outra tela, e ela tem "‹ voltar" · "⌄" abre ali · não existe "tela por cima" (camada opaca que cobre a tela: base.js porCima) · aba troca a vista ali e cada grupo tem 2–3 abas · "+" redondo abre a janela de baixo com "Salvar". O sinal é lido pelo texto ou pelo desenho da setinha na tela (base.js sinal).
- Quando a planta APROVADA faz o mesmo que o app, a regra vira aviso "regra × aprovado (o dono decide)" e não trava (ex.: "Gerenciar grupo ›" do 48a; Instagram que não faz nada).
- O voltar também é tocado com o dedo (voltar.js só acha o botão "‹"). Só o caminho até a tela (A.aba, planta.precos) usa clique por comando: é preparação, não conferência.
- Trava: 21 de 21 na autoprova (o sinal, a tela por cima, 4 abas, o "+" e a Roboto incluídos).
- O app de hoje é MONTADO do código do commit atual (esboco.hoje, uma vez por commit), como o APK e a publicação — não o www/ guardado (que ficava com o número de versão de antes: 5.59.0 × 5.60.0).
- A versão do app é dado, não desenho (compara.mesma_versao + js/versao.js): o número gravado na planta vira o da versão conferida.
- Android emulado: Android 16 (api 36, o do celular do dono, com a tabela de fusos nova — o 34 punha o horário de verão antigo do Paraguai e as horas saíam 1 h antes); animações do sistema LIGADAS como no celular do dono (desligadas, o WebView diz "reduzir movimento" e o app troca a linha das abas por um sublinhado); desenho por software (swiftshader); fuso UTC−3 fixo (aparelho_dono.json explica). Antes de cada tela, o armazenamento do app é zerado como num aparelho novo (js/loja_poe.js) — antes a aba escolhida numa tela passava para a próxima.
- Provas 25/11 (depois de tudo): Parte 0 23/23 · 1 15/15 · 2 19/19 · 3 12/12 · 4 15/15 · 6 14/14 · 5 rápida 11/11 · autoprova 21/21 · Android emulado (claro e escuro, 3 letras): app × planta 0 diferenças, letra simulador × Android 0.

## Parte 7a · o chão do setor Site (25/11)
- setor_site/lfsite.py: o site de um commit do catalogo (sem build: git archive), servido uma vez por rodada (o commit de quando ela começou). A 1ª planta do site terá base no ef883de (19/11) + aprovados.
- A loja de teste do site entra pelo caminho de verdade: /dados/inicio.json e as leituras do Firestore (produtos, config/site) respondidas com o retrato congelado dados/site_loja_normal.json (17 peças reais). Cenários: normal, vazio, cheio (119), nomes_longos. Escrever na nuvem e as funções ficam cortadas (a Parte 7c responde por elas).
- Modos do site (aparelhos.MODOS['site']): só claro · temáticas sem, natal, anonovo de dia e de noite (21:00), mães, pais, halloween, bf, bf-quase (a semana antes) · letra 1×/1,1×/1,2× · PT e ES pelo idioma do aparelho.
- As letras que o site baixa do Google (Inter e Fraunces) são servidas daqui. Limite: a Fraunces 500 não está nesta máquina; a 500 usa a 600 (títulos um pouco mais grossos que no ar) — some se a rede para instalar pacotes for liberada.
- O mundo parado ganhou o sorteio fixo (Math.random sempre na mesma sequência, js/relogio.js) e o "parar" (base.js: animação que acaba vai ao fim, a que repete fica no começo) antes de medir e fotografar. Enfeite vivo da página (data-lfvivo, regra do próprio site: neve, pétalas) não é peça da tela.
- abrir.pagina = o que é comum ao app e ao site (aparelho, internet de fora cortada e anotada, base, relógio, letra). A letra grande entra no fim do <head> (ou depois da última folha de estilo, onde o <head> não é escrito, como no app) e também cresce as folhas que chegam depois.
- Prova: provas/parte7a_site_chao.py — 27/27.

## Parte 7b · plantas e conferência do site com o mesmo motor (25/11)
- planta.SETORES: o app (claro/escuro, plantas/app) e o site (as 9 temáticas, plantas/site); a tela guardada leva setor e endereço (planta.tela_de: um lugar só para compara, toques, origem, porta, emulador).
- O servidor da cópia do site atende como o GitHub Pages (setor_site/servidor.py: /catalogo → catalogo.html, 404 → 404.html). O catalogo daqui é raso: a cópia busca a história quando precisa (ef883de).
- No site a tela é o endereço (o título do destaque muda sozinho). Uma camada que sobe com "‹ voltar" em cima é outra TELA, não janela de baixo (base.js: A.voltar, que também acha a setinha "‹" desenhada). Janela de baixo deixa a tela de trás à vista em cima.
- Toque que sai do site: "abre fora: wa.me" (a página tentou ir para fora) ou "abre outra página" (aba nova) — antes saía "nada". O voltar do aparelho usa o voltar de verdade (pode trocar de página no site). A rolagem de onde se tocou é a de antes do toque. A dobra (⌄) é que tem de fechar no 2º toque; aria-expanded numa linha com texto também é dobra.
- Prova: provas/parte7b_site_planta.py — 8/8 (site × própria planta = igual; estrago visto; 19/11 × hoje = 335 diferenças; toques e medidor rodam no site).

## Parte 7c · as conferências próprias do site (25/11)
- setor_site/etapas.py: busca, carrinho, preços, cupom, compra pela nuvem, idioma e fotos, rede, consulta do Mochi, a página por dentro, girar. Cada resultado é ok / ACHADO / não conferido; uma que quebra vira "não conferido" com o motivo (nunca some).
- Tudo pelo caminho da cliente: depois de pôr no carrinho, a janela "Adicionado" → "Finalizar compra". O cupom chega pelo link lafouch.com/t/CÓDIGO (a 404 só aceita 4 a 24 letras/números) — o campo do código no carrinho saiu de propósito.
- A nuvem de teste (setor_site/nuvem.py) dá também o selo do App Check (reCAPTCHA de mentira + troca no Firebase) e anota se cada chamada levou o selo.
- Internet fraca = a régua do Lighthouse para celular (562,5 ms, 1,47 Mbit/s).
- Prova: provas/parte7c_site_etapas.py — 11/11 (todas rodam; estragos vistos: português no espanhol, foto quebrada, chamada sem selo, nuvem fora na compra; quebra vira "não conferido").
- Site de hoje: 66 resultados, 2 ACHADOS — o "+" do carrinho passa o estoque da cor (31 com estoque 5; só a reserva barra depois) e um cupom escrito à mão no aparelho (lf_cup) aparece como desconto sem a nuvem confirmar.

## Parte 7d · a segurança de verdade da nuvem (25/11)
- setor_nuvem/planta_nuvem.json: quem pode o quê em cada coleção do banco (todos · dono = uid E e-mail · dona do documento; "fechada" = só o servidor). É a regra aprovada como tabela, não cópia do firestore.rules.
- setor_nuvem/regras.mjs, no emulador do Firebase (GitHub: .github/workflows/argus-nuvem.yml; não toca na nuvem publicada): 49 coleções × 6 pessoas (sem login, cliente, outra cliente, dono, dono falso de e-mail, dono falso de uid) × ler/listar/criar/mudar/apagar + o cadastro da cliente (até 30 campos). Prova a si mesmo com 4 estragos numa cópia das regras (cupons abertos, dono sem e-mail, cliente lê outra, pedido direto no banco).
- setor_nuvem/seguranca.py: os testes das funções aqui (o que falta pacote fica "não conferido" e o GitHub confere) + o emulador no GitHub. Fecha por padrão: sem resultado = falha.
- motor/github.py: um lugar só para subir a versão, disparar, esperar e baixar (o Android do app usa o mesmo).
- Prova: provas/parte7d_nuvem.py — 9/9 aqui, 12/12 com --github (regras 1558/1558 = planta; 4/4 estragos vistos; 26 testes das funções ok).

## Parte 7e · a porta do site e o selo por setor (26/11)
- setor_site/porta.py rapida|completa: autoprova (motor + estragos do site, setor_site/estragos.py) · conferências do site · plantas do site válidas · comparador · toques · medidor nos modos do site · tempo com a loja cheia · mapa (página sem planta, só na completa) · segurança (setor NUVEM) · selo. Só a completa dá selo.
- Modos do site na completa: cada valor de cada modo roda (28 aberturas por tela): no celular do dono as 9 temáticas; em cada aparelho as 3 letras; o espanhol na letra maior; reduzir movimento. Na rápida: celular do dono, sem temática, 1×, PT.
- Mapa: cada página .html do site + carrinho, conta e peça; uma planta cobre a própria rota e as que o dono aprovar como iguais ("vale_para").
- motor/selo.py: o selo vale para o commit do setor — app: o do projeto; site: o do catalogo — e só sem mudança fora dele.
- A porta do app também usa a segurança do setor NUVEM (setor_nuvem/seguranca.py); nenhuma porta chama o Argus antigo (work/fiscal).
- Prova: provas/parte7e_porta_site.py — 17/17.
- O Argus antigo do site e a troca das regras 20/21 esperam o dono: REGRAS-20-21-PROPOSTA.md.

## Parte 8 · relatório, status e camadas (26/11)
- motor/compara.py: cada diferença traz onde está (5º campo: a caixa da peça).
- motor/relatorio.py: foto da tela de hoje × planta com cada diferença num quadro numerado; vídeo MP4 do toque que falhou (o dedo de verdade, filmado pelo próprio navegador). As portas geram sozinhas em /tmp/argus/relatorio/<setor>/ e listam no resultado.
- motor/anota.py: no fim da porta rodada pelo comando, o resultado entra sozinho na Fila do status (tools/status.py fila … argus-porta-app / argus-porta-site), nunca à mão. Limite: rápida 10 min, completa 30 min — passou, aparece no status.
- TEXTO QUE ATRAVESSA (o defeito do site em 25/11: as cores base sumiram do :root e o menu e a peça abriam sem fundo): base.js A.atravessa — dois textos no mesmo lugar sem nada com fundo entre eles. Entra no medidor (toda tela) e em cada toque (o estado depois do toque fica na ligação). Na autoprova: uma camada sem fundo plantada e um botão que abre outra; os dois têm de ser vistos. Conferido: o site de hoje acusa (peça: “Catálogo” por cima de “Início”; menu por cima do destaque); o de 19/11 e as 5 abas do app (claro e escuro), nada.
- Prova: provas/parte8_relatorio.py — 9/9.
