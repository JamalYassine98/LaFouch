import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,mede as M
from playwright.sync_api import sync_playwright
from PIL import Image
with sync_playwright() as pw:
  out=[]
  for nome,v,acao in (('sons','ajustes',"()=>{const r=[...document.querySelectorAll('.ajS')].find(s=>/Sons/.test(s.textContent));const b=r&&(r.querySelector('.ajR')||r);b&&b.click();return !!r}"),
                      ('adicionar','estoque',"()=>{const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/Adicionar|^\\+$/.test((b.getAttribute('aria-label')||'')+b.textContent.trim()));b&&b.click();return b?(b.getAttribute('aria-label')||b.textContent):'nada'}")):
    b,pg,w=ap.abre(pw,v,True,'celular',base=False);w(900);print(nome,pg.evaluate(acao));w(1500)
    if nome=='adicionar':
      print(pg.evaluate("()=>{const b=[...document.querySelectorAll('button,[role=button]')].find(b=>b.offsetParent&&/Preencher/.test(b.textContent));if(b){b.click();return 'preencher'}return 'sem preencher'}"));w(1500)
    a,_=M.percorre(pg,None);print(nome,[(k[0],x.get('d','')[:80]) for k,x in a.items()][:6])
    f='/tmp/c2_%s.png'%nome;pg.screenshot(path=f);b.close();out.append(Image.open(f).convert('RGB'))
  W=sum(i.width for i in out)+20;H=max(i.height for i in out);o=Image.new('RGB',(W,H),(17,20,26));x=0
  for i in out:o.paste(i,(x,0));x+=i.width+20
  o.save('conf_v634_sons_adicionar.jpg',quality=82)
