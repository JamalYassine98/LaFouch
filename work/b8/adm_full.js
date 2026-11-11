/* ===== bloco 8 (11/11/2026): abas Mensagens, Temática (calendário automático, S134) e Analisador ===== */
/* calendário automático da Temática (11/11/2026, S134): datas do comércio; o painel guarda só o estado (config/site.cal) */
function calOc(y){
  function d(Y,M,D,f){return new Date(Y,M-1,D,f?23:0,f?59:0,f?59:0,f?999:0).getTime()}
  var n1=new Date(y,10,1),bf=1+(4-n1.getDay()+7)%7+21+1,cy=new Date(y,10,bf+3),j1=new Date(y,5,1),p2=1+(7-j1.getDay())%7+7,BC={2026:[19,22]},L=[];
  if(BC[y])L.push({id:'bfcde',nm:'Black Friday CDE',tema:'bf',ini:d(y,11,BC[y][0]),fim:d(y,11,BC[y][1],1),org:'Câmara de Comércio de CDE',fonte:'Câmara de Comércio e Serviços de CDE',nova:1,y:y});
  L.push({id:'bf',nm:'Black Friday',tema:'bf',ini:d(y,11,bf),fim:d(y,11,bf,1),org:'Data internacional'});
  L.push({id:'cyber',nm:'Cyber Monday',tema:'bf',ini:cy.getTime(),fim:d(cy.getFullYear(),cy.getMonth()+1,cy.getDate(),1),org:'Data internacional',bar:'⚡ CYBER MONDAY · ofertas em toda a loja',th:'CYBER <em>MONDAY</em>',lab:'SÓ HOJE'});
  L.push({id:'natal',nm:'Natal',tema:'natal',ini:d(y,12,1),fim:d(y,12,25,1),org:'Data fixa'});
  L.push({id:'anonovo',nm:'Ano Novo',tema:'anonovo',ini:d(y,12,26),fim:d(y+1,1,1,1),org:'Data fixa'});
  L.push({id:'maes',nm:'Dia das Mães',tema:'maes',ini:d(y,5,1),fim:d(y,5,15,1),org:'Data fixa no Paraguai',nv:1});
  L.push({id:'pais',nm:'Dia dos Pais',tema:'pais',ini:d(y,6,1),fim:d(y,6,p2,1),org:'2º domingo de junho no Paraguai',nv:1});
  L.push({id:'halloween',nm:'Halloween',tema:'halloween',ini:d(y,10,24),fim:d(y,10,31,1),org:'Data fixa',pad:'off'});
  return L}
var CAL_IDS=['bfcde','bf','cyber','natal','anonovo','maes','pais','halloween','crazy'];
/* a próxima vez de cada data (o que já passou sai e volta com a data do ano que vem); sem data = "Data a confirmar" */
function calProx(ag){var out=[],sem=[],y=new Date(ag).getFullYear(),T={};
  for(var k=y-1;k<=y+2;k++)calOc(k).forEach(function(x){if(x.fim>=ag&&(!T[x.id]||x.ini<T[x.id].ini))T[x.id]=x});
  CAL_IDS.forEach(function(id){if(T[id])out.push(T[id]);else if(id==='crazy')sem.push({id:'crazy',nm:'Crazy Week CDE',org:'Câmara de Comércio de CDE',sd:1});else if(id==='bfcde')sem.push({id:'bfcde',nm:'Black Friday CDE',org:'Câmara de Comércio de CDE',sd:1})});
  out.sort(function(a,b){return a.ini-b.ini});return {L:out,sem:sem}}
