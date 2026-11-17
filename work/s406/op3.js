// S406 · 73c: mais opções para o cartão da La Fouch (pedido do dono 17/11 12:00). Nada implementado.
const fs=require('fs'),E=require('/home/claude/lafouch/functions/email.js');
const P=(gr,bg,fio,num,tx,sub,logo)=>({gr,bg,fio,num,tx,sub,logo:logo||'cartao-ouro.png'});
E.EV.vA=P('linear-gradient(135deg,#a34a80 0%,#8d3a69 50%,#6a2850 100%)','#8d3a69','rgba(233,211,166,.7)','#f1dfb8','#ffffff','#f0dbe6');
E.EV.vD=P('linear-gradient(135deg,#6b2752 0%,#4e1a3c 55%,#341027 100%)','#4e1a3c','rgba(232,185,201,.75)','#f2c9d6','#ffffff','#e6c9d5');
E.EV.vE=P('repeating-linear-gradient(135deg,rgba(233,211,166,.09) 0 1px,transparent 1px 9px),linear-gradient(135deg,#a34a80 0%,#8d3a69 50%,#6a2850 100%)','#8d3a69','rgba(233,211,166,.75)','#f1dfb8','#ffffff','#f0dbe6');
E.EV.vF=P('linear-gradient(135deg,#8d3a69 0%,#8d3a69 100%)','#8d3a69','rgba(233,211,166,.85)','#e9d3a6','#ffffff','#f0dbe6');
E.EV.vG=P('linear-gradient(135deg,#c98aa8 0%,#a85a86 45%,#7e2f5e 100%)','#a85a86','rgba(255,240,214,.8)','#fff3dc','#ffffff','#fbe6ef');
E.EV.vH=P('linear-gradient(135deg,#f0c9c4 0%,#dca39f 50%,#c08480 100%)','#dca39f','rgba(122,40,72,.45)','#6e2348','#3a1424','#6e3a4c','cartao-vinho.png');
E.EV.vI=P('radial-gradient(circle at 30% 20%,#b0548a 0%,#8d3a69 40%,#5a1f43 100%)','#8d3a69','rgba(233,211,166,.75)','#f1dfb8','#ffffff','#f0dbe6');
const N={rot:'CARTÃO PRESENTE',pct:'10%',tit:'na próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'},c=(ev)=>E.luxo(Object.assign({ev},N));
const L=[['A · vinho do site (já mostrada)',c('vA')],['D · ameixa com ouro rosé',c('vD')],['E · vinho com riscas finas',c('vE')],['F · vinho liso, fosco',c('vF')],['G · vinho que clareia para rosé',c('vG')],['H · ouro rosé, letra vinho',c('vH')],['I · vinho aveludado (luz no canto)',c('vI')],
 ['Para comparar · Dia das Mães',E.luxo({ev:'maes',rot:'CUPOM DO EVENTO',pct:'10%',tit:'de desconto · Dia das Mães',nome:'PARA TODOS',val:'ATÉ 10/05/2027'})],['Para comparar · Halloween',E.luxo({ev:'halloween',rot:'CUPOM DO EVENTO',pct:'10%',tit:'de desconto · Halloween',nome:'PARA TODOS',val:'ATÉ 31/10/2027'})],['Para comparar · VIP',E.luxo({tema:'preto',rot:'CARTÃO VIP',pct:'20%',tit:'na sua próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'})]];
// riscas: precisa do atalho "background:" para o ladrilho
fs.writeFileSync('/tmp/s406/op3.json',JSON.stringify(L.map(([n,h])=>[n,h.replace('background:'+E.EV.vE.bg+';background-image:'+E.EV.vE.gr,'background:'+E.EV.vE.gr)])));console.log('ok');
