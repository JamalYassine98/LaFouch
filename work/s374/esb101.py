# S374 · esboço 101 (dono 17/11 13:31: "antes disso quero esboço de todas as telas de novo").
# Todas as telas do app com o catálogo aplicado (tela inteira, de cima a baixo):
#  99  ABRIR NO LUGAR  — blocos juntos num cartão, em linhas (16 px negrito + frase), "⌄" que gira; Ajustes com "⌄" (Site com "›").
#  100 IR PARA OUTRA TELA — linha de lista com "›" parado; link solto rosa 15 px negrito com "›" colado, SOZINHO = centralizado,
#      AO LADO de outro botão = no lugar; "Marcar como paga" = botão secundário (é ação).
#  98  Marketing como tela (com "⌄" nos blocos).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from PIL import Image
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
L=lambda f:open('/home/claude/lafouch/work/s374/'+f).read()
s98,s99,s100=L('esb98.py'),L('esb99.py'),L('esb99f.py')
C99=L('esb99f.py').split('CSS+="""')[1].split('"""')[0]+s99.split('CSS="""')[1].split('"""')[0]
C100=L('esb100.py').split('CSS="""')[1].split('"""')[0]
C98=s98.split('CSS="""')[1].split('"""')[0]
GRUPO=s99.split('GRUPO=r"""')[1].split('"""')[0]
RES=s100.split('RES=r"""')[1].split('"""')[0];DESP=s100.split('DESP=r"""')[1].split('"""')[0]
MK1=s98.split('JS=r"""')[1].split('"""')[0];MK2=s98.split('JS2=r"""')[1].split('"""')[0]
CSS=C99+C100+C98+"""
.g99.h101>*{width:100%!important;max-width:none!important;box-sizing:border-box;margin:0!important;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;border-bottom:1px solid var(--line)!important}.g99.h101>*:last-child{border-bottom:0!important}
.lk100.c101{display:block!important;margin:8px auto 0!important;text-align:center!important}
#v-cup .mk98 .mkDt>summary.mkSec::after{content:'⌄'!important;font-size:18px}#v-cup .mk98 .mkDt[open]>summary.mkSec::after{transform:rotate(180deg)!important}
"""
# links "ir para outra tela": sozinho = centralizado; ao lado de outro botão = no lugar
LINKS=r"""()=>{const v=document.querySelector('.view:not([hidden])')||document.body;let n=0;
 const fora='.fxRow,.ajR,.stL,.st96,.pv97,.dOp,.fxH,.pcard,.estFi,.ifNum,.kpi,.kpiLk,.stN,.mn,.lfaSh,.r99,.mkPb,.mkSt,.dHdT,.ataL,.rw77,.lcSecS,.lnk77,.lk77';
 v.querySelectorAll('button,a').forEach(e=>{const t=(e.textContent||'').trim();if(!/›\s*$/.test(t)||t.length<4||!e.offsetParent)return;if(e.closest(fora)||e.matches(fora))return;
  const s=getComputedStyle(e);if(s.backgroundColor!=='rgba(0, 0, 0, 0)'&&!e.matches('.gBtn,.chip,.lcT,.btn-sc'))return;if(parseFloat(s.borderTopWidth)>0&&s.borderTopStyle!=='none'&&!e.matches('.gBtn,.chip,.lcT,.btn-sc'))return;
  const irm=[...e.parentElement.children].filter(x=>x!==e&&x.matches('button,a')&&x.offsetParent&&(x.textContent||'').trim());
  e.classList.add('lk100');if(irm.length&&!e.matches('.gBtn')){e.classList.add('inl')}else e.classList.add('c101');n++});
 v.querySelectorAll('.slVai:not(.mpg73)').forEach(e=>{e.classList.add('r100','c101');const b=e.querySelector('b');if(b&&!/›/.test(b.textContent))b.textContent=b.textContent.trim()+' ›'});
 v.querySelectorAll('.mpg73').forEach(e=>{e.classList.add('b100');const b=e.querySelector('b');if(b)b.textContent=b.textContent.replace(/\s*›\s*$/,'')});
 const r=document.getElementById('ajGrp');return n}"""
