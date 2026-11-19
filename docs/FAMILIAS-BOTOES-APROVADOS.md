# Famílias de botões — APROVADOS

Gerado de work/verif/inv/aprov por work/verif/familias2.py (lê só o inventário). 491 botões em 65 telas.

| Família | Botões | Telas | Caras diferentes hoje | Regra da família |
|---|---|---|---|---|
| Voltar ‹ | 21 | 20 | 4 | versalete "‹ ANTERIOR" acima do título (navegação B) |
| Link › (sai daqui) | 31 | 16 | 6 | texto + "›"; leva a outra tela ou abre a janela de baixo |
| Linha de lista que abre | 117 | 21 | 8 | linha fina, texto à esquerda, valor e "›" à direita |
| Dobra ⌄ (abre no lugar) | 41 | 14 | 3 | linha com "⌄" na margem direita; abre empurrando o resto |
| Adicionar "+" redondo | 4 | 4 | 2 | "+" redondo ao lado do título (P1) |
| "+" em texto | 7 | 7 | 2 | "+ Nova…" branco, sem sublinhado; à esquerda entre campos, centrado sozinho |
| Principal | 15 | 15 | 4 | um por janela/tela: contorno rosa, largura toda, 52 px |
| Secundário | 26 | 8 | 6 | contorno fino, mesma altura do principal |
| Perigo | 8 | 6 | 4 | vermelho; pede confirmação (janela com "Voltar") ou faz e dá "Desfazer" |
| Desfazer | 16 | 4 | 2 | texto rosa no aviso de baixo / ao lado do item |
| Ícone redondo | 36 | 26 | 7 | círculo 44 px, contorno fino, ícone do conjunto único |
| Escolha (abas / dois lados) | 96 | 23 | 9 | barra deslizante C; 2–3 opções = escolha de dois lados (P4) |
| Opção de janela | 12 | 3 | 4 | linha da janela de baixo que escolhe (✓ na escolhida) |
| Passo − / + | 14 | 2 | 2 | par − / + redondo, mesmo tamanho |
| Liga / desliga | 19 | 6 | 4 | chave ou marcação; muda na hora |
| Número tocável | 4 | 3 | 2 | número que troca a moeda ou abre o filtro |
| Cartão de peça | 12 | 2 | 2 | foto + nome + preço; abre a peça |
| Mostrar mais | 3 | 3 | 2 | carrega mais itens no lugar |
| Título (não é botão) | 8 | 8 | 1 | título não abre nada (navegação B) — não deveria ser tocável |
| Fechar / × | 1 | 1 | 1 | PROIBIDO em janela (P6): fecha arrastando/tocando fora |

## Voltar ‹ — 21

Caras hoje: texto 12px (17) · texto 15px (2) · ícone redondo 14px (1) · ícone quadrado 14px (1)

- caixa-acoes · "‹ DINHEIRO" · texto 12px · leva → grp
- caixa-reservado · "‹ CAIXA" · texto 12px · leva → caixa
- cambio · "‹ DINHEIRO" · texto 12px · leva → grp
- catalogo-carrinho · "‹ Catálogo" · texto 15px · muda a tela
- catalogo-pagamento · "‹ Carrinho" · texto 15px · muda a tela
- dash-contas-dia · "‹ DIA" · texto 12px · leva → dia
- dash-mes-vendido · "‹ DASHBOARD" · texto 12px · leva → dia
- dash-semana · "‹ RESULTADOS" · texto 12px · leva → grp
- despesas-conta · "‹ DINHEIRO" · texto 12px · leva → grp
- giro-lista-compras · "‹ GIRO E PREÇOS" · texto 12px · leva → grp
- giro-no-estoque · "‹ GIRO" · texto 12px · leva → dash
- giro-retorno · "‹ GIRO E PREÇOS" · texto 12px · leva → grp
- hist-dia · "‹ HISTÓRICO" · texto 12px · leva → hist
- hist-lista · "‹ RESULTADOS" · texto 12px · leva → grp
- inventario-ficha · "‹ PEÇAS" · texto 12px · leva → grp
- inventario-ficha-historico · "‹ PEÇAS" · texto 12px · leva → grp
- inventario-fornecedores · "‹ INVENTÁRIO" · texto 12px · nada visível
- marketing · "‹ MARKETING" · texto 12px · leva → grp
- reservas-para-onde · "‹ GIRO E PREÇOS" · texto 12px · leva → grp
- inventario-ficha · "Voltar" · ícone quadrado 14px · muda a tela
- catalogo-peca · "Voltar" · ícone redondo 14px · muda a tela

## Link › (sai daqui) — 31

Caras hoje: texto 15px (19) · caixa 15px (6) · texto 14px (3) · texto 13px (1) · barra grande 15px (1) · ?  (1)

- reservas-30dias · "Editar despesas" ·   · leva → desp
- inicio · "Vendido hoje · 5 venda(s) G$ 182.000 ›" · barra grande 15px · leva → dia
- inicio · "Resultados Dia, mês e histórico" · caixa 15px · leva → grp
- inicio · "Giro e preços Giro, preços e reservas" · caixa 15px · leva → grp
- inicio · "Site Pedidos, mensagens, vitrine e model" · caixa 15px · leva → grp
- inicio · "Marketing Posts, vídeos, temática, cartõ" · caixa 15px · leva → grp
- inicio · "Clientes 0 cadastrados" · caixa 15px · leva → clientes
- inicio · "Atacado Orçamentos" · caixa 15px · leva → ata
- caixa-acoes · "Reservas ›" · texto 15px · leva → dash
- caixa-acoes · "Ver o que falta repor ›" · texto 14px · leva → dash
- dash-custom · "Datas ›" · texto 15px · abre janela "PERÍODO"
- dash-folha-ver · "Hoje ›" · texto 15px · abre janela "PERÍODO"
- dash-mes · "Este mês ›" · texto 15px · abre janela "PERÍODO"
- dash-semana · "Esta semana ›" · texto 15px · abre janela "PERÍODO"
- giro-lista-compras · "Oferta ›" · texto 15px · leva → estoque
- giro-no-estoque · "15 preços para corrigir ›" · texto 13px · leva → dash
- grp-dinheiro · "Gerenciar grupo ›" · texto 15px · abre janela "Grupo"
- guardiao · "Ver ›" · texto 15px · nada visível
- guardiao · "Fazer ›" · texto 15px · nada visível
- guardiao · "Completar ›" · texto 15px · nada visível
- hist-dia · "Hoje ›" · texto 15px · abre janela "PERÍODO"
- inventario-ficha · "Fotografar no Estúdio ›" · texto 15px · muda a tela
- inventario-ficha-historico · "Fotografar no Estúdio ›" · texto 15px · muda a tela
- pendencias · "Ver margem ›" · texto 15px · leva → fx
- pendencias · "Ver conta ›" · texto 15px · leva → desp
- pendencias · "Conferir ›" · texto 15px · leva → caixa
- pendencias · "Ver ›" · texto 15px · leva → estoque
- pendencias · "Completar ›" · texto 15px · leva → estoque
- pendencias · "Fazer ›" · texto 15px · leva → ajustes
- precos · "ajustar tabela" · texto 14px · abre janela "Tabela de preço"
- precos · "ajustar" · texto 14px · abre janela "PRÉ-GRADUADOS"

