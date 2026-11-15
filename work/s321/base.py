# S321: abre o app REAL (www/, dados de teste) no simulador, no tema pedido, numa tela.
import sys,os;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
def abre(pw,tela,escuro=True):
    b,c=kit.ctx(pw,scheme='dark' if escuro else 'light');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(1000)
    if tela!='inicio': pg.evaluate("t=>window.__LF.setView(t)",tela);pg.wait_for_timeout(800)
    return b,pg,pg.wait_for_timeout
