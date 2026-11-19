# 149cam-F2: além de conferir, a câmera diz O QUE FAZER em cada item que falta (textos do conferir.js) — pedido do dono 19:09
exec(open('funciona.py').read().split("with sync_playwright() as pw:")[0])
FAZ={'luz':'Aumente a luz da caixa','meio':'Vire o celular um pouco para a esquerda','foco':'Toque e segure na peça para travar o foco','deitado':'Deite o celular'}
E3=dict(ok={'deitado':1,'firme':1,'luz':0,'peca':1,'dist':1,'meio':0,'altura':1,'costura':1,'foco':0,'folga':1},verde=0,frase='',rec='off',trava='')
JS2=r"""(a)=>{const o=document.getElementById('estCam');if(!o)return;const dei=o.classList.contains('ecPD');const E=a.e,IT=a.it,FZ=a.f;
 const chk=o.querySelector('.ecChk');const f2=o.querySelector('.ecFrase2');if(chk)chk.remove();if(f2)f2.remove();
 const ok=IT.filter(x=>E.ok[x[0]]===1).length;const fal=IT.filter(x=>E.ok[x[0]]===0);
 const st=document.createElement('style');st.textContent=`#estCam .ecPr{display:flex;flex-direction:column;gap:6px}
 #estCam .ecPr .pt{display:flex;gap:4px}#estCam .ecPr .pt i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.25)}#estCam .ecPr .pt i.s{background:#3ecf7a}#estCam .ecPr .pt i.n{background:#e0b44c}
 #estCam .ecPr small{font-size:12px;color:rgba(255,255,255,.7)}
 #estCam .ecFz{display:flex;flex-direction:column;gap:12px;counter-reset:f}
 #estCam .ecFz .t{font-size:11px;letter-spacing:.12em;font-weight:700;color:rgba(255,255,255,.55)}
 #estCam .ecFz div.p{display:flex;gap:8px;font-size:13px;line-height:1.3;color:#fff}
 #estCam .ecFz div.p b{flex:0 0 18px;height:18px;border-radius:50%;background:#e0b44c;color:#2a2000;font-size:11px;display:flex;align-items:center;justify-content:center}
 #estCam .ecFz div.p span small{display:block;color:rgba(255,255,255,.6);font-size:11px;margin-bottom:2px}`;o.appendChild(st);
 const pr=document.createElement('div');pr.className='ecPr';pr.innerHTML='<div class="pt">'+IT.map(x=>'<i class="'+(E.ok[x[0]]===1?'s':E.ok[x[0]]===0?'n':'')+'"></i>').join('')+'</div><small>'+ok+' de 10 certos</small>';
 const fz=document.createElement('div');fz.className='ecFz';fz.innerHTML='<div class="t">O QUE FAZER</div>'+fal.slice(0,3).map((x,i)=>'<div class="p"><b>'+(i+1)+'</b><span><small>'+x[1]+'</small>'+FZ[x[0]]+'</span></div>').join('')+(fal.length>3?'<div class="t">+'+(fal.length-3)+' depois destes</div>':'');
 if(dei){const l=o.querySelector('.ecL');l.appendChild(pr);l.appendChild(fz)}else{const m=o.querySelector('.ecM');m.innerHTML='';m.style.setProperty('flex-direction','column','important');m.style.setProperty('align-items','flex-start','important');m.style.setProperty('gap','12px','important');m.style.setProperty('height','auto','important');m.appendChild(pr);m.appendChild(fz)}}"""
with sync_playwright() as pw:
  def tira(W,H,est,nome,fz=False):
    b,pg=abre(pw,W,H);cam(pg);pg.wait_for_timeout(400)
    pg.evaluate(JS,{'e':est,'it':ITENS});pg.wait_for_timeout(300)
    if fz: pg.evaluate(JS2,{'e':est,'it':ITENS,'f':FAZ});pg.wait_for_timeout(300)
    f='/tmp/camF2_%s.png'%nome;pg.screenshot(path=f)
    if fz: print(nome,pg.evaluate("()=>{const o=document.getElementById('estCam');const e=o.querySelector('.ecFz');const r=e.getBoundingClientRect();return [Math.round(r.top),Math.round(r.bottom)]}"))
    b.close();return f
  E3h=dict(E3,frase='Falta luz: aumente a luz da caixa')
  quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camF2_deitado.jpg',[('HOJE · 149cam-F (esboço anterior)','lista ✓/! e só a 1ª frase',tira(844,390,E3h,'h')),('PROPOSTA · o que fazer','cada item que falta vira um passo numerado',tira(844,390,E3,'p',True))],False)
  Ee=dict(EST['empe']);quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camF2_empe.jpg',[('HOJE · 149cam-F em pé','só "Deite o celular"',tira(390,844,Ee,'he')),('PROPOSTA · em pé','o mesmo "O que fazer", embaixo da imagem',tira(390,844,Ee,'pe',True))],True)
