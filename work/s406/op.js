// S406 · 73: cartão de Halloween parecido demais com o vinho da La Fouch? Opções (pedido do dono 17/11 11:53). Nada implementado.
const fs=require('fs'),E=require('/home/claude/lafouch/functions/email.js');
E.EV.hA={gr:'linear-gradient(135deg,#f08a3c 0%,#d2661c 50%,#9c4410 100%)',bg:'#d2661c',fio:'rgba(43,16,48,.55)',num:'#2a1530',tx:'#2a1530',sub:'#5a2a14',logo:'cartao-vinho.png'};
E.EV.hB={gr:'linear-gradient(135deg,#1f1a22 0%,#100c12 60%,#050406 100%)',bg:'#100c12',fio:'rgba(240,138,60,.9)',num:'#f08a3c',tx:'#f3e9f5',sub:'#cdbcd3',logo:'cartao-ev-halloween.png'};
E.EV.hC={gr:'linear-gradient(135deg,#7b4bb0 0%,#4b2a78 55%,#2b1648 100%)',bg:'#4b2a78',fio:'rgba(240,138,60,.85)',num:'#f6a25c',tx:'#ffffff',sub:'#ddd0ef',logo:'cartao-ev-halloween.png'};
const c=(o)=>E.luxo(Object.assign({rot:'CUPOM DO EVENTO',pct:'10%',tit:'de desconto · Halloween',nome:'PARA TODOS',val:'ATÉ 31/10/2027'},o));
const L=[['La Fouch (vinho) · referência, não muda',E.luxo({tema:'vinho',rot:'CARTÃO PRESENTE',pct:'10%',tit:'na próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'})],
 ['Hoje · Halloween (roxo escuro e laranja)',c({ev:'halloween'})],
 ['A · abóbora (laranja, letra roxa) — recomendo',c({ev:'hA'})],
 ['B · noite (quase preto e laranja)',c({ev:'hB'})],
 ['C · violeta vivo e laranja',c({ev:'hC'})]];
fs.writeFileSync('/tmp/s406/op.json',JSON.stringify(L));console.log('ok');
