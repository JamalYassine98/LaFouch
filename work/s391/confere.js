// S393: tira os e-mails JÁ IMPLEMENTADOS dos programas do servidor, para comparar com os esboços aprovados
const F='/home/claude/lafouch/functions/';
const Codigo=require(F+'codigo.js'),Volta=require(F+'volta.js'),Cupom=require(F+'cupom.js'),Atacado=require(F+'atacado.js'),PM=require(F+'pedidomail.js');
const fim=Date.UTC(2026,11,16,15,0,0);
(async()=>{const L=[];
  L.push({arq:'i-a',assunto:'482915 é o seu código da La Fouch',html:Codigo.emailHtml('Maria Souza','482915',false)});
  let m=Cupom.mail({tipo:'bv',pct:10,cod:'BV-7K2M9Q',fim,email:'m@e.com'},false,null);L.push({arq:'i-b',assunto:m.subject,html:m.html});
  m=Cupom.mail({tipo:'fiel',pct:10,cod:'FIEL-4T8XW2',fim,email:'m@e.com'},false,{cod:'AMIGA-9H3LQ5',fim});L.push({arq:'i-c',assunto:m.subject,html:m.html});
  m=Volta.mensagem({email:'m@e.com',ref:'GR3340',lang:'pt'},'Armação acetato preta');L.push({arq:'i-d',assunto:m.subject,html:m.html});
  let at=null;await Atacado.entrar({get:async()=>({email:'c@e.com',st:'ok',ate:fim+9e9}),muda:async()=>{}},async x=>{at=x},{c:'CONTA1234',email:'c@e.com'},Date.now(),479088);L.push({arq:'i-f',assunto:at.subject,html:at.html});
  const o=PM.copia({ts:Date.UTC(2026,10,16,15),nome:'Maria Souza',email:'m@e.com',cod:'7K2M',lang:'pt',pag:'pix',brl:235,total:330000,ent:'delivery',obsC:'Transportadora: PedidosYa',itens:[{nome:'Armação acetato preta GR3340',q:1},{nome:'Solar quadrado tartaruga',q:1}]},Date.now());
  m=PM.recebido(o,true,'https://wa.me/1');L.push({arq:'i-g',assunto:m.subject,html:m.html});m=PM.pago(o,'');L.push({arq:'i-h',assunto:m.subject,html:m.html});
  require('fs').writeFileSync('/tmp/s391/impl.json',JSON.stringify(L));console.log(L.length)})();
