# Esboço 41c (S435, 21/11) — correção do dono 07:54: o giro sempre grava; sem cadastro vai para a Galeria do app ("sem peça");
# no cadastro do Inventário escolhe-se da Galeria do app. A Galeria é do app, não do celular.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
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
CARD=r"""const card=(img,t,s,b360)=>'<button type="button" class="ad41c" style="position:relative;display:flex;flex-direction:column;align-items:stretch;gap:0;padding:6px;border-radius:14px;border:1px solid var(--line);background:var(--panel);text-align:left;color:var(--fg);font:inherit"><span style="display:block;border-radius:10px;overflow:hidden;background:#fff;aspect-ratio:16/10"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain"></span>'+(b360?'<span style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,.62);color:#fff;border-radius:999px;padding:3px 8px;font-size:11px;font-weight:700">360°</span>':'')+'<b style="font-size:14px;margin:8px 6px 0">'+t+'</b><small style="font-size:12px;color:var(--mute);margin:2px 6px 4px">'+s+'</small></button>';"""
def imgs(pg):
  return pg.evaluate("()=>[...document.querySelectorAll('.pcard img, .estTh img')].map(i=>i.src).filter(s=>/^data:image\\/svg/.test(s)).slice(0,6)")
def estudio(pw,modo):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);I=imgs(pg)
  pg.evaluate("()=>__LF.inicioGo('est')");w(1500)
  R=pg.evaluate("()=>[...document.querySelectorAll('.estOv .estIt')].map(b=>[b.querySelector('img').src,b.dataset.ref,b.dataset.cor.split(' ')[0]])")
  if modo=='link':
    pg.evaluate(LISTA)
    pg.evaluate(r"""()=>{const n=document.querySelector('.estOv [data-e=nova]');const l=n.cloneNode(false);l.removeAttribute('data-e');l.textContent='Galeria do app · 2 sem peça ›';n.after(l)}""")
  if modo=='gal':
    pg.evaluate(r"""(A)=>{const I=A.I;"""+CARD+r"""const ov=document.querySelector('.estOv');
     const grade=h=>'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">'+h+'</div>';
     const R=A.R;ov.innerHTML='<div class="estHd" style="flex-direction:column;align-items:flex-start;gap:4px"><button type="button" style="background:none;border:0;padding:0;min-height:32px;color:var(--mute);font:600 12px/1 inherit;letter-spacing:.14em;text-transform:uppercase">‹ Estúdio</button><h1>Galeria</h1></div><div class="estBody"><p class="estSub" style="margin:0">Giros e fotos guardados no app.</p>'+
      '<div class="estLbl estLbl2" style="margin-top:24px"><span>Sem peça · 2</span></div><p style="color:var(--mute);font-size:13px;margin:4px 0 8px">Cadastre a peça no Inventário e escolha daqui.</p>'+grade(card(I[3],'Giro','hoje 07:30',1)+card(I[1],'Giro','hoje 07:22',1))+
      '<div class="estLbl estLbl2" style="margin-top:24px"><span>Com peça · 24</span></div>'+grade(R.slice(0,6).map(r=>card(r[0],r[1],r[2],0)).join(''))+'</div>'}""",{'I':I,'R':R})
  w(400);f='/tmp/41c_%s.png'%modo;pg.screenshot(path=f);b.close();x=Image.open(f);x.load();return x.copy()
def adicionar(pw,prop):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);I=imgs(pg)
  pg.evaluate("()=>{const b=document.querySelector('button[aria-label=\"Adicionar\"]');b&&b.click()}");w(1500)
  if prop:
    pg.evaluate(r"""(I)=>{"""+CARD+r"""const lb=[...document.querySelectorAll('body *')].filter(e=>/^dar entrada de novo$/i.test((e.textContent||'').trim())&&e.getBoundingClientRect().height).pop();
     const d=document.createElement('div');d.innerHTML='<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:0 0 8px">Da Galeria · sem peça · 2</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:24px">'+card(I[3],'Giro','hoje 07:30',1)+card(I[1],'Giro','hoje 07:22',1)+'</div>';
     lb.parentNode.insertBefore(d,lb)}""",I)
  w(400);f='/tmp/41c_add%d.png'%prop;pg.screenshot(path=f);b.close();x=Image.open(f);x.load();return x.copy()
