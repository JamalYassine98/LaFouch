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
