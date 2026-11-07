// node functions/teste-loja.js
const L = require('./loja');
let ok = 0, falhou = 0;
function t(nome, cond) { if (cond) ok++; else { falhou++; console.log('FALHOU:', nome); } }
function mkDb() {
  const av = {}, ins = {};
  return {
    av, ins,
    pedidosDoEmail: async (e) => e === 'ana@x.com' ? [{ id: 'P1', itens: [{ ref: 'SL2210' }], ent: 'delivery' }, { id: 'P2', itens: [{ ref: 'GR3340' }] }] : [],
    reservaPaga: async (id) => id === 'P1',
    getAval: async (id) => av[id] || null,
    setAval: async (id, o) => { av[id] = o; },
    listaAval: async (ref) => Object.values(av).filter((a) => a.ref === ref),
    setInscricao: async (id, o) => { ins[id] = o; },
  };
}
(async () => {
  const db = mkDb();
  const ana = { uid: 'u1', email: 'ana@x.com', nome: 'ana paula souza', verificado: true };
  t('nome curto', L.nomeCurto('ana paula souza') === 'Ana S.' && L.nomeCurto('') === 'Cliente');
  t('posso: comprou e pagou', (await L.posso(db, ana, 'SL2210')).pode === true);
  t('posso: comprou mas não pagou', (await L.posso(db, ana, 'GR3340')).pode === false);
  t('posso: sem e-mail confirmado', (await L.posso(db, Object.assign({}, ana, { verificado: false }), 'SL2210')).pode === false);
  let e = null; try { await L.avaliar(db, ana, { ref: 'GR3340', nota: 5 }, 1); } catch (x) { e = x; }
  t('avaliar sem compra paga falha', e && e.motivo === 'sem-compra');
  e = null; try { await L.avaliar(db, ana, { ref: 'SL2210', nota: 9 }, 1); } catch (x) { e = x; }
  t('nota inválida', e && e.motivo === 'nota');
  await L.avaliar(db, ana, { ref: 'SL2210', nota: 5, txt: 'Muito lindo <b>igual</b> à foto', cidade: 'CDE' }, 1000);
  const a = db.av['SL2210__u1'];
  t('gravou com nome curto, via e sem html', a && a.nome === 'Ana S.' && a.via === 'delivery' && a.txt.indexOf('<') < 0);
  await L.avaliar(db, ana, { ref: 'SL2210', nota: 4, txt: 'editado' }, 2000);
  t('editar mantém data e uma por pessoa', db.av['SL2210__u1'].ts === 1000 && db.av['SL2210__u1'].nota === 4 && Object.keys(db.av).length === 1);
  db.av['SL2210__u2'] = { ref: 'SL2210', nome: 'Lu F.', nota: 2, txt: 'x', ts: 3000, ok: false };
  const l = await L.lista(db, 'SL2210');
  t('lista só visíveis, com média', l.n === 1 && l.media === 4 && l.itens[0].nome === 'Ana S.' && !('uid' in l.itens[0]));
  db.av['SL2210__u1'].ok = false;
  await L.avaliar(db, ana, { ref: 'SL2210', nota: 5 }, 4000);
  t('oculta pelo dono continua oculta ao editar', db.av['SL2210__u1'].ok === false);
  e = null; try { await L.inscrever(db, { email: 'nao-e-email' }, 1); } catch (x) { e = x; }
  t('inscrição: e-mail inválido', e && e.motivo === 'email');
  await L.inscrever(db, { email: ' Ana@X.com ', lang: 'es' }, 5);
  await L.inscrever(db, { email: 'ana@x.com' }, 6);
  t('inscrição: sem duplicar', Object.keys(db.ins).length === 1);
  e = null; try { await L.lista(db, '../x'); } catch (x) { e = x; }
  t('ref inválida', e && e.motivo === 'ref');
  console.log('loja: ' + ok + ' testes ok' + (falhou ? ', ' + falhou + ' falharam' : ''));
  process.exit(falhou ? 1 : 0);
})();
