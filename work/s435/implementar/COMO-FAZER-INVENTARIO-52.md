# Família INVENTÁRIO (a lista) — "implementar" do dono 22/11 12:51

Retrato do aprovado (só o novo): work/s435/titan/inventario_aprovado.jpg.

Esboços:
- work/s435/giroprecos/esboco_52d_paginas.jpg
- esboco_52b_inventario.jpg (vale SÓ a tela "Parados e sobrando"; veja LEIA-52b.md)
- esboco_52e_resultados.jpg
- work/s435/painelsite/esboco_58h_filtro_site.jpg

## O que muda
1. **Topo (52d)**
   - Sem abas e sem os números grandes.
   - Embaixo do título vem o resumo "16 referências · US$ 420 a custo" no lugar do caminho fixo (`#crumb`, src/11-estoque-lista.js:73).
   - O "+" leva o selo vermelho com quantas peças faltam completar. A janela Adicionar tem: Completar peça do Estúdio (com selo) · Chegou mercadoria · Acessório.
2. **Barra:** "470 peças · Todos" + o botão de filtros. O "15 preços para corrigir" **sai daqui** e vai para o sino.
3. **Páginas (52d)**
   - 24 peças por página.
   - Embaixo, "Anterior · 1 de 3 · Próxima": dois botões grandes iguais, com "Anterior" apagado na 1ª página.
   - Deslizar o dedo troca de página.
   - O app guarda a página em que o dono estava.
   - É **um componente só** para todas as listas longas do app.
4. **Depois das páginas:** "Parados e sobrando · US$ 172 ›" e "Contar o estoque ›". "Em estoque" continua sendo o botão que abre a Contagem (src/97-contagem.js:305).
5. **Parados e sobrando (52b, 3º quadro):**
   - Parado 60+ dias, com "Oferta ›" em cada peça. Esse "Oferta ›" abre a janela Oferta do Titan quando o Titan existir; até lá, abre a oferta de hoje.
   - Sobrando.
6. **Filtros (58h):** ganha o bloco **"Site: No site · Ocultos"** (com os números), clonando o mesmo botão do bloco Situação. Substitui a tela Modelos do painel.
7. **Resultados › Dashboard do mês › Detalhes (52e)**
   - Entram "Desempenho do mês ⌄" (margem média, lucro por peça, contas cobertas, retorno do estoque em 30 dias) e "Curva ABC ⌄", que vêm de Preços e do Giro.
   - As linhas de Detalhes usam **⌄**, porque abrem no lugar (regra 16).

## Sai no mesmo passo
- A tela **Giro**: tudo dela foi para outro lugar.
  - O estado do estoque foi para o Inventário.
  - Sobrando foi para Parados e sobrando.
  - Retorno e ABC foram para o Dashboard.
  - A Lista de compras foi para Compras.
  - A Vitrine da semana saiu (dono 21/11).
- **Atenção:** o grupo "Giro e preços" continua **só com Preços** até a família Titan ser implementada. O 52a ("Início sem Giro e preços", com Preços virando linha própria do Início) vai junto com o Titan, para Preços nunca ficar sem caminho.

## Trava
- Nenhuma lista longa com "Ver mais".
- Nenhum "15 preços para corrigir" na barra do Inventário.
- O filtro "No site" bate com o número de modelos no ar do Resumo do Site.

Testado só no simulador; NÃO testado em aparelho real.
