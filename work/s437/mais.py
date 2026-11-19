exec(open('/home/claude/lafouch/work/s437/esb.py').read())
C['clientes']=["()=>window.__LF.setView('clientes')"]
L=[('atacado-lotes','[data-act=ataLoteNovo]'),('catalogo-carrinho','[data-act=cartclose]'),('catalogo-pagamento','button'),('despesas-conta','[data-act=despNova]'),('clientes','[data-act=clinovo]'),('atacado-lojistas','[data-act=ataNovo]'),('giro-no-estoque','[aria-label=Adicionar]')]
with sync_playwright() as pw:
  for t,s in L:
    b,pg,w=abre(pw,True,C[t])
    r=pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(x=>x.getBoundingClientRect().height&&(s!='button'||/^\\+ Receber/.test(x.textContent.trim())));if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect(),c=getComputedStyle(e);return [r.x,r.y,r.width,r.height,c.color,c.textDecorationLine,c.fontSize,c.borderRadius,e.textContent.trim().slice(0,30)]}",s)
    print(t,r)
    if r: pg.add_style_tag(content='#nvBar{display:none!important}');w(200);pg.screenshot(path=T+'m_%s.png'%t,clip={'x':0,'y':max(0,r[1]-60),'width':390,'height':160})
    b.close()
from PIL import Image
ims=[Image.open(T+'m_%s.png'%t) for t,_ in L if os.path.exists(T+'m_%s.png'%t)]
o=Image.new('RGB',(780,sum(i.height for i in ims)+10*len(ims)),'white');y=0
for i in ims: o.paste(i,(0,y));y+=i.height+10
o.save('/tmp/mais.jpg')
