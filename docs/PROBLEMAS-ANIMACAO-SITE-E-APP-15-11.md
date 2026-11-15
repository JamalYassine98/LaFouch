# Problemas de animação — SITE e APP (15/11/2026, S330)

Medido por programa nas telas reais (simulador). NADA foi implementado: tudo aqui espera a palavra **implementar**.

Curva de luxo aprovada: entrada `cubic-bezier(.16,1,.3,1)`, saída `cubic-bezier(.4,0,.2,1)`, sem quique.

## 1. SITE — bug da Minha conta / sacola (cópias do painel)

- **Reproduzido**: com a conta OU a sacola já aberta, ir pelo menu → "Minha conta": até **4 cópias** do painel por ~0,5 s (23 quadros com 2 ou mais cópias). É a tela da foto do dono.
- **Causa** (`js/lf-site.js`): ao fechar uma janela de página o site guarda uma cópia dela em `#lfGhost` e anima a saída (300 ms). O menu chama fechar e abrir ao mesmo tempo, e cada chamada de fechar cria mais uma cópia, todas por cima do painel novo.
- **Solução**: (a) quando uma janela SUBSTITUI outra não há cópia de saída: a nova entra e a velha some na hora; (b) no máximo UMA cópia viva (`layer()` apaga qualquer `#lfGhost` antes de abrir); (c) fechar chamado duas vezes não cria segunda cópia.
- **Não reproduzido no simulador**: primeira abertura pelo botão do topo, botão com a janela aberta, troca de aba, conta ↔ sacola pelos botões, peça → conta/sacola. Se o dono vê falha nesses caminhos, precisa de gravação da tela.

## 2. Por que o designer não achou — e o que muda

- O porteiro abre cada janela a partir da tela LIMPA e mede só o elemento que entra. Nunca testou sair de uma janela aberta para outra, nem contou cópias.
- **Regra nova proposta (portão)**: detector de cópias `work/s330/fantasma.py` — todo par origem → destino, por todo caminho de entrada (botão do topo, menu, link), quadro a quadro; reprova com 2 ou mais cópias do mesmo painel ou cópia que sobra. Defeito plantado: o bug de hoje tem de reprovar.
- O mesmo detector precisa existir no app (janelas e folhas).

## 3. SITE — todos os problemas (24 passos, 348 animações vistas)

### fora da curva de luxo — 111 ocorrências, 39 casos diferentes

- `transição:opacity em img` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir o site; catálogo: fechar Filtros
- `hdkb em img` linear — em: abrir o site; voltar ao topo; abrir o menu; fechar o menu (+3)
- `hdpg em button.on` linear — em: abrir o site; voltar ao topo; abrir o menu; fechar o menu (+3)
- `ring em a.wa` ease-out — em: abrir o site; fechar o menu; fechar a busca; abrir uma peça (+1)
- `transição:box-shadow em div.top` cubic-bezier(0.2, 0.8, 0.2, 1) — em: voltar ao topo
- `transição:opacity em div.dsc` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir o menu; fechar o menu; conta aberta → menu → Minha conta; sacola aberta → menu → Minha conta (+1)
- `transição:transform em aside.dpn` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir o menu; fechar o menu; conta aberta → menu → Minha conta; sacola aberta → menu → Minha conta (+1)
- `script em div.sosc` ease-out — em: abrir a busca; fechar a busca
- `transição:right em a.wa` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir uma peça
- `navPgIn em div.scrim.pg` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir uma peça
- `navbIn em button.pgback.navb` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir uma peça
- `navbSeta em svg` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir uma peça
- `pgrise em div.modal.pgm` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir uma peça; fechar a peça (voltar)
- `pop em svg` ease — em: favoritar na peça; fechar a peça (voltar)
- `fade em div.toast` ease — em: favoritar na peça
- `script em i.favfly` cubic-bezier(0.2, 0.8, 0.2, 1) — em: favoritar na peça
- `script em #bagbtn` cubic-bezier(0.2, 0.8, 0.2, 1) — em: favoritar na peça
- `cadf em #cad` ease — em: Comprar (vai para a sacola)
- `cadp em div.cadb` cubic-bezier(0.2, 0.9, 0.25, 1.15) — em: Comprar (vai para a sacola)
- `cadd em circle.c` ease — em: Comprar (vai para a sacola); fechar a peça (voltar); abrir a sacola; sacola: mais uma unidade (+11)
- `cadd em path.t` ease — em: Comprar (vai para a sacola); fechar a peça (voltar); abrir a sacola; sacola: mais uma unidade (+11)
- `script em div.fly` cubic-bezier(0.5, 0, 0.8, 0.4) — em: Comprar (vai para a sacola)
- `pgrise em aside.panel` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta; conta aberta → menu → Minha conta; sacola aberta → menu → Minha conta
- `script em div` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta; conta aberta → menu → Minha conta; sacola aberta → menu → Minha conta
- `script em div.mct` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta; conta aberta → menu → Minha conta; sacola aberta → menu → Minha conta
- `script em label.cfl` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em #mn` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em div.field.mce` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em div.fzr` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em div.cdd.cdg` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em #mpdl` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em #mpd` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em div.note` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta; conta aberta → menu → Minha conta; sacola aberta → menu → Minha conta
- `script em button.btn.w` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em #gcard` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em div.sesv` cubic-bezier(0.2, 0.8, 0.2, 1) — em: abrir Minha conta
- `script em button.on` linear — em: conta: aba Endereços; conta: aba Pedidos
- `script em button` linear — em: conta: aba Endereços; conta: aba Pedidos
- `script em div` ease-out — em: fechar tudo (logo)

