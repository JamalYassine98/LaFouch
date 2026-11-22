# Estudo — saída da cotação de mercado (ESBOCO/S435, 22/11/2026)

Pedido do dono (22/11 06:58): "remover a cotação de mercado inteira do código; ela é problemática e não serve para a loja".
Base aprovada (07:00): a cotação nos preços = **venda da casa + uma folga de ~2%**, arredondada de 100 em 100 para cima
(ex. do dono: venda G$ 6.550 → G$ 6.700). Os preços ficam parados pela **mola**: mudam só com uma alta forte e duradoura.

## Achado: o mercado já é só a reserva

No app de verdade, quando a casa responde, **tudo já usa a casa**. A casa é a La Moneda, sucursal Jebai
(`fxDaCasa`, src/91-cambio.js:156: "a casa sempre ganha").
O mercado só entra quando **nenhum aparelho conseguiu ler a casa ainda**. É o caso do app novo e do simulador:
é por isso que os esboços mostravam G$ 6.487 como "valor de exemplo".

## O que usa o mercado hoje (e sai)

| Onde | O que faz | Fica assim |
|---|---|---|
| src/91-cambio.js:181 `fetchFx` → open.er-api.com | busca o dólar e o real de mercado quando a casa não respondeu | **Sai.** Sem resposta da casa, vale a **última cotação da casa** com o aviso "cotação de DD/MM · a casa não respondeu" (o aviso de hoje, igual em todo o app). |
| src/91-cambio.js:111 `fxHistReal` → currency-api (fawazahmed0) | baixa 365 dias de fechamento de mercado para os gráficos e o colchão | **Sai.** O histórico passa a ser só da casa (pontos marcados `c=1`, que o app já guarda). |
| src/62-pagamento-misto.js:19–56 `FX_MARGEM`/`FX_TETO`/`fxMargemInfo` | margem de 1–2% sobre o mercado quando não há casa | **Sai.** Fica uma regra só, a da cotação nos preços. |
| src/97-lamoneda.js:206 `lmUsdLoja` | loja = venda + **1%**, de 50 em 50 | Vira a regra aprovada: venda + ~2%, de **100 em 100**. |
| src/96-preco-site.js:6 `SITE_FOLGA` | o site soma **mais 2%** em cima da loja (venda 6.550 → loja 6.650 → site 6.800) | **Sai** (era a segunda folga). Site e loja usam a **mesma** cotação. |
| src/89-notificacoes.js:9–121 | avisos "Margem da loja subiu para X%" pelo `fxMargemInfo` | Saem com ele. O aviso novo é o da mola: "o dólar ficou 7 dias acima: N preços para subir" (Titan, sino). |
| src/40-formatos-venda.js:151 e 91-cambio.js:177 "Valor de exemplo" | número inventado quando não há nada | **Sai.** App novo sem casa: o Câmbio pede para conectar a casa, em vez de inventar. |

**O que fica:** `S.fx` e os 76 usos dele em 38 arquivos. Eles já recebem a cotação da casa, então não mudam.

## Colchão (aprovado 07:00)

Hoje o colchão mede a maior alta do dólar em 90 dias, que é um número de mercado.
**Fica assim:** ele conta só a alta da venda da casa **acima da cotação travada**, mais a alta de custo do fornecedor.
Assim a folga e o colchão não cobrem a mesma coisa duas vezes.

## Tela Câmbio

Muda pouco: os números já são da casa.
- A fonte aparece escrita: "venda La Moneda · Jebai".
- Sai a linha "Preços no site", que vai para Titan › Regras (62).
- Sai a linha "Como o app te protege", que vira o Colchão em Regras (62).
- Some o "valor de exemplo".

## Ordem segura

A implementadora:
1. Grava a última cotação da casa em todos os aparelhos. A `S.fxc` compartilhada já existe.
2. Troca a regra da loja e do site, que é **uma função só**: `cotacaoPrecos()`.
3. Tira o mercado, a margem e a folga do site **no mesmo passo** (regra 12d).
4. Põe a trava no Argus/provas: "nenhuma busca a open.er-api ou à currency-api", "loja = site" e "venda 6.550 → 6.700".

Não testado: a La Moneda de verdade. O simulador não alcança a casa.
