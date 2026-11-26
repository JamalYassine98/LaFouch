# Consertos do Início (esboço · ESBOCO · 26/11/2026) — esboco_inicio_1/2/3.jpg (escuro 1,0 · escuro 1,3 · claro 1,0)
Base: app real v641 (motor do Argus, commit atual). Aprovados incluídos: famílias do Início (FAMILIAS, 98z-s374), Titan no Início, 44/57a.
Comparador: comparador_inicio.md (toda diferença listada abaixo). Medidor do Argus na proposta: só L1 do "Vendido hoje" (+45 px =
o texto começa depois do ícone, como toda linha ícone+texto — motivo).

## O que muda e como fazer (regra 12)
1. **Subtítulo dos quadrados numa linha só (L4).** Causa: a frase da família é uma lista longa e o quadrado deixa quebrar;
   a linha fina fica em alturas diferentes. Jeito natural: o quadrado é uma grade de 4 linhas (ícone · nome · espaço · subtítulo),
   todos os quadrados com a mesma altura (`grid-auto-rows:1fr`), subtítulo sem quebra; se não couber, a letra do **grupo inteiro**
   desce pelo `lfCabe` (um lugar só: entrar `['.tgrid', '.tl .tn,.tl .tp']` em LISTAS_CABE, degraus no bloco do CSS do quadrado).
   Frases curtas na tabela FAMILIAS: Resultados "Dia e mês" · Site "Pedidos e vitrine" · Marketing "Posts e vídeos".
   Apagar: `.tl .tp` da linha 118 e o remendo `!important` da linha 1672 do CSS → um bloco só para o quadrado.
2. **Plural de verdade (regra 17).** Causa: "(s)" escrito à mão. Jeito natural: uma função `plural(n, 'venda', 'vendas', 'nenhuma venda')`
   e todo "(s)" do app passa por ela (Início, Dashboard, Histórico, Cupons…). "5 vendas" · "1 venda" · "nenhuma venda";
   Clientes: "Nenhum ainda" no lugar de "0 cadastrados". Trava no Argus: nenhum texto visível com "(s)".
3. **Um espaço só entre os blocos (L3).** Causa: #v-inicio usa gap 18 px e a busca soma margem 12 (= 30). Jeito natural: gap 16 no
   #v-inicio e a margem da busca sai; quadrados com gap 8.
4. **"›" iguais (contraste).** O "›" do Titan tem opacidade .5 (3,2:1 no claro). Todo "›" de linha usa a cor --mute, sem opacidade
   (o do Titan e o do "Vendido hoje" na mesma regra).

## Ainda não reproduzido no simulador (precisa da foto do dono depois da atualização ao vivo)
- A linha rosa acima do Titan e o quadrado Preços faltando: dependem dos dados do aparelho dele (lista do Início guardada);
  no simulador aparecem os 6 quadrados e nenhuma linha rosa. Investigar com a foto nova antes de propor.

## Não testado
Simulador: escuro/claro, letra 1,0 e 1,3. Não testado: letra 1,15, tablet/PC, aparelho real.
