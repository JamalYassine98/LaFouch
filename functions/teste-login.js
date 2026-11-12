const L = require('./login');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
(async () => {
  const m = {}, db = { get: async (id) => m[id] || null, salva: async (id, o) => { m[id] = o; }, conta: async (d) => Object.keys(m).filter((k) => k.startsWith('_l') && m[k].ts >= d).length };
  const env = [], envia = async (x) => { env.push(x); };
  const UA = 'Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36';
  let r = await L.avisa(db, envia, { dev: 'abcdef1234', onde: 'painel' }, UA, '181.1.2.3', 1000);
  ok(r.novo && env[0].to === 'lafouch.eyewear@gmail.com' && /NOVO/.test(env[0].subject) && /Android 14 · SM-A546E · Chrome/.test(env[0].html), 'aparelho novo: e-mail com aviso NOVO para lafouch.eyewear@gmail.com');
  r = await L.avisa(db, envia, { dev: 'abcdef1234', onde: 'app' }, UA, '181.1.2.3', 2000);
  ok(!r.novo && env.length === 2 && !/NOVO/.test(env[1].subject) && /app/.test(env[1].subject), 'mesmo aparelho: e-mail de login comum');
  let e = ''; try { await L.avisa(db, envia, { dev: '../x' }, UA, '', 3) } catch (x) { e = x.motivo } ok(e === 'dev', 'aparelho inválido barrado');
  for (let i = 0; i < 12; i++) await L.avisa(db, envia, { dev: 'zzzzzzzz' + i }, UA, '', 5000 + i);
  ok(env.length === L.MAX_HORA, 'no máximo ' + L.MAX_HORA + ' e-mails por hora');
  process.exit(falhas ? 1 : 0);
})();
