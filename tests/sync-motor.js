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
console.log(ok+' ok '+bad+' falhas');process.exit(bad?1:0);
