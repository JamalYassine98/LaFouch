// regras de CSS cujo seletor usa uma classe ou id que não aparece em lugar nenhum do app (src/ e index.html)
const fs=require('fs'),glob=p=>fs.readdirSync(p);const postcss=require('/tmp/acn/node_modules/postcss');
const R='/home/claude/lafouch';const code=glob(R+'/src').filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(R+'/src/'+f,'utf8')).join('\n')+fs.readFileSync(R+'/www/index.html','utf8');
const toks=new Set(code.match(/[A-Za-z_][\w-]*/g));const css=fs.readFileSync(R+'/www/style.css','utf8');const root=postcss.parse(css);
let n=0,b=0;const tira=process.argv.includes('--tira');
root.walkRules(r=>{if(r.parent&&r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;
  const sels=r.selectors;const vivos=sels.filter(s=>{const nm=(s.match(/[.#]([A-Za-z_][\w-]*)/g)||[]).map(x=>x.slice(1));return !nm.length||nm.every(x=>toks.has(x))});
  if(vivos.length===sels.length)return;
  if(!vivos.length){n++;b+=r.toString().length;if(tira)r.remove()}else{if(tira)r.selectors=vivos}});
// @media vazios
if(tira)root.walkAtRules(a=>{if(a.nodes&&!a.nodes.length)a.remove()});
console.log('regras mortas',n,'·',Math.round(b/1024),'KB');if(tira)fs.writeFileSync(R+'/www/style.css',root.toString());
