# Esboço 41 (S435, 21/11) — Estúdio: o que cada peça já tem, Galeria da peça (conferir frente, 3/4 e girar o giro com o dedo)
# e a câmera dizendo para QUAL peça vai a gravação. Pedidos do dono 20/11 23:36 (recado da APP).
import os,sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
exec(open('/home/claude/lafouch/work/s435/giro/hoje.py').read().split("\nif __name__=='__main__':")[0])
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/giro/'
LISTA=r"""()=>{const ov=document.querySelector('.estOv');const ST=[[1,0,0]];
 ov.querySelectorAll('.estRw').forEach((r,i)=>{const s=ST[i%ST.length];const sm=r.querySelector('small');const cor=sm.textContent.split(' · ')[0];
  const d=(ok,t)=>'<span style="display:inline-flex;align-items:center;gap:6px;margin-right:14px;color:'+(ok?'var(--fg)':'var(--mute)')+'"><i style="width:8px;height:8px;border-radius:50%;'+(ok?'background:var(--ok)':'border:1.5px solid var(--mute);box-sizing:border-box')+'"></i>'+t+'</span>';
  sm.innerHTML=cor+'<span style="display:flex;margin-top:4px">'+d(s[0],'Frente')+d(s[1],'3/4')+d(s[2],'Giro')+'</span>';
  const fi=r.querySelector('.estFi');if(fi)fi.textContent='Galeria ›'});
}"""
GAL=r"""(a)=>{const ov=document.querySelector('.estOv');const img=a.img;
 const blk=(t,corpo,lk)=>'<div class="estLbl" style="margin:24px 0 8px;display:flex;justify-content:space-between;align-items:baseline"><span>'+t+'</span>'+(lk?'<button type="button" class="estLink" style="margin:0;padding:0;min-height:44px">'+lk+'</button>':'')+'</div>'+corpo;
 const foto=(tr)=>'<div style="border-radius:14px;overflow:hidden;background:#fff;aspect-ratio:2/1;display:flex;align-items:center;justify-content:center"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain;'+(tr||'')+'"></div>';
 ov.innerHTML='<div class="estHd" style="flex-direction:column;align-items:flex-start;gap:4px"><button type="button" style="background:none;border:0;padding:0;min-height:32px;color:var(--mute);font:600 12px/1 inherit;letter-spacing:.14em;text-transform:uppercase">‹ Estúdio</button><h1>Óculos solar #13</h1></div>'+
  '<div class="estBody"><p class="estSub" style="margin:0">Preto · as fotos que vão para o site</p>'+
  blk('Frente',foto(),'Refazer ›')+
  blk('3/4','<div style="border:1.5px dashed var(--line);border-radius:14px;aspect-ratio:2/1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--mute);font-size:14px"><b style="color:var(--fg);font-size:15px">Falta a foto de 3/4</b><span>a peça virada de lado, como no site</span></div>','Tirar agora ›')+
  blk('Giro · 360°','<div style="position:relative">'+foto('transform:perspective(600px) rotateY(-50deg) scale(.9)')+
    '<div style="position:absolute;left:0;right:0;bottom:12px;display:flex;justify-content:center"><span style="background:rgba(0,0,0,.62);color:#fff;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:600">‹ arraste para girar ›</span></div></div>'+
    '<div style="height:4px;border-radius:2px;background:var(--line);margin:12px 0 0;position:relative"><i style="position:absolute;left:0;top:0;bottom:0;width:38%;background:var(--accent);border-radius:2px"></i></div>'+
    '<div style="display:flex;justify-content:space-between;color:var(--mute);font-size:13px;margin-top:8px"><span>136° de 360°</span><span>gravado hoje · 0:48</span></div>','Refazer ›')+
  '<button type="button" class="estLink" style="margin:32px auto 24px;display:block">Ver a ficha da peça ›</button></div>'}"""
def estudio(pw,modo):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True)
  pg.evaluate("()=>__LF.inicioGo('est')");w(1500)
  if modo=='lista': pg.evaluate(LISTA);w(300)
  if modo=='gal':
    im=pg.evaluate("()=>{const i=[...document.querySelectorAll('.estOv .estTh img')][3];return i&&i.src}")
    pg.evaluate(GAL,{'img':im});w(400)
  f='/tmp/es_%s.png'%modo;pg.screenshot(path=f);b.close();x=Image.open(f);x.load();return x.copy()
def camera(pw,prop):
  b,pg=abre2(pw,844,390);pg.evaluate("()=>window.__fkRot=0")
  pg.evaluate("()=>__LF.setView('estoque')");pg.wait_for_timeout(800)
  pg.evaluate("()=>{const i=[...document.querySelectorAll('.pcard img')].find(x=>/^data:image\\/svg/.test(x.src));window.__fkImg=i&&i.src}")
  pg.evaluate("()=>__LF.inicioGo('est')");pg.wait_for_timeout(1500)
  pg.evaluate("()=>{const b=document.querySelector('[data-i=\"0\"]');b&&b.click()}");pg.wait_for_timeout(5000)
  if prop:
    pg.evaluate(r"""()=>{const o=document.getElementById('estCam');const t=o.querySelector('.ecTag');
     const f=()=>{if(t.dataset.p)return;t.dataset.p=1;t.innerHTML='<span style="display:block;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6)">Giro para</span><b style="display:block;color:#fff;font-size:15px;font-weight:600;margin-top:2px;line-height:1.25">Óculos de leitura de plástico feminino</b><span style="display:block;color:rgba(255,255,255,.6);font-size:12px;margin-top:2px">Bege translúcido<br>SP60627</span>'};f();const l=o.querySelector('.ecLista');if(l)l.innerHTML=''}""")
    pg.wait_for_timeout(400)
  f='/tmp/ec_%d.png'%prop;pg.screenshot(path=f);b.close();x=Image.open(f);x.load();return x.copy()
def quadro(arq,q):
  g=36;w=max(i.width for _,_,i in q);h=max(i.height for _,_,i in q);W=g+len(q)*(w+g);S=Image.new('RGB',(W,h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,22),t,font=F(32),fill=(235,235,240));d.text((x,66),s,font=F(21),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+im.width,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
with sync_playwright() as pw:
  quadro('esboco_41a_estudio_lista.jpg',[('HOJE · Estúdio','só diz o que falta · "Ficha ›"',estudio(pw,'hoje')),('PROPOSTA · Estúdio','Frente · 3/4 · Giro em cada peça · "Galeria ›"',estudio(pw,'lista')),('PROPOSTA · Galeria ›','frente, 3/4 (aqui falta) e o giro (como o da BR44140 do teste)',estudio(pw,'gal'))])
  q=[('HOJE · câmera do giro','"Giro · volta de 360°" — não diz de qual peça',camera(pw,False)),('PROPOSTA · câmera do giro','nome, cor e código da peça antes de gravar',camera(pw,True))]
  g=40;w,h=q[0][2].size;S=Image.new('RGB',(w+2*g,2*(h+150)+g),(17,20,26));d=ImageDraw.Draw(S);y=g
  for t,s,im in q:
    d.text((g,y),t,font=F(34),fill=(235,235,240));d.text((g,y+46),s,font=F(22),fill=(140,150,165));S.paste(im,(g,y+100));d.rectangle([g-1,y+99,g+w,y+100+h],outline=(90,90,100));y+=h+150
  S.save(O+'esboco_41b_camera_para_qual_peca.jpg',quality=88);print('ok b')
