# Esboço 149cam-F: câmera do Estúdio FUNCIONANDO como teste-giro/conferir (work/s296/conferir.js), por cima do 149cam (já na base)
exec(open('cam.py').read().split("if __name__")[0])
from PIL import Image,ImageDraw,ImageFont
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
ITENS=[('deitado','Celular deitado'),('firme','Celular parado'),('luz','Luz do fundo'),('peca','Peça no prato'),('dist','Distância'),('meio','Peça no meio'),('altura','Altura da câmera'),('costura','Fundo sem costura'),('foco','Foco na peça'),('folga','Folga nas bordas')]
EST={
 'conf':dict(ok={'deitado':1,'firme':1,'luz':0,'peca':1,'dist':1,'meio':1,'altura':1,'costura':1,'foco':None,'folga':1},verde=0,frase='Falta luz: aumente a luz da caixa',rec='off',trava=''),
 'pronto':dict(ok={k:1 for k,_ in ITENS},verde=1,frase='Tudo certo · pode gravar',rec='on',trava=''),
 'grav':dict(ok={k:1 for k,_ in ITENS},verde=1,frase='Gravando a volta… não toque no celular',rec='grav',trava='Travado: foco, luz, branco',tempo='0:42'),
 'meio':dict(ok={'deitado':1,'firme':1,'luz':1,'peca':1,'dist':1,'meio':0,'altura':1,'costura':1,'foco':1,'folga':1},verde=0,frase='Vire o celular um pouco para a esquerda (a peça está à esquerda)',rec='off',trava=''),
 'dist':dict(ok={'deitado':1,'firme':1,'luz':1,'peca':1,'dist':0,'meio':1,'altura':1,'costura':1,'foco':1,'folga':0},verde=0,frase='Aproxime o celular (a peça está pequena)',rec='off',trava=''),
 'empe':dict(ok={'deitado':0,'firme':None,'luz':None,'peca':None,'dist':None,'meio':None,'altura':None,'costura':None,'foco':None,'folga':None},verde=0,frase='Deite o celular',rec='off',trava=''),
}
JS=r"""(a)=>{const o=document.getElementById('estCam');if(!o)return;const E=a.e,IT=a.it,dei=o.classList.contains('ecPD');
 const st=document.createElement('style');st.textContent=`
 #estCam .ecMold{position:absolute;inset:0;border:3px solid ${E.verde?'#3ecf7a':'rgba(255,255,255,.8)'};pointer-events:none;z-index:6}
 #estCam .ecGd{display:none!important}
 #estCam .ecChk{display:flex;flex-direction:column;gap:0;margin:0}
 #estCam .ecChk span{display:flex;align-items:center;gap:8px;height:18px;font-size:12px;color:rgba(255,255,255,.82);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 #estCam .ecChk i{flex:0 0 14px;height:14px;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:11px;font-weight:700;border-radius:50%}
 #estCam .ecChk .s i{color:#0b2a17;background:var(--ok,#3ecf7a)}#estCam .ecChk .n i{color:#2a2000;background:#e0b44c}#estCam .ecChk .q i{border:1.5px solid rgba(255,255,255,.4)}
 #estCam .ecChk .n{color:#fff;font-weight:600}
 #estCam .ecTr{font-size:12px;color:rgba(255,255,255,.62)}
 #estCam .ecRec{width:74px;height:74px;border-radius:50%;border:4px solid #fff;display:flex;align-items:center;justify-content:center;background:none;padding:0;opacity:${E.rec=='off'?.38:1}}
 #estCam .ecRec b{display:block;width:${E.rec=='grav'?26:58}px;height:${E.rec=='grav'?26:58}px;border-radius:${E.rec=='grav'?6:50}%;background:#d92d4b}
 #estCam .ecRL{font-size:12px;color:#fff;text-align:center;margin-top:8px;white-space:nowrap}
 #estCam .ecPt{position:absolute;right:12px;top:12px;padding:6px 12px;border-radius:999px;background:rgba(217,45,75,.92);color:#fff;font:600 14px/1 system-ui;font-variant-numeric:tabular-nums;z-index:6}
 #estCam .ecFrase{color:${E.verde?'#8fe3b0':'#fff'}!important}`;o.appendChild(st);
 const tag=o.querySelector('.ecTag');if(tag)tag.textContent='Giro · volta de 360°';
 const f0=o.querySelector('.ecFrase');if(f0){const n=f0.cloneNode(true);n.classList.remove('ecFrase');n.classList.add('ecFrase2');const cs=getComputedStyle(f0);n.style.cssText='display:flex;align-items:flex-start;gap:8px;font-family:system-ui,Roboto,sans-serif;font-weight:600;font-size:16px;line-height:1.3';n.querySelector('span').textContent=E.frase;const ii=n.querySelector('i');if(ii){ii.style.cssText='flex:0 0 10px;width:10px;height:10px;border-radius:50%;margin-top:5px;background:'+(E.verde?'#3ecf7a':'#e0b44c')}n.style.color=E.verde?'#8fe3b0':'#fff';f0.parentNode.insertBefore(n,f0);f0.style.setProperty('display','none','important')}const md=document.createElement('div');md.className='ecMold';o.querySelector('.ecVf').appendChild(md);const fi=o.querySelector('.ecFrase i');if(fi)fi.style.setProperty('background',E.verde?'var(--ok,#3ecf7a)':'#e0b44c','important');
 const L=document.createElement('div');L.className='ecChk';L.innerHTML=IT.map(x=>{const v=E.ok[x[0]];return '<span class="'+(v===1?'s':v===0?'n':'q')+'"><i>'+(v===1?'✓':v===0?'!':'')+'</i>'+x[1]+'</span>'}).join('');
 const tr=document.createElement('div');tr.className='ecTr';tr.textContent=E.trava;
 const sh=o.querySelector('.ecSh');const w=document.createElement('div');w.style.cssText='display:flex;flex-direction:column;align-items:center';w.innerHTML='<button type="button" class="ecRec" aria-label="Gravar a volta"><b></b></button><div class="ecRL">'+(E.rec=='grav'?'Parar':'Gravar a volta')+'</div>';sh.replaceWith(w);
 const gal=o.querySelector('.ecGal');if(gal&&E.rec=='grav')gal.style.setProperty('visibility','hidden','important');
 if(E.tempo){const p=document.createElement('div');p.className='ecPt';p.textContent=E.tempo+' / 1:00';o.querySelector('.ecVf').appendChild(p)}
 if(dei){const l=o.querySelector('.ecL');l.style.setProperty('gap','12px','important');const f2=o.querySelector('.ecFrase2');f2.style.fontSize='16px';f2.style.fontWeight='600';f2.style.fontFamily='system-ui,Roboto,sans-serif';f2.style.lineHeight='1.3';const tg=o.querySelector('.ecTag');tg.after(f2);f2.after(L);if(E.trava)l.appendChild(tr)}
 else{const m=o.querySelector('.ecM');if(E.trava)m.appendChild(tr)}}"""
