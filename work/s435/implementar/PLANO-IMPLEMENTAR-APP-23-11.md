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
6. Tela sem cartão (.view .card plano) nas 9 telas do 149 e também no Caixa e no Vender/Catálogo, com o catálogo em 2 colunas (104, aprovado 13:52).
7. Avisos de dois tipos (85), com a bolinha de atenção #e0ac00 (89a); textos explicativos removidos (83).

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

---
# ÍNDICE: o ÚLTIMO aprovado de cada item (conferido em 23/11, às 14:05)
Use só estes arquivos. Tudo que foi superado está em `work/obsoletos/` e NÃO vale.
O que aparece num esboço e contradiz uma linha abaixo perde para a linha abaixo (vale a regra mais nova).

## Valem para TODOS os itens
- **Cor (101):** só a cor da marca muda para a oficial: claro #943d6f; escuro com letra e link em #bf8ba9. Fundos, cinzas e avisos ficam como estão.
  A cor escrita solta no CSS também troca (#8d3a69, #8a2f66, #a2447c, #b4528a). Prova: `s435/oferta96/esboco_101_so_a_cor_oficial.jpg`.
- **Botão principal:** só contorno (81). O acetinado foi descartado (esboço 100, nos obsoletos).
- **Cartão de cupom:** o de LUXO que o cliente recebe, `functions/email.js luxo()`. Componente pronto: `s435/varredura/cartao_luxo.js`.
  - Pessoal: vinho no tom oficial (#562340 → #341527 → #1f0d17).
  - VIP e aniversário: preto e ouro.
  - Evento: a cor do evento.
  - O `.cupCard` simples sai.
- **Bolinha de atenção:** #e0ac00 (89a); texto de atenção #b7791f.
- **Ajustes no estado aprovado** (Contas ligadas e Este aparelho) e todas as famílias: `s435/varredura/aprovados.py` (aplica, ajustes, CORES, CORLIT, SEMEMOJI).

## Parte 1 · Base visual
- 80 / 80b barras: `s435/barras/esboco_80_*`, `esboco_80b_*`.
- 81 botões: `s435/botoes/esboco_81_*`, `esboco_81b_*`.
  - Apagar foto = aviso "Foto na lixeira · Desfazer", sem janela; o 81c foi superado.
- 82 campos: `s435/varredura/esboco_82_*`. A busca fica como está.
- 83 textos: `s435/varredura/esboco_83_*` (v3) e a lista `TEXTOS-EXPLICATIVOS.md`.
- 84 ícones: `s435/varredura/icones/esboco_84_*`. Traço 1,6, sem emoji, com prova de alinhamento no Argus.
- 85 avisos: `s435/varredura/avisos/esboco_85_*` (v2). O aviso com Desfazer é neutro.
- 86 títulos e linhas: `s435/varredura/titulos/esboco_86_*` (v2).
- 87 pílulas: `s435/varredura/pilulas/esboco_87_*`.
- 89a bolinha amarela: `s435/pendentes/esboco_89a_*` (v3).
- 104 tela sem cartão, também no Caixa e no Vender (catálogo em 2 colunas): `s435/semcartao/esboco_104_*`.

## Parte 2 · Ajustes
- 46 liga-desliga na tela do assunto: `s435/switch/esboco_46b_precos.jpg`, `46c_pedidos`, `46d_ajustes`.
- 89b Fornecedores sem o parágrafo (o número do mês vira uma linha): `s435/pendentes/esboco_89b_*`.

## Parte 3 · Peças
- 44 Preencher à mão: `s435/cadastro/esboco_44*`.
- 45 peça nasce no Estúdio: `s435/fluxo/esboco_45*`. O fluxo vale; a câmera é do Estúdio, que está fora.
- 88 duas portas: `s435/duasportas/esboco_88_*`.
  - Passo 2 "Cores": cada cor entra "sem foto".
  - "Continuar · cores".
- 77 escada de preços: `s435/escada/esboco_77_*`.
  - Degraus em múltiplos de G$ 10.000 (dono 10:19), para o cupom nunca precisar de arredondamento.

## Parte 4 · Titan
- 54 escritório: `s435/guardiao/esboco_54_*`. O nome passa a ser **Titan**.
- 62 a 67 setores Regras, Ofertas, Ficha e Oferta, Atacado, Ferramentas e Histórico: `s435/titan/esboco_6[2-7]*`.
- 94 de/por honesto: `s435/preco56/esboco_94_*`.
  - Na janela Oferta, a linha "No site" vira "Na loja e no site" (96c: `s435/oferta96/esboco_96c_*`).
- 95 preço de mercado: `s435/preco56/esboco_95_*`.
- 74r reserva suspeita, v3, em PEDIDOS e no sino (não em Preços): `s435/titan/reserva/esboco_74r_*`.

## Parte 5 · Vender
- **98 v6 Carrinho e janela Desconto, o último:** `s435/oferta96/esboco_98_carrinho_simples_v6_*`.
  - Uma linha "Desconto ›", só com cliente cadastrado. Não há código do cliente nem Leve 2, e o bloco "O Semp sugere" sai.
  - A 3ª peça aparece só quando o cliente leva 3 ou mais.
  - Recomendado = o maior desconto para o cliente; empate → o que vence antes.
  - Um desconto por venda.
- 96 oferta na loja e no site, sem opções de desconto na peça em oferta: `s435/oferta96/esboco_96_oferta_na_loja_v5_*`.
  - Vale só a regra da oferta. O carrinho desse esboço foi superado pelo 98 v6.
- 96d v2 Pagamento sem pedir o cliente: `s435/oferta96/esboco_96d_pagamento_cliente_v2_*`.
- 93 tudo arredondado no câmbio (US$ 27 + o resto em G$ no 1.000 mais perto): `s435/preco56/esboco_93_*`.
- 96f v2 depois da venda: o aviso que passa "Presente de 10% na conta da Ana". A janela com código e QR sai.
  - `s435/oferta96/esboco_96f_depois_da_venda_v2_*`.
- Lembrete do kit no Carrinho e na separação do pedido do site: `s435/lote99/esboco_99d_presentes_da_data_v2_*`, quadros 2 e 3.
  - "Presente de Natal na sacola · sobram N".
  - "Kit de Natal na caixa · sobram N".
  - O quadro 1 foi superado pelo 103.

## Parte 6 · Dinheiro
- 79 Pode tirar e imprevistos: `s435/gavetas/esboco_79_*` (v4).
- 99b v2 Lucro real com uma linha "Descontos": `s435/lote99/esboco_99b_lucro_real_v2_*`.

## Parte 7 · Marketing
- 70 / 70b Marketing do Semp e 73s setores: `s435/semp/esboco_70*`, `esboco_73s_*`. O passo a passo está em `COMO-FAZER-MARKETING-70.md`.
- 71 Destaque da semana: `s435/semp/esboco_71*`.
- 96e Cartões ativos por cliente, sem código: `s435/oferta96/esboco_96e_*`.
- 97a Cartões › Próxima compra, com as regras: `s435/oferta96/esboco_97a_*`.
- **103 v3 Natal sem interruptores, Marketing › Kits e Novo kit:** `s435/lote99/esboco_103_natal_e_kits_v3_*`.
  - Na Temática, TODA data é uma linha com ›.

## Não implementar (superados, reprovados ou de outra sessão)
- Superados: 55, 65d, 78, 97b, 99a, 99c, 99d (janela), 100, 102, 96 v1 a v4, 98 v1 a v5.
- Reprovados: 76c e 76d.
- Fora deste plano: o Estúdio (41c, câmera); o que é da sessão do site (75 e os esboços dela).
