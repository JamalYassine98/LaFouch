from playwright.sync_api import sync_playwright
BK='<button type=button class="navb vback" style="display:inline-flex;align-items:center;gap:6px;border:0;background:none;color:var(--ac);font:600 15px Inter,sans-serif;padding:6px 0;margin:2px 0 8px"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>%s</button>'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,locale='pt-BR');pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
    pg.evaluate("document.querySelector('a[href=\"#vitrine\"]').click()");pg.wait_for_timeout(1000)
    pg.evaluate("document.querySelector('[data-dopen],#mbtn,.bar [aria-label*=enu]').click()");pg.wait_for_timeout(900)
    pg.evaluate("[...document.querySelectorAll('#drw nav a')].find(a=>a.textContent.trim()=='Atacado').click()");pg.wait_for_timeout(1200)
    pg.screenshot(path='at_hoje.png')
    pg.evaluate("h=>{var s=document.querySelector('.sec.pop');s.insertAdjacentHTML('afterbegin',h);s.scrollTop=0}",BK%'Catálogo');pg.wait_for_timeout(300);pg.screenshot(path='at_novo.png')
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,locale='pt-BR');pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
    pg.evaluate("window.scrollTo(0,900)");pg.wait_for_timeout(300)
    pg.evaluate("document.querySelector('[data-dopen],#mbtn,.bar [aria-label*=enu]').click()");pg.wait_for_timeout(900)
    pg.evaluate("[...document.querySelectorAll('#drw nav a')].find(a=>a.textContent.trim()=='Descubra o seu grau').click()");pg.wait_for_timeout(1500)
    pg.screenshot(path='gz_hoje.png')
    pg.evaluate("()=>{scrollTo(0,0);var g=document.getElementById('gw');g.style.top=document.querySelector('.top').getBoundingClientRect().bottom+'px';g.querySelector('.gzbk span').textContent='Início';document.querySelectorAll('#gw .gzaj b').forEach(b=>b.textContent='+0.25')}");pg.wait_for_timeout(400);pg.screenshot(path='gz_novo.png')
