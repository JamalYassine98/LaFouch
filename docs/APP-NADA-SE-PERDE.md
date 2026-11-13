# App — "nada se perde" (14/11/2026)

Cada lugar do app de hoje e onde fica na estrutura nova (S228: Início · Produtos · Vendas · Dinheiro · Mais). Regra: nenhuma função some; só muda de endereço.
Na implementação, o porteiro confere sozinho: toda ação (`data-act`) que existe hoje tem de continuar alcançável; se uma sumir, a versão não sai.

## Telas

| Hoje | Lugar novo |
|---|---|
| Início | Início (pendências, vendido hoje, 4 atalhos) |
| Catálogo (vendas) | Produtos › Vender |
| Inventário › Produtos | Produtos › Cuidar do estoque |
| Inventário › Fornecedores | Produtos › Cuidar › aba Fornecedores (CONTINUA — no esboço S228 eu tinha escondido, erro meu) |
| Inventário › Reposição | Produtos › Cuidar › aba Reposição (CONTINUA) |
| Dia | Vendas › Hoje |
| Histórico | Vendas › Semana / Mês / Ano (com a busca e "Fechar o dia") |
| Números › Resumo, Giro | Vendas (resumo do período) |
| Números › Dinheiro | Dinheiro › Caixa |
| Números › Preços (Contador) | Dinheiro › aba Preços (4ª aba) |
| Números › Online | Site › Visitas |
| Caixa (e Objetivos da loja) | Dinheiro › Caixa |
| Despesas | Dinheiro › Contas a pagar |
| Câmbio | Dinheiro › Câmbio |
| Pedidos online | Site › Pedidos |
| Loja online | Site › Loja |
| Clientes | Mais › Clientes › aba Clientes |
| Notificações + sino + Guardião | Pendências (abre pelo sino) |
| Ajustes | Mais › Ajustes |

## Atalhos do Início (17)

| Atalho | Lugar novo |
|---|---|
| Câmbio · Despesas · Dinheiro | Dinheiro (abas) |
| Histórico · Resumo | Vendas |
| Giro | Produtos › Cuidar › Reposição |
| Preços | Dinheiro › Preços |
| Estúdio | Produtos › Cuidar (botão "Fotos") e dentro da Ficha |
| Contagem | Produtos › Cuidar (número do estoque, "toque para contar") |
| Fornecedores | Produtos › Cuidar › Fornecedores |
| Pedidos online · Mensagens · Analisador | Site (abas Pedidos · Mensagens · Visitas) |
| Temática | Site › aba Temática |
| Atacado · Clientes | Mais › Clientes (abas Clientes · Atacado · Lotes · Cartões) |
| Marketing | Mais › Marketing (e "Compartilhar" na ficha da peça) |

## Botões de tela que continuam onde estão

Modo cliente / Modo loja (em Produtos › Vender) · + Adicionar (em Produtos › Cuidar; vira o "+" único da Ficha) · Buscar com a câmera · Filtros e ordem · Ações do caixa · Novo objetivo · Registrar troca · Estornar / Ver detalhes · Novo cliente · Novo acesso atacado.

## Ajustes ao esboço S228 que esta lista pede

1. Produtos › Cuidar mantém as abas Produtos · Fornecedores · Reposição.
2. Dinheiro ganha a 4ª aba: Preços.
3. Site ganha a aba Temática.
4. Mais mostra: Clientes · Site · Marketing · Ajustes.

## Limite

A lista está no nível de tela, aba e atalho. O nível de botão (todas as ações `data-act`) ainda não foi listado um por um; é o teste automático que garante isso na implementação.
