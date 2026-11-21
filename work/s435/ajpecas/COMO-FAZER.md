# Esboço 37 — Ajustes padronizado · Peças alinhado · grupo pelo Início abre a escolha (S435 · ESBOCO, 20/11 23:12)

Pedido do dono (20/11 23:12, 3 prints do celular v586): "alinhar a aba de ajustes e padronizar com o restante do design,
alinhar melhor a aba de peças, e ao entrar num grupo ele entra no primeiro botão direto em vez de me deixar escolher".

Imagens (celular, claro e escuro, Hoje × Proposta):
- esboco_ajustes_nuvem_{escuro,claro}.jpg
- esboco_pecas_{escuro,claro}.jpg
- esboco_grupo_inicio_{escuro,claro}.jpg
Aprovados incluídos na base: todos do work/kit/base_app.py (53 itens) + Ajustes organizado em 3 blocos (aprovado 20/11, ainda não implementado).

## Causa (reproduzida no simulador, v587)
1. **Linhas tortas (Peças e Cópias e nuvem):** `pad100()` em src/98z-s374d-padrao.js roda depois de cada desenho e
   ADIVINHA que todo botão sem fundo cujo texto termina em "›" é um "link solto" → põe `lk100 c101`
   (rosa, centralizado, 15 px, `display:block`). Pega `.nvL` (índice do grupo) a partir do 2º desenho
   (Peças › Inventário › tocar em Peças de novo) e sempre pega `.nvxL` (as 4 linhas da nuvem) e o "Gerenciar grupo ›".
   Por isso "Arquivo de backup" quebra em 2 linhas (L4) e o Peças fica diferente do Giro e preços.
   Adivinhar pelo texto é remendo por natureza: depende de sorte (ordem do desenho, estilo computado).
2. **Grupo pelo Início pula a escolha:** `inicioGo(g)` → `grpAbre(g)` (src/95-barra-grupos.js) abre `g.ult` ou `g.itens[0]`;
   a barra de baixo já abre o índice (`nvIndice`, src/99c-navegacao-s435.js). São dois jeitos de abrir o mesmo grupo.

## Como fazer (jeito natural, regra 12)
1. **Link solto se declara na hora de nascer, não é adivinhado.** O link rosa ("Ver todas ›", "Lista de compras ›" etc.)
   sai de UMA função que já põe a classe (ex.: `lkSolto(texto, act, id)` → `<button class="lk100 c101|inl">`).
   Trocar os lugares que hoje dependem do pad100 por essa função e APAGAR o ramo de `button,a` do `pad100`
   e a lista `FORA100` (que só existia para desviar da adivinhação). Achar os lugares com o app RODANDO:
   abrir as 60 telas na v587, anotar todo elemento que recebe `lk100`; cada um vira chamada da função
   (o que não for link — `.nvL`, `.nvxL`, `.nvGer` — fica com o estilo próprio que já tem).
   O ramo `.slVai` do pad100 (põe "›" no texto) também passa para quem cria o `.slVai`.
2. **Ajustes:** fazer o "Ajustes organizado" aprovado (LOJA / CONTAS LIGADAS / ESTE APARELHO, linhas sem cartão,
   sacola em Pedidos do site, link no Instagram). Dentro de Cópias e nuvem, as 4 linhas `.nvxL` como já estão no CSS
   (nome branco à esquerda, valor cinza à direita, ›, linha fina) — sai sozinho com o item 1.
3. **Peças:** nada próprio — com o item 1, o índice do grupo é sempre o mesmo do Giro e preços
   (texto à esquerda, linha fina entre as telas, "Gerenciar grupo ›" cinza).
4. **Um jeito só de abrir um grupo:** `grpAbre(g)` passa a abrir o índice (`nvIndice(g)`, a mesma da barra), para
   Início, busca e qualquer atalho. Apagar o caminho `g.ult/g.itens[0]` (e o `g.ult` se nada mais o usar) e o
   comentário "o grupo do Início abre a tela direto". Marketing (família, `mkAbre`) continua como está.
5. **Ícones das listas em cinza (dono 20/11 23:23: "todos da mesma cor, prefiro o cinza"):** substitui o "ícones rosa"
   dos aprovados 149g (índice dos grupos) e 149n (Início em lista). Uma regra só no CSS: o ícone de linha de lista
   (`.nvIc`, `.tl .ti`, `.hero .hi`) usa `var(--mute)`; sai o pedaço que pinta de `--accent`. A barra de baixo continua rosa na aba acesa.
6. **Trava no porteiro:** (a) nenhuma `.nvL`, `.nvxL` ou `.nvGer` com `lk100`, depois de ida e volta em todos os grupos;
   (b) nenhuma linha de Ajustes quebra em 2 linhas (L4), letra 1× e 1,3×; (c) tocar num grupo no Início → `S.view==='grp'`; (d) ícone de linha de lista = cor `--mute` no Início e em todos os grupos, claro e escuro.

## O que muda para o dono
- Peças e Cópias e nuvem iguais ao resto (sem rosa no meio).
- Tocar num grupo no Início mostra as telas do grupo para escolher (hoje pula para a primeira/última usada).
