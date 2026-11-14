# S247 · botões no padrão aprovado (fio neutro + só texto, com "afundar", claro e escuro) e animações a alterar/adicionar (quadros lado a lado).  python3 gera.py
import os, subprocess, sys, time
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
OLHO = open(A + '../kit/olho.js').read()
s41 = open(A + '../s241/gera.py').read(); j = s41.index('CSS = """') + 9; C241 = s41[j: s41.index('"""', j)]
PRI = ".view .mini:not(.ghost),.view .btn-sc.p,.view #btnAdd"; SEC = ".view .gBtn"; E = "cubic-bezier(.2,.8,.2,1)"
def lista(sel, suf): return ','.join(x + suf for x in sel.split(','))
BOT = C241 + PRI + "{background:transparent!important;color:var(--fg,inherit)!important;-webkit-text-fill-color:currentColor;border:1px solid color-mix(in srgb,currentColor 28%,transparent)!important;border-radius:999px!important;box-shadow:none!important;font-weight:600!important}" \
    + SEC + "{background:transparent!important;color:var(--fg,inherit)!important;-webkit-text-fill-color:currentColor;border:0!important;box-shadow:none!important;font-weight:600!important;border-radius:999px!important}" \
    + PRI + "," + SEC + "{transition:transform .08s ease-out,background-color .08s ease-out!important}" \
    + lista(PRI + "," + SEC, ":active") + "{transform:scale(.96)!important;background:color-mix(in srgb,currentColor 12%,transparent)!important}"
CONG = "t=>document.getAnimations().forEach(a=>{const c=a.effect&&a.effect.getComputedTiming();if(!c||c.iterations===Infinity||c.duration>3000)return;if(!a.__c){if(a.playState!=='running')return;a.__c=1}a.pause();a.currentTime=t})"
rota = lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def shot(pg, clip=None, larg=None):
    pg.screenshot(path='/tmp/s247.png', **({'clip': clip} if clip else {})); x = Image.open('/tmp/s247.png').convert('RGB')
    return x.resize((larg, int(x.height * larg / x.width))) if larg else x
def folha(arq, tit, sub, linhas, gap=14):
    # linhas = [(rótulo, cor, [(legenda, imagem), ...])]
    W = max(sum(i.width + gap for _, i in q) for _, _, q in linhas) + 80 - gap; H = 150 + sum(max(i.height for _, i in q) + 96 for _, _, q in linhas)
    B = Image.new('RGB', (W, H), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 26), tit, font=F(32, 1), fill='#2a1a28'); d.text((40, 76), sub, font=F(20), fill='#5b4a57'); y = 132
    for rot, cor, q in linhas:
        d.text((40, y), rot, font=F(24, 1), fill=cor); x = 40; h = max(i.height for _, i in q)
        for leg, im in q:
            B.paste(im, (x, y + 38)); d.rectangle((x - 1, y + 37, x + im.width, y + 38 + im.height), outline='#c9bcc5'); d.text((x, y + 44 + im.height), leg, font=F(18), fill='#5b4a57'); x += im.width + gap
        y += h + 96
    B.save(A + arq + '.jpg', quality=88); print('ok', arq, B.size, flush=True)
