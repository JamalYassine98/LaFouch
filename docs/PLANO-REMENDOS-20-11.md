# Plano para tirar os remendos do APP — em partes (S436 · 20/11/2026, madrugada)

Pedido do dono (20/11 01:40): começar pelo inventário dos remendos (docs/INVENTARIO-REMENDOS.md, da S435) e montar o plano em partes para **trocar no lugar** (regra 12). **Só estudo e esboço: nada foi mexido em `src/` nem em `www/`.** Cada parte só começa com o "implementar" do dono.

Como ler: o resumo e as decisões estão no começo; cada parte diz o que é, como fica do jeito natural, o que sai, como se prova e qual o risco. As tabelas vêm do programa `work/s436/remendos/analisa.js` (rodar de novo para atualizar).

## 1. O que o estudo achou (medido com leitor de JavaScript de verdade, não por texto)

| O quê | Hoje |
|---|---|
| Funções/ações com remendo em cima | **62** |
| Remendos (cada "camada" por cima da primeira) | **104** |
| Que tipo de remendo | acréscimo depois: 42 · desvio antes: 23 · pergunta nova + chama a velha calando a pergunta dela: 14 · troca tudo: 13 · antes e depois: 6 · só repassa: 4 · MORTA: 1 · aponta para outra: 1 |
| Guardas da versão velha (`var _x = x`) | 76 |
| Tabelas com a mesma chave escrita 2+ vezes (nomes e frases da barra/grupos) | 10 |
| Pontes `window.__nome` (um arquivo entrega função a outro por fora, sem precisar) | 80 (24 usadas entre arquivos) |
| Vigias que consertam a tela depois de desenhada (MutationObserver/ResizeObserver) | 13 |
| Estilo: `!important` / seletores escritos 3+ vezes | 988 / 73 |
| Estilo criado pelo programa (CSS dentro do JS) | 0 (bom: o estilo está todo no style.css) |

**O que muda em relação ao inventário de 19/11:** o leitor de texto contava `mk` e `T` (não são remendos: são nomes locais) e não via 5 ações que nascem na lista inicial (`estorno`, `notifLimpa`, `inicioReset`, `impdel`, `stAbre`). Também acertei quem "vale" quando a função é declarada duas vezes (a última declarada ganha: `salvarAgora`, `saveFotos`, `nvToken`).

### Três coisas que o remendo esconde (achados de verdade, com prova)

1. **BUG no ar — aparelho novo não consegue entrar na nuvem pelo cartão do Início.** Duas ações têm o mesmo nome (`nvIr`): a do cartão "Seus dados estão na nuvem? · Entrar" (97-nuvem-segura.js) e a da navegação nova (99c, 19/11). A última ganhou; tocar em "Entrar" dá **tela vazia** (endereço `#null`). Medido no simulador. Só aparece em aparelho vazio e sem login (novo, roubado/desconectado, recém-instalado) — por isso ninguém viu. Esboço do conserto: `work/s436/bug-nvir/esboco_bug_entrar_nuvem_{escuro,claro}.jpg`. **Não consertei** (regra 5 e a sua ordem de não implementar nada). É a decisão nº 1 abaixo.
2. **Buraco do embrulho:** quem guardou a função ANTES do embrulho continua chamando a versão velha. Exemplo medido: os campos Código, Grau, Cor e Custo do "Adicionar" (`12-estoque-filtros-cadastro.js:86`, `oninput = render`) redesenham a tela **sem nenhum dos 16 acabamentos** (navegação, links, PC…) a cada letra digitada. Trocando no lugar (parte 1), isso se conserta sozinho.
3. **Remendo sobre remendo que cala o de baixo:** as 15 confirmações novas (98z-s418) guardam a ação antiga (`A0`) e a chamam depois da janela nova. Em 2 delas (Atacado: cancelar conta e cancelar lote) a antiga ainda faz a pergunta cinza do navegador, e a nova **troca o `window.confirm` por um "sim" falso** para ela não aparecer; em outras 4 (estorno, desligar PIN, sair da nuvem, importar cópia) a antiga ainda carrega o seu próprio "toque de novo para confirmar". Funciona, mas cada ação fica escrita em dois lugares.

## 2. Decisões que esperam o dono

