# 99a (S435, 23/11 10:30) — o 98 v4 com CUPONS REALISTAS, para comparar (dono 10:19). Preço no degrau da escada (77: Solares G$ 120.000),
# 3 peças = G$ 360.000. Dono 10:19: 'calcular de forma que os preços não precisem ser arredondados' → degraus em múltiplos de G$ 10.000:
# 10% e 20% dão sempre milhares exatos (10% de 360.000 = 36.000; 20% de 120.000 = 24.000). O Titan recomenda o maior: os dois cupons de 10%
# dão − G$ 36.000 (empate → o de Natal, que vence antes) > 3ª peça − G$ 24.000.
exec(open('/home/claude/lafouch/work/s435/oferta96/esboco_98.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0])
O='/home/claude/lafouch/work/s435/lote99/'
CARDS=CARDS.replace("'− G$ 5.000 · o Titan conferiu'","'− G$ 24.000 · o Titan conferiu'").replace("C('10% · Cupom de Natal','− G$ 8.000','25/12',1)+C('10% · Cupom fiel','− G$ 8.000','31/12')","C('10% · Cupom de Natal','− G$ 36.000','25/12',1)+C('10% · Cupom fiel','− G$ 36.000','31/12')")
def tela99(pw,esc,caso):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(700)
  pg.evaluate("""()=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];S.cart=[{it:it,qty:3,id:'c1',preco:360000}];S.cartOpen=true;S.cartStep='ped';window.__LF.render()}""");w(1000)
  pg.evaluate(BLOCO,{'linhas':[['x','x','',0]],'costuma':'','sem_codigo':1});w(200)
  pg.evaluate(r"""()=>{[...document.querySelectorAll('b,span,small,div')].filter(e=>e.children.length==0&&/^de G\$ 180\.000$/.test(e.textContent.trim())).forEach(e=>e.remove());[...document.querySelectorAll('div')].filter(d=>d.style.textDecoration=='line-through').forEach(d=>d.remove())}""")
  o={'jan':{'t':'Desconto','s':'Ana Benítez · 3 opções','a':'escolher ›'},'usando':{'t':'Cupom de Natal · − G$ 36.000','s':'10% nas 3 peças','a':'Desfazer','total':'G$ 324.000','de':'de G$ 360.000'}}[caso]
  pg.evaluate(UMA,o);w(300);A2.aplica(pg);w(300)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  if caso=='jan':
    vs=pg.viewport_size;pg.set_viewport_size({'width':vs['width'],'height':vs['height']+200});w(300)
    pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
    pg.evaluate("h=>{const j=[...document.querySelectorAll('.ljJn')].pop();const t=j.querySelector('.ljHd b');if(t)t.textContent='Desconto';(j.querySelector('.ljCorpo')||j).innerHTML=h}",pg.evaluate(CARDS));w(600)
    a,_=M.percorre(pg,None);REL.append((caso,[(k[0],v_['d'][:60]) for k,v_ in a.items()]))
    pg.screenshot(path='/tmp/c99.png');b.close();return Image.open('/tmp/c99.png').convert('RGB')
  a,_=M.percorre(pg,None);REL.append((caso,[(k[0],v_['d'][:60]) for k,v_ in a.items()]))
  pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}");w(300)
  pg.screenshot(path='/tmp/c99.png',full_page=True);b.close();im=Image.open('/tmp/c99.png').convert('RGB');return im.crop((0,0,im.width,min(im.height,1700)))
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro(O+'esboco_99a_cupons_realistas_%s.jpg'%n,[('REALISTA · janela Desconto',n+' · degrau G$ 120.000 × 3',tela99(pw,esc,'jan')),('REALISTA · usando',n+' · o recomendado: − G$ 36.000',tela99(pw,esc,'usando'))],esc)
for n,f in REL: print(n,f)
