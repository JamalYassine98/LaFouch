# S330: reproduz o defeito de animação do site (Minha conta e sacola "bugam") e mede o que acontece quadro a quadro. Só leitura (cópia do kit).
# Detector de fantasma: durante a troca, anota a cada quadro quantas cópias do painel existem, onde estão e com que opacidade/transform.
import sys,os,json;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.prep_site();kit.serve(kit.SITE,kit.PS);T='/tmp/s330/'
GRAVA="""(ms)=>new Promise(ok=>{const t0=performance.now(),L=[];const f=t=>{const ps=[...document.querySelectorAll('#layer .panel,#layer .modal,#lfGhost .panel,.lfGhost .panel,#lfGhost .modal')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0});
  L.push({t:Math.round(t-t0),n:ps.length,p:ps.map(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return [e.tagName.toLowerCase()+'.'+[...e.classList].slice(0,3).join('.')+(e.closest('#layer')?'':' (FORA do #layer: '+(e.parentElement.id||e.parentElement.tagName)+')'),Math.round(r.left),Math.round(r.top),+(+c.opacity).toFixed(2)]}),
    filhos:document.querySelector('#layer')?document.querySelector('#layer').childElementCount:0,irmaos:[...document.body.children].filter(e=>/scrim|ghost|lx/i.test(e.className||'')).map(e=>e.className)});
  if(t-t0<ms)requestAnimationFrame(f);else ok(L)};requestAnimationFrame(f)})"""
def ctx(pw,lang='es'):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='es-PY')
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("localStorage.setItem('lf_lang',%r);localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);try{sessionStorage.setItem('lf_ni','1')}catch(e){}"%(lang,kit.CONTA,kit.AUTH))
    pg=c.new_page();pg.goto('http://localhost:8811/?kit=1');pg.wait_for_timeout(1800);return b,pg,pg.wait_for_timeout
def resumo(nome,L):
    mx=max(x['n'] for x in L);dup=[x for x in L if x['n']>=2];fora=[x for x in L if any('FORA' in p[0] for p in x['p'])]
    fim=L[-1]
    print('%-46s cópias no máximo: %d · quadros com 2+ painéis: %d (de %d a %d ms) · fora do #layer: %d · no fim: %d painel(éis) %s'%(nome,mx,len(dup),dup[0]['t'] if dup else 0,dup[-1]['t'] if dup else 0,len(fora),fim['n'],[(p[0][:40],p[1],p[3]) for p in fim['p']]))
    return {'nome':nome,'max':mx,'dup_ms':(dup[0]['t'],dup[-1]['t']) if dup else None,'fim':fim,'meio':dup[len(dup)//2] if dup else None}
R=[]
with sync_playwright() as pw:
    def passo(nome,prep,acao,foto=None):
        b,pg,w=ctx(pw)
        try:
            prep(pg,w);pg.evaluate("()=>{window.__g=null}")
            pg.evaluate("ms=>{window.__rec=("+GRAVA+")(ms)}",1600);acao(pg,w)
            if foto: 
                for i,t in enumerate(foto): w(t);pg.screenshot(path=T+'%s_%d.png'%(nome.split(' ')[0],i))
            L=pg.evaluate("()=>window.__rec");R.append(resumo(nome,L))
        except Exception as e: print(nome,'ERRO',str(e)[:150])
        b.close()
    nada=lambda pg,w:None
    conta=lambda pg,w:pg.evaluate("document.querySelector('#contabtn').click()")
    menu=lambda pg,w:(pg.evaluate("document.querySelector('#mnb').click()"),w(700))
    def pelo_menu(pg,w): pg.evaluate("()=>{const x=[...document.querySelectorAll('a,button')].filter(e=>e.offsetParent&&/Mi cuenta|Minha conta/i.test(e.innerText)&&!e.closest('.top'));(x[0]||{click(){}}).click()}")
    sac=lambda pg,w:pg.evaluate("document.querySelector('#bagbtn').click()")
    passo('A conta pelo botão do topo',nada,conta,[120,150,200,500])
    passo('B conta pelo menu',menu,pelo_menu,[120,150,200,500])
    passo('C sacola pelo botão',nada,sac,[120,150,200,500])
    passo('D conta aberta → tocar em Direcciones',lambda pg,w:(conta(pg,w),w(1200)),lambda pg,w:pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer .mct button')][1];t&&t.click()}"),[80,120,160,500])
    passo('E conta aberta → sacola',lambda pg,w:(conta(pg,w),w(1200)),sac,[120,150,200,500])
    passo('F sacola aberta → conta',lambda pg,w:(sac(pg,w),w(1200)),conta,[120,150,200,500])
    passo('G conta aberta → conta de novo',lambda pg,w:(conta(pg,w),w(1200)),conta,[120,150,200,500])
    passo('I conta aberta → menu → Mi cuenta',lambda pg,w:(conta(pg,w),w(1200),menu(pg,w)),pelo_menu,[120,150,200,500])
    passo('J conta aberta → voltar do celular',lambda pg,w:(conta(pg,w),w(1200)),lambda pg,w:pg.go_back(),[120,150,200,500])
    passo('K conta → Direcciones → voltar do celular',lambda pg,w:(conta(pg,w),w(1200),pg.evaluate("()=>{[...document.querySelectorAll('#layer .mct button')][1].click()}"),w(900)),lambda pg,w:pg.go_back(),[120,150,200,500])
    passo('L sacola aberta → sacola de novo',lambda pg,w:(sac(pg,w),w(1200)),sac,[120,150,200,500])
    passo('M sacola aberta → menu → Mi cuenta',lambda pg,w:(sac(pg,w),w(1200),menu(pg,w)),pelo_menu,[120,150,200,500])
    passo('N peça aberta → conta',lambda pg,w:(pg.evaluate("document.querySelector('[data-open]').click()"),w(1300)),conta,[120,150,200,500])
    passo('O peça aberta → sacola',lambda pg,w:(pg.evaluate("document.querySelector('[data-open]').click()"),w(1300)),sac,[120,150,200,500])
    passo('P conta aberta, em Direcciones → conta de novo',lambda pg,w:(conta(pg,w),w(1200),pg.evaluate("()=>{[...document.querySelectorAll('#layer .mct button')][1].click()}"),w(900)),conta,[120,150,200,500])
json.dump(R,open('/home/claude/lafouch/work/s330/fantasma.json','w'),ensure_ascii=False,indent=0)
