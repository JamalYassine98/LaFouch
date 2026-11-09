from playwright.sync_api import sync_playwright
WHERE="""()=>{const v=e=>{if(!e)return false;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>0&&r.height>0&&c.visibility!='hidden'&&c.display!='none'&&parseFloat(c.opacity)>0.1};
 const L=document.getElementById('layer');let lay=L&&L.innerHTML.trim()?(L.querySelector('.pgm h1,.pgm .pnm,h1,h2,[aria-label]')||{}).textContent||L.firstElementChild.className:'';
 lay=(lay||'').trim().slice(0,30);
 const pop=[...document.querySelectorAll('.sec.pop')].map(e=>e.id).join(',');
 const ov=[...document.querySelectorAll('#drw.on,#drw.open,#fsh.on,#fvs.on,.on[id],.open[id]')].filter(v).map(e=>e.id).join(',');
 return location.pathname+' | layer:'+lay+' | painel:'+pop+' | aberto:'+ov}"""
def nova(b):
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8768/'); pg.wait_for_timeout(2500); return pg
def c(pg,sel,t=1200):
    ok=pg.evaluate("s=>{var e=document.querySelector(s);if(!e)return false;e.click();return true}",sel); pg.wait_for_timeout(t); return ok
CEN=[
 ('Início → peça', [ "[data-open='GR3340']"]),
 ('Início → Ver catálogo', [".hero a[href='#vitrine'],a[href='#vitrine']"]),
 ('Catálogo → peça', ["a[href='#vitrine']","#grid [data-open]"]),
 ('Peça → peça parecida', ["[data-open='GR3340']",".pgm [data-open]"]),
 ('Menu lateral', [".bar [aria-label*='enu'],#mbtn,[data-dopen]"]),
 ('Busca', ["#sbtn,[aria-label='Buscar']"]),
 ('Filtrar', ["a[href='#vitrine']","#fbtn"]),
 ('Formato do rosto', ["a[href='#rosto']"]),
 ('Carrinho', ["#bagbtn"]),
 ('Minha conta', ["#contabtn"]),
 ('Foto ampliada', ["[data-open='GR3340']",".pgm .big"]),
]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for nome,passos in CEN:
        pg=nova(b); h=[pg.evaluate(WHERE)]
        for s in passos:
            if not c(pg,s): h.append('NÃO ACHEI '+s)
            h.append(pg.evaluate(WHERE))
        try: pg.go_back(timeout=3000)
        except Exception as e: h.append('sem histórico')
        pg.wait_for_timeout(1200); h.append('VOLTAR ANDROID → '+pg.evaluate(WHERE))
        print('###',nome); [print('   ',x) for x in h]
        pg.close()
