from playwright.sync_api import sync_playwright
D="""()=>{let n=0;document.querySelectorAll('#grid .card .nm').forEach(e=>{e.classList.remove('corta');e.style.webkitMaskImage='none';e.style.maskImage='none';e.style.whiteSpace='nowrap';e.style.overflow='hidden';e.style.textOverflow='clip';
 const full=(e.dataset.full||e.textContent).trim();e.dataset.full=full;let f2=full.replace(/^(Óculos de leitura|Óculos de grau|Armação|Solar)\s+/i,'');if(f2!==full)f2=f2.charAt(0).toUpperCase()+f2.slice(1);let w=f2.split(' ');e.textContent=w.join(' ');
 while(w.length>1&&e.scrollWidth>e.clientWidth+1){w.pop();if(['de','da','do','e','com'].includes(w[w.length-1]))w.pop();e.textContent=w.join(' ');n++}});return n}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for tag,js in (('D2',D),):
        pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
        pg.goto('http://localhost:8766/'); pg.wait_for_timeout(2500)
        pg.evaluate("document.querySelector('a[href=\"#vitrine\"]').click()"); pg.wait_for_timeout(2500)
        if js: print(pg.evaluate(js)); pg.wait_for_timeout(300)
        pg.evaluate("()=>{var c=[...document.querySelectorAll('#grid .card')].find(x=>x.textContent.includes('GR3340'));c.scrollIntoView({block:'start'});window.scrollBy(0,-20)}"); pg.wait_for_timeout(700)
        pg.screenshot(path=f'nome_{tag}.png'); pg.close()
