# S330: esboço da janela de Filtros do inventário sem os botões "Ver N peças" e "Cancelar" (o filtro vale na hora; fecha arrastando para baixo ou tocando fora)
# e quadros do trilho ARRASTÁVEL (regra do dono: todo seletor de trilho tem de aceitar o dedo arrastando). App real, escuro e claro. Nada implementado.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s330/';T='/tmp/s330/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
ABRE="()=>{const x=[...document.querySelectorAll('#v-estoque button')].find(b=>/Filtros e ordem/.test(b.getAttribute('aria-label')||''));x.click()}"
PROP="""()=>{const a=document.getElementById('filtApply'),c=document.getElementById('filtCancel');const n=(a.innerText.match(/\\d+/)||['?'])[0];const row=a.parentElement;row.remove();
  const h=document.querySelector('#fbHd h3');const s=document.createElement('small');s.textContent=n+' peças';s.style.cssText='display:block;margin-top:2px;font:400 13px/1.3 inherit;color:var(--mute);font-family:inherit';h.after(s);return 'ok '+n}"""
DEDO="""(a)=>{const [sel,k]=a;const c=document.querySelector(sel),bs=[...c.querySelectorAll('button')];
  // hoje o trilho dos Filtros nem tem pílula que desliza (o fundo pula de um botão para o outro): o esboço põe a pílula do padrão
  let p=c.querySelector('.esbP');if(!p){const cor=getComputedStyle(bs[0]).backgroundColor;c.style.position='relative';p=document.createElement('i');p.className='esbP';p.style.cssText='position:absolute;border-radius:10px;background:'+cor+';z-index:0';c.prepend(p);bs.forEach(x=>{x.style.background='transparent';x.style.position='relative';x.style.zIndex=1})}
  const r0=bs[0].getBoundingClientRect(),r1=bs[1].getBoundingClientRect(),cr=c.getBoundingClientRect();const x=r0.left+(r1.left-r0.left)*k,wd=r0.width+(r1.width-r0.width)*k;
  p.style.left=(x-cr.left)+'px';p.style.top=(r0.top-cr.top)+'px';p.style.height=r0.height+'px';p.style.width=wd+'px';
  if(k>=.5){bs[0].classList.remove('on');bs[1].classList.add('on');bs[0].style.color=getComputedStyle(bs[2]).color}
  let d=document.getElementById('dedo');if(!d){d=document.createElement('div');d.id='dedo';d.style.cssText='position:fixed;z-index:99999;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(243,192,220,.28);border:2px solid rgba(243,192,220,.9);pointer-events:none';document.body.appendChild(d)}
  d.style.left=(x+wd/2)+'px';d.style.top=(r0.top+r0.height/2+6)+'px';return 'ok'}"""
def tela(pw,escuro,prop):
    b,pg,w=base.abre(pw,'estoque',escuro);pg.evaluate(ABRE);w(1300)
    if prop: print('  inj:',pg.evaluate(PROP));w(400)
    p=T+'f_%d_%d.png'%(escuro,prop);pg.screenshot(path=p)
    ach=set(map(str,pg.evaluate(open('/home/claude/lafouch/work/kit/centro.js').read())))|set(str((f['r'],f.get('ex'))) for f in (pg.evaluate(open('/home/claude/lafouch/work/kit/olho.js').read()) or []))
    b.close();return p,ach
def prancha(nome,titulo,sub,cols):
    ims=[Image.open(p) for p,_ in cols];w,h=ims[0].size;g=40;top=250;W=g+len(ims)*(w+g);H=top+h+g
    S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(44,True),fill='#1d1418');d.text((g,98),sub,font=F(27),fill='#55484f')
    for i,(im,(p,r)) in enumerate(zip(ims,cols)):
        x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome)
with sync_playwright() as pw:
    for esc,tema in (() if os.environ.get('SOQ') else ((True,'escuro'),(False,'claro'))):
        a,fa=tela(pw,esc,0);b,fb=tela(pw,esc,1);print('filtros',tema,'achados novos:',sorted(fb-fa) or 'nenhum')
        prancha('9-filtros-%s.jpg'%tema,'Filtros do inventário · tema '+tema,'Sem "Ver N peças" e "Cancelar": o filtro vale na hora e a contagem aparece no título. Fecha arrastando para baixo ou tocando fora.',[(a,'HOJE'),(b,'PROPOSTA')])
    b,pg,w=base.abre(pw,'estoque',True);pg.evaluate(ABRE);w(1300);pg.evaluate(PROP);w(300)
    qs=[]
    for i,k in enumerate((0,.45,1)):
        print('  dedo:',pg.evaluate(DEDO,['#sortChips',k]));w(250);p=T+'d_%d.png'%i;pg.screenshot(path=p,clip={'x':0,'y':250,'width':390,'height':230});qs.append(p)
    b.close()
ims=[Image.open(p) for p in qs];w0,h0=ims[0].size
S=Image.new('RGB',(30+3*(w0+30),h0+150),'#f1eef0');d=ImageDraw.Draw(S)
d.text((30,26),'Trilho arrastável (regra): o dedo leva a pílula',font=F(40,True),fill='#1d1418')
for i,(im,r) in enumerate(zip(ims,('1 · encosta em "Padrão"','2 · arrasta: a pílula acompanha o dedo','3 · solta: assenta em "A a Z"'))):
    x=30+i*(w0+30);d.text((x,92),r,font=F(26,True),fill='#8d3a69');S.paste(im,(x,134))
S.save(OUT+'10-trilho-arrastar-quadros.jpg',quality=86);print('  10-trilho-arrastar-quadros.jpg')
