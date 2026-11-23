# 96e + 96f (S435, 23/11 09:20) — os setores que mudam com 'cupom sem código, só com conta' (dono 08:50).
# 96e · Marketing › Cartões (73s aprovado): 'Códigos ativos' vira 'Cartões ativos' — a lista mostra a CLIENTE (nome · tipo · % · até),
#       sem código e sem 'Aplicar no pedido' (o cupom se usa no Carrinho, 96 v2: um lugar só).
# 96f · depois da venda: hoje abre a janela 'Cartão do cliente' (código LF-…, WhatsApp com o código, QR). Com o 78 o cartão já é escolhido
#       no Carrinho (com cliente cadastrado) → vai direto para a conta dela; a janela sai e fica o aviso que passa (85): 'Cartão de 10% na conta da Ana'.
exec(open('/home/claude/lafouch/work/s435/semp/esboco_73s.py').read().rsplit("\nif __name__",1)[0].split("\nwith sync_playwright()")[0])
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import aprovados as A2
O='/home/claude/lafouch/work/s435/oferta96/'
CART2=CART.replace("LN('','Códigos ativos','os cartões que valem agora','','›')","LN('','Cartões ativos','por cliente · sem código','','›')")
LISTA=r"""TOP('Cartões','Cartões ativos','',0)+T('Valem agora · 3',1)+LN('tick','Ana Benítez','Próxima compra · 10% · até 15/12','','')+LN('fiel','Ana Benítez','Cliente fiel · 10% · ganhou na 3ª compra','','')+LN('ami','Carla Duarte','Indique uma amiga · 10% · até 30/12','','')"""
HOJEJ='<div class="col" style="gap:10px;padding:0 16px 16px"><div class="hint" style="margin:0">10% na próxima compra · vale na loja e em lafouch.com · 1 uso</div><button type="button" class="go">🎟️ Entregar cartão "Próxima compra" a Ana Benítez</button></div>'
def venda(pw,esc,prop):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(800)
  if not prop:
    pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
    pg.evaluate("h=>{const j=[...document.querySelectorAll('.ljJn')].pop();const t=j.querySelector('.ljHd b');if(t)t.textContent='Cartão do cliente';(j.querySelector('.ljCorpo')||j).innerHTML=h}",HOJEJ);w(500)
  else:
    A2.aplica(pg);w(200);pg.evaluate("()=>window.__LF.lfToast('Presente de 10% na conta da Ana','ok')");w(700)
    pg.evaluate("()=>{const e=[...document.querySelectorAll('body *')].filter(e=>/^Presente de 10% na conta da Ana/.test(e.textContent.trim())).pop();let t=e;while(t&&t.parentElement&&getComputedStyle(t).position!='fixed')t=t.parentElement;[t,e].forEach(x=>{x.style.setProperty('background','var(--panel2)','important');x.style.setProperty('color','var(--fg)','important');x.style.setProperty('border-color','var(--line)','important')})}")
  w(300);pg.screenshot(path='/tmp/e96f.png');b.close();im=Image.open('/tmp/e96f.png');im.load();return im.copy()
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_96e_cartoes_ativos_%s.jpg'%n,[('PROPOSTA · Marketing › Cartões',n+' · "Cartões ativos" (era "Códigos ativos")',tela(pw,esc,CART2,'Cartões')),('PROPOSTA · Cartões ativos',n+' · por cliente · sem código · sem "Aplicar no pedido"',tela(pw,esc,LISTA,'Lista'))])
    quadro('esboco_96f_depois_da_venda_v2_%s.jpg'%n,[('HOJE · depois da venda',n+' · janela com código, WhatsApp e QR',venda(pw,esc,0)),('PROPOSTA · depois da venda',n+' · o cartão já foi para a conta dela',venda(pw,esc,1))])
for n,f in REL: print(n,f)
