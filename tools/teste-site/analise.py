# S428 ANÁLISE "CABE EM TODA TELA" (pedido do dono 18/11 15:00): mede o SITE REAL (peças e cartão da nuvem) em 17 aparelhos,
# com a letra crescendo como a letra do celular (1,0× até 2,0×), e anota em cada tela até onde ela cresce SEM quebrar o design
# e o que quebra primeiro (olho do designer + sai da tela + botão que quebrou a linha). Só leitura; nada vai para o ar.
# uso: python3 analise.py <pasta do site servido em http://127.0.0.1:8000> <saida> <i0> <i1>
import sys, os, json
from playwright.sync_api import sync_playwright
OUT, i0, i1 = sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
os.makedirs(OUT + '/img', exist_ok=True)
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(os.path.dirname(AQUI))
OLHO = open(RAIZ + '/work/kit/olho.js', encoding='utf-8').read()
AP = [('Xiaomi 13T do dono', 386, 858, 3), ('celular pequeno', 320, 568, 2), ('celular', 360, 640, 3), ('celular alto', 360, 800, 3), ('iPhone', 390, 844, 3),
      ('celular grande', 412, 915, 2.6), ('iPhone Max', 430, 932, 3), ('celular deitado', 844, 390, 3), ('tablet pequeno', 600, 960, 2),
      ('iPad em pé', 768, 1024, 2), ('iPad Air em pé', 820, 1180, 2), ('iPad deitado', 1024, 768, 2), ('notebook pequeno', 1280, 720, 1),
      ('notebook', 1366, 768, 1), ('notebook grande', 1536, 864, 1.25), ('monitor', 1920, 1080, 1), ('monitor 2K', 2560, 1440, 1)]
ABRE = "()=>{const c=document.querySelector('#grid .card .open');c&&c.click()}"
TEL = [('inicio', '', []), ('catalogo', '?r=armazones', []), ('peca', '?r=armazones', [ABRE]),
       ('menu', '', ["()=>document.querySelector('#mnb').click()"]),
       ('filtros', '?r=armazones', ["()=>{const f=document.querySelector('.lfgf');f&&f.click()}"]),
       ('carrinho', '?r=armazones', [ABRE, "()=>{const b=document.querySelector('#layer .bb');b&&b.click()}"]),
       ('conta', '', ["()=>document.querySelector('#contabtn').click()"]),
       ('conta-cartoes', '', ["()=>document.querySelector('#contabtn').click()", "()=>{const b=document.querySelectorAll('#layer .mct>button');b[3]&&b[3].click()}"])]
