# 149cam-M: uma câmera só, escolha de dois lados "Foto | Vídeo" junto do disparo; Vídeo abre como padrão (dono 19/11 20:01)
exec(open('funciona.py').read().split("with sync_playwright() as pw:")[0])
I4=[('fundo','Fundo branco'),('foco','Foco'),('reto','Reto'),('dist','Distância')]
EF=dict(ok={'fundo':1,'foco':1,'reto':0,'dist':1},verde=0,frase='Deixe o celular reto',rec='off',trava='')
EV=dict(EST['conf'])
SEG=r"""(m)=>{const o=document.getElementById('estCam');const dei=o.classList.contains('ecPD');
 const st=document.createElement('style');st.textContent=`#estCam .ecSeg{display:flex;padding:2px;border-radius:12px;background:rgba(255,255,255,.08)}
 #estCam .ecSeg button{height:32px;min-width:50px;padding:0 10px;border:0;border-radius:10px;background:none;color:rgba(255,255,255,.6);font:600 14px/1 system-ui}
 #estCam .ecSeg button.on{background:#2a2f38;color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.4)}
 #estCam .ecSh2{width:74px;height:74px;border-radius:50%;border:4px solid #fff;display:flex;align-items:center;justify-content:center;background:none;padding:0}#estCam .ecSh2 b{width:58px;height:58px;border-radius:50%;background:#fff;display:block;opacity:${m=='f'?1:1}}`;o.appendChild(st);
 const sg=document.createElement('div');sg.className='ecSeg';sg.setAttribute('role','group');sg.setAttribute('aria-label','Foto ou vídeo');sg.innerHTML='<button type="button" class="'+(m=='f'?'on':'')+'">Foto</button><button type="button" class="'+(m=='v'?'on':'')+'">Vídeo</button>';
 const rec=o.querySelector('.ecRec').parentNode;
 if(m=='f'){const w=document.createElement('div');w.style.cssText='display:flex;flex-direction:column;align-items:center';w.innerHTML='<button type="button" class="ecSh2" aria-label="Fotografar"><b></b></button><div class="ecRL">Fotografar</div>';rec.replaceWith(w);w.parentNode.insertBefore(sg,w);
   const tag=o.querySelector('.ecTag');if(tag)tag.textContent='Frente · 1 de 2';}
 else{rec.parentNode.insertBefore(sg,rec)}
 if(dei){const R=o.querySelector('.ecR');R.style.setProperty('justify-content','space-between','important');const box=document.createElement('div');box.style.cssText='display:flex;flex-direction:column;align-items:center;gap:16px';const sh=sg.nextSibling;R.insertBefore(box,sg);box.appendChild(sg);box.appendChild(sh)}
 else{const B=o.querySelector('.ecB');B.style.setProperty('flex-direction','column','important');B.style.setProperty('height','auto','important');B.style.setProperty('gap','12px','important');B.style.setProperty('bottom','16px','important');
   const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;justify-content:center;gap:48px';const kids=[...B.children].filter(k=>k!==sg);kids.forEach(k=>row.appendChild(k));B.appendChild(row);B.insertBefore(sg,row)}}"""
with sync_playwright() as pw:
  def tira(W,H,est,it,nome,m=None):
    b,pg=abre(pw,W,H);cam(pg);pg.wait_for_timeout(400)
    pg.evaluate(JS,{'e':est,'it':it});pg.wait_for_timeout(300)
    if m: pg.evaluate(SEG,m);pg.wait_for_timeout(300)
    f='/tmp/camM_%s.png'%nome;pg.screenshot(path=f);b.close();return f
  quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camM_deitado.jpg',[
    ('HOJE · 149cam-F aprovado (só vídeo)','10 itens + Gravar a volta',tira(844,390,EV,ITENS,'h')),
    ('PROPOSTA · Vídeo (abre assim)','escolha Foto | Vídeo em cima do botão; as fotos saem do giro',tira(844,390,EV,ITENS,'v','v')),
    ('PROPOSTA · Foto','4 itens + disparo (Frente · 3/4)',tira(844,390,EF,I4,'f','f'))],False)
  EVe=dict(EST['empe']);EFe=dict(EF,frase='Deixe o celular reto')
  quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camM_empe.jpg',[
    ('HOJE · 149cam-F em pé','só vídeo: pede para deitar',tira(390,844,EVe,ITENS,'he')),
    ('PROPOSTA · Vídeo','pede para deitar; escolha em cima do botão',tira(390,844,EVe,ITENS,'ve','v')),
    ('PROPOSTA · Foto','em pé a foto funciona',tira(390,844,EFe,I4,'fe','f'))],True)
