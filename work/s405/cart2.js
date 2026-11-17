// S405 · 72a/72b: todos os cartões na temática do evento (Natal), menos VIP e aniversário. Pedido do dono 17/11 11:31. Nada implementado.
const fs=require('fs'),E=require('/home/claude/lafouch/functions/email.js');
const DOTS='radial-gradient(circle at 30% 40%,rgba(214,178,116,.26) 0 1.1px,transparent 1.7px) 0 0/34px 34px,';
E.EV.aniA={gr:DOTS+'linear-gradient(135deg,#2b2330 0%,#17121a 55%,#0c090e 100%)',bg:'#17121a',fio:'rgba(214,178,116,.8)',num:'#e9d3a6',tx:'#ffffff',sub:'#c9bfc6',logo:'cartao-ouro.png'};
const N='MARÍA GONZÁLEZ',V='ATÉ 17/03/2027',GR=(h)=>h.replace(/font:500 42px\/1 ([^;]+);color:([^;]+);margin:18px 0 2px;letter-spacing:.01em/,'font:500 22px/1.2 $1;color:$2;margin:16px 0 4px;letter-spacing:.01em');
const ani=(h)=>h.replace('background:'+E.EV.aniA.bg+';background-image:'+E.EV.aniA.gr,'background:'+E.EV.aniA.gr);
// [tipo, sem evento, no Natal]
const L=[
 ['Cupom do evento',null,E.luxo({ev:'natal',rot:'CUPOM DO EVENTO',pct:'10%',tit:'de desconto · Natal',nome:'PARA TODOS',val:'ATÉ 25/12/2026'})],
 ['Cartão presente 10%',E.luxo({tema:'vinho',rot:'CARTÃO PRESENTE',pct:'10%',tit:'na próxima compra',nome:N,val:V}),E.luxo({ev:'natal',rot:'CARTÃO PRESENTE',pct:'10%',tit:'de Natal, na próxima compra',nome:N,val:V})],
 ['Cartão presente 15%',E.luxo({tema:'vinho',rot:'CARTÃO PRESENTE',pct:'15%',tit:'na próxima compra',nome:N,val:V}),E.luxo({ev:'natal',rot:'CARTÃO PRESENTE',pct:'15%',tit:'de Natal, na próxima compra',nome:N,val:V})],
 ['Cliente fiel',E.luxo({tema:'vinho',rot:'CLIENTE FIEL',pct:'10%',tit:'na próxima compra',nome:N,val:V}),E.luxo({ev:'natal',rot:'CLIENTE FIEL',pct:'10%',tit:'de Natal, na próxima compra',nome:N,val:V})],
 ['Presente especial',GR(E.luxo({tema:'preto',rot:'PRESENTE ESPECIAL',pct:'Na compra de um,<br>leve outro de presente',tit:'vale para uma compra',nome:N,val:V})),GR(E.luxo({ev:'natal',rot:'PRESENTE ESPECIAL',pct:'Na compra de um,<br>leve outro de presente',tit:'presente de Natal',nome:N,val:V}))],
 ['VIP · não muda',E.luxo({tema:'preto',rot:'CARTÃO VIP',pct:'20%',tit:'na sua próxima compra',nome:N,val:V}),E.luxo({tema:'preto',rot:'CARTÃO VIP',pct:'20%',tit:'na sua próxima compra',nome:N,val:V})],
 ['Aniversário · não muda',ani(E.luxo({ev:'aniA',rot:'FELIZ ANIVERSÁRIO',pct:'10%',tit:'presente de aniversário',nome:N,val:V})),ani(E.luxo({ev:'aniA',rot:'FELIZ ANIVERSÁRIO',pct:'10%',tit:'presente de aniversário',nome:N,val:V}))]];
fs.writeFileSync('/tmp/s405/c2.json',JSON.stringify(L));console.log(L.length);