function calSt(cfg,x){if(x.sd)return 'wait';var c=((cfg&&cfg.cal)||{})[x.id];return c==='auto'||c==='off'?c:(x.pad||'auto')}
function fnU(n){return 'https://southamerica-east1-'+FB.p+'.cloudfunctions.net/'+n}
var MSGF=fnU('mensagem'),ANLF=fnU('analise');
var MES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],MESC=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
function cap(t){return t.charAt(0).toUpperCase()+t.slice(1)}
function dd(ms){var d=new Date(ms);return {d:d.getDate(),m:d.getMonth(),y:d.getFullYear()}}
function quando(x){if(x.sd)return 'aguardando a data';var a=dd(x.ini),b=dd(x.fim);if(a.m===b.m&&a.y===b.y)return a.d===b.d?a.d+' de '+MES[a.m]:a.d+' a '+b.d+' de '+MES[a.m];return a.d+' de '+MES[a.m]+' a '+b.d+' de '+MES[b.m]}
var STN={auto:['Automático','ok'],off:['Desligado','off'],wait:['Aguardando','']};
function nf(n){return Number(n||0).toLocaleString('pt-BR')}
function pNome(ref){var p=S.prods.filter(function(x){return x.ref===ref})[0];return p?ref+' · '+p.nome:ref}

/* ---------- Temática ---------- */
S.temPg='';
function temProx(cp){return cp.L.filter(function(x){return calSt(S.cfg,x)==='auto'})[0]||null}
function evRow(x,px){var s=calSt(S.cfg,x);return '<div class="ev'+(px?' px':'')+'"><div class="g"><b>'+esc(x.nm)+(px?' <em>próximo</em>':x.nv?' <em>novo</em>':'')+'</b><div class="mu sm">'+esc(quando(x))+' · '+esc(x.org)+'</div></div><button type="button" class="ch '+STN[s][1]+'" data-cal="'+x.id+'"'+(s==='wait'?' disabled':'')+' aria-label="'+esc(x.nm)+': '+STN[s][0]+(s==='wait'?'':'. Toque para mudar')+'">'+STN[s][0]+'</button></div>'}
function temDraw(){var e=$('temb');if(!e)return;var ag=Date.now(),cp=calProx(ag),px=temProx(cp),h='';
  if(S.temPg==='cal'){
    var ms=[],c0=new Date(ag);for(var i=0;i<12;i++){var dm=new Date(c0.getFullYear(),c0.getMonth()+i,1);ms.push({y:dm.getFullYear(),m:dm.getMonth(),L:cp.L.filter(function(x){var a=dd(x.ini);return a.y===dm.getFullYear()&&a.m===dm.getMonth()})})}
    h='<button class="bk" type="button" data-tpg="">‹ Temática</button><div><h1 class="serif">Calendário completo</h1><div class="mu sm">Próximos 12 meses · o que já passou sai da lista</div></div>'+
      '<div class="ms">'+ms.map(function(o,i){return '<button type="button" class="'+(i===0?'on':'')+(o.L.length?'':' v')+'"'+(o.L.length?' data-tmes="'+o.y+'-'+o.m+'"':' disabled')+'>'+MESC[o.m]+'</button>'}).join('')+'</div>'+
      ms.filter(function(o){return o.L.length}).map(function(o){return '<section class="card" id="cm-'+o.y+'-'+o.m+'"><div class="ct">'+cap(MES[o.m])+' '+o.y+'</div>'+o.L.map(function(x){return evRow(x,x===px)}).join('')+'</section>'}).join('')+
      (cp.sem.length?'<section class="card"><div class="ct">Data a confirmar</div>'+cp.sem.map(function(x){return evRow(x,false)}).join('')+'</section>':'');
    e.innerHTML=h;return}
  h='<div><h1 class="serif">Temática</h1><div class="mu sm">Calendário do comércio · o site e o Mochi mudam sozinhos</div></div>';
  var nv=cp.L.filter(function(x){return x.nova&&!((S.cfg.calv||{})[x.id+x.y])})[0];
  if(nv)h+='<section class="card av"><div class="ct">Nova data encontrada</div><div style="font-size:15px"><b>'+esc(nv.nm)+' '+nv.y+'</b> · '+esc(quando(nv))+'</div><div class="mu sm">Fonte: '+esc(nv.fonte||nv.org)+'</div><div class="bt"><button class="btn" type="button" data-nova="'+nv.id+'" data-ny="'+nv.y+'" data-na="1">Ativar</button><button class="btn o" type="button" data-nova="'+nv.id+'" data-ny="'+nv.y+'">Agora não</button></div></section>';
  var me=S.cfg.evento,meOn=me&&me.tema&&(!me.ini||ag>=me.ini)&&(!me.fim||ag<=me.fim);
  if(px){var on=px.ini<=ag,dias=Math.max(1,Math.ceil((px.ini-ag)/864e5));
    h+='<section class="card"><div class="ct">Próximo evento</div><div class="nx"><div class="d">'+(on?'<b>●</b><small>NO AR</small>':'<b>'+dias+'</b><small>'+(dias===1?'DIA':'DIAS')+'</small>')+'</div><div class="g"><div class="serif" style="font-size:20px">'+esc(px.nm)+'</div><div class="mu sm">'+esc(quando(px))+' · '+(on?'no ar agora, desliga sozinho no fim':'liga sozinho às 00:00')+'</div></div></div>'+
      (meOn?'<div class="sm" style="margin-top:10px;color:var(--wn)">O evento manual ('+esc((EVN.filter(function(x){return x[0]===me.tema})[0]||['',me.tema])[1])+') está ligado agora e tem prioridade.</div>':'')+
      '<div style="display:grid;gap:10px;margin-top:14px"><button class="btn o" type="button" data-tprev="'+px.id+'">Ver prévia do site</button></div></section>'}
  var c=new Date(ag),mm=c.getMonth(),yy=c.getFullYear(),L=cp.L.filter(function(x){var a=dd(x.ini);return (a.y===yy&&a.m===mm)||(x.ini<=ag&&x.fim>=ag)}),tit='Este mês · '+cap(MES[mm]);
  if(!L.length&&cp.L.length){var f=dd(cp.L[0].ini);L=cp.L.filter(function(x){var a=dd(x.ini);return a.y===f.y&&a.m===f.m});tit='Próximo mês com evento · '+cap(MES[f.m])}
  h+='<section class="card"><div class="ct">'+tit+'</div>'+L.map(function(x){return evRow(x,x===px)}).join('')+'<button class="vt" type="button" data-tpg="cal">Ver calendário completo ›</button></section>';
  e.innerHTML=h}
