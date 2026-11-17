# S374 · esboço 94 (dono 17/11 10:04: "quero que essa tela esteja integrada ao app; do jeito que está é um painel totalmente separado").
# Hoje: Site › (Vitrine, Modelos…) abre o painel do site por cima de tudo, com topo próprio (Sair · No ar · Cliente), barra de baixo própria
# e cores roxas próprias. Proposta: o painel vira tela do app — fica o topo do app (logo, sino, "Modelos ⌄" da família Site) e a barra de
# baixo do app; some o topo e a barra do painel; cores, letras e botões do app (abas de linha, contorno rosa, linhas num cartão).
# "No ar" e "Cliente" já estão na tela Site ("O site está no ar" em Ajustes do site; "Abrir a loja como o cliente vê ›"). "Sair" não precisa.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s374');import comum,apsite
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s93=open('/home/claude/lafouch/work/s374/esb93.py').read()
C93=s93.split('CSS="""')[1].split('"""')[0].replace('#pnx,#st,#cl{min-height:44px!important}','').replace('nav.bn button{font-size:11px!important;letter-spacing:-.1px}','')
J93=s93.split('JS=r"""')[1].split('"""')[0]
FCSS="""html body header.top:has(#pnx){display:none!important}html body nav.bn{display:none!important}html body #main h1.serif{display:none!important}
body{background:var(--bg)!important;padding-bottom:20px!important}#main{padding-top:4px!important}"""+C93
APP="""(n)=>{const s=document.getElementById('siteBox');s.classList.remove('full');const t=document.querySelector('#grpTabs .dHdT');if(t)t.firstChild.textContent=n+' ';
 const fr=document.getElementById('lojaFrame'),top=s.getBoundingClientRect().top;s.style.cssText='position:static;width:auto;inset:auto;background:none;border:0;margin:0;padding:0';fr.style.cssText='width:calc(100% + 32px);margin:-14px -16px 0;border:0;display:block;height:'+(innerHeight-top-74)+'px;background:transparent';return top}"""
VARS="""()=>{const r=getComputedStyle(document.documentElement),g=v=>r.getPropertyValue(v).trim();return ':root{--bg:'+g('--bg')+';--s1:'+g('--panel')+';--card:'+g('--panel')+';--s2:'+g('--panel2')+';--ln:'+g('--line')+';--tx:'+g('--fg')+';--mu:'+g('--mute')+';--ac:'+g('--accent-fg')+';--af:'+g('--accent-fg')+';--ok:'+g('--ok')+';--wn:'+g('--warn')+'}'}"""
NOMES={'vit':'Vitrine','prod':'Modelos','msg':'Mensagens','tem':'Temática','anl':'Analisador','cfg':'Ajustes do site'}
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for i,v in enumerate(['vit','prod','msg','tem','anl','cfg']):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=apsite.abre(pw,esc);pg.evaluate("v=>window.__LF.ACT.stAbre(v)",v);w(4500)
                f=apsite.frame(pg)
                if prop:
                    vr=pg.evaluate(VARS);pg.evaluate(APP,NOMES[v]);f.add_style_tag(content=vr+FCSS);f.evaluate(J93);w(600)
                oo.append(olho(pg));p=T+'p94_%s_%d_%d.png'%(v,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(v,tema,'novos:',novos(oo[0],oo[1]))
            nm=NOMES[v].lower().replace('á','a').replace(' ','-')
            prancha('94%s-app-site-%s-%s.jpg'%('abcdef'[i],nm,tema),'App · Site › %s · painel integrado · tema %s'%(NOMES[v],tema),
              ['Hoje: o painel abre por cima do app — topo próprio (Sair · No ar · Cliente), barra de baixo própria e cores roxas próprias.',
               'Proposta: tela do app — topo do app com "%s ⌄" (família Site), barra de baixo do app, cores e botões do app; some o topo e a barra do painel. "No ar" e "Cliente" já ficam na tela Site.'%NOMES[v]],*fs)
