# estGiroAuto com a gravação real, dentro do app (peça de teste), claro e escuro; mede o que saiu
import sys,subprocess,time
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
srv=subprocess.Popen(['python3','-m','http.server','8898'],cwd='/home/claude/lafouch/www',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
        for esc in (True,):
            c=b.new_context(viewport={'width':390,'height':844},service_workers='block',color_scheme='dark' if esc else 'light');pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)))
            pg.route('**/__bruto.webm',lambda r:r.fulfill(path='/tmp/gt/bruto_hd.webm',content_type='video/webm'))
            pg.goto('http://localhost:8898/index.html#test');pg.wait_for_function('window.__LF&&window.__LF.S',timeout=30000);pg.set_default_timeout(900000)
            pg.evaluate("""async()=>{const L=window.__LF;const b=await (await fetch('/__bruto.webm')).blob();window.__fim=0;const k=Object.keys(L.S.inv||L.S.estoque||{})[0];window.__k=k;
              L.estGiroAuto({k:null,fim:()=>{window.__fim=1}},[],b,{per:40.39});}""")
            time.sleep(25);pg.screenshot(path='/tmp/gt/trat_%d.png'%esc)
            m=pg.evaluate("()=>{const r=s=>{const e=document.querySelector(s);if(!e)return null;const q=e.getBoundingClientRect();return [Math.round(q.width),Math.round(q.height)]};return {pct:document.querySelector('#egTp').textContent,fase:document.querySelector('#egTf').textContent,link:r('#egTm')}}");print(esc,m,flush=True)
            if esc:
                pg.wait_for_function("()=>!document.querySelector('.egTrat')",timeout=600000);time.sleep(1.5);pg.screenshot(path='/tmp/gt/depois.png')
                print('depois:',pg.evaluate("()=>({trat:!!document.querySelector('.egTrat'),texto:(document.body.innerText.match(/De qual peça[^\\n]*/)||[''])[0],toast:[...document.querySelectorAll('[class*=toast],[id*=toast]')].map(e=>e.innerText).join('|').slice(0,120)})"),er)
            else:
                pg.click('#egTm');time.sleep(1);print('manual abre a escolha:',pg.evaluate("()=>!document.querySelector('.egTrat')"),er)
            c.close()
        b.close()
finally: srv.kill()
