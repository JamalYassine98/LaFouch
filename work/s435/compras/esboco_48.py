# Esboço 48 parte 1 (S435, 21/11 12:20) — direção aprovada 12:12: Peças = Inventário · Estúdio · Compras.
# Inventário só produtos (sem abas) · Compras = Lista de compras (um lugar só, sai do Giro) + Fornecedores (cada um vira lugar ›, parte 2).
# Base: app real + aprovados (37 ícones cinza, 45 "A completar", 67/68 Lista limpa, 102c, 134b, 149s).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/compras/'
CINZA="#v-grp .nvL svg,#v-grp .nvL i svg{color:var(--mute)!important;stroke:var(--mute)!important}#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}"
def shot(pg,n):
  f='/tmp/e48_%s.png'%n;pg.screenshot(path=f);x=Image.open(f);x.load();return x.copy()
def pecas(pw,prop):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500)
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(900);pg.add_style_tag(content=CINZA)
  if prop: pg.evaluate(r"""()=>{const f=()=>{const v=document.getElementById('v-grp');const L=[...v.querySelectorAll('.nvL')];if(!L.length||v.querySelector('.c48'))return;const e=L[L.length-1];const n=e.cloneNode(true);n.classList.add('c48');
     n.querySelector('b').textContent='Compras';n.querySelector('small').textContent='Lista de compras e fornecedores';
     const s=n.querySelector('svg');if(s)s.innerHTML='<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>';e.after(n);
     [...v.querySelectorAll('*')].filter(x=>x.children.length==0&&/Inventário e estúdio/.test(x.textContent)).forEach(x=>x.textContent='Inventário, estúdio e compras');
     const i=L[0].querySelector('small');if(i)i.textContent='Cadastro, estoque e preço de cada peça'};f();new MutationObserver(f).observe(document.getElementById('v-grp'),{childList:true,subtree:true})}""");w(500)
  x=shot(pg,'p%d'%prop);b.close();return x
def inventario(pw,prop):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(600);pg.add_style_tag(content='#nvBar{display:none!important}')
  if prop:
    I=pg.evaluate("()=>[...document.querySelectorAll('.pcard img')].map(i=>i.src).filter(s=>/^data:image\\/svg/.test(s)).slice(0,6)")
    pg.evaluate(r"""(I)=>{const v=document.getElementById('v-estoque');const t=document.getElementById('eTabs');t.style.setProperty('display','none','important');
     const ST='display:flex;align-items:center;gap:16px;width:100%;min-height:80px;background:none;border:0;border-bottom:1px solid var(--line2);color:var(--fg);font:inherit;text-align:left;padding:12px 0';
     const ROW=(img,a,s)=>'<button type="button" style="'+ST+'"><span style="flex:0 0 64px;height:48px;border-radius:10px;overflow:hidden;background:#fff"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain"></span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">'+a+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span><i style="font-style:normal;font-size:20px;color:var(--mute)">›</i></button>';
     const d=document.createElement('section');d.innerHTML='<div class="lbl" style="margin:16px 0 0">A completar · 2</div><section style="display:flex;flex-direction:column">'+ROW(I[1],'TS1234 · 4 cores','tratada · falta custo, preço e material')+ROW(I[3],'SL2250 · 3 cores','tratada · falta custo e preço')+'</section>';
     t.after(d);
     // a linha "Lotes pendentes" dos números sai junto com a aba (a compra sem detalhe é avisada em Compras)
     [...document.querySelectorAll('#kpisE .kpi')].filter(k=>/Lotes pendentes/.test(k.textContent)).forEach(k=>k.remove())}""",I);w(400)
  x=shot(pg,'i%d'%prop);b.close();return x
