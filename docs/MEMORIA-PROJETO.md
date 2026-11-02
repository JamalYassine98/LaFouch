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

## v350 (31/10/2026)
- Backup feito antes (LaFouch-backup-2026-10-31.tar.gz).
- Auditoria de Marca/Coleção: MARCA continua útil (nome automático, busca, campo ainda na fila de fotos `identBox`). COLEÇÃO só entra na busca e no campo da fila de fotos; o FILTRO por coleção (`S.colF`, `#fColB`) nunca tinha botão para escolher: removido (código morto). Marca e coleção seguem salvas e pesquisáveis. Dono pediu remover só se inúteis: não eram.
- Site: ícone do Google (favicons 48 e 96 px em `catalogo/`; Google exige múltiplos de 48). O Google leva dias para atualizar o resultado.
- Teste "PIN: certo abre" estava instável: agora espera o app abrir (até 4 s).

## Site: mapa (31/10/2026)
- "Ver no mapa" (2 links) e "Abrir no Google Maps" usavam busca por texto e caíam na loja Farma Fit. Agora abrem as coordenadas da La Fouch (-25.510131,-54.609959, informadas pelo dono em 31/10/2026) com o nome "La Fouch". Se o pino cair no lugar errado, as coordenadas (variável LOJA em catalogo/index.html) precisam ser corrigidas pelo dono.

## v352 (31/10/2026) — acesso rápido restaurado
- A v351 (grupos de abas) removeu o "acesso rápido" (arrastar botão do Início para o menu de baixo) SEM o dono pedir. Desfeito: v352 = v350 com o acesso rápido de volta, como era. Regra reforçada: não remover funcionalidade que não foi pedida.
- Código dos grupos guardado na tag git `grupos-v351` (src/95-grupos.js, tela Organizar abas).
- DECISÃO do dono: no atalho rápido, "se eu misturo 2 botões, ele vira um grupo" (misturar = juntar dois botões do menu de baixo, e o resultado é um grupo com abas). Detalhes (como juntar, nome/ícone, como separar) ainda por mostrar em imagens antes de implementar.

## v353 (31/10/2026) — grupos no acesso rápido
- Segurar (~650 ms) um botão da barra de baixo sobre outro = juntar: abre "Novo grupo" (nome sugerido "A e B", até 18 letras). Soltar antes = só trocar de lugar (como antes). Arrastar do Início sobre um botão comum = como antes (adiciona ou troca); sobre um grupo = entra no grupo.
- Grupo: botão com 2 ícones; ao abrir, as telas viram abas no topo (`#grpTabs`) + botão ⋯ (gerenciar). Segurar o grupo sem mexer (ou botão direito) = gerenciar: renomear, tirar tela, adicionar botão do Início, desfazer. Arrastar o grupo para fora da barra desfaz. Grupo com 1 tela some. Aviso (bolinha) de pedidos novos no grupo que tem Pedidos.
- Padrões usados (dono não respondeu): grupo pode ter mais de 2 telas; sem grupo dentro de grupo; estado salvo em `S.grupos` (+ ids `g:xxx` em `S.barra`). Código em src/95-barra-grupos.js.
- Site: "Ver mapa"/"Como chegar" agora usam a ficha da La Fouch no Google Maps (link maps.app.goo.gl/zy6c1ZFq4gQhxWXC8); dados estruturados de loja local; version.json e build do index.html iguais (a cada deploy do site, subir os dois juntos).

## DECISÕES do dono para o novo cadastro/reserva do site (31/10/2026) — APROVADAS e IMPLEMENTADAS (site + app v354)
- Sem receita/grau (é loja de óculos, não ótica). Sem "o que costuma procurar" nem "formato de rosto".
- Cadastro: nome, nacionalidade (paraguaio → RUC, brasileiro → CPF, argentino → DNI), nascimento, e-mail (opcional), cidade, endereço (opcional); entrada por WhatsApp com código.
- Delivery SÓ para paraguaios (brasileiros e argentinos: só retirada na loja). Delivery é pela transportadora (a loja não controla): SEM dia/hora; frete combinado no WhatsApp.
- Retirada na loja: SEM dia/hora marcados (vem quando quiser, em horário comercial seg-sáb 7h30-15h).
- O cliente PAGA ANTES; o pedido fica reservado até ser entregue: NÃO existe mais o prazo de 7 dias.
- Pendentes: forma de pagamento (qual? comprovante?), RUC/CPF/DNI obrigatório?, código por WhatsApp ou SMS, conta obrigatória ou visitante.
- Pagamento (31/10/2026, só esboço): brasileiros e argentinos pagam por PIX; paraguaios por Alias; em ambos o site mostra QR de pagamento + "copiar código/alias" + enviar comprovante. Dono confirma o pagamento no app (proposta: manual). Pedido pago fica reservado até a entrega (sem prazo). Pendentes: chave PIX do dono, alias, moeda (R$ para argentino?), política de devolução.

