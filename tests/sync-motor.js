const fs=require('fs');const code=fs.readFileSync('/home/claude/lafouch/src/05-sync.js','utf8');
global.window={};global.location={hash:'#test'};new Function(code)();const Y=window.__sync;
let ok=0,bad=0;const t=(n,c)=>{console.log((c?'  ok  ':' FALHA ')+n);c?ok++:bad++};
const novo=()=>({items:[{tipo:'sol',ref:'A',cor:'P',qty:3,custo:10},{tipo:'sol',ref:'B',cor:'R',qty:1,custo:10}],cash:{pyg:1000,usd:0,brl:0},sales:[],exp:[],dlog:[],elog:[],cambios:[],compras:[],descartes:[],retiradas:[],melhUso:[],cpay:[],imprev:[]});
const clone=o=>JSON.parse(JSON.stringify(o));
// dois aparelhos parte do mesmo estado
const base=novo();let A=clone(base),B=clone(base);let sA=Y.snap(A),sB=Y.snap(B);let seqA=0,seqB=0;const fA={},fB={};
// A vende 2 de A, B vende 2 de A ao mesmo tempo (estoque 3 → -1)
A.items[0].qty-=2;A.cash.pyg+=500;A.sales.unshift({id:'V-A-1',ts:1000,price:500});
B.items[0].qty-=2;B.cash.pyg+=700;B.sales.unshift({id:'V-B-1',ts:1001,price:700});
let dA=Y.diff(sA,A,'A',seqA),dB=Y.diff(sB,B,'B',seqB);sA=dA.snap;sB=dB.snap;
t('movimentos de estoque saem como diferença (-2)',dA.ops.some(o=>o.k==='q'&&o.d===-2)&&dB.ops.some(o=>o.k==='q'&&o.d===-2));
let rA=Y.aplica(A,sA,clone(dB.ops),fA),rB=Y.aplica(B,sB,clone(dA.ops),fB);
t('os dois chegam ao mesmo estoque (-1) sem perder venda',A.items[0].qty===-1&&B.items[0].qty===-1);
t('caixa soma as duas vendas',A.cash.pyg===2200&&B.cash.pyg===2200);
t('as duas vendas aparecem nos dois, na mesma ordem',A.sales.map(s=>s.id).join()==='V-B-1,V-A-1'&&B.sales.map(s=>s.id).join()==='V-B-1,V-A-1');
t('estoque negativo é avisado',rA.neg.length===1&&rB.neg.length===1);
// aplicar de novo não muda nada
let r2=Y.aplica(A,sA,clone(dB.ops),fA);t('aplicar o mesmo movimento duas vezes não muda nada',r2.n===0&&A.items[0].qty===-1&&A.sales.length===2);
// o que veio do outro não volta como se fosse meu
let d2=Y.diff(sA,A,'A',dA.seq);t('movimento recebido não é reenviado',d2.ops.length===0);
// ordem diferente
let C=clone(base),sC=Y.snap(C),fC={};Y.aplica(C,sC,clone(dB.ops.concat(dA.ops).reverse()),fC);
t('ordem de chegada não importa',C.items[0].qty===-1&&C.cash.pyg===2200&&C.sales.length===2);
// item novo viaja com a ficha
A.items.push({tipo:'sol',ref:'N',cor:'X',qty:4,custo:5});let d3=Y.diff(sA,A,'A',d2.seq);sA=d3.snap;
Y.aplica(B,sB,clone(d3.ops),fB);t('item novo chega com a ficha e a quantidade',B.items.filter(i=>i.ref==='N')[0]&&B.items.filter(i=>i.ref==='N')[0].qty===4);
// entrada de estoque em um e venda em outro
let sA2=sA;A.items[1].qty+=5;B.items[1].qty-=1;let e1=Y.diff(sA2,A,'A',d3.seq),e2=Y.diff(sB,B,'B',dB.seq);sA=e1.snap;sB=e2.snap;
Y.aplica(A,sA,clone(e2.ops),fA);Y.aplica(B,sB,clone(e1.ops),fB);t('entrada (+5) e venda (-1) em aparelhos diferentes: os dois ficam com 5',A.items[1].qty===5&&B.items[1].qty===5);
// ---- listas com conteúdo (despesas etc.), apagar, editar, configurações, proteção
{const b=novo();b.imprev=[{ts:1,desc:'Vitrine',valor:60000}];b.cambios=[];b.faixas=[{id:'f1',margem:30}];
 let X=clone(b),Z=clone(b),sX=Y.snap(X),sZ=Y.snap(Z),fX={},fZ={},qX=0;
 X.imprev.push({ts:5,desc:'Tinta',valor:15000}); X.elog.push({ts:6,ref:'A',qty:2}); X.faixas[0].margem=35;
 let dx=Y.diff(sX,X,'X',0);sX=dx.snap;Y.aplica(Z,sZ,clone(dx.ops),fZ);
 t('despesa nova chega ao outro aparelho',Z.imprev.length===2&&Z.elog.length===1);
 t('configuração alterada chega (última alteração vale)',Z.faixas[0].margem===35);
 // editar uma linha: vira remover a antiga + adicionar a nova
 Z.imprev.find(e=>e.desc==='Tinta').valor=20000;let dz=Y.diff(sZ,Z,'Z',0);sZ=dz.snap;Y.aplica(X,sX,clone(dz.ops),fX);
 t('linha editada em um aparelho aparece editada no outro (sem duplicar)',X.imprev.length===2&&X.imprev.some(e=>e.valor===20000)&&!X.imprev.some(e=>e.valor===15000));
 // apagar
 Z.imprev.splice(Z.imprev.findIndex(e=>e.desc==='Vitrine'),1);dz=Y.diff(sZ,Z,'Z',9);sZ=dz.snap;Y.aplica(X,sX,clone(dz.ops),fX);
 t('linha apagada em um aparelho some no outro',X.imprev.length===1&&X.imprev[0].desc==='Tinta');
 // proteção: apagar demais de uma vez não se espalha
 for(let i=0;i<15;i++)X.compras.push({ts:100+i,desc:'c'+i,usd:1});dx=Y.diff(sX,X,'X',20);sX=dx.snap;Y.aplica(Z,sZ,clone(dx.ops),fZ);
 X.compras=[];dx=Y.diff(sX,X,'X',60);
 t('apagar 15 registros de uma vez NÃO é enviado e gera aviso',!dx.ops.some(o=>o.k==='rem')&&/NÃO foi enviado/.test(dx.aviso)&&Z.compras.length===15);
 // mesma configuração mudada nos dois: vale a mais recente
 const P=clone(b),Q=clone(b);let sP=Y.snap(P),sQ=Y.snap(Q),fP={},fQ={};P.faixas[0].margem=40;Q.faixas[0].margem=50;
 let dp=Y.diff(sP,P,'P',0),dq=Y.diff(sQ,Q,'Q',0);dq.ops.forEach(o=>o.ts=dp.ops[0].ts+5);Q.syncCfgTs.faixas=dp.ops[0].ts+5;
 Y.aplica(P,dp.snap,clone(dq.ops),fP);Y.aplica(Q,dq.snap,clone(dp.ops),fQ);
 t('configuração mudada nos dois: vale a mais recente nos dois',P.faixas[0].margem===50&&Q.faixas[0].margem===50);
}
// ---- clientes (cadastro editável: vale a última alteração de cada cliente)
{const b=novo();b.clientes=[{id:1,nome:'Maria',tel:'0981'}];let X=clone(b),Z=clone(b),sX=Y.snap(X),sZ=Y.snap(Z),fX={},fZ={};
 X.clientes.push({id:5000001,nome:'João',tel:'0982'});Z.clientes[0].tel='0999';
 let dx=Y.diff(sX,X,'X',0),dz=Y.diff(sZ,Z,'Z',0);sX=dx.snap;sZ=dz.snap;Y.aplica(Z,sZ,clone(dx.ops),fZ);Y.aplica(X,sX,clone(dz.ops),fX);
 t('cliente novo em um e telefone editado no outro: os dois ficam com tudo',X.clientes.length===2&&Z.clientes.length===2&&X.clientes.find(c=>c.id===1).tel==='0999'&&Z.clientes.find(c=>c.id===5000001).nome==='João');
 X.clientes.find(c=>c.id===1).nome='Maria S.';Z.clientes.find(c=>c.id===1).nome='Maria Souza';
 dx=Y.diff(sX,X,'X',9);dz=Y.diff(sZ,Z,'Z',9);dz.ops.forEach(o=>o.ts=dx.ops[0].ts+5);Z.syncPutTs['clientes:1']=dx.ops[0].ts+5;
 Y.aplica(Z,dz.snap,clone(dx.ops),fZ);Y.aplica(X,dx.snap,clone(dz.ops),fX);
 t('mesmo cliente editado nos dois: vale a edição mais recente',X.clientes.find(c=>c.id===1).nome==='Maria Souza'&&Z.clientes.find(c=>c.id===1).nome==='Maria Souza');
}
// ---- pedidos: sem as fotos pesadas, mantendo a foto local
{const b=novo();b.pedidos=[];let X=clone(b),Z=clone(b),sX=Y.snap(X),sZ=Y.snap(Z),fX={},fZ={};
 X.pedidos.push({id:'abc1',num:'K7Q2',st:'novo',pg:'comp',comp:'data:image/jpeg;base64,AAAA',itens:[{ref:'A',q:1}]});
 let dx=Y.diff(sX,X,'X',0);sX=dx.snap;
 t('pedido viaja sem a foto do comprovante',!JSON.stringify(dx.ops).includes('AAAA'));
 Y.aplica(Z,sZ,clone(dx.ops),fZ);t('o outro aparelho recebe o pedido',Z.pedidos.length===1&&Z.pedidos[0].num==='K7Q2'&&!Z.pedidos[0].comp);
 Z.pedidos[0].comp='data:image/jpeg;base64,ZZZZ';Z.pedidos[0].assumido={ap:'Z',nome:'PC da loja',ts:5};let dz=Y.diff(sZ,Z,'Z',0);sZ=dz.snap;Y.aplica(X,sX,clone(dz.ops),fX);
 t('"assumido por" chega e a foto local do outro não é apagada',X.pedidos[0].assumido&&X.pedidos[0].assumido.nome==='PC da loja'&&X.pedidos[0].comp.includes('AAAA'));
}
console.log(ok+' ok '+bad+' falhas');process.exit(bad?1:0);