**Solução:** Trocar `cubic-bezier(.2,.8,.2,1)` das fotos, da sombra do topo e da gaveta do menu (`aside.dpn`, `div.dsc`) pela curva de luxo. `linear` do destaque (`hdkb`, `hdpg`) FICA: movimento contínuo pede linear. `ease-out` do anel do WhatsApp vira a curva de saída.

### longa (mais de 0,7 s) — 19 ocorrências, 3 casos diferentes

- `hdkb em img` 6200 — em: abrir o site; voltar ao topo; abrir o menu; fechar o menu (+3)
- `hdpg em button.on` 6000 — em: abrir o site; voltar ao topo; abrir o menu; fechar o menu (+3)
- `ring em a.wa` 3000 — em: abrir o site; fechar o menu; fechar a busca; abrir uma peça (+1)

**Solução:** `hdkb` (zoom lento da foto do destaque, 6,2 s) e `hdpg` (barra de tempo, 6 s) são de propósito: ficam. `ring` do WhatsApp (3 s, sem fim): pulsar 2 vezes ao abrir a página e parar.

### ainda rodando 1,7 s depois — 20 ocorrências, 3 casos diferentes

- `hdkb em img` 6200 — em: abrir o site; voltar ao topo; abrir o menu; fechar o menu (+4)
- `hdpg em button.on` 6000 — em: abrir o site; voltar ao topo; abrir o menu; fechar o menu (+4)
- `ring em a.wa` 3000 — em: abrir o menu; abrir a busca; fechar a busca; abrir uma peça

**Solução:** São os mesmos laços (`hdkb`, `hdpg`, `ring`). Pausar os do destaque quando ele sai da tela ou há janela por cima (hoje seguem rodando atrás da conta/sacola).

### mexe em tamanho/posição — 3 ocorrências, 2 casos diferentes

- `transição:right em a.wa` ["right"] — em: abrir uma peça
- `script em i.mcPl` ["width"] — em: conta: aba Endereços; conta: aba Pedidos

**Solução:** Botão do WhatsApp anda com `transform` em vez de `right`; a linha das abas da conta (`i.mcPl`) com `translateX + scaleX` em vez de `width`.

### quica — 1 ocorrências, 1 casos diferentes

- `cadp em div.cadb` cubic-bezier(0.2, 0.9, 0.25, 1.15) — em: Comprar (vai para a sacola)

**Solução:** `cadp` (confirmação ao tocar Comprar) na curva de luxo, sem o 1.15.

### CÓPIAS do painel ao mesmo tempo (fantasma) — 2 ocorrências, 2 casos diferentes

- `{'max': 4, 'quadros2': 23, 'pior': 17}`  — em: conta aberta → menu → Minha conta
- `{'max': 4, 'quadros2': 23, 'pior': 33}`  — em: sacola aberta → menu → Minha conta

