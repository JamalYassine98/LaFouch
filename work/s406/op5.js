// S406 · 73e: o cartão ORIGINAL (vinho escuro) com logo e número brancos (pedido do dono 17/11 12:06). Nada implementado.
const fs=require('fs'),E=require('/home/claude/lafouch/functions/email.js');
const O={gr:'linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%)',bg:'#3a1830',tx:'#ffffff',sub:'#d9c3d0'};
E.EV.o1=Object.assign({},O,{fio:'rgba(214,178,116,.6)',num:'#ffffff',logo:'LOGO-branco'});
E.EV.o2=Object.assign({},O,{fio:'rgba(246,226,236,.55)',num:'#ffffff',logo:'LOGO-branco'});
const N={rot:'CARTÃO PRESENTE',pct:'10%',tit:'na próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'},c=(o)=>E.luxo(Object.assign(o,N));
fs.writeFileSync('/tmp/s406/op5.json',JSON.stringify([['Hoje · original (logo e número dourados)',c({tema:'vinho'})],['Halloween · para comparar',E.luxo({ev:'halloween',rot:'CUPOM DO EVENTO',pct:'10%',tit:'de desconto · Halloween',nome:'PARA TODOS',val:'ATÉ 31/10/2027'})],['Original com branco · fio dourado',c({ev:'o1'})],['Original com branco · fio rosé',c({ev:'o2'})]]));console.log('ok');
