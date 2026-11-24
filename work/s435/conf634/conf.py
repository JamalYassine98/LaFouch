# Conferência ESBOCO das Partes 1–3 publicadas (v632–v634), app REAL de hoje (www do main), sem aplicar esboço nenhum.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,mede as M
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/conf634/'
T=[('Ajustes','ajustes',None),('Sons e avisos','ajustes',"()=>{const r=document.querySelector('.ajS[data-k=av] .ajR');r&&r.click()}"),('Caixa','caixa',None),('Vender','vendas',None),
   ('Histórico','inicio',"()=>__LF.inicioGo('hist')"),('Despesas','inicio',"()=>__LF.inicioGo('desp')"),('Clientes','inicio',"()=>__LF.inicioGo('cli')"),('Pedidos','inicio',"()=>__LF.inicioGo('ped')"),
   ('Preços','inicio',"()=>__LF.inicioGo('prec')"),('Fornecedores','inicio',"()=>__LF.inicioGo('lotes')"),('Marketing','inicio',"()=>__LF.inicioGo('mkt')"),('Adicionar','estoque',"()=>{const b=document.getElementById('addToMan');b&&b.click()}")]
R={}
def tela(pw,esc,nome,v,js):
  b,pg,w=ap.abre(pw,v,esc,'celular',base=False);w(900)
  if js:
    try:pg.evaluate(js)
    except Exception as e:R.setdefault(nome,[]).append(('erro js',str(e)[:80]))
    w(1200)
  try:
    a,_=M.percorre(pg,None);R.setdefault(nome+(' esc' if esc else ' cla'),[(k[0],v_.get('d','')[:90]) for k,v_ in a.items()])
  except Exception as e:R[nome]=[('erro medidor',str(e)[:80])]
  pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}");w(300)
  pg.screenshot(path='/tmp/c634.png',full_page=True);b.close();im=Image.open('/tmp/c634.png').convert('RGB');return im.crop((0,0,im.width,min(im.height,1700)))
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',28)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';ims=[(nm,tela(pw,esc,nm,v,js)) for nm,v,js in T]
    W=max(i.width for _,i in ims);H=max(i.height for _,i in ims);cols=6;rows=(len(ims)+cols-1)//cols
    o=Image.new('RGB',(cols*(W+20)+20,rows*(H+70)+20),(17,20,26));d=ImageDraw.Draw(o)
    for k,(nm,im) in enumerate(ims):
      x=20+(k%cols)*(W+20);y=20+(k//cols)*(H+70);d.text((x,y),nm,font=F,fill=(235,235,240));o.paste(im,(x,y+44))
    o.save(O+'conf_v634_%s.jpg'%n,quality=80);print('ok',n)
json.dump(R,open(O+'achados.json','w'),ensure_ascii=False,indent=1)
for k,v in R.items():print(k,len(v),v[:5])