function calSalva(cal,calv,msg){var o={cal:cal},mk=['cal'];if(calv){o.calv=calv;mk.push('calv')}
  return put('config/site',o,mk).then(function(){S.cfg.cal=cal;if(calv)S.cfg.calv=calv;temDraw();reloadCat();if(msg)say(msg)}).catch(function(x){say(x&&x.message==='perm'?'Sem permissão. Entre de novo.':'Erro ao salvar.',1)})}
function temPrev(id){var u='index.html?cliente=1&evp='+encodeURIComponent(id)+'&p='+Date.now();if(W()&&!$('dpv').hidden){$('pvd').src=u;say('Prévia no site ao lado.')}else openCli(u)}
$('temb').onclick=function(ev){var t=ev.target.closest('[data-tpg],[data-tmes],[data-cal],[data-nova],[data-tprev]');if(!t)return;
  if(t.hasAttribute('data-tpg')){S.temPg=t.getAttribute('data-tpg');temDraw();$('v_tem').scrollTop=0;casc($('v_tem'),'.card');return}
  if(t.hasAttribute('data-tmes')){var k=$('cm-'+t.getAttribute('data-tmes'));Array.prototype.forEach.call(t.parentNode.children,function(b){b.classList.toggle('on',b===t)});if(k)$('v_tem').scrollTo({top:k.offsetTop-$('v_tem').offsetTop-8,behavior:RM?'auto':'smooth'});return}
  if(t.hasAttribute('data-tprev')){temPrev(t.getAttribute('data-tprev'));return}
  if(t.hasAttribute('data-nova')){var id=t.getAttribute('data-nova'),y=t.getAttribute('data-ny'),sim=t.hasAttribute('data-na'),cal=Object.assign({},S.cfg.cal||{}),cv=Object.assign({},S.cfg.calv||{});cal[id]=sim?'auto':'off';cv[id+y]=1;
    calSalva(cal,cv,sim?'Ativado: liga sozinho nas datas.':'Certo. Fica desligado (dá para ligar no calendário).');return}
  if(t.hasAttribute('data-cal')){var id2=t.getAttribute('data-cal'),cp=calProx(Date.now()),x=cp.L.concat(cp.sem).filter(function(o){return o.id===id2})[0];if(!x||x.sd)return;var s=calSt(S.cfg,x)==='auto'?'off':'auto',c2=Object.assign({},S.cfg.cal||{});c2[id2]=s;
    calSalva(c2,null,x.nm+': '+(s==='auto'?'Automático. Liga sozinho nas datas.':'Desligado. O site não muda nesta data.'))}};

