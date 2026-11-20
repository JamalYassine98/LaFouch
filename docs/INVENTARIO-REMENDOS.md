# Inventário dos remendos do APP (S435 · 19/11/2026 20:55)

Pedido do dono (20:53, "Sim"): listar o que é remendo em cima de remendo, família por família, com o que substituir e o que apagar. Só leitura — nada foi mexido. Gerado por `work/remendos/varre.py` + `doc.py` (rodar de novo para atualizar).

## Números de hoje

| O quê | Quantos |
|---|---|
| Funções **declaradas** e depois **reescritas** em outro arquivo (a última ganha) | 73 reescritas em 34 funções |
| Ações `ACT.x` escritas em 2+ lugares | 24 ações |
| "Embrulhos" `var _x = x;` (guarda a velha para chamar dentro da nova) | 72 |
| Arquivos `98z…`/`99…` (correções de arquivos anteriores) | 17 |
| Tocos (função vazia deixada no lugar) | 5 |
| Estilo: `!important` | 988 em 3073 linhas |
| Estilo: seletores escritos 3+ vezes | 73 |

## Como limpar (regra 12 a–e) — vale para cada linha abaixo

1. Juntar as versões da função/ação numa só, **no arquivo da família**, com o comportamento que vale HOJE (a última da cadeia + o que ela chama das anteriores).
2. Apagar as versões antigas e os `var _x` no mesmo commit.
3. Provar que a tela ficou igual: inventário 1 (antes) = inventário 1 (depois) nas telas da família (work/verif/passada.py) + `python3 tests/run.py`.
4. Trava no porteiro (abaixo) para não voltar.

## Por família (ordem sugerida: a que tem mais remendo primeiro)

### Resultados / Preços — 12

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| função | `atencaoItens` | 89-dash-abas.js:31 | 97r-temas-s183.js:129 → 97w-guardiao.js:91 |
| função | `contadorHtml` | 97z2-contador.js:71 | 98z-precos-s52.js:6 → 98z-s374.js:314 |
| ação | `dPer` | 98-dash-cabecalho.js:62 | 98z-dashboard-s48.js:221 |
| ação | `dPerEsc` | 98-dash-cabecalho.js:77 | 98z-dashboard-s48.js:227 |
| ação | `dVer` | 98-dash-cabecalho.js:57 | 98z-dashboard-s48.js:205 → 98z-grupo-flecha-s41.js:39 → 98z-s374.js:196 |
| ação | `dVerEsc` | 98-dash-cabecalho.js:70 | 98z-dashboard-s48.js:211 → 98z-s374.js:151 |
| função | `dashCompose` | 89-dash-abas.js:112 | 97u-navegacao-s184.js:180 |
| ação | `hfopen` | 97-hist-busca.js:266 | 98z-pc-s244.js:40 |
| função | `histLista` | 97-hist-busca.js:229 | 98z-s374d-padrao.js:174 |
| função | `renderDash` | 90-navegacao-dashboard.js:110 | 98z-dashboard-s48.js:154 → 98z-s374d-padrao.js:67 |
| função | `renderDay` | 93-historico.js:158 | 97y-familias-s265.js:114 → 98z-dashboard-s48.js:199 |
| função | `setView` | 90-navegacao-dashboard.js:5 | 98z-s374.js:233 |

### Ajustes — 9

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| função | `backupHtml` | 59-seguranca.js:173 | 97z-voltar-tempo.js:183 |
| ação | `bkimp` | 96-ajustes.js:335 | 98z-s418-confirma.js:154 |
| ação | `nvIr` | 97-nuvem-segura.js:290 | 99c-navegacao-s435.js:88 |
| ação | `nvSair` | 97-nuvem.js:139 | 98z-s418-confirma.js:140 |
| função | `nvToken` | 97-nuvem.js:35 | 97-nuvem-segura.js:225 |
| função | `restaurarDados` | 96-ajustes.js:19 | 97-nuvem-segura.js:66 |
| função | `syncAplica` | 05-sync.js:137 | 97-nuvem-segura.js:82 |
| ação | `syncdesc` | 97-sync.js:537 | 98z-s418-confirma.js:201 |
| ação | `syncdesl` | 97-sync.js:565 | 98z-s418-confirma.js:114 |

