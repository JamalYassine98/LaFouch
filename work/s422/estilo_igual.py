# S422 · prova da limpeza: o ESTILO FINAL de todo elemento visível é idêntico antes × depois, em todas as telas do passeio.
# python3 estilo_igual.py <pasta_antes> <pasta_depois>   (as duas recebem as mesmas 20 peças de teste)
import sys, os, json, shutil, subprocess, time
sys.path.insert(0, '/home/claude/lafouch/work/testes'); import base
from playwright.sync_api import sync_playwright
FIX = open('/home/claude/lafouch/work/kit/pecas-teste.js', encoding='utf8').read()
def copia(de, para):
    shutil.rmtree(para, ignore_errors=True); shutil.copytree(de, para, ignore=shutil.ignore_patterns('.git'))
    f = para + '/js/lf-site.js'; s = open(f, encoding='utf8').read()
    if 'var P=[];' in s: s = s.replace('var P=[];', FIX, 1); open(f, 'w', encoding='utf8').write(s)
A, B = '/tmp/est_a', '/tmp/est_b'; copia(sys.argv[1], A); copia(sys.argv[2], B)
SRV = '/home/claude/lafouch/work/s415/srv.py'
S = [subprocess.Popen([sys.executable, SRV, p, d], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) for p, d in (('8993', A), ('8994', B))]; time.sleep(1.2)
CONTA = json.dumps({'nome': 'Maria González', 'email': 'm@e.com', 'tel': '+595 983 000 000', 'nac': 'py', 'doc': '1234567', 'ends': [{'nome': 'Casa', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Calle 1', 'ref': ''}]})
AUTH = json.dumps({'uid': 'kit', 'idToken': 'kit', 'refresh': 'kit', 'exp': 9e15, 'ev': True, 'email': 'm@e.com'})
P = ['display', 'position', 'color', 'background-color', 'background-image', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'text-transform',
     'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'border-top-width', 'border-top-color', 'border-radius',
     'box-shadow', 'opacity', 'transform', 'z-index', 'gap', 'justify-content', 'align-items', 'flex-direction', 'grid-template-columns', 'width', 'height', 'overflow', 'visibility', 'zoom', 'filter', 'white-space', 'object-fit']
J = """(P)=>{const L=[];const all=document.querySelectorAll('body *');let i=0;for(const e of all){i++;const r=e.getBoundingClientRect();const c=getComputedStyle(e);if(c.display==='none'||!e.getClientRects().length)continue;
 if(e.closest('.evfx,#lfmed,.hdkb,#gw svg,.gzm,#stage,.relm,.hdots'))continue;const k=e.tagName+(e.id?'#'+e.id:'')+'.'+[...e.classList].filter(x=>!/^(on|go|in|vis|ld)$/.test(x)).slice(0,3).join('.');
 L.push(k+'|'+Math.round(r.left)+','+Math.round(r.top+scrollY)+','+Math.round(r.width)+','+Math.round(r.height)+'|'+P.map(p=>c.getPropertyValue(p)).join(';').replace(/localhost:\\d+/g,'L'))}return L}"""
EST = [('inicio', '/', ''), ('carrinho', '/', '#bagbtn'), ('conta', '/', '#contabtn'), ('menu', '/', '#mnb'), ('busca', '/', '#sbtn'), ('catalogo', '/?r=armacoes', ''), ('filtros', '/?r=armacoes', '#fbtn'),
       ('peca', '/', '[data-open]'), ('atacado', '/#atacado', ''), ('duvidas', '/#duvidas', ''), ('como', '/#como', ''), ('mochi', '/', 'GZ')]
dif = {}
with sync_playwright() as p:
    for W, H, lang, ev, zi in ((390, 844, 'pt-BR', '', '0'), (390, 844, 'es-PY', 'natal', '2'), (820, 1180, 'pt-BR', 'bf', '1'), (1440, 900, 'es-PY', 'halloween', '0'), (2560, 1440, 'pt-BR', 'anonovo', '2')):
        for nome, rota, cl in EST:
            R = []
            for porta in (8993, 8994):
                ls = {'lf_conta': CONTA, 'lf_auth': AUTH, 'lf_zoom': zi, 'lf_lang': 'es' if lang.startswith('es') else 'pt'}
                if ev: ls['lf_cfg'] = json.dumps({'evento': {'tema': ev, 'ini': 0, 'fim': 0}})
                b, pg, er = base.abre(p, lang=lang, W=W, H=H, ls=ls)
                pg.context.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg.add_init_script("addEventListener('DOMContentLoaded',()=>{const st=document.createElement('style');st.textContent='*,*::before,*::after{animation:none!important;transition:none!important}';document.head.appendChild(st)});Math.random=()=>0.42;sessionStorage.setItem('lf_ni','1');document.documentElement.classList.add('kitnoanim')")
                pg.clock.install(time=1795000000000)
                pg.goto('http://localhost:%d%s' % (porta, rota)); pg.clock.run_for(3000); pg.wait_for_timeout(500)
                try:
                    if cl == 'GZ': pg.evaluate("window.__lfGzAbre&&window.__lfGzAbre()")
                    elif cl: pg.evaluate("s=>{const e=document.querySelector(s);e&&e.click()}", cl)
                except Exception: pass
                pg.clock.run_for(4000); pg.wait_for_timeout(400)
                pg.evaluate("()=>document.getAnimations().forEach(a=>{try{if(a.effect&&a.effect.getComputedTiming().endTime===Infinity)a.cancel();else a.finish()}catch(e){try{a.cancel()}catch(_){}}})"); pg.wait_for_timeout(150)
                R.append(pg.evaluate(J, P)); b.close()
            a, bb = R
            if a != bb:
                import difflib
                d = [x for x in difflib.unified_diff(a, bb, lineterm='', n=0) if x[:1] in '+-' and not x.startswith(('+++', '---'))]
                dif['%s %d %s %s' % (nome, W, lang[:2], ev)] = d[:12]
            print(nome, W, lang[:2], ev or '-', 'IGUAL' if a == bb else 'DIFERENTE (%d linhas)' % len([x for x in d]), flush=True)
for s in S: s.kill()
json.dump(dif, open('/tmp/estilo_dif.json', 'w'), ensure_ascii=False, indent=1)
print('telas diferentes:', len(dif))
