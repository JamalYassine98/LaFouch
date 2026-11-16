# S372 · esboço 55: bolinha de "Últimas unidades" no cartão do Início (dono, 16/11 08:07: "está muito afastada"). Site real, celular; só injeta a regra que muda.
import sys,subprocess,time;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s371/'
from playwright.sync_api import sync_playwright
CSS=".hc .hlin{margin:12px 2px 4px 12px!important;gap:4px!important;letter-spacing:.03em!important}"
M="""()=>{const e=[...document.querySelectorAll('.hc .ulin')].filter(e=>e.getBoundingClientRect().width>0)[0];e.scrollIntoView({block:'center',behavior:'instant'});const c=e.closest('.hc'),i=e.querySelector('i').getBoundingClientRect(),n=c.querySelector('.hn'),r=c.getBoundingClientRect();
 const rg=document.createRange();rg.selectNodeContents(e.lastChild);const t=rg.getBoundingClientRect(),col=n.getBoundingClientRect().left+parseFloat(getComputedStyle(n).paddingLeft);
 return {box:[r.left,r.top,r.width,r.height],bolinha:Math.round((i.left-col)*10)/10,texto:Math.round((t.left-col)*10)/10,vao:Math.round((t.left-i.right)*10)/10,corta:e.scrollWidth>e.clientWidth+1}}"""
srv=subprocess.Popen(['python3','-m','http.server','8863','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2);fs=[];oo=[]
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for prop in (0,1):
        for W in (390,320,1366):
            c=b.new_context(viewport={'width':W,'height':844 if W<900 else 768},device_scale_factor=3 if W<900 else 2,is_mobile=W<900,has_touch=W<900,locale='es-PY',service_workers='block')
            c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg=c.new_page();pg.goto('http://localhost:8863/');w=pg.wait_for_timeout;w(3800)
            if prop: pg.add_style_tag(content=CSS);w(300)
            R=pg.evaluate(M);print('proposta' if prop else 'hoje',W,{k:v for k,v in R.items() if k!='box'})
            if W==390:
                bx=R['box'];p=T+'ul_%d.png'%prop;pg.screenshot(path=p,clip={'x':bx[0]-6,'y':bx[1]+bx[3]*.42,'width':bx[2]+12,'height':bx[3]*.58+8});fs.append(p);oo.append(olho(pg))
            c.close()
    b.close()
finally: srv.terminate()
print('achados novos:',novos(oo[0],oo[1]))
prancha('55-site-bolinha-ultimas-unidades.jpg','Site · Início · cartão da peça · "Últimas unidades"',['Hoje: a bolinha fica 9,5 px para fora da coluna dos textos (material, código, preço) e a 6,4 px da frase.','Proposta: a bolinha começa na mesma linha dos textos de baixo e fica a 4,4 px da frase; as letras ficam um pouco menos espaçadas para a frase caber inteira.'],*fs)