/* ---------- Mensagens ---------- */
S.msgs=null;S.mf='all';
function msgLoad(){if(!S.tok)return Promise.resolve();S.msgErr=0;return fnPost(MSGF,{acao:'lista'}).then(function(j){if(!j||!j.ok)throw 0;S.msgs=j.itens||[];msgBadge();if(S.v==='msg')msgDraw();if(S.v==='anl'&&S.an)anlDraw()}).catch(function(){S.msgErr=1;if(S.v==='msg')msgDraw()})}
function msgNovas(){return (S.msgs||[]).filter(function(m){return (m.est||'novo')==='novo'}).length}
function msgBadge(){var b=$('mbd'),n=msgNovas();if(b){b.textContent=n>99?'99+':n;b.hidden=!n}}
function msgData(ms){var d=new Date(+ms||0),z=function(n){return (n<10?'0':'')+n};return z(d.getDate())+'/'+z(d.getMonth()+1)+' '+z(d.getHours())+':'+z(d.getMinutes())}
function msgCard(m){var est=m.est||'novo',E={novo:['Novo','ca'],respondido:['Respondido','co'],fechado:['Fechado','']},tel=String(m.tel||'').replace(/\D/g,''),at=m.tipo==='atacado';
  var corpo=at?[m.cod?'Código '+m.cod:'',m.pais?'País: '+m.pais:'',m.qtd?'Quantidade: '+m.qtd:'',(m.procura||[]).length?'Procura: '+m.procura.join(', '):'',(m.vistos||[]).length?'Viu no site: '+m.vistos.slice(0,8).join(', '):'',(m.favs||[]).length?'Favoritos: '+m.favs.slice(0,8).join(', '):''].filter(Boolean).join('\n'):String(m.msg||'');
  var ac=[];if(m.email)ac.push('<a class="btn o" href="mailto:'+esc(m.email)+'?subject='+encodeURIComponent('La Fouch · resposta')+'">Responder por e-mail</a>');if(tel.length>=7)ac.push('<a class="btn o" target="_blank" rel="noopener" href="https://wa.me/'+tel+'">WhatsApp</a>');
  return '<div class="msc" data-mid="'+esc(m.id)+'"><div class="hd"><span class="chip '+E[est][1]+'"'+(est==='fechado'?' style="background:var(--s2);color:var(--mu)"':'')+'>'+E[est][0]+'</span><b>'+(at?'Atacado':'Contato')+'</b><span class="mu sm" style="margin-left:auto">'+msgData(m.ts)+'</span></div>'+
    ((m.nome||m.email||m.tel)?'<div class="sm"><b>'+esc(m.nome||'')+'</b>'+(m.email?' · '+esc(m.email):'')+(m.tel?' · '+esc(m.tel):'')+(m.lang==='es'?' · Español':'')+'</div>':'')+
    (corpo?'<div class="tx">'+esc(corpo)+'</div>':'')+
    '<div class="ac">'+ac.join('')+'<div class="mst" style="margin-left:auto">'+['novo','respondido','fechado'].map(function(k){return '<button type="button" class="'+(k===est?'on':'')+'" data-mest="'+k+'">'+E[k][0]+'</button>'}).join('')+'</div></div></div>'}
