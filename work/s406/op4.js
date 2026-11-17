// S406 · 73d: o logo do cartão (dourado #d6b274) parece laranja no vinho claro → logo champanhe (#f1dfb8, a cor do número). Nada implementado.
const fs=require('fs'),E=require('/home/claude/lafouch/functions/email.js');
const P=(gr,bg,logo,extra)=>Object.assign({gr,bg,fio:'rgba(233,211,166,.7)',num:'#f1dfb8',tx:'#ffffff',sub:'#f0dbe6',logo},extra||{});
const GA='linear-gradient(135deg,#a34a80 0%,#8d3a69 50%,#6a2850 100%)',GE='repeating-linear-gradient(135deg,rgba(233,211,166,.09) 0 1px,transparent 1px 9px),'+GA;
E.EV.a1=P(GA,'#8d3a69','cartao-ouro.png');E.EV.a2=P(GA,'#8d3a69','cartao-champanhe.png');E.EV.e1=P(GE,'#8d3a69','cartao-ouro.png');E.EV.e2=P(GE,'#8d3a69','cartao-champanhe.png');
const N={rot:'CARTÃO PRESENTE',pct:'10%',tit:'na próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'},c=(ev)=>E.luxo(Object.assign({ev},N)).replace('background:#8d3a69;background-image:'+E.EV[ev].gr,'background:'+E.EV[ev].gr);
fs.writeFileSync('/tmp/s406/op4.json',JSON.stringify([['A · logo dourado (como está)',c('a1')],['A · logo champanhe',c('a2')],['E · logo dourado (como está)',c('e1')],['E · logo champanhe',c('e2')]]));console.log('ok');
