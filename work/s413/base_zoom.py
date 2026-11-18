import sys,time,subprocess
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
PROP=open('prop2.js').read()
srv=subprocess.Popen([sys.executable,'/home/claude/lafouch/work/s415/srv.py','8954','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
out=[]
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W in (390,1440):
     for v in ('hoje','prop'):
      c=b.new_context(viewport={'width':W,'height':844},is_mobile=W<700,has_touch=W<1100,device_scale_factor=3,service_workers='block',locale='pt-BR')
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');"+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='prop' else ''))
      pg=c.new_page();pg.goto('http://localhost:8954/');pg.wait_for_timeout(2300)
      pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(400)
      bx=pg.locator('#home .hc').first.bounding_box();(pg.touchscreen.tap if W<1100 else pg.mouse.click)(bx['x']+bx['width']/2,bx['y']+40);pg.wait_for_timeout(1800)
      r=pg.evaluate("""()=>{const b=document.querySelector('#layer .scrim.pg .pgbar');const bl=(e)=>{const p=document.createElement('span');p.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';e.appendChild(p);const y=p.getBoundingClientRect().top;p.remove();return y};
        const bk=b.querySelector('.pgback');const a=bl(bk.querySelector('span')||bk);const c=bl(b.querySelector('.pgcr a,.pgcr span,.pgcr button')||b.querySelector('.pgcr'));const R=b.getBoundingClientRect();return [R.left,R.top,Math.min(R.width,700),R.height,a,c]}""")
      pg.screenshot(path='/tmp/bz.png');c.close()
      im=Image.open('/tmp/bz.png');x,y,w,h,a,cc=[q*3 for q in r];im=im.crop((int(x),int(y),int(x+w),int(y+h)));d=ImageDraw.Draw(im)
      for xx in range(0,im.width,12): d.line((xx,a-y,xx+6,a-y),fill=(0,140,255),width=2)
      out.append((W,v,im,round((a-cc)/3,1)))
finally: srv.terminate()
for W in (390,1440):
  L=[o for o in out if o[0]==W];wid=max(o[2].width for o in L)
  im=Image.new('RGB',(wid,150+sum(o[2].height+70 for o in L)),'white');d=ImageDraw.Draw(im)
  d.text((20,20),'122 · %s · Peça'%('Celular' if W<700 else 'Computador 1440'),font=F(40,True),fill='#2a1f27');d.text((20,84),'Linha azul = linha de base do "Início" (onde as letras apoiam)',font=F(26),fill='#6b5a66');Y=150
  for W_,v,x,dif in L:
    d.rectangle((0,Y,wid,Y+56),fill='#8a8a8a' if v=='hoje' else '#8d3a69');d.text((16,Y+10),('HOJE' if v=='hoje' else 'PROPOSTA (esboço 122)')+' · diferença %s px'%dif,font=F(30,True),fill='white');im.paste(x,(0,Y+56));Y+=56+x.height+14
  im.save('/home/claude/lafouch/work/s413/122f-linha-inicio-catalogo-%d.jpg'%W,quality=90)
print([(o[0],o[1],o[3]) for o in out])