**Solução:** Ver item 1.

## 4. APP — todos os problemas (95 animações vistas)

### fora da curva de luxo — 80 ocorrências, 23 casos diferentes

- `lfEntra em #v-inicio` cubic-bezier(0.2, 0.8, 0.2, 1) — em: tela inicio
- `cas em div.hero` cubic-bezier(0.2, 0.8, 0.2, 1) — em: tela inicio; voltar ao início; inventário: fechar a peça (voltar); compartilhar: fechar a janela (+1)
- `cas em button.tl` cubic-bezier(0.2, 0.8, 0.2, 1) — em: tela inicio; voltar ao início; inventário: fechar a peça (voltar); compartilhar: fechar a janela (+1)
- `transição: em i.lfLinha` cubic-bezier(0.2, 0.9, 0.3, 1) — em: tela estoque; inventário: trocar de aba (Fornecedores)
- `lfDesenha em path` ease-in-out — em: tela ped; tela clientes; pedidos: trocar para Feitos
- `lfSobe em b` ease — em: tela ped; tela clientes; pedidos: trocar para Feitos
- `lfSobe em span` ease — em: tela ped; tela clientes; pedidos: trocar para Feitos
- `lfDesenha em circle` ease-in-out — em: tela clientes
- `transição:left em div.lfPill` cubic-bezier(0.2, 1.25, 0.35, 1) — em: inventário: trocar de aba (Fornecedores); inventário: voltar à aba Produtos
- `transição:width em div.lfPill` cubic-bezier(0.2, 1.25, 0.35, 1) — em: inventário: trocar de aba (Fornecedores); inventário: voltar à aba Produtos
- `transição:opacity em img.lfOk` cubic-bezier(0.2, 0.8, 0.2, 1) — em: inventário: voltar à aba Produtos; inventário: abrir uma peça
- `transição:transform em img.lfOk` cubic-bezier(0.2, 0.8, 0.2, 1) — em: inventário: voltar à aba Produtos; inventário: abrir uma peça
- `enterUp em #listCard` cubic-bezier(0.2, 0.8, 0.2, 1) — em: inventário: voltar à aba Produtos
- `enterUp em #vDetail` cubic-bezier(0.2, 0.8, 0.2, 1) — em: catálogo: abrir uma peça
- `transição: em #vDetail` ease-out — em: catálogo: abrir uma peça
- `transição: em div.lfFundo` cubic-bezier(0.2, 0.9, 0.3, 1) — em: catálogo: abrir uma peça
- `transição: em div.lfVoa` cubic-bezier(0.2, 0.9, 0.3, 1) — em: catálogo: abrir uma peça
- `enterUp em #vListCard` cubic-bezier(0.2, 0.8, 0.2, 1) — em: catálogo: voltar
- `transição:box-shadow em button.pcard` cubic-bezier(0.2, 0.8, 0.2, 1) — em: compartilhar: abrir a janela
- `transição:transform em button.pcard` cubic-bezier(0.2, 0.8, 0.2, 1) — em: compartilhar: abrir a janela
- `transição:transform em #ebBar` cubic-bezier(0.3, 1.3, 0.5, 1) — em: compartilhar: abrir a janela
- `transição:opacity em div.ljBk.anim` ease — em: compartilhar: abrir a janela
- `transição:transform em div.ljJn.ebJn` cubic-bezier(0.2, 1.25, 0.4, 1) — em: compartilhar: abrir a janela

**Solução:** Uma curva só em tudo: entrada `cubic-bezier(.16,1,.3,1)`, saída `cubic-bezier(.4,0,.2,1)`. Trocar a curva antiga dentro de `lfEntra`, `cas` e das transições de botão (variáveis `--lux-in`/`--lux-out`; nada escrito à mão em cada regra).

### duas ou mais animações no mesmo elemento ao mesmo tempo — 7 ocorrências, 2 casos diferentes

- `button.tl` ["cas", "cas", "cas", "cas"] — em: tela inicio; voltar ao início; inventário: fechar a peça (voltar); compartilhar: fechar a janela (+1)
- `path` ["lfDesenha", "lfDesenha"] — em: tela ped; pedidos: trocar para Feitos

