# S356 · esboço 46: cartões COLADOS nas 5 abas do Resumo (Resumo, Reservas, Giro, Preços, Online). Causa: #dtabBody é um bloco sem espaço entre os
# filhos (as outras telas usam coluna com espaço). Proposta: o mesmo espaço das outras telas. App real, celular, claro e escuro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s356/';T='/tmp/s355/'
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,aba in (('giro','giro'),('resumo','hoje')):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);pg.evaluate("a=>{const L=window.__LF;L.S.dTab=a;L.setView('dash')}",aba);w(2600)
                if nome=='resumo': pg.evaluate("()=>scrollTo(0,150)");w(300)
                if prop:
                    oo.append(olho(pg));g=pg.evaluate("()=>{const v=document.getElementById('v-desp')||document.querySelector('.view');const s=getComputedStyle(document.getElementById('v-dash'));const k=document.querySelector('#dtabBody .kpis');const gk=k?getComputedStyle(k).rowGap:'12px';return [s.display,s.rowGap,gk]}")
                    esp=g[1] if g[1] not in('normal','0px') else g[2];pg.add_style_tag(content='#dtabBody{display:flex!important;flex-direction:column;gap:%s}#dtabBody>*{margin-top:0!important;margin-bottom:0!important}'%esp);print('    espaço usado:',g,'→',esp);w(500)
                p=T+'gp_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
            print('46',nome,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
            prancha('46-app-%s-cartoes-separados-%s.jpg'%(nome,tema),'App · %s · tema %s'%(nome.capitalize(),tema),['Hoje: os cartões ficam colados um no outro (0 px entre eles).','Proposta: o mesmo espaço entre cartões que as outras telas do app usam.'],*fs)
