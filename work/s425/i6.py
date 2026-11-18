import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
exec(open('esb135.py').read().split('with sync_playwright')[0])
from playwright.sync_api import sync_playwright
c=[x for x in CASOS if x[0]=='b'][0]
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for p in c[3]: pg.evaluate(p);w(900)
  pg.add_style_tag(content=c[4]);[pg.evaluate(x) for x in c[5]];w(500)
  print(pg.evaluate("""()=>{const n=[...document.querySelectorAll('.note.n-bad')];return n.map(e=>{const r=e.getBoundingClientRect();let out=[];for(const [x,y] of [[r.left+1,r.top+1],[r.left-1,r.top+5]]){let t=document.elementFromPoint(x,y);let L=[];while(t&&L.length<4){const s=getComputedStyle(t);L.push(t.tagName+'.'+t.className+' bg='+s.backgroundColor+' bd='+s.borderTopWidth);t=t.parentElement}out.push(L.join(' < '))}return [Math.round(r.top),Math.round(r.height),getComputedStyle(e).border,getComputedStyle(e).backgroundColor,...out]})}"""))
  b.close()
