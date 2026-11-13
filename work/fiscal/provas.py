# Provas de uso do site lafouch.com (fiscal, partes 1-6 aprovadas em S111, 10/11/2026)
# uso: python3 provas.py <porta> <saida_dir> [rapido]
#   1 visual+toque (rolagem com dedo, com teclado)  2 navegação (logo, voltar, Esc, "‹ Início", menu/busca/carrinho por cima)
#   3 uso de verdade (busca de cada produto de cada seção, filtros de grau, carrinho, consulta)  4 conteúdo (repetido, PT no ES,
#   foto quebrada, preço diferente, moeda)  5 situações difíceis (erros no console, 4G fraco, sem internet, segundo plano, girar)
#   6 bug nunca volta (regressoes: cada bug do dono vira prova fixa)
# Resultado: <saida>/provas.json  e  <saida>/p/*.png (foto de cada falha)
import sys, os, json, time, re, traceback
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'testes'))
from base import INIT
from playwright.sync_api import sync_playwright

PORTA = int(sys.argv[1]); OUT = sys.argv[2]; RAPIDO = len(sys.argv) > 3 and sys.argv[3] == 'rapido'
URL = f'http://localhost:{PORTA}/'
os.makedirs(os.path.join(OUT, 'p'), exist_ok=True)
RES = []; NF = [0]

# ---------- utilidades ----------
ESTADO = """(()=>{const H=document.documentElement,q=s=>document.querySelector(s),ly=q('#layer'),A=[];
 if(q('#gw'))A.push('consulta');[...document.querySelectorAll('.sec.pop')].forEach(e=>A.push('painel:'+e.id));
 if(ly&&ly.innerHTML.trim())A.push(/^\\/p\\//.test(location.pathname)?'produto':'camada');
 ['fsh','fvs','dsh','vcs'].forEach(id=>{const d=q('#'+id);if(d&&d.classList.contains('on'))A.push(id)});
 return {abertos:A,menu:!!(q('#drw')&&q('#drw').classList.contains('on')),busca:!!(q('#sov')&&q('#sov').classList.contains('on')),
  lock:H.classList.contains('lock'),y:Math.round(scrollY),path:location.pathname}})()"""

def novo(p, W=390, H=844, lang='pt-BR', ls=None, touch=True):
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
    c = b.new_context(bypass_csp=True, locale=lang, viewport={'width': W, 'height': H}, device_scale_factor=1, has_touch=touch, is_mobile=touch and W < 700, permissions=['camera'])
    L = dict(ls or {}); L.setdefault('lf_lang', 'es' if lang.startswith('es') else 'pt')
    c.add_init_script('(()=>{if(!/^http/.test(location.protocol))return;' + ''.join(f'localStorage.setItem({k!r},{v!r});' for k, v in L.items()) + '})()')
    c.add_init_script('if(/^http/.test(location.protocol)){' + INIT + '}'); c.add_init_script("window.open=function(u){window.__wo=u;return null}")
    pg = c.new_page(); erros = []
    pg.on('pageerror', lambda e: erros.append('erro: ' + str(e)[:200]))
    pg.on('console', lambda m: erros.append('console: ' + m.text[:200]) if m.type == 'error' and 'favicon' not in m.text and 'Failed to load resource' not in m.text else None)
    return b, c, pg, erros

def carrega(pg, rota=''):
    pg.goto('about:blank'); pg.goto(URL + rota); pg.wait_for_timeout(2200)

def est(pg): return pg.evaluate(ESTADO)
def fora(e): return not e['abertos'] and not e['menu'] and not e['busca'] and not e['lock']
def inicio(e): return not e['abertos'] and not e['menu'] and not e['busca'] and e['y'] <= 2 and not e['lock']
def mesmo(a, b): return a['abertos'] == b['abertos'] and a['menu'] == b['menu'] and a['busca'] == b['busca']
def txt(e):
    if inicio(e): return 'Início'
    t = ', '.join(e['abertos']) or 'página'
    if e['menu']: t += ' + menu'
    if e['busca']: t += ' + busca'
    return t

def falha(parte, nome, d, pg=None, grave=True):
    f = None
    if pg is not None:
        try: NF[0] += 1; f = f'p/{os.environ.get("FISCAL_SUF", "")}{NF[0]:04d}.png'; pg.screenshot(path=os.path.join(OUT, f))
        except Exception: f = None
    RES.append({'parte': parte, 'nome': nome, 'ok': False, 'grave': grave, 'd': d, 'foto': f}); print('  FALHA', parte, nome, '·', d)

def passou(parte, nome, d=''): RES.append({'parte': parte, 'nome': nome, 'ok': True, 'd': d})

def prova(parte, nome, fn, *a):
    try: fn(*a)
    except Exception as ex:
        falha(parte, nome, 'a prova travou: ' + str(ex).split('\n')[0][:160])

def menu(pg, sel):
    pg.click('#mnb'); pg.wait_for_timeout(650); pg.click('#drw ' + sel); pg.wait_for_timeout(1500)

def topo_em(pg, sel):
    return pg.evaluate("""s=>{const e=document.querySelector(s);if(!e)return false;const r=e.getBoundingClientRect();if(!r.width)return false;
      const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return !!t&&(t===e||e.contains(t))}""", sel)

def clica_real(pg, sel):
    r = pg.evaluate("s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}", sel)
    if not r: return False
    pg.mouse.click(r[0], r[1]); return True

def arrasta(c, pg, x, y0, y1, n=10):
    cdp = c.new_cdp_session(pg)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y0}]})
    for i in range(1, n + 1):
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y0 + (y1 - y0) * i / n}]}); time.sleep(.016)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); pg.wait_for_timeout(450)

# ---------- telas: como abrir cada uma (a partir do Início) ----------
def a_cat(t):
    # como a maioria entra: pelos atalhos do Início; sem atalho, pelo menu
    def f(pg):
        if pg.evaluate("t=>{const a=[...document.querySelectorAll('a[data-mf=\"tipo:'+t+'\"]')].find(e=>e.offsetParent&&!e.closest('#drw'));if(a){a.scrollIntoView({block:'center'});return true}return false}", t):
            pg.locator(f'a[data-mf="tipo:{t}"]:not(#drw *):visible').first.click(); pg.wait_for_timeout(1500)
        else: menu(pg, f'a[data-mf="tipo:{t}"]')
    return f
def a_prod(pg): a_cat('grau')(pg); pg.locator('#grid [data-open]:visible').first.click(); pg.wait_for_timeout(1700)
def a_prod_ini(pg): pg.locator('[data-open]:visible').first.click(); pg.wait_for_timeout(1700)
def a_cons(pg): menu(pg, '[data-gzopen]'); pg.wait_for_timeout(600)
def a_filtro(pg): a_cat('grau')(pg); pg.click('#fbtn'); pg.wait_for_timeout(900)
TELAS = [
    ('Catálogo Solar', a_cat('solar'), False), ('Catálogo Leitura', a_cat('grau'), False), ('Catálogo Armações', a_cat('armacao'), False),
    ('Catálogo Ofertas', a_cat('of'), False), ('Catálogo Feminino', lambda pg: menu(pg, 'a[data-mf="gen:f"]'), False),
    ('Produto (do catálogo)', a_prod, True), ('Produto (do início)', a_prod_ini, True),
    ('Carrinho', lambda pg: (pg.click('#bagbtn'), pg.wait_for_timeout(1100)), True),
    ('Minha conta', lambda pg: (pg.click('#contabtn'), pg.wait_for_timeout(1100)), True),
    ('Seu rosto', lambda pg: menu(pg, 'a[href="#rosto"]'), False), ('Atacado', lambda pg: menu(pg, 'a[href="#atacado"]'), False),
    ('Como comprar', lambda pg: menu(pg, 'a[href="#como"]'), False),
    ('Consulta do grau', a_cons, True), ('Filtros', a_filtro, True),
    ('Menu', lambda pg: (pg.click('#mnb'), pg.wait_for_timeout(700)), True), ('Busca', lambda pg: (pg.click('#sbtn'), pg.wait_for_timeout(700)), True),
]
if RAPIDO: TELAS = [t for t in TELAS if t[0] in ('Catálogo Solar', 'Catálogo Leitura', 'Produto (do catálogo)', 'Carrinho', 'Consulta do grau', 'Menu', 'Busca')]

