# Estudo — preço de atacado pelo Titan (ESBOCO/S435, 22/11/2026)

## O que o dono aprovou (13:16–13:19)
- O preço do atacado mora em **dólar**: custo × (1 + margem da tabela).
- Ele nunca fica abaixo do **chão do atacado**: custo + colchão + contas rateadas **pelo volume**. A peça de atacado carrega menos contas que a do varejo.
- **G$ e R$** são só conversão: seguem a cotação da loja do dia, sempre.
- O US$ muda só em **momentos fixos**: custo novo da peça, ou revisão do Titan ao criar um lote ou 1×/mês. Nunca no meio de um lote.
- Testes de **lote para lote**, com o ok do dono pelo sino.
- **Ponto de partida:** o mercado de CDE e o chão. O dono nunca trabalhou direito com atacado, então não há jeito dele para copiar ainda.
- Os degraus de volume (1K, 2K, 5K, 10K) são aprendidos pelo que faz o lojista subir de tabela.

## O que a pesquisa pública achou (22/11)
- O atacado de óculos em CDE quase **não publica preço**: é tudo por WhatsApp.
- Uma distribuidora de CDE, a Carglasses (Shopping Santo Domingo), diz publicamente que tem armações "a partir de 2 dólares" para mayoristas. Não diz o mínimo nem o preço por material.
- Fora do Paraguai, os mayoristas da Argentina publicam preço por unidade com pedido mínimo, mas em pesos e com outro mercado: não servem de base.

## A conclusão que muda o desenho
O lojista que compra do dono **também pode comprar direto das mesmas distribuidoras** de CDE.
Então o atacado do dono não ganha no preço da peça. Ele ganha em:
- **mínimo pequeno**, porque o lojista compra pouco de cada modelo;
- **mix escolhido**, que é o que vende segundo o Semp;
- **catálogo pronto** com foto e site;
- **atendimento**.

Por isso:
- **Tabelas pequenas** (Óptica, Vendedor, 1K) podem ter margem maior, porque pagam o serviço.
- **Tabelas grandes** (5K, 10K) precisam de margem fina. Quem compra US$ 10.000 tem força para ir direto à distribuidora.
- A **melhor fonte de mercado** são as listas de preço que o dono já recebe das distribuidoras no WhatsApp. Ele compartilha uma lista com o app, o Semp lê, e o Titan sabe o preço que o lojista acharia sozinho.

## O que é um lote (src/97s2-atacado-lotes.js)
- O dono escolhe:
  - as peças, ou um filtro, por exemplo "todos os acetatos";
  - para quais lojistas vai;
  - a moeda que eles veem primeiro;
  - até quando vale.
- O preço fica **congelado em dólar** até a validade.
- As peças novas que entram no filtro aparecem sozinhas.
- O estoque é ao vivo: quem confirma primeiro leva. O site segura a peça por 30 min quando o lojista toca no "+".
- O link só existe depois de salvar. Vencido ou cancelado, o site mostra "Lote finalizado".

## Próximo
Esboço do setor Atacado do Titan com o cálculo:
- a margem de cada tabela sugerida pelo Titan, com o motivo;
- o chão do atacado;
- "Compartilhar uma lista de distribuidora" para o Semp ler.

Antes do esboço, confirmar com o dono a conclusão acima.

## Tabela de estudo (22/11 13:45) — as margens de HOJE com IVA e colchão
Peças com os números do dono: **acetato** custo US$ 5,00 / varejo US$ 20 · **leitura** custo US$ 0,50 / varejo US$ 4.
Conta: preço = custo × (1 + margem) · IVA = preço ÷ 11 (incluído) · colchão 13% do custo · **sobra = preço − IVA − custo − colchão** (antes das contas).

| Tabela | Margem | Acetato: preço | Acetato: sobra | Leitura: preço | Leitura: sobra |
|---|---|---|---|---|---|
| Óptica | 70% | US$ 8,50 | US$ 2,08 (24%) | US$ 0,85 | US$ 0,21 |
| Vendedor | 55% | US$ 7,75 | US$ 1,40 (18%) | US$ 0,78 | US$ 0,14 |
| Atacado 1K | 40% | US$ 7,00 | US$ 0,71 (10%) | US$ 0,70 | US$ 0,07 |
| Atacado 2K | 32% | US$ 6,60 | US$ 0,35 (5%) | US$ 0,66 | US$ 0,03 |
| Atacado 5K | 25% | US$ 6,25 | US$ 0,03 (0,5%) | US$ 0,62 | US$ 0,00 |
| Atacado 10K | 18% | US$ 5,90 | **−US$ 0,29 (prejuízo)** | US$ 0,59 | **−US$ 0,03** |

Achados:
1. Com o IVA e o colchão, o 5K empata e o **10K dá prejuízo**, antes mesmo das contas.
2. A **margem sobre o custo distorce a peça barata**: a leitura que sai a US$ 4 no varejo vai a US$ 0,59–0,85 no atacado (−80% a −85%). O lojista pagaria bem mais.
3. A alternativa natural é o preço do atacado como **fração do preço de varejo**, nunca abaixo do chão. Com 55% / 45% / 35% do varejo:
   - acetato US$ 11 / 9 / 7;
   - leitura US$ 2,20 / 1,80 / 1,40.
   Os números são só para estudo: o Titan aprende a fração.
4. **Falta saber:** quanto as distribuidoras de CDE cobram do lojista por material e por quantidade. São as listas do WhatsApp do dono: compartilhar 1 ou 2 com o app.

## Simulação do lucro total por tabela (22/11 13:58) — margens do 65b v3, só acetato de US$ 5, no pedido mínimo
| Tabela | Pedido | Peças | Custo | IVA | Lucro total |
|---|---|---|---|---|---|
| Óptica (sem mínimo; ex. US$ 500) | US$ 500 | 64 | US$ 320 | US$ 45 | **US$ 125** |
| Vendedor (ex. US$ 500) | US$ 500 | 69 | US$ 344 | US$ 45 | **US$ 100** |
| Atacado 1K | US$ 1.000 | 147 | US$ 737 | US$ 91 | **US$ 150** |
| Atacado 2K | US$ 2.000 | 303 | US$ 1.513 | US$ 182 | **US$ 260** |
| Atacado 5K | US$ 5.000 | 776 | US$ 3.879 | US$ 455 | **US$ 550** |
| Atacado 10K | US$ 10.000 | 1.571 | US$ 7.855 | US$ 909 | **US$ 1.000** |
(O restante de cada pedido é o colchão de 3%, que volta para a próxima compra.)
