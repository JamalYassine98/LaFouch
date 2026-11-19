# Vídeo realista do 149cam-F + 149cam-G (guias): câmera alimentada pelo giro real (catalogo/teste-giro/giro.mp4)
import sys,os,json,subprocess;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit,base_app
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
from playwright.sync_api import sync_playwright
GIRO=open('/home/claude/catalogo/teste-giro/giro.mp4','rb').read()
FAKE2=r"""(()=>{const md=navigator.mediaDevices;if(!md)return;md.getUserMedia=async function(){const cv=document.createElement('canvas');cv.width=1920;cv.height=1080;const x=cv.getContext('2d');
 const v=document.createElement('video');v.src='/__giro.mp4';v.muted=true;v.playsInline=true;v.preload='auto';window.__gv=v;v.load();
 window.__fk=window.__fk||{bri:1,dx:0,sc:.227};
 window.__fkDraw=()=>{const P=window.__fk;x.filter='brightness('+P.bri+')';x.fillStyle=window.__fkBg||'#ffffff';x.fillRect(0,0,1920,1080);
  const w=1920*P.sc*2.1,h=w*640/960;if(v.readyState>=2)x.drawImage(v,960+P.dx-w/2,540-h/2,w,h);x.filter='none'};
 return cv.captureStream(0)}})()"""
ITENS=[('deitado','Celular deitado'),('firme','Celular parado'),('luz','Luz do fundo'),('peca','Peça no prato'),('dist','Distância'),('meio','Peça no meio'),('altura','Altura da câmera'),('costura','Fundo sem costura'),('foco','Foco na peça'),('folga','Folga nas bordas')]
MONTA=r"""(IT)=>{const o=document.getElementById('estCam');const st=document.createElement('style');st.textContent=`
 #estCam .ecGd{display:none!important}#estCam .ecMold{position:absolute;inset:0;border:3px solid rgba(255,255,255,.8);pointer-events:none;z-index:6;transition:border-color .25s}
 #estCam .ecChk{display:flex;flex-direction:column}#estCam .ecChk span{display:flex;align-items:center;gap:8px;height:20px;font-size:12px;color:rgba(255,255,255,.82);white-space:nowrap}
 #estCam .ecChk i{flex:0 0 14px;height:14px;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:11px;font-weight:700;border-radius:50%}
 #estCam .ecChk .s i{color:#0b2a17;background:#3ecf7a}#estCam .ecChk .n i{color:#2a2000;background:#e0b44c}#estCam .ecChk .q i{border:1.5px solid rgba(255,255,255,.4)}#estCam .ecChk .n{color:#fff;font-weight:600}
 #estCam .ecRec{width:74px;height:74px;border-radius:50%;border:4px solid #fff;display:flex;align-items:center;justify-content:center;background:none;padding:0;transition:opacity .25s,transform .12s}
 #estCam .ecRec b{display:block;background:#d92d4b;transition:all .25s}#estCam .ecRL{font-size:12px;color:#fff;text-align:center;margin-top:8px;white-space:nowrap}
 #estCam .ecPt{position:absolute;right:12px;top:12px;padding:6px 12px;border-radius:999px;background:rgba(217,45,75,.92);color:#fff;font:600 14px/1 system-ui;font-variant-numeric:tabular-nums;z-index:8}
 #estCam .ecTr{font-size:12px;color:rgba(255,255,255,.62)}#estCam .ecF2{display:flex;gap:8px;font-size:14px;line-height:1.35;font-weight:600}#estCam .ecF2 i{flex:0 0 10px;height:10px;border-radius:50%;margin-top:5px}
 #estCam .ecTap{position:absolute;width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.35);z-index:20;pointer-events:none;transform:translate(-50%,-50%)}`;o.appendChild(st);
 o.querySelector('.ecTag').textContent='Giro · volta de 360°';const f0=o.querySelector('.ecFrase');f0.style.setProperty('display','none','important');
 const l=o.querySelector('.ecL');l.style.setProperty('gap','12px','important');const F=document.createElement('div');F.className='ecF2';F.innerHTML='<i></i><span></span>';const L=document.createElement('div');L.className='ecChk';L.innerHTML=IT.map(x=>'<span data-k="'+x[0]+'"><i></i>'+x[1]+'</span>').join('');const T=document.createElement('div');T.className='ecTr';
 l.appendChild(F);l.appendChild(L);l.appendChild(T);
 const sh=o.querySelector('.ecSh');const w=document.createElement('div');w.style.cssText='display:flex;flex-direction:column;align-items:center';w.innerHTML='<button type="button" class="ecRec"><b></b></button><div class="ecRL"></div>';sh.replaceWith(w);
 const vf=o.querySelector('.ecVf');const md=document.createElement('div');md.className='ecMold';vf.appendChild(md);const pt=document.createElement('div');pt.className='ecPt';vf.appendChild(pt);
 const sv=document.createElementNS('http://www.w3.org/2000/svg','svg');sv.id='ecGuia';sv.style.cssText='position:absolute;inset:0;z-index:7;pointer-events:none';vf.appendChild(sv)}"""
