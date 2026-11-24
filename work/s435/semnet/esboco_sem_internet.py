# ESBOÇO · estado "sem internet" do app (ESBOCO, 24/11/2026; pedido do dono 10:44) — regra 17: um estado igual em todo lugar
# Base: app real + gabarito aprovado (base_app); Hoje = sem internet como está; Proposta = o estado único por cima.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
import json,os
sys.path.insert(0,'/home/claude/lafouch/work/titan');import compara
MOLDE={}  # molde do aprovado (parte 1b do Titan): as peças medidas de cada tela da proposta — o gabarito sem remendo
ICO='<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18z"/><path d="M4 4l16 16"/></svg>'
FAIXA=r"""(ok)=>{document.getElementById('esbNet')&&document.getElementById('esbNet').remove();const t=document.querySelector('.top');const d=document.createElement('div');d.id='esbNet';
 d.style.cssText='display:flex;align-items:center;gap:8px;margin:0 24px;height:40px;white-space:nowrap;overflow:hidden;border-bottom:1px solid var(--line);font:400 13px/1 inherit;color:var(--mute)';
 d.innerHTML=ok?'<i style="width:8px;height:8px;border-radius:50%;background:var(--ok);flex:none"></i><b style="font-weight:600;color:var(--fg)">Internet de volta</b><span>· tudo salvo</span>'
 :'<i style="width:8px;height:8px;border-radius:50%;background:var(--atencao-pt,#e0ac00);flex:none"></i><b style="font-weight:600;color:var(--fg)">Sem internet</b><span>· tudo fica salvo</span>';
 t.after(d)}"""
VAZIO=r"""(a)=>{const [txt,exp,ico]=a;const v=document.querySelector('.view:not([hidden])');
 // usa a TELA VAZIA DA FAMÍLIA que já está na tela (mesma cor, letra e espaço): troca só o desenho e os textos
 const tit=[...v.querySelectorAll('b,strong,h3,div,span')].find(e=>e.children.length==0&&/^(Nenhum pedido ainda|Nenhuma mensagem|Sem conexão com a nuvem agora\.?)$/.test(e.textContent.trim())&&e.getBoundingClientRect().height);
 if(!tit)return 0;let bloco=tit.parentElement;while(bloco&&!bloco.querySelector('svg')&&bloco!==v)bloco=bloco.parentElement;
 const sv=bloco&&bloco.querySelector('svg');if(sv){const n=document.createElement('div');n.innerHTML=ico;const s2=n.firstChild;s2.setAttribute('width',sv.getAttribute('width')||56);s2.setAttribute('height',sv.getAttribute('height')||56);s2.setAttribute('stroke-width',sv.getAttribute('stroke-width')||'1.6');s2.setAttribute('class',sv.getAttribute('class')||'');const op=sv.querySelector('path,line,polyline,rect,circle');s2.querySelectorAll('path').forEach(p=>{if(op&&op.getAttribute('pathLength'))p.setAttribute('pathLength',op.getAttribute('pathLength'));if(op&&op.getAttribute('class'))p.setAttribute('class',op.getAttribute('class'));p.style.fill='none';p.style.stroke='currentColor';p.style.strokeWidth=op?getComputedStyle(op).strokeWidth:'1.2px'});s2.style.color=getComputedStyle(sv).color;sv.replaceWith(s2)}
 tit.textContent=txt;const ex=[...bloco.querySelectorAll('*')].find(e=>e!==tit&&e.children.length==0&&e.textContent.trim().length>20);if(ex)ex.textContent=exp;return 1}"""
TELAS=[('inicio',None,None,'Início'),('ped',"()=>__LF.inicioGo('ped')",('Sem internet agora','Os pedidos do site aparecem aqui quando a internet voltar.'),'Pedidos online'),
       ('ata',"()=>__LF.inicioGo('ata')",('Sem internet agora','As mensagens dos lojistas aparecem aqui quando a internet voltar.'),'Atacado')]
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',30);f2=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
def foto(pw,esc,js,prop,vazio,ok=False):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);w(700)
  pg.context.set_offline(True);pg.evaluate("()=>window.dispatchEvent(new Event('offline'))")
  if js:pg.evaluate(js);w(1000)
  if prop:
    pg.evaluate(FAIXA,ok)
    if vazio:pg.evaluate(VAZIO,[vazio[0],vazio[1],ICO])
  w(2600)
  if prop:MOLDE['%s|%s|%s'%(js or 'inicio','escuro' if esc else 'claro','voltou' if ok else 'sem')]=list(compara.pecas(pg).values())
  f='/tmp/sn.png';pg.screenshot(path=f);b.close();return Image.open(f).convert('RGB')
with sync_playwright() as pw:
  for esc in (True,False):
    for k,js,vz,nome in TELAS:
      q=[('HOJE · '+nome,'sem internet: nada avisa',foto(pw,esc,js,False,None)),('PROPOSTA · '+nome,'faixa única "Sem internet"' + (' + tela vazia da família' if vz else ''),foto(pw,esc,js,True,vz))]
      if k=='inicio':q.append(('PROPOSTA · internet voltou','a mesma faixa, verde, sai sozinha em 3 s',foto(pw,esc,js,True,None,True)))
      W=sum(i.width for _,_,i in q)+40*(len(q)+1);H=q[0][2].height+130
      o=Image.new('RGB',(W,H),(17,20,26) if esc else (236,232,236));d=ImageDraw.Draw(o);x=40
      for t,s,i in q:
        d.text((x,24),t,font=F,fill=(235,235,240) if esc else (30,26,34));d.text((x,66),s,font=f2,fill=(150,160,175));o.paste(i,(x,110));x+=i.width+40
      o.save('esboco_sem_internet_%s_%s.jpg'%(k,'escuro' if esc else 'claro'),quality=84)
d='/home/claude/lafouch/work/titan/moldes/107-sem-internet';os.makedirs(d,exist_ok=True);json.dump(MOLDE,open(d+'/molde.json','w'),ensure_ascii=False)
print('ok',len(MOLDE))
