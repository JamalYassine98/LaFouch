import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
g={};exec(open('esb142.py').read().split('_g={}')[0].replace('with sync_playwright','#'),g)
cs=[c for c in g['CASOS'] if c[0]=='v'][0]
M="""()=>{const c=document.querySelector('#lotView section.card');const ed=[...c.querySelectorAll('button')].find(b=>b.textContent.trim()=='Editar');const tr=c.querySelector('button.trash svg');const nm=c.querySelector('b');
const tl=e=>{const r=document.createRange();r.selectNodeContents(e);return [...r.getClientRects()][0]};const a=tl(ed),n=tl(nm),t=tr.getBoundingClientRect();
const base=e=>{const s=document.createElement('span');s.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';e.prepend(s);const y=s.getBoundingClientRect().top;s.remove();return y};
const ti=c.querySelector('button.trash svg *');const k=[...c.querySelectorAll('button.trash svg path,button.trash svg rect,button.trash svg line')].map(x=>x.getBoundingClientRect());const top=Math.min(...k.map(r=>r.top)),bot=Math.max(...k.map(r=>r.bottom));return {ink_tr:(top+bot)/2,ed_c:(a.top+a.bottom)/2,nm_c:(n.top+n.bottom)/2,tr_c:(t.top+t.bottom)/2,ed_base:base(ed),nm_base:base(nm)}}"""
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for x in dict(C)['inventario-fornecedores']:
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  pg.evaluate(cs[5][0]);w(900);print(pg.evaluate("()=>[String(document.getElementById('v142b')&&document.getElementById('v142b').textContent),String(document.querySelector('#lotView section.card').dataset.v142)]"));A2=open('/home/claude/lafouch/work/verif/alin2.js').read();print('com correção:',[(x['r'],x['ex']) for x in pg.evaluate(A2)]);pg.evaluate("()=>document.getElementById('v142b').remove()");w(300);print('sem correção:',[(x['r'],x['ex']) for x in pg.evaluate(A2)]);b.close()
