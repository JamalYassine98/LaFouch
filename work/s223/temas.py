# S223: análise das temáticas — cores, preço, botões, contraste. Só leitura.  python3 temas.py i0 i1
import sys, json, os
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
TEMAS=['','natal','halloween','bf','anonovo-d','anonovo-n','maes','pais']
JS="""()=>{const P=c=>{const m=c.match(/[\\d.]+/g);return m?m.map(Number):[0,0,0,0]},L=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])},
 hex=c=>'#'+c.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
 const fundo=e=>{let grad='';for(let x=e;x;x=x.parentElement){const s=getComputedStyle(x);if(s.backgroundImage&&s.backgroundImage!='none'&&!grad)grad='grad';const c=P(s.backgroundColor);if(c.length<4||c[3]>0.5)return [c,grad]}return [[255,255,255],grad]};
 const info=e=>{if(!e)return null;const r=e.getBoundingClientRect();if(!r.width)return null;const s=getComputedStyle(e),c=P(s.color),[b,g]=fundo(e);const l1=L(c),l2=L(b);return {cor:hex(c),fundo:hex(b)+(g?'~':''),contraste:+((Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)).toFixed(2),px:Math.round(parseFloat(s.fontSize)*parseFloat(getComputedStyle(document.body).zoom||1)),peso:s.fontWeight,fam:s.fontFamily.split(',')[0].replace(/"/g,'')}};
 const btn=e=>{if(!e)return null;const r=e.getBoundingClientRect();if(!r.width)return null;const s=getComputedStyle(e);const i=info(e);i.fundoBotao=s.backgroundImage!='none'?'grad:'+s.backgroundImage.match(/rgba?\\([^)]+\\)/g).slice(0,2).map(x=>hex(P(x))).join('→'):hex(P(s.backgroundColor));if(s.backgroundImage!='none'){const cs=s.backgroundImage.match(/rgba?\\([^)]+\\)/g).map(P);const l1=L(P(s.color));i.contraste=Math.min(...cs.map(c=>{const l2=L(c);return +((Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)).toFixed(2)}))}i.borda=s.borderTopWidth!='0px'?hex(P(s.borderTopColor)):'';return i};
 const q=s=>[...document.querySelectorAll(s)].find(e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().top<innerHeight*3);
 const precos=[...document.querySelectorAll('body *')].filter(e=>e.children.length==0&&/^\\s*(Gs\\.|R\\$|US\\$)/.test(e.textContent)&&e.getBoundingClientRect().width).slice(0,40).map(e=>{const i=info(e);i.onde=(e.closest('#layer')?'peça':e.closest('#grid')?'catálogo':e.closest('#hdst')?'destaque':e.closest('#home')?'início':'outro');i.riscado=getComputedStyle(e).textDecorationLine.includes('line-through');return i});
 const ag={};precos.forEach(p=>{const k=p.onde+(p.riscado?' (riscado)':'');const v=p.cor+' sobre '+p.fundo+' '+p.contraste+':1 '+p.px+'px/'+p.peso;ag[k]=ag[k]||{};ag[k][v]=(ag[k][v]||0)+1});
 const cs=getComputedStyle(document.documentElement);const dec=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);return e.getBoundingClientRect().width&&s.animationName!='none'&&s.animationIterationCount=='infinite'}).map(e=>getComputedStyle(e).animationName+':'+(e.id||String(e.className.baseVal??e.className).split(' ')[0])).slice(0,12);
 return {vars:Object.fromEntries(['--bg','--pn','--tx','--mu','--ac','--evb','--wa'].map(v=>[v,cs.getPropertyValue(v).trim()])),fundoPagina:hex(P(getComputedStyle(document.body).backgroundColor)),topo:info(q('.top .logo'))&&hex(fundo(q('.top'))[0]),precos:ag,
  titulo:info(q('#hdst h1')||q('#vtitT')||q('#layer h2')),secao:info(q('#home .h2')||q('#home h2')),texto:info(q('#home p')||q('#layer p')),link:info(q('#home a[href]')),
  verModelo:btn(q('#hdst .btn')||q('#hdst a')),comprarCartao:btn(q('#grid .card .bb')||q('#grid .card button:not(.open):not(.fav)')),comprar:btn(q('#layer .bb')),faixa:(()=>{const e=q('#evb')||q('.evb')||q('[class*=evbar]');return e?btn(e):null})(),infinitas:dec,selos:[...document.querySelectorAll('.ofpill,.stk,.ulin')].filter(e=>e.getBoundingClientRect().width).slice(0,3).map(btn)}}"""
ABRE="()=>{const c=document.querySelector('#grid .card .open');c&&c.click()}"
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
i0,i1=int(sys.argv[1]),int(sys.argv[2]);out={}
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for t in TEMAS[i0:i1]:
        for W,H in ((390,844),(1366,768)):
            c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=1,is_mobile=W<900,has_touch=W<900,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
            for tela,url,ac in (('inicio','',None),('catalogo','?r=tienda',None),('peca','?r=tienda',ABRE)):
                pg=c.new_page();pg.goto('http://localhost:8811/'+url);pg.wait_for_timeout(2300)
                if t: pg.evaluate("t=>document.documentElement.setAttribute('data-ev',t)",t)
                if ac: pg.evaluate(ac)
                pg.wait_for_timeout(1300);k='%s|%d|%s'%(t or 'padrao',W,tela);out[k]=pg.evaluate(JS)
                pg.screenshot(path=A+'img_%s_%d_%s.jpg'%(t or 'padrao',W,tela),type='jpeg',quality=60);pg.close();print(k,flush=True)
            c.close()
json.dump(out,open(A+'temas_%d.json'%i0,'w'),ensure_ascii=False)