# ---------- parte 2: navegação ----------
def p2_tela(p, nome, abre, camada):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); e0 = est(pg)
        if not inicio(e0): falha('2 navegação', nome, 'o site não abriu no Início', pg); return
        abre(pg); e1 = est(pg)
        if inicio(e1): falha('2 navegação', nome, 'a tela não abriu', pg); return
        # logo → Início (só quando o logo está à vista: com menu/busca por cima ele fica coberto de propósito)
        if topo_em(pg, '.top .logo'):
            clica_real(pg, '.top .logo'); pg.wait_for_timeout(1700); e = est(pg)
            if inicio(e): passou('2 navegação', f'{nome} · logo')
            else: falha('2 navegação', f'{nome} · logo', f'o logo não voltou ao Início (ficou em: {txt(e)})', pg)
        # voltar do celular → onde estava antes
        carrega(pg); abre(pg); antes = None
        pg.go_back(); pg.wait_for_timeout(1500); e = est(pg)
        if pg.url.startswith('about:'): falha('2 navegação', f'{nome} · voltar do celular', 'o voltar saiu do site', None)
        elif fora(e) or (nome == 'Produto (do catálogo)' and e['abertos'] == ['painel:vitrine']): passou('2 navegação', f'{nome} · voltar do celular')
        else: falha('2 navegação', f'{nome} · voltar do celular', f'o voltar não voltou (ficou em: {txt(e)})', pg)
        # Esc fecha camadas
        if camada:
            if pg.url.startswith('about:'): carrega(pg)
            carrega(pg); abre(pg); pg.keyboard.press('Escape'); pg.wait_for_timeout(1300); e = est(pg)
            if fora(e) or (nome == 'Produto (do catálogo)' and e['abertos'] == ['painel:vitrine']) or (nome == 'Filtros' and e['abertos'] == ['painel:vitrine']): passou('2 navegação', f'{nome} · Esc')
            else: falha('2 navegação', f'{nome} · Esc', f'o Esc não fechou (ficou em: {txt(e)})', pg, grave=False)
        # "‹ Início"/"‹ Leitura" à vista → volta um passo
        carrega(pg); abre(pg)
        bk = pg.evaluate("""(()=>{const L=[...document.querySelectorAll('.vback,.gzbk,.pgback,[data-pgback]')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.bottom>0&&r.top<innerHeight});
           for(const e of L){const r=e.getBoundingClientRect(),t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);if(t&&(t===e||e.contains(t))){e.setAttribute('data-fiscal-bk','1');return e.textContent.trim().slice(0,20)}}return L.length?'COBERTO:'+L[0].textContent.trim().slice(0,20):''})()""")
        if bk.startswith('COBERTO:'): falha('2 navegação', f'{nome} · botão “{bk[8:]}”', f'o botão “{bk[8:]}” está escondido atrás de outra coisa', pg)
        elif bk:
            clica_real(pg, '[data-fiscal-bk]'); pg.wait_for_timeout(1500); e = est(pg)
            if fora(e) or (nome.startswith('Produto') and e['abertos'] in ([], ['painel:vitrine'])): passou('2 navegação', f'{nome} · botão “{bk}”')
            else: falha('2 navegação', f'{nome} · botão “{bk}”', f'o botão “{bk}” não voltou (ficou em: {txt(e)})', pg)
        # menu, busca e carrinho por cima: abrem por cima e, ao fechar, a tela continua a mesma
        if nome not in ('Menu', 'Busca'):
            for qual, sel, aberto in (('menu', '#mnb', lambda e: e['menu']), ('busca', '#sbtn', lambda e: e['busca']), ('carrinho', '#bagbtn', None)):
                if nome == 'Carrinho' and qual == 'carrinho': continue
                carrega(pg); abre(pg); e1 = est(pg)
                if not topo_em(pg, sel): falha('2 navegação', f'{nome} · abrir {qual}', f'o botão de {qual} não dá para tocar nesta tela', pg, grave=False); continue
                clica_real(pg, sel); pg.wait_for_timeout(1000); e2 = est(pg)
                ok = aberto(e2) if aberto else (e2['abertos'] != e1['abertos'])
                if not ok: falha('2 navegação', f'{nome} · abrir {qual}', f'o {qual} não abriu por cima', pg); continue
                pg.go_back(); pg.wait_for_timeout(1300); e3 = est(pg) if pg.url.startswith('http') else {'abertos': ['(saiu do site)'], 'menu': 0, 'busca': 0, 'y': 0, 'lock': 0, 'path': ''}
                if mesmo(e3, e1): passou('2 navegação', f'{nome} · {qual} por cima')
                else: falha('2 navegação', f'{nome} · {qual} por cima', f'abriu o {qual} e fechou com o voltar do celular: a tela mudou (era {txt(e1)}, ficou {txt(e3)})', pg if pg.url.startswith('http') else None)
        for x in E: falha('5 situações difíceis', f'{nome} · console', x, None)
    finally: b.close()

# ---------- parte 1: rolagem com o dedo (e com o teclado aberto) ----------
def p1_rola(p, nome, abre, teclado=False):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); abre(pg)
        if teclado: pg.set_viewport_size({'width': 390, 'height': 500}); pg.wait_for_timeout(600)
        # a área que rola é a maior área com conteúdo sobrando que está à vista
        r = pg.evaluate("""(()=>{let best=null;for(const e of document.querySelectorAll('*')){if(e.scrollHeight<=e.clientHeight+20)continue;const oy=getComputedStyle(e).overflowY;if(oy!=='auto'&&oy!=='scroll')continue;
          const r=e.getBoundingClientRect();if(r.width<100||r.height<80||r.bottom<=0||r.top>=innerHeight)continue;const t=document.elementFromPoint(r.left+r.width/2,Math.min(innerHeight-5,r.top+r.height/2));if(!t||!(e===t||e.contains(t)))continue;
          const a=r.width*r.height;if(!best||a>best.a)best={a,x:r.left+r.width/2,y0:Math.min(innerHeight-20,r.top+r.height*.75),y1:Math.max(r.top+10,r.top+r.height*.2),id:(e.id||e.className||e.tagName)+'',b:Math.round(r.bottom)}}
          if(!best&&document.scrollingElement.scrollHeight>innerHeight+20)best={x:innerWidth/2,y0:innerHeight*.75,y1:innerHeight*.25,id:'página',doc:1,b:innerHeight};return best})()""")
        if not r or (r.get('doc') and pg.evaluate("document.documentElement.classList.contains('lock')||document.documentElement.classList.contains('gzon')")): passou('1 toque', f'{nome} · rolar com o dedo', 'nada para rolar'); return
        pos = "(()=>{let s=0;for(const e of document.querySelectorAll('*'))s+=e.scrollTop;return s+scrollY})()"
        s0 = pg.evaluate(pos); arrasta(c, pg, r['x'], r['y0'], r['y1']); s1 = pg.evaluate(pos)
        q = f'{nome} · rolar com o dedo' + (' com o teclado aberto' if teclado else '')
        if s1 > s0 + 5: passou('1 toque', q)
        else: falha('1 toque', q, f'arrastando o dedo, a lista ({r["id"][:30]}) não rolou', pg)
        if teclado and r['b'] > 502: falha('1 toque', f'{nome} · lista acima do teclado', f'a lista termina em {r["b"]} px, atrás do teclado (que começa em 500)', pg)
    finally: b.close()

# ---------- parte 3: uso de verdade ----------
def catalogo(p):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); pg.click('#sbtn'); pg.wait_for_timeout(600); pg.keyboard.press('Enter'); pg.wait_for_timeout(1500)
        return pg.evaluate("[...document.querySelectorAll('#grid [data-open]')].map(e=>({ref:e.getAttribute('data-open'),nome:(e.querySelector('img')||{}).alt||''}))")
    finally: b.close()

def p3_busca(p, prods):
    secoes = [('Início', None), ('Solar', 'tipo:solar'), ('Leitura', 'tipo:grau'), ('Armações', 'tipo:armacao')]
    if RAPIDO: secoes = secoes[:2]
    b, c, pg, E = novo(p)
    try:
        for ref, nome in prods:
            for sn, mf in secoes:
                carrega(pg)
                if mf: menu(pg, f'a[data-mf="{mf}"]')
                pg.click('#sbtn'); pg.wait_for_timeout(600); pg.fill('#q5', nome); pg.wait_for_timeout(400)
                vist = pg.evaluate("r=>!![...document.querySelectorAll('#sores [data-open]')].find(e=>e.getAttribute('data-open')===r)", ref)
                rep = pg.evaluate("""(()=>{const t=[...document.querySelectorAll('#sores button')].filter(e=>e.offsetParent).map(e=>(e.querySelector('b')||e).textContent.trim().toLowerCase());
                   const d=t.filter((x,i)=>x.length>8&&t.indexOf(x)!==i);return d[0]||''})()""")
                if rep: falha('4 conteúdo', f'Busca “{nome}” · repetido', f'“{rep}” aparece duas vezes na busca', pg, grave=False)
                pg.keyboard.press('Enter'); pg.wait_for_timeout(1600); e = est(pg)
                ok = e['path'] == '/p/' + ref or pg.evaluate("r=>!![...document.querySelectorAll('#grid [data-open]')].find(e=>e.getAttribute('data-open')===r&&e.offsetParent)", ref)
                q = f'Busca “{nome}” a partir de {sn}'
                if not vist: falha('3 uso', q, 'o produto não aparece na lista da busca', pg)
                elif ok: passou('3 uso', q)
                else: falha('3 uso', q, f'confirmou a busca e o produto não apareceu (ficou em: {txt(e)}, {e["path"]})', pg)
        for x in E: falha('5 situações difíceis', 'Busca · console', x, None)
    finally: b.close()

