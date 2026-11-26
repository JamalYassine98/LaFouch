# Regras do projeto LaFouch (reorganizadas e aprovadas pelo dono em 19/11/2026 12:02; as antigas estão em work/obsoletos/CLAUDE-antigo-19-11.md)

Ordem: como trabalhar → decidir → esboçar → código → design → testar → publicar → segurança.
Detalhes e histórico ficam em docs/MEMORIA-PROJETO.md; aqui só a regra viva, curta.

## 1. Como trabalhar
1. **Várias sessões (status automático, aprovado 19/11 23:28):** no começo de CADA pedido do dono, rodar `python3 tools/status.py ler <SESSÃO>` (APP · SITE · NUVEM · ESBOCO) e fazer os recados para você; antes de mexer, `python3 tools/status.py comeco <SESSÃO> "assunto" arquivo…` (para se outra sessão marcou o arquivo); ao terminar, `python3 tools/status.py fim <SESSÃO> "o que fez"` (barrado se há recado não lido); item da Fila: `fila`; recado: `recado <DE> <PARA> "texto"`; recado feito: `lido`. O comando puxa o mais novo, envia e monta o docs/STATUS.md sozinho — NUNCA editar o STATUS.md à mão; o dono não precisa pedir "atualizar status".
2. **Ler antes, sempre:** antes de QUALQUER passo, em toda sessão, reler este CLAUDE.md e conferir o passo contra as regras (dono 24/11). Depois: docs/MEMORIA-PROJETO.md e docs/FALTA-APROVAR-15-11.md (lista viva). App: docs/APP-MAPA.md, APP-BOTOES.md, APP-COMO-FUNCIONA.md. Site: docs/SITE-COMO-FUNCIONA.md e ATLAS-SITE.md. Atualizar o doc da área no mesmo commit da mudança.
1b. **Papéis (19/11 13:20, aprovado pelo dono):** UMA sessão implementa e publica o APP (hoje: S436), UMA o SITE (hoje: S429) e UMA a NUVEM — functions/ e firestore.rules, segurança (hoje: "NUVEM · implementa", aprovado 19/11 14:28); as outras só fazem esboço, estudo e conferência — nunca mexem em src/, www/, catalogo, functions/ nem firestore.rules. Cada "implementar" do dono entra na **Fila de implementação** do docs/STATUS.md; a implementadora faz um item por vez (implementar → testar → publicar → marcar feito com a versão). Código por família: cada família ganha arquivo próprio em src/ e bloco próprio no CSS, e o código velho dela sai no mesmo passo. **Antes** de cada publicação, uma sessão de esboço (app: ESBOCO) confere as telas mexidas — fotos × esboço aprovado — e a implementadora só publica com o recado "OK ESBOCO" (dono 24/11).
3b. **Aprovação em lote (aprovado 20/11 08:21):** esboço pronto vai para a Fila do status com o estado "esboço pronto — esperando o dono"; o dono olha todos de uma vez (de manhã) e responde em lote. Enquanto espera, a sessão segue no próximo item dela, sem parar.
3c. **Uma ordem por sessão (aprovado 20/11 08:21):** cada implementadora faz os itens dela na ordem da Fila, um até o fim antes do próximo, sem pular. SITE hoje: item 09 → item 20 (App Check) → faixa do evento → plano das ferramentas.
3. **Em partes:** todo trabalho grande vai em partes bem estruturadas, consultando o dono a cada parte ("implementar tudo" também).
4. **Respostas:** português, no máximo 8 linhas (mais só se o dono pedir "detalhe"): o que fez · o que ele precisa decidir · próximo passo. Comandos e endereços em blocos de código, um por bloco. Sempre dizer o que foi testado no simulador e o que NÃO foi testado em aparelho real.

