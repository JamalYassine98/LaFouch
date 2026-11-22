"""IDEIAS 05 · mede as animações de abrir/fechar do menu, carrinho e busca no site (cópia do ar em :8721).
Para cada uma: o que anima, de onde para onde, quanto tempo, que curva, o fundo, e onde ficam o topo e o botão.
Uso: python3 mede.py → anim.json"""
import os, sys, json
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
sys.path.insert(0, '/home/claude/lafouch/work/kit'); sys.path.insert(0, '/home/claude/lafouch/work/ideias/03-bugs-site')
from playwright.sync_api import sync_playwright
import sim
from abas_video import INIT, rota
U = 'http://localhost:8721'
PEGA = r"""()=>{const L=[];for(const a of document.getAnimations()){const e=a.effect,t=e&&e.target;if(!t)continue;const T=e.getTiming?e.getTiming():{};const k=e.getKeyframes?e.getKeyframes():[];
 const nome=t.id?('#'+t.id):(t.tagName+'.'+(typeof t.className==='string'?t.className.split(' ').slice(0,2).join('.'):''));
 L.push({alvo:nome,tipo:a.constructor.name,nome:a.animationName||a.transitionProperty||'',dur:T.duration,atraso:T.delay,curva:T.easing||'',
  de:k.length?Object.fromEntries(Object.entries(k[0]).filter(([x])=>!/offset|computedOffset|composite/.test(x))):null,
  para:k.length?Object.fromEntries(Object.entries(k[k.length-1]).filter(([x])=>!/offset|computedOffset|composite/.test(x))):null})}return L}"""
ACOES = {'menu': ("document.getElementById('mnb').click()", "history.back()"),
         'carrinho': ("document.getElementById('bagbtn').click()", "history.back()"),
         'busca': ("document.getElementById('sbtn').click()", "history.back()")}
out = {}
with sync_playwright() as pw:
    b = sim.navegador(pw)
    for W, H, toque, ap in ((390, 844, True, 'celular'), (1128, 900, False, 'PC')):
        for nome, (abre, fecha) in ACOES.items():
            c = sim.contexto(b, W, H, toque=toque, dpr=1, lingua='pt-BR', movimento=True); c.add_init_script(INIT); c.add_init_script("localStorage.setItem('lf_cart',JSON.stringify({c:{'AC1050':1},o:{}}))"); c.route('**/*', rota); pg = c.new_page()
            pg.goto(U + '/?cliente=1'); pg.wait_for_timeout(2500)
            btn = pg.evaluate("s=>{const e=document.getElementById(s);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.width)]}", {'menu': 'mnb', 'carrinho': 'bagbtn', 'busca': 'sbtn'}[nome])
            pg.evaluate(abre); pg.wait_for_timeout(30); a1 = pg.evaluate(PEGA); pg.wait_for_timeout(900)
            topo = pg.evaluate("()=>{const t=document.querySelector('.top').getBoundingClientRect();return Math.round(t.top)}")
            pain = pg.evaluate("""()=>{const c=[document.getElementById('drw'),document.querySelector('#layer .scrim'),document.getElementById('sov')].filter(e=>e&&e.offsetParent!==null||e&&getComputedStyle(e).position==='fixed'&&e.getBoundingClientRect().width>0);
              return c.map(e=>{const r=e.getBoundingClientRect();return [e.id||e.className,Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]})}""")
            pg.keyboard.press('Escape'); pg.wait_for_timeout(30); a2 = pg.evaluate(PEGA); pg.wait_for_timeout(900)
            out['%s %s' % (ap, nome)] = {'botao(x,y,larg)': btn, 'abrir': a1, 'aberto: topo y': topo, 'paineis': pain, 'fechar': a2}
            c.close()
    b.close()
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'anim.json'), 'w'), ensure_ascii=False, indent=1)
for k, v in out.items():
    print('==', k, 'botão', v['botao(x,y,larg)'], '| topo aberto y', v['aberto: topo y'])
    for f in ('abrir', 'fechar'):
        for a in v[f]: print('   ', f, a['alvo'], a['nome'], a['dur'], a['curva'], 'de', a['de'], '→', a['para'])
