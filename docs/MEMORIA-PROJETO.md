# Memória do projeto LaFouch (decisões do dono, Jamal)

Este arquivo é lido no início de cada sessão (CLAUDE.md aponta para ele). Atualizar a cada decisão nova.

## Regras de trabalho
- Fidelidade visual: o app deve ficar EXATAMENTE como as imagens/vídeos aprovados. Referência única das telas de cadastro: as 10 folhas `p_1..p_10.png` (geradas por `/tmp/ad/nv2/gen.js`; se sumirem, ver `docs/`). Sempre comparar print real do app com a imagem antes de mostrar.
- Ideias novas: só mostrar imagens; implementar quando o dono avisar ("Perfeito, pode implementar", "Pode implementar tudo").
- Cada release: testes (`python3 tests/run.py`) → sw.js (lafouch-vNNN) → commit/push main. NÃO gerar APK nem Windows (ordem do dono em 27/10/2026, para economizar tokens), só se ele pedir.
- Dono escreve em português; respostas curtas, sem jargão.

## Decisões de cadastro (aprovadas, v328–v332)
- Pré-graduado = modelo + cor + grau; mesmo grau pode vir em cores diferentes; um pacote pode gerar várias linhas.
- Foto da cor OBRIGATÓRIA e trava a entrada; sem ícone "Sem foto" (Início mostra "N modelos sem foto" + "Completar fotos").
- O app lê quantidade da etiqueta ("24 pc"), grau e código quando legíveis; senão o dono digita. Lembra a cor do mesmo pacote ("como da última vez").
- Semelhança por foto: mostrar só ≥80%; abaixo disso "Não achei parecido". Sempre o dono confirma.
- Foto de UMA peça vira foto da cor; foto de pacote/etiqueta/caixa só é lida e descartada. Memória do modelo (cor habitual, graus) fica dentro do modelo (`S.memo`) e some ao excluir o produto.
- Botão: "Foto da etiqueta, da caixa ou do pacote".
- Chegou mercadoria: Foto da nota / Preencher à mão → Nota lida (total = soma das linhas) → Entrada da compra com barra por linha (Ler haste / Foto / À mão ou Detalhar depois).

## Pendências conhecidas
- Oferta (piso/trava): v319 já tem oferta no Inventário com piso/trava e data final. O dono diz que aprovou propostas de Oferta; o histórico anterior ao resumo não permite confirmar qual. Pedir a imagem aprovada antes de mexer.
- Etapa 3 incompleta: tela de detalhar uma linha da compra (tipo/custo da linha, qtd ≤ faltam) e lembrete no Início de peças sem detalhe.
- Notificações push; "grau não identificado"; OCR de etiqueta de grau; confirm() ao desligar o site; páginas de rodapé/privacidade; keystore fixa do APK; regras do Firestore.

## Histórico de versões
Ver `git log` (v300 → v332). Resumos de cada versão estão nas mensagens de commit.

## Falas do dono (literais, as que definem regras)
- "você ficava fazendo diferente toda vez" / "me mostre EXATAMENTE, como ficaria" → fidelidade total às imagens aprovadas.
- "analise COM EXTREMA calma para não errar de novo".
- "Vamos elaborar ainda mais antes de implementar" / "só implementar quando eu avisar".
- "Perfeito, pode implementar" (10 folhas de cadastro) e "Pode implementar tudo" (27/10/2026, 12:47).
- "Eu não aprovei as proposta de oferta?" (27/10/2026, 13:12): ele afirma que aprovou propostas de Oferta; reenviar imagem para confirmar qual.
- "Melhor a exigência da foto, pq a idéia é o catalogo ser completo".
- "A foto trava a entrada ... remova esse icone de sem foto, pq não faz sentido".
- "eu não quero que guarde a foto do pacote ... se eu excluir um produto ele exclui essas informações".
- "Se não da pra ler o grau significa que eu tenho que inserir manualmente, não tem problema".
- "Pode ser abaixo dos 20% quando tem uma discrepância muito grande, mas priorizar a semelhança acima de 80%".
- "cada grau pode ser da mesma cor ou ter cores diferentes".
- Quer ter os dois sistemas: leitura da haste e cadastro por foto (óculos de grau quase nunca têm informação na haste).
- Outras decisões antigas: remover fundo branco automático da foto (foto entra como foi tirada); projeto de 5 imagens aprovado (v328); não voltar o app para a versão antiga.

