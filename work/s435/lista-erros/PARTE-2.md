# Lista de erros — Parte 2 · Peças (ESBOCO, 24/11/2026) · app real v640, celular, escuro e claro, nuvem ligada
Fotos: parte2_provas.jpg (Adicionar · Chegou mercadoria · Nova peça · Ficha · Inventário · Despesas) e p2_*.png. Base: 44a/44b, 88, 52b, 51, 86, regra 15.

## 6. Janelas: duas famílias diferentes (regra 15 e 13: mesma função = mesma janela)
6a. **Adicionar** (#addModal) e **Nova peça** abrem como caixa **no topo** da tela, sem a alça. Aprovado (44a, 88): **janela de baixo**, com a alça, como a do ⏻ de Preços. Causa: o Adicionar ainda usa a família velha `.modal`; as outras janelas já usam a de baixo. Jeito natural: Adicionar, Nova peça e Chegou mercadoria passam para a janela de baixo única; a `.modal` velha sai se mais ninguém usar.
6b. **Chegou mercadoria** abre uma 2ª janela por cima do Adicionar (o Adicionar fica atrás, apagado), com botão **"Fechar"** (proibido: fecha arrastando/tocando fora/Esc), a frase solta "Duas opções." e um "Preencher à mão" repetido (já está no Adicionar). Aprovado: Chegou mercadoria troca o conteúdo da mesma janela (etapa com "‹ Adicionar"), sem Fechar, sem frase, sem repetir.
6c. **Despesas › "+ Nova"** abre "Nova despesa" como dobra ⌄ no fim da tela. Criar = janela de baixo com "Salvar" (regra 15), aberta pelo "+" redondo (item 5a).

## 7. Ficha da peça (Inventário › peça)
7a. Dois topos: a barra velha "‹  Inventário" centralizada **e** o "‹ INVENTÁRIO" em versalete com o lápis. Um título e um voltar por tela (regra 16): fica o versalete (padrão da navegação 147); a barra velha sai.
7b. "Esta cor ainda não tem foto." acima do título: frase explicativa (83) — sai ou vira o estado "sem foto" da linha da cor.

## 8. Inventário (52b)
8a. Falta a linha **"Parados e sobrando · US$ … ›"** embaixo do título e o **"· N preços para corrigir ›"** ao lado de "470 peças · Todos" (52b aprovado, 65 publicado v625–v628). Se mudou de lugar por decisão do dono, a APP diz onde; senão, volta como no 52b.

## 9. Compras (51)
9a. Duas vagas com o mesmo nome "Armações · Feminino · Metal" (faltam 12 e faltam 13). Ou é a mesma vaga contada duas vezes (erro de lógica), ou falta o que as diferencia (ex.: o teto US$). Causa primeiro (regra 12a).

## 10. Frase de baixo do título (continua o item 3)
10a. Peças "Inventário, estúdio e compras" e Compras "O que comprar e de quem" também saem (o dono disse "sim").

Fora: Estúdio (fora do plano; anotado: abre com "×" e sem "‹ Peças", diferente do 88 quadro 3).
Próximas: 3 Dinheiro (Caixa, Reservas, Despesas, Câmbio) · 4 Vender e Clientes · 5 Site, Marketing, Atacado.