1. **Bug do "Entrar" na nuvem (aparelho novo):** posso consertar? Esboço pronto (Hoje: tela vazia × Proposta: Ajustes › Cópias e nuvem aberta, cursor no e-mail). É pequeno e urgente; sugiro antes de tudo.
2. **Parte 1 (render):** já ensaiei numa cópia, com prova (resultado no fim deste arquivo). Se disser "implementar parte 1 dos remendos", é o mesmo ensaio aplicado ao projeto.
3. **Ordem das partes 4–7 (famílias):** sugiro a do inventário de aprovados (Resultados/Preços primeiro, 15 aprovados). Se preferir outra família antes, é só dizer.

## 3. Como cada parte é feita (igual para todas — regra 12 a–e)

- **(a) causa:** a tabela da parte mostra cada função, quem vale hoje e cada remendo em cima, na ordem em que roda.
- **(b) jeito natural:** escrito em cada parte ("Como fica").
- **(c) um lugar só:** a função fica no arquivo da família; o que é comum (render, destinos, confirmação) fica num ponto que serve todas.
- **(d) apaga o que substitui:** os remendos da tabela e as guardas `var _x` saem no mesmo commit; arquivo `98z…` que ficar vazio some. Função preparada e ainda não ligada **não** é apagada.
- **(e) trava:** `python3 tools/remendos.py --grava` baixa o teto no mesmo commit (o porteiro não deixa voltar) + teste próprio do comportamento.
- **Prova de que a tela não mudou** (partes sem mudança visual): `work/s436/remendos/prova.py` abre as 60 telas do app antes × depois, em celular, tablet e PC, e compara peça por peça (texto, lugar, tamanho, cor, letra) — tem que dar **0 diferenças**. Abre o "antes" duas vezes para descartar o que muda sozinho (relógio).
- **Prova nas partes com aprovados** (4–7): a tela de depois tem que ser igual a "hoje + aprovados" (a base dos esboços, `work/kit/base_app.py`): mesmo comparador, 0 diferenças fora do que foi aprovado; o item sai da base quando entra no app.
- **Uma parte = uma publicação**, testada (`python3 tests/run.py`), com conferência da ESBOCO depois (regra 1b). Partes grandes são divididas (4a, 4b…) e o dono é consultado a cada uma (regra 3).

## Parte 1 — A espinha: o desenho da tela (`render`)

**Tamanho:** 1 nomes · 16 remendos · 13 arquivos tocados.

**O que é hoje:** o `render` (desenha o app) foi embrulhado 16 vezes, em 13 arquivos; cada embrulho chama o anterior e acrescenta um acabamento (links, menu do PC, título do grupo, telas Site/Cupons/Marketing/Atacado, navegação, voltar).

**Como fica (jeito natural):** o `render` tem, no arquivo dele, a lista dos passos que rodam antes e depois do desenho; cada família registra o seu passo com uma linha (`aposRender(renderSite)`). Nenhum arquivo troca o `render`. Um passo com erro não derruba os outros (hoje 13 já são assim; 3 não).

**O que sai:** os 16 embrulhos e as 16 guardas (`var _render… = render`). 95 linhas saem, 44 entram.

**O que muda para quem usa:** nada na tela (prova abaixo). Conserta o buraco do item 2 dos achados (campos do "Adicionar").

**Risco:** baixo. Cuidado achado no ensaio: passo cujo nome é trocado depois (`grpTitulo`) tem de ser chamado pelo nome, não guardado — o comparador pegou isso na 1ª tentativa (botão do período do Dashboard perdia o rosa no PC/tablet) e a 2ª já saiu certa.

**Ensaio feito (numa cópia, fora do projeto):** `work/s436/remendos/parte1_render.py` (faz a troca) · `parte1_render.diff` (o que muda, linha a linha) · resultado da prova em "Ensaio da parte 1", no fim.

| Nome | Vale hoje (base) | Remendos em cima, na ordem em que rodam | O que cada um faz |
|---|---|---|---|
| `render` | 99-render-persistencia:4 (43 linhas) | 97u-navegacao-s184:172 → 97w-menu-pc-s234:39 → 98-anim-novas:568 → 98-graus-cor:307 → 98z-atacado-tela-s23:112 → 98z-grupo-flecha-s41:81 → 98z-pc-s244:32 → 98z-pc-s244:63 → 98z-pc-s31-s33:26 → 98z-pc-s31-s33:132 → 98z-s374:89 → 98z-s374:449 → 98z-s374d-padrao:61 → 98z-s374d-padrao:148 → 99b-voltar-janela:26 → 99c-navegacao-s435:384 | acréscimo depois · antes e depois |

