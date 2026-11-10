from playwright.sync_api import sync_playwright
INIT="""(()=>{const A=window.Audio;window.__al=[];window.Audio=function(u){const a=new A(u);const r={f:u.split('/').pop(),fim:0};__al.push(r);a.addEventListener('ended',()=>r.fim=1);return a};
window.__ss=[];try{let tm=null,cur=null,rest=0,t0=0;speechSynthesis.speak=function(u){__ss.push(u.text);cur=u;rest=u.text.length*65;t0=Date.now();tm=setTimeout(()=>{cur=null;u.onend&&u.onend()},rest)};speechSynthesis.cancel=function(){clearTimeout(tm);cur=null};speechSynthesis.pause=function(){if(cur){clearTimeout(tm);rest-=Date.now()-t0;window.__ssP=1}};speechSynthesis.resume=function(){if(cur&&window.__ssP){window.__ssP=0;t0=Date.now();const u=cur;tm=setTimeout(()=>{cur=null;u.onend&&u.onend()},Math.max(0,rest))}}}catch(e){}
window.__dist=30;const f=(160)/Math.tan(31*Math.PI/180);
window.__lfFakeFa={TinyFaceDetectorOptions:function(){},detectSingleFace:function(){const ipd=f*6.3/window.__dist,P=[];for(let i=0;i<68;i++)P.push({x:100,y:100});for(let i=36;i<=41;i++)P[i]={x:160-ipd/2,y:100};for(let i=42;i<=47;i++)P[i]={x:160+ipd/2,y:100};const r=Promise.resolve({landmarks:{positions:P}});r.withFaceLandmarks=()=>r;return r}};
window.__lfFakeLum=120;
if(!localStorage.getItem('t_semmp'))window.__lfFakeMp={detect:function(cv){const Z=window.__LFGZ.Z,VW=Z.v.videoWidth,f=(VW/2)/Math.tan(31*Math.PI/180),k=Z.mpk||1,W=cv.width,H=cv.height;
  const di=f*1.17/window.__dist/k,r=di/2,P=[];for(let i=0;i<478;i++)P.push({x:.5,y:.5});
  [[468,.4],[473,.6]].forEach(([c,cx])=>{P[c]={x:cx,y:.5};P[c+1]={x:cx+r/W,y:.5};P[c+3]={x:cx-r/W,y:.5};P[c+2]={x:cx,y:.5-r/H};P[c+4]={x:cx,y:.5+r/H}});
  P[0]={x:.3,y:.3};P[1]={x:.7,y:.7};return {faceLandmarks:[P]}}};
if(localStorage.getItem('t_perm')){const pq=navigator.permissions.query.bind(navigator.permissions);navigator.permissions.query=function(d){if(d&&d.name==='camera')return Promise.resolve({state:localStorage.getItem('t_perm')});return pq(d)}}
if(localStorage.getItem('t_nega')){navigator.mediaDevices.getUserMedia=function(){return new Promise((r,j)=>setTimeout(()=>j(new Error('NotAllowedError')),1500))}}
window.__gum=0;const g0=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=function(c){window.__gum++;return g0(c)};
})()"""
S="JSON.stringify((()=>{const Z=__LFGZ.Z;return {f:Z.fase,g:Z.g,at:Z.at,sem:Z.semCam,chip:(document.querySelector('#gzdi')||{}).textContent,bal:(document.querySelector('#gzbal')||{}).textContent}})())"
def abre(p,lang='pt-BR',W=390,H=844,perm=True,zoom=None,ls=None):
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
  c=b.new_context(locale=lang,viewport={'width':W,'height':H},device_scale_factor=2,permissions=['camera'] if perm else [])
  pg=c.new_page();pg.add_init_script('(()=>{'+''.join(f'localStorage.setItem({k!r},{v!r});' for k,v in (ls or {}).items())+'})()');pg.add_init_script(INIT);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:(errs.append('console:'+m.text) if m.type=='error' else (print('LOG',m.text) if m.text[:2] in ('DF','pp','cl') else None)))
  return b,pg,errs
