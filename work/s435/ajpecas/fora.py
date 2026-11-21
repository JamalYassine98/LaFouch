import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/ajpecas/'
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False)
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  # mesma marcação fora do #v-grp (como no fundo do arrastar)
  pg.evaluate("""()=>{const g=document.getElementById('v-grp');const d=document.createElement('div');d.className='view';d.innerHTML=g.innerHTML;g.hidden=true;g.parentNode.insertBefore(d,g)}""");w(300)
  pg.screenshot(path=O+'h_pecas_fora.png')
  b.close()
