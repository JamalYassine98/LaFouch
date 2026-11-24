# Voltar único — APP, 24/11 (pronto para conferir; NÃO publicado)
Ramo: app/voltar-24-11 (main sem mudança). Como-fazer: work/s435/voltar/COMO-FAZER-VOLTAR.md.

## O que mudou (por dentro, nenhuma tela muda)
- src/99c-navegacao-s435.js: `voltaUm()` = o único passo de voltar (janela/folha → Estúdio/câmera/folha cheia → peça aberta → pilha).
  Um só `popstate`. Seta "‹", versalete, título pequeno, arrastar da borda e Android passam pelo mesmo caminho (`history.back()` quando há a guarda).
  No Início sem nada aberto: Android pergunta "Sair do app?"; navegador sai.
- Saíram: pushState do setView (src/90, fica replaceState), navVolta + popstate/hashchange (src/94), popstate do src/97u, src/99b-voltar-janela.js inteiro.
- Prova nova em tests/run.py: "um voltar só" (5 caminhos × 3 jeitos, janela, Estúdio, peça do Catálogo). Pega o erro no código antigo (FALHA) e passa no novo.

## Resultado (simulador de celular, sem a base)
- voltar.py: Preços›Regras, Preços›Ofertas, Site›Pedidos, Resultados, Clientes, Marketing, Atacado → seta, navegador e Android dão a mesma tela em cada passo; navegador não sai antes do Início (voltar.json).
- voltar2.py: Peças/Dinheiro/Ajustes → todas OK; Estúdio e Voltar no tempo fecham no voltar (voltar2.json). As 3 linhas "ERRO" de Reservas são do teste (compara S.dTab, que fica 'din'): a tela de volta é a certa (Dinheiro, pilha grp:g:din).
- Atalho Inventário → Catálogo: 1 voltar devolve à peça no Inventário.
- tests/run.py: 390/390.
- NÃO testado em aparelho real (Android de verdade, PWA instalado).
