# S220 (13/11/2026): ESBOÇO EM VÍDEO v3 (aprovado o v2 com a condição de apontar certo: a ponta da luva é MEDIDA e corrigida antes de gravar)
# S219: v2 — a Mochi VAI até o código QR (pulo em arco, padrão S88), aponta, e VOLTA ao botão Empezar. Sem voz.
# Depois confere "pixels soltos": em cada quadro em que ela está sobre fundo liso, o desenho dela tem de ser UMA peça só (+ a sombra).
import sys, os, glob, subprocess, shutil, time, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
CSS = ".lxqr{display:flex;gap:18px;align-items:center;justify-content:space-between;margin-top:18px;padding:16px 18px 16px 22px;border:1px solid var(--ln,#efe3ea);border-radius:18px;background:#fff;opacity:0;transform:translateY(12px);transition:opacity .48s cubic-bezier(.2,.8,.2,1),transform .48s cubic-bezier(.2,.8,.2,1)}.lxqr.on{opacity:1;transform:none}.lxqr .q{flex:none;width:112px;height:112px}.lxqr .q svg{width:100%;height:100%;display:block}.lxqr .t{display:flex;flex-direction:column;gap:6px}.lxqr b{font:600 16px var(--display),Georgia,serif;color:var(--tx,#2a1f27)}.lxqr small{font:400 13.5px var(--body),Inter,sans-serif;color:var(--mu,#6b5a66);line-height:1.45}.lxqr small.m2{color:var(--ac,#8d3a69)}#gw .gzbal{transition:opacity .2s}"
QR = """async()=>{if(!window.LFqr){await new Promise(ok=>{const s=document.createElement('script');s.src='lfx/qr.js';s.onload=ok;document.head.appendChild(s)})}
 const g=document.querySelector('#gw'),b=g.querySelector('.gzgo');const d=document.createElement('div');d.className='lxqr';d.innerHTML='<span class="t"><b>Mejor en el celular</b><small>Apuntá la cámara del celular a este código y seguí ahí.</small><small class="m2">O tocá Empezar para hacerlo en esta computadora.</small></span><span class="q">'+window.LFqr.svg('https://lafouch.com/?r=descubri-tu-graduacion')+'</span>';b.insertAdjacentElement('afterend',d)}"""
