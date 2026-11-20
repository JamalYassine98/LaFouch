// Travas do robô do Gmail (work/pix/robo-pix.gs, 20/11/2026 — varredura do pagamento, parte 2).
// O robô roda no Google Apps Script; aqui as regras puras dele (autentico, leAviso) rodam no node, inclusive as TENTATIVAS DE BURLAR.
'use strict';
const fs = require('fs'), vm = require('vm');
const ctx = {};
vm.runInNewContext(fs.readFileSync(__dirname + '/../work/pix/robo-pix.gs', 'utf8'), ctx);
let ok = 0; const falhas = [];
const t = (n, c) => { if (c) { ok++; console.log('  ok  ' + n); } else { falhas.push(n); console.log('  FALHA  ' + n); } };
const cab = (...l) => l.join('\r\n') + '\r\n\r\ncorpo';
const GMAIL = (x) => 'Authentication-Results: mx.google.com;\r\n       ' + x;

t('Nubank direto: DKIM aprovado pelo Gmail vale', ctx.autentico(cab('Delivered-To: loja@exemplo.com', GMAIL('dkim=pass header.i=@nubank.com.br header.s=s1; spf=pass'), 'From: Nubank <todomundo@nubank.com.br>'), 'nubank.com.br'));
t('Banco Familiar: DMARC aprovado pelo Gmail vale', ctx.autentico(cab(GMAIL('dkim=neutral; dmarc=pass (p=NONE) header.from=familiar.com.py')), 'familiar.com.py'));
t('Nubank encaminhado pelo filtro: vale pela cadeia de reenvio aprovada (arc=pass + DKIM do banco no 1º passo)', ctx.autentico(cab(
  'ARC-Authentication-Results: i=1; mx.google.com; dkim=pass header.i=@nubank.com.br; spf=pass',
  GMAIL('arc=pass (i=1 spf=pass dkim=pass dkdomain=nubank.com.br); spf=pass smtp.mailfrom=pessoa@gmail.com')), 'nubank.com.br'));
t('BURLA: linha falsa "dkim=pass nubank" escrita pelo remetente, abaixo da linha do Gmail que reprova → recusado', !ctx.autentico(cab(
  GMAIL('dkim=fail header.i=@falso.exemplo; dmarc=fail header.from=nubank.com.br'),
  'Authentication-Results: mx.google.com; dkim=pass header.i=@nubank.com.br'), 'nubank.com.br'));
t('BURLA: linha falsa no topo que não é do Gmail → recusado', !ctx.autentico(cab('Authentication-Results: mx.falso.exemplo; dkim=pass header.i=@nubank.com.br', GMAIL('dkim=fail')), 'nubank.com.br'));
t('BURLA: cadeia de reenvio falsa (o Gmail diz arc=fail) → recusado', !ctx.autentico(cab(
  'ARC-Authentication-Results: i=1; mx.google.com; dkim=pass header.i=@nubank.com.br',
  GMAIL('arc=fail (signature failed); spf=pass')), 'nubank.com.br'));
t('BURLA: domínio parecido (nubank.com.br.falso.exemplo) → recusado', !ctx.autentico(cab(GMAIL('dkim=pass header.i=@nubank.com.br.falso.exemplo')), 'nubank.com.br'));
t('subdomínio do banco vale (mail.nubank.com.br)', ctx.autentico(cab(GMAIL('dkim=pass header.d=mail.nubank.com.br')), 'nubank.com.br'));
t('sem a linha do Gmail → recusado', !ctx.autentico(cab('From: todomundo@nubank.com.br'), 'nubank.com.br'));

const AG = Date.UTC(2026, 10, 20, 15, 0);
const nu = ctx.leAviso(ctx.BANCOS.nubank, 'Você recebeu uma transferência\nVocê recebeu uma transferência de R$ 89,93 de MARIA JOSE BENITEZ em 20/11/2026 11:58.', AG);
t('Nubank: lê valor, pagador e hora', nu && nu.valor === '89,93' && nu.nome === 'MARIA JOSE BENITEZ' && nu.hora === Date.UTC(2026, 10, 20, 14, 58));
const fa = ctx.leAviso(ctx.BANCOS.familiar, 'TRANSFERENCIA DE OTRAS ENTIDADES RECIBIDA\nOrdenante: CARLOS DUARTE\nMoneda y Monto: PYG 200.000', AG);
t('Banco Familiar: lê valor e pagador; sem data no texto vale a hora em que chegou', fa && fa.valor === '200.000' && fa.nome === 'CARLOS DUARTE' && fa.hora === AG);
t('aviso que não é de transferência RECEBIDA é ignorado', ctx.leAviso(ctx.BANCOS.familiar, 'TRANSFERENCIA ENVIADA\nMoneda y Monto: PYG 200.000', AG) === null);
console.log(falhas.length ? `robô: ${falhas.length} falha(s)` : `robô: ${ok} testes ok`);
process.exit(falhas.length ? 1 : 0);
