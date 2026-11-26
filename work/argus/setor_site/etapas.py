# ARGUS · setor SITE · as CONFERÊNCIAS PRÓPRIAS DO SITE (Parte 7c): o que a planta não enxerga — comportamento com dados, contas,
# cupons, a conversa com a nuvem, o idioma, a rede e a página por dentro. O que a planta já confere (desenho, toques, janelas,
# família, contraste) NÃO se repete aqui. Cada conferência devolve [(nome, estado, detalhe)], estado = 'ok' | 'ACHADO' | 'não conferido'.
# Tudo com o dedo de verdade (motor/dedo.py) e com a loja de teste do site; a nuvem é a de teste (setor_site/nuvem.py).
import os, sys, re, json, time, urllib.robotparser
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_site'))
import lfsite, dedo, aparelhos
from nuvem import Nuvem
from js import js
OK, ACH, NC = 'ok', 'ACHADO', 'não conferido'
def _vis(pg, sel): return pg.evaluate("s=>[...document.querySelectorAll(s)].some(e=>window.__argus.vis(e))", sel)
def toca(pg, sel, esp=1200):
    """Toca com o dedo na 1ª peça visível do seletor; False se não há."""
    r = pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>window.__argus.vis(e));if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});const q=e.getBoundingClientRect();return {x:q.left+q.width/2,y:q.top+q.height/2,t:navigator.maxTouchPoints>0}}", sel)
    if not r: return False
    dedo.toca_xy(pg, r['x'], r['y'], r['t']); pg.wait_for_timeout(esp); return True
def texto(pg, sel='body'): return pg.evaluate("s=>{const e=document.querySelector(s);return e?e.innerText:''}", sel)
def peca(pg):
    """Abre a 1ª peça do catálogo, como um cliente (tocando no cartão)."""
    return toca(pg, '#grid [data-open]', 1800)
def estoque(ref):
    """O estoque da 1ª cor da peça, na loja de teste do site (qs por cor; sem qs, o est)."""
    for d in json.load(open(lfsite.LOJA))['docs']:
        f = d['fields']
        if f.get('ref', {}).get('stringValue') == ref:
            qs = f.get('qs', {}).get('arrayValue', {}).get('values', [])
            return int(qs[0].get('integerValue', 0)) if qs else int(f.get('est', {}).get('integerValue', 0))
    return None
def num(t): return float(re.sub(r'[^\d]', '', t) or 0)
PRECO = r'(?:R\$|G\$|Gs\.|US\$)\s?[\d.,]+'
# ---------- 1 busca: cada peça da loja é achada pelo nome, sem repetir ----------
def busca(pw, nav, **kw):
    out = []; docs = json.load(open(lfsite.LOJA))['docs']; nomes = [(d['fields'].get('ref', {}).get('stringValue', ''), d['fields'].get('nome', {}).get('stringValue', '')) for d in docs]
    b, pg = lfsite.abre(pw, navegador=nav, **kw)
    try:
        for ref, nome in [x for x in nomes if x[1]][:8]:
            pg.goto(pg.url.split('/', 3)[0] + '//' + pg.url.split('/')[2] + '/'); pg.wait_for_timeout(1200)
            if not toca(pg, '#sbtn', 600): out.append(('busca', NC, 'não achei o botão de buscar')); break
            pg.keyboard.type(nome[:40]); pg.wait_for_timeout(700)
            achados = pg.evaluate("()=>[...document.querySelectorAll('#sores [data-open]')].filter(e=>window.__argus.vis(e)).map(e=>e.getAttribute('data-open'))")
            rep = sorted({x for x in achados if achados.count(x) > 1})
            out.append(('busca "%s"' % nome[:30], OK if ref in achados and not rep else ACH, ('a peça %s não aparece' % ref) if ref not in achados else ('repetida: ' + ', '.join(rep)) if rep else ''))
    finally: b.close()
    return out
