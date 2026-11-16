# S371: "Minha conta → menu → Minha conta de novo: a animação buga" (dono, 16/11 07:43). Grava quadro a quadro a abertura da conta na 1ª e na 2ª vez.
import sys,json,subprocess,time
from playwright.sync_api import sync_playwright
W,H=(int(sys.argv[1]),int(sys.argv[2])) if len(sys.argv)>2 else (390,844);PORTA=8851
G="""(sel)=>new Promise(ok=>{const Q=[];let t0=performance.now();const f=()=>{const n=performance.now();const e=document.querySelector(sel);
 if(e){const r=e.getBoundingClientRect(),c=getComputedStyle(e);Q.push({t:Math.round(n-t0),l:Math.round(r.left),tp:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),op:+(+c.opacity).toFixed(2)})}else Q.push({t:Math.round(n-t0),nada:1});
 if(n-t0<1100)requestAnimationFrame(f);else ok(Q)};requestAnimationFrame(f)})"""
EST="()=>({layer:!!document.querySelector('#layer .scrim'),n:document.querySelectorAll('#layer .scrim').length,drw:(document.querySelector('#drw')||{}).className,lock:document.documentElement.className,foco:document.activeElement&&document.activeElement.id})"
srv=subprocess.Popen(['python3','-m','http.server',str(PORTA),'-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,is_mobile=W<900,has_touch=W<900,locale='es-PY',service_workers='block')
    c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:200]));pg.goto('http://localhost:%d/'%PORTA);w=pg.wait_for_timeout;w(3500)
    def abre(sel,alvo,nome,foto=None):
        pr=pg.evaluate_handle(G,alvo);
        try: pg.click(sel,timeout=2500)
        except Exception as e: print('   não consegui tocar em',sel,str(e)[:90])
        if foto: w(160);pg.screenshot(path='/tmp/gt/s371_%s_a.png'%foto);w(140);pg.screenshot(path='/tmp/gt/s371_%s_b.png'%foto)
        Q=pr.json_value();v=[q for q in Q if not q.get('nada')];fim=v[-1] if v else None
        print(nome,'quadros',len(Q),'visíveis',len(v),'fim',fim,'| 1os',[(q['t'],q['l'],q['tp'],q['op']) for q in v[:8]]);print('   estado',pg.evaluate(EST));return v
    a1=abre('#contabtn','#layer .scrim > *','1ª conta','c1');w(600)
    m=abre('#mnb','#drw','menu','m');w(700)
    print('itens do menu com conta:',pg.evaluate("()=>[...document.querySelectorAll('#drw a,#drw button')].filter(e=>/cuenta|conta/i.test(e.innerText)).map(e=>[e.id,e.innerText.trim().slice(0,30),e.getAttribute('data-open')||e.getAttribute('href')])"))
    alvo2=pg.evaluate("()=>{const e=[...document.querySelectorAll('#drw a,#drw button')].find(e=>/cuenta|conta/i.test(e.innerText));if(e){e.setAttribute('data-s371','1');return true}return false}")
    a2=abre('[data-s371]' if alvo2 else '#contabtn','#layer .scrim > *','2ª conta','c2');w(900);pg.screenshot(path='/tmp/gt/s371_c2_fim.png')
    print('erros',er);b.close()
finally: srv.terminate()
