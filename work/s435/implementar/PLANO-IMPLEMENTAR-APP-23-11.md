# Plano para implementar tudo no APP (S435 · ESBOCO, 23/11/2026)

Quem implementa: a sessão APP, uma parte por vez (implementar → testar → publicar → conferência da ESBOCO).
A ordem vai da base para o topo: primeiro o que muda TODAS as telas e depois as telas e funções novas, para não refazer nada.
Regras de todas as partes:
- a cor da marca é a oficial (#943d6f; escuro: letra e link #bf8ba9), e o design aprovado fica igual (101);
- cada regra fica num lugar só (regra 12);
- referência pronta dos aprovados: `work/s435/varredura/aprovados.py` e `cartao_luxo.js`.

## Parte 1 · Base visual (muda tudo, nenhuma função nova)
1. Cor oficial da marca (101 / 87): só a cor, em claro e escuro, incluindo a cor escrita solta no CSS.
2. Família das barras: um trilho 140C (80 / 80b).
3. Família dos botões: principal, pequeno e perigo com "Voltar" (81 / 75 / 88 Lente 14 px).
4. Campos em linha fina (82), um conjunto de ícones com traço 1,6 e sem emoji (84).
5. Títulos e linhas: um rótulo e uma linha de lista (86); pílulas ▾ viram linhas com janela (87).
6. Avisos de dois tipos (85), com a bolinha de atenção #e0ac00 (89a); textos explicativos removidos (83).

## Parte 2 · Ajustes e telas de assunto
7. Ajustes: só as linhas gerais (86), com o liga e desliga na tela do assunto (46).
8. Fornecedores sem o parágrafo explicativo (89b).

## Parte 3 · Peças: cadastro e estoque
9. Cadastro com duas portas: Preencher à mão ou Estúdio (44 · 45 · 88).
10. Escada de preços no Completar peça (77).

## Parte 4 · Titan (Preços)
11. Preços como escritório do Titan, com os setores (54, 62–67).
12. De/por honesto na janela Oferta (94); preço de mercado em "De onde vem o preço" (95).
13. Reserva suspeita em Pedidos e no sino (74r). Depende também da NUVEM.

## Parte 5 · Vender (caixa)
14. A oferta vale na loja e no site; peça em oferta fica sem opções de desconto (96 / 96c).
15. Carrinho com uma linha "Desconto ›" e a janela com os cartões de luxo e a recomendação (98 v6).
    Depende da resposta da NUVEM sobre o cupom sair da conta e a sincronização.
16. Pagamento sem pedir o cliente de novo (96d v2); tudo arredondado no câmbio (93).
17. Depois da venda: o aviso "Presente de 10% na conta" (96f v2).

## Parte 6 · Dinheiro
18. Pode tirar e imprevistos (79); Lucro real com uma linha "Descontos" (99b v2).

## Parte 7 · Marketing do Semp
19. Setores do Semp (70 / 73s, em 6 partes, `COMO-FAZER-MARKETING-70.md`) e Destaque da semana (68 / 53).
20. Cartões: Próxima compra com as regras (97a); Cartões ativos por cliente (96e).
21. Temática: toda data com ›; Natal e Kits (103); lembrete do kit com a contagem no Carrinho (98 v6) e 'Kit de Natal na caixa' na separação do pedido do site (aprovado 13:47).

## Fora deste plano
- Estúdio (43 / 45 câmera): fora até o dono liberar.
- SITE: tem fila própria. NUVEM: regras do cupom, sincronização e reserva suspeita.

## Ainda falta o dono dizer
- "Implementar", uma parte por vez, começando pela Parte 1.
