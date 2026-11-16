import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from comum import olho
from playwright.sync_api import sync_playwright
from PIL import Image
TOCA="rx=>{const b=[...document.querySelectorAll('button')].filter(e=>e.offsetParent&&new RegExp(rx).test(e.innerText.trim())).pop();if(!b)return 'sem';b.click();return b.innerText.trim().slice(0,40)}"
with sync_playwright() as pw:
    for apn in ('celular','pc','tablet'):
        for esc in (True,False):
            if apn!='celular' and not esc: continue
            b,pg,w=ap.abre(pw,'vendas',esc,apn);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
            pg.evaluate("()=>document.querySelector('#vRows .pcard[data-ref]').click()");w(1200);r=pg.evaluate(TOCA,'^Vender');w(1500)
            m=pg.evaluate("""()=>{const v=e=>e&&e.offsetParent!==null;const q=s=>document.querySelector(s);const ordem=[...document.querySelectorAll('#payB > div')].filter(v).map(d=>(d.querySelector('.lbl')||{}).innerText||d.id);
              return {toque2:!!v(q('#sgo')),total:q('#tot').innerText,fonte:getComputedStyle(q('#tot')).fontSize,formas:[...document.querySelectorAll('#formaChips .trkB')].map(b=>b.innerText+(b.classList.contains('on')?'*':'')),moedas:[...document.querySelectorAll('#moedas .trkB')].map(b=>b.innerText+(b.classList.contains('on')?'*':'')),ordem,mais:v(q('#pagMais')),th:Math.round(q('#formaChips .trkTh').getBoundingClientRect().width),sai:[...document.querySelectorAll('#formaChips .trkB')].filter(b=>b.scrollWidth>b.clientWidth+1).length}}""")
            print(apn,esc,r,m,sorted(olho(pg))[:6],flush=True)
            p1='/tmp/gt/pg_%s_%d_a.png'%(apn,esc);pg.screenshot(path=p1)
            pg.evaluate("()=>[...document.querySelectorAll('#formaChips .trkB')].pop().click()");w(700);print('   taxa:',pg.evaluate("()=>{const t=document.getElementById('formaTx');return t.hidden?'(escondida)':t.innerText}"),sorted(olho(pg))[:4])
            p2='/tmp/gt/pg_%s_%d_b.png'%(apn,esc);pg.screenshot(path=p2)
            if apn=='celular':
                pg.evaluate("()=>document.getElementById('sgo').scrollIntoView({block:'center'})");w(300);p3='/tmp/gt/pg_%d_c.png'%esc;pg.screenshot(path=p3)
                ims=[Image.open(x).convert('RGB').resize((390,844)) for x in (p1,p2,p3)];S=Image.new('RGB',(1190,844),'red')
                for i,im in enumerate(ims):S.paste(im,(i*400,0))
                S.save('/tmp/gt/pg_%d.jpg'%esc,quality=80)
                pg.evaluate("()=>document.getElementById('sgo').click()");w(1500);print('   finalizou:',pg.evaluate("()=>window.__LF.S.sales.filter(s=>Date.now()-s.ts<60000).length"),er)
            b.close()
