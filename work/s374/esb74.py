# S374 · esboço 74 (dono 16/11 18:08 "Sim" → Câmbio) — aba 7 da padronização dos botões, Dinheiro › Câmbio.
# A tela já está quase no padrão. Proposta: "Registrar troca" (a ação da tela) vira a principal — contorno rosa, largura toda ·
# o selo "Normal ›" (cápsula cheia, parece filtro) vira texto ao lado de "REPOSIÇÃO ›", na cor do estado · as cotações, que já abrem
# a janela do gráfico, ganham o "›" como as outras linhas que abrem.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS74="""
#v-fx .fxLk{justify-content:center!important;border:1px solid var(--accent)!important;border-radius:999px!important;min-height:48px;margin-top:6px;font-weight:600}
#v-fx .fxLk span{display:none}
#v-fx .fxSelo{background:none!important;border:0!important;padding:0!important;font-weight:600;color:var(--sub)}
#v-fx .fxSelo.n{color:var(--ok)!important}
#v-fx .fxLin .fxVar::after{content:'  ›';color:var(--mute)}
"""
def tela(pg,w): pg.evaluate("()=>window.__LF.setView('fx')");w(1500)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(900);tela(pg,w)
            if prop: pg.add_style_tag(content=CSS74);w(300)
            oo.append(olho(pg));p=T+'f74_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
        print(tema,'novos:',novos(oo[0],oo[1]))
        prancha('74-app-cambio-botoes-%s.jpg'%tema,'App · Dinheiro › Câmbio › botões (aba 7) · tema %s'%tema,
          ['Hoje: quase no padrão; "Registrar troca" (a ação da tela) parece uma linha comum; "Normal ›" é uma cápsula cheia que parece filtro; as cotações abrem o gráfico mas não têm "›".',
           'Proposta: "Registrar troca" = a principal (contorno rosa, largura toda) · "Normal ›" em texto na cor do estado · cotações com "›".'],*fs)
