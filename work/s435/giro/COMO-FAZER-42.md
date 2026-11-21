# Esboço 42: Editar produto › Cores e fotos, sem "Trocar foto" e com a "Nova cor" fácil · S435 ESBOCO · 21/11

Pedidos do dono (recados da APP):
- 20/11 23:36: "na ficha do Inventário › Editar produto › Cores e fotos, a câmera/'Trocar foto' parece inútil para ele, rever o que ela faz e se fica"
- 20/11 23:39: "cadastrar as CORES de uma peça devia ser mais fácil"

Imagem: esboco_42_cores_e_fotos.jpg, com Hoje × Proposta × janela "Nova cor". Base: app v587 + aprovados, na peça YS8801 (Óculos solar #13).

## O que "Trocar foto" faz hoje (lido no código)
`pickPhoto()` (10-estoque-detalhe.js:191) abre `camOpen` em modo só-foto e manda a imagem **crua** para `#file`. Com isso:
- **Não passa pelo tratamento do Estúdio** (fundo branco, enquadramento, nota). A foto que fica é diferente de todas as outras da loja.
- Vale só para **a cor que está aberta** na ficha, sem dizer qual. Na tela é "Trocar foto" ao lado de uma foto sem nome.
- Cada linha de cor já tem **"refazer ›"**, que faz o mesmo do jeito certo (`estCam({k, passo:'frente', salva:true})`, linha 1146).
Conclusão: dois caminhos para a mesma coisa, e o mais visível é o pior. **"Trocar foto" sai.** A foto do topo fica como identidade da peça, sem botão.

## Nova cor
- Hoje, "Cor nova (tire a foto)" exige a câmera **antes** de existir a cor: a foto serve para sugerir o nome.
  O mesmo botão está escrito **duas vezes**: 10-estoque-detalhe.js:1322 (Editar) e 85-novo-modelo.js:525 (Cadastro).
- Proposta: "+ Nova cor ›" (linha com o + redondo, regra 15) abre a **janela de baixo "Nova cor"**:
  - QUAL COR: as cores que a loja já usa, das mais usadas para as menos, mais "Outra…" para escrever.
  - "Não sei o nome: tirar uma foto e o app sugere ›" (o caminho de hoje, que continua para quem quiser).
  - Código (C5, o próximo, sugerido) · Quantidade (−/+) · Custo (o mesmo das outras cores, dá para mudar).
  - "A foto fica para depois: a cor entra na fila do Estúdio." e o Salvar (o mesmo botão de contorno rosa do "Salvar" do Editar produto).
  - Ao salvar, a cor aparece na lista e entra na fila do Estúdio (que já lista as cores sem foto).

## Como fazer (jeito natural, regra 12)
- **Uma função para criar cor:** `corNova(ref, {cor, classe, q, custo})`, usada pelo Editar e pelo Cadastro.
  Os dois `cfNova` (10-estoque-detalhe.js:1318 e 85-novo-modelo.js:521) viram a mesma linha "+ Nova cor ›", que abre a mesma janela (`lfJanela`).
  Sai o `edFotoNova` duplicado. A sugestão pela foto vira uma opção dentro da janela, que chama a câmera e devolve a cor sugerida.
- **Cores da loja:** a lista sai das cores já cadastradas (`S.items`, contadas por uso). Não é uma lista fixa no código.
- **Apagar no mesmo passo:** `pickPhoto`, `#edTrocaFoto` e o CSS `.edTroca`; o "(tire a foto)" do texto; o comentário v417 que descreve o botão.
- **Trava no porteiro:**
  - Não existe `#edTrocaFoto`.
  - Editar e Cadastro têm a mesma linha "Nova cor ›".
  - Salvar uma cor sem foto cria a linha e a cor aparece na `estFila`.
  - Toda foto de peça passa pelo tratamento do Estúdio, e nenhum caminho grava foto crua em `S.fotos`.

## Fora deste esboço (anotado)
Os selos de cada cor ("refazer ›", "○ fora do site", "● catálogo") misturam três estilos de pílula, e a ficha inteira ainda mostra
"‹ PEÇAS", o caminho "Inventário › Lote …" **e** "‹ INVENTÁRIO" na mesma tela (regra 16: um título por tela). Isso é a parte 134 (4d).
