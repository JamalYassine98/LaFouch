const M = require('./mensagem');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
function dbFake() { const m = {}; return { m, salva: async (id, o) => { m[id] = o; }, lista: async (n) => Object.values(m).slice(0, n), muda: async (id, c) => { Object.assign(m[id] || {}, c); }, contaRecentes: async (k, d) => Object.values(m).filter((o) => o.ipk === k && o.ts >= d).length }; }
(async () => {
  const db = dbFake(); const env = []; const envia = async (x) => { env.push(x); };
  const r = await M.enviar(db, envia, { tipo: 'contato', nome: 'Ana Souza', email: 'Ana@Gmail.com', tel: '+55 45 99812-3344', msg: 'Quero saber de um modelo' }, '1.2.3.4', 1000);
  ok(r.ok && r.email === 'ok', 'contato grava e manda e-mail');
  ok(env[0].to === 'lafouch.eyewear@gmail.com' && env[0].reply_to === 'ana@gmail.com', 'e-mail vai para lafouch.eyewear@gmail.com com resposta ao cliente');
  ok(db.m[r.id].est === 'novo', 'mensagem nova fica como Novo');
  let e = ''; try { await M.enviar(db, envia, { tipo: 'contato', nome: 'Ana', email: 'x@y.com', tel: '1234567', msg: 'oi oi' }, 'a', 1) } catch (x) { e = x.motivo } ok(e === 'nome', 'pede nome e sobrenome');
  e = ''; try { await M.enviar(db, envia, { tipo: 'contato', nome: 'Ana S', email: 'xy.com', tel: '1234567', msg: 'oi oi' }, 'a', 1) } catch (x) { e = x.motivo } ok(e === 'email', 'confere o e-mail');
  e = ''; try { await M.enviar(db, envia, { tipo: 'contato', nome: 'Ana S', email: 'x@y.com', tel: '1234567', msg: 'oi oi', site: 'http' }, 'a', 1) } catch (x) { e = x.motivo } ok(e === 'robo', 'campo escondido barra robô');
  const a = await M.enviar(db, envia, { tipo: 'atacado', cod: 'A-1042', pais: 'Brasil', qtd: '50 peças', procura: ['Solar', 'Armações', 'X'], vistos: ['SL2210'], favs: ['GR3340'] }, '9.9.9.9', 2000);
  ok(a.ok && a.email === 'nao' && db.m[a.id].procura.join(',') === 'Solar,Armações', 'atacado grava cópia (sem e-mail), só opções válidas');
  for (let i = 0; i < 5; i++) { try { await M.enviar(db, envia, { tipo: 'atacado' }, '5.5.5.5', 5000 + i) } catch (x) {} }
  e = ''; try { await M.enviar(db, envia, { tipo: 'atacado' }, '5.5.5.5', 6000) } catch (x) { e = x.motivo } ok(e === 'muitas', 'limite de 5 por hora por endereço');
  await M.estado(db, a.id, 'respondido'); ok(db.m[a.id].est === 'respondido', 'muda o estado');
  process.exit(falhas ? 1 : 0);
})();
