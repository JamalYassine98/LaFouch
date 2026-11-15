# Relatório — o que está aprovado e o que falta decidir (15/11/2026, 23:55)

Feito lendo a lista viva inteira (`docs/FALTA-APROVAR-15-11.md`, 124 linhas). Nada desta lista foi implementado: tudo espera a palavra "implementar". Onde um esboço substitui outro, vale o mais novo (indicado).

## 1. APROVADO, esperando "implementar"

### Estrutura do app (menos telas)
- **7 famílias no Início**, cada uma um grupo com a flecha no título: Vender · Peças · Dinheiro · Dashboard · Site · Clientes · Avisos. Substitui o "Início enxuto" de 14/11.
- **Grupo com a flecha no lugar das abas do topo**, em todo grupo; dá para tirar tela ou desfazer em "Gerenciar grupo".
- **Criar grupo arrastando um atalho do Início sobre outro** (esboço 44): ícone em arco, anel de confirmação, fusão no ícone do par; segurar 0,4 s para começar; soltar antes cancela; aviso "Desfazer" 5 s; sem janela de nome. Animação de desfazer (44b).
- **Janelas do grupo** (36): "Cancelar" e "Desfazer o grupo" no centro; sai o bloco "Adicionar botão".
- Cabeçalho do grupo só quando a tela é do grupo.

### Dashboard (referência única: esboço 48)
- Uma tela "Dashboard" com flecha (Reservas, Giro, Preços, Histórico); **sem trilho Dia | Mês e sem calendário**; período pelo seletor do topo (Hoje, Esta semana, Este mês, Últimos 30 dias, Escolher datas); folha do seletor **sem o "×"**.
- 3 números, um por linha no celular (Vendido, Lucro livre, Meta do mês) + "O que fazer agora" + detalhes em linhas. Os blocos do dia só aparecem em "Hoje". Dia que não é hoje: Histórico.
- **Moedas**: a tabela "Quanto separar" é o único lugar das 3 moedas; as linhas "Trocar … por US$ …" ficam na linha Reposição e têm **toque que abre o Câmbio › Registrar troca já preenchido**; saem "Separar das vendas", "Para repor o estoque" e o "Fechamento do dia" repetido.
- A tela "Resumo" e a aba "Online" deixam de existir.

### Redundâncias (tabela aprovada + esboços 28 e 45)
- Dinheiro só com o caixa (28); abrir o menu do caixa não muda tamanhos (29) — vale para toda folha e menu.
- Reservas só com "Livre para você" e "Próximos 30 dias" (45a); Histórico sem "Fechamento do caixa" (45b); "Preço automático" em Ajustes só leva a Preços (45c); "Resultado do mês" vai para o Dashboard (45d).
- Meta do mês só no Dashboard; avisos só nas Notificações; "Dólar hoje" e a linha "US$ 1 = G$ …" só no Câmbio; valores em 3 moedas empilhados e textos de explicação recolhidos.
- Cartões separados por 18 px nas abas do Dashboard (46).
- Botões cinzas "Restaurar padrão" e "Voltar para hoje" viram link do app (37).

### Vender e receber
- **Venda em 3 toques** (32): "Vender" abre o Pagamento por cima da peça.
- **Pagamento no padrão de luxo** (39 e 39a–39d): total em destaque, pagamento e moeda em trilho único; estados crédito, troco, duas moedas, em reais; tablet e PC do crédito e das duas moedas.
- **Conta única de lucro** nos 5 lugares: preço − IVA da venda − custo da peça (com frete) − taxa do pagamento; sem IVA da compra.
- Compartilhar pelo Catálogo sem "Tipo de envio" (25); Catálogo sem o modo Atacado (26); "Ajustes do catálogo" e Filtros do inventário sem "Ver N peças"/"Cancelar".
- Barra de escolher peças: frase em 2 linhas (18), sai da tela ao fechar e sair do Catálogo desfaz a escolha (19).

### Atacado, clientes e site
- Tela **Atacado** do app em abas (23), Atacado › Tabela (27), Atacado em PC e tablet (30).
- Painel do site como tela do app (S242); painel no escuro (16, 17) e o que sobrou dele; cartões da conta com renovação do login + prova no portão.
- Site: conserto das cópias do painel; botão da página aberta não reanima; ideias S214/S215 (sem as duas reprovadas); temática em 2 níveis; colunas iguais/4 colunas; pílula da "Minha conta" e o resto das abas; modo loja em tela larga como está.

