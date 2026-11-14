
(function(){
  /* S181 (13/11): dentro do app (modo loja) o site mora em /loja/loja.html — o endereço nunca vira "/" (senão um recarregar abriria o app) */
  if(/[?&]loja=1/.test(location.search)&&window.parent!==window){(function(){var LJ=location.pathname;['pushState','replaceState'].forEach(function(k){var o=history[k];history[k]=function(s,t,u){try{if(u!=null){var x=new URL(u,location.href);x.pathname=LJ;if(!/[?&]loja=1/.test(x.search))x.search=(x.search?x.search+'&':'?')+'loja=1&nosync';u=x.pathname+x.search+x.hash}}catch(_){}return o.call(history,s,t,u)}})})()}
  var P=[
    {ref:'SL2210',gen:'f',nome:'Solar hexagonal preto',tipo:'solar',n:130000,cor:'#2a2d33',raio:26,aviso:'Chegou esta semana',tag:'NOVO',rosto:['oval', 'quadrado', 'alongado'],mat:'Acetato',med:[54, 17, 145],foto:'/loja/media/i/3c5853357cf4.jpg',cores:['#2a2d33']},
    {ref:'AC1050',gen:'u',nome:'Armação acetato roxa',tipo:'armacao',n:118000,cor:'#4a2a55',raio:14,aviso:'Chegou esta semana',tag:'ACETATO',rosto:['redondo', 'oval', 'diamante'],mat:'Acetato',med:[50, 21, 145],foto:'/loja/media/i/80f4857cb1cf.jpg',cores:['#4a2a55']},
    {ref:'AC1055',gen:'f',nome:'Armação redonda rosa',tipo:'armacao',n:105000,cor:'#e3a1ab',raio:40,aviso:'',tag:'ACETATO',rosto:['quadrado', 'alongado', 'diamante'],mat:'Acetato',med:[47, 22, 140],foto:'/loja/media/i/1e59e39c9c89.jpg',cores:['#e3a1ab']},
    {ref:'GR3340',gen:'u',nome:'Óculos de leitura quadrado preto',tipo:'grau',n:98000,cor:'#1d1d1f',raio:8,aviso:'',tag:'GRAU',rosto:['redondo', 'oval', 'coracao'],mat:'Acetato',med:[50, 22, 145],foto:'/loja/media/i/b0ce33cc336d.jpg',cores:['#1d1d1f']},
    {ref:'SL2250',gen:'m',nome:'Solar quadrado dourado',tipo:'solar',n:148000,cor:'#b08a4a',raio:10,aviso:'',tag:'METAL',rosto:['oval', 'coracao', 'alongado'],mat:'Metal',med:[54, 18, 145],foto:'/loja/media/i/8c1802baa300.jpg',cores:['#b08a4a']},
    {ref:'SL2255',gen:'m',nome:'Solar esportivo polarizado',tipo:'solar',n:135000,cor:'#2a2d33',raio:6,aviso:'Últimas 2 unidades',tag:'SOLAR',rosto:['oval', 'quadrado', 'alongado'],mat:'Policarbonato',med:[58, 17, 140],foto:'/loja/media/i/9afe335de059.jpg',cores:['#2a2d33']},
    {ref:'SL2260',gen:'u',nome:'Solar redondo preto',tipo:'solar',n:128000,cor:'#1d1d1f',raio:40,aviso:'',tag:'SOLAR',rosto:['quadrado', 'alongado', 'diamante'],mat:'Acetato',med:[49, 22, 145],foto:'/loja/media/i/440eab1a058d.jpg',cores:['#1d1d1f']},
    {ref:'SL2265',gen:'f',nome:'Solar gatinho branco',tipo:'solar',n:132000,cor:'#d9d9d9',raio:24,aviso:'Chegou esta semana',tag:'NOVO',rosto:['oval', 'quadrado', 'diamante'],mat:'Acetato',med:[53, 20, 145],foto:'/loja/media/i/3716fea484c8.jpg',cores:['#d9d9d9']},
    {ref:'SL2270',gen:'f',nome:'Solar hexagonal verde',tipo:'solar',n:142000,cor:'#b08a4a',raio:20,aviso:'',tag:'METAL',rosto:['redondo', 'oval', 'coracao'],mat:'Metal',med:[50, 20, 145],foto:'/loja/media/i/2c4d351d1f1c.jpg',cores:['#b08a4a']},
    {ref:'SL2275',gen:'m',nome:'Solar quadrado tartaruga',tipo:'solar',n:150000,cor:'#6b4a2b',raio:12,aviso:'',tag:'SOLAR',rosto:['oval', 'alongado', 'coracao'],mat:'Acetato',med:[55, 19, 145],foto:'/loja/media/i/484683019e1e.jpg',cores:['#6b4a2b']},
    {ref:'BR44140',gen:'f',nome:'Armação metal gatinho preta',tipo:'armacao',n:112000,cor:'#1d1d1f',raio:22,aviso:'Última unidade',tag:'METAL',rosto:['quadrado', 'redondo', 'diamante'],mat:'Metal',med:[54, 17, 140],foto:'/loja/media/i/5fb4b4ba4c26.jpg',cores:['#1d1d1f']},
    {ref:'GR3350',gen:'u',nome:'Óculos de leitura transparente',tipo:'grau',n:115000,cor:'#cfd6dc',raio:8,aviso:'',tag:'GRAU',rosto:['redondo', 'oval', 'coracao'],mat:'Acetato',med:[50, 21, 145],foto:'/loja/media/i/b95b382e346d.jpg',cores:['#cfd6dc']},
    {ref:'SL2280',gen:'m',nome:'Solar espelhado azul',tipo:'solar',n:138000,cor:'#2f6fd0',raio:6,aviso:'',tag:'SOLAR',rosto:['oval', 'quadrado', 'alongado'],mat:'Acetato',med:[57, 17, 145],foto:'/loja/media/i/f2c6969ac2c7.jpg',cores:['#2f6fd0']},
    {ref:'SL2285',gen:'u',nome:'Solar redondo fino preto',tipo:'solar',n:126000,cor:'#1d1d1f',raio:40,aviso:'',tag:'SOLAR',rosto:['quadrado', 'alongado', 'diamante'],mat:'Metal e acetato',med:[47, 22, 140],foto:'/loja/media/i/dd88e5a9c300.jpg',cores:['#1d1d1f']},
    {ref:'SL2290',gen:'u',nome:'Solar clássico tartaruga',tipo:'solar',n:130000,cor:'#6b4a2b',raio:14,aviso:'',tag:'SOLAR',rosto:['redondo', 'oval', 'coracao'],mat:'Acetato',med:[52, 20, 145],foto:'/loja/media/i/03b6e7db33ea.jpg',cores:['#6b4a2b']},
    {ref:'SL2295',gen:'f',nome:'Solar aviador rosa',tipo:'solar',n:145000,cor:'#b0b5bb',raio:30,aviso:'Esgotado',tag:'SOLAR',rosto:['coracao', 'quadrado', 'oval'],mat:'Metal',med:[58, 14, 140],foto:'/loja/media/i/065360cddf6d.jpg',cores:['#b0b5bb']},
    {ref:'BR44145',gen:'u',nome:'Armação metal redonda dourada',tipo:'armacao',n:119000,cor:'#b08a4a',raio:40,aviso:'Última unidade',tag:'METAL',rosto:['quadrado', 'diamante', 'alongado'],mat:'Metal',med:[46, 22, 140],foto:'/loja/media/i/3af2a18ebd86.jpg',cores:['#b08a4a']},
    {ref:'GR3345',gen:'m',nome:'Óculos de leitura retangular tartaruga',tipo:'grau',n:96000,cor:'#7a3b2e',raio:6,aviso:'',tag:'GRAU',rosto:['redondo', 'oval', 'coracao'],mat:'Acetato',med:[52, 18, 145],foto:'/loja/media/i/64906105e7b5.jpg',cores:['#7a3b2e']},
    {ref:'SL2300',gen:'f',nome:'Solar gatinho tartaruga',tipo:'solar',n:136000,cor:'#6b4a2b',raio:22,aviso:'',tag:'SOLAR',rosto:['quadrado', 'diamante', 'oval'],mat:'Acetato',med:[53, 19, 145],foto:'/loja/media/i/29039e804a4a.jpg',cores:['#6b4a2b']},
    {ref:'SL2305',gen:'m',nome:'Solar aviador preto e dourado',tipo:'solar',n:168000,cor:'#2a2d33',raio:30,aviso:'Últimas 2 unidades',tag:'LUXO',rosto:['oval', 'quadrado', 'alongado'],mat:'Metal e acetato',med:[51, 21, 145],foto:'/loja/media/i/ed4a2a191ad1.jpg',cores:['#2a2d33']}
  ];
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
  function vis(p,w){return p.foto?'<img class="pf" src="'+p.foto+'" alt="'+esc(p.nome)+'" draggable="false">':glasses(p.cor,p.raio,w)}
  function glasses(c,r,w){return '<svg viewBox="0 0 200 200" fill="none" stroke="'+c+'" stroke-width="'+(w||5)+'" stroke-linecap="round" aria-hidden="true"><ellipse cx="100" cy="150" rx="62" ry="6" fill="#000" stroke="none" opacity=".08"/><rect x="22" y="76" width="68" height="52" rx="'+r+'" fill="#e6f1fb"/><rect x="110" y="76" width="68" height="52" rx="'+r+'" fill="#e6f1fb"/><path d="M90 96c6-6 14-6 20 0M22 88L8 82M178 88l14-6"/></svg>'}
  function colorFoto(p,i,cb){if(!i){cb(p.foto);return}p.fc=p.fc||[];if(p.fc[i]){cb(p.fc[i]);return}fbg('fotos/'+p.ref+'~'+i).then(function(d){var o=fbd(d);if(o.d){p.fc[i]=o.d;cb(o.d)}}).catch(function(){})}
  function find(ref){return P.filter(function(p){return p.ref===ref})[0]}
  function bruto(){return Object.keys(st.cart).reduce(function(a,k){return a+st.cart[k]*find(k).n},0)}
  function brutoD(){return Object.keys(st.cart).reduce(function(a,k){return a+st.cart[k]*LFI.pv(find(k).n)},0)}
  /* Leve 2 (aprovado 11/11/2026): 30% na 2ª peça de cada par (a mais barata); só leitura e solar que o app liberou (l2: o piso não é furado) */
  function l2Info(){var u=[];Object.keys(st.cart).forEach(function(k){var p=find(k);if(p&&p.l2===true&&p.aviso!=='Esgotado'&&(p.tipo==='grau'||p.tipo==='solar'))for(var i=0;i<st.cart[k];i++)u.push({k:k,n:p.n})});
    u.sort(function(a,b){return b.n-a.n});var r={n:u.length,d:0,dD:0,por:{}};for(var i=1;i<u.length;i+=2){var x=u[i],v=Math.ceil(x.n*0.7/1000)*1000,dd=Math.max(0,x.n-v);r.d+=dd;r.dD+=Math.max(0,LFI.pv(x.n)-LFI.pv(v));r.por[x.k]=(r.por[x.k]||0)+dd}return r}
  /* Cupons (S174, aprovado 11/11/2026): 1 código por compra; não vale em peça em OFERTA ("ya tiene su mejor precio");
     em cada peça vale no máximo o % que o app liberou (cmx: nunca abaixo do piso); com "Leve 2" vale o maior desconto. */
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
  /* qual desconto vale no carrinho: 'l2', 'cup' ou '' */
  function descVale(){var a=l2Info().d,c=cupInfo().d;return c>0&&c>=a?'cup':a>0?'l2':''}
  function descD(){var v=descVale();return v==='cup'?cupInfo().d:v==='l2'?l2Info().d:0}
  function descDD(){var v=descVale();return v==='cup'?cupInfo().dD:v==='l2'?l2Info().dD:0}
  function cupFn(b){var o={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)};if(b.acao==='meus'){var se=sessG();if(se&&se.idToken)o.headers.Authorization='Bearer '+se.idToken}
    return fetch('https://southamerica-east1-'+FB.p+'.cloudfunctions.net/cupom',o).then(function(r){return r.json()})}
  function cupGuarda(c){st._cupErr='';st.cup=c?{cod:c.cod,pct:c.pct,tipo:c.tipo,fim:c.fim||0,min:c.min||0,restam:c.restam}:null;lsS('lf_cup',st.cup)}
  function cupTira(){cupGuarda(null)}
  var CUPI='<svg class="cupi" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v1.5a2.5 2.5 0 0 0 0 5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3.5a2.5 2.5 0 0 0 0-5z"/><path d="M14 6v12" stroke-dasharray="2 2"/></svg>';
  var CUP_TIPO={bv:'Boas-vindas',px:'Próxima compra',am:'Indique uma amiga',vip:'Cliente fiel',fiel:'Cliente fiel',ev:'Cupom do evento'};
  function cupData(t){return t?new Date(t).toLocaleDateString(LFI.lang==='es'?'es-PY':'pt-BR'):''}
  function cupMsg(m,c){var cod=c&&c.cod?c.cod:'';return {nao:LFI.tr('Código não encontrado. Confira as letras.'),usado:LFI.tr('Este código já foi usado.'),vencido:LFI.tr('Este código venceu.'),cancelado:LFI.tr('Este código foi cancelado.'),
    ja:LFI.tr('Você já usou')+' '+cod+'. '+LFI.tr('Obrigado! Seu cartão de próxima compra continua valendo.'),esgotado:LFI.tr('Os cupons')+' '+cod+' '+LFI.tr('acabaram.'),outro:LFI.tr('Este código é pessoal, de outro telefone.'),
    trava:LFI.tr('Este código está travado por 24 h por tentativas erradas.'),proprio:LFI.tr('Seu código de amiga é para compartilhar: você ganha quando ela comprar.'),cliente:LFI.tr('Este código é só para a primeira compra.'),
    min:LFI.tr('Compra mínima de')+' '+fmt((c&&c.min)||0)+'.',cedo:LFI.tr('Este código ainda não começou a valer.'),pendente:LFI.tr('Este cartão começa a valer quando confirmarmos o pagamento.'),espera:LFI.tr('Muitas tentativas. Tente de novo em 1 hora.'),pausa:LFI.tr('Agora não há códigos novos. Tente no mês que vem.')}[m]||LFI.tr('Não deu para conferir o código agora. Tente de novo.')}
  function cupAplica(cod,cb){cod=String(cod||'').trim();if(!cod)return;var c=getConta()||{};
    cupFn({acao:'ver',cod:cod,tel:c.tel||'',email:c.email||(sessG()||{}).email||''}).then(function(j){if(j&&j.ok){cupGuarda(j.cupom);toast(LFI.tr('Código aplicado')+' ✓');}else toast(cupMsg(j&&j.motivo,j&&j.cupom));if(cb)cb(j)},function(){toast(LFI.tr('Não deu para conferir o código agora. Tente de novo.'));if(cb)cb(null)})}
  /* carrinho: "¿Tenés un código?" + linha do desconto + avisos (vale o maior, peça em oferta, quedan N de 50) */
  function cupHtml(dd){var ci=cupInfo(),v=descVale();
    if(!st.cup&&dd)return '';
    if(st.cup&&v==='cup'&&!ci.min){var cc=cupConta(),nm=esc(st.cup.cod)+' · −'+st.cup.pct+'%';
      if(dd)return '<div class="cs-r cupl cupd"><span>'+CUPI+LFI.tr('Cupom')+' '+nm+'</span><span class="cupv">−'+LFI.fmtD(ci.dD)+'</span></div>';
      return '<div class="cupcard">'+CUPI+'<div class="cupct"><b>'+nm+'</b><small>'+LFI.tr('Cupom aplicado em')+' '+cc.a+' '+LFI.tr('de')+' '+cc.n+' '+LFI.tr(cc.n===1?'peça':'peças')+'</small></div><button type="button" class="cuprm" data-cupx>'+LFI.tr('remover')+'</button></div>'}
    if(!st.cup)return '<details class="cupf"'+(st._cupOpen?' open':'')+'><summary>'+LFI.tr('Tem um código?')+'</summary><div class="cupr"><input class="field" id="cupin" placeholder="LF-XXXX" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="'+LFI.tr('Código de desconto')+'"><button type="button" class="btn" data-cupok>'+LFI.tr('Aplicar')+'</button></div>'+(st._cupErr?'<small class="cupn cupe" role="alert">'+esc(st._cupErr)+'</small>':'')+'<small class="cupn">'+LFI.tr('Um código por compra. Não soma com OFERTA nem com "Leve 2": vale o maior desconto.')+'</small></details>';
    var nome=LFI.tr(CUP_TIPO[st.cup.tipo]||'Código')+' −'+st.cup.pct+'%',ex=st.cup.tipo==='ev'&&st.cup.restam!=null?'<small class="cupn">'+LFI.tr('Restam')+' '+st.cup.restam+'</small>':'';
    if(ci.min)return '<div class="cs-r cupl"><span>'+esc(st.cup.cod)+' · '+nome+'</span><button type="button" class="cupx" data-cupx aria-label="'+LFI.tr('Tirar o código')+'">×</button></div><small class="cupn">'+LFI.tr('Compra mínima de')+' '+LFI.fmtD(LFI.pv(st.cup.min))+'. '+LFI.tr('O código continua guardado.')+'</small>';
    if(v!=='cup')return '<div class="cs-r cupl"><span>'+esc(st.cup.cod)+' · '+nome+'</span><button type="button" class="cupx" data-cupx aria-label="'+LFI.tr('Tirar o código')+'">×</button></div><small class="cupn">'+(ci.d>0?LFI.tr('O "Leve 2" dá mais desconto nesta compra: vale o maior. O código continua guardado.'):LFI.tr('Nesta compra o código não dá desconto (as peças já têm o melhor preço). Ele continua guardado.'))+'</small>';
    return '<div class="cs-r cupl"><span>'+esc(st.cup.cod)+' · '+nome+'</span><span class="cupv">−'+LFI.fmtD(ci.dD)+' <button type="button" class="cupx" data-cupx aria-label="'+LFI.tr('Tirar o código')+'">×</button></span></div>'+ex}
  /* peça: "Tu código vale aquí ✓ − Gs. 13.000" / "Ya tiene su mejor precio" */
  function cupPecaHtml(p){if(!st.cup)return '';var x=cupPeca(p);if(x.of)return '<div class="cupp of"><b>'+LFI.tr('Já tem o melhor preço')+'</b> · '+LFI.tr('o código fica para outra compra')+'</div>';
    if(!(x.d>0))return '<div class="cupp of">'+LFI.tr('O código')+' '+esc(st.cup.cod)+' '+LFI.tr('não vale nesta peça')+'</div>';
    return '<div class="cupp"><b>'+LFI.tr('Seu código vale aqui')+' ✓</b> · −'+LFI.fmtD(LFI.pv(x.d))+(x.lim?' ('+x.pct+'%)':'')+'</div>'}
  /* cartão virtual (Próxima compra) na tela de pagar e em Minha conta › Cartões */
  function pxHtml(c){if(!c)return '';var pend=c.estado==='pendente';return '<div class="pxc" id="pxcard"><small>LA FOUCH</small><b>'+c.pct+'% '+LFI.tr(c.tipo==='bv'?'na primeira compra':c.tipo==='am'?'para sua amiga':'na próxima compra')+'</b><code>'+esc(c.cod)+'</code><i>'+(pend?LFI.tr('Começa a valer quando confirmarmos o pagamento · fica em Minha conta › Cartões'):(c.fim?LFI.tr('Vale até')+' '+cupData(c.fim)+' · ':'')+LFI.tr('em lafouch.com e na loja'))+'</i></div>'}
  function mtjCarrega(){var b=document.getElementById('mtj');if(!b)return;cupFn({acao:'meus'}).then(function(j){var b2=document.getElementById('mtj');if(!b2)return;if(!j||!j.ok){b2.innerHTML='<div class="note">'+LFI.tr('Não deu para carregar seus cartões agora.')+'</div>';return}
    var L=j.cupons||[];b2.innerHTML=L.length?L.map(function(c){var est=c.usado||c.estado==='usado'?LFI.tr('Usado'):c.estado==='ok'?LFI.tr('Disponível'):c.estado==='pendente'?LFI.tr('Aguardando pagamento'):c.estado==='vencido'?LFI.tr('Vencido'):c.estado==='cedo'?LFI.tr('Ainda não começou'):LFI.tr('Indisponível');
      return '<div class="mtc"><div>'+pxHtml(c).replace(' id="pxcard"','')+'</div><div class="mtl"><span>'+LFI.tr('Estado')+': <b>'+est+'</b>'+(c.fim?' · '+LFI.tr('vence')+' '+cupData(c.fim):'')+'</span>'+(c.estado==='ok'&&!c.usado&&c.tipo!=='am'?'<button type="button" class="btn" data-cupusar="'+esc(c.cod)+'">'+LFI.tr('Usar no meu carrinho')+'</button>':c.tipo==='am'?'<button type="button" class="cfx" data-cupcopy="'+esc(c.cod)+'">'+LFI.tr('Copiar para enviar')+'</button>':'')+'</div></div>'}).join(''):'<div class="note">'+LFI.tr('Você ainda não tem cartões. Eles chegam com a sua compra.')+'</div>'},function(){})}
  /* boas-vindas depois de se inscrever nas novidades */
  function bvMostra(c){var o=document.createElement('div');o.id='bvov';o.className='bvov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
    o.innerHTML='<div class="bvb"><button type="button" class="x" data-bvx aria-label="'+LFI.tr('Fechar')+'">×</button><small>LA FOUCH</small><h3>'+LFI.tr('Bem-vinda à La Fouch!')+'</h3><p>'+LFI.tr('Obrigado por se inscrever nas novidades. Seu presente:')+'</p>'+pxHtml(c)+'<p class="cupn">'+LFI.tr('Vale 30 dias · em lafouch.com e na loja de CDE · também mandamos por e-mail')+'</p><button type="button" class="btn w" data-cupusar="'+esc(c.cod)+'">'+LFI.tr('Usar agora')+'</button><button type="button" class="cfx" data-cupcopy="'+esc(c.cod)+'">'+LFI.tr('Copiar código')+'</button></div>';
    document.body.appendChild(o)}
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-cupok],[data-cupx],[data-cupusar],[data-cupcopy],[data-bvx]');if(!t)return;
    if(t.hasAttribute('data-cupok')){var i=document.getElementById('cupin');t.disabled=true;st._cupOpen=true;cupAplica(i&&i.value,function(j){t.disabled=false;st._cupErr=j&&j.ok?'':j?cupMsg(j.motivo,j.cupom):LFI.tr('Não deu para conferir o código agora. Tente de novo.');bag(true);var i2=document.getElementById('cupin');if(i2&&!(j&&j.ok)){i2.value=i&&i.value||'';i2.focus()}})}
    else if(t.hasAttribute('data-cupx')){cupTira();bag(true)}
    else if(t.hasAttribute('data-cupusar')){var bo=document.getElementById('bvov');if(bo)bo.remove();cupAplica(t.getAttribute('data-cupusar'),function(j){if(j&&j.ok){closeLayer();setTimeout(function(){bag()},50)}})}
    else if(t.hasAttribute('data-cupcopy')){var cd=t.getAttribute('data-cupcopy');try{navigator.clipboard.writeText(cd+' · https://lafouch.com/t/'+cd).then(function(){toast(LFI.tr('Código copiado'))})}catch(_){}}
    else if(t.hasAttribute('data-bvx')){var bb=document.getElementById('bvov');if(bb)bb.remove()}});
  /* S181 (aprovado 12/11): MODO LOJA — o app leva uma cópia deste site e abre em loja.html?loja=1&nosync dentro do modo cliente.
     O app manda TODO o inventário (preço de varejo, com as ofertas do site) por postMessage; "Comprar" vira "Quero este";
     o cliente junta as peças em "Meu pedido" e toca "Llamar a un vendedor"; o vendedor encontra as peças no carrinho do app. */
  if(/[?&]loja=1/.test(location.search)&&window.parent!==window){document.documentElement.classList.add('lojamodo');
    var LP=[];
    var lojaPosta=function(o){try{window.parent.postMessage(Object.assign({lfLoja:1},o),'*')}catch(_){}};
    var lojaBarra=function(){var b=$('lojab');if(!b){b=document.createElement('div');b.id='lojab';b.innerHTML='<span class="lojk">'+LFI.tr('LOJA · todo o estoque')+'</span><button type="button" id="lojap">'+LFI.tr('Meu pedido')+' <b id="lojan">0</b></button>';document.body.appendChild(b);$('lojap').onclick=lojaPed}var n=LP.reduce(function(a,x){return a+x.q},0);$('lojan').textContent=n};
    var lojaPed=function(){var es=LFI.lang==='es';layer('<aside class="panel lojpn" role="dialog" aria-modal="true" aria-label="Meu pedido"><div class="xw"><button class="x" data-close aria-label="Fechar">×</button></div><h2 class="sepT">'+LFI.tr('Meu pedido')+'</h2>'+(LP.length?LP.map(function(x,i){var p=find(x.ref)||{};return '<div class="lojl"><span class="lojim">'+vis(p,5)+'</span><span><b>'+esc(nomeSC(p)||x.ref)+'</b><small>'+esc([x.ref,x.cor,x.grau].filter(Boolean).join(' · '))+(x.q>1?' · '+x.q+' un.':'')+'</small></span><b>'+fmt((p.n||0)*x.q)+'</b><button type="button" class="cupx" data-lrm="'+i+'" aria-label="Tirar">×</button></div>'}).join(''):'<p class="sepS">'+LFI.tr('Toque em "Quero este" nas peças que você gostou.')+'</p>')+
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
    var fn=function(b){return fetch(fnUrl('atacado'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({c:C,dev:dev,tok:A.tok},b))}).then(function(r){return r.json()})};
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
    var foto=function(it){return (it.foto?'<img src="/'+esc(it.foto)+'" alt="" loading="lazy">':glasses('#2a2d33',10,5))+'<i class="atwm">'+esc((A.conta&&A.conta.nome)||'')+' · '+esc((A.conta&&A.conta.nome)||'')+'</i>'};
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
    fetch('https://southamerica-east1-'+FB.p+'.cloudfunctions.net/volta',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({acao:'pedir',ref:ref,email:em,lang:LFI.lang,site:sc.querySelector('.vhp').value})}).then(function(r){return r.json()}).then(function(j){if(!j||!j.ok)throw j;var fe=lsG('lf_voltas',{});fe[ref]=Date.now();lsS('lf_voltas',fe);lsS('lf_vemail',em);sc.innerHTML='<div class="vok">✓ '+LFI.tr('Vamos te avisar por e-mail quando voltar.')+'</div>'},function(){throw 0}).catch(function(j){b.disabled=false;toast(LFI.tr(j&&j.motivo==='muitas'?'Você já tem muitos avisos pendentes.':'Não deu para enviar agora. Tente de novo.'))})});
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
  function temaNome(t){var x=TSEL[t];return x?x[window.LFI&&LFI.lang==='es'?1:0]:''}
  var CATN={grau:['Leitura','Lectura'],solar:['Sol','Sol'],armacao:['Armações','Armazones']};
  function catRank(p){if(!(p.mv>0))return 0;var L=P.filter(function(q){return q.tipo===p.tipo&&q.mv>0&&q.aviso!=='Esgotado'}).sort(function(a,b){return a.mv-b.mv}),k=L.indexOf(p)+1;return k>0&&k<=3?k:0}
  function selo1(p,cls){var es=window.LFI&&LFI.lang==='es',c=cls||'sel1';if(p.aviso==='Esgotado')return '';var tm=temaDe(p);
    if(isOf(p))return '<span class="'+c+' of">−'+pct5(p)+'%'+(tm?' · '+esc(temaNome(tm)):'')+'</span>';
    if(tm)return '<span class="'+c+' tm t-'+tm+'">'+esc(temaNome(tm))+'</span>';
    var k=0;if(k)return '<span class="'+c+' rk">Nº '+k+' '+(es?'en ':'em ')+((CATN[p.tipo]||['',''])[es?1:0])+'</span>';
    if(isNovo(p)||p.aviso==='Chegou esta semana')return '<span class="'+c+' nv">'+LFI.tr('Chegou esta semana')+'</span>';return ''}
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
  function faceName(id){var f=FACES.filter(function(x){return x.id===id})[0];return f?f.nome:id}
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
      return '<article class="card'+(esg?' esg':'')+(isOf(p)?' of':'')+(tm0?' ot t-'+tm0:'')+'" style="--i:'+i+'">'+selo1(p)+edb(p)+'<button class="fav'+(st.fav[p.ref]?' on':'')+'" data-fav="'+p.ref+'" aria-label="Favoritar '+esc(p.nome)+'" aria-pressed="'+(!!st.fav[p.ref])+'">'+HEART+'</button><button class="open" data-open="'+p.ref+'" aria-label="Ver '+esc(p.nome)+'"><div class="ph">'+(esg?sk:'')+ofx(p)+vis(p)+(!esg&&/Últim/.test(p.aviso||'')?'<span class="ulin"><i></i>'+esc(p.aviso)+'</span>':'')+'<span class="shine"></span>'+(p.fotos&&p.fotos[1]?'<span class="alt2"><img src="'+p.fotos[1]+'" alt=""></span>':(!p.foto&&p.cores&&p.cores[1]?'<span class="alt2">'+glasses(p.cores[1],p.raio,5)+'</span>':''))+'</div><div class="info"><span class="rr">'+(p.ds!=null?'<span class="ref lfds">'+esc(p.ds)+'</span>':'<span class="ref">'+p.ref+'</span>')+(p.uv?'<span class="uvc" title="Proteção UV400">UV400</span>':'')+'</span><span class="nm'+(p.ds!=null?' lfcod':'')+'">'+esc(p.ds!=null?p.ref:p.nome)+'</span>'+(p.cores&&p.cores.length?'<span class="esw">'+p.cores.slice(0,6).map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</span>':'')+'<span class="pr">'+prx(p)+'</span>'+eco(p)+'<span class="av">'+esc(p.aviso)+'</span></div></button></article>'}):null,GH=HA?HA.join(''):'<div class="empty">Nenhum modelo com esses filtros. Tire um filtro ou limpe a busca.</div>';
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
      f=document.createElement('i');f.className='favfly';f.style.cssText='position:fixed;z-index:90;left:'+(x0/z-11)+'px;top:'+(y0/z-11)+'px;width:22px;height:22px;color:'+ac+';pointer-events:none';
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
    var mi=document.createElement('i');mi.className='favgh';mi.textContent='−1';mi.style.cssText='position:fixed;z-index:90;left:'+(cx/z-20)+'px;top:'+(r.top/z+4)+'px;width:40px;text-align:center;font:800 15px Inter,sans-serif;color:var(--mu,#777);pointer-events:none;opacity:0;font-style:normal';document.body.appendChild(mi);
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
      return '<div class="cmpc"><span class="rth">'+vis(p,5)+'</span><h3>'+esc(p.nome)+'</h3><dl><div><dt>Preço</dt><dd>'+fmt(p.n)+'</dd></div><div><dt>Tipo</dt><dd>'+esc(p.tag)+'</dd></div><div><dt>Disponível</dt><dd>'+(p.aviso?esc(p.aviso):'Em estoque')+'</dd></div></dl><button class="btn p" data-open="'+p.ref+'">Ver este modelo</button></div>'}).join('')+'</div></div>','center')}
  function drawBag(){
    var n=qtd();$('badge').textContent=n;try{localStorage.setItem('lf_cart',JSON.stringify({c:st.cart,o:st.cor}))}catch(_){}
    drawGrid()}
  function pop(){var b=$('badge');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}

  /* voar até a sacola */
  function fly(fromEl,ref){
    var p=find(ref),to=$('bagbtn').getBoundingClientRect(),from=fromEl.getBoundingClientRect();
    if(!window.Element||!Element.prototype.animate||matchMedia('(prefers-reduced-motion: reduce)').matches){pop();return}
    var f=document.createElement('div');f.className='fly';f.innerHTML=vis(p,7);
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
    e.innerHTML='<div class="cadb"><div class="cadk"><svg viewBox="0 0 52 52" aria-hidden="true"><circle class="c" cx="26" cy="26" r="23"/><path class="t" d="M15 27l8 8 14-17"/></svg></div><div class="cadp"><div class="cadi">'+vis(p,6)+'</div><div class="cadt"><b>'+esc(p.nome)+'</b><span>'+fmtL(p,st.cart[p.ref])+'</span></div></div><h3>'+LFI.tr('Adicionado ao carrinho')+'</h3><button type="button" class="btn w" data-cadfin>'+LFI.tr('Finalizar compra')+'</button><button type="button" class="cs-c" data-cadcont>'+LFI.tr('Continuar comprando')+'</button></div>';
    document.body.appendChild(e);var f=e.querySelector('[data-cadfin]');if(f)f.focus()}
  document.addEventListener('click',function(e){
    var qb=e.target.closest('[data-pq]');
    if(qb){var by=qb.closest('.buy'),pr=find(prodRef);if(!by||!pr)return;var q=Math.max(1,Math.min(99,(+by.getAttribute('data-q')||1)+(+qb.getAttribute('data-pq'))));by.setAttribute('data-q',q);var n=by.querySelector('[data-pqn]');if(n)n.textContent=q;by.querySelectorAll('[data-ptot]').forEach(function(x){x.textContent=(x.classList.contains('bt')?' · ':'')+fmtL(pr,q)});return}
    var dm=e.target.closest('[data-pdm]');
    if(dm){var d=dm.closest('.pdesc');d.classList.toggle('open');dm.textContent=LFI.tr(d.classList.contains('open')?'Ver menos':'Ver mais')}});
  function addDlgClose(){var o=$('cad');if(o)o.remove()}
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&$('cad')){addDlgClose();e.stopPropagation()}},true);
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
    l.innerHTML='<div class="scrim '+(cls||'')+'"'+(pgm?'':' data-close')+'>'+html+'</div>';
    document.documentElement.classList.add('lock');var f=l.querySelector('button,input');if(f)f.focus();if(am)pgCart(0,0,'#acc',am[1])}
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
  function pgBar(p){return '<div class="pgbar"><button type="button" class="pgback navb" data-pgback><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>'+esc(navTxt(p))+'</span></button><span class="pgcr"><button type="button" data-crumb="todos">'+LFI.tr('Catálogo')+'</button><i>›</i><button type="button" data-crumb="'+esc(p.tipo)+'">'+esc((TIPOS.filter(function(t){return t[0]===p.tipo})[0]||[0,''])[1])+'</button><i>›</i><span>'+p.ref+'</span></span></div>'}
  /* v453: botão de favoritos também na página da peça (o coração voa para ele, igual ao catálogo) */
  /* 08/11 (aprovado): comparar e compartilhar no topo, ao lado do coração de cima (mesmo botão redondo) */
  function pgActs(p){return '<button type="button" class="ib fbtn pgact'+(st.cmp.indexOf(p.ref)>=0?' on':'')+'" data-cmp="'+p.ref+'" aria-label="'+LFI.tr('Comparar')+'">'+CMPI+'</button><button type="button" class="ib fbtn pgact" data-share="'+p.ref+'" aria-label="'+LFI.tr('Compartilhar')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.7l6.8-4M8.6 13.3l6.8 4"/></svg></button>'}
  function pgFavBtn(){var n=Object.keys(st.fav).length;return '<button type="button" class="ib fbtn pgfav" id="ftogp" data-pgfav'+(n?'':' hidden')+' aria-label="'+LFI.tr('Meus favoritos')+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+FAV_HP+'"/></svg><b class="fcn">'+(n||'')+'</b></button>'}
  function pgBarCart(){return '';var _x='<div class="pgbar"><button type="button" class="pgback" data-pgback="cart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Voltar ao catálogo</span></button><span class="pgcr">Seu carrinho</span></div>'}
  function pgBarAcc(t){return '';var _x='<div class="pgbar"><button type="button" class="pgback" data-pgback="cart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Voltar ao catálogo</span></button><span class="pgcr">'+t+'</span></div>'}
  function pgCart(re,pop,kind,ttl){
    kind=kind||'#cart';var url=kind==='#cart'?'/carrinho':'/conta',stt=kind==='#cart'?{lfc:1}:{lfa:1};
    lfBootFim();
    var sc=document.querySelector('#layer .scrim');if(sc){if(!re)sc.scrollTop=0;var hd=document.querySelector('header.top,.top');if(hd){var z=parseFloat(getComputedStyle(document.body).zoom)||1,hb=hd.getBoundingClientRect().bottom/z;if(hb>0&&hb<400)sc.style.top=hb+'px'}}
    if(re||prodOpen&&prodRef===kind)return;
    var sw=prodOpen&&(prodRef==='#cart'||prodRef==='#acc');
    if(!prodOpen){try{var vs0=$('vscr'),pp0=document.querySelector('.sec.pop');sessionStorage.setItem('lf_back',JSON.stringify({h:pp0?pp0.id:'',sy:vs0?vs0.scrollTop:0,ps:pp0?pp0.scrollTop:0,tipo:st.tipo,gen:st.gen,q:st.q,sort:st.sort,rosto:st.rosto}))}catch(_){}}
    if(!prodTitle)prodTitle=document.title;document.title=(ttl||'Seu carrinho')+' · La Fouch';
    prodOpen=true;prodRef=kind;waReset();
    if(pop)return;
    try{if(sw){stt.d=prodDepth;history.replaceState(stt,'',url)}else{prodDepth++;stt.d=prodDepth;history.pushState(stt,'',url)}}catch(_){}}
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
    if(s&&s.lfa){prodDepth=s.d||1;prodRef='';minhaConta()}
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
      {id:'cmp',is:function(){return !!document.querySelector('#layer .modal.cmp')},fecha:function(){closeLayer()}}];
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
      v.style.cssText='position:fixed;inset:0;z-index:2147483000;background:var(--bg);opacity:0;pointer-events:auto';document.body.appendChild(v);
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
      var h=a.getAttribute('href')||'';if(!a.hasAttribute('data-navcat')&&!a.hasAttribute('data-gzopen')&&(h==='#'||h==='#topo'))return;
      /* S90: com a consulta aberta, "Descubra o seu grau" no menu só fecha o menu */
      if(a.hasAttribute('data-gzopen')&&$('gw')){e.preventDefault();e.stopImmediatePropagation();var xx=document.querySelector('#drw [data-dclose]');if(xx)xx.click();return}
      var H=document.documentElement,ly=$('layer');if(!((ly&&ly.innerHTML.trim())||H.classList.contains('ppop')||$('gw')))return;
      e.preventDefault();e.stopImmediatePropagation();if(VEU)return;
      var n=(history.state&&history.state.__i)||0,v=VEU=document.createElement('div');
      v.style.cssText='position:fixed;inset:0;z-index:2147483000;background:var(--bg);opacity:0;pointer-events:auto';document.body.appendChild(v);
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
  function vistaConta(ref){if(/[?&]cliente=1/.test(location.search))return;var c={};try{c=JSON.parse(sessionStorage.getItem('lf_vc')||'{}')}catch(_){}c[ref]=(c[ref]||0)+1;try{sessionStorage.setItem('lf_vc',JSON.stringify(c));sessionStorage.setItem('lf_vc_n','1')}catch(_){}}
  function vistaEnvia(){var c,id;try{if(sessionStorage.getItem('lf_vc_n')!=='1')return;c=JSON.parse(sessionStorage.getItem('lf_vc')||'{}');id=sessionStorage.getItem('lf_vc_id');if(!id){id='v'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);sessionStorage.setItem('lf_vc_id',id)}sessionStorage.setItem('lf_vc_n','0')}catch(_){return}
    var ks=Object.keys(c).slice(0,60);if(!ks.length)return;var r={};ks.forEach(function(k){r[k]=Math.min(50,c[k]|0)});
    var body=JSON.stringify({fields:{ts:{integerValue:String(Date.now())},r:fsv(r)}});
    try{fetch('https://firestore.googleapis.com/v1/projects/'+FB.p+'/databases/(default)/documents/vistas/'+id+'?key='+FB.k,{method:'PATCH',headers:{'Content-Type':'application/json'},body:body,keepalive:true}).catch(function(){})}catch(_){}}
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')vistaEnvia()});
  addEventListener('pagehide',vistaEnvia);
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
    var it=function(q,cp){return '<button type="button" class="ri" data-open="'+q.ref+'"'+(cp?' tabindex="-1" aria-hidden="true"':'')+'><span class="rth">'+vis(q,6)+'</span><small>'+(q.ds!=null?'<i class="rds">'+esc(q.ds)+'</i>'+esc(q.ref):esc(q.nome))+'</small><b>'+fmt(q.n)+'</b></button>'};
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
    function step(t){
      if(!el.isConnected)return;
      var dt=last?Math.min(64,t-last):16;last=t;
      if(!touching&&Date.now()>hold&&!document.hidden){var half=el.scrollWidth/2;pos+=dt*0.024;if(half>0&&pos>=half)pos-=half;self=true;el.scrollLeft=pos}
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
    var p=find(ref),esg=p.aviso==='Esgotado',dots=!!(p.lib&&p.cores&&p.cores.length>1),sw=dots||(!p.foto&&p.cores&&p.cores.length>1);if(p.lib)st.cor[p.ref]=0;
    var q1=function(){return fmt(p.n)},offer=isOf(p),pct=offer?Math.round((1-p.n/p.de)*100):0;
    var buyH='<div class="buy" data-q="1">'+(esg?'':'<div class="tot"><span>Total</span><b data-ptot>'+q1()+'</b></div>')+'<div class="buyrow">'+(esg?'':'<div class="mq" role="group" aria-label="Quantidade"><button type="button" data-pq="-1" aria-label="Diminuir">−</button><b data-pqn>1</b><button type="button" data-pq="1" aria-label="Aumentar">+</button></div>')+'<button type="button" class="bb p" data-addm="'+p.ref+'"><i class="shn"></i><span>'+(esg?'Avise-me':document.documentElement.classList.contains('lojamodo')?LFI.tr('Quero este'):'Comprar')+(esg?'':'<small class="bt" data-ptot> · '+q1()+'</small>')+'</span><em>'+CARTI+'</em></button></div></div>',thumbs=dots?'<div class="dl cthl">'+LFI.tr('Cor')+' · <b class="cthn">'+esc(corNome(p,st.cor[p.ref]||0))+'</b></div><div class="cth cthm" role="group" aria-label="Cores">'+p.cores.map(function(c,i){return '<button type="button" class="'+(i?'':'on')+'" data-cth="'+i+'" aria-label="'+esc(corNome(p,i))+'"><span class="cim"></span><i style="background:'+c+'"></i></button>'}).join('')+'</div>':'';
    var one=!sw;
    if(one){var th1='<button type="button" class="on" aria-label="'+esc(corNome(p,0))+'"><span class="cim"'+(p.foto?' style="background-image:url(&quot;'+p.foto+'&quot;)"':'')+'>'+(p.foto?'':glasses(p.cores[0],p.raio,3))+'</span><i style="background:'+p.cores[0]+'"></i></button>';thumbs='<div class="cthl"><span>Cor</span> · <b>'+esc(corNome(p,0))+'</b></div><div class="cth cthm one" role="group" aria-label="Cores">'+th1+'</div>'}
    var thumbsD=thumbs.replace('cth cthm','cth cthd');
    var pubL={m:'Masculino',f:'Feminino',u:'Unissex'}[p.gen];
    prodNext=true;
    layer(pgBar(p)+'<div class="modal pgm" role="dialog" aria-modal="true" aria-label="'+esc(p.nome)+'"><div class="xw"><button class="x" data-close aria-label="Fechar">×</button></div><div class="pgl"><div class="big" data-zoom>'+(p.gv?'<button type="button" class="g360" data-g360="'+esc(p.ref)+'" aria-label="Ver a peça girando em 360°"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 4 0 1 1-4.5-3.5"/><path d="M17 5l-.5 3.5L20 9"/></svg><span>360°</span></button>':'')+/* S196: na foto só OFERTA e/ou ÚLTIMAS UNIDADES */(offer?'<div class="pgtags"><span class="ofpill">OFERTA</span></div>':'')+(esg&&p.esgRes?'<span class="stk e pgstk">Reservada agora</span>':'')+(!esg&&/Últim/.test(p.aviso||'')?'<span class="stk u pgstk">'+esc(p.aviso)+'</span>':'')+'<button type="button" class="fav dfav'+(st.fav[p.ref]?' on':'')+'" data-fav="'+p.ref+'" aria-label="Favoritar" aria-pressed="'+(!!st.fav[p.ref])+'">'+HEART+'</button>'+vis(p,4.5)+'<span class="zh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/></svg>Toque para ampliar</span><span class="shine" style="position:absolute;top:0;bottom:0;left:0;width:18%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.9),transparent);animation:shine 4.5s ease-in-out infinite"></span></div>'+thumbs+'</div>'+
    '<div class="det"><header class="dh"><div class="dm"><span class="ref">'+p.ref+'</span><i></i><span class="ref">'+esc(p.tag==='NOVO'?({solar:'SOLAR',grau:'LEITURA',armacao:'ARMAÇÃO'}[p.tipo]||''):p.tag)+(p.ds!=null&&p.mat&&lfnMat(p.mat).toUpperCase()!==String(p.tag).toUpperCase()?' · '+esc(lfnMat(p.mat).toUpperCase()):'')+'</span>'+edb(p)+'<span class="dmi">'+pgActs(p)+'</span></div><h2>'+esc(nomeSC(p))+'</h2><div class="dp'+(offer?' dof':'')+'">'+(offer?'<span class="pof"><s>'+fmt(p.de)+'</s><b>'+fmt(p.n)+'</b><em>−'+pct+'%</em></span>':'')+(offer?'':'<span class="pr">'+prx(p)+'</span>')+(!esg&&aceitaCup(p)?'<span class="acup">'+CUPI+LFI.tr('Aceita cupom')+'</span>':'')+(esg?'<span class="dav e">'+esc(p.aviso)+'</span>':'')+'</div>'+(offer?'<div class="pec">Você economiza '+fmt(p.de-p.n)+'</div>':'')+(txtAuto(p)?'<p class="dtx">'+esc(txtAuto(p))+'</p>':'')+'</header>'+
    '<div class="chips">'+(pubL?'<span class="bd">'+GENI[p.gen]+pubL+'</span>':'')+(p.mat?'<span class="bd">'+MATI+esc(p.mat)+'</span>':'')+(p.uv?'<span class="bd">'+UVI+'Proteção UV400</span>':'')+(isPol(p)?'<span class="bd">'+POLI+'Polarizado</span>':'')+'</div>'+
    (p.desc?'<div class="pdesc"><p>'+esc(p.desc)+'</p><button type="button" data-pdm>Ver mais</button></div>':'')+
    (esg?voltaSec(p):'')+
    cupPecaHtml(p)+
    (p.gr&&p.gr.length?grauSec(p):'')+
    (p.med&&p.med.length>2?'<section class="dsec"><span class="dsl">Medidas</span><div class="meds"><div class="med"><b>'+p.med[0]+'<i>mm</i></b><span>Lente</span></div><div class="med"><b>'+p.med[1]+'<i>mm</i></b><span>Ponte</span></div><div class="med"><b>'+p.med[2]+'<i>mm</i></b><span>Haste</span></div></div></section>':'')+
    (sw?'<section class="dsec'+(dots?' dcor':'')+'"><div class="dl"><span>Cor</span> · <b id="cn">'+esc(corNome(p,st.cor[p.ref]||0))+'</b></div><div class="sw" aria-label="Cores">'+p.cores.map(function(c,i){var xo=p.qs&&p.qs[i]===0;return dots?'<button type="button" class="dt'+(i?'':' on')+(xo?' x':'')+'" data-sw="'+i+'" data-ref="'+p.ref+'" aria-label="'+esc(corNome(p,i))+(xo?' (esgotada)':'')+'"><span style="background:'+c+'"></span></button>':'<button type="button" class="'+(i?'':'on')+'" data-sw="'+i+'" data-ref="'+p.ref+'" aria-label="Cor '+(i+1)+'">'+glasses(c,p.raio,6)+'</button>'}).join('')+'</div>'+(dots?thumbsD:'')+'</section>':(one?'<section class="dsec dcor dcor1"><div class="dl"><span>Cor</span> · <b>'+esc(corNome(p,0))+'</b></div>'+thumbsD.replace(/<div class="cthl">.*?<\/div>/,'')+'</section>':''))+
    buyH+
    '</div>'+relHtml(p)+'</div>','pg');pgInit(p,pop)}
  /* celular: a reserva abre igual ao menu (painel desliza, fundo escurece, itens entram em sequência), vindo da direita */
  function bagFx(){
    if(!matchMedia('(max-width:699px)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches||!Element.prototype.animate)return;
    var pn=document.querySelector('#layer .panel');if(!pn)return;
    var E='cubic-bezier(.2,.8,.2,1)',D=function(el,k,o){return el.animate(k,Object.assign({fill:'backwards'},o))};
    pn.style.animation='none';
    D(pn,[{transform:'translateX(102%)'},{transform:'none'}],{duration:280,easing:E});
    var sc=pn.parentNode;if(sc)D(sc,[{backgroundColor:'rgba(0,0,0,0)'},{backgroundColor:getComputedStyle(sc).backgroundColor}],{duration:250});
    Array.prototype.forEach.call(pn.children,function(c,k){if(k>0)D(c,[{translate:'18px 0',opacity:0},{translate:'0 0',opacity:1}],{duration:380,delay:80+k*45,easing:E})})}
  function bag(re,pop){
    var ks=Object.keys(st.cart),lg=logado(),nq=ks.reduce(function(a,k){return a+st.cart[k]},0);
    if(re){var sc=document.querySelector('#layer .scrim'),top=sc?sc.scrollTop:0}
    prodNext=true;
    var TR='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>';
    var items=ks.map(function(k){var p=find(k);return '<div class="ci"><div class="cimg">'+vis(p,7)+'</div><div class="cit"><small>'+p.ref+'</small><b>'+esc(p.nome)+'</b>'+(function(){if(!st.cup||descVale()!=='cup')return '<div class="pu"><span>'+fmtL(p,1)+'</span> <span>'+LFI.tr('por unidade')+'</span></div>';var x=cupPeca(p);if(x.d>0)return '<span class="cpl ok">−'+x.pct+'% '+LFI.tr('cupom')+'</span><div class="pu"><s>'+LFI.fmtD(LFI.pv(p.n))+'</s> <span>'+LFI.fmtD(LFI.pv(p.n-x.d))+'</span> <span>'+LFI.tr('por unidade')+'</span></div>';return '<span class="cpl no">'+LFI.tr(x.of?'preço de oferta · sem cupom':'sem cupom')+'</span><div class="pu"><span>'+fmtL(p,1)+'</span> <span>'+LFI.tr('por unidade')+'</span></div>'})()+'</div><div class="cif"><div class="cia"><div class="qty"><button data-dec="'+k+'" aria-label="Menos"'+(st.cart[k]<=1?' disabled aria-disabled="true"':'')+'>−</button><span>'+st.cart[k]+'</span><button data-inc="'+k+'" aria-label="Mais">+</button></div><button type="button" class="crl" data-rm="'+k+'">'+LFI.tr('Remover')+'</button></div><div class="cis"><small>'+LFI.tr('Subtotal')+'</small><div class="pr">'+(st.cup&&descVale()==='cup'&&cupPeca(p).d>0?LFI.fmtD(LFI.pv(p.n-cupPeca(p).d)*st.cart[k]):fmtL(p,st.cart[k]))+'</div></div></div><button class="crm" data-rm="'+k+'" aria-label="Remover"><span class="crx">×</span></button></div>'}).join('');
    var es=window.LFI&&LFI.lang==='es',cnt=nq+(es?(nq===1?' artículo':' artículos'):(nq===1?' item':' itens'));
    var ste=ks.length>0&&lg?(st.step==='ent'||st.step==='pag'?st.step:''):'',dd=!!ste,cnow=dd?contaNorm(getConta()):null,entD=st.ent==='delivery';
    var sum='<div class="cs"><h3 class="cs-h">'+LFI.tr(dd?'Seu pedido':'Resumo')+'</h3>'+
      '<div class="cs-r cs-h"><span>'+LFI.tr('Subtotal')+' · '+cnt+'</span><span>'+LFI.fmtD(brutoD())+'</span></div>'+cupHtml(dd)+(function(){var l=l2Info();if(descVale()==='cup')return '';return l.d>0?'<div class="cs-r cs-l2"><span>'+LFI.tr('Leve 2 · 30% na 2ª peça')+'</span><span>−'+LFI.fmtD(l.dD)+'</span></div>':l.n===1?'<div class="cs-l2n">'+LFI.tr('Leve 2: leve mais um óculos de leitura ou de sol e a 2ª peça sai com 30% de desconto.')+'</div>':''})()+'<div class="cs-r cs-h"><span>'+LFI.tr('Entrega')+'</span><span>'+(dd&&entD?(st.tr&&trOk(st.tr)?esc(trNome(st.tr))+' · '+(freteG()?LFI.fmtD(LFI.pv(freteG())):LFI.tr('frete na entrega')):LFI.tr('Delivery · frete na entrega')):LFI.tr('Retirada na loja · grátis'))+'</span></div>'+
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
    fetch(fnUrl('mensagem'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({acao:'enviar',tipo:'contato',nome:nome,email:v('cte'),tel:v('ctt'),msg:v('ctm'),site:v('ctsite'),lang:LFI.lang}),signal:ct?ct.signal:undefined})
      .then(function(r){clearTimeout(tm);return r.json().catch(function(){return {ok:false}})}).then(function(j){if(!j||!j.ok)throw new Error(j&&j.motivo||'erro');
        AJ.pg='';try{closePanels()}catch(_){}try{window.scrollTo({top:0,behavior:'smooth'})}catch(_){}setTimeout(function(){toast(LFI.tr('Mensagem enviada. Respondemos por e-mail em breve.'))},250)})
      .catch(function(x){clearTimeout(tm);bt.disabled=false;bt.textContent=LFI.tr('Enviar');fal(String(x&&x.message)==='muitas'?'Muitas mensagens em pouco tempo. Tente mais tarde.':'Não deu para enviar agora. Tente de novo ou fale com a loja pelo WhatsApp.')})},true);

  /* B3 (11/11, S156): catálogo sem bolinhas — linha de gênero só em texto + "Filtros ›" na mesma linha (abre a caixa de filtros de sempre) */
  function genRow(){var ms=document.querySelector('#vscr .mobsearch');if(!ms)return;var o=$('lfgen');
    if(!o){o=document.createElement('div');o.id='lfgen';o.className='lfgen';o.setAttribute('role','group');o.setAttribute('aria-label',LFI.tr('Gênero'));ms.insertAdjacentElement('afterend',o)}
    o.innerHTML=[['','Todos'],['f','Feminino'],['m','Masculino'],['u','Unissex']].map(function(g){return '<button type="button" data-gen="'+g[0]+'" aria-pressed="'+(st.gen===g[0])+'" class="'+(st.gen===g[0]?'on':'')+'">'+LFI.tr(g[1])+'</button>'}).join('')+'<a href="#" class="lfgf" data-lffil>'+LFI.tr('Filtros')+' <i>›</i></a>'}
  var _dg3=drawGrid;drawGrid=function(){var r=_dg3.apply(this,arguments);try{genRow()}catch(_){}return r};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-lffil]');if(!t)return;e.preventDefault();e.stopPropagation();var f=$('fbtn');if(f)f.click()},true);

  /* B2 (11/11): Favoritos dentro do carrinho — abas "Carrinho n | Favoritos n" no passo 1; trilha da peça clicável */
  st.cartTab='cart';
  function favRows(){var ks=Object.keys(st.fav).filter(function(k){return find(k)});if(!ks.length)return '<div class="note" style="margin-top:6px">'+LFI.tr('Você ainda não salvou nenhum favorito. Toque no coração da foto para guardar.')+'</div>';
    return ks.map(function(k){var p=find(k),esg=p.aviso==='Esgotado';return '<div class="ci fvi"><button type="button" class="cimg" data-open="'+k+'" aria-label="'+esc(p.nome)+'">'+vis(p,7)+'</button><div class="cit"><small>'+p.ref+'</small><b>'+esc(p.nome)+'</b><div class="pu"><span>'+fmtL(p,1)+'</span></div></div>'+
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
    var t='Olá! Quero reservar na La Fouch:\n'+Object.keys(st.cart).map(function(k){var p=find(k);return '• '+st.cart[k]+'× '+p.ref+' · '+p.nome+(p.cores&&p.cores.length>1?' · Cor: '+corNome(p,st.cor[k]||0):'')+(p.gr&&p.gr.length?' · Grau: '+p.gr[st.gr[k]||0]:'')+' · '+fmtL(p,st.cart[k])}).join('\n')+(descVale()==='l2'?'\n'+LFI.tr('Leve 2 · 30% na 2ª peça')+': −'+LFI.fmtD(l2Info().dD):descVale()==='cup'?'\n'+LFI.tr('Código')+' '+st.cup.cod+': −'+LFI.fmtD(cupInfo().dD):'')+'\nTotal: '+LFI.fmtD(totalD())+(LFI.cur==='BRL'?' (≈ '+LFI.fmtG(total())+')':'')+'\nVou provar e retirar na loja.';
    if(st.rosto){var ff=FACES.filter(function(x){return x.id===st.rosto})[0];if(ff)t+='\nFormato do meu rosto: '+ff.nome}if(st.nome)t+='\nNome: '+st.nome;if(st.zap)t+='\nWhatsApp: '+st.zap;return t}
  /* pedido do site: grava na nuvem (o app da loja recebe sozinho) e mostra a tela de pedido recebido */
  var PK_SVG='<svg width="104" height="104" viewBox="0 0 24 24" fill="none" stroke="#3ddc8c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M4.5 12.8l4.8 4.9L19.5 7"/></svg>';
  var PK_WA='<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2z"/></svg>';
  function fsv(v){if(v===null||v===undefined)return {nullValue:null};if(typeof v==='number')return Math.floor(v)===v?{integerValue:String(v)}:{doubleValue:v};if(typeof v==='boolean')return {booleanValue:v};if(Array.isArray(v))return {arrayValue:{values:v.map(fsv)}};if(typeof v==='object'){var f={};for(var k in v)f[k]=fsv(v[k]);return {mapValue:{fields:f}}}return {stringValue:String(v)}}
  /* reserva de 10 min: o servidor decide a hora e quantas peças sobram; se a função estiver desligada ou fora do ar, o pedido segue como antes */
  var RES_URL='https://southamerica-east1-lafouch-2f6bd.cloudfunctions.net/reserva';
  function resCall(acao,pedido,itens,refs,extra){
    var ct=window.AbortController?new AbortController():null,tm=setTimeout(function(){ct&&ct.abort()},8000),b={acao:acao,pedido:pedido};if(itens)b.itens=itens;if(refs)b.refs=refs;if(extra)for(var xk in extra)b[xk]=extra[xk];
    return acFetch(RES_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b),signal:ct?ct.signal:undefined}).then(function(r){clearTimeout(tm);if(r.status>=500||r.status===404)return null;return r.json().catch(function(){return null})},function(){clearTimeout(tm);return null})}
  function resItens(its){return (its||[]).map(function(i){return {ref:i.ref,cor:i.cor||'',q:i.q}})}
  function resLeft(e){if(!e||!e.rx)return 0;return Math.max(0,e.rx-(Date.now()+(e.rd||0)))}
  function pkEnviar(doc,id){
    /* 13/11: corta os textos no limite das regras do Firestore (endereço longo não pode derrubar o pedido) */
    var LIM={nome:79,tel:29,email:199,doc:29,obsC:199,endE:299,refE:199,depE:79,cidade:79};Object.keys(LIM).forEach(function(k){if(typeof doc[k]==='string'&&doc[k].length>LIM[k])doc[k]=doc[k].slice(0,LIM[k])});
    var f={};for(var k in doc)f[k]=fsv(doc[k]);
    var ct=window.AbortController?new AbortController():null,tm=setTimeout(function(){ct&&ct.abort()},8000);
    return acFetch('https://firestore.googleapis.com/v1/projects/'+FB.p+'/databases/(default)/documents/pedidos?documentId='+encodeURIComponent(id)+'&key='+FB.k,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f}),signal:ct?ct.signal:undefined}).then(function(r){clearTimeout(tm);if(!r.ok)throw new Error('http '+r.status);return true},function(e){clearTimeout(tm);throw e})}
  /* B1 (11/11): se a rede falhar ou demorar, tenta de novo sozinho uma vez; guarda o motivo para mostrar o código discreto */
  function pkEnviar2(doc,id){return pkEnviar(doc,id).catch(function(e){var m=String(e&&e.message||e||''),http=/^http (\d+)/.exec(m);if(http&&+http[1]<500){throw e}
      return new Promise(function(r){setTimeout(r,1200)}).then(function(){return pkEnviar(doc,id)})})}
  function pkCodErro(er){var m=String(er&&(er.name==='AbortError'?'tempo':er.message)||er||'?'),h=/^http (\d+)/.exec(m);m=h?h[1]:(/fetch|network|Load failed/i.test(m)?'rede':m.slice(0,24));
    var d=new Date(),z=function(n){return ('0'+n).slice(-2)};return m+' · '+z(d.getDate())+'/'+z(d.getMonth()+1)+' '+z(d.getHours())+':'+z(d.getMinutes())}
  function pkTela(h){var o=$('pkok');if(!o){o=document.createElement('div');o.id='pkok';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');document.body.appendChild(o);document.documentElement.classList.add('lock')}o.innerHTML=h;return o}
  /* WhatsApp: só aceita celular no formato de Brasil, Paraguai ou Argentina */
  var FONE_EX={py:'0981 123 456',br:'(11) 91234-5678',ar:'9 11 1234-5678'},FONE_MSG={py:'Número do Paraguai inválido. Use o celular, ex.: 0981 123 456.',br:'Número do Brasil inválido. Use DDD + 9 + 8 dígitos, ex.: (11) 91234-5678.',ar:'Número da Argentina inválido. Use o celular com DDD, ex.: 9 11 1234-5678.'};
  function paisSel(){if(st.pais)return st.pais;return (window.LFI&&LFI.lang==='es')?'py':'br'}

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
  function foneErro(msg){var e=$('fze'),z=$('fz');if(e){e.textContent=msg||'';e.hidden=!msg}if(z)z.classList.toggle('bad',!!msg);if(msg){try{z.focus()}catch(_){}toast(msg)}}
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
  function docNorm(nac,txt){if(!NAC[nac]){var x=String(txt||'').toUpperCase().replace(/[^A-Z0-9]/g,'');return x.length>=4&&x.length<=20?x:''}var d=String(txt||'').replace(/[^\d-]/g,'');
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
  function maskDoc(nac,txt){if(!NAC[nac])return String(txt||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,20);var d=digs(txt);
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
  function contaForm(volta){
    var c=getConta()||{},nac=c.nac||(paisSel()==='br'?'br':paisSel()==='ar'?'ar':'py'),pais=c.pais||nac;
    var nacI=nacItems(),telI=telItems();if(!telI.some(function(x){return x.v===pais}))telI.push({v:pais,s:'+'+(FN&&FN[pais]?FN[pais].c:''),l:paisNome(pais),q:paisNome(pais)});
    if(!FN)fnLoad().then(function(){if($('cfp')){cddTel('cfp');var z=$('cfz');if(z){z.placeholder=fnEx($('cfp').value);if(z.value)fnVivo(z,'cfp','cfzh')}}},function(){});
    var se0=sessG()||{},gg=!c.nome&&se0.via==='google';
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Sua conta"><div style="display:flex;align-items:center;justify-content:space-between"><h2 style="font-size:28px">'+(c.nome||gg?'Seus dados':'Criar conta')+'</h2><button class="x" data-close aria-label="Fechar" style="align-self:auto">×</button></div>'+
      (gg?'<div class="gban">'+G_BADGE+'<span>Conectada com o Google · <b>'+esc(se0.email)+'</b></span></div>':c.nome?'':'<div class="passos"><i class="on"></i><i class="on"></i></div><div class="note" style="margin:0">Passo 2 de 2 · cadastro</div>')+'<div class="note">Seus dados ficam salvos na sua conta e vão para a loja só quando você faz um pedido.</div>'+
      '<label class="cfl" for="cfn">Nome completo</label><input class="field" id="cfn" autocomplete="name" value="'+esc(c.nome||(gg?se0.gn:'')||'')+'">'+
      '<label class="cfl" for="cfa2">'+LFI.tr('Nacionalidade')+'</label>'+cdd('cfa2','Nacionalidade',nac,nacI,'Buscar nacionalidade')+
      '<label class="cfl" for="cfd" id="cfdl">'+nacInfo(nac).d+'</label><input class="field" id="cfd" inputmode="'+(NAC[nac]?'numeric':'text')+'" autocomplete="off" placeholder="'+nacInfo(nac).ph+'" value="'+esc(maskDoc(nac,c.doc))+'">'+
      '<label class="cfl" for="cfb">Nascimento</label><input class="field" id="cfb" inputmode="numeric" placeholder="dd/mm/aaaa" autocomplete="bday" maxlength="10" value="'+esc(maskNasc(c.nasc))+'">'+
      '<label class="cfl" for="cfz">WhatsApp</label><div class="fzr">'+cdd('cfp','País do WhatsApp',pais,telI,'Buscar país ou código')+'<input class="field" id="cfz" inputmode="tel" autocomplete="tel-national" placeholder="'+esc(fnEx(pais))+'" value="'+esc(c.telTxt||'')+'"></div><div class="cfh" id="cfzh" hidden></div>'+
      '<label class="cfl" for="cfc">Cidade</label><input class="field" id="cfc" autocomplete="address-level2" value="'+esc(c.cidade||'')+'"'+(c.cidade?' data-ok="'+esc(c.cidade)+'" data-cpais="'+esc(c.cpais||'')+'"':'')+'><div class="cfh" id="cfch" hidden></div>'+
      '<div id="cfpy"'+(entPY({cpais:c.cidade?c.cpais:'',nac:nac})?'':' hidden')+'><label class="cfl" for="cfa">Endereço <span style="font-weight:400">(opcional)</span></label><input class="field" id="cfa" autocomplete="street-address" value="'+esc(c.end||'')+'">'+
      '<label class="cfl" for="cfob">Observação <span style="font-weight:400">(opcional)</span></label><input class="field" id="cfob" maxlength="120" placeholder="Ex.: portão azul, tocar a campainha" value="'+esc(c.obs||'')+'"></div>'+
      '<div class="fze" id="cferr" role="alert" hidden></div>'+
      '<button class="btn w" data-cta="salvar" data-volta="'+(volta?1:0)+'" style="margin-top:6px">Salvar conta</button>'+
      '<button type="button" class="cfx cn" data-cta="sair">Sair da conta</button>'+'</aside>')}
  function cfErro(m,id){var e=$('cferr');if(e){e.textContent=m;e.hidden=!m}if(id){var f=$(id);if(f){f.classList.add('bad');try{f.focus()}catch(_){}}}if(m)toast(m)}
  function contaSalvar(volta){
    var g=function(i){var e=$(i);return e?e.value.trim():''};
    document.querySelectorAll('#layer .field.bad').forEach(function(e){e.classList.remove('bad')});
    var nome=g('cfn').replace(/\s+/g,' ');if(nome.length<3||nome.indexOf(' ')<0)return cfErro('Digite seu nome e sobrenome.','cfn');
    var nac=$('cfa2').value,doc=docNorm(nac,g('cfd'));if(!doc)return cfErro(nacInfo(nac).d+(NAC[nac]?' inválido. Confira os números.':': digite o número (letras e números, mínimo 4).'),'cfd');
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
    var nc={nome:nome,nac:nac,doc:doc,nasc:nasc,pais:pais,tel:tel,telTxt:g('cfz'),email:email,cidade:cid,cpais:cc,end:pyv?g('cfa'):'',obs:pyv?g('cfob'):'',user:se.user||old.user||'',ts:old.ts||Date.now()};
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
  function acLoad(){return new Promise(function(ok,no){if(window.grecaptcha&&grecaptcha.enterprise&&grecaptcha.enterprise.execute)return ok();var s=document.createElement('script');s.src='https://www.google.com/recaptcha/enterprise.js?render='+AC.site;s.async=true;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
  function acTok(){if(!AC.app)return Promise.resolve(null);if(AC.t&&Date.now()<AC.x)return Promise.resolve(AC.t);if(AC.p)return AC.p;if(Date.now()<AC.f)return Promise.resolve(null);
    AC.p=acLoad().then(function(){return new Promise(function(ok){grecaptcha.enterprise.ready(ok)})}).then(function(){return grecaptcha.enterprise.execute(AC.site,{action:'lf'})}).then(function(tk){return fetch('https://firebaseappcheck.googleapis.com/v1/projects/'+FB.p+'/apps/'+AC.app+':exchangeRecaptchaEnterpriseToken?key='+FB.k,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recaptcha_enterprise_token:tk})})}).then(function(r){if(!r.ok)return r.text().then(function(t){try{console.warn('AppCheck',r.status,t.slice(0,300))}catch(_){}throw 0});return r.json()}).then(function(j){AC.t=j.token;AC.x=Date.now()+Math.max(300,parseInt(j.ttl)||3600)*1000-120000;AC.p=null;return AC.t}).catch(function(e){if(e)try{console.warn('AppCheck',e)}catch(_){}AC.p=null;AC.f=Date.now()+60000;return null});
    return AC.p}
  function acFetch(url,o){o=o||{};return Promise.race([acTok(),new Promise(function(r){setTimeout(function(){r(null)},4000)})]).then(function(t){if(t)o.headers=Object.assign({},o.headers,{'X-Firebase-AppCheck':t});return fetch(url,o)})}
  function fsBase(){return 'https://firestore.googleapis.com/v1/projects/'+FB.p+'/databases/(default)/documents/'}
  function authPost(ep,body){return acFetch('https://identitytoolkit.googleapis.com/v1/accounts:'+ep+'?key='+FB.k,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(String((j.error&&j.error.message)||'ERRO').split(' ')[0]);return j})})}
  var AUTH_MSG={EMAIL_EXISTS:'Este e-mail já tem conta. Use Iniciar sessão.',USER_TAKEN:'Esse usuário já existe. Escolha outro.',INVALID_LOGIN_CREDENTIALS:'Usuário/e-mail ou senha incorretos.',INVALID_PASSWORD:'Usuário/e-mail ou senha incorretos.',EMAIL_NOT_FOUND:'Não encontramos esse e-mail.',USER_NOT_FOUND:'Não encontramos esse usuário ou e-mail.',WEAK_PASSWORD:'Senha fraca. Use 6 ou mais caracteres.',INVALID_EMAIL:'E-mail inválido.',TOO_MANY_ATTEMPTS_TRY_LATER:'Muitas tentativas. Espere um pouco e tente de novo.',FEDERATED_USER_ID_ALREADY_USED:'Esse Google já está ligado a outra conta.',CREDENTIAL_ALREADY_IN_USE:'Esse Google já está ligado a outra conta.',OPERATION_NOT_ALLOWED:'O login ainda não está ativo na loja. Fale com a loja pelo WhatsApp.'};
  function authErr(e,id){cfErro(AUTH_MSG[String(e&&e.message||'')]||'Não deu para conectar. Confira a internet e tente de novo.',id);authBusy(false)}
  function authBusy(on){var b=document.querySelector('#layer [data-busy]');if(!b)return;if(on){b.setAttribute('data-t',b.textContent);b.textContent='Aguarde…';b.disabled=true}else{b.textContent=b.getAttribute('data-t')||b.textContent;b.disabled=false}}
  function sessSave(j,user,x){var o={uid:j.localId,email:j.email,idToken:j.idToken,refresh:j.refreshToken,exp:Date.now()+(+j.expiresIn||3600)*1000-60000,user:user||''};if(x)for(var k in x)o[k]=x[k];lsS('lf_auth',o);return o}
  function idTok(){var s=sessG();if(!s)return Promise.reject(new Error('SEM_SESSAO'));if(Date.now()<s.exp)return Promise.resolve(s.idToken);
    return fetch('https://securetoken.googleapis.com/v1/token?key='+FB.k,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=refresh_token&refresh_token='+encodeURIComponent(s.refresh)}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error('SESSAO');s.idToken=j.id_token;s.refresh=j.refresh_token||s.refresh;s.exp=Date.now()+(+j.expires_in||3600)*1000-60000;lsS('lf_auth',s);return s.idToken})})}
  function fsA(method,path,fields){return idTok().then(function(t){var f={};for(var k in fields)f[k]=fsv(fields[k]);return acFetch(fsBase()+path,{method:method,headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:fields?JSON.stringify({fields:f}):undefined}).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json()})})}
  /* usuário ou e-mail → e-mail */
  function achaEmail(id){return id.indexOf('@')>0?Promise.resolve({email:id,user:''}):fbg('usuarios/'+encodeURIComponent(id)).then(function(d){var e=fbd(d).email;if(!e)throw new Error('USER_NOT_FOUND');return {email:e,user:id}},function(){throw new Error('USER_NOT_FOUND')})}
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
  function cadastrarTela(){gPre();
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Criar conta">'+authHead('Criar conta')+
      '<div class="passos"><i class="on"></i><i></i></div><div class="note" style="margin:0">Passo 1 de 2 · acesso</div>'+
      '<label class="cfl" for="auu">Usuário</label><input class="field" id="auu" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="ex.: maria.souza">'+
      '<label class="cfl" for="aue">E-mail</label><input class="field" id="aue" type="email" autocomplete="email" autocapitalize="none">'+
      pwField('aup','Senha (mínimo 6 caracteres)')+pwField('aup2','Repetir a senha')+
      '<div class="fze" id="cferr" role="alert" hidden></div>'+
      '<button class="btn w" data-cta="criar" data-busy>Continuar</button>'+'<p class="tm">Ao criar sua conta, você aceita os <a href="/termos.html" target="_blank" rel="noopener">Termos e Condições</a> <span>e a</span> <a href="/privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>.</p>'+gBtn('Criar conta com Google')+
      '<button type="button" class="cfx" data-cta="entrar" style="text-align:center;width:100%">Já tenho conta · <u>Iniciar sessão</u></button></aside>')}
  function esqueciTela(){
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Recuperar senha">'+authHead('Recuperar senha')+
      '<div class="note" style="margin:0">Digite seu usuário ou e-mail. Enviamos um link para criar uma nova senha.</div>'+
      '<label class="cfl" for="aul">Usuário ou e-mail</label><input class="field" id="aul" autocomplete="username" autocapitalize="none" spellcheck="false">'+
      '<div class="fze" id="cferr" role="alert" hidden></div><div class="note" id="aures" style="display:none;color:#7fe0a8"></div>'+
      '<button class="btn w" data-cta="reset" data-busy>Enviar link</button>'+
      '<button type="button" class="cfx" data-cta="entrar" style="text-align:center;width:100%">Voltar</button></aside>')}
  function authEntrar(){
    var id=($('aul')||{value:''}).value.trim().toLowerCase(),pw=($('aup')||{value:''}).value;
    if(!id)return cfErro('Digite seu usuário ou e-mail.','aul');if(!pw)return cfErro('Digite sua senha.','aup');cfErro('');try{var rm=$('aur')?$('aur').checked:true;if(rm){localStorage.removeItem('lf_norem');localStorage.setItem('lf_lastu',id)}else{localStorage.setItem('lf_norem','1');localStorage.removeItem('lf_lastu')}}catch(_){}authBusy(true);
    achaEmail(id).then(function(r){return authPost('signInWithPassword',{email:r.email,password:pw,returnSecureToken:true}).then(function(j){return sessSave(j,r.user)})})
      .then(function(s){return fsA('GET','clientes/'+s.uid).then(function(d){var o=fbd(d);lsS('lf_conta',o);return o},function(){return null})})
      .then(function(c){contaBtn();if(c){toast('Olá, '+String(c.nome).split(' ')[0]+'!');if(AUTH_VOLTA)bag();else closeLayer()}else contaForm(AUTH_VOLTA)},function(e){authErr(e,'aul')})}
  function authCriar(){
    var g=function(i){return ($(i)||{value:''}).value.trim()},u=g('auu').toLowerCase(),em=g('aue').toLowerCase(),pw=($('aup')||{value:''}).value,p2=($('aup2')||{value:''}).value;
    if(!/^[a-z0-9._]{3,20}$/.test(u))return cfErro('Usuário: 3 a 20 letras minúsculas, números, ponto ou _.','auu');
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))return cfErro('E-mail inválido.','aue');
    if(pw.length<6)return cfErro('A senha precisa ter 6 ou mais caracteres.','aup');if(pw!==p2)return cfErro('As senhas não são iguais.','aup2');cfErro('');authBusy(true);
    fbg('usuarios/'+encodeURIComponent(u)).then(function(){throw new Error('USER_TAKEN')},function(){return authPost('signUp',{email:em,password:pw,returnSecureToken:true})})
      .then(function(j){var s=sessSave(j,u);return fsA('POST','usuarios?documentId='+encodeURIComponent(u),{uid:s.uid,email:s.email})})
      .then(function(){lsS('lf_conta',null);contaBtn();contaForm(AUTH_VOLTA)},function(e){authErr(e,'auu')})}
  function authReset(){
    var id=($('aul')||{value:''}).value.trim().toLowerCase();if(!id)return cfErro('Digite seu usuário ou e-mail.','aul');cfErro('');authBusy(true);
    achaEmail(id).then(function(r){return authPost('sendOobCode',{requestType:'PASSWORD_RESET',email:r.email}).then(function(){return r.email})})
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
  function gEntrar(){
    gPopup().then(function(r){var u=r.user;return u.getIdToken().then(function(t){var s=sessSave({localId:u.uid,email:u.email,idToken:t,refreshToken:u.refreshToken,expiresIn:3600},'',{via:'google',gn:u.displayName||''});try{gAuth().signOut()}catch(_){}return s})})
      .then(function(s){return fsA('GET','clientes/'+s.uid).then(function(d){var o=fbd(d);lsS('lf_conta',o);return o},function(){return null})})
      .then(function(c){contaBtn();if(c&&c.nome){toast('Olá, '+String(c.nome).split(' ')[0]+'!');if(AUTH_VOLTA)bag();else closeLayer()}else{lsS('lf_conta',null);contaForm(AUTH_VOLTA)}},gErr)}
  function gSync(){var s=sessG();
    gPopup().then(function(r){var u=r.user,cr=r.credential;
      if(u.uid===s.uid)return;
      return u.delete().catch(function(){}).then(function(){return idTok()}).then(function(t){return authPost('signInWithIdp',{idToken:t,postBody:'id_token='+encodeURIComponent(cr.idToken)+'&providerId=google.com',requestUri:location.origin,returnIdpCredential:true,returnSecureToken:true})})})
      .then(function(){toast('Conta sincronizada com o Google.');minhaConta()},gErr)}
  function dlgAbre(h){dlgFecha();var d=document.createElement('div');d.className='dlgb';d.id='dlgb';d.innerHTML='<div class="dlg" role="dialog" aria-modal="true">'+h+'</div>';d.addEventListener('click',function(ev){if(ev.target===d||ev.target.closest('[data-dlgx]'))dlgFecha()});document.body.appendChild(d);var i=d.querySelector('input');if(i)setTimeout(function(){try{i.focus({preventScroll:true})}catch(_){}},60);return d}
  document.addEventListener('click',function(e){var o=$('pkok');if(o&&e.target.closest&&e.target.closest('.top')){pkStop();o.remove();document.documentElement.classList.remove('lock')}},true);
  function pkCancela(){
    var id=window.__pgid,e=id&&pedGet(id),b=document.querySelector('#dlgb .dk');if(!e||(e.est!=='pagar'&&e.est!=='recusado')){dlgFecha();return}
    if(b)b.disabled=true;
    pkEnviar({tipo:'cancel',ref:id,ts:Date.now(),cod:e.cod||''},id+'x').then(function(){
      if(CFG.reserva===true)resCall('cancelar',id,null,(e.itens||[]).map(function(i){return i.ref}));
      pkCancelado(id)
    },function(){var d=$('dlgb');if(!d)return;var m=LFI.lang==='es'?'¡Hola! Quiero cancelar mi pedido '+e.cod+'.':'Olá! Quero cancelar o meu pedido '+e.cod+'.';
      d.querySelector('.dlg').innerHTML='<h3>Cancelar este pedido?</h3><p>Não deu para avisar a loja automaticamente. Cancele pelo WhatsApp: a loja recebe o aviso e libera as peças.</p><div class="dlga"><button type="button" class="dc" data-dlgx>Voltar</button><a class="dk dr" target="_blank" rel="noopener" data-cta="pkcanc3" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(m)+'">Cancelar pelo WhatsApp</a></div>'})}
  function pkCancelado(id){pedSet(id,{est:'cancelado'});pkStop();dlgFecha();var po=$('pkok');if(po)po.remove();document.documentElement.classList.remove('lock');closeLayer();toast('Pedido cancelado.');if(logado())minhaConta()}
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
      var tarefas=pend.map(function(e){return fsA('PATCH','pedidos/'+e.id+'?updateMask.fieldPaths=est',{est:'cancelado'}).catch(function(){})});
      tarefas.push(fsA('DELETE','clientes/'+s.uid).catch(function(){}));
      return Promise.all(tarefas)}).then(function(){dlgFecha();authSair();closeLayer();toast('Conta excluída.')},function(e){if(b)b.disabled=!excOk();dlgErr(acErr(e))})}
  function gCard(){var el=$('gcard');if(!el)return;
    idTok().then(function(t){return authPost('lookup',{idToken:t})}).then(function(j){var u=(j.users||[])[0]||{},pv=u.providerUserInfo||[],g=pv.filter(function(x){return x.providerId==='google.com'})[0],pw=pv.some(function(x){return x.providerId==='password'});
      var el2=$('gcard');if(!el2)return;
      el2.classList.toggle('gnv',!!g);el2.innerHTML=g?G_BADGE+'<b>'+LFI.tr('Conta do Google')+'</b><small class="gok">✓ '+esc(g.email||u.email||'')+'</small><button type="button" class="gunv" data-cta="gunlink" data-pw="'+(pw?1:0)+'">'+LFI.tr('Desvincular Google')+'</button>'
        :'<div class="gl">'+G_BADGE+'<span><b>'+LFI.tr('Conta do Google')+'</b><small>'+LFI.tr('Não sincronizada')+'</small></span></div><button type="button" class="gsb" data-cta="gsync">'+LFI.tr('Sincronizar')+'</button>'},
      function(){var el2=$('gcard');if(el2)el2.innerHTML='<div class="gl">'+G_BADGE+'<span><b>'+LFI.tr('Conta do Google')+'</b><small>'+LFI.tr('Não deu para verificar agora.')+'</small></span></div>'})}
  function estLabel(e){return {pagar:'Aguardando pagamento',comp:'Comprovante em análise',pago:'Pago · reservado',recusado:'Comprovante recusado',cancelado:'Pedido cancelado'}[e.est]||'Pedido enviado'}
  function minhaConta(){
    var c=getConta();if(!sessG()){entrarTela(false);return}if(!c){contaForm(false);return}
    var L=lsG('lf_ped',[]).slice().reverse(),ln=function(k,v){return v?'<div class="pfl"><small>'+k+'</small><span>'+esc(v)+'</span></div>':''};
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Minha conta"><div style="display:flex;align-items:center;justify-content:space-between"><h2 style="font-size:28px">Minha conta</h2><button class="x" data-close aria-label="Fechar" style="align-self:auto">×</button></div>'+
      '<div class="cfc"><div class="pfh"><span class="pfa">'+esc(c.nome.charAt(0).toUpperCase())+'</span><span><b>'+esc(c.nome)+'</b>'+(c.user?'<small>@'+esc(c.user)+'</small>':'')+'</span></div>'+
      ln('E-mail',c.email)+ln(nacInfo(c.nac).d,c.doc)+ln('Nascimento',c.nasc)+ln('WhatsApp',c.tel)+ln('Cidade',c.cidade)+ln('Endereço',c.end)+
      '<button type="button" class="cfx" data-cta="conta" style="margin-top:8px">Editar dados</button></div>'+
      '<div class="cfc gcd" id="gcard"><div class="gl">'+G_BADGE+'<span><b>Conta do Google</b><small>Verificando…</small></span></div></div>'+
      '<div class="note"><b style="color:var(--tx)">Minhas reservas</b></div>'+
      (L.length?L.map(function(e){return '<button type="button" class="cfp" data-cta="ped" data-id="'+esc(e.id)+'"><span><b>Pedido '+esc(e.cod)+(e.teste?' · teste':'')+'</b><small>'+new Date(e.ts).toLocaleDateString('pt-BR')+' · '+(e.ent==='delivery'?'Delivery':'Retirada na loja')+(e.est==='pago'?' · Código '+esc(e.tok||('LF-'+e.cod)):'')+'</small></span><em class="'+(e.est==='pago'?'ok':'')+'">'+estLabel(e)+'</em></button>'}).join(''):'<div class="note">Você ainda não fez nenhuma reserva.</div>')+
      '<div class="sesv"><button type="button" class="bsair" data-cta="sair"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>'+LFI.tr('Sair da conta')+'</button><div class="zc"><p>'+LFI.tr('Quer apagar sua conta? Seus dados e endereços são apagados. Não dá para desfazer.')+'</p><button type="button" class="bexc" data-cta="exc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>'+LFI.tr('Excluir minha conta')+'</button></div></div></aside>');gCard()}
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
  function endsSalvos(c){var o=[],add=function(x){x=String(x||'').trim();if(x.length>=6&&o.indexOf(x)<0)o.push(x)};add(c&&c.end);lsG('lf_ends',[]).forEach(add);return o.slice(0,4)}
  function endBloco(c){var sv=endsSalvos(c),man=st.endMode==='manual'||!sv.length,i=Math.min(st.endIdx|0,Math.max(sv.length-1,0));
    if(!man)return '<label class="cfl">Endereço de entrega</label>'+sv.map(function(a,k){return '<button type="button" class="cfo'+(k===i?' on':'')+'" data-cta="endsel" data-i="'+k+'" aria-pressed="'+(k===i)+'">'+cki('pin')+'<b>'+esc(a)+'</b><small>Endereço salvo</small></button>'}).join('')+'<button type="button" class="cfx" data-cta="endman">+ Adicionar endereço manualmente</button>';
    return '<label class="cfl" for="fa2">Endereço de entrega</label><input class="field" id="fa2" autocomplete="street-address" placeholder="Rua, número, bairro, cidade" value="'+esc(st.endE||'')+'">'+(sv.length?'<button type="button" class="cfx" data-cta="endsav">Usar um endereço salvo</button>':'')}
  var EMAIL_ENVIA=false; /* ligar (true) quando o envio de e-mail do pedido estiver funcionando */
  function gdGet(){if(!st.gd)st.gd=lsG('lf_guest',null)||{};return st.gd}
  function gdSave(){if(!$('gn'))return;var g=function(i){var e=$(i);return e?e.value:''};st.gd={nome:g('gn'),pais:g('gpp'),tz:g('gz'),email:g('ge'),doc:g('gd')};lsS('lf_guest',st.gd)}
  function gErro2(m,id){var f=$(id);if(f){f.classList.add('bad');try{f.focus()}catch(_){}}toast(m)}
  function gConta(g){var d=gdGet(),pais=d.pais||paisSel(),tel=foneNorm(pais,d.tz||'');if(!g)return {nac:pais,pais:pais};return tel&&d.nome&&d.email?{nome:String(d.nome).trim(),nac:pais,doc:d.doc?docNorm(pais,d.doc):'',nasc:'',pais:pais,tel:tel,telTxt:d.tz,email:d.email,cidade:'',end:''}:null}
  function gLer(){
    gdSave();document.querySelectorAll('#layer .field.bad').forEach(function(e){e.classList.remove('bad')});
    var d=gdGet(),nome=String(d.nome||'').trim().replace(/\s+/g,' '),pais=d.pais||paisSel(),tel=foneNorm(pais,d.tz||''),em=String(d.email||'').trim(),doc=String(d.doc||'').trim();
    if(nome.length<3||nome.indexOf(' ')<0){gErro2('Digite seu nome e sobrenome.','gn');return null}
    if(!tel){gErro2(fnMsg(pais),'gz');return null}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){gErro2('E-mail inválido.','ge');return null}
    var dn='';if(doc){dn=docNorm(pais,doc);if(!dn){gErro2(nacInfo(pais).d+' inválido. Confira os números.','gd');return null}}
    return {nome:nome,nac:pais,doc:dn,nasc:'',pais:pais,tel:tel,telTxt:d.tz,email:em,cidade:'',end:''}}
  document.addEventListener('input',function(e){if(e.target&&/^g[nzed]$/.test(e.target.id))gdSave()});
  function gTel(pais){var t=telItems();if(!t.some(function(x){return x.v===pais}))t.push({v:pais,s:'+'+(FN&&FN[pais]?FN[pais].c:''),l:paisNome(pais),q:paisNome(pais)});
    if(!FN)fnLoad().then(function(){if($('gpp')){cddTel('gpp');var z=$('gz');if(z){z.placeholder=fnEx($('gpp').value);if(z.value)fnVivo(z,'gpp','gzh')}}},function(){});return t}
  function bagDados(){
    var lg=logado(),c=lg?getConta():gConta(false),d=gdGet();
    var py=lg?entPY(c):true,ent=py&&st.ent==='delivery'?'delivery':'loja',top;
    if(lg)top='<div class="cfc"><div style="display:flex;justify-content:space-between;gap:8px"><b>'+esc(c.nome)+'</b><button type="button" class="cfx" data-cta="conta">Editar</button></div><div>'+esc(c.tel)+'</div><div style="color:var(--mu);font-size:13px">'+esc(c.email||'')+'</div><div class="note" style="margin:6px 0 0;color:#14803f;font-weight:600">✓ <span>Dados preenchidos da sua conta</span></div></div>';
    else{var pais=c.pais,opt=function(v,f,n){return '<option value="'+v+'"'+(pais===v?' selected':'')+'>'+f+' '+n+'</option>'};
      top='<div class="cfc"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="font-size:17px">Seus dados</b><button type="button" class="cfx" data-cta="entrar" data-volta="1">Já tenho conta · Entrar</button></div>'+
      '<label class="cfl" for="gn">Nome completo</label><input class="field" id="gn" autocomplete="name" value="'+esc(d.nome||'')+'">'+
      '<label class="cfl" for="gz">WhatsApp</label><div class="fzr">'+cdd('gpp','País do WhatsApp',pais,gTel(pais),'Buscar país ou código')+'<input class="field" id="gz" inputmode="tel" autocomplete="tel-national" placeholder="'+esc(fnEx(pais))+'" value="'+esc(d.tz||'')+'"></div><div class="cfh" id="gzh" hidden></div>'+
      '<label class="cfl" for="ge">E-mail</label><input class="field" id="ge" type="email" inputmode="email" autocomplete="email" value="'+esc(d.email||'')+'">'+(EMAIL_ENVIA?'<div class="note" style="margin:6px 0 0">Enviamos para este e-mail o comprovante, o código de retirada e os dados do pedido.</div>':'')+
      '<label class="cfl" for="gd">'+nacInfo(pais).d+' <span style="font-weight:500">(opcional, para a nota)</span></label><input class="field" id="gd" inputmode="'+(NAC[pais]?'numeric':'text')+'" autocomplete="off" placeholder="'+nacInfo(pais).ph+'" value="'+esc(d.doc||'')+'"></div>'}
    return top+
      '<div class="note"><b style="color:var(--tx)">Como você recebe?</b></div>'+
      '<button type="button" class="cfo'+(ent==='loja'?' on':'')+'" data-ent="loja" aria-pressed="'+(ent==='loja')+'">'+cki('loja')+'<b>Retirar na loja</b><small>Venha quando quiser, seg a sáb, 7h30 às 15h</small></button>'+
      (py?'<button type="button" class="cfo'+(ent==='delivery'?' on':'')+'" data-ent="delivery" aria-pressed="'+(ent==='delivery')+'">'+cki('delivery')+'<b>Delivery</b><small>Entrega pela transportadora. O frete é pago à transportadora na entrega.</small></button>':'<div class="note" style="margin:4px 0 0">'+esc(semDelivery(c.cpais))+' '+(lgS()==='es'?'Para tu ciudad, el pedido es con retiro en la tienda.':'Para a sua cidade, o pedido é com retirada na loja.')+'</div>')+
      (ent==='delivery'?endBloco(c):'')}
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
  var ITAU={alias:'983642241',titular:'Jamal Ali Yassine'},TRF_AUTO=false /* 14/11: Banco Familiar — fica false até o robô ler o aviso do banco; enquanto isso o comprovante aparece na hora */;
  function compZap(e){var m=LFI.lang==='es'?'¡Hola! Pagué el pedido '+e.cod+' y el sitio no procesó el comprobante. Te lo envío por aquí.':'Olá! Paguei o pedido '+e.cod+' e o site não processou o comprovante. Estou enviando por aqui.';
    return '<a class="pgwa" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(m)+'"><span>O envio não funcionou? Mande o comprovante pelo WhatsApp</span></a>'}
  function pkPagar(id){
    var e=pedGet(id);if(!e){return}window.__pgid=id;
    var pix=e.pag==='pix',val=pix?brl(e.brl):'Gs. '+mil(e.total);
    pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Pagamento</h2><div class="pkt" style="animation-delay:.1s"><span>Pague para garantir suas peças. Elas ficam reservadas para você até a entrega.</span></div>'+
      '<div class="pgv">'+val+'</div>'+(resLeft(e)>0&&e.est==='pagar'?'<div class="cdx" id="cdx"><small>Sua peça está reservada por</small><b id="cdxt">--:--</b><i><u id="cdxb"></u></i><small>Depois disso ela volta para o site.</small></div>':'')+(e.teste?'<div class="pgt">MODO TESTE</div>':'')+
      '<div class="pgq" id="pgq">'+(pix?'':'<div class="pks" style="width:44px;height:44px;border-radius:50%;border:4px solid var(--ln2);border-top-color:#e6a3c9;animation:pksp .9s linear infinite"></div><div class="pgw">Estamos gerando o QR com o valor do seu pedido. Ele aparece aqui em instantes.</div>')+'</div>'+
      (pix?'<button type="button" class="pgc" data-pgcopy>Copiar código PIX</button><div class="pgw">Abra o app do seu banco, escolha PIX e leia o QR (ou use o copia e cola). Favorecido: La Fouch · Jamal Ali Yassine.</div>':'<div class="pgw" id="pgfav">Favorecido: Jamal Ali Yassine · La Fouch.</div><button type="button" class="pgc" id="pgsave" data-pgsave hidden>Salvar QR na galeria</button><div class="pgw" id="pgsavet" hidden>Está pagando pelo celular? Salve o QR e, no app do banco, escolha ler QR pela galeria.</div>'+
        '<div class="pgm"><b>Ou transfira manualmente</b><small>Não consegue ler o QR? Use o alias do Banco Familiar.</small>'+
        [['Alias (celular)',ITAU.alias,ITAU.alias],['Titular',ITAU.titular,ITAU.titular],['Valor','Gs. '+mil(e.total),String(Math.round(e.total))]].map(function(r){return '<div class="pgr"><div><small>'+r[0]+'</small><b>'+esc(r[1])+'</b></div><button type="button" data-pgc2="'+esc(r[2])+'">Copiar</button></div>'}).join('')+
        '<small>Depois, toque em "Já paguei" e envie o comprovante.</small></div>')+
      '<label class="pgb" for="pgf" id="pgbtn">Já paguei · enviar comprovante</label><input type="file" id="pgf" accept="image/*" hidden>'+
      '<a class="vend" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(LFI.lang==='es'?'¡Hola! Tengo una duda sobre el pago de mi pedido '+e.cod:'Olá! Tenho uma dúvida sobre o pagamento do meu pedido '+e.cod)+'"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200zm4.5-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.100-.7.300-.3.300-1 1-1 2.400s1 2.800 1.200 3c.1.200 2 3.100 4.900 4.300 1.800.8 2.500.8 3.400.7.500-.1 1.600-.7 1.800-1.300.2-.6.2-1.200.2-1.300-.1-.1-.3-.2-.5-.3z"/></svg><span>Falar com um vendedor</span></a>'+compZap(e)+
      '<button type="button" class="pgs" data-pkconta>Pagar depois (continua em Minha conta)</button>'+
      '<button type="button" class="pgx" data-cta="pkcanc">Cancelar pedido</button>'+
      '<p class="tm">Ao enviar o comprovante, você confirma a compra e aceita os <a href="/termos.html" target="_blank" rel="noopener">Termos e Condições</a>.</p>').className='pgw0';
    if(pix){var code=pixCode(e.brl,'LF'+e.cod);e.code=code;loadQr().then(function(){var q=$('pgq');if(q&&window.LFqr)q.innerHTML=LFqr.svg(code,240)}).catch(function(){var q=$('pgq');if(q)q.innerHTML='<div class="pgw">Não consegui desenhar o QR. Use o botão "Copiar código PIX".</div>'})}
    window.__pgcode=pix?pixCode(e.brl,'LF'+e.cod):'';
    resRelogio(id);
    pkPoll(id,function(o){
      if(o.pago){pkOk(id,o);return}
      if(o.recusado&&e.est==='comp'){pedSet(id,{est:'pagar'});e.est='pagar'}
      if(!pix&&o.qr&&$('pgq')&&!$('pgq').getAttribute('data-q')){$('pgq').setAttribute('data-q','1');$('pgq').innerHTML='<img class="pgi" alt="QR para pagar" src="'+esc(o.qr)+'">';window.__pgqr=o.qr;['pgsave','pgsavet'].forEach(function(i){var x=$(i);if(x)x.hidden=false})}})}
  var RELT=0;
  function resRelogio(id){
    clearInterval(RELT);RELT=0;var e=pedGet(id);if(!e||!e.rx||e.est!=='pagar'||!$('cdx'))return;
    var tot=Math.max(1,e.rx-(e.ts+(e.rd||0))),tick=function(){
      var c=$('cdx');if(!c||!$('pkok')){clearInterval(RELT);RELT=0;return}
      var ms=resLeft(pedGet(id));
      if(ms<=0){clearInterval(RELT);RELT=0;resExpirou(id);return}
      var s=Math.ceil(ms/1000),t=$('cdxt'),b=$('cdxb');if(t)t.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');if(b)b.style.width=Math.min(100,ms/tot*100)+'%';c.classList.toggle('lvx',s<=60)};
    tick();RELT=setInterval(tick,1000)}
  function resExpirou(id){
    var e=pedGet(id)||{};pedSet(id,{rx:0});
    var w=NUM_LOJA,m=encodeURIComponent('Olá! Meu pedido '+(e.cod||'')+' venceu o prazo de reserva, mas eu já paguei. Posso enviar o comprovante?');
    pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Reserva encerrada</h2><div class="pkt" style="animation-delay:.1s"><span>Passaram os 10 minutos e a peça voltou para o site. Se ainda estiver disponível, você pode reservar de novo.</span></div><div class="pkb" style="animation-delay:.3s"><button type="button" data-pkrenova="'+esc(id)+'">Reservar de novo</button><a class="pkw" target="_blank" rel="noopener" href="https://wa.me/'+w+'?text='+m+'">'+PK_WA+'Já paguei · falar com a loja</a><button type="button" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0'}
  function resRenova(id){
    var e=pedGet(id);if(!e)return;
    resCall('reservar',id,resItens(e.itens)).then(function(r){
      if(r&&r.ok===false&&r.motivo==='esgotado'){resEsgotou(r.falta,{itens:e.itens});return}
      if(r&&r.ok&&!r.off&&r.exp)pedSet(id,{rx:r.exp,rd:(r.agora||Date.now())-Date.now()});
      pkPagar(id)})}
  function pkComp(id){
    pedSet(id,{est:'comp'});
    pkTela(PK_LOGO+'<div class="pkc"><div class="pks"></div></div><h2 style="animation-delay:0s">Comprovante enviado</h2><div class="pkt" style="animation-delay:.1s"><span>A loja está conferindo o seu pagamento. Esta tela atualiza sozinha e você também pode acompanhar em Minha conta.</span></div><div class="pkb" style="animation-delay:.3s"><button type="button" data-pkfim>Voltar ao catálogo</button></div>'+(pedGet(id)?compZap(pedGet(id)):'')).className='pkw0';
    pkPoll(id,function(o){if(o.pago)pkOk(id,o);else if(o.recusado){pedSet(id,{est:'recusado'});pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Comprovante não aceito</h2><div class="pkt" style="animation-delay:.1s"><span>A loja não encontrou esse pagamento. Confira o valor e envie o comprovante de novo.</span></div><div class="pkb" style="animation-delay:.3s"><button type="button" data-cta="ped" data-id="'+esc(id)+'">Enviar outro comprovante</button></div>');pkStop()}})}
  function pkOk(id,o){
    pkStop();var e=pedGet(id)||{};pedSet(id,{est:'pago',tok:o.tok||''});
    var tok=o.tok||('LF-'+(e.cod||''));
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
    resize(file).then(function(img){return pkEnviar({tipo:'comp',ref:id,img:img,ts:Date.now(),cod:(pedGet(id)||{}).cod||''},id+'c')}).then(function(){if(CFG.reserva===true){var pe=pedGet(id)||{};resCall('comp',id,resItens(pe.itens)).then(function(r){if(r&&r.ok)pedSet(id,{rx:0})})}pkComp(id)},function(){if(btn)btn.textContent='Não deu para enviar. Tente de novo.';toast('Não deu para enviar o comprovante. Tente de novo.')})}
  function resEsgotou(falta,doc){
    var L=(falta||[]).map(function(f){var it=(doc.itens||[]).filter(function(i){return i.ref===f.ref&&String(i.cor||'').toLowerCase()===String(f.cor||'').toLowerCase()})[0]||{};return '<div class="exx" style="margin-top:6px"><b>'+esc(it.nome||f.ref)+(f.cor?' · '+esc(f.cor):'')+'</b>'+(f.disp>0?'Só restam '+f.disp+' no momento.':'Acabou de ser reservada por outra cliente.')+'</div>'}).join('');
    st.pkid='';st.pkdoc=null;
    /* a peça está presa por um pedido DESTE aparelho que ainda não foi pago: não é "outra pessoa" */
    var meu=lsG('lf_ped',[]).filter(function(e){return e.est==='pagar'&&e.rx&&resLeft(e)>0&&(e.itens||[]).some(function(i){return (falta||[]).some(function(f){return f.ref===i.ref})})}).pop();
    if(meu){pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Você já reservou esta peça</h2><div class="pkt" style="animation-delay:.1s"><span>Ela está guardada no seu pedido '+esc(meu.cod||'')+', esperando o pagamento. Nenhum pedido novo foi criado.</span></div><div class="pkb" style="animation-delay:.3s"><button type="button" data-cta="ped" data-id="'+esc(meu.id)+'">Ver meu pedido</button><button type="button" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0';try{syncEstoque()}catch(_){}return}
    var soEsg=(falta||[]).every(function(f){return !f.motivo||f.motivo==='esgotado'});
    if(!soEsg){pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Peça indisponível</h2><div class="pkt" style="animation-delay:.1s"><span>Esta peça não está disponível no site no momento. Nenhum pedido foi criado. Fale com a loja pelo WhatsApp se quiser.</span></div><div class="pkb" style="animation-delay:.3s"><button type="button" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0';try{syncEstoque()}catch(_){}return}
    pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Acabou de esgotar</h2><div class="pkt" style="animation-delay:.1s"><span>Alguém reservou esta peça agora. Se ela não for paga em 10 minutos, volta para o site. Nenhum pedido foi criado.</span></div>'+L+'<div class="pkb" style="animation-delay:.3s"><button type="button" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0';
    try{syncEstoque()}catch(_){}}
  function enviarPedido(retry){
    var c=logado()?getConta():($('gn')?gLer():gConta(true));if(!c){if(!$('gn')){toast('Preencha seus dados para continuar.');st.step='dados';bag()}return}st.nome=c.nome;st.zap=c.tel;
    var ks=Object.keys(st.cart);if(!ks.length&&!retry)return;
    var ent=((logado()?entPY(c):true)&&st.ent==='delivery')?'delivery':'loja',ae=$('fa2');if(ae)st.endE=ae.value;
    var sv0=endsSalvos(c),endE=(st.endMode!=='manual'&&sv0.length)?(sv0[Math.min(st.endIdx|0,sv0.length-1)]||''):String(st.endE||'').trim();
    if(!retry&&ent==='delivery'&&endE.length<6){toast('Digite o endereço da entrega.');ae&&ae.focus();return}
    if(!retry&&ent==='delivery'&&st._endOk!==endE){var bt0=document.querySelector('[data-send]');if(bt0&&bt0.disabled)return;if(bt0)bt0.disabled=true;
      endConf(endE).then(function(r){if(bt0)bt0.disabled=false;if(r.fora){endAviso(r.cc);return}st._endOk=endE;enviarPedido(retry)});return}
    var id=st.pkid&&retry?st.pkid:(Date.now().toString(36)+Math.random().toString(36).slice(2,7));st.pkid=id;
    var cod=id.slice(-4).toUpperCase(),pag=(c.nac==='br'||c.nac==='ar')?'pix':'alias';
    var txt='PEDIDO '+cod+'\n'+mensagem('reserva'),wa='https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(txt);
    var ff=st.rosto?FACES.filter(function(x){return x.id===st.rosto})[0]:null;
    var vb=TESTE?1:valorBRL();
    var doc=st.pkdoc&&retry?st.pkdoc:{ts:Date.now(),nome:c.nome,tel:c.tel,pais:c.pais,cod:cod,lang:(window.LFI&&LFI.lang)||'pt',moeda:(window.LFI&&LFI.cur)||'',total:Math.round(total()),rosto:ff?ff.nome:'',
      nac:c.nac,doc:c.doc,nasc:c.nasc,email:c.email||'',obsC:c.obs||'',cidade:c.cidade,end:c.end||'',ent:ent,endE:ent==='delivery'?endE:'',refE:'',pag:pag,brl:vb,teste:!!TESTE,
      itens:ks.map(function(k){var p=find(k);return {ref:p.ref,nome:p.nome,q:st.cart[k],cor:(p.cores&&p.cores.length>1)?corNome(p,st.cor[k]||0):'',grau:(p.gr&&p.gr.length)?p.gr[st.gr[k]||0]:'',preco:Math.round(p.n)}})};
    st.pkdoc=doc;
    pkTela('<div class="pkl"></div><div class="pkc"><div class="pks"></div></div><h2 style="animation-delay:0s">Enviando seu pedido…</h2>').className='pkw0';
    var rxo=null;
    (CFG.reserva===true?resCall('reservar',id,resItens(doc.itens)):Promise.resolve(null)).then(function(rr){
      if(rr&&rr.ok===false&&rr.motivo==='esgotado'){var err=new Error('esgotado');err.falta=rr.falta||[];throw err}
      if(rr&&rr.ok&&!rr.off&&rr.exp)rxo={rx:rr.exp,rd:(rr.agora||Date.now())-Date.now()};
      return pkEnviar2(doc,id)}).then(function(){
      if(ent==='delivery'&&endE){var le=lsG('lf_ends',[]).filter(function(x){return x!==endE});le.unshift(endE);lsS('lf_ends',le.slice(0,4))}
      var L=lsG('lf_ped',[]);if(!L.some(function(e){return e.id===id}))L.push({id:id,cod:cod,ts:doc.ts,total:doc.total,brl:vb,ent:ent,pag:pag,est:'pagar',teste:!!TESTE,rx:rxo?rxo.rx:0,rd:rxo?rxo.rd:0,itens:doc.itens.map(function(i){return {ref:i.ref,nome:i.nome,q:i.q,cor:i.cor}})});lsS('lf_ped',L.slice(-30));
      st.cart={};st.pkid='';st.pkdoc=null;st.step='cart';try{drawBag()}catch(_){}
      closeLayer();pkPagar(id)
    },function(er){
      if(er&&er.message==='esgotado'){resEsgotou(er.falta,doc);return}
      pkTela('<div class="pkl"></div><h2 style="animation-delay:0s">Quase lá!</h2><div class="pkt" style="animation-delay:.1s"><span>Não deu para enviar o pedido agora. Tente de novo ou fale com a loja pelo WhatsApp.</span></div><div class="pkb" style="animation-delay:.2s"><a class="pkw" target="_blank" rel="noopener" href="'+wa+'">'+PK_WA+'Enviar pelo WhatsApp</a><button type="button" data-pkretry>Tentar de novo</button></div><div class="pkcod">'+LFI.tr('código do erro')+': '+esc(pkCodErro(er))+'</div>')})}

  /* ===== Conta nova (07/11/2026): cadastro só nome/e-mail/senha + código no e-mail; Minha conta em abas ===== */
  function codUrl(){return 'https://southamerica-east1-'+FB.p+'.cloudfunctions.net/codigo'}
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
  cadastrarTela=function(){gPre();
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Criar conta">'+authHead('Criar conta')+
      (AUTH_VOLTA?'<div class="note" style="margin:0">Para fazer o pedido, crie sua conta ou entre. Seu carrinho fica guardado.</div>':'')+
      '<label class="cfl" for="aun">Nome completo</label><input class="field" id="aun" autocomplete="name" placeholder="Como você se chama">'+
      '<label class="cfl" for="aue">E-mail</label><input class="field" id="aue" type="email" inputmode="email" autocomplete="email" autocapitalize="none" placeholder="voce@email.com">'+
      pwField('aup2','Senha (mínimo 6 caracteres)')+
      '<div class="fze" id="cferr" role="alert" hidden></div>'+
      '<button class="btn w" data-cta="criar" data-busy>Confirmar</button>'+'<p class="tm">Ao criar sua conta, você aceita os <a href="/termos.html" target="_blank" rel="noopener">Termos e Condições</a> <span>e a</span> <a href="/privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>.</p>'+gBtn('Criar conta com Google')+
      '<button type="button" class="cfx" data-cta="entrar" style="text-align:center;width:100%">Já tenho conta · <u>Iniciar sessão</u></button></aside>')};
  authCriar=function(){
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
  function codChama(acao,extra){return idTok().then(function(t){return fetch(codUrl(),{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(Object.assign({acao:acao,lang:lgS()},extra||{}))})}).then(function(r){if(r.status===404)return {ok:false,motivo:'sem-config'};return r.json().catch(function(){return {ok:false,motivo:'erro'}})},function(){return {ok:false,motivo:'rede'}})}
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
  authEntrar=function(){
    var id=($('aul')||{value:''}).value.trim().toLowerCase(),pw=($('aup')||{value:''}).value;
    if(!id)return cfErro('Digite seu e-mail.','aul');if(!pw)return cfErro('Digite sua senha.','aup');cfErro('');try{var rm=$('aur')?$('aur').checked:true;if(rm){localStorage.removeItem('lf_norem');localStorage.setItem('lf_lastu',id)}else{localStorage.setItem('lf_norem','1');localStorage.removeItem('lf_lastu')}}catch(_){}authBusy(true);
    var ses;achaEmail(id).then(function(r){return authPost('signInWithPassword',{email:r.email,password:pw,returnSecureToken:true}).then(function(j){ses=sessSave(j,r.user,{gn:j.displayName||''});return ses})})
      .then(function(s){return fsA('GET','clientes/'+s.uid).then(function(d){return fbd(d)},function(){return null})})
      .then(function(c){c=c&&c.email?contaNorm(c):contaMin(ses);lsS('lf_conta',c);toast('Olá, '+primeiroNome(c.nome)+'!');posLogin()},function(e){authErr(e,'aul')})};
  gEntrar=function(){
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
    if(so!=='falta'||!c.tel)h+='<label class="cfl" for="'+p+'z">Número de telefone</label><div class="fzr">'+cdd(p+'p','País do telefone',pais,ti,'Buscar país ou código')+'<input class="field" id="'+p+'z" inputmode="tel" autocomplete="tel-national" placeholder="'+esc(fnEx(pais))+'" value="'+esc(c.telTxt||'')+'"></div><div class="cfh" id="'+p+'zh" hidden></div>';
    if(so!=='falta'||!c.doc)h+='<label class="cfl" for="'+p+'a2">'+LFI.tr('Nacionalidade')+'</label>'+cdd(p+'a2',LFI.tr('Nacionalidade'),nac,nacItems(),'Buscar nacionalidade')+
      '<label class="cfl" for="'+p+'d" id="'+p+'dl">'+nacInfo(nac).d+'</label><input class="field" id="'+p+'d" inputmode="'+(NAC[nac]?'numeric':'text')+'" autocomplete="off" placeholder="'+nacInfo(nac).ph+'" value="'+esc(maskDoc(nac,c.doc||''))+'">';
    /* Factura (12/11): paraguaio pode pôr o RUC (opcional) para a factura sair com nome; sem RUC = Sin nombre / RUC X */
    h+='<div id="'+p+'rw" hidden><label class="cfl" for="'+p+'r">'+LFI.tr('RUC (opcional, para a factura com seu nome)')+'</label><input class="field" id="'+p+'r" inputmode="numeric" autocomplete="off" placeholder="1234567-8" value="'+esc(c.ruc||'')+'"></div>';
    return h}
  function rucDV(n){var k=2,t=0;for(var i=n.length-1;i>=0;i--){t+=(+n[i])*k;k=k>=11?2:k+1}var r=t%11;return r>1?11-r:0}
  function rucNorm(v){var m=/^(\d{3,8})-?(\d)$/.exec(String(v||'').replace(/[\s.]/g,''));if(!m)return '';return rucDV(m[1])===+m[2]?m[1]+'-'+m[2]:''}
  /* lê telefone/documento de um bloco perfilCampos; obr = obrigatórios */
  function perfilLer(c,p,obr){var o={},z=$(p+'z'),d=$(p+'d');
    if(z){var pais=$(p+'p').value,tv=z.value.trim();if(tv||obr){var tel=foneNorm(pais,tv);if(!tel){cfErro(fnMsg(pais),p+'z');return null}o.pais=pais;o.tel=tel;o.telTxt=tv}}
    if(d){var nac=$(p+'a2').value,dv=d.value.trim();if(dv||obr){var dn=docNorm(nac,dv);if(!dn){cfErro(nacInfo(nac).d+(NAC[nac]?' inválido. Confira os números.':': digite o número (letras e números, mínimo 4).'),p+'d');return null}o.nac=nac;o.doc=dn}}
    var r=$(p+'r'),rw=$(p+'rw');if(r&&rw&&!rw.hidden){var rv=r.value.trim();if(rv){var rn=rucNorm(rv);if(!rn){cfErro(LFI.tr('RUC inválido. Confira o número e o dígito depois do traço.'),p+'r');return null}o.ruc=rn}else o.ruc=''}else if(r)o.ruc=rucNorm((($(p+'d')||{}).value)||'')||'';
    return o}
  document.addEventListener('change',function(e){var t=e.target;if(!t||!t.id)return;var m=/^(mp|pp)a2$/.exec(t.id);if(m){var p=m[1],n=nacInfo(t.value),fd=$(p+'d'),rw0=$(p+'rw');if(rw0)rw0.hidden=t.value!=='py';if(fd){$(p+'dl').textContent=n.d;fd.placeholder=n.ph;fd.inputMode=NAC[t.value]?'numeric':'text';fd.value=maskDoc(t.value,fd.value)}var pp=$(p+'p'),pz=$(p+'z');if(pp&&pz&&!pz.value&&(!FN||FN[t.value]))cddSet(p+'p',t.value)}
    var m2=/^(mp|pp)p$/.exec(t.id);if(m2){var z=$(m2[1]+'z');if(z){z.placeholder=fnEx(t.value);if(z.value&&!/^(\+|00)/.test(z.value.trim()))fnVivo(z,t.id,m2[1]+'zh')}}});
  document.addEventListener('input',function(e){var t=e.target;if(!t||!t.id)return;var m=/^(mp|pp)z$/.exec(t.id);if(m)fnVivo(t,m[1]+'p',m[1]+'zh');var m2=/^(mp|pp)d$/.exec(t.id);if(m2)maskCampo(t,function(v){return maskDoc($(m2[1]+'a2').value,v)})});
  function endLinha(a){return esc(a.end)+(a.cidade?', '+esc(a.cidade):'')+(a.dep?' · '+esc(a.dep):'')}
  minhaConta=function(aba,edita){
    var c=contaNorm(getConta());if(!sessG()){entrarTela(false);return}if(!c){c=contaMin(sessG())}
    st.mcAba=aba||st.mcAba||'perfil';var A=st.mcAba,h='';
    var tabs='<div class="mct" role="tablist">'+[['perfil','Perfil'],['ends','Endereços'],['peds','Pedidos'],['cart','Cartões']].map(function(x){return '<button type="button" role="tab" aria-selected="'+(A===x[0])+'" class="'+(A===x[0]?'on':'')+'" data-cta="mcaba" data-a="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>';
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
      h=L.length?L.map(function(e){return '<button type="button" class="cfp" data-cta="ped" data-id="'+esc(e.id)+'"><span><b>Pedido '+esc(e.cod)+(e.teste?' · teste':'')+'</b><small>'+new Date(e.ts).toLocaleDateString('pt-BR')+' · '+(e.pag==='pix'?'PIX':e.pag==='alias'?'Banco Familiar':'')+' · '+(e.ent==='delivery'?'Delivery':'Retirada')+(e.est==='pago'?' · Código '+esc(e.tok||('LF-'+e.cod)):'')+'</small></span><em class="'+(e.est==='pago'?'ok':e.est==='cancelado'?'er':'')+'">'+estLabel(e)+'</em></button>'}).join(''):'<div class="note">Você ainda não fez nenhum pedido.</div>';
      pedAtualiza()}
    layer('<aside class="panel" role="dialog" aria-modal="true" aria-label="Minha conta"><div style="display:flex;align-items:center;justify-content:space-between"><h2 style="font-size:28px">Minha conta</h2><button class="x" data-close aria-label="Fechar" style="align-self:auto">×</button></div>'+tabs+h+'</aside>');
    if(A==='perfil')gCard();if(A==='cart')mtjCarrega()};
  /* situação dos pedidos pendentes: pago, recusado ou cancelado pela loja */
  var PEDAT=0;
  function pedAtualiza(){if(Date.now()-PEDAT<8000)return;PEDAT=Date.now();var L=lsG('lf_ped',[]).filter(function(e){return e.est==='pagar'||e.est==='comp'||e.est==='recusado'});if(!L.length)return;
    Promise.all(L.map(function(e){return fbg('reservas/'+encodeURIComponent(e.id)).then(function(d){var o=fbd(d)||{},n=null;if(o.cancelado)n={est:'cancelado'};else if(o.pago)n={est:'pago',tok:o.tok||e.tok||''};if(n){pedSet(e.id,n);return 1}return 0},function(){return 0})})).then(function(r){if(r.some(Boolean)&&st.mcAba==='peds'&&document.querySelector('#layer .mct'))minhaConta('peds')})}
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
  var _mc0=minhaConta,_mcAba='';
  minhaConta=function(aba,edita){var aberto=!!document.querySelector('#layer [aria-label="Minha conta"]');_mc0(aba,edita);if(!MOV())return;
    var pn=document.querySelector('#layer [aria-label="Minha conta"]');if(!pn)return;var A=st.mcAba;
    var alvo=aberto?(A!==_mcAba?[].slice.call(pn.children).filter(function(e){return !/^(H2|DIV)$/.test(e.tagName)||!e.querySelector('h2')}).slice(1):[]):[].slice.call(pn.children);
    alvo.forEach(function(e,k){e.animate([{transform:'translateY(12px)',opacity:0},{transform:'none',opacity:1}],{duration:380,delay:k*55,easing:EZ,fill:'backwards'})});_mcAba=A};
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
  /* valor final único (centavos no PIX, alguns guaranis no Banco Familiar): a confirmação automática acha o pedido certo */
  function uqGera(){return 1+Math.floor(Math.random()*98)}
  enviarPedido=function(retry){
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
    if(!retry&&descVale()==='cup'&&st._cupOk!==id){var bt1=document.querySelector('[data-send]');if(bt1)bt1.disabled=true;
      cupFn({acao:'usar',cod:st.cup.cod,pid:id,tel:c.tel||'',email:c.email||'',total:Math.round(bruto()),desc:Math.round(cupInfo().d)}).then(function(j){if(bt1)bt1.disabled=false;
        if(j&&j.ok){st._cupOk=id;enviarPedido(retry);return}cupTira();toast(cupMsg(j&&j.motivo,j&&j.cupom));bag(true)},function(){if(bt1)bt1.disabled=false;toast(LFI.tr('Não deu para conferir o código agora. Tente de novo.'))});return}
    var L2=l2Info(),CI=cupInfo(),DV=descVale(),doc=st.pkdoc&&retry?st.pkdoc:(function(){var uq=uqGera(),fr=ent==='delivery'?freteG():0,base=Math.round(total())+fr,vb0=TESTE?1:valorBRL()+(fr?Math.max(5,Math.round(fr/(window.LF_RATE?window.LF_RATE():1400)/5)*5):0);
      return Object.assign({ts:Date.now(),nome:c.nome,tel:c.tel,pais:c.pais||'',cod:cod,lang:(window.LFI&&LFI.lang)||'pt',moeda:(window.LFI&&LFI.cur)||'',total:base,rosto:ff?ff.nome:'',
      nac:c.nac||'',doc:c.doc||'',nasc:'',email:c.email||'',/* S192: transportadora e frete vão no obsC (as regras atuais do Firestore já aceitam) */obsC:[c.nac==='py'&&c.ruc?'RUC '+c.ruc:'',ent==='delivery'&&st.tr?'Transportadora: '+trNome(st.tr)+(fr?' · frete Gs. '+fr.toLocaleString('es-PY'):' · frete na entrega'):''].filter(Boolean).join(' · ').slice(0,190),cidade:E?E.cidade:'',end:'',ent:ent,
      endE:ent==='delivery'&&E?E.end+', '+E.cidade+(E.dep?' · '+E.dep:''):'',refE:ent==='delivery'&&E?E.ref||'':'',depE:ent==='delivery'&&E?E.dep||'':'',
      
      /* S197: o final único sempre DESCONTA (o cliente nunca paga a mais) */pag:pag,uq:uq,brl:pag==='pix'?Math.round((vb0-uq/100)*100)/100:vb0,pagar:pag==='alias'?base-uq:0,teste:!!TESTE,
      itens:ks.map(function(k){var p=find(k);return {ref:p.ref,nome:p.nome,q:st.cart[k],cor:(p.cores&&p.cores.length>1)?corNome(p,st.cor[k]||0):'',grau:(p.gr&&p.gr.length)?p.gr[st.gr[k]||0]:'',preco:Math.round(p.n-(DV==='l2'?(L2.por[k]||0):0)/st.cart[k]-(DV==='cup'?(CI.por[k]||0):0)/st.cart[k]),l2:DV==='l2'?L2.por[k]||0:0,cd:DV==='cup'?CI.por[k]||0:0}})},DV==='cup'&&st.cup?{cup:st.cup.cod,cupd:CI.d}:{})})();
    st.pkdoc=doc;
    if(!retry)lsS('lf_ent',ent==='delivery'?{ent:'delivery',tr:st.tr||'',i:st.endIdx|0}:{ent:'loja'});
    pkTela('<div class="pkl"></div><div class="pkc"><div class="pks"></div></div><h2 style="animation-delay:0s">Enviando seu pedido…</h2>').className='pkw0';
    var rxo=null;
    (CFG.reserva===true?resCall('reservar',id,resItens(doc.itens),null,{pag:pag}):Promise.resolve(null)).then(function(rr){
      if(rr&&rr.ok===false&&rr.motivo==='esgotado'){var err=new Error('esgotado');err.falta=rr.falta||[];throw err}
      if(rr&&rr.ok&&!rr.off&&rr.exp)rxo={rx:rr.exp,rd:(rr.agora||Date.now())-Date.now()};
      return pkEnviar(doc,id)}).then(function(){
      var L=lsG('lf_ped',[]);if(!L.some(function(e){return e.id===id}))L.push({id:id,cod:cod,ts:doc.ts,total:doc.total,brl:doc.brl,pagar:doc.pagar,uq:doc.uq,ent:ent,pag:pag,est:'pagar',teste:!!TESTE,rx:rxo?rxo.rx:0,rd:rxo?rxo.rd:0,itens:doc.itens.map(function(i){return {ref:i.ref,nome:i.nome,q:i.q,cor:i.cor}})});lsS('lf_ped',L.slice(-30));
      if(doc.cup)cupTira();
      cupFn({acao:'proxima',pid:id,tel:c.tel||'',email:c.email||'',lang:LFI.lang}).then(function(j){if(j&&j.ok&&j.cupom){var L3=lsG('lf_ped',[]);L3.forEach(function(e){if(e.id===id){e.px=j.cupom;if(j.amiga)e.am=j.amiga}});lsS('lf_ped',L3);var pc=document.getElementById('pxcard');if(pc)pc.outerHTML=pxHtml(j.cupom)}},function(){});
      st.cart={};st.pkid='';st.pkdoc=null;st.step='cart';st.pag='';try{drawBag()}catch(_){}
      closeLayer();pkPagar(id)
    },function(er){
      if(er&&er.message==='esgotado'){resEsgotou(er.falta,doc);return}
      pkTela('<div class="pkl"></div><h2 style="animation-delay:0s">Quase lá!</h2><div class="pkt" style="animation-delay:.1s"><span>Não deu para enviar o pedido agora. Tente de novo ou fale com a loja pelo WhatsApp.</span></div><div class="pkb" style="animation-delay:.2s"><a class="pkw" target="_blank" rel="noopener" href="'+wa+'">'+PK_WA+'Enviar pelo WhatsApp</a><button type="button" data-pkretry>Tentar de novo</button></div><div class="pkcod">'+LFI.tr('código do erro')+': '+esc(pkCodErro(er))+'</div>')})};
  /* tela de pagar: PIX (automático) ou Banco Familiar (alias + comprovante) */
  pkPagar=function(id){
    var e=pedGet(id);if(!e){return}window.__pgid=id;
    var pix=e.pag==='pix',vg=e.pagar||e.total;
    var timer=resLeft(e)>0&&e.est==='pagar'?'<div class="cdx" id="cdx"><small>Sua peça está reservada por</small><b id="cdxt">--:--</b><i><u id="cdxb"></u></i><small>Depois disso ela volta para o site.</small></div>':'';
    var fim='<input type="file" id="pgf" accept="image/*" hidden>'+
      '<a class="vend" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(LFI.lang==='es'?'¡Hola! Tengo una duda sobre el pago de mi pedido '+e.cod:'Olá! Tenho uma dúvida sobre o pagamento do meu pedido '+e.cod)+'"><span>Falar com um vendedor</span></a>'+
      (e.px?pxHtml(e.px):'<div id="pxcard"></div>')+
      '<button type="button" class="pgs" data-pkconta>Pagar depois (continua em Minha conta)</button>'+
      '<button type="button" class="pgx" data-cta="pkcanc">Cancelar pedido</button>'+
      '<p class="tm">Ao pagar, você confirma a compra e aceita os <a href="/termos.html" target="_blank" rel="noopener">Termos e Condições</a>.</p>';
    if(pix)pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Pague com PIX</h2><div class="pgv">'+brl(e.brl)+'</div><div class="pgsub">Pague o valor exato, com os centavos</div>'+timer+(e.teste?'<div class="pgt">MODO TESTE</div>':'')+
      '<div class="pgq" id="pgq"></div><button type="button" class="pgc" data-pgcopy>Copiar código PIX</button>'+
      '<div class="pgau"><span class="spn"></span><span>Esperando o PIX… confirmamos sozinhos, não precisa mandar nada</span></div>'+
      '<div class="pgcl" id="pgcl" hidden>'+LFI.tr('Pagou e ainda não confirmou?')+'<br><label for="pgf">'+LFI.tr('Envie o comprovante')+'</label></div>'+fim).className='pgw0';
    else pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Transferência Banco Familiar</h2><div class="pgv">Gs. '+mil(vg)+'</div><div class="pgsub">Transfira o valor exato</div>'+timer+(e.teste?'<div class="pgt">MODO TESTE</div>':'')+
      '<div class="pgm">'+[['Alias (celular)',ITAU.alias,ITAU.alias],['Valor exato','Gs. '+mil(vg),String(Math.round(vg))]].map(function(r){return '<div class="pgr"><div><small>'+r[0]+'</small><b>'+esc(r[1])+'</b></div><button type="button" data-pgc2="'+esc(r[2])+'">Copiar</button></div>'}).join('')+
      '<div class="pgtit">Titular: '+esc(ITAU.titular)+'</div></div>'+
      '<div class="pgau"><span class="spn"></span><span>'+LFI.tr(TRF_AUTO?'Esperando a transferência… confirmamos sozinhos, não precisa mandar nada':'Depois de transferir, envie o comprovante para confirmarmos')+'</span></div>'+
      '<div class="pgcl" id="pgcl" hidden>'+LFI.tr('Pagou e ainda não confirmou?')+'<br><label for="pgf">'+LFI.tr('Envie o comprovante')+'</label></div>'+fim).className='pgw0';
    if(pix){var code=pixCode(e.brl,'LF'+e.cod);e.code=code;loadQr().then(function(){var q=$('pgq');if(q&&window.LFqr)q.innerHTML=LFqr.svg(code,240)}).catch(function(){var q=$('pgq');if(q)q.innerHTML='<div class="pgw">Não consegui desenhar o QR. Use o botão "Copiar código PIX".</div>'})}
    window.__pgcode=pix?pixCode(e.brl,'LF'+e.cod):'';
    /* S197: o comprovante só aparece depois de 10 min sem a confirmação automática */
    /* 13/11: Banco Familiar também confirma sozinho pelo e-mail do banco; o comprovante só depois de 10 min */
    {var pgW=!pix&&!TRF_AUTO?0:Math.max(0,600000-(Date.now()-(+e.ts||Date.now())));clearTimeout(window.__pgclT);window.__pgclT=setTimeout(function(){var x=$('pgcl');if(x)x.hidden=false},pgW)}
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
  function img5(p){if(p&&p.tipo==='acessorio'&&!p.foto)return accIco(p);return p&&p.foto?'<img src="'+p.foto+'" alt="'+esc(p.nome)+'" loading="lazy" draggable="false">':glasses((p&&p.cor)||'#2a2d33',(p&&p.raio)||14,5)}
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
    var b=$('evbar');if(!b){b=document.createElement('div');b.id='evbar';var tp=document.querySelector('.top');tp.parentNode.insertBefore(b,tp)}
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
    var hci=p?melhorCor(p):0,pF=p&&hci&&p.fc&&p.fc[hci]?Object.assign({},p,{foto:p.fc[hci]}):p;if(p&&hci&&!(p.fc&&p.fc[hci])&&p.lib)colorFoto(p,hci,function(u){var im=document.querySelector('#hdst .hdi img');if(im&&u)im.src=u});
    var imgA=vid?'<video src="'+esc(vid)+'" autoplay muted loop playsinline></video>':gv?img5(pF)+'<video class="hgv" src="'+esc(gv)+'" autoplay muted loop playsinline disablepictureinpicture onerror="this.remove()"></video>':img5(pF);
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
  function card5(p,idl,sec){return '<button type="button" class="hc" data-open="'+p.ref+'" aria-label="'+LFI.tr('Ver')+' '+esc(p.nome)+'">'+(idl?'<span class="hidl">'+LFI.tr('Ideal para você')+'</span>':selo5(p,sec))+'<span class="hci">'+img5(p)+'</span>'+(/Últim/.test(p.aviso||'')?'<span class="ulin hlin"><i></i>'+esc(p.aviso)+'</span>':'')+(p.ds!=null?'<span class="hn lfcod"><small class="hds">'+esc(p.ds)+'</small>'+esc(p.ref)+'</span>':'<span class="hn">'+esc(p.nome)+'</span>')+'<span class="hsw">'+(p.cores||[]).slice(0,5).map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</span><span class="hp">'+prc5(p)+'</span></button>'}
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
    var com=function(at,img,tag,t,sub){return '<button type="button" '+at+'><span class="gi'+(img==='MO'?' mo" data-mochi="1':'')+'">'+(img==='MO'?'':img)+'</span><span class="gt"><small>'+LFI.tr(tag)+'</small><b>'+LFI.tr(t)+'</b>'+(sub?'<em class="gsub">'+LFI.tr(sub)+'</em>':'')+'</span></button>'};
    var moI='MO';(function poe(n){var f=window.__lfMochiSvg;if(!f){if(n<20)setTimeout(function(){poe(n+1)},250);return}document.querySelectorAll('[data-mochi]').forEach(function(e){if(!e.firstChild){e.innerHTML=f().replace(/id="(lf[a-z0-9]+)"/g,'id="h$1"').replace(/url\(#(lf[a-z0-9]+)\)/g,'url(#h$1)');if(window.__lfMochiArms)window.__lfMochiArms(e.querySelector('svg'))}})})(0);
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
  function newsForm(){var m=V5.nm||'wa';
    if(V5.nok)return '<div class="nok">✓ '+LFI.tr(V5.nok)+'</div>';
    return '<div class="nt"><button type="button" data-nm="wa" class="'+(m==='wa'?'on':'')+'">WhatsApp</button><button type="button" data-nm="em" class="'+(m==='em'?'on':'')+'">E-mail</button></div>'+
      (m==='em'?'<input type="email" id="hnem" placeholder="'+LFI.tr('Seu e-mail')+'" autocomplete="email" aria-label="'+LFI.tr('Seu e-mail')+'"><button type="button" class="nb" data-news="em">'+LFI.tr('Quero receber')+'</button><div class="nc">'+LFI.tr('Ao se inscrever, você aceita receber e-mails da La Fouch.')+'</div>'
        :'<button type="button" class="nb" data-news="wa">'+LFI.tr('Quero receber pelo WhatsApp')+'</button><div class="nc">'+LFI.tr('Abre o WhatsApp com a mensagem pronta. Você só aperta enviar.')+'</div>')}
  function rodape5(){var es=LFI.lang==='es',ig=(typeof SOCIAL!=='undefined'&&SOCIAL.ig)||'';
    return '<div class="lfft"><div class="in"><div><p class="fbr">La Fouch</p><p>'+LFI.tr('Tudo em óculos')+' · Ciudad del Este</p><p>Galeria Jebai Center, 3° piso, torre A, n°2242</p><p>'+LFI.tr('Segunda a sábado, das 7h30 às 15h')+'</p><p><a class="mp" href="https://maps.app.goo.gl/zy6c1ZFq4gQhxWXC8" target="_blank" rel="noopener" style="color:var(--ac);font-weight:700">'+LFI.tr('Como chegar')+' ›</a></p></div>'+
      '<div><b>'+LFI.tr('Comprar')+'</b><p><a href="#vitrine" data-mf="tipo:solar">'+LFI.tr('Solar')+'</a></p><p><a href="#vitrine" data-mf="tipo:grau">'+LFI.tr('Leitura')+'</a></p><p><a href="#vitrine" data-mf="tipo:armacao">'+LFI.tr('Armações')+'</a></p><p><a href="#vitrine" data-mf="tipo:of">'+LFI.tr('Ofertas')+'</a></p><p><a href="#atacado">'+LFI.tr('Atacado')+'</a></p></div>'+
      '<div><b>'+LFI.tr('Ajuda')+'</b><p><a href="#como" data-ajp="duvidas">'+LFI.tr('Dúvidas frequentes')+'</a></p><p><a href="#como" data-ajp="dicas">'+LFI.tr('Dicas e cuidados')+'</a></p><p><a href="#como" data-ajp="contato">'+LFI.tr('Entre em contato')+'</a></p></div>'+

      '</div><div class="fbt"><div><a href="/termos.html">'+LFI.tr('Termos')+'</a> · <a href="/privacidade.html">'+LFI.tr('Privacidade')+'</a> · © '+new Date().getFullYear()+' La Fouch</div><div class="frc">'+LFI.tr('Protegido pelo reCAPTCHA do Google')+' · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">'+LFI.tr('Privacidade')+'</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noopener">'+LFI.tr('Termos')+'</a></div></div>'}
  function homeDraw(){
    var H=$('home');if(!H){H=document.createElement('div');H.id='home';var hero=document.querySelector('.hero');hero.style.setProperty('display','none','important');hero.parentNode.insertBefore(H,hero.nextSibling)}
    evAplica();if(st.rosto){try{localStorage.setItem('lf_rosto5',st.rosto)}catch(_){}}
    var ht=homeHtml();if(H._h===ht)return;var ja=!!H._h&&H.firstChild;H._h=ht;
    /* 09/11 S43 (aprovado): a 2ª pintura (dados da nuvem) troca só o que mudou — as fotos, os cartões e as animações do Destaque continuam os mesmos (sem piscar nem recomeçar) */
    if(ja){var t=document.createElement('div');t.innerHTML=ht;try{lfMorph(H,t);try{lfDsFit(true)}catch(_){}return}catch(_){}}
    H.innerHTML=ht;dstGira()}
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
    inp.addEventListener('keydown',function(e){if(e.key==='Escape')fecha();if(e.key==='Enter'){e.preventDefault();todos()}});
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
    nv.innerHTML='<a href="#" class="dacc" data-cta="minha"><span class="dav" id="dav">'+'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg></span><span><b id="dacn">Entrar ou criar conta</b><small id="dacs">Minha conta · Meus pedidos ›</small></span></a>'+
      '<small class="dgl">Comprar</small>'+A('#vitrine','tipo:solar','Solar')+A('#vitrine','tipo:grau','Leitura')+A('#vitrine','tipo:armacao','Armações')+A('#vitrine','tipo:of','Ofertas','dof')+
      '<div class="dch">'+A('#vitrine','gen:f','Feminino')+A('#vitrine','gen:m','Masculino')+A('#vitrine','gen:u','Unissex')+'</div>'+
      /* 09/11 S44 A (aprovado): grupo Ferramentas */'<small class="dgl">'+LFI.tr('Ferramentas')+'</small>'+A('#rosto','','Descubra o seu formato')+'<a href="#" data-gzopen>'+LFI.tr('Descubra o seu grau')+'</a>'+
       '<small class="dgl">Para lojistas</small>'+A('#atacado','','Atacado')+
      '<small class="dgl">Ajuda</small>'+'<a href="#como" data-ajp="duvidas">'+LFI.tr('Dúvidas frequentes')+'</a><a href="#como" data-ajp="dicas">'+LFI.tr('Dicas e cuidados')+'</a>';
    var dl=document.querySelector('#drw .dleg');if(dl)dl.style.display='';
    function conta(){var c=null;try{c=logado()?getConta():null}catch(_){}var n=c&&c.nome?String(c.nome).split(' ')[0]:'';
      $('dacn').textContent=n?LFI.tr('Olá')+', '+n:LFI.tr('Entrar ou criar conta');$('dav').innerHTML=n?esc(n.charAt(0).toUpperCase()):'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>'}
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
    fetch(fnUrl('novidades'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({acao:'inscrever',email:em.trim(),lang:LFI.lang})}).then(function(r){return r.json()}).then(function(j){if(!j||!j.ok)throw 0;V5.nok='Pronto! Você vai receber as novidades por e-mail.';$('hnf').innerHTML=newsForm();cupFn({acao:'bv',email:em.trim(),tel:(getConta()||{}).tel||'',lang:LFI.lang}).then(function(b){if(b&&b.ok&&b.cupom)bvMostra(b.cupom)},function(){})}).catch(function(){toast(LFI.tr('Não consegui inscrever agora. Tente de novo mais tarde.'))})}

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
    fetch(fnUrl('avaliacao')+'?ref='+encodeURIComponent(ref)).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){avalPinta(ref,j&&j.ok?j:{n:0})}).catch(function(){avalPinta(ref,{n:0})})}
  function avalPinta(ref,j){var s=$('prv');if(!s||s.getAttribute('data-ref')!==ref)return;
    var n=j.n||0,dist=j.dist||[0,0,0,0,0];
    s.innerHTML='<div class="rh"><div class="rs"><span class="glb" style="letter-spacing:.14em;font-size:11px;font-weight:700;color:var(--ac)">'+LFI.tr('AVALIAÇÕES')+'</span>'+(n?'<b class="rn">'+String(j.media).replace('.',',')+'</b>'+st5(j.media)+'<div style="color:var(--mu);font-size:13px">'+n+' '+LFI.tr(n===1?'avaliação de quem comprou':'avaliações de quem comprou')+'</div>'+[5,4,3,2,1].map(function(k,i){var pc=n?Math.round(dist[i]/n*100):0;return '<div class="rbar">'+k+'★<u><i style="width:'+pc+'%"></i></u>'+pc+'%</div>'}).join(''):'<p class="rv0" style="margin:8px 0 0">'+LFI.tr('Ainda sem avaliações. Comprou esta peça? Conte o que achou.')+'</p>')+
      '<button type="button" class="rw" data-arw>'+LFI.tr('Escrever avaliação')+'</button></div><div class="rl" id="prvl">'+(j.itens||[]).map(function(a){return '<div class="r"><div class="rt"><span><b>'+esc(a.nome)+'</b>'+(a.cidade?' · '+esc(a.cidade):'')+'</span>'+st5(a.nota)+'</div><div class="vf">✓ '+LFI.tr('Compra verificada')+(a.via==='delivery'?' · delivery':a.via?' · '+LFI.tr('retirou na loja'):'')+'</div>'+(a.txt?'<p>'+esc(a.txt)+'</p>':'')+'</div>'}).join('')+'</div></div>'}
  function avalForm(){
    var s=$('prv');if(!s)return;var ref=s.getAttribute('data-ref');
    if(!logado()){toast(LFI.tr('Entre na sua conta para avaliar.'));try{AUTH_VOLTA=false}catch(_){}cadastrarTela();return}
    var l=$('prvl');l.insertAdjacentHTML('afterbegin','<div class="rv0" id="prvw">'+LFI.tr('Conferindo a sua compra…')+'</div>');
    idTok().then(function(tk){return fetch(fnUrl('avaliacao'),{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tk},body:JSON.stringify({acao:'posso',ref:ref})})}).then(function(r){return r.json()}).then(function(j){
      var w=$('prvw');if(!w)return;
      if(!j||!j.ok){w.textContent=LFI.tr('Não consegui abrir agora. Tente de novo mais tarde.');return}
      if(!j.pode){w.textContent=LFI.tr(j.motivo==='email'?'Confirme o seu e-mail para avaliar.':'Só quem comprou esta peça pela loja pode avaliar.');return}
      V5.an=j.ja?j.ja.nota:5;var c=getConta()||{};
      w.outerHTML='<form id="prvf"><b>'+LFI.tr('Sua avaliação')+'</b><div class="stp">'+[1,2,3,4,5].map(function(k){return '<button type="button" data-arst="'+k+'" class="'+(k<=V5.an?'on':'')+'" aria-label="'+k+'">★</button>'}).join('')+'</div><textarea id="prvt" maxlength="500" placeholder="'+LFI.tr('O que achou da peça? (opcional)')+'">'+esc(j.ja&&j.ja.txt||'')+'</textarea><input type="hidden" id="prvc" value="'+esc(c.cidade||'')+'"><button type="button" class="go" data-arok>'+LFI.tr('Publicar avaliação')+'</button></form>'}).catch(function(){var w=$('prvw');if(w)w.textContent=LFI.tr('Não consegui abrir agora. Tente de novo mais tarde.')})}
  function avalEstrela(k){V5.an=k;document.querySelectorAll('#prvf [data-arst]').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-arst')<=k)})}
  function avalEnvia(){var s=$('prv');if(!s)return;var ref=s.getAttribute('data-ref');
    idTok().then(function(tk){return fetch(fnUrl('avaliacao'),{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tk},body:JSON.stringify({acao:'avaliar',ref:ref,nota:V5.an||5,txt:($('prvt')||{}).value||'',cidade:($('prvc')||{}).value||''})})}).then(function(r){return r.json()}).then(function(j){
      if(!j||!j.ok)throw 0;toast(LFI.tr('Obrigado! Sua avaliação foi publicada.'));avalCarrega(ref)}).catch(function(){toast(LFI.tr('Não consegui publicar agora. Tente de novo mais tarde.'))})}


  /* v452: altura do cabeçalho (a página da peça e a conta abrem logo abaixo dele) */
  (function(){var f=function(){var t=document.querySelector('.top');if(t)document.documentElement.style.setProperty('--hth',Math.round(t.getBoundingClientRect().height)+'px')};f();addEventListener('resize',f);setTimeout(f,800);setTimeout(f,2500)})();
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
    var GL='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
      AA='<svg width="20" height="18" viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 20l6-15 6 15M4.5 14h7M16 20l4-10 4 10M17.5 16.5h5"/></svg>';
    var LG={auto:'Automático',es:'Español',pt:'Português'},ZS=['Normal','Grande','Maior'];
    function lgAt(){try{var v=localStorage.getItem('lf_lang');return v==='es'||v==='pt'?v:'auto'}catch(_){return 'auto'}}
    var d=document.createElement('div');d.className='dset';d.id='dset';nv.insertAdjacentElement('afterend',d);
    function pinta(){d.innerHTML='<button type="button" data-dset="lg">'+GL+'<span>'+LFI.tr('Idioma')+'</span><b>'+LFI.tr(LG[lgAt()])+'</b><i>›</i></button><button type="button" data-dset="zs">'+AA+'<span>'+LFI.tr('Tamanho do texto')+'</span><b>'+LFI.tr(ZS[zi]||'Normal')+'</b><i>›</i></button>'}
    pinta();$('mnb').addEventListener('click',pinta);
    var sh=document.createElement('div');sh.id='dsh';document.body.appendChild(sh);
    function abre(k){var h;if(k==='lg'){var a=lgAt();h='<h4>'+LFI.tr('Idioma')+'</h4>'+['auto','es','pt'].map(function(v){return '<button type="button" class="op" data-lg="'+v+'">'+(v==='auto'?LFI.tr('Automático'):LG[v])+(v===a?'<b>✓</b>':'')+'</button>'}).join('')}
      else h='<h4>'+LFI.tr('Tamanho do texto')+'</h4>'+ZS.map(function(t,i){return '<button type="button" class="op" data-zs="'+i+'" data-dsx>'+LFI.tr(t)+(i===zi?'<b>✓</b>':'')+'</button>'}).join('');
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
  newsForm=function(){if(V5.nok)return '<div class="nok">✓ '+LFI.tr(V5.nok)+'</div>';
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
  /* v453: arrastar para baixo nas folhas (Idioma, Tamanho do texto, Favoritos): a folha acompanha o dedo; passou de 1/3 ou gesto rápido = fecha; senão volta com um leve quique.
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
    else if(a==='endsel'){st.endMode='saved';st.endIdx=+t.getAttribute('data-i')||0;bag(true)}else if(a==='endman'){st.endMode='manual';st.endE='';bag(true);var fe=$('fa2');if(fe)fe.focus()}else if(a==='endsav'){st.endMode='saved';bag(true)}else if(a==='pkcanc'){dlgAbre('<h3>Cancelar este pedido?</h3><p>As peças reservadas voltam para a loja. Se você já pagou, não cancele: fale com um vendedor.</p><p class="dlgerr" id="dlgerr" hidden></p><div class="dlga"><button type="button" class="dc" data-dlgx>Voltar</button><button type="button" class="dk dr" data-cta="pkcanc2">Cancelar pedido</button></div>')}else if(a==='pkcanc2'){pkCancela()}else if(a==='pkcanc3'){pkCancelado(window.__pgid)}else if(a==='prosseguir'){if(Object.keys(st.cart).length){if(!logado()){AUTH_VOLTA=true;cadastrarTela()}else emailOk().then(function(ok){AUTH_VOLTA=true;if(ok){st.step='ent';bag()}else codigoTela()})}}else if(a==='voltarcart'){gdSave();st.step='cart';bag()}else if(a==='entrar')entrarTela(t.getAttribute('data-volta')==='1'||AUTH_VOLTA);
    else if(a==='cadastrar')cadastrarTela();
    else if(a==='esqueci')esqueciTela();
    else if(a==='login')authEntrar();
    else if(a==='criar')authCriar();
    else if(a==='reset')authReset();
    else if(a==='olho'){var pi=t.parentNode.querySelector('input');if(pi){var sh=pi.type==='password';pi.type=sh?'text':'password';t.classList.toggle('on',sh);t.setAttribute('aria-pressed',sh?'true':'false');t.setAttribute('aria-label',sh?'Ocultar senha':'Mostrar senha')}}
    else if(a==='salvar')contaSalvar(t.getAttribute('data-volta')==='1');
    else if(a==='minha')minhaConta();
    else if(a==='google')gEntrar();
    else if(a==='gsync')gSync();
    else if(a==='gunlink')gUnlink(t.getAttribute('data-pw')==='1');else if(a==='gunlink2')gUnlink2(t.getAttribute('data-nopw')==='1');else if(a==='exc')excAbre();else if(a==='exc2')excFaz();
    else if(a==='cont'){if(t.getAttribute('data-volta')==='1')bag();else closeLayer()}
    else if(a==='sair'){authSair();closeLayer();toast('Você saiu da conta.')}
    else if(a==='ped'){var id=t.getAttribute('data-id');var po=$('pkok');if(po)po.remove();closeLayer();pkAbre(id)}
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
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var a=document.querySelector('.cdd.open');if(a){a.classList.remove('open');a.querySelector('.cdl').hidden=true;e.stopPropagation()}}},true);
  document.addEventListener('input',function(e){var t=e.target;
    if(t.id==='cfd'){var nc=$('cfa2').value;maskCampo(t,function(v){return maskDoc(nc,v)})}
    else if(t.id==='cfb')maskCampo(t,maskNasc);
    else if(t.id==='cfz')fnVivo(t,'cfp','cfzh');
    else if(t.id==='gz')fnVivo(t,'gpp','gzh');
    else if(t.id==='cfc'){t.setAttribute('data-ok','');t.setAttribute('data-cpais','');cidMsg('');cfpyUpd()}});
  document.addEventListener('focusout',function(e){if(e.target&&e.target.id==='cfc'&&e.target.value.trim().length>=3)cidConf()});
  document.addEventListener('change',function(e){var t=e.target;
    if(t.id==='cfa2'){cfpyUpd();var n=nacInfo(t.value),fd=$('cfd');$('cfdl').textContent=n.d;fd.placeholder=n.ph;fd.inputMode=NAC[t.value]?'numeric':'text';fd.value=maskDoc(t.value,fd.value);var p=$('cfp');if(p&&!$('cfz').value&&p.value!==t.value&&(!FN||FN[t.value])){cddSet('cfp',t.value)}}
    else if(t.id==='cfp'){var z=$('cfz');z.placeholder=fnEx(t.value);if(z.value&&!/^(\+|00)/.test(z.value.trim()))fnVivo(z,'cfp','cfzh')}else if(t.id==='gpp'){gdSave();var gz=$('gz');if(gz)gz.placeholder=fnEx(t.value);var gl=document.querySelector('label[for=gd]'),gd=$('gd');if(gl&&gd&&gl.firstChild){var n=nacInfo(t.value);gl.firstChild.nodeValue=n.d+' ';gd.placeholder=n.ph;gd.inputMode=NAC[t.value]?'numeric':'text'}}
    else if(t.id==='pgf'&&t.files&&t.files[0]){var id=(lsG('lf_ped',[]).filter(function(x){return x.est==='pagar'||x.est==='recusado'}).slice(-1)[0]||{}).id;if(window.__pgid)id=window.__pgid;if(id)enviarComp(id,t.files[0])}});
  (function(){contaBtn();
    if(TESTE){var z=document.createElement('div');z.id='testeb';z.innerHTML='MODO TESTE · pedidos marcados como teste <button type="button" data-cta="teste0">Sair do teste</button>';document.body.appendChild(z)}})();
  /*/CONTA*/
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
    else if(d.sw!==undefined){var pp=find(d.ref);st.cor[d.ref]=+d.sw;var cnn=document.getElementById('cn');if(cnn)cnn.textContent=corNome(pp,+d.sw);document.querySelectorAll('#layer .cthn').forEach(function(x){x.textContent=corNome(pp,+d.sw)});var bg=t.closest('.modal').querySelector('.big');t.parentNode.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b===t)});t.closest('.modal').querySelectorAll('.cth button').forEach(function(b,k){b.classList.toggle('on',k===+d.sw)});if(pp.lib){var ix=+d.sw;colorFoto(pp,ix,function(u){var im=bg.querySelector('img.pf');if(im&&u&&st.cor[pp.ref]===ix)im.src=u})}else if(!pp.foto){var o=bg.querySelector(':scope>svg');if(o)o.outerHTML=glasses(pp.cores[+d.sw],pp.raio,4.5)}}
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
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var sc=document.querySelector('#layer .scrim');if(sc)e.__lfc=1;
    /* S111: sem nada por cima, o Esc fecha a camada registrada (ex.: consulta) */
    if(!sc&&!$('drw').classList.contains('on')&&!$('sov').classList.contains('on')){var C=window.__lfCam||[];for(var i=C.length-1;i>=0;i--){try{if(C[i].aberta()&&C[i].esc){C[i].esc();return}}catch(_){}}}
    closeLayer()}});
  /* 10/11 S110-1: com o site travado (painel aberto), o dedo ainda rola qualquer área que rola de verdade (antes só .modal/.panel/.dpn/.fpn; a busca ficava presa) */
  function rolaY(t){for(var x=t;x&&x.nodeType===1&&x!==document.body;x=x.parentElement){if(x.scrollHeight>x.clientHeight+1){var oy=getComputedStyle(x).overflowY;if(oy==='auto'||oy==='scroll')return true}}return false}
  document.addEventListener('touchmove',function(e){if(document.documentElement.classList.contains('lock')&&!e.target.closest('.modal,.panel,.dpn,.fpn')&&!rolaY(e.target))e.preventDefault()},{passive:false});
  function setQ(v){st.q=v;$('q').value=v;$('q2').value=v;drawGrid()}
  $('q').addEventListener('input',function(e){setQ(e.target.value)});
  $('q2').addEventListener('input',function(e){setQ(e.target.value)});
  $('sort').addEventListener('change',function(e){st.sort=e.target.value;drawGrid()});
  $('bagbtn').addEventListener('click',function(){st.step='cart';bag()});

  var PAN={vitrine:'Catálogo',rosto:'Seu rosto',atacado:'Atacado',como:'Como comprar',duvidas:'Dúvidas'};
  function closePanels(){document.querySelectorAll('.sec.pop').forEach(function(e){e.classList.remove('pop')});document.documentElement.classList.remove('ppop');try{urlSync()}catch(_){}}
  function openPanel(id,quiet){
    closePanels();var el=document.getElementById(id);if(!el)return;
    if(id==='vitrine'){var ms=document.querySelector('.mobsearch');var vs=$('vscr');if(!vs){vs=document.createElement('div');vs.id='vscr';el.insertBefore(vs,$('grid'));vs.appendChild($('grid'))}if(ms&&ms.parentNode!==vs)vs.insertBefore(ms,vs.firstChild);var rs=$('resultado');if(rs&&matchMedia('(min-width:700px)').matches&&rs.parentNode!==vs)vs.insertBefore(rs,$('grid'));var lh=document.querySelector('.lh');if(lh&&lh.parentNode!==vs)vs.insertBefore(lh,$('grid'));var ft=document.querySelector('footer');if(ft&&ft.parentNode!==vs)vs.appendChild(ft);if(!$('cbl')){var cb=document.createElement('div');cb.id='cbl';cb.hidden=true;ms.parentNode.insertBefore(cb,ms.nextSibling);placeCbl();cotLine()}var ft=$('fty'),fs=$('fso');if(ft&&$('tipos').parentNode!==ft)ft.appendChild($('tipos'));if(fs&&$('sort').parentNode!==fs)fs.appendChild($('sort'));if(!$('pager')){var pg=document.createElement('div');pg.id='pager';el.appendChild(pg)}drawGrid()}
    var ht=document.querySelector('.top');if(ht)document.documentElement.style.setProperty('--ht',ht.offsetHeight+'px');
    document.documentElement.classList.remove('bootp');el.classList.add('in');el.classList.add('pop');el.scrollTop=0;document.documentElement.classList.add('ppop');if(!quiet&&el.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)el.animate([{translate:'0 26px',filter:'opacity(0)'},{translate:'0 0',filter:'opacity(1)'}],{duration:440,easing:'cubic-bezier(.2,.8,.2,1)'});
    try{urlSync()}catch(_){}}
  function prefSync(){var r=document.documentElement,t=r.dataset.theme||'auto',lg='auto';try{var q=localStorage.getItem('lf_lang');if(q==='pt'||q==='es')lg=q}catch(_){}
    document.querySelectorAll('#drw [data-lg]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-lg')===lg)});
    document.querySelectorAll('#drw [data-th]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-th')===t)});
    document.querySelectorAll('#drw [data-zs]').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-zs')===zi)})}
  function fshSet(on){var d=$('fsh');d.classList.toggle('on',on);d.setAttribute('aria-hidden',on?'false':'true')}
  $('fbtn').addEventListener('click',function(){fshSet(true)});
  function vset(l){document.documentElement.classList.toggle('vlist',l);var b=$('vtog');if(b){var t=LFI.tr(l?'Ver como catálogo':'Ver como lista');b.setAttribute('aria-label',t);b.title=t}try{localStorage.setItem('lf_vista',l?'l':'g')}catch(_){}}
  try{if(localStorage.getItem('lf_vista')==='l')vset(true)}catch(_){}
  $('vtog').addEventListener('click',function(){vset(!document.documentElement.classList.contains('vlist'))});
  function dhdAlign(){try{var m=$('mnb').getBoundingClientRect(),h=document.querySelector('#drw .dhd'),x=h&&h.querySelector('.ib'),z=parseFloat(getComputedStyle(document.body).zoom)||1;if(!x||!m.height||m.top<0||m.bottom>160)return;h.style.position='';h.style.top='';h.style.paddingTop='';h.style.flex='none';var r=x.getBoundingClientRect(),dy=(m.top+m.height/2)-(r.top+r.height/2),pt=parseFloat(getComputedStyle(h).paddingTop)||0;if(Math.abs(dy/z)>40)return;h.style.paddingTop=(pt+dy/z)+'px'}catch(_){}}
  function catSet(o,pin){var c=document.querySelector('#drw .cat');if(!c)return;c.classList.toggle('open',o);c.classList.toggle('pin',!!(o&&pin));var b=c.querySelector('.arr');if(b)b.setAttribute('aria-expanded',o?'true':'false')}
  (function(){var c=document.querySelector('#drw .cat'),tm=0;if(!c)return;
    c.addEventListener('mouseenter',function(e){if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;clearTimeout(tm);tm=setTimeout(function(){catSet(true,false)},160)});
    c.addEventListener('mouseleave',function(){clearTimeout(tm);if(c.classList.contains('pin'))return;tm=setTimeout(function(){catSet(false)},320)});
    c.querySelector('.arr').addEventListener('click',function(e){e.stopPropagation();var o=!c.classList.contains('open')||!c.classList.contains('pin');catSet(o,o)})})();
  function drwSet(on){if(on){prefSync();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('#drw nav a,#drw .dpf').forEach(function(a,i){if(a.animate)a.animate([{translate:'-18px 0',opacity:0},{translate:'0 0',opacity:1}],{duration:260,delay:Math.min(i*16,180),easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})})}var d=$('drw');if(on){document.querySelectorAll('#drw nav>a,#drw .cat,#drw .dpf,#drw .dct').forEach(function(a){if(a.getAnimations)a.getAnimations().forEach(function(x){if(x.fill==='forwards'||x.effect&&x.effect.getTiming().fill==='forwards')x.cancel()})})}
    if(!on){if(d.classList.contains('on')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var xs=[].slice.call(document.querySelectorAll('#drw nav>a,#drw nav>.cat,#drw .dpf,#drw .dct'));xs.forEach(function(a,i){if(a.animate)a.animate([{translate:'0 0',opacity:1},{translate:'-16px 0',opacity:0}],{duration:200,delay:0,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'})})}catSet(false)}
    if(on){var hh=document.querySelector('#drw .dhd');if(hh)hh.style.paddingTop='';dhdAlign()}if(on)document.documentElement.classList.add('lock');else if(!$('layer').innerHTML.trim())document.documentElement.classList.remove('lock');d.classList.toggle('on',on);d.setAttribute('aria-hidden',on?'false':'true')}
  $('mnb').addEventListener('click',function(){drwSet(true)});
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-dclose],[data-fclose],[data-pback],[data-th],[data-zs],[data-pg],#drw nav a');if(!t)return;
    if(t.hasAttribute('data-fclose'))fshSet(false);
    else if(t.hasAttribute('data-dclose'))drwSet(false);
    else if(t.hasAttribute('data-pback')){closePanels();try{history.replaceState(null,'',location.pathname+location.search)}catch(_){}}
    else if(t.hasAttribute('data-th')){var v=t.getAttribute('data-th'),rr=document.documentElement;
      var ap=function(){if(v==='auto')delete rr.dataset.theme;else rr.dataset.theme=v;try{if(v==='auto')localStorage.removeItem('lf_theme');else localStorage.setItem('lf_theme',v)}catch(_){}themeIcon(false);prefSync()};
      if(isDark()===(v==='auto'?matchMedia('(prefers-color-scheme: dark)').matches:v==='dark')){ap()}
      else if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        var bt=t.getBoundingClientRect(),cx=bt.left+bt.width/2,cy=bt.top+bt.height/2,R=Math.hypot(Math.max(cx,innerWidth-cx),Math.max(cy,innerHeight-cy)),vt=document.startViewTransition(ap);
        vt.ready.then(function(){rr.animate({clipPath:['circle(0px at '+cx+'px '+cy+'px)','circle('+R+'px at '+cx+'px '+cy+'px)']},{duration:700,easing:'ease-in-out',pseudoElement:'::view-transition-new(root)'})}).catch(function(){})
      }else{rr.classList.add('tt');ap();setTimeout(function(){rr.classList.remove('tt')},700)}}
    else if(t.hasAttribute('data-zs')){zset(+t.getAttribute('data-zs'),false);prefSync()}
    else if(t.hasAttribute('data-pg')){st.pg=(st.pg||0)+parseInt(t.getAttribute('data-pg'),10);drawGrid()}
    else{var mf=t.getAttribute&&t.getAttribute('data-mf');if(mf){var kv=mf.split(':');if(kv[0]==='gen'){st.gen=kv[1];st.tipo='todos'}else{st.tipo=kv[1];st.gen=''}drawGen();drawChips();drawGrid()}drwSet(false)}});
  (function(){var x0=null,y0=0,g=$('grid');if(!g)return;
    g.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
    g.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){}},{passive:true})})();
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){drwSet(false);if(MOBQ.matches&&!e.__lfc&&!document.querySelector('.scrim'))closePanels()}});

  var LOJA={lat:-25.510131,lng:-54.609959};
  function mapClose(){var w=$('mapw');if(!w)return;var d=function(){w.remove();document.removeEventListener('keydown',mapKey)};if(w.animate){w.animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'}).onfinish=d}else d()}
  function mapKey(e){if(e.key==='Escape')mapClose()}
  function openMap(){
    if($('mapw'))return;
    var w=document.createElement('div');w.id='mapw';if(isDark())w.className='dk';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.setAttribute('aria-label','Mapa');
    var q=LOJA.lat+','+LOJA.lng;
    w.innerHTML='<div class="mbox"><button type="button" class="mx" aria-label="Fechar">×</button><div id="mapc"></div><div class="minf"><h3>La Fouch</h3><p>Galeria Jebai Center, 3° piso, torre A, n°2242<br>Ciudad del Este</p><div class="mbt"><a class="p" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=-25.510131,-54.609959">Como chegar</a><a class="s" target="_blank" rel="noopener" href="https://maps.app.goo.gl/zy6c1ZFq4gQhxWXC8">Abrir no Google Maps</a></div></div></div>';
    w.addEventListener('click',function(e){if(e.target===w||e.target.closest('.mx'))mapClose()});
    document.body.appendChild(w);document.addEventListener('keydown',mapKey);
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
        return V.FaceLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:base+'face_landmarker.task',delegate:'CPU'},runningMode:'IMAGE',numFaces:1,outputFacialTransformationMatrixes:true})})
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

  /* texto maior (acessibilidade) */
  var PCZ=matchMedia('(min-width:1100px)').matches,ZL=[LFZ(0),LFZ(1),LFZ(2)],ZN=['Texto normal','Texto grande','Texto muito grande'],zi=0;
  try{var zs=localStorage.getItem('lf_zoom');if(zs!=null)zi=Math.max(0,Math.min(2,+zs||0))}catch(_){}
  function zset(i,say){zi=i;document.documentElement.setAttribute('data-zi',i);document.documentElement.classList.toggle('zl',ZL[i]>1&&!(PCZ&&!i));document.body.style.zoom=ZL[i]==1?'':ZL[i];document.body.style.setProperty('--z',ZL[i]);document.body.style.setProperty('--kz',LFK());try{localStorage.setItem('lf_zoom',i)}catch(_){}if(say)toast(ZN[i]);setTimeout(function(){try{hguPil()}catch(_){}},60)}
  zset(zi,false);
  /* a escala acompanha a largura da tela: ao redimensionar a janela ou girar o aparelho, recalcula */
  (function(){var tm=0;function re(){var n=[LFZ(0),LFZ(1),LFZ(2)];if(Math.abs(n[zi]-ZL[zi])>.02||(matchMedia('(min-width:1100px)').matches!==PCZ)){PCZ=matchMedia('(min-width:1100px)').matches;ZL=n;zset(zi,false)}}
    addEventListener('resize',function(){clearTimeout(tm);tm=setTimeout(re,300)});addEventListener('orientationchange',function(){clearTimeout(tm);tm=setTimeout(re,400)})})();
  $('aa').addEventListener('click',function(){zset((zi+1)%3,true)});
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
      fetch(fnUrl('mensagem'),{method:'POST',headers:{'Content-Type':'application/json'},keepalive:true,body:JSON.stringify({acao:'enviar',tipo:'atacado',cod:st.atCod,pais:LFI.lang==='es'?'Paraguay':'Brasil',qtd:($('aq')||{value:''}).value.trim(),procura:pr,vistos:navVistos().slice(0,20),favs:Object.keys(st.fav).slice(0,20),lang:LFI.lang})}).catch(function(){})}catch(_){}
    setTimeout(function(){st.atCod='';setLoj()},800)},true);
  drawChips();drawCmp();
  /* zoom livre: pinça com dois dedos (aumenta e diminui aos poucos), arrastar, toque e roda do mouse */
  var ZS=2.4,ZMAX=6,ZP={};
  function zImg(b){return b.querySelector(':scope>img,:scope>svg')}
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
    var b=e.target.closest&&e.target.closest('.big[data-zoom]');if(!b||e.target.closest('.dfav')||e.target.closest('.g360')||(e.pointerType==='mouse'&&e.button!==0))return;
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
  var MOON='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>';
  var SUN='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7"/></svg>';
  function isDark(){var r=document.documentElement;return r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
  function themeIcon(anim){var b=$('theme'),d=isDark();b.innerHTML=d?SUN:MOON;b.setAttribute('aria-label',d?'Mudar para o tema claro':'Mudar para o tema escuro');if(anim){b.classList.remove('spin');void b.offsetWidth;b.classList.add('spin')}}
  themeIcon(false);
  try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){themeIcon(false)})}catch(e){}
  $('theme').addEventListener('click',function(ev){
    var r=document.documentElement,next=isDark()?'light':'dark',calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function apply(){r.dataset.theme=next;try{localStorage.setItem('lf_theme',next)}catch(_){}themeIcon(!calm)}
    if(calm){apply();return}
    var bt=$('theme').getBoundingClientRect(),cx=bt.left+bt.width/2,cy=bt.top+bt.height/2,R=Math.hypot(Math.max(cx,innerWidth-cx),Math.max(cy,innerHeight-cy));
    if(document.startViewTransition){
      var vt=document.startViewTransition(apply);
      vt.ready.then(function(){document.documentElement.animate({clipPath:['circle(0px at '+cx+'px '+cy+'px)','circle('+R+'px at '+cx+'px '+cy+'px)']},{duration:700,easing:'ease-in-out',pseudoElement:'::view-transition-new(root)'})}).catch(function(){})
    }else{r.classList.add('tt');apply();setTimeout(function(){r.classList.remove('tt')},700)}
  });

  $('stage').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();$('stage').click()}});
  /* vídeo promocional: vem da configuração do painel; ?video=arquivo.mp4 serve para testar */
  /* sincronização com o painel da loja (Firebase, só leitura pública; se falhar, vale o catálogo embutido) */
  var FB={p:'lafouch-2f6bd',k:'AIzaSyAW-54tS1A_VL2EC9OJWFsw1EtboptpEvc'};
  function fbv(v){if('stringValue' in v)return v.stringValue;if('integerValue' in v)return +v.integerValue;if('doubleValue' in v)return v.doubleValue;if('booleanValue' in v)return v.booleanValue;if('nullValue' in v)return null;if('arrayValue' in v)return (v.arrayValue.values||[]).map(fbv);if('mapValue' in v)return fbd(v.mapValue);return null}
  function fbd(d){var o={},f=d.fields||{};for(var k in f)o[k]=fbv(f[k]);return o}
  function fbg(path){return acFetch('https://firestore.googleapis.com/v1/projects/'+FB.p+'/databases/(default)/documents/'+path+(path.indexOf('?')<0?'?':'&')+'key='+FB.k).then(function(r){if(!r.ok)throw new Error('fb');return r.json()})}
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
      if(!pv){pv=document.createElement('div');pv.id='prvb';pv.innerHTML='<span>Prévia · os clientes ainda não veem</span><button type="button">Pôr no ar</button>';pv.querySelector('button').onclick=function(){try{window.parent.postMessage({lfPorNoAr:1},location.origin)}catch(_){}};document.body.appendChild(pv)}return}
    (ADM||(ADM=isAdm())).then(function(adm){
      if(CFG.ativo!==false)return;m=document.getElementById('manut');ab=document.getElementById('admb');
      if(adm){if(m)m.remove();document.documentElement.style.overflow='';
        if(!ab){ab=document.createElement('div');ab.id='admb';document.body.appendChild(ab)}
        ab.innerHTML='<b>Modo administrador</b><span>O site está desligado para os clientes. Só você vê o catálogo.</span>'+(window.parent!==window?'':'<a href="admin.html">Abrir painel</a>');return}
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
    else{st.insertAdjacentHTML('afterbegin',glasses(p.cor,p.raio,4));var g=st.firstElementChild;g.setAttribute('class','gl')}
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
    var rt=0;document.addEventListener('scroll',function(){var H=document.documentElement;if(naPeca()){H.classList.remove('warol');return}H.classList.add('warol');clearTimeout(rt);rt=setTimeout(function(){cobre();H.classList.remove('warol')},700)/* S239: mede ANTES de soltar o 'rolando' — assim a lingueta abre na bola com a mesma animação suave de quando recolhe (antes a medição cortava a animação) */},true);
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
      if(!p.cores||!p.cores.length)p.cores=[p.cor||'#2a2d33'];if(!p.cor)p.cor=p.cores[0];if(!p.raio&&p.raio!==0)p.raio=14});
    P.length=0;Array.prototype.push.apply(P,L);try{aplicaEst()}catch(_){}
    var has={};P.forEach(function(p){has[p.ref]=1});
    Object.keys(st.cart).forEach(function(k){if(!has[k])delete st.cart[k]});Object.keys(st.fav).forEach(function(k){if(!has[k])delete st.fav[k]});st.cmp=st.cmp.filter(function(k){return has[k]});
    redraw();
    var heroRefs={};String(CFG.slide||'').split(',').concat([CFG.destaque||''],String(CFG.dauto||'').split(',')).forEach(function(r){if(r)heroRefs[r]=1});
    if(CFG.dmodo==='auto'||!Object.keys(heroRefs).length){P.slice().sort(function(a,b){return (b.est||0)-(a.est||0)}).slice(0,4).forEach(function(q){heroRefs[q.ref]=1})}
    fcPronto(function(){var fo=0;P.forEach(function(p){
      if(!(p.fv>0))return;var c=FCM&&FCM[p.ref];
      if(c&&c.v===p.fv&&c.d){p.foto=c.d;fo=1;return}
      var busca=function(){fbg('fotos/'+p.ref).then(function(d){var o=fbd(d);if(!o.d)return;p.foto=o.d;fcSet(p.ref,{v:p.fv,d:o.d});if(heroRefs[p.ref]){setHero()}clearTimeout(syncProds.t);syncProds.t=setTimeout(function(){redraw();setHero()},heroRefs[p.ref]?60:250)}).catch(function(){})};
      /* as fotos do destaque vêm primeiro; o resto do catálogo só depois, para não disputar a rede */
      if(heroRefs[p.ref])busca();else setTimeout(busca,900)});
    if(fo)redraw()})}
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
  function prodVivo(){if(document.hidden)return;
    fbg('config/site').then(function(d){var c=fbd(d)||{},pv=c.pv||0;PVN++;
      if(PV===null)PV=+(CFG&&CFG.pv)||0;
      /* sem o sinal do app (versão antiga), confere os produtos a cada minuto */
      if(pv?pv===PV:PVN%3)return;PV=pv;
      return fbg('produtos?pageSize=300').then(function(j){if(!j||!j.documents)return;var sj=JSON.stringify(j.documents);if(sj===prodVivo.ult)return;prodVivo.ult=sj;try{localStorage.setItem('lf_pdocs',sj)}catch(_){}syncProds(j.documents)})}).catch(function(){})}
  function prodVivoLiga(){if(PVT)return;PVT=setInterval(prodVivo,20000);document.addEventListener('visibilitychange',function(){if(!document.hidden)prodVivo()})}
  function redraw(){drawGen();drawChips();drawFaces();drawGrid();drawBag();setHero()}
  function syncRun(){
    var pp=fbg('produtos?pageSize=300');pp.catch(function(){});
    fbg('config/site').then(function(d){CFG=Object.assign({ativo:true},fbd(d),{_f:1});try{localStorage.setItem('lf_cfg',JSON.stringify(CFG))}catch(_){}manut();applyCot();setHero()},function(){}).then(function(){
      return pp}).then(function(j){if(j&&j.documents){try{prodVivo.ult=JSON.stringify(j.documents);localStorage.setItem('lf_pdocs',prodVivo.ult)}catch(_){}syncProds(j.documents)}}).catch(function(){}).then(function(){var l=document.getElementById('prevld');if(l)l.remove();syncEstoque().then(function(){estLoop();if(prodVivo.ult)favVolta()});prodVivoLiga()})}
  (ADM||(ADM=isAdm())).then(function(a){if(a&&!LF_ADM&&window.parent!==window){LF_ADM=true;document.documentElement.classList.add('adm');redraw()}});
  manut();try{var qv=new URLSearchParams(location.search).get('video');if(qv)setTimeout(function(){var st=$('stage');st.hidden=false;st.setAttribute('data-sig','q');applyVideo(qv)},300)}catch(_){}
  if(!/[?&]nosync/.test(location.search))setTimeout(syncRun,50);
  try{if(/[?&]carrinho=/.test(location.search)){var qb=0,qbt=setInterval(function(){if((P&&P.length)||++qb>50){clearInterval(qbt);baseRestore();bag()}},60)}}catch(_){}
  try{if(/[?&]conta=1/.test(location.search)){var qc=0,qct=setInterval(function(){if((P&&P.length)||++qc>50){clearInterval(qct);baseRestore();minhaConta()}},60)}}catch(_){}
  try{var qr=new URLSearchParams(location.search).get('ref');if(qr){var qn=0,qgo=function(){if(find(qr)){clearInterval(qt);baseRestore();product(qr);return 1}if(++qn>50){clearInterval(qt);document.documentElement.classList.remove('bootprod')}},qt=setInterval(qgo,60);qgo()}}catch(_){}
  try{homeDraw()}catch(_){}
  setTimeout(function(){document.documentElement.classList.add('nr')},3500);

  /* idioma e moeda */
  ['theme','lgb','aa','bagbtn'].forEach(function(i){var e=$(i);if(e&&e.dataset.l)e.dataset.l=LFI.tr(e.dataset.l)});
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
      var bg=getComputedStyle(document.body).backgroundColor,ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:99999;background:'+bg+';opacity:0;transition:opacity .28s ease;pointer-events:all';document.body.appendChild(ov);try{sessionStorage.setItem('lf_fade',bg)}catch(_){}requestAnimationFrame(function(){ov.style.opacity='1'});setTimeout(function(){location.reload()},300)},true)})();
  try{var _cd=PREV?null:JSON.parse(localStorage.getItem('lf_pdocs')||'null');if(_cd&&_cd.length)syncProds(_cd)}catch(_){}
  if(PREV&&!/[?&]nosync/.test(location.search)){var _pl=document.createElement('div');_pl.id='prevld';_pl.setAttribute('role','status');_pl.innerHTML='<i></i><span>Carregando a vitrine atual…</span>';document.body.appendChild(_pl)}
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
  function srSug(q){var f=btolFold(q).trim();SRG=[];if(f.length<2)return '';var C=[],vi={},poe=function(t,a,v){var k=btolFold(t);if(vi[k])return;vi[k]=1;C.push({t:t,a:a,v:v,k:k})};
    [['grau','Leitura'],['solar','Solar'],['armacao','Armações'],['of','Ofertas']].forEach(function(x){poe(LFI.tr(x[1]),'c',x[0])});
    var gs=navGraus(),dg=/[0-9+]/.test(f);if(!dg){var mid=gs.filter(function(g){return navGrN(g)>=1.5&&navGrN(g)<=2.5});gs=(mid.length?mid:gs).slice(0,1)}gs.forEach(function(g){poe(LFI.tr('Leitura')+' '+g,'g',g)});
    cat5().forEach(function(p){if(p.nome)poe(p.nome,'q',p.nome)});
    var ac=function(c){var i=c.k.indexOf(f);if(i<0)return -1;return i===0?0:/[^a-z0-9]/.test(c.k.charAt(i-1))?1:2};
    var L=C.map(function(c){return [c,ac(c)]}).filter(function(x){return x[1]>=0&&x[1]<2}).sort(function(a,b){return a[1]-b[1]||a[0].t.length-b[0].t.length}).slice(0,4).map(function(x){return x[0]});
    if(!L.length)return '';SRG=L;
    return '<div class="srh">'+LFI.tr('SUGESTÕES')+'</div><div class="srs">'+L.map(function(c,i){var j=c.k.indexOf(f),t=c.t;
      var h=t.length===c.k.length?esc(t.slice(0,j))+'<b>'+esc(t.slice(j,j+f.length))+'</b>'+esc(t.slice(j+f.length)):esc(t);
      return '<button type="button" data-ssg="'+i+'">'+h+'</button>'}).join('')+'</div>'}
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
const ARMP=L=>`M0 -10 C${L*.45} -11 ${L-2} -8.5 ${L} -1 C${L+1.5} 5 ${L-4} 9 ${L-9} 8.5 C${L*.45} 8 ${L*.2} 10 0 10 Z`;
const ARMH=L=>`M${L*.35} -5 Q${L*.62} -6.5 ${L*.8} -3.5`,ARMHF=L=>`M${L*.42} -5 Q${L*.66} -6.5 ${L*.84} -3.5`;
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
.mochi .resp{transform-origin:60px 124px;animation:resp 2.6s ease-in-out infinite}
@keyframes resp{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-2.5px) scale(1.012,.988)}}
.mochi .sombra{transform-origin:60px 125px;animation:somb 2.6s ease-in-out infinite}
@keyframes somb{0%,100%{transform:scale(1)}50%{transform:scale(.94)}}
.mochi .pup{transition:transform .35s ease}
.mochi .pis{transform-origin:60px 83px}
.mochi .pis.p{animation:pisca .16s ease-in-out}
@keyframes pisca{50%{transform:scaleY(.08)}}
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
TEMA_M.maes={"corte": "M-40 54 L160 54 L160 200 L-40 200 Z", "tr": "<g><path fill=\"#d7a9b8\" d=\"M129.34 53.00 L129.06 53.95 L128.18 54.91 L127.41 55.46 L126.44 56.01 L125.25 56.55 L124.08 57.01 L123.10 57.35 L122.04 57.69 L120.89 58.02 L119.65 58.35 L118.33 58.68 L117.23 58.93 L116.16 59.16 L115.05 59.38 L113.90 59.61 L112.71 59.82 L111.47 60.04 L110.20 60.24 L108.92 60.44 L107.82 60.60 L106.69 60.76 L105.55 60.92 L104.38 61.07 L103.19 61.21 L101.98 61.36 L100.76 61.49 L99.51 61.63 L98.25 61.76 L97.08 61.87 L95.92 61.98 L94.75 62.09 L93.58 62.19 L92.39 62.28 L91.19 62.38 L89.99 62.47 L88.78 62.55 L87.56 62.64 L86.34 62.71 L85.12 62.79 L83.91 62.86 L82.71 62.92 L81.50 62.98 L80.29 63.04 L79.07 63.09 L77.86 63.15 L76.65 63.19 L75.44 63.24 L74.23 63.28 L73.02 63.31 L71.81 63.35 L70.61 63.38 L69.41 63.40 L68.21 63.43 L67.02 63.45 L65.83 63.46 L64.65 63.48 L63.48 63.49 L62.31 63.49 L61.15 63.50 L60.00 63.50 L58.85 63.50 L57.69 63.49 L56.52 63.49 L55.35 63.48 L54.17 63.46 L52.98 63.45 L51.79 63.43 L50.59 63.40 L49.39 63.38 L48.19 63.35 L46.98 63.31 L45.77 63.28 L44.56 63.24 L43.35 63.19 L42.14 63.15 L40.93 63.09 L39.71 63.04 L38.50 62.98 L37.29 62.92 L36.09 62.86 L34.88 62.79 L33.66 62.71 L32.44 62.64 L31.22 62.55 L30.01 62.47 L28.81 62.38 L27.61 62.28 L26.42 62.19 L25.25 62.09 L24.08 61.98 L22.92 61.87 L21.75 61.76 L20.49 61.63 L19.24 61.49 L18.02 61.36 L16.81 61.21 L15.62 61.07 L14.45 60.92 L13.31 60.76 L12.18 60.60 L11.08 60.44 L9.80 60.24 L8.53 60.04 L7.29 59.82 L6.10 59.61 L4.95 59.38 L3.84 59.16 L2.77 58.93 L1.67 58.68 L0.35 58.35 L-0.89 58.02 L-2.04 57.69 L-3.10 57.35 L-4.08 57.01 L-5.25 56.55 L-6.44 56.01 L-7.41 55.46 L-8.18 54.91 L-9.06 53.95 L-9.34 53.00 L-9.06 52.05 L-8.18 51.09 L-7.41 50.54 L-6.44 49.99 L-5.25 49.45 L-4.08 48.99 L-3.10 48.65 L-2.04 48.31 L-0.89 47.98 L0.35 47.65 L1.67 47.32 L2.77 47.07 L3.84 46.84 L4.95 46.62 L6.10 46.39 L7.29 46.18 L8.53 45.96 L9.80 45.76 L11.08 45.56 L12.18 45.40 L13.31 45.24 L14.45 45.08 L15.62 44.93 L16.81 44.79 L18.02 44.64 L19.24 44.51 L20.49 44.37 L21.75 44.24 L22.92 44.13 L24.08 44.02 L25.25 43.91 L26.42 43.81 L27.61 43.72 L28.81 43.62 L30.01 43.53 L31.22 43.45 L32.44 43.36 L33.66 43.29 L34.88 43.21 L36.09 43.14 L37.29 43.08 L38.50 43.02 L39.71 42.96 L40.93 42.91 L42.14 42.85 L43.35 42.81 L44.56 42.76 L45.77 42.72 L46.98 42.69 L48.19 42.65 L49.39 42.62 L50.59 42.60 L51.79 42.57 L52.98 42.55 L54.17 42.54 L55.35 42.52 L56.52 42.51 L57.69 42.51 L58.85 42.50 L60.00 42.50 L61.15 42.50 L62.31 42.51 L63.48 42.51 L64.65 42.52 L65.83 42.54 L67.02 42.55 L68.21 42.57 L69.41 42.60 L70.61 42.62 L71.81 42.65 L73.02 42.69 L74.23 42.72 L75.44 42.76 L76.65 42.81 L77.86 42.85 L79.07 42.91 L80.29 42.96 L81.50 43.02 L82.71 43.08 L83.91 43.14 L85.12 43.21 L86.34 43.29 L87.56 43.36 L88.78 43.45 L89.99 43.53 L91.19 43.62 L92.39 43.72 L93.58 43.81 L94.75 43.91 L95.92 44.02 L97.08 44.13 L98.25 44.24 L99.51 44.37 L100.76 44.51 L101.98 44.64 L103.19 44.79 L104.38 44.93 L105.55 45.08 L106.69 45.24 L107.82 45.40 L108.92 45.56 L110.20 45.76 L111.47 45.96 L112.71 46.18 L113.90 46.39 L115.05 46.62 L116.16 46.84 L117.23 47.07 L118.33 47.32 L119.65 47.65 L120.89 47.98 L122.04 48.31 L123.10 48.65 L124.08 48.99 L125.25 49.45 L126.44 49.99 L127.41 50.54 L128.18 51.09 L129.06 52.05 L129.34 53.00Z\"></path><path fill=\"#c18fa1\" d=\"M119.51 52.60 L119.21 53.37 L118.38 54.07 L117.66 54.48 L116.75 54.89 L115.64 55.30 L114.74 55.58 L113.87 55.83 L112.92 56.08 L111.91 56.32 L110.82 56.56 L109.70 56.78 L108.81 56.95 L107.88 57.11 L106.92 57.28 L105.92 57.43 L104.89 57.59 L103.82 57.74 L102.73 57.89 L101.69 58.02 L100.74 58.14 L99.78 58.25 L98.79 58.36 L97.79 58.47 L96.77 58.58 L95.74 58.68 L94.69 58.78 L93.62 58.87 L92.55 58.96 L91.57 59.04 L90.58 59.12 L89.58 59.19 L88.58 59.27 L87.57 59.34 L86.55 59.40 L85.52 59.47 L84.49 59.53 L83.45 59.59 L82.40 59.64 L81.37 59.69 L80.35 59.74 L79.32 59.79 L78.29 59.83 L77.26 59.87 L76.23 59.91 L75.20 59.95 L74.16 59.98 L73.13 60.01 L72.10 60.04 L71.07 60.07 L70.05 60.09 L69.02 60.11 L68.00 60.13 L66.99 60.15 L65.97 60.16 L64.96 60.17 L63.96 60.18 L62.96 60.19 L61.97 60.20 L60.98 60.20 L60.00 60.20 L59.02 60.20 L58.03 60.20 L57.04 60.19 L56.04 60.18 L55.04 60.17 L54.03 60.16 L53.01 60.15 L52.00 60.13 L50.98 60.11 L49.95 60.09 L48.93 60.07 L47.90 60.04 L46.87 60.01 L45.84 59.98 L44.80 59.95 L43.77 59.91 L42.74 59.87 L41.71 59.83 L40.68 59.79 L39.65 59.74 L38.63 59.69 L37.60 59.64 L36.55 59.59 L35.51 59.53 L34.48 59.47 L33.45 59.40 L32.43 59.34 L31.42 59.27 L30.42 59.19 L29.42 59.12 L28.43 59.04 L27.45 58.96 L26.38 58.87 L25.31 58.78 L24.26 58.68 L23.23 58.58 L22.21 58.47 L21.21 58.36 L20.22 58.25 L19.26 58.14 L18.31 58.02 L17.27 57.89 L16.18 57.74 L15.11 57.59 L14.08 57.43 L13.08 57.28 L12.12 57.11 L11.19 56.95 L10.30 56.78 L9.18 56.56 L8.09 56.32 L7.08 56.08 L6.13 55.83 L5.26 55.58 L4.36 55.30 L3.25 54.89 L2.34 54.48 L1.62 54.07 L0.79 53.37 L0.49 52.60 L0.79 51.83 L1.62 51.13 L2.34 50.72 L3.25 50.31 L4.36 49.90 L5.26 49.62 L6.13 49.37 L7.08 49.12 L8.09 48.88 L9.18 48.64 L10.30 48.42 L11.19 48.25 L12.12 48.09 L13.08 47.92 L14.08 47.77 L15.11 47.61 L16.18 47.46 L17.27 47.31 L18.31 47.18 L19.26 47.06 L20.22 46.95 L21.21 46.84 L22.21 46.73 L23.23 46.62 L24.26 46.52 L25.31 46.42 L26.38 46.33 L27.45 46.24 L28.43 46.16 L29.42 46.08 L30.42 46.01 L31.42 45.93 L32.43 45.86 L33.45 45.80 L34.48 45.73 L35.51 45.67 L36.55 45.61 L37.60 45.56 L38.63 45.51 L39.65 45.46 L40.68 45.41 L41.71 45.37 L42.74 45.33 L43.77 45.29 L44.80 45.25 L45.84 45.22 L46.87 45.19 L47.90 45.16 L48.93 45.13 L49.95 45.11 L50.98 45.09 L52.00 45.07 L53.01 45.05 L54.03 45.04 L55.04 45.03 L56.04 45.02 L57.04 45.01 L58.03 45.00 L59.02 45.00 L60.00 45.00 L60.98 45.00 L61.97 45.00 L62.96 45.01 L63.96 45.02 L64.96 45.03 L65.97 45.04 L66.99 45.05 L68.00 45.07 L69.02 45.09 L70.05 45.11 L71.07 45.13 L72.10 45.16 L73.13 45.19 L74.16 45.22 L75.20 45.25 L76.23 45.29 L77.26 45.33 L78.29 45.37 L79.32 45.41 L80.35 45.46 L81.37 45.51 L82.40 45.56 L83.45 45.61 L84.49 45.67 L85.52 45.73 L86.55 45.80 L87.57 45.86 L88.58 45.93 L89.58 46.01 L90.58 46.08 L91.57 46.16 L92.55 46.24 L93.62 46.33 L94.69 46.42 L95.74 46.52 L96.77 46.62 L97.79 46.73 L98.79 46.84 L99.78 46.95 L100.74 47.06 L101.69 47.18 L102.73 47.31 L103.82 47.46 L104.89 47.61 L105.92 47.77 L106.92 47.92 L107.88 48.09 L108.81 48.25 L109.70 48.42 L110.82 48.64 L111.91 48.88 L112.92 49.12 L113.87 49.37 L114.74 49.62 L115.64 49.90 L116.75 50.31 L117.66 50.72 L118.38 51.13 L119.21 51.83 L119.51 52.60Z\"></path></g>", "fr": "<g><defs><linearGradient id=\"lftcat\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#c9608d\"></stop><stop offset=\".5\" stop-color=\"#8d3a69\"></stop><stop offset=\"1\" stop-color=\"#b24c78\"></stop></linearGradient><radialGradient id=\"lftrose\" cx=\"45%\" cy=\"40%\" r=\"65%\"><stop offset=\"0\" stop-color=\"#ffd3df\"></stop><stop offset=\".6\" stop-color=\"#f29ab5\"></stop><stop offset=\"1\" stop-color=\"#d9668e\"></stop></radialGradient><linearGradient id=\"lfthat\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#e7c1cd\"></stop><stop offset=\".38\" stop-color=\"#f6dfe6\"></stop><stop offset=\".75\" stop-color=\"#ebc8d3\"></stop><stop offset=\"1\" stop-color=\"#d9aab9\"></stop></linearGradient></defs><path fill=\"url(#lfthat)\" d=\"M-9.34 53.00 L-9.02 54.02 L-8.27 54.85 L-7.34 55.51 L-6.33 56.07 L-5.28 56.55 L-4.20 56.98 L-3.10 57.36 L-1.99 57.71 L-0.86 58.03 L0.27 58.34 L1.40 58.62 L2.54 58.88 L3.69 59.13 L4.84 59.36 L5.99 59.59 L7.14 59.80 L8.30 60.00 L9.46 60.19 L10.62 60.37 L11.78 60.55 L12.94 60.71 L14.11 60.87 L15.27 61.02 L16.44 61.17 L17.61 61.31 L18.78 61.44 L19.94 61.57 L21.11 61.69 L22.28 61.81 L23.45 61.93 L24.63 62.03 L25.80 62.14 L26.97 62.23 L28.14 62.33 L29.32 62.42 L30.49 62.50 L31.66 62.59 L32.84 62.66 L34.01 62.74 L35.19 62.81 L36.36 62.87 L37.54 62.94 L38.71 63.00 L39.89 63.05 L41.06 63.10 L42.24 63.15 L43.41 63.20 L44.59 63.24 L45.77 63.28 L46.94 63.31 L48.12 63.35 L49.30 63.38 L50.47 63.40 L51.65 63.42 L52.83 63.44 L54.00 63.46 L55.18 63.47 L56.36 63.49 L57.54 63.49 L58.71 63.50 L59.89 63.50 L61.07 63.50 L62.24 63.49 L63.42 63.49 L64.60 63.48 L65.78 63.46 L66.95 63.45 L68.13 63.43 L69.31 63.41 L70.48 63.38 L71.66 63.35 L72.84 63.32 L74.01 63.29 L75.19 63.25 L76.37 63.21 L77.54 63.16 L78.72 63.11 L79.89 63.06 L81.07 63.01 L82.24 62.95 L83.42 62.89 L84.60 62.82 L85.77 62.75 L86.94 62.68 L88.12 62.60 L89.29 62.52 L90.47 62.43 L91.64 62.35 L92.81 62.25 L93.98 62.15 L95.16 62.05 L96.33 61.95 L97.50 61.83 L98.67 61.72 L99.84 61.60 L101.01 61.47 L102.17 61.34 L103.34 61.20 L104.51 61.05 L105.67 60.90 L106.84 60.74 L108.00 60.58 L109.16 60.40 L110.32 60.22 L111.48 60.03 L112.64 59.84 L113.79 59.63 L114.95 59.41 L116.10 59.17 L117.24 58.93 L118.38 58.67 L119.52 58.39 L120.65 58.09 L121.78 57.77 L122.89 57.43 L124.00 57.05 L125.08 56.63 L126.14 56.16 L127.16 55.62 L128.11 54.98 L128.90 54.19 L129.33 53.20 L128.38 53.00 L127.21 53.00 L126.03 53.00 L124.85 53.00 L123.68 53.00 L122.50 53.00 L121.32 53.00 L120.14 53.00 L118.97 53.00 L117.79 53.00 L116.61 53.00 L115.44 53.00 L114.26 53.00 L113.08 53.00 L111.90 53.00 L110.73 53.00 L109.55 53.00 L108.37 53.00 L107.20 53.00 L106.02 53.00 L104.84 53.00 L103.66 53.00 L102.49 53.00 L101.31 53.00 L100.13 53.00 L98.96 53.00 L97.78 53.00 L96.60 53.00 L95.42 53.00 L94.25 53.00 L93.07 53.00 L91.89 53.00 L90.72 53.00 L89.54 53.00 L88.36 53.00 L87.18 53.00 L86.01 53.00 L84.83 53.00 L83.65 53.00 L82.48 53.00 L81.30 53.00 L80.12 53.00 L78.94 53.00 L77.77 53.00 L76.59 53.00 L75.41 53.00 L74.24 53.00 L73.06 53.00 L71.88 53.00 L70.70 53.00 L69.53 53.00 L68.35 53.00 L67.17 53.00 L66.00 53.00 L64.82 53.00 L63.64 53.00 L62.46 53.00 L61.29 53.00 L60.11 53.00 L58.93 53.00 L57.76 53.00 L56.58 53.00 L55.40 53.00 L54.22 53.00 L53.05 53.00 L51.87 53.00 L50.69 53.00 L49.52 53.00 L48.34 53.00 L47.16 53.00 L45.98 53.00 L44.81 53.00 L43.63 53.00 L42.45 53.00 L41.28 53.00 L40.10 53.00 L38.92 53.00 L37.74 53.00 L36.57 53.00 L35.39 53.00 L34.21 53.00 L33.04 53.00 L31.86 53.00 L30.68 53.00 L29.50 53.00 L28.33 53.00 L27.15 53.00 L25.97 53.00 L24.80 53.00 L23.62 53.00 L22.44 53.00 L21.26 53.00 L20.09 53.00 L18.91 53.00 L17.73 53.00 L16.56 53.00 L15.38 53.00 L14.20 53.00 L13.02 53.00 L11.85 53.00 L10.67 53.00 L9.49 53.00 L8.32 53.00 L7.14 53.00 L5.96 53.00 L4.78 53.00 L3.61 53.00 L2.43 53.00 L1.25 53.00 L0.08 53.00 L-1.10 53.00 L-2.28 53.00 L-3.46 53.00 L-4.63 53.00 L-5.81 53.00 L-6.99 53.00 L-8.16 53.00 L-9.34 53.00Z\"></path><path stroke=\"#c995a7\" stroke-width=\".9\" fill=\"none\" opacity=\".8\" d=\"M-8.25 53.60 L-7.69 53.74 L-7.14 53.87 L-6.58 54.01 L-6.03 54.14 L-5.47 54.28 L-4.91 54.41 L-4.35 54.54 L-3.80 54.67 L-3.24 54.80 L-2.68 54.93 L-2.12 55.06 L-1.56 55.18 L-1.00 55.31 L-0.44 55.43 L0.12 55.56 L0.68 55.68 L1.24 55.80 L1.80 55.92 L2.36 56.04 L2.92 56.15 L3.48 56.27 L4.04 56.39 L4.61 56.50 L5.17 56.61 L5.73 56.73 L6.29 56.84 L6.86 56.95 L7.42 57.05 L7.98 57.16 L8.55 57.27 L9.11 57.37 L9.67 57.48 L10.24 57.58 L10.80 57.68 L11.37 57.78 L11.93 57.88 L12.50 57.98 L13.07 58.08 L13.63 58.18 L14.20 58.27 L14.76 58.37 L15.33 58.46 L15.90 58.55 L16.47 58.64 L17.03 58.73 L17.60 58.82 L18.17 58.91 L18.74 58.99 L19.30 59.08 L19.87 59.16 L20.44 59.24 L21.01 59.33 L21.58 59.41 L22.15 59.49 L22.72 59.56 L23.29 59.64 L23.86 59.72 L24.43 59.79 L25.00 59.86 L25.57 59.94 L26.14 60.01 L26.71 60.08 L27.28 60.15 L27.85 60.21 L28.42 60.28 L28.99 60.35 L29.56 60.41 L30.13 60.47 L30.71 60.53 L31.28 60.59 L31.85 60.65 L32.42 60.71 L32.99 60.77 L33.57 60.82 L34.14 60.88 L34.71 60.93 L35.29 60.99 L35.86 61.04 L36.43 61.09 L37.00 61.14 L37.58 61.18 L38.15 61.23 L38.73 61.27 L39.30 61.32 L39.87 61.36 L40.45 61.40 L41.02 61.44 L41.59 61.48 L42.17 61.52 L42.74 61.56 L43.32 61.59 L43.89 61.63 L44.47 61.66 L45.04 61.69 L45.62 61.72 L46.19 61.75 L46.77 61.78 L47.34 61.81 L47.92 61.83 L48.49 61.86 L49.07 61.88 L49.64 61.90 L50.22 61.93 L50.79 61.95 L51.37 61.96 L51.94 61.98 L52.52 62.00 L53.09 62.01 L53.67 62.03 L54.24 62.04 L54.82 62.05 L55.39 62.06 L55.97 62.07 L56.55 62.08 L57.12 62.08 L57.70 62.09 L58.27 62.09 L58.85 62.10 L59.42 62.10 L60.00 62.10 L60.58 62.10 L61.15 62.10 L61.73 62.09 L62.30 62.09 L62.88 62.08 L63.45 62.08 L64.03 62.07 L64.61 62.06 L65.18 62.05 L65.76 62.04 L66.33 62.03 L66.91 62.01 L67.48 62.00 L68.06 61.98 L68.63 61.96 L69.21 61.95 L69.78 61.93 L70.36 61.90 L70.93 61.88 L71.51 61.86 L72.08 61.83 L72.66 61.81 L73.23 61.78 L73.81 61.75 L74.38 61.72 L74.96 61.69 L75.53 61.66 L76.11 61.63 L76.68 61.59 L77.26 61.56 L77.83 61.52 L78.41 61.48 L78.98 61.44 L79.55 61.40 L80.13 61.36 L80.70 61.32 L81.27 61.27 L81.85 61.23 L82.42 61.18 L83.00 61.14 L83.57 61.09 L84.14 61.04 L84.71 60.99 L85.29 60.93 L85.86 60.88 L86.43 60.82 L87.01 60.77 L87.58 60.71 L88.15 60.65 L88.72 60.59 L89.29 60.53 L89.87 60.47 L90.44 60.41 L91.01 60.35 L91.58 60.28 L92.15 60.21 L92.72 60.15 L93.29 60.08 L93.86 60.01 L94.43 59.94 L95.00 59.86 L95.57 59.79 L96.14 59.72 L96.71 59.64 L97.28 59.56 L97.85 59.49 L98.42 59.41 L98.99 59.33 L99.56 59.24 L100.13 59.16 L100.70 59.08 L101.26 58.99 L101.83 58.91 L102.40 58.82 L102.97 58.73 L103.53 58.64 L104.10 58.55 L104.67 58.46 L105.24 58.37 L105.80 58.27 L106.37 58.18 L106.93 58.08 L107.50 57.98 L108.07 57.88 L108.63 57.78 L109.20 57.68 L109.76 57.58 L110.33 57.48 L110.89 57.37 L111.45 57.27 L112.02 57.16 L112.58 57.05 L113.14 56.95 L113.71 56.84 L114.27 56.73 L114.83 56.61 L115.39 56.50 L115.96 56.39 L116.52 56.27 L117.08 56.15 L117.64 56.04 L118.20 55.92 L118.76 55.80 L119.32 55.68 L119.88 55.56 L120.44 55.43 L121.00 55.31 L121.56 55.18 L122.12 55.06 L122.68 54.93 L123.24 54.80 L123.80 54.67 L124.35 54.54 L124.91 54.41 L125.47 54.28 L126.03 54.14 L126.58 54.01 L127.14 53.87 L127.69 53.74 L128.25 53.60\"></path><clipPath id=\"lftmc\"><path d=\"M18.99 54.00 L18.95 53.22 L18.92 52.44 L18.92 51.65 L18.94 50.87 L18.98 50.09 L19.08 49.31 L19.20 48.53 L19.35 47.76 L19.53 46.99 L19.73 46.22 L19.95 45.46 L20.20 44.70 L20.47 43.95 L20.77 43.21 L21.09 42.48 L21.43 41.75 L21.80 41.04 L22.20 40.34 L22.61 39.65 L23.05 38.97 L23.51 38.30 L23.99 37.65 L24.50 37.01 L25.02 36.39 L25.56 35.78 L26.12 35.19 L26.70 34.61 L27.30 34.05 L27.91 33.51 L28.54 32.98 L29.18 32.47 L29.83 31.98 L30.50 31.50 L31.18 31.04 L31.87 30.60 L32.57 30.17 L33.28 29.76 L34.00 29.37 L34.73 28.99 L35.47 28.63 L36.21 28.29 L36.96 27.96 L37.72 27.64 L38.48 27.34 L39.25 27.06 L40.02 26.79 L40.80 26.53 L41.58 26.29 L42.37 26.06 L43.15 25.84 L43.95 25.64 L44.74 25.45 L45.54 25.27 L46.34 25.10 L47.14 24.95 L47.94 24.81 L48.75 24.67 L49.56 24.55 L50.36 24.44 L51.17 24.34 L51.98 24.25 L52.79 24.17 L53.61 24.09 L54.42 24.03 L55.23 23.98 L56.04 23.94 L56.86 23.90 L57.67 23.87 L58.49 23.85 L59.30 23.84 L60.12 23.84 L60.93 23.85 L61.74 23.86 L62.56 23.88 L63.37 23.91 L64.19 23.95 L65.00 23.99 L65.81 24.05 L66.62 24.11 L67.44 24.19 L68.25 24.27 L69.06 24.37 L69.87 24.47 L70.67 24.58 L71.48 24.71 L72.28 24.85 L73.09 24.99 L73.89 25.15 L74.69 25.32 L75.48 25.50 L76.28 25.70 L77.07 25.90 L77.86 26.12 L78.64 26.36 L79.42 26.60 L80.20 26.86 L80.97 27.14 L81.74 27.43 L82.50 27.73 L83.25 28.05 L84.00 28.38 L84.74 28.73 L85.48 29.10 L86.20 29.48 L86.92 29.88 L87.63 30.29 L88.33 30.72 L89.02 31.17 L89.69 31.63 L90.36 32.11 L91.01 32.61 L91.64 33.13 L92.27 33.66 L92.87 34.21 L93.46 34.77 L94.04 35.35 L94.59 35.95 L95.13 36.56 L95.65 37.19 L96.15 37.83 L96.62 38.49 L97.08 39.16 L97.51 39.84 L97.92 40.54 L98.30 41.24 L98.67 41.96 L99.01 42.69 L99.32 43.42 L99.61 44.16 L99.88 44.92 L100.12 45.67 L100.33 46.44 L100.52 47.21 L100.69 47.98 L100.83 48.75 L100.95 49.53 L101.03 50.31 L101.07 51.09 L101.08 51.88 L101.07 52.66 L101.04 53.44 L100.77 54.04 L99.94 54.16 L99.12 54.28 L98.29 54.40 L97.46 54.52 L96.63 54.63 L95.80 54.74 L94.97 54.85 L94.14 54.96 L93.31 55.06 L92.48 55.16 L91.65 55.26 L90.81 55.36 L89.98 55.45 L89.15 55.54 L88.32 55.63 L87.48 55.72 L86.65 55.80 L85.82 55.88 L84.98 55.96 L84.15 56.04 L83.32 56.11 L82.48 56.18 L81.65 56.25 L80.81 56.32 L79.97 56.38 L79.14 56.44 L78.30 56.50 L77.47 56.55 L76.63 56.61 L75.80 56.66 L74.96 56.70 L74.12 56.75 L73.28 56.79 L72.45 56.83 L71.61 56.87 L70.77 56.90 L69.94 56.94 L69.10 56.97 L68.26 56.99 L67.42 57.02 L66.59 57.04 L65.75 57.06 L64.91 57.08 L64.07 57.09 L63.23 57.10 L62.40 57.11 L61.56 57.12 L60.72 57.12 L59.88 57.12 L59.04 57.12 L58.21 57.11 L57.37 57.11 L56.53 57.10 L55.69 57.09 L54.85 57.07 L54.01 57.05 L53.18 57.03 L52.34 57.01 L51.50 56.99 L50.66 56.96 L49.83 56.93 L48.99 56.89 L48.15 56.86 L47.31 56.82 L46.48 56.78 L45.64 56.74 L44.80 56.69 L43.97 56.64 L43.13 56.59 L42.30 56.54 L41.46 56.48 L40.62 56.42 L39.79 56.36 L38.95 56.30 L38.12 56.23 L37.28 56.16 L36.45 56.09 L35.61 56.02 L34.78 55.94 L33.95 55.86 L33.11 55.78 L32.28 55.69 L31.45 55.61 L30.61 55.52 L29.78 55.43 L28.95 55.33 L28.12 55.23 L27.29 55.13 L26.46 55.03 L25.63 54.93 L24.79 54.82 L23.97 54.71 L23.14 54.60 L22.31 54.48 L21.48 54.37 L20.65 54.25 L19.82 54.12 L18.99 54.00Z\"></path></clipPath><path fill=\"url(#lfthat)\" d=\"M18.99 54.00 L18.95 53.22 L18.92 52.44 L18.92 51.65 L18.94 50.87 L18.98 50.09 L19.08 49.31 L19.20 48.53 L19.35 47.76 L19.53 46.99 L19.73 46.22 L19.95 45.46 L20.20 44.70 L20.47 43.95 L20.77 43.21 L21.09 42.48 L21.43 41.75 L21.80 41.04 L22.20 40.34 L22.61 39.65 L23.05 38.97 L23.51 38.30 L23.99 37.65 L24.50 37.01 L25.02 36.39 L25.56 35.78 L26.12 35.19 L26.70 34.61 L27.30 34.05 L27.91 33.51 L28.54 32.98 L29.18 32.47 L29.83 31.98 L30.50 31.50 L31.18 31.04 L31.87 30.60 L32.57 30.17 L33.28 29.76 L34.00 29.37 L34.73 28.99 L35.47 28.63 L36.21 28.29 L36.96 27.96 L37.72 27.64 L38.48 27.34 L39.25 27.06 L40.02 26.79 L40.80 26.53 L41.58 26.29 L42.37 26.06 L43.15 25.84 L43.95 25.64 L44.74 25.45 L45.54 25.27 L46.34 25.10 L47.14 24.95 L47.94 24.81 L48.75 24.67 L49.56 24.55 L50.36 24.44 L51.17 24.34 L51.98 24.25 L52.79 24.17 L53.61 24.09 L54.42 24.03 L55.23 23.98 L56.04 23.94 L56.86 23.90 L57.67 23.87 L58.49 23.85 L59.30 23.84 L60.12 23.84 L60.93 23.85 L61.74 23.86 L62.56 23.88 L63.37 23.91 L64.19 23.95 L65.00 23.99 L65.81 24.05 L66.62 24.11 L67.44 24.19 L68.25 24.27 L69.06 24.37 L69.87 24.47 L70.67 24.58 L71.48 24.71 L72.28 24.85 L73.09 24.99 L73.89 25.15 L74.69 25.32 L75.48 25.50 L76.28 25.70 L77.07 25.90 L77.86 26.12 L78.64 26.36 L79.42 26.60 L80.20 26.86 L80.97 27.14 L81.74 27.43 L82.50 27.73 L83.25 28.05 L84.00 28.38 L84.74 28.73 L85.48 29.10 L86.20 29.48 L86.92 29.88 L87.63 30.29 L88.33 30.72 L89.02 31.17 L89.69 31.63 L90.36 32.11 L91.01 32.61 L91.64 33.13 L92.27 33.66 L92.87 34.21 L93.46 34.77 L94.04 35.35 L94.59 35.95 L95.13 36.56 L95.65 37.19 L96.15 37.83 L96.62 38.49 L97.08 39.16 L97.51 39.84 L97.92 40.54 L98.30 41.24 L98.67 41.96 L99.01 42.69 L99.32 43.42 L99.61 44.16 L99.88 44.92 L100.12 45.67 L100.33 46.44 L100.52 47.21 L100.69 47.98 L100.83 48.75 L100.95 49.53 L101.03 50.31 L101.07 51.09 L101.08 51.88 L101.07 52.66 L101.04 53.44 L100.77 54.04 L99.94 54.16 L99.12 54.28 L98.29 54.40 L97.46 54.52 L96.63 54.63 L95.80 54.74 L94.97 54.85 L94.14 54.96 L93.31 55.06 L92.48 55.16 L91.65 55.26 L90.81 55.36 L89.98 55.45 L89.15 55.54 L88.32 55.63 L87.48 55.72 L86.65 55.80 L85.82 55.88 L84.98 55.96 L84.15 56.04 L83.32 56.11 L82.48 56.18 L81.65 56.25 L80.81 56.32 L79.97 56.38 L79.14 56.44 L78.30 56.50 L77.47 56.55 L76.63 56.61 L75.80 56.66 L74.96 56.70 L74.12 56.75 L73.28 56.79 L72.45 56.83 L71.61 56.87 L70.77 56.90 L69.94 56.94 L69.10 56.97 L68.26 56.99 L67.42 57.02 L66.59 57.04 L65.75 57.06 L64.91 57.08 L64.07 57.09 L63.23 57.10 L62.40 57.11 L61.56 57.12 L60.72 57.12 L59.88 57.12 L59.04 57.12 L58.21 57.11 L57.37 57.11 L56.53 57.10 L55.69 57.09 L54.85 57.07 L54.01 57.05 L53.18 57.03 L52.34 57.01 L51.50 56.99 L50.66 56.96 L49.83 56.93 L48.99 56.89 L48.15 56.86 L47.31 56.82 L46.48 56.78 L45.64 56.74 L44.80 56.69 L43.97 56.64 L43.13 56.59 L42.30 56.54 L41.46 56.48 L40.62 56.42 L39.79 56.36 L38.95 56.30 L38.12 56.23 L37.28 56.16 L36.45 56.09 L35.61 56.02 L34.78 55.94 L33.95 55.86 L33.11 55.78 L32.28 55.69 L31.45 55.61 L30.61 55.52 L29.78 55.43 L28.95 55.33 L28.12 55.23 L27.29 55.13 L26.46 55.03 L25.63 54.93 L24.79 54.82 L23.97 54.71 L23.14 54.60 L22.31 54.48 L21.48 54.37 L20.65 54.25 L19.82 54.12 L18.99 54.00Z\"></path><path stroke=\"#fff\" stroke-width=\"2.2\" opacity=\".55\" fill=\"none\" stroke-linecap=\"round\" d=\"M29.34 38.00 L29.54 37.72 L29.75 37.45 L29.96 37.17 L30.17 36.90 L30.39 36.63 L30.60 36.37 L30.82 36.10 L31.05 35.84 L31.27 35.58 L31.50 35.32 L31.74 35.06 L31.97 34.81 L32.21 34.56 L32.45 34.31 L32.69 34.06 L32.94 33.82 L33.19 33.58 L33.44 33.34 L33.70 33.11 L33.96 32.87 L34.22 32.64 L34.48 32.42 L34.75 32.20 L35.01 31.98 L35.29 31.76 L35.56 31.55 L35.84 31.34 L36.12 31.13 L36.40 30.93 L36.68 30.73 L36.97 30.53 L37.26 30.34 L37.55 30.15 L37.85 29.96 L38.14 29.78 L38.44 29.60 L38.74 29.43 L39.05 29.26 L39.35 29.09 L39.66 28.93 L39.97 28.77 L40.28 28.61 L40.59 28.46 L40.91 28.31 L41.22 28.17 L41.54 28.03 L41.86 27.89 L42.19 27.76 L42.51 27.63 L42.83 27.50 L43.16 27.38 L43.49 27.27 L43.82 27.15 L44.15 27.04 L44.48 26.94 L44.81 26.84 L45.15 26.74 L45.48 26.64 L45.82 26.55 L46.16 26.47 L46.49 26.39 L46.83 26.31 L47.17 26.23 L47.51 26.16 L47.85 26.09 L48.20 26.02 L48.54 25.96 L48.88 25.91 L49.22 25.85 L49.57 25.80\"></path><g clip-path=\"url(#lftmc)\"><path fill=\"#8d3a69\" d=\"M-3.87 44.20 L-2.60 44.37 L-1.33 44.53 L-0.05 44.69 L1.22 44.85 L2.50 45.00 L3.78 45.15 L5.05 45.30 L6.33 45.44 L7.61 45.58 L8.90 45.72 L10.18 45.85 L11.46 45.98 L12.74 46.11 L14.03 46.23 L15.32 46.35 L16.60 46.47 L17.89 46.58 L19.18 46.69 L20.47 46.80 L21.76 46.90 L23.05 47.00 L24.34 47.10 L25.63 47.19 L26.92 47.28 L28.22 47.37 L29.51 47.45 L30.80 47.53 L32.10 47.60 L33.39 47.68 L34.69 47.75 L35.99 47.81 L37.28 47.87 L38.58 47.93 L39.88 47.99 L41.18 48.04 L42.48 48.09 L43.78 48.13 L45.07 48.17 L46.37 48.21 L47.67 48.24 L48.97 48.28 L50.27 48.30 L51.57 48.33 L52.87 48.35 L54.18 48.37 L55.48 48.38 L56.78 48.39 L58.08 48.40 L59.38 48.40 L60.68 48.40 L61.98 48.40 L63.28 48.39 L64.58 48.38 L65.88 48.36 L67.18 48.35 L68.48 48.33 L69.79 48.30 L71.09 48.27 L72.39 48.24 L73.69 48.21 L74.98 48.17 L76.28 48.13 L77.58 48.08 L78.88 48.04 L80.18 47.98 L81.48 47.93 L82.77 47.87 L84.07 47.81 L85.37 47.74 L86.66 47.67 L87.96 47.60 L89.25 47.53 L90.55 47.45 L91.84 47.36 L93.14 47.28 L94.43 47.19 L95.72 47.09 L97.01 47.00 L98.30 46.90 L99.59 46.79 L100.88 46.69 L102.17 46.58 L103.46 46.46 L104.74 46.35 L106.03 46.23 L107.31 46.10 L108.60 45.98 L109.88 45.85 L111.16 45.71 L112.44 45.58 L113.72 45.44 L115.00 45.29 L116.28 45.15 L117.56 44.99 L118.83 44.84 L120.11 44.68 L121.38 44.52 L122.66 44.36 L123.87 44.26 L123.96 45.47 L124.04 46.69 L124.13 47.91 L124.21 49.12 L124.27 50.34 L124.27 51.56 L124.27 52.77 L124.27 53.99 L124.27 55.21 L124.27 56.42 L124.27 57.64 L124.27 58.85 L124.27 60.07 L124.27 61.29 L124.27 62.50 L124.27 63.72 L124.27 64.94 L124.27 66.15 L124.27 67.37 L124.27 68.59 L124.27 69.80 L123.18 70.00 L121.87 70.00 L120.57 70.00 L119.27 70.00 L117.97 70.00 L116.66 70.00 L115.36 70.00 L114.06 70.00 L112.75 70.00 L111.45 70.00 L110.15 70.00 L108.84 70.00 L107.54 70.00 L106.24 70.00 L104.93 70.00 L103.63 70.00 L102.33 70.00 L101.02 70.00 L99.72 70.00 L98.42 70.00 L97.11 70.00 L95.81 70.00 L94.51 70.00 L93.20 70.00 L91.90 70.00 L90.60 70.00 L89.29 70.00 L87.99 70.00 L86.69 70.00 L85.38 70.00 L84.08 70.00 L82.78 70.00 L81.47 70.00 L80.17 70.00 L78.87 70.00 L77.56 70.00 L76.26 70.00 L74.96 70.00 L73.65 70.00 L72.35 70.00 L71.05 70.00 L69.74 70.00 L68.44 70.00 L67.14 70.00 L65.83 70.00 L64.53 70.00 L63.23 70.00 L61.93 70.00 L60.62 70.00 L59.32 70.00 L58.02 70.00 L56.71 70.00 L55.41 70.00 L54.11 70.00 L52.80 70.00 L51.50 70.00 L50.20 70.00 L48.89 70.00 L47.59 70.00 L46.29 70.00 L44.98 70.00 L43.68 70.00 L42.38 70.00 L41.07 70.00 L39.77 70.00 L38.47 70.00 L37.16 70.00 L35.86 70.00 L34.56 70.00 L33.25 70.00 L31.95 70.00 L30.65 70.00 L29.34 70.00 L28.04 70.00 L26.74 70.00 L25.43 70.00 L24.13 70.00 L22.83 70.00 L21.52 70.00 L20.22 70.00 L18.92 70.00 L17.61 70.00 L16.31 70.00 L15.01 70.00 L13.70 70.00 L12.40 70.00 L11.10 70.00 L9.80 70.00 L8.49 70.00 L7.19 70.00 L5.89 70.00 L4.58 70.00 L3.28 70.00 L1.98 70.00 L0.67 70.00 L-0.63 70.00 L-1.93 70.00 L-3.24 70.00 L-4.27 69.75 L-4.27 68.53 L-4.27 67.32 L-4.27 66.10 L-4.27 64.88 L-4.27 63.67 L-4.27 62.45 L-4.27 61.23 L-4.27 60.02 L-4.27 58.80 L-4.27 57.58 L-4.27 56.37 L-4.27 55.15 L-4.27 53.93 L-4.27 52.72 L-4.27 51.50 L-4.27 50.28 L-4.21 49.07 L-4.12 47.85 L-4.04 46.63 L-3.95 45.42 L-3.87 44.20Z\"></path><path stroke=\"#b25887\" stroke-width=\".7\" fill=\"none\" d=\"M-3.97 45.60 L-3.44 45.67 L-2.92 45.74 L-2.39 45.81 L-1.87 45.87 L-1.34 45.94 L-0.81 46.01 L-0.29 46.07 L0.24 46.14 L0.76 46.20 L1.29 46.27 L1.82 46.33 L2.34 46.39 L2.87 46.46 L3.40 46.52 L3.93 46.58 L4.45 46.64 L4.98 46.70 L5.51 46.76 L6.04 46.82 L6.57 46.88 L7.10 46.94 L7.63 46.99 L8.15 47.05 L8.68 47.11 L9.21 47.16 L9.74 47.22 L10.27 47.27 L10.80 47.32 L11.33 47.38 L11.86 47.43 L12.39 47.48 L12.92 47.53 L13.45 47.59 L13.98 47.64 L14.51 47.69 L15.05 47.74 L15.58 47.78 L16.11 47.83 L16.64 47.88 L17.17 47.93 L17.70 47.97 L18.23 48.02 L18.77 48.06 L19.30 48.11 L19.83 48.15 L20.36 48.20 L20.90 48.24 L21.43 48.28 L21.96 48.32 L22.49 48.36 L23.03 48.41 L23.56 48.45 L24.09 48.48 L24.63 48.52 L25.16 48.56 L25.69 48.60 L26.23 48.64 L26.76 48.67 L27.30 48.71 L27.83 48.74 L28.36 48.78 L28.90 48.81 L29.43 48.85 L29.97 48.88 L30.50 48.91 L31.04 48.94 L31.57 48.98 L32.11 49.01 L32.64 49.04 L33.18 49.07 L33.71 49.10 L34.25 49.12 L34.78 49.15 L35.32 49.18 L35.85 49.21 L36.39 49.23 L36.92 49.26 L37.46 49.28 L37.99 49.31 L38.53 49.33 L39.07 49.35 L39.60 49.38 L40.14 49.40 L40.67 49.42 L41.21 49.44 L41.75 49.46 L42.28 49.48 L42.82 49.50 L43.35 49.52 L43.89 49.54 L44.43 49.55 L44.96 49.57 L45.50 49.59 L46.04 49.60 L46.57 49.62 L47.11 49.63 L47.65 49.64 L48.18 49.66 L48.72 49.67 L49.26 49.68 L49.79 49.69 L50.33 49.70 L50.87 49.72 L51.41 49.72 L51.94 49.73 L52.48 49.74 L53.02 49.75 L53.55 49.76 L54.09 49.76 L54.63 49.77 L55.17 49.78 L55.70 49.78 L56.24 49.79 L56.78 49.79 L57.31 49.79 L57.85 49.80 L58.39 49.80 L58.93 49.80 L59.46 49.80 L60.00 49.80 L60.54 49.80 L61.07 49.80 L61.61 49.80 L62.15 49.80 L62.69 49.79 L63.22 49.79 L63.76 49.79 L64.30 49.78 L64.83 49.78 L65.37 49.77 L65.91 49.76 L66.45 49.76 L66.98 49.75 L67.52 49.74 L68.06 49.73 L68.59 49.72 L69.13 49.72 L69.67 49.70 L70.21 49.69 L70.74 49.68 L71.28 49.67 L71.82 49.66 L72.35 49.64 L72.89 49.63 L73.43 49.62 L73.96 49.60 L74.50 49.59 L75.04 49.57 L75.57 49.55 L76.11 49.54 L76.65 49.52 L77.18 49.50 L77.72 49.48 L78.25 49.46 L78.79 49.44 L79.33 49.42 L79.86 49.40 L80.40 49.38 L80.93 49.35 L81.47 49.33 L82.01 49.31 L82.54 49.28 L83.08 49.26 L83.61 49.23 L84.15 49.21 L84.68 49.18 L85.22 49.15 L85.75 49.12 L86.29 49.10 L86.82 49.07 L87.36 49.04 L87.89 49.01 L88.43 48.98 L88.96 48.94 L89.50 48.91 L90.03 48.88 L90.57 48.85 L91.10 48.81 L91.64 48.78 L92.17 48.74 L92.70 48.71 L93.24 48.67 L93.77 48.64 L94.31 48.60 L94.84 48.56 L95.37 48.52 L95.91 48.48 L96.44 48.45 L96.97 48.41 L97.51 48.36 L98.04 48.32 L98.57 48.28 L99.10 48.24 L99.64 48.20 L100.17 48.15 L100.70 48.11 L101.23 48.06 L101.77 48.02 L102.30 47.97 L102.83 47.93 L103.36 47.88 L103.89 47.83 L104.42 47.78 L104.95 47.74 L105.49 47.69 L106.02 47.64 L106.55 47.59 L107.08 47.53 L107.61 47.48 L108.14 47.43 L108.67 47.38 L109.20 47.32 L109.73 47.27 L110.26 47.22 L110.79 47.16 L111.32 47.11 L111.85 47.05 L112.37 46.99 L112.90 46.94 L113.43 46.88 L113.96 46.82 L114.49 46.76 L115.02 46.70 L115.55 46.64 L116.07 46.58 L116.60 46.52 L117.13 46.46 L117.66 46.39 L118.18 46.33 L118.71 46.27 L119.24 46.20 L119.76 46.14 L120.29 46.07 L120.81 46.01 L121.34 45.94 L121.87 45.87 L122.39 45.81 L122.92 45.74 L123.44 45.67 L123.97 45.60\"></path></g><path fill=\"#6aa877\" d=\"M21.05 53.26 L21.13 53.49 L21.14 53.76 L21.08 54.07 L20.93 54.40 L20.70 54.76 L20.38 55.13 L20.12 55.39 L19.87 55.61 L19.61 55.82 L19.32 56.03 L19.02 56.24 L18.71 56.44 L18.39 56.63 L18.06 56.80 L17.73 56.97 L17.40 57.13 L17.08 57.27 L16.74 57.41 L16.40 57.54 L16.05 57.66 L15.69 57.78 L15.32 57.88 L14.96 57.97 L14.59 58.05 L14.23 58.12 L13.88 58.17 L13.54 58.20 L13.16 58.21 L12.64 58.20 L12.19 58.13 L11.82 58.02 L11.52 57.87 L11.30 57.69 L11.16 57.48 L11.08 57.25 L11.07 56.98 L11.13 56.68 L11.28 56.34 L11.52 55.98 L11.83 55.61 L12.09 55.36 L12.34 55.14 L12.60 54.92 L12.89 54.71 L13.19 54.50 L13.50 54.31 L13.82 54.12 L14.15 53.94 L14.48 53.77 L14.81 53.61 L15.14 53.47 L15.47 53.33 L15.81 53.20 L16.16 53.08 L16.52 52.96 L16.89 52.86 L17.25 52.77 L17.62 52.69 L17.98 52.63 L18.33 52.58 L18.67 52.54 L19.06 52.53 L19.57 52.55 L20.02 52.61 L20.39 52.72 L20.69 52.87 L20.91 53.05 L21.05 53.26Z\"></path><path fill=\"#5f9e6e\" d=\"M41.47 54.83 L41.34 55.04 L41.13 55.24 L40.83 55.40 L40.44 55.53 L39.97 55.61 L39.51 55.63 L39.18 55.63 L38.83 55.61 L38.48 55.58 L38.11 55.53 L37.74 55.47 L37.37 55.39 L37.01 55.30 L36.66 55.20 L36.31 55.10 L35.98 54.98 L35.64 54.86 L35.30 54.72 L34.96 54.57 L34.62 54.41 L34.30 54.24 L33.98 54.05 L33.69 53.87 L33.41 53.67 L33.15 53.47 L32.82 53.17 L32.51 52.83 L32.30 52.50 L32.19 52.20 L32.16 51.92 L32.21 51.68 L32.33 51.47 L32.55 51.27 L32.85 51.11 L33.23 50.99 L33.70 50.91 L34.16 50.88 L34.50 50.88 L34.84 50.90 L35.20 50.93 L35.57 50.98 L35.93 51.05 L36.30 51.12 L36.67 51.21 L37.02 51.31 L37.37 51.41 L37.70 51.53 L38.04 51.65 L38.38 51.79 L38.72 51.94 L39.05 52.10 L39.38 52.28 L39.69 52.46 L39.99 52.65 L40.27 52.84 L40.53 53.04 L40.86 53.34 L41.16 53.68 L41.37 54.01 L41.49 54.31 L41.52 54.59 L41.47 54.83Z\"></path><path fill=\"url(#lftrose)\" stroke=\"#d9668e\" stroke-width=\".5\" d=\"M30.63 55.70 L30.32 55.61 L30.02 55.48 L29.72 55.32 L29.44 55.13 L29.16 54.90 L28.90 54.64 L28.66 54.34 L28.45 54.02 L28.26 53.66 L28.12 53.34 L28.01 53.01 L27.93 52.68 L27.86 52.34 L27.82 51.99 L27.80 51.64 L27.80 51.30 L27.82 50.95 L27.86 50.62 L27.92 50.29 L28.00 49.97 L28.10 49.66 L28.21 49.35 L28.35 49.03 L28.51 48.72 L28.68 48.41 L28.88 48.11 L29.09 47.82 L29.32 47.54 L29.57 47.28 L29.83 47.03 L30.10 46.80 L30.41 46.58 L30.76 46.36 L31.13 46.18 L31.49 46.03 L31.86 45.93 L32.22 45.86 L32.57 45.82 L32.91 45.83 L33.24 45.86 L33.55 45.92 L33.85 46.01 L34.15 46.14 L34.44 46.30 L34.72 46.49 L34.99 46.72 L35.24 46.98 L35.47 47.28 L35.68 47.60 L35.85 47.96 L35.98 48.28 L36.08 48.61 L36.16 48.94 L36.22 49.28 L36.25 49.63 L36.26 49.98 L36.26 50.32 L36.24 50.67 L36.20 51.00 L36.14 51.33 L36.07 51.65 L35.98 51.96 L35.87 52.27 L35.75 52.59 L35.60 52.90 L35.43 53.21 L35.25 53.51 L35.05 53.80 L34.82 54.08 L34.58 54.34 L34.33 54.59 L34.06 54.82 L33.77 55.04 L33.42 55.26 L33.06 55.44 L32.69 55.59 L32.33 55.69 L31.97 55.76 L31.61 55.80 L31.27 55.79 L30.94 55.76 L30.63 55.70Z\"></path><path fill=\"url(#lftrose)\" stroke=\"#d9668e\" stroke-width=\".5\" d=\"M22.24 55.70 L22.17 55.41 L22.14 55.10 L22.13 54.78 L22.17 54.45 L22.25 54.11 L22.36 53.77 L22.52 53.43 L22.72 53.10 L22.96 52.77 L23.20 52.49 L23.45 52.24 L23.72 52.01 L24.01 51.78 L24.32 51.58 L24.63 51.39 L24.96 51.21 L25.30 51.06 L25.64 50.92 L25.98 50.80 L26.32 50.70 L26.66 50.62 L27.01 50.55 L27.37 50.50 L27.73 50.46 L28.11 50.44 L28.49 50.44 L28.87 50.46 L29.25 50.50 L29.62 50.56 L29.98 50.64 L30.34 50.74 L30.70 50.87 L31.08 51.05 L31.44 51.25 L31.76 51.47 L32.05 51.71 L32.30 51.97 L32.51 52.24 L32.68 52.51 L32.82 52.80 L32.92 53.08 L32.98 53.37 L33.02 53.68 L33.02 54.00 L32.99 54.33 L32.91 54.67 L32.79 55.01 L32.64 55.35 L32.44 55.68 L32.20 56.01 L31.96 56.29 L31.71 56.54 L31.44 56.77 L31.15 57.00 L30.84 57.20 L30.52 57.39 L30.19 57.57 L29.86 57.72 L29.52 57.86 L29.18 57.98 L28.84 58.08 L28.50 58.16 L28.15 58.23 L27.79 58.28 L27.42 58.32 L27.05 58.34 L26.67 58.34 L26.29 58.32 L25.91 58.28 L25.54 58.22 L25.17 58.14 L24.82 58.04 L24.46 57.91 L24.08 57.73 L23.72 57.53 L23.40 57.31 L23.11 57.07 L22.86 56.81 L22.65 56.54 L22.48 56.27 L22.34 55.98 L22.24 55.70Z\"></path><path fill=\"url(#lftrose)\" stroke=\"#d9668e\" stroke-width=\".5\" d=\"M18.33 49.50 L18.57 49.30 L18.85 49.12 L19.15 48.96 L19.48 48.82 L19.83 48.71 L20.21 48.64 L20.61 48.59 L21.03 48.58 L21.46 48.61 L21.84 48.66 L22.20 48.73 L22.56 48.83 L22.92 48.95 L23.27 49.09 L23.61 49.24 L23.94 49.42 L24.25 49.61 L24.55 49.81 L24.83 50.02 L25.09 50.24 L25.34 50.47 L25.58 50.71 L25.81 50.97 L26.03 51.24 L26.24 51.53 L26.43 51.83 L26.60 52.14 L26.75 52.46 L26.88 52.78 L26.99 53.11 L27.07 53.44 L27.12 53.79 L27.15 54.19 L27.14 54.57 L27.09 54.93 L27.01 55.28 L26.89 55.61 L26.74 55.91 L26.56 56.19 L26.36 56.44 L26.15 56.66 L25.90 56.86 L25.63 57.04 L25.33 57.20 L25.00 57.34 L24.64 57.45 L24.26 57.52 L23.86 57.57 L23.45 57.58 L23.02 57.55 L22.64 57.50 L22.27 57.43 L21.91 57.33 L21.56 57.21 L21.21 57.07 L20.87 56.92 L20.54 56.74 L20.23 56.55 L19.93 56.35 L19.65 56.14 L19.38 55.92 L19.14 55.69 L18.90 55.45 L18.67 55.19 L18.45 54.92 L18.24 54.63 L18.05 54.33 L17.88 54.02 L17.72 53.70 L17.60 53.38 L17.49 53.05 L17.41 52.72 L17.35 52.37 L17.33 51.97 L17.34 51.59 L17.39 51.23 L17.47 50.88 L17.59 50.55 L17.74 50.25 L17.91 49.97 L18.11 49.72 L18.33 49.50Z\"></path><path fill=\"url(#lftrose)\" stroke=\"#d9668e\" stroke-width=\".5\" d=\"M22.24 43.30 L22.55 43.39 L22.86 43.52 L23.16 43.68 L23.45 43.87 L23.74 44.10 L24.00 44.36 L24.24 44.66 L24.46 44.98 L24.65 45.34 L24.79 45.66 L24.90 45.99 L24.99 46.32 L25.06 46.66 L25.10 47.01 L25.12 47.36 L25.12 47.70 L25.10 48.05 L25.06 48.38 L25.00 48.71 L24.92 49.03 L24.83 49.34 L24.72 49.65 L24.59 49.97 L24.45 50.28 L24.28 50.59 L24.09 50.89 L23.88 51.18 L23.65 51.46 L23.41 51.72 L23.15 51.97 L22.88 52.20 L22.58 52.42 L22.22 52.64 L21.85 52.82 L21.48 52.97 L21.11 53.07 L20.74 53.14 L20.38 53.18 L20.03 53.17 L19.70 53.14 L19.38 53.08 L19.07 52.99 L18.76 52.86 L18.46 52.70 L18.16 52.51 L17.88 52.28 L17.62 52.02 L17.37 51.72 L17.16 51.40 L16.97 51.04 L16.82 50.72 L16.71 50.39 L16.62 50.06 L16.56 49.72 L16.52 49.37 L16.49 49.02 L16.50 48.68 L16.52 48.33 L16.56 48.00 L16.62 47.67 L16.69 47.35 L16.78 47.04 L16.89 46.73 L17.02 46.41 L17.17 46.10 L17.34 45.79 L17.53 45.49 L17.74 45.20 L17.96 44.92 L18.20 44.66 L18.46 44.41 L18.74 44.18 L19.04 43.96 L19.40 43.74 L19.76 43.56 L20.13 43.41 L20.51 43.31 L20.87 43.24 L21.23 43.20 L21.58 43.21 L21.92 43.24 L22.24 43.30Z\"></path><path fill=\"url(#lftrose)\" stroke=\"#d9668e\" stroke-width=\".5\" d=\"M30.84 43.30 L30.89 43.59 L30.92 43.90 L30.91 44.22 L30.87 44.55 L30.78 44.89 L30.66 45.23 L30.49 45.57 L30.29 45.90 L30.04 46.23 L29.80 46.51 L29.55 46.76 L29.27 46.99 L28.98 47.22 L28.68 47.42 L28.36 47.61 L28.03 47.79 L27.70 47.94 L27.36 48.08 L27.02 48.20 L26.69 48.30 L26.35 48.38 L26.01 48.45 L25.65 48.50 L25.29 48.54 L24.92 48.56 L24.55 48.56 L24.18 48.54 L23.81 48.50 L23.45 48.44 L23.10 48.36 L22.75 48.26 L22.41 48.13 L22.04 47.95 L21.70 47.75 L21.39 47.53 L21.12 47.29 L20.89 47.03 L20.69 46.76 L20.54 46.49 L20.42 46.20 L20.33 45.92 L20.28 45.63 L20.25 45.32 L20.26 45.00 L20.31 44.67 L20.40 44.33 L20.53 43.99 L20.70 43.65 L20.91 43.32 L21.15 42.99 L21.40 42.71 L21.65 42.46 L21.93 42.23 L22.22 42.00 L22.52 41.80 L22.84 41.61 L23.17 41.43 L23.50 41.28 L23.83 41.14 L24.17 41.02 L24.50 40.92 L24.84 40.84 L25.18 40.77 L25.53 40.72 L25.89 40.68 L26.25 40.66 L26.62 40.66 L26.99 40.68 L27.35 40.72 L27.71 40.78 L28.07 40.86 L28.41 40.96 L28.75 41.09 L29.12 41.27 L29.46 41.47 L29.76 41.69 L30.03 41.93 L30.27 42.19 L30.47 42.46 L30.63 42.73 L30.75 43.02 L30.84 43.30Z\"></path><path fill=\"url(#lftrose)\" stroke=\"#d9668e\" stroke-width=\".5\" d=\"M34.47 49.50 L34.23 49.70 L33.96 49.88 L33.66 50.04 L33.34 50.18 L32.99 50.29 L32.61 50.36 L32.22 50.41 L31.81 50.42 L31.39 50.39 L31.02 50.34 L30.66 50.27 L30.31 50.17 L29.96 50.05 L29.62 49.91 L29.29 49.76 L28.98 49.58 L28.68 49.39 L28.39 49.19 L28.12 48.98 L27.87 48.76 L27.64 48.53 L27.41 48.29 L27.19 48.03 L26.99 47.76 L26.79 47.47 L26.62 47.17 L26.46 46.86 L26.33 46.54 L26.21 46.22 L26.12 45.89 L26.05 45.56 L26.01 45.21 L26.00 44.81 L26.02 44.43 L26.09 44.07 L26.18 43.72 L26.31 43.39 L26.46 43.09 L26.65 42.81 L26.85 42.56 L27.07 42.34 L27.31 42.14 L27.58 41.96 L27.88 41.80 L28.21 41.66 L28.56 41.55 L28.93 41.48 L29.32 41.43 L29.73 41.42 L30.14 41.45 L30.51 41.50 L30.86 41.57 L31.21 41.67 L31.55 41.79 L31.89 41.93 L32.21 42.08 L32.52 42.26 L32.82 42.45 L33.11 42.65 L33.38 42.86 L33.63 43.08 L33.86 43.31 L34.09 43.55 L34.31 43.81 L34.51 44.08 L34.71 44.37 L34.88 44.67 L35.04 44.98 L35.18 45.30 L35.30 45.62 L35.39 45.95 L35.46 46.28 L35.51 46.63 L35.53 47.03 L35.51 47.41 L35.45 47.77 L35.36 48.12 L35.23 48.45 L35.08 48.75 L34.90 49.03 L34.69 49.28 L34.47 49.50Z\"></path><path fill=\"#e8799e\" d=\"M31.74 49.50 L31.71 49.81 L31.67 50.13 L31.61 50.46 L31.52 50.79 L31.41 51.11 L31.26 51.43 L31.09 51.75 L30.89 52.05 L30.66 52.35 L30.41 52.62 L30.14 52.88 L29.84 53.11 L29.53 53.33 L29.20 53.51 L28.86 53.67 L28.52 53.81 L28.17 53.92 L27.82 54.00 L27.47 54.06 L27.13 54.09 L26.79 54.10 L26.46 54.09 L26.11 54.06 L25.77 54.00 L25.42 53.92 L25.07 53.81 L24.72 53.67 L24.38 53.51 L24.06 53.33 L23.74 53.11 L23.45 52.88 L23.17 52.62 L22.92 52.35 L22.70 52.05 L22.49 51.75 L22.32 51.43 L22.18 51.11 L22.06 50.79 L21.97 50.46 L21.91 50.13 L21.88 49.81 L21.89 49.50 L21.91 49.19 L21.96 48.87 L22.03 48.54 L22.13 48.21 L22.26 47.89 L22.42 47.57 L22.61 47.25 L22.82 46.95 L23.06 46.65 L23.32 46.38 L23.60 46.12 L23.90 45.89 L24.22 45.67 L24.56 45.49 L24.90 45.33 L25.25 45.19 L25.60 45.08 L25.95 45.00 L26.30 44.94 L26.64 44.91 L26.98 44.90 L27.31 44.91 L27.65 44.94 L27.99 45.00 L28.34 45.08 L28.68 45.19 L29.02 45.33 L29.35 45.49 L29.67 45.67 L29.98 45.89 L30.26 46.12 L30.53 46.38 L30.77 46.65 L30.99 46.95 L31.18 47.25 L31.34 47.57 L31.47 47.89 L31.58 48.21 L31.66 48.54 L31.71 48.87 L31.73 49.19 L31.74 49.50Z\"></path><path stroke=\"#b9426d\" stroke-width=\".7\" fill=\"none\" stroke-linecap=\"round\" d=\"M23.84 49.96 L24.05 49.69 L24.27 49.42 L24.50 49.16 L24.74 48.91 L24.99 48.67 L25.26 48.44 L25.54 48.24 L25.85 48.06 L26.17 47.91 L26.51 47.81 L26.86 47.77 L27.21 47.79 L27.55 47.88 L27.86 48.03 L28.15 48.21 L28.41 48.43 L28.65 48.67 L28.86 48.92 L29.06 49.19 L29.25 49.46 L29.22 49.79 L29.14 50.11 L29.05 50.43 L28.93 50.74 L28.79 51.04 L28.61 51.33 L28.40 51.60 L28.16 51.84 L27.88 52.05 L27.58 52.22 L27.25 52.34 L26.91 52.44 L26.56 52.49 L26.21 52.52 L25.85 52.52 L25.50 52.49 L25.15 52.45 L26.06 48.82 L26.33 48.59 L26.62 48.39 L26.95 48.25 L27.30 48.21 L27.63 48.31 L27.91 48.51 L28.13 48.76 L28.30 49.04\"></path><g fill=\"#fff\"><path d=\"M38.85 47.50 L38.80 47.79 L38.67 48.09 L38.45 48.35 L38.17 48.55 L37.85 48.66 L37.54 48.70 L37.22 48.66 L36.91 48.55 L36.64 48.35 L36.43 48.09 L36.31 47.79 L36.28 47.50 L36.33 47.21 L36.46 46.91 L36.68 46.65 L36.96 46.45 L37.28 46.34 L37.59 46.30 L37.91 46.34 L38.22 46.45 L38.49 46.65 L38.70 46.91 L38.82 47.21 L38.85 47.50Z\"></path><path d=\"M17.95 46.50 L17.91 46.77 L17.78 47.04 L17.57 47.28 L17.31 47.46 L17.02 47.57 L16.73 47.60 L16.44 47.57 L16.16 47.46 L15.91 47.28 L15.73 47.04 L15.63 46.77 L15.61 46.50 L15.65 46.23 L15.78 45.96 L15.99 45.72 L16.25 45.54 L16.54 45.43 L16.83 45.40 L17.12 45.43 L17.40 45.54 L17.65 45.72 L17.83 45.96 L17.93 46.23 L17.95 46.50Z\"></path></g></g>", "ocl": "<defs><linearGradient id=\"lftcat\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#c9608d\"/><stop offset=\".5\" stop-color=\"#8d3a69\"/><stop offset=\"1\" stop-color=\"#b24c78\"/></linearGradient><radialGradient id=\"lftrose\" cx=\"45%\" cy=\"40%\" r=\"65%\"><stop offset=\"0\" stop-color=\"#ffd3df\"/><stop offset=\".6\" stop-color=\"#f29ab5\"/><stop offset=\"1\" stop-color=\"#d9668e\"/></radialGradient><linearGradient id=\"lfthat\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#e7c1cd\"/><stop offset=\".38\" stop-color=\"#f6dfe6\"/><stop offset=\".75\" stop-color=\"#ebc8d3\"/><stop offset=\"1\" stop-color=\"#d9aab9\"/></linearGradient></defs><defs><linearGradient id=\"lftnu\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#d39aa6\"/><stop offset=\".55\" stop-color=\"#bb7d8a\"/><stop offset=\"1\" stop-color=\"#a4697a\"/></linearGradient></defs><path class=\"lfcL\" d=\"M39.36 73.26 L38.91 73.42 L38.45 73.42 L38.00 73.42 L37.54 73.59 L37.09 73.59 L36.64 73.76 L36.18 73.93 L35.73 73.93 L35.28 74.10 L34.82 74.26 L34.37 74.60 L33.92 74.77 L33.61 75.10 L33.31 75.61 L33.01 76.11 L32.86 76.62 L32.71 77.12 L32.56 77.62 L32.40 78.13 L32.40 78.63 L32.40 79.14 L32.40 79.64 L32.56 80.14 L32.56 80.65 L32.71 81.15 L32.71 81.66 L32.86 82.16 L33.01 82.66 L33.16 83.17 L33.46 83.67 L33.61 84.18 L33.76 84.68 L34.07 85.18 L34.37 85.69 L34.67 86.19 L34.97 86.70 L35.28 87.20 L35.73 87.70 L36.18 88.21 L36.64 88.71 L37.09 89.22 L37.54 89.55 L38.00 90.06 L38.45 90.39 L38.91 90.56 L39.36 90.90 L39.81 91.23 L40.27 91.40 L40.72 91.57 L41.17 91.74 L41.63 91.90 L42.08 92.07 L42.53 92.24 L42.99 92.24 L43.44 92.41 L43.90 92.41 L44.35 92.58 L44.80 92.58 L45.26 92.58 L45.71 92.58 L46.16 92.58 L46.62 92.58 L47.07 92.58 L47.52 92.41 L47.98 92.41 L48.43 92.24 L48.88 92.07 L49.34 91.90 L49.79 91.74 L50.25 91.57 L50.70 91.40 L51.15 91.23 L51.61 90.90 L52.06 90.56 L52.51 90.22 L52.97 89.89 L53.42 89.38 L53.87 88.88 L54.33 88.38 L54.63 87.87 L54.93 87.37 L55.08 86.86 L55.39 86.36 L55.69 85.86 L55.84 85.35 L55.99 84.85 L56.14 84.34 L56.29 83.84 L56.29 83.34 L56.44 82.83 L56.44 82.33 L56.44 81.82 L56.44 81.32 L56.29 80.82 L56.14 80.31 L55.99 79.81 L55.84 79.30 L55.54 78.80 L55.24 78.30 L54.78 77.79 L54.33 77.29 L53.87 76.95 L53.42 76.45 L52.97 76.28 L52.51 75.94 L52.06 75.61 L51.61 75.44 L51.15 75.27 L50.70 75.10 L50.25 74.94 L49.79 74.77 L49.34 74.60 L48.88 74.43 L48.43 74.26 L47.98 74.10 L47.52 74.10 L47.07 73.93 L46.62 73.76 L46.16 73.76 L45.71 73.76 L45.26 73.59 L44.80 73.59 L44.35 73.42 L43.90 73.42 L43.44 73.42 L42.99 73.26 L42.53 73.26 L42.08 73.26 L41.63 73.26 L41.17 73.26 L40.72 73.26 L40.27 73.26 L39.81 73.26Z\" fill=\"url(#lfmlz)\"/><path d=\"M80.64 73.26 L81.09 73.42 L81.55 73.42 L82 73.42 L82.46 73.59 L82.91 73.59 L83.36 73.76 L83.82 73.93 L84.27 73.93 L84.72 74.10 L85.18 74.26 L85.63 74.60 L86.08 74.77 L86.39 75.10 L86.69 75.61 L86.99 76.11 L87.14 76.62 L87.29 77.12 L87.44 77.62 L87.6 78.13 L87.6 78.63 L87.6 79.14 L87.6 79.64 L87.44 80.14 L87.44 80.65 L87.29 81.15 L87.29 81.66 L87.14 82.16 L86.99 82.66 L86.84 83.17 L86.54 83.67 L86.39 84.18 L86.24 84.68 L85.93 85.18 L85.63 85.69 L85.33 86.19 L85.03 86.70 L84.72 87.20 L84.27 87.70 L83.82 88.21 L83.36 88.71 L82.91 89.22 L82.46 89.55 L82 90.06 L81.55 90.39 L81.09 90.56 L80.64 90.90 L80.19 91.23 L79.73 91.40 L79.28 91.57 L78.83 91.74 L78.37 91.90 L77.92 92.07 L77.47 92.24 L77.01 92.24 L76.56 92.41 L76.1 92.41 L75.65 92.58 L75.2 92.58 L74.74 92.58 L74.29 92.58 L73.84 92.58 L73.38 92.58 L72.93 92.58 L72.48 92.41 L72.02 92.41 L71.57 92.24 L71.12 92.07 L70.66 91.90 L70.21 91.74 L69.75 91.57 L69.3 91.40 L68.85 91.23 L68.39 90.90 L67.94 90.56 L67.49 90.22 L67.03 89.89 L66.58 89.38 L66.13 88.88 L65.67 88.38 L65.37 87.87 L65.07 87.37 L64.92 86.86 L64.61 86.36 L64.31 85.86 L64.16 85.35 L64.01 84.85 L63.86 84.34 L63.71 83.84 L63.71 83.34 L63.56 82.83 L63.56 82.33 L63.56 81.82 L63.56 81.32 L63.71 80.82 L63.86 80.31 L64.01 79.81 L64.16 79.30 L64.46 78.80 L64.76 78.30 L65.22 77.79 L65.67 77.29 L66.13 76.95 L66.58 76.45 L67.03 76.28 L67.49 75.94 L67.94 75.61 L68.39 75.44 L68.85 75.27 L69.3 75.10 L69.75 74.94 L70.21 74.77 L70.66 74.60 L71.12 74.43 L71.57 74.26 L72.02 74.10 L72.48 74.10 L72.93 73.93 L73.38 73.76 L73.84 73.76 L74.29 73.76 L74.74 73.59 L75.2 73.59 L75.65 73.42 L76.1 73.42 L76.56 73.42 L77.01 73.26 L77.47 73.26 L77.92 73.26 L78.37 73.26 L78.83 73.26 L79.28 73.26 L79.73 73.26 L80.19 73.26Z\" fill=\"url(#lfmlz)\"/><path d=\"M30 74.6 C25.6 74.2 20.8 73.6 16.2 73\" fill=\"none\" stroke=\"#a4697a\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M90 74.6 C94.4 74.2 99.2 73.6 103.8 73\" fill=\"none\" stroke=\"#a4697a\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M38.00 71.58 L37.70 71.91 L37.24 71.91 L36.79 71.91 L36.34 71.91 L35.88 71.74 L35.43 71.91 L34.97 72.08 L34.52 71.91 L34.07 72.08 L33.61 72.08 L33.16 72.08 L32.71 72.25 L32.25 72.25 L31.80 72.42 L31.35 72.42 L30.89 72.58 L30.44 72.75 L29.98 72.75 L29.53 72.92 L29.08 73.09 L28.62 73.26 L28.17 73.42 L27.72 73.59 L27.41 73.93 L27.26 74.43 L27.26 74.94 L27.26 75.44 L27.26 75.94 L27.41 76.45 L27.41 76.95 L27.57 77.46 L27.57 77.96 L27.72 78.46 L27.87 78.97 L28.02 79.47 L28.17 79.98 L28.47 80.48 L28.78 80.98 L29.08 81.49 L29.38 81.99 L29.68 82.50 L29.98 83.00 L30.29 83.50 L30.59 84.01 L30.89 84.51 L31.35 85.02 L31.65 85.52 L32.10 86.02 L32.40 86.53 L32.86 87.03 L33.31 87.54 L33.61 88.04 L34.07 88.38 L34.37 88.71 L34.82 89.22 L35.28 89.72 L35.73 90.06 L36.18 90.56 L36.64 90.90 L37.09 91.23 L37.54 91.57 L38.00 91.74 L38.45 92.07 L38.91 92.41 L39.36 92.58 L39.81 92.74 L40.27 92.91 L40.72 93.08 L41.17 93.25 L41.63 93.42 L42.08 93.58 L42.53 93.75 L42.99 93.75 L43.44 93.92 L43.90 93.92 L44.35 94.09 L44.80 94.09 L45.26 94.09 L45.71 94.09 L46.16 94.09 L46.62 94.09 L47.07 93.92 L47.52 93.92 L47.98 93.75 L48.43 93.75 L48.88 93.58 L49.34 93.42 L49.79 93.25 L50.25 93.08 L50.70 92.91 L51.15 92.74 L51.61 92.41 L52.06 92.24 L52.51 91.90 L52.97 91.57 L53.42 91.23 L53.87 90.73 L54.33 90.39 L54.78 89.89 L55.08 89.38 L55.54 88.88 L55.84 88.38 L56.14 87.87 L56.44 87.37 L56.60 86.86 L56.83 86.36 L56.94 85.86 L57.16 85.35 L57.28 84.85 L57.39 84.34 L57.51 83.84 L57.62 83.34 L57.73 82.83 L57.85 82.33 L57.96 81.82 L58.18 81.32 L58.42 80.82 L58.75 80.48 L59.09 80.31 L59.44 80.31 L59.77 80.31 L60.00 80.14 L60.00 79.64 L60.00 79.14 L60.00 78.63 L60.00 78.13 L60.00 77.62 L59.89 77.29 L59.55 77.29 L59.20 77.29 L58.87 77.29 L58.53 77.46 L58.18 77.46 L57.85 77.46 L57.51 77.29 L57.16 77.12 L56.83 76.95 L56.44 76.62 L55.99 76.28 L55.54 75.94 L55.08 75.61 L54.63 75.44 L54.18 75.10 L53.72 74.94 L53.27 74.60 L52.82 74.43 L52.36 74.10 L51.91 73.93 L51.46 73.76 L51.00 73.59 L50.55 73.42 L50.09 73.26 L49.64 73.09 L49.19 72.92 L48.73 72.92 L48.28 72.75 L47.83 72.58 L47.37 72.58 L46.92 72.42 L46.47 72.25 L46.01 72.25 L45.56 72.08 L45.10 72.08 L44.65 71.91 L44.20 71.91 L43.90 72.25 L43.44 72.25 L43.29 71.74 L42.84 71.74 L42.53 71.91 L42.08 72.08 L41.63 71.91 L41.17 71.91 L40.72 71.91 L40.27 71.91 L39.96 71.58 L39.51 71.58 L39.06 71.58 L38.60 71.58 L38.15 71.58Z M39.36 73.26 L38.91 73.42 L38.45 73.42 L38.00 73.42 L37.54 73.59 L37.09 73.59 L36.64 73.76 L36.18 73.93 L35.73 73.93 L35.28 74.10 L34.82 74.26 L34.37 74.60 L33.92 74.77 L33.61 75.10 L33.31 75.61 L33.01 76.11 L32.86 76.62 L32.71 77.12 L32.56 77.62 L32.40 78.13 L32.40 78.63 L32.40 79.14 L32.40 79.64 L32.56 80.14 L32.56 80.65 L32.71 81.15 L32.71 81.66 L32.86 82.16 L33.01 82.66 L33.16 83.17 L33.46 83.67 L33.61 84.18 L33.76 84.68 L34.07 85.18 L34.37 85.69 L34.67 86.19 L34.97 86.70 L35.28 87.20 L35.73 87.70 L36.18 88.21 L36.64 88.71 L37.09 89.22 L37.54 89.55 L38.00 90.06 L38.45 90.39 L38.91 90.56 L39.36 90.90 L39.81 91.23 L40.27 91.40 L40.72 91.57 L41.17 91.74 L41.63 91.90 L42.08 92.07 L42.53 92.24 L42.99 92.24 L43.44 92.41 L43.90 92.41 L44.35 92.58 L44.80 92.58 L45.26 92.58 L45.71 92.58 L46.16 92.58 L46.62 92.58 L47.07 92.58 L47.52 92.41 L47.98 92.41 L48.43 92.24 L48.88 92.07 L49.34 91.90 L49.79 91.74 L50.25 91.57 L50.70 91.40 L51.15 91.23 L51.61 90.90 L52.06 90.56 L52.51 90.22 L52.97 89.89 L53.42 89.38 L53.87 88.88 L54.33 88.38 L54.63 87.87 L54.93 87.37 L55.08 86.86 L55.39 86.36 L55.69 85.86 L55.84 85.35 L55.99 84.85 L56.14 84.34 L56.29 83.84 L56.29 83.34 L56.44 82.83 L56.44 82.33 L56.44 81.82 L56.44 81.32 L56.29 80.82 L56.14 80.31 L55.99 79.81 L55.84 79.30 L55.54 78.80 L55.24 78.30 L54.78 77.79 L54.33 77.29 L53.87 76.95 L53.42 76.45 L52.97 76.28 L52.51 75.94 L52.06 75.61 L51.61 75.44 L51.15 75.27 L50.70 75.10 L50.25 74.94 L49.79 74.77 L49.34 74.60 L48.88 74.43 L48.43 74.26 L47.98 74.10 L47.52 74.10 L47.07 73.93 L46.62 73.76 L46.16 73.76 L45.71 73.76 L45.26 73.59 L44.80 73.59 L44.35 73.42 L43.90 73.42 L43.44 73.42 L42.99 73.26 L42.53 73.26 L42.08 73.26 L41.63 73.26 L41.17 73.26 L40.72 73.26 L40.27 73.26 L39.81 73.26Z\" fill=\"url(#lftnu)\" fill-rule=\"evenodd\" stroke=\"url(#lftnu)\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/><path d=\"M82 71.58 L82.3 71.91 L82.76 71.91 L83.21 71.91 L83.66 71.91 L84.12 71.74 L84.57 71.91 L85.03 72.08 L85.48 71.91 L85.93 72.08 L86.39 72.08 L86.84 72.08 L87.29 72.25 L87.75 72.25 L88.2 72.42 L88.65 72.42 L89.11 72.58 L89.56 72.75 L90.02 72.75 L90.47 72.92 L90.92 73.09 L91.38 73.26 L91.83 73.42 L92.28 73.59 L92.59 73.93 L92.74 74.43 L92.74 74.94 L92.74 75.44 L92.74 75.94 L92.59 76.45 L92.59 76.95 L92.43 77.46 L92.43 77.96 L92.28 78.46 L92.13 78.97 L91.98 79.47 L91.83 79.98 L91.53 80.48 L91.22 80.98 L90.92 81.49 L90.62 81.99 L90.32 82.50 L90.02 83.00 L89.71 83.50 L89.41 84.01 L89.11 84.51 L88.65 85.02 L88.35 85.52 L87.9 86.02 L87.6 86.53 L87.14 87.03 L86.69 87.54 L86.39 88.04 L85.93 88.38 L85.63 88.71 L85.18 89.22 L84.72 89.72 L84.27 90.06 L83.82 90.56 L83.36 90.90 L82.91 91.23 L82.46 91.57 L82 91.74 L81.55 92.07 L81.09 92.41 L80.64 92.58 L80.19 92.74 L79.73 92.91 L79.28 93.08 L78.83 93.25 L78.37 93.42 L77.92 93.58 L77.47 93.75 L77.01 93.75 L76.56 93.92 L76.1 93.92 L75.65 94.09 L75.2 94.09 L74.74 94.09 L74.29 94.09 L73.84 94.09 L73.38 94.09 L72.93 93.92 L72.48 93.92 L72.02 93.75 L71.57 93.75 L71.12 93.58 L70.66 93.42 L70.21 93.25 L69.75 93.08 L69.3 92.91 L68.85 92.74 L68.39 92.41 L67.94 92.24 L67.49 91.90 L67.03 91.57 L66.58 91.23 L66.13 90.73 L65.67 90.39 L65.22 89.89 L64.92 89.38 L64.46 88.88 L64.16 88.38 L63.86 87.87 L63.56 87.37 L63.4 86.86 L63.17 86.36 L63.06 85.86 L62.84 85.35 L62.72 84.85 L62.61 84.34 L62.49 83.84 L62.38 83.34 L62.27 82.83 L62.15 82.33 L62.04 81.82 L61.82 81.32 L61.58 80.82 L61.25 80.48 L60.91 80.31 L60.56 80.31 L60.23 80.31 L60 80.14 L60 79.64 L60 79.14 L60 78.63 L60 78.13 L60 77.62 L60.11 77.29 L60.45 77.29 L60.8 77.29 L61.13 77.29 L61.47 77.46 L61.82 77.46 L62.15 77.46 L62.49 77.29 L62.84 77.12 L63.17 76.95 L63.56 76.62 L64.01 76.28 L64.46 75.94 L64.92 75.61 L65.37 75.44 L65.82 75.10 L66.28 74.94 L66.73 74.60 L67.18 74.43 L67.64 74.10 L68.09 73.93 L68.54 73.76 L69 73.59 L69.45 73.42 L69.91 73.26 L70.36 73.09 L70.81 72.92 L71.27 72.92 L71.72 72.75 L72.17 72.58 L72.63 72.58 L73.08 72.42 L73.53 72.25 L73.99 72.25 L74.44 72.08 L74.9 72.08 L75.35 71.91 L75.8 71.91 L76.1 72.25 L76.56 72.25 L76.71 71.74 L77.16 71.74 L77.47 71.91 L77.92 72.08 L78.37 71.91 L78.83 71.91 L79.28 71.91 L79.73 71.91 L80.04 71.58 L80.49 71.58 L80.94 71.58 L81.4 71.58 L81.85 71.58Z M80.64 73.26 L81.09 73.42 L81.55 73.42 L82 73.42 L82.46 73.59 L82.91 73.59 L83.36 73.76 L83.82 73.93 L84.27 73.93 L84.72 74.10 L85.18 74.26 L85.63 74.60 L86.08 74.77 L86.39 75.10 L86.69 75.61 L86.99 76.11 L87.14 76.62 L87.29 77.12 L87.44 77.62 L87.6 78.13 L87.6 78.63 L87.6 79.14 L87.6 79.64 L87.44 80.14 L87.44 80.65 L87.29 81.15 L87.29 81.66 L87.14 82.16 L86.99 82.66 L86.84 83.17 L86.54 83.67 L86.39 84.18 L86.24 84.68 L85.93 85.18 L85.63 85.69 L85.33 86.19 L85.03 86.70 L84.72 87.20 L84.27 87.70 L83.82 88.21 L83.36 88.71 L82.91 89.22 L82.46 89.55 L82 90.06 L81.55 90.39 L81.09 90.56 L80.64 90.90 L80.19 91.23 L79.73 91.40 L79.28 91.57 L78.83 91.74 L78.37 91.90 L77.92 92.07 L77.47 92.24 L77.01 92.24 L76.56 92.41 L76.1 92.41 L75.65 92.58 L75.2 92.58 L74.74 92.58 L74.29 92.58 L73.84 92.58 L73.38 92.58 L72.93 92.58 L72.48 92.41 L72.02 92.41 L71.57 92.24 L71.12 92.07 L70.66 91.90 L70.21 91.74 L69.75 91.57 L69.3 91.40 L68.85 91.23 L68.39 90.90 L67.94 90.56 L67.49 90.22 L67.03 89.89 L66.58 89.38 L66.13 88.88 L65.67 88.38 L65.37 87.87 L65.07 87.37 L64.92 86.86 L64.61 86.36 L64.31 85.86 L64.16 85.35 L64.01 84.85 L63.86 84.34 L63.71 83.84 L63.71 83.34 L63.56 82.83 L63.56 82.33 L63.56 81.82 L63.56 81.32 L63.71 80.82 L63.86 80.31 L64.01 79.81 L64.16 79.30 L64.46 78.80 L64.76 78.30 L65.22 77.79 L65.67 77.29 L66.13 76.95 L66.58 76.45 L67.03 76.28 L67.49 75.94 L67.94 75.61 L68.39 75.44 L68.85 75.27 L69.3 75.10 L69.75 74.94 L70.21 74.77 L70.66 74.60 L71.12 74.43 L71.57 74.26 L72.02 74.10 L72.48 74.10 L72.93 73.93 L73.38 73.76 L73.84 73.76 L74.29 73.76 L74.74 73.59 L75.2 73.59 L75.65 73.42 L76.1 73.42 L76.56 73.42 L77.01 73.26 L77.47 73.26 L77.92 73.26 L78.37 73.26 L78.83 73.26 L79.28 73.26 L79.73 73.26 L80.19 73.26Z\" fill=\"url(#lftnu)\" fill-rule=\"evenodd\" stroke=\"url(#lftnu)\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/><path d=\"M28.6 72.4 C34 71.6 40 71.4 46 72.2 C50.4 72.8 54.4 74 57.6 75.6\" stroke=\"#f7e4e6\" stroke-width=\".9\" fill=\"none\" stroke-linecap=\"round\" opacity=\".9\"/><path d=\"M91.4 72.4 C86 71.6 80 71.4 74 72.2 C69.6 72.8 65.6 74 62.4 75.6\" stroke=\"#f7e4e6\" stroke-width=\".9\" fill=\"none\" stroke-linecap=\"round\" opacity=\".9\"/><path d=\"M29.4 73.6 l2.2 .1 M90.6 73.6 l-2.2 .1\" stroke=\"#eee6e8\" stroke-width=\"1\" stroke-linecap=\"round\"/><path d=\"M38.5 78.6 l3.2 -2 M68.5 78.6 l3.2 -2\" stroke=\"#fff\" stroke-width=\"1.7\" stroke-linecap=\"round\"/>", "fundo": "<g fill=\"#f2a7bf\"><circle cx=\"-0.48\" cy=\"70.00\" r=\"2.10\"/><circle cx=\"-2.22\" cy=\"72.40\" r=\"2.10\"/><circle cx=\"-5.04\" cy=\"71.48\" r=\"2.10\"/><circle cx=\"-5.04\" cy=\"68.52\" r=\"2.10\"/><circle cx=\"-2.22\" cy=\"67.60\" r=\"2.10\"/></g><circle cx=\"-3\" cy=\"70\" r=\"1.26\" fill=\"#f3c34f\"/><g fill=\"#f6c3d3\"><circle cx=\"117.92\" cy=\"38.00\" r=\"1.60\"/><circle cx=\"116.59\" cy=\"39.83\" r=\"1.60\"/><circle cx=\"114.45\" cy=\"39.13\" r=\"1.60\"/><circle cx=\"114.45\" cy=\"36.87\" r=\"1.60\"/><circle cx=\"116.59\" cy=\"36.17\" r=\"1.60\"/></g><circle cx=\"116\" cy=\"38\" r=\"0.96\" fill=\"#f3c34f\"/><g fill=\"#f2a7bf\"><circle cx=\"114.80\" cy=\"104.00\" r=\"1.50\"/><circle cx=\"113.56\" cy=\"105.71\" r=\"1.50\"/><circle cx=\"111.54\" cy=\"105.06\" r=\"1.50\"/><circle cx=\"111.54\" cy=\"102.94\" r=\"1.50\"/><circle cx=\"113.56\" cy=\"102.29\" r=\"1.50\"/></g><circle cx=\"113\" cy=\"104\" r=\"0.8999999999999999\" fill=\"#f3c34f\"/>"};TEMA_M.pais={"corte": "M-40 53 L160 53 L160 200 L-40 200 Z", "ocl": "<defs><linearGradient id=\"lftfd\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#26354d\"/><stop offset=\".35\" stop-color=\"#3c5070\"/><stop offset=\".7\" stop-color=\"#2b3b55\"/><stop offset=\"1\" stop-color=\"#1c2739\"/></linearGradient><linearGradient id=\"lftgo3\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#c3922a\"/><stop offset=\".5\" stop-color=\"#f6dc8c\"/><stop offset=\"1\" stop-color=\"#c3922a\"/></linearGradient></defs><rect x=\"34.6\" y=\"74.6\" width=\"20.8\" height=\"17\" rx=\"6.5\" fill=\"url(#lfmlz)\"/><rect x=\"64.6\" y=\"74.6\" width=\"20.8\" height=\"17\" rx=\"6.5\" fill=\"url(#lfmlz)\"/><rect x=\"34.6\" y=\"74.6\" width=\"20.8\" height=\"17\" rx=\"6.5\" fill=\"none\" stroke=\"url(#lftgo3)\" stroke-width=\"1.2\"/><rect x=\"64.6\" y=\"74.6\" width=\"20.8\" height=\"17\" rx=\"6.5\" fill=\"none\" stroke=\"url(#lftgo3)\" stroke-width=\"1.2\"/><path d=\"M34.4 81 Q34 74.4 41 74.2 L49 74.2 Q55.6 74.4 55.6 79.5\" stroke=\"#4a2c1a\" stroke-width=\"3.6\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M64.4 79.5 Q64.4 74.4 71 74.2 L79 74.2 Q86 74.4 85.6 81\" stroke=\"#4a2c1a\" stroke-width=\"3.6\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M37 75.4 L44 75.2 M67 75.2 L74 75.4\" stroke=\"#8a5a36\" stroke-width=\"1\" stroke-linecap=\"round\" opacity=\".9\"/><path d=\"M55.4 79.6 Q60 76.4 64.6 79.6\" stroke=\"url(#lftgo3)\" stroke-width=\"1.6\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M34.2 79.5 C26 78.5 21 78 16.5 79\" fill=\"none\" stroke=\"#4a2c1a\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M85.8 79.5 C94 78.5 99 78 103.5 79\" fill=\"none\" stroke=\"#4a2c1a\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><circle cx=\"35.4\" cy=\"79.4\" r=\"1.1\" fill=\"#e6c36a\"/><circle cx=\"84.6\" cy=\"79.4\" r=\"1.1\" fill=\"#e6c36a\"/><path d=\"M38 77 l3.2 -2 M68 77 l3.2 -2\" stroke=\"#fff\" stroke-width=\"1.7\" stroke-linecap=\"round\"/>", "fundo": "<g fill=\"#9aabc4\"><path d=\"M-4 66 l1.6 -4.8 1.6 4.8 4.8 1.6 -4.8 1.6 -1.6 4.8 -1.6 -4.8 -4.8 -1.6z\"/><path d=\"M115 40 l1.2 -3.6 1.2 3.6 3.6 1.2 -3.6 1.2 -1.2 3.6 -1.2 -3.6 -3.6 -1.2z\"/></g>", "tr": "<g><path fill=\"#1c2739\" d=\"M121.65 52.48 L121.40 53.36 L120.62 54.26 L119.94 54.77 L119.07 55.28 L118.02 55.79 L116.98 56.22 L116.11 56.54 L115.17 56.85 L114.15 57.16 L113.05 57.47 L111.88 57.77 L110.90 58.01 L109.95 58.22 L108.96 58.43 L107.93 58.64 L106.87 58.84 L105.78 59.04 L104.65 59.23 L103.51 59.42 L102.53 59.57 L101.53 59.72 L100.51 59.86 L99.47 60.00 L98.41 60.14 L97.34 60.27 L96.25 60.40 L95.15 60.52 L94.02 60.64 L92.98 60.75 L91.95 60.85 L90.91 60.95 L89.86 61.05 L88.81 61.14 L87.74 61.22 L86.67 61.31 L85.59 61.39 L84.51 61.46 L83.42 61.54 L82.34 61.60 L81.27 61.67 L80.20 61.73 L79.12 61.79 L78.04 61.84 L76.97 61.89 L75.89 61.94 L74.81 61.98 L73.73 62.02 L72.65 62.06 L71.58 62.10 L70.50 62.13 L69.43 62.15 L68.37 62.18 L67.30 62.20 L66.24 62.22 L65.19 62.24 L64.14 62.25 L63.10 62.26 L62.06 62.26 L61.03 62.27 L60.00 62.27 L58.97 62.27 L57.94 62.26 L56.90 62.26 L55.86 62.25 L54.81 62.24 L53.76 62.22 L52.70 62.20 L51.63 62.18 L50.57 62.15 L49.50 62.13 L48.42 62.10 L47.35 62.06 L46.27 62.02 L45.19 61.98 L44.11 61.94 L43.03 61.89 L41.96 61.84 L40.88 61.79 L39.80 61.73 L38.73 61.67 L37.66 61.60 L36.58 61.54 L35.49 61.46 L34.41 61.39 L33.33 61.31 L32.26 61.22 L31.19 61.14 L30.14 61.05 L29.09 60.95 L28.05 60.85 L27.02 60.75 L25.98 60.64 L24.85 60.52 L23.75 60.40 L22.66 60.27 L21.59 60.14 L20.53 60.00 L19.49 59.86 L18.47 59.72 L17.47 59.57 L16.49 59.42 L15.35 59.23 L14.22 59.04 L13.13 58.84 L12.07 58.64 L11.04 58.43 L10.05 58.22 L9.10 58.01 L8.12 57.77 L6.95 57.47 L5.85 57.16 L4.83 56.85 L3.89 56.54 L3.02 56.22 L1.98 55.79 L0.93 55.28 L0.06 54.77 L-0.62 54.26 L-1.40 53.36 L-1.65 52.48 L-1.40 51.61 L-0.62 50.71 L0.06 50.20 L0.93 49.69 L1.98 49.18 L3.02 48.75 L3.89 48.43 L4.83 48.12 L5.85 47.81 L6.95 47.50 L8.12 47.20 L9.10 46.96 L10.05 46.75 L11.04 46.54 L12.07 46.33 L13.13 46.13 L14.22 45.93 L15.35 45.74 L16.49 45.55 L17.47 45.40 L18.47 45.25 L19.49 45.11 L20.53 44.97 L21.59 44.83 L22.66 44.70 L23.75 44.57 L24.85 44.45 L25.98 44.33 L27.02 44.22 L28.05 44.12 L29.09 44.02 L30.14 43.92 L31.19 43.83 L32.26 43.75 L33.33 43.66 L34.41 43.58 L35.49 43.51 L36.58 43.43 L37.66 43.37 L38.73 43.30 L39.80 43.24 L40.88 43.18 L41.96 43.13 L43.03 43.08 L44.11 43.03 L45.19 42.99 L46.27 42.95 L47.35 42.91 L48.42 42.87 L49.50 42.84 L50.57 42.82 L51.63 42.79 L52.70 42.77 L53.76 42.75 L54.81 42.73 L55.86 42.72 L56.90 42.71 L57.94 42.71 L58.97 42.70 L60.00 42.70 L61.03 42.70 L62.06 42.71 L63.10 42.71 L64.14 42.72 L65.19 42.73 L66.24 42.75 L67.30 42.77 L68.37 42.79 L69.43 42.82 L70.50 42.84 L71.58 42.87 L72.65 42.91 L73.73 42.95 L74.81 42.99 L75.89 43.03 L76.97 43.08 L78.04 43.13 L79.12 43.18 L80.20 43.24 L81.27 43.30 L82.34 43.37 L83.42 43.43 L84.51 43.51 L85.59 43.58 L86.67 43.66 L87.74 43.75 L88.81 43.83 L89.86 43.92 L90.91 44.02 L91.95 44.12 L92.98 44.22 L94.02 44.33 L95.15 44.45 L96.25 44.57 L97.34 44.70 L98.41 44.83 L99.47 44.97 L100.51 45.11 L101.53 45.25 L102.53 45.40 L103.51 45.55 L104.65 45.74 L105.78 45.93 L106.87 46.13 L107.93 46.33 L108.96 46.54 L109.95 46.75 L110.90 46.96 L111.88 47.20 L113.05 47.50 L114.15 47.81 L115.17 48.12 L116.11 48.43 L116.98 48.75 L118.02 49.18 L119.07 49.69 L119.94 50.20 L120.62 50.71 L121.40 51.61 L121.65 52.48Z\"></path><path fill=\"#121a28\" d=\"M112.99 51.97 L112.72 52.68 L111.98 53.33 L111.34 53.71 L110.53 54.08 L109.54 54.46 L108.73 54.72 L107.96 54.95 L107.12 55.18 L106.21 55.40 L105.24 55.62 L104.25 55.82 L103.46 55.98 L102.63 56.13 L101.77 56.28 L100.88 56.43 L99.96 56.57 L99.02 56.71 L98.04 56.85 L97.13 56.97 L96.34 57.07 L95.53 57.17 L94.70 57.26 L93.86 57.36 L93.01 57.45 L92.14 57.54 L91.26 57.63 L90.37 57.71 L89.47 57.79 L88.56 57.87 L87.63 57.95 L86.70 58.02 L85.76 58.09 L84.81 58.16 L83.85 58.22 L82.89 58.29 L81.92 58.35 L80.95 58.40 L79.97 58.46 L79.02 58.51 L78.11 58.55 L77.20 58.59 L76.28 58.64 L75.36 58.67 L74.45 58.71 L73.53 58.74 L72.61 58.77 L71.69 58.80 L70.77 58.83 L69.86 58.85 L68.94 58.87 L68.03 58.89 L67.12 58.91 L66.22 58.93 L65.32 58.94 L64.42 58.95 L63.53 58.96 L62.64 58.97 L61.75 58.97 L60.87 58.97 L60.00 58.97 L59.13 58.97 L58.25 58.97 L57.36 58.97 L56.47 58.96 L55.58 58.95 L54.68 58.94 L53.78 58.93 L52.88 58.91 L51.97 58.89 L51.06 58.87 L50.14 58.85 L49.23 58.83 L48.31 58.80 L47.39 58.77 L46.47 58.74 L45.55 58.71 L44.64 58.67 L43.72 58.64 L42.80 58.59 L41.89 58.55 L40.98 58.51 L40.03 58.46 L39.05 58.40 L38.08 58.35 L37.11 58.29 L36.15 58.22 L35.19 58.16 L34.24 58.09 L33.30 58.02 L32.37 57.95 L31.44 57.87 L30.53 57.79 L29.63 57.71 L28.74 57.63 L27.86 57.54 L26.99 57.45 L26.14 57.36 L25.30 57.26 L24.47 57.17 L23.66 57.07 L22.87 56.97 L21.96 56.85 L20.98 56.71 L20.04 56.57 L19.12 56.43 L18.23 56.28 L17.37 56.13 L16.54 55.98 L15.75 55.82 L14.76 55.62 L13.79 55.40 L12.88 55.18 L12.04 54.95 L11.27 54.72 L10.46 54.46 L9.47 54.08 L8.66 53.71 L8.02 53.33 L7.28 52.68 L7.01 51.97 L7.28 51.26 L8.02 50.61 L8.66 50.23 L9.47 49.86 L10.46 49.48 L11.27 49.22 L12.04 48.99 L12.88 48.76 L13.79 48.54 L14.76 48.32 L15.75 48.12 L16.54 47.96 L17.37 47.81 L18.23 47.66 L19.12 47.51 L20.04 47.37 L20.98 47.23 L21.96 47.09 L22.87 46.97 L23.66 46.87 L24.47 46.77 L25.30 46.68 L26.14 46.58 L26.99 46.49 L27.86 46.40 L28.74 46.31 L29.63 46.23 L30.53 46.15 L31.44 46.07 L32.37 45.99 L33.30 45.92 L34.24 45.85 L35.19 45.78 L36.15 45.72 L37.11 45.65 L38.08 45.59 L39.05 45.54 L40.03 45.48 L40.98 45.43 L41.89 45.39 L42.80 45.35 L43.72 45.30 L44.64 45.27 L45.55 45.23 L46.47 45.20 L47.39 45.17 L48.31 45.14 L49.23 45.11 L50.14 45.09 L51.06 45.07 L51.97 45.05 L52.88 45.03 L53.78 45.01 L54.68 45.00 L55.58 44.99 L56.47 44.98 L57.36 44.97 L58.25 44.97 L59.13 44.97 L60.00 44.97 L60.87 44.97 L61.75 44.97 L62.64 44.97 L63.53 44.98 L64.42 44.99 L65.32 45.00 L66.22 45.01 L67.12 45.03 L68.03 45.05 L68.94 45.07 L69.86 45.09 L70.77 45.11 L71.69 45.14 L72.61 45.17 L73.53 45.20 L74.45 45.23 L75.36 45.27 L76.28 45.30 L77.20 45.35 L78.11 45.39 L79.02 45.43 L79.97 45.48 L80.95 45.54 L81.92 45.59 L82.89 45.65 L83.85 45.72 L84.81 45.78 L85.76 45.85 L86.70 45.92 L87.63 45.99 L88.56 46.07 L89.47 46.15 L90.37 46.23 L91.26 46.31 L92.14 46.40 L93.01 46.49 L93.86 46.58 L94.70 46.68 L95.53 46.77 L96.34 46.87 L97.13 46.97 L98.04 47.09 L99.02 47.23 L99.96 47.37 L100.88 47.51 L101.77 47.66 L102.63 47.81 L103.46 47.96 L104.25 48.12 L105.24 48.32 L106.21 48.54 L107.12 48.76 L107.96 48.99 L108.73 49.22 L109.54 49.48 L110.53 49.86 L111.34 50.23 L111.98 50.61 L112.72 51.26 L112.99 51.97Z\"></path></g>", "fr": "<g><defs><linearGradient id=\"lftfd\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#26354d\"></stop><stop offset=\".35\" stop-color=\"#3c5070\"></stop><stop offset=\".7\" stop-color=\"#2b3b55\"></stop><stop offset=\"1\" stop-color=\"#1c2739\"></stop></linearGradient><linearGradient id=\"lftgo3\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#c3922a\"></stop><stop offset=\".5\" stop-color=\"#f6dc8c\"></stop><stop offset=\"1\" stop-color=\"#c3922a\"></stop></linearGradient></defs><path fill=\"#26354d\" d=\"M-1.65 52.48 L-1.36 53.43 L-0.70 54.20 L0.12 54.82 L1.01 55.34 L1.95 55.79 L2.91 56.18 L3.88 56.54 L4.87 56.87 L5.87 57.17 L6.88 57.45 L7.89 57.71 L8.90 57.96 L9.92 58.19 L10.94 58.41 L11.96 58.62 L12.99 58.81 L14.02 59.00 L15.05 59.18 L16.08 59.35 L17.11 59.51 L18.14 59.67 L19.18 59.82 L20.22 59.96 L21.25 60.10 L22.29 60.23 L23.33 60.35 L24.37 60.47 L25.41 60.59 L26.45 60.70 L27.49 60.80 L28.53 60.90 L29.57 61.00 L30.61 61.09 L31.66 61.18 L32.70 61.26 L33.74 61.34 L34.79 61.42 L35.83 61.49 L36.88 61.56 L37.92 61.62 L38.96 61.69 L40.01 61.74 L41.06 61.80 L42.10 61.85 L43.15 61.90 L44.19 61.95 L45.24 61.99 L46.28 62.03 L47.33 62.06 L48.38 62.10 L49.42 62.13 L50.47 62.15 L51.51 62.18 L52.56 62.20 L53.61 62.22 L54.65 62.23 L55.70 62.25 L56.75 62.26 L57.79 62.26 L58.84 62.27 L59.89 62.27 L60.93 62.27 L61.98 62.26 L63.03 62.26 L64.07 62.25 L65.12 62.24 L66.17 62.22 L67.21 62.20 L68.26 62.18 L69.31 62.16 L70.35 62.13 L71.40 62.10 L72.45 62.07 L73.49 62.03 L74.54 62.00 L75.58 61.95 L76.63 61.91 L77.68 61.86 L78.72 61.81 L79.77 61.76 L80.81 61.70 L81.86 61.64 L82.90 61.57 L83.94 61.50 L84.99 61.43 L86.03 61.36 L87.08 61.28 L88.12 61.20 L89.16 61.11 L90.20 61.02 L91.25 60.92 L92.29 60.82 L93.33 60.72 L94.37 60.61 L95.41 60.50 L96.45 60.38 L97.49 60.25 L98.52 60.12 L99.56 59.99 L100.60 59.85 L101.63 59.70 L102.67 59.55 L103.70 59.39 L104.73 59.22 L105.76 59.04 L106.79 58.86 L107.82 58.66 L108.84 58.46 L109.86 58.24 L110.88 58.01 L111.90 57.77 L112.91 57.51 L113.91 57.23 L114.91 56.94 L115.90 56.61 L116.88 56.26 L117.85 55.87 L118.79 55.44 L119.69 54.94 L120.53 54.34 L121.24 53.61 L121.63 52.70 L120.82 52.49 L119.78 52.49 L118.73 52.49 L117.68 52.49 L116.64 52.49 L115.59 52.49 L114.54 52.49 L113.50 52.49 L112.45 52.49 L111.40 52.49 L110.36 52.49 L109.31 52.49 L108.26 52.49 L107.22 52.49 L106.17 52.49 L105.12 52.49 L104.08 52.49 L103.03 52.49 L101.98 52.49 L100.94 52.49 L99.89 52.49 L98.84 52.49 L97.80 52.49 L96.75 52.49 L95.70 52.49 L94.65 52.49 L93.61 52.49 L92.56 52.49 L91.51 52.49 L90.47 52.49 L89.42 52.49 L88.37 52.49 L87.33 52.49 L86.28 52.49 L85.23 52.49 L84.19 52.49 L83.14 52.49 L82.09 52.49 L81.05 52.49 L80.00 52.49 L78.95 52.49 L77.91 52.49 L76.86 52.49 L75.81 52.49 L74.77 52.49 L73.72 52.49 L72.67 52.49 L71.63 52.49 L70.58 52.49 L69.53 52.49 L68.49 52.49 L67.44 52.49 L66.39 52.49 L65.35 52.49 L64.30 52.49 L63.25 52.49 L62.21 52.49 L61.16 52.49 L60.11 52.49 L59.07 52.49 L58.02 52.49 L56.97 52.49 L55.93 52.49 L54.88 52.49 L53.83 52.49 L52.79 52.49 L51.74 52.49 L50.69 52.49 L49.64 52.49 L48.60 52.49 L47.55 52.49 L46.50 52.49 L45.46 52.49 L44.41 52.49 L43.36 52.49 L42.32 52.49 L41.27 52.49 L40.22 52.49 L39.18 52.49 L38.13 52.49 L37.08 52.49 L36.04 52.49 L34.99 52.49 L33.94 52.49 L32.90 52.49 L31.85 52.49 L30.80 52.49 L29.76 52.49 L28.71 52.49 L27.66 52.49 L26.62 52.49 L25.57 52.49 L24.52 52.49 L23.48 52.49 L22.43 52.49 L21.38 52.48 L20.34 52.48 L19.29 52.48 L18.24 52.48 L17.20 52.48 L16.15 52.48 L15.10 52.48 L14.06 52.48 L13.01 52.48 L11.96 52.48 L10.92 52.48 L9.87 52.48 L8.82 52.48 L7.78 52.48 L6.73 52.48 L5.68 52.48 L4.63 52.48 L3.59 52.48 L2.54 52.48 L1.49 52.48 L0.45 52.48 L-0.60 52.48 L-1.65 52.48Z\"></path><path stroke=\"#4a5f82\" stroke-width=\"1\" fill=\"none\" opacity=\".8\" d=\"M0.52 53.62 L1.01 53.72 L1.49 53.83 L1.98 53.93 L2.47 54.03 L2.96 54.13 L3.45 54.23 L3.94 54.33 L4.42 54.43 L4.91 54.53 L5.40 54.62 L5.89 54.72 L6.38 54.82 L6.87 54.91 L7.36 55.00 L7.85 55.10 L8.34 55.19 L8.83 55.28 L9.32 55.37 L9.82 55.46 L10.31 55.55 L10.80 55.63 L11.29 55.72 L11.78 55.81 L12.27 55.89 L12.76 55.98 L13.26 56.06 L13.75 56.14 L14.24 56.22 L14.73 56.31 L15.23 56.39 L15.72 56.47 L16.21 56.54 L16.71 56.62 L17.20 56.70 L17.69 56.77 L18.19 56.85 L18.68 56.92 L19.17 57.00 L19.67 57.07 L20.16 57.14 L20.66 57.21 L21.15 57.28 L21.65 57.35 L22.14 57.42 L22.64 57.48 L23.13 57.55 L23.63 57.62 L24.12 57.68 L24.62 57.74 L25.11 57.81 L25.61 57.87 L26.10 57.93 L26.60 57.99 L27.09 58.05 L27.59 58.11 L28.09 58.17 L28.58 58.22 L29.08 58.28 L29.58 58.33 L30.07 58.39 L30.57 58.44 L31.07 58.49 L31.56 58.54 L32.06 58.60 L32.56 58.64 L33.05 58.69 L33.55 58.74 L34.05 58.79 L34.55 58.83 L35.04 58.88 L35.54 58.92 L36.04 58.97 L36.54 59.01 L37.04 59.05 L37.53 59.09 L38.03 59.13 L38.53 59.17 L39.03 59.21 L39.53 59.25 L40.02 59.28 L40.52 59.32 L41.02 59.35 L41.52 59.39 L42.02 59.42 L42.52 59.45 L43.02 59.48 L43.52 59.51 L44.01 59.54 L44.51 59.57 L45.01 59.60 L45.51 59.63 L46.01 59.65 L46.51 59.68 L47.01 59.70 L47.51 59.72 L48.01 59.74 L48.51 59.77 L49.01 59.79 L49.51 59.81 L50.01 59.82 L50.50 59.84 L51.00 59.86 L51.50 59.87 L52.00 59.89 L52.50 59.90 L53.00 59.92 L53.50 59.93 L54.00 59.94 L54.50 59.95 L55.00 59.96 L55.50 59.97 L56.00 59.98 L56.50 59.98 L57.00 59.99 L57.50 59.99 L58.00 60.00 L58.50 60.00 L59.00 60.00 L59.50 60.00 L60.00 60.00 L60.50 60.00 L61.00 60.00 L61.50 60.00 L62.00 60.00 L62.50 59.99 L63.00 59.99 L63.50 59.98 L64.00 59.98 L64.50 59.97 L65.00 59.96 L65.50 59.95 L66.00 59.94 L66.50 59.93 L67.00 59.92 L67.50 59.90 L68.00 59.89 L68.50 59.87 L69.00 59.86 L69.50 59.84 L69.99 59.82 L70.49 59.81 L70.99 59.79 L71.49 59.77 L71.99 59.74 L72.49 59.72 L72.99 59.70 L73.49 59.68 L73.99 59.65 L74.49 59.63 L74.99 59.60 L75.49 59.57 L75.99 59.54 L76.48 59.51 L76.98 59.48 L77.48 59.45 L77.98 59.42 L78.48 59.39 L78.98 59.35 L79.48 59.32 L79.98 59.28 L80.47 59.25 L80.97 59.21 L81.47 59.17 L81.97 59.13 L82.47 59.09 L82.96 59.05 L83.46 59.01 L83.96 58.97 L84.46 58.92 L84.96 58.88 L85.45 58.83 L85.95 58.79 L86.45 58.74 L86.95 58.69 L87.44 58.64 L87.94 58.60 L88.44 58.54 L88.93 58.49 L89.43 58.44 L89.93 58.39 L90.42 58.33 L90.92 58.28 L91.42 58.22 L91.91 58.17 L92.41 58.11 L92.91 58.05 L93.40 57.99 L93.90 57.93 L94.39 57.87 L94.89 57.81 L95.38 57.74 L95.88 57.68 L96.37 57.62 L96.87 57.55 L97.36 57.48 L97.86 57.42 L98.35 57.35 L98.85 57.28 L99.34 57.21 L99.84 57.14 L100.33 57.07 L100.83 57.00 L101.32 56.92 L101.81 56.85 L102.31 56.77 L102.80 56.70 L103.29 56.62 L103.79 56.54 L104.28 56.47 L104.77 56.39 L105.27 56.31 L105.76 56.22 L106.25 56.14 L106.74 56.06 L107.24 55.98 L107.73 55.89 L108.22 55.81 L108.71 55.72 L109.20 55.63 L109.69 55.55 L110.18 55.46 L110.68 55.37 L111.17 55.28 L111.66 55.19 L112.15 55.10 L112.64 55.00 L113.13 54.91 L113.62 54.82 L114.11 54.72 L114.60 54.62 L115.09 54.53 L115.58 54.43 L116.06 54.33 L116.55 54.23 L117.04 54.13 L117.53 54.03 L118.02 53.93 L118.51 53.83 L118.99 53.72 L119.48 53.62\"></path></g><g><path fill=\"url(#lftfd)\" d=\"M19.00 54.00 L18.93 53.14 L18.87 52.36 L18.81 51.59 L18.76 50.82 L18.73 50.05 L18.75 49.27 L18.78 48.51 L18.82 47.73 L18.86 46.96 L18.91 46.20 L18.97 45.42 L19.04 44.65 L19.11 43.87 L19.19 43.11 L19.28 42.34 L19.38 41.56 L19.49 40.80 L19.61 40.02 L19.74 39.26 L19.88 38.48 L20.03 37.72 L20.19 36.95 L20.36 36.19 L20.55 35.42 L20.75 34.66 L20.96 33.89 L21.18 33.14 L21.42 32.37 L21.68 31.63 L21.95 30.87 L22.24 30.12 L22.54 29.38 L22.87 28.64 L23.21 27.90 L23.57 27.17 L23.96 26.44 L24.37 25.73 L24.80 25.02 L25.25 24.33 L25.74 23.63 L26.25 22.97 L26.80 22.32 L27.51 21.77 L28.27 21.27 L29.06 20.82 L29.88 20.40 L30.73 20.02 L31.60 19.68 L32.49 19.38 L33.39 19.12 L34.31 18.89 L35.23 18.69 L36.16 18.53 L37.10 18.39 L38.04 18.29 L38.98 18.22 L39.92 18.17 L40.87 18.15 L41.81 18.16 L42.75 18.21 L43.69 18.27 L44.62 18.37 L45.55 18.50 L46.47 18.66 L47.38 18.85 L48.27 19.09 L49.15 19.35 L50.01 19.66 L50.85 20.01 L51.69 20.36 L52.56 20.64 L53.46 20.89 L54.38 21.08 L55.30 21.24 L56.24 21.36 L57.18 21.46 L58.13 21.52 L59.08 21.55 L60.03 21.56 L60.98 21.55 L61.92 21.52 L62.87 21.45 L63.81 21.36 L64.75 21.23 L65.68 21.07 L66.59 20.87 L67.49 20.64 L68.36 20.34 L69.19 19.99 L70.03 19.64 L70.90 19.34 L71.78 19.07 L72.68 18.84 L73.59 18.66 L74.50 18.49 L75.43 18.37 L76.36 18.27 L77.30 18.20 L78.24 18.16 L79.19 18.15 L80.13 18.17 L81.07 18.22 L82.02 18.30 L82.96 18.40 L83.89 18.54 L84.82 18.70 L85.74 18.90 L86.66 19.13 L87.56 19.40 L88.45 19.70 L89.32 20.04 L90.16 20.42 L90.99 20.84 L91.78 21.30 L92.53 21.81 L93.24 22.35 L93.78 23.00 L94.29 23.68 L94.77 24.36 L95.23 25.06 L95.66 25.77 L96.06 26.49 L96.45 27.21 L96.81 27.93 L97.15 28.67 L97.48 29.42 L97.78 30.16 L98.07 30.91 L98.34 31.66 L98.59 32.42 L98.83 33.17 L99.05 33.94 L99.26 34.69 L99.46 35.46 L99.65 36.22 L99.82 36.99 L99.98 37.76 L100.13 38.53 L100.27 39.30 L100.40 40.07 L100.51 40.84 L100.62 41.61 L100.72 42.38 L100.81 43.15 L100.89 43.92 L100.97 44.69 L101.03 45.47 L101.09 46.23 L101.14 47.01 L101.18 47.78 L101.22 48.55 L101.25 49.32 L101.27 50.09 L101.24 50.87 L101.19 51.63 L101.13 52.41 L101.07 53.19 L100.95 54.01 L99.96 54.15 L98.97 54.29 L97.97 54.43 L96.98 54.56 L95.99 54.69 L95.00 54.81 L94.00 54.94 L93.01 55.06 L92.01 55.17 L91.02 55.28 L90.02 55.39 L89.02 55.50 L88.03 55.60 L87.03 55.70 L86.03 55.79 L85.03 55.88 L84.03 55.97 L83.03 56.05 L82.03 56.13 L81.03 56.21 L80.03 56.28 L79.03 56.35 L78.03 56.42 L77.03 56.48 L76.03 56.54 L75.03 56.60 L74.02 56.65 L73.02 56.70 L72.02 56.74 L71.01 56.78 L70.01 56.82 L69.01 56.86 L68.00 56.89 L67.00 56.91 L66.00 56.94 L64.99 56.96 L63.99 56.97 L62.98 56.98 L61.98 56.99 L60.98 57.00 L59.97 57.00 L58.97 57.00 L57.96 56.99 L56.96 56.98 L55.95 56.97 L54.95 56.95 L53.95 56.93 L52.94 56.91 L51.94 56.88 L50.94 56.85 L49.93 56.82 L48.93 56.78 L47.93 56.74 L46.92 56.69 L45.92 56.65 L44.92 56.59 L43.92 56.54 L42.91 56.48 L41.91 56.42 L40.91 56.35 L39.91 56.28 L38.91 56.21 L37.91 56.13 L36.91 56.05 L35.91 55.96 L34.91 55.88 L33.91 55.79 L32.91 55.69 L31.92 55.59 L30.92 55.49 L29.92 55.39 L28.93 55.28 L27.93 55.16 L26.94 55.05 L25.94 54.93 L24.95 54.81 L23.95 54.68 L22.96 54.55 L21.97 54.42 L20.98 54.28 L19.99 54.14 L19.00 54.00Z\"></path><path stroke=\"#1c2739\" stroke-width=\"1.4\" fill=\"none\" opacity=\".8\" d=\"M51.16 20.15 L51.38 20.39 L51.60 20.63 L51.84 20.85 L52.09 21.08 L52.34 21.29 L52.61 21.50 L52.88 21.70 L53.16 21.90 L53.45 22.08 L53.74 22.26 L54.05 22.43 L54.36 22.58 L54.68 22.73 L55.00 22.88 L55.33 23.01 L55.67 23.14 L56.01 23.26 L56.36 23.35 L56.71 23.45 L57.07 23.53 L57.42 23.62 L57.79 23.68 L58.15 23.73 L58.52 23.78 L58.89 23.81 L59.26 23.84 L59.63 23.86 L60.00 23.87 L60.37 23.86 L60.74 23.84 L61.11 23.81 L61.48 23.78 L61.85 23.73 L62.21 23.68 L62.58 23.62 L62.93 23.53 L63.29 23.45 L63.64 23.35 L63.99 23.26 L64.33 23.14 L64.67 23.01 L65.00 22.88 L65.32 22.73 L65.64 22.58 L65.95 22.43 L66.26 22.26 L66.55 22.08 L66.84 21.90 L67.12 21.70 L67.39 21.50 L67.66 21.29 L67.91 21.08 L68.16 20.85 L68.40 20.63 L68.62 20.39 L68.84 20.15\"></path><path stroke=\"#1c2739\" stroke-width=\"1.1\" opacity=\".45\" d=\"M60.00 24.20 L60.00 24.50 L60.00 24.80 L60.00 25.10 L60.00 25.40 L60.00 25.70 L60.00 26.00 L60.00 26.30 L60.00 26.60 L60.00 26.90 L60.00 27.20 L60.00 27.50 L60.00 27.80 L60.00 28.10 L60.00 28.40 L60.00 28.70 L60.00 29.00 L60.00 29.30 L60.00 29.60 L60.00 29.90 L60.00 30.20 L60.00 30.50 L60.00 30.80 L60.00 31.10 L60.00 31.40 L60.00 31.70 L60.00 32.00 L60.00 32.30 L60.00 32.60 L60.00 32.90 L60.00 33.20 L60.00 33.50 L60.00 33.80 L60.00 34.10 L60.00 34.40 L60.00 34.70 L60.00 35.00\"></path><path stroke=\"#fff\" stroke-width=\"1.8\" opacity=\".22\" fill=\"none\" stroke-linecap=\"round\" d=\"M28.76 25.10 L28.99 24.87 L29.24 24.63 L29.49 24.41 L29.75 24.19 L30.01 23.97 L30.28 23.76 L30.56 23.55 L30.84 23.35 L31.13 23.16 L31.42 22.97 L31.71 22.78 L32.02 22.60 L32.32 22.43 L32.63 22.26 L32.94 22.09 L33.26 21.93 L33.58 21.78 L33.91 21.63 L34.24 21.49 L34.57 21.36 L34.90 21.22 L35.24 21.09 L35.58 20.98 L35.92 20.86 L36.27 20.75 L36.61 20.65 L36.96 20.55 L37.31 20.46 L37.66 20.38 L38.02 20.29 L38.37 20.21 L38.73 20.14 L39.09 20.08 L39.45 20.02 L39.81 19.96 L40.17 19.92 L40.53 19.87 L40.89 19.83 L41.26 19.79 L41.62 19.76 L41.98 19.74 L42.35 19.73 L42.71 19.71 L43.08 19.70 L43.44 19.70\"></path><path fill=\"#141c2a\" d=\"M19.65 44.90 L20.40 45.01 L21.15 45.12 L21.91 45.22 L22.67 45.32 L23.42 45.43 L24.18 45.53 L24.94 45.62 L25.70 45.72 L26.46 45.81 L27.22 45.90 L27.98 45.99 L28.75 46.08 L29.51 46.16 L30.28 46.25 L31.04 46.33 L31.81 46.40 L32.57 46.48 L33.34 46.56 L34.11 46.63 L34.88 46.70 L35.65 46.76 L36.42 46.84 L37.19 46.90 L37.96 46.96 L38.73 47.02 L39.50 47.08 L40.27 47.13 L41.05 47.19 L41.82 47.24 L42.60 47.28 L43.37 47.33 L44.14 47.38 L44.92 47.42 L45.70 47.47 L46.47 47.50 L47.25 47.54 L48.02 47.57 L48.80 47.60 L49.58 47.64 L50.36 47.66 L51.13 47.68 L51.91 47.71 L52.69 47.73 L53.47 47.75 L54.25 47.76 L55.02 47.78 L55.80 47.80 L56.58 47.81 L57.36 47.82 L58.14 47.82 L58.92 47.83 L59.70 47.83 L60.48 47.83 L61.26 47.83 L62.03 47.82 L62.81 47.81 L63.59 47.80 L64.37 47.79 L65.15 47.78 L65.93 47.76 L66.71 47.74 L67.49 47.73 L68.26 47.71 L69.04 47.68 L69.82 47.65 L70.60 47.63 L71.37 47.59 L72.15 47.56 L72.93 47.53 L73.70 47.49 L74.48 47.46 L75.25 47.41 L76.03 47.37 L76.80 47.32 L77.58 47.28 L78.35 47.22 L79.13 47.18 L79.90 47.12 L80.67 47.06 L81.44 47.01 L82.21 46.94 L82.99 46.88 L83.76 46.82 L84.53 46.75 L85.29 46.68 L86.06 46.61 L86.83 46.54 L87.60 46.47 L88.36 46.38 L89.13 46.31 L89.90 46.23 L90.66 46.14 L91.42 46.06 L92.19 45.97 L92.95 45.88 L93.71 45.79 L94.47 45.70 L95.23 45.60 L95.99 45.50 L96.75 45.40 L97.50 45.30 L98.26 45.20 L99.01 45.09 L99.77 44.98 L100.37 45.03 L100.43 45.64 L100.49 46.24 L100.55 46.84 L100.61 47.44 L100.68 48.04 L100.74 48.64 L100.80 49.25 L100.86 49.84 L100.91 50.44 L100.93 51.05 L100.94 51.65 L100.96 52.25 L100.98 52.85 L100.99 53.50 L100.81 54.03 L100.04 54.14 L99.26 54.25 L98.49 54.36 L97.72 54.46 L96.94 54.56 L96.17 54.67 L95.40 54.76 L94.62 54.86 L93.85 54.96 L93.07 55.05 L92.30 55.14 L91.52 55.23 L90.74 55.31 L89.97 55.40 L89.19 55.48 L88.41 55.56 L87.64 55.64 L86.86 55.71 L86.08 55.79 L85.30 55.86 L84.52 55.93 L83.75 55.99 L82.97 56.06 L82.19 56.12 L81.41 56.18 L80.63 56.24 L79.85 56.30 L79.07 56.35 L78.29 56.40 L77.51 56.45 L76.73 56.50 L75.95 56.55 L75.16 56.59 L74.38 56.63 L73.60 56.67 L72.82 56.71 L72.04 56.74 L71.26 56.77 L70.48 56.80 L69.69 56.83 L68.91 56.86 L68.13 56.88 L67.35 56.90 L66.56 56.92 L65.78 56.94 L65.00 56.96 L64.22 56.97 L63.43 56.98 L62.65 56.99 L61.87 56.99 L61.09 57.00 L60.30 57.00 L59.52 57.00 L58.74 57.00 L57.96 56.99 L57.17 56.99 L56.39 56.98 L55.61 56.97 L54.83 56.95 L54.04 56.94 L53.26 56.92 L52.48 56.90 L51.70 56.88 L50.91 56.85 L50.13 56.83 L49.35 56.80 L48.57 56.77 L47.79 56.73 L47.00 56.70 L46.22 56.66 L45.44 56.62 L44.66 56.58 L43.88 56.54 L43.10 56.49 L42.32 56.44 L41.54 56.39 L40.76 56.34 L39.98 56.28 L39.20 56.23 L38.42 56.17 L37.64 56.11 L36.86 56.04 L36.08 55.98 L35.30 55.91 L34.52 55.84 L33.74 55.77 L32.97 55.70 L32.19 55.62 L31.41 55.54 L30.63 55.46 L29.86 55.38 L29.08 55.29 L28.31 55.21 L27.53 55.12 L26.75 55.03 L25.98 54.93 L25.20 54.84 L24.43 54.74 L23.66 54.64 L22.88 54.54 L22.11 54.44 L21.34 54.33 L20.56 54.22 L19.79 54.11 L19.02 54.00 L19.01 53.35 L19.03 52.71 L19.04 52.12 L19.06 51.52 L19.08 50.91 L19.09 50.31 L19.15 49.71 L19.21 49.11 L19.28 48.51 L19.34 47.91 L19.40 47.30 L19.46 46.70 L19.52 46.11 L19.58 45.50 L19.65 44.90Z\"></path><path stroke=\"url(#lftgo3)\" stroke-width=\".9\" fill=\"none\" opacity=\".9\" d=\"M19.66 46.25 L20.04 46.30 L20.41 46.36 L20.79 46.41 L21.17 46.47 L21.55 46.52 L21.93 46.57 L22.31 46.63 L22.69 46.67 L23.07 46.73 L23.44 46.78 L23.82 46.83 L24.20 46.88 L24.59 46.92 L24.97 46.98 L25.35 47.02 L25.73 47.07 L26.11 47.11 L26.49 47.17 L26.87 47.21 L27.25 47.26 L27.63 47.30 L28.02 47.35 L28.40 47.38 L28.78 47.43 L29.16 47.47 L29.55 47.52 L29.93 47.55 L30.31 47.60 L30.70 47.64 L31.08 47.68 L31.46 47.72 L31.85 47.76 L32.23 47.80 L32.62 47.83 L33.00 47.87 L33.39 47.91 L33.77 47.94 L34.16 47.98 L34.54 48.01 L34.93 48.05 L35.31 48.09 L35.70 48.12 L36.08 48.16 L36.47 48.19 L36.85 48.22 L37.24 48.25 L37.63 48.28 L38.01 48.31 L38.40 48.35 L38.79 48.37 L39.17 48.40 L39.56 48.43 L39.95 48.46 L40.34 48.48 L40.72 48.51 L41.11 48.54 L41.50 48.56 L41.89 48.59 L42.27 48.62 L42.66 48.63 L43.05 48.66 L43.44 48.69 L43.83 48.71 L44.21 48.73 L44.60 48.75 L44.99 48.77 L45.38 48.80 L45.77 48.81 L46.16 48.83 L46.55 48.85 L46.94 48.87 L47.32 48.89 L47.71 48.91 L48.10 48.92 L48.49 48.94 L48.88 48.96 L49.27 48.97 L49.66 48.99 L50.05 48.99 L50.44 49.01 L50.83 49.02 L51.22 49.04 L51.61 49.05 L52.00 49.06 L52.39 49.08 L52.78 49.09 L53.17 49.09 L53.56 49.10 L53.95 49.11 L54.34 49.12 L54.73 49.12 L55.12 49.13 L55.51 49.14 L55.90 49.15 L56.29 49.15 L56.68 49.16 L57.07 49.16 L57.46 49.17 L57.85 49.17 L58.24 49.17 L58.63 49.17 L59.02 49.17 L59.41 49.17 L59.80 49.17 L60.20 49.17 L60.59 49.17 L60.98 49.17 L61.37 49.17 L61.76 49.17 L62.15 49.17 L62.54 49.17 L62.93 49.16 L63.32 49.16 L63.71 49.15 L64.10 49.15 L64.49 49.14 L64.88 49.13 L65.27 49.12 L65.66 49.12 L66.05 49.11 L66.44 49.10 L66.83 49.09 L67.22 49.09 L67.61 49.08 L68.00 49.06 L68.39 49.05 L68.78 49.04 L69.17 49.02 L69.56 49.01 L69.95 48.99 L70.34 48.99 L70.73 48.97 L71.12 48.96 L71.51 48.94 L71.90 48.92 L72.29 48.91 L72.68 48.89 L73.06 48.87 L73.45 48.85 L73.84 48.83 L74.23 48.81 L74.62 48.80 L75.01 48.77 L75.40 48.75 L75.79 48.73 L76.17 48.71 L76.56 48.69 L76.95 48.66 L77.34 48.63 L77.73 48.62 L78.11 48.59 L78.50 48.56 L78.89 48.54 L79.28 48.51 L79.66 48.48 L80.05 48.46 L80.44 48.43 L80.83 48.40 L81.21 48.37 L81.60 48.35 L81.99 48.31 L82.37 48.28 L82.76 48.25 L83.15 48.22 L83.53 48.19 L83.92 48.16 L84.30 48.12 L84.69 48.09 L85.07 48.05 L85.46 48.01 L85.84 47.98 L86.23 47.94 L86.61 47.91 L87.00 47.87 L87.38 47.83 L87.77 47.80 L88.15 47.76 L88.54 47.72 L88.92 47.68 L89.30 47.64 L89.69 47.60 L90.07 47.55 L90.45 47.52 L90.84 47.47 L91.22 47.43 L91.60 47.38 L91.98 47.35 L92.37 47.30 L92.75 47.26 L93.13 47.21 L93.51 47.17 L93.89 47.11 L94.27 47.07 L94.65 47.02 L95.03 46.98 L95.41 46.92 L95.80 46.88 L96.18 46.83 L96.56 46.78 L96.93 46.73 L97.31 46.67 L97.69 46.63 L98.07 46.57 L98.45 46.52 L98.83 46.47 L99.21 46.41 L99.59 46.36 L99.96 46.30 L100.34 46.25\"></path><path fill=\"#a6743d\" d=\"M83.29 47.15 L83.65 47.04 L84.00 46.92 L84.36 46.82 L84.72 46.70 L85.07 46.59 L85.43 46.48 L85.78 46.37 L86.14 46.26 L86.49 46.14 L86.76 46.17 L86.86 46.47 L86.95 46.75 L87.05 47.05 L87.14 47.35 L87.24 47.64 L87.33 47.93 L87.43 48.23 L87.52 48.53 L87.62 48.81 L87.72 49.11 L87.81 49.41 L87.91 49.71 L88.00 49.99 L88.10 50.29 L88.18 50.59 L88.26 50.88 L88.34 51.17 L88.42 51.47 L88.50 51.77 L88.59 52.05 L88.67 52.35 L88.75 52.65 L88.78 52.92 L88.41 53.02 L88.04 53.12 L87.67 53.23 L87.29 53.33 L86.92 53.44 L86.55 53.55 L86.18 53.65 L85.81 53.76 L85.44 53.86 L85.25 53.69 L85.17 53.36 L85.09 53.04 L85.00 52.74 L84.92 52.44 L84.84 52.15 L84.75 51.86 L84.67 51.56 L84.59 51.26 L84.51 50.98 L84.42 50.68 L84.34 50.38 L84.25 50.09 L84.15 49.80 L84.06 49.50 L83.96 49.21 L83.86 48.91 L83.77 48.62 L83.67 48.33 L83.58 48.03 L83.48 47.73 L83.39 47.45 L83.29 47.15Z\"></path><path fill=\"#8b5e31\" opacity=\".9\" d=\"M87.65 45.98 L88.03 45.91 L88.41 45.85 L88.79 45.80 L89.17 45.76 L89.56 45.74 L89.95 45.73 L90.34 45.73 L90.73 45.75 L91.12 45.77 L91.50 45.83 L91.89 45.90 L92.26 46.00 L92.63 46.11 L92.99 46.24 L93.33 46.39 L93.66 46.56 L93.98 46.76 L94.27 46.97 L94.55 47.19 L94.70 47.45 L94.65 47.74 L94.61 48.04 L94.56 48.34 L94.52 48.63 L94.47 48.93 L94.43 49.23 L94.38 49.53 L94.34 49.83 L94.29 50.13 L94.24 50.43 L94.18 50.72 L94.11 51.02 L94.05 51.32 L93.98 51.61 L93.92 51.91 L93.85 52.21 L93.79 52.51 L93.65 52.69 L93.30 52.56 L92.93 52.45 L92.56 52.35 L92.18 52.28 L91.79 52.23 L91.40 52.22 L91.01 52.22 L90.62 52.25 L90.23 52.31 L89.86 52.39 L89.49 52.50 L89.13 52.62 L88.79 52.77 L88.46 52.94 L88.14 53.12 L87.88 53.25 L87.88 52.92 L87.88 52.62 L87.88 52.32 L87.88 52.02 L87.88 51.71 L87.88 51.42 L87.88 51.11 L87.88 50.80 L87.88 50.51 L87.88 50.20 L87.86 49.90 L87.85 49.60 L87.83 49.30 L87.81 48.99 L87.80 48.70 L87.78 48.39 L87.77 48.09 L87.75 47.79 L87.73 47.49 L87.72 47.19 L87.70 46.89 L87.69 46.58 L87.67 46.29 L87.65 45.98Z\"></path></g>"};
/* S107: o Mochi se veste para o evento ativo do site (html[data-ev]): chapéu + óculos do tema. Com chapéu, saem o espelho e a faixa, e a cabeça
   embaixo do chapéu não é desenhada (assim nenhum pixel dela aparece). Os acessórios ficam dentro do corpo e seguem todos os movimentos. */
function temaSvg(s){const ev=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,''),t=TEMA_M[ev];if(!t)return s;
 const CORPO='<path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z" fill="url(#lfmb)"';
 s=s.replace('</defs>','<clipPath id="lftcc"><path d="'+t.corte+'"/></clipPath></defs>'+(t.fundo?'<g class="lftf">'+t.fundo+'</g>':''));
 s=s.replace(CORPO,CORPO.replace('<path ','<path clip-path="url(#lftcc)" '));
 s=s.replace('<path d="M30 62 C32 50 41 42 54 39"','<path clip-path="url(#lftcc)" d="M30 62 C32 50 41 42 54 39"');
 s=s.replace('<path d="M17 66 Q60 44 103 66"','<path display="none" d="M17 66 Q60 44 103 66"').replace('<g class="esp"','<g class="esp" display="none"');
 s=s.replace('<g class="itB"></g>','<g class="itB"></g>'+t.tr);
 const a=s.indexOf('<g class="oclT">')+16,f=s.indexOf('<g class="fog"></g>',a),b=s.indexOf('</g></g>',f);if(a>15&&f>a&&b>f)s=s.slice(0,a)+t.ocl+'<g class="fog"></g>'+s.slice(b);
 const i=s.indexOf('<ellipse cx="31" cy="101"');if(i>0)s=s.slice(0,i)+'<g class="lfth">'+t.fr+'</g>'+s.slice(i);
 return s}
window.__lfMochiSvg=function(){if(!document.getElementById('lfmcss')){const st0=document.createElement('style');st0.id='lfmcss';st0.textContent=MOCHI_CSS;document.head.appendChild(st0)}return temaSvg(MOCHI_SVG)};
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
 const MOL={sx:{v:1,t:1,w:0,k:.2,d:.7},sy:{v:1,t:1,w:0,k:.2,d:.7},ti:{v:0,t:0,w:0,k:.09,d:.8},es:{v:0,t:0,w:0,k:.13,d:.86},ob:{v:0,t:0,w:0,k:.12,d:.8},fx:{v:1,t:1,w:0,k:.1,d:.76}};
 const mola=(m,n)=>{if(RM.matches){m.v=m.t;m.w=0;return}for(let i=0;i<n;i++){m.w+=(m.t-m.v)*m.k;m.w*=m.d;m.v+=m.w}};
 const nS=q('.sq'),nT=q('.tilt'),nE=q('.esp'),nO=q('.ocl');M.rot=null;
 M.bracos=function(e,d){if(e!=null)S.te=-e;if(d!=null)S.td=d;if(RM.matches){S.ae=S.te;S.ad=S.td}};
 function armSet(lado,ang,L,fE){const c=lado<0?'e':'d',B=N['aB'+c],F=N['aF'+c],T=armT(lado,ang),p=ARMP(L);let op=cl((1.02-dentro(lado,ang,L))/.14,0,1);if(fE!=null)op=Math.max(op,fE);
  if(B._p!==p){B.firstChild.setAttribute('d',p);B.lastChild.setAttribute('d',ARMH(L));const t=F.firstChild;t.children[0].setAttribute('d',p);t.children[1].setAttribute('d',p);t.children[2].setAttribute('d',ARMHF(L));N['mk'+c].firstChild.setAttribute('d',p);B._p=p}
  B.setAttribute('transform',T);B.style.display=op<1?'':'none';F.firstChild.setAttribute('transform',T);N['mk'+c].setAttribute('transform',T);F.style.display=op>0?'':'none';F.setAttribute('opacity',op.toFixed(3));filSet(lado,ang,L,op<.5)}
function filSet(lado,ang,L,vis){const G=q(lado<0?'.filE':'.filD'),body=q('.corpoF');if(!G||!body)return;if(!vis){if(G._k!==''){G.innerHTML='';G._k=''}return}const key=ang.toFixed(1)+'|'+L.toFixed(1);if(G._k===key)return;G._k=key;
 const NS='http://www.w3.org/2000/svg';let A=filSet.a;if(!A){const sv=document.createElementNS(NS,'svg');sv.setAttribute('style','position:fixed;left:-20px;top:0;width:0;height:0;overflow:hidden');A=document.createElementNS(NS,'path');sv.appendChild(A);document.body.appendChild(sv);filSet.a=A}
 A.setAttribute('d',ARMP(L).replace('M0 -10','M-8 -10 L0 -10').replace(/ Z$/,' L-8 10 Z'));const sx=lado<0?22:98,rt=(lado<0?180-ang:ang)*Math.PI/180,c=Math.cos(rt),s=Math.sin(rt),f=lado<0?-1:1;
 const toS=p=>{const y=p.y*f;return {x:sx+p.x*c-y*s,y:92+p.x*s+y*c}},toL=p=>{const dx=p.x-sx,dy=p.y-92;return {x:dx*c+dy*s,y:(-dx*s+dy*c)*f}};
 const inB=p=>body.isPointInFill(new DOMPoint(p.x,p.y)),inA=p=>A.isPointInFill(new DOMPoint(...Object.values(toL(p))));
 const La=A.getTotalLength(),Lb=body.getTotalLength(),n=90,r=2.6;const aP=t=>toS(A.getPointAtLength(((t%La)+La)%La)),bP=t=>body.getPointAtLength(((t%Lb)+Lb)%Lb);
 let h='',prev=inB(aP(0));for(let i=1;i<=n;i++){const t=La*i/n,cur=inB(aP(t));if(cur!==prev){let lo=La*(i-1)/n,hi=t;for(let k=0;k<14;k++){const m=(lo+hi)/2;(inB(aP(m))===prev)?lo=m:hi=m}
   const tj=(lo+hi)/2,J=aP(tj),sa=prev?1:-1;if(!filSet.bs){filSet.bs=[];for(let k=0;k<400;k++){const u=Lb*k/400,p=body.getPointAtLength(u);filSet.bs.push([u,p.x,p.y])}}let tb=0,bd=1e9;for(const [u,x,y] of filSet.bs){const d=(x-J.x)**2+(y-J.y)**2;if(d<bd){bd=d;tb=u}}
   let sb=1;if(inA(bP(tb+1.5)))sb=-1;const a1=aP(tj+sa*1.5),b1=bP(tb+sb*1.5),ux=a1.x-J.x,uy=a1.y-J.y,vx=b1.x-J.x,vy=b1.y-J.y,
   th=Math.acos(Math.max(-1,Math.min(1,(ux*vx+uy*vy)/Math.hypot(ux,uy)/Math.hypot(vx,vy)))),rr=Math.min(9,Math.max(r,1.7/Math.tan(th/2)));
   const Ap=aP(tj+sa*rr),Bp=bP(tb+sb*rr);const F2=v=>v.toFixed(2),Q=`M${F2(Ap.x)} ${F2(Ap.y)} Q${F2(J.x)} ${F2(J.y)} ${F2(Bp.x)} ${F2(Bp.y)}`;
   const gid=`lfmfg${lado<0?"e":"d"}${i}`;h+=`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${F2(Ap.x)}" y1="${F2(Ap.y)}" x2="${F2(Bp.x)}" y2="${F2(Bp.y)}"><stop offset="0" stop-color="#e8c3d6"/><stop offset="1" stop-color="#ecc9da"/></linearGradient><path d="${Q} L${F2(J.x)} ${F2(J.y)}Z" fill="url(#${gid})" stroke="url(#${gid})" stroke-width=".3" stroke-linejoin="round"/><path d="${Q}" fill="none" stroke="url(#${gid})" stroke-width="1.5" stroke-linecap="butt"/>`}prev=cur}
 G.innerHTML=h}
 let face0=null;function faceSet(f){const k=f?Object.keys(f)[0]||'':'';if(k===face0)return;face0=k;const fz=k==='pisca'||k==='boc',ff=k==='feliz'||(!k&&M.exp==='f');
  q('.olhos').style.opacity=fz||ff?0:1;q('.olhosF').style.opacity=ff&&!fz?1:0;q('.olhosZ').style.opacity=fz?1:0;q('.bF').style.opacity=ff&&!fz&&k!=='boc'?1:0;q('.bH').style.opacity=k==='hmm'?1:0;q('.bY').style.opacity=k==='boc'?1:0;
  q('.bW').style.opacity=(ff||M.fal||k==='hmm'||k==='boc')?0:1;if(k==='olha')M.olha(0,0)}
 let raf=0,t0=performance.now(),lt=t0;
 function frame(now){if(!el.isConnected){raf=0;return}raf=requestAnimationFrame(frame);const dt=Math.min(3,(now-lt)/16.67);lt=now;
  /* braços seguem o alvo com mola (passa um pouquinho e volta, como .34,1.45) */
  for(const c of ['e','d']){const k='a'+c,t='t'+c,v='v'+c;if(RM.matches){S[k]=S[t];S[v]=0;continue}for(let i=0;i<Math.round(dt)||i<1;i++){S[v]+=(S[t]-S[k])*.09;S[v]*=.74;S[k]+=S[v]}}
  let ae=S.ae,ad=S.ad,Le=30,Ld=30,fE=null,fD=null,o={};const g=S.g;
  if(g){const tt=(now-g.t0)/1000;o=g.def.f(Math.min(tt,g.def.dur),g.s,{leve:RM.matches})||{};if(o.ae!=null)ae=o.ae;if(o.ad!=null)ad=o.ad;if(o.Le!=null)Le=o.Le;if(o.Ld!=null)Ld=o.Ld;fE=o.fE;fD=o.fD;
   if(tt>=g.def.dur){S.g=null;if(o.ae!=null){S.ae=ae;S.ve=0}if(o.ad!=null){S.ad=ad;S.vd=0}faceSet(null);g.cb&&g.cb()}}
  armSet(-1,ae,Le,fE);armSet(1,ad,Ld,fD);
  const R=S.res;for(const k of ['gr','gy','mr','my','oy','orr']){if(o[k]!=null)R[k]=o[k];else R[k]*=.86}if(o.oo!=null)R.oo=o.oo;else R.oo+=(1-R.oo)*.2;
  const nf=Math.max(1,Math.round(dt));for(const k in MOL)mola(MOL[k],nf);
  nS.style.transform=`scale(${MOL.sx.v.toFixed(4)},${MOL.sy.v.toFixed(4)})`;nT.style.transform=`rotate(${(M.rot!=null?M.rot:MOL.ti.v).toFixed(2)}deg)`;nE.style.transform=`rotate(${MOL.es.v.toFixed(2)}deg)`;nE.style.transformOrigin='60px 58px';
  N.oclT.setAttribute('transform',`translate(0 ${(R.gy+R.oy+MOL.ob.v).toFixed(2)}) rotate(${(R.gr+R.orr).toFixed(2)} 60 83)`);N.oclT.setAttribute('opacity',R.oo.toFixed(3));N.espT.setAttribute('transform',`translate(0 ${R.my.toFixed(2)}) rotate(${R.mr.toFixed(2)} 60 58)`);
  const fog=fogL(75,'lfmzD',o.fogD||0,86,79)+fogL(45,'lfmzE',o.fogE||0,56,79);if(fog!==S.lastFog){N.fog.innerHTML=fog;S.lastFog=fog}
  const it=(o.itB||'')+'|'+(o.itF||'');if(it!==S.lastIt){N.itB.innerHTML=o.itB||'';N.itF.innerHTML=o.itF||'';S.lastIt=it}
  const h=o.hop||0,sc=o.sc!=null?o.sc:1,sx=(o.sx||1)*sc,sy=(o.sy||1)*sc,ti=(o.tilt||0)+(o.rot||0);const fx=cl(MOL.fx.v,-1,1);N.pulo.setAttribute('transform',`translate(60 0) scale(${(Math.abs(fx)<.02?.02*Math.sign(fx||1):fx).toFixed(3)} 1) translate(-60 0) translate(60 124) translate(0 ${(-h).toFixed(2)}) rotate(${ti.toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(-60 -124)`);
  const pe=o.pe||0;N.pe1.setAttribute('transform',`translate(0 ${(-Math.max(0,pe)).toFixed(2)})`);N.pe2.setAttribute('transform',`translate(0 ${(-Math.max(0,-pe)).toFixed(2)})`);
  if(g)faceSet(o.face||null);
  N.pon.setAttribute('transform',armT(1,ad))}
 raf=requestAnimationFrame(frame);
 /* gesto: começa dos ângulos atuais; só um por vez */
 M.gesto=function(nome,cb){const d=G[nome];if(!d)return false;if(S.g)M.paraGesto();S.g={def:d,t0:performance.now(),s:{ae:S.ae,ad:S.ad},cb};return true};
 M.emGesto=function(){return !!S.g};M.gestoUsa=function(c){return !!(S.g&&(S.g.def.mao||'').indexOf(c)>=0)};
 M.paraGesto=function(){const g=S.g;if(!g)return;S.g=null;faceSet(null);S.lastIt='x'};
 M.olha=function(dx,dy){q('.pup').style.transform=`translate(${(dx||0)*(MOL.fx.t<0?-2.4:2.4)}px,${(dy||0)*1.6}px)`};
 M.cara=function(e){M.exp=e;face0=null;faceSet(S.g?null:null)};
 /* ponteiro de mãozinha com cabo vinho (S58 A + S70): a haste estica até o comprimento todo */
 M.vara=function(on){q('.pon').style.opacity=on?1:0;M.ponOn=!!on;if(!on)M.estica(0,0)};
 M.len=0;M.estica=function(Lh,ms,ex){const h=q('.haste'),g=q('.luva'),FULL=34.3;const alvo=ex?cl(Lh,0,FULL):Lh>0?FULL:0;const ap=x=>{M.len=x;h.setAttribute('d',`M36.7 0 H${(36.7+x).toFixed(2)}`);g.setAttribute('transform',`translate(${(36.7+x).toFixed(2)} 0) scale(.75)`)};
  if(!ms||RM.matches){ap(alvo);return}const a0=M.len,t1=performance.now(),st=3;const f=n=>{let t=Math.min(1,(n-t1)/ms);const k=Math.floor(t*st)/st,fr=(t*st)%1,e=t>=1?1:k+(1/st)*EO(Math.min(1,fr*1.6));ap(a0+(alvo-a0)*Math.min(1,e));if(t<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 M.toca=function(){const g=q('.luva');let k=0;const tik=()=>{if(k>=4)return;const b=`translate(${(36.7+M.len).toFixed(2)} 0) scale(.75)`;g.setAttribute('transform',b+(k%2?'':' translate(3 0)'));k++;setTimeout(tik,110)};tik()};
 M.inclina=function(d){MOL.ti.t=d||0};
 /* S91: vira de lado (mola: o corpo afina, passa pelo meio e abre do outro lado, com um balancinho) */
 M.vira=function(f){f=f<0?-1:1;if(MOL.fx.t===f)return;MOL.fx.t=f;M.empurra(f*-2.2);M.oculosPulo(-1)};M.virado=function(){return MOL.fx.t<0};
 /* desliza com um tiquinho de passada e volta (S88) */
 M.mv=0;M.para=function(){M.mv++};M.flutua=function(nx,ny,dur,fim){const tk=++M.mv,x0=M.x,y0=M.y,t1=performance.now();dur=dur||520;if(RM.matches){M.pos(nx,ny);fim&&fim();return}M.amassa(.96,1.05);const f=n=>{if(tk!==M.mv)return;let t=Math.min(1,(n-t1)/dur),c=1.5,e=1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);M.pos(x0+(nx-x0)*e,y0+(ny-y0)*e);if(t>.5)M.amassa(1,1);if(t<1)requestAnimationFrame(f);else fim&&fim()};requestAnimationFrame(f)};M.empurra=function(v){MOL.ti.w+=v};
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
   if(!RM.matches||/olha|pisca2|inclina/.test(ks.join())){let k=ks[Math.floor(Math.random()*ks.length)];if(RM.matches)k=['olha','pisca2'][Math.floor(Math.random()*2)];ult=k;(L[k]||T_IDLE[k])()}}vida()},2200+Math.random()*1800)};vida();
 M.olhaPara=function(x,y){const r=el.getBoundingClientRect(),cx=r.left+r.width*.45,cy=r.top+r.height*.5,dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy)||1;M.olha(dx/d,dy/d);clearTimeout(M._ol);M._ol=setTimeout(()=>M.olha(0,0),900)};
 M.pisca=function(){const p=q('.pis');p.classList.remove('p');void p.getBBox;requestAnimationFrame(()=>p.classList.add('p'))};
 const piv=setInterval(()=>{if(!el.isConnected){clearInterval(piv);return}if(M.exp!=='f')M.pisca()},3200+Math.random()*1200);
 let ft=0;M.fala=function(ms){M.fal=1;clearTimeout(ft);clearTimeout(M._ff);const bO=q('.bO'),bW=q('.bW');let k=0;const tik=()=>{if(!M.fal)return;const ab=(k++%3)!==2;bO.style.opacity=ab?1:0;bW.style.opacity=ab||M.exp==='f'?0:1;if(M.exp==='f')bO.style.opacity=0;ft=setTimeout(tik,110+Math.random()*90)};tik();
  M._ff=setTimeout(()=>M.calou(),ms)};
 M.calou=function(){M.fal=0;clearTimeout(ft);clearTimeout(M._ff);q('.bO').style.opacity=0;if(M.exp!=='f'&&!face0)q('.bW').style.opacity=1};
 M.amassa=function(sx,sy){MOL.sx.t=sx;MOL.sy.t=sy};M.amassaJa=function(sx,sy){MOL.sx.v=MOL.sx.t=sx;MOL.sy.v=MOL.sy.t=sy;MOL.sx.w=MOL.sy.w=0};
 M.pula=function(nx,ny,dur,alt,fim){dur=dur||700;alt=alt==null?40:alt;const tk=++M.mv,x0=M.x,y0=M.y;M.amassa(1.12,.86);
  setTimeout(()=>{if(tk!==M.mv)return;M.amassa(.9,1.12);const t1=performance.now();const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
   const f=n=>{if(tk!==M.mv)return;let t=Math.min(1,(n-t1)/dur),e=ease(t);M.pos(x0+(nx-x0)*e,y0+(ny-y0)*e-Math.sin(Math.PI*t)*alt);if(t>.45&&t<.6)M.amassa(1,1);
    if(t<1)requestAnimationFrame(f);else{M.amassa(1.14,.84);setTimeout(()=>M.amassa(.97,1.04),140);setTimeout(()=>M.amassa(1,1),280);fim&&fim()}};requestAnimationFrame(f)},150)};
 M.desliza=function(nx,ny,dur){const x0=M.x,y0=M.y,t1=performance.now();dur=dur||600;const f=n=>{let t=Math.min(1,(n-t1)/dur),e=1-Math.pow(1-t,3);M.pos(x0+(nx-x0)*e,y0+(ny-y0)*e);if(t<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 /* S101: mira o ponteiro — o braço gira com a mola e a haste estica/encolhe até o comprimento pedido (telescópica) */
 M.mira=function(a,len,ms){M.bracos(null,a);const h=q('.haste'),g=q('.luva'),ap=x=>{M.len=x;h.setAttribute('d',`M36.7 0 H${(36.7+x).toFixed(2)}`);g.setAttribute('transform',`translate(${(36.7+x).toFixed(2)} 0) scale(.75)`)};
  const a0=M.len||0,t1=performance.now(),tk=M._mk=(M._mk||0)+1;if(!ms||RM.matches){ap(len);return}const f=n=>{if(tk!==M._mk)return;let t=Math.min(1,(n-t1)/ms);ap(a0+(len-a0)*EO(t));if(t<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 M.mao=function(){const r=q('.mao').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
 M.mao2=function(){const r=q('.luva .dedo').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
 return M}

    return Mochi})();

    /* ---------- voz (S66: a fala nunca é cortada; áudios gravados da voz do Mochi; senão a voz mais natural do celular) ---------- */
    var VZ={m:null,a:null,st:'carr',esp:[]};/* S163: st = carr (baixando a lista) · ok · sem (sem voz gravada) */function vzPronta(st){VZ.st=st;var f=VZ.esp;VZ.esp=[];f.forEach(function(x){x()})}try{fetch('/loja/media/voz/'+(ES?'es':'pt')+'/lista.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null}).then(function(j){VZ.m=j;vzPronta(j?'ok':'sem');vcNavega()}).catch(function(){vzPronta('sem')})}catch(_){vzPronta('sem')}
    /* 10/11 S108-1 (aprovado): a voz do Mochi fica PRONTA ANTES, sem baixar a qualidade (MP3 128k, como gravado).
       - navegando na loja com Wi-Fi (celular parado): baixa tudo em silêncio, uma por vez; no 4G/economia de dados não baixa (iPhone não diz se é Wi-Fi → só na consulta)
       - consulta abre: o que faltar baixa na hora, na ordem das falas (entrada, câmera e preparo primeiro), 2 por vez
       - guardado no celular (Cache Storage): as próximas consultas já abrem prontas
       - antes de cada fala o site garante que o áudio chegou; se faltar, anel "Preparando a voz do Mochi…" — nunca boca sem som
       - a câmera inteligente (13 MB) também só baixa antes no Wi-Fi */
    var VC={nm:'lf-voz-'+(ES?'es':'pt'),pr:{},fila:[],rod:0,max:1,tem:{}};
    function vcU(f){return '/loja/media/voz/'+(ES?'es':'pt')+'/'+f}
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
          a.onplaying=function(){if(my===FID&&Z.m&&!PZ.on)Z.m.fala(Math.max(1500,((a.duration||8)-(a.currentTime||0))*1000+600))};a.onpause=a.onwaiting=function(){if(Z.m)Z.m.calou()};
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
    function apos(fn,bt){if(Z.falando){Z.depoisFala=fn;if(bt){bt.classList.add('gd');setTimeout(function(){bt.classList.remove('gd')},900)}return}fn()}
    /* fala(h,cb,pergunta,dizer): cb roda quando ele TERMINA de falar. Se for pergunta, os botões ficam clarinhos até ele terminar. dizer = o que ele fala (se for diferente do balão) */
    function fala(h,cb,perg,dz){if(PZ.on){PZ.fila.push(function(){fala(h,cb,perg,dz)});return}
      /* S163: antes da 1ª fala, espera a lista das vozes (até 8 s, com o anel "Preparando a voz"); a consulta inteira fica numa voz só */
      if(!Z.vm&&!mudo()&&VZ.st==='carr'&&Date.now()-(Z.t0||0)<8000){var my0=FID,an0=setTimeout(function(){vcAnel(true)},350),ja0=0,vai=function(){if(ja0)return;ja0=1;clearTimeout(an0);vcAnel(false);if(!Z.el||my0!==FID)return;Z.vm=VZ.st==='ok'&&VZ.m?'arq':'cel';fala(h,cb,perg,dz)};
        VZ.esp.push(vai);setTimeout(vai,Math.max(0,8000-(Date.now()-(Z.t0||0))));return}
      var b=Z.el&&Z.el.querySelector('#gzbal'),t=String(dz||h).replace(/<[^>]+>/g,''),id=++FID,est=Math.min(7000,700+t.length*62);
      if(b&&!(dz&&b.classList.contains('on')&&b.innerHTML===h)){b.classList.remove('on');setTimeout(function(){if(!Z.el||id!==FID)return;b.innerHTML=h;b.classList.add('on');if(q('#gzjan').hidden)lay()},120)}
      Z.falando=true;var bt=q('#gzbt');if(bt&&perg)bt.classList.add('esp');Z.ocup=Date.now()+est;var boca=function(){if(Z.m&&id===FID)Z.m.fala(est+4000)};
      var feito=false,fim=function(){if(feito||id!==FID)return;feito=true;Z.falando=false;Z.ocup=0;if(Z.m)Z.m.calou();var bt=q('#gzbt');if(bt&&bt.classList.contains('esp')&&!Z.troca){bt.classList.remove('esp');bt.classList.remove('acende');void bt.offsetWidth;bt.classList.add('acende')}
        var p=Z.pend;Z.pend=null;if(cb)cb();var df=Z.depoisFala;Z.depoisFala=null;if(df)df();if(p!=null&&Z.fase==='teste')responde(p)};
      Z.falaT0=vt();var lim=vt()+est+4500,seg=function(){if(feito||id!==FID)return;if(Z.vzEsp){lim=vt()+est+4500}if(vt()<lim){setTimeout(seg,400);return}fim()};setTimeout(seg,est+4500);
      if(VZ.a)try{VZ.a.pause()}catch(_){}try{speechSynthesis.cancel()}catch(_){}
      if(mudo()||!t){boca();setTimeout(fim,Math.min(est,500+t.length*40));return}
      if(!Z.vm)Z.vm=VZ.st==='ok'&&VZ.m?'arq':'cel';
      Z.ultT=t;
      if(Z.vm==='arq'){if(falaArq(t,fim))return;boca();setTimeout(fim,est);return}
      try{var u=new SpeechSynthesisUtterance(t.replace(/\+(\d)[.,](\d\d)/g,function(m,a,b){return gfala(a+'.'+b)}));u.lang=ES?'es-ES':'pt-BR';u.onend=fim;u.onerror=fim;u.onstart=boca;
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
      cx.font=(FS[8]*escala(GS[GS.length-1][0]))+'px '+getComputedStyle(l).fontFamily;return cx.measureText(t).width+10<=s.clientWidth-Math.round(64*L.k)-12-32-10}
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
    (window.__lfCamReg||function(c){(window.__lfCam=window.__lfCam||[]).push(c)})({id:'consulta',aberta:function(){return !!Z.el},fecha:function(){fecha(true)},esc:function(){fecha()}});
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
      bt.style.top=(L.top+L.wh+L.gap)+'px';
      var fr=q('#gzfr');fr.style.left=(L.wl-8)+'px';fr.style.top=(L.top-8)+'px';fr.style.width=(L.ww+16)+'px';fr.style.height=(L.wh+16)+'px';hastes(L.ww+16,L.wh+16);
      /* S114: canto do aro proporcional ao tamanho da lente (antes 74 px fixos: na tela baixa a lente virava pílula) */var rr=Math.round(Math.min(L.ww+16,L.wh+16)*.22);fr.style.borderRadius=rr+'px';fr.querySelectorAll('.gza').forEach(function(e){e.style.borderRadius=rr+'px'});fr.querySelectorAll('.gzv').forEach(function(e){e.style.borderRadius=Math.max(0,rr-9)+'px'});var pm2=pinMapa(L.ww,L.wh);if(pm2&&$('gzpinm'))$('gzpinm').setAttribute('href',pm2);
      var bd=q('#gzbd'),nt=q('#gznt');bd.style.left=L.wl+'px';bd.style.width=L.ww+'px';bd.style.setProperty('--mi',Math.max(6,Math.min(11,Math.floor((L.ww-16)/CX.length-3)))+'px');bd.style.top=(L.top+L.wh+16)+'px';nt.style.left=L.wl+'px';nt.style.width=L.ww+'px';nt.style.top=(L.top+L.wh+16+32)+'px';
      L.mid=L.top+L.wh/2;
      L.Z={ponto:[L.wl+14-199*k,L.mid-70*k],z1:[W-118*k-4,L.top-101*k+5+L.hx],z3:[Math.max(L.wl,W/2-66*k),L.top+L.wh+L.gap-101*k-6],z4:[L.wl+L.ww*.5,L.top-46*k],intro:[2,6+L.hx]};
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
    function lente(g,ja){Z.g=g;var e=escala(g);LS.forEach(function(t,i){var l=q('#gzl'+i);if(l)l.style.fontSize=(FS[i]*e)+'px'});cabe(Z.at);var fr=q('#gzfr'),tg=q('#gztag');
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
    function intro(){Z.fase='intro';Z.vaiCom=0;Z.dir=0;Z.depoisFala=null;cam();modo(false);var m=Z.m;m.modo='livre';m.vira(1);
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
      var poe=function(){var e=d.querySelector('.q');if(!e||!window.LFqr){d.remove();return}e.innerHTML=window.LFqr.svg(location.href.split('#')[0]);setTimeout(function(){d.classList.add('on')},RM.matches?0:900)};
      if(window.LFqr){poe();return}var sc=document.createElement('script');sc.src='lfx/qr.js';sc.onload=poe;sc.onerror=function(){d.remove()};document.head.appendChild(sc)}
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
    function chamaComecar(){var m=Z.m,b=q('#gzcom'),s=q('#gzstg');if(!naIntro()||!b)return;if(Z.falando){Z.ti=setTimeout(chamaComecar,400);return}
      var S=s.getBoundingClientRect(),br=b.getBoundingClientRect(),AB=55,p=ponta(AB,0);
      var fim=function(){if(!naIntro())return;m.olhaPara(br.left+br.width*.7,br.top);
        if(!RM.matches&&b.animate)b.animate([{boxShadow:'0 0 0 0 #8d3a6900',transform:'scale(1)'},{boxShadow:'0 0 0 9px #8d3a6930',transform:'scale(1.03)'},{boxShadow:'0 0 0 0 #8d3a6900',transform:'scale(1)'}],{duration:700,iterations:2,easing:'ease-in-out'});
        fala(T('Quando quiser, é só tocar em Começar.'),function(){setTimeout(function(){if(!naIntro())return;m.estica(0,300,true);setTimeout(function(){if(!naIntro())return;m.vara(0);m.bracos(-35,40);m.modo='livre';m.ocioso=true},320)},600)})};
      m.bracos(null,AB);m.estica(0,250,true);m.flutua(m.x,br.top-S.top-p[1]-3,520,fim)}
    /* Começar: ele termina a frase (se estiver falando), desvira, guarda o ponteiro e segue para a câmera */
    function comeca(bt){if(Z.fase==='intro'){if(Z.vaiCom)return;Z.vaiCom=1;clearTimeout(Z.ti)}corta();camera()}
    /* ---------- S90: câmera só com a resposta da pessoa ---------- */
    function camera(){clearTimeout(Z.ti);var m=Z.m;if(!m)return;Z.fase='cam';Z.dir=0;Z.semCam=0;Z.escolheu=0;m.paraGesto();m.ocioso=false;m.para();if(m.ponOn&&!RM.matches){m.estica(0,180,true);setTimeout(function(){Z.m&&Z.fase!=='intro'&&Z.m.vara(0)},200)}else m.vara(0);m.bracos(-35,40);m.vira(1);m.cara('n');m.modo='livre';regra(-1);
      var c=q('#gzc');c.style.paddingBottom='';try{Z.el.scrollTo({top:0,behavior:RM.matches?'auto':'smooth'})}catch(_){Z.el.scrollTop=0}
      vaiA('intro',RM.matches?'ja':'pula');lay();
      if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){semCam();return}
      var pq;try{pq=navigator.permissions.query({name:'camera'}).then(function(r){return r.state},function(){return 'prompt'})}catch(_){pq=Promise.resolve('prompt')}
      /* S238: se o aparelho não tem nenhuma câmera, não pergunta — segue direto sem câmera */
      var tc;try{tc=navigator.mediaDevices.enumerateDevices().then(function(d){return d.some(function(x){return x.kind==='videoinput'})},function(){return true})}catch(_){tc=Promise.resolve(true)}
      Promise.all([pq,tc]).then(function(rr){var st=rr[0];if(!Z.el||Z.fase!=='cam')return;if(st==='granted'){prep();return}if(st==='denied'||!rr[1]){semCam();return}
        conteudo('<div class="gzav gzcam"><p><b>📷 '+T('Câmera só para medir a distância')+'</b></p><p class="mu">'+T('Nada é gravado nem enviado.')+'</p></div>'+
          '<button type="button" class="gzgo" data-gz="camsim">'+T('Usar a câmera')+'</button><button type="button" class="gzgo o" data-gz="camnao">'+T('Fazer sem câmera')+'</button>');
        fala(T('Posso usar a câmera?')+' '+T('É só para medir a distância do celular até o seu rosto.')+' '+T('Nada é gravado.')+' '+T('Se preferir, a gente faz sem.'),function(){if(Z.m&&Z.fase==='cam'&&!Z.escolheu)Z.m.ocioso=true})})}
    /* a janelinha do celular só aparece aqui; enquanto ela está aberta ele espera, calado */
    function camSim(){if(Z.fase!=='cam')return;Z.fase='camw';var m=Z.m;m.ocioso=false;m.paraGesto();fala(T('É só tocar em "Permitir" na janelinha.'));
      abreCam().then(function(st){if(!Z.el||Z.fase!=='camw'){st.getTracks().forEach(function(t){t.stop()});return}liga(st);corta();prep(T('Obrigado!'))},
        function(){if(!Z.el||Z.fase!=='camw')return;corta();semCam()})}
    function semCam(){if(!Z.el)return;Z.semCam=1;cam();chip(T('Segure a 30 cm'));prep(T('Tudo bem, sem problema!')+' '+T('Vamos sem a câmera: segure o celular a uns 30 centímetros, um palmo.'))}
    function prep(pre){clearTimeout(Z.ti);Z.fase='prep';Z.dir=0;try{Z.el.scrollTo({top:0,behavior:RM.matches?'auto':'smooth'})}catch(_){Z.el.scrollTop=0}medir();var m=Z.m;m.paraGesto();m.ocioso=false;m.cara('n');q('#gzc').style.paddingBottom='';
      conteudo('<div class="gzeb">'+T('PREPARANDO')+'</div><h2>'+T('Tire os óculos e segure o celular a 30 cm')+'</h2><p class="gzp">'+T('Um palmo do rosto. Lente de contato pode ficar.')+'</p>');
      vaiA('intro',RM.matches?'ja':'pula');
      var ini=function(){if(!Z.m||Z.fase!=='prep')return;fala(T('Faz como eu: tire os óculos…'),function(){Z.p2=1;Z.segP&&Z.segP()});setTimeout(function(){Z.m&&Z.fase==='prep'&&Z.m.gesto('tiraOculos')},700);
        Z.tc=setTimeout(function(){Z.p1=1;seg()},2500)};if(pre)fala(pre,ini);else ini();var seg=function(){if(!Z.m||Z.fase!=='prep'||!Z.p1||!Z.p2)return;Z.p1=Z.p2=0;m.oculosPulo(-1.5);m.pisca();fala(T('…e segure o celular a 30 centímetros, um palmo.'),function(){Z.tc=setTimeout(teste,700)})};Z.p1=Z.p2=0;Z.segP=seg}
    function teste(){if(!Z.el)return;Z.el.scrollTop=0;Z.fase='teste';Z.at=0;Z.g=0;Z.falhou={};Z.leu={};Z.okLente=0;Z.desce=0;Z.us={};Z.fora=0;Z.ppRep=0;Z.slot=null;Z.ok2=0;Z.ko2=0;Z.bracoDisse=0;Z.luzP=0;Z.lzT=0;Z.lzE=0;sorteiaQuadro();botoes('t');modo(true);monta();try{if(!bulaCabe(LS[8]))trocaUltima()}catch(_){}Z.m.modo='trab';
      vaiA('ponto','pula',function(){aponta();luz(function(){pergunta(true)})})}
    /* botões embaixo do quadro: t = teste, luz = pouca luz, pp = ponto próximo */
    function botoes(k){var b=q('#gzbt');if(!b)return;var A={t:[['sim','Consigo ler'],['nao','Não consigo']],luz:[['luzok','Já melhorou'],['luzseg','Continuar assim']],pp:[['emb','Embaçou aqui'],['nemb','Não embaça']]}[k];
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
    function livre(){var m=Z.m;if(!m)return;m.modo='livre';if(RM.matches||Math.random()<.5)return;
      var zs=(L.gap>=100*L.k&&!q('#gzbd').classList.contains('on'))?['z1','z3','z4']:['z1','z4'],z=zs[Math.floor(Math.random()*zs.length)];m.paraGesto();m.vara(0);
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
              fala(pri?T('Leu! Agora vou tirando um pouquinho de grau, até achar o mais leve que ainda funciona.'):frRoda('conf'),w());trocaLente(mf,w());setTimeout(function(){Z.m&&Z.fase==='teste'&&trocaUltima()},300)})},450);return}
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
    function longeDemais(){if(Z.semCam||!Z.st)return false;var n=Date.now();if(n-(Z.rosto||0)>700)return false;var a=(Z.hd||[]).filter(function(x){return n-x[0]<=1000&&x[2]});if(a.length<2)return false;return a.every(function(x){return x[1]>LIM})}
    function bracoEsticado(){var m=Z.m;clearTimeout(Z.tq);m.ocioso=false;m.gesto('pensando');var bb=q('#gzbt [data-gz="sim"]');if(bb){bb.classList.add('gd');setTimeout(function(){bb.classList.remove('gd')},900)}
      var f=T('Segure a um palmo e me diga de novo.');if(!Z.bracoDisse){Z.bracoDisse=1;f=T('Você afastou o celular para conseguir ler — isso é sinal de vista cansada.')+' '+f}
      fala(f,function(){Z.qt=Date.now();espera()},true)}
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
    function fimQuadro(G){if(!Z.m)return;if(Z.semCam||!Z.st||Date.now()-(Z.rosto||0)>6000){resultado(G);return}ppIni(G,0)}
    function ppIni(G,n){var m=Z.m;if(!m)return;if(Z.lupa){Z.lupa=0;q('#gzfita').classList.remove('lupa');lay()}Z.fase='pp';Z.ppG=G;if(!n)Z.ppD=[];clearTimeout(Z.tq);bandeja(false);var fr=q('#gzfr');fr.classList.remove('on','br');q('#gzfw').classList.remove('pin');Z.g=0;Z.at=1;Z.slot=null;
      var f0=q('#gzfita');f0.style.top='0px';f0.innerHTML='<div class="gzl p3 hl" id="gzl1"><span>'+esc(LS[3])+'</span></div><div class="gzpph" style="position:absolute;left:0;right:0;top:'+Math.round(L.wh*.68)+'px">'+T('aproxime devagar')+' ↓</div>';var l1=q('#gzl1');l1.style.fontSize=FS[3]+'px';l1.style.top=(SLOT[1]*L.wh)+'px';botoes('pp');
      if(Z.longe)volta();else{m.modo='trab';aponta()}
      var f=n===1?T('Mais uma vez: afaste um pouco e aproxime de novo, devagar.'):n===2?T('Uma última vez, para ter certeza.'):T('Agora uma última coisa: aproxime o celular devagar e toque quando as letras começarem a embaçar.');
      setTimeout(function(){Z.m&&Z.fase==='pp'&&fala(f)},500)}
    function ppPonto(d){var G=Z.ppG,a=Z.ppD;if(d!=null)a.push(d);
      if(a.length===1&&d!=null){ppIni(G,1);return}
      if(a.length===2&&Math.abs(a[0]-a[1])>3){ppIni(G,2);return}
      if(!a.length){resultado(G);return}
      var dm=a.length===3?med(a):a.reduce(function(x,y){return x+y},0)/a.length;ppFim(ppConta(dm))}
    function ppFim(pp){if(Z.fase!=='pp')return;resultado(Z.ppG,{pp:pp,ok:Math.abs(Math.max(.25,pp)-Z.ppG)<=.25||(pp===0&&Z.ppG<=.25)})}
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
    function confete(){if(RM.matches)return;var s=q('#gzstg'),C=['#8d3a69','#f3d6e4','#f2b24c','#7fc4a4'];for(var i=0;i<40;i++){var c=document.createElement('div');c.className='gzcf';c.style.left=(30+Math.random()*(s.clientWidth-60))+'px';c.style.top='120px';c.style.background=C[i%4];s.appendChild(c);
      (function(c){var an=c.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+((Math.random()-.5)*170)+'px,'+(260+Math.random()*220)+'px) rotate('+(Math.random()*720)+'deg)',opacity:0}],{duration:1800+Math.random()*900,easing:'cubic-bezier(.2,.6,.4,1)'});an.onfinish=function(){c.remove()}})(c)}}
    /* S69: resultado = a lente mais fraca com que leu a bula, com a faixa provável (±0,25) e "na dúvida, o menor" */
    function resultado(G,pp){try{window.__lfGm&&window.__lfGm(G)}catch(_){}var esc0=Z.escuro||(Z.lzT>5&&Z.lzE/Z.lzT>.5);fimTeste();var GQ=G,m=Z.m,lo=gf(Math.max(.25,G-.25)),hi=gf(Math.min(4,G+.25)),ppH='';
      /* S95 E: quadro + ponto próximo. Combinam (até 0,25) = um grau só; não combinam = faixa entre os dois e o sugerido é o menor */
      if(pp){var pv=Math.max(.25,pp.pp);if(!pp.ok){lo=gf(Math.min(G,pv));hi=gf(Math.max(G,pv));G=Math.min(G,pv)}}
      Z.G=G;Z.g=G;
      if(pp){
        ppH='<p class="gzp gzpp">'+T('Quadro de leitura:')+' '+gf(GQ)+'<br>'+T('Ponto próximo:')+' '+(pp.pp?gf(pp.pp):T('não precisa'))+(pp.ok?' <b>✓ '+T('combinam')+'</b>':'')+'</p>'}
      conteudo('<div class="gzeb">'+T('SEU GRAU PARA COMEÇAR')+'</div><div class="gzrs"><div class="gzres">'+gf(G)+'</div><p class="gzp">'+T('Com a lente')+' '+gf(GQ)+' '+T('você leu até a última frase.')+'<br>'+T('Faixa provável:')+' '+lo+' '+T('a')+' '+hi+'</p>'+ppH+(esc0?'<p class="gzp gzlz">'+T('Feito com pouca luz — pode ter saído um pouco mais forte.')+'</p>':'')+'</div>'+
        '<p class="gzp" style="text-align:center;margin-top:14px">'+T('Quer escolher outro?')+'</p>'+
        '<div class="gzaj"><button type="button" class="gzpm" data-gz="menos" aria-label="'+T('Menos grau')+'">−</button><div><b id="gzgv">'+gf(G)+'</b><small id="gzgl">'+T('sugerido')+'</small></div><button type="button" class="gzpm" data-gz="mais" aria-label="'+T('Mais grau')+'">+</button></div>'+
        '<p class="gzp" style="text-align:center;font-size:13.5px;margin-top:6px">'+T('Na dúvida entre dois graus, fique com o menor.')+' '+T('Este grau é para ler a uns 30 cm, como o celular.')+'</p>'+
        '<button type="button" class="gzgo" data-gz="ver" id="gzver">'+T('Ver óculos de leitura')+' '+gf(G)+'</button><button type="button" class="gzgo o" data-gz="guarda">'+T('Guardar meu grau')+'</button>'+avisos());
      setTimeout(function(){if(!Z.m)return;m.cara('f');m.gesto('comemora');m.espelho();fala(pp&&pp.ok?T('Pronto!')+' '+T('As duas medidas combinam.'):pp?T('Pronto!')+' '+T('As medidas ficaram um pouco diferentes.')+' '+T('Na dúvida, fique com o menor.'):T('Pronto! O grau que mais combina com você é')+' '+gf(G)+'.',function(){if(!Z.m)return;Z.m.acena(6);setTimeout(function(){if(!Z.m)return;m.cara('n');m.ocioso=true},1500)})},500)}
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
      (window.__lfFakeMp?Promise.resolve(window.__lfFakeMp):mpLoad()).then(function(lm){Z.mp=lm;vai()},function(){});
      (window.__lfFakeFa?Promise.resolve(window.__lfFakeFa):faLoad()).then(function(fa){Z.fa=fa;vai()},function(){if(!Z.mp)chip(T('Segure a 30 cm'))})}
    function medir(){if(Z.semCam){chip(T('Segure a 30 cm'));return}if(Z.st)return;abreCam().then(liga,function(){if(!Z.el)return;Z.semCam=1;chip(T('Segure a 30 cm'))})}
    var hist=[],med=function(a){var s=a.slice().sort(function(x,y){return x-y});return s[Math.floor(s.length/2)]};
    var hist10=[];
    /* uma medida nova: d em cm; ok = a câmera tem certeza (íris dos dois olhos, rosto de frente) */
    function poeMedida(d,ok){var n=Date.now();hist10.push(d);if(hist10.length>10)hist10.shift();Z.d=med(hist10);Z.rosto=n;Z.hd=(Z.hd||[]).filter(function(x){return n-x[0]<3000});Z.hd.push([n,d,ok]);
      if(Z.fase==='pp'){chip(Math.round(Z.d)+' cm');return}
      if(Z.fase!=='teste'&&Z.fase!=='prep'){chip(Math.round(Z.d)+' cm ✓',true);return}
      if(escuro()){chip(T('Pouca luz'));return}
      /* S96: sem avisos falados; acima de 38 cm a etiqueta fica laranja (o cliente percebe sozinho) */
      if(Z.d>38)chip(Math.round(Z.d)+' cm',false,true);else if(Z.d<20)chip(Math.round(Z.d)+' cm');else chip(Math.round(Z.d)+' cm ✓',true)}
    function laco(){if(!Z.el||!Z.st)return;var v=Z.v,fa=Z.fa;if(!v.videoWidth||(!Z.mp&&!fa)){Z.tm=setTimeout(laco,250);return}
      var W=320,H=Math.round(W*v.videoHeight/v.videoWidth),cv=Z.cv||(Z.cv=document.createElement('canvas'));cv.width=W;cv.height=H;var cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(v,0,0,W,H);
      /* S89 D: brilho do meio da imagem (nada é gravado) */
      try{var dd=cx.getImageData(W*.2|0,H*.15|0,W*.6|0,H*.7|0).data,sm=0,nn=0;for(var ii=0;ii<dd.length;ii+=64){sm+=dd[ii]*.299+dd[ii+1]*.587+dd[ii+2]*.114;nn++}var lu=window.__lfFakeLum!=null?window.__lfFakeLum:sm/nn;Z.lum=Z.lum==null?lu:Z.lum*.6+lu*.4;
        if(Z.fase==='teste'&&!Z.luzP){Z.lzT++;if(escuro())Z.lzE++}}catch(_){}
      /* S95 A / S98: íris (11,7 mm em quase todo adulto) na imagem grande (até 1280 px) */
      /* para não pesar no celular: a 1ª leitura é na imagem inteira (640 px); depois, só um recorte em volta do rosto, na resolução cheia (os olhos ficam com muito mais pontos) */
      if(Z.mp){var VW=v.videoWidth,VH=v.videoHeight,bx=Z.bx,sx=0,sy=0,sw=VW,sh=VH,S2=640;
        if(bx){var cxm=bx[0]+bx[2]/2,cym=bx[1]+bx[3]/2,lado=Math.min(VW,VH,Math.max(bx[2],bx[3])*1.7);sw=sh=lado;sx=Math.max(0,Math.min(VW-lado,cxm-lado/2));sy=Math.max(0,Math.min(VH-lado,cym-lado/2));S2=Math.min(512,Math.round(lado))}
        var W2=bx?S2:Math.min(640,VW),H2=bx?S2:Math.round(W2*VH/VW),c2=Z.cv2||(Z.cv2=document.createElement('canvas'));c2.width=W2;c2.height=H2;c2.getContext('2d').drawImage(v,sx,sy,sw,sh,0,0,W2,H2);
        Z.mpk=sw/W2;var r=null;try{r=Z.mp.detect(c2)}catch(_){r=null}var P=r&&r.faceLandmarks&&r.faceLandmarks[0],n=Date.now();
        if(P&&P.length>=478){var kx=sw/W2,ky=sh/H2;/* pixels do recorte → pixels da imagem da câmera */
          var ir=function(c){return (Math.hypot((P[c+1].x-P[c+3].x)*W2*kx,(P[c+1].y-P[c+3].y)*H2*ky)+Math.hypot((P[c+2].x-P[c+4].x)*W2*kx,(P[c+2].y-P[c+4].y)*H2*ky))/2},a=ir(468),b=ir(473);
          var x0=1,y0=1,x1=0,y1=0;P.forEach(function(p){if(p.x<x0)x0=p.x;if(p.y<y0)y0=p.y;if(p.x>x1)x1=p.x;if(p.y>y1)y1=p.y});Z.bx=[sx+x0*sw,sy+y0*sh,(x1-x0)*sw,(y1-y0)*sh];
          var mn=Math.min(a,b),mx=Math.max(a,b),ok=mn>5&&mn/mx>.8,di=ok?(a+b)/2:mx,f2=(VW/2)/Math.tan(31*Math.PI/180);
          if(di>3)poeMedida(f2*1.17/di,ok)}
        else{Z.bx=null;if(n-(Z.rosto||0)>2000)chip(T('Não vejo o seu rosto'))}
        Z.tm=setTimeout(laco,350);return}
      fa.detectSingleFace(cv,new fa.TinyFaceDetectorOptions({inputSize:224,scoreThreshold:.4})).withFaceLandmarks(!FA.full).then(function(r){if(!Z.el||!Z.st)return;var n=Date.now();
        if(r&&r.landmarks){var P=r.landmarks.positions,c=function(a,b){var x=0,y=0;for(var i=a;i<=b;i++){x+=P[i].x;y+=P[i].y}return [x/(b-a+1),y/(b-a+1)]},e1=c(36,41),e2=c(42,47),ipd=Math.hypot(e1[0]-e2[0],e1[1]-e2[1]);
          /* distância entre os olhos varia muito de pessoa para pessoa: a medida vale para a etiqueta, mas fica "em dúvida" (nunca tira a resposta do cliente) */
          var f=(W/2)/Math.tan(31*Math.PI/180);poeMedida(f*6.3/ipd,false)}
        else if(n-(Z.rosto||0)>2000)chip(T('Não vejo o seu rosto'));
        Z.tm=setTimeout(laco,350)},function(){Z.tm=setTimeout(laco,600)})}
    function perto(g){var G=navGraus(),b='',d=1e9;G.forEach(function(x){var k=Math.abs(gn(x)-g);if(k<d-1e-9){d=k;b=x}});return b}
    document.addEventListener('pointerdown',function(e){if(Z.el&&Z.bloq&&Z.el.contains(e.target)&&!(e.target.closest&&e.target.closest('[data-gz=mudo]')))somLibera()},true);
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-gzopen],[data-gz]');if(t&&t.getAttribute('data-gz')==='mudo'&&Z.bloq){e.preventDefault();e.stopPropagation();somLibera();return}if(!t)return;
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
      if(k==='emb'||k==='nemb'){if(Z.fase!=='pp'||Z.ppOc)return;Z.ppOc=1;setTimeout(function(){Z.ppOc=0},800);corta();(function(){if(Z.fase!=='pp')return;if(k==='nemb'){ppFim(0);return}ppMede(function(d){ppPonto(d)})})();return}
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
    function gzPeca(){return;var L=document.querySelector('#layer .dgr');if(!L)return;var p=find(prodRef);if(!p||p.tipo!=='grau'||!p.gr||!p.gr.length)return;
      var b=document.querySelector('#layer .gzb'),m=meu();if(!b){b=document.createElement('button');b.type='button';b.className='gzb';b.setAttribute('data-gzopen','')}
      if(L.nextSibling!==b)L.parentNode.insertBefore(b,L.nextSibling);
      /* com o grau guardado, a peça já escolhe o grau mais perto que existe na cor (uma vez por peça) */
      if(m&&b._ap!==p.ref){var bs=[].slice.call(L.querySelectorAll('.gb')).filter(function(x){return x.style.display!=='none'&&!x.classList.contains('some')&&!x.classList.contains('nc')&&!x.classList.contains('x')}),bb=null,dd=1e9;
        bs.forEach(function(x){var z=Math.abs(gn(x.textContent)-gn(m));if(z<dd-1e-9||(Math.abs(z-dd)<1e-9&&gn(x.textContent)>gn(bb.textContent))){dd=z;bb=x}});b._ap=p.ref;if(bb&&!bb.classList.contains('on'))bb.click()}
      b.innerHTML='<span>'+(m?T('Seu grau: ')+esc(m):T('Não sei o meu grau'))+'<small>'+(m?T('Refazer a ajuda com o grau'):T('Descubra em 1 minuto, com voz'))+'</small></span><i aria-hidden="true">›</i>'}
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
  /* S288 abas de Minha conta de luxo (aprovado S252): a pílula desliza até a aba tocada e o conteúdo vem do lado dela; a janela não refaz a entrada */
  var _minhaContaLx=minhaConta;minhaConta=function(){var m0=document.querySelector('#layer .mct'),o=m0&&m0.querySelector('button.on'),r0=null,de=-1,c0='';
    if(o){var mr=m0.getBoundingClientRect(),r=o.getBoundingClientRect();r0=[r.left-mr.left,r.width,r.top-mr.top,r.height];de=[].indexOf.call(m0.querySelectorAll('button'),o);c0=getComputedStyle(o).backgroundColor}
    var res=_minhaContaLx.apply(this,arguments);
    try{var m=document.querySelector('#layer .mct'),n=m&&m.querySelector('button.on');if(!m||!n||de<0||!m.animate)return res;
      var bs=m.querySelectorAll('button'),para=[].indexOf.call(bs,n),sc=m.closest('.scrim'),p=m.parentNode;if(sc)sc.classList.add('mcLx');
      if(para===de||matchMedia('(prefers-reduced-motion: reduce)').matches)return res;
      [].forEach.call(p.children,function(e){try{e.getAnimations().forEach(function(x){x.cancel()})}catch(_){}});
      var X='cubic-bezier(.16,1,.3,1)',mr2=m.getBoundingClientRect(),nr=n.getBoundingClientRect(),v=bs[de],cv=getComputedStyle(v).color,cn=getComputedStyle(n).color;
      var pl=document.createElement('i');pl.className='mcPl';pl.setAttribute('aria-hidden','true');pl.style.cssText='top:'+(nr.top-mr2.top-m.clientTop)+'px;height:'+nr.height+'px;left:'+(nr.left-mr2.left-m.clientLeft)+'px;width:'+nr.width+'px;background:'+c0;
      m.classList.add('lx');m.insertBefore(pl,m.firstChild);
      var dx=r0[0]-(nr.left-mr2.left),kf=Math.abs(r0[1]-nr.width)<1.5?[{transform:'translateX('+dx+'px)'},{transform:'none'}]:[{transform:'translateX('+dx+'px)',width:r0[1]+'px'},{transform:'none',width:nr.width+'px'}];
      var an=pl.animate(kf,{duration:360,easing:X,fill:'both'}),fim=function(){if(pl.parentNode)pl.parentNode.removeChild(pl);m.classList.remove('lx')};an.onfinish=fim;setTimeout(fim,460);
      n.animate([{color:cv},{color:cn}],{duration:200,delay:60,fill:'backwards'});v.animate([{color:cn},{color:cv}],{duration:160});
      var s=para>de?1:-1,d=false;[].forEach.call(p.children,function(e){if(e===m){d=true;return}if(d)e.animate([{opacity:0,transform:'translateX('+(22*s)+'px)'},{opacity:1,transform:'none'}],{duration:360,easing:X,fill:'backwards'})})}catch(_){}
    return res};
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
    I.onload=function(){try{
        var b=lfqMede(I);if(!b)throw 0;var asp=nat?I.naturalWidth/I.naturalHeight:bw/bh,CW=Math.min(1000,Math.max(400,Math.round(bw*(window.devicePixelRatio||1)*1.15))),CH=Math.round(CW/asp);
        var fw=b.w*I.naturalWidth,fh=b.h*I.naturalHeight,sc=Math.min(CW*cf[1]/fw,CH*cf[2]/fh),c=document.createElement('canvas');c.width=CW;c.height=CH;var g=c.getContext('2d');
        g.fillStyle=b.bg;g.fillRect(0,0,CW,CH);g.imageSmoothingQuality='high';var dw=I.naturalWidth*sc,dh=I.naturalHeight*sc;
        g.drawImage(I,CW/2-(b.x+b.w/2)*dw,CH*cf[3]-(b.y+b.h/2)*dh,dw,dh);
        c.toBlob(function(bl){acaba(bl?URL.createObjectURL(bl):src,bl)},'image/jpeg',.9)
      }catch(_){acaba(src)}};
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
    else if(!p.foto){var sv=card.querySelector('.hci svg,.ph>svg');if(sv)sv.outerHTML=glasses(p.cores[i],p.raio,5)}},true);
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
    var off=0;(function tick(){off=(off+.22)%L;a.setAttribute('startOffset',off);b.setAttribute('startOffset',off-L);requestAnimationFrame(tick)})()})();

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
    try{fetch(fnUrl('analise'),{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(b),keepalive:true}).catch(function(){})}catch(_){}}
  /* as peças vistas já são contadas por vistaConta (lf_vc): marca que há algo novo para mandar */
  var _vistaConta8=vistaConta;vistaConta=function(){var r=_vistaConta8.apply(this,arguments);try{sessionStorage.setItem('lf_vc_n0','1')}catch(_){}return r};
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
  function amCard(c){return '<div class="amc"><div class="amfig">'+moFig('feliz',20,-10)+TICKET+'<i class="amsp a1">✦</i><i class="amsp a2">✦</i></div>'+
    '<h3>'+LFI.tr('Presenteie uma amiga com 10%')+'</h3><p>'+LFI.tr('Ela ganha 10% na 1ª compra. Quando ela comprar, você ganha outro cupom de 10%.')+'</p>'+
    '<code>'+esc(c.cod)+'</code><a class="amwa" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(amMsg(c.cod))+'">'+LFI.tr('Enviar pelo WhatsApp')+'</a></div>'}
  var _pkOk=pkOk;pkOk=function(id,o){_pkOk(id,o);
    var poe=function(am){if(!am||!am.cod)return;var b=document.querySelector('.pkb:last-of-type')||[].slice.call(document.querySelectorAll('.pkb')).pop();if(!b||document.querySelector('.amc'))return;
      var w=document.createElement('div');w.className='amwrap';w.innerHTML=amCard(am);b.parentNode.insertBefore(w,b);moPoe()};
    var e=pedGet(id)||{};if(e.am)return poe(e.am);
    var c=getConta()||{};if(!c.tel)return;
    cupFn({acao:'proxima',pid:id,tel:c.tel,email:c.email||'',lang:LFI.lang}).then(function(j){if(j&&j.ok&&j.amiga){var L=lsG('lf_ped',[]);L.forEach(function(x){if(x.id===id)x.am=j.amiga});lsS('lf_ped',L);poe(j.amiga)}},function(){})};
  /* Minha conta › Cartões: contador embaixo do cartão da amiga */
  var _mtj=mtjCarrega;mtjCarrega=function(){_mtj();var k=0,t=setInterval(function(){var b=document.getElementById('mtj');if(!b||++k>40){clearInterval(t);return}
    var bt=b.querySelector('[data-cupcopy]');if(!bt)return;clearInterval(t);
    cupFn({acao:'meus'}).then(function(j){var c=((j&&j.cupons)||[]).filter(function(x){return x.tipo==='am'})[0];if(!c)return;
      var cp=b.querySelector('[data-cupcopy="'+c.cod+'"]');if(!cp||b.querySelector('.amct'))return;
      var d=document.createElement('div');d.className='amct';d.innerHTML='<div><span>'+LFI.tr('Amigas que compraram')+'</span><b>'+(c.amigas||0)+'</b></div><div><span>'+LFI.tr('Cupons que você ganhou')+'</span><b class="g">'+(c.ganhos||0)+' × 10%</b></div><div><span>'+LFI.tr('Você pode indicar')+'</span><b>'+LFI.tr('até')+' '+(c.porMes||5)+' '+LFI.tr('por mês')+'</b></div>'+
        '<a class="amwa" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(amMsg(c.cod))+'">'+LFI.tr('Enviar pelo WhatsApp')+'</a>';
      cp.closest('.mtc').appendChild(d)},function(){})},150)};
  /* a amiga abre lafouch.com/t/CÓDIGO: Mochi surpresa */
  function amSurpresa(){if(document.getElementById('amov'))return;var o=document.createElement('div');o.id='amov';o.setAttribute('role','dialog');o.setAttribute('aria-label',LFI.tr('Sua amiga te deu 10%!'));
    o.innerHTML='<div class="amsc"><button type="button" class="amx" aria-label="'+LFI.tr('Fechar')+'">×</button><div class="amfig s">'+moFig('surpresa',-30,-30)+'<i class="amsp a1">✦</i><i class="amsp a2">✦</i><i class="amsp a3">✦</i></div><h3>'+LFI.tr('Sua amiga te deu 10%!')+'</h3><p>'+LFI.tr('O desconto já está no seu carrinho. Vale na 1ª compra, por 1 ano.')+'</p></div><button type="button" class="amver">'+LFI.tr('Veja as peças que aceitam cupom')+' ↓</button>';
    document.body.appendChild(o);moPoe();requestAnimationFrame(function(){o.classList.add('on')});
    var fecha=function(){o.classList.remove('on');setTimeout(function(){o.remove()},320)};
    o.addEventListener('click',function(e){if(e.target===o||e.target.closest('.amx'))fecha();else if(e.target.closest('.amver')){fecha();var g=document.querySelector('#grid,#home');if(g)g.scrollIntoView({behavior:'smooth'})}})}
  window.__lfS201={ok:function(id,o){pkOk(id,o||{})},sur:amSurpresa};
  var _cupA=cupAplica;cupAplica=function(cod,cb){var q=new URLSearchParams(location.search).get('t');_cupA(cod,function(j){if(j&&j.ok&&j.cupom&&j.cupom.tipo==='am'&&q&&String(q).toUpperCase()===String(cod).toUpperCase())amSurpresa();if(cb)cb(j)})};

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
    function opBloco(id){var e=pedGet(id),o=$('pkok');if(!e||!o||o.querySelector('.opd'))return;var vis={},its=(e.itens||[]).filter(function(i){if(!i||!i.ref||vis[i.ref])return false;vis[i.ref]=1;return true});if(!its.length)return;
      var box=o.querySelector('.pkb,.pkc,[role=dialog]>div')||o;
      box.insertAdjacentHTML('beforeend',its.map(function(i){var p=find(i.ref)||{};return '<div class="opd" data-opref="'+esc(i.ref)+'"><div class="it">'+(p.foto?'<img src="'+esc(p.foto)+'" alt="">':'')+'<div><small>'+esc(p.ds||p.mat||'')+'</small><b>'+esc(i.ref)+'</b></div></div><div class="opq">'+LFI.tr('O que achou?')+'</div><div class="st">'+[1,2,3,4,5].map(function(k){return '<button type="button" data-opst="'+k+'" class="'+(k<=5?'on':'')+'" aria-label="'+k+'">★</button>'}).join('')+'</div><textarea maxlength="500" placeholder="'+LFI.tr('Conte como ficou (opcional)')+'"></textarea><button type="button" class="go" data-opgo>'+LFI.tr('Enviar opinião')+'</button><div class="ok">'+LFI.tr('Publica depois de uma revisão rápida.')+'</div></div>'}).join(''))}
    document.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-opst],[data-opgo]');if(!t)return;var c=t.closest('.opd');if(!c)return;
      if(t.hasAttribute('data-opst')){var k=+t.getAttribute('data-opst');c._n=k;c.querySelectorAll('[data-opst]').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-opst')<=k)});return}
      t.disabled=true;var ref=c.getAttribute('data-opref');
      idTok().then(function(tk){return fetch(fnUrl('avaliacao'),{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tk},body:JSON.stringify({acao:'avaliar',ref:ref,nota:c._n||5,txt:c.querySelector('textarea').value||''})})}).then(function(r){return r.json()}).then(function(j){
        if(!j||!j.ok)throw 0;c.innerHTML='<div class="ok" style="font-size:14px;color:#14803f;font-weight:700">✓ '+LFI.tr(j.rev?'Obrigado! Sua opinião será publicada depois da revisão.':'Obrigado! Sua opinião foi publicada.')+'</div>'}).catch(function(){t.disabled=false;toast(LFI.tr('Não consegui enviar agora. Tente de novo mais tarde.'))})});
    var _avP=avalPinta;avalPinta=function(ref,j){var s=$('prv');if(!j||!(j.n>0)){if(s&&s.getAttribute('data-ref')===ref)s.remove();return}_avP(ref,j);var b=document.querySelector('#prv [data-arw]');if(b)b.remove()};
    var PC=function(){return innerWidth>=900};
    function arruma(){
      var m=document.querySelector('#layer .modal.pgm');
      if(m){var l=m.querySelector(':scope>.pgl'),d=m.querySelector(':scope>.det');
        if(PC()&&l&&d){var w=document.createElement('div');w.className='pgtop';m.insertBefore(w,l);w.appendChild(l);w.appendChild(d)}
        else if(!PC()){var w2=m.querySelector(':scope>.pgtop');if(w2){while(w2.firstChild)m.insertBefore(w2.firstChild,w2);w2.remove()}}
        if(!m.querySelector(':scope>.lfft'))m.insertAdjacentHTML('beforeend',rodape5())}
      /* S208 (13/11): o Últimas fica abaixo da foto (.ulin) — não vai mais para dentro da foto */
      document.querySelectorAll('#layer .cs details.cupf').forEach(function(c){var t=c.parentElement.querySelector(':scope>.cs-t');if(t&&c.nextElementSibling!==t)c.parentElement.insertBefore(c,t)});
      document.querySelectorAll('.hd .hnc').forEach(function(x){x.remove()});if(typeof liga==='function')liga()}
    var tm=0;new MutationObserver(function(){if(tm)return;tm=requestAnimationFrame(function(){tm=0;arruma()})}).observe(document.body,{childList:true,subtree:true});
    addEventListener('resize',function(){arruma()});
    /* Idioma / Tamanho do texto: no computador abre ao lado do menu (não gaveta de celular) */
    var liga=function(){var dsh=$('dsh');if(dsh&&!dsh._s207){dsh._s207=1;new MutationObserver(function(){var p=dsh.querySelector('.dsp');if(!p||!dsh.classList.contains('on')||innerWidth<1100||p.classList.contains('dspc'))return;
      var r=document.querySelector('#drw [data-dset]');if(!r)return;var b=r.getBoundingClientRect();p.classList.add('dspc');p.style.left=Math.round(b.right+14)+'px';p.style.top=Math.max(12,Math.round(b.top-110))+'px'}).observe(dsh,{attributes:true,childList:true})}
    /* busca: a janela cresce saindo da lupa */
    var sov=$('sov');if(sov&&!sov._s207){sov._s207=1;new MutationObserver(function(){if(!sov.classList.contains('on'))return;var p=sov.querySelector('.sopn'),l=$('sbtn');if(!p||!l)return;
      var cs=getComputedStyle(p),w=parseFloat(cs.width)||p.offsetWidth,L=(innerWidth-w)/2,T=parseFloat(cs.top)||12,b=l.getBoundingClientRect();
      p.style.transformOrigin=Math.round(b.left+b.width/2-L)+'px '+Math.round(b.top+b.height/2-T)+'px'}).observe(sov,{attributes:true,attributeFilter:['class']})}};liga();setTimeout(liga,1500);setTimeout(liga,4000);
  })();
})();
/* 11/11 S176-2: altura da barra Comprar (posiciona o WhatsApp logo acima dela) */
(function(){function u(){var b=document.querySelector('.buy');if(b&&b.offsetHeight)document.documentElement.style.setProperty('--buyh',b.offsetHeight+'px')}try{new MutationObserver(function(){setTimeout(u,60)}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});addEventListener('resize',u)}catch(_){}})();
/* S170 (aprovado e implementado 11/11/2026): animação leve do tema no destaque, selo do tema nos 4 primeiros cards (no lugar da etiqueta), faixa do tema no catálogo, sem etiqueta NUEVO */
(function(){
  var SELO={natal:'Presente ideal',anonovo:'Ano novo',maes:'Para a mamãe',pais:'Para o papai',bf:'Black Friday',halloween:'Halloween'};
  function T(s){try{return window.LFI&&LFI.lang==='es'?LFI.tr(s):s}catch(_){return s}}
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
    if(ev==='bf')h='<i class="sh"></i>';
    if(ev==='halloween'){h+='<i class="mo" style="--w:'+W+'px;--y0:'+H*.12+'px;--y1:'+H*.30+'px;--s:1;--d:5.5s;--a:.4s">'+MO+'</i>';h+='<i class="mo" style="--w:'+W+'px;--y0:'+H*.30+'px;--y1:'+H*.14+'px;--s:.7;--d:6.5s;--a:1.6s">'+MO+'</i>'}
    c.innerHTML=h;hd.insertBefore(c,hd.firstChild);
    setTimeout(function(){c.classList.add('fim')},window.__evfxFim||10000);
  }
  function selo(){
    var ev=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'');if(!SELO[ev])return;
    document.querySelectorAll('#home .hc .hci').forEach(function(x,k){if(k>3||x.querySelector('.evse'))return;if(getComputedStyle(x).position==='static')x.style.position='relative';var s=document.createElement('span');s.className='evse';s.textContent=T(SELO[ev]);x.appendChild(s)});
  }
  var FX={natal:'🎄 Presentes de Natal · retirada no mesmo dia',anonovo:'✨ Ano novo, novo olhar',maes:'🌷 Presentes para a mamãe · retirada no mesmo dia',pais:'Presentes para o papai · retirada no mesmo dia',bf:'⚡ Black Friday · ofertas em toda a loja',halloween:'🎃 Semana de Halloween'};
  function cat(){
    var ev=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,''),g=document.getElementById('grid');if(!g)return;if(!FX[ev]){[].forEach.call(document.querySelectorAll('.evlf,#grid .evse'),function(x){x.remove()});return}
    if(!g.parentNode.querySelector('.evlf')){var f=document.createElement('div');f.className='evlf';f.textContent=T(FX[ev]);g.parentNode.insertBefore(f,g)}
    g.querySelectorAll('.card').forEach(function(cd,k){var x=cd.querySelector('.ph');if(!x)return;var o=x.querySelector('.evse');if(k>3){if(o)o.remove();return}if(o)return;var tg=x.querySelector('.tg');if(tg)tg.style.display='none';var s=document.createElement('span');s.className='evse';s.textContent=T(SELO[ev]);x.appendChild(s)});
  }
  function novo(){document.querySelectorAll('#grid .card .tg,#home .hc .tg').forEach(function(t){if(/^(NUEVO|NOVO)$/i.test(t.textContent.trim()))t.style.display='none'})}
  function vai(){fx();selo();cat();novo()}
  if(document.readyState==='complete')setTimeout(vai,800);else addEventListener('load',function(){setTimeout(vai,800)});
  new MutationObserver(function(){setTimeout(vai,300)}).observe(document.documentElement,{attributes:true,attributeFilter:['data-ev']});
  setInterval(function(){if(!document.hidden){cat();novo()}},1000);
})();
