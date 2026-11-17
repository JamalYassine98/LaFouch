// funções com o MESMO nome declaradas mais de uma vez no escopo do app: só a última vale (as de antes nunca rodam)
const fs=require('fs'),path=require('path');const acorn=require('/tmp/acn/node_modules/acorn');
const SRC='/home/claude/lafouch/src';const fsn=fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort();const txt=fsn.map(f=>fs.readFileSync(path.join(SRC,f),'utf8'));
const corpo=txt.join(''),pre='(function () {\n';const ast=acorn.parse(pre+corpo+'})();',{ecmaVersion:2022});
const ini=[];let a=0;txt.forEach(t=>{ini.push(a);a+=t.length});
const body=ast.body[0].expression.callee.body.body;const d={};
body.forEach(n=>{if(n.type==='FunctionDeclaration'){(d[n.id.name]=d[n.id.name]||[]).push(n)}});
let lin=0,c=0;const out=[];
Object.entries(d).filter(([k,v])=>v.length>1).forEach(([k,v])=>{v.slice(0,-1).forEach(n=>{const s=n.start-pre.length;const i=ini.filter(x=>x<=s).length-1;const l=corpo.slice(s,n.end-pre.length).split('\n').length;lin+=l;c++;out.push([k,fsn[i],l,'(vale a de '+fsn[ini.filter(x=>x<=v[v.length-1].start-pre.length).length-1]+')'])})});
console.log('declaradas de novo:',c,'funções,',lin,'linhas que nunca rodam');out.forEach(o=>console.log('  ',o.join(' ')));
// var _x = nome;  e _x nunca usado
const walk=require('/tmp/acn/node_modules/acorn-walk');const usos={};walk.full(ast,n=>{if(n.type==='Identifier')usos[n.name]=(usos[n.name]||0)+1});
let w=0;walk.full(ast,n=>{if(n.type==='VariableDeclarator'&&n.id.name&&/^_/.test(n.id.name)&&n.init&&n.init.type==='Identifier'&&usos[n.id.name]===1){w++;console.log('  embrulho sem uso:',n.id.name,'=',n.init.name)}});
console.log('embrulhos sem uso:',w);