function msgDraw(){var e=$('msgl'),sb=$('msub');if(!e)return;
  if(S.msgs===null){e.innerHTML=S.msgErr?'<div class="mu sm">Não consegui carregar. A função "mensagem" precisa estar publicada (firebase deploy --only functions:mensagem).</div><button class="btn o" data-mre type="button" style="margin-top:10px">Tentar de novo</button>':'<div class="mu sm">Carregando…</div>';return}
  var n=msgNovas();if(sb)sb.textContent=(n?n+' nova'+(n===1?'':'s')+' · ':'')+'contato e pedidos de atacado';
  var c={all:S.msgs.length,contato:0,atacado:0};S.msgs.forEach(function(m){c[m.tipo]=(c[m.tipo]||0)+1});
  Array.prototype.forEach.call($('mflt').children,function(b){var k=b.getAttribute('data-mf');b.classList.toggle('on',k===S.mf);b.textContent=b.getAttribute('data-l')+(c[k]?' ('+c[k]+')':'')});
  var L=S.msgs.filter(function(m){return S.mf==='all'||m.tipo===S.mf});
  e.innerHTML=L.length?L.map(msgCard).join(''):'<div class="mu" style="padding:18px 0;text-align:center">Nenhuma mensagem aqui.</div>'}
$('mflt').onclick=function(ev){var b=ev.target.closest('[data-mf]');if(!b)return;S.mf=b.getAttribute('data-mf');msgDraw()};
$('msgl').onclick=function(ev){if(ev.target.closest('[data-mre]')){S.msgs=null;msgDraw();msgLoad();return}var b=ev.target.closest('[data-mest]');if(!b)return;var c=b.closest('[data-mid]'),id=c.getAttribute('data-mid'),k=b.getAttribute('data-mest'),m=(S.msgs||[]).filter(function(x){return x.id===id})[0];if(!m||(m.est||'novo')===k)return;
  var old=m.est;m.est=k;msgDraw();msgBadge();fnPost(MSGF,{acao:'estado',id:id,est:k}).then(function(j){if(!j||!j.ok)throw 0}).catch(function(){m.est=old;msgDraw();msgBadge();say('Não consegui mudar.',1)})};

/* ---------- Analisador ---------- */
S.ad=7;S.an=null;
function anlLoad(){var e=$('anlb');if(!e||!S.tok)return;e.innerHTML='<section class="card"><div class="mu sm">Carregando…</div></section>';S.anErr=0;
  if(S.msgs===null)msgLoad();
  if(S.nwN===undefined){S.nwN=null;fnPost(NOVI,{acao:'lista'}).then(function(j){S.nwN=j&&j.ok?(j.itens||[]).length:null;if(S.v==='anl'&&S.an)anlDraw()}).catch(function(){})}
  var d=S.ad;fnPost(ANLF,{acao:'resumo',dias:d}).then(function(j){if(!j||!j.ok)throw 0;if(d!==S.ad)return;S.an=j;anlDraw()}).catch(function(){S.an=null;S.anErr=1;anlDraw()})}