## Parte 2 — A espinha: destinos, barra e grupos

**Tamanho:** 11 nomes · 26 remendos · 12 arquivos tocados.

**O que é hoje:** para abrir uma tela pelo nome (`inicioGo`) e para saber qual botão da barra acende (`navOn`), cada novidade embrulhou a função com um "se for a minha tela, faço eu; senão, chama a velha" — 6 + 5 camadas. A lista de grupos (`iniLista`) tem 6 camadas de "migração" (cada uma mexe nos grupos guardados uma vez). Nomes e frases das telas estão em 4 tabelas (`BARRA_NOME`, `GRP_FRASE`, `VIEWS`, ícones) com 10 chaves escritas 2–3 vezes (a última ganha).

**Como fica:** UMA tabela de telas — cada tela diz o nome, a frase, o ícone, como abre e quando está acesa. `inicioGo` e `navOn` só consultam a tabela. As migrações dos grupos viram uma lista só, em ordem, no arquivo dos grupos. `setView`, `grpAbre` e `grpTitulo` ficam com uma versão cada, no arquivo da navegação.

**O que sai:** 26 remendos, as chaves repetidas das tabelas, e o nome repetido `nvIr` (se o conserto do bug não tiver saído antes). Boa parte de `98z-s374.js` (o maior ninho: 22 remendos) esvazia aqui.

**Risco:** médio — é o caminho de toda navegação. Prova: 0 diferenças nas 60 telas + teste novo que abre cada destino da tabela e confere a tela e o botão aceso (hoje não existe teste de todos os destinos).

**Dividir em:** 2a tabela de telas (`inicioGo`/`navOn`/nomes) · 2b grupos (`iniLista`/`grpAbre`/`grpTitulo`) · 2c `setView` e ações soltas (`despAb`, `dfold`, `famNum`, `stAbre`).

| Nome | Vale hoje (base) | Remendos em cima, na ordem em que rodam | O que cada um faz |
|---|---|---|---|
| `inicioGo` | 89-inicio:243 (26 linhas) | 97y-familias-s265:121 → 98z-s374:54 → 98z-s374:114 → 98z-s374:460 → 98z-s374c-site:17 → 98z-s374d-padrao:158 | desvio antes |
| `navOn` | 89-inicio:299 (15 linhas) | 97y-familias-s265:126 → 98z-s374:60 → 98z-s374:119 → 98z-s374:465 → 98z-s374c-site:22 | desvio antes |
| `grpAbre` | 95-barra-grupos:59 (4 linhas) | 98z-s374:164 → 98z-s374d-padrao:164 | desvio antes |
| `setView` | 90-navegacao-dashboard:5 (43 linhas) | 98z-s374:210 | desvio antes |
| `iniLista` | 89-inicio:64 (61 linhas) | 98z-s374:42 → 98z-s374:104 → 98z-s374:156 → 98z-s374:362 → 98z-s374:471 → 98z-s374c-site:34 | acréscimo depois · desvio antes · só repassa |
| `grpTitulo` | 98z-grupo-flecha-s41:64 (1 linhas) | 99c-navegacao-s435:164 | troca tudo |
| `ACT.nvIr` | 97-nuvem-segura:290 (12 linhas) | 99c-navegacao-s435:88 | troca tudo |
| `ACT.stAbre` | 98z-s374:94 (5 linhas) | 98z-s374d-padrao:162 | aponta para outra |
| `ACT.despAb` | 98z-s374:3 (6 linhas) | 98z-s374:269 | antes e depois |
| `ACT.dfold` | 98-financeiro:331 (11 linhas) | 98z-s374:220 | troca tudo |
| `ACT.famNum` | 97y-familias-s265:43 (1 linhas) | 98z-dashboard-s48:236 | troca tudo |

## Parte 3 — Confirmações ("tem certeza?")

**Tamanho:** 15 nomes · 15 remendos · 10 arquivos tocados.

**O que é hoje:** 15 ações perigosas (cancelar pedido, estornar, apagar, sair da nuvem, desligar PIN…) estão escritas em dois lugares: a antiga, no arquivo da família, e a nova em `98z-s418-confirma.js`, que mostra a janela de confirmação e depois chama a antiga por uma guarda (`A0`). Em 2 (Atacado) a nova cala a pergunta cinza da antiga trocando o `window.confirm` por "sim"; em 4 a antiga ainda tem o seu "toque de novo para confirmar".