def giro(pw,prop,y=0):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500)
  pg.evaluate("()=>__LF.inicioGo('repo')");w(1500);pg.add_style_tag(content='#nvBar{display:none!important}')
  if prop: pg.evaluate(r"""()=>{const s=[...document.querySelectorAll('#dtabBody .fxF')].find(x=>/Lista de compras/.test(x.textContent));s.classList.remove('on');const h=s.querySelector('.fxH');s.querySelector('.fxB').remove();
     h.querySelector('b,span b')&&0;[...h.querySelectorAll('*')].filter(x=>x.children.length==0).forEach(x=>{if(/vão acabar/.test(x.textContent))x.textContent='17 para comprar';if(x.textContent.trim()=='⌄')x.textContent='›'});
     const ch=[...h.querySelectorAll('*')].find(x=>/[⌄›]/.test(x.textContent)&&x.children.length==0);if(ch){ch.textContent='›';ch.style.transform='none'}h.querySelectorAll('svg').forEach(v=>v.style.transform='rotate(-90deg)')}""");w(400)
  else: pg.evaluate("()=>{const s=[...document.querySelectorAll('#dtabBody .fxF')].find(x=>/Lista de compras/.test(x.textContent));s.classList.remove('on');s.querySelector('.fxB').style.display='none'}");w(400)
  x=shot(pg,'g%d'%prop);b.close();return x
def compras(pw,y):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500)
  pg.evaluate("()=>__LF.inicioGo('repo')");w(1500);pg.add_style_tag(content='#nvBar{display:none!important}')
  pg.evaluate(r"""()=>{const v=document.getElementById('v-dash');v.querySelector('.nvVs').lastChild.textContent='Peças';v.querySelector('.dHdT').textContent='Compras';v.querySelector('.dHdS').textContent='O que comprar e de quem';
   const B=document.getElementById('dtabBody');const s=[...B.querySelectorAll('.fxF')].find(x=>/Lista de compras/.test(x.textContent));const corpo=s.querySelector('.fxB');
   B.innerHTML='';corpo.style.cssText='display:block;padding:8px 0 0';B.appendChild(corpo);
   const ST='display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-bottom:1px solid var(--line2);color:var(--fg);font:inherit;text-align:left;padding:12px 0';
   const f=document.createElement('section');f.innerHTML='<div class="lbl" style="margin:32px 0 0">Fornecedores · 1</div><button type="button" style="'+ST+'"><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">Kazwini</b><small style="font-size:13px;color:var(--mute)">1 compra · US$ 200 · <span style="color:var(--warn,#e0b44c)">343 peças sem detalhe</span></small></span><i style="font-style:normal;font-size:20px;color:var(--mute)">›</i></button>'+
   '<div style="color:var(--mute);font-size:13px;margin:16px 0 32px">Investido em novembro: US$ 0</div>';B.appendChild(f)}""");w(500)
  h=pg.evaluate("()=>{let best=document.scrollingElement;for(const e of document.querySelectorAll('*')){const cs=getComputedStyle(e);if(/(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+20&&e.getBoundingClientRect().height>300&&e.scrollHeight>best.scrollHeight-1)best=e}window.__sc=best;return best.scrollHeight}")
  yy=y if y>=0 else h
  pg.evaluate(f"window.__sc.scrollTop={yy};window.scrollTo(0,{yy})");w(400)
  x=shot(pg,'c%d'%y);b.close();return x
def quadro(arq,q):
  g=40;w=max(i.width for _,_,i in q);h=max(i.height for _,_,i in q);S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+im.width,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_48a_pecas.jpg',[('HOJE · Peças','Inventário · Estúdio',pecas(pw,0)),('PROPOSTA · Peças','+ Compras (lista e fornecedores)',pecas(pw,1))])
  quadro('esboco_48b_inventario.jpg',[('HOJE · Inventário','abas Produtos · Fornecedores',inventario(pw,0)),('PROPOSTA · Inventário','só produtos · sem abas · "A completar" (45)',inventario(pw,1))])
  quadro('esboco_48c_compras.jpg',[('PROPOSTA · Compras (topo)','a Lista de compras mora aqui',compras(pw,0)),('PROPOSTA · Compras (fim)','Fornecedores › (tela de cada um: parte 2)',compras(pw,-1))])
  quadro('esboco_48d_giro.jpg',[('HOJE · Giro','a lista inteira dentro do Giro',giro(pw,0)),('PROPOSTA · Giro','uma linha › que leva a Compras',giro(pw,1))])
