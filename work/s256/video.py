# S256 · Mochi HOJE × PROPOSTA em tempo real (chegada, fala e espera). A proposta é uma cópia do site com os números do esqueleto trocados (não toca no site de verdade).  python3 video.py
import os, subprocess, sys, time, shutil, glob
A = os.path.dirname(os.path.abspath(__file__)) + '/'
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
D = '/tmp/kitsite_mochi'; shutil.rmtree(D, ignore_errors=True); shutil.copytree('/tmp/kitsite', D)
p = D + '/js/lf-site.js'; s = open(p, encoding='utf8').read()
TROCAS = [
 # molas calmas: chegam sem passar do ponto
 ("const MOL={sx:{v:1,t:1,w:0,k:.2,d:.7},sy:{v:1,t:1,w:0,k:.2,d:.7},ti:{v:0,t:0,w:0,k:.09,d:.8},es:{v:0,t:0,w:0,k:.13,d:.86},ob:{v:0,t:0,w:0,k:.12,d:.8},fx:{v:1,t:1,w:0,k:.1,d:.76}};",
  "const MOL={sx:{v:1,t:1,w:0,k:.09,d:.55},sy:{v:1,t:1,w:0,k:.09,d:.55},ti:{v:0,t:0,w:0,k:.045,d:.7},es:{v:0,t:0,w:0,k:.05,d:.74},ob:{v:0,t:0,w:0,k:.05,d:.74},fx:{v:1,t:1,w:0,k:.07,d:.6}};"),
 ("S[v]+=(S[t]-S[k])*.09;S[v]*=.74;", "S[v]+=(S[t]-S[k])*.045;S[v]*=.7;"),
 # corpo contido: achatar/esticar a 30% do que é hoje
 ("nS.style.transform=`scale(${MOL.sx.v.toFixed(4)},${MOL.sy.v.toFixed(4)})`", "nS.style.transform=`scale(${(1+(MOL.sx.v-1)*.3).toFixed(4)},${(1+(MOL.sy.v-1)*.3).toFixed(4)})`"),
 # piscar vivo: intervalo sorteado a cada vez, 1 em 5 dupla, fecha rápido e abre devagar
 ("const piv=setInterval(()=>{if(!el.isConnected){clearInterval(piv);return}if(M.exp!=='f')M.pisca()},3200+Math.random()*1200);",
  "(function pv(){setTimeout(()=>{if(!el.isConnected)return;if(M.exp!=='f'){M.pisca();if(Math.random()<.2)setTimeout(()=>M.pisca(),260)}pv()},2500+Math.random()*3500)})();"),
 (".mochi .pis.p{animation:pisca .16s ease-in-out}", ".mochi .pis.p{animation:pisca .2s cubic-bezier(.3,0,.3,1)}"),
 ("@keyframes pisca{50%{transform:scaleY(.08)}}", "@keyframes pisca{35%{transform:scaleY(.08)}}"),
 # respirar mais lento e menor; sombra com atraso
 (".mochi .resp{transform-origin:60px 124px;animation:resp 2.6s ease-in-out infinite}", ".mochi .resp{transform-origin:60px 124px;animation:resp 4s ease-in-out infinite}"),
 ("50%{transform:translateY(-2.5px) scale(1.012,.988)}", "50%{transform:translateY(-1.5px) scale(1.008,.992)}"),
 ("animation:somb 2.6s ease-in-out infinite", "animation:somb 4s ease-in-out .15s infinite"),
 (".mochi .pup{transition:transform .35s ease}", ".mochi .pup{transition:transform .22s cubic-bezier(.16,1,.3,1)}"),
 # andar que se acompanha: mais lento, sai e chega devagar, os olhos vão primeiro
 ("dur=dur||520;if(RM.matches)", "dur=Math.max(1100,(dur||520)*1.9);M.olha(Math.sign(nx-M.x)||0,Math.sign(ny-M.y)*.6);setTimeout(()=>M.olha(0,0),dur+250);if(RM.matches)"),
 ("c=1.5,e=1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);", "e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;"),
 # sem som (mudo ou bloqueado): a boca não mexe
 ("const ab=(k++%3)!==2;", "const ab=window.__lfSemSom?false:(k++%3)!==2;"),
 # parada serena: um gesto a cada 10–16 s
 ("vida()},2200+Math.random()*1800)", "vida()},10000+Math.random()*6000)"),
]
for a, b_ in TROCAS:
    n = s.count(a); print(n, a[:60])
    assert n >= 1, 'não achei: ' + a[:70]
    s = s.replace(a, b_)
open(p, 'w', encoding='utf8').write(s)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8813', '-d', D], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
from playwright.sync_api import sync_playwright
vs = []
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for modo, porta in (('h', 8811), ('p', 8813)):
        d = '/tmp/s256_' + modo; shutil.rmtree(d, ignore_errors=True)
        c = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, locale='es-PY', service_workers='block', record_video_dir=d, record_video_size={'width': 390, 'height': 844})
        c.add_init_script("try{sessionStorage.setItem('lf_ni','1');window.__lfSemSom=true}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        t0 = time.time(); pg = c.new_page(); erros = []; pg.on('pageerror', lambda e: erros.append(str(e)[:120])); pg.goto('http://localhost:%d/' % porta); pg.wait_for_timeout(2600); pg.evaluate("document.querySelector('#mnb').click()"); pg.wait_for_timeout(1200)
        ta = time.time() - t0; pg.evaluate("document.querySelector('[data-gzopen]').click()"); pg.wait_for_timeout(46000); print(modo, 'erros de JS:', erros); c.close(); vs.append((glob.glob(d + '/*.webm')[0], ta))
finally: srv.terminate()
FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '%.2f' % (vs[0][1] - .3), '-t', '45', '-i', vs[0][0], '-ss', '%.2f' % (vs[1][1] - .3), '-t', '45', '-i', vs[1][0], '-filter_complex',
    "[0:v]crop=390:480:0:70,pad=410:570:10:80:color=0xece6ea,drawtext=text='HOJE':fontfile=%s:fontsize=22:fontcolor=0xb42318:x=10:y=48[a];[1:v]crop=390:480:0:70,pad=410:570:10:80:color=0xece6ea,drawtext=text='PROPOSTA':fontfile=%s:fontsize=22:fontcolor=0x1f8a4c:x=10:y=48[b];[a][b]hstack,drawtext=text='Mochi · chegada, fala e espera · tempo real, sem som':fontfile=%s:fontsize=22:fontcolor=0x2a1a28:x=10:y=12" % (FT, FT, FT),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-r', '30', '-movflags', '+faststart', A + 's256_video_mochi_hoje_x_proposta.mp4'], check=True)
print('ok', os.path.getsize(A + 's256_video_mochi_hoje_x_proposta.mp4') // 1024, 'kB')