**Como fica:** cada ação, no arquivo da sua família, com duas metades claras: a pergunta (janela de confirmação padrão) e o fazer. A janela (`lfConfirma`) vai para um arquivo próprio da família "Confirmação". Some o truque do `window.confirm` e a guarda `A0`.

**O que sai:** as perguntas antigas (navegador e "toque de novo"), a guarda `A0`, o truque do `window.confirm` e o arquivo `98z-s418-confirma.js` como "arquivo de correção" (fica só a janela, com nome de família).

**Risco:** médio-baixo, mas são ações sem volta: cada uma ganha teste "pergunta aparece · Voltar não faz nada · confirmar faz uma vez só" (alguns já existem). Nenhuma mudança visual: a janela é a mesma de hoje.

| Nome | Vale hoje (base) | Remendos em cima, na ordem em que rodam | O que cada um faz |
|---|---|---|---|
| `ACT.ataCanc` | 97s-atacado-conta:241 (1 linhas) | 98z-s418-confirma:167 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.ataLoteCanc` | 97s2-atacado-lotes:109 (5 linhas) | 98z-s418-confirma:185 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.bkimp` | 96-ajustes:335 (13 linhas) | 98z-s418-confirma:154 | troca tudo |
| `ACT.cartclear` | 98-carrinho:486 (5 linhas) | 98z-s418-confirma:232 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.estorno` | 94-acoes:137 (78 linhas) | 98z-s418-confirma:94 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.impdel` | 94-acoes:468 (30 linhas) | 98z-s418-confirma:263 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.inicioReset` | 94-acoes:27 (7 linhas) | 98z-s418-confirma:251 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.notifLimpa` | 94-acoes:19 (4 linhas) | 98z-s418-confirma:241 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.nvSair` | 97-nuvem:139 (7 linhas) | 98z-s418-confirma:140 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.pedcanc` | 95-pedidos:868 (16 linhas) | 98z-s418-confirma:57 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.peddel` | 95-pedidos:884 (27 linhas) | 98z-s418-confirma:219 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.pedrecus` | 95-pedidos:667 (15 linhas) | 98z-s418-confirma:77 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.pinoff` | 98-financeiro:284 (18 linhas) | 98z-s418-confirma:128 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.syncdesc` | 97-sync:537 (22 linhas) | 98z-s418-confirma:201 | pergunta nova + chama a velha calando a pergunta dela |
| `ACT.syncdesl` | 97-sync:565 (17 linhas) | 98z-s418-confirma:114 | pergunta nova + chama a velha calando a pergunta dela |

## Parte 4 — Família Resultados / Preços

**Tamanho:** 11 nomes · 18 remendos · 16 arquivos tocados.

**O que é hoje:** Dashboard, dia e Histórico são desenhados pela função original e depois "refeitos" por até 2 camadas (`98z-dashboard-s48.js` redesenha o cabeçalho e chega a desenhar a tela duas vezes para aproveitar uma conta; `98z-s374d` passa o padrão por cima). As ações do cabeçalho (`dVer`, `dPer`…) foram trocadas inteiras 1–3 vezes; `contadorHtml` (Preços) tem 2 acréscimos de 63 e 49 linhas.

**Como fica:** uma função por tela (Dashboard, Dia, Histórico, Giro, Preços, Reservas), cada uma no arquivo da família, desenhando direto o que vale hoje; as ações do cabeçalho com uma versão. O que hoje é "desenha e depois conserta" passa a nascer certo.

**Junto (ordem do dono, 23:42):** os 15 aprovados desta família (docs/APROVADOS-POR-FAMILIA.md): 134, 135d, 135h, 136a, 149l, 149d, 149t, 149s, 149r, 149p, 149pl, 149fe, 149pg, 149sc, 149dup — escritos direto na função da tela, sem camada.

**Dividir em:** 4a Dashboard + Dia + Histórico (só limpeza + 149d/149t) · 4b Preços (limpeza do Contador + 135h, 149p, 149pl, 149fe, 149pg, 149sc, 149dup, 149l) · 4c Giro e Reservas (135d, 149r). Uma publicação cada.

**Risco:** médio-alto (números do dono). Prova: comparador contra "hoje + aprovados" e os testes de valores que já existem (S362–S374).

