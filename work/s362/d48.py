import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from comum import olho
from playwright.sync_api import sync_playwright
from PIL import Image
with sync_playwright() as pw:
    for esc in (True,False):
        fs=[]
        b,pg,w=ap.abre(pw,'dia',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)));w(1500);p='/tmp/gt/d48_h%d.png'%esc;pg.screenshot(path=p);fs.append(p)
        print('hoje',esc,pg.evaluate("()=>({tit:document.querySelector('#v-dia .dHdT').innerText,per:document.querySelector('#v-dia .dHdP').innerText,sub:document.querySelector('#v-dia .dHdS').innerText,cal:[...document.querySelectorAll('#v-dia button')].some(e=>/^\\d\\d\\/\\d\\d\\/\\d{4}/.test(e.innerText.trim()))})"),sorted(olho(pg))[:6])
        pg.click('#v-dia .dHdP');w(900);pg.click('.dOp[data-id=mes]');w(2500);p='/tmp/gt/d48_m%d.png'%esc;pg.screenshot(path=p);fs.append(p)
        print('mes',pg.evaluate("()=>({view:window.__LF.S.view,tit:document.querySelector('#v-dash .dHdT').innerText,sub:document.querySelector('#v-dash .dHdS').innerText,kpis:[...document.querySelectorAll('#dtabBody .kpis .kpi')].map(k=>k.innerText.replace(/\\n/g,' / ')),linhas:[...document.querySelectorAll('.esLs>.esLn')].map(e=>e.innerText.replace(/\\n/g,' / ')),sai:[...document.querySelectorAll('#dtabBody .kpi>b')].filter(b=>b.scrollWidth>b.parentElement.clientWidth).length})"),sorted(olho(pg))[:8])
        pg.evaluate("()=>document.querySelector('.esLs [data-id]:nth-of-type(2)').scrollIntoView({block:'start'})");w(300)
        pg.evaluate("()=>[...document.querySelectorAll('.esLs>.esLn')].find(e=>/Quanto separar/.test(e.innerText)).click()");w(900);pg.evaluate("()=>[...document.querySelectorAll('.esLs>.esLn')].find(e=>/Quanto separar/.test(e.innerText)).scrollIntoView({block:'start'})");w(400);p='/tmp/gt/d48_t%d.png'%esc;pg.screenshot(path=p);fs.append(p)
        print('trocas',pg.evaluate("()=>[...document.querySelectorAll('.esTroca')].map(e=>e.innerText.replace(/\\n/g,' / ')+' ['+e.dataset.id+']')"),sorted(olho(pg))[:8])
        pg.evaluate("()=>document.querySelector('#dtabBody .kpi>b').click()");w(600);print('moeda',pg.evaluate("()=>[...document.querySelectorAll('#dtabBody .kpis .kpi>b')].map(b=>b.innerText)"))
        if pg.query_selector('.esTroca'):
            pg.evaluate("()=>document.querySelector('.esTroca').click()");w(1800);p='/tmp/gt/d48_c%d.png'%esc;pg.screenshot(path=p);fs.append(p);print('câmbio',pg.evaluate("()=>({view:window.__LF.S.view,janela:!!document.querySelector('.fjJn'),campos:[...document.querySelectorAll('.fjJn input')].map(i=>i.value)})"))
        print('erros',er);b.close()
        ims=[Image.open(x).convert('RGB').resize((390,844)) for x in fs];S=Image.new('RGB',(400*len(ims),844),'red')
        for i,im in enumerate(ims):S.paste(im,(i*400,0))
        S.save('/tmp/gt/d48_%d.jpg'%esc,quality=80)
