"""IDEIAS 05 · vídeo Hoje × Proposta das animações do menu, busca e carrinho (celular 390).
Hoje = cópia do site do ar (/tmp/b5h, :8721). Proposta = mesma cópia com o movimento PINTADO (/tmp/a5p :8723 topo A,
/tmp/a5q :8724 topo B). A pintura troca as 3 animações por UMA regra: a camada cresce do botão tocado e volta para ele,
o fundo recua e desfoca, o topo fica sempre parado à vista. Topo B = ☰ e lupa à esquerda, conta e sacola à direita.
Uso: python3 video.py copias  →  (subir servidores em comando separado)  →  python3 video.py"""
import os, sys, json, time, base64, shutil, subprocess
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
sys.path.insert(0, '/home/claude/lafouch/work/kit'); sys.path.insert(0, '/home/claude/lafouch/work/ideias/03-bugs-site')
from playwright.sync_api import sync_playwright
import sim
from abas_video import INIT, rota
AQUI = os.path.dirname(os.path.abspath(__file__))
SRC = '/home/claude/catalogo'

PINTA = r"""
/* PINTURA (só no esboço) · uma regra de movimento para menu, busca e carrinho */
(function(){
 var ABRE=420,FECHA=280,CURVA='cubic-bezier(.16,1,.3,1)',ORIG=null,A=Element.prototype.animate;
 var st=document.createElement('style');st.textContent=
  ':root{--lfTopo:0px}'+
  '#drw{top:var(--lfTopo)!important;transition:visibility 0s linear .3s!important}#drw.on{transition:visibility 0s!important}'+
  '#drw .dpn{transition:none!important;transform:none!important}#drw .dsc{display:none!important}'+
  '#sov{top:var(--lfTopo)!important}#sov .sosc{display:none!important}'+
  '#sov .sopn{animation:none!important;transform:none!important;left:12px!important;right:12px!important;width:auto!important;top:12px!important}'+
  '#__fundo{position:fixed;left:0;right:0;bottom:0;top:var(--lfTopo);background:rgba(18,8,14,.22);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);opacity:0;pointer-events:none}'+
  'html.lock>body:not(#__x){overflow:visible!important}';
 document.head.appendChild(st);
 var fundo=document.createElement('div');fundo.id='__fundo';document.body.appendChild(fundo);
 document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('#mnb,#sbtn,#bagbtn');if(b)ORIG=b},true);
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#mnb,#sbtn,#bagbtn');if(b)ORIG=b},true);
 function topo(){var t=document.querySelector('.top').getBoundingClientRect();document.documentElement.style.setProperty('--lfTopo',Math.max(0,t.bottom)+'px')}
 function cresce(el,abre,z){
  var b=(ORIG||document.getElementById('mnb')).getBoundingClientRect(),p=el.getBoundingClientRect();
  el.style.transformOrigin=(b.left+b.width/2-p.left)+'px '+(b.top+b.height/2-p.top)+'px';
  var k=[{scale:'.4',opacity:0,borderRadius:'28px'},{scale:'1',opacity:1,borderRadius:getComputedStyle(el).borderRadius}];if(!abre)k.reverse();
  el.getAnimations().forEach(function(a){a.cancel()});fundo.getAnimations().forEach(function(a){a.cancel()});
  var o={duration:abre?ABRE:FECHA,easing:CURVA,fill:abre?'none':'forwards'};
  fundo.style.zIndex=z;A.call(fundo,[{opacity:abre?0:1},{opacity:abre?1:0}],{duration:o.duration,easing:CURVA,fill:'forwards'});
  var h=document.getElementById('home');if(h)A.call(h,[{scale:abre?'1':'.97'},{scale:abre?'.97':'1'}],{duration:o.duration,easing:CURVA,fill:'forwards'});
  return A.call(el,k,o)}
 Element.prototype.animate=function(k,o){
  var el=this,f=Array.isArray(k)?k[k.length-1]:{};
  if(el.matches&&el.matches('#sov .sopn,#layer>.scrim.pg')){
   var abre=!(/100%/.test(f.transform||'')||String(f.opacity)==='0');if(abre)topo();
   return cresce(el,abre,el.matches('.sopn')?79:31)}
  if(el.id==='home'||el.matches&&el.matches('.sosc'))return A.call(el,[{},{}],{duration:1});
  if(el.closest&&el.closest('#drw .dpn,#sov .sopn')){o=Object.assign({},typeof o==='number'?{duration:o}:o||{},{duration:1,delay:0})}
  return A.call(el,k,o)};
 var d=document.getElementById('drw'),era=false;
 new MutationObserver(function(){var on=d.classList.contains('on');if(on===era)return;era=on;if(on)topo();cresce(d.querySelector('.dpn'),on,59)}).observe(d,{attributes:true,attributeFilter:['class']});
})();
"""
TOPO_B = "\n/* PINTURA · topo B: ☰ e lupa à esquerda, conta e sacola à direita */\n(function(){var s=document.createElement('style');s.textContent='@media (max-width:899px){html.v5 body .top .bar>#mnb{order:1!important}html.v5 body .top .bar>#sbtn{order:2!important}html.v5 body .top .bar>.logo{order:3!important}html.v5 body .top .bar>#contabtn{order:4!important}html.v5 body .top .bar>#bagbtn{order:5!important}}}';document.head.appendChild(s)})();\n"

