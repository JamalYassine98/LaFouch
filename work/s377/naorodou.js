// cruza a cobertura (funções que rodaram nos 320 testes) com as funções do app.js e soma por arquivo de src/
const fs=require('fs'),path=require('path');const acorn=require('/tmp/acn/node_modules/acorn'),walk=require('/tmp/acn/node_modules/acorn-walk');
const R='/home/claude/lafouch';const app=fs.readFileSync(R+'/www/app.js','utf8');
const cov=new Set();(process.argv.slice(2).length?process.argv.slice(2):[R+'/work/s377/cov_testes.json']).forEach(f=>JSON.parse(fs.readFileSync(f)).forEach(x=>cov.add(x)));
const ast=acorn.parse(app,{ecmaVersion:2022});
// mapa offset -> arquivo: procura o início de cada módulo no app.js
const fsn=fs.readdirSync(R+'/src').filter(f=>f.endsWith('.js')).sort();const ini=[];let p=0;
fsn.forEach(f=>{const t=fs.readFileSync(R+'/src/'+f,'utf8');const k=app.indexOf(t.slice(0,200),p);ini.push(k<0?p:k);p=(k<0?p:k)+Math.max(1,t.length-50)});
const arq=o=>{let i=0;for(let j=0;j<ini.length;j++)if(ini[j]<=o)i=j;return fsn[i]};
const fns=[];walk.full(ast,n=>{if(/Function/.test(n.type))fns.push(n)});
const pa={};let tot=0,nao=0;const lista=[];
fns.forEach(n=>{const l=app.slice(n.start,n.end).split('\n').length;const rod=cov.has(n.start)||(n.id&&cov.has(n.id.start))||[...Array(12).keys()].some(k=>cov.has(n.start-k)||cov.has(n.start+k));
  // só conta funções "de fora" (a de dentro de uma que não rodou já entra na conta dela)
  n._rod=rod;n._l=l});
fns.forEach(n=>{if(n._rod)return;const dentro=fns.some(o=>o!==n&&!o._rod&&o.start<=n.start&&o.end>=n.end);if(dentro)return;const f=arq(n.start);pa[f]=pa[f]||{n:0,l:0};pa[f].n++;pa[f].l+=n._l;nao+=n._l;lista.push([f,n.id?n.id.name:'(anônima)',n._l,app.slice(n.start,n.start+60).replace(/\n/g,' ')])});
console.log('funções no app:',fns.length,'· rodaram:',fns.filter(n=>n._rod).length,'· linhas dentro de funções que NÃO rodaram:',nao,'de',app.split('\n').length);
Object.entries(pa).sort((a,b)=>b[1].l-a[1].l).slice(0,40).forEach(([f,v])=>console.log('  ',String(v.l).padStart(5),'linhas',String(v.n).padStart(4),'funções ',f));
fs.writeFileSync(R+'/work/s377/naorodou.json',JSON.stringify(lista));
