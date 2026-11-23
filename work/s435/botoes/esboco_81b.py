# Esboço 81b (S435, 22/11 23:35) — o 81 na PRÁTICA, em telas reais (dono 23:31 "como isso ficaria numa simulação prática? onde mudaria?").
# Hoje = app de hoje (sem base). Proposta = base aprovada + a família de botões do 81:
#  Caixa › Retirar (.fx418P → principal .go) · Ajustes › Cópias e nuvem (.btn-sc → pequeno .mini) · Ajustes › Impressora (.impBp → .mini)
#  · janela 'Apagar esta foto?' (vermelho na linha que hoje sai neutro → perigo vermelho; 'Cancelar' em botão vira 'Voltar' embaixo, regra 15).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
TROCA=r"""()=>{document.querySelectorAll('.fx418P,.pd418P').forEach(b=>{b.className='go'});document.querySelectorAll('.btn-sc,.b75,.up75,.impBp').forEach(b=>{b.className='mini';b.style.setProperty('gap','8px');b.style.setProperty('display','inline-flex');b.style.setProperty('align-items','center');b.style.setProperty('justify-content','center')});
 document.querySelectorAll('[data-act=fotoapaga]').forEach(b=>{b.className='go';b.style.cssText='width:100%;background:#c0392b!important;border-color:#c0392b!important;color:#fff!important'});
 document.querySelectorAll('[data-act=fotosheetfecha]').forEach(b=>{b.className='lkTx';b.textContent='Voltar';b.style.cssText='display:block;margin:4px auto 0;min-height:44px;font-weight:600;color:var(--fg);background:none;border:0'})}"""
def cena(pw,esc,base,k):
  b,pg,w=ap.abre(pw,'caixa' if k=='ret' else 'ajustes',esc,'celular',base=base);w(900)
  if k=='ret': pg.evaluate("()=>{window.__LF.S.cxAcao='ret';window.__LF.render()}");w(1200)
  elif k in('bk','imp'):
    pg.locator('.ajS[data-k="%s"] .ajR'%k).click();w(900)
    pg.evaluate("k=>document.querySelector('.ajS[data-k=\"'+k+'\"]').scrollIntoView({block:'start'})",k);w(500)
  elif k=='foto':
    pg.evaluate("()=>{window.__LF.S.syncOn=true;window.__fotoApagaPede&&window.__fotoApagaPede('SL2201|C1')}");w(1200)
  if base: pg.evaluate(TROCA);w(500)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  if k=='ret': pg.evaluate("()=>{const b=[...document.querySelectorAll('.cxAcao.on button')].filter(b=>/Retirar/.test(b.textContent)).pop();b&&b.scrollIntoView({block:'end'})}");w(400)
  pg.screenshot(path='/tmp/c.png');b.close();return Image.open('/tmp/c.png').convert('RGB')
CENAS=[('ret','Caixa › Retirar','principal: igual ao "Ir para o pagamento"'),('bk','Ajustes › Cópias e nuvem','pequeno: Exportar · Importar'),('imp','Ajustes › Impressora','pequeno: Procurar impressora'),('foto','Apagar esta foto?','perigo: vermelho + Voltar')]
with sync_playwright() as pw:
  for esc in (True,False):
    F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',26);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',20)
    pares=[(t,s,cena(pw,esc,False,k),cena(pw,esc,True,k)) for k,t,s in CENAS]
    W=pares[0][2].width//2;H=pares[0][2].height//2
    o=Image.new('RGB',(len(pares)*(2*W+40)+40,H+150),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o);fg=(210,210,215) if esc else (50,45,48)
    for i,(t,s,a,p) in enumerate(pares):
      x=30+i*(2*W+40);d.text((x,18),t,font=F,fill=fg);d.text((x,54),s,font=F2,fill=(141,58,105))
      d.text((x,90),'HOJE',font=F2,fill=(150,140,145));d.text((x+W+10,90),'PROPOSTA',font=F2,fill=(141,58,105))
      o.paste(a.resize((W,H)),(x,120));o.paste(p.resize((W,H)),(x+W+10,120))
    o.save('esboco_81b_botoes_na_pratica_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print(o.size)
