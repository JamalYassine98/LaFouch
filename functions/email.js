// Molde dos e-mails da La Fouch para o cliente (S393, 16/11/2026 — esboços 58a–58h aprovados pelo dono).
// Um molde só: logo, título serifado com a palavra em vinho, fios finos, um botão principal cheio, ação secundária sublinhada, rodapé fino.
// E-mail não carrega a letra do site em todo aplicativo: título em Georgia/serifada do aparelho, texto em Arial.
const V = '#8d3a69', T = '#1d1418', S = '#6b5f66', LN = '#eadfe6', R = '#8a7d84';
const SE = "Georgia,'Times New Roman',serif", SA = 'Arial,Helvetica,sans-serif';
const LOGO = 'https://lafouch.com/media/email/logo.png';
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// titulo e corpo já vêm em HTML (quem chama escapa o que é do cliente); rodape é uma linha opcional acima do endereço
function molde(titulo, corpo, rodape) {
  return '<!doctype html><html><body style="margin:0;background:#fbf7fa;font-family:' + SA + ';padding:28px 14px 22px">' +
    '<div style="max-width:440px;margin:0 auto;background:#fff;border-radius:22px;padding:34px 26px 30px">' +
    '<div style="text-align:center"><img src="' + LOGO + '" width="132" alt="La Fouch" style="display:inline-block;border:0"></div>' +
    '<div style="height:1px;background:' + LN + ';margin:22px 0 26px"></div>' +
    '<h1 style="font:500 27px/1.22 ' + SE + ';color:' + T + ';margin:0 0 14px;text-align:center">' + titulo + '</h1>' + corpo + '</div>' +
    '<p style="max-width:440px;margin:16px auto 0;font:12px/1.6 ' + SA + ';color:' + R + ';text-align:center">' + (rodape ? rodape + '<br>' : '') +
    'La Fouch · Ciudad del Este, Paraguay · <a href="https://lafouch.com" style="color:' + R + '">lafouch.com</a></p></body></html>';
}
const I = (t) => '<i style="color:' + V + '">' + t + '</i>';
const P = (t) => '<p style="font:15px/1.6 ' + SA + ';color:' + S + ';margin:0 0 18px;text-align:center">' + t + '</p>';
const PQ = (t) => '<p style="font:12.5px/1.6 ' + SA + ';color:' + R + ';margin:22px 0 0;text-align:center">' + t + '</p>';
const B = (t, url) => '<p style="text-align:center;margin:26px 0 0"><a href="' + esc(url) + '" style="display:inline-block;padding:15px 34px;border-radius:999px;background:' + V + ';color:#fff;font:600 15px ' + SA + ';text-decoration:none">' + t + '</a></p>';
const LK = (t, url) => '<p style="text-align:center;margin:16px 0 0"><a href="' + esc(url) + '" style="font:14px ' + SA + ';color:' + V + ';text-decoration:underline">' + t + '</a></p>';
const FIO = () => '<div style="height:1px;background:' + LN + ';margin:28px 0 22px"></div>';
const ROT = (t) => '<div style="text-align:center;font:500 11px ' + SA + ';letter-spacing:.2em;color:' + S + ';margin:4px 0 8px">' + t + '</div>';
// código grande entre dois fios (esp = espaço entre as letras, em "em")
function codigo(c, esp, tam) {
  const e = esp == null ? 0.24 : esp;
  return '<div style="border-top:1px solid ' + LN + ';border-bottom:1px solid ' + LN + ';padding:20px 0 20px ' + e + 'em;margin:6px 0 0;text-align:center;font:500 ' + (tam || 38) + 'px/1 ' + SE + ';letter-spacing:' + e + 'em;color:' + T + '">' + esc(c) + '</div>';
}
// cartão presente: cheio (o do cliente) ou claro (o da amiga)
function cartao(rot, tit, cod, val, cheio) {
  const bg = cheio ? '#2b1a2a' : '#fff', fg = cheio ? '#fff' : T, sub = cheio ? '#d9c3d0' : S, bd = cheio ? '#2b1a2a' : LN;
  return '<div style="border-radius:18px;background:' + bg + ';border:1px solid ' + bd + ';padding:22px 22px 20px;margin:8px 0 0"><div style="font:500 11px ' + SA + ';letter-spacing:.2em;color:' + sub + '">' + rot + '</div>' +
    '<div style="font:500 24px/1.2 ' + SE + ';color:' + fg + ';margin:10px 0 14px">' + tit + '</div><div style="height:1px;background:' + (cheio ? '#4a3447' : LN) + '"></div>' +
    '<div style="font:500 21px ' + SE + ';letter-spacing:.14em;color:' + fg + ';margin:14px 0 6px">' + esc(cod) + '</div>' + (val ? '<div style="font:12.5px ' + SA + ';color:' + sub + '">' + val + '</div>' : '') + '</div>';
}
// S400 (17/11/2026 — esboços 61a–61i e 62 aprovados): cartão de luxo. Logo com o escudo à esquerda SÓ dentro do cartão (o topo do e-mail não muda).
// tema 'vinho' = do cliente · 'preto' = VIP · 'marfim' = para presentear · o.ev = temática do site (natal, maes, pais, anonovo, bf, halloween)
const MIDIA = 'https://lafouch.com/media/email/';
const TEMA = {
  vinho: { bg: '#3a1830', gr: 'linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%)', fio: 'rgba(214,178,116,.6)', num: '#e9d3a6', tx: '#ffffff', sub: '#d9c3d0', logo: 'cartao-ouro.png' },
  preto: { bg: '#17121a', gr: 'linear-gradient(135deg,#2b2330 0%,#17121a 55%,#0c090e 100%)', fio: 'rgba(214,178,116,.75)', num: '#e9d3a6', tx: '#ffffff', sub: '#c9bfc6', logo: 'cartao-ouro.png' },
  marfim: { bg: '#fbf5ee', gr: 'linear-gradient(135deg,#fffaf3 0%,#f6ebe0 100%)', fio: 'rgba(169,133,74,.7)', num: '#8d3a69', tx: '#2a1224', sub: '#7a6a72', logo: 'cartao-vinho.png' },
};
const EV = {
  natal: { n: 'Natal', es: 'Navidad', gr: 'linear-gradient(135deg,#2a7049 0%,#1f5c3a 55%,#143d27 100%)', bg: '#1f5c3a', fio: 'rgba(255,217,160,.6)', num: '#ffd9a0', tx: '#ffffff', sub: '#d3e3d8', logo: 'cartao-ev-natal.png' },
  maes: { n: 'Dia das Mães', es: 'Día de la Madre', gr: 'linear-gradient(135deg,#c2507b 0%,#a83a64 55%,#8a2c50 100%)', bg: '#a83a64', fio: 'rgba(255,209,223,.7)', num: '#ffd1df', tx: '#ffffff', sub: '#ffe9f0', logo: 'cartao-ev-maes.png' },
  pais: { n: 'Dia dos Pais', es: 'Día del Padre', gr: 'linear-gradient(135deg,#2b4169 0%,#1e2f4d 55%,#131f35 100%)', bg: '#1e2f4d', fio: 'rgba(224,184,120,.65)', num: '#e0b878', tx: '#ffffff', sub: '#c6cfdd', logo: 'cartao-ev-pais.png' },
  anonovo: { n: 'Ano-Novo', es: 'Año Nuevo', gr: 'linear-gradient(135deg,#fffdf8 0%,#f3ecdf 60%,#e9dcc3 100%)', bg: '#f6f2ea', fio: 'rgba(168,133,74,.85)', num: '#8d703e', tx: '#1f1d1a', sub: '#66625a', logo: 'cartao-ev-anonovo.png' },
  bf: { n: 'Black Friday', es: 'Black Friday', gr: 'linear-gradient(135deg,#242424 0%,#111111 60%,#000000 100%)', bg: '#111111', fio: 'rgba(225,29,72,.95)', num: '#ffffff', tx: '#ffffff', sub: '#c9c9c9', logo: 'cartao-ev-bf.png' },
  halloween: { n: 'Halloween', es: 'Halloween', gr: 'linear-gradient(135deg,#5a2f72 0%,#2a1530 55%,#160c1a 100%)', bg: '#2a1530', fio: 'rgba(226,113,29,.75)', num: '#f08a3c', tx: '#f3e9f5', sub: '#cdbcd3', logo: 'cartao-ev-halloween.png' },
};
// o: { tema | ev, rot, pct, tit, cod (só o cupom do evento), nome, val } — textos já escapados por quem chama
function luxo(o) {
  const t = (o.ev && EV[o.ev]) || TEMA[o.tema || 'vinho'] || TEMA.vinho;
  return '<div style="max-width:300px;margin:8px auto 0;border-radius:16px;background:' + t.bg + ';background-image:' + t.gr + ';padding:6px"><div style="border:1px solid ' + t.fio + ';border-radius:11px;padding:15px 16px 13px">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="vertical-align:middle"><img src="' + MIDIA + t.logo + '" width="82" alt="La Fouch" style="display:block;border:0"></td><td style="text-align:right;vertical-align:middle;font:500 11px Arial;letter-spacing:.16em;color:' + t.sub + '">' + o.rot + '</td></tr></table>' +
    '<div style="font:500 42px/1 ' + SE + ';color:' + t.num + ';margin:18px 0 2px;letter-spacing:.01em">' + o.pct + '</div><div style="font:italic 16px/1.3 ' + SE + ';color:' + t.tx + '">' + o.tit + '</div>' +
    (o.cod ? '<div style="font:500 17px ' + SE + ';letter-spacing:.2em;color:' + t.tx + ';margin-top:10px">' + o.cod + '</div>' : '') +
    '<div style="height:1px;background:' + t.fio + ';opacity:.6;margin:14px 0 9px"></div>' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="font:500 11px Arial;letter-spacing:.1em;color:' + t.sub + '">' + (o.nome || '') + '</td><td style="text-align:right;font:500 11px Arial;letter-spacing:.1em;color:' + t.sub + '">' + (o.val || '') + '</td></tr></table></div></div>';
}
// metas da indicação: 3 bolinhas (cheias = pessoas indicadas que já compraram) + a frase
function metas(n, frase) {
  const bola = (on) => '<span style="display:inline-block;width:11px;height:11px;border-radius:50%;margin:0 4px;' + (on ? 'background:#8d3a69' : 'border:1px solid #cdb9c5') + '"></span>';
  return '<div style="text-align:center;margin:0 0 4px">' + bola(n >= 1) + bola(n >= 2) + bola(n >= 3) + '</div><p style="font:14px/1.6 Arial;color:#6b5f66;margin:8px 0 0;text-align:center">' + frase + '</p>';
}
const tabela = (linhas) => '<table style="width:100%;border-collapse:collapse;border-top:1px solid ' + LN + '">' + linhas.join('') + '</table>';
function linha(a, b, forte) {
  return '<tr><td style="padding:12px 0;border-bottom:1px solid ' + LN + ';font:' + (forte ? '600 ' : '') + '14.5px ' + SA + ';color:' + (forte ? T : S) + '">' + a + '</td>' +
    '<td style="padding:12px 0 12px 12px;border-bottom:1px solid ' + LN + ';text-align:right;white-space:nowrap;font:500 ' + (forte ? '19px ' : '15.5px ') + SE + ';color:' + T + '">' + b + '</td></tr>';
}
module.exports = { molde, I, P, PQ, B, LK, FIO, ROT, codigo, cartao, luxo, metas, EV, tabela, linha, esc, V, T, S, LN, SE, SA, LOGO };
