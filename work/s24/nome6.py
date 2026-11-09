from playwright.sync_api import sync_playwright
import json
OPC={'G':{'GR3340':'La Fouch Quadrado','GR3350':'La Fouch Quadrado','GR3345':'La Fouch Retangular','SL2295':'La Fouch Aviador'}}
OLD={'1':{'GR3340':'Quadrado clássico','GR3350':'Quadrado largo','GR3345':'Retangular leve'},
     '2':{'GR3340':'Clara · quadrado','GR3350':'Lia · quadrado','GR3345':'Teo · retangular'},
     '3':{'GR3340':'Prosa · quadrado','GR3350':'Verso · quadrado','GR3345':'Página · retangular'}}
JS="""m=>{document.querySelectorAll('#grid .card').forEach(c=>{var r=Object.keys(m).find(k=>c.textContent.includes(k));if(!r)return;var e=c.querySelector('.nm');e.classList.remove('corta');e.style.webkitMaskImage='none';e.style.maskImage='none';
 var p=m[r].split(' · ');e.innerHTML=p[1]?('<b style="font-weight:700">'+p[0]+'</b><span style="font-weight:500;color:#7a6d77"> · '+p[1]+'</span>'):m[r]})}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for k,m in OPC.items():
        pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
        pg.goto('http://localhost:8766/'); pg.wait_for_timeout(2500)
        pg.evaluate("document.querySelector('a[href=\"#vitrine\"]').click()"); pg.wait_for_timeout(2500)
        pg.evaluate(JS,m); pg.wait_for_timeout(300)
        pg.evaluate("()=>{var c=[...document.querySelectorAll('#grid .card')].find(x=>x.textContent.includes('GR3340'));c.scrollIntoView({block:'start'});window.scrollBy(0,-20)}"); pg.wait_for_timeout(700)
        pg.screenshot(path=f'n3_{k}.png'); pg.close()
