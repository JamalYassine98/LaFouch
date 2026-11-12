// Aviso de login (bloco 5 item 5, aprovado 11/11/2026): cada vez que o dono ENTRA COM A SENHA no painel ou no app,
// vai um e-mail para lafouch.eyewear@gmail.com com o aparelho, a hora e o endereço de internet. Aparelho nunca visto = "NOVO".
// Regra pura: o banco vem por um objeto "db".  db.get(id) · db.salva(id, o) · db.conta(desde) -> n avisos desde
class Falha extends Error { constructor(m, s) { super(m); this.motivo = m; this.status = s || 400; } }
const crypto = require('crypto');
const PARA = 'lafouch.eyewear@gmail.com';
const MAX_HORA = 10;
const limpa = (t, n) => String(t == null ? '' : t).replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
// "Mozilla/5.0 (Linux; Android 14; SM-A546E) ... Chrome/130" -> "Android 14 · SM-A546E · Chrome"
function aparelho(ua) {
  ua = String(ua || '');
  const so = /Windows NT 10/.test(ua) ? 'Windows' : /Android ([\d.]+)/.test(ua) ? 'Android ' + RegExp.$1 : /iPhone OS ([\d_]+)/.test(ua) ? 'iPhone iOS ' + RegExp.$1.replace(/_/g, '.') : /Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'outro';
  const mod = (/Android [\d.]+; ([^;)]+)/.exec(ua) || [])[1] || '';
  const nav = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'navegador';
  return [so, limpa(mod, 40), nav].filter(Boolean).join(' · ');
}
function hora(agora) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Asuncion', dateStyle: 'short', timeStyle: 'short' }).format(new Date(agora));
}
async function avisa(db, envia, b, ua, ip, agora) {
  const dev = /^[a-z0-9]{8,40}$/.test(String(b.dev || '')) ? b.dev : '';
  if (!dev) throw new Falha('dev');
  if ((await db.conta(agora - 3600000)) >= MAX_HORA) return { ok: true, limite: true };
  const onde = b.onde === 'app' ? 'app' : 'painel';
  const id = crypto.createHash('sha256').update(dev).digest('hex').slice(0, 32);
  const ja = await db.get(id);
  const ap = aparelho(ua);
  await db.salva(id, { ap, onde, ip: limpa(ip, 60), ts: agora, ini: ja ? ja.ini || agora : agora, n: ((ja && ja.n) || 0) + 1 });
  await db.salva('_l' + agora + id.slice(0, 6), { ts: agora, aviso: 1 });
  const novo = !ja;
  await envia({
    to: PARA,
    subject: (novo ? '⚠️ Login em aparelho NOVO' : 'Login') + ' no ' + (onde === 'app' ? 'app' : 'painel') + ' La Fouch · ' + hora(agora),
    html:
      '<div style="font-family:Arial,sans-serif;font-size:15px;color:#222"><p><b>' + (novo ? 'Entraram com a sua senha num aparelho que nunca entrou antes.' : 'Entraram com a sua senha.') + '</b></p>' +
      '<p>Onde: ' + (onde === 'app' ? 'app da loja' : 'painel do site') + '<br>Aparelho: ' + ap + '<br>Hora (Paraguai): ' + hora(agora) + '<br>Endereço de internet: ' + limpa(ip, 60) + '</p>' +
      '<p style="color:#a00">Se não foi você: troque a senha agora no painel (Conta › Alterar senha). Isso desconecta quem entrou (em até 1 hora).</p></div>',
  });
  return { ok: true, novo };
}
module.exports = { Falha, avisa, aparelho, PARA, MAX_HORA };
