# Esboço 43 (S435, 21/11 08:24) — Estúdio no padrão do app (dono: "não está nos padrões do app").
# Base: aprovados (base_app) + 41 (Frente·3/4·Giro em cada peça). Hoje = o Estúdio como abre hoje (por cima de tudo, com ×).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/giro/'
PROP=r"""(R)=>{const v=document.getElementById('v-grp');const vsFix=()=>{if(!v.querySelector(':scope>.nvVs')){v.insertAdjacentHTML('afterbegin','<button type="button" class="nvVs"><i aria-hidden="true">‹</i>Peças</button>')}};new MutationObserver(vsFix).observe(v,{childList:true});setTimeout(vsFix,50);
 const mk=(t,s)=>'<span style="display:inline-flex;align-items:center;gap:6px;margin-right:14px;color:'+(s?'var(--fg)':'var(--mute)')+'"><i style="width:8px;height:8px;border-radius:50%;'+(s?'background:var(--ok)':'border:1.5px solid var(--mute);box-sizing:border-box')+'"></i>'+t+'</span>';
 const row=r=>'<button type="button" class="nvL" style="min-height:80px"><span style="flex:0 0 64px;height:48px;border-radius:10px;overflow:hidden;background:#fff;display:block"><img src="'+r[0]+'" style="width:100%;height:100%;object-fit:contain"></span><span class="nvTx"><b>'+r[1]+'</b><small>'+r[2]+'</small><small style="display:flex;margin-top:4px">'+mk('Frente',1)+mk('3/4',0)+mk('Giro',0)+'</small></span><i aria-hidden="true">›</i></button>';
 v.innerHTML=
  '<div class="top"><div><h1>Estúdio</h1><div class="crumb">Fotos e giros das peças</div></div><div class="tabs" style="display:flex;gap:12px"><button class="pl78" type="button" aria-label="Galeria do app" style="margin:0;position:relative"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 9"/></svg><i style="position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center;padding:0 5px">2</i></button><button class="pl78" type="button" aria-label="Como funciona" style="margin:0"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17.5h.01"/></svg></button></div></div>'+
  '<button type="button" style="display:block;width:100%;min-height:52px;margin:24px 0 8px;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font:inherit;font-size:16px;font-weight:700">Começar · 24 peças na fila</button>'+
  '<button type="button" class="lk100 c101">Peça nova, ainda sem cadastro ›</button>'+
  '<div class="lbl" style="margin:32px 0 0">Na fila · 24</div><section class="nvLista">'+R.map(row).join('')+'</section>'}"""
def tira(pw,prop):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True)
  pg.evaluate("()=>__LF.inicioGo('est')");w(1500)
  R=pg.evaluate("()=>[...document.querySelectorAll('.estOv .estIt')].slice(0,7).map(b=>[b.querySelector('img').src,b.querySelector('b').textContent,b.dataset.cor])")
  if prop:
    pg.evaluate("()=>{const x=document.querySelector('.estOv [data-e=fecha]');x&&x.click()}");w(600)
    pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
    pg.evaluate(PROP,R);w(500);pg.add_style_tag(content='#grTog,#iniTog2{visibility:hidden!important}')
  else:
    pg.evaluate(r"""()=>{const ov=document.querySelector('.estOv');const mk=(t,s)=>'<span style="display:inline-flex;align-items:center;gap:6px;margin-right:14px;color:'+(s?'var(--fg)':'var(--mute)')+'"><i style="width:8px;height:8px;border-radius:50%;'+(s?'background:var(--ok)':'border:1.5px solid var(--mute);box-sizing:border-box')+'"></i>'+t+'</span>';
     ov.querySelectorAll('.estRw').forEach(r=>{const sm=r.querySelector('small');sm.innerHTML=sm.textContent.split(' · ')[0]+'<span style="display:flex;margin-top:4px">'+mk('Frente',1)+mk('3/4',0)+mk('Giro',0)+'</span>';const fi=r.querySelector('.estFi');if(fi)fi.textContent='Galeria ›'})}""");w(300)
  pg.add_style_tag(content='#nvBar{display:none!important}')
  f='/tmp/e43_%d.png'%prop;pg.screenshot(path=f);b.close();x=Image.open(f);x.load();return x.copy()
with sync_playwright() as pw:
  q=[('HOJE · Estúdio (com o 41 aprovado)','abre por cima de tudo · × · sem barra · rótulo rosa · 2 toques por linha',tira(pw,False)),
     ('PROPOSTA · Estúdio','tela do grupo Peças · "‹ PEÇAS" · Galeria e ? redondos · barra · linha inteira ›',tira(pw,True))]
  g=40;w,h=q[0][2].size;S=Image.new('RGB',(g+2*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+w,112+h],outline=(90,90,100))
  S.save(O+'esboco_43_estudio_no_padrao.jpg',quality=88);print('ok')
