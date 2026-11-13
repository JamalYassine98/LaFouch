# S225: ATLAS DO APP — mede cada tela (controles, toque, letras, rolagem, barras). Só leitura.  python3 atlas_app.py
import json, os, subprocess, sys, time
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
VIEWS=['inicio','estoque','vendas','caixa','ped','clientes','hist','dash','dia','fx','desp','onl','notif','ajustes']
AP=[('celular',390,844,'light'),('celular escuro',390,844,'dark'),('celular pequeno',320,568,'light'),('tablet',820,1180,'light'),('computador',1366,768,'light')]
MED=r"""()=>{const W=innerWidth,H=innerHeight;const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!='hidden'&&s.display!='none'&&+s.opacity>.05&&r.bottom>0&&r.right>0&&r.left<W};
 const act=document.querySelector('.view.on, [id^="v-"].on, [id^="v-"]:not([hidden])');
 const ctl=[...document.querySelectorAll('button,a[href],input,select,textarea,[data-act],[role=button]')].filter(e=>vis(e)&&!e.disabled);
 const top=e=>{const r=e.getBoundingClientRect();const x=Math.min(W-1,Math.max(0,r.left+r.width/2)),y=r.top+r.height/2;if(y<0||y>H)return true;const h=document.elementFromPoint(x,y);return !h||e===h||e.contains(h)||h.contains(e)};
 const c2=ctl.filter(top);const tela1=c2.filter(e=>{const r=e.getBoundingClientRect();return r.top<H&&r.bottom>0});
 const peq=c2.filter(e=>{const r=e.getBoundingClientRect();return Math.min(r.width,r.height)<44}),mp=c2.filter(e=>{const r=e.getBoundingClientRect();return Math.min(r.width,r.height)<24});
 const nome=e=>(e.getAttribute('aria-label')||e.textContent||e.placeholder||e.title||'').trim().replace(/\s+/g,' ').slice(0,26);
 const semNome=c2.filter(e=>!nome(e)&&!e.querySelector('img[alt]')).length;
 const rot={};tela1.forEach(e=>{const n=nome(e);if(n)rot[n]=(rot[n]||0)+1});
 const txt=[...document.querySelectorAll('body *')].filter(e=>vis(e)&&[].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.trim()));const fs={};let p12=0;txt.forEach(e=>{const f=Math.round(parseFloat(getComputedStyle(e).fontSize));fs[f]=(fs[f]||0)+1;if(f<12)p12++});
 const fix=[...document.querySelectorAll('body *')].filter(e=>vis(e)&&/fixed|sticky/.test(getComputedStyle(e).position)&&e.getBoundingClientRect().width>W*.6&&e.getBoundingClientRect().height<H*.5).map(e=>[(e.id||String(e.className).split(' ')[0]),Math.round(e.getBoundingClientRect().top),Math.round(e.getBoundingClientRect().height)]);
 const nav=[...document.querySelectorAll('nav button, nav a, .bar button, .tabbar button, #nav button')].filter(vis).map(nome);
 return {controles:c2.length,naPrimeiraTela:tela1.length,toqueMenor44:peq.length,toqueMenor24:mp.length,ex44:peq.slice(0,6).map(e=>nome(e)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height)),semNome,repetidos:Object.entries(rot).filter(x=>x[1]>1).map(x=>x[0]+'×'+x[1]).slice(0,8),telas:+(document.documentElement.scrollHeight/H).toFixed(1),largura:document.documentElement.scrollWidth>W+1,letras:Object.keys(fs).length,letraMenor12:p12,fixas:fix.slice(0,5),nav:nav.slice(0,12),rotulos1:tela1.map(nome).filter(Boolean).slice(0,40)}}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
srv=subprocess.Popen([sys.executable,'-m','http.server','8799','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1);out={}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for n,W,H,sc in AP:
        c=b.new_context(viewport={'width':W,'height':H},color_scheme=sc,is_mobile=W<900,has_touch=W<1100,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',rota)
        pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:80]));pg.goto('http://localhost:8799/index.html#test');pg.wait_for_function('window.__LF',timeout=15000);pg.wait_for_timeout(900)
        for v in VIEWS:
            pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(900);d=pg.evaluate(MED);out['%s|%s'%(n,v)]=d
            if n in('celular','computador','celular escuro'): pg.screenshot(path=A+'app_%s_%s.jpg'%(n.replace(' ','_'),v),type='jpeg',quality=55)
            print('%-15s %-8s controles %3d (1ª tela %2d) <44: %3d <24: %2d semNome %2d | %4.1f telas | letras %2d (<12: %3d) %s%s'%(n,v,d['controles'],d['naPrimeiraTela'],d['toqueMenor44'],d['toqueMenor24'],d['semNome'],d['telas'],d['letras'],d['letraMenor12'],'LARGURA ' if d['largura'] else '',d['repetidos'][:3]),flush=True)
        if er: print('ERROS',n,er[:3])
        c.close()
finally: srv.terminate()
json.dump(out,open(A+'atlas_app.json','w'),ensure_ascii=False)
