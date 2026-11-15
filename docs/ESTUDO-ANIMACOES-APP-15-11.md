# Estudo das animações do app — 15/11/2026

Pedido do dono: estudar todas as animações de hoje e procurar problemas. Só leitura; nada foi alterado.

## Como foi feito
1. **Em uso (novo):** `work/s322/anima.py` abre o app real no simulador (celular, tema escuro) e passa por 26 passos — as 11 telas, trocar de aba, abrir/fechar peça, Compartilhar, Pedidos, sino, busca — anotando o que REALMENTE roda: duração, curva, o que mexe, se acaba. Repete tudo com "reduzir movimento" ligado. Dados: `work/s322/medido.json` e `problemas.json`.
2. **No código:** `work/s253/inv.py` (inventário de 14/11) rodado de novo no código de hoje.

## Em números
- Em uso: **95 animações** vistas rodando nos 26 passos.
- No código: **142 animações desenhadas**; 38 sem falha. Falhas marcadas: curva padrão 69 · longa 37 · efeito pesado 15 · curva com mola 12 · quica 10 · mexe em tamanho/posição 10 · sem fim fora de "carregando" 7 · sem uso 4 · treme 3 · balança 2. Mais 167 transições (131 sem curva definida).
- Curvas que rodaram (animações de 0,12 s ou mais): {'cubic-bezier(0.2, 0.8, 0.2, 1)': 56, 'cubic-bezier(0.16, 1, 0.3, 1)': 15, 'ease': 7, 'ease-in-out': 6, 'cubic-bezier(0.2, 0.9, 0.3, 1)': 4, 'cubic-bezier(0.2, 1.25, 0.35, 1)': 4}.
- Com "reduzir movimento": 0 animações ainda rodaram (o app respeita).
- Quadros no simulador (indicativo, não é o celular): piores passos [('tela inicio', 17), ('tela vendas', 17), ('tela estoque', 17), ('tela ped', 17)] ms no pior quadro.

## Problemas encontrados (por importância)
1. **O app não usa a curva de luxo.** 80 das 95 animações vistas rodam em outra curva — quase todas na antiga `cubic-bezier(.2,.8,.2,1)`. As que mais aparecem: {'cas': 44, 'lfDesenha': 6, 'lfSobe': 6, 'transição:transform': 6, 'transição:': 5, 'transição:opacity': 4}. `lfEntra` é a entrada de toda tela; `cas` é a fila dos atalhos do Início. É a diferença que o dono sente entre o site e o app.
2. **Ainda há quique** (o padrão de luxo proíbe): a pílula das abas (`.lfPill`, curva com 1,25) ao trocar de aba no Inventário; a janela de Compartilhar e a barra de seleção sobem passando do ponto (1,25 e 1,3). No código há 12 curvas com mola e 10 animações que quicam.
3. **Duas regras brigando pelos botões.** `www/style.css` define a transição de `button, .chip, .tab, .mini, .go…` duas vezes; a segunda (curva `ease`, 0,12 s) apaga a primeira (curva `var(--ease)`). Resultado: o toque nos botões não segue a curva do app.
4. **Animações que mexem em tamanho/posição** (as que travam em celular fraco): a linha e a pílula das abas animam `left`/`width`; a peça "voando" ao abrir no Catálogo anima `top/left/width/height`. O certo é mover com `transform`.
5. **Longas:** o desenho do ícone nas telas vazias (`lfDesenha`, 1,0 s em Pedidos e Clientes). No código, 37 passam do limite.
6. **Sem fim fora de "carregando":** 7 no código (não apareceram nos passos medidos; ficam em telas que não abri — ver limites).
7. **Lixo:** 4 animações sem uso no código.

## O que NÃO foi visto (não vou inventar)
Estúdio/câmera, leitor da haste, "carregando", finalizar venda, janelas de Ajustes, tablet e computador, tema claro, e o celular real (quadros perdidos só valem medidos no aparelho). A leitura "duas animações no mesmo elemento" do script é falsa (conta botões irmãos como um só) e foi descartada.

## Como resolver (3 lotes, cada um com vídeo antes de publicar)
- **A · Abas e seletores:** linha/pílula com `transform` e sem mola; conteúdo vem do lado da aba; junto com o padrão de botões (S321). Resolve 2 e 4 nas abas e a briga do item 3.
- **B · Janelas e telas:** `lfEntra`, janelas (Compartilhar e as outras) e barra de seleção na curva de luxo (entra 0,46 s, sai 0,3 s), sem passar do ponto. Resolve o item 1 quase todo.
- **C · Listas, toques e carregando:** fila dos atalhos (`cas`) e listas em 22 ms por item; ícone das telas vazias em 0,5 s; apagar as 4 sem uso; rever as 7 sem fim.
