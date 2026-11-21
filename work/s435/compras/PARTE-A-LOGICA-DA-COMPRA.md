# Compras · Parte A — a lógica da compra (sem tela)

Esboço ESBOCO/S435 · 21/11/2026. Base: direção aprovada 12:12 (Peças = Inventário · Estúdio · Compras) e decisão do dono 12:51.

## 1. A lista pede VAGAS, não modelos

O mercado de óculos troca de produto o tempo todo. Muitas vezes o mesmo modelo não existe mais para comprar.
Por isso a lista não diz "SP57765 × 3". Ela diz qual **vaga** ficou aberta no estoque:

> Faltam 3 · solar · feminino · metal · custo até US$ 4

A vaga é calculada de novo todo dia a partir das vendas. Ela nunca acumula modelo velho.

## 2. Três tipos de modelo, três jeitos de repor

| O modelo que acabou | O que a lista propõe |
|---|---|
| **Estrela** (vende muito) | 1º o **mesmo** modelo. Se a distribuidora não tiver, um **equivalente** de preço parecido; pode ser um pouco mais caro. O Guardião confere se a margem continua boa. |
| **Normal** | A vaga aberta. Qualquer modelo que sirva para ela. |
| **Fracasso** (não vendeu ou ficou parado) | **Não repõe.** A vaga só reabre se outra coisa da mesma família estiver vendendo, e com alternativas melhores. |

O app já tem os dados para separar os três:
- **Estrela:** curva A da Curva ABC e giro rápido.
- **Fracasso:** parado há 60 dias ou mais, ou "sobrando".
- **Normal:** o resto.

## 3. O caminho de cada vaga

1. **Vaga aberta.** O app calcula a vaga pelas vendas.
2. **Sugestão.** Hoje é você quem escolhe o modelo. Depois, o Semp mostra os modelos das distribuidoras que servem para a vaga, e o Guardião confere o preço.
3. **Pedido.** "Pedir ao fornecedor" manda a mensagem em espanhol, um fornecedor por vez, e a vaga fica como "pedido, esperando chegar".
4. **Resposta da distribuidora:**
   - **Tem:** o pedido segue.
   - **Não tem:** um toque em "Não tinha". A vaga **volta a ficar aberta**, com outra sugestão. Nada acumula.
5. **Chegou.** "Chegou mercadoria" fecha o pedido. A peça vai para o Estúdio e depois para "A completar".

## 4. Perguntas para o dono

1. **O que define uma vaga?** Minha proposta: **tipo** (solar, armação, pré-graduado), **gênero** e **faixa de custo**. Material e formato não entram, para não ficar estreito demais. O pré-graduado continua por grau.
2. **Pedido sem resposta.** Se a distribuidora não responde, depois de quantos dias o pedido volta a ser vaga aberta? Proposta: 7 dias, com aviso no sino.