def p3_carrinho(p):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); a_prod(pg)
        pcard = pg.evaluate("(document.querySelector('#layer [data-addm]')||{}).textContent||''")
        pg.click('#layer [data-addm]'); pg.wait_for_timeout(1300)
        n = pg.evaluate("document.querySelector('#bagbtn').textContent.trim()")
        if n != '1': falha('3 uso', 'Carrinho · comprar', f'depois de “Comprar” o carrinho mostra “{n}”, esperado 1', pg); return
        pg.keyboard.press('Escape'); pg.wait_for_timeout(900); pg.keyboard.press('Escape'); pg.wait_for_timeout(900)
        carrega(pg); pg.click('#bagbtn'); pg.wait_for_timeout(1200)
        if not pg.locator('#layer [data-inc]').count(): falha('3 uso', 'Carrinho · guardado', 'o item sumiu do carrinho depois de recarregar o site', pg); return
        pg.locator('#layer [data-inc]:visible').first.click(); pg.wait_for_timeout(600)
        q = pg.evaluate("document.querySelector('#layer').innerText")
        if not re.search(r'2 ite', q): falha('3 uso', 'Carrinho · +', 'o + não somou', pg)
        else: passou('3 uso', 'Carrinho · +')
        pg.locator('#layer [data-dec]:visible').first.click(); pg.wait_for_timeout(600)
        if not re.search(r'1 item', pg.evaluate("document.querySelector('#layer').innerText")): falha('3 uso', 'Carrinho · −', 'o − não diminuiu', pg)
        else: passou('3 uso', 'Carrinho · −')
        # preço igual no produto e no carrinho
        pr = re.findall(r'(?:R\$|Gs\.|\$)\s?[\d.,]+', pcard); tot = pg.evaluate("(document.querySelector('#layer').innerText.match(/Total\\s*\\n?\\s*([^\\n]+)/)||[])[1]||''")
        if pr and tot and pr[0].replace(' ', '') != tot.replace(' ', ''): falha('4 conteúdo', 'Preço produto × carrinho', f'no produto {pr[0]}, no carrinho {tot}', pg)
        else: passou('4 conteúdo', 'Preço produto × carrinho')
        pg.click('[data-cta=prosseguir]'); pg.wait_for_timeout(1500)
        if pg.locator('#layer #aun, #layer [data-cta=entrar], #layer input').count(): passou('3 uso', 'Carrinho · prosseguir (até a conta)')
        else: falha('3 uso', 'Carrinho · prosseguir', 'o “Prosseguir” não levou à conta/entrega', pg)
        b.close(); b, c, pg, E2 = novo(p); E.extend(E2) if False else None
        carrega(pg); a_prod(pg); pg.click('#layer [data-addm]'); pg.wait_for_timeout(1200)
        carrega(pg); pg.click('#bagbtn'); pg.wait_for_timeout(1200); pg.locator('#layer [data-rm]:visible').first.click(); pg.wait_for_timeout(900)
        n = pg.evaluate("document.querySelector('#bagbtn').textContent.trim()")
        if n not in ('0', ''): falha('3 uso', 'Carrinho · ×', f'depois do × o carrinho mostra “{n}”', pg)
        else: passou('3 uso', 'Carrinho · ×')
        for x in E: falha('5 situações difíceis', 'Carrinho · console', x, None)
    finally: b.close()

def p3_preco_cartao(p):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); a_cat('grau')(pg)
        cards = pg.evaluate("[...document.querySelectorAll('#grid [data-open]')].slice(0,4).map(e=>[e.getAttribute('data-open'),(e.innerText.match(/(R\\$|Gs\\.)\\s?[\\d.,]+/)||[''])[0]])")
        for ref, pc in cards:
            carrega(pg, 'p/' + ref) if False else None
            carrega(pg); a_cat('grau')(pg); pg.click(f'#grid [data-open="{ref}"]'); pg.wait_for_timeout(1600)
            pp = pg.evaluate("((document.querySelector('#layer [data-addm]')||{}).textContent||'').match(/(R\\$|Gs\\.)\\s?[\\d.,]+/)")
            pp = pp[0] if pp else ''
            if pc and pp and pc.replace(' ', '') != pp.replace(' ', ''): falha('4 conteúdo', f'Preço cartão × produto {ref}', f'no cartão {pc}, no produto {pp}', pg)
            else: passou('4 conteúdo', f'Preço cartão × produto {ref}')
    finally: b.close()

def p3_grau(p):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); a_cat('grau')(pg)
        G = pg.evaluate("[...document.querySelectorAll('#vgr [data-vgr]')].map(e=>e.getAttribute('data-vgr')).filter(Boolean)")
        for g in (G[:2] if RAPIDO else G):
            pg.click(f'#vgr [data-vgr="{g}"]'); pg.wait_for_timeout(700)
            n = pg.evaluate("[...document.querySelectorAll('#grid [data-open]')].filter(e=>e.offsetParent).length")
            if n: passou('3 uso', f'Filtro de grau {g}', f'{n} modelos')
            else: falha('3 uso', f'Filtro de grau {g}', 'o filtro mostra o grau mas nenhum modelo', pg)
    finally: b.close()

def p3_consulta(p, perm, nome, ls=None):
    b, c, pg, E = novo(p, ls=ls)
    try:
        if not perm: c.clear_permissions()
        carrega(pg); a_cons(pg)
        pg.wait_for_function("!!document.querySelector('#gw [data-gz=comeca]')", timeout=10000); pg.click('#gw [data-gz=comeca]')
        pg.wait_for_function("['cam','prep','teste','semcam'].includes(__LFGZ.Z.fase)||!!document.querySelector('#gw [data-gz=camsim]')", timeout=30000)
        if pg.locator('#gw [data-gz=camsim]').count():
            pg.wait_for_function("!!document.querySelector('#gw [data-gz=camsim]')&&!__LFGZ.Z.falando", timeout=30000); pg.wait_for_timeout(300); pg.click('#gw [data-gz=camsim]')
        try:
            pg.wait_for_function("__LFGZ.Z.fase==='teste'", timeout=45000); passou('3 uso', f'Consulta · {nome} chega ao quadro')
        except Exception:
            falha('3 uso', f'Consulta · {nome}', f'não chegou ao quadro (fase: {pg.evaluate("__LFGZ.Z.fase")})', pg); return
        if not RAPIDO:
            # responde até o fim
            for i in range(40):
                try: pg.wait_for_function("(__LFGZ.Z.fase!=='teste')||(!!document.querySelector('#gw [data-gz=sim]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado)", timeout=30000)
                except Exception: break
                if pg.evaluate("__LFGZ.Z.fase") != 'teste': break
                pg.wait_for_timeout(200); pg.click('#gw [data-gz=sim]' if i % 4 else '#gw [data-gz=sim]')
            f = pg.evaluate("__LFGZ.Z.fase")
            if f in ('pp', 'res'): passou('3 uso', f'Consulta · {nome} termina o quadro', f)
            else: falha('3 uso', f'Consulta · {nome} termina o quadro', f'parou na fase “{f}”', pg)
        for x in E: falha('5 situações difíceis', f'Consulta {nome} · console', x, None)
    finally: b.close()

# ---------- parte 4: conteúdo (ES sem português, fotos, moeda) ----------
def p4_conteudo(p, lang):
    b, c, pg, E = novo(p, lang=lang)
    try:
        telas = [('Início', lambda pg: None), ('Catálogo', a_cat('grau')), ('Produto', a_prod), ('Carrinho', lambda pg: (pg.click('#bagbtn'), pg.wait_for_timeout(1000))),
                 ('Menu', lambda pg: (pg.click('#mnb'), pg.wait_for_timeout(700))), ('Consulta', a_cons)]
        for nome, abre in telas:
            carrega(pg); abre(pg); pg.wait_for_timeout(500)
            # rola a página/camada para baixo para carregar o resto
            pg.evaluate("(()=>{for(const e of document.querySelectorAll('#layer *,#vscr,#gw'))if(e.scrollHeight>e.clientHeight)e.scrollTop=e.scrollHeight;scrollTo(0,document.body.scrollHeight)})()"); pg.wait_for_timeout(900)
            V = pg.evaluate("""(()=>{const vis=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>0&&r.height>0&&c.visibility!=='hidden'&&+c.opacity>0};
              const T=[],w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const e=n.parentElement;if(!e||e.closest('script,style,[lang^=pt],[translate=no]'))continue;const t=n.textContent.trim();if(t.length<2||!vis(e))continue;T.push(t)}
              const im=[...document.querySelectorAll('img')].filter(i=>vis(i)&&i.complete&&i.naturalWidth===0&&i.getAttribute('src')).map(i=>i.getAttribute('src').slice(-40));
              const mo=[...new Set((document.body.innerText.match(/(R\\$|Gs\\.|US\\$|\\$\\s?\\d)/g)||[]).map(x=>x.replace(/\\s?\\d$/,'')))];return {T,im,mo}})()""")
            if lang.startswith('es'):
                pt = [t for t in V['T'] if re.search(r'[ãõçÃÕÇ]|\b(você|óculos|não|carrinho|obrigad[oa]|também)\b', t, re.I)]
                if pt: falha('4 conteúdo', f'ES · {nome} · português', 'texto em português na versão em espanhol: ' + ' | '.join(sorted(set(pt))[:5]), pg)
                else: passou('4 conteúdo', f'ES · {nome} · sem português')
            if V['im']: falha('4 conteúdo', f'{lang} · {nome} · foto quebrada', 'fotos que não carregaram: ' + ', '.join(V['im'][:4]), pg)
            mo = [m for m in V['mo'] if m != '$']
            if len(mo) > 1: falha('4 conteúdo', f'{lang} · {nome} · moeda', 'duas moedas na mesma tela: ' + ', '.join(mo), pg)
        for x in E: falha('5 situações difíceis', f'{lang} · console', x, None)
    finally: b.close()