## Linha de lista que abre — 117

Caras hoje: texto 15px (83) · barra grande 15px (14) · texto 14px (7) · caixa 15px (6) · ?  (4) · barra grande 16px (1) · barra grande 14px (1) · texto 13px (1)

- hist-dia · "Contas do dia G$ 140.000 1/30 de G$ 4.20" ·   · sumiu
- pendencias · "SP57765" ·   · leva → estoque
- pendencias · "SP58110" ·   · leva → estoque
- pendencias · "SP60627" ·   · leva → estoque
- cambio · "REAL G$ 1.196 ▼ 0,7% 7 dias" · barra grande 15px · abre janela "Real · G$ 1.196"
- cambio · "DÓLAR EM REAIS R$ 5,43 ▲ 0,9% 7 dias" · barra grande 15px · abre janela "Dólar em reais · R$ 5,43"
- cambio · "Registrar troca" · barra grande 16px · abre janela "Registrar troca"
- catalogo-peca · "· Sem detalhe 343 un." · barra grande 14px · nada visível
- hist-lista · "19/11 · hojequi G$ 182.000 › 5 vendas · " · barra grande 15px · leva → dia
- hist-lista · "18/11qua G$ 500.000 › 10 vendas · lucro " · barra grande 15px · leva → dia
- hist-lista · "17/11ter G$ 459.000 › 7 vendas · 1 outro" · barra grande 15px · leva → dia
- hist-lista · "16/11seg G$ 148.500 › 4 vendas · 1 despe" · barra grande 15px · leva → dia
- hist-lista · "15/11dom G$ 23.000 › 1 venda · lucro liv" · barra grande 15px · leva → dia
- hist-lista · "14/11sáb G$ 502.000 › 11 vendas · 1 outr" · barra grande 15px · leva → dia
- hist-lista · "13/11sex G$ 257.500 › 6 vendas · gastos " · barra grande 15px · leva → dia
- hist-lista · "12/11qui G$ 256.500 › 7 vendas · lucro l" · barra grande 15px · leva → dia
- hist-lista · "11/11qua G$ 194.000 › 3 vendas · gastos " · barra grande 15px · leva → dia
- hist-lista · "10/11ter G$ 463.500 › 6 vendas · 1 despe" · barra grande 15px · leva → dia
- hist-lista · "09/11seg G$ 188.000 › 5 vendas · 1 outro" · barra grande 15px · leva → dia
- inicio · "Guardião · 7 coisas para olhar ›" · barra grande 15px · leva → notif
- giro-no-estoque · "Lote Kazwini Pré-graduados G$ 25.000 343" · caixa 15px · muda a tela
- inventario-novo · "BR44118 Preto" · caixa 15px · abre janela "Armação Gucci de metal femi
- inventario-novo · "BR44133 Vinho" · caixa 15px · abre janela "Armação Armani de acetato f
- inventario-novo · "SP58110 Pré-graduado" · caixa 15px · muda a tela
- precos · "Contas do mês cobertas 86% faltam 23 peç" · caixa 15px · leva → desp
- precos · "Preços para corrigir 15" · caixa 15px · muda a tela
- ajustes · "Site frete, PIX, idioma" · texto 15px · leva → onl
- atacado-tabela · "Enviar catálogo a um lojista Abre o Comp" · texto 15px · abre janela "Compartilhar"
- atacado-tabela · "Ver a tabela de atacado Os preços como o" · texto 15px · abre janela "Tabela de atacado"
- atacado-tabela · "Editar tabelas Margem, mínimo e frete de" · texto 15px · abre janela "Tabela de preço"
- cambio · "DÓLAR G$ 6.487 — estável" · texto 15px · abre janela "Dólar · G$ 6.487"
- cambio · "Faltam US$ 2.838 Normal ›" · texto 15px · abre janela "Por que está normal"
- cambio · "Últimas trocas 12 ›" · texto 15px · abre janela "Últimas trocas"
- cambio · "Preços no site cotação da loja travada ›" · texto 15px · abre janela "Preços no site"
- cambio · "Como o app te protege colchão 13,0% ›" · texto 15px · abre janela "Como o app te protege"
- dash-contas-dia · "Aluguel da loja fixa · vence dia 5 G$ 90" · texto 15px · muda a tela
- dash-contas-dia · "Luz venceu há 4 dias · informe o valor G" · texto 15px · muda a tela
- dash-contas-dia · "Internet fixa · vence dia 10 G$ 120.000 " · texto 15px · muda a tela
- dash-contas-dia · "Contas de casa venceu há 7 dias · inform" · texto 15px · muda a tela
- dash-contas-dia · "Salário (retirada) fixa · vence dia 5 G$" · texto 15px · muda a tela
- dash-contas-dia · "Contador vence amanhã G$ 300.000 ⌄" · texto 15px · muda a tela
- dash-contas-dia · "Provisão de imprevistos fixa · vence dia" · texto 15px · muda a tela
- dash-folha-ver · "Contas do dia G$ 140.000 1/30 de G$ 4.20" · texto 15px · leva → desp
- dash-folha-ver · "1× YS8801 C4 · Marrom V-1966 · 19/11 às " · texto 15px · muda a tela
- dash-folha-ver · "1× SP58110 +2.00 · Preto V-1968 · 19/11 " · texto 15px · muda a tela
- dash-folha-ver · "1× SP57765 +0.75 · Preto V-1969 · 19/11 " · texto 15px · muda a tela
- dash-folha-ver · "2× SP61200 +2.00 · Preto V-1967 · 19/11 " · texto 15px · muda a tela
- dash-folha-ver · "1× SP58110 +1.25 · Preto V-1965 · 19/11 " · texto 15px · muda a tela
- dash-folha-ver · "Dias anteriores no Histórico ›" · texto 13px · leva → hist
- dash-mes-vendido · "19/11 · hojequi G$ 182.000 › 5 vendas · " · texto 15px · leva → dia
- dash-mes-vendido · "18/11qua G$ 500.000 › 10 vendas · lucro " · texto 15px · leva → dia
- dash-mes-vendido · "17/11ter G$ 459.000 › 7 vendas · 1 outro" · texto 15px · leva → dia
- dash-mes-vendido · "16/11seg G$ 148.500 › 4 vendas · 1 despe" · texto 15px · leva → dia
- dash-mes-vendido · "15/11dom G$ 23.000 › 1 venda · lucro liv" · texto 15px · leva → dia
- dash-mes-vendido · "14/11sáb G$ 502.000 › 11 vendas · 1 outr" · texto 15px · leva → dia
- dash-mes-vendido · "13/11sex G$ 257.500 › 6 vendas · gastos " · texto 15px · leva → dia
- dash-mes-vendido · "12/11qui G$ 256.500 › 7 vendas · lucro l" · texto 15px · leva → dia
- dash-mes-vendido · "11/11qua G$ 194.000 › 3 vendas · gastos " · texto 15px · leva → dia
- dash-mes-vendido · "10/11ter G$ 463.500 › 6 vendas · 1 despe" · texto 15px · leva → dia
- dash-mes-vendido · "09/11seg G$ 188.000 › 5 vendas · 1 outro" · texto 15px · leva → dia
- despesas-conta · "Aluguel da loja fixa · vence dia 5 G$ 90" · texto 15px · muda a tela
- despesas-conta · "Luz venceu há 4 dias · informe o valor G" · texto 15px · muda a tela
- despesas-conta · "Internet fixa · vence dia 10 G$ 120.000 " · texto 15px · muda a tela
- despesas-conta · "Contas de casa venceu há 7 dias · inform" · texto 15px · muda a tela
- despesas-conta · "Salário (retirada) fixa · vence dia 5 G$" · texto 15px · muda a tela
- despesas-conta · "Contador vence amanhã G$ 300.000 ⌄" · texto 15px · muda a tela
- despesas-conta · "Provisão de imprevistos fixa · vence dia" · texto 15px · muda a tela
- grp-dinheiro · "Caixa O dinheiro da loja, por moeda ›" · texto 15px · leva → caixa
- grp-dinheiro · "Despesas Contas do mês e imprevistos ›" · texto 15px · leva → desp
- grp-dinheiro · "Câmbio Cotações e trocas ›" · texto 15px · leva → fx
- hist-busca · "2× SL2210 C3 · Tartaruga V-1964 · 18/11 " · texto 15px · muda a tela
- hist-busca · "1× SP60627 +1.00 · Bege translúcido V-19" · texto 15px · muda a tela
- hist-busca · "1× SL2201 C6 · Dourado V-1948 · 17/11 às" · texto 15px · muda a tela
- hist-busca · "1× SL2201 C1 · Preto V-1954 · 17/11 às 1" · texto 15px · muda a tela
- hist-busca · "1× SL2201 C1 · Preto V-1949 · 17/11 às 1" · texto 15px · muda a tela
- hist-busca · "1× BR44118 C2 · Bege translúcido V-1925 " · texto 15px · muda a tela
- hist-busca · "1× SP60627 +3.50 · Bege translúcido V-19" · texto 15px · muda a tela
- hist-busca · "2× SP60627 +3.50 · Bege translúcido V-19" · texto 15px · muda a tela
- hist-busca · "1× SP60627 +1.50 · Bege translúcido V-19" · texto 15px · muda a tela
- hist-busca · "1× SP60627 +3.50 · Bege translúcido V-19" · texto 15px · muda a tela
- hist-busca · "2× SL2201 C1 · Preto V-1917 · 11/11 às 1" · texto 15px · muda a tela
- hist-busca · "2× SL2210 C3 · Tartaruga V-1911 · 10/11 " · texto 15px · muda a tela
- hist-busca · "1× SL2201 C6 · Dourado V-1913 · 10/11 às" · texto 15px · muda a tela
- hist-busca · "2× SL2210 C1 · Preto V-1915 · 10/11 às 1" · texto 15px · muda a tela
- hist-busca · "1× SL2201 C1 · Preto V-1907 · 09/11 às 0" · texto 15px · muda a tela
- hist-busca · "1× SL2210 C3 · Tartaruga V-1899 · 07/11 " · texto 15px · muda a tela
- hist-busca · "1× SL2201 C1 · Preto V-1895 · 07/11 às 1" · texto 15px · muda a tela
- hist-busca · "2× SL2210 C3 · Tartaruga V-1896 · 07/11 " · texto 15px · muda a tela
- hist-busca · "1× SP60627 +3.50 · Bege translúcido V-19" · texto 15px · muda a tela
- hist-busca · "2× SL2210 C1 · Preto V-1898 · 07/11 às 0" · texto 15px · muda a tela
- hist-busca · "3× SL2210 C3 · Tartaruga V-1886 · 06/11 " · texto 15px · muda a tela
- hist-busca · "1× SL2201 C6 · Dourado V-1891 · 06/11 às" · texto 15px · muda a tela
- hist-busca · "1× SP60627 +2.00 · Bege translúcido V-18" · texto 15px · muda a tela
- hist-busca · "2× SL2201 C6 · Dourado V-1880 · 05/11 às" · texto 15px · muda a tela
- hist-busca · "1× SP60627 +2.00 · Bege translúcido V-18" · texto 15px · muda a tela
- hist-busca · "1× SP60627 +1.00 · Bege translúcido V-18" · texto 15px · muda a tela
- hist-busca · "1× SL2201 C6 · Dourado V-1871 · 03/11 às" · texto 15px · muda a tela
- hist-busca · "1× SL2201 C1 · Preto V-1873 · 03/11 às 1" · texto 15px · muda a tela
- hist-busca · "1× SP60627 +1.00 · Bege translúcido V-18" · texto 15px · muda a tela
- hist-busca · "3× SP60627 +3.50 · Bege translúcido V-18" · texto 15px · muda a tela
- hist-dia · "1× YS8801 C4 · Marrom V-1966 · 19/11 às " · texto 15px · muda a tela
- hist-dia · "1× SP58110 +2.00 · Preto V-1968 · 19/11 " · texto 15px · muda a tela
- hist-dia · "1× SP57765 +0.75 · Preto V-1969 · 19/11 " · texto 15px · muda a tela
- hist-dia · "2× SP61200 +2.00 · Preto V-1967 · 19/11 " · texto 15px · muda a tela
- hist-dia · "1× SP58110 +1.25 · Preto V-1965 · 19/11 " · texto 15px · muda a tela
- hist-dia · "Dias anteriores no Histórico ›" · texto 15px · leva → hist
- inventario-ficha · "Sem detalhesem foto 343 un." · texto 14px · nada visível
- inventario-fornecedores · "Lista de compras · 18 acabando ›" · texto 15px · leva → dash
- marketing · "Seg · Post · 20h Peça do objetivo — Ócul" · texto 14px · abre janela "Post"
- marketing · "Ter · Status · 12h Status do dia — Óculo" · texto 14px · abre janela "Status"
- marketing · "Qua · Carrossel · 20h Carrossel com 4 pe" · texto 14px · abre janela "Carrossel"
- marketing · "Qui · Story · 20h Bastidores / chegada —" · texto 14px · abre janela "Story"
- marketing · "Sex · Vídeo · 20h Vídeo de 15 s — Óculos" · texto 14px · abre janela "Vídeo"
- marketing · "Sáb · Post · 20h Oferta ou mais vendido " · texto 14px · abre janela "Post"
- pendencias · "Ver todas as conferências do Guardião ›" · texto 15px · abre janela "Guardião"
- precos · "15 preços para corrigir 10 com sugestão " · texto 15px · muda a tela
- reservas-para-onde · "Objetivos da loja › guardado no Caixa" · texto 15px · leva → caixa

