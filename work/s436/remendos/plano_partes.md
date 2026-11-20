**O que é hoje:** o `render` (desenha o app) foi embrulhado 16 vezes, em 13 arquivos; cada embrulho chama o anterior e acrescenta um acabamento (links, menu do PC, título do grupo, telas Site/Cupons/Marketing/Atacado, navegação, voltar).

**Como fica (jeito natural):** o `render` tem, no arquivo dele, a lista dos passos que rodam antes e depois do desenho; cada família registra o seu passo com uma linha (`aposRender(renderSite)`). Nenhum arquivo troca o `render`. Um passo com erro não derruba os outros (hoje 13 já são assim; 3 não).

**O que sai:** os 16 embrulhos e as 16 guardas (`var _render… = render`). 95 linhas saem, 44 entram.

**O que muda para quem usa:** nada na tela (prova abaixo). Conserta o buraco do item 2 dos achados (campos do "Adicionar").

**Risco:** baixo. Cuidado achado no ensaio: passo cujo nome é trocado depois (`grpTitulo`) tem de ser chamado pelo nome, não guardado — o comparador pegou isso na 1ª tentativa (botão do período do Dashboard perdia o rosa no PC/tablet) e a 2ª já saiu certa.

**Ensaio feito (numa cópia, fora do projeto):** `work/s436/remendos/parte1_render.py` (faz a troca) · `parte1_render.diff` (o que muda, linha a linha) · resultado da prova em "Ensaio da parte 1", no fim.
=====
**O que é hoje:** para abrir uma tela pelo nome (`inicioGo`) e para saber qual botão da barra acende (`navOn`), cada novidade embrulhou a função com um "se for a minha tela, faço eu; senão, chama a velha" — 6 + 5 camadas. A lista de grupos (`iniLista`) tem 6 camadas de "migração" (cada uma mexe nos grupos guardados uma vez). Nomes e frases das telas estão em 4 tabelas (`BARRA_NOME`, `GRP_FRASE`, `VIEWS`, ícones) com 10 chaves escritas 2–3 vezes (a última ganha).

**Como fica:** UMA tabela de telas — cada tela diz o nome, a frase, o ícone, como abre e quando está acesa. `inicioGo` e `navOn` só consultam a tabela. As migrações dos grupos viram uma lista só, em ordem, no arquivo dos grupos. `setView`, `grpAbre` e `grpTitulo` ficam com uma versão cada, no arquivo da navegação.

**O que sai:** 26 remendos, as chaves repetidas das tabelas, e o nome repetido `nvIr` (se o conserto do bug não tiver saído antes). Boa parte de `98z-s374.js` (o maior ninho: 22 remendos) esvazia aqui.

**Risco:** médio — é o caminho de toda navegação. Prova: 0 diferenças nas 60 telas + teste novo que abre cada destino da tabela e confere a tela e o botão aceso (hoje não existe teste de todos os destinos).

**Dividir em:** 2a tabela de telas (`inicioGo`/`navOn`/nomes) · 2b grupos (`iniLista`/`grpAbre`/`grpTitulo`) · 2c `setView` e ações soltas (`despAb`, `dfold`, `famNum`, `stAbre`).
=====
**O que é hoje:** 15 ações perigosas (cancelar pedido, estornar, apagar, sair da nuvem, desligar PIN…) estão escritas em dois lugares: a antiga, no arquivo da família, e a nova em `98z-s418-confirma.js`, que mostra a janela de confirmação e depois chama a antiga por uma guarda (`A0`). Em 2 (Atacado) a nova cala a pergunta cinza da antiga trocando o `window.confirm` por "sim"; em 4 a antiga ainda tem o seu "toque de novo para confirmar".

**Como fica:** cada ação, no arquivo da sua família, com duas metades claras: a pergunta (janela de confirmação padrão) e o fazer. A janela (`lfConfirma`) vai para um arquivo próprio da família "Confirmação". Some o truque do `window.confirm` e a guarda `A0`.

**O que sai:** as perguntas antigas (navegador e "toque de novo"), a guarda `A0`, o truque do `window.confirm` e o arquivo `98z-s418-confirma.js` como "arquivo de correção" (fica só a janela, com nome de família).

**Risco:** médio-baixo, mas são ações sem volta: cada uma ganha teste "pergunta aparece · Voltar não faz nada · confirmar faz uma vez só" (alguns já existem). Nenhuma mudança visual: a janela é a mesma de hoje.
=====
**O que é hoje:** Dashboard, dia e Histórico são desenhados pela função original e depois "refeitos" por até 2 camadas (`98z-dashboard-s48.js` redesenha o cabeçalho e chega a desenhar a tela duas vezes para aproveitar uma conta; `98z-s374d` passa o padrão por cima). As ações do cabeçalho (`dVer`, `dPer`…) foram trocadas inteiras 1–3 vezes; `contadorHtml` (Preços) tem 2 acréscimos de 63 e 49 linhas.

**Como fica:** uma função por tela (Dashboard, Dia, Histórico, Giro, Preços, Reservas), cada uma no arquivo da família, desenhando direto o que vale hoje; as ações do cabeçalho com uma versão. O que hoje é "desenha e depois conserta" passa a nascer certo.

