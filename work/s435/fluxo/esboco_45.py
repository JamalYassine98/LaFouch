# Esboço 45 (S435, 21/11 10:43) — rumo aprovado: a peça com foto nasce no Estúdio (haste → rascunho → cores → Terminei → tratamento)
# e o Inventário completa ("A completar"). Supera o 41c e refaz o 44 (Adicionar sem Ler haste/Da Galeria).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
exec(open('/home/claude/lafouch/work/s435/giro/hoje.py').read().split("\nif __name__=='__main__':")[0])
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/fluxo/'
src=open('/home/claude/lafouch/work/s435/cadastro/esboco_44.py').read();a=src.index('CARD=r"""');b=src.index('"""',a+10)+3;exec(src[a:b])
H=r"""const MK=(t,s)=>'<span style="display:inline-flex;align-items:center;gap:6px;margin-right:14px;color:'+(s?'var(--fg)':'var(--mute)')+'"><i style="width:8px;height:8px;border-radius:50%;'+(s?'background:var(--ok)':'border:1.5px solid var(--mute);box-sizing:border-box')+'"></i>'+t+'</span>';
const ROW=(img,t,s,extra,ch)=>'<button type="button" class="nvL" style="min-height:80px"><span style="flex:0 0 64px;height:48px;border-radius:10px;overflow:hidden;background:'+(img?'#fff':'var(--panel2)')+';display:grid;place-items:center">'+(img?'<img src="'+img+'" style="width:100%;height:100%;object-fit:contain">':'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>')+'</span><span class="nvTx"><b>'+t+'</b><small>'+s+'</small>'+(extra||'')+'</span><i aria-hidden="true">'+(ch||'›')+'</i></button>';
const BAR=p=>'<span style="display:block;height:4px;border-radius:2px;background:var(--line);margin-top:6px;position:relative;max-width:180px"><i style="position:absolute;left:0;top:0;bottom:0;width:'+p+'%;background:var(--accent);border-radius:2px"></i></span>';
const RB=(ic,lab,n)=>'<button class="pl78" type="button" aria-label="'+lab+'" style="margin:0;position:relative"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+ic+'</svg>'+(n?'<i style="position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center;padding:0 5px">'+n+'</i>':'')+'</button>';
const IGAL='<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 9"/>',IAJ='<path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17.5h.01"/>';
const JAN=(inner)=>{document.querySelectorAll('.f45').forEach(x=>x.remove());const bk=document.createElement('div');bk.className='ljBk f45';bk.style.opacity='.5';const j=document.createElement('div');j.className='ljJn f45';j.style.transform='none';j.innerHTML='<div class="ljPuxa"></div>'+inner;document.body.appendChild(bk);document.body.appendChild(j)};"""
def pagina(pg,html,vs='Peças'):
  pg.evaluate(r"""(a)=>{const v=document.getElementById('v-grp');const vs=a[1];const f=()=>{if(!v.querySelector(':scope>.nvVs'))v.insertAdjacentHTML('afterbegin','<button type="button" class="nvVs"><i aria-hidden="true">‹</i>'+vs+'</button>')};new MutationObserver(f).observe(v,{childList:true});v.innerHTML=a[0];f()}""",[html,vs])
def base(pw):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True)
  pg.evaluate("()=>__LF.inicioGo('est')");w(1500)
  R=pg.evaluate("()=>[...document.querySelectorAll('.estOv .estIt')].slice(0,8).map(b=>[b.querySelector('img').src,b.querySelector('b').textContent,b.dataset.cor,b.dataset.ref])")
  pg.evaluate("()=>{const x=document.querySelector('.estOv [data-e=fecha]');x&&x.click()}");w(500)
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#grTog,#iniTog2{visibility:hidden!important}#nvBar{display:none!important}')
  return b,pg,w,R
def shot(pg,n):
  f='/tmp/f45_%s.png'%n;pg.screenshot(path=f);x=Image.open(f);x.load();return x.copy()