def quadro(arq,q,lado):
  ims=[Image.open(p).convert('RGB') for _,_,p in q];w,h=ims[0].size;g=40
  if lado:
    W=g+len(ims)*(w+g);S=Image.new('RGB',(W,h+160),(17,20,26));d=ImageDraw.Draw(S)
    for i,((t,s,_),im) in enumerate(zip(q,ims)):
      x=g+i*(w+g);d.text((x,24),t,font=F(34),fill=(235,235,240));d.text((x,72),s,font=F(22),fill=(140,150,165));S.paste(im,(x,130));d.rectangle([x-1,129,x+w,130+h],outline=(90,90,100))
  else:
    H=sum(h+150 for _ in ims)+g;S=Image.new('RGB',(w+2*g,H),(17,20,26));d=ImageDraw.Draw(S);y=g
    for (t,s,_),im in zip(q,ims):
      d.text((g,y),t,font=F(34),fill=(235,235,240));d.text((g,y+46),s,font=F(22),fill=(140,150,165));S.paste(im,(g,y+100));d.rectangle([g-1,y+99,g+w,y+100+h],outline=(90,90,100));y+=h+150
  S.save(arq,quality=90);print('ok',arq)
with sync_playwright() as pw:
  def tira(W,H,est,nome):
    b,pg=abre(pw,W,H);cam(pg);pg.wait_for_timeout(400)
    if est: pg.evaluate(JS,{'e':EST[est],'it':ITENS});pg.wait_for_timeout(400)
    f='/tmp/camF_%s.png'%nome;pg.screenshot(path=f)
    if est: print(nome,pg.evaluate("()=>{const o=document.getElementById('estCam');const r=e=>{if(!e)return null;const b=e.getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)]};return {chk:r(o.querySelector('.ecChk')),fr:r(o.querySelector('.ecFrase')),tr:r(o.querySelector('.ecTr')),rec:r(o.querySelector('.ecRec')),gal:r(o.querySelector('.ecGal'))}}"))
    b.close();return f
  h=tira(844,390,None,'hoje_d')
  quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camF_deitado.jpg',[('HOJE · deitado (149cam aprovado)','só a frase; sem conferência, sem gravar',h),
    ('PROPOSTA · conferindo','10 itens ao vivo · moldura branca · uma frase',tira(844,390,'conf','conf')),
    ('PROPOSTA · pronto','tudo ✓ · moldura verde · Gravar a volta liberado',tira(844,390,'pronto','pronto')),
    ('PROPOSTA · gravando','foco/luz/branco travados · para sozinha em 1:00',tira(844,390,'grav','grav'))],False)
  quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camF_frases.jpg',[('PROPOSTA · o que fazer: luz','a frase diz a ação, igual ao site',tira(844,390,'conf','f1')),('PROPOSTA · o que fazer: posição','"Vire o celular um pouco para a esquerda"',tira(844,390,'meio','f2')),('PROPOSTA · o que fazer: distância','"Aproxime o celular"',tira(844,390,'dist','f3'))],False)
  he=tira(390,844,None,'hoje_e')
  quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camF_empe.jpg',[('HOJE · em pé (149cam)','só a frase',he),('PROPOSTA · em pé','pede para deitar; gravar só deitado',tira(390,844,'empe','empe'))],True)
