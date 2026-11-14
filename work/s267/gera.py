# S267 · Catálogo × Inventário × Estúdio: cada um com um papel só. Hoje a ficha da peça é a MESMA tela nos dois (5 abas: Vender, Estoque, Histórico, Site, Preço).
# Proposta: Catálogo = só vender (sem abas, com "Ver ficha no Inventário"); Inventário = só a peça (sem aba Vender nem botão flutuante, com "Vender no Catálogo").  python3 gera.py
import os, subprocess, sys, time
src = open(os.path.dirname(os.path.abspath(__file__)) + '/../s265/gera.py').read(); exec(src[:src.index('srv = subprocess')].replace("'s265_%s.jpg'", "'s267_%s.jpg'"))
A = os.path.dirname(os.path.abspath(__file__)) + '/'
CSS7 = CSS + """.s7l{display:flex;align-items:center;justify-content:center;gap:6px;min-height:46px;width:100%;margin:10px 0 0;border:0;background:transparent;color:var(--fg,inherit);font:500 14px Inter,system-ui,sans-serif}"""
ABAS = """()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width&&['Vender','Estoque','Site','Preço'].includes(b.textContent.trim()));const row=bs[0]&&bs[0].parentElement;return row?[...row.children].map(b=>b.textContent.trim()):[]}"""
CAT = """()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width&&['Vender','Estoque','Site','Preço'].includes(b.textContent.trim()));const row=bs[0].parentElement;row.style.display='none';
 const p=row.parentElement,l=document.createElement('button');l.type='button';l.className='s7l';l.textContent='Ver a ficha desta peça no Inventário ›';p.appendChild(l);return Math.round(l.getBoundingClientRect().top+scrollY)}"""
INV = """()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width&&['Vender','Estoque','Site','Preço'].includes(b.textContent.trim()));const row=bs[0].parentElement;[...row.children].forEach(b=>{if(b.textContent.trim()=='Vender')b.style.display='none'});
 [...document.querySelectorAll('button')].forEach(b=>{if(b.textContent.trim()=='Vender esta')b.style.display='none'});[...document.querySelectorAll('*')].forEach(e=>{if(e.children.length==0&&/Toque num grau para escolher o que vender/.test(e.textContent))e.style.display='none'});
 const p=row.parentElement,l=document.createElement('button');l.type='button';l.className='s7l';l.textContent='Vender esta peça no Catálogo ›';p.appendChild(l)}"""
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8853', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for sc in ('light', 'dark'):
        suf = '' if sc == 'light' else '_escuro'; er = []; im = {}; ol = {}
        for modo in ('hoje', 'prop'):
            c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, color_scheme=sc, is_mobile=True, has_touch=True, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg = c.new_page(); pg.on('pageerror', lambda e: er.append(str(e)[:80])); pg.goto('http://localhost:8853/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(700)
            if modo == 'prop': pg.add_style_tag(content=CSS7)
            def foto(y=0):
                pg.evaluate("y=>{y=Math.max(0,Math.min(y,document.scrollingElement.scrollHeight-innerHeight));window.scrollTo(0,y)}", y); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/s267.png'); x = Image.open('/tmp/s267.png').convert('RGB'); return x.resize((370, int(x.height * 370 / x.width)), Image.LANCZOS)
            for v, lista, js in (('vendas', '#vRows', CAT), ('estoque', '#rows', INV)):
                pg.evaluate("v=>window.__LF.setView(v)", v); pg.wait_for_timeout(900); pg.evaluate("s=>document.querySelector(s+' .pcard[data-ref=SP58110]').click()", lista); pg.wait_for_timeout(1200)
                if modo == 'hoje': print('  abas hoje em', v, pg.evaluate(ABAS))
                else: pg.evaluate(js); pg.wait_for_timeout(400)
                im[v, modo, 0] = foto(0); ol[v, modo] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; im[v, modo, 1] = foto(620)
            c.close()
        folha('app_catalogo_peca' + suf, 'App · Catálogo › peça · só vender', 'Hoje a peça abre com as 5 abas do Inventário. Proposta: sem abas; o resto fica a um toque, no Inventário.', [('HOJE', V, im['vendas', 'hoje', 0]), ('HOJE · rolando', V, im['vendas', 'hoje', 1]), ('PROPOSTA', G, im['vendas', 'prop', 0]), ('PROPOSTA · rolando', G, im['vendas', 'prop', 1])])
        folha('app_inventario_peca' + suf, 'App · Inventário › peça · só a ficha', 'Saem a aba "Vender" e o botão flutuante "Vender esta"; vender fica a um toque, no Catálogo.', [('HOJE', V, im['estoque', 'hoje', 0]), ('HOJE · rolando', V, im['estoque', 'hoje', 1]), ('PROPOSTA', G, im['estoque', 'prop', 0]), ('PROPOSTA · rolando', G, im['estoque', 'prop', 1])])
        print(sc, 'erros JS:', er[:2], '· olho pioras:', {v: [(r, ol[v, 'hoje'].get(r, 0), n) for r, n in ol[v, 'prop'].items() if n > ol[v, 'hoje'].get(r, 0)] for v in ('vendas', 'estoque')}, flush=True)
finally: srv.terminate()
