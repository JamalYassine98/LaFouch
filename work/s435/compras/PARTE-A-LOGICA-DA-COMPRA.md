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

## 7. Oferta não é fracasso: o que conta é a resposta à oferta (dono 21/11 13:34, corrige a versão anterior)

A oferta pode ser a solução. Exemplo: 100 solares parados entram em oferta e as 100 vendem em pouco tempo. Essa peça **virou estrela**.
O que mostra que uma peça é ruim é **quanta oferta ela precisou** e **quão rápido vendeu com ela**.

O app já tem as ofertas em degraus do preço automático. A conta usa esses mesmos degraus, numa regra só:

| Como reagiu à oferta | O que é | O que a lista faz |
|---|---|---|
| **1º degrau (leve) e vendeu rápido** (no ritmo de uma peça normal do mesmo tipo, ou mais) | **Estrela pela oferta.** O preço da oferta era o preço certo. | Repõe. O Guardião confere se o **preço da oferta** ainda dá margem com o custo da nova compra. Se der, esse vira o preço normal da peça. |
| **2º degrau e vendeu em ritmo médio** | Normal | Repõe só se o custo novo for **menor**, para vender a esse preço com margem. |
| **Precisou do último degrau (oferta potenciada), vendeu devagar e a margem caiu abaixo do mínimo do Guardião** | **Ruim** | Não repõe. A vaga mostra "No lugar de X, que só vendeu com oferta forte · tendências agora", com 2 ou 3 opções e o motivo de cada uma. |

**A venda com oferta forte não conta como procura.** A peça ruim que zerou na liquidação não pode voltar para a lista. Hoje a lista de compras conta toda venda igual; isso precisa ser corrigido junto.

**A troca:** entram as maiores tendências do momento, na ordem da seção 5. Mantém o tipo e o equilíbrio de material.