| Nome | Vale hoje (base) | Remendos em cima, na ordem em que rodam | O que cada um faz |
|---|---|---|---|
| `renderDash` | 90-navegacao-dashboard:110 (232 linhas) | 98z-dashboard-s48:154 → 98z-s374d-padrao:67 | acréscimo depois · antes e depois |
| `renderDay` | 93-historico:158 (226 linhas) | 97y-familias-s265:114 → 98z-dashboard-s48:199 | acréscimo depois |
| `ACT.dVer` | 98-dash-cabecalho:57 (5 linhas) | 98z-dashboard-s48:205 → 98z-grupo-flecha-s41:39 → 98z-s374:173 | acréscimo depois · desvio antes · troca tudo |
| `ACT.dVerEsc` | 98-dash-cabecalho:70 (7 linhas) | 98z-dashboard-s48:211 → 98z-s374:128 | desvio antes · troca tudo |
| `ACT.dPer` | 98-dash-cabecalho:62 (5 linhas) | 98z-dashboard-s48:221 | troca tudo |
| `ACT.dPerEsc` | 98-dash-cabecalho:77 (5 linhas) | 98z-dashboard-s48:227 | troca tudo |
| `contadorHtml` | 97z2-contador:71 (13 linhas) | 98z-precos-s52:6 → 98z-s374:291 | acréscimo depois |
| `atencaoItens` | 89-dash-abas:31 (80 linhas) | 97r-temas-s183:129 → 97w-guardiao:91 | acréscimo depois |
| `histLista` | 97-hist-busca:229 (4 linhas) | 98z-s374d-padrao:174 | acréscimo depois |
| `ACT.hfopen` | 97-hist-busca:266 (4 linhas) | 98z-pc-s244:40 | acréscimo depois |
| `dashCompose` | 89-dash-abas:112 (56 linhas) | 97u-navegacao-s184:180 | desvio antes |

## Parte 5 — Família Peças / Inventário

**Tamanho:** 2 nomes · 6 remendos · 8 arquivos tocados.

**O que é hoje:** a ficha da peça (`renderDetail`, 1.582 linhas) desenha e depois 4 arquivos acrescentam pedaços na tela pronta (botão Ficha N/6, abas, Lucro real, Contador); as abas do Inventário têm 2 camadas.

**Como fica:** a ficha monta a tela chamando os blocos pelo nome, na ordem (cabeçalho, cores, preço, chave do site, lucro, contador, abas) — cada bloco continua no arquivo da sua família, mas quem decide onde ele entra é a ficha. A função grande é dividida em blocos nomeados (sem mudar o que desenha).

**Junto:** aprovados 132, 133b, 134b, 135c, 136b, 136c, 142a, 142c, 142d, 134/134c/134d (formulários na janela de baixo) e o **item 16** (peça incompleta não vai ao site), se o dono aprovar o esboço v2.

**Achado para esta parte:** no tablet a ficha já está quebrada hoje ("Ficha 5/6" e "Preço" fora da tela; coluna de 152 px) — recado deixado para a ESBOCO.

**Dividir em:** 5a ficha em blocos (0 diferenças) · 5b abas do Inventário e Fornecedores + aprovados · 5c formulários (134c/134d/142d) · 5d item 16.

**Risco:** alto pelo tamanho; por isso 5a não muda nada na tela e é provada antes de qualquer aprovado entrar.

| Nome | Vale hoje (base) | Remendos em cima, na ordem em que rodam | O que cada um faz |
|---|---|---|---|
| `renderDetail` | 10-estoque-detalhe:61 (1582 linhas) | 97t-ficha-s190:138 → 97u-navegacao-s184:108 → 97y-lucro-real:106 → 97z2-contador:107 | acréscimo depois |
| `renderEstoqueAbas` | 14-estoque-abas:298 (52 linhas) | 98z-s374:388 → 98z-s374d-padrao:75 | acréscimo depois · antes e depois |

## Parte 6 — Família Site / Pedidos / Marketing

**Tamanho:** 6 nomes · 6 remendos · 9 arquivos tocados.

**O que é hoje:** o painel do site (`renderLojaOnline`, `onlUrl`) tem uma camada do S374; a tela Resumo é montada por uma ponte `window.__renderSite95` entre dois arquivos que já dividem tudo; `vitProduto` (o que vai ao site) ganha um acréscimo em outro arquivo; `siteOfPct` idem; `cupAbre` e `mkAbre` foram trocadas inteiras (as velhas não rodam mais).