# ---------- parte 5: situações difíceis ----------
def p5_rede(p):
    b, c, pg, E = novo(p)
    try:
        cdp = c.new_cdp_session(pg); cdp.send('Network.enable')
        cdp.send('Network.emulateNetworkConditions', {'offline': False, 'latency': 400, 'downloadThroughput': 400 * 1024 / 8, 'uploadThroughput': 200 * 1024 / 8})
        t0 = time.time(); pg.goto('about:blank'); pg.goto(URL, wait_until='commit')
        try: pg.wait_for_function("!!document.querySelector('[data-open] img')&&[...document.querySelectorAll('[data-open]')].some(e=>e.offsetParent)", timeout=30000); t = time.time() - t0
        except Exception: t = 99
        if t <= 10: passou('5 situações difíceis', '4G fraco · vitrine aparece', f'{t:.1f} s')
        else: falha('5 situações difíceis', '4G fraco · vitrine aparece', f'levou {t:.0f} s para aparecer o primeiro óculos (limite 10 s)', pg, grave=False)
        cdp.send('Network.emulateNetworkConditions', {'offline': False, 'latency': 0, 'downloadThroughput': -1, 'uploadThroughput': -1})
        pg.wait_for_timeout(2500); c.set_offline(True)
        try:
            a_prod(pg); e = est(pg)
            if 'produto' in e['abertos']: passou('5 situações difíceis', 'Sem internet · abrir produto')
            else: falha('5 situações difíceis', 'Sem internet · abrir produto', f'sem internet o produto não abriu ({txt(e)})', pg, grave=False)
        except Exception as ex: falha('5 situações difíceis', 'Sem internet · abrir produto', 'travou: ' + str(ex)[:100], pg, grave=False)
        c.set_offline(False)
        for x in E:
            if 'ERR_INTERNET_DISCONNECTED' in x or 'Failed to fetch' in x or 'network' in x.lower(): continue
            falha('5 situações difíceis', 'Rede · console', x, None)
    finally: b.close()

def p5_segundo_plano(p):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); a_cons(pg)
        pg.wait_for_function("!!document.querySelector('#gw [data-gz=comeca]')", timeout=10000); pg.click('#gw [data-gz=comeca]'); pg.wait_for_timeout(1500)
        pg.evaluate("Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>'hidden'});Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))")
        pg.wait_for_timeout(1200)
        tocando = pg.evaluate("(()=>{const a=[...document.querySelectorAll('audio')];const z=window.__LFGZ&&__LFGZ.Z;return {fala:!!(z&&z.m&&z.m.fal),audio:(window.__aud||[]).some(x=>!x.paused&&!x.ended)}})()")
        if tocando['fala'] or tocando['audio']: falha('5 situações difíceis', 'Consulta em segundo plano', 'o Mochi continua falando com o site em segundo plano (S108)', pg)
        else: passou('5 situações difíceis', 'Consulta em segundo plano pausa')
    finally: b.close()

def p5_girar(p):
    b, c, pg, E = novo(p)
    try:
        for nome, abre in (('Início', lambda pg: None), ('Produto', a_prod), ('Consulta', a_cons), ('Carrinho', lambda pg: (pg.click('#bagbtn'), pg.wait_for_timeout(1000)))):
            pg.set_viewport_size({'width': 390, 'height': 844}); carrega(pg); abre(pg)
            pg.set_viewport_size({'width': 844, 'height': 390}); pg.wait_for_timeout(900)
            r = pg.evaluate("(()=>{const h=document.querySelector('.top');const hr=h?h.getBoundingClientRect():{bottom:0};return {larga:document.documentElement.scrollWidth>innerWidth+1,top:Math.round(hr.bottom),H:innerHeight}})()")
            if r['larga']: falha('5 situações difíceis', f'Girar · {nome}', 'deitando o celular, a página passa a rolar de lado', pg)
            elif r['top'] > r['H'] * .35: falha('5 situações difíceis', f'Girar · {nome}', f'deitado, o cabeçalho ocupa {r["top"]} de {r["H"]} px da altura', pg, grave=False)
            else: passou('5 situações difíceis', f'Girar · {nome}')
            pg.set_viewport_size({'width': 390, 'height': 844}); pg.wait_for_timeout(700)
            if pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"): falha('5 situações difíceis', f'Girar e voltar · {nome}', 'depois de girar e voltar, a página ficou larga', pg)
        for x in E: falha('5 situações difíceis', 'Girar · console', x, None)
    finally: b.close()

# ---------- parte 6: bug nunca volta (cada bug do dono vira prova fixa) ----------
REG = []
def regressao(data, nome):
    def d(fn): REG.append((data, nome, fn)); return fn
    return d

@regressao('10/11', 'Busca não rolava com o dedo (S110-1)')
def r_busca_rola(p): p1_rola(p, 'Busca com 2 letras', lambda pg: (pg.click('#sbtn'), pg.wait_for_timeout(600), pg.fill('#q5', 'a'), pg.wait_for_timeout(600)), True)

@regressao('10/11', 'Tudo que abre pelo menu: o voltar do celular saía do site (S113)')
def r_menu_voltar(p):
    b, c, pg, E = novo(p)
    try:
        for sel, n in (('a[data-mf="tipo:solar"]', 'Solar'), ('a[data-mf="tipo:of"]', 'Ofertas'), ('a[data-mf="gen:f"]', 'Feminino'), ('a[href="#rosto"]', 'Seu formato'),
                       ('a[href="#atacado"]', 'Atacado'), ('a[href="#como"]', 'Ajuda'), ('[data-gzopen]', 'Descubra o seu grau'), ('[data-cta=minha]', 'Minha conta')):
            if RAPIDO and n not in ('Solar', 'Seu formato', 'Minha conta'): continue
            carrega(pg); menu(pg, sel); pg.go_back(); pg.wait_for_timeout(1500)
            if not pg.url.startswith('http'): falha('6 bug nunca volta', f'Menu → {n} · voltar do celular', 'o voltar saiu do site', None)
            elif fora(est(pg)): passou('6 bug nunca volta', f'Menu → {n} · voltar do celular')
            else: falha('6 bug nunca volta', f'Menu → {n} · voltar do celular', f'ficou em: {txt(est(pg))}', pg)
        carrega(pg); menu(pg, 'a[data-mf="tipo:solar"]'); pg.locator('#grid [data-open]:visible').first.click(); pg.wait_for_timeout(1700)
        pg.go_back(); pg.wait_for_timeout(1500); a = est(pg) if pg.url.startswith('http') else None
        pg.go_back(); pg.wait_for_timeout(1500); b2 = est(pg) if pg.url.startswith('http') else None
        if a and a['abertos'] == ['painel:vitrine'] and b2 and fora(b2): passou('6 bug nunca volta', 'Menu → Solar → produto · voltar, voltar')
        else: falha('6 bug nunca volta', 'Menu → Solar → produto · voltar, voltar', f'esperado Solar e depois Início; ficou {txt(a) if a else "fora do site"} e {txt(b2) if b2 else "fora do site"}', None)
    finally: b.close()

@regressao('10/11', 'WhatsApp da peça: o antigo, flutuando acima da barra de compra (S112)')
def r_wa(p):
    for W, H in ((390, 844), (320, 568)):
        b, c, pg, E = novo(p, W=W, H=H)
        try:
            carrega(pg); a_prod(pg); pg.wait_for_timeout(700)
            r = pg.evaluate("""(()=>{const w=document.querySelector('a.wa'),r=w.getBoundingClientRect(),b=document.querySelector('#layer .buy,#layer .buyrow'),t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
              return {vis:getComputedStyle(w).display!=='none'&&r.width>30,acima:!b||r.bottom<=b.getBoundingClientRect().top+1,toque:!!t&&w.contains(t),barra:document.querySelectorAll('#layer .bbwa').length,pulso:getComputedStyle(w).animationName!=='none'}})()""")
            if r['vis'] and r['acima'] and r['toque'] and not r['barra'] and r['pulso']: passou('6 bug nunca volta', f'WhatsApp da peça {W}px')
            else: falha('6 bug nunca volta', f'WhatsApp da peça {W}px', 'esperado: redondo, com pulso, acima da barra e sem botão dentro da barra; veio ' + json.dumps(r), pg)
        finally: b.close()

@regressao('10/11', 'Busca em Solar não achava óculos de leitura (S110-2)')
def r_busca_solar(p):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); menu(pg, 'a[data-mf="tipo:solar"]'); pg.click('#sbtn'); pg.wait_for_timeout(600); pg.fill('#q5', 'leitura'); pg.keyboard.press('Enter'); pg.wait_for_timeout(1500)
        n = pg.evaluate("[...document.querySelectorAll('#grid [data-open]')].filter(e=>e.offsetParent).length")
        if n: passou('6 bug nunca volta', 'Busca “leitura” estando em Solar', f'{n} modelos')
        else: falha('6 bug nunca volta', 'Busca “leitura” estando em Solar', '0 resultados de novo', pg)
    finally: b.close()

@regressao('10/11', 'Bloco “Sugestões” repetia o produto (S110-3)')
def r_sug(p):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); pg.click('#sbtn'); pg.wait_for_timeout(600); pg.fill('#q5', 'Óculos de'); pg.wait_for_timeout(600)
        if pg.locator('#sores .srh:has-text("SUGEST")').count(): falha('6 bug nunca volta', 'Sem bloco Sugestões', 'o bloco “Sugestões” voltou', pg)
        else: passou('6 bug nunca volta', 'Sem bloco Sugestões')
    finally: b.close()

@regressao('10/11', 'Logo não voltava ao início na consulta (S111)')
def r_logo(p):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); a_cons(pg); clica_real(pg, '.top .logo'); pg.wait_for_timeout(1700); e = est(pg)
        if inicio(e): passou('6 bug nunca volta', 'Logo na consulta volta ao Início')
        else: falha('6 bug nunca volta', 'Logo na consulta volta ao Início', f'ficou em: {txt(e)}', pg)
    finally: b.close()

