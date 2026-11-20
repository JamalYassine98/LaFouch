// quem guarda uma função (sem chamar) na hora em que o app abre — fica com a versão daquele momento da cadeia
const fs=require('fs'),path=require('path'),acorn=require('acorn'),walk=require('acorn-walk');
const SRC=path.join(__dirname,'..','..','..','src');const mods=fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort();
let code='(function () {\n',mapa=[],lin=2;for(const f of mods){const t=fs.readFileSync(path.join(SRC,f),'utf8');mapa.push([lin,f]);code+=t;lin+=t.split('\n').length-1}code+='})();\n';
const onde=l=>{let r=mapa[0];for(const m of mapa){if(m[0]<=l)r=m;else break}return r[1]+':'+(l-r[0]+1)};
const ast=acorn.parse(code,{ecmaVersion:2022,locations:true});const nomes=process.argv.slice(2);
walk.fullAncestor(ast,(n,anc)=>{if(n.type!=='Identifier'||!nomes.includes(n.name))return;const p=anc[anc.length-2];
 if(p.type==='CallExpression'&&p.callee===n)return;if(p.type==='FunctionDeclaration'&&p.id===n)return;if(p.type==='AssignmentExpression'&&p.left===n)return;
 if(p.type==='MemberExpression'&&p.property===n&&!p.computed)return;if(p.type==='Property'&&p.key===n&&p.value!==n)return;
 if(p.type==='MemberExpression'&&p.object===n&&/^(apply|call)$/.test(p.property.name))return;
 const prof=anc.filter(a=>/Function/.test(a.type)).length-1;
 console.log(n.name.padEnd(12),onde(n.loc.start.line).padEnd(38),'prof',prof,code.split('\n')[n.loc.start.line-1].trim().slice(0,110))});
