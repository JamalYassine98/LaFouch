# Plano das ferramentas — esboço para o dono (SITE · implementa, 21/11/2026)

Pedido do dono (20/11 00:30, recado da NUVEM): uma ferramenta para cada trabalho, sem duas fazendo o mesmo. Em partes, esboço antes.
Nada aqui muda o site nem o app: é só o jeito de conferir. Nada foi mexido ainda (fora a trava do status.py, ver o fim).

## O que existe hoje (contado no projeto em 21/11)
| Trabalho | Ferramentas hoje | Quem usa |
|---|---|---|
| Abrir o site/app no simulador | **5 jeitos**: `work/kit/kit.py` (site e app, para esboço), `work/s349/ap.py` (app, por cima do kit), `work/testes/base.py` + `novo()` do `provas.py` (site, para as provas), o abre do `compara.py` (site), `work/mkcopy.sh` (cópia de teste com 20 peças) | 39 + 233 + 84 scripts (a maioria é de sessões antigas em work/sNNN) |
| Medir a tela | **9 medidores**: `alin.js` (2 usos), `alin2.js` (23), `olho.js` (69), `centro.js` (6), `abas_dist.js` (5), `sobre.js` (5), `verif.js` (2), `tools/detector-colisoes-site.py` (1), `work/fiscal/audita.js` (2) + as medidas de dentro do `compara.py` e do `selos.py` | cada um mede "sobreposto", "cortado", "alinhado" do seu jeito |
| Conferir telas | `compara.py` (Hoje × Proposta), `fiscal.py` (visual do Argus, com linha de base própria), `work/verif/*` (varredura de padrões do app), inventários 1/2 e de botões | três que olham a mesma coisa |
| Portão antes de publicar | `work/fiscal/argus.py` (221 provas no rápido) | SITE |
| Contas e regras | `tests/run.py`, testes da nuvem, `regras.py`, `csp.py` | ficam |
| Aparelho real, sessões, código morto | Test Lab, `tools/status.py`, `tools/deadcode.py` + medição com o site rodando | ficam |

## As partes (uma por vez; cada uma só fecha com o Argus em 0 falhas e o mesmo número de provas)
1. **Um simulador só** — um módulo `work/kit/sim.py` com "abre o site" e "abre o app" (aparelho, letra, idioma, claro/escuro, cópia de teste ou endereço). `provas.py`, `fiscal.py`, `compara.py`, `kit.py` e `ap.py` passam a chamar ele; os abre-telas de cada um saem no mesmo passo. Prova: Argus com as mesmas 221 provas e comparador com 0 diferenças entre a tela aberta pelo jeito velho e pelo novo.
2. **Um jeito de medir** — uma biblioteca `work/kit/mede.js` (caixa, texto, camada de rolagem, sobreposto, cortado, fora da tela, alinhado, contraste). O comparador, o fiscal e as provas usam a mesma; os 9 medidores saem um a um, cada um só depois de a biblioteca pegar tudo o que ele pegava (defeito plantado: o erro antigo é recolocado de propósito e a biblioteca tem de achar).
3. **O comparador é o único que confere telas** — ganha a 2ª lista de telas (as 60 do app, aprovado 20/11 08:17) e os relatórios que hoje são os inventários. As ideias do designer só entram se pegarem sozinhas 3 erros reais do dono: faixa da Black Friday cobrindo o topo na conta; nome da cliente abrindo tela vazia; piscada de animação. O que não pegar, não entra.
4. **O Argus vira só o portão** — roda o comparador (publicado × o que vai subir: toda diferença tem de estar na lista do que foi aprovado) e as provas, e diz "pode" ou "não pode". O fiscal visual e a linha de base dele saem quando o comparador cobrir os mesmos aparelhos.

## É remendo? (regra 12)
Não: cada parte tira o que substitui no mesmo passo e nenhuma ferramenta nova fica ao lado da velha. O risco é o contrário — mexer no portão e ele passar a deixar erro entrar. Por isso a regra de fechamento de cada parte (mesmas provas, 0 falhas, defeito plantado achado).

## O que o dono decide
- "Aprovado" para as 4 partes nessa ordem, ou trocar a ordem (minha sugestão: 1 → 4 → 2 → 3, porque o portão com o comparador é o que mais evita erro novo no ar).

