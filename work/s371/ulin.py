# S372: "bolinha das últimas unidades está muito afastada" (dono, 16/11 08:07, print do celular). Mede a linha .ulin no cartão da peça. Uso: ulin.py [css-da-proposta]
import sys,json,subprocess,time
from playwright.sync_api import sync_playwright
CSS=sys.argv[1] if len(sys.argv)>1 else '';nome='prop' if CSS else 'hoje'
srv=subprocess.Popen(['python3','-m','http.server','8861','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,tq in ((390,1),(1366,0)):
        c=b.new_context(viewport={'width':W,'height':844 if tq else 768},device_scale_factor=3 if tq else 2,is_mobile=bool(tq),has_touch=bool(tq),locale='es-PY',service_workers='block')
        c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg=c.new_page();pg.goto('http://localhost:8861/');w=pg.wait_for_timeout;w(3800)
        pg.evaluate("()=>{const a=document.querySelector('[data-navcat=armacao]')||document.querySelector('[data-navcat]');a&&a.click()}");w(2500)
        if CSS: pg.add_style_tag(content=CSS);w(300)
        R=pg.evaluate("""()=>{const L=[...document.querySelectorAll('.card .ulin')].filter(e=>e.getBoundingClientRect().width>0);const e=L[0];if(!e)return {n:0};e.scrollIntoView({block:'center',behavior:'instant'});
          const card=e.closest('.card,article')||e.parentElement,i=e.querySelector('i'),r=e.getBoundingClientRect(),ri=i.getBoundingClientRect();const rg=document.createRange();const tn=[...e.childNodes].filter(n=>n.nodeType===3||n.tagName!=='I').pop();rg.selectNodeContents(tn);const rt=rg.getBoundingClientRect();
          const viz=[...card.querySelectorAll('*')].filter(x=>x!==e&&!e.contains(x)&&x.children.length===0&&x.innerText&&x.innerText.trim()&&x.getBoundingClientRect().top>r.bottom-2).slice(0,3).map(x=>[x.className||x.tagName,Math.round(x.getBoundingClientRect().left*10)/10,getComputedStyle(x).paddingLeft]);
          const cs=getComputedStyle(e);return {n:L.length,pai:e.parentElement.className,linha:[r.left,r.right].map(Math.round),bolinha:[ri.left,ri.right,ri.width].map(x=>Math.round(x*10)/10),texto:Math.round(rt.left*10)/10,vao:Math.round((rt.left-ri.right)*10)/10,gap:cs.gap,pad:cs.padding,marg:cs.margin,ls:cs.letterSpacing,disp:cs.display,pos:cs.position,vizinhos:viz,html:e.outerHTML.slice(0,160),cx:Math.round(r.left),cy:Math.round(r.top)}}""")
        print(W,json.dumps(R,ensure_ascii=False))
        if R.get('n'):
            box=pg.evaluate("()=>{const e=[...document.querySelectorAll('.card .ulin')].filter(e=>e.getBoundingClientRect().width>0)[0],c=(e.closest('.card,article')||e.parentElement).getBoundingClientRect();return [c.left,c.top,c.width,c.height]}")
            pg.screenshot(path='/tmp/gt/ulin_%s_%d.png'%(nome,W),clip={'x':max(0,box[0]-4),'y':max(0,box[1]-4),'width':box[2]+8,'height':min(box[3]+8,760)})
        c.close()
    b.close()
finally: srv.terminate()
