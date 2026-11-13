# Estudo do app para simplificar telas, botões e navegação — 13/11/2026 (S225)

Pedido do dono: estudar o app e reelaborar a simplificação (pedida antes, não implementada), para os botões serem fáceis de manusear e a navegação simples.
Só leitura. Medido no simulador com os dados de exemplo: 14 telas × celular 390 (claro e escuro), celular pequeno 320, tablet 820, computador 1366. Gerador: `work/s225/atlas_app.py` → `atlas_app.json`, fotos `work/s225/app_*.jpg`.

## 1. O que foi medido (celular 390)

| Tela | Botões na tela | Toque < 44 px | Letras < 12 px | Comprimento (telas) |
|---|---|---|---|---|
| Início | 28 | 5 | 23 | 1,9 |
| Inventário | 28 | 5 | 22 | 3,9 |
| Catálogo | 27 | 3 | 6 | 7,3 |
| Caixa | 17 | 1 | 7 | 1,9 |
| Pedidos online | 11 | 4 | 6 | 1,0 |
| Clientes | 11 | 0 | 6 | 1,0 |
| Histórico | 42 | 2 | 8 | 7,3 |
| Números (Dashboard) | 10 | 1 | 13 | 4,7 |
| Dia | 25 | 11 | 17 | 4,0 |
| Câmbio | 14 | 1 | 10 | 1,2 |
| Despesas | 53 | 8 | 13 | 4,8 |
| Notificações | 16 | 10 | 9 | 2,0 |
| Ajustes | 15 | 0 | 6 | 1,1 |

Claro e escuro dão os mesmos números. Loja online (tela `onl`) não abre no simulador (é o site por dentro), não medida.

## 2. Achados

1. **O topo come a tela.** O logo grande ocupa cerca de 115 px em TODAS as telas e a barra de baixo 67 px: mais de 1/5 do celular antes do título. No computador o primeiro produto do Inventário só aparece no fim da tela (≈ 670 px abaixo) e a barra flutuante fica por cima dele.
2. **Botões pequenos onde mais se toca.** Dia: "Ver detalhes" e "Estornar" com 36 px de altura (11 botões). Notificações: "Ver" 52×36 (10). Despesas: marcar conta paga 40×40 (8). Pedidos: "Verificar agora" 91×19. Início: "Ver" 50×32, "Conferir" 80×32.
3. **Botões com o mesmo nome.** "Ver" aparece 2 a 6 vezes por tela (Início, Notificações); no tablet "Ver detalhes" ×3 e "Estornar" ×3. Quem lê rápido não sabe o que cada um abre.
4. **Letra pequena.** Início 23 e Inventário 22 textos abaixo de 12 px; Números usa 12 tamanhos de letra diferentes.
5. **Telas compridas.** Catálogo e Histórico 7,3 telas, Despesas 4,8, Números 4,7. No celular pequeno o Inventário chega a 11,8 telas. Catálogo no celular mostra 1 peça por linha.
6. **Navegação.** A barra tem 5 lugares (Início, Catálogo, Inventário, Caixa, Ajustes); as outras 9 telas (Pedidos, Clientes, Histórico, Números, Dia, Câmbio, Despesas, Loja online, Notificações) só se alcançam passando pelo Início ou por outro botão.
7. **Tablet e computador = celular esticado.** Mesma coluna, mesmo logo, barra de celular. Os 3 tamanhos do S187 (aprovados em 12/11) não estão no app.
8. **Já conhecido (docs/APP-COMO-FUNCIONA.md):** 10+ caminhos para cadastrar produto, 5+ filas de foto, 4 módulos de compartilhar, 2 telas de câmbio, 2 de Ajustes, sino × tela Notificações.

## 3. Proposta de simplificação (para virar esboço)

1. **Topo compacto:** logo pequeno numa faixa de ~56 px com o nome da tela e o sino. Devolve ~90 px a cada tela.
2. **Uma ação principal por tela**, grande (48 px+), sempre no mesmo lugar ao alcance do polegar: Catálogo = Vender; Inventário = + Adicionar; Caixa = Fechar o dia; Pedidos = Agir agora. O resto vai para um "⋯ Mais ações".
3. **Todo toque com 44 px no mínimo (48 onde se toca muito)** e letra de 12 px no mínimo. Corrige Dia, Notificações, Despesas, Pedidos, Início.
4. **Botão diz o que abre:** "Ver contas", "Ver preços", "Conferir caixa" — nunca só "Ver". Na lista, a linha inteira é o botão.
5. **Barra de baixo:** Início · Vender · Estoque · Caixa · Mais. "Mais" abre uma folha com Pedidos, Clientes, Histórico, Números, Despesas, Câmbio, Ajustes (com contador do que pede atenção). Hoje Ajustes ocupa um lugar fixo e Pedidos não tem nenhum.
6. **Listas curtas por padrão:** Catálogo com 2 peças por linha no celular; Histórico e Despesas mostram o período atual e recolhem o resto; Números abre no Resumo com 3 números grandes e o resto em abas.
7. **Início só com o que pede ação hoje:** Guardião + vendido hoje + 3 atalhos; o resto dos blocos fica em Mais.
8. **Tablet e computador de verdade (S187):** menu ao lado, produtos já na primeira tela, ficha aberta ao lado da lista.
9. **Uma função, um caminho:** tirar aos poucos as 9 redundâncias conhecidas (cada uma com esboço).
10. **Padrão único:** 4 tamanhos de letra, 1 estilo de botão principal, 1 secundário, 1 de perigo; mesmo padrão de movimento do site.

Ordem que eu recomendo: (1+3+4) primeiro — é o que mais muda o manuseio com menos risco; depois (5+7); depois (2+6); por fim (8) e (9).

## 4. Temática: todas as telas do site? E o catálogo do app na loja?

- **Site:** recomendo dois níveis. *Clima cheio* onde o cliente passeia (Início, catálogo, peça). *Clima leve* onde ele decide e paga (carrinho, pagamento, conta, teste da Mochi, atacado, ajuda): só a faixa do topo e a cor de destaque, sem bloco escuro e sem enfeite. Motivo: no pagamento o que vende é calma e confiança. Não medi ainda quais telas seguem a temática hoje.
- **Catálogo da loja física (Modo loja):** sim, igual ao site — é o próprio site aberto dentro do app, e o cliente na loja deve ver a mesma vitrine. Precisa conferir se a cópia de dentro do app troca de temática sozinha sem internet (não testado).
- **Telas de trabalho do app (Inventário, Caixa, Números…):** não. É ferramenta; cor de evento ali atrapalha a leitura de números. No máximo um aviso discreto "Tema Natal ativo" no Início.

## 5. O que foi e o que não foi testado

- Testado no simulador: as 14 telas principais, 5 aparelhos, dados de exemplo.
- NÃO medido: janelas e fichas (ficha da peça, carrinho, pagamento, Estúdio, Contador, lfJanela), fluxo completo de uma venda (quantos toques), letra grande do sistema, celular real, app instalado (APK). A tela Loja online não abre no simulador.
