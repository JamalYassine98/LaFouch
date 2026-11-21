# Esboço 49 (S435, 21/11 12:45) — "o pendente vira selo no botão que resolve; a fila vira lugar ›" (dono 12:28: esboço de todos)
# 49a Atacado sem abas · 49b Modelos (painel do Site) com 2 abas + "Precisa de atenção" · 49c Inventário sem "preços para corrigir" (selo em Preços)
# Esboço 50: Giro (problemas do print do dono 12:26). Base: app real + aprovados (37 ícones cinza, 48 Compras, 67/68, 99/100, 149s).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/selo/'
H=r"""const SEL=n=>'<i style="display:inline-block;min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center;padding:0 5px;flex:none">'+n+'</i>';
const SV=p=>'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex:none">'+p+'</svg>';
const ROW=(ic,t,s,dir,n,ch)=>'<button type="button" style="display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-bottom:1px solid var(--line2);padding:10px 0;color:var(--fg);font:inherit;text-align:left">'+(ic?SV(ic):'')+'<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">'+t+'</b>'+(s?'<small style="font-size:13px;color:var(--mute)">'+s+'</small>':'')+'</span>'+(dir||'')+(n?SEL(n):'')+'<i style="font-style:normal;font-size:20px;color:var(--mute);width:14px;text-align:center">'+(ch||'›')+'</i></button>';
const LBL=(t,d)=>'<div style="display:flex;justify-content:space-between;align-items:baseline;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:32px 0 4px"><span>'+t+'</span>'+(d?'<span>'+d+'</span>':'')+'</div>';
const VAZIO=(ic,f,e)=>'<div style="text-align:center;padding:32px 16px"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-fg)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+ic+'</svg><b style="display:block;font-size:16px;margin:12px 0 4px">'+f+'</b><div style="color:var(--mute);font-size:14px;line-height:1.45">'+e+'</div></div>';
const TOP=(vs,t,s,mais)=>'<button type="button" class="nvVs"><i aria-hidden="true">‹</i>'+vs+'</button><div style="display:flex;align-items:center;justify-content:space-between;gap:16px"><div><h1 style="margin:0;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:32px">'+t+'</h1>'+(s?'<div style="color:var(--mute);font-size:14px;margin-top:4px">'+s+'</div>':'')+'</div>'+(mais?'<button class="pl78" type="button" style="margin:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>':'')+'</div>';
const ABAS=(L,on)=>'<div style="display:flex;gap:24px;border-bottom:1px solid var(--line2);margin:24px 0 8px">'+L.map((t,i)=>'<span style="padding:10px 0;font-size:15px;'+(i==on?'color:var(--fg);border-bottom:2px solid var(--accent);font-weight:600':'color:var(--mute)')+'">'+t+'</span>').join('')+'</div>';
const IC={msg:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',lote:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',tab:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',pes:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',av:'<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17h.01"/>',env:'<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/>'};"""
def pagina(pg,html):
  pg.evaluate(r"""(h)=>{const v=document.getElementById('v-grp');const f=()=>{if(v.dataset.e49!=='1'){v.dataset.e49='1';v.innerHTML=h}};f();new MutationObserver(()=>{if(!v.querySelector('.e49'))v.dataset.e49='0',f()}).observe(v,{childList:true})}""",html)
def nova(pw):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}');return b,pg,w
def shot(pg,n):
  f='/tmp/e49_%s.png'%n;pg.screenshot(path=f);x=Image.open(f);x.load();return x.copy()
def corta(arq):
  x=Image.open(arq);return x.crop((0,0,780,1688)).resize((390,844))
def atacado(pw):
  b,pg,w=nova(pw)
  pagina(pg,'<div class="e49">'+pg.evaluate("()=>{"+H+r"""return TOP('Início','Atacado','Lojistas, lotes e pedidos em quantidade',1)+
   '<div style="height:24px"></div>'+ROW(IC.msg,'Mensagens de lojistas','pedidos e perguntas do site','',2)+
   LBL('Lojistas · 0')+VAZIO(IC.pes,'Nenhum lojista ainda','Cada lojista compra pelo link da conta dele, com a tabela e o mínimo do atacado.')+
   '<div style="border-top:1px solid var(--line2)">'+ROW(IC.lote,'Lotes','nenhum lote ainda')+ROW(IC.tab,'Tabela de atacado','margem, mínimo e frete · como o lojista vê')+ROW(IC.env,'Enviar catálogo a um lojista','PDF ou planilha')+'</div>'}""")+'</div>');w(500)
  x=shot(pg,'ata');b.close();return x