V, G = '#b42318', '#1f8a4c'
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8835', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
def app(b, sc='light', css=None, W=390, H=844):
    c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=1.5 if W < 900 else 1, color_scheme=sc, is_mobile=W < 700, has_touch=W < 700, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', rota)
    pg = c.new_page(); pg.goto('http://localhost:8835/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(700)
    if css: pg.add_style_tag(content=css)
    return c, pg
def site(b, W=390, H=844, init=''):
    c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=1, is_mobile=W < 700, has_touch=W < 700, locale='es-PY', service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1');" + init + "}catch(e){}"); c.route('**/*', rota)
    return c, c.new_page()
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    # 1-2 · BOTÕES (repouso × apertado, claro e escuro)
    for v, nome, clip, alvo in (('estoque', 'Inventário', {'x': 0, 'y': 100, 'width': 390, 'height': 92}, '#btnAdd'), ('inicio', 'Início · Guardião', {'x': 0, 'y': 170, 'width': 390, 'height': 150}, '.gBtn')):
        L = []; ol = {}
        for sc, tn in (('light', 'claro'), ('dark', 'escuro')):
            for modo, css in (('HOJE', None), ('PROPOSTA', BOT)):
                c, pg = app(b, sc, css); pg.evaluate("v=>window.__LF.setView(v)", v); pg.wait_for_timeout(1000)
                ol[tn, modo] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}
                r0 = shot(pg, clip); bx = pg.locator('.view:not([hidden]) ' + alvo).first.bounding_box()
                pg.mouse.move(bx['x'] + bx['width'] / 2, bx['y'] + bx['height'] / 2); pg.mouse.down(); pg.wait_for_timeout(260); r1 = shot(pg, clip); c.close()
                L.append(('%s · %s' % (modo, tn), V if modo == 'HOJE' else G, [('repouso', r0), ('dedo apertando', r1)]))
        print(v, 'pioras olho:', [(t, r, ol[t, 'HOJE'].get(r, 0), n) for t in ('claro', 'escuro') for r, n in ol[t, 'PROPOSTA'].items() if n > ol[t, 'HOJE'].get(r, 0)])
        folha('s247_app_botoes_' + v, 'App · %s · botões' % nome, 'Ação principal = fio cinza fino · ação dentro de lista = só texto · sem vinho · afunda ao toque', L)
    # 3 · SITE · Minha conta: trocar de aba
    LOG = "localStorage.setItem('lf_auth',JSON.stringify({uid:'t1',email:'ana@exemplo.com',gn:'Ana'}));localStorage.setItem('lf_conta',JSON.stringify({nome:'Ana Teste',email:'ana@exemplo.com',ts:Date.now(),ends:[{id:'e1',nome:'Casa',cidade:'Asunción',dep:'Central',end:'Av. España 123',ref:''}]}))"
    L = []
    for modo in ('HOJE', 'PROPOSTA'):
        c, pg = site(b, init=LOG); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600); pg.evaluate("document.querySelector('#contabtn').click()"); pg.wait_for_timeout(1500)
        pg.evaluate("document.querySelectorAll('.mct button')[1].click()"); pg.wait_for_timeout(30)
        if modo == 'PROPOSTA': pg.evaluate("""()=>{const p=document.querySelector('.panel'),m=p.querySelector('.mct');document.getAnimations().forEach(a=>{const t=a.effect&&a.effect.target;if(t&&(t===p||p.contains(t))&&a.effect.getComputedTiming().iterations!==Infinity)a.finish()});let d=false;[...p.children].forEach(e=>{if(e===m){d=true;return}if(d)e.animate([{opacity:0},{opacity:1}],{duration:200,easing:'%s',fill:'both'})})}""" % E)
        q = []
        for t in (0, 90, 180, 300, 420):
            pg.evaluate(CONG, t); pg.wait_for_timeout(40); q.append(('%d ms' % t, shot(pg, larg=250)))
        L.append((modo + (' · a janela inteira some e sobe de novo, abas incluídas' if modo == 'HOJE' else ' · janela e abas paradas; só o conteúdo de baixo troca (0,2 s)'), V if modo == 'HOJE' else G, q)); c.close()
    folha('s247_site_conta_abas', 'Site · Minha conta · trocar de aba (Perfil → Endereços)', 'Quadro a quadro depois do toque na aba', L)
    # 4 · SITE PC · passar o mouse na peça
    L = []; HOV = "#grid .card:hover{transform:none!important;box-shadow:0 8px 22px color-mix(in srgb,var(--tx) 10%%,transparent)!important}#grid .card .pf{transition:transform .48s %s!important}#grid .card:hover .pf{transform:scale(1.035)!important}#grid .card{transition:box-shadow .32s %s!important}" % (E, E)
    for modo in ('HOJE', 'PROPOSTA'):
        c, pg = site(b, 1440, 900); pg.goto('http://localhost:8811/?r=tienda'); pg.wait_for_selector('#grid .card'); pg.wait_for_timeout(2600)
        if modo == 'PROPOSTA': pg.add_style_tag(content=HOV)
        bx = pg.evaluate("()=>{const r=document.querySelectorAll('#grid .card')[1].getBoundingClientRect();return [r.x,r.y,r.width,r.height]}"); clip = {'x': max(0, bx[0] - bx[2] - 30), 'y': max(0, bx[1] - 40), 'width': bx[2] * 3 + 80, 'height': min(900 - max(0, bx[1] - 40), bx[3] + 80)}
        q = [('antes', shot(pg, clip, 560))]; pg.mouse.move(bx[0] + bx[2] / 2, bx[1] + bx[3] / 2); pg.wait_for_timeout(40)
        for t in (120, 480):
            pg.evaluate(CONG, t); pg.wait_for_timeout(40); q.append(('%d ms com o mouse em cima' % t, shot(pg, clip, 560)))
        L.append((modo + (' · o cartão sobe 6 px, sombra pesada, foto cresce 6% (0,35 s)' if modo == 'HOJE' else ' · o cartão fica no lugar; a foto cresce 3,5% devagar (0,48 s); sombra leve'), V if modo == 'HOJE' else G, q)); c.close()
    folha('s247_site_pc_mouse_na_peca', 'Site · computador · mouse em cima da peça do meio', 'Hoje em cima, proposta embaixo', L)
    # 5 · APP · abrir o Caixa
    L = []
    for modo in ('HOJE', 'PROPOSTA'):
        c, pg = app(b); pg.evaluate("window.__LF.setView('caixa')"); pg.wait_for_timeout(40)
        if modo == 'PROPOSTA': pg.evaluate("""()=>{const v=document.querySelector('#v-caixa');document.getAnimations().forEach(a=>{const t=a.effect&&a.effect.target;if(t&&(t===v||v.contains(t))&&a.effect.getComputedTiming().iterations!==Infinity)a.finish()});v.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:200,easing:'%s',fill:'both'});const b=v.querySelector('.cxTot b');window.__tot=b.textContent}""" % E)
        q = []
        for t in (0, 100, 200, 350, 500):
            pg.evaluate(CONG, t)
            if modo == 'PROPOSTA': pg.evaluate("t=>{const b=document.querySelector('#v-caixa .cxTot b'),n=+window.__tot.replace(/\\D/g,''),k=Math.min(1,t/480),e=1-Math.pow(1-k,3);b.textContent='G$ '+Math.round(n*e).toLocaleString('de-DE')}", t)
            pg.wait_for_timeout(40); q.append(('%d ms' % t, shot(pg, larg=250)))
        L.append((modo + (' · a tela sobe e, por cima, cada bloco sobe de novo (2 movimentos, 0,56 s)' if modo == 'HOJE' else ' · 1 movimento só (0,2 s) e o total conta até o valor (0,48 s)'), V if modo == 'HOJE' else G, q)); c.close()
    folha('s247_app_abrir_caixa', 'App · abrir o Caixa', 'Quadro a quadro depois do toque em Caixa', L)
finally: srv.terminate()