# ---------- 2 carrinho: comprar, guardar, + e − nos limites, ×, o mesmo preço ----------
def carrinho(pw, nav, **kw):
    out = []; b, pg = lfsite.abre(pw, navegador=nav, rota='catalogo', **kw)
    try:
        if not peca(pg): return [('carrinho', NC, 'não achei peça no catálogo')]
        preco_peca = (re.findall(PRECO, texto(pg, '#layer') or texto(pg)) or [''])[0]; ref = pg.evaluate("()=>location.pathname.split('/p/')[1]||''"); est = estoque(ref)
        if not toca(pg, '[data-addm]', 1500): return [('carrinho', NC, 'não achei o "Comprar" da peça')]
        n = pg.evaluate("()=>(document.querySelector('#bagbtn')||{}).textContent||''").strip()
        out.append(('carrinho: comprar põe 1 no carrinho', OK if n.endswith('1') else ACH, 'o carrinho mostra "%s"' % n))
        pg.reload(); pg.wait_for_timeout(1800); toca(pg, '#bagbtn', 1200)
        out.append(('carrinho: a peça continua depois de recarregar', OK if _vis(pg, '[data-inc]') else ACH, ''))
        for _ in range(3): toca(pg, '[data-dec]', 400)
        q = texto(pg, '#layer'); out.append(('carrinho: o "−" não passa de 1', OK if re.search(r'\b1 ite', q) and _vis(pg, '[data-inc]') else ACH, q[:60].replace('\n', ' ')))
        for _ in range(30): toca(pg, '[data-inc]', 150)
        pg.wait_for_timeout(600); q = texto(pg, '#layer'); m = re.search(r'(\d+) ite', q)
        out.append(('carrinho: o "+" para no estoque da cor', NC if est is None or not m else OK if int(m.group(1)) <= est else ACH, '%s itens depois de 30 toques (estoque da cor: %s)' % (m.group(1) if m else '?', est)))
        tot = (re.findall(r'Total\s*\n?\s*(' + PRECO + ')', q) or [''])[0]
        for _ in range(40): toca(pg, '[data-dec]', 120)
        pg.wait_for_timeout(600); q = texto(pg, '#layer'); tot1 = (re.findall(r'Total\s*\n?\s*(' + PRECO + ')', q) or [''])[0]
        out.append(('carrinho: o preço da peça = o total com 1 item', OK if preco_peca and tot1 and num(preco_peca) == num(tot1) else ACH if preco_peca and tot1 else NC, 'peça %s · carrinho %s' % (preco_peca, tot1)))
        toca(pg, '[data-rm]', 900); n = pg.evaluate("()=>(document.querySelector('#bagbtn')||{}).textContent||''").strip()
        out.append(('carrinho: o "×" tira a peça', OK if not re.search(r'[1-9]', n) else ACH, 'o carrinho mostra "%s"' % n))
    finally: b.close()
    return out
# ---------- 3 preço do cartão = preço da peça; uma moeda por tela ----------
def precos(pw, nav, **kw):
    out = []; b, pg = lfsite.abre(pw, navegador=nav, rota='catalogo', **kw)
    try:
        cards = pg.evaluate("(P)=>[...document.querySelectorAll('#grid [data-open]')].filter(e=>window.__argus.vis(e)).slice(0,4).map(e=>[e.getAttribute('data-open'),(e.innerText.match(new RegExp(P))||[''])[0]])", PRECO)
        base = pg.url
        for ref, pc in cards:
            pg.goto(base); pg.wait_for_timeout(1200); toca(pg, '#grid [data-open="%s"]' % ref, 1700)
            pp = (re.findall(PRECO, texto(pg, '#layer') or texto(pg)) or [''])[0]
            out.append(('preço: cartão × peça %s' % ref, OK if pc and pp and num(pc) == num(pp) else ACH if pc and pp else NC, 'cartão %s · peça %s' % (pc, pp)))
        moedas = sorted(set(m.split()[0] for m in re.findall(r'(R\$|G\$|Gs\.|US\$)', texto(pg))))
        out.append(('preço: uma moeda só por tela', OK if len(moedas) <= 1 else ACH, ', '.join(moedas)))
    finally: b.close()
    return out
# ---------- 4 cupom: o certo vale, cada motivo tem a sua frase, sem internet avisa, e um cupom forjado no aparelho não vale ----------
MOTIVOS = ('nao', 'usado', 'vencido', 'cancelado', 'esgotado', 'outro')
def _cart_com_peca(pw, nav, nv, **kw):
    b, pg = lfsite.abre(pw, navegador=nav, rota='catalogo', nuvem=nv, **kw)
    if not (peca(pg) and toca(pg, '[data-addm]', 1500)): return b, pg, False
    # depois de pôr no carrinho o site abre a janela "Adicionado ao carrinho": a cliente toca em "Finalizar compra"
    if not _vis(pg, '[data-cta=prosseguir]') and not toca(pg, '[data-cadfin]', 1500): toca(pg, '#bagbtn', 1200)
    return b, pg, True