## Dobra ⌄ (abre no lugar) — 41

Caras hoje: texto 15px (36) · barra grande 15px (4) · texto 13px (1)

- hist-lista · "Semana 02/11 a 08/11 G$ 2.595.500 · 42 v" · barra grande 15px · muda a tela
- hist-lista · "Semana 01/11 G$ 120.000 · 2 vendas · 1 d" · barra grande 15px · muda a tela
- hist-lista · "Semana 26/10 a 31/10 G$ 1.230.500 · 30 v" · barra grande 15px · muda a tela
- hist-lista · "Semana 19/10 a 25/10 G$ 1.452.500 · 31 v" · barra grande 15px · muda a tela
- ajustes · "Impressora Nenhuma" · texto 15px · alterna
- ajustes · "Tema Auto" · texto 15px · alterna
- ajustes · "Segurança Desligada" · texto 15px · alterna
- ajustes · "Pedidos do site Baixa manual" · texto 15px · alterna
- ajustes · "Sons e avisos Ligados" · texto 15px · alterna
- ajustes · "Atualização 5.45.0" · texto 15px · alterna
- ajustes · "Cópias e nuvem Nenhuma cópia" · texto 15px · alterna
- ajustes · "Pagamento automático Desligado" · texto 15px · alterna
- caixa-acoes · "Ver todos os movimentos ⌄" · texto 13px · muda a tela
- caixa-reservado · "Ver para onde vai o que já tem dono: rep" · texto 15px · muda a tela
- caixa-reservado · "Próximos 30 dias Saldo G$ 6.454.632 · co" · texto 15px · muda a tela
- dash-contas-dia · "Imprevistos do mês Gasto G$ 60.000 de G$" · texto 15px · muda a tela
- dash-contas-dia · "Contas pagas neste mês 4 conta(s) paga(s" · texto 15px · muda a tela
- dash-mes-vendido · "Semana 02/11 a 08/11 G$ 2.595.500 · 42 v" · texto 15px · muda a tela
- dash-mes-vendido · "Semana 01/11 G$ 120.000 · 2 vendas · 1 d" · texto 15px · muda a tela
- dash-mes-vendido · "Semana 26/10 a 31/10 G$ 1.230.500 · 30 v" · texto 15px · muda a tela
- dash-mes-vendido · "Semana 19/10 a 25/10 G$ 1.452.500 · 31 v" · texto 15px · muda a tela
- dash-semana · "Resultado do mês Lucro real, o que mais " · texto 15px · muda a tela
- dash-semana · "Quanto separar do que você vendeu Cada c" · texto 15px · muda a tela
- dash-semana · "Vendas do período Cada venda com o valor" · texto 15px · muda a tela
- despesas-conta · "Imprevistos do mês Gasto G$ 60.000 de G$" · texto 15px · muda a tela
- despesas-conta · "Contas pagas neste mês 4 conta(s) paga(s" · texto 15px · muda a tela
- despesas-nova · "Nova despesa Água, luz, aluguel… fixa ou" · texto 15px · muda a tela
- giro-lista-compras · "Lista de compras 8 produto(s) vão acabar" · texto 15px · muda a tela
- giro-lista-compras · "como calcula ⌄" · texto 15px · muda a tela
- giro-lista-compras · "ver os 18 ⌄" · texto 15px · muda a tela
- giro-lista-compras · "Vitrine da semana diga quantos lugares t" · texto 15px · muda a tela
- giro-lista-compras · "Retorno do estoque cada US$ 1 investido " · texto 15px · muda a tela
- giro-lista-compras · "Curva ABC quais produtos dão 80% do lucr" · texto 15px · muda a tela
- giro-retorno · "Lista de compras 8 produto(s) vão acabar" · texto 15px · muda a tela
- giro-retorno · "Vitrine da semana diga quantos lugares t" · texto 15px · muda a tela
- giro-retorno · "Retorno do estoque cada US$ 1 investido " · texto 15px · muda a tela
- giro-retorno · "Curva ABC quais produtos dão 80% do lucr" · texto 15px · muda a tela
- inventario-fornecedores · "Ver peças (57) ⌄" · texto 15px · muda a tela
- precos · "Contas, taxas e meta contas do mês, form" · texto 15px · muda a tela
- reservas-para-onde · "Ver para onde vai o que já tem dono: rep" · texto 15px · muda a tela
- reservas-para-onde · "Próximos 30 dias Saldo G$ 6.456.174 · co" · texto 15px · muda a tela