## Aviso
O histórico bruto anterior a 27/10/2026 foi condensado pelo sistema e não é mais legível. Este arquivo e o git log são a memória durável. Se uma decisão do dono não estiver aqui, pedir a ele a imagem/mensagem em vez de supor.

## Pedidos de 27/10/2026 13:32
- Formato/Material/Gênero/Tipo: trocar chips por seletor estilo 'Label Select' (campo com lupa + seta, lista abaixo); o botão Formato não respondia ao clique. Resolver toda interação parecida.
- Vendas: filtros Todos…Pré-graduados dentro de um filtro chamado 'Produto', alinhado.
- Aba Site: ao abrir um produto, permitir ir ao Inventário (ex.: modelo sem foto).
- Backup: fotos se perdem ao importar (ex.: Solar aviador rosa). Corrigir.

## Feito em 27/10/2026 (v333)
- Seletor Label Select nos campos Tipo/Formato/Material/Gênero do Novo modelo (Formato não abria em modelo existente: corrigido).
- Vendas: chips de tipo e graus agora ficam no filtro 'Produto' (botão de filtro).
- Painel do site (repo catalogo, admin.html): botão 'Abrir no Inventário' no produto; o app trata a mensagem lfAbrir.
- Backup: importar não apaga mais as fotos que já estão no aparelho (antes o import substituía S.fotos e saveFotos apagava o resto do IndexedDB).

## v334 (27/10/2026 14:06)
- Classe de cor lida da haste (ex.: C4) não volta mais para C1 (sobra de NVC.vr de cadastro anterior; fillAdd e Preencher à mão agora zeram).
- Câmera (haste e fotos): sem zoom nativo, aparece slider de zoom digital.
- 'Tirar a foto' / 'Fotografar' / 'Foto da cor' abrem a câmera do app (não a galeria); ícone novo (SVG) no lugar do emoji.
- Todos os botões têm animação ao apertar (scale + brilho).
- Busca do seletor sem borda amarela/rosa.

## Pedidos de 27/10/2026 15:55 (v335)
- Editar produto: lixeira (excluir produto) à esquerda do X, alinhada; 'Trocar foto' deve usar a câmera do app.
- Alinhar ícone do botão 'Foto tirada · trocar'.
- Câmera: apertar o obturador uma vez só (antes precisava duas); animação do obturador encaixando na miniatura ao adicionar foto.
- Tirar foto da peça demora: mostrar carregando e travar a tela (não deixar fechar) até terminar.
- Descartar rascunho: botão minimalista, alinhado abaixo de 'Continuar rascunho'.
- Código da haste digitado à mão: sugestões filtradas por tipo/formato/gênero escolhidos.
- Entrada rápida → 'Cor nova para este modelo' deve levar direto para Cores e fotos.
- Classe de cor lida (C7/C8 existem) deve aparecer em Cores e fotos (chips só iam até C6).
- EDITAR PRODUTO REDESENHO: o dono quer SÓ FOTOS (mockups) de como ficaria, sem perder nenhuma informação, fluxo separado e menos poluído (pode reaproveitar a tela de adicionar para editar/excluir). Implementar só depois que ele confirmar.

