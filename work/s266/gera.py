# S266 · (1) Produtos = Inventário + Catálogo num cartão só, com desenho de luxo · (2) ícone do grupo na barra do mesmo tamanho dos outros
# · (3) junção de botões (grupo) como UMA tela que rola, regra geral para qualquer combinação (exemplo novo: Pedidos + Loja).  python3 gera.py
import os, subprocess, sys, time
src = open(os.path.dirname(os.path.abspath(__file__)) + '/../s265/gera.py').read(); exec(src[:src.index('srv = subprocess')].replace("'s265_%s.jpg'", "'s266_%s.jpg'"))
A = os.path.dirname(os.path.abspath(__file__)) + '/'
CSSP = """#v-estoque #kpisE{display:none!important}
#v-estoque #rows{display:grid!important;grid-template-columns:1fr 1fr;gap:14px 12px}
#v-estoque #rows .pcard{background:var(--panel)!important;border:0!important;border-radius:18px!important;padding:8px 8px 12px!important;box-shadow:0 1px 2px rgba(42,31,39,.05),0 12px 26px -22px rgba(42,31,39,.35)!important;display:flex;flex-direction:column;gap:2px;text-align:left;position:relative;min-height:0}
#v-estoque #rows .pcard .pbox{aspect-ratio:1/1;border-radius:12px;margin:0 0 8px;width:100%;display:grid;place-items:center;overflow:hidden}
#v-estoque #rows .pcard .pbox.s6v{background:color-mix(in srgb,var(--fg) 5%,transparent);color:color-mix(in srgb,var(--fg) 38%,transparent)}
#v-estoque #rows .pcard>b{font:600 14px/1.3 Inter,system-ui,sans-serif;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em;padding:0 4px}
#v-estoque #rows .pcard .s{font:400 12.5px/1.35 Inter,system-ui,sans-serif;opacity:.64;padding:0 4px}
#v-estoque #rows .pcard .s~.s,#v-estoque #rows .pcard .cell{display:none!important}
#v-estoque #rows .pcard .zp{padding:6px 4px 0;font:700 15.5px Inter,system-ui,sans-serif;color:var(--fg);font-variant-numeric:tabular-nums;min-height:38px;display:flex;align-items:center;gap:6px}
#v-estoque #rows .pcard .s6p{position:absolute;right:8px;bottom:10px;width:38px;height:38px;border-radius:50%;border:1px solid color-mix(in srgb,var(--fg) 24%,transparent);display:grid;place-items:center;font:400 22px/1 Inter,system-ui,sans-serif;font-style:normal;color:var(--fg)}
#v-estoque #rows .pcard .s6p::after{content:'';position:absolute;inset:-4px}
.s6w{display:flex!important;align-items:center;justify-content:space-between;min-height:46px;padding:0 2px!important;margin:2px 0 12px!important;background:transparent!important;border:0!important;border-bottom:1px solid var(--line)!important;border-radius:0!important;box-shadow:none!important;font:500 14.5px Inter,system-ui,sans-serif}
.s6w>*:first-child{display:none!important}"""
PROD = """()=>{const v=document.querySelector('#v-estoque');v.querySelector('.top h1').textContent='Produtos';const cr=v.querySelector('.top .crumb');if(cr)cr.textContent='Vender, estoque e fotos de cada peça.';
 document.querySelectorAll('#mainnav .mn').forEach(b=>{if(b.dataset.id=='vendas')b.style.display='none';if(b.dataset.id=='estoque')b.lastElementChild.textContent='Produtos'});
 const lf=[...v.querySelectorAll('.main *')].find(e=>e.children.length==0&&/^\\d+ peças/.test(e.textContent.trim()));if(lf)lf.textContent='470 em estoque · 16 referências';
 const w=[...v.querySelectorAll('.main *')].find(e=>/preços para corrigir/.test(e.textContent)&&/Corrigir/.test(e.textContent)&&![...e.children].some(c=>/preços para corrigir/.test(c.textContent)&&/Corrigir/.test(c.textContent)));
 if(w){w.classList.add('s6w');[...w.querySelectorAll('*')].forEach(e=>{if(e.children.length==0&&/perto do mínimo|abaixo do|sem custo/.test(e.textContent))e.style.display='none'})}
 v.querySelectorAll('#rows .pcard').forEach(c=>{if(c.querySelector('.s6p'))return;if(!c.querySelector('.pbox')){const d=document.createElement('div');d.className='pbox s6v';d.innerHTML='<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5l9-4.5 9 4.5v9l-9 4.5-9-4.5zM3 7.500l9 4.500 9-4.500M12 12v9"/></svg>';c.insertBefore(d,c.firstChild)}
  const s=c.querySelector('.s'),e=c.querySelector('.cell'),cod=s?s.textContent.replace('Código ','').trim():'',est=e?e.textContent.trim():'';if(s)s.textContent=[cod,est].filter(Boolean).join(' · ');else if(e){const n=document.createElement('span');n.className='s';n.textContent=est;c.insertBefore(n,c.querySelector('.zp'))}
  if(!c.querySelector('.zp')){const z=document.createElement('div');z.className='zp';z.innerHTML='<span>G$ 25.000</span>';c.appendChild(z)}
  const p=document.createElement('i');p.className='s6p';p.setAttribute('aria-label','Vender');p.textContent='+';c.appendChild(p)})}"""
