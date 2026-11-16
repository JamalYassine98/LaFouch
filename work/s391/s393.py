# S393: os e-mails que já existem passam a usar o molde aprovado (esboços 58a–58f)
F='/home/claude/lafouch/functions/'
def ed(arq,pares):
    s=open(F+arq,encoding='utf8').read()
    for a,b in pares:
        assert s.count(a)==1,(arq,s.count(a),a[:70]);s=s.replace(a,b)
    open(F+arq,'w',encoding='utf8').write(s)
# 58a código de confirmação
s=open(F+'codigo.js',encoding='utf8').read();i=s.index('function emailHtml(nome, cod, es) {');j=s.index('\n}\n',i)+3
s=s[:i]+'''function emailHtml(nome, cod, es) {
  const pn = String(nome || '').trim().split(/\\s+/)[0];
  return E.molde(es ? 'Confirmá tu ' + E.I('e-mail') : 'Confirme seu ' + E.I('e-mail'),
    E.P((es ? '¡Hola' : 'Olá') + (pn ? ', ' + esc(pn) : '') + (es ? '! Usá este código para terminar tu cuenta:' : '. Use este código para concluir sua conta:')) +
    E.codigo(cod) + E.PQ(es ? 'Vale por 10 minutos. Si no fuiste vos, ignorá este e-mail.' : 'Vale por 10 minutos. Se não foi você, ignore este e-mail.'));
}
'''+s[j:]
assert s.count("const crypto = require('crypto');")==1;s=s.replace("const crypto = require('crypto');","const crypto = require('crypto');\nconst E = require('./email');")
open(F+'codigo.js','w',encoding='utf8').write(s)
# 58d voltou ao estoque
s=open(F+'volta.js',encoding='utf8').read();i=s.index("    subject: (es ? 'Volvió: ' : 'Voltou: ') + n + ' · La Fouch',");j=s.index("  };\n}",i)
s=s[:i]+'''    subject: (es ? 'Volvió: ' : 'Voltou: ') + n,
    html: E.molde(es ? 'Volvió al ' + E.I('stock') : 'Voltou ao ' + E.I('estoque'),
      E.P(es ? 'La pieza que pediste que te avisemos está disponible otra vez:' : 'A peça que você pediu para avisar está disponível de novo:') +
      '<div style="border-top:1px solid ' + E.LN + ';border-bottom:1px solid ' + E.LN + ';padding:18px 0;text-align:center"><div style="font:500 20px/1.3 ' + E.SE + ';color:' + E.T + '">' + E.esc(n) + '</div>' +
      (n !== o.ref ? '<div style="font:13px ' + E.SA + ';color:' + E.S + ';margin-top:6px;letter-spacing:.06em">' + E.esc(o.ref) + '</div>' : '') + '</div>' +
      E.B(es ? 'Ver la pieza' : 'Ver a peça', link) + E.PQ(es ? 'Te avisamos una sola vez, como pediste.' : 'Avisamos uma vez só, como você pediu.')),
'''+s[j:]
k=s.index('\n',s.index('require('))+1 if 'require(' in s else 0
s=s[:k]+"const E = require('./email');\n"+s[k:]
open(F+'volta.js','w',encoding='utf8').write(s)
# 58b / 58c cartões
s=open(F+'cupom.js',encoding='utf8').read();i=s.index("function mail(c, es, am) {");j=s.index("module.exports = {",i)
s=s[:i]+'''function mail(c, es, am) {
  const n = c.pct + '%', l = 'https://lafouch.com/?t=' + encodeURIComponent(c.cod);
  const dt = (x) => new Date(x).toLocaleDateString(es ? 'es-PY' : 'pt-BR', { timeZone: 'America/Asuncion' });
  const val = (x, loja) => x.fim ? (es ? 'Válido hasta ' : 'Vale até ') + dt(x.fim) + (loja ? ' · ' + (es ? 'en lafouch.com y en la tienda' : 'em lafouch.com e na loja') : '') : '';
  const bv = c.tipo === 'bv', fiel = c.tipo === 'fiel';
  // S393 (esboços 58b/58c): assuntos mais curtos; o molde é o de todos os e-mails
  const tit = fiel ? (es ? 'Tu regalo de cliente fiel: ' + n + ' en tu próxima compra' : 'Seu presente de cliente fiel: ' + n + ' na próxima compra') : bv ? (es ? '¡Bienvenida a La Fouch! ' + n + ' en tu primera compra' : 'Bem-vinda à La Fouch: ' + n + ' na primeira compra') : (es ? 'Tu tarjeta: ' + n + ' en tu próxima compra' : 'Seu cartão: ' + n + ' na próxima compra');
  const h1 = fiel ? (es ? 'Gracias por ' + E.I('volver') : 'Obrigada por ' + E.I('voltar')) : bv ? (es ? 'Bienvenida a ' + E.I('La Fouch') : 'Bem-vinda à ' + E.I('La Fouch')) : (es ? 'Tu ' + E.I('tarjeta') : 'Seu ' + E.I('cartão'));
  const intro = fiel ? (es ? 'Sos cliente fiel. Tu regalo para la próxima compra:' : 'Você é cliente fiel. Seu presente para a próxima compra:') : bv ? (es ? 'Tu regalo para la primera compra:' : 'Seu presente para a primeira compra:') : (es ? 'Tu regalo para la próxima compra:' : 'Seu presente para a próxima compra:');
  const rot = es ? 'TARJETA REGALO' : 'CARTÃO PRESENTE';
  const regra = E.PQ(es ? 'Un código por compra. No se suma a OFERTA ni a “Llevá 2”: se aplica el descuento mayor.' : 'Um código por compra. Não soma com OFERTA nem com “Leve 2”: vale o maior desconto.');
  let amiga = '';
  if (am) {
    const la = 'https://lafouch.com/?t=' + encodeURIComponent(am.cod);
    const zap = 'https://wa.me/?text=' + encodeURIComponent((es ? 'Te regalo 10% en tu primera compra en La Fouch. Código ' : 'Um presente para você: 10% na primeira compra na La Fouch. Código ') + am.cod + ' · ' + la);
    amiga = E.FIO() + E.P(es ? 'Y una para compartir: tu amiga gana 10% en su primera compra y vos ganás otra tarjeta.' : 'E um para compartilhar: sua amiga ganha 10% na primeira compra e você ganha outro cartão.') +
      E.cartao(rot, es ? '10% para tu amiga' : '10% para sua amiga', am.cod, val(am, false), false) + E.LK(es ? 'Enviar a una amiga' : 'Enviar para uma amiga', zap);
  }
  return {
    to: c.email,
    subject: tit,
    html: E.molde(h1, E.P(intro) + E.cartao(rot, n + (bv ? (es ? ' en tu primera compra' : ' na primeira compra') : (es ? ' en tu próxima compra' : ' na próxima compra')), c.cod, val(c, true), true) + E.B(es ? 'Usar ahora' : 'Usar agora', l) + amiga + regra),
  };
}
'''+s[j:]
k=s.index('\n',s.index("require('crypto')"))+1
s=s[:k]+"const E = require('./email');\n"+s[k:]
open(F+'cupom.js','w',encoding='utf8').write(s)
# 58f código do atacado
ed('atacado.js',[("""if (envia) await envia({ to: c.email, subject: 'La Fouch · tu código ' + cod, html: '<p>Tu código para entrar al catálogo mayorista de La Fouch: <b style="font-size:22px;letter-spacing:3px">' + cod + '</b></p><p>Vale 10 minutos.</p>' });""",
 """if (envia) await envia({ to: c.email, subject: cod + ' es tu código de La Fouch', html: E.molde('Tu código ' + E.I('mayorista'), E.P('Usá este código para entrar al catálogo mayorista:') + E.codigo(cod) + E.PQ('Vale por 10 minutos. Si no fuiste vos, ignorá este e-mail.')) });""")])
s=open(F+'atacado.js',encoding='utf8').read();k=s.index('\n',s.index("require('crypto')"))+1
s=s[:k]+"const E = require('./email');\n"+s[k:];open(F+'atacado.js','w',encoding='utf8').write(s)
print('ok')
