const X = require('./exp.js');
function roda(nome, gen, N, fn) {
  let ok = 0, antes = 0, perErr = 0, nao = 0, tarde = 0, semTempo = 0, ds = [], pe = [], pior = [];
  for (let i = 0; i < N; i++) {
    const o = gen(i), ass = X.grava(o), r = X.vivo(fn || X.gtFechouN, ass), fimVolta = o.S + o.P;
    if (!r.em) { if (fimVolta + 3.5 > o.dur - 1) semTempo++; else { nao++; pior.push(['NÃO FECHOU', o, r]); } continue; }
    const d = r.em - fimVolta; ds.push(d); pe.push(Math.abs(r.per - o.P) / o.P * 360);
    if (d < -0.3) { antes++; pior.push(['ANTES DA VOLTA', o, r]); }
    else if (Math.abs(r.per - o.P) / o.P * 360 > 3) { perErr++; pior.push(['PERÍODO (>3°)', o, r]); }
    else if (d > 6) { tarde++; pior.push(['tarde', o, r]); }
    else ok++;
  }
  ds.sort((a, b) => a - b); pe.sort((a, b) => a - b);
  const q = (a, p) => a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))].toFixed(2) : '-';
  console.log(nome.padEnd(44), 'certo', String(ok).padStart(3), '/', N, '| antes', antes, '| período', perErr, '| não fechou', nao, '| tarde', tarde, '| sem tempo', semTempo,
    '| atraso após a volta: mín', q(ds, 0), 'med', q(ds, 0.5), 'máx', q(ds, 0.999), '| erro do período em graus: med', q(pe, 0.5), 'p95', q(pe, 0.95));
  pior.slice(0, 3).forEach(p => console.log('    ', p[0], JSON.stringify(p[1]), JSON.stringify(p[2])));
}
const R = (i, a, b, k) => a + ((i * 7919 * (k || 1) + 13 * (k || 1)) % 1000) / 1000 * (b - a);
const fn = process.argv[2] === 'A' ? X.gtFechouA : X.gtFechouN;
console.log('detector:', process.argv[2] === 'A' ? 'ANTIGO' : 'NOVO');
roda('prato 18–45 s, parado 0–14 s, real (ruído .25, luz ±.2%)', i => ({ dur: 60, S: R(i, 0, 14, 1), P: R(i, 18, 45, 3), ruido: 0.25, ae: 0.002, seed: i + 1 }), 300, fn);
roda('idem + tempo irregular ±0,1 s', i => ({ dur: 60, S: R(i, 0, 14, 1), P: R(i, 18, 45, 3), ruido: 0.25, ae: 0.002, jit: 0.2, seed: i + 1 }), 300, fn);
roda('idem + luz ±2% e deriva 3%', i => ({ dur: 60, S: R(i, 0, 14, 1), P: R(i, 18, 45, 3), ruido: 0.25, ae: 0.02, deriva: 0.03, seed: i + 1 }), 300, fn);
roda('idem + ruído 0,6', i => ({ dur: 60, S: R(i, 0, 14, 1), P: R(i, 18, 45, 3), ruido: 0.6, ae: 0.005, jit: 0.1, seed: i + 1 }), 300, fn);
roda('caso do dono (parado 9,2 s; volta 40,8 s)', i => ({ dur: 60, S: 9.2, P: 40.8, ruido: 0.25, ae: 0.002, jit: 0.1, ini: R(i, 0, 360, 5), seed: i + 1 }), 60, fn);
roda('prato rápido 9–18 s', i => ({ dur: 60, S: R(i, 0, 14, 1), P: R(i, 9, 18, 3), ruido: 0.25, ae: 0.002, seed: i + 1 }), 200, fn);
