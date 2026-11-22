import sys;sys.path.insert(0,'/home/claude/lafouch/work/kit');import painel
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/painelsite/estudo/'
def clica(pg,txt):
  return pg.evaluate("(t)=>{const e=[...document.querySelectorAll('button,a,.row,[role=button],.card,summary,div')].filter(x=>x.offsetParent&&x.children.length<8&&x.textContent.trim().startsWith(t));const k=e[e.length-1];if(k){k.click();return k.tagName+'.'+k.className}return null}",txt)
out=[]
with sync_playwright() as pw:
  b,pg,w,log=painel.abre(pw,True,390,844)
  for v,itens in [('vit',['Mudar','Efeitos','Ordem do catálogo','Precisa de atenção','Opiniões para revisar']),('cfg',['Entrega','Avaliações dos clientes','Inscritos em novidades','Se você desligar','Github','Segurança','Conta']),('prod',['Leitura retangular 2'])]:
    for it in itens:
      painel.vai(pg,v);w(700);r=clica(pg,it);w(1200)
      t=pg.evaluate("()=>{const m=[...document.querySelectorAll('.modal,.sheet,.ov,[role=dialog],.pnl,.sub,.det')].filter(e=>e.offsetParent&&e.getBoundingClientRect().height>100);return (m.length?m[m.length-1]:document.body).innerText}")
      out.append('=== %s › %s (%s)\n%s\n'%(v,it,r,t.replace('\n',' | ')[:1500]))
      pg.screenshot(path=O+'s_%s_%s.png'%(v,it.split()[0]))
      pg.keyboard.press('Escape');w(300)
  b.close()
open(O+'txt_sub.txt','w').write('\n'.join(out));print('\n'.join(out))
