from playwright.sync_api import sync_playwright
import sys
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':1010},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8766/'); pg.wait_for_timeout(2500)
    pg.evaluate("document.querySelector('a[href=\"#rosto\"]').click()"); pg.wait_for_timeout(2000)
    print(pg.evaluate("()=>{var r=document.querySelector('#rosto');return [r.scrollHeight,getComputedStyle(r).position,getComputedStyle(r).overflowY, [...r.children].map(e=>e.tagName+'.'+e.className+'#'+e.id).join(' ')]}"))
    pg.screenshot(path='rhoje_full.png')
    print(pg.evaluate("()=>[...document.querySelectorAll('#faces .face')].map(f=>f.getAttribute('data-face')+':'+(f.querySelector('.fi')||{}).style?.cssText).join('\\n')"))
