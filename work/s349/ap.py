# S349: abre o app REAL (dados de teste) em qualquer tamanho. abre(pw,tela,escuro,'celular'|'tablet'|'pc') -> b,pg,w
import sys,os;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
TAM={'celular':(390,844,True,2),'tablet':(820,1180,True,1),'pc':(1366,768,False,1)}
import base_app
def abre(pw,tela,escuro=True,ap='celular',base=True):
    W,H,TQ,dpr=TAM[ap];b=kit.sim.navegador(pw)
    c=kit.sim.contexto(b,W,H,toque=TQ,dpr=dpr,lingua='pt-BR',escuro=bool(escuro),sem_trabalhador=True)
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
    c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    if base: c.add_init_script(base_app.script())
    pg=c.new_page()
    pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(1000)
    if tela!='inicio': pg.evaluate("t=>window.__LF.setView(t)",tela);pg.wait_for_timeout(800)
    return b,pg,pg.wait_for_timeout
