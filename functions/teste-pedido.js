// S3 parte 1 (20/11/2026): pedido, comprovante, cancelamento e "avise-me" pela nuvem — inclusive as TENTATIVAS DE BURLAR.
'use strict';
const P = require('./pedido');
const { Falha } = require('./falha');
let ok = 0; const falhas = [];
const t = (n, c) => { if (c) { ok++; console.log('  ok  ' + n); } else { falhas.push(n); console.log('  FALHA  ' + n); } };
const erro = async (p) => { try { await p; return null; } catch (e) { return e; } };
function banco() {
  const ped = {}, ids = {}, res = {}, cont = {};
  return { ped, ids, res,
    existe: async (id) => !!ped[id],
    pedidoSeu: async (ref) => (ids[ref] ? { pago: !!(res[ref] && res[ref].pago), cancelado: !!(res[ref] && res[ref].cancelado) } : null),
    conta: async (k, agora) => { const o = cont[k]; cont[k] = !o || agora - o.ts > P.HORA ? { ts: agora, n: 1 } : { ts: o.ts, n: o.n + 1 }; return cont[k].n; },
    cria: async (id, doc, tipo) => { if (tipo === 'pedido') ids[id] = 1; ped[id] = doc; },
  };
}
const T0 = Date.UTC(2026, 10, 20, 18);
const pedido = (extra) => Object.assign({ ts: T0, nome: 'Cliente Teste', tel: '+595 981 000 111', total: 100000, itens: [{ ref: 'KIT3C', q: 1 }], pag: 'pix', brl: 69.63, uq: 37, cod: 'AB12' }, extra || {});

