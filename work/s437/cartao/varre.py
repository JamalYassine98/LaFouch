# varre todas as telas (com a base) procurando SUPERFÍCIES/CARTÕES: fundo diferente do pai, contorno em volta ou sombra
import sys;ARG=sys.argv[1:]
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');sys.path.insert(0,'/home/claude/lafouch/work/verif')
import ap;from telas import C
src=open('/home/claude/lafouch/work/verif/estilos.py').read();exec(src[src.index('LM='):src.index('J=r"""')])
from playwright.sync_api import sync_playwright
esc=ARG[0]=='escuro';parte=int(ARG[1])
J=r"""()=>{const vis=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>2&&r.height>2&&c.visibility!='hidden'&&+c.opacity>0.05&&c.display!='none'};
const bgOf=e=>{for(let p=e;p;p=p.parentElement){const b=getComputedStyle(p).backgroundColor;if(b!='rgba(0, 0, 0, 0)'&&b!='transparent')return b}return 'x'};
const jan=[...document.querySelectorAll('.ljJn,.modal-box,[aria-modal=true],.sheet')].filter(vis).pop();const raiz=jan||document.querySelector('.view.on,.view.active,main')||document.body;
const out=[];raiz.querySelectorAll('div,section,article,details,li,aside,a,label,ul,form,fieldset').forEach(e=>{if(!vis(e)||e===jan)return;if(e.closest('#mainnav,#nvBar,#nvSide,.trk,.catbar3,.sg418,.toast,#fkC'))return;
 const r=e.getBoundingClientRect();if(r.width<120||r.height<36||r.top>2400)return;const c=getComputedStyle(e);
 const b=c.backgroundColor,pb=e.parentElement?bgOf(e.parentElement):'x';const fundo=b!='rgba(0, 0, 0, 0)'&&b!=pb&&!/rgba\(\d+, \d+, \d+, 0\)/.test(b);
 const lados=['Top','Right','Bottom','Left'].filter(s=>parseFloat(c['border'+s+'Width'])>0&&c['border'+s+'Style']!='none').length;
 const sombra=c.boxShadow!='none';const rad=parseFloat(c.borderTopLeftRadius);
 if(!(fundo||lados>=3||sombra))return;if(e.querySelector('input,select,textarea')&&!fundo&&!sombra&&lados<3)return;
 const t=(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,50);
 out.push({cls:(e.tagName.toLowerCase()+'.'+[...e.classList].join('.')).slice(0,60),id:e.id,t,x:Math.round(r.left),y:Math.round(r.top+scrollY),w:Math.round(r.width),h:Math.round(r.height),fundo,lados,sombra,rad})});
 return out.filter(o=>!out.some(p=>p!==o&&false))}"""
L=(C+EXTRA)[parte::2];R={}
with sync_playwright() as pw:
  for nome,ps in L:
    try:
      b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);w(300);pg.evaluate(LM)
      for p in ps:
        try: pg.evaluate(p)
        except Exception: pass
        w(700)
      w(300);R[nome]=pg.evaluate(J);b.close();print(nome,len(R[nome]),flush=True)
    except Exception as e: print('ERRO',nome,str(e)[:80])
json.dump(R,open('cart_%s_%d.json'%(ARG[0],parte),'w'),ensure_ascii=False,indent=0)
