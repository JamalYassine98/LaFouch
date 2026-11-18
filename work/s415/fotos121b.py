import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop121.js').read();OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8950','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
TELAS={'inicio':"()=>{const h=[...document.querySelectorAll('.hc')].find(c=>c.querySelector('.hlin'));h&&h.scrollIntoView({block:'center'})}",'catalogo':"CAT",'peca':'PECA'}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(390,844),(1440,900)]:
     for z in ['0','2']:
      for tela,ac in TELAS.items():
        res={}
        for v in ('hoje','prop'):
          c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<700,has_touch=W<1100,device_scale_factor=2,service_workers='block',locale='pt-BR')
          c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
          c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','%s')"%z+(";addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='prop' else ''))
          pg=c.new_page();pg.goto('http://localhost:8950/'+('?r=armacoes' if ac=='CAT' else ''));pg.wait_for_timeout(2300)
          if ac=='PECA':
            pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(400)
            bx=pg.locator('#home .hc').first.bounding_box();(pg.touchscreen.tap if W<1100 else pg.mouse.click)(bx['x']+bx['width']/2,bx['y']+40);pg.wait_for_timeout(1500)
          elif ac=='CAT': pg.evaluate("()=>{const u=document.querySelector('#grid .card .ulin');u&&u.closest('.card').scrollIntoView({block:'center'})}");pg.wait_for_timeout(900)
          else: pg.evaluate(ac);pg.wait_for_timeout(900)
          pg.evaluate("()=>{const s=document.createElement('style');s.textContent='*{animation-play-state:paused!important}';document.head.appendChild(s)}")
          m=pg.evaluate("""()=>{const o=[];document.querySelectorAll('#home .hc .hlin, #grid .card .ph .ulin').forEach(s=>{const r=s.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;const c=s.closest('.hc,.card');const im=c.querySelector('img');const ir=im.getBoundingClientRect();const cortado=s.scrollWidth>s.clientWidth+1;const f=c.querySelector('.fav');const fr=f&&f.getBoundingClientRect();o.push({txt:s.innerText,top_na_foto:Math.round(r.top-ir.top),cortado,bate_coracao:!!(fr&&r.right>fr.left&&r.left<fr.right&&r.bottom>fr.top&&r.top<fr.bottom),fundo:getComputedStyle(s).backgroundColor})});const d=document.querySelector('.modal .big .dfav');return {selos:o,coracao:d?getComputedStyle(d).backgroundColor+' '+getComputedStyle(d).boxShadow.slice(0,20):null}}""")
          o=sorted({x['r']+':'+'|'.join(x['ex'][:2]) for x in pg.evaluate(OLHO)})
          if z=='0': pg.screenshot(path='c_%d_%s_%s.png'%(W,tela,v))
          res[v]=(m,o);c.close()
        print(W,'letra',z,tela,'HOJE-fileira',[x for x in res['hoje'][1] if 'fileira' in x],json.dumps(res['prop'][0],ensure_ascii=False)[:60],'| olho novo',[x for x in res['prop'][1] if x not in res['hoje'][1]],flush=True)
finally: srv.terminate()
