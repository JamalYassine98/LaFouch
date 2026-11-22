# Compras · Parte A — a lógica da compra (sem tela)

Esboço ESBOCO/S435 · 21/11/2026, atualizado 22/11 05:50 com os aprovados 51/51b (versão anterior em work/obsoletos/s435-superados-21-11/). Base: direção aprovada 12:12 (Peças = Inventário · Estúdio · Compras) e decisão do dono 12:51.

## 1. A lista pede VAGAS, não modelos

O mercado de óculos troca de produto o tempo todo. Muitas vezes o mesmo modelo não existe mais para comprar.
Por isso a lista não diz "SP57765 × 3". Ela diz qual **vaga** ficou aberta no estoque:

> Faltam 3 · solar · feminino · metal · custo até US$ 4

**O que define a vaga (dono 21/11 12:58):** tipo · gênero · faixa de custo · **material**. O material mantém o equilíbrio: a loja não pode ter tudo de metal, tudo de nylon ou tudo de acetato. O **formato** também conta, mas é lido **na foto** da peça (Estúdio), nunca na descrição.

A vaga é calculada de novo todo dia a partir das vendas. Ela nunca acumula modelo velho.

## 2. Três tipos de modelo, três jeitos de repor

Quem decide o tipo é o **fluxo** (seção 7), não a curva ABC nem os dias parado.

| O modelo que acabou | O que a lista propõe |
|---|---|
| **Estrela** (fluxo acima da média) | 1º o **mesmo** modelo. Se a distribuidora não tiver, um **equivalente** de preço parecido; pode ser um pouco mais caro. O Guardião confere se a margem continua boa. Nunca é trocada enquanto der para repor. |
| **Normal** | A vaga aberta. Qualquer modelo que sirva para ela. |
| **Fracasso** (fluxo abaixo da média, mesmo com oferta) | Não repõe **o mesmo**. A vaga já traz as **alternativas para comprar agora**: as maiores tendências do mesmo tipo, mantendo o equilíbrio de material (esboço 51, quadro 2). |

## 3. O caminho de cada vaga (esboços 51 e 51b, aprovados 22/11)

1. **Vaga aberta.** O app calcula a vaga pelas vendas, todo dia.
2. **Sugestão.** Primeiro o app copia o seu jeito: o que você costuma comprar para aquela vaga. Só depois o Semp sugere modelos melhores, e o Guardião confere o preço (essência do projeto, dono 22/11 00:21).
3. **Pedida.** "Pedir" junta todas as vagas sem fechar numa **mensagem só, em espanhol**. Você escolhe no próprio WhatsApp para quem mandar: uma distribuidora ou várias. Não precisa escolher a distribuidora antes. A vaga fica "pedida · esperando resposta", sem prazo: ela não volta sozinha.
4. **Fechada.** Um toque em **"Fechei com…"** diz a distribuidora, o modelo, as peças e o custo, e o Guardião diz se a margem é boa. A vaga diminui na hora; se ainda faltar, o resto continua pedida.
5. **Chegou.** "Chegou mercadoria" (no "+" do Inventário) puxa o que foi fechado e confere o que chegou e o que faltou. A peça vai para o Estúdio e depois para "Completar peça do Estúdio".
6. **Ninguém tinha (51b).** Três saídas: **procurar parecido** (outro material ou formato que vende, ou custo um pouco maior) · **avisar quando aparecer** (o Semp confere as distribuidoras e avisa no sino) · **deixar sem** (só quando ninguém está esperando; reabre no primeiro "me avise").

## 4. Como a lista se atualiza

- **Sozinha, todo dia:** as vendas abrem vagas e o "Chegou mercadoria" fecha.
- **Por você, com um toque:** "Fechei com…" e "Ninguém tinha".
- **Pelo Semp:** troca a sugestão quando aparece um modelo melhor numa distribuidora, e avisa quando aparece o que ninguém tinha.

## 5. De onde vêm os dados (dono 21/11 13:22–13:25)

