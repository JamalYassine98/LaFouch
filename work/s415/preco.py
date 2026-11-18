import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8942','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(390,844),(1440,900)]:
        c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<700,has_touch=W<1100,service_workers='block',locale='pt-BR')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')")
        pg=c.new_page();pg.goto('http://localhost:8942/');pg.wait_for_timeout(2500)
        print(W,json.dumps(pg.evaluate("""()=>{const out=[];const rows={};[...document.querySelectorAll('.hc')].forEach(c=>{const r=c.getBoundingClientRect();if(!r.width)return;const p=c.querySelector('.hp');if(!p)return;(rows[Math.round(r.top+scrollY)]=rows[Math.round(r.top+scrollY)]||[]).push(c)});
        for(const [t,cs] of Object.entries(rows)){if(cs.length<2)continue;const ys=cs.map(c=>c.querySelector('.hp').getBoundingClientRect().top);if(Math.max(...ys)-Math.min(...ys)<1)continue;
          out.push({linha:t,secao:(cs[0].closest('section,.sec,[id]')||{}).id||'',cartoes:cs.map(c=>({nome:(c.querySelector('.hn')||{}).innerText,preco_y:Math.round(c.querySelector('.hp').getBoundingClientRect().top),filhos:[...c.querySelectorAll(':scope *')].filter(x=>x.offsetHeight&&x.children.length===0).map(x=>(x.tagName+'.'+x.className+'/'+(x.parentElement.className||'')+'/'+(x.innerText||'').slice(0,12))+':'+Math.round(x.getBoundingClientRect().top)+'-'+Math.round(x.getBoundingClientRect().bottom)).slice(0,12),cls:c.className}))})}return out}"""),ensure_ascii=False,indent=0)[:2500]);c.close()
finally: srv.terminate()