## v354 (31/10/2026) — cadastro + pagamento: IMPLEMENTADO (dono: "Pode implementar o sistema de cadastro")
- Site (catalogo): conta obrigatória (sem visitante), nome/nacionalidade/documento (RUC, CPF ou DNI)/nascimento/WhatsApp/e-mail opcional/cidade/endereço opcional. Delivery só paraguaio; brasileiro e argentino só retirada. Textos "7 dias" trocados por "reservado até a entrega". Sem código por WhatsApp (não há API): decisão minha, avisar o dono.
- Pagamento: PIX (brasileiro/argentino), QR gerado pelo site com a chave Nubank (valor em R$). Paraguaio: QR do Itaú gerado À MÃO pelo dono no app do Itaú (Generar QR, valor do pedido, "QR sin vencimiento") e ANEXADO ao pedido no app LaFouch (botão "Anexar QR do Itaú"). Alias/CI do Itaú NÃO ficam no código.
- App Pedidos: estados Aguardando pagamento → Conferir comprovante → Pago (token LF-XXXX gerado ao confirmar) → separar/pronto/entregue. Botões: Anexar QR, Confirmar pagamento, Recusar, Marcar como pago. Comprovante chega como doc `pedidos/<id>c` (tipo comp). Campos escritos em `reservas/<id>`: qr, pago, tok, recusado (com updateMask). Barreira antiga de 30 min ("Confirmar reserva") removida.
- Cliente cadastrado com documento (campo ruc) + nac, nasc, email, cidade, end.
- Modo teste: site `lafouch.com/?teste=1` (PIX de R$ 1,00, faixa TESTE, pedidos com teste:true); `?teste=0` sai. No app: selo TESTE e botão "Apagar pedidos de teste" (apaga também clientes criados só por teste).
- Pendente do dono: publicar regras do Firestore (get público em reservas/{id}; create em pedidos incl. docs `<id>c`); Search Console para reindexar logo/título.

## Login do site (31/10/2026) — aprovado e implementado (só site)
- Conta com usuário/e-mail + senha via Firebase Authentication (e-mail/senha). E-mail passou a ser obrigatório. Cadastro em 2 passos (acesso; depois dados). Usuário = apelido ligado ao e-mail em `usuarios/{user}` (get público); perfil em `clientes/{uid}` (só o próprio). Recuperar senha por e-mail.
- Reserva sem login: aviso discreto e botão "Entrar ou criar conta" no lugar de "Fazer pedido".
- O dono precisa: ativar Authentication > Método de login > E-mail/senha no console Firebase; publicar as regras novas (usuarios, clientes).
- Frete (31/10/2026): opção C, pago pela cliente à transportadora na entrega; não entra no total do site (v355 só texto).

## v356 (31/10/2026) — ícone único e nome sugerido por grupo (aprovado: "Pode implementar tudo")
- 19 telas → 171 pares; cada par tem ícone único (39 desenhados à mão + 132 "recipiente com o símbolo da outra tela dentro") e nome sugerido (máx. 18 letras). Dados em src/95-barra-grupos-icones.js. O botão do grupo na barra mostra esse ícone (dois primeiros itens do grupo); nome padrão ao juntar = nome sugerido.
- Os 132 desenhos "em sistema" não são desenhos à mão: o dono foi avisado.
- Login com Google no site: só respondido (possível via Firebase Auth), NÃO implementado — mostrar esboço antes.

## Site: login com Google e Minha conta (31/10/2026)
- Entrar e Criar conta abrem direto (sem aba de escolha). Botão Google fica embaixo, depois do "ou".
- Depois do Google: passo "Seus dados" com faixa "Conectada com o Google · e-mail" e nome já preenchido.
- "Conta criada!" não oferece sincronizar Google (decisão do dono). Só "Continuar".
- Minha conta: cartão do perfil, cartão "Conta do Google" (Sincronizar/Desvincular), Minhas reservas, "Sair da conta" no fim. A aba de reserva não mudou.
- Google usa o SDK do Firebase só para abrir a janela; a sessão segue pelo REST. Dono precisa ativar Google em Authentication e conferir o domínio lafouch.com em "Domínios autorizados". Login real com Google não foi testado aqui (só com SDK simulado).
- Selo "G" é um desenho simples, não o logo oficial.
- Também decididos: Como comprar + Perguntas rápidas, carrinho persiste (lf_cart), troca na retirada com possível ajuste de preço.
- Esboço do computador parecido com o celular (opções A/B): aguardando escolha do dono. NÃO implementar ainda.
- 31/10: site no computador agora usa o layout do celular (menu lateral, páginas) em coluna centralizada de 760px (opção A). Dono pediu.
- 31/10: dono escolheu: site ocupa a tela toda em qualquer resolução (opção B). Coluna de 760px e limite de 1500px removidos.
- 31/10: destaque no PC (>=1100px): texto à esquerda e card 5:4 à direita, tudo em vw (mesma proporção do 1366 em qualquer resolução). Abaixo de 1100px (celular em modo desktop) segue o layout do celular.

