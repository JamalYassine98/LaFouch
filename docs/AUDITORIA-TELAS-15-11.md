# Auditoria das telas do app — 15/11/2026 (S352)

Pedido do dono (17:20): abrir todos os botões possíveis e analisar tudo — redundância, informação inútil ou duplicada, abas que não funcionam; comparar cada aba do "Resumo ▾" com os botões soltos.
Como foi feito: app real com dados de teste, celular, tema escuro. `work/s352/audit.py inv2` leu todos os títulos, rótulos e números de 18 telas (com os blocos recolhidos abertos) e cruzou o que se repete; `audit.py bot` tocou os botões um a um (sessão nova a cada toque); `work/s352/vitrine.py` reproduziu o defeito da Vitrine. Dados brutos: `work/s352/textos.json`, `inventario.json`, `botoes-*.json`.

## 1. O mesmo número em mais de uma tela (medido)
| O que | Onde aparece |
|---|---|
| Vendido / Separar das vendas / Lucro livre do mês (G$ 3.253.000 · 1.830.600 · 1.422.400) | Resumo **e** copiado no fim do Dashboard (dia) |
| Total obrigatório por mês (G$ 4.200.000), Cada peça vendida separa (G$ 24.561), Contas para pagar | Despesas **e** Dinheiro (**e** o atalho Despesas do Início, **e** "Contas do dia" do Dashboard usa o mesmo valor) |
| Dólar, Real, Dólar em reais, Reposição ("Faltam US$ 2.684"), Registrar troca | Câmbio **e** Dinheiro; "Dólar hoje" de novo no Resumo |
| Total do caixa (G$ 5.599.905) e guardado nos Objetivos (G$ 2.310.000) | Dinheiro **e** aba Reservas |
| Vendido do mês em G$ (3.797.500) | Resumo, Dashboard (dia), Reservas ("Resultado de novembro") e Histórico |
| Meta do mês (G$ 1.408.491) | Resumo **e** Preços |
| Vendido hoje (G$ 147.500) | Início **e** Dashboard (dia) (duas vezes: "Vendido" e "Fechamento do dia") |
| Fechamento do dia/caixa | Dashboard (dia) **e** Histórico ("Fechar o dia agora") |
| "Preço automático" | Ajustes **e** Preços |
| Avisos ("Black Friday em 12 dias", contas, preço perigoso) | Notificações **e** Preços/Despesas |
Já aprovado e cobre parte disto: esboço 28 (Dinheiro só com o caixa) e esboço 35 (Dashboard com 3 números; "Dólar hoje" sai).

## 2. Abas do "Resumo ▾" × botões soltos do Início
- **Resumo** (3.929 px) — o mês. O atalho "Dashboard" do Início NÃO abre esta aba: abre o Dashboard (dia), que copia 3 números dela.
- **Reservas** (2.915 px; legenda "Caixa, contas e reserva") — mistura 3 assuntos: "Livre para você" (único desta aba), o caixa (é a tela Dinheiro) e "Resultado do mês / Lucro real do mês" (é resultado, não reserva). Tem atalho próprio no Início.
- **Giro** (7.148 px, a tela mais comprida) — No estoque, Parado, Lista de compras, Vitrine da semana, Retorno do estoque, Dinheiro no estoque, Curva ABC. Tem atalho próprio. "Lista de compras" conversa com Inventário › Reposição e Fornecedores (não medi se os números batem).
- **Preços** (4.924 px) — Contador (30 decisões), Calculadora, E se…?, Preço automático, linhas de preço, piso, "Contas, taxas e meta" (as contas são as de Despesas). Tem atalho próprio.
- **Online** — quase vazia: só "Mais vistas" e "Painel completo ›". O Início já tem "Pedidos online", "Loja online", "Analisador", "Mensagens" e "Temática". É a aba mais redundante.
Ou seja: as abas Reservas, Giro e Preços têm DUAS entradas (flecha e atalho) para a MESMA tela — isso é atalho, não cópia; o que é cópia de verdade está na tabela do item 1.

## 3. O que não funciona ou está mal feito (medido)
- **Giro › Vitrine da semana**: o campo "Quantos lugares" fica com **28 px de largura** (o botão "Salvar" tem `width:100%` e esmaga o campo: 28 px × 268 px). No simulador digitar 12 e Salvar funciona, mas não dá para ver o que se digita. Arquivo: `src/97-vitrine.js:136`.
- **Dashboard (dia)**: outro campo de 28×44 px na linha da data (não investiguei qual é).
- "Restaurar padrão" e "Voltar para hoje": botões cinzas do sistema (já aprovado corrigir, esboço 37).
- **Pedidos › "Verificar agora"**: tocar não muda nada na tela (nem aviso de "verificado"). As abas Agir agora / Em andamento / Feitos também não mudam nada quando não há pedido (pode ser só a lista vazia).
- **Loja online**: no simulador a tela não mostra texto nenhum (é o painel do site dentro do app; não consegui ler).
- Telas compridas demais para o celular: Giro 7.148 px, Histórico 6.869, Catálogo 6.079 (lista), Preços 4.924, Despesas 3.960, Resumo 3.929, Dashboard (dia) 3.430.

## 4. Limites desta auditoria (o que NÃO foi feito)
- O robô tocou os botões visíveis de 18 telas, mas NÃO é "todos os botões": 33 não foram alcançados (principalmente dentro de blocos de Ajustes e do Dinheiro, que o próprio robô deixou fechados ou cobertos) e uma das três partes foi interrompida antes do fim (Clientes, Dashboard (dia), Giro, Histórico ficaram incompletas). "Não alcançado" não quer dizer quebrado.
- Só mede se "algo mudou na tela"; não confere se o resultado está CERTO.
- Só celular, tema escuro, dados de teste; nada no aparelho de verdade. Janelas e folhas por dentro (formulários) não foram varridas.

## 5. Proposta (minha posição) — aguardando o dono
Regra: **cada número mora numa tela só**; nas outras entra, no máximo, uma linha que leva até ele.
1. Dashboard: o Dia entra no menu da flecha (esboço 40) e perde a cópia dos números do mês.
2. Dinheiro só com o caixa (esboço 28, aprovado). Reservas fica só com "Livre para você" + para onde vai o dinheiro; "Resultado do mês / Lucro real" vai para o Resumo do mês.
3. Aba "Online" sai do menu da flecha (os atalhos do Início já cobrem); se quiser um número do site, ele entra como uma linha no Resumo.
4. "Dólar hoje" sai do Resumo (aprovado no 35); "Meta do mês" fica só no Resumo; em Preços vira uma linha.
5. "Fechamento do dia" fica só no Dashboard (dia); o Histórico só lista os dias.
6. "Preço automático" fica só em Preços; em Ajustes vira uma linha que leva até lá.
7. Corrigir o campo da Vitrine e o "Verificar agora" sem resposta.
8. Telas compridas (Giro, Preços, Histórico): blocos fechados por padrão, como já é no Giro, e o mesmo desenho de linhas do esboço 35.