Por ordem de peso:
1. **Vendas do próprio app.** É o que funciona agora. Vem em primeiro lugar.
2. **Analisador do site.** Mostra os modelos visitados, os favoritos, as buscas e o que está saindo.
3. **"Me avise quando chegar" (lista de espera).** São clientes que querem comprar e já disseram o quê.
4. **Tendências da internet.** Só completam os outros dados; sozinhas não bastam.

**Regra da estrela:** o que vende muito bem **nunca é trocado**. Só procura um equivalente quando acaba e não dá mais para repor.

## 6. Quando ninguém tem: a lista de espera guia o equivalente

- Cada cliente na espera fica ligado à **foto** e aos traços da peça que pediu: tipo, gênero, material e o formato tirado da foto. Com 5 clientes esperando, a vaga precisa de pelo menos 5 peças.
- Se a peça não volta mais, a vaga passa para **"procurar equivalente"**. O Semp compara com a foto da original e usa as vendas e o Analisador. O Guardião confere o preço.
- Quando o equivalente chega, o "Chegou mercadoria" mostra **"5 clientes esperavam algo assim"** e traz a mensagem pronta no WhatsApp: "Chegou um parecido com o que você queria", com a foto.
- **"Deixar sem"** só aparece quando ninguém está esperando. A vaga reabre no primeiro "me avise".

## 7. O segredo é o fluxo (dono 21/11 13:38, substitui a versão por degraus)

**O que decide se uma peça é boa ou ruim é o fluxo (giro):**
- fluxo **acima da média** é bom;
- fluxo **abaixo da média** é ruim.

O **Guardião aprende a média** com as vendas reais da loja. Não há número fixo.

**A oferta não decide nada.** A sensação de oferta pode ser justamente o que fez a venda disparar. Então o número do degrau **não** é critério. O que vale é:
- o **fluxo** com o preço que a peça teve de verdade;
- a **margem** desse preço, que o Guardião confere com o que ele aprendeu ser sustentável.

Proposta de uma conta só, que junta os dois: **quanto a peça rende por dia na loja** (lucro × fluxo).

| Rende por dia | O que a lista faz |
|---|---|
| **Acima da média** | **Repõe**, mesmo que só venda em oferta. Nesse caso a oferta vira **tática**: o preço "de/por" fica fixo, porque é o que faz a peça sair. |
| **Abaixo da média**, mesmo com oferta | **Troca** pelas maiores tendências do momento, na ordem da seção 5. Mantém o tipo e o equilíbrio de material. |

**"Vendeu rápido"** = no ritmo de uma peça normal do mesmo tipo, ou mais rápido (dono 13:38).

**A lista de compras deve medir procura pelo fluxo, não pelo total vendido.** Hoje ela conta toda venda igual. Isso precisa ser corrigido junto.

## 8. O app aprende sozinho, sem meta digitada (dono 21/11 13:40)

**Como é hoje.** O dono digita uma meta de peças por dia para cada tipo (`S.metaDia`), o volume por mês (`S.volume`) e os dias de loja aberta (`S.diasLoja`). A conta mistura esses números com as vendas reais: começa a pesar o real com 30 dias e só passa a usar o real com 90 dias (`volTipos`, src/53-faixas.js).

**Como fica:** nada digitado, nem na primeira vez nem depois.
- **No começo:** o app usa o que já existe. São as peças de cada tipo da primeira compra, que mostram o que o dono apostou, e o ritmo das vendas desde o primeiro dia.
  - Com poucos dias de dados, a lista compra **pouco**, para não exagerar, e mostra "aprendendo · N dias de vendas".
- **No dia a dia:** a média do fluxo é refeita todo dia com as vendas reais. Ela já leva em conta a estação, como hoje.
- **Dias de loja aberta:** o app aprende pelos dias em que houve venda ou caixa aberto.
- **Sai de Ajustes:** a meta por dia de cada tipo, o volume por mês e os dias de loja.
- **Fica:** a meta de **lucro** do mês (`S.metaUsd`). É o objetivo pessoal do dono, "como um jogo" (dono 13:41). Não entra nas contas de compra.
