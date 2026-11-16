# S373: "no site, mesmo com um Xiaomi 13T, tenho lag como se estivesse muito pesado" (dono, 16/11 08:16). Mede o site no celular simulado com o processador 4x mais lento.
import sys,json,subprocess,time,os
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8871','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
INIT="""(()=>{try{sessionStorage.setItem('lf_ni','1')}catch(e){};window.__lt=[];try{new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lt.push([Math.round(e.startTime),Math.round(e.duration)]))).observe({entryTypes:['longtask']})}catch(e){}
 window.__raf=0;const r0=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=function(f){window.__raf++;return r0(f)};window.__ti=0;const s0=window.setInterval.bind(window);window.setInterval=function(f,t){if(t<1000)window.__ti++;return s0(f,t)}})()"""
QUADROS="""(ms)=>new Promise(ok=>{const T=[];let u=performance.now(),t0=u;const f=n=>{T.push(n-u);u=n;if(n-t0<ms)requestAnimationFrame(f);else{T.sort((a,b)=>a-b);ok({n:T.length,med:+(T[T.length>>1]).toFixed(1),p95:+(T[Math.floor(T.length*.95)]).toFixed(1),max:+T[T.length-1].toFixed(1),acima33:T.filter(x=>x>33).length,acima50:T.filter(x=>x>50).length})}};requestAnimationFrame(f)})"""
R={}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':393,'height':873},device_scale_factor=2.75,is_mobile=True,has_touch=True,locale='es-PY',service_workers='block')
    c.add_init_script(INIT);c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();cdp=c.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
    t0=time.time();pg.goto('http://localhost:8871/',wait_until='load');R['carga_s']=round(time.time()-t0,2);w=pg.wait_for_timeout;w(5000)
    R['tarefas_longas_na_abertura']=pg.evaluate("()=>({n:window.__lt.length,total:window.__lt.reduce((a,x)=>a+x[1],0),maiores:window.__lt.map(x=>x[1]).sort((a,b)=>b-a).slice(0,6)})")
    R['pagina']=pg.evaluate("""()=>{const A=document.getAnimations();const inf=A.filter(a=>{try{return a.effect.getComputedTiming().iterations===Infinity&&a.playState==='running'}catch(e){return false}});
      const nomes={};inf.forEach(a=>{const n=a.animationName||'js';nomes[n]=(nomes[n]||0)+1});
      const vis=inf.filter(a=>{try{const r=a.effect.target.getBoundingClientRect();return r.width>0&&r.bottom>0&&r.top<innerHeight}catch(e){return false}}).length;
      return {nos:document.querySelectorAll('*').length,imgs:document.images.length,animacoes:A.length,sem_fim_rodando:inf.length,sem_fim_na_tela:vis,quais:nomes,filtros:[...document.querySelectorAll('*')].filter(e=>{const c=getComputedStyle(e);return c.backdropFilter!=='none'||c.filter!=='none'}).length,sombras:[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).boxShadow!=='none').length,fixos:[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).position==='fixed').length}}""")
    r1=pg.evaluate("()=>window.__raf");w(3000);R['rAF_por_segundo_parado']=round((pg.evaluate("()=>window.__raf")-r1)/3);R['setInterval_rapidos']=pg.evaluate("()=>window.__ti")
    R['parado']=pg.evaluate(QUADROS,2500)
    pr=pg.evaluate_handle(QUADROS,4200)
    for k in range(14): pg.mouse.wheel(0,420);w(260)
    R['rolando']=pr.json_value();lt0=pg.evaluate("()=>window.__lt.length")
    # abrir e fechar o menu e a busca, medindo os quadros
    for nome,sel in (('menu','#mnb'),('busca','#sbtn'),('sacola','#bagbtn')):
        pg.evaluate("()=>scrollTo(0,0)");w(500);pr=pg.evaluate_handle(QUADROS,1300);pg.click(sel);R['abrir_'+nome]=pr.json_value();w(300);pg.keyboard.press('Escape');w(700)
    pg.evaluate("()=>{const c=[...document.querySelectorAll('.hc,.card .open')].find(e=>e.getBoundingClientRect().width>0);c&&c.scrollIntoView({block:'center',behavior:'instant'})}");w(600)
    pr=pg.evaluate_handle(QUADROS,2200);pg.evaluate("()=>{const c=[...document.querySelectorAll('.hc,.card .open')].find(e=>e.getBoundingClientRect().width>0);c&&c.click()}");R['abrir_peca']=pr.json_value()
    R['tarefas_longas_no_uso']=pg.evaluate("n=>({n:window.__lt.length-n,maiores:window.__lt.slice(n).map(x=>x[1]).sort((a,b)=>b-a).slice(0,6)})",lt0)
    b.close()
finally: srv.terminate()
S='/home/claude/catalogo/';R['arquivos_kB']={f:os.path.getsize(S+f)//1024 for f in ('index.html','js/lf-site.js','js/lf-i18n.js')}
print(json.dumps(R,ensure_ascii=False,indent=1))