function anMsgs(){var ini=Date.now()-S.ad*864e5;return (S.msgs||[]).filter(function(m){return m.tipo==='atacado'&&(+m.ts||0)>=ini})}
function anAvisos(a){var L=[],v=a.vistasSemCarrinho[0],s=a.semResultado[0];
  if(v&&v[1]>=5)L.push(pNome(v[0])+' foi vista '+nf(v[1])+' vezes e ninguém colocou no carrinho. Confira a foto e o preço.');
  if(s)L.push('“'+s[0]+'” foi buscado '+nf(s[1])+(s[1]===1?' vez':' vezes')+' sem resultado. Vale cadastrar um modelo assim ou usar esse nome.');
  var es=a.pecas.filter(function(x){var p=S.prods.filter(function(q){return q.ref===x[0]})[0];return p&&esg(p)})[0];if(es)L.push(pNome(es[0])+' está esgotado e foi visto '+nf(es[1])+' vezes. Vale repor.');
  if(a.checkout>a.pedidos)L.push(nf(a.checkout-a.pedidos)+' visita'+(a.checkout-a.pedidos===1?'':'s')+' começ'+(a.checkout-a.pedidos===1?'ou':'aram')+' a finalizar e não enviou o pedido.');
  var an=anMsgs().filter(function(m){return (m.est||'novo')==='novo'}).length;if(an)L.push(an+' pedido'+(an===1?'':'s')+' de atacado esperando resposta.');
  return L.slice(0,5)}
function anNums(N,cl){return '<div class="an3'+(cl?' '+cl:'')+'">'+N.map(function(x){return '<div><b>'+x[0]+'</b><small>'+x[1]+'</small></div>'}).join('')+'</div>'}
function anTop(L,fmt,vazio){L=L||[];return L.length?L.slice(0,5).map(function(x,i){return '<div class="tl"><span class="k">'+(i+1)+'</span><span class="g">'+esc(fmt?fmt(x[0]):x[0])+'</span><i>'+nf(x[1])+'</i></div>'}).join(''):'<div class="mu sm" style="padding:6px 0">'+(vazio||'Ainda sem dados neste período.')+'</div>'}
function anSec(t,N,top,ver){return '<section class="card"><div class="ct">'+t+'</div>'+anNums(N)+top+(ver?'<button type="button" class="lkv" data-anver="'+ver+'">Ver tudo ›</button>':'')+'</section>'}
function pct(a,b){return b?Math.round(a*100/b)+'%':'0%'}
function anlDraw(){var e=$('anlb');if(!e)return;
  if(!S.an){e.innerHTML='<section class="card"><div class="mu sm">'+(S.anErr?'Não consegui carregar. A contagem começa quando a função "analise" estiver publicada (firebase deploy --only functions:analise).':'Carregando…')+'</div>'+(S.anErr?'<button class="btn o" type="button" data-anre style="margin-top:10px">Tentar de novo</button>':'')+'</section>';return}
  var a=S.an,av=anAvisos(a),M=anMsgs(),PR={};M.forEach(function(m){(m.procura||[]).forEach(function(k){PR[k]=(PR[k]||0)+1})});
  var tv=Object.keys(a.eventos||{}).map(function(k){return [((EVN.filter(function(x){return x[0]===k})[0])||['',k])[1],a.eventos[k]]}).sort(function(x,y){return y[1]-x[1]});
  var h='<section class="card"><div class="ct">Resumo</div>'+anNums([[nf(a.visitas),'visitas'],[nf(a.vistas),'modelos vistos'],[nf(a.carrinho),'no carrinho'],[nf(a.pedidos),'pedidos']],'an4')+
    (av.length?av.map(function(t){return '<div class="al">'+esc(t)+'</div>'}).join(''):'<div class="al ok">Tudo tranquilo neste período.</div>')+'</section>';
  h+=anSec('Modelos',[[nf(a.vistas),'vistas'],[nf(a.favoritos),'favoritos'],[nf(a.carrinho),'no carrinho']],'<div class="mu sm" style="margin:6px 0 2px">Mais vistos</div>'+anTop(a.pecas,pNome),'pecas');
  h+=anSec('Busca',[[nf(a.buscas.reduce(function(s,x){return s+x[1]},0)),'buscas'],[nf(a.semResultado.reduce(function(s,x){return s+x[1]},0)),'sem resultado'],[nf(a.buscas.length),'termos']],'<div class="mu sm" style="margin:6px 0 2px">Mais buscados</div>'+anTop(a.buscas),'buscas');
  h+=anSec('Clientes',[[nf(a.visitas),'visitas'],[pct(a.cel,a.visitas),'pelo celular'],[pct(a.es,a.visitas),'em espanhol']],'<div class="mu sm" style="margin:6px 0 2px">Dias com mais visitas</div>'+anTop(Object.keys(a.dias||{}).map(function(k){return [k,a.dias[k]]}).sort(function(x,y){return y[1]-x[1]}),function(k){return k.slice(8,10)+'/'+k.slice(5,7)}),'dias');
  h+=anSec('Carrinho e pedidos',[[nf(a.carrinho),'no carrinho'],[nf(a.checkout),'começaram a finalizar'],[nf(a.pedidos),'pedidos']],'<div class="mu sm" style="margin:6px 0 2px">Mais colocados no carrinho</div>'+anTop(a.carts,pNome),'carts');
  h+=anSec('Ferramentas',[[nf(a.mochi),'teste de leitura'],[nf(a.rosto),'guia do rosto'],[pct(Math.max(a.mochi,a.rosto),a.visitas),'das visitas usaram']],anTop([['Teste de leitura (Mochi)',a.mochi],['Guia do formato do rosto',a.rosto]].filter(function(x){return x[1]}).sort(function(x,y){return y[1]-x[1]}),null,'Ninguém usou as ferramentas neste período.'),'');
  h+=anSec('Atacado',[[nf(a.atacado),'abriram o pedido'],[nf(M.length),'mensagens'],[nf(M.filter(function(m){return (m.est||'novo')==='novo'}).length),'sem resposta']],'<div class="mu sm" style="margin:6px 0 2px">O que procuram</div>'+anTop(Object.keys(PR).map(function(k){return [k,PR[k]]}).sort(function(x,y){return y[1]-x[1]}),null,'Nenhum pedido de atacado neste período.'),'atacado');
  h+='<section class="card"><div class="ct">Novidades e Temática</div>'+anNums([[S.nwN==null?'–':nf(S.nwN),'inscritos em novidades'],[nf(tv.reduce(function(s,x){return s+x[1]},0)),'visitas com tema'],[pct(tv.reduce(function(s,x){return s+x[1]},0),a.visitas),'das visitas']])+anTop(tv,null,'Nenhuma temática ligada neste período.')+'</section>';
  h+='<section class="card"><div class="ct">Relatório da semana</div><div class="mu sm">Um resumo dos últimos 7 dias em texto, para guardar ou mandar.</div><button class="btn o w" type="button" data-anrel style="margin-top:10px">Copiar relatório da semana</button></section>';
  e.innerHTML=h;casc(e,'.card')}
