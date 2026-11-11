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
    c = b.new_context(locale=lang, viewport={'width': W, 'height': H}, device_scale_factor=1, has_touch=touch, is_mobile=touch and W < 700, permissions=['camera'])
    L = dict(ls or {}); L.setdefault('lf_lang', 'es' if lang.startswith('es') else 'pt')
    c.add_init_script('(()=>{' + ''.join(f'localStorage.setItem({k!r},{v!r});' for k, v in L.items()) + '})()')
    c.add_init_script(INIT); c.add_init_script("window.open=function(u){window.__wo=u;return null}")
    pg = c.new_page(); erros = []
    pg.on('pageerror', lambda e: erros.append('erro: ' + str(e)[:200]))
    pg.on('console', lambda m: erros.append('console: ' + m.text[:200]) if m.type == 'error' and 'favicon' not in m.text and 'Failed to load resource' not in m.text else None)
    return b, c, pg, erros

def carrega(pg, rota=''):
    pg.goto('about:blank'); pg.goto(URL + rota); pg.wait_for_timeout(2200)

def est(pg): return pg.evaluate(ESTADO)
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
        try: NF[0] += 1; f = f'p/{NF[0]:04d}.png'; pg.screenshot(path=os.path.join(OUT, f))
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
def a_cat(t): return lambda pg: menu(pg, f'a[data-mf="tipo:{t}"]')
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
        elif inicio(e) or (nome == 'Produto (do catálogo)' and e['abertos'] == ['painel:vitrine']): passou('2 navegação', f'{nome} · voltar do celular')
        else: falha('2 navegação', f'{nome} · voltar do celular', f'o voltar não voltou (ficou em: {txt(e)})', pg)
        # Esc fecha camadas
        if camada:
            if pg.url.startswith('about:'): carrega(pg)
            carrega(pg); abre(pg); pg.keyboard.press('Escape'); pg.wait_for_timeout(1300); e = est(pg)
            if inicio(e) or (nome == 'Produto (do catálogo)' and e['abertos'] == ['painel:vitrine']) or (nome == 'Filtros' and e['abertos'] == ['painel:vitrine']): passou('2 navegação', f'{nome} · Esc')
            else: falha('2 navegação', f'{nome} · Esc', f'o Esc não fechou (ficou em: {txt(e)})', pg, grave=False)
        # "‹ Início"/"‹ Leitura" à vista → volta um passo
        carrega(pg); abre(pg)
        bk = pg.evaluate("""(()=>{const L=[...document.querySelectorAll('.vback,.gzbk,.pgback,[data-pgback]')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.bottom>0&&r.top<innerHeight});
           for(const e of L){const r=e.getBoundingClientRect(),t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);if(t&&(t===e||e.contains(t))){e.setAttribute('data-fiscal-bk','1');return e.textContent.trim().slice(0,20)}}return L.length?'COBERTO:'+L[0].textContent.trim().slice(0,20):''})()""")
        if bk.startswith('COBERTO:'): falha('2 navegação', f'{nome} · botão “{bk[8:]}”', f'o botão “{bk[8:]}” está escondido atrás de outra coisa', pg)
        elif bk:
            clica_real(pg, '[data-fiscal-bk]'); pg.wait_for_timeout(1500); e = est(pg)
            if inicio(e) or (nome.startswith('Produto') and e['abertos'] in ([], ['painel:vitrine'])): passou('2 navegação', f'{nome} · botão “{bk}”')
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
                pg.keyboard.press('Escape'); pg.wait_for_timeout(1200); e3 = est(pg)
                if mesmo(e3, e1): passou('2 navegação', f'{nome} · {qual} por cima')
                else: falha('2 navegação', f'{nome} · {qual} por cima', f'ao fechar o {qual}, a tela mudou (era {txt(e1)}, ficou {txt(e3)})', pg)
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
        if not r: passou('1 toque', f'{nome} · rolar com o dedo', 'nada para rolar'); return
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
        pg.click('#layer [data-inc]'); pg.wait_for_timeout(600)
        q = pg.evaluate("document.querySelector('#layer').innerText")
        if not re.search(r'2 ite', q): falha('3 uso', 'Carrinho · +', 'o + não somou', pg)
        else: passou('3 uso', 'Carrinho · +')
        pg.click('#layer [data-dec]'); pg.wait_for_timeout(600)
        if not re.search(r'1 item', pg.evaluate("document.querySelector('#layer').innerText")): falha('3 uso', 'Carrinho · −', 'o − não diminuiu', pg)
        else: passou('3 uso', 'Carrinho · −')
        # preço igual no produto e no carrinho
        pr = re.findall(r'(?:R\$|Gs\.|\$)\s?[\d.,]+', pcard); tot = pg.evaluate("(document.querySelector('#layer').innerText.match(/Total\\s*\\n?\\s*([^\\n]+)/)||[])[1]||''")
        if pr and tot and pr[0].replace(' ', '') != tot.replace(' ', ''): falha('4 conteúdo', 'Preço produto × carrinho', f'no produto {pr[0]}, no carrinho {tot}', pg)
        else: passou('4 conteúdo', 'Preço produto × carrinho')
        pg.click('[data-cta=prosseguir]'); pg.wait_for_timeout(1500)
        if pg.locator('#layer #aun, #layer [data-cta=entrar], #layer input').count(): passou('3 uso', 'Carrinho · prosseguir (até a conta)')
        else: falha('3 uso', 'Carrinho · prosseguir', 'o “Prosseguir” não levou à conta/entrega', pg)
        carrega(pg); pg.click('#bagbtn'); pg.wait_for_timeout(1200); pg.click('#layer [data-rm]'); pg.wait_for_timeout(900)
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
        tocando = pg.evaluate("(()=>{const a=[...document.querySelectorAll('audio')];const z=window.__LFGZ&&__LFGZ.Z;return {fala:!!(z&&z.falando),audio:a.some(x=>!x.paused)}})()")
        if tocando['fala'] or tocando['audio']: falha('5 situações difíceis', 'Consulta em segundo plano', 'o Mochi continua falando com o site em segundo plano (correção prevista no S108, ainda não aprovada)', None, grave=False)
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
def r_busca_rola(p): p1_rola(p, 'Busca com 2 letras', lambda pg: (pg.click('#sbtn'), pg.wait_for_timeout(600), pg.fill('#q5', 'os'), pg.wait_for_timeout(600)), True)

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

