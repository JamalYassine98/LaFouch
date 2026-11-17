// funções que NADA alcança: nem o código que roda ao abrir o app, nem botões (ACT), eventos ou temporizadores — só outras funções mortas.
const fs=require('fs'),path=require('path');const acorn=require('/tmp/acn/node_modules/acorn'),walk=require('/tmp/acn/node_modules/acorn-walk');
const R='/home/claude/lafouch',SRC=R+'/src',tira=process.argv.includes('--tira');const html=fs.readFileSync(R+'/www/index.html','utf8');
let voltas=0,total=[];
while(true){
const fsn=fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort();const txt=fsn.map(f=>fs.readFileSync(path.join(SRC,f),'utf8'));
const corpo=txt.join(''),pre='(function () {\n';const ast=acorn.parse(pre+corpo+'})();',{ecmaVersion:2022});
const ini=[];let a=0;txt.forEach(t=>{ini.push(a);a+=t.length});
const body=ast.body[0].expression.callee.body.body;
const decl={};const nomesDe=n=>{const s=new Set();walk.full(n,x=>{if(x.type==='Identifier')s.add(x.name);if(x.type==='Literal'&&typeof x.value==='string')(x.value.match(/[A-Za-z_$][\w$]*/g)||[]).forEach(w=>s.add(w))});return s};
// todas as declarações de função em qualquer nível que estejam direto no escopo do app (nível de cima)
body.forEach(n=>{if(n.type==='FunctionDeclaration')decl[n.id.name]=n});
const raiz=new Set();body.forEach(n=>{if(n.type!=='FunctionDeclaration')nomesDe(n).forEach(x=>raiz.add(x))});
(html.match(/[A-Za-z_$][\w$]*/g)||[]).forEach(w=>raiz.add(w));
const usa={};Object.entries(decl).forEach(([k,n])=>{usa[k]=nomesDe(n.body)});
const vivo=new Set();const pilha=[...raiz].filter(x=>decl[x]);pilha.forEach(x=>vivo.add(x));
while(pilha.length){const k=pilha.pop();usa[k].forEach(x=>{if(decl[x]&&!vivo.has(x)){vivo.add(x);pilha.push(x)}})}
const mortas=Object.keys(decl).filter(k=>!vivo.has(k));
if(!mortas.length)break;
mortas.forEach(k=>{const n=decl[k];const s=n.start-pre.length;const i=ini.filter(x=>x<=s).length-1;total.push({nome:k,arq:fsn[i],linhas:corpo.slice(s,n.end-pre.length).split('\n').length})});
if(!tira)break;
const porArq={};mortas.forEach(k=>{const n=decl[k];const s=n.start-pre.length,e=n.end-pre.length;const i=ini.filter(x=>x<=s).length-1;(porArq[i]=porArq[i]||[]).push([s-ini[i],e-ini[i]])});
Object.keys(porArq).forEach(i=>{let t=txt[i];porArq[i].sort((x,y)=>y[0]-x[0]).forEach(([s,e])=>{let s2=s;const antes=t.slice(0,s);const m=antes.match(/(\n[ \t]*\/\/[^\n]*)+\n[ \t]*$/);if(m)s2=s-m[0].length+1;else{const m2=antes.match(/\n[ \t]*$/);if(m2)s2=s-m2[0].length+1}let e2=e;if(t[e2]===';')e2++;if(t[e2]==='\n')e2++;t=t.slice(0,s2)+t.slice(e2)});fs.writeFileSync(path.join(SRC,fsn[i]),t)});
if(++voltas>15)break;}
const lin=total.reduce((s,x)=>s+x.linhas,0);console.log((tira?'removidas ':'sem alcance ')+total.length+' funções, '+lin+' linhas');
const pa={};total.forEach(x=>pa[x.arq]=(pa[x.arq]||0)+x.linhas);Object.entries(pa).sort((a,b)=>b[1]-a[1]).forEach(([f,n])=>console.log('  ',n,f));
console.log(total.map(x=>x.nome).join(' '));
