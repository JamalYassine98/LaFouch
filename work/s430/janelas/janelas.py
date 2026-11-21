import sys
from playwright.sync_api import sync_playwright
from PIL import Image
PORTA=sys.argv[1]; OUT=sys.argv[2]
def rosto(pg):
    pg.click('#mnb');pg.wait_for_timeout(700);pg.evaluate("document.querySelector('#drw a[href=\"#rosto\"]').click()");pg.wait_for_timeout(1500);pg.evaluate("document.querySelector('#rosto [data-fa]').click()");pg.wait_for_timeout(1500)
def cmp_(pg):
    pg.evaluate("(()=>{const a=[...document.querySelectorAll('a[data-mf^=\"tipo:\"]')].find(e=>e.offsetParent);a&&a.click()})()");pg.wait_for_timeout(1500)
    for i in (0,1):
        pg.evaluate("i=>{const e=[...document.querySelectorAll('#grid [data-open]')].filter(e=>e.offsetParent)[i];e&&e.click()}",i);pg.wait_for_timeout(1700)
        pg.evaluate("(()=>{const e=document.querySelector('#layer [data-cmp]');e&&e.click()})()");pg.wait_for_timeout(500)
        if i==0: pg.evaluate("history.back()");pg.wait_for_timeout(1200)
    pg.evaluate("(()=>{const e=document.querySelector('[data-cmpopen]');e&&e.click()})()");pg.wait_for_timeout(1500)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
    ims=[]
    for nome,fn in (('rosto',rosto),('cmp',cmp_)):
        for W in (390,1440):
            c=b.new_context(bypass_csp=True,viewport={'width':W,'height':844},is_mobile=W<700,has_touch=W<700,permissions=['camera'])
            c.add_init_script("try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}")
            pg=c.new_page();pg.goto('http://localhost:%s/'%PORTA);pg.wait_for_timeout(3000)
            try: fn(pg)
            except Exception as e: print(nome,W,'EXC',str(e)[:100])
            print(nome,W,pg.evaluate("(()=>{const s=document.querySelector('#layer .scrim');if(!s)return 'sem janela';const m=s.firstElementChild.getBoundingClientRect();return [s.className,getComputedStyle(s).position,Math.round(m.x),Math.round(m.y),Math.round(m.width),Math.round(m.height)].join(' ')})()"))
            f='/tmp/esc/j_%s_%d.png'%(nome,W);pg.screenshot(path=f);im=Image.open(f);im=im.resize((int(im.width*500/im.height),500));ims.append(im);c.close()
    b.close()
c=Image.new('RGB',(sum(i.width for i in ims)+10*len(ims),500),'red');x=0
for i in ims: c.paste(i,(x,0));x+=i.width+10
c.save(OUT,quality=78)