# ---------- execução ----------
t0 = time.time()
with sync_playwright() as p:
    print('parte 6 · bug nunca volta')
    for d, n, fn in REG: prova('6 bug nunca volta', n, fn, p)
    print('parte 2 · navegação')
    for nome, abre, cam in TELAS: print(' ', nome); prova('2 navegação', nome, p2_tela, p, nome, abre, cam)
    print('parte 1 · toque')
    for nome, abre in (('Início', lambda pg: None), ('Catálogo', a_cat('grau')), ('Produto', a_prod), ('Menu', lambda pg: (pg.click('#mnb'), pg.wait_for_timeout(700))), ('Consulta', a_cons)):
        prova('1 toque', nome, p1_rola, p, nome, abre)
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
    print('parte 4 · conteúdo')
    prova('4 conteúdo', 'pt', p4_conteudo, p, 'pt-BR')
    prova('4 conteúdo', 'es', p4_conteudo, p, 'es-PY')
    print('parte 5 · situações difíceis')
    prova('5 situações difíceis', 'girar', p5_girar, p)
    prova('5 situações difíceis', 'segundo plano', p5_segundo_plano, p)
    if not RAPIDO: prova('5 situações difíceis', 'rede', p5_rede, p)

json.dump({'rapido': RAPIDO, 'seg': round(time.time() - t0), 'res': RES}, open(os.path.join(OUT, 'provas.json'), 'w'), ensure_ascii=False, indent=1)
F = [r for r in RES if not r['ok']]
print(f'fim {len(RES)} provas · {len(F)} falhas ({sum(1 for r in F if r.get("grave"))} graves) · {time.time() - t0:.0f} s')
