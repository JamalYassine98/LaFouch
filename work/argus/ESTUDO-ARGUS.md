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

## 8. Perguntas para o dono
1. Segurança (regras do Firestore e CSP): continua como etapa da porta do Argus ou vai inteira para a NUVEM?
2. O teste-site-analise mede letra de 1× a 2×; a regra 18 diz até 1,2×. Qual vale?
3. O Argus conferir também o espanhol do site (PT e ES)?
4. tests/run.py (lógica do app) entra como etapa da porta do Argus · setor App?
