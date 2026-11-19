# S436: esboço de EXEMPLO da família Voltar — tela Pagamento. Hoje (app + aprovados) × Proposta (só o Voltar muda).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap,json;from telas import C
from playwright.sync_api import sync_playwright
P=dict(C)['catalogo-pagamento'];O='/home/claude/lafouch/work/s436/'
ACHA=r"""const b=[...document.querySelectorAll('button,a')].filter(x=>{const r=x.getBoundingClientRect();return r.height>0&&r.top<400&&/^‹\s*Carrinho/i.test(x.innerText.trim())})[0];"""
CSS='#v-vendas .top .bk143{font-size:12px!important;font-weight:600!important;letter-spacing:1.68px!important;margin:-8px 0 -4px!important;text-transform:uppercase!important;color:var(--mute)!important}'
MED="()=>{"+ACHA+r"""const h=[...document.querySelectorAll('h1,h2')].filter(x=>x.getBoundingClientRect().height&&/Pagamento/.test(x.innerText))[0];const r=b.getBoundingClientRect(),t=h.getBoundingClientRect(),c=getComputedStyle(b);
return {botao:b.innerText.replace(/\n/g,''),fs:c.fontSize,caixa:c.textTransform,cor:c.color,x:Math.round(r.x),tituloX:Math.round(t.x),alt:Math.round(r.height),fimBotao:Math.round(r.bottom),topoTitulo:Math.round(t.top)}}"""
REF=r"""()=>{const b=[...document.querySelectorAll('.nvVs')].filter(x=>x.getBoundingClientRect().height)[0];if(!b)return null;const r=b.getBoundingClientRect(),c=getComputedStyle(b),h=[...b.parentElement.querySelectorAll('h1,h2')].filter(x=>x.getBoundingClientRect().height)[0];const t=h?h.getBoundingClientRect():{x:0,top:0};
return {botao:b.innerText.replace(/\n/g,''),fs:c.fontSize,caixa:c.textTransform,cor:c.color,x:Math.round(r.x),tituloX:Math.round(t.x),alt:Math.round(r.height),fimBotao:Math.round(r.bottom),topoTitulo:Math.round(t.top)}}"""
R={}
def passos(pg,w,L):
  for p in L:
    try: pg.evaluate(p)
    except Exception as e: print('passo',str(e)[:80],file=sys.stderr)
    w(700)
with sync_playwright() as pw:
  for esc in (True,False):
    k='E' if esc else 'C';n='escuro' if esc else 'claro'
    for fase in ('hoje','prop'):
      b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);passos(pg,w,P)
      if fase=='prop': pg.add_style_tag(content=CSS);w(300)
      R[fase+k]=pg.evaluate(MED);pg.screenshot(path=O+'%s_%s.png'%(fase,n));b.close()
    b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);passos(pg,w,dict(C)['cambio-dolar'])
    R['ref'+k]=pg.evaluate(REF);pg.screenshot(path=O+'ref_%s.png'%n);b.close()
print(json.dumps(R,ensure_ascii=False))
