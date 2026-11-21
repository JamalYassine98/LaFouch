const acorn=require('acorn'),es=require('eslint-scope'),fs=require('fs');
const src=fs.readFileSync('tudo.js','utf8');const LINHA=+process.argv[2];
const ast=acorn.parse(src,{ecmaVersion:2022,ranges:true});const sm=es.analyze(ast,{ecmaVersion:2022});
const lin=o=>src.slice(0,o).split('\n').length;
const main=ast.body[0].expression.callee;const mainSc=sm.acquire(main);
const st=main.body.body.find(n=>lin(n.range[0])===LINHA);
const f=st.expression.callee||st.expression.argument&&st.expression.argument.callee;const sc=sm.acquire(f);
console.log('pedaço: linhas',lin(st.range[0]),'→',lin(st.range[1]),Math.round((st.range[1]-st.range[0])/1024),'KB');
const dentro=s=>{for(let x=s;x;x=x.upper)if(x===sc)return true;return false};
const R={};
(function w(s){s.references.forEach(r=>{const v=r.resolved;if(v&&dentro(v.scope))return;const k=r.identifier.name;const o=R[k]||(R[k]={n:0,w:0,onde:!v?'navegador':(v.scope===mainSc?'programa':'outro')});o.n++;if(r.isWrite())o.w++;if(v&&v.defs[0])o.tipo=v.defs[0].type});s.childScopes.forEach(w)})(sc);
const P=Object.entries(R).filter(([k,v])=>v.onde!=='navegador');
console.log('nomes do programa usados pelo pedaço:',P.length);
console.log('  funções (só chamadas/lidas):',P.filter(([k,v])=>v.tipo==='FunctionName'&&!v.w).map(([k,v])=>k).join(' '));
console.log('  variáveis só lidas:',P.filter(([k,v])=>v.tipo!=='FunctionName'&&!v.w).map(([k,v])=>k+'×'+v.n).join(' '));
console.log('  ESCRITAS pelo pedaço:',P.filter(([k,v])=>v.w).map(([k,v])=>k+'('+v.tipo+',w'+v.w+')').join(' '));
// o resto do programa usa nomes declarados DENTRO do pedaço? (só por window.*)  e o pedaço reatribui funções do programa (embrulhos)?
// quem de fora reatribui as variáveis lidas (se mudam depois, cópia não serve)
const lidas=P.filter(([k,v])=>v.tipo!=='FunctionName').map(([k])=>k);
const muda={};mainSc.variables.forEach(v=>{if(lidas.includes(v.name)){muda[v.name]=v.references.filter(r=>r.isWrite()).length}});
console.log('  quantas vezes cada variável lida é ATRIBUÍDA no programa todo:',Object.entries(muda).map(([k,n])=>k+':'+n).join(' '));
const fn=P.filter(([k,v])=>v.tipo==='FunctionName').map(([k])=>k);const re={};mainSc.variables.forEach(v=>{if(fn.includes(v.name)){const n=v.references.filter(r=>r.isWrite()).length;if(n)re[v.name]=n}});
console.log('  funções usadas que são REATRIBUÍDAS (embrulhadas) em algum lugar:',JSON.stringify(re));