EST=r"""(R)=>{"""+CARD+H+r"""return '<div class="top"><div><h1>Estúdio</h1><div class="crumb">Fotos e giros das peças</div></div><div class="tabs" style="display:flex;gap:12px">'+RB(IGAL,'Galeria do app',0)+RB(IAJ,'Como funciona',0)+'</div></div>'+
 BOT('Gravar uma peça ›').replace('position:sticky;bottom:0;background:inherit;padding:12px 0 8px;margin-top:16px','margin-top:24px')+
 LB('Em andamento · 3')+'<section class="nvLista">'+
 ROW(R[0][0],'TS1234 · peça nova','gravando · 2 cores · falta "Terminei"')+
 ROW(R[1][0],'SL2250 · peça nova','tratando · 3 de 4 cores',BAR(75))+
 ROW(R[2][0],'BR44118 · Armação Gucci','a tratar em casa · 5 cores')+'</section>'+
 LB('Faltam fotos · 24')+'<section class="nvLista">'+R.slice(3,6).map(r=>ROW(r[0],r[1],r[2],'<small style="display:flex;margin-top:4px">'+MK('Frente',1)+MK('3/4',0)+MK('Giro',0)+'</small>')).join('')+'</section>'}"""
def estudio(pw):
  b,pg,w,R=base(pw);html=pg.evaluate(EST,R);pagina(pg,html);w(500);x=shot(pg,'est');b.close();return x
def janela(pw,qual):
  b,pg,w,R=base(pw);html=pg.evaluate(EST,R);pagina(pg,html);w(300)
  pg.evaluate(r"""(a)=>{"""+CARD+H+r"""const R=a[0],q=a[1];
   const OPC=(ic,t,s)=>'<button type="button" style="display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-bottom:1px solid var(--line2);padding:0;color:var(--fg);font:inherit;text-align:left"><span style="flex:0 0 24px;color:var(--mute);display:flex"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+ic+'</svg></span><span style="flex:1;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span><i style="font-style:normal;color:var(--mute);font-size:20px">›</i></button>';
   const SC='<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3M7 9h10M7 12h7M7 15h9"/>',KB='<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>',NO='<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>';
   const LNK=t=>'<button type="button" class="lk100 c101">'+t+'</button>';
   if(q=='inicio')JAN('<div class="ljHd"><b>Gravar uma peça</b></div><div class="ljCorpo"><div style="color:var(--mute);font-size:14px;margin:-4px 0 8px">Primeiro, qual é a peça? O código fica na haste.</div>'+OPC(SC,'Ler a haste','a câmera lê o código gravado')+OPC(KB,'Digitar o código','quando a haste não dá para ler')+OPC(NO,'Peça sem código','ganha um número provisório')+'</div>');
   if(q=='nova')JAN('<div class="ljHd"><b>TS1234</b></div><div class="ljCorpo"><div style="display:flex;align-items:center;gap:12px;margin:-4px 0 16px"><span style="width:10px;height:10px;border-radius:50%;background:var(--accent)"></span><span style="font-size:15px">Peça nova</span></div><div style="color:var(--mute);font-size:14px;line-height:1.45">Vai nascer como rascunho. Grave as cores; depois de tratada, você completa os detalhes no Inventário.</div>'+BOT('Gravar as cores ›').replace('position:sticky;bottom:0;background:inherit;padding:12px 0 8px;margin-top:16px','margin-top:24px')+LNK('Ler de novo ›')+'</div>');
   if(q=='existe')JAN('<div class="ljHd"><b>BR44118</b></div><div class="ljCorpo"><div style="display:flex;align-items:center;gap:12px;margin:-4px 0 16px"><span style="flex:0 0 64px;height:44px;border-radius:8px;overflow:hidden;background:#fff"><img src="'+R[2][0]+'" style="width:100%;height:100%;object-fit:contain"></span><span><b style="display:block;font-size:16px">Armação Gucci de metal feminino</b><small style="color:var(--mute);font-size:13px">já cadastrada · 3 cores com foto</small></span></div><div style="color:var(--mute);font-size:14px;line-height:1.45">As cores que você gravar entram nesta peça. Uma cor que já tem giro é trocada pela nova.</div>'+BOT('Gravar cores desta peça ›').replace('position:sticky;bottom:0;background:inherit;padding:12px 0 8px;margin-top:16px','margin-top:24px')+LNK('Não é esta peça · ler de novo ›')+'</div>');
  }""",[R,qual]);w(500);x=shot(pg,qual);b.close();return x