FALA = "t=>{const f=document.querySelector('#gw .gzbal');f.style.opacity=0;setTimeout(()=>{f.textContent=t;f.style.opacity=1},200)}"
W, H = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (1366, 768)
shutil.rmtree('/tmp/vid2', ignore_errors=True)
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    c = b.new_context(viewport={'width': W, 'height': H}, locale='es-PY', service_workers='block', record_video_dir='/tmp/vid2', record_video_size={'width': W, 'height': H})
    c.route('**/*', rota); pg = c.new_page(); t0 = time.time(); pg.goto('http://localhost:8811/?r=descubri-tu-graduacion'); pg.wait_for_timeout(5200)
    pg.add_style_tag(content=CSS + (os.environ.get('ESCURO') and 'html,body,#gw,#gw *:not(svg):not(svg *){background:#101010!important;background-image:none!important}.lxqr,.lxqr *{background:#101010!important}.lxqr svg{opacity:.25}' or '')); pg.evaluate(QR); pg.evaluate("()=>{document.querySelector('#gw .gzbal').textContent='Cuando quieras, solo tocá Empezar.'}"); pg.wait_for_timeout(1000)
    g = pg.evaluate("""()=>{const m=window.__LFGZ.Z.m,e=m.el.getBoundingClientRect(),q=document.querySelector('.lxqr .q').getBoundingClientRect(),c=document.querySelector('.lxqr').getBoundingClientRect();return {x:m.x,y:m.y,ex:e.left,ey:e.top,ew:e.width,eh:e.height,qx:q.left,qy:q.top,qw:q.width,cr:c.right,cb:c.bottom}}""")
    dx = (g['cr'] + 14) - g['ex']; dy = (g['qy'] + g['qw'] / 2 - g['eh'] * 0.55) - g['ey']
    PONTA = "()=>{const l=document.querySelector('#gw .luva').getBoundingClientRect();return [l.left+l.width/2,l.top+l.height/2,l.left,l.top,l.right,l.bottom]}"
    def ensaio(dx, dy):
        pg.evaluate("d=>{const m=window.__LFGZ.Z.m;m.paraGesto&&m.paraGesto();m.ocioso=false;m.vara(0);m.pula(B[0]+d[0],B[1]+d[1],300,20)}".replace('B[0]', str(g['x'])).replace('B[1]', str(g['y'])), [dx, dy]); pg.wait_for_timeout(1700)
        pg.evaluate("()=>{const m=window.__LFGZ.Z.m;m.vara(1);m.mira(18,34,200)}"); pg.wait_for_timeout(1100); p = pg.evaluate(PONTA)
        pg.evaluate("p=>{const m=window.__LFGZ.Z.m;m.vara(0);m.pula(p[0],p[1],300,20)}", [g['x'], g['y']]); pg.wait_for_timeout(1700); return p
    alvo = [g['qx'] + g['qw'] - 10, g['qy'] + g['qw'] / 2]           # ponta da luva: 10 px para dentro da borda direita do código, na metade da altura
    p = ensaio(dx, dy)
    for _ in range(4):
        if abs(p[0] - alvo[0]) < 3 and abs(p[1] - alvo[1]) < 3: break
        dx += alvo[0] - p[0]; dy += alvo[1] - p[1]; p = ensaio(dx, dy)
    pg.evaluate("()=>{const m=window.__LFGZ.Z.m;m.vara(1);m.mira(118,30,200)}"); pg.wait_for_timeout(900); pb = pg.evaluate(PONTA); bt = pg.evaluate("()=>{const b=document.querySelector('#gw .gzgo').getBoundingClientRect();return [b.left,b.top,b.right,b.bottom]}")
    mo = pg.evaluate("()=>{const e=window.__LFGZ.Z.m.el.getBoundingClientRect();return [e.left,e.top,e.right,e.bottom]}")
    med = {'tela': [W, H], 'erro_no_codigo_px': [round(p[0] - alvo[0], 1), round(p[1] - alvo[1], 1)], 'ponta_dentro_do_codigo': g['qx'] <= p[0] <= g['qx'] + g['qw'] and g['qy'] <= p[1] <= g['qy'] + g['qw'], 'ponta_dentro_do_botao': bt[0] <= pb[0] <= bt[2] and bt[1] <= pb[1] <= bt[3], 'folga_no_botao_px': [round(pb[0] - bt[0]), round(bt[2] - pb[0]), round(pb[1] - bt[1]), round(bt[3] - pb[1])], 'mochi_no_codigo_cabe_na_tela': (g['cr'] + 14 + (alvo[0] - (p[0] - 0)) * 0 + g['ew']) <= W, 'pouso_x_direita': round(g['ex'] + dx + g['ew']), 'pouso_y_baixo': round(g['ey'] + dy + g['eh'])}
    print('MEDIDA', json.dumps(med, ensure_ascii=False), flush=True)
    if os.environ.get('SO_MEDIR'): c.close(); b.close(); sys.exit(0)
    pg.evaluate("()=>{const m=window.__LFGZ.Z.m;m.vara(1);m.mira(118,26,200);document.querySelector('#gw .gzbal').textContent='Cuando quieras, solo tocá Empezar.'}"); pg.wait_for_timeout(1200)
    clip = [int(max(0, g['ex'] - 480)), 78, int(min(W, g['cr'] + 40 + g['ew'])) , int(min(H, g['cb'] + 26))]
    ini = time.time() - t0 - 0.9; marcos = {}
    T = lambda k: marcos.__setitem__(k, round(time.time() - t0 - ini, 2))
    # 1 fala + antecipação e pulo em arco até o lado do código, que surge enquanto ela está no ar
    T('fala1'); pg.evaluate(FALA, 'Este test sale mejor en el celular.'); pg.evaluate("()=>{const m=window.__LFGZ.Z.m;m.paraGesto&&m.paraGesto();m.ocioso=false;try{m.fala(1)}catch(_){}}"); pg.wait_for_timeout(500)
    T('pulo1'); pg.evaluate("d=>{const m=window.__LFGZ.Z.m;m.vara(0);m.pula(d[0],d[1],760,70)}", [g['x'] + dx, g['y'] + dy]); pg.wait_for_timeout(420); pg.evaluate("()=>document.querySelector('.lxqr').classList.add('on')"); pg.wait_for_timeout(700)
    T('aponta'); pg.evaluate("p=>{const m=window.__LFGZ.Z.m;m.vara(1);m.mira(18,34,420);m.olhaPara(p[0],p[1])}", [g['qx'] + g['qw'] / 2, g['qy'] + g['qw'] / 2]); pg.wait_for_timeout(500)
    pg.evaluate(FALA, 'Apuntá la cámara a este código…'); pg.wait_for_timeout(500); pg.evaluate("()=>window.__LFGZ.Z.m.toca()"); pg.wait_for_timeout(2300)
    # 2 volta ao botão Empezar
    T('pulo2'); pg.evaluate(FALA, '…o seguimos acá, como prefieras.'); pg.evaluate("p=>{const m=window.__LFGZ.Z.m;m.vara(0);m.pula(p[0],p[1],760,70)}", [g['x'], g['y']]); pg.wait_for_timeout(1150)
    T('botao'); pg.evaluate("()=>{const m=window.__LFGZ.Z.m;const b=document.querySelector('#gw .gzgo').getBoundingClientRect();m.vara(1);m.mira(118,30,420);m.olhaPara(b.left+b.width/2,b.top+b.height/2);try{m.sim()}catch(_){}}"); pg.wait_for_timeout(2300)
    T('fim'); pg.evaluate("()=>{const m=window.__LFGZ.Z.m;try{m.calou()}catch(_){};m.olhaPara(innerWidth/2,innerHeight*.45)}"); pg.wait_for_timeout(1300)
    fim = time.time() - t0; c.close(); b.close()
v = glob.glob('/tmp/vid2/*.webm')[0]; nome = ('escuro_' if os.environ.get('ESCURO') else '') + 's220_mochi_qr_v3' + ('' if W == 1366 else '_%d' % W)
cw, ch = clip[2] - clip[0], clip[3] - clip[1]; cw -= cw % 2; ch -= ch % 2
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '%.2f' % ini, '-i', v, '-t', '%.2f' % (fim - ini), '-vf', 'crop=%d:%d:%d:%d' % (cw, ch, clip[0], clip[1]), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', A + nome + '.mp4'], check=True)
json.dump({'marcos': marcos, 'clip': clip, 'g': g, 'dx': dx, 'dy': dy, 'W': W, 'H': H}, open('/tmp/v2_%d.json' % W, 'w'))
print('ok', nome, round(fim - ini, 1), 's', marcos, 'clip', clip)