## v335 (27/10/2026) — pedidos das 15:55
Implementado: lixeira + confirmação no Editar produto; "Trocar foto" com câmera; câmera com 1 toque; obturador ao adicionar foto; carregamento bloqueia a tela; "Descartar rascunho" minimalista; sugestões do código filtradas por Tipo/Formato/Gênero; "Cor nova deste modelo" vai direto a Cores e fotos; chips de classe C até a última (C8+).
PENDENTE: redesenho do Editar produto — só mockups; implementar apenas depois que o dono confirmar.
- Mockups do novo Editar produto enviados (27/10): 4 etapas (1 Modelo: nome/código/nome automático/identificação · 2 Cores e fotos: trocar/excluir foto, qtd, custo, excluir cor, cor nova · 3 Site: liberar, descrição + sugerida, faixa · 4 Baixa: peça quebrada + excluir produto), lixeira no topo com confirmação. AGUARDANDO confirmação do dono para implementar.

## Oferta (27/10/2026, 16:10) — APROVADA pelo dono (vídeo "PROPOSTA · NÃO IMPLEMENTADO")
Tela Oferta: Preço normal, campo "Preço da oferta" (digitado), "Desconto de X%", cartão de situação (Acima do piso/Na margem: lucro por peça = preço − trava; Atenção abaixo do piso; Prejuízo abaixo da trava com botão "Ajustar para preço seguro" = piso), "Confirmar oferta" → "Em oferta no app e no site". Implementado em v336 (src/55-produtos-catalogo.js ofertaCard). Os chips −10/−15/−20/−30% foram removidos. Mantidos: data final opcional e Encerrar oferta.

## Pedidos 17:12 (27/10/2026) — SÓ MOCKUPS, aguardando confirmação
- Oferta confirmada pelo dono (v336 ok).
- Ícone verde de check após a venda: menor, minimalista, alinhado à esquerda do título (não cobrir texto).
- Botão "$" (canto superior direito da tela Vender e também na venda concluída) abre janela "Para onde foi o dinheiro desta venda"; o bloco sai da tela de resultado e vai para essa janela.
- "Mais animações possíveis": proposta em GIF (check desenhado, $ com pulso, janela sobe, barra cresce, linhas em cascata, valores contando). Implementar só após o "ok".
- REGRA (17:16): NÃO mexer na animação/tela de "Venda concluída" além do que ele pediu (check menor/alinhado). Não adicionar $ nem tirar o bloco lá sem ele pedir.

## v337 (27/10/2026) — Botão $ e janela
Implementado só o pedido: botão $ no cabeçalho da tela Vender abre a janela "Para onde foi o dinheiro desta venda" (o cartão não aparece mais sozinho depois da venda); check verde pequeno e minimalista ao lado do título. Janela sobe com animação, barra cresce, linhas entram. Nada mais foi alterado.

## v338 (27/10/2026) — Pedidos do site não chegavam
Sintoma: site mostra "Pedido recebido", mas nada no app (nem notificação, nem Pedidos online). Sem acesso ao Firestore daqui (rede bloqueada), então: (1) busca travada não bloqueia mais as próximas (trava de 30 s); (2) a tela Pedidos online mostra "Última busca às HH:MM" ou o erro real, com botão "Verificar agora". Possível causa: app sem login na nuvem (Ajustes → Nuvem) ou regra do Firestore bloqueando leitura. Aguardando o dono informar a mensagem exibida.
IDEIA NOVA (17:25, NÃO implementar até ele autorizar): verificação do WhatsApp antes de fazer pedido no site, contra spam. Opções a mostrar: código por WhatsApp (precisa API paga/servidor), "toque para confirmar pelo WhatsApp", ou barreiras simples (número válido, limite por aparelho, campo isca).

## v339 (27/10/2026)
Imprimir nota: agora pergunta "Imprimir a nota?" (Imprimir / Voltar) antes de enviar à impressora.
Site: dono escolheu a opção 3 (barreiras simples, número de WhatsApp válido). Mockup enviado; implementar no repo catalogo só após o ok.