def camera(pw):
  b,pg=abre2(pw,844,390);pg.evaluate("()=>window.__fkRot=0")
  pg.evaluate("()=>__LF.setView('estoque')");pg.wait_for_timeout(800)
  pg.evaluate("()=>{const i=[...document.querySelectorAll('.pcard img')].find(x=>/^data:image\\/svg/.test(x.src));window.__fkImg=i&&i.src}")
  pg.evaluate("()=>__LF.inicioGo('est')");pg.wait_for_timeout(1500)
  pg.evaluate("()=>{const b=document.querySelector('[data-i=\"0\"]');b&&b.click()}");pg.wait_for_timeout(5000)
  pg.evaluate(r"""()=>{const o=document.getElementById('estCam');const t=o.querySelector('.ecTag');t.innerHTML='<span style="display:block;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6)">Giro · cor 3</span><b style="display:block;color:#fff;font-size:15px;font-weight:600;margin-top:2px">TS1234 · peça nova</b>';
   const vf=o.querySelector('.ecVf');const d=document.createElement('div');d.style.cssText='position:absolute;inset:0;z-index:20;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center';
   d.innerHTML='<div style="background:var(--panel);border-radius:22px;padding:20px 22px;width:420px;max-width:90%;color:var(--fg);font-family:Roboto,system-ui,sans-serif"><div style="display:flex;align-items:center;gap:10px"><span style="width:22px;height:22px;border-radius:50%;background:#2fe08f;display:grid;place-items:center;color:#0b2a19;font-weight:800;font-size:13px">✓</span><b style="font-size:17px">Cor 2 gravada</b></div><div style="color:var(--mute);font-size:14px;margin:6px 0 16px 32px">tratando por trás · 1 na fila</div><button type="button" style="display:block;width:100%;min-height:52px;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font:inherit;font-size:16px;font-weight:700">Gravar outra cor</button><button type="button" style="display:block;width:100%;min-height:48px;margin-top:8px;background:none;border:0;color:var(--fg);font:inherit;font-size:15px;font-weight:600">Terminei esta peça ›</button></div>';
   vf.appendChild(d);const l=o.querySelector('.ecLista');if(l)l.innerHTML='';const fx=()=>{const L=o.querySelector('.ecLista');if(L){const sp=[...L.children];if(sp[0]&&/Celular deitado/.test(sp[0].textContent)){sp[0].lastChild.textContent='Câmera reta';const n=sp[3].cloneNode(true);n.lastChild.textContent='Peça reta';sp[3].after(n)}}const Fr=o.querySelector('.ecFrase');if(Fr){const tn=[...Fr.childNodes].filter(n=>n.nodeType==3||n.tagName=='B'||n.tagName=='SPAN').pop();if(tn&&tn.textContent!=='Falta luz: aumente a luz da caixa')tn.textContent='Falta luz: aumente a luz da caixa'}};new MutationObserver(fx).observe(o,{subtree:true,childList:true});setInterval(fx,150)}""");pg.wait_for_timeout(800)
  f='/tmp/f45_cam.png';pg.screenshot(path=f);b.close();x=Image.open(f);x.load();return x.copy()