**Como fica:** Site, Cupons e Marketing como telas normais da tabela de telas (parte 2), cada uma com sua função no arquivo da família; `vitProduto` com tudo o que manda ao site num lugar só (importante para o item 16 e para a "ficha só de fatos" já aprovada).

**O que sai:** 6 remendos, a ponte `__renderSite95`, as versões mortas de `cupAbre`/`mkAbre`.

**Risco:** médio — `vitProduto` decide o que aparece no site. Prova extra: o documento enviado ao site (`vitDocBody`) tem de ser idêntico, campo a campo, para todas as peças de teste, antes × depois.

| Nome | Vale hoje (base) | Remendos em cima, na ordem em que rodam | O que cada um faz |
|---|---|---|---|
| `renderLojaOnline` | 96-loja-online:581 (40 linhas) | 98z-s374c-site:81 | antes e depois |
| `onlUrl` | 96-loja-online:629 (4 linhas) | 98z-s374c-site:55 | acréscimo depois |
| `vitProduto` | 96-loja-online:158 (51 linhas) | 97-site-v2:39 | acréscimo depois |
| `siteOfPct` | 97-ofertas-site:88 (6 linhas) | 97r-temas-s183:57 | acréscimo depois |
| `ACT.cupAbre` | 97-cupons:203 (15 linhas) | 98z-s374:454 | troca tudo |
| `mkAbre` | 97-marketing:603 (8 linhas) | 98z-s374d-padrao:153 | troca tudo |

## Parte 7 — Famílias Dinheiro, Vender, Clientes/Atacado, Câmera

**Tamanho:** 8 nomes · 8 remendos · 13 arquivos tocados.

**O que é hoje:** uma camada em cada: Caixa (acréscimo), Câmbio e Catálogo (acréscimo de animação), `cartrm` (trocada inteira), ficha do cliente e "novo cliente" (PC), modo cliente, tutorial do Estúdio (trocado inteiro: o velho de 57 linhas não roda mais).

**Como fica:** cada função com uma versão no arquivo da família; o que é só do PC entra como parte da função ("se a tela é larga…"), não como camada.

**Junto:** Dinheiro — 135a, 135b, 135e, 135f, 135i, 136d, 142bA, 142f, 142g · Vender — 141, 142st (e depois 149v-pag) · Clientes — 133a, 133j · navegação/botões — links ⌄, 149a, 149f, 149n, 149g · visual — 149c, 149c2, 149c3, 140C · outros — 135g.

**Dividir em:** 7a Dinheiro · 7b Vender · 7c Clientes/Atacado · 7d Início e grupos (149n, 149g) · 7e campos e escolhas (149c…, 140C).

**Risco:** médio; Vender e Caixa têm os testes mais completos do projeto.

| Nome | Vale hoje (base) | Remendos em cima, na ordem em que rodam | O que cada um faz |
|---|---|---|---|
| `renderCaixa` | 95-caixa:228 (84 linhas) | 97y-familias-s265:55 | acréscimo depois |
| `renderFx` | 91-cambio:60 (9 linhas) | 98-anim-novas:574 | acréscimo depois |
| `renderVendas` | 60-vendas:78 (514 linhas) | 98-anim-novas:582 | acréscimo depois |
| `ACT.cartrm` | 98-anim-novas:78 (14 linhas) | 98-carrinho:491 | troca tudo |
| `ACT.cliab` | 96-clientes:282 (6 linhas) | 97u-navegacao-s184:199 | desvio antes |
| `ACT.clinovo` | 96-clientes:276 (6 linhas) | 98z-pc-s244:46 | acréscimo depois |
| `mcInicio` | 97-modo-cliente:108 (16 linhas) | 97-modo-cliente2-loja:111 | acréscimo depois |
| `estTutorial` | 97-estudio:1854 (57 linhas) | 98z-camera-s262:89 | troca tudo |

## Parte 8 — Nuvem, cópia e sincronização (por último: mexe com os dados)

**Tamanho:** 8 nomes · 9 remendos · 9 arquivos tocados.

**O que é hoje:** `97-nuvem-segura.js` embrulha 6 funções de dados (salvar, salvar fotos, restaurar, aplicar sincronização, limpar peça excluída, token) para pôr proteções ("não grava enquanto apaga", "peça excluída não volta"); `97z-voltar-tempo.js` acrescenta em `salvarAgora` e `backupHtml`. `avMin` está declarada duas vezes (a primeira nunca roda).

