# Estudo: botões que apagam, cancelam ou desligam — e as janelas do app (17/11/2026)

Li o código de todas as 291 ações do app e separei as 37 que apagam, cancelam, desligam ou trocam dados. Resultado: **hoje há 6 jeitos diferentes de "ter certeza"** e **7 desenhos de janela**.

## 1. Como cada ação confirma hoje

| Jeito de hoje | Onde |
|---|---|
| **Nada** (um toque e pronto) | Cancelar pedido · Recusar comprovante · Limpar histórico (Pendências) · Esvaziar carrinho · Restaurar padrão do Início · Sair da nuvem · Remover aparelho do atacado · Recusar aparelho (sincronização) |
| **Janela do navegador** (caixa cinza do sistema, fora do design) | Cancelar conta do atacado · Trocar acesso do atacado · Encerrar lote do atacado |
| **Tocar de novo** ("Remover?", "Toque de novo") | Remover imprevisto · Remover pedido · Apagar pedidos de teste · Desligar sincronização · Tirar o bloqueio do app · Estornar venda · Excluir peça do lote |
| **Tocar de novo + janela** (pergunta 2 vezes) | Restaurar cópia da nuvem · Importar backup |
| **Frase dentro do cartão** com "Sim" | Excluir cor |
| **Janela "Não tem volta"** | Esvaziar a lixeira · Apagar foto em todos os aparelhos |
| **Faz na hora + "Desfazer" por 5 s** | Excluir produto · Remover cliente · Remover despesa · Remover objetivo · Apagar foto · Tirar do grupo |

Problemas: ações graves sem pergunta nenhuma (cancelar pedido, recusar comprovante, sair da nuvem); coisas pequenas com pergunta; a mesma função com jeitos diferentes; a caixa cinza do navegador.

## 2. Janelas de hoje (7 desenhos)
Janela de baixo nova (a mais usada, 20 lugares) · folha antiga animada (6) · caixa no centro da tela (Desconto, Descrição, Lote; PIN e cadastro) · folha do Caixa · folha do Câmbio · caixa de Filtros · cartão "carregando foto" · e a caixa do navegador. Desde a v532 todas fecham do mesmo jeito (arrastar, tocar fora, Esc), mas **não têm a mesma aparência**.

## 3. Minha proposta: 3 regras pela CONSEQUÊNCIA

**A. Dá para voltar e só mexe no seu aparelho → faz na hora + "Desfazer" por 5 s** (sem pergunta).
Excluir produto, excluir cor, remover cliente/despesa/imprevisto/objetivo, apagar foto, tirar do grupo, esvaziar carrinho, limpar histórico de avisos, restaurar padrão do Início, remover pedido já entregue/cancelado, apagar pedidos de teste.

**B. Mexe com outra pessoa, com o site, com a nuvem ou com dinheiro — ou não tem volta → janela de confirmação.**
Cancelar reserva/pedido, recusar comprovante, estornar venda, desligar sincronização, sair da nuvem, sair de todos os aparelhos, remover/recusar aparelho, cancelar conta ou encerrar lote do atacado, tirar o bloqueio do app, importar backup, restaurar cópia, esvaziar lixeira, apagar foto em todos.

**C. Ação comum** (salvar, abrir, marcar, trocar aba) → nada.

Somem: "tocar de novo", a caixa cinza do navegador, a frase com "Sim" e a pergunta dupla.

## 4. A janela de confirmação (um desenho só — o do esboço 110c)
- Janela de baixo de sempre (puxador, arrasta, toca fora = Voltar).
- Título é a pergunta: "Cancelar a reserva?", "Desligar a sincronização?".
- Uma linha com **o quê**: nome + detalhe + valor (quando tem).
- Uma frase com **o que vai acontecer**; quando não tem volta, começa com "Não tem volta."
- Botão de contorno vermelho com o **verbo exato** ("Cancelar reserva", "Estornar venda") — nunca "Sim" ou "OK".
- "Voltar" embaixo, em texto.
- Vermelho com caixa só existe aqui; fora da janela o perigo é texto vermelho (padrão 105).

## 5. Todas as janelas com a mesma aparência
Toda janela = janela de baixo (mesmo puxador, título 17 px negrito, cantos, fundo, botões embaixo). Ficam de fora: PIN e cadastro (tela cheia de propósito). Passam para ela: Desconto, Descrição, Lote, folhas antigas, folha do Caixa, folha do Câmbio, Filtros.

## 6. Ordem sugerida
1) Janela de confirmação (110c) + as ações do grupo B. 2) Grupo A com "Desfazer". 3) Mesma aparência nas outras janelas (uma por vez, com esboço).
