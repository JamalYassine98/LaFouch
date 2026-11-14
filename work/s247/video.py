# S247 · vídeos HOJE × PROPOSTA (velocidade real e depois câmera lenta 4×). Quadros exatos: cada animação é pausada e posta no tempo t.  python3 video.py
import os, subprocess, sys, time, shutil
A = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(A + 'gera.py').read(); exec(src[:src.index("try:\n  with sync_playwright")])
FPS = 30; TS = [round(i * 1000 / FPS) for i in range(20)]
def grava(nome, tit, hoje, prop, vertical=False):
    d = '/tmp/s247v_' + nome; shutil.rmtree(d, ignore_errors=True); os.makedirs(d); n = 0
    def quadro(a, b_, leg):
        g = 20; W = (max(a.width, b_.width) if vertical else a.width + b_.width + g) + 60; H = (a.height + b_.height + 60 if vertical else max(a.height, b_.height)) + 150; W += W % 2; H += H % 2
        B = Image.new('RGB', (W, H), '#ece6ea'); dr = ImageDraw.Draw(B); dr.text((30, 16), tit, font=F(24, 1), fill='#2a1a28'); dr.text((30, 50), leg, font=F(19), fill='#5b4a57')
        dr.text((30, 86), 'HOJE', font=F(22, 1), fill=V); B.paste(a, (30, 118))
        if vertical: y = 118 + a.height + 14; dr.text((30, y), 'PROPOSTA', font=F(22, 1), fill=G); B.paste(b_, (30, y + 32))
        else: dr.text((30 + a.width + g, 86), 'PROPOSTA', font=F(22, 1), fill=G); B.paste(b_, (30 + a.width + g, 118))
        return B
    def poe(im, rep):
        nonlocal n
        for _ in range(rep): im.save('%s/%05d.png' % (d, n)); n += 1
    for leg, rep in (('velocidade real', 1), ('câmera lenta 4×', 4), ('velocidade real', 1)):
        poe(quadro(hoje[0], prop[0], leg), 24)
        for a, b_ in zip(hoje[1:], prop[1:]): poe(quadro(a, b_, leg), rep)
        poe(quadro(hoje[-1], prop[-1], leg), 30)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', d + '/%05d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', A + nome + '.mp4'], check=True)
    print('ok', nome, n, 'quadros', os.path.getsize(A + nome + '.mp4') // 1024, 'kB', flush=True)
LOG = "localStorage.setItem('lf_auth',JSON.stringify({uid:'t1',email:'ana@exemplo.com',gn:'Ana'}));localStorage.setItem('lf_conta',JSON.stringify({nome:'Ana Teste',email:'ana@exemplo.com',ts:Date.now(),ends:[{id:'e1',nome:'Casa',cidade:'Asunción',dep:'Central',end:'Av. España 123',ref:''}]}))"
HOV = "#grid .card:hover{transform:none!important;box-shadow:0 8px 22px color-mix(in srgb,var(--tx) 10%,transparent)!important}#grid .card .pf{transition:transform .48s " + E + "!important}#grid .card:hover .pf{transform:scale(1.035)!important}#grid .card{transition:box-shadow .32s " + E + "!important}"
FIM = "(v)=>{const r=document.querySelector(v);document.getAnimations().forEach(a=>{const t=a.effect&&a.effect.target;if(t&&(t===r||r.contains(t))&&a.effect.getComputedTiming().iterations!==Infinity)a.finish()})}"
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    def seq(pg, clip=None, larg=None, extra=None):
        q = []
        for t in TS:
            pg.evaluate(CONG, t)
            if extra: extra(pg, t)
            pg.wait_for_timeout(25); q.append(shot(pg, clip, larg))
        return q
    # 1 Minha conta
    R = {}
    for modo in ('h', 'p'):
        c, pg = site(b, init=LOG); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600); pg.evaluate("document.querySelector('#contabtn').click()"); pg.wait_for_timeout(1500); q0 = shot(pg, {'x': 0, 'y': 0, 'width': 390, 'height': 560}, 380)
        pg.evaluate("document.querySelectorAll('.mct button')[1].click()"); pg.wait_for_timeout(25)
        if modo == 'p': pg.evaluate(FIM, '.panel'); pg.evaluate("()=>{const p=document.querySelector('.panel'),m=p.querySelector('.mct');let d=false;[...p.children].forEach(e=>{if(e===m){d=true;return}if(d)e.animate([{opacity:0},{opacity:1}],{duration:200,easing:'%s',fill:'both'})})}" % E)
        R[modo] = [q0] + seq(pg, {'x': 0, 'y': 0, 'width': 390, 'height': 560}, 380); c.close()
    grava('s247_video_site_conta_abas', 'Site · Minha conta · Perfil → Endereços', R['h'], R['p'])
    # 2 mouse na peça (PC)
    for modo in ('h', 'p'):
        c, pg = site(b, 1440, 900); pg.goto('http://localhost:8811/?r=tienda'); pg.wait_for_selector('#grid .card'); pg.wait_for_timeout(2600)
        if modo == 'p': pg.add_style_tag(content=HOV)
        bx = pg.evaluate("()=>{const r=document.querySelectorAll('#grid .card')[1].getBoundingClientRect();return [r.x,r.y,r.width,r.height]}"); clip = {'x': max(0, bx[0] - bx[2] - 30), 'y': max(0, bx[1] - 40), 'width': bx[2] * 3 + 80, 'height': min(900 - max(0, bx[1] - 40), bx[3] + 80)}
        q0 = shot(pg, clip, 860); pg.mouse.move(bx[0] + bx[2] / 2, bx[1] + bx[3] / 2); pg.wait_for_timeout(20); R[modo] = [q0] + seq(pg, clip, 860); c.close()
    grava('s247_video_site_pc_mouse_na_peca', 'Site · computador · mouse na peça do meio', R['h'], R['p'], vertical=True)
    # 3 abrir o Caixa
    def conta(pg, t): pg.evaluate("t=>{const b=document.querySelector('#v-caixa .cxTot b'),n=+window.__tot.replace(/\\D/g,''),k=Math.min(1,t/480),e=1-Math.pow(1-k,3);b.textContent='G$ '+Math.round(n*e).toLocaleString('de-DE')}", t)
    for modo in ('h', 'p'):
        c, pg = app(b); q0 = shot(pg, None, 380); pg.evaluate("window.__LF.setView('caixa')"); pg.wait_for_timeout(30)
        if modo == 'p': pg.evaluate(FIM, '#v-caixa'); pg.evaluate("()=>{const v=document.querySelector('#v-caixa');v.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:200,easing:'%s',fill:'both'});window.__tot=v.querySelector('.cxTot b').textContent}" % E)
        R[modo] = [q0] + seq(pg, None, 380, conta if modo == 'p' else None); c.close()
    grava('s247_video_app_abrir_caixa', 'App · Início → Caixa', R['h'], R['p'])
    # 4 botão afundando (Inventário, claro em cima e escuro embaixo)
    for modo, css in (('h', None), ('p', BOT)):
        fs = []
        for sc in ('light', 'dark'):
            c, pg = app(b, sc, css); pg.evaluate("window.__LF.setView('estoque')"); pg.wait_for_timeout(1000); clip = {'x': 0, 'y': 100, 'width': 390, 'height': 92}; q0 = shot(pg, clip)
            bx = pg.locator('.view:not([hidden]) #btnAdd').first.bounding_box(); pg.mouse.move(bx['x'] + bx['width'] / 2, bx['y'] + bx['height'] / 2); pg.mouse.down(); pg.wait_for_timeout(15)
            desce = seq(pg, clip)[:7]; fs.append([q0] + desce + [desce[-1]] * 5 + desce[::-1] + [q0]); c.close()
        R[modo] = []
        for x, y in zip(*fs):
            J = Image.new('RGB', (x.width, x.height + y.height + 8), '#ece6ea'); J.paste(x, (0, 0)); J.paste(y, (0, x.height + 8)); R[modo].append(J)
    grava('s247_video_app_botao_afunda', 'App · Inventário · apertar e soltar + Adicionar', R['h'], R['p'])
finally: srv.terminate()