## v340 (27/10/2026) — Editar produto em 4 etapas (CONFIRMADO pelo dono, 17:47)
Etapas: 1 Modelo (nome, código, identificação) · 2 Cores e fotos (foto, qtd/custo, excluir cor) · 3 Site (liberar, descrição, faixa) · 4 Baixa (peça quebrada + Excluir este produto). Lixeira no topo continua. Cancelar na 1; Voltar/Continuar; Salvar só na 4. Nenhuma informação removida. (Dono escreveu "oferta em 4 etapas"; interpretado como Editar produto.)

## v341 (27/10/2026, 18:49) — pedidos do dono
Foto da peça recortada exatamente no retângulo da câmera (miniatura na mesma proporção); foto da nota/lote detecta o contorno do papel e endireita (câmera tipo scanner; sem papel usa o retângulo); rascunho guarda tudo (material, gênero, faixa, descrição, etapa, cor em andamento); leitura da haste "Código novo" só mostra (Classe de cor, sem C1–C6); classe lida passa para Cores e fotos também em produto já cadastrado; cabeçalho com ícone de voltar alinhado ao Fechar e título embaixo; "Concluir" adiciona a cor preenchida; ícone da Foto da nota alinhado; sugestões do código filtram só por formato/gênero escolhidos (tipo só ordena).
PENDENTE: Editar produto reaproveitando a interface do cadastro (com lixeira) — o v340 em 4 etapas não é o que ele quer.

## v342 (27/10/2026) — Editar produto com a interface do cadastro
2 telas como o cadastro: "Editar produto" (nome, código, marca, Formato/Material/Gênero em Label Select, coleção, descrição, faixa) → "Cores e fotos" (lista de cores com foto, trocar/excluir foto, qtd/custo, excluir cor, liberar para o site, peça quebrada, Excluir produto). Voltar em ícone alinhado ao Fechar; lixeira no topo; Salvar só na 2ª tela. Substitui o v340 (4 etapas).

## Verificação do WhatsApp no site (27/10/2026, 19:06) — dono escolheu opções 1 + 3
1 = código por WhatsApp (API oficial WhatsApp Business + servidor pequeno; custo por mensagem). 3 = pedido só "confirmado" quando o cliente manda mensagem à loja. Esboço (GIF + telas) enviado; manter as animações do site (check desenhado, etc.). NÃO implementado: depende de contratar a API/servidor.

## Site: verificação de WhatsApp — decisão revisada (19:13)
Dono desistiu da API paga. Quer: (a) número no formato correto de Brasil, Paraguai ou Argentina (celular); (b) após enviar, tela "Falta um passo" com giro de verificando: o cliente precisa falar com o vendedor primeiro (mensagem com código do pedido) para ter a reserva. Reserva guardada 30 min; o dono confirma no app ("Confirmar reserva") e o site mostra "Reserva confirmada". Esboço (GIF) enviado; AGUARDANDO aprovação, não implementar.

## 27/10/2026 · v343 · Barreira do WhatsApp (site + app) — implementada
- Site: seletor de país (🇵🇾 +595, 🇧🇷 +55, 🇦🇷 +54) e validação de celular por país, com erro específico; números com 7+ dígitos repetidos são recusados. O telefone é salvo normalizado (+55…, +595…, +549…).
- Depois de "Enviar pedido": tela "Falta um passo" (spinner), código `PEDIDO XXXX`, botão verde que abre o WhatsApp com o código na mensagem, barra de 30 min. O site consulta `reservas/<id>` a cada 4 s; quando existe `ok:true` mostra "Reserva confirmada" (animação do check).
- App (Pedidos online): selo "Aguardando a mensagem do cliente · código · reserva até HH:MM" e botão "✓ Confirmar reserva", que grava `reservas/<sid>` (ok, ts) via PATCH. É manual: não há API que detecte a mensagem no WhatsApp.
- PENDENTE NO FIREBASE: regra do Firestore para `reservas/{id}` → leitura pública (`allow get: if true`), escrita só autenticado. Sem isso o site não vê a confirmação e fica na tela de espera (depois de 30 min mostra aviso simples).
- Pedido do site não chegando ao app: causa ainda não confirmada (aguardando o dono informar o que "Verificar agora" mostra).

