"""Vídeo Hoje × Proposta da câmera (Parte A), lado a lado, com o mesmo manequim e o mesmo roteiro:
virado 35° (0–3,5 s) → vira de frente → boca aberta (4,5–6,5 s) → fecha → pouca luz (7 s) → parado.
Hoje = site de verdade (/tmp/ih) com /tmp/filme-hoje.mjpeg (a luz não volta).
Proposta = cópia (/tmp/ip) com os avisos/anel/luz da tela pintados por cima, no tempo do vídeo; /tmp/filme-prop.mjpeg (a luz da tela clareia o rosto).
Antes: ./serve.sh e python3 -c "import manequim as m; m.filme('hoje',False); m.filme('prop',True)"
Uso: python3 video.py → esboco-06-camera-video.mp4"""
import os, time, json, subprocess, glob, shutil
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
AQUI = os.path.dirname(os.path.abspath(__file__)); __file__ = os.path.join(AQUI, 'captura.py')
exec(open(__file__).read().split('with sync_playwright()')[0])
PINTA = open(os.path.join(AQUI, 'camera2.py')).read().split('PINTA = r"""')[1].split('"""')[0]
# na Proposta a conta nova tem o rosto-padrão como âncora do Oval (COMO-FAZER parte 2, item 7)
RES = MONTA.replace(" F.open(); F.res(cv,r,res);", " F.stop(); F.res(cv,r,res);").replace("const res=F.shape(m);", "const res=F.shape(m);res.id='oval';res.close=false;")
ROT = r"""(C)=>{const P=(@P@),R=(@R@);window.__lfPinta=true;
 const v=document.getElementById('favid');const ini=()=>{const t0=performance.now();
  const passos=[[1.8,{msg:'Vire o rosto para a câmera'}],[4.6,{msg:'Feche a boca e relaxe o rosto'}],[7.4,{msg:'Luz da tela ligada',luz:true}],[8.6,{msg:'Perfeito! Fique parado…',ok:true,luz:true}]];
  passos.forEach(([s,o])=>setTimeout(()=>P(o),s*1000));
  setTimeout(()=>{const a0=performance.now();(function anda(){const k=Math.min(100,(performance.now()-a0)/1500*100);P({msg:'Medindo… fique parado',ok:true,luz:true,anel:k});if(k<100)requestAnimationFrame(anda)})()},9000);
  setTimeout(()=>{R(C)},10700)};
 if(v&&v.readyState>=2)ini();else v.addEventListener('playing',ini,{once:true})}"""

def grava(nome, base, filme, dur):
    pasta = '/tmp/vid-' + nome; shutil.rmtree(pasta, ignore_errors=True)
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=' + filme])
        ctx = br.new_context(viewport={'width': 386, 'height': 858}, device_scale_factor=2, is_mobile=True, has_touch=True, permissions=['camera'])
        ctx.add_init_script(INIT); ctx.route('**/*', rota); pg = ctx.new_page(); os.makedirs(pasta)
        # gravação nítida (2×): os quadros da tela pelo próprio Chromium, cada um com a hora
        cdp = ctx.new_cdp_session(pg); Q = []
        def quadro_(ev):
            Q.append((ev['metadata']['timestamp'], ev['data'])); cdp.send('Page.screencastFrameAck', {'sessionId': ev['sessionId']})
        cdp.on('Page.screencastFrame', quadro_)
        cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 90, 'maxWidth': 772, 'maxHeight': 1716, 'everyNthFrame': 1}); t0 = time.time()
        pg.goto(base + '/?cliente=1&r=formato', wait_until='networkidle'); pg.wait_for_timeout(1200)
        pg.click('#rosto [data-fa]'); pg.wait_for_timeout(900); pg.click('[data-facam]')
        tcam = time.time() - t0
        if nome == 'prop':
            pg.wait_for_function("()=>{const v=document.getElementById('favid');return v&&v.readyState>=2}")
            pg.evaluate(ROT.replace('@P@', PINTA).replace('@R@', RES), CANON)
        log = []; tt = time.time()
        while time.time() - tt < dur:
            s = pg.evaluate("()=>{const e=document.getElementById('cammP')||document.getElementById('camm'),c=document.getElementById('camc'),r=document.querySelector('.fares h3');return [e?e.textContent:'',c?c.textContent:'',r?r.textContent:'']}")
            if not log or log[-1][1] != s: log.append((round(time.time() - t0 - tcam, 1), s))
            pg.wait_for_timeout(200)
        cdp.send('Page.stopScreencast'); ctx.close(); br.close()
    import base64
    lst = []
    for i, (ts, d) in enumerate(Q):
        fn = '%s/q%05d.jpg' % (pasta, i); open(fn, 'wb').write(base64.b64decode(d)); lst.append((ts, fn))
    T0 = lst[0][0]; cat = open(pasta + '/lista.txt', 'w')
    for i, (ts, fn) in enumerate(lst):
        dur = (lst[i + 1][0] - ts) if i + 1 < len(lst) else 2.0
        cat.write("file '%s'\nduration %.4f\n" % (fn, dur))
    cat.write("file '%s'\n" % lst[-1][1]); cat.close()
    off = T0 - t0  # o 1º quadro chega um pouco depois de começar
    mp4 = pasta + '/v.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', pasta + '/lista.txt', '-vf', 'scale=772:1716,fps=30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', mp4], check=True)
    return mp4, tcam - off, log

if __name__ == '__main__':
    H, th, lh = grava('hoje', 'http://localhost:8701', '/tmp/filme-hoje.mjpeg', 24)
    P, tp, lp = grava('prop', 'http://localhost:8702', '/tmp/filme-prop.mjpeg', 15)
    json.dump({'hoje': lh, 'prop': lp, 'tcam': [th, tp]}, open(os.path.join(AQUI, 'cap', 'video.json'), 'w'), ensure_ascii=False, indent=1)
    for x in lh: print('hoje', x)
    for x in lp: print('prop', x)
    FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    ini = 3.0  # começa 3 s antes de abrir a câmera (mostra o toque em "Abrir a câmera")
    # faixa em cima: nome + relógio desde que a câmera abriu (para comparar o tempo até o resultado)
    rel = "%{eif\\:trunc(max(0\\,t-3))\\:d},%{eif\\:mod(trunc(max(0\\,t-3)*10)\\,10)\\:d} s"
    lab = lambda t, c: ("pad=iw:ih+110:0:110:color=white,drawtext=fontfile=%s:text='%s':x=24:y=14:fontsize=40:fontcolor=%s,"
                        "drawtext=fontfile=%s:text='câmera aberta há %s':x=24:y=64:fontsize=28:fontcolor=#3b2f39") % (FT, t, c, FT, rel)
    filt = ("[0:v]trim=start=%.2f,setpts=PTS-STARTPTS,%s[a];[1:v]trim=start=%.2f,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=30,%s[b];"
            "[a][b]hstack=inputs=2,trim=duration=27[v]") % (th - ini, lab('HOJE', '#b3261e'), tp - ini, lab('PROPOSTA', '#8d3a69'))
    out = os.path.join(AQUI, 'esboco-06-camera-video.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', H, '-i', P, '-filter_complex', filt, '-map', '[v]', '-r', '30',
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], check=True)
    print(out)
