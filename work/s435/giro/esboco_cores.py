# Esboço 42 (S435, 21/11) — Editar produto › Cores e fotos: sai "Trocar foto"; "Cor nova" fica fácil (janela de baixo, escolher a cor
# sem precisar de foto; a foto entra pela fila do Estúdio). Pedidos do dono 20/11 23:36 e 23:39 (recados da APP).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/giro/'
def abre(pw):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True)
  pg.evaluate("()=>{const c=[...document.querySelectorAll('.pcard')].find(x=>/#13/.test(x.textContent));(c||document.querySelectorAll('.pcard')[2]).click()}");w(1500)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('#v-estoque button')].find(b=>/Editar/i.test(b.getAttribute('aria-label')||''));b&&b.click()}");w(1500)
  pg.evaluate("()=>{const t=document.getElementById('edTab2');t&&t.click()}");w(1200)
  return b,pg,w
PROP=r"""()=>{const m=document.getElementById('editModal');const t=document.getElementById('edTrocaFoto');if(t)t.remove();
 const n=document.getElementById('edCorNova');const ln=n.cloneNode(false);ln.id='edCorNova2';
 ln.style.cssText='display:flex;align-items:center;gap:16px;width:100%;min-height:56px;background:none;border:0;padding:0;color:var(--accent-fg);font:inherit;font-size:15px;font-weight:600;text-align:left';
 ln.innerHTML='<span style="flex:0 0 32px;height:32px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:var(--fg)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span><span>Nova cor ›</span>';
 n.replaceWith(ln)}"""
JAN=r"""()=>{const bk=document.createElement('div');bk.className='ljBk';bk.style.opacity='.5';const j=document.createElement('div');j.className='ljJn';j.style.transform='none';
 const chip=(t,on,c)=>'<button type="button" style="display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;margin:0 8px 8px 0;border-radius:999px;border:1px solid '+(on?'var(--accent)':'var(--line)')+';background:'+(on?'var(--accent-soft)':'none')+';color:var(--fg);font:inherit;font-size:14px"><i style="width:14px;height:14px;border-radius:50%;background:'+c+';border:1px solid rgba(255,255,255,.25)"></i>'+t+'</button>';
 const lin=(r,v)=>'<div style="display:flex;justify-content:space-between;align-items:center;min-height:52px;border-bottom:1px solid var(--line2)"><span style="color:var(--mute)">'+r+'</span>'+v+'</div>';
 j.innerHTML='<div class="ljPuxa"></div><div class="ljHd"><b>Nova cor</b></div><div class="ljCorpo"><div style="color:var(--mute);font-size:14px;margin:-4px 0 16px">Óculos solar #13 · YS8801</div>'+
  '<div class="lbl" style="font-size:11px;letter-spacing:.14em;color:var(--mute);margin:0 0 8px">QUAL COR</div>'+
  chip('Dourado',true,'#c9a44a')+chip('Tartaruga',false,'#6b4226')+chip('Transparente',false,'#dfe7ee')+chip('Prata',false,'#b9bec4')+chip('Outra…',false,'transparent')+
  '<div style="margin:8px 0 16px"><button type="button" style="background:none;border:0;padding:0;min-height:44px;color:var(--accent-fg);font:inherit;font-size:15px;font-weight:600">Não sei o nome: tirar uma foto e o app sugere ›</button></div>'+
  lin('Código','<b style="font-variant-numeric:tabular-nums">C5</b>')+
  lin('Quantidade','<span style="display:inline-flex;align-items:center;gap:18px"><b style="font-size:20px;color:var(--mute)">−</b><b style="font-size:17px;font-variant-numeric:tabular-nums">1</b><b style="font-size:20px">+</b></span>')+
  lin('Custo','<b style="font-variant-numeric:tabular-nums">US$ 4,50</b>')+
  '<div style="color:var(--mute);font-size:13px;margin:12px 0 0">A foto fica para depois: a cor entra na fila do Estúdio.</div>'+
  '<button type="button" style="display:block;width:100%;min-height:52px;margin:20px 0 8px;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font:inherit;font-size:16px;font-weight:700">Salvar</button></div>';
 document.body.appendChild(bk);document.body.appendChild(j)}"""
def tira(pw,modo):
  b,pg,w=abre(pw)
  if modo!='hoje': pg.evaluate(PROP);w(300)
  if modo=='jan': pg.evaluate(JAN);w(500)
  f='/tmp/co_%s.png'%modo;pg.screenshot(path=f);b.close();x=Image.open(f);x.load();return x.copy()
with sync_playwright() as pw:
  q=[('HOJE · Editar produto','"Trocar foto" (câmera crua) · "Cor nova (tire a foto)"',tira(pw,'hoje')),('PROPOSTA · Cores e fotos','sem "Trocar foto" · "+ Nova cor ›"',tira(pw,'prop')),('PROPOSTA · Nova cor ›','escolher a cor; a foto fica para o Estúdio',tira(pw,'jan'))]
  g=36;w,h=q[0][2].size;S=Image.new('RGB',(g+3*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,22),t,font=F(32),fill=(235,235,240));d.text((x,66),s,font=F(21),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+w,112+h],outline=(90,90,100))
  S.save(O+'esboco_42_cores_e_fotos.jpg',quality=88);print('ok')
