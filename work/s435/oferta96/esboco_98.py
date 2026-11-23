# Esboço 98 (S435, 23/11 10:00) — CARRINHO MAIS SIMPLES (dono 09:51): em vez de listar cada cupom ('Cupom fiel 10%'…), UMA linha 'Cupom · Usar'
# que abre a janela com os CARTÕES da cliente, como no site (Minha conta › Cartões: tocar no cartão usa); o bloco 'O Semp sugere' com 4 coisas
# estava poluído → no máximo UMA linha: sem cliente 'Cliente · escolher ›'; com cliente 'Ana Benítez · 2 cupons · Usar cupom ›'; usando:
# 'Cupom fiel · − G$ 5.000 · Desfazer'. O presente da data vira o aviso que fica (85: linha com bolinha). Sai o rótulo do bloco.
# v3 (dono 10:02–10:06): todo desconto, inclusive a 3ª peça, só com cliente cadastrado ('a ideia é dar o desconto com o cadastro'); cupom e 3ª peça DENTRO da mesma janela — no Carrinho só a linha 'Desconto ›'; a janela tem o cliente em cima,
# 'Desta venda' (3ª peça, quando leva 3+) e 'Da conta da Ana' (os cartões). v2 (dono 09:57 'opções de desconto demais?'): só DOIS tipos — OFERTA (no preço, loja e site) e CUPOM (na conta); exceção aprovada 21/11:
# ÚLTIMA PEÇA quando leva 3 ou mais ('3ª peça com X%', o Titan calcula). Sai o Leve 2 do balcão (como no site). Linha 'Cupom ›'.
# Base: 96 v5 + 97 + componente real .cupCard (www/style.css) sem o código. ILUSTRAÇÃO: SL2201 em oferta + 2 × SP57765 (G$ 25.000).
exec(open('/home/claude/lafouch/work/s435/oferta96/esboco_96.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0])
UMA=r"""(o)=>{const sg=document.querySelector('.c54Sg');if(!sg)return;const RR=(t,s_,a,top)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2);'+(top?'border-top:1px solid var(--line2)':'')+'"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s_+'</small></span><button type="button" class="lkTx on">'+a+'</button></div>';
 const R=RR(o.t,o.s,o.a,1)+(o.t2?RR(o.t2,o.s2,o.a2,0):'');
 const P=o.pres?'<div style="display:flex;align-items:center;gap:12px;min-height:56px;border-bottom:1px solid var(--line2)"><i style="flex:none;width:8px;height:8px;border-radius:50%;background:var(--accent)"></i><span style="flex:1;min-width:0;font-size:15px">Presente de Natal na sacola<small style="display:block;font-size:13px;color:var(--mute)">estojo, flanela e líquido</small></span></div>':'';
 sg.outerHTML='<div class="c54Sg" style="display:block;margin-top:8px">'+R+P+'</div>';
 if(o.total){const t=document.querySelector('.c54Tt');t.querySelector('b').textContent=o.total;[...document.querySelectorAll('div')].filter(d=>d.style.textDecoration=='line-through').forEach(d=>d.remove());const d=document.createElement('div');d.style.cssText='text-align:center;font-size:13px;color:var(--mute);text-decoration:line-through';d.textContent=o.de;t.after(d)}}"""
CARDS=r"""()=>{const V=(t,s)=>'<button type="button" style="display:grid;gap:4px;width:100%;padding:16px 18px;border-radius:16px;border:1px solid var(--line);background:none;color:var(--fg);text-align:left;margin-bottom:16px;font:inherit"><b style="font:700 20px Georgia,serif">'+t+'</b><span style="display:flex;justify-content:space-between;align-items:center"><i style="font-style:normal;font-size:12px;color:var(--mute)">'+s+'</i><span style="font-weight:600;font-size:15px;color:var(--accent-fg)">Usar ›</span></span></button>';
 const LB=t=>'<div class="lbl" style="margin:16px 0 8px">'+t+'</div>';
 const CL='<div style="display:flex;align-items:center;gap:16px;min-height:56px;border-bottom:1px solid var(--line2);margin-bottom:8px"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Ana Benítez</b></span><button type="button" class="lkTx on">trocar ›</button></div>';const C=(t,s,ate)=>'<button type="button" class="cupCard" style="width:100%;border:0;text-align:left;margin-bottom:16px;font:inherit;cursor:pointer"><small>LA FOUCH</small><b>'+t+'</b><span style="display:flex;justify-content:space-between;align-items:center"><i>'+s+' · até '+ate+'</i><span style="font-weight:600;font-size:15px">Usar ›</span></span></button>';
 return CL+LB('Desta venda')+V('20% · 3ª peça','− G$ 5.000 · o Titan conferiu')+LB('Da conta da Ana')+C('10% · Cupom fiel','ganhou na 3ª compra','31/12')+C('10% · Cupom de Natal','presente da data','25/12')}"""
def tela98(pw,esc,caso):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(700)
  pg.evaluate("""c=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];const l=S.items.find(i=>i.ref=='SP57765');S.cart=(c=='tres'||c=='sem'||c=='jan'||c=='usando')?[{it:l,qty:3,id:'c2'}]:[{it:it,qty:1,id:'c1'},{it:l,qty:2,id:'c2'}];S.cartOpen=true;S.cartStep='ped';window.__LF.render()}""",caso);w(1000)
  pg.evaluate(BLOCO,{'linhas':[['x','x','',0]],'costuma':'','sem_codigo':1});w(200)
  pg.evaluate(r"""()=>{const sw=(re,t)=>[...document.querySelectorAll('b,span,small,div')].filter(e=>e.children.length==0&&re.test(e.textContent.trim())).forEach(e=>e.textContent=t);sw(/^G\$ 60\.000$/,'G$ 54.000')}""")
  tot=pg.evaluate("()=>{const t=document.querySelector('.c54Tt b');return t?t.textContent:''}");v=int(tot.replace('G$','').replace('.','').strip())-(0 if caso in ('tres','sem','jan','usando') else 6000);nt='G$ '+format(v,',').replace(',','.')
  if caso not in ('tres','sem','jan','usando'):pg.evaluate(OF,{'total':nt,'de':'de '+tot});w(200)
  O2={'sem':{'t':'Desconto','s':'cadastre ou escolha o cliente','a':'escolher ›'},'ana':{'t':'Cupom','s':'Ana Benítez · 2 cartões','a':'Usar ›'},
      'jan':{'t':'Desconto','s':'Ana Benítez · 3 opções','a':'escolher ›'},
      'tres':{'t':'Cupom','s':'Ana Benítez · 2 cartões','a':'Usar ›','t2':'3ª peça com 20%','s2':'− G$ 5.000 · o Titan conferiu','a2':'Usar'},
      'usando':{'t':'3ª peça com 20% · − G$ 5.000','s':'desconto desta venda','a':'Desfazer','total':'G$ %s'%format(v-5000,',').replace(',','.'),'de':'de '+tot},
      'natal':{'t':'Desconto','s':'Ana Benítez · 2 cartões','a':'escolher ›','pres':1}}[caso]
  pg.evaluate(UMA,O2);w(300);A2.aplica(pg);w(300)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  if caso=='jan':
    vs=pg.viewport_size;pg.set_viewport_size({'width':vs['width'],'height':vs['height']+200});w(300)
    pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
    pg.evaluate("h=>{const j=[...document.querySelectorAll('.ljJn')].pop();const t=j.querySelector('.ljHd b');if(t)t.textContent='Desconto';(j.querySelector('.ljCorpo')||j).innerHTML=h}",pg.evaluate(CARDS));w(600)
    a,_=M.percorre(pg,None);REL.append((caso,[(k[0],v_['d'][:60]) for k,v_ in a.items()]))
    pg.screenshot(path='/tmp/c98.png');b.close();im=Image.open('/tmp/c98.png').convert('RGB');return im
  a,_=M.percorre(pg,None);REL.append((caso,[(k[0],v_['d'][:60]) for k,v_ in a.items()]))
  pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}");w(300)
  pg.screenshot(path='/tmp/c98.png',full_page=True);b.close();im=Image.open('/tmp/c98.png').convert('RGB');return im.crop((0,0,im.width,min(im.height,1700)))
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    q=[('PROPOSTA · 3 peças, sem cliente',n+' · uma linha: Desconto',tela98(pw,esc,'sem')),('PROPOSTA · janela Desconto',n+' · desta venda + da conta da Ana',tela98(pw,esc,'jan')),
       ('PROPOSTA · usando',n+' · a linha mostra o escolhido · Desfazer',tela98(pw,esc,'usando')),('PROPOSTA · no Natal',n+' · peça em oferta + presente da data',tela98(pw,esc,'natal'))]
    H_=max(i.height for _,_,i in q);q=[(a,b_,i if i.height==H_ else i) for a,b_,i in q]
    quadro(O+'esboco_98_carrinho_simples_v3_%s.jpg'%n,q,esc)
for n,f in REL: print(n,f)
