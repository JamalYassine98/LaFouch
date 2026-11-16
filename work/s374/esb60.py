# S374 · esboço 60 (painel integrado, PASSO 1 — dono 16/11 10:32: "com muita calma e passo a passo").
# 60a painel do site dentro do app: sem a caixa (largura toda, sem borda/canto), título no tamanho das outras telas.
# 60b Dashboard › VER sem a aba "Online" (repetia a tela Site). App real; o painel do site vem da cópia local (tela de entrar).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s374/'
import kit,urllib.parse,mimetypes
kit.prep_site()
from playwright.sync_api import sync_playwright
CSS60="#grpTabs.gtF .dHdT{font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:28px;font-weight:500;letter-spacing:-.01em}#grpTabs.gtF .dHdT i{font-size:15px}#siteBox{width:100vw;margin:0 0 0 calc(50% - 50vw)}#lojaFrame{width:100%!important;border:0!important;border-radius:0!important}"
SEM_ONL="()=>{const b=document.querySelector('#dFolha .dOp[data-id=onl],#dFolha .dOp[data-id=online]');if(b)b.remove();return !!b}"
def abre(pw,esc):
    W,H=390,844;b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark' if esc else 'light',service_workers='block')
    def rt(r):
        u=r.request.url
        if u.startswith('http://localhost') or u.startswith('http://127.'): return r.continue_()
        if 'lafouch.com/' in u:
            f=os.path.join(kit.SITE,urllib.parse.urlparse(u).path.lstrip('/') or 'index.html')
            if os.path.isfile(f): return r.fulfill(path=f,content_type=mimetypes.guess_type(f)[0] or 'text/html')
            return r.fulfill(status=404,body='')
        return r.abort()
    c.route('**/*',rt);c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF');pg.wait_for_timeout(1300)
    return b,pg,pg.wait_for_timeout
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=abre(pw,esc);pg.evaluate("()=>window.__LF.setView('site')");w(600);pg.evaluate("()=>document.querySelector('#v-site [data-id=msg]').click()");w(4500)
            if prop: oo.append(olho(pg));pg.add_style_tag(content=CSS60);w(500)
            p=T+'p60_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
        print('60a',tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
        prancha('60a-app-painel-sem-caixa-%s.jpg'%tema,'App · Site › Mensagens (painel do site) · passo 1 · tema '+tema,['Hoje: o painel aparece numa caixa com borda e cantos, mais estreita que a tela, e o título "Mensagens ⌄" fica pequeno.','Proposta: o painel ocupa a largura toda, sem borda nem cantos, e o título tem o tamanho das outras telas. O conteúdo do painel ainda é o do site (passo 2: virar tela do app, uma parte por vez).','No desenho o painel mostra a tela de entrar (o simulador não tem a sua conta); no celular aparece o conteúdo.'],*fs)
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=abre(pw,esc);pg.evaluate("()=>{const L=window.__LF;L.S.dTab='giro';L.setView('dash')}");w(900);pg.evaluate("()=>window.__LF.ACT.dVer()");w(700)
            if prop: oo.append(olho(pg));print('   tirou Online:',pg.evaluate(SEM_ONL));w(300)
            p=T+'d60_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
        print('60b',tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
        prancha('60b-app-dashboard-sem-online-%s.jpg'%tema,'App · Dashboard › VER sem "Online" · passo 1 · tema '+tema,['Hoje: a aba "Online" (pedidos do site, peças vistas e "Painel completo ›") repete a tela Site.','Proposta: a aba sai do Dashboard; esses números ficam na tela Site (família Site).'],*fs)
