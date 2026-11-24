# Teste do gabarito — 24/11 (ESBOCO)

Método: app REAL publicado (escuro, celular) ao lado do último esboço aprovado de cada tela (`work/titan/lado.py`, fotos em `gabarito/lado_*.jpg`). 18 telas.

## Resultado por tela
| Tela | Esboço | App × aprovado |
|---|---|---|
| Preços | 46b | igual, menos "‹ INÍCIO" (lista 2a) |
| Regras | 62 | DIFERENTE: valores colados no título (aprovado: valor à direita) e sem ícones de linha |
| Ofertas | 63 | DIFERENTE: sem ícones; tela vazia com ícone/frase diferentes |
| Atacado (setor) | 65b | igual, menos o ícone da linha |
| Ferramentas | 66 | igual |
| Histórico do dia | 67 | não implementado (tela vazia em texto solto) |
| Pedidos online | 46c | igual |
| Ajustes | 86 | igual |
| Peças | 48a | igual |
| Inventário | 52b | falta "Parados e sobrando" e "N preços para corrigir ›" |
| Compras | 51 | igual |
| Fornecedores | 89b | igual (89b MANTÉM Editar e lixeira — item 5b da lista era erro meu, retirado) |
| Dashboard | 52e | topo igual; o 52e só desenha a parte "Detalhes" |
| Caixa | 86 v2 + 104 | igual ao "sem cartão" |
| Catálogo | 104 | igual, mas a frase "Escolha a peça e venda." sai (decisão 24/11 05:28, depois do 104) |
| Início | 149n + 52a + 54 + 70 | DIFERENTE: quadrados com legenda, linha "Titan · N coisas", cartão rosa, sem o botão de troca (lista 1a) |
| Adicionar | 88 | igual (passos 1 e 2) |

## O que o teste provou sobre o gabarito
1. **Uma imagem por tela não basta.** Muitos esboços aprovados desenham só a parte que muda (52e só "Detalhes"; 89b só o lote) e decisões depois do esboço mudam a tela (Catálogo sem a frase; Início = 4 aprovações).
2. **Os gabaritos de código (base_app.py, aprovados.py) são remendo:** reconstroem por cima do app e já divergem dos esboços.
3. **Jeito natural:** o gabarito de cada tela é um **molde consolidado** — a tela inteira (todas as dobras, claro/escuro, 3 letras) com TODOS os aprovados que tocam nela. Ele nasce do app real quando a ESBOCO confere a tela peça por peça contra cada esboço aprovado da lista dela e dá "OK ESBOCO"; aí o Titan grava a foto + medidas (compara.PECAS) e passa a comparar com ela. Tela com diferença fica sem molde até ser corrigida. Mudança aprovada nova → o molde daquela tela cai e é refeito no próximo "OK ESBOCO".
4. Assim base_app.py e aprovados.py vão para o lixo (work/obsoletos) no mesmo passo em que o Titan troca para os moldes.

## Teste do gabarito final (base aprovada limpa, base=True) × último esboço aprovado — 24/11 14:35
Fotos: gabarito/gab_*.jpg. Certo: Adicionar, Pedidos, Caixa, Catálogo, Compras, Fornecedores, Ferramentas, Dashboard, Início (149n + Preços).
ERRADO (o gabarito não tem o aprovado, então aceitaria o erro do app): Preços sem "‹ INÍCIO" (54) · Regras sem valor à direita e ícones (62) · Ofertas com ícone, linhas e seções diferentes do 63 · Histórico sem o 67 · Inventário sem o 52b · Atacado com ícone diferente do 65b.
Erro do roteiro: Peças abriu o Inventário (não o grupo).
Causa: o gabarito é "app + itens antigos"; aprovado novo ainda não implementado nunca entra nele.
