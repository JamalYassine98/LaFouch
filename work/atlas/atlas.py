# ATLAS DO SITE (13/11/2026): mede o site real em todos os aparelhos, parado e em movimento. Só leitura.
#   python3 atlas.py 0 4   → aparelhos 0..3 (roda em partes, em paralelo) ; python3 atlas.py junta → escreve atlas.json
import sys, json, glob, os
A = os.path.dirname(os.path.abspath(__file__)) + '/'
AP = [('celular pequeno',320,568,2),('celular',360,640,3),('celular alto',360,800,3),('iPhone',390,844,3),('celular grande',412,915,2.6),('iPhone Max',430,932,3),('celular deitado',844,390,3),('tablet pequeno',600,960,2),
      ('iPad em pé',768,1024,2),('iPad Air em pé',820,1180,2),('iPad deitado',1024,768,2),('notebook pequeno',1280,720,1),('notebook',1366,768,1),('notebook grande',1536,864,1.25),('monitor',1920,1080,1),('monitor 2K',2560,1440,1)]
FOTO = {320, 390, 844, 768, 1366, 2560}
ABRE = "()=>{const c=document.querySelector('#grid .card .open');c&&c.click()}"
TEL = [('inicio','',[]),('catalogo','?r=armazones',[]),('peca','?r=armazones',[ABRE]),('menu','',["()=>document.querySelector('#mnb').click()"]),
       ('filtros','?r=armazones',["()=>{const f=document.querySelector('.lfgf');f&&f.click()}"]),('carrinho','?r=armazones',[ABRE,"()=>{const b=document.querySelector('#layer .bb');b&&b.click()}"])]
MED = """()=>{const W=innerWidth,H=innerHeight,q=s=>document.querySelector(s),R=e=>{if(!e)return null;const r=e.getBoundingClientRect();return r.width?[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]:null},F=e=>e?parseFloat(getComputedStyle(e).fontSize):null;
 const col=s=>{const c=[...document.querySelectorAll(s)].filter(e=>e.getBoundingClientRect().width);if(!c.length)return null;const t=c[0].getBoundingClientRect().top;const l=c.filter(e=>Math.abs(e.getBoundingClientRect().top-t)<3);const r0=l[0].getBoundingClientRect();return {colunas:l.length,largura:Math.round(r0.width),altura:Math.round(r0.height),margem:Math.round(r0.left),vao:l[1]?Math.round(l[1].getBoundingClientRect().left-r0.right):null}};
 const b=[...document.querySelectorAll('#layer .bb')].find(e=>e.getBoundingClientRect().width);
 return {W,H,zoom:getComputedStyle(document.body).zoom,topo:R(q('.top')),grade:col('#grid .card'),vitrine:col('#home .hc'),categorias:col('#home .hcat a'),destaque:R(q('#hdst')),fotoDestaque:R(q('#hdst .hdi img')),whatsapp:R(q('a.wa')),comprar:R(b),comprarNaTela:b?b.getBoundingClientRect().bottom<=H:null,
  letras:{corpo:F(document.body),titulo:F(q('#hdst h1')),secao:F(q('.h2')),catalogo:F(q('#vtitT')),peca:F(q('#layer h2')),nomeCartao:F(q('#grid .card .nm')),preco:F(q('#grid .card .pr'))},mnb:R(q('#mnb')),alturaPagina:document.documentElement.scrollHeight}}"""
MOV = """()=>{const o={};document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;const s=getComputedStyle(e);const n=(e.id?'#'+e.id:'.'+String(e.className.baseVal!==undefined?e.className.baseVal:e.className).split(' ')[0]);
 if(s.animationName!=='none'){o['anim '+s.animationName+' '+s.animationDuration+' '+s.animationIterationCount]=n}
 const d=Math.max(...s.transitionDuration.split(',').map(parseFloat));if(d>0.45)o['trans '+d+'s '+s.transitionProperty.slice(0,30)]=n});return o}"""
