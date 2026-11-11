
  /* ===== bloco 8 (11/11/2026): Temática automática (calendário) + contagem anônima do Analisador ===== */
CALJS
  /* o evento manual do painel (config/site.evento) continua valendo e tem prioridade; sem ele, liga sozinho o que estiver "Automático" no calendário */
  var _evAtivo8=evAtivo;
  evAtivo=function(){var pv=/[?&]evp=([a-z]+)/.exec(location.search);
    if(pv){var k=pv[1],o=null;calProx(Date.now()).L.forEach(function(x){if(!o&&(x.id===k||x.tema===k))o=x});if(o||EVD[k]){var a=Date.now();o=o||{tema:k};return {tema:o.tema,ini:a-1,fim:a+864e5,bar:o.bar||'',th:o.th||'',lab:o.lab||'',cal:o.id||k}}}
    var e=_evAtivo8();if(e)return e;
    var ag=Date.now(),r=null;try{calProx(ag).L.forEach(function(x){if(!r&&x.ini<=ag&&ag<=x.fim&&EVD[x.tema]&&calSt(CFG,x)==='auto')r={tema:x.tema,ini:x.ini,fim:x.fim,bar:x.bar||'',th:x.th||'',lab:x.lab||'',cal:x.id}})}catch(_){}
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
  function anEnvia(){if(AN_OFF)return;var id,v={};try{if(sessionStorage.getItem('lf_an_n')!=='1'&&sessionStorage.getItem('lf_vc_n0')!=='1')return;
      id=sessionStorage.getItem('lf_an_id');if(!id){id='v'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);sessionStorage.setItem('lf_an_id',id)}
      v=JSON.parse(sessionStorage.getItem('lf_vc')||'{}');sessionStorage.setItem('lf_an_n','0');sessionStorage.setItem('lf_vc_n0','0')}catch(_){return}
    var e=null;try{e=evAtivo()}catch(_){}
    var b={id:id,v:v,c:AN.c,f:AN.f,b:AN.b,mo:AN.mo,ro:AN.ro,at:AN.at,pe:AN.pe,ck:AN.ck,lang:LFI.lang==='es'?'es':'pt',dev:matchMedia('(min-width:1100px)').matches?'pc':'cel',ev:e?(e.tema||''):''};
    try{fetch(fnUrl('analise'),{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(b),keepalive:true}).catch(function(){})}catch(_){}}
  /* as peças vistas já são contadas por vistaConta (lf_vc): marca que há algo novo para mandar */
  var _vistaConta8=vistaConta;vistaConta=function(){var r=_vistaConta8.apply(this,arguments);try{sessionStorage.setItem('lf_vc_n0','1')}catch(_){}return r};
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')anEnvia()});
  addEventListener('pagehide',anEnvia);
