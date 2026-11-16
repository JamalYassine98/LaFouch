// S391: tira dos próprios programas do servidor os e-mails que o cliente recebe HOJE (nada inventado), com dados de exemplo
const F='/home/claude/lafouch/functions/';
const Codigo=require(F+'codigo.js'),Volta=require(F+'volta.js'),Cupom=require(F+'cupom.js'),Atacado=require(F+'atacado.js');
const fim=Date.UTC(2026,11,16,15,0,0);
(async()=>{
  const L=[];
  L.push({arq:'57a-email-codigo-de-confirmacao',quando:'Ao criar conta com e-mail e senha (confirmar o e-mail)',assunto:'482915 é o seu código da La Fouch',html:Codigo.emailHtml('Maria Souza','482915',false)});
  const bv=Cupom.mail({tipo:'bv',pct:10,cod:'BV-7K2M9Q',fim,email:'maria@exemplo.com'},false,null);
  L.push({arq:'57b-email-cartao-de-boas-vindas',quando:'Ao pedir o cartão de boas-vindas no site',assunto:bv.subject,html:bv.html});
  const fi=Cupom.mail({tipo:'fiel',pct:10,cod:'FIEL-4T8XW2',fim,email:'maria@exemplo.com'},false,{cod:'AMIGA-9H3LQ5',fim});
  L.push({arq:'57c-email-cliente-fiel',quando:'Depois da 3ª compra paga (Cliente fiel), com o cartão para a amiga',assunto:fi.subject,html:fi.html});
  const vo=Volta.mensagem({email:'maria@exemplo.com',ref:'GR3340',lang:'pt'},'Armação acetato preta GR3340');
  L.push({arq:'57d-email-voltou-ao-estoque',quando:'Quando uma peça esgotada volta e a pessoa pediu "Avise-me"',assunto:vo.subject,html:vo.html});
  const b={titulo:'Chegou a coleção de verão',texto:'Novos solares e armações já estão no site. Venha ver antes que acabem.'},esc2=(t)=>String(t||'');
  L.push({arq:'57e-email-novidades',quando:'Quando a loja começa uma temática (para quem se inscreveu nas novidades)',assunto:b.titulo,html:'<div style="font-family:Arial,sans-serif;max-width:520px"><div style="font:700 22px Georgia,serif;letter-spacing:2px;color:#7a2a59">LA FOUCH</div><h2 style="font-family:Georgia,serif">'+esc2(b.titulo)+'</h2><p>'+esc2(b.texto)+'</p><p><a href="https://lafouch.com" style="background:#7a2a59;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Ver em lafouch.com</a></p><p style="color:#999;font-size:12px">Você recebe este e-mail porque se inscreveu nas novidades da La Fouch. Para não receber mais, responda SAIR.</p></div>'});
  let at=null;const db={get:async()=>({email:'cliente@exemplo.com',st:'ok',ate:fim+9e9}),muda:async()=>{}};
  try{await Atacado.entrar(db,async m=>{at=m},{c:'CONTA1234',email:'cliente@exemplo.com'},Date.now())}catch(e){console.error('atacado',e.message)}
  if(at)L.push({arq:'57f-email-codigo-do-atacado',quando:'Quando um cliente de atacado entra no catálogo mayorista (só em espanhol)',assunto:at.subject,html:at.html});
  require('fs').writeFileSync('/tmp/s391/emails.json',JSON.stringify(L));console.log(L.map(x=>x.arq+' | '+x.assunto).join('\n'));
})();
