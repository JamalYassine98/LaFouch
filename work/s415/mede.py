import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8941','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
Q=r"""()=>{const vis=e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;let x=e;while(x&&x!==document.body){const s=getComputedStyle(x);if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;x=x.parentElement}return true};
const scope=document.querySelector('#layer .scrim.pg')||document;
const all=[...scope.querySelectorAll('*')].filter(e=>e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&vis(e));
const sizes={},bold={n:0,t:0};all.forEach(e=>{const s=getComputedStyle(e);const f=Math.round(parseFloat(s.fontSize)*2)/2;sizes[f]=(sizes[f]||0)+1;bold.t++;if(+s.fontWeight>=600)bold.n++});
const toq=[...scope.querySelectorAll('a,button,[role=button],input,select')].filter(vis).filter(e=>{const r=e.getBoundingClientRect();return r.width<44||r.height<44}).map(e=>{const r=e.getBoundingClientRect();return ((e.innerText||e.getAttribute('aria-label')||e.className)+'').trim().slice(0,18)+' '+Math.round(r.width)+'×'+Math.round(r.height)});
// preços na mesma fileira
const prs=[...scope.querySelectorAll('.card .pr, .hc .hp')].filter(vis).map(e=>{const c=e.closest('.card,.hc').getBoundingClientRect(),r=e.getBoundingClientRect();return {top:Math.round(c.top),y:Math.round(r.top)}});
const fil={};prs.forEach(p=>{(fil[p.top]=fil[p.top]||[]).push(p.y)});const desal=Object.values(fil).filter(v=>v.length>1).map(v=>Math.max(...v)-Math.min(...v)).filter(d=>d>1);
const bordas={};[...scope.querySelectorAll('.card,.hc,.panel,.hd,.htr')].filter(vis).forEach(e=>{const s=getComputedStyle(e);const k=s.borderTopWidth+' '+s.boxShadow.slice(0,40);bordas[k]=(bordas[k]||0)+1});
const hd=document.querySelector('#hdst .hdi img, #hdst img');
return {tamanhos_letra:Object.keys(sizes).length,lista:Object.entries(sizes).sort((a,b)=>a[0]-b[0]).map(x=>x[0]+':'+x[1]).join(' '),negrito_pct:Math.round(100*bold.n/bold.t),toques_pequenos:toq.length,ex:toq.slice(0,8),filas_preco_desalinhado:desal,bordas:bordas,destaque_foto:hd?[Math.round(hd.getBoundingClientRect().width),Math.round(hd.getBoundingClientRect().height)]:null}}"""
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(390,844),(1440,900)]:
      for tela in ['inicio','catalogo','peca']:
        c=b.new_context(viewport={'width':W,'height':H},has_touch=W<1100,is_mobile=W<700,service_workers='block',locale='pt-BR')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')")
        pg=c.new_page();pg.goto('http://localhost:8941/'+('?r=armacoes' if tela=='catalogo' else ''));pg.wait_for_timeout(2500)
        if tela=='peca':
          pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(400)
          bx=pg.locator('#home .hc').first.bounding_box();(pg.touchscreen.tap if W<1100 else pg.mouse.click)(bx['x']+bx['width']/2,bx['y']+50);pg.wait_for_timeout(1500)
        if tela=='inicio': pg.evaluate("()=>scrollTo(0,1200)");pg.wait_for_timeout(600)
        r=pg.evaluate(Q);print(W,tela,json.dumps(r,ensure_ascii=False));c.close()
finally: srv.terminate()
