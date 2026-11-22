
(function(){
  /* S181 (13/11): dentro do app (modo loja) o site mora em /loja/loja.html — o endereço nunca vira "/" (senão um recarregar abriria o app) */
  if(/[?&]loja=1/.test(location.search)&&window.parent!==window){(function(){var LJ=location.pathname;['pushState','replaceState'].forEach(function(k){var o=history[k];history[k]=function(s,t,u){try{if(u!=null){var x=new URL(u,location.href);x.pathname=LJ;if(!/[?&]loja=1/.test(x.search))x.search=(x.search?x.search+'&':'?')+'loja=1&nosync';u=x.pathname+x.search+x.hash}}catch(_){}return o.call(history,s,t,u)}})})()}
  var P=[];/* S422 (limpeza aprovada 18/11): a lista de 20 peças de exemplo saiu do site (nomes inventados e preços antigos). As peças vêm só da nuvem ou da última cópia guardada no aparelho (lf_pdocs); os testes injetam a lista de work/kit/pecas-teste.js na cópia de teste. */
  var ICON={ova:'<ellipse cx="30" cy="25" rx="23" ry="16"/><ellipse cx="90" cy="25" rx="23" ry="16"/><path d="M53 22Q60 17 67 22M7 20L2 17M113 20L118 17"/>',avi:'<path stroke-width="2.4" d="M52 11Q50 8 40 8Q18 7 10 15Q5 22 10 32Q16 43 33 43Q50 42 54 24Q55 14 52 11Z"/><path stroke-width="2.4" d="M68 11Q70 8 80 8Q102 7 110 15Q115 22 110 32Q104 43 87 43Q70 42 66 24Q65 14 68 11Z"/><path stroke-width="2.4" d="M52 10H68M55 20Q60 17 65 20"/>',ang:'<rect x="8" y="10" width="42" height="30" rx="3"/><rect x="70" y="10" width="42" height="30" rx="3"/><path d="M50 19Q60 14 70 19M8 15L1 11M112 15L119 11"/>',red:'<circle cx="30" cy="25" r="18"/><circle cx="90" cy="25" r="18"/><path d="M48 22Q60 16 72 22M12 20L3 15M108 20L117 15"/>',way:'<path d="M6 12H52V30Q52 40 40 40H18Q6 40 6 28Z"/><path d="M68 12H114V28Q114 40 102 40H80Q68 40 68 30Z"/><path d="M52 18Q60 14 68 18M6 16L0 12M114 16L120 12"/>',fin:'<ellipse cx="30" cy="25" rx="22" ry="16" stroke-width="1.6"/><ellipse cx="90" cy="25" rx="22" ry="16" stroke-width="1.6"/><path d="M52 23Q60 19 68 23" stroke-width="1.6"/>',alo:'<rect x="4" y="8" width="48" height="34" rx="9"/><rect x="68" y="8" width="48" height="34" rx="9"/><path d="M52 18Q60 13 68 18M4 14L0 11M116 14L120 11"/>',gat:'<path d="M6 16Q6 10 16 10H46Q54 10 52 24Q50 40 32 40Q6 40 6 16Z"/><path d="M68 24Q66 10 74 10H104Q114 10 114 16Q114 40 88 40Q70 40 68 24Z"/><path d="M52 16Q60 12 68 16M6 12L0 6M114 12L120 6"/>'};
  var FACES=[{"id": "oval", "nome": "Oval", "dica": "Armações de quase qualquer formato trazem equilíbrio e liberdade de escolha.", "ic": "way", "m": "/loja/media/i/428f6af5a765.png", "f": "/loja/media/i/bcdc589a95be.png", "wm": 0.64, "wf": 0.8375, "gm": [49.49, 53.8, 74.79], "gf": [49.3, 52.48, 55.0]}, {"id": "redondo", "nome": "Redondo", "dica": "Armações retangulares ou angulares trazem estrutura e alongam o rosto.", "ic": "ang", "m": "/loja/media/i/9ab7b593fca6.png", "f": "/loja/media/i/27767c040646.png", "wm": 0.6725, "wf": 0.85, "gm": [49.92, 54.07, 74.88], "gf": [49.93, 50.4, 57.98]}, {"id": "quadrado", "nome": "Quadrado", "dica": "Armações arredondadas ou ovais trazem suavidade e equilíbrio à mandíbula.", "ic": "ova", "m": "/loja/media/i/b57df54a8c85.png", "f": "/loja/media/i/283ae4caf0a7.png", "wm": 0.6325, "wf": 0.805, "gm": [49.65, 53.12, 75.65], "gf": [50.0, 52.54, 57.33]}, {"id": "alongado", "nome": "Alongado", "dica": "Armações grandes e largas trazem proporção e encurtam o rosto.", "ic": "alo", "m": "/loja/media/i/3ce001776234.png", "f": "/loja/media/i/1cd5b45bfb7a.png", "wm": 0.6125, "wf": 0.6275, "gm": [49.48, 52.94, 75.22], "gf": [47.49, 49.61, 71.8]}, {"id": "coracao", "nome": "Coração", "dica": "Armações aviador ou leves trazem equilíbrio e suavidade ao queixo.", "ic": "avi", "m": "/loja/media/i/93e9e7f328ca.png", "f": "/loja/media/i/f1e6a9689a21.png", "wm": 0.72, "wf": 0.71, "gm": [52.37, 54.68, 70.75], "gf": [49.6, 51.04, 64.29]}, {"id": "diamante", "nome": "Diamante", "dica": "Armações gatinho ou ovais trazem destaque e realce às maçãs do rosto.", "ic": "gat", "m": "/loja/media/i/21bdac22d73f.png", "f": "/loja/media/i/26554b09a3e5.png", "wm": 0.68, "wf": 0.6175, "gm": [47.93, 54.14, 67.52], "gf": [47.16, 56.31, 68.85]}];
  var TIPOS=[['todos','Todos'],['armacao','Armações'],['grau','Óculos de leitura'],['solar','Solares']];
  var st={tipo:'todos',gen:'',q:'',sort:'nov',rosto:'',cart:{},nome:'',zap:'',fav:{},cor:{},gr:{},cmp:[]};
  try{st.fav=JSON.parse(localStorage.getItem('lf_fav')||'{}')||{}}catch(_){st.fav={}}
  try{var _ct=JSON.parse(localStorage.getItem('lf_cart')||'null');if(_ct&&_ct.c){st.cart=_ct.c;st.cor=_ct.o||{}}}catch(_){}
  var CN={'#2a2d33':'Preto','#b08a4a':'Dourado','#8a8f98':'Prata','#7a3b2e':'Marrom','#3a5a7a':'Azul','#c98a9a':'Rosa','#6b4a2b':'Tartaruga','#4a2a55':'Roxo','#e3a1ab':'Rosa','#1d1d1f':'Preto','#d9d9d9':'Branco','#cfd6dc':'Transparente','#2f6fd0':'Azul','#b0b5bb':'Prata'};
  function corNome(p,i){if(p.cn&&p.cn[i||0])return p.cn[i||0];var c=p.cores&&p.cores[i||0];return CN[c]||('Cor '+((i||0)+1))}
  var WAI='<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  var HEART='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-8-4.9-8-11A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8 2.7c0 6.1-8 11-8 11z"/></svg>',CMPI='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>';
  var $=function(id){return document.getElementById(id)};
  var fmt=function(n){return LFI.fmt(n)},fmtL=function(p,q){return LFI.fmtD(LFI.pv(p.n)*q)};
  /* o lugar da foto existe sempre; quando a foto chega da nuvem, poeFoto preenche todos os lugares daquela peça (a tela aberta não fica esperando) */
  /* loading=lazy: a foto que está fora da tela (ou em tela fechada) só desce quando chega perto — as da 1ª tela ficam com a rede (internet fraca) */
  function vis(p){return '<img class="pf" data-pf="'+p.ref+'"'+(p.foto?' src="'+p.foto+'"':'')+' alt="'+esc(p.nome)+'" loading="lazy" decoding="async" draggable="false">'}
  function poeFoto(p,d){p.foto=d;document.querySelectorAll('[data-pf="'+p.ref+'"]').forEach(function(e){if(e.tagName==='IMG'){if(!e.getAttribute('src'))e.src=d}else if(!e.style.backgroundImage)e.style.backgroundImage='url("'+d+'")'})}
  function colorFoto(p,i,cb){if(!i){cb(p.foto);return}p.fc=p.fc||[];if(p.fc[i]){cb(p.fc[i]);return}fbg('fotos/'+p.ref+'~'+i).then(function(d){var o=fbd(d);if(o.d)p.fc[i]=o.d;cb(o.d||'')},function(){cb('')})}/* sem a foto da cor, avisa com '' (quem pediu decide o que mostrar) */
  function find(ref){return P.filter(function(p){return p.ref===ref})[0]}
  function bruto(){return Object.keys(st.cart).reduce(function(a,k){return a+st.cart[k]*find(k).n},0)}
  function brutoD(){return Object.keys(st.cart).reduce(function(a,k){return a+st.cart[k]*LFI.pv(find(k).n)},0)}
  /* Cupons (S174, aprovado 11/11/2026): 1 código por compra; não vale em peça em OFERTA ("ya tiene su mejor precio");
     em cada peça vale no máximo o % que o app liberou (cmx: nunca abaixo do piso). */
  st.cup=lsG('lf_cup',null);
  /* S192 (12/11): transportadoras do Delivery (só Paraguai). Preço e disponibilidade vêm do app (config/site.fretes = {id:{p:G$,off:true}});
     sem preço = frete pago na entrega. A escolha (Delivery + transportadora + endereço) fica salva para a próxima compra. */
  var TRANSP=[{id:'pya',n:'PedidosYa Envíos',t:'em até 60 min'},{id:'bolt',n:'Bolt Envío',t:'em até 60 min'},{id:'tiemsa',n:'Tiemsa',t:'1 a 2 dias úteis'},{id:'mcg',n:'MCGroup',t:'1 a 2 dias úteis'}];
  function trCfg(id){var f=(typeof CFG!=='undefined'&&CFG&&CFG.fretes)||{};return f[id]||{}}
  function trOk(id){return TRANSP.some(function(x){return x.id===id})&&!trCfg(id).off}
  function trNome(id){var x=TRANSP.filter(function(y){return y.id===id})[0];return x?x.n:''}
  function freteG(){return st.ent==='delivery'&&st.tr&&trOk(st.tr)?(+trCfg(st.tr).p||0):0}
  (function(){var le=lsG('lf_ent',null);if(le&&le.ent==='delivery'){st.ent='delivery';st.endIdx=le.i|0;if(le.tr){if(trOk(le.tr))st.tr=le.tr;else st.trFora=le.tr}st.entSalva=1}})();
  function trHtml(){var h='<label class="cfl">'+LFI.tr('Transportadora')+'</label>';
    if(st.trFora&&!st.tr)h+='<div class="note trno">'+LFI.tr('A transportadora da sua última compra')+' ('+esc(trNome(st.trFora))+') '+LFI.tr('não está disponível agora. Escolha outra.')+'</div>';
    else if(st.entSalva&&st.tr)h+='<div class="note trsv">✓ '+LFI.tr('Igual à sua última compra')+'</div>';
    return h+TRANSP.filter(function(x){return !trCfg(x.id).off}).map(function(x){var on=st.tr===x.id,pr=+trCfg(x.id).p||0;
      return '<button type="button" class="cfo ctr'+(on?' on':'')+'" data-cta="trpick" data-v="'+x.id+'" aria-pressed="'+on+'"><b>'+esc(x.n)+'</b><small>'+LFI.tr(x.t)+'</small><span class="cfpr">'+(pr?'<small>'+(LFI.cur==='BRL'?'R$':'G$')+'</small> '+LFI.fmtD(LFI.pv(pr)).replace(/^\S+\s/,''):'<i>'+LFI.tr('pago na entrega')+'</i>')+'</span></button>'}).join('')}
  function cupPeca(p){if(!st.cup||!p||p.aviso==='Esgotado')return {d:0,pct:0,of:false};if(isOf(p))return {d:0,pct:0,of:true};/* S194: cupom sempre cheio (10% é 10%); peça em que o % fura o piso fica fora, como a OFERTA */var pc=st.cup.pct||0;if((+p.cmx||0)<pc)return {d:0,pct:0,of:false,exc:true};return {d:pc>0?Math.floor(p.n*pc/100/1000)*1000:0,pct:pc,lim:false,of:false}}
  function aceitaCup(p){if(!p||isOf(p))return false;return (+p.cmx||0)>=((st.cup&&st.cup.pct)||10)}
  function cupConta(){var n=0,a=0;Object.keys(st.cart).forEach(function(k){var q=st.cart[k];n+=q;if(cupPeca(find(k)).d>0)a+=q});return {n:n,a:a}}
  function cupInfo(){var r={d:0,dD:0,por:{},min:false};if(!st.cup)return r;var b=bruto();if(st.cup.min&&b<st.cup.min){r.min=true;return r}
    Object.keys(st.cart).forEach(function(k){var p=find(k),x=cupPeca(p);if(x.d>0){r.d+=x.d*st.cart[k];r.dD+=Math.max(0,(LFI.pv(p.n)-LFI.pv(p.n-x.d)))*st.cart[k];r.por[k]=x.d*st.cart[k]}});return r}
  /* qual desconto vale no carrinho: 'cup' ou '' */
  function descVale(){return cupInfo().d>0?'cup':''}
  function descD(){return descVale()==='cup'?cupInfo().d:0}
  function descDD(){return descVale()==='cup'?cupInfo().dD:0}
  function cupFn(b){var o={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)},go=function(){return acFetch(fnUrl('cupom'),o).then(function(r){return r.json()})};
    /* S370 + S6 (20/11): quem está logada manda o login RENOVADO (idTok) em toda chamada — a nuvem reconhece a cliente (VIP) pela conta, nunca pelo telefone digitado; 'meus' exige o login */
    return idTok().then(function(t){o.headers.Authorization='Bearer '+t},function(){if(b.acao==='meus')throw 0}).then(go,function(){return {ok:false,motivo:'sessao'}})}
  function cupGuarda(c){st.cup=c?{cod:c.cod,pct:c.pct,tipo:c.tipo,fim:c.fim||0,min:c.min||0,restam:c.restam}:null;lsS('lf_cup',st.cup)}
  function cupTira(){cupGuarda(null)}
  function cupData(t){return t?new Date(t).toLocaleDateString(LFI.lang==='es'?'es-PY':'pt-BR'):''}
  function cupMsg(m,c){var cod=c&&c.cod?c.cod:'';return {nao:LFI.tr('Código não encontrado. Confira as letras.'),usado:LFI.tr('Este código já foi usado.'),vencido:LFI.tr('Este código venceu.'),cancelado:LFI.tr('Este código foi cancelado.'),
    ja:LFI.tr('Você já usou')+' '+cod+'. '+LFI.tr('Obrigado! Seu cartão de próxima compra continua valendo.'),esgotado:LFI.tr('Os cupons')+' '+cod+' '+LFI.tr('acabaram.'),outro:LFI.tr('Este código é pessoal, de outro telefone.'),
    trava:LFI.tr('Este código está travado por 24 h por tentativas erradas.'),proprio:LFI.tr('Seu código de amiga é para compartilhar: você ganha quando ela comprar.'),cliente:LFI.tr('Este código é só para a primeira compra.'),
    min:LFI.tr('Compra mínima de')+' '+fmt((c&&c.min)||0)+'.',cedo:LFI.tr('Este código ainda não começou a valer.'),pendente:LFI.tr('Este cartão começa a valer quando confirmarmos o pagamento.'),espera:LFI.tr('Muitas tentativas. Tente de novo em 1 hora.'),pausa:LFI.tr('Agora não há códigos novos. Tente no mês que vem.')}[m]||LFI.tr('Não deu para conferir o código agora. Tente de novo.')}
  function cupAplica(cod,cb){cod=String(cod||'').trim();if(!cod)return;var c=getConta()||{};
    cupFn({acao:'ver',cod:cod,tel:c.tel||'',email:c.email||(sessG()||{}).email||''}).then(function(j){if(j&&j.ok){cupGuarda(j.cupom);toast(LFI.tr('Código aplicado')+' ✓');}else toast(cupMsg(j&&j.motivo,j&&j.cupom));if(cb)cb(j)},function(){toast(LFI.tr('Não deu para conferir o código agora. Tente de novo.'));if(cb)cb(null)})}
  /* carrinho: linha do cartão desta compra — desenhada pelo bloco dos Cartões (S409, mais abaixo) */
  /* peça: "Tu código vale aquí ✓ − Gs. 13.000" / "Ya tiene su mejor precio" */
  var cupHtml,mtjCarrega;/* definidas no bloco dos Cartões (S409) */
  function cupPecaHtml(p){if(!st.cup)return '';var x=cupPeca(p);if(x.of)return '<div class="cupp of"><b>'+LFI.tr('Já tem o melhor preço')+'</b> · '+LFI.tr('o código fica para outra compra')+'</div>';
    if(!(x.d>0))return '<div class="cupp of">'+LFI.tr('O código')+' '+esc(st.cup.cod)+' '+LFI.tr('não vale nesta peça')+'</div>';
    return '<div class="cupp"><b>'+LFI.tr('Seu código vale aqui')+' ✓</b> · −'+LFI.fmtD(LFI.pv(x.d))+(x.lim?' ('+x.pct+'%)':'')+'</div>'}
  /* cartão virtual (Próxima compra) na tela de pagar e em Minha conta › Cartões */
  function pxHtml(c){if(!c)return '';var pend=c.estado==='pendente';return '<div class="pxc" id="pxcard"><small>LA FOUCH</small><b>'+c.pct+'% '+LFI.tr(c.tipo==='bv'?'na primeira compra':c.tipo==='am'?'para sua amiga':'na próxima compra')+'</b><code>'+esc(c.cod)+'</code><i>'+(pend?LFI.tr('Começa a valer quando confirmarmos o pagamento · fica em Minha conta › Cartões'):(c.fim?LFI.tr('Vale até')+' '+cupData(c.fim)+' · ':'')+LFI.tr('em lafouch.com e na loja'))+'</i></div>'}
  /* S367: pergunta antes de usar o cupom (Minha conta › Cartões) */
  function cupPergunta(cod){var c=(st._mtj||[]).filter(function(x){return x.cod===cod})[0];if(!c)return;var v=document.getElementById('cpov');if(v)v.remove();var o=document.createElement('div');o.id='cpov';o.className='bvov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label',LFI.tr('Usar este cupom?'));
    o.innerHTML='<div class="bvb"><small>LA FOUCH</small><h3>'+LFI.tr('Usar este cupom?')+'</h3>'+pxHtml(c).replace(' id="pxcard"','')+'<p class="cupn">'+LFI.tr('O desconto entra no seu carrinho e vale nesta compra.')+'</p><button type="button" class="btn w" data-cupsim="'+esc(c.cod)+'">'+LFI.tr('Usar cupom')+'</button><button type="button" class="cfx" data-cupnao style="min-height:44px">'+LFI.tr('Agora não')+'</button></div>';
    document.body.appendChild(o);var b=o.querySelector('[data-cupsim]');if(b)b.focus()}
  function cupVaiCatalogo(){closeLayer();setTimeout(function(){var v=document.getElementById('vitrine');if(v){try{v.scrollIntoView({block:'start',behavior:'auto'})}catch(_){v.scrollIntoView()}}},60)}
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-cupperg],[data-cupsim],[data-cupnao]');var ov=document.getElementById('cpov');
    if(!t){if(ov&&e.target===ov)ov.remove();return}
    if(t.hasAttribute('data-cupperg')){cupPergunta(t.getAttribute('data-cupperg'))}
    else if(t.hasAttribute('data-cupnao')){if(ov)ov.remove()}
    else{t.disabled=true;cupAplica(t.getAttribute('data-cupsim'),function(j){if(ov)ov.remove();if(j&&j.ok)cupVaiCatalogo()})}});
  document.addEventListener('keydown',function(e){var a=document.activeElement;if((e.key==='Enter'||e.key===' ')&&a&&a.getAttribute&&a.getAttribute('role')==='button'&&a.hasAttribute('data-cupperg')&&!document.getElementById('cpov')){e.preventDefault();cupPergunta(a.getAttribute('data-cupperg'))}});
  /* boas-vindas depois de se inscrever nas novidades */
  
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-cupx],[data-cupusar],[data-cupcopy],[data-bvx]');if(!t)return;
    if(t.hasAttribute('data-cupx')){cupTira();bag(true)}
    else if(t.hasAttribute('data-cupusar')){var bo=document.getElementById('bvov');if(bo)bo.remove();cupAplica(t.getAttribute('data-cupusar'),function(j){if(j&&j.ok){closeLayer();setTimeout(function(){bag()},50)}})}
    else if(t.hasAttribute('data-cupcopy')){var cd=t.getAttribute('data-cupcopy');try{navigator.clipboard.writeText(cd+' · https://lafouch.com/t/'+cd).then(function(){toast(LFI.tr('Código copiado'))})}catch(_){}}
    else if(t.hasAttribute('data-bvx')){var bb=document.getElementById('bvov');if(bb)bb.remove()}});
  /* S181 (aprovado 12/11): MODO LOJA — o app leva uma cópia deste site e abre em loja.html?loja=1&nosync dentro do modo cliente.
     O app manda TODO o inventário (preço de varejo, com as ofertas do site) por postMessage; "Comprar" vira "Quero este";
     o cliente junta as peças em "Meu pedido" e toca "Llamar a un vendedor"; o vendedor encontra as peças no carrinho do app. */
  if(/[?&]loja=1/.test(location.search)&&window.parent!==window){document.documentElement.classList.add('lojamodo');
    var LP=[];
    var lojaPosta=function(o){try{window.parent.postMessage(Object.assign({lfLoja:1},o),'*')}catch(_){}};
    var lojaBarra=function(){var b=$('lojab'),es=LFI.lang==='es';if(!b){b=document.createElement('div');b.id='lojab';b.innerHTML='<button type="button" id="lojap"><span id="lojat"></span><span id="lojac"></span></button>';document.body.appendChild(b);$('lojap').onclick=lojaPed}var n=LP.reduce(function(a,x){return a+x.q},0);b.setAttribute('data-n',n);$('lojat').textContent=LFI.tr('Meu pedido')+' · '+n+' '+(n===1?(es?'pieza':'peça'):(es?'piezas':'peças'));$('lojac').textContent=(es?'Llamar a un vendedor':'Chamar um vendedor')+' ›'};
    var lojaPed=function(){var es=LFI.lang==='es';layer('<aside class="panel lojpn" role="dialog" aria-modal="true" aria-label="Meu pedido"><div class="xw"><button class="x" data-close aria-label="Fechar">×</button></div><h2 class="sepT">'+LFI.tr('Meu pedido')+'</h2>'+(LP.length?LP.map(function(x,i){var p=find(x.ref)||{};return '<div class="lojl"><span class="lojim">'+vis(p)+'</span><span><b>'+esc(nomeSC(p)||x.ref)+'</b><small>'+esc([x.ref,x.cor,x.grau].filter(Boolean).join(' · '))+(x.q>1?' · '+x.q+' un.':'')+'</small></span><b>'+fmt((p.n||0)*x.q)+'</b><button type="button" class="cupx" data-lrm="'+i+'" aria-label="Tirar">×</button></div>'}).join(''):'<p class="sepS">'+LFI.tr('Toque em "Quero este" nas peças que você gostou.')+'</p>')+
      (LP.length?'<button type="button" class="btn w" id="lojch">'+(es?'Llamar a un vendedor':'Chamar um vendedor')+'</button>':'')+'<button type="button" class="btn w alt" data-close>'+(es?'Seguir mirando':'Continuar olhando')+'</button><p class="sepS" style="text-align:center;margin-top:10px">'+LFI.tr('O vendedor vê estas peças no carrinho do app.')+'</p></aside>');
      var ch=$('lojch');if(ch)ch.onclick=function(){lojaPosta({t:'chama',itens:LP});ch.disabled=true;ch.textContent=es?'Ya avisamos · ya viene':'Já avisamos · já vem'};
      document.querySelectorAll('#layer [data-lrm]').forEach(function(b){b.onclick=function(){LP.splice(+b.getAttribute('data-lrm'),1);lojaPosta({t:'pedido',itens:LP});lojaBarra();lojaPed()}})};
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-addm]');if(!t)return;e.preventDefault();e.stopImmediatePropagation();
      var ref=t.getAttribute('data-addm'),p=find(ref);if(!p)return;var ci=st.cor[ref]||0,gi=st.gr&&st.gr[ref]||0,bq=t.closest('[data-q]'),q=Math.max(1,+(bq&&bq.getAttribute('data-q'))||1);
      var it={ref:ref,ci:ci,cor:(p.cores&&p.cores.length>1)?corNome(p,ci):'',grau:(p.gr&&p.gr.length)?String(p.gr[gi]):'',q:q};
      var ex=LP.filter(function(x){return x.ref===it.ref&&x.ci===it.ci&&x.grau===it.grau})[0];if(ex)ex.q+=q;else LP.push(it);
      lojaPosta({t:'pedido',itens:LP});lojaBarra();toast(LFI.tr('No Meu pedido')+' ✓')},true);
    addEventListener('message',function(e){var d=e.data||{};if(!d.lfLoja)return;
      if(d.t==='dados'&&Array.isArray(d.docs)){if(d.cfg)CFG=Object.assign({ativo:true},CFG,d.cfg);syncProds(d.docs);try{redraw()}catch(_){}}
      if(d.t==='limpa'){LP=[];lojaBarra();try{closeLayer()}catch(_){}try{location.hash='';scrollTo(0,0)}catch(_){}}});
    /* 13/11: toques dentro do site não chegam ao app — avisa que o cliente está usando (o app só limpa depois de 2 min parado) */
    var lojaAt=0;['pointerdown','scroll','keydown'].forEach(function(n){addEventListener(n,function(){var ag=Date.now();if(ag-lojaAt>5000){lojaAt=ag;lojaPosta({t:'ativo'})}},{passive:true,capture:true})});
    setTimeout(function(){lojaBarra();lojaPosta({t:'pronto'})},300)}
  /* S191 v2 (12/11): Conta Atacadista/Mayorista — lafouch.com/atacado?c=ID. Entra com o e-mail + código de 6 números; o aparelho fica
     guardado (até o limite da conta); os preços da tabela vêm da função "atacado" (nunca do site público); marca d'água com o nome. */
  try{(function(){var u=new URLSearchParams(location.search),C=u.get('c');if(!C||!/^[A-Za-z0-9_-]{4,40}$/.test(C))return;
    var es=function(){return LFI.lang==='es'},T=function(p,e){return es()?e:p},K='lf_at_'+C,dev=lsG('lf_atdev','');if(!dev){dev='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);lsS('lf_atdev',dev)}
    var A={tok:lsG(K,''),conta:null,itens:[],min:0,tab:'',q:{},f:'',email:''};
    var fn=function(b){return acFetch(fnUrl('atacado'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({c:C,dev:dev,tok:A.tok},b))}).then(function(r){return r.json()})};
    var devNome=function(){var ua=navigator.userAgent;return /iPhone/.test(ua)?'iPhone':/iPad/.test(ua)?'iPad':/Android/.test(ua)?((ua.match(/Android [^;]+; ([^)]+?)( Build|\))/)||[])[1]||'Android'):/Windows/.test(ua)?'Windows':/Mac/.test(ua)?'Mac':'Navegador'};
    var usd=function(v){return 'US$ '+(+v||0).toFixed(2).replace('.',',')};
    var tela=function(h){layer('<aside class="panel atp" role="dialog" aria-modal="true" aria-label="Atacado"><div class="xw"><button class="x" data-close aria-label="Fechar">×</button></div><span class="atk">'+T('CONTA ATACADISTA','CUENTA MAYORISTA')+(A.tab?' · '+esc(A.tab).toUpperCase():'')+'</span>'+h+'</aside>')};
    var bloq=function(m){var t={pausada:[T('Acesso pausado','Acceso en pausa'),T('A La Fouch pausou este catálogo. Fale com a loja para voltar.','La Fouch pausó este catálogo. Hablá con la tienda.')],cancelada:[T('Acesso encerrado','Acceso finalizado'),T('Peça um novo acesso à La Fouch.','Pedí un nuevo acceso a La Fouch.')],vencida:[T('Acesso vencido','Acceso vencido'),T('O acesso de visitante vale 3 dias. Peça um novo.','El acceso de visitante vale 3 días. Pedí uno nuevo.')],'lote-fim':[T('Lote finalizado','Lote finalizado'),T('Este lote venceu ou foi encerrado. Peça um novo à La Fouch.','Este lote venció o fue cerrado. Pedí uno nuevo a La Fouch.')],'ja-confirmado':[T('Pedido já confirmado','Pedido ya confirmado'),T('Este pedido do lote já foi confirmado. A La Fouch vai falar com você.','Este pedido del lote ya fue confirmado. La Fouch te va a escribir.')],cheio:[T('Acesso pessoal','Acceso personal'),T('Este catálogo de atacado é de uso pessoal e já está ativo em outros aparelhos.','Este catálogo mayorista es de uso personal y ya está activo en otros dispositivos.')]}[m]||[T('Não deu para abrir','No se pudo abrir'),T('Tente de novo em instantes.','Probá de nuevo en un momento.')];
      tela('<div class="atb"><div class="atlk">🔒</div><h2>'+t[0]+'</h2><p>'+t[1]+'</p><a class="btn w" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(T('Olá! Preciso de ajuda com o meu acesso de atacado.','¡Hola! Necesito ayuda con mi acceso mayorista.'))+'">'+T('Falar com a La Fouch','Hablar con La Fouch')+'</a></div>')};
    var entrar=function(msg){tela('<h2 class="ath">'+T('Catálogo de atacado','Catálogo mayorista')+'</h2><p class="ats">'+T('A La Fouch liberou o catálogo de atacado para você. Confirme seu e-mail para entrar.','La Fouch liberó el catálogo mayorista para vos. Confirmá tu e-mail para entrar.')+'</p><div class="cfc"><input class="field" id="atem" type="email" inputmode="email" autocomplete="email" placeholder="e-mail" value="'+esc(A.email)+'">'+(A.cod?'<label class="cfl">'+T('Enviamos um código de 6 números:','Enviamos un código de 6 números:')+'</label><input class="field atcod" id="atcod" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••••">':'')+(msg?'<small class="cupn cupe" role="alert">'+esc(msg)+'</small>':'')+'<button type="button" class="btn w" id="atgo">'+(A.cod?T('Entrar','Entrar'):T('Receber o código','Recibir el código'))+'</button></div><p class="atn">🔒 '+T('Acesso pessoal','Acceso personal')+'</p>');
      $('atgo').onclick=function(){var b=$('atgo');b.disabled=true;A.email=$('atem').value.trim();
        if(!A.cod){fn({acao:'entrar',email:A.email}).then(function(j){if(j&&j.ok){A.cod=1;entrar()}else if(j&&/pausada|cancelada|vencida/.test(j.motivo))bloq(j.motivo);else entrar(j&&j.motivo==='espera'?T('Espere um pouco para pedir outro código.','Esperá un poco para pedir otro código.'):T('Este e-mail não é o desta conta.','Este e-mail no es el de esta cuenta.'))},function(){entrar(T('Sem conexão. Tente de novo.','Sin conexión. Probá de nuevo.'))});return}
        fn({acao:'confirma',cod:$('atcod').value.trim(),devNome:devNome()}).then(function(j){if(j&&j.ok){A.tok=j.tok;lsS(K,A.tok);A.cod=0;abre()}else if(j&&j.motivo==='cheio')bloq('cheio');else entrar(T('Código errado ou vencido.','Código incorrecto o vencido.'))},function(){entrar(T('Sem conexão. Tente de novo.','Sin conexión. Probá de nuevo.'))})}};
    var tot=function(){var t=0,n=0;Object.keys(A.q).forEach(function(k){var r=k.split('|')[0],it=A.itens.filter(function(x){return x.ref===r})[0];if(it){t+=A.q[k]*it.usd;n+=A.q[k]}});return {t:t,n:n}};
    /* S206 (13/11): moeda que a loja escolhe (começa na do dono), câmbio do dia, lote, estoque ao vivo e separação de 30 min */
    var LT=u.get('l')||'',fxU=function(){var a=A.itens.filter(function(i){return i.usd>0&&i.gs>0}).map(function(i){return i.gs/i.usd}).sort(function(a,b){return a-b});return a.length?a[a.length>>1]:7300},
      fxB=function(){return (typeof CFG!=='undefined'&&CFG.cotacao&&CFG.cotacao.brl>0)?CFG.cotacao.brl:1390},
      mo=function(v,m){m=m||A.mo||'usd';if(m==='gs')return 'Gs. '+mil(Math.round(v*fxU()/1000)*1000);if(m==='brl')return 'R$ '+(v*fxU()/fxB()).toFixed(2).replace('.',',');return usd(v)},
      mo2=function(v){return (A.mo||'usd')==='usd'?'Gs. '+mil(Math.round(v*fxU()/1000)*1000):usd(v)},
      livre=function(i){return (i.cores||[]).reduce(function(a,c){return a+(+c[1]||0)},0)},
      cambio=function(){return '<div class="atcm"><span class="cb"><i></i>US$ 1 = Gs. '+mil(Math.round(fxU()))+' · R$ 1 = Gs. '+mil(Math.round(fxB()))+'</span><div class="atmo">'+[['usd','US$'],['gs','Gs.'],['brl','R$']].map(function(x){return '<button type="button" data-mo="'+x[0]+'" class="'+((A.mo||'usd')===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div></div>'},
      relogio=function(){if(!A.sepFim||A.sepFim<Date.now()||!Object.keys(A.q).length)return '';var r=Math.max(0,A.sepFim-Date.now()),m=Math.floor(r/60000),sx=Math.floor(r%60000/1000);return '<span class="atsep2">⏱ '+T('Suas peças ficam separadas','Tus piezas quedan separadas')+' '+m+':'+(sx<10?'0':'')+sx+'</span>'},
      sepT={},separa=function(k){clearTimeout(sepT[k]);sepT[k]=setTimeout(function(){var p=k.split('|'),quer=A.q[k]||0;fn({acao:'separa',ref:p[0],cor:p[1],q:quer,l:LT}).then(function(j){if(!j||!j.ok)return;if(j.fim)A.sepFim=j.fim;if(j.q<quer){if(j.q)A.q[k]=j.q;else delete A.q[k];toast(T('Só restam ','Solo quedan ')+j.q+'. '+T('As outras estão separadas; avisamos se liberarem.','Las otras están reservadas; te avisamos si se liberan.'));if(A.tela==='peca')peca(p[0]);else lista()}else{var b=document.querySelector('#layer .atbar');if(b)b.outerHTML=barra();liga()}})},350)};
    var foto=function(it){return (it.foto?'<img src="/'+esc(it.foto)+'" alt="" loading="lazy">':'')+'<i class="atwm">'+esc((A.conta&&A.conta.nome)||'')+' · '+esc((A.conta&&A.conta.nome)||'')+'</i>'};
    var barra=function(){var x=tot(),fal=Math.max(0,A.min-x.t);return '<div class="atbar"><div><span>'+T('Pedido','Pedido')+': <b>'+mo(x.t)+'</b> · '+x.n+' '+T('peças','piezas')+'</span>'+(fal>0?'<em>'+T('faltam','faltan')+' '+mo(fal)+'</em>':x.n?'<em>✓ '+T('mínimo alcançado','mínimo alcanzado')+'</em>':'')+'</div>'+relogio()+'<button type="button" class="btn w" id="atenv"'+(x.n&&fal<=0?'':' disabled style="opacity:.5"')+'>'+(A.lote?T('Confirmar pedido do lote','Confirmar pedido del lote'):T('Enviar pedido','Enviar pedido'))+'</button></div>'};
    var lista=function(){var cats=[['',T('Todos','Todos')],['armacao',T('Armações','Armazones')],['solar',T('Solar','Sol')],['grau',T('Leitura','Lectura')],['pre',T('Leitura','Lectura')]],tem={};A.itens.forEach(function(i){tem[i.tipo]=1});
      var L=A.itens.filter(function(i){return !A.f||i.tipo===A.f});A.tela='lista';var lt=A.lote;
      tela('<h2 class="ath">'+(lt&&lt.nome?esc(lt.nome):lt?T('Lote preparado para você','Lote preparado para vos'):T('Catálogo de atacado','Catálogo mayorista'))+'</h2><p class="ats">'+T('Preços para','Precios para')+' '+esc(A.conta.nome)+(A.min?' · '+T('compras a partir de','compras desde')+' '+mo(A.min):'')+' · <a href="#" id="atap">'+T('Meus aparelhos','Mis dispositivos')+'</a></p>'+cambio()+
        (lt?'<div class="atlt"><small>'+T('LOTE','LOTE')+(lt.ate?' · '+T('VALE ATÉ','VÁLIDO HASTA')+' '+new Date(lt.ate).toLocaleDateString(es()?'es-PY':'pt-BR',{day:'2-digit',month:'2-digit'}):'')+'</small><b>'+A.itens.length+' '+T('modelos · estoque ao vivo','modelos · stock en vivo')+'</b><span>'+T('Preço garantido até a validade. Quem confirma primeiro leva; o que você coloca fica separado 30 min.','Precio garantizado hasta la validez. Quien confirma primero se lo lleva; lo que agregues queda separado 30 min.')+'</span></div>':'')+
        '<div class="atf">'+cats.filter(function(c,i){return !c[0]||(tem[c[0]]&&!(c[0]==='pre'&&tem.grau))}).map(function(c){return '<button type="button" data-f="'+c[0]+'" class="'+(A.f===c[0]?'on':'')+'">'+c[1]+'</button>'}).join('')+'</div>'+
        '<div class="atg">'+L.map(function(i){var n=Object.keys(A.q).filter(function(k){return k.split('|')[0]===i.ref}).reduce(function(a,k){return a+A.q[k]},0);var lv=livre(i),ago=lv<=0&&!n;return '<button type="button" class="atc'+(ago?' atgo':'')+(lt&&lt.q&&lt.q[i.ref]?' atinl':'')+'" data-r="'+esc(i.ref)+'"><span class="atph">'+foto(i)+(n?'<b class="atq">'+n+'</b>':'')+'</span><small>'+esc(i.ref)+' · '+esc(i.nome||'')+'</small><b>'+mo(i.usd)+' <i>'+mo2(i.usd)+'</i></b><small>'+(i.cores||[]).length+' '+((i.cores||[]).length===1?T('cor','color'):T('cores','colores'))+' · <u>'+(ago?T('esgotado','agotado'):T('em estoque','en stock'))+'</u></small>'+(ago?'<span class="ago">'+T('Esgotou','Se agotó')+'</span><span class="ags"><span role="button" tabindex="0" data-par="'+esc(i.ref)+'">'+T('Ver parecido','Ver parecido')+'</span><span role="button" tabindex="0" data-avs="'+esc(i.ref)+'">'+(A.av&&A.av[i.ref]?'✓ '+T('Avisaremos','Te avisamos'):'🔔 '+T('Avise-me','Avisame'))+'</span></span>':lv<=12?'<span class="atlv"><i></i>'+T('restam','quedan')+' '+lv+'</span>':'')+'</button>'}).join('')+'</div>'+barra());
      liga()};
    var peca=function(ref){var i=A.itens.filter(function(x){return x.ref===ref})[0];if(!i)return;
      tela('<button type="button" class="cfx" id="atvol">‹ '+T('Catálogo','Catálogo')+'</button><div class="atph atbig">'+foto(i)+'</div><h2 class="ath">'+esc(i.nome||i.ref)+'</h2><p class="ats">'+esc(i.ref)+(i.mat?' · '+esc(i.mat):'')+'</p><div class="atpr">'+mo(i.usd)+' <i>'+mo2(i.usd)+' '+T('por peça','por pieza')+'</i></div>'+
        '<div class="cfc"><label class="cfl">'+T('Quantidade por cor','Cantidad por color')+'</label>'+(i.cores||[]).map(function(c){var k=ref+'|'+c[0],v=A.q[k]||0;return '<div class="atr"><span><b>'+esc(c[0]||'—')+'</b><small>'+c[1]+' '+T('em estoque','en stock')+'</small></span><span class="qty"><button type="button" data-k="'+esc(k)+'" data-d="-1" aria-label="Menos">−</button><span>'+v+'</span><button type="button" data-k="'+esc(k)+'" data-d="1" data-mx="'+c[1]+'" aria-label="Mais">+</button></span></div>'}).join('')+'</div>'+barra());
      $('atvol').onclick=lista;document.querySelectorAll('#layer .atr button').forEach(function(b){b.onclick=function(){var k=b.getAttribute('data-k'),v=(A.q[k]||0)+(+b.getAttribute('data-d')),mx=+b.getAttribute('data-mx')||999;A.q[k]=Math.max(0,Math.min(mx,v));if(!A.q[k])delete A.q[k];separa(k);peca(ref)}});A.tela='peca';liga()};
    var aparelhos=function(){var c=A.conta;tela('<button type="button" class="cfx" id="atvol">‹ '+T('Catálogo','Catálogo')+'</button><h2 class="ath">'+T('Meus aparelhos','Mis dispositivos')+'</h2><p class="ats">'+T('Sua conta abre em até','Tu cuenta abre en hasta')+' '+c.dispMax+' '+T('aparelhos.','dispositivos.')+'</p><div class="cfc">'+c.aparelhos.map(function(a){return '<div class="atr"><span><b>'+esc(a.nome)+(a.id===dev?' <em class="atme">'+T('este aparelho','este dispositivo')+'</em>':'')+'</b><small>'+new Date(a.ult||a.ts).toLocaleDateString()+'</small></span>'+(c.podeRemover&&a.id!==dev?'<button type="button" class="cfx" data-rm="'+esc(a.id)+'">'+T('Remover','Quitar')+'</button>':'')+'</div>'}).join('')+'</div><p class="atn">'+T('A La Fouch é avisada de cada troca.','La Fouch es avisada de cada cambio.')+'</p>');
      $('atvol').onclick=lista;document.querySelectorAll('#layer [data-rm]').forEach(function(b){b.onclick=function(){b.disabled=true;fn({acao:'remove',alvo:b.getAttribute('data-rm')}).then(function(j){if(j&&j.ok){A.conta=j.conta;aparelhos()}else toast(T('A troca de aparelho está bloqueada. Fale com a La Fouch.','El cambio de dispositivo está bloqueado. Hablá con La Fouch.'))})}})};
    var liga=function(){document.querySelectorAll('#layer .atf button').forEach(function(b){b.onclick=function(){A.f=b.getAttribute('data-f');lista()}});document.querySelectorAll('#layer [data-mo]').forEach(function(b){b.onclick=function(){A.mo=b.getAttribute('data-mo');lsS('lf_atmo_'+C,A.mo);if(A.tela==='peca'&&A.pc)peca(A.pc);else lista()}});
      document.querySelectorAll('#layer .atc').forEach(function(b){b.onclick=function(e){var pr=e.target.closest('[data-par]'),av=e.target.closest('[data-avs]');if(pr){var o=A.itens.filter(function(x){return x.ref===pr.getAttribute('data-par')})[0]||{},q=A.itens.filter(function(x){return x.ref!==o.ref&&x.tipo===o.tipo&&livre(x)>0}).sort(function(a,b){return (b.mat===o.mat)-(a.mat===o.mat)})[0];if(q)peca(q.ref);else toast(T('Sem parecido em estoque agora.','No hay parecido en stock ahora.'));return}if(av){var r=av.getAttribute('data-avs');A.av=A.av||{};A.av[r]=1;lsS('lf_atav_'+C,A.av);fn({acao:'avisame',ref:r,l:LT});lista();return}if(b.classList.contains('atgo'))return;A.pc=b.getAttribute('data-r');peca(A.pc)}});var ap=$('atap');if(ap)ap.onclick=function(e){e.preventDefault();aparelhos()};
      var en=$('atenv');if(en)en.onclick=function(){en.disabled=true;fn({acao:'pedido',l:LT,itens:Object.keys(A.q).map(function(k){var p=k.split('|');return {ref:p[0],cor:p[1],q:A.q[k]}})}).then(function(j){if(j&&j.ok){A.q={};tela('<div class="atb"><div class="atlk">✓</div><h2>'+T('Pedido enviado','Pedido enviado')+'</h2><p>'+usd(j.usd)+' · '+j.pecas+' '+T('peças. A La Fouch vai confirmar pelo WhatsApp.','piezas. La Fouch va a confirmar por WhatsApp.')+'</p><button type="button" class="btn w" id="atvol">'+T('Voltar ao catálogo','Volver al catálogo')+'</button></div>');$('atvol').onclick=lista}else{toast(j&&j.motivo==='minimo'?T('Faltam','Faltan')+' '+usd(j.falta):T('Não deu para enviar. Tente de novo.','No se pudo enviar. Probá de nuevo.'));lista()}},function(){toast(T('Sem conexão.','Sin conexión.'));lista()})}};
    var abre=function(){if(!A.tok){entrar();return}fn({acao:'catalogo',l:LT}).then(function(j){if(j&&j.ok){A.conta=j.conta;A.itens=j.itens||[];A.min=j.minimo||0;A.tab=j.tabela||'';A.lote=j.lote||null;A.mo=lsG('lf_atmo_'+C,'')||j.moeda||'usd';A.av=lsG('lf_atav_'+C,null)||{};
        if(j.sep&&j.sep.fim>Date.now()){A.sepFim=j.sep.fim;Object.keys(j.sep.itens||{}).forEach(function(k){A.q[k]=j.sep.itens[k]})}else if(A.lote&&!Object.keys(A.q).length&&!lsG('lf_atlq_'+C+LT,0)){Object.keys(A.lote.q||{}).forEach(function(r){Object.keys(A.lote.q[r]||{}).forEach(function(c){var it=A.itens.filter(function(x){return x.ref===r})[0],tem=it?((it.cores||[]).filter(function(z){return z[0]===c})[0]||[0,0])[1]:0,q=Math.min(+A.lote.q[r][c]||0,tem);if(q>0){A.q[r+'|'+c]=q;separa(r+'|'+c)}})});lsS('lf_atlq_'+C+LT,1)}
        lista();vivo()}else if(j&&j.motivo==='sessao'){A.tok='';lsS(K,'');entrar()}else bloq(j&&j.motivo)},function(){bloq('')})};
    /* estoque ao vivo: relê a cada 20 s com o catálogo aberto; avisa quando volta o que a loja pediu */
    var vivo=function(){if(A._v)return;A._v=setInterval(function(){if(!document.querySelector('#layer .atp')){clearInterval(A._v);A._v=0;return}if(document.hidden)return;
      fn({acao:'catalogo',l:LT}).then(function(j){if(!j||!j.ok)return;var antes={};A.itens.forEach(function(i){antes[i.ref]=livre(i)});A.itens=j.itens||A.itens;var volt=A.itens.filter(function(i){return A.av&&A.av[i.ref]&&!antes[i.ref]&&livre(i)>0});
        volt.forEach(function(i){toast(T('Voltaram ','Volvieron ')+livre(i)+' '+T('do','del')+' '+i.ref);delete A.av[i.ref]});if(volt.length)lsS('lf_atav_'+C,A.av);
        if(A.tela==='lista'&&!document.querySelector('#layer :focus'))lista();else{var b=document.querySelector('#layer .atbar');if(b){b.outerHTML=barra();liga()}}})},20000)};
    setInterval(function(){var e=document.querySelector('#layer .atsep2');if(e)e.outerHTML=relogio()},1000);
    setTimeout(abre,900)})()}catch(_){}
  /* S185: "Separado para vos" — lafouch.com/s/REF.REF~Nome (o 404 manda para ?s=&n=); abre por cima do Início com as peças escolhidas */
  try{(function(){var u=new URLSearchParams(location.search),qs=u.get('s');if(!qs)return;var nm=String(u.get('n')||'').replace(/[<>"&]/g,'').slice(0,30),refs=qs.split(/[.,]/).filter(Boolean).slice(0,12);
    var abre=function(n){var L=refs.map(find).filter(Boolean);if(!L.length){if(n<20)setTimeout(function(){abre(n+1)},400);return}var es=LFI.lang==='es';
      var h='<aside class="panel sepp" role="dialog" aria-modal="true" aria-label="'+(es?'Separado para vos':'Separado para você')+'"><div class="xw"><button class="x" data-close aria-label="Fechar">×</button></div><h2 class="sepT">'+(es?'Separado para vos':'Separado para você')+(nm?', '+esc(nm):'')+'</h2><p class="sepS">'+LFI.tr('Toque numa peça para ver. "Quero esta" avisa a loja.')+'</p><div class="sepG">'+L.map(function(p){return card5(p)}).join('')+'</div>'+
        '<a class="btn w" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent((es?'¡Hola! Me gustaron estas piezas: ':'Olá! Gostei destas peças: ')+L.map(function(p){return p.ref}).join(', '))+'">'+LFI.tr('Quero estas · falar com a loja')+'</a></aside>';
      layer(h);try{var x=new URL(location.href);x.searchParams.delete('s');x.searchParams.delete('n');history.replaceState(history.state,'',x.pathname+x.search+x.hash)}catch(_){}};
    setTimeout(function(){abre(0)},700)})()}catch(_){}
  /* link do cartão: lafouch.com/t/CÓDIGO (a página 404 manda para ?t=) */
  try{var qt=new URLSearchParams(location.search).get('t');if(qt)setTimeout(function(){cupAplica(qt);try{var u=new URL(location.href);u.searchParams.delete('t');history.replaceState(history.state,'',u.pathname+u.search+u.hash)}catch(_){}},900)}catch(_){}
  function total(){return bruto()-descD()}
  function totalD(){return brutoD()-descDD()}
  function qtd(){return Object.keys(st.cart).reduce(function(a,k){return a+st.cart[k]},0)}
  function toast(t,act){var e=document.createElement('div');e.className='toast';e.appendChild(document.createTextNode(t));if(act){var b=document.createElement('button');b.type='button';b.textContent=act;b.setAttribute('data-bag','1');e.appendChild(b)}document.body.appendChild(e);setTimeout(function(){e.remove()},act?4200:2200)}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  /* busca tolerante (v465 do app, mesmo código: src/00b-busca-tolerante.js) */
  // ===== v465: busca tolerante (aprovada 08/11/2026) — o MESMO código vai no site (index.html, function btol...) =====
  // oculos = Óculos · exagonal = hexagonal · coracao = Coração · armasao = armação · 1 letra errada passa.
  // Cada palavra vale sozinha e em qualquer ordem; português e espanhol juntos; o mais parecido vem primeiro.
  var BTOL_SIN = [
    ['oculos', 'lentes', 'anteojos', 'gafas'],
    ['armacao', 'armacoes', 'armazon', 'armazones', 'montura'],
    ['solar', 'sol', 'solares'],
    ['leitura', 'lectura', 'pregraduado', 'pregrad', 'receta', 'grau'],
    ['preto', 'preta', 'negro', 'negra'],
    ['branco', 'branca', 'blanco', 'blanca'],
    ['dourado', 'dourada', 'dorado', 'dorada', 'ouro', 'oro'],
    ['prateado', 'prateada', 'plateado', 'plateada', 'prata', 'plata'],
    ['vermelho', 'vermelha', 'rojo', 'roja'],
    ['azul'],
    ['verde'],
    ['rosa', 'rosado', 'rosada'],
    ['roxo', 'roxa', 'morado', 'morada', 'lilas', 'violeta'],
    ['marrom', 'marron', 'cafe'],
    ['tartaruga', 'carey', 'havana'],
    ['transparente', 'cristal', 'translucido', 'translucida'],
    ['coracao', 'corazon'],
    ['redondo', 'redonda'],
    ['quadrado', 'quadrada', 'cuadrado', 'cuadrada'],
    ['retangular', 'rectangular'],
    ['gatinho', 'gatito', 'gato', 'cateye'],
    ['aviador', 'aviadores', 'piloto', 'pilotos', 'aviator'],
    ['hexagonal', 'hexagono'],
    ['feminino', 'feminina', 'femenino', 'mujer', 'dama'],
    ['masculino', 'hombre', 'caballero'],
    ['unissex', 'unisex'],
    ['acetato'],
    ['metal', 'metalico', 'metalica'],
    ['polarizado', 'polarizada'],
    ['espelhado', 'espelhada', 'espejado', 'espejada']
  ];
  var BTOL_IX = (function () {
    var m = {};
    BTOL_SIN.forEach(function (g) {
      g.forEach(function (w) {
        m[btolFold(w)] = g.map(btolFold);
      });
    });
    return m;
  })();
  // minúsculo, sem acento e com os sons iguais juntos (h mudo, ç/s/ss/z, ch/x, y/i, k/qu/c, lh, nh, letra dobrada)
  function btolFold(t) {
    t = String(t == null ? '' : t)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
    t = t
      .replace(/(\d),(\d)/g, '$1.$2')
      .replace(/ç/g, 's')
      .replace(/ch|sh/g, 'x')
      .replace(/lh/g, 'li')
      .replace(/nh/g, 'ni')
      .replace(/qu([ei])/g, 'k$1')
      .replace(/c([ei])/g, 's$1')
      .replace(/ss/g, 's')
      .replace(/z/g, 's')
      .replace(/y/g, 'i')
      .replace(/w/g, 'v')
      .replace(/k/g, 'c')
      .replace(/(^|[^a-z])h/g, '$1')
      .replace(/([a-z])h/g, '$1');
    return t.replace(/([a-z])\1+/g, '$1');
  }
  // distância de edição com troca de vizinhas (Damerau), parando cedo
  function btolDist(a, b, max) {
    var la = a.length,
      lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    var p2 = null,
      p = [],
      i,
      j;
    for (j = 0; j <= lb; j++) p[j] = j;
    for (i = 1; i <= la; i++) {
      var c = [i],
        mn = i;
      for (j = 1; j <= lb; j++) {
        var v = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (p2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
        c[j] = v;
        if (v < mn) mn = v;
      }
      if (mn > max) return max + 1;
      p2 = p;
      p = c;
    }
    return p[lb];
  }
  // pontos de uma palavra da busca contra as palavras do produto: 3 exata/começo · 2 contém · 1 parecida · 0 não
  function btolTok(tk, palavras, junto) {
    var alts = BTOL_IX[tk] || [tk],
      best = 0;
    alts.forEach(function (a) {
      if (best >= 3 || !a) return;
      var lim = /\d/.test(a) ? 0 : a.length >= 8 ? 2 : a.length >= 5 ? 1 : 0;
      for (var i = 0; i < palavras.length; i++) {
        var w = palavras[i];
        if (w === a || w.indexOf(a) === 0) {
          best = 3;
          return;
        }
        if (a.length >= 3 && w.indexOf(a) > 0) best = Math.max(best, 2);
        else if (lim && (btolDist(a, w, lim) <= lim || (w.length > a.length && btolDist(a, w.slice(0, a.length), lim) <= lim))) best = Math.max(best, 1);
      }
      if (best < 2 && a.length >= 3 && junto.indexOf(a) >= 0) best = Math.max(best, 2);
    });
    return best;
  }
  var BTOL_VAZIAS = { de: 1, do: 1, da: 1, dos: 1, das: 1, e: 1, com: 1, con: 1, para: 1, pra: 1, el: 1, la: 1, los: 1, las: 1, em: 1, en: 1, um: 1, uma: 1, un: 1, una: 1, o: 1, a: 1, os: 1, as: 1, i: 1 };
  // Monta a busca: devolve fn(texto) → pontos (0 = não aparece). Todas as palavras precisam aparecer.
  function btol(q) {
    var tks = btolFold(q)
      .split(/[^a-z0-9.+,]+/)
      .map(function (t) {
        return t.replace(/^[.,]+|[.,]+$/g, '');
      })
      .filter(Boolean);
    if (!tks.length) return null;
    var sv = tks.filter(function (t) {
      return !BTOL_VAZIAS[t];
    });
    if (sv.length) tks = sv;
    /* S173: "lectura 2" / "2,5" / "+1" viram o grau da régua (+2.00, +2.50, +1.00) */
    var gq = [];
    tks = tks.map(function (t) {
      var m = /^\+?(\d)(?:\.(\d{1,2}))?$/.exec(t);
      if (!m) return t;
      var v = +(m[1] + '.' + (m[2] || '0'));
      if (v < 0.5 || v > 6 || Math.round(v * 4) !== v * 4) return t;
      var g = '+' + v.toFixed(2);
      gq.push(g);
      return g;
    });
    var f = function (txt) {
      var ft = btolFold(txt),
        pal = ft.split(/[^a-z0-9.+,]+/).filter(Boolean),
        junto = ft.replace(/[^a-z0-9]/g, ''),
        tot = 0;
      for (var i = 0; i < tks.length; i++) {
        var pt = btolTok(tks[i], pal, junto);
        if (!pt) {
          var sem = tks[i].replace(/[^a-z0-9]/g, '');
          if (tks[i].charAt(0) !== '+' && sem.length >= 3 && junto.indexOf(sem) >= 0) pt = 2;
          else return 0;
        }
        tot += pt;
      }
      return tot;
    };
    f.toks = tks;
    f.gq = gq;
    return f;
  }
  // "Você quis dizer…": a palavra conhecida mais parecida com o que foi digitado
  function btolSugere(q, textos) {
    var tks = btolFold(q).split(/[^a-z0-9]+/).filter(Boolean),
      vist = {},
      out = [];
    textos.forEach(function (t) {
      String(t || '')
        .split(/[^A-Za-zÀ-ÿ0-9]+/)
        .forEach(function (w) {
          if (w.length >= 3) vist[btolFold(w)] = vist[btolFold(w)] || w.toLowerCase();
        });
    });
    tks.forEach(function (tk) {
      var melhor = null,
        md = 4;
      Object.keys(vist).forEach(function (k) {
        var d = btolDist(tk, k, 3);
        if (d < md) {
          md = d;
          melhor = vist[k];
        }
      });
      out.push(melhor && md <= Math.max(2, Math.floor(tk.length / 3)) ? melhor : tk);
    });
    var s = out.join(' ');
    return s !== tks.join(' ') ? s : '';
  }

  /* texto de busca de uma peça (nome, código, coleção, material, tipo em PT e ES) */
  function btolTxt(p){var t=p.tipo==='solar'?'óculos solar sol lentes de sol':p.tipo==='grau'?'óculos de grau leitura lectura receta':'armação armazón';return [p.nome,p.ref,p.col||'',p.mat||'',p.tag||'',t,p.tipo==='grau'&&p.gr?p.gr.map(function(g,i){return p.gq&&p.gq[i]===0?'':String(g).replace(',','.')}).join(' '):''].join(' ')}
  /* S173: o que a busca entendeu (sinônimo ou grau), para mostrar ao cliente */
  var BTOL_OR=(function(){var m={};BTOL_SIN.forEach(function(g){g.forEach(function(w){m[btolFold(w)]=w})});return m})();
  function btolEntende(q,l){var bq=btol(q);if(!bq)return '';if(bq.gq.length)return !l.length?'':LFI.tr('Entendido')+': '+LFI.tr('leitura')+' '+bq.gq.map(function(g){return g.replace('.',',')}).join(' · ');if(!l.length)return '';var pal=btolFold(btolTxt(l[0])).split(/[^a-z0-9.+,]+/);for(var i=0;i<bq.toks.length;i++){var tk=bq.toks[i],al=BTOL_IX[tk];if(!al||pal.some(function(w){return w.indexOf(tk)===0}))continue;for(var j=0;j<al.length;j++){var a=al[j];if(pal.some(function(w){return w.indexOf(a)===0})){var vis=String(btolTxt(l[0])).split(/\s+/).filter(function(w){return btolFold(w).indexOf(a)===0})[0]||BTOL_OR[a];return LFI.tr('Mostrando')+' '+vis.charAt(0).toUpperCase()+vis.slice(1).toLowerCase()+' ('+LFI.tr('é o mesmo que')+' '+(BTOL_OR[tk]||tk)+')'}}}return ''}
  /* S173-3A: "Avisarme cuando vuelva" na peça esgotada (1 e-mail só, pela função volta) */
  function voltaSec(p){var fe=lsG('lf_voltas',{});if(fe[p.ref])return '<section class="dsec dvolta"><div class="vok">✓ '+LFI.tr('Vamos te avisar por e-mail quando voltar.')+'</div></section>';var ca=getConta()||{},em=ca.email||lsG('lf_vemail','')||'';
    return '<section class="dsec dvolta" data-vref="'+esc(p.ref)+'"><span class="dsl">'+LFI.tr('Esgotado no momento')+'</span><input type="email" class="vem" placeholder="'+LFI.tr('seu@email.com')+'" value="'+esc(em)+'" autocomplete="email" inputmode="email" aria-label="E-mail"><input type="text" class="vhp" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="button" class="vbt" data-volta="'+esc(p.ref)+'">'+LFI.tr('Avisar-me quando voltar')+'</button><small class="vmu">'+LFI.tr('1 e-mail só, quando voltar ao estoque.')+'</small></section>'}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-volta]');if(!b||b.disabled)return;var sc=b.closest('.dvolta'),ref=b.getAttribute('data-volta'),inp=sc.querySelector('.vem'),em=String(inp.value||'').trim();
    if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em)){inp.focus();toast(LFI.tr('Confira o e-mail.'));return}b.disabled=true;
    acFetch(fnUrl('volta'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({acao:'pedir',ref:ref,email:em,lang:LFI.lang,site:sc.querySelector('.vhp').value})}).then(function(r){return r.json()}).then(function(j){if(!j||!j.ok)throw j;var fe=lsG('lf_voltas',{});fe[ref]=Date.now();lsS('lf_voltas',fe);lsS('lf_vemail',em);sc.innerHTML='<div class="vok">✓ '+LFI.tr('Vamos te avisar por e-mail quando voltar.')+'</div>'},function(){throw 0}).catch(function(j){b.disabled=false;toast(LFI.tr(j&&j.motivo==='muitas'?'Você já tem muitos avisos pendentes.':'Não deu para enviar agora. Tente de novo.'))})});
  /* S173-3B: "Voltou um favorito" na próxima visita (favoritos ficam no aparelho; sem e-mail) */
  function favVolta(){try{var ant=lsG('lf_favesg',null),agora={},volt=[];Object.keys(st.fav).forEach(function(r){var p=find(r);if(!p)return;var es=p.aviso==='Esgotado'&&!p.esgRes;if(es)agora[r]=1;else if(ant&&ant[r])volt.push(p)});lsS('lf_favesg',agora);
    if(!volt.length||document.getElementById('fvolta'))return;var p=volt[0],d=document.createElement('div');d.id='fvolta';d.className='fvolta';d.setAttribute('role','status');
    d.innerHTML='<span>❤️ <b>'+LFI.tr('Voltou um favorito')+':</b> '+esc(p.nome)+' '+LFI.tr('está de novo no estoque.')+(volt.length>1?' (+'+(volt.length-1)+')':'')+'</span><button type="button" class="fvv">'+LFI.tr('Ver')+'</button><button type="button" class="fvx" aria-label="'+LFI.tr('Fechar')+'">×</button>';
    d.addEventListener('click',function(e){if(e.target.closest('.fvv')){d.remove();product(p.ref)}else if(e.target.closest('.fvx'))d.remove()});document.body.appendChild(d);setTimeout(function(){if(d.parentNode)d.remove()},12000)}catch(_){}}
  /* S172-B (aprovado 11/11/2026): ordem do catálogo escolhida no painel (config/site.cordem):
     eq = Equilibrada (mistura novidade, mais visto da semana e parada, uma de cada), par = Vender parados primeiro,
     nov = Novidades primeiro. Fixadas no topo continuam primeiro; no tema ativo as peças do tema sobem. O MESMO cálculo está no painel (catOrdemP). */
  function catOrdem(r){var md=CFG.cordem||'eq',ix=function(s){var m={};String(s||'').split(',').forEach(function(x,i){if(x&&m[x]==null)m[x]=i});return m},PAR=ix(CFG.cpar),VIS=ix(CFG.cvis),base=r.slice();
    var e=null;try{e=evAtivo()}catch(_){}var tf=e&&typeof DST_TEMA!=='undefined'?DST_TEMA[e.tema]:null;
    var fx=base.filter(function(p){return p.fixo}),rs=base.filter(function(p){return !p.fixo}),out;
    if(md==='nov')out=rs.slice().sort(function(a,b){return (b.cad||0)-(a.cad||0)});
    else if(md==='par')out=rs.slice().sort(function(a,b){var x=PAR[a.ref],y=PAR[b.ref];return (x==null?999:x)-(y==null?999:y)});
    else{var us={},q=[rs.filter(isNovo).sort(function(a,b){return (b.cad||0)-(a.cad||0)}),rs.filter(function(p){return VIS[p.ref]!=null}).sort(function(a,b){return VIS[a.ref]-VIS[b.ref]}),rs.filter(function(p){return PAR[p.ref]!=null}).sort(function(a,b){return PAR[a.ref]-PAR[b.ref]})];out=[];
      for(var k=0;k<rs.length*3;k++){var l=q[k%3];while(l.length&&us[l[0].ref])l.shift();if(l.length){var p=l.shift();us[p.ref]=1;out.push(p)}}
      rs.forEach(function(p){if(!us[p.ref])out.push(p)})}
    if(tf){var t1=out.filter(tf),t2=out.filter(function(p){return !tf(p)});out=t1.concat(t2)}
    return fx.concat(out)}
  /* vitrine */
  function isNovo(p){return p.cad>0&&Date.now()-p.cad<6048e5}
  /* S186 v3 (aprovado 12/11): UM selo por peça — 1 Oferta "−N%" (no tema "−N% · tema", cartão na cor do tema) · 2 Tema · 3 Nº 1/2/3 da categoria · 4 Chegou esta semana.
     "Últimas N" não entra na conta: fica sempre dentro da foto. Sem "OFERTA" escrito, sem NOVO, sem selo preto de tipo e sem "Mais vendido" repetido. */
  var TSEL={natal:['Presente ideal','Regalo ideal'],maes:['Para a mãe','Para mamá'],pais:['Para o pai','Para papá'],bf:['Black Friday','Black Friday'],anonovo:['Ano Novo','Año Nuevo'],halloween:['Halloween','Halloween']};
  function temaDe(p){try{var e=evAtivo();if(!e||!TSEL[e.tema])return '';var f=DST_TEMA[e.tema];return f&&f(p)?e.tema:''}catch(_){return ''}}
  var CATN={grau:['Leitura','Lectura'],solar:['Sol','Sol'],armacao:['Armações','Armazones']};
  function catRank(p){if(!(p.mv>0))return 0;var L=P.filter(function(q){return q.tipo===p.tipo&&q.mv>0&&q.aviso!=='Esgotado'}).sort(function(a,b){return a.mv-b.mv}),k=L.indexOf(p)+1;return k>0&&k<=3?k:0}
  function selo1(p,cls){var es=window.LFI&&LFI.lang==='es',c=cls||'sel1';if(p.aviso==='Esgotado')return '';
    if(isOf(p))return '<span class="'+c+' of">−'+pct5(p)+'%</span>';
    var k=0;if(k)return '<span class="'+c+' rk">Nº '+k+' '+(es?'en ':'em ')+((CATN[p.tipo]||['',''])[es?1:0])+'</span>';
    /* S402 (17/11/2026, ordem do dono): o selo "Chegou esta semana" saiu também do catálogo e do Início (da página da peça já tinha saído em 12/11) */return ''}
  function lista(){
    var q=st.q.trim().toLowerCase(),bq=btol(q);
    var fl=function(face){return P.filter(function(p){
      if(p.tipo==='acessorio')return false;if(st.col&&String(p.col||'').trim()!==st.col)return false;if(st.tipo==='fav'){if(!st.fav[p.ref])return false}else if(st.tipo==='of'){if(!isOf(p))return false}else if(st.tipo==='nov'||st.tipo==='mv'){if(!secSet(st.tipo)[p.ref])return false}else if(st.tipo==='la'){if(p.tipo!=='grau'&&p.tipo!=='armacao')return false}else if(st.tipo!=='todos'&&p.tipo!==st.tipo)return false;
      if(face&&st.rosto&&p.rosto.indexOf(st.rosto)<0)return false;
      if(!genOk(p,st.gen))return false
      if(bq&&!bq(btolTxt(p)))return false;
      return true})};
    var r=fl(true);
    /* nenhum modelo marcado para esse formato: mostra todos (e avisa), em vez de uma vitrine vazia */
    st.rsem=!!st.rosto&&!r.length;if(st.rsem)r=fl(false);
    if(st.sort==='menor')r.sort(function(a,b){return a.n-b.n});
    if(st.sort==='maior')r.sort(function(a,b){return b.n-a.n});
    if(st.sort!=='menor'&&st.sort!=='maior'&&(st.tipo==='nov'||st.tipo==='mv')){var so=secSet(st.tipo);r.sort(function(a,b){return so[a.ref]-so[b.ref]})}
    else if(st.sort!=='menor'&&st.sort!=='maior'){var TO={solar:0,armacao:1,grau:2};r.sort(function(a,b){return (b.fixo?1:0)-(a.fixo?1:0)||(isNovo(b)?1:0)-(isNovo(a)?1:0)||(TO[a.tipo]||0)-(TO[b.tipo]||0)||(a.ord||0)-(b.ord||0)});r=catOrdem(r)}
    var ok=r.filter(function(p){return p.aviso!=='Esgotado'}),es=r.filter(function(p){return p.aviso==='Esgotado'});
    return ok.concat(es)}

  /* ficha técnica de exemplo (substitua pelos dados reais do fornecedor) */
  var MATS={METAL:'Metal',ACETATO:'Acetato',SOLAR:'Acetato',NOVO:'Acetato',GRAU:'Acetato leve'};
  P.forEach(function(p){
    var h=0;for(var i=0;i<p.ref.length;i++)h=(h*31+p.ref.charCodeAt(i))>>>0;
    if(!p.med)p.med=[48+h%9,16+(h>>>3)%7,140+(h>>>5)%6];
    if(!p.mat)p.mat=(p.nome.toLowerCase().indexOf('metal')>=0?'Metal':MATS[p.tag]||'Acetato');
    if(p.uv===undefined)p.uv=p.tipo==='solar'});
  if(LFI.lang==='es'){P.forEach(function(p){p.nome=LFI.tn(p.nome)});FACES.forEach(function(f){f.nome=LFI.tn(f.nome);f.dica=LFI.tn(f.dica)})}
  function faceMini(id){var f=FD[id];if(!f)return '';return '<svg viewBox="8 4 64 84" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" aria-hidden="true"><path d="'+f.d+'"/></svg>'}
  
  var UVI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',MATI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>',LENI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="12" r="4.5"/><circle cx="16" cy="12" r="4.5"/></svg>';
  /* S195: selos com ícone — gênero (♂ ♀ ⚥ em linha) e Polarizado (E4: sol afastado, 1 raio bate na lente e volta) */
  var GENI={m:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="14" r="5.5"/><path d="M14 10l6-6M15 4h5v5"/></svg>', f:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5.5"/><path d="M12 14.5V22M8.5 18.5h7"/></svg>', u:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="12" r="4.8"/><path d="M14.4 8.6L19.5 3.5M16 3.5h3.5V7M11 16.8V22M8.5 19.5h5"/></svg>'},POLI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="4.6" cy="6" r="1.9"/><path d="M4.6 2.4v.6M4.6 9v.6M1 6h.6M7.6 6h.6M2.1 3.5l.4.4M6.7 8.1l.4.4M2.1 8.5l.4-.4M6.7 3.9l.4-.4"/><path d="M9.4 8.6l5.4 3.4"/><path d="M14.8 12l-4.6 3.6"/><path d="M10.3 13.1l-.1 2.5 2.5.1"/><path d="M17.4 5.6c2.4 1.3 3.8 3.7 3.8 6.4s-1.4 5.1-3.8 6.4c-1.2-1.6-1.8-3.8-1.8-6.4s.6-4.8 1.8-6.4z"/></svg>';
  /* S190 (12/11): peça com várias cores — nome sem cor, melhor cor com estoque, texto automático sem cor */
  var CORW=/\s+(preto|preta|negro|negra|branco|branca|blanco|blanca|marrom|marrón|tartaruga|carey|transparente|cristal|dourado|dourada|dorado|dorada|prateado|prateada|plateado|plateada|rosa|vermelho|vermelha|rojo|roja|azul|verde|roxo|roxa|violeta|lilás|lila|cinza|gris|nude|bege|beige|vinho|bordô|bordo|caramelo|mel|miel|grafite|grafito|fumê|humo|degradê|degradé)$/i;
  function multiC(p){return !!(p&&p.cores&&p.cores.length>1)}
  function nomeSC(p){var n=String(p&&p.nome||'');if(!multiC(p))return n;var m=n,k=0;while(CORW.test(m)&&k<2){m=m.replace(CORW,'');k++}return m.trim()||n}
  function melhorCor(p){if(!multiC(p))return 0;var b=-1,bv=-1;for(var i=0;i<p.cores.length;i++){var q=p.qs?+p.qs[i]||0:1;if(p.qs&&q<=0)continue;var v=p.vc&&p.vc[i]!=null?+p.vc[i]*1000+q:q;if(v>bv){bv=v;b=i}}return b<0?0:b}
  var FMTW=['gatinho','redondo','redonda','quadrado','quadrada','hexagonal','retangular','aviador','oval','esportivo','geométrico','borboleta','oversized','clubmaster'];
  function txtAuto(p){if(p.desc)return '';/* o texto escrito no app já aparece no .pdesc */var es=window.LFI&&LFI.lang==='es',nm=String(p.nome||'').toLowerCase(),f='';FMTW.some(function(w){if(nm.indexOf(w)>=0){f=w;return true}});
    var tp=es?{armacao:'Armazón',solar:'Lentes de sol',grau:'Lentes de lectura'}[p.tipo]:{armacao:'Armação',solar:'Óculos de sol',grau:'Óculos de leitura'}[p.tipo];if(!tp)return '';
    var t=tp+(f?' '+(es?LFI.tn(f):f):''),mt=p.mat?String(lfnMat?lfnMat(p.mat):p.mat).toLowerCase():'';if(mt)t+=(es?' de ':' em ')+(es?LFI.tr(mt):mt);
    var md=p.med&&p.med[0];if(md){var tm=md<=50?(es?'pequeño':'pequeno'):md<=54?(es?'mediano':'médio'):(es?'grande':'grande');t+=(es?', tamaño ':', tamanho ')+tm+' ('+p.med[0]+(p.med[1]?'-'+p.med[1]:'')+')'}t+='.';
    if(multiC(p))t+=' '+(es?'Disponible en '+p.cores.length+' colores.':'Disponível em '+p.cores.length+' cores.');return t}
  function isPol(p){return p.tipo==='solar'&&(p.pol===true||(p.pol!==false&&/polariz/i.test(String(p.nome||''))))}
  function prx(p){return p.aviso==='Esgotado'?'':p.de&&p.de>p.n?'<s>'+fmt(p.de)+'</s>'+fmt(p.n):fmt(p.n)}
  function ofx(p){return ''}
  function isOf(p){return !!(p.de&&p.de>p.n&&p.aviso!=='Esgotado')}
  function ofp(p){return isOf(p)?'<span class="ofp">OFERTA</span>':''}
  function eco(p){return isOf(p)?'<span class="eco">Você economiza '+fmt(p.de-p.n)+'</span>':''}
  var MOBQ=matchMedia('all'),PGN=9999;
  function pageOf(r){
    var pg=$('pager');if(!pg)return r;
    var sig=st.q+'|'+st.tipo+'|'+st.gen+'|'+st.rosto+'|'+st.sort,mudou=st.sig!==sig;if(mudou){st.sig=sig;st.pg=0}
    if(!MOBQ.matches){pg.innerHTML='';return r}
    var n=Math.max(1,Math.ceil(r.length/PGN));st.pg=Math.min(Math.max(0,st.pg||0),n-1);
    var dots='';for(var i=0;i<n;i++)dots+='<i'+(i===st.pg?' class="on"':'')+'></i>';
    pg.innerHTML=n>1?'<button type="button" data-pg="-1" aria-label="Anterior"'+(st.pg===0?' disabled':'')+'>‹</button><span class="dts" aria-label="Página '+(st.pg+1)+' de '+n+'">'+dots+'</span><button type="button" data-pg="1" aria-label="Próxima"'+(st.pg>=n-1?' disabled':'')+'>›</button>':'';
    var g=$('vscr')||$('grid');if(g&&mudou)g.scrollTop=0;var fb=$('fbtn');if(fb)fb.classList.toggle('on',(st.tipo!=='todos'&&st.tipo!=='fav')||!!st.gen||st.sort!=='nov');
    return r.slice(st.pg*PGN,st.pg*PGN+PGN)}
  function drawGrid(){
    var r=lista();drawRes(r.length);
    $('count').textContent=r.length+' modelo'+(r.length===1?'':'s');
    r=pageOf(r);var HA=r.length?r.map(function(p,i){
      var esg=p.aviso==='Esgotado',n=st.cart[p.ref]||0;
      var sk=esg?'<span class="stk e">'+(p.esgRes?'Reservada agora':'Esgotado')+'</span>':(/Últim/.test(p.aviso)?'<span class="stk u">'+esc(p.aviso)+'</span>':''),tm0=isOf(p)?temaDe(p):'';
      return '<article class="card'+(esg?' esg':'')+(isOf(p)?' of':'')+(tm0?' ot t-'+tm0:'')+'" style="--i:'+i+'">'+selo1(p)+edb(p)+'<button class="fav'+(st.fav[p.ref]?' on':'')+'" data-fav="'+p.ref+'" aria-label="Favoritar '+esc(p.nome)+'" aria-pressed="'+(!!st.fav[p.ref])+'">'+HEART+'</button><button class="open" data-open="'+p.ref+'" aria-label="Ver '+esc(p.nome)+'"><div class="ph">'+(esg?sk:'')+ofx(p)+vis(p)+(!esg&&/Últim/.test(p.aviso||'')?'<span class="ulin" data-cabe="letra"><i></i>'+esc(p.aviso)+'</span>':'')+'<span class="shine"></span>'+(p.fotos&&p.fotos[1]?'<span class="alt2"><img src="'+p.fotos[1]+'" alt=""></span>':'')+'</div><div class="info"><span class="rr">'+(p.ds!=null?'<span class="ref lfds">'+esc(p.ds)+'</span>':'<span class="ref">'+p.ref+'</span>')+(p.uv?'<span class="uvc" title="Proteção UV400">UV400</span>':'')+'</span><span class="nm'+(p.ds!=null?' lfcod':'')+'">'+esc(p.ds!=null?p.ref:p.nome)+'</span>'+(p.cores&&p.cores.length?'<span class="esw">'+p.cores.slice(0,6).map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</span>':'')+'<span class="pr">'+prx(p)+'</span>'+eco(p)+'<span class="av">'+esc(p.aviso)+'</span></div></button></article>'}):null,GH=HA?HA.join(''):'<div class="empty">Nenhum modelo com esses filtros. Tire um filtro ou limpe a busca.</div>';
    var G=$('grid');
    /* S186: mais da metade dos cartões em oferta (ex.: Black Friday) = versão clara (cartão branco, selo vermelho) */
    try{if(G&&r){var nOf=r.filter(function(p){return isOf(p)}).length;G.classList.toggle('ofl',r.length>3&&nOf*2>r.length)}}catch(_){}
    if(G._h!==GH){G._h=GH;
      if(!HA){G.innerHTML=GH}
      else{ /* só troca os cards que mudaram: os outros (e suas fotos) ficam como estão, sem piscar */
        if(G.firstElementChild&&!G.firstElementChild._k)G.innerHTML='';
        var old={};Array.prototype.forEach.call(G.children,function(c){old[c._k]=c});var keep={},nodes=[];
        HA.forEach(function(h,i){var k=r[i].ref,ex=old[k],nd;
          var hk=h.replace(/ style="--i:\d+"/,'');if(ex&&ex._h===hk)nd=ex;else{var t=document.createElement('template');t.innerHTML=h.trim();nd=t.content.firstElementChild;nd._h=hk;nd._k=k;if(ex)nd.classList.add('still')}
          keep[k]=1;nodes.push(nd)});
        Array.prototype.slice.call(G.children).forEach(function(c){if(!keep[c._k]||nodes.indexOf(c)<0)G.removeChild(c)});
        nodes.forEach(function(nd,i){if(G.children[i]!==nd)G.insertBefore(nd,G.children[i]||null)})}}
  }
  function genOk(p,g){if(!g)return true;var pg=p.gen||'u';return g==='u'?pg==='u':(pg===g||pg==='u')}
  var faGen='';
  var GENS=[['','Todos'],['m','Masculino'],['f','Feminino'],['u','Unissex']];
  function drawGen(){var e=$('fge');if(e)e.innerHTML=GENS.map(function(g){return '<button class="chip" type="button" data-gen="'+g[0]+'" aria-pressed="'+(st.gen===g[0])+'">'+LFI.tr(g[1])+'</button>'}).join('')}
  function drawChips(){
    var nf=Object.keys(st.fav).length;if(!nf&&st.tipo==='fav')st.tipo='todos';$('tipos').innerHTML=TIPOS.map(function(t){return '<button class="chip" data-tipo="'+t[0]+'" aria-pressed="'+(st.tipo===t[0])+'">'+t[1]+'</button>'}).join('');
    var ft=$('ftog');if(ft){if(!ft._anim)ft.hidden=!nf;ft.classList.toggle('fon',st.tipo==='fav');ft.setAttribute('aria-pressed',st.tipo==='fav');ft.querySelector('.fcn').textContent=nf||''}}
  var FD={
    redondo:{d:'M40 16C57 16 67 29 67 46C67 63 56 77 40 77C24 77 13 63 13 46C13 29 23 16 40 16Z',L:13,R:67,ey:45,my:64},
    oval:{d:'M40 10C54 10 63 24 63 42C63 62 54 78 40 78C26 78 17 62 17 42C17 24 26 10 40 10Z',L:17,R:63,ey:44,my:66},
    quadrado:{d:'M13 28Q13 12 30 12H50Q67 12 67 28V54Q67 64 60 70L52 76Q46 79 40 79Q34 79 28 76L20 70Q13 64 13 54Z',L:13,R:67,ey:44,my:66},
    coracao:{d:'M12 30C12 16 24 11 40 11S68 16 68 30C68 46 56 62 44 76Q40 80 36 76C24 62 12 46 12 30Z',L:12,R:68,ey:42,my:66},
    alongado:{d:'M18 22C18 11 27 6 40 6S62 11 62 22V58C62 72 52 81 40 81S18 72 18 58Z',L:18,R:62,ey:46,my:69},
    diamante:{d:'M40 10C50 10 57 16 59 26L68 44C66 52 58 58 52 68C48 75 44 79 40 79S32 75 28 68C22 58 14 52 12 44L21 26C23 16 30 10 40 10Z',L:12,R:68,ey:44,my:66}
  };

  function fig(f,sd){var d=f[sd==='m'?'gm':'gf'],src=f[sd],asp=f[sd==='m'?'wm':'wf'];
    return '<span class="fw" style="aspect-ratio:'+asp.toFixed(3)+'"><span class="fi" style="--m:url('+src+');width:100%" role="img" aria-label="Rosto '+f.nome.toLowerCase()+(sd==='m'?' masculino':' feminino')+' com armação recomendada"></span><svg class="gl" viewBox="-16 0 152 50" style="left:'+d[0]+'%;top:'+d[1]+'%;width:'+(d[2]*1.36).toFixed(1)+'%" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON[f.ic]+'<path d="M8 15L3 14M112 15L117 14" fill="none"/></svg>'+feat(d,asp)+'</span>'}
  /* nariz e boca: o desenho fica completo como a referência, com as proporções vindas da armação */
  function feat(d,asp){
    var u=d[2]*1.36/152,cx=d[0],cy=d[1]/asp,H=100/asp,chin=H*.86,yn=cy+(chin-cy)*.31,ym=cy+(chin-cy)*.55,f=function(n){return n.toFixed(2)};
    return '<svg class="ft" viewBox="0 0 100 '+f(H)+'" aria-hidden="true">'
      +'<path d="M'+f(cx-9*u)+' '+f(yn)+'Q'+f(cx-1*u)+' '+f(yn+5.5*u)+' '+f(cx+8*u)+' '+f(yn-1*u)+'" stroke-width="1.2"/>'
      +'<path d="M'+f(cx-19*u)+' '+f(ym)+'Q'+f(cx)+' '+f(ym+2.4*u)+' '+f(cx+19*u)+' '+f(ym)+'" stroke-width="1.3"/>'
      +'<path d="M'+f(cx-11*u)+' '+f(ym+8.5*u)+'Q'+f(cx)+' '+f(ym+11*u)+' '+f(cx+11*u)+' '+f(ym+8.5*u)+'" stroke-width="1.1"/></svg>'}
  function drawFaces(){
    $('faces').innerHTML=FACES.map(function(f){var on=st.rosto===f.id;return '<button class="face" data-face="'+f.id+'" aria-pressed="'+on+'" aria-label="Rosto '+f.nome.toLowerCase()+'"><div class="fp">'+fig(f,'m')+fig(f,'f')+'</div><b>Rosto '+f.nome.toLowerCase()+'</b><span>'+f.dica+'</span><em class="go" style="font-style:normal">'+(on?'Mostrando · toque para limpar':'Escolher')+'</em></button>'}).join('');
    faceDots();faceSync()}
  /* carrossel dos formatos de rosto: o cartão do centro é o ativo; setas e deslize levam ao vizinho */
  var fk=0,fkR=null,faceRaf=0,faceLock=0;
  function faceTarget(i){var fs=$('faces'),c=fs.children[i];return c.offsetLeft-(fs.clientWidth-c.offsetWidth)/2}
  function faceMark(){
    var fs=$('faces'),cs=fs.children,ds=$('fdots').children,i;if(!cs.length)return;
    for(i=0;i<cs.length;i++)cs[i].classList.toggle('cur',i===fk);
    for(i=0;i<ds.length;i++)ds[i].classList.toggle('cur',i===fk);
    $('farl').classList.toggle('off',fk<=0);$('farr').classList.toggle('off',fk>=cs.length-1);
    var fp=cs[fk].querySelector('.fp');if(fp&&fp.offsetHeight)$('fcar').style.setProperty('--ft',(fs.offsetTop+cs[fk].offsetTop+fp.offsetTop+fp.offsetHeight*.83)+'px')}
  function faceDots(){$('fdots').innerHTML=FACES.map(function(){return '<i></i>'}).join('')}
  function faceSync(){
    if(st.rosto!==fkR){fkR=st.rosto;var ix=FACES.map(function(x){return x.id}).indexOf(st.rosto);if(ix>=0)fk=ix}
    var fs=$('faces');if(fs.clientWidth&&fs.children.length)fs.scrollLeft=faceTarget(fk);
    faceMark()}
  function faceGo(i){
    var n=FACES.length;i=Math.max(0,Math.min(n-1,i));if(i===fk)return;
    fk=i;faceLock=Date.now()+520;faceMark();
    $('faces').scrollTo({left:faceTarget(i),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
  (function(){
    var fs=$('faces'),car=$('fcar');
    fs.addEventListener('scroll',function(){
      if(faceRaf||Date.now()<faceLock)return;
      faceRaf=requestAnimationFrame(function(){faceRaf=0;
        var c0=fs.scrollLeft+fs.clientWidth/2,best=0,bd=1e9,cs=fs.children;
        for(var i=0;i<cs.length;i++){var dd=Math.abs(cs[i].offsetLeft+cs[i].offsetWidth/2-c0);if(dd<bd){bd=dd;best=i}}
        if(best!==fk){fk=best;faceMark()}})},{passive:true});
    [['farl',-1],['farr',1]].forEach(function(a){var b=$(a[0]);
      b.addEventListener('click',function(){b.classList.remove('tap');void b.offsetWidth;b.classList.add('tap');faceGo(fk+a[1])});
      b.addEventListener('animationend',function(e){if(e.animationName.indexOf('farT')===0)b.classList.remove('tap')})});
    if(window.ResizeObserver)new ResizeObserver(function(){if(fs.clientWidth){fs.scrollLeft=faceTarget(fk);faceMark()}}).observe(fs);
    if(window.IntersectionObserver){var io=new IntersectionObserver(function(l){if(l[0].isIntersecting){car.classList.add('in');io.disconnect()}},{threshold:.5});io.observe(car)}else car.classList.add('in')})();
  function drawRes(n){
    var el=$('resultado');if(!el)return;
    if(!st.rosto){el.innerHTML='';return}
    var f=FACES.filter(function(x){return x.id===st.rosto})[0];if(!f){el.innerHTML='';return}
    el.innerHTML='<div class="res"><div class="rf">'+fig(f,'m')+fig(f,'f')+'</div><div><span class="eyebrow">Seu formato de rosto</span><h3>Rosto '+f.nome.toLowerCase()+'</h3><p>'+esc(f.dica)+(st.rsem?' Ainda não separamos modelos para este formato; veja todos abaixo.':' Separamos '+n+' modelo'+(n===1?'':'s')+' para você.')+'</p></div></div><button type="button" class="rchip" data-face="'+f.id+'">Rosto '+f.nome.toLowerCase()+' · '+n+' modelo'+(n===1?'':'s')+' <b>Limpar ✕</b></button>'}
  function saveFav(){try{localStorage.setItem('lf_fav',JSON.stringify(st.fav))}catch(_){}}
  function shareProd(ref){var p=find(ref);if(!p)return;var url='https://lafouch.com'+rtProd(ref),tt=p.nome+' ('+ref+') · La Fouch';
    var cp=function(){try{navigator.clipboard.writeText(url).then(function(){toast('Link copiado')},function(){toast(url)})}catch(_){toast(url)}};
    if(navigator.share){navigator.share({title:tt,text:tt,url:url}).catch(function(e){if(!e||e.name!=='AbortError')cp()})}else cp()}
  /* botão de favoritos: aparece (coração voa do produto, círculo se abre, contorno é desenhado) e some (desfaz e cai) */
  function zf(){return parseFloat(getComputedStyle(document.body).zoom)||1}
  function favMot(){return !!Element.prototype.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches}
  function favCancel(ft){ft.getAnimations({subtree:true}).forEach(function(a){a.cancel()});document.querySelectorAll('.favfly,.favgh').forEach(function(e){e.remove()});ft._anim=false;ft.style.overflow='';var fc=ft.querySelector('.fcn');if(fc){fc.style.overflow='';var n0=Object.keys(st.fav).length;fc.textContent=n0||''}var pa=ft.querySelector('svg path');if(pa){pa.style.strokeDasharray='';pa.style.strokeDashoffset=''}}
  var FAV_HP='M12 20.5s-7.5-4.6-7.5-10.3A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z';
  /* S240 (aprovado 14/11/2026): ao favoritar, UM coração vai do cartão até a sacola em 0,62 s e a sacola dá um toque leve.
     Saíram os efeitos em corrente (anel, contorno desenhado, "+1", botão pulsando), que somavam 1,9 s. */
  function favVoa(src){
    var b=$('bagbtn');if(!b||!src||!src.getBoundingClientRect)return 0;
    var sr=src.getBoundingClientRect(),br=b.getBoundingClientRect();if(!sr.width||!br.width)return 0;
    var z=zf(),ac=(getComputedStyle(document.documentElement).getPropertyValue('--ac')||'#b4528a').trim(),x0=sr.left+sr.width/2,y0=sr.top+sr.height/2,dx=(br.left+br.width/2-x0)/z,dy=(br.top+br.height/2-y0)/z,
      f=document.createElement('i');f.className='favfly';f.style.cssText='position:fixed;z-index:var(--c-aviso);left:'+(x0/z-11)+'px;top:'+(y0/z-11)+'px;width:22px;height:22px;color:'+ac+';pointer-events:none';
    f.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="'+FAV_HP+'"/></svg>';document.body.appendChild(f);
    f.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+(dx*.45)+'px,'+(dy*.45-46)+'px) scale(1.15)',opacity:1,offset:.45},{transform:'translate('+dx+'px,'+dy+'px) scale(.35)',opacity:.2}],{duration:620,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'}).onfinish=function(){f.remove()};
    b.animate([{transform:'scale(1)'},{transform:'scale(1.14)'},{transform:'scale(1)'}],{duration:320,delay:560,easing:'cubic-bezier(.2,.8,.2,1)'});
    return 560}
  function favIn(ft,src){
    ft.hidden=false;ft._anim=true;var d0=favVoa(src);
    ft.animate([{opacity:0},{opacity:1}],{duration:200,delay:d0,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    setTimeout(function(){if(ft._anim){favCancel(ft);ft.hidden=Object.keys(st.fav).length===0}},d0+340);
  }
  function favOut(ft){
    var ac=(getComputedStyle(document.documentElement).getPropertyValue('--ac')||'#b4528a').trim(),sv=ft.querySelector('svg'),pa=sv.querySelector('path'),w=ft.getBoundingClientRect().width,gap=parseFloat(getComputedStyle(ft.parentNode).columnGap)||8;
    var D=function(el,k,o){return el.animate(k,Object.assign({fill:'both'},o))};
    ft._anim=true;ft.style.overflow='visible';pa.setAttribute('pathLength','1');pa.style.strokeDasharray='1';
    D(sv,[{fill:'rgba(0,0,0,0)'},{fill:ac},{fill:ac,offset:.5},{fill:'rgba(0,0,0,0)'}],{duration:700});
    D(pa,[{strokeDashoffset:0,stroke:ac},{strokeDashoffset:0,stroke:ac,offset:.4},{strokeDashoffset:1,stroke:ac}],{duration:700});
    D(ft,[{opacity:1,transform:'none'},{opacity:1,transform:'scale(1.08)',offset:.2},{opacity:0,transform:'translateY(26px) rotate(-22deg) scale(.2)'}],{duration:620,delay:380,easing:'ease-in'});
    setTimeout(function(){if(ft._anim){favCancel(ft);ft.hidden=Object.keys(st.fav).length===0}},1250);
  }
  function favMais(ft,src,nOld,nNew){
    var fc=ft.querySelector('.fcn'),d0=favVoa(src);ft._anim=true;
    if(fc){/* o número só muda no instante em que o coração chega */
      fc.style.overflow='';fc.textContent=nOld;
      setTimeout(function(){fc.textContent=nNew;if(fc.animate)fc.animate([{transform:'scale(1)'},{transform:'scale(1.2)',offset:.4},{transform:'scale(1)'}],{duration:200,easing:'cubic-bezier(.16,1,.3,1)'})},d0)}
    setTimeout(function(){if(ft._anim){favCancel(ft);ft.hidden=Object.keys(st.fav).length===0}},d0+340);
  }
  function favMenos(ft,nOld,nNew){
    var z=zf(),r=ft.getBoundingClientRect(),cx=r.left+r.width/2,fc=ft.querySelector('.fcn');
    if(fc){fc.textContent=nOld;if(fc.animate)fc.animate([{transform:'scale(1)'},{transform:'scale(.45)',opacity:.4,offset:.45},{transform:'scale(1)',opacity:1}],{duration:460,easing:'ease-in-out'});
      setTimeout(function(){fc.textContent=nNew},200)}
    if(ft.animate)ft.animate([{transform:'none'},{transform:'scale(.9)',offset:.3},{transform:'scale(1.04)',offset:.65},{transform:'none'}],{duration:420,easing:'ease-out'});
    var mi=document.createElement('i');mi.className='favgh';mi.textContent='−1';mi.style.cssText='position:fixed;z-index:var(--c-aviso);left:'+(cx/z-20)+'px;top:'+(r.top/z+4)+'px;width:40px;text-align:center;font:800 15px Inter,sans-serif;color:var(--mu,#777);pointer-events:none;opacity:0;font-style:normal';document.body.appendChild(mi);
    if(mi.animate)mi.animate([{opacity:0,transform:'translateY(-6px) scale(.8)'},{opacity:1,transform:'translateY(6px) scale(1.1)',offset:.3},{opacity:1,transform:'translateY(18px) scale(1)',offset:.7},{opacity:0,transform:'translateY(28px)'}],{duration:800,easing:'ease-out'}).onfinish=function(){mi.remove()};
    else setTimeout(function(){mi.remove()},800)}
  function toggleFav(ref,src){
    var fp=document.querySelector('#layer #ftogp'),ft0=fp||$('ftog'),was0=ft0&&!ft0.hidden;
    if(ft0&&ft0._anim)favCancel(ft0);
    if(st.fav[ref])delete st.fav[ref];else st.fav[ref]=1;saveFav();
    var on=!!st.fav[ref],nfn=Object.keys(st.fav).length,mais=ft0&&favMot()&&on&&was0&&nfn>=2,go=ft0&&favMot()&&((on&&!was0&&nfn===1)||(!on&&was0&&nfn===0));
    if(go)ft0._anim=true;
    document.querySelectorAll('[data-fav="'+ref+'"]').forEach(function(b){b.classList.toggle('on',on);if(b.hasAttribute('aria-pressed'))b.setAttribute('aria-pressed',on);var sp=b.querySelector('span');if(sp)sp.textContent=on?'Nos favoritos':'Favoritar'});
    var nf=Object.keys(st.fav).length,kt=st.tipo;drawChips();if(kt==='fav'&&!nf)drawGrid();
    if(go){ft0.hidden=false;if(on)favIn(ft0,src);else favOut(ft0)}
    else if(mais)favMais(ft0,src,nfn-1,nfn);
    else if(ft0&&favMot()&&!on&&was0&&nfn>=1)favMenos(ft0,nfn+1,nfn);
    if(!on&&st.tipo==='fav'&&nf){
      var gr=$('grid'),fb=gr.querySelector('.card [data-fav="'+ref+'"]'),cd=fb&&fb.closest('.card');
      if(cd){
        var rest=[].slice.call(gr.querySelectorAll('.card')).filter(function(c){return c!==cd}),old=rest.map(function(c){return c.getBoundingClientRect()});
        cd.classList.add('out');
        setTimeout(function(){
          cd.remove();$('count').textContent=rest.length+' modelo'+(rest.length===1?'':'s');
          if(Element.prototype.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)rest.forEach(function(c,i){var n=c.getBoundingClientRect(),dx=old[i].left-n.left,dy=old[i].top-n.top;if(dx||dy)c.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'})})},330)}
      else drawGrid()}
    if(on){toast(LFI.tr('Salvo nos favoritos'),LFI.tr('Ver no carrinho ›'));var tb=document.querySelectorAll('.toast button[data-bag]');if(tb.length)tb[tb.length-1].setAttribute('data-bagfav','1')}}
  function drawCmp(){
    var b=$('cmpbar'),n=st.cmp.length;b.classList.toggle('show',n>0);
    $('cmpn').textContent='Comparar: '+n+' de 3';b.querySelector('.go').disabled=n<2;document.documentElement.classList.toggle('lfcmp',n>0);lfBh()}
  /* 09/11 S25 B (aprovado): na página da peça (celular) a barra Comparar vira uma faixa fina colada em cima da barra de compra */
  function lfBh(){try{var b=document.querySelector('#layer .pgm .buy');if(!b)return;document.documentElement.style.setProperty('--lfbh',Math.round(innerHeight-b.getBoundingClientRect().top)+'px');if(!b._lfro&&window.ResizeObserver){b._lfro=new ResizeObserver(function(){lfBh()});b._lfro.observe(b)}}catch(_){}}
  addEventListener('resize',function(){lfBh()});
  function toggleCmp(ref,btn){
    var i=st.cmp.indexOf(ref);
    if(i>=0)st.cmp.splice(i,1);else{if(st.cmp.length>=3){toast('Você pode comparar até 3 modelos');return}st.cmp.push(ref)}
    if(btn)btn.classList.toggle('on',st.cmp.indexOf(ref)>=0);drawCmp();
    if(st.cmp.length===1&&i<0)toast('Escolha mais um modelo para comparar')}
  function compare(){
    var L=st.cmp.map(find);
    layer('<div class="modal cmp" role="dialog" aria-modal="true" aria-label="Comparar modelos"><button class="x" data-close aria-label="Fechar" style="float:right">×</button><h2>Comparar modelos</h2><div class="cmpg" style="--n:'+L.length+'">'+L.map(function(p){
      var rs=p.rosto.map(function(r){var f=FACES.filter(function(x){return x.id===r})[0];return f?f.nome:r}).join(', ');
      return '<div class="cmpc"><span class="rth">'+vis(p)+'</span><h3>'+esc(p.nome)+'</h3><dl><div><dt>Preço</dt><dd>'+fmt(p.n)+'</dd></div><div><dt>Tipo</dt><dd>'+esc(p.tag)+'</dd></div><div><dt>Disponível</dt><dd>'+(p.aviso?esc(p.aviso):'Em estoque')+'</dd></div></dl><button class="btn p" data-open="'+p.ref+'">Ver este modelo</button></div>'}).join('')+'</div></div>','center')}
  function drawBag(){
    var n=qtd();$('badge').textContent=n;try{localStorage.setItem('lf_cart',JSON.stringify({c:st.cart,o:st.cor}))}catch(_){}
    drawGrid()}
  function pop(){var b=$('badge');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}

  /* voar até a sacola */
  function fly(fromEl,ref){
    var p=find(ref),to=$('bagbtn').getBoundingClientRect(),from=fromEl.getBoundingClientRect();
    if(!window.Element||!Element.prototype.animate||matchMedia('(prefers-reduced-motion: reduce)').matches){pop();return}
    var f=document.createElement('div');f.className='fly';f.innerHTML=vis(p);
    var z=zf();f.style.left=((from.left+from.width/2)/z-32)+'px';f.style.top=((from.top+from.height/2)/z-32)+'px';document.body.appendChild(f);
    var dx=(to.left+to.width/2-(from.left+from.width/2))/z,dy=(to.top+to.height/2-(from.top+from.height/2))/z;
    var a=f.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+dx+'px,'+dy+'px) scale(.25)',opacity:.9}],{duration:650,easing:'cubic-bezier(.5,0,.8,.4)'});
    a.onfinish=function(){f.remove();pop()}}
  /* graus: régua compacta; o grau marcado vai junto no pedido; grau sem estoque fica riscado */
  function grauSec(p){var i0=st.gr[p.ref];if(i0==null){i0=0;if(p.gq)for(var k=0;k<p.gq.length;k++){if(p.gq[k]>0){i0=k;break}}st.gr[p.ref]=i0}
    return '<section class="dsec dgr"><div class="dl"><span>Grau</span> · <b id="gn">'+esc(p.gr[i0])+'</b>'+(p.gq&&p.gq[i0]>0&&p.gq[i0]<4?' <i class="gqn">'+p.gq[i0]+' un.</i>':'')+'</div><div class="grr" role="group" aria-label="Grau">'+p.gr.map(function(g,i){var xo=p.gq&&p.gq[i]===0;return '<button type="button" class="gb'+(i===i0?' on':'')+(xo?' x':'')+'" data-gr="'+i+'" data-ref="'+p.ref+'"'+(xo?' aria-label="'+esc(g)+' (esgotado)"':'')+'>'+esc(g)+'</button>'}).join('')+'</div></section>'}
  function addDlg(p,fromEl,q){
    q=Math.max(1,Math.min(99,q|0||1));st.cart[p.ref]=(st.cart[p.ref]||0)+q;drawBag();if(fromEl&&fromEl.getBoundingClientRect)fly(fromEl,p.ref);else pop();
    var o=$('cad');if(o)o.remove();
    var e=document.createElement('div');e.id='cad';e.className='cad';e.setAttribute('role','dialog');e.setAttribute('aria-modal','true');e.setAttribute('aria-label',LFI.tr('Adicionado ao carrinho'));
    e.innerHTML='<div class="cadb"><div class="cadk"><svg viewBox="0 0 52 52" aria-hidden="true"><circle class="c" cx="26" cy="26" r="23"/><path class="t" d="M15 27l8 8 14-17"/></svg></div><div class="cadp"><div class="cadi">'+vis(p)+'</div><div class="cadt"><b>'+esc(p.nome)+'</b><span>'+fmtL(p,st.cart[p.ref])+'</span></div></div><h3>'+LFI.tr('Adicionado ao carrinho')+'</h3><button type="button" class="btn w" data-cadfin>'+LFI.tr('Finalizar compra')+'</button><button type="button" class="cs-c" data-cadcont>'+LFI.tr('Continuar comprando')+'</button></div>';
    document.body.appendChild(e);var f=e.querySelector('[data-cadfin]');if(f)f.focus()}
  document.addEventListener('click',function(e){
    var qb=e.target.closest('[data-pq]');
    if(qb){var by=qb.closest('.buy'),pr=find(prodRef);if(!by||!pr)return;var q=Math.max(1,Math.min(99,(+by.getAttribute('data-q')||1)+(+qb.getAttribute('data-pq'))));by.setAttribute('data-q',q);var n=by.querySelector('[data-pqn]');if(n)n.textContent=q;by.querySelectorAll('[data-ptot]').forEach(function(x){x.textContent=(x.classList.contains('bt')?' · ':'')+fmtL(pr,q)});return}
    var dm=e.target.closest('[data-pdm]');
    if(dm){var d=dm.closest('.pdesc');d.classList.toggle('open');dm.textContent=LFI.tr(d.classList.contains('open')?'Ver menos':'Ver mais')}});
  function addDlgClose(){var o=$('cad');if(o)o.remove()}
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-cadfin]')){addDlgClose();bag();return}
    if(e.target.closest('[data-cadcont]')){addDlgClose();closeLayer();return}
    if(e.target.id==='cad')addDlgClose()});
  function add(ref,fromEl,q){
    var p=find(ref);if(!p)return;
    if(p.aviso==='Esgotado'){message('avise',ref);return}
    st.cart[ref]=(st.cart[ref]||0)+(q||1);drawBag();if(fromEl)fly(fromEl,ref);else pop();setTimeout(function(){toast('Adicionado ao carrinho','Ver carrinho')},fromEl?600:0)}

  /* janelas */
  function layer(html,cls){
    var l=$('layer'),am=/^<aside class="panel"[^>]*aria-label="(Conta criada|Iniciar sessão|Criar conta|Recuperar senha|Minha conta|Sua conta|Confirme seu e-mail)"/.exec(html);if(am){cls=(cls||'')+' center acc pg'+(/^(Iniciar sessão|Criar conta|Recuperar senha|Confirme seu e-mail)$/.test(am[1])?' auth':'');prodNext=true;html=pgBarAcc(am[1])+html}
    if(prodOpen&&!prodNext)prodLeave(false);
    var pgm=prodNext;prodNext=false;
    l.innerHTML='<div class="scrim '+(cls||'')+'"'+(am?' data-accn="'+am[1]+'"':'')+(pgm?'':' data-close')+'>'+html+'</div>';
    document.documentElement.classList.add('lock');var f=l.querySelector('button,input');if(f&&document.documentElement.classList.contains('kbd'))requestAnimationFrame(function(){setTimeout(function(){if(f.isConnected&&l.contains(f)&&!l.contains(document.activeElement))f.focus()},0)})/* S426: o foco no 1º botão só para quem usa teclado, depois de a tela ser desenhada (no toque o foco já acabava no fundo) */;if(am)pgCart(0,0,'#acc',am[1])}
  function closeLayer(skip){var was=prodOpen,rf=prodRef;if(typeof camStop==="function")camStop();$('layer').innerHTML='';document.documentElement.classList.remove('lock');$('bagbtn').focus&&0;if(was)prodLeave(skip===true,rf)}
  /* página do produto: saída (restaura endereço e título; o catálogo continua exatamente onde estava) */
  /* 08/11: com a vitrine aberta (html.ppop) a página de fundo — onde ficam o logo e o menu — fica sempre no topo.
     A lista da vitrine tem a rolagem própria (#vscr) e continua exatamente onde o cliente estava. */
  /* 08/11: abrir uma categoria com a página inicial rolada escondia o logo e o menu. Ao abrir a vitrine (html.ppop) a página
     de fundo vai para o topo e a posição da inicial fica guardada; ao fechar a vitrine, a inicial volta exatamente onde estava. */
  (function(){var h=document.documentElement,era=h.classList.contains('ppop'),y0=0;
    new MutationObserver(function(){var on=h.classList.contains('ppop');if(on===era)return;era=on;
      if(on){y0=window.scrollY||h.scrollTop||0;if(y0>0)try{window.scrollTo(0,0)}catch(_){}}
      else if(window.__lfTopo){window.__lfTopo=0;y0=0;try{window.scrollTo(0,0)}catch(_){}}else if(y0>0){var y=y0;y0=0;requestAnimationFrame(function(){try{window.scrollTo(0,y)}catch(_){}})}}).observe(h,{attributes:true,attributeFilter:['class']});
    if(era&&(window.scrollY||0)>0)try{window.scrollTo(0,0)}catch(_){}})();
  function pfundoTopo(){var h=document.documentElement;if(h.classList.contains('ppop')&&!h.classList.contains('lock')&&(window.scrollY||h.scrollTop)>0){try{window.scrollTo(0,0)}catch(_){}}}
  addEventListener('scroll',function(){if(document.documentElement.classList.contains('ppop'))requestAnimationFrame(pfundoTopo)},{passive:true});
  /* 08/11: ao puxar para atualizar, guarda filtros, busca, cor, quantidade e as posições; depois de recarregar devolve tudo (só nesta visita) */
  function ptrGuarda(){try{var vs=document.getElementById('vscr'),pg=document.querySelector('#layer .scrim.pg'),by=pg&&pg.querySelector('[data-q]'),sw=pg&&pg.querySelector('[data-sw].on');
    sessionStorage.setItem('lf_ptr',JSON.stringify({t:Date.now(),st:{tipo:st.tipo,gen:st.gen,q:st.q,sort:st.sort,rosto:st.rosto,cor:st.cor,gr:st.gr},vs:vs?vs.scrollTop:0,ps:pg?pg.scrollTop:0,qn:by?+by.getAttribute('data-q')||1:1,sw:sw?+sw.getAttribute('data-sw'):-1}))}catch(_){}}
  (function(){var d=null;try{d=JSON.parse(sessionStorage.getItem('lf_ptr')||'null');sessionStorage.removeItem('lf_ptr')}catch(_){}if(!d||Date.now()-d.t>60000)return;
    try{Object.keys(d.st||{}).forEach(function(k){if(d.st[k]!=null)st[k]=d.st[k]})}catch(_){}
    var n=0,tenta=function(){n++;var vs=document.getElementById('vscr'),pg=document.querySelector('#layer .scrim.pg'),ok=true;
      if(d.vs){if(vs&&vs.scrollHeight>d.vs){vs.scrollTop=d.vs}else ok=false}
      if(d.ps||d.qn>1||d.sw>=0){if(pg){if(d.sw>0){var b=pg.querySelector('[data-sw="'+d.sw+'"]');if(b&&!b.classList.contains('on'))b.click();d.sw=-1}
        if(d.qn>1){var up=pg.querySelector('[data-pq="1"]');if(up){for(var i=1;i<d.qn;i++)up.click();d.qn=1}}if(d.ps&&pg.scrollHeight>d.ps)pg.scrollTop=d.ps;else if(d.ps)ok=false}else ok=false}
      if(!ok&&n<25)setTimeout(tenta,200)};
    setTimeout(function(){try{if(typeof redraw==='function')redraw()}catch(_){}tenta()},500)})();
  /* 08/11: puxar para atualizar dentro da página do produto e da vitrine (a trava de rolagem bloqueia o gesto do navegador).
     No topo, puxa para baixo → círculo girando → a página recarrega no mesmo lugar (mesmo produto). */
  (function(){var pu=null,sp=null,arc=null,H=document.documentElement;function el(){if(!sp){sp=document.createElement('div');sp.id='ptr5';sp.setAttribute('aria-hidden','true');sp.innerHTML='<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="rgba(141,58,105,.15)" stroke-width="3.5"/><circle class="arc" cx="20" cy="20" r="14" fill="none" stroke="#8d3a69" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="88" stroke-dashoffset="88" transform="rotate(-90 20 20)"/></svg>';document.body.appendChild(sp);arc=sp.querySelector('.arc')}return sp}
    /* um só "puxar para atualizar" no site todo (inicial, vitrine e produto); o do navegador fica desligado (overscroll-behavior) */
    function alvo(e){var g=document.getElementById('gw');if(g){if(!g.contains(e.target)||g.scrollTop>0||(window.__lfGzPtr&&!window.__lfGzPtr()))return null;return g}
      var c=e.target.closest&&e.target.closest('#layer .scrim.pg,#vscr');if(c)return c.scrollTop>0?null:c;
      if(H.classList.contains('ppop')||H.classList.contains('lock')||(window.scrollY||H.scrollTop)>0)return null;
      if(e.target.closest&&e.target.closest('#drw,.modal,.panel,.dpn,.fpn,.dsp,#layer'))return null;return document.scrollingElement||H}
    addEventListener('touchstart',function(e){if(e.touches.length!==1)return;if(e.target.closest&&e.target.closest('input,textarea,select,.zoom,.zm,[data-zoom]'))return;var c=alvo(e);if(!c)return;pu={c:c,y0:e.touches[0].clientY,x0:e.touches[0].clientX,dy:0,on:false}},{passive:true});
    addEventListener('touchmove',function(e){if(!pu)return;var dy=e.touches[0].clientY-pu.y0,dx=Math.abs(e.touches[0].clientX-pu.x0);if(!pu.on){if(dy>10&&dy>dx*1.3&&pu.c.scrollTop<=0)pu.on=true;else if(dy<-4||dx>12){pu=null;return}else return}
      pu.dy=Math.max(0,dy);var d=Math.min(150,pu.dy*.5),s=el();s.style.opacity=String(Math.min(1,d/40));s.style.transform='translateX(-50%) translateY('+Math.min(d,90)*.7+'px)';arc.style.strokeDashoffset=String(88-88*Math.min(1,d/60)*.8);s.classList.toggle('pronto',d>=60);if(e.cancelable)e.preventDefault()},{passive:false});
    addEventListener('touchend',function(){if(!pu)return;var p=pu;pu=null;if(!p.on)return;var s=el();if(p.dy*.5<60){s.style.transition='opacity .25s,transform .25s';s.style.opacity='0';s.style.transform='translateX(-50%) translateY(0)';setTimeout(function(){s.style.transition=''},260);return}
      arc.style.strokeDashoffset='60';s.classList.add('gira');try{if(navigator.vibrate)navigator.vibrate(10)}catch(_){}ptrGuarda();setTimeout(function(){location.reload()},450)})})();
  function prodLeave(skip,rf){var n=prodDepth;prodOpen=false;prodDepth=0;waReset();setTimeout(pfundoTopo,80);if(prodTitle){document.title=prodTitle;prodTitle=''}
    if(!skip&&n>0){try{history.go(-n)}catch(_){}}
    if(rf)setTimeout(function(){prodMark(rf)},60)}
  function prodMark(rf){if(!rf||rf==='#cart')return;var b=document.querySelector('#grid [data-open="'+rf+'"]'),c=b&&b.closest('.card');if(!c)return;var r=c.getBoundingClientRect(),h=innerHeight||600;if(r.height&&(r.bottom<0||r.top>h)){try{c.scrollIntoView({block:'center'})}catch(_){}}c.classList.add('lastv');setTimeout(function(){c.classList.remove('lastv')},2600)}
  function pgBar(p){return '<div class="pgbar"><button type="button" class="pgback navb" data-pgback><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>'+esc(navTxt(p))+'</span></button></div>'}
  /* S429 (peça opção B, aprovado 18/11): no topo só "‹ Armações"; o caminho completo vai pequeno para o fim da página da peça */
  function pgCam(p){return '<nav class="lfcam" aria-label="'+LFI.tr('Você está em')+'"><button type="button" data-crumb="todos">'+LFI.tr('Catálogo')+'</button><i>›</i><button type="button" data-crumb="'+esc(p.tipo)+'">'+esc((TIPOS.filter(function(t){return t[0]===p.tipo})[0]||[0,''])[1])+'</button><i>›</i><span>'+p.ref+'</span></nav>'}
  /* v453: botão de favoritos também na página da peça (o coração voa para ele, igual ao catálogo) */
  /* 08/11 (aprovado): comparar e compartilhar no topo, ao lado do coração de cima (mesmo botão redondo) */
  function pgActs(p){return '<button type="button" class="ib fbtn pgact'+(st.cmp.indexOf(p.ref)>=0?' on':'')+'" data-cmp="'+p.ref+'" aria-label="'+LFI.tr('Comparar')+'">'+CMPI+'</button><button type="button" class="ib fbtn pgact" data-share="'+p.ref+'" aria-label="'+LFI.tr('Compartilhar')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.7l6.8-4M8.6 13.3l6.8 4"/></svg></button>'}
  
  function pgBarCart(){return ''}
  function pgBarAcc(t){return ''}
  function pgCart(re,pop,kind,ttl){
    kind=kind||'#cart';var url=kind==='#cart'?'/carrinho':'/conta',stt=kind==='#cart'?{lfc:1}:{lfa:1};
    lfBootFim();
    var sc=document.querySelector('#layer .scrim');if(sc){if(!re)sc.scrollTop=0;var hd=document.querySelector('header.top,.top');if(hd){var z=parseFloat(getComputedStyle(document.body).zoom)||1,hb=hd.getBoundingClientRect().bottom/z;if(hb>0&&hb<400)sc.style.top=hb+'px'}}
    if(re||prodOpen&&prodRef===kind)return;
    var de=prodOpen?prodRef:'';
    if(!prodOpen){try{var vs0=$('vscr'),pp0=document.querySelector('.sec.pop');sessionStorage.setItem('lf_back',JSON.stringify({h:pp0?pp0.id:'',sy:vs0?vs0.scrollTop:0,ps:pp0?pp0.scrollTop:0,tipo:st.tipo,gen:st.gen,q:st.q,sort:st.sort,rosto:st.rosto}))}catch(_){}}
    if(!prodTitle)prodTitle=document.title;document.title=(ttl||'Seu carrinho')+' · La Fouch';
    prodOpen=true;prodRef=kind;waReset();
    if(pop||pgPop)return;
    /* S429 Fila 32 (aprovado 20/11): carrinho e conta abrem POR CIMA da tela onde a pessoa está (cada um é um passo; o voltar devolve a tela de antes).
       Pedir a tela que está logo embaixo (carrinho → entrar → carrinho) é voltar para ela, não empilhar outra igual. */
    try{if(de&&history.state&&history.state.de===kind){pgPop=2;history.back()}else{prodDepth++;stt.d=prodDepth;stt.de=de;history.pushState(stt,'',url)}}catch(_){pgPop=0}}
  var pgPop=0;/* 1 = a tela está sendo redesenhada pelo voltar (não vira passo novo) · 2 = o próprio pgCart pediu o voltar (a tela já está desenhada) */
  function pgInit(p,pop){
    prodOpen=true;prodRef=p.ref;lfBootFim();waProd(p);try{document.activeElement&&document.activeElement.blur()}catch(_){}
    if(!prodTitle)prodTitle=document.title;document.title=p.nome+' ('+p.ref+') · La Fouch';
    if(!pop&&prodDepth===0){try{var vs0=$('vscr'),pp0=document.querySelector('.sec.pop');sessionStorage.setItem('lf_back',JSON.stringify({h:pp0?pp0.id:'',sy:vs0?vs0.scrollTop:0,ps:pp0?pp0.scrollTop:0,tipo:st.tipo,gen:st.gen,q:st.q,sort:st.sort,rosto:st.rosto}))}catch(_){}}
    if(!pop){try{prodDepth++;history.pushState({lfp:p.ref,d:prodDepth},'',rtProd(p.ref))}catch(_){prodDepth--}}
    var sc=document.querySelector('#layer .scrim');if(sc){sc.scrollTop=0;var hd=document.querySelector('header.top,.top');if(hd){var z=parseFloat(getComputedStyle(document.body).zoom)||1,hb=hd.getBoundingClientRect().bottom/z;if(hb>0&&hb<400)sc.style.top=hb+'px'}}
    var th=document.querySelectorAll('#layer .cth button');
    Array.prototype.forEach.call(th,function(b,i){colorFoto(p,i,function(u){var c=b.querySelector('.cim');if(c&&u)c.style.backgroundImage='url("'+u+'")'})});
    relInit()}
  window.addEventListener('popstate',function(e){var s=e.state;
    if(pgPop===2){pgPop=0;prodDepth=s&&s.d||1}
    else if(s&&s.lfa){prodDepth=s.d||1;prodRef='';pgPop=1;try{minhaConta()}finally{pgPop=0}}
    else if(s&&s.lfc){prodDepth=s.d||1;prodRef='';bag(0,true)}
    else if(s&&s.lfp&&find(s.lfp)){prodDepth=s.d||1;product(s.lfp,true)}
    else if(prodOpen){prodOpen=false;prodDepth=0;waReset();closeLayer(true)}
    pfundoTopo()});
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-cc]')){closeLayer();/* continuar comprando: volta ao catálogo com os filtros que a pessoa já tinha */var vt=document.getElementById('vitrine');if(!(MOBQ.matches&&vt&&vt.classList.contains('in')))setTimeout(function(){goTo('vitrine')},60);return}
    var pb=e.target.closest('[data-pgback]');if(pb){if(pb.getAttribute('data-pgback')==='cart'&&prodDepth>1){history.back()}else navVolta();return}
    var na=prodOpen&&e.target.closest('.top a[href^="#"],#drw a[href^="#"]');
    /* S46: link do menu aberto em cima da peça: fecha a peça sem mexer no histórico; o passo do menu vira a nova tela (voltar = a peça) */
    if(na&&na.closest('#drw')){var h0=na.getAttribute('href');if(h0&&h0!=='#'&&h0!=='#topo'){window.__lfDePeca=prodRef;var bx=document.querySelector('.sec.pop');window.__lfBaixo=bx?bx.id:'';closeLayer(true);setTimeout(function(){window.__lfDePeca=''},400);return}}
    if(na){e.preventDefault();var pr=prodRef;navApos(function(){var h=na.getAttribute('href');window.__lfDePeca=pr&&h&&h!=='#topo'&&h!=='#'?pr:'';na.click();setTimeout(function(){window.__lfDePeca=''},300)});return}
    var tb=e.target.closest('[data-cth]');if(tb){var m=tb.closest('.modal'),d=m&&m.querySelector('.sw [data-sw="'+tb.getAttribute('data-cth')+'"]');if(d)d.click()}});
  /* 08/11 NAVEGAÇÃO (aprovada, estilo B′): o voltar sempre diz para onde vai e leva exatamente para lá;
     logo = Início; a vitrine tem "‹ Início" e o título troca a categoria; o voltar do celular faz o mesmo que o da tela. */
  var NAVO={k:'home',t:'',ts:0},NAV_LV=null,NAV_RM=matchMedia('(prefers-reduced-motion: reduce)');
  try{var _lv=JSON.parse(localStorage.getItem('lf_lastv')||'null');if(_lv&&Date.now()-_lv.t<864e5&&!sessionStorage.getItem('lf_sess'))NAV_LV=_lv.r;sessionStorage.setItem('lf_sess','1')}catch(_){}
  /* 08/11 (aprovado): Ver todos de Novidades/Mais vendidos abre só essas peças, com esse título */
  function secSet(k){var m={};try{abas5().forEach(function(a){if(a[0]===k)a[2].forEach(function(p,i){m[p.ref]=i+1})})}catch(_){}return m}
  function navCat(t,g){if(t==='nov')return 'Novidades';if(t==='mv')return 'Mais vendidos';if(t==='fav')return 'Favoritos';if(t==='armacao')return 'Armações';if(t==='grau')return 'Leitura';if(t==='solar')return 'Solar';if(t==='of')return 'Ofertas';if(t==='la')return 'Leitura e armações';
    if(g==='f')return 'Feminino';if(g==='m')return 'Masculino';if(g==='u')return 'Unissex';return 'Catálogo'}
  function navTxt(p){var k=NAVO.k;return LFI.tr(k==='home'?'Início':k==='busca'?'Busca':k==='fav'?'Favoritos':k==='link'?navCat(p&&p.tipo):navCat(NAVO.t,NAVO.g))}
  /* de onde o cliente abriu a peça */
  document.addEventListener('click',function(e){var o=e.target.closest&&e.target.closest('[data-open],[data-fsopen]');if(!o||prodOpen)return;
    if(o.closest('#sov'))NAVO={k:'busca',ts:Date.now()};else if(o.closest('#fvs'))NAVO={k:'fav',ts:Date.now()};
    else if(document.documentElement.classList.contains('ppop'))NAVO={k:'vit',t:st.tipo,g:st.gen,ts:Date.now()};else NAVO={k:'home',ts:Date.now()}},true);
  var _product9=product;product=function(ref,pop){var q=find(ref);
    if(!pop&&!prodOpen&&Date.now()-(NAVO.ts||0)>2500)NAVO={k:'link',t:q&&q.tipo,ts:0};
    try{if(q)localStorage.setItem('lf_lastv',JSON.stringify({r:ref,t:Date.now()}))}catch(_){}
    var r=_product9.apply(this,arguments);navProdEnfeita(q,pop);return r};
  /* entrada: desliza da direita; o botão chega com a seta logo depois */
  function navProdEnfeita(q,pop){var sc=document.querySelector('#layer .scrim.pg');if(!sc)return;
    if(!NAV_RM.matches&&!document.documentElement.classList.contains('bootprod')){sc.classList.remove('navIn');void sc.offsetWidth;sc.classList.add('navIn');setTimeout(function(){sc.classList.remove('navIn')},460)}
    var b=sc.querySelector('.pgback.navb');if(b){b.classList.add('ent');setTimeout(function(){b.classList.remove('ent')},900)}
    setTimeout(function(){navRel(q)},0);setTimeout(function(){navRel(q)},500)}
  /* fim da peça: "Mais Armações · Ver todas ›" (o título só muda se as sugestões forem todas da mesma categoria) */
  function navRel(q){if(!q)return;var r=document.querySelector('#layer .rel');if(!r)return;var h=r.querySelector(':scope > b');if(!h)return;
    var t=q.tipo,its=[].slice.call(r.querySelectorAll('.ri[data-open]')).map(function(b){return find(b.getAttribute('data-open'))}).filter(Boolean);
    if(its.length&&its.every(function(x){return x.tipo===t})&&t)h.firstChild.nodeValue=LFI.tr('Mais')+' '+LFI.tr(navCat(t));
    if(!h.querySelector('.navv')){h.classList.add('navrh');h.insertAdjacentHTML('beforeend','<a class="navv" href="#vitrine" data-navcat="'+esc(t||'todos')+'">'+LFI.tr('Ver todas')+' ›</a>')}}
  /* depois que o histórico voltar (fechar a peça faz history.go), executa o próximo passo */
  function navApos(fn){var n=prodDepth;closeLayer();if(!(n>0)){fn();return}var feito=false,go=function(){if(feito)return;feito=true;removeEventListener('popstate',go);setTimeout(fn,40)};addEventListener('popstate',go);setTimeout(go,700)}
  function navAbreCat(t){st.col='';st.rosto='';st.gen='';st.tipo=t||'todos';try{drawGen();drawChips();drawFaces()}catch(_){}
    if(document.documentElement.classList.contains('ppop')){drawGrid();var v=$('vscr');if(v)v.scrollTop=0}else{openPanel('vitrine');drawGrid()}}
  function navVolta(){var k=NAVO.k,p=find(prodRef);
    if(k==='busca'&&V5.sabre)return navApos(function(){V5.sabre()});
    if(k==='fav'&&window.__fshAbre&&Object.keys(st.fav).length)return navApos(function(){window.__fshAbre()});
    if(k==='link'){var t=p&&p.tipo;return navApos(function(){navAbreCat(t)})}
    closeLayer()}
  /* 09/11 S29 (aprovado): o voltar do Android faz o mesmo que o ← do site. Tudo o que abre por cima (menu, folhas, foto ampliada,
     comparação) vira um passo no histórico; o voltar fecha só o que está por cima. Busca/favoritos → peça: o voltar reabre a busca/folha.
     Link direto da peça: o passo de baixo é a categoria da peça. */
  (function(){
    var H=history,OVP=false,OVSELF=0,ABERTO={};
    var OV=[
      {id:'drw',is:function(){var d=$('drw');return !!d&&d.classList.contains('on')},fecha:function(){var x=document.querySelector('#drw [data-dclose]');if(x)x.click()}},
      {id:'fsh',is:function(){var d=$('fsh');return !!d&&d.classList.contains('on')},fecha:function(){var d=$('fsh');d.classList.remove('on');d.setAttribute('aria-hidden','true')}},
      {id:'fvs',is:function(){var d=$('fvs');return !!d&&d.classList.contains('on')},fecha:function(){var d=$('fvs');d.classList.remove('on');d.innerHTML=''}},
      {id:'dsh',is:function(){var d=$('dsh');return !!d&&d.classList.contains('on')},fecha:function(){var d=$('dsh');d.classList.remove('on');d.setAttribute('aria-hidden','true')}},
      {id:'vcs',is:function(){var d=$('vcs');return !!d&&d.classList.contains('on')},fecha:function(){var d=$('vcs');d.classList.remove('on');d.setAttribute('aria-hidden','true')}},
      {id:'zoom',is:function(){return !!document.querySelector('#layer .big.zm')},fecha:function(){var b=document.querySelector('#layer .big.zm');if(!b)return;b._s=1;b._x=0;b._y=0;b.classList.remove('zm');var im=b.querySelector(':scope>img,:scope>svg');if(im)im.style.transform=''}},
      {id:'cmp',is:function(){return !!document.querySelector('#layer .modal.cmp')},fecha:function(){closeLayer()}},
      /* S429 Fila 32: os avisos e janelinhas também são passo (antes o voltar fechava a tela de baixo e deixava o aviso no ar) */
      {id:'cad',is:function(){return !!$('cad')},fecha:function(){addDlgClose()}},
      {id:'cpov',is:function(){return !!$('cpov')},fecha:function(){$('cpov').remove()}},
      {id:'dlgb',is:function(){return !!$('dlgb')},fecha:function(){dlgFecha()}},
      {id:'mapw',is:function(){return !!$('mapw')},fecha:function(){mapClose()}}];
    /* quem abre algo novo com uma folha aberta (ex.: menu → Catálogo) troca o passo da folha em vez de empilhar */
    var _push=H.pushState;
    H.pushState=function(s,t,u){/* S90: o passo da consulta do grau (gw) nunca é trocado: menu/busca/carrinho empilham por cima dele */if(H.state&&H.state.lfo&&H.state.lfo!=='gw'&&!OVP){var o=OV.filter(function(x){return x.id===H.state.lfo})[0];if(!o||!o.is()){ABERTO[H.state.lfo]=false;return H.replaceState(s,t,u)}}return _push.apply(H,arguments)};
    function confere(){OV.forEach(function(o){var ag=o.is(),era=!!ABERTO[o.id];if(ag===era)return;ABERTO[o.id]=ag;
      if(ag){if(OVP)return;if(o.id==='cmp'){CMPW=setTimeout(empCmp,800);return}empurra(o.id)}
      else if(!OVP&&!window.__lfLogo&&H.state&&H.state.lfo===o.id){
        /* 10/11 S113: o menu fechou porque a pessoa escolheu uma tela nele → o passo do menu é TROCADO pelo da tela (não desfeito).
           Antes o menu desfazia o passo dele e a tela abria sem passo próprio: o voltar do celular saía do site. */
        if(o.id==='drw'&&window.__lfMenuEsc&&Date.now()-window.__lfMenuEsc<1500){window.__lfMenuEsc=0;setTimeout(function(){if(H.state&&H.state.lfo==='drw'){var b=Object.assign({},H.state);delete b.lfo;b.lfmn=1;H.replaceState(b,'',location.href)}},900);return}
        OVSELF++;try{H.back()}catch(_){OVSELF--}}})}
    /* S113: escolher uma tela no menu (categoria, formato, atacado, ajuda, conta…) — não vale para fechar o menu nem para os ajustes */
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('#drw a,#drw [data-cta],#drw [data-navcat],#drw [data-mf]');if(!a)return;
      if(a.closest('[data-dclose]')||a.hasAttribute('data-dset')||a.hasAttribute('data-gzopen')||/^https?:|\.html$/.test(a.getAttribute('href')||''))return;window.__lfMenuEsc=Date.now()},true);
    function empurra(id){var b=Object.assign({},H.state||{},{lfo:id});OVP=true;try{_push.call(H,b,'',location.href)}catch(_){}OVP=false}
    /* a comparação fecha a peça (o histórico volta sozinho); o passo dela só entra depois disso */
    var CMPW=0;function empCmp(){CMPW=0;if(OV[6].is())empurra('cmp')}
    try{new MutationObserver(function(){confere()}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})}catch(_){}
    var POP=function(e){var s=e.state||{};
      if(OVSELF>0){OVSELF--;e.__lfStop=1;return}
      if(CMPW){clearTimeout(CMPW);CMPW=0;setTimeout(empCmp,0);return}
      /* voltou de cima de uma folha/menu/zoom/comparação: fecha só ela */
      var aberto=OV.filter(function(o){return o.is()});
      if(aberto.length&&!(s.lfo&&aberto.some(function(o){return o.id===s.lfo}))){var o=aberto[aberto.length-1];e.__lfStop=1;OVP=true;var cr=o.id==='cmp'&&H.state&&H.state.lfcr;
        try{o.fecha()}catch(_){}ABERTO[o.id]=false;OVP=false;
        if(o.id==='cmp'){var r=(window.__lfCmpR||'');window.__lfCmpR='';if(r&&find(r))setTimeout(function(){product(r)},30)}
        return}
      /* passo velho de uma folha que já fechou: pula */
      if(s.lfo&&s.lfo!=='gw'&&!OV.some(function(o){return o.id===s.lfo&&o.is()})){e.__lfStop=1;OVSELF++;try{H.back()}catch(_){OVSELF--}return}
      /* link direto: o passo de baixo é a categoria da peça */
      if(s.lnk&&prodOpen){e.__lfStop=1;prodOpen=false;prodDepth=0;try{waReset()}catch(_){}closeLayer(true);navAbreCat(s.lnk);return}
      /* saindo de uma peça aberta pela busca ou pela folha de favoritos: reabre como o ← do site */
      if(prodOpen&&!s.lfp&&!s.lfc&&!s.lfa){var k=NAVO.k;
        if(k==='busca'&&V5.sabre)setTimeout(function(){V5.sabre()},60);
        else if(k==='fav'&&window.__fshAbre&&Object.keys(st.fav).length)setTimeout(function(){window.__fshAbre()},60)}
    };
    /* roda antes de todos os outros (fila criada no começo do index.html), para poder parar os demais */
    if(window.__lfPop)window.__lfPop.push(POP);else addEventListener('popstate',POP,true);
    /* comparação: lembra a peça de onde veio (o voltar volta para ela) */
    var _cmp=compare;compare=function(){window.__lfCmpR=prodOpen?prodRef:'';return _cmp.apply(this,arguments)};
    /* link direto da peça: põe a categoria embaixo (uma vez por visita) */
    var _prodL=product;product=function(ref,pop){var r=_prodL.apply(this,arguments);
      try{if(!pop&&NAVO.k==='link'&&!window.__lfLnk&&prodOpen){window.__lfLnk=1;var q=find(ref),cur=H.state,u=location.href;if(q){OVP=true;H.replaceState({lfv:1,pn:'vitrine',lnk:q.tipo||'todos'},'',u);_push.call(H,cur,'',u);OVP=false}}}catch(_){OVP=false}
      return r};
  })();
  /* 09/11 S30 (aprovado): logo = Início no topo, num movimento só. Um véu da cor do fundo cobre a tela (120 ms), tudo fecha por baixo
     de uma vez (peça, catálogo, folhas, busca), a página vai ao topo e o véu some suave (220 ms). O histórico volta ao começo de uma vez
     (cada passo tem um número, posto no começo do index.html). */
  (function(){var RM=matchMedia('(prefers-reduced-motion: reduce)'),VEU=null;
    if(window.__lfPop)window.__lfPop.unshift(function(e){if(window.__lfLogo===2){window.__lfLogo=0;e.__lfStop=1;setTimeout(function(){try{urlSync()}catch(_){}},0)}});
    /* 10/11 S111: REGISTRO ÚNICO DE CAMADAS. Toda tela que abre por cima do site (consulta do Mochi, e as próximas) se registra aqui com
       {id, aberta(), fecha()}. O logo, o voltar e o Esc perguntam a este registro — uma tela nova já nasce funcionando com eles. */
    var CAM=window.__lfCam=window.__lfCam||[];window.__lfCamReg=function(c){for(var i=0;i<CAM.length;i++)if(CAM[i].id===c.id){CAM[i]=c;return}CAM.push(c)};
    function camAberta(){for(var i=0;i<CAM.length;i++)try{if(CAM[i].aberta())return CAM[i]}catch(_){}return null}
    function aberto(){var H=document.documentElement,ly=$('layer');if(ly&&ly.innerHTML.trim())return true;if(H.classList.contains('ppop'))return true;if(camAberta())return true;
      return ['drw','fsh','fvs','dsh','sov','vcs'].some(function(id){var d=$(id);return !!d&&d.classList.contains('on')})}
    function topo(){try{scrollTo({top:0,left:0,behavior:'instant'})}catch(_){try{scrollTo(0,0)}catch(__){}}}
    function fechaTudo(){
      CAM.forEach(function(c){try{if(c.aberta())c.fecha()}catch(_){}});
      try{var d=$('drw');if(d&&d.classList.contains('on')){var x=document.querySelector('#drw [data-dclose]');if(x)x.click()}}catch(_){}
      ['fsh','fvs','dsh','vcs'].forEach(function(id){var d=$(id);if(d&&d.classList.contains('on')){d.classList.remove('on');d.setAttribute('aria-hidden','true');if(id==='fvs')d.innerHTML=''}});
      try{if($('sov').classList.contains('on')&&V5.sfecha)V5.sfecha('todos')}catch(_){}
      /* 09/11 S34: para o que ainda estiver animando (peça entrando, foto voando) antes de fechar */
      try{document.querySelectorAll('#layer *,#layer').forEach(function(x){if(x.getAnimations)x.getAnimations().forEach(function(a){try{a.cancel()}catch(_){}})});document.querySelectorAll('#lfGhost,.lfGhost').forEach(function(x){x.remove()})}catch(_){}
      prodRef='';NAVO={k:'home',ts:0};window.__lfTopo=1;try{_closeLayer9(true)}catch(_){$('layer').innerHTML=''}
      closePanels();document.documentElement.classList.remove('lock');topo()}
    addEventListener('click',function(e){var l=e.target.closest&&e.target.closest('.top .logo');if(!l)return;e.preventDefault();e.stopImmediatePropagation();
      if(VEU)return;
      if(!aberto()){if((scrollY||0)>0)try{scrollTo({top:0,behavior:RM.matches?'auto':'smooth'})}catch(_){topo()}return}
      var n=(history.state&&history.state.__i)||0,v=VEU=document.createElement('div');
      v.style.cssText='position:fixed;inset:0;z-index:calc(var(--c-sistema) + 9);background:var(--bg);opacity:0;pointer-events:auto';document.body.appendChild(v);
      var troca=function(){window.__lfLogo=1;fechaTudo();
        if(n>0){window.__lfLogo=2;try{history.go(-n)}catch(_){window.__lfLogo=0}}else window.__lfLogo=0;
        setTimeout(function(){if(window.__lfLogo)window.__lfLogo=0},1500);
        /* 09/11 S34: o Destaque volta para a 1ª peça e o giro recomeça (não troca de foto logo na chegada) */
        try{if(typeof dstGira==='function'){if(V5.di){V5.di=0;var h=$('hdst');if(h&&typeof dstHtml==='function'){var t=document.createElement('div');t.innerHTML=dstHtml();if(t.firstElementChild)h.replaceWith(t.firstElementChild)}}dstGira()}}catch(_){}
        /* o véu só sai quando a página já está mesmo no topo (no celular a rolagem pode demorar alguns quadros) */
        var tent=0,sai=function(){topo();if((scrollY||0)>1&&tent++<20){requestAnimationFrame(sai);return}
          var fim=function(){topo();v.remove();VEU=null};
          if(RM.matches||!v.animate){fim();return}
          var a=v.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-in-out',fill:'forwards'});a.onfinish=fim};
        requestAnimationFrame(function(){requestAnimationFrame(sai)})};
      if(RM.matches||!v.animate){v.style.opacity='1';troca();return}
      var a=v.animate([{opacity:0},{opacity:1}],{duration:120,easing:'ease-out',fill:'forwards'});a.onfinish=troca},true);
    /* 09/11 S48 A (aprovado): menu = recomeçar. O que abre pelo menu volta sempre ao Início ("‹ Início" e o voltar do celular).
       Com algo aberto por baixo (peça, catálogo, outra tela), o véu cobre, tudo fecha, o histórico volta ao começo e só então a tela pedida abre. */
    addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('#drw a[href^="#"],#drw [data-navcat],#drw [data-gzopen]');if(!a||window.__lfMenuGo)return;
      /* S371: "Mi cuenta" do menu (href="#") também recomeça como os outros itens — antes escapava daqui e, com a conta já aberta por baixo, a tela fechava e abria 3 vezes (imagem dobrada) */
      var h=a.getAttribute('href')||'',dac=a.classList.contains('dacc')&&a.getAttribute('data-cta')==='minha';
      /* com a própria conta já aberta por baixo, o item do menu só fecha o menu (mesma regra do "Descubra o seu grau", S90) */
      if(dac&&contaNaTela()){e.preventDefault();e.stopImmediatePropagation();var xc=document.querySelector('#drw [data-dclose]');if(xc)xc.click();return}
      if(!a.hasAttribute('data-navcat')&&!a.hasAttribute('data-gzopen')&&!dac&&(h==='#'||h==='#topo'))return;
      /* S90: com a consulta aberta, "Descubra o seu grau" no menu só fecha o menu */
      if(a.hasAttribute('data-gzopen')&&$('gw')){e.preventDefault();e.stopImmediatePropagation();var xx=document.querySelector('#drw [data-dclose]');if(xx)xx.click();return}
      var H=document.documentElement,ly=$('layer');if(!((ly&&ly.innerHTML.trim())||H.classList.contains('ppop')||$('gw')))return;
      e.preventDefault();e.stopImmediatePropagation();if(VEU)return;
      var n=(history.state&&history.state.__i)||0,v=VEU=document.createElement('div');
      v.style.cssText='position:fixed;inset:0;z-index:calc(var(--c-sistema) + 9);background:var(--bg);opacity:0;pointer-events:auto';document.body.appendChild(v);
      var sai=function(){var fim=function(){v.remove();VEU=null};if(RM.matches||!v.animate){fim();return}var an=v.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-in-out',fill:'forwards'});an.onfinish=fim};
      var segue=function(){topo();window.__lfMenuGo=1;try{a.click()}catch(_){}window.__lfMenuGo=0;setTimeout(function(){requestAnimationFrame(sai)},140)};
      var vai=function(){window.__lfLogo=1;try{if(window.__lfGzFecha)window.__lfGzFecha()}catch(_){}fechaTudo();
        if(n>0){window.__lfLogo=2;var ok=false,go=function(){if(ok)return;ok=true;removeEventListener('popstate',go);setTimeout(segue,40)};addEventListener('popstate',go);try{history.go(-n)}catch(_){go()}setTimeout(go,800)}
        else{window.__lfLogo=0;segue()}
        setTimeout(function(){if(window.__lfLogo)window.__lfLogo=0},1500)};
      if(RM.matches||!v.animate){v.style.opacity='1';vai();return}
      var an=v.animate([{opacity:0},{opacity:1}],{duration:120,easing:'ease-out',fill:'forwards'});an.onfinish=vai},true)})();
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-navcat]');if(!a)return;e.preventDefault();e.stopPropagation();var t=a.getAttribute('data-navcat');navApos(function(){navAbreCat(t)})},true);
  /* saída: a peça desliza de volta para a direita (a página já fica livre na hora) */
  var _closeLayer9=closeLayer;closeLayer=function(skip){var L=$('layer'),sc=L&&L.querySelector('.scrim.pg');
    if(sc&&!NAV_RM.matches&&sc.animate){try{var y=sc.scrollTop,tp=sc.querySelector('.cartp')?getComputedStyle(sc).top:'',g=document.createElement('div');if(tp)sc.style.setProperty('top',tp,'important');g.id='lfGhost';document.body.appendChild(g);g.appendChild(sc);sc.scrollTop=y;sc.style.pointerEvents='none';
      var sac=!!sc.querySelector('.cartp');if(sac){try{sc.getAnimations().forEach(function(a){a.cancel()})}catch(_){}}
      var an=sc.animate(sac?[{transform:'translateX(0)'},{transform:'translateX(100%)'}]:[{transform:'translateX(0)',opacity:1},{transform:'translateX(32%)',opacity:0}],{duration:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
      var fim=function(){if(g.parentNode)g.parentNode.removeChild(g)};an.onfinish=fim;setTimeout(fim,400)}catch(_){}}
    return _closeLayer9.apply(this,arguments)};
  /* vitrine: entrada no histórico (o voltar do celular fecha a vitrine em vez de sair do site) */
  /* 08/11 SITE LEVE: o carrossel "Descubra o seu formato" só é desenhado quando a tela dele abre (antes era desenhado escondido em toda visita, forçando o celular a recalcular a página inteira) */
  /* 09/11 S28d (aprovado, celular): página "Seu formato de rosto" no padrão do site — ‹ Início + título, câmera no topo (ícone no círculo), lista dos 6 formatos */
  var RZ_C={oval:'quase qualquer formato',redondo:'retangulares ou angulares',quadrado:'arredondadas ou ovais',alongado:'grandes e largas',coracao:'aviador ou leves',diamante:'gatinho ou ovais'};
  function rzMonta(){var r=$('rosto');if(!r||r.querySelector('.rzm'))return;var T=function(x){return LFI.tr(x)},CAM=function(z){return '<svg viewBox="0 0 24 24" width="'+z+'" height="'+z+'" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2.4h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.2" r="3.6"/></svg>'};
    var mk=function(u){return '<span class="rzi" style="-webkit-mask-image:url('+u+');mask-image:url('+u+')"></span>'};
    var h='<div class="rzm"><button type="button" class="navb vback rzb" data-vback><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>'+T('Início')+'</span></button>'+
      '<h2 class="rzt">'+T('Seu formato de rosto')+'</h2><p class="rzs">'+T('Veja quais armações valorizam o seu rosto.')+'</p>'+
      '<div class="rzc"><span class="rzq"><span class="rzo">'+CAM(30)+'</span></span><span class="rzx"><small>'+T('PELA CÂMERA · 1 MIN')+'</small><b>'+T('Descubra o seu formato')+'</b><button type="button" class="rzg" data-fa>'+CAM(18)+'<span>'+T('Abrir a câmera')+'</span></button></span></div>'+
      '<h3 class="rzh">'+T('Escolha o seu formato')+'</h3><div class="rzl">'+FACES.map(function(f){return '<button type="button" class="rzr" data-face="'+f.id+'"><span class="rzp">'+mk(f.m)+mk(f.f)+'</span><span class="rzn"><b>'+esc(f.nome)+'</b><small>'+T('Combina:')+' '+T(RZ_C[f.id]||'')+'</small></span><i aria-hidden="true">›</i></button>'}).join('')+'</div></div>';
    r.insertAdjacentHTML('afterbegin',h)}
  var _drawFaces9=drawFaces;drawFaces=function(){var r=$('rosto');if(r&&!r.classList.contains('pop')){drawFaces.sujo=1;return}drawFaces.sujo=0;return _drawFaces9.apply(this,arguments)};
  /* 09/11 S46 (aprovado): cada tela é um passo. Abrir uma tela por cima de outra EMPILHA (o voltar do Android e o "‹" levam à tela de onde veio);
     o "‹" diz o nome dessa tela; cada tela com o seu endereço. Aberta a partir de uma peça, o voltar reabre a peça. */
  var PNOME={atacado:'Atacado',como:'Como comprar',duvidas:'Dúvidas',rosto:'Formato do rosto',guia:'Guia'},PVOL={};
  function telaAtual(){if(prodOpen){var p=find(prodRef);return p?p.ref:LFI.tr('Voltar')}var pp=document.querySelector('.sec.pop');if(!pp)return LFI.tr('Início');
    if(pp.id==='vitrine'){var t=$('vtitT');return t&&t.textContent.trim()?t.textContent.trim():LFI.tr('Catálogo')}return LFI.tr(PNOME[pp.id]||'Voltar')}
  window.__lfTela=telaAtual;
  function pnBack(el,de){if(!el||!de)return;/* S48: tela que já tem o seu voltar (Ajuda) só troca o nome */var aj=el.querySelector('.ajbk');if(aj){aj.textContent='‹ '+de;var ob=el.querySelector(':scope>.pnbk');if(ob)ob.remove();return}if(el.id==='vitrine'){var v=el.querySelector('.vback span');if(v)v.textContent=de;return}
    var z=el.querySelector('.rzb span');if(z){z.textContent=de;return}
    var b=el.querySelector(':scope>.pnbk');if(!b){b=document.createElement('button');b.type='button';b.className='navb vback pnbk';b.setAttribute('data-vback','');b.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span></span>';el.insertBefore(b,el.firstChild)}
    b.querySelector('span').textContent=de}
  var _openPanel9=openPanel;openPanel=function(id,quiet){var H0=history.state||{},p0=document.querySelector('.sec.pop'),de=telaAtual(),dp=window.__lfDePeca||'';window.__lfDePeca='';
    if(H0.lfv&&H0.pn===id&&!dp){var rr=_openPanel9.apply(this,arguments);pnBack($(id),H0.de||LFI.tr('Início'));try{urlSync()}catch(_){}navTitulo();return rr}
    if(p0&&p0.id===id&&H0.lfv){var r0=_openPanel9.apply(this,arguments);pnBack($(id),H0.de||LFI.tr('Início'));navTitulo();return r0}
    var r=_openPanel9.apply(this,arguments);if(id==='rosto'){try{rzMonta()}catch(_){}if(drawFaces.sujo)drawFaces()}
    if(id!=='home'&&!prodOpen){if(dp){de=dp;PVOL[id]={r:dp,b:window.__lfBaixo||''}}else delete PVOL[id];window.__lfBaixo='';/* entrada por link/recarga: a tela de entrada não vira passo extra */var qz=window.__lfQuiet;if(qz)de=LFI.tr('Início');try{/* entrou direto numa tela: o Início fica por baixo (voltar do celular = ‹ Início) */var u0=location.href;if(qz===1){history.replaceState(null,'','/');history.pushState({lfv:1,pn:id,de:de},'',u0)}else if(!qz)history.pushState({lfv:1,pn:id,de:de},'',location.href)}catch(_){}pnBack($(id),de);try{urlSync()}catch(_){}}
    navTitulo();return r};
  addEventListener('popstate',function(e){var s=e.state||{},H=document.documentElement,cp=document.querySelector('.sec.pop');
    /* voltar de uma tela aberta pelo menu em cima da peça: a peça volta (outro ouvinte) e por baixo dela fica a tela de antes */
    if(s.lfp&&cp&&PVOL[cp.id]){var bb=PVOL[cp.id].b;delete PVOL[cp.id];if(bb&&$(bb))_openPanel9(bb,true);else homeAnim();return}
    if(s.lfp||s.lfc||s.lfa||s.sov||prodOpen)return;
    var reabre=cp&&PVOL[cp.id]&&(!s.lfv||s.pn!==cp.id)?PVOL[cp.id].r:'';if(reabre)delete PVOL[cp.id];
    if(s.lfv){if(!cp||cp.id!==s.pn)_openPanel9(s.pn&&$(s.pn)?s.pn:'vitrine',true);pnBack($(s.pn&&$(s.pn)?s.pn:'vitrine'),s.de||LFI.tr('Início'));try{navTitulo()}catch(_){}}
    else if(H.classList.contains('ppop'))homeAnim();
    if(reabre&&find(reabre))setTimeout(function(){product(reabre)},60)});
  /* logo = Início, de qualquer tela */
  document.addEventListener('click',function(e){var l=e.target.closest&&e.target.closest('.top .logo');if(!l||prodOpen)return;var H=document.documentElement;
    if(H.classList.contains('ppop')){e.preventDefault();e.stopPropagation();window.__lfTopo=1;if(history.state&&history.state.lfv&&!history.state.ent){try{history.back()}catch(_){homeAnim()}}else homeAnim();return}
    if((window.scrollY||0)>0){e.preventDefault();e.stopPropagation();try{window.scrollTo({top:0,behavior:NAV_RM.matches?'auto':'smooth'})}catch(_){window.scrollTo(0,0)}}},true);
  /* cabeçalho da vitrine: "‹ Início" + título (toque troca a categoria) */
  (function(){var ms=document.querySelector('.mobsearch'),fb=$('fbtn');if(!ms||!fb)return;
    var d=document.createElement('div');d.className='vnav';
    d.innerHTML='<button type="button" class="navb vback" data-vback><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>'+LFI.tr('Início')+'</span></button><div class="vtit"><b id="vtitT">'+LFI.tr('Catálogo')+'</b><small id="vtitN"></small></div>';
    ms.insertBefore(d,$('ftog')||fb)})();
  function navTitulo(){var t=$('vtitT'),n=$('vtitN');if(!t)return;var g=$('grid'),c=g?g.querySelectorAll('.card').length:0;
    t.textContent=LFI.tr(navCat(st.tipo,st.gen));n.textContent='';
    /* 08/11: com uma categoria escolhida, a etiqueta do tipo em cada cartão some (em Catálogo/Ofertas aparece) */
    document.documentElement.classList.toggle('vtipo',st.tipo==='armacao'||st.tipo==='grau'||st.tipo==='solar')}
  var _drawGrid9=drawGrid;drawGrid=function(){var r=_drawGrid9.apply(this,arguments);try{navTitulo()}catch(_){}return r};
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vback]');if(!b)return;e.preventDefault();
    if(history.state&&history.state.lfv&&!history.state.ent){try{history.back()}catch(_){homeAnim()}}else{homeAnim();try{history.replaceState(null,'','/')}catch(_){}}});
  /* folha das categorias (mesmo visual das folhas do site; fecha tocando fora ou arrastando para baixo) */
  var VCS=null;
  function vcsAbre(){var C=cat5(),cnt=function(t){return C.filter(function(p){return t==='todos'||(t==='of'?isOf(p):p.tipo===t)}).length};
    var L=[['todos','Todos'],['solar','Solar'],['grau','Leitura'],['armacao','Armações'],['of','Ofertas']].filter(function(x){return x[0]==='todos'||cnt(x[0])||st.tipo===x[0]});
    if(!VCS){VCS=document.createElement('div');VCS.id='vcs';VCS.setAttribute('aria-hidden','true');document.body.appendChild(VCS);
      VCS.addEventListener('click',function(e){if(e.target.closest('[data-vcsx]')){vcsFecha();return}var o=e.target.closest('[data-vct]');if(!o)return;var t=o.getAttribute('data-vct');vcsFecha();setTimeout(function(){navAbreCat(t)},120)});
      var y0=null,dy=0,pn=null;VCS.addEventListener('touchstart',function(e){pn=e.target.closest('.vcp');if(!pn||pn.scrollTop>0){pn=null;return}y0=e.touches[0].clientY;dy=0;pn.style.transition='none'},{passive:true});
      VCS.addEventListener('touchmove',function(e){if(!pn)return;dy=Math.max(0,e.touches[0].clientY-y0);pn.style.transform='translateY('+dy+'px)'},{passive:true});
      VCS.addEventListener('touchend',function(){if(!pn)return;pn.style.transition='';if(dy>90)vcsFecha();else pn.style.transform='';pn=null})}
    VCS.innerHTML='<div class="vcsc" data-vcsx></div><div class="vcp" role="dialog" aria-modal="true" aria-label="'+LFI.tr('Categorias')+'"><div class="gr"></div><small>'+LFI.tr('Categorias')+'</small>'+L.map(function(x){var on=st.tipo===x[0]||(x[0]==='todos'&&(st.tipo==='todos'||!st.tipo));return '<button type="button" data-vct="'+x[0]+'"'+(on?' class="on" aria-current="true"':'')+'><span>'+LFI.tr(x[1])+'</span><em>'+cnt(x[0])+'</em></button>'}).join('')+'</div>';
    VCS.querySelector('.vcp').style.transform='';requestAnimationFrame(function(){VCS.classList.add('on');VCS.setAttribute('aria-hidden','false')})}
  function vcsFecha(){if(!VCS)return;VCS.classList.remove('on');VCS.setAttribute('aria-hidden','true');var p=VCS.querySelector('.vcp');if(p)p.style.transform=''}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vcat]');if(!b)return;e.preventDefault();vcsAbre()});
  /* v2 "Combina também": parecidas de verdade + o caminho que a pessoa fez nesta visita (tipo, teste do rosto, gênero, o que abriu) */
  var REL_FMT=[['gat','gatit|gatinh|cat-eye|cateye'],['hex','hexag'],['qua','cuadrad|quadrad'],['red','redond'],['avi','aviador|aviator'],['ret','rectang|retang'],['ova','ovalad|oval'],['esp','deport|esport'],['cla','clasic|clássic|classic']];
  function relFmt(q){var n=String(q.nome||'').toLowerCase();for(var i=0;i<REL_FMT.length;i++)if(new RegExp(REL_FMT[i][1]).test(n))return REL_FMT[i][0];return ''}
  function relCor(a,b){var h=function(x){x=String(x||'').replace('#','');if(x.length!==6)return null;return [parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16)]},A=h(a),B=h(b);if(!A||!B)return 0;var d=Math.sqrt(Math.pow(A[0]-B[0],2)+Math.pow(A[1]-B[1],2)+Math.pow(A[2]-B[2],2));return d<60?1:d<110?.5:0}
  function relVistos(ref){var v=[];try{v=JSON.parse(sessionStorage.getItem('lf_vis')||'[]')}catch(_){}if(ref&&v[v.length-1]!==ref){v.push(ref);v=v.slice(-12);try{sessionStorage.setItem('lf_vis',JSON.stringify(v))}catch(_){}vistaConta(ref)}return v.map(find).filter(Boolean)}
  /* quantas vezes cada peça foi aberta: junta na visita e manda UM documento ao sair (vistas/<visita>) — o app soma e mostra "mais vistas e não vendidas" */
  function vistaConta(ref){if(/[?&]cliente=1/.test(location.search))return;var c={};try{c=JSON.parse(sessionStorage.getItem('lf_vc')||'{}')}catch(_){}c[ref]=(c[ref]||0)+1;try{sessionStorage.setItem('lf_vc',JSON.stringify(c));sessionStorage.setItem('lf_vc_n0','1')/* há peça vista nova para a análise mandar (anEnvia) */}catch(_){}}
  function relHtml(p){
    var V=relVistos(p.ref).filter(function(v){return v.ref!==p.ref}),fp=relFmt(p);
    var parec=function(a,b){var f=relFmt(a);return (f&&f===relFmt(b)?1:0)+(b.n?Math.max(0,1-Math.abs(a.n-b.n)/b.n/.3):0)*.6+relCor(a.cor,b.cor)*.4};
    var sc=function(q){var x=(fp&&relFmt(q)===fp?2:0)+(JSON.stringify(q.rosto)===JSON.stringify(p.rosto)?.6:0)+(p.n?Math.max(0,1-Math.abs(q.n-p.n)/p.n/.3)*1.5:0)+relCor(q.cor,p.cor)+(q.mat&&q.mat===p.mat?.8:0);
      if(V.length)x+=V.reduce(function(a,v){return a+parec(q,v)},0)/V.length*1.2;return x};
    var base=P.filter(function(q){return q.ref!==p.ref&&q.aviso!=='Esgotado'&&q.tipo===p.tipo}),L=base;
    /* fez o teste do rosto: só o que combina com o rosto dela; escolheu para quem: só esse gênero (quando sobra o bastante) */
    if(st.rosto){var r1=L.filter(function(q){return q.rosto.indexOf(st.rosto)>=0});if(r1.length>=3)L=r1}
    if(st.gen==='m'||st.gen==='f'){var g1=L.filter(function(q){return genOk(q,st.gen)});if(g1.length>=3)L=g1}
    L=L.map(function(q){return {q:q,s:sc(q)}}).sort(function(a,b){return b.s-a.s});
    var top=L.slice(0,8).map(function(x){return x.q});
    /* sempre uma mais em conta perto do começo */
    if(p.n&&!top.slice(0,4).some(function(q){return q.n<p.n*.85})){var bar=L.filter(function(x){return x.q.n<p.n*.85})[0];if(bar){top=top.filter(function(q){return q!==bar.q});top.splice(1,0,bar.q);top=top.slice(0,8)}}
    L=top;if(L.length<2)return ''; /* 08/11 (aprovado): com menos de 2 da mesma categoria a fileira não aparece */
    var it=function(q,cp){return '<button type="button" class="ri" data-open="'+q.ref+'"'+(cp?' tabindex="-1" aria-hidden="true"':'')+'><span class="rth">'+vis(q)+'</span><small>'+(q.ds!=null?'<i class="rds">'+esc(q.ds)+'</i>'+esc(q.ref):esc(q.nome))+'</small><b>'+fmt(q.n)+'</b></button>'};
    var html=L.map(function(q){return it(q,0)}).join('');
    if(L.length>3)html+=L.map(function(q){return it(q,1)}).join('');
    return '<div class="rel"><b>Combina também</b><div class="relg'+(L.length>3?' relm':'')+'" id="relm">'+html+'</div></div>'}
  /* faixa "Combina também": desliza sozinha da direita para a esquerda; ao tocar, para e dá para arrastar */
  function relInit(){
    var el=$('relm');if(!el||!el.classList.contains('relm'))return;
    /* 08/11 (aprovado): com 4+ da mesma categoria, ao aparecer os cartões sobem em cascata (a mesma animação "rise" dos cartões do catálogo) e a fileira desliza como sempre */
    try{if(!NAV_RM.matches&&window.IntersectionObserver){var its=[].slice.call(el.querySelectorAll('.ri:not([aria-hidden])'));its.forEach(function(b){b.style.opacity='0'});var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;io.disconnect();its.forEach(function(b,i){b.style.opacity='';if(b.animate)b.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:600,delay:Math.min(i,5)*70,easing:'ease',fill:'backwards'})})})},{threshold:.4});io.observe(el)}}catch(_){}
    (function(){var dn=false,sx=0,sl=0,moved=false;
      el.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;dn=true;moved=false;sx=e.clientX;sl=el.scrollLeft});
      window.addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-sx;if(!moved&&Math.abs(dx)>5){moved=true;el.classList.add('drag')}if(moved){el.scrollLeft=sl-dx;var h=el.scrollWidth/2;if(el.scrollLeft>=h){sl-=h;el.scrollLeft-=h}else if(el.scrollLeft<=0){sl+=h;el.scrollLeft+=h}}});
      function end(){if(!dn)return;dn=false;el.classList.remove('drag')}
      window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
      el.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
      el.addEventListener('dragstart',function(e){e.preventDefault()})})();
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var pos=el.scrollLeft,last=0,hold=0,self=false,touching=false;
    function bump(){hold=Date.now()+2500}
    function down(){touching=true}
    function up(){touching=false;bump()}
    el.addEventListener('touchstart',down,{passive:true});
    ['touchend','touchcancel'].forEach(function(ev){el.addEventListener(ev,up,{passive:true})});
    ['wheel','keydown'].forEach(function(ev){el.addEventListener(ev,bump,{passive:true})});
    el.addEventListener('mouseenter',down);el.addEventListener('mouseleave',up);
    el.addEventListener('scroll',function(){if(self){self=false;return}pos=el.scrollLeft;bump()},{passive:true});
    /* S426: a largura é medida no máximo 1×/s e a faixa não anda fora da tela (antes media a cada quadro e obrigava a arrumar a tela) */
    var half=0,hT=-1e9,vis=true;try{new IntersectionObserver(function(es){vis=es[es.length-1].isIntersecting}).observe(el)}catch(_){}
    function step(t){
      if(!el.isConnected)return;
      var dt=last?Math.min(64,t-last):16;last=t;
      if(vis&&!touching&&Date.now()>hold&&!document.hidden){if(t-hT>1000){half=el.scrollWidth/2;hT=t}pos+=dt*0.024;if(half>0&&pos>=half)pos-=half;self=true;el.scrollLeft=pos}
      requestAnimationFrame(step)}
    requestAnimationFrame(step)}
  var CARTI='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 3h2.6l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 7H6"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>';
  var FI={loja:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9l1.5-5h13L20 9M4 9v10h16V9M4 9h16M9 19v-5h6v5"/></svg>',rel:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',ret:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/></svg>'};
  function baseRestore(){var sv=null;try{sv=JSON.parse(sessionStorage.getItem('lf_back')||'null')}catch(_){}
    try{history.replaceState(null,'',location.pathname.replace(/^\/(p|modelo)\/.*/,'/'))}catch(_){}
    var h=sv&&PAN[sv.h]?sv.h:'vitrine';
    try{if(sv){st.tipo=sv.tipo||'todos';st.gen=sv.gen||'';st.q=sv.q||'';st.sort=sv.sort||'nov';st.rosto=sv.rosto||'';$('q').value=st.q;$('q2').value=st.q;$('sort').value=st.sort;drawGrid()}}catch(_){}
    window.__lfQuiet=2;try{openPanel(h,true)}finally{window.__lfQuiet=0}
    if(sv){var ap=function(){var vs=$('vscr'),pe=document.getElementById(h);if(h==='vitrine'&&vs)vs.scrollTop=sv.sy||0;else if(pe)pe.scrollTop=sv.ps||0};ap();[150,500,1200].forEach(function(t){setTimeout(ap,t)})}}
  var prodOpen=false,prodDepth=0,prodRef='',prodNext=false,prodTitle='';
  function product(ref,pop){
    var p=find(ref),esg=p.aviso==='Esgotado',dots=!!(p.lib&&p.cores&&p.cores.length>1),sw=dots;if(p.lib)st.cor[p.ref]=0;
    var q1=function(){return fmt(p.n)},offer=isOf(p),pct=offer?Math.round((1-p.n/p.de)*100):0;
    var buyH='<div class="buy" data-q="1">'+(esg?'':'<div class="tot"><span>Total</span><b data-ptot>'+q1()+'</b></div>')+'<div class="buyrow">'+(esg?'':'<div class="mq" role="group" aria-label="Quantidade"><button type="button" data-pq="-1" aria-label="Diminuir">−</button><b data-pqn>1</b><button type="button" data-pq="1" aria-label="Aumentar">+</button></div>')+'<button type="button" class="bb p" data-addm="'+p.ref+'"><i class="shn"></i><span>'+(esg?'Avise-me':document.documentElement.classList.contains('lojamodo')?LFI.tr('Quero este'):'Comprar')+(esg?'':'<small class="bt" data-ptot> · '+q1()+'</small>')+'</span><em>'+CARTI+'</em></button></div></div>',thumbs=dots?'<div class="dl cthl">'+LFI.tr('Cor')+' · <b class="cthn">'+esc(corNome(p,st.cor[p.ref]||0))+'</b></div><div class="cth cthm" role="group" aria-label="Cores">'+p.cores.map(function(c,i){return '<button type="button" class="'+(i?'':'on')+'" data-cth="'+i+'" aria-label="'+esc(corNome(p,i))+'"><span class="cim"></span><i style="background:'+c+'"></i></button>'}).join('')+'</div>':'';
    var one=!sw;
    if(one){var th1='<button type="button" class="on" aria-label="'+esc(corNome(p,0))+'"><span class="cim" data-pf="'+p.ref+'"'+(p.foto?' style="background-image:url(&quot;'+p.foto+'&quot;)"':'')+'></span><i style="background:'+p.cores[0]+'"></i></button>';thumbs='<div class="cthl"><span>Cor</span> · <b>'+esc(corNome(p,0))+'</b></div><div class="cth cthm one" role="group" aria-label="Cores">'+th1+'</div>'}
    var thumbsD=thumbs.replace('cth cthm','cth cthd');
    var pubL={m:'Masculino',f:'Feminino',u:'Unissex'}[p.gen];
    prodNext=true;
    layer(pgBar(p)+'<div class="modal pgm" role="dialog" aria-modal="true" aria-label="'+esc(p.nome)+'"><div class="xw"><button class="x" data-close aria-label="Fechar">×</button></div><div class="pgl"><div class="big" data-zoom>'+(p.gv&&!ggPode(p)?'<button type="button" class="g360" data-g360="'+esc(p.ref)+'" aria-label="Ver a peça girando em 360°"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 4 0 1 1-4.5-3.5"/><path d="M17 5l-.5 3.5L20 9"/></svg><span>360°</span></button>':'')+/* S196: na foto só OFERTA e/ou ÚLTIMAS UNIDADES */(offer?'<div class="pgtags"><span class="ofpill">OFERTA</span></div>':'')+(esg&&p.esgRes?'<span class="stk e pgstk">Reservada agora</span>':'')+(!esg&&/Últim/.test(p.aviso||'')?'<span class="stk u pgstk">'+esc(p.aviso)+'</span>':'')+'<button type="button" class="fav dfav'+(st.fav[p.ref]?' on':'')+'" data-fav="'+p.ref+'" aria-label="Favoritar" aria-pressed="'+(!!st.fav[p.ref])+'">'+HEART+'</button>'+vis(p)+'<span class="zh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/></svg>Toque para ampliar</span><span class="shine" style="position:absolute;top:0;bottom:0;left:0;width:18%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.9),transparent);animation:shine 4.5s ease-in-out infinite"></span></div>'+thumbs+'</div>'+
    '<div class="det"><header class="dh"><div class="dm"><span class="ref">'+p.ref+'</span><i></i><span class="ref">'+esc(p.tag==='NOVO'?({solar:'SOLAR',grau:'LEITURA',armacao:'ARMAÇÃO'}[p.tipo]||''):p.tag)+(p.ds!=null&&p.mat&&lfnMat(p.mat).toUpperCase()!==String(p.tag).toUpperCase()?' · '+esc(lfnMat(p.mat).toUpperCase()):'')+'</span>'+edb(p)+'<span class="dmi">'+pgActs(p)+'</span></div><h2>'+esc(nomeSC(p))+'</h2><div class="dp'+(offer?' dof':'')+'">'+(offer?'<span class="pof"><s>'+fmt(p.de)+'</s><b>'+fmt(p.n)+'</b><em>−'+pct+'%</em></span>':'')+(offer?'':'<span class="pr">'+prx(p)+'</span>')+(!esg&&aceitaCup(p)?'<span class="acup fsl">'+LFI.tr('Cupom disponível')+'</span>':'')+(esg?'<span class="dav e">'+esc(p.aviso)+'</span>':'')+'</div>'+(offer?'<div class="pec">Você economiza '+fmt(p.de-p.n)+'</div>':'')+(txtAuto(p)?'<p class="dtx">'+esc(txtAuto(p))+'</p>':'')+'</header>'+
    '<div class="chips">'+(pubL?'<span class="bd">'+GENI[p.gen]+pubL+'</span>':'')+(p.mat?'<span class="bd">'+MATI+esc(p.mat)+'</span>':'')+(p.uv?'<span class="bd">'+UVI+'Proteção UV400</span>':'')+(isPol(p)?'<span class="bd">'+POLI+'Polarizado</span>':'')+'</div>'+
    (p.desc?'<div class="pdesc"><p>'+esc(p.desc)+'</p><button type="button" data-pdm>Ver mais</button></div>':'')+
    (esg?voltaSec(p):'')+
    cupPecaHtml(p)+
    (p.gr&&p.gr.length?grauSec(p):'')+
    (p.med&&p.med.length>2?'<section class="dsec"><span class="dsl">Medidas</span><div class="meds"><div class="med"><b>'+p.med[0]+'<i>mm</i></b><span>Lente</span></div><div class="med"><b>'+p.med[1]+'<i>mm</i></b><span>Ponte</span></div><div class="med"><b>'+p.med[2]+'<i>mm</i></b><span>Haste</span></div></div></section>':'')+
    (sw?'<section class="dsec'+(dots?' dcor':'')+'"><div class="dl"><span>Cor</span> · <b id="cn">'+esc(corNome(p,st.cor[p.ref]||0))+'</b></div><div class="sw" aria-label="Cores">'+p.cores.map(function(c,i){var xo=p.qs&&p.qs[i]===0;return '<button type="button" class="dt'+(i?'':' on')+(xo?' x':'')+'" data-sw="'+i+'" data-ref="'+p.ref+'" aria-label="'+esc(corNome(p,i))+(xo?' (esgotada)':'')+'"><span style="background:'+c+'"></span></button>'}).join('')+'</div>'+(dots?thumbsD:'')+'</section>':(one?'<section class="dsec dcor dcor1"><div class="dl"><span>Cor</span> · <b>'+esc(corNome(p,0))+'</b></div>'+thumbsD.replace(/<div class="cthl">.*?<\/div>/,'')+'</section>':''))+
    buyH+
    '</div>'+relHtml(p)+pgCam(p)+'</div>','pg');pgInit(p,pop);try{ggMonta(p)}catch(_){}}
  /* celular: a reserva abre igual ao menu (painel desliza, fundo escurece, itens entram em sequência), vindo da direita */
  
  function bag(re,pop){
    var ks=Object.keys(st.cart),lg=logado(),nq=ks.reduce(function(a,k){return a+st.cart[k]},0);
    if(re){var sc=document.querySelector('#layer .scrim'),top=sc?sc.scrollTop:0}
    prodNext=true;
    var TR='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>';
    var items=ks.map(function(k){var p=find(k);return '<div class="ci"><div class="cimg">'+vis(p)+'</div><div class="cit"><small>'+p.ref+'</small><b>'+esc(p.nome)+'</b>'+'<div class="pu"><span>'+fmtL(p,1)+'</span> <span>'+LFI.tr('por unidade')+'</span></div>'+'</div><div class="cif"><div class="cia"><div class="qty"><button data-dec="'+k+'" aria-label="Menos"'+(st.cart[k]<=1?' disabled aria-disabled="true"':'')+'>−</button><span>'+st.cart[k]+'</span><button data-inc="'+k+'" aria-label="Mais">+</button></div><button type="button" class="crl" data-rm="'+k+'">'+LFI.tr('Remover')+'</button></div><div class="cis"><small>'+LFI.tr('Subtotal')+'</small><div class="pr">'+fmtL(p,st.cart[k])+'</div></div></div><button class="crm" data-rm="'+k+'" aria-label="Remover"><span class="crx">×</span></button></div>'}).join('');
    var es=window.LFI&&LFI.lang==='es',cnt=nq+(es?(nq===1?' artículo':' artículos'):(nq===1?' item':' itens'));
    var ste=ks.length>0&&lg?(st.step==='ent'||st.step==='pag'?st.step:''):'',dd=!!ste,cnow=dd?contaNorm(getConta()):null,entD=st.ent==='delivery';
    var sum='<div class="cs"><h3 class="cs-h">'+LFI.tr(dd?'Seu pedido':'Resumo')+'</h3>'+
      '<div class="cs-r cs-h"><span>'+LFI.tr('Subtotal')+' · '+cnt+'</span><span>'+LFI.fmtD(brutoD())+'</span></div>'+cupHtml(dd)+'<div class="cs-r cs-h"><span>'+LFI.tr('Entrega')+'</span><span>'+(dd&&entD?(st.tr&&trOk(st.tr)?esc(trNome(st.tr))+' · '+(freteG()?LFI.fmtD(LFI.pv(freteG())):LFI.tr('frete na entrega')):LFI.tr('Delivery · frete na entrega')):LFI.tr('Retirada na loja · grátis'))+'</span></div>'+
      '<div class="cs-t"><span>'+(dd&&entD&&freteG()?LFI.tr('Total com frete'):'Total')+'</span><b>'+LFI.fmtD(totalD()+(dd&&entD?LFI.pv(freteG()):0))+'</b></div>'+
      (ste==='pag'?'<button class="btn w cs-b" data-send'+(st.pag?'':' aria-disabled="true" style="opacity:.55"')+'>Confirmar e pagar</button><span class="cs-n cs-h">As peças ficam reservadas enquanto você paga.</span>'
        :ste==='ent'?'<button class="btn w cs-b" data-cta="irpag">Forma de pagamento</button>'
        :'<button class="btn w cs-b" data-cta="prosseguir">Prosseguir com o pagamento</button><button type="button" class="cs-c" data-cc>Continuar comprando</button>')+'</div>';
    var stp=ks.length?'<div class="stp"><span class="'+(dd?'ok':'on')+'"><b>1</b>Carrinho</span><i>›</i><span class="'+(ste==='pag'?'ok':ste==='ent'?'on':'')+'"><b>2</b>Entrega</span><i>›</i><span class="'+(ste==='pag'?'on':'')+'"><b>3</b>Pagamento</span></div>':'';
    var cph=dd?'<div class="cph"><h2><button type="button" class="cfx" data-cta="'+(ste==='pag'?'voltarent':'voltarcart')+'" style="font-size:15px">‹ <span>'+(ste==='pag'?'Voltar à entrega':'Voltar ao carrinho')+'</span></button></h2><button class="x" data-close aria-label="Fechar" style="align-self:auto">×</button></div>'
      :'<div class="cph"><h2>Seu carrinho'+(ks.length?' <span class="cn">· '+cnt+'</span>':'')+'</h2><button class="x" data-close aria-label="Fechar" style="align-self:auto">×</button></div>';
    layer(pgBarCart()+'<aside class="panel cartp" role="dialog" aria-modal="true" aria-label="Seu carrinho">'+cph+stp+
      (ks.length?(dd?'<div class="cgr"><div class="cl">'+(ste==='pag'?pagHtml(cnow):entHtml(cnow))+'</div>'+sum+'</div>':'<div class="cgr"><div class="cl">'+items+'</div>'+sum+'</div>')
      :'<div class="note" style="margin-top:20px">Seu carrinho está vazio. Volte ao catálogo e escolha um produto.</div><button type="button" class="cs-c" data-cc style="margin-top:14px;padding:0 20px">Continuar comprando</button>')+'</aside>','pg'+(re?' still':''));pgCart(re,pop);if(re){var pn=document.querySelector('#layer .scrim');if(pn)pn.scrollTop=top}else bagEntra()}
  /* S286 sacola de luxo (aprovado S252): entra inteira da direita em 460 ms; a saída está em closeLayer */
  function bagEntra(){try{var sc=document.querySelector('#layer .scrim.pg');if(!sc||!sc.animate||matchMedia('(prefers-reduced-motion: reduce)').matches)return;sc.classList.add('bgLux');sc.animate([{transform:'translateX(100%)'},{transform:'none'}],{duration:460,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})}catch(_){}}
  function mensagem(modo,ref){return LFI.tr(mensagem0(modo,ref))}
  /* B5 (11/11, S124–S127 aprovados): Ajuda em páginas próprias (sem sanfona) — Como comprar · Dúvidas frequentes · Dicas e cuidados · Entre em contato.
     Cada página entra no histórico: o voltar do celular volta para a página anterior. */
  var AJ={pg:''};
  function ajCard(at,f,tag,t,sub){return '<button type="button" '+at+'><span class="gi">'+(f&&f.foto?'<img src="'+f.foto+'" alt="" loading="lazy">':'')+'</span><span class="gt"><small>'+LFI.tr(tag)+'</small><b>'+LFI.tr(t)+'</b>'+(sub?'<em class="gsub">'+LFI.tr(sub)+'</em>':'')+'</span></button>'}
  function ajPeca(re,n){var vi=0;return cat5().filter(function(p){return p.aviso!=='Esgotado'&&re(p)&&vi++<n}).map(function(p){return card5(p,0)}).join('')}
  function ajHtml(pg){var T=LFI.tr,vt=function(v,t){return '<a href="#" class="ajbk" data-ajv="'+v+'">‹ '+T(t)+'</a>'},vc=function(t){return '<a href="#vitrine" class="ajvc" data-mf="tipo:'+t+'">'+T('Ver catálogo')+' <i>›</i></a>'};
    if(pg==='comprar')return vt('','Ajuda')+'<h2>'+T('Como comprar')+'</h2><div class="ajtx">'+
      [['Escolha','Coloque no carrinho os modelos que gostou.'],['Entre ou crie sua conta','É rápido: nome, e-mail e senha, ou com o Google.'],['Entrega','Retire na loja em Ciudad del Este ou receba por delivery no Paraguai.'],['Pagamento','PIX (em reais) ou transferência Banco Familiar (Paraguai) (em guaranis). As peças ficam reservadas enquanto você paga.']].map(function(x,k){return '<p><b><span class="ajn">'+(k+1)+'</span>'+T(x[0])+'</b>'+T(x[1])+'</p>'}).join('')+'</div>';
    if(pg==='duvidas')return vt('','Ajuda')+'<h2>'+T('Dúvidas frequentes')+'</h2><div class="ajtx">'+
      [['Como eu compro?','Coloque os modelos no carrinho, entre com a sua conta (ou com o Google), escolha retirar na loja ou delivery e pague. Pronto.'],['Como pago?','PIX (em reais) ou transferência Banco Familiar (Paraguai) (em guaranis), na hora do pedido.'],['Até quando fica reservado?','Enquanto você paga e, depois do pagamento, até a entrega ou a retirada.'],['Fazem delivery?','Sim, para todo o Paraguai. De outros países, você retira na loja em Ciudad del Este.'],['Fazem lentes com a minha receita?','Não. Só vendemos óculos de leitura prontos. Com receita, escolha uma armação e leve a uma ótica.'],['Posso trocar se não gostar?','Na retirada, sim, por outro modelo (pode haver ajuste de preço).']].map(function(x){return '<p><b>'+T(x[0])+'</b>'+T(x[1])+'</p>'}).join('')+
      '<p><b>'+T('Não sei qual grau de leitura usar')+'</b>'+T('Faça o teste de leitura com o Mochi: leva 1 minuto.')+' <a href="#" class="ajl" data-gzopen>'+T('Fazer o teste')+' <i>›</i></a></p></div>';
    if(pg==='dicas'){var GF=guiaFotos(),f=function(id){var x=GF.filter(function(y){return y.g.id===id})[0];return x?x.f:null};
      return vt('','Ajuda')+'<h2>'+T('Dicas e cuidados')+'</h2><div class="hgu ajg">'+ajCard('data-gpan="rosto"',f('formato'),'SEU ROSTO','Qual óculos combina com o meu rosto?','Leva menos de 1 minuto')+ajCard('data-ajp="art-tipos"',f('tipos'),'ESCOLHA CERTA','Leitura, armação ou solar: qual é a diferença?','Entenda antes de comprar')+ajCard('data-ajp="art-uv"',f('uv'),'SOL','UV400 e polarizado: qual é a diferença?','')+ajCard('data-ajp="art-limpar"',f('limpar'),'CUIDADOS','Como limpar seus óculos sem riscar','')+'</div>'}
    if(pg==='art-tipos')return vt('dicas','Dicas e cuidados')+'<h2>'+T('Leitura, armação ou solar?')+'</h2><div class="art"><span class="ey">'+T('ESCOLHA CERTA · 2 min de leitura')+'</span>'+
      [['LEITURA','Para ler de perto','Lentes prontas, de +0.25 a +4.00. Você escolhe o grau e leva na hora.','grau'],['ARMAÇÃO','Para a sua receita','Só a armação, sem grau. Leve a uma ótica e coloque as suas lentes.','armacao'],['SOLAR','Para o sol do dia a dia','Proteção UV400, que bloqueia praticamente todo o UV.','solar']].map(function(x){return '<div class="bl"><span class="ey">'+T(x[0])+'</span><h3>'+T(x[1])+'</h3><p class="tx">'+T(x[2])+'</p><div class="hg ajp">'+ajPeca(function(p){return p.tipo===x[3]},2)+'</div>'+vc(x[3])+'</div>'}).join('')+'</div>';
    if(pg==='art-limpar')return vt('dicas','Dicas e cuidados')+'<h2>'+T('Como limpar seus óculos sem riscar')+'</h2><div class="art"><span class="ey">'+T('CUIDADOS · 1 min de leitura')+'</span><div class="cu">'+
      [['Enxágue','Em água corrente, para tirar a poeira antes de esfregar.'],['Lave','Com uma gota de detergente neutro, dos dois lados da lente.'],['Seque','Com a flanela de microfibra, nunca com papel ou roupa.']].map(function(x){return '<p><b>'+T(x[0])+'</b>'+T(x[1])+'</p>'}).join('')+'</div>'+
      '<div class="bl"><span class="ey">'+T('HORA DE TROCAR?')+'</span><h3>'+T('Lente riscada ou armação gasta?')+'</h3><div class="hg ajp">'+ajPeca(function(p){return p.tipo==='grau'},2)+ajPeca(function(p){return p.tipo==='armacao'},2)+'</div>'+vc('la')+'</div></div>';
    if(pg==='art-uv'){var g0=$('layer').innerHTML;guiaAbre('uv');var d=document.querySelector('#layer .modal.guia .det'),h=d?d.innerHTML:'';$('layer').innerHTML=g0;if(!g0)document.documentElement.classList.remove('lock');
      var tmp=document.createElement('div');tmp.innerHTML=h;tmp.querySelectorAll('.x,h1').forEach(function(e){e.remove()});return vt('dicas','Dicas e cuidados')+'<h2>'+T('UV400 e polarizado: qual é a diferença?')+'</h2><div class="art guia">'+tmp.innerHTML+'</div>'}
    if(pg==='contato')return vt('','Ajuda')+'<h2>'+T('Entre em contato')+'</h2><p class="ajsub">'+T('Escreva para a gente. Respondemos por e-mail.')+'</p><form class="ajf" novalidate>'+
      '<label class="cfl" for="ctn">'+T('Nome completo')+'</label><input class="field" id="ctn" autocomplete="name">'+
      '<label class="cfl" for="cte">'+T('E-mail')+'</label><input class="field" id="cte" type="email" inputmode="email" autocomplete="email">'+
      '<label class="cfl" for="ctt">'+T('Telefone')+'</label><input class="field" id="ctt" type="tel" inputmode="tel" autocomplete="tel">'+
      '<label class="cfl" for="ctm">'+T('Mensagem')+'</label><textarea class="field" id="ctm" rows="5"></textarea>'+
      '<input type="text" id="ctsite" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px">'+
      '<div class="fze" id="cterr" role="alert" hidden></div><button type="submit" class="btn w" id="ctok">'+T('Enviar')+'</button></form>';
    var c=(typeof getConta==='function'&&getConta())||null;
    return '<a href="#" class="ajbk" data-vback>‹ '+T('Início')+'</a><h2>'+T('Ajuda')+'</h2><div class="ajm">'+
      [['duvidas','Dúvidas frequentes'],['dicas','Dicas e cuidados'],['contato','Entre em contato']].map(function(x){return '<a href="#" data-ajp="'+x[0]+'">'+T(x[1])+'<i>›</i></a>'}).join('')+'</div>'}
  function ajPinta(pg,hist){var w=document.querySelector('#como .ajw');if(!w)return;AJ.pg=pg||'';w.innerHTML=ajHtml(AJ.pg);w.setAttribute('data-ajpg',AJ.pg||'menu');
    var sc=$('como');if(sc)sc.scrollTop=0;try{window.scrollTo(0,0)}catch(_){}
    if(hist){try{history.pushState({lfaj:AJ.pg},'',location.href)}catch(_){}}
    if(MOV5()){var k=0;[].slice.call(w.children).forEach(function(e){e.animate([{transform:'translateY(12px)',opacity:0},{transform:'none',opacity:1}],{duration:380,delay:k++*50,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'})})}
    if(AJ.pg==='contato'){var c=(typeof getConta==='function'&&getConta())||null;if(c){if(c.nome)$('ctn').value=c.nome;if(c.email)$('cte').value=c.email;if(c.tel)$('ctt').value=c.tel}}}
  function MOV5(){return Element.prototype.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches}
  var _opAj5=openPanel;openPanel=function(id,q){var r=_opAj5.apply(this,arguments);if(id==='como'||id==='duvidas'){AJ.raiz=id==='duvidas'?'duvidas':'';ajPinta(AJ.raiz,false)}return r};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-ajp],[data-ajv]');if(!t)return;e.preventDefault();e.stopPropagation();
    var pg=t.hasAttribute('data-ajv')?t.getAttribute('data-ajv'):t.getAttribute('data-ajp');
    if(t.hasAttribute('data-ajv')){try{history.back()}catch(_){ajPinta(pg,false)}return}
    var aberto=$('como')&&$('como').classList.contains('pop');
    /* 11/11: aberta direto numa página (menu/rodapé), essa página é a raiz: um voltar só fecha a Ajuda */if(!aberto){try{if(typeof drwSet==='function')drwSet(false)}catch(_){}goTo('como');setTimeout(function(){AJ.raiz=pg;ajPinta(pg,false)},40)}else ajPinta(pg,true)},true);
  window.__lfPop.push(function(e){var c=$('como');if(!c||!c.classList.contains('pop'))return;var st0=e.state||{};
    if(st0.lfaj!=null){ajPinta(st0.lfaj,false);e.__lfStop=1;return}
    if(AJ.pg!==(AJ.raiz||'')){ajPinta(AJ.raiz||'',false);e.__lfStop=1}});
  document.addEventListener('submit',function(e){var f=e.target.closest&&e.target.closest('#como .ajf');if(!f)return;e.preventDefault();
    var v=function(i){return ($(i)||{value:''}).value.trim()},er=$('cterr'),bt=$('ctok'),fal=function(m,i){er.textContent=LFI.tr(m);er.hidden=false;if(i)try{$(i).focus()}catch(_){}};er.hidden=true;
    var nome=v('ctn').replace(/\s+/g,' ');if(nome.length<3||nome.indexOf(' ')<0)return fal('Digite seu nome e sobrenome.','ctn');
    if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v('cte')))return fal('Confira o e-mail.','cte');
    if(v('ctt').replace(/\D/g,'').length<7)return fal('Confira o telefone.','ctt');
    if(v('ctm').length<5)return fal('Escreva a sua mensagem.','ctm');
    bt.disabled=true;bt.textContent=LFI.tr('Enviando…');
    var ct=window.AbortController?new AbortController():null,tm=setTimeout(function(){ct&&ct.abort()},10000);
    acFetch(fnUrl('mensagem'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({acao:'enviar',tipo:'contato',nome:nome,email:v('cte'),tel:v('ctt'),msg:v('ctm'),site:v('ctsite'),lang:LFI.lang}),signal:ct?ct.signal:undefined})
      .then(function(r){clearTimeout(tm);return r.json().catch(function(){return {ok:false}})}).then(function(j){if(!j||!j.ok)throw new Error(j&&j.motivo||'erro');
        AJ.pg='';try{closePanels()}catch(_){}try{window.scrollTo({top:0,behavior:'smooth'})}catch(_){}setTimeout(function(){toast(LFI.tr('Mensagem enviada. Respondemos por e-mail em breve.'))},250)})
      .catch(function(x){clearTimeout(tm);bt.disabled=false;bt.textContent=LFI.tr('Enviar');fal(String(x&&x.message)==='muitas'?'Muitas mensagens em pouco tempo. Tente mais tarde.':'Não deu para enviar agora. Tente de novo ou fale com a loja pelo WhatsApp.')})},true);

  /* B3 (11/11, S156): catálogo sem bolinhas — linha de gênero só em texto + "Filtros ›" na mesma linha (abre a caixa de filtros de sempre) */
  function genRow(){var ms=document.querySelector('#vscr .mobsearch');if(!ms)return;var o=$('lfgen');
    if(!o){o=document.createElement('div');o.id='lfgen';o.className='lfgen';o.setAttribute('role','group');o.setAttribute('aria-label',LFI.tr('Gênero'));ms.insertAdjacentElement('afterend',o)}
    o.innerHTML=[['','Todos'],['f','Feminino'],['m','Masculino'],['u','Unissex']].map(function(g){return '<button type="button" data-gen="'+g[0]+'" aria-pressed="'+(st.gen===g[0])+'" class="'+(st.gen===g[0]?'on':'')+'">'+LFI.tr(g[1])+'</button>'}).join('');o.setAttribute('data-cabe','letra');
    /* "Filtros ›" fica na linha do título, na margem da direita (aprovado 18/11); a linha de base vem do próprio título (flex baseline) */
    var vt=document.querySelector('#vscr .vtit');if(vt&&!vt.querySelector('.lfgf'))vt.insertAdjacentHTML('beforeend','<a href="#" class="lfgf" data-lffil>'+LFI.tr('Filtros')+' <i>›</i></a>')}
  var _dg3=drawGrid;drawGrid=function(){var r=_dg3.apply(this,arguments);try{genRow()}catch(_){}return r};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-lffil]');if(!t)return;e.preventDefault();e.stopPropagation();var f=$('fbtn');if(f)f.click()},true);

  /* B2 (11/11): Favoritos dentro do carrinho — abas "Carrinho n | Favoritos n" no passo 1; trilha da peça clicável */
  st.cartTab='cart';
  function favRows(){var ks=Object.keys(st.fav).filter(function(k){return find(k)});if(!ks.length)return '<div class="note" style="margin-top:6px">'+LFI.tr('Você ainda não salvou nenhum favorito. Toque no coração da foto para guardar.')+'</div>';
    return ks.map(function(k){var p=find(k),esg=p.aviso==='Esgotado';return '<div class="ci fvi"><button type="button" class="cimg" data-open="'+k+'" aria-label="'+esc(p.nome)+'">'+vis(p)+'</button><div class="cit"><small>'+p.ref+'</small><b>'+esc(p.nome)+'</b><div class="pu"><span>'+fmtL(p,1)+'</span>'+(aceitaCup(p)?'<span class="fsl">'+LFI.tr('Cupom disponível')+'</span>':'')+'</div></div>'+
      '<div class="fva">'+(esg?'<span class="fvx">'+LFI.tr('Esgotado')+'</span>':'<button type="button" class="fvb" data-favcart="'+k+'">'+LFI.tr('Colocar no carrinho')+'</button>')+'<button type="button" class="crl" data-fav="'+k+'">'+LFI.tr('Remover')+'</button></div></div>'}).join('')}
  var _bag2=bag;
  bag=function(re,pop){_bag2(re,pop);var pn=document.querySelector('#layer .cartp');if(!pn||pn.querySelector('[data-cta="irpag"],[data-send]'))return;
    var nc=qtd(),nf=Object.keys(st.fav).filter(function(k){return find(k)}).length;if(!nf&&st.cartTab!=='fav')return;
    var h=pn.querySelector('.cph');if(!h)return;var tb=document.createElement('div');tb.className='ctb';tb.setAttribute('role','tablist');
    tb.innerHTML='<button type="button" role="tab" data-ctab="cart" aria-selected="'+(st.cartTab!=='fav')+'" class="'+(st.cartTab!=='fav'?'on':'')+'">'+LFI.tr('Carrinho')+' <small>'+nc+'</small></button><button type="button" role="tab" data-ctab="fav" aria-selected="'+(st.cartTab==='fav')+'" class="'+(st.cartTab==='fav'?'on':'')+'">'+LFI.tr('Favoritos')+' <small>'+nf+'</small></button>';
    h.insertAdjacentElement('afterend',tb);
    if(st.cartTab==='fav'){[].slice.call(pn.children).forEach(function(e){if(e!==h&&e!==tb)e.remove()});var w=document.createElement('div');w.className='fvl';w.innerHTML=favRows();pn.appendChild(w);var t2=h.querySelector('h2');if(t2)t2.innerHTML=LFI.tr('Favoritos')}};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-ctab],[data-favcart],[data-bagfav],[data-crumb],#layer .fvi [data-fav]');if(!t)return;
    if(t.hasAttribute('data-bagfav')){st.cartTab='fav';st.step='cart';return}
    if(t.hasAttribute('data-ctab')){e.preventDefault();e.stopPropagation();st.cartTab=t.getAttribute('data-ctab');bag(1);return}
    if(t.hasAttribute('data-favcart')){e.preventDefault();e.stopPropagation();var r=t.getAttribute('data-favcart');st.cart[r]=(st.cart[r]||0)+1;drawBag();pop();st.cartTab='cart';bag(1);toast(LFI.tr('Adicionado ao carrinho'));return}
    if(t.hasAttribute('data-crumb')){e.preventDefault();e.stopPropagation();var v=t.getAttribute('data-crumb');closeLayer();setTimeout(function(){st.tipo=v||'todos';st.gen='';st.col='';st.rosto='';try{drawGen();drawChips()}catch(_){}openPanel('vitrine',true);drawGrid()},80);return}
    if(t.closest('.fvi')&&t.hasAttribute('data-fav')){setTimeout(function(){bag(1)},0)}},true);
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-bag]');if(t&&!t.hasAttribute('data-bagfav')&&!document.querySelector('#layer .cartp'))st.cartTab='cart'},true);

  function mensagem0(modo,ref){
    if(modo==='lojista'){var q=($('aq')||{value:''}).value.trim(),pr=[].slice.call(document.querySelectorAll('[data-atp][aria-pressed="true"]')).map(function(x){return x.getAttribute('data-atp')});
      if(!st.atCod)st.atCod='A-'+(1000+Math.floor(Math.random()*9000));var es=LFI.lang==='es';
      /* 11/11 (aprovado): o país vem do idioma/moeda; sem cidade e sem favoritos na mensagem (esses vão só para o painel) */
      return 'ATACADO · '+st.atCod+'\n'+(es?'País: Paraguay':'País: Brasil')+(q?'\n'+(es?'Cantidad: ':'Quantidade: ')+q:'')+(pr.length?'\n'+(es?'Busca: ':'Procura: ')+pr.map(function(x){return LFI.tr(x)}).join(', '):'')+'\n'+(es?'¡Hola! Quiero un presupuesto mayorista.':'Olá! Quero um orçamento de atacado.')}
    if(modo==='avise'){var p=find(ref);return 'Olá! Me avise quando chegar: '+p.nome+' ('+p.ref+').\nVer o modelo: https://lafouch.com/p/'+encodeURIComponent(p.ref)+'.html'}
    var t='Olá! Quero reservar na La Fouch:\n'+Object.keys(st.cart).map(function(k){var p=find(k);return '• '+st.cart[k]+'× '+p.ref+' · '+p.nome+(p.cores&&p.cores.length>1?' · Cor: '+corNome(p,st.cor[k]||0):'')+(p.gr&&p.gr.length?' · Grau: '+p.gr[st.gr[k]||0]:'')+' · '+fmtL(p,st.cart[k])}).join('\n')+(descVale()==='cup'?'\n'+LFI.tr('Código')+' '+st.cup.cod+': −'+LFI.fmtD(cupInfo().dD):'')+'\nTotal: '+LFI.fmtD(totalD())+(LFI.cur==='BRL'?' (≈ '+LFI.fmtG(total())+')':'')+'\nVou provar e retirar na loja.';
    if(st.rosto){var ff=FACES.filter(function(x){return x.id===st.rosto})[0];if(ff)t+='\nFormato do meu rosto: '+ff.nome}if(st.nome)t+='\nNome: '+st.nome;if(st.zap)t+='\nWhatsApp: '+st.zap;return t}
  /* pedido do site: grava na nuvem (o app da loja recebe sozinho) e mostra a tela de pedido recebido */
  var PK_SVG='<svg width="104" height="104" viewBox="0 0 24 24" fill="none" stroke="#3ddc8c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M4.5 12.8l4.8 4.9L19.5 7"/></svg>';
  var PK_WA='<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2z"/></svg>';
  function fsv(v){if(v===null||v===undefined)return {nullValue:null};if(typeof v==='number')return Math.floor(v)===v?{integerValue:String(v)}:{doubleValue:v};if(typeof v==='boolean')return {booleanValue:v};if(Array.isArray(v))return {arrayValue:{values:v.map(fsv)}};if(typeof v==='object'){var f={};for(var k in v)f[k]=fsv(v[k]);return {mapValue:{fields:f}}}return {stringValue:String(v)}}
  /* reserva de 30 min (14/11; o prazo real vem do servidor): o servidor decide a hora e quantas peças sobram; se a função estiver desligada ou fora do ar, o pedido segue como antes */
  function resCall(acao,pedido,itens,refs,extra){
    var ct=window.AbortController?new AbortController():null,tm=setTimeout(function(){ct&&ct.abort()},8000),b={acao:acao,pedido:pedido};if(itens)b.itens=itens;if(refs)b.refs=refs;if(extra)for(var xk in extra)b[xk]=extra[xk];
    var o={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b),signal:ct?ct.signal:undefined};
    return idTok().then(function(t){o.headers.Authorization='Bearer '+t},function(){}).then(function(){return acFetch(fnUrl('reserva'),o)}).then(function(r){clearTimeout(tm);if(r.status>=500||r.status===404)return null;return r.json().catch(function(){return null})},function(){clearTimeout(tm);return null})}
  function resItens(its){return (its||[]).map(function(i){return {ref:i.ref,cor:i.cor||'',q:i.q}})}
  function resLeft(e){if(!e||!e.rx)return 0;return Math.max(0,e.rx-(Date.now()+(e.rd||0)))}
  /* S394: preço da linha como aparece na tela (moeda do cliente), para o e-mail do pedido */
  function pvLin(u,q){try{var b=window.LFI&&LFI.cur==='BRL',v=(b?LFI.pv(u):Math.round(u))*q;return (b?'R$ ':'Gs. ')+String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}catch(_){return ''}}
  function pkEnviar(doc,id){
    /* 13/11: corta os textos no limite das regras do Firestore (endereço longo não pode derrubar o pedido) */
    var LIM={nome:79,tel:29,email:199,doc:29,obsC:199,endE:299,refE:199,depE:79,cidade:79};Object.keys(LIM).forEach(function(k){if(typeof doc[k]==='string'&&doc[k].length>LIM[k])doc[k]=doc[k].slice(0,LIM[k])});
    var ct=window.AbortController?new AbortController():null,tm=setTimeout(function(){ct&&ct.abort()},8000);
    return acFetch(fnUrl('pedido'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,doc:doc}),signal:ct?ct.signal:undefined}).then(function(r){clearTimeout(tm);if(!r.ok)throw new Error('http '+r.status);return true},function(e){clearTimeout(tm);throw e})}
  /* B1 (11/11): se a rede falhar ou demorar, tenta de novo sozinho uma vez; guarda o motivo para mostrar o código discreto */
  function pkEnviar2(doc,id){return pkEnviar(doc,id).catch(function(e){var m=String(e&&e.message||e||''),http=/^http (\d+)/.exec(m);if(http&&+http[1]<500){throw e}
      return new Promise(function(r){setTimeout(r,1200)}).then(function(){return pkEnviar(doc,id)})})}
  function pkCodErro(er){var m=String(er&&(er.name==='AbortError'?'tempo':er.message)||er||'?'),h=/^http (\d+)/.exec(m);m=h?h[1]:(/fetch|network|Load failed/i.test(m)?'rede':m.slice(0,24));
    var d=new Date(),z=function(n){return ('0'+n).slice(-2)};return m+' · '+z(d.getDate())+'/'+z(d.getMonth()+1)+' '+z(d.getHours())+':'+z(d.getMinutes())}
  function pkTela(h){var o=$('pkok');if(!o){o=document.createElement('div');o.id='pkok';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');document.body.appendChild(o);document.documentElement.classList.add('lock')}o.innerHTML=h;return o}
  /* WhatsApp: só aceita celular no formato de Brasil, Paraguai ou Argentina */
  var FONE_EX={py:'0981 123 456',br:'(11) 91234-5678',ar:'9 11 1234-5678'},FONE_MSG={py:'Número do Paraguai inválido. Use o celular, ex.: 0981 123 456.',br:'Número do Brasil inválido. Use DDD + 9 + 8 dígitos, ex.: (11) 91234-5678.',ar:'Número da Argentina inválido. Use o celular com DDD, ex.: 9 11 1234-5678.'};

  /* todos os países: nacionalidade e WhatsApp com bandeira (lfx/flags) e as regras oficiais de telefone de cada país (lfx/fone.json, do Google/libphonenumber) */
  var DEMS='af:Afegão|Afgano;za:Sul-africano|Sudafricano;al:Albanês|Albanés;de:Alemão|Alemán;ad:Andorrano|Andorrano;ao:Angolano|Angoleño;ag:Antiguano|Antiguano;sa:Saudita|Saudí;dz:Argelino|Argelino;ar:Argentino|Argentino;am:Armênio|Armenio;au:Australiano|Australiano;at:Austríaco|Austríaco;az:Azerbaijano|Azerbaiyano;bs:Bahamense|Bahameño;bh:Bareinita|Bareiní;bd:Bengali|Bangladesí;bb:Barbadiano|Barbadense;be:Belga|Belga;bz:Belizenho|Beliceño;bj:Beninense|Beninés;by:Bielorrusso|Bielorruso;bo:Boliviano|Boliviano;ba:Bósnio|Bosnio;bw:Botsuanês|Botsuano;br:Brasileiro|Brasileño;bn:Bruneano|Bruneano;bg:Búlgaro|Búlgaro;bf:Burquinense|Burkinés;bi:Burundês|Burundés;bt:Butanês|Butanés;cv:Cabo-verdiano|Caboverdiano;kh:Cambojano|Camboyano;cm:Camaronês|Camerunés;ca:Canadense|Canadiense;qa:Catariano|Catarí;kz:Cazaque|Kazajo;td:Chadiano|Chadiano;cl:Chileno|Chileno;cn:Chinês|Chino;cy:Cipriota|Chipriota;co:Colombiano|Colombiano;km:Comorense|Comorense;cg:Congolês|Congoleño;cd:Congolês (RDC)|Congoleño (RDC);kp:Norte-coreano|Norcoreano;kr:Sul-coreano|Surcoreano;ci:Marfinense|Marfileño;cr:Costarriquenho|Costarricense;hr:Croata|Croata;cu:Cubano|Cubano;dk:Dinamarquês|Danés;dj:Djiboutiano|Yibutiano;dm:Dominiquense|Dominiqués;eg:Egípcio|Egipcio;sv:Salvadorenho|Salvadoreño;ae:Emiradense|Emiratí;ec:Equatoriano|Ecuatoriano;er:Eritreu|Eritreo;sk:Eslovaco|Eslovaco;si:Esloveno|Esloveno;es:Espanhol|Español;us:Estadunidense|Estadounidense;ee:Estoniano|Estonio;sz:Suazi|Suazi;et:Etíope|Etíope;fj:Fijiano|Fiyiano;ph:Filipino|Filipino;fi:Finlandês|Finlandés;fr:Francês|Francés;ga:Gabonês|Gabonés;gm:Gambiano|Gambiano;gh:Ganês|Ghanés;ge:Georgiano|Georgiano;gd:Granadino|Granadino;gr:Grego|Griego;gt:Guatemalteco|Guatemalteco;gy:Guianense|Guyanés;gn:Guineano|Guineano;gw:Guineense|Bisauguineano;gq:Equatoguineense|Ecuatoguineano;ht:Haitiano|Haitiano;nl:Holandês|Neerlandés;hn:Hondurenho|Hondureño;hk:Honconguês|Hongkonés;hu:Húngaro|Húngaro;ye:Iemenita|Yemení;in:Indiano|Indio;id:Indonésio|Indonesio;ir:Iraniano|Iraní;iq:Iraquiano|Iraquí;ie:Irlandês|Irlandés;is:Islandês|Islandés;il:Israelense|Israelí;it:Italiano|Italiano;jm:Jamaicano|Jamaicano;jp:Japonês|Japonés;jo:Jordaniano|Jordano;kw:Kuwaitiano|Kuwaití;la:Laosiano|Laosiano;ls:Lesotiano|Lesotense;lv:Letão|Letón;lb:Libanês|Libanés;lr:Liberiano|Liberiano;ly:Líbio|Libio;li:Liechtensteinense|Liechtensteiniano;lt:Lituano|Lituano;lu:Luxemburguês|Luxemburgués;mo:Macaense|Macaense;mk:Macedônio|Macedonio;mg:Malgaxe|Malgache;my:Malaio|Malasio;mw:Malawiano|Malauí;mv:Maldívio|Maldivo;ml:Malinês|Maliense;mt:Maltês|Maltés;ma:Marroquino|Marroquí;mh:Marshallino|Marshalés;mu:Mauriciano|Mauriciano;mr:Mauritano|Mauritano;mx:Mexicano|Mexicano;mm:Birmanês|Birmano;fm:Micronésio|Micronesio;mz:Moçambicano|Mozambiqueño;md:Moldávio|Moldavo;mc:Monegasco|Monegasco;mn:Mongol|Mongol;me:Montenegrino|Montenegrino;na:Namibiano|Namibio;nr:Nauruano|Nauruano;np:Nepalês|Nepalí;ni:Nicaraguense|Nicaragüense;ne:Nigerino|Nigerino;ng:Nigeriano|Nigeriano;no:Norueguês|Noruego;nz:Neozelandês|Neozelandés;om:Omanense|Omaní;pw:Palauense|Palauano;ps:Palestino|Palestino;pa:Panamenho|Panameño;pg:Papua|Papú;pk:Paquistanês|Pakistaní;py:Paraguaio|Paraguayo;pe:Peruano|Peruano;pl:Polonês|Polaco;pr:Porto-riquenho|Puertorriqueño;pt:Português|Portugués;ke:Queniano|Keniano;kg:Quirguiz|Kirguís;ki:Kiribatiano|Kiribatiano;gb:Britânico|Británico;cf:Centro-africano|Centroafricano;cz:Tcheco|Checo;do:Dominicano|Dominicano;ro:Romeno|Rumano;rw:Ruandês|Ruandés;ru:Russo|Ruso;ws:Samoano|Samoano;sm:Samarinês|Sanmarinense;lc:Santa-lucense|Santalucense;kn:São-cristovense|Sancristobaleño;st:São-tomense|Santotomense;vc:São-vicentino|Sanvicentino;sn:Senegalês|Senegalés;sl:Serra-leonês|Sierraleonés;rs:Sérvio|Serbio;sc:Seichelense|Seychellense;sg:Singapuriano|Singapurense;sy:Sírio|Sirio;so:Somali|Somalí;lk:Cingalês|Esrilanqués;sd:Sudanês|Sudanés;ss:Sul-sudanês|Sursudanés;se:Sueco|Sueco;ch:Suíço|Suizo;sr:Surinamês|Surinamés;th:Tailandês|Tailandés;tw:Taiwanês|Taiwanés;tj:Tadjique|Tayiko;tz:Tanzaniano|Tanzano;tl:Timorense|Timorense;tg:Togolês|Togolés;to:Tonganês|Tongano;tt:Trinitário|Trinitense;tn:Tunisiano|Tunecino;tm:Turcomeno|Turcomano;tr:Turco|Turco;tv:Tuvaluano|Tuvaluano;ua:Ucraniano|Ucraniano;ug:Ugandense|Ugandés;uy:Uruguaio|Uruguayo;uz:Uzbeque|Uzbeko;vu:Vanuatuense|Vanuatuense;va:Vaticano|Vaticano;ve:Venezuelano|Venezolano;vn:Vietnamita|Vietnamita;zm:Zambiano|Zambiano;zw:Zimbabuano|Zimbabuense;xk:Kosovar|Kosovar',DEM={};DEMS.split(';').forEach(function(x){var a=x.split(':'),b=a[1].split('|');DEM[a[0]]={pt:b[0],es:b[1]}});
  function lgS(){return (window.LFI&&LFI.lang==='es')?'es':'pt'}
  function nacNome(v){var d=DEM[v];return d?d[lgS()]:paisNome(v)}
  var DNR={};
  function paisNome(v){var lg=lgS(),U=String(v||'').toUpperCase();try{DNR[lg]=DNR[lg]||new Intl.DisplayNames([lg],{type:'region'});var n=DNR[lg].of(U);if(n&&n!==U)return n}catch(_){}return ({py:'Paraguai',br:'Brasil',ar:'Argentina'})[v]||U}
  function flagH(v){if(FLG[v])return FLG[v];var f=({ac:'sh',ta:'sh'})[v]||v;return '<img class="flg" src="lfx/flags/'+esc(f)+'.svg" alt="" loading="lazy" decoding="async">'}
  function cdN(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
  function nacInfo(v){var x=NAC[v]||{d:'Documento (passaporte ou identidade)',ph:'Número do documento'};return {f:x.f,n:x.n,d:LFI.tr(x.d),ph:x.ph}}
  var TOP3=['py','br','ar'];
  function nacItems(){var r=Object.keys(DEM).filter(function(k){return TOP3.indexOf(k)<0}).map(function(k){return {v:k,s:nacNome(k),l:nacNome(k),q:nacNome(k)+' '+paisNome(k)}}).sort(function(a,b){return a.s.localeCompare(b.s,lgS())});
    var t=TOP3.map(function(k){return {v:k,s:nacNome(k),l:nacNome(k),q:nacNome(k)+' '+paisNome(k)}});if(r[0])r[0].sep='Todas';return t.concat(r)}
  function telItems(){var C=FN?Object.keys(FN):TOP3,cc=function(k){return FN&&FN[k]?FN[k].c:({py:'595',br:'55',ar:'54'})[k]};
    var it=function(k){var n=paisNome(k);return {v:k,s:'+'+cc(k),l:n+' &nbsp;+'+cc(k),q:n+' '+cc(k)+' +'+cc(k)}};
    var t=TOP3.map(it);if(!FN)return t;t[0].sep='Mais usados';var r=C.filter(function(k){return TOP3.indexOf(k)<0}).map(it).sort(function(a,b){return a.q.localeCompare(b.q,lgS())});if(r[0])r[0].sep='Todos os países';return t.concat(r)}
  var FN=null,FNP=null,FNCC={};
  function fnLoad(){if(FN)return Promise.resolve(FN);if(FNP)return FNP;
    FNP=fetch('lfx/fone.json?v='+(window.LF_BUILD||'1')).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){FN=j;FNCC={};Object.keys(j).forEach(function(k){(FNCC[j[k].c]=FNCC[j[k].c]||[]).push(k)});return j}).catch(function(e){FNP=null;throw e});return FNP}
  function fnD(x){return String(x||'').replace(/\D/g,'')}
  function fnCC(d){for(var n=1;n<=3;n++){if(FNCC[d.slice(0,n)])return d.slice(0,n)}return ''}
  function fnIso(c,pref,resto){var l=FNCC[c]||[];if(l.indexOf(pref)>=0)return pref;
    var lead=l.filter(function(k){return FN[k].ld&&resto&&new RegExp('^(?:'+FN[k].ld+')').test(resto)})[0];if(lead)return lead;return l.filter(function(k){return FN[k].main})[0]||l[0]}
  function fnMax(iso){var M=FN[iso];return M&&M.l.length?Math.max.apply(0,M.l):15}
  /* número nacional sem o prefixo de discagem (0 no Paraguai/Brasil, 15 da Argentina…) */
  function fnNat(iso,d){var M=FN[iso];if(!M||!d)return d||'';var n=d;
    if(M.pp){var m=new RegExp('^(?:'+M.pp+')').exec(d);if(m&&m[0]){n=M.pt&&m[1]?M.pt.replace(/\$(\d)/g,function(x,i){return m[+i]||''})+d.slice(m[0].length):d.slice(m[0].length)}}
    else if(M.p&&d.indexOf(M.p)===0&&d.length>M.p.length)n=d.slice(M.p.length);
    else if(M.p&&d===M.p)n='';
    if(iso==='ar'&&/^[1-3]\d{9}$/.test(n))n='9'+n; /* WhatsApp da Argentina leva o 9 */
    return n}
  /* lê o que a pessoa digitou: +595…, 00595…, 595… (número longo demais para o país escolhido) */
  function fnParse(sel,txt){var raw=String(txt||'').trim(),d=fnD(raw),iso=sel;if(!FN)return {iso:sel,d:d,cc:false};
    if(/^(\+|00)/.test(raw)){if(/^00/.test(raw))d=d.slice(2);var c=fnCC(d);if(!c)return {iso:sel,d:d,cc:false,pend:true};iso=fnIso(c,sel,d.slice(c.length));return {iso:iso,d:d.slice(c.length),cc:true}}
    var M=FN[sel];if(M&&d.length>fnMax(sel)){if(d.indexOf(M.c)===0)return {iso:sel,d:d.slice(M.c.length),cc:true};var c2=fnCC(d);if(c2){return {iso:fnIso(c2,sel,d.slice(c2.length)),d:d.slice(c2.length),cc:true}}}
    return {iso:sel,d:d,cc:false}}
  /* formata enquanto digita (mesmo formato do WhatsApp daquele país) */
  function fnFmt(iso,n){var M=FN&&FN[iso];if(!M||!n)return n||'';var pads=[(M.e||'').slice(n.length),''],L=M.l.length?M.l:[n.length];
    for(var a=0;a<M.f.length;a++){var f=M.f[a],re=new RegExp('^(?:'+f[0]+')$'),ld=f[2]?new RegExp('^(?:'+f[2]+')'):null;
      for(var li=0;li<L.length;li++){if(L[li]<n.length)continue;for(var q=0;q<2;q++){var cand=(n+pads[q]+'0000000000000000').slice(0,L[li]);if(ld&&!ld.test(cand))continue;if(!re.test(cand))continue;
        var full=cand.replace(re,f[1]),out='',k=0;for(var i=0;i<full.length;i++){var ch=full[i];if(/\d/.test(ch)){if(k===n.length)break;k++}out+=ch}
        return out.replace(/[\s\-\(\)\/.]+$/,'')}}}
    return n}
  function fnValido(iso,n){var M=FN&&FN[iso];return !!(M&&n&&new RegExp('^(?:'+M.m+')$').test(n))}
  function fnEx(iso){if(!FN||!FN[iso])return FONE_EX[iso]||'';return fnFmt(iso,iso==='py'?'981123456':FN[iso].e)}
  function fnMsg(iso){return FN&&FN[iso]?'Número de WhatsApp inválido para '+paisNome(iso)+'. Ex.: '+fnEx(iso)+'.':(FONE_MSG[iso]||'Número de WhatsApp inválido.')}
  /* troca o país num seletor com bandeira */
  function cddSet(id,v){var i=$(id);if(!i||i.value===v)return;var d=i.closest('.cdd'),li=d.querySelector('li[data-v="'+v+'"]');
    d.querySelectorAll('li[data-v]').forEach(function(x){x.setAttribute('aria-selected',x===li?'true':'false')});
    d.querySelector('.cdb').innerHTML=flagH(v)+'<span class="cdt">'+(li?li.getAttribute('data-s'):'+'+(FN&&FN[v]?FN[v].c:''))+'</span>'+CHEV;i.value=v;i.dispatchEvent(new Event('change',{bubbles:true}))}
  /* campo do WhatsApp ao vivo: detecta o país pelo código e deixa no formato certo */
  function fnVivo(inp,selId,hintId){if(!FN)return;var sel=$(selId);if(!sel)return;var raw=inp.value,p=fnParse(sel.value,raw);
    if(p.pend)return; /* digitando +5… ainda sem código completo */
    if(p.iso!==sel.value)cddSet(selId,p.iso);
    var n=fnNat(p.iso,p.d),f=fnFmt(p.iso,n);
    if(f!==raw){var fim=document.activeElement===inp&&inp.selectionStart===raw.length;if(fnD(f)===fnD(raw)&&!fim)maskCampo(inp,function(){return f});else{inp.value=f;try{if(document.activeElement===inp)inp.setSelectionRange(f.length,f.length)}catch(_){}}}
    inp.placeholder=fnEx(p.iso);
    var h=$(hintId);if(h){var ok=fnValido(p.iso,n),t=!n?'':ok?'✓ Celular de '+paisNome(p.iso):n.length>=fnMax(p.iso)?'Confira o número':'';h.textContent=t;h.className='cfh'+(ok?' ok':'');h.hidden=!t}}
  function foneFake(d){return /(\d)\1{6,}/.test(d)}
  function foneNorm(pais,txt){
    if(FN&&FN[pais]){var p=fnParse(pais,txt),n=fnNat(p.iso,p.d);if(!n||foneFake(n)||!fnValido(p.iso,n))return '';return '+'+FN[p.iso].c+n}
    var d=String(txt||'').replace(/\D/g,'');if(!d||foneFake(d))return '';
    if(pais==='br'){if(d.length>11&&d.indexOf('55')===0)d=d.slice(2);d=d.replace(/^0+/,'');
      return /^[1-9][1-9]9\d{8}$/.test(d)?'+55'+d:''}
    if(pais==='py'){if(d.length>9&&d.indexOf('595')===0)d=d.slice(3);d=d.replace(/^0+/,'');
      return /^9[6-9]\d{7}$/.test(d)?'+595'+d:''}
    if(pais==='ar'){if(d.indexOf('54')===0&&d.length>10)d=d.slice(2);d=d.replace(/^0+/,'');
      if(/^9[1-3]\d{9}$/.test(d))return '+54'+d;if(/^[1-3]\d{9}$/.test(d))return '+549'+d;return ''}
    return ''}
  
  function message(modo,ref){
    var t=mensagem(modo,ref);
    layer('<div class="modal msg" role="dialog" aria-modal="true" aria-label="Mensagem para a loja"><div class="det"><button class="x" data-close aria-label="Fechar">×</button><h2 style="font-size:28px">Assim chega no WhatsApp da loja</h2>'+(modo==='avise'&&find(ref)&&find(ref).foto?'<img src="'+find(ref).foto+'" alt="'+esc(find(ref).nome)+'" style="display:block;width:100%;max-height:200px;object-fit:contain;background:#fff;border-radius:14px;margin:0 0 10px">':'')+'<div class="bubble">'+esc(t)+'</div><div class="note">'+(modo==='lojista'?'Você vê logo que é um lojista e responde com as condições de atacado.':modo==='avise'?'Você anota o contato e chama o cliente quando repuser.':'A loja responde confirmando as peças separadas e o horário para o cliente provar.')+' Este é um protótipo: nada é enviado daqui.</div><a class="btn w" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(t)+'">Abrir o WhatsApp</a></div></div>','center');
    $('layer').dataset.msg=t}

  /*CONTA*/
  /* cadastro do cliente, entrega ou retirada e pagamento (PIX / QR do Banco Familiar) */
  var NAC={py:{f:'🇵🇾',n:'Paraguaio',d:'Cédula ou RUC',ph:'1234567-8'},br:{f:'🇧🇷',n:'Brasileiro',d:'CPF',ph:'000.000.000-00'},ar:{f:'🇦🇷',n:'Argentino',d:'DNI',ph:'12.345.678'}};
  var PIXD={key:'ddfd40f9-a52b-4fdf-a570-f974e6667f91',nome:'JAMAL ALI YASSINE',cid:'FOZ DO IGUACU'};
  var TESTE=false;try{var _q=new URLSearchParams(location.search).get('teste');if(_q==='1')localStorage.setItem('lf_teste','1');else if(_q==='0')localStorage.removeItem('lf_teste');TESTE=localStorage.getItem('lf_teste')==='1'}catch(_){}
  function lsG(k,d){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(_){return d}}
  function lsS(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}
  function getConta(){return lsG('lf_conta',null)}
  function mil(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
  function brl(v){return 'R$ '+v.toFixed(2).replace('.',',')}
  function cpfOk(d){if(d.length!==11||/^(\d)\1+$/.test(d))return false;for(var t=9;t<11;t++){var s=0;for(var i=0;i<t;i++)s+=+d[i]*(t+1-i);var dv=(s*10)%11%10;if(dv!==+d[t])return false}return true}
  function docNorm(nac,txt,tp){if(nac==='py'&&tp){var dp=String(txt||'').replace(/\D/g,'');if(tp==='ruc')return rucNorm(txt);return /^\d{5,8}$/.test(dp)?dp:''}if(!NAC[nac]){var x=String(txt||'').toUpperCase().replace(/[^A-Z0-9]/g,'');return x.length>=4&&x.length<=20?x:''}var d=String(txt||'').replace(/[^\d-]/g,'');
    if(nac==='br'){d=d.replace(/\D/g,'');return cpfOk(d)?d.slice(0,3)+'.'+d.slice(3,6)+'.'+d.slice(6,9)+'-'+d.slice(9):''}
    if(nac==='ar'){d=d.replace(/\D/g,'');return /^\d{7,8}$/.test(d)?d:''}
    return /^\d{5,9}(-\d)?$/.test(d)?d:(/^\d{6,10}$/.test(d)?d.slice(0,-1)+'-'+d.slice(-1):'')}
  function nascNorm(t){var m=/^(\d{1,2})\D?(\d{1,2})\D?(\d{4})$/.exec(String(t||'').trim());if(!m)return '';var d=+m[1],mo=+m[2],y=+m[3],dt=new Date(y,mo-1,d);
    if(dt.getFullYear()!==y||dt.getMonth()!==mo-1||dt.getDate()!==d||y<1900||dt>new Date())return '';return ('0'+d).slice(-2)+'/'+('0'+mo).slice(-2)+'/'+y}
  var FLG={
    py:'<svg class="flg" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#d52b1e"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#0038a8"/><circle cx="15" cy="10" r="2.5" fill="none" stroke="#2f8f3f" stroke-width=".9"/></svg>',
    br:'<svg class="flg" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#009c3b"/><path d="M15 2 27.6 10 15 18 2.4 10z" fill="#ffdf00"/><circle cx="15" cy="10" r="4.5" fill="#002776"/><path d="M10.6 9c3.1-1 6.4-.5 8.9 1.3" fill="none" stroke="#fff" stroke-width=".9"/></svg>',
    ar:'<svg class="flg" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#74acdf"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><circle cx="15" cy="10" r="2" fill="#f6b40e"/></svg>'};
  var CHEV='<svg class="cdv" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /* seletor com bandeira (o <select> do navegador não mostra imagem); guarda o valor num campo escondido e dispara 'change' */
  function cdd(id,aria,val,items,ph){var cur=items.filter(function(x){return x.v===val})[0]||items[0];
    return '<div class="cdd'+(items.length>8?' cdg':'')+'"><input type="hidden" id="'+id+'" value="'+cur.v+'"><button type="button" class="field cdb" data-cdb aria-haspopup="listbox" aria-expanded="false" aria-label="'+aria+'">'+flagH(cur.v)+'<span class="cdt">'+cur.s+'</span>'+CHEV+'</button><ul class="cdl" role="listbox" hidden>'+cddLis(items,cur.v,ph)+'</ul></div>'}
  function cddLis(items,val,ph){return (items.length>8?'<li class="cdq" role="presentation"><input class="field" type="search" autocomplete="off" enterkeyhint="search" placeholder="'+esc(ph||'Buscar')+'" aria-label="'+esc(ph||'Buscar')+'"></li>':'')+
      items.map(function(i){return (i.sep?'<li class="cds" role="presentation">'+i.sep+'</li>':'')+'<li role="option" data-v="'+i.v+'" data-s="'+esc(i.s)+'" data-q="'+esc(cdN(i.q||i.l))+'" aria-selected="'+(i.v===val)+'">'+flagH(i.v)+'<span>'+i.l+'</span></li>'}).join('')}
  /* lista de WhatsApp completa assim que as regras de todos os países chegam */
  function cddTel(id){var i=$(id);if(!i)return;var d=i.closest('.cdd'),ul=d.querySelector('.cdl'),it=telItems();d.classList.toggle('cdg',it.length>8);ul.innerHTML=cddLis(it,i.value,'Buscar país ou código')}
  function digs(x){return String(x||'').replace(/\D/g,'')}
  function maskDoc(nac,txt,tp){if(!NAC[nac])return String(txt||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,20);var d=digs(txt);
    /* S400 (esboço 59d): paraguaio escolhe Cédula ou RUC; a cédula não leva traço (antes 4567890 virava 456789-0) */if(nac==='py'&&tp==='ced'){d=d.slice(0,8);return d.replace(/(\d)(?=(\d{3})+$)/g,'$1.')}
    if(nac==='br'){d=d.slice(0,11);return d.replace(/^(\d{3})(\d)/,'$1.$2').replace(/^(\d{3}\.\d{3})(\d)/,'$1.$2').replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/,'$1-$2')}
    if(nac==='ar'){d=d.slice(0,8);return d.replace(/(\d)(?=(\d{3})+$)/g,'$1.')}
    d=d.slice(0,9);return d.length>=6?d.slice(0,-1)+'-'+d.slice(-1):d}
  function maskNasc(txt){var d=digs(txt).slice(0,8);return d.replace(/^(\d{2})(\d)/,'$1/$2').replace(/^(\d{2}\/\d{2})(\d)/,'$1/$2')}
  function maskCampo(el,fn){var v=el.value,pos=el.selectionStart==null?v.length:el.selectionStart,antes=digs(v.slice(0,pos)).length,n=fn(v);
    if(n===v)return;el.value=n;var i=0,c=0;if(antes>0){for(;i<n.length;i++){if(/\d/.test(n[i]))c++;if(c===antes){i++;break}}}
    try{if(document.activeElement===el)el.setSelectionRange(i,i)}catch(_){}}
  /* confere se a cidade existe (OpenStreetMap, uma consulta só ao sair do campo; se estiver sem internet, deixa passar) */
  var CIDC={};
  function cidBusca(txt,mundo){var k=txt.toLowerCase();if(CIDC[k])return Promise.resolve(CIDC[k]);
    var ctl=window.AbortController?new AbortController():null,tm=setTimeout(function(){if(ctl)ctl.abort()},7000);
    return fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&featuretype=settlement&accept-language=pt'+(mundo?'':'&countrycodes=py,br,ar,uy,bo,cl')+'&q='+encodeURIComponent(txt),{signal:ctl?ctl.signal:undefined})
      .then(function(r){clearTimeout(tm);if(!r.ok)throw 0;return r.json()}).then(function(a){
        var o=(a||[]).filter(function(x){return x.category==='place'||(x.addresstype&&/city|town|village|municipality|suburb|hamlet/.test(x.addresstype))})[0];
        var res;if(!o)res={ok:false};else{var ad=o.address||{},nm=o.name||ad.city||ad.town||ad.village||ad.municipality||txt,reg=ad.state||ad.region||ad.country||'';res={ok:true,nome:reg&&reg!==nm?nm+', '+reg:nm,cc:String(ad.country_code||'').toLowerCase()}}
        if(!o&&!mundo)return cidBusca(txt,true);CIDC[k]=res;return res},function(){clearTimeout(tm);return {off:true}})}
  /* delivery só no Paraguai: decide pela cidade onde a pessoa mora (nacionalidade não importa) */
  function entPY(c){c=c||{};if(c.cpais)return c.cpais==='py';return c.nac==='py'}
  var PREP={br:'no Brasil',ar:'na Argentina',uy:'no Uruguai',bo:'na Bolívia',cl:'no Chile',pe:'no Peru',us:'nos Estados Unidos',es:'na Espanha',pt:'em Portugal',it:'na Itália',fr:'na França',de:'na Alemanha',co:'na Colômbia',ve:'na Venezuela',mx:'no México',ca:'no Canadá',jp:'no Japão',cn:'na China',lb:'no Líbano',gb:'no Reino Unido'};
  function semDelivery(cc){var lg=lgS();if(!cc||cc==='py')return lg==='es'?'El delivery es solo en Paraguay.':'O delivery é só no Paraguai.';return lg==='es'?'No hacemos delivery en '+paisNome(cc)+'. El delivery es solo en Paraguay.':'Não fazemos delivery '+(PREP[cc]||'em '+paisNome(cc))+'. O delivery é só no Paraguai.'}
  function cfpyUpd(){var b=$('cfpy'),e=$('cfc'),n=$('cfa2');if(!b||!e||!n)return;var cc=e.getAttribute('data-ok')&&e.getAttribute('data-ok')===e.value.trim().replace(/\s+/g,' ')?e.getAttribute('data-cpais')||'':'';b.hidden=!entPY({cpais:cc,nac:n.value})}
  function cidMsg(t,c){var e=$('cfch');if(!e)return;e.textContent=t||'';e.className='cfh'+(c?' '+c:'');e.hidden=!t}
  function cidConf(){var el=$('cfc');if(!el)return Promise.resolve({off:true});var v=el.value.trim().replace(/\s+/g,' ');
    if(v.length<2)return Promise.resolve({ok:false,vazio:true});
    if(el.getAttribute('data-ok')===v)return Promise.resolve({ok:true,nome:v,cc:el.getAttribute('data-cpais')||''});
    cidMsg('Conferindo a cidade…');
    return cidBusca(v).then(function(r){var e2=$('cfc');if(!e2||e2.value.trim().replace(/\s+/g,' ')!==v)return r;
      if(r.ok){e2.value=r.nome;e2.setAttribute('data-ok',r.nome);e2.setAttribute('data-cpais',r.cc||'');e2.classList.remove('bad');cidMsg('✓ Cidade confirmada','ok');
        if(r.cc&&r.cc!=='py'){var ch=$('cfch');if(ch){var w=document.createElement('div');w.className='cfw';w.textContent=semDelivery(r.cc)+' '+(lgS()==='es'?'Para esta ciudad, el pedido es con retiro en la tienda.':'Para esta cidade, o pedido é com retirada na loja.');ch.appendChild(w)}}cfpyUpd()}
      else if(r.off){cidMsg('')}
      else{e2.setAttribute('data-ok','');cidMsg('Não encontramos essa cidade. Confira o nome (ex.: Ciudad del Este, Foz do Iguaçu).','er')}
      return r})}
  var CTA_ERR='';
  function cfErro(m,id){var e=$('cferr');if(e){e.textContent=m;e.hidden=!m}if(id){var f=$(id);if(f){f.classList.add('bad');try{f.focus()}catch(_){}}}if(m)toast(m)}
  function contaSalvar(volta){
    var g=function(i){var e=$(i);return e?e.value.trim():''};
    document.querySelectorAll('#layer .field.bad').forEach(function(e){e.classList.remove('bad')});
    var nome=g('cfn').replace(/\s+/g,' ');if(nome.length<3||nome.indexOf(' ')<0)return cfErro('Digite seu nome e sobrenome.','cfn');
    var nac=$('cfa2').value,cftp=docTipo('cf',getConta()||{}),doc=docNorm(nac,g('cfd'),cftp);if(!doc)return cfErro(nacInfo(nac).d+(NAC[nac]?' inválido. Confira os números.':': digite o número (letras e números, mínimo 4).'),'cfd');
    var nasc=nascNorm(g('cfb'));if(!nasc)return cfErro('Data de nascimento inválida. Use dd/mm/aaaa.','cfb');
    var pais=$('cfp').value,tel=foneNorm(pais,g('cfz'));if(!tel)return cfErro(fnMsg(pais),'cfz');
    var se=sessG();if(!se)return entrarTela(volta);var email=se.email;
    var cid=g('cfc');if(cid.length<2)return cfErro('Digite a sua cidade.','cfc');
    var bt=document.querySelector('#layer [data-cta=salvar]');if(bt&&bt.disabled)return;
    if(bt){bt.disabled=true;bt.setAttribute('data-t',bt.textContent);bt.textContent='Conferindo…'}
    cidConf().then(function(r){if(bt){bt.disabled=false;bt.textContent=bt.getAttribute('data-t')||'Salvar conta'}
      if(r&&r.ok===false)return cfErro('Não encontramos essa cidade. Confira o nome.','cfc');
      fim(r&&r.ok?r.nome:cid,r&&r.ok?(r.cc||''):'')});
    function fim(cid,cc){var old=getConta()||{};if(!cc&&old.cidade===cid)cc=old.cpais||'';var pyv=entPY({cpais:cc,nac:nac});
    var nc={nome:nome,nac:nac,doc:doc,docT:nac==='py'?cftp:'',nasc:nasc,pais:pais,tel:tel,telTxt:g('cfz'),email:email,cidade:cid,cpais:cc,end:pyv?g('cfa'):'',obs:pyv?g('cfob'):'',user:se.user||old.user||'',ts:old.ts||Date.now()};
    lsS('lf_conta',nc);fsA('PATCH','clientes/'+se.uid,nc).catch(function(){toast('Conta salva só neste aparelho. Sem internet agora.')});
    if(!pyv)st.ent='loja';
    contaBtn();if(!old.nome)return contaCriada(volta,nome);toast('Conta salva.');if(volta)bag();else closeLayer()}}
  function contaCriada(volta,nome){
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Conta criada"><div class="ccok"><div class="cck"><svg viewBox="0 0 24 24" fill="none" stroke="#14803f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path pathLength="1" d="M6.5 12.5l4 4 7-8.5"/></svg>'+[0,1,2,3,4,5,6,7,8,9,10,11].map(function(i){return '<i class="sp" style="--a:'+(i*30)+'deg"></i>'}).join('')+'</div><h2 style="font-size:28px">Conta criada!</h2><div class="note" style="margin:0"><span>Bem-vindo(a),</span> '+esc(String(nome).split(' ')[0])+'. <span>Agora você já pode fazer seus pedidos.</span></div><button class="btn w" data-cta="cont" data-volta="'+(volta?1:0)+'" style="margin-top:18px">Continuar</button></div></aside>')}
  function contaBtn(){var b=$('contabtn');if(!b)return;var c=getConta();b.classList.toggle('on',!!c);b.setAttribute('title',c?c.nome:'Minha conta');var lt=b.querySelector('.lgt');if(lt)lt.textContent=c&&c.nome?String(c.nome).trim().split(/\s+/)[0].slice(0,12):'log in'}
  /* login: Firebase Authentication (e-mail + senha); o "usuário" é um apelido ligado ao e-mail */
  function remOn(){try{return localStorage.getItem('lf_norem')!=='1'}catch(_){return true}}
  function lastU(){try{return remOn()?(localStorage.getItem('lf_lastu')||''):''}catch(_){return ''}}
  try{if(localStorage.getItem('lf_norem')==='1'&&!sessionStorage.getItem('lf_tab'))localStorage.removeItem('lf_auth');sessionStorage.setItem('lf_tab','1')}catch(_){}
  function sessG(){return lsG('lf_auth',null)}
  function logado(){return !!(sessG()&&getConta())}
  /* App Check (reCAPTCHA v3 invisível): anexa o selo do site às chamadas ao Firebase. Sem o ID do app (AC.app) não faz nada. */
  var AC={site:'6LdfswsuAAAAAEhnRr1YDllR505K3LagtIYIDpdb',app:'1:462328668572:web:c34eb81c6044ca07e62859',t:null,x:0,p:null,f:0};
  /* o selo fica guardado no aparelho até vencer: não pede ao reCAPTCHA a cada página */
  (function(g){if(g&&g.t&&Date.now()<+g.x){AC.t=g.t;AC.x=+g.x}})(lsG('lf_ac',null));
  function acLoad(){return new Promise(function(ok,no){if(window.grecaptcha&&grecaptcha.enterprise&&grecaptcha.enterprise.execute)return ok();var s=document.createElement('script');s.src='https://www.google.com/recaptcha/enterprise.js?render='+AC.site;s.async=true;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
  function acTok(){if(!AC.app)return Promise.resolve(null);if(AC.t&&Date.now()<AC.x)return Promise.resolve(AC.t);if(AC.p)return AC.p;if(Date.now()<AC.f)return Promise.resolve(null);
    AC.p=acLoad().then(function(){return new Promise(function(ok){grecaptcha.enterprise.ready(ok)})}).then(function(){return grecaptcha.enterprise.execute(AC.site,{action:'lf'})}).then(function(tk){return fetch('https://firebaseappcheck.googleapis.com/v1/projects/'+FB.p+'/apps/'+AC.app+':exchangeRecaptchaEnterpriseToken?key='+FB.k,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recaptcha_enterprise_token:tk})})}).then(function(r){if(!r.ok)return r.text().then(function(t){try{console.warn('AppCheck',r.status,t.slice(0,300))}catch(_){}throw 0});return r.json()}).then(function(j){AC.t=j.token;AC.x=Date.now()+Math.max(300,parseInt(j.ttl)||3600)*1000-120000;AC.p=null;lsS('lf_ac',{t:AC.t,x:AC.x});return AC.t}).catch(function(e){if(e)try{console.warn('AppCheck',e)}catch(_){}AC.p=null;AC.f=Date.now()+60000;return null});
    return AC.p}
  /* TODA chamada à nuvem (funções e Firestore) passa por aqui e leva o selo; com o selo em mãos a chamada sai na hora (vale para o envio ao fechar a página).
     21/11 (medido em 4G fraco, rede limpa: 1º cartão em 20 s, 8 s deles esperando o selo): a LEITURA PÚBLICA do catálogo (fbg: peças, fotos, estoque,
     config) é aberta a qualquer um pelas regras — sai na hora, com o selo se ele já existir (`publica`). Quem precisa do selo (funções, gravações) espera por ele. */
  function acFetch(url,o,publica){o=o||{};var vai=function(t){if(t)o.headers=Object.assign({},o.headers,{'X-Firebase-AppCheck':t});return fetch(url,o)};if(AC.t&&Date.now()<AC.x)return vai(AC.t);if(publica)return vai(null);
    return Promise.race([acTok(),new Promise(function(r){setTimeout(function(){r(null)},4000)})]).then(vai)}
  function fsBase(){return 'https://firestore.googleapis.com/v1/projects/'+FB.p+'/databases/(default)/documents/'}
  function authPost(ep,body){return acFetch('https://identitytoolkit.googleapis.com/v1/accounts:'+ep+'?key='+FB.k,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(String((j.error&&j.error.message)||'ERRO').split(' ')[0]);return j})})}
  var AUTH_MSG={EMAIL_EXISTS:'Este e-mail já tem conta. Use Iniciar sessão.',INVALID_LOGIN_CREDENTIALS:'Usuário/e-mail ou senha incorretos.',INVALID_PASSWORD:'Usuário/e-mail ou senha incorretos.',EMAIL_NOT_FOUND:'Não encontramos esse e-mail.',WEAK_PASSWORD:'Senha fraca. Use 6 ou mais caracteres.',INVALID_EMAIL:'E-mail inválido.',TOO_MANY_ATTEMPTS_TRY_LATER:'Muitas tentativas. Espere um pouco e tente de novo.',FEDERATED_USER_ID_ALREADY_USED:'Esse Google já está ligado a outra conta.',CREDENTIAL_ALREADY_IN_USE:'Esse Google já está ligado a outra conta.',OPERATION_NOT_ALLOWED:'O login ainda não está ativo na loja. Fale com a loja pelo WhatsApp.'};
  function authErr(e,id){cfErro(AUTH_MSG[String(e&&e.message||'')]||'Não deu para conectar. Confira a internet e tente de novo.',id);authBusy(false)}
  function authBusy(on){var b=document.querySelector('#layer [data-busy]');if(!b)return;if(on){b.setAttribute('data-t',b.textContent);b.textContent='Aguarde…';b.disabled=true}else{b.textContent=b.getAttribute('data-t')||b.textContent;b.disabled=false}}
  function sessSave(j,user,x){var o={uid:j.localId,email:j.email,idToken:j.idToken,refresh:j.refreshToken,exp:Date.now()+(+j.expiresIn||3600)*1000-60000,user:user||''};if(x)for(var k in x)o[k]=x[k];lsS('lf_auth',o);return o}
  function idTok(){var s=sessG();if(!s)return Promise.reject(new Error('SEM_SESSAO'));if(Date.now()<s.exp)return Promise.resolve(s.idToken);
    return fetch('https://securetoken.googleapis.com/v1/token?key='+FB.k,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=refresh_token&refresh_token='+encodeURIComponent(s.refresh)}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error('SESSAO');s.idToken=j.id_token;s.refresh=j.refresh_token||s.refresh;s.exp=Date.now()+(+j.expires_in||3600)*1000-60000;lsS('lf_auth',s);return s.idToken})})}
  function fsA(method,path,fields){return idTok().then(function(t){var f={};for(var k in fields)f[k]=fsv(fields[k]);return acFetch(fsBase()+path,{method:method,headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:fields?JSON.stringify({fields:f}):undefined}).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json()})})}
  /* nome de usuário antigo + senha: a função da nuvem acha a conta e faz o login por dentro (o site não lê a lista de usuários) */
  function contaEntrar(user,senha){return acFetch(fnUrl('conta'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({acao:'entrar',user:user,senha:senha})}).then(function(r){return r.json()}).then(function(j){if(!j||!j.ok)throw new Error(j&&j.motivo==='espera'?'TOO_MANY_ATTEMPTS_TRY_LATER':j&&j.motivo==='login'?'INVALID_LOGIN_CREDENTIALS':'ERRO');return j})}
  var AUTH_VOLTA=false;
  function pwField(id,lb){return '<label class="cfl" for="'+id+'">'+lb+'</label><div class="pwr"><input class="field" id="'+id+'" type="password" autocomplete="'+(id==='aup'?'current-password':'new-password')+'"><button type="button" class="pwo" tabindex="-1" data-cta="olho" aria-label="Mostrar senha" aria-pressed="false"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle class="pp" cx="12" cy="12" r="3"/><path class="sl" d="M4 4l16 16"/></svg></button></div>'}
  function authHead(t){return '<div style="display:flex;align-items:center;justify-content:space-between"><h2 style="font-size:28px">'+t+'</h2><button class="x" data-close aria-label="Fechar" style="align-self:auto">×</button></div>'}
  function entrarTela(volta){AUTH_VOLTA=!!volta;gPre();
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Iniciar sessão">'+authHead('Iniciar sessão')+
      '<label class="cfl" for="aul">Usuário ou e-mail</label><input class="field" id="aul" autocomplete="username" autocapitalize="none" spellcheck="false" value="'+esc(lastU())+'">'+pwField('aup','Senha')+
      '<div class="fze" id="cferr" role="alert" hidden></div>'+
      '<div class="remrow"><label class="rem"><input type="checkbox" id="aur"'+(remOn()?' checked':'')+'><i></i><span>Lembrar de mim</span></label><button type="button" class="cfx" data-cta="esqueci">Esqueci minha senha</button></div>'+
      '<button class="btn w" data-cta="login" data-busy>Iniciar sessão</button>'+gBtn('Continuar com Google')+
      '<button type="button" class="cfx" data-cta="cadastrar" style="text-align:center;width:100%">Ainda não tenho conta · <u>Criar conta</u></button></aside>')}
  function esqueciTela(){
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Recuperar senha">'+authHead('Recuperar senha')+
      '<div class="note" style="margin:0">Digite seu e-mail. Enviamos um link para criar uma nova senha.</div>'+
      '<label class="cfl" for="aul">E-mail</label><input class="field" id="aul" type="email" autocomplete="email" autocapitalize="none" spellcheck="false">'+
      '<div class="fze" id="cferr" role="alert" hidden></div><div class="note" id="aures" style="display:none;color:#7fe0a8"></div>'+
      '<button class="btn w" data-cta="reset" data-busy>Enviar link</button>'+
      '<button type="button" class="cfx" data-cta="entrar" style="text-align:center;width:100%">Voltar</button></aside>')}
  function authReset(){
    var id=($('aul')||{value:''}).value.trim().toLowerCase();if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(id))return cfErro('Digite o e-mail da sua conta.','aul');cfErro('');authBusy(true);
    authPost('sendOobCode',{requestType:'PASSWORD_RESET',email:id}).then(function(){return id})
      .then(function(em){authBusy(false);var n=$('aures');if(n){var a=em.split('@');n.textContent='✓ Link enviado para '+a[0].charAt(0)+'***@'+a[1]+'. Confira também o spam.';n.style.display='block'}},function(e){authErr(e,'aul')})}
  function authSair(){try{localStorage.removeItem('lf_auth');localStorage.removeItem('lf_conta');localStorage.removeItem('lf_ped')}catch(_){}contaBtn()}
  /* Google: SDK do Firebase só para abrir a janela; a sessão segue pelo mesmo caminho (REST) */
  var G_BADGE='<span class="gbd" aria-hidden="true"><svg viewBox="0 0 48 48" width="100%" height="100%"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg></span>';
  function gBtn(t){return '<div class="ou"><span>ou</span></div><button type="button" class="gbtn" data-cta="google">'+G_BADGE+t+'</button>'}
  var GFB=0;
  function gPre(){if((window.firebase&&firebase.auth)||GFB)return;GFB=1;
    var add=function(u,fn){var e=document.createElement('script');e.src=u;e.onload=fn;e.onerror=function(){GFB=0};document.head.appendChild(e)};
    add('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',function(){add('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',function(){GFB=2})})}
  function gAuth(){if(!(window.firebase&&firebase.auth))return null;if(!firebase.apps.length)firebase.initializeApp({apiKey:FB.k,authDomain:FB.p+'.firebaseapp.com',projectId:FB.p});return firebase.auth()}
  function gPopup(){var a=gAuth();if(!a){gPre();return Promise.reject({code:'wait'})}
    var pr=new firebase.auth.GoogleAuthProvider();pr.setCustomParameters({prompt:'select_account'});
    /*GPOP-CENTRO*/var wo=window.open,done=0,rest=function(){if(!done){done=1;window.open=wo}};
    window.open=function(u,n,f){try{if(typeof f==='string'&&/width=/.test(f)){var w=+(/width=(\d+)/.exec(f)||[])[1]||500,h=+(/height=(\d+)/.exec(f)||[])[1]||600,
      L=Math.round((window.screenX||window.screenLeft||0)+((window.outerWidth||screen.availWidth)-w)/2),T=Math.round((window.screenY||window.screenTop||0)+((window.outerHeight||screen.availHeight)-h)/2);
      f=f.replace(/(^|,)\s*(left|top)=[^,]*/g,'')+',left='+L+',top='+Math.max(T,0);rest()}}catch(e){rest()}return wo.call(window,u,n,f)};
    setTimeout(rest,8000);
    return a.signInWithPopup(pr).then(function(r){rest();return r},function(e){rest();throw e})}
  function gErr(e){var c=String(e&&e.code||''),m=String(e&&e.message||'');
    if(c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request')return;
    var t=c==='wait'?'Aguarde um instante e toque de novo.':c==='auth/popup-blocked'?'O navegador bloqueou a janela do Google. Permita pop-ups e tente de novo.':c==='auth/unauthorized-domain'?'Este endereço ainda não está liberado para entrar com Google.':c==='auth/operation-not-allowed'?AUTH_MSG.OPERATION_NOT_ALLOWED:AUTH_MSG[m]||'Não deu para conectar com o Google. Tente de novo.'+(c?' ('+c+')':'');try{console.warn('GoogleAuth',c,m)}catch(_){}
    if($('cferr'))cfErro(t);else toast(t)}
  function gSync(){var s=sessG();
    gPopup().then(function(r){var u=r.user,cr=r.credential;
      if(u.uid===s.uid)return;
      return u.delete().catch(function(){}).then(function(){return idTok()}).then(function(t){return authPost('signInWithIdp',{idToken:t,postBody:'id_token='+encodeURIComponent(cr.idToken)+'&providerId=google.com',requestUri:location.origin,returnIdpCredential:true,returnSecureToken:true})})})
      .then(function(){toast('Conta sincronizada com o Google.');minhaConta()},gErr)}
  function dlgAbre(h){dlgFecha();var d=document.createElement('div');d.className='dlgb';d.id='dlgb';d.innerHTML='<div class="dlg" role="dialog" aria-modal="true">'+h+'</div>';d.addEventListener('click',function(ev){if(ev.target===d||ev.target.closest('[data-dlgx]'))dlgFecha()});document.body.appendChild(d);var i=d.querySelector('input');if(i)setTimeout(function(){try{i.focus({preventScroll:true})}catch(_){}},60);return d}
  document.addEventListener('click',function(e){var o=$('pkok');if(o&&e.target.closest&&e.target.closest('.top')){/* S313: nas telas de pagamento o topo só tem o logo e não é saída; as saídas são as da própria tela (Pagar depois, Voltar ao catálogo) */if(o.classList.contains('py')){e.preventDefault();return}pkStop();o.remove();document.documentElement.classList.remove('lock')}},true);
  /* cancelar um pedido na loja: UM caminho (função 'pedido' + devolve a reserva). Usado ao cancelar um pedido e ao excluir a conta
     (antes a exclusão escrevia direto em pedidos/, que as regras fecharam em 20/11 — os pedidos pendentes ficavam sem cancelar). */
  function pedCancela(id,e){return pkEnviar({tipo:'cancel',ref:id,ts:Date.now(),cod:e.cod||''},id+'x').catch(function(er){/* 409 = a loja já tinha este pedido como cancelado: o objetivo está cumprido (recado da NUVEM 20/11) */if(/^http 409/.test(String(er&&er.message||'')))return true;throw er}).then(function(){if(CFG.reserva===true)resCall('cancelar',id,null,(e.itens||[]).map(function(i){return i.ref}))})}
  function pkCancela(){
    var id=window.__pgid,e=id&&pedGet(id),b=document.querySelector('#dlgb .dk');if(!e||(e.est!=='pagar'&&e.est!=='recusado')){dlgFecha();return}
    if(b)b.disabled=true;
    pedCancela(id,e).then(function(){pkCancelado(id)},function(){var d=$('dlgb');if(!d)return;var m=LFI.lang==='es'?'¡Hola! Quiero cancelar mi pedido '+e.cod+'.':'Olá! Quero cancelar o meu pedido '+e.cod+'.';
      d.querySelector('.dlg').innerHTML='<h3>Cancelar este pedido?</h3><p>Não deu para avisar a loja automaticamente. Cancele pelo WhatsApp: a loja recebe o aviso e libera as peças.</p><div class="dlga"><button type="button" class="dc" data-dlgx>Voltar</button><a class="dk dr" target="_blank" rel="noopener" data-cta="pkcanc3" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(m)+'">Cancelar pelo WhatsApp</a></div>'})}
  function pkCancelado(id){pedSet(id,{est:'cancelado'});pkStop();dlgFecha();var po=$('pkok');if(po)po.remove();document.documentElement.classList.remove('lock');closeLayer();toast('Pedido cancelado.');/* S318: volta para a lista de pedidos depois que a janela termina de fechar */if(window.__pgc||logado())setTimeout(function(){minhaConta('peds')},420);window.__pgc=false}
  function dlgFecha(){var d=$('dlgb');if(d)d.remove()}
  function dlgErr(m){var e=$('dlgerr');if(e){e.textContent=m;e.hidden=false}else toast(m)}
  function acErr(e){var m=String(e&&e.message||'');return /CREDENTIAL_TOO_OLD|TOKEN_EXPIRED|SEM_SESSAO|INVALID_ID_TOKEN/.test(m)?'Por segurança, saia da conta, entre de novo e tente outra vez.':(AUTH_MSG[m]||'Não deu certo agora. Tente de novo.')}
  function gUnlink(pw){
    if(pw){dlgAbre('<h3>Desvincular o Google?</h3><p>Você continuará entrando com seu e-mail e senha.</p><p class="dlgerr" id="dlgerr" hidden></p><div class="dlga"><button type="button" class="dc" data-dlgx>Cancelar</button><button type="button" class="dk" data-cta="gunlink2">Desvincular</button></div>');return}
    dlgAbre('<h3>Crie uma senha primeiro</h3><p>Sua conta entra só pelo Google. Para desvincular, crie uma senha para entrar com seu e-mail.</p><input type="password" id="dlgpw" autocomplete="new-password" minlength="6" placeholder="'+(LFI.lang==='es'?'Nueva contraseña (mín. 6)':'Nova senha (mín. 6)')+'"><p class="dlgerr" id="dlgerr" hidden></p><div class="dlga"><button type="button" class="dc" data-dlgx>Cancelar</button><button type="button" class="dk" data-cta="gunlink2" data-nopw="1">Criar senha e desvincular</button></div>')}
  function gUnlink2(nopw){
    var b=document.querySelector('#dlgb .dk');if(b)b.disabled=true;
    var pwd=nopw?(($('dlgpw')||{}).value||''):'';
    if(nopw&&pwd.length<6){if(b)b.disabled=false;dlgErr(AUTH_MSG.WEAK_PASSWORD);return}
    var s0=sessG()||{};
    idTok().then(function(t){
      if(!nopw)return t;
      return authPost('update',{idToken:t,password:pwd,returnSecureToken:true}).then(function(j){var s=sessSave({localId:s0.uid,email:j.email||s0.email,idToken:j.idToken,refreshToken:j.refreshToken,expiresIn:j.expiresIn},s0.user,{via:'senha',gn:s0.gn||''});return s.idToken})
    }).then(function(t){return authPost('update',{idToken:t,deleteProvider:['google.com'],returnSecureToken:false})})
    .then(function(){dlgFecha();toast('Google desvinculado.');minhaConta()},function(e){if(b)b.disabled=false;dlgErr(acErr(e))})}
  function excAbre(){
    dlgAbre('<h3>Excluir sua conta?</h3><ul class="dlgl"><li>Seu cadastro e seu acesso serão apagados.</li><li>Pedidos já pagos continuam registrados na loja.</li><li>Pedidos aguardando pagamento serão cancelados.</li></ul><input type="text" id="dlgex" autocomplete="off" autocapitalize="characters" placeholder="'+(LFI.lang==='es'?'Escribe EXCLUIR para confirmar':'Digite EXCLUIR para confirmar')+'"><p class="dlgerr" id="dlgerr" hidden></p><div class="dlga"><button type="button" class="dc" data-dlgx>Cancelar</button><button type="button" class="dk dr" id="dlgdel" data-cta="exc2" disabled>Excluir conta</button></div>')}
  function excOk(){var v=String(($('dlgex')||{}).value||'').trim().toUpperCase();return v==='EXCLUIR'||v==='ELIMINAR'}
  document.addEventListener('input',function(e){if(e.target&&e.target.id==='dlgex'){var b=$('dlgdel');if(b)b.disabled=!excOk()}});
  function excFaz(){
    if(!excOk())return;var b=$('dlgdel');if(b)b.disabled=true;
    var s=sessG();if(!s)return;var pend=lsG('lf_ped',[]).filter(function(e){return e.est==='pagar'||e.est==='recusado'});
    idTok().then(function(t){return authPost('delete',{idToken:t})}).then(function(){
      var tarefas=pend.map(function(e){return pedCancela(e.id,e).catch(function(){})});
      tarefas.push(fsA('DELETE','clientes/'+s.uid).catch(function(){}));
      return Promise.all(tarefas)}).then(function(){dlgFecha();authSair();closeLayer();toast('Conta excluída.')},function(e){if(b)b.disabled=!excOk();dlgErr(acErr(e))})}
  function gCard(){var el=$('gcard');if(!el)return;
    idTok().then(function(t){return authPost('lookup',{idToken:t})}).then(function(j){var u=(j.users||[])[0]||{},pv=u.providerUserInfo||[],g=pv.filter(function(x){return x.providerId==='google.com'})[0],pw=pv.some(function(x){return x.providerId==='password'});
      var el2=$('gcard');if(!el2)return;
      el2.classList.toggle('gnv',!!g);el2.innerHTML=g?G_BADGE+'<b>'+LFI.tr('Conta do Google')+'</b><small class="gok">✓ '+esc(g.email||u.email||'')+'</small><button type="button" class="gunv" data-cta="gunlink" data-pw="'+(pw?1:0)+'">'+LFI.tr('Desvincular Google')+'</button>'
        :'<div class="gl">'+G_BADGE+'<span><b>'+LFI.tr('Conta do Google')+'</b><small>'+LFI.tr('Não sincronizada')+'</small></span></div><button type="button" class="gsb" data-cta="gsync">'+LFI.tr('Sincronizar')+'</button>'},
      function(){var el2=$('gcard');if(el2)el2.innerHTML='<div class="gl">'+G_BADGE+'<span><b>'+LFI.tr('Conta do Google')+'</b><small>'+LFI.tr('Não deu para verificar agora.')+'</small></span></div>'})}
  function estLabel(e){if(e.est==='pago'&&e.entregue)return 'Entregue';return {pagar:'Aguardando pagamento',comp:'Comprovante em análise',pago:'Pago · reservado',recusado:'Comprovante recusado',cancelado:'Pedido cancelado'}[e.est]||'Pedido enviado'}
  /* S371 (16/11, defeito visto pelo dono): Minha conta aberta → menu → Minha conta de novo redesenhava a MESMA tela com a animação de entrada por cima da que já estava (imagem dobrada).
     Pelo ícone do topo, se a tela pedida já é a que está aberta, ela fica como está. Pelo menu, o item passa pelo "menu = recomeçar" (ver S48 A, mais abaixo). */
  function contaJaAberta(t){return !!(t&&t.id==='contabtn')&&contaNaTela()}
  function contaNaTela(){try{var p=$('layer').querySelector('.scrim[data-accn]'),lb=p&&p.getAttribute('data-accn');if(!lb)return false;return !sessG()?lb==='Iniciar sessão':(getConta()?lb==='Minha conta':false)}catch(_){return false}}
  var minhaConta;/* S422: a tela da conta é desenhada por mcTela() e aberta pela minhaConta() única (bloco S420/S422 do trilho) */
  /* endereço de entrega fora do Paraguai: avisa e não deixa seguir com delivery (sem internet/não achado: deixa seguir) */
  var ENDC={};
  function endConf(txt){var k=cdN(txt);if(ENDC[k])return Promise.resolve(ENDC[k]);
    if(/\b\d{5}-?\d{3}\b/.test(txt)||/\b(brasil|brazil)\b/i.test(txt))return Promise.resolve(ENDC[k]={fora:true,cc:'br'});
    if(/\bargentina\b/i.test(txt))return Promise.resolve(ENDC[k]={fora:true,cc:'ar'});
    var q=function(py){var ctl=window.AbortController?new AbortController():null,tm=setTimeout(function(){if(ctl)ctl.abort()},6000);
      return fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1'+(py?'&countrycodes=py':'')+'&q='+encodeURIComponent(txt),{signal:ctl?ctl.signal:undefined}).then(function(r){clearTimeout(tm);if(!r.ok)throw 0;return r.json()})};
    return q(true).then(function(a){if(a&&a.length)return {fora:false};return q(false).then(function(b){var cc=b&&b[0]&&b[0].address?String(b[0].address.country_code||'').toLowerCase():'';return {fora:!!cc&&cc!=='py',cc:cc}})})
      .then(function(r){ENDC[k]=r;return r},function(){return {fora:false}})}
  function endAviso(cc){var m=semDelivery(cc)+' '+(lgS()==='es'?'Revisa la dirección o elige Retirar en la tienda.':'Confira o endereço ou escolha Retirar na loja.');toast(m);
    var f=$('fa2'),h=$('fa2h');if(f){f.classList.add('bad');if(!h){h=document.createElement('div');h.id='fa2h';h.className='cfh er';f.after(h)}h.textContent=m;h.hidden=false}}
  document.addEventListener('focusout',function(e){var t=e.target;if(!t||t.id!=='fa2')return;var v=t.value.trim();if(v.length<6)return;endConf(v).then(function(r){if($('fa2')!==t||t.value.trim()!==v)return;var h=$('fa2h');if(r.fora)endAviso(r.cc);else{t.classList.remove('bad');if(h)h.hidden=true}})});

  var EMAIL_ENVIA=false; /* ligar (true) quando o envio de e-mail do pedido estiver funcionando */
  function gdSave(){if(!$('gn'))return;var g=function(i){var e=$(i);return e?e.value:''};st.gd={nome:g('gn'),pais:g('gpp'),tz:g('gz'),email:g('ge'),doc:g('gd')};lsS('lf_guest',st.gd)}
  document.addEventListener('input',function(e){if(e.target&&/^g[nzed]$/.test(e.target.id))gdSave()});

  
  /* PIX: código "copia e cola" e QR */
  function crc16(s){var c=0xFFFF;for(var i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(var j=0;j<8;j++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return ('000'+c.toString(16).toUpperCase()).slice(-4)}
  function pixCode(v,txid){var f=function(i,x){return i+('0'+x.length).slice(-2)+x};
    var p=f('00','01')+f('01','11')+f('26',f('00','br.gov.bcb.pix')+f('01',PIXD.key))+f('52','0000')+f('53','986')+f('54',v.toFixed(2))+f('58','BR')+f('59',PIXD.nome)+f('60',PIXD.cid)+f('62',f('05',txid))+'6304';return p+crc16(p)}
  function valorBRL(){var r=window.LF_RATE?window.LF_RATE():1400;return Object.keys(st.cart).reduce(function(a,k){return a+st.cart[k]*Math.max(5,Math.round(find(k).n/r/5)*5)},0)-Math.round(descD()/r/5)*5}
  function loadQr(){return new Promise(function(ok,no){if(window.LFqr)return ok();var s=document.createElement('script');s.src='lfx/qr.js?v='+(window.LF_BUILD||'1');s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
  /* pedidos deste aparelho */
  function pedGet(id){return lsG('lf_ped',[]).filter(function(e){return e.id===id})[0]}
  function pedSet(id,o){var L=lsG('lf_ped',[]);L.forEach(function(e){if(e.id===id)for(var k in o)e[k]=o[k]});lsS('lf_ped',L)}
  var PKT=0;function pkStop(){clearInterval(PKT);PKT=0}
  function pkPoll(id,fn){pkStop();var go=function(){if(!$('pkok')){pkStop();return}fbg('reservas/'+encodeURIComponent(id)).then(function(d){var o=fbd(d);if($('pkok'))fn(o||{})}).catch(function(){})};go();PKT=setInterval(go,4000)}
  var PK_LOGO='<div class="pkl"></div>';
  var ITAU={alias:'+595983642241',titular:'Jamal Ali Yassine'};
  /* S318: voltar no padrão do site (igual ao "‹ Início" da página da peça); nas telas de pagamento leva a Minha conta › Pedidos */
  function pzBar(){return '<div class="zb"><button type="button" data-pzvolta><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Minha conta</span></button></div>'}
  function pzTopo(){var o=$('pkok'),t=document.querySelector('.top');if(!o||!t)return;var bb=o.querySelector('.zb');o.style.setProperty('--pzt',Math.round(t.getBoundingClientRect().bottom)+'px');var zz=parseFloat(getComputedStyle(document.body).zoom)||1;o.style.setProperty('--pzp',Math.round((bb?bb.getBoundingClientRect().bottom:t.getBoundingClientRect().bottom)/zz)+'px')}
  window.addEventListener('resize',function(){if($('pkok'))pzTopo()});
  document.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-pzvolta],[data-pzqr]');if(!t)return;
    if(t.hasAttribute('data-pzqr')){var q=t.closest('.zQ');if(q)q.classList.toggle('big');return}
    var po=$('pkok');if(po){pkStop();po.remove()}document.documentElement.classList.remove('lock');closeLayer();minhaConta('peds')});
  function compZap(e){var m=LFI.lang==='es'?'¡Hola! Pagué el pedido '+e.cod+' y el sitio no procesó el comprobante. Te lo envío por aquí.':'Olá! Paguei o pedido '+e.cod+' e o site não processou o comprovante. Estou enviando por aqui.';
    return '<a class="pgwa" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(m)+'"><span>O envio não funcionou? Mande o comprovante pelo WhatsApp</span></a>'}
  var RELT=0;
  function resRelogio(id){
    clearInterval(RELT);RELT=0;var e=pedGet(id);if(!e||!e.rx||e.est!=='pagar'||!$('cdx'))return;
    var tot=Math.max(1,e.rx-(e.ts+(e.rd||0))),tick=function(){
      var c=$('cdx');if(!c||!$('pkok')){clearInterval(RELT);RELT=0;return}
      var ms=resLeft(pedGet(id));
      if(ms<=0){clearInterval(RELT);RELT=0;resExpirou(id);return}
      var s=Math.ceil(ms/1000),t=$('cdxt'),b=$('cdxb');if(t)t.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');if(b)b.style.width=Math.min(100,ms/tot*100)+'%';c.classList.toggle('lvx',s<=60);if(b&&b.parentNode)b.parentNode.classList.toggle('lvx',s<=60)};
    tick();RELT=setInterval(tick,1000)}
  function resExpirou(id){
    /* S313: a ação cheia recupera a venda; quem já pagou envia o comprovante aqui mesmo (antes ia para o WhatsApp) */
    pedSet(id,{rx:0,venc:1});window.__pgid=id;
    pkTela(pzBar()+PK_LOGO+'<h2 style="animation-delay:0s">Reserva encerrada</h2><div class="pkt" style="animation-delay:.1s"><span>Passaram os 30 minutos e a peça voltou para o site. Se ainda estiver disponível, você pode reservar de novo.</span></div><div class="pkb py" style="animation-delay:.3s"><button type="button" class="pyP" data-pkrenova="'+esc(id)+'">Reservar de novo</button><label class="pyL" for="pgf" id="pgbtn">Já paguei · enviar comprovante</label><input type="file" id="pgf" accept="image/*" hidden><button type="button" class="pyL s" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0 py';pzTopo()}
  function resRenova(id){
    var e=pedGet(id);if(!e)return;
    resCall('reservar',id,resItens(e.itens)).then(function(r){
      if(r&&r.ok===false&&r.motivo==='esgotado'){resEsgotou(r.falta,{itens:e.itens});return}
      if(r&&r.ok&&!r.off&&r.exp)pedSet(id,{rx:r.exp,rd:(r.agora||Date.now())-Date.now()});
      pkPagar(id)})}
  function pkComp(id){
    pedSet(id,{est:'comp'});
    /* S313: final calmo — ✓ parado, número do pedido, uma saída só (o WhatsApp só aparece se o envio falhar, em enviarComp) */
    var pc=pedGet(id)||{};
    pkTela(pzBar()+PK_LOGO+'<div class="pyk"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.500 4.500L19 7.500"/></svg></div><h2 style="animation-delay:0s">Comprovante enviado</h2>'+(pc.cod?'<p class="pyn"><span>Pedido</span> '+esc(pc.cod)+'</p>':'')+'<div class="pkt" style="animation-delay:.1s"><span>'+(pc.venc?'Vamos conferir o seu pagamento e avisar aqui e em Minha conta. Pode sair desta tela.':'Vamos conferir o seu pagamento e avisar aqui e em Minha conta. Pode sair desta tela: sua peça continua reservada.')+'</span></div><div class="pkb py" style="animation-delay:.3s"><button type="button" class="pyL" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0 py';pzTopo();
    pkPoll(id,function(o){if(o.pago)pkOk(id,o);else if(o.recusado){pedSet(id,{est:'recusado'});pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Comprovante não aceito</h2><div class="pkt" style="animation-delay:.1s"><span>A loja não encontrou esse pagamento. Confira o valor e envie o comprovante de novo.</span></div><div class="pkb" style="animation-delay:.3s"><button type="button" data-cta="ped" data-id="'+esc(id)+'">Enviar outro comprovante</button></div>');pkStop()}})}
  /* código de entrega do pedido pago: a cliente pede à nuvem mostrando o telefone do pedido */
  function pedTok(id){var e=pedGet(id)||{};return resCall('token',id,null,null,{tel:e.tel||(getConta()||{}).tel||''}).then(function(j){return (j&&j.ok&&j.tok)||''})}
  function pkOk(id){pkStop();pedTok(id).then(function(t){pkPago(id,t)})}
  function pkPago(id,tok){
    var e=pedGet(id)||{};pedSet(id,{est:'pago',tok:tok});
    tok=tok||('LF-'+(e.cod||''));
    pkTela(PK_LOGO+'<div class="pkc"><u></u>'+PK_SVG+'</div><h2 class="ty">Obrigado pela preferência! <span class="hrt">♥</span></h2><div class="pkt"><b style="animation:pkup .5s .7s both">Pagamento confirmado</b><span class="sub2">Suas peças estão reservadas.<br>Ficam separadas para você até a entrega.</span></div>'+
      '<div class="pkcod" style="animation-delay:1.2s">'+esc(tok)+'</div><div class="pkt" style="animation-delay:1.3s"><span>Guarde este código. Ele garante que o pedido é seu.</span></div>'+
      '<div class="pgw" style="margin-top:12px;animation:pkup .5s 1.4s both">'+(e.ent==='delivery'?'A loja avisa pelo WhatsApp quando o pedido sair. O frete é pago à transportadora na entrega.':'Retire na loja quando quiser: segunda a sábado, das 7h30 às 15h.')+'</div>'+
      '<div class="pkb" style="animation:pkup .5s 1.6s both"><button type="button" class="pkrb" data-pkrec="'+esc(id)+'">Ver comprovante</button><a class="pkw" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent('Olá! Meu pedido '+tok+' está pago.')+'">'+PK_WA+'Falar com a loja</a><button type="button" data-pkfim>Voltar ao catálogo</button></div>')}
  /* comprovante de pagamento do cliente */
  function reciboDados(id){
    var e=pedGet(id)||{},c=getConta()||{},pix=e.pag==='pix',tok=e.tok||('LF-'+(e.cod||''));
    var L=[['Cliente',c.nome||''],['Pedido',(e.cod||'')+' · '+new Date(e.ts).toLocaleDateString('pt-BR')]];
    if(e.itens&&e.itens.length)L.push(['Itens',e.itens.map(function(i){return i.q+'× '+i.nome+' ('+i.ref+')'+(i.cor?' · '+i.cor:'')}).join('; ')]);
    L.push(['Forma de pagamento',pix?'PIX':'QR do banco'],[e.ent==='delivery'?'Entrega':'Retirada',e.ent==='delivery'?'Delivery':'Loja · seg a sáb, 7h30–15h'],['Valor pago',pix?brl(e.brl):'Gs. '+mil(e.total)]);
    return {rows:L,tok:tok}}
  function pkRecibo(id){
    var d=reciboDados(id);
    pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Pedido pago</h2><div class="pkt" style="animation-delay:.1s"><span>Suas peças estão reservadas até a entrega.</span></div>'+
      '<div class="rc"><h4>Comprovante de pagamento</h4><span class="ok">✓ Pago · confirmado pela loja</span>'+
      d.rows.map(function(r){return '<div class="r"><span>'+r[0]+'</span><b>'+esc(r[1])+'</b></div>'}).join('')+'<div class="cd">'+esc(d.tok)+'</div></div>'+
      '<div class="rb"><button type="button" class="p" data-pkshare="'+esc(id)+'">Compartilhar</button><button type="button" data-pksave="'+esc(id)+'">Salvar imagem</button></div>'+
      '<div class="rn">Guarde este comprovante. Se precisar, é só enviar para a loja pelo WhatsApp.</div>'+
      '<div class="pkb"><button type="button" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0'}
  function reciboCanvas(id){
    var d=reciboDados(id),W=720,pad=48,rows=d.rows,cv=document.createElement('canvas'),x=cv.getContext('2d');
    function wrap(t,w,f){x.font=f;var ws=String(t).split(' '),ls=[],l='';ws.forEach(function(p){var u=l?l+' '+p:p;if(x.measureText(u).width>w&&l){ls.push(l);l=p}else l=u});ls.push(l);return ls}
    var H=330+rows.reduce(function(a,r){return a+Math.max(1,wrap(r[1],330,'600 25px Inter,Arial,sans-serif').length)*32+22},0)+130;
    cv.width=W;cv.height=H;x.fillStyle='#fbf7fa';x.fillRect(0,0,W,H);x.fillStyle='#fff';x.strokeStyle='#e6d8e1';x.lineWidth=2;
    x.beginPath();x.roundRect?x.roundRect(24,24,W-48,H-48,28):x.rect(24,24,W-48,H-48);x.fill();x.stroke();
    x.textAlign='center';x.fillStyle='#8d3a69';x.font='700 54px Georgia,serif';x.fillText('La Fouch',W/2,112);
    x.fillStyle='#6b5a65';x.font='500 22px Inter,Arial,sans-serif';x.fillText('Tudo em Óculos · Ciudad del Este',W/2,146);
    x.fillStyle='#241a21';x.font='700 32px Inter,Arial,sans-serif';x.fillText('Comprovante de pagamento',W/2,214);
    x.fillStyle='#e4f5ea';x.beginPath();x.roundRect?x.roundRect(W/2-190,236,380,44,22):x.rect(W/2-190,236,380,44);x.fill();
    x.fillStyle='#177a3c';x.font='700 22px Inter,Arial,sans-serif';x.fillText('✓ Pago · confirmado pela loja',W/2,266);
    var y=330;x.textAlign='left';
    rows.forEach(function(r){var ls=wrap(r[1],330,'600 25px Inter,Arial,sans-serif');x.strokeStyle='#e6d8e1';x.setLineDash([6,6]);x.beginPath();x.moveTo(pad,y-26);x.lineTo(W-pad,y-26);x.stroke();x.setLineDash([]);
      x.fillStyle='#6b5a65';x.font='500 24px Inter,Arial,sans-serif';x.fillText(r[0],pad,y);x.fillStyle='#241a21';x.font='600 25px Inter,Arial,sans-serif';x.textAlign='right';ls.forEach(function(l,i){x.fillText(l,W-pad,y+i*32)});x.textAlign='left';y+=ls.length*32+22});
    x.textAlign='center';x.fillStyle='#8d3a69';x.font='800 46px ui-monospace,Menlo,monospace';x.fillText(d.tok,W/2,y+46);
    x.fillStyle='#6b5a65';x.font='500 20px Inter,Arial,sans-serif';x.fillText('lafouch.com · Guarde este comprovante',W/2,y+90);return cv}
  function reciboBlob(id,cb){reciboCanvas(id).toBlob(cb,'image/png')}
  function reciboSalvar(id){reciboBlob(id,function(b){var u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='comprovante-lafouch-'+((pedGet(id)||{}).cod||'')+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000)})}
  function reciboCompartilhar(id){reciboBlob(id,function(b){var f;try{f=new File([b],'comprovante-lafouch.png',{type:'image/png'})}catch(_){}
    if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'Comprovante La Fouch'}).catch(function(){})}else reciboSalvar(id)})}
  function pkAbre(id){var e=pedGet(id);if(!e)return;if(e.est==='cancelado'){toast('Este pedido foi cancelado.');return}closeLayer();if(e.est==='comp'){pkComp(id)}else if(e.est==='pago'){pkRecibo(id)}else{if(e.rx&&e.est==='pagar'&&resLeft(e)<=0)resExpirou(id);else pkPagar(id)}}
  function resize(file){return new Promise(function(ok,no){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var m=1100,w=im.width,h=im.height,k=Math.min(1,m/Math.max(w,h));var c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.72))};im.onerror=no;im.src=r.result};r.onerror=no;r.readAsDataURL(file)})}
  function enviarComp(id,file){
    var btn=$('pgbtn');if(btn)btn.textContent='Enviando…';
    resize(file).then(function(img){return pkEnviar({tipo:'comp',ref:id,img:img,ts:Date.now(),cod:(pedGet(id)||{}).cod||''},id+'c')}).then(function(){if(CFG.reserva===true){var pe=pedGet(id)||{};resCall('comp',id,resItens(pe.itens)).then(function(r){if(r&&r.ok)pedSet(id,{rx:0})})}pkComp(id)},function(){if(btn){btn.textContent='Não deu para enviar. Tente de novo.';var pz=pedGet(id),oz=$('pkok');if(pz&&oz&&!oz.querySelector('.pgwa'))btn.insertAdjacentHTML('afterend',compZap(pz))}toast('Não deu para enviar o comprovante. Tente de novo.')})}
  function resEsgotou(falta,doc){
    var L=(falta||[]).map(function(f){var it=(doc.itens||[]).filter(function(i){return i.ref===f.ref&&String(i.cor||'').toLowerCase()===String(f.cor||'').toLowerCase()})[0]||{};return '<div class="exx" style="margin-top:6px"><b>'+esc(it.nome||f.ref)+(f.cor?' · '+esc(f.cor):'')+'</b>'+(f.disp>0?'Só restam '+f.disp+' no momento.':'Acabou de ser reservada por outra cliente.')+'</div>'}).join('');
    st.pkid='';st.pkdoc=null;
    /* a peça está presa por um pedido DESTE aparelho que ainda não foi pago: não é "outra pessoa" */
    var meu=lsG('lf_ped',[]).filter(function(e){return e.est==='pagar'&&e.rx&&resLeft(e)>0&&(e.itens||[]).some(function(i){return (falta||[]).some(function(f){return f.ref===i.ref})})}).pop();
    if(meu){pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Você já reservou esta peça</h2><div class="pkt" style="animation-delay:.1s"><span>Ela está guardada no seu pedido '+esc(meu.cod||'')+', esperando o pagamento. Nenhum pedido novo foi criado.</span></div><div class="pkb" style="animation-delay:.3s"><button type="button" data-cta="ped" data-id="'+esc(meu.id)+'">Ver meu pedido</button><button type="button" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0';try{syncEstoque()}catch(_){}return}
    var soEsg=(falta||[]).every(function(f){return !f.motivo||f.motivo==='esgotado'});
    if(!soEsg){pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Peça indisponível</h2><div class="pkt" style="animation-delay:.1s"><span>Esta peça não está disponível no site no momento. Nenhum pedido foi criado. Fale com a loja pelo WhatsApp se quiser.</span></div><div class="pkb" style="animation-delay:.3s"><button type="button" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0';try{syncEstoque()}catch(_){}return}
    pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Acabou de esgotar</h2><div class="pkt" style="animation-delay:.1s"><span>Alguém reservou esta peça agora. Se ela não for paga em 30 minutos, volta para o site. Nenhum pedido foi criado.</span></div>'+L+'<div class="pkb" style="animation-delay:.3s"><button type="button" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0';
    try{syncEstoque()}catch(_){}}

  /* ===== Conta nova (07/11/2026): cadastro só nome/e-mail/senha + código no e-mail; Minha conta em abas ===== */
  function primeiroNome(n){return String(n||'').trim().split(/\s+/)[0]||''}
  function contaMin(s,nome){var c={nome:String(nome||s.gn||'').trim()||String(s.email||'').split('@')[0],email:s.email||'',ts:Date.now(),ends:[]};lsS('lf_conta',c);fsA('PATCH','clientes/'+s.uid,c).catch(function(){});return c}
  /* conta antiga: cidade + endereço viram o primeiro item de "Meus endereços" */
  function contaNorm(c){if(!c)return c;if(!Array.isArray(c.ends)){c.ends=[];if(c.end&&(!c.cpais||c.cpais==='py'))c.ends.push({id:'e1',nome:'Casa',cidade:String(c.cidade||'').split(',')[0],dep:String(c.cidade||'').split(',').slice(1).join(',').trim(),end:c.end,ref:c.obs||''})}return c}
  function contaGrava(c){var s=sessG();lsS('lf_conta',c);contaBtn();if(!s)return Promise.resolve();return fsA('PATCH','clientes/'+s.uid,c).catch(function(){toast('Salvo só neste aparelho. Sem internet agora.')})}
  function emailOk(){var s=sessG();if(!s)return Promise.resolve(false);if(s.ev||s.via==='google')return Promise.resolve(true);
    return idTok().then(function(t){return authPost('lookup',{idToken:t})}).then(function(j){var u=(j.users||[])[0]||{},g=(u.providerUserInfo||[]).some(function(x){return x.providerId==='google.com'});var ok=!!u.emailVerified||g;if(ok){var s2=sessG();if(s2){s2.ev=true;lsS('lf_auth',s2)}}return ok},function(){return false})}
  /* depois de entrar ou criar a conta: no pedido, confere o e-mail e segue para a Entrega */
  function posLogin(){contaBtn();if(!AUTH_VOLTA){closeLayer();return}
    emailOk().then(function(ok){if(ok){st.step='ent';bag()}else codigoTela()})}
  function cadastrarTela(){gPre();
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Criar conta">'+authHead('Criar conta')+
      (AUTH_VOLTA?'<div class="note" style="margin:0">Para fazer o pedido, crie sua conta ou entre. Seu carrinho fica guardado.</div>':'')+
      '<label class="cfl" for="aun">Nome completo</label><input class="field" id="aun" autocomplete="name" placeholder="Como você se chama">'+
      '<label class="cfl" for="aue">E-mail</label><input class="field" id="aue" type="email" inputmode="email" autocomplete="email" autocapitalize="none" placeholder="voce@email.com">'+
      pwField('aup2','Senha (mínimo 6 caracteres)')+
      '<div class="fze" id="cferr" role="alert" hidden></div>'+
      '<button class="btn w" data-cta="criar" data-busy>Confirmar</button>'+'<p class="tm">Ao criar sua conta, você aceita os <a href="/termos.html" target="_blank" rel="noopener">Termos e Condições</a> <span>e a</span> <a href="/privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>.</p>'+gBtn('Criar conta com Google')+
      '<button type="button" class="cfx" data-cta="entrar" style="text-align:center;width:100%">Já tenho conta · <u>Iniciar sessão</u></button></aside>')};
  function authCriar(){
    var g=function(i){return ($(i)||{value:''}).value.trim()},nome=g('aun').replace(/\s+/g,' '),em=g('aue').toLowerCase(),pw=($('aup2')||{value:''}).value;
    document.querySelectorAll('#layer .field.bad').forEach(function(e){e.classList.remove('bad')});
    if(nome.length<3||nome.indexOf(' ')<0)return cfErro('Digite seu nome e sobrenome.','aun');
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(em))return cfErro('E-mail inválido.','aue');
    if(pw.length<6)return cfErro('A senha precisa ter 6 ou mais caracteres.','aup2');cfErro('');authBusy(true);
    authPost('signUp',{email:em,password:pw,returnSecureToken:true}).then(function(j){var s=sessSave(j,'');
      return authPost('update',{idToken:j.idToken,displayName:nome,returnSecureToken:false}).catch(function(){}).then(function(){var c={nome:nome,email:em,ts:Date.now(),ends:[]};lsS('lf_conta',c);return fsA('PATCH','clientes/'+s.uid,c).catch(function(){})})})
      .then(function(){contaBtn();codigoTela(true)},function(e){authErr(e,'aue')})};
  /* tela do código de 6 números (ou, sem o envio configurado, o link de confirmação do Firebase) */
  var CODT=0,CODP=0;
  function codChama(acao,extra){return idTok().then(function(t){return acFetch(fnUrl('codigo'),{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(Object.assign({acao:acao,lang:lgS()},extra||{}))})}).then(function(r){if(r.status===404)return {ok:false,motivo:'sem-config'};return r.json().catch(function(){return {ok:false,motivo:'erro'}})},function(){return {ok:false,motivo:'rede'}})}
  function codigoTela(novo){var s=sessG();if(!s){entrarTela(AUTH_VOLTA);return}clearInterval(CODT);clearInterval(CODP);
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Confirme seu e-mail">'+authHead('Confirme seu e-mail')+'<div id="codb"><div class="note" style="margin:0">Enviando o código para <b>'+esc(s.email)+'</b>…</div></div></aside>');
    codChama('enviar').then(function(r){if(!$('codb'))return;
      if(r.ok&&r.ja){emailFeito();return}
      if(r.ok||r.motivo==='espere'){codUI(s.email,r.s||45);return}
      if(r.motivo==='sem-config'||r.motivo==='rede'||r.motivo==='erro'||r.motivo==='envio')linkUI(s.email);else codUI(s.email,45)})}
  function codUI(em,seg){var b=$('codb');if(!b)return;
    b.innerHTML='<div class="note" style="margin:0">Enviamos um código de 6 números para <b>'+esc(em)+'</b>. Olhe também a caixa de spam.</div>'+
      '<div class="codr">'+[0,1,2,3,4,5].map(function(i){return '<input class="field codi" id="cod'+i+'" inputmode="numeric" autocomplete="'+(i?'off':'one-time-code')+'" maxlength="1" aria-label="Número '+(i+1)+' do código">'}).join('')+'</div>'+
      '<div class="fze" id="cferr" role="alert" hidden></div><button class="btn w" data-cta="codok" data-busy>Confirmar código</button>'+
      '<div class="codf"><button type="button" class="cfx" data-cta="codre" id="codre" disabled>Reenviar em <span id="codt">0:'+('0'+seg).slice(-2)+'</span></button><button type="button" class="cfx" data-cta="codtroca"><u>Trocar e-mail</u></button></div>';
    var t=seg;CODT=setInterval(function(){t--;var x=$('codt'),r=$('codre');if(!x||!r){clearInterval(CODT);return}if(t<=0){clearInterval(CODT);r.disabled=false;r.innerHTML='<u>Reenviar código</u>'}else x.textContent='0:'+('0'+t).slice(-2)},1000);
    setTimeout(function(){var i=$('cod0');if(i)try{i.focus()}catch(_){}},80)}
  function codValor(){var v='';for(var i=0;i<6;i++){var e=$('cod'+i);v+=e?e.value:''}return v}
  function codConfere(){var v=codValor();if(!/^\d{6}$/.test(v))return cfErro('Digite os 6 números do código.','cod'+Math.min(v.length,5));cfErro('');authBusy(true);
    codChama('conferir',{codigo:v}).then(function(r){authBusy(false);if(r.ok){emailFeito();return}
      var M={errado:'Código errado. '+(r.resta>0?'Restam '+r.resta+' tentativas.':''),vencido:'O código venceu. Toque em Reenviar código.',tentativas:'Muitas tentativas. Peça um código novo.','sem-codigo':'Peça um código novo.'};
      cfErro(M[r.motivo]||'Não deu para conferir agora. Tente de novo.');for(var i=0;i<6;i++){var e=$('cod'+i);if(e)e.value=''}var f=$('cod0');if(f)try{f.focus()}catch(_){}})}
  document.addEventListener('input',function(e){var t=e.target;if(!t||!/^cod[0-5]$/.test(t.id))return;var d=t.value.replace(/\D/g,'');
    if(d.length>1){for(var i=0;i<6;i++){var x=$('cod'+i);if(x)x.value=d[i]||''}if(d.length>=6)codConfere();return}
    t.value=d;if(d){var n=$('cod'+(+t.id.slice(3)+1));if(n){try{n.focus()}catch(_){}}else if(codValor().length===6)codConfere()}});
  document.addEventListener('keydown',function(e){var t=e.target;if(!t||!/^cod[0-5]$/.test(t.id))return;if(e.key==='Backspace'&&!t.value){var p=$('cod'+(+t.id.slice(3)-1));if(p){p.value='';try{p.focus()}catch(_){}}}else if(e.key==='Enter')codConfere()});
  document.addEventListener('paste',function(e){var t=e.target;if(!t||!/^cod[0-5]$/.test(t.id))return;var d=String((e.clipboardData||window.clipboardData).getData('text')||'').replace(/\D/g,'').slice(0,6);if(!d)return;e.preventDefault();for(var i=0;i<6;i++){var x=$('cod'+i);if(x)x.value=d[i]||''}if(d.length===6)codConfere()});
  /* sem o envio do código configurado: link do próprio Firebase; o site percebe sozinho quando a pessoa confirmou */
  function linkUI(em){var b=$('codb');if(!b)return;
    idTok().then(function(t){return authPost('sendOobCode',{requestType:'VERIFY_EMAIL',idToken:t})}).catch(function(){});
    b.innerHTML='<div class="note" style="margin:0">Enviamos um link de confirmação para <b>'+esc(em)+'</b>. Abra o e-mail, toque no link e volte aqui. Olhe também a caixa de spam.</div>'+
      '<div class="codw"><span class="spn"></span><span>Esperando a confirmação…</span></div><button class="btn w" data-cta="codlink">Já confirmei</button><div class="codf"><button type="button" class="cfx" data-cta="codtroca"><u>Trocar e-mail</u></button></div>';
    CODP=setInterval(function(){if(!$('codb')){clearInterval(CODP);return}var s=sessG();if(s){s.exp=0;lsS('lf_auth',s)}emailOk().then(function(ok){if(ok){clearInterval(CODP);emailFeito()}})},5000)}
  function emailFeito(){clearInterval(CODT);clearInterval(CODP);var s=sessG();if(s){s.ev=true;s.exp=0;lsS('lf_auth',s)}toast('✓ E-mail confirmado');
    if(AUTH_VOLTA&&Object.keys(st.cart).length){st.step='ent';bag()}else{var c=getConta();layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Conta criada"><div class="ccok"><div class="cck"><svg viewBox="0 0 24 24" fill="none" stroke="#14803f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path pathLength="1" d="M6.5 12.5l4 4 7-8.5"/></svg></div><h2 style="font-size:28px">Conta pronta!</h2><div class="note" style="margin:0"><span>Bem-vindo(a),</span> '+esc(primeiroNome(c&&c.nome))+'.</div><button class="btn w" data-cta="minha" style="margin-top:18px">Ver minha conta</button></div></aside>')}}
  /* entrar: e-mail (ou usuário antigo) + senha */
  function authEntrar(){
    var id=($('aul')||{value:''}).value.trim().toLowerCase(),pw=($('aup')||{value:''}).value;
    if(!id)return cfErro('Digite seu e-mail.','aul');if(!pw)return cfErro('Digite sua senha.','aup');cfErro('');try{var rm=$('aur')?$('aur').checked:true;if(rm){localStorage.removeItem('lf_norem');localStorage.setItem('lf_lastu',id)}else{localStorage.setItem('lf_norem','1');localStorage.removeItem('lf_lastu')}}catch(_){}authBusy(true);
    var ses;(id.indexOf('@')>0?authPost('signInWithPassword',{email:id,password:pw,returnSecureToken:true}):contaEntrar(id,pw)).then(function(j){ses=sessSave(j,id.indexOf('@')>0?'':id,{gn:j.displayName||''});return ses})
      .then(function(s){return fsA('GET','clientes/'+s.uid).then(function(d){return fbd(d)},function(){return null})})
      .then(function(c){c=c&&c.email?contaNorm(c):contaMin(ses);lsS('lf_conta',c);toast('Olá, '+primeiroNome(c.nome)+'!');posLogin()},function(e){authErr(e,'aul')})};
  function gEntrar(){
    gPopup().then(function(r){var u=r.user;return u.getIdToken().then(function(t){var s=sessSave({localId:u.uid,email:u.email,idToken:t,refreshToken:u.refreshToken,expiresIn:3600},'',{via:'google',gn:u.displayName||'',ev:true});try{gAuth().signOut()}catch(_){}return s})})
      .then(function(s){return fsA('GET','clientes/'+s.uid).then(function(d){return {s:s,c:fbd(d)}},function(){return {s:s,c:null}})})
      .then(function(o){var c=o.c&&o.c.email?contaNorm(o.c):contaMin(o.s);lsS('lf_conta',c);toast('Olá, '+primeiroNome(c.nome)+'!');posLogin()},gErr)};

  /* ===== Minha conta: Perfil · Endereços · Pedidos ===== */
  var IC_ED='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
      IC_RM='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';
  function perfilCampos(c,p,so){/* p = prefixo dos ids; so = 'falta' mostra só o que falta */
    var nac=c.nac||((window.LFI&&LFI.lang==='es')?'py':'br'),pais=c.pais||nac,h='';
    var ti=telItems();if(!ti.some(function(x){return x.v===pais}))ti.push({v:pais,s:'+'+(FN&&FN[pais]?FN[pais].c:''),l:paisNome(pais),q:paisNome(pais)});
    if(!FN)fnLoad().then(function(){if($(p+'p')){cddTel(p+'p');var z=$(p+'z');if(z){z.placeholder=fnEx($(p+'p').value);if(z.value)fnVivo(z,p+'p',p+'zh')}}},function(){});
    if(so!=='falta'||!c.tel)h+='<label class="cfl" for="'+p+'z">Número de telefone</label><div class="fzr">'+cdd(p+'p','País do telefone',pais,ti,'Buscar país ou código')+'<input class="field" id="'+p+'z" inputmode="tel" autocomplete="tel-national" placeholder="'+esc(fnEx(pais))+'" value="'+esc(((st.pf&&st.pf[p])||{}).z!=null?st.pf[p].z:(c.telTxt||''))+'"></div><div class="cfh" id="'+p+'zh" hidden></div>';
    /* S400 (17/11, esboços 59d/59e): Documento = Cédula | RUC para o paraguaio; o que a pessoa digita fica guardado (st.pf) e volta ao redesenhar o passo */
    var G=(st.pf&&st.pf[p])||{};if(G.a2)nac=G.a2;var tp=docTipo(p,c),py=nac==='py';
    if(so!=='falta'||!c.doc)h+='<label class="cfl" for="'+p+'a2">'+LFI.tr('Nacionalidade')+'</label>'+cdd(p+'a2',LFI.tr('Nacionalidade'),nac,nacItems(),'Buscar nacionalidade')+
      '<div id="'+p+'dt"'+(py?'':' hidden')+'><span class="cfl">'+LFI.tr('Documento')+'</span><div class="cfdoc" role="group" aria-label="'+LFI.tr('Documento')+'"><button type="button" data-doct="ced" data-p="'+p+'" class="'+(tp==='ruc'?'':'on')+'" aria-pressed="'+(tp!=='ruc')+'">'+LFI.tr('Cédula')+'</button><button type="button" data-doct="ruc" data-p="'+p+'" class="'+(tp==='ruc'?'on':'')+'" aria-pressed="'+(tp==='ruc')+'">RUC</button></div></div>'+
      '<label class="cfl" for="'+p+'d" id="'+p+'dl">'+docRot(nac,tp)+'</label><input class="field" id="'+p+'d" inputmode="'+(NAC[nac]?'numeric':'text')+'" autocomplete="off" placeholder="'+docPh(nac,tp)+'" value="'+esc(G.d!=null?G.d:maskDoc(nac,c.doc||'',tp))+'">';
    /* o RUC opcional de antes saiu: quem quer a factura com nome escolhe RUC acima (o campo fica escondido só para o código antigo que o procura) */
    h+='<div id="'+p+'rw" hidden></div>';
    return h}
  function docTipo(p,c){var G=(st.pf&&st.pf[p])||{};return G.tp||((c&&(c.docT==='ruc'||(c.docT!=='ced'&&/-\d$/.test(c.doc||'')&&(c.nac||'py')==='py'&&!!rucNorm(c.doc))))?'ruc':'ced')}
  function docRot(nac,tp){return nac==='py'?LFI.tr(tp==='ruc'?'Número do RUC':'Número da cédula'):nacInfo(nac).d}
  function docPh(nac,tp){return nac==='py'?(tp==='ruc'?'1234567-8':'1.234.567'):nacInfo(nac).ph}
  function pfG(p,k,v){st.pf=st.pf||{};st.pf[p]=st.pf[p]||{};st.pf[p][k]=v}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-doct]');if(!b)return;var p=b.getAttribute('data-p'),tp=b.getAttribute('data-doct'),d=$(p+'d');pfG(p,'tp',tp);
    [].forEach.call(b.parentNode.children,function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
    var l=$(p+'dl');if(l)l.textContent=docRot('py',tp);if(d){d.placeholder=docPh('py',tp);d.value=maskDoc('py',d.value,tp);pfG(p,'d',d.value);d.classList.remove('bad');try{d.focus()}catch(_){}}});
  function rucDV(n){var k=2,t=0;for(var i=n.length-1;i>=0;i--){t+=(+n[i])*k;k=k>=11?2:k+1}var r=t%11;return r>1?11-r:0}
  function rucNorm(v){var m=/^(\d{3,8})-?(\d)$/.exec(String(v||'').replace(/[\s.]/g,''));if(!m)return '';return rucDV(m[1])===+m[2]?m[1]+'-'+m[2]:''}
  /* lê telefone/documento de um bloco perfilCampos; obr = obrigatórios */
  function perfilLer(c,p,obr){var o={},z=$(p+'z'),d=$(p+'d');
    if(z){var pais=$(p+'p').value,tv=z.value.trim();if(tv||obr){var tel=foneNorm(pais,tv);if(!tel){cfErro(fnMsg(pais),p+'z');return null}o.pais=pais;o.tel=tel;o.telTxt=tv}}
    if(d){var nac=$(p+'a2').value,dv=d.value.trim(),tp=nac==='py'?docTipo(p,c):'';if(dv||obr){var dn=docNorm(nac,dv,tp);if(!dn){cfErro(nac==='py'?LFI.tr(tp==='ruc'?'RUC inválido. Confira o número e o dígito depois do traço.':'Cédula inválida. Confira os números.'):nacInfo(nac).d+(NAC[nac]?' inválido. Confira os números.':': digite o número (letras e números, mínimo 4).'),p+'d');return null}o.nac=nac;o.doc=dn;if(nac==='py'){o.docT=tp;o.ruc=tp==='ruc'?dn:''}}}
    var r=$(p+'r'),rw=$(p+'rw');if(r&&rw&&!rw.hidden){var rv=r.value.trim();if(rv){var rn=rucNorm(rv);if(!rn){cfErro(LFI.tr('RUC inválido. Confira o número e o dígito depois do traço.'),p+'r');return null}o.ruc=rn}else o.ruc=''}else if(r)o.ruc=rucNorm((($(p+'d')||{}).value)||'')||'';
    if(st.pf)delete st.pf[p];return o}
  document.addEventListener('change',function(e){var t=e.target;if(!t||!t.id)return;var m=/^(mp|pp)a2$/.exec(t.id);if(m){var p=m[1],n=nacInfo(t.value),fd=$(p+'d'),dt0=$(p+'dt'),tp0=docTipo(p,contaNorm(getConta())||{});pfG(p,'a2',t.value);if(dt0)dt0.hidden=t.value!=='py';if(fd){$(p+'dl').textContent=docRot(t.value,tp0);fd.placeholder=docPh(t.value,tp0);fd.inputMode=NAC[t.value]?'numeric':'text';fd.value=maskDoc(t.value,fd.value,tp0);pfG(p,'d',fd.value)}var pp=$(p+'p'),pz=$(p+'z');if(pp&&pz&&!pz.value&&(!FN||FN[t.value]))cddSet(p+'p',t.value)}
    var m2=/^(mp|pp)p$/.exec(t.id);if(m2){var z=$(m2[1]+'z');if(z){z.placeholder=fnEx(t.value);if(z.value&&!/^(\+|00)/.test(z.value.trim()))fnVivo(z,t.id,m2[1]+'zh')}}});
  document.addEventListener('input',function(e){var t=e.target;if(!t||!t.id)return;var m=/^(mp|pp)z$/.exec(t.id);if(m){fnVivo(t,m[1]+'p',m[1]+'zh');pfG(m[1],'z',t.value)}var m2=/^(mp|pp)d$/.exec(t.id);if(m2){maskCampo(t,function(v){return maskDoc($(m2[1]+'a2').value,v,docTipo(m2[1],contaNorm(getConta())||{}))});pfG(m2[1],'d',t.value)}});
  function endLinha(a){return esc(a.end)+(a.cidade?', '+esc(a.cidade):'')+(a.dep?' · '+esc(a.dep):'')}
  var mcTela=function(aba,edita){
    var c=contaNorm(getConta());if(!sessG()){entrarTela(false);return}if(!c){c=contaMin(sessG())}
    st.mcAba=aba||st.mcAba||'perfil';var A=st.mcAba,h='';
    var tabs='<div class="mct" role="tablist" data-cabe="letra" data-cabe-min="9">'+[['perfil','Perfil'],['ends','Endereços'],['peds','Pedidos'],['cart','Cartões']].map(function(x){return '<button type="button" role="tab" aria-selected="'+(A===x[0])+'" class="'+(A===x[0]?'on':'')+'" data-cta="mcaba" data-a="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>';
    if(A==='perfil'){
      var falta=[!c.tel&&'telefone',!c.doc&&'documento'].filter(Boolean);
      h='<label class="cfl" for="mn">Nome completo</label><input class="field" id="mn" autocomplete="name" value="'+esc(c.nome||'')+'">'+
        '<label class="cfl">E-mail</label><div class="field mce">'+esc(c.email||(sessG()||{}).email||'')+'</div>'+perfilCampos(c,'mp')+
        (falta.length?'<div class="note" style="margin:6px 0 0">Falta '+falta.join(' e ')+'. Você pode completar agora ou na hora do pedido.</div>':'')+
        '<div class="fze" id="cferr" role="alert" hidden></div><button class="btn w" data-cta="mcsalvar">Salvar</button>'+
        '<div class="cfc gcd" id="gcard"><div class="gl">'+G_BADGE+'<span><b>Conta do Google</b><small>Verificando…</small></span></div></div>'+
        '<div class="sesv"><button type="button" class="bsair" data-cta="sair"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>'+LFI.tr('Sair da conta')+'</button><div class="zc"><p>'+LFI.tr('Quer apagar sua conta? Seus dados e endereços são apagados. Não dá para desfazer.')+'</p><button type="button" class="bexc" data-cta="exc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>'+LFI.tr('Excluir minha conta')+'</button></div></div>'}
    else if(A==='ends'){
      if(edita!=null){var e0=edita==='novo'?{}:(c.ends[+edita]||{});
        h='<label class="cfl" for="mnm">Nome do endereço</label><input class="field" id="mnm" placeholder="Ex.: Casa, Trabalho" value="'+esc(e0.nome||'')+'">'+endForm('m',e0)+
          '<div class="fze" id="cferr" role="alert" hidden></div><button class="btn w" data-cta="mcendok" data-i="'+esc(String(edita))+'">Salvar endereço</button><button type="button" class="cfx" data-cta="mcaba" data-a="ends" style="width:100%;text-align:center">Cancelar</button>'}
      else h=(c.ends.length?c.ends.map(function(a,i){return '<div class="mca"><span><b>'+esc(a.nome||'Endereço')+'</b><small>'+endLinha(a)+'</small>'+(a.ref?'<small>Ref.: '+esc(a.ref)+'</small>':'')+'</span><button type="button" class="mci" data-cta="mcended" data-i="'+i+'" aria-label="Editar">'+IC_ED+'</button><button type="button" class="mci" data-cta="mcendrm" data-i="'+i+'" aria-label="Remover">'+IC_RM+'</button></div>'}).join(''):'<div class="note">Nenhum endereço salvo ainda.</div>')+
        '<button type="button" class="mcadd" data-cta="mcended" data-i="novo">+ Adicionar endereço</button>'}
    else if(A==='cart')h='<div id="mtj"><div class="note">'+LFI.tr('Carregando…')+'</div></div>';
    else{var L=lsG('lf_ped',[]).slice().reverse();
      h=L.length?L.map(function(e){var meta=new Date(e.ts).toLocaleDateString('pt-BR')+' · '+(e.pag==='pix'?'PIX':e.pag==='alias'?'Banco Familiar':'')+' · '+(e.ent==='delivery'?'Delivery':'Retirada');
        /* S409 (70d/70e): reserva cancelada ou vencida antes do pagamento */if(window.__lfRcz&&((e.est==='cancelado'&&!e.fp)||(e.est==='pagar'&&e.rx&&Date.now()>e.rx-(e.rd||0))))return window.__lfRcz(e,meta);
        /* S318: quem ainda não pagou toca no pedido para pagar e tem um "Cancelar" pequeno dentro do cartão (fora da área de toque de pagar) */
        if(e.est==='pagar'||e.est==='recusado')return '<div class="cfw"><button type="button" class="cfp cfq" data-cta="ped" data-id="'+esc(e.id)+'"><span class="cf1"><b>Pedido '+esc(e.cod)+(e.teste?' · teste':'')+'</b><span class="cfe"><em>'+estLabel(e)+'</em><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span></span><small>'+meta+'</small></button><button type="button" class="cfk" data-cta="pkcanc" data-id="'+esc(e.id)+'">Cancelar</button></div>';
        return '<button type="button" class="cfp" data-cta="ped" data-id="'+esc(e.id)+'"><span><b>Pedido '+esc(e.cod)+(e.teste?' · teste':'')+'</b><small>'+meta+(e.est==='pago'?' · Código '+esc(e.tok||('LF-'+e.cod)):'')+'</small></span><em class="'+(e.est==='pago'?'ok':e.est==='cancelado'?'er':'')+'">'+estLabel(e)+'</em></button>'+(e.est==='pago'&&e.entregue?'<button type="button" class="cfx" data-cta="pedaval" data-id="'+esc(e.id)+'" style="display:block;min-height:44px;margin:2px 0 10px;padding:0 2px;text-align:left">Avaliar a compra ›</button>':'')}).join(''):'<div class="note">Você ainda não fez nenhum pedido.</div>';
      pedAtualiza()}
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Minha conta"><div style="display:flex;align-items:center;justify-content:space-between"><h2 style="font-size:28px">Minha conta</h2><button class="x" data-close aria-label="Fechar" style="align-self:auto">×</button></div>'+tabs+h+'</aside>');
    if(A==='perfil')gCard();if(A==='cart')mtjCarrega()};
  /* situação dos pedidos pendentes: pago, recusado ou cancelado pela loja */
  var PEDAT=0;
  function pedAtualiza(){if(Date.now()-PEDAT<8000)return;PEDAT=Date.now();var L=lsG('lf_ped',[]).filter(function(e){return e.est==='pagar'||e.est==='comp'||e.est==='recusado'||(e.est==='pago'&&!e.entregue&&Date.now()-(+e.ts||0)<120*864e5)});if(!L.length)return;
    Promise.all(L.map(function(e){return fbg('reservas/'+encodeURIComponent(e.id)).then(function(d){var o=fbd(d)||{},n=null;if(o.cancelado)n={est:'cancelado',fp:!!o.pago||e.est==='pago'};else if(o.pago&&e.est!=='pago')n={est:'pago'};if(o.pago&&o.entregue&&!o.cancelado)n=Object.assign(n||{},{entregue:true});if(!n)return 0;if(n.est!=='pago'){pedSet(e.id,n);return 1}return pedTok(e.id).then(function(t){n.tok=t||e.tok||'';pedSet(e.id,n);return 1})},function(){return 0})})).then(function(r){if(r.some(Boolean)&&st.mcAba==='peds'&&document.querySelector('#layer .mct'))minhaConta('peds')})}
  /* B1 (11/11): animações suaves da compra — abrir o carrinho (PC; o celular já desliza), trocar de passo deslizando,
     remover item deslizando, entrar em Minha conta. Tudo desligado com "reduzir movimento". */
  addEventListener('keydown',function(e){if(e.key==='Tab')document.documentElement.classList.add('kbd')});addEventListener('pointerdown',function(){document.documentElement.classList.remove('kbd')});
  var MOV=function(){return Element.prototype.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches},EZ='cubic-bezier(.2,.8,.2,1)';
  function stepN(){return st.step==='pag'?2:st.step==='ent'?1:0}
  var _bag0=bag,_ultP=-1;
  bag=function(re,pop){var antes=document.querySelector('#layer .cartp')?_ultP:-1;_bag0(re,pop);var n=stepN(),cl=document.querySelector('#layer .cartp .cl');
    if(MOV()&&cl){
      if(antes<0&&!matchMedia('(max-width:699px)').matches){var k=0;document.querySelectorAll('#layer .cartp > *, #layer .cartp .cl > *, #layer .cartp .cs').forEach(function(e){if(e.classList.contains('cgr')||e.classList.contains('cl'))return;e.animate([{transform:'translateY(14px)',opacity:0},{transform:'none',opacity:1}],{duration:420,delay:k++*60,easing:EZ,fill:'backwards'})})}
      else if(antes>=0&&n!==antes){var d=n>antes?1:-1;cl.animate([{transform:'translateX('+(d*28)+'px)',opacity:0},{transform:'none',opacity:1}],{duration:300,easing:EZ});
        var b=document.querySelectorAll('#layer .cartp .stp span b')[n];if(b)b.animate([{transform:'scale(.75)'},{transform:'scale(1.15)'},{transform:'none'}],{duration:380,easing:'ease-out'})}}
    _ultP=document.querySelector('#layer .cartp')?n:-1};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('#layer .cartp [data-rm]');if(!t||t.__lfok||!MOV())return;var ci=t.closest('.ci');if(!ci)return;
    e.preventDefault();e.stopImmediatePropagation();var h=ci.offsetHeight;
    var a=ci.animate([{opacity:1,transform:'none',height:h+'px'},{opacity:0,transform:'translateX(18px)',height:h+'px',offset:.45},{opacity:0,transform:'translateX(18px)',height:'0px',marginTop:'0px',marginBottom:'0px',paddingTop:'0px',paddingBottom:'0px'}],{duration:340,easing:'ease',fill:'forwards'});
    a.onfinish=function(){t.__lfok=1;t.click()}},true);
  var _mcAba='';
  /* B1 (11/11): entrada suave da Minha conta; na troca de aba quem anima é o trilho (S420) */
  function mcEntra(aberto){if(window.__lfTk2){_mcAba=st.mcAba;return}if(!MOV())return;
    var pn=document.querySelector('#layer [aria-label="Minha conta"]');if(!pn)return;var A=st.mcAba;
    var alvo=aberto?(A!==_mcAba?[].slice.call(pn.children).filter(function(e){return !/^(H2|DIV)$/.test(e.tagName)||!e.querySelector('h2')}).slice(1):[]):[].slice.call(pn.children);
    alvo.forEach(function(e,k){e.animate([{transform:'translateY(12px)',opacity:0},{transform:'none',opacity:1}],{duration:380,delay:k*55,easing:EZ,fill:'backwards'})});_mcAba=A}
  function mcSalvar(){var c=contaNorm(getConta())||{};document.querySelectorAll('#layer .field.bad').forEach(function(e){e.classList.remove('bad')});
    var nome=($('mn')||{value:''}).value.trim().replace(/\s+/g,' ');if(nome.length<3||nome.indexOf(' ')<0)return cfErro('Digite seu nome e sobrenome.','mn');
    var o=perfilLer(c,'mp',false);if(!o)return;Object.assign(c,o,{nome:nome});delete c.nasc;contaGrava(c).then(function(){toast('Dados salvos.');if(st.voltaPag){st.voltaPag=0;st.step='pag';bag()}})}

  /* ===== Endereço do Paraguai com as 3 travas: país fixo, cidade/departamento do Paraguai, endereço conferido ===== */
  var FLPY=FLG.py||'';
  function endForm(p,a){a=a||{};return '<label class="cfl">País</label><div class="field mcpy">'+FLPY+'<span>Paraguai</span><span aria-hidden="true">🔒</span></div>'+
    '<label class="cfl" for="'+p+'c">Cidade *</label><input class="field" id="'+p+'c" autocomplete="address-level2" placeholder="Ex.: Ciudad del Este" value="'+esc(a.cidade||'')+'"'+(a.cidade?' data-ok="'+esc(a.cidade)+'"':'')+'><div class="cfh" id="'+p+'ch" hidden></div>'+
    '<label class="cfl" for="'+p+'dp">Departamento</label><input class="field mcro" id="'+p+'dp" readonly tabindex="-1" placeholder="Preenchido pela cidade" value="'+esc(a.dep||'')+'">'+
    '<label class="cfl" for="'+p+'a">Endereço *</label><input class="field" id="'+p+'a" autocomplete="street-address" placeholder="Rua e número" value="'+esc(a.end||'')+'"'+(a.end?' data-ok="'+esc(a.end)+'"':'')+'><div class="cfh" id="'+p+'ah" hidden></div>'+
    '<label class="cfl" for="'+p+'r">Referência (opcional)</label><input class="field" id="'+p+'r" placeholder="Ex.: portão preto, ao lado da farmácia" value="'+esc(a.ref||'')+'">'}
  function hint(id,t,c){var h=$(id);if(!h)return;h.textContent=t;h.className='cfh'+(c?' '+c:'');h.hidden=!t}
  function nomi(q,py){var ctl=window.AbortController?new AbortController():null,tm=setTimeout(function(){if(ctl)ctl.abort()},7000);
    return fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1'+(py?'&countrycodes=py':'')+'&accept-language='+lgS()+'&q='+encodeURIComponent(q),{signal:ctl?ctl.signal:undefined}).then(function(r){clearTimeout(tm);if(!r.ok)throw 0;return r.json()}).then(function(a){return a&&a[0]||null})}
  function adCid(ad){return ad.city||ad.town||ad.village||ad.municipality||ad.county||''}
  /* trava 2: cidade do Paraguai, departamento automático */
  function cidPY(p){var el=$(p+'c');if(!el)return Promise.resolve(false);var v=el.value.trim().replace(/\s+/g,' ');
    if(!v){hint(p+'ch','Digite a cidade da entrega.','er');el.classList.add('bad');return Promise.resolve(false)}
    if(el.getAttribute('data-ok')===v&&$(p+'dp').value)return Promise.resolve(true);
    hint(p+'ch','Conferindo a cidade…');
    return nomi(v,true).then(function(o){if($(p+'c')!==el||el.value.trim().replace(/\s+/g,' ')!==v)return false;
      if(o){var ad=o.address||{},nm=o.name||adCid(ad)||v;el.value=nm;el.setAttribute('data-ok',nm);$(p+'dp').value=ad.state||ad.region||'';el.classList.remove('bad');hint(p+'ch','✓ Cidade do Paraguai','ok');return true}
      return nomi(v,false).then(function(o2){var cc=o2&&o2.address?String(o2.address.country_code||'').toLowerCase():'';el.setAttribute('data-ok','');$(p+'dp').value='';el.classList.add('bad');
        hint(p+'ch',cc&&cc!=='py'?(lgS()==='es'?'Esta ciudad no es de Paraguay. ':'Esta cidade não é do Paraguai. ')+semDelivery(cc).split('. ').slice(-1)[0]:'Não encontramos essa cidade no Paraguai. Confira o nome.','er');return false})},
      function(){/* sem internet: deixa seguir, a loja confere */el.setAttribute('data-ok',v);hint(p+'ch','');return true})}
  /* trava 3: endereço do Paraguai; se achar e a cidade estiver vazia, preenche cidade e departamento */
  function endPY(p){var el=$(p+'a');if(!el)return Promise.resolve(false);var v=el.value.trim();
    if(v.length<4){hint(p+'ah','Digite o endereço da entrega.','er');el.classList.add('bad');return Promise.resolve(false)}
    if(el.getAttribute('data-ok')===v)return Promise.resolve(true);
    if(/\b\d{5}-?\d{3}\b/.test(v)||/\b(brasil|brazil|argentina)\b/i.test(v)){el.classList.add('bad');hint(p+'ah',semDelivery(/argentina/i.test(v)?'ar':'br')+' '+(lgS()==='es'?'Revisa la dirección.':'Confira o endereço.'),'er');return Promise.resolve(false)}
    var cid=($(p+'c')||{value:''}).value.trim();hint(p+'ah','Conferindo o endereço…');
    return nomi(v+(cid?', '+cid:''),true).then(function(o){if($(p+'a')!==el||el.value.trim()!==v)return false;
      if(o){var ad=o.address||{},c=$(p+'c');if(c&&!c.value.trim()&&adCid(ad)){c.value=adCid(ad);c.setAttribute('data-ok',c.value);$(p+'dp').value=ad.state||'';hint(p+'ch','✓ Cidade do Paraguai','ok')}
        el.setAttribute('data-ok',v);el.classList.remove('bad');hint(p+'ah','✓ Endereço encontrado no Paraguai','ok');return true}
      return nomi(v,false).then(function(o2){var cc=o2&&o2.address?String(o2.address.country_code||'').toLowerCase():'';
        if(cc&&cc!=='py'){el.classList.add('bad');hint(p+'ah',semDelivery(cc)+' '+(lgS()==='es'?'Revisa la dirección.':'Confira o endereço.'),'er');return false}
        /* não achou no mapa (rua pequena): segue, a loja confere pelo telefone */
        el.setAttribute('data-ok',v);el.classList.remove('bad');hint(p+'ah','Não achamos no mapa, mas tudo bem: confira se está certo.','');return true})},
      function(){el.setAttribute('data-ok',v);hint(p+'ah','');return true})}
  document.addEventListener('focusout',function(e){var t=e.target;if(!t||!t.id)return;var m=/^(m|e)(c|a)$/.exec(t.id);if(!m||!t.value.trim())return;if(m[2]==='c')cidPY(m[1]);else endPY(m[1])});
  document.addEventListener('input',function(e){var t=e.target;if(!t||!t.id)return;var m=/^(m|e)(c|a)$/.exec(t.id);if(!m)return;t.setAttribute('data-ok','');t.classList.remove('bad');hint(t.id+'h','');if(m[2]==='c'){var d=$(m[1]+'dp');if(d)d.value=''}});
  function endLe(p){return Promise.all([cidPY(p),endPY(p)]).then(function(r){if(!r[0]||!r[1])return null;return {cidade:$(p+'c').value.trim(),dep:$(p+'dp').value.trim(),end:$(p+'a').value.trim(),ref:($(p+'r')||{value:''}).value.trim()}})}
  function mcEndSalvar(i){var c=contaNorm(getConta());var bt=document.querySelector('[data-cta=mcendok]');if(bt&&bt.disabled)return;if(bt)bt.disabled=true;
    endLe('m').then(function(a){if(bt)bt.disabled=false;if(!a){cfErro('Confira os campos em vermelho.');return}a.nome=($('mnm')||{value:''}).value.trim()||'Endereço';
      if(i==='novo'){a.id='e'+Date.now().toString(36);c.ends.push(a)}else{a.id=(c.ends[+i]||{}).id||('e'+Date.now().toString(36));c.ends[+i]=a}
      contaGrava(c).then(function(){toast('Endereço salvo.');minhaConta('ends')})})}

  /* ===== Pedido: Carrinho → (conta) → Entrega → Pagamento (07/11/2026) ===== */
  /* B1 (11/11): ícones oficiais — Pix (marca oficial, simple-icons CC0) e Lucide (ISC) em cinza; nada desenhado à mão */
  var LU=function(d){return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};
  var CKI={loja:LU('<path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/>'),
    delivery:LU('<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>'),
    alias:LU('<path d="M10 18v-7"/><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>'),
    pin:LU('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>'),
    pix:'<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="#32BCAD" d="M5.283 18.36a3.505 3.505 0 0 0 2.493-1.032l3.6-3.6a.684.684 0 0 1 .946 0l3.613 3.613a3.504 3.504 0 0 0 2.493 1.032h.71l-4.56 4.56a3.647 3.647 0 0 1-5.156 0L4.85 18.36ZM18.428 5.627a3.505 3.505 0 0 0-2.493 1.032l-3.613 3.614a.67.67 0 0 1-.946 0l-3.6-3.6A3.505 3.505 0 0 0 5.283 5.64h-.434l4.573-4.572a3.646 3.646 0 0 1 5.156 0l4.559 4.559ZM1.068 9.422 3.79 6.699h1.492a2.483 2.483 0 0 1 1.744.722l3.6 3.6a1.73 1.73 0 0 0 2.443 0l3.614-3.613a2.482 2.482 0 0 1 1.744-.723h1.767l2.737 2.737a3.646 3.646 0 0 1 0 5.156l-2.736 2.736h-1.768a2.482 2.482 0 0 1-1.744-.722l-3.613-3.613a1.77 1.77 0 0 0-2.444 0l-3.6 3.6a2.483 2.483 0 0 1-1.744.722H3.791l-2.723-2.723a3.646 3.646 0 0 1 0-5.156"/></svg>'};
  function cki(k){return '<span class="cki">'+CKI[k]+'</span>'}
  function entCampos(){var c=$('ec');if(c)st.endD={cidade:c.value,dep:($('edp')||{value:''}).value,end:($('ea')||{value:''}).value,ref:($('er')||{value:''}).value,ok:c.getAttribute('data-ok')}}
  function entHtml(c){var ent=st.ent==='delivery'?'delivery':'loja',E=(c&&c.ends)||[],i=Math.min(st.endIdx|0,Math.max(E.length-1,0)),h;
    h='<div class="note"><b style="color:var(--tx)">Como você recebe?</b></div>'+
      '<button type="button" class="cfo'+(ent==='loja'?' on':'')+'" data-ent="loja" aria-pressed="'+(ent==='loja')+'">'+cki('loja')+'<b>Retirar na loja</b><small>Venha quando quiser, seg a sáb, 7h30 às 15h</small></button>'+
      '<button type="button" class="cfo'+(ent==='delivery'?' on':'')+'" data-ent="delivery" aria-pressed="'+(ent==='delivery')+'">'+cki('delivery')+'<b>Delivery</b><small>'+LFI.tr('Só no Paraguai. Escolha a transportadora e o frete entra no total.')+'</small></button>';
    if(ent!=='delivery')return h;
    if(E.length&&st.endMode!=='novo')return h+'<label class="cfl">Endereço de entrega</label>'+E.map(function(a,k){return '<button type="button" class="cfo'+(k===i?' on':'')+'" data-cta="endpick" data-i="'+k+'" aria-pressed="'+(k===i)+'">'+cki('pin')+'<b>'+esc(a.nome||'Endereço')+'</b><small>'+endLinha(a)+'</small></button>'}).join('')+'<button type="button" class="cfx" data-cta="endnovo" style="width:100%;text-align:center">+ Outro endereço</button>'+trHtml();
    var d=st.endD||{};
    return h+'<div class="cfc">'+endForm('e',{cidade:d.cidade,dep:d.dep,end:d.end,ref:d.ref})+
      
      (E.length?'<button type="button" class="cfx" data-cta="endsalvo">Usar um endereço salvo</button>':'')+'</div>'+trHtml()}
  function confHtml(c){if(!c)return '';var ed=c.email||(sessG()||{}).email||'',ct=[esc(ed),esc(c.tel||'')].filter(Boolean).join(' · '),
      en=st.ent==='delivery'&&st.entD?'<b>'+LFI.tr('Delivery')+'</b><span>'+endLinha(st.entD)+'</span>':'<b>'+LFI.tr('Retirar na loja')+'</b><span>'+LFI.tr('Galeria Jebai Center, 3º piso · seg a sáb, 7h30 às 15h')+'</span>';
    return '<div class="cfa"><h3>'+LFI.tr('Confira antes de pagar')+'</h3>'+
      '<div class="cfr"><small>'+LFI.tr('Seus dados')+'</small><div class="cfv"><b>'+esc(c.nome||'')+'</b><span>'+ct+'</span></div><button type="button" class="cfe" data-cta="cfedados">'+LFI.tr('Editar')+' <i>›</i></button></div>'+
      '<div class="cfr"><small>'+LFI.tr('Entrega')+'</small><div class="cfv">'+en+'</div><button type="button" class="cfe" data-cta="voltarent">'+LFI.tr('Editar')+' <i>›</i></button></div></div>'}
  function pagHtml(c){var pg=st.pag,h=confHtml(c)+'<div class="note"><b style="color:var(--tx)">Forma de pagamento</b></div>'+
      '<button type="button" class="cfo'+(pg==='pix'?' on':'')+'" data-cta="pg" data-v="pix" aria-pressed="'+(pg==='pix')+'">'+cki('pix')+'<b>PIX</b><small>Em reais, pelo app do banco.</small></button>'+
      '<button type="button" class="cfo'+(pg==='alias'?' on':'')+'" data-cta="pg" data-v="alias" aria-pressed="'+(pg==='alias')+'">'+cki('alias')+'<b>Transferência Banco Familiar (Paraguai)</b><small>Em guaranis, pelo alias.</small></button>';
    if(pg&&(!c.tel||!c.doc))h+='<div class="cfc">'+perfilCampos(c,'pp','falta')+'<small class="cfh" style="display:block">Pedimos uma vez só; fica salvo no seu Perfil.</small></div>';
    return h}
  function irPag(){var c=contaNorm(getConta());if(!c){AUTH_VOLTA=true;cadastrarTela();return}
    if(st.ent!=='delivery'){st.entD=null;st.step='pag';bag();return}
    if(!st.tr||!trOk(st.tr)){toast(LFI.tr('Escolha a transportadora.'));var tl=document.querySelector('#layer .ctr');if(tl)tl.scrollIntoView({block:'center',behavior:'smooth'});return}
    var E=c.ends||[];if(E.length&&st.endMode!=='novo'){st.entD=E[Math.min(st.endIdx|0,E.length-1)];st.step='pag';bag();return}
    var bt=document.querySelector('[data-cta=irpag]');if(bt&&bt.disabled)return;if(bt)bt.disabled=true;
    endLe('e').then(function(a){if(bt)bt.disabled=false;if(!a){toast('Confira os campos em vermelho.');return}
      st.entD=a;if(!E.some(function(x){return x.end===a.end&&x.cidade===a.cidade})){c.ends=E.concat([Object.assign({id:'e'+Date.now().toString(36),nome:E.length?'Endereço '+(E.length+1):'Casa'},a)]);st.endIdx=c.ends.length-1;st.endMode='';contaGrava(c)}
      st.step='pag';bag()})}
  function enviarPedido(retry){
    var c=contaNorm(getConta());if(!sessG()||!c){AUTH_VOLTA=true;cadastrarTela();return}st.nome=c.nome;
    var ks=Object.keys(st.cart);if(!ks.length&&!retry)return;
    if(!retry){if(!st.pag){toast('Escolha PIX ou Transferência Banco Familiar.');return}
      document.querySelectorAll('#layer .field.bad').forEach(function(e){e.classList.remove('bad')});
      if($('ppz')||$('ppd')){var o=perfilLer(c,'pp',true);if(!o)return;Object.assign(c,o);contaGrava(c)}
      if(!c.tel||!c.doc){bag(true);toast('Complete telefone e documento.');return}}
    st.zap=c.tel;
    var ent=st.ent==='delivery'?'delivery':'loja',E=st.entD;if(ent==='delivery'&&!E&&!retry){st.step='ent';bag();return}
    var id=st.pkid&&retry?st.pkid:(Date.now().toString(36)+Math.random().toString(36).slice(2,7));st.pkid=id;
    var cod=id.slice(-4).toUpperCase(),pag=st.pag==='pix'?'pix':'alias';
    var txt='PEDIDO '+cod+'\n'+mensagem('reserva'),wa='https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(txt);
    var ff=st.rosto?FACES.filter(function(x){return x.id===st.rosto})[0]:null;
    /* cupom: antes de mandar o pedido, o Firebase confere e reserva o código (não vale de novo até o app confirmar ou cancelar) */
    if(!retry&&(descVale()==='cup'||(window.__lfPres&&__lfPres.ativo()))&&st._cupOk!==id){var bt1=document.querySelector('[data-send]');if(bt1)bt1.disabled=true;
      cupFn({acao:'usar',cod:st.cup.cod,pid:id,tel:c.tel||'',email:c.email||'',total:Math.round(bruto()+(window.__lfPres&&__lfPres.ativo()?__lfPres.n():0)),desc:Math.round(window.__lfPres&&__lfPres.ativo()?__lfPres.n():cupInfo().d)}).then(function(j){if(bt1)bt1.disabled=false;
        if(j&&j.ok){st._cupOk=id;enviarPedido(retry);return}cupTira();toast(cupMsg(j&&j.motivo,j&&j.cupom));bag(true)},function(){if(bt1)bt1.disabled=false;toast(LFI.tr('Não deu para conferir o código agora. Tente de novo.'))});return}
    var CI=cupInfo(),DV=descVale(),doc=st.pkdoc&&retry?st.pkdoc:(function(){var fr=ent==='delivery'?freteG():0,base=Math.round(total())+fr,vb0=TESTE?1:valorBRL()+(fr?Math.max(5,Math.round(fr/(window.LF_RATE?window.LF_RATE():1400)/5)*5):0);
      return Object.assign({ts:Date.now(),nome:c.nome,tel:c.tel,pais:c.pais||'',cod:cod,lang:(window.LFI&&LFI.lang)||'pt',moeda:(window.LFI&&LFI.cur)||'',total:base,rosto:ff?ff.nome:'',
      nac:c.nac||'',doc:c.doc||'',nasc:'',email:c.email||'',/* S192: transportadora e frete vão no obsC (as regras atuais do Firestore já aceitam) */obsC:[c.nac==='py'&&c.ruc?'RUC '+c.ruc:'',ent==='delivery'&&st.tr?'Transportadora: '+trNome(st.tr)+(fr?' · frete Gs. '+fr.toLocaleString('es-PY'):' · frete na entrega'):''].filter(Boolean).join(' · ').slice(0,190),cidade:E?E.cidade:'',end:'',ent:ent,
      endE:ent==='delivery'&&E?E.end+', '+E.cidade+(E.dep?' · '+E.dep:''):'',refE:ent==='delivery'&&E?E.ref||'':'',depE:ent==='delivery'&&E?E.dep||'':'',
      
      /* esboço 39 (aprovado 21/11): o valor a pagar é o preço exato do carrinho — PIX = brl, Banco Familiar = total; a nuvem acha o pagamento pelo valor exato */pag:pag,brl:vb0,teste:!!TESTE,
      itens:ks.map(function(k){var p=find(k);return {ref:p.ref,nome:p.nome,q:st.cart[k],cor:(p.cores&&p.cores.length>1)?corNome(p,st.cor[k]||0):'',grau:(p.gr&&p.gr.length)?p.gr[st.gr[k]||0]:'',preco:Math.round(p.n-(DV==='cup'?(CI.por[k]||0):0)/st.cart[k]),l2:0/* o app ainda lê o campo */,cd:DV==='cup'?CI.por[k]||0:0,pv:pvLin(p.n-(DV==='cup'?(CI.por[k]||0):0)/st.cart[k],st.cart[k])}}).concat(window.__lfPres?__lfPres.item():[])},window.__lfPres&&__lfPres.ativo()?{cup:st.cup.cod,cupd:__lfPres.n()}:DV==='cup'&&st.cup?{cup:st.cup.cod,cupd:CI.d}:{})})();
    st.pkdoc=doc;
    if(!retry)lsS('lf_ent',ent==='delivery'?{ent:'delivery',tr:st.tr||'',i:st.endIdx|0}:{ent:'loja'});
    pkTela('<div class="pkl"></div><div class="pkc"><div class="pks"></div></div><h2 style="animation-delay:0s">Enviando seu pedido…</h2>').className='pkw0';
    var rxo=null;
    (CFG.reserva===true?resCall('reservar',id,resItens(doc.itens),null,{pag:pag}):Promise.resolve(null)).then(function(rr){
      if(rr&&rr.ok===false&&rr.motivo==='esgotado'){var err=new Error('esgotado');err.falta=rr.falta||[];throw err}
      if(rr&&rr.ok&&!rr.off&&rr.exp)rxo={rx:rr.exp,rd:(rr.agora||Date.now())-Date.now(),vip:!!rr.vip};
      return pkEnviar2(doc,id)}).then(function(){
      var L=lsG('lf_ped',[]);if(!L.some(function(e){return e.id===id}))L.push({id:id,cod:cod,tel:c.tel||'',ts:doc.ts,total:doc.total,brl:doc.brl,ent:ent,pag:pag,est:'pagar',teste:!!TESTE,rx:rxo?rxo.rx:0,rd:rxo?rxo.rd:0,vip:!!(rxo&&rxo.vip),itens:doc.itens.map(function(i){return {ref:i.ref,nome:i.nome,q:i.q,cor:i.cor}})});lsS('lf_ped',L.slice(-30));
      if(doc.cup)cupTira();
      /* S400 (17/11, esboços 59a–59f): o cartão de desconto NÃO aparece mais em tela nenhuma do pagamento; o presente chega por e-mail depois da entrega */cupFn({acao:'proxima',pid:id,tel:c.tel||'',email:c.email||'',nome:c.nome||'',lang:LFI.lang}).then(function(){},function(){});
      st.cart={};st.pkid='';st.pkdoc=null;st.step='cart';st.pag='';try{drawBag()}catch(_){}
      closeLayer();pkPagar(id)
    },function(er){
      if(er&&er.message==='esgotado'){resEsgotou(er.falta,doc);return}
      pkTela('<div class="pkl"></div><h2 style="animation-delay:0s">Quase lá!</h2><div class="pkt" style="animation-delay:.1s"><span>Não deu para enviar o pedido agora. Tente de novo ou fale com a loja pelo WhatsApp.</span></div><div class="pkb" style="animation-delay:.2s"><a class="pkw" target="_blank" rel="noopener" href="'+wa+'">'+PK_WA+'Enviar pelo WhatsApp</a><button type="button" data-pkretry>Tentar de novo</button></div><div class="pkcod">'+LFI.tr('código do erro')+': '+esc(pkCodErro(er))+'</div>')})};
  /* tela de pagar: PIX (automático) ou Banco Familiar (alias + comprovante) */
  function pkPagar(id){
    var e=pedGet(id);if(!e){return}window.__pgid=id;
    var pix=e.pag==='pix',vg=e.total;
    /* S318 (14/11/2026 23:00, esboços work/s316 aprovados): linhas de recibo (rótulo à esquerda, valor à direita) no lugar do total gigante; uma ação cheia;
       o fio dourado é a reserva; voltar "‹ Minha conta" no padrão do site; comprovante e ajuda em linhas; cancelar foi para Minha conta › Pedidos */
    var L=function(r,v,cp){return '<div class="zr"><span>'+r+'</span><span class="zk"><b>'+esc(v)+'</b>'+(cp!=null?'<button type="button" data-pgc2="'+esc(cp)+'">Copiar</button>':'')+'</span></div>'};
    var timer=resLeft(e)>0&&e.est==='pagar'&&e.vip?'<div class="zr" id="cdx"><span><em class="zvip">✦</em>'+LFI.tr('Reserva VIP até')+'</span><span class="zk"><b>'+new Date(e.rx-(e.rd||0)).toLocaleTimeString(LFI.lang==='es'?'es-PY':'pt-BR',{hour:'2-digit',minute:'2-digit'})+'</b></span></div>':resLeft(e)>0&&e.est==='pagar'?'<div class="zr" id="cdx"><span>Reservada para você por</span><span class="zk"><b id="cdxt">--:--</b></span></div><div class="zf"><i id="cdxb"></i></div>':'';
    var SETA='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
    var jap='<div id="pgcl" hidden><label class="zA" for="pgf" id="pgbtn"><span>Enviar comprovante</span>'+SETA+'</label></div>';
    var fim='<input type="file" id="pgf" accept="image/*" hidden>'+
      '<a class="zA" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(LFI.lang==='es'?'¡Hola! Tengo una duda sobre el pago de mi pedido '+e.cod:'Olá! Tenho uma dúvida sobre o pagamento do meu pedido '+e.cod)+'"><span>Precisa de ajuda? Fale com a loja</span>'+SETA+'</a></div>'+
      '<p class="tm">Ao pagar, você confirma a compra e aceita os <a href="/termos.html" target="_blank" rel="noopener">Termos e Condições</a>.</p></div>';
    var cab=pzBar()+'<div class="zw"><h2 style="animation-delay:0s">'+(pix?'Pague com PIX':'Transferência Banco Familiar')+'</h2><p class="zn"><span>Pedido</span> '+esc(e.cod||'')+'</p>'+(e.teste?'<div class="pgt">MODO TESTE</div>':'');
    if(pix)pkTela(cab+'<div class="zc"><div class="zG"><div class="zE">'+L('Valor',brl(e.brl))+timer+
      '<div class="zm"><p class="zl d">Prefere copiar? Cole no app do banco, em “Pix copia e cola”.</p><button type="button" class="zP" data-pgcopy>Copiar código PIX</button><p class="zl m">Cole no app do seu banco, em “Pix copia e cola”. O valor já vai no código.</p></div></div>'+
      '<div class="zQ"><span class="zqt m">Vai pagar por outro aparelho? Leia o QR com o app do banco.</span><button type="button" class="zqb" data-pzqr aria-label="Ampliar o QR"><span class="pgq" id="pgq"></span></button><span class="zqt d">Abra o app do seu banco no celular e leia o QR.</span></div></div></div>'+
      '<div class="zs"><span class="spn"></span><span>Confirmamos sozinhos assim que o PIX chegar.</span></div><div class="za">'+jap+fim).className='pgw0 py pz';
    else pkTela(cab+'<div class="zc"><ol class="zpas"><li>'+LFI.tr('Abra o app do seu banco e escolha <b>Transferir por alias</b>.')+'</li><li>'+LFI.tr('Tipo de alias: <b>Celular</b>. Cole o número abaixo.')+'</li><li>'+LFI.tr('Digite o <b>valor exato</b> e confirme.')+'</li></ol>'+L('Valor exato','Gs. '+mil(vg),String(Math.round(vg)))+L('Alias (celular)',ITAU.alias,ITAU.alias)+L('Titular',ITAU.titular+' · Banco Familiar')+timer+
      /* S400 (esboços 59a/59b): passo a passo em 3 linhas; sem botão ao abrir; depois de 2 min o aviso muda e aparece "Enviar comprovante" */'<div class="zm"><p class="zl m" style="display:block;margin:0">Depois de transferir, volte para esta tela.</p></div></div>'+
      '<div class="zs"><span class="spn"></span><span>Aguardando sua transferência…</span></div><div class="za">'+jap+fim).className='pgw0 py pz';
    pzTopo();
    if(pix){var code=pixCode(e.brl,'LF'+e.cod);e.code=code;loadQr().then(function(){var q=$('pgq');if(q&&window.LFqr)q.innerHTML=LFqr.svg(code,240)}).catch(function(){var q=$('pgq');if(q)q.innerHTML='<div class="pgw">Não consegui desenhar o QR. Use o botão "Copiar código PIX".</div>'})}
    window.__pgcode=pix?pixCode(e.brl,'LF'+e.cod):'';
    /* S400 (17/11, esboços 59b/59c): 2 minutos depois do pedido, PIX e transferência fazem o mesmo — o aviso passa a dizer que a confirmação
       está demorando e aparece a linha "Enviar comprovante" (entra com o movimento suave e o brilho dourado do S320) */
    {var pgW=Math.max(0,120000-(Date.now()-(+e.ts||Date.now())));clearTimeout(window.__pgclT);window.__pgclT=setTimeout(function(){var x=$('pgcl'),o=$('pkok');if(!x||!o)return;var z=o.querySelector('.zs');if(z)z.innerHTML='<span class="spn"></span><span>'+LFI.tr(pix?'A confirmação está demorando mais que o normal. Se você já pagou, envie o comprovante.':'A confirmação está demorando mais que o normal. Se você já transferiu, envie o comprovante.')+'</span>';if(pgW>0)x.classList.add('zin');x.hidden=false},pgW)}
    resRelogio(id);
    pkPoll(id,function(o){
      if(o.cancelado){pedSet(id,{est:'cancelado'});pkStop();pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Pedido cancelado pela loja</h2><div class="pkt"><span>Este pedido foi cancelado e as peças voltaram para o site. Dúvidas? Fale com a loja pelo WhatsApp.</span></div><div class="pkb"><button type="button" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0';return}
      if(o.pago){pkOk(id,o);return}
      if(o.recusado&&e.est==='comp'){pedSet(id,{est:'pagar'});e.est='pagar'}})};
  /* ===== v451 (aprovado 07/11/2026): página inicial nova, menu só no botão, busca na lupa, rodapé, eventos,
     guia, avaliações (só de quem comprou) e estojo/flanela. O evento só muda a aparência: preço e oferta são os de sempre. ===== */
  document.documentElement.classList.add('v5');
  var V5={tab:'',di:0,tm:0,hov:false};
  function fnUrl(n){return 'https://southamerica-east1-'+FB.p+'.cloudfunctions.net/'+n}
  function vis5(p){return p&&p.tipo!=='acessorio'&&!p.oculto}
  function cat5(){return P.filter(vis5)}
  function pct5(p){return isOf(p)?Math.round((1-p.n/p.de)*100):0}
  function nomeEm(n){var w=String(n||'').trim().split(' ');if(w.length<2)return esc(n);var u=w.pop();return esc(w.join(' '))+' <em>'+esc(u)+'</em>'}
  var ACCI={'ACC-FLANELA':'<svg viewBox="0 0 200 150" aria-hidden="true"><path d="M45 35h110l-8 80H53z" fill="#cfd6dc"/><path d="M45 35l10 80M65 35l7 80M85 35l4 80M105 35l1 80M125 35l-2 80M145 35l-5 80" stroke="#b7c0c8" stroke-width="2"/></svg>',def:'<svg viewBox="0 0 200 150" aria-hidden="true"><rect x="28" y="48" width="144" height="58" rx="29" fill="#2a2d33"/><rect x="28" y="48" width="144" height="26" rx="13" fill="#3a3e46"/><path d="M28 77h144" stroke="#8d3a69" stroke-width="3"/></svg>'};
  function accIco(p){return ACCI[p.ref]||ACCI.def}
  var _vis5=vis;vis=function(p,w){return p&&p.tipo==='acessorio'&&!p.foto?accIco(p):_vis5(p,w)};
  function img5(p){if(p&&p.tipo==='acessorio'&&!p.foto)return accIco(p);return p&&p.foto?'<img src="'+p.foto+'" alt="'+esc(p.nome)+'" loading="lazy" draggable="false">':''}
  function prc5(p){return p.aviso==='Esgotado'?LFI.tr('Esgotado'):(isOf(p)?'<s>'+fmt(p.de)+'</s>':'')+fmt(p.n)}
  function rostoAtual(){if(st.rosto)return st.rosto;try{return localStorage.getItem('lf_rosto5')||''}catch(_){return ''}}
  function rostoNome(id){var f=FACES.filter(function(x){return x.id===id})[0];return f?f.nome.toLowerCase():id}
  var NUM5=function(){return (typeof NUM_LOJA!=='undefined'&&NUM_LOJA)||'595983642241'};

  /* ---- eventos ---- */
  var EVD={
    natal:{bar:'🎄 Natal La Fouch · presentes com retirada no mesmo dia',lab:'NATAL',h:'Presenteie estilo neste <em>Natal</em>',sub:'Ideias de presente · retirada no mesmo dia em Ciudad del Este',deco:'🎄',b2:'Ver presentes'},
    halloween:{bar:'🎃 Semana de Halloween na La Fouch',lab:'HALLOWEEN',h:'Olhar <em>misterioso</em>',sub:'Solares escuros e armações gatinho',deco:'🦇',b2:'Ver a seleção'},
    bf:{bar:'⚡ BLACK FRIDAY · ofertas em toda a loja',lab:'SÓ ESTA SEMANA',h:'BLACK <em>FRIDAY</em>',sub:'Estoque limitado: quando acaba, acabou',deco:'',b2:'Ver ofertas',cd:1},
    maes:{bar:'🌷 Dia das Mães La Fouch · presentes com retirada no mesmo dia',lab:'DIA DAS MÃES',h:'Um presente com <em>carinho</em>',sub:'Para a sua mãe · retirada no mesmo dia em Ciudad del Este',deco:'🌷',b2:'Ver presentes'},
    pais:{bar:'Dia dos Pais La Fouch · presentes com retirada no mesmo dia',lab:'DIA DOS PAIS',h:'Estilo para o seu <em>pai</em>',sub:'Para o seu pai · retirada no mesmo dia em Ciudad del Este',deco:'',b2:'Ver presentes'},
    anonovo:{bar:'✨ Ano Novo · comece o ano com um novo olhar',lab:'ANO NOVO',h:'Ano novo, <em>novo olhar</em>',sub:'Dourados e clássicos para receber o ano com estilo',deco:'🥂',b2:'Ver catálogo'}
  };
  function evAtivo(){var e=CFG.evento;if(!e||typeof e!=='object'||!EVD[e.tema])return null;var t=Date.now();if(+e.ini>0&&t<+e.ini)return null;if(+e.fim>0&&t>+e.fim)return null;return e}
  function evNoite(){var d=new Date(),m=d.getHours()*60+d.getMinutes();return m>=19*60+30||m<6*60}
  function evAplica(){
    var e=evAtivo(),r=document.documentElement,t=e?e.tema:'';
    if(t==='anonovo')t=evNoite()?'anonovo-n':'anonovo-d';
    if(t)r.setAttribute('data-ev',t);else r.removeAttribute('data-ev');
    var b=$('evbar');if(!b){b=document.createElement('div');b.id='evbar';var tp=document.querySelector('.top');tp.insertBefore(b,tp.firstChild)/* S430: a faixa é a 1ª linha do próprio topo — andam juntos, nunca um cobre o outro */}
    var tx=e?(e.bar||EVD[e.tema].bar):'';if(e&&e.tema==='anonovo'&&!e.bar){var y=new Date().getFullYear()+(new Date().getMonth()===0?0:1);tx='✨ Ano Novo · comece '+y+' com um novo olhar'}
    if(b._t!==tx){b._t=tx;b.textContent=tx}
    return e}
  setInterval(function(){if(!document.hidden){var a=document.documentElement.getAttribute('data-ev')||'';evAplica();if(a!==(document.documentElement.getAttribute('data-ev')||''))homeDraw();cdTick()}},30000);
  function dd(n){return (n<10?'0':'')+n}
  function cdAlvo(e){if(!e)return 0;if(EVD[e.tema].cd&&+e.fim>Date.now())return +e.fim;
    if(e.tema==='anonovo'){var d=new Date();if(d.getMonth()===11&&d.getDate()===31&&d.getHours()>=12){var m=new Date(d.getFullYear()+1,0,1,0,0,0);return m.getTime()}}return 0}
  function cdHtml(e){var a=cdAlvo(e);
    if(e&&e.tema==='anonovo'){var d=new Date();if(d.getMonth()===0&&d.getDate()===1)return '<p class="hsub" style="font-size:18px;font-weight:700">¡Feliz '+d.getFullYear()+'! 🥂</p>'}
    if(!a)return '';var s=Math.max(0,Math.floor((a-Date.now())/1000)),D=Math.floor(s/86400),H=Math.floor(s%86400/3600),M=Math.floor(s%3600/60);
    if(e.tema==='anonovo')return '<p class="hsub" data-cd>'+LFI.tr('Faltam')+' '+H+' h '+dd(M)+' min '+LFI.tr('para')+' '+(new Date().getFullYear()+1)+'</p>';
    return '<div class="hcd" data-cd>'+(D?'<div><b>'+dd(D)+'</b><small>'+LFI.tr('DIAS')+'</small></div>':'')+'<div><b>'+dd(H)+'</b><small>'+LFI.tr('HORAS')+'</small></div><div><b>'+dd(M)+'</b><small>MIN</small></div></div>'}
  function cdTick(){var c=document.querySelector('#home [data-cd]');if(!c)return;var t=document.createElement('div');t.innerHTML=cdHtml(evAtivo());var n=t.firstElementChild;if(n)c.replaceWith(n);else c.remove()}

  /* ---- destaque (os mesmos modos do painel: produto, automático, slides, vídeo) ---- */
  function dstItens(){
    var m=CFG.dmodo||(CFG.video?'video':CFG.destaque?'produto':'nada'),ok=function(p){return vis5(p)&&p.aviso!=='Esgotado'},L=[],pus=function(p){if(p&&ok(p)&&L.indexOf(p)<0&&L.length<4)L.push(p)};
    if(m==='slide')String(CFG.slide||'').split(',').forEach(function(r){if(r&&r.indexOf('media/')!==0)pus(find(r))});
    if(m==='produto')pus(find(CFG.destaque||''));
    if(m==='auto')dstAuto().forEach(function(x){pus(x.p)});
    String(CFG.dauto||'').split(',').forEach(function(r){if(r)pus(find(r))});
    cat5().filter(function(p){return p.foto}).sort(function(a,b){return (b.cad||0)-(a.cad||0)}).forEach(pus);
    return L}
  /* S172-A (aprovado 11/11/2026): destaque automático com 4 vagas, cada uma por um motivo — Girar (a que mais precisa
     girar, lista dauto que o app manda), Mais vendido (mv), Novidade (cad) e Tema (o do calendário ou o que começa em até
     20 dias). Regras do painel em config/site.dreg: tema (seguir o tema), foto (só com foto; prefere 360°), nunca (códigos),
     fixa + ate (fixar uma peça até a data). O MESMO cálculo está no painel (admin.html, dstAutoP). */
  var DST_TEMA={natal:function(p){return p.tipo==='grau'},maes:function(p){return p.gen==='f'},pais:function(p){return p.gen==='m'},bf:function(p){return isOf(p)},anonovo:function(p){return p.tipo==='solar'},halloween:function(p){return p.tipo==='solar'}};
  function dstTemaProx(){var e=null;try{e=evAtivo()}catch(_){}if(e)return {tema:e.tema,ini:+e.ini||0,ja:1};var ag=Date.now(),r=null;try{calProx(ag).L.forEach(function(x){if(!r&&x.ini>ag&&x.ini-ag<=20*864e5&&EVD[x.tema]&&calSt(CFG,x)==='auto')r={tema:x.tema,ini:x.ini}})}catch(_){}return r}
  function dstAuto(){var R=CFG.dreg||{},nun={},us={},out=[],ag=Date.now();String(R.nunca||'').split(',').forEach(function(r){r=r.trim();if(r)nun[r]=1});
    var ok=function(p){return p&&vis5(p)&&p.aviso!=='Esgotado'&&!nun[p.ref]&&!us[p.ref]&&(R.foto===false||!!p.foto)&&!catRank(p)};
    var put=function(p,v,mot){if(ok(p)&&out.length<4){us[p.ref]=1;out.push({p:p,v:v,mot:mot||''})}};
    var pre=function(l){if(R.foto===false)return l;var g=l.slice(0,3).filter(function(p){return p.gv});return g.length?g.concat(l.filter(function(p){return g.indexOf(p)<0})):l};
    if(R.fixa&&(!(+R.ate>0)||ag<=+R.ate))put(find(R.fixa),'fixa');
    var gir=pre(String(CFG.dauto||'').split(',').map(function(r){return find(r)}).filter(ok));
    put(gir[0],'girar',(CFG.dmot||{})[gir[0]&&gir[0].ref]);
    var C=cat5().filter(ok);
    /* S186: 2ª vaga = Girar de OUTRA categoria (as paradas) */var g0=out[out.length-1];put(gir.filter(function(p){return ok(p)&&(!g0||p.tipo!==g0.p.tipo)})[0]||C.filter(function(p){return !g0||p.tipo!==g0.p.tipo}).sort(function(a,b){return (b.est||0)-(a.est||0)})[0],'girar');
    put(pre(cat5().filter(ok).sort(function(a,b){return (b.cad||0)-(a.cad||0)}))[0],'nov');
    var t=R.tema===false?null:dstTemaProx(),tf=t&&DST_TEMA[t.tema];
    if(tf){/* S186: peça do tema que NÃO vendeu */var tl=cat5().filter(function(p){return ok(p)&&tf(p)}).sort(function(a,b){return (a.mv>0?1:0)-(b.mv>0?1:0)||(b.est||0)-(a.est||0)});put(tl[0],'tema',t.tema)}
    gir.forEach(function(p){put(p,'girar',(CFG.dmot||{})[p.ref])});
    C.sort(function(a,b){return (b.est||0)-(a.est||0)}).forEach(function(p){put(p,'girar')});
    return out}
  window.__lfDstAuto=function(){return dstAuto().map(function(x){return {ref:x.p.ref,v:x.v,mot:x.mot}})};
  function dstHtml(){
    var e=evAtivo(),ed=e?EVD[e.tema]:null,L=dstItens(),i=Math.min(V5.di,Math.max(0,L.length-1)),p=L[i],vid=(CFG.dmodo==='video'&&CFG.video)?CFG.video:'';
    if(!p&&!vid)return '';
    if(p){try{window.__lfDv&&window.__lfDv(p.ref)}catch(_){}}
    var lab=ed?(((e&&e.lab)||ed.lab)+(e.tema==='natal'?' '+new Date().getFullYear():e.tema==='anonovo'?' '+(new Date().getFullYear()+(new Date().getMonth()===0?0:1)):'')):'DESTAQUE DA SEMANA';
    var tit=e&&e.th?e.th:e&&e.tit?esc(e.tit):(ed?ed.h:nomeEm(p?nomeSC(p):'')),sub=e&&e.sub?esc(e.sub):(ed?ed.sub:'');
    var gv=p&&p.gv&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'/'+String(p.gv).replace(/^\/+/,''):'';
    /* 22/11 (bug do dono: o Destaque piscava): a foto do destaque é decidida ANTES de aparecer. Se a cor que vai ser mostrada ainda não chegou,
       o lugar fica vazio até ela chegar (antes aparecia a foto da 1ª cor e era trocada em seguida); se ela não vier, entra a foto principal. */
    var hci=p?melhorCor(p):0,temC=!!(p&&hci&&p.fc&&p.fc[hci]),espC=!!(p&&hci&&!temC&&p.lib),pF=temC?Object.assign({},p,{foto:p.fc[hci]}):p;
    if(espC)colorFoto(p,hci,function(u){var im=document.querySelector('#hdst[data-hcor="'+hci+'"] .hdi img');if(im&&!im.getAttribute('src'))im.src=u||p.foto||''});
    var imgD=espC?'<img class="pf" alt="'+esc(p.nome)+'" draggable="false">':img5(pF);
    var imgA=vid?'<video src="'+esc(vid)+'" autoplay muted loop playsinline></video>':gv?imgD+'<video class="hgv" src="'+esc(gv)+'" autoplay muted loop playsinline disablepictureinpicture onerror="this.remove()"></video>':imgD;
    return '<section class="hd" id="hdst"'+(p&&hci?' data-hcor="'+hci+'"':'')+'><button type="button" class="hdi" '+(p?'data-open="'+p.ref+'" aria-label="'+LFI.tr('Ver')+' '+esc(p.nome)+'"':'')+'>'+imgA+(p&&p.gv?'<span class="h360">↻ 360°</span>':'')+(p&&multiC(p)?'<span class="hnc">'+p.cores.length+' '+LFI.tr('cores')+'</span>':'')+(ed&&ed.deco?'<span class="hdeco">'+ed.deco+'</span>':'')+'</button>'+
      '<div class="hdt"><span class="hlb">'+lab+'</span><h1>'+tit+'</h1>'+(sub?'<p class="hsub">'+sub+'</p>':'')+(ed&&p?'<p class="hsub" style="margin-top:6px"><b>'+esc(p.nome)+'</b></p>':'')+cdHtml(e)+(p&&multiC(p)&&!ed?'<p class="hcor">'+LFI.tr('Cor:')+' <b>'+esc(corNome(p,hci))+'</b></p>':'')+
      (p?'<div class="hpr">'+prc5(p)+'</div>':'')+'<div class="hbt">'+(p?'<button type="button" class="p1" data-open="'+p.ref+'">'+LFI.tr('Ver modelo')+'</button>':'')+'<a class="p2" href="#vitrine"'+(e&&e.tema==='bf'?' data-mf="tipo:of"':'')+'>'+LFI.tr(ed?ed.b2:'Ver catálogo')+' <i>›</i></a></div>'+
      (L.length>1?'<div class="hth">'+L.map(function(q,k){return '<button type="button" data-hdi="'+k+'" class="'+(k===i?'on':'')+'" aria-label="'+esc(q.nome)+'">'+img5(q)+'</button>'}).join('')+'</div><div class="hdots">'+L.map(function(q,k){return '<button type="button" data-hdi="'+k+'" class="'+(k===i?'on':'')+'" aria-label="'+(k+1)+'"></button>'}).join('')+'</div>':'')+'</div></section>'}
  /* S190: 'Ver modelo' do Destaque abre a peça na cor mostrada */
  document.addEventListener('click',function(e){var o=e.target.closest&&e.target.closest('#hdst [data-open]'),h=o&&o.closest('[data-hcor]');if(!h)return;var ci=h.getAttribute('data-hcor'),rf=o.getAttribute('data-open');var n=0,t=setInterval(function(){var b=document.querySelector('#layer [data-sw="'+ci+'"][data-ref="'+rf+'"]');if(b){clearInterval(t);if(!b.classList.contains('on'))b.click()}else if(++n>40)clearInterval(t)},50)},true);
  function dstGira(){clearInterval(V5.tm);V5.tm=setInterval(function(){if(document.hidden||V5.hov||document.documentElement.classList.contains('lock'))return;var n=dstItens().length;if(n<2)return;dstVai((V5.di+1)%n)},6000)}
  function dstVai(k){var h=$('hdst');V5.di=k;if(!h){homeDraw();return}var im=h.querySelector('.hdi');if(im&&!matchMedia('(prefers-reduced-motion: reduce)').matches){im.classList.add('out');setTimeout(function(){var t=document.createElement('div');t.innerHTML=dstHtml();var nv=t.firstElementChild;if(nv){h.replaceWith(nv);var i2=nv.querySelector('.hdi');i2.classList.add('out');requestAnimationFrame(function(){requestAnimationFrame(function(){i2.classList.remove('out')})})}},280)}else{var t=document.createElement('div');t.innerHTML=dstHtml();if(t.firstElementChild)h.replaceWith(t.firstElementChild)}}

  /* ---- cards ---- */
  function selo5(p,sec){if(p.aviso==='Esgotado')return '<span class="hb esg">'+LFI.tr('Esgotado')+'</span>';var h=selo1(p,'hb');if((sec==='nov'&&/ nv"/.test(h))||(sec==='mv'&&/ rk"/.test(h)))return '';return h}
  function card5(p,idl,sec){return '<button type="button" class="hc" data-open="'+p.ref+'" aria-label="'+LFI.tr('Ver')+' '+esc(p.nome)+'">'+(idl?'<span class="hidl">'+LFI.tr('Ideal para você')+'</span>':selo5(p,sec))+'<span class="hci">'+img5(p)+(/Últim/.test(p.aviso||'')?'<span class="ulin" data-cabe="letra"><i></i>'+esc(p.aviso)+'</span>':'')+'</span>'+(p.ds!=null?'<span class="hn lfcod"><small class="hds">'+esc(p.ds)+'</small>'+esc(p.ref)+'</span>':'<span class="hn">'+esc(p.nome)+'</span>')+'<span class="hsw">'+(p.cores||[]).slice(0,5).map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</span><span class="hp">'+prc5(p)+'</span></button>'}
  function abas5(){var C=cat5(),ok=function(p){return p.aviso!=='Esgotado'};
    /* 08/11 (aprovado): cada peça aparece em UMA seção só, na de maior hierarquia — Ofertas > Mais vendidos > Novidades.
       Em Ofertas a mais vendida vem primeiro, depois o maior desconto. */
    var of=C.filter(function(p){return ok(p)&&isOf(p)}).sort(function(a,b){var ma=a.mv>0?a.mv:1e9,mb=b.mv>0?b.mv:1e9;return ma-mb||pct5(b)-pct5(a)}),
      mv=C.filter(function(p){return ok(p)&&!isOf(p)&&p.mv>0}).sort(function(a,b){return a.mv-b.mv}),
      nov=C.filter(function(p){return ok(p)&&!isOf(p)&&!(p.mv>0)}).sort(function(a,b){return (b.cad||0)-(a.cad||0)||(a.ord||0)-(b.ord||0)});
    var e=evAtivo(),A=[['nov','Novidades',nov],['mv','Mais vendidos',mv],['of','Ofertas',of]];
    if(e&&e.tema==='bf')A=[A[2],A[1],A[0]];
    return A.filter(function(a){return a[2].length})}

  /* ---- página inicial ---- */
  var IC5={sol:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg>',
    lock:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    pin:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>'};
  function homeHtml(){
    var C=cat5(),h=dstHtml();
    h+='<div class="htr"><span>'+IC5.sol+'<b>Delivery</b> '+LFI.tr('todo o Paraguai')+'</span><span>'+IC5.lock+'<b>'+LFI.tr('Pagamento seguro')+'</b> '+LFI.tr('PIX ou Banco Familiar')+'</span><span>'+IC5.pin+'<b>'+LFI.tr('Retirada')+'</b> '+LFI.tr('em CDE')+'</span></div>';
    /* coleções com nome (campo "Coleção" do painel) */
    var cols={};C.forEach(function(p){var c=String(p.col||'').trim();if(c){(cols[c]=cols[c]||[]).push(p)}});
    var CL=Object.keys(cols).filter(function(c){return cols[c].length>=2}).sort(function(a,b){return cols[b].length-cols[a].length}).slice(0,4);
    if(CL.length)h+='<div class="hsh"><h2 class="h2">'+LFI.tr('Coleções')+'</h2></div><div class="hcol"'+(CL.length<4?' style="--n:'+CL.length+'"':'')+'>'+CL.map(function(c){var f=cols[c].filter(function(p){return p.foto})[0]||cols[c][0];return '<a href="#vitrine" data-mf="col:'+esc(c)+'">'+(f.foto?'<img src="'+f.foto+'" alt="" loading="lazy">':'')+'<span class="cx"><b>'+esc(c)+'</b><small>'+cols[c].length+' '+LFI.tr('modelos')+'</small></span></a>'}).join('')+'</div>';
    /* categorias */
    var CT=[['solar','Solar'],['grau','Leitura'],['armacao','Armações']].map(function(t){var l=C.filter(function(p){return p.tipo===t[0]});return [t[0],t[1],l]}).filter(function(t){return t[2].length});
    if(CT.length)h+='<div class="hsh"><h2 class="h2">'+LFI.tr('Compre por categoria')+'</h2></div><div class="hcat" style="grid-template-columns:repeat('+CT.length+',minmax(0,1fr))">'+CT.map(function(t){var f=t[2].filter(function(p){return p.foto&&p.aviso!=='Esgotado'})[0]||t[2][0];return '<a href="#vitrine" data-mf="tipo:'+t[0]+'"><span class="hci">'+img5(f)+'</span><span><small>'+t[2].length+' '+LFI.tr('modelos')+'</small>'+LFI.tr(t[1])+'</span></a>'}).join('')+'</div>';
    /* para o seu rosto (depois do teste) */
    var ro=rostoAtual();
    if(ro){var ide=C.filter(function(p){return p.aviso!=='Esgotado'&&(p.rosto||[]).indexOf(ro)>=0}).slice(0,4);
      if(ide.length)h+='<div class="hros"><span style="font-size:26px">✨</span><div><b>'+LFI.tr('Para o seu rosto')+' '+esc(rostoNome(ro))+'</b><small>'+LFI.tr('Você fez o teste · estes são os modelos que mais combinam')+'</small></div><a href="#vitrine" data-facem="'+ro+'">'+LFI.tr('Ver só os ideais')+' ›</a></div><div class="hg">'+ide.map(function(p){return card5(p,1)}).join('')+'</div>'}
    /* 08/11 (aprovado): sem abas — Novidades, Mais vendidos e Ofertas, cada uma com seu título e "Ver todos ›" */
    abas5().forEach(function(a){h+='<div class="hsh hsh1"><h2 class="h2">'+LFI.tr(a[1])+'</h2><a href="#vitrine" data-mf="tipo:'+a[0]+'">'+LFI.tr('Ver todos')+' ›</a></div><div class="hg" data-hsec="'+a[0]+'">'+a[2].slice(0,8).map(function(p){return card5(p,0,a[0])}).join('')+'</div>'});
    /* faixas do esboço B */
    /* novidades */
    /* B4 (11/11, S124–S148 aprovados): Comece por aqui (3 cartões) → Para lojistas (cartão largo, 1 óculos) → Novidades e ofertas (no fim) */
    var GF=guiaFotos(),fot=function(f){return f&&f.foto?'<img src="'+f.foto+'" alt="" loading="lazy">':''},gf=function(fn){var x=GF.filter(fn)[0];return x?x.f:null};
    /* 22/11 (bug do dono: o cartão do teste de leitura aparecia VAZIO): o Mochi faz parte do desenho do cartão desde o começo.
       Antes ele era posto depois, num passo marcado ANTES de o cartão existir na página — na 2ª pintura (dados da nuvem) o cartão novo
       chegava vazio e apagava o Mochi do antigo. Agora o cartão já vem com ele; os braços são postos depois de cada pintura (homeDraw). */
    var moF=window.__lfMochiSvg,moH=moF?moF().replace(/id="(lf[a-z0-9]+)"/g,'id="h$1"').replace(/url\(#(lf[a-z0-9]+)\)/g,'url(#h$1)'):'';
    var com=function(at,img,tag,t,sub){return '<button type="button" '+at+'><span class="gi'+(img==='MO'?' mo" data-mochi="1':'')+'">'+(img==='MO'?moH:img)+'</span><span class="gt"><small>'+LFI.tr(tag)+'</small><b>'+LFI.tr(t)+'</b>'+(sub?'<em class="gsub">'+LFI.tr(sub)+'</em>':'')+'</span></button>'};
    var moI='MO';
    h+='<div class="hsh" id="hguia"><h2 class="h2">'+LFI.tr('Comece por aqui')+'</h2></div><div class="hgu hcom">'+
      com('data-gzopen',moI,'TESTE DE LEITURA','Descubra seu grau em 1 min','')+
      com('data-gpan="rosto"',fot(gf(function(x){return x.g.pan==='rosto'})),'ESTILO','A armação ideal para o seu rosto','')+
      com('data-gpan="como"',fot(gf(function(x){return !x.g.loj&&x.g.pan!=='rosto'})),'AJUDA','Tire suas dúvidas','Pagamento, entrega e troca')+'</div>';
    var fa=gf(function(x){return x.g.loj});
    h+='<div class="hsh" id="hloj"><h2 class="h2">'+LFI.tr('Para lojistas')+'</h2></div><div class="hata"><span class="hati">'+fot(fa)+'</span><div class="hatt"><small>'+LFI.tr('PARA REVENDER')+'</small><h3>'+LFI.tr('Compre em quantidade')+'</h3><p>'+LFI.tr('Preços especiais para lojas, revendedores e empresas, com atendimento exclusivo.')+'</p><button type="button" class="lfba" data-gpan="atacado">'+LFI.tr('Solicitar orçamento')+'</button></div></div>';
    h+='<section class="hnews hn2"><div><h2>'+LFI.tr('Novidades e ofertas')+' <em>'+LFI.tr('primeiro')+'</em></h2><p>'+LFI.tr('Avisamos quando chegam modelos novos ou tem oferta. Sem spam.')+'</p></div><div class="nf" id="hnf">'+newsForm()+'</div></section>';
    h+=rodape5();setTimeout(hguPil,0);
    return h}
  /* 09/11 S69: no Guia e em "Para lojistas" a foto fica presa na coluna dela; se mesmo assim o texto não couber (letra grande), o cartão empilha */
  function hguPil(){try{document.querySelectorAll('.hgu button').forEach(function(b){b.classList.remove('pil');var g=b.querySelector('.gt');if(g&&getComputedStyle(b).display==='grid'&&g.clientWidth<150)b.classList.add('pil')})}catch(_){}}
  addEventListener('resize',function(){clearTimeout(hguPil.t);hguPil.t=setTimeout(hguPil,120)});
  function rodape5(){var es=LFI.lang==='es',ig=(typeof SOCIAL!=='undefined'&&SOCIAL.ig)||'';
    return '<div class="lfft"><div class="in"><div><p class="fbr">La Fouch</p><p>'+LFI.tr('Tudo em óculos')+' · Ciudad del Este</p><p>Galeria Jebai Center, 3° piso, torre A, n°2242</p><p>'+LFI.tr('Segunda a sábado, das 7h30 às 15h')+'</p><p><a class="mp" href="https://maps.app.goo.gl/zy6c1ZFq4gQhxWXC8" target="_blank" rel="noopener" style="color:var(--ac);font-weight:700">'+LFI.tr('Como chegar')+' ›</a></p></div>'+
      '<div><b>'+LFI.tr('Comprar')+'</b><p><a href="#vitrine" data-mf="tipo:solar">'+LFI.tr('Solar')+'</a></p><p><a href="#vitrine" data-mf="tipo:grau">'+LFI.tr('Leitura')+'</a></p><p><a href="#vitrine" data-mf="tipo:armacao">'+LFI.tr('Armações')+'</a></p><p><a href="#vitrine" data-mf="tipo:of">'+LFI.tr('Ofertas')+'</a></p><p><a href="#atacado">'+LFI.tr('Atacado')+'</a></p></div>'+
      '<div><b>'+LFI.tr('Ajuda')+'</b><p><a href="#como" data-ajp="duvidas">'+LFI.tr('Dúvidas frequentes')+'</a></p><p><a href="#como" data-ajp="dicas">'+LFI.tr('Dicas e cuidados')+'</a></p><p><a href="#como" data-ajp="contato">'+LFI.tr('Entre em contato')+'</a></p></div>'+

      '</div><div class="fbt"><div><a href="/termos.html">'+LFI.tr('Termos')+'</a> · <a href="/privacidade.html">'+LFI.tr('Privacidade')+'</a> · © '+new Date().getFullYear()+' La Fouch</div><div class="frc">'+LFI.tr('Protegido pelo reCAPTCHA do Google')+' · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">'+LFI.tr('Privacidade')+'</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noopener">'+LFI.tr('Termos')+'</a></div></div>'}
  function homeDraw(){
    var H=$('home');if(!H){H=document.createElement('div');H.id='home';var hero=document.querySelector('.hero');hero.style.setProperty('display','none','important');hero.parentNode.insertBefore(H,hero.nextSibling)}
    evAplica();if(st.rosto){try{localStorage.setItem('lf_rosto5',st.rosto)}catch(_){}}
    var ht=homeHtml();
    /* o Mochi ainda não está pronto (roupa do evento chegando): pinta de novo quando estiver — no máximo 5 s, como antes */
    if(!window.__lfMochiSvg&&ht.indexOf('data-mochi')>=0&&(homeDraw.mo=(homeDraw.mo||0)+1)<=20)setTimeout(homeDraw,250);
    if(H._h===ht)return;var ja=!!H._h&&H.firstChild;H._h=ht;
    /* 09/11 S43 (aprovado): a 2ª pintura (dados da nuvem) troca só o que mudou — as fotos, os cartões e as animações do Destaque continuam os mesmos (sem piscar nem recomeçar) */
    if(ja){var t=document.createElement('div');t.innerHTML=ht;try{lfMorph(H,t);moBracos(H);try{lfDsFit(true)}catch(_){}return}catch(_){}}
    H.innerHTML=ht;moBracos(H);dstGira()}
  function moBracos(H){if(window.__lfMochiArms)H.querySelectorAll('[data-mochi] svg').forEach(function(sv){window.__lfMochiArms(sv)})}
  function lfMorph(a,b){var A=[].slice.call(a.childNodes),B=[].slice.call(b.childNodes);
    for(var i=0;i<B.length;i++){var x=A[i],y=B[i];
      if(!x){a.appendChild(y);continue}
      if(x.nodeType!==y.nodeType||x.nodeName!==y.nodeName||(x.nodeType===1&&((x.id||'')!==(y.id||'')||(x.getAttribute('data-open')||'')!==(y.getAttribute('data-open')||'')))){a.replaceChild(y.cloneNode(true),x);continue}
      if(x.nodeType===3){if(x.nodeValue!==y.nodeValue)x.nodeValue=y.nodeValue;continue}
      if(x.nodeType!==1)continue;
      var keep=x.tagName==='IMG'&&(x.dataset.lfqo||x.getAttribute('src'))===y.getAttribute('src');
      [].slice.call(y.attributes).forEach(function(at){if((keep&&at.name==='src')||(x.tagName==='IMG'&&at.name==='class'))return;if(x.getAttribute(at.name)!==at.value)x.setAttribute(at.name,at.value)});
      [].slice.call(x.attributes).forEach(function(at){if(!y.hasAttribute(at.name)&&!(x.tagName==='IMG'&&/^(data-lfq|class$)/.test(at.name))&&!/^data-f$/.test(at.name))x.removeAttribute(at.name)});
      lfMorph(x,y)}
    for(var j=A.length-1;j>=B.length;j--)a.removeChild(A[j])}
  var _redraw5=redraw;redraw=function(){_redraw5();homeDraw()};
  var _setHero5=setHero;setHero=function(){_setHero5();clearTimeout(V5.sh);V5.sh=setTimeout(homeDraw,30)};

  /* ---- catálogo: ofertas, coleção e acessórios ---- */
  var _drawChips5=drawChips;drawChips=function(){
    var tem=P.some(function(p){return vis5(p)&&isOf(p)});TIPOS.length=0;[['todos','Todos'],['armacao','Armações'],['grau','Óculos de leitura'],['solar','Solares']].concat(tem||st.tipo==='of'?[['of','Ofertas']]:[]).forEach(function(t){TIPOS.push(t)});
    _drawChips5();if(st.col){var tp=$('tipos');if(tp)tp.insertAdjacentHTML('afterbegin','<button class="chip" data-colx aria-pressed="true">'+esc(st.col)+' ×</button>')}};
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-tipo],[data-gen],[data-colx]');if(!t)return;
    if(t.hasAttribute('data-colx')){e.stopPropagation();st.col='';drawChips();drawGrid();return}
    st.col=''},true);
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-mf]');if(!t||t.closest('#drw'))return;
    var kv=t.getAttribute('data-mf').split(':'),v=kv.slice(1).join(':');st.col='';st.rosto='';
    if(kv[0]==='gen'){st.gen=v;st.tipo='todos'}else if(kv[0]==='col'){st.col=v;st.tipo='todos';st.gen=''}else{st.tipo=v;st.gen=''}
    try{drawGen();drawChips();drawFaces();drawGrid()}catch(_){}},true);


  /* v452: lupa do cabeçalho filtra o catálogo aberto; a busca ativa aparece como etiqueta com × */
  function qChip(){var vs=$('vscr');if(!vs)return;var c=$('qchip'),q=String(st.q||'').trim();
    if(!q){if(c)c.remove();return}
    if(!c){c=document.createElement('div');c.id='qchip';var g=$('grid');g.parentNode.insertBefore(c,g)}
    var n=lista().length;c.innerHTML='<button type="button" data-qx aria-label="'+LFI.tr('Limpar busca')+'">“'+esc(q)+'” <span aria-hidden="true">×</span></button><small>'+n+' '+LFI.tr(n===1?'resultado':'resultados')+'</small>'}
  var _drawGrid5=drawGrid;drawGrid=function(){_drawGrid5();try{qChip()}catch(_){}};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-qx]');if(!t)return;setQ('');var q5=$('q5');if(q5)q5.value=''});
  /* ---- busca na lupa ---- */
  (function(){
    var bag=$('bagbtn');if(!bag||$('sov'))return;
    var b=$('sbtn');if(!b){b=document.createElement('button');b.className='ib';b.id='sbtn';b.type='button';b.setAttribute('aria-label','Buscar');b.innerHTML='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';bag.parentNode.insertBefore(b,bag)}
    var LUPA5='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',SETA5='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
    var o=document.createElement('div');o.id='sov';o.setAttribute('aria-hidden','true');
    o.innerHTML='<div class="sosc" data-sox></div><div class="sopn" role="dialog" aria-modal="true" aria-label="Buscar"><div class="sobar"><div class="sofld"><button type="button" class="soic" id="soic" tabindex="-1" aria-label="Buscar">'+LUPA5+'</button><input id="q5" type="search" placeholder="Buscar modelo ou código" aria-label="Buscar no catálogo" autocomplete="off" enterkeyhint="search"></div></div><div class="sores" id="sores"></div></div>';
    document.body.appendChild(o);
    var inp=$('q5'),res=$('sores');
    function achados(q){var bq=btol(q);if(!bq)return [];return cat5().map(function(p){return [p,bq(btolTxt(p))]}).filter(function(x){return x[1]>0}).sort(function(a,b){return (a[0].aviso==='Esgotado'?1:0)-(b[0].aviso==='Esgotado'?1:0)||b[1]-a[1]}).map(function(x){return x[0]})}
    /* nada achado: "Você quis dizer…" + os mais parecidos (qualquer palavra que bata) */
    function parecidos(q){var tk=btolFold(q).split(/[^a-z0-9]+/).filter(function(t){return t.length>=3});var m={};tk.forEach(function(t){var f=btol(t);cat5().forEach(function(p){var v=f(btolTxt(p));if(v)m[p.ref]=[p,(m[p.ref]?m[p.ref][1]:0)+v]})});return Object.keys(m).map(function(k){return m[k]}).sort(function(a,b){return b[1]-a[1]}).map(function(x){return x[0]}).slice(0,4)}
    function icone(){var ic=$('soic'),on=!!inp.value;if(ic._on===on)return;ic._on=on;ic.innerHTML=on?SETA5:LUPA5;ic.setAttribute('aria-label',on?LFI.tr('Fechar a busca'):LFI.tr('Buscar'));ic.tabIndex=on?0:-1}
    function socats(){return '<div class="socat"><small>'+LFI.tr('OU VEJA POR CATEGORIA')+'</small>'+[['solar','Solar'],['grau','Leitura'],['armacao','Armações'],['of','Ofertas']].map(function(x){return '<button type="button" data-socat="'+x[0]+'"'+(x[0]==='of'?' class="of"':'')+'>'+LFI.tr(x[1])+'<i>›</i></button>'}).join('')+'<button type="button" data-socat="atacado" class="at">'+LFI.tr('Atacado')+'<i>›</i></button></div>'}
    function pinta(){icone();var q=inp.value,l=achados(q);
      if(!q.trim()){res.innerHTML=srVistos()+'<div class="sohint">'+LFI.tr('Busque pelo nome ou pelo código da peça.')+'</div>'+socats();return}
      if(!l.length){var sg=btolSugere(q,cat5().map(btolTxt)),pr=parecidos(q);res.innerHTML='<div class="sohint">'+LFI.tr('Nada encontrado para')+' “'+esc(q)+'”.'+(sg?' '+LFI.tr('Você quis dizer')+' <button type="button" class="sosug" data-sq="'+esc(sg)+'">'+esc(sg)+'</button>?':'')+'</div>'+(pr.length?'<div class="sohint" style="margin-top:6px">'+LFI.tr('Parecidos')+':</div>'+pr.map(function(p){return '<button type="button" class="sor" data-open="'+p.ref+'"><span class="sim">'+img5(p)+'</span><span><b>'+esc(p.nome)+'</b><small>'+p.ref+'</small></span><span class="spr">'+prc5(p)+'</span></button>'}).join(''):'')+socats();return}
      var en=btolEntende(q,l);res.innerHTML=(en?'<div class="sohint soent">'+esc(en)+'</div>':'')+l.slice(0,6).map(function(p){return '<button type="button" class="sor" data-open="'+p.ref+'"><span class="sim">'+img5(p)+'</span><span><b>'+esc(p.nome)+'</b><small>'+p.ref+'</small></span><span class="spr">'+prc5(p)+'</span></button>'}).join('')+(l.length>6?'<button type="button" class="soall" data-soall>'+LFI.tr('Ver todos os')+' '+l.length+' '+LFI.tr('resultados')+'</button>':'')}
    function noCat(){var v=$('vitrine');return !!(v&&v.classList.contains('pop'))}
    var hst=false;addEventListener('popstate',function(){if(hst&&o.classList.contains('on')){hst=false;fecha(true)}});
    /* 10/11 S110-1: a lista termina acima do teclado (visualViewport), nunca escondida atrás dele */
    function altura(){if(!o.classList.contains('on'))return;var vv=window.visualViewport,h=vv?vv.height+vv.offsetTop:innerHeight,t=res.getBoundingClientRect().top;res.style.maxHeight=Math.max(120,Math.min(520,h-t-12))+'px'}
    if(window.visualViewport){visualViewport.addEventListener('resize',altura);visualViewport.addEventListener('scroll',altura)}addEventListener('resize',altura);
    /* S252 (aprovado 14/11/2026): a busca nasce da lupa e volta para ela; a página de trás recua de leve; o conteúdo entra em fila curta.
       Abrir 0,44 s · fechar 0,26 s. Com "reduzir movimento" nada disso roda. */
    var SO_X='cubic-bezier(.16,1,.3,1)',SO_S='cubic-bezier(.4,0,.2,1)';
    function soMov(){return !!Element.prototype.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches}
    function soLimpa(){[o,$('home')].forEach(function(r){if(r&&r.getAnimations)r.getAnimations({subtree:true}).forEach(function(a){try{a.cancel()}catch(_){}})});o.style.pointerEvents=''}
    function soBase(P){var t=getComputedStyle(P).transform;return t&&t!=='none'?t+' ':''}
    function soOrigem(P){var l=$('sbtn');if(!l)return;var a=l.getBoundingClientRect(),r=P.getBoundingClientRect();if(a.width&&r.width)P.style.transformOrigin=Math.round(a.left+a.width/2-r.left)+'px '+Math.round(a.top+a.height/2-r.top)+'px'}
    function soEntra(){var P=o.querySelector('.sopn'),A=function(e,k,q){return e&&e.animate(k,Object.assign({fill:'both',easing:SO_X},q))},H=$('home'),lite=document.documentElement.classList.contains('lite');
      soOrigem(P);var B=soBase(P);o._B=B;
      A(o.querySelector('.sosc'),[{opacity:0},{opacity:1}],{duration:320,easing:'ease-out'});
      if(H&&H.getClientRects().length)A(H,lite?[{transform:'none'},{transform:'scale(.985)'}]:[{transform:'none',filter:'blur(0px)'},{transform:'scale(.985)',filter:'blur(2px)'}],{duration:440});
      A(P,[{opacity:0,transform:B+'scale(.7)'},{opacity:1,transform:B||'none'}],{duration:440});
      A(o.querySelector('.sobar'),[{opacity:0,transform:'translateY(-4px)'},{opacity:1,transform:'none'}],{duration:260,delay:90});
      [].slice.call(o.querySelectorAll('.sohint,.socat > *')).slice(0,14).forEach(function(e,i){A(e,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:280,delay:150+i*22})})}
    function soSai(fim){var P=o.querySelector('.sopn'),A=function(e,k,q){return e&&e.animate(k,Object.assign({fill:'forwards',easing:SO_S},q))},H=$('home'),lite=document.documentElement.classList.contains('lite'),B=o._B||'';
      o.style.pointerEvents='none';
      [o.querySelector('.sobar'),$('sores')].forEach(function(e){A(e,[{opacity:1},{opacity:0}],{duration:120})});
      A(P,[{opacity:1,transform:B||'none'},{opacity:0,transform:B+'scale(.7)'}],{duration:260,delay:40});
      if(H&&H.getClientRects().length)A(H,lite?[{transform:'scale(.985)'},{transform:'none'}]:[{transform:'scale(.985)',filter:'blur(2px)'},{transform:'none',filter:'blur(0px)'}],{duration:300});
      A(o.querySelector('.sosc'),[{opacity:1},{opacity:0}],{duration:240,delay:60});
      o._tf=setTimeout(fim,300)}
    function abre(){clearTimeout(o._tf);o._saindo=0;soLimpa();if(noCat())inp.value=st.q||'';try{history.pushState({sov:1},'');hst=true}catch(_){}o.classList.toggle('lux',soMov());o.classList.add('on');o.setAttribute('aria-hidden','false');document.documentElement.classList.add('lock');pinta();altura();if(soMov())soEntra();setTimeout(function(){inp.focus();altura()},40);setTimeout(altura,450)}
    function fecha(dePop){if(hst&&dePop!==true&&dePop!=='todos'){hst=false;try{history.back()}catch(_){}}if(dePop==='todos')hst=false;var era=o.classList.contains('on')&&!o._saindo,fim=function(){o._saindo=0;o.classList.remove('on');soLimpa()};o.setAttribute('aria-hidden','true');if(!$('layer').innerHTML.trim()&&!$('drw').classList.contains('on'))document.documentElement.classList.remove('lock');if(era&&soMov()){o._saindo=1;soSai(fim)}else if(!o._saindo)fim()}
    V5.sfecha=fecha;V5.sabre=abre;
    b.addEventListener('click',abre);inp.addEventListener('input',function(){pinta();if(noCat())setQ(inp.value)});
    inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();todos()}});
    /* 10/11 S110-2 (opção A): confirmar a busca procura no catálogo INTEIRO (antes ficava na seção aberta: em Solar, "Óculos de leitura…" dava 0).
       Se só um produto tem exatamente esse nome (ou esse código), ele abre direto. */
    function todos(){var q=inp.value,f=btolFold(q).trim();
      var um=f?cat5().filter(function(p){return btolFold(p.nome||'').trim()===f||btolFold(p.ref||'').trim()===f}):[];
      if(um.length===1){var r=um[0].ref;inp.value='';if(noCat())setQ('');if(hst){hst=false;fecha(true);var go=function(){removeEventListener('popstate',go);setTimeout(function(){product(r)},0)};addEventListener('popstate',go);try{history.back()}catch(_){removeEventListener('popstate',go);product(r)}}else{fecha();product(r)}return}
      fecha('todos');st.fgr='';st.col='';st.rosto='';st.gen='';st.tipo='todos';try{drawGen();drawChips();drawFaces()}catch(_){}setQ(q);goTo('vitrine')}
    o.addEventListener('click',function(e){var ic=e.target.closest('#soic');if(ic){if(inp.value)fecha();else inp.focus();return}var sc=e.target.closest('[data-socat]');if(sc){var cv=sc.getAttribute('data-socat');if(cv==='atacado'){fecha();setTimeout(function(){goTo('atacado')},60)}else{fecha('todos');setQ('');st.fgr='';navAbreCat(cv)}return}var t=e.target.closest('[data-sox],[data-soall],[data-ssg],[data-sq],[data-open]');if(!t)return;
      if(t.hasAttribute('data-sox'))fecha();else if(t.hasAttribute('data-soall'))todos();else if(t.hasAttribute('data-ssg')){var g=SRG[+t.getAttribute('data-ssg')];if(!g)return;
        if(g.a==='q'){inp.value=g.v;todos()}else{fecha('todos');setQ('');st.fgr=g.a==='g'?g.v:'';navAbreCat(g.a==='g'?'grau':g.v)}}else if(t.hasAttribute('data-sq')){inp.value=t.getAttribute('data-sq');pinta();inp.focus()}
      else if(t.hasAttribute('data-open')){/* 07/11: abrir a peça só depois que o "voltar" da busca terminar (antes o voltar fechava a peça recém-aberta) */var r=t.getAttribute('data-open');e.stopPropagation();
        if(hst){hst=false;fecha(true);var go=function(){removeEventListener('popstate',go);setTimeout(function(){product(r)},0)};addEventListener('popstate',go);try{history.back()}catch(_){removeEventListener('popstate',go);product(r)}}else{fecha();product(r)}}
      else fecha()});
  })();

  /* ---- menu lateral em blocos ---- */
  (function(){
    var nv=document.querySelector('#drw nav');if(!nv)return;nv.className='dnv';
    var A=function(h,mf,t,c){return '<a href="'+h+'"'+(mf?' data-mf="'+mf+'"':'')+(c?' class="'+c+'"':'')+'>'+t+'</a>'};
    nv.innerHTML='<a href="#" class="dacc" data-cta="minha"><span class="dav" id="dav">'+'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg></span><span><b id="dacn">Entrar ou criar conta</b><small id="dacs" data-cabe="curto" data-curto="Meus pedidos ›">Minha conta · Meus pedidos ›</small></span></a>'+
      '<small class="dgl">Comprar</small>'+A('#vitrine','tipo:solar','Solar')+A('#vitrine','tipo:grau','Leitura')+A('#vitrine','tipo:armacao','Armações')+A('#vitrine','tipo:of','Ofertas','dof')+
      '<div class="dch">'+A('#vitrine','gen:f','Feminino')+A('#vitrine','gen:m','Masculino')+A('#vitrine','gen:u','Unissex')+'</div>'+
      /* 09/11 S44 A (aprovado): grupo Ferramentas */'<small class="dgl">'+LFI.tr('Ferramentas')+'</small>'+A('#rosto','','Descubra o seu formato')+'<a href="#" data-gzopen>'+LFI.tr('Descubra o seu grau')+'</a>'+
       '<small class="dgl">Para lojistas</small>'+A('#atacado','','Atacado')+
      '<small class="dgl">Ajuda</small>'+'<a href="#como" data-ajp="duvidas">'+LFI.tr('Dúvidas frequentes')+'</a><a href="#como" data-ajp="dicas">'+LFI.tr('Dicas e cuidados')+'</a>';
    var dl=document.querySelector('#drw .dleg');if(dl)dl.style.display='';
    /* S429 (menu A, aprovado 18/11): nome = primeiro + último, sem "Olá"; ícone fino de pessoa num círculo de fio (rosa com conta) */
    function conta(){var c=null;try{c=logado()?getConta():null}catch(_){}var w=c&&c.nome?String(c.nome).trim().split(/\s+/):[],n=w.length>1?w[0]+' '+w[w.length-1]:(w[0]||'');
      $('dacn').textContent=n||LFI.tr('Entrar ou criar conta');var dc=$('dacs');if(dc){dc.removeAttribute('data-lfc');dc.textContent=LFI.tr('Minha conta · Meus pedidos ›');dc.__cl=null;dc.setAttribute('data-curto',LFI.tr('Meus pedidos ›'))}$('dav').innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>';$('dav').closest('.dacc').classList.toggle('lflog',!!n)}
    $('mnb').addEventListener('click',conta);
    $('drw').addEventListener('click',function(e){var t=e.target.closest('.dacc,[data-guia],[data-hguia]');if(!t)return;e.preventDefault();drwSet(false)},true);
  })();

  /* ---- cliques da página inicial ---- */
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-hdi],[data-htab],[data-nm],[data-news],[data-guia],[data-arst],[data-arok],[data-arw],[data-acc]');if(!t)return;
    if(t.hasAttribute('data-hdi')){V5.di=+t.getAttribute('data-hdi');dstVai(V5.di);dstGira()}
    else if(t.hasAttribute('data-htab')){V5.tab=t.getAttribute('data-htab');homeDraw()}
    else if(t.hasAttribute('data-nm')){V5.nm=t.getAttribute('data-nm');$('hnf').innerHTML=newsForm()}
    else if(t.hasAttribute('data-news'))newsEnvia(t.getAttribute('data-news'));
    else if(t.hasAttribute('data-guia')){e.preventDefault();guiaAbre(t.getAttribute('data-guia')==='1'?'rosto':t.getAttribute('data-guia'))}
    else if(t.hasAttribute('data-acc'))accToggle(t);
    else if(t.hasAttribute('data-arw'))avalForm();
    else if(t.hasAttribute('data-arst'))avalEstrela(+t.getAttribute('data-arst'));
    else if(t.hasAttribute('data-arok')){e.preventDefault();avalEnvia()}});
  (function(){var hov=function(on){return function(e){if(e.target.closest&&e.target.closest('#hdst'))V5.hov=on}};document.addEventListener('pointerover',hov(true));document.addEventListener('pointerout',hov(false))})();
  /* deslizar o destaque no celular */
  (function(){var x0=null;document.addEventListener('touchstart',function(e){x0=e.target.closest&&e.target.closest('#hdst')?e.touches[0].clientX:null},{passive:true});
    document.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;var n=dstItens().length;if(Math.abs(dx)<50||n<2)return;dstVai((V5.di+(dx<0?1:n-1))%n);dstGira()},{passive:true})})();
  function newsEnvia(m){
    if(m==='wa'){var tx=LFI.lang==='es'?'¡Hola! Quiero recibir las novedades y ofertas de La Fouch por WhatsApp.':'Olá! Quero receber as novidades e ofertas da La Fouch pelo WhatsApp.';window.open('https://wa.me/'+NUM5()+'?text='+encodeURIComponent(tx),'_blank','noopener');return}
    var em=($('hnem')||{}).value||'';if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em.trim())){toast(LFI.tr('Digite um e-mail válido.'));return}
    acFetch(fnUrl('novidades'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({acao:'inscrever',email:em.trim(),lang:LFI.lang})}).then(function(r){return r.json()}).then(function(j){if(!j||!j.ok)throw 0;/* S5 (nuvem 20/11): a inscrição só vale com o e-mail confirmado — confirmar:true = a nuvem mandou o e-mail de confirmação */V5.nok=j.confirmar?'Enviamos um e-mail para confirmar':'Pronto! Você vai receber as novidades por e-mail.';$('hnf').innerHTML=newsForm()}).catch(function(){toast(LFI.tr('Não consegui inscrever agora. Tente de novo mais tarde.'))})}

  /* ---- guia ---- */
  var FX5={oval:'<ellipse cx="27" cy="32" rx="18" ry="26"/>',redondo:'<circle cx="27" cy="32" r="22"/>',quadrado:'<rect x="6" y="8" width="42" height="48" rx="8"/>',coracao:'<path d="M8 12h38l-8 34-11 12-11-12z"/>'};
  /* 07/11: o artigo do tipo de rosto saiu (já existe a página Descubra o seu formato); o Guia leva também ao formato do rosto e ao atacado (destaque sutil) */
  var GUIA=[
    {id:'formato',pan:'rosto',tp:['grau','armacao'],tag:'SEU ROSTO',t:'Qual óculos combina com o meu rosto?',sub:'Leva menos de 1 minuto'},
    {id:'tipos',img:'GR3340',tp:['grau','armacao'],tag:'ESCOLHA CERTA',t:'Leitura, armação ou solar: qual é a diferença?',sub:'Entenda antes de comprar'},
    {id:'uv',img:'SL2270',tp:['solar'],tag:'SOL',t:'UV400 e polarizado: qual é a diferença?'},
    {id:'limpar',img:'AC1050',tp:['armacao','grau'],tag:'CUIDADOS',t:'Como limpar seus óculos sem riscar'},
    {id:'atacado',pan:'atacado',tp:['grau','armacao','solar'],loj:1,tag:'ATACADO',t:'Preços de atacado para a sua ótica'}];
  /* uma foto diferente para cada cartão: a indicada (se tiver foto de verdade), senão a primeira peça do tipo certo ainda não usada */
  function guiaFotos(){var us={},ok=function(p){return p&&p.foto&&!us[p.ref]&&!/^data:image\/svg/.test(p.foto)&&p.aviso!=='Esgotado'};
    return GUIA.map(function(g){var f=find(g.img);if(!ok(f))f=cat5().filter(function(p){return ok(p)&&g.tp.indexOf(p.tipo)>=0})[0]||cat5().filter(ok)[0]||null;if(f)us[f.ref]=1;return {g:g,f:f}})}
  function guiaAbre(id){
    if(id==='rosto'||id==='formato'||id==='1'){goTo('rosto');return}if(id==='atacado'){goTo('atacado');return}
    var g=GUIA.filter(function(x){return x.id===id})[0]||GUIA[0],h='',ro=rostoAtual()||'oval';
    if(g.id==='rosto'){
      h='<p>'+LFI.tr('O óculos certo equilibra as proporções do rosto. A regra é simples: buscar o contraste. Um rosto redondo ganha com formatos angulares; um rosto quadrado, com curvas.')+'</p><h2>'+LFI.tr('Descubra o seu tipo de rosto')+'</h2><div class="gtb">'+
        [['oval','Oval','Quase tudo fica bem. Experimente formatos grandes e hexagonais.'],['redondo','Redondo','Prefira formatos quadrados ou retangulares.'],['quadrado','Quadrado','Formatos redondos e ovais suavizam os ângulos.'],['coracao','Coração','Gatinho e aviador equilibram a testa.']].map(function(x){return '<div><svg viewBox="0 0 54 64" fill="none" stroke="currentColor" stroke-width="2">'+FX5[x[0]]+'</svg><span><b>'+LFI.tr(x[1])+'</b><small>'+LFI.tr(x[2])+'</small></span></div>'}).join('')+'</div>'+
        '<div class="gbx"><span><span class="glb">'+LFI.tr('NÃO SABE O SEU TIPO?')+'</span><br><b>'+LFI.tr('Descubra em 1 minuto com a câmera')+'</b></span><button type="button" class="go" data-fa>'+LFI.tr('Qual combina com meu rosto?')+'</button></div>';
      var L=cat5().filter(function(p){return p.aviso!=='Esgotado'&&(p.rosto||[]).indexOf(ro)>=0}).slice(0,3);
      if(L.length)h+='<h2>'+LFI.tr('Modelos para rosto')+' '+esc(rostoNome(ro))+'</h2><div class="gpr hg">'+L.map(function(p){return card5(p,0)}).join('')+'</div>';
      h+='<p>'+LFI.tr('Ficou com dúvida? Passe na loja em Ciudad del Este e prove antes de levar.')+'</p>'}
    else if(g.id==='tipos')h='<p>'+LFI.tr('Na La Fouch você encontra três tipos de óculos. Cada um serve para uma coisa — vale conferir antes de comprar.')+'</p><h2>'+LFI.tr('Óculos de leitura')+'</h2><p>'+LFI.tr('Já vêm com lentes prontas, de +0.25 a +4.00, para enxergar de perto: ler, usar o celular, costurar. São indicados para a vista cansada que aparece com a idade. Você escolhe o grau e leva na hora.')+'</p><h2>'+LFI.tr('Armação')+'</h2><p>'+LFI.tr('É só a armação, sem grau. Serve para quem tem receita do oftalmologista: você leva a armação a uma ótica de confiança e coloca as suas lentes.')+'</p><h2>'+LFI.tr('Solar')+'</h2><p>'+LFI.tr('Óculos de sol com proteção UV400, para o dia a dia.')+'</p><div class="gbx gimp"><span><span class="glb">'+LFI.tr('IMPORTANTE')+'</span><b>'+LFI.tr('Só vendemos óculos de leitura prontos')+'</b><small>'+LFI.tr('Não fazemos lentes de grau para enxergar de longe (miopia) nem para astigmatismo. Se a sua receita é para isso, escolha uma armação e leve a receita a uma ótica.')+'</small></span></div>';
    else if(g.id==='uv')h='<p>'+LFI.tr('UV400 e polarizado são coisas diferentes, e um bom óculos de sol pode ter as duas.')+'</p><h2>UV400</h2><p>'+LFI.tr('É a proteção contra os raios ultravioleta (UVA e UVB), que não vemos mas fazem mal aos olhos. UV400 quer dizer que a lente bloqueia os raios até 400 nanômetros, praticamente 100% do UV. É o mais importante para a saúde dos olhos.')+'</p><h2>'+LFI.tr('Polarizado')+'</h2><p>'+LFI.tr('É um filtro que corta o reflexo da luz em superfícies como asfalto, água e vidro. Deixa a visão mais nítida e confortável para dirigir, ir à praia ou pescar. Não substitui a proteção UV: o ideal é ter as duas.')+'</p><h2>'+LFI.tr('Lente escura protege mais?')+'</h2><p>'+LFI.tr('Não. A cor escura só diminui a claridade. Um óculos escuro sem proteção UV é pior que nenhum, porque a pupila dilata e entra mais UV. Por isso todos os nossos solares têm UV400.')+'</p>';
    else h='<p>'+LFI.tr('A maioria dos riscos vem da limpeza feita do jeito errado. Siga estes passos:')+'</p><h2>'+LFI.tr('Passo a passo')+'</h2><p>1. '+LFI.tr('Enxágue as lentes em água corrente, morna ou fria, para tirar a poeira antes de esfregar.')+'</p><p>2. '+LFI.tr('Use uma gota de detergente neutro e espalhe com os dedos, dos dois lados.')+'</p><p>3. '+LFI.tr('Enxágue de novo e seque com a flanela de microfibra, sem apertar.')+'</p><h2>'+LFI.tr('O que evitar')+'</h2><p>'+LFI.tr('Camiseta, papel, guardanapo e álcool riscam ou estragam o tratamento da lente. Nunca deixe o óculos no painel do carro: o calor deforma a armação. Guarde sempre no estojo.')+'</p>';
    layer('<div class="modal msg guia" role="dialog" aria-modal="true" aria-label="'+esc(LFI.tr(g.t))+'"><div class="det"><button class="x" data-close aria-label="Fechar">×</button><span class="glb">'+LFI.tr(g.tag)+'</span><h1>'+LFI.tr(g.t)+'</h1>'+h+'</div></div>','center')}

  /* ---- página da peça: rosto, estojo e flanela, combina com, avaliações ---- */
  var _product5=product;product=function(ref,pop){_product5(ref,pop);try{prodExtra(ref)}catch(_){}};
  function accs(){return P.filter(function(p){return p.tipo==='acessorio'&&!p.oculto&&p.aviso!=='Esgotado'})}
  function accItem(p){var on=!!st.cart[p.ref];return '<button type="button" data-acc="'+p.ref+'" aria-pressed="'+on+'"><span class="ai">'+img5(p)+'</span><span><b>'+esc(p.nome)+(/estojo|estuche/i.test(p.nome)&&!/flanela|franela/i.test(p.nome)?' + '+LFI.tr('flanela'):'')+'</b><small>'+fmt(p.n)+'</small></span><span class="ck">'+(on?'✓':'')+'</span></button>'}
  function accToggle(t){var r=t.getAttribute('data-acc'),p=find(r);if(!p)return;if(st.cart[r]){delete st.cart[r];toast(LFI.tr('Tirado do carrinho'))}else{st.cart[r]=1;toast(LFI.tr('Adicionado ao carrinho'),LFI.tr('Ver'))}drawBag();t.outerHTML=accItem(p)}
  function prodExtra(ref){
    var p=find(ref),m=document.querySelector('#layer .pgm');if(!p||!m)return;var det=m.querySelector('.det');if(!det)return;
    var ro=rostoAtual(),dp=det.querySelector('.dp');
    if(ro&&dp&&(p.rosto||[]).indexOf(ro)>=0)dp.insertAdjacentHTML('afterend','<div class="pidl">✓ '+LFI.tr('Ideal para o seu rosto')+' '+esc(rostoNome(ro))+'</div>');
    if(dp&&isOf(p)&&+p.ofAte>Date.now()){var sx=Math.floor((+p.ofAte-Date.now())/1000),dx=Math.floor(sx/86400),hx=Math.floor(sx%86400/3600),mx=Math.floor(sx%3600/60);dp.insertAdjacentHTML('afterend','<div class="pofa">⏱ '+LFI.tr('A oferta termina em')+' '+(dx?dx+' d '+hx+' h':hx?hx+' h '+mx+' min':mx+' min')+'</div>')}
    var buy=det.querySelector('.buy'),ex='';
    var A=p.tipo==='acessorio'?[]:accs();if(A.length)ex+='<div class="pcb"><h3>'+LFI.tr('Combina com')+'</h3>'+A.map(accItem).join('')+'</div>';
    if(ex&&buy)buy.insertAdjacentHTML('afterend',ex);
    if(p.tipo!=='acessorio'){m.insertAdjacentHTML('beforeend','<section class="prv" id="prv" data-ref="'+esc(ref)+'"><div class="rv0">'+LFI.tr('Carregando avaliações…')+'</div></section>');avalCarrega(ref)}}
  function st5(n){var s='';for(var i=1;i<=5;i++)s+=i<=Math.round(n)?'★':'<i>★</i>';return '<span class="st5">'+s+'</span>'}
  function avalCarrega(ref){
    acFetch(fnUrl('avaliacao')+'?ref='+encodeURIComponent(ref)).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){avalPinta(ref,j&&j.ok?j:{n:0})}).catch(function(){avalPinta(ref,{n:0})})}
  function avalPinta(ref,j){var s=$('prv');if(!s||s.getAttribute('data-ref')!==ref)return;
    var n=j.n||0,dist=j.dist||[0,0,0,0,0];
    s.innerHTML='<div class="rh"><div class="rs"><span class="glb" style="letter-spacing:.14em;font-size:11px;font-weight:700;color:var(--ac)">'+LFI.tr('AVALIAÇÕES')+'</span>'+(n?'<b class="rn">'+String(j.media).replace('.',',')+'</b>'+st5(j.media)+'<div style="color:var(--mu);font-size:13px">'+n+' '+LFI.tr(n===1?'avaliação de quem comprou':'avaliações de quem comprou')+'</div>'+[5,4,3,2,1].map(function(k,i){var pc=n?Math.round(dist[i]/n*100):0;return '<div class="rbar">'+k+'★<u><i style="width:'+pc+'%"></i></u>'+pc+'%</div>'}).join(''):'<p class="rv0" style="margin:8px 0 0">'+LFI.tr('Ainda sem avaliações. Comprou esta peça? Conte o que achou.')+'</p>')+
      '<button type="button" class="rw" data-arw>'+LFI.tr('Escrever avaliação')+'</button></div><div class="rl" id="prvl">'+(j.itens||[]).map(function(a){return '<div class="r"><div class="rt"><span><b>'+esc(a.nome)+'</b>'+(a.cidade?' · '+esc(a.cidade):'')+'</span>'+st5(a.nota)+'</div><div class="vf">✓ '+LFI.tr('Compra verificada')+(a.via==='delivery'?' · delivery':a.via?' · '+LFI.tr('retirou na loja'):'')+'</div>'+(a.txt?'<p>'+esc(a.txt)+'</p>':'')+'</div>'}).join('')+'</div></div>'}
  function avalForm(){
    var s=$('prv');if(!s)return;var ref=s.getAttribute('data-ref');
    if(!logado()){toast(LFI.tr('Entre na sua conta para avaliar.'));try{AUTH_VOLTA=false}catch(_){}cadastrarTela();return}
    var l=$('prvl');l.insertAdjacentHTML('afterbegin','<div class="rv0" id="prvw">'+LFI.tr('Conferindo a sua compra…')+'</div>');
    idTok().then(function(tk){return acFetch(fnUrl('avaliacao'),{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tk},body:JSON.stringify({acao:'posso',ref:ref})})}).then(function(r){return r.json()}).then(function(j){
      var w=$('prvw');if(!w)return;
      if(!j||!j.ok){w.textContent=LFI.tr('Não consegui abrir agora. Tente de novo mais tarde.');return}
      if(!j.pode){w.textContent=LFI.tr(j.motivo==='email'?'Confirme o seu e-mail para avaliar.':'Só quem comprou esta peça pela loja pode avaliar.');return}
      V5.an=j.ja?j.ja.nota:5;var c=getConta()||{};
      w.outerHTML='<form id="prvf"><b>'+LFI.tr('Sua avaliação')+'</b><div class="stp">'+[1,2,3,4,5].map(function(k){return '<button type="button" data-arst="'+k+'" class="'+(k<=V5.an?'on':'')+'" aria-label="'+k+'">★</button>'}).join('')+'</div><textarea id="prvt" maxlength="500" placeholder="'+LFI.tr('O que achou da peça? (opcional)')+'">'+esc(j.ja&&j.ja.txt||'')+'</textarea><input type="hidden" id="prvc" value="'+esc(c.cidade||'')+'"><button type="button" class="go" data-arok>'+LFI.tr('Publicar avaliação')+'</button></form>'}).catch(function(){var w=$('prvw');if(w)w.textContent=LFI.tr('Não consegui abrir agora. Tente de novo mais tarde.')})}
  function avalEstrela(k){V5.an=k;document.querySelectorAll('#prvf [data-arst]').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-arst')<=k)})}
  function avalEnvia(){var s=$('prv');if(!s)return;var ref=s.getAttribute('data-ref');
    idTok().then(function(tk){return acFetch(fnUrl('avaliacao'),{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tk},body:JSON.stringify({acao:'avaliar',ref:ref,nota:V5.an||5,txt:($('prvt')||{}).value||'',cidade:($('prvc')||{}).value||''})})}).then(function(r){return r.json()}).then(function(j){
      if(!j||!j.ok)throw 0;toast(LFI.tr('Obrigado! Sua avaliação foi publicada.'));avalCarrega(ref)}).catch(function(){toast(LFI.tr('Não consegui publicar agora. Tente de novo mais tarde.'))})}


  /* v452: altura do cabeçalho (a página da peça e a conta abrem logo abaixo dele) */
  /* S430 MEDIDA ÚNICA DO TOPO: --hth = onde o topo termina NA TELA, agora (unidade da página). Toda tela que abre por cima começa nela.
     O topo fica embaixo da faixa quando a página está no alto e sobe quando ela rola; por isso a medida acompanha rolagem, tamanho, letra e telas abertas. */
  window.lfHt=function(){var t=document.querySelector('.top');if(!t)return 0;var z=parseFloat(getComputedStyle(document.body).zoom)||1;return Math.max(0,Math.round(t.getBoundingClientRect().bottom/z*100)/100)};
  (function(){var q=0,f=function(){q=0;var v=lfHt();if(!v)return;var r=document.documentElement.style,px=v+'px';if(r.getPropertyValue('--hth')!==px){r.setProperty('--hth',px);r.setProperty('--ht',px)}},logo=function(){if(!q)q=requestAnimationFrame(f)};
    f();addEventListener('resize',logo);addEventListener('scroll',logo,{passive:true});addEventListener('lf:topo',logo);
    new MutationObserver(logo).observe(document.documentElement,{attributes:true,attributeFilter:['class','style']});
    var ly=document.getElementById('layer');if(ly)new MutationObserver(logo).observe(ly,{childList:true});
    if(window.ResizeObserver){var t=document.querySelector('.top');if(t)new ResizeObserver(logo).observe(t)}setTimeout(logo,800)})();
  /* v452: aquecimento da Black Friday — contagem para o começo (o site fica normal até a hora) */
  function bfAq(){var e=CFG.evento;if(!e||e.tema!=='bf'||!(+e.aq>0)||!(+e.ini>0))return null;var t=Date.now();return t>=+e.aq&&t<+e.ini?e:null}
  function bfPartes(ms){var s=Math.max(0,Math.floor(ms/1000));return [Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60]}
  function bfAqHtml(e){var q=bfPartes(+e.ini-Date.now());return '<section class="hbfq" id="hdst"><span class="hlb">'+LFI.tr('PREPARE-SE')+'</span><h1>BLACK <em>FRIDAY</em></h1><p>'+LFI.tr('Começa em')+'</p><div class="bq" data-bfq>'+[[q[0],'DIAS'],[q[1],'HORAS'],[q[2],'MIN'],[q[3],'SEG']].map(function(x){return '<div><b>'+dd(x[0])+'</b><small>'+LFI.tr(x[1])+'</small></div>'}).join('')+'</div><button type="button" data-bfav>'+LFI.tr('Me avise quando começar')+'</button></section>'}
  var _dstHtml5=dstHtml;dstHtml=function(){var e=bfAq();return e?bfAqHtml(e):_dstHtml5()};
  var _evAplica5=evAplica;evAplica=function(){var r=_evAplica5(),q=bfAq(),b=$('evbar');document.documentElement.classList.toggle('bfq',!!q);
    if(q&&b){var p=bfPartes(+q.ini-Date.now()),tx='⚡ BLACK FRIDAY '+LFI.tr('começa em')+' '+(p[0]?p[0]+' d ':'')+p[1]+' h '+dd(p[2])+' min';if(b._t!==tx){b._t=tx;b.textContent=tx}}return r};
  setInterval(function(){if(document.hidden)return;var q=bfAq(),c=document.querySelector('#home [data-bfq]');
    if(!q){if(c||document.documentElement.classList.contains('bfq')){evAplica();homeDraw()}return}
    if(c){var p=bfPartes(+q.ini-Date.now());c.querySelectorAll('b').forEach(function(b,i){var v=dd(p[i]);if(b.textContent!==v)b.textContent=v})}
    var b=$('evbar');if(b){var p2=bfPartes(+q.ini-Date.now()),tx='⚡ BLACK FRIDAY '+LFI.tr('começa em')+' '+(p2[0]?p2[0]+' d ':'')+p2[1]+' h '+dd(p2[2])+' min';if(b._t!==tx){b._t=tx;b.textContent=tx}}},1000);
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-bfav]');if(!t)return;var f=$('hnf');if(f){f.scrollIntoView({behavior:'smooth',block:'center'})}});

  /* v452: Idioma e Texto do menu (linhas de ajuste + folha de opções) */
  (function(){
    var nv=document.querySelector('#drw nav');if(!nv||$('dset'))return;
    var GL='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>';
    var LG={auto:'Automático',es:'Español',pt:'Português'};
    function lgAt(){try{var v=localStorage.getItem('lf_lang');return v==='es'||v==='pt'?v:'auto'}catch(_){return 'auto'}}
    var d=document.createElement('div');d.className='dset';d.id='dset';nv.insertAdjacentElement('afterend',d);
    function pinta(){d.innerHTML='<button type="button" data-dset="lg">'+GL+'<span>'+LFI.tr('Idioma')+'</span><b>'+LFI.tr(LG[lgAt()])+'</b><i>›</i></button>'}
    pinta();$('mnb').addEventListener('click',pinta);
    var sh=document.createElement('div');sh.id='dsh';document.body.appendChild(sh);
    function abre(k){var h;if(k==='lg'){var a=lgAt();h='<h4>'+LFI.tr('Idioma')+'</h4>'+['auto','es','pt'].map(function(v){return '<button type="button" class="op" data-lg="'+v+'">'+(v==='auto'?LFI.tr('Automático'):LG[v])+(v===a?'<b>✓</b>':'')+'</button>'}).join('')}
      sh.innerHTML='<div class="dsc2" data-dsx></div><div class="dsp" role="dialog" aria-modal="true"><div class="gr"></div>'+h+'</div>';sh.classList.add('on')}
    function fecha(){sh.classList.remove('on');sh.innerHTML='';pinta()}
    d.addEventListener('click',function(e){var b=e.target.closest('[data-dset]');if(b)abre(b.getAttribute('data-dset'))});
    sh.addEventListener('click',function(e){if(e.target.closest('[data-dsx]'))setTimeout(fecha,0)});
  })();
  setTimeout(homeDraw,0);

  /* v453: cada página com o seu endereço (sem #), no idioma de quem está navegando.
     PT /oculos /catalogo /sol /grau /armacoes /ofertas /feminino… /sol-feminino /p/REF ; ES /lentes /tienda /lentes-de-sol … /modelo/REF.
     A prévia do WhatsApp sai no idioma do endereço (páginas geradas pelo robô tools/gen_produtos.py). */
  var RT={pt:{home:'oculos',vitrine:'catalogo',rosto:'formato',atacado:'atacado',como:'como-comprar',duvidas:'duvidas',p:'p',t:{solar:'sol',grau:'grau',armacao:'armacoes',of:'ofertas'},g:{f:'feminino',m:'masculino',u:'unissex'}},
    es:{home:'lentes',vitrine:'tienda',rosto:'tu-forma',atacado:'mayorista',como:'como-compro',duvidas:'dudas',p:'modelo',t:{solar:'lentes-de-sol',grau:'lectura',armacao:'armazones',of:'descuentos'},g:{f:'mujer',m:'hombre',u:'unisex'}}};
  var RTM=null,RTOK=false;
  function rtL(){return RT[LFI.lang==='es'?'es':'pt']}
  function rtMapa(){if(RTM)return RTM;RTM={};['pt','es'].forEach(function(lg){var R=RT[lg];RTM[R.home]={home:1};
    ['vitrine','rosto','atacado','como','duvidas'].forEach(function(id){RTM[R[id]]={pan:id}});
    Object.keys(R.t).forEach(function(t){RTM[R.t[t]]={pan:'vitrine',tipo:t};Object.keys(R.g).forEach(function(g){RTM[R.t[t]+'-'+R.g[g]]={pan:'vitrine',tipo:t,gen:g}})});
    Object.keys(R.g).forEach(function(g){RTM[R.g[g]]={pan:'vitrine',gen:g}})});
    /* endereços antigos (07/11: recetados → lectura) */
    RTM['recetados']={pan:'vitrine',tipo:'grau'};['mujer','hombre','unisex'].forEach(function(g,i){RTM['recetados-'+g]={pan:'vitrine',tipo:'grau',gen:'fmu'[i]}});return RTM}
  function rtSlug(){var R=rtL(),pp=document.querySelector('.sec.pop');if(!pp||!PAN[pp.id])return '';/* 08/11: início é só lafouch.com (/oculos e /lentes antigos continuam abrindo o início) */
    if(pp.id!=='vitrine')return R[pp.id];
    var t=R.t[st.tipo]||'',g=R.g[st.gen]||'';return t&&g?t+'-'+g:(t||g||R.vitrine)}
  function rtProd(ref){return '/'+rtL().p+'/'+encodeURIComponent(ref)}
  function rtUrl(id){var R=rtL();return 'https://lafouch.com/'+(R[id]&&typeof R[id]==='string'&&id!=='home'?R[id]:'')}
  window.rtUrl=rtUrl;
  function urlSync(){if(document.getElementById('gw'))return;if(!RTOK||prodOpen||document.documentElement.classList.contains('bootprod'))return;
    var sl=rtSlug(),qs=new URLSearchParams(location.search);['r','busca','ref','carrinho','conta','v'].forEach(function(k){qs.delete(k)});
    var pp=document.querySelector('.sec.pop'),q=String(st.q||'').trim();if(pp&&pp.id==='vitrine'&&q)qs.set('busca',q);
    var sq=qs.toString(),u='/'+sl+(sq?'?'+sq.replace(/=(&|$)/g,'$1'):'');
    if(location.pathname+location.search+location.hash!==u){try{history.replaceState(history.state,'',u)}catch(_){}}}
  var _drawGrid6=drawGrid;drawGrid=function(){_drawGrid6.apply(this,arguments);try{urlSync()}catch(_){}};
  addEventListener('popstate',function(){setTimeout(function(){try{urlSync()}catch(_){}},0)});
  /* entrada: /?r=<endereço> (vem da página do robô ou do 404.html); links antigos com #vitrine continuam abrindo o painel */
  /* favoritos a partir da página da peça: volta ao catálogo mostrando só os favoritos */
  /* v453: o coração da barra da peça abre a folha "Meus favoritos" por cima da peça (aprovado 07/11) */
  var FSH=null;
  function fshRows(){var L=Object.keys(st.fav).map(find).filter(Boolean);
    return '<h4>'+LFI.tr('Meus favoritos')+' ('+L.length+')</h4><div class="fl">'+L.map(function(p){return '<div class="fr"><button type="button" data-fsopen="'+esc(p.ref)+'"><span class="fi">'+img5(p)+'</span><span class="ft"><b>'+esc(p.nome)+'</b><span class="fpz">'+LFI.fmt(p.n)+'</span></span></button><button type="button" class="fh" data-fav="'+esc(p.ref)+'" aria-label="'+LFI.tr('Tirar dos favoritos')+'"><svg width="22" height="22" viewBox="0 0 24 24"><path d="'+FAV_HP+'"/></svg></button></div>'}).join('')+'</div><button type="button" class="flk" data-fscat>'+LFI.tr('Ver todos no catálogo')+'</button>'}
  function fshAbre(){if(!FSH){FSH=document.createElement('div');FSH.id='fvs';document.body.appendChild(FSH);
      FSH.addEventListener('click',function(e){var t=e.target;
        if(t.closest('[data-fsx]')){fshFecha();return}
        var o=t.closest('[data-fsopen]');if(o){var r=o.getAttribute('data-fsopen');fshFecha();if(find(r))product(r);return}
        if(t.closest('[data-fscat]')){fshFecha();closeLayer();setTimeout(function(){st.tipo='fav';st.gen='';st.col='';st.rosto='';try{drawGen();drawChips()}catch(_){}openPanel('vitrine',true);drawGrid()},80);return}
        if(t.closest('[data-fav]'))setTimeout(function(){if(!Object.keys(st.fav).length){fshFecha();return}var p=FSH.querySelector('.dsp');if(p)p.innerHTML='<div class="gr"></div>'+fshRows()},0)})}
    FSH.innerHTML='<div class="dsc2" data-fsx></div><div class="dsp" role="dialog" aria-modal="true"><div class="gr"></div>'+fshRows()+'</div>';FSH.classList.add('on')}
  function fshFecha(){if(FSH){FSH.classList.remove('on');FSH.innerHTML=''}}
  window.__fshAbre=fshAbre;
  /* o coração do catálogo também abre a folha "Meus favoritos" */
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#ftog');if(!b)return;e.preventDefault();e.stopPropagation();if(Object.keys(st.fav).length)fshAbre()},true);
  /* Novidades (07/11, opção A com botão 2a): um botão suave de WhatsApp e o link "Prefiro por e-mail" que abre o campo ali mesmo */
  var WAI5='<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';
  function newsForm(){if(V5.nok)return '<div class="nok">✓ '+LFI.tr(V5.nok)+'</div>';
    var w='<button type="button" class="nwb" data-news="wa">'+WAI5+LFI.tr('Receber pelo WhatsApp')+'</button>';
    return V5.nm==='em'?w+'<div class="nem"><input type="email" id="hnem" placeholder="'+LFI.tr('seu@email.com')+'" autocomplete="email" aria-label="'+LFI.tr('Seu e-mail')+'"><button type="button" data-news="em">'+LFI.tr('Avisar')+'</button></div>'
      :w+'<button type="button" class="nlk" data-nm="em">'+LFI.tr('Prefiro por e-mail')+'</button>'};
  /* Guia: cartões que levam às páginas (formato do rosto, atacado) e o "Guia La Fouch" do menu, que rola até a seção do Guia */
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-gpan],[data-hguia]');if(!t)return;e.preventDefault();
    if(t.hasAttribute('data-gpan')){goTo(t.getAttribute('data-gpan'));return}
    try{closePanels()}catch(_){}setTimeout(function(){var g=$('hguia');if(!g)return;var hh=(document.querySelector('.top')||{}).offsetHeight||80;window.scrollTo({top:g.getBoundingClientRect().top+scrollY-hh-12,behavior:'smooth'})},120)});
  /* rodapé novo também no catálogo */
  var _openPanel5=openPanel;openPanel=function(id,q){_openPanel5(id,q);if(id==='vitrine'){var vs=$('vscr');if(vs&&!vs.querySelector(':scope>.lfft')){vs.insertAdjacentHTML('beforeend',rodape5())}}};
  /* Filtrar (opção C) */
  function fltPinta(){var T=$('fstT');if(!T)return;var B=function(attr,v,on,t){return '<button type="button" '+attr+'="'+v+'" class="'+(on?'on':'')+'" aria-pressed="'+on+'">'+LFI.tr(t)+'</button>'};
    var tem=function(t){return P.some(function(p){return p.tipo===t&&vis5(p)})};
    var tp=st.tipo==='fav'||st.tipo==='of'?'':st.tipo;
    T.innerHTML=[['todos','Todos'],['solar','Solar'],['grau','Leitura'],['armacao','Armações']].filter(function(x){return x[0]==='todos'||tem(x[0])||st.tipo===x[0]}).map(function(x){return B('data-ftp',x[0],tp===x[0],x[1])}).join('');
    $('fstG').innerHTML=[['','Todos'],['f','Feminino'],['m','Masculino'],['u','Unissex']].map(function(x){return B('data-fgn',x[0],st.gen===x[0],x[1])}).join('');
    $('fstO').innerHTML=[['nov','Novidades'],['menor','Menor preço'],['maior','Maior preço']].map(function(x){return B('data-fso',x[0],st.sort===x[0],x[1])}).join('')}
  var _drawGrid7=drawGrid;drawGrid=function(){_drawGrid7.apply(this,arguments);try{fltPinta()}catch(_){}};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('#fsh [data-ftp],#fsh [data-fgn],#fsh [data-fso],#fsh [data-fclr]');if(!t)return;e.preventDefault();e.stopPropagation();
    if(t.hasAttribute('data-ftp')){st.tipo=t.getAttribute('data-ftp');st.col='';drawChips()}
    else if(t.hasAttribute('data-fgn')){st.gen=t.getAttribute('data-fgn');drawGen()}
    else if(t.hasAttribute('data-fso')){st.sort=t.getAttribute('data-fso');try{$('sort').value=st.sort}catch(_){}}
    else{st.tipo='todos';st.gen='';st.sort='nov';st.col='';st.rosto='';try{$('sort').value='nov'}catch(_){}drawChips();drawGen()}
    drawGrid()},true);
  $('fbtn').addEventListener('click',fltPinta);
  /* v453: arrastar para baixo nas folhas (Idioma, Favoritos): a folha acompanha o dedo; passou de 1/3 ou gesto rápido = fecha; senão volta com um leve quique.
     Na lista de favoritos só arrasta quando a lista está no topo (rolar a lista não fecha). Fecha "tocando" no fundo, que é como cada folha já fecha. */
  (function(){var D=null,SUP=0;
    function fim(d,fecha){var p=d.p,bg=d.bg;
      if(fecha){p.style.transition='transform .24s cubic-bezier(.4,0,1,1)';p.style.transform='translateY('+(d.h+30)+'px)';if(bg){bg.style.transition='opacity .24s ease';bg.style.opacity='0'}setTimeout(function(){if(bg&&bg.isConnected)bg.click();/* folha que continua na página (Filtrar): limpa o arrasto depois de fechar */setTimeout(function(){if(p.isConnected){p.style.transition='none';p.style.transform='';if(bg)bg.style.opacity='';void p.offsetWidth;p.style.transition='';if(bg)bg.style.transition=''}},60)},230)}
      else{p.style.transition='transform .45s cubic-bezier(.2,1.35,.4,1)';p.style.transform='translateY(0)';if(bg){bg.style.transition='opacity .3s ease';bg.style.opacity='1'}setTimeout(function(){if(p.isConnected){p.style.transition='';p.style.transform='';if(bg){bg.style.opacity='';bg.style.transition=''}}},460)}}
    document.addEventListener('touchstart',function(e){var p=e.target.closest&&e.target.closest('#dsh .dsp,#fvs .dsp,#fsh .fpn');if(!p||e.touches.length!==1){D=null;return}
      D={p:p,bg:p.parentNode.querySelector('.dsc2,.fsc'),y0:e.touches[0].clientY,x0:e.touches[0].clientX,fl:e.target.closest('.fl')||(p.scrollHeight>p.clientHeight+2?p:null),on:false,dy:0,t:[],h:p.offsetHeight||300}},{passive:true});
    document.addEventListener('touchmove',function(e){if(!D)return;var y=e.touches[0].clientY,dy=y-D.y0;
      if(!D.on){if(Math.abs(dy)<7&&Math.abs(e.touches[0].clientX-D.x0)<7)return;
        if(dy<=0||Math.abs(e.touches[0].clientX-D.x0)>Math.abs(dy)||(D.fl&&D.fl.scrollTop>0)){D=null;return}
        D.on=true;D.y0=y;dy=0;D.p.style.animation='none';D.p.style.transition='none';if(D.bg){D.bg.style.animation='none';D.bg.style.transition='none'}}
      if(e.cancelable)e.preventDefault();
      var v=dy<0?dy*.18:dy;D.dy=v;D.p.style.transform='translateY('+v+'px)';if(D.bg)D.bg.style.opacity=String(Math.max(0,1-v/D.h));
      D.t.push([e.timeStamp,y]);if(D.t.length>6)D.t.shift()},{passive:false});
    function solta(){if(!D)return;var d=D;D=null;if(!d.on)return;SUP=Date.now();
      var vel=0;if(d.t.length>1){var a=d.t[0],b=d.t[d.t.length-1];vel=(b[1]-a[1])/Math.max(1,b[0]-a[0])}
      fim(d,d.dy>d.h/3||(vel>.55&&d.dy>20))}
    document.addEventListener('touchend',solta,{passive:true});document.addEventListener('touchcancel',solta,{passive:true});
    /* depois de arrastar, o dedo solto não conta como toque num item */
    document.addEventListener('click',function(e){if(Date.now()-SUP<350&&e.target.closest&&e.target.closest('#dsh .dsp,#fvs .dsp,#fsh .fpn')){e.stopPropagation();e.preventDefault()}},true);
  })();
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-pgfav]');if(!b)return;e.preventDefault();e.stopPropagation();fshAbre()},true);
  function rtEntra(){RTOK=true;var qs=new URLSearchParams(location.search),sl=(qs.get('r')||'').toLowerCase().replace(/[^a-z0-9-]/g,''),m=sl&&rtMapa()[sl],bq=qs.get('busca');
    /* 09/11: página própria da consulta do grau (atualizar reabre a consulta) */
    if(sl==='descubra-o-grau'||sl==='descubri-tu-graduacion'){try{history.replaceState(null,'','/')}catch(_){}document.documentElement.classList.remove('bootp');/* S163: o Início não aparece antes; a consulta entra subindo, como as outras abas ao atualizar */document.documentElement.classList.add('bootgz');setTimeout(function(){document.documentElement.classList.remove('bootgz')},5000);var tg=0,ab=function(){if(window.__lfGzAbre){window.__lfGzAbre()}else if(tg++<40)setTimeout(ab,100);else document.documentElement.classList.remove('bootgz')};setTimeout(ab,60);return}
    if(m&&m.pan){if(m.pan==='vitrine'){st.tipo=m.tipo||'todos';st.gen=m.gen||'';st.col='';st.rosto='';if(bq){st.q=bq;try{$('q').value=bq;$('q2').value=bq}catch(_){}}try{drawGen();drawChips();drawFaces()}catch(_){}}window.__lfQuiet=1;try{openPanel(m.pan,true)}finally{window.__lfQuiet=0}if(m.pan==='vitrine')drawGrid()}
    document.documentElement.classList.remove('bootp');setTimeout(function(){try{urlSync()}catch(_){}},0)}

  /* giro 360° (vídeo guardado no site pelo app): toca no lugar da foto; tocar de novo volta para a foto */
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-g360]');if(!b)return;e.preventDefault();e.stopPropagation();
    var big=b.closest('.big'),p=find(b.getAttribute('data-g360'));if(!big||!p||!p.gv)return;var v=big.querySelector('.g360v');
    if(v){v.remove();b.classList.remove('on');return}
    v=document.createElement('video');v.className='g360v';v.muted=true;v.defaultMuted=true;v.loop=true;v.playsInline=true;v.autoplay=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.disablePictureInPicture=true;
    v.addEventListener('error',function(){v.remove();b.classList.remove('on');toast('Não deu para abrir o giro agora.')});
    v.src='/'+String(p.gv).replace(/^\/+/,'');big.appendChild(v);b.classList.add('on');var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})},true);
  /* o olho da senha não rouba o foco do campo: o teclado do celular continua aberto */
  ['pointerup','pointercancel','pointerleave'].forEach(function(ev){document.addEventListener(ev,function(){document.querySelectorAll('.pwo.pr').forEach(function(b){b.classList.remove('pr')})},true)});
  document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('.pwo');if(b&&e.pointerType!=='mouse')b.classList.add('pr')},true);
  ['pointerdown','mousedown'].forEach(function(ev){document.addEventListener(ev,function(e){if(e.target.closest&&e.target.closest('.pwo')&&e.cancelable)e.preventDefault()},{passive:false})});
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-cta],[data-ent],[data-pgcopy],[data-pgc2],[data-pgsave]');if(!t)return;
    if(t.hasAttribute('data-pgc2')){var v2=t.getAttribute('data-pgc2'),o2=t.textContent;try{navigator.clipboard.writeText(v2).then(function(){t.textContent='Copiado ✓';setTimeout(function(){t.textContent=o2},1600)},function(){t.textContent='Copie manualmente'})}catch(_){t.textContent='Copie manualmente'}return}
    if(t.hasAttribute('data-pgsave')){var q=window.__pgqr;if(!q)return;try{fetch(q).then(function(r){return r.blob()}).then(function(bl){var fl=new File([bl],'QR-LaFouch.jpg',{type:bl.type||'image/jpeg'});if(navigator.canShare&&navigator.canShare({files:[fl]}))return navigator.share({files:[fl],title:'QR La Fouch'}).catch(function(){});var u=URL.createObjectURL(bl),a=document.createElement('a');a.href=u;a.download='QR-LaFouch.jpg';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);toast('QR salvo')})}catch(_){toast('Mantenha o dedo sobre o QR para salvar')}return}
    if(t.hasAttribute('data-pgcopy')){var v=window.__pgcode||'';try{navigator.clipboard.writeText(v).then(function(){t.textContent='Código copiado ✓'},function(){t.textContent='Selecione e copie manualmente'})}catch(_){t.textContent='Não deu para copiar'}return}
    if(t.hasAttribute('data-ent')){entCampos();st.ent=t.getAttribute('data-ent');bag(true);return}
    var a=t.getAttribute('data-cta');
    if(a==='conta')minhaConta('perfil');
    else if(a==='endpick'){st.endIdx=+t.getAttribute('data-i')||0;bag(true)}else if(a==='endnovo'){st.endMode='novo';st.endD=null;bag(true)}else if(a==='endsalvo'){entCampos();st.endMode='';bag(true)}
    else if(a==='irpag')irPag();else if(a==='cfedados'){st.voltaPag=1;minhaConta('perfil')}else if(a==='voltarent'){st.step='ent';bag()}else if(a==='pg'){st.pag=t.getAttribute('data-v');bag(true)}else if(a==='trpick'){st.tr=t.getAttribute('data-v');st.trFora='';st.entSalva=0;bag(true)}
    else if(a==='mcaba')minhaConta(t.getAttribute('data-a'));else if(a==='mcsalvar')mcSalvar();else if(a==='mcended')minhaConta('ends',t.getAttribute('data-i'));else if(a==='mcendok')mcEndSalvar(t.getAttribute('data-i'));
    else if(a==='mcendrm'){var ri=+t.getAttribute('data-i');dlgAbre('<h3>Remover este endereço?</h3><p>'+endLinha((contaNorm(getConta()).ends||[])[ri]||{})+'</p><div class="dlga"><button type="button" class="dc" data-dlgx>Cancelar</button><button type="button" class="dk dr" data-cta="mcendrm2" data-i="'+ri+'">Remover</button></div>')}
    else if(a==='mcendrm2'){var c9=contaNorm(getConta());c9.ends.splice(+t.getAttribute('data-i'),1);dlgFecha();contaGrava(c9).then(function(){minhaConta('ends')})}
    else if(a==='codok')codConfere();else if(a==='codre')codigoTela();else if(a==='codtroca'){authSair();AUTH_VOLTA=AUTH_VOLTA&&Object.keys(st.cart).length>0;cadastrarTela()}else if(a==='codlink'){var s8=sessG();if(s8){s8.exp=0;lsS('lf_auth',s8)}emailOk().then(function(ok){if(ok)emailFeito();else toast('Ainda não confirmado. Toque no link do e-mail.')})}
    else if(a==='endsel'){st.endMode='saved';st.endIdx=+t.getAttribute('data-i')||0;bag(true)}else if(a==='endman'){st.endMode='manual';st.endE='';bag(true);var fe=$('fa2');if(fe)fe.focus()}else if(a==='endsav'){st.endMode='saved';bag(true)}else if(a==='pkcanc'){var pci=t.getAttribute('data-id');window.__pgc=!!pci;if(pci)window.__pgid=pci;dlgAbre('<h3>Cancelar este pedido?</h3><p>As peças reservadas voltam para a loja. Se você já pagou, não cancele: fale com um vendedor.</p><p class="dlgerr" id="dlgerr" hidden></p><div class="dlga"><button type="button" class="dc" data-dlgx>Voltar</button><button type="button" class="dk dr" data-cta="pkcanc2">Cancelar pedido</button></div>')}else if(a==='pkcanc2'){pkCancela()}else if(a==='pkcanc3'){pkCancelado(window.__pgid)}else if(a==='prosseguir'){if(Object.keys(st.cart).length){if(!logado()){AUTH_VOLTA=true;cadastrarTela()}else emailOk().then(function(ok){AUTH_VOLTA=true;if(ok){st.step='ent';bag()}else codigoTela()})}}else if(a==='voltarcart'){gdSave();st.step='cart';bag()}else if(a==='entrar')entrarTela(t.getAttribute('data-volta')==='1'||AUTH_VOLTA);
    else if(a==='cadastrar')cadastrarTela();
    else if(a==='esqueci')esqueciTela();
    else if(a==='login')authEntrar();
    else if(a==='criar')authCriar();
    else if(a==='reset')authReset();
    else if(a==='olho'){var pi=t.parentNode.querySelector('input');if(pi){var sh=pi.type==='password';pi.type=sh?'text':'password';t.classList.toggle('on',sh);t.setAttribute('aria-pressed',sh?'true':'false');t.setAttribute('aria-label',sh?'Ocultar senha':'Mostrar senha')}}
    else if(a==='salvar')contaSalvar(t.getAttribute('data-volta')==='1');
    else if(a==='minha'){/* S429 (menu v3): "Meus pedidos ›" encurtado abre direto a aba Pedidos */if(e.target.closest&&e.target.closest('#dacs[data-lfc]'))minhaConta('peds');else if(!contaJaAberta(t))minhaConta()}
    else if(a==='google')gEntrar();
    else if(a==='gsync')gSync();
    else if(a==='gunlink')gUnlink(t.getAttribute('data-pw')==='1');else if(a==='gunlink2')gUnlink2(t.getAttribute('data-nopw')==='1');else if(a==='exc')excAbre();else if(a==='exc2')excFaz();
    else if(a==='cont'){if(t.getAttribute('data-volta')==='1')bag();else closeLayer()}
    else if(a==='sair'){authSair();closeLayer();toast('Você saiu da conta.')}
    else if(a==='ped'){var id=t.getAttribute('data-id');var po=$('pkok');if(po)po.remove();closeLayer();pkAbre(id)}
    else if(a==='pedaval'){var idv=t.getAttribute('data-id');var pov=$('pkok');if(pov)pov.remove();closeLayer();pkAbre(idv);setTimeout(function(){var q=document.querySelector('#pkok .opd');if(q)try{q.scrollIntoView({block:'start',behavior:'smooth'})}catch(_){q.scrollIntoView()}},500)}
    else if(a==='teste0'){try{localStorage.removeItem('lf_teste')}catch(_){}location.search='';}
  });
  document.addEventListener('click',function(e){var t=e.target;if(t.closest&&t.closest('.cdq,.cds'))return;var b=t.closest&&t.closest('[data-cdb]'),o=t.closest&&t.closest('.cdl li[data-v]');
    document.querySelectorAll('.cdd.open').forEach(function(d){if(!b||d!==b.parentNode){d.classList.remove('open');d.querySelector('.cdl').hidden=true;d.querySelector('.cdb').setAttribute('aria-expanded','false')}});
    if(b){var d=b.parentNode,ab=!d.classList.contains('open'),ul=d.querySelector('.cdl');d.classList.toggle('open',ab);ul.hidden=!ab;b.setAttribute('aria-expanded',ab?'true':'false');
      if(ab){var rc=b.getBoundingClientRect(),bx=innerHeight-rc.bottom;d.classList.toggle('up',bx<260&&rc.top>bx);var q=ul.querySelector('.cdq input');if(q){q.value='';cddFiltra(q);if(matchMedia('(hover:hover) and (pointer:fine)').matches)try{q.focus()}catch(_){}}
        var sl=ul.querySelector('li[aria-selected=true]');if(sl&&d.classList.contains('cdg'))try{sl.scrollIntoView({block:'nearest'})}catch(_){}}}
    else if(o){var d2=o.closest('.cdd'),i=d2.querySelector('input'),v=o.getAttribute('data-v');
      d2.querySelectorAll('li').forEach(function(x){x.setAttribute('aria-selected',x===o?'true':'false')});
      d2.querySelector('.cdb').innerHTML=flagH(v)+'<span class="cdt">'+o.getAttribute('data-s')+'</span>'+CHEV;
      d2.classList.remove('open');d2.querySelector('.cdl').hidden=true;d2.querySelector('.cdb').setAttribute('aria-expanded','false');
      if(i.value!==v){i.value=v;i.dispatchEvent(new Event('change',{bubbles:true}))}}});
  function cddFiltra(q){var ul=q.closest('.cdl'),v=cdN(q.value).replace(/^\+/,'').trim();ul.querySelectorAll('li[data-v]').forEach(function(li){li.hidden=!!v&&li.getAttribute('data-q').indexOf(v)<0});ul.querySelectorAll('.cds').forEach(function(x){x.hidden=!!v})}
  document.addEventListener('input',function(e){var t=e.target;if(t.closest&&t.closest('.cdq'))cddFiltra(t)});
  document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.closest&&e.target.closest('.cdq')){e.preventDefault();var f=[].filter.call(e.target.closest('.cdl').querySelectorAll('li[data-v]'),function(li){return !li.hidden})[0];if(f)f.click()}});
  document.addEventListener('input',function(e){var t=e.target;
    if(t.id==='cfd'){var nc=$('cfa2').value,ctp=docTipo('cf',getConta()||{});maskCampo(t,function(v){return maskDoc(nc,v,ctp)})}
    else if(t.id==='cfb')maskCampo(t,maskNasc);
    else if(t.id==='cfz')fnVivo(t,'cfp','cfzh');
    else if(t.id==='gz')fnVivo(t,'gpp','gzh');
    else if(t.id==='cfc'){t.setAttribute('data-ok','');t.setAttribute('data-cpais','');cidMsg('');cfpyUpd()}});
  document.addEventListener('focusout',function(e){if(e.target&&e.target.id==='cfc'&&e.target.value.trim().length>=3)cidConf()});
  document.addEventListener('change',function(e){var t=e.target;
    if(t.id==='cfa2'){cfpyUpd();var n=nacInfo(t.value),fd=$('cfd'),ctp=docTipo('cf',getConta()||{}),dt=$('cfdt');if(dt)dt.hidden=t.value!=='py';$('cfdl').textContent=docRot(t.value,ctp);fd.placeholder=docPh(t.value,ctp);fd.inputMode=NAC[t.value]?'numeric':'text';fd.value=maskDoc(t.value,fd.value,ctp);var p=$('cfp');if(p&&!$('cfz').value&&p.value!==t.value&&(!FN||FN[t.value])){cddSet('cfp',t.value)}}
    else if(t.id==='cfp'){var z=$('cfz');z.placeholder=fnEx(t.value);if(z.value&&!/^(\+|00)/.test(z.value.trim()))fnVivo(z,'cfp','cfzh')}else if(t.id==='gpp'){gdSave();var gz=$('gz');if(gz)gz.placeholder=fnEx(t.value);var gl=document.querySelector('label[for=gd]'),gd=$('gd');if(gl&&gd&&gl.firstChild){var n=nacInfo(t.value);gl.firstChild.nodeValue=n.d+' ';gd.placeholder=n.ph;gd.inputMode=NAC[t.value]?'numeric':'text'}}
    else if(t.id==='pgf'&&t.files&&t.files[0]){var id=(lsG('lf_ped',[]).filter(function(x){return x.est==='pagar'||x.est==='recusado'}).slice(-1)[0]||{}).id;if(window.__pgid)id=window.__pgid;if(id)enviarComp(id,t.files[0])}});
  (function(){contaBtn();
    if(TESTE){var z=document.createElement('div');z.id='testeb';z.innerHTML='MODO TESTE · pedidos marcados como teste <button type="button" data-cta="teste0">Sair do teste</button>';document.body.appendChild(z)}})();
  /*/CONTA*/
  /* S313: "Mais opções" da tela de pagar (abre e fecha no lugar) */
  document.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-pymais]');if(!t)return;var b=$('pyXb');if(!b)return;var ab=b.hidden;b.hidden=!ab;t.setAttribute('aria-expanded',ab?'true':'false');if(ab)setTimeout(function(){try{b.lastElementChild.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(_){}},60)});
  /* eventos */
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-tipo],[data-gen],[data-face],[data-open],[data-gr],[data-add],[data-addm],[data-dec],[data-inc],[data-rm],[data-send],[data-pkretry],[data-pkfim],[data-pkconta],[data-pkrenova],[data-pkrec],[data-pkshare],[data-pksave],[data-copy],[data-sw],[data-fav],[data-share],[data-cmp],[data-cmpopen],[data-cmpclear],[data-bag],[data-facem],[data-fa],[data-facam],[data-facap],[data-camz],[data-edit],[data-fause],[data-fagen],[data-fanew],[data-fawrong],[data-copymsg],[data-newsim],[data-close]');
    if(!t){return}
    var d=t.dataset;
    if(d.close!==undefined){if(t.classList.contains('scrim')&&e.target!==t)return;closeLayer();return}
    if(t.hasAttribute('data-gen')){st.gen=d.gen;drawGen();drawGrid()}
    else if(d.tipo){st.tipo=(d.tipo==='fav'&&st.tipo==='fav')?'todos':d.tipo;drawChips();drawGrid()}
    else if(d.face){var fi=FACES.map(function(x){return x.id}).indexOf(d.face);if(fi!==fk&&!matchMedia('(min-width:700px)').matches)faceGo(fi);else{st.rosto=st.rosto===d.face?'':d.face;drawFaces();drawGrid();goTo('vitrine')}}
    else if(d.facem){closeLayer();st.rosto=d.facem;drawFaces();drawGrid();goTo('vitrine')}
    else if(t.hasAttribute('data-facam')){faCam()}
    else if(t.hasAttribute('data-facap')){faSnap()}
    else if(t.hasAttribute('data-camz')){var zs=[1,1.5,2,3];CZ=zs[(zs.indexOf(CZ)+1)%zs.length];var cw=$('camw');if(cw)cw.style.setProperty('--cz',CZ);t.textContent=CZ+'×'}
    else if(t.hasAttribute('data-fa')||t.hasAttribute('data-fanew')){camStop();faOpen()}
    else if(d.edit){try{if(window.parent&&window.parent!==window)window.parent.postMessage({lfEdit:d.edit},location.origin);else location.href='admin.html?edit='+encodeURIComponent(d.edit)}catch(_){}}
    else if(t.hasAttribute('data-fagen')){faGen=d.fagen;document.querySelectorAll('[data-fagen]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.fagen===faGen)});var sb=document.querySelector('.fares .sub'),fu=document.querySelector('[data-fause]');if(sb&&fu)sb.innerHTML=faSub(fu.dataset.fause)}
    else if(d.fause){closeLayer();st.rosto=d.fause;st.gen=faGen;drawGen();drawFaces();drawGrid();goTo('vitrine')}
    else if(t.hasAttribute('data-fawrong')){closeLayer();goTo('rosto')}
    else if(d.fav){toggleFav(d.fav,t)}
    else if(d.share){shareProd(d.share)}
    else if(d.cmp){toggleCmp(d.cmp,t)}
    else if(t.hasAttribute('data-cmpopen')){if(st.cmp.length>1)compare()}
    else if(t.hasAttribute('data-cmpclear')){st.cmp=[];drawCmp()}
    else if(t.hasAttribute('data-bag')){var tt=t.closest('.toast');if(tt)tt.remove();st.step='cart';bag()}
    else if(d.gr!==undefined){var pg=find(d.ref);st.gr[d.ref]=+d.gr;var gn=document.getElementById('gn');if(gn)gn.textContent=pg.gr[+d.gr];t.parentNode.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b===t)});var gqn=t.closest('.dgr').querySelector('.gqn');if(gqn)gqn.remove();if(pg.gq&&pg.gq[+d.gr]>0&&pg.gq[+d.gr]<4){var ql=document.createElement('i');ql.className='gqn';ql.textContent=' '+pg.gq[+d.gr]+' un.';gn.parentNode.appendChild(ql)}}
    else if(d.sw!==undefined){var pp=find(d.ref);st.cor[d.ref]=+d.sw;var cnn=document.getElementById('cn');if(cnn)cnn.textContent=corNome(pp,+d.sw);document.querySelectorAll('#layer .cthn').forEach(function(x){x.textContent=corNome(pp,+d.sw)});var bg=t.closest('.modal').querySelector('.big');t.parentNode.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b===t)});t.closest('.modal').querySelectorAll('.cth button').forEach(function(b,k){b.classList.toggle('on',k===+d.sw)});if(pp.lib){var ix=+d.sw;colorFoto(pp,ix,function(u){var im=bg.querySelector('img.pf');if(im&&u&&st.cor[pp.ref]===ix)im.src=u})}try{ggMonta(pp)}catch(_){}}
    else if(d.open){product(d.open)}
    else if(d.add){add(d.add,t.closest('.card').querySelector('.ph'))}
    else if(d.addm){var qp=find(d.addm),qi=st.cor[d.addm]||0;if(qp&&qp.lib&&qp.qs&&qp.qs[qi]===0){toast('Essa cor está esgotada. Escolha outra cor.');return}var ph=t.closest('.modal').querySelector('.big');var p=find(d.addm);if(p.aviso==='Esgotado'){closeLayer();add(d.addm,ph);try{var ca=getConta();if(ca&&ca.tel&&ca.nome)pkEnviar({tipo:'avise',ref:p.ref,nome:ca.nome,tel:ca.tel,pais:ca.pais||'',ts:Date.now()},'av'+p.ref+'-'+String(ca.tel).replace(/\D/g,'')).then(function(){toast('Vamos te avisar quando chegar')},function(){})}catch(e){}}else{var bq=t.closest('.modal').querySelector('.buy');addDlg(p,ph,bq?+bq.getAttribute('data-q'):1)}}
    else if(d.inc){st.cart[d.inc]++;drawBag();bag(1)}
    else if(d.dec){if(st.cart[d.dec]<=1)return;st.cart[d.dec]--;drawBag();bag(1)}
    else if(d.rm){delete st.cart[d.rm];drawBag();bag(1)}
    else if(t.hasAttribute('data-send')){enviarPedido()}
    else if(t.hasAttribute('data-pkretry')){enviarPedido(true)}
    else if(t.hasAttribute('data-pkfim')){var po=$('pkok');if(po)po.remove();closeLayer()}
    else if(t.hasAttribute('data-pkrenova')){resRenova(t.getAttribute('data-pkrenova'))}
    else if(t.hasAttribute('data-pkconta')){var po2=$('pkok');if(po2)po2.remove();document.documentElement.classList.remove('lock');closeLayer();minhaConta()}
    else if(t.hasAttribute('data-pkrec')){pkRecibo(t.getAttribute('data-pkrec'))}
    else if(t.hasAttribute('data-pkshare')){reciboCompartilhar(t.getAttribute('data-pkshare'))}
    else if(t.hasAttribute('data-pksave')){reciboSalvar(t.getAttribute('data-pksave'))}
    else if(d.copy){var u=rtUrl(d.copy);navigator.clipboard&&navigator.clipboard.writeText(u).then(function(){toast('Link copiado')},function(){toast('Copie o link: '+u)})}
    else if(t.hasAttribute('data-copymsg')){var m=$('layer').dataset.msg||'';navigator.clipboard&&navigator.clipboard.writeText(m).then(function(){toast('Mensagem copiada')},function(){toast('Selecione e copie o texto')})}
    else if(t.hasAttribute('data-newsim')){st.cart={};st.nome='';st.zap='';drawBag();closeLayer()}
  });
  /* 10/11 S110-1: com o site travado (painel aberto), o dedo ainda rola qualquer área que rola de verdade (antes só .modal/.panel/.dpn/.fpn; a busca ficava presa) */
  function rolaY(t){for(var x=t;x&&x.nodeType===1&&x!==document.body;x=x.parentElement){if(x.scrollHeight>x.clientHeight+1){var oy=getComputedStyle(x).overflowY;if(oy==='auto'||oy==='scroll')return true}}return false}
  document.addEventListener('touchmove',function(e){if(document.documentElement.classList.contains('lock')&&!e.target.closest('.modal,.panel,.dpn,.fpn')&&!rolaY(e.target))e.preventDefault()},{passive:false});
  function setQ(v){st.q=v;$('q').value=v;$('q2').value=v;drawGrid()}
  $('q').addEventListener('input',function(e){setQ(e.target.value)});
  $('q2').addEventListener('input',function(e){setQ(e.target.value)});
  $('sort').addEventListener('change',function(e){st.sort=e.target.value;drawGrid()});
  /* S370 (aprovado 15/11): tocar o botão da página que já está aberta (sacola, Minha conta) não recria nem anima nada: só volta ao topo */
  var _ly370=layer;layer=function(){st._ab='';return _ly370.apply(this,arguments)};
  var _bag370=bag;bag=function(){var r=_bag370.apply(this,arguments);if($('layer').firstChild)st._ab='bag';return r};
  var _cl370=closeLayer;closeLayer=function(){st._ab='';return _cl370.apply(this,arguments)};
  function ab370Topo(){var sc=document.querySelector('#layer .scrim')||document.querySelector('#layer .panel');try{if(sc)sc.scrollTo({top:0,behavior:'smooth'})}catch(_){if(sc)sc.scrollTop=0}}
  $('bagbtn').addEventListener('click',function(){if(st._ab==='bag'&&st.step==='cart'&&$('layer').firstChild){ab370Topo();return}st.step='cart';bag()});

  var PAN={vitrine:'Catálogo',rosto:'Seu rosto',atacado:'Atacado',como:'Como comprar',duvidas:'Dúvidas'};
  function closePanels(){document.querySelectorAll('.sec.pop').forEach(function(e){e.classList.remove('pop')});document.documentElement.classList.remove('ppop');try{urlSync()}catch(_){}}
  function openPanel(id,quiet){
    closePanels();var el=document.getElementById(id);if(!el)return;
    if(id==='vitrine'){var ms=document.querySelector('.mobsearch');var vs=$('vscr');if(!vs){vs=document.createElement('div');vs.id='vscr';el.insertBefore(vs,$('grid'));vs.appendChild($('grid'))}if(ms&&ms.parentNode!==vs)vs.insertBefore(ms,vs.firstChild);var rs=$('resultado');if(rs&&matchMedia('(min-width:700px)').matches&&rs.parentNode!==vs)vs.insertBefore(rs,$('grid'));var lh=document.querySelector('.lh');if(lh&&lh.parentNode!==vs)vs.insertBefore(lh,$('grid'));var ft=document.querySelector('footer');if(ft&&ft.parentNode!==vs)vs.appendChild(ft);if(!$('cbl')){var cb=document.createElement('div');cb.id='cbl';cb.hidden=true;ms.parentNode.insertBefore(cb,ms.nextSibling);placeCbl();cotLine()}var ft=$('fty'),fs=$('fso');if(ft&&$('tipos').parentNode!==ft)ft.appendChild($('tipos'));if(fs&&$('sort').parentNode!==fs)fs.appendChild($('sort'));if(!$('pager')){var pg=document.createElement('div');pg.id='pager';el.appendChild(pg)}drawGrid()}

    document.documentElement.classList.remove('bootp');el.classList.add('in');el.classList.add('pop');el.scrollTop=0;document.documentElement.classList.add('ppop');if(!quiet&&el.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)el.animate([{translate:'0 26px',filter:'opacity(0)'},{translate:'0 0',filter:'opacity(1)'}],{duration:440,easing:'cubic-bezier(.2,.8,.2,1)'});
    try{urlSync()}catch(_){}}
  function fshSet(on){var d=$('fsh');d.classList.toggle('on',on);d.setAttribute('aria-hidden',on?'false':'true')}
  $('fbtn').addEventListener('click',function(){fshSet(true)});
  function dhdAlign(){try{var m=$('mnb').getBoundingClientRect(),h=document.querySelector('#drw .dhd'),x=h&&h.querySelector('.ib'),z=parseFloat(getComputedStyle(document.body).zoom)||1;if(!x||!m.height||m.top<0||m.bottom>160)return;h.style.position='';h.style.top='';h.style.paddingTop='';h.style.flex='none';var r=x.getBoundingClientRect(),dy=(m.top+m.height/2)-(r.top+r.height/2),pt=parseFloat(getComputedStyle(h).paddingTop)||0;if(Math.abs(dy/z)>40)return;h.style.paddingTop=(pt+dy/z)+'px'}catch(_){}}
  function catSet(o,pin){var c=document.querySelector('#drw .cat');if(!c)return;c.classList.toggle('open',o);c.classList.toggle('pin',!!(o&&pin));var b=c.querySelector('.arr');if(b)b.setAttribute('aria-expanded',o?'true':'false')}
  (function(){var c=document.querySelector('#drw .cat'),tm=0;if(!c)return;
    c.addEventListener('mouseenter',function(e){if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;clearTimeout(tm);tm=setTimeout(function(){catSet(true,false)},160)});
    c.addEventListener('mouseleave',function(){clearTimeout(tm);if(c.classList.contains('pin'))return;tm=setTimeout(function(){catSet(false)},320)});
    c.querySelector('.arr').addEventListener('click',function(e){e.stopPropagation();var o=!c.classList.contains('open')||!c.classList.contains('pin');catSet(o,o)})})();
  function drwSet(on){if(on){if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('#drw nav a').forEach(function(a,i){if(a.animate)a.animate([{translate:'-18px 0',opacity:0},{translate:'0 0',opacity:1}],{duration:260,delay:Math.min(i*16,180),easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})})}var d=$('drw');if(on){document.querySelectorAll('#drw nav>a,#drw .cat,#drw .dct').forEach(function(a){if(a.getAnimations)a.getAnimations().forEach(function(x){if(x.fill==='forwards'||x.effect&&x.effect.getTiming().fill==='forwards')x.cancel()})})}
    if(!on){if(d.classList.contains('on')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var xs=[].slice.call(document.querySelectorAll('#drw nav>a,#drw nav>.cat,#drw .dct'));xs.forEach(function(a,i){if(a.animate)a.animate([{translate:'0 0',opacity:1},{translate:'-16px 0',opacity:0}],{duration:200,delay:0,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'})})}catSet(false)}
    if(on){var hh=document.querySelector('#drw .dhd');if(hh)hh.style.paddingTop='';dhdAlign()}if(on)document.documentElement.classList.add('lock');else if(!$('layer').innerHTML.trim())document.documentElement.classList.remove('lock');d.classList.toggle('on',on);d.setAttribute('aria-hidden',on?'false':'true')}
  $('mnb').addEventListener('click',function(){drwSet(true)});
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-dclose],[data-fclose],[data-pback],[data-pg],#drw nav a');if(!t)return;
    if(t.hasAttribute('data-fclose'))fshSet(false);
    else if(t.hasAttribute('data-dclose'))drwSet(false);
    else if(t.hasAttribute('data-pback')){closePanels();try{history.replaceState(null,'',location.pathname+location.search)}catch(_){}}
    else if(t.hasAttribute('data-pg')){st.pg=(st.pg||0)+parseInt(t.getAttribute('data-pg'),10);drawGrid()}
    else{var mf=t.getAttribute&&t.getAttribute('data-mf');if(mf){var kv=mf.split(':');if(kv[0]==='gen'){st.gen=kv[1];st.tipo='todos'}else{st.tipo=kv[1];st.gen=''}drawGen();drawChips();drawGrid()}drwSet(false)}});
  (function(){var x0=null,y0=0,g=$('grid');if(!g)return;
    g.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
    g.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){}},{passive:true})})();
  /* S429 Fila 32 (aprovado 20/11): Esc = voltar. UMA regra para o site inteiro: o Esc fecha o que está por cima.
     Tudo o que abre por cima é um passo do histórico (lista OV + peça, carrinho, conta, busca, consulta, categoria, ajuda) → o Esc faz o
     mesmo que o voltar do aparelho. Só duas coisas não são passo e fecham sozinhas: a lista suspensa aberta e a janela avulsa
     (mensagem, atacado, separado), que troca a tela em vez de abrir por cima. Janela nova não ganha Esc próprio: entra na lista OV. */
  document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;
    var l=document.querySelector('.cdd.open');if(l){l.classList.remove('open');l.querySelector('.cdl').hidden=true;return}
    var hs=history.state||{};
    if(document.querySelector('#layer .scrim[data-close]')&&!hs.lfo){closeLayer();return}
    if(hs.__i>0)history.back()});

  var LOJA={lat:-25.510131,lng:-54.609959};
  function mapClose(){var w=$('mapw');if(!w)return;var d=function(){w.remove()};if(w.animate){w.animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'}).onfinish=d}else d()}
  function openMap(){
    if($('mapw'))return;
    var w=document.createElement('div');w.id='mapw';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.setAttribute('aria-label','Mapa');
    var q=LOJA.lat+','+LOJA.lng;
    w.innerHTML='<div class="mbox"><button type="button" class="mx" aria-label="Fechar">×</button><div id="mapc"></div><div class="minf"><h3>La Fouch</h3><p>Galeria Jebai Center, 3° piso, torre A, n°2242<br>Ciudad del Este</p><div class="mbt"><a class="p" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=-25.510131,-54.609959">Como chegar</a><a class="s" target="_blank" rel="noopener" href="https://maps.app.goo.gl/zy6c1ZFq4gQhxWXC8">Abrir no Google Maps</a></div></div></div>';
    w.addEventListener('click',function(e){if(e.target===w||e.target.closest('.mx'))mapClose()});
    document.body.appendChild(w);
    if(w.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){w.animate([{opacity:0},{opacity:1}],{duration:220});w.firstChild.animate([{translate:'0 24px',scale:.96,opacity:0},{translate:'0 0',scale:1,opacity:1}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'})}
    mapInit($('mapc'))}
  function mapInit(box){
    var W=box.clientWidth,H=box.clientHeight,zf=17,raf=0,P={},vel=[0,0],lt=0,inr=0,anim=0,LY={},MINZ=13,MAXZ=21,MAXT=19,curZ=17,hb=null;
    var nw=function(la,ln){var sn=Math.sin(la*Math.PI/180);return [(ln+180)/360,0.5-Math.log((1+sn)/(1-sn))/(4*Math.PI)]};
    var M=nw(LOJA.lat,LOJA.lng),cw=M.slice(),pin=document.createElement('div'),root=document.createElement('div');
    box.style.cssText+=';position:relative;overflow:hidden;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none;background:#e9e4dc';
    root.style.cssText='position:absolute;inset:0;overflow:hidden';
    pin.className='lfpin';pin.style.cssText='position:absolute;left:0;top:0;z-index:30;pointer-events:none;will-change:transform';
    pin.innerHTML='<div class="pb"><div class="pl"><i></i></div><div class="pt"></div><div class="pd"></div></div>';
    var at=document.createElement('div');at.textContent='© OpenStreetMap';at.style.cssText='position:absolute;left:6px;bottom:4px;z-index:40;font:500 10px Inter,sans-serif;color:#333;background:rgba(255,255,255,.75);padding:1px 5px;border-radius:5px';
    var zb=document.createElement('div');zb.style.cssText='position:absolute;right:10px;bottom:12px;z-index:50;display:flex;flex-direction:column;gap:6px';
    var hb2=document.createElement('button');hb2.type='button';hb2.setAttribute('aria-label','Voltar à loja');hb2.title='Voltar à loja';
    hb2.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="7.5"/><path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3"/></svg>';
    hb2.style.cssText='width:40px;height:40px;border-radius:12px;border:0;background:#fff;color:#a2447c;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.25);cursor:pointer;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;transform:scale(.8)';
    hb2.addEventListener('pointerdown',function(e){e.stopPropagation()});hb2.addEventListener('click',function(e){e.stopPropagation();home()});zb.appendChild(hb2);hb=hb2;
    ['+','−'].forEach(function(t,k){var b=document.createElement('button');b.type='button';b.textContent=t;b.setAttribute('aria-label',k?'Diminuir zoom':'Aumentar zoom');b.style.cssText='width:40px;height:40px;border-radius:12px;border:0;background:#fff;color:#222;font:600 22px/1 Inter,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.25);cursor:pointer';b.addEventListener('pointerdown',function(e){e.stopPropagation()});b.addEventListener('click',function(e){e.stopPropagation();zTo(Math.round(zf)+(k?-1:1),W/2,H/2)});zb.appendChild(b)});
    box.appendChild(root);box.appendChild(pin);box.appendChild(at);box.appendChild(zb);
    function layer(L){var y=LY[L];if(y)return y;var d=document.createElement('div');d.style.cssText='position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0;will-change:transform;z-index:'+L;root.appendChild(d);return LY[L]={d:d,T:{},n:0,want:0}}
    function sched(){if(!raf)raf=requestAnimationFrame(draw)}
    function clean(zi){var y=LY[zi];if(!y||y.n<y.want)return;clearTimeout(clean.t);clean.t=setTimeout(function(){var y=LY[curZ];if(!y||y.n<y.want)return;Object.keys(LY).forEach(function(L){if(+L!==curZ){LY[L].d.remove();delete LY[L]}})},320)}
    function draw(){raf=0;
      var tg=Math.max(MINZ,Math.min(MAXT,Math.round(zf)));if(Math.abs(zf-curZ)>.75||curZ>MAXT)curZ=tg;var zi=curZ,S=256*Math.pow(2,zf),n=Math.pow(2,zi);Object.keys(LY).forEach(function(L){if(Math.abs(L-zi)>=2){LY[L].d.remove();delete LY[L]}});
      /* camadas: nível atual por cima; níveis anteriores ficam por baixo até as peças novas carregarem */
      Object.keys(LY).forEach(function(L){var y=LY[L],sc=Math.pow(2,zf-L),W2=256*Math.pow(2,L),bx=y.bx==null?0:y.bx,by=y.by==null?0:y.by;
        if(y.bx==null){y.bx=Math.floor(cw[0]*W2/256)*256;y.by=Math.floor(cw[1]*W2/256)*256;bx=y.bx;by=y.by}
        y.d.style.transform='translate3d('+(W/2-(cw[0]*W2-bx)*sc)+'px,'+(H/2-(cw[1]*W2-by)*sc)+'px,0) scale('+sc+')'});
      var y=layer(zi),sc=Math.pow(2,zf-zi),W2=256*n;
      if(y.bx==null){y.bx=Math.floor(cw[0]*W2/256)*256;y.by=Math.floor(cw[1]*W2/256)*256}
      y.d.style.transform='translate3d('+(W/2-(cw[0]*W2-y.bx)*sc)+'px,'+(H/2-(cw[1]*W2-y.by)*sc)+'px,0) scale('+sc+')';
      var cx=cw[0]*W2,cy=cw[1]*W2,hw=W/(2*sc)+128,hh=H/(2*sc)+128,x0=Math.floor((cx-hw)/256),x1=Math.floor((cx+hw)/256),y0=Math.floor((cy-hh)/256),y1=Math.floor((cy+hh)/256),keep={},want=0;
      for(var x=x0;x<=x1;x++)for(var yy=y0;yy<=y1;yy++){if(yy<0||yy>=n)continue;var k=x+'/'+yy;keep[k]=1;want++;if(y.T[k])continue;
        var im=document.createElement('img'),xx=((x%n)+n)%n,tries=0;im.alt='';im.draggable=false;im.decoding='async';
        im.style.cssText='position:absolute;left:'+(x*256-y.bx)+'px;top:'+(yy*256-y.by)+'px;width:256px;height:256px;max-width:none;opacity:0;transition:opacity .25s';
        im.onload=function(){this.style.opacity=1;this._ok=1;y.n++;clean(zi)};
        im.onerror=(function(im,xx,yy){return function(){if(tries++<2)setTimeout(function(){im.src='https://tile.openstreetmap.org/'+zi+'/'+xx+'/'+yy+'.png?r='+tries},700*tries)}})(im,xx,yy);
        im.src='https://tile.openstreetmap.org/'+zi+'/'+xx+'/'+yy+'.png';y.d.appendChild(im);y.T[k]=im}
      y.want=Math.min(want,Object.keys(y.T).length);
      var rm=function(){Object.keys(y.T).forEach(function(k){if(!keep[k]){var q=k.split('/');if(q[0]<x0-2||q[0]>x1+2||q[1]<y0-2||q[1]>y1+2){if(y.T[k]._ok)y.n--;y.T[k].remove();delete y.T[k]}}})};rm();
      var off=Math.hypot((M[0]-cw[0])*S,(M[1]-cw[1])*S)>24||Math.abs(zf-17)>.4;if(hb){hb.style.opacity=off?1:0;hb.style.transform=off?'scale(1)':'scale(.8)';hb.style.pointerEvents=off?'auto':'none'}
      pin.style.transform='translate3d('+(W/2+(M[0]-cw[0])*S)+'px,'+(H/2+(M[1]-cw[1])*S)+'px,0) translate(-50%,calc(-100% + 9px))'}
    function zAt(nz,mx,my){nz=Math.max(MINZ,Math.min(MAXZ,nz));var S=256*Math.pow(2,zf),S2=256*Math.pow(2,nz),dx=mx-W/2,dy=my-H/2;cw=[cw[0]+dx/S-dx/S2,cw[1]+dy/S-dy/S2];zf=nz;sched()}
    function zTo(nz,mx,my){nz=Math.max(MINZ,Math.min(MAXZ,nz));cancelAnimationFrame(anim);var a=zf,t0=performance.now();(function st(t){var k=Math.min(1,(t-t0)/320),e=1-Math.pow(1-k,3);zAt(a+(nz-a)*e,mx,my);if(k<1)anim=requestAnimationFrame(st)})(t0)}
    function home(){cancelAnimationFrame(anim);cancelAnimationFrame(inr);var a=cw.slice(),z0=zf,z1=Math.max(zf>17.5?17:zf,16.5)>17.5?17:17,t0=performance.now();(function st(t){var k=Math.min(1,(t-t0)/520),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;cw=[a[0]+(M[0]-a[0])*e,a[1]+(M[1]-a[1])*e];zf=z0+(z1-z0)*e;sched();if(k<1)anim=requestAnimationFrame(st)})(t0)}
    function pan(dx,dy){var S=256*Math.pow(2,zf);cw=[cw[0]-dx/S,cw[1]-dy/S];sched()}
    var rc=function(e){var r=box.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
    var info=function(){var a=Object.keys(P).map(function(k){return P[k]});if(a.length<2)return null;return {d:Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1,m:[(a[0][0]+a[1][0])/2,(a[0][1]+a[1][1])/2]}};
    box.addEventListener('pointerdown',function(e){if(e.target.closest('button'))return;cancelAnimationFrame(inr);cancelAnimationFrame(anim);P[e.pointerId]=rc(e);vel=[0,0];lt=e.timeStamp;try{box.setPointerCapture(e.pointerId)}catch(_){}box.style.cursor='grabbing'});
    box.addEventListener('pointermove',function(e){var id=e.pointerId;if(!P[id])return;var was=info(),o=P[id],n=rc(e);P[id]=n;var now=info();
      if(was&&now){zAt(zf+Math.log2(now.d/was.d),now.m[0],now.m[1]);pan(now.m[0]-was.m[0],now.m[1]-was.m[1])}
      else if(!now){var dx=n[0]-o[0],dy=n[1]-o[1],dt=Math.max(1,e.timeStamp-lt);lt=e.timeStamp;vel=[vel[0]*.6+dx/dt*.4,vel[1]*.6+dy/dt*.4];pan(dx,dy)}});
    var up=function(e){var had=Object.keys(P).length;delete P[e.pointerId];var left=Object.keys(P).length;
      if(!left){box.style.cursor='grab';if(had===1&&Math.hypot(vel[0],vel[1])>.05){var l=performance.now();(function f(t){var dt=Math.min(40,t-l);l=t;pan(vel[0]*dt,vel[1]*dt);var q=Math.pow(.94,dt/16);vel=[vel[0]*q,vel[1]*q];if(Math.hypot(vel[0],vel[1])>.02)inr=requestAnimationFrame(f)})(l)}}
      else vel=[0,0]};
    box.addEventListener('pointerup',up);box.addEventListener('pointercancel',up);
    box.addEventListener('wheel',function(e){e.preventDefault();var p=rc(e);zAt(zf-e.deltaY*.0025,p[0],p[1])},{passive:false});
    box.addEventListener('dblclick',function(e){var p=rc(e);zTo(Math.round(zf)+1,p[0],p[1])});
    draw()}
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a.mp');if(!a)return;e.preventDefault();if(typeof drwSet==='function')drwSet(false);openMap()});
  function homeAnim(){
    var pn=document.querySelector('.sec.pop'),rm=matchMedia('(prefers-reduced-motion: reduce)').matches,E='cubic-bezier(.2,.8,.2,1)';
    var enter=function(d0){if(rm)return;var i=0;document.querySelectorAll('.hero > *').forEach(function(h){if(h.animate)h.animate([{translate:'0 22px',filter:'opacity(0)'},{translate:'0 0',filter:'opacity(1)'}],{duration:620,delay:d0+(i++)*80,easing:E,fill:'backwards'})})};
    drwSet(false);
    if(!pn||rm||!pn.animate){closePanels();enter(0);return}
    enter(200);
    var an=pn.animate([{translate:'0 0',filter:'opacity(1)',scale:1},{translate:'0 30px',filter:'opacity(0)',scale:.985}],{duration:300,easing:'cubic-bezier(.3,0,.7,.4)',fill:'forwards'});
    an.onfinish=function(){closePanels();an.cancel()}}
  function goTo(id){
    if(MOBQ.matches){if(id==='topo'){homeAnim();return}if(PAN[id]){openPanel(id);return}}
    var el=document.getElementById(id);if(!el)return;
    var go=function(){document.documentElement.style.scrollBehavior='auto';if(id==='topo')window.scrollTo(0,0);else el.scrollIntoView({behavior:'auto',block:'start'});document.documentElement.style.scrollBehavior=''};
    var done=function(){delete document.documentElement.dataset.nav;el.classList.remove('arrive');void el.offsetWidth;el.classList.add('arrive');setTimeout(function(){el.classList.remove('arrive')},1100)};
    if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      document.documentElement.dataset.nav='1';
      var vt=document.startViewTransition(go);vt.finished.then(done,done);
    }else if(id==='topo'){window.scrollTo({top:0,behavior:'smooth'})}else{el.scrollIntoView({behavior:'smooth',block:'start'})}
    if(id==='topo'||PAN[id]){try{urlSync()}catch(_){}}
  }
  document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href').slice(1);if(!id||!document.getElementById(id))return;e.preventDefault();goTo(id)});

  /* animações de entrada, brilho que segue o dedo, cabeçalho */
  var io=window.IntersectionObserver&&new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:0,rootMargin:'0px 0px -8% 0px'});
  function reveal(){if(!io)return;document.querySelectorAll('.sec:not(#vitrine),.trust div,.lojista,#como li,.cardw').forEach(function(el,i){if(el.classList.contains('rv'))return;el.classList.add('rv');el.style.setProperty('--d',i%4);io.observe(el)})}
  reveal();setTimeout(function(){document.querySelectorAll('.rv:not(.in)').forEach(function(e){e.classList.add('in')})},4000);addEventListener('scroll',function(){document.querySelectorAll('.rv:not(.in)').forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)e.classList.add('in')})},{passive:true});
  document.addEventListener('pointermove',function(e){var t=e.target.closest&&e.target.closest('.card,.face,.stage');if(!t)return;var r=t.getBoundingClientRect();t.style.setProperty('--mx',(e.clientX-r.left)+'px');t.style.setProperty('--my',(e.clientY-r.top)+'px');
    if(t.classList.contains('stage')&&e.pointerType==='mouse'){var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform='perspective(900px) rotateY('+(x*8)+'deg) rotateX('+(-y*8)+'deg)'}});
  document.addEventListener('pointerout',function(e){var t=e.target.closest&&e.target.closest('.stage');if(t&&!t.contains(e.relatedTarget))t.style.transform=''});
  var tp=document.querySelector('.top');addEventListener('scroll',function(){tp.classList.toggle('sc',scrollY>10)},{passive:true});


  /* análise do formato do rosto por foto (roda no aparelho, nada é enviado) */
  var FA={lib:null};
  var FAB='lfx/';
  function faLoad(){
    if(FA.lib)return FA.lib;
    FA.lib=fetch(FAB+'face-api.js').then(function(r){if(!r.ok)throw new Error('lib');return r.text()}).then(function(js){
      if(!window.faceapi){var sc=document.createElement('script');sc.text=js;document.head.appendChild(sc)}
      var fa=window.faceapi,tf=fa.tf,of=window.fetch.bind(window);FA.of=of;
      window.fetch=(function(u,o){if(/\.bin\.txt$/.test(u)){return of(u,o).then(function(r){if(!r.ok)throw new Error('m');return r.text()}).then(function(t){var b=atob(t.trim()),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new Response(a.buffer)})}return of(u,o)});
      return Promise.resolve().then(function(){return tf.setBackend('webgl')}).catch(function(){return false}).then(function(ok){
        if(!ok||tf.getBackend()!=='webgl')return tf.setBackend('cpu')}).then(function(){return tf.ready()}).then(function(){
        return Promise.all([fa.nets.tinyFaceDetector.loadFromUri(FAB+'model'),fa.nets.faceLandmark68Net.loadFromUri(FAB+'model').then(function(){FA.full=true},function(){return fa.nets.faceLandmark68TinyNet.loadFromUri(FAB+'model')}),fa.nets.ageGenderNet.loadFromUri(FAB+'model').then(function(){FA.gen=true},function(){})])}).then(function(){window.fetch=of;return fa},function(e){window.fetch=of;throw e})
    }).catch(function(e){FA.lib=null;if(FA.of)window.fetch=FA.of;throw e});
    return FA.lib}
  /* leitura de 478 pontos (MediaPipe, roda no aparelho): contorno real do rosto, cabeça "endireitada" em 3D e íris como régua em mm.
     Se não carregar, o teste continua com os 68 pontos de antes. */
  var MP={lib:null};
  function mpLoad(){
    if(MP.lib)return MP.lib;
    var base=new URL(FAB+'mp/',document.baseURI).href;
    MP.lib=new Promise(function(ok,no){/* 12/11: sem new Function (a política de segurança CSP não deixa): um <script type=module> pequeno importa a biblioteca */
      var k='__lfMp'+Date.now();window[k]=function(V,e){try{delete window[k]}catch(_){}if(V)ok(V);else no(e||new Error('mp'))};
      var sc=document.createElement('script');sc.type='module';sc.textContent='import('+JSON.stringify(base+'vision_bundle.mjs')+').then(function(V){window['+JSON.stringify(k)+'](V)},function(e){window['+JSON.stringify(k)+'](null,e)})';
      sc.onerror=function(){no(new Error('mp'))};document.head.appendChild(sc);setTimeout(function(){sc.remove()},0)}).then(function(V){
      return V.FilesetResolver.forVisionTasks(base.replace(/\/$/,'')).then(function(fs){
        /* S380 (aprovado 16/11 10:38): a leitura do rosto tenta a placa de vídeo (bem mais leve para o processador, que é quem desenha a tela); se o aparelho não deixar criar,
           ou se ela falhar 3 vezes seguidas ao medir, volta sozinha para o processador, como era */
        var op=function(d){return {baseOptions:{modelAssetPath:base+'face_landmarker.task',delegate:d},runningMode:'IMAGE',numFaces:1,outputFacialTransformationMatrixes:true}},cpu=function(){MP.del='CPU';return V.FaceLandmarker.createFromOptions(fs,op('CPU'))};
        if(window.__lfMpCpu)return cpu();
        return V.FaceLandmarker.createFromOptions(fs,op('GPU')).then(function(lm){MP.del='GPU';var d0=lm.detect.bind(lm),fal=0,troca=null,pediu=0;
          lm.detect=function(x){if(troca)return troca.detect(x);try{var r=d0(x);fal=0;return r}catch(e){if(++fal>=3&&!pediu){pediu=1;cpu().then(function(c){troca=c},function(){})}throw e}};return lm},cpu)})
    }).catch(function(e){MP.lib=null;throw e});
    return MP.lib}
  /* os 68 pontos de antes, tirados dos 478 (o queixo/mandíbula vem do contorno real) */
  var M68=[127,234,93,132,172,136,150,176,152,400,379,365,397,361,323,454,356,70,63,105,66,107,336,296,334,293,300,168,197,5,4,75,97,2,326,305,33,160,158,133,153,144,362,385,387,263,373,380,61,39,37,0,267,269,291,405,314,17,84,181,78,82,13,312,308,317,14,87];
  var MOVAL=[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
  /* a régua das formas foi feita com os 68 pontos; a leitura nova mede um pouco diferente e é ajustada para a mesma escala */
  var MOFF={r:-.087,jaw:-.018,fore:-.035,ang:-3.9};
  function mpDetect(lm,cv){
    var r=lm.detect(cv),f=r&&r.faceLandmarks&&r.faceLandmarks[0];if(!f||f.length<478)return null;
    var W=cv.width,H=cv.height,A=f.map(function(p){return [p.x*W,p.y*H,p.z*W]});
    var mx=r.facialTransformationMatrixes&&r.facialTransformationMatrixes[0]?r.facialTransformationMatrixes[0].data:null;
    return {A:A,mx:mx}}
  /* gira os pontos para o rosto ficar de frente (tira a cabeça levantada, abaixada ou virada) */
  function mpFront(A,mx){
    if(!mx)return A;
    var R=[[mx[0],mx[4],mx[8]],[mx[1],mx[5],mx[9]],[mx[2],mx[6],mx[10]]];
    var det=R[0][0]*(R[1][1]*R[2][2]-R[1][2]*R[2][1])-R[0][1]*(R[1][0]*R[2][2]-R[1][2]*R[2][0])+R[0][2]*(R[1][0]*R[2][1]-R[1][1]*R[2][0]);
    var k=Math.cbrt(det);if(!(k>0))return A;
    var c=[0,0,0];A.forEach(function(p){c[0]+=p[0];c[1]+=p[1];c[2]+=p[2]});c=c.map(function(v){return v/A.length});
    return A.map(function(p){var b=[p[0]-c[0],-(p[1]-c[1]),-(p[2]-c[2])],o=[0,0,0];
      for(var j=0;j<3;j++)o[j]=(b[0]*R[0][j]+b[1]*R[1][j]+b[2]*R[2][j])/k;
      return [o[0]+c[0],-o[1]+c[1],-o[2]+c[2]]})}
  function mp68(A){return M68.map(function(i){return {x:A[i][0],y:A[i][1]}})}
  /* íris (11,7 mm em quase todo adulto) vira a régua: largura do rosto e distância entre as pupilas em mm */
  function mpMm(A,F){
    function d(P,i,j){return Math.hypot(P[i][0]-P[j][0],P[i][1]-P[j][1],P[i][2]-P[j][2])}
    function ir(c){return (Math.hypot(A[c+1][0]-A[c+3][0],A[c+1][1]-A[c+3][1])+Math.hypot(A[c+2][0]-A[c+4][0],A[c+2][1]-A[c+4][1]))/2}
    var di=(ir(468)+ir(473))/2;if(!(di>=14))return null; /* íris pequena demais na foto: não arrisca */
    var k=11.7/di;return {w:Math.round(d(F,234,454)*k),pd:Math.round(Math.hypot(A[468][0]-A[473][0],A[468][1]-A[473][1])*k),iris:+di.toFixed(1)}}
  function mpTam(w){return w<132?['Pequeno','(frente com até ~132 mm)']:w<=144?['Médio','(frente com ~132 a 144 mm)']:['Grande','(frente com mais de ~144 mm)']}
  /* leitura completa: se o rosto estiver pequeno na foto, recorta em volta dele e lê de novo */
  /* 09/11 (aprovado): pouca luz — a leitura do rosto usa uma cópia clareada da foto (só para medir; a tela não muda) e pede mais exposição à câmera */
  function mpLuz(cv){try{if(cv._luz)return cv;var w=64,h=Math.max(8,Math.round(64*cv.height/cv.width)),t=document.createElement('canvas');t.width=w;t.height=h;var x=t.getContext('2d',{willReadFrequently:true});x.drawImage(cv,0,0,w,h);
      var d=x.getImageData(0,0,w,h).data,sum=0;for(var i=0;i<d.length;i+=4)sum+=d[i]*.299+d[i+1]*.587+d[i+2]*.114;var m=sum/(d.length/4);
      if(m<70)camLuz(true);if(m>=105)return cv;
      var k=Math.min(2.8,125/Math.max(18,m)),c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;var g=c.getContext('2d');g.filter='brightness('+k.toFixed(2)+') contrast(1.12)';g.drawImage(cv,0,0);c._luz=1;return c}catch(_){return cv}}
  function camLuz(escuro){try{if(camLuz.feito||!CAM.st)return;var tr=CAM.st.getVideoTracks()[0],cp=tr.getCapabilities&&tr.getCapabilities();if(!cp)return;var a={};
      if(cp.exposureMode&&cp.exposureMode.indexOf('continuous')>=0)a.exposureMode='continuous';
      if(escuro&&cp.exposureCompensation&&cp.exposureCompensation.max!=null)a.exposureCompensation=cp.exposureCompensation.max*.7;
      if(Object.keys(a).length){camLuz.feito=!!escuro;tr.applyConstraints({advanced:[a]}).catch(function(){})}}catch(_){}}
  function mpRead(lm,cv,fa){cv=mpLuz(cv);
    var v=mpDetect(lm,cv);if(v)return Promise.resolve(v);
    if(!fa)return Promise.resolve(null);
    return fa.detectSingleFace(cv,new fa.TinyFaceDetectorOptions({inputSize:512,scoreThreshold:.3})).then(function(dt){
      if(!dt)return null;var b=dt.box,sz=Math.max(b.width,b.height)*1.9,cx=b.x+b.width/2,cy=b.y+b.height/2,N=720,k=N/sz;
      var cr=document.createElement('canvas');cr.width=cr.height=N;var cc=cr.getContext('2d');cc.fillStyle='#808080';cc.fillRect(0,0,N,N);cc.drawImage(cv,cx-sz/2,cy-sz/2,sz,sz,0,0,N,N);
      var w=mpDetect(lm,cr);if(!w)return null;
      w.A=w.A.map(function(p){return [p[0]/k+cx-sz/2,p[1]/k+cy-sz/2,p[2]/k]});return w},function(){return null})}
  function mpResult(v){
    var A=v.A,F=mpFront(A,v.mx),raw=mp68(A),m=faMeasure(mp68(F)),yaw=null;
    if(v.mx){var dt=Math.cbrt(Math.abs(v.mx[0]*(v.mx[5]*v.mx[10]-v.mx[9]*v.mx[6])-v.mx[4]*(v.mx[1]*v.mx[10]-v.mx[9]*v.mx[2])+v.mx[8]*(v.mx[1]*v.mx[6]-v.mx[5]*v.mx[2])))||1;yaw=Math.asin(Math.max(-1,Math.min(1,v.mx[8]/dt)))*180/Math.PI}
    Object.keys(MOFF).forEach(function(k){m[k]+=MOFF[k]});
    var xs=A.map(function(p){return p[0]}),ys=A.map(function(p){return p[1]}),x0=Math.min.apply(0,xs),y0=Math.min.apply(0,ys);
    return {r:{detection:{box:{x:x0,y:y0,width:Math.max.apply(0,xs)-x0,height:Math.max.apply(0,ys)-y0}},landmarks:{positions:raw},oval:MOVAL.map(function(i){return {x:A[i][0],y:A[i][1]}}),n478:true},m:m,mm:mpMm(A,F),yaw:yaw}}
  var CAM={st:null,tm:0,off:false};
  function LIVE(){return !CAM.off&&!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)}
  function faEmpty(){
    var c='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2.4h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.2" r="3.6"/></svg>';
    var g='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 9"/></svg>';
    return '<div class="modal try fa" role="dialog" aria-modal="true" aria-label="Descobrir meu rosto"><div style="text-align:right;margin:-8px -6px 0 0"><button type="button" class="x" data-close aria-label="Fechar">×</button></div>'+
    '<div class="faic">'+faceMini('oval')+'</div><h2>Descubra seu tipo de rosto</h2>'+
    '<p class="sub">Tire uma selfie ou escolha uma foto. Vamos descobrir o formato do seu rosto e separar os óculos que mais combinam com ele.</p>'+
    '<div class="fachips"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>De frente</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>Boa luz</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>Sem óculos</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>Cabelo para trás</span></div>'+
    (CAM.off?'<p class="facn">Não consegui abrir a câmera. Permita o acesso ou escolha uma foto.</p>':'')+
    '<div class="fabtns">'+(LIVE()?'<button type="button" class="btn p ic" data-facam>'+c+'<span>Abrir a câmera</span></button>':'<label class="btn p ic">'+c+'<span>Tirar uma foto</span><input type="file" accept="image/*" capture="user" id="fafile"></label>')+
    '<label class="btn o ic">'+g+'<span>Escolher da galeria</span><input type="file" accept="image/*" id="fafile2"></label></div>'+
    '<div class="tpriv"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><span>Sua foto fica só no seu aparelho. Nada é enviado.</span></div></div>'}
  function faOpen(){layer(faEmpty(),'center')}
  function faBusy(msg){
    var m=document.querySelector('.modal.fa');if(!m)return;
    m.innerHTML='<div class="fast"><div class="tload" role="status" aria-live="polite"><div class="tring"><i></i><svg viewBox="0 0 120 50" width="54" height="23" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="30" cy="25" r="18"/><circle cx="90" cy="25" r="18"/><path d="M48 22Q60 15 72 22M12 20L3 15M108 20L117 15"/></svg></div><b>Analisando seu rosto…</b><span id="fams">'+(msg||'Preparando')+'</span></div></div>'}
  function faMsg(t){var e=$('fams');if(e)e.textContent=LFI.tr(t)}
  function faErr(t,sub){
    var m=document.querySelector('.modal.fa');if(!m)return;
    m.innerHTML='<div style="text-align:right;margin:-8px -6px 0 0"><button type="button" class="x" data-close aria-label="Fechar">×</button></div><div class="faic">'+faceMini('alongado')+'</div><h2>'+t+'</h2><p class="sub">'+sub+'</p><div class="fabtns"><button type="button" class="btn p" data-fanew>Tentar outra foto</button></div><button type="button" class="fan" data-fawrong>Prefiro escolher o formato sozinho</button>'}
  /* mede as proporções do rosto a partir dos 68 pontos */
  function faMeasure(pt){
    var a=Math.atan2(pt[45].y-pt[36].y,pt[45].x-pt[36].x),cs=Math.cos(-a),sn=Math.sin(-a),q=pt.map(function(p){return {x:p.x*cs-p.y*sn,y:p.x*sn+p.y*cs}});
    function d(i,j){return Math.hypot(q[i].x-q[j].x,q[i].y-q[j].y)}
    var W=d(0,16),brow=(q[19].y+q[24].y)/2,L=(q[8].y-brow)*1.5;
    var v1={x:q[6].x-q[8].x,y:q[6].y-q[8].y},v2={x:q[10].x-q[8].x,y:q[10].y-q[8].y};
    var ang=Math.acos((v1.x*v2.x+v1.y*v2.y)/(Math.hypot(v1.x,v1.y)*Math.hypot(v2.x,v2.y)))*180/Math.PI;
    return {r:L/W,jaw:d(4,12)/W,fore:d(17,26)/W,mid:d(2,14)/W,ang:ang}}
  function faShape(m){
    var sc={oval:0,redondo:0,quadrado:0,alongado:0,coracao:0,diamante:0};
    /* v2: régua corrigida — o comprimento sai dos 68 pontos (sem a testa) e o rosto comum mede ~1,45; o alongado só a partir de ~1,56 */
    sc.alongado=(m.r-1.56)*6;
    sc.redondo=(1.36-m.r)*5+(m.jaw<.84?.15:0)+(m.ang>128?.25:-.1);
    sc.quadrado=(m.jaw-.80)*7+(1.47-m.r)*2+(m.ang>128?.25:0);
    sc.coracao=(m.fore-m.jaw-.02)*8+(m.ang<122?.35:0);
    sc.diamante=(.84-m.fore)*5+(.80-m.jaw)*3;
    sc.oval=.55-Math.abs(m.r-1.45)*2.2-Math.abs(m.jaw-.76)*2-Math.abs(m.fore-m.jaw-.03)*1.5;
    var k=Object.keys(sc).sort(function(x,y){return sc[y]-sc[x]});
    var gap=sc[k[0]]-sc[k[1]];
    return {id:k[0],second:k[1],sc:sc,close:gap<.12,m:m}}
  /* giro da cabeça: compara a distância do nariz a cada lado do rosto (1 = de frente) */
  function faYaw(pt){var l=Math.abs(pt[30].x-pt[0].x),r=Math.abs(pt[16].x-pt[30].x);return Math.min(l,r)/Math.max(l,r)}
  /* detecção: 4 leituras do mesmo rosto (original, espelhada, aproximada e aproximada espelhada); a mediana de cada ponto tira o ruído */
  var FMIR=[16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,26,25,24,23,22,21,20,19,18,17,27,28,29,30,35,34,33,32,31,45,44,43,42,47,46,39,38,37,36,41,40,54,53,52,51,50,49,48,59,58,57,56,55,64,63,62,61,60,67,66,65];
  function faOne(fa,cv){cv=mpLuz(cv);
    var o=function(sz,th){return new fa.TinyFaceDetectorOptions({inputSize:sz,scoreThreshold:th})};
    var tiny=!FA.full;return fa.detectSingleFace(cv,o(416,.5)).withFaceLandmarks(tiny).then(function(r){
      return r||fa.detectSingleFace(cv,o(512,.3)).withFaceLandmarks(tiny)})}
  function faFlip(cv){var c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;var x=c.getContext('2d');x.translate(c.width,0);x.scale(-1,1);x.drawImage(cv,0,0);return c}
  function faPts(r){return r.landmarks.positions.map(function(p){return {x:p.x,y:p.y}})}
  function faUnflip(pts,W){var o=[];for(var i=0;i<68;i++){var p=pts[FMIR[i]];o[i]={x:W-p.x,y:p.y}}return o}
  function faMed(l){l=l.slice().sort(function(a,b){return a-b});var n=l.length;return n%2?l[(n-1)/2]:(l[n/2-1]+l[n/2])/2}
  function faDetect(fa,cv){
    return faOne(fa,cv).then(function(r){
      if(!r)return null;
      var b=r.detection.box,cx=b.x+b.width/2,cy=b.y+b.height/2,N=640,jobs=[],sets=[],orig=[faPts(r)];
      /* rosto pequeno na foto: recorta em volta dele e mede de novo, em duas escalas, normal e espelhado */
      [1.5,1.9].forEach(function(m){
        var sz=Math.max(b.width,b.height)*m,k=N/sz,cr=document.createElement('canvas');cr.width=cr.height=N;var cc=cr.getContext('2d');cc.fillStyle='#808080';cc.fillRect(0,0,N,N);cc.drawImage(cv,cx-sz/2,cy-sz/2,sz,sz,0,0,N,N);
        var back=function(pts){return pts.map(function(p){return {x:p.x/k+cx-sz/2,y:p.y/k+cy-sz/2}})};
        jobs.push(faOne(fa,cr).then(function(v){if(v)sets.push(back(faPts(v)))},function(){}));
        jobs.push(faOne(fa,faFlip(cr)).then(function(v){if(v)sets.push(back(faUnflip(faPts(v),N)))},function(){}))});
      jobs.push(faOne(fa,faFlip(cv)).then(function(v){if(v)orig.push(faUnflip(faPts(v),cv.width))},function(){}));
      return Promise.all(jobs).then(function(){
        var use=sets.length>=3?sets:sets.concat(orig),pts=[];
        for(var i=0;i<68;i++)pts.push({x:faMed(use.map(function(s){return s[i].x})),y:faMed(use.map(function(s){return s[i].y}))});
        r.landmarks={positions:pts};r.nread=use.length;return r})})}
  function faSub(id){var n=P.filter(function(p){return p.rosto.indexOf(id)>=0&&genOk(p,faGen)}).length,f=FACES.filter(function(x){return x.id===id})[0];return esc(f.dica)+(n?' Separamos '+n+' modelos para você.':'')}
  function faResult(cv,r,res){
    var m=document.querySelector('.modal.fa');if(!m)return;
    var f=FACES.filter(function(x){return x.id===res.id})[0];faGen=st.gen==='m'||st.gen==='f'?st.gen:(res.gen||'');faTeste(res);
    m.innerHTML='<div class="fares"><div style="text-align:right;margin:-8px -6px 0 0"><button type="button" class="x" data-close aria-label="Fechar">×</button></div>'+
    '<div class="faph"><canvas id="facv" width="360" height="360"></canvas></div><div class="fak">Seu rosto é</div><h3>'+esc(f.nome)+'</h3>'+
    '<p class="sub" data-fadica="'+esc(f.dica)+'">'+faSub(res.id)+'</p>'+(res.close?'<p class="sub" style="margin-top:-4px">Seu rosto também tem traços de <button type="button" class="fan" style="display:inline;padding:0;text-decoration:underline" data-fause="'+res.second+'">'+esc(FACES.filter(function(x){return x.id===res.second})[0].nome.toLowerCase())+'</button>.</p>':'')+
    (res.mm?'<p class="sub fatam">Tamanho de armação para você: <b>'+mpTam(res.mm.w)[0]+'</b> <span>'+mpTam(res.mm.w)[1]+'</span></p>':'')+
    '<div class="fak" style="margin-top:2px">Para quem são os óculos?</div><div class="fagen">'+[['f','Feminino'],['m','Masculino'],['','Todos']].map(function(g){return '<button type="button" class="chip" data-fagen="'+g[0]+'" aria-pressed="'+(faGen===g[0])+'">'+g[1]+'</button>'}).join('')+'</div>'+
    '<div class="fabtns"><button type="button" class="btn p" data-fause="'+res.id+'">Ver os modelos para o meu rosto</button><button type="button" class="btn o" data-fanew>Tentar outra foto</button></div>'+
    '<button type="button" class="fan" data-fawrong>Não parece com você? Escolher o formato sozinho</button></div>';
    var c=$('facv').getContext('2d'),b=r.detection.box,sz=Math.max(b.width,b.height)*1.9,cx=b.x+b.width/2,cy=b.y+b.height/2;
    c.fillStyle='#fff';c.fillRect(0,0,360,360);c.drawImage(cv,cx-sz/2,cy-sz/2,sz,sz,0,0,360,360);
    var k=360/sz,pts=r.landmarks.positions.map(function(p){return {x:(p.x-(cx-sz/2))*k,y:(p.y-(cy-sz/2))*k}});
    c.lineJoin=c.lineCap='round';c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=7;
    function line(a,z){c.beginPath();for(var i=a;i<=z;i++){i==a?c.moveTo(pts[i].x,pts[i].y):c.lineTo(pts[i].x,pts[i].y)}c.stroke()}
    if(r.oval){var ov=r.oval.map(function(p){return {x:(p.x-(cx-sz/2))*k,y:(p.y-(cy-sz/2))*k}});
      var path=function(){c.beginPath();ov.forEach(function(p,i){i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y)});c.closePath();c.stroke()};
      path();c.strokeStyle='#b4528a';c.lineWidth=3.5;path();return}
    line(0,16);c.strokeStyle='#b4528a';c.lineWidth=3.5;line(0,16)}
  function faTeste(res){
    if(!/[?&]rostoTeste=1/.test(location.search))return;
    var L=[];try{L=JSON.parse(localStorage.getItem('lf_rosto_log')||'[]')}catch(_){}
    var m=res.m||{};L.push({t:Date.now(),n:res.n478?478:68,w:res.mm?res.mm.w:0,id:res.id,s:res.second,r:+(m.r||0).toFixed(3),j:+(m.jaw||0).toFixed(3),f:+(m.fore||0).toFixed(3),a:Math.round(m.ang||0),g:res.gen||''});L=L.slice(-60);
    try{localStorage.setItem('lf_rosto_log',JSON.stringify(L))}catch(_){}
    var c={};L.forEach(function(x){c[x.id]=(c[x.id]||0)+1});
    setTimeout(function(){var e=document.querySelector('.fares');if(!e)return;var d=document.createElement('div');d.className='faTeste';
      d.innerHTML='<b>Modo teste</b><div>comprimento ÷ largura '+(m.r||0).toFixed(3)+' · mandíbula '+(m.jaw||0).toFixed(3)+' · testa '+(m.fore||0).toFixed(3)+' · queixo '+Math.round(m.ang||0)+'°</div><div>'+Object.keys(res.sc||{}).map(function(k){return k+' '+res.sc[k].toFixed(2)}).join(' · ')+'</div><div>leitura: '+(res.n478?'478 pontos (3D, de frente)':'68 pontos')+(res.mm?' · rosto '+res.mm.w+' mm · pupilas '+res.mm.pd+' mm · íris '+res.mm.iris+' px':'')+'</div><div>gênero: '+(res.gen||'sem certeza')+'</div><div>Últimos '+L.length+' testes: '+Object.keys(c).map(function(k){return k+' '+c[k]}).join(' · ')+'</div>';
      e.appendChild(d)},0)}
  function faRun(file){
    if(!file)return;
    faBusy('Carregando a análise');var t0=Date.now();
    var fail=function(e){faErr('Não consegui analisar','Confira sua internet e tente de novo, de preferência com a foto de frente e bem iluminada.')};
    var prep=window.createImageBitmap?createImageBitmap(file,{imageOrientation:'from-image'}):new Promise(function(ok,no){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){URL.revokeObjectURL(u);ok(im)};im.onerror=no;im.src=u});
    Promise.all([prep,faLoad(),Promise.race([mpLoad().catch(function(){return null}),new Promise(function(ok){setTimeout(function(){ok(null)},25000)})])]).then(function(v){
      var src=v[0],fa=v[1],lm=v[2],w=src.width||src.naturalWidth,h=src.height||src.naturalHeight,s=Math.min(1,1400/Math.max(w,h));
      var cv=document.createElement('canvas');cv.width=Math.round(w*s);cv.height=Math.round(h*s);cv.getContext('2d').drawImage(src,0,0,cv.width,cv.height);
      faMsg('Procurando seu rosto');
      var M=null;
      return (lm?mpRead(lm,cv,fa).then(function(x){if(x){M=mpResult(x);return M.r}return faDetect(fa,cv)},function(){return faDetect(fa,cv)}):faDetect(fa,cv)).then(function(r){
        faMsg('Medindo as proporções');
        var wait=Math.max(0,1500-(Date.now()-t0));
        return new Promise(function(ok){setTimeout(ok,wait)}).then(function(){
          if(!r){faErr('Não achei um rosto','Tente de novo com o rosto de frente, bem iluminado, sem óculos e sem boné.');return}
          /* com 478 pontos o rosto é endireitado em 3D: aceita até ~18° de giro; com 68 pontos, a regra de antes */
          var yw=M&&M.yaw!=null?(Math.abs(M.yaw)<=18?1:0):faYaw(r.landmarks.positions);
          if(yw<.62){faErr('Rosto de lado','Olhe direto para a câmera, com a cabeça reta, para medir certinho as proporções.');return}
          var res=faShape(M?M.m:faMeasure(r.landmarks.positions));res.yaw=yw;res.mm=M&&M.mm;res.n478=!!M;
          var gen=FA.gen?fa.detectSingleFace(cv,new fa.TinyFaceDetectorOptions({inputSize:416,scoreThreshold:.4})).withFaceLandmarks(!FA.full).withAgeAndGender().then(function(g){return g&&g.genderProbability>=.9?(g.gender==='female'?'f':'m'):''},function(){return ''}):Promise.resolve('');
          return gen.then(function(g){res.gen=g;faResult(cv,r,res)})})})
    }).catch(fail)}

  /* câmera guiada: oval, avisos ao vivo e foto automática quando o rosto está bem posicionado */
  var CZ=1;
  function camBox(){var w=$('camw');return w?[w.clientWidth||300,w.clientHeight||400]:[300,400]}

  function camFull(on){try{if(window.parent&&window.parent!==window)window.parent.postMessage({lfFull:!!on},location.origin)}catch(_){}}
  function camStop(){var mf=document.querySelector('.modal.camfull');if(mf)mf.classList.remove('camfull');window.removeEventListener('resize',camLayout);if(CAM.st){CAM.st.getTracks().forEach(function(t){t.stop()});CAM.st=null}if(CAM.tm){clearTimeout(CAM.tm);CAM.tm=0}if(CAM.full){CAM.full=false;camFull(false)}}
  function camSay(t){var e=$('camm');if(e)e.textContent=LFI.tr(t)}
  function camLayout(){var w=$('camw'),o=$('camov');if(!w||!o)return;var b=camBox(),ow=Math.min(b[0]*.9,b[1]*.4);o.style.width=ow+'px';o.style.height=ow*1.32+'px';o.style.top=(b[1]*.44)+'px';CAM.ow=ow}
  function faCam(){
    var m=document.querySelector('.modal.fa');if(!m)return;CZ=1;
    m.classList.add('camfull');CAM.full=true;camFull(true);
    m.innerHTML='<div class="camfs" id="camw"><video id="favid" playsinline muted autoplay></video><div class="camov" id="camov"></div>'+
    '<div class="camtop"><b>Posicione seu rosto</b><button type="button" class="x" data-close aria-label="Fechar">×</button></div><div class="camc" id="camc"></div>'+
    '<div class="cambot"><p class="camm" id="camm" role="status" aria-live="polite">Iniciando a câmera…</p><div class="camrow"><button type="button" class="fan camv" data-fanew>Voltar</button><button type="button" class="shut" data-facap aria-label="Tirar a foto agora"></button><button type="button" class="camz" id="camz" data-camz aria-label="Aproximar a imagem">1×</button></div></div></div>';
    camLayout();window.addEventListener('resize',camLayout);
    navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'user',width:{ideal:1920},height:{ideal:1440}}}).then(function(stream){
      if(!$('favid')){stream.getTracks().forEach(function(t){t.stop()});return}
      CAM.st=stream;camWide(stream);camLuz.feito=false;camLuz(false);var v=$('favid');v.srcObject=stream;var pl=v.play();if(pl&&pl.catch)pl.catch(function(){});
      camSay('Preparando a análise…');
      faLoad().then(function(fa){camLoop(fa)},function(){camSay('Posicione o rosto no oval e toque no botão para tirar a foto.')});
    },function(){camStop();CAM.off=true;faOpen()})}
  /* abre a lente ao máximo (zoom mínimo) nos aparelhos que permitem, como a câmera nativa */
  function camWide(stream){try{var tr=stream.getVideoTracks()[0],cp=tr.getCapabilities&&tr.getCapabilities();if(cp&&cp.zoom&&cp.zoom.min!=null)tr.applyConstraints({advanced:[{zoom:cp.zoom.min}]}).catch(function(){})}catch(_){}}
  /* o frame inteiro da câmera (sem recorte): devolve o canvas e onde ele aparece na tela */
  function camFrame(v,W){var vw=v.videoWidth,vh=v.videoHeight,c=document.createElement('canvas');c.width=W;c.height=Math.round(W*vh/vw);c.getContext('2d').drawImage(v,0,0,c.width,c.height);
    var b=camBox(),sc=Math.min(b[0]/vw,b[1]/vh);return {cv:c,dw:vw*sc,dh:vh*sc,bw:b[0],bh:b[1]}}
  function camLoop(fa){
    var good=0,cd=0,tok=0,opt=new fa.TinyFaceDetectorOptions({inputSize:320,scoreThreshold:.35});
    function ok(b){$('camw')&&$('camw').classList.toggle('ok',!!b)}
    function tick(){
      var v=$('favid');if(!v||!CAM.st){camStop();return}
      if(CAM.snap)return; /* a foto já está sendo tirada: não recomeça a contagem */
      if(!v.videoWidth||v.readyState<2){CAM.tm=setTimeout(tick,250);return}
      var fr=camFrame(v,360),cv=fr.cv;
      fa.detectSingleFace(cv,opt).then(function(r){
        if(!$('favid')){camStop();return}
        if(CAM.snap)return;
        var msg='',good1=false,ow=CAM.ow||240;
        if(!r){msg='Não encontro seu rosto. Olhe para a câmera.'}
        else{var bx=r.box,cx0=fr.bw/2,cy0=fr.bh/2,u=1-(bx.x+bx.width/2)/cv.width,vv=(bx.y+bx.height/2)/cv.height,
            sx=cx0+((fr.bw-fr.dw)/2+u*fr.dw-cx0)*CZ,sy=cy0+((fr.bh-fr.dh)/2+vv*fr.dh-cy0)*CZ,fw=bx.width/cv.width*fr.dw*CZ,oc=fr.bh*.44;
          if(fw<ow*.5)msg='Chegue um pouco mais perto';else if(fw>ow*1.05)msg='Afaste só um pouquinho o celular';
          else if(Math.abs(sx-cx0)>ow*.22||Math.abs(sy-oc)>ow*.25)msg='Centralize o rosto no oval';else good1=true}
        if(good1){good++;ok(true);if(cd===0)camSay('Perfeito! Fique parado…');
          if(good>=3&&cd===0){cd=3;tok++;count(tok)}}
        else if(cd===0){good=0;ok(false);camSay(msg)}
        else{cd=0;tok++;good=0;ok(false);var c=$('camc');if(c)c.textContent='';camSay(msg)}
        CAM.tm=setTimeout(tick,300)
      }).catch(function(){CAM.tm=setTimeout(tick,500)})}
    function count(k){
      var c=$('camc');if(!c||cd<=0||k!==tok)return;
      c.textContent=cd;
      setTimeout(function(){if(k!==tok||cd<=0||!$('favid'))return;cd--;if(cd===0){c.textContent='';if(CAM.tm){clearTimeout(CAM.tm);CAM.tm=0}faSnap()}else count(k)},900)}
    tick()}
  function faSnap(){
    var v=$('favid');if(!v||!v.videoWidth||CAM.snap)return;CAM.snap=true;
    camSay('Tirando a foto…');
    var done=function(b){CAM.snap=false;camStop();faRun(b)};
    /* quadro inteiro, sem recorte nem zoom (nao deforma o rosto) */
    var frame=function(){var c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);c.toBlob(done,'image/jpeg',.95)};
    /* foto de verdade da camera (mesma qualidade e correcao de lente da camera do celular) */
    try{var tr=CAM.st&&CAM.st.getVideoTracks()[0];
      if(tr&&window.ImageCapture){new ImageCapture(tr).takePhoto().then(function(b){b&&b.size?done(b):frame()},frame);return}}catch(_){}
    frame()}
  document.addEventListener('change',function(e){var t=e.target;if(t&&(t.id==='fafile'||t.id==='fafile2')){var f=t.files&&t.files[0];t.value='';faRun(f)}});

  /* S429: uma letra só — segue a letra do celular (LFT, até 1,2×) e a largura (LFK); ao girar/redimensionar recalcula */
  (function(){var tm=0,Z=LFZ();function re(){var n=LFZ();if(Math.abs(n-Z)<.005)return;Z=n;var r=document.documentElement;r.classList.toggle('lfg',LFT()>1);r.classList.toggle('zl',n>1&&!matchMedia('(min-width:1100px)').matches);document.body.style.zoom=n==1?'':n;document.body.style.setProperty('--z',n);document.body.style.setProperty('--kz',LFK());setTimeout(function(){try{hguPil()}catch(_){}},60);try{dispatchEvent(new Event('resize'))}catch(_){}/* o resto do site (topo, menu, WhatsApp, abas) mede de novo já com a escala nova */}
    addEventListener('resize',function(){clearTimeout(tm);tm=setTimeout(re,300)});addEventListener('orientationchange',function(){clearTimeout(tm);tm=setTimeout(re,400)})})();
  /* S430 "CABE" — UMA função para o site inteiro (lei L4, aprovada 19/11): texto nunca quebra nem sai do quadro.
     Cada grupo diz como cabe pelo atributo data-cabe:
       "letra"  → a letra do grupo diminui junto, até caber (abas da conta, fileira de gênero, etiquetas "Últimas")
       "escala" → o grupo inteiro encolhe junto, até o último item caber com a mesma margem dos dois lados (topo)
       "curto"  → troca pelo texto de data-curto (menu: "Minha conta · Meus pedidos ›" → "Meus pedidos ›"); marca data-lfc
     Mede de novo quando o grupo muda de tamanho, quando a letra/escala do site muda e quando entra um grupo novo. */
  (function(){
    function kids(el){return [].filter.call(el.children,function(c){return !c.hasAttribute('aria-hidden')&&getComputedStyle(c).display!=='none'})}
    function sobra(el,K){if(!K.length)return el.scrollWidth<=el.clientWidth+.5;var cs=getComputedStyle(el),q=el.getBoundingClientRect(),k=q.width/(el.offsetWidth||q.width)||1,lim=q.left+(el.clientLeft+el.clientWidth-(parseFloat(cs.paddingRight)||0))*k;
      return K.every(function(c){return c.getBoundingClientRect().right<=lim+.5&&c.scrollWidth<=c.clientWidth+.5})}
    function letra(el){var K=kids(el),alvo=K.length?K:[el],ch=el.clientWidth+'|'+el.textContent.length;if(el.__cb===ch&&sobra(el,K))return;
      alvo.forEach(function(c){c.style.fontSize=''});if(!sobra(el,K)){var lo=+(el.getAttribute('data-cabe-min')||8),hi=parseFloat(getComputedStyle(alvo[0]).fontSize)||14;
        for(var k=0;k<8;k++){var md=(lo+hi)/2;alvo.forEach(function(c){c.style.fontSize=md+'px'});if(sobra(el,K))lo=md;else hi=md}
        var fz=Math.floor(lo*4)/4+'px';alvo.forEach(function(c){c.style.fontSize=fz});
        if(!el.__cv){el.__cv=1;requestAnimationFrame(function(){el.__cb=null;pede(el);requestAnimationFrame(function(){el.__cv=0})})}/* confere no quadro seguinte: no meio de uma troca de escala a medida pode vir errada */}
      el.__cb=el.clientWidth+'|'+el.textContent.length;if(el.__tk){try{tkMede(el.__tk);tkVai(el.__tk,el.__tk.sel,false)}catch(_){}}}
    function escala(el){var ln=el.querySelector('[data-cabe-linha]')||el;el.style.zoom='';var W=document.documentElement.clientWidth;
      function ext(){var L=1e9,R=-1e9;[].forEach.call(ln.children,function(e){var q=e.getBoundingClientRect();if(!q.width||getComputedStyle(e).display==='none')return;if(q.left<L)L=q.left;if(q.right>R)R=q.right});return [L,R]}
      var mg=Math.max(0,ext()[0]);for(var k=0;k<4;k++){var r=ext()[1],lim=W-mg;if(r<=lim+1)break;el.style.zoom=Math.floor((parseFloat(el.style.zoom)||1)*(lim/r)*1000)/1000}
      try{dispatchEvent(new Event('lf:topo'))}catch(_){}}
    function curto(el){if(el.__cl==null)el.__cl=el.textContent;if(el.hasAttribute('data-lfc')){el.textContent=el.__cl;el.removeAttribute('data-lfc')}
      if(!el.clientWidth||el.scrollWidth<=el.clientWidth+1)return;el.textContent=el.getAttribute('data-curto');el.setAttribute('data-lfc','1')}
    var M={letra:letra,escala:escala,curto:curto},fila=new Set(),q=0;
    function roda(){q=0;fila.forEach(function(el){if(!el.isConnected)return;try{(M[el.getAttribute('data-cabe')]||letra)(el)}catch(_){}});fila.clear()}
    function pede(el){fila.add(el);if(!q)q=requestAnimationFrame(roda)}
    var ro=window.ResizeObserver?new ResizeObserver(function(L){L.forEach(function(x){pede(x.target)})}):null,vistos=new WeakSet();
    function acha(raiz){(raiz.matches&&raiz.matches('[data-cabe]')?[raiz]:[]).concat([].slice.call(raiz.querySelectorAll?raiz.querySelectorAll('[data-cabe]'):[])).forEach(function(el){if(!vistos.has(el)){vistos.add(el);ro&&ro.observe(el)}pede(el)})}
    window.lfCabeTudo=function(){acha(document.body)};
    new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)acha(n)});if(m.type==='characterData'||m.type==='childList'){var e=m.target.nodeType===1?m.target:m.target.parentElement;var g=e&&e.closest&&e.closest('[data-cabe]');if(g)pede(g)}})}).observe(document.body,{childList:true,subtree:true,characterData:true});
    addEventListener('resize',function(){requestAnimationFrame(lfCabeTudo)});if(document.fonts&&document.fonts.ready)document.fonts.ready.then(lfCabeTudo);acha(document.body)})();
  /* S429 (121, aprovado): área de toque de 44 px por fora do desenho,
     que para no meio do caminho até o vizinho (não cobre letra de outra coisa) */
  (function(){
    function toque(){return matchMedia('(pointer:coarse)').matches||innerWidth<1100}
    function vis(e){var r=e.getBoundingClientRect();if(!r.width||!r.height)return false;for(var x=e;x&&x!==document.body;x=x.parentElement){var c=getComputedStyle(x);if(c.display==='none'||c.visibility==='hidden')return false}return true}
    function areas(){document.querySelectorAll('.lx44').forEach(function(e){e.classList.remove('lx44','lxpos','lxb')});if(!toque())return;
      var sel='a[href],button,[role=button],summary,input:not([type=hidden]),select,label[for]',T=[].filter.call(document.querySelectorAll(sel),vis).filter(function(e){return !e.closest('.lx-ignora')}),R=T.map(function(e){return e.getBoundingClientRect()});
      var TX=[].filter.call(document.querySelectorAll('body *'),function(x){return !x.closest(sel)&&[].some.call(x.childNodes,function(n){return n.nodeType===3&&n.textContent.trim()})&&vis(x)}).map(function(x){return x.getBoundingClientRect()});
      var VZ=R.map(function(r,j){return [r,j]}).concat(TX.map(function(r){return [r,-1]}));
      T.forEach(function(e,i){var r=R[i],z=r.width/(e.offsetWidth||r.width)||1;if(r.width>=44&&r.height>=44)return;
        function livre(ps){var c=getComputedStyle(e,ps).content;return c==='none'||c==='normal'}var usaB=false;if(!livre('::after')){if(livre('::before'))usaB=true;else return}
        var t=Math.max(0,(45-r.height)/2),b=t,l=Math.max(0,(45-r.width)/2),rr=l;
        VZ.forEach(function(v){var o=v[0],j=v[1];if(j===i||(j>=0&&(T[j].contains(e)||e.contains(T[j]))))return;if(j<0&&o.left>=r.left-.5&&o.right<=r.right+.5&&o.top>=r.top-.5&&o.bottom<=r.bottom+.5)return;
          var sv=o.top<r.bottom+b&&o.bottom>r.top-t,sh=o.left<r.right+rr&&o.right>r.left-l;
          if(sv&&o.left>=r.right-1)rr=Math.min(rr,Math.max(0,(o.left-r.right)/2));if(sv&&o.right<=r.left+1)l=Math.min(l,Math.max(0,(r.left-o.right)/2));
          if(sh&&o.top>=r.bottom-1)b=Math.min(b,Math.max(0,(o.top-r.bottom)/2));if(sh&&o.bottom<=r.top+1)t=Math.min(t,Math.max(0,(r.top-o.bottom)/2))});
        if(getComputedStyle(e).position!=='static')e.classList.add('lxpos');e.classList.add('lx44');if(usaB)e.classList.add('lxb');
        e.style.setProperty('--t',t/z+'px');e.style.setProperty('--b',b/z+'px');e.style.setProperty('--l',l/z+'px');e.style.setProperty('--r',rr/z+'px')})}
    var tm=0;function go(){clearTimeout(tm);tm=setTimeout(function(){try{areas()}catch(_){}},120)}
    new MutationObserver(go).observe(document.body,{childList:true,subtree:true});addEventListener('resize',go);addEventListener('load',go);go()})();
  var NUM_LOJA='595983642241';
  /*REDES-RODAPE*/ var SOCIAL={ig:'',fb:''}; /* cole aqui os links dos perfis, ex.: ig:'https://instagram.com/lafouch' */
  (function(){var h=[['ig','Instagram',SOCIAL.ig],['fb','Facebook',SOCIAL.fb]],IC={"ig": "<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17.2\" cy=\"6.8\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/></svg>", "fb": "<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z\"/></svg>", "wa": "<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z\"/><path d=\"M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z\"/></svg>"},out='';
    h.forEach(function(x){if(x[2])out+='<a class="so" href="'+x[2]+'" target="_blank" rel="noopener" aria-label="'+x[1]+'">'+IC[x[0]]+'</a>'});
    if(!out)return;
    out+='<a class="so" href="https://wa.me/'+NUM_LOJA+'" target="_blank" rel="noopener" aria-label="WhatsApp">'+IC.wa+'</a>';
    var o=document.getElementById('sor'),b=document.getElementById('fsc');if(o&&b){o.innerHTML=out;b.hidden=false}})();

  var waB=document.querySelector('a.wa');function waReset(){var w=document.querySelector('a.wa');if(w)w.href='https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(LFI.tr('Olá! Vim pelo catálogo da La Fouch e quero falar com a loja.'));document.documentElement.classList.remove('onprod')}
  function waProd(p){var w=document.querySelector('a.wa');if(w)w.href='https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(LFI.tr('Olá! Quero falar com um vendedor sobre o '+p.nome+' ('+p.ref+').')+'\nhttps://lafouch.com/p/'+encodeURIComponent(p.ref)+'.html');document.documentElement.classList.add('onprod');setTimeout(lfBh,60);setTimeout(lfBh,500)}
  waReset();
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="https://wa.me/"]');if(a&&!NUM_LOJA){e.preventDefault();toast('O WhatsApp da loja ainda não foi configurado')}},true);
  function setLoj(){$('lojista').href='https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(mensagem('lojista'))}
  setLoj();$('aq').addEventListener('input',setLoj);
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-atp]');if(!t)return;e.preventDefault();t.setAttribute('aria-pressed',t.getAttribute('aria-pressed')==='true'?'false':'true');setLoj()});
  /* cópia do pedido de orçamento para o painel (Mensagens › Atacado), com o que a pessoa viu e salvou (só para o dono) */
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('#lojista');if(!t)return;setLoj();
    try{var pr=[].slice.call(document.querySelectorAll('[data-atp][aria-pressed="true"]')).map(function(x){return x.getAttribute('data-atp')});
      acFetch(fnUrl('mensagem'),{method:'POST',headers:{'Content-Type':'application/json'},keepalive:true,body:JSON.stringify({acao:'enviar',tipo:'atacado',cod:st.atCod,pais:LFI.lang==='es'?'Paraguay':'Brasil',qtd:($('aq')||{value:''}).value.trim(),procura:pr,vistos:navVistos().slice(0,20),favs:Object.keys(st.fav).slice(0,20),lang:LFI.lang})}).catch(function(){})}catch(_){}
    setTimeout(function(){st.atCod='';setLoj()},800)},true);
  drawChips();drawCmp();
  /* zoom livre: pinça com dois dedos (aumenta e diminui aos poucos), arrastar, toque e roda do mouse */
  var ZS=2.4,ZMAX=6,ZP={};
  function zImg(b){return b.querySelector(':scope>video.ggv')||b.querySelector(':scope>img,:scope>svg')}
  function zSet(b,s,x,y){
    s=Math.max(1,Math.min(ZMAX,s));var r=b.getBoundingClientRect(),mx=(s-1)*r.width/2,my=(s-1)*r.height/2;
    x=Math.max(-mx,Math.min(mx,x));y=Math.max(-my,Math.min(my,y));b._s=s;b._x=x;b._y=y;var im=zImg(b);
    if(s<=1.01){b._s=1;b._x=0;b._y=0;b.classList.remove('zm');if(im)im.style.transform='';return}
    b.classList.add('zm');if(im)im.style.transform='translate('+x+'px,'+y+'px) scale('+s+')'}
  function zRel(b,cx,cy){var r=b.getBoundingClientRect();return [cx-(r.left+r.width/2),cy-(r.top+r.height/2)]}
  function zBase(b){var ids=Object.keys(ZP).filter(function(k){return ZP[k].b===b});b._g={n:ids.length,s:b._s||1,x:b._x||0,y:b._y||0};
    if(ids.length===1){var q=ZP[ids[0]];b._g.cx=q.x;b._g.cy=q.y}
    else if(ids.length>=2){var p1=ZP[ids[0]],p2=ZP[ids[1]];b._g.d=Math.hypot(p1.x-p2.x,p1.y-p2.y)||1;b._g.cx=(p1.x+p2.x)/2;b._g.cy=(p1.y+p2.y)/2}}
  document.addEventListener('pointerdown',function(e){
    var b=e.target.closest&&e.target.closest('.big[data-zoom]');if(!b||e.target.closest('.dfav')||e.target.closest('.g360')||e.target.closest('.ggp')||(e.pointerType==='mouse'&&e.button!==0))return;
    ZP[e.pointerId]={b:b,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false};
    try{b.setPointerCapture(e.pointerId)}catch(_){}
    if(b._s==null){b._s=1;b._x=0;b._y=0}
    if(Object.keys(ZP).filter(function(k){return ZP[k].b===b}).length>1){b.classList.add('dg');Object.keys(ZP).forEach(function(k){if(ZP[k].b===b)ZP[k].moved=true})}
    zBase(b)});
  document.addEventListener('pointermove',function(e){
    var q=ZP[e.pointerId];if(!q)return;var b=q.b;q.x=e.clientX;q.y=e.clientY;
    if(Math.abs(q.x-q.sx)+Math.abs(q.y-q.sy)>6)q.moved=true;
    var ids=Object.keys(ZP).filter(function(k){return ZP[k].b===b}),g=b._g;if(!g)return;
    if(ids.length>=2){
      e.preventDefault();b.classList.add('dg');var p1=ZP[ids[0]],p2=ZP[ids[1]],d=Math.hypot(p1.x-p2.x,p1.y-p2.y)||1,mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2,s2=g.s*d/g.d,
        m0=zRel(b,g.cx,g.cy),m1=zRel(b,mx,my),ux=(m0[0]-g.x)/g.s,uy=(m0[1]-g.y)/g.s;
      zSet(b,s2,m1[0]-s2*ux,m1[1]-s2*uy)
    }else if(b.classList.contains('zm')&&q.moved){e.preventDefault();b.classList.add('dg');zSet(b,b._s,g.x+(q.x-g.cx),g.y+(q.y-g.cy))}},{passive:false});
  function zEnd(e){
    var q=ZP[e.pointerId];if(!q)return;var b=q.b,mv=q.moved,cancel=e.type==='pointercancel';delete ZP[e.pointerId];
    var left=Object.keys(ZP).filter(function(k){return ZP[k].b===b}).length;
    if(left>0){zBase(b);return}
    b.classList.remove('dg');b._g=null;if(mv||cancel)return;
    if(b.classList.contains('zm'))zSet(b,1,0,0);
    else{var c=zRel(b,e.clientX,e.clientY);zSet(b,ZS,-c[0]*(ZS-1),-c[1]*(ZS-1))}}
  document.addEventListener('pointerup',zEnd);document.addEventListener('pointercancel',zEnd);
  document.addEventListener('wheel',function(e){var b=e.target.closest&&e.target.closest('.big[data-zoom]');if(!b)return;e.preventDefault();
    var s0=b._s||1,s2=s0*Math.exp(-e.deltaY*0.0022),c=zRel(b,e.clientX,e.clientY),x0=b._x||0,y0=b._y||0,ux=(c[0]-x0)/s0,uy=(c[1]-y0)/s0;b.classList.remove('dg');zSet(b,s2,c[0]-s2*ux,c[1]-s2*uy)},{passive:false});
  $('stage').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();$('stage').click()}});
  /* vídeo promocional: vem da configuração do painel; ?video=arquivo.mp4 serve para testar */
  /* sincronização com o painel da loja (Firebase, só leitura pública; se falhar, vale o catálogo embutido) */
  var FB={p:'lafouch-2f6bd',k:'AIzaSyAW-54tS1A_VL2EC9OJWFsw1EtboptpEvc'};
  function fbv(v){if('stringValue' in v)return v.stringValue;if('integerValue' in v)return +v.integerValue;if('doubleValue' in v)return v.doubleValue;if('booleanValue' in v)return v.booleanValue;if('nullValue' in v)return null;if('arrayValue' in v)return (v.arrayValue.values||[]).map(fbv);if('mapValue' in v)return fbd(v.mapValue);return null}
  function fbd(d){var o={},f=d.fields||{};for(var k in f)o[k]=fbv(f[k]);return o}
  function fbg(path){return acFetch('https://firestore.googleapis.com/v1/projects/'+FB.p+'/databases/(default)/documents/'+path+(path.indexOf('?')<0?'?':'&')+'key='+FB.k,null,true).then(function(r){if(!r.ok)throw new Error('fb');return r.json()})}
  var LOJA=/[?&]loja=1/.test(location.search)&&window.parent!==window;
  var PREV=/[?&](cliente=1|p=\d)/.test(location.search);var CFG={ativo:true};try{var _c=JSON.parse(localStorage.getItem('lf_cfg')||'null');if(_c&&!PREV){delete _c._f;CFG=_c}}catch(_){}
  var ADM=null,LF_ADM=false;
  function edb(p){return LF_ADM?'<button type="button" class="edt" data-edit="'+p.ref+'" aria-label="Editar '+esc(p.nome)+'">✎ Editar</button>':''}
  function isAdm(){var rt='';try{rt=localStorage.getItem('lf_rt')||''}catch(_){}
    if(!rt||/[?&]cliente/.test(location.search))return Promise.resolve(false);
    return fetch('https://securetoken.googleapis.com/v1/token?key='+FB.k,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=refresh_token&refresh_token='+encodeURIComponent(rt)}).then(function(r){return r.json()}).then(function(j){return !!j.id_token}).catch(function(){return false})}
  function placeCbl(){var cb=$('cbl'),ms=document.querySelector('.mobsearch');if(!cb||!ms)return;if(cb.nextSibling!==ms)ms.parentNode.insertBefore(cb,ms)}
  matchMedia('(min-width:600px)').addEventListener('change',placeCbl);
  function cotLine(){var el=document.getElementById('cbl'),c=CFG.cotacao;if(el)el.hidden=true;return;/* 08/11: o cliente não vê a cotação */if(!el||!c||!(c.brl>0))return;var th=function(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')};el.textContent='US$ 1 = Gs. '+th(c.usd)+(c.usd>0?'  ·  R$ '+(c.rpu>0?c.rpu:c.usd/c.brl).toFixed(2).replace('.',','):'');el.hidden=false}
  function applyCot(){var th=function(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')},c=CFG.cotacao,el=document.getElementById('cambio');if(!c||!(c.brl>0))return;var ch=window.LF_RATE()!==c.brl;window.LF_RATE(c.brl);
    if(el){el.innerHTML='<b>'+LFI.tr('Câmbio da loja')+'</b><br>US$ 1 = Gs. '+th(c.usd)+' · R$ 1 = Gs. '+th(c.brl);el.hidden=false}
    cotLine();if(ch&&typeof redraw==='function')redraw()}
  function manut(){
    var m=document.getElementById('manut'),ab=document.getElementById('admb');
    if(CFG.ativo!==false){if(m)m.remove();if(ab)ab.remove();var pvb=document.getElementById('prvb');if(pvb)pvb.remove();document.documentElement.style.overflow='';return}
    if(!CFG._f)return;/* o cache sozinho nunca liga a tela de manutenção: espera a confirmação da nuvem */
    /* prévia do botão "Cliente" no painel: mostra a vitrine como se estivesse no ar, mesmo desligado (para montar a vitrine) */
    if(/[?&]cliente/.test(location.search)&&window.parent!==window){var pv=document.getElementById('prvb');if(m)m.remove();document.documentElement.style.overflow='';
      if(!pv){pv=document.createElement('div');pv.id='prvb';pv.innerHTML='<span>Prévia · os clientes ainda não veem</span><button type="button">Pôr no ar</button>';pv.querySelector('button').onclick=function(){try{window.parent.postMessage({lfPorNoAr:1},location.origin)}catch(_){}};document.body.appendChild(pv)}dgPoe();return}
    (ADM||(ADM=isAdm())).then(function(adm){
      if(CFG.ativo!==false)return;m=document.getElementById('manut');ab=document.getElementById('admb');
      if(adm){if(m)m.remove();document.documentElement.style.overflow='';
        /* S425 (pedido do dono 18/11 13:17): sem o quadro preto do administrador e sem "Abrir painel"; fica só a linha do diagnóstico, clara e pequena,
           com um botão que recolhe numa bolinha (lembra aberta/fechada em lf_dgfech) */
        if(!ab){ab=document.createElement('div');ab.id='admb';ab.className='adm2';ab.setAttribute('role','status');document.body.appendChild(ab)}
        if(!ab.querySelector('.admx')){ab.innerHTML='<small id="admd" class="lfdg"></small><button type="button" class="admx" aria-label="'+LFI.tr('Recolher o diagnóstico')+'" aria-expanded="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>';
          var dfe=function(f){ab.classList.toggle('fech',f);var bx=ab.querySelector('.admx');bx.setAttribute('aria-expanded',f?'false':'true');bx.setAttribute('aria-label',LFI.tr(f?'Mostrar o diagnóstico':'Recolher o diagnóstico'));try{localStorage.setItem('lf_dgfech',f?'1':'0')}catch(_){}};
          ab.querySelector('.admx').addEventListener('click',function(e){e.stopPropagation();dfe(!ab.classList.contains('fech'))});var f0=false;try{f0=localStorage.getItem('lf_dgfech')==='1'}catch(_){}dfe(f0)}
        dgPoe();return}
      if(!m){m=document.createElement('div');m.id='manut';m.setAttribute('role','alertdialog');m.setAttribute('aria-modal','true');document.body.appendChild(m)}
      m.innerHTML='<div class="mlogo" aria-hidden="true"></div><h2>Estamos atualizando o catálogo</h2><p>'+esc(CFG.aviso||'Voltamos já! Enquanto isso, fale com a gente pelo WhatsApp.')+'</p><a class="btn w ic" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'"><span>Falar com a loja</span>'+WAI+'</a>';
      document.documentElement.style.overflow='hidden'})}
  var slT=null;
  function heroClear(st){
    if(slT){clearInterval(slT);slT=null}st._upd=null;
    Array.prototype.forEach.call(st.querySelectorAll('video.pv,img.pf,svg.gl,.sli,.dots'),function(e){e.remove()});
    st.classList.remove('hasv');st.removeAttribute('data-open');st.removeAttribute('aria-label');
    var tg=st.querySelector('.tg');if(tg)tg.hidden=false;
    var tag=st.querySelector('.tag');if(tag)tag.innerHTML=''}
  function heroTag(st,p){
    var tag=st.querySelector('.tag');if(!tag)return;
    tag.innerHTML=p?'<span class="td">'+esc(p.ref+' · '+p.nome.toUpperCase())+'</span><span class="tm">'+esc(p.nome)+'</span><b class="tp">'+fmt(p.n)+'</b>':''}
  function heroVis(p){return p&&!p.oculto&&!(p.est===0)}
  function heroAuto(){
    try{var da=dstAuto();if(da.length)return da[0].p}catch(_){}
    var l=String(CFG.dauto||'').split(',').filter(Boolean);
    for(var i=0;i<l.length;i++){var p=find(l[i]);if(heroVis(p)&&p.foto)return p}
    var b=null;P.forEach(function(q){if(q.est>0&&heroVis(q)&&q.foto&&(!b||q.est>b.est))b=q});
    return b}
  var CX=true;
  function stageFx(st){
    var l=String(CFG.efx||'').split(',').filter(Boolean);
    if(l.length)st.setAttribute('data-fx',l.join(' '));else st.removeAttribute('data-fx');
    var r=st.querySelector('.rfl');
    if(l.indexOf('refl')>=0&&!r)st.insertAdjacentHTML('beforeend','<span class="rfl" aria-hidden="true"><i></i></span>');
    else if(l.indexOf('refl')<0&&r)r.remove();
    if(CX&&l.indexOf('cascata')>=0){CX=false;st.setAttribute('data-cx','');setTimeout(function(){st.style.animation='none';st.removeAttribute('data-cx')},3000)}}
  (function(){var st=$('stage');if(!st)return;var rs=function(){st.style.transform=''};
    st.addEventListener('pointermove',function(e){if(String(CFG.efx||'').indexOf('incl')<0||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      var r=st.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;st.style.transform='perspective(900px) rotateY('+(x*18)+'deg) rotateX('+(-y*14)+'deg)'});
    st.addEventListener('pointerleave',rs);st.addEventListener('pointercancel',rs)})();
  function setHero(){
    var st=$('stage'),hero=document.querySelector('.hero');if(!st)return;stageFx(st);
    var m=CFG.dmodo||(CFG.video?'video':CFG.destaque?'produto':'nada'),p=null,sl=[];
    if(m==='auto')p=heroAuto();
    else if(m==='produto'){p=find(CFG.destaque||'');if(!heroVis(p))p=null}
    else if(m==='slide')sl=String(CFG.slide||'').split(',').map(function(r){return r.indexOf('media/')===0?{ref:r,nome:'',n:0,foto:r,m:1}:find(r)}).filter(function(q){return heroVis(q)&&q.foto});
    var vid=m==='video'?(CFG.video||''):'';
    var sig=m+'|'+(p?p.ref+'|'+(p.foto?1:0)+'|'+p.n:'')+'|'+sl.map(function(q){return q.ref}).join(',')+'|'+vid+'|'+(m==='slide'?CFG.sanim||'':'');
    if(st.getAttribute('data-sig')===sig){if(p)heroTag(st,p);return}
    if(m==='slide'&&st._upd&&String(st.getAttribute('data-sig')||'').indexOf('slide|')===0&&st._upd(sl)){st.setAttribute('data-sig',sig);return}
    var keepRef=(m==='slide'&&String(st.getAttribute('data-sig')||'').indexOf('slide|')===0)?st.getAttribute('data-cur'):null;
    st.setAttribute('data-sig',sig);heroClear(st);
    var show=!!(p||sl.length>1||(sl.length===1)||vid);
    st.hidden=!show;if(hero)hero.classList.toggle('nost',!show);
    if(!show)return;
    if(vid){var tg0=st.querySelector('.tg');if(tg0)tg0.hidden=true;applyVideo(vid);return}
    if(sl.length){slide(st,sl,keepRef);return}
    st.setAttribute('data-open',p.ref);st.setAttribute('aria-label','Ver '+p.nome);
    if(p.foto){var im=document.createElement('img');im.className='pf';im.alt=p.nome;im.draggable=false;im.src=p.foto;
      /* a foto só entra depois de decodificada: a animação não engasga decodificando no meio */
      var ins=function(){if(st.getAttribute('data-sig')!==sig||im.parentNode)return;st.insertBefore(im,st.querySelector('.tag'))};
      if(im.decode)im.decode().then(ins,ins);else ins()}
    heroTag(st,p)}
  function slide(st,sl,keepRef){
    var k0=0;if(keepRef)sl.forEach(function(q,i){if(q.ref===keepRef)k0=i});var h='';sl.forEach(function(q,i){h+='<img class="sli'+(i===k0?' on':'')+'" data-ref="'+esc(q.ref)+'" alt="'+esc(q.nome)+'" draggable="false" src="'+q.foto+'">'});
    st.insertAdjacentHTML('afterbegin',h);
    var imgs=st.querySelectorAll('.sli'),dots=null,at=0;Array.prototype.forEach.call(imgs,function(e){if(e.decode)e.decode().catch(function(){})});st.setAttribute('data-sa',['slide','flip','zoom','circle','pile'].indexOf(CFG.sanim)<0?'fade':CFG.sanim);
    if(sl.length>1){dots=document.createElement('div');dots.className='dots';
      dots.innerHTML=sl.map(function(q,i){return '<button type="button" aria-label="Foto '+(i+1)+'"'+(i?'':' class="on"')+' data-s="'+i+'"></button>'}).join('');
      st.appendChild(dots)}
    st._upd=function(n){
      var cur=sl[at]&&sl[at].ref,ks=n.map(function(q){return q.ref});
      if(n.length<2||ks.indexOf(cur)<0)return false;
      Array.prototype.forEach.call(imgs,function(e){if(ks.indexOf(e.getAttribute('data-ref'))<0)e.remove()});
      var prev=null;n.forEach(function(q){var e=null;Array.prototype.forEach.call(st.querySelectorAll('.sli'),function(x){if(x.getAttribute('data-ref')===q.ref)e=x});
        if(!e){e=document.createElement('img');e.className='sli';e.setAttribute('data-ref',q.ref);e.alt=q.nome;e.draggable=false;e.src=q.foto;st.insertBefore(e,prev?prev.nextSibling:st.firstChild)}prev=e});
      imgs=st.querySelectorAll('.sli');sl=n;at=ks.indexOf(cur);
      st.setAttribute('data-sa',['slide','flip','zoom','circle','pile'].indexOf(CFG.sanim)<0?'fade':CFG.sanim);
      if(!dots){dots=document.createElement('div');dots.className='dots';st.appendChild(dots)}
      dots.innerHTML=n.map(function(q,i){return '<button type="button" aria-label="Foto '+(i+1)+'"'+(i===at?' class="on"':'')+' data-s="'+i+'"></button>'}).join('');
      return true};
    function go(i,first){
      var sa=st.getAttribute('data-sa');
      if(sa==='flip'&&!first&&st.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        var a=st.animate([{transform:'perspective(1200px) rotateY(0deg)'},{transform:'perspective(1200px) rotateY(90deg)'}],{duration:340,easing:'ease-in'});
        a.onfinish=function(){show(i);st.animate([{transform:'perspective(1200px) rotateY(-90deg)'},{transform:'perspective(1200px) rotateY(0deg)'}],{duration:340,easing:'ease-out'})};return}
      show(i)}
    function show(i){
      at=(i+sl.length)%sl.length;
      Array.prototype.forEach.call(imgs,function(e,k){
        if(k===at){e.classList.remove('l');e.classList.add('on');return}
        if(e.classList.contains('on')){e.classList.remove('on');e.classList.add('l');return}
        e.classList.add('nt');e.classList.remove('l');void e.offsetWidth;e.classList.remove('nt')});
      if(dots)Array.prototype.forEach.call(dots.children,function(e,k){e.classList.toggle('on',k===at)});
      st.setAttribute('data-cur',sl[at].ref);if(sl[at].m){st.removeAttribute('data-open');st.removeAttribute('aria-label')}else{st.setAttribute('data-open',sl[at].ref);st.setAttribute('aria-label','Ver '+sl[at].nome)}
      var tg=st.querySelector('.tag'),cur=sl[at],sw=function(){if(st.getAttribute('data-cur')!==cur.ref)return;heroTag(st,cur.m?null:cur);if(tg)tg.classList.remove('tf')};
      if(tg&&tg.innerHTML&&st.getAttribute('data-sa')==='slide'){tg.classList.add('tf');setTimeout(sw,230)}else sw()}
    go(k0,true);
    if(!keepRef&&imgs.length&&st.getAttribute('data-sa')!=='flip'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var i0=imgs[0];i0.style.transition='none';i0.classList.remove('on');void i0.offsetWidth;i0.style.transition='';requestAnimationFrame(function(){requestAnimationFrame(function(){i0.classList.add('on')})})}
    function run(){if(slT)clearInterval(slT);slT=null;if(sl.length<2||matchMedia('(prefers-reduced-motion: reduce)').matches)return;slT=setInterval(function(){if(!document.hidden)go(at+1)},4000)}
    if(dots)dots.addEventListener('click',function(e){var b=e.target.closest('button[data-s]');e.stopPropagation();if(!b)return;go(+b.getAttribute('data-s'));run()});
    run()}
  function applyVideo(u){
    var st2=$('stage'),old=st2&&st2.querySelector('video.pv');
    if(!u){if(old){old.remove();st2.classList.remove('hasv')}return}
    if(old&&old.getAttribute('data-u')===u)return;if(old)old.remove();
    var v=document.createElement('video');v.className='pv';v.setAttribute('data-u',u);v.muted=true;v.defaultMuted=true;v.loop=true;v.playsInline=true;v.autoplay=true;v.preload='auto';v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');v.disablePictureInPicture=true;
    v.addEventListener('canplay',function(){if(!v.isConnected){st2.insertBefore(v,st2.firstChild);st2.classList.add('hasv');var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})}},{once:true});
    v.addEventListener('error',function(){if(v.parentNode)v.remove();st2.classList.remove('hasv');st2.hidden=true;var hh=document.querySelector('.hero');if(hh)hh.classList.add('nost')});
    v.src=u;v.load()}
  /* 08/11 SITE LEVE: fotos guardadas no banco do navegador (IndexedDB), lidas uma vez e sem travar a tela.
     Antes ficavam no localStorage (~800 KB lidos de forma síncrona a cada visita, o que congelava celular fraco). */
  /* começo rápido (21/11, internet fraca parte 1): /dados/inicio.json é pedido no <head>, junto com o programa; aqui só se usa a resposta.
     Sem o arquivo (ou sem rede) vale {} e tudo vem da nuvem, como antes. */
  var INI=(window.__lfIni||Promise.resolve({})).then(function(j){return j&&typeof j==='object'?j:{}},function(){return {}});
  var FCM=null,FCQ=[],FCDB=null;
  function fcDb(){if(FCDB)return FCDB;FCDB=new Promise(function(ok,no){try{var r=indexedDB.open('lf-fotos',1);r.onupgradeneeded=function(){r.result.createObjectStore('f')};r.onsuccess=function(){ok(r.result)};r.onerror=function(){no(r.error)}}catch(e){no(e)}});return FCDB}
  function fcPronto(fn){if(FCM)return fn();FCQ.push(fn)}
  function fcSolta(){if(!FCM)FCM={};var q=FCQ;FCQ=[];q.forEach(function(f){try{f()}catch(_){}})}
  function fcSet(ref,o){if(!FCM)FCM={};FCM[ref]=o;fcDb().then(function(db){var t=db.transaction('f','readwrite');t.objectStore('f').put(o,ref)}).catch(function(){})}
  (function(){var lim=setTimeout(fcSolta,1200);
    fcDb().then(function(db){return new Promise(function(ok){var m={},st=db.transaction('f','readonly').objectStore('f'),rq=st.openCursor();rq.onsuccess=function(){var c=rq.result;if(c){m[c.key]=c.value;c.continue()}else ok(m)};rq.onerror=function(){ok(m)}})})
      .then(function(m){clearTimeout(lim);FCM=Object.assign(m,FCM||{});
        /* migra as fotos antigas do localStorage (uma vez) e libera o espaço */
        try{Object.keys(localStorage).forEach(function(k){if(k.indexOf('lf_ph_')!==0)return;var r=k.slice(6),c=null;try{c=JSON.parse(localStorage.getItem(k)||'null')}catch(_){}if(c&&c.d&&!FCM[r])fcSet(r,c);localStorage.removeItem(k)})}catch(_){}
        fcSolta()},function(){clearTimeout(lim);
        /* sem IndexedDB (modo privado antigo): usa o localStorage como antes */
        try{FCM={};Object.keys(localStorage).forEach(function(k){if(k.indexOf('lf_ph_')===0){try{FCM[k.slice(6)]=JSON.parse(localStorage.getItem(k))}catch(_){}}})}catch(_){}fcSolta()})})();
  /* 09/11 S27h (aprovado): o código é o nome; a descrição explica. O app manda fm (formato) e mr (marca de verdade, da haste).
     Cartão: linha cinza "Quadrado · acetato" (ou "Kazwini · gatinho") + o código como título. Página: "Óculos de leitura quadrado". Nada inventado, sem cor. */
  var LFN_F={pt:{Redondo:['redondo','redonda'],Quadrado:['quadrado','quadrada'],Retangular:['retangular','retangular'],Gatinho:['gatinho','gatinho'],Aviador:['aviador','aviador'],Oval:['oval','oval'],Hexagonal:['hexagonal','hexagonal']},
    es:{Redondo:['redondos','redondo','Redondo'],Quadrado:['cuadrados','cuadrado','Cuadrado'],Retangular:['rectangulares','rectangular','Rectangular'],Gatinho:['gatito','gatito','Gatito'],Aviador:['aviador','aviador','Aviador'],Oval:['ovalados','ovalado','Ovalado'],Hexagonal:['hexagonales','hexagonal','Hexagonal']}};
  var LFN_M={es:{'Plástico':'plástico','Titânio':'titanio','Nylon':'nylon','Metal':'metal','Acetato':'acetato','TR90':'TR90'}};
  function lfnMat(m){m=String(m||'').trim();if(!m)return '';if(LFI.lang==='es')return (LFN_M.es[m]||m.toLowerCase());return m==='TR90'?m:m.toLowerCase()}
  function lfnNomes(p){var fm=String(p.fm||'').trim(),mr=String(p.mr||'').trim(),es=LFI.lang==='es',t=p.tipo==='solar'?'s':p.tipo==='grau'?'g':'a';
    var F=fm?(es?LFN_F.es[fm]:LFN_F.pt[fm]):null,cap=function(x){return x?x.charAt(0).toUpperCase()+x.slice(1):x};
    var base=es?(t==='g'?'Lentes de lectura':t==='s'?'Lentes de sol':'Armazón'):(t==='g'?'Óculos de leitura':t==='s'?'Óculos de sol':'Armação');
    var adj=F?(t==='a'?F[1]:F[0]):(fm?fm.toLowerCase():''),adj1=F?(es?F[1]:F[0]):(fm?fm.toLowerCase():'');
    var tit=(fm||mr)?base+(mr?' '+mr:'')+(adj?' '+adj:''):p.nome,mat=lfnMat(p.mat);
    /* 09/11 S33 (aprovado): armação mostra o material; solar e leitura mostram o formato (se faltar, o outro) */
    var w=t==='a'?(mat||adj1):(adj1||mat);var ds=mr?(mr+(w?' · '+w:'')):cap(w);
    return {tit:tit,ds:ds}}
  /* 09/11 S33: a descrição nunca corta no meio — se "Marca · palavra" não couber, fica só a palavra */
  function lfDsFit(todos){document.querySelectorAll(todos?'.hds,.lfds,.rds':'.hds:not([data-f]),.lfds:not([data-f]),.rds:not([data-f])').forEach(function(e){if(!e.clientWidth)return;var f=e.getAttribute('data-f');if(f==null){f=e.textContent;e.setAttribute('data-f',f)}if(f.indexOf(' · ')<0)return;
    if(e.textContent!==f)e.textContent=f;if(e.scrollWidth>e.clientWidth+1)e.textContent=f.split(' · ').pop()})}
  (function(){var q=0;try{new MutationObserver(function(){if(q)return;q=requestAnimationFrame(function(){q=0;lfDsFit()})}).observe(document.body,{childList:true,subtree:true})}catch(_){}addEventListener('resize',function(){lfDsFit(true)})})();
  /* 09/11 S57 (aprovado): sem colisões com letra grande — etiqueta que não cabe diminui; "Comprar · R$" que quebraria mostra só "Comprar";
     WhatsApp some enquanto rola e, na peça, vira um botão dentro da barra de compra */
  (function(){
    function ajusta(){
      document.querySelectorAll('.ph .tg,.card .stk').forEach(function(t){if(!t.clientWidth)return;var kw=t.clientWidth+'|'+t.textContent+'|'+innerWidth;if(t._kw===kw)return;t._kw=kw;var f=parseFloat(t.getAttribute('data-fz')||getComputedStyle(t).fontSize);if(!t.hasAttribute('data-fz')){t.setAttribute('data-fz',f);}
        t.style.fontSize='';t.style.letterSpacing='';var n=0;while(t.scrollWidth>t.clientWidth+1&&n++<8){var cs=parseFloat(getComputedStyle(t).fontSize);t.style.fontSize=(cs*.9)+'px';t.style.letterSpacing='.06em'}});
      document.querySelectorAll('#layer .bb.p').forEach(function(b){var s=b.querySelector('span');if(!s)return;b.classList.remove('cur');if(s.scrollWidth>s.clientWidth+1)b.classList.add('cur')});
      /* S112: sem o botão do WhatsApp dentro da barra; guarda a altura da barra para o WhatsApp flutuar logo acima dela */
      var bb=document.querySelector('#layer .buy')||document.querySelector('#layer .buyrow');if(bb&&bb.offsetHeight){var cb=getComputedStyle(bb),hb=cb.position==='fixed'?bb.offsetHeight+(parseFloat(cb.bottom)||0):Math.max(0,Math.round(innerHeight-bb.getBoundingClientRect().top));document.documentElement.style.setProperty('--lfbb',hb+'px')}}
    var q=0;try{new MutationObserver(function(){if(q)return;q=requestAnimationFrame(function(){q=0;ajusta()})}).observe(document.body,{childList:true,subtree:true})}catch(_){}addEventListener('resize',function(){try{ajusta()}catch(_){}});
    addEventListener('resize',ajusta);
    /* parado: se o botão ficaria por cima de algum texto ou botão, ele se recolhe para a beirada (aba) — toque nela abre o WhatsApp */
    function naPeca(){return document.documentElement.classList.contains('onprod')||!!document.querySelector('#layer .buyrow')}
    function cobre(){/* S230 (14/11): vale em qualquer largura; mede a bola SEM animação, em 9 pontos (inclui os cantos); se cobriria algo vira lingueta (html.wamin) */
      var w=document.querySelector('a.wa'),H=document.documentElement;if(!w||naPeca()){H.classList.remove('wamin');return}
      var sv=w.querySelector('svg'),tr=w.style.transition,ts=sv?sv.style.transition:'',era=H.classList.contains('wamin'),rol=H.classList.contains('warol');
      w.style.transition='none';if(sv)sv.style.transition='none';H.classList.remove('wamin','warol');
      var r=w.getBoundingClientRect(),hit=false;
      if(r.width){w.style.setProperty('pointer-events','none','important');
        [.08,.5,.92].forEach(function(fx){[.08,.5,.92].forEach(function(fy){if(hit)return;var e=document.elementFromPoint(r.left+r.width*fx,r.top+r.height*fy);if(!e||e===document.body||e===H||e.closest('a.wa'))return;
          if(/^(BUTTON|A|IMG|INPUT|SELECT|TEXTAREA|SVG|PATH)$/i.test(e.tagName)||e.closest('button,a,input')){hit=true;return}
          if([].some.call(e.childNodes,function(n){return n.nodeType===3&&n.textContent.trim()}))hit=true})});
        w.style.removeProperty('pointer-events')}else hit=era;
      if(era)H.classList.add('wamin');if(rol)H.classList.add('warol');void w.offsetWidth;
      w.style.transition=tr;if(sv)sv.style.transition=ts;void w.offsetWidth;H.classList.toggle('wamin',hit)}
    var rt=0;document.addEventListener('scroll',function(){var H=document.documentElement;H.classList.add('warol');clearTimeout(rt);rt=setTimeout(function(){cobre();H.classList.remove('warol')},600)/* S430: rolando, o WhatsApp sai pela borda (também na peça) e volta 0,6 s depois que a pessoa para (aprovado 19/11) *//* S239: mede ANTES de soltar o 'rolando' — assim a lingueta abre na bola com a mesma animação suave de quando recolhe (antes a medição cortava a animação) */},true);
    setTimeout(cobre,1500);addEventListener('resize',function(){setTimeout(cobre,200)});document.addEventListener('click',function(){setTimeout(cobre,900)},true);
    window.__lfAjusta=ajusta})();
  function syncProds(docs){
    var base={};P.forEach(function(p){base[p.ref]=p});
    var L=docs.map(function(d){var r=fbd(d);r.ref=r.ref||d.name.split('/').pop();var b=base[r.ref]||{};
      var p=Object.assign({},b,r);p.esgRes=false;/* 08/11: a categoria vem só do tipo do app (o campo do painel saiu) */if(b.fv!==r.fv)p.fc=[];if(r.nome)r.nome=p.nome=String(r.nome).replace(/^[ÓO]culos de grau(?=\s|$)/i,'Óculos de leitura');/* 08/11: grau → leitura */if(r.nome&&LFI.lang==='es')p.nome=LFI.tn(r.nome);if(r.fm!=null||r.mr!=null){var nn=lfnNomes(p);p.nome=nn.tit;p.ds=nn.ds}else delete p.ds;return p}).filter(function(p){return !p.oculto});
    if(!L.length)return;
    L.sort(function(a,b){return (a.ord||0)-(b.ord||0)});
    L.forEach(function(p){
      var h=0;for(var i=0;i<p.ref.length;i++)h=(h*31+p.ref.charCodeAt(i))>>>0;
      if(!p.lib&&(!p.med||p.med.length<3))p.med=[48+h%9,16+(h>>>3)%7,140+(h>>>5)%6];
      if(!p.mat&&!p.lib)p.mat=(String(p.nome).toLowerCase().indexOf('metal')>=0?'Metal':MATS[p.tag]||'Acetato');
      if(p.uv===undefined)p.uv=p.tipo==='solar';
      if(!p.rosto||!p.rosto.length)p.rosto=['oval'];if(!p.tag)p.tag=String(p.tipo||'').toUpperCase();if(p.aviso===undefined)p.aviso='';
      if(!p.cores||!p.cores.length)p.cores=[p.cor||'#2a2d33'];if(!p.cor)p.cor=p.cores[0];});
    P.length=0;Array.prototype.push.apply(P,L);try{aplicaEst()}catch(_){}
    var has={};P.forEach(function(p){has[p.ref]=1});
    Object.keys(st.cart).forEach(function(k){if(!has[k])delete st.cart[k]});Object.keys(st.fav).forEach(function(k){if(!has[k])delete st.fav[k]});st.cmp=st.cmp.filter(function(k){return has[k]});
    redraw();
    var heroRefs={};String(CFG.slide||'').split(',').concat([CFG.destaque||''],String(CFG.dauto||'').split(',')).forEach(function(r){if(r)heroRefs[r]=1});
    if(CFG.dmodo==='auto'||!Object.keys(heroRefs).length){P.slice().sort(function(a,b){return (b.est||0)-(a.est||0)}).slice(0,4).forEach(function(q){heroRefs[q.ref]=1})}
    INI.then(function(ini){fcPronto(function(){var fo=0,esp=[],AQ=ini.fotos||{};P.forEach(function(p){
      if(!(p.fv>0))return;var c=FCM&&FCM[p.ref],q=AQ[p.ref];
      if(c&&c.v===p.fv&&c.d){poeFoto(p,c.d);fo=1;return}
      /* a foto desta versão já é um arquivo do site (robô das páginas): o navegador baixa como imagem comum, sem ir à nuvem */
      if(q&&+q[0]===+p.fv){poeFoto(p,q[1]);fo=1;return}
      var busca=function(){return fbg('fotos/'+p.ref).then(function(d){var o=fbd(d);if(!o.d)return;poeFoto(p,o.d);fcSet(p.ref,{v:p.fv,d:o.d});if(heroRefs[p.ref]){setHero()}clearTimeout(syncProds.t);syncProds.t=setTimeout(function(){redraw();setHero()},heroRefs[p.ref]?60:250)}).catch(function(){})};
      /* as fotos do destaque vêm primeiro; o resto do catálogo só depois, para não disputar a rede */
      esp.push(heroRefs[p.ref]?busca():new Promise(function(r){setTimeout(function(){busca().then(r)},900)}))});
    /* a primeira tela está pronta (peças e fotos): só agora o selo é pedido — o reCAPTCHA (350 KB) não disputa a rede com o catálogo */
    Promise.all(esp).then(acTok);
    if(fo)redraw()})})}
  /* reservas em tempo real: a lista pública estoque/<ref> só existe enquanto há peça reservada */
  var EST=null,ESTT=0,ESTAG=0,ESTRD=0;
  function aplicaEst(){
    var ch=false;
    P.forEach(function(p){
      var d=EST&&EST[p.ref],tinha=!!p.esgRes;
      if(p.esgRes){p.aviso=p._av0||'';p.esgRes=false}
      p.rv=0;
      if(d&&CFG.reserva===true&&p.aviso!=='Esgotado'){
        var agora=Date.now()+ESTRD,cn=(p.cores&&p.cores.length)?p.cores.length:1,qs=Array.isArray(p.qs)&&p.qs.length?p.qs:[+p.est||0],tot=0,livre=0;
        var rs={};Object.keys(d.res||{}).forEach(function(k){var r=d.res[k];if(!r||!(r.pago===true||+r.exp>agora))return;var c=String(r.cor||'').toLowerCase();rs[c]=(rs[c]||0)+(+r.q||0);p.rv+=(+r.q||0)});
        if(p.rv&&qs){for(var i=0;i<qs.length;i++){var nm=String((p.cn&&p.cn[i])||'').toLowerCase();var disp=(+qs[i]||0)-(rs[nm]||0);if(disp>0)livre+=disp}
          if(livre<=0){p._av0=p.aviso;p.aviso='Esgotado';p.esgRes=true}}
      }
      if(tinha!==!!p.esgRes)ch=true});
    if(ch){drawGrid();var pg=document.querySelector('.pgm');if(pg&&pg.getAttribute('data-ref')){}}}
  function syncEstoque(){
    if(CFG.reserva!==true){if(EST){EST=null;aplicaEst()}return Promise.resolve()}
    return fbg('estoque?pageSize=300').then(function(j){var o={};((j&&j.documents)||[]).forEach(function(d){o[d.name.split('/').pop()]=fbd(d)});EST=o;aplicaEst()},function(){})}
  function estLoop(){clearInterval(ESTT);ESTT=0;if(CFG.reserva!==true)return;ESTT=setInterval(function(){if(!document.hidden)syncEstoque()},20000)}
  /* 08/11: site ao vivo — a cada 20 s confere um único campo (config/site.pv, o app troca ao publicar); só se mudou busca os produtos de novo */
  var PV=null,PVT=0,PVN=0;
  /* S374: diagnóstico pedido pelo dono — com o site desligado, a faixa da prévia (painel) e a do administrador dizem quando o catálogo foi lido da nuvem, quantas peças vieram,
     quando foi a última conferência e quando o app mandou a última mudança (config/site.pv). Só texto; não muda nada do funcionamento. */
  var DG={};
  function dgH(t){if(!t)return '—';var d=new Date(t),z=function(n){return (n<10?'0':'')+n};return z(d.getHours())+':'+z(d.getMinutes())+':'+z(d.getSeconds())}
  function dgD(t){if(!t)return 'nunca';var d=new Date(t),z=function(n){return (n<10?'0':'')+n};return z(d.getDate())+'/'+z(d.getMonth()+1)+' '+dgH(t)}
  function dgTxt(){return 'Diagnóstico · catálogo lido '+dgH(DG.lido)+' · '+(DG.n==null?'?':DG.n)+' peças na nuvem · '+P.length+' no site · conferido '+dgH(DG.conf)+' · último envio do app '+dgD(DG.pv)+(DG.err?' · falhou: '+DG.err:'')}
  function dgPoe(){try{[['prvb','prvd'],['admb','admd']].forEach(function(x){var b=document.getElementById(x[0]);if(!b)return;var e=document.getElementById(x[1]);if(!e){e=document.createElement('small');e.id=x[1];e.className='lfdg';b.appendChild(e)}e.textContent=dgTxt()})}catch(_){}}
  function prodVivo(){if(document.hidden)return;
    fbg('config/site').then(function(d){var c=fbd(d)||{},pv=c.pv||0;PVN++;DG.conf=Date.now();DG.pv=pv;DG.err='';dgPoe();
      if(PV===null)PV=+(CFG&&CFG.pv)||0;
      /* sem o sinal do app (versão antiga), confere os produtos a cada minuto */
      if(pv?pv===PV:PVN%3)return;PV=pv;
      return fbg('produtos?pageSize=300').then(function(j){if(!j||!j.documents)return;DG.lido=Date.now();DG.n=j.documents.length;var sj=JSON.stringify(j.documents);if(sj===prodVivo.ult){dgPoe();return}prodVivo.ult=sj;try{localStorage.setItem('lf_pdocs',sj)}catch(_){}syncProds(j.documents);dgPoe()})}).catch(function(){DG.err='a nuvem não respondeu às '+dgH(Date.now());dgPoe()})}
  function prodVivoLiga(){if(PVT)return;PVT=setInterval(prodVivo,20000);document.addEventListener('visibilitychange',function(){if(!document.hidden)prodVivo()})}
  function redraw(){drawGen();drawChips();drawFaces();drawGrid();drawBag();setHero()}
  function syncRun(){
    var pp=fbg('produtos?pageSize=300');pp.catch(function(){});
    fbg('config/site').then(function(d){CFG=Object.assign({ativo:true},fbd(d),{_f:1});try{localStorage.setItem('lf_cfg',JSON.stringify(CFG))}catch(_){}manut();applyCot();setHero()},function(){}).then(function(){
      return pp}).then(function(j){DG.pv=+(CFG&&CFG.pv)||0;if(j&&j.documents){DG.lido=Date.now();DG.n=j.documents.length;try{prodVivo.ult=JSON.stringify(j.documents);localStorage.setItem('lf_pdocs',prodVivo.ult)}catch(_){}syncProds(j.documents)}}).catch(function(){DG.err='os produtos não vieram às '+dgH(Date.now())}).then(function(){dgPoe();var l=document.getElementById('prevld');if(l){if(!P.length&&!PREV){l.innerHTML='<span>'+LFI.tr('Não deu para carregar as peças agora.')+'</span><button type="button" class="btn" onclick="location.reload()">'+LFI.tr('Tentar de novo')+'</button>'}else l.remove()}syncEstoque().then(function(){estLoop();if(prodVivo.ult)favVolta()});prodVivoLiga()})}
  (ADM||(ADM=isAdm())).then(function(a){if(a&&!LF_ADM&&window.parent!==window){LF_ADM=true;document.documentElement.classList.add('adm');redraw()}});
  manut();try{var qv=new URLSearchParams(location.search).get('video');if(qv)setTimeout(function(){var st=$('stage');st.hidden=false;st.setAttribute('data-sig','q');applyVideo(qv)},300)}catch(_){}
  if(!/[?&]nosync/.test(location.search))setTimeout(syncRun,50);
  /* S420 (aprovado 14/11 04:30: modo loja com a temática do site): a cópia do modo loja não sincroniza, mas busca só a temática (evento) do site e veste igual */
  if(/[?&]loja=1/.test(location.search)&&/[?&]nosync/.test(location.search))setTimeout(function(){fbg('config/site').then(function(d){var c=fbd(d)||{};if(!c.evento&&!(CFG&&CFG.evento))return;CFG=Object.assign({ativo:true},CFG,{evento:c.evento||null});try{evAplica()}catch(_){}try{redraw()}catch(_){}},function(){})},400);
  try{if(/[?&]carrinho=/.test(location.search)){var qb=0,qbt=setInterval(function(){if((P&&P.length)||++qb>50){clearInterval(qbt);baseRestore();bag()}},60)}}catch(_){}
  try{if(/[?&]conta=1/.test(location.search)){var qc=0,qct=setInterval(function(){if((P&&P.length)||++qc>50){clearInterval(qct);baseRestore();minhaConta()}},60)}}catch(_){}
  try{var qr=new URLSearchParams(location.search).get('ref');if(qr){var qn=0,qgo=function(){if(find(qr)){clearInterval(qt);baseRestore();product(qr);return 1}if(++qn>50){clearInterval(qt);document.documentElement.classList.remove('bootprod')}},qt=setInterval(qgo,60);qgo()}}catch(_){}
  try{homeDraw()}catch(_){}
  setTimeout(function(){document.documentElement.classList.add('nr')},3500);

  /* idioma e moeda */
  ['theme','lgb','bagbtn'].forEach(function(i){var e=$(i);if(e&&e.dataset.l)e.dataset.l=LFI.tr(e.dataset.l)});
  (function(){var b=$('lgb');if(!b)return;b.firstChild.textContent=LFI.lang==='es'?'ES':'PT';
    function cur(k,d){try{return localStorage.getItem(k)||'auto'}catch(_){return 'auto'}}
    b.addEventListener('click',function(){var L=cur('lf_lang'),C=cur('lf_cur');
      function ch(att,v,txt,on){return '<button type="button" class="chip" '+att+'="'+v+'" aria-pressed="'+on+'">'+txt+'</button>'}
      layer('<div class="modal msg" role="dialog" aria-modal="true" aria-label="Idioma e moeda"><div class="det"><button class="x" data-close aria-label="Fechar">×</button><h2 style="font-size:28px">Idioma e moeda</h2>'+
        '<div class="lgrp"><b>Idioma</b><div>'+ch('data-lg','auto','Automático',L==='auto')+ch('data-lg','pt','Português',L==='pt')+ch('data-lg','es','Español',L==='es')+'</div></div>'+
        '<div class="lgrp"><b>Moeda</b><div>'+ch('data-cu','auto','Automático',C==='auto')+ch('data-cu','BRL','Real (R$)',C==='BRL')+ch('data-cu','PYG','Guarani (Gs.)',C==='PYG')+'</div></div>'+
        '<div class="note">Automático (pelo seu celular): '+(LFI.autoLang==='es'?'Español':'Português')+'. A moeda acompanha o idioma: Português em reais, Español em guaranis. Os valores em reais são aproximados. O valor da loja é em guaranis.</div></div></div>','center')});
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-lg],[data-cu]');if(!t)return;e.stopPropagation();
      try{if(t.hasAttribute('data-lg')){localStorage.setItem('lf_lang',t.getAttribute('data-lg'));localStorage.setItem('lf_cur','auto')}else localStorage.setItem('lf_cur',t.getAttribute('data-cu'));sessionStorage.setItem('lf_skip','1');sessionStorage.setItem('lf_drw','1')}catch(_){}
      var bg=getComputedStyle(document.body).backgroundColor,ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:calc(var(--c-sistema) + 9);background:'+bg+';opacity:0;transition:opacity .28s ease;pointer-events:all';document.body.appendChild(ov);try{sessionStorage.setItem('lf_fade',bg)}catch(_){}requestAnimationFrame(function(){ov.style.opacity='1'});setTimeout(function(){location.reload()},300)},true)})();
  try{var _cd=PREV?null:JSON.parse(localStorage.getItem('lf_pdocs')||'null');if(_cd&&_cd.length)syncProds(_cd)}catch(_){}
  /* 1ª visita (sem cópia guardada): abre com o começo rápido — as mesmas peças e a mesma configuração que a nuvem entrega, deixadas no site pelo robô.
     A nuvem continua sendo conferida logo em seguida (syncRun); se ela já respondeu, o começo rápido não desfaz nada. */
  if(!PREV&&!(_cd&&_cd.length))INI.then(function(ini){if(prodVivo.ult||!ini.docs||!ini.docs.length)return;
    if(!CFG._f&&ini.cfg){var ci=fbd(ini.cfg)||{};delete ci.ativo;CFG=Object.assign({},CFG,ci);applyCot()}
    syncProds(ini.docs)});
  if((PREV||!P.length)&&!/[?&]nosync/.test(location.search)){var _pl=document.createElement('div');_pl.id='prevld';_pl.setAttribute('role','status');_pl.innerHTML='<i></i><span>'+LFI.tr(PREV?'Carregando a vitrine atual…':'Carregando as peças…')+'</span>';document.body.appendChild(_pl)}
  drawGen();drawChips();drawFaces();drawBag();setHero();

  /* ===== 08/11 NAVEGAÇÃO 2 (aprovada: esboços navegacao3/4) =====
     2 busca com sugestões e vistos por último · 3 linha de graus em Leitura · 4 "Você estava vendo" no topo do início
     5 a lista volta exatamente no mesmo cartão · 1 voltar = gesto do próprio celular (saída deslizando, acima) */
  function navGrN(g){return parseFloat(String(g).replace(',','.'))||0}
  function navGraus(){var m={};cat5().forEach(function(p){if(p.tipo!=='grau'||p.aviso==='Esgotado'||!p.gr)return;p.gr.forEach(function(g,i){if(!p.gq||p.gq[i]>0)m[g]=1})});
    return Object.keys(m).sort(function(a,b){return navGrN(a)-navGrN(b)})}
  function navTemGrau(p,g){if(!p.gr)return false;var i=p.gr.indexOf(g);return i>=0&&(!p.gq||p.gq[i]>0)}
  /* vistos por último (até 6) */
  function navVistos(){try{var v=JSON.parse(localStorage.getItem('lf_vistos')||'[]');return Array.isArray(v)?v:[]}catch(_){return []}}
  function navVistoPoe(ref){var v=navVistos().filter(function(r){return r!==ref});v.unshift(ref);try{localStorage.setItem('lf_vistos',JSON.stringify(v.slice(0,6)))}catch(_){}}
  var SRG=[];
  function srVistos(){var L=navVistos().map(find).filter(function(p){return p&&vis5(p)}).slice(0,3);if(!L.length)return '';
    return '<div class="srh">'+LFI.tr('VISTOS POR ÚLTIMO')+'</div><div class="srv">'+L.map(function(p){return '<button type="button" data-open="'+esc(p.ref)+'" aria-label="'+esc(p.nome)+'">'+img5(p)+'</button>'}).join('')+'</div>'}
  
  /* 3: filtro de grau em Leitura */
  st.fgr='';
  var _listaNv=lista;lista=function(){var r=_listaNv.apply(this,arguments);if(st.tipo==='grau'&&st.fgr)r=r.filter(function(p){return navTemGrau(p,st.fgr)});return r};
  function vgrDraw(){var vs=$('vscr');if(!vs)return;if(st.tipo!=='grau')st.fgr='';var el=$('vgr');
    if(!el){el=document.createElement('div');el.id='vgr';el.setAttribute('role','group');el.setAttribute('aria-label',LFI.tr('Grau'));var ms=vs.querySelector('.mobsearch');vs.insertBefore(el,ms?ms.nextSibling:vs.firstChild)}
    var G=st.tipo==='grau'?navGraus():[];if(st.fgr&&G.indexOf(st.fgr)<0)st.fgr='';
    if(G.length<2){el.hidden=true;el._s='';return}el.hidden=false;
    var sig=G.join(',')+'|'+st.fgr;if(el._s===sig)return;el._s=sig;
    el.innerHTML=['Todos'].concat(G).map(function(g,i){var v=i?g:'',on=st.fgr===v;return '<button type="button" data-vgr="'+esc(v)+'"'+(on?' class="on" aria-pressed="true"':' aria-pressed="false"')+'>'+(i?esc(g):LFI.tr('Todos'))+'</button>'}).join('');
    var on=el.querySelector('.on');if(on&&on.offsetLeft>el.clientWidth-40)el.scrollLeft=on.offsetLeft-16}
  var _navTitNv=navTitulo;navTitulo=function(){var r=_navTitNv.apply(this,arguments);try{vgrDraw()}catch(_){}return r};
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vgr]');if(!b)return;e.preventDefault();st.fgr=b.getAttribute('data-vgr');drawGrid();var vs=$('vscr'),g=$('grid');if(vs&&g&&vs.scrollTop>g.offsetTop)vs.scrollTop=0});
  /* 09/11 S54–S64 (aprovados): "Descubra o seu grau" = consulta com o Mochi.
     Celular a 40 cm, sem óculos. Quadro com 9 frases do maior para o menor; o Mochi aponta a frase da frente e, a cada "Consigo ler",
     puxa o quadro para cima. Onde a pessoa trava, ele traz a lente (o quadro todo cresce no tamanho que ela leria com aquele grau) e
     vai subindo a lente até a pessoa ler a bula (última frase); confere uma lente mais fraca, como o médico. A letra do quadro tem tamanho
     fixo: o "Texto grande" do site não mexe nela. O Mochi é vivo: respira, pisca, reage e passeia por zonas livres (nunca em cima do texto
     nem dos botões). Sem desfoque falso; aviso de miopia/astigmatismo/multifocal; não substitui o oftalmologista. */
  (function(){
    var T=function(x){return LFI.tr(x)},ES=LFI.lang==='es',RM=matchMedia('(prefers-reduced-motion: reduce)');
    var Z={el:null,st:null,tm:0,v:null,cv:null,fa:null,d:0,rosto:0,fase:''};
    var gf=function(x){return '+'+(+x).toFixed(2)},gn=function(s){return parseFloat(String(s).replace(',','.'))||0};
    var gfala=function(x){return (ES?'más ':'mais ')+(+x).toFixed(2).replace('.',',')};
    function meu(){try{return localStorage.getItem('lf_meugr')||''}catch(_){return ''}}
    function mudo(){try{return localStorage.getItem('lf_gzmudo')==='1'}catch(_){return false}}
    var SPK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
    var MUT='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M16 9l5 6M21 9l-5 6"/></svg>';
    var BK='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
    var MOCHI=(function(){
/* 09/11 Mochi aprovado (S73–S86): bracinhos em gota que nascem atrás do corpo; nos gestos de rosto o braço passa para a frente
   inteiro, com união suave só na raiz (S82/S83); no "ajusta os óculos" a troca de camada acontece com o braço parado (S86).
   Óculos com hastes, brilho da cabeça corrigido, espelho de testa no centro (A), ponteiro de mãozinha com cabo vinho maior (S58 A + S70).
   Gestos S72/S74 com as animações S83–S85 (ajusta pela haste, tapinha que balança o espelho, limpeza com borrifador e flanela).
   Cada quadro é desenhado por um "esqueleto" (rig) que só troca atributos — nada de redesenhar o SVG inteiro. */
const BEND=(x,y,L,b)=>{if(!b||x<=0)return [x,y];const t=b*Math.PI/180*Math.pow(Math.min(1.2,x/L),1.7),c=Math.cos(t),s=Math.sin(t);return [x*c-y*s,x*s+y*c]};
const BSTR=(d,L,b)=>{if(!b)return d;const n=d.match(/-?\d*\.?\d+/g);let k=0;const o=[];for(let i=0;i+1<n.length;i+=2){const r=BEND(+n[i],+n[i+1],L,b);o.push(r[0].toFixed(2),r[1].toFixed(2))}return d.replace(/-?\d*\.?\d+/g,()=>o[k++])};
const ARMP0=L=>`M0 -10 C${L*.45} -11 ${L-2} -8.5 ${L} -1 C${L+1.5} 5 ${L-4} 9 ${L-9} 8.5 C${L*.45} 8 ${L*.2} 10 0 10 Z`;
const ARMP=(L,b)=>BSTR(ARMP0(L),L,b);
const ARMH=(L,b)=>BSTR(`M${L*.35} -5 Q${L*.62} -6.5 ${L*.8} -3.5`,L,b),ARMHF=(L,b)=>BSTR(`M${L*.42} -5 Q${L*.66} -6.5 ${L*.84} -3.5`,L,b);
const armT=(lado,ang)=>{const sx=lado<0?22:98,rot=lado<0?180-ang:ang;return `translate(${sx} 92) rotate(${rot.toFixed(2)})${lado<0?' scale(1 -1)':''}`};
const dentro=(lado,ang,L)=>{const sx=lado<0?22:98,r=(lado<0?180-ang:ang)*Math.PI/180,x=sx+Math.cos(r)*(L-4),y=92+Math.sin(r)*(L-4);return Math.hypot((x-60)/46,(y-80)/44)};
const tipXY=(lado,ang,L)=>{const sx=lado<0?22:98,r=(lado<0?180-ang:ang)*Math.PI/180;return [sx+Math.cos(r)*(L-5),92+Math.sin(r)*(L-5)]};
const E=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,EO=t=>1-Math.pow(1-t,3),cl=(x,a,b)=>Math.min(b,Math.max(a,x)),win=(t,a,b,f)=>cl(Math.min((t-a)/f,(b-t)/f),0,1);
function tr(k,t){let i=0;while(i<k.length-2&&k[i+1][0]<=t)i++;const a=k[i],b=k[i+1];const u=cl((t-a[0])/(b[0]-a[0]||1),0,1);return a[1]+(b[1]-a[1])*E(u)}
const rnd=k=>{const x=Math.sin(k*127.1+3.7)*43758.5453;return x-Math.floor(x)};
const ARM=(c,front)=>front?`<g class="${c}"><g class="t"><path class="s" transform="translate(2 3)" fill="#c98aab" opacity=".2" filter="url(#lfmsb)"/><path class="p" fill="url(#lfmh)" stroke="#e3b3cc" stroke-width="1.7"/><path class="h" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85"/></g><g clip-path="url(#lfmcc)"><rect x="-60" y="-40" width="260" height="220" fill="url(#lfmbU)" mask="url(#lfmk${c.slice(-1)})"/></g></g>`
 :`<g class="${c}"><path class="p" fill="url(#lfmh)" stroke="#e8c3d6" stroke-width="1.6"/><path class="h" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/></g>`;
const MK=l=>`<linearGradient id="lfmg${l}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="8" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="lfmk${l}" maskUnits="userSpaceOnUse" x="-60" y="-40" width="260" height="220"><g class="mk${l}"><path transform="translate(-1 0) scale(1 1.08)" fill="url(#lfmg${l})"/></g></mask>`;
const LUVA='<rect x="-6" y="-9" width="7" height="18" rx="2.5" fill="#8d3a69"/><rect x="0" y="-8" width="17" height="16" rx="6" fill="#fff" stroke="#8d3a69" stroke-width="1.8"/><rect class="dedo" x="12" y="-7.5" width="20" height="6.5" rx="3.2" fill="#fff" stroke="#8d3a69" stroke-width="1.8"/><ellipse cx="7" cy="-8.5" rx="4.5" ry="3" fill="#fff" stroke="#8d3a69" stroke-width="1.6"/>';
const HASTES='<path d="M32 81 C26 79 21 78 16.5 79" fill="none" stroke="#8d3a69" stroke-width="2.6" stroke-linecap="round"/><path d="M88 81 C94 79 99 78 103.5 79" fill="none" stroke="#8d3a69" stroke-width="2.6" stroke-linecap="round"/><circle cx="32.5" cy="81" r="1.8" fill="#e7a6c7"/><circle cx="87.5" cy="81" r="1.8" fill="#e7a6c7"/>';
var MOCHI_SVG=`<svg viewBox="-6 24 132 110" width="100%" height="100%" fill="none" style="overflow:visible"><defs>
<radialGradient id="lfmb" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fff7fa"/><stop offset=".85" stop-color="#f6dfea"/><stop offset="1" stop-color="#ecc9da"/></radialGradient>
<radialGradient id="lfmbU" gradientUnits="userSpaceOnUse" cx="49" cy="55.8" r="73.6"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fff7fa"/><stop offset=".85" stop-color="#f6dfea"/><stop offset="1" stop-color="#ecc9da"/></radialGradient>
<radialGradient id="lfmh" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f3d6e4"/></radialGradient>
<radialGradient id="lfmsh" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#5a2a46" stop-opacity=".22"/><stop offset="1" stop-color="#5a2a46" stop-opacity="0"/></radialGradient>
<radialGradient id="lfmir" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#e4ecf6"/><stop offset="1" stop-color="#b9c8da"/></radialGradient>
<linearGradient id="lfmlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#e8f0fa" stop-opacity=".04"/></linearGradient>
<radialGradient id="lfmbl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff8fb8" stop-opacity=".75"/><stop offset="1" stop-color="#ff8fb8" stop-opacity="0"/></radialGradient>
<radialGradient id="lfmnv"><stop offset="0" stop-color="#eecfe0" stop-opacity=".95"/><stop offset=".6" stop-color="#f4dde9" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<clipPath id="lfmcc"><path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z"/></clipPath>
<clipPath id="lfmzE"><circle cx="45" cy="83" r="12"/></clipPath><clipPath id="lfmzD"><circle cx="75" cy="83" r="12"/></clipPath>
<filter id="lfmsb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>
<filter id="lfmnb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.3"/></filter>
${MK('e')}${MK('d')}
</defs>
<ellipse class="sombra" cx="60" cy="125" rx="34" ry="5.5" fill="url(#lfmsh)"/>
<g class="sq"><g class="tilt"><g class="pulo"><g class="resp">
 <g class="itB"></g>
 ${ARM('aBe')}${ARM('aBd')}
 <g class="pe1"><ellipse cx="44" cy="120" rx="10" ry="5.5" fill="url(#lfmh)" stroke="#ecc9da" stroke-width="1.2"/></g><g class="pe2"><ellipse cx="76" cy="120" rx="10" ry="5.5" fill="url(#lfmh)" stroke="#ecc9da" stroke-width="1.2"/></g>
 <path class="corpoF" d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z" fill="url(#lfmb)" stroke="#ecc9da" stroke-width="1.4"/><g class="filE"></g><g class="filD"></g>
 <path d="M30 62 C32 50 41 42 54 39" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/>
 <path d="M17 66 Q60 44 103 66" stroke="#8d3a69" stroke-width="4.5" fill="none" stroke-linecap="round"/>
 <g class="esp" style="transform-origin:60px 58px"><g class="espT"><circle cx="60" cy="47" r="12" fill="url(#lfmir)" stroke="#8d3a69" stroke-width="3"/><circle cx="60" cy="47" r="3.2" fill="#8d3a69"/><path d="M53.5 42 q3 -3 7 -3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g></g>
 <g class="olhos"><g class="pis"><g class="pup">
  <ellipse cx="45" cy="83" rx="6.6" ry="7.8" fill="#3a2632"/><ellipse cx="45" cy="86.5" rx="4.6" ry="3" fill="#6b3b58" opacity=".55"/><circle cx="42.6" cy="80" r="2.6" fill="#fff"/><circle cx="47.6" cy="85.6" r="1.1" fill="#fff"/>
  <ellipse cx="75" cy="83" rx="6.6" ry="7.8" fill="#3a2632"/><ellipse cx="75" cy="86.5" rx="4.6" ry="3" fill="#6b3b58" opacity=".55"/><circle cx="72.6" cy="80" r="2.6" fill="#fff"/><circle cx="77.6" cy="85.6" r="1.1" fill="#fff"/>
 </g></g></g>
 <g class="olhosF" opacity="0"><path d="M38 86 q7 -8 14 0 M68 86 q7 -8 14 0" stroke="#3a2632" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
 <g class="olhosZ" opacity="0"><path d="M38 84 q7 6 14 0 M68 84 q7 6 14 0" stroke="#3a2632" stroke-width="3.2" fill="none" stroke-linecap="round"/></g>
 <g class="ocl"><g class="oclT"><g fill="url(#lfmlz)" stroke="#8d3a69" stroke-width="2.6"><circle cx="45" cy="83" r="13"/><circle cx="75" cy="83" r="13"/></g><path d="M58 81 q2 -2.5 4 0" stroke="#8d3a69" stroke-width="2.6" fill="none"/>
 <path d="M36 76 l4 -2.5 M66 76 l4 -2.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><g class="fog"></g>${HASTES}</g></g>
 <ellipse cx="31" cy="101" rx="9" ry="5.5" fill="url(#lfmbl)"/><ellipse cx="89" cy="101" rx="9" ry="5.5" fill="url(#lfmbl)"/>
 <g class="bW"><path d="M54.5 101.5 q2.75 3 5.5 0 q2.75 3 5.5 0" stroke="#8d3a69" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>
 <g class="bO" opacity="0"><ellipse cx="60" cy="103" rx="4" ry="3.4" fill="#8d3a69"/></g>
 <g class="bF" opacity="0"><path d="M53 101 q7 8 14 0 Z" fill="#8d3a69"/><path d="M56 104 q4 3 8 0" fill="#ff8fb8"/></g>
 <g class="bH" opacity="0"><path d="M55 103 q3 -1.6 6 -.4 q2.6 1 4.4 -.6" stroke="#8d3a69" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
 <g class="bY" opacity="0"><ellipse cx="60" cy="104" rx="5" ry="6.2" fill="#8d3a69"/><ellipse cx="60" cy="107" rx="3" ry="2" fill="#ff8fb8"/></g>
 ${ARM('aFe',1)}${ARM('aFd',1)}
 <g class="pon" opacity="0"><g class="ponT"><circle class="mao" cx="25" cy="0" r="6" opacity="0"/><rect x="23" y="-3.2" width="14.7" height="6.4" rx="3" fill="#8d3a69"/><path class="haste" d="M36.7 0 H71" stroke="#8d3a69" stroke-width="3" stroke-linecap="round"/><g class="luva" transform="translate(71 0) scale(.75)">${LUVA}</g></g></g>
 <g class="itF"></g>
</g></g></g></g></svg>`;
var MOCHI_CSS=`
.mochi{position:absolute;left:0;top:0;will-change:transform;z-index:6}
/* S88: corpo, inclinação, espelho e óculos andam pelo mesmo relógio do esqueleto (molas), sem transições CSS em degraus */
.mochi .sq,.mochi .tilt{transform-origin:60px 124px}
.mochi .resp{transform-origin:60px 124px;animation:resp 4s steps(12,end) infinite}
@keyframes resp{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-1.5px) scale(1.008,.992)}}
.mochi .sombra{transform-origin:60px 125px;animation:somb 4s steps(12,end) .15s infinite}
@keyframes somb{0%,100%{transform:scale(1)}50%{transform:scale(.94)}}
.mochi .pup{transition:transform .22s cubic-bezier(.16,1,.3,1)}
.mochi .pis{transform-origin:60px 83px}
.mochi .pis.p{animation:pisca .2s cubic-bezier(.3,0,.3,1)}
@keyframes pisca{35%{transform:scaleY(.08)}}
.mochi .olhos,.mochi .olhosF,.mochi .olhosZ,.mochi .bW,.mochi .bO,.mochi .bF,.mochi .bH,.mochi .bY,.mochi .pon{transition:opacity .22s ease}
@media (prefers-reduced-motion:reduce){.mochi .resp,.mochi .sombra{animation:none}}
`;
function borrifador(sq){return `<rect x="-6" y="-13" width="12" height="19" rx="4" fill="#8d3a69"/><rect x="-6" y="-7.5" width="12" height="7" fill="#f7d6e6"/><path d="M0 -6 q-2 2.4 0 4 q2 -1.6 0 -4z" fill="#d76fa2"/><path d="M-4 -11 v3.5 M-4 1 v3" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".5"/><rect x="-2.4" y="-17" width="4.8" height="4.5" fill="#6e2b51"/><g transform="translate(0 ${sq})"><path d="M-5 -22 h8 a2.2 2.2 0 0 1 2.2 2.2 v2.6 h-12.4 v-2.6 a2.2 2.2 0 0 1 2.2 -2.2z" fill="#e7a6c7"/><rect x="-9.5" y="-21.2" width="5" height="2.6" rx="1.2" fill="#e7a6c7"/><circle cx="-9.4" cy="-19.9" r=".8" fill="#8d3a69"/></g>`}
function flanela(x,y,rot,sc){return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(1)}) scale(${sc})"><path d="M-8 -7 Q0 -9.5 8 -7 Q9.5 0 8 7 Q0 9.5 -8 7 Q-9.5 0 -8 -7Z" fill="#f3bfd6" stroke="#d98fb4" stroke-width="1.2"/><path d="M-5.5 -4.5 Q0 -6 5.5 -4.5 M-5.5 4.5 Q0 6 5.5 4.5" stroke="#fff" stroke-width="1" fill="none" stroke-dasharray="1.6 1.4" opacity=".9"/></g>`}
function estrela(x,y,s,o){return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -5 Q.8 -.8 5 0 Q.8 .8 0 5 Q-.8 .8 -5 0 Q-.8 -.8 0 -5Z" fill="#fff" stroke="#e7a6c7" stroke-width=".7" opacity="${o}"/>`}
const fogL=(cx,id,v,ix,iy)=>v>0?`<g clip-path="url(#${id})"><circle cx="${ix}" cy="${iy}" r="${(26*v).toFixed(2)}" fill="#fff" opacity=".72" filter="url(#lfmnb)"/>${[0,1,2,3,4].map(k=>{const a=k*1.3+cx,rr=3+((k*5)%7);return `<circle cx="${(cx+Math.cos(a)*rr).toFixed(2)}" cy="${(83+Math.sin(a)*rr).toFixed(2)}" r="${(1.2*v).toFixed(2)}" fill="#fff" stroke="#e3bfd2" stroke-width=".5"/>`}).join('')}</g>`:'';
/* ---- gestos (cada um é uma função do tempo, em segundos; s = ângulos de partida) ---- */
const G={
 /* S85/S86: a mão toca a ponta da haste esquerda, empurra 2x, os óculos sobem e assentam; o braço todo passa para a frente parado */
 ajusta:{dur:5,mao:'e',f(t,s){const ae0=s.ae;let ae=tr([[0,ae0],[.8,ae0],[1.7,-62],[3.7,-62],[4.5,ae0],[5,ae0]],t),Le=tr([[0,30],[.8,30],[1.7,21],[3.7,21],[4.5,30],[5,30]],t);
  const w=win(t,1.7,3.7,.35),push=Math.max(0,Math.sin((t-1.7)*Math.PI*1.6));ae+=-7*push*w;const fE=cl((t-.25)/.5,0,1)*cl((5-t)/.45,0,1);
  const lift=cl((t-1.3)/.4,0,1)*cl((3.9-t)/.3,0,1);let gr=2.2*lift+2.6*push*w,gy=-(1*lift+1.6*push*w);const tl=t-3.9;if(tl>0&&tl<1.2){gr+=Math.sin(tl*13)*Math.exp(-tl*4.5)*1.6;gy+=Math.sin(tl*13)*Math.exp(-tl*4.5)*.7}
  return {ae,Le,fE,gr,gy,face:{olha:1}}}},
 /* S84: tapinha no espelho — o espelho balança a cada toque e volta (mola amortecida) */
 tapinha:{dur:3.6,mao:'e',f(t,s){let ae=tr([[0,s.ae],[.8,242],[2.8,242],[3.6,s.ae]],t),Le=tr([[0,30],[.8,33],[2.8,33],[3.6,30]],t),acc=0;
  for(const k of [1.1,1.7,2.3]){const d=t-k;if(d>0)acc+=Math.sin(d*13)*Math.exp(-d*3.2)*13;if(d>-.12&&d<.12)ae+=-9*(1-Math.abs(d)/.12)}return {ae,Le,mr:acc,my:Math.abs(acc)*.05,face:{olha:1}}}},
 /* S84/S85: limpeza — borrifador na mão direita mira cada lente, névoa, embaçado, flanela nas duas mãos, brilho, feliz e pulinho */
 limpa:{dur:11.1,mao:'ed',f(t,s,P){const o={face:{olha:1}};let ad=tr([[0,s.ad],[.8,-20],[1.5,-20],[2.2,-14],[3.1,-14],[3.8,40],[4.8,195],[8,195],[8.8,40],[9.2,40],[9.7,-35],[10.4,-35],[11.1,s.ad]],t);
  let ae=tr([[0,s.ae],[.2,40],[4,40],[4.8,195],[8,195],[8.8,40],[11.1,s.ae]],t);const PUFF=[[1.55,75,83],[2.85,45,83]],L=30;let itB='',itF='',sq=0,flinch=0;
  const sb=win(t,.3,4,.4);
  for(const [p] of PUFF){const d=t-p;if(d>-.3&&d<0)ad+=5*Math.sin((d+.3)/.3*Math.PI/2);if(d>=0&&d<.5)ad+=5*Math.cos(d/.5*Math.PI/2)*(1-d/.5)-3*Math.sin(d/.5*Math.PI)*.6;
   if(d>-.12&&d<.22)sq=Math.max(sq,2.2*(d<0?(d+.12)/.12:1-d/.22));if(d>.12&&d<.5){o.face={pisca:1};flinch=Math.sin((d-.12)/.38*Math.PI)*-2.5}}
  const [hx,hy]=tipXY(1,ad,L),alvo=t<2.2?PUFF[0]:PUFF[1];let aim=Math.atan2(alvo[2]-(hy-10),alvo[1]-hx)*180/Math.PI,rot=cl((aim-180+360)%360-360,-40,40);if(rot<-180)rot+=360;rot*=cl((t-.6)/.5,0,1);
  if(sb>0){const sc=(.3+.7*EO(sb)).toFixed(3);itB+=`<g transform="translate(${hx.toFixed(2)} ${(hy-9).toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${sc})" opacity="${sb.toFixed(3)}">${borrifador(sq)}</g>`;
   const rr=rot*Math.PI/180,bx=-9.8,by=-19.9,nx=hx+bx*Math.cos(rr)-by*Math.sin(rr),ny=hy-9+bx*Math.sin(rr)+by*Math.cos(rr);
   for(const [p,tx,ty] of PUFF){const d=t-p;if(d>0&&d<.75){const q=d/.75,ang=Math.atan2(ty-ny,tx-nx),dist=Math.hypot(tx-nx,ty-ny),len=dist*EO(Math.min(1,q*1.6)),wd=3+q*9,cx=nx+Math.cos(ang)*len*.55,cy=ny+Math.sin(ang)*len*.55;
     itF+=`<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${(len*.55+2).toFixed(2)}" ry="${wd.toFixed(2)}" transform="rotate(${(ang*180/Math.PI).toFixed(1)} ${cx.toFixed(2)} ${cy.toFixed(2)})" fill="url(#lfmnv)" opacity="${(.8*(1-q)).toFixed(3)}" filter="url(#lfmnb)"/>`;
     for(let k=0;k<(P.leve?10:22);k++){const r1=rnd(k+p*10),r2=rnd(k*3+p),qq=cl((d-r1*.12)/.5,0,1);if(qq<=0)continue;const a2=ang+(r2-.5)*.55,dd=dist*(.75+r1*.35)*EO(qq);
      itF+=`<circle cx="${(nx+Math.cos(a2)*dd).toFixed(2)}" cy="${(ny+Math.sin(a2)*dd).toFixed(2)}" r="${(.5+r2*1.1).toFixed(2)}" fill="#fdf3f8" stroke="#d6a0bd" stroke-width=".45" opacity="${((1-qq)*.95).toFixed(3)}"/>`}}}}
  const lim=cl((t-5)/2.8,0,1);o.fogD=EO(cl((t-PUFF[0][0]-.2)/.45,0,1))*(1-lim);o.fogE=EO(cl((t-PUFF[1][0]-.2)/.45,0,1))*(1-lim);
  const fl=win(t,3.9,9,.35),fr=win(t,4.1,9,.35),wig=t>5&&t<8?1:0;if(wig){ae+=Math.sin(t*10)*7;ad+=Math.sin(t*10+Math.PI)*7}
  const [lx,ly]=tipXY(-1,ae,L),[rx,ry]=tipXY(1,ad,L);if(fl>0)itF+=flanela(lx+1,ly-1,-15+Math.sin(t*10)*8*wig,(.4+.6*E(fl)).toFixed(3));if(fr>0)itF+=flanela(rx-1,ry-1,15-Math.sin(t*10)*8*wig,(.4+.6*E(fr)).toFixed(3));
  const sp=win(t,8.1,10.2,.25);if(t>8)o.face={feliz:1};if(sp>0)itF+=[[52,73,1.5],[82,74,1.2],[38,91,.9]].map(([x,y,k],i)=>estrela(x,y,(k*(.6+.4*Math.sin(t*9+i*2))*E(sp)).toFixed(3),sp.toFixed(2))).join('');
  if(t>9&&t<10.2){const d=t-9;o.hop=Math.max(0,Math.sin(d*Math.PI/.55))*6*(d<1.1?1:0)}
  return Object.assign(o,{ae,ad,itB,itF,tilt:flinch})}},
 /* S72/S74 */
 pensando:{dur:2.2,mao:'e',f(t,s){const ae=tr([[0,s.ae],[.6,162],[1.6,162],[2.2,s.ae]],t)+Math.sin(t*3)*4*win(t,.6,1.6,.3);return {ae,Le:tr([[0,30],[.6,26],[1.6,26],[2.2,30]],t),face:{hmm:1},tilt:-6*win(t,.3,1.9,.3)}}},
 joinha:{dur:1.5,mao:'e',f(t,s){return {ae:tr([[0,s.ae],[.4,-60],[1.1,-60],[1.5,s.ae]],t),face:{feliz:1}}}},
 palminha:{dur:2.4,mao:'ed',f(t,s){const w=win(t,.7,1.7,.2),c=Math.abs(Math.sin((t-.7)*7))*w;return {ae:tr([[0,s.ae],[.7,165],[1.7,165],[2.4,s.ae]],t)-14*c,ad:tr([[0,s.ad],[.7,165],[1.7,165],[2.4,s.ad]],t)-14*c,Le:28,Ld:28,face:{feliz:1}}}},
 bocejo:{dur:2.4,mao:'e',f(t,s){const w=win(t,.4,2,.3);return {ae:tr([[0,s.ae],[.7,168],[1.7,168],[2.4,s.ae]],t),face:w>.5?{boc:1}:{},sy:1+.04*w,sx:1-.02*w}}},
 espreguica:{dur:2.4,mao:'ed',f(t,s){const w=win(t,.5,1.8,.4);return {ae:tr([[0,s.ae],[.7,-70],[1.6,-70],[2.4,s.ae]],t),ad:tr([[0,s.ad],[.7,-70],[1.6,-70],[2.4,s.ad]],t),Le:tr([[0,30],[.7,32],[1.6,32],[2.4,30]],t),Ld:tr([[0,30],[.7,32],[1.6,32],[2.4,30]],t),face:w>.4?{pisca:1}:{},sy:1+.06*w,sx:1-.03*w}}},
 danca:{dur:2.4,mao:'ed',f(t,s){const w=win(t,0,2.4,.4),k=Math.sin(t*7);return {ae:s.ae-28*k*w,ad:s.ad+28*k*w,tilt:9*k*w,face:{feliz:1},hop:Math.abs(Math.sin(t*7))*3*w}}},
 pulinho:{dur:1.1,f(t){const h=Math.max(0,Math.sin(cl((t-.15)/.6,0,1)*Math.PI))*9;const sq=t<.15?-.08*(t/.15):h>0?.04:-.06*cl((1.1-t)/.35,0,1)*cl((t-.75)/.1,0,1);return {hop:h,sx:1-sq,sy:1+sq,face:{feliz:1}}}},
 pezinhos:{dur:1.8,f(t){const w=win(t,0,1.8,.3);return {pe:Math.sin(t*9)*2.4*w}}},
 respira:{dur:2.2,f(t){const k=Math.sin(cl(t/2.2,0,1)*Math.PI);return {sx:1+.035*k,sy:1+.03*k,face:k>.6?{pisca:1}:{}}}},
 tchau:{dur:1.8,mao:'d',f(t,s){const w=win(t,.3,1.4,.25);return {ad:tr([[0,s.ad],[.35,-48],[1.4,-48],[1.8,s.ad]],t)+Math.sin(t*12)*18*w,face:{feliz:1}}}},
 estoura:{dur:.95,f(t){const u=cl((t-.05)/.7,0,1),c1=1.70158,EB=x=>1+(c1+1)*Math.pow(x-1,3)+c1*Math.pow(x-1,2);return {sc:t<.05?0.001:Math.max(.001,EB(u)),rot:(-25+25*EO(u))+Math.sin(u*Math.PI)*8,face:{feliz:1}}}},
 tiraOculos:{dur:1.75,mao:'e',f(t,s){const oc=win(t,.42,1.28,.18);return {ae:tr([[0,s.ae],[.45,-154],[1.25,-154],[1.75,s.ae]],t),oy:-26*E(oc),oo:1-.85*E(oc),orr:-8*E(oc),face:oc>.5?{olha:1}:{}}}},
 puxa:{dur:.6,mao:'d',f(t,s){const u=cl(t/.6,0,1);return {ad:s.ad+14*Math.sin(Math.min(1,u*2.2)*Math.PI)*(1-u*.4),tilt:-6*Math.sin(u*Math.PI),sx:1+.04*Math.sin(u*Math.PI),sy:1-.04*Math.sin(u*Math.PI)}}},
 comemora:{dur:1.8,mao:'ed',f(t,s){const w=win(t,.3,1.5,.25),h=Math.abs(Math.sin(t*5.5))*8*w;return {ae:tr([[0,s.ae],[.3,-40],[1.5,-40],[1.8,s.ae]],t)+Math.sin(t*11)*8*w,ad:tr([[0,s.ad],[.3,-40],[1.5,-40],[1.8,s.ad]],t)-Math.sin(t*11)*8*w,hop:h,face:{feliz:1}}}}
};
var TEMA_M={"natal": {"corte": "M-40 62 L10 62 Q60 50 110 62 L160 62 L160 200 L-40 200 Z", "tr": "", "fr": "<defs><linearGradient id=\"lftnr\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e2203d\"/><stop offset=\"1\" stop-color=\"#a50d27\"/></linearGradient></defs>\n<path d=\"M17 60 C17 38 28 20 48 14 C64 9 82 11 94 18 C104 24 112 32 116 42 L109 44 C106 38 101 33 95 30 C99 38 102 48 103 60 Z\" fill=\"url(#lftnr)\"/>\n<path d=\"M95 30 C101 33 106 38 109 44 L116 42 C113 35 108 29 101 24 Z\" fill=\"#9e0c24\" opacity=\".5\"/>\n<path d=\"M30 25 C38 19 48 16 58 15\" stroke=\"#fff\" stroke-width=\"2.2\" opacity=\".35\" fill=\"none\" stroke-linecap=\"round\"/>\n<path d=\"M14 63 Q60 49 106 63\" stroke=\"#f2ecf0\" stroke-width=\"12\" fill=\"none\" stroke-linecap=\"round\"/>\n<path d=\"M14 58.5 Q60 44.5 106 58.5\" stroke=\"#fff\" stroke-width=\"2\" fill=\"none\" opacity=\".9\" stroke-linecap=\"round\"/>\n<circle cx=\"116\" cy=\"46\" r=\"6.8\" fill=\"#fff\" stroke=\"#e6dbe2\" stroke-width=\"1\"/>", "ocl": "<circle cx=\"45\" cy=\"83\" r=\"9.4\" fill=\"url(#lfmlz)\"/><circle cx=\"75\" cy=\"83\" r=\"9.4\" fill=\"url(#lfmlz)\"/><circle cx=\"45\" cy=\"83\" r=\"10.4\" fill=\"none\" stroke=\"#1f6e43\" stroke-width=\"2.1\"/><ellipse cx=\"55.40\" cy=\"83.00\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(90 55.40 83.00)\" fill=\"#3aa76d\"/><ellipse cx=\"54.37\" cy=\"87.51\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(116 54.37 87.51)\" fill=\"#2e8b57\"/><ellipse cx=\"51.48\" cy=\"91.13\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(141 51.48 91.13)\" fill=\"#3aa76d\"/><ellipse cx=\"47.31\" cy=\"93.14\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(167 47.31 93.14)\" fill=\"#2e8b57\"/><ellipse cx=\"42.69\" cy=\"93.14\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(193 42.69 93.14)\" fill=\"#3aa76d\"/><ellipse cx=\"38.52\" cy=\"91.13\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(219 38.52 91.13)\" fill=\"#2e8b57\"/><ellipse cx=\"35.63\" cy=\"87.51\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(244 35.63 87.51)\" fill=\"#3aa76d\"/><ellipse cx=\"34.60\" cy=\"83.00\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(270 34.60 83.00)\" fill=\"#2e8b57\"/><ellipse cx=\"35.63\" cy=\"78.49\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(296 35.63 78.49)\" fill=\"#3aa76d\"/><ellipse cx=\"38.52\" cy=\"74.87\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(321 38.52 74.87)\" fill=\"#2e8b57\"/><ellipse cx=\"42.69\" cy=\"72.86\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(347 42.69 72.86)\" fill=\"#3aa76d\"/><ellipse cx=\"47.31\" cy=\"72.86\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(373 47.31 72.86)\" fill=\"#2e8b57\"/><ellipse cx=\"51.48\" cy=\"74.87\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(399 51.48 74.87)\" fill=\"#3aa76d\"/><ellipse cx=\"54.37\" cy=\"78.49\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(424 54.37 78.49)\" fill=\"#2e8b57\"/><circle cx=\"37.33\" cy=\"75.98\" r=\"1.4\" fill=\"#e2203d\"/><circle cx=\"51.46\" cy=\"74.85\" r=\"1.4\" fill=\"#e2203d\"/><circle cx=\"52.95\" cy=\"89.70\" r=\"1.4\" fill=\"#e2203d\"/><circle cx=\"38.88\" cy=\"91.41\" r=\"1.4\" fill=\"#e2203d\"/><circle cx=\"75\" cy=\"83\" r=\"10.4\" fill=\"none\" stroke=\"#1f6e43\" stroke-width=\"2.1\"/><ellipse cx=\"85.40\" cy=\"83.00\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(90 85.40 83.00)\" fill=\"#3aa76d\"/><ellipse cx=\"84.37\" cy=\"87.51\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(116 84.37 87.51)\" fill=\"#2e8b57\"/><ellipse cx=\"81.48\" cy=\"91.13\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(141 81.48 91.13)\" fill=\"#3aa76d\"/><ellipse cx=\"77.31\" cy=\"93.14\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(167 77.31 93.14)\" fill=\"#2e8b57\"/><ellipse cx=\"72.69\" cy=\"93.14\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(193 72.69 93.14)\" fill=\"#3aa76d\"/><ellipse cx=\"68.52\" cy=\"91.13\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(219 68.52 91.13)\" fill=\"#2e8b57\"/><ellipse cx=\"65.63\" cy=\"87.51\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(244 65.63 87.51)\" fill=\"#3aa76d\"/><ellipse cx=\"64.60\" cy=\"83.00\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(270 64.60 83.00)\" fill=\"#2e8b57\"/><ellipse cx=\"65.63\" cy=\"78.49\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(296 65.63 78.49)\" fill=\"#3aa76d\"/><ellipse cx=\"68.52\" cy=\"74.87\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(321 68.52 74.87)\" fill=\"#2e8b57\"/><ellipse cx=\"72.69\" cy=\"72.86\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(347 72.69 72.86)\" fill=\"#3aa76d\"/><ellipse cx=\"77.31\" cy=\"72.86\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(373 77.31 72.86)\" fill=\"#2e8b57\"/><ellipse cx=\"81.48\" cy=\"74.87\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(399 81.48 74.87)\" fill=\"#3aa76d\"/><ellipse cx=\"84.37\" cy=\"78.49\" rx=\"2.6\" ry=\"1.5\" transform=\"rotate(424 84.37 78.49)\" fill=\"#2e8b57\"/><circle cx=\"67.33\" cy=\"75.98\" r=\"1.4\" fill=\"#e2203d\"/><circle cx=\"81.46\" cy=\"74.85\" r=\"1.4\" fill=\"#e2203d\"/><circle cx=\"82.95\" cy=\"89.70\" r=\"1.4\" fill=\"#e2203d\"/><circle cx=\"68.88\" cy=\"91.41\" r=\"1.4\" fill=\"#e2203d\"/><path d=\"M55.4 81.5 Q60 77 64.6 81.5\" stroke=\"#1f6e43\" stroke-width=\"2.3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M34.6 81 C26 79 21 78 16.5 79\" fill=\"none\" stroke=\"#1f6e43\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M85.4 81 C94 79 99 78 103.5 79\" fill=\"none\" stroke=\"#1f6e43\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><g transform=\"translate(60 76.8)\"><path d=\"M0 0 C-4 -3.5 -7.5 -2 -6.5 1 C-5.5 3.5 -3 2 0 0 C3 2 5.5 3.5 6.5 1 C7.5 -2 4 -3.5 0 0Z\" fill=\"#e2203d\"/><path d=\"M0 0 l-2.5 5 M0 0 l2.5 5\" stroke=\"#e2203d\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><circle r=\"1.6\" fill=\"#b30f2b\"/></g><path d=\"M38 77 l3.2 -2 M68 77 l3.2 -2\" stroke=\"#fff\" stroke-width=\"1.7\" stroke-linecap=\"round\"/>", "fundo": "<g fill=\"#9fb8d6\"><text x=\"-6\" y=\"72\" font-size=\"9\">❄</text><text x=\"114\" y=\"36\" font-size=\"7\">❄</text><text x=\"112\" y=\"104\" font-size=\"8\">❄</text></g>"}, "halloween": {"corte": "M-40 54.6 L160 54.6 L160 200 L-40 200 Z", "tr": "<ellipse cx=\"60\" cy=\"54\" rx=\"80\" ry=\"11.5\" fill=\"#2b1636\"/><ellipse cx=\"60\" cy=\"53.5\" rx=\"71\" ry=\"8.5\" fill=\"#3a2149\"/>", "fr": "<path d=\"M-20 54 A80 11.5 0 0 0 140 54 Z\" fill=\"#2b1636\"/><path d=\"M-11 54.6 A71 8.5 0 0 0 131 54.6\" stroke=\"#4a2a5e\" stroke-width=\"1\" fill=\"none\" opacity=\".7\"/>\n<path d=\"M19 55 C25 38 34 18 44 4 C50 -5 58 -13 68 -17 C74 -19 80 -18 83 -14 C76 -15 71 -11 70 -5 C78 10 93 36 101 55 Q60 62 19 55 Z\" fill=\"#3a1f4a\"/>\n<path d=\"M38 18 C41 12 45 7 50 2\" stroke=\"#fff\" stroke-width=\"1.8\" opacity=\".2\" fill=\"none\" stroke-linecap=\"round\"/>\n<path d=\"M19 55 Q60 62 101 55 L98 48 Q60 55 22 48 Z\" fill=\"#f08a24\"/><rect x=\"54.5\" y=\"48.5\" width=\"11\" height=\"10\" rx=\"1.8\" fill=\"none\" stroke=\"#ffd166\" stroke-width=\"2\"/>", "ocl": "<circle cx=\"45\" cy=\"83\" r=\"9.4\" fill=\"url(#lfmlz)\"/><circle cx=\"75\" cy=\"83\" r=\"9.4\" fill=\"url(#lfmlz)\"/><g transform=\"translate(45 83) scale(0.78) translate(-45 -83)\"><path d=\"M45 70.5 C39 69 33 71 31.5 77 C30 83 31 90 36 94.5 C40 97.5 50 97.5 54 94.5 C59 90 60 83 58.5 77 C57 71 51 69 45 70.5Z\" fill=\"none\" stroke=\"#f08a24\" stroke-width=\"3.6\"/><path d=\"M39.5 71 Q37 83 39.5 96.5 M50.5 71 Q53 83 50.5 96.5\" stroke=\"#d9711a\" stroke-width=\"1.4\" fill=\"none\" opacity=\".55\"/><path d=\"M45 70.5 q-.5 -1.8 1.6 -3\" stroke=\"#3f7d3a\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M46.4 68.2 q3.2 -1 4 1.2 q-2.4 .8 -4 -1.2z\" fill=\"#4f9a48\"/></g><g transform=\"translate(75 83) scale(0.78) translate(-75 -83)\"><path d=\"M75 70.5 C69 69 63 71 61.5 77 C60 83 61 90 66 94.5 C70 97.5 80 97.5 84 94.5 C89 90 90 83 88.5 77 C87 71 81 69 75 70.5Z\" fill=\"none\" stroke=\"#f08a24\" stroke-width=\"3.6\"/><path d=\"M69.5 71 Q67 83 69.5 96.5 M80.5 71 Q83 83 80.5 96.5\" stroke=\"#d9711a\" stroke-width=\"1.4\" fill=\"none\" opacity=\".55\"/><path d=\"M75 70.5 q-.5 -1.8 1.6 -3\" stroke=\"#3f7d3a\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M76.4 68.2 q3.2 -1 4 1.2 q-2.4 .8 -4 -1.2z\" fill=\"#4f9a48\"/></g><path d=\"M56.4 81.5 Q60 77 63.6 81.5\" stroke=\"#f08a24\" stroke-width=\"2.6\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M33.8 81 C26 79 21 78 16.5 79\" fill=\"none\" stroke=\"#3a1f4a\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M86.2 81 C94 79 99 78 103.5 79\" fill=\"none\" stroke=\"#3a1f4a\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path transform=\"translate(60 78.4) scale(.85)\" d=\"M-7 0 q2.5 -4 5 -1.2 q1 -2.4 2 -2.4 q1 0 2 2.4 q2.5 -2.8 5 1.2 q-3.5 0 -7 2 q-3.5 -2 -7 -2z\" fill=\"#3a1f4a\"/><path d=\"M38 77 l3.2 -2 M68 77 l3.2 -2\" stroke=\"#fff\" stroke-width=\"1.7\" stroke-linecap=\"round\"/>", "fundo": "<g fill=\"#3a1f4a\"><path d=\"M-8 74 q4 -6 8 0 q2 -3 4 0 q4 -6 8 0 q-4 2 -10 2 q-6 0 -10 -2z\"/><path d=\"M110 86 q3 -5 6 0 q1.5 -2 3 0 q3 -5 6 0 q-3 1.5 -7.5 1.5 q-4.5 0 -7.5 -1.5z\"/></g>"}, "bf": {"corte": "M-40 56.5 L160 56.5 L160 200 L-40 200 Z", "tr": "<ellipse cx=\"60\" cy=\"55.5\" rx=\"78\" ry=\"11\" fill=\"#0b0b0b\"/><ellipse cx=\"60\" cy=\"55\" rx=\"69\" ry=\"8\" fill=\"#1a1a1a\"/>", "fr": "<defs><linearGradient id=\"lftbk\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#0d0d0d\"/><stop offset=\".32\" stop-color=\"#2c2c2c\"/><stop offset=\".6\" stop-color=\"#121212\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient><linearGradient id=\"lftgo\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#c3922a\"/><stop offset=\".5\" stop-color=\"#f6dc8c\"/><stop offset=\"1\" stop-color=\"#c3922a\"/></linearGradient></defs><g transform=\"translate(0 -1.5)\">\n</g><path d=\"M-18 55.5 A78 11 0 0 0 138 55.5 Z\" fill=\"#0b0b0b\"/><path d=\"M-9 56.1 A69 8 0 0 0 129 56.1\" stroke=\"#2a2a2a\" stroke-width=\"1\" fill=\"none\"/><g transform=\"translate(0 -1.5)\">\n<path d=\"M18 58 L21 9 Q60 3 99 9 L102 58 Q60 65 18 58 Z\" fill=\"url(#lftbk)\"/><ellipse cx=\"60\" cy=\"8.6\" rx=\"39\" ry=\"5\" fill=\"#1d1d1d\" stroke=\"#3a3a3a\" stroke-width=\".8\"/>\n<text x=\"60\" y=\"26\" text-anchor=\"middle\" font-family=\"Inter,Arial\" font-weight=\"900\" font-size=\"11.5\" letter-spacing=\".4\" fill=\"url(#lftgo)\">BLACK</text>\n<text x=\"60\" y=\"39\" text-anchor=\"middle\" font-family=\"Inter,Arial\" font-weight=\"900\" font-size=\"11.5\" letter-spacing=\".4\" fill=\"url(#lftgo)\">FRIDAY</text>\n<path d=\"M19 45 Q60 52 101 45 L102 57.4 Q60 64.4 18 57.4 Z\" fill=\"url(#lftgo)\"/>\n<text x=\"60\" y=\"57\" text-anchor=\"middle\" font-family=\"Georgia,serif\" font-weight=\"700\" font-size=\"9\" fill=\"#141414\">La Fouch</text></g>", "ocl": "<circle cx=\"45\" cy=\"83\" r=\"9.4\" fill=\"url(#lfmlz)\"/><circle cx=\"75\" cy=\"83\" r=\"9.4\" fill=\"url(#lfmlz)\"/><polygon points=\"55.16,87.21 49.21,93.16 40.79,93.16 34.84,87.21 34.84,78.79 40.79,72.84 49.21,72.84 55.16,78.79\" fill=\"none\" stroke=\"#111\" stroke-width=\"3\" stroke-linejoin=\"round\"/><polygon points=\"53.59,86.56 48.56,91.59 41.44,91.59 36.41,86.56 36.41,79.44 41.44,74.41 48.56,74.41 53.59,79.44\" fill=\"none\" stroke=\"#e6b84c\" stroke-width=\".85\"/><polygon points=\"85.16,87.21 79.21,93.16 70.79,93.16 64.84,87.21 64.84,78.79 70.79,72.84 79.21,72.84 85.16,78.79\" fill=\"none\" stroke=\"#111\" stroke-width=\"3\" stroke-linejoin=\"round\"/><polygon points=\"83.59,86.56 78.56,91.59 71.44,91.59 66.41,86.56 66.41,79.44 71.44,74.41 78.56,74.41 83.59,79.44\" fill=\"none\" stroke=\"#e6b84c\" stroke-width=\".85\"/><path d=\"M55.2 81.5 Q60 77 64.8 81.5\" stroke=\"#111\" stroke-width=\"2.8\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M34.4 81 C26 79 21 78 16.5 79\" fill=\"none\" stroke=\"#111\" stroke-width=\"2.8\" stroke-linecap=\"round\"/><path d=\"M85.6 81 C94 79 99 78 103.5 79\" fill=\"none\" stroke=\"#111\" stroke-width=\"2.8\" stroke-linecap=\"round\"/><circle cx=\"34.2\" cy=\"80.6\" r=\"1.4\" fill=\"#e6b84c\"/><circle cx=\"85.8\" cy=\"80.6\" r=\"1.4\" fill=\"#e6b84c\"/><g transform=\"translate(60 79.6)\"><path d=\"M0 0 L0 3.4\" stroke=\"#e6b84c\" stroke-width=\".8\"/><path d=\"M-3 3.4 L3 3.4 L3 9.6 L0 11.5 L-3 9.6Z\" fill=\"#e6b84c\"/><text x=\"0\" y=\"9.3\" text-anchor=\"middle\" font-size=\"5\" font-weight=\"900\" font-family=\"Inter,Arial\" fill=\"#111\">%</text></g><path d=\"M38 77 l3.2 -2 M68 77 l3.2 -2\" stroke=\"#fff\" stroke-width=\"1.7\" stroke-linecap=\"round\"/>", "fundo": ""}, "anonovo": {"corte": "M-40 58.5 L10 58.5 Q60 46.5 110 58.5 L160 58.5 L160 200 L-40 200 Z", "tr": "", "fr": "<defs><linearGradient id=\"lftgo\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#c3922a\"/><stop offset=\".5\" stop-color=\"#f6dc8c\"/><stop offset=\"1\" stop-color=\"#c3922a\"/></linearGradient><radialGradient id=\"lftgg\" cx=\"40%\" cy=\"30%\" r=\"80%\"><stop offset=\"0\" stop-color=\"#fbe7a8\"/><stop offset=\".6\" stop-color=\"#e6b84c\"/><stop offset=\"1\" stop-color=\"#b8892a\"/></radialGradient>\n<pattern id=\"lftlj\" width=\"5\" height=\"5\" patternUnits=\"userSpaceOnUse\"><circle cx=\"2.5\" cy=\"2.5\" r=\"1.05\" fill=\"#fff6d8\" opacity=\".55\"/></pattern></defs>\n<path d=\"M17 57 C17 33 33 20 60 20 C87 20 103 33 103 57 Z\" fill=\"url(#lftgg)\"/><path d=\"M17 57 C17 33 33 20 60 20 C87 20 103 33 103 57 Z\" fill=\"url(#lftlj)\"/>\n<path d=\"M15 59.5 Q60 46 105 59.5\" stroke=\"url(#lftgo)\" stroke-width=\"10\" fill=\"none\" stroke-linecap=\"round\"/>\n<path d=\"M17 58.5 Q60 45 103 58.5\" stroke=\"#fff6d8\" stroke-width=\"1\" fill=\"none\" opacity=\".7\" stroke-dasharray=\"2 3\"/>\n<g fill=\"#f6dc8c\" stroke=\"#c3922a\" stroke-width=\".7\"><circle cx=\"60\" cy=\"18\" r=\"5.4\"/><circle cx=\"55\" cy=\"15.2\" r=\"3.5\"/><circle cx=\"65\" cy=\"15.2\" r=\"3.5\"/><circle cx=\"60\" cy=\"11.8\" r=\"3.5\"/></g>", "ocl": "<defs><linearGradient id=\"lftgo2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f6dc8c\"/><stop offset=\".5\" stop-color=\"#d9a93a\"/><stop offset=\"1\" stop-color=\"#f3d27a\"/></linearGradient></defs><polygon points=\"45.00,68.60 50.76,73.67 57.36,77.58 54.32,84.63 52.64,92.12 45.00,91.40 37.36,92.12 35.68,84.63 32.64,77.58 39.24,73.67\" fill=\"url(#lfmlz)\" stroke=\"url(#lftgo2)\" stroke-width=\"2.3\" stroke-linejoin=\"round\"/><polygon points=\"75.00,68.60 80.76,73.67 87.36,77.58 84.32,84.63 82.64,92.12 75.00,91.40 67.36,92.12 65.68,84.63 62.64,77.58 69.24,73.67\" fill=\"url(#lfmlz)\" stroke=\"url(#lftgo2)\" stroke-width=\"2.3\" stroke-linejoin=\"round\"/><path d=\"M57.36 77.58 Q60 74.38 62.64 77.58\" stroke=\"#d9a93a\" stroke-width=\"2.3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M32.64 77.58 C26 76.08 21 78 16.5 79\" fill=\"none\" stroke=\"#d9a93a\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M87.36 77.58 C94 76.08 99 78 103.5 79\" fill=\"none\" stroke=\"#d9a93a\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M60 71.18 l.8 -2.4 .8 2.4 2.4 .8 -2.4 .8 -.8 2.4 -.8 -2.4 -2.4 -.8z\" fill=\"#f6dc8c\"/><path d=\"M38 76.1 l.9 -2.7 .9 2.7 2.7 .9 -2.7 .9 -.9 2.7 -.9 -2.7 -2.7 -.9z\" fill=\"#fff\"/>", "fundo": "<g fill=\"#e6b84c\"><path d=\"M-2 66 l2 -6 2 6 6 2 -6 2 -2 6 -2 -6 -6 -2z\"/><path d=\"M114 44 l1.5 -4.5 1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5z\"/><path d=\"M110 100 l1.2 -3.6 1.2 3.6 3.6 1.2 -3.6 1.2 -1.2 3.6 -1.2 -3.6 -3.6 -1.2z\"/></g>"}};
/* 11/11 versão MP (aprovada): Dia das Mães (chapéu com rosa + óculos gatinho rosé nude) e Dia dos Pais (fedora 10% mais baixo + clubmaster) */
/* 21/11 (internet fraca, parte 2): as roupas de Dia das Mães e Dia dos Pais (82 KB, um décimo do programa) saíram para js/lf-mochi-datas.js
   e só descem quando o evento do site é um deles. Enquanto a roupa do evento ativo não chegou, o Mochi "ainda não está pronto"
   (window.__lfMochiSvg vale undefined e quem desenha tenta de novo, como já fazia) — ele nunca aparece sem a roupa do evento. */
const TEMA_ARQ={maes:1,pais:1};
function temaEv(){return (document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'')}
function temaPede(){if(temaPede.p)return;temaPede.p=1;const sc=document.createElement('script');sc.src='/loja/js/lf-mochi-datas.js?v='+(window.LF_BUILD||'');sc.onload=function(){Object.assign(TEMA_M,window.__lfTemaMais||{})};sc.onerror=function(){TEMA_ARQ.maes=TEMA_ARQ.pais=0};document.head.appendChild(sc)}
/* S107: o Mochi se veste para o evento ativo do site (html[data-ev]): chapéu + óculos do tema. Com chapéu, saem o espelho e a faixa, e a cabeça
   embaixo do chapéu não é desenhada (assim nenhum pixel dela aparece). Os acessórios ficam dentro do corpo e seguem todos os movimentos. */
function temaSvg(s){const ev=temaEv(),t=TEMA_M[ev];if(!t)return s;
 const CORPO='<path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z" fill="url(#lfmb)"';
 s=s.replace('</defs>','<clipPath id="lftcc"><path d="'+t.corte+'"/></clipPath></defs>'+(t.fundo?'<g class="lftf">'+t.fundo+'</g>':''));
 s=s.replace(CORPO,CORPO.replace('<path ','<path clip-path="url(#lftcc)" '));
 s=s.replace('<path d="M30 62 C32 50 41 42 54 39"','<path clip-path="url(#lftcc)" d="M30 62 C32 50 41 42 54 39"');
 s=s.replace('<path d="M17 66 Q60 44 103 66"','<path display="none" d="M17 66 Q60 44 103 66"').replace('<g class="esp"','<g class="esp" display="none"');
 s=s.replace('<g class="itB"></g>','<g class="itB"></g>'+t.tr);
 const a=s.indexOf('<g class="oclT">')+16,f=s.indexOf('<g class="fog"></g>',a),b=s.indexOf('</g></g>',f);if(a>15&&f>a&&b>f)s=s.slice(0,a)+t.ocl+'<g class="fog"></g>'+s.slice(b);
 const i=s.indexOf('<ellipse cx="31" cy="101"');if(i>0)s=s.slice(0,i)+'<g class="lfth">'+t.fr+'</g>'+s.slice(i);
 return s}
function mochiSvg(){if(!document.getElementById('lfmcss')){const st0=document.createElement('style');st0.id='lfmcss';st0.textContent=MOCHI_CSS;document.head.appendChild(st0)}return temaSvg(MOCHI_SVG)}
Object.defineProperty(window,'__lfMochiSvg',{configurable:true,get:function(){const ev=temaEv();if(TEMA_ARQ[ev]&&!TEMA_M[ev]){temaPede();return undefined}return mochiSvg}});
window.__lfMochiArms=function(sv,o){if(!sv)return;o=o||{};if(o.face==='feliz'){sv.querySelectorAll('.olhos,.bW').forEach(function(e){e.setAttribute('opacity','0')});sv.querySelectorAll('.olhosF,.bF').forEach(function(e){e.setAttribute('opacity','1')})}else if(o.face==='surpresa'){sv.querySelectorAll('.bW').forEach(function(e){e.setAttribute('opacity','0')});sv.querySelectorAll('.bO').forEach(function(e){e.setAttribute('opacity','1')})}if(o.face)sv.querySelectorAll('.esp').forEach(function(e){e.style.display='none'});[[-1,'e',o.e!=null?o.e:35],[1,'d',o.d!=null?o.d:40]].forEach(function(a){const B=sv.querySelector('.aB'+a[1]),F=sv.querySelector('.aF'+a[1]);if(!B||!B.firstChild)return;const p=ARMP(30);B.firstChild.setAttribute('d',p);if(B.lastChild)B.lastChild.setAttribute('d',ARMH(30));B.setAttribute('transform',armT(a[0],a[2]));B.style.display='';if(F)F.style.display='none';const mk=sv.querySelector('.mk'+a[1]);if(mk&&mk.firstChild){mk.firstChild.setAttribute('d',p);mk.setAttribute('transform',armT(a[0],a[2]))}})};
function Mochi(host,x,y){const el=document.createElement('div');el.className='mochi';el.innerHTML=temaSvg(MOCHI_SVG);host.appendChild(el);
 const q=s=>el.querySelector(s);if(!document.getElementById('lfmcss')){const st=document.createElement('style');st.id='lfmcss';st.textContent=MOCHI_CSS;document.head.appendChild(st)}
 const RM=matchMedia('(prefers-reduced-motion: reduce)');
 const M={el,x,y,fal:0,exp:'n',modo:'livre'};
 M.pos=function(nx,ny){M.x=nx;M.y=ny;el.style.transform=`translate(${nx}px,${ny}px)`};M.pos(x,y);
 /* ---- esqueleto ---- */
 const N={aBe:q('.aBe'),aBd:q('.aBd'),aFe:q('.aFe'),aFd:q('.aFd'),mke:q('.mke'),mkd:q('.mkd'),pon:q('.ponT'),oclT:q('.oclT'),espT:q('.espT'),fog:q('.fog'),itB:q('.itB'),itF:q('.itF'),pulo:q('.pulo'),pe1:q('.pe1'),pe2:q('.pe2')};
 const S={ae:35,ad:40,te:35,td:40,ve:0,vd:0,Le:30,Ld:30,g:null,res:{gr:0,gy:0,mr:0,my:0,oy:0,orr:0,oo:1},lastIt:'',lastFog:''};
 /* molas (S88): alvo + velocidade; k = força, d = amortecimento */
 const MOL={sx:{v:1,t:1,w:0,k:.09,d:.55},sy:{v:1,t:1,w:0,k:.09,d:.55},ti:{v:0,t:0,w:0,k:.045,d:.7},es:{v:0,t:0,w:0,k:.05,d:.74},ob:{v:0,t:0,w:0,k:.05,d:.74},fx:{v:1,t:1,w:0,k:.07,d:.6}};
 const mola=(m,n)=>{if(RM.matches){m.v=m.t;m.w=0;return}for(let i=0;i<n;i++){m.w+=(m.t-m.v)*m.k;m.w*=m.d;m.v+=m.w}};
 const nS=q('.sq'),nT=q('.tilt'),nE=q('.esp'),nO=q('.ocl');M.rot=null;
 M.bracos=function(e,d){if(e!=null)S.te=-e;if(d!=null)S.td=d;if(RM.matches){S.ae=S.te;S.ad=S.td}};
 /* S383: só escreve no desenho o que mudou de valor (atributo: confere o que está lá; estilo: lembra o último que pôs) */
 function SA(n,a,v){if(n.getAttribute(a)!==v)n.setAttribute(a,v)}
 function ST(n,k,v){const c=n._st||(n._st={});if(c[k]!==v){c[k]=v;n.style[k]=v}}
 function armSet(lado,ang,L,fE,bd){bd=Math.round((bd||0)*2)/2;const c=lado<0?'e':'d',B=N['aB'+c],F=N['aF'+c],T=armT(lado,ang),p=ARMP(L,bd);let op=cl((1.02-dentro(lado,ang,L))/.14,0,1);if(fE!=null)op=Math.max(op,fE);
  if(B._p!==p){SA(B.firstChild,'d',p);SA(B.lastChild,'d',ARMH(L,bd));const t=F.firstChild;SA(t.children[0],'d',p);SA(t.children[1],'d',p);SA(t.children[2],'d',ARMHF(L,bd));SA(N['mk'+c].firstChild,'d',p);B._p=p}
  SA(B,'transform',T);ST(B,'display',op<1?'':'none');SA(F.firstChild,'transform',T);SA(N['mk'+c],'transform',T);ST(F,'display',op>0?'':'none');SA(F,'opacity',op.toFixed(3));filSet(lado,ang,L,op<.5,bd)}
function filSet(lado,ang,L,vis,bd){bd=Math.round((bd||0)/2)*2;/* S426: dobra em passos de 2° no contorno (mede o caminho uma vez por forma) */const G=lado<0?(N._fE||(N._fE=q('.filE'))):(N._fD||(N._fD=q('.filD'))),body=N._cF||(N._cF=q('.corpoF'));if(!G||!body)return;if(!vis){if(G._k!==''){G.innerHTML='';G._k=''}return}const key=ang.toFixed(1)+'|'+L.toFixed(1)+'|'+bd;if(G._k===key)return;G._k=key;
 const RC=filSet.rc||(filSet.rc=new Map()),kk=lado+'|'+key;if(RC.has(kk)){G.innerHTML=RC.get(kk);return}
 const NS='http://www.w3.org/2000/svg';let A=filSet.a;if(!A){const sv=document.createElementNS(NS,'svg');SA(sv,'style','position:fixed;left:-20px;top:0;width:0;height:0;overflow:hidden');A=document.createElementNS(NS,'path');sv.appendChild(A);document.body.appendChild(sv);filSet.a=A}
 SA(A,'d',ARMP(L,bd).replace('M0 -10','M-8 -10 L0 -10').replace(/ Z$/,' L-8 10 Z'));const sx=lado<0?22:98,rt=(lado<0?180-ang:ang)*Math.PI/180,c=Math.cos(rt),s=Math.sin(rt),f=lado<0?-1:1;
 const toS=p=>{const y=p.y*f;return {x:sx+p.x*c-y*s,y:92+p.x*s+y*c}},toL=p=>{const dx=p.x-sx,dy=p.y-92;return {x:dx*c+dy*s,y:(-dx*s+dy*c)*f}};
 const inB=p=>body.isPointInFill(new DOMPoint(p.x,p.y)),inA=p=>A.isPointInFill(new DOMPoint(...Object.values(toL(p))));
 /* S383: tabela de pontos do caminho (medida uma vez por forma) + interpolação — sem pedir ponto ao navegador a cada amostra */
 const TB=window.__lfCamt?(window.__lfTB||(window.__lfTB={})):(filSet.tb||(filSet.tb={})),tab=(path,k)=>{let t=TB[k];if(!t){const Lt=path.getTotalLength(),m=Math.max(120,Math.ceil(Lt*2)),P=new Float32Array((m+1)*2);for(let i=0;i<=m;i++){const p=path.getPointAtLength(Lt*i/m);P[2*i]=p.x;P[2*i+1]=p.y}t=TB[k]={L:Lt,n:m,P:P}}return t},
  pto=(t,u)=>{u=((u%t.L)+t.L)%t.L;const f=u/t.L*t.n,i=Math.min(t.n,Math.floor(f)),g=f-i,j=Math.min(t.n,i+1),P=t.P;return {x:P[2*i]+(P[2*j]-P[2*i])*g,y:P[2*i+1]+(P[2*j+1]-P[2*i+1])*g}};
 const tabA=L=>{const k='A'+L.toFixed(1)+'|'+bd;let t=TB[k];if(t)return t;const X=[],Y=[],ln=(x,y)=>{X.push(x);Y.push(y)},cb=(a,b,c,d,e,g,h,i)=>{for(let j=1;j<=64;j++){const u=j/64,w=1-u,p=w*w*w,q2=3*w*w*u,r2=3*w*u*u,z=u*u*u;ln(p*a+q2*c+r2*e+z*h,p*b+q2*d+r2*g+z*i)}};
   ln(-8,-10);ln(0,-10);cb(0,-10,L*.45,-11,L-2,-8.5,L,-1);cb(L,-1,L+1.5,5,L-4,9,L-9,8.5);cb(L-9,8.5,L*.45,8,L*.2,10,0,10);ln(-8,10);ln(-8,-10);if(bd)for(let i=0;i<X.length;i++){const r=BEND(X[i],Y[i],L,bd);X[i]=r[0];Y[i]=r[1]}
   const n0=X.length,C=new Float32Array(n0);for(let i=1;i<n0;i++)C[i]=C[i-1]+Math.hypot(X[i]-X[i-1],Y[i]-Y[i-1]);const Lt=C[n0-1],m=Math.max(120,Math.ceil(Lt*2)),P=new Float32Array((m+1)*2);let j=1;
   for(let i=0;i<=m;i++){const u=Lt*i/m;while(j<n0-1&&C[j]<u)j++;const d=C[j]-C[j-1],g=d>0?(u-C[j-1])/d:0;P[2*i]=X[j-1]+(X[j]-X[j-1])*g;P[2*i+1]=Y[j-1]+(Y[j]-Y[j-1])*g}return TB[k]={L:Lt,n:m,P:P}};
 const tabD=(d,k)=>{let t=TB[k];if(t)return t;const X=[],Y=[],tk=d.match(/[MCLZ]|-?\d*\.?\d+/g)||[];let i=0,c='',x=0,y=0,x0=0,y0=0;const nx=()=>parseFloat(tk[i++]);
   while(i<tk.length){if(/[MCLZ]/.test(tk[i]))c=tk[i++];if(c==='M'){x=x0=nx();y=y0=nx();X.push(x);Y.push(y);c='L'}else if(c==='L'){x=nx();y=nx();X.push(x);Y.push(y)}else if(c==='C'){const a=nx(),b=nx(),e=nx(),g=nx(),h=nx(),j=nx();for(let s2=1;s2<=96;s2++){const u=s2/96,w=1-u;X.push(w*w*w*x+3*w*w*u*a+3*w*u*u*e+u*u*u*h);Y.push(w*w*w*y+3*w*w*u*b+3*w*u*u*g+u*u*u*j)}x=h;y=j}else if(c==='Z'){if(x!==x0||y!==y0){X.push(x0);Y.push(y0)}x=x0;y=y0;c=''}else i++}
   const n0=X.length,C=new Float32Array(n0);for(let q2=1;q2<n0;q2++)C[q2]=C[q2-1]+Math.hypot(X[q2]-X[q2-1],Y[q2]-Y[q2-1]);const Lt=C[n0-1],m=Math.max(120,Math.ceil(Lt*2)),P=new Float32Array((m+1)*2);let j2=1;
   for(let q2=0;q2<=m;q2++){const u=Lt*q2/m;while(j2<n0-1&&C[j2]<u)j2++;const dd=C[j2]-C[j2-1],g=dd>0?(u-C[j2-1])/dd:0;P[2*q2]=X[j2-1]+(X[j2]-X[j2-1])*g;P[2*q2+1]=Y[j2-1]+(Y[j2]-Y[j2-1])*g}return TB[k]={L:Lt,n:m,P:P}};
 const bd0=window.__lfCamt?(body.getAttribute('d')||''):'',tA=window.__lfCamt?tabA(L):tab(A,'a'+L.toFixed(1)+'|'+bd),tB=(bd0&&!/[^MCLZ\d\s.,-]/.test(bd0))?tabD(bd0,'b'):tab(body,'b'),La=tA.L,Lb=tB.L,n=90,r=2.6;const aP=t=>toS(pto(tA,t)),bP=t=>pto(tB,t);
 let h='',prev=inB(aP(0));for(let i=1;i<=n;i++){const t=La*i/n,cur=inB(aP(t));if(cur!==prev){let lo=La*(i-1)/n,hi=t;for(let k=0;k<14;k++){const m=(lo+hi)/2;(inB(aP(m))===prev)?lo=m:hi=m}
   const tj=(lo+hi)/2,J=aP(tj),sa=prev?1:-1;if(!filSet.bs){if(window.__lfCamt&&window.__lfBS)filSet.bs=window.__lfBS;else{filSet.bs=[];for(let k=0;k<400;k++){const u=Lb*k/400,p=window.__lfCamt?pto(tB,u):body.getPointAtLength(u);filSet.bs.push([u,p.x,p.y])}if(window.__lfCamt)window.__lfBS=filSet.bs}}let tb=0,bd=1e9;for(const [u,x,y] of filSet.bs){const d=(x-J.x)**2+(y-J.y)**2;if(d<bd){bd=d;tb=u}}
   let sb=1;if(inA(bP(tb+1.5)))sb=-1;const a1=aP(tj+sa*1.5),b1=bP(tb+sb*1.5),ux=a1.x-J.x,uy=a1.y-J.y,vx=b1.x-J.x,vy=b1.y-J.y,
   th=Math.acos(Math.max(-1,Math.min(1,(ux*vx+uy*vy)/Math.hypot(ux,uy)/Math.hypot(vx,vy)))),rr=Math.min(9,Math.max(r,1.7/Math.tan(th/2)));
   const Ap=aP(tj+sa*rr),Bp=bP(tb+sb*rr);const F2=v=>v.toFixed(2),Q=`M${F2(Ap.x)} ${F2(Ap.y)} Q${F2(J.x)} ${F2(J.y)} ${F2(Bp.x)} ${F2(Bp.y)}`;
   const gid=`lfmfg${lado<0?"e":"d"}${i}`;h+=`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${F2(Ap.x)}" y1="${F2(Ap.y)}" x2="${F2(Bp.x)}" y2="${F2(Bp.y)}"><stop offset="0" stop-color="#e8c3d6"/><stop offset="1" stop-color="#ecc9da"/></linearGradient><path d="${Q} L${F2(J.x)} ${F2(J.y)}Z" fill="url(#${gid})" stroke="url(#${gid})" stroke-width=".3" stroke-linejoin="round"/><path d="${Q}" fill="none" stroke="url(#${gid})" stroke-width="1.5" stroke-linecap="butt"/>`}prev=cur}
 if(RC.size>900)RC.clear();RC.set(kk,h);G.innerHTML=h}
 let face0=null;function faceSet(f){const k=f?Object.keys(f)[0]||'':'';if(k===face0)return;face0=k;const fz=k==='pisca'||k==='boc',ff=k==='feliz'||(!k&&M.exp==='f');
  q('.olhos').style.opacity=fz||ff?0:1;q('.olhosF').style.opacity=ff&&!fz?1:0;q('.olhosZ').style.opacity=fz?1:0;q('.bF').style.opacity=ff&&!fz&&k!=='boc'?1:0;q('.bH').style.opacity=k==='hmm'?1:0;q('.bY').style.opacity=k==='boc'?1:0;
  q('.bW').style.opacity=(ff||M.fal||k==='hmm'||k==='boc')?0:1;if(k==='olha')M.olha(0,0)}
 let raf=0,t0=performance.now(),lt=t0;
 function frame(now){if(!el.isConnected){raf=0;return}raf=requestAnimationFrame(frame);const dt=Math.min(3,(now-lt)/16.67);lt=now;
  /* braços seguem o alvo com mola (passa um pouquinho e volta, como .34,1.45) */
  for(const c of ['e','d']){const k='a'+c,t='t'+c,v='v'+c;if(RM.matches){S[k]=S[t];S[v]=0;continue}for(let i=0;i<Math.round(dt)||i<1;i++){S[v]+=(S[t]-S[k])*.045;S[v]*=.7;S[k]+=S[v]}}
  let ae=S.ae,ad=S.ad,Le=30,Ld=30,fE=null,fD=null,o={};const g=S.g;
  if(g){const tt=(now-g.t0)/1000;o=g.def.f(Math.min(tt,g.def.dur),g.s,{leve:RM.matches})||{};if(o.ae!=null)ae=o.ae;if(o.ad!=null)ad=o.ad;if(o.Le!=null)Le=o.Le;if(o.Ld!=null)Ld=o.Ld;fE=o.fE;fD=o.fD;
   if(tt>=g.def.dur){S.g=null;if(o.ae!=null){S.ae=ae;S.ve=0}if(o.ad!=null){S.ad=ad;S.vd=0}faceSet(null);g.cb&&g.cb()}}
  const BD=S.bd||(S.bd={e:0,we:0,d:0,wd:0,pe:ae,pd:ad});for(const [c,a] of [['e',ae],['d',ad]]){const w='w'+c,pr='p'+c,vel=(a-BD[pr])/Math.max(1,dt);BD[pr]=a;if(RM.matches){BD[c]=0;BD[w]=0;continue}const pn=N._pon||(N._pon=q('.pon')),cv=c==='d'&&pn&&pn.style.opacity==='1',alvo=cv?0:Math.max(-16,Math.min(16,-vel*3.2));for(let i=0;i<Math.round(dt)||i<1;i++){BD[w]+=(alvo-BD[c])*.22;BD[w]*=.62;BD[c]+=BD[w]}if(Math.abs(BD[c])<.25&&Math.abs(BD[w])<.05)BD[c]=0}
   armSet(-1,ae,Le,fE,BD.e);armSet(1,ad,Ld,fD,BD.d);
  const R=S.res;for(const k of ['gr','gy','mr','my','oy','orr']){if(o[k]!=null)R[k]=o[k];else R[k]*=.86}if(o.oo!=null)R.oo=o.oo;else R.oo+=(1-R.oo)*.2;
  const nf=Math.max(1,Math.round(dt));for(const k in MOL)mola(MOL[k],nf);
  ST(nS,'transform',`scale(${(1+(MOL.sx.v-1)*.3).toFixed(4)},${(1+(MOL.sy.v-1)*.3).toFixed(4)})`);ST(nT,'transform',`rotate(${(M.rot!=null?M.rot:MOL.ti.v).toFixed(2)}deg)`);ST(nE,'transform',`rotate(${MOL.es.v.toFixed(2)}deg)`);ST(nE,'transformOrigin','60px 58px');
  SA(N.oclT,'transform',`translate(0 ${(R.gy+R.oy+MOL.ob.v).toFixed(2)}) rotate(${(R.gr+R.orr).toFixed(2)} 60 83)`);SA(N.oclT,'opacity',R.oo.toFixed(3));SA(N.espT,'transform',`translate(0 ${R.my.toFixed(2)}) rotate(${R.mr.toFixed(2)} 60 58)`);
  const fog=fogL(75,'lfmzD',o.fogD||0,86,79)+fogL(45,'lfmzE',o.fogE||0,56,79);if(fog!==S.lastFog){N.fog.innerHTML=fog;S.lastFog=fog}
  const it=(o.itB||'')+'|'+(o.itF||'');if(it!==S.lastIt){N.itB.innerHTML=o.itB||'';N.itF.innerHTML=o.itF||'';S.lastIt=it}
  const h=o.hop||0,sc=o.sc!=null?o.sc:1,sx=(o.sx||1)*sc,sy=(o.sy||1)*sc,ti=(o.tilt||0)+(o.rot||0);const fx=cl(MOL.fx.v,-1,1);SA(N.pulo,'transform',`translate(60 0) scale(${(Math.abs(fx)<.02?.02*Math.sign(fx||1):fx).toFixed(3)} 1) translate(-60 0) translate(60 124) translate(0 ${(-h).toFixed(2)}) rotate(${ti.toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(-60 -124)`);
  const pe=o.pe||0;SA(N.pe1,'transform',`translate(0 ${(-Math.max(0,pe)).toFixed(2)})`);SA(N.pe2,'transform',`translate(0 ${(-Math.max(0,-pe)).toFixed(2)})`);
  if(g)faceSet(o.face||null);
  SA(N.pon,'transform',armT(1,ad))}
 raf=requestAnimationFrame(frame);
 /* gesto: começa dos ângulos atuais; só um por vez */
 M.gesto=function(nome,cb){const d=G[nome];if(!d)return false;if(S.g)M.paraGesto();S.g={def:d,t0:performance.now(),s:{ae:S.ae,ad:S.ad},cb};return true};
 M.emGesto=function(){return !!S.g};M.gestoUsa=function(c){return !!(S.g&&(S.g.def.mao||'').indexOf(c)>=0)};
 M.paraGesto=function(){const g=S.g;if(!g)return;S.g=null;faceSet(null);S.lastIt='x'};
 M.olha=function(dx,dy){q('.pup').style.transform=`translate(${(dx||0)*(MOL.fx.t<0?-2.4:2.4)}px,${(dy||0)*1.6}px)`};
 M.cara=function(e){if(e===M.exp)return;M.exp=e;face0=null;M.pisca();setTimeout(()=>faceSet(null),70)};
 /* ponteiro de mãozinha com cabo vinho (S58 A + S70): a haste estica até o comprimento todo */
 M.vara=function(on){q('.pon').style.opacity=on?1:0;M.ponOn=!!on;if(!on)M.estica(0,0)};
 M.len=0;M.estica=function(Lh,ms,ex){const h=q('.haste'),g=q('.luva'),FULL=34.3;const alvo=ex?cl(Lh,0,FULL):Lh>0?FULL:0;const ap=x=>{M.len=x;h.setAttribute('d',`M36.7 0 H${(36.7+x).toFixed(2)}`);g.setAttribute('transform',`translate(${(36.7+x).toFixed(2)} 0) scale(.75)`)};
  if(!ms||RM.matches){ap(alvo);return}const a0=M.len,t1=performance.now(),st=3;const f=n=>{let t=Math.min(1,(n-t1)/ms);const k=Math.floor(t*st)/st,fr=(t*st)%1,e=t>=1?1:k+(1/st)*EO(Math.min(1,fr*1.6));ap(a0+(alvo-a0)*Math.min(1,e));if(t<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 M.toca=function(){const g=q('.luva');let k=0;const tik=()=>{if(k>=4)return;const b=`translate(${(36.7+M.len).toFixed(2)} 0) scale(.75)`;g.setAttribute('transform',b+(k%2?'':' translate(3 0)'));k++;setTimeout(tik,110)};tik()};
 M.inclina=function(d){MOL.ti.t=d||0};
 /* S91: vira de lado (mola: o corpo afina, passa pelo meio e abre do outro lado, com um balancinho) */
 M.vira=function(f){f=f<0?-1:1;if(MOL.fx.t===f)return;MOL.fx.t=f;M.empurra(f*-2.2);M.oculosPulo(-1)};M.virado=function(){return MOL.fx.t<0};
 /* desliza com um tiquinho de passada e volta (S88) */
 M.mv=0;M.para=function(){M.mv++};M.flutua=function(nx,ny,dur,fim){const tk=++M.mv,x0=M.x,y0=M.y,t1=performance.now();const _d=Math.hypot(nx-M.x,ny-M.y);dur=Math.round(Math.min(1200,Math.max(360,300+_d*2.1)));if(_d>40)M.olhaVai(Math.sign(nx-M.x)||0,Math.sign(ny-M.y)*.6,dur+250);if(RM.matches){M.pos(nx,ny);fim&&fim();return}M.amassa(.96,1.05);const f=n=>{if(tk!==M.mv)return;let t=Math.min(1,(n-t1)/dur),e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;M.pos(x0+(nx-x0)*e,y0+(ny-y0)*e);if(t>.5)M.amassa(1,1);if(t<1)requestAnimationFrame(f);else fim&&fim()};requestAnimationFrame(f)};M.empurra=function(v){MOL.ti.w+=v};
 /* espelho: um toque de velocidade e a mola faz o balanço amortecido */
 M.espelho=function(f){MOL.es.w+=(f||1)*-7};M.oculosPulo=function(v){MOL.ob.w+=v};
 M.ajustaOculos=function(){M.gesto('ajusta')};
 M.acena=function(){if(!S.g||!S.g.def.mao||S.g.def.mao.indexOf('d')<0)M.gesto('tchau')};
 M.sim=function(){M.empurra(2.6);M.espelho(.8);M.oculosPulo(-1.2)};
 M.nao=function(){M.inclina(-10);M.olha(-1,-.6);setTimeout(()=>{M.inclina(0);M.olha(0,0)},1100)};
 /* vida própria (S72/S74): trabalhando = só gestos no próprio corpo, a mão do ponteiro parada; livre = gestos maiores */
 M.ocioso=false;let ot=0;const T_IDLE={olha:()=>{M.olha(0,0);M.inclina(4);setTimeout(()=>M.inclina(0),900)},pisca2:()=>{M.pisca();setTimeout(()=>M.pisca(),230)},inclina:()=>{M.inclina(8);setTimeout(()=>M.inclina(0),900)},
   ajusta:()=>M.gesto('ajusta'),pezinhos:()=>M.gesto('pezinhos'),respira:()=>M.gesto('respira')};
 const L_IDLE={limpa:()=>M.gesto('limpa'),espreguica:()=>M.gesto('espreguica'),cantarola:()=>{M.onCanta&&M.onCanta()},palminha:()=>M.gesto('palminha'),bocejo:()=>M.gesto('bocejo'),tchau:()=>M.gesto('tchau'),
   pulinho:()=>M.gesto('pulinho'),danca:()=>M.gesto('danca'),tapinha:()=>M.gesto('tapinha'),pisca2:()=>{M.pisca();setTimeout(()=>M.pisca(),230)}};
 let ult='';const vida=()=>{clearTimeout(ot);ot=setTimeout(()=>{if(!el.isConnected)return;if(M.ocioso&&!M.fal&&!S.g&&!M.preso){const L=M.modo==='trab'?T_IDLE:L_IDLE,ks=Object.keys(L).filter(k=>k!==ult&&!(M.ponOn&&M.modo!=='trab'&&/limpa|palminha|espreguica|danca|tchau/.test(k)));
   if(!RM.matches||/olha|pisca2|inclina/.test(ks.join())){let k=ks[Math.floor(Math.random()*ks.length)];if(RM.matches)k=['olha','pisca2'][Math.floor(Math.random()*2)];ult=k;(L[k]||T_IDLE[k])()}}vida()},10000+Math.random()*6000)};vida();
 M.olhaPara=function(x,y){const r=el.getBoundingClientRect(),cx=r.left+r.width*.45,cy=r.top+r.height*.5,dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy)||1;M.olha(dx/d,dy/d);clearTimeout(M._ol);M._ol=setTimeout(()=>M.olha(0,0),900)};
 (function mo(){setTimeout(()=>{if(!el.isConnected)return;if(!M.fal&&q('.pup').style.transform.indexOf('(0px')>=0)M.olhaVai((Math.random()-.5)*1.1,(Math.random()-.4)*.7,900);mo()},4000+Math.random()*3000)})();M.pisca=function(){const p=q('.pis');p.classList.remove('p');void p.getBBox;requestAnimationFrame(()=>p.classList.add('p'))};
 (function pv(){setTimeout(()=>{if(!el.isConnected)return;if(M.exp!=='f'){M.pisca();if(Math.random()<.2)setTimeout(()=>M.pisca(),260)}pv()},2500+Math.random()*3500)})();
 let ft=0;M.fala=function(ms){M.fal=1;clearTimeout(ft);clearTimeout(M._ff);const bO=q('.bO'),bW=q('.bW');let k=0;const tik=()=>{if(!M.fal)return;const ab=M.rel?(k++%3)!==2:false;bO.style.opacity=ab?1:0;bW.style.opacity=ab||M.exp==='f'?0:1;if(M.exp==='f')bO.style.opacity=0;ft=setTimeout(tik,110+Math.random()*90)};tik();
  M._ff=setTimeout(()=>M.calou(),ms)};
 M.calou=function(){M.fal=0;clearTimeout(ft);clearTimeout(M._ff);q('.bO').style.opacity=0;if(M.exp!=='f'&&!face0)q('.bW').style.opacity=1};
 M.amassa=function(sx,sy){MOL.sx.t=sx;MOL.sy.t=sy};M.amassaJa=function(sx,sy){MOL.sx.v=MOL.sx.t=sx;MOL.sy.v=MOL.sy.t=sy;MOL.sx.w=MOL.sy.w=0};
/* S370 (aprovado em vídeo, 16/11): olhar que volta sozinho, boca pelo volume da voz e salto com tempo e altura pela distância */
 M.olhaVai=function(dx,dy,ms){M.olha(dx,dy);const tr=q('.pup').style.transform;setTimeout(()=>{if(q('.pup').style.transform===tr)M.olha(0,0)},ms)};
 M.falaVol=function(a){try{/* S376: som vindo de outro endereço (modo loja buscando a voz no site, ainda sem guardar no aparelho) não passa pelo analisador — ele o deixaria mudo */if(new URL(a.src,location.href).origin!==location.origin)return false;const bO=q('.bO'),bW=q('.bW');const AC0=window.__lfAc;if(!a._an){if(!AC0||AC0.state!=='running')return false;const sr=AC0.createMediaElementSource(a);a._an=AC0.createAnalyser();a._an.fftSize=512;sr.connect(a._an);a._an.connect(AC0.destination)}else if(!AC0||AC0.state!=='running')return false;M.fal=1;clearTimeout(ft);const an=a._an,buf=new Uint8Array(an.fftSize);let ab=-1,ult=0;bO.style.transformBox='fill-box';bO.style.transformOrigin='center';
   const lp=n=>{if(!M.fal||a.paused||a.ended)return;an.getByteTimeDomainData(buf);let e=0;for(let i=0;i<buf.length;i++){const v=(buf[i]-128)/128;e+=v*v}e=Math.sqrt(e/buf.length);const al=e>.1?2:e>.03?1:0;
    if(al!==ab&&n-ult>60){ab=al;ult=n;const fe=M.exp==='f';bO.style.opacity=ab&&!fe?1:0;bO.style.transform=ab===1?'scale(.82,.5)':'';bW.style.opacity=ab||fe?0:1}requestAnimationFrame(lp)};requestAnimationFrame(lp);return true}catch(_){return false}};
 /* salto: tempo e altura pela distância; de lado constante, sobe e cai como gravidade; olha e inclina antes; sombra fica no chão e encolhe; percurso curto vira deslize */
 M.pula=function(nx,ny,dur,alt,fim){const x0=M.x,y0=M.y,dx=nx-x0,dy=ny-y0,dist=Math.hypot(dx,dy);if(dist<56){M.flutua(nx,ny,0,fim);return}
  dur=Math.round(Math.min(1050,Math.max(460,340+dist*1.55)));alt=Math.min(96,Math.max(16,dist*.26));const tk=++M.mv,sb=q('.sombra'),ku=sb?(sb.getBoundingClientRect().width/68||1):1;
  M.olhaVai(Math.sign(dx)||0,Math.sign(dy)*.6,dur+650);M.inclina((dx>0?1:-1)*3);
  setTimeout(()=>{if(tk!==M.mv)return;M.amassa(1.1,.88);
   setTimeout(()=>{if(tk!==M.mv)return;M.amassa(.92,1.1);const t1=performance.now();if(sb){sb.style.animation='none';sb.style.transformBox='fill-box';sb.style.transformOrigin='center'}
    const solta=()=>{if(sb){sb.style.transform='';sb.style.animation=''}},f=n=>{if(tk!==M.mv){solta();return}const t=Math.min(1,(n-t1)/dur),h=4*t*(1-t)*alt;M.pos(x0+dx*t,y0+dy*t-h);
     if(sb)sb.style.transform=`translateY(${(h/ku).toFixed(1)}px) scale(${(1-Math.min(.45,h/170)).toFixed(3)})`;
     if(t>.4&&t<.6)M.amassa(1,1);else if(t>.82)M.amassa(.95,1.07);
     if(t<1)requestAnimationFrame(f);else{solta();M.inclina(0);M.amassa(1.13,.85);setTimeout(()=>{if(tk===M.mv)M.amassa(1,1)},120);fim&&fim()}};requestAnimationFrame(f)},170)},110)};
 M.desliza=function(nx,ny,dur){const x0=M.x,y0=M.y,t1=performance.now();dur=dur||600;const f=n=>{let t=Math.min(1,(n-t1)/dur),e=1-Math.pow(1-t,3);M.pos(x0+(nx-x0)*e,y0+(ny-y0)*e);if(t<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 /* S101: mira o ponteiro — o braço gira com a mola e a haste estica/encolhe até o comprimento pedido (telescópica) */
 M.mira=function(a,len,ms){M.bracos(null,a);const h=q('.haste'),g=q('.luva'),ap=x=>{M.len=x;h.setAttribute('d',`M36.7 0 H${(36.7+x).toFixed(2)}`);g.setAttribute('transform',`translate(${(36.7+x).toFixed(2)} 0) scale(.75)`)};
  const a0=M.len||0,t1=performance.now(),tk=M._mk=(M._mk||0)+1;if(!ms||RM.matches){ap(len);return}const f=n=>{if(tk!==M._mk)return;let t=Math.min(1,(n-t1)/ms);ap(a0+(len-a0)*EO(t));if(t<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 M.mao=function(){const r=q('.mao').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
 M.mao2=function(){const r=q('.luva .dedo').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
 return M}

    return Mochi})();

    /* ---------- voz (S66: a fala nunca é cortada; áudios gravados da voz do Mochi; senão a voz mais natural do celular) ---------- */
    var VZ={m:null,a:null,st:'carr',esp:[]};/* S163: st = carr (baixando a lista) · ok · sem (sem voz gravada) */function vzPronta(st){VZ.st=st;var f=VZ.esp;VZ.esp=[];f.forEach(function(x){x()})}try{fetch('https://lafouch.com/media/voz/'+(ES?'es':'pt')+'/lista.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null}).then(function(j){VZ.m=j;vzPronta(j?'ok':'sem');vcNavega()}).catch(function(){vzPronta('sem')})}catch(_){vzPronta('sem')}
    /* 10/11 S108-1 (aprovado): a voz do Mochi fica PRONTA ANTES, sem baixar a qualidade (MP3 128k, como gravado).
       - navegando na loja com Wi-Fi (celular parado): baixa tudo em silêncio, uma por vez; no 4G/economia de dados não baixa (iPhone não diz se é Wi-Fi → só na consulta)
       - consulta abre: o que faltar baixa na hora, na ordem das falas (entrada, câmera e preparo primeiro), 2 por vez
       - guardado no celular (Cache Storage): as próximas consultas já abrem prontas
       - antes de cada fala o site garante que o áudio chegou; se faltar, anel "Preparando a voz do Mochi…" — nunca boca sem som
       - a câmera inteligente (13 MB) também só baixa antes no Wi-Fi */
    var VC={nm:'lf-voz-'+(ES?'es':'pt'),pr:{},fila:[],rod:0,max:1,tem:{}};
    function vcU(f){return 'https://lafouch.com/media/voz/'+(ES?'es':'pt')+'/'+f}
    function vcTodos(){if(!VZ.m)return [];var vi={},L=[];Object.keys(VZ.m).forEach(function(k){[].concat(VZ.m[k]).forEach(function(f){if(!vi[f]){vi[f]=1;L.push(f)}})});return L}
    function vcBaixa(f){if(VC.pr[f])return VC.pr[f];var u=vcU(f);
      var pr=VC.pr[f]=(window.caches?caches.open(VC.nm).then(function(c){return c.match(u).then(function(r){if(r)return r;return fetch(u).then(function(x){if(!x.ok)throw new Error('voz '+x.status);return c.put(u,x.clone()).catch(function(){}).then(function(){return x})})})}):fetch(u).then(function(x){if(!x.ok)throw new Error('voz');return x}))
        .then(function(r){return r.blob()}).then(function(b){VC.tem[f]=URL.createObjectURL(b);return VC.tem[f]});
      pr.catch(function(){delete VC.pr[f]});return pr}
    function vcGira(){while(VC.rod<VC.max&&VC.fila.length){var f=VC.fila.shift();if(VC.tem[f])continue;VC.rod++;vcBaixa(f).catch(function(){}).then(function(){VC.rod--;vcGira()})}}
    function vcPoe(L,max){VC.max=Math.max(VC.max,max||1);L.forEach(function(f){if(!VC.tem[f]&&VC.fila.indexOf(f)<0)VC.fila.push(f)});vcGira()}
    function wifi(){var c=navigator.connection;return !!(c&&!c.saveData&&(c.type==='wifi'||c.type==='ethernet'))}
    function vcNavega(){if(!wifi())return;var go=function(){if(!wifi())return;vcPoe(vcTodos(),1);try{['vision_bundle.mjs','vision_wasm_internal.js','vision_wasm_internal.wasm','face_landmarker.task'].forEach(function(f,i){setTimeout(function(){fetch('/loja/lfx/mp/'+f).catch(function(){})},20000+i*4000)})}catch(_){}};
      if(window.requestIdleCallback)setTimeout(function(){requestIdleCallback(go,{timeout:8000})},6000);else setTimeout(go,8000)}
    function vcConsulta(){vcPoe(vcTodos(),2)}
    /* espera os arquivos de uma fala; o anel só aparece se demorar */
    function vcPronto(fs,cb){var ok=fs.every(function(f){return VC.tem[f]});if(ok){cb(true);return}var an=setTimeout(function(){vcAnel(true)},350),feito=0,fim=function(v){if(feito)return;feito=1;clearTimeout(an);vcAnel(false);cb(v)};
      Promise.all(fs.map(function(f){return VC.tem[f]?Promise.resolve(VC.tem[f]):vcBaixa(f)})).then(function(){fim(true)},function(){fim(false)});setTimeout(function(){fim(false)},45000)}
    function vcAnel(on){var s=Z.el&&q('#gzstg');if(!s)return;var a=q('#gzvp');if(on&&!a){a=document.createElement('div');a.id='gzvp';a.className='gzvp';a.setAttribute('role','status');a.innerHTML='<i></i><span>'+T('Preparando a voz do Mochi…')+'</span>';s.appendChild(a)}if(a)a.classList.toggle('on',!!on)}
    /* cada frase do texto vira um ou mais arquivos (frases com grau = começo da frase + o grau) */
    function falaArq(t,fim){if(!VZ.m)return false;var ps=t.split(/(?<=[.!?…])\s+/).map(function(x){return x.trim()}).filter(Boolean),fs=[];
      /* S93: procura primeiro o maior pedaço gravado de uma vez (ex.: "Com a lente +1.25. Consegue ler a última frase?" inteira), para o tom não mudar no meio */
      for(var i=0;i<ps.length;){var ach=0;for(var j=ps.length;j>i;j--){var f=VZ.m[ps.slice(i,j).join(' ')];if(f){fs=fs.concat(f);i=j;ach=1;break}}if(!ach)return false}
      var k=0,my=FID,toca=function(){if(!Z.el||my!==FID)return;if(k>=fs.length){fim();return}var f=fs[k++],a=VZ.a=new Audio(VC.tem[f]||vcU(f));a.muted=mudo();a.onended=toca;a.onerror=toca;
          /* S108-1: a boca só mexe quando o som realmente sai (e para se o som parar) */
          a.onplaying=function(){if(my===FID&&Z.m&&!PZ.on)(Z.m.falaVol(a))||(Z.m.rel=1,0)||Z.m.fala(Math.max(1500,((a.duration||8)-(a.currentTime||0))*1000+600))};a.onpause=a.onwaiting=function(){if(Z.m)Z.m.calou()};
          var p=a.play();if(p&&p.catch)p.catch(function(er){if(er&&er.name==='NotAllowedError')somBloq(true);fim()})};if(VZ.a)try{VZ.a.pause()}catch(_){}
      Z.vzEsp=1;vcPronto(fs,function(){Z.vzEsp=0;if(!Z.el||my!==FID)return;if(PZ.on){PZ.fila.push(function(){if(Z.el&&my===FID)toca()});return}toca()});return true}
    var FID=0;
    /* S163: o navegador bloqueou o som (abriu sem toque): o botão de som pisca com "Toque para ouvir o Mochi"; o 1º toque repete a frase atual */
    function somBloq(on){var b=q('.gzmu');Z.bloq=on?1:0;if(!b)return;b.classList.toggle('gzpis',!!on);var d=q('#gzouv');if(on&&!d){d=document.createElement('span');d.id='gzouv';d.className='gzouv';d.textContent=T('Toque para ouvir o Mochi');b.parentNode.insertBefore(d,b)}if(d)d.hidden=!on}
    function somLibera(){if(!Z.bloq)return;somBloq(false);if(!Z.ultT||Z.falando||Z.vm!=='arq')return;Z.falando=true;var my=FID;falaArq(Z.ultT,function(){if(my===FID){Z.falando=false;if(Z.m)Z.m.calou()}})}
    /* S90: menu, busca ou carrinho por cima da consulta = tudo pausado (a fala para e retoma de onde estava; nada novo começa) */
    var PZ={on:0,desde:0,tot:0,fila:[],a:null};function vt(){return Date.now()-PZ.tot-(PZ.on?Date.now()-PZ.desde:0)}
    function pausa(on){if(!!on===!!PZ.on)return;if(on){PZ.on=1;PZ.desde=Date.now();PZ.a=null;if(Z.m)Z.m.calou();if(VZ.a&&!VZ.a.paused&&!VZ.a.ended){PZ.a=VZ.a;try{VZ.a.pause()}catch(_){}}try{speechSynthesis.pause()}catch(_){}return}
      PZ.on=0;PZ.tot+=Date.now()-PZ.desde;if(!Z.el)return;if(PZ.a&&PZ.a===VZ.a){try{var pp=PZ.a.play();if(pp&&pp.catch)pp.catch(function(){})}catch(_){}}PZ.a=null;try{speechSynthesis.resume()}catch(_){}
      var f=PZ.fila;PZ.fila=[];f.forEach(function(x){x()});if(Z.fase==='teste'&&!Z.falando&&!Z.ocupado)espera()}
    /* S92: só o toque do cliente corta a fala — a voz some em 0,15 s e o que ele ia fazer depois da frase é esquecido */
    function corta(){Z.depoisFala=null;Z.pend=null;if(!Z.falando)return;FID++;Z.falando=false;Z.ocup=0;var a=VZ.a;VZ.a=null;/* a próxima fala não pausa de supetão a que está sumindo */
      if(a&&!a.paused){var v0=a.volume,t0=performance.now();(function f(){var k=Math.min(1,(performance.now()-t0)/150);try{a.volume=v0*(1-k)}catch(_){}if(k<1)requestAnimationFrame(f);else try{a.pause()}catch(_){}})()}
      try{speechSynthesis.cancel()}catch(_){}if(Z.m)Z.m.calou();var bt=q('#gzbt');if(bt)bt.classList.remove('esp')}
    /* toque enquanto ele fala: vale assim que ele terminar a frase (só no teste de leitura) */
    
    /* fala(h,cb,pergunta,dizer): cb roda quando ele TERMINA de falar. Se for pergunta, os botões ficam clarinhos até ele terminar. dizer = o que ele fala (se for diferente do balão) */
    function btLuz(t){var M2=[[T('Se estiver difícil, pode dizer que não consegue — sem problema.'),'#gw [data-gz=nao]']],s0=null;M2.forEach(function(x){if(t.indexOf(x[0])>=0)s0=x[1]});if(!s0)return;var t0=Date.now();setTimeout(function w(){var b=document.querySelector(s0);if(!b||!Z.m||Date.now()-t0>12000)return;if(RM.matches||!b.animate)return;b.animate([{boxShadow:'0 0 0 0 rgba(141,58,105,.6)'},{boxShadow:'0 0 0 20px rgba(141,58,105,0)'}],{duration:1100,iterations:2,easing:'cubic-bezier(.2,.7,.3,1)'})},1200)}
    function fala(h,cb,perg,dz){if(PZ.on){PZ.fila.push(function(){fala(h,cb,perg,dz)});return}
      /* S163: antes da 1ª fala, espera a lista das vozes (até 8 s, com o anel "Preparando a voz"); a consulta inteira fica numa voz só */
      if(!Z.vm&&!mudo()&&VZ.st==='carr'&&Date.now()-(Z.t0||0)<8000){var my0=FID,an0=setTimeout(function(){vcAnel(true)},350),ja0=0,vai=function(){if(ja0)return;ja0=1;clearTimeout(an0);vcAnel(false);if(!Z.el||my0!==FID)return;Z.vm=VZ.st==='ok'&&VZ.m?'arq':'cel';fala(h,cb,perg,dz)};
        VZ.esp.push(vai);setTimeout(vai,Math.max(0,8000-(Date.now()-(Z.t0||0))));return}
      var b=Z.el&&Z.el.querySelector('#gzbal'),t=String(dz||h).replace(/<[^>]+>/g,''),id=++FID,est=Math.min(7000,700+t.length*62);btLuz(String(h).replace(/<[^>]+>/g,''));
      if(b&&!(dz&&b.classList.contains('on')&&b.innerHTML===h)){b.classList.remove('on');setTimeout(function(){if(!Z.el||id!==FID)return;b.innerHTML=h;b.classList.add('on');if(q('#gzjan').hidden)lay()},120)}
      Z.falando=true;var bt=q('#gzbt');if(bt&&perg)bt.classList.add('esp');Z.ocup=Date.now()+est;var boca=function(){if(Z.m&&id===FID)Z.m.fala(est+4000)};
      var feito=false,fim=function(){if(feito||id!==FID)return;feito=true;if(Z.m)Z.m.rel=0;Z.falando=false;Z.ocup=0;if(Z.m)Z.m.calou();var bt=q('#gzbt');if(bt&&bt.classList.contains('esp')&&!Z.troca){bt.classList.remove('esp');bt.classList.remove('acende');void bt.offsetWidth;bt.classList.add('acende')}
        var p=Z.pend;Z.pend=null;if(cb)cb();var df=Z.depoisFala;Z.depoisFala=null;if(df)df();if(p!=null&&Z.fase==='teste')responde(p)};
      Z.falaT0=vt();var lim=vt()+est+4500,seg=function(){if(feito||id!==FID)return;if(Z.vzEsp){lim=vt()+est+4500}if(vt()<lim){setTimeout(seg,400);return}fim()};setTimeout(seg,est+4500);
      if(VZ.a)try{VZ.a.pause()}catch(_){}try{speechSynthesis.cancel()}catch(_){}
      if(mudo()||!t){boca();setTimeout(fim,Math.min(est,500+t.length*40));return}
      if(!Z.vm)Z.vm=VZ.st==='ok'&&VZ.m?'arq':'cel';
      Z.ultT=t;
      if(Z.vm==='arq'){if(falaArq(t,fim))return;boca();setTimeout(fim,est);return}
      try{var u=new SpeechSynthesisUtterance(t.replace(/\+(\d)[.,](\d\d)/g,function(m,a,b){return gfala(a+'.'+b)}));u.lang=ES?'es-ES':'pt-BR';u.onend=fim;u.onerror=fim;u.onstart=function(){if(Z.m)Z.m.rel=1;boca()};
        var vs=speechSynthesis.getVoices().filter(function(v){return v.lang&&v.lang.toLowerCase().indexOf(ES?'es':'pt')===0}),nota=function(v){return (/natural|neural|online|premium|enhanced|google/i.test(v.name)?4:0)+(!v.localService?2:0)+((ES?/419|PY|AR|MX|US/:/BR/).test(v.lang)?1:0)};vs.sort(function(a,b){return nota(b)-nota(a)});if(vs.length)u.voice=vs[0];u.rate=1;speechSynthesis.speak(u)}catch(_){boca();setTimeout(fim,est)}}
    var DIT={};function diz(k,t,forte){var n=Date.now();if(Z.falando||PZ.on)return;if(!forte){if(DIT[k]&&n-DIT[k]<10000)return;if(n<(Z.ocup||0))return}DIT[k]=n;fala(t)}
    function aoChegar(fr,est,fn,ok){var t0=vt(),a0=VZ.a,w=function(){if(!ok())return;var a=VZ.a;if(a0&&a===a0&&a.duration&&isFinite(a.duration)){if(a.currentTime/a.duration>=fr||a.ended){fn();return}}else if(vt()-t0>=fr*est){fn();return}setTimeout(w,80)};setTimeout(function(){a0=VZ.a&&!VZ.a.ended&&!VZ.a.paused?VZ.a:null;w()},140)}
    /* S66: frases sorteadas por situação, sem repetir a mesma em seguida */
    var FR={prox:['E esta?','Consegue esta?','Agora esta aqui.','Vamos descendo… e esta?','Esta é um pouquinho menor.','Sem pressa: e esta?'],
      ok:['Isso!','Muito bem.','Ótimo.','Perfeito, próxima.','Você está indo bem.'],miuda:['Agora vem uma letra menor.','Esta é bem pequena. Consegue ler?'],bula:['Esta é letra de bula.','Última, a mais pequena.'],
      nao:['Tudo bem, é normal.','Sem problema — é para isso que servem as lentes.','Ótimo saber. Vou pegar uma lente.'],
      troca:['Vou testar uma um pouco mais forte.','Mais um passinho de grau…'],conf:['Agora uma mais fraca.','Só para ter certeza: e com esta?','Vou tirar mais um pouquinho.','Mais leve agora.','Vamos para uma mais suave.','Mais um passinho para baixo.'],
      cfm:['Só para confirmar: e esta outra?','Mais uma, para ter certeza.','E esta outra aqui?','Confirma para mim: e esta?','Agora esta, para conferir.'],
      demora:['Sem pressa.','Se estiver difícil, pode dizer que não consegue — sem problema.']},FU={};
    /* S167: rodízio — passa por todas as frases antes de repetir e nunca repete a do degrau anterior */
    var RB={};function roda(k,n){var b=RB[k];if(!b||!b.l.length){var l=[];for(var i=0;i<n;i++)l.push(i);for(i=l.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=l[i];l[i]=l[j];l[j]=x}if(b&&l.length>1&&l[0]===b.u){l.push(l.shift())}RB[k]=b={l:l,u:b?b.u:-1}}var r=b.l.shift();b.u=r;return r}
    /* só entram no rodízio as frases que têm a voz gravada (com a voz do Mochi ligada); sem voz gravada vale a lista toda */
    function temVoz(t){if(Z.vm!=='arq'||!VZ.m)return true;return t.split(/(?<=[.!?…])\s+/).every(function(x){return !!VZ.m[x.trim()]})||!!VZ.m[t]}
    function rodaDe(k,L){var ok=L.filter(temVoz);if(!ok.length)ok=L;var b=RB[k];if(b&&b.n!==ok.length){RB[k]=null}var r=ok[roda(k,ok.length)];RB[k].n=ok.length;return r}
    function frRoda(k){return rodaDe(k,FR[k].map(function(x){return T(x)}))}
    function fLenteD(g){return rodaDe('lente',[T('Com a lente')+' '+gf(g)+'. '+T('Consegue ler a última frase?'),T('Com a lente')+' '+gf(g)+'. '+T('E esta?'),T('Esta é')+' '+gf(g)+'. '+T('E agora?'),T('Agora com')+' '+gf(g)+'. '+T('Ainda consegue ler?')])}
    function sorteia(k){var a=FR[k],i;if(a.length<2)return T(a[0]);do{i=Math.floor(Math.random()*a.length)}while(i===FU[k]);FU[k]=i;return T(a[i])}
    /* ---------- quadro: 9 frases, tamanhos fixos ---------- */
    var BQ_PT=[["Bom dia!", "Boa tarde!", "Boa noite!", "Tudo bem?", "Bom café!", "Que calor!", "Até logo!", "Que bom!", "Volto já!", "Que frio!", "Parabéns!", "Boa sorte!"], ["A casa é azul.", "A porta é verde.", "O gato dorme.", "A sopa é boa.", "O mar é calmo.", "A rua é longa.", "O bolo é doce.", "A flor é rosa.", "O sol já saiu.", "A água é fria.", "O chá esfriou.", "A mesa é nova."], ["O café está pronto.", "O pão está quentinho.", "A chave está na mesa.", "Compre leite e pão.", "A janela está aberta.", "Feche bem a porta.", "O bolo saiu do forno.", "A loja está fechada.", "Hoje vai fazer sol.", "A roupa já secou.", "O almoço está bom.", "Traga o casaco hoje."], ["Ligue para a farmácia.", "Feche a janela da sala.", "A loja abre às nove.", "O gato dorme no sofá.", "Regue as plantas cedo.", "Leve a sacola de feira.", "Lave bem a fruta antes.", "Guarde em lugar seco.", "Apague a luz do quarto.", "Passe na padaria hoje.", "O pão chega bem cedo.", "Tire o lixo à noite."], ["O ônibus passa às oito.", "A feira começa cedinho.", "O vizinho trouxe bolo.", "A chuva molhou a roupa.", "O mercado fecha tarde.", "Esquente a sopa no fogo.", "O carteiro já passou.", "As flores abriram hoje.", "O filme começa às dez.", "A praça está cheia hoje.", "Deixe a chave com ela.", "O trem chegou na hora."], ["Leia a receita com calma.", "Guarde o troco na bolsa.", "Coloque o casaco na cama.", "A farmácia fica na esquina.", "Ponha mais água no feijão.", "O jantar fica pronto já.", "Leve o casaco de lã hoje.", "Compre frutas na quitanda.", "A reunião vai começar logo.", "Separe as roupas brancas.", "Lembre de tomar mais água.", "O bolo de milho esfriou."], ["O jornal fala do tempo.", "A novela começa tarde.", "O rádio toca uma música.", "A sala ficou bem limpa.", "O vento fechou a porta.", "A torta de limão acabou.", "O livro está na estante.", "A chuva parou à tarde.", "O café ficou bem forte.", "A janela dá para o mar.", "O banco abre mais cedo.", "Hoje o almoço é peixe."], ["Tome 1 comprimido ao dia.", "Use duas gotas à noite.", "Tome com um copo de água.", "Conservar em local fresco.", "Manter longe do sol forte.", "Tomar depois das refeições.", "Validade impressa na caixa.", "Aplicar duas vezes ao dia.", "Lavar as mãos antes do uso.", "Agite bem o frasco antes.", "Guardar fora do alcance.", "Uso adulto e pediátrico."], ["Agite antes de usar.", "Manter em local seco.", "Uso somente externo.", "Proteger da luz forte.", "Não congelar o frasco.", "Contém cinco cápsulas.", "Tampe após cada uso.", "Guarde na geladeira.", "Não use se violado.", "Diluir em pouca água.", "Tomar com alimentos.", "Leia a bula antes."]],BQ_ES=[["¡Buen día!", "¿Todo bien?", "¡Bienvenido!", "¡Qué calor!", "¡Nos vemos!", "¡Qué bueno!", "¡Ya vuelvo!", "¡Qué frío!", "¡Suerte!", "¡Buenas!", "¡Qué lindo!", "¡Adelante!"], ["La casa es azul.", "La puerta es roja.", "El gato duerme.", "La sopa está rica.", "El mar está calmo.", "La calle es larga.", "La torta es dulce.", "La flor es rosa.", "Ya salió el sol.", "El agua está fría.", "El té se enfrió.", "La mesa es nueva."], ["El café está listo.", "El pan está caliente.", "La llave está acá.", "Comprá leche y pan.", "Cerrá bien la puerta.", "La torta salió rica.", "El local ya cerró.", "Hoy va a hacer sol.", "La ropa ya se secó.", "La comida está rica.", "Traé el paraguas.", "El mate está listo."], ["Llamá a la farmacia.", "Cerrá la ventana ya.", "Abren a las nueve.", "El gato duerme acá.", "Regá las plantas hoy.", "Llevá la bolsa grande.", "Lavá bien la fruta.", "Guardar en lugar seco.", "Apagá la luz del baño.", "Pasá por la panadería.", "El pan llega temprano.", "Sacá la basura hoy."], ["El colectivo pasa a las ocho.", "La feria empieza muy temprano.", "El vecino trajo una torta rica.", "La lluvia mojó toda la ropa.", "El súper cierra muy tarde hoy.", "Calentá la sopa en el fuego.", "El cartero ya pasó por acá.", "Las flores se abrieron hoy.", "La película empieza a las diez.", "La plaza está llena de gente.", "Dejale la llave a tu vecina.", "El tren llegó justo a horario."], ["Leé la receta con calma.", "Poné el abrigo en la cama.", "La farmacia queda cerca.", "Poné más agua en la olla.", "La cena está casi lista.", "Llevá el paraguas hoy.", "Comprá fruta en la feria.", "La reunión empieza pronto.", "Separá la ropa blanca.", "Acordate de tomar agua.", "La chipa ya se enfrió.", "Cerrá la llave del gas."], ["El diario habla del clima.", "La novela empieza tarde.", "La radio pasa buena música.", "La sala quedó muy limpia.", "El viento cerró la puerta.", "Ya no hay torta de limón.", "El libro está en el estante.", "La lluvia paró a la tarde.", "El café quedó muy fuerte.", "La ventana da a la calle.", "El banco abre más temprano.", "Hoy almorzamos con pescado."], ["Tomar 1 comprimido al día.", "Usar dos gotas a la noche.", "Tomar con un vaso de agua.", "Conservar en lugar fresco.", "Mantener lejos del calor.", "Tomar luego de cada comida.", "Ver vencimiento en la caja.", "Aplicar dos veces al día.", "Lavarse las manos antes.", "Agitar bien antes del uso.", "Mantener fuera del alcance.", "Uso adulto y pediátrico."], ["Agitar antes de usar.", "Mantener en lugar seco.", "Solo para uso externo.", "Proteger de la luz.", "No congelar el frasco.", "Contiene diez cápsulas.", "Tapar después de usar.", "Guardar en la heladera.", "No usar si está roto.", "Diluir en poca agua.", "Tomar con alimentos.", "Leer antes de usar."]];
    var LZ_PT=["Oi!", "Sim.", "Paz.", "Bom!", "Até já!", "Bom dia!", "Boa viagem.", "Bom apetite.", "Tudo pronto.", "Água gelada.", "O bolo saiu.", "Leite fresco.", "O sol nasceu.", "Dia de chuva.", "A porta abriu.", "Feche a porta.", "Hoje tem feira.", "Café com leite.", "Leia com calma.", "Compre pão hoje.", "O ônibus atrasou.", "Ligue mais tarde.", "A sopa está quente.", "O gato dormiu cedo."],LZ_ES=["Sí.", "Paz.", "¡Hola!", "¡Qué bien!", "¡Buen día!", "Agua fría.", "¡Ya vuelvo!", "Buen viaje.", "Todo listo.", "Leche fresca.", "Salió el sol.", "Buen provecho.", "Día de lluvia.", "Hoy hay feria.", "Leé con calma.", "Salió la torta.", "Café con leche.", "Comprá pan hoy.", "Cerrá la puerta.", "Llamá más tarde.", "Se abrió la puerta.", "El colectivo tardó.", "La sopa está caliente.", "El gato durmió temprano."];
    /* S89 A: cada linha tem um banco de 12 frases do mesmo tamanho (± 2 letras); a cada consulta sorteia uma de cada (o Mochi não lê a frase) */
    var BQ=ES?BQ_ES:BQ_PT,LS=BQ.map(function(b){return b[0]}),QU=[];
    function sorteiaQuadro(){LS=BQ.map(function(b,i){var j,n=0;do{j=Math.floor(Math.random()*b.length)}while(j===QU[i]&&n++<9);QU[i]=j;return b[j]});Z.us8={};Z.us8[QU[8]]=1}
    /* na conferência com uma lente mais fraca, a última linha troca de frase (ninguém lê de memória) */
    /* S108-3: frase de bula que cabe inteira na lupa larga com a lente mais forte (+4.00) neste celular — nunca quebra, nunca é trocada */
    function bulaCabe(t){var s=Z.el&&q('#gzstg'),l=Z.el&&q('#gzl8');if(!s||!l||!L.k)return true;var cx=MED||(MED=document.createElement('canvas').getContext('2d'));
      cx.font=(FS[8]*escala(GS[GS.length-1][0])*kLetra())+'px '+getComputedStyle(l).fontFamily;return cx.measureText(t).width+10<=s.clientWidth-Math.round(64*L.k)-12-32-10}
    function trocaUltima(){var b=BQ[8],l=q('#gzl8 span'),livres=[];for(var i=0;i<b.length;i++)if(!Z.us8[i]&&bulaCabe(b[i]))livres.push(i);if(!livres.length){for(i=0;i<b.length;i++)if(bulaCabe(b[i]))livres.push(i)}if(!livres.length){Z.us8={};livres=b.map(function(_,i){return i})}var j=livres[Math.floor(Math.random()*livres.length)];Z.us8[j]=1;LS[8]=b[j];if(l)l.textContent=b[j]}
    /* 09/11: teste a 30 cm (antes 40): letras ×0,75 para continuarem do mesmo tamanho aos olhos */
    var FS=[22,19,16.5,14.5,12.6,11,9.6,8.4,7.3].map(function(x){return Math.round(x*75)/100});
    /* quem lê até a frase k (sem óculos, a 40 cm) costuma precisar deste grau; e o tamanho de letra equivalente a cada grau */
    var GK=[3,2.5,2,1.75,1.5,1.25,1,.75,0],GS=[[0,7.3],[.25,7.65],[.5,8],[.75,8.4],[1,9.6],[1.25,11],[1.5,12.6],[1.75,14.5],[2,16.5],[2.5,19],[3,22],[3.5,25.5],[4,29.5]];
    var CX=[];for(var gi=.25;gi<=4.001;gi+=.25)CX.push(Math.round(gi*100)/100);
    function escala(g){if(!g)return 1;for(var i=1;i<GS.length;i++){if(g<=GS[i][0]){var a=GS[i-1],b=GS[i];return (a[1]+(b[1]-a[1])*(g-a[0])/(b[0]-a[0]))/7.3}}return GS[GS.length-1][1]/7.3}
    function zoom(){var z=parseFloat(document.body.style.zoom)||1;return z}
    /* ---------- tela ---------- */
    function cam(){if(Z.tm){clearTimeout(Z.tm);Z.tm=0}if(Z.st){Z.st.getTracks().forEach(function(t){t.stop()});Z.st=null}}
    var INERT=[];
    function trava(on){if(on){INERT=[].slice.call(document.body.children).filter(function(e){return e!==Z.el&&!e.matches('.top,script,style,#drw,#sov,#layer,#dsh,#fsh')&&!e.hasAttribute('inert')});INERT.forEach(function(e){e.setAttribute('inert','')})}else{INERT.forEach(function(e){e.removeAttribute('inert')});INERT=[]}}
    function fecha(dePop){if(!Z.el)return;document.documentElement.classList.remove('gwLock');cam();clearTimeout(Z.tc);clearTimeout(Z.tq);clearTimeout(Z.ti);Z.fase='';FID++;Z.falando=false;Z.pend=null;Z.depoisFala=null;Z.vaiCom=1;if(MO)MO.disconnect();PZ.on=0;PZ.fila=[];PZ.a=null;try{speechSynthesis.cancel()}catch(_){}if(VZ.a)try{VZ.a.pause()}catch(_){}var e=Z.el;Z.el=null;Z.m=null;removeEventListener('resize',lay);document.documentElement.classList.remove('gzon');trava(false);
      var fim=function(){e.remove()};if(!RM.matches&&e.animate){var a=e.animate([{transform:'none'},{transform:'translateX(100%)'}],{duration:260,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});a.onfinish=fim}else fim();
      if(!dePop&&history.state&&history.state.lfo==='gw'){window.__lfGzBack=1;try{history.back()}catch(_){window.__lfGzBack=0}}}
    window.__lfGzFecha=function(){fecha(true)};
    /* S111: a consulta entra no registro de camadas (logo = sai direto para o início, opção A) */
    (window.__lfCamReg||function(c){(window.__lfCam=window.__lfCam||[]).push(c)})({id:'consulta',aberta:function(){return !!Z.el},fecha:function(){fecha(true)}});
    if(window.__lfPop)window.__lfPop.unshift(function(e){if(window.__lfGzBack){window.__lfGzBack=0;e.__lfStop=1;return}var st=e&&e.state;
      if(Z.el){if(st&&st.lfo==='gw')return;e.__lfStop=1;fecha(true);return}
      if(Z.velha&&st&&st.lfo==='gw'){Z.velha=0;e.__lfStop=1;try{history.back()}catch(_){}}});
    /* S90: menu, busca ou carrinho abertos por cima = consulta pausada; escolheu uma página = a consulta fecha */
    var MO=null;function sobre(){var d=$('drw'),o=$('sov'),ly=$('layer'),h=$('dsh');return !!((d&&d.classList.contains('on'))||(o&&o.classList.contains('on'))||(h&&h.classList.contains('on'))||(ly&&ly.innerHTML.trim()))}
    function pagina(){var ly=$('layer');var pg=ly&&ly.querySelector('.scrim.pg');return document.documentElement.classList.contains('ppop')||!!(pg&&!pg.querySelector('.cartp'))}
    function olhaSobre(){if(!Z.el)return;if(pagina()){Z.velha=1;fecha(true);return}pausa(sobre()||document.hidden)}
    /* S108-1: site em segundo plano (trocou de app, apagou a tela) = tudo pausado; voltou = continua de onde parou */
    document.addEventListener('visibilitychange',function(){if(Z.el)olhaSobre()});addEventListener('pagehide',function(){if(Z.el)pausa(true)});
    function vigia(){if(MO)MO.disconnect();try{MO=new MutationObserver(olhaSobre);['drw','sov','dsh'].forEach(function(id){var e=$(id);if(e)MO.observe(e,{attributes:true,attributeFilter:['class']})});var ly=$('layer');if(ly)MO.observe(ly,{childList:true});MO.observe(document.documentElement,{attributes:true,attributeFilter:['class']})}catch(_){}}
    /* S68: distorção "almofada" leve das lentes positivas (mais forte perto da borda) */
    var PIN='',PINa=0;function pinMapa(w,h){var a=(w&&h)?w/h:125/150;if(PIN&&Math.abs(a-PINa)<.02)return PIN;try{var CW=150,CH=Math.max(40,Math.round(150/a)),c=document.createElement('canvas');c.width=CW;c.height=CH;var x=c.getContext('2d'),d=x.createImageData(CW,CH);
      /* S114: o mapa acompanha a forma da lente — o vidro empurra a imagem o mesmo tanto para os lados e para cima/baixo (antes esticava mais na horizontal nas lentes largas) */
      for(var j=0;j<CH;j++)for(var i=0;i<CW;i++){var u=(i/(CW-1))*2-1,v=(j/(CH-1))*2-1,ux=u*a,k=(ux*ux+v*v)/(a*a+1),o=(j*CW+i)*4;d.data[o]=128+(ux/a)*k*127;d.data[o+1]=128+v*k*127;d.data[o+2]=128;d.data[o+3]=255}x.putImageData(d,0,0);PIN=c.toDataURL();PINa=a}catch(_){}return PIN}
    function abre(de){if(Z.el)return;try{vcConsulta()}catch(_){}DIT={};Z.ocup=0;Z.falando=false;Z.pend=null;Z.vm='';Z.t0=Date.now();Z.bloq=0;Z.ultT='';
      de=de||(window.__lfTela?window.__lfTela():T('Voltar'));try{if(!document.documentElement.classList.contains('ppop'))scrollTo({top:0,left:0,behavior:'instant'})}catch(_){}
      var e=Z.el=document.createElement('div');e.id='gw';document.documentElement.classList.add('gwLock');/* S257: com a Mochi aberta o fundo não rola */e.setAttribute('role','dialog');e.setAttribute('aria-label',T('Descubra o seu grau'));
      var z=zoom();e.style.zoom=z!==1?String(1/z):'';e.style.setProperty('--gz',z);
      e.innerHTML='<div class="gzhd"><button type="button" class="gzbk" data-gz="x">'+BK+'<span>'+esc(de)+'</span></button><span class="gzdi" id="gzdi" hidden></span><button type="button" class="gzmu" data-gz="mudo" aria-label="'+T('Som')+'">'+(mudo()?MUT:SPK)+'</button></div>'+
        '<div class="gzstg" id="gzstg"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="gzpin" filterUnits="objectBoundingBox" primitiveUnits="objectBoundingBox" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feImage id="gzpinm" result="m" preserveAspectRatio="none" x="0" y="0" width="1" height="1"/><feDisplacementMap in="SourceGraphic" in2="m" scale="-.02" xChannelSelector="R" yChannelSelector="G"/></filter></svg>'+
        '<div class="gzbal" id="gzbal"></div><div class="gzc" id="gzc"></div>'+
        '<div class="gzjan" id="gzjan" hidden><div class="gzfw" id="gzfw"><div class="gzfita" id="gzfita"></div></div></div><div class="gzfr" id="gzfr"><svg class="gzh" id="gzh" aria-hidden="true"></svg><div class="gzv"></div><div class="gza"></div><i id="gztag"></i></div>'+
        '<div class="gzbd" id="gzbd" aria-hidden="true">'+CX.map(function(g){return '<span class="gzmi" data-g="'+g+'"><small>'+gf(g)+'</small></span>'}).join('')+'</div><p class="gznt" id="gznt">'+T('A tela não muda o foco do olho; com cada lente, o quadro aparece do tamanho que você leria com ela.')+'</p>'+
        '<div class="gzbt" id="gzbt" hidden><button type="button" class="gzgo" data-gz="sim">'+T('Consigo ler')+'</button><button type="button" class="gzgo o" data-gz="nao">'+T('Não consigo')+'</button></div></div>';
      document.body.appendChild(e);document.documentElement.classList.add('gzon');trava(true);
      var pm=pinMapa();if(pm)$('gzpinm').setAttribute('href',pm);
      /* S56: entra já opaca, deslizando da direita (nunca transparente por cima da página) */
      var H5=document.documentElement,boot=H5.classList.contains('bootgz');
      if(!RM.matches&&e.animate)e.animate(boot?[{translate:'0 26px',filter:'opacity(0)'},{translate:'0 0',filter:'opacity(1)'}]:[{transform:'translateX(100%)'},{transform:'none'}],boot?{duration:440,easing:'cubic-bezier(.2,.8,.2,1)'}:{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});
      if(boot)requestAnimationFrame(function(){H5.classList.remove('bootgz')});
      try{history.pushState(Object.assign({},history.state||{},{lfo:'gw'}),'','/'+(ES?'descubri-tu-graduacion':'descubra-o-grau'))}catch(_){}
      PZ.on=0;PZ.tot=0;PZ.fila=[];Z.velha=0;vigia();
      Z.m=MOCHI($('gzstg'),0,0);Z.m.el.style.opacity=0;Z.m.onCanta=function(){cantarola()};addEventListener('resize',lay);intro()}
    function q(s){return Z.el&&Z.el.querySelector(s)}
    /* ---------- posições (recalculadas em qualquer tamanho de tela) ---------- */
    var L={};
    /* S70: lente com hastes de óculos (vinho/rosa, dobradiça rosinha, ponteira curvada), abertas para os lados */
    function hastes(w,h){return;/* S87b: lente sem hastes */var a=h*.22,s=document.getElementById('gzh');if(!s)return;s.setAttribute('width',w+68);s.setAttribute('height',h+20);s.setAttribute('viewBox','-34 0 '+(w+68)+' '+(h+20));s.style.left='-34px';s.style.top='0';
      s.innerHTML='<defs><linearGradient id="gzar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c46a9c"/><stop offset=".45" stop-color="#8d3a69"/><stop offset=".75" stop-color="#5e2347"/><stop offset="1" stop-color="#e7a6c7"/></linearGradient></defs>'+
        '<path d="M4 '+a+' C -12 '+(a+2)+' -22 '+(a+8)+' -26 '+(a+24)+' q -3 9 4 12" stroke="url(#gzar)" stroke-width="6" stroke-linecap="round" fill="none"/>'+
        '<path d="M'+(w-4)+' '+a+' C '+(w+12)+' '+(a+2)+' '+(w+22)+' '+(a+8)+' '+(w+26)+' '+(a+24)+' q 3 9 -4 12" stroke="url(#gzar)" stroke-width="6" stroke-linecap="round" fill="none"/>'+
        '<circle cx="4" cy="'+a+'" r="4" fill="#e7a6c7"/><circle cx="'+(w-4)+'" cy="'+a+'" r="4" fill="#e7a6c7"/>'}
    function lay(){if(!Z.el)return;var s=q('#gzstg'),W=s.clientWidth,H=Math.max(380,Z.el.clientHeight-q('.gzhd').offsetHeight-4);s.style.height=H+'px';
      var k=W<350?.74:W<400?.86:.95;L.k=k;var me=Z.m&&Z.m.el;if(me){me.style.width=(132*k)+'px';me.style.height=(110*k)+'px'}
      var teste=!q('#gzjan').hidden,bal=q('#gzbal');s.style.height=teste?H+'px':'';s.style.minHeight=H+'px';
      if(teste){bal.style.left='10px';bal.style.right=(120*k+8)+'px'}else if(Z.dir){bal.style.left='10px';bal.style.right='10px'}else{bal.style.left=(124*k)+'px';bal.style.right='10px'}
      var bh=Math.max(64,bal.offsetHeight);L.top=bh+22+(Z.lupa?16:0);/* o desenho do Mochi (pezinhos, sombra, bracinhos) passa um pouco da caixa: reserva a altura inteira + folga para nunca encostar no texto *//* S107: chapéu do tema passa da cabeça: o Mochi da entrada desce o tanto do chapéu (nunca cobre o Início) */var ev=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'');L.hx=({natal:14,halloween:42,bf:23,anonovo:18,maes:2,pais:5}[ev]||0)*k;q('#gzc').style.paddingTop=(Math.max(6+122*k+L.hx,bh+6)+10)+'px';
      /* S70: ponteiro com cabo maior → a faixa do Mochi à esquerda do quadro fica um pouco mais larga */
      L.wl=Math.round(173*k+6);L.ww=W-L.wl-18;if(Z.lupa){L.wl=Math.round(64*k);L.ww=W-L.wl-12}var bt=q('#gzbt'),bth=bt.offsetHeight||124,nt0=q('#gznt');nt0.style.width=L.ww+'px';L.gap=Math.max(Math.round((H<520?92:108)*k),16+30+6+nt0.offsetHeight+10);
      L.wh=Math.max(150,Math.min(330,H-L.top-bth-L.gap-14));var j=q('#gzjan');j.style.left=L.wl+'px';j.style.top=L.top+'px';j.style.width=L.ww+'px';j.style.height=L.wh+'px';
      bt.style.top=(L.top+L.wh+(Z.fase==='pp'?24:L.gap))+'px';
      var fr=q('#gzfr');fr.style.left=(L.wl-8)+'px';fr.style.top=(L.top-8)+'px';fr.style.width=(L.ww+16)+'px';fr.style.height=(L.wh+16)+'px';hastes(L.ww+16,L.wh+16);
      /* S114: canto do aro proporcional ao tamanho da lente (antes 74 px fixos: na tela baixa a lente virava pílula) */var rr=Math.round(Math.min(L.ww+16,L.wh+16)*.22);fr.style.borderRadius=rr+'px';fr.querySelectorAll('.gza').forEach(function(e){e.style.borderRadius=rr+'px'});fr.querySelectorAll('.gzv').forEach(function(e){e.style.borderRadius=Math.max(0,rr-9)+'px'});var pm2=pinMapa(L.ww,L.wh);if(pm2&&$('gzpinm'))$('gzpinm').setAttribute('href',pm2);
      var bd=q('#gzbd'),nt=q('#gznt');bd.style.left=L.wl+'px';bd.style.width=L.ww+'px';bd.style.setProperty('--mi',Math.max(6,Math.min(11,Math.floor((L.ww-16)/CX.length-3)))+'px');bd.style.top=(L.top+L.wh+16)+'px';nt.style.left=L.wl+'px';nt.style.width=L.ww+'px';nt.style.top=(L.top+L.wh+16+32)+'px';
      L.mid=L.top+L.wh/2;
      L.Z={ponto:[L.wl+14-199*k,L.mid-70*k],z1:[W-118*k-4,L.top-101*k+5+L.hx],z3:[Math.max(L.wl,W/2-66*k),L.top+L.wh+8+(L.gap-8-110*k)/2],z4:[L.wl+L.ww*.5,L.top-46*k],intro:[2,6+L.hx]};
      centra(true)}
    function vaiA(z,modo,cb){var m=Z.m,p=L.Z[z];if(!m||!p)return;m.el.style.zIndex=z==='z4'?2:6;Z.longe=z!=='ponto'&&Z.fase==='teste';
      if(RM.matches||modo==='ja'){m.pos(p[0],p[1]);cb&&cb();return}
      if(modo==='puff'){teleporta(p,cb);return}if(modo==='rola'){rola(p,cb);return}
      m.pula(p[0],p[1],700,Math.max(30,Math.abs(p[1]-m.y)*.3),cb)}
    function puff(cx,cy){var s=q('#gzstg');if(!s)return;for(var i=0;i<12;i++){var p=document.createElement('div');p.className='gzpuff';var r=12+Math.random()*16,a=i/12*Math.PI*2;p.style.cssText='left:'+(cx-r/2)+'px;top:'+(cy-r/2)+'px;width:'+r+'px;height:'+r+'px';s.appendChild(p);
      (function(p,a){var an=p.animate([{transform:'translate(0,0) scale(.3)',opacity:.95},{transform:'translate('+Math.cos(a)*52+'px,'+Math.sin(a)*42+'px) scale(1.3)',opacity:0}],{duration:700,easing:'cubic-bezier(.2,.8,.3,1)'});an.onfinish=function(){p.remove()}})(p,a)}}
    function centro(){var m=Z.m;return [m.x+66*L.k,m.y+60*L.k]}
    function teleporta(p,cb){var m=Z.m,c=centro();puff(c[0],c[1]);m.el.animate([{opacity:1},{opacity:0}],{duration:150,fill:'forwards'});
      setTimeout(function(){if(!Z.m)return;m.pos(p[0],p[1]);var d=centro();puff(d[0],d[1]);m.el.animate([{opacity:0},{opacity:1}],{duration:200,fill:'forwards'});m.amassa(.7,1.25);setTimeout(function(){m.amassa(1.12,.88)},130);setTimeout(function(){m.amassa(1,1)},280);cb&&cb()},260)}
    function rola(p,cb){var m=Z.m,x0=m.x,y0=m.y,t0=performance.now(),dir=p[0]>x0?1:-1,dur=850;
      var f=function(n){if(!Z.m)return;var k=Math.min(1,(n-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;m.pos(x0+(p[0]-x0)*e,y0+(p[1]-y0)*e-Math.sin(Math.PI*k)*14);m.rot=dir*360*e;
        if(k<1)requestAnimationFrame(f);else{m.rot=null;m.amassa(1.12,.88);setTimeout(function(){m.amassa(1,1)},180);cb&&cb()}};requestAnimationFrame(f)}
    function cantarola(){var s=q('#gzstg'),c=centro();if(!s||!Z.m)return;['♪','♫','♪'].forEach(function(x,i){setTimeout(function(){if(!Z.el)return;var n=document.createElement('div');n.className='gznota';n.textContent=x;n.style.left=(c[0]+10+i*8)+'px';n.style.top=(c[1]-50*L.k)+'px';s.appendChild(n);
      var an=n.animate([{transform:'translate(0,0)',opacity:0},{transform:'translate(6px,-14px)',opacity:1,offset:.3},{transform:'translate(-4px,-40px)',opacity:0}],{duration:1400,easing:'ease-out'});an.onfinish=function(){n.remove()}},i*350)});Z.m.gesto('pezinhos');Z.m.inclina(6);setTimeout(function(){Z.m&&Z.m.inclina(-6)},400);setTimeout(function(){Z.m&&Z.m.inclina(0)},800)}
    /* ---------- quadro ---------- */
    /* S101: o quadro mostra 3 frases por vez (em cima, no meio e embaixo); a cada 3 ele puxa o quadro. S96: letra fixa (só a lente muda o tamanho).
       S97: com lente, só a frase testada aparece, no tamanho exato da lente, e nunca quebra (se não cabe, troca por uma frase mais curta — o tamanho não muda). */
    var SLOT=[.2,.5,.8],LZ=ES?LZ_ES:LZ_PT;
    function pag(i){return Math.floor(i/3)}
    function yLin(i){var s=(Z.g&&i===Z.at&&Z.slot!=null)?Z.slot:i%3;return pag(i)*L.wh+SLOT[s]*L.wh}
    function monta(){var f=q('#gzfita');Z.lzU={};f.innerHTML=LS.map(function(t,i){return '<div class="gzl p3" id="gzl'+i+'"><b aria-hidden="true">✓</b><span>'+esc(t)+'</span></div>'}).join('');lente(0,true)}
    function posLin(){for(var i=0;i<LS.length;i++){var l=q('#gzl'+i);if(l)l.style.top=yLin(i)+'px'}}
    /* a frase testada cabe numa linha só? se não, a mais longa da lupa que caiba (sem repetir) */
    function cabe(i){var l=q('#gzl'+i),f=q('#gzfita');if(!l||!f)return;var sp=l.querySelector('span'),lim=f.clientWidth-10;
      if(!Z.g){if(sp.textContent!==LS[i])sp.textContent=LS[i];return}
      /* mede no tamanho final (a letra ainda está crescendo na animação): largura do texto + o respiro da faixa */
      var cx=MED||(MED=document.createElement('canvas').getContext('2d')),fs=parseFloat(l.style.fontSize)||16;cx.font=fs+'px '+getComputedStyle(l).fontFamily;var lg=function(t){return cx.measureText(t).width+10};
      if(lg(LS[i])<=lim){sp.textContent=LS[i];return}
      var us=Z.lzU||(Z.lzU={}),ok=null,k;for(k=LZ.length-1;k>=0;k--){if(!us[LZ[k]]&&lg(LZ[k])<=lim){ok=LZ[k];break}}
      if(!ok){for(k=LZ.length-1;k>=0;k--){if(lg(LZ[k])<=lim){ok=LZ[k];break}}}if(!ok)ok=LZ[0];us[ok]=1;sp.textContent=ok}
    var MED=null;
    function lente(g,ja){Z.g=g;var e=escala(g);LS.forEach(function(t,i){var l=q('#gzl'+i);if(l)l.style.fontSize=(FS[i]*e*kLetra())+'px'});cabe(Z.at);var fr=q('#gzfr'),tg=q('#gztag');
      if(g){fr.classList.add('on');tg.textContent=gf(g);if(!ja&&tg.animate)tg.animate([{transform:'translateX(-50%) scale(1.35)'},{transform:'translateX(-50%) scale(1)'}],{duration:320,easing:'cubic-bezier(.3,1.8,.5,1)'})}else fr.classList.remove('on');
      q('#gzfw').classList.toggle('pin',!!g);centra(ja);
      /* a letra cresce em 0,6 s: no fim ele confere a mira (sem toquinho) */
      if(!ja)setTimeout(function(){var m=Z.m,p;if(m&&(Z.fase==='teste'||Z.fase==='pp')&&m.ponOn&&!Z.longe&&(p=alvo()))m.mira(p[0],p[1],RM.matches?0:250)},650)}
    function centra(ja){var f=q('#gzfita');if(!f||!q('#gzl'+Z.at))return;f.style.height=(3*L.wh)+'px';if(ja)f.style.transition='none';posLin();f.style.top=(-pag(Z.at)*L.wh)+'px';if(ja){void f.offsetTop;f.style.transition=''}
      for(var i=0;i<LS.length;i++){var x=q('#gzl'+i);if(!x)continue;x.classList.toggle('hl',i===Z.at);x.classList.toggle('dim',i!==Z.at);x.classList.toggle('lzoff',!!Z.g&&i!==Z.at)}
      if(ja&&(Z.fase==='teste'||Z.fase==='pp')&&Z.m&&!Z.longe&&!Z.troca&&Z.m.ponOn)mira(true)}
    /* ponta do dedo: 5 px antes da 1ª letra, na altura do meio das letras (o Mochi fica parado no lugar de sempre) */
    function alvo(){var l=q('#gzl'+Z.at),sp=l&&l.querySelector('span'),j=q('#gzjan');if(!sp)return null;var k=L.k,pt=L.Z.ponto;
      var tx=L.wl+1+24+l.offsetLeft+sp.offsetLeft-5,ty=L.top+1+yLin(Z.at)-pag(Z.at)*L.wh-l.offsetHeight/2+sp.offsetTop+sp.offsetHeight*.55;
      var ux=(tx-pt[0])/k-6,uy=(ty-pt[1])/k+24,Dx=ux-98,Dy=uy-92,r=Math.sqrt(Math.max(1,Dx*Dx+Dy*Dy-3.2*3.2)),a=(Math.atan2(Dy,Dx)-Math.atan2(-3.2,r))*180/Math.PI;return [a,Math.max(0,r-60.7)]}
    function pontoLupa(){var k=L.k,ty=L.top+1+yLin(Z.at)-pag(Z.at)*L.wh;L.Z.ponto=[-42*k,ty-58*k-3];if(Z.m)Z.m.el.style.zIndex=7}
    function mira(ja){if(Z.lupa)pontoLupa();var m=Z.m,p=alvo();if(!m||!p)return;m.vara(1);m.bracos(-35,null);m.mira(p[0],p[1],ja||RM.matches?0:380);if(!ja)setTimeout(function(){Z.m&&Z.m.toca()},430)}
    function aponta(){var m=Z.m;if(!m)return;if(m.gestoUsa('d'))m.paraGesto();if(Z.lupa){pontoLupa();var p=L.Z.ponto;if(Math.abs(m.x-p[0])>2||Math.abs(m.y-p[1])>2){m.flutua(p[0],p[1],480,function(){mira(false)});return}}mira(false)}
    /* S66: o quadro sobe na hora do toque; a cada 3 frases o Mochi puxa o quadro */
    function puxa(){var m=Z.m;Z.at++;Z.slot=null;cabe(Z.at);var nova=Z.at%3===0;centra();if(!m)return;if(nova){m.gesto('puxa');m.espelho(.5)}}
    /* ---------- passos ---------- */
    function modo(teste){q('#gzc').hidden=teste;q('#gzjan').hidden=!teste;q('#gzbt').hidden=!teste;q('#gzbal').classList.toggle('t',!!teste);if(!teste){q('#gzfr').classList.remove('on');bandeja(false)}lay()}
    function conteudo(h){var c=q('#gzc');c.innerHTML=h;if(!RM.matches&&c.animate)c.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'})}
    function entra(){var m=Z.m;vaiA('intro','ja');m.el.style.opacity=1;var c=centro();if(!RM.matches){puff(c[0],c[1]);m.gesto('estoura')}m.cara('f');setTimeout(function(){Z.m&&Z.m.espelho()},520)}
    /* S90/S91: ele se apresenta; o cartão estreita, ele pula para a direita dele, vira e aponta cada regra com o ponteiro enquanto explica; depois chama o Começar (o botão pulsa 2x).
       Começar funciona desde o início (se ele estiver falando, termina a frase e segue). */
    function intro(){if(CAMT)wkCedo();Z.pc=ehPc();Z.kb=kbAparelho();Z.kd=1;Z.fase='intro';Z.vaiCom=0;Z.dir=0;Z.depoisFala=null;cam();modo(false);var m=Z.m;m.modo='livre';m.vira(1);
      conteudo('<div class="gzeb">'+T('DESCUBRA O SEU GRAU')+'</div><h2>'+T('Descubra o grau do seu óculos de leitura em 1 minuto')+'</h2>'+
        '<div class="gzav gzrv" id="gzav"><p data-r="0">'+T('Serve só para ler de perto.')+'</p><p data-r="1"><b>'+T('Não funciona')+'</b> '+T('para miopia, astigmatismo ou multifocal.')+'</p><p class="mu" data-r="2">'+T('Não substitui a consulta.')+'</p></div>'+
        '<button type="button" class="gzgo" data-gz="comeca" id="gzcom">'+T('Começar')+'</button>');
      qrPc();
      setTimeout(function(){if(!Z.m)return;entra();setTimeout(function(){Z.m&&Z.m.acena()},RM.matches?0:950);
        fala(T('Oi! Eu sou Mochi.')+' '+T('Vou te ajudar a achar o grau do seu óculos de leitura.'),function(){if(!Z.m||Z.fase!=='intro'||Z.vaiCom)return;Z.m.cara('n');Z.ti=setTimeout(aviso,450)})},360)}
    /* S238 (14/11, aprovado): no computador (mouse, 900 px ou mais) a tela de entrada mostra um cartão com código QR — o teste sai melhor no celular, mas dá para seguir aqui */
    function ehPc(){try{return matchMedia('(hover:hover) and (pointer:fine)').matches&&innerWidth>=900}catch(_){return false}}
    function qrPc(){if(!ehPc())return;var b=q('#gzcom');if(!b||q('.lxqr'))return;
      var d=document.createElement('div');d.className='lxqr';d.innerHTML='<span class="t"><b>'+T('Melhor no celular')+'</b><small>'+T('Aponte a câmera do celular para este código e continue lá.')+'</small><small class="m2">'+T('Ou toque em Começar para fazer neste computador.')+'</small></span><span class="q" aria-hidden="true"></span>';
      b.insertAdjacentElement('afterend',d);
      var poe=function(){var e=d.querySelector('.q');if(!e||!window.LFqr){d.remove();return}e.innerHTML=window.LFqr.svg(location.href.split('#')[0]);if(RM.matches||mudo())d.classList.add('on');else setTimeout(function(){d.classList.add('on')},60000)};
      if(window.LFqr){poe();return}var sc=document.createElement('script');sc.src='lfx/qr.js';sc.onload=poe;sc.onerror=function(){d.remove()};document.head.appendChild(sc)}
    /* S369 (16/11, aprovado em 13/11): no computador o teste é a 60 cm ("um braço"), com a letra na proporção da distância (60 cm = 2x a de 30 cm; com webcam vale de 45 a 75 cm),
       sem a segunda medida, e o resultado é mostrado como estimativa. kb = reconhecimento silencioso do iPhone/iPad (tamanho real do ponto da tela; os outros aparelhos usam o valor médio). */
    function kbAparelho(){try{var u=navigator.userAgent,ip=/iPhone|iPod/.test(u),pad=/iPad/.test(u)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);if(!ip&&!pad)return 1;
      var w=Math.min(screen.width,screen.height),mm=ip?((window.devicePixelRatio||2)>=3?.166:.156):(w===744?.156:.192);return Math.min(1.25,Math.max(1,.188/mm))}catch(_){return 1}}
    function kLetra(){return (Z.kd||1)*(Z.kb||1)}
    function dLo(){return Z.pc?45:20}function dHi(){return Z.pc?75:38}
    function chipDist(){return T(Z.pc?'Fique a 60 cm':'Segure a 30 cm')}
    function falaSeq(a,cb){var i=0,fase=Z.fase;(function w(){if(!Z.m||Z.fase!==fase)return;if(i>=a.length){cb&&cb();return}fala(a[i++],w)})()}
    function distOk(){return Z.d>=dLo()&&Z.d<=dHi()}
    function ajustaDist(cb){if(!Z.pc||Z.semCam||!Z.st||!Z.d||Date.now()-(Z.rosto||0)>1500||distOk()){cb();return}
      fala(T(Z.d>dHi()?'Chegue um pouquinho mais perto da tela.':'Afaste-se um pouquinho da tela.'),function(){var t0=Date.now();(function w(){if(!Z.m||Z.fase!=='prep')return;if(distOk()||Date.now()-t0>5000){cb();return}Z.tc=setTimeout(w,250)})()})}
    /* S370: o analisador de volume (para a boca) só existe depois de um toque da pessoa e só é usado se estiver rodando */
    function acToca(){try{var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;window.__lfAc=window.__lfAc||new AC();if(window.__lfAc.state==='suspended')window.__lfAc.resume()}catch(_){}}
    function naIntro(){return !!(Z.m&&Z.fase==='intro'&&!Z.vaiCom)}
    /* ponta do dedo do ponteiro em relação ao canto do Mochi (px), com ele virado para a esquerda: braço no ângulo a (graus), haste com len */
    function ponta(a,len){var k=L.k,r=60.7+len,c=Math.cos(a*Math.PI/180),n=Math.sin(a*Math.PI/180),u=98+r*c+3.2*n,v=92+r*n-3.2*c;return [(120-u+6)*k,(v-24)*k]}
    var AR=-15,AL=3;/* braço um pouco para cima, haste curtinha: a ponta para na borda do cartão, sem cobrir o texto */
    function regra(i){var av=q('#gzav');if(!av)return;[].forEach.call(av.querySelectorAll('[data-r]'),function(p){p.classList.toggle('gzrl',+p.getAttribute('data-r')===i)})}
    function alvoRegra(i){var m=Z.m,s=q('#gzstg'),p=q('#gzav [data-r="'+i+'"]');if(!p)return m.y;var S=s.getBoundingClientRect(),R=p.getBoundingClientRect(),lh=parseFloat(getComputedStyle(p).lineHeight)||22;
      return R.top-S.top+Math.min(R.height,lh)/2-ponta(AR,AL)[1]}
    function aviso(){var m=Z.m,av=q('#gzav'),s=q('#gzstg');if(!naIntro()||!av)return;m.ocioso=false;m.paraGesto();m.modo='trab';
      var k=L.k,W=s.clientWidth,S=s.getBoundingClientRect(),r0=av.getBoundingClientRect(),mx=W-6-123*k,/* 123 = do canto do Mochi até a ponta do bracinho de fora, virado */cr=mx+ponta(AR,AL)[0]-4;/* cr = borda direita do cartão: a ponta do dedo para 4 px depois dela */var N=Math.max(0,Math.round(r0.right-S.left-cr));
      Z.dir=1;av.style.marginRight=N+'px';av.classList.add('gzbr');lay();
      var s1=T('Antes, um aviso importante: este teste é só para óculos de leitura.'),s2=T('Não serve para miopia, astigmatismo nem multifocal, e não substitui o oftalmologista.'),tudo=s1+' '+s2;
      var explica=function(){if(!naIntro())return;regra(0);m.toca();
        fala(tudo,function(){if(!naIntro())return;var est=Math.min(7000,700+s2.length*62);
          setTimeout(function(){if(!naIntro())return;m.flutua(m.x,alvoRegra(1),420,function(){naIntro()&&m.toca()})},RM.matches?0:120);regra(1);
          fala(tudo,function(){if(!naIntro())return;regra(-1);av.classList.remove('gzbr');Z.ti=setTimeout(chamaComecar,350)},false,s2);
          aoChegar(.6,est,function(){regra(2);m.flutua(m.x,alvoRegra(2),420,function(){naIntro()&&m.toca()})},naIntro)},false,s1)};
      if(RM.matches){m.vira(-1);m.pos(mx,alvoRegra(0));m.vara(1);m.bracos(-80,AR);m.estica(AL,0,true);explica();return}
      m.olha(1,0);m.bracos(-80,null);m.pula(mx,r0.top-S.top+14-ponta(AR,AL)[1],760,48,function(){if(!naIntro())return;m.vara(1);m.bracos(-80,AR);m.estica(AL,300,true);m.olha(1,0);
        setTimeout(function(){if(!naIntro())return;m.flutua(mx,alvoRegra(0),380,explica)},320)});
      setTimeout(function(){naIntro()&&m.vira(-1)},RM.matches?0:480)}
    function qrVai(volta){var m=Z.m,c=q('.lxqr'),qe=c&&c.querySelector('.q svg')?c.querySelector('.q'):null;if(!naIntro()||!qe||RM.matches){if(c)c.classList.add('on');volta();return}
      var x0=m.x,y0=m.y,e=m.el.getBoundingClientRect(),C=c.getBoundingClientRect(),Q=qe.getBoundingClientRect(),nx=x0+(C.right+14-e.left),ny=y0+(Q.top+Q.height/2-e.height*.55-e.top);
      if(C.right+14+e.width>innerWidth-4||Q.bottom>innerHeight){c.classList.add('on');volta();return}
      var regressa=function(){if(!naIntro())return;fala(T('…ou seguimos aqui, como preferir.'));m.vara(0);m.pula(x0,y0,760,70,function(){if(!naIntro())return;m.vara(1);Z.ti=setTimeout(function(){var w=function(){if(!naIntro())return;if(Z.falando){Z.ti=setTimeout(w,300);return}volta()};w()},350)})};
      fala(T('Este teste fica melhor no celular.'),function(){if(!naIntro())return;fala(T('Aponte a câmera para este código…'),function(){Z.ti=setTimeout(regressa,500)});setTimeout(function(){naIntro()&&m.toca()},500)});
      Z.ti=setTimeout(function(){if(!naIntro())return;m.vara(0);m.pula(nx,ny,760,70,function(){if(!naIntro())return;m.vara(1);m.mira(18,34,420);m.olhaPara(Q.left+Q.width/2,Q.top+Q.height/2);
        setTimeout(function(){if(!naIntro())return;var g=m.el.querySelector('.luva');if(!g)return;var G=g.getBoundingClientRect(),Q2=qe.getBoundingClientRect(),ex=Q2.right-10-(G.left+G.width/2),ey=Q2.top+Q2.height/2-(G.top+G.height/2);if(Math.abs(ex)+Math.abs(ey)>2)m.flutua(m.x+ex,m.y+ey,220)},520)});
        setTimeout(function(){c.classList.add('on')},420)},500)}
    function chamaComecar(ja){var m=Z.m,b=q('#gzcom'),s=q('#gzstg');if(!naIntro()||!b)return;if(Z.falando){Z.ti=setTimeout(function(){chamaComecar(ja)},400);return}
      if(Z.pc&&!ja&&q('.lxqr')){qrVai(function(){chamaComecar(1)});return}
      var S=s.getBoundingClientRect(),br=b.getBoundingClientRect(),AB=55,p=ponta(AB,0);
      var fim=function(){if(!naIntro())return;m.olhaPara(br.left+br.width*.7,br.top);
        if(!RM.matches&&b.animate)b.animate([{boxShadow:'0 0 0 0 #8d3a6900',transform:'scale(1)'},{boxShadow:'0 0 0 9px #8d3a6930',transform:'scale(1.03)'},{boxShadow:'0 0 0 0 #8d3a6900',transform:'scale(1)'}],{duration:700,iterations:2,easing:'ease-in-out'});
        fala(T('Quando quiser, é só tocar em Começar.'),function(){setTimeout(function(){if(!naIntro())return;m.estica(0,300,true);setTimeout(function(){if(!naIntro())return;m.vara(0);m.bracos(-35,40);m.modo='livre';m.ocioso=true},320)},600)})};
      m.bracos(null,AB);m.estica(0,250,true);m.flutua(m.x,br.top-S.top-p[1]-3,520,fim)}
    /* Começar: ele termina a frase (se estiver falando), desvira, guarda o ponteiro e segue para a câmera */
    function comeca(bt){if(Z.fase==='intro'){if(Z.vaiCom)return;Z.vaiCom=1;clearTimeout(Z.ti)}corta();camera()}
    /* ---------- S90: câmera só com a resposta da pessoa ---------- */
    function camera(){clearTimeout(Z.ti);var m=Z.m;if(!m)return;Z.pc=ehPc();Z.kb=kbAparelho();Z.fase='cam';Z.dir=0;Z.semCam=0;Z.escolheu=0;m.paraGesto();m.ocioso=false;m.para();if(m.ponOn&&!RM.matches){m.estica(0,180,true);setTimeout(function(){Z.m&&Z.fase!=='intro'&&Z.m.vara(0)},200)}else m.vara(0);m.bracos(-35,40);m.vira(1);m.cara('n');m.modo='livre';regra(-1);
      var c=q('#gzc');c.style.paddingBottom='';try{Z.el.scrollTo({top:0,behavior:RM.matches?'auto':'smooth'})}catch(_){Z.el.scrollTop=0}
      vaiA('intro',RM.matches?'ja':'pula');lay();
      if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){semCam();return}
      var pq;try{pq=navigator.permissions.query({name:'camera'}).then(function(r){return r.state},function(){return 'prompt'})}catch(_){pq=Promise.resolve('prompt')}
      /* S238: se o aparelho não tem nenhuma câmera, não pergunta — segue direto sem câmera */
      var tc;try{tc=navigator.mediaDevices.enumerateDevices().then(function(d){return d.some(function(x){return x.kind==='videoinput'})},function(){return true})}catch(_){tc=Promise.resolve(true)}
      Promise.all([pq,tc]).then(function(rr){var st=rr[0];if(!Z.el||Z.fase!=='cam')return;if(st==='granted'){prep();return}if(st==='denied'||!rr[1]){semCam();return}
        conteudo('<div class="gzav gzcam"><p><b>📷 '+T('Câmera só para medir a distância')+'</b></p><p class="mu">'+T('Nada é gravado nem enviado.')+'</p></div>'+
          '<button type="button" class="gzgo" data-gz="camsim">'+T('Usar a câmera')+'</button><button type="button" class="gzgo o" data-gz="camnao">'+T('Fazer sem câmera')+'</button>');
        var fimC=function(){if(Z.m&&Z.fase==='cam'&&!Z.escolheu)Z.m.ocioso=true};if(Z.pc)falaSeq([T('Posso usar a câmera?'),T('É só para medir a distância da tela até o seu rosto.'),T('Nada é gravado.')+' '+T('Se preferir, a gente faz sem.')],fimC);else fala(T('Posso usar a câmera?')+' '+T('É só para medir a distância do celular até o seu rosto.')+' '+T('Nada é gravado.')+' '+T('Se preferir, a gente faz sem.'),fimC)})}
    /* a janelinha do celular só aparece aqui; enquanto ela está aberta ele espera, calado */
    function camSim(){if(Z.fase!=='cam')return;Z.fase='camw';var m=Z.m;m.ocioso=false;m.paraGesto();fala(T('É só tocar em "Permitir" na janelinha.'));
      abreCam().then(function(st){if(!Z.el||Z.fase!=='camw'){st.getTracks().forEach(function(t){t.stop()});return}liga(st);corta();prep(T('Obrigado!'))},
        function(){if(!Z.el||Z.fase!=='camw')return;corta();semCam()})}
    function semCam(){if(!Z.el)return;Z.semCam=1;cam();chip(chipDist());prep(Z.pc?[T('Tudo bem, sem problema!'),T('Vamos sem a câmera: fique a um braço da tela, uns 60 centímetros.')]:T('Tudo bem, sem problema!')+' '+T('Vamos sem a câmera: segure o celular a uns 30 centímetros, um palmo.'))}
    function prep(pre){clearTimeout(Z.ti);Z.fase='prep';Z.dir=0;try{Z.el.scrollTo({top:0,behavior:RM.matches?'auto':'smooth'})}catch(_){Z.el.scrollTop=0}medir();var m=Z.m;m.paraGesto();m.ocioso=false;m.cara('n');q('#gzc').style.paddingBottom='';
      conteudo('<div class="gzeb">'+T('PREPARANDO')+'</div><h2>'+T(Z.pc?'Tire os óculos e fique a 60 cm da tela':'Tire os óculos e segure o celular a 30 cm')+'</h2><p class="gzp">'+T(Z.pc?'Um braço até a tela. Lente de contato pode ficar.':'Um palmo do rosto. Lente de contato pode ficar.')+'</p>');
      vaiA('intro',RM.matches?'ja':'pula');
      var ini=function(){if(!Z.m||Z.fase!=='prep')return;fala(T('Faz como eu: tire os óculos…'),function(){Z.p2=1;Z.segP&&Z.segP()});setTimeout(function(){Z.m&&Z.fase==='prep'&&Z.m.gesto('tiraOculos')},700);
        Z.tc=setTimeout(function(){Z.p1=1;seg()},2500)};if(pre&&pre.pop)falaSeq(pre,ini);else if(pre)fala(pre,ini);else ini();var seg=function(){if(!Z.m||Z.fase!=='prep'||!Z.p1||!Z.p2)return;Z.p1=Z.p2=0;m.oculosPulo(-1.5);m.pisca();fala(T(Z.pc?'…e fique a 60 centímetros da tela, um braço.':'…e segure o celular a 30 centímetros, um palmo.'),function(){ajustaDist(function(){Z.tc=setTimeout(teste,700)})})};Z.p1=Z.p2=0;Z.segP=seg}
    function teste(){if(!Z.el)return;Z.kd=Z.pc?Math.min(75,Math.max(45,(Z.st&&Z.d&&Date.now()-(Z.rosto||0)<3000)?Z.d:60))/30:1;Z.el.scrollTop=0;Z.fase='teste';Z.at=0;Z.g=0;Z.falhou={};Z.leu={};Z.okLente=0;Z.desce=0;Z.us={};Z.fora=0;Z.ppRep=0;Z.slot=null;Z.ok2=0;Z.ko2=0;Z.bracoDisse=0;Z.luzP=0;Z.lzT=0;Z.lzE=0;sorteiaQuadro();botoes('t');modo(true);monta();try{if(!bulaCabe(LS[8]))trocaUltima()}catch(_){}Z.m.modo='trab';
      vaiA('ponto','pula',function(){aponta();luz(function(){pergunta(true)})})}
    /* botões embaixo do quadro: t = teste, luz = pouca luz, pp = ponto próximo */
    function botoes(k){var b=q('#gzbt');if(!b)return;var A={t:[['sim','Consigo ler'],['nao','Não consigo']],luz:[['luzok','Já melhorou'],['luzseg','Continuar assim']],pp:[['emb','Embaçou']]/* S400 (17/11, esboços 56a/56b): um botão só */}[k];
      b.innerHTML=A.map(function(x,i){return '<button type="button" class="gzgo'+(i?' o':'')+'" data-gz="'+x[0]+'">'+T(x[1])+'</button>'}).join('');if(!q('#gzjan').hidden)lay()}
    /* ---------- S89 D: luz (antes do quadro; durante o teste só a etiqueta muda) ---------- */
    var LUZ=45;function escuro(){return Z.lum!=null&&Z.lum<LUZ}
    function luz(cb){var t0=Date.now();Z.luzCb=cb;(function w(){if(!Z.m||Z.fase!=='teste')return;if(Z.semCam||!Z.st){cb();return}if(Z.lum==null&&Date.now()-t0<1800){setTimeout(w,200);return}
      if(!escuro()){cb();return}Z.luzP=1;botoes('luz');chip(T('Pouca luz'));fala(T('Está um pouquinho escuro.')+' '+T('Vá para um lugar mais iluminado: com pouca luz a gente lê pior.'))})()}
    function luzFim(){Z.luzP=0;botoes('t');var cb=Z.luzCb;Z.luzCb=null;cb&&cb()}
    function luzOk(){if(!Z.luzP)return;Z.lum=null;var t0=Date.now();(function w(){if(!Z.m||Z.fase!=='teste'||!Z.luzP)return;if(Z.lum==null&&Date.now()-t0<2500){setTimeout(w,200);return}
      if(!escuro()){luzFim();return}fala(T('Está um pouquinho escuro.')+' '+T('Vá para um lugar mais iluminado: com pouca luz a gente lê pior.'))})()}
    /* S66: trabalhando = fica no lugar de apontar e só faz gestos no próprio corpo; >8 s sem resposta = livre */
    function espera(){clearTimeout(Z.tq);Z.tq=setTimeout(function(){if(!Z.m||Z.fase!=='teste'||Z.ocupado)return;diz('demora',sorteia('demora'),true);livre()},8000)}
    function zCabe(z){var p=L.Z[z],m=Z.m,b=q('#gzbal');if(!p||!m||!b||!m.el.offsetParent)return true;var S=m.el.offsetParent.getBoundingClientRect(),B=b.getBoundingClientRect(),x0=S.left+p[0],y0=S.top+p[1],x1=x0+m.el.offsetWidth,y1=y0+m.el.offsetHeight;if(z==='z4'){var F=q('#gzfw');if(F)y1=Math.min(y1,F.getBoundingClientRect().top)}if(x1>innerWidth+2||x0<-2)return false;var semB=!b.classList.contains('on')&&!b.textContent.trim();var g=12,lv=function(R){return x0>=R.right+g||x1<=R.left-g||y0>=R.bottom+g||y1<=R.top-g};if(!semB&&!lv(B))return false;var ok=true;document.querySelectorAll('#gzbt .gzgo').forEach(function(e){var r=e.getBoundingClientRect();if(r.width&&!lv(r))ok=false});return ok}
    function livre(){var m=Z.m;if(!m)return;m.modo='livre';if(RM.matches||Math.random()<.5)return;
      var zs=(L.gap>=100*L.k&&!q('#gzbd').classList.contains('on'))?['z1','z3','z4']:['z1','z4'];zs=zs.filter(zCabe);if(!zs.length)return;var z=zs[Math.floor(Math.random()*zs.length)];m.paraGesto();m.vara(0);
      vaiA(z,z==='z4'?'puff':z==='z3'?'rola':'pula',function(){if(!Z.m)return;if(z==='z3')cantarola();else if(z==='z4')m.olha(-1,.8);else{m.inclina(8);setTimeout(function(){Z.m&&Z.m.inclina(0)},700)}
        setTimeout(function(){if(!Z.m||Z.fase!=='teste'||!Z.longe)return;volta()},1600)})}
    function volta(cb){var m=Z.m;if(!m)return;m.el.style.zIndex=6;m.modo='trab';m.olha(-1,.4);vaiA('ponto','pula',function(){aponta();cb&&cb()})}
    function pergunta(primeira,txt){var m=Z.m;if(!m)return;m.ocioso=true;m.modo='trab';m.olha(1,.2);var t=Z.at,f;
      if(txt)f=txt;else if(primeira)f=T('Consegue ler a frase aqui na minha frente, sem esforço?');
      else if(Z.g&&t===LS.length-1)f=T('Com a lente')+' '+gf(Z.g)+'. '+T('Consegue ler a última frase?');
      else if(Z.g)f=T('Com a lente')+' '+gf(Z.g)+'. '+T('E esta?');
      else if(t===LS.length-1)f=sorteia('bula');else if(t>=6)f=sorteia('miuda');else f=sorteia('prox');
      Z.qt=0;fala(f,function(){Z.qt=Date.now();espera()},true)}
    /* frase com lente: "Com a lente +X. Consegue ler a última frase?" ou "Com a lente +X. E esta?" (cada uma gravada inteira, S93) */
    function fLente(g){return T('Com a lente')+' '+gf(g)+'. '+(Z.at===LS.length-1?T('Consegue ler a última frase?'):T('E esta?'))}
    /* S95 D: na última frase, com lente, ele troca a frase e pergunta de novo — em outra altura (em cima ↔ embaixo) */
    function deNovo(txt){var m=Z.m;if(!m)return;trocaUltima();Z.slot=Z.slot===0?null:0;var l=q('#gzl'+Z.at);if(l)l.classList.remove('ok');cabe(Z.at);centra();aponta();pergunta(false,txt)}
    function responde(sim){var m=Z.m;if(!m||Z.fase!=='teste'||Z.ocupado)return;
      /* toque antes de ele terminar a pergunta: fica guardado e vale assim que ele acabar (S66) */
      if(Z.falando){Z.pend=sim;var bb=q('#gzbt [data-gz="'+(sim?'sim':'nao')+'"]');if(bb){bb.classList.add('gd');setTimeout(function(){bb.classList.remove('gd')},900)}return}
      if(Z.troca)return;
      /* S96: leu com o braço esticado (longe de verdade, com certeza da câmera) = não conta */
      if(sim&&longeDemais()){bracoEsticado();return}
      clearTimeout(Z.tq);Z.ocupado=true;var rap=Z.qt&&Date.now()-Z.qt<1800;m.ocioso=false;var t=Z.at,ult=t===LS.length-1;setTimeout(function(){Z.ocupado=false},650);
      var segue=function(f){if(Z.longe)volta(f);else f()};
      if(sim){var l=q('#gzl'+t);if(l)l.classList.add('ok');m.cara('f');m.sim();setTimeout(function(){Z.m&&Z.m.cara('n')},500);
        if(ult){if(!Z.g){semNecessidade();return}
          /* S95 D: a lente só vale depois de ler a última frase duas vezes, com frases diferentes */
          Z.ok2++;if(Z.ok2<2){setTimeout(function(){if(!Z.m)return;segue(function(){deNovo(frRoda('cfm'))})},450);return}
          Z.leu[Z.g]=1;Z.okLente=Z.g;
          /* S69: leu → vai tirando 0,25 até não ler; fica a mais fraca com que leu */
          var mf=Math.round((Z.g-.25)*4)/4;if(mf>=.25&&!Z.falhou[mf]&&!Z.leu[mf]){var pri=!Z.desce;Z.desce=1;
            setTimeout(function(){if(!Z.m)return;segue(function(){var w=junta(function(){resetLinhas();aponta();pergunta(false,fLenteD(mf))});
              fala(pri?frRoda('ok')+' '+T('Agora vou tirando um pouquinho de grau, até achar o mais leve que ainda funciona.'):frRoda('conf'),w());trocaLente(mf,w());setTimeout(function(){Z.m&&Z.fase==='teste'&&trocaUltima()},300)})},450);return}
          setTimeout(function(){fimQuadro(Z.okLente)},600);return}
        puxa();setTimeout(function(){if(!Z.m)return;if(!rap&&Math.random()<.6){Z.m.gesto('joinha')}segue(function(){aponta();pergunta(false,Z.g?fLente(Z.g):(rap?null:sorteia('ok')+' '+(Z.at===LS.length-1?sorteia('bula'):Z.at>=6?sorteia('miuda'):sorteia('prox'))))})},620);return}
      /* não consegue */
      m.nao();setTimeout(function(){Z.m&&Z.m.gesto('pensando')},200);
      /* S95 D: com lente na última frase, só conta como "não lê" depois de duas vezes seguidas (a segunda com outra frase) */
      if(Z.g&&ult){Z.ko2++;Z.ok2=0;if(Z.ko2<2){setTimeout(function(){if(!Z.m)return;segue(function(){deNovo(T('Vamos tentar com outra frase.'))})},700);return}}
      if(Z.desce){Z.falhou[Z.g]=1;setTimeout(function(){fimQuadro(Z.okLente)},900);return}
      if(Z.g)Z.falhou[Z.g]=1;
      var g;if(!Z.g){var k=t-1;g=k>=0?Math.max(.25,GK[k]-.5):3}else g=Math.round((Z.g+.25)*4)/4;
      if(g>4){setTimeout(consulte,900);return}
      var pri=!Z.g;segue(function(){var w=junta(function(){Z.slot=null;if(Z.at!==LS.length-1)resetLinhas();aponta();pergunta(false,Math.random()<.4?T('Esta é')+' '+gf(g)+'. '+T('E agora?'):fLente(g))});
        fala(pri?sorteia('nao'):sorteia('troca'),w());var tl=w();setTimeout(function(){trocaLente(g,tl)},pri?900:500)})}
    /* S96 + S98: só não conta quando a câmera tem certeza de que ficou longe por 1 s (margem do erro da medida); na dúvida, vale */
    var LIM=42;/* celular sem calibração: 38 cm + margem do erro da medida */
    function longeDemais(){if(Z.semCam||!Z.st)return false;var n=Date.now();if(n-(Z.rosto||0)>700)return false;var a=(Z.hd||[]).filter(function(x){return n-x[0]<=1000&&x[2]});if(a.length<2)return false;return a.every(function(x){return x[1]>(Z.pc?79:LIM)})}
    function bracoEsticado(){var m=Z.m;clearTimeout(Z.tq);m.ocioso=false;m.gesto('pensando');var bb=q('#gzbt [data-gz="sim"]');if(bb){bb.classList.add('gd');setTimeout(function(){bb.classList.remove('gd')},900)}
      var f=T(Z.pc?'Chegue um pouquinho mais perto da tela.':'Segure a um palmo e me diga de novo.'),fimB=function(){Z.qt=Date.now();espera()};
      if(!Z.bracoDisse){Z.bracoDisse=1;var f1=T(Z.pc?'Você se afastou da tela para conseguir ler — isso é sinal de vista cansada.':'Você afastou o celular para conseguir ler — isso é sinal de vista cansada.');if(Z.pc){fala(f1,function(){if(Z.m&&Z.fase==='teste')fala(f,fimB,true)},true);return}f=f1+' '+f}
      fala(f,fimB,true)}
    /* espera duas coisas terminarem (a fala e a troca da lente) antes da próxima pergunta — a fala nunca é cortada */
    function junta(fim){var n=0,k=0;return function(){n++;return function(){if(++k===n&&Z.m&&Z.fase==='teste')fim()}}}
    function resetLinhas(){for(var i=0;i<LS.length;i++){var l=q('#gzl'+i);if(l)l.classList.remove('ok')}Z.at=LS.length-1;Z.slot=null;cabe(Z.at);centra()}
    /* S67/S68: bandeja de lentes de prova embaixo do quadro (só na fase das lentes); a lente da vez sobe em dourado, as testadas esmaecem */
    function bandeja(on){var b=q('#gzbd'),n=q('#gznt');if(b)b.classList.toggle('on',!!on);if(n)n.classList.toggle('on',!!on);if(!on&&b)[].forEach.call(b.children,function(x){x.classList.remove('vez','us')})}
    function mini(g){return q('#gzbd .gzmi[data-g="'+(Math.round(g*100)/100)+'"]')}
    /* S87b: o Mochi recolhe o ponteiro, pula até a bandeja, pega a lente pela haste, volta e lança: ela cresce em arco e encaixa no quadro (clic + brilho).
       Na troca, a lente velha volta para o lugar dela na bandeja (marcada como testada). Movimento reduzido: a lente só troca. */
    function voa(el,de,para,ms,ease){var r=el.getBoundingClientRect(),fx=de.left+de.width/2-(r.left+r.width/2),fy=de.top+de.height/2-(r.top+r.height/2),sc=Math.max(.04,de.width/r.width),tx=para?para.left+para.width/2-(r.left+r.width/2):0,ty=para?para.top+para.height/2-(r.top+r.height/2):0,ts=para?Math.max(.04,para.width/r.width):1;
      return el.animate([{transform:'translate('+fx+'px,'+fy+'px) scale('+sc+') rotate(-14deg)'},{transform:'translate('+((fx+tx)/2-18)+'px,'+((fy+ty)/2-46)+'px) scale('+((sc+ts)/2)+') rotate(-6deg)',offset:.5},{transform:'translate('+tx+'px,'+ty+'px) scale('+ts+') rotate(0deg)'}],{duration:ms,easing:ease||'cubic-bezier(.3,.7,.2,1)'})}
    /* lentinha na mão do Mochi (segue a mão a cada quadro, balançando um tiquinho atrasada) */
    function lzMao(on){var s=q('#gzstg'),e=q('#gzlm');if(!s)return null;if(!on){if(e)e.remove();return null}
      if(!e){e=document.createElement('div');e.id='gzlm';e.className='gzlm';s.appendChild(e)}
      var px=null,ang=0,loop=function(){if(!e.isConnected||!Z.m)return;var h=Z.m.mao(),r=s.getBoundingClientRect(),x=h[0]-r.left,y=h[1]-r.top;if(px!=null){ang+=((x-px)*-1.6-ang)*.2}px=x;
        e.style.transform='translate('+(x-4).toFixed(1)+'px,'+(y-30).toFixed(1)+'px) rotate('+(-12+Math.max(-18,Math.min(18,ang))).toFixed(1)+'deg)';requestAnimationFrame(loop)};loop();return e}
    function trocaLente(g,cb0){var m=Z.m,fr=q('#gzfr');if(!m)return;if(!Z.lupa){Z.lupa=1;q('#gzfita').classList.add('lupa');lay()}Z.ok2=0;Z.ko2=0;Z.slot=null;bandeja(true);Z.troca=1;q('#gzbt').classList.add('esp');var cb=function(){Z.troca=0;var b=q('#gzbt');if(b)b.classList.remove('esp');cb0&&cb0()};
      var velha=Z.g,mv=velha?mini(velha):null,mn=mini(g);
      var poe=function(){lente(g);fr.classList.add('on');fr.classList.remove('br');void fr.offsetWidth;fr.classList.add('br');m.espelho();m.cara('f');
        if(!RM.matches&&fr.animate)fr.animate([{transform:'scale(1.045)'},{transform:'scale(.99)',offset:.6},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});
        Z.troca=0;aponta();Z.troca=1;setTimeout(function(){if(!Z.m)return;m.cara('n');m.olha(1,.2);cb()},650)};
      if(RM.matches||!fr.animate||!mn){if(mv)mv.classList.add('us');if(mn)mn.classList.add('us');poe();return}
      var k=L.k,pt=L.Z.ponto.slice(),st=q('#gzstg');
      var vai=function(){m.paraGesto();m.estica(0,300);
        setTimeout(function(){if(!Z.m)return;m.vara(0);m.bracos(null,18);mn.classList.add('vez');m.olha(.6,1);
          /* pula de forma que a mão direita pare em cima da lentinha da vez */
          var a=18*Math.PI/180,hx=(98+Math.cos(a)*27+6)*k,hy=(92+Math.sin(a)*27-24)*k,S=st.getBoundingClientRect(),R=mn.getBoundingClientRect();
          m.pula(R.left+R.width/2-S.left-hx,R.top+R.height/2-S.top-hy-4,440,36,function(){if(!Z.m)return;
            mn.classList.remove('vez');mn.classList.add('us');m.cara('f');m.espelho(.6);var lm=lzMao(true);
            setTimeout(function(){if(!Z.m)return;m.cara('n');m.olha(1,-.3);
              m.pula(pt[0],pt[1],460,42,function(){if(!Z.m)return;
                /* lança: a lente sai da mão e cresce em arco até cobrir o quadro */
                m.bracos(null,-55);var r0=lm?lm.getBoundingClientRect():R;lzMao(false);q('#gztag').textContent=gf(g);fr.classList.add('voa');
                var an=voa(fr,r0,null,430);an.onfinish=function(){fr.classList.remove('voa');poe()}})},230)})},320)};
      /* a lente velha volta para o lugar dela na bandeja */
      if(velha&&mv&&fr.classList.contains('on')){var an=voa(fr,fr.getBoundingClientRect(),mv.getBoundingClientRect(),380,'cubic-bezier(.5,0,.4,1)');fr.classList.add('voa');
        an.onfinish=function(){fr.classList.remove('voa','on');mv.classList.remove('vez');mv.classList.add('us');lente(0,true);vai()}}
      else vai()}
    /* ---------- S89 C: ponto próximo (segunda medida, só com câmera) ---------- */
    function fimQuadro(G){if(!Z.m)return;if(Z.pc||Z.semCam||!Z.st||Date.now()-(Z.rosto||0)>6000){resultado(G);return}ppIni(G,0)}
    function ppIni(G,n){var m=Z.m;if(!m)return;if(Z.lupa){Z.lupa=0;q('#gzfita').classList.remove('lupa')}(function(){var bl=q('#gzbal');if(!bl)return;var o=bl.innerHTML,mh=0;bl.style.minHeight='';[T('Agora vou ver de quão perto você consegue ler. Aproxime o celular do rosto bem devagar, sem parar de ler as letras.'),T('Quando as letras começarem a embaçar, pare o celular ali, ou me avise apertando o botão Embaçou.')].forEach(function(t){bl.innerHTML=t;mh=Math.max(mh,bl.offsetHeight)});bl.innerHTML=o;bl.style.minHeight=mh+'px'})();lay();Z.fase='pp';Z.ppG=G;if(!n)Z.ppD=[];clearTimeout(Z.tq);bandeja(false);var fr=q('#gzfr');fr.classList.remove('on','br');q('#gzfw').classList.remove('pin');Z.g=0;Z.at=1;Z.slot=null;
      var f0=q('#gzfita');f0.style.top='0px';f0.innerHTML='<div class="gzl p3 hl" id="gzl1"><span>'+esc(LS[3])+'</span></div><div class="gzpph" style="position:absolute;left:0;right:0;top:'+Math.round(L.wh*.68)+'px">'+T('aproxime devagar')+' ↓</div>';var l1=q('#gzl1');l1.style.fontSize=(FS[3]*kLetra())+'px';l1.style.top=(SLOT[1]*L.wh)+'px';botoes('pp');
      if(Z.longe)volta();else{m.modo='trab';var pq=L.Z.ponto;if(pq&&(Math.abs(m.x-pq[0])>2||Math.abs(m.y-pq[1])>2))m.flutua(pq[0],pq[1],420,aponta);else aponta()}
      /* S400 (17/11/2026, esboços 56a/56b aprovados): UM toque. A fala gravada é a de sempre; o balão diz "toque em Embaçou".
         Sem toque, ela conclui sozinha que não embaça: celular a 15 cm ou menos por 1,5 s, ou 25 s sem toque. */
      var f1=T('Agora vou ver de quão perto você consegue ler. Aproxime o celular do rosto bem devagar, sem parar de ler as letras.'),f2=T('Quando as letras começarem a embaçar, pare o celular ali, ou me avise apertando o botão Embaçou.');
      setTimeout(function(){Z.m&&Z.fase==='pp'&&fala(f1,function(){if(Z.m&&Z.fase==='pp'&&!Z.ppTrava){ppMostra();fala(f2)}})},500);Z.ppD0=null;ppEsconde();clearTimeout(Z.ppMt);Z.ppMt=setTimeout(function(){if(Z.fase==='pp')ppMostra()},14000);
      Z.ppT0=Date.now();Z.ppPerto=0;clearInterval(Z.ppT);Z.ppT=setInterval(function(){if(!Z.m||Z.fase!=='pp'||Z.ppTrava){clearInterval(Z.ppT);return}var nn=Date.now(),a=(Z.hd||[]).filter(function(x){return nn-x[0]<900}).map(function(x){return x[1]});
        if(a.length&&Z.ppD0==null)Z.ppD0=Math.max.apply(null,a);var b2=(Z.hd||[]).filter(function(x){return nn-x[0]<2000}).map(function(x){return x[1]});if(Z.ppD0!=null&&nn-Z.ppT0>2500&&b2.length>=5&&nn-(Z.rosto||0)<900&&Math.max.apply(null,b2)-Math.min.apply(null,b2)<=1.2&&med(b2)<=Z.ppD0-5&&med(b2)>15){ppTrava(med(b2));return}
        if(a.length&&nn-(Z.rosto||0)<900&&Math.max.apply(null,a)<=15){if(!Z.ppPerto)Z.ppPerto=nn;else if(nn-Z.ppPerto>=1500){ppTrava(null);return}}else Z.ppPerto=0;
        if(nn-Z.ppT0>25000)ppTrava(null)},350)}
    function ppCss(){if(document.getElementById('lfppcss'))return;var st=document.createElement('style');st.id='lfppcss';st.textContent='#gzbt.ppesc{opacity:0;transform:translateY(18px) scale(.94);pointer-events:none}';document.head.appendChild(st)}
    function ppEsconde(){ppCss();var bt=q('#gzbt');if(!bt)return;bt.classList.add('ppesc');Z.ppVis=0}
    function ppMostra(){var bt=q('#gzbt');if(!bt||Z.ppVis)return;Z.ppVis=1;clearTimeout(Z.ppMt);bt.classList.remove('ppesc');var b=bt.querySelector('.gzgo');if(b){b.disabled=false;b.style.opacity=''}
      if(RM.matches||!bt.animate)return;bt.animate([{opacity:0,transform:'translateY(18px) scale(.94)'},{opacity:1,transform:'translateY(-3px) scale(1.02)',offset:.65},{opacity:1,transform:'none'}],{duration:620,easing:'cubic-bezier(.22,1,.36,1)'});
      if(b&&b.animate)b.animate([{boxShadow:'0 0 0 0 rgba(141,58,105,.6)'},{boxShadow:'0 0 0 20px rgba(141,58,105,0)'}],{duration:1100,delay:560,iterations:2,easing:'cubic-bezier(.2,.7,.3,1)'});
      if(Z.m&&Z.m.olhaVai)Z.m.olhaVai(.3,1,1400)}
    /* o toque (ou a conclusão automática) trava o botão, avisa que pode afastar e fecha a medida. d = distância em cm; null = não embaça */
    function ppTrava(d){if(Z.fase!=='pp'||Z.ppTrava)return;Z.ppTrava=1;clearInterval(Z.ppT);clearTimeout(Z.ppMt);var bq=q('#gzbt');if(bq)bq.classList.remove('ppesc');Z.ppVis=1;var bt=q('#gzbt');if(bt)bt.innerHTML='<button type="button" class="gzgo" disabled style="opacity:.42;pointer-events:none">'+T('Pronto')+'</button>';
      var h=q('.gzpph');if(h)h.textContent='';var fin=0,t0=Date.now(),acaba=function(){if(fin)return;fin=1;Z.ppTrava=0;if(Z.fase!=='pp')return;if(d==null)ppFim(0);else ppFim(ppConta(d))};
      /* S420 (107 aprovado): a fala final agora tem voz; o resultado vem quando ela termina (no mínimo 1,4 s, no máximo 7 s) */
      fala(d==null?T('Não embaçou? Tudo bem, já medi.'):T('Pronto, medi! Pode afastar o celular.'),function(){setTimeout(acaba,Math.max(0,1400-(Date.now()-t0)))});setTimeout(acaba,7000)}
    /* a distância do instante do toque: mediana das medidas do último segundo (a medição roda a cada 0,35 s) */
    function ppAgora(){var nn=Date.now(),a=(Z.hd||[]).filter(function(x){return nn-x[0]<1000}).map(function(x){return x[1]});return a.length&&nn-(Z.rosto||0)<1200?med(a):null}
    function ppPonto(d){if(d==null){ppTrava(null);return}ppTrava(d)}
    function ppFim(pp){if(Z.fase!=='pp')return;var bl0=q('#gzbal');if(bl0)bl0.style.minHeight='';resultado(Z.ppG,{pp:pp,ok:Math.abs(Math.max(.25,pp)-Z.ppG)<=.25||(pp===0&&Z.ppG<=.25)})}
    /* só vale com o celular parado: a distância do último 1,5 s varia menos de 2,5 cm */
    function ppMede(cb){var t0=Date.now(),disse=0;(function w(){if(!Z.m||Z.fase!=='pp')return;var n=Date.now(),a=(Z.hd||[]).filter(function(x){return n-x[0]<1500}).map(function(x){return x[1]});
      if(a.length>=2&&n-(Z.rosto||0)<900&&Math.max.apply(null,a)-Math.min.apply(null,a)<=2.5){cb(med(a));return}
      if(n-t0>6000){cb(null);return}if(!disse){disse=1;fala(T('Segure aí um instante…'))}setTimeout(w,250)})()}
    function ppConta(d){if(d==null)return null;var A=100/d,ad=Math.floor((3.33-A/2)*4+1e-6)/4;return ad<.25?0:Math.min(4,ad)}
    /* ---------- resultados ---------- */
    function fimTeste(){Z.lupa=0;cam();clearTimeout(Z.tq);Z.fase='res';var dc=q('#gzdi');if(dc)dc.hidden=true;var m=Z.m;m.paraGesto();m.vara(0);m.modo='livre';modo(false);vaiA('intro',RM.matches?'ja':'pula')}
    function avisos(){return '<div class="gzav"><p><b>'+T('Serve para:')+'</b> '+T('ler de perto — livro, celular, cardápio, costura.')+'</p><p><b>'+T('Não serve para:')+'</b> '+T('ver de longe ou dirigir.')+'</p>'+
      '<p><b>'+T('Miopia:')+'</b> '+T('óculos de leitura não corrigem. Se lê bem de perto sem óculos, não precisa deles.')+'</p><p><b>'+T('Astigmatismo:')+'</b> '+T('o óculos de leitura pronto não corrige. Pode até ajudar, mas o ideal é um óculos feito com a sua receita.')+'</p>'+
      '<p><b>'+T('Multifocal:')+'</b> '+T('é feito sob medida numa ótica, com receita. Este teste não consegue medir.')+'</p><p class="mu"><b>'+T('Não substitui o oftalmologista.')+'</b> '+T('Procure um se tiver dor de cabeça ao ler, visão dupla, um olho bem pior que o outro ou se a visão mudou de repente.')+'</p></div>'}
    
    /* S69: resultado = a lente mais fraca com que leu a bula, com a faixa provável (±0,25) e "na dúvida, o menor" */
    function resultado(G,pp){try{window.__lfGm&&window.__lfGm(G)}catch(_){}var esc0=Z.escuro||(Z.lzT>5&&Z.lzE/Z.lzT>.5);fimTeste();var GQ=G,m=Z.m,lo=gf(Math.max(.25,G-.25)),hi=gf(Math.min(4,G+.25)),ppH='';
      /* S95 E: quadro + ponto próximo. Combinam (até 0,25) = um grau só; não combinam = faixa entre os dois e o sugerido é o menor */
      /* S381 (aprovado 16/11 10:31): o quadro de leitura manda. Ponto próximo que não combina (diferença maior que 0,25) é deixado de lado — antes ele puxava a sugestão para o menor (caso do dono: quadro +2.50, sugerido +0.25) */if(pp&&!pp.ok)pp=null;
      Z.G=G;Z.g=G;
      if(pp){
        ppH='<p class="gzp gzpp">'+T('Quadro de leitura:')+' '+gf(GQ)+'<br>'+T('Ponto próximo:')+' '+(pp.pp?gf(pp.pp):T('não precisa'))+(pp.ok?' <b>✓ '+T('combinam')+'</b>':'')+'</p>'}
      conteudo('<div class="gzeb">'+T('SEU GRAU PARA COMEÇAR')+'</div><div class="gzrs"><div class="gzres">'+gf(G)+'</div><p class="gzp">'+T('Com a lente')+' '+gf(GQ)+' '+T('você leu até a última frase.')+'<br>'+T('Faixa provável:')+' '+lo+' '+T('a')+' '+hi+'</p>'+ppH+(esc0?'<p class="gzp gzlz">'+T('Feito com pouca luz — pode ter saído um pouco mais forte.')+'</p>':'')+(Z.pc?'<p class="gzp gzest">'+T('No computador este resultado é uma estimativa.')+' '+T('Para confirmar, faça o teste no celular.')+'</p>':'')+'</div>'+
        '<p class="gzp" style="text-align:center;margin-top:14px">'+T('Quer escolher outro?')+'</p>'+
        '<div class="gzaj"><button type="button" class="gzpm" data-gz="menos" aria-label="'+T('Menos grau')+'">−</button><div><b id="gzgv">'+gf(G)+'</b><small id="gzgl">'+T('sugerido')+'</small></div><button type="button" class="gzpm" data-gz="mais" aria-label="'+T('Mais grau')+'">+</button></div>'+
        '<p class="gzp" style="text-align:center;font-size:13.5px;margin-top:6px">'+T('Na dúvida entre dois graus, fique com o menor.')+' '+T('Este grau é para ler a uns 30 cm, como o celular.')+'</p>'+
        '<button type="button" class="gzgo" data-gz="ver" id="gzver">'+T('Ver óculos de leitura')+' '+gf(G)+'</button><button type="button" class="gzgo o" data-gz="guarda">'+T('Guardar meu grau')+'</button>'+avisos());
      setTimeout(function(){if(!Z.m)return;m.cara('f');m.gesto('comemora');m.espelho();fala(pp&&pp.ok?T('Pronto!')+' '+T('As duas medidas combinam.'):pp?T('Pronto!')+' '+T('As medidas ficaram um pouco diferentes.')+' '+T('Na dúvida, fique com o menor.'):T('Pronto! O grau que mais combina com você é')+' '+gf(G)+'.',function(){if(!Z.m)return;var fimR=function(){if(!Z.m)return;Z.m.acena(6);setTimeout(function(){if(!Z.m)return;m.cara('n');m.ocioso=true},1500)};if(Z.pc&&Z.fase==='res')fala(T('No computador este resultado é uma estimativa.')+' '+T('Para confirmar, faça o teste no celular.'),fimR);else fimR()})},500)}
    function semNecessidade(){fimTeste();conteudo('<div class="gzeb">'+T('RESULTADO')+'</div><h2>'+T('Você leu até a letra de bula sem óculos')+'</h2>'+
        '<div class="gzav"><p>'+T('Por enquanto você não precisa de óculos de leitura.')+'</p><p>'+T('Se você usa óculos para longe (miopia), para ler o mais simples é tirar os seus óculos. Para longe e perto com um óculos só, o certo é um multifocal, feito numa ótica com receita.')+'</p></div>'+
        '<button type="button" class="gzgo o" data-gz="inicio">'+T('Voltar ao início')+'</button>');
      setTimeout(function(){if(!Z.m)return;Z.m.cara('f');Z.m.acena(4);fala(T('Boa notícia: você lê bem de perto sem óculos!'),function(){if(Z.m){Z.m.cara('n');Z.m.ocioso=true}})},500)}
    function consulte(){fimTeste();conteudo('<div class="gzeb">'+T('RESULTADO')+'</div><h2>'+T('Nem com a lente mais forte ficou fácil')+'</h2><p class="gzp">'+T('Os óculos de leitura prontos vão até +4.00. Para não chutar um grau, o melhor é consultar um oftalmologista.')+'</p>'+
        '<button type="button" class="gzgo" data-gz="comeca">'+T('Tentar de novo')+'</button><button type="button" class="gzgo o" data-gz="inicio">'+T('Voltar ao início')+'</button>');
      setTimeout(function(){if(!Z.m)return;Z.m.nao();fala(T('Para não chutar um grau, vale consultar um oftalmologista.'),function(){if(Z.m)Z.m.ocioso=true})},500)}
    /* ---------- câmera: só confere a distância de 40 cm (nada é gravado) ---------- */
    function chip(t,ok,av){var c=q('#gzdi');if(!c)return;c.hidden=false;if(c.textContent!==t)c.textContent=t;c.classList.toggle('ok',!!ok);c.classList.toggle('av',!!av)}
    function abreCam(){if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia))return Promise.reject(new Error('sem'));return navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'user',width:{ideal:1280},height:{ideal:720}}})}
    function liga(st){if(!Z.el){st.getTracks().forEach(function(t){t.stop()});return}if(Z.st&&Z.st!==st)cam();Z.st=st;Z.lum=null;Z.hd=[];hist10=[];Z.bx=null;var v=Z.v=document.createElement('video');v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');v.srcObject=st;var p=v.play();if(p&&p.catch)p.catch(function(){});
      /* S98: distância pela íris (MediaPipe, roda no aparelho); enquanto não carrega, ou se falhar, usa a distância entre os olhos como antes */
      var vai=function(){if(Z.lacoOn||!Z.el||!Z.st)return;Z.lacoOn=1;laco()};Z.lacoOn=0;
      var faVai=function(){if(Z.faP)return;Z.faP=1;(window.__lfFakeFa?Promise.resolve(window.__lfFakeFa):faLoad()).then(function(fa){Z.fa=fa;vai()},function(){if(!Z.mp)chip(chipDist())})};
      /* S426: com o trabalhador ao lado o leitor antigo (face-api, ~1 s travando a tela ao carregar) só vem se o trabalhador falhar ou demorar mais de 8 s */
      if(CAMT&&!window.__lfFakeMp&&window.Worker&&window.createImageBitmap){wkLiga().then(vai,function(){faVai();mpLoad().then(function(lm){Z.mp=lm;vai()},function(){})});setTimeout(function(){if(Z.el&&Z.st&&!(Z.wk&&Z.wk.ok)&&!Z.mp)faVai()},8000)}
      else{(window.__lfFakeMp?Promise.resolve(window.__lfFakeMp):mpLoad()).then(function(lm){Z.mp=lm;vai()},function(){});faVai()}}
    function medir(){if(Z.semCam){chip(chipDist());return}if(Z.st)return;abreCam().then(liga,function(){if(!Z.el)return;Z.semCam=1;chip(chipDist())})}
    var hist=[],med=function(a){var s=a.slice().sort(function(x,y){return x-y});return s[Math.floor(s.length/2)]};
    var hist10=[];
    /* uma medida nova: d em cm; ok = a câmera tem certeza (íris dos dois olhos, rosto de frente) */
    function poeMedida(d,ok){var n=Date.now();hist10.push(d);if(hist10.length>10)hist10.shift();Z.d=med(hist10);Z.rosto=n;Z.hd=(Z.hd||[]).filter(function(x){return n-x[0]<3000});Z.hd.push([n,d,ok]);
      if(Z.fase==='pp'){chip(Math.round(Z.d)+' cm');return}
      if(Z.fase!=='teste'&&Z.fase!=='prep'){chip(Math.round(Z.d)+' cm ✓',true);return}
      if(escuro()){chip(T('Pouca luz'));return}
      /* S96: sem avisos falados; acima de 38 cm a etiqueta fica laranja (o cliente percebe sozinho) */
      if(Z.d>dHi())chip(Math.round(Z.d)+' cm',false,true);else if(Z.d<dLo())chip(Math.round(Z.d)+' cm');else chip(Math.round(Z.d)+' cm ✓',true)}
    /* S384 — modo de teste (?camt=1): a leitura do rosto num trabalhador ao lado. wkLiga cria e prepara; wkFalha desliga e volta ao leitor normal */
    var CAMT=true;try{if(/[?&]camt=0/.test(location.search))sessionStorage.setItem('lf_camt','0');else if(/[?&]camt=1/.test(location.search))sessionStorage.removeItem('lf_camt');CAMT=sessionStorage.getItem('lf_camt')!=='0'}catch(_){}window.__lfCamt=CAMT;
    /* S385 (teste): prepara o leitor na abertura — só se o arquivo já está guardado no aparelho ou a rede é Wi-Fi/cabo */
    function wkCedo(){if(window.__lfFakeMp||!window.Worker||!window.createImageBitmap||(Z.wk&&Z.wk.ok)||wkLiga.p)return;var vai=function(){window.__lfCedo=1;wkLiga().catch(function(){})},c=navigator.connection;
      /* S426 (travadas aprovadas 18/11): prepara já na abertura, enquanto ela fala — só não prepara com economia de dados ligada */
      if(!c||!c.saveData){vai();return}
      try{fetch(new URL(FAB+'mp/face_landmarker.task',document.baseURI).href,{cache:'only-if-cached',mode:'same-origin'}).then(function(r){if(r&&r.ok)vai()},function(){})}catch(_){}}
    function wkLiga(){if(wkLiga.p)return wkLiga.p;var p=wkLiga0();wkLiga.p=p;var fim=function(){if(wkLiga.p===p)wkLiga.p=null};p.then(fim,fim);return p}
    function wkLiga0(){return new Promise(function(ok,no){if(Z.wk&&Z.wk.ok){ok();return}try{var base=new URL(FAB+'mp/',document.baseURI).href,w=new Worker(base+'mp-trab.js'),t=setTimeout(function(){try{w.terminate()}catch(_){}no(new Error('tempo'))},25000);
      w.onmessage=function(e){var d=e.data;if(d.t==='ok'){clearTimeout(t);Z.wk={w:w,ok:true,del:d.del,id:0,luz:!!d.luz};MP.del=d.del;w.onmessage=function(e2){var c=Z.wk&&Z.wk.cb;if(e2.data.t==='luz'){if(Z.wk&&Z.wk.w===w&&Z.el&&Z.st&&e2.data.lu!=null){var lu=window.__lfFakeLum!=null?window.__lfFakeLum:e2.data.lu;window.__lfLuT=e2.data.lu;Z.lum=Z.lum==null?lu:Z.lum*.6+lu*.4;if(Z.fase==='teste'&&!Z.luzP){Z.lzT++;if(escuro())Z.lzE++}}return}if(e2.data.t==='r'&&c)c(e2.data)};ok()}else if(d.t==='erro'){clearTimeout(t);try{w.terminate()}catch(_){}no(new Error(d.m))}};
      w.onerror=function(){clearTimeout(t);try{w.terminate()}catch(_){}no(new Error('trab'))};w.postMessage({t:'ini',base:base})}catch(e){no(e)}})}
    function wkFalha(){if(Z.wk){try{clearTimeout(Z.wk.to);Z.wk.w.terminate()}catch(_){}Z.wk=null}window.__lfWkFalhou=1;if(!Z.mp)mpLoad().then(function(lm){Z.mp=lm},function(){});if(!Z.fa&&!Z.faP){Z.faP=1;faLoad().then(function(fa){Z.fa=fa},function(){})}}
    function laco(){if(!Z.el||!Z.st)return;var v=Z.v,fa=Z.fa,wkOk=!!(Z.wk&&Z.wk.ok);if(!v.videoWidth||(!Z.mp&&!fa&&!wkOk)){Z.tm=setTimeout(laco,250);return}
      /* S383: a cópia da imagem para medir a claridade é feita a cada 4 medições quando o leitor de rosto novo está em uso (ele não precisa dela); o leitor antigo usa essa cópia sempre */
      Z.lzN=(Z.lzN||0)+1;var W=320,H=Math.round(W*v.videoHeight/v.videoWidth),cv=Z.cv||(Z.cv=document.createElement('canvas')),wkLuz=wkOk&&!!Z.wk.luz,fazLuz=!(Z.mp||wkOk)||(Z.lzN%4===1&&!wkLuz);if(fazLuz){cv.width=W;cv.height=H;var cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(v,0,0,W,H)}
      /* S89 D: brilho do meio da imagem (nada é gravado) */
      if(fazLuz)try{var dd=cx.getImageData(W*.2|0,H*.15|0,W*.6|0,H*.7|0).data,sm=0,nn=0;for(var ii=0;ii<dd.length;ii+=64){sm+=dd[ii]*.299+dd[ii+1]*.587+dd[ii+2]*.114;nn++}var lu=window.__lfFakeLum!=null?window.__lfFakeLum:sm/nn;Z.lum=Z.lum==null?lu:Z.lum*.6+lu*.4;
        if(Z.fase==='teste'&&!Z.luzP){Z.lzT++;if(escuro())Z.lzE++}}catch(_){}
      /* S95 A / S98: íris (11,7 mm em quase todo adulto) na imagem grande (até 1280 px) */
      /* para não pesar no celular: a 1ª leitura é na imagem inteira (640 px); depois, só um recorte em volta do rosto, na resolução cheia (os olhos ficam com muito mais pontos) */
      if(Z.mp||wkOk){var VW=v.videoWidth,VH=v.videoHeight,bx=Z.bx,sx=0,sy=0,sw=VW,sh=VH,S2=640;/* S382: o ritmo calmo (1 s) do S381 foi retirado a pedido do dono — a medição volta a ser a cada 0,35 s */
        if(bx){var cxm=bx[0]+bx[2]/2,cym=bx[1]+bx[3]/2,lado=Math.min(VW,VH,Math.max(bx[2],bx[3])*1.7);sw=sh=lado;sx=Math.max(0,Math.min(VW-lado,cxm-lado/2));sy=Math.max(0,Math.min(VH-lado,cym-lado/2));S2=Math.min(512,Math.round(lado))}
        var W2=bx?S2:Math.min(640,VW),H2=bx?S2:Math.round(W2*VH/VW);Z.mpk=sw/W2;
        var proc=function(P){var n=Date.now();
        if(P&&P.length>=478){var kx=sw/W2,ky=sh/H2;/* pixels do recorte → pixels da imagem da câmera */
          var ir=function(c){return (Math.hypot((P[c+1].x-P[c+3].x)*W2*kx,(P[c+1].y-P[c+3].y)*H2*ky)+Math.hypot((P[c+2].x-P[c+4].x)*W2*kx,(P[c+2].y-P[c+4].y)*H2*ky))/2},a=ir(468),b=ir(473);
          var x0=1,y0=1,x1=0,y1=0;P.forEach(function(p){if(p.x<x0)x0=p.x;if(p.y<y0)y0=p.y;if(p.x>x1)x1=p.x;if(p.y>y1)y1=p.y});Z.bx=[sx+x0*sw,sy+y0*sh,(x1-x0)*sw,(y1-y0)*sh];
          var mn=Math.min(a,b),mx=Math.max(a,b),ok=mn>5&&mn/mx>.8,di=ok?(a+b)/2:mx,f2=(Math.max(VW,VH)/2)/Math.tan(31*Math.PI/180);/* S381: lado maior (imagem em pé no celular) */
          if(di>3)poeMedida(f2*1.17/di,ok)}
        else{Z.bx=null;if(n-(Z.rosto||0)>2000)chip(T('Não vejo o seu rosto'))}
        try{window.__lfCam={w:VW,h:VH,del:MP.del||'?',d:Z.d,ms:350,fora:!!(Z.wk&&Z.wk.ok),lms:Z.wk&&Z.wk.ms}}catch(_){}
        Z.tm=setTimeout(laco,350)};
        if(wkOk){var my=++Z.wk.id,st0=Z.st,wk0=Z.wk;
          /* S388: claridade do meio da imagem (mesma região de sempre: 60% × 70%), 1 a cada 4 medições, calculada no trabalhador */
          if(wkLuz&&Z.lzN%4===1)try{createImageBitmap(v,Math.round(VW*.2),Math.round(VH*.15),Math.round(VW*.6),Math.round(VH*.7),{resizeWidth:48,resizeHeight:Math.max(8,Math.round(48*(VH*.7)/(VW*.6))),resizeQuality:'low'}).then(function(b2){if(Z.wk!==wk0||Z.st!==st0){try{b2.close()}catch(_){}return}wk0.w.postMessage({t:'luz',bm:b2},[b2])},function(){})}catch(_){}
          createImageBitmap(v,Math.round(sx),Math.round(sy),Math.round(sw),Math.round(sh),{resizeWidth:W2,resizeHeight:H2,resizeQuality:'medium'}).then(function(bm){
            if(!Z.el||Z.st!==st0||Z.wk!==wk0){try{bm.close()}catch(_){}return}
            wk0.cb=function(d){if(d.id!==my)return;clearTimeout(wk0.to);if(!Z.el||Z.st!==st0)return;if(d.erro){wkFalha();proc(null);return}var P=null;if(d.P){P=[];for(var i=0;i<478;i++)P.push({x:d.P[2*i],y:d.P[2*i+1]})}wk0.ms=d.ms;proc(P)};
            wk0.to=setTimeout(function(){if(Z.wk!==wk0)return;wkFalha();if(Z.el&&Z.st===st0)proc(null)},8000);wk0.w.postMessage({t:'img',id:my,bm:bm},[bm])},
            function(){wkFalha();if(Z.el&&Z.st===st0)Z.tm=setTimeout(laco,350)});return}
        var c2=Z.cv2||(Z.cv2=document.createElement('canvas'));c2.width=W2;c2.height=H2;c2.getContext('2d').drawImage(v,sx,sy,sw,sh,0,0,W2,H2);
        var r=null;try{r=Z.mp.detect(c2)}catch(_){r=null}proc(r&&r.faceLandmarks&&r.faceLandmarks[0]);return}
      fa.detectSingleFace(cv,new fa.TinyFaceDetectorOptions({inputSize:224,scoreThreshold:.4})).withFaceLandmarks(!FA.full).then(function(r){if(!Z.el||!Z.st)return;var n=Date.now();
        if(r&&r.landmarks){var P=r.landmarks.positions,c=function(a,b){var x=0,y=0;for(var i=a;i<=b;i++){x+=P[i].x;y+=P[i].y}return [x/(b-a+1),y/(b-a+1)]},e1=c(36,41),e2=c(42,47),ipd=Math.hypot(e1[0]-e2[0],e1[1]-e2[1]);
          /* distância entre os olhos varia muito de pessoa para pessoa: a medida vale para a etiqueta, mas fica "em dúvida" (nunca tira a resposta do cliente) */
          var f=(Math.max(W,H)/2)/Math.tan(31*Math.PI/180);poeMedida(f*6.3/ipd,false)}
        else if(n-(Z.rosto||0)>2000)chip(T('Não vejo o seu rosto'));
        Z.tm=setTimeout(laco,350)},function(){Z.tm=setTimeout(laco,600)})}
    function perto(g){var G=navGraus(),b='',d=1e9;G.forEach(function(x){var k=Math.abs(gn(x)-g);if(k<d-1e-9){d=k;b=x}});return b}
    document.addEventListener('pointerdown',function(e){if(Z.el&&Z.bloq&&Z.el.contains(e.target)&&!(e.target.closest&&e.target.closest('[data-gz=mudo]')))somLibera()},true);
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-gzopen],[data-gz]');if(t&&t.getAttribute('data-gz')==='mudo'&&Z.bloq){e.preventDefault();e.stopPropagation();somLibera();return}if(!t)return;acToca();
      if(t.hasAttribute('data-gzopen')){e.preventDefault();e.stopPropagation();var dw=$('drw');
        /* S56: pelo menu, o menu fecha por completo (e o histórico assenta) antes de a tela do grau entrar */
        /* S69: no celular o menu pode demorar a fechar — ele é fechado e escondido à força antes de a tela do grau abrir */
        if(dw&&dw.classList.contains('on')){var de=window.__lfTela?window.__lfTela():T('Início');var x=document.querySelector('#drw .dsc[data-dclose],#drw [data-dclose]');if(x)x.click();
          dw.style.visibility='hidden';dw.classList.remove('on');var n=0,esp=function(){if(n++<12&&history.state&&history.state.lfo==='drw'){setTimeout(esp,50);return}abre(de);setTimeout(function(){dw.style.visibility=''},700)};setTimeout(esp,60)}else abre();return}
      if(!Z.el||!Z.el.contains(t))return;e.preventDefault();var k=t.getAttribute('data-gz');
      if(Z.m&&(k==='sim'||k==='nao')){var r=t.getBoundingClientRect();Z.m.olhaPara(r.left+r.width*.6,r.top+r.height/2)}
      if(k==='x'){fecha();return}
      if(k==='mudo'){try{localStorage.setItem('lf_gzmudo',mudo()?'0':'1')}catch(_){}t.innerHTML=mudo()?MUT:SPK;/* S-mudo (12/11): silencia sem pausar — a frase segue e termina, a conversa não trava */if(VZ.a)try{VZ.a.muted=mudo()}catch(_){}if(mudo()){try{speechSynthesis.cancel()}catch(_){}}return}
      if(k==='comeca'){comeca(t);return}
      if(k==='camsim'||k==='camnao'){if(Z.fase!=='cam'||Z.escolheu)return;Z.escolheu=1;t.classList.add('gd');corta();(k==='camsim'?camSim:semCam)();return}
      if(k==='luzok'||k==='luzseg'){if(!Z.luzP||Z.fase!=='teste')return;corta();(k==='luzok'?luzOk:function(){Z.escuro=1;luzFim()})();return}
      if(k==='emb'||k==='nemb'){if(Z.fase!=='pp'||Z.ppOc||Z.ppTrava)return;Z.ppOc=1;setTimeout(function(){Z.ppOc=0},800);corta();(function(){if(Z.fase!=='pp')return;if(k==='nemb'){ppTrava(null);return}var d0=ppAgora();if(d0!=null){ppTrava(d0);return}/* sem medida fresca (rosto fora do quadro): espera o celular parar, como antes */var bt0=q('#gzbt .gzgo');if(bt0){bt0.disabled=true;bt0.style.opacity='.42'}ppMede(function(d){ppPonto(d)})})();return}
      if(k==='sim'){responde(true);return}if(k==='nao'){responde(false);return}
      if(k==='inicio'){fecha();setTimeout(function(){var l=document.querySelector('.top .logo');if(l)l.click()},300);return}
      if(k==='mais'||k==='menos'){Z.g=Math.max(.25,Math.min(4,Z.g+(k==='mais'?.25:-.25)));var gv=$('gzgv'),gl=$('gzgl'),vb=$('gzver');if(gv)gv.textContent=gf(Z.g);if(gl)gl.textContent=Z.g===Z.G?T('sugerido'):T('Sugerido: ')+gf(Z.G);if(vb)vb.textContent=T('Ver óculos de leitura')+' '+gf(Z.g);if(Z.m){Z.m.sim()}return}
      if(k==='guarda'){var gg=Z.g;try{localStorage.setItem('lf_meugr',gf(gg))}catch(_){}fecha();toast(T('Grau guardado')+': '+gf(gg));try{if(st.tipo==='grau'&&document.documentElement.classList.contains('ppop')&&!prodOpen){st.fgr=perto(gg);drawGrid()}gzFaixa();}catch(_){}return}
      if(k==='ver'){var g=Z.g;fecha();var go=function(){st.fgr=perto(g);navAbreCat('grau')};if(prodOpen)navApos(go);else go();return}},true);
    window.__LFGZ={Z:Z,escala:escala,L:L,pp:function(G){ppIni(G,0)}};window.__lfGzAbre=function(){abre()};window.__lfGzPtr=function(){return Z.fase!=='pp'};
    /* faixa na Leitura (topo, antes dos óculos) */
    var EF='';
    function gzFaixa(){var vs=$('vscr'),g=$('grid');if(!vs||!g)return;var f=$('gzf');
      if(st.tipo!=='grau'){if(f)f.hidden=true;EF='';return}
      var m=meu(),q=P.filter(function(p){return p.tipo==='grau'&&p.foto})[0];
      if(!f){f=document.createElement('button');f.type='button';f.id='gzf';f.className='gz';f.setAttribute('data-gzopen','');g.parentNode.insertBefore(f,g)}
      f.hidden=false;var h='<span class="gi">'+(q?'<img src="'+esc(q.foto)+'" alt="">':'')+'</span><span><small>'+(m?T('SEU GRAU'):T('1 MINUTO · COM VOZ'))+'</small><b>'+(m?esc(m)+' · '+T('Refazer'):T('Não sabe o seu grau?'))+'</b></span><i aria-hidden="true">›</i>';if(f._h!==h){f.innerHTML=h;f._h=h}
      /* com o grau guardado, a Leitura já abre filtrada nele */
      if(m&&EF!=='grau'){var b=perto(gn(m));if(b&&!st.fgr){st.fgr=b;try{drawGrid()}catch(_){}}}EF='grau'}
    var _vgr=vgrDraw;vgrDraw=function(){var r=_vgr.apply(this,arguments);try{gzFaixa()}catch(_){}return r};
    /* botão grande na peça de leitura, logo abaixo dos graus */
    function gzPecaGrau(){var L=document.querySelector('#layer .dgr');if(!L)return;var p=find(prodRef),m=meu();if(!p||p.tipo!=='grau'||!p.gr||!m||L._ap===p.ref)return;L._ap=p.ref;
      var bs=[].slice.call(L.querySelectorAll('.gb')).filter(function(x){return x.style.display!=='none'&&!x.classList.contains('some')&&!x.classList.contains('nc')&&!x.classList.contains('x')}),bb=null,dd=1e9;
      bs.forEach(function(x){var z=Math.abs(gn(x.textContent)-gn(m));if(z<dd-1e-9||(bb&&Math.abs(z-dd)<1e-9&&gn(x.textContent)>gn(bb.textContent))){dd=z;bb=x}});if(bb&&!bb.classList.contains('on'))bb.click()}
    
    var _prGz=product;product=function(ref,pop){var r=_prGz.apply(this,arguments);/* 09/11 S44: o botão saiu da peça (fica a faixa na Leitura e o menu); com o grau guardado a peça ainda abre no grau mais perto */[0,320,950].forEach(function(t){setTimeout(function(){try{gzPecaGrau()}catch(_){}},t)});return r};
  })();
  /* 4: "Você estava vendo" — quem volta em outro dia (até 7 dias); some se o modelo esgotar ou sair */
  /* 08/11 (aprovado): aparece na PRÓXIMA visita (mesmo dia ou outro) — visita nova = abrir o site de novo ou voltar após 30 min sem usar;
     se passar 2 dias sem ver nenhuma peça, não aparece mais. Some ao tocar, se esgotar ou sair do site. */
  var NAV_ST=null;try{var _l4=JSON.parse(localStorage.getItem('lf_lastv')||'null'),_ua=+localStorage.getItem('lf_uact')||0,_nv=!sessionStorage.getItem('lf_vis2')||Date.now()-_ua>18e5;
    if(_l4&&_l4.r&&_nv&&Date.now()-_l4.t<2*864e5)NAV_ST=_l4.r;
    /* 09/11 S36 (aprovado): a peça escolhida no começo da visita fica guardada; atualizar a página não apaga o aviso */
    if(_nv){if(NAV_ST)sessionStorage.setItem('lf_lvv',NAV_ST);else sessionStorage.removeItem('lf_lvv')}else{var _vv=sessionStorage.getItem('lf_lvv');if(_vv)NAV_ST=_vv}
    sessionStorage.setItem('lf_vis2','1')}catch(_){}
  (function(){var u=0,f=function(){var n=Date.now();if(n-u<6e4)return;u=n;try{localStorage.setItem('lf_uact',String(n))}catch(_){}};f();['pointerdown','keydown','scroll'].forEach(function(t){addEventListener(t,f,{passive:true,capture:true})})})();
  var _homeHtmlNv=homeHtml;homeHtml=function(){var h=_homeHtmlNv.apply(this,arguments),p=NAV_ST&&find(NAV_ST);
    if(!p||!vis5(p)||p.aviso==='Esgotado')return h;
    return '<button type="button" class="hlv" data-open="'+esc(p.ref)+'"><span class="hlvi">'+img5(p)+'</span><span class="hlvt"><small>'+LFI.tr('Você estava vendo')+'</small><b>'+esc(p.nome)+'</b></span><i aria-hidden="true">›</i></button>'+h};
  /* 5: âncora do cartão tocado; ao voltar, a lista fica exatamente onde estava (mesmo com fotos ainda carregando) */
  /* ===== S420 TRILHO ÚNICO (aprovado 15/11: regra lógica da pílula S330f §8 + arrastar §5 + abas da Minha conta §6) =====
     A seleção é UM objeto só: uma pílula permanente por trilho (nunca criada/apagada na troca), medida do botão escolhido,
     só transform (deslocar + esticar o meio), letra branca recortada pela própria pílula (camada presa nela, clip-path),
     o trilho não é redesenhado na troca; aceita o dedo arrastando (solta na opção mais perto). Usado em .mct (Minha conta). */
  var TKZ=(function(){function bz(x1,y1,x2,y2){function a(t,p1,p2){var u=1-t;return 3*u*u*t*p1+3*u*t*t*p2+t*t*t}return function(x){if(x<=0)return 0;if(x>=1)return 1;var lo=0,hi=1,t=x;for(var i=0;i<26;i++){t=(lo+hi)/2;if(a(t,x1,x2)<x)lo=t;else hi=t}return a(t,y1,y2)}}return bz(.16,1,.3,1)})();
  var TKRM=matchMedia('(prefers-reduced-motion: reduce)');
  (function(){var s=document.createElement('style');s.id='lftk';s.textContent='.lfTk{position:relative;touch-action:pan-y;-webkit-user-select:none;user-select:none}.lfTk>button{position:relative;z-index:1}.lfTk>button.on{background:transparent!important}'+
    '.lfTk>.lfP{position:absolute;left:0;top:0;width:0;height:0;z-index:0;pointer-events:none}.lfTk>.lfP>b{position:absolute;left:0;top:0;display:block;background:var(--tkc,#a24a80);will-change:transform}.lfTk>.lfP>b.m{width:64px;transform-origin:0 0}'+
    '.lfTk>.lfPt{position:absolute;left:0;top:0;z-index:2;pointer-events:none;overflow:hidden}.lfTk>.lfPt>button{position:absolute!important;margin:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;border-color:transparent!important;flex:none!important;min-width:0!important;box-sizing:border-box;pointer-events:none}';
    document.head.appendChild(s)})();
  function tkBts(el){return [].filter.call(el.children,function(b){return b.tagName==='BUTTON'})}
  function tkMede(T){var bs=tkBts(T.el);T.m=bs.map(function(b){return {x:b.offsetLeft,y:b.offsetTop,w:b.offsetWidth,h:b.offsetHeight}});T.W=T.el.clientWidth;T.H=T.el.clientHeight;
    T.t.style.width=T.W+'px';T.t.style.height=T.H+'px';
    var cl=T.t.children;bs.forEach(function(b,i){var c=cl[i],m=T.m[i];if(!c)return;c.style.left=m.x+'px';c.style.top=m.y+'px';c.style.width=m.w+'px';c.style.height=m.h+'px'})}
  function tkSel(T){var bs=tkBts(T.el);for(var i=0;i<bs.length;i++)if(bs[i].classList.contains('on'))return i;return -1}
  function tkPoe(T,x,y,w,h){T.c={x:x,y:y,w:w,h:h};var r=h/2,p=T.p.children,mw=Math.max(0,w-2*r);
    p[0].style.cssText='width:'+r+'px;height:'+h+'px;border-radius:'+r+'px 0 0 '+r+'px;transform:translate('+x+'px,'+y+'px)';
    p[1].style.cssText='height:'+h+'px;transform:translate('+(x+r-1)+'px,'+y+'px) scaleX('+((mw+2)/64)+')'/* S429: meio com 64 px de base (sem borrão na borda) e 1 px a mais em cada ponta = sem emenda */;
    p[2].style.cssText='width:'+r+'px;height:'+h+'px;border-radius:0 '+r+'px '+r+'px 0;transform:translate('+(x+w-r)+'px,'+y+'px)';
    var cp='inset('+y+'px '+Math.max(0,T.W-x-w)+'px '+Math.max(0,T.H-y-h)+'px '+x+'px round '+r+'px)';T.t.style.clipPath=cp;T.t.style.webkitClipPath=cp;T.p.style.opacity=w>0?'1':'0'}
  function tkVai(T,i,anima){cancelAnimationFrame(T.raf);T.anim=0;var m=T.m[i];if(!m){T.p.style.opacity='0';T.t.style.clipPath='inset(50%)';return}
    var a=T.c;if(!anima||!a||TKRM.matches||document.hidden){tkPoe(T,m.x,m.y,m.w,m.h);return}
    var t0=performance.now(),D=300,a0={x:a.x,y:a.y,w:a.w,h:a.h};T.anim=1;var f=function(tt){var k=Math.min(1,(tt-t0)/D),e=TKZ(k),m2=T.m[i]||m;tkPoe(T,a0.x+(m2.x-a0.x)*e,a0.y+(m2.y-a0.y)*e,a0.w+(m2.w-a0.w)*e,a0.h+(m2.h-a0.h)*e);if(k<1)T.raf=requestAnimationFrame(f);else T.anim=0};T.raf=requestAnimationFrame(f)}
  function lfTrilho(el){if(!el||el.__tk)return el&&el.__tk;var bs=tkBts(el);if(bs.length<2)return null;var on=bs.filter(function(b){return b.classList.contains('on')})[0];
    var cor=on?getComputedStyle(on).backgroundColor:'';el.classList.add('lfTk');if(cor&&cor!=='rgba(0, 0, 0, 0)')el.style.setProperty('--tkc',cor);
    var p=document.createElement('i');p.className='lfP';p.setAttribute('aria-hidden','true');p.innerHTML='<b class="l"></b><b class="m"></b><b class="r"></b>';el.insertBefore(p,el.firstChild);
    var t=document.createElement('span');t.className='lfPt';t.setAttribute('aria-hidden','true');t.inert=true;bs.forEach(function(b){var c=b.cloneNode(true);c.classList.remove('on');[].slice.call(c.attributes).forEach(function(x){if(/^(data-|id$|aria-|role$)/.test(x.name))c.removeAttribute(x.name)});c.setAttribute('tabindex','-1');c.removeAttribute('role');c.removeAttribute('aria-selected');t.appendChild(c)});el.appendChild(t);
    var T={el:el,p:p,t:t,c:null,raf:0,sel:-1};el.__tk=T;tkMede(T);T.sel=tkSel(T);tkVai(T,T.sel,false);
    /* troca de opção: anima do lugar onde a pílula ESTÁ (também no meio de outra troca ou depois de arrastar) */
    T.mo=new MutationObserver(function(){var i=tkSel(T);if(i===T.sel)return;T.sel=i;tkVai(T,i,true)});bs.forEach(function(b){T.mo.observe(b,{attributes:true,attributeFilter:['class']})});
    /* medida nova quando muda tamanho de tela, letra, idioma ou a fonte termina de carregar */
    var re=function(){if(!el.isConnected)return;tkMede(T);if(!T.drag&&!T.anim)tkVai(T,T.sel,false)}/* no meio de uma troca a pílula só segue o alvo novo (sem pulo) */;
    if(window.ResizeObserver){T.ro=new ResizeObserver(re);T.ro.observe(el)}if(document.fonts&&document.fonts.ready)document.fonts.ready.then(re);
    /* arrastar com o dedo (ou mouse): a pílula segue o dedo e, ao soltar, fica na opção mais perto */
    var x0=0,y0=0,c0=null,moveu=0,pid=null;
    el.addEventListener('pointerdown',function(e){if(e.button>0||!T.c)return;pid=e.pointerId;x0=e.clientX;y0=e.clientY;c0={x:T.c.x,y:T.c.y,w:T.c.w,h:T.c.h};moveu=0;T.drag=0});
    el.addEventListener('pointermove',function(e){if(pid!==e.pointerId)return;var z=parseFloat(getComputedStyle(document.body).zoom)||1,dx=(e.clientX-x0)/z,dy=(e.clientY-y0)/z;
      if(!T.drag){if(Math.abs(dx)<7)return;if(Math.abs(dy)>Math.abs(dx)){pid=null;return}T.drag=1;moveu=1;cancelAnimationFrame(T.raf);try{el.setPointerCapture(pid)}catch(_){}}
      var L=T.m,x=Math.max(L[0].x,Math.min(L[L.length-1].x,c0.x+dx)),k=0;for(var i=0;i<L.length-1;i++)if(x>=L[i].x)k=i;var a=L[k],b=L[k+1]||a,f=b.x>a.x?(x-a.x)/(b.x-a.x):0;
      tkPoe(T,x,a.y+(b.y-a.y)*f,a.w+(b.w-a.w)*f,a.h+(b.h-a.h)*f)});
    var solta=function(e){if(pid!==e.pointerId)return;pid=null;if(!T.drag)return;T.drag=0;var L=T.m,x=T.c.x,best=0;for(var i=0;i<L.length-1;i++)if(x>=L[i].x)best=x-L[i].x>(L[i+1].x-L[i].x)/2?i+1:i;
      setTimeout(function(){moveu=0},60);if(best!==T.sel){var b=tkBts(el)[best];if(b)b.click()}else tkVai(T,T.sel,true)};
    el.addEventListener('pointerup',solta);el.addEventListener('pointercancel',function(e){if(pid!==e.pointerId)return;pid=null;if(T.drag){T.drag=0;tkVai(T,T.sel,true)}});
    el.addEventListener('click',function(e){if(moveu&&e.isTrusted){moveu=0;e.preventDefault();e.stopImmediatePropagation()}},true);
    return T}
  window.__lfTrilho=lfTrilho;
  /* (os trilhos .seg do menu antigo estão escondidos desde o menu novo com listas ✓: hoje o único trilho visível do site é o da Minha conta) */
  /* Minha conta: trocar de aba NÃO redesenha o trilho (a mesma pílula segue), o conteúdo antigo sai em 0,12 s e o novo entra do lado da aba tocada */
  /* S422: a Minha conta numa função só — S370 (já aberta: só sobe ao topo) → desenho (mcTela) → entrada B1 (mcEntra) → trilho único (S420) */
  minhaConta=function(aba,edita){
    if(!arguments.length&&st._ab==='conta'&&$('layer').firstChild&&$('layer').querySelector('[aria-label="Minha conta"],.mct')){ab370Topo();return}
    var m0=document.querySelector('#layer .mct'),pn0=m0&&m0.parentNode,A0=st.mcAba,troca=!!(m0&&m0.__tk&&typeof aba==='string'&&aba!==A0&&edita==null),velho=[],de=-1,y0=0,sc0=0;
    if(troca){var k=0,bs0=tkBts(m0);de=tkSel(m0.__tk);[].slice.call(pn0.children).forEach(function(e){if(k)velho.push(e);if(e===m0)k=1});y0=m0.offsetTop+m0.offsetHeight;var scr0=pn0.closest('.scrim');sc0=pn0.scrollTop}
    window.__lfTk2=troca?1:0;var r;try{var aberto=!!document.querySelector('#layer [aria-label="Minha conta"]');mcTela(aba,edita);mcEntra(aberto);if($('layer').firstChild&&$('layer').querySelector('[aria-label="Minha conta"],.mct'))st._ab='conta'}finally{window.__lfTk2=0}
    var m=document.querySelector('#layer .mct'),pn=m&&m.parentNode;if(!m)return r;
    if(troca&&m!==m0){var nb=tkBts(m),ob=tkBts(m0);if(nb.length===ob.length){
        var scN=pn.closest('.scrim');if(scN)scN.classList.add('mcLx');
        m.parentNode.replaceChild(m0,m);ob.forEach(function(b,i){var n=nb[i];b.className=n.className;b.setAttribute('aria-selected',n.getAttribute('aria-selected')||'false');b.textContent!==n.textContent&&(b.innerHTML=n.innerHTML)});m=m0;
        var para=tkSel(m0.__tk),s=para>de?1:-1,novo=[],k2=0;[].slice.call(pn.children).forEach(function(e){if(k2)novo.push(e);if(e===m0)k2=1});
        if(MOV()&&velho.length){if(getComputedStyle(pn).position==='static')pn.style.position='relative';
          var ov=document.createElement('div');ov.className='mcOld';ov.setAttribute('aria-hidden','true');ov.inert=true;ov.style.cssText='position:absolute;left:0;right:0;top:'+y0+'px;padding:0 '+getComputedStyle(pn).paddingRight+' 0 '+getComputedStyle(pn).paddingLeft+';box-sizing:border-box;pointer-events:none;z-index:3';
          velho.forEach(function(e){ov.appendChild(e)});ov.querySelectorAll('[id]').forEach(function(e){e.removeAttribute('id')});pn.appendChild(ov);
          var a=ov.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateX('+(-14*s)+'px)'}],{duration:120,easing:'ease-out',fill:'forwards'});a.onfinish=function(){ov.remove()};setTimeout(function(){ov.remove()},400);
          novo.forEach(function(e){try{e.getAnimations().forEach(function(x){x.cancel()})}catch(_){}e.animate([{opacity:0,transform:'translateX('+(22*s)+'px)'},{opacity:1,transform:'none'}],{duration:320,delay:70,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})})}}}
    else{lfTrilho(m)}
    /* Cartões: o "Carregando…" troca para o conteúdo no mesmo lugar, cruzando (sem sumir seco) */
    var mt=pn.querySelector('#mtj');if(mt&&!mt.__mo&&MOV()){mt.__mo=new MutationObserver(function(){var h=mt.offsetHeight;[].forEach.call(mt.children,function(e){e.animate([{opacity:0},{opacity:1}],{duration:220,easing:'ease-out'})})});mt.__mo.observe(mt,{childList:true})}
    return r};
  /* ===== S301 GIRO GIRÁVEL na página da peça (aprovado S260 v3 + S264; vídeo direto decidido em 14/11/2026) =====
     O app publica em produtos/<ref>: gv = endereço do vídeo do giro TRATADO (toda imagem inteira, começa pela frente, 30 por segundo),
     gn = quantas imagens tem a volta (ex. 360) e gvc = de qual cor é o giro (0 = primeira). Sem gn vale o botão "360°" antigo.
     O arquivo inteiro vem para a memória (2–3 MB) e arrastar de lado troca a imagem na hora (video.currentTime). Giro livre com embalo,
     aceno ao abrir, dica "Deslize para girar", pílula "Vista inicial", três pontos (frente · 3/4 · perfil). Tocar/pinça continua ampliando. */
  var GG/* sem '=null': ao abrir direto numa peça (?ref=) o giro é montado ANTES desta linha rodar, e zerar aqui apagava o giro em andamento */,GG_IC='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 5v4h4"/></svg>';
  function ggPode(p){return !!(p&&p.gv&&+p.gn>1&&window.fetch&&window.URL&&URL.createObjectURL)}
  function ggSai(){var g=GG;GG=null;if(!g)return;try{if(g.v){g.v.pause();g.v.removeAttribute('src');g.v.load();if(g.v.parentNode)g.v.parentNode.removeChild(g.v)}if(g.url)URL.revokeObjectURL(g.url)}catch(_){}
    if(g.big){g.big.classList.remove('gg');g.big.querySelectorAll('.ggp,.ggd').forEach(function(x){x.remove()})}}
  function ggMonta(p){var big=document.querySelector('#layer .pgm .big');if(GG&&(GG.big!==big||GG.ref!==(p&&p.ref)||(st.cor[p.ref]||0)!==(+p.gvc||0)))ggSai();
    if(!big||!ggPode(p)||(st.cor[p.ref]||0)!==(+p.gvc||0)||GG)return;
    var g=GG={ref:p.ref,big:big,n:+p.gn,fps:30,ang:0,vel:0,mostr:-1,quer:0,busc:false,toc:false,ok:false,arr:false};
    fetch('/'+String(p.gv).replace(/^\/+/,'')).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){if(GG!==g||!big.isConnected)return;
      var v=document.createElement('video');v.className='pf ggv';v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');v.disablePictureInPicture=true;v.preload='auto';
      g.url=URL.createObjectURL(b);g.v=v;
      v.addEventListener('seeked',function(){g.busc=false;g.mostr=g.quer;ggPinta(g)});
      v.addEventListener('error',function(){if(GG===g)ggSai()});
      v.addEventListener('loadeddata',function(){if(g.ok||GG!==g||!big.isConnected)return;g.ok=true;v.style.visibility='';try{v.currentTime=.5/g.fps}catch(_){}
        big.classList.add('gg');big.insertAdjacentHTML('beforeend','<button type="button" class="ggp on dica" aria-label="'+LFI.tr('Voltar à vista inicial')+'">'+GG_IC+'<span>'+LFI.tr('Deslize para girar')+'</span></button><span class="ggd" aria-hidden="true"><i class="on"></i><i></i><i></i></span>');
        if(!NAV_RM.matches)setTimeout(function(){ggAcena(g)},600)});
      v.style.visibility='hidden';big.insertBefore(v,big.firstChild);/* o vídeo já entra na página (escondido): solto, alguns navegadores não carregam */v.src=g.url;v.load()}).catch(function(){if(GG===g)GG=null})}
  function ggPinta(g){if(!g.ok||g.busc)return;var q=((Math.round(g.ang/360*g.n)%g.n)+g.n)%g.n;
    var a=Math.abs(((g.ang%360)+540)%360-180),bb=a>90?180-a:a,k=bb<22.5?0:bb<67.5?1:2,ds=g.big.querySelectorAll('.ggd i');for(var i=0;i<ds.length;i++)ds[i].classList.toggle('on',i===k);
    if(q===g.mostr)return;g.busc=true;g.quer=q;try{g.v.currentTime=(q+.5)/g.fps}catch(_){g.busc=false}}
  function ggVista(g){var pl=g.big.querySelector('.ggp');if(!pl||!g.toc)return;var fora=Math.abs(((g.ang%360)+540)%360-180)>6;pl.classList.remove('dica');pl.querySelector('span').textContent=LFI.tr('Vista inicial');pl.classList.toggle('on',fora&&!g.arr)}
  function ggAcena(g){if(g.toc||GG!==g)return;var i0=performance.now();(function f(){if(g.toc||GG!==g)return;var t=Math.min(1,(performance.now()-i0)/1200);g.ang=20*Math.sin(t*Math.PI);ggPinta(g);if(t<1)requestAnimationFrame(f);else{g.ang=0;ggPinta(g)}})()}
  document.addEventListener('pointerdown',function(e){var g=GG;if(!g||!g.ok||!g.big.isConnected||!g.big.contains(e.target)||(e.target.closest&&e.target.closest('.dfav,.ggp'))||g.big.classList.contains('zm')||(e.pointerType==='mouse'&&e.button!==0))return;
    g.pid=e.pointerId;g.px=e.clientX;g.py=e.clientY;g.pt=performance.now();g.dec=false;g.hor=false;g.vel=0;g.arr=true;
    if(!g.toc){g.toc=true;var pl=g.big.querySelector('.ggp');if(pl)pl.classList.remove('on');try{var pr=g.v.play();if(pr&&pr.then)pr.then(function(){g.v.pause()}).catch(function(){})}catch(_){}}},true);
  document.addEventListener('pointermove',function(e){var g=GG;if(!g||!g.arr||e.pointerId!==g.pid)return;if(g.big.classList.contains('zm')||g.big.classList.contains('dg')){g.arr=false;return}
    var dx=e.clientX-g.px,dy=e.clientY-g.py;if(!g.dec){if(Math.abs(dx)<6&&Math.abs(dy)<6)return;g.dec=true;g.hor=Math.abs(dx)>=Math.abs(dy);if(!g.hor){g.arr=false;return}g.big.classList.add('ggr')}
    var a=performance.now(),dt=Math.max(1,a-g.pt),gr=220/Math.max(200,g.big.clientWidth);g.ang-=dx*gr;g.vel=-dx*gr/dt;g.px=e.clientX;g.py=e.clientY;g.pt=a;ggPinta(g);e.preventDefault()},{passive:false,capture:true});
  function ggSolta(e){var g=GG;if(!g||!g.arr||(e&&e.pointerId!==g.pid))return;g.arr=false;g.big.classList.remove('ggr');if(!g.hor){ggVista(g);return}
    var u=performance.now();(function f(){if(g.arr||GG!==g)return;var a=performance.now(),dt=a-u;u=a;g.ang+=g.vel*dt;g.vel*=Math.pow(.994,dt);ggPinta(g);if(Math.abs(g.vel)>.01)requestAnimationFrame(f);else ggVista(g)})();ggVista(g)}
  document.addEventListener('pointerup',ggSolta,true);document.addEventListener('pointercancel',ggSolta,true);
  /* arrastou para girar: o toque que sobra não pode virar "ampliar" */
  document.addEventListener('click',function(e){var g=GG;if(!g||!g.big.isConnected)return;var pl=e.target.closest&&e.target.closest('.ggp');
    if(pl&&g.big.contains(pl)){e.preventDefault();e.stopPropagation();var a0=g.ang,alvo=Math.round(a0/360)*360,i0=performance.now();pl.classList.remove('on');
      if(NAV_RM.matches){g.ang=0;ggPinta(g);return}(function f(){if(GG!==g)return;var t=Math.min(1,(performance.now()-i0)/560),k=1-Math.pow(1-t,3);g.ang=a0+(alvo-a0)*k;ggPinta(g);if(t<1)requestAnimationFrame(f);else{g.ang=0;ggVista(g)}})()}},true);
  document.addEventListener('touchmove',function(e){var g=GG;if(g&&g.arr&&g.hor)e.preventDefault()},{passive:false});
  /* a página da peça é redesenhada por vários caminhos (abrir, voltar, trocar de peça): em vez de depender de cada um, olha a camada e monta o giro na peça que estiver aberta */
  try{var ggT=0;new MutationObserver(function(){clearTimeout(ggT);ggT=setTimeout(function(){try{var p=prodOpen&&prodRef?find(prodRef):null;if(p)ggMonta(p);else if(GG&&!(GG.big&&GG.big.isConnected))ggSai()}catch(_){}},60)}).observe($('layer'),{childList:true})}catch(_){}
  var NAV_AN=null,NAV_CK=null;
  document.addEventListener('click',function(e){var o=e.target.closest&&e.target.closest('[data-open]');if(!o||prodOpen||o.closest('#sov,#fvs,#layer'))return;
    var H=document.documentElement,vs=H.classList.contains('ppop')?$('vscr'):null;NAV_CK={el:o,ref:o.getAttribute('data-open'),top:o.getBoundingClientRect().top,vs:vs,ts:Date.now()}},true);
  var _productNv=product;product=function(ref,pop){var q=find(ref);
    if(!prodOpen&&!pop){NAV_AN=NAV_CK&&NAV_CK.ref===ref&&Date.now()-NAV_CK.ts<2500?NAV_CK:null;if(NAV_ST===ref){NAV_ST=null;try{sessionStorage.removeItem('lf_lvv')}catch(_){}setTimeout(function(){document.querySelectorAll('#home .hlv').forEach(function(x){x.remove()})},350)}}
    if(q&&st.tipo==='grau'&&st.fgr&&q.gr){var gi=q.gr.indexOf(st.fgr);if(gi>=0)st.gr[ref]=gi}
    if(q)navVistoPoe(ref);
    return _productNv.apply(this,arguments)};
  var _closeLayerNv=closeLayer;closeLayer=function(){var L0=$('layer'),was=!!(L0&&L0.querySelector('.scrim.pg')),A=NAV_AN,r=_closeLayerNv.apply(this,arguments);
    if(was&&A){NAV_AN=null;var parou=false,pa=function(){parou=true};addEventListener('touchstart',pa,{passive:true,once:true});addEventListener('wheel',pa,{passive:true,once:true});
      var ap=function(){if(parou)return;var el=A.el&&A.el.isConnected?A.el:document.querySelector((A.vs?'#vscr ':'')+'[data-open="'+A.ref+'"]');if(!el||!el.getClientRects().length)return;
        var d=el.getBoundingClientRect().top-A.top;if(Math.abs(d)<2)return;if(A.vs)A.vs.scrollTop+=d;else window.scrollBy(0,d)};
      ap();requestAnimationFrame(ap);[120,350,800].forEach(function(t){setTimeout(ap,t)})}
    return r};
  /* 08/11 Ajuda (aprovado): sanfona Como comprar / Dúvidas / Guia — abrir uma fecha a anterior; #duvidas abre a Ajuda já em Dúvidas */
  function ajAbre(id,so){var L=document.querySelectorAll('#como .ajI');L.forEach(function(x){var on=x.id===id&&(so||!x.classList.contains('on'));x.classList.toggle('on',on);var b=x.querySelector('.ajB');if(b)b.setAttribute('aria-expanded',on?'true':'false')})}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#como .ajB');if(!b)return;e.preventDefault();ajAbre(b.parentNode.id)});
  var _openPanelAj=openPanel;openPanel=function(id,q){if(id==='duvidas'){_openPanelAj('como',q);ajAbre('ajDuv',1);return}if(id==='como')ajAbre('',0);return _openPanelAj.apply(this,arguments)};
  var _goToAj=goTo;goTo=function(id){if(id==='duvidas'){_goToAj('como');ajAbre('ajDuv',1);return}return _goToAj.apply(this,arguments)};

  /* ===== 08/11 LaFouch (aprovado) =====
     1) CORTINA: ao abrir/atualizar um endereço (produto, carrinho, conta) a página inteira fica só no fundo liso
        até a tela final estar desenhada — nada de outra tela por baixo, nada entrando com animação.
     2) ENQUADRAMENTO AUTOMÁTICO: o site mede onde a armação está em cada foto e mostra uma cópia em que todas
        ficam do mesmo tamanho, centralizadas e sem encostar na borda. Vale para fotos novas sem ajuste à mão.
     3) PRÉVIA DAS CORES nos cartões: tocar na bolinha mostra a foto daquela cor; tocar no cartão abre já nela. */
  function lfBootFim(){var H=document.documentElement;if(!H.classList.contains('bootprod')||lfBootFim.on)return;lfBootFim.on=1;
    var t0=Date.now(),fim=function(){document.querySelectorAll('#layer img').forEach(function(i){i.style.animation='none'});requestAnimationFrame(function(){requestAnimationFrame(function(){H.classList.remove('bootprod');lfBootFim.on=0})})};
    (function espera(){var im=document.querySelector('#layer .big img.pf, #layer img');if(!im||im.complete||Date.now()-t0>900)fim();else setTimeout(espera,40)})()}
  var LFQ_CFG=[['#home .hc .hci img',.80,.60,.56],['#home .hcat .hci img',.94,.88,.50],['#hdst .hdi img, .hd .hdi img',.90,.84,.52],['#grid .ph img.pf',.80,.56,.55],['.srv img',.86,.78,.50]];
  var LFQ_SEL=LFQ_CFG.map(function(c){return c[0]}).join(','),LFQ_C={},LFQ_PEND={};
  var LFQ_RO=window.ResizeObserver?new ResizeObserver(function(E){E.forEach(function(en){var im=en.target;if(im.clientWidth>4&&im.clientHeight>4&&im.classList.contains('lfq0'))lfqFaz(im)})}):null;
  function lfqCfg(im){for(var i=0;i<LFQ_CFG.length;i++)if(im.matches(LFQ_CFG[i][0]))return LFQ_CFG[i];return null}
  function lfqMede(img){/* caixa da armação: tudo que difere do fundo (média dos 4 cantos da foto) */
    var W=96,H=Math.max(8,Math.round(W*img.naturalHeight/img.naturalWidth)),c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,W,H);
    var d=x.getImageData(0,0,W,H).data,k=function(i){return [d[i],d[i+1],d[i+2]]},cs=[k(0),k((W-1)*4),k((H-1)*W*4),k(((H-1)*W+W-1)*4)],bg=[0,1,2].map(function(j){return Math.round((cs[0][j]+cs[1][j]+cs[2][j]+cs[3][j])/4)});
    var x0=W,y0=H,x1=-1,y1=-1;for(var y=0;y<H;y++)for(var xx=0;xx<W;xx++){var i=(y*W+xx)*4;if(Math.abs(d[i]-bg[0])+Math.abs(d[i+1]-bg[1])+Math.abs(d[i+2]-bg[2])>42){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(y<y0)y0=y;if(y>y1)y1=y}}
    if(x1<0)return null;return {x:x0/W,y:y0/H,w:(x1-x0+1)/W,h:(y1-y0+1)/H,bg:'rgb('+bg.join(',')+')'}}
  /* 09/11 S46 (aprovado): o enquadramento fica guardado no aparelho (IndexedDB), então ao atualizar a foto já aparece pronta;
     e uma foto que já está na tela nunca some: a nova é preparada por trás e só troca quando pronta */
  var LFQ_DB=null;function lfqDb(){if(LFQ_DB)return LFQ_DB;LFQ_DB=new Promise(function(ok){try{var r=indexedDB.open('lf_lfq',1);r.onupgradeneeded=function(){r.result.createObjectStore('q')};r.onsuccess=function(){ok(r.result)};r.onerror=function(){ok(null)}}catch(_){ok(null)}});return LFQ_DB}
  function lfqDbGet(k){return lfqDb().then(function(db){if(!db)return null;return new Promise(function(ok){try{var q=db.transaction('q').objectStore('q').get(k);q.onsuccess=function(){ok(q.result||null)};q.onerror=function(){ok(null)}}catch(_){ok(null)}})})}
  function lfqDbPut(k,b){lfqDb().then(function(db){if(!db||!b)return;try{db.transaction('q','readwrite').objectStore('q').put(b,k)}catch(_){}})}
  /* S426 (travadas aprovadas 18/11): fila do enquadramento das fotos — uma por vez, cedendo a tela entre elas */
  var LFQ_F=[],LFQ_R=0;function lfqFila(fn){LFQ_F.push(fn);if(LFQ_R)return;LFQ_R=1;var anda=function(){var t0=performance.now();while(LFQ_F.length&&performance.now()-t0<8){try{LFQ_F.shift()()}catch(_){}}if(LFQ_F.length)setTimeout(function(){requestAnimationFrame(anda)},0);else LFQ_R=0};requestAnimationFrame(anda)}
  function lfqFaz(im,src0){var cf=lfqCfg(im),src=src0||im.getAttribute('src')||'';im._lfqWant=src;if(!cf||!src||/^blob:/.test(src)){im.classList.remove('lfq0');return}
    var bw=im.clientWidth,bh=im.clientHeight;if(!(bw>4&&bh>4)){/* ainda invisível: enquadra quando aparecer */if(LFQ_RO){if(!im._lfqRo){im._lfqRo=1;LFQ_RO.observe(im)}}else im.classList.remove('lfq0');return}
    if(im._lfqRo&&LFQ_RO){im._lfqRo=0;LFQ_RO.unobserve(im)}
    var fit=getComputedStyle(im).objectFit,nat=(fit!=='contain'&&fit!=='cover')||!!im.closest('.hdi'),
      key=src.length+':'+src.slice(0,60)+src.slice(-60)+'|'+cf[0]+'|'+(nat?'n':(bw/bh).toFixed(2));
    var ok=function(u){if(im._lfqWant!==src){return}if(u!==src||src0){im.dataset.lfqo=src;im._lfqMeu=1;im.src=u}im.classList.remove('lfq0');im.dataset.lfqok='1'};
    if(LFQ_C[key]){ok(LFQ_C[key]);return}
    if(LFQ_PEND[key]){LFQ_PEND[key].push(ok);return}LFQ_PEND[key]=[ok];
    var dk=src.length+':'+src.slice(0,200)+src.slice(-200)+'|'+cf.join(',')+'|'+(nat?'n':(bw/bh).toFixed(2))+'|'+Math.round((window.devicePixelRatio||1)*10);
    var I=new Image(),acaba=function(u,bl){var L=LFQ_PEND[key]||[];delete LFQ_PEND[key];LFQ_C[key]=u;if(bl)lfqDbPut(dk,bl);L.forEach(function(f){f(u)})};
    lfqDbGet(dk).then(function(bl){if(bl){acaba(URL.createObjectURL(bl));return}faz()});
    var faz=function(){
    I.onload=function(){lfqFila(function(){try{
        var b=lfqMede(I);if(!b)throw 0;var asp=nat?I.naturalWidth/I.naturalHeight:bw/bh,CW=Math.min(1000,Math.max(400,Math.round(bw*(window.devicePixelRatio||1)*1.15))),CH=Math.round(CW/asp);
        var fw=b.w*I.naturalWidth,fh=b.h*I.naturalHeight,sc=Math.min(CW*cf[1]/fw,CH*cf[2]/fh),c=document.createElement('canvas');c.width=CW;c.height=CH;var g=c.getContext('2d');
        g.fillStyle=b.bg;g.fillRect(0,0,CW,CH);g.imageSmoothingQuality='high';var dw=I.naturalWidth*sc,dh=I.naturalHeight*sc;
        g.drawImage(I,CW/2-(b.x+b.w/2)*dw,CH*cf[3]-(b.y+b.h/2)*dh,dw,dh);
        c.toBlob(function(bl){acaba(bl?URL.createObjectURL(bl):src,bl)},'image/jpeg',.9)
      }catch(_){acaba(src)}})};
    I.onerror=function(){acaba(src)};I.src=src}}
  function lfqVe(im,old){if(!im||im.tagName!=='IMG'||!im.matches(LFQ_SEL))return;var s0=im.getAttribute('src')||'';
    if(im._lfqMeu){im._lfqMeu=0;return}if(im._lfqRev){im._lfqRev=0;return}
    if(/^blob:/.test(s0)){im.classList.remove('lfq0');return}
    /* foto já na tela e o endereço mudou (ex.: chegou a da nuvem): volta a mostrar a de antes e prepara a nova por trás */
    if(old&&old!==s0&&im.dataset.lfqok==='1'&&(im.dataset.lfqo||'')!==s0){im._lfqRev=1;im.setAttribute('src',old);lfqFaz(im,s0);return}
    if((im.dataset.lfqo||'')===s0&&im.dataset.lfqok==='1'&&old&&/^blob:/.test(old)){im._lfqRev=1;im.setAttribute('src',old);return}
    im.classList.add('lfq0');clearTimeout(im._lfqTO);im._lfqTO=setTimeout(function(){im.classList.remove('lfq0');if(im.complete&&im.naturalWidth)im.dataset.lfqok='1'},1200);lfqFaz(im)}
  try{new MutationObserver(function(M){M.forEach(function(m){if(m.type==='attributes')lfqVe(m.target,m.oldValue);else m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.tagName==='IMG')lfqVe(n);else if(n.querySelectorAll)n.querySelectorAll('img').forEach(function(x){lfqVe(x)})})})}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src'],attributeOldValue:true})}catch(_){}
  document.querySelectorAll(LFQ_SEL).forEach(lfqVe);
  var lfqRT=0,lfqW=innerWidth;window.addEventListener('resize',function(){if(Math.abs(innerWidth-lfqW)<40)return;lfqW=innerWidth;clearTimeout(lfqRT);lfqRT=setTimeout(function(){document.querySelectorAll(LFQ_SEL).forEach(function(im){if(im.dataset.lfqo){var o=im.dataset.lfqo;delete im.dataset.lfqo;im.setAttribute('src',o)}})},400)});
  /* prévia das cores no cartão */
  var LF_CORC={};
  function lfCorPinta(card){var ref=card.getAttribute('data-open')||(card.querySelector('[data-open]')||{getAttribute:function(){return ''}}).getAttribute('data-open'),i=LF_CORC[ref]||0;card.querySelectorAll('.hsw i,.esw i').forEach(function(d,k){d.classList.toggle('on',k===i)})}
  document.addEventListener('click',function(e){var d=e.target.closest&&e.target.closest('.hc .hsw i,#grid .card .esw i');if(!d)return;var card=d.closest('.hc')||d.closest('.card');if(!card)return;e.preventDefault();e.stopPropagation();
    var ref=card.getAttribute('data-open')||(card.querySelector('[data-open]')||{getAttribute:function(){return ''}}).getAttribute('data-open'),p=find(ref);if(!p)return;var i=Array.prototype.indexOf.call(d.parentNode.children,d);if((LF_CORC[ref]||0)===i)return;LF_CORC[ref]=i;lfCorPinta(card);
    var im=card.querySelector('.hci img,.ph img.pf');if(p.foto&&im){colorFoto(p,i,function(u){if(!u||LF_CORC[ref]!==i)return;im.classList.add('lfqx');setTimeout(function(){im.setAttribute('src',u);setTimeout(function(){im.classList.remove('lfqx')},60)},140)})}
   },true);
  try{new MutationObserver(function(){document.querySelectorAll('.hc[data-open],#grid .card').forEach(function(c){var r=c.getAttribute('data-open')||(c.querySelector('[data-open]')||{getAttribute:function(){return ''}}).getAttribute('data-open');if(LF_CORC[r]&&!c._lfc){c._lfc=1;lfCorPinta(c)}})}).observe(document.body,{childList:true,subtree:true})}catch(_){}
  function lfNmCorta(){document.querySelectorAll('#grid .card .info .nm').forEach(function(n){n.classList.toggle('corta',n.scrollWidth>n.clientWidth+1)})}
  var _drawGridNm=drawGrid;drawGrid=function(){var r=_drawGridNm.apply(this,arguments);try{requestAnimationFrame(lfNmCorta)}catch(_){}return r};addEventListener('resize',function(){try{lfNmCorta()}catch(_){}});
  var _productCor=product;product=function(ref){var r=_productCor.apply(this,arguments),i=LF_CORC[ref];
    if(i>0)setTimeout(function(){var b=document.querySelector('#layer .sw [data-sw="'+i+'"]');if(b)b.click()},0);return r};

  /* ===== 08/11 (aprovado S23): grau minimalista + cor e grau juntos =====
     Com várias cores e graus, o grau fica logo abaixo das miniaturas de cor, num bloco só ("COR · X | GRAU · Y").
     O grau que não existe na cor escolhida fica riscado e não dá para tocar (o app manda gc: graus de cada cor). */
  function grDaCor(p,ci){if(!p.gc||!p.gc[ci])return null;return String(p.gc[ci]).split(',').map(function(x){return x.trim()==='-'?-1:(+x||0)})}
  function grAplica(p){var L=document.querySelector('#layer .dgr');if(!L||!p||!p.gr)return;var ci=st.cor[p.ref]||0,q=grDaCor(p,ci),bs=L.querySelectorAll('.gb');
    /* 09/11 S24 (aprovado): grau que não existe na cor some (encolhe/aparece suave); esgotado na cor fica riscado; se o grau escolhido não serve, vai para o mais próximo que tem */
    var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
    bs.forEach(function(b,i){var sai=!!q&&q[i]<0,era=b.classList.contains('some');b.classList.toggle('some',sai);b.classList.toggle('nc',!!q&&q[i]===0);
      if(sai&&!era&&!rm&&b.animate&&b.offsetParent){var an=b.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.8)'}],{duration:180,easing:'ease-in'});an.onfinish=function(){if(b.classList.contains('some'))b.style.display='none'}}
      else if(sai)b.style.display='none';
      else if(era){b.style.display='';if(!rm&&b.animate)b.animate([{opacity:0,transform:'scale(.8)'},{opacity:1,transform:'scale(1)'}],{duration:260,delay:120,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'})}});
    var cur=st.gr[p.ref]||0;if(q&&!(q[cur]>0)){var gv=function(x){return parseFloat(String(x).replace(',','.'))||0},c0=gv(p.gr[cur]),k=-1,d=1e9;q.forEach(function(x,i){if(x>0){var dd=Math.abs(gv(p.gr[i])-c0);if(dd<d-1e-9){d=dd;k=i}}});if(k>=0&&bs[k])bs[k].click()}
    var g=document.querySelector('#layer .cthg');if(g)g.textContent=p.gr[st.gr[p.ref]||0]||''}
  function grJunto(p){if(!p||!p.gr||!p.gr.length)return;var L=document.querySelector('#layer .dgr'),th=document.querySelector('#layer .cthm'),lb=document.querySelector('#layer .cthl');
    if(L&&th&&lb&&!lb.querySelector('.cthg')){lb.insertAdjacentHTML('beforeend','<span class="cthsep">|</span>'+LFI.tr('Grau')+' · <b class="cthg"></b>');th.parentNode.insertBefore(L,th.nextSibling);L.classList.add('grJ')}
    grAplica(p)}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#layer .dgr .gb.nc');if(b){e.preventDefault();e.stopPropagation()}},true);
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#layer [data-sw],#layer [data-cth],#layer .dgr .gb');if(!b)return;setTimeout(function(){try{grJunto(find(prodRef))}catch(_){}},0)});
  /* peça aberta direto pelo link (abre antes deste bloco existir) */
  [0,300,900].forEach(function(t){setTimeout(function(){try{if(prodOpen)grJunto(find(prodRef))}catch(_){}},t)});
  var _productGr=product;product=function(ref){var r=_productGr.apply(this,arguments);[0,60,250,700].forEach(function(t){setTimeout(function(){try{if(prodRef===ref)grJunto(find(ref))}catch(_){}},t)});return r};
  (function(){var h=location.hash.slice(1);if(h&&PAN[h]&&MOBQ.matches){window.__lfQuiet=1;try{openPanel(h,true)}finally{window.__lfQuiet=0}}try{rtEntra()}catch(_){}var d=false;try{d=sessionStorage.getItem('lf_drw')==='1';sessionStorage.removeItem('lf_drw')}catch(_){}if(d&&MOBQ.matches){var dp=document.querySelector('#drw .dpn');if(dp)dp.style.transition='none';drwSet(true);setTimeout(function(){if(dp)dp.style.transition=''},60)}})();
  (function(){var a=$('tA'),b=$('tB'),sh=document.getElementById('shP');if(!a||!sh||!sh.getTotalLength)return;
    var L=sh.getTotalLength();a.setAttribute('textLength',L-1);b.setAttribute('textLength',L-1);b.setAttribute('startOffset',-L);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    /* S376 (aprovado 16/11 08:24): o texto do selo só gira quando o selo está na tela; fora dela (ou com a página em segundo plano) fica parado e não gasta nada */
    var off=0,vis=false,rod=false,sv=a.closest?a.closest('svg'):null;
    function tick(){if(!vis||document.hidden){rod=false;return}off=(off+.22)%L;a.setAttribute('startOffset',off);b.setAttribute('startOffset',off-L);requestAnimationFrame(tick)}
    function liga(){if(!rod&&vis&&!document.hidden){rod=true;requestAnimationFrame(tick)}}
    if('IntersectionObserver' in window&&sv){new IntersectionObserver(function(es){vis=es[es.length-1].isIntersecting;liga()}).observe(sv)}else{vis=true;liga()}
    document.addEventListener('visibilitychange',liga)})();
  /* S376 (aprovado 16/11 08:24): medidor para diagnóstico no aparelho do dono — só aparece com ?medir=1 no endereço. Mostra quadros por segundo (agora e o pior segundo), o quadro mais demorado,
     quantas vezes o processador travou mais de 50 ms e os mesmos números só enquanto a tela rola. Não guarda nem envia nada. */
  (function(){if(!/[?&]medir=1/.test(location.search))return;
    var d=document.createElement('div');d.id='lfmed';d.setAttribute('aria-hidden','true');d.style.cssText='position:fixed;left:8px;top:8px;z-index:calc(var(--c-sistema) + 10);max-width:calc(100% - 16px);background:rgba(17,13,20,.92);color:#fff;font:600 10.5px/1.4 ui-monospace,Menlo,monospace;overflow-wrap:anywhere;padding:8px 10px;border-radius:10px;pointer-events:none;white-space:pre-line';
    /* S427 (pedido do dono 18/11 14:12): botão para recolher o Medidor — fica só a etiqueta "Medidor ▸"; tocar abre de novo; a gravação continua; lembra (lf_medfech) */
    var mdT=document.createElement('span'),mdB=document.createElement('button'),mdF=false;try{mdF=localStorage.getItem('lf_medfech')==='1'}catch(_){}
    mdB.type='button';mdB.style.cssText='pointer-events:auto;position:absolute;top:0;right:0;width:40px;height:36px;border:0;background:none;color:#fff;font:700 15px system-ui;cursor:pointer';
    function mdPoe(){mdT.style.display=mdF?'none':'';mdB.textContent=mdF?'':'–';mdB.setAttribute('aria-label',mdF?'Mostrar o medidor':'Recolher o medidor');mdB.style.position=mdF?'static':'absolute';mdB.style.width=mdF?'auto':'40px';mdB.style.height=mdF?'auto':'36px';if(mdF)mdB.textContent='Medidor ▸';d.style.paddingRight=mdF?'10px':'40px';d.style.top=mdF?'auto':'8px';var gx=document.getElementById('lfgrv');d.style.left=mdF?(8+(gx?gx.offsetWidth+6:0))+'px':'8px';d.style.right='';d.style.bottom=mdF?'calc(8px + env(safe-area-inset-bottom,0px))':''}
    mdB.addEventListener('click',function(e){e.stopPropagation();mdF=!mdF;try{localStorage.setItem('lf_medfech',mdF?'1':'0')}catch(_){}mdPoe()});
    d.appendChild(mdT);d.appendChild(mdB);d.removeAttribute('aria-hidden');mdPoe();
    var ini=function(){document.body.appendChild(d)};if(document.body)ini();else document.addEventListener('DOMContentLoaded',ini);
    var u=performance.now(),n=0,t1=u,fps=0,pior=999,maxq=0,lt=0,ltms=0,rolT=0,rn=0,rms=0,rmax=0,abre=Math.round(u),pula=0;
    /* S426: o 1º quadro depois de voltar (outro app, login do Google) mede o tempo em que o site ficou fora — não é travada */
    document.addEventListener('visibilitychange',function(){pula=2});
    try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){lt++;ltms+=e.duration})}).observe({entryTypes:['longtask']})}catch(_){}
    /* S382: quem travou — o navegador registra cada quadro longo com os trechos de programa que rodaram nele (nome da função, de onde foi chamada e quanto durou) */
    var QT={},qn=0;try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){qn++;(e.scripts||[]).forEach(function(sc){if(sc.duration<8)return;var arq=String(sc.sourceURL||'').split('/').pop().split('?')[0]||'página',k=(sc.sourceFunctionName||'(sem nome)')+' ← '+String(sc.invoker||sc.invokerType||'').replace(/^.*\//,'').slice(0,34)+' ['+arq.slice(0,18)+']';var o=QT[k]||(QT[k]={n:0,t:0,m:0});o.n++;o.t+=sc.duration;if(sc.duration>o.m)o.m=sc.duration;if(sc.forcedStyleAndLayoutDuration>8){var k2='  arrumar a tela dentro de '+(sc.sourceFunctionName||'(sem nome)'),o2=QT[k2]||(QT[k2]={n:0,t:0,m:0});o2.n++;o2.t+=sc.forcedStyleAndLayoutDuration}})})}).observe({type:'long-animation-frame',buffered:true})}catch(_){QT=null}
    window.__lfQuem=function(){if(!QT)return 'quem travou: este navegador não informa';var L=Object.keys(QT).map(function(k){return [k,QT[k]]}).sort(function(a,b){return b[1].t-a[1].t}).slice(0,6);return 'quem travou ('+qn+' quadros longos):'+(L.length?L.map(function(x){return '\n'+Math.round(x[1].t)+' ms · '+x[1].n+'× · '+x[0]}).join(''):' nada ainda')};
    /* S420 GRAVADOR DE ENGASGOS (aprovado 15/11, S330 §9 passo 1; só no modo de diagnóstico do dono, ?medir=1): a cada volta do segundo plano anota, por 6 s,
       os quadros acima de 50 ms, o pior quadro e quem rodou neles. Guarda as últimas 8 voltas neste aparelho (lf_grav) para o dono mandar o print. Não envia nada. */
    var GV=null,GVL=[];try{GVL=JSON.parse(localStorage.getItem('lf_grav')||'[]')||[]}catch(_){}
    var gvQuem={};try{new PerformanceObserver(function(l){if(!GV)return;l.getEntries().forEach(function(e){if(e.startTime<GV.t0)return;(e.scripts||[]).forEach(function(sc){if(sc.duration<8)return;var k=(sc.sourceFunctionName||'(sem nome)')+' ← '+String(sc.invoker||sc.invokerType||'').replace(/^.*\//,'').slice(0,28);gvQuem[k]=(gvQuem[k]||0)+sc.duration})})}).observe({type:'long-animation-frame'})}catch(_){}
    document.addEventListener('visibilitychange',function(){if(document.hidden){GV=null;return}gvQuem={};GV={t0:performance.now(),q:0,pior:0,fora:Date.now()-(window.__lfSai||Date.now()),anim:0}});
    document.addEventListener('visibilitychange',function(){if(document.hidden)window.__lfSai=Date.now()},true);
    window.__lfGrav=function(){return GVL.length?'voltas do segundo plano (últimas '+GVL.length+'):'+GVL.slice(-4).map(function(v){return '\n'+v.h+' · '+v.q+' quadros >50 ms · pior '+v.p+' ms · '+v.a+' animações'+(v.f?' · fora '+v.f+' s':'')+(v.w?'\n  quem: '+v.w:'')}).join(''):'voltas do segundo plano: nenhuma ainda (saia do site e volte)'};
    function gvFecha(){var v=GV;GV=null;var L=Object.keys(gvQuem).map(function(k){return [k,gvQuem[k]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,2);
      var d0=new Date();GVL.push({h:('0'+d0.getHours()).slice(-2)+':'+('0'+d0.getMinutes()).slice(-2),q:v.q,p:Math.round(v.pior),a:v.anim,f:Math.round(v.fora/1000),w:L.map(function(x){return Math.round(x[1])+' ms '+x[0]}).join(' · ')});GVL=GVL.slice(-8);try{localStorage.setItem('lf_grav',JSON.stringify(GVL))}catch(_){}}
    addEventListener('scroll',function(){rolT=performance.now()},{passive:true,capture:true});
    (function f(t){var dt=t-u;u=t;if(pula){pula--;dt=16;t1=t;n=0}n++;if(GV){if(!GV.anim)try{GV.anim=document.getAnimations().length}catch(_){}if(!GV.um)GV.um=1;else if(dt>50){GV.q++;if(dt>GV.pior)GV.pior=dt}if(t-GV.t0>6000)gvFecha()}if(dt>maxq&&t-abre>1500)maxq=dt;if(t-rolT<250){rn++;rms+=dt;if(dt>rmax)rmax=dt}
      if(t-t1>=1000){fps=Math.round(n*1000/(t-t1));if(t-abre>3000&&fps<pior)pior=fps;n=0;t1=t;
        mdT.textContent='Medidor La Fouch\n'+fps+' quadros/s agora · pior segundo '+(pior===999?'—':pior)+'\nquadro mais demorado '+Math.round(maxq)+' ms\ntravadas do processador '+lt+' ('+Math.round(ltms)+' ms)\nrolando: '+(rn?Math.round(rn*1000/rms)+' quadros/s · pior '+Math.round(rmax)+' ms':'role a tela')+(window.__lfCam&&window.__lfCam.w?'\ncâmera '+window.__lfCam.w+'×'+window.__lfCam.h+' · leitor '+(window.__lfCam.del==='GPU'?'placa de vídeo':window.__lfCam.del==='CPU'?'processador':'?')+(window.__lfCam.fora?' · AO LADO'+(window.__lfCedo?' · preparado antes':'')+(window.__lfCam.lms?' '+Math.round(window.__lfCam.lms)+' ms':''):window.__lfWkFalhou?' · ao lado falhou, voltou ao leitor antigo':'')+' · mede a cada '+(window.__lfCam.ms/1000)+' s\ndistância lida '+(window.__lfCam.d?Math.round(window.__lfCam.d)+' cm':'—'):'')+'\naparelho: '+(navigator.hardwareConcurrency||'?')+' núcleos · '+(navigator.deviceMemory||'?')+' GB · tela x'+(window.devicePixelRatio||1)+'\n'+window.__lfQuem()+'\n'+window.__lfGrav()}
      requestAnimationFrame(f)})(u);
    /* S423 GRAVAÇÃO COMPLETA (pedido do dono 18/11 13:02; só com ?medir=1): grava a linha do tempo da visita — cada quadro lento (>25 ms) com a tela em que estava,
       os trechos de programa que rodaram nos quadros longos (nome da função, de onde veio, tempo e quanto foi "arrumar a tela"), toques e respostas lentas,
       rolagem, fotos/arquivos que demoraram, saída/volta do segundo plano. Botão "Baixar gravação" gera um arquivo .json para mandar. Não envia nada sozinho. */
    var GR=[],GR0=Date.now(),grN=0,gp=performance.now(),rolando=0,rolT2=0;function grP(o){o.t=Math.round(performance.now());if(GR.length<6000)GR.push(o);else grN++}
    function grOnde(){var l=document.querySelector('#layer .scrim,#layer .panel'),a=l&&(l.getAttribute('data-accn')||(l.querySelector('[aria-label]')||{}).getAttribute&&l.querySelector('[aria-label]').getAttribute('aria-label')||l.className);
      if(document.getElementById('gw'))return 'Mochi'+(window.__LFGZ&&__LFGZ.Z?' · '+__LFGZ.Z.fase:'');if(a)return String(a).slice(0,40);var sp=document.querySelector('.sec.pop');if(sp)return sp.id;return location.search.indexOf('r=')>0?'catálogo':'início'}
    var gpula=0;document.addEventListener('visibilitychange',function(){gpula=2});
    (function fq(t){var dt=t-gp;gp=t;if(gpula){gpula--;requestAnimationFrame(fq);return}if(dt>25&&!document.hidden)grP({k:'quadro',ms:Math.round(dt),onde:grOnde(),rola:t-rolT2<300?1:0});requestAnimationFrame(fq)})(gp);
    try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){grP({k:'quadro longo',ini:Math.round(e.startTime),ms:Math.round(e.duration),bloq:Math.round(e.blockingDuration||0),
      js:(e.scripts||[]).filter(function(x){return x.duration>=4}).slice(0,6).map(function(x){return {fn:x.sourceFunctionName||'(sem nome)',de:String(x.invoker||x.invokerType||'').slice(0,60),arq:String(x.sourceURL||'').split('/').pop().split('?')[0].slice(0,24),ms:Math.round(x.duration),tela:Math.round(x.forcedStyleAndLayoutDuration||0)}}),
      pintar:Math.round((e.startTime+e.duration)-(e.renderStart||e.startTime+e.duration)),estilo:Math.round(e.styleAndLayoutStart?(e.startTime+e.duration-e.styleAndLayoutStart):0)})})}).observe({type:'long-animation-frame'})}catch(_){}
    try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(e.duration<80)return;var a=e.target;grP({k:'resposta lenta',ev:e.name,ms:Math.round(e.duration),espera:Math.round(e.processingStart-e.startTime),alvo:a?(a.id||a.tagName+'.'+String(a.className).split(' ')[0]).slice(0,40):''})})}).observe({type:'event',durationThreshold:80})}catch(_){}
    try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(e.duration<400)return;grP({k:'arquivo lento',arq:e.name.split('/').slice(-2).join('/').split('?')[0].slice(0,60),ms:Math.round(e.duration),kb:Math.round((e.transferSize||0)/1024)})})}).observe({type:'resource'})}catch(_){}
    addEventListener('scroll',function(){var n=performance.now();if(!rolando){rolando=1;grP({k:'rolagem começou',onde:grOnde()})}rolT2=n;clearTimeout(window.__grRt);window.__grRt=setTimeout(function(){rolando=0;grP({k:'rolagem parou'})},250)},{passive:true,capture:true});
    addEventListener('pointerdown',function(e){var a=e.target.closest&&e.target.closest('button,a,[data-open],[data-cta],input,label');grP({k:'toque',alvo:a?(a.id||a.getAttribute('data-cta')||a.getAttribute('data-open')||(a.innerText||'').trim().slice(0,24)||a.tagName):'(fundo)',onde:grOnde()})},{passive:true,capture:true});
    document.addEventListener('visibilitychange',function(){grP({k:document.hidden?'saiu (segundo plano)':'voltou',onde:grOnde()})});
    /* S425 (pedido do dono 13:19): o DIAGNÓSTICO do catálogo também entra na gravação — a cada mudança (e a cada 5 s, se mudou): texto da linha, números (peças na nuvem/no site, leituras, erros), site ligado/desligado, temática, peças na tela e de onde vieram */
    var gdU='';function grDg(){try{var o={txt:typeof dgTxt==='function'?dgTxt():'',dg:JSON.parse(JSON.stringify(DG||{})),ativo:CFG?CFG.ativo!==false:null,nuvemConf:!!(CFG&&CFG._f),evento:CFG&&CFG.evento?CFG.evento.tema||'':'',pecas:(P||[]).length,cache:(function(){try{return !!localStorage.getItem('lf_pdocs')}catch(_){return null}})(),online:navigator.onLine},k=JSON.stringify(o);if(k!==gdU){gdU=k;o.k='diagnóstico';grP(o)}}catch(_){}}
    setInterval(grDg,5000);setTimeout(grDg,1500);
    var bx=document.createElement('div');bx.id='lfgrv';bx.style.cssText='position:fixed;left:8px;bottom:calc(8px + env(safe-area-inset-bottom,0px));z-index:calc(var(--c-sistema) + 11);display:flex;gap:6px';
    bx.innerHTML='<button type="button" data-g="b" style="font:700 13px system-ui;padding:10px 14px;border-radius:10px;border:0;background:#111;color:#fff">Baixar gravação</button><button type="button" data-g="z" style="font:700 13px system-ui;padding:10px 12px;border-radius:10px;border:0;background:#444;color:#fff">Zerar</button>';
    bx.addEventListener('click',function(e){var b=e.target.closest('[data-g]');if(!b)return;e.stopPropagation();if(b.getAttribute('data-g')==='z'){GR=[];grN=0;GR0=Date.now();b.textContent='Zerado';setTimeout(function(){b.textContent='Zerar'},1200);return}
      var j={site:window.LF_BUILD,inicio:new Date(GR0).toISOString(),fim:new Date().toISOString(),aparelho:{ua:navigator.userAgent,nucleos:navigator.hardwareConcurrency,mem:navigator.deviceMemory,tela:[screen.width,screen.height,devicePixelRatio],janela:[innerWidth,innerHeight],letra:String(LFT()),rede:(navigator.connection||{}).effectiveType||''},perdidos:grN,diagnostico:(function(){try{return {txt:dgTxt(),dg:DG,ativo:CFG.ativo!==false,pecas:P.length}}catch(_){return null}})(),eventos:GR};
      var bl=new Blob([JSON.stringify(j)],{type:'application/json'}),u=URL.createObjectURL(bl),a=document.createElement('a'),d=new Date();a.href=u;a.download='gravacao-lafouch-'+d.getHours()+'h'+('0'+d.getMinutes()).slice(-2)+'.json';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();URL.revokeObjectURL(u)},4000);b.textContent='Baixado ✓';setTimeout(function(){b.textContent='Baixar gravação'},2000)});
    var ini2=function(){document.body.appendChild(bx);mdPoe()};if(document.body)ini2();else document.addEventListener('DOMContentLoaded',ini2)})();

  /* ===== bloco 8 (11/11/2026): Temática automática (calendário) + contagem anônima do Analisador ===== */
  /* calendário automático da Temática (11/11/2026, S134): datas do comércio; o painel guarda só o estado (config/site.cal) */
  /* 13/11 (aprovado): datas de um país (Mães/Pais) só aparecem para o fuso do celular desse país — só para não frustrar ninguém, não é trava */
  function paisFuso(){var z='';try{z=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(_){}if(z==='America/Asuncion')return 'py';if(/^America\/(Sao_Paulo|Manaus|Bahia|Fortaleza|Recife|Belem|Cuiaba|Campo_Grande|Porto_Velho|Boa_Vista|Rio_Branco|Araguaina|Maceio|Santarem|Noronha|Eirunepe)$/.test(z))return 'br';return ''}
  function calOc(y){
    function d(Y,M,D,f){return new Date(Y,M-1,D,f?23:0,f?59:0,f?59:0,f?999:0).getTime()}
    var n1=new Date(y,10,1),bf=1+(4-n1.getDay()+7)%7+21+1,cy=new Date(y,10,bf+3),j1=new Date(y,5,1),p2=1+(7-j1.getDay())%7+7,m1=new Date(y,4,1),m2=1+(7-m1.getDay())%7+7,g1=new Date(y,7,1),a2=1+(7-g1.getDay())%7+7,BC={2026:[19,22]},L=[];
    if(BC[y])L.push({id:'bfcde',nm:'Black Friday CDE',tema:'bf',ini:d(y,11,BC[y][0]),fim:d(y,11,BC[y][1],1),org:'Câmara de Comércio de CDE',fonte:'Câmara de Comércio e Serviços de CDE',nova:1,y:y});
    L.push({id:'natal',nm:'Natal',tema:'natal',ini:d(y,12,1),fim:d(y,12,25,1),org:'Data fixa'});
    L.push({id:'anonovo',nm:'Ano Novo',tema:'anonovo',ini:d(y,12,26),fim:d(y+1,1,1,1),org:'Data fixa'});
    L.push({id:'maes',nm:'Dia das Mães (Paraguai)',tema:'maes',ini:d(y,5,1),fim:d(y,5,15,1),org:'Data fixa no Paraguai',nv:1,pais:'py'});
    L.push({id:'maesbr',nm:'Dia das Mães (Brasil)',tema:'maes',ini:d(y,5,m2-14),fim:d(y,5,m2,1),org:'2º domingo de maio no Brasil',nv:1,pais:'br'});
    L.push({id:'pais',nm:'Dia dos Pais (Paraguai)',tema:'pais',ini:d(y,6,1),fim:d(y,6,p2,1),org:'2º domingo de junho no Paraguai',nv:1,pais:'py'});
    L.push({id:'paisbr',nm:'Dia dos Pais (Brasil)',tema:'pais',ini:d(y,8,a2-14),fim:d(y,8,a2,1),org:'2º domingo de agosto no Brasil',nv:1,pais:'br'});
    L.push({id:'halloween',nm:'Halloween',tema:'halloween',ini:d(y,10,24),fim:d(y,10,31,1),org:'Data fixa',pad:'off'});
    return L}
  var CAL_IDS=['bfcde','natal','anonovo','maes','maesbr','pais','paisbr','halloween','crazy'];
  /* a próxima vez de cada data (o que já passou sai e volta com a data do ano que vem); sem data = "Data a confirmar" */
  function calProx(ag){var out=[],sem=[],y=new Date(ag).getFullYear(),T={};
    for(var k=y-1;k<=y+2;k++)calOc(k).forEach(function(x){if(x.fim>=ag&&(!T[x.id]||x.ini<T[x.id].ini))T[x.id]=x});
    CAL_IDS.forEach(function(id){if(T[id])out.push(T[id]);else if(id==='crazy')sem.push({id:'crazy',nm:'Crazy Week CDE',org:'Câmara de Comércio de CDE',sd:1});else if(id==='bfcde')sem.push({id:'bfcde',nm:'Black Friday CDE',org:'Câmara de Comércio de CDE',sd:1})});
    out.sort(function(a,b){return a.ini-b.ini});return {L:out,sem:sem}}
  function calSt(cfg,x){if(x.sd)return 'wait';var c=((cfg&&cfg.cal)||{})[x.id];return c==='auto'||c==='off'?c:(x.pad||'auto')}
  /* o evento manual do painel (config/site.evento) continua valendo e tem prioridade; sem ele, liga sozinho o que estiver "Automático" no calendário */
  var _evAtivo8=evAtivo;
  evAtivo=function(){var pv=/[?&]evp=([a-z]+)/.exec(location.search);
    if(pv){var k=pv[1],o=null;calProx(Date.now()).L.forEach(function(x){if(!o&&(x.id===k||x.tema===k))o=x});if(o||EVD[k]){var a=Date.now();o=o||{tema:k};return {tema:o.tema,ini:a-1,fim:a+864e5,bar:o.bar||'',th:o.th||'',lab:o.lab||'',cal:o.id||k}}}
    var e=_evAtivo8();if(e)return e;
    var ag=Date.now(),r=null,pz=paisFuso();try{calProx(ag).L.forEach(function(x){if(!r&&x.ini<=ag&&ag<=x.fim&&EVD[x.tema]&&calSt(CFG,x)==='auto'&&(!x.pais||x.pais===pz))r={tema:x.tema,ini:x.ini,fim:x.fim,bar:x.bar||'',th:x.th||'',lab:x.lab||'',cal:x.id}})}catch(_){}
    return r};
  try{evAplica()}catch(_){}

  /* Analisador: cada visita junta contagens SEM dados pessoais (modelos vistos, carrinho, favoritos, buscas, ferramentas) e manda um resumo ao sair */
  var AN=(function(){var o=null;try{o=JSON.parse(sessionStorage.getItem('lf_an')||'null')}catch(_){}return o&&typeof o==='object'?o:{c:{},f:{},b:[]}})(),AN_OFF=/[?&](cliente=1|evp=)/.test(location.search)||(function(){try{return window.parent!==window}catch(_){return true}})();
  function anGrava(){try{sessionStorage.setItem('lf_an',JSON.stringify(AN));sessionStorage.setItem('lf_an_n','1')}catch(_){}}
  function anMarca(k){if(AN_OFF||AN[k])return;AN[k]=1;anGrava()}
  function anCart(ref,n){if(AN_OFF||!(n>0))return;AN.c[ref]=Math.min(20,(AN.c[ref]||0)+n);anGrava()}
  var anCart0=JSON.parse(JSON.stringify(st.cart||{})),_drawBag8=drawBag;
  drawBag=function(){var r=_drawBag8.apply(this,arguments);try{Object.keys(st.cart).forEach(function(k){var d=(st.cart[k]||0)-(anCart0[k]||0);if(d>0)anCart(k,d)});anCart0=JSON.parse(JSON.stringify(st.cart));if(st.step==='ent'||st.step==='pag')anMarca('ck')}catch(_){}return r};
  var _toggleFav8=toggleFav;toggleFav=function(ref){var r=_toggleFav8.apply(this,arguments);try{if(st.fav[ref]&&!AN_OFF){AN.f[ref]=1;anGrava()}}catch(_){}return r};
  var _pkPagar8=pkPagar;pkPagar=function(){anMarca('pe');return _pkPagar8.apply(this,arguments)};
  var _openPanel8=openPanel;openPanel=function(id){if(id==='rosto')anMarca('ro');return _openPanel8.apply(this,arguments)};
  var _drawGrid8=drawGrid,anBT=0;drawGrid=function(){var r=_drawGrid8.apply(this,arguments);clearTimeout(anBT);var q=String(st.q||'').trim();
    if(q.length>=2&&!AN_OFF)anBT=setTimeout(function(){if(String(st.q||'').trim()!==q)return;var t=q.toLowerCase().slice(0,40),n=0;try{n=lista().length}catch(_){}
      if(!AN.b.some(function(x){return x.t===t})){AN.b.push({t:t,n:n});AN.b=AN.b.slice(-12);anGrava()}},1500);return r};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-gzopen],#lojista');if(!t)return;anMarca(t.id==='lojista'?'at':'mo')},true);
  /* S172 (12/11/2026): vistas e toques de cada peça do destaque + grau que o teste do Mochi deu (tudo anônimo) */
  window.__lfDv=function(ref){if(AN_OFF||!ref)return;AN.dv=AN.dv||{};if(!AN.dv[ref]){AN.dv[ref]=1;anGrava()}};
  window.__lfGm=function(g){if(AN_OFF||!(+g>0))return;AN.gm='+'+(+g).toFixed(2);anGrava()};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('#hdst [data-open]');if(!t||AN_OFF)return;var r=t.getAttribute('data-open');AN.dt=AN.dt||{};AN.dt[r]=Math.min(5,(AN.dt[r]||0)+1);anGrava()},true);
  function anEnvia(){if(AN_OFF)return;var id,v={};try{if(sessionStorage.getItem('lf_an_n')!=='1'&&sessionStorage.getItem('lf_vc_n0')!=='1')return;
      id=sessionStorage.getItem('lf_an_id');if(!id){id='v'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);sessionStorage.setItem('lf_an_id',id)}
      v=JSON.parse(sessionStorage.getItem('lf_vc')||'{}');sessionStorage.setItem('lf_an_n','0');sessionStorage.setItem('lf_vc_n0','0')}catch(_){return}
    var e=null;try{e=evAtivo()}catch(_){}
    var b={id:id,v:v,c:AN.c,f:AN.f,b:AN.b,dv:AN.dv||{},dt:AN.dt||{},gm:AN.gm||'',mo:AN.mo,ro:AN.ro,at:AN.at,pe:AN.pe,ck:AN.ck,lang:LFI.lang==='es'?'es':'pt',dev:matchMedia('(min-width:1100px)').matches?'pc':'cel',ev:e?(e.tema||''):''};
    try{acFetch(fnUrl('analise'),{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(b),keepalive:true}).catch(function(){})}catch(_){}}
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')anEnvia()});
  addEventListener('pagehide',anEnvia);

  /* S201 (13/11/2026, aprovado v5): Indique uma amiga com a Mochi — cartão na tela de pagamento confirmado (Mochi feliz entrega
     o cupom 10%), mensagem pronta no WhatsApp com lafouch.com/t/CÓDIGO, contador em Minha conta › Cartões, e a amiga que abre
     o link vê a Mochi surpresa "Sua amiga te deu 10%!". Mochi sempre com braços (regras do DESIGN). */
  var moN=0;
  function moFig(face,e,d,cls){return '<span class="mofig '+(cls||'')+'" data-mofig="'+face+'|'+e+'|'+d+'" aria-hidden="true"></span>'}
  function moPoe(n){var f=window.__lfMochiSvg;if(!f){if((n||0)<20)setTimeout(function(){moPoe((n||0)+1)},250);return}
    document.querySelectorAll('[data-mofig]').forEach(function(el){if(el.firstChild)return;var a=el.getAttribute('data-mofig').split('|'),px='m'+(++moN);
      el.innerHTML=f().replace(/id="(lf[a-z0-9]+)"/g,'id="'+px+'$1"').replace(/url\(#(lf[a-z0-9]+)\)/g,'url(#'+px+'$1)');
      if(window.__lfMochiArms)window.__lfMochiArms(el.querySelector('svg'),{face:a[0],e:+a[1],d:+a[2]})})}
  var TICKET='<span class="amtk"><b>10%</b><i>✓</i></span>';
  function amMsg(cod){var l='lafouch.com/t/'+cod;return LFI.lang==='es'?'¡Hola! Te regalé 10% de descuento en La Fouch 👓\nSolo abrí: '+l+'\nel descuento entra solo al carrito':'Oi! Te dei 10% de desconto na La Fouch 👓\nÉ só abrir: '+l+'\no desconto já entra sozinho no carrinho'}
  
  /* S400 (17/11, esboço 59f): a tela de pedido pago não mostra mais cartão nenhum (o convite para indicar vai por e-mail 2 semanas depois da entrega) */
  /* Minha conta › Cartões: contador embaixo do cartão da amiga */
  /* a amiga abre lafouch.com/t/CÓDIGO: Mochi surpresa */
  function amSurpresa(){if(document.getElementById('amov'))return;var o=document.createElement('div');o.id='amov';o.setAttribute('role','dialog');o.setAttribute('aria-label',LFI.tr('Sua amiga te deu 10%!'));
    o.innerHTML='<div class="amsc"><button type="button" class="amx" aria-label="'+LFI.tr('Fechar')+'">×</button><div class="amfig s">'+moFig('surpresa',-30,-30)+'<i class="amsp a1">✦</i><i class="amsp a2">✦</i><i class="amsp a3">✦</i></div><h3>'+LFI.tr('Sua amiga te deu 10%!')+'</h3><p>'+LFI.tr('O desconto já está no seu carrinho. Vale na 1ª compra, por 1 ano.')+'</p></div><button type="button" class="amver">'+LFI.tr('Veja as peças que aceitam cupom')+' ↓</button>';
    document.body.appendChild(o);moPoe();requestAnimationFrame(function(){o.classList.add('on')});
    var fecha=function(){o.classList.remove('on');setTimeout(function(){o.remove()},320)};
    o.addEventListener('click',function(e){if(e.target===o||e.target.closest('.amx'))fecha();else if(e.target.closest('.amver')){fecha();var g=document.querySelector('#grid,#home');if(g)g.scrollIntoView({behavior:'smooth'})}})}
  window.__lfS201={ok:function(id,o){pkOk(id,o||{})},sur:amSurpresa};
  var _cupA=cupAplica;cupAplica=function(cod,cb){var q=new URLSearchParams(location.search).get('t');_cupA(cod,function(j){if(j&&j.ok&&j.cupom&&j.cupom.tipo==='am'&&q&&String(q).toUpperCase()===String(cod).toUpperCase())amSurpresa();if(cb)cb(j)})};

  /* ============ S409 (17/11/2026, "implementar tudo" do dono) — cupons e cartões no site inteiro ============
     Esboços aprovados: 65b/66b/65c/71d/71e/77b/77c/78 (aba Exclusivo) · 66a (prateleira) · 65e/66e/71a–71c/74a–74c/75a–75c/76a/77a/77d (carrinho)
     · 66g/68g/69a/70a/70d/70e (Minha conta) · 70b (menu) · 70c (reserva VIP) · 68c (novidades VIP) · 81f/83 (selinho "Cupom disponível")
     · 73f (logo branco no cartão da loja) · sai o "Tem um código?", o "Leve 2" e o cupom de boas-vindas.
     REGRA DO DONO: o servidor confere tudo (functions/presente.js); aqui o site só mostra e monta o pedido. */
  (function(){
    var OURO='#8a6a33';
    /* ---------- cartões do cliente (os mesmos de Minha conta › Cartões) ---------- */
    st.cards=lsG('lf_cards',null);if(st.cards&&!logado())st.cards=null;
    st.pres=lsG('lf_pres',null);
    function cardsCarrega(forca){if(!logado()){st.cards=null;lsS('lf_cards',null);return Promise.resolve(null)}
      if(!forca&&st.cards&&Date.now()-(st.cards.ts||0)<10*60000)return Promise.resolve(st.cards);
      return cupFn({acao:'meus'}).then(function(j){if(!j||!j.ok)return null;
        st.cards={ts:Date.now(),L:(j.cupons||[]).filter(function(c){return c.estado==='ok'&&!c.usado&&c.tipo!=='am'&&c.tipo!=='bv'}),vip:+j.vip||0,escada:j.escada||null,nome:j.nome||''};
        lsS('lf_cards',st.cards);try{excPinta()}catch(_){}return st.cards},function(){return null})}
    window.__lfCards=cardsCarrega;
    function ehVip(){return !!(st.cards&&st.cards.vip)}
    function meusCards(){var L=((st.cards&&st.cards.L)||[]).slice();if(st.cup&&st.cup.tipo==='ev'&&!L.some(function(x){return x.cod===st.cup.cod}))L.unshift(st.cup);return L}
    /* o cartão vale nesta peça? (OFERTA nunca; o % não pode furar o piso: cmx) */
    function cVale(c,p){if(!c||!p||p.aviso==='Esgotado'||isOf(p)||c.tipo==='pe')return false;return (+p.cmx||0)>=(+c.pct||0)}
    function cardPara(p){return meusCards().filter(function(c){return cVale(c,p)})[0]||null}
    /* cartão da aba Exclusivo: o escolhido em Minha conta › Cartões; no evento, o cupom da temática; fora, o que vence primeiro */
    function excCard(){var L=meusCards();if(!L.length)return null;if(st.excCod){var x=L.filter(function(c){return c.cod===st.excCod})[0];if(x)return x}
      var ev=L.filter(function(c){return c.tipo==='ev'})[0];if(ev)return ev;return L.slice().sort(function(a,b){return (a.fim||9e15)-(b.fim||9e15)})[0]}
    function descDe(c,p){return cVale(c,p)?Math.floor(p.n*c.pct/100/1000)*1000:0}
    /* "Cupom disponível" (81f/83): só para quem tem um cartão que vale nesta peça */
    aceitaCup=function(p){return !!cardPara(p)};

    /* ---------- presente especial: a peça de presente fica fora do carrinho pago (st.pres) ---------- */
    function presAtivo(){return !!(st.pres&&st.cup&&st.cup.tipo==='pe'&&find(st.pres.ref))}
    function presN(){var p=st.pres&&find(st.pres.ref);return p?p.n:0}
    function pagas(){return Object.keys(st.cart).filter(function(k){var p=find(k);return p&&!isOf(p)&&p.aviso!=='Esgotado'})}
    function presLista(){return cupFn({acao:'presentes',pagas:pagas()}).then(function(j){var R={};((j&&j.refs)||[]).forEach(function(r){R[r]=1});st._presRefs=R;st._presOk=!!(j&&j.ok);st._presLim=j&&j.lim||0;return j},function(){st._presRefs={};return null})}
    function presTira(motivo){if(!st.pres)return;var r=st.pres.ref;st.pres=null;lsS('lf_pres',null);st._presSaiu=motivo?{ref:r,m:motivo}:null}
    /* confere o presente quando o carrinho muda (o servidor confere de novo no pedido) */
    function presConfere(){if(!st.pres)return Promise.resolve();if(!st.cup||st.cup.tipo!=='pe'){presTira();return Promise.resolve()}
      if(!pagas().length){presTira('paga');return Promise.resolve()}
      return presLista().then(function(){if(st.pres&&st._presRefs&&!st._presRefs[st.pres.ref]){presTira('valor');try{bag(true)}catch(_){}}})}

    /* ---------- desenho do cartão (o mesmo do e-mail e de Minha conta) ---------- */
    var EVP={natal:['#1f5c3a','linear-gradient(135deg,#2a7049 0%,#1f5c3a 55%,#143d27 100%)','rgba(255,217,160,.6)','#ffd9a0','#fff','#d3e3d8','cartao-ev-natal.png','Natal'],
      maes:['#a83a64','linear-gradient(135deg,#c2507b 0%,#a83a64 55%,#8a2c50 100%)','rgba(255,209,223,.7)','#ffd1df','#fff','#ffe9f0','cartao-ev-maes.png','Dia das Mães'],
      pais:['#1e2f4d','linear-gradient(135deg,#2b4169 0%,#1e2f4d 55%,#131f35 100%)','rgba(224,184,120,.65)','#e0b878','#fff','#c6cfdd','cartao-ev-pais.png','Dia dos Pais'],
      anonovo:['#f6f2ea','linear-gradient(135deg,#fffdf8 0%,#f3ecdf 60%,#e9dcc3 100%)','rgba(168,133,74,.85)','#8d703e','#1f1d1a','#66625a','cartao-ev-anonovo.png','Ano-Novo'],
      bf:['#111','linear-gradient(135deg,#242424 0%,#111111 60%,#000000 100%)','rgba(225,29,72,.95)','#fff','#fff','#c9c9c9','cartao-ev-bf.png','Black Friday'],
      halloween:['#2a1530','linear-gradient(135deg,#5a2f72 0%,#2a1530 55%,#160c1a 100%)','rgba(226,113,29,.75)','#f08a3c','#f3e9f5','#cdbcd3','cartao-ev-halloween.png','Halloween']};
    var TMP={vinho:['#3a1830','linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%)','rgba(214,178,116,.6)','#e9d3a6','#fff','#d9c3d0','cartao-branco.png'],
      preto:['#17121a','linear-gradient(135deg,#2b2330 0%,#17121a 55%,#0c090e 100%)','rgba(214,178,116,.75)','#e9d3a6','#fff','#c9bfc6','cartao-ouro.png']};
    function evSite(){var e=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'');return EVP[e]?e:''}
    function paleta(c){var ev=evSite();
      if(c.tipo==='ev'||(c.tipo==='pe'&&ev))return EVP[c.tema&&EVP[c.tema]?c.tema:ev]||TMP.vinho; /* cupom do evento e presente especial vestem a temática (62/71e) */
      if(c.tipo==='vip'||c.tipo==='pe'||c.tipo==='ani')return TMP.preto;return TMP.vinho}
    function cardHtml(c,nome,cls){var T=paleta(c),pe=c.tipo==='pe',ev=c.tipo==='ev',vip=c.tipo==='vip',ani=c.tipo==='ani',evn=T[7]||'';
      var rot=ev?LFI.tr('CUPOM DO EVENTO'):pe?(evn&&c.tipo==='pe'&&evSite()?LFI.tr(evn).toUpperCase():LFI.tr('PRESENTE ESPECIAL')):vip?LFI.tr('CARTÃO VIP'):ani?LFI.tr('FELIZ ANIVERSÁRIO'):c.tipo==='fiel'?LFI.tr('CLIENTE FIEL'):LFI.tr('CARTÃO PRESENTE');
      var num=pe?LFI.tr('Na compra de um,')+'<br>'+LFI.tr('leve outro de presente'):c.pct+'%';
      var tit=pe?(evn&&evSite()?LFI.tr('presente de')+' '+LFI.tr(evn):LFI.tr('vale para uma compra')):ev?LFI.tr('de desconto')+(evn?' · '+LFI.tr(evn):''):ani?LFI.tr('presente de aniversário'):vip&&c.max>1?LFI.tr('em')+' '+c.max+' '+LFI.tr('compras'):vip?LFI.tr('na sua próxima compra'):LFI.tr('na próxima compra');
      var fundo=ani?'background:'+T[0]+';background:radial-gradient(circle at 30% 40%,rgba(214,178,116,.26) 0 1.1px,transparent 1.7px) 0 0/34px 34px,'+T[1]:'background:'+T[0]+';background-image:'+T[1];
      return '<div class="lxc'+(cls?' '+cls:'')+'" style="border-radius:16px;'+fundo+';padding:6px"><div style="border:1px solid '+T[2]+';border-radius:11px;padding:15px 16px 13px">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><img src="/loja/media/email/'+T[6]+'" width="82" height="13" alt="La Fouch"><span style="font:500 12.5px Inter,Arial;letter-spacing:.14em;color:'+T[5]+';text-align:right">'+esc(rot)+'</span></div>'+
        '<div style="font:500 '+(pe?'24px/1.2':'42px/1')+' Fraunces,Georgia,serif;color:'+T[3]+';margin:'+(pe?'16px 0 4px':'18px 0 2px')+'">'+num+'</div><div style="font:italic 16px/1.3 Fraunces,Georgia,serif;color:'+T[4]+'">'+tit+'</div>'+
        '<div style="height:1px;background:'+T[2]+';opacity:.6;margin:14px 0 9px"></div><div style="display:flex;justify-content:space-between;font:500 12.5px Inter,Arial;letter-spacing:.04em;white-space:nowrap;color:'+T[5]+'"><span style="overflow:hidden;text-overflow:ellipsis;margin-right:10px">'+esc(ev?LFI.tr('PARA TODOS'):String(c.nome||nome||'').toUpperCase())+'</span><span>'+(c.fim?LFI.tr('ATÉ')+' '+cupData(c.fim):'')+'</span></div></div></div>'}
    window.__lfCardHtml=cardHtml;
    window.__lfPres={ativo:function(){return presAtivo()},n:function(){return presN()},item:function(){if(!presAtivo())return [];var p=find(st.pres.ref);return [{ref:p.ref,nome:p.nome,q:1,cor:(p.cores&&p.cores.length>1)?corNome(p,st.pres.cor||0):'',grau:'',preco:0,pres:true,cd:0,l2:0,pv:LFI.tr('Grátis')}]}};
    cupPecaHtml=function(){return ''}; /* a página da peça usa o selinho (83); nada de "código" */

    /* ---------- aba Exclusivo (st.tipo='exc') ---------- */
    var _lista=lista;lista=function(){var r;
      if(st.tipo!=='exc'){r=_lista();return vipFiltra(r)}
      var c=excCard(),sv=st.tipo;st.tipo='todos';r=_lista();st.tipo=sv;r=vipFiltra(r);if(!c)return [];
      if(c.tipo==='pe'){var R=st._presRefs||{};return r.filter(function(p){return R[p.ref]})}
      return r.filter(function(p){return cVale(c,p)})};
    /* novidades 48 h antes (68c): peça com vipAte no futuro só aparece para o Cliente VIP */
    function vipSo(p){return +p.vipAte>Date.now()}
    function vipFiltra(r){return ehVip()?r:r.filter(function(p){return !vipSo(p)})}
    var _cat5=cat5;cat5=function(){return vipFiltra(_cat5())};
    function excSai(){var v=$('vitrine');if(!v)return;[].forEach.call(v.querySelectorAll('.exh,.exo2,.vsec'),function(x){x.remove()});v.classList.remove('excm')}
    function excPinta(){var v=$('vitrine'),g=$('grid');if(!v||!g)return;if(st.tipo!=='exc'){if(v.classList.contains('excm'))excSai();return}
      var c=excCard();if(!c){st.tipo='todos';excSai();return}
      v.classList.add('excm');[].forEach.call(v.querySelectorAll('.exh,.exo2,.vsec'),function(x){if(x.parentNode!==g.parentNode)x.remove()});
      var h=g.parentNode.querySelector('.exh');if(!h){h=document.createElement('div');h.className='exh';g.parentNode.insertBefore(h,g)}
      var nm=(st.cards&&st.cards.nome)||(getConta()||{}).nome||'',hh=cardHtml(c,nm);if(h._h!==hh){h._h=hh;h.innerHTML=hh}
      var o=g.parentNode.querySelector('.exo2');if(!o){o=document.createElement('p');o.className='exo2';g.parentNode.insertBefore(o,g)}
      var tx;if(c.tipo==='pe'){var lim=st._presLim?LFI.fmtD(LFI.pv(st._presLim)):'';tx=!pagas().length?LFI.tr('Coloque no carrinho o óculos que você vai comprar; depois escolha aqui o seu presente.'):LFI.tr('Escolha 1 presente')+(lim?' <b>'+LFI.tr('até')+' '+lim+'</b>':'')+', '+LFI.tr(ehVip()?'com a vantagem de Cliente VIP.':'o valor do óculos no seu carrinho.')+' '+LFI.tr('Peças em OFERTA também podem ser presente.')}
      else tx=LFI.tr('Os preços abaixo já estão com o desconto.');if(o.innerHTML!==tx)o.innerHTML=tx;
      /* VIP (77c): "Só para VIP" no topo, com as novidades antes de todos */
      var vs=g.parentNode.querySelector('.vsec'),VL=ehVip()?P.filter(function(p){return vipSo(p)&&p.aviso!=='Esgotado'}).slice(0,4):[];
      if(VL.length){if(!vs){vs=document.createElement('div');vs.className='vsec';g.parentNode.insertBefore(vs,o)}var vh='<h4><i>✦</i>'+LFI.tr('Só para VIP')+'</h4><p>'+LFI.tr('Chegaram agora; para todos, em 2 dias.')+'</p><div class="hg vg">'+VL.map(function(p){return card5(p,0,'vip')}).join('')+'</div>'+(c.tipo==='pe'?'<div class="gh">'+LFI.tr('Seu presente')+'</div>':'');if(vs._h!==vh){vs._h=vh;vs.innerHTML=vh}}else if(vs)vs.remove();
      [].forEach.call(g.querySelectorAll('.card'),function(k){var bt=k.querySelector('[data-open]'),ref=bt&&bt.getAttribute('data-open'),p=ref&&find(ref);if(!p)return;
        k.querySelectorAll('.sel1,.edb').forEach(function(x){x.style.display='none'});var pr=k.querySelector('.pr');
        if(c.tipo==='pe'){if(pr)pr.style.display='none';if(!k.querySelector('.gpt')){var s=document.createElement('span');s.className='gpt';s.textContent='✦ '+LFI.tr('De presente');k.appendChild(s);gptAlinha(k,s)}}
        else if(pr&&!pr.querySelector('s')){var d=descDe(c,p);if(d>0)pr.innerHTML='<s>'+LFI.fmtD(LFI.pv(p.n))+'</s>'+LFI.fmtD(LFI.pv(p.n-d))}})}
    /* selo do presente alinhado com o coração (78a–78g): mesma altura e mesma distância da borda */
    function gptAlinha(k,s){var f=k.querySelector('.fav');if(!f)return;var kr=k.getBoundingClientRect(),fr=f.getBoundingClientRect(),sr=s.getBoundingClientRect();if(!kr.width)return;var bw=parseFloat(getComputedStyle(k).borderLeftWidth)||0;
      s.style.top=(fr.top-kr.top-bw+fr.height/2-sr.height/2)+'px';s.style.left=(kr.right-fr.right-bw+8)+'px'}
    var _dg=drawGrid;drawGrid=function(){_dg.apply(this,arguments);try{excPinta()}catch(e){console.error('exc',e)}};
    function excAbre(cod){if(cod)st.excCod=cod;var c=excCard();if(!c)return;st.tipo='exc';st.gen='';st.col='';st.rosto='';try{addDlgClose()}catch(_){}closeLayer();
      var go=function(){try{drawGen();drawChips();drawFaces()}catch(_){}drawGrid();try{goTo('vitrine')}catch(_){var v=$('vitrine');if(v)v.scrollIntoView()}
        setTimeout(function(){drawGrid();var h=document.querySelector('#vitrine .exh'),sc=$('vscr');if(h){var hb=(document.querySelector('.top')||{getBoundingClientRect:function(){return {bottom:0}}}).getBoundingClientRect().bottom,fl=hb+18-h.getBoundingClientRect().top;if(fl>0){if(sc)sc.scrollTop-=fl;window.scrollBy(0,-fl)}}},450)};
      if(c.tipo==='pe')presLista().then(function(){setTimeout(go,30)});else setTimeout(go,60)}
    window.__lfExc=excAbre;
    /* peça vinda da Exclusivo: o cartão entra sozinho (66e); no modo presente, o toque escolhe o presente */
    document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#grid [data-open]');if(!b||st.tipo!=='exc')return;var c=excCard(),ref=b.getAttribute('data-open');
      if(c&&c.tipo==='pe'){e.preventDefault();e.stopPropagation();if(!pagas().length){toast(LFI.tr('Primeiro coloque no carrinho o óculos que você vai comprar.'));return}
        if(!st._presRefs||!st._presRefs[ref])return;cupGuarda(c);st.pres={ref:ref,cor:0};lsS('lf_pres',st.pres);toast(LFI.tr('Presente escolhido')+' ✓');setTimeout(function(){bag()},150);return}
      st._excRef=ref},true);
    function viaExc(ref){if(!st.cup){var c=excCard(),p=find(ref);if(c&&c.tipo!=='pe'&&cVale(c,p)&&st.cart[ref]){cupGuarda(c);st.cup.auto=1;lsS('lf_cup',st.cup);try{drawBag()}catch(_){}}}}
    var _add=add;add=function(ref){var v=st.tipo==='exc'||st._excRef===ref;_add.apply(this,arguments);if(v)viaExc(ref);if(st.pres)presConfere()};
    /* o botão "Comprar" da peça (data-addm) põe no carrinho por outro caminho: confere logo depois */
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-addm]');if(!t)return;var ref=t.getAttribute('data-addm'),v=st.tipo==='exc'||st._excRef===ref;setTimeout(function(){if(v)viaExc(ref);if(st.pres)presConfere()},60)},true);
    /* prateleira "Exclusivo" no Início (66a): a 1ª, igual às outras, a palavra em dourado, preços já com o desconto */
    var _hd=homeDraw;homeDraw=function(){_hd.apply(this,arguments);try{excPrat()}catch(e){console.error('excPrat',e)}};
    function excPrat(){var H=$('home');if(!H)return;var o=H.querySelector('.exs');if(o){o.nextElementSibling&&o.nextElementSibling.classList.contains('hg')&&o.nextElementSibling.remove();o.remove()}
      var c=excCard();if(!c||c.tipo==='pe')return;var L=cat5().filter(function(p){return cVale(c,p)}).slice(0,8);if(!L.length)return;
      var h1=H.querySelector('.hsh.hsh1');if(!h1)return;var s=document.createElement('div');s.className='hsh hsh1 exs';s.innerHTML='<h2 class="h2" style="color:'+OURO+'">'+LFI.tr('Exclusivo')+'</h2><a href="#vitrine" data-exc>'+LFI.tr('Ver todos')+' ›</a>';
      var g=document.createElement('div');g.className='hg';g.setAttribute('data-hsec','exc');g.innerHTML=L.map(function(p){return card5(p,0,'exc')}).join('');
      [].forEach.call(g.querySelectorAll('.hc'),function(b,i){var p=L[i],hp=b.querySelector('.hp'),d=descDe(c,p);if(hp&&d>0)hp.innerHTML='<s>'+LFI.fmtD(LFI.pv(p.n))+'</s>'+LFI.fmtD(LFI.pv(p.n-d))});
      h1.parentNode.insertBefore(s,h1);h1.parentNode.insertBefore(g,h1)}
    /* novidades do VIP marcadas "Só para VIP" no Início (68c) */
    function vipMarca(){if(!ehVip())return;[].forEach.call(document.querySelectorAll('#home .hc[data-open]'),function(b){var p=find(b.getAttribute('data-open'));if(p&&vipSo(p)&&!b.querySelector('.vip1')){var s=document.createElement('span');s.className='vip1';s.textContent='✦ '+LFI.tr('Só para VIP');b.appendChild(s)}})}
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-exc]');if(!a)return;e.preventDefault();e.stopPropagation();excAbre()},true);
    /* sair da Exclusivo: qualquer filtro do catálogo (menu, chips) volta ao catálogo comum */
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-mf]');if(t&&st.tipo==='exc')setTimeout(excPinta,0)},false);

    /* ---------- carrinho (65e, 66e, 71a–71c, 74a, 76a, 77a, 77d) ---------- */
    function linha(ic,txt,dir,cls){return '<div class="exc'+(cls?' '+cls:'')+'"><span><i>'+ic+'</i>'+txt+'</span>'+(dir?'<span class="exd">'+dir+'</span>':'')+'</div>'}
    cupHtml=function(dd){var L=meusCards(),tb=dd?'':'<button type="button" class="tr" data-cartroca>'+LFI.tr('Trocar')+'</button>',h='';
      if(presAtivo())return linha('✦',LFI.tr('Presente especial aplicado'),tb);
      if(st.cup&&st.cup.tipo==='pe'){var so=!pagas().length&&Object.keys(st.cart).length;
        h=linha('✦',LFI.tr('Você tem um presente especial'),so||dd?'':'<button type="button" class="tr" data-presesc>'+LFI.tr('Escolher')+'</button>',so?'apag':'');
        if(so&&!dd)h+='<p class="exn">'+LFI.tr('O presente vale na compra de uma peça fora da OFERTA. Ele continua guardado.')+'</p>';
        if(st._presSaiu&&!dd){var pp=find(st._presSaiu.ref);h+='<p class="exn">'+LFI.tr('A peça de presente')+' '+esc(pp?pp.ref:'')+' '+LFI.tr('saiu do carrinho')+(st._presSaiu.m==='valor'?': '+LFI.tr('o presente vale até o valor do óculos que você compra.'):'.')+' <a href="#" data-presesc>'+LFI.tr('Escolher outro presente')+' ›</a></p>'}
        return h}
      if(st.cup){var ci=cupInfo(),n=cupConta(),nm=st.cup.tipo==='ev'?LFI.tr('Cupom do evento')+' · '+st.cup.pct+'%':LFI.tr('Cartão de')+' '+st.cup.pct+'%';
        if(ci.d>0){h=linha('✦',nm+' '+LFI.tr('aplicado')+(n.a<n.n?' · '+n.a+' '+LFI.tr(n.a===1?'peça':'peças'):''),'<b class="exv">−'+LFI.fmtD(ci.dD)+'</b>'+tb);
          if(st.cup.auto&&!dd)h+='<p class="exn">'+LFI.tr('O seu cartão entrou sozinho porque a peça veio da Exclusivo.')+' <a href="#" data-cupguarda>'+LFI.tr('Guardar para outra compra')+' ›</a></p>';return h}
        return linha('✦',nm,tb)+(dd?'':'<p class="exn">'+LFI.tr('Nenhuma peça deste carrinho aceita o cartão (OFERTA ou limite da peça). Ele continua guardado.')+'</p>')}
      if(L.length&&!dd){var Lv=L.filter(function(x){return x.tipo==='pe'||valorNesta(x)>0}).sort(function(a,b){return valorNesta(b)-valorNesta(a)}),c=Lv.filter(function(x){return x.tipo!=='pe'})[0]||Lv[0];if(!c)return '';return c.tipo==='pe'?linha('✦',LFI.tr('Você tem um presente especial'),pagas().length?'<button type="button" class="tr" data-presesc>'+LFI.tr('Escolher')+'</button>':'',pagas().length?'':'apag')+(pagas().length||!Object.keys(st.cart).length?'':'<p class="exn">'+LFI.tr('O presente vale na compra de uma peça fora da OFERTA. Ele continua guardado.')+'</p>')
        :linha('✦',LFI.tr('Você tem um cartão de')+' '+c.pct+'%','<button type="button" class="tr" data-cupusar2="'+esc(c.cod)+'">'+LFI.tr('Usar')+'</button>')}
      return ''};
    /* peça de presente dentro do carrinho (76a): como as outras; no lugar do preço "✦ De presente"; subtotal riscado e "Grátis" */
    function presRow(){var p=find(st.pres.ref);if(!p)return '';return '<div class="ci cipres"><div class="cimg">'+vis(p)+'</div><div class="cit"><small>'+p.ref+'</small><b>'+esc(p.nome)+'</b><div class="pu"><span class="gfk2">✦ '+LFI.tr('De presente')+'</span></div></div><div class="cif"><div class="cia"><button type="button" class="crl" data-presx>'+LFI.tr('Remover')+'</button></div><div class="cis"><small>'+LFI.tr('Subtotal')+'</small><div class="pr"><s>'+LFI.fmtD(LFI.pv(p.n))+'</s><span class="gfr">'+LFI.tr('Grátis')+'</span></div></div></div><button class="crm" data-presx aria-label="'+LFI.tr('Remover')+'"><span class="crx">×</span></button></div>'}
    var _bag9=bag;bag=function(re,pop){_bag9(re,pop);try{var pn=document.querySelector('#layer .cartp');if(!pn)return;
        if(presAtivo()&&!pn.querySelector('.cipres')){var it=pn.querySelectorAll('.ci:not(.fvi)'),u=it[it.length-1];if(u)u.insertAdjacentHTML('afterend',presRow());var cn=pn.querySelector('.cn');if(cn){var nq=qtd()+1;cn.textContent='· '+nq+' '+LFI.tr(nq===1?'item':'itens')}}
        [].forEach.call(pn.querySelectorAll('.ci:not(.fvi):not(.cipres)'),function(ci){var r=ci.querySelector('.cit small'),p=r&&find(r.textContent.trim());if(p&&st.cup&&st.cup.tipo!=='pe'&&isOf(p)&&!ci.querySelector('.lfof')){var pu=ci.querySelector('.pu');if(pu)pu.insertAdjacentHTML('afterend','<span class="lfof">'+LFI.tr('Em OFERTA: o cartão não vale nesta peça.')+'</span>')}})}catch(e){console.error('bag409',e)}};
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-cupusar2],[data-cupguarda],[data-presesc],[data-presx],[data-cartroca],[data-shok],[data-shx],[data-shc]');if(!t)return;e.preventDefault();
      if(t.hasAttribute('data-cupusar2')){var c=meusCards().filter(function(x){return x.cod===t.getAttribute('data-cupusar2')})[0];if(c){cupGuarda(c);bag(true)}}
      else if(t.hasAttribute('data-cupguarda')){cupTira();presTira();bag(true);toast(LFI.tr('Cartão guardado para outra compra'))}
      else if(t.hasAttribute('data-presesc')){var pe=meusCards().filter(function(x){return x.tipo==='pe'})[0];if(pe){cupGuarda(pe);st._presSaiu=null;excAbre(pe.cod)}}
      else if(t.hasAttribute('data-presx')){presTira();bag(true)}
      else if(t.hasAttribute('data-cartroca'))shAbre();
      else if(t.hasAttribute('data-shc')){var L2=document.querySelectorAll('.sh label');[].forEach.call(L2,function(x){x.classList.toggle('on',x===t)});shNota()}
      else if(t.hasAttribute('data-shx'))shFecha();
      else if(t.hasAttribute('data-shok')){var on=document.querySelector('.sh label.on'),cod=on&&on.getAttribute('data-cod');shFecha();
        if(!cod){cupTira();presTira();bag(true);return}
        var c2=meusCards().filter(function(x){return x.cod===cod})[0];if(!c2)return;
        if(c2.tipo==='pe'){if(!presAtivo()){cupGuarda(c2);excAbre(c2.cod)}return}
        presTira();cupGuarda(c2);bag(true)}},true);
    /* folha "Cartão desta compra" (74b/75a/75c): um cartão por compra; cada um mostra quanto desconta NESTA compra */
    function valorNesta(c){if(c.tipo==='pe')return -1;var d=0;Object.keys(st.cart).forEach(function(k){d+=descDe(c,find(k))*st.cart[k]});return d}
    function shAbre(){shFecha(true);var L=meusCards().slice(),cur=st.cup&&st.cup.cod;
      L.sort(function(a,b){return valorNesta(b)-valorNesta(a)});var maior=L.filter(function(c){return valorNesta(c)>0})[0],prim=L.filter(function(c){return c.fim}).sort(function(a,b){return a.fim-b.fim})[0];
      var ch=function(c){var T=paleta(c);return '<span class="ch" style="background:'+T[0]+';background-image:'+T[1]+';border-color:'+T[2]+'"></span>'};
      var r=L.map(function(c){var v=valorNesta(c),nm=c.tipo==='pe'?LFI.tr('Presente especial'):c.tipo==='ev'?LFI.tr('Cupom do evento')+' '+c.pct+'%':c.tipo==='vip'?LFI.tr('Cartão VIP')+' '+c.pct+'%':LFI.tr('Cartão presente')+' '+c.pct+'%';
        var sub=c.tipo==='pe'?LFI.tr('leve outro óculos'):(prim&&prim.cod===c.cod&&L.length>1?LFI.tr('vence primeiro, em')+' '+cupData(c.fim).replace(/\/\d{4}$/,''):c.fim?LFI.tr('até')+' '+cupData(c.fim):'');
        var dir=c.tipo==='pe'?(presAtivo()?LFI.tr('Em uso'):LFI.tr('Escolher peça')):v>0?'− '+LFI.fmtD(LFI.pv(v)):LFI.tr('não vale aqui');
        return '<label data-shc data-cod="'+esc(c.cod)+'" class="'+(c.cod===cur?'on':'')+'">'+ch(c)+'<span class="tx"><b>'+esc(nm)+(maior&&maior.cod===c.cod&&L.length>1?'<em>'+LFI.tr('Maior desconto')+'</em>':'')+'</b><small>'+esc(sub)+'</small></span><span class="vl'+(v>0||c.tipo==='pe'?'':' no')+'">'+dir+'</span><span class="rd"></span></label>'}).join('')+
        '<label data-shc data-cod="" class="'+(cur?'':'on')+'"><span class="ch z"></span><span class="tx"><b>'+LFI.tr('Não usar cartão agora')+'</b><small>'+LFI.tr('todos ficam guardados')+'</small></span><span class="vl"></span><span class="rd"></span></label>';
      var b=document.createElement('div');b.className='shb';b.setAttribute('data-shx','');var s=document.createElement('div');s.className='sh';s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');s.setAttribute('aria-label',LFI.tr('Cartão desta compra'));
      s.innerHTML='<div class="gr"></div><h3>'+LFI.tr('Cartão desta compra')+'</h3><p>'+LFI.tr('Vale um cartão por compra. Os outros continuam guardados para a próxima.')+'</p>'+r+'<p class="nt" hidden></p><button type="button" class="ok" data-shok>'+LFI.tr('Usar este cartão')+'</button>';
      document.body.appendChild(b);document.body.appendChild(s);requestAnimationFrame(function(){b.classList.add('on');s.classList.add('on')});shNota()}
    function shNota(){var s=document.querySelector('.sh');if(!s)return;var on=s.querySelector('label.on'),cod=on&&on.getAttribute('data-cod'),c=cod&&meusCards().filter(function(x){return x.cod===cod})[0],nt=s.querySelector('.nt'),ok=s.querySelector('.ok');
      ok.textContent=c&&c.tipo==='pe'&&!presAtivo()?LFI.tr('Escolher a peça de presente'):LFI.tr(cod?'Usar este cartão':'Continuar sem cartão');
      if(presAtivo()&&(!c||c.tipo!=='pe')){var p=find(st.pres.ref);nt.hidden=false;nt.textContent=LFI.tr('Trocando, a peça de presente')+' ('+(p?p.ref:'')+') '+LFI.tr('sai do carrinho. O presente continua guardado.')}else nt.hidden=true}
    function shFecha(ja){[].forEach.call(document.querySelectorAll('.sh,.shb'),function(x){x.remove()})}
    /* o carrinho muda: o presente é conferido de novo (pode sair, 77d) */
    ['data-inc','data-dec','data-rm'].forEach(function(a){document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('['+a+']')&&st.pres)setTimeout(function(){presConfere().then(function(){try{if(document.querySelector('#layer .cartp'))bag(true)}catch(_){}})},60)})});

    /* ---------- Minha conta (70a, 69a) e menu (70b) ---------- */
    function contaNome(){var p=document.querySelector('#layer .scrim[data-accn="Minha conta"] aside h2');if(!p||p.parentNode.parentNode.querySelector('.mcnm'))return;var c=getConta()||{};if(!c.nome)return;
      var d=document.createElement('p');d.className='mcnm';d.innerHTML=esc(c.nome)+(ehVip()?'<span class="mcd">·</span><span class="mcv">✦ '+LFI.tr('Cliente VIP')+'</span>':'');p.parentNode.parentNode.insertBefore(d,p.parentNode.nextSibling)}
    function vipMenu(){var n=$('dacn'),a=$('dav');if(!n||!a)return;var on=ehVip()&&logado();a.classList.toggle('vipav',on);var x=n.querySelector('.dvip');if(on&&!x){x=document.createElement('em');x.className='dvip';x.textContent='✦ '+LFI.tr('Cliente VIP');n.appendChild(x)}else if(!on&&x)x.remove()}
    new MutationObserver(function(){try{contaNome();vipMenu();vipMarca()}catch(_){}}).observe(document.body,{childList:true,subtree:true});

    /* ---------- Minha conta › Cartões (61i + 66g + 68g + 73f) ---------- */
    mtjCarrega=function(){var b=document.getElementById('mtj');if(!b)return;cupFn({acao:'meus'}).then(function(j){var b2=document.getElementById('mtj');if(!b2)return;
      if(!j||!j.ok){b2.innerHTML='<div class="note">'+LFI.tr(j&&j.motivo==='sessao'?'Sua sessão terminou. Entre de novo para ver seus cartões.':'Não deu para carregar seus cartões agora.')+'</div>';return}
      st.cards={ts:Date.now(),L:(j.cupons||[]).filter(function(c){return c.estado==='ok'&&!c.usado&&c.tipo!=='am'&&c.tipo!=='bv'}),vip:+j.vip||0,escada:j.escada||null,nome:j.nome||''};lsS('lf_cards',st.cards);
      var L=j.cupons||[];st._mtj=L;var nomeC=String(j.nome||(getConta()||{}).nome||'').toUpperCase(),am=L.filter(function(c){return c.tipo==='am'&&c.estado==='ok'})[0],P2=L.filter(function(c){return c.tipo!=='am'&&c.tipo!=='bv'});
      var uso=excCard(),em=uso&&P2.some(function(c){return c.cod===uso.cod})?uso.cod:'';P2.sort(function(a,b){return (b.cod===em)-(a.cod===em)});
      var h=P2.length?P2.map(function(c){var podeU=c.estado==='ok'&&!c.usado,est=c.usado||c.estado==='usado'?LFI.tr('Usado'):c.cod===em?LFI.tr('Em uso na aba Exclusivo'):c.estado==='ok'?LFI.tr('Disponível'):c.estado==='vencido'?LFI.tr('Vencido'):c.estado==='cedo'?LFI.tr('Ainda não começou'):LFI.tr('Indisponível');
        return '<div class="mtc"'+(podeU?'':' style="opacity:.62"')+'>'+cardHtml(c,nomeC,'mtx')+'<div class="mtl"><span>'+LFI.tr('Estado')+': <b>'+est+'</b></span>'+(podeU&&c.cod!==em?'<button type="button" class="cfx" data-mtusar="'+esc(c.cod)+'" style="min-height:44px;padding:0 14px">'+LFI.tr(em?'Usar este':'Usar agora')+'</button>':'')+'</div></div>'}).join(''):(am||j.guardados?'':'<div class="note">'+LFI.tr('Você ainda não tem cartões. Eles chegam por e-mail depois que você recebe a sua compra.')+'</div>');
      if(j.guardados)h+='<p class="note" style="margin:10px 2px 18px">'+(j.guardados===1?LFI.tr('Você tem 1 presente guardado.'):LFI.tr('Você tem')+' '+j.guardados+' '+LFI.tr('presentes guardados.'))+' '+LFI.tr(P2.some(function(c){return c.estado==='ok'&&!c.usado})?'Ele chega quando este cartão for usado ou vencer.':'Ele chega por e-mail em alguns dias.')+'</p>';
      if(am){var e=j.escada||{deg:1,feitas:0,tot:1},PZ=[['10%','1 indicação'],['15%','mais 3'],['Presente','mais 5']];
        var deg=PZ.map(function(x,i){var ok=i<e.deg-1,cur=i===e.deg-1;return '<div><i class="'+(ok?'ok':cur?'':'no')+'">'+(ok?'✓':i+1)+'</i><b>'+(ok?LFI.tr(x[0]):'?')+'</b><span>'+LFI.tr(x[1])+'</span></div>'}).join('');
        var bo='';for(var i=0;i<e.tot;i++)bo+='<span class="bo'+(i<e.feitas?' on':'')+'"></span>';var falta=e.tot-e.feitas;
        h+='<div class="mtc"><div class="amct" style="margin-top:0"><div><span style="font-weight:600;color:#1d1418">'+LFI.tr('Presenteie alguém especial')+'</span><b></b></div><div><span>'+LFI.tr('A pessoa ganha 10% na primeira compra. Quando ela comprar, você avança na escada.')+'</span><b></b></div>'+
          '<div class="esc">'+deg+'</div><div class="esd"><div>'+bo+'</div><p>'+(falta===1?LFI.tr('Falta 1 indicação'):LFI.tr('Faltam')+' '+falta+' '+LFI.tr('indicações'))+' '+LFI.tr('para o próximo presente, que é surpresa.')+'</p></div><a class="amwa" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(amMsg(am.cod))+'">'+LFI.tr('Enviar pelo WhatsApp')+'</a></div></div>'}
      b2.innerHTML=h},function(){})};
    /* "Usar este" / "Usar agora" em Minha conta › Cartões: troca o cartão em uso e leva à aba Exclusivo (66g) */
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-mtusar]');if(!t)return;e.preventDefault();var cod=t.getAttribute('data-mtusar'),c=(st._mtj||[]).filter(function(x){return x.cod===cod})[0];if(!c)return;
      st.excCod=cod;if(st.cup&&st.cup.cod!==cod){presTira();cupTira()}if(c.tipo!=='pe')cupGuarda(c);else cupGuarda(c);excAbre(cod)},true);

    /* ---------- Minha conta › Pedidos: reserva cancelada que abre para baixo (70d/70e) ---------- */
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-rcz]');if(!t)return;e.preventDefault();e.stopPropagation();var w=t.parentNode,d=w.querySelector('.rcd'),abre=!w.classList.contains('on');w.classList.toggle('on',abre);t.setAttribute('aria-expanded',abre);
      if(!d)return;var mv=Element.prototype.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches;if(!mv){d.hidden=!abre;return}
      if(abre){d.hidden=false;var H=d.scrollHeight;d.animate([{height:'0px',opacity:0},{height:H+'px',opacity:1}],{duration:350,easing:'cubic-bezier(.32,.72,0,1)'});d.firstChild&&d.firstChild.animate&&d.firstChild.animate([{transform:'translateY(-8px)',opacity:0},{transform:'none',opacity:1}],{duration:350,delay:60,easing:'cubic-bezier(.32,.72,0,1)',fill:'backwards'})}
      else{var H2=d.scrollHeight,a=d.animate([{height:H2+'px',opacity:1},{height:'0px',opacity:0}],{duration:300,easing:'cubic-bezier(.32,.72,0,1)'});a.onfinish=function(){d.hidden=true}}},true);
    window.__lfRcz=function(e,meta){return '<div class="rcw"><button type="button" class="cfp rcz" data-rcz aria-expanded="false"><span><b>Pedido '+esc(e.cod)+(e.teste?' · teste':'')+'</b><small>'+meta+'</small></span><span class="rce"><em class="er">'+LFI.tr('Reserva cancelada')+'</em><i class="rcs" aria-hidden="true">›</i></span></button><div class="rcd" hidden><div>'+LFI.tr(e.est==='cancelado'?'A reserva foi cancelada antes do pagamento. Nada foi cobrado e as peças voltaram para o site.':'A reserva terminou antes do pagamento. Nada foi cobrado e as peças voltaram para o site.')+'<a href="#vitrine" data-mf="tipo:todos" data-close>'+LFI.tr('Ver as peças')+' ›</a></div></div></div>'};

    /* ---------- iPhone: com o teclado aberto, o campo e o botão ficam acima dele (63e) ---------- */
    if(window.visualViewport&&/iP(hone|ad|od)/.test(navigator.userAgent)){var kb=function(){var vv=visualViewport,k=Math.max(0,innerHeight-vv.height-vv.offsetTop);document.documentElement.style.setProperty('--kb',k+'px');document.documentElement.classList.toggle('kbon',k>80);
        var f=document.activeElement;if(k>80&&f&&/INPUT|TEXTAREA|SELECT/.test(f.tagName)&&f.closest('#layer')){try{f.scrollIntoView({block:'center'})}catch(_){}}};visualViewport.addEventListener('resize',kb);visualViewport.addEventListener('scroll',kb)}

    /* ---------- começa ---------- */
    if(st.cup&&st.cup.tipo==='bv')cupTira(); /* o cupom de boas-vindas acabou (17/11) */
    if(logado())cardsCarrega().then(function(){try{if($('home'))homeDraw()}catch(_){}});
    if(typeof contaBtn==='function'){var _cb9=contaBtn;contaBtn=function(){var r=_cb9.apply(this,arguments);try{if(logado()&&!st.cards)cardsCarrega(true).then(function(){try{if($('home'))homeDraw()}catch(_){}});else{st.cards=null;lsS('lf_cards',null)}}catch(_){}return r}}
  })();


  /* S207 (13/11/2026, aprovado): correções do dono — peça com rodapé e foto que não cobre o resto no PC, "Últimas" no canto da foto,
     código acima do Total, Destaque sem "N cores", opiniões só quando existem, "Hacer la prueba" sem voltar/empilhar, Mi cuenta sem
     reanimar a aba aberta, Idioma/Tamanho no PC ao lado do menu, busca que cresce da lupa. */
  (function(){
    /* "Hacer la prueba" dentro de uma tela aberta (Ajuda): fecha a tela primeiro (o voltar assenta) e só então abre o Mochi — não volta sozinho nem empilha */
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-gzopen]');if(!a||a.hasAttribute('data-s207'))return;if(a.tagName==='A')e.preventDefault();
      var ly=$('layer'),pn=a.closest('.sec.pop');if(!(((ly&&ly.contains(a))||pn)&&history.state&&(history.state.lfo||history.state.pn)))return;e.preventDefault();e.stopImmediatePropagation();
      var feito=0,vai=function(){if(feito)return;feito=1;removeEventListener('popstate',pp);setTimeout(function(){var b=document.createElement('button');b.type='button';b.setAttribute('data-gzopen','');b.setAttribute('data-s207','');b.style.display='none';document.body.appendChild(b);b.click();b.remove()},40)},pp=function(){vai()};
      if(pn&&!(ly&&ly.contains(a))){removeEventListener('popstate',pp);feito=1;try{closePanels()}catch(_){}setTimeout(function(){var b=document.createElement('button');b.type='button';b.setAttribute('data-gzopen','');b.setAttribute('data-s207','');b.style.display='none';document.body.appendChild(b);b.click();b.remove()},60);return}
      addEventListener('popstate',pp);history.back();setTimeout(vai,700)},true);
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('#layer [data-a]');if(a&&(a.classList.contains('on')||a.getAttribute('aria-pressed')==='true')){e.preventDefault();e.stopImmediatePropagation()}},true);
    /* Destaque (13/11): mostra a melhor cor; se essa cor não cumprir as regras da vitrine (sem foto própria quando a regra pede foto), entra outro modelo */
    var _dI=dstItens;dstItens=function(){var R=(CFG&&CFG.dreg)||{};return _dI().filter(function(p){var c=melhorCor(p);if(!c||R.foto===false)return true;return !!((p.fc&&p.fc[c])||p.lib)})};
    /* opiniões (13/11, aprovado): o cliente opina pela conta, no pedido pago; opinião com link/telefone/ofensa vai para o dono revisar */
    var _pkR=pkRecibo;pkRecibo=function(id){_pkR(id);setTimeout(function(){opBloco(id)},60)};
    function opBloco(id){var e=pedGet(id),o=$('pkok');/* S400 (esboços 59f/59g): a opinião só é pedida depois que a loja marca o pedido como ENTREGUE */if(!e||!e.entregue||!o||o.querySelector('.opd'))return;var vis={},its=(e.itens||[]).filter(function(i){if(!i||!i.ref||vis[i.ref])return false;vis[i.ref]=1;return true});if(!its.length)return;
      var box=o.querySelector('.pkb,.pkc,[role=dialog]>div')||o;
      box.insertAdjacentHTML('beforeend',its.map(function(i){var p=find(i.ref)||{};return '<div class="opd" data-opref="'+esc(i.ref)+'"><div class="it">'+(p.foto?'<img src="'+esc(p.foto)+'" alt="">':'')+'<div><small>'+esc(p.ds||p.mat||'')+'</small><b>'+esc(i.ref)+'</b></div></div><div class="opq">'+LFI.tr('O que achou?')+'</div><div class="st">'+[1,2,3,4,5].map(function(k){return '<button type="button" data-opst="'+k+'" class="'+(k<=5?'on':'')+'" aria-label="'+k+'">★</button>'}).join('')+'</div><textarea maxlength="500" placeholder="'+LFI.tr('Conte como ficou (opcional)')+'"></textarea><button type="button" class="go" data-opgo>'+LFI.tr('Enviar opinião')+'</button><div class="ok">'+LFI.tr('Publica depois de uma revisão rápida.')+'</div></div>'}).join(''))}
    document.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-opst],[data-opgo]');if(!t)return;var c=t.closest('.opd');if(!c)return;
      if(t.hasAttribute('data-opst')){var k=+t.getAttribute('data-opst');c._n=k;c.querySelectorAll('[data-opst]').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-opst')<=k)});return}
      t.disabled=true;var ref=c.getAttribute('data-opref');
      idTok().then(function(tk){return acFetch(fnUrl('avaliacao'),{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tk},body:JSON.stringify({acao:'avaliar',ref:ref,nota:c._n||5,txt:c.querySelector('textarea').value||''})})}).then(function(r){return r.json()}).then(function(j){
        if(!j||!j.ok)throw 0;c.innerHTML='<div class="ok" style="font-size:14px;color:#14803f;font-weight:700">✓ '+LFI.tr(j.rev?'Obrigado! Sua opinião será publicada depois da revisão.':'Obrigado! Sua opinião foi publicada.')+'</div>'}).catch(function(){t.disabled=false;toast(LFI.tr('Não consegui enviar agora. Tente de novo mais tarde.'))})});
    var _avP=avalPinta;avalPinta=function(ref,j){var s=$('prv');if(!j||!(j.n>0)){if(s&&s.getAttribute('data-ref')===ref)s.remove();return}_avP(ref,j);var b=document.querySelector('#prv [data-arw]');if(b)b.remove()};
    var PC=function(){return innerWidth>=900};
    function arruma(){
      var m=document.querySelector('#layer .modal.pgm');
      if(m){var l=m.querySelector(':scope>.pgl'),d=m.querySelector(':scope>.det');
        if(PC()&&l&&d){var w=document.createElement('div');w.className='pgtop';m.insertBefore(w,l);w.appendChild(l);w.appendChild(d)}
        else if(!PC()){var w2=m.querySelector(':scope>.pgtop');if(w2){while(w2.firstChild)m.insertBefore(w2.firstChild,w2);w2.remove()}}
        if(!m.querySelector(':scope>.lfft'))m.insertAdjacentHTML('beforeend',rodape5())}
      /* cupom antes do total no carrinho */
      document.querySelectorAll('#layer .cs details.cupf').forEach(function(c){var t=c.parentElement.querySelector(':scope>.cs-t');if(t&&c.nextElementSibling!==t)c.parentElement.insertBefore(c,t)});
      document.querySelectorAll('.hd .hnc').forEach(function(x){x.remove()});if(typeof liga==='function')liga()}
    var tm=0;new MutationObserver(function(){if(tm)return;tm=requestAnimationFrame(function(){tm=0;arruma()})}).observe(document.body,{childList:true,subtree:true});
    addEventListener('resize',function(){arruma()});
    /* Idioma: no computador abre ao lado do menu (não gaveta de celular) */
    var liga=function(){var dsh=$('dsh');if(dsh&&!dsh._s207){dsh._s207=1;new MutationObserver(function(){var p=dsh.querySelector('.dsp');if(!p||!dsh.classList.contains('on')||innerWidth<1100||p.classList.contains('dspc'))return;
      var r=document.querySelector('#drw [data-dset]');if(!r)return;var b=r.getBoundingClientRect();p.classList.add('dspc');p.style.left=Math.round(b.right+14)+'px';p.style.top=Math.max(12,Math.round(b.top-110))+'px'}).observe(dsh,{attributes:true,childList:true})}
    /* busca: a janela cresce saindo da lupa */
    var sov=$('sov');if(sov&&!sov._s207){sov._s207=1;new MutationObserver(function(){if(!sov.classList.contains('on'))return;var p=sov.querySelector('.sopn'),l=$('sbtn');if(!p||!l)return;
      var cs=getComputedStyle(p),w=parseFloat(cs.width)||p.offsetWidth,L=(innerWidth-w)/2,T=parseFloat(cs.top)||12,b=l.getBoundingClientRect();
      p.style.transformOrigin=Math.round(b.left+b.width/2-L)+'px '+Math.round(b.top+b.height/2-T)+'px'}).observe(sov,{attributes:true,attributeFilter:['class']})}};liga();setTimeout(liga,1500);setTimeout(liga,4000);
  })();
})();
/* 11/11 S176-2: altura da barra Comprar (posiciona o WhatsApp logo acima dela) */
(function(){/* S426: a altura vem do ResizeObserver (sem obrigar o navegador a arrumar a tela fora de hora) */var ro=window.ResizeObserver?new ResizeObserver(function(es){var h=es[0]&&es[0].target.offsetHeight;if(h)document.documentElement.style.setProperty('--buyh',h+'px')}):null,ub=null;
  function u(){var b=document.querySelector('.buy');if(!b)return;if(ro){if(b!==ub){if(ub)ro.unobserve(ub);ub=b;ro.observe(b)}return}if(b.offsetHeight)document.documentElement.style.setProperty('--buyh',b.offsetHeight+'px')}try{new MutationObserver(function(){setTimeout(u,60)}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});addEventListener('resize',u)}catch(_){}})();
/* S170 (aprovado e implementado 11/11/2026): animação leve do tema no destaque, (20/11: saíram os selos de tema nas peças e a faixa repetida no catálogo — o tema fica na faixa do topo, no destaque e nas cores) */
(function(){
  var MO='<svg viewBox="0 0 34 16"><path d="M17 5c1-2 2-2 3 0 3-3 8-4 14-1-3 0-5 2-5 5-2-2-5-2-7 1-1-1-3-1-5 0-2-3-5-3-7-1 0-3-2-5-5-5 6-3 11-2 14 1 1-2 2-2 3 0z"/></svg>';
  function r(a,b){return a+Math.random()*(b-a)}
  function fx(){
    var ev=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'');
    var hd=document.querySelector('#home .hd');if(!ev||!hd||hd.querySelector('.evfx'))return;
    var c=document.createElement('div');c.className='evfx';var W=hd.offsetWidth,H=hd.offsetHeight,h='',i;
    function cai(cls,n,t0,t1){for(i=0;i<n;i++)h+='<i class="'+cls+'" style="left:'+r(0,98)+'%;--t:'+r(t0,t1)+'px;--d:'+r(7,12)+'s;--a:-'+r(0,10)+'s;--dx:'+r(-30,30)+'px;--h:'+(H+40)+'px;--r:'+r(-180,180)+'deg"></i>'}
    function pis(n,cor,t0,t1){for(i=0;i<n;i++)h+='<i class="br" style="left:'+r(3,95)+'%;top:'+r(4,90)+'%;--t:'+r(t0,t1)+'px;--d:'+r(1.8,3.2)+'s;--a:'+r(0,3)+'s;--c:'+cor+'"></i>'}
    if(ev==='natal')cai('fl',14,3,6);
    if(ev==='maes')cai('pt',10,7,11);
    if(ev==='anonovo')pis(10,document.documentElement.getAttribute('data-ev')==='anonovo-n'?'#f1dcae':'#c9a86a',8,14);
    if(ev==='pais')pis(6,'#e0b878',7,11);
    if(ev==='halloween'){h+='<i class="mo" style="--w:'+W+'px;--y0:'+H*.12+'px;--y1:'+H*.30+'px;--s:1;--d:5.5s;--a:.4s">'+MO+'</i>';h+='<i class="mo" style="--w:'+W+'px;--y0:'+H*.30+'px;--y1:'+H*.14+'px;--s:.7;--d:6.5s;--a:1.6s">'+MO+'</i>'}
    c.innerHTML=h;hd.insertBefore(c,hd.firstChild);
    setTimeout(function(){c.classList.add('fim')},window.__evfxFim||10000);
  }
  if(document.readyState==='complete')setTimeout(fx,800);else addEventListener('load',function(){setTimeout(fx,800)});
  new MutationObserver(function(){setTimeout(fx,300)}).observe(document.documentElement,{attributes:true,attributeFilter:['data-ev']});
})();