def inventario2(pw,aba):
  # 48b v2 (dono 12:19: "muito poluído"): "A completar" vira a 2ª aba (estado da mesma lista de produtos), no lugar de Fornecedores
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(600);pg.add_style_tag(content='#nvBar{display:none!important}')
  I=pg.evaluate("()=>[...document.querySelectorAll('.pcard img')].map(i=>i.src).filter(s=>/^data:image\\/svg/.test(s)).slice(0,6)")
  pg.evaluate(r"""(a)=>{const [I,aba]=a;const L=document.getElementById('eTabL');L.innerHTML='A completar<em class="bdg">2</em>';
   [...document.querySelectorAll('#kpisE .kpi')].filter(k=>/Lotes pendentes/.test(k.textContent)).forEach(k=>k.remove());
   if(aba){const P=document.getElementById('eTabP');P.classList.remove('on');P.setAttribute('aria-pressed','false');L.classList.add('on');L.setAttribute('aria-pressed','true');const ln=document.querySelector('#eTabs .lfLinha');const r=L.getBoundingClientRect(),r0=document.getElementById('eTabs').getBoundingClientRect();ln.style.left=(r.left-r0.left)+'px';ln.style.width=r.width+'px';ln.style.transform='none';const pl=document.querySelector('#eTabs .lfPill');if(pl){pl.style.left=(r.left-r0.left)+'px';pl.style.width=r.width+'px';pl.style.transform='none'}
    const v=document.getElementById('v-estoque');const t=document.getElementById('eTabs');let n=t.nextElementSibling;while(n){const x=n.nextElementSibling;n.style.setProperty('display','none','important');n=x}
    const ST='display:flex;align-items:center;gap:16px;width:100%;min-height:80px;background:none;border:0;border-bottom:1px solid var(--line2);color:var(--fg);font:inherit;text-align:left;padding:12px 0';
    const ROW=(img,a,s)=>'<button type="button" style="'+ST+'"><span style="flex:0 0 64px;height:48px;border-radius:10px;overflow:hidden;background:#fff"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain"></span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">'+a+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span><i style="font-style:normal;font-size:20px;color:var(--mute)">›</i></button>';
    const d=document.createElement('section');d.innerHTML='<div style="color:var(--mute);font-size:14px;margin:8px 0 8px">Peças já tratadas no Estúdio. Falta o preço e os detalhes para irem à venda.</div>'+ROW(I[1],'TS1234 · 4 cores','tratada · falta custo, preço e material')+ROW(I[3],'SL2250 · 3 cores','tratada · falta custo e preço');t.after(d)}}""",[I,aba]);w(400)
  x=shot(pg,'i2%d'%aba);b.close();return x
def inventario3(pw,jan):
  # 48b v3 (dono 12:23: existem estojos, flanelas e líquidos; não gosta da aba): sem abas · o "+" leva o selo das peças a completar
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(600);pg.add_style_tag(content='#nvBar{display:none!important}')
  pg.evaluate(r"""()=>{document.getElementById('eTabs').style.setProperty('display','none','important');[...document.querySelectorAll('#kpisE .kpi')].filter(k=>/Lotes pendentes/.test(k.textContent)).forEach(k=>k.remove());
   const p=document.querySelector('button[aria-label="Adicionar"]');p.style.position='relative';p.insertAdjacentHTML('beforeend','<i style="position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center;padding:0 5px">2</i>')}""");w(300)
  if jan:
    pg.evaluate(r"""()=>{const IC={c:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 9"/>',m:'<path d="M1 7h13v9H1zM14 10h4l3 3v3h-7"/><circle cx="5" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',a:'<rect x="3" y="8" width="18" height="9" rx="4.5"/><path d="M7 8V6h10v2"/>'};
     const ROW=(ic,t,s,n)=>'<button type="button" style="display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-bottom:1px solid var(--line2);padding:8px 0;color:var(--fg);font:inherit;text-align:left"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+IC[ic]+'</svg><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span>'+(n?'<i style="min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center;padding:0 5px">'+n+'</i>':'')+'<i style="font-style:normal;font-size:20px;color:var(--mute)">›</i></button>';
     const bk=document.createElement('div');bk.className='ljBk';bk.style.opacity='.5';const j=document.createElement('div');j.className='ljJn';j.style.transform='none';
     j.innerHTML='<div class="ljPuxa"></div><div class="ljHd"><b>Adicionar</b></div><div class="ljCorpo">'+ROW('c','Completar peça do Estúdio','2 peças tratadas esperando preço e detalhes',2)+ROW('m','Chegou mercadoria','compra de fornecedor · quantidade e custo')+ROW('a','Acessório','estojo, flanela, líquido de limpeza')+'</div>';document.body.appendChild(bk);document.body.appendChild(j)}""");w(500)
  x=shot(pg,'i3%d'%jan);b.close();return x
