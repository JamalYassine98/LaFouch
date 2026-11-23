# Varredura de luxo · parte 2 · TEXTOS EXPLICATIVOS (S435, 23/11/2026)

**Total: 90 textos · EXPLICA 65 · VAZIO 17 · AVISO 8**

Levantados no código: todo texto fixo em `.hint` com frase (30+ letras). Categoria pela regra proposta no esboço 83:
- **EXPLICA** → sai da tela (o "como funciona" mora no "?" do setor, quando precisar); se a linha precisar de contexto, fica um subtítulo de até 6 palavras.
- **VAZIO** → fica, no padrão da tela vazia (lfVazioHtml: ícone + frase + explicação curta).
- **AVISO** → fica, como aviso padrão (uma cor por tipo, regra 17), curto.

| Cat. | Texto | Onde |
|---|---|---|
| EXPLICA | Cada faixa é avaliada separada, pelo giro, estoque e contas. Você decide. | 54-analises.js:328 |
| EXPLICA | Ordenado pelo lucro que o produto dá. Dias de estoque pelo ritmo de venda, corrigido pela estação. | 54-analises.js:360 |
| VAZIO | Sem venda há 60 dias ou mais (fora da baixa estação). Preço de saída = reposição + contas, sem prejuízo e sem meta de lucro. | 54-analises.js:385 |
| AVISO | Com o câmbio e as contas de hoje, o preço de tabela destes produtos não cobre o piso da faixa. | 54-analises.js:405 |
| EXPLICA | Diferenças achadas nas contagens, em custo. | 54-analises.js:446 |
| EXPLICA | A: produtos que dão 80% do lucro · B: próximos 15% · C: o resto. | 54-analises.js:465 |
| EXPLICA | Se o ritmo de vendas dos últimos | 57-financas.js:351 |
| EXPLICA | Dinheiro que você tira da loja para você. Sai do caixa na moeda escolhida. | 57-financas.js:432 |
| EXPLICA | Conte o dinheiro que você tem e compare com o que o app calcula. | 57-financas.js:463 |
| EXPLICA | Quanto do que você investiu está parado e quanto o estoque rende. | 57-financas.js:539 |
| EXPLICA | Cada conta na sua moeda; o dólar vai para a mercadoria e o colchão sai de cada moeda na proporção do que sobrou. Câmbio de hoje. | 57-separacao.js:281 |
| EXPLICA | Reserva contra a alta do dólar. Em dólar ele não perde valor. | 57-separacao.js:341 |
| EXPLICA | Cada venda nova separa um colchão novo. Quando o dólar estiver barato, o app avisa para trocar. | 57-separacao.js:350 |
| EXPLICA | Os dados ficam só neste celular. Guarde uma cópia de vez em quando (e antes de trocar de aparelho). | 59-seguranca.js:176 |
| AVISO | A taxa (%) sai do seu lucro quando a venda é paga por essa forma. Dinheiro e Pix ficam em 0%. Confira as taxas da sua maquininha. | 59-seguranca.js:295 |
| EXPLICA | Abrir o app com digital ou rosto. O PIN de emergência abre o app se a biometria falhar. | 59-seguranca.js:324 |
| EXPLICA | Define o que o app faz quando você marca um pedido do site como entregue. | 59-seguranca.js:339 |
| VAZIO | Nada parecido no estoque. Tente outra foto, com a armação inteira e fundo liso. | 87-camera-gaveta.js:75 |
| VAZIO | Nenhum aviso ainda. Quando a margem ou o dólar mudarem, o registro aparece aqui. | 89-notificacoes.js:165 |
| EXPLICA | Mostrando as 20 mais recentes de | 90-navegacao-dashboard.js:195 |
| EXPLICA | Soma de todas as vendas do período, na ordem em que o dinheiro deve ser separado. | 90-navegacao-dashboard.js:214 |
| EXPLICA | Preço atual contra a trava: reposição de hoje mais a parte das contas de cada peça. | 90-navegacao-dashboard.js:292 |
| EXPLICA | Valores sugeridos. Troque o que fizer sentido e digite o que entregou e o que recebeu: o app calcula a cotação. | 91-cambio.js:27 |
| VAZIO | Nada para trocar agora com o dinheiro em caixa. | 91-cambio.js:41 |
| EXPLICA | A provisão começa do zero todo mês. Os imprevistos de meses anteriores ficam guardados no Histórico. | 92-despesas.js:205 |
| VAZIO | Sem cotação guardada neste dia. Mostrando a última anterior ( | 93-historico.js:290 |
| VAZIO | Sem cotação guardada até esta data. | 93-historico.js:293 |
| EXPLICA | As contas do mês entram divididas por 30. Os gastos extras entram no dia em que foram feitos. | 93-historico.js:322 |
| VAZIO | Nenhum gasto extra ou mudança de despesa registrado neste dia. | 93-historico.js:358 |
| EXPLICA | Cada vez que você toca em Pagar na aba Despesas, o valor sai dos guaranis em caixa e da reserva de contas. | 95-caixa.js:203 |
| VAZIO | Nenhuma conta paga neste mês ainda. | 95-caixa.js:223 |
| EXPLICA | As contas do mês são divididas pelo custo: peça mais cara carrega mais. | 96-ajustes.js:98 |
| EXPLICA | Peças por mês para dividir as contas: | 96-ajustes.js:111 |
| EXPLICA | Quanto tempo no site? Termina sozinho no prazo ou quando vender 3. | 96-ajustes.js:362 |
| EXPLICA | Só muda quando a cotação da loja passar a do site. Se o dólar cair muito (5% por 3 dias), o app faz ofertas em poucas peças, começando pelas mais para | 96-preco-site.js:52 |
| AVISO | Cada tabela é custo da peça + margem. Nunca fica abaixo do piso da loja nem acima do preço Público. | 96-tabelas-preco.js:86 |
| EXPLICA | Mais de 12 meses. Resumo por mês; a venda completa está guardada e pode voltar. | 97-arquivo-vendas.js:131 |
| EXPLICA | Leva uns 3 segundos. Suas vendas e seus dados continuam salvos. | 97-atualiza.js:78 |
| EXPLICA | O app procura sozinho (ao abrir e a cada poucas horas) e avisa quando a nova está pronta. Nada muda enquanto você vende. | 97-atualiza.js:139 |
| EXPLICA | Ninguém acerta sempre. O app olha o histórico da casa, a semana e a tendência. | 97-cambio-aba.js:278 |
| VAZIO | Ainda sem histórico suficiente para o gráfico. | 97-cambio-aba.js:318 |
| EXPLICA | Previsão: ainda sem histórico suficiente. | 97-cambio-aba.js:373 |
| EXPLICA | Ninguém acerta sempre. É uma estimativa pelo histórico da casa. | 97-cambio-aba.js:381 |
| EXPLICA | Seus preços usam a cotação da loja: se a casa subir até 1%, você não perde. | 97-cambio-aba.js:399 |
| VAZIO | Sem internet: entregue o cartão quando a internet voltar (Clientes › Cartões). | 97-cupons.js:158 |
| EXPLICA | Abre o WhatsApp normal com a mensagem e o link do cartão ( | 97-cupons.js:173 |
| VAZIO | Sem internet: números da última vez. | 97-cupons.js:228 |
| EXPLICA | Lucro das vendas com código − desconto = lucro líquido ( | 97-cupons.js:462 |
| VAZIO | Nenhum modelo com esse código ou nome. | 97-estudio.js:1670 |
| EXPLICA | Deslize para cima para ver a vitrine | 97-folha.js:30 |
| EXPLICA | Só o fundo vira branco (255); a armação não é alterada. Peça no centro, formato 3:2, sem esticar. As fotos novas saem do Estúdio. | 97-fotos-padrao.js:433 |
| AVISO | Confira se ela está ligada, no mesmo Wi-Fi do celular ou com o Bluetooth ligado. | 97-impressora.js:70 |
| EXPLICA | Para as listas de transmissão do WhatsApp Business: copie os números e cole na lista. | 97-marketing.js:649 |
| EXPLICA | Poste pelo app: em 2 dias começo a medir vendas e pedidos do site das peças de cada post. | 97-marketing.js:654 |
| EXPLICA | Perdeu o celular ou foi roubado? Desconecte aqui. O aparelho desconectado apaga os dados dele ao abrir com internet; a nuvem e o site não perdem nada. | 97-nuvem-segura.js:324 |
| EXPLICA | Troca a senha da nuvem: todo aparelho perde o acesso na hora (inclusive o roubado). Depois, entre de novo só nos seus aparelhos com a senha nova. | 97-nuvem-segura.js:338 |
| AVISO | Entre de novo em Ajustes → Nuvem (a senha é necessária só desta vez). | 97-nuvem.js:53 |
| EXPLICA | O painel do site entra sozinho, com a mesma conta | 97-nuvem.js:128 |
| EXPLICA | Cópia de segurança automática (até 1 h depois de qualquer mudança; guarda a última de cada dia, as últimas | 97-nuvem.js:522 |
| EXPLICA | A meta aparece sozinha com 14 dias de vendas (média dos últimos meses + época do ano + estoque). | 97-objetivos.js:179 |
| AVISO | Meta batida! O que passar dela, metade vai para os Objetivos: | 97-objetivos.js:188 |
| EXPLICA | Passou da meta → metade vai para os Objetivos da loja | 97-objetivos.js:195 |
| EXPLICA | Diga o que quer para a loja (reforma, vitrine, ar-condicionado…). Cada venda guarda um pouco e metade do que passar da meta vai para cá. | 97-objetivos.js:204 |
| EXPLICA | Na loja o preço já está no piso. No site, o desconto vai até 50%. | 97-ofertas-site.js:170 |
| EXPLICA | Transferência (Banco Familiar): por enquanto com comprovante (o app lê o valor). | 97-pagamento-auto.js:114 |
| EXPLICA | Com os seus dados de hoje, o app faria: | 97-preco-auto.js:252 |
| EXPLICA | Rosa = silencioso. Fora dessa faixa o app avisa normalmente. | 97-push.js:242 |
| EXPLICA | Vendas feitas sem internet que o estoque não confirmou. | 97-sync.js:73 |
| EXPLICA | Ambiente de teste. Os aparelhos trocam estoque, caixa e vendas. Comece pelo aparelho principal (o que tem os dados certos); depois entre com os outros | 97-sync.js:508 |
| EXPLICA | Sincronizando estoque, vendas e clientes… | 97-sync2.js:170 |
| EXPLICA | Cada foto some sozinha depois de | 97-sync2.js:754 |
| EXPLICA | Automático segue o aparelho. Vale só neste aparelho. | 97-tema.js:88 |
| EXPLICA | Para sugerir o que entra e o que sai, preciso saber o tamanho da vitrine. | 97-vitrine.js:135 |
| EXPLICA | Quantos lugares (peças) cabem na vitrine? | 97-vitrine.js:136 |
| VAZIO | Nenhuma peça entra no desconto pela regra de hoje | 97r-temas-s183.js:107 |
| EXPLICA | Novidades e as 3 mais vendidas ficam sem desconto. O cupom do evento não soma. | 97r-temas-s183.js:108 |
| VAZIO | Nenhum lote ainda. Um lote é um catálogo preparado: você escolhe as peças (ou | 97s2-atacado-lotes.js:49 |
| VAZIO | Nenhuma conta ativa. Crie em Clientes › Conta Atacadista. | 97s2-atacado-lotes.js:68 |
| EXPLICA | Cada cor tem a sua foto. É ela que aparece quando o cliente escolhe a cor no site e no WhatsApp. | 97t-ficha-s190.js:97 |
| EXPLICA | Toque em Atacado para tirar ou pôr esta peça na lista do lojista. | 97t-ficha-s190.js:102 |
| EXPLICA | Não cita cor: a cor aparece à parte, a que o cliente escolher. | 97t-ficha-s190.js:107 |
| VAZIO | Ainda sem vistas (precisa da nuvem ligada). | 97u-navegacao-s184.js:185 |
| EXPLICA | Preço que o cliente vê no site (vazio = pago na entrega). Desligue a que não está atendendo. | 97x-fretes.js:9 |
| EXPLICA | O frete das compras já está dentro do custo de cada peça. | 97y-lucro-real.js:73 |
| VAZIO | Nenhum pedido do site esperando pagamento agora. | 97z-pix-email.js:134 |
| EXPLICA | Só conta: nada muda até você aceitar uma decisão. | 97z2-contador.js:158 |
| EXPLICA | Hoje ainda aberto. Fecha sozinho depois das 17h, ou feche agora se a loja fechou mais cedo. | 98-fechamento.js:52 |
| AVISO | Falta conferir o caixa do fechamento de | 98-fechamento.js:56 |
| EXPLICA | Toque em quantos graus quiser. Os que têm número já existem nesta cor. | 98-graus-cor.js:186 |
| AVISO | Entre na nuvem (Ajustes › Cópias e nuvem) e conecte à internet para ver os cartões. | 98z-s374.js:237 |