## Já feito nesta noite (era urgente, não muda tela)
- `tools/status.py`: a memória e a lista viva só crescem; se a cópia do aparelho encolheu, o comando PARA antes de enviar (prova 5 no `tools/teste-status.py`). Motivo: dois commits de 20/11 regravaram os dois arquivos só com a linha nova (1,3 MB sumiram); foi tudo recuperado do histórico.

## Andamento
- **Parte 1 — UM simulador só: FEITA em 21/11.** `work/kit/sim.py` (`navegador(pw)` e `contexto(b, W, H, toque, celular, dpr, lingua, escuro, movimento, camera, lugar, csp_livre, sem_trabalhador)`) é o único lugar que abre navegador e aparelho. Passaram a usar: provas.py, fiscal.py, csp.py, selos.py (Argus), compara.py (comparador), roteiros.py (varredura), base.py (testes), kit.py, ap.py, painel.py (esboços). Saíram os 12 jeitos escritos à mão (2 programas de navegador diferentes, 4 conjuntos de opções). ACHADO: o fiscal visual do Argus lia `/home/claude/gz/base.py`, um arquivo de FORA do projeto (se a máquina fosse refeita, o portão parava) — agora usa o `work/testes/base.py` do projeto. Fechamento: Argus com as mesmas 232 provas, 0 falhas, 0 defeitos visuais novos; comparador site × o mesmo site = 0 diferenças nas 12 telas; kit de esboço abre a tela. O abre-telas antigo da varredura (`roda.py`) foi para work/obsoletos (superado pelos roteiros).
- Ordem que falta: 4 (Argus só portão, rodando o comparador) → 2 (um jeito de medir) → 3 (comparador único com as telas do app).
- **Parte 4 — o Argus é o portão: FEITA em 21/11.** `argus.py` roda também o comparador entre o site publicado (origin/main do catalogo, em /tmp/argus_hoje) e a pasta de trabalho: falha nova reprova; toda diferença tem de casar com uma linha de `work/fiscal/diferencas-aprovadas.txt` (o que o dono aprovou), senão reprova. Pasta igual ao publicado = 1 prova "igual". `python3 work/fiscal/argus.py comparador` roda só esse portão (5 min), para conferir um esboço. Defeito plantado (logo de 56 para 62 px): reprovou com 9 falhas, dizendo onde. Argus inteiro depois: 233 provas, 0 falhas. Falta: o fiscal visual e a linha de base dele saírem (só depois da parte 2/3, quando o comparador cobrir os mesmos aparelhos e telas).
- Ordem que falta: 2 (um jeito de medir) → 3 (comparador único com as telas do app).

## Partes 2 e 3 elaboradas (22/11, pedido do dono "vamos para as ferramentas, elabore") — esboço, esperando o dono

### Parte 3a (proponho fazer PRIMEIRO) — o comparador olhar TODAS as telas do site, não só três
Hoje o comparador e o portão só abrem Início, Catálogo e Peça. Foi por isso que a câmera do formato do rosto ficou um dia fora da tela sem ninguém acusar.
- A lista de telas do comparador vira um **roteiro** num arquivo só (`work/s430/comparador/roteiro_site.py`): as 3 de hoje + as 22 que usei na conferência de 21/11 (menu, busca, filtros, aviso "adicionado", carrinho, entrar, criar conta, Minha conta logada, mapa, consulta do grau, rosto, janela da câmera, comparar, atacado, portal do atacado, "Separado para você", ajuda, aviso de excluir conta…).
- Tela nova no site = linha nova no roteiro, no mesmo passo (vira prova: tela que existe na planta e não está no roteiro reprova).
- Custo: o portão passa de ~19 para ~30 min. O modo rápido "só comparador" continua.
- Fecha quando: recolocando o defeito de 19/11 (base das janelas cortada), o comparador reprova sozinho.

