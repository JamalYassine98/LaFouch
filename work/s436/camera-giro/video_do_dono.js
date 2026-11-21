const X = require('./exp.js'), D = JSON.parse(require('fs').readFileSync('/tmp/gx/real.json'));
const A = D.A.map(a => Float32Array.from(a)), B = D.B.map(a => Float32Array.from(a));
console.log('amostras reais:', A.length, '(0 a', (A.length * 0.5).toFixed(1), 's)');
for (const n of [24, 30, 40, 50, 60, 70, 75]) {
  const a = A.slice(0, n), o = X.gtVoltaA(a, 0.5), v = X.gtVoltaN(a, 0.5);
  console.log('até', (n * 0.5).toFixed(1).padStart(4), 's | ANTIGO per', o.per.toFixed(1), 'casa', o.casa.toFixed(2), 'meio', o.meio.toFixed(2), o.borda ? 'borda' : '', X.gtFechouA(a, 0.5) ? 'FECHOU' : '', '| NOVO per', v.per.toFixed(1), 'casa', v.casa.toFixed(2), 'meio', v.meio.toFixed(2), v.borda ? 'borda' : '', X.gtFechouN(a, 0.5) ? 'FECHOU' : '');
}
let f = null; for (let n = 24; n <= A.length; n += 2) if (X.gtFechouN(A.slice(0, n), 0.5)) { f = n * 0.5; break; }
console.log('NOVO: fechou antes da hora nos 37 s reais?', f === null ? 'não (certo)' : 'SIM em ' + f);
// gravação mista: 0–37 s reais; 37,5–49,5 s sem dados (poses que o vídeo não tem: uso quadros reais "longe"); 50–60 s = quadros reais de uma volta antes (t − 40,8) com o ruído real
const P = 40.8, mix = A.slice();
function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const r = rnd(5);
for (let i = A.length; i < 120; i++) {
  const t = i * 0.5, tp = t - P; let g;
  if (tp >= 9.5) { const j = Math.round(tp / 0.5); g = Float32Array.from(A[j]); for (let k = 0; k < g.length; k++) g[k] += (r() + r() + r() - 1.5) * 0.9; }
  else { const j = 40 + ((i * 7) % 30); g = Float32Array.from(A[j]); for (let k = 0; k < g.length; k++) g[k] = g[k] * 0.6 + A[(j + 17) % 75][k] * 0.4 + (r() - 0.5) * 3; } // pose "desconhecida": mistura de duas outras
  mix.push(g);
}
// os 3 quadros reais do fim (57,8 a 58,8 s)
[116, 117, 118].forEach((i, q) => { mix[i] = B[q]; });
const dreal = []; for (let q = 0; q < 3; q++) { let s = 0; for (let k = 0; k < 1296; k++) s += Math.abs(B[q][k] - A[34 + q][k]); dreal.push((s / 1296).toFixed(2)); }
console.log('diferença real entre a mesma pose uma volta depois (sem igualar o brilho):', dreal.join(' '));
f = null; let fo = null;
for (let n = 24; n <= mix.length; n += 2) { if (!f) { const v = X.gtFechouN(mix.slice(0, n), 0.5); if (v) f = [n * 0.5, v.per.toFixed(2), v.casa.toFixed(2), v.meio.toFixed(2)]; } if (!fo) { const v = X.gtFechouA(mix.slice(0, n), 0.5); if (v) fo = [n * 0.5, v.per.toFixed(2)]; } }
console.log('gravação mista (real + volta repetida): NOVO fecha em', f, '| ANTIGO fecha em', fo, '| certo: parado 9,2 + volta 40,8 + 3,5 = 53,5 s');