## Adicionar "+" redondo — 4

Caras hoje: ícone redondo 15px (3) · barra grande 16px (1)

- despesas-nova · "Salvar" · barra grande 16px · muda a tela
- clientes · "Novo cliente" · ícone redondo 15px · abre janela "Novo cliente"
- giro-no-estoque · "Adicionar" · ícone redondo 15px · abre janela "Adicionar" / DUAS JANELAS
- inventario-fornecedores · "Adicionar" · ícone redondo 15px · abre janela "Adicionar" / DUAS JANELAS

## "+" em texto — 7

Caras hoje: ícone redondo 15px (4) · texto 15px (3)

- atacado-lotes · "+ Criar lote" · texto 15px · abre janela "Novo lote"
- catalogo-carrinho · "+ Adicionar outra peça" · texto 15px · muda a tela
- catalogo-pagamento · "+ Receber parte em outra moeda" · texto 15px · muda a tela
- atacado-lojistas · "Novo acesso" · ícone redondo 15px · abre janela "Novo acesso ao atacado"
- atacado-tabela · "Novo acesso" · ícone redondo 15px · abre janela "Novo acesso ao atacado"
- dash-contas-dia · "Nova despesa" · ícone redondo 15px · abre janela "Nova despesa"
- despesas-conta · "Nova despesa" · ícone redondo 15px · abre janela "Nova despesa"