HIST=r"""()=>{const v=document.querySelector('.view:not([hidden])');v.querySelectorAll('.list').forEach(l=>{const its=[...l.children].filter(x=>x.matches('.pcard.hDia,.card.hSem,.hSemB'));if(its.length<1)return;let g=null;[...l.children].forEach(x=>{if(x.matches('.pcard.hDia,.card.hSem,.hSemB')){if(!g){g=document.createElement('div');g.className='g99 h101';x.before(g)}g.appendChild(x)}else g=null})});return 1}"""
LIMPA=r"""()=>document.querySelectorAll('.g99').forEach(g=>{if(!g.children.length)g.remove();else if(g.parentElement&&g.parentElement.classList.contains('g99')){const p=g.parentElement;[...g.children].forEach(c=>p.insertBefore(c,g));g.remove()}})"""
TELAS=[('01','inicio','Início',"()=>window.__LF.setView('inicio')"),('02','vender','Vender',"()=>window.__LF.setView('vendas')"),
 ('03','vender-peca','Vender › peça',"()=>{window.__LF.setView('vendas');setTimeout(()=>document.querySelectorAll('#v-vendas .pcard')[1].click(),300)}"),
 ('04','inventario','Inventário',"()=>window.__LF.setView('estoque')"),('05','inventario-peca','Inventário › peça',"()=>{window.__LF.setView('estoque');setTimeout(()=>document.querySelectorAll('#v-estoque .pcard')[1].click(),300)}"),
 ('06','estudio','Estúdio',"()=>window.__LF.inicioGo('est')"),('07','resultados-dia','Resultados › Dia',"()=>window.__LF.inicioGo('hoje')"),('08','historico','Resultados › Histórico',"()=>window.__LF.inicioGo('hist')"),
 ('09','giro','Giro',"()=>window.__LF.inicioGo('giro')"),('10','precos','Preços',"()=>window.__LF.inicioGo('prec')"),('11','reservas','Reservas',"()=>window.__LF.inicioGo('din')"),
 ('12','caixa','Caixa',"()=>window.__LF.setView('caixa')"),('13','despesas','Despesas',"()=>window.__LF.setView('desp')"),('14','cambio','Câmbio',"()=>window.__LF.setView('fx')"),
 ('15','site','Site',"()=>window.__LF.setView('site')"),('16','pedidos','Pedidos',"()=>window.__LF.setView('ped')"),('17','marketing','Marketing',"()=>window.__LF.inicioGo('mkt')"),
 ('18','cartoes','Cartões',"()=>window.__LF.inicioGo('cup')"),('19','clientes','Clientes',"()=>window.__LF.setView('clientes')"),('20','atacado','Atacado',"()=>window.__LF.setView('ata')"),
 ('21','ajustes','Ajustes',"()=>window.__LF.setView('ajustes')"),('22','avisos','Avisos',"()=>window.__LF.setView('notif')")]
def foto(pg,p):
    pg.add_style_tag(content='#mainnav{visibility:hidden!important}')
    H=min(pg.evaluate("()=>document.documentElement.scrollHeight"),2600);vh=pg.evaluate("()=>innerHeight");partes=[];y=0
    while True:
        pg.evaluate("y=>scrollTo({top:y,behavior:'instant'})",y);pg.wait_for_timeout(180);sy=pg.evaluate("()=>scrollY")
        q=p+'.%d.png'%len(partes);pg.screenshot(path=q);partes.append((sy,q))
        if sy+vh>=H-2 or len(partes)>5: break
        y=sy+vh
    W=Image.open(partes[0][1]).width;k=W/390.0;tot=int(min(H,partes[-1][0]+vh)*k)
    out=Image.new('RGB',(W,tot),'#000')
    for sy,q in partes: out.paste(Image.open(q),(0,int(sy*k)))
    out.save(p)
def iguala(a,b):
    A,B=Image.open(a),Image.open(b);h=max(A.height,B.height)
    for x,p in ((A,a),(B,b)):
        if x.height<h:
            n=Image.new('RGB',(x.width,h),'#f1eef0');n.paste(x,(0,0));n.save(p)
so=[x for x in os.environ.get('SO','').split(',') if x]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for num,nm,tit,abre in TELAS:
            if so and num not in so: continue
            if os.environ.get('PULA') and os.path.exists(comum.OUT+'101-%s-app-%s-%s.jpg'%(num,nm,tema)) and os.path.getmtime(comum.OUT+'101-%s-app-%s-%s.jpg'%(num,nm,tema))>float(os.environ['PULA']): continue
            fs=[];oo=[];mudou=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate(abre);w(1600)
                if prop:
                    if nm=='marketing':
                        c=pg.evaluate(MK1);w(900);pg.add_style_tag(content=CSS);pg.evaluate(MK2,c);w(200)
                    else:
                        pg.add_style_tag(content=CSS)
                        if nm=='reservas': pg.evaluate(RES);pg.evaluate(GRUPO)
                        elif nm=='despesas': pg.evaluate(DESP);pg.evaluate(GRUPO)
                        elif nm=='historico': pg.evaluate(HIST);pg.evaluate(GRUPO)
                        else: pg.evaluate(GRUPO)
                        pg.evaluate(LIMPA)
                    pg.evaluate(LINKS);w(300)
                oo.append(olho(pg));p=T+'t101_%s_%d_%d.png'%(num,esc,prop);foto(pg,p);fs.append(p);b.close()
            iguala(*fs)
            print(num,nm,tema,'novos:',novos(oo[0],oo[1]))
            prancha('101-%s-app-%s-%s.jpg'%(num,nm,tema),'App · %s · tela inteira · tema %s'%(tit,tema),
              ['Tela inteira de cima a baixo (sem a barra de baixo). Esquerda = hoje (com o que já foi publicado). Direita = com o catálogo aprovado: 99 (abrir no lugar: linhas num cartão, "⌄"), 100 (ir para outra tela: linha com "›" parado; link rosa sozinho centralizado, ao lado de outro botão no lugar; "Marcar como paga" = botão).'],*fs)
