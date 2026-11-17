# S374 · esboço 99b2 + 99f (dono 17/11 13:04): "Ver para onde vai" ainda fora do padrão (ficou um cartão dentro do cartão) +
# as contas de Despesas (Aluguel, Luz, Contador, Imprevistos, Salário…) também abrem no lugar → mesmo padrão.
# 99b2: "Ver para onde vai" sai de dentro do cartão "Livre para você" e vira linha do mesmo cartão de "Próximos 30 dias".
# 99f: as contas de cada grupo (LOJA, CASA…) viram linhas de um cartão só, com "⌄".
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s99=open('/home/claude/lafouch/work/s374/esb99.py').read();CSS=s99.split('CSS="""')[1].split('"""')[0]
CSS+="""
.g99>.card.ecF{margin:0!important;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;border-bottom:1px solid var(--line)!important}
.g99>.card.ecF:last-child{border-bottom:0!important}
"""
RES=r"""()=>{const v=document.querySelector('.view:not([hidden])');const c=[...v.querySelectorAll('[data-act=dfold].chip')][0];const p30=[...v.querySelectorAll('section.card.fxF')][0];
 const t=c.textContent.replace('⌄','').trim();const g=document.createElement('div');g.className='g99';p30.before(g);
 const s=document.createElement('section');s.className='card fxF';s.innerHTML='<button type="button" class="fxH"><span style="min-width:0"><b style="font-size:15px">'+t+'</b><span class="hint" style="display:block;margin:2px 0 0">o que já tem dono: reposição, contas, colchão</span></span><i class="fxC" aria-hidden="true">⌄</i></button>';
 g.appendChild(s);g.appendChild(p30);const pp=c.parentElement;(pp.children.length===1?pp:c).remove();return 1}"""
DESP=r"""()=>{const v=document.querySelector('.view:not([hidden])');const ss=[...v.querySelectorAll('.card.ecF')];const f=new Set();
 ss.forEach(s=>{if(f.has(s))return;const run=[s];let n=s.nextElementSibling;while(n&&n.matches('.card.ecF')){run.push(n);n=n.nextElementSibling}const g=document.createElement('div');g.className='g99';s.before(g);run.forEach(x=>{f.add(x);g.appendChild(x)})});
 const s99=[...v.querySelectorAll('section.card.fxF')];return ss.length}"""
GRUPO=s99.split('GRUPO=r"""')[1].split('"""')[0]
CEN=[('b2','reservas','Reservas',"()=>window.__LF.inicioGo('din')",RES,"()=>{const e=document.querySelector('.view:not([hidden]) .g99')||[...document.querySelectorAll('.view:not([hidden]) section.card.fxF')][0];scrollTo({top:e.getBoundingClientRect().top+scrollY-420,behavior:'instant'})}",
      'Esquerda = 99b: "Ver para onde vai" ficou um cartão dentro do cartão "Livre para você" — fora do padrão.',
      'Proposta: "Ver para onde vai" sai do cartão de cima e vira a 1ª linha do cartão de "Próximos 30 dias" — as duas no padrão único, com "⌄".'),
     ('f','despesas-contas','Despesas · contas',"()=>window.__LF.setView('desp')",DESP,"()=>{const e=[...document.querySelectorAll('.view:not([hidden]) .card.ecF')][0];scrollTo({top:e.getBoundingClientRect().top+scrollY-200,behavior:'instant'})}",
      'Hoje: cada conta (Aluguel, Luz, Internet, Contador, Imprevistos, Salário…) num cartão solto com "⌄".',
      'Proposta: as contas de cada grupo (Loja, Casa…) viram linhas de um cartão só, no padrão único; abre no lugar, "⌄" gira para "⌃".')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,nm,tit,abre,js,rola,h,p_ in CEN:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate(abre);w(1300)
                if prop: pg.add_style_tag(content=CSS);pg.evaluate(js);pg.evaluate(GRUPO);pg.evaluate("()=>document.querySelectorAll('.g99').forEach(g=>{if(!g.children.length)g.remove();if(g.parentElement&&g.parentElement.classList.contains('g99')){const p=g.parentElement;[...g.children].forEach(c=>p.insertBefore(c,g));g.remove()}})");w(200)
                elif k=='b2': pg.add_style_tag(content=CSS);pg.evaluate(GRUPO);w(200)
                pg.evaluate(rola);w(300)
                oo.append(olho(pg));p=T+'b99_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            prancha('99%s-app-abrir-no-lugar-%s-%s.jpg'%(k,nm,tema),'App · padrão "abrir no lugar" · %s · tema %s'%(tit,tema),[h,p_],*fs)