**Como fica:** cada proteção dentro da função que ela protege (ex.: `salvarAgora` começa com "se está apagando, não grava"), no arquivo de quem cuida do dado.

**Por que por último:** é onde um erro custa mais (dados do dono) e onde a tela não mostra nada — o comparador de telas não serve. Prova própria: os testes de cópia/restauração/sincronização que já existem + teste novo para cada proteção (apagando não grava; excluída não volta; restaurar mantém aparelhos) rodando antes × depois com os mesmos dados.

**Risco:** alto se feito com pressa; baixo com a prova acima. Sem mudança visual.

| Nome | Vale hoje (base) | Remendos em cima, na ordem em que rodam | O que cada um faz |
|---|---|---|---|
| `salvarAgora` | 99-render-persistencia:474 (56 linhas) | 97-nuvem-segura:261 → 97z-voltar-tempo:93 | acréscimo depois · desvio antes |
| `saveFotos` | 99-render-persistencia:155 (28 linhas) | 97-nuvem-segura:266 | desvio antes |
| `nvToken` | 97-nuvem:35 (23 linhas) | 97-nuvem-segura:225 | só repassa |
| `restaurarDados` | 96-ajustes:19 (46 linhas) | 97-nuvem-segura:66 | antes e depois |
| `syncAplica` | 05-sync:137 (87 linhas) | 97-nuvem-segura:82 | desvio antes |
| `limpaRefExcluido` | 05-movimentos:94 (10 linhas) | 97-nuvem-segura:57 | desvio antes |
| `backupHtml` | 59-seguranca:173 (10 linhas) | 97z-voltar-tempo:183 | acréscimo depois |
| `avMin` | 97-push:207 (4 linhas) | 97-push:57 | MORTA |

## Parte 9 — Estilo (`www/style.css`): `!important` e seletores repetidos

**O que é hoje:** 988 `!important` em 3.073 linhas e 73 seletores escritos 3+ vezes (`.go` 11×, `html` 11×, `.mini` 9×…): regra nova por cima da velha.

**Como fica:** cada família com o seu bloco (já é regra 1b); dentro do bloco, uma regra por seletor; `!important` só onde não há outro jeito (estilo de estado contra estilo posto pelo programa).

**Como fazer sem quebrar:** o estilo de cada família é limpo **junto** com a parte da família (4–7). Para a base (botões `.go`/`.mini`/`.btn`/`.chip`, `html`, `:root`) fica esta parte, no fim. Método: o mesmo comparador (ele mede cor, letra, borda, lugar e tamanho de cada peça nas 60 telas × 3 aparelhos × claro/escuro) — junta as regras do seletor numa só, tira o `!important`, roda: 0 diferenças ou volta. A SITE já faz isso no site com o "medidor de cascata" (S430); vale combinar a mesma ferramenta.

**Risco:** baixo por passo (cada passo é pequeno e medido), longo no total. O teto do porteiro (988 / 73) desce a cada passo.

## Parte 10 — Restos

