# S374 · esboço 97 (dono 17/11 10:33 "Sim"): "Prévia do site ›" logo embaixo do estado, no mesmo cartão; os 4 números embaixo; sem linha solta no fim.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s95=open('/home/claude/lafouch/work/s374/esb95.py').read();s96=open('/home/claude/lafouch/work/s374/esb96.py').read()
TELA=s95.split('SITE_TELA=r"""')[1].split('"""')[0]
CSS=s96.split('CSS="""')[1].split('"""')[0]
JS96=s96.split('JS=r"""')[1].split('"""')[0]
CSS2=CSS+"""
#v-site .cx97{border:1px solid var(--line);background:var(--panel);border-radius:16px;margin:0 0 14px;overflow:hidden}
#v-site .cx97 .st96{border:0;border-radius:0;margin:0;background:none}
#v-site .cx97 .pv97{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:12px 16px 12px 38px;border:0;border-top:1px solid var(--line);background:none;color:var(--fg);font:inherit;text-align:left}
#v-site .cx97 .pv97 span{flex:1}#v-site .cx97 .pv97 b{font-size:16px;font-weight:600}#v-site .cx97 .pv97 small{color:var(--mute);font-size:13px}#v-site .cx97 .pv97 em{font-style:normal;color:var(--mute);font-size:18px}
"""
JS97=r"""(off)=>{const v=document.getElementById('v-site');const st=v.querySelector('.st96');const c=document.createElement('div');c.className='cx97';st.before(c);c.appendChild(st);
 const p=document.createElement('button');p.type='button';p.className='pv97';p.innerHTML='<span><b>Prévia do site</b></span><small>preços e descontos</small><em>›</em>';c.appendChild(p);
 const ls=v.querySelector('.stLs');if(ls)ls.remove();return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,off in (('a',0),('b',1)):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(700);pg.evaluate("()=>window.__LF.setView('site')");w(900);pg.evaluate(TELA)
                pg.add_style_tag(content=CSS2);pg.evaluate(JS96,off)
                if prop: pg.evaluate(JS97,off)
                w(300);oo.append(olho(pg));p=T+'s97_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            prancha('97%s-app-tela-site-%s-%s.jpg'%(k,'desligado' if off else 'no-ar',tema),'App · Tela Site · prévia junto do estado · site %s · tema %s'%('desligado' if off else 'no ar',tema),
              ['Esquerda = 96: "Prévia do site ›" sozinha no fim da tela, longe do estado do site.',
               'Proposta: estado e "Prévia do site ›" no mesmo cartão, no topo; os 4 números embaixo; a tela termina neles. Tocar no estado abre Ajustes › Site (a chave fica lá).'],*fs)
