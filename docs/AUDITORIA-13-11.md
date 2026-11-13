# Auditoria do site (13/11/2026) — plugin ux-ui-audit + crítica do S214
Só análise, nada mudou no site. Medido na cópia local, tema claro, celular 390 e PC 1440, telas Início e peça. Gerador: work/s215/audita.py (dados em work/s215/audit.json).
LIMITE: o endereço ?r=solar não abriu o catálogo no teste (mediu o Início de novo); a lista do catálogo não foi medida pelo plugin.

## Passou (não mexer)
- Contraste do texto: 70 de 70 no Início e 98 de 98 na peça, nenhum abaixo do mínimo.
- "Comprar" (branco no degradê): 10,39:1 no lado escuro e 4,65:1 no lado claro (mínimo 4,5).
- Fotos com descrição: 39 de 39. Sem botão sem nome. Página não rola para o lado.

## Achados
1. WhatsApp sai da tela: borda direita em 409 px numa tela de 390 (19 px para fora) e fica 0,92 de opacidade — é o mesmo defeito que o dono viu. O aviso "botões meio transparentes" era só ele.
2. Alvos de toque pequenos (celular): bolinhas do Destaque 8×8; "Ver todos ›" 76×17; "Filtros ›" 49×16; "Prefiero por e-mail" 130×18; "Cómo llegar ›" 85×18; links do rodapé 16 de altura. Recomendado 44, mínimo 24 (WCAG 2.5.8).
3. Página da peça sem título principal (H1 = 0; o nome da peça é H2). Não muda o visual; ajuda Google e leitores de tela.
4. 14 tamanhos de letra e 18 espaçamentos diferentes (o usual é até 10 e 14). É daí que vem a sensação de "desalinhado".
5. 9 estilos de botão diferentes numa tela.
6. 60% do texto da primeira tela em negrito: o negrito deixa de destacar.
7. Letra de 11,5 px em "DESTACADO DE LA SEMANA", Delivery, Pago seguro, Retiro (decisão do dono: não aumentar além do mínimo; fica como observação).

## Crítica das ideias guardadas (S214)
- Mantêm-se: WhatsApp inteiro (resolve 1), preços alinhados, categorias no PC, um só caminho na peça, fios finos.
- Falta no S214: alvos de toque (2), H1 da peça (3), reduzir tamanhos de letra/espaços a uma escala (4), menos negrito (6).
- Reprovado pelo dono e fora: mudar Ver modelo e Comprar.

## Falhas achadas nas MINHAS propostas (autocrítica, 13/11, medido)
1. WhatsApp inteiro (S214/S215): parado, fica em cima de algo clicável em 2 de 6 posições (360) e 3 de 6 (390) — "Ver todos ›", cartão "Últimas 2 unidades", "Ayuda". Troca um defeito por outro.
2. Barra de categorias no PC (S214): cabeçalho fixo cresce de ~82 para 147–155 px; no notebook 1366×768 o Comprar já fica fora da 1ª tela hoje (topo em 780) e desce mais 24 px (804). Em 900–1024 a barra fica com 55 px de altura.
3. Esconder o ☰ no PC (S214): o menu tem mais coisas que as 4 categorias; some o acesso a elas no PC.
4. Área de toque 44 nas bolinhas do Destaque (S215): os centros estão a 13–24 px; áreas de 44 se sobrepõem — impossível como desenhado.
5. Escala de letras/espaços (S215): nomes cortados nos cartões do Início passam de 3 para 6 de 8.
6. Um só caminho na peça no PC (S214): tira o "‹ Armazones" — não conferi se o caminho devolve o cliente com filtros e posição guardados como o voltar faz.
7. Linha reservada para "Última unidad" (S214): cria um vão em branco nos cartões sem aviso.
8. Foto do Destaque 30% maior (S214): feito por ampliação; só testado com 1 peça — armação larga pode cortar.
9. Links de texto 14/500 (S215): "Ver todos" fica menor e mais fraco (era 15/600).
10. Tudo testado só no tema claro padrão (Natal: só a cor da barra conferida), sem letra maior.
