# Esboço 44 (S435, 21/11 10:07) — cadastro do Inventário no padrão: Adicionar (Da Galeria + Ler etiqueta), passo 1 em linhas, passo 2 cores da Galeria/Nova cor.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/cadastro/'
CARD=r"""const card=(img,t,s,b360,on)=>'<button type="button" style="position:relative;display:flex;flex-direction:column;align-items:stretch;padding:6px;border-radius:14px;border:'+(on?'1.5px solid var(--accent)':'1px solid var(--line)')+';background:var(--panel);text-align:left;color:var(--fg);font:inherit"><span style="display:block;border-radius:10px;overflow:hidden;background:#fff;aspect-ratio:16/10"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain"></span>'+(b360?'<span style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,.62);color:#fff;border-radius:999px;padding:3px 8px;font-size:11px;font-weight:700">360°</span>':'')+'<b style="font-size:14px;margin:8px 6px 0">'+t+'</b><small style="font-size:12px;color:var(--mute);margin:2px 6px 4px">'+s+'</small></button>';
const LB=t=>'<div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:24px 0 4px">'+t+'</div>';
const CAMPO=(r,ph,v,ic)=>'<label style="display:block;margin:16px 0 0"><span style="display:block;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)">'+r+'</span><span style="display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--line);min-height:44px"><input value="'+(v||'')+'" placeholder="'+ph+'" style="flex:1;min-width:0;background:none;border:0;outline:0;color:var(--fg);font:inherit;font-size:16px;padding:8px 0"></span></label>'.replace('</span></label>',(ic||'')+'</span></label>');
const LIN=(r,v,ch)=>'<button type="button" style="display:flex;align-items:center;gap:12px;width:100%;min-height:52px;background:none;border:0;border-bottom:1px solid var(--line2);padding:0;color:var(--fg);font:inherit;font-size:16px;text-align:left"><span style="flex:1">'+r+'</span><span style="color:var(--mute);font-size:15px">'+v+'</span><i style="font-style:normal;color:var(--mute);font-size:20px;width:14px;text-align:center">'+(ch||'›')+'</i></button>';
const BOT=t=>'<div style="position:sticky;bottom:0;background:inherit;padding:12px 0 8px;margin-top:16px"><button type="button" style="display:block;width:100%;min-height:52px;margin:0;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font:inherit;font-size:16px;font-weight:700">'+t+'</button></div>';
const SCAN='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-fg)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3M7 9h10M7 12h7M7 15h9"/></svg>';"""
def abre(pw):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True)
  I=pg.evaluate("()=>[...document.querySelectorAll('.pcard img')].map(i=>i.src).filter(s=>/^data:image\\/svg/.test(s)).slice(0,6)")
  pg.evaluate("()=>{const b=document.querySelector('button[aria-label=\"Adicionar\"]');b&&b.click()}");w(1500)
  return b,pg,w,I
def shot(pg,nome):
  f='/tmp/c44_%s.png'%nome;pg.screenshot(path=f);x=Image.open(f);x.load();return x.copy()
