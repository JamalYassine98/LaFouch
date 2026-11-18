# S420 · teste do trilho único: Minha conta (.mct) e menu (.seg). Prova (a) pílula = botão ≤0,5 px, (b) nada muda depois de parar,
# (c) letra branca recortada pela pílula (contraste), (d) arrastar; + toques repetidos, troca no meio de outra, idiomas, larguras, letras.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
porta=int(sys.argv[1]);U='http://localhost:%d/'%porta
CONTA=json.dumps({'nome':'Maria González','email':'maria@exemplo.com','tel':'+595 983 000 000','nac':'py','doc':'1234567','ends':[{'nome':'Casa','cidade':'Ciudad del Este','dep':'Alto Paraná','end':'Calle Los Lapachos 123','ref':'portão verde'}]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'maria@exemplo.com'})
GRAVA="""(sel)=>new Promise(ok=>{const T=document.querySelector(sel).__tk,Q=[];let n=0;const f=()=>{const c=T.c,b=T.el.querySelectorAll(':scope>button')[T.sel],z=b?{x:b.offsetLeft,w:b.offsetWidth}:null;
Q.push({t:performance.now(),x:c&&+c.x.toFixed(2),w:c&&+c.w.toFixed(2),bx:z&&z.x,bw:z&&z.w,cp:T.t.style.clipPath,tr:T.p.children[1].style.transform});if(++n<70)requestAnimationFrame(f);else ok(Q)};requestAnimationFrame(f)})"""
def confere(Q):
    p=[];f=Q[-1]
    if f['x'] is None:return ['sem pílula']
    if abs(f['x']-f['bx'])>.5 or abs(f['w']-f['bw'])>.5:p.append('pílula fora do botão no fim (%s×%s vs %s×%s)'%(f['x'],f['w'],f['bx'],f['bw']))
    para=[i for i in range(1,len(Q)) if Q[i]['x']==Q[i-1]['x'] and Q[i]['w']==Q[i-1]['w'] and abs(Q[i]['x']-f['x'])<.01]
    if para:
        i0=para[0];mud=[q for q in Q[i0:] if abs(q['x']-q['bx'])>.5 or abs(q['w']-q['bw'])>.5]
        if mud:p.append('pílula descolou do botão depois de parar (pulo)')
    t0=Q[0]['t'];tf=[q['t'] for q in Q if abs(q['x']-f['x'])<.01 and abs(q['w']-f['w'])<.01]
    dur=(tf[0]-t0) if tf else 999
    if dur>420:p.append('demorou %d ms para assentar'%dur)
    d0=abs(Q[0]['x']-f['x'])
    seis=[q for q in Q if q['t']-t0>=0.6*300]
    if 0<d0<=1.6*f['bw'] and seis and abs(seis[0]['x']-f['x'])>2:p.append('a 60%% do tempo faltavam %.1f px'%abs(seis[0]['x']-f['x']))
    return p
def contraste(pg,sel):
    # cor da letra da camada e cor da pílula
    return pg.evaluate("""(sel)=>{const T=document.querySelector(sel).__tk,c=getComputedStyle(T.t.children[T.sel]).color,b=getComputedStyle(T.p.children[1]).backgroundColor;
    const L=s=>{const v=s.match(/[\\d.]+/g).slice(0,3).map(x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)});return .2126*v[0]+.7152*v[1]+.0722*v[2]};const a=L(c),bb=L(b);return +((Math.max(a,bb)+.05)/(Math.min(a,bb)+.05)).toFixed(2)}""",sel)
