# S379: (a) onde o site trava fora da Mochi — travadas do processador (>50 ms) por ação, celular simulado 4x mais lento; (b) telas estreitas (zoom de letra do Chrome encolhe a largura útil): o site passa da largura?
import subprocess,time,json
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8903','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
INIT="""(()=>{try{sessionStorage.setItem('lf_ni','1')}catch(e){};window.__lt=[];try{new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lt.push(Math.round(e.duration)))).observe({entryTypes:['longtask']})}catch(e){}})()"""
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':393,'height':873},device_scale_factor=2.75,is_mobile=True,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script(INIT);c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();cdp=c.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4});pg.goto('http://localhost:8903/');w=pg.wait_for_timeout;w(5000)
    def mede(nome,f,esp=1800):
        n0=pg.evaluate("()=>window.__lt.length")
        try: f()
        except Exception as e: print('   ',nome,'não deu:',str(e)[:80]);return
        w(esp);L=pg.evaluate("n=>window.__lt.slice(n)",n0);print('%-28s travadas %d · soma %d ms · maior %d ms'%(nome,len(L),sum(L),max(L) if L else 0))
    print('abertura do site             travadas %d · soma %d ms · maior %d ms'%tuple(pg.evaluate("()=>[window.__lt.length,window.__lt.reduce((a,b)=>a+b,0),Math.max(0,...window.__lt)]")))
    mede('abrir o menu',lambda:pg.click('#mnb'));mede('menu → catálogo (Solar)',lambda:pg.click('#drw a[data-mf] >> nth=0'),2600)
    mede('rolar o catálogo',lambda:[(pg.mouse.wheel(0,500),w(150)) for _ in range(10)])
    mede('abrir Filtros',lambda:pg.evaluate("()=>{const b=[...document.querySelectorAll('#vscr button,#lfgen button,.lfgf')].find(e=>/Filtr/i.test(e.innerText));b&&b.click()}"));pg.keyboard.press('Escape');w(500)
    mede('abrir uma peça',lambda:pg.evaluate("()=>{const c=[...document.querySelectorAll('#vscr #grid .card .open')].find(e=>e.getBoundingClientRect().top>0);c&&c.click()}"),2600)
    mede('pôr na sacola',lambda:pg.evaluate("()=>{const b=[...document.querySelectorAll('#layer button')].find(e=>/Agregar|Quiero|Añadir|Adicionar|Comprar/i.test(e.innerText));b&&b.click()}"),2200)
    mede('abrir a sacola',lambda:pg.click('#bagbtn',force=True),2200);pg.keyboard.press('Escape');w(600)
    mede('abrir a busca e digitar',lambda:(pg.click('#sbtn',force=True),w(500),pg.keyboard.type('solar',delay=120)),2000)
    c.close()
    print('--- largura útil pequena (letra grande do Android no Chrome encolhe a largura da página)')
    for W in (320,300,280,260,240,220):
        c=b.new_context(viewport={'width':W,'height':560},device_scale_factor=3,is_mobile=True,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script(INIT);c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg=c.new_page();pg.goto('http://localhost:8903/');pg.wait_for_timeout(3000)
        M="""()=>{const sw=document.documentElement.scrollWidth,iw=innerWidth;const fora=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>iw+2&&getComputedStyle(e).position!=='fixed'}).length;const cort=[...document.querySelectorAll('.hc,.card,.top,button')].filter(e=>e.getBoundingClientRect().width>0&&e.scrollWidth>e.clientWidth+2).length;return [iw,sw,fora,cort]}"""
        a=pg.evaluate(M);pg.goto('http://localhost:8903/?r=tienda');pg.wait_for_timeout(2500);k=pg.evaluate(M)
        print(W,'px | Início: página',a[1],'px · peças fora da tela',a[2],'· caixas cortadas',a[3],'| catálogo: página',k[1],'px · fora',k[2],'· cortadas',k[3])
        if W in (260,): pg.goto('http://localhost:8903/');pg.wait_for_timeout(2500);pg.screenshot(path='/tmp/gt/estreito_%d.png'%W)
        c.close()
    b.close()
finally: srv.terminate()