## Principal — 15

Caras hoje: barra grande 16px (11) · pílula 15px (2) · caixa 16px (1) · texto 15px (1)

- atacado-novo-acesso · "Enviar convite" · barra grande 16px · muda a tela
- caixa-conferir · "Conferir" · barra grande 16px · muda a tela
- caixa-novo-objetivo · "Guardar objetivo" · barra grande 16px · muda a tela
- caixa-retirar · "Retirar" · barra grande 16px · muda a tela
- cambio-troca · "Registrar troca" · barra grande 16px · muda a tela
- catalogo-carrinho · "Ir para o pagamento" · barra grande 16px · muda a tela
- catalogo-pagamento · "Finalizar venda" · barra grande 16px · abre janela "Vender abaixo do piso?"
- catalogo-peca · "Vender · G$ 25.000" · barra grande 16px · muda a tela
- clientes-novo · "Salvar" · barra grande 16px · muda a tela
- giro-lista-compras · "Marcar como pedido" · barra grande 16px · muda a tela
- inventario-editar · "Salvar alterações" · barra grande 16px · muda a tela
- giro-vitrine · "Salvar" · caixa 16px · muda a tela
- despesas-conta · "Salvar" · pílula 15px · muda a tela
- despesas-imprevistos · "Registrar imprevisto" · pílula 15px · muda a tela
- guardiao · "Conferir ›" · texto 15px · nada visível

## Secundário — 26

Caras hoje: caixa 13px (15) · texto 15px (5) · pílula 15px (2) · barra grande 16px (2) · caixa 15px (1) · texto 14px (1)

- marketing-post · "Postar agora" · barra grande 16px · muda a tela
- precos-corrigir · "Corrigir os 10 de uma vez" · barra grande 16px · muda a tela
- marketing-post · "Me lembra às 20h" · caixa 15px · muda a tela
- precos-corrigir · "Usar G$ 52.500" · caixa 13px · muda a tela
- precos-corrigir · "Usar G$ 52.500" · caixa 13px · muda a tela
- precos-corrigir · "Usar G$ 37.500" · caixa 13px · muda a tela
- precos-corrigir · "Usar G$ 52.500" · caixa 13px · muda a tela
- precos-corrigir · "Usar G$ 37.500" · caixa 13px · muda a tela
- precos-corrigir · "Usar G$ 77.000" · caixa 13px · muda a tela
- precos-corrigir · "Usar G$ 77.000" · caixa 13px · muda a tela
- precos-corrigir · "Usar G$ 77.000" · caixa 13px · muda a tela
- precos-corrigir · "Usar G$ 93.000" · caixa 13px · muda a tela
- precos-corrigir · "Usar G$ 93.000" · caixa 13px · muda a tela
- precos-corrigir · "Informar" · caixa 13px · muda a tela
- precos-corrigir · "Informar" · caixa 13px · muda a tela
- precos-corrigir · "Informar" · caixa 13px · muda a tela
- precos-corrigir · "Informar" · caixa 13px · muda a tela
- precos-corrigir · "Informar" · caixa 13px · muda a tela
- cambio-site · "Atualizar preços do site agora" · pílula 15px · muda a tela
- giro-lista-compras · "Mandar ao fornecedor" · pílula 15px · abre janela "Mandar ao fornecedor"
- cambio-prot · "Trocar G$ 3.381.901 por dólar no Câmbio " · texto 15px · abre janela "Registrar troca"
- cambio-troca · "⇄ Inverter" · texto 15px · muda a tela
- pendencias · "Ver ›" · texto 15px · abre janela "🖤 Black Friday"
- precos · "por quê" · texto 14px · abre janela "🖤 Black Friday"
- precos · "Calculadora de preço" · texto 15px · abre janela "Calculadora de preço"
- precos · "E se…?" · texto 15px · abre janela "E se…?"

## Perigo — 8

Caras hoje: texto 15px (5) · ícone redondo 15px (1) · texto 14px (1) · pílula 13px (1)

