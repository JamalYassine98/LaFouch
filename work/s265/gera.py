# S265 · esboço dos itens 12 e 13 de docs/FALTA-APROVAR-13-11.md (aprovados sem esboço). Telas reais do app; só entra o que muda.
#  13 · junções: "Vendas" (Dia + Histórico + Números), "Dinheiro" (Caixa + Despesas + Câmbio), Guardião dentro de Pendências (Início fica com 1 linha)
#  12 · backup por mudança: janela "Voltar no tempo" com degraus de tempo e "restaurar só esta peça" (dados de exemplo).   python3 gera.py
import os, subprocess, sys, time
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
OLHO = open(A + '../kit/olho.js').read(); V, G = '#b42318', '#1f8a4c'
CSS = """.s5l{font:600 12px Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;opacity:.62;margin:26px 2px 10px}
.s5v{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-height:46px;margin:6px 0 2px;border:0;background:transparent;color:var(--fg,inherit);font:600 15px Inter,system-ui,sans-serif}
.s5g{display:flex!important;flex-direction:row!important;align-items:center;justify-content:space-between;min-height:56px;padding-top:0!important;padding-bottom:0!important}
.vt{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:58px;padding:8px 0;border-top:1px solid var(--line);font:500 15px Inter,system-ui,sans-serif;color:var(--fg,inherit)}
.vt small{display:block;font:400 13px Inter,system-ui,sans-serif;opacity:.66;margin-top:2px}.vt i{font-style:normal;opacity:.5;font-size:18px}
.vtl{font:600 12px Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;opacity:.62;margin:18px 0 6px}
.vtt{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:0;font:500 15px Inter,system-ui,sans-serif;color:var(--fg,inherit)}.vtt>*{padding:11px 0;border-top:1px solid var(--line)}.vtt>.h{font:600 12px Inter,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;opacity:.62;border-top:0}.vtt .m{font-weight:700}
.vtb{width:100%;min-height:48px;border-radius:999px;background:transparent;color:var(--fg,inherit);border:1px solid color-mix(in srgb,currentColor 26%,transparent);font:600 15px Inter,system-ui,sans-serif;margin-top:16px}
body.s5ini #v-inicio .guardC>*:not(.guardT){display:none!important}body.s5ini #v-inicio .guardC{padding-top:0!important;padding-bottom:0!important}body.s5ini #v-inicio .guardC .guardT{display:flex;align-items:center;min-height:56px;border:0!important;margin:0!important;padding-top:0!important;padding-bottom:0!important}body.s5ini #v-inicio .guardC .guardT::after{content:'›';margin-left:auto;font-size:22px;opacity:.5}
.vtn{font:400 13.5px/1.45 Inter,system-ui,sans-serif;opacity:.7;margin:12px 0 0;color:var(--fg,inherit)}"""
GUARDA = """v=>{const e=document.querySelector('#v-'+v);window['__c_'+v]=e.cloneNode(true)}"""   # guarda a tela já desenhada para reaproveitar os blocos reais
CORTA = """([el,max])=>{let h=0,n=0;[...el.children].forEach(c=>{const r=c.getBoundingClientRect().height;if(h+r>max&&n>0){c.style.display='none'}else{h+=r;n++}})}"""
VENDAS = """()=>{const v=document.querySelector('#v-dia'),H=window.__c_hist,D=window.__c_dash,L=t=>{const d=document.createElement('div');d.className='s5l';d.textContent=t;return d},B=t=>{const b=document.createElement('button');b.className='s5v';b.type='button';b.textContent=t;return b};
 const top=H.querySelector('.top').cloneNode(true);top.querySelector('h1').textContent='Vendas';const cr=top.querySelector('.crumb');if(cr)cr.textContent='O dia, os dias anteriores e os números do mês.';v.insertBefore(top,v.firstChild);
 const f=[...v.children],cam=f.find(c=>/^Câmbio do dia/.test(c.textContent.trim())),des=f.find(c=>/^Despesas do dia/.test(c.textContent.trim())),vd=f.find(c=>/^Vendas do dia/.test(c.textContent.trim()));[cam,des].forEach(c=>c&&(c.style.display='none'));
 if(vd){let h=0,n=0;[...vd.children].forEach(c=>{const r=c.getBoundingClientRect().height;if(h+r>470&&n>1)c.style.display='none';else{h+=r;n++}});vd.appendChild(B('Ver as 11 vendas do dia ›'))}
 v.appendChild(L('Dias anteriores'));const hr=H.querySelector('#hRes'),re=/^\d\d\/\d\d[\s\S]*venda\(s\)/,ds=[...hr.querySelectorAll('*')].filter(e=>re.test(e.textContent.trim())&&![...e.children].some(c=>re.test(c.textContent.trim())));ds.slice(1,4).forEach(c=>v.appendChild(c.cloneNode(true)));v.appendChild(B('Ver todos os dias ›'));
 v.appendChild(L('Números do mês'));const db=D.querySelector('#dtabBody');const cards=db.children.length>1?[...db.children]:[...db.firstElementChild.children];cards.slice(0,3).forEach(c=>v.appendChild(c.cloneNode(true)));v.appendChild(B('Ver todos os números ›'));
 return [...v.querySelectorAll('.s5l')].map(e=>Math.round(e.getBoundingClientRect().top+scrollY))}"""
