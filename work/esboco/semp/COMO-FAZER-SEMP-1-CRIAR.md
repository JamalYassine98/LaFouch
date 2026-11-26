# COMO FAZER — Semp no app · Parte 1: Marketing › Criar (ESBOCO, 26/11/2026)

**Estado:** esboço pronto — esperando o dono. A APP só implementa depois do "implementar" do dono, EXATAMENTE isto, com o selo do Argus (regra 21) e o "OK ESBOCO" (regra 1b).

## Imagens (claro e escuro, Hoje × Proposta)
| Tela | Imagem (work/esboco/semp/) |
|---|---|
| Criar (o setor) | esboco_S1a_criar_{escuro,claro}.jpg — base = 73s aprovado, ainda não implementado |
| Passo 1 · Peça | esboco_S1b_peca_{escuro,claro}.jpg |
| Passo 2 · Cenário | esboco_S1c_cenario_{escuro,claro}.jpg |
| Passo 3 · Pronto, antes de gerar | esboco_S1d_pronto_{escuro,claro}.jpg |
| Passo 3 · Pronto, com a foto | esboco_S1e_pronto-foto_{escuro,claro}.jpg |
| Criar › Sua ideia (janela) | esboco_S1f_sua_ideia_{escuro,claro}.jpg |

Comparador Hoje × Proposta e medidor do Argus em todas as telas: `comparador_S1.md`. O medidor dá 0 achados nas 12 propostas. Nas telas novas, as diferenças do comparador são a troca inteira; na tela Criar, são estas:
- sai a lista Formato (6 linhas);
- entram os blocos Começar e Feitos;
- as Listas sobem 151 px.

Script: `esboco_S1_criar.py` (base comum `base.py`). Ele usa o app real do commit atual, as classes do próprio app e as peças reais do site.

## Aprovados incluídos
- 70: setores, "‹ Marketing", sem subtítulo.
- 73s: Criar com "Listas de transmissão ⌄". A lista Formato do 73s é a parte que esta proposta troca.
- 72/72b: o item da Agenda abre a janela de criar de hoje.
- Regras 15 e 16:
  - tarefa = janela de baixo com um "Salvar";
  - lugar = ›;
  - ler = ⌄;
  - etapa = tela própria com "‹ etapa anterior".
- 37b: ícones e rótulos cinza.
- 81/86: família de botões e linhas. O botão principal é o contorno rosa (`.go`).
- Decisões do dono de 25/11 sobre o Semp (lista viva, bloco SEMP):
  - Criar em 3 passos;
  - "Entendi assim" e "Não é isso" em linha fina, antes de gastar crédito do Flow;
  - "Sua ideia";
  - Flow numa aba integrada, com o dono apertando "gerar";
  - estoque 1 não é anunciado;
  - "Usar em".

## As telas
1. **Criar** — "‹ Marketing", h1 "Criar", e quatro linhas:
   - **Começar · Do Estúdio ›**: abre o Passo 1. O resumo diz quantas peças têm foto do Estúdio.
   - **Começar · Sua ideia**: é tarefa, sem seta; abre a janela 6.
   - **Feitos · Galeria ›**: "nenhuma" quando vazia. A tela da Galeria vai na Parte 2: até lá, NÃO implementar esta linha.
   - **Listas de transmissão ⌄**: igual ao 73s.
   - Sai a lista Formato do 73s: os formatos saem todos do Passo 3.
2. **Passo 1 · Peça** — "‹ Criar", h1 "Peça", rótulo "Passo 1 de 3 · o Semp sugere".
   - Cada linha tem a foto do Estúdio, o nome curto, o motivo, o preço em G$ e ›.
   - Embaixo, em dica: o que ficou fora e por quê (estoque 1).
3. **Passo 2 · Cenário** — "‹ Peça", h1 "Cenário", nesta ordem:
   - a linha da peça (com o nome sugerido);
   - "Entendi assim" (2 ou 3 frases);
   - "Não é isso ›" (linha fina);
   - "Passo 2 de 3 · cenários": cada linha tem título, motivo e ›;
   - "Modelo": o rosto escolhido. É tarefa, sem seta; tocar abre a escolha em janela de baixo.
4. **Passo 3 · Pronto (antes)** — "‹ Cenário", h1 "Pronto", nesta ordem:
   - a linha peça · cenário · modelo;
   - "Prompt do Flow ⌄" (abre o texto no lugar);
   - **"Gerar no Flow"**: o ÚNICO botão principal da tela;
   - a dica "O Flow abre aqui dentro…";
   - "O que sai desta foto": Post, Story, Status, Carrossel, cada um com o horário da Agenda; e "Roteiro do reel ⌄".
