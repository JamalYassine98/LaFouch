from playwright.sync_api import sync_playwright
import json
TEMAS=['','natal','halloween','bf','anonovo-d','anonovo-n','maes','pais']
JS="""()=>{const P=c=>(c.match(/[\\d.]+/g)||[]).map(Number),L=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])},C=(a,b)=>{const x=L(a),y=L(b);return +((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2)},hex=c=>'#'+c.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
 const bgs=e=>{for(let x=e;x;x=x.parentElement){const s=getComputedStyle(x);const g=(s.backgroundImage.match(/rgba?\\([^)]+\\)/g)||[]).map(P).filter(c=>c.length<4||c[3]>.5);if(g.length)return g;const c=P(s.backgroundColor);if(c.length<4||c[3]>.5)return [c]}return [[255,255,255]]};
 const T=(sel,n)=>{const e=[...document.querySelectorAll(sel)].find(e=>e.getBoundingClientRect().width);if(!e)return n+': -';const c=P(getComputedStyle(e).color),b=bgs(e);return n+': '+hex(c)+' sobre '+b.map(hex).join('/')+' = '+Math.min(...b.map(x=>C(c,x)))+':1'};
 const dec=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);return e.getBoundingClientRect().width&&s.animationIterationCount=='infinite'&&/^ev/.test(s.animationName)});
 return [T('#hdst .btn','Ver modelo'),T('#hdst .btn+a, #hdst a:not(.btn)','Ver catálogo'),T('#hdst h1','título'),T('#hdst .hbt .p1, #hdst [class*=pr]','preço dest.'),T('#contabtn','ícone conta'),T('#mnb','ícone menu'),T('#home .hcat a','categoria'),T('#home .hc','cartão'),T('#home .h2 + a, #home a[href*=tienda]','Ver todos'),'enfeites animados: '+dec.length+(dec[0]?' pointer-events '+getComputedStyle(dec[0]).pointerEvents+' z '+getComputedStyle(dec[0].parentElement).zIndex:'')]}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
    for t in TEMAS:
        pg=c.new_page();pg.goto('http://localhost:8811/');pg.wait_for_timeout(2200)
        if t: pg.evaluate("t=>document.documentElement.setAttribute('data-ev',t)",t)
        pg.wait_for_timeout(900);print(t or 'padrão');[print('   ',x) for x in pg.evaluate(JS)];pg.close()
