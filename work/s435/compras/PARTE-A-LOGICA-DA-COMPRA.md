# Compras · Parte A — a lógica da compra (sem tela)

Esboço ESBOCO/S435 · 21/11/2026. Base: direção aprovada 12:12 (Peças = Inventário · Estúdio · Compras) e decisão do dono 12:51.

## 1. A lista pede VAGAS, não modelos

O mercado de óculos troca de produto o tempo todo. Muitas vezes o mesmo modelo não existe mais para comprar.
Por isso a lista não diz "SP57765 × 3". Ela diz qual **vaga** ficou aberta no estoque:

> Faltam 3 · solar · feminino · metal · custo até US$ 4

**O que define a vaga (dono 21/11 12:58):** tipo · gênero · faixa de custo · **material**. O material mantém o equilíbrio: a loja não pode ter tudo de metal, tudo de nylon ou tudo de acetato. O **formato** também conta, mas é lido **na foto** da peça (Estúdio), nunca na descrição.

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
3. **Procurando.** "Pedir ao fornecedor" manda a mensagem em espanhol. Você manda a mesma vaga para **várias distribuidoras**, até uma atender. A vaga fica "procurando · mandada a 3". Não tem prazo: ela não volta sozinha (dono 12:58).
4. **Fechado.** Quando uma distribuidora atende, um toque em **"Fechei com…"** diz com quem, qual modelo, quantas peças e por quanto. A vaga diminui na hora. Se ainda faltar, o resto continua procurando. As outras distribuidoras ficam como "não precisa mais".
5. **Chegou.** "Chegou mercadoria" puxa o que foi fechado e confere o que chegou e o que faltou. A peça vai para o Estúdio e depois para "A completar".

## 4. Para elaborar juntos: como a lista se atualiza

Proposta para começar a conversa:
- **Sozinha, todo dia:** as vendas abrem vagas, e o que chega pelo "Chegou mercadoria" fecha vagas.
- **Por você, com um toque:** "Fechei com…" (a compra combinada) e "Ninguém tinha" (a vaga sai da lista por um tempo, ou muda a faixa de custo).
- **Pelo Semp, depois:** troca o modelo sugerido quando aparece um melhor numa distribuidora.
