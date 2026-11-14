# S252 · versão "luxo" do movimento (origem, simetria, direção, profundidade) ao lado da versão aprovada. Vídeos APROVADO × LUXO.  python3 video.py
import os, subprocess, sys, time, shutil
AQ = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(AQ + '../s247/gera.py').read().replace("os.path.dirname(os.path.abspath(__file__)) + '/'", "'%s../s247/'" % AQ); exec(src[:src.index("try:\n  with sync_playwright")])
v = open(AQ + '../s247/video.py').read(); exec(v[v.index('def grava'):v.index('LOG = ')].replace("('câmera lenta 4×', 4)", "('câmera lenta 3×', 3)").replace("A + nome + '.mp4'", "AQ + nome + '.mp4'").replace("'HOJE'", "'APROVADO'").replace("'PROPOSTA'", "'LUXO'").replace("fill=V)", "fill='#5b4a57')"))
FPS = 30; SO = os.environ.get('SO', 'busca sacola abas tela janela').split()
X = 'cubic-bezier(.16,1,.3,1)'   # desaceleração longa, sem quique
def T(ms): return [round(i * 1000 / FPS) for i in range(int(ms * FPS / 1000) + 2)]
# congela só as animações da fase atual (as de fases anteriores ficam como terminaram)
CG = "t=>document.getAnimations().forEach(a=>{const c=a.effect&&a.effect.getComputedTiming();if(!c||c.iterations===Infinity||c.duration>3000)return;if(!a.__c){if(a.playState!=='running')return;a.__c=window.__fase||1}if(a.__c!==(window.__fase||1))return;a.pause();a.currentTime=t})"
FASE = "()=>{document.getAnimations().forEach(a=>{if(a.__c===(window.__fase||1)){try{a.finish()}catch(e){}}});window.__fase=(window.__fase||1)+1}"
ZERA = "(sel)=>{const r=sel?document.querySelector(sel):null;document.getAnimations().forEach(a=>{const c=a.effect&&a.effect.getComputedTiming(),t=a.effect&&a.effect.target;if(!c||c.iterations===Infinity||a.__c)return;if(a.playState==='running'&&(!r||(t&&(t===r||r.contains(t))))){try{a.finish()}catch(e){};a.__c=-1}})}"
LOG = "localStorage.setItem('lf_auth',JSON.stringify({uid:'t1',email:'ana@exemplo.com',gn:'Ana'}));localStorage.setItem('lf_conta',JSON.stringify({nome:'Ana Teste',email:'ana@exemplo.com',ts:Date.now(),ends:[{id:'e1',nome:'Casa',cidade:'Asunción',dep:'Central',end:'Av. España 123',ref:''}]}))"
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    def seq(pg, ts, clip=None):
        q = []
        for t in ts:
            pg.evaluate(CG, t); pg.wait_for_timeout(20); q.append(shot(pg, clip, 380))
        return q
    R = {}
    # 1 · SITE · busca: abre da lupa e volta para ela; página recua; conteúdo em fila curta
    if 'busca' in SO:
      for modo in ('a', 'l'):
        c, pg = site(b); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600); q0 = shot(pg, None, 380)
        pg.evaluate("document.querySelector('#sbtn').click()"); pg.wait_for_timeout(20)
        if modo == 'l':
            pg.evaluate(ZERA, None)
            pg.evaluate("""(X)=>{const A=(e,k,o)=>e&&e.animate(k,Object.assign({fill:'both',easing:X},o));
              A(document.querySelector('.sosc'),[{opacity:0},{opacity:1}],{duration:320,easing:'ease-out'});
              A(document.querySelector('#home'),[{transform:'none',filter:'blur(0px)'},{transform:'scale(.985)',filter:'blur(2px)'}],{duration:440});
              const P=document.querySelector('.sopn'),B0=getComputedStyle(P).transform,B=B0==='none'?'':B0+' ';window.__B=B;A(P,[{opacity:0,transform:B+'scale(.7)'},{opacity:1,transform:B||'none'}],{duration:440});
              A(document.querySelector('.sobar'),[{opacity:0,transform:'translateY(-4px)'},{opacity:1,transform:'none'}],{duration:260,delay:90});
              [document.querySelector('.sohint'),...document.querySelectorAll('.socat > *')].forEach((e,i)=>A(e,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:280,delay:150+i*22}))}""", X)
        ab = seq(pg, T(600)); pg.evaluate(FASE)
        if modo == 'a': pg.evaluate("""(E)=>{const p=document.querySelector('.sopn'),s=document.querySelector('.sosc');const B0=getComputedStyle(p).transform,B=B0==='none'?'':B0+' ';p.animate([{opacity:1,transform:B||'none'},{opacity:0,transform:B+'translateY(-6px)'}],{duration:200,easing:E,fill:'forwards'});s.animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'})}""", E); fe = seq(pg, T(300))
        else:
            pg.evaluate("""(X)=>{const A=(e,k,o)=>e&&e.animate(k,Object.assign({fill:'forwards',easing:'cubic-bezier(.4,0,.2,1)'},o));
              [document.querySelector('.sobar'),document.querySelector('#sores')].forEach(e=>A(e,[{opacity:1},{opacity:0}],{duration:120}));
              A(document.querySelector('.sopn'),[{opacity:1,transform:window.__B||'none'},{opacity:0,transform:window.__B+'scale(.7)'}],{duration:260,delay:40});
              A(document.querySelector('#home'),[{transform:'scale(.985)',filter:'blur(2px)'},{transform:'none',filter:'blur(0px)'}],{duration:300});
              A(document.querySelector('.sosc'),[{opacity:1},{opacity:0}],{duration:240,delay:60})}""", X); fe = seq(pg, T(300))
        pg.keyboard.press('Escape'); pg.wait_for_timeout(250); pg.evaluate("()=>document.getAnimations().forEach(a=>{try{if(a.effect.getComputedTiming().iterations!==Infinity)a.cancel()}catch(e){}})"); fim = shot(pg, None, 380)
        R[modo] = [q0] + ab + [ab[-1]] * 16 + fe + [fim] * 2; c.close()
      grava('s252_video_site_busca', 'Site · busca: abrir e fechar', R['a'], R['l'])
    # 2 · SITE · sacola: entra pelo lado do ícone (direita) e sai por ele
    if 'sacola' in SO:
      for modo in ('a', 'l'):
        c, pg = site(b); pg.goto('http://localhost:8811/?r=tienda'); pg.wait_for_selector('#grid .card'); pg.wait_for_timeout(2600); q0 = shot(pg, None, 380)
        pg.evaluate("document.querySelector('#bagbtn').click()"); pg.wait_for_timeout(15)
        if modo == 'a': pg.evaluate("(E)=>{document.querySelector('aside.panel').animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:320,easing:E,fill:'both'})}", E)
        else: pg.evaluate("(X)=>{document.querySelector('div.scrim.pg').animate([{transform:'translateX(100%)'},{transform:'none'}],{duration:460,easing:X,fill:'both'})}", X)
        ab = seq(pg, T(520)); pg.evaluate(FASE)
        if modo == 'a': pg.keyboard.press('Escape'); pg.wait_for_timeout(15); fe = seq(pg, T(340))
        else:
            pg.evaluate("()=>{document.querySelector('div.scrim.pg').animate([{transform:'none'},{transform:'translateX(100%)'}],{duration:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'})}"); fe = seq(pg, T(300)); pg.keyboard.press('Escape'); pg.wait_for_timeout(450); fe.append(shot(pg, None, 380))
        R[modo] = [q0] + ab + [ab[-1]] * 16 + fe; c.close()
      grava('s252_video_site_sacola', 'Site · sacola: abrir e fechar', R['a'], R['l'])
    # 3 · SITE · Minha conta: a pílula desliza até a aba e o conteúdo vem do lado dela
    if 'abas' in SO:
      for modo in ('a', 'l'):
        c, pg = site(b, init=LOG); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600); pg.evaluate("document.querySelector('#contabtn').click()"); pg.wait_for_timeout(1500); clip = {'x': 0, 'y': 0, 'width': 390, 'height': 560}; q0 = shot(pg, clip, 380); fr = [q0]
        for de, para in ((0, 1), (1, 3), (3, 0)):
            r0 = pg.evaluate("i=>{const r=document.querySelectorAll('.mct button')[i].getBoundingClientRect(),m=document.querySelector('.mct').getBoundingClientRect();return [r.left-m.left,r.width,r.top-m.top,r.height]}", de)
            pg.evaluate("i=>document.querySelectorAll('.mct button')[i].click()", para); pg.wait_for_timeout(25); pg.evaluate(ZERA, '.panel')
            if modo == 'a': pg.evaluate("(E)=>{const p=document.querySelector('.panel'),m=p.querySelector('.mct');let d=false;[...p.children].forEach(e=>{if(e===m){d=true;return}if(d)e.animate([{opacity:0},{opacity:1}],{duration:200,easing:E,fill:'both'})})}", E)
            else: pg.evaluate("""([X,r0,de,para])=>{const p=document.querySelector('.panel'),m=p.querySelector('.mct'),bs=m.querySelectorAll('button'),n=bs[para],o=bs[de],mr=m.getBoundingClientRect(),nr=n.getBoundingClientRect();
              m.style.position='relative';const pl=document.createElement('i');pl.style.cssText='position:absolute;top:'+r0[2]+'px;height:'+r0[3]+'px;left:0;width:10px;border-radius:999px;background:var(--ac);z-index:0';m.prepend(pl);bs.forEach(x=>{x.style.position='relative';x.style.zIndex=1});n.style.background='transparent';
              pl.animate([{left:r0[0]+'px',width:r0[1]+'px'},{left:(nr.left-mr.left)+'px',width:nr.width+'px'}],{duration:360,easing:X,fill:'both'});
              n.animate([{color:getComputedStyle(o).color},{color:'#fff'}],{duration:200,delay:60,fill:'both'});o.animate([{color:'#fff'},{color:getComputedStyle(o).color}],{duration:160,fill:'both'});
              const s=para>de?1:-1;let d=false;[...p.children].forEach(e=>{if(e===m){d=true;return}if(d)e.animate([{opacity:0,transform:'translateX('+(22*s)+'px)'},{opacity:1,transform:'none'}],{duration:360,easing:X,fill:'both'})})}""", [X, r0, de, para])
            q = [x.crop((0, 0, 380, int(560 * 380 / 390))) for x in seq(pg, T(420), clip)]; fr += q + [q[-1]] * 12; pg.evaluate(FASE)
            if modo == 'l': pg.evaluate("()=>{const i=document.querySelector('.mct > i');i&&i.remove()}")
        R[modo] = fr; c.close()
      grava('s252_video_site_conta_abas', 'Site · Minha conta: Perfil → Endereços → Cartões → Perfil', R['a'], R['l'])
    # 4 · APP · trocar de tela com direção (ir = entra da direita; voltar = entra da esquerda)
    if 'tela' in SO:
      for modo in ('a', 'l'):
        c, pg = app(b); q0 = shot(pg, None, 380); fr = [q0]
        for v_, s in (('caixa', 1), ('inicio', -1), ('estoque', 1)):
            pg.evaluate("v=>window.__LF.setView(v)", v_); pg.wait_for_timeout(25)
            if modo == 'l': pg.evaluate("([v,s,X])=>{const e=document.querySelector('#v-'+v);document.getAnimations().forEach(a=>{if(a.effect.target===e&&!a.__c){a.finish();a.__c=-1}});e.animate([{opacity:0,transform:'translateX('+(30*s)+'px)'},{opacity:1,transform:'none'}],{duration:360,easing:X,fill:'both'})}", [v_, s, X])
            q = seq(pg, T(420)); fr += q + [q[-1]] * 12; pg.evaluate(FASE)
        R[modo] = fr; c.close()
      grava('s252_video_app_troca_tela', 'App · Início → Caixa → Início → Inventário', R['a'], R['l'])
    # 5 · APP · janela: sobe devagar, a tela de trás recua; fechar é o inverso
    if 'janela' in SO:
      for modo in ('a', 'l'):
        c, pg = app(b); pg.evaluate("window.__LF.setView('caixa')"); pg.wait_for_timeout(1400); q0 = shot(pg, None, 380)
        pg.evaluate("document.querySelector('[data-act=cxabre]').click()"); pg.wait_for_timeout(25)
        pg.evaluate("()=>{window.__sh=[];document.getAnimations().forEach(a=>{if(a.animationName==='lfaSUp')window.__sh[0]=a.effect.target;if(a.animationName==='lfaFade')window.__sh[1]=a.effect.target});const s=window.__sh[0],k=window.__sh[1];window.__bg=null;window.__paiInfo=s?[s.parentElement.tagName+'.'+s.parentElement.className,getComputedStyle(s).position,k?getComputedStyle(k).position:'-']:null}")
        if modo == 'a': pg.evaluate("(E)=>document.getAnimations().forEach(a=>{if(/^lfa/.test(a.animationName||''))a.effect.updateTiming({duration:320,easing:E})})", E)
        else: print('   fundo que recua:', pg.evaluate("(X)=>{document.getAnimations().forEach(a=>{if(/^lfa/.test(a.animationName||''))a.effect.updateTiming({duration:460,easing:X})});const [s,k]=window.__sh;if(true&&s&&getComputedStyle(s).position==='fixed'){k&&document.body.appendChild(k);document.body.appendChild(s);window.__bg=document.querySelector('.wrap')}const g=window.__bg;if(g){g.style.transformOrigin='50% 30vh';g.animate([{transform:'none',filter:'brightness(1)'},{transform:'scale(.955)',filter:'brightness(.92)'}],{duration:460,easing:X,fill:'both'})}return (g?g.tagName+'.'+g.className+'#'+g.id:'nenhum')+' | '+window.__paiInfo}", X))
        ab = seq(pg, T(540)); pg.evaluate(FASE)
        if modo == 'a': pg.evaluate("(E)=>{const [s,k]=window.__sh;s.animate([{transform:'none'},{transform:'translateY(105%)'}],{duration:200,easing:E,fill:'forwards'});k&&k.animate([{opacity:1},{opacity:0}],{duration:200,easing:'ease-out',fill:'forwards'})}", E)
        else: pg.evaluate("(X)=>{const [s,k]=window.__sh,g=window.__bg;s.animate([{transform:'none'},{transform:'translateY(105%)'}],{duration:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});k&&k.animate([{opacity:1},{opacity:0}],{duration:300,easing:'ease-out',fill:'forwards'});g&&g.animate([{transform:'scale(.955)',filter:'brightness(.92)'},{transform:'none',filter:'brightness(1)'}],{duration:340,easing:X,fill:'forwards'})}", X)
        fe = seq(pg, T(360)); pg.evaluate("document.querySelector('[data-act=cxfecha]').click()"); pg.wait_for_timeout(200); pg.evaluate("()=>{const g=window.__bg;g&&g.getAnimations().forEach(a=>a.cancel())}"); fe.append(shot(pg, None, 380))
        R[modo] = [q0] + ab + [ab[-1]] * 16 + fe; c.close()
      grava('s252_video_app_janela', 'App · Caixa · + Novo objetivo: abrir e fechar', R['a'], R['l'])
finally: srv.terminate()
