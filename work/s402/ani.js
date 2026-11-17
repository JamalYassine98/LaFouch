// S402 · esboços 67a (três opções do cartão de aniversário do Cliente VIP) e 67b (e-mail de aniversário). Pedido do dono 17/11 10:10. Nada implementado.
const fs=require('fs'),E=require('/home/claude/lafouch/functions/email.js');
const DOTS='radial-gradient(circle at 30% 40%,rgba(214,178,116,.26) 0 1.1px,transparent 1.7px) 0 0/34px 34px,';
E.EV.aniA={gr:DOTS+'linear-gradient(135deg,#2b2330 0%,#17121a 55%,#0c090e 100%)',bg:'#17121a',fio:'rgba(214,178,116,.8)',num:'#e9d3a6',tx:'#ffffff',sub:'#c9bfc6',logo:'cartao-ouro.png'};
E.EV.aniB={gr:'radial-gradient(circle at 30% 40%,rgba(169,133,74,.24) 0 1.1px,transparent 1.7px) 0 0/34px 34px,linear-gradient(135deg,#fffdf8 0%,#f3ecdf 60%,#e9dcc3 100%)',bg:'#f6f2ea',fio:'rgba(168,133,74,.85)',num:'#8d703e',tx:'#1f1d1a',sub:'#66625a',logo:'cartao-ev-anonovo.png'};
E.EV.aniC={gr:'radial-gradient(circle at 30% 40%,rgba(141,58,105,.16) 0 1.1px,transparent 1.7px) 0 0/34px 34px,linear-gradient(135deg,#fbeef1 0%,#f1d6dd 60%,#e8c2cc 100%)',bg:'#f1d6dd',fio:'rgba(141,58,105,.55)',num:'#8d3a69',tx:'#2a1224',sub:'#7a5a68',logo:'cartao-vinho.png'};
// o confete precisa do atalho "background:" (background-image não aceita o tamanho do ladrilho)
const card=(ev)=>{const t=E.EV[ev];return E.luxo({ev,rot:'FELIZ ANIVERSÁRIO',pct:'10%',tit:'presente de aniversário',nome:'CARLOS BENÍTEZ',val:'VALE ATÉ 16/06/2027'}).replace('background:'+t.bg+';background-image:'+t.gr,'background:'+t.gr)};
fs.writeFileSync('/tmp/s402/op.json',JSON.stringify([['A · preto com confete dourado (recomendo)','aniA'],['B · champanhe e dourado','aniB'],['C · rosé e vinho','aniC']].map(x=>({n:x[0],html:card(x[1])}))));
const L=[{arq:'67b-email-aniversario-vip',nome:'aniversário do Cliente VIP',hoje:null,nota:'Hoje ninguém recebe presente de aniversário.<br><br>O cadastro só guarda a data de nascimento.',
 sub:['Hoje: nenhum e-mail.','Proposta: só para o Cliente VIP, no dia do aniversário. Cartão de 10% (opção A), válido por 30 dias, sem código à vista.'],
 assunto:'Feliz aniversário · um presente da La Fouch',
 html:E.molde('Feliz '+E.I('aniversário'),E.P('Carlos, hoje quem dá o presente somos nós. Para comemorar, um cartão só seu:')+card('aniA')+E.B('Usar agora','#')+E.PQ('O desconto entra sozinho no seu carrinho. Não vale para peças em OFERTA nem para o “Leve 2”.'))}];
fs.writeFileSync('/tmp/s402/e.json',JSON.stringify(L));console.log('ok');