@regressao('10/11', 'Consulta: “Início” e “Som” escondidos atrás do cabeçalho no celular pequeno com letra grande')
def r_gzbk(p):
    b, c, pg, E = novo(p, W=320, H=568, ls={'lf_zoom': '2'})
    try:
        carrega(pg); a_cons(pg); pg.wait_for_timeout(800)
        for s, n in (('#gw .gzbk', 'Início'), ('#gw .gzmu', 'Som')):
            if pg.locator(s).count() and not topo_em(pg, s): falha('6 bug nunca volta', f'Consulta 320 letra grande · botão {n}', f'o botão “{n}” está atrás do cabeçalho (bug conhecido do fiscal, entra no layout novo)', pg, grave=False)
            else: passou('6 bug nunca volta', f'Consulta 320 letra grande · botão {n}')
    finally: b.close()

JS_CLICAVEIS = """(()=>{const H=document.querySelector('.top');if(!H)return [];const hr=H.getBoundingClientRect(),o=[];
  const L=[...document.querySelectorAll('a[href],button,[data-open],[role=button],input,select')].filter(e=>!H.contains(e)&&!e.closest('#evbar,#drw,#sov,[hidden]'));
  for(const e of L){const r=e.getBoundingClientRect(),c=getComputedStyle(e);if(r.width<8||r.height<8||c.visibility==='hidden'||+c.opacity===0||c.pointerEvents==='none')continue;
    if(r.top<0||r.bottom>innerHeight||r.left<0||r.right>innerWidth)continue;
    const P=[[r.left+2,r.top+2],[r.right-2,r.top+2],[r.left+2,r.bottom-2],[r.right-2,r.bottom-2]];
    for(const [x,y] of P){const t=document.elementFromPoint(x,y);if(t&&(H.contains(t)||(t.closest&&t.closest('#evbar')))){o.push((e.getAttribute('aria-label')||e.textContent||e.tagName).trim().slice(0,30));break}}}
  return o})()"""

@regressao('11/11', 'Nada clicável escondido atrás do cabeçalho (coração cortado, S150)')
def r_cabecalho(p):
    for W, H in ((390, 844), (1440, 900), (2560, 1440)):
        b, c, pg, E = novo(p, W=W, H=H, touch=W < 700)
        try:
            for nome, abre in (('Início', lambda pg: None), ('Catálogo', a_cat('grau')), ('Produto', a_prod)):
                if RAPIDO and nome == 'Catálogo': continue
                carrega(pg); abre(pg); pg.wait_for_timeout(600)
                o = pg.evaluate(JS_CLICAVEIS)
                if o: falha('6 bug nunca volta', f'{W}px · {nome} · cabeçalho por cima', 'botões cobertos pelo cabeçalho: ' + ' | '.join(sorted(set(o))[:5]), pg)
                else: passou('6 bug nunca volta', f'{W}px · {nome} · nada atrás do cabeçalho')
        finally: b.close()

JS_LINHA = """(sels=>{const o=[];for(const s of sels)for(const box of document.querySelectorAll(s)){
  const K=[...box.children].filter(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>4&&r.height>4&&c.visibility!=='hidden'&&c.position!=='absolute'&&c.position!=='fixed'});
  for(let i=0;i<K.length;i++)for(let j=i+1;j<K.length;j++){const a=K[i].getBoundingClientRect(),b=K[j].getBoundingClientRect();
    if(Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)<Math.min(a.height,b.height)*.5)continue;
    const d=Math.abs((a.top+a.bottom)/2-(b.top+b.bottom)/2);if(d>1.01)o.push(s+': '+(K[i].getAttribute('aria-label')||K[i].textContent||K[i].tagName).trim().slice(0,16)+' × '+(K[j].getAttribute('aria-label')||K[j].textContent||K[j].tagName).trim().slice(0,16)+' ('+d.toFixed(1)+' px)')}}
  return o})"""

@regressao('11/11', 'Itens da mesma linha fora do centro (favoritos/compartilhar no PC, S150)')
def r_alinha(p):
    for W, H in ((390, 844), (1440, 900)):
        b, c, pg, E = novo(p, W=W, H=H, touch=W < 700)
        try:
            for nome, abre, sels in (('Cabeçalho', lambda pg: None, ['.top']), ('Produto', a_prod, ['.dmi', '#layer .dm']), ('Catálogo', a_cat('grau'), ['#lfgen'])):
                carrega(pg); abre(pg); pg.wait_for_timeout(600)
                o = pg.evaluate(JS_LINHA + '(' + json.dumps(sels) + ')')
                if o: falha('6 bug nunca volta', f'{W}px · {nome} · alinhamento', 'fora do centro da linha: ' + ' | '.join(o[:4]), pg)
                else: passou('6 bug nunca volta', f'{W}px · {nome} · mesma linha centralizada')
        finally: b.close()

@regressao('11/11', 'Texto em português na versão em espanhol (Ajuda, Atacado, Seu formato, Favoritos)')
def r_idioma(p):
    b, c, pg, E = novo(p, lang='es-PY')
    try:
        telas = (('Ajuda', lambda pg: menu(pg, 'a[href="#como"]')), ('Atacado', lambda pg: menu(pg, 'a[href="#atacado"]')), ('Seu formato', lambda pg: menu(pg, 'a[href="#rosto"]')),
                 ('Favoritos', lambda pg: (pg.click('#bagbtn'), pg.wait_for_timeout(900), pg.locator('#layer .ctb button').last.click() if pg.locator('#layer .ctb button').count() else None, pg.wait_for_timeout(600))),
                 ('Busca vazia', lambda pg: (pg.click('#sbtn'), pg.wait_for_timeout(800))))
        for nome, abre in telas:
            carrega(pg); abre(pg); pg.wait_for_timeout(700)
            T = pg.evaluate("""(()=>{const vis=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>0&&r.height>0&&c.visibility!=='hidden'&&+c.opacity>0&&r.bottom>0&&r.top<innerHeight};
              const T=[],w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const e=n.parentElement;if(!e||e.closest('script,style,[lang^=pt],[translate=no]'))continue;const t=n.textContent.trim();if(t.length>=2&&vis(e))T.push(t)}return T})()""")
            pt = [t for t in T if re.search(r'[ãõçÃÕÇ]|\b(você|óculos|não|carrinho|obrigad[oa]|também|seu|sua|pedido de orçamento)\b', t, re.I)]
            if pt: falha('6 bug nunca volta', f'ES · {nome} · português', 'texto em português na versão em espanhol: ' + ' | '.join(sorted(set(pt))[:5]), pg)
            else: passou('6 bug nunca volta', f'ES · {nome} · sem português')
    finally: b.close()

@regressao('11/11', 'Carrinho: o “−” não pode passar de 1 (S153)')
def r_cart_min(p):
    b, c, pg, E = novo(p)
    try:
        carrega(pg); a_prod(pg); pg.click('#layer [data-addm]'); pg.wait_for_timeout(1300)
        pg.keyboard.press('Escape'); pg.wait_for_timeout(800); pg.keyboard.press('Escape'); pg.wait_for_timeout(800)
        carrega(pg); pg.click('#bagbtn'); pg.wait_for_timeout(1200)
        d = pg.locator('#layer [data-dec]:visible').first
        dis = d.is_disabled()
        try: d.click(timeout=800, force=True)
        except Exception: pass
        pg.wait_for_timeout(500)
        q = pg.evaluate("(()=>{const s=document.querySelector('#layer .qty span');return s?s.textContent.trim():''})()")
        if dis and q == '1': passou('6 bug nunca volta', 'Carrinho · − para em 1')
        else: falha('6 bug nunca volta', 'Carrinho · − para em 1', f'com 1 peça o − {"está ligado" if not dis else "está desligado"} e a quantidade ficou “{q}”', pg)
    finally: b.close()