def _poe_codigo(pg, cod):
    """Como a cliente recebe o cupom: o link lafouch.com/t/CÓDIGO (a página 404 manda para ?t=, e o site confere com a nuvem).
    Depois abre o carrinho para ler o total. Devolve o aviso que apareceu."""
    base = '/'.join(pg.url.split('/')[:3]); pg.goto(base + '/t/' + cod)
    try: t = pg.wait_for_selector('.toast', timeout=8000).inner_text()   # o aviso do site dura ~2 s: pega na hora que aparece
    except Exception: t = ''
    return t
def _total(pg):
    """O total do carrinho, abrindo o carrinho se ele não estiver aberto."""
    ler = lambda: re.findall(r'Total\s*\n?\s*(' + PRECO + ')', texto(pg, '#layer'))
    if not ler(): toca(pg, '#bagbtn', 1200)
    return num((ler() or ['0'])[0])
def cupom(pw, nav, **kw):
    out = []
    nv = Nuvem({'cupom': (200, {'ok': True, 'cupom': {'cod': 'ARGUS10', 'pct': 10, 'tipo': 'amigo'}})})
    b, pg, ok = _cart_com_peca(pw, nav, nv, **kw)
    try:
        if not ok: return [('cupom', NC, 'não deu para pôr uma peça no carrinho')]
        t0 = _total(pg)
        _poe_codigo(pg, 'ARGUS10')
        t1 = _total(pg)
        out.append(('cupom: o código certo (10%) baixa o total', OK if t0 and t1 and abs(t1 - t0 * 0.9) <= max(1, t0 * 0.011) else ACH, 'total %s → %s' % (t0, t1)))
        C = nv.chamadas('cupom')
        out.append(('cupom: o código é conferido pela nuvem', OK if C else ACH, '%d conferência(s)' % len(C)))
        out.append(('cupom: a conferência leva o selo do App Check', OK if C and all(k[3] for k in C) else ACH if C else NC, ''))
    finally: b.close()
    for lg in ('pt', 'es'):
        for mot in MOTIVOS:
            nv = Nuvem({'cupom': (200, {'ok': False, 'motivo': mot, 'cupom': {'cod': 'ERRADO1'}})}); b, pg, ok = _cart_com_peca(pw, nav, nv, lingua=lg, **kw)
            try:
                if not ok: out.append(('cupom "%s" (%s)' % (mot, lg), NC, 'não deu para pôr uma peça no carrinho')); continue
                t = _poe_codigo(pg, 'ERRADO1')
                certo = t.strip() and not (lg == 'es' and PT.search(t))
                out.append(('cupom recusado "%s" (%s): a frase aparece, na língua dela' % (mot, lg), OK if certo else ACH, t[:70]))
            finally: b.close()
    nv = Nuvem({'cupom': None}); b, pg, ok = _cart_com_peca(pw, nav, nv, **kw)   # a nuvem fora do ar
    try:
        if ok:
            t = _poe_codigo(pg, 'ARGUS10')
            out.append(('cupom sem internet: avisa que não deu para conferir', OK if t.strip() else ACH, t[:70]))
    finally: b.close()
    # burla: um cupom de 90% escrito à mão no aparelho, sem a nuvem confirmar
    forja = "(()=>{if(/^http/.test(location.protocol))localStorage.setItem('lf_cup',JSON.stringify({cod:'FORJADO',pct:90,tipo:'amigo'}))})()"
    nv = Nuvem({'cupom': (200, {'ok': False, 'motivo': 'nao'})}); b, pg, ok = _cart_com_peca(pw, nav, nv, scripts=(forja,), **kw)
    try:
        if ok:
            _total(pg); q = texto(pg, '#layer'); mostra = bool(re.search(r'90\s*%|FORJADO', q))
            out.append(('cupom forjado no aparelho (90%) não aparece como desconto sem a nuvem confirmar', ACH if mostra else OK, 'o carrinho mostra o desconto forjado' if mostra else ''))
    finally: b.close()
    return out
