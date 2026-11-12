// S198 (aprovado 12/11/2026): segurança do painel.
//  - Chave de acesso (passkey): entrar com a biometria do celular, sem senha. No computador o navegador mostra o QR
//    e o celular confirma (é o próprio padrão das passkeys). A função confere a assinatura e devolve um token do Firebase.
//  - Google Authenticator (TOTP, 6 dígitos a cada 30 s) como 2º passo depois da senha.
//  - Lista de aparelhos que entraram (vem dos avisos de login) e "Sair de todos" (revoga as sessões do dono).
// Regra pura onde dá: o banco vem por "db"; a biblioteca de passkey vem por "wa" (@simplewebauthn/server).
const crypto = require('crypto');
class Falha extends Error { constructor(m, s) { super(m); this.motivo = m; this.status = s || 400; } }
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function b32(buf) { let bits = 0, v = 0, o = ''; for (const x of buf) { v = (v << 8) | x; bits += 8; while (bits >= 5) { o += B32[(v >>> (bits - 5)) & 31]; bits -= 5; } } if (bits) o += B32[(v << (5 - bits)) & 31]; return o; }
function unb32(s) { let bits = 0, v = 0; const o = []; for (const c of String(s).replace(/=+$/, '').toUpperCase()) { const i = B32.indexOf(c); if (i < 0) continue; v = (v << 5) | i; bits += 5; if (bits >= 8) { o.push((v >>> (bits - 8)) & 255); bits -= 8; } } return Buffer.from(o); }
function hotp(seg, n) {
  const b = Buffer.alloc(8); b.writeBigUInt64BE(BigInt(n));
  const h = crypto.createHmac('sha1', unb32(seg)).update(b).digest(), o = h[19] & 15;
  return String((((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]) % 1e6).padStart(6, '0');
}
// aceita o código desta janela de 30 s e da anterior/seguinte (relógio do celular um pouco fora)
function totpOk(seg, cod, agora) {
  const c = String(cod || '').replace(/\D/g, ''); if (c.length !== 6) return false;
  const t = Math.floor(agora / 30000);
  return [-1, 0, 1].some((d) => crypto.timingSafeEqual(Buffer.from(hotp(seg, t + d)), Buffer.from(c)));
}
const MAX_ERROS = 5, JANELA = 15 * 60000;
async function totpCria(db, agora) {
  const seg = b32(crypto.randomBytes(20));
  await db.salva('totp', { pend: seg, ts: agora });
  return { ok: true, seg, uri: 'otpauth://totp/La%20Fouch:painel?secret=' + seg + '&issuer=La%20Fouch&digits=6&period=30' };
}
async function totpLiga(db, cod, agora) {
  const t = (await db.get('totp')) || {};
  if (!t.pend) throw new Falha('sem-pendente');
  if (!totpOk(t.pend, cod, agora)) return { ok: false, motivo: 'codigo' };
  await db.salva('totp', { seg: t.pend, ligado: agora, erros: [] });
  return { ok: true };
}
async function totpVe(db, cod, agora) {
  const t = (await db.get('totp')) || {};
  if (!t.seg) return { ok: true, sem: true }; // ainda não ligado: não bloqueia
  const er = (t.erros || []).filter((x) => agora - x < JANELA);
  if (er.length >= MAX_ERROS) return { ok: false, motivo: 'espera' };
  if (totpOk(t.seg, cod, agora)) { await db.muda('totp', { erros: [] }); return { ok: true }; }
  await db.muda('totp', { erros: er.concat([agora]) });
  return { ok: false, motivo: 'codigo', restam: MAX_ERROS - er.length - 1 };
}
// ---- passkey ----
const RP = { rpID: 'lafouch.com', rpName: 'La Fouch', origin: 'https://lafouch.com' };
async function pkRegOpc(db, wa, agora) {
  const L = ((await db.get('passkeys')) || {}).L || [];
  const o = await wa.generateRegistrationOptions({ rpName: RP.rpName, rpID: RP.rpID, userName: 'dono', userDisplayName: 'Dono La Fouch', attestationType: 'none',
    excludeCredentials: L.map((c) => ({ id: c.id })), authenticatorSelection: { residentKey: 'required', userVerification: 'required' } });
  await db.salva('desafioReg', { c: o.challenge, ts: agora });
  return o;
}
async function pkRegOk(db, wa, resp, nome, agora) {
  const d = (await db.get('desafioReg')) || {};
  if (!d.c || agora - d.ts > 5 * 60000) throw new Falha('desafio');
  const v = await wa.verifyRegistrationResponse({ response: resp, expectedChallenge: d.c, expectedOrigin: RP.origin, expectedRPID: RP.rpID, requireUserVerification: true });
  if (!v.verified) return { ok: false };
  const cr = v.registrationInfo.credential;
  const L = ((await db.get('passkeys')) || {}).L || [];
  L.push({ id: cr.id, pk: Buffer.from(cr.publicKey).toString('base64'), n: cr.counter || 0, nome: String(nome || 'Celular').slice(0, 40), ts: agora });
  await db.salva('passkeys', { L });
  await db.salva('desafioReg', {});
  return { ok: true };
}
async function pkEntOpc(db, wa, agora) {
  const o = await wa.generateAuthenticationOptions({ rpID: RP.rpID, userVerification: 'required' });
  await db.salvaDesafio(o.challenge, agora);
  return o;
}
async function pkEntOk(db, wa, resp, agora) {
  const L = ((await db.get('passkeys')) || {}).L || [], c = L.find((x) => x.id === resp.id);
  if (!c) return { ok: false, motivo: 'chave' };
  const ch = JSON.parse(Buffer.from(resp.response.clientDataJSON, 'base64url').toString()).challenge;
  if (!(await db.usaDesafio(ch, agora - 5 * 60000))) throw new Falha('desafio');
  const v = await wa.verifyAuthenticationResponse({ response: resp, expectedChallenge: ch, expectedOrigin: RP.origin, expectedRPID: RP.rpID, requireUserVerification: true,
    credential: { id: c.id, publicKey: Buffer.from(c.pk, 'base64'), counter: c.n || 0 } });
  if (!v.verified) return { ok: false, motivo: 'chave' };
  c.n = v.authenticationInfo.newCounter; c.uso = agora;
  await db.salva('passkeys', { L });
  return { ok: true, nome: c.nome };
}
module.exports = { Falha, b32, unb32, hotp, totpOk, totpCria, totpLiga, totpVe, pkRegOpc, pkRegOk, pkEntOpc, pkEntOk, RP, MAX_ERROS };
