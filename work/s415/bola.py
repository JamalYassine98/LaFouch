import sys,time,subprocess
from playwright.sync_api import sync_playwright
PROP=open('prop121.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8952','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
J="""()=>[...document.querySelectorAll('#home .hc .hlin,#grid .card .ph .ulin')].filter(s=>s.offsetWidth).slice(0,1).map(s=>{const i=s.querySelector('i').getBoundingClientRect();
const w=document.createTreeWalker(s,NodeFilter.SHOW_TEXT);let t=w.nextNode();while(t&&!t.textContent.trim())t=w.nextNode();const rg=document.createRange();const k=t.textContent.search(/\S/);rg.setStart(t,k);rg.setEnd(t,k+1);const L=rg.getBoundingClientRect();
const c=document.createElement('canvas').getContext('2d');c.font=getComputedStyle(s).font;const m=c.measureText('x');const M=c.measureText('U');
// linha de base = fim da caixa da letra - descendente da fonte
const fb=c.measureText('l');const base=L.bottom-fb.fontBoundingBoxDescent;const xmeio=base-m.actualBoundingBoxAscent/2;const capmeio=base-M.actualBoundingBoxAscent/2;
const n=s.closest('.hc,.card').querySelector('.hn,.nm,.ref');const w2=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);let t2=w2.nextNode();while(t2&&!t2.textContent.trim())t2=w2.nextNode();const r2=document.createRange();r2.setStart(t2,0);r2.setEnd(t2,1);
return {vao_ponto_texto:+(L.left-i.right).toFixed(1),centro_ponto:+((i.top+i.bottom)/2).toFixed(1),meio_minusculas:+xmeio.toFixed(1),meio_maiusculas:+capmeio.toFixed(1),ponto_esq:+i.left.toFixed(1),nome_esq:+r2.getBoundingClientRect().left.toFixed(1)}})"""
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for v in ('hoje','prop'):
     for W in (390,1440):
      for z in ('0','2'):
       for url in ('/','/?r=armacoes'):
        c=b.new_context(viewport={'width':W,'height':900},is_mobile=W<700,has_touch=W<1100,service_workers='block',locale='pt-BR')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','%s');"%z+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='prop' else ''))
        pg=c.new_page();pg.goto('http://localhost:8952'+url);pg.wait_for_timeout(2500)
        sel='#grid .card .ph .ulin' if 'r=' in url else '#home .hc .hlin'
        pg.evaluate("(q)=>{const s=document.querySelector(q);s&&s.scrollIntoView({block:'center'})}",sel);pg.wait_for_timeout(500)
        r=pg.evaluate(J.replace("'#home .hc .hlin,#grid .card .ph .ulin'",repr(sel)))
        print(v,W,'letra',z,'catalogo' if 'r=' in url else 'inicio',r);c.close()
finally: srv.terminate()