# ---------- 5 compra inteira pela nuvem: reserva, pedido pela porta da nuvem (tenta de novo sozinho), tela de pagar ----------
def compra(pw, nav, **kw):
    ped = lambda j, n: (409, {'ok': True}) if (j.get('doc') or {}).get('tipo') == 'cancel' else ((503, {'ok': False}) if n == 1 else (200, {'ok': True}))
    nv = Nuvem({'pedido': ped}); b, pg, ok = _cart_com_peca(pw, nav, nv, logada=True, **kw); out = []
    try:
        if not ok: return [('compra', NC, 'não deu para pôr uma peça no carrinho')]
        faltou = [s for s in ('[data-cta=prosseguir]', '[data-ent=loja]', '[data-cta=irpag]', '[data-cta=pg][data-v=pix]', '[data-send]') if not toca(pg, s, 2000)]
        pg.wait_for_timeout(2500); P = [k for k in nv.chamadas('pedido') if not (k[2].get('doc') or {}).get('tipo')]
        if faltou: out.append(('compra inteira', NC, 'não achei ' + faltou[0]))
        out.append(('compra: o pedido vai pela porta da nuvem, nunca direto no banco', ACH if any(k[0].startswith('BANCO') for k in nv.R) or not P else OK, '%d chamada(s) ao pedido' % len(P)))
        out.append(('compra: se a nuvem cai, o site tenta de novo sozinho (uma vez)', OK if len(P) == 2 else ACH if P else NC, '%d tentativa(s)' % len(P)))
        d0 = (P[0][2].get('doc') or {}) if P else {}
        out.append(('compra: o pedido leva itens e total', OK if d0.get('itens') and d0.get('total') else ACH if P else NC, ', '.join(sorted(d0))[:80]))
        R = [k for k in nv.chamadas('reserva') if k[2].get('acao') == 'reservar']
        out.append(('compra: a reserva vai com o login e sem o telefone', OK if R and R[0][1].startswith('Bearer') and 'tel' not in R[0][2] else ACH if R else NC, ''))
        F = [k for k in nv.R if not k[0].startswith('BANCO')]
        out.append(('compra: toda chamada à nuvem leva o selo do App Check', OK if F and all(k[3] for k in F) else ACH if F else NC, ', '.join(sorted({k[0] for k in F if not k[3]}))))
        out.append(('compra: aparece a tela de pagar', OK if _vis(pg, '#pkok') else ACH, ''))
    finally: b.close()
    return out
# ---------- 6 espanhol sem português (e fotos que não carregam), nas telas principais ----------
TELAS = [('Início', ''), ('Catálogo', 'catalogo'), ('Peça', 'catalogo#peca'), ('Carrinho com uma peça', 'catalogo#carrinho'), ('Menu', '#menu')]
PT = re.compile(r'[ãõçÃÕÇ]|\b(você|óculos|não|carrinho|obrigad[oa]|também|então)\b', re.I)
def _tela(pw, nav, rota, **kw):
    """Abre uma das telas principais como a cliente chega nela (rota#ação). Devolve (b, pg, ok)."""
    b, pg = lfsite.abre(pw, navegador=nav, rota=rota.split('#')[0], **kw)
    ac = rota.split('#')[1] if '#' in rota else ''
    if ac == 'peca': ok = peca(pg)
    elif ac == 'carrinho': ok = peca(pg) and toca(pg, '[data-addm]', 1500) and toca(pg, '[data-cadfin]', 1500)
    elif ac == 'menu': ok = toca(pg, '#mnb', 800)
    else: ok = True
    return b, pg, bool(ok)
def idioma(pw, nav, **kw):
    out = []
    for nome, rota in TELAS:
        b, pg, ok = _tela(pw, nav, rota, lingua='es', **kw)
        try:
            if not ok: out.append(('espanhol · %s' % nome, NC, 'não deu para abrir a tela como a cliente')); continue
            pg.evaluate("()=>{for(const e of document.querySelectorAll('*'))if(e.scrollHeight>e.clientHeight+20)e.scrollTop=e.scrollHeight;scrollTo(0,document.body.scrollHeight)}"); pg.wait_for_timeout(900)
            T = pg.evaluate("()=>{const T=[],w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const e=n.parentElement;if(!e||e.closest('script,style,[lang^=pt],[translate=no]')||!window.__argus.vis(e))continue;const t=n.textContent.trim();if(t)T.push(t)}return T}")
            pt = sorted({t for t in T if PT.search(t)})
            out.append(('espanhol sem português · %s' % nome, ACH if pt else OK, ' | '.join(pt[:5])[:160]))
            im = pg.evaluate("()=>[...document.querySelectorAll('img')].filter(i=>window.__argus.vis(i)&&i.complete&&i.naturalWidth===0&&i.getAttribute('src')).map(i=>i.getAttribute('src').slice(-40))")
            out.append(('fotos carregam · %s' % nome, ACH if im else OK, ', '.join(im[:4])))
        finally: b.close()
    return out