def modelos(pw,qual):
  b,pg,w=nova(pw)
  I=pg.evaluate("()=>{const S=__LF.S;const vis={};return S.items.filter(i=>i.ref&&!vis[i.ref]&&(vis[i.ref]=1)).slice(0,6).map(i=>[i.ref,i.nome||i.name||i.ref,(S.items.filter(x=>x.ref===i.ref).reduce((a,x)=>a+(+x.q||+x.qty||0),0))])}")
  html=pg.evaluate("([I,a])=>{"+H+r"""const SW=on=>'<span class="sw" style="pointer-events:none;flex:none"><input type="checkbox" '+(on?'checked':'')+' tabindex="-1"><i></i></span>';
   const M=(r,on,av)=>'<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2)"><span style="flex:0 0 56px;height:42px;border-radius:8px;background:#fff"></span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r[1]+'</b><small style="font-size:13px;color:var(--mute)">'+r[0]+' · '+r[2]+' un.'+(av?' · <span style="color:var(--warn,#e0b44c)">'+av+'</span>':'')+'</small></span>'+SW(on)+'</div>';
   if(a=='lista') return TOP('Site','Modelos','',0)+ROW(IC.av,'Precisa de atenção','3 sem foto · 2 esgotados','',5)+ABAS(['No ar · 16','Ocultos · 2'],0)+
     '<div style="display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--line);min-height:48px;margin:8px 0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span style="color:var(--mute);font-size:16px">Buscar por nome ou código</span></div>'+I.slice(0,5).map(r=>M(r,1,'')).join('');
   return TOP('Modelos','Precisa de atenção','5 modelos no ar com problema',0)+LBL('Sem foto · 3')+I.slice(0,3).map(r=>M(r,1,'sem foto')).join('')+LBL('Esgotados · 2')+I.slice(3,5).map(r=>M(r,1,'esgotado')).join('')+'<div style="color:var(--mute);font-size:13px;margin:16px 0">Esgotado continua no site com o aviso "Esgotado". Desligue para esconder.</div>'}""",[I,qual])
  pagina(pg,'<div class="e49">'+html+'</div>');w(500);x=shot(pg,'mod'+qual);b.close();return x
def inventario(pw,prop):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(600);pg.add_style_tag(content='#nvBar{display:none!important}')
  # base: 48b v3 aprovado-em-espera (sem abas, + com selo)
  pg.evaluate(r"""(p)=>{document.getElementById('eTabs').style.setProperty('display','none','important');[...document.querySelectorAll('#kpisE .kpi')].filter(k=>/Lotes pendentes/.test(k.textContent)).forEach(k=>k.remove());
   const b=document.querySelector('button[aria-label="Adicionar"]');b.style.position='relative';b.insertAdjacentHTML('beforeend','<i style="position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center;padding:0 5px">2</i>');
   if(p){const L=[...document.querySelectorAll('#v-estoque *')].filter(e=>e.children.length==0&&/preços para corrigir/.test(e.textContent));L.forEach(e=>{let x=e.closest('button,a')||e;const pv=x.previousSibling;x.remove();if(pv&&pv.nodeType==3)pv.textContent=pv.textContent.replace(/\s*·\s*$/,'')});
    [...document.querySelectorAll('#v-estoque *')].filter(e=>e.children.length==0&&/·\s*$/.test(e.textContent)&&/peças/.test(e.parentElement.textContent)).forEach(e=>e.textContent=e.textContent.replace(/\s*·\s*$/,''))}}""",prop);w(400)
  x=shot(pg,'inv%d'%prop);b.close();return x
def giroprecos(pw,prop):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500)
  pg.evaluate("()=>{__LF.S.nvP=['grp:g:gp'];__LF.S.nvG='g:gp';__LF.setView('grp')}");w(1200)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}#v-grp .nvL svg{stroke:var(--mute)!important;color:var(--mute)!important}')
  if prop: pg.evaluate(r"""()=>{const f=()=>{const v=document.getElementById('v-grp');const r=[...v.querySelectorAll('.nvL')].find(x=>/Preços/.test(x.querySelector('b')?x.querySelector('b').textContent:''));if(!r||r.querySelector('.s49'))return;const i=r.querySelector(':scope>i:last-child');i.insertAdjacentHTML('beforebegin','<i class="s49" style="font-style:normal;min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center;padding:0 5px;margin-right:8px">15</i>');const s=r.querySelector('small');if(s)s.textContent='15 preços para corrigir'};f();new MutationObserver(f).observe(document.getElementById('v-grp'),{childList:true,subtree:true})}""");w(400)
  x=shot(pg,'gp%d'%prop);b.close();return x
