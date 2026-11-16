# Passagem de sessão — 16/11/2026 01:25

Para a próxima sessão: ler este arquivo, depois `docs/FALTA-APROVAR-15-11.md` inteiro (lista viva) e o fim de `docs/MEMORIA-PROJETO.md` e de `docs/APP-COMO-FUNCIONA.md`.

## Publicado
- App **v535 (5.26.0)**, 302/302 testes. Site publicado em 16/11 (cupom em Minha conta › Cartões pergunta antes de usar). `www/loja` atualizado.
- Desde 15/11: v527 lote 1 · v528/v529 sistema de 360° (gravar a volta, tratar no app, frente e 3/4 automáticas) · v530 Dashboard final · v531 redundâncias · v532 folha única, desfazer, toques · v533 conta única de lucro, venda em 3 toques, Pagamento de luxo · v534 correções (Pagamento no celular, Preço automático, Black Friday CDE) · v535 Pedido enxuto e cupom pela tela Cartões.

## Aprovado e esperando o dono escrever "implementar"
- **Esboço 52** — Preços no padrão de luxo (`work/s368/precos.py`).
- **Esboço 54** (54a, 54b, 54c) — rota da venda Catálogo → Carrinho → Pagamento (`work/s368/rota.py`; o 54b usa o desenho do 51). Ao implementar: "Vender" volta a abrir o Carrinho (desfaz o salto direto para o Pagamento da v533); o carrinho passa a se chamar "Carrinho" em todo lugar; sai "+ Adicionar outra peça ao pedido" do Pagamento.

## "Implementar tudo" (ordem de 15/11 19:54) — parado no lote 5
- Falta: lote 5 (grupos com a flecha — esboço 41; juntar atalhos do Início — esboço 44), lote 6 (Atacado 23/27/30, Compartilhar 25, Catálogo sem Atacado 26, filtros), lote 7 (PC/tablet 31, 33), lote 8 (animações A/B/C), lote 9 (site e painel), e as sobras dos lotes 2, 3, 4 e do 360° (estão na lista viva).
- Fora até o dono aprovar: esboços 49a, 49b, 50a–c, 39e, 39f.

## Em aberto
- Prévia do site dentro do painel não atualiza com o site desligado (dono, 15/11 23:20): não reproduzido em simulação (`work/s367/previa.py`).
- O dono perguntou se dá para esboçar de uma vez todas as telas fora do padrão de luxo: respondi que sim; ele ainda não mandou fazer.
- Retirado (não propor de novo): tela única de venda (esboço 53).

## Regras aprendidas nesta sessão
- Estrutura nova de tela se monta pelo app.js, nunca só no index.html (o aparelho pode ter o index antigo) — testar com `work/s366/velho.py`.
- Antes de tirar um controle por "redundância", conferir que ele existe na outra tela.
- Todo esboço já sai no padrão de luxo (sem caixas, linhas finas, número em letra de título, ações secundárias como texto, um só botão por tela).
- Suíte inteira uma vez por publicação; antes, atualizar os testes que cobram desenho substituído. Scripts de edição em arquivo .py; nunca comentário `//` no meio de linha.

## Voz da Mochi no computador (S369, sessão antiga)
- Fluxo publicado no site (1794806381). Voz NÃO gravada: a chave do dono ficou sem cota; quando ele liberar, rodar `work/s369/grava.py` (teto 6.000 créditos), página de escuta, OK de ouvido, e só então lista.json.

## Continuação do "implementar tudo" (S370, 16/11 ~01:30–04:30)
- Publicados: v536 (lotes 5 e 6), v537 (lote 7), v538 (lote 8 parte 1). O que falta, na ordem: ver a linha "FALTA do implementar tudo" no fim de `docs/FALTA-APROVAR-15-11.md`.
- Antes de cada push: `git fetch --depth=20 origin main` + rebase (há outra sessão publicando); `git pull` no catalogo antes de `node build.js`.
