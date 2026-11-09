from playwright.sync_api import sync_playwright
import sys
FIX=sys.argv[1] if len(sys.argv)>1 else ''
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme='dark',service_workers='block')
    ctx.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    ctx.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    pg=ctx.new_page();pg.goto('http://localhost:8790/index.html#test');pg.wait_for_function('window.__LF',timeout=15000)
    r=pg.evaluate("""()=>{const L=window.__LF,S=L.S;const it=S.items.find(i=>i.tipo==='sem'&&i.qty>0&&!i.bulk);const ref=it.ref,c=it.cor;
      S.items.push(Object.assign({},it,{qty:5}));L.tipoTrocaAbre(ref,'sem','pre');return [ref,c]}""")
    pg.wait_for_timeout(700)
    for k in range(4):
        b2=pg.query_selector('#ttFolha .ttDiv');
        if b2: b2.click();pg.wait_for_timeout(250)
    if FIX: pg.evaluate("()=>{document.querySelectorAll('#ttFolha .ttR').forEach(r=>{const n=r.nextElementSibling;if(!r.querySelector('.ttX')&&n&&n.classList.contains('ttR')&&n.querySelector('.ttX')){const e=document.createElement('span');e.style.cssText='width:32px;flex:none';r.appendChild(e);const sm=r.querySelector('small');sm.textContent=sm.textContent.replace(/^1 peças/,'1 peça')}})}")
    pg.wait_for_timeout(400);pg.screenshot(path='tt_%s.png'%('fix' if FIX else 'hoje'));print(r)