### Parte 2 — um jeito só de medir
Hoje 9 medidores + as medidas de dentro do comparador, das provas e dos selos dizem "sobreposto", "cortado" e "alinhado" cada um do seu jeito (dois deles discordavam: a prova do painel ignorava fundo em degradê).
- Uma biblioteca: `work/kit/mede.js`. Ela devolve, de qualquer tela aberta, a lista das peças (o que é, texto, caixa, desenho visível, camada de rolagem, fundo de verdade, cor, letra) e os achados por regra.
- Regras, cada uma escrita uma vez: sobreposto · cortado · fora da tela · coberto (não dá para tocar) · toque menor que 44 · margens/eixo/linha de base · espaços 8/16/24/32/48 · contraste (com degradê) · janela presa na tela.
- Cada regra só entra se pegar sozinha um erro REAL que o dono achou e um defeito plantado. Erros de referência: faixa da Black Friday cobrindo o topo; "Últimas" batendo na armação; selo da Black Friday em cima de "Últimas"; janela da câmera fora da tela; texto quebrando em 2 linhas.
- Ordem de troca: comparador → fiscal do portão → provas → selos. Cada medidor antigo vai para work/obsoletos só depois de a biblioteca pegar tudo o que ele pegava.
- Fecha quando: Argus com o mesmo número de provas e 0 falhas, e os 5 erros de referência achados.

### Parte 3b — as telas do app no mesmo comparador
- Segundo roteiro: as 60 telas de `tools/teste-android/telas.py`, claro e escuro, 3 letras, abertas pelo simulador único com todos os aprovados por cima.
- O comparador do app feito pela APP (`work/s436/compara_app.py`) é aposentado depois; o que ele tem de bom (quebra de linha nova × igual à de hoje, agrupar o que só foi empurrado, confirmar numa 2ª abertura) entra no único.
- Inventário 1/2 e inventário de botões viram relatórios do comparador. O fiscal visual e a linha de base dele saem quando o comparador cobrir os mesmos aparelhos.
- Depende da APP (as telas são dela): combinar por recado antes.

### É remendo?
Não: cada parte tira o que substitui. O risco é o portão ficar frouxo — por isso toda parte fecha com defeito plantado achado.

### O que o dono decide
- "Aprovado" para a ordem 3a → 2 → 3b (minha sugestão), ou outra ordem.
- Se aceita o portão mais demorado (~30 min) em troca de olhar todas as telas.

### Feito em 22/11 — o comparador olha todas as telas do site
- As telas saem de UM roteiro (`work/s430/comparador/roteiro_site.py`): 22 telas (Início, Catálogo, Peça, Menu, Busca, Filtros, Aviso adicionado, Carrinho, Entrar, Mapa, Consulta do grau, Formato do rosto, Janela da câmera, Comparar, Atacado, Portal do atacado, Separado para você, Ajuda e, logada, Minha conta, Meus pedidos, Pagar pedido, Aviso de cancelar). A nuvem é simulada (pedidos e conta de teste), nada é gravado.
- Rodada inteira: 50 combinações tela × aparelho em 26 min, 0 falhas novas, 0 diferenças (publicado × o mesmo).
- Defeito plantado (sem a base das janelas soltas): diferenças em Janela da câmera, Comparar e Portal do atacado → o Argus reprova.
- `CMP_TELAS="Carrinho,Mapa"` roda só as telas mexidas (conferir esboço rápido).
- Falta: prova "o roteiro cobre todas as telas" (cada tela nova do site entra no roteiro ou numa lista de fora) — vai junto da parte 2.

### Parte 2a feita em 22/11 — a biblioteca de medidas e a prova dela
- `work/kit/mede.js` (medidas, cada regra escrita uma vez) + `work/kit/mede.py` (medir e ROLAR tudo o que rola: a página, o catálogo dentro de #vscr, a peça dentro da camada aberta) + `work/kit/mede_prova.py` (a prova).
- Regras: sobreposto (pela tinta do texto, não pela caixa) · cortado · fora da tela · página larga · janela fora da tela · coberto (coisa parada tampada por outra parada) · quebrou a linha · encosta na foto (texto em cima do desenho da armação, medido nos pontos da foto).
- Os 5 erros de referência, refeitos pela mesma causa numa cópia: 5 de 5 pegos, e a mesma tela limpa não acusa. Foto: work/s430/ferramentas/medidor_5_erros_22-11.jpg.
- Site de hoje, 22 telas × celular e PC: 1 achado de verdade — "Ver este modelo" quebra em 2 linhas no Comparar do celular (regra L4). Vira esboço.
- ACHADO: o comparador rolava só a janela; o catálogo rola dentro de #vscr e a peça dentro da camada — ele via só a 1ª tela delas. O `percorre` do mede.py resolve; entra na parte 2b.
- Falta (2b): o comparador e o Argus usarem a biblioteca (sai a COLETA de dentro do compara.py, o audita.js do fiscal, o olho.js); prova no Argus: mede_prova com 5 de 5.
