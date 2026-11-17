// S406 · 73f: o cartão ORIGINAL, só o LOGO branco (pedido do dono 17/11 12:08); antes 73e: (vinho escuro) com logo e número brancos (pedido do dono 17/11 12:06). Nada implementado.
const fs=require('fs'),E=require('/home/claude/lafouch/functions/email.js');
const O={gr:'linear-gradient(135deg,#2b2330 0%,#17121a 55%,#0c090e 100%)',bg:'#17121a',tx:'#ffffff',sub:'#c9bfc6'};
E.EV.o1=Object.assign({},O,{fio:'rgba(214,178,116,.75)',num:'#e9d3a6',logo:'LOGO-branco'});E.EV.o3=Object.assign({},O,{fio:'rgba(214,178,116,.6)',num:'#ffffff',logo:'LOGO-branco'});
E.EV.o1x={gr:'linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%)',bg:'#3a1830',tx:'#ffffff',sub:'#d9c3d0',fio:'rgba(214,178,116,.6)',num:'#e9d3a6',logo:'LOGO-branco'};E.EV.o2=Object.assign({},O,{fio:'rgba(246,226,236,.55)',num:'#ffffff',logo:'LOGO-branco'});
const N={rot:'CARTÃO VIP',pct:'20%',tit:'na sua próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'},c=(o)=>E.luxo(Object.assign(o,N));
fs.writeFileSync('/tmp/s406/op7.json',JSON.stringify([['Hoje · VIP (logo dourado)',c({tema:'preto'})],['VIP · só o logo branco',c({ev:'o1'})],['Cartão da loja aprovado (73f) · para comparar',E.luxo({ev:'o1x',rot:'CARTÃO PRESENTE',pct:'10%',tit:'na próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'})]]));console.log('ok');
