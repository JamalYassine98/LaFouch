// node teste-pedidomail.js
const assert = require('assert');
const M = require('./pedidomail');
let n = 0; const ok = (c, t) => { assert.ok(c, t); n++; console.log('  ok ', t); };
const mem = () => { const m = {}; return { m, get: async (k) => m[k] || null, salva: async (k, o) => { m[k] = Object.assign({}, o); }, muda: async (k, c) => { Object.assign(m[k], c); }, apaga: async (k) => { delete m[k]; }, pegaPago: async (k) => { const o = m[k]; if (!o || o.pago) return null; o.pago = true; return Object.assign({}, o); } }; };
const PED = { ts: Date.UTC(2026, 10, 16, 15), nome: 'Maria <b>Souza</b>', tel: '0981', email: 'Maria@Exemplo.com', cod: '7k2m', lang: 'pt', pag: 'pix', brl: 234.5, total: 330000, ent: 'delivery', obsC: 'Transportadora: PedidosYa · frete na entrega', teste: false,
  itens: [{ ref: 'GR3340', nome: 'Armação acetato preta', q: 1, cor: 'Preta', grau: '+2.00', preco: 95000, pv: 'R$ 95' }, { ref: 'SO1', nome: 'Solar quadrado', q: 2, cor: '', grau: '', preco: 140000, pv: '<b>R$ 280' }] };
(async () => {
  const T = Date.UTC(2026, 10, 16, 15, 1);
  ok(M.copia({ tipo: 'comp', email: 'a@b.com' }, T) === null && M.copia(Object.assign({}, PED, { teste: true }), T) === null && M.copia(Object.assign({}, PED, { email: '' }), T) === null && M.copia(Object.assign({}, PED, { email: 'sem-arroba' }), T) === null, 'comprovante, teste, sem e-mail e e-mail torto não recebem nada');
  let db = mem(), env = []; const envia = async (m) => { env.push(m); };
  let r = await M.aoCriar(db, envia, 'P1', PED, true, 'https://wa.me/595', T);
  ok(r.enviou && env.length === 1 && env[0].to === 'maria@exemplo.com' && env[0].subject === 'Recebemos seu pedido 7K2M', 'pedido novo: 1 e-mail, assunto com o código');
  ok(/Olá, Maria\./.test(env[0].html) && !/<b>Souza/.test(env[0].html) && /30 minutos/.test(env[0].html) && /R\$ 234,50/.test(env[0].html) && /Entrega · PedidosYa/.test(env[0].html) && /Na entrega/.test(env[0].html) && />R\$ 95</.test(env[0].html) && /· 1 un\./.test(env[0].html) && !/<b>R\$ 280/.test(env[0].html) && /2 un\./.test(env[0].html) && /\+2\.00/.test(env[0].html), 'recebido: nome sem HTML do cliente, reserva, total, entrega com transportadora, preço da linha como o site mandou (preço torto vira quantidade) e grau');
  ok(db.m.P1.rec === true && db.m.P1.tel === undefined && db.m.P1.itens[0].ref === undefined, 'a cópia guardada não leva telefone nem dados a mais');
  r = await M.aoCriar(db, envia, 'P1', PED, true, '', T); ok(r.ja && env.length === 1, 'o mesmo pedido não manda o "recebemos" duas vezes');
  r = await M.aoPagar(db, envia, 'P1', 'a3f91c07be42', 'https://f.x/comprovante', T + 60000);
  ok(r.enviou && env.length === 2 && /seu token a3f91c07be42/.test(env[1].subject) && /a3f91c07be42/.test(env[1].html) && /Pago por PIX/.test(env[1].html) && /3 peças/.test(env[1].html), 'pago: token no assunto e no corpo, forma de pagamento e peças');
  ok(db.m.P1 && db.m.P1.tok === 'a3f91c07be42' && /comprovante\?p=P1&amp;t=a3f91c07be42/.test(env[1].html), 'depois do "pago" a cópia fica (30 dias) com o token, e o e-mail leva o link do comprovante');
  let c = await M.comprovante(db, 'P1', 'a3f91c07be42'); ok(c && /Comprovante de/.test(c) && /a3f91c07be42/.test(c) && /R\$ 234,50/.test(c) && !/0981/.test(c), 'comprovante abre com id + token e não mostra telefone');
  ok((await M.comprovante(db, 'P1', 'a3f91c07be43')) === null && (await M.comprovante(db, 'P1', '')) === null && (await M.comprovante(db, 'NAOEXISTE', 'a3f91c07be42')) === null && (await M.comprovante(db, '../x', 'a')) === null, 'token errado, vazio, pedido que não existe ou id torto não abrem nada');
  r = await M.aoPagar(db, envia, 'P1', 'x'); ok(r.fora && env.length === 2, 'pago de novo não manda nada');
  // sem token no servidor: vale LF-código, como na tela do site
  db = mem(); env = []; await M.aoCriar(db, envia, 'P2', Object.assign({}, PED, { lang: 'es', pag: 'alias', pagar: 329990, ent: 'loja', obsC: '' }), false, '', T);
  ok((await M.comprovante(db, 'P2', 'LF-7K2M')) === null, 'pedido ainda não pago não tem comprovante');
  ok(/Recibimos tu pedido/.test(env[0].subject) && /Gs\. 329\.990/.test(env[0].html) && /Retiro en la tienda/.test(env[0].html) && !/30 minutos/.test(env[0].html) && /Transferencia · esperando/.test(env[0].html), 'espanhol, transferência em Gs., retirada, sem reserva');
  await M.aoPagar(db, envia, 'P2', ''); ok(/tu token LF-7K2M/.test(env[1].subject) && /Pagado por transferencia/.test(env[1].html), 'sem token do servidor usa LF-código');
  // dois avisos de pago ao mesmo tempo: um e-mail só
  db = mem(); env = []; await M.aoCriar(db, envia, 'P3', PED, true, '', T); await Promise.all([M.aoPagar(db, envia, 'P3', 't'), M.aoPagar(db, envia, 'P3', 't')]);
  ok(env.length === 2, 'dois avisos de pago juntos = 1 e-mail de pago');
  // envio falhou: tenta de novo na próxima
  db = mem(); await M.aoCriar(db, envia, 'P4', PED, true, '', T); let caiu = 0;
  try { await M.aoPagar(db, async () => { throw new Error('resend 500'); }, 'P4', 't'); } catch (e) { caiu = 1; }
  ok(caiu && db.m.P4 && db.m.P4.pago === false, 'se o envio do "pago" falha, fica para tentar de novo');
  await M.aoCancelar(db, 'P4'); ok(!db.m.P4, 'pedido cancelado apaga a cópia');
  r = await M.aoCriar(mem(), null, 'P5', PED, true, '', T); ok(r.semChave, 'sem a chave do Resend não quebra o pedido');
  console.log('pedidomail: ' + n + ' testes ok');
})().catch((e) => { console.error('FALHOU', e.message); process.exit(1); });
