# Plano do Argus novo — em partes (ESBOCO, 24/11/2026 15:58 · espera o dono)
Base: aprovado 15:30 (SEMP · TITAN · ARGUS) e o estudo work/argus/ESTUDO-ARGUS.md (respostas do dono 15:40–15:44).
Regras de cada parte: pasta nova work/argus/, nada copiado de código velho · a pergunta "isto é remendo?" antes de mandar ·
cada parte termina com a autoprova (estrago) passando e com o dono vendo o resultado · a ferramenta velha que a parte substitui
vai para work/obsoletos NO MESMO PASSO · o que não dá para conferir aparece "não conferido", nunca "passou".
Ordem: primeiro o App (prioridade do dono), depois o Site.

## Parte 0 · Chão firme
- Uma porta só para abrir site e app: work/kit/sim.py.
- Aparelhos: faixa por lógica (320 → 2560, celular/tablet/PC, deitado) + o celular do dono (work/argus/aparelho_dono.json) como mais um.
- Loja de teste fixa (peças, vendas, clientes) e relógio parado; cenários: normal, vazio, cheio (dia de evento), sem internet, datas da loja, logado/deslogado, atacadista, biometria (app), cada temática (site).
- Prova: a mesma tela aberta duas vezes sai igual (o que mudar sozinho é ruído, reconhecido sem lista).

## Parte 1 · A planta
- O esboço passa a ser montado numa cópia do app (pasta só de esboço, nunca src/), com as peças de família; esboço com estilo escrito na hora não vira planta.
- Ao aprovar, a planta é gravada: a tela inteira por dentro (o que aparece: texto, caixa, cor, letra, desenho do ícone), as dobras, os dois temas no app, os dados usados, o caminho e o nome da tela, e as ligações de cada botão.
- Ajuste aprovado → planta nova; a anterior vai para work/obsoletos. Planta só muda com linha de aprovação na lista viva.
- Prova: 3 telas (Preços › Regras, Fornecedores, Início) com planta gravada e reaberta igual.

## Parte 2 · O comparador
- Compara o app com a planta, peça por peça, pelo que aparece na tela (não pelo nome do código), com a medida exata escrita uma vez (±1 px, cor oficial, letra).
- Autoprova: toda rodada estraga uma cópia da planta, um defeito de cada família; se não pegar todos, a rodada não vale.
- Sai: titan/compara.py, fichas/, indice.py, lado.py, triagem.py, molde_de_esboco.py.

## Parte 3 · Toques, explorador e cobertura
- Toca em cada botão de cada planta e confere a ligação: ⌄ abre ali, › sai para a tela certa, janela de baixo com Salvar (fecha arrastando, tocando fora, Esc; "Sair sem salvar?"), voltar ao mesmo ponto, vários toques seguidos; gestos (arrastar, rolar com o dedo, teclado subindo). Nunca toca em botão de perigo.
- Mapa de cobertura: toda tela, dobra, janela e estado precisa de planta; "sem planta" nunca passa.
- Código morto: anota o que nunca roda e o que roda sem estar na planta (vai ao dono com foto).
- Mudança sem aprovação: tela diferente sem planta nova trava.
- Sai: roteiro.py, explorador velho, titan.py.

## Parte 4 · O medidor de família (um só)
- Regras 13–17 numa medida só: L1–L4, espaços 8/16/24/32/48, linha ≥ 44 px, mesma função = mesmo botão, telas e links, verbos, números, cores de sentido, uma curva e um tempo (movimento e "reduzir movimento"), estados (carregando, erro, sem internet, salvo, vazio), textos; família inteira (inventário 1 = inventário 2).
- Prova permanente: cada erro pego vira prova fixa.
- Sai: mede.js, mede.py, mede_prova.py, familia.py, medir.py, prova_medidor.py, alin.js, centro.js, olho.js, sobre.js, o "revisa" do kit.

## Parte 5 · Setor App (a porta do app)
- Modos do app: claro E escuro · as 3 letras do app (1×, 1,15×, 1,3×) · com e sem biometria · a faixa de aparelhos + o Xiaomi 13T.
- Emulador Android do GitHub a cada publicação: fotografa as telas mexidas (com as barras de cima e de baixo do APK) e compara com a planta.
- Etapas da porta: tests/run.py (lógica) · provas de segurança da NUVEM (só roda) · lentidão com loja cheia · prova com uma versão antiga do app (tem de falhar nos erros conhecidos).
- Selo: o Argus grava um selo com o número do commit; o publicar do app recusa sem ele. Commit da APP que mexe em planta trava.
- Sai: work/kit/base_app.py, work/s435/varredura/aprovados.py, work/s349/ap.py (o gabarito por cima), o resto de work/titan/.

## Parte 6 · Plantas do app (em lotes)
- Um esboço consolidado por tela (com todos os aprovados dela), montado na cópia do app; o dono aprova em lote, de manhã (regra 3b); cada um vira a planta.
- Enquanto uma tela não tem planta aprovada, o Argus mostra "sem planta" para ela.

## Parte 7 · Setor Site (a porta do site)
- Modos do site: só claro + TODAS as temáticas · letra do Android 1×, 1,1×, 1,2× · PT e ES · logado e deslogado · cupons (tentando burlar) · carrinho · selos · internet fraca.
- Segurança de verdade: as provas da NUVEM rodando no emulador da nuvem (tentativas proibidas têm de ser barradas; na dúvida, trava).
- Selo no build do site. Plantas do site em lotes, como na Parte 6.
- Sai: work/fiscal/argus.py, fiscal.py, conhecidos.json, base_visual.json, diferencas-aprovadas.txt, o s430 no papel de porteiro (o Hoje × Proposta dos esboços passa a usar o comparador do motor).

## Parte 8 · Entrega
- Relatório: uma foto por tela com o erro marcado + vídeo do toque que falhou; resultado entra sozinho no docs/STATUS.md; a ESBOCO recebe as fotos para o "OK ESBOCO".
- Ponte app × site: o mesmo produto com o mesmo preço, estoque e foto.
- Rodada rápida (só o mexido + autoprova) a cada passo da implementadora; rodada completa antes de publicar, com limite de tempo.
- CLAUDE.md: regras 20 e 21 passam a citar o Argus novo e o selo (texto para o dono aprovar, reescrito no lugar, sem emenda).