5. **Passo 3 · Pronto (com a foto)** — nesta ordem:
   - a foto que o dono salvou (quadro 3:4, fundo branco);
   - "Não é isso ›";
   - "Usar em": Post, Story, Status, Carrossel. Cada linha é tarefa: abre a janela de criar de hoje (`.mkCrJn`) com aquele formato e esta foto, como no 72b;
   - dica: "Fica guardada na Galeria · os horários vêm da Agenda".
6. **Sua ideia** — janela de baixo (`lfJanela`):
   - uma frase de explicação;
   - campo de texto em linha fina;
   - um "Salvar";
   - se o dono mudou o texto e tenta sair, pergunta "Sair sem salvar?".
   - Ao salvar, abre o Passo 3 com "Entendi assim" e o que o Semp ajustou.

## Como fazer (regra 12: a lógica, num lugar só)
- **Um arquivo da família:** `src/97-semp-criar.js` e um bloco próprio no CSS.
  - As linhas são as do app: `section.nvLista` > `button.nvL`, com `.nvIc`, `.nvTx b/small`, `em.tiV` e `i`.
  - O resto também é do app: título `.nvVs` + `.top.grpTop h1`, rótulo `.lbl.tiLb` (32 px acima e 24 no primeiro, num lugar só), dica `p.hint`, botão `.go`.
  - Nada desenhado à parte.
- **A ordem das peças:** uma função só, `sempPontua(ref)` (modo regras da Lógica do Semp §3).
  - Lê o estoque de Peças e as datas da Temática pela MESMA lógica do item 70 §7 (calOc/calProx). Não copia as datas.
  - Estoque 1 fica fora; estoque 2–3 diz "últimas N", com o número real.
  - O motivo mostrado é o texto da regra que deu os pontos. Não se escreve motivo à parte.
  - Sem venda ou dias parada inventados.
- **Os cenários:** uma tabela de regras (`sempCenarios`: tipo de peça × momento × cor → título + motivo). A vitrine em estúdio bege está sempre na lista.
- **O resto do Semp sai do mesmo lugar:**
  - O "Entendi assim", o prompt e as legendas saem da mesma escolha (peça, cenário, modelo), por moldes com campos {peca} {cor} {cenario} {modelo} {data}.
  - Com o cérebro ligado (depois), a API devolve esses mesmos campos (entendi_assim, prompt, legendas), na tomada do item 9 da Lógica. Trocar o motor não mexe nas telas.
- **Gerar no Flow** (o app não automatiza nada):
  1. Copia o prompt para a área de transferência.
  2. Salva as 3 fotos de referência do giro (frente, três quartos, lado) numa pasta "LaFouch Semp" da galeria.
  3. Abre labs.google/flow na aba integrada do Android: Capacitor Browser = Custom Tabs; no PC, outra aba.
- **A volta da foto:** ao voltar para o app (resume), o Passo 3 mostra a escolha da foto salva (o seletor da galeria).
  - A foto é guardada UMA vez (em `publicacoes`, campo mídia).
  - Os recortes 4:5, 9:16, status e carrossel saem dela na hora. Não se guardam cópias.
- **"Não é isso":** volta ao Passo 2 com uma versão nova e conta como sinal de aprendizado (`resultados`).
- **Ao tocar numa linha do "Usar em":** reaproveita a janela de criar de hoje (mkCria com o formato e a foto). Não é uma janela nova.

## Sai no mesmo passo (regra 12d)
A lista Formato do 73s nunca foi implementada. Com o "aprovado" do dono, ela vai para work/obsoletos e esta proposta substitui o setor Criar do COMO-FAZER-MARKETING-70 §5.

## Travas no Argus (regra 12e)
- Estoque 1 nunca aparece no Passo 1.
- O motivo de cada peça é o da regra que a pontuou.
- Nenhum texto com reticências: L4, nas 3 letras.
- O Passo 3 tem um só botão principal.
- "Usar em" abre `.mkCrJn` com o formato certo.
- Sua ideia é janela de baixo com "Salvar" e pergunta "Sair sem salvar?".
- O "‹" de cada passo volta ao passo anterior.

## Testado / não testado
- **Testado no simulador** (celular do dono, claro e escuro):
  - fotos das 12 telas, comparador e medidor do Argus;
  - os textos cabem sem reticências.
- **NÃO testado:**
  - a aba integrada do Flow e a galeria do Android (precisam de aparelho);
  - nada em aparelho real.