## Animações destaque (pendente, só esboço)
Parte do projeto: animações do card "Escolha da semana" no site. Vídeos de exemplo mostrados em 31/10/2026. NADA implementado. Implementar só quando o dono escolher e disser "pode implementar".
Ideias mostradas:
1. Entrada em cascata (card sobe, óculos desliza girando, nome e preço por último).
2. Inclinação 3D com brilho (mouse/dedo).
3. Troca de modelos (carrossel automático com bolinhas).
4. Respiração e sombra viva (zoom suave).
5. Reflexo nas lentes (faixa de luz).
Podem ser combinadas. Já feito: selo da La Fouch parado (sem flutuar) e produto centralizado no card do PC.
- 31/10: PC (>=1100px): logo, botões do topo e WhatsApp crescem com a tela; catálogo em 4 colunas (6 a partir de 2200px). Texto do início atualizado (conta, pagamento online, delivery Paraguai ou retirada).
- 31/10: PC (>=1100px): os 3 tamanhos de texto do menu viram 80%/90%/100% (100% = tamanho de antes, é o padrão no PC). Celular segue 100/112/125%. Mayorista no PC: cartão centralizado em 2 colunas (opção C).
- 31/10: destaque em modo "Slide de fotos": no admin (Destaque do site > Slide de fotos) há a escolha da troca: Fade (padrão) ou Deslize. Campo `sanim` em config/site. O site aplica em data-sa no cartão. 
- 31/10 (implementado): Slide de fotos tem 6 trocas (sanim: fade, slide, flip, zoom, circle, pile) e o botão "Efeitos" no card do destaque (admin) liga/desliga 4 efeitos (efx: cascata, incl, resp, refl) que valem em qualquer modo. Selo da loja sempre parado. Vídeo promocional continua sendo o modo "Vídeo" (.mp4 por endereço); não combina com slide. Pendente do dono: arquivo do vídeo promocional.
- 31/10/2026: transição 'Deslizar' do destaque corrigida (site): a armação sai esmaecendo e deslizando um pouco, depois a próxima entra, sem sobrepor. Catálogo PC (fotos menores 8 col/4:3 + botão catálogo/lista ao lado do filtro): esboços enviados, aguardando escolha do dono.
- 31/10/2026: dono quer EXPERIMENTAR C e D (pode mudar de ideia): catálogo PC com foto 4:3 (≥1100px) e modo lista (2 colunas no PC, 1 no celular) com botão catálogo/lista à direita do filtro (lf_vista no navegador). Deslize do destaque: sai deslizando e esmaecendo, depois entra o próximo.
- 31/10/2026: catálogo do site: modo lista L1-a implementado (cabeçalho Ref/Modelo/Precio/Disponibilidad, coração de favoritar na linha, foto 4:3 no PC); botão de favoritos (coração com contador) ao lado do filtro mostra só os favoritos e saiu das abas de filtro; barra de busca e botões maiores no PC.
- 31/10/2026: animação Deslizar (destaque) refeita: sempre da esquerda para a direita; a armação atual sai deslizando para a direita com fade enquanto a próxima entra vinda da esquerda (cruzamento simultâneo, ~0,95s). Causa do bug antigo: animação 'flo' do .stage>img anulava o transform dos slides (valia p/ deslizar, zoom e pilha; agora desligada nesses modos).
- 31/10/2026: Deslizar: sentido final = a armação atual sai para a esquerda e a próxima entra pela direita (fade cruzado). Flicker da 1ª troca corrigido (animações resp/cascata/flutuar não mexem mais no transform dos slides nos modos deslizar/zoom/pilha). Com destaque 'nada' no PC: cartão não aparece mais; layout A/B/C aguardando escolha do dono.
- 31/10/2026: início no PC com destaque 'nada': layout centralizado (opção C: título 2 linhas, texto, 3 botões lado a lado).
- 31/10/2026: site adaptado a tablets (600–1099px): início em coluna centralizada (retrato) ou 2 colunas (paisagem ≥900), catálogo 3 colunas (4 em ≥900), foto 4:3, busca/botões 48px, lista em tabela a partir de 900px. PEDIDO NOVO (só esboço, aguardando aprovação): botão no admin para escolher fotos da galeria no 'slide de produtos' e para o vídeo promocional.
- 31/10/2026: slide do destaque: corrigido reset/flicker (o slide era reconstruído do zero quando uma foto chegava da rede; agora mantém a foto atual) e a primeira foto agora entra deslizando em vez de aparecer parada. Firebase Storage exige plano Blaze (cartão); pergunta do dono sobre custo respondida; decisão sobre galeria/vídeo pendente.
- 31/10/2026: DECIDIDO pelo dono: vídeo e fotos da galeria do destaque ficam guardados no GitHub (repo catalogo, pasta media/), sem Firebase Storage (exigiria Blaze/cartão). Admin: conectar com chave do GitHub (fica só no celular do dono; repo catalogo, permissão Contents leitura/escrita), 'Escolher vídeo da galeria' (até 25 MB), biblioteca de vídeos com Usar/Excluir (não exclui o que está em uso), fotos da galeria no slide (reduzidas a 1100px) com ✕ para excluir. Fotos da galeria no slide ficam sem etiqueta/preço e sem clique. Aparece no site ~1 min após enviar. Falta o dono criar a chave do GitHub e testar com arquivo real.
- 31/10/2026: bug do coração (favoritar no produto) corrigido: o zoom/troca de cor da foto pegava o 1º svg do bloco da foto (o coração) em vez da foto; agora só usa a imagem direta.
- 31/10/2026: Dúvidas em espanhol ainda dizia '7 días' (tradução velha); corrigido para 'reservadas hasta la entrega o el retiro' (igual ao português). Destaque com slide: nome/preço agora ficam acima das bolinhas (sem sobrepor).
- 31/10/2026: topo do site: botões (menu, conta, sacola) centralizados verticalmente com o logo (tinham margem inferior de 15px que os subia) e logo alinhado à margem direita (mesma margem dos cartões).
- 31/10/2026: bug do admin ao conectar o GitHub (mensagem 'Cole a chave' mesmo com a chave colada): havia duas caixas com o mesmo id (Vídeo e Slide) e lia a escondida. Corrigido.
- 31/10/2026: dono pediu: conexão com o GitHub sai do Destaque e vai para a aba Configurar do admin (cartão 'GitHub (vídeo e fotos do destaque)': conectar/desconectar). No Destaque, sem conexão aparece só o aviso + botão 'Abrir Configurar'.
- 31/10/2026: slide do destaque agora é atualizado de forma incremental quando chega foto/lista nova (não remonta, sem flicker nem reset; mantém a foto atual e o tempo).
- 31/10/2026: Site: painel de conta (Entrar, Criar conta, Minha conta, Recuperar senha, Conta criada) agora abre como janela no centro da tela, com campos/botões/rótulos proporcionais em PC (vw/clamp). Slide de destaque: corrigido flicker antes da 1ª troca (camadas pré-promovidas com will-change/translate3d, imagens pré-decodificadas, nome/preço com fade na troca).
- 31/10/2026: Causa real da piscada do destaque ao iniciar: com o efeito Cascata, ao remover data-cx (3s) a animação 'sin' do stage reiniciava. Corrigido (animation:none ao remover).
- 31/10/2026: Site: olho de mostrar senha trocado por ícone SVG maior e centralizado no campo; com animação (risco some/aparece, pupila cresce, piscada) e cor rosa quando a senha está visível.
- 31/10/2026: Site: olho da senha não rouba mais o foco (teclado do celular continua aberto); destaque carrega mais rápido (config e produtos em paralelo; fotos do destaque primeiro, resto do catálogo depois). App (sw v357): ao deslizar entre produtos na ficha a tela não vai mais ao topo e volta (render restaura rolagem 'instant' porque o CSS tem scroll-behavior:smooth, e a ficha mantém a altura enquanto é refeita). Não testado em aparelho real.
- 31/10/2026: Site: número do botão de favoritos não é mais cortado no topo (top:0); logo do Google agora é o G colorido oficial (SVG) em Entrar/Criar conta com Google e no cartão Conta do Google. Pendente: dono relatou que o botão de favoritos 'some' sem favoritos — não reproduzido, aguardando detalhes.
- 31/10/2026: Site: número do botão de reserva lia 0 até o script principal carregar; agora um mini-script logo após o botão lê o carrinho salvo e já mostra o número certo ao recarregar.
- 31/10/2026: Site: botão de favoritos (coração ao lado do filtro) fica OCULTO quando não há favoritos e aparece ao favoritar o primeiro (já no ar, sem animação). Esboços de animação de aparecer/sumir (A fade+escala, B desliza, C mola, D colapso de largura) enviados; aguardando escolha do dono para implementar.
- 31/10/2026: Site: animação do botão de favoritos IMPLEMENTADA (opção E+H aprovada pelo dono): ao favoritar o 1º produto o coração voa do produto ao botão, círculo tracejado marca o pouso, botão se abre e o contorno é desenhado, preenche rosa com anel de pulso e assenta; ao tirar o último favorito: preenche, desfaz o traço e o botão encolhe/gira/cai. Respeita 'reduzir movimento'.
- 31/10/2026: Site: animação do 2º favorito em diante IMPLEMENTADA (combinada aprovada pelo dono, sem 'sugar girando'): anel no coração do produto, 3 corações em cometa até o botão, botão bate e pisca rosa com anel, número rola (1→2) com pop e '+1' sobe. Respeita 'reduzir movimento'.
- 31/10/2026: Site: no celular os campos Usuario/Correo da tela Criar conta apareciam achatados (flex-shrink); corrigido para todos os tamanhos de tela.
- 31/10/2026: Site: telas Entrar e Criar conta (passo 1) no celular (≤599px) ficaram compactas e cabem sem rolagem (testado de 360x640 a 390x844). Passo 2 do cadastro tem muitos campos e ainda rola. Tablet/PC inalterados.
- 31/10/2026: Site: olho da senha fechado agora fica na cor neutra (antes ficava rosa pelo :hover preso no celular); só o olho aberto é rosa.
- 31/10/2026: Site: olho da senha — hover do PC opção C (rosa + cresce) implementado só para mouse (hover:hover); celular sem efeito de hover. Esboços de toque para celular em andamento (dono quer ver mais opções).
- 31/10/2026: Site: olho da senha no celular implementado (opção 2 aprovada): enquanto o dedo segura fica rosa e cresce (igual ao hover do PC); ao soltar abre rosa, fechado volta cinza.
- 31/10/2026: Site — animações de entrada (botões/textos subindo e produto de destaque) suavizadas: começam só após o primeiro quadro pintado, deslocamento menor, sem blur na foto, foto decodificada antes de entrar, sem preserve-3d.
- 31/10/2026: Site — flicker do destaque ao atualizar: o cartão branco aparecia semitransparente (cinza) sobre o fundo escuro; agora fica opaco em 25% da animação (sin/fup) e só o deslocamento continua suave.
- 31/10/2026: Site — botões/textos da entrada ainda mais suaves (1,2–1,5s, curva longa, deslocamento 12px); destaque ganha sombra que surge suavemente (shd 1,6s).
- 31/10/2026: Site — botão 'Qual combina com meu rosto?' (3º botão) agora entra em sequência com os outros (delay .56s; garantias .74s).
- 31/10/2026: Backup: branch backup-2026-10-31-b nos dois repos. Site — textos de cada formato de rosto reescritos no estilo do quadrado ('Armações X trazem Y e Z a W'), com tradução ES. Pedido: esboços de melhoria da interface da aba 'qual combina com meu rosto' (só mostrar, implementar quando aprovar).
- 31/10/2026: Aba 'rosto': dono gostou da opção B (carrossel) mas quer manter o bloco da câmera atual (3 passos). Esboços refeitos B1/B2/B3 (pontos, abas com nomes, contador com setas). Aguardando escolha; nada implementado.
- 31/10/2026: Aba 'rosto': dono escolheu B1 (carrossel + pontos) com setas minimalistas sobre a foto, também clicáveis. Esboço refeito (setas em círculo translúcido vs solta). Aguardando aprovação; nada implementado.
- 31/10/2026: Aba 'rosto' B1: dono quer setas soltas (estilo direita), mais afastadas e com cor visível. Esboço: setas rosa (#f3c0dc) com sombra escura, nas laterais fora do cartão central. Aguardando aprovação.
- 31/10/2026: Aba 'rosto' B1: setas centralizadas verticalmente na foto e com opacidade ~70%. Aguardando aprovação.
- 31/10/2026: Aba 'rosto' B1: setas reposicionadas como marcado pelo dono (mais baixas ~83% da foto e mais próximas do cartão, entre a borda do vizinho e o cartão). Aguardando aprovação.
- 31/10/2026: Aba 'rosto' B1: setas 10px mais juntas (esq -42px / dir -35px). Aguardando aprovação.
- 31/10/2026: Aba 'rosto' B1: setas um pouco mais afastadas (esq -47px / dir -40px). Esboços de animação das setas: A respirar, B convite (vai e vem), C toque (feedback), D entrada. Aguardando escolha; nada implementado.
- 31/10/2026: Site — aba 'rosto' virou carrossel (opção B1): cartão central ativo, vizinhos esmaecidos, pontos, setas soltas rosa (esq -47/dir -40) clicáveis e deslize; toque no cartão vizinho o centraliza, toque no central seleciona. Animações das setas: entrada (D) + convite contínuo combinando respirar/vai-e-vem (A+B) + feedback ao toque (C); respeita reduced-motion. Bloco da câmera mantido.
- 31/10/2026: Site — suavidade ao atualizar/primeira visita: conteúdo só sobe depois das fontes carregadas (máx 1,2s) e, na primeira visita, depois da abertura (logo) sair (antes o cartão branco aparecia cinza sob a abertura em fade); saída da abertura .8s. Pedido: esboços para o cliente perceber que os cartões de formato de rosto são selecionáveis (só mostrar).
- 31/10/2026: Esboços (só mostrar) para indicar que os cartões de formato de rosto são selecionáveis: 1 botão cheio, 2 círculo de seleção pulsante + 'Toque para escolher', 3 mão animada + brilho, 4 aba 'Escolher este formato' + instrução acima. Aguardando escolha.
- 31/10/2026: Site — bug: ao escolher um formato de rosto sem modelos marcados (produtos sem 'rosto' no app caem só em 'oval') a vitrine ficava vazia. Agora mostra todos os modelos e avisa 'Ainda não separamos modelos para este formato; veja todos abaixo' (PT/ES). Causa de fundo: o app só marca rosto pelo formato da armação (ROSTO_DE[formato] || ['oval']); modelos sem formato ficam só em oval.
- 31/10/2026: Esboço (só mostrar): botão 'Escolher' no cartão do formato de rosto (1 cheio, 2 pílula com contorno) e bloco da câmera movido para baixo do carrossel com título 'Não sabe qual escolher?'. Aguardando escolha.
- 31/10/2026: Site — aprovado e implementado: botão rosa cheio 'Escolher' (sem ✓) no cartão ativo do carrossel de rostos (ES: Elegir); bloco da câmera movido para baixo do carrossel com título 'Não sabe qual escolher?' (ES: ¿No sabes cuál elegir?).
- 31/10/2026: Backup: branch backup-2026-10-31-c nos dois repos. Site — desenhos dos 6 formatos de rosto ganham olhos (visíveis nas lentes), nariz e boca, posicionados pela armação de cada desenho (função feat), no estilo da referência (quadrado).
- 31/10/2026: Site — decisão do dono: NÃO mostrar olhos atrás das lentes nos desenhos de rosto; ficam só nariz e boca.
- 31/10/2026: Site — REFERÊNCIA TOTAL dos desenhos de rosto = desenho feito à mão pelo dono (quadrado: homem de óculos redondos, mulher com presilha e óculos retangulares; traço fino, nariz em curva curta, boca larga fina e lábio inferior). Nariz/boca refeitos finos e nas proporções dessa referência; sem olhos.
- 31/10/2026: Dono mandou NÃO mexer mais no site; esboços dos desenhos dos rostos feitos só no Claude (traço fino afunilado, sem olhos, óculos compatíveis com cada formato, baseados no desenho à mão dele). Aguardando aprovação antes de implementar.
- 31/10/2026: Dono quer que eu aprenda perfeitamente o estilo do desenho dele (Rosto quadrado). Método: redesenhar em SVG coordenada a coordenada, comparando lado a lado com o desenho dele; só enviar quando estiver próximo. Site continua sem mexer; aguardando aprovação para replicar nos outros 5 formatos. Código: /tmp/st/v2/st.py.
- 31/10/2026: Aba 'Seu rosto' implementada para tablet/PC (>=700px): grade de cartões (2 colunas tablet, 3 colunas PC), botão Elegir em todos (clique escolhe direto), faixa horizontal 'Não sabe qual escolher?' igual ao 1366 em todas as resoluções (escala 1.15x em 1920, 1.6x em 2560), sem setas/pontos. Celular mantém carrossel. Desenhos novos dos rostos ainda NÃO implementados (aguardando aprovação).
- 31/10/2026: DEFINIÇÃO NOVA dos tamanhos de texto no PC (só nomes; tamanhos reais iguais): o atual 80% passa a se chamar 100%, o atual 90% = 110%, o atual 100% = 120%. Catálogo no PC (decidido, esboços em aprovação): 100% mostra 6 produtos por linha, 110% mostra 5, 120% mostra 4. Aguardando aprovação dos esboços antes de implementar.
- 31/10/2026: IMPLEMENTADO (site): catálogo no PC com 6/5/4 produtos por linha para texto 100%/110%/120% (a partir de 1700px; abaixo disso 4). Padrão no PC passou a ser 100% (o antigo 80%, 6 produtos); quem já tinha escolhido um tamanho mantém. Atributo data-zi no <html> guarda o tamanho; modo lista não muda.
- 31/10/2026: Seletor 'Texto' (menu): letras A centralizadas opticamente (medido: desvio vertical de até 0,75px corrigido com padding-top em em; caixas e posição horizontal já eram iguais).
- 31/10/2026: Site: barra de busca, botões ao lado (filtro/favoritos/lista) e linha do câmbio maiores no PC (>=1100px, crescem com a largura da tela, equivalente a ~46px em 1366 e ~70px em 2560) e no tablet (busca 56px, câmbio 15px).
- 31/10/2026: Barra de busca no PC reduzida ~12% (agora ≈42px em 1366, 48px em 2000, 63px em 2560 com texto 100%); câmbio e tablet sem mudança.
- 31/10/2026: Site: linha do câmbio fica EM CIMA da barra de pesquisa no PC e tablet (>=600px); no celular continua embaixo. Implementado para o dono ver/experimentar.
- 01/11/2026 (v358, app): (1) Preço do produto no Inventário agora é digitado em DÓLAR (ficha do produto, janela Oferta e "Preço…" em grupo). Guardado em US$ (pprice.nu/au) e os guaranis (novo/ant) são recalculados a cada tela com a cotação da loja, arredondando de 500 em 500; mostra "= Gs. X (cotação da loja)". Preços antigos em G$ foram convertidos para dólar sem mudar o valor no dia (a partir daí acompanham o câmbio). Quando outra parte do app grava guaranis (ex.: reajustar ao piso), o dólar acompanha. (2) Margem mínima da cotação da loja: 0,5% → 1% (teto continua 2%); aviso de "margem subiu" passa a valer acima de 1,5%. (3) Site: o app agora envia também "R$ por US$" (campo cotacao.rpu) e o site mostra esse valor (antes o site calculava 5.900÷1.100 = 5,36 e o app mostrava 5,40). Só atualiza no site depois que o app sincronizar. Testes 206/207; o que falha (Resumo "hoje") falha igual sem as mudanças porque as vendas de exemplo de hoje são às 12h e rodei de madrugada. APK/Windows não gerados.
- 01/11/2026: site (Como comprar → Perguntas rápidas): resposta agora na linha abaixo da pergunta (dono pediu).
- 01/11/2026: site PC: aba 'Qual combina' cabe numa tela sem rolagem no texto 100%; banner do rosto escolhido rola junto com o catálogo (sem sobreposição); Como comprar centralizado; Dúvidas e Atacado maiores.
- 01/11/2026: site PC/tablet: botões do topo (menu/conta/reserva) com o mesmo tamanho dos botões da busca; logo mantido.
- 01/11/2026: site: favorito sem efeito cometa (um único coração voa até o botão); corrigido desalinhamento do coração/voo ao carrinho causado pelo zoom do corpo no PC (coordenadas divididas pelo zoom).
- 01/11/2026: site celular: animação ao abrir a reserva (painel abre como onda a partir do botão da reserva, itens entram em sequência, botão pulsa). Corrigido clique do botão que abria a reserva em modo 'still'.
- 01/11/2026: site celular: animação da reserva trocada para ficar igual à do menu (painel desliza da direita, fundo escurece, itens em sequência) — dono pediu.
- 01/11/2026: dados do Itaú para o cliente transferir manualmente (Paraguai): banco Itaú, alias 9175078, titular Jamal Ali Yassine. Ideia aprovada pelo dono (botão 'Salvar QR na galeria' + cartão 'Ou transfira manualmente' com copiar alias/titular/valor); AGUARDANDO 'pode implementar'.
- 01/11/2026: IMPLEMENTADO no site (pagamento Itaú/Paraguai): botão 'Salvar QR na galeria' (aparece quando o QR chega) + cartão 'Ou transfira manualmente' com copiar alias 9175078, titular e valor. Alias fica no código do site (const ITAU em index.html).
- 01/11/2026 SEGURANÇA (dono autorizou): Blaze ativado (US$30 de crédito pré-pago; orçamento US$1/mês com alertas por e-mail). reCAPTCHA v3 criado (projeto lafouch, domínios lafouch.com/www). Chave do SITE (pública): 6LdfswsuAAAAAEhnRr1YDllR505K3LagtIYIDpdb (a secreta fica só no Firebase App Check, nunca no chat/código). Site: App Check implementado em index.html (AC/acTok/acFetch anexa X-Firebase-AppCheck em pedidos, auth e leituras do Firestore) mas INATIVO até preencher AC.app com o ID do app web (1:...:web:...). PENDENTE: dono manda o ID do app + colar chave secreta em App Check (sem "Impor" ainda) + regras atuais do Firestore; depois: conferir "verificadas" no App Check, só então impor (cuidado: o app APK também fala com o Firestore). Depois: regras novas, barreiras no formulário, Cloud Function de pedido + push.
- 01/11/2026: App Check ativo no site (ID do app web 1:462328668572:web:c34eb81c6044ca07e62859). Sem a chave secreta registrada no Firebase App Check o site segue normal, só sem o selo (falha silenciosa, nova tentativa após 60 s). Ainda NÃO impor.
- 01/11/2026: App Check registrado no Firebase pelo provedor Fraud Defense (reCAPTCHA Enterprise) com a chave do site; o clássico não aceita mais registro. Site usa enterprise.js + exchangeRecaptchaEnterpriseToken. Falta: conferir 'Verificadas' no App Check antes de impor.
- 01/11/2026: criada lafouch.com/privacidade.html (pt/es) + link no rodapé, para a tela de permissão OAuth do Google (Branding). Login com Google funcionando; falta liberar o domínio lafouch.com em Authentication > Configurações > Domínios autorizados (se ainda não feito) e preencher Branding no Google Auth Platform.
- 01/11/2026: arquivo de verificação do Search Console (google7d28e43dee6e9b8c.html) publicado na raiz do site lafouch.com; NÃO remover. Depois de verificado, aguardar 24 h e marcar 'Corrigi os problemas' no Branding do Google Auth.
- 01/11/2026: janela do login Google (signInWithPopup) agora é centralizada sobre o navegador (override temporário de window.open em gPopup, /*GPOP-CENTRO*/), pois abria deslocada para o lado. Search Console verificado e branding aprovado (publicar branding).
- 01/11/2026: aba Conta do site: seletores de nacionalidade e de país do WhatsApp com bandeiras em SVG (emoji de bandeira vira 'BR' no Windows); máscara automática de CPF/RUC/DNI e data dd/mm/aaaa; cidade conferida no OpenStreetMap (Nominatim) ao sair do campo (sem internet = deixa passar); 'Sair da conta' centralizado; campo de telefone não estoura mais a largura. Regras do Firestore novas (clientes/usuarios + dono por UID jJzNDoMHtuRNOAF1GhJfNYDMlE63) entregues ao dono para colar; falta ele ligar 'Ativar criação (cadastro)' no Auth. Depois: tirar o código técnico da msg de erro do login Google (gErr).
- 01/11/2026: passada de responsividade do site. (1) Escala fluida: LFZ() no boot script e em zset — zoom do body = nível de texto x fator da largura (PC: até 1.75 acima de 1440px; tablet min(w,h)>=600: até 1.2) e recalcula ao redimensionar/girar. (2) Piso de tamanho de texto (/*PISO-TEXTO*/) em selos, UV400, ref, botões, eyebrow. (3) Seu rosto: ajuste em uma tela só agora exige altura >=560px (celular deitado volta a rolar normal). (4) Detalhe do produto em 2 colunas no celular deitado. (5) Cartões estreitos (<=380px): tag e coração menores. Robô de teste: python3 tests/audit_site.py (16 resoluções x 3 níveis de texto x 10 telas; servidor local em :8765 na pasta do catalogo). Rodar antes de cada mudança grande de layout.
- 01/11/2026: cabeçalho PC (>=1100px): botões/busca/logo divididos por (1+(kz-1)*.35 / .8) para não crescer em dobro com a escala fluida (--kz = fator de largura, setado em LFK()). Em 2560x1440 botões ~85px, logo ~220px.
- 01/11/2026: cotação (#cbl) fica acima da busca em todos os tamanhos (placeCbl sempre antes de .mobsearch) e centralizada na altura entre a linha do cabeçalho e a busca (/*COTACAO-CENTRO*/: margem-topo = .7em - 8px, margem-base = .7em).
- 01/11/2026: escala fluida não pode dobrar onde o CSS já usa vw/--k: (a) hero/trust da home usam zoom:calc(1/var(--kz)) no PC; (b) --k das páginas do PC (rosto, como, atacado, dúvidas) agora é dividido por --kz (body{--k:calc(1.6/var(--kz,1))}); (c) cotação alinhada (<=1px) ao texto da busca em todos os tamanhos.
- 01/11/2026: DECISÃO: no PC (>=1100px) NÃO usar escala fluida (LFK retorna 1): o CSS do PC já é medido em vw/--k e a escala dobrava Seus dados, botões, cotação, home. Verificado por comparação de imagens com o commit 247a92d: abas do PC idênticas (<0,25% de diferença). Escala fluida só em tablet (600-1099px, até 1.2). Piso de texto (/*PISO-TEXTO*/) só em <=1099px. Cartões do catálogo no PC continuam pequenos em 2560 (design original); se o dono quiser, aumentar só os cartões.
- 01/11/2026: dono pediu ESBOÇOS (não implementar até avisar): (1) cartões do catálogo maiores no PC (propostas A: 5 colunas/texto maior; B: 4 colunas); (2) no detalhe do produto os botões Adicionar à reserva / Falar com vendedor ficarem na coluna da direita (não embaixo da foto); (3) miniaturas de cor sob a foto para o cliente escolher a cor. Obs.: hoje as cores só aparecem quando o produto vem do app com mais de uma cor (lib=true e cores>1); as miniaturas exigem uma foto por cor. Esboços em /tmp/mock (esboco_cartoes.png, esboco_produto.png, prod_cel.png).
- 01/11/2026: dono quer que o produto abra direto em PÁGINA INTEIRA (endereço próprio, ex. lafouch.com/p/SL2210) e que ao voltar o catálogo retorne ao mesmo ponto (rolagem, filtros, cartão marcado). Só esboços enviados (vídeo + imagens); NÃO implementado — aguardar aprovação do dono.
- 01/11/2026: IMPLEMENTADO no site (dono aprovou o esboço): produto abre em PÁGINA INTEIRA (/*PAGINA-PRODUTO*/, .scrim.pg) com barra 'Voltar ao catálogo', endereço /p/REF (pushState; reload usa p/REF.html→?ref=), botões Adicionar à reserva/Falar com vendedor na coluna da direita (fixos embaixo no celular), miniaturas de cor sob a foto (só lib=true e cores>1; uma foto por cor cadastrada no app), 'Combina também' embaixo. Voltar (botão ou do navegador) devolve o catálogo na mesma rolagem/filtros e marca o cartão (.lastv). 404.html aceita /p/REF sem .html.
- 01/11/2026: site: (1) ao recarregar /p/REF (ou ?ref=) a tela inicial piscava ~0,3 s: agora html.bootprod esconde main/rodapé até o produto abrir (abre em até ~60 ms); (2) Esc com reserva/produto aberto fechava também a aba (Catálogo etc.) por baixo: corrigido (e.__lfc). Auditoria automática (PC e celular) de abas Catálogo/Seu rosto/Atacado/Como comprar/Dúvidas: recarregar sem piscar, abrir produto e voltar na mesma rolagem/aba, voltar/avançar do navegador. Dono pediu testar sempre esse tipo de interação.
- 01/11/2026: site (pedidos do dono): (1) removido o botão Comprar/Avise-me dos cartões do catálogo (compra só na página do produto); (2) 'Voltar ao catálogo' devolve aba, filtros (tipo/gênero/busca/ordem/rosto) e rolagem exatos, inclusive após atualizar a página (estado em sessionStorage lf_back; link novo sem estado abre Catálogo); (3) ícone da reserva agora é carrinho; (4) botão da conta fica à direita do carrinho com o texto 'log in' (logado: primeiro nome); (5) botões menu/carrinho/conta sem círculo, com relevo suave no hover (/*CABECALHO-SEM-CIRCULO*/).
- 01/11/2026: site: o carrinho (Sua reserva) agora abre como PÁGINA (/reserva, mesmo mecanismo da página do produto: pushState, Voltar/voltar do navegador, atualizar mantém; 404.html leva /reserva a /?reserva=1). Hover dos botões do topo: relevo rosado no próprio ícone (menu, carrinho, log in), sem fundo.
- 01/11/2026: site: login/criar conta/recuperar senha/minha conta/seus dados agora abrem como PÁGINA (/conta; 404.html leva /conta a /?conta=1), mesmo mecanismo do produto e da reserva; trocar entre telas de conta ou entre conta e reserva substitui a entrada do histórico (Voltar sempre volta ao catálogo/produto de origem).
- 01/11/2026: site: páginas (produto/reserva/conta) piscavam o fundo ao abrir (fade da camada deixava o catálogo aparecer); agora camada opaca desde o 1º quadro, só o conteúdo anima (e nada anima ao mexer nas quantidades da reserva).
- 01/11/2026: site: 'Sua reserva' virou 'Seu carrinho' (URL /carrinho; toast 'Adicionado ao carrinho · Ver carrinho'); botão do produto 'Adicionar à reserva' virou 'Comprar'; removido 'Falar com vendedor' — o botão flutuante do WhatsApp aparece na página do produto e abre a conversa com a mensagem do produto (igual ao antigo botão); carrinho e login sem barra 'Voltar ao catálogo' (saída: voltar do navegador, logo ou menu); login ganhou 'Lembrar de mim' (marcado = sessão fica salva e usuário preenchido; desmarcado = sessão só até fechar o navegador). Dono pediu ESBOÇOS de estética (carrinho e login) — só mostrar imagens, implementar quando ele avisar.
- 01/11/2026: dono gostou do esboço do carrinho (pediu no celular: remover produto e 'continuar comprando') e quer login mais minimalista. Enviados esboços revisados: carrinho (lixeira em cada item + 'Continuar comprando' no topo e na barra inferior) e login A (centrado, campos só com linha, botão escuro) / B (cartão compacto com abas). AGUARDANDO escolha e 'pode implementar'.
- 01/11/2026: dono aprovou e implementado no site: login minimalista (Iniciar sessão, Lembrar de mim como interruptor, sem 'LaFouch' duplicado), carrinho novo (sem 'Continuar comprando' no topo/abaixo do produto no PC; × no celular; botões proporcionais) e janela 'Adicionado ao carrinho' com Continuar comprando / Finalizar compra. Publicado. Sem APK/Windows.
- 01/11/2026: dono aprovou opção A do carrinho (subtotal à direita do item, Remover, linhas Subtotal/Entrega, botões mantêm a forma) — implementado e publicado. PRÓXIMO (só esboços): reduzir o impacto do fundo branco das fotos dos produtos no catálogo.
- 01/11/2026: corrigido bug: tema (claro/escuro/auto) agora é salvo em localStorage lf_theme e restaurado no <head>. Dono: no tema escuro o branco das fotos dos cards 'é choque muito forte' — elaborar mais esboços (A/B anteriores só funcionam no claro).
- 01/11/2026: publicado: contador de favoritos só atualiza quando o coração chega; imagem voa ao carrinho ao Comprar; janela 'Adicionado' maior; botão Comprar menor; removido Gs. no português e 'Combina com rosto' (vira variável interna); removida linha duplicada de aviso nos cards. Dono NÃO gostou dos esboços do fundo branco no escuro (multiply altera cores do produto): refazer sem alterar cores, catálogo + página do produto.
- 01/11/2026 (noite): dono aprovou o conjunto de esboços da página do produto e do card de oferta; AGUARDANDO confirmação da lista antes de implementar. Decidido: página do produto = descrição curta + público (Masculino/Feminino/Unissex) sob o preço, cor logo abaixo da foto no celular, quantidade grande + Comprar menor na mesma linha, aviso Últimas unidades só em letras (sem fundo) sob a etiqueta do tipo, oferta com preço antigo riscado/novo verde/−20%/Você economiza, etiqueta OFERTA amarela antes do tipo; catálogo: card em oferta alinhado com os outros (degradê vinho, só OFERTA, sem etiqueta do tipo). Moldura/foto especial da oferta: deixada de lado. Fundo branco das fotos (claro A/B, escuro recorte/esfumado): ainda sem decisão.
- 01/11/2026: dono aprovou a lista e IMPLEMENTADO no site (index.html): página do produto sem bloco 'Prove na loja'; chip de público (Masculino/Feminino/Unissex); descrição curta com 'Ver mais' (só aparece se o produto tiver campo desc — campo no app ainda a fazer); cores em miniaturas (PC na coluna direita, celular sob a foto; só com >1 cor); quantidade real (− 1 +) + Total + Comprar na mesma linha, barra fixa no celular 'Comprar · R$'; avisos (Últimas unidades/Chegou) só letras sob a tag; oferta: pílula OFERTA + tag, preço novo verde grande, −%, 'Você economiza'; card de oferta alinhado, sem ticket do tipo. Pendente/não incluso: contagem regressiva (falta campo data fim), fundo branco das fotos, campo descrição no app.
- 01/11/2026: dono aprovou e foi implementado no site: na página do produto, 'Masculino' + 'Policarbonato' + 'Proteção UV400' na mesma linha (mesmo estilo); ordem da coluna: preço, chips, descrição, medidas, seleção de cores, total/quantidade/Comprar.
- 01/11/2026: corrigido no site: em telas grandes (PC) 'Esqueci minha senha', 'Criar conta' e botão Google ficavam grandes demais (regra de tela larga das abas de conta); login volta ao esboço aprovado (/*LOGIN-FIX*/).
- 01/11/2026: login no PC ampliado em telas grandes (zoom 1.2/1.4/1.6 a partir de 1200/1600/1900px; /*LOGIN-ESCALA*/) para não ficar minúsculo.
