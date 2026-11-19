# 149cam-M: uma câmera só, escolha de dois lados "Foto | Vídeo" junto do disparo; Vídeo abre como padrão (dono 19/11 20:01)
exec(open('funciona.py').read().split("with sync_playwright() as pw:")[0])
I4=[('fundo','Fundo branco'),('foco','Foco'),('reto','Reto'),('dist','Distância')]
EF=dict(ok={'fundo':1,'foco':1,'reto':0,'dist':1},verde=0,frase='Deixe o celular reto',rec='off',trava='')
EV=dict(EST['conf'])
SEG=r"""(m)=>{const o=document.getElementById('estCam');const dei=o.classList.contains('ecPD');
 const IC={v:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/></svg>',
  f:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  g:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 9"/></svg>'};
 const st=document.createElement('style');st.textContent=`#estCam .ecIc{width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.12);color:#fff;display:flex;align-items:center;justify-content:center;padding:0;flex:0 0 44px}
 #estCam .ecSh2{width:74px;height:74px;border-radius:50%;border:4px solid #fff;display:flex;align-items:center;justify-content:center;background:none;padding:0}#estCam .ecSh2 b{width:58px;height:58px;border-radius:50%;background:#fff;display:block}`;o.appendChild(st);
 const tg=document.createElement('button');tg.type='button';tg.className='ecIc';tg.setAttribute('aria-label',m=='v'?'Trocar para foto':'Trocar para vídeo');tg.innerHTML=m=='v'?IC.f:IC.v;
 const gl=document.createElement('button');gl.type='button';gl.className='ecIc';gl.setAttribute('aria-label','Galeria');gl.innerHTML=IC.g;
 const gal=o.querySelector('.ecGal');gal.replaceWith(gl);
 let sh=o.querySelector('.ecRec').parentNode;
 if(m=='f'){const w=document.createElement('div');w.style.cssText='display:flex;flex-direction:column;align-items:center';w.innerHTML='<button type="button" class="ecSh2" aria-label="Fotografar"><b></b></button><div class="ecRL">Fotografar</div>';sh.replaceWith(w);sh=w;const tag=o.querySelector('.ecTag');if(tag)tag.textContent='Frente · 1 de 2'}
 if(dei){const R=o.querySelector('.ecR');R.style.setProperty('justify-content','flex-start','important');const man=R.querySelector('.ecMan');const box=document.createElement('div');box.style.cssText='flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px';R.appendChild(box);box.appendChild(tg);box.appendChild(sh);box.appendChild(gl)}
 else{const B=o.querySelector('.ecB');B.innerHTML='';B.style.setProperty('gap','48px','important');B.style.setProperty('align-items','flex-start','important');[tg,gl].forEach(e=>e.style.marginTop='15px');B.appendChild(tg);B.appendChild(sh);B.appendChild(gl)}}"""
with sync_playwright() as pw:
  def tira(W,H,est,it,nome,m=None):
    b,pg=abre(pw,W,H);cam(pg);pg.wait_for_timeout(400)
    pg.evaluate(JS,{'e':est,'it':it});pg.wait_for_timeout(300)
    if m: pg.evaluate(SEG,m);pg.wait_for_timeout(300)
    f='/tmp/camM_%s.png'%nome;pg.screenshot(path=f);b.close();return f
  quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camM2_deitado.jpg',[
    ('HOJE · 149cam-F aprovado (só vídeo)','10 itens + Gravar a volta',tira(844,390,EV,ITENS,'h')),
    ('PROPOSTA · Vídeo (abre assim)','1 ícone troca para Foto · Galeria em ícone',tira(844,390,EV,ITENS,'v','v')),
    ('PROPOSTA · Foto','o ícone mostra Vídeo (para voltar)',tira(844,390,EF,I4,'f','f'))],False)
  EVe=dict(EST['empe']);EFe=dict(EF,frase='Deixe o celular reto')
  quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camM2_empe.jpg',[
    ('HOJE · 149cam-F em pé','só vídeo: pede para deitar',tira(390,844,EVe,ITENS,'he')),
    ('PROPOSTA · Vídeo','ícone de troca à esquerda, Galeria à direita',tira(390,844,EVe,ITENS,'ve','v')),
    ('PROPOSTA · Foto','em pé a foto funciona',tira(390,844,EFe,I4,'fe','f'))],True)
