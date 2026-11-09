from playwright.sync_api import sync_playwright
from PIL import Image
V={'hoje':"",'A':"()=>{document.querySelectorAll('.hdt h1 em').forEach(e=>{e.style.color='inherit'})}",
   'B':"()=>{document.querySelectorAll('.hdt h1 em').forEach(e=>{e.style.color='#5a3a24'})}",
   'C':"()=>{document.querySelectorAll('.hdt h1 em').forEach(e=>{e.style.color='inherit';e.style.fontStyle='normal'})}"}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for k,js in V.items():
        pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
        pg.goto('http://localhost:8767/');pg.wait_for_timeout(2500)
        if k=='hoje': print(pg.evaluate("()=>{var e=document.querySelector('.hdt h1 em');return e?[e.outerHTML,e.parentElement.outerHTML.slice(0,200),getComputedStyle(e).color]:null}"))
        # trocar o texto para o exemplo tartaruga
        pg.evaluate("()=>{var e=document.querySelector('.hdt h1 em');if(e){e.parentElement.innerHTML='Solar quadrado <em>tartaruga</em>'}}")
        if js: pg.evaluate(js)
        pg.wait_for_timeout(300);pg.screenshot(path='h_%s.png'%k);pg.close()