DINHEIRO = """()=>{const v=document.querySelector('#v-caixa'),P=window.__c_desp,X=window.__c_fx,L=t=>{const d=document.createElement('div');d.className='s5l';d.textContent=t;return d},B=t=>{const b=document.createElement('button');b.className='s5v';b.type='button';b.textContent=t;return b};
 v.querySelector('.top h1').textContent='Dinheiro';const cr=v.querySelector('.top .crumb');if(cr)cr.textContent='Caixa, contas do mês e câmbio.';document.querySelectorAll('#mainnav .mn').forEach(b=>{if(b.dataset.id=='caixa')b.lastElementChild.textContent='Dinheiro'});
 const mv=[...v.children].find(c=>/^Movimentos/.test(c.textContent.trim()));if(mv){let h=0,n=0;[...mv.children].forEach(c=>{const r=c.getBoundingClientRect().height;if(h+r>300&&n>1)c.style.display='none';else{h+=r;n++}});mv.appendChild(B('Ver todos os movimentos ›'))}
 v.appendChild(L('Contas do mês'));v.appendChild(P.querySelector('.kpis').cloneNode(true));v.appendChild([...P.children].find(c=>/^Contas para pagar/.test(c.textContent.trim())).cloneNode(true));v.appendChild(B('Ver todas as despesas ›'));
 v.appendChild(L('Câmbio'));v.appendChild(X.querySelector('.fxTop').cloneNode(true));v.appendChild(X.querySelector('.fxRepo').cloneNode(true));v.appendChild(B('Ver câmbio e trocas ›'));
 return [...v.querySelectorAll('.s5l')].map(e=>Math.round(e.getBoundingClientRect().top+scrollY))}"""
INICIO = """()=>{document.body.classList.add('s5ini')}"""
PEND = """()=>{const v=document.querySelector('#v-notif'),l=v.querySelector('.lbl');l.textContent='Guardião · precisa de você agora · 5';const cs=[...v.querySelectorAll('.card')],m=cs.find(c=>/^Conferir o caixa/.test(c.textContent.trim())),n=m.cloneNode(true);
 const tx=[...n.querySelectorAll('*')].filter(e=>e.children.length==0&&e.textContent.trim());tx[0].textContent='Peça sem custo (lucro errado) · 11';tx[1].textContent='SP57765, SP58110, SP60627';tx[tx.length-1].textContent='Ver';m.parentElement.insertBefore(n,m.nextSibling)}"""
JAN = """([tit,corpo,volta])=>{const m=document.querySelector('#addModal');m.querySelector('#addTitle').textContent=tit;const bk=m.querySelector('#addBack');if(bk)bk.hidden=!volta;const bx=m.querySelector('.modal-box');[...bx.children].forEach(c=>{if(!c.classList.contains('mhead')&&c.id!='s5j')c.style.display='none'});let d=bx.querySelector('#s5j');if(!d){d=document.createElement('div');d.id='s5j';bx.appendChild(d)}d.innerHTML=corpo}"""
LINHA = lambda a, b, c='›': '<div class="vt"><div>%s<small>%s</small></div><i>%s</i></div>' % (a, b, c)
TEMPO = ('<p class="vtn" style="margin-top:0">Cada mudança de produto fica guardada. Toque numa para ver e desfazer só ela.</p><div class="vtl">Hoje · cada mudança</div>'
         + LINHA('SL2201 C6 · preço', '14:32 · G$ 45.000 → G$ 48.000') + LINHA('BR44118 Preto · estoque', '11:05 · 9 → 8 (venda)') + LINHA('SP58110 · foto trocada', '09:40')
         + '<div class="vtl">Últimos 7 dias · 1 cópia por dia</div>' + LINHA('Ontem, 13/11', '6 mudanças') + LINHA('Quinta, 12/11', '2 mudanças')
         + '<div class="vtl">Este mês · 1 cópia por semana</div>' + LINHA('Semana de 2/11', '31 mudanças')
         + '<div class="vtl">Mais antigo · 1 cópia por mês</div>' + LINHA('Outubro de 2026', 'como a loja fechou o mês'))
