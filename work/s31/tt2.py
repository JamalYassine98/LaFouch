from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':420,'height':900},color_scheme='dark',service_workers='block')
    ctx.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    ctx.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    pg=ctx.new_page();pg.goto('http://localhost:8790/index.html#test');pg.wait_for_function('window.__LF',timeout=15000)
    pg.evaluate("()=>{const L=window.__LF,S=L.S;const it=S.items.find(i=>i.tipo==='sem'&&i.qty>0&&!i.bulk);S.items.push(Object.assign({},it,{qty:2}));L.tipoTrocaAbre(it.ref,'sem','pre')}")
    pg.wait_for_timeout(600)
    for k in range(3): pg.locator('#ttFolha .ttDiv').first.click();pg.wait_for_timeout(250)
    print(pg.evaluate("()=>[...document.querySelectorAll('#ttFolha .ttR')].map(r=>{const s=r.querySelector('.ttSel').getBoundingClientRect();const x=r.querySelector('.ttX,.ttX0');return [Math.round(s.right),x?x.className+':'+Math.round(x.getBoundingClientRect().width):'-',r.querySelector('small').textContent]})"))