# ---------- 6b camadas: nada aparece através (o defeito de 25/11: o menu e a peça abriam sem fundo por cima da tela) ----------
def camadas(pw, nav, **kw):
    out = []
    for nome, rota in TELAS:
        b, pg, ok = _tela(pw, nav, rota, **kw)
        try:
            if not ok: out.append(('camadas · %s' % nome, NC, 'não deu para abrir a tela como a cliente')); continue
            x = pg.evaluate('()=>window.__argus.atravessa()')
            out.append(('camadas · %s: nenhum texto aparece através de outro' % nome, ACH if x else OK, ' | '.join('“%s” por cima de “%s”' % (k['cima'], k['baixo']) for k in x[:3])))
        finally: b.close()
    return out
# ---------- 7 internet fraca e sem internet ----------
def rede(pw, nav, **kw):
    out = []; b, pg = lfsite.abre(pw, navegador=nav, **kw)
    try:
        c = pg.context.new_cdp_session(pg); c.send('Network.enable')
        # 4G ruim = a mesma régua do Lighthouse para celular (562,5 ms de espera, 1,47 Mbit/s descendo, 675 kbit/s subindo)
        c.send('Network.emulateNetworkConditions', {'offline': False, 'latency': 562.5, 'downloadThroughput': 1474.56 * 1024 / 8, 'uploadThroughput': 675 * 1024 / 8})
        t0 = time.time(); pg.reload(wait_until='commit')
        try: pg.wait_for_function("[...document.querySelectorAll('[data-open] img')].some(i=>i.complete&&i.naturalWidth>0)", timeout=30000); t = time.time() - t0
        except Exception: t = 99
        out.append(('internet fraca (4G ruim): o primeiro óculos aparece em até 10 s', OK if t <= 10 else ACH, '%.1f s' % t))
        c.send('Network.emulateNetworkConditions', {'offline': False, 'latency': 0, 'downloadThroughput': -1, 'uploadThroughput': -1}); pg.wait_for_timeout(2000)
        pg.context.set_offline(True); abriu = toca(pg, '[data-open]', 1800) and pg.evaluate("()=>location.pathname.startsWith('/p/')")
        out.append(('sem internet: a peça abre (com o que já carregou)', OK if abriu else ACH, '')); pg.context.set_offline(False)
    finally: b.close()
    return out
# ---------- 8 a consulta do Mochi: com e sem câmera chega ao quadro; em segundo plano, ele para de falar ----------
def consulta(pw, nav, **kw):
    out = []
    for cam in (True, False):
        b, pg = lfsite.abre(pw, navegador=nav, rota='descubra-o-grau', **kw)
        try:
            if not cam: pg.context.clear_permissions()
            else: pg.context.grant_permissions(['camera'])
            try: pg.wait_for_function("!!document.querySelector('#gw [data-gz=comeca]')", timeout=12000)
            except Exception: out.append(('consulta %s câmera' % ('com' if cam else 'sem'), NC, 'não achei o começo da consulta')); continue
            toca(pg, '#gw [data-gz=comeca]', 1500)
            if cam and toca(pg, '#gw [data-gz=camsim]', 800): pass
            try: pg.wait_for_function("window.__LFGZ&&['teste','semcam'].includes(__LFGZ.Z.fase)", timeout=45000); chegou = True
            except Exception: chegou = False
            out.append(('consulta %s câmera chega ao quadro' % ('com' if cam else 'sem'), OK if chegou else ACH, pg.evaluate("()=>window.__LFGZ?__LFGZ.Z.fase:'?'")))
            if cam:
                pg.evaluate("()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>'hidden'});Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))}")
                pg.wait_for_timeout(1200); fala = pg.evaluate("()=>{const z=window.__LFGZ&&__LFGZ.Z;return !!(z&&z.m&&z.m.fal)||[...document.querySelectorAll('audio')].some(a=>!a.paused&&!a.ended)}")
                out.append(('consulta em segundo plano: o Mochi para de falar', ACH if fala else OK, ''))
        finally: b.close()
    return out
