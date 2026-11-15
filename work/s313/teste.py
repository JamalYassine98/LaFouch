# S313: confere as telas de pagamento implementadas (simulador): celular/PC, PIX/transferência, PT/ES, "Mais opções", comprovante, prazo vencido; olho.js parado e rolado.
import sys,os,json;sys.path.insert(0,'/home/claude/lafouch/work/s308');import base
from playwright.sync_api import sync_playwright
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read();T='/tmp/s313/';os.makedirs(T,exist_ok=True)
def olho(pg,w,nome):
    r=[]
    for rola in (0,1):
        pg.evaluate("r=>{const o=document.getElementById('pkok');if(o)o.scrollTop=r?o.scrollHeight:0}",rola);w(350)
        for f in pg.evaluate(OLHO) or []: r.append(('rolado' if rola else 'parado',f['r'],f['n'],tuple(f.get('ex') or [])))
    pg.evaluate("()=>{const o=document.getElementById('pkok');if(o)o.scrollTop=0}");w(250)
    print(nome,'olho:',r or 'limpo')
CASOS=[('cel_pix',dict(minutos=2),None),('cel_pix_0min',dict(minutos=0),None),('cel_pix_mais',dict(minutos=2),'mais'),('cel_venceu',dict(minutos=31),None),('cel_comp',dict(minutos=2,comp=True),None),
       ('cel_trf',dict(minutos=2,pag='alias'),None),('peq_pix',dict(minutos=2,W=360,H=640),None),('pc_pix',dict(minutos=2,W=1440,H=900),None),('tab_pix',dict(minutos=2,W=820,H=1180),None),('cel_venceu_comp',dict(minutos=31,comp=True),None)]
with sync_playwright() as pw:
    for nome,kw,ac in CASOS:
        b,pg,w=base.abre(pw,**kw)
        if ac=='mais': pg.click('[data-pymais]');w(700)
        info=pg.evaluate("""()=>{const o=document.getElementById('pkok');if(!o)return 'SEM TELA';const v=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};
          return {cls:o.className,h2:(o.querySelector('h2')||{}).innerText,sh:o.scrollHeight,ch:o.clientHeight,topo:['mnb','contabtn','sbtn','bagbtn'].map(i=>{const e=document.getElementById(i);return e?v(e):null}),
          japaguei:!!(o.querySelector('#pgcl')&&!o.querySelector('#pgcl').hidden),acoes:[...o.querySelectorAll('button,a,label')].filter(v).map(e=>(e.innerText||'').trim().slice(0,30)+' '+Math.round(e.getBoundingClientRect().height))}}""")
        print(nome,json.dumps(info,ensure_ascii=False))
        olho(pg,w,nome)
        pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important}');w(250)
        pg.screenshot(path=T+nome+'.png');b.close()
