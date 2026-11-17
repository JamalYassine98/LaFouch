// S377: acha e (com --tira) remove funções declaradas que nada no app usa. Repete até não sobrar nenhuma.
const fs=require('fs'),path=require('path');const acorn=require('/tmp/acn/node_modules/acorn'),walk=require('/tmp/acn/node_modules/acorn-walk');
const R='/home/claude/lafouch',SRC=path.join(R,'src'),tira=process.argv.includes('--tira');
const html=fs.readFileSync(path.join(R,'www/index.html'),'utf8');
let total=[],volta=0;
while(true){
  const fsn=fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort();const txt=fsn.map(f=>fs.readFileSync(path.join(SRC,f),'utf8'));
  const corpo=txt.join('');const pre='(function () {\n';const ast=acorn.parse(pre+corpo+'})();',{ecmaVersion:2022});
  const ini=[];let a=0;txt.forEach(t=>{ini.push(a);a+=t.length});
  const usos={},strs=new Set();
  walk.fullAncestor(ast,(n,anc)=>{ if(n.type==='Identifier'){const p=anc[anc.length-2];if(p&&p.type==='FunctionDeclaration'&&p.id===n)return;if(p&&p.type==='MemberExpression'&&p.property===n&&!p.computed)return;if(p&&p.type==='Property'&&p.key===n&&!p.computed&&!p.shorthand)return;usos[n.name]=(usos[n.name]||0)+1}
    if(n.type==='Literal'&&typeof n.value==='string'){(n.value.match(/[A-Za-z_$][\w$]*/g)||[]).forEach(w=>strs.add(w))}
    if(n.type==='TemplateElement'){(n.value.raw.match(/[A-Za-z_$][\w$]*/g)||[]).forEach(w=>strs.add(w))}});
  const mortas=[];
  walk.full(ast,n=>{if(n.type==='FunctionDeclaration'&&n.id&&!usos[n.id.name]&&!strs.has(n.id.name)&&!new RegExp('\\b'+n.id.name+'\\b').test(html))mortas.push(n)});
  if(!mortas.length)break;
  // só as de fora (uma morta dentro de outra morta some junto)
  const fora=mortas.filter(m=>!mortas.some(o=>o!==m&&o.start<=m.start&&o.end>=m.end));
  fora.forEach(m=>{const s=m.start-pre.length;const i=ini.filter(x=>x<=s).length-1;total.push({nome:m.id.name,arq:fsn[i],linhas:corpo.slice(m.start-pre.length,m.end-pre.length).split('\n').length})});
  if(!tira)break;
  // remove de trás para frente, por arquivo; leva junto comentários de linha logo acima
  const porArq={};fora.forEach(m=>{const s=m.start-pre.length,e=m.end-pre.length;const i=ini.filter(x=>x<=s).length-1;(porArq[i]=porArq[i]||[]).push([s-ini[i],e-ini[i]])});
  Object.keys(porArq).forEach(i=>{let t=txt[i];porArq[i].sort((x,y)=>y[0]-x[0]).forEach(([s,e])=>{let s2=s;const antes=t.slice(0,s);const m=antes.match(/(\n[ \t]*\/\/[^\n]*)+\n[ \t]*$/);if(m)s2=s-m[0].length+1;else{const m2=antes.match(/\n[ \t]*$/);if(m2)s2=s-m2[0].length+1}let e2=e;if(t[e2]===';')e2++;if(t[e2]==='\n')e2++;t=t.slice(0,s2)+t.slice(e2)});fs.writeFileSync(path.join(SRC,fsn[i]),t)});
  if(++volta>12)break;
}
const lin=total.reduce((a,x)=>a+x.linhas,0);
console.log((tira?'removidas ':'mortas ')+total.length+' funções, '+lin+' linhas');
const pa={};total.forEach(x=>pa[x.arq]=(pa[x.arq]||0)+x.linhas);Object.entries(pa).sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([f,n])=>console.log('  ',n,f));
fs.writeFileSync('/home/claude/lafouch/work/s377/mortas.json',JSON.stringify(total,null,0));
