# S318: confere as telas implementadas no simulador (telas, botões e fluxo de cancelar), com olho.js parado e rolado.
import sys,os,json;sys.path.insert(0,'/home/claude/lafouch/work/s308');import base
from playwright.sync_api import sync_playwright
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read();T='/tmp/s318/';os.makedirs(T,exist_ok=True)
def olho(pg,w,sel='#pkok'):
    r=[]
    for rola in (0,1):
        pg.evaluate("([s,r])=>{const o=document.querySelector(s);if(o)o.scrollTop=r?o.scrollHeight:0}",[sel,rola]);w(350)
        for f in pg.evaluate(OLHO) or []: r.append(('rolado' if rola else 'parado',f['r'],f['n'],tuple(f.get('ex') or [])))
    pg.evaluate("s=>{const o=document.querySelector(s);if(o)o.scrollTop=0}",sel);w(250);return r
def conta(pg,w):
    pg.evaluate("()=>{const o=document.getElementById('pkok');if(o){o.remove();document.documentElement.classList.remove('lock')}}")
    pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");w(900)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer .mct button')].find(b=>/Pedidos/i.test(b.innerText||''));t&&t.click()}");w(900)
CASOS=[('cel_pix',dict(minutos=2)),('cel_pix_0',dict(minutos=0)),('cel_trf',dict(minutos=2,pag='alias')),('cel_venceu',dict(minutos=31)),('cel_comp',dict(minutos=2,comp=True)),
       ('peq_pix',dict(minutos=2,W=360,H=640)),('peq_trf',dict(minutos=2,W=360,H=640,pag='alias')),('tab_pix',dict(minutos=2,W=820,H=1180)),('pc_pix',dict(minutos=2,W=1440,H=900)),('pc_trf',dict(minutos=2,W=1440,H=900,pag='alias')),('pc_venceu',dict(minutos=31,W=1440,H=900))]
with sync_playwright() as pw:
    for nome,kw in CASOS:
        b,pg,w=base.abre(pw,**kw)
        info=pg.evaluate("""()=>{const o=document.getElementById('pkok');if(!o)return 'SEM TELA';const v=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};
          const h=o.querySelector('h2').getBoundingClientRect(),zb=o.querySelector('.zb'),bb=zb?zb.getBoundingClientRect():null,tp=document.querySelector('.top').getBoundingClientRect();
          return {cls:o.className,sh:o.scrollHeight,ch:o.clientHeight,topo:Math.round(tp.bottom),barra:bb&&[Math.round(bb.top),Math.round(bb.bottom)],h2:Math.round(h.top),
          acoes:[...o.querySelectorAll('button,a,label')].filter(v).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,26)+' '+Math.round(e.getBoundingClientRect().height))}}""")
        print(nome,json.dumps(info,ensure_ascii=False)[:520]);print('   olho:',olho(pg,w) or 'limpo')
        pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important}');w(250);pg.screenshot(path=T+nome+'.png');b.close()
    # comportamento
    b,pg,w=base.abre(pw,minutos=2);pg.context.grant_permissions(['clipboard-read','clipboard-write'])
    pg.click('#pkok [data-pgcopy]');w(600);print('copiar ->',pg.evaluate("()=>document.querySelector('#pkok [data-pgcopy]').innerText"))
    pg.click('#pkok [data-pzqr]');w(500);print('QR ampliado ->',pg.evaluate("()=>Math.round(document.querySelector('#pgq svg').getBoundingClientRect().width)"));pg.screenshot(path=T+'cel_pix_qr.png')
    pg.click('#pkok [data-pzqr]');w(400);print('QR volta ->',pg.evaluate("()=>Math.round(document.querySelector('#pgq svg').getBoundingClientRect().width)"))
    for x in (35,83,195,308,355): pg.mouse.click(x,40);w(250)
    print('toques no topo -> tela continua:',pg.evaluate("()=>!!document.getElementById('pkok')"))
    pg.click('#pkok [data-pzvolta]');w(1300);print('voltar -> saiu:',pg.evaluate("()=>!document.getElementById('pkok')"),'| aba:',pg.evaluate("()=>(document.querySelector('#layer .mct button.on')||{}).innerText"),'| ícones:',pg.evaluate("()=>getComputedStyle(document.getElementById('mnb')).visibility"))
    print('   olho conta:',olho(pg,w,'#layer .panel') or 'limpo');pg.screenshot(path=T+'conta.png')
    print('   cartão:',pg.evaluate("()=>{const c=document.querySelector('.cfw'),k=c.querySelector('.cfk'),s=c.querySelector('small'),e=c.querySelector('em');const a=k.getBoundingClientRect(),m=s.getBoundingClientRect(),p=e.getBoundingClientRect();return {cancelar:[Math.round(a.height),Math.round(a.top+a.height/2)],meta_centro:Math.round(m.top+m.height/2),direita_cancelar:Math.round(a.right-4),direita_estado:Math.round(p.right)}}"))
    pg.click('.cfw .cfk');w(700);print('cancelar -> janela:',pg.evaluate("()=>{const d=document.getElementById('dlgb');return d?d.innerText.replace(/\\n+/g,' | ').slice(0,120):'NADA'}"))
    pg.click('#dlgb [data-dlgx]');w(500);print('voltar da janela -> pedido continua:',pg.evaluate("()=>!!document.querySelector('.cfw')"))
    pg.click('.cfw .cfk');w(600);pg.click('#dlgb [data-cta=pkcanc2]');w(2000);print('confirmar -> aba:',pg.evaluate("()=>(document.querySelector('#layer .mct button.on')||{}).innerText"),'| estado:',pg.evaluate("()=>(document.querySelector('#layer .cfp em')||{}).innerText"),'| ainda tem cancelar:',pg.evaluate("()=>!!document.querySelector('.cfw')"))
    b.close()
    b,pg,w=base.abre(pw,minutos=2);conta(pg,w);pg.click('.cfw .cfp');w(1300);print('tocar no pedido ->',pg.evaluate("()=>(document.querySelector('#pkok h2')||{}).innerText"));b.close()
    b,pg,w=base.abre(pw,minutos=2,pag='alias');pg.context.grant_permissions(['clipboard-read','clipboard-write'])
    pg.click('#pkok [data-pgc2]');w(500);print('copiar valor ->',pg.evaluate("()=>document.querySelector('#pkok [data-pgc2]').innerText"),'| área:',pg.evaluate("()=>navigator.clipboard.readText()"))
    pg.set_input_files('#pgf','/tmp/s308/comp.png');w(2500);print('comprovante (transferência) ->',pg.evaluate("()=>document.querySelector('#pkok h2').innerText"));b.close()
