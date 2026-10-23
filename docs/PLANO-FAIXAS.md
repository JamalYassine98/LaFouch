# Plano: linhas, faixas, pacotes, brindes, desconto com piso e metas

Decisões já tomadas: faixas criadas e nomeadas pelo dono; piso calculado pelo custo; abaixo do piso o app avisa e pede confirmação; meta mensal em US$ vale para a loja toda.

## 1. Estrutura (árvore)
Grupo (Pré-graduados, Solares, Armações, Estojos/Variados) → Produto → variações:
- Pré-graduados: grau; cores quando houver.
- Armações: classe de cor C1–C6 e cor.
- Solares: polarizado ou não polarizado; cor da armação; lente espelhada como cor de lente (ex.: armação transparente com espelhado azul).
O código continua sendo a chave do produto; novos códigos de uma mesma marca entram como produtos novos, sem exigir idênticos.

## 2. Faixas de qualidade
Criadas e nomeadas pelo dono, por grupo. Sugestão inicial: Econômico, Intermediário, Luxo. Cada produto (ou lote) pertence a uma faixa; a faixa guarda margem mínima (%) e meta de referência. Serve para separar custos diferentes dentro do mesmo grupo (ex.: leitura em metal econômico x metal/acetato de luxo).

## 3. Entrada por pacote
Na compra de pré-graduados: "pacotes de N peças" (20, 24, 30 ou outro) por grau/produto, com cores variadas ou uma só. A quantidade de peças por pacote é digitada na hora, porque o catálogo do fornecedor nem sempre informa.

## 4. Brindes (estojo e capinha)
Estojo/capinha entram como lote, com custo. Na venda: opção "com brinde", escolhendo qual. A peça sai do estoque de brindes e o custo entra como gasto da venda (o "gasto fantasma" passa a aparecer no lucro). Estojo de marca pode ser vendido normalmente.

## 5. Desconto com piso
Na venda, campo de desconto. Piso por peça = reposição (ao câmbio do dia) + contas por peça + colchão cambial + margem mínima da faixa. Acima do piso: segue normal. Abaixo: mostra quanto perde e pede confirmação ("vender mesmo assim").

## 6. Meta em US$ e alertas de reposição
Meta mensal de lucro em US$ para a loja toda, com o quanto falta e, por baixo, o lucro por faixa. Alertas de reposição por valor: produto/faixa que mais gera lucro e está acabando (dias de estoque pela velocidade de venda), no lugar do corte fixo de 5 peças.

## Ordem de entrega
1. Faixas e estrutura. 2. Pacotes na entrada. 3. Brindes. 4. Desconto com piso. 5. Meta e alertas.
Cada etapa sai com testes e passa pelo APK antes da seguinte.

## Estado (implementado)
Tudo acima foi feito, mais: backup (exportar/importar) e aba Ajustes (meta, faixas, estações do ano, contagem de estoque); filtro recolhível nas Vendas; desconto com motivo; alertas por dias de estoque com lista de compras; estoque parado com preço de saída; curva ABC; sugestão de margem por faixa (sobe/desce 3 pontos, o dono aplica ou ignora); aviso de preço abaixo do piso quando o câmbio muda.
Código novo: src/53-faixas.js, src/54-analises.js, src/96-ajustes.js.
Limite conhecido: cada venda é de uma peça/variante; o "resultado da venda inteira" é mostrado somando todas as vendas abaixo do piso por motivo contra o lucro total do período.
