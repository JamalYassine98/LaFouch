# Estudo do Argus — 24/11/2026 (ESBOCO; só estudo, nada implementado)
Pedido do dono 15:34: estudar o Argus, ver tudo o que ele tem e as ferramentas do "Titan" que passam para ele, achar o repetido e o obsoleto, e encaixar os poderes novos.
Base aprovada 15:30: ARGUS = Agente de Revisão e Garantia Unificada de Sistemas — porteiro do SITE e do APP, um motor só, dois setores.
**Modos (dono 15:34): o APP tem claro e escuro; o SITE é só claro, com as temáticas.**

## 1. O que existe hoje (inventário)
**Argus do site (work/fiscal/)**: argus.py (o portão), provas.py (1.334 linhas: 1 visual+toque · 2 navegação · 3 uso de verdade · 4 conteúdo · 5 situações difíceis · 6 bug nunca volta · 7 · T tempo), fiscal.py (layout em 7+ aparelhos, letras, PT/ES), relatorio.py, selos.py (selos dos cartões), regras.py (regras do Firestore), csp.py (política de segurança), conhecidos.json, base_visual.json (5 itens), diferencas-aprovadas.txt (3 linhas).
**Usados pelo Argus do site**: work/s430/comparador/compara.py (publicado × o que vai subir; também o comparador Hoje × Proposta dos esboços), work/kit/mede.js + mede.py + mede_prova.py (medidor único + a prova dele).
**"Titan" do app (work/titan/)**: titan.py, compara.py (real × gabarito), familia.py + medir.py + prova_medidor.py (medidor de família), explorador.py + datas.sh (toca em tudo, voltar, cenários, datas), roteiro.py, indice.py, lado.py, triagem.py, molde_de_esboco.py, fichas/ (fichas à mão + roda.py + autoprova), novo/video_demo.py (protótipo com toques).
**Kit (work/kit/)**: sim.py (um simulador só), kit.py (esboços; inclui o "designer" revisa), base_app.py (gabarito do app), alin.js, centro.js, olho.js, sobre.js (medidores antigos), painel.py (painel web do site). work/s349/ap.py (abre o app com o gabarito por cima). work/s435/varredura/aprovados.py (segundo gabarito).
**Fora do work/**: tests/run.py (5.972 linhas — lógica do app: cupons, contas…), GitHub: teste-android (emulador), teste-celular e teste-site-celular (Test Lab), teste-site (aparelhos de verdade), teste-site-analise (17 aparelhos, letra 1× a 2×), teste-site-rede (internet fraca), teste-site-nuvem, teste-compra, vigia-nuvem, conferir-nuvem.

## 2. Repetido (a mesma função feita mais de uma vez → fica UMA no motor)
| Função | Hoje (cópias) | No Argus novo |
|---|---|---|
| Comparar | s430/compara.py · titan/compara.py · fichas/roda.py | 1 comparador: app × PLANTA (peças e toques) |
| Medir a tela | mede.js · titan/familia.py · alin.js · centro.js · olho.js · sobre.js · kit "revisa" | 1 medidor de família (regras 14–17) |
| Achar as telas | titan/explorador · roteiro · indice · provas parte 2 (navegação do site) | 1 explorador (toca em tudo, voltar, nunca toca em "perigo") |
| Provar o conferidor | mede_prova.py · prova_medidor.py · fichas --prova | 1 autoprova (estraga uma cópia da planta, de cada família) |
| Relatório | fiscal/relatorio.py · titan/relatorio · lado.py | 1 relatório (foto por tela com o erro marcado + vídeo do toque que falhou) |
| Abrir o app | s349/ap.py · sim.py | só sim.py |
| Tempo / lentidão | provas parte T · teste-site-rede · explorador (cheio) | 1 medida de tempo por toque, com cenário de loja cheia |

## 3. Obsoleto ou com defeito (vai para work/obsoletos na troca)
- **Gabaritos** base_app.py e aprovados.py, e ap.py com o gabarito por cima → substituídos pela planta (causa do "deu certo" com erro na tela).
- **conhecidos.json** — falha conhecida não bloqueia = o porteiro aceita erro. Sai: ou está na planta aprovada, ou trava.
- **base_visual.json** — só acusa o que é NOVO em relação à linha de base = aceita o erro antigo (mesmo defeito do gabarito).
- **diferencas-aprovadas.txt** — aprovação por trecho de texto → vira "mudança sem planta aprovada trava".
- **Comparar com o publicado** (s430 no Argus) → compara com a planta aprovada.
- **indice, lado, triagem, molde_de_esboco, fichas à mão, roteiro, titan.py** — ferramentas de transição de hoje.
- **alin/centro/olho/sobre.js e o "revisa"** — entram no medidor único.

## 4. Fica (bom; vai para o motor ou para o setor)
- sim.py (base de tudo) · explorador (lista PERIGO, cenários, datas da loja, voltar) · emulador Android e Test Lab (cota grátis) · provas do site partes 1, 3, 4, 5, 6 (uso de verdade, conteúdo, situações difíceis: 4G fraco, sem internet, segundo plano, girar; e "bug nunca volta") · selos.py (setor Site) · o protótipo do vídeo (toques).

## 5. Fora do Argus (tem outro dono) — o Argus só CHAMA como etapa da porta
- regras.py e csp.py = segurança → sessão NUVEM (dono decide: ficam como etapa do Argus ou saem).
- tests/run.py = lógica do app (APP mantém; o Argus roda como etapa da porta do app).
- vigia-nuvem, conferir-nuvem, teste-compra, teste-site-nuvem = nuvem → NUVEM.
- painel.py = painel web do site, sai quando o admin sair.
- kit.py = ferramenta de ESBOÇO; passa a GRAVAR a planta, e o "Hoje × Proposta" dos esboços usa o MESMO comparador do motor.

## 6. Poderes novos × o que já existe (nada em dobro)
| Poder | De onde vem | Novo? |
|---|---|---|
| Planta + comparador peça por peça | substitui gabaritos, fichas e os 3 comparadores | novo motor |
| Toques (⌄ abre ali, › sai, janela de baixo, voltar ao mesmo ponto, vários toques) | explorador + vídeo | junta |
| Autoprova | junta as 3 provas | junta |
| 1 Mudança sem aprovação trava | substitui diferencas-aprovadas | novo |
| 2 Modos — APP: claro e escuro, 3 letras, celular/tablet/PC até 2560, biometria · SITE: só claro + cada temática, PT e ES, letra até 1,2×, celular/tablet/PC até 2560 | fiscal.py + teste-site-analise | junta |
| 3 Estados (carregando, erro, sem internet, salvo, vazio) | provas parte 5 (site) → vale para o app também | estende |
| 4 Movimento (uma curva, um tempo, "reduzir movimento") | — | novo |
| 5 Lentidão com loja cheia | parte T + rede + explorador | junta |
| 6 Código morto (o que nunca roda / o que roda sem planta) | — | novo |
| 7 Família inteira (inventário 1 = inventário 2) | medidor de família | junta |
| 8 Prova permanente de cada erro | provas parte 6 (só site) → app também | estende |
| 9 Relatório com foto e vídeo | relatorio.py + vídeo | junta |

## 7. Forma do Argus novo (pasta nova work/argus/, feito do zero)
motor/ (abrir, planta, comparador, medidor de família, explorador e toques, cenários e dados, tempo, cobertura, autoprova, relatório) · setor_app/ (modos do app, janelas de baixo, biometria, emulador) · setor_site/ (claro + temáticas, PT/ES, letra 1,2×, carrinho, cupons, selos, rede fraca) · plantas/app, plantas/site · provas/app, provas/site · um comando: `argus app` / `argus site`. Cada setor tem a sua trava.

## 7b. Respostas do dono (24/11 15:40) e separação por setor
Respostas: 2) site = letra do Android 1×, 1,1× e 1,2× (as três, sempre; máximo 1,2×) · 3) sim, conferir PT e ES · 4) sim, tests/run.py vira etapa da porta do setor App.
**Regra de ouro da separação:** o motor só tem o que vale para os dois (regras 12–17 do CLAUDE.md). O que é de um lado mora só no setor dele — nunca uma regra do app rodando no site, nem o contrário.
| Onde | Regras |
|---|---|
| MOTOR (os dois) | planta e comparador; toques (⌄ abre ali, › sai, janela de baixo com Salvar, fecha arrastando/tocando fora/Esc, "Sair sem salvar?", voltar ao mesmo ponto, vários toques); L1–L4 e espaços 8/16/24/32/48; linha ≥ 44 px; mesma função = mesmo botão; mesmo verbo, números (G$ 25.000 · US$ 3,79 · 18/11), cores de sentido, uma curva e um tempo; estados iguais em todo lugar; família inteira; mudança sem planta trava; prova permanente; código morto; tempo; celular, tablet e PC até 2560; autoprova; relatório |
| SETOR APP | claro E escuro · as 3 letras do app (1×, 1,15×, 1,3×) · com e sem biometria · emulador Android · etapas da porta: tests/run.py, lafouch-vNNN no sw.js com novidades.json, "OK ESBOCO" |
| SETOR SITE | só claro · TODAS as temáticas · letra do Android 1×, 1,1×, 1,2× · PT e ES · logado e deslogado · cupons (tentando burlar) · carrinho · selos · internet fraca · etapas da porta: segurança (regras e CSP, se o dono mantiver), version.json, build |

## 7c. Cada poder novo é a MELHORIA de uma ferramenta antiga (a antiga sai no mesmo passo)
| Poder | Melhora qual ferramenta | O que a antiga fazia mal | O que passa a fazer | Sai |
|---|---|---|---|---|
| Planta + comparador | os 3 comparadores | comparava com o gabarito ou com o publicado (aceitava erro) | compara com o aprovado | s430 (no papel de porteiro), titan/compara, fichas |
| Toques | explorador | tocava só para achar telas e testar o voltar | confere se cada toque faz o que a planta liga | roteiro, índice |
| 1 Mudança sem aprovação | diferencas-aprovadas.txt | aprovava por trecho de texto | tela mudada sem planta nova trava | o .txt |
| 2 Modos | fiscal.py + teste-site-analise | site medido com letra até 2× e sem temáticas inteiras; app sem as 3 letras em tudo | cada setor roda os modos dele | as listas de aparelhos repetidas |
| 3 Estados | provas parte 5 (site) | só no site, só alguns estados | carregando/erro/sem internet/salvo/vazio nos dois, pela planta | parte 5 vira do motor |
| 4 Movimento | medidor de família | não media movimento (regra 17 sem prova) | mede curva e tempo, e o "reduzir movimento" | — (o medidor ganha a regra) |
| 5 Lentidão | parte T + teste-site-rede + explorador cheio | três medidas soltas | uma medida por toque, com loja cheia e internet fraca | as três |
| 6 Código morto | explorador | tocava em tudo sem anotar o que rodava | anota o que nunca roda e o que roda sem planta | — (o explorador ganha a regra) |
| 7 Família inteira | medidor de família | 7 medidores diferentes | um só, com inventário 1 = inventário 2 | mede.js, alin, centro, olho, sobre, revisa |
| 8 Prova permanente | provas parte 6 (site) | só no site | todo erro pego vira prova, nos dois | — (a parte 6 vira do motor) |
| 9 Relatório | relatorio.py + lado.py | só lista ou foto solta | foto com o erro marcado + vídeo do toque | os dois |
| Autoprova | mede_prova, prova_medidor, fichas --prova | três provas soltas, só do medidor | estraga cópia da planta, de cada família, toda rodada | as três |

## 8. Perguntas para o dono
1. Segurança (regras do Firestore e CSP): continua como etapa da porta do Argus ou vai inteira para a NUVEM? (explicado ao dono 24/11 15:4x; espera resposta)
2. O teste-site-analise mede letra de 1× a 2×; a regra 18 diz até 1,2×. Qual vale?
3. O Argus conferir também o espanhol do site (PT e ES)?
4. tests/run.py (lógica do app) entra como etapa da porta do Argus · setor App?

## 9. O que ainda falta para o Argus ficar completo (elaboração 24/11 15:47 — só estudo)
1. **Mapa de cobertura:** toda tela, dobra, janela e estado tem de ter planta; o explorador lista o que existe e "tela sem planta" nunca passa.
2. **Loja de teste fixa:** dados sempre iguais (peças, vendas, clientes) e relógio parado; cenários: normal, vazio, cheio (dia de evento), sem internet, datas da loja, logado/deslogado, atacadista, com/sem biometria (app), cada temática (site).
3. **Ruído:** o que muda sozinho (relógio, sorteio, animação) é reconhecido abrindo a tela duas vezes (ideia do comparador s430), sem lista de exceções.
4. **Medida exata por família:** quanto é "diferente" (posição ±1 px, cor pelo token oficial, letra exata) — escrito uma vez, no motor.
5. **Gestos:** arrastar a janela para fechar, rolar com o dedo, teclado subindo (hoje só no site, parte 1) → motor.
6. **Aparelho real:** a cada publicação, o emulador Android do GitHub fotografa as telas mexidas e o Argus compara com a planta (fontes do Android); Test Lab só na cota grátis.
7. **Não dá para pular:** o Argus grava um selo com o número do commit; o publicar do app e do site recusa sem selo do mesmo commit.
8. **Plantas protegidas:** planta só muda por esboço aprovado (linha na lista viva); commit da APP/SITE que mexe em planta trava.
9. **Prova do próprio Argus com o app antigo:** uma versão antiga com erros conhecidos (ex.: v641) tem de falhar nos mesmos erros, toda rodada (além do estrago planejado).
10. **Textos:** mesmo verbo para a mesma ação, termos aprovados, nenhum PT no ES (site parte 4) → motor + setor Site.
11. **Ponte app × site:** o mesmo produto com o mesmo preço, estoque e foto nos dois.
12. **Segurança (provas da NUVEM, testadas de verdade no emulador da nuvem):** tentativas proibidas têm de ser barradas; na dúvida trava.
13. **Tempo do Argus:** rodada rápida (só o mexido + autoprova) a cada passo da implementadora; rodada completa antes de publicar, com limite de tempo.
14. **Resultado no status:** o resultado entra sozinho no docs/STATUS.md (tools/status.py) e a ESBOCO recebe as fotos para o "OK ESBOCO".
15. **Fora do alcance (dito no relatório, nunca "passou"):** câmera do Estúdio, APK/Windows, e-mails — o que o simulador não abre aparece como "não conferido".
