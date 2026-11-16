# S376 (16/11/2026 09:05, "implementar tudo"): no SITE — esboço 55 v2 (bolinha de Últimas unidades), selo da Escolha da semana só gira quando está na tela, medidor de lag (?medir=1).
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf8').read()
a="    var off=0;(function tick(){off=(off+.22)%L;a.setAttribute('startOffset',off);b.setAttribute('startOffset',off-L);requestAnimationFrame(tick)})()})();"
assert s.count(a)==1
b="""    /* S376 (aprovado 16/11 08:24): o texto do selo só gira quando o selo está na tela; fora dela (ou com a página em segundo plano) fica parado e não gasta nada */
    var off=0,vis=false,rod=false,sv=a.closest?a.closest('svg'):null;
    function tick(){if(!vis||document.hidden){rod=false;return}off=(off+.22)%L;a.setAttribute('startOffset',off);b.setAttribute('startOffset',off-L);requestAnimationFrame(tick)}
    function liga(){if(!rod&&vis&&!document.hidden){rod=true;requestAnimationFrame(tick)}}
    if('IntersectionObserver' in window&&sv){new IntersectionObserver(function(es){vis=es[es.length-1].isIntersecting;liga()}).observe(sv)}else{vis=true;liga()}
    document.addEventListener('visibilitychange',liga)})();
  /* S376 (aprovado 16/11 08:24): medidor para diagnóstico no aparelho do dono — só aparece com ?medir=1 no endereço. Mostra quadros por segundo (agora e o pior segundo), o quadro mais demorado,
     quantas vezes o processador travou mais de 50 ms e os mesmos números só enquanto a tela rola. Não guarda nem envia nada. */
  (function(){if(!/[?&]medir=1/.test(location.search))return;
    var d=document.createElement('div');d.id='lfmed';d.setAttribute('aria-hidden','true');d.style.cssText='position:fixed;left:8px;top:8px;z-index:2147483600;max-width:calc(100% - 16px);background:rgba(17,13,20,.92);color:#fff;font:600 12px/1.45 ui-monospace,Menlo,monospace;padding:8px 10px;border-radius:10px;pointer-events:none;white-space:pre-line';
    var ini=function(){document.body.appendChild(d)};if(document.body)ini();else document.addEventListener('DOMContentLoaded',ini);
    var u=performance.now(),n=0,t1=u,fps=0,pior=999,maxq=0,lt=0,ltms=0,rolT=0,rn=0,rms=0,rmax=0,abre=Math.round(u);
    try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){lt++;ltms+=e.duration})}).observe({entryTypes:['longtask']})}catch(_){}
    addEventListener('scroll',function(){rolT=performance.now()},{passive:true,capture:true});
    (function f(t){var dt=t-u;u=t;n++;if(dt>maxq&&t-abre>1500)maxq=dt;if(t-rolT<250){rn++;rms+=dt;if(dt>rmax)rmax=dt}
      if(t-t1>=1000){fps=Math.round(n*1000/(t-t1));if(t-abre>3000&&fps<pior)pior=fps;n=0;t1=t;
        d.textContent='Medidor La Fouch\\n'+fps+' quadros/s agora · pior segundo '+(pior===999?'—':pior)+'\\nquadro mais demorado '+Math.round(maxq)+' ms\\ntravadas do processador '+lt+' ('+Math.round(ltms)+' ms)\\nrolando: '+(rn?Math.round(rn*1000/rms)+' quadros/s · pior '+Math.round(rmax)+' ms':'role a tela')+'\\naparelho: '+(navigator.hardwareConcurrency||'?')+' núcleos · '+(navigator.deviceMemory||'?')+' GB · tela x'+(window.devicePixelRatio||1)}
      requestAnimationFrame(f)})(u)})();"""
s=s.replace(a,b);open(p,'w',encoding='utf8').write(s)
h='/home/claude/catalogo/index.html';t=open(h,encoding='utf8').read();a=".hc .hlin{margin:12px 2px 4px}";assert t.count(a)==1
t=t.replace(a,"/* S376 (esboço 55 v2, aprovado 16/11 08:25): bolinha alinhada com os textos do cartão, a 4 px da frase e no meio da altura das letras */.hc .hlin{margin:12px 2px 4px 12px;gap:4px;letter-spacing:.03em}.hc .hlin i{position:relative;top:-1px}");open(h,'w',encoding='utf8').write(t);print('ok')