CLS0 = "window.__cls=0;try{new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true})}catch(_){}"
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def roda(i0, i1):
    from playwright.sync_api import sync_playwright
    OLHO = open(A + '../kit/olho.js').read(); res = {}
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
        for nome, W, H, dpr in AP[i0:i1]:
            toque = W < 1100 or H < 500
            c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=min(dpr, 2), is_mobile=toque and W < 900, has_touch=toque, locale='es-PY', service_workers='block')
            c.add_init_script("sessionStorage.setItem('lf_ni','1');" + CLS0); c.route('**/*', rota)
            for tela, url, acoes in TEL:
                k = '%s|%dx%d|%s' % (nome, W, H, tela); d = {'parado': [], 'rolando': [], 'mov': {}}
                try:
                    pg = c.new_page(); pg.goto('http://localhost:8811/' + url); pg.wait_for_timeout(2600)
                    for a in acoes: pg.evaluate(a); pg.wait_for_timeout(1300)
                    d['medidas'] = pg.evaluate(MED); d['parado'] = pg.evaluate(OLHO); d['mov'] = pg.evaluate(MOV)
                    if W in FOTO and (W, H) != (360, 640): pg.screenshot(path=A + 'img/%s_%d.jpg' % (tela, W), type='jpeg', quality=55)
                    pg.mouse.move(W / 2, H * 0.6)
                    # movimento: 5 passos para baixo, parar e olhar; depois voltar ao topo
                    marca = "()=>{const e=document.elementFromPoint(innerWidth/2,innerHeight*0.6);return e?Math.round(e.getBoundingClientRect().top):0}"
                    andou = 0; cab = set(); wa = set()
                    for p in range(5):
                        m0 = pg.evaluate(marca); pg.mouse.wheel(0, H * 0.7); pg.wait_for_timeout(250)
                        t1 = pg.evaluate("()=>{const t=document.querySelector('.top');const w=document.querySelector('a.wa');return [t?Math.round(t.getBoundingClientRect().bottom):0,w?getComputedStyle(w).opacity+' '+getComputedStyle(w).transform.slice(0,24):'']}")
                        pg.wait_for_timeout(1250)
                        if pg.evaluate(marca) != m0: andou += 1
                        t2 = pg.evaluate("()=>{const t=document.querySelector('.top');const w=document.querySelector('a.wa');const r=w&&w.getBoundingClientRect();return [t?Math.round(t.getBoundingClientRect().bottom):0,r&&r.width?[Math.round(r.left),Math.round(r.right),getComputedStyle(w).opacity].join(' '):'']}")
                        cab.add(t1[0]); cab.add(t2[0]); wa.add(t2[1])
                        for x in pg.evaluate(OLHO): x['passo'] = p + 1; d['rolando'].append(x)
                    pg.mouse.wheel(0, -H * 6); pg.wait_for_timeout(1300)
                    d['movimento'] = {'passosQueRolaram': andou, 'fundoDoCabecalho': sorted(cab), 'whatsappParado': sorted(wa), 'cls': round(pg.evaluate('window.__cls||0'), 3), 'voltaAoTopo': pg.evaluate(OLHO)}
                    if tela == 'peca':  # voltar da peça devolve a posição?
                        pg.close(); pg = c.new_page(); pg.goto('http://localhost:8811/' + url); pg.wait_for_timeout(2600); pg.mouse.move(W / 2, H * 0.6); pg.mouse.wheel(0, 300); pg.wait_for_timeout(900)
                        y0 = pg.evaluate("()=>{const c=document.querySelector('#grid .card');return c?Math.round(c.getBoundingClientRect().top):null}")
                        pg.evaluate(ABRE); pg.wait_for_timeout(1300); pg.go_back(); pg.wait_for_timeout(1500)
                        y1 = pg.evaluate("()=>{const c=document.querySelector('#grid .card');return c?Math.round(c.getBoundingClientRect().top):null}")
                        d['movimento']['voltarDaPeca'] = [y0, y1]
                    pg.close()
                except Exception as e: d['erro'] = str(e)[:160]
                res[k] = d; print(k, len(d['parado']), len(d['rolando']), d.get('erro', ''), flush=True)
            c.close()
        b.close()
    json.dump(res, open(A + 'parte_%d.json' % i0, 'w'), ensure_ascii=False)
if sys.argv[1] == 'junta':
    R = {}
    for f in sorted(glob.glob(A + 'parte_*.json')): R.update(json.load(open(f)))
    json.dump(R, open(A + 'atlas.json', 'w'), ensure_ascii=False, indent=0); print(len(R), 'telas')
else: roda(int(sys.argv[1]), int(sys.argv[2]))
