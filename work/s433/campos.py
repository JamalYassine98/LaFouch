import sys,os,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
part=int(os.environ['P']);N=4;os.makedirs('crop',exist_ok=True)
J='''()=>{const o=[];document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]):not([type=file]),select,textarea').forEach(i=>{const r=i.getBoundingClientRect();if(r.width<20||r.height<10||r.bottom<0||r.top>innerHeight)return;const c=getComputedStyle(i);
const bg=c.backgroundColor,bt=c.borderTopWidth,bb=c.borderBottomWidth,rad=c.borderTopLeftRadius;
const caixa=bg!='rgba(0, 0, 0, 0)'||parseFloat(bt)>0;
const k=(i.tagName=='SELECT'?'lista':'campo')+'|'+(caixa?(parseFloat(rad)>=12?'caixa redonda':'caixa'):(parseFloat(bb)>0?'linha':'sem nada'))+'|'+(r.width>300?'largo':'estreito');
o.push({k,x:r.x,y:r.y,w:r.width,h:r.height,bg,bt,bb,rad,ph:i.placeholder||'',val:i.value||''})});return o}'''
res={}
with sync_playwright() as pw:
  for n,(t,ps) in enumerate(C):
    if n%N!=part:continue
    try:
      b,pg,w=ap.abre(pw,'inicio',True);w(300)
      for x in ps:
        try:pg.evaluate(x)
        except Exception:pass
        w(700)
      o=pg.evaluate(J);res[t]=o
      seen=set()
      for e in o:
        if e['k'] in seen:continue
        seen.add(e['k']);f='crop/%s__%s.png'%(e['k'].replace('|','_').replace(' ','-'),t)
        pg.screenshot(path=f,clip={'x':max(0,e['x']-24),'y':max(0,e['y']-40),'width':min(e['w']+48,430),'height':e['h']+60})
      b.close()
    except Exception as ex:print(t,ex)
json.dump(res,open('c%d.json'%part,'w'))
