from playwright.sync_api import sync_playwright
from PIL import Image
M={'GR3340':'Quadrado · acetato','GR3350':'Quadrado · acetato','GR3345':'Retangular · acetato','SL2295':'Aviador · metal'}
JS="""m=>{document.querySelectorAll('#grid .card').forEach(c=>{var r=Object.keys(m).find(k=>c.querySelector('.ref')&&c.querySelector('.ref').textContent.trim()==k);if(!r)return;
 var rf=c.querySelector('.ref'),nm=c.querySelector('.nm');nm.classList.remove('corta');nm.style.webkitMaskImage='none';nm.style.maskImage='none';
 var cs=getComputedStyle(rf);nm.textContent=r;nm.style.letterSpacing='.02em';
 rf.textContent=m[r];rf.style.letterSpacing='0';rf.style.textTransform='none'})}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8766/'); pg.wait_for_timeout(2500)
    pg.evaluate("document.querySelector('a[href=\"#vitrine\"]').click()"); pg.wait_for_timeout(2500)
    pg.evaluate(JS,M); pg.wait_for_timeout(300)
    pg.evaluate("()=>{var c=[...document.querySelectorAll('#grid .card')].find(x=>x.textContent.includes('GR3340'));c.scrollIntoView({block:'start'});window.scrollBy(0,-20)}"); pg.wait_for_timeout(700)
    pg.screenshot(path='n3_H.png'); pg.close()
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8766/'); pg.wait_for_timeout(2500)
    pg.evaluate("document.querySelector(\"[data-open='GR3340']\").click()"); pg.wait_for_timeout(1800)
    pg.evaluate("()=>{var h=document.querySelector('#layer .pgm h1, #layer .pgm h2');h.textContent='Óculos de leitura quadrado';[...document.querySelectorAll('#layer *')].forEach(e=>{if(e.children.length==0&&e.textContent.trim()=='GRAU')e.textContent='LEITURA · ACETATO'});var s=document.querySelector('#layer .scrim');s.scrollTop=h.getBoundingClientRect().top+s.scrollTop-560}"); pg.wait_for_timeout(600)
    pg.screenshot(path='pg_nomeH.png')
Image.open('n3_H.png').crop((0,150,780,1270)).save('n3_H_crop.png')
Image.open('pg_nomeH.png').crop((0,700,780,1400)).save('pg_nomeH_crop.png')
