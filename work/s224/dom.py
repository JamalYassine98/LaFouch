from playwright.sync_api import sync_playwright
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
    pg=c.new_page();pg.goto('http://localhost:8811/');pg.wait_for_timeout(2300);pg.evaluate("document.documentElement.setAttribute('data-ev','natal')");pg.wait_for_timeout(900)
    print(pg.evaluate("""()=>{const h=document.querySelector('#hdst');const walk=(e,d)=>d>4?'':[...e.children].map(k=>'  '.repeat(d)+k.tagName+(k.id?'#'+k.id:'')+'.'+String(k.className.baseVal??k.className).replace(/ /g,'.')+' ['+getComputedStyle(k).color+'|'+getComputedStyle(k).borderTopColor+'|'+getComputedStyle(k).backgroundColor+'] '+(k.children.length?'':k.textContent.trim().slice(0,24))+'\\n'+walk(k,d+1)).join('');return walk(h,0)}"""))
    print(pg.evaluate("""()=>{const d=[...document.querySelectorAll('body *')].filter(e=>/^ev/.test(getComputedStyle(e).animationName));const p=d[0]&&d[0].parentElement;return [d.length,d[0]&&d[0].outerHTML.slice(0,200),p&&(p.tagName+'#'+p.id+'.'+p.className),p&&p.parentElement.tagName+'#'+p.parentElement.id,p&&JSON.stringify(p.getBoundingClientRect())]}"""))
    print(pg.evaluate("""()=>{const o={};for(const s of ['#contabtn','#mnb','#sbtn','#bagbtn','#grid .card .pr']){const e=document.querySelector(s);if(e)o[s]=getComputedStyle(e).color+' '+e.className}return o}"""))
