from playwright.sync_api import sync_playwright
from prop import CSS, JS
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
Q="""()=>{const o={};const g=(n,e)=>{if(e){const s=getComputedStyle(e);o[n]=[s.color,e.tagName+'.'+e.className,e.style.cssText.slice(0,60),e.__a||0]}};
 g('pgback',document.querySelector('#layer .pgback'));g('pgback filho',document.querySelector('#layer .pgback *'));g('vertodos',[...document.querySelectorAll('#home a')].find(a=>/Ver todos/.test(a.textContent)));
 const c=document.querySelector('#contabtn');if(c){g('conta',c);const s=c.querySelector('svg,img,*');if(s){const cs=getComputedStyle(s);o.contaFilho=[s.tagName,cs.color,cs.stroke,cs.fill,cs.opacity,cs.filter,s.outerHTML.slice(0,160)]}}
 const p=document.createElement('i');p.style.color='var(--ac)';document.body.appendChild(p);o.ac=getComputedStyle(p).color;return o}"""
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
    for t,url,ab in (('halloween','?r=tienda',1),('bf','',0)):
        pg=c.new_page();pg.goto('http://localhost:8811/'+url);pg.wait_for_timeout(2300);pg.evaluate("t=>document.documentElement.setAttribute('data-ev',t)",t)
        if ab: pg.evaluate("()=>{const c=document.querySelector('#grid .card .open');c&&c.click()}")
        pg.wait_for_timeout(1000);pg.add_style_tag(content=CSS);pg.evaluate(JS);pg.wait_for_timeout(1000)
        for k,v in pg.evaluate(Q).items(): print(t,k,v)
