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
