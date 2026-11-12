const X = require('./seg');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
function dbFake() { const m = {}, ds = {}; return { m, get: async (k) => m[k] || null, salva: async (k, o) => { m[k] = o; }, muda: async (k, o) => { Object.assign(m[k], o); },
  salvaDesafio: async (c, ts) => { ds[c] = ts; }, usaDesafio: async (c, desde) => { const ok = ds[c] && ds[c] >= desde; delete ds[c]; return !!ok; } }; }
(async () => {
  // RFC 6238 (SHA1, segredo "12345678901234567890"): em 59 s o código de 8 dígitos é 94287082 → 6 dígitos 287082
  const seg = X.b32(Buffer.from('12345678901234567890'));
  ok(X.hotp(seg, 1) === '287082', 'TOTP confere com o padrão (RFC 6238)');
  ok(X.unb32(seg).toString() === '12345678901234567890', 'base32 ida e volta');
  const db = dbFake(), T = Date.UTC(2026, 10, 12, 20);
  let r = await X.totpVe(db, '000000', T); ok(r.ok && r.sem, 'sem Authenticator ligado: não bloqueia');
  const c = await X.totpCria(db, T); ok(/^otpauth:\/\/totp\//.test(c.uri), 'cria o QR do Google Authenticator');
  r = await X.totpLiga(db, '111111', T); ok(!r.ok, 'código errado não liga');
  r = await X.totpLiga(db, X.hotp(c.seg, Math.floor(T / 30000)), T); ok(r.ok, 'código certo liga');
  r = await X.totpVe(db, X.hotp(c.seg, Math.floor(T / 30000) + 1), T); ok(r.ok, 'aceita o código da janela seguinte (relógio adiantado)');
  r = await X.totpVe(db, X.hotp(c.seg, Math.floor(T / 30000) + 3), T); ok(!r.ok, 'código de 90 s depois não vale');
  for (let i = 0; i < 5; i++) await X.totpVe(db, '000000', T);
  r = await X.totpVe(db, X.hotp(c.seg, Math.floor(T / 30000)), T); ok(!r.ok && r.motivo === 'espera', '5 erros: espera 15 min (até o certo)');
  r = await X.totpVe(db, X.hotp(c.seg, Math.floor((T + 16 * 60000) / 30000)), T + 16 * 60000); ok(r.ok, 'depois de 15 min volta a aceitar');
  console.log(falhas ? falhas + ' FALHAS' : 'tudo ok'); process.exit(falhas ? 1 : 0);
})();