PECA = ('<p class="vtn" style="margin-top:0">Mudança de hoje às 14:32, neste celular.</p><div class="vtt" style="margin-top:10px"><div class="h"></div><div class="h">Antes</div><div class="h">Agora</div>'
        '<div>Preço</div><div class="m">G$ 45.000</div><div class="m">G$ 48.000</div><div>Estoque</div><div>4</div><div>4</div><div>Fotos</div><div>3</div><div>3</div></div>'
        '<button class="vtb" type="button">Restaurar só esta peça</button><p class="vtn">Volta o preço para G$ 45.000. As outras peças, as vendas e o caixa não mudam. Dá para desfazer em Voltar no tempo.</p>')
def folha(nome, tit, sub, pecas):
    Wt = sum(p[2].width for p in pecas) + 30 * (len(pecas) - 1) + 80; Ht = 150 + max(p[2].height for p in pecas) + 40
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 24), tit, font=F(30, 1), fill='#2a1a28'); d.text((40, 68), sub, font=F(19), fill='#5b4a56'); x = 40
    for rot, cor, im in pecas:
        d.text((x, 108), rot, font=F(19, 1), fill=cor); B.paste(im, (x, 140)); d.rectangle((x - 1, 139, x + im.width, 140 + im.height), outline='#c9bcc5'); x += im.width + 30
    B.save(A + 's265_%s.jpg' % nome, quality=85); print('ok', nome, B.size, flush=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8851', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for sc in ('light', 'dark'):
        suf = '' if sc == 'light' else '_escuro'; er = []
        def abre():
            c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, color_scheme=sc, is_mobile=True, has_touch=True, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg = c.new_page(); pg.on('pageerror', lambda e: er.append(str(e)[:80])); pg.goto('http://localhost:8851/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(700); return c, pg
        def foto(pg, y=None):
            if y is not None: pg.evaluate("y=>{y=Math.max(0,Math.min(y,document.scrollingElement.scrollHeight-innerHeight));window.scrollTo(0,y)}", y); pg.wait_for_timeout(800)
            pg.screenshot(path='/tmp/s265.png'); x = Image.open('/tmp/s265.png').convert('RGB'); return x.resize((370, int(x.height * 370 / x.width)), Image.LANCZOS)
        ver = lambda pg, v: (pg.evaluate("v=>window.__LF.setView(v)", v), pg.wait_for_timeout(900))
        olho = lambda pg: {x['r']: x['n'] for x in pg.evaluate(OLHO)}
        c, pg = abre(); H = {}; O = {}
        for v in ('dia', 'caixa', 'inicio', 'notif'): ver(pg, v); H[v] = foto(pg, 0); O[v] = olho(pg)
        ver(pg, 'ajustes'); pg.evaluate("[...document.querySelectorAll('#ajGrp .ajS')].find(e=>e.textContent.includes('Cópias e nuvem')).querySelector('.ajR').click()"); pg.wait_for_timeout(700); pg.evaluate("[...document.querySelectorAll('#ajGrp .ajS')].find(e=>e.textContent.includes('Cópias e nuvem')).scrollIntoView({block:'start'});scrollBy(0,-90)"); pg.wait_for_timeout(300); H['nuvem'] = foto(pg)
        hl = {v: pg.evaluate("v=>{window.__LF.setView(v);return new Promise(r=>setTimeout(()=>r(Math.round(document.querySelector('#v-'+v).getBoundingClientRect().height)),800))}", v) for v in ('dia', 'hist', 'dash', 'caixa', 'desp', 'fx')}; c.close()
        c, pg = abre(); pg.add_style_tag(content=CSS); P = {}; D = {}
        for v in ('hist', 'dash', 'desp', 'fx'): ver(pg, v); pg.wait_for_timeout(1500); pg.evaluate(GUARDA, v)
        ver(pg, 'dia'); ys = pg.evaluate(VENDAS); pg.wait_for_timeout(300); alt = pg.evaluate("Math.round(document.querySelector('#v-dia').getBoundingClientRect().height)"); P['v0'] = foto(pg, 0); D['dia'] = olho(pg); P['v1'] = foto(pg, ys[0] - 150); P['v2'] = foto(pg, ys[1] - 150)
        folha('app_vendas' + suf, 'App · "Vendas" = Dia + Histórico + Números (uma tela que rola)', 'Hoje são 3 telas com %d px de rolagem somadas; a proposta tem %d px e cada parte abre inteira em "Ver todos".' % (hl['dia'] + hl['hist'] + hl['dash'], alt), [('HOJE · Dia', V, H['dia']), ('PROPOSTA · topo', G, P['v0']), ('PROPOSTA · rolando', G, P['v1']), ('PROPOSTA · fim', G, P['v2'])])
        ver(pg, 'caixa'); ys = pg.evaluate(DINHEIRO); pg.wait_for_timeout(300); alt2 = pg.evaluate("Math.round(document.querySelector('#v-caixa').getBoundingClientRect().height)"); P['d0'] = foto(pg, 0); D['caixa'] = olho(pg); P['d1'] = foto(pg, ys[0] - 150); P['d2'] = foto(pg, ys[1] - 150)
        folha('app_dinheiro' + suf, 'App · "Dinheiro" = Caixa + Despesas + Câmbio (uma tela que rola)', 'Hoje são 3 telas com %d px somadas; a proposta tem %d px. O item "Caixa" da barra passa a se chamar "Dinheiro".' % (hl['caixa'] + hl['desp'] + hl['fx'], alt2), [('HOJE · Caixa', V, H['caixa']), ('PROPOSTA · topo', G, P['d0']), ('PROPOSTA · rolando', G, P['d1']), ('PROPOSTA · fim', G, P['d2'])])
        ver(pg, 'inicio'); pg.evaluate(INICIO); pg.wait_for_timeout(300); P['i'] = foto(pg, 0); D['inicio'] = olho(pg)
        folha('app_inicio_guardiao' + suf, 'App · Início · Guardião em uma linha', 'A lista sai do Início (ela repete as Pendências). A linha leva às Pendências.', [('HOJE', V, H['inicio']), ('PROPOSTA', G, P['i'])])
        ver(pg, 'notif'); pg.evaluate(PEND); pg.wait_for_timeout(300); P['n'] = foto(pg, 0); D['notif'] = olho(pg)
        folha('app_pendencias' + suf, 'App · Pendências com o Guardião dentro', 'Uma lista só: o que o Guardião achava e só aparecia no Início entra aqui (ex.: peça sem custo).', [('HOJE', V, H['notif']), ('PROPOSTA', G, P['n'])])
        ver(pg, 'estoque'); pg.click('#btnAdd'); pg.wait_for_timeout(800); pg.evaluate(JAN, ['Voltar no tempo', TEMPO, False]); pg.wait_for_timeout(300); P['t'] = foto(pg); D['jan'] = olho(pg); pg.evaluate(JAN, ['SL2201 C6 · Dourado', PECA, True]); pg.wait_for_timeout(300); P['p'] = foto(pg)
        folha('app_voltar_no_tempo' + suf, 'App · Cópias e nuvem · "Voltar no tempo" e restaurar uma peça', 'Degraus: hoje cada mudança, 7 dias uma cópia por dia, depois por semana e por mês. Dados de exemplo.', [('HOJE · Ajustes › Cópias e nuvem', V, H['nuvem']), ('PROPOSTA · Voltar no tempo', G, P['t']), ('PROPOSTA · uma mudança', G, P['p'])])
        c.close(); print(sc, 'erros JS:', er[:2], '· olho pioras:', {v: [(r, O[v].get(r, 0), n) for r, n in D[v].items() if n > O[v].get(r, 0)] for v in O}, '· janela:', D['jan'], flush=True)
finally: srv.terminate()
