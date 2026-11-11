import time,json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=document-user-activation-required'])
    c=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,locale='pt-BR')
    c.add_init_script("localStorage.setItem('lf_lang','pt');window.__v=[];(function(){var SP=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=function(u){window.__v.push('CEL:'+u.text.slice(0,25));return SP(u)};var P=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){var s=this.src.slice(-12),r=P.call(this);window.__v.push('MP3 '+s);if(r&&r.catch)r.catch(function(e){window.__v.push('BLOQ '+e.name)});return r}})()")
    pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)[:150]))
    def rt(r):
        u=r.request.url
        if 'localhost' not in u:return r.abort()
        if 'lista.json' in u:time.sleep(1.5)
        r.continue_()
    pg.route('**/*',rt)
    pg.goto('http://localhost:8160/?r=descubra-o-grau',wait_until='commit')
    fr=[]
    for i in range(14):
        pg.wait_for_timeout(100);fr.append(pg.evaluate("(()=>{const g=document.getElementById('gw'),h=document.querySelector('.hero,#home');return [Math.round(performance.now()),!!g,document.documentElement.classList.contains('bootgz'),h?getComputedStyle(h).visibility:'-']})()"))
    print('quadros [ms, consulta, escondido, Início]:',fr)
    pg.wait_for_timeout(5000)
    print('vozes:',pg.evaluate("window.__v"))
    print('botão pisca:',pg.evaluate("!!document.querySelector('#gw .gzmu.gzpis')"),pg.evaluate("(document.getElementById('gzouv')||{}).textContent"))
    pg.screenshot(path='s163_bloq.png')
    pg.tap('#gw .gzmu');pg.wait_for_timeout(2500)
    print('depois do toque:',pg.evaluate("window.__v.slice(-4)"),'pisca?',pg.evaluate("!!document.querySelector('#gw .gzmu.gzpis')"))
    # puxar para atualizar dentro da consulta
    pg.evaluate("document.getElementById('gw').scrollTop=0")
    r=pg.evaluate("(()=>{const g=document.getElementById('gw'),b=g.querySelector('#gzbal')||g;const R=b.getBoundingClientRect();return [R.left+40,R.top+20]})()")
    pg.evaluate("""([x,y])=>{const g=document.getElementById('gw');const mk=(t,yy)=>new TouchEvent(t,{bubbles:true,cancelable:true,touches:t==='touchend'?[]:[new Touch({identifier:1,target:g,clientX:x,clientY:yy})],changedTouches:[new Touch({identifier:1,target:g,clientX:x,clientY:yy})]});
      g.dispatchEvent(mk('touchstart',y));for(let k=1;k<=12;k++)g.dispatchEvent(mk('touchmove',y+k*15));window.__ptr=getComputedStyle(document.getElementById('ptr5')).opacity}""",r)
    print('círculo aparece (opacidade):',pg.evaluate("window.__ptr"))
    print('erros',E)
    b.close()
