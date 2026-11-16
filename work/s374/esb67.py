# S374 · esboço 67 (dono 16/11 13:59: "seguir com aba giro") — aba 2 da padronização dos botões (padrão de controles 15/11).
# Proposta: 1 principal (Marcar como pedido, contorno rosa) · secundária neutra (Mandar ao fornecedor, Salvar da vitrine) ·
# terciária texto rosa com › (Oferta ›) · − n + num seletor só (contorno neutro) · texto da lista à esquerda · "Sobrando" e Total discretos.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS67="""
#v-dash .sl.lcL{text-align:left!important;align-items:center}
#v-dash .sl.lcL>span:nth-child(2){text-align:left!important;font-size:14.5px;line-height:1.3}
#v-dash .sl.lcL small{display:block;text-align:left!important;font-size:12.5px;color:var(--mute);margin-top:2px}
#v-dash .lcSec{text-align:left!important;font-size:11.5px;letter-spacing:.12em;color:var(--sub)!important;margin:18px 0 6px}
#v-dash .lcQ{display:inline-flex!important;align-items:center;border:1px solid var(--line);border-radius:999px;height:40px;padding:0 2px;gap:0}
#v-dash .lcQ .mini{border:0!important;background:none!important;width:36px;min-width:36px;height:36px;padding:0;color:var(--fg);font-size:18px}
#v-dash .lcQ b{min-width:26px;text-align:center;font-weight:600}
#v-dash .lcSobTop{border:1px solid var(--line)!important;background:var(--panel2)}
#v-dash .lcSobTop>span>b{color:var(--fg)!important;font-weight:600}#v-dash .lcSobTop>b{color:var(--warn)!important;font-weight:600}
#v-dash [data-act=lcOferta]{border:0!important;background:none!important;color:var(--accent-fg)!important;font-weight:600;padding:6px 0!important;min-height:44px}
#v-dash .lcTot{background:var(--panel2)!important;border:1px solid var(--line)}
#v-dash [data-act=lcEnvia]{display:none!important}
#v-dash [data-act=vitLug]{border-color:var(--line)!important;color:var(--fg)!important;background:none!important}
"""
def tela(pg,w):
    pg.evaluate("()=>{const L=window.__LF;L.S.dTab='giro';L.S.dfold={rep:true,vit:true};L.setView('dash')}");w(1500)
PARTES0=[('a-lista','.lcSobTop','Lista de compras · começo'),('b-sobrando','[data-act=lcOferta]','Lista de compras · sobrando e oferta'),('c-pedido','[data-act=lcPedir]','Lista de compras · fim e ações'),('d-vitrine','[data-act=vitLug]','Vitrine da semana')]
PARTES=[p for p in PARTES0 if p[0][0]=='c']
import sys as _s
if len(_s.argv)>1: PARTES=[p for p in PARTES if p[0][0] in _s.argv[1]]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,sel,tit in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(900);tela(pg,w)
                if prop: pg.add_style_tag(content=CSS67);w(300)
                pg.evaluate("s=>{const e=document.querySelector(s);scrollTo(0,e.getBoundingClientRect().top+scrollY-(s.includes('Pedir')?300:150))}",sel);w(350)
                oo.append(olho(pg));p=T+'g67_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('67%s-app-giro-botoes-%s.jpg'%(nome,tema),'App · Giro › botões (aba 2) · %s · tema %s'%(tit,tema),
              ['Hoje: texto da lista centralizado e espremido, − e + soltos, "Sobrando" em caixa amarela grossa, "Oferta ›" e "Salvar" com cara de botão principal.',
               'Proposta: 1 principal (Marcar como pedido, contorno rosa) · sem \"Mandar ao fornecedor\" (já está em Inventário › Fornecedores) · Salvar neutro · "Oferta ›" texto rosa · − n + num seletor só · texto à esquerda.'],*fs)