- **Pontes `window.__nome` entre arquivos** (`__prodVolta` (10-estoque-detalhe → 98z-folha-unica), `__atvPecaHtml` (97-sync2 → 10-estoque-detalhe), `__syncOffline` (97-sync → 40-formatos-venda), `__voaSrc` (60-vendas → 98-carrinho), `__lastTexts` (82-leitor-preprocessamento → 80-leitor-dialogos), `__lastPrep` (82-leitor-preprocessamento → 80-leitor-dialogos), `__fechoAlerta` (98-fechamento → 89-dash-abas, 97w-guardiao), `__avTocaTipo` (97-push → 89-notificacoes, 95-pedidos), `__navVolta` (94-acoes → 90-navegacao-dashboard, 99b-voltar-janela), `__barraSegurou` (98-botoes-barra → 90-navegacao-dashboard, 98z-grupo-flecha-s41, 98z-s374, 99c-navegacao-s435), `__fxAdota` (91-cambio → 97-sync), `__vendaApHtml` (97-sync → 93-historico), `__trMoeda` (94-acoes → 97-cambio-aba), `__avisoLocal` (97-push → 95-pedidos), `__pedSync` (95-pedidos → 97-push), `__siteEstado` (98z-s374c-site → 96-ajustes), `__restConfirma` (96-ajustes → 97-nuvem), `__lcIrGiro` (98z-s374 → 97-busca-unica), `__lfFold` (98z-s374 → 97-hist-busca), `__revBannerHtml` (97-sync → 97-hist-busca), `__revJanelaHtml` (97-sync → 97-hist-busca), `__fechoCc` (98-fechamento → 98-financeiro), `__fuAcha` (98z-folha-unica → 99c-navegacao-s435), `__renderSite95` (98z-s374c-site → 98z-s374)): os arquivos já dividem o mesmo escopo; a ponte some quando a família dos dois lados é limpa.
- **Tabelas com chave repetida** (resolvidas na parte 2):
- `DT_FRASE.hoje`: 98-dash-cabecalho:3 → 98z-dashboard-s48:8
- `BARRA_NOME.vendas`: 89-inicio:273 → 98z-s374:19
- `BARRA_NOME.mkt`: 89-inicio:275 → 98z-s374d-padrao:99
- `GRP_FRASE.lotes`: 98z-grupo-flecha-s41:10 → 98z-s374:22
- `GRP_FRASE.caixa`: 98z-grupo-flecha-s41:7 → 98z-s374:24
- `GRP_FRASE.desp`: 98z-grupo-flecha-s41:8 → 98z-s374:25
- `GRP_FRASE.fx`: 98z-grupo-flecha-s41:7 → 98z-s374:26
- `GRP_FRASE.ped`: 98z-grupo-flecha-s41:10 → 98z-s374:27
- `GRP_FRASE.anl`: 98z-grupo-flecha-s41:12 → 98z-s374:28 → 98z-s374c-site:12
- `GRP_FRASE.ata`: 98z-grupo-flecha-s41:12 → 98z-s374:29 → 98z-s374:142
- **Tocos** (5, do inventário de 19/11) e **função morta** (`avMin` em 97-push.js:57).
- **Vigias** (13): conferir um a um se ainda consertam alguma coisa depois que a tela passar a nascer certa; o que não consertar mais, sai.
- **Trava mais fina:** `tools/remendos.py` passa a usar o leitor de verdade (`analisa.js`) — hoje ele conta por texto (serve como teto, mas tem 2 falsos e não vê nome repetido na lista inicial de ações).

## Ordem e dependências

1 → 2 → 3 (espinha: tudo o que as famílias penduram) → 4 → 5 → 6 → 7 (famílias, com os aprovados) → 8 (dados) → 9 (estilo que sobrou) → 10 (restos).
As partes 1, 2 e 3 não mudam nada na tela e destravam as outras: sem elas, cada família teria de continuar embrulhando o `render` e o `inicioGo`.
Não depende de outras sessões, mas a parte 6 conversa com a NUVEM/SITE (`vitProduto` e a "ficha só de fatos") — recado antes de começar.

## Ensaio da parte 1 (feito nesta madrugada, numa cópia em /tmp — o projeto não foi mexido)

- Troca: `python3 work/s436/remendos/parte1_render.py <cópia>` → 16 embrulhos trocados, nenhum `render = function` sobrou; o app monta sem erro.
- Prova das telas (`prova.py`, 60 telas, antes × depois): **0 diferenças de verdade em 60 telas × 3 aparelhos (celular escuro, tablet escuro, PC claro). O comparador marcou 2 peças que mudam sozinhas e foram conferidas uma a uma: a frase "cotação da loja travada [desde 20/11]" do Câmbio (depende de quanto o aparelho demora; variou nos dois sentidos e também abrindo só o "antes") e um traço animado de 23→24 px na Lista de compras. Nenhum erro novo. Relatórios: work/s436/remendos/prova1/*.json.**
- Testes do porteiro na cópia: **327/327 passaram.**
- Teto dos remendos na cópia: **embrulhos 72 → 57 e reescritas 74 → 58 (na conta por texto do porteiro); ações, !important e seletores iguais.**

## Ferramentas deixadas (todas só leem)

- `work/s436/remendos/analisa.js` — o inventário com leitor de JavaScript (cadeias, tipos, guardas, tabelas, pontes, vigias) → `analise.json`. `--lista` mostra as cadeias.
- `work/s436/remendos/refs.js nome…` — quem guarda uma função sem chamar (os "buracos").
- `work/s436/remendos/prova.py` — antes × depois em todas as telas (0 diferenças = não mudou).
- `work/s436/compara_app.py` — o comparador Hoje × Proposta do APP (regra 11), usado também no esboço 16.
- `work/s436/remendos/plano.py` — monta este arquivo.
