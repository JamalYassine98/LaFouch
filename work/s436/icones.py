# S436: mede a cara REAL (desenho visível) de cada botão da família Ícone redondo, nas telas do inventário. Hoje = app + aprovados (base).
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
T=json.load(open('/home/claude/lafouch/work/s436/alvos.json'))
J=r"""(alvos)=>{const out=[];const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight*3};
const bs=[...document.querySelectorAll('button,a,[role=button],[data-act]')].filter(vis);
for(const a of alvos){const b=bs.find(x=>{const t=(x.innerText||'').trim()||x.getAttribute('aria-label')||'';return a===''? (t===''&&x.querySelector('svg,i')) : (t===a||t.startsWith(a)||(x.getAttribute('aria-label')||'')===a)});
 if(!b){out.push({a,achou:0});continue}
 // desenho visível: o próprio botão ou o primeiro filho com fundo/borda
 let d=b;for(const x of [b,...b.querySelectorAll('*')]){const c=getComputedStyle(x);if(parseFloat(c.borderTopWidth)>0||c.backgroundColor!='rgba(0, 0, 0, 0)'){d=x;break}}
 const c=getComputedStyle(d),r=d.getBoundingClientRect(),ic=b.querySelector('svg');const ri=ic?ic.getBoundingClientRect():null;
 const rad=parseFloat(c.borderTopLeftRadius);
 out.push({a,achou:1,cls:b.className.toString().slice(0,40),w:Math.round(r.width),h:Math.round(r.height),raio:Math.round(rad),forma:rad>=Math.min(r.width,r.height)/2-1?'círculo':(rad>=12?'pílula/arredondado':'quadrado'),borda:c.borderTopWidth+' '+c.borderTopColor,fundo:c.backgroundColor,icone:ri?Math.round(ri.width)+'px':'sem svg',texto:(b.innerText||'').trim().slice(0,25),x:Math.round(r.x),y:Math.round(r.y)})}
return out}"""
R={}
with sync_playwright() as pw:
  for tela,alvos in T.items():
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True)
    for p in dict(C).get(tela,[]):
      try: pg.evaluate(p)
      except Exception: pass
      w(600)
    try: R[tela]=pg.evaluate(J,alvos)
    except Exception as e: R[tela]=str(e)[:100]
    b.close()
json.dump(R,open('/home/claude/lafouch/work/s436/icones.json','w'),ensure_ascii=False,indent=1)
