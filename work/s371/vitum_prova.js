// S376: prova da retirada do site — erro da nuvem deixa a retirada na fila; "não existe" e sucesso contam como feito.
const fs=require('fs');const s=fs.readFileSync('/home/claude/lafouch/src/96-loja-online.js','utf8');
const i=s.indexOf('  function vitUm(ref, op) {'),j=s.indexOf('\n    var u = vitProduto(ref);',i);const corpo=s.slice(i,j)+'\n    return Promise.resolve("upd");\n  }';
async function caso(nome,resp){const S={site:{},vitFoto:{X:1}};const vitApi=(m,p)=>p.startsWith('produtos/')?resp():Promise.resolve({});
  const vitUm=new Function('S','vitApi',corpo+'\n return vitUm;')(S,vitApi);
  try{await vitUm('X','del');console.log(nome,'→ feito (sai da fila)')}catch(e){console.log(nome,'→ falhou (fica na fila e tenta de novo), status',e.status)}}
(async()=>{await caso('nuvem aceitou',()=>Promise.resolve({}));await caso('não existe mais (404)',()=>Promise.reject(Object.assign(new Error('x'),{status:404})));
 await caso('nuvem recusou (403)',()=>Promise.reject(Object.assign(new Error('x'),{status:403})));await caso('sem resposta (408)',()=>Promise.reject(Object.assign(new Error('x'),{status:408})))})();
