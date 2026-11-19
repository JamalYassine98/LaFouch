exec(open('cam.py').read().split("if __name__")[0])
from PIL import Image,ImageDraw,ImageFont
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
PROP=r"""(modo)=>{const o=document.getElementById('estCam');if(!o||o.dataset.p)return;o.dataset.p=1;o.classList.add('ecP',modo=='d'?'ecPD':'ecPE');
 const q=s=>o.querySelector(s);const x=q('[data-c=x]'),man=q('.ecMan'),tag=q('.ecTag'),fr=q('.ecFrase'),sh=q('.ecSh'),gal=q('.ecGal'),vf=q('.ecVf');
 const st=document.createElement('style');st.textContent=`
 #estCam.ecP{background:#000}
 #estCam.ecP .ecTop,#estCam.ecP .ecBot{display:none!important}
 #estCam.ecP .ecPainel{position:absolute;display:flex;z-index:5;color:#fff}
 #estCam.ecP .ecTag{position:static!important;transform:none!important;background:none!important;padding:0!important;color:rgba(255,255,255,.72)!important;font-size:13px!important;line-height:1.35!important;white-space:normal!important;text-align:left!important;max-width:none!important;margin:0!important;overflow:visible!important;text-indent:0!important;left:auto!important;width:auto!important}
 #estCam.ecP .ecFrase{position:static!important;transform:none!important;left:auto!important;right:auto!important;bottom:auto!important;width:auto!important;max-width:none!important;background:none!important;box-shadow:none!important;padding:0!important;margin:0!important;border-radius:0!important;display:flex!important;align-items:flex-start!important;gap:8px!important;font-size:16px!important;line-height:1.35!important;text-align:left!important;justify-content:flex-start!important}
 #estCam.ecP .ecFrase i{flex:0 0 10px;margin-top:6px}
 #estCam.ecPD .ecVf{position:absolute!important;top:0!important;bottom:0!important;left:168px!important;right:120px!important;height:auto!important;width:auto!important;margin:0!important}
 #estCam.ecPD .ecL{left:16px;top:16px;bottom:16px;width:136px;flex-direction:column;gap:16px}
 #estCam.ecPD .ecR{right:0;top:16px;bottom:16px;width:120px;flex-direction:column;align-items:center;justify-content:space-between}
 #estCam.ecPE .ecVf{position:absolute!important;top:104px!important;left:0!important;right:0!important;height:520px!important;bottom:auto!important;margin:0!important}
 #estCam.ecPE .ecT{left:16px;right:16px;top:12px;height:44px;align-items:center;justify-content:space-between}
 #estCam.ecPE .ecTg{left:16px;right:16px;top:64px;height:32px;align-items:center;justify-content:center}
 #estCam.ecPE .ecTg .ecTag{text-align:center!important}
 #estCam.ecPE .ecM{left:24px;right:24px;top:640px;height:56px;align-items:center;justify-content:center}
 #estCam.ecPE .ecB{left:0;right:0;bottom:24px;height:80px;align-items:center;justify-content:center;gap:48px}
 #estCam.ecP .ecPainel .ecPill{position:static!important;margin:0!important;flex:0 0 auto!important;width:44px!important;height:44px!important;min-width:0!important;padding:0!important;align-self:flex-start;display:flex!important;align-items:center!important;justify-content:center!important}
 #estCam.ecPD .ecR .ecPill{align-self:center}
 #estCam.ecP .ecSh{position:static!important;margin:0!important}
 #estCam.ecP .ecGal{position:static!important;margin:0!important}
 `;o.appendChild(st);
 const P=c=>{const d=document.createElement('div');d.className='ecPainel '+c;o.appendChild(d);return d};
 if(modo=='d'){const L=P('ecL'),R=P('ecR');L.append(x,tag,fr);const sp=document.createElement('span');sp.style.height='44px';R.append(man,sh,gal)}
 else{const T=P('ecT'),G=P('ecTg'),M=P('ecM'),B=P('ecB');T.append(x,man);G.append(tag);M.append(fr);const sp=document.createElement('span');sp.style.width='63px';B.append(sp,sh,gal)}}"""
def quadro(arq,esc,q,lado):
  ims=[Image.open(p).convert('RGB') for _,_,p in q];w,h=ims[0].size;g=40
  if lado:
    W=g+len(ims)*(w+g);S=Image.new('RGB',(W,h+160),(17,20,26));d=ImageDraw.Draw(S)
    for i,((t,s,_),im) in enumerate(zip(q,ims)):
      x=g+i*(w+g);d.text((x,24),t,font=F(36),fill=(235,235,240));d.text((x,72),s,font=F(24),fill=(140,150,165));S.paste(im,(x,130));d.rectangle([x-1,129,x+w,130+h],outline=(90,90,100))
  else:
    H=sum(h+150 for _ in ims)+g;S=Image.new('RGB',(w+2*g,H),(17,20,26));d=ImageDraw.Draw(S);y=g
    for (t,s,_),im in zip(q,ims):
      d.text((g,y),t,font=F(36),fill=(235,235,240));d.text((g,y+46),s,font=F(24),fill=(140,150,165));S.paste(im,(g,y+100));d.rectangle([g-1,y+99,g+w,y+100+h],outline=(90,90,100));y+=h+150
  S.save(arq,quality=90);print('ok',arq)
with sync_playwright() as pw:
  for nome,(W,H),m in (('deitado',(844,390),'d'),('empe',(390,844),'e')):
    fs=[]
    for fase in ('hoje','prop'):
      b,pg=abre(pw,W,H);cam(pg)
      if fase=='prop': pg.evaluate(PROP,m);pg.wait_for_timeout(700)
      f='/tmp/cam_%s_%s.png'%(nome,fase);pg.screenshot(path=f);fs.append(f)
      if fase=='prop': print(nome,pg.evaluate("()=>{const o=document.getElementById('estCam');const r=e=>{const b=e.getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)]};return {vf:r(o.querySelector('.ecVf')),fr:r(o.querySelector('.ecFrase')),sh:r(o.querySelector('.ecSh')),gal:r(o.querySelector('.ecGal')),x:r(o.querySelector('[data-c=x]')),man:r(o.querySelector('.ecMan')),tag:r(o.querySelector('.ecTag')),gd:r(o.querySelector('.ecGd'))}}"))
      b.close()
    quadro('/home/claude/lafouch/work/estudio-camera/esboco_camera_%s.jpg'%nome,True,[('HOJE · câmera '+('deitado' if m=='d' else 'em pé'),'faixa fina, aviso tampando a peça' if m=='d' else 'aviso tampando a imagem',fs[0]),('PROPOSTA · '+('deitado' if m=='d' else 'em pé'),'câmera na altura inteira, controles na lateral, aviso fora' if m=='d' else 'imagem inteira, aviso embaixo da imagem',fs[1])],m=='e')
