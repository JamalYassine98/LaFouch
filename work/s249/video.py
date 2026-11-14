# S249 · vídeos HOJE × PROPOSTA: janela do app abre e fecha no mesmo padrão; sacola do site abre com movimento; fechar a busca não refaz o catálogo.  python3 video.py
import os, subprocess, sys, time, shutil
AQ = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(AQ + '../s247/gera.py').read().replace("os.path.dirname(os.path.abspath(__file__)) + '/'", "'%s../s247/'" % AQ); exec(src[:src.index("try:\n  with sync_playwright")])
v = open(AQ + '../s247/video.py').read(); exec(v[v.index('def grava'):v.index('LOG = ')].replace("('câmera lenta 4×', 4)", "('câmera lenta 3×', 3)").replace("A + nome + '.mp4'", "AQ + nome + '.mp4'"))
FPS = 30
def T(ms): return [round(i * 1000 / FPS) for i in range(int(ms * FPS / 1000) + 2)]
FIM = "(v)=>{const r=document.querySelector(v);document.getAnimations().forEach(a=>{const t=a.effect&&a.effect.target;if(t&&(t===r||r.contains(t))&&a.effect.getComputedTiming().iterations!==Infinity)a.finish()})}"
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    def seq(pg, ts, clip=None, larg=None):
        q = []
        for t in ts:
            pg.evaluate(CONG, t); pg.wait_for_timeout(20); q.append(shot(pg, clip, larg))
        return q
    R = {}
    # 1 APP · Caixa · + Novo objetivo: abrir e fechar
    for modo in ('h', 'p'):
        c, pg = app(b); pg.evaluate("window.__LF.setView('caixa')"); pg.wait_for_timeout(1300); q0 = shot(pg, None, 380)
        pg.evaluate("document.querySelector('[data-act=cxabre]').click()"); pg.wait_for_timeout(25)
        pg.evaluate("()=>{window.__sh=[];document.getAnimations().forEach(a=>{if(a.animationName==='lfaSUp')window.__sh[0]=a.effect.target;if(a.animationName==='lfaFade')window.__sh[1]=a.effect.target})}")
        if modo == 'p': pg.evaluate("()=>document.getAnimations().forEach(a=>{if(/^lfa/.test(a.animationName||''))a.effect.updateTiming({duration:320,easing:'%s'})})" % E)
        ab = seq(pg, T(480)); ab = [x.resize((380, int(x.height * 380 / x.width))) for x in ab]
        pg.evaluate("()=>document.getAnimations().forEach(a=>{if(a.__c){a.finish()}})"); pg.wait_for_timeout(200)
        if modo == 'p':
            pg.evaluate("()=>{const [s,k]=window.__sh;s&&s.animate([{transform:'none'},{transform:'translateY(105%%)'}],{duration:200,easing:'%s',fill:'forwards'});k&&k.animate([{opacity:1},{opacity:0}],{duration:200,easing:'ease-out',fill:'forwards'})}" % E)
            fe = seq(pg, T(230), None, 380); pg.evaluate("document.querySelector('[data-act=cxfecha]').click()"); pg.wait_for_timeout(150); fe.append(shot(pg, None, 380))
        else:
            pg.evaluate("document.querySelector('[data-act=cxfecha]').click()"); pg.wait_for_timeout(25); fe = seq(pg, T(230), None, 380)
        R[modo] = [q0] + ab + [ab[-1]] * 14 + fe; c.close()
    grava('s249_video_app_janela_abre_fecha', 'App · Caixa · + Novo objetivo: abrir e fechar', R['h'], R['p'])
    # 2 SITE · abrir a sacola
    for modo in ('h', 'p'):
        c, pg = site(b); pg.goto('http://localhost:8811/?r=tienda'); pg.wait_for_selector('#grid .card'); pg.wait_for_timeout(2600); q0 = shot(pg, None, 380)
        pg.evaluate("document.querySelector('#bagbtn').click()"); pg.wait_for_timeout(15)
        if modo == 'p': pg.evaluate("()=>{const p=document.querySelector('aside.panel');p&&p.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:320,easing:'%s',fill:'both'})}" % E)
        R[modo] = [q0] + seq(pg, T(420), None, 380); c.close()
    grava('s249_video_site_sacola', 'Site · abrir a sacola', R['h'], R['p'])
finally: srv.terminate()