def tela(pw,qual):
  b,pg,w,I=abre(pw)
  if qual=='add_p':
    pg.evaluate(r"""(I)=>{"""+CARD+r"""const ft=document.getElementById('btnFoto');ft.querySelector('b').textContent='Ler etiqueta';ft.setAttribute('aria-label','Ler etiqueta');
     ft.querySelector('svg').innerHTML='<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>';
     const lb=[...document.querySelectorAll('body *')].filter(e=>/^dar entrada de novo$/i.test((e.textContent||'').trim())&&e.getBoundingClientRect().height).pop();
     const d=document.createElement('div');d.innerHTML='<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:0 0 8px">Da Galeria · sem peça · 2</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:24px">'+card(I[3],'Giro','hoje 07:30',1)+card(I[1],'Giro','hoje 07:22',1)+'</div>';lb.parentNode.insertBefore(d,lb)}""",I)
  if qual in ('p1','p1_p','p2','p2_p'):
    pg.evaluate("()=>document.getElementById('addToMan').click()");w(1500)
    pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Armação'&&x.getBoundingClientRect().height);b&&b.click()}");w(600)
  if qual in ('p2','p2_p'):
    pg.fill('#eRef','TS1234');w(300);pg.fill('#eCusto','4,5');w(300)
    pg.evaluate("()=>{const S=__LF.S;S._fmtUsed='Redondo';S.eMat='Metal';S.ePub='Feminino';document.getElementById('nvNext').click()}");w(1500)
  if qual=='p1_p':
    pg.evaluate(r"""()=>{"""+CARD+r"""const mb=[...document.querySelectorAll('.modal-box')].filter(e=>e.getBoundingClientRect().height).pop();
     const tipo=[...mb.querySelectorAll('*')].find(e=>e.querySelector&&[...e.children].filter(c=>c.tagName=='BUTTON').length==4&&/Armação/.test(e.textContent));const tH=tipo?tipo.outerHTML:'';
     const puxa='<div style="width:44px;height:5px;border-radius:3px;background:var(--line);margin:0 auto 10px"></div>';
     mb.innerHTML=puxa+'<b style="display:block;font-size:20px;margin:8px 0 2px">Nova peça</b><div style="color:var(--mute);font-size:14px">Passo 1 de 2 · o modelo</div>'+
      CAMPO('Código da haste','Ex.: SL2250 (ou deixe vazio)','',SCAN)+LB('Tipo')+'<div style="margin-top:8px">'+tH+'</div>'+
      LB('Como é')+LIN('Formato','escolher')+LIN('Material','escolher')+LIN('Gênero','escolher')+
      CAMPO('Custo por peça (US$)','Ex.: 0,50','')+
      LIN('Mais detalhes (opcional)','','⌄')+BOT('Continuar · cores e fotos')}""")
  if qual=='p2_p':
    pg.evaluate(r"""(I)=>{"""+CARD+r"""const mb=[...document.querySelectorAll('.modal-box')].filter(e=>e.getBoundingClientRect().height).pop();
     const pt='<span style="display:inline-flex;align-items:center;gap:6px;margin-right:12px;color:var(--fg)"><i style="width:8px;height:8px;border-radius:50%;background:var(--ok)"></i>';
     mb.innerHTML='<div style="width:44px;height:5px;border-radius:3px;background:var(--line);margin:0 auto 10px"></div><button type="button" style="display:block;background:none;border:0;padding:0;min-height:32px;color:var(--mute);font:600 12px/1 inherit;letter-spacing:.14em;text-transform:uppercase;text-align:left">‹ O modelo</button>'+
      '<b style="display:block;font-size:20px;margin:4px 0 2px">Cores e fotos</b><div style="color:var(--mute);font-size:14px">Passo 2 de 2 · TS1234 · Armação redonda</div>'+
      LB('Da Galeria · sem peça · 1')+'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px">'+card(I[1],'Giro','hoje 07:22',1,0)+'</div><div style="color:var(--mute);font-size:13px;margin-top:8px">Toque num giro para fazer dele uma cor desta peça.</div>'+
      LB('Cores desta peça · 1')+
      '<div style="display:flex;align-items:center;gap:12px;min-height:72px;border-bottom:1px solid var(--line2)"><span style="flex:0 0 64px;height:44px;border-radius:8px;overflow:hidden;background:#fff"><img src="'+I[3]+'" style="width:100%;height:100%;object-fit:contain"></span><span style="flex:1;min-width:0"><b style="display:block;font-size:16px">C1 · Preto</b><small style="display:flex;margin-top:4px;font-size:13px">'+pt+'Frente</span>'+pt+'3/4</span>'+pt+'Giro</span></small></span><span style="display:inline-flex;align-items:center;gap:14px"><b style="color:var(--mute);font-size:20px">−</b><b style="font-size:16px">1</b><b style="font-size:20px">+</b></span></div>'+
      '<button type="button" style="display:flex;align-items:center;gap:16px;width:100%;min-height:56px;background:none;border:0;border-bottom:1px solid var(--line2);padding:0;color:var(--accent-fg);font:inherit;font-size:15px;font-weight:600;text-align:left"><span style="flex:0 0 32px;height:32px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:var(--fg)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span><span>Nova cor ›</span></button>'+
      '<div style="display:flex;align-items:center;justify-content:space-between;min-height:64px;border-bottom:1px solid var(--line2)"><span><b style="display:block;font-size:16px;font-weight:500">No site</b><small style="color:var(--mute);font-size:13px">mostrar esta peça no site</small></span><span class="sw" style="pointer-events:none"><input type="checkbox" checked tabindex="-1"><i></i></span></div>'+BOT('Concluir')}""",I)
  w(500);x=shot(pg,qual);b.close();return x
def quadro(arq,q):
  g=40;w,h=q[0][2].size;S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+w,112+h],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
with sync_playwright() as pw:
  quadro('esboco_44a_adicionar.jpg',[('HOJE · Adicionar','"Foto" = foto da etiqueta, mas parece foto da peça',tela(pw,'add')),('PROPOSTA · Adicionar','"Ler etiqueta" · Da Galeria · sem peça',tela(pw,'add_p'))])
  quadro('esboco_44b_passo1_modelo.jpg',[('HOJE · Novo modelo','caixas · pílulas ▾ · ▸ do navegador',tela(pw,'p1')),('PROPOSTA · Nova peça · passo 1','campos em linha · escolhas › · Mais detalhes ⌄',tela(pw,'p1_p'))])
  quadro('esboco_44c_passo2_cores.jpg',[('HOJE · Cores e fotos','foto crua por cor · cartões · botão "‹" quadrado',tela(pw,'p2')),('PROPOSTA · passo 2','"‹ O MODELO" · da Galeria · Nova cor · No site em linha',tela(pw,'p2_p'))])
