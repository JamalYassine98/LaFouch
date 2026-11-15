# S330: o que acontece HOJE quando a pessoa já está na sacola (ou na conta) e toca o mesmo botão de novo. Só leitura.
import sys;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.prep_site();kit.serve(kit.SITE,kit.PS)
M="""(ms)=>new Promise(ok=>{const p0=document.querySelector('#layer .panel');const t0=performance.now();let troca=0,minOp=1,maxX=0,an=0;const f=t=>{const p=document.querySelector('#layer .panel');if(p!==p0)troca=1;if(p){const c=getComputedStyle(p),r=p.getBoundingClientRect();minOp=Math.min(minOp,+c.opacity);maxX=Math.max(maxX,Math.abs(Math.round(r.left)));an=Math.max(an,p.getAnimations({subtree:false}).length)}else minOp=0;
 if(t-t0<ms)requestAnimationFrame(f);else ok({painel_trocado:troca,opacidade_minima:minOp,desloc_max_px:maxX,animacoes:an,aba:(document.querySelector('#layer .mct .on,#layer .mct [aria-selected=true]')||{}).innerText||'',url:location.pathname,rolagem:p?p.scrollTop:null})};requestAnimationFrame(f)})"""
with sync_playwright() as pw:
    for nome,b1,prep in (('sacola aberta → carrinho de novo','#bagbtn',None),('conta em Direcciones → conta de novo','#contabtn',"()=>{const x=[...document.querySelectorAll('#layer .mct button')].find(e=>/Direcc|Endere/.test(e.innerText));x&&x.click()}")):
        b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
        c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("localStorage.setItem('lf_lang','es');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);try{sessionStorage.setItem('lf_ni','1')}catch(e){}"%(kit.CONTA,kit.AUTH))
        pg=c.new_page();pg.goto('http://localhost:8811/?kit=1');pg.wait_for_timeout(1800)
        pg.evaluate("s=>document.querySelector(s).click()",b1);pg.wait_for_timeout(1200)
        if prep: pg.evaluate(prep);pg.wait_for_timeout(900)
        pg.evaluate("ms=>{window.__r=("+M+")(ms)}",1200);pg.evaluate("s=>document.querySelector(s).click()",b1)
        print(nome,'→',pg.evaluate("()=>window.__r"));b.close()
