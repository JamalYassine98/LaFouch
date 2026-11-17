// S406 · 73b: o dono prefere mudar o cartão da La Fouch (vinho) e manter o de Halloween (17/11 11:55). Opções. Nada implementado.
const fs=require('fs'),E=require('/home/claude/lafouch/functions/email.js');
E.EV.vA={gr:'linear-gradient(135deg,#a34a80 0%,#8d3a69 50%,#6a2850 100%)',bg:'#8d3a69',fio:'rgba(233,211,166,.7)',num:'#f1dfb8',tx:'#ffffff',sub:'#f0dbe6',logo:'cartao-ouro.png'};
E.EV.vB={gr:'linear-gradient(135deg,#7a2236 0%,#5c1628 55%,#3a0c19 100%)',bg:'#5c1628',fio:'rgba(214,178,116,.7)',num:'#e9d3a6',tx:'#ffffff',sub:'#e3c6cd',logo:'cartao-ouro.png'};
E.EV.vC={gr:'linear-gradient(135deg,#fbf1f5 0%,#f3dfe8 60%,#ead0dc 100%)',bg:'#f3dfe8',fio:'rgba(141,58,105,.55)',num:'#8d3a69',tx:'#2a1224',sub:'#7a5a68',logo:'cartao-vinho.png'};
const N={rot:'CARTÃO PRESENTE',pct:'10%',tit:'na próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'};
const L=[['Hoje · La Fouch (vinho escuro)',E.luxo(Object.assign({tema:'vinho'},N))],['Halloween · não muda',E.luxo({ev:'halloween',rot:'CUPOM DO EVENTO',pct:'10%',tit:'de desconto · Halloween',nome:'PARA TODOS',val:'ATÉ 31/10/2027'})],
 ['A · vinho do site — recomendo',E.luxo(Object.assign({ev:'vA'},N))],['B · bordô (vinho tinto, menos roxo)',E.luxo(Object.assign({ev:'vB'},N))],
 ['C · rosé claro (o fundo do site)',E.luxo(Object.assign({ev:'vC'},N))],['VIP · não muda',E.luxo({tema:'preto',rot:'CARTÃO VIP',pct:'20%',tit:'na sua próxima compra',nome:'MARÍA GONZÁLEZ',val:'ATÉ 17/03/2027'})]];
fs.writeFileSync('/tmp/s406/op2.json',JSON.stringify(L));console.log('ok');