# ---------- 9 a página por dentro: segurança da página (CSP), robôs, versão, nada em cima da armação ----------
def pagina(pw, nav, **kw):
    out = []; porta = kw.pop('porta', None) or lfsite.porta_hoje(); base = 'http://localhost:%d/' % porta
    import urllib.request
    try: txt = urllib.request.urlopen(base + 'robots.txt', timeout=10).read().decode()
    except Exception: txt = ''
    rp = urllib.robotparser.RobotFileParser(); rp.parse(txt.split('\n'))
    bus = [a for a in ('Googlebot', 'Bingbot') for u in ('/', '/catalogo', '/p/SL2250') if not rp.can_fetch(a, u)]
    ia = [a for a in ('GPTBot', 'CCBot', 'ClaudeBot', 'PerplexityBot', 'Bytespider', 'Google-Extended') if rp.can_fetch(a, '/')]
    out.append(('robots.txt: buscadores leem tudo', OK if txt and not bus else ACH, ', '.join(sorted(set(bus))) or ('sem robots.txt' if not txt else '')))
    out.append(('robots.txt: robôs de IA e de coleta bloqueados', OK if txt and not ia else ACH, ', '.join(ia)))
    adm = urllib.request.urlopen(base + 'admin.html', timeout=10).read().decode('utf-8', 'ignore')
    out.append(('painel (admin) fora dos buscadores (noindex)', OK if re.search(r'name=["\']robots["\'][^>]*noindex', adm) else ACH, ''))
    # a regra de segurança da página (CSP) VALENDO: nada do próprio site pode ser bloqueado por ela
    import sim
    br = sim.navegador(pw); c = sim.contexto(br, 407, 832, toque=True, csp_livre=False, lingua='pt-BR')
    c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push(e.violatedDirective+' '+(e.blockedURI||'')))")
    pg = c.new_page(); V = []
    for rota in ('', 'catalogo', 'descubra-o-grau'):
        pg.goto(base + rota); pg.wait_for_timeout(2000); V += [v for v in pg.evaluate('window.__csp||[]') if 'localhost' in v or v.endswith(' inline') or v.endswith(' eval')]
    br.close()
    out.append(('segurança da página (CSP): nada do próprio site é bloqueado', ACH if V else OK, ' | '.join(sorted(set(V))[:4])))
    b, pg = lfsite.abre(pw, navegador=nav, porta=porta, **kw)
    try:
        r = pg.evaluate("()=>fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>[String(j.v),String(window.LF_BUILD)])")
        out.append(('versão da página = version.json', OK if r[0] == r[1] else ACH, 'página %s · arquivo %s' % (r[1], r[0])))
        s = pg.evaluate(js('selos', 'site'))
        out.append(('nada encosta no desenho da armação nas fotos (selos)', OK if not s['bad'] else ACH, ' | '.join(s['bad'][:3])[:160]))
    finally: b.close()
    return out
# ---------- 10 girar o celular e voltar não deixa a página larga ----------
def girar(pw, nav, **kw):
    out = []; b, pg = lfsite.abre(pw, navegador=nav, **kw)
    try:
        W, H = pg.viewport_size['width'], pg.viewport_size['height']
        for nome, prep in (('Início', None), ('Peça', 'peca'), ('Carrinho', 'cart')):
            pg.set_viewport_size({'width': W, 'height': H}); pg.goto(pg.url.split('/p/')[0].rstrip('/') + '/'); pg.wait_for_timeout(1200)
            if prep == 'peca': toca(pg, '[data-open]', 1600)
            elif prep == 'cart': toca(pg, '#bagbtn', 1000)
            pg.set_viewport_size({'width': H, 'height': W}); pg.wait_for_timeout(900); larga1 = pg.evaluate("()=>document.documentElement.scrollWidth>innerWidth+1")
            pg.set_viewport_size({'width': W, 'height': H}); pg.wait_for_timeout(900); larga2 = pg.evaluate("()=>document.documentElement.scrollWidth>innerWidth+1")
            out.append(('girar e voltar · %s: a página não rola de lado' % nome, ACH if larga1 or larga2 else OK, ('deitado' if larga1 else '') + (' depois de voltar' if larga2 else '')))
    finally: b.close()
    return out
TODAS = [('busca', busca), ('carrinho', carrinho), ('preços', precos), ('cupom', cupom), ('compra pela nuvem', compra), ('idioma e fotos', idioma), ('camadas', camadas),
         ('rede', rede), ('consulta do Mochi', consulta), ('a página por dentro', pagina), ('girar', girar)]
def roda(pw, nav=None, so=None, **kw):
    """Roda as conferências do site (so = só algumas, pelo nome). Devolve {conferência: [(nome, estado, detalhe)]}; uma que quebra
    vira 'não conferido' com o motivo (nunca some)."""
    R = {}
    for nome, f in TODAS:
        if so and nome not in so: continue
        try: R[nome] = f(pw, nav, **kw)
        except Exception as e: R[nome] = [(nome, NC, 'a conferência quebrou: %s' % str(e).split('\n')[0][:140])]
    return R