GRUPOS = """()=>{const S=window.__LF.S;S.grupos=[{id:'g:a',nome:'Dinheiro',itens:['caixa','desp','fx']},{id:'g:b',nome:'Vendas',itens:['hoje','hist']}];S.barra=['estoque','g:b','g:a','ajustes'];window.__LF.setView('inicio')}"""
JUNTA = """([base,outros,nome,desc,nomes])=>{const v=document.querySelector('#v-'+base),L=t=>{const d=document.createElement('div');d.className='s5l';d.textContent=t;return d},B=t=>{const b=document.createElement('button');b.className='s5v';b.type='button';b.textContent=t;return b};
 const corta=(el,fs,max)=>{let h=0,n=0;fs.forEach(c=>{const r=c.getBoundingClientRect().height;if(!r)return;if(h+r>max&&n>0)c.style.display='none';else{h+=r;n++}})};
 const h1=v.querySelector('.top h1');if(h1)h1.textContent=nome;const cr=v.querySelector('.top .crumb');if(cr)cr.textContent=desc;const g=document.querySelector('#grpTabs');if(g)g.hidden=true;
 const fs=[...v.children].filter(c=>!c.classList.contains('top'));const l0=L(nomes[0]);v.insertBefore(l0,fs[0]);corta(v,fs,560);v.appendChild(B('Ver tudo em '+nomes[0]+' ›'));
 outros.forEach((o,i)=>{const C=window['__c_'+o];v.appendChild(L(nomes[i+1]));const ks=[...C.children].filter(c=>!c.classList.contains('top'));const ad=ks.map(c=>v.appendChild(c.cloneNode(true)));corta(v,ad,560);v.appendChild(B('Ver tudo em '+nomes[i+1]+' ›'))});
 return [...v.querySelectorAll('.s5l')].map(e=>Math.round(e.getBoundingClientRect().top+scrollY))}"""
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8852', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for sc in ('light', 'dark'):
        suf = '' if sc == 'light' else '_escuro'; er = []
        def abre():
            c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, color_scheme=sc, is_mobile=True, has_touch=True, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg = c.new_page(); pg.on('pageerror', lambda e: er.append(str(e)[:80])); pg.goto('http://localhost:8852/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(700); return c, pg
        def foto(pg, y=None, clip=None):
            if y is not None: pg.evaluate("y=>{y=Math.max(0,Math.min(y,document.scrollingElement.scrollHeight-innerHeight));window.scrollTo(0,y)}", y); pg.wait_for_timeout(800)
            pg.screenshot(path='/tmp/s266.png', **({'clip': clip} if clip else {})); x = Image.open('/tmp/s266.png').convert('RGB'); return x if clip else x.resize((370, int(x.height * 370 / x.width)), Image.LANCZOS)
        ver = lambda pg, v: (pg.evaluate("v=>window.__LF.setView(v)", v), pg.wait_for_timeout(1000))
        olho = lambda pg: {x['r']: x['n'] for x in pg.evaluate(OLHO)}
        barra = {'x': 0, 'y': 770, 'width': 390, 'height': 74}
        # hoje
        c, pg = abre(); ver(pg, 'estoque'); h0 = foto(pg, 0); o0 = olho(pg); h1 = foto(pg, 560); ver(pg, 'clientes'); hp = foto(pg, 0); op = olho(pg); alt_h = [pg.evaluate("v=>{window.__LF.setView(v);return new Promise(r=>setTimeout(()=>r(Math.round(document.querySelector('#v-'+v).getBoundingClientRect().height)),900))}", v) for v in ('clientes', 'hist')]
        pg.evaluate(GRUPOS); pg.wait_for_timeout(1000); bh = foto(pg, 0, barra); med_h = pg.evaluate("[...document.querySelectorAll('#mainnav .mn')].map(b=>{const r=b.querySelector('svg').getBoundingClientRect();return Math.round(r.width)})"); nome = pg.evaluate("window.__LF.grpNomeSugerido('cli','hist')"); c.close()
        # proposta
        c, pg = abre(); pg.add_style_tag(content=CSS + CSSP); ver(pg, 'estoque'); pg.evaluate(PROD); pg.wait_for_timeout(400); p0 = foto(pg, 0); o1 = olho(pg); p1 = foto(pg, 560)
        folha('app_produtos' + suf, 'App · Produtos (Inventário + Catálogo) · celular', 'A peça aparece logo na 1ª tela. Cartão único: foto, nome, código · estoque, preço e "+" para vender. Tocar no cartão abre a ficha.', [('HOJE · Inventário', V, h0), ('HOJE · rolando', V, h1), ('PROPOSTA', G, p0), ('PROPOSTA · rolando', G, p1)])
        ver(pg, 'hist'); pg.wait_for_timeout(800); pg.evaluate(GUARDA, 'hist'); ver(pg, 'clientes'); ys = pg.evaluate(JUNTA, ['clientes', ['hist'], nome or 'Clientes e Histórico', 'Quem compra e o que já foi vendido.', ['Clientes', 'Histórico']]); pg.wait_for_timeout(300); alt_p = pg.evaluate("Math.round(document.querySelector('#v-clientes').getBoundingClientRect().height)"); j0 = foto(pg, 0); oj = olho(pg); j1 = foto(pg, ys[1] - 150)
        folha('app_grupo_tela_unica' + suf, 'App · grupo como uma tela só · ex.: Clientes + Histórico', 'Regra para qualquer junção: nome no título, um bloco de cada tela e "Ver tudo". Hoje %d px somados; proposta %d px.' % (sum(alt_h), alt_p), [('HOJE · Clientes', V, hp), ('PROPOSTA · "%s"' % (nome or 'Clientes e Histórico'), G, j0), ('PROPOSTA · rolando', G, j1)])
        pg.add_style_tag(content='#mainnav .mn .mi svg{width:22px!important;height:22px!important}'); pg.evaluate(GRUPOS); pg.wait_for_timeout(1000); bp = foto(pg, 0, barra); med_p = pg.evaluate("[...document.querySelectorAll('#mainnav .mn')].map(b=>{const r=b.querySelector('svg').getBoundingClientRect();return Math.round(r.width)})")
        folha('app_barra_icone_grupo' + suf, 'App · menu rápido · ícone do grupo', 'Ícone de grupo hoje: %d px (os outros: %d px) e o nome fica mais baixo. Proposta: %d px, nomes na mesma linha.' % (med_h[2], med_h[1], med_p[2]), [('HOJE', V, bh.resize((780, 148))), ('PROPOSTA', G, bp.resize((780, 148)))])
        c.close(); print(sc, 'erros JS:', er[:2], '· olho pioras · produtos:', [(r, o0.get(r, 0), n) for r, n in o1.items() if n > o0.get(r, 0)], '· grupo:', [(r, op.get(r, 0), n) for r, n in oj.items() if n > op.get(r, 0)], '· nome sugerido:', nome, flush=True)
finally: srv.terminate()
