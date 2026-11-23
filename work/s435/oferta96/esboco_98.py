# Esboço 98 (S435, 23/11 10:00) — CARRINHO MAIS SIMPLES (dono 09:51): em vez de listar cada cupom ('Cupom fiel 10%'…), UMA linha 'Cupom · Usar'
# que abre a janela com os CARTÕES da cliente, como no site (Minha conta › Cartões: tocar no cartão usa); o bloco 'O Semp sugere' com 4 coisas
# estava poluído → no máximo UMA linha: sem cliente 'Cliente · escolher ›'; com cliente 'Ana Benítez · 2 cupons · Usar cupom ›'; usando:
# 'Cupom fiel · − G$ 5.000 · Desfazer'. O presente da data vira o aviso que fica (85: linha com bolinha). Sai o rótulo do bloco.
# Base: 96 v5 + 97 + componente real .cupCard (www/style.css) sem o código. ILUSTRAÇÃO: SL2201 em oferta + 2 × SP57765 (G$ 25.000).
exec(open('/home/claude/lafouch/work/s435/oferta96/esboco_96.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0])
UMA=r"""(o)=>{const sg=document.querySelector('.c54Sg');if(!sg)return;
 const R='<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2);border-top:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+o.t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+o.s+'</small></span><button type="button" class="lkTx on">'+o.a+'</button></div>';
 const P=o.pres?'<div style="display:flex;align-items:center;gap:12px;min-height:56px;border-bottom:1px solid var(--line2)"><i style="flex:none;width:8px;height:8px;border-radius:50%;background:var(--accent)"></i><span style="flex:1;min-width:0;font-size:15px">Presente de Natal na sacola<small style="display:block;font-size:13px;color:var(--mute)">estojo, flanela e líquido</small></span></div>':'';
 sg.outerHTML='<div class="c54Sg" style="display:block;margin-top:8px">'+R+P+'</div>';
 if(o.total){const t=document.querySelector('.c54Tt');t.querySelector('b').textContent=o.total;[...document.querySelectorAll('div')].filter(d=>d.style.textDecoration=='line-through').forEach(d=>d.remove());const d=document.createElement('div');d.style.cssText='text-align:center;font-size:13px;color:var(--mute);text-decoration:line-through';d.textContent=o.de;t.after(d)}}"""
CARDS=r"""()=>{const C=(t,s,ate)=>'<button type="button" class="cupCard" style="width:100%;border:0;text-align:left;margin-bottom:16px;font:inherit;cursor:pointer"><small>LA FOUCH</small><b>'+t+'</b><span style="display:flex;justify-content:space-between;align-items:center"><i>'+s+' · até '+ate+'</i><span style="font-weight:600;font-size:15px">Usar ›</span></span></button>';
 return '<div style="font-size:14px;color:var(--mute);margin:-4px 0 16px">Ana Benítez · só nas peças sem oferta</div>'+C('10% · Cupom fiel','ganhou na 3ª compra','31/12')+C('10% · Cupom de Natal','presente da data','25/12')}"""
def tela98(pw,esc,caso):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(700)
  pg.evaluate("""()=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];const l=S.items.find(i=>i.ref=='SP57765');S.cart=[{it:it,qty:1,id:'c1'},{it:l,qty:2,id:'c2'}];S.cartOpen=true;S.cartStep='ped';window.__LF.render()}""");w(1000)
  pg.evaluate(BLOCO,{'linhas':[['x','x','',0]],'costuma':'','sem_codigo':1});w(200)
  pg.evaluate(r"""()=>{const sw=(re,t)=>[...document.querySelectorAll('b,span,small,div')].filter(e=>e.children.length==0&&re.test(e.textContent.trim())).forEach(e=>e.textContent=t);sw(/^G\$ 60\.000$/,'G$ 54.000')}""")
  tot=pg.evaluate("()=>{const t=document.querySelector('.c54Tt b');return t?t.textContent:''}");v=int(tot.replace('G$','').replace('.','').strip())-6000;nt='G$ '+format(v,',').replace(',','.')
  pg.evaluate(OF,{'total':nt,'de':'de '+tot});w(200)
  O2={'sem':{'t':'Cliente','s':'para cupons e cartão da volta','a':'escolher ›'},'ana':{'t':'Ana Benítez','s':'2 cupons · só nas peças sem oferta','a':'Usar cupom ›'},
      'jan':{'t':'Ana Benítez','s':'2 cupons · só nas peças sem oferta','a':'Usar cupom ›'},
      'usando':{'t':'Cupom fiel · − G$ 5.000','s':'10% nos 2 SP57765','a':'Desfazer','total':'G$ %s'%format(v-5000,',').replace(',','.'),'de':'de '+tot},
      'natal':{'t':'Ana Benítez','s':'2 cupons · só nas peças sem oferta','a':'Usar cupom ›','pres':1}}[caso]
  pg.evaluate(UMA,O2);w(300);A2.aplica(pg);w(300)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  if caso=='jan':
    pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
    pg.evaluate("h=>{const j=[...document.querySelectorAll('.ljJn')].pop();const t=j.querySelector('.ljHd b');if(t)t.textContent='Cupons';(j.querySelector('.ljCorpo')||j).innerHTML=h}",pg.evaluate(CARDS));w(600)
    a,_=M.percorre(pg,None);REL.append((caso,[(k[0],v_['d'][:60]) for k,v_ in a.items()]))
    pg.screenshot(path='/tmp/c98.png');b.close();im=Image.open('/tmp/c98.png').convert('RGB');return im
  a,_=M.percorre(pg,None);REL.append((caso,[(k[0],v_['d'][:60]) for k,v_ in a.items()]))
  pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}");w(300)
  pg.screenshot(path='/tmp/c98.png',full_page=True);b.close();im=Image.open('/tmp/c98.png').convert('RGB');return im.crop((0,0,im.width,min(im.height,1700)))
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    q=[('PROPOSTA · sem cliente',n+' · uma linha só',tela98(pw,esc,'sem')),('PROPOSTA · Ana escolhida',n+' · "Usar cupom ›"',tela98(pw,esc,'ana')),('PROPOSTA · janela Cupons',n+' · os cartões dela, como no site · tocar usa',tela98(pw,esc,'jan')),
       ('PROPOSTA · usando',n+' · a linha mostra o cupom · Desfazer',tela98(pw,esc,'usando')),('PROPOSTA · no Natal',n+' · o presente vira um aviso',tela98(pw,esc,'natal'))]
    H_=max(i.height for _,_,i in q);q=[(a,b_,i if i.height==H_ else i) for a,b_,i in q]
    quadro(O+'esboco_98_carrinho_simples_%s.jpg'%n,q,esc)
for n,f in REL: print(n,f)