## 2. Como decidir
5. **Esboço primeiro**, sempre (inclusive conserto de bug).
6. **Palavras do dono:** ESBOÇO, APROVADO, IMPLEMENTAR, PUBLICAR, PARAR. **"Aprovado"** = só guardar (memória + lista viva + base do esboço). **"Implementar"** = fazer EXATAMENTE o esboço aprovado, nada a mais. Na dúvida se pode implementar: não implementar e perguntar.
6b. **Conserto "por dentro" (aprovado 20/11 08:21):** o que NÃO muda nenhuma tela (segurança, nuvem, erro de lógica) segue do esboço para a implementação sem esperar o "implementar", se passar em todos os testes e na regra 12; o dono confere depois pelo status. Tela, botão, texto ou visual que muda continua esperando o "implementar". Publicar continua igual (regras 20/21; nuvem: o dono ou a automação aprovada).
7. **Só a última versão:** ajuste de um aprovado substitui o anterior; recusados e superados vão para work/obsoletos/.
8. **Lista viva:** só acrescentar e marcar o publicado (com a versão); limpar só quando o dono disser "limpar a lista".
9. **Enviar o que já existe:** se o esboço/arquivo já está guardado, mandar na hora.

## 3. Esboços
10. **Base:** site/app REAL (peças e cartão da nuvem, acesso direto; Actions só de reserva) + TODOS os aprovados, mesmo não implementados. Listar no envio os aprovados incluídos. Proibido produto de exemplo.
11. **Formato:** um arquivo por tela (celular Hoje × Proposta lado a lado; PC um em cima do outro); sem GIF (quadros lado a lado ou MP4). Usar o kit e as telas reais; todo esboço passa pelo **comparador Hoje × Proposta** (aprovado 20/11 00:07): ele lista toda diferença, em todos os aparelhos, e cada diferença precisa estar no esboço — diferença sem motivo é falha nova e o esboço não vai ao dono. Todo esboço vai à implementadora com o "como fazer" no jeito natural (regra 12) (dono 20/11 15:15).

## 4. Código limpo: lógica, nunca remendo (completada pelo dono 19/11 19:53)
12. **Toda correção ou ajuste é feito NOVO, como lógica — nunca emenda nem remendo** (dono 24/11: o alinhamento quebrou por emendar)**:**
    a) **Causa:** achar a raiz do erro, não só o lugar onde ele aparece.
    b) **Jeito natural:** fazer como seria se tivesse sido feito certo desde o começo (ex.: o Mochi aponta para a esquerda levantando o braço esquerdo, não espelhando o desenho).
    c) **Um lugar só, vale para tudo:** a regra fica num ponto e serve para todas as telas e famílias (ex.: uma só medida do topo para todas as telas que abrem por cima; uma só ordem de camadas para faixa, topo, menu e janelas).
    d) **Apaga o que substitui** no mesmo passo (botão vira redondo → sai a regra que o deixava quadrado). Correção que só acrescenta código é remendo: volta para (b). Não apagar função preparada que ainda não foi ligada. **Código morto se procura com o site/app RODANDO, não só lendo o texto** (dono 20/11 12:37): abrir cada tela, tocar em tudo e cruzar o que aparece e o que é executado com a planta aprovada — o que nunca roda é morto; o que roda e não está na planta é suspeito e vai ao dono com imagem, para ele dizer "sai" ou "fica".
    e) **Trava:** cada erro corrigido ganha uma prova no **Argus** (o conferidor que roda antes de publicar, em work/argus; antes chamado "porteiro" — nome do dono, 22/11), para não voltar em nenhuma tela.
    **Antes de propor qualquer solução, perguntar-se: "o que eu estou propondo é remendo?"** (dono 20/11 11:04) — se for (não passa em a–e, ou depende de sorte), refazer; só o que não é remendo vai ao dono.
13. **Família inteira:** mudar um botão = mudar a família toda, com a regra num lugar só (inventário 1 = app atual, inventário 2 = aprovados; só publica com os dois iguais).