def copia(dst, extra):
    shutil.rmtree(dst, ignore_errors=True); shutil.copytree(SRC, dst, ignore=shutil.ignore_patterns('.git'))
    p = dst + '/js/lf-site.js'; open(p, 'a').write(extra)

def grava(nome, porta, W=390, H=844):
    pasta = '/tmp/va5-%s' % nome; shutil.rmtree(pasta, ignore_errors=True); os.makedirs(pasta)
    with sync_playwright() as pw:
        b = sim.navegador(pw); c = sim.contexto(b, W, H, toque=True, dpr=2, lingua='pt-BR')
        c.add_init_script(INIT); c.route('**/*', rota); pg = c.new_page()
        cdp = c.new_cdp_session(pg); Q = []
        def q(ev): Q.append((ev['metadata']['timestamp'], ev['data'])); cdp.send('Page.screencastFrameAck', {'sessionId': ev['sessionId']})
        cdp.on('Page.screencastFrame', q)
        pg.goto('http://localhost:%d/?cliente=1' % porta); pg.wait_for_timeout(3000)
        cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 88, 'maxWidth': W * 2, 'maxHeight': H * 2})
        pg.wait_for_timeout(600)
        for sel in ('#mnb', '#sbtn', '#bagbtn'):
            pg.tap(sel); pg.wait_for_timeout(1300)
            pg.keyboard.press('Escape') if sel != '#bagbtn' else pg.evaluate("history.back()")
            pg.wait_for_timeout(900)
        pg.evaluate("window.scrollTo({top:700,behavior:'instant'})"); pg.wait_for_timeout(700)
        pg.tap('#mnb'); pg.wait_for_timeout(1400); pg.keyboard.press('Escape'); pg.wait_for_timeout(900)
        cdp.send('Page.stopScreencast')
        for sel, f in (('#mnb', 'menu'), ('#sbtn', 'busca')):
            pg.tap(sel); pg.wait_for_timeout(1200); pg.screenshot(path='%s/%s.png' % (AQUI, '%s-%s' % (nome, f))); pg.keyboard.press('Escape'); pg.wait_for_timeout(800)
        pg.evaluate("window.scrollTo({top:0,behavior:'instant'})"); pg.wait_for_timeout(400)
        pg.screenshot(path='%s/%s-topo.png' % (AQUI, nome), clip={'x': 0, 'y': 0, 'width': W, 'height': 108})
        c.close(); b.close()
    L = []
    for i, (ts, d) in enumerate(Q):
        fn = '%s/q%05d.jpg' % (pasta, i); open(fn, 'wb').write(base64.b64decode(d)); L.append((ts, fn))
    with open(pasta + '/l.txt', 'w') as f:
        for i, (ts, fn) in enumerate(L):
            f.write("file '%s'\nduration %.4f\n" % (fn, (L[i + 1][0] - ts) if i + 1 < len(L) else 1.0))
        f.write("file '%s'\n" % L[-1][1])
    out = pasta + '/v.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', pasta + '/l.txt', '-vf', 'scale=780:1688,fps=30',
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], check=True)
    return out

if __name__ == '__main__':
    if 'copias' in sys.argv:
        copia('/tmp/a5p', PINTA); copia('/tmp/a5q', PINTA + TOPO_B); raise SystemExit
    FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    lab = lambda t, c: "pad=iw:ih+80:0:80:color=white,drawtext=fontfile=%s:text='%s':x=24:y=20:fontsize=40:fontcolor=%s" % (FT, t, c)
    v = [grava('hoje', 8721), grava('prop-a', 8723), grava('prop-b', 8724)]
    rot = [('HOJE', '#b3261e'), ('PROPOSTA · topo A', '#8d3a69'), ('PROPOSTA · topo B', '#8d3a69')]
    fc = ';'.join('[%d:v]%s,tpad=stop_mode=clone:stop_duration=4[v%d]' % (i, lab(*rot[i]), i) for i in range(3)) + ';[v0][v1][v2]hstack=inputs=3,scale=1560:-2[v]'
    args = ['ffmpeg', '-y', '-loglevel', 'error'] + sum([['-i', x] for x in v], []) + ['-filter_complex', fc, '-map', '[v]', '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', os.path.join(AQUI, 'esboco-05-animacoes.mp4')]
    subprocess.run(args, check=True); print('ok')