function anRel(a){var av=anAvisos(a);return 'La Fouch · relatório da semana ('+new Date().toLocaleDateString('pt-BR')+')\n\nVisitas: '+nf(a.visitas)+' ('+pct(a.cel,a.visitas)+' pelo celular, '+pct(a.es,a.visitas)+' em espanhol)\nModelos vistos: '+nf(a.vistas)+' · no carrinho: '+nf(a.carrinho)+' · pedidos: '+nf(a.pedidos)+
  '\n\nMais vistos:\n'+(a.pecas.slice(0,5).map(function(x,i){return (i+1)+'. '+pNome(x[0])+' ('+x[1]+')'}).join('\n')||'—')+'\n\nMais buscados:\n'+(a.buscas.slice(0,5).map(function(x,i){return (i+1)+'. '+x[0]+' ('+x[1]+')'}).join('\n')||'—')+(av.length?'\n\nAvisos:\n'+av.map(function(t){return '• '+t}).join('\n'):'')}
function anVer(k){var a=S.an;if(!a)return;var T={pecas:['Modelos mais vistos',a.pecas,pNome],buscas:['Buscas',a.buscas],dias:['Visitas por dia',Object.keys(a.dias||{}).sort().reverse().map(function(d){return [d.slice(8,10)+'/'+d.slice(5,7)+'/'+d.slice(0,4),a.dias[d]]})],carts:['Mais colocados no carrinho',a.carts,pNome]};
  if(k==='atacado'){S.mf='atacado';go('msg');return}var t=T[k];if(!t)return;
  var ex='';if(k==='buscas'&&a.semResultado.length)ex='<div class="ct" style="margin:14px 0 4px">Sem resultado</div>'+a.semResultado.map(function(x){return '<div class="tl"><span class="g">'+esc(x[0])+'</span><i>'+nf(x[1])+'</i></div>'}).join('');
  if(k==='carts'&&a.vistasSemCarrinho.length)ex='<div class="ct" style="margin:14px 0 4px">Vistos e nunca no carrinho</div>'+a.vistasSemCarrinho.slice(0,50).map(function(x){return '<div class="tl"><span class="g">'+esc(pNome(x[0]))+'</span><i>'+nf(x[1])+'</i></div>'}).join('');
  if(k==='pecas'){var F={},C={};a.favs.forEach(function(x){F[x[0]]=x[1]});a.carts.forEach(function(x){C[x[0]]=x[1]});
    sheet('<div class="serif" style="font-size:23px">'+t[0]+'</div><div class="mu sm" style="margin-top:-6px">vistas · favoritos · carrinho</div><div>'+(t[1].length?t[1].map(function(x,i){return '<div class="tl"><span class="k">'+(i+1)+'</span><span class="g">'+esc(pNome(x[0]))+'</span><i>'+nf(x[1])+'</i><span class="mu sm" style="width:72px;text-align:right">♡ '+(F[x[0]]||0)+' · 🛒 '+(C[x[0]]||0)+'</span></div>'}).join(''):'<div class="mu sm">Ainda sem dados.</div>')+'</div><button class="btn o w" type="button" data-shx>Fechar</button>')}
  else sheet('<div class="serif" style="font-size:23px">'+t[0]+'</div><div>'+(t[1].length?t[1].map(function(x,i){return '<div class="tl"><span class="k">'+(i+1)+'</span><span class="g">'+esc(t[2]?t[2](x[0]):x[0])+'</span><i>'+nf(x[1])+'</i></div>'}).join(''):'<div class="mu sm">Ainda sem dados.</div>')+ex+'</div><button class="btn o w" type="button" data-shx>Fechar</button>');
  var x=document.querySelector('#sh [data-shx]');if(x)x.onclick=function(){closeSheet()}}