# ---------- parte 7 · olho do dono (13/11/2026): cada bug da lista do dono vira prova; aparelhos de 320 a 2560 e as 3 letras ----------
CONTA7 = json.dumps({'nome': 'Maria González', 'email': 'maria@exemplo.com', 'tel': '+595 983 000 000', 'nac': 'py', 'doc': '1234567', 'ends': [{'nome': 'Casa', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Calle Los Lapachos 123', 'ref': 'portón verde'}]})
AUTH7 = json.dumps({'uid': 'kit', 'idToken': 'kit', 'refresh': 'kit', 'exp': 9e15, 'ev': True, 'email': 'maria@exemplo.com'})
LOG7 = {'lf_conta': CONTA7, 'lf_auth': AUTH7}
TAM7 = [(390, 844), (1440, 900), (2560, 1440)]
P7 = '7 olho do dono'

def fim_da_pagina(pg, onde='window'):
    pg.evaluate("""o=>{const s=o==='layer'?document.querySelector('#layer .scrim')||document.querySelector('#layer .modal')||document.querySelector('#layer'):document.scrollingElement;
      [...document.querySelectorAll('*')].forEach(e=>{if(e.scrollHeight>e.clientHeight+50&&/(auto|scroll)/.test(getComputedStyle(e).overflowY))e.scrollTop=e.scrollHeight});if(s)s.scrollTop=s.scrollHeight;scrollTo(0,1e7)}""", onde)
    pg.wait_for_timeout(900)

RODAPE_VISIVEL = """()=>{const F=[...document.querySelectorAll('footer,.lfft')].filter(f=>{const r=f.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0&&getComputedStyle(f).visibility!=='hidden'});
  const V=F.filter(f=>{const r=f.getBoundingClientRect(),x=r.left+r.width/2;return [.2,.5,.8].some(k=>{const y=Math.min(innerHeight-2,Math.max(1,r.top+r.height*k));const e=document.elementFromPoint(x,y);return e&&f.contains(e)})});
  if(!V.length)return {ok:false,d:F.length?'o rodapé fica escondido atrás da tela aberta (o cliente não vê)':'o rodapé não aparece'};const f=V[V.length-1];
  if(innerWidth>=1024){const L=[...f.querySelectorAll('p,li,a,span,h3,h4,b,small,div')].filter(e=>e.children.length===0&&e.textContent.trim().length>3);
    const ruim=L.filter(e=>{const r=e.getBoundingClientRect(),lh=parseFloat(getComputedStyle(e).lineHeight)||18;return r.width>0&&r.width<140&&r.height>lh*2.6});
    if(ruim.length>2)return {ok:false,d:'rodapé espremido: '+ruim.length+' textos quebrando em 3+ linhas (ex.: “'+ruim[0].textContent.trim().slice(0,30)+'”)'};}
  return {ok:true}}"""

def p7_rodape(p):
    for W, H in TAM7:
        for nome, abre, onde in (('Início', lambda pg: None, 'window'), ('Catálogo', a_cat('grau'), 'window'), ('Peça aberta', a_prod, 'layer')):
            b, c, pg, E = novo(p, W, H, 'es-PY', touch=W < 700)
            try:
                carrega(pg); abre(pg); fim_da_pagina(pg, onde); r = pg.evaluate(RODAPE_VISIVEL)
                if r['ok']: passou(P7, f'Rodapé · {nome} · {W}px')
                else: falha(P7, f'Rodapé · {nome} · {W}px', r['d'], pg)
            finally: b.close()

def abre_duvidas(pg):
    carrega(pg); pg.click('#mnb'); pg.wait_for_timeout(800); pg.locator('#drw [data-ajp="duvidas"]').first.click(); pg.wait_for_timeout(1500)

def p7_teste_ajuda(p):
    b, c, pg, E = novo(p, 1440, 900, 'es-PY', touch=False)
    try:
        abre_duvidas(pg); h0 = pg.evaluate('history.length')
        ok_abre = True
        for i in range(3):
            if not pg.locator('[data-gzopen].ajl:visible').count(): break
            pg.locator('[data-gzopen].ajl:visible').first.click(); pg.wait_for_timeout(1800)
            if 'consulta' not in est(pg)['abertos']: ok_abre = False
            else: pg.keyboard.press('Escape'); pg.wait_for_timeout(900)
        if ok_abre: passou(P7, 'Ajuda › “Hacer la prueba” abre o Mochi e fica')
        else: falha(P7, 'Ajuda › “Hacer la prueba” abre o Mochi e fica', 'o Mochi abre e volta na hora para a página anterior', pg)
        cresce = pg.evaluate('history.length') - h0
        if cresce <= 2: passou(P7, 'Ajuda › repetir o teste não empilha o voltar')
        else: falha(P7, 'Ajuda › repetir o teste não empilha o voltar', f'3 cliques criaram {cresce} passos no voltar (o cliente volta várias vezes na mesma página)', pg)
    finally: b.close()

FOTO_SNAP = """(sel)=>[...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect();return r.width>60&&r.top>0&&r.bottom<innerHeight}).slice(0,3).map(im=>{let o=[],e=im;for(let k=0;k<4&&e;k++,e=e.parentElement){const s=getComputedStyle(e);o.push((s.transform==='matrix(1, 0, 0, 1, 0, 0)'?'none':s.transform)+s.translate+s.rotate+s.scale+s.objectPosition+s.backgroundPosition)}const r=im.getBoundingClientRect();return [r.left,r.top,r.width,r.height,o.join('|')]})"""

def p7_foto_mouse(p):
    # a foto não pode se mexer seguindo o mouse — Início, catálogo e peça, com e sem os efeitos do app ligados
    for efx in ('', 'incl,refl'):
        for nome, abre, sel in (('Início', lambda pg: None, '#home img, #stage img, #hdst img'), ('Catálogo', a_cat('grau'), '#grid .ph img'), ('Peça', a_prod, '#layer .big img')):
            b, c, pg, E = novo(p, 1440, 900, 'es-PY', ls={'lf_cfg': json.dumps({'ativo': True, 'efx': efx})} if efx else None, touch=False)
            try:
                carrega(pg); abre(pg); A = pg.evaluate(FOTO_SNAP, sel); ruim = 0
                for x, y, w, h, _ in A:
                    pg.mouse.move(x + w * .25, y + h * .3); pg.wait_for_timeout(800); a1 = pg.evaluate(FOTO_SNAP, sel)
                    pg.mouse.move(x + w * .75, y + h * .7, steps=6); pg.wait_for_timeout(800); a2 = pg.evaluate(FOTO_SNAP, sel)
                    pg.wait_for_timeout(350); a3 = pg.evaluate(FOTO_SNAP, sel)
                    sozinha = [z[4] for z in a2] != [z[4] for z in a3] or [z[:2] for z in a2] != [z[:2] for z in a3]
                    if not sozinha and ([z[4] for z in a1] != [z[4] for z in a2] or [z[:2] for z in a1] != [z[:2] for z in a2]): ruim += 1
                t = f'Foto parada com o mouse · {nome}' + (' · efeitos ligados' if efx else '')
                if ruim: falha(P7, t, f'{ruim} foto(s) se mexem seguindo o mouse', pg)
                else: passou(P7, t, f'{len(A)} fotos')
            finally: b.close()

def p7_tamanho(p):
    med = "(()=>{const q=s=>document.querySelector(s),h=q('.top'),t=[...document.querySelectorAll('.h2,#home h2,#hdst h2,h1,h2')].find(e=>e.getBoundingClientRect().height>0);return {hd:h?h.getBoundingClientRect().height:0,h1:t?parseFloat(getComputedStyle(t).fontSize):0,sw:document.documentElement.scrollWidth,iw:innerWidth}})()"
    R = {}
    for zi in (0, 1, 2):
        for W, H in ((1440, 900), (1920, 1080), (2560, 1440)):
            b, c, pg, E = novo(p, W, H, 'es-PY', ls={'lf_zoom': str(zi)}, touch=False)
            try:
                carrega(pg); R[(zi, W)] = m = pg.evaluate(med)
                if m['sw'] > m['iw'] + 2: falha(P7, f'Sem rolagem para o lado · {W}px · letra {zi}', f'a página fica {m["sw"]-m["iw"]}px mais larga que a tela', pg)
            finally: b.close()
        a, z = R[(zi, 1920)], R[(zi, 2560)]
        cres = (z['h1'] / a['h1']) if a['h1'] else 1
        if cres <= 1.15 and (z['hd'] <= a['hd'] * 1.15 + 1): passou(P7, f'Tamanho padrão no monitor 2560 · letra {zi}')
        else: falha(P7, f'Tamanho padrão no monitor 2560 · letra {zi}', f'em 2560px o título fica {cres:.2f}× maior e o topo {z["hd"]/max(1,a["hd"]):.2f}× (site gigante)')

def p7_mochi_bracos(p):
    b, c, pg, E = novo(p, 1440, 900, 'es-PY', touch=False)
    try:
        carrega(pg)
        r = pg.evaluate("""(()=>{const L=[...document.querySelectorAll('button[data-gzopen]')].filter(e=>e.querySelector('.mo svg')&&e.getBoundingClientRect().width);if(!L.length)return null;const e=L[0];const v=e.querySelector('.mo svg'),c=v.querySelector('.corpoF').getBoundingClientRect();const ok=x=>{const a=v.querySelector(x);if(!a)return false;const r=a.getBoundingClientRect();return r.width>3&&r.height>3&&(r.left<c.left-2||r.right>c.right+2)};
          e.scrollIntoView({block:'center'});return ok('.aBe')||ok('.aBd')})()""")
        if r is None: falha(P7, 'Mochi com braços no cartão “Prueba de lectura”', 'o cartão do teste de leitura não foi achado', pg, grave=False)
        elif r: passou(P7, 'Mochi com braços no cartão “Prueba de lectura”')
        else: falha(P7, 'Mochi com braços no cartão “Prueba de lectura”', 'o Mochi do cartão está sem braços', pg)
    finally: b.close()

def p7_conta_spam(p):
    b, c, pg, E = novo(p, 390, 844, 'es-PY', ls=LOG7)
    try:
        carrega(pg); pg.click('#contabtn'); pg.wait_for_timeout(1200)
        abas = pg.locator('#layer [data-a]:visible'); n = abas.count()
        if n < 2: falha(P7, 'Mi cuenta · cliques repetidos', 'as abas de Mi cuenta não foram achadas', pg, grave=False); return
        pg.evaluate("window.__an=0;document.addEventListener('animationstart',()=>__an++,true);document.addEventListener('transitionrun',()=>__an++,true)")
        for i in range(6): pg.locator('#layer [data-a]:visible').first.click(force=True); pg.wait_for_timeout(60)
        mesma = pg.evaluate('__an'); pg.wait_for_timeout(800); pg.evaluate('__an=0')
        for i in range(8): pg.locator('#layer [data-a]:visible').nth(i % n).click(force=True); pg.wait_for_timeout(60)
        troca = pg.evaluate('__an')
        if mesma <= 2: passou(P7, 'Mi cuenta · tocar de novo na mesma aba não anima', f'{mesma}')
        else: falha(P7, 'Mi cuenta · tocar de novo na mesma aba não anima', f'6 toques na aba já aberta dispararam {mesma} animações (spam)', pg)
        if troca <= 8 * 3: passou(P7, 'Mi cuenta · trocar de aba rápido sem chuva de animações', f'{troca}')
        else: falha(P7, 'Mi cuenta · trocar de aba rápido sem chuva de animações', f'8 trocas rápidas dispararam {troca} animações', pg)
    finally: b.close()

def p7_idioma(p):
    for W, H in ((390, 844), (1440, 900)):
        b, c, pg, E = novo(p, W, H, 'es-PY', touch=W < 700)
        try:
            carrega(pg); pg.click('#mnb'); pg.wait_for_timeout(700)
            pg.locator('[data-dset="lg"]').first.click(); pg.wait_for_timeout(700)
            t = pg.evaluate("document.body.innerText")
            if re.search(r'seg[uú]n tu celular|conforme o seu celular', t, re.I): falha(P7, f'Idioma sem “(según tu celular)” · {W}px', 'ainda aparece “(según tu celular)”', pg)
            else: passou(P7, f'Idioma sem “(según tu celular)” · {W}px')
            if W >= 1024:
                r = pg.evaluate("(()=>{const L=[...document.querySelectorAll('*')].filter(e=>/^Idioma$/.test((e.textContent||'').trim())&&e.tagName==='H4');if(!L.length)return null;let e=L[0];while(e.parentElement&&e.parentElement!==document.body&&e.getBoundingClientRect().height<120)e=e.parentElement;const r=e.getBoundingClientRect();return [r.bottom,innerHeight,r.width,innerWidth]})()")
                if r and r[0] >= r[1] - 2: falha(P7, 'Idioma e tamanho do texto no padrão de computador', 'no computador abre como gaveta de celular presa embaixo da tela', pg)
                else: passou(P7, 'Idioma e tamanho do texto no padrão de computador')
        finally: b.close()

def p7_endereco(p):
    b, c, pg, E = novo(p, 390, 844, 'es-PY', ls=dict(LOG7, lf_conta=json.dumps({'nome': 'Maria González', 'email': 'maria@exemplo.com', 'tel': '+595 983 000 000', 'nac': 'py', 'doc': '1234567', 'ends': []})))
    try:
        carrega(pg); a_prod(pg); pg.click('#layer [data-addm]'); pg.wait_for_timeout(1200)
        pg.evaluate("(()=>{const b=[...document.querySelectorAll('button')].find(b=>/Finalizar|Continuar con el pago|Prosseguir/.test(b.innerText));b&&b.click()})()"); pg.wait_for_timeout(1200)
        pg.evaluate("(()=>{const b=[...document.querySelectorAll('button')].find(b=>/Continuar con el pago|Prosseguir com o pagamento/.test(b.innerText));b&&b.click()})()"); pg.wait_for_timeout(1200)
        pg.evaluate("(()=>{const b=document.querySelector('button.cfo[data-ent=delivery]');b&&b.click()})()"); pg.wait_for_timeout(900)
        if pg.locator('#esv').count() or re.search(r'Guardar en Mis direcciones|Salvar em Meus endereços', pg.evaluate('document.body.innerText')):
            falha(P7, 'Endereço salva sozinho na conta (sem “Guardar en Mis direcciones”)', 'ainda aparece a chave “Guardar en Mis direcciones”', pg)
        else: passou(P7, 'Endereço salva sozinho na conta (sem “Guardar en Mis direcciones”)')
    finally: b.close()

def p7_codigo(p):
    b, c, pg, E = novo(p, 390, 844, 'es-PY')
    try:
        carrega(pg); a_prod(pg); pg.click('#layer [data-addm]'); pg.wait_for_timeout(1200)
        pg.evaluate("(()=>{const b=[...document.querySelectorAll('button')].find(b=>/Finalizar compra/.test(b.innerText));b&&b.click()})()"); pg.wait_for_timeout(1200)
        r = pg.evaluate("(()=>{const s=document.querySelector('#layer .cs');if(!s)return null;const k=[...s.children];const i=k.findIndex(e=>e.matches('details.cupf'));const t=k.findIndex(e=>e.matches('.cs-t'));const sub=k.findIndex(e=>e.matches('.cs-r.cs-h'));return [i,t,sub,k.length]})()")
        if not r or r[0] < 0: passou(P7, 'Posição do “¿Tenés un código?”', 'sem o campo nesta tela'); return
        if r[0] == r[2] + 1: falha(P7, 'Posição do “¿Tenés un código?”', 'o campo fica colado no Subtotal, no meio das linhas do resumo (antes do Llevá 2/Entrega)', pg)
        else: passou(P7, 'Posição do “¿Tenés un código?”')
    finally: b.close()

def p7_icone_conta(p):
    b, c, pg, E = novo(p, 1440, 900, 'es-PY', touch=False)
    try:
        carrega(pg)
        cor = "s=>{const e=document.querySelector(s);if(!e)return '';const v=e.querySelector('svg')||e;return getComputedStyle(v).color}"
        a, s0 = pg.evaluate(cor, '#contabtn'), pg.evaluate(cor, '#sbtn')
        pg.hover('#contabtn'); pg.wait_for_timeout(300); ah = pg.evaluate(cor, '#contabtn'); pg.mouse.move(5, 500)
        pg.hover('#sbtn'); pg.wait_for_timeout(300); sh = pg.evaluate(cor, '#sbtn')
        if a == s0 and ah == sh: passou(P7, 'Ícone de Mi cuenta igual aos outros (cor e mouse por cima)')
        else: falha(P7, 'Ícone de Mi cuenta igual aos outros (cor e mouse por cima)', f'conta {a} / mouse {ah} × busca {s0} / mouse {sh}', pg)
    finally: b.close()

def p7_ultimas(p):
    # S208 (13/11, dono): "Últimas N" fica ABAIXO da foto, em VERMELHO, sem fundo, com espaço da foto (nunca encostado nos óculos)
    for W, H in ((390, 844), (1440, 900)):
        for esc in ('light', 'dark'):
            b, c, pg, E = novo(p, W, H, 'es-PY', touch=W < 700)
            try:
                carrega(pg)
                if esc == 'dark': pg.evaluate("()=>document.documentElement.setAttribute('data-theme','dark')")
                r = pg.evaluate("""()=>{const L=[...document.querySelectorAll('.hc .stk.u,.card .ph .stk.u,.hc .hci .ulin,.card .ph .ulin')].filter(e=>e.getBoundingClientRect().width);
                  const M=[...document.querySelectorAll('.ulin')].filter(e=>e.getBoundingClientRect().width).map(e=>{const s=getComputedStyle(e),c=s.color.match(/\\d+/g).map(Number),im=e.closest('.hc,.card').querySelector('.hci,.ph'),gap=e.getBoundingClientRect().top-(im?im.getBoundingClientRect().bottom:0);
                    return {v:c[0]>=180&&c[1]<=120&&c[2]<=120,bg:s.backgroundColor==='rgba(0, 0, 0, 0)'||s.backgroundColor==='transparent',gap:gap}});return {dentro:L.length,n:M.length,ruins:M.filter(x=>!x.v||!x.bg||x.gap<8).length}}""")
                t = f'“Últimas N” abaixo da foto, vermelho · {W}px · {esc}'
                if r['dentro'] or r['ruins']: falha(P7, t, f"{r['dentro']} dentro da foto · {r['ruins']} sem vermelho/sem espaço/com fundo", pg)
                else: passou(P7, t, f"{r['n']} cartões")
            finally: b.close()

DICA_MEDE = """(b)=>{const a=getComputedStyle(b,'::after');if(!a.content||a.content==='none'||a.content==='normal'||parseFloat(a.opacity)<.5)return null;
  const t=a.content.replace(/^"|"$/g,'');const cv=document.createElement('canvas').getContext('2d');cv.font=a.fontWeight+' '+a.fontSize+' '+a.fontFamily;
  const w=cv.measureText(t).width;const r=b.getBoundingClientRect(),aw=parseFloat(a.width)||0;
  const L=r.left+(parseFloat(a.left)||0);return {t,w,aw,fora:L+w>innerWidth+1||L<-1}}"""

def p7_dica(p):
    b, c, pg, E = novo(p, 1440, 900, 'es-PY', touch=False)
    try:
        carrega(pg); a_prod(pg)
        bt = pg.locator('#layer button[aria-label]:visible'); ruim = []
        for i in range(min(bt.count(), 25)):
            try: bt.nth(i).hover(timeout=1500); pg.wait_for_timeout(450)
            except Exception: continue
            r = bt.nth(i).evaluate(DICA_MEDE)
            if r and (r['aw'] < r['w'] - 2 or r['fora']): ruim.append(r['t'])
        if ruim: falha(P7, 'Dicas inteiras ao passar o mouse', 'dica cortada: ' + ', '.join(ruim[:4]), pg)
        else: passou(P7, 'Dicas inteiras ao passar o mouse')
    finally: b.close()

def p7_produto_topo(p):
    for W, H in ((1440, 900), (2560, 1440)):
        b, c, pg, E = novo(p, W, H, 'es-PY', touch=False)
        try:
            carrega(pg); a_prod_ini(pg)
            r = pg.evaluate("(()=>{const ly=document.querySelector('#layer');const x=innerWidth/2;let y=0;const t=document.querySelector('.top');if(t)y=t.getBoundingClientRect().bottom;const pts=[y+3,y+30,y+60];return pts.map(yy=>{const e=document.elementFromPoint(x,yy);return !!e&&(ly.contains(e)||e.closest('.top'))})})()")
            if all(r): passou(P7, f'Peça aberta cobre a página de trás · {W}px')
            else: falha(P7, f'Peça aberta cobre a página de trás · {W}px', 'a página de trás (Destaque) aparece entre o topo e o caminho da peça', pg)
        finally: b.close()

def p7_varredura(p):
    # passa por todos os botões e links visíveis do Início (celular e computador): nenhum erro, nada travado, nada mais largo que a tela
    for W, H in ((390, 844), (1440, 900)):
        b, c, pg, E = novo(p, W, H, 'es-PY', touch=W < 700)
        try:
            carrega(pg)
            alvos = pg.evaluate("""(()=>{const L=[...document.querySelectorAll('button,a,[data-open],[data-cta],[role=button]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>8&&r.height>8&&!e.closest('#layer')&&!/^(https?:|mailto:|tel:)/.test(e.getAttribute('href')||'')||/lafouch/.test(e.getAttribute('href')||'')});
              const k=new Set();return L.map((e,i)=>{e.setAttribute('data-vz',i);return i}).filter(i=>{const e=document.querySelector('[data-vz="'+i+'"]');const t=(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,30);if(k.has(t))return false;k.add(t);return true}).slice(0,60)})()""")
            ruins = []
            for i in alvos:
                E.clear()
                try:
                    if not pg.locator(f'[data-vz="{i}"]').count(): continue
                    pg.locator(f'[data-vz="{i}"]').first.click(timeout=1500, force=True); pg.wait_for_timeout(500)
                    m = pg.evaluate("[document.documentElement.scrollWidth,innerWidth]")
                    if E: ruins.append(f'botão {i}: ' + E[0][:80])
                    elif m[0] > m[1] + 2: ruins.append(f'botão {i}: página mais larga que a tela')
                except Exception: pass
                pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
                if pg.url.rstrip('/') != URL.rstrip('/') or est(pg)['abertos'] or est(pg)['lock']:
                    carrega(pg); pg.evaluate("""(()=>{const L=[...document.querySelectorAll('button,a,[data-open],[data-cta],[role=button]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>8&&r.height>8&&!e.closest('#layer')});L.forEach((e,i)=>e.setAttribute('data-vz',i))})()""")
            if ruins: falha(P7, f'Varredura de todos os botões · {W}px', f'{len(ruins)} problema(s): ' + ' | '.join(ruins[:3]), pg)
            else: passou(P7, f'Varredura de todos os botões · {W}px', f'{len(alvos)} botões')
        finally: b.close()

# animações (13/11/2026): grava cada quadro da abertura; acusa painel que nasce fora do lugar, "pulo" no fim e quadros travados
ANIM_GRAVA = """(sel)=>new Promise(ok=>{const Q=[];let t0=performance.now(),ult=t0;const f=()=>{const n=performance.now();const e=document.querySelector(sel);
  if(e){const r=e.getBoundingClientRect();Q.push({t:Math.round(n-t0),dt:Math.round(n-ult),l:Math.round(r.left),r:Math.round(r.right),t2:Math.round(r.top),w:Math.round(r.width),op:+getComputedStyle(e).opacity})}
  ult=n;if(n-t0<900)requestAnimationFrame(f);else ok(Q)};requestAnimationFrame(f)})"""

def anima_confere(Q, W):
    if len(Q) < 5: return 'não deu para gravar a abertura'
    fim = Q[-1]; prob = []
    vis = [q for q in Q if q['op'] > 0.15 and q['w'] > 0]
    fora = [q for q in vis if q['l'] < fim['l'] - 12 or q['r'] > fim['r'] + 12 and q['r'] > W]
    if fora: prob.append(f'nasce fora do lugar ({fora[0]["l"]}→{fim["l"]}px da esquerda)')
    passos = [abs(b['l'] - a['l']) for a, b in zip(vis, vis[1:])]
    med = sorted(passos)[len(passos) // 2] if passos else 0
    pulos = [vis[i + 1] for i, d in enumerate(passos) if d > 40 and d > 2.5 * max(passos[i - 1] if i > 0 else 0, passos[i + 1] if i + 1 < len(passos) else 0, 4)]
    if pulos: prob.append(f'dá um pulo de {abs(pulos[-1]["l"]-vis[vis.index(pulos[-1])-1]["l"])}px')
    lentos = [q for q in Q[1:] if q['dt'] > 50]
    if len(lentos) > 2: prob.append(f'{len(lentos)} quadros travados (>50 ms)')
    return '; '.join(prob)

ABRE = [('Busca (lupa)', '#sbtn', '#sov .sopn'), ('Menu', '#mnb', '#drw'), ('Carrinho', '#bagbtn', '#layer .scrim > *'), ('Mi cuenta', '#contabtn', '#layer .scrim > *')]

def p7_animacoes(p):
    for W, H in ((390, 844), (820, 1180), (1440, 900)):
        for nome, bt, alvo in ABRE:
            b, c, pg, E = novo(p, W, H, 'es-PY', touch=W < 1000)
            try:
                carrega(pg)
                if not pg.locator(bt).count(): continue
                pg.evaluate("s=>document.querySelector(s).click()", bt)
                Q = pg.evaluate(ANIM_GRAVA, alvo)
                d = anima_confere(Q, W)
                if d: falha(P7, f'Animação · {nome} · {W}px', d, pg)
                else: passou(P7, f'Animação · {nome} · {W}px', f'{len(Q)} quadros')
            finally: b.close()

# texto em cima de texto (13/11/2026): rola cada página inteira em celular/tablet/PC e nas letras normal/maior
SOBRE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'kit', 'sobre.js')).read()
def p7_sobreposto(p):
    for W, H in ((390, 844), (820, 1180), (1440, 900), (2560, 1440)):
        for zi in ('0', '2'):
            for nome, abre in (('Início', lambda pg: None), ('Catálogo', a_cat('grau')), ('Peça', a_prod)):
                b, c, pg, E = novo(p, W, H, 'es-PY', ls={'lf_zoom': zi}, touch=W < 1000)
                try:
                    carrega(pg); abre(pg); A = set()
                    for i in range(14):
                        for x in pg.evaluate(SOBRE): A.add(x)
                        pg.evaluate("()=>{const L=[document.scrollingElement,...document.querySelectorAll('#layer .scrim,#vscr')];L.forEach(e=>{if(e)e.scrollTop+=innerHeight*.8})}"); pg.wait_for_timeout(200)
                    t = f'Sem texto sobreposto · {nome} · {W}px · letra {zi}'
                    if A: falha(P7, t, ' | '.join(sorted(A)[:3]), pg)
                    else: passou(P7, t)
                finally: b.close()

# ---------- execução ----------
t0 = time.time()
PARTES = os.environ.get('FISCAL_PARTES', '1,2,3,4,5,6').split(',')
if os.environ.get('FISCAL_SO_FUNCOES'): PARTES = []
with sync_playwright() as p:
    if '6' in PARTES:
     print('parte 6 · bug nunca volta')
     for d, n, fn in REG: prova('6 bug nunca volta', n, fn, p)
    if '2' in PARTES:
     print('parte 2 · navegação')
     for nome, abre, cam in TELAS: print(' ', nome); prova('2 navegação', nome, p2_tela, p, nome, abre, cam)
    if '1' in PARTES:
     print('parte 1 · toque')
     for nome, abre in (('Início', lambda pg: None), ('Catálogo', a_cat('grau')), ('Produto', a_prod), ('Menu', lambda pg: (pg.click('#mnb'), pg.wait_for_timeout(700))), ('Consulta', a_cons)):
         prova('1 toque', nome, p1_rola, p, nome, abre)
    if '3' in PARTES:
     print('parte 3 · uso')
     prods = catalogo(p); pv = [(x['ref'], x['nome']) for x in prods if x['nome']]
     print('  produtos:', len(pv))
     prova('3 uso', 'busca', p3_busca, p, pv[:3] if RAPIDO else pv)
     prova('3 uso', 'carrinho', p3_carrinho, p)
     prova('3 uso', 'grau', p3_grau, p)
     prova('3 uso', 'consulta com câmera', p3_consulta, p, True, 'com câmera')
     if not RAPIDO:
         prova('3 uso', 'consulta sem câmera', p3_consulta, p, False, 'câmera negada', {'t_nega': '1'})
         prova('4 conteúdo', 'preços', p3_preco_cartao, p)
    if '4' in PARTES:
     print('parte 4 · conteúdo')
     prova('4 conteúdo', 'pt', p4_conteudo, p, 'pt-BR')
     prova('4 conteúdo', 'es', p4_conteudo, p, 'es-PY')
    if '7' in PARTES:
     print('parte 7 · olho do dono')
     for nome, fn in (('rodapé', p7_rodape), ('teste da ajuda', p7_teste_ajuda), ('foto e mouse', p7_foto_mouse), ('tamanho e letras', p7_tamanho), ('Mochi com braços', p7_mochi_bracos),
                      ('Mi cuenta', p7_conta_spam), ('idioma', p7_idioma), ('endereço', p7_endereco), ('código', p7_codigo), ('ícone da conta', p7_icone_conta),
                      ('Últimas N', p7_ultimas), ('dica', p7_dica), ('animações', p7_animacoes), ('texto sobreposto', p7_sobreposto), ('peça cobre', p7_produto_topo), ('varredura', p7_varredura)):
         print(' ', nome); prova(P7, nome, fn, p)
    if '5' in PARTES:
     print('parte 5 · situações difíceis')
     prova('5 situações difíceis', 'girar', p5_girar, p)
     prova('5 situações difíceis', 'segundo plano', p5_segundo_plano, p)
     if not RAPIDO: prova('5 situações difíceis', 'rede', p5_rede, p)

json.dump({'rapido': RAPIDO, 'seg': round(time.time() - t0), 'res': RES}, open(os.path.join(OUT, 'provas' + os.environ.get('FISCAL_SUF', '') + '.json'), 'w'), ensure_ascii=False, indent=1)
F = [r for r in RES if not r['ok']]
print(f'fim {len(RES)} provas · {len(F)} falhas ({sum(1 for r in F if r.get("grave"))} graves) · {time.time() - t0:.0f} s')