### Navegação / Início — 9

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| ação | `despAb` | 98z-s374.js:3 | 98z-s374.js:292 |
| função | `grpAbre` | 95-barra-grupos.js:59 | 98z-s374.js:187 → 98z-s374d-padrao.js:164 |
| função | `grpTitulo` | 98z-grupo-flecha-s41.js:64 | 99c-navegacao-s435.js:164 |
| função | `iniLista` | 89-inicio.js:64 | 98z-s374.js:42 → 98z-s374.js:127 → 98z-s374.js:179 → 98z-s374.js:385 → 98z-s374.js:494 → 98z-s374c-site.js:34 |
| função | `inicioGo` | 89-inicio.js:243 | 97y-familias-s265.js:121 → 98z-s374.js:54 → 98z-s374.js:137 → 98z-s374.js:483 → 98z-s374c-site.js:17 → 98z-s374d-padrao.js:158 |
| função | `navOn` | 89-inicio.js:299 | 97y-familias-s265.js:126 → 98z-s374.js:60 → 98z-s374.js:142 → 98z-s374.js:488 → 98z-s374c-site.js:22 |
| função | `render` | 99-render-persistencia.js:4 | 97u-navegacao-s184.js:172 → 97w-menu-pc-s234.js:39 → 98-anim-novas.js:568 → 98-graus-cor.js:307 → 98z-atacado-tela-s23.js:112 → 98z-grupo-flecha-s41.js:81 → 98z-pc-s244.js:32 → 98z-pc-s244.js:63 → 98z-pc-s31-s33.js:26 → 98z-pc-s31-s33.js:132 → 98z-s374.js:112 → 98z-s374.js:472 → 98z-s374d-padrao.js:61 → 98z-s374d-padrao.js:148 → 99b-voltar-janela.js:26 → 99c-navegacao-s435.js:384 |
| função | `salvarAgora` | 99-render-persistencia.js:474 | 97-nuvem-segura.js:261 → 97z-voltar-tempo.js:93 |
| função | `saveFotos` | 99-render-persistencia.js:155 | 97-nuvem-segura.js:266 |

### Base / outros — 7

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| função | `T` | 00-estado-utilitarios.js:231 | 97-push.js:101 |
| ação | `cartrm` | 98-anim-novas.js:78 | 98-carrinho.js:491 |
| ação | `dfold` | 98-financeiro.js:331 | 98z-s374.js:243 |
| ação | `famNum` | 97y-familias-s265.js:43 | 98z-dashboard-s48.js:236 |
| função | `limpaRefExcluido` | 05-movimentos.js:94 | 97-nuvem-segura.js:57 |
| função | `mk` | 00-estado-utilitarios.js:210 | 57-separacao.js:397 |
| ação | `pinoff` | 98-financeiro.js:284 | 98z-s418-confirma.js:128 |

### Site / Pedidos — 7

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| função | `onlUrl` | 96-loja-online.js:576 | 98z-s374c-site.js:55 |
| ação | `pedcanc` | 95-pedidos.js:868 | 98z-s418-confirma.js:57 |
| ação | `peddel` | 95-pedidos.js:884 | 98z-s418-confirma.js:219 |
| ação | `pedrecus` | 95-pedidos.js:667 | 98z-s418-confirma.js:77 |
| função | `renderLojaOnline` | 96-loja-online.js:528 | 98z-s374c-site.js:81 |
| função | `siteOfPct` | 97-ofertas-site.js:88 | 97r-temas-s183.js:57 |
| função | `vitProduto` | 96-loja-online.js:158 | 97-site-v2.js:39 |

### Clientes / Atacado — 4

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| ação | `ataCanc` | 97s-atacado-conta.js:241 | 98z-s418-confirma.js:167 |
| ação | `cliab` | 96-clientes.js:282 | 97u-navegacao-s184.js:199 |
| ação | `clinovo` | 96-clientes.js:276 | 98z-pc-s244.js:46 |
| função | `mcInicio` | 97-modo-cliente.js:108 | 97-modo-cliente2-loja.js:111 |

### Peças / Inventário — 3

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| ação | `ataLoteCanc` | 97s2-atacado-lotes.js:109 | 98z-s418-confirma.js:185 |
| função | `renderDetail` | 10-estoque-detalhe.js:61 | 97t-ficha-s190.js:138 → 97u-navegacao-s184.js:108 → 97y-lucro-real.js:106 → 97z2-contador.js:107 |
| função | `renderEstoqueAbas` | 14-estoque-abas.js:298 | 98z-s374.js:411 → 98z-s374d-padrao.js:75 |