- hist-semana · "Limpar tudo" · pílula 13px · muda a tela
- catalogo-carrinho · "Tirar" · texto 15px · muda a tela
- catalogo-carrinho · "Tirar" · texto 15px · muda a tela
- catalogo-carrinho · "Esvaziar carrinho" · texto 15px · muda a tela
- despesas-imprevistos · "✕" · texto 14px · muda a tela
- inventario-fornecedores · "Remover lote" · texto 15px · abre janela "Remover o lote?" / pede con
- pendencias · "Limpar histórico" · texto 15px · muda a tela
- despesas-conta · "Remover Aluguel da loja" · ícone redondo 15px · muda a tela

## Desfazer — 16

Caras hoje: texto 12px (8) · texto 15px (8)

- caixa-acoes · "Desfazer" · texto 12px · muda a tela
- caixa-acoes · "Desfazer" · texto 12px · muda a tela
- caixa-acoes · "Desfazer" · texto 12px · muda a tela
- caixa-movimentos · "Desfazer" · texto 12px · nada visível
- caixa-movimentos · "Desfazer" · texto 12px · nada visível
- caixa-movimentos · "Desfazer" · texto 12px · nada visível
- caixa-retirar · "Desfazer" · texto 12px · muda a tela
- caixa-retirar · "Desfazer" · texto 12px · muda a tela
- cambio-trocas · "Desfazer" · texto 15px · muda a tela
- cambio-trocas · "Desfazer" · texto 15px · muda a tela
- cambio-trocas · "Desfazer" · texto 15px · muda a tela
- cambio-trocas · "Desfazer" · texto 15px · nada visível
- cambio-trocas · "Desfazer" · texto 15px · muda a tela
- cambio-trocas · "Desfazer" · texto 15px · muda a tela
- cambio-trocas · "Desfazer" · texto 15px · muda a tela
- cambio-trocas · "Desfazer" · texto 15px · nada visível

## Ícone redondo — 36

Caras hoje: ícone redondo 15px (27) · ícone quadrado 22px (2) · texto 15px (2) · pílula 12.5px (2) · ícone redondo 14px (1) · pílula 15px (1) · texto 14px (1)

- inventario-editar · "" · pílula 15px · nada visível
- inventario-ficha · "Ficha 4/6" · pílula 12.5px · abre janela "Ficha do produto"
- inventario-ficha-historico · "Ficha 4/6" · pílula 12.5px · abre janela "Ficha do produto"
- giro-no-estoque · "Buscar com a câmera" · texto 15px · abre janela "Buscar com a câmera"
- giro-no-estoque · "Filtros e ordem" · texto 15px · abre janela "Filtros do inventário" / al
- inventario-fornecedores · "Editar" · texto 14px · abre janela "Editar lote"
- catalogo-peca · "−" · ícone quadrado 22px · nada visível
- catalogo-peca · "+" · ícone quadrado 22px · nada visível
- ajustes · "12" · ícone redondo 15px · leva → notif
- atacado-lojistas · "12" · ícone redondo 15px · leva → notif
- atacado-tabela · "12" · ícone redondo 15px · leva → notif
- caixa-acoes · "12" · ícone redondo 15px · leva → notif
- caixa-acoes · "Ações do caixa" · ícone redondo 15px · muda a tela
- cambio · "12" · ícone redondo 15px · leva → notif
- catalogo-carrinho · "12" · ícone redondo 15px · leva → notif
- catalogo-peca · "Compartilhar esta peça" · ícone redondo 14px · abre janela "Compartilhar"
- clientes · "12" · ícone redondo 15px · leva → notif
- dash-contas-dia · "12" · ícone redondo 15px · leva → notif
- dash-folha-ver · "12" · ícone redondo 15px · leva → notif
- dash-mes-vendido · "12" · ícone redondo 15px · leva → notif
- dash-mes-vendido · "Ir para uma data" · ícone redondo 15px · nada visível
- dash-mes-vendido · "Filtros" · ícone redondo 15px · muda a tela
- dash-semana · "12" · ícone redondo 15px · leva → notif
- despesas-conta · "12" · ícone redondo 15px · leva → notif
- giro-no-estoque · "12" · ícone redondo 15px · leva → notif
- grp-dinheiro · "12" · ícone redondo 15px · leva → notif
- hist-dia · "12" · ícone redondo 15px · leva → notif
- hist-lista · "12" · ícone redondo 15px · leva → notif
- hist-lista · "Ir para uma data" · ícone redondo 15px · nada visível
- hist-lista · "Filtros" · ícone redondo 15px · muda a tela
- inicio · "12" · ícone redondo 15px · leva → notif
- inventario-fornecedores · "12" · ícone redondo 15px · leva → notif
- marketing · "12" · ícone redondo 15px · leva → notif
- marketing-post · "" · ícone redondo 15px · nada visível
- pendencias · "12" · ícone redondo 15px · leva → inicio
- vender · "12" · ícone redondo 15px · leva → notif

## Escolha (abas / dois lados) — 96

Caras hoje: texto 14px (42) · texto 15px (17) · pílula 13px (17) · pílula 15px (7) · caixa 13px (4) · ícone redondo 13px (3) · caixa 14px (3) · caixa 15px (2) · texto 12.5px (1)