R=[]
def ok(n,c,d=''):R.append((n,c,d));print(('OK  ' if c else 'FALHA ')+n+(' · '+d if d else ''),flush=True)
for W,H,lang,zi in [(390,844,'pt-BR','0'),(390,844,'es-PY','2'),(820,1180,'pt-BR','1'),(1440,900,'es-PY','0'),(320,640,'pt-BR','2'),(2560,1440,'pt-BR','2')]:
  with sync_playwright() as p:
    b,pg,er=base.abre(p,lang=lang,W=W,H=H,ls={'lf_conta':CONTA,'lf_auth':AUTH,'lf_zoom':zi,'lf_lang':'es' if lang.startswith('es') else 'pt'})
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto(U);pg.wait_for_timeout(3000);tag='%d %s letra %s'%(W,lang[:2],zi)
    pg.click('#contabtn');pg.wait_for_timeout(1300)
    tem=pg.evaluate("()=>{const m=document.querySelector('#layer .mct');return !!(m&&m.__tk)}");ok('conta: trilho montado · '+tag,tem)
    if not tem:b.close();continue
    n=pg.evaluate("()=>document.querySelectorAll('#layer .mct>button').length")
    el0=pg.evaluate("()=>{const m=document.querySelector('#layer .mct');window.__m0=m;return 1}")
    for i in [1,2,3,0,2]:
        if i>=n:continue
        pg.evaluate("i=>document.querySelectorAll('#layer .mct>button')[i].click()",i)
        Q=pg.evaluate(GRAVA,'#layer .mct');pr=confere(Q);ok('conta: aba %d · %s'%(i,tag),not pr,'; '.join(pr))
    mesmo=pg.evaluate("()=>document.querySelector('#layer .mct')===window.__m0");ok('conta: o trilho não foi redesenhado nas trocas · '+tag,mesmo)
    cr=contraste(pg,'#layer .mct');ok('conta: letra sobre a pílula contraste ≥4,5 · '+tag,cr>=4.5,str(cr))
    # troca no meio de outra (toque rápido em 3 abas)
    pg.evaluate("()=>{const b=document.querySelectorAll('#layer .mct>button');b[1].click();setTimeout(()=>b[3]&&b[3].click(),90);setTimeout(()=>b[2].click(),170)}");pg.wait_for_timeout(900)
    Q=pg.evaluate(GRAVA,'#layer .mct');pr=confere(Q);ok('conta: 3 toques rápidos assentam na última · '+tag,not pr and pg.evaluate("()=>document.querySelector('#layer .mct').__tk.sel")==2,'; '.join(pr))
    # 10 toques na mesma aba
    pg.evaluate("()=>{const b=document.querySelectorAll('#layer .mct>button')[2];for(let i=0;i<10;i++)b.click()}");pg.wait_for_timeout(700)
    Q=pg.evaluate(GRAVA,'#layer .mct');ok('conta: 10 toques na mesma aba sem mexer · '+tag,len(set((q['x'],q['w']) for q in Q))==1)
    # cópias de conteúdo: depois de 0,5 s não pode sobrar o conteúdo velho
    ok('conta: sem conteúdo velho sobrando · '+tag,pg.evaluate("()=>document.querySelectorAll('#layer .mcOld').length")==0)
    # arrastar (dedo/mouse) da aba 2 até a 0
    bx=pg.evaluate("()=>{const b=[...document.querySelectorAll('#layer .mct>button')].map(x=>{const r=x.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]});return b}")
    x2,y2=bx[2];x0,y0=bx[0];pg.mouse.move(x2,y2);pg.mouse.down()
    for k in range(1,13):pg.mouse.move(x2+(x0-x2)*k/12,y2);pg.wait_for_timeout(16)
    pg.mouse.up();pg.wait_for_timeout(900);sel=pg.evaluate("()=>[document.querySelector('#layer .mct').__tk.sel,document.querySelector('#layer .mct>button.on')&&[...document.querySelectorAll('#layer .mct>button')].indexOf(document.querySelector('#layer .mct>button.on'))]")
    ok('conta: arrastar até a 1ª aba escolhe a 1ª · '+tag,sel==[0,0],str(sel))
    # arrastar pouco (menos da metade) volta para a mesma
    x1=bx[1][0];pg.mouse.move(x0,y0);pg.mouse.down();pg.mouse.move(x0+.2*(x1-x0),y0);pg.wait_for_timeout(30);pg.mouse.move(x0+.28*(x1-x0),y0);pg.wait_for_timeout(30);dd=pg.evaluate("()=>{const T=document.querySelector('#layer .mct').__tk;return [T.c.x,T.c.w,T.m.map(m=>[m.x,m.w])]}");pg.mouse.up();pg.wait_for_timeout(700)
    sel=pg.evaluate("()=>document.querySelector('#layer .mct').__tk.sel");Q=pg.evaluate(GRAVA,'#layer .mct');pr=confere(Q)
    ok('conta: arrastar pouco volta para a mesma aba · '+tag,sel==0 and not pr,'; '.join(pr)+' sel=%s %s'%(sel,dd))
    # depois de arrastar, um toque normal funciona (não fica engolido)
    pg.locator('#layer .mct>button').nth(1).click();pg.wait_for_timeout(700);ok('conta: toque depois do arrasto funciona · '+tag,pg.evaluate("()=>document.querySelector('#layer .mct').__tk.sel")==1)
    pg.keyboard.press('Escape');pg.wait_for_timeout(700)
    errs=[e for e in er if 'Failed to load resource' not in e];ok('sem erro de JS · '+tag,not errs,'; '.join(errs[:3]))
    b.close()
F=[r for r in R if not r[1]];print('TOTAL',len(R),'falhas',len(F))
