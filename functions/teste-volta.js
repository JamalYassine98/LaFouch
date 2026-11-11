const V = require('./volta');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
function dbFake() {
  const m = {}, ins = [];
  return { m, ins, salva: async (id, o) => { m[id] = o; }, get: async (id) => m[id] || null,
    pendentes: async (ref) => Object.keys(m).filter((k) => m[k].ref === ref && !m[k].env).map((k) => Object.assign({ id: k }, m[k])),
    muda: async (id, c) => { Object.assign(m[id], c); }, contaEmail: async (e) => Object.values(m).filter((o) => o.email === e && !o.env).length,
    inscreve: async (e, l) => { ins.push(e + '/' + l); } };
}
(async () => {
  const db = dbFake(), env = [], envia = async (x) => { env.push(x); };
  let r = await V.pedir(db, { ref: 'AC1055', email: ' Ana@Gmail.com ', lang: 'es' }, 1);
  ok(r.ok && Object.values(db.m)[0].email === 'ana@gmail.com', 'grava o pedido com e-mail limpo');
  ok(db.ins[0] === 'ana@gmail.com/es', 'entra na lista de inscritos');
  r = await V.pedir(db, { ref: 'AC1055', email: 'ana@gmail.com' }, 2); ok(r.ja && Object.keys(db.m).length === 1, 'pedir de novo não duplica');
  let e = ''; try { await V.pedir(db, { ref: 'AC1055', email: 'anagmail.com' }, 3) } catch (x) { e = x.motivo } ok(e === 'email', 'confere o e-mail');
  e = ''; try { await V.pedir(db, { ref: '<x>', email: 'a@b.com' }, 3) } catch (x) { e = x.motivo } ok(e === 'ref', 'confere a peça');
  e = ''; try { await V.pedir(db, { ref: 'A1', email: 'a@b.com', site: 'x' }, 3) } catch (x) { e = x.motivo } ok(e === 'robo', 'campo escondido barra robô');
  for (let i = 0; i < V.MAX_POR_EMAIL; i++) await V.pedir(db, { ref: 'P' + i, email: 'z@z.com' }, 4);
  e = ''; try { await V.pedir(db, { ref: 'P99', email: 'z@z.com' }, 5) } catch (x) { e = x.motivo } ok(e === 'muitas', 'limite de pedidos por e-mail');
  ok(V.voltou({ aviso: 'Esgotado' }, { aviso: '' }) && !V.voltou({ aviso: '' }, { aviso: '' }) && !V.voltou({ aviso: 'Esgotado' }, { aviso: '', oculto: true }), 'só dispara quando sai do Esgotado');
  let n = await V.dispara(db, envia, 'AC1055', 'Armação redonda rosa', 9);
  ok(n === 1 && env[0].to === 'ana@gmail.com' && /Volvió/.test(env[0].subject) && /\?ref=AC1055/.test(env[0].html), 'manda 1 e-mail em espanhol com o link da peça');
  n = await V.dispara(db, envia, 'AC1055', 'x', 10); ok(n === 0 && env.length === 1, 'nunca manda duas vezes');
  process.exit(falhas ? 1 : 0);
})();
