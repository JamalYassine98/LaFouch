# Sincronização entre aparelhos + reserva de estoque — ANÁLISE (02/11/2026)

STATUS: só análise e protótipo isolado. NADA implementado no app nem no site. Só implementar quando o dono disser "pode implementar".
Decisões do dono: sincronização real entre celular, PC e tablets; app de funcionário/permissões fica para depois; reserva de peça no site por 10 minutos; site em tempo real ("Última unidade"/"Esgotado"); aviso a quem chega tarde + "Avise-me quando chegar".

## 1. Como é hoje (levantado no código)
- Todo o estado do app é um objeto `S` salvo em localStorage (lista PERSIST, ~110 chaves: items, sales, cash, exp, pedidos, clientes...). Cada aparelho tem o seu. Nuvem = só cópia manual.
- Estoque: `qty` é alterado em ~26 arquivos (~90 pontos: venda, entrada, ajuste, descarte, lote, contagem, carrinho, leitor, nota de compra...). É o ponto mais delicado.
- Venda: id `V-0001` vem de `S.saleSeq` local → dois aparelhos gerariam o mesmo id.
- Pedidos do site: `pedSync` busca `pedidos` a cada 2 min e APAGA o documento depois de importar → com dois aparelhos, só um recebe o pedido.
- Site: lê `produtos/<ref>` (campos `qs` = estoque por cor, `aviso`, `est`...) publicados pelo app. O site não faz conta de estoque; o app só baixa o estoque quando o dono importa/entrega.
- Dado grande: `src/98-zinicial.js` (dados iniciais) tem ~745 KB; fotos em `S.fotos` (base64) pesam muito para sincronizar.

## 2. Riscos principais (e como o desenho trata)
1. **Vender mais do que existe (site).** Hoje possível. → Reserva atômica na nuvem (seção 3). Provado na simulação (10 clientes × 5 peças → exatamente 5; 20 rodadas).
2. **Site e balcão disputando a última peça.** → Mesma conta de "disponível" para os dois. Simulado (30 rodadas, nunca os dois).
3. **Dois aparelhos offline vendendo a mesma peça.** Não há como impedir sem internet. → Movimentos somam (nunca sobrescrevem); o estoque pode ficar -1; o app mostra "conflito de estoque, confira a peça". Nunca some venda.
4. **Cliente mexe no relógio / relógio do celular errado.** → Prazo de 10 min sempre pelo horário do SERVIDOR.
5. **Clique duplo / internet ruim.** → Reserva idempotente por id do pedido (simulado).
6. **Site é público (sem login).** Regras do Firestore não permitem transação segura aberta. → A reserva tem de passar por uma Cloud Function (já temos plano Blaze e função publicada); o site chama a função, não grava no estoque diretamente.
7. **Pagou depois dos 10 min e a peça foi para outro.** → Recusa clara; dono decide (devolver ou conseguir outra). Simulado. Mitigação: botão "Confirmar pagamento" no app avisa se a reserva expirou; considerar pedir ao cliente que mande o comprovante dentro do prazo.
8. **Migração dos dados atuais** (milhares de vendas). → Cópia de segurança antes, importação por etapas, conferência de totais (estoque, caixa, vendas) antes/depois.
9. **Custo Firestore.** Leituras em tempo real por aparelho. Estimativa: loja pequena fica no gratuito/centavos; medir na etapa 1.
10. **Fotos.** Sincronizar à parte (Storage ou documento por foto), sob demanda.

## 3. Desenho proposto
**Estoque da vitrine (site):** documento `estoque/<ref|cor>` = `{ total, res: { <pedido>: { q, exp, pago } } }`. Disponível = total − reservas válidas (pagas ou dentro do prazo). Expiração "preguiçosa" (calculada na leitura) → não precisa de relógio agendado; opcionalmente uma limpeza periódica.
**Funções (Cloud Functions):** `reservar(pedido, itens)` (tudo ou nada), `confirmarPagamento`, `cancelar`, `entregar`, `balcao(venda)`. Site e app só chamam funções.
**App:** cada alteração vira **movimento** com id único `<aparelho>-<contador>` e carimbo de tempo; estoque = base + soma dos movimentos. Fila local de envio (funciona offline); mesclagem idempotente e independente de ordem (simulado).
**Pedidos:** todos os aparelhos veem o pedido; "assumir" por transação (quem pegar primeiro). Para de apagar na importação (passa a marcar).
**Indicador no app:** "Sincronizado / Enviando / Sem internet (N pendentes) / Conflito".
**Site em tempo real:** `Última unidade`, `Esgotado`, contagem regressiva de 10 min na tela de pagamento, mensagem "acabou de esgotar" + "Avise-me quando chegar".

## 4. Etapas sugeridas (cada uma só com ordem do dono)
0. Cópia de segurança + medir tamanho e custo (leitura).
1. Estoque da vitrine na nuvem + reserva (site) — corrige a venda além do estoque, mesmo sem sincronizar o resto.
2. Movimentos de estoque e vendas com id por aparelho (celular + PC iguais).
3. Pedidos "assumidos por".
4. Caixa, câmbio, contas, clientes.
5. Migração dos dados atuais.
6. Tablets/outros PCs.
(Funcionário e permissões: depois.)

## 5. O que o protótipo prova e o que NÃO prova
Arquivo: `prototipos/sincronizacao/simulacao.js` (`node simulacao.js`) — 17 testes, passam. Usa um "Firestore de mentira" com transações otimistas (versões + nova tentativa), como o real.
Prova: lógica de reserva, prazo, idempotência, tudo-ou-nada, disputa site×balcão, mesclagem em qualquer ordem, ids únicos.
NÃO prova (precisa testar na etapa 1, com o Firestore real): latência, limites de transação (contenção em produto muito disputado: ~1 gravação/s por documento), regras de segurança, comportamento offline do app, custo.
Ponto de atenção: em produto MUITO disputado (muitos clientes na mesma peça no mesmo segundo) o Firestore limita ~1 gravação por segundo por documento; para uma óptica é folgado, mas vale testar com carga na etapa 1.

## 6. Perguntas em aberto para o dono
- Peça reservada: o balcão pode "forçar" a venda (avisando)? Sugestão: não, só com aviso e confirmação.
- Quando passa dos 10 min e o cliente envia o comprovante mesmo assim: devolver ou tentar nova reserva? Sugestão: o app avisa e o dono decide.
- Aviso "Avise-me quando chegar": por WhatsApp (manual) ou automático? (hoje é manual)
- Quantos aparelhos no começo (celular + PC + 1 tablet?).
