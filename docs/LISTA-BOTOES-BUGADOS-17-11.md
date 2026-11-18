# Botões com defeito — passeio pelo app (17/11/2026)
Como achei: o programa abriu o app (celular, claro) e tocou com o dedo SÓ no que aparece na tela, a partir do Início e da barra de baixo, até 4 níveis: 290 telas diferentes, ~1.000 toques. Em cada tela mediu os botões (texto espremido, cortado, toque pequeno, apagado, tampado, fora do lugar). Depois conferi os principais olhando a tela. Falta: tablet e PC pelo mesmo caminho.

## Não funcionam direito
1. **Caixa · "Ver o que falta repor ›"** (aviso no fim da tela): fica embaixo da barra de baixo e não dá para tocar — o toque cai em "Peças".
2. **Pedido aberto · "Assumir este pedido", "Marcar como pago", "Imprimir ficha de separação"**: espremidos em 3 linhas (botão de 52 px).
3. **Editar peça · barra "Salvar alterações"**: fica por cima de botões da tela e da barra de baixo.
4. **Lista de pedidos · nome da cliente** cortado ("Maria Ló…") com espaço sobrando.

## Pequenos demais para o dedo (menos de 30 px)
5. Ficha da peça · **"Ficha 4/6"** (26 px), chave **"No site"** (28 px), **"Lucro real"** (22 px), **"De onde vem o preço"** (28 px), abas **Estoque/Histórico/Site/Preço** abaixo de 40 px.
6. Ficha da peça · setas **‹ ›** das fotos: pequenas e quase apagadas.
7. Editar peça · **"MAIS DETALHES"** (17 px, apagado) e **"MAIS DETALHES (OPCIONAL)"** no cadastro (16 px).
8. Filtros · etiquetas **"Pré-graduados ×" / "Solares ×"** (24 px) e **"Limpar · Padrão · A a Z"**.
9. Guardião · **"silenciar"** (25 px).
10. Ajustes › Pedidos do site · chaves dos **fretes** (PedidosYa, Bolt, Tiemsa, MCGroup) (28 px).
11. Caixa › Conferir · **"Reservas iniciais (só na primeira vez)"** (20 px).
12. Compartilhar · **"outro app"** (21 px, apagado).
13. Início › editar · **"⋯" e "✕"** dos botões (24 px).
14. Janela do Câmbio · **"×"** de fechar.

## Texto espremido ou cortado
15. Ficha da peça › Compartilhar · **"Enviar no WhatsApp"** quebra em 2 linhas.
16. Filtros · **"Intermediário"** cortado com reticências.
17. Clientes · nome em letra de título e selo **"SITE"** minúsculo.
18. % Oferta · **"TERMINA EM (OPCIONAL)"** e "Código SP…" com letra menor que 11 px.

## Fora do lugar
19. Inventário · números **470** e **16** em alturas diferentes.
20. Preços › Contador · números desalinhados.
21. Ficha › Completar · **"Remover lote"** quase apagado.

## Funcionam, mas fora do padrão
22. "Enviar token à cliente" verde cheio · "‹ Pedidos" e "Ficha do cliente" pílula cinza · "% Oferta" rosa cheio · "Catálogo do produto" com título serifado · "PREJUÍZO · ABAIXO DA TRAVA" parece botão.

## Tablet e PC (passeio terminado: tablet 201 telas, PC 158 telas)
Tudo o que está acima também aparece no tablet e no PC. Novos:
23. **PC · o sino de avisos flutua por cima da tela quando rola** — cobre "Status" no Marketing, "Lotes pendentes" no Inventário e o canto dos cartões (conferido olhando a tela).
24. **PC · "15 preços para corrigir ›"** com toque de 25 px.
25. **PC · Pedidos › Feitos**: a página rola sem ter nada embaixo.
26. **Tablet e PC · faixa "🖤 Black Friday"** por cima de botões (barra de baixo, "Limpar histórico", "Ver todas as conferências do Guardião") — visto pelo programa; não consegui repetir na tela, confirmar no esboço.
27. **Tablet · Dashboard › Hoje**: números "Vendido" e "Contas do dia" em alturas diferentes, e o conteúdo ocupa só metade da largura.

## Achado com a dica do dono (Clientes › Conta atacadista › Cancelar conta, várias vezes)
28. **Cada toque abre uma janela NOVA por cima da antiga** — 3 toques em "Cancelar conta" = 4 janelas empilhadas (precisa fechar uma por uma). Acontece com toda ação da janela (Pausar, moeda, limite, trocar aparelho): `ataMuda` chama `ataJanela` de novo sem fechar a que está aberta.
29. **Conta cancelada continua com "Cancelar conta", "Pausar", limite e convite ativos** — dá para cancelar de novo (e mandar convite de uma conta cancelada).
30. **Depois de cancelar, a ficha do cliente volta a dizer "criar o acesso" e, ao tocar, CRIA OUTRA CONTA sozinha** (sem perguntar): ficam duas contas do mesmo cliente, uma cancelada e uma ativa.
31. A pergunta "Cancelar a conta?" é a caixa cinza do navegador (já no esboço 111b7).
Por que o meu passeio não pegou: ele toca cada botão uma vez e recomeça do zero; não repete o mesmo botão nem volta depois de cancelar. Regra nova para os próximos testes: tocar cada ação 3 vezes seguidas e refazer o caminho depois dela.