(async () => {
  let db = banco();
  let r = await P.entrega(db, { id: 'lx1abcde', doc: pedido() }, T0, 'rede1');
  t('pedido certo: gravado em pedidos/ (o app lê igual) e marcado como recebido pela nuvem', r.ok && db.ped.lx1abcde && db.ids.lx1abcde && db.ped.lx1abcde.total === 100000);
  r = await P.entrega(db, { id: 'lx1abcde', doc: pedido() }, T0, 'rede1');
  t('mesmo pedido de novo (o site tentou outra vez): igual a 1', r.ok && r.ja);
  t('BURLA: campo que não existe no pedido → recusado', (await erro(P.entrega(db, { id: 'lx2abcde', doc: pedido({ pago: true }) }, T0, 'rede1'))) instanceof Falha);
  t('BURLA: total negativo ou texto → recusado', (await erro(P.entrega(db, { id: 'lx3abcde', doc: pedido({ total: -1 }) }, T0, 'rede1'))) instanceof Falha && (await erro(P.entrega(db, { id: 'lx4abcde', doc: pedido({ total: '9' }) }, T0, 'rede1'))) instanceof Falha);
  t('BURLA: nome gigante (acima do limite) → recusado', (await erro(P.entrega(db, { id: 'lx5abcde', doc: pedido({ nome: 'x'.repeat(90) }) }, T0, 'rede1'))) instanceof Falha);
  t('BURLA: sem peças ou com 31 peças → recusado', (await erro(P.entrega(db, { id: 'lx6abcde', doc: pedido({ itens: [] }) }, T0, 'rede1'))) instanceof Falha && (await erro(P.entrega(db, { id: 'lx7abcde', doc: pedido({ itens: Array(31).fill({ ref: 'A1' }) }) }, T0, 'rede1'))) instanceof Falha);
  t('BURLA: número do pedido com barra (outro caminho do banco) → recusado', (await erro(P.entrega(db, { id: '../config', doc: pedido() }, T0, 'rede1'))) instanceof Falha);

  // comprovante e cancelamento: só de pedido que a nuvem recebeu e que ainda não foi pago
  const comp = (ref) => ({ tipo: 'comp', ref, img: 'data:image/jpeg;base64,AAAA', ts: T0, cod: 'AB12' });
  t('BURLA: comprovante de pedido que não existe → recusado', ((await erro(P.entrega(db, { id: 'falso1c', doc: comp('falso1') }, T0, 'rede1'))) || {}).motivo === 'pedido');
  t('BURLA: comprovante com número trocado (id não bate com o pedido) → recusado', (await erro(P.entrega(db, { id: 'outro1c', doc: comp('lx1abcde') }, T0, 'rede1'))) instanceof Falha);
  r = await P.entrega(db, { id: 'lx1abcdec', doc: comp('lx1abcde') }, T0, 'rede1');
  t('comprovante do pedido certo → gravado', r.ok && db.ped.lx1abcdec.tipo === 'comp');
  db.res.lx1abcde = { pago: true };
  delete db.ped.lx1abcdec;
  t('BURLA: comprovante de pedido já pago → recusado', ((await erro(P.entrega(db, { id: 'lx1abcdec', doc: comp('lx1abcde') }, T0, 'rede1'))) || {}).motivo === 'pago');
  t('BURLA: imagem acima de 900 KB → recusado', (await erro(P.entrega(db, { id: 'lx1abcdec', doc: Object.assign(comp('lx1abcde'), { img: 'x'.repeat(900001) }) }, T0, 'rede1'))) instanceof Falha);
  r = await P.entrega(db, { id: 'lx1abcdex', doc: { tipo: 'cancel', ref: 'lx1abcde', ts: T0, cod: 'AB12' } }, T0, 'rede1');
  t('cancelamento do pedido → gravado', r.ok && db.ped.lx1abcdex.tipo === 'cancel');
  r = await P.entrega(db, { id: 'avKIT3C-981000111', doc: { tipo: 'avise', ref: 'KIT3C', nome: 'Cliente Teste', tel: '981000111', pais: 'py', ts: T0 } }, T0, 'rede1');
  t('"avise-me" de peça → gravado', r.ok);

  // limites por hora
  db = banco();
  for (let i = 0; i < P.LIMITE.pedido; i++) await P.entrega(db, { id: 'lim' + i + 'abc', doc: pedido({ tel: '9810' + (10000 + i) }) }, T0 + i, 'rede2');
  const e11 = await erro(P.entrega(db, { id: 'lim99abc', doc: pedido({ tel: '981099999' }) }, T0 + 20, 'rede2'));
  t('pedido além do limite da mesma rede na mesma hora → espera', e11 instanceof Falha && e11.motivo === 'espera' && e11.status === 429);
  t('na hora seguinte volta a aceitar', (await P.entrega(db, { id: 'lim98abc', doc: pedido({ tel: '981099998' }) }, T0 + P.HORA + 1000, 'rede2')).ok);
  db = banco();
  for (let i = 0; i < P.LIMITE.tel; i++) await P.entrega(db, { id: 'tel' + i + 'abc', doc: pedido() }, T0 + i, 'rede' + i);
  t('pedido além do limite do mesmo telefone na mesma hora (de redes diferentes) → espera', ((await erro(P.entrega(db, { id: 'tel99abc', doc: pedido() }, T0 + 20, 'redeX'))) || {}).motivo === 'espera');
  // 22/11: rede da loja (ipk vazio) não tem limite por rede — Black Friday no Wi-Fi da loja
  db = banco();
  let todos = true;
  for (let i = 0; i < P.LIMITE.pedido * 3; i++) todos = todos && !!(await P.entrega(db, { id: 'loj' + i + 'abc', doc: pedido({ tel: '9820' + (10000 + i) }) }, T0 + i, '')).ok;
  t('rede da loja: ' + P.LIMITE.pedido * 3 + ' pedidos na mesma hora passam (o limite por telefone continua)', todos);
  console.log(falhas.length ? `pedido: ${falhas.length} falha(s)` : `pedido: ${ok} testes ok`);
  process.exit(falhas.length ? 1 : 0);
})();
