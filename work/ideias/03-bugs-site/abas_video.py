"""IDEIAS 03 · B5 — vídeo Hoje × Proposta da troca de abas da Minha conta (barras de rolagem).
Hoje = cópia do site do ar (/tmp/b5h). Proposta = mesma cópia com a troca PINTADA (/tmp/b5p): sem a cópia solta da aba
antiga; o cartão corta para os lados, a altura anda até a aba nova e o conteúdo novo entra deslizando (pintura — o
"como fazer" de verdade é o trilho único, em BUGS.md). Conta e pedidos SIMULADOS no aparelho (sem senha, sem nuvem).
Barras de rolagem do Windows ligadas (o simulador normalmente esconde).
Uso: python3 abas_video.py → b5-abas-video.mp4"""
import os, json, time, base64, shutil, subprocess, glob
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
import sys; sys.path.insert(0, '/home/claude/lafouch/work/kit')
from playwright.sync_api import sync_playwright
import sim
AQUI = os.path.dirname(os.path.abspath(__file__))
SRC = '/home/claude/catalogo'
FR = '/mnt/skills/examples/morning/assets/fonts/fraunces-latin-600-normal.woff2'
CSS = "@font-face{font-family:Fraunces;font-weight:500 600;src:url(https://fonts.gstatic.com/fr.woff2) format('woff2')}@font-face{font-family:Inter;font-weight:100 900;src:local('Inter')}"
CONTA = json.dumps({'nome': 'Teste Ideias', 'email': 'teste.ideias@exemplo.com', 'tel': '+595 983 000 000', 'ends': [
    {'nome': 'Casa', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Calle Los Lapachos 123', 'ref': 'portão verde'},
    {'nome': 'Trabalho', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Galeria Jebai Center, 3º piso'}]})
AUTH = json.dumps({'uid': 'kit', 'idToken': 'kit', 'refresh': 'kit', 'exp': 9e15, 'ev': True, 'email': 'teste.ideias@exemplo.com'})
T = int(time.time() * 1000)
PEDS = json.dumps([{'id': 'p%d' % i, 'cod': c, 'ts': T - i * 86400000, 'pag': p, 'ent': 'retirada', 'est': e, 'tok': 'LF-85RS' if e == 'pago' else ''}
                   for i, (c, p, e) in enumerate([('VIBT', 'alias', 'pago'), ('3IEX', 'pix', 'cancelado'), ('K2PM', 'pix', 'pago'), ('Q7TA', 'alias', 'pago'), ('M4ZE', 'pix', 'pago')])])
INIT = "localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);localStorage.setItem('lf_ped',%r);try{sessionStorage.setItem('lf_ni','1')}catch(e){}" % (CONTA, AUTH, PEDS)

PINTA = r"""
/* PINTURA (só no esboço): troca de aba da Minha conta sem a cópia solta da aba antiga */
(function(){var st=document.createElement('style');st.textContent='#layer aside.panel{overflow-x:clip}';document.head.appendChild(st);
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#layer .mct button');if(!b)return;var pn=b.closest('aside.panel');if(!pn)return;
  var h0=pn.offsetHeight,bs=[].slice.call(b.parentNode.children),de=bs.findIndex(function(x){return x.classList.contains('on')}),para=bs.indexOf(b),s=para>de?1:-1;
  setTimeout(function(){var m=pn.querySelector('.mct');if(!m)return;var novo=[],k=0;[].slice.call(pn.children).forEach(function(x){if(k&&!x.classList.contains('mcOld'))novo.push(x);if(x===m)k=1});
   pn.querySelectorAll('.mcOld').forEach(function(x){x.remove()});pn.style.height='';var h1=pn.offsetHeight;
   pn.style.overflowY='clip';pn.animate([{height:h0+'px'},{height:h1+'px'}],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'}).onfinish=function(){pn.style.overflowY=''};
   novo.forEach(function(x){try{x.getAnimations().forEach(function(a){a.cancel()})}catch(_){}x.animate([{opacity:0,transform:'translateX('+(28*s)+'px)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'})})},0)},false)})();
"""

def copia(dst, pinta):
    shutil.rmtree(dst, ignore_errors=True); shutil.copytree(SRC, dst, ignore=shutil.ignore_patterns('.git'))
    if pinta:
        p = dst + '/js/lf-site.js'; j = open(p).read()
        assert j.count('if(MOV()&&velho.length){') == 1
        j = j.replace('if(MOV()&&velho.length){', 'if(false&&MOV()&&velho.length){') + PINTA  # a cópia solta não é feita na Proposta
        open(p, 'w').write(j)

def rota(r):
    u = r.request.url
    if u.startswith('http://localhost'): return r.continue_()
    if u.startswith('https://fonts.googleapis.com/'): return r.fulfill(status=200, content_type='text/css', body=CSS)
    if u == 'https://fonts.gstatic.com/fr.woff2': return r.fulfill(status=200, content_type='font/woff2', body=open(FR, 'rb').read())
    return r.abort()

ABAS = ['Pedidos', 'Endereços', 'Cartões', 'Perfil', 'Endereços', 'Pedidos', 'Cartões']

def grava(nome, porta, W, H, toque):
    pasta = '/tmp/vb5-%s-%d' % (nome, W); shutil.rmtree(pasta, ignore_errors=True); os.makedirs(pasta)
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=sim.EXE, args=sim.ARGS, ignore_default_args=['--hide-scrollbars'])
        c = sim.contexto(b, W, H, toque=toque, dpr=1 if W > 700 else 2, lingua='pt-BR')
        c.add_init_script(INIT); c.route('**/*', rota); pg = c.new_page()
        cdp = c.new_cdp_session(pg); Q = []
        def q(ev): Q.append((ev['metadata']['timestamp'], ev['data'])); cdp.send('Page.screencastFrameAck', {'sessionId': ev['sessionId']})
        cdp.on('Page.screencastFrame', q)
        pg.goto('http://localhost:%d/?cliente=1' % porta); pg.wait_for_timeout(2500)
        pg.evaluate("document.querySelector('#contabtn').click()"); pg.wait_for_timeout(1500)
        cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 88, 'maxWidth': W * (1 if W > 700 else 2), 'maxHeight': H * (1 if W > 700 else 2)})
        pg.wait_for_timeout(800); barras = []
        for a in ABAS:
            pg.evaluate("a=>{const b=[...document.querySelectorAll('#layer .mct button')].find(e=>e.textContent.trim()===a);b&&b.click()}", a)
            m = 0; t0 = time.time()
            while time.time() - t0 < 1.4:
                m = max(m, pg.evaluate("()=>{const p=document.querySelector('#layer aside.panel');return p?(p.scrollHeight>p.clientHeight+1?1:0)+(p.scrollWidth>p.clientWidth+1?2:0):0}")); pg.wait_for_timeout(40)
            barras.append((a, {0: '-', 1: 'vertical', 2: 'horizontal', 3: 'vertical+horizontal'}[m]))
        pg.wait_for_timeout(600); cdp.send('Page.stopScreencast'); c.close(); b.close()
    L = []
    for i, (ts, d) in enumerate(Q):
        fn = '%s/q%05d.jpg' % (pasta, i); open(fn, 'wb').write(base64.b64decode(d)); L.append((ts, fn))
    with open(pasta + '/l.txt', 'w') as f:
        for i, (ts, fn) in enumerate(L):
            f.write("file '%s'\nduration %.4f\n" % (fn, (L[i + 1][0] - ts) if i + 1 < len(L) else 1.0))
        f.write("file '%s'\n" % L[-1][1])
    out = pasta + '/v.mp4'
    sz = '%d:%d' % (W, H) if W > 700 else '%d:%d' % (W * 2, H * 2)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', pasta + '/l.txt', '-vf', 'scale=%s,fps=30' % sz,
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], check=True)
    return out, barras

