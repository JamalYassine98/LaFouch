# S251 · vídeos HOJE × PROPOSTA dos itens 17 a 21 (aprovados em texto; o dono pediu para ver).  python3 video.py
import os, subprocess, sys, time, shutil, glob
AQ = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(AQ + '../s247/gera.py').read().replace("os.path.dirname(os.path.abspath(__file__)) + '/'", "'%s../s247/'" % AQ); exec(src[:src.index("try:\n  with sync_playwright")])
v = open(AQ + '../s247/video.py').read(); exec(v[v.index('def grava'):v.index('LOG = ')].replace("('câmera lenta 4×', 4)", "('câmera lenta 3×', 3)").replace("A + nome + '.mp4'", "AQ + nome + '.mp4'"))
FPS = 30
SO = os.environ.get('SO', '17 18 19 20 21').split()
def T(ms): return [round(i * 1000 / FPS) for i in range(int(ms * FPS / 1000) + 2)]
OBS = "()=>{window.__nv=new Set();window.__mo=new MutationObserver(l=>l.forEach(m=>{m.addedNodes.forEach(n=>n.nodeType===1&&window.__nv.add(n));if(m.type==='attributes'&&m.target.nodeType===1)window.__nv.add(m.target)}));window.__mo.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class','style','open']})}"
ENTRA = "()=>{window.__mo.disconnect();const l=[...window.__nv].filter(e=>e.isConnected&&e.getClientRects().length&&e.getBoundingClientRect().height>30&&!e.matches('#mainnav,#mainnav *,html,body,.view,.top,.top *'));const top=l.filter(e=>!l.some(o=>o!==e&&o.contains(e)));top.forEach(e=>e.animate([{opacity:0,transform:'translateY(-4px)'},{opacity:1,transform:'none'}],{duration:200,easing:'%s',fill:'both'}));return top.map(e=>e.tagName+'.'+e.className).join(' , ')}" % E
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    def seq(pg, ts, clip=None, larg=None):
        q = []
        for t in ts:
            pg.evaluate(CONG, t); pg.wait_for_timeout(20); q.append(shot(pg, clip, larg))
        return q
    R = {}
    # 17 · APP: calendário do Histórico e + Novo cliente aparecem secos
    for nome, v_, act, tit in () if '17' not in SO else (('app_hist_calendario', 'hist', 'hcal', 'App · Histórico · abrir o calendário'), ('app_novo_cliente', 'clientes', 'clinovo', 'App · Clientes · + Novo cliente')):
        for modo in ('h', 'p'):
            c, pg = app(b); pg.evaluate("v=>window.__LF.setView(v)", v_); pg.wait_for_timeout(1300); q0 = shot(pg, None, 380); pg.evaluate(OBS)
            pg.evaluate("k=>document.querySelector('[data-act=\"'+k+'\"]').click()", act); pg.wait_for_timeout(20)
            if modo == 'p': print('   entra:', pg.evaluate(ENTRA)[:160])
            R[modo] = [q0] + seq(pg, T(330), None, 380); c.close()
        grava('s251_video_' + nome, tit, R['h'], R['p'])
    # 18 · APP: Pedidos, desenho da tela vazia
    for modo in ('h', 'p') if '18' in SO else ():
        c, pg = app(b); q0 = shot(pg, None, 380); pg.evaluate("window.__LF.setView('ped')"); pg.wait_for_timeout(30)
        if modo == 'p': pg.evaluate("()=>document.getAnimations().forEach(a=>{const n=a.animationName||'';if(n==='lfDesenha')a.effect.updateTiming({delay:0,duration:600,easing:'%s'});if(n==='lfSobe')a.effect.updateTiming({delay:300,duration:240,easing:'%s'})})" % (E, E))
        R[modo] = [q0] + seq(pg, T(1550), None, 380); c.close()
    if '18' in SO: grava('s251_video_app_pedidos_vazio', 'App · Pedidos · desenho da tela vazia 1,5 s → 0,6 s', R['h'], R['p'])
    # 19 · SITE: fechar a busca
    for modo in ('h', 'p') if '19' in SO else ():
        c, pg = site(b); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600)
        pg.evaluate("([...document.querySelectorAll('header button,.top button,.top a')].find(e=>/buscar/i.test((e.getAttribute('aria-label')||'')+(e.title||'')+e.id+e.className))).click()"); pg.wait_for_timeout(1100); q0 = shot(pg, None, 380)
        if modo == 'p':
            pg.evaluate("()=>{const p=document.querySelector('.sopn'),s=document.querySelector('.sosc');p&&p.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-6px)'}],{duration:200,easing:'%s',fill:'forwards'});s&&s.animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'})}" % E)
            q = seq(pg, T(220), None, 380); pg.keyboard.press('Escape'); pg.wait_for_timeout(200); R[modo] = [q0] + q + [shot(pg, None, 380)] * 3
        else:
            pg.keyboard.press('Escape'); pg.wait_for_timeout(20); R[modo] = [q0] + seq(pg, T(220), None, 380) + [shot(pg, None, 380)] * 3
        c.close()
    if '19' in SO: grava('s251_video_site_fechar_busca', 'Site · fechar a busca', R['h'], R['p'])
    # 20 · SITE: fechar o menu
    for modo in ('h', 'p') if '20' in SO else ():
        c, pg = site(b); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600); pg.evaluate("document.querySelector('#mnb').click()"); pg.wait_for_timeout(1400); q0 = shot(pg, None, 380)
        pg.evaluate("()=>{window.__old=new Set(document.getAnimations())}"); pg.keyboard.press('Escape'); pg.wait_for_timeout(20)
        if modo == 'p': pg.evaluate("()=>document.getAnimations().forEach(a=>{if(window.__old.has(a))return;const c=a.effect.getComputedTiming();if(c.iterations!==Infinity)a.effect.updateTiming({delay:0,duration:200,easing:'%s'})})" % E)
        R[modo] = [q0] + seq(pg, T(600), None, 380); c.close()
    if '20' in SO: grava('s251_video_site_fechar_menu', 'Site · fechar o menu 0,53 s → 0,2 s', R['h'], R['p'])
    # 21 · SITE: enfeites da temática (tempo real, 12 s)
    vs = []
    for modo in ('h', 'p'):
        d = '/tmp/s251_' + modo; shutil.rmtree(d, ignore_errors=True)
        c = b.new_context(viewport={'width': 390, 'height': 560}, is_mobile=True, has_touch=True, locale='es-PY', service_workers='block', record_video_dir=d, record_video_size={'width': 390, 'height': 560}); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', rota)
        pg = c.new_page(); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2400); t0 = time.time(); pg.evaluate("document.documentElement.setAttribute('data-ev','natal')")
        if modo == 'p':
            pg.wait_for_timeout(8000); print('   enfeites parados:', pg.evaluate("()=>{let n=0;document.getAnimations().forEach(a=>{const c=a.effect.getComputedTiming(),t=a.effect.target;if(c.iterations===Infinity&&/^ev(cai|pis|asa)$/.test(a.animationName||'')){a.effect.updateTiming({iterations:Math.max(1,Math.ceil((a.currentTime-c.delay)/c.duration)),fill:'forwards'});n++}});return n}")); pg.wait_for_timeout(5000)
        else: pg.wait_for_timeout(13000)
        c.close(); vs.append((glob.glob(d + '/*.webm')[0], 2.4))
    FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '2.4', '-t', '13', '-i', vs[0][0], '-ss', '2.4', '-t', '13', '-i', vs[1][0], '-filter_complex',
        "[0:v]pad=iw+20:ih+90:10:80:color=0xece6ea,drawtext=text='HOJE · caem sem parar':fontfile=%s:fontsize=20:fontcolor=0xb42318:x=10:y=46[a];[1:v]pad=iw+20:ih+90:10:80:color=0xece6ea,drawtext=text='PROPOSTA · param aos 8 s':fontfile=%s:fontsize=20:fontcolor=0x1f8a4c:x=10:y=46[b];[a][b]hstack,drawtext=text='Site · temática de Natal · tempo real':fontfile=%s:fontsize=22:fontcolor=0x2a1a28:x=10:y=12" % (FT, FT, FT),
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-r', '30', '-movflags', '+faststart', AQ + 's251_video_site_tematica_natal.mp4'], check=True); print('ok natal', os.path.getsize(AQ + 's251_video_site_tematica_natal.mp4') // 1024, 'kB')
finally: srv.terminate()