**Junto (ordem do dono, 23:42):** os 15 aprovados desta família (docs/APROVADOS-POR-FAMILIA.md): 134, 135d, 135h, 136a, 149l, 149d, 149t, 149s, 149r, 149p, 149pl, 149fe, 149pg, 149sc, 149dup — escritos direto na função da tela, sem camada.

**Dividir em:** 4a Dashboard + Dia + Histórico (só limpeza + 149d/149t) · 4b Preços (limpeza do Contador + 135h, 149p, 149pl, 149fe, 149pg, 149sc, 149dup, 149l) · 4c Giro e Reservas (135d, 149r). Uma publicação cada.

**Risco:** médio-alto (números do dono). Prova: comparador contra "hoje + aprovados" e os testes de valores que já existem (S362–S374).
=====
**O que é hoje:** a ficha da peça (`renderDetail`, 1.582 linhas) desenha e depois 4 arquivos acrescentam pedaços na tela pronta (botão Ficha N/6, abas, Lucro real, Contador); as abas do Inventário têm 2 camadas.

**Como fica:** a ficha monta a tela chamando os blocos pelo nome, na ordem (cabeçalho, cores, preço, chave do site, lucro, contador, abas) — cada bloco continua no arquivo da sua família, mas quem decide onde ele entra é a ficha. A função grande é dividida em blocos nomeados (sem mudar o que desenha).

**Junto:** aprovados 132, 133b, 134b, 135c, 136b, 136c, 142a, 142c, 142d, 134/134c/134d (formulários na janela de baixo) e o **item 16** (peça incompleta não vai ao site), se o dono aprovar o esboço v2.

**Achado para esta parte:** no tablet a ficha já está quebrada hoje ("Ficha 5/6" e "Preço" fora da tela; coluna de 152 px) — recado deixado para a ESBOCO.

**Dividir em:** 5a ficha em blocos (0 diferenças) · 5b abas do Inventário e Fornecedores + aprovados · 5c formulários (134c/134d/142d) · 5d item 16.

**Risco:** alto pelo tamanho; por isso 5a não muda nada na tela e é provada antes de qualquer aprovado entrar.
=====
**O que é hoje:** o painel do site (`renderLojaOnline`, `onlUrl`) tem uma camada do S374; a tela Resumo é montada por uma ponte `window.__renderSite95` entre dois arquivos que já dividem tudo; `vitProduto` (o que vai ao site) ganha um acréscimo em outro arquivo; `siteOfPct` idem; `cupAbre` e `mkAbre` foram trocadas inteiras (as velhas não rodam mais).

**Como fica:** Site, Cupons e Marketing como telas normais da tabela de telas (parte 2), cada uma com sua função no arquivo da família; `vitProduto` com tudo o que manda ao site num lugar só (importante para o item 16 e para a "ficha só de fatos" já aprovada).

**O que sai:** 6 remendos, a ponte `__renderSite95`, as versões mortas de `cupAbre`/`mkAbre`.

**Risco:** médio — `vitProduto` decide o que aparece no site. Prova extra: o documento enviado ao site (`vitDocBody`) tem de ser idêntico, campo a campo, para todas as peças de teste, antes × depois.
=====
**O que é hoje:** uma camada em cada: Caixa (acréscimo), Câmbio e Catálogo (acréscimo de animação), `cartrm` (trocada inteira), ficha do cliente e "novo cliente" (PC), modo cliente, tutorial do Estúdio (trocado inteiro: o velho de 57 linhas não roda mais).

**Como fica:** cada função com uma versão no arquivo da família; o que é só do PC entra como parte da função ("se a tela é larga…"), não como camada.

**Junto:** Dinheiro — 135a, 135b, 135e, 135f, 135i, 136d, 142bA, 142f, 142g · Vender — 141, 142st (e depois 149v-pag) · Clientes — 133a, 133j · navegação/botões — links ⌄, 149a, 149f, 149n, 149g · visual — 149c, 149c2, 149c3, 140C · outros — 135g.

**Dividir em:** 7a Dinheiro · 7b Vender · 7c Clientes/Atacado · 7d Início e grupos (149n, 149g) · 7e campos e escolhas (149c…, 140C).

**Risco:** médio; Vender e Caixa têm os testes mais completos do projeto.
=====
**O que é hoje:** `97-nuvem-segura.js` embrulha 6 funções de dados (salvar, salvar fotos, restaurar, aplicar sincronização, limpar peça excluída, token) para pôr proteções ("não grava enquanto apaga", "peça excluída não volta"); `97z-voltar-tempo.js` acrescenta em `salvarAgora` e `backupHtml`. `avMin` está declarada duas vezes (a primeira nunca roda).

**Como fica:** cada proteção dentro da função que ela protege (ex.: `salvarAgora` começa com "se está apagando, não grava"), no arquivo de quem cuida do dado.

**Por que por último:** é onde um erro custa mais (dados do dono) e onde a tela não mostra nada — o comparador de telas não serve. Prova própria: os testes de cópia/restauração/sincronização que já existem + teste novo para cada proteção (apagando não grava; excluída não volta; restaurar mantém aparelhos) rodando antes × depois com os mesmos dados.

**Risco:** alto se feito com pressa; baixo com a prova acima. Sem mudança visual.
