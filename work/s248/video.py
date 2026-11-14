# S248 · mais propostas de movimento, mesma lógica do S247 (medir o que se mexe em cada toque → 1 movimento curto). Vídeos HOJE × PROPOSTA.  python3 video.py
import os, subprocess, sys, time, shutil
A = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(A + '../s247/gera.py').read().replace("os.path.dirname(os.path.abspath(__file__)) + '/'", "'%s../s247/'" % A); exec(src[:src.index("try:\n  with sync_playwright")])
v = open(A + '../s247/video.py').read(); exec(v[v.index('def grava'):v.index('LOG = ')].replace("for leg, rep in (('velocidade real', 1), ('câmera lenta 4×', 4), ('velocidade real', 1)):", "for leg, rep in (('velocidade real', 1), ('câmera lenta 3×', 3), ('velocidade real', 1)):").replace("A + nome + '.mp4'", "AQ + nome + '.mp4'"))
AQ = A; FPS = 30
s40 = open(A + '../s240/gera.py').read(); j = s40.index('VOA = """') + 9; VOA = s40[j: s40.index('"""', j)]
FIM = "(v)=>{const r=document.querySelector(v);document.getAnimations().forEach(a=>{const t=a.effect&&a.effect.target;if(t&&(t===r||r.contains(t))&&a.effect.getComputedTiming().iterations!==Infinity)a.finish()})}"
# encurta cascatas: mesma animação, atraso = posição × passo, duração nova
CURTA = "([sel,passo,dur])=>{const r=document.querySelector(sel);const as=document.getAnimations().filter(a=>{const t=a.effect&&a.effect.target,c=a.effect&&a.effect.getComputedTiming();return t&&r&&r.contains(t)&&t!==r&&c.iterations!==Infinity&&c.delay>0||(t&&r&&r.contains(t)&&t!==r&&c.iterations!==Infinity&&c.duration>=380)}).sort((x,y)=>x.effect.getComputedTiming().delay-y.effect.getComputedTiming().delay);as.forEach((a,i)=>a.effect.updateTiming({delay:Math.min(i*passo,180),duration:dur,easing:'%s'}))}" % E
def T(ms): return [round(i * 1000 / FPS) for i in range(int(ms * FPS / 1000) + 2)]
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    def seq(pg, ts, clip=None, larg=None, extra=None):
        q = []
        for t in ts:
            pg.evaluate(CONG, t)
            if extra: extra(pg, t)
            pg.wait_for_timeout(20); q.append(shot(pg, clip, larg))
        return q
    R = {}
    # 1 SITE · abrir o menu
    for modo in ('h', 'p'):
        c, pg = site(b); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600); q0 = shot(pg, None, 380); pg.evaluate("document.querySelector('#mnb').click()"); pg.wait_for_timeout(25)
        if modo == 'p': pg.evaluate(CURTA, ['aside.dpn', 16, 260])
        R[modo] = [q0] + seq(pg, T(1150), None, 380); c.close()
    grava('s248_video_site_menu', 'Site · abrir o menu · 1,05 s → 0,45 s', R['h'], R['p'])
    # 2 SITE · favoritar
    for modo in ('h', 'p'):
        c, pg = site(b); pg.goto('http://localhost:8811/?r=tienda'); pg.wait_for_selector('#grid .card'); pg.wait_for_timeout(2600); clip = {'x': 0, 'y': 0, 'width': 390, 'height': 470}; q0 = shot(pg, clip, 380)
        if modo == 'h': pg.evaluate("document.querySelector('#grid .card .fav').click()"); pg.wait_for_timeout(25); R[modo] = [q0] + seq(pg, T(1950), clip, 380)
        else:
            pg.evaluate(VOA); pg.evaluate("()=>{__v1.pause();__v2.pause()}"); R[modo] = [q0]
            for t in T(1950):
                pg.evaluate("t=>{__v1.currentTime=Math.min(t,620);__v2.currentTime=Math.min(t,1200)}", t); pg.wait_for_timeout(20); R[modo].append(shot(pg, clip, 380))
        c.close()
    grava('s248_video_site_favoritar', 'Site · favoritar · 1,9 s → 0,62 s até a sacola', R['h'], R['p'])
    # 4-5 APP · Pendências e Despesas (1 movimento só)
    for v_, nome, fim in (('notif', 'Pendências', 1150), ('desp', 'Despesas', 1450)):
        for modo in ('h', 'p'):
            c, pg = app(b); q0 = shot(pg, None, 380); pg.evaluate("v=>window.__LF.setView(v)", v_); pg.wait_for_timeout(30)
            if modo == 'p':
                pg.evaluate("v=>{const r=document.querySelector('#v-'+v);document.getAnimations().forEach(a=>{const t=a.effect&&a.effect.target,c=a.effect&&a.effect.getComputedTiming();if(!t||!(t===r||r.contains(t))||c.iterations===Infinity)return;if(a.animationName==='telaSobe'||a.animationName==='enterUp'||a.animationName==='chkPop')a.finish();else a.effect.updateTiming({delay:0,duration:480,easing:'%s'})});r.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:200,easing:'%s',fill:'both'})}" % (E, E), v_)
            R[modo] = [q0] + seq(pg, T(fim), None, 380); c.close()
        grava('s248_video_app_' + v_, 'App · abrir %s · fila de %s s → 1 movimento' % (nome, '1,1' if v_ == 'notif' else '1,4'), R['h'], R['p'])
finally: srv.terminate()