- atacado-novo-acesso · "Lojista fixo não vence" · caixa 15px · nada visível
- atacado-novo-acesso · "Visitante vence em 3 dias" · caixa 15px · muda a tela
- marketing · "Girar o parado" · caixa 13px · muda a tela
- marketing · "Novos clientes BR" · caixa 13px · muda a tela
- marketing · "Mais solar" · caixa 13px · muda a tela
- marketing · "Lançamentos" · caixa 13px · muda a tela
- reservas-30dias · "30 dias" · caixa 14px · muda a tela
- reservas-30dias · "60 dias" · caixa 14px · muda a tela
- reservas-30dias · "90 dias" · caixa 14px · muda a tela
- cambio · "Venda" · pílula 15px · muda a tela
- hist-semana · "Venda" · pílula 13px · muda a tela
- hist-semana · "Estorno" · pílula 13px · muda a tela
- hist-semana · "Conta paga" · pílula 13px · muda a tela
- hist-semana · "Retirada" · pílula 13px · muda a tela
- hist-semana · "Imprevisto" · pílula 13px · muda a tela
- hist-semana · "Melhorias" · pílula 13px · muda a tela
- hist-semana · "Compra de lote" · pílula 13px · muda a tela
- hist-semana · "Descarte" · pílula 13px · muda a tela
- hist-semana · "Conferência" · pílula 13px · muda a tela
- hist-semana · "Câmbio / estoque" · pílula 13px · muda a tela
- hist-semana · "Dinheiro" · pílula 13px · muda a tela
- hist-semana · "Maquininha débito" · pílula 13px · muda a tela
- hist-semana · "Maquininha crédito" · pílula 13px · muda a tela
- hist-semana · "Econômico" · pílula 13px · muda a tela
- hist-semana · "Intermediário" · pílula 13px · muda a tela
- hist-semana · "Luxo" · pílula 13px · muda a tela
- hist-semana · "US$" · pílula 13px · muda a tela
- marketing · "Post" · pílula 15px · abre janela "Post"
- marketing · "Story" · pílula 15px · abre janela "Story"
- marketing · "Status" · pílula 15px · abre janela "Status"
- marketing · "Carrossel" · pílula 15px · abre janela "Carrossel"
- marketing · "Vídeo" · pílula 15px · abre janela "Vídeo"
- marketing · "Roteiro" · pílula 15px · abre janela "Roteiro de vídeo"
- atacado-lojistas · "Mensagens" · texto 15px · muda a tela
- atacado-lojistas · "Lojistas" · texto 15px · nada visível
- atacado-lojistas · "Lotes" · texto 15px · muda a tela
- atacado-lojistas · "Tabela" · texto 15px · muda a tela
- atacado-tabela · "Mensagens" · texto 15px · muda a tela
- atacado-tabela · "Lojistas" · texto 15px · muda a tela
- atacado-tabela · "Lotes" · texto 15px · muda a tela
- atacado-tabela · "Tabela" · texto 15px · nada visível
- caixa-reservado · "G$" · texto 14px · nada visível
- caixa-reservado · "R$" · texto 14px · muda a tela
- caixa-reservado · "US$" · texto 14px · muda a tela
- caixa-retirar · "G$" · texto 14px · nada visível
- caixa-retirar · "US$" · texto 14px · alterna
- caixa-retirar · "R$" · texto 14px · alterna
- cambio-dolar · "30 dias" · texto 14px · muda a tela
- cambio-dolar · "90 dias" · texto 14px · muda a tela
- cambio-dolar · "1 ano" · texto 14px · muda a tela
- cambio-troca · "G$" · texto 14px · muda a tela
- cambio-troca · "US$" · texto 14px · muda a tela
- cambio-troca · "R$" · texto 14px · muda a tela
- cambio-troca · "G$" · texto 14px · muda a tela
- cambio-troca · "US$" · texto 14px · muda a tela
- cambio-troca · "R$" · texto 14px · muda a tela
- catalogo-pagamento · "Dinheiro" · texto 14px · nada visível
- catalogo-pagamento · "Pix" · texto 14px · nada visível
- catalogo-pagamento · "Débito" · texto 14px · muda a tela
- catalogo-pagamento · "Crédito" · texto 14px · muda a tela
- catalogo-pagamento · "G$ Guarani" · texto 14px · nada visível
- catalogo-pagamento · "R$ Real" · texto 14px · muda a tela
- catalogo-pagamento · "US$ Dólar" · texto 14px · muda a tela
- catalogo-peca · "Ficha no Inventário ›" · texto 15px · leva → estoque
- clientes-novo · "Paraguaio" · texto 14px · nada visível
- clientes-novo · "Estrangeiro" · texto 14px · alterna
- giro-no-estoque · "Produtos" · texto 15px · nada visível
- giro-no-estoque · "Fornecedores 1" · texto 15px · muda a tela
- guardiao · "Silenciar 7 dias" · texto 12.5px · nada visível
- inventario-editar · "Modelo" · texto 14px · nada visível
- inventario-editar · "Cores e fotos" · texto 14px · muda a tela
- inventario-ficha · "Estoque" · texto 14px · nada visível
- inventario-ficha · "Histórico" · texto 14px · alterna
- inventario-ficha · "Site" · texto 14px · alterna
- inventario-ficha · "Preço" · texto 14px · alterna
- inventario-ficha · "Vender no Catálogo ›" · texto 15px · leva → vendas
- inventario-ficha-historico · "Estoque" · texto 14px · muda a tela
- inventario-ficha-historico · "Histórico" · texto 14px · nada visível
- inventario-ficha-historico · "Site" · texto 14px · alterna
- inventario-ficha-historico · "Preço" · texto 14px · alterna
- inventario-ficha-historico · "Vender no Catálogo ›" · texto 15px · leva → vendas
- inventario-fornecedores · "Produtos" · texto 15px · muda a tela
- inventario-fornecedores · "Fornecedores 1" · texto 15px · nada visível
- marketing-post · "Versão A" · texto 14px · nada visível
- marketing-post · "Versão B" · texto 14px · alterna
- marketing-post · "PT" · texto 14px · alterna
- marketing-post · "ES" · texto 14px · alterna
- marketing-post · "PT+ES" · texto 14px · nada visível
- pendencias · "Ver preços ›" · texto 15px · muda a tela
- pendencias · "Ver reposição ›" · texto 15px · muda a tela
- reservas-para-onde · "G$" · texto 14px · nada visível
- reservas-para-onde · "R$" · texto 14px · muda a tela
- reservas-para-onde · "US$" · texto 14px · muda a tela
- hist-semana · "Pix" · ícone redondo 13px · muda a tela
- hist-semana · "G$" · ícone redondo 13px · muda a tela
- hist-semana · "R$" · ícone redondo 13px · muda a tela

## Opção de janela — 12

Caras hoje: texto 15px (7) · pílula 15px (2) · texto 15.5px (2) · ícone redondo 15px (1)