if __name__ == '__main__':
    # 1º: python3 abas_video.py copias  → monta /tmp/b5h e /tmp/b5p
    # 2º: num comando SEPARADO, subir os servidores (o pkill na mesma linha mata o próprio shell):
    #     (cd /tmp/b5h && setsid nohup python3 -m http.server 8721 &) ; (cd /tmp/b5p && setsid nohup python3 -m http.server 8722 &)
    # 3º: python3 abas_video.py
    import sys
    if 'copias' in sys.argv:
        copia('/tmp/b5h', False); copia('/tmp/b5p', True); raise SystemExit
    FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    lab = lambda t, c: "pad=iw:ih+70:0:70:color=white,drawtext=fontfile=%s:text='%s':x=20:y=18:fontsize=36:fontcolor=%s" % (FT, t, c)
    rel = {}
    for W, H, toque, tag in ((1128, 900, False, 'pc'), (390, 844, True, 'cel')):
        h, bh = grava('hoje', 8721, W, H, toque); p, bp = grava('prop', 8722, W, H, toque); rel[tag] = {'hoje': bh, 'prop': bp}
        pilha = 'vstack' if tag == 'pc' else 'hstack'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', h, '-i', p, '-filter_complex',
                        '[0:v]%s,tpad=stop_mode=clone:stop_duration=5[a];[1:v]%s,tpad=stop_mode=clone:stop_duration=5[b];[a][b]%s=inputs=2,trim=duration=13[v]' % (lab('HOJE', '#b3261e'), lab('PROPOSTA', '#8d3a69'), pilha),
                        '-map', '[v]', '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
                        os.path.join(AQUI, 'b5-abas-%s.mp4' % tag)], check=True)
    json.dump(rel, open(os.path.join(AQUI, 'b5-barras.json'), 'w'), ensure_ascii=False, indent=1); print(json.dumps(rel, ensure_ascii=False))
