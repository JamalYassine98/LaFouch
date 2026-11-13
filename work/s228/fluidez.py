# S228: fluidez medida (quadros) com o processador 4x mais lento, imitando celular fraco. Só leitura.
import subprocess, sys, time, json
from playwright.sync_api import sync_playwright
RAF="""()=>{window.__f=[];let l=performance.now();const t=n=>{window.__f.push(n-l);l=n;window.__r=requestAnimationFrame(t)};window.__r=requestAnimationFrame(t)}"""
FIM="""()=>{cancelAnimationFrame(window.__r);const f=window.__f.slice(2);const n=f.length;const lent=f.filter(x=>x>34).length;return {quadros:n,media:+(f.reduce((a,b)=>a+b,0)/n).toFixed(1),pior:Math.round(Math.max(...f)),travadas:lent,pct:Math.round(100*lent/n)}}"""
CLS="window.__cls=0;try{new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true})}catch(_){}"
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def mede(pg,nome,acao,ms=1300):
    pg.evaluate(RAF); pg.wait_for_timeout(120); acao(); pg.wait_for_timeout(ms); r=pg.evaluate(FIM); print('%-34s quadros %3d · média %5.1f ms · pior %4d ms · travadas (>34 ms) %2d = %2d%%'%(nome,r['quadros'],r['media'],r['pior'],r['travadas'],r['pct']),flush=True); return r
srv=subprocess.Popen([sys.executable,'-m','http.server','8806','-d','/home/claude/lafouch/www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);subprocess.run(['bash','/tmp/srv.sh']);time.sleep(1);out={}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    # SITE
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1');"+CLS);c.route('**/*',rota)
    pg=c.new_page();cdp=c.new_cdp_session(pg);pg.goto('http://localhost:8811/');pg.wait_for_timeout(2500);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
    out['site menu abre']=mede(pg,'SITE · abrir o menu ☰',lambda:pg.evaluate("document.querySelector('#mnb').click()"))
    out['site menu fecha']=mede(pg,'SITE · fechar o menu',lambda:pg.keyboard.press('Escape'))
    pg.goto('http://localhost:8811/?r=tienda');pg.wait_for_timeout(2500)
    out['site rolar catálogo']=mede(pg,'SITE · rolar o catálogo',lambda:[pg.mouse.move(195,500)]+[ (pg.mouse.wheel(0,90),pg.wait_for_timeout(30)) for _ in range(14)],900)
    out['site abre peça']=mede(pg,'SITE · abrir uma peça',lambda:pg.evaluate("document.querySelector('#grid .card .open').click()"))
    out['site volta']=mede(pg,'SITE · voltar da peça',lambda:pg.go_back())
    out['site filtros']=mede(pg,'SITE · abrir Filtros',lambda:pg.evaluate("(document.querySelector('.lfgf')||{click(){}}).click()"))
    pg.goto('http://localhost:8811/');pg.wait_for_timeout(2500)
    out['site rolar início']=mede(pg,'SITE · rolar o Início',lambda:[pg.mouse.move(195,500)]+[ (pg.mouse.wheel(0,90),pg.wait_for_timeout(30)) for _ in range(14)],900)
    print('   pulo de layout acumulado (CLS) no Início:',round(pg.evaluate('window.__cls||0'),3));c.close()
    # APP
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){};"+CLS);c.route('**/*',rota)
    pg=c.new_page();cdp=c.new_cdp_session(pg);pg.goto('http://localhost:8806/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(900);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
    nav=lambda i:pg.evaluate("i=>document.querySelectorAll('#mainnav .mn')[i].click()",i)
    out['app início→catálogo']=mede(pg,'APP · Início → Catálogo',lambda:nav(1))
    out['app catálogo→inventário']=mede(pg,'APP · Catálogo → Inventário',lambda:nav(2))
    out['app rolar inventário']=mede(pg,'APP · rolar o Inventário',lambda:[pg.mouse.move(195,500)]+[ (pg.mouse.wheel(0,90),pg.wait_for_timeout(30)) for _ in range(14)],900)
    pg.evaluate("scrollTo(0,0)");pg.wait_for_timeout(300)
    out['app abre ficha']=mede(pg,'APP · abrir a ficha de uma peça',lambda:pg.evaluate("(document.querySelector('#v-estoque .pcard, #v-estoque [data-act][data-id]')||{click(){}}).click()"))
    out['app volta']=mede(pg,'APP · voltar da ficha',lambda:pg.go_back())
    out['app →caixa']=mede(pg,'APP · Inventário → Caixa',lambda:nav(3))
    out['app →início']=mede(pg,'APP · Caixa → Início',lambda:nav(0))
    out['app sino']=mede(pg,'APP · abrir o sino',lambda:pg.evaluate("document.querySelector('#sino').click()"))
    c.close()
finally: srv.terminate()
json.dump(out,open('fluidez.json','w'),ensure_ascii=False,indent=1)