**Solução:** Cascata dos atalhos (`cas`): anima UMA vez, só na primeira entrada no Início; ao voltar não repete. `lfDesenha`: uma animação por traço. (Parte desta contagem é de botões irmãos e não é defeito.)

### mexe em tamanho/posição (trava em celular fraco) — 8 ocorrências, 5 casos diferentes

- `transição: em i.lfLinha` ["left", "width"] — em: tela estoque; inventário: trocar de aba (Fornecedores)
- `transição:left em div.lfPill` ["left"] — em: inventário: trocar de aba (Fornecedores); inventário: voltar à aba Produtos
- `transição:width em div.lfPill` ["width"] — em: inventário: trocar de aba (Fornecedores); inventário: voltar à aba Produtos
- `transição: em div.lfFundo` ["height", "left", "top", "width"] — em: catálogo: abrir uma peça
- `transição: em div.lfVoa` ["height", "left", "top", "width"] — em: catálogo: abrir uma peça

**Solução:** Linha/pílula das abas e o voo da ficha andam com `transform` (translate + scale), nunca com left/width/top/height. Abas = lote A já aprovado; falta o voo `lfVoa`/`lfFundo`.

### longa (mais de 0,7 s) — 6 ocorrências, 2 casos diferentes

- `lfDesenha em path` 1000 — em: tela ped; tela clientes; pedidos: trocar para Feitos
- `lfDesenha em circle` 1000 — em: tela clientes

**Solução:** `lfDesenha` (desenho dos ícones de tela vazia) de 1,0 s para 0,6 s, uma vez por tela.

### quica (passa do ponto e volta) — 6 ocorrências, 4 casos diferentes

- `transição:left em div.lfPill` cubic-bezier(0.2, 1.25, 0.35, 1) — em: inventário: trocar de aba (Fornecedores); inventário: voltar à aba Produtos
- `transição:width em div.lfPill` cubic-bezier(0.2, 1.25, 0.35, 1) — em: inventário: trocar de aba (Fornecedores); inventário: voltar à aba Produtos
- `transição:transform em #ebBar` cubic-bezier(0.3, 1.3, 0.5, 1) — em: compartilhar: abrir a janela
- `transição:transform em div.ljJn.ebJn` cubic-bezier(0.2, 1.25, 0.4, 1) — em: compartilhar: abrir a janela

**Solução:** Tirar o quique: `.lfPill` (1.25), janela de compartilhar (1.25) e barra de seleção (1.3) vão para a curva de luxo.

### Outros achados do app (leitura do código)
- Duas regras de `transition` disputam os botões → uma regra só (lote A).
- 7 animações sem fim fora de carregamento e 4 escritas e nunca usadas → parar as primeiras; apagar as 4 mortas.
- **Não vistos no simulador** (abrem em branco sem dados): Mensagens, Analisador, Temática, Atacado, Online; fluxo de venda e detalhe do pedido. Faltam medir.

## 5. Seletores (trilho) — regra do arrastar

- **Regra do dono (15/11/2026)**: todo seletor em trilho/pílula aceita o dedo ARRASTANDO a pílula (além do toque).
- **Hoje**: nenhum trilho do app arrasta. `.trk` em 9 arquivos (peça, faixas, vendas Varejo/Atacado, novo modelo, brindes, câmbio, ajustes, catálogo, marketing, graus/cor); `.nav`+`.chip` em 7 arquivos (entre eles Ordem e Faixa dos Filtros, que nem têm pílula deslizante: o fundo PULA); abas `.lfAbas` em 3. Site: abas da conta (`.mct`) e 3 `.seg`, sem arrastar.
- **Solução**: UM componente de trilho para app e site (pílula com `transform`, toque + arrastar, solta no mais próximo, curva de luxo); todos os seletores acima passam a usá-lo. Esboço: `work/s330/10-trilho-arrastar-quadros.jpg`.
- **Filtros do inventário**: sem "Ver N peças" e "Cancelar"; filtro vale na hora, contagem ao lado do título, fecha arrastando para baixo ou tocando fora. Esboços: `work/s330/9-filtros-escuro.jpg` e `9-filtros-claro.jpg`.