def giro(pw,prop,y=0):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500)
  pg.evaluate("()=>__LF.inicioGo('repo')");w(1500);pg.add_style_tag(content='#nvBar{display:none!important}')
  T=pg.evaluate("()=>{const S=__LF.S;const it=S.items.find(i=>/redond|Armação/i.test(i.nome||''))||S.items[0];return [it.nome||it.ref,[...document.querySelectorAll('img')].map(i=>i.src).filter(s=>/^data:image\\/svg/.test(s))[0]||'']}")
  if prop: pg.evaluate(r"""(T)=>{const B=document.getElementById('dtabBody');const L=[...B.querySelectorAll('.fxF')].find(x=>/Lista de compras/.test(x.textContent));
    // 1) Lista de compras vira linha › para Compras (48d)
    L.classList.remove('on');L.querySelector('.fxB').remove();[...L.querySelectorAll('.fxH *')].filter(x=>x.children.length==0).forEach(x=>{if(/vão acabar/.test(x.textContent))x.textContent='17 para comprar'});const c=L.querySelector('.fxC');c.textContent='›';c.style.setProperty('transform','none','important');
    // 2) Sobrando sai da lista de compras e vira bloco próprio do Giro (é mercadoria parada, não compra)
    const S=L.nextElementSibling.cloneNode(true);S.classList.add('on');const h=S.querySelector('.fxH');const tx=[...h.querySelectorAll('*')].filter(x=>x.children.length==0&&x.textContent.trim());tx[0].textContent='Sobrando';tx[1].textContent='1 peça acima do ideal · US$ 5';tx[1].style.color='var(--warn,#e0b44c)';
    const bd=S.querySelector('.fxB')||document.createElement('div');bd.className='fxB';bd.style.cssText='display:block;padding:0 0 16px';
    bd.innerHTML='<div style="display:flex;align-items:center;gap:16px;min-height:80px;border-bottom:1px solid var(--line2)"><span style="flex:0 0 64px;height:48px;border-radius:10px;overflow:hidden;background:#fff"><img src="'+T[1]+'" style="width:100%;height:100%;object-fit:contain"></span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+T[0]+'</b><small style="font-size:13px;color:var(--mute)">tem 4 · sobram 2 · ~120 dias</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><b style="font-size:16px;font-weight:600;color:var(--warn,#e0b44c);font-variant-numeric:tabular-nums">US$ 5</b><span style="color:var(--accent-fg);font-size:14px;font-weight:600">Oferta ›</span></span></div><div style="color:var(--mute);font-size:13px;margin-top:12px">Sobrando = mais do que vende em 45 dias. Vira parada se não sair.</div>';
    if(!S.querySelector('.fxB'))S.appendChild(bd);L.after(S)}""",T);w(500)
  else:
    # HOJE: o que o print do dono mostra — Sobrando dentro da Lista de compras, "como calcula ›" que abre no lugar
    pg.evaluate(r"""()=>{const B=document.getElementById('dtabBody');const L=[...B.querySelectorAll('.fxF')].find(x=>/Lista de compras/.test(x.textContent));L.classList.add('on')}""");w(300)
  if y: pg.evaluate("(y)=>{let best=document.scrollingElement;for(const e of document.querySelectorAll('*')){const cs=getComputedStyle(e);if(/(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+20&&e.getBoundingClientRect().height>300&&e.scrollHeight>best.scrollHeight-1)best=e}best.scrollTop=y}",y);w(400)
  x=shot(pg,'giro%d'%prop);b.close();return x
def quadro(arq,q):
  g=40;w=max(i.width for _,_,i in q);h=max(i.height for _,_,i in q);S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    if im.width!=w: im=im.resize((w,int(im.height*w/im.width)))
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+im.width,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_49a_atacado.jpg',[('HOJE · Atacado','4 abas de assuntos diferentes',Image.open(O+'h_atacado.jpg').crop((0,0,780,1688))),('PROPOSTA · Atacado','lojistas na tela · mensagens com selo · o resto vira lugar ›',atacado(pw))])
  quadro('esboco_49b_modelos.jpg',[('HOJE · Modelos','5 abas, cartões',Image.open('/home/claude/lafouch/work/s435/painelsite/h5_modelos.jpg').crop((0,0,780,1688))),('PROPOSTA · Modelos','2 abas · problemas numa linha com selo',modelos(pw,'lista')),('PROPOSTA · Precisa de atenção ›','sem foto e esgotados juntos',modelos(pw,'at'))])
  quadro('esboco_49c_precos_corrigir.jpg',[('HOJE · Inventário','"15 preços para corrigir" na barra',inventario(pw,0)),('PROPOSTA · Inventário','sai da barra (já existe em Preços)',inventario(pw,1)),('PROPOSTA · Giro e preços','selo 15 na linha Preços',giroprecos(pw,1))])
  quadro('esboco_50_giro.jpg',[('HOJE · Giro (seu celular)','Sobrando dentro da Lista de compras',Image.open('/mnt/user-data/uploads/74a889a0-image.jpg')),('PROPOSTA · Giro','Lista ›  ·  Sobrando vira bloco próprio',giro(pw,1))])