### Computador e tablet
- Lista + ficha lado a lado (31); teclado e leitor de código (33).

### Movimento, folhas e toques
- **Uma folha só** para o app: a faixa de cima arrasta (dedo e mouse), tocar fora e Esc fecham; o portão arrasta de 3 pontos.
- **Desfazer no lugar da pergunta** (34); a pergunta fica só no que não volta.
- Animações de luxo lotes A, B e C; números do Início contam só na 1ª vez e com altura fixa; trilho único arrastável; regra lógica da pílula + 4 provas; gravador de engasgos; regra da volta do segundo plano (ajusta com a medição); detector de cópias no portão (site e app); soluções da lista de animações.

### De antes de 15/11 (continuam aprovados)
- Entradas suaves e telas vazias com o próximo passo; 3 animações da Mochi; Mochi no computador partes 2 e 3; giro e Estúdio (bloco 4); leitor da haste de luxo; janelas num padrão só; Nuvem enxuta; PC (ação ao lado do título, Inventário largura toda, Ajustes em 2 colunas); transferência automática; frete automático (depende das transportadoras).

## 2. FALTA VOCÊ DECIDIR
1. **Esboço 41** (grupo "Loja e estoque" com a flecha): a ideia está aprovada; o desenho não recebeu resposta.
2. **Moedas, o que sobrou**: a linha "Entrou: G$ + R$ + US$" embaixo do Vendido; e se quer tocar no número para ver o total em real ou dólar.
3. **Estudo "pede ação mas não tem toque"** (feito agora, `work/s356/sem_toque.py`): além do "Trocar … por US$", achei **Contas para pagar** ("venceu há 3 dias", "vence hoje") sem toque para pagar; **Colchão** ("falta trocar") sem toque para o Câmbio; em **Preços**, "faltam 82 peças" e "Abaixo do piso · 16" sem toque; em **Dinheiro**, o aviso "caixa abaixo do que deveria" sem toque. Proposta: a mesma regra aprovada — toda frase que pede ação leva ao lugar de agir, já preenchido.
4. **Defeitos achados na varredura**, ainda sem esboço da correção: Despesas › "Contas pagas neste mês" não abre; Pedidos › "Verificar agora" não responde; Giro › campo da Vitrine com 28 px.
5. **Segunda passada da auditoria** (janelas, ficha da peça, painel, tablet e PC) e as 7 repetições que suspeito e não medi (três entradas de aviso, Fornecedores, Reposição em 3 lugares, etc.): fazer ou não.
6. **Hospedagem** (GitHub Pages não é para comércio): você avisa quando tratar.

## 3. FALTA EU FAZER (devo)
- Desenho do **Início com as 7 famílias** e das famílias Peças, Dinheiro, Site, Clientes e Avisos (só o Dashboard foi desenhado).
- Pagamento: Pix, venda abaixo do piso, cliente escolhido.
- Tablet e PC dos esboços 36, 37, 41, 42, 44, 45, 46 e 48.
- Grupo com 3 ou mais telas (qual ícone) e soltar um atalho sobre um grupo que já existe.
- Preços: meta virando linha e os avisos repetidos.
- Conferir no código como a troca já registrada desconta as linhas "Trocar".
- Nada foi testado no celular, tablet ou computador de verdade; tudo é simulador.

## 4. DEPENDE DE VOCÊ
- Instalar o `LaFouch-524.apk` (última desinstalação) e o instalador do Windows 526; conferir o modo loja.
- Colar o robô do Banco Familiar no Apps Script e publicar `pix` e `reserva`; transferência de teste.
- Gravar o giro definitivo; falar com as transportadoras.

## 5. RETIRADO por você (não volto a propor)
- Capa do grupo e grupo como tela única; Produtos = Catálogo + Inventário; chave Vender/Cuidar; selo Nº 1 e substitutos; "Ver modelo" cheio e "Comprar" liso; barra de baixo fixa; tabela das moedas no Câmbio; trilho Dia | Mês e calendário no Dashboard; "×" na folha do seletor.
- Esboços substituídos: 38, 40, 43 e 47 (valem 44 e 48).
