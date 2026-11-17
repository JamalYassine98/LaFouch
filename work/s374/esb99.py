# S374 · esboço 99 (dono 17/11 12:46 "Sim"): padrão ÚNICO de "abrir no lugar" (lista estilo Apple) — o jeito do 98 que o dono amou:
# linhas juntas num cartão (título 16 px + frase), uma linha fina entre elas; o bloco abre DENTRO do cartão, com a animação Apple.
# Seta: "⌄" que gira para "⌃" ao abrir (o "›" fica só para o que leva a outra tela — mesma cara = mesma função).
# Telas: Giro, Reservas, Despesas, Preços, Ajustes (o Marketing do 98 entra igual).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS="""
.g99{border:1px solid var(--line);background:var(--panel);border-radius:16px;overflow:hidden;margin:0 0 16px;box-shadow:none}
.g99>section.card.fxF{margin:0!important;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;padding:0!important;border-bottom:1px solid var(--line)!important}
.g99>section.card.fxF:last-child{border-bottom:0!important}
.g99 .fxH,.r99{display:flex!important;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:60px;padding:12px 16px!important;background:none!important;border:0!important;border-radius:0!important;font:inherit;color:var(--fg);text-align:left}
.g99 .fxH b{font-size:16px!important;font-weight:600}
.g99 .fxC,.r99 i{font-style:normal;color:var(--mute);font-size:18px;transition:transform .25s;display:inline-block}
.g99 .fxH[aria-expanded=true] .fxC{transform:rotate(180deg)}
.g99 section.fxF>*:not(.fxH){padding-left:16px;padding-right:16px}
#ajGrp .ajS:not([data-k=site]) .ajCh{transform:rotate(90deg)}#ajGrp .ajS.on .ajCh{transform:rotate(-90deg)}
"""
GRUPO=r"""()=>{const v=document.querySelector('.view:not([hidden])');const ss=[...v.querySelectorAll('section.card.fxF')];const feitos=new Set();
 ss.forEach(s=>{if(feitos.has(s))return;const run=[s];let n=s.nextElementSibling;while(n&&n.matches('section.card.fxF')){run.push(n);n=n.nextElementSibling}
  const g=document.createElement('div');g.className='g99';s.before(g);run.forEach(x=>{feitos.add(x);g.appendChild(x)})});
 const ch=[...v.querySelectorAll('[data-act=dfold].chip')];ch.forEach(c=>{const t=c.textContent.replace('⌄','').trim();const g=document.createElement('div');g.className='g99';g.innerHTML='<button type="button" class="r99"><span style="min-width:0"><b style="font-size:16px;font-weight:600">'+t+'</b></span><i aria-hidden="true">⌄</i></button>';const p=c.parentElement;(p.children.length===1?p:c).replaceWith(g)});return ss.length+ch.length}"""
CEN=[('a','giro','Giro',"()=>window.__LF.inicioGo('giro')",None,
      'Hoje: cada bloco num cartão solto ("Lista de compras", "Vitrine da semana"…), com "⌄".','Proposta: os blocos juntos num cartão, em linhas (como no 98); ao tocar, abre dentro do cartão e "⌄" gira para "⌃".'),
     ('b','reservas','Reservas',"()=>window.__LF.inicioGo('din')",None,
      'Hoje: "Ver para onde vai ⌄" é uma pílula, e "Próximos 30 dias" é um cartão solto — dois desenhos para a mesma função.','Proposta: os dois viram linhas do mesmo cartão, no padrão único de abrir no lugar.'),
     ('c','despesas','Despesas',"()=>window.__LF.setView('desp')",None,
      'Hoje: "Imprevistos do mês" e "Contas pagas neste mês" em cartões soltos.','Proposta: as duas linhas juntas num cartão, no padrão único.'),
     ('d','precos','Preços',"()=>window.__LF.inicioGo('prec')",None,
      'Hoje: "Contas, taxas e meta" em cartão solto.','Proposta: a mesma linha do padrão único (sozinha, o cartão é só dela).'),
     ('e','ajustes','Ajustes',"()=>window.__LF.setView('ajustes')",None,
      'Hoje: as linhas de Ajustes abrem no lugar, mas usam "›" — o mesmo sinal de "ir para outra tela".','Proposta: as linhas que abrem no lugar usam "⌄" (gira ao abrir). "Site" continua com "›" porque leva à tela Ajustes do site.')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,nm,tit,abre,depois,h,p_ in CEN:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate(abre);w(1300)
                if prop: pg.add_style_tag(content=CSS);pg.evaluate(GRUPO);w(200)
                if depois: pg.evaluate(depois);w(900)
                pg.evaluate("()=>{const e=document.querySelector('.view:not([hidden]) .g99')||document.querySelector('.view:not([hidden]) section.card.fxF')||document.querySelector('.view:not([hidden]) [data-act=dfold]');if(e&&e.getBoundingClientRect().top>500)scrollTo({top:e.getBoundingClientRect().top+scrollY-240,behavior:'instant'})}");w(300)
                oo.append(olho(pg));p=T+'b99_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            prancha('99%s-app-abrir-no-lugar-%s-%s.jpg'%(k,nm,tema),'App · padrão "abrir no lugar" · %s · tema %s'%(tit,tema),[h,p_],*fs)
