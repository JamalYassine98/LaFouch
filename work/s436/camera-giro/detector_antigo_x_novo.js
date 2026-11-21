// Experimento: detector da volta ANTIGO (ancorado no começo) × NOVO (ancorado no fim), com as poses do giro de referência (BR44118)
const fs = require('fs');
const raw = fs.readFileSync('/tmp/gx/sig.raw'), SW = 48, SH = 27, NP = SW * SH;
const pose = []; for (let i = 0; i < 360; i++) { const g = new Float32Array(NP); for (let k = 0; k < NP; k++) g[k] = raw[i * NP + k]; pose.push(g); }
// gerador de "gravação": parado S segundos na frente, depois gira com período P; ruído por ponto; ganho da câmera (luz automática) variando
function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function grava(o) {
  const r = rnd(o.seed || 7), out = [], N = Math.floor(o.dur / 0.5);
  for (let i = 0; i < N; i++) {
    const t = (i + 1) * 0.5 + (o.jit ? (r() - 0.5) * o.jit : 0);
    let ang = t < o.S ? 0 : 360 * (t - o.S) / o.P; if (o.ini) ang += o.ini;
    const a = ((ang % 360) + 360) % 360, i0 = Math.floor(a) % 360, i1 = (i0 + 1) % 360, f = a - Math.floor(a);
    const ganho = 1 + (o.ae || 0) * Math.sin(2 * Math.PI * t / 13) + (o.deriva || 0) * t / 60;
    const g = new Float32Array(NP);
    for (let k = 0; k < NP; k++) g[k] = (pose[i0][k] * (1 - f) + pose[i1][k] * f) * ganho + (o.ruido || 0) * (r() + r() + r() - 1.5) * 2;
    out.push(g);
  }
  return out;
}
// ---- ANTIGO (cópia do src/97-giro-trata.js)
function gtVoltaA(ass, passo) {
  var n = ass.length, melhor = 0, mv = 1e9, lista = [], T0 = Math.round(8 / passo);
  for (var T = T0; T <= n - Math.round(3 / passo); T++) {
    var s = 0, c = 0;
    for (var a = 0; a + T < n; a++) { var A = ass[a], Bq = ass[a + T], dd = 0; for (var k = 0; k < A.length; k++) dd += Math.abs(A[k] - Bq[k]); s += dd / A.length; c++; }
    s /= c; lista.push([T, s]);
    if (s < mv) { mv = s; melhor = T; }
  }
  if (!lista.length) return { per: 0, casa: 1e9, meio: 0 };
  var ix = melhor - T0, f = 0;
  if (ix > 0 && ix < lista.length - 1) { var y0 = lista[ix - 1][1], y1 = lista[ix][1], y2 = lista[ix + 1][1], den = y0 - 2 * y1 + y2; if (den > 1e-9) f = 0.5 * (y0 - y2) / den; }
  var m = 0, mc = 0;
  for (var q = Math.round(2 / passo); q <= Math.round(6 / passo); q++) for (a = 0; a + q < n; a += 2) { A = ass[a]; Bq = ass[a + q]; dd = 0; for (k = 0; k < A.length; k++) dd += Math.abs(A[k] - Bq[k]); m += dd / A.length; mc++; }
  return { per: (melhor + f) * passo, casa: mv, meio: mc ? m / mc : 0, borda: ix <= 0 || ix >= lista.length - 1 };
}
function gtFechouA(ass, passo) { var v = gtVoltaA(ass, passo); return v.per > 0 && !v.borda && v.meio > 0.8 && v.casa < v.meio * 0.5 && ass.length * passo >= v.per + 3.5 ? v : null; }
// ---- NOVO: os últimos 3 s comparados com o que a câmera viu T antes; brilho igualado
function gtIguala(ass) { // tira o brilho que a câmera escolheu: cada assinatura vai para a média do conjunto
  var ms = ass.map(function (g) { var s = 0; for (var k = 0; k < g.length; k++) s += g[k]; return s / g.length; }), M = 0;
  ms.forEach(function (m) { M += m; }); M /= ms.length || 1;
  return ass.map(function (g, i) { var f = M / (ms[i] || 1), o = new Float32Array(g.length); for (var k = 0; k < g.length; k++) o[k] = g[k] * f; return o; });
}
function gtDif(A, B) { var dd = 0; for (var k = 0; k < A.length; k++) dd += Math.abs(A[k] - B[k]); return dd / A.length; }
function gtVoltaN(ass, passo, iguala) {
  var n = ass.length, W = Math.round(3 / passo), T0 = Math.round(8 / passo), melhor = 0, mv = 1e9, val = [], T, k, s, e;
  if (iguala !== false) ass = gtIguala(ass);
  var mov = new Float32Array(n); for (k = 1; k < n; k++) mov[k] = gtDif(ass[k], ass[k - 1]);
  var agora = 0; for (k = n - W; k < n; k++) agora += mov[k]; agora /= W;
  for (T = T0; T <= n - W - 1; T++) {
    s = 0; e = 0;
    for (k = n - W; k < n; k++) { s += gtDif(ass[k], ass[k - T]); e += mov[k - T]; }
    if (e / W < agora * 0.5) continue; // nesse trecho antigo a peça estava parada (esperando o prato ligar): não serve de "uma volta antes"
    val[T] = s / W;
    if (val[T] < mv) { mv = val[T]; melhor = T; }
  }
  if (!melhor) return { per: 0, casa: 1e9, meio: 0, borda: true };
  var y0 = val[melhor - 1], y2 = val[melhor + 1], borda = y0 === undefined || y2 === undefined, f = 0, den;
  if (!borda) { den = y0 - 2 * mv + y2; if (den > 1e-9) f = 0.5 * (y0 - y2) / den; }
  var m = 0, mc = 0;
  for (var q = Math.round(2 / passo); q <= Math.round(6 / passo); q++) for (k = n - W; k < n; k++) if (k - q >= 0) { m += gtDif(ass[k], ass[k - q]); mc++; }
  return { per: (melhor + f) * passo, casa: mv, meio: mc ? m / mc : 0, borda: borda };
}
function gtFechouN(ass, passo, ig) { var v = gtVoltaN(ass, passo, ig); return v.per > 0 && !v.borda && v.meio > 0.8 && v.casa < v.meio * 0.5 ? v : null; }
// ---- roda "ao vivo": avalia a cada 2 amostras a partir de 24
function vivo(fn, ass, lim) {
  for (let n = 24; n <= ass.length; n += 2) { const v = fn(ass.slice(0, n), 0.5); if (v) return { em: n * 0.5, per: +v.per.toFixed(2), casa: +v.casa.toFixed(2), meio: +v.meio.toFixed(2) }; }
  const v = fn === gtFechouA ? gtVoltaA(ass, 0.5) : gtVoltaN(ass, 0.5);
  return { em: null, per: +v.per.toFixed(2), casa: +v.casa.toFixed(2), meio: +v.meio.toFixed(2), borda: v.borda };
}
module.exports = { grava, vivo, gtFechouA, gtFechouN, gtVoltaA, gtVoltaN, pose };
if (require.main === module) {
  const casos = [];
  for (const P of [12, 20, 30, 40]) for (const S of [0, 2, 4, 6, 10, 15]) casos.push({ P, S });
  console.log('P   S  | certo | ANTIGO fecha em (per) | NOVO fecha em (per) | NOVO sem igualar');
  for (const c of casos) {
    const ass = grava({ dur: 60, S: c.S, P: c.P, ruido: 0.3, ae: 0.01, seed: 3 });
    const A = vivo(gtFechouA, ass), N = vivo(gtFechouN, ass), N2 = vivo((a, p) => gtFechouN(a, p, false), ass);
    const f = r => r.em ? (r.em + ' (' + r.per + ')').padEnd(14) : ('NÃO ' + r.casa + '/' + r.meio).padEnd(14);
    console.log(String(c.P).padEnd(3), String(c.S).padEnd(3), '|', String(c.S + c.P + 3.5).padEnd(5), '|', f(A), '|', f(N), '|', f(N2));
  }
}