if os.environ.get('LF_URLS'): TEL = [(x.split('|')[0], x.split('|')[1], []) for x in os.environ['LF_URLS'].split(',') if '|' in x]  # sites de fora (comparar)
TF = [t for t in os.environ.get('LF_TELAS', '').split(',') if t]
if TF: TEL = [x for x in TEL if x[0] in TF]
PORTAS = [x.split(':') for x in os.environ.get('LF_PORTAS', 'hoje:8000').split(',') if x]
AF = [a for a in os.environ.get('LF_APARELHOS', '').split(',') if a]
ESC = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7]  # teto 1,7× (dono 18/11 20:57)
QUEBRA = {'largura', 'cortado', 'texto cortado', 'texto sobre texto', 'tampado', 'fileira torta', 'colados'}
CONTA = json.dumps({'nome': 'Maria González', 'email': 'maria@exemplo.com', 'tel': '+595 983 000 000', 'nac': 'py', 'doc': '1234567',
                    'ends': [{'nome': 'Casa', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Calle Los Lapachos 123'}]})
AUTH = json.dumps({'uid': 'kit', 'idToken': 'kit', 'refresh': 'kit', 'exp': 9e15, 'ev': True, 'email': 'maria@exemplo.com'})
INIT = ("try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','0');"
        "localStorage.setItem('lf_conta',%s);localStorage.setItem('lf_auth',%s)}catch(e){}" % (json.dumps(CONTA), json.dumps(AUTH)))
BLOQ = ('identitytoolkit', 'securetoken', 'google-analytics', 'googletagmanager', 'recaptcha', 'southamerica-east1-')
# extra: (a) o que a pessoa vê e passa da borda da tela (fora de faixas que rolam de lado); (b) botão/link de 1 linha que virou 2+
EXTRA = """(marca)=>{const W=document.documentElement.clientWidth,o={fora:[],linha:[]};const cs=e=>getComputedStyle(e);
 const rola=e=>{for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){const x=cs(p).overflowX,y=cs(p).overflowY;if((x==='auto'||x==='scroll')&&y!=='auto'&&y!=='scroll')return true;if((x==='hidden'||x==='clip')&&p.getBoundingClientRect().width<W-40)return true}return false};
 document.querySelectorAll('a,button,img,h1,h2,h3,p,label,input,select,[role=tab]').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>innerHeight)return;
  if(e.closest('[aria-hidden="true"],#lfmed,#lfgrv')||cs(e).visibility==='hidden')return;const t=(e.innerText||e.alt||e.getAttribute('aria-label')||e.tagName).trim().split('\\n')[0].slice(0,30);
  const vis=()=>{const x=Math.min(W-2,Math.max(1,(Math.max(r.left,0)+Math.min(r.right,W))/2)),y=Math.min(innerHeight-2,Math.max(1,(Math.max(r.top,0)+Math.min(r.bottom,innerHeight))/2)),k=document.elementFromPoint(x,y);return !!k&&(k===e||e.contains(k)||k.contains(e))};
  if((r.right>W+1||r.left<-1)&&!rola(e)&&cs(e).position!=='fixed'&&vis())o.fora.push(t);
  if(e.tagName!=='IMG'&&!rola(e)){for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){const x=cs(p).overflowX;if(x==='hidden'||x==='clip'||x==='auto'||x==='scroll'){const q=p.getBoundingClientRect();if((r.right>q.right+1.5||r.left<q.left-1.5)&&vis()){o.fora.push(t+' (cortado pela moldura)')}break}}}
  if(e.matches('a,button,[role=tab]')&&(e.innerText||'').trim()){const lh=parseFloat(cs(e).lineHeight)||parseFloat(cs(e).fontSize)*1.25;const rr=[...e.getClientRects()];
   let n=0;const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let tops=new Set();while(w.nextNode()){const g=document.createRange();g.selectNodeContents(w.currentNode);[...g.getClientRects()].forEach(q=>{if(q.width>1)tops.add(Math.round(q.top/4))})}
   n=tops.size;if(marca){e.dataset.lfl=n}else if(e.dataset.lfl&&n>+e.dataset.lfl)o.linha.push(t+' ('+e.dataset.lfl+'→'+n+' linhas)')}});
 o.fora=[...new Set(o.fora)].slice(0,8);o.linha=[...new Set(o.linha)].slice(0,8);return o}"""
def olha(pg, marca=False):
    ol = pg.evaluate(OLHO); ex = pg.evaluate(EXTRA, marca)
    c = {x['r']: x for x in ol}
    return c, ex
res = []
with sync_playwright() as pw:
    b = pw.chromium.launch(args=['--no-sandbox'])
    for nome, W, H, dpr in [x for x in AP if not AF or str(x[1]) + 'x' + str(x[2]) in AF][i0:i1]:
        cel = W < 1100 or H < 500
        c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=dpr, is_mobile=cel and W < 900, has_touch=cel, locale='pt-BR', service_workers='block')
        c.add_init_script(INIT); c.route('**/*', lambda r: r.abort() if any(x in r.request.url for x in BLOQ) else r.continue_())
        for (versao, porta), (tela, url, acoes) in [(v, t) for t in TEL for v in PORTAS]:
            d = {'aparelho': nome, 'W': W, 'H': H, 'tela': tela, 'versao': versao}
            try:
                pg = c.new_page(); pg.goto(url if url.startswith('http') else 'http://127.0.0.1:%s/' % porta + url, wait_until='load', timeout=60000); pg.wait_for_timeout(4500)
                d['pecas'] = pg.evaluate("()=>{try{return document.querySelectorAll('#grid .card,#home .hc').length}catch(_){return -1}}")
                for a in acoes: pg.evaluate(a); pg.wait_for_timeout(1500)
                z0 = pg.evaluate("()=>parseFloat(getComputedStyle(document.body).zoom)||1"); d['zoom0'] = z0
                base, ex0 = olha(pg, True)
                d['hoje'] = {'olho': {k: [v['n'], v.get('ex', [])[:3]] for k, v in base.items() if k in QUEBRA}, 'fora': ex0['fora']}
                f = '%s_%s_%d_%s_1.0.jpg' % (versao, tela, W, H); pg.screenshot(path=OUT + '/img/' + f, type='jpeg', quality=62); d['foto1'] = f
                if os.environ.get('LF_FIM') and pg.evaluate("(q)=>{const e=document.querySelector(q);if(!e)return false;e.scrollIntoView({block:'center'});return true}", os.environ['LF_FIM']):
                    pg.wait_for_timeout(300); pg.screenshot(path=OUT + '/img/%s_%s_%d_%s_1.0_fim.jpg' % (versao, tela, W, H), type='jpeg', quality=62)
                    pg.evaluate("()=>{document.querySelectorAll('#layer .scrim,#drw,#drw *').forEach(x=>{if(x.scrollTop)x.scrollTop=0});scrollTo(0,0)}"); pg.wait_for_timeout(200)
                d['ate'] = 1.0; d['quebra'] = None
                for s in (ESC[1:] if W < 1100 else []):
                    pg.evaluate("(z)=>{document.body.style.zoom=z;document.body.style.setProperty('--z',z);dispatchEvent(new Event('resize'))}", round(z0 * s, 3)); pg.wait_for_timeout(450)
                    cur, ex = olha(pg)
                    if os.environ.get('LF_FOTOS') == '1': pg.screenshot(path=OUT + '/img/%s_%s_%d_%s_%.1f_passo.jpg' % (versao, tela, W, H, s), type='jpeg', quality=62)
                    if os.environ.get('LF_FIM') and pg.evaluate("(q)=>{const e=document.querySelector(q);if(!e)return false;e.scrollIntoView({block:'center'});return true}", os.environ['LF_FIM']):
                        pg.wait_for_timeout(300); pg.screenshot(path=OUT + '/img/%s_%s_%d_%s_%.1f_fim.jpg' % (versao, tela, W, H, s), type='jpeg', quality=62)
                        pg.evaluate("()=>{document.querySelectorAll('#layer .scrim').forEach(x=>x.scrollTop=0);scrollTo(0,0)}"); pg.wait_for_timeout(200)
                    novo = {k: [v['n'], v.get('ex', [])[:3]] for k, v in cur.items() if k in QUEBRA and v['n'] > (base[k]['n'] if k in base else 0)}
                    fora = [x for x in ex['fora'] if x not in ex0['fora']]
                    if novo or fora or ex['linha']:
                        d['quebra'] = {'escala': s, 'olho': novo, 'fora': fora, 'linha': ex['linha']}
                        f = '%s_%s_%d_%s_%.1f.jpg' % (versao, tela, W, H, s); pg.screenshot(path=OUT + '/img/' + f, type='jpeg', quality=62); d['foto_quebra'] = f
                        break
                    d['ate'] = s
                pg.close()
            except Exception as e:
                d['erro'] = str(e)[:200]
            print(json.dumps(d, ensure_ascii=False)[:400], flush=True); res.append(d)
        c.close()
    b.close()
json.dump(res, open(OUT + '/analise_%d.json' % i0, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