UPD=r"""(E)=>{const o=document.getElementById('estCam'),vf=o.querySelector('.ecVf');const W=vf.clientWidth,H=vf.clientHeight;const G='#3ecf7a',Y='#e0b44c',Wh='rgba(30,30,30,.45)',col=k=>k?G:Y;
 o.querySelectorAll('.ecChk span').forEach(s=>{const v=E.ok[s.dataset.k];s.className=v===1?'s':v===0?'n':'q';s.querySelector('i').textContent=v===1?'✓':v===0?'!':''});
 const F=o.querySelector('.ecF2');F.querySelector('span').textContent=E.frase;F.style.color=E.verde?'#8fe3b0':'#fff';F.querySelector('i').style.background=E.verde?G:Y;
 o.querySelector('.ecMold').style.borderColor=E.verde?G:'rgba(255,255,255,.8)';o.querySelector('.ecTr').textContent=E.trava||'';
 const pt=o.querySelector('.ecPt');pt.style.display=E.tempo?'block':'none';pt.textContent=(E.tempo||'')+' / 1:00';
 const rb=o.querySelector('.ecRec'),b=rb.querySelector('b');rb.style.opacity=E.rec=='off'?.38:1;rb.style.transform=E.aperta?'scale(.9)':'none';const g=E.rec=='grav';b.style.width=b.style.height=(g?26:58)+'px';b.style.borderRadius=g?'6px':'50%';o.querySelector('.ecRL').textContent=g?'Parar':'Gravar a volta';
 const gal=o.querySelector('.ecGal');gal.style.visibility=g?'hidden':'visible';
 let tp=o.querySelector('.ecTap');if(E.aperta){if(!tp){tp=document.createElement('div');tp.className='ecTap';o.appendChild(tp)}const r=rb.getBoundingClientRect();tp.style.left=(r.left+r.width/2)+'px';tp.style.top=(r.top+r.height/2)+'px'}else if(tp)tp.remove();
 /* guias pela posição da peça (mesma conta do desenho da câmera) */
 const P=window.__fk,s=Math.max(W/1920,H/1080),ox=(W-1920*s)/2,oy=(H-1080*s)/2,w=1920*P.sc*2.1,h=w*640/960,X0=960+P.dx-w/2,Y0=540-h/2;
 const Bl=ox+(X0+w*.11)*s,Br=ox+(X0+w*.95)*s,cy=oy+(Y0+h*.53)*s,cx=(Bl+Br)/2;
 const okM=E.ok.meio===1,okD=E.ok.dist===1,okA=E.ok.altura!==0,okN=E.ok.deitado!==0;
 const i1=W*.5-W*.18,z1=W*.5-W*.31,i2=W*.5+W*.18,z2=W*.5+W*.31;let q='';
 q+=`<line x1="${W*.06}" y1="${H/2}" x2="${W*.18}" y2="${H/2}" stroke="${col(okN)}" stroke-width="2"/><line x1="${W*.82}" y1="${H/2}" x2="${W*.94}" y2="${H/2}" stroke="${col(okN)}" stroke-width="2"/>`;
 q+=`<line x1="${W/2}" y1="${H*.05}" x2="${W/2}" y2="${H*.15}" stroke="${Wh}" stroke-width="2"/><line x1="${W/2}" y1="${H*.85}" x2="${W/2}" y2="${H*.95}" stroke="${Wh}" stroke-width="2"/>`;
 q+=`<path d="M${cx-7} ${H*.05} L${cx} ${H*.05+10} L${cx+7} ${H*.05}Z" fill="${col(okM)}"/><path d="M${cx-7} ${H*.95} L${cx} ${H*.95-10} L${cx+7} ${H*.95}Z" fill="${col(okM)}"/>`;
 if(!okM){const dir=cx<W/2?-1:1,ax=W/2+dir*42;q+=`<path d="M${W/2+dir*14} ${H*.1} H${ax} M${ax-dir*8} ${H*.1-7} L${ax} ${H*.1} L${ax-dir*8} ${H*.1+7}" stroke="${Y}" stroke-width="3" fill="none" stroke-linecap="round"/>`}
 [[z1,i1],[i2,z2]].forEach(p=>{q+=`<path d="M${p[0]} ${H*.76} V${H*.8} H${p[1]} V${H*.76}" stroke="${col(okD)}" stroke-width="2" fill="none"/>`});
 if(!okD&&(Br-Bl)/W>.62){q+=`<path d="M${z1+10} ${H*.83} l-10 5 l10 5 M${z2-10} ${H*.83} l10 5 l-10 5" stroke="${Y}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`}
 q+=`<line x1="${Math.max(2,Bl)}" y1="${H*.72}" x2="${Math.max(2,Bl)}" y2="${H*.84}" stroke="${col(okD)}" stroke-width="3"/><line x1="${Math.min(W-2,Br)}" y1="${H*.72}" x2="${Math.min(W-2,Br)}" y2="${H*.84}" stroke="${col(okD)}" stroke-width="3"/>`;
 q+=`<circle cx="${W*.12}" cy="${cy}" r="5" fill="${col(okA)}"/><circle cx="${W*.88}" cy="${cy}" r="5" fill="${col(okA)}"/>`;
 const sv=o.querySelector('#ecGuia');sv.setAttribute('width',W);sv.setAttribute('height',H);sv.setAttribute('viewBox','0 0 '+W+' '+H);sv.innerHTML=q}"""