## 5. Design de luxo (site e app, todos os aparelhos; app claro e escuro)
14. **Alinhamento limpo (19/11):** L1 duas margens e um eixo por bloco · L2 mesma linha: texto pela linha de base, texto×ícone pelo centro · L3 espaços só 8/16/24/32/48 e a mesma coisa com o mesmo espaço em todas as telas · L4 cabe: texto nunca quebra nem sai; se não couber, a letra do grupo diminui (uma função só). O programa confere: desenho visível, 1 px, números de mesma largura, linha ≥ 44 px.
15. **Mesma função = mesmo botão:** + redondo ao lado do título para adicionar · criar/editar sempre na janela de baixo com um "Salvar" (sem × nem "Fechar"; fecha arrastando, tocando fora ou Esc; se mudou, pergunta "Sair sem salvar?") · confirmação mantém "Voltar" embaixo do botão vermelho · campos em linhas finas · 2–3 opções = escolha de dois lados · tela vazia = ícone + frase + explicação.
16. **Telas e links:** um título por tela (etapa = tela própria com "‹ etapa anterior") · "›" sai daqui, "⌄" abre no lugar · "+" em texto branco, sem sublinhado. **Três tipos (dono 20/11 12:43):** ler = linha com ⌄ (abre ali, detalhe curto da mesma coisa) · lugar = linha com › (outra tela com título e "‹ voltar": assunto com ações próprias ou lista longa, setor ou outra família) · tarefa = janela de baixo (começo e fim: criar, editar, escolher, confirmar; fecha arrastando/tocando fora e volta ao mesmo ponto).
17. **Movimento, palavras, números, cores, letra, ícones, estados:** uma curva e um tempo para tudo (respeitar "reduzir movimento") · mesmo verbo para a mesma ação · G$ 25.000 / US$ 3,79 / 18/11 · verde certo, vermelho perigo, amarelo atenção, rosa/vinho ação · poucos tamanhos de letra e um conjunto de ícones · carregando/erro/sem internet/salvo iguais em todo lugar.

## 6. Testar
18. **Tudo, com calma, antes de mandar ou publicar:** cada tela mexida aberta e fechada, cada botão tocado várias vezes, cada cupom (inclusive tentar burlar), logado/deslogado, celular/tablet/PC até 2560. Site: todas as temáticas, letra do celular até 1,2×. App: claro e escuro, as 3 letras, com e sem biometria. O programa mede, e quem fez **olha a foto** de cada tela mexida (claro e escuro, as 3 letras, dobras abertas, textos compridos) e a **compara lado a lado com o esboço aprovado**; diferença sem motivo trava a publicação (dono 24/11).
19. **Aparelho real:** Firebase Test Lab só dentro dos 30 min grátis por dia (rodada de no máximo 25 min); o que não couber fica para o dia seguinte e é avisado.

## 7. Publicar
20. **Site (Argus novo, dono 26/11):** atualizar SITE-COMO-FUNCIONA → versão (`date +%s` no version.json e no index.html) → commit do catalogo (sem push) → `python3 work/argus/setor_site/porta.py completa` até **SELO DADO** (~30 min: conferências do site, plantas aprovadas em todas as temáticas/letras/línguas, toques, medidor, mapa, nuvem no emulador do Firebase) → `python3 work/argus/motor/selo.py site` ok → push do catalogo → `node build.js` aqui e subir www/loja/. A cada passo da implementação: `porta.py rapida`.
21. **App (Argus novo, dono 26/11):** subir lafouch-vNNN no www/sw.js JUNTO com docs/novidades.json → commit (sem push) → `python3 work/argus/setor_app/porta.py completa` até **SELO DADO** (inclui tests/run.py, as plantas aprovadas, o Android emulado e a nuvem) → `python3 work/argus/motor/selo.py app` ok → fotos comparadas e "OK ESBOCO" (1b) → push em main. A cada passo da implementação: `porta.py rapida`. O selo vale para UM commit: nada muda depois dele. APK e Windows só quando o dono pedir:
    `gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/build-apk.yml/dispatches -f ref=main` (Windows: build-windows.yml).

## 8. Segurança e gastos
22. Senhas e chaves nunca no site nem no projeto: só segredos do servidor/GitHub. Nunca pedir senha.
23. Sem gasto sem o dono autorizar: ElevenLabs (nem teste), chave de IA paga, rodada agendada.
