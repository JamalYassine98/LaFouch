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
const tabela = (linhas) => '<table style="width:100%;border-collapse:collapse;border-top:1px solid ' + LN + '">' + linhas.join('') + '</table>';
function linha(a, b, forte) {
  return '<tr><td style="padding:12px 0;border-bottom:1px solid ' + LN + ';font:' + (forte ? '600 ' : '') + '14.5px ' + SA + ';color:' + (forte ? T : S) + '">' + a + '</td>' +
    '<td style="padding:12px 0 12px 12px;border-bottom:1px solid ' + LN + ';text-align:right;white-space:nowrap;font:500 ' + (forte ? '19px ' : '15.5px ') + SE + ';color:' + T + '">' + b + '</td></tr>';
}
module.exports = { molde, I, P, PQ, B, LK, FIO, ROT, codigo, cartao, tabela, linha, esc, V, T, S, LN, SE, SA, LOGO };
