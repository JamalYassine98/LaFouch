# Esboço 45: a peça com foto nasce no Estúdio e o Inventário completa · S435 ESBOCO · 21/11 (rumo aprovado pelo dono às 10:43)

Decisões do dono que entram aqui (21/11):
- 09:43: sai a fila de 24; a sessão é por peça, com todas as cores.
- 10:01: grava e trata na loja, termina em casa.
- 10:30: só se cadastra o que está tratado.
- 10:32–10:34: botão "Terminei esta peça"; grupo aberto não fecha sozinho e o Guardião avisa.
- 10:38: o aviso depende do estado aberto/fechado, não do tempo.
- 10:43: o Inventário dá os detalhes técnicos (material, descrição, custo, preço, ofertas, publicar).

Supera o 41c (obsoletos/s435-41c) e refaz o Adicionar do 44.

Imagens (celular escuro):
- esboco_45a_estudio.jpg: Estúdio, com "Gravar uma peça ›", EM ANDAMENTO e FALTAM FOTOS
- esboco_45b_qual_peca.jpg: 1 "Gravar uma peça" (Ler a haste / Digitar / Sem código) · 2a código novo → rascunho · 2b código que já existe
- esboco_45c_depois_de_cada_cor.jpg: depois de cada giro, "Gravar outra cor" ou "Terminei esta peça ›"
- esboco_45d_inventario_completar.jpg: Inventário com "A COMPLETAR · N" · janela "Completar TS1234"

TS1234 e SL2250 são rascunhos ilustrativos, porque ainda não existe nenhum. BR44118 é peça real dos dados de teste.

## Estados de uma peça, num lugar só
`rascunho.estado` = `aberta` → `finalizada` (o dono tocou em **"Finalizar peça"**) → `a completar` (finalizada **e** todas as cores gravadas tratadas) → a peça fica **ativa** ao "Concluir".
O andamento do tratamento é mostrado como fato ("4 cores gravadas · 1 tratando"), **nunca como fração ou barra**. O total de cores de uma peça não é conhecido (dono 10:53).
Peça que já existe (código lido) não vira rascunho: as cores gravadas entram nela, e cada cor passa por `tratando` até ficar pronta.

## Telas
1. **Estúdio** (tela do grupo Peças, esboço 43):
   - O botão principal é **"Gravar uma peça ›"**. Sai o "Começar · 24 peças na fila".
   - **EM ANDAMENTO · N**: os rascunhos e as gravações em curso, com o estado em palavras ("aberta · 2 cores gravadas · continuar", "finalizada · 4 cores gravadas · 1 tratando", "finalizada · 5 cores · a tratar em casa"). Sem barra de progresso.
   - **FALTAM FOTOS · N**: as peças ativas a que falta frente, 3/4 ou giro, com as marcas do 41. Tocar abre a Galeria da peça.
2. **"Gravar uma peça ›"** abre a janela "Primeiro, qual é a peça?", com três opções:
   - Ler a haste (o leitor de hoje, `80-leitor-dialogos.js`)
   - Digitar o código
   - Peça sem código (ganha um número provisório)
   - 2a, código novo: "TS1234 · Peça nova · vai nascer como rascunho" → "Gravar as cores ›" e "Ler de novo ›".
   - 2b, código que já existe: a foto e o nome da peça, "já cadastrada · N cores com foto" → "Gravar cores desta peça ›" e "Não é esta peça · ler de novo ›".
     A cor que já tem giro é trocada pela nova (fica a melhor, como hoje em `estGrava`).
3. **Câmera:** o título diz "GIRO · COR n" e "código · peça nova" (ou o nome da peça).
   Depois de cada giro: "Cor n gravada ✓ · tratando por trás · N na fila", **"Gravar outra cor"** e **"Finalizar peça ›"** (texto escolhido pelo dono às 10:55).
   **Sair da câmera só pausa** (ex.: para registrar uma venda): não fecha e **não pergunta nada**. A peça fica "aberta · continuar ›" no Estúdio. Só "Finalizar peça" fecha.
4. **Guardião (Pendências):** cada rascunho aberto entra em "Para acompanhar" ("TS1234 · aberta · 2 cores gravadas · Continuar ›").
   Ele **não depende do tempo**: só sai quando o grupo é fechado.
5. **Inventário:** "**A COMPLETAR · N**" no alto da lista, só com rascunhos **já tratados** (todas as cores), cada linha com o que falta.
   Tocar abre a janela **"Completar código"**:
   - Tipo (trilho)
   - Como é: Formato (sugerido pela imagem), Material, Gênero
   - Preço: Custo por peça (da nota, se houver), Preço de venda (sugerido pelo contador), Oferta
   - Cores · N: cada cor com o nome sugerido pela imagem e a quantidade −/+
   - Descrição e mais detalhes ⌄
   - Publicar no site
   - "Concluir" fixo embaixo
6. **Adicionar do Inventário:** fica só com o que **não passa pelo Estúdio**: "Chegou mercadoria" (a nota) e "Preencher à mão" (peça sem foto: pré-graduado em pacote, brinde).
   Saem do Adicionar "Ler haste", "Ler etiqueta"/"Foto" e "Da Galeria".
   A leitura da etiqueta (`fmAnalisa`) continua útil para o pré-graduado em pacote: vai para dentro de "Preencher à mão" como o ícone de ler no campo, a confirmar com o dono.

## Como fazer (jeito natural, regra 12)
- **Um registro só** para peça nova com foto: `S.rascunhos[codigo] = {estado, cores:[{giro, tratado, cor?}], ts, fechado}`.
  O Estúdio cria e grava, o tratamento atualiza, o Inventário completa e converte em `S.items` com o mesmo código.
  Não há um segundo caminho: sem "sem peça" e sem "ligar depois".
- **A haste é lida num lugar só:** a mesma função do leitor (`80-leitor-dialogos.js`), chamada pela janela "Gravar uma peça".
  O botão "Ler haste" do Adicionar sai, junto com a gaveta "Buscar com a câmera" (`87-camera-gaveta.js`) se ela só servia a isso: conferir com o app rodando.
- **Fila de tratamento:** o tratamento é **um trabalhador com fila** (`trataFila`), que pega a próxima cor gravada (deste celular ou, depois, do PC; ver o pedido à NUVEM).
  A tela só mostra o estado. Nada espera o tratamento.
- **Sugestões** (formato, nome da cor): a assinatura de aparência que já existe (`fmSigDe`) e a cor média do recorte. Sempre como "sugerido", e o dono confirma.
- **Guardião:** um item por rascunho com `fechado=false`, na função de itens das Pendências. A frase sai de uma tabela de estados, num lugar só.
- **Trava no porteiro:**
  - Código lido que existe → nenhum rascunho criado.
  - Rascunho só aparece em "A completar" com todas as cores tratadas.
  - "Concluir" cria a peça com as N cores e as fotos, e o rascunho some.
  - O Adicionar não tem "Ler haste" nem "Da Galeria".
  - O aviso do Guardião não usa relógio.

## Fica para depois (anotado)
- A câmera ler a haste sozinha durante o giro (estudo, dono 10:38).
- Casar o rascunho com a linha da nota de compra pelo código (custo e quantidade automáticos).
- A fila "A tratar" no PC de casa (espera a resposta da NUVEM sobre o espaço sem custo).

## Correções do dono (21/11 10:53–10:55)
- Sai a barra de progresso: não se sabe quantas cores a peça tem.
- "Terminei" era ambíguo: sair para vender não é terminar. O botão chama-se **"Finalizar peça"**, sair só pausa e não há pergunta na saída.
