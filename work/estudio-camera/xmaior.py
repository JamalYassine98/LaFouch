exec(open("modo2.py").read().rsplit("with sync_playwright() as pw:",1)[0])
X=r"""()=>{const x=document.querySelector('#estCam [data-c=x]');if(!x)return;x.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';x.style.setProperty('color','#fff','important')}"""
with sync_playwright() as pw:
  fs=[]
  for W,H,cl in ((844,390,(0,0,200,140)),(390,844,(0,0,200,140))):
    for fase in (0,1):
      b,pg=abre(pw,W,H);cam(pg);pg.wait_for_timeout(400);pg.evaluate(JS,{'e':EV,'it':ITENS});pg.evaluate(SEG,'v')
      if fase: pg.evaluate(X)
      pg.wait_for_timeout(300);f='/tmp/x_%d_%d.png'%(W,fase);pg.screenshot(path=f,clip={'x':0,'y':0,'width':200,'height':90});fs.append(f);b.close()
  ims=[Image.open(f) for f in fs];w,h=ims[0].size;S=Image.new('RGB',(40+2*(w+40),2*(h+110)+20),(17,20,26));d=ImageDraw.Draw(S)
  for r in range(2):
    for c in range(2):
      x=40+c*(w+40);y=20+r*(h+110);d.text((x,y),('HOJE · ' if c==0 else 'PROPOSTA · ')+('deitado' if r==0 else 'em pé'),font=F(28),fill=(235,235,240));d.text((x,y+38),'× 10 px' if c==0 else '× 20 px (botão continua 44 px)',font=F(20),fill=(140,150,165));S.paste(ims[r*2+c],(x,y+70))
  S.save('/home/claude/lafouch/work/estudio-camera/esboco_149camX.jpg',quality=92);print('ok')
