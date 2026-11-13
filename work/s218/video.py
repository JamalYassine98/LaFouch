# S218 (13/11/2026): ESBOÇO EM VÍDEO da Mochi apontando o QR no computador (sem voz — a voz só se grava depois de aprovar a animação).
# Grava o site real (cópia local) com o Playwright e corta com ffmpeg. Saída: s218_mochi_qr.mp4
import sys, os, glob, subprocess, shutil
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
src = open(A + '../s217/gera2.py').read(); QRC = src.split('QRC = "')[1].split('"\nQR = ')[0]; QR = src.split('QR = """')[1].split('"""')[0]
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
shutil.rmtree('/tmp/vid', ignore_errors=True)
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    c = b.new_context(viewport={'width': 1366, 'height': 768}, locale='es-PY', service_workers='block', record_video_dir='/tmp/vid', record_video_size={'width': 1366, 'height': 768})
    c.route('**/*', rota); pg = c.new_page(); import time; t0 = time.time()
    pg.goto('http://localhost:8811/?r=descubri-tu-graduacion'); pg.wait_for_timeout(5200)
    print('fala:', pg.evaluate("()=>String(window.__LFGZ.Z.m.fala).slice(0,200)+' || '+String(window.__LFGZ.Z.m.calou).slice(0,120)"))
    pg.add_style_tag(content=QRC); pg.evaluate(QR)
    r = pg.evaluate("()=>{const q=document.querySelector('.lxqr .q').getBoundingClientRect();return [q.left+q.width/2,q.top+q.height/2]}")
    pg.evaluate("()=>{const f=document.querySelector('#gw .gzbal');if(f)f.textContent='Cuando quieras, solo tocá Empezar.'}"); pg.wait_for_timeout(1200)
    ini = time.time() - t0 - 1.0
    pg.evaluate("p=>{const m=window.__LFGZ.Z.m;m.paraGesto&&m.paraGesto();m.ocioso=false;m.vara(1);m.mira(118,26,320);m.olhaPara(p[0],p[1]);try{m.fala&&m.fala(1)}catch(_){};const f=document.querySelector('#gw .gzbal');f.style.transition='opacity .2s';f.style.opacity=0;setTimeout(()=>{f.textContent='Este test sale mejor en el celular.';f.style.opacity=1},200)}", r)
    pg.wait_for_timeout(350); pg.evaluate("()=>document.querySelector('.lxqr').classList.add('on')"); pg.wait_for_timeout(700)
    pg.evaluate("p=>{const m=window.__LFGZ.Z.m;m.mira(128,44,420);m.olhaPara(p[0],p[1])}", r); pg.wait_for_timeout(1300)
    pg.evaluate("()=>{const f=document.querySelector('#gw .gzbal');f.textContent='Este test sale mejor en el celular. Apuntá la cámara a este código…'}"); pg.wait_for_timeout(2400)
    pg.evaluate("()=>{const m=window.__LFGZ.Z.m;m.olhaPara(innerWidth/2,innerHeight*.4);const f=document.querySelector('#gw .gzbal');f.textContent='…o seguimos acá, como prefieras.'}"); pg.wait_for_timeout(2200)
    pg.evaluate("()=>{const m=window.__LFGZ.Z.m;try{m.calou&&m.calou()}catch(_){};m.mira(118,26,420)}"); pg.wait_for_timeout(1500)
    fim = time.time() - t0; c.close(); b.close()
v = glob.glob('/tmp/vid/*.webm')[0]
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '%.2f' % ini, '-i', v, '-t', '%.2f' % (fim - ini), '-vf', 'crop=640:690:370:78,scale=960:-2:flags=lanczos', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', A + 's218_mochi_qr.mp4'], check=True)
print('ok', round(fim - ini, 1), 's', os.path.getsize(A + 's218_mochi_qr.mp4') // 1024, 'KB')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', A + 's218_mochi_qr.mp4', '-vf', "select='eq(n,10)+eq(n,45)+eq(n,95)+eq(n,170)',scale=480:-2,tile=4x1", '-frames:v', '1', '/tmp/v_frames.png'], check=False)