## 27/10/2026 · Admin do site (catalogo/admin.html)
- IMPLEMENTADO: (1) lista de Produtos junta o Firebase + a cópia do que o cliente viu (localStorage `lf_pdocs`); os que faltam no Firebase aparecem com "só no site" e botão Publicar; contador "N no total · M só no site". (2) Sem barra "Assim o cliente vê": o botão do cabeçalho vira olho aberto (visão do cliente) / olho fechado (admin), cabeçalho idêntico nos dois modos.
- PENDENTE (item 3, dono NÃO gostou do botão "Publicar no site"): mostrar outras opções de botão antes de implementar; remover cartão "Preço" da ficha (Inventário) só depois da aprovação; perguntar se mantém preço novo/antigo e faixa.
- Não consigo ler o Firebase daqui (rede bloqueada); a causa real de "admin 1 × site 2" não foi confirmada.

## 27/10/2026 · v344 · Ficha do produto (Inventário)
- "Liberar para o site" saiu do Editar produto e agora é um cartão logo ABAIXO da Oferta na ficha (alinhado com os demais cartões).
- Cartão "Preço" (preço antigo/novo + faixa) REMOVIDO da ficha, a pedido do dono. Fica só Oferta.
- Os botões alternativos de "publicar" (A–D) ficam descartados: o dono escolheu manter o botão "Liberar para o site", só mudando de lugar.

## 27/10/2026 21:40 · Pedido do dono (AGUARDANDO APROVAÇÃO DO RELATÓRIO, nada implementado)
- Bugs: (1) app arrasta para a direita com folga → trava overflow-x SEM mexer em botões (comparar capturas pixel a pixel antes/depois); (2) aba Produtos do admin do site só atualiza ao sair/voltar → reler no foco/voltar ao app/após publicar/30 s; (3) sombra rosa do menu bugada após "Liberado para o site" + notificação → marca do menu (98-botoes-anim.js `desliza`) deve reposicionar ao fim de animações/resize/volta do segundo plano.
- Ficha do produto (Inventário): voltar o campo Preço (digitável) + botão "Oferta" embaixo + texto de status (acima do piso etc.); remover o cartão Oferta atual; Oferta abre janela com preço novo + botões de % de desconto; "Liberar para o site" embaixo; REMOVER botão Vender; Cores sobem para baixo da descrição.
- Cadastro: código da haste à esquerda, Tipo à direita; modelo já existente preenche todos os campos; "Dar entrada rápida" à direita do texto.
- Editar produto: 100% idêntico ao cadastro, navegação livre entre etapas, lixeira, botão fixo "Salvar alterações".
- Gestos: arrastar a ficha → próximo/anterior produto; arrastar a foto → próxima/anterior cor.
- Animações: dono escolhe A/B por função (cartela enviada).
- Atenção: a lista "Preço" que foi removida em v344 volta (o dono mudou de ideia).

