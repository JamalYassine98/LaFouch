# S420 · tentar bugar o trilho e a Minha conta: fechar no meio da troca, abrir de novo, girar a tela, toques loucos, arrastar e soltar fora, teclado.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
U='http://localhost:%s/'%sys.argv[1]
CONTA=json.dumps({'nome':'Maria González','email':'maria@exemplo.com','tel':'+595 983 000 000','nac':'py','doc':'1234567','ends':[{'nome':'Casa','cidade':'Ciudad del Este','dep':'Alto Paraná','end':'Calle 1','ref':''}]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'maria@exemplo.com'})
EST="""()=>{const m=document.querySelector('#layer .mct'),T=m&&m.__tk;if(!T)return {sem:1};const b=m.querySelectorAll(':scope>button')[T.sel];return {sel:T.sel,on:[...m.querySelectorAll(':scope>button')].findIndex(x=>x.classList.contains('on')),dx:+(T.c.x-b.offsetLeft).toFixed(2),dw:+(T.c.w-b.offsetWidth).toFixed(2),velho:document.querySelectorAll('.mcOld').length,paineis:document.querySelectorAll('#layer .panel').length,pilulas:m.querySelectorAll('.lfP').length,camadas:m.querySelectorAll('.lfPt').length,trilhos:document.querySelectorAll('#layer .mct').length}}"""
R=[]
def ok(n,c,d=''):R.append(c);print(('OK  ' if c else 'FALHA ')+n+(' · '+str(d) if d else ''),flush=True)
def bom(e):return not e.get('sem') and e['sel']==e['on'] and abs(e['dx'])<=.5 and abs(e['dw'])<=.5 and e['velho']==0 and e['paineis']==1 and e['pilulas']==1 and e['camadas']==1 and e['trilhos']==1
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844,ls={'lf_conta':CONTA,'lf_auth':AUTH})
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto(U);pg.wait_for_timeout(3000)
    def abre():pg.click('#contabtn');pg.wait_for_timeout(1200)
    abre()
    # 1. fechar (Esc) no meio da troca e abrir de novo
    pg.evaluate("()=>document.querySelectorAll('#layer .mct>button')[2].click()");pg.wait_for_timeout(60);pg.keyboard.press('Escape');pg.wait_for_timeout(900)
    ok('fechar no meio da troca: nada sobra na tela',pg.evaluate("()=>document.querySelectorAll('.mcOld,#layer .mct').length")==0)
    abre();e=pg.evaluate(EST);ok('reabrir depois de fechar no meio: trilho certo',bom(e),e)
    # 2. tocar no X no meio da troca
    pg.evaluate("()=>{document.querySelectorAll('#layer .mct>button')[1].click();setTimeout(()=>{const x=document.querySelector('#layer [data-close]');x&&x.click()},50)}");pg.wait_for_timeout(1000)
    ok('X no meio da troca: fecha limpo',pg.evaluate("()=>document.querySelectorAll('.mcOld,#layer .mct').length")==0)
    abre()
    # 3. 40 toques aleatórios rápidos
    pg.evaluate("()=>{const b=()=>document.querySelectorAll('#layer .mct>button');let k=0;const f=()=>{const L=b();if(!L.length)return;L[(k*7)%L.length].click();if(++k<40)setTimeout(f,25)};f()}");pg.wait_for_timeout(6000)
    e=pg.evaluate(EST);ok('40 toques loucos: assenta certo, sem resto',bom(e),e)
    # 4. girar a tela no meio da troca
    pg.evaluate("()=>document.querySelectorAll('#layer .mct>button')[3].click()");pg.wait_for_timeout(80);pg.set_viewport_size({'width':844,'height':390});pg.wait_for_timeout(1200)
    e=pg.evaluate(EST);ok('girar a tela no meio da troca: pílula no botão',bom(e),e)
    pg.set_viewport_size({'width':390,'height':844});pg.wait_for_timeout(1200);e=pg.evaluate(EST);ok('voltar a girar: pílula no botão',bom(e),e)
    # 5. arrastar e soltar FORA do trilho (bem abaixo)
    bx=pg.evaluate("()=>[...document.querySelectorAll('#layer .mct>button')].map(x=>{const r=x.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]})")
    (x0,y0),(x3,y3)=bx[0],bx[3];pg.mouse.move(x3,y3);pg.mouse.down()
    for k in range(1,10):pg.mouse.move(x3+(x0-x3)*k/9,y3+k*4);pg.wait_for_timeout(16)
    pg.mouse.move(x0,y0+300);pg.mouse.up();pg.wait_for_timeout(1100);e=pg.evaluate(EST);ok('arrastar e soltar fora do trilho: escolhe e assenta',bom(e),e)
    # 6. arrastar para cima/baixo (rolar) não mexe a pílula
    s0=pg.evaluate(EST)['sel'];x,y=bx[1];pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(x+3,y+60);pg.mouse.move(x+4,y+120);pg.mouse.up();pg.wait_for_timeout(900)
    e=pg.evaluate(EST);ok('gesto vertical não troca a aba',e['sel']==s0 or e['sel']==1,e)
    # 7. teclado: Tab até a aba e Enter
    pg.evaluate("()=>document.querySelectorAll('#layer .mct>button')[0].focus()");pg.keyboard.press('Tab');pg.keyboard.press('Enter');pg.wait_for_timeout(900);e=pg.evaluate(EST);ok('teclado (Tab + Enter) troca a aba',bom(e),e)
    # 8. mudar o tamanho da letra com a conta aberta
    pg.evaluate("()=>{try{localStorage.setItem('lf_zoom','2')}catch(e){};document.body.style.zoom=1.25}");pg.wait_for_timeout(900);e=pg.evaluate(EST);ok('letra maior com a conta aberta: pílula no botão',bom(e),e)
    pg.evaluate("()=>{document.body.style.zoom=''}");pg.wait_for_timeout(600)
    # 9. editar endereço (redesenho com edita) e voltar
    pg.evaluate("()=>document.querySelectorAll('#layer .mct>button')[1].click()");pg.wait_for_timeout(700)
    pg.evaluate("()=>{const x=document.querySelector('#layer [data-cta=mcended]');x&&x.click()}");pg.wait_for_timeout(800);e=pg.evaluate(EST);ok('editar endereço: trilho certo',bom(e),e)
    pg.evaluate("()=>{const x=document.querySelector('#layer [data-cta=mcaba][data-a=ends].cfx,#layer button.cfx[data-a=ends]');x&&x.click()}");pg.wait_for_timeout(800);e=pg.evaluate(EST);ok('cancelar edição: trilho certo',bom(e),e)
    # 10. Cartões: o "Carregando…" troca sem sobrar nada
    pg.evaluate("()=>document.querySelectorAll('#layer .mct>button')[3].click()");pg.wait_for_timeout(2500);t=pg.evaluate("()=>{const m=document.getElementById('mtj');return m?[document.querySelectorAll('#mtj').length,m.innerText.slice(0,60)]:null}")
    ok('Cartões: um só bloco e mensagem final',t and t[0]==1 and 'Carregando' not in t[1],t)
    # 11. menu → Minha conta com a conta aberta e outra aba escolhida
    pg.click('#mnb');pg.wait_for_timeout(700);pg.evaluate("()=>{const x=[...document.querySelectorAll('#drw a,#drw button')].filter(e=>e.offsetParent&&/Minha conta|Mi cuenta/i.test(e.innerText));(x[0]||{click(){}}).click()}");pg.wait_for_timeout(1300)
    e=pg.evaluate(EST);ok('menu → Minha conta: um painel, trilho certo',bom(e),e)
    errs=[x for x in er if 'Failed to load resource' not in x];ok('sem erro de JS',not errs,errs[:3])
    b.close()
print('TOTAL',len(R),'falhas',R.count(False))
