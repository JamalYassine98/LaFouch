const acorn=require('acorn'),es=require('eslint-scope'),fs=require('fs');
const src=fs.readFileSync('tudo.js','utf8');
const ast=acorn.parse(src,{ecmaVersion:2022,ranges:true});
const lin=o=>src.slice(0,o).split('\n').length;
console.log('declarações no topo do arquivo:',ast.body.length);
ast.body.forEach(n=>console.log(' ',n.type,lin(n.range[0]),'→',lin(n.range[1]),Math.round((n.range[1]-n.range[0])/1024)+' KB',src.slice(n.range[0],n.range[0]+60).replace(/\n/g,' ')));
const sm=es.analyze(ast,{ecmaVersion:2022});
ast.body.forEach((n,i)=>{ if(n.range[1]-n.range[0]<20000||i===0)return;
  // nomes livres deste pedaço que são declarados em OUTRO pedaço do topo
  let f=n.type==='ExpressionStatement'&&n.expression.type==='CallExpression'?n.expression.callee:null; if(!f) return;
  const sc=sm.acquire(f); const R={};
  sc.through.forEach(r=>{const k=r.identifier.name;(R[k]=R[k]||{w:0,res:!!r.resolved}); if(r.isWrite())R[k].w++});
  console.log('pedaço na linha',lin(n.range[0]),'usa de fora:',Object.entries(R).map(([k,v])=>k+(v.res?'*':'')+(v.w?'(escreve)':'')).join(' '));
});