## 27/10/2026 · v345 · IMPLEMENTADO (relatório aprovado)
- Bugs: (1) `html,body{overflow-x:clip;overscroll-behavior-x:none}` (bloco LOCKX no fim de www/style.css). Comparação pixel a pixel de 9 telas com/sem a regra: posições idênticas, só até 4/255 de diferença em 1.268 pixels de sombra na tela Início. (2) admin do site (catalogo/admin.html) relê o Firebase no foco, ao voltar ao app, ao abrir Produtos e a cada 30 s. (3) marca do menu (98-botoes-anim.js) mede de novo em mutações de classe, resize, orientação, pageshow, foco, volta do segundo plano e ResizeObserver.
- Ficha: Preço digitável (#pvPreco) + botão "% Oferta" (#ofAbre) + status (#pvSt); janela Oferta (#ofModal) com chips de 5 a 30%; Liberar para o site abaixo; sem botão Vender na ficha; Cores logo abaixo da descrição. Faixa (30/40/50%) fica só no Editar produto.
- Cadastro: código à esquerda, Tipo à direita; aviso do código + "Dar entrada rápida" na mesma linha (#eRefRow); modelo existente preenche material, gênero, faixa e descrição (fillAdd).
- Editar produto: abas livres 1·Modelo / 2·Cores e fotos (#edTab1/#edTab2), código e Tipo editáveis (troca de tipo move as peças), lixeira, rodapé fixo "Salvar alterações" (#edSalvar).
- Gestos (src/89-gestos-ficha.js): arrastar a ficha → produto anterior/próximo; arrastar a foto → cor anterior/próxima (a folha acompanha o dedo, elástico nas pontas).
- Animações escolhidas pelo dono: 1B foto cresce, 2A janela com mola, 3A chips pulsam + preço conta, 4A cor suave, 5B onda + luzes ao liberar, 6A deslize com a folha, 7A etapas deslizam + 7B lixeira com tampa e aviso que sobe, 9A campos acendem, 10A telas em cascata + números contam. Item 8 (Salvar) NÃO escolhido: sem animação nova.

## v346 (27/10/2026) — Correção da câmera (foto da cor)
- Bug: o recorte do quadrado saía errado e o zoom bugava. Causa: a foto em alta (takePhoto) tem enquadramento diferente do visor, e o zoom da câmera disparava vários ajustes e voltava ao mínimo ao refazer.
- Agora: se a foto do sensor não tem a mesma proporção do visor, ou há zoom, usa o quadro do visor (o que se vê é o que sai no quadrado). Zoom da câmera é aplicado um por vez e mantido ao refazer.

## v347 (27/10/2026) — Limpeza + animação da nuvem
- Removidos itens mortos do app: LOTE, RLSIG (e o cálculo `sig`), lk, dist, sc1, GAL0, HT, coverOf. Mantido `marcaOk` (animação da venda concluída: regra do dono é não mexer). Site (index.html): CAMI, RA, fi, bg0, faceSvg, camCrop.
- Botões "Fazer cópia agora" e "Restaurar" (Ajustes > Nuvem) com estados animados: girando/varredura ("Enviando…", "Restaurando…"), pulso ao pedir "Confirmar" e check desenhado ao concluir.
- Backup do dono em 27/10/2026 (arquivo LaFouch-backup-2026-10-27.tar.gz). Removido o botão "Ver como o cliente vê" da aba Site do admin.
- PENDENTE (só imagens, aguardando OK): redesenho da aba Pedidos online + token de segurança ao confirmar pedido.

## v348 (27/10/2026) — Pedidos online redesenhado + token de entrega (aprovado: "Perfeito... pode implementar")
- Lista em cartões (inicial, miniaturas, total, estado, botão principal + ícone WhatsApp novo). Pedido aberto com passo a passo Reserva → Separando → Pronto → Entregue.
- Token: ao "Confirmar reserva" (ou ao começar a separar, se não houve confirmação) gera `LF-XXXX` (sem 0/1/O/I/L), ligado ao nome da cliente (`p.tok`, `p.tokNome`). Botão "Enviar token à cliente" (WhatsApp) e copiar.
- "Marcar entregue" abre "Conferir o token": só entrega se o token digitado confere (aceita com ou sem "LF-", minúsculas). Pedido cancelado invalida o token. Sem saída de emergência (o dono vê o token no pedido). Sem QR (o desenho mostrava QR; não há leitor/gerador no app: perguntar se quer).

## v349 (28/10/2026)
- Editar produto: removidos os campos Marca e Coleção (os dados já salvos continuam) e o botão "Sem faixa" (ficam Econômico/Intermediário/Luxo).