### Dinheiro — 2

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| função | `renderCaixa` | 95-caixa.js:228 | 97y-familias-s265.js:55 |
| função | `renderFx` | 91-cambio.js:60 | 98-anim-novas.js:574 |

### Vender — 2

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| ação | `cartclear` | 98-carrinho.js:486 | 98z-s418-confirma.js:232 |
| função | `renderVendas` | 60-vendas.js:78 | 98-anim-novas.js:582 |

### Marketing — 2

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| ação | `cupAbre` | 97-cupons.js:203 | 98z-s374.js:477 |
| função | `mkAbre` | 97-marketing.js:603 | 98z-s374d-padrao.js:153 |

### Câmera / Estúdio — 1

| Tipo | Nome | Original | Reescrita em (a última vale) |
|---|---|---|---|
| função | `estTutorial` | 97-estudio.js:1849 | 98z-camera-s262.js:89 |

## Arquivos só de correção (98z / 99)

`98z-atacado-tela-s23.js`, `98z-camera-s262.js`, `98z-camera-t149cam.js`, `98z-dashboard-s48.js`, `98z-folha-unica.js`, `98z-grupo-flecha-s41.js`, `98z-pc-s244.js`, `98z-pc-s31-s33.js`, `98z-precos-s52.js`, `98z-s374.js`, `98z-s374c-site.js`, `98z-s374d-padrao.js`, `98z-s418-confirma.js`, `98z-trilho-s370.js`, `99-render-persistencia.js`, `99b-voltar-janela.js`, `99c-navegacao-s435.js`

Cada um deve sumir quando a sua família for limpa: o conteúdo certo vai para o arquivo da família e o resto sai.

## Tocos

- `12-estoque-filtros-cadastro.js:155` — $('eMed').oninput = function () {};
- `70-camera.js:218` — b.onclick = function () {};
- `97-giro-trata.js:10` — // Uso: giroTrata(blob, { aviso: function (fase, parte) {} }).then(function (r) { r.blob, 
- `97-nota.js:248` — fim = function () {};
- `98z-s374d-padrao.js:124` — mkMonta(c, { fecha: function () {} });

## Estilo (www/style.css) — seletores escritos mais vezes

| Seletor | Vezes |
|---|---|
| `.go` | 11 |
| `html` | 11 |
| `.mini` | 9 |
| `:root` | 7 |
| `.chip` | 7 |
| `.go:not(:disabled):active` | 7 |
| `.btn` | 7 |
| `body` | 5 |
| `button` | 5 |
| `.tab` | 5 |
| `.mn` | 5 |
| `.pdB1` | 5 |
| `.go[disabled]` | 4 |
| `.tl` | 4 |
| `.go:disabled` | 4 |
| `.cascata .tl` | 4 |
| `.cascata .hero` | 4 |
| `.chip:active` | 4 |
| `.bsolid` | 4 |
| `.mini:not(:disabled):active` | 4 |
| `.btn-sc` | 4 |
| `#vTabBar` | 4 |
| `.ebBar` | 4 |
| `.vtL` | 4 |
| `.lfEspCx` | 4 |

## Trava proposta no porteiro (para TODAS as sessões)

Um teste novo no `tests/run.py` que **reprova a publicação** se, em relação ao commit anterior:
- aparecer um `var _x = x;` novo ou uma função declarada sendo reescrita em outro arquivo;
- uma ação `ACT.x` passar a existir em mais de um lugar;
- o número de `!important` ou de seletores repetidos subir.
Enquanto a limpeza não termina, o teste guarda os números de hoje como teto e só deixa **descer**.

**LIGADA em 20/11/2026 (item 18, S436):** `tools/remendos.py` conta; teto em `tests/teto-remendos.json` (72 embrulhos · 74 reescritas · 24 ações em 2+ lugares · 988 !important · 73 seletores 3+ vezes); é o 1º teste do `tests/run.py`. Quem limpar uma família roda `python3 tools/remendos.py --grava` no mesmo commit para baixar o teto.

## Site

O site tem o mesmo problema; a SITE · implementa já está limpando os estilos na cópia limpa (ramo `limpo`, S430 "medidor de cascata"). Este inventário é só do APP.
