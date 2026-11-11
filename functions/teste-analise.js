const A = require('./analise');
let f = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) f++; };
(async () => {
  const m = {}; const db = { salva: async (id, o) => { m[id] = o; }, desde: async (ts) => Object.values(m).filter((o) => o.ts >= ts) };
  await A.registra(db, { id: 'vabc12345', v: { SL2210: 3, 'x y': 2 }, c: { SL2210: 1 }, b: [{ t: 'Gatinho', n: 0 }, { t: 'x' }], mo: 1, dev: 'pc', lang: 'es', ev: 'maes', nome: 'Ana', email: 'a@b.c' }, 1000);
  ok(!('nome' in m.vabc12345) && !('email' in m.vabc12345), 'nada pessoal é guardado');
  ok(m.vabc12345.v.SL2210 === 3 && !m.vabc12345.v['x y'], 'só referências válidas');
  ok(m.vabc12345.b.length === 1 && m.vabc12345.b[0].t === 'gatinho', 'busca em minúsculas, termo curto fora');
  await A.registra(db, { id: 'vdef12345', v: { SL2210: 1, GR3340: 2 }, pe: 1 }, 2000);
  const r = await A.resumo(db, 7, 3000);
  ok(r.visitas === 2 && r.vistas === 6 && r.pedidos === 1 && r.mochi === 1, 'totais');
  ok(r.pecas[0][0] === 'SL2210' && r.vistasSemCarrinho[0][0] === 'GR3340', 'mais vistas e vistas sem carrinho');
  ok(r.semResultado[0][0] === 'gatinho' && r.eventos.maes === 1 && r.pc === 1, 'buscas sem resultado, evento e PC');
  let e = ''; try { await A.registra(db, { id: '../x' }, 1) } catch (x) { e = x.motivo } ok(e === 'id', 'id inválido barrado');
  process.exit(f ? 1 : 0);
})();
