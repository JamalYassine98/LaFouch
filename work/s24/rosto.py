from playwright.sync_api import sync_playwright
CAM='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.6-2.4h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.2" r="3.6"/></svg>'
B="""c=>{var p=document.querySelector('#rosto > p');p.textContent='Escolha o seu formato ou deixe a câmera descobrir para você.';
 p.insertAdjacentHTML('afterend','<button type=button style="display:flex;align-items:center;gap:10px;margin:14px auto 4px;border:0;border-radius:999px;padding:12px 22px;background:var(--tx);color:var(--bg);font:700 16px Inter,system-ui,sans-serif;box-shadow:0 8px 22px var(--shadow)">'+c+'Descobrir com a câmera <small style="font-weight:500;opacity:.7">· 1 min</small></button>')}"""
C="""c=>{var f=document.querySelector('#faces'),o=f.firstElementChild,n=o.cloneNode(true);n.classList.add('cur');o.classList.remove('cur');
 var fp=n.querySelector('.fp');fp.style.position='relative';fp.innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(160deg,#f6eef4,#efe3ec);border-radius:22px"><div style="width:112px;height:112px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--ac);box-shadow:0 10px 26px var(--shadow)">'+c.replace('width="22" height="22"','width="50" height="50" style="width:50px!important;height:50px!important;position:static!important;color:var(--ac);stroke:var(--ac)"')+'</div></div>';
 var h=n.querySelector('h3,b,.fn,strong');[...n.querySelectorAll('*')].forEach(e=>{if(e.children.length===0&&/Rosto oval/.test(e.textContent))e.textContent='Não sei o meu';if(e.children.length===0&&/Armações de quase/.test(e.textContent))e.textContent='A câmera mede o seu rosto em menos de 1 minuto e mostra os modelos que combinam.';if(e.children.length===0&&/^Escolher$/.test(e.textContent.trim()))e.textContent='Abrir a câmera'});
 f.insertBefore(n,o);f.scrollLeft=0}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for tag,js in (('hoje',None),('B',B),('C',C)):
        pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
        pg.goto('http://localhost:8766/'); pg.wait_for_timeout(2500)
        pg.evaluate("document.querySelector('a[href=\"#rosto\"]').click()"); pg.wait_for_timeout(1800)
        if js: pg.evaluate(js,CAM); pg.wait_for_timeout(700)
        pg.screenshot(path=f'rosto_{tag}.png'); pg.close()
