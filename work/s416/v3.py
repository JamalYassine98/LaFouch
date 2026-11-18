import sys,time,subprocess,json,os
from playwright.sync_api import sync_playwright
PROP=open('../s415/prop121.js').read()+'\n'+open('prop_sistema.js').read();OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8974','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
Q="""(sel)=>{const z=(e)=>{let k=1;for(let x=e;x;x=x.parentElement)k*=parseFloat(getComputedStyle(x).zoom)||1;return k};
 const h=document.querySelector('#hdst h1');const hpx=h?parseFloat(getComputedStyle(h).fontSize)*z(h):null;const hl=h?Math.round(h.getBoundingClientRect().height/(parseFloat(getComputedStyle(h).lineHeight||0)*z(h)||1)):null;
 const cards=[...document.querySelectorAll(sel)].filter(c=>c.getBoundingClientRect().width);const rows={};
 cards.forEach(c=>{const r=c.getBoundingClientRect();const p=c.querySelector('.hp,.pr');if(!p)return;(rows[Math.round(r.top+scrollY)]=rows[Math.round(r.top+scrollY)]||[]).push(Math.round(p.getBoundingClientRect().top))});
 const des=Object.values(rows).filter(v=>v.length>1).map(v=>Math.max(...v)-Math.min(...v));
 const nm=cards.map(c=>c.querySelector('.hn,.nm')).filter(Boolean);const cort=nm.filter(n=>n.scrollHeight>n.clientHeight+2).map(n=>n.textContent.trim());
 let mn=99,mt='';document.querySelectorAll('body *').forEach(e=>{if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;const r=e.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;let o=1;for(let x=e;x&&x!==document.body;x=x.parentElement){const s=getComputedStyle(x);if(s.display==='none'||s.visibility==='hidden')o=0;o*=+s.opacity}if(o<.2)return;const px=parseFloat(getComputedStyle(e).fontSize)*z(e);if(px<mn){mn=px;mt=e.textContent.trim().slice(0,20)}});
 return {destaque_px:hpx&&+hpx.toFixed(1),destaque_linhas:hl,desalinho_precos:des.length?Math.max(...des):0,nomes_cortados:cort.length,menor_letra:+mn.toFixed(1),menor_txt:mt}}"""
os.makedirs('v3',exist_ok=True)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(320,640),(390,844),(768,1024),(1440,900),(1920,1080)]:
     for z in ('0','2'):
      for tela,url,sel,ac in [('topo','/','#home .hc',None),('cartoes','/','#home .hc',"()=>{const h=[...document.querySelectorAll('.hc')].find(c=>c.querySelector('.hlin'));h&&h.scrollIntoView({block:'center'})}"),('catalogo','/?r=armacoes','#grid .card',None)]:
        res={}
        for v in ('hoje','prop'):
          c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<700,has_touch=W<1100,device_scale_factor=2,service_workers='block',locale='pt-BR')
          c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
          c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','%s');"%z+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='prop' else ''))
          pg=c.new_page();pg.goto('http://localhost:8974'+url);pg.wait_for_timeout(2500)
          if ac: pg.evaluate(ac);pg.wait_for_timeout(900)
          pg.evaluate("()=>{const s=document.createElement('style');s.textContent='*{animation-play-state:paused!important}';document.head.appendChild(s)}")
          m=pg.evaluate(Q,sel);o=set(x['r']+': '+e for x in pg.evaluate(OLHO) for e in x['ex'])
          if z=='0': pg.screenshot(path='v3/%s_%d_%s.png'%(v,W,tela))
          res[v]=(m,o);c.close()
        novo=[x for x in res['prop'][1] if x not in res['hoje'][1]]
        print(W,'letra',z,tela,'| HOJE',res['hoje'][0],'| PROP',res['prop'][0],'| olho novo',novo[:4],flush=True)
finally: srv.terminate()
