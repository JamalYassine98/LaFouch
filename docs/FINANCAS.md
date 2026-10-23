# Finanças (pacote de outubro)

Módulos novos em `src/`:

- `56-contas.js`: despesas em G$/US$/R$ (valor original em `orig`, convertido ao câmbio de hoje), dia de vencimento, avisos de vencimento, reserva cambial das contas em moeda estrangeira.
- `57-financas.js`: resultado do mês (comparado com mês anterior e mesmo mês do ano anterior, exporta CSV), fluxo de caixa 30/60/90 dias, retirada do dono, conferência do caixa, capital parado e retorno do estoque, alerta de dólar favorável, preço que ficou perigoso.
- `58-pagamento.js`: formas de pagamento (Dinheiro, Pix, Maquininha débito/crédito) e taxa em %, que sai do lucro livre e do caixa.
- `59-seguranca.js`: PIN, biometria (plugin `@aparajita/capacitor-biometric-auth`, só no APK), cópias automáticas diárias em IndexedDB, lembrete de backup, partes novas da aba Ajustes.
- `98-financeiro.js`: ações (`ACT.*`) e eventos dessas telas.

Não testado em aparelho real: biometria, compartilhar o backup/CSV pelo Android. As taxas padrão da maquininha (2% débito, 4% crédito) são valores provisórios: ajuste em Ajustes.