FPS=10
def ease(a,b,u): u=max(0,min(1,u));u=u*u*(3-2*u);return a+(b-a)*u
def estado(t):
  ok={k:1 for k,_ in ITENS};P={'bri':1,'dx':0,'sc':.227};E=dict(verde=0,rec='off',trava='',tempo='',aperta=False)
  if t<4: P.update(bri=.58,dx=-420,sc=.34);ok.update(luz=0,meio=0,dist=0,foco=None);E['frase']='Falta luz: aumente a luz da caixa'
  elif t<5: P.update(bri=ease(.58,1,t-4),dx=-420,sc=.34);ok.update(luz=0 if t<4.7 else 1,meio=0,dist=0,foco=None);E['frase']='Falta luz: aumente a luz da caixa' if t<4.7 else 'Vire o celular um pouco para a esquerda'
  elif t<9: P.update(dx=ease(-420,0,(t-6.5)/2),sc=.34);m=t<8.6;ok.update(meio=0 if m else 1,dist=0,foco=None if t<8 else 1);E['frase']='Vire o celular um pouco para a esquerda' if m else 'Afaste um pouco o celular'
  elif t<13: P.update(sc=ease(.34,.227,(t-10)/2));d=t<12.2;ok.update(dist=0 if d else 1);E['frase']='Afaste um pouco o celular' if d else 'Tudo certo · pode gravar'
  else: E['frase']='Tudo certo · pode gravar'
  if t>=12.2: E['verde']=1;E['rec']='on'
  if 14.6<=t<15.0: E['aperta']=True
  if t>=15.0 and t<23.5:
    E['rec']='grav';E['trava']='Travado: foco, luz, branco';s=int(t-15) if t<20 else int(54+(t-20)*1.8);s=min(s,60);E['tempo']='%d:%02d'%(s//60,s%60)
    E['frase']='Ligue o prato e não toque mais' if t<17 else 'Gravando a volta…'
    if t>=19.4 and t<20: E['frase']='… (pulando para o fim)'
  if t>=23.5: E['rec']='on';E['frase']='Gravado ✓ · parou sozinha em 1:00';E['trava']=''
  E['ok']=ok;return P,E
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  c=b.new_context(bypass_csp=True,viewport={'width':844,'height':390},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark',service_workers='block')
  def rota(r):
    u=r.request.url
    if u.endswith('/__giro.mp4'): return r.fulfill(status=200,body=GIRO,content_type='video/mp4')
    return r.continue_() if u.startswith('http://localhost') or u.startswith('http://127.') else r.abort()
  c.route('**/*',rota);c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.add_init_script(FAKE2);c.add_init_script(base_app.script())
  pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(800)
  pg.evaluate("()=>__LF.camOpen(()=>{},'Antes de cadastrar',{peca:true})");pg.wait_for_timeout(2500)
  pg.evaluate(MONTA,ITENS);pg.wait_for_function("()=>window.__gv&&window.__gv.readyState>=2",timeout=10000)
  N=int(25*FPS)
  for i in range(N):
    t=i/FPS;P,E=estado(t)
    pg.evaluate("""async ([P,t])=>{window.__fk=P;const v=window.__gv;v.currentTime=t%11.9;await new Promise(r=>{const f=()=>{v.removeEventListener('seeked',f);r()};v.addEventListener('seeked',f);setTimeout(r,400)});window.__fkDraw();const tr=document.getElementById('ecV').srcObject.getVideoTracks()[0];tr.requestFrame&&tr.requestFrame();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))}""",[P,t])
    pg.evaluate(UPD,E);pg.screenshot(path='/tmp/vid/f%04d.png'%i)
  b.close()
subprocess.run(['ffmpeg','-v','error','-y','-framerate',str(FPS),'-i','/tmp/vid/f%04d.png','-c:v','libx264','-preset','veryfast','-pix_fmt','yuv420p','-vf','scale=1688:780','-r','30','/home/claude/lafouch/work/estudio-camera/video_149camFG_deitado.mp4'],check=True)
print('ok')