- inventario-novo · "Ler haste" · pílula 15px · abre janela "Leitor de código"
- inventario-novo · "Foto" · pílula 15px · abre janela "Foto da etiqueta, da caixa 
- caixa-acoes · "Retirar" · texto 15px · abre janela "Retirada do dono"
- caixa-acoes · "Conferir" · texto 15px · abre janela "Conferir o caixa"
- dash-folha-periodo · "Hoje quinta-feira, 19 de novembro ✓" · texto 15px · muda a tela
- dash-folha-periodo · "Esta semana 16 a 19 de novembro" · texto 15px · leva → dash
- dash-folha-periodo · "Este mês 1 a 19 de novembro" · texto 15px · leva → dash
- dash-folha-periodo · "Últimos 30 dias 21 de outubro a 19 de no" · texto 15px · leva → dash
- dash-folha-periodo · "Escolher datas de um dia até outro ›" · texto 15px · leva → dash
- inventario-novo · "Chegou mercadoria" · texto 15.5px · abre janela "Chegou mercadoria"
- inventario-novo · "Preencher à mão" · texto 15.5px · abre janela "Novo modelo"
- caixa-acoes · "Novo objetivo" · ícone redondo 15px · abre janela "Novo objetivo"

## Passo − / + — 14

Caras hoje: texto 18px (10) · texto 20px (4)

- catalogo-carrinho · "−" · texto 20px · nada visível
- catalogo-carrinho · "+" · texto 20px · nada visível
- catalogo-carrinho · "−" · texto 20px · nada visível
- catalogo-carrinho · "+" · texto 20px · nada visível
- giro-lista-compras · "−" · texto 18px · muda a tela
- giro-lista-compras · "+" · texto 18px · muda a tela
- giro-lista-compras · "−" · texto 18px · muda a tela
- giro-lista-compras · "+" · texto 18px · muda a tela
- giro-lista-compras · "−" · texto 18px · muda a tela
- giro-lista-compras · "+" · texto 18px · muda a tela
- giro-lista-compras · "−" · texto 18px · muda a tela
- giro-lista-compras · "+" · texto 18px · muda a tela
- giro-lista-compras · "−" · texto 18px · muda a tela
- giro-lista-compras · "+" · texto 18px · muda a tela

## Liga / desliga — 19

Caras hoje: ícone redondo 15px (15) · pílula 15px (2) · texto 13px (1) · texto 15px (1)

- inventario-ficha · "% Oferta" · pílula 15px · abre janela "OFERTA"
- inventario-ficha · "No site" · pílula 15px · muda a tela
- marketing · "Feito" · texto 13px · muda a tela
- precos · "Preço automático desligado · você define" · texto 15px · muda a tela
- catalogo-carrinho · "Modo cliente (iPad da loja)" · ícone redondo 15px · muda a tela
- dash-contas-dia · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · muda a tela
- dash-contas-dia · "Marcar como paga neste mês" · ícone redondo 15px · nada visível
- dash-contas-dia · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · muda a tela
- dash-contas-dia · "Marcar como paga neste mês" · ícone redondo 15px · nada visível
- dash-contas-dia · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · muda a tela
- dash-contas-dia · "Marcar como paga neste mês" · ícone redondo 15px · muda a tela
- dash-contas-dia · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · muda a tela
- despesas-conta · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · muda a tela
- despesas-conta · "Marcar como paga neste mês" · ícone redondo 15px · nada visível
- despesas-conta · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · muda a tela
- despesas-conta · "Marcar como paga neste mês" · ícone redondo 15px · nada visível
- despesas-conta · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · muda a tela
- despesas-conta · "Marcar como paga neste mês" · ícone redondo 15px · muda a tela
- despesas-conta · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · muda a tela

## Número tocável — 4

Caras hoje: ?  (2) · texto 15px (2)

- dash-semana · "G$ 1.289.500" ·   · nada visível
- dash-semana · "G$ 446.000" ·   · sumiu
- giro-no-estoque · "EM ESTOQUE (FILTRO) › 470" · texto 15px · alterna
- inventario-fornecedores · "EM ESTOQUE (FILTRO) › 400" · texto 15px · alterna

## Cartão de peça — 12

Caras hoje: caixa 15px (11) · barra grande 15px (1)

- marketing · "Óculos solar #13 27 vendidas em 30 dias " · barra grande 15px · abre janela "Status"
- giro-no-estoque · "Óculos de leitura de acetato unissex 2 m" · caixa 15px · muda a tela
- giro-no-estoque · "Óculos de leitura Kazwini de acetato mas" · caixa 15px · muda a tela
- giro-no-estoque · "Óculos de leitura de plástico feminino C" · caixa 15px · muda a tela
- giro-no-estoque · "Óculos de leitura #15 Pré-graduados G$ 2" · caixa 15px · muda a tela
- giro-no-estoque · "Armação Gucci de metal feminino Código B" · caixa 15px · muda a tela
- giro-no-estoque · "Armação Ray-Ban de metal masculino Códig" · caixa 15px · muda a tela
- giro-no-estoque · "Armação Armani de acetato feminino Códig" · caixa 15px · muda a tela
- giro-no-estoque · "Armação #10 Armações G$ 45.000! 7 em est" · caixa 15px · muda a tela
- giro-no-estoque · "Óculos solar Ray-Ban de metal masculino " · caixa 15px · muda a tela
- giro-no-estoque · "Óculos solar Kazwini de tr90 feminino Có" · caixa 15px · muda a tela
- giro-no-estoque · "Óculos solar #13 Solares G$ 60.000! 9 em" · caixa 15px · muda a tela

## Mostrar mais — 3

Caras hoje: texto 15px (2) · pílula 15px (1)

- hist-busca · "Mostrar mais (598)" · pílula 15px · muda a tela
- dash-mes-vendido · "Carregar mais 30 dias ⌄" · texto 15px · muda a tela
- hist-lista · "Carregar mais 30 dias ⌄" · texto 15px · muda a tela

## Título (não é botão) — 8

Caras hoje: texto 28px (8)

- caixa-reservado · "Reservas" · texto 28px · nada visível
- dash-folha-ver · "Dashboard" · texto 28px · nada visível
- dash-semana · "Dashboard" · texto 28px · nada visível
- giro-lista-compras · "Giro" · texto 28px · nada visível
- giro-retorno · "Giro" · texto 28px · nada visível
- hist-dia · "Dashboard" · texto 28px · nada visível
- precos · "Preços" · texto 28px · nada visível
- reservas-para-onde · "Reservas" · texto 28px · nada visível

## Fechar / × — 1

Caras hoje: texto 15px (1)

- caixa-conferir · "Fechar" · texto 15px · muda a tela
