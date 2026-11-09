from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR');er=[];pg.on('pageerror',lambda e:er.append(str(e)))
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2800)
    print(pg.evaluate("()=>[...document.querySelectorAll('.hc .hn.lfcod')].slice(0,8).map(b=>b.textContent)"))
    pg.evaluate("window.__m=0;new MutationObserver(()=>window.__m++).observe(document.body,{childList:true,subtree:true,characterData:true})");pg.wait_for_timeout(2000)
    print('mutações em 2s',pg.evaluate('window.__m'),er)
    pg.evaluate("document.body.style.zoom='1.35'");pg.evaluate("dispatchEvent(new Event('resize'))");pg.wait_for_timeout(500)
    print(pg.evaluate("()=>[...document.querySelectorAll('.hc .hn.lfcod')].slice(0,8).map(b=>b.textContent)"))
    pg.evaluate("document.querySelector('a[href=\"#vitrine\"]').click()");pg.wait_for_timeout(1500)
    print(pg.evaluate("()=>[...document.querySelectorAll('#grid .card .info')].slice(0,8).map(c=>c.innerText.split('\\n').slice(0,2).join('/'))"))
