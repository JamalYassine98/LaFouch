# Estudo — pagamento próprio por pedido (upay / Pagopar) · NUVEM · 24/11/2026

Pedido do dono (24/11 09:14–09:16): "segurança máxima para meus clientes" no pagamento; recusou
(a) valor + nome (marido/mãe ficam na mão) e (b) "quem vai pagar" + nuvem que aprende (ainda inseguro).
Disse "Sim" para estudar a upay a fundo. Nada implementado; é estudo.

## 1. O problema de hoje (functions/pix.js)
- O robô lê o e-mail do banco e acha o pedido pelo VALOR exato (48 h, não pago, feito antes do pagamento).
- Um só candidato = confirma sem olhar quem pagou. Um estranho com o mesmo valor confirma o pedido de outra cliente;
  se ele contestar no banco (o Pix permite), a peça já saiu. Com guaranis redondos, valores iguais ficam comuns.
- Qualquer regra de valor/nome sempre tem um buraco: o pagamento não carrega a identidade do pedido.

## 2. A solução: cada pedido tem o seu próprio pagamento
- A nuvem cria uma cobrança na upay para o pedido (preço exato do catálogo, prazo = o da reserva).
- A cliente (ou marido, mãe, qualquer um) paga por Pix, QR paraguaio, cartão ou transferência na página da upay.
- A upay avisa a nuvem com assinatura: a nuvem confere a assinatura e só então marca pago. Sem e-mail, sem valor, sem nome.
- Estranho nunca confirma pedido: ele não tem o QR daquele pedido. Pagamento revertido também chega como aviso.

## 3. O que a upay oferece (fontes públicas, a confirmar com eles)
- Meios no checkout (lista do WS): PIX (25), Pago QR (24), cartões (9), Transferência (11), Zimple, Tigo Money,
  Billetera Personal, Wally, Aqui Pago, Pago Express, Infonet… (doc. de integração Pagopar).
- Tarifas publicadas (8/10/2026, yo-facturo.com): débito 2 %, crédito 3 %, QR ueno/outros 2 %, QR Pix ou Argentina 2,9 %;
  "não incluem retenções/impostos". Transferência: sem tarifa publicada.
- Regulação BCP (2026): teto de 1,5 % para pagamento iniciado por QR/transferência conta a conta (pode baixar o QR local).
- Acreditação: na conta bancária ou na Pagopar Card (depende do plano). Prazo não publicado.

## 4. Como a nuvem faria (por dentro, regra 12: NOVO, um lugar só)
1. Segredo `UPAY_PRIVADA` no Secret Manager (nunca no projeto, regra 22); chave pública pode ficar no código.
2. Ação nova na porta `reserva` (ou função `pagamento`): cria o pedido na upay —
   `token = sha1(privada + id_pedido + monto)`, `id_pedido_comercio` = id do pedido, `monto_total` = o valor JÁ
   CONFERIDO pelo servidor (ficha pixEspera), `fecha_maxima_pago` = fim da reserva. Guarda o `hash` em pixEspera/<pedido>.
   Responde ao site só o endereço `https://www.pagopar.com/pagos/<hash>` (com `?forma_pago=25` para Pix).
3. Função nova `upayAviso` (o endereço de resposta cadastrado na upay): confere `sha1(privada + hash) == token`;
   acha o pedido pelo hash guardado; `pagado: true` → o MESMO caminho de hoje (`confirmaPedido`); revertido →
   aviso urgente (`avisaUrgente`) + linha no TITAN. Responde 200 (a upay repete a cada 10 min sem 200).
4. Conferência dupla: antes de marcar pago, a nuvem pergunta à upay (`/api/pedidos/1.1/traer`) se está pago mesmo.
5. O robô do e-mail e a busca por valor SAEM para o site (apagar no mesmo passo); ficam só para a venda da loja
   (app, 2 h, o dono presente) até decidir.
6. Provas no Argus/testes: assinatura errada recusada; aviso repetido não paga duas vezes; valor diferente do conferido
   recusado; revertido avisa; hash de outro pedido não confirma.

## 5. Perguntas para a upay (o dono pergunta no comercial; a NUVEM prepara a mensagem em espanhol se ele quiser)
1. Requisitos para abrir a conta comercial (RUC? conta bancária? em nome de quem?).
2. Pix: a cliente brasileira vê o valor em reais por qual cotação? (o site mostra reais pela cotação da casa de câmbio,
   regra do dono: venda da casa, preços estáveis) — se a upay converter por outra taxa, o valor em reais muda.
3. Tarifas atuais por meio (Pix 2,9 %? QR 2 % ou 1,5 %?) com IVA incluído ou não; custo fixo/mensal?
4. Prazo e forma de acreditação (conta do banco Familiar?).
5. Pagamento revertido/contestado: quem assume, como avisam.
6. Ambiente de teste (Desenvolvimento) para provar antes de ligar.

## 6. Custo × hoje
- Hoje: grátis (Pix no Nubank, transferência no Familiar), mas com o risco do item 1.
- Com upay: a tarifa de cada venda (ex.: Pix 2,9 % → G$ 150.000 paga ~G$ 4.350). Exceção à regra de sem gastos:
  só com a autorização do dono (CLAUDE.md 23).

## 7. Telas (não é da NUVEM)
- Site: "Pagar" leva à página da upay (ou QR na própria página, se a upay aprovar a ida direta) e volta com o resultado.
  Esboço = ESBOCO/SITE, depois do "sim" do dono e das respostas da upay.
- App: o TITAN deixa de ter "PIX sem par" do site (só da loja); pagamento revertido vira linha nova.

## 8. ATUALIZAÇÃO 24/11 09:27 — upay DESCARTADA
- O cadastro online da upay/Pagopar só leva ao formulário de contato ou ao login com conta do ueno bank, e eles não respondem.
- A Pagopar passou a ser a upay, a solução de cobros do ueno bank. O Banco Central do Paraguai interveio no ueno bank em 3/11/2026
  (insolvência; clientes sem acesso às contas; Grupo M/Pagopar citado nos pedidos de informe do Senado).
- Conclusão da NUVEM: não pôr o dinheiro das vendas numa plataforma ligada a um banco em resolução. A ideia (cobrança própria
  por pedido + aviso assinado) continua valendo; muda o fornecedor.
- Plano B: Bancard (aceita Pix de brasileiros e QR local; pede comércio aderido e, para Pix, conta em dólares, segundo notícia de 2024),
  pelo gerente do Banco Familiar. Conferir se a Bancard dá o aviso de pagamento assinado ao servidor.
