# O que falta aprovar — 13/11/2026 (noite)

Responder com os números (ex.: "1, 3, 5 aprovados; 4 não"). Cada item aponta o esboço que já existe.

## A · APROVADO em 14/11 00:08 ("Tudo aprovado") — itens 1 a 14; 14 = "Conferir" só texto

| Nº | O quê | Onde | Esboço |
|---|---|---|---|
| 1 | Favoritar sem círculo e alinhado + "Últimas unidades" em etiqueta dentro da foto, ponto que respira | Site | work/s240/s240_1_catalogo_celular.jpg, s240_2_catalogo_pc.jpg |
| 2 | Coração vai até a sacola (0,62 s) e a sacola dá um toque; hoje são 1,9 s de efeitos em corrente | Site | work/s248/s248_video_site_favoritar.mp4 |
| 3 | Menu abre em 0,45 s (hoje o último item chega em 1,05 s) | Site | work/s248/s248_video_site_menu.mp4 |
| 4 | Pendências, Despesas, Dia, Câmbio, Histórico: 1 movimento de 0,2 s em vez da fila de blocos (até 1,1–1,4 s) | App | work/s248/s248_video_app_notif.mp4, s248_video_app_desp.mp4 |
| 5 | Um catálogo só: "Produtos" (preço + estoque + vender no mesmo cartão) | App | work/s242/s242_celular_produtos.jpg, s242_pc_produtos.jpg |
| 6 | Painel do site como tela do app (Pedidos, Mensagens, Visitas, Vitrine) | App | work/s242/s242_celular_site.jpg, s242_pc_site.jpg |
| 7 | Computador: ação ao lado do título; Inventário na largura toda (números na linha das abas, busca inteira) | App | work/s244/s244_pc1366_inventario.jpg, s244_pc2560_inventario.jpg |
| 8 | Computador: Caixa e Ajustes em 2 colunas | App | work/s244/s244_pc1366_caixa.jpg, work/s245/s245_pc_ajustes.jpg |
| 9 | 9 descrições novas (Catálogo "Escolha a peça e venda." · Caixa "O dinheiro da loja, por moeda." · Pedidos "Pedidos que chegaram pelo site." · Clientes "Quem compra na loja e no atacado." · Histórico "Todas as vendas, dia por dia." · Câmbio "Cotação do dia e trocas de moeda." · Despesas "Contas do mês e quanto cada venda separa." · Pendências "O que precisa de você agora." · Ajustes "Aparelho, loja, site e segurança.") | App | work/s245/s245_celular_caixa.jpg (exemplo) |
| 10 | Conjunto do app inteiro no design novo (34 folhas) | App | work/s245/ |
| 11 | Cópias e nuvem enxuta: estado + 4 linhas (Voltar no tempo, Lixeira 30 dias, Aparelhos, Arquivo) | App | work/s241/s241_celular_claro_nuvem.jpg |
| 12 | Backup por mudança de produto, com degraus de tempo e restaurar uma peça | App | sem esboço das telas internas |
| 13 | Junções só em texto: Dia+Histórico+Números = "Vendas"; Caixa+Despesas+Câmbio = "Dinheiro"; Guardião dentro de Pendências; um "+" só; uma fila de fotos; um compartilhar; Preço automático só em Números | App | sem esboço |
| 14 | "Conferir" do Guardião: só texto (como no S247) ou com fio | App | work/s247/s247_app_botoes_inicio.jpg |

Aviso: as folhas S241–S245 ainda mostram o botão vinho cheio; vale o botão novo (S247).

## B · Aprovado, falta implementar

- Botões: fio cinza fino / só texto, sem vinho, afunda ao toque, claro e escuro (S247).
- Animações S247: abas de Minha conta, mouse na peça (PC), abrir tela do app em 1 movimento, total do Caixa contando; remover pulinho da barra, brilhos e setas sem fim, salto do cartão.
- Acabamento S241 (títulos serifados, cartões leves), com os ajustes pedidos.
- Mochi no computador partes 2–3 e depois as vozes (falta a chave do ElevenLabs nesta sessão; teto 3.300 créditos).
- Porteiro + designer juntos com as 9 melhorias; Início cabendo no iPad/celular com letra grande; movimento com 3 tempos; melhorias 9–18 do app; 4 colunas no monitor; temática em dois níveis.

## C · Medido no S248 (sonda work/s248/sonda.py), sem proposta em vídeo

- App Início: 17 atalhos em fila, o último chega em 1,38 s — quase todos abaixo da dobra, a diferença não aparece na tela; encurtar junto com o item 4.
- App Pedidos e Clientes: desenho do estado vazio leva 1,5 s.
- Site: WhatsApp e a linha da barra do app animam largura/posição (custa fluidez); trocar por deslocamento, sem mudar o visual.
- Site abrir peça: quadro parado de ~200 ms (código; já anotado no S228).

## D · Propostas S249 — APROVADAS em 14/11 00:19 (itens 15 a 22)

Sonda: work/s249/sonda.py (toca em cada controle visível de 13 telas do app e 3 do site) e sonda2.py (diferença de imagem ao abrir e fechar).

| Nº | O quê | Medido hoje | Esboço |
|---|---|---|---|
| 15 | App: toda janela abre e fecha do mesmo jeito (abre 0,32 s, fecha 0,2 s) | 6 tempos de abrir (260, 300, 320, 400, 450–500, 650 ms); "+ Novo objetivo" e "+ Adicionar" fecham secos; outras fecham em 220–350 ms | work/s249/s249_video_app_janela_abre_fecha.mp4 |
| 16 | Site: sacola abre com o mesmo movimento de Minha conta | abre seca (0 animação), fecha em 0,3 s | work/s249/s249_video_site_sacola.mp4 |
| 17 | App: o que aparece seco entra suave (0,2 s) | calendário e filtros do Histórico, calendário do Dia, "+ Novo cliente": 0 animação ao abrir | sem vídeo |
| 18 | App Pedidos e Clientes: desenho da tela vazia 1 vez e em 0,6 s | leva 1,5 s e se redesenha a cada "Verificar agora" | sem vídeo |
| 19 | Site: busca fecha em 0,2 s | abre em 0,42 s, fecha seca | sem vídeo |
| 20 | Site: menu fecha em 0,2 s | 0,53 s com 14 itens em fila | sem vídeo |
| 21 | ~~Temáticas: enfeites repousam~~ — RETIRADO em 14/11: JÁ EXISTE. O site encerra os enfeites aos 10 s (`js/lf-site.js` l.4605, classe `fim`); a sonda mediu antes dos 10 s e eu li errado como "sem fim" | — | — |
| 22 | Limpeza sem mudança visual: animar deslocamento em vez de largura/posição (abas do Inventário, linha da barra, WhatsApp, Câmbio, Ajustes do catálogo); catálogo não refazer 40 animações ao fechar a busca | medido na sonda; o refazer do catálogo NÃO aparece na tela (0% de diferença) | sem esboço |

Sem animação sem fim em nenhuma das 13 telas do app paradas; no site só o ponto das "Últimas" (fora das temáticas).

Vídeos dos itens 17, 19 e 20 em work/s251 (S251). Medido nos vídeos: calendário do Histórico muda 0,7% da tela (invisível, vídeo descartado); tela vazia de Pedidos 1,4% (só o ícone); + Novo cliente 5,5%; fechar busca 95%; fechar menu 68%.