def inventario(pw,qual):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True)
  I=pg.evaluate("()=>[...document.querySelectorAll('.pcard img')].map(i=>i.src).filter(s=>/^data:image\\/svg/.test(s)).slice(0,6)")
  pg.add_style_tag(content='#nvBar{display:none!important}')
  pg.evaluate(r"""(I)=>{"""+H+r"""const v=document.getElementById('v-estoque');const t=v.querySelector('.top');const d=document.createElement('section');d.className='f45sec';
   d.innerHTML='<div class="lbl" style="margin:16px 0 0">A completar · 2</div><section class="nvLista" style="display:flex;flex-direction:column">'+ROW(I[1],'TS1234 · 4 cores','tratada · falta custo, preço e material').replace('class="nvL"','class="nvL" style="display:flex;align-items:center;gap:16px;width:100%;min-height:80px;background:none;border:0;border-bottom:1px solid var(--line2);color:var(--fg);font:inherit;text-align:left;padding:12px 0"')+ROW(I[3],'SL2250 · 3 cores','tratada · falta custo e preço').replace('class="nvL"','class="nvL" style="display:flex;align-items:center;gap:16px;width:100%;min-height:80px;background:none;border:0;border-bottom:1px solid var(--line2);color:var(--fg);font:inherit;text-align:left;padding:12px 0"')+'</section>';
   d.querySelectorAll('.nvTx').forEach(x=>{x.style.cssText='flex:1;min-width:0;display:flex;flex-direction:column;gap:2px';x.querySelector('b').style.cssText='font-size:16px;font-weight:500';x.querySelectorAll('small').forEach(s=>s.style.cssText='font-size:13px;color:var(--mute)')});d.querySelectorAll('.nvL>i').forEach(i=>i.style.cssText='font-style:normal;font-size:20px;color:var(--mute)');
   const tabs=v.querySelector('#eTabs,.fnBar,[role=tablist]')||t.nextElementSibling;(tabs||t).after(d)}""",I);w(400)
  if qual=='comp':
    pg.evaluate(r"""(I)=>{"""+CARD+H+r"""const tipo='<div style="display:flex;background:var(--panel2);border-radius:12px;padding:4px;margin-top:8px">'+['Pré-grad.','Armação','Solar','Outro'].map((t,i)=>'<span style="flex:1;text-align:center;padding:10px 0;border-radius:9px;font-size:15px;'+(i==1?'background:var(--bg);color:var(--fg);font-weight:600':'color:var(--mute)')+'">'+t+'</span>').join('')+'</div>';
     const cor=(img,c,n,q)=>'<div style="display:flex;align-items:center;gap:12px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:0 0 56px;height:40px;border-radius:8px;overflow:hidden;background:#fff"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain"></span><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+c+'</b><small style="color:var(--mute);font-size:13px">'+n+'</small></span><span style="display:inline-flex;align-items:center;gap:14px"><b style="color:var(--mute);font-size:20px">−</b><b style="font-size:16px">'+q+'</b><b style="font-size:20px">+</b></span></div>';
     JAN('<div class="ljHd"><b>Completar TS1234</b></div><div class="ljCorpo" style="max-height:760px;overflow:hidden"><div style="color:var(--mute);font-size:14px;margin:-4px 0 0">4 cores tratadas no Estúdio</div>'+
      LB('Tipo')+tipo+LB('Como é')+LIN('Formato','Redondo · sugerido')+LIN('Material','escolher')+LIN('Gênero','escolher')+
      LB('Preço')+LIN('Custo por peça','US$ 4,50 · da nota')+LIN('Preço de venda','G$ 60.000 · sugerido')+LIN('Oferta','nenhuma')+
      LB('Cores · 4')+cor(I[1],'C1 · Preto','sugerido pela imagem',3)+cor(I[2],'C2 · Dourado','sugerido pela imagem',2)+
      LIN('Descrição e mais detalhes','','⌄')+
      '<div style="display:flex;align-items:center;justify-content:space-between;min-height:64px;border-bottom:1px solid var(--line2)"><span><b style="display:block;font-size:16px;font-weight:500">Publicar no site</b><small style="color:var(--mute);font-size:13px">ao concluir</small></span><span class="sw" style="pointer-events:none"><input type="checkbox" checked tabindex="-1"><i></i></span></div></div>'+
      '<div style="position:absolute;left:0;right:0;bottom:0;padding:12px 16px 16px;background:inherit"><button type="button" style="display:block;width:100%;min-height:52px;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font:inherit;font-size:16px;font-weight:700">Concluir</button></div>');
     const j=[...document.querySelectorAll('.ljJn.f45')].pop();j.style.top='56px';j.style.bottom='0';j.style.height='auto'}""",I);w(500)
  x=shot(pg,'inv_'+qual);b.close();return x
def quadro(arq,q):
  g=40;w=max(i.width for _,_,i in q);h=max(i.height for _,_,i in q);S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+im.width,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
with sync_playwright() as pw:
  quadro('esboco_45a_estudio.jpg',[('PROPOSTA · Estúdio','"Gravar uma peça" · em andamento · faltam fotos',estudio(pw))])
  quadro('esboco_45b_qual_peca.jpg',[('1 · Gravar uma peça ›','primeiro: qual é a peça?',janela(pw,'inicio')),('2a · código novo','nasce rascunho · grava as cores',janela(pw,'nova')),('2b · código que já existe','as cores entram na peça',janela(pw,'existe'))])
  im=camera(pw);g=40;S=Image.new('RGB',(im.width+2*g,im.height+150),(17,20,26));d=ImageDraw.Draw(S)
  d.text((g,24),'3 · depois de cada cor',font=F(34),fill=(235,235,240));d.text((g,70),'"Gravar outra cor" ou "Terminei esta peça" · o tratamento roda por trás',font=F(22),fill=(140,150,165));S.paste(im,(g,110));S.save(O+'esboco_45c_depois_de_cada_cor.jpg',quality=88);print('ok c')
  quadro('esboco_45d_inventario_completar.jpg',[('4 · Inventário','"A completar" · só rascunhos já tratados',inventario(pw,'lista')),('5 · Completar ›','detalhes técnicos · preço · oferta · publicar',inventario(pw,'comp'))])
