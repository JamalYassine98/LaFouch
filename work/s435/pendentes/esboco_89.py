# Esboço 89 (S435, 23/11 07:50) — as 2 pendências de design: (1) "Nenhuma cópia" e os outros avisos de Ajustes (.ajRes.al) passam de rosa
# para AMARELO (regra 17: amarelo = atenção, rosa = ação) — uma regra só, no .ajRes.al; (2) Fornecedores: sai o parágrafo
# "Todas as compras que você registrou…" (regra 83: textos explicativos saem). Base: app de hoje + TODOS os aprovados (aprovados.py).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura')
import ap,aprovados as A
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/pendentes/'
AMAR='#v-ajustes .ajRes.al{color:var(--warn)!important}#v-ajustes .ajRes.al .ajPt{background:var(--warn)!important}'
TIRA_F=r"""()=>{[...document.querySelectorAll('.hint')].filter(e=>/^Todas as compras que você registrou/.test(e.textContent.trim())).forEach(e=>{const m=e.textContent.match(/Investido neste mês: (US\$ [\d.,]*\d)/);
 const mes=new Date().toLocaleDateString('pt-BR',{month:'long'});
 e.outerHTML=m?'<div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;border-bottom:1px solid var(--line2);font-size:16px;font-weight:500"><span>Investido em '+mes+'</span><span style="font-variant-numeric:tabular-nums">'+m[1]+'</span></div>':''})}"""
def shot(pg,n):
  f='/tmp/p89_%s.png'%n;pg.screenshot(path=f);x=Image.open(f);x.load();return x.copy()
def ajustes(pw,esc,prop):
  b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=False)
  pg.evaluate("()=>{try{localStorage.removeItem('lf_lastBackup')}catch(e){}const S=__LF.S;S.lastBackup=0;S.bkUlt=0}")
  A.aplica(pg);A.ajustes(pg);w(400)
  if prop:pg.add_style_tag(content=AMAR)
  w(300);x=shot(pg,'aj%d%d'%(esc,prop));b.close();return x
def forn(pw,esc,prop):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False)
  pg.evaluate("()=>__LF.inicioGo('lotes')");w(1500)
  A.aplica(pg);w(300)
  if prop:pg.evaluate(TIRA_F)
  w(300);x=shot(pg,'fo%d%d'%(esc,prop));b.close();return x
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',30);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',22)
def quadro(arq,q):
  W=q[0][2].width;H=max(i.height for _,_,i in q);o=Image.new('RGB',(len(q)*(W+30)+30,H+120),(17,20,26));d=ImageDraw.Draw(o)
  for i,(t,s,im) in enumerate(q):
    x=30+i*(W+30);d.text((x,18),t,font=F,fill=(141,58,105));d.text((x,62),s,font=F2,fill=(170,160,165));o.paste(im,(x,100))
  o.save(O+arq,quality=86);print(arq)
with sync_playwright() as pw:
  for esc in (True,False):
    tm='escuro' if esc else 'claro'
    quadro('esboco_89a_aviso_amarelo_%s.jpg'%tm,[('HOJE · Ajustes','"Nenhuma cópia" em rosa (rosa = ação)',ajustes(pw,esc,0)),('PROPOSTA · Ajustes','em amarelo (amarelo = atenção)',ajustes(pw,esc,1))])
    quadro('esboco_89b_fornecedores_%s.jpg'%tm,[('HOJE · Fornecedores','parágrafo de explicação no topo',forn(pw,esc,0)),('PROPOSTA · Fornecedores','sem o parágrafo · fica o número do mês em linha',forn(pw,esc,1))])
