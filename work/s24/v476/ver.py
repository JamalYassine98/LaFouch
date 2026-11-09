from playwright.sync_api import sync_playwright
U='http://localhost:8767/'
def nova(b,w=390,h=844,loc='pt-BR'):
    pg=b.new_page(viewport={'width':w,'height':h},device_scale_factor=2,is_mobile=True,has_touch=True,locale=loc)
    er=[];pg.on('pageerror',lambda e:er.append(str(e)));pg.er=er
    pg.goto(U);pg.wait_for_timeout(2600);return pg
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=nova(b);pg.evaluate("document.querySelector('a[href=\"#vitrine\"]').click()");pg.wait_for_timeout(2000)
    pg.evaluate("()=>{var c=[...document.querySelectorAll('#grid .card')].find(x=>x.textContent.includes('GR3340'));c.scrollIntoView({block:'start'});window.scrollBy(0,-20)}");pg.wait_for_timeout(600)
    pg.screenshot(path='v476/cat.png');print('cat',pg.er)
    pg=nova(b);pg.evaluate("()=>{var c=document.querySelector('.hc [data-open], [data-hsec] .hc');(document.querySelector('[data-hsec]')||document.body).scrollIntoView()}");pg.wait_for_timeout(800);pg.screenshot(path='v476/home.png');print('home',pg.er)
    pg=nova(b);pg.evaluate("document.querySelector(\"[data-open='GR3350']\").click()");pg.wait_for_timeout(1800)
    pg.evaluate("()=>{var l=document.querySelector('#layer .cthl');var s=document.querySelector('#layer .scrim');s.scrollTop=l.getBoundingClientRect().top+s.scrollTop-300}");pg.wait_for_timeout(500)
    pg.evaluate("document.querySelectorAll('#layer .dgr .gb')[3].click()");pg.wait_for_timeout(700);pg.screenshot(path='v476/gr1.png')
    pg.evaluate("document.querySelector('#layer .cthm [data-cth=\"1\"]').click()");pg.wait_for_timeout(1200);pg.screenshot(path='v476/gr2.png')
    print('gr',pg.evaluate("[...document.querySelectorAll('#layer .dgr .gb')].map(b=>b.textContent+(b.classList.contains('on')?'*':'')+(b.style.display=='none'?'(x)':'')+(b.classList.contains('nc')?'(r)':'')).join(' ')"),pg.er)
    pg.evaluate("document.querySelector('.pgacts [data-cmp]').click()");pg.wait_for_timeout(3800)
    pg.evaluate("()=>{var s=document.querySelector('#layer .scrim');s.scrollTop=s.scrollHeight}");pg.wait_for_timeout(600);pg.screenshot(path='v476/cmp.png')
    print('cmp',pg.evaluate("()=>{var c=document.getElementById('cmpbar').getBoundingClientRect(),b=document.querySelector('.pgm .buy').getBoundingClientRect();return [Math.round(c.bottom),Math.round(b.top),getComputedStyle(document.querySelector('.pgm .buy')).backgroundColor]}"))
    pg=nova(b);pg.evaluate("document.querySelector('a[href=\"#rosto\"]').click()");pg.wait_for_timeout(1800);pg.screenshot(path='v476/rosto.png');print('rosto',pg.er)
    for w in (360,430):
        pg=nova(b,w);pg.evaluate("document.querySelector('a[href=\"#rosto\"]').click()");pg.wait_for_timeout(1500)
        print(w,pg.evaluate("()=>{var r=document.querySelector('#rosto');return [document.documentElement.scrollWidth,[...r.querySelectorAll('.rzm *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).length]}"))
    pg=nova(b,loc='es-PY');pg.evaluate("document.querySelector('a[href=\"#rosto\"]').click()");pg.wait_for_timeout(1500);pg.screenshot(path='v476/rosto_es.png')
    pg.evaluate("document.querySelector('a[href=\"#vitrine\"]') && 0")
    pg=nova(b,1280,800);pg.evaluate("document.querySelector('a[href=\"#rosto\"]').click()");pg.wait_for_timeout(1500);pg.screenshot(path='v476/rosto_pc.png')
