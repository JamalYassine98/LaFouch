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

## 7. O fracasso: o que vendeu mal ou só saiu com oferta (dono 21/11 13:29)

**O que conta como fracasso:**
- vendeu mal: parado há 60 dias ou mais, ou "sobrando";
- ou **só saiu com oferta**: a maior parte das vendas foi com desconto do preço automático ou com "Oferta ›".

**A venda com oferta não conta como procura.** Uma peça que acabou numa liquidação não "vendeu bem": a lista não pode pedir para repor só porque ela zerou. Hoje a lista de compras conta toda venda igual. É uma falha que precisa ser corrigida junto.

**O que entra no lugar:** as **maiores tendências do momento**, que o Semp põe em ordem com os pesos da seção 5 (vendas do app, Analisador, lista de espera e, por último, a internet).
- Mantém o **tipo**, para não desequilibrar a vitrine: um solar fracassado dá lugar a um solar em tendência.
- Respeita o **equilíbrio de material**, para a loja não ficar toda de metal, nylon ou acetato.

Na tela, a vaga aparece assim: "No lugar de BR44133, que só saiu com oferta · tendências agora:", seguido das 2 ou 3 melhores, com o motivo de cada uma.
