"""Captura Hoje × Proposta das telas do "Descubra seu formato" (celular 386×858, letra 1× e 1,2×).
Hoje = http://localhost:8701 (/tmp/ih) · Proposta = http://localhost:8702 (/tmp/ip) — rodar copias.py antes.
O resultado precisa de uma foto: aqui usamos uma SILHUETA desenhada a partir do rosto-padrão de 468 pontos do
próprio MediaPipe (canon.json, tirado do face_landmarker.task do site) — sem foto de pessoa real.
Uso: python3 captura.py  → pasta cap/
"""
import os, json, sys
from playwright.sync_api import sync_playwright

os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
AQUI = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(AQUI, 'cap'); os.makedirs(OUT, exist_ok=True)
CANON = json.load(open(os.path.join(AQUI, 'canon.json')))
FR = '/mnt/skills/examples/morning/assets/fonts/fraunces-latin-600-normal.woff2'
CSS = ("@font-face{font-family:Fraunces;font-weight:500 600;src:url(https://fonts.gstatic.com/fr.woff2) format('woff2')}"
       "@font-face{font-family:Inter;font-weight:100 900;src:local('Inter')}")
INIT = "try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}"
LETRA = "document.addEventListener('DOMContentLoaded',()=>{document.documentElement.style.fontSize='120%'});"

MONTA = r"""(C)=>{
 const F=window.__lfFa, W=900, H=1200, s=34, cx=W/2, cy=H*0.47;
 const A=C.map(p=>[cx+p[0]*s, cy-p[1]*s, -p[2]*s]); for(let i=468;i<478;i++)A.push(A[i<473?468-1:263]);
 const cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
 g.fillStyle='#e9e4e1';g.fillRect(0,0,W,H);
 const ov=F.MOVAL.map(i=>A[i]);
 g.fillStyle='#3b3135';g.beginPath();g.ellipse(cx,cy-60,330,400,0,Math.PI*1.02,Math.PI*1.98);g.lineTo(cx+300,cy+120);g.lineTo(cx-300,cy+120);g.fill();
 g.fillStyle='#cdb3a3';g.fillRect(cx-110,cy+200,220,400);
 g.fillStyle='#dcc3b2';g.beginPath();ov.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();
 g.fillStyle='#5a4a48';[33,263].forEach(i=>{g.beginPath();g.ellipse(A[i][0]+(i==33?28:-28),A[i][1],18,9,0,0,7);g.fill()});
 const raw=F.M68.map(i=>({x:A[i][0],y:A[i][1]})); const m=F.med(raw); Object.keys(F.MOFF).forEach(k=>m[k]+=F.MOFF[k]);
 const res=F.shape(m); res.mm={w:138,pd:63,iris:20}; res.n478=true; res.gen='';
 const xs=A.map(p=>p[0]),ys=A.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys);
 const r={detection:{box:{x:x0,y:y0,width:Math.max(...xs)-x0,height:Math.max(...ys)-y0}},landmarks:{positions:raw},oval:ov.map(p=>({x:p[0],y:p[1]})),n478:true};
 F.open(); F.res(cv,r,res); return {id:res.id,second:res.second,close:res.close,m:res.m};
}"""

def rota(route):
    u = route.request.url
    if u.startswith('http://localhost'): return route.continue_()
    if u.startswith('https://fonts.googleapis.com/'): return route.fulfill(status=200, content_type='text/css', body=CSS)
    if u == 'https://fonts.gstatic.com/fr.woff2': return route.fulfill(status=200, content_type='font/woff2', body=open(FR, 'rb').read())
    if u.startswith('https://firestore.googleapis.com/'): return route.continue_()  # peças reais da nuvem
    return route.abort()

def roda(br, base, tag, letra):
    ctx = br.new_context(viewport={'width': 386, 'height': 858}, device_scale_factor=2, is_mobile=True, has_touch=True, locale='pt-BR')
    ctx.add_init_script(INIT)
    if letra: ctx.add_init_script(LETRA)
    ctx.route('**/*', rota)
    pg = ctx.new_page(); erros = []
    pg.on('pageerror', lambda e: erros.append(str(e)))
    pg.goto(base + '/?cliente=1&r=formato', wait_until='networkidle'); pg.wait_for_timeout(1500)
    pg.screenshot(path=f'{OUT}/{tag}-1-pagina.png')
    pg.click('#rosto [data-fa]'); pg.wait_for_timeout(900)
    pg.screenshot(path=f'{OUT}/{tag}-2-abrir.png')
    pg.click('[data-close]'); pg.wait_for_timeout(500)
    info = pg.evaluate(MONTA, CANON); pg.wait_for_timeout(900)
    pg.screenshot(path=f'{OUT}/{tag}-3-resultado.png')
    alto = pg.evaluate("()=>{const m=document.querySelector('.modal.fa');return m?m.scrollHeight:0}")
    pg.click('[data-fagen="f"]'); pg.wait_for_timeout(500)
    pg.screenshot(path=f'{OUT}/{tag}-4-feminino.png')
    sub = pg.evaluate("()=>document.querySelector('.fares .sub').textContent")
    pg.click('[data-fagen="m"]'); pg.wait_for_timeout(500)
    pg.screenshot(path=f'{OUT}/{tag}-5-masculino.png')
    ctx.close(); return {'erros': erros, 'info': info, 'alto': alto, 'sub_fem': sub}

with sync_playwright() as p:
    br = p.chromium.launch()
    rel = {}
    for letra in (False, True):
        for nome, base in (('hoje', 'http://localhost:8701'), ('prop', 'http://localhost:8702')):
            tag = nome + ('-L12' if letra else '')
            rel[tag] = roda(br, base, tag, letra); print(tag, rel[tag])
    br.close()
json.dump(rel, open(f'{OUT}/captura.json', 'w'), ensure_ascii=False, indent=1)
