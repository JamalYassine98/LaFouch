from playwright.sync_api import sync_playwright
import sys,json
lang=sys.argv[1] if len(sys.argv)>1 else 'pt-BR'
INIT="""(()=>{const A=window.Audio;window.__al=[];window.Audio=function(u){const a=new A(u);const r={f:u.split('/').pop(),fim:0,pausa:0};__al.push(r);a.addEventListener('ended',()=>r.fim=1);const p=a.pause.bind(a);a.pause=function(){if(!a.ended&&a.currentTime>0.05)r.pausa=Math.round(a.currentTime*100)/100+'/'+Math.round(a.duration*100)/100;return p()};return a};
window.__ss=[];try{const sp=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=function(u){__ss.push(u.text);return sp(u)}}catch(e){}
window.__dist=30;const f=(160)/Math.tan(31*Math.PI/180);
window.__lfFakeFa={TinyFaceDetectorOptions:function(){},detectSingleFace:function(){const ipd=f*6.3/window.__dist,P=[];for(let i=0;i<68;i++)P.push({x:100,y:100});for(let i=36;i<=41;i++)P[i]={x:160-ipd/2,y:100};for(let i=42;i<=47;i++)P[i]={x:160+ipd/2,y:100};const r=Promise.resolve({landmarks:{positions:P}});r.withFaceLandmarks=()=>r;return r}};
})()"""
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
  c=b.new_context(locale=lang,viewport={'width':390,'height':844},device_scale_factor=2,permissions=['camera']);pg=c.new_page();pg.add_init_script(INIT)
  errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto('http://localhost:8771/?r=descubra-o-grau');pg.wait_for_timeout(3000)
  print('abriu pela página própria:',pg.evaluate("!!document.getElementById('gw')"),pg.evaluate('location.pathname'))
  pg.wait_for_timeout(8000);pg.screenshot(path='/tmp/v_chama.png')
  pg.click('#gw [data-gz=comeca]');pg.wait_for_timeout(9000);pg.screenshot(path='/tmp/v_teste.png')
  S="JSON.stringify((()=>{const Z=__LFGZ.Z;return {f:Z.fase,g:Z.g,at:Z.at,fd:Z.fd&&+Z.fd.toFixed(2),chip:(document.querySelector('#gzdi')||{}).textContent}})())"
  print('teste:',pg.evaluate(S))
  pg.evaluate("window.__dist=38");pg.click('#gw [data-gz=sim]');pg.wait_for_timeout(5000);print('a 38 cm:',pg.evaluate(S))
  pg.evaluate("window.__dist=22");pg.click('#gw [data-gz=sim]');pg.wait_for_timeout(5000);print('a 22 cm:',pg.evaluate(S))
  pg.evaluate("window.__dist=30");pg.click('#gw [data-gz=nao]')
  for i in range(10):pg.wait_for_timeout(330);pg.screenshot(path=f'/tmp/v_lente_{i}.png')
  pg.wait_for_timeout(4000);print('lente:',pg.evaluate(S))
  for i in range(12):
    if pg.evaluate("__LFGZ.Z.fase")!='teste':break
    pg.click('#gw [data-gz=sim]');pg.wait_for_timeout(6500)
  if pg.evaluate("__LFGZ.Z.fase")=='teste':
    pg.click('#gw [data-gz=nao]');pg.wait_for_timeout(7000)
  print('fim:',pg.evaluate(S),pg.evaluate("__LFGZ.Z.G"))
  pg.wait_for_timeout(4000);pg.screenshot(path='/tmp/v_res.png')
  # fora da faixa por mais de 4 s → avisa uma vez
  L=pg.evaluate('__al');print('áudios:',len(L),'até o fim:',sum(1 for x in L if x['fim']),'interrompidos:',[x for x in L if x['pausa']])
  print('voz do celular usada em:',pg.evaluate('__ss'))
  pg.go_back();pg.wait_for_timeout(800);print('voltar fecha:',not pg.evaluate("!!document.getElementById('gw')"),pg.evaluate('location.pathname'))
  print('ERROS',errs)
