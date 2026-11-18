import sys,time,subprocess,json,os
from playwright.sync_api import sync_playwright
PROP=open('prop121.js').read();ALVO=open('alvo.js').read();OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
srv=subprocess.Popen([sys.executable,'-m','http.server','8944','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
TELAS={'inicio-topo':None,'inicio-destaque':"()=>scrollTo(0,0)",'inicio-meio':"()=>{const h=[...document.querySelectorAll('.hc')].find(c=>c.querySelector('.hlin'));h&&h.scrollIntoView({block:'center'})}",'rodape':"()=>scrollTo(0,document.body.scrollHeight)",'catalogo':'CAT','peca':'PECA'}
SHOT=os.environ.get('SHOT')
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(320,640),(390,844),(768,1024),(1440,900)]:
      for z in (['0','2'] if W in (390,1440) else ['0']):
        for tela,ac in TELAS.items():
          lin={}
          for v in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<700,has_touch=W<1100,device_scale_factor=2 if SHOT else 1,service_workers='block',locale='pt-BR')
            c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','%s')"%z+(";addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='prop' else ''))
            pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:120]))
            pg.goto('http://localhost:8944/'+('?r=armacoes' if ac=='CAT' else ''));pg.wait_for_timeout(2300)
            if ac=='PECA':
              pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(400)
              bx=pg.locator('#home .hc').first.bounding_box();(pg.touchscreen.tap if W<1100 else pg.mouse.click)(bx['x']+bx['width']/2,bx['y']+40);pg.wait_for_timeout(1500)
            elif ac and ac!='CAT': pg.evaluate(ac);pg.wait_for_timeout(900)
            a=pg.evaluate(ALVO);o=sorted({x['r']+':'+'|'.join(x['ex'][:2]) for x in pg.evaluate(OLHO)})
            al=None
            if tela=='inicio-meio': al=pg.evaluate("()=>{const rows={};[...document.querySelectorAll('#home .hc')].forEach(c=>{const r=c.getBoundingClientRect();if(!r.width)return;const p=c.querySelector('.hp');(rows[Math.round(r.top+scrollY)]=rows[Math.round(r.top+scrollY)]||[]).push(Math.round(p.getBoundingClientRect().top))});return Object.values(rows).filter(v=>v.length>1).map(v=>Math.max(...v)-Math.min(...v)).filter(d=>d>1)}")
            if SHOT and W in (390,1440) and z=='0': pg.screenshot(path='raw_%d_%s_%s.png'%(W,tela,v))
            lin[v]=(a,o,al,er);c.close()
          h,p=lin['hoje'],lin['prop']
          print(W,'letra',z,tela,'| alvos',h[0]['alvos'],'->',p[0]['alvos'],'| <44:',h[0]['menor44'],'->',p[0]['menor44'],'| <24:',h[0]['menor24'],'->',p[0]['menor24'],'| preço desal.',h[2],'->',p[2],'| olho novo',[x for x in p[1] if x not in h[1] and not x.startswith('fileira torta:Solar')],'| erros',p[3][:1],'| resto',p[0]['ex'][:6],flush=True)
finally: srv.terminate()
