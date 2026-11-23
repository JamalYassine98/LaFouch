# Esboço 78 (S435, 22/11 22:05) — CUPONS NO CAIXA (substitui o 55 'linhas por peça', obsoleto 22/11 00:26). Aprovados que entram:
# 21/11 23:27 desconto na ÚLTIMA peça (3 de G$ 60.000 com folga de 10% cada = '3ª com 30%'), nada extra por quantidade;
# 21/11 23:30 'costuma fechar com X%' no Carrinho (o Titan aprende pelo valor recebido × lista), SEM botão 'não levou';
# 21/11 23:58 as alavancas (última peça, brinde, próxima compra) o SEMP sugere e o TITAN confere; 23:59 desconto no caixa por CUPOM;
# 22/11 06:52 a MOLA: a folga de desconto é a diferença entre o preço parado e o mínimo do dia (hoje 0%: preço abaixo do mínimo).
# Base: Carrinho REAL (src/98-carrinho.js: SL2201 C1 Preto ×3 a G$ 60.000; 'Sugestão para oferecer ao cliente · Leve 2' de hoje) +
# código de desconto de hoje (src/97-cupons.js cupCx, hoje só no Pagamento) — vem para o Carrinho, um lugar só.
# Dono 22:04: o Cartão Próxima compra exige o cliente CADASTRADO na loja → sem cliente no carrinho, a linha pede 'Cadastrar' (abre o
# cadastro de cliente de hoje e já liga ao carrinho); com cliente, vira 'para ‹nome› · 10% na volta · Usar'. Dados de teste: 0 clientes.
# Dono 22:09: UM desconto por venda (3ª peça · Leve 2 · código do cliente saem da mesma folga); usar um apaga os outros ('já tem um
# desconto nesta venda'; tocar de novo desfaz); o Cartão Próxima compra vai JUNTO (não gasta a folga de hoje). Na volta, o cartão É o
# desconto da venda; o Titan confere peça por peça (a que furar o mínimo fica sem); se outro for melhor, mostra os dois e o dono escolhe;
# o cartão não usado continua valendo. C = o cliente trouxe o cartão (ilustração, folga 15% com dólar favorável).
# A = dados reais de hoje (folga 0: o desconto da 3ª não sai; o resto sai). B = ILUSTRAÇÃO com o preço no degrau (G$ 120.000, esboço 77).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,mede as M
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
REL=[]
BLOCO=r"""(o)=>{const R=(t,s,a,mut)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500'+(mut?';color:var(--mute)':'')+'">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small></span>'+(a?'<button type="button" class="lkTx on">'+a+'</button>':'')+'</div>';
 const sg=document.querySelector('.c54Sg');
 sg.outerHTML='<div class="c54Sg" style="display:block"><div class="lbl">'+(o.lbl||'O Semp sugere · um por venda')+'</div>'+o.linhas.map(l=>R(l[0],l[1],l[2],l[3])).join('')+
  (o.sem_codigo?'':'<div style="display:flex;align-items:center;gap:16px;min-height:56px"><span style="flex:1;color:var(--mute);font-size:15px">Código do cliente</span><span style="color:var(--mute);font-size:15px">digitar</span><button type="button" class="lkTx on">Usar</button></div>')+'</div>';
 const t=document.querySelector('.c54Tt');if(o.total){t.querySelector('b').textContent=o.total;const d=document.createElement('div');d.style.cssText='text-align:center;font-size:13px;color:var(--mute);text-decoration:line-through';d.textContent=o.de;t.after(d);t.__d=d}const s=document.createElement('div');s.style.cssText='text-align:center;font-size:13px;color:var(--mute);margin-top:4px';s.textContent=o.costuma;(t.__d||t).after(s);}"""
A={'linhas':[['Leve 2: + Leitura de acetato unissex','por G$ 17.000 · de G$ 25.000','Usar',0],['Cartão Próxima compra','10% na volta · só com o cliente cadastrado','Cadastrar',0],['3ª peça com desconto','não hoje · o preço já está abaixo do mínimo','',1]],'costuma':'o Titan ainda aprende quanto desconto fecha a venda'}
B={'linhas':[['3ª peça com 45%','− G$ 54.000 · usando · cabe na folga do Titan','Desfazer',0],['Leve 2: + Leitura de acetato unissex','já tem um desconto nesta venda','',1],['Cartão Próxima compra','10% na volta · só com o cliente cadastrado','Cadastrar',0]],'costuma':'Solares costumam fechar com 10%','total':'G$ 306.000','de':'de G$ 360.000'}
C={'linhas':[['Cartão do cliente · 10%','− G$ 36.000 nas 3 peças','Usar',0],['3ª peça com 45%','− G$ 54.000 · só a última','Usar',0],['Leve 2: + Leitura de acetato unissex','por G$ 17.000 · de G$ 25.000','Usar',0]],'costuma':'Solares costumam fechar com 10%','lbl':'O cliente trouxe o cartão · escolha um','sem_codigo':1}
def tela(pw,esc,o,preco=None,n=''):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(700)
  pg.evaluate("""p=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];S.cart=[{it:it,qty:3,id:'c1'}];if(p)S.cart[0].preco=p;S.cartOpen=true;S.cartStep='ped';window.__LF.render()}""",preco);w(1000)
  if o: pg.evaluate(BLOCO,o);w(500)
  if preco: pg.evaluate("()=>{[...document.querySelectorAll('small,span,div')].filter(e=>e.children.length==0&&/^de G\\$ 180\\.000$/.test(e.textContent.trim())).forEach(e=>e.remove())}");w(300)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  a,_=M.percorre(pg,None);REL.append((n,[(k[0],v['d'][:60]) for k,v in a.items()]))
  pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}");w(300)
  pg.screenshot(path='/tmp/c.png',full_page=True);b.close();im=Image.open('/tmp/c.png').convert('RGB');return im.crop((0,0,im.width,min(im.height,2050)))
def quadro(arq,q,esc):
  F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',30);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',22)
  H=max(i.height for _,_,i in q);W=q[0][2].width
  o=Image.new('RGB',(len(q)*(W+30)+30,H+130),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o)
  for k,(t,s,im) in enumerate(q):
    x=30+k*(W+30);d.text((x,22),t,font=F,fill=(141,58,105) if k else (150,150,150));d.text((x,66),s,font=F2,fill=(150,140,145));o.paste(im,(x,110))
  o.save(arq,quality=86);print('ok',arq)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_78_cupons_no_caixa_%s.jpg'%n,[('HOJE · Carrinho',n,tela(pw,esc,None,None,'hoje '+n)),('PROPOSTA A · dados de hoje',n+' · folga 0: a 3ª não sai',tela(pw,esc,A,None,'A '+n)),('PROPOSTA B · ilustração · usando um',n+' · degrau G$ 120.000 · folga 15%',tela(pw,esc,B,360000,'B '+n)),('PROPOSTA C · ilustração · o cliente volta',n+' · cartão × os outros: escolha um',tela(pw,esc,C,360000,'C '+n))],esc)
for n,f in REL: print(n,f)
