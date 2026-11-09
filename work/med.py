from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for vp in [(390,844),(1366,768)]:
        pg=b.new_page(viewport={'width':vp[0],'height':vp[1]}); pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(2500)
        r=pg.evaluate("""()=>{const hd=document.querySelector('header')||document.body;return [...Array.from(document.querySelectorAll('button,a,svg')).filter(e=>e.getBoundingClientRect().top<70)].map(e=>{const r=e.getBoundingClientRect();return [e.tagName,e.id,(e.className.baseVal??e.className).toString().slice(0,30),e.getAttribute('aria-label'),Math.round(r.x),Math.round(r.width),Math.round(r.height)]}).filter(x=>x[5]>0)}""")
        print(vp); [print(' ',x) for x in r]