def camera(pw):
  b,pg=abre2(pw,844,390);pg.evaluate("()=>window.__fkRot=0")
  pg.evaluate("()=>__LF.setView('estoque')");pg.wait_for_timeout(800)
  pg.evaluate("()=>{const i=[...document.querySelectorAll('.pcard img')].find(x=>/^data:image\\/svg/.test(x.src));window.__fkImg=i&&i.src}")
  pg.evaluate("()=>__LF.inicioGo('est')");pg.wait_for_timeout(1500)
  pg.evaluate("()=>{const b=document.querySelector('[data-i=\"0\"]');b&&b.click()}");pg.wait_for_timeout(5000)
  pg.evaluate(r"""()=>{const o=document.getElementById('estCam');const t=o.querySelector('.ecTag');t.innerHTML='<span style="display:block;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6)">Giro sem peça</span><b style="display:block;color:#fff;font-size:15px;font-weight:600;margin-top:2px;line-height:1.25">Vai para a Galeria do app</b>';const st=document.createElement('style');st.textContent='#estCam .ecLista{gap:0!important}#estCam .ecLista span{font-size:13px!important;line-height:1.25!important;min-height:0!important}#estCam .ecFrase{font-size:14px!important}';o.appendChild(st);const zz=()=>{const L=o.querySelector('.ecLista'),Fr=o.querySelector('.ecFrase');if(L){L.style.setProperty('font-size','12.5px','important');L.style.setProperty('line-height','16px','important');L.style.setProperty('gap','2px','important')}if(Fr){const tn=[...Fr.childNodes].filter(n=>n.nodeType==3||n.tagName=='B'||n.tagName=='SPAN').pop();if(tn&&tn.textContent!=='Falta luz: aumente a luz da caixa')tn.textContent='Falta luz: aumente a luz da caixa'}};zz();setInterval(zz,200);const l=o.querySelector('.ecLista');if(l)l.innerHTML='';const f=()=>{const l=o.querySelector('.ecLista');if(!l)return;const sp=[...l.children];if(sp[0]&&/Celular deitado/.test(sp[0].textContent)){sp[0].lastChild.textContent='Câmera reta';const n=sp[3].cloneNode(true);n.lastChild.textContent='Peça reta';sp[3].after(n)}};new MutationObserver(f).observe(o,{subtree:true,childList:true})}""")
  pg.wait_for_timeout(900);f='/tmp/41c_cam.png';pg.screenshot(path=f);b.close();x=Image.open(f);x.load();return x.copy()
with sync_playwright() as pw:
  q=[('PROPOSTA · Estúdio','"Galeria do app · 2 sem peça ›"',estudio(pw,'link')),('PROPOSTA · Galeria do app','sem peça primeiro · depois as de cada peça',estudio(pw,'gal')),('PROPOSTA · Inventário › Adicionar','escolher da Galeria → cadastro com o giro',adicionar(pw,True))]
  g=36;w,h=q[0][2].size;S=Image.new('RGB',(g+3*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,22),t,font=F(32),fill=(235,235,240));d.text((x,66),s,font=F(21),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+w,112+h],outline=(90,90,100))
  S.save(O+'esboco_41c_galeria_do_app.jpg',quality=88);print('ok a')
  im=camera(pw);g=40;S=Image.new('RGB',(im.width+2*g,im.height+150),(17,20,26));d=ImageDraw.Draw(S)
  d.text((g,24),'PROPOSTA · câmera do giro, peça sem cadastro',font=F(34),fill=(235,235,240));d.text((g,70),'grava sempre · vai para a Galeria do app',font=F(22),fill=(140,150,165));S.paste(im,(g,110))
  S.save(O+'esboco_41c_camera_sem_cadastro.jpg',quality=88);print('ok b')