$('aper').onclick=function(ev){var b=ev.target.closest('[data-ad]');if(!b)return;S.ad=+b.getAttribute('data-ad');Array.prototype.forEach.call(this.children,function(x){x.classList.toggle('on',x===b)});S.an=null;anlLoad()};
$('anlb').onclick=function(ev){var t=ev.target.closest('[data-anver],[data-anre],[data-anrel]');if(!t)return;
  if(t.hasAttribute('data-anre')){anlLoad();return}
  if(t.hasAttribute('data-anver')){anVer(t.getAttribute('data-anver'));return}
  (S.ad===7?Promise.resolve(S.an):fnPost(ANLF,{acao:'resumo',dias:7})).then(function(a){if(!a||!a.ok)throw 0;var tx=anRel(a);return navigator.clipboard.writeText(tx).then(function(){say('Relatório copiado.')},function(){sheet('<div class="serif" style="font-size:23px">Relatório da semana</div><textarea style="min-height:280px">'+esc(tx)+'</textarea><button class="btn o w" type="button" data-shx>Fechar</button>');document.querySelector('#sh [data-shx]').onclick=function(){closeSheet()}})}).catch(function(){say('Não consegui montar o relatório.',1)})};
setInterval(function(){if(!document.hidden&&!$('shell').hidden&&S.tok)msgLoad()},120000);
