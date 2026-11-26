# COMO FAZER — Semp no app · Parte 2: Estúdio ↔ Marketing e a Galeria (ESBOCO, 26/11/2026)

**Estado:** esboço pronto — esperando o dono. Pela regra 6 (dono 26/11 11:29), o "aprovado" já manda implementar logo, em fatias.

## Imagens (claro e escuro, em work/esboco/semp/)
| Tela | Imagem | O que mostra |
|---|---|---|
| Estúdio | esboco_S2a_estudio_{escuro,claro}.jpg | HOJE × BASE × PROPOSTA. A base é o 43 + 45a, aprovados e ainda não implementados. |
| A fila do dia | esboco_S2b_fila_do_dia_{escuro,claro}.jpg | o atalho do Estúdio abre o Passo 1 do Criar só com as peças gravadas hoje |
| Galeria vazia | esboco_S2c_galeria_vazia_{escuro,claro}.jpg | Criar › Galeria sem fotos |
| Galeria | esboco_S2d_galeria_{escuro,claro}.jpg | Criar › Galeria com fotos |

Comparador Hoje × Proposta e medidor do Argus: `comparador_S2.md`. O medidor só acha 1 coisa: o contraste da frase "Fotos e giros das peças" no claro (3,75:1). É a cor do `.crumb` do app de hoje e está igual na base aprovada (43). Não foi criada aqui, mas fica anotada para a família (regra 17).

Script: `esboco_S2_estudio.py`, com a mesma base da parte 1.

## Aprovados incluídos
- 43: Estúdio como tela do grupo Peças, com "‹ PEÇAS", Galeria e "?" redondos e sem "×".
- 45a: "Gravar uma peça ›", EM ANDAMENTO e FALTAM FOTOS.
- Semp parte 1, aprovada 26/11 11:29: Criar em 3 passos e "Usar em".
- Regras 15 e 16: tela vazia = ícone + frase + explicação; lugar = ›.
- Família 81/86.
- Decisões do dono de 25/11:
  - Estúdio = primeira camada, só gravação, e dele sai SÓ um atalho para o Marketing;
  - dia de ~200 fotos = UMA linha de resumo que abre a fila do dia, sem lista longa;
  - Galeria com "Usar em".

## As telas
1. **Estúdio:** igual ao 43 + 45a, com UMA linha a mais logo abaixo de "Gravar uma peça ›": **"Hoje no Estúdio ›"**.
   - O resumo diz "N peças · N fotos · para o Marketing".
   - A linha só aparece nos dias com gravação. Nos outros dias, nada muda.
   - É o único caminho do Estúdio para o Marketing: nenhum outro botão de marketing no Estúdio.
2. **A fila do dia:** "‹ Estúdio", h1 "Peça". É o MESMO Passo 1 da parte 1, só com as peças gravadas hoje.
   - Rótulo "Passo 1 de 3 · gravadas hoje · N".
   - As 5 que o Semp põe primeiro, cada uma com foto, motivo, preço e ›.
   - Uma linha fina "As outras N de hoje ›" mostra o resto, na mesma ordem.
   - Tocar numa peça segue para o Cenário, igual ao Criar.
3. **Galeria vazia:** "‹ Criar", h1 "Galeria", e o vazio do app (`lfVazioHtml`, ícone + frase + explicação).
4. **Galeria:**
   - O rótulo é o mês, com o número de fotos.
   - Duas colunas: cada foto (3:4, fundo branco), o título "modelo · cenário" e, embaixo, onde ela já foi usada ("post qui · story sex", "ainda não usada", "vitrine do site").
   - Tocar numa foto abre o Passo 3 · Pronto daquela foto, com "Usar em" (parte 1).
   - Com esta tela pronta, entra a linha "Galeria ›" do Criar, que a parte 1 deixou de fora.

## Como fazer (regra 12)
- **Um lugar só para "o que é de hoje":** uma função `estHoje()` lê as gravações com data de hoje (os registros do Estúdio, `S.est…`) e devolve peças e fotos.
  - O resumo do Estúdio e a fila do dia usam essa mesma função.
  - Sem contagem copiada nem lista separada.
- **A fila do dia não é tela nova:** é o Passo 1 (`sempPeca`) com o filtro "hoje".
  - A ordem e o motivo vêm do mesmo `sempPontua` da parte 1.
  - O "‹" diz de onde veio ("‹ Estúdio" ou "‹ Criar").
- **Galeria = as fotos da coleção `publicacoes` que têm mídia.** O "onde já foi usada" vem dos itens da Agenda e das publicações ligadas à foto (o mesmo dado do "Usar em").
  - Nada é guardado em duplicado.
  - A foto da vitrine em estúdio bege vai também para o Início e para os catálogos do site (decisão de 25/11), pelo envio de hoje.
- **Código e estilo:** no arquivo da família Semp (`src/97-semp-criar.js`) e no mesmo bloco de CSS.
  - O resumo do Estúdio é uma linha `nvL` do app, no arquivo do Estúdio.
  - Sai junto o que o 45 já mandava sair ("Começar · N peças na fila").

## Travas no Argus (regra 12e)
- O Estúdio tem no máximo um caminho para o Marketing, e a linha some quando não há gravação hoje.
- A fila do dia mostra no máximo 5 peças + a linha fina.
- O número do resumo é igual ao número da fila.
- Galeria vazia = o vazio do app.
- Tocar numa foto da Galeria abre o Pronto com "Usar em".

## Testado / não testado
- **Testado no simulador** (celular do dono, claro e escuro): fotos das 8 telas, comparador e medidor.
- **NÃO testado:** com gravação de verdade no Estúdio; nada em aparelho real.
