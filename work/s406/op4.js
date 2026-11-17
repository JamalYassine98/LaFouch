// S406 · 73d: cor do logo no cartão padrão da La Fouch (o dourado parece laranja; pedido do dono 17/11 12:03). Nada implementado.
const fs=require('fs'),E=require('/home/claude/lafouch/functions/email.js');
const A=(logo,num)=>({gr:'linear-gradient(135deg,#a34a80 0%,#8d3a69 50%,#6a2850 100%)',bg:'#8d3a69',fio:'rgba(246,226,236,.6)',num:num||'#f1dfb8',tx:'#ffffff',sub:'#f0dbe6',logo});
E.EV.l0=A('cartao-ouro.png');E.EV.l1=A('LOGO-branco','#ffffff');E.EV.l2=A('LOGO-rose','#f6e2ec');E.EV.l3=A('LOGO-champ','#efe3cc');
E.EV.l4={gr:'linear-gradient(135deg,#fffafc 0%,#f6e6ee 60%,#efd8e3 100%)',bg:'#f6e6ee',fio:'rgba(141,58,105,.5)',num:'#8d3a69',tx:'#2a1224',sub:'#7a5a68',logo:'cartao-vinho.png'};
const N={rot:'CARTÃO PRESENTE',pct:'10%',tit:'na próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'},c=(ev)=>E.luxo(Object.assign({ev},N));
fs.writeFileSync('/tmp/s406/op4.json',JSON.stringify([['Hoje · logo dourado (parece laranja no vinho)',c('l0')],['1 · logo e número brancos — recomendo',c('l1')],['2 · logo e número rosé claro (o fundo do site)',c('l2')],['3 · logo e número champanhe claro',c('l3')],['4 · cartão claro com o logo vinho (as cores do logo de verdade)',c('l4')]]));console.log('ok');
