# Semp · setor RESULTADOS (Marketing › Resultados) — IDEIA (dono 20/11 15:42).
# Hoje = dobra 'Resultados' no Marketing (vazia) × Proposta vazia (o estado real de hoje) × Proposta com posts (simulado).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
SV=lambda p,s=22:'<svg width="%d" height="%d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'%(s,s)+p+'</svg>'
BAR='<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"></path>'
CICLO=['<circle cx="12" cy="12" r="9" stroke-dasharray="5 2.6"></circle><circle cx="12" cy="12" r="4.5"></circle>','<rect x="3" y="5" width="13" height="14" rx="2"></rect><path d="M16 10l5-3v10l-5-3z"></path>','<rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M4 16l4-4 4 4 3-3 5 5"></path>']
JS=r"""([cheio,BAR,IC,BIG])=>{const v=document.getElementById('v-mkt');const R=getComputedStyle(v.querySelector('.mkSec')).color;
 const top=v.querySelector('.top');top.querySelector('h1').textContent='Resultados';const cr=v.querySelector('.nvVs');
 const L='display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:56px;border-bottom:1px solid var(--line2)';
 const num=(t,s,n,c)=>'<div style="'+L+'"><div><b style="font-size:15px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></div><span style="font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;color:'+(c||'inherit')+'">'+n+'</span></div>';
 const post=(ic,t,s,n)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="width:22px;flex:none;display:flex;color:'+R+'">'+ic+'</span><div style="min-width:0;flex:1"><b style="font-size:16px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small></div><span style="flex:none;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums">'+n+'</span></div>';
 const tit=t=>'<div class="mkSec" style="margin:32px 0 8px">'+t+'</div>';
 const ig='<div style="'+L+';margin-top:24px"><div><b style="font-size:15px;font-weight:500;display:block">Conta do Instagram</b><small style="font-size:13px;color:var(--mute)">o Semp aprende com o alcance</small></div><span style="flex:none;white-space:nowrap;font-size:15px;font-weight:600;color:'+R+'">Conectar ›</span></div>';
 let h='<div style="font-size:13px;color:var(--mute);margin:4px 0 0">o Semp mede as vendas 2 dias depois de cada post</div>';
 if(!cheio){h+='<div style="text-align:center;padding:48px 16px 16px"><span style="display:inline-flex;color:'+R+'">'+BIG+'</span><div style="font-size:17px;font-weight:600;margin-top:16px">Ainda sem resultados</div><div style="font-size:14px;color:var(--mute);margin-top:8px;line-height:1.45">Poste pelo app. Dois dias depois o Semp mostra aqui o que cada post vendeu.</div></div>'+ig}
 else{h+=tit('Este mês')+num('Posts feitos','pelo app','9')+num('Vendeu por causa dos posts','peças dos posts, até 2 dias depois','G$ 1.140.000','var(--ok,#3fb27f)')+num('Melhor formato','mais vendas por post','Vídeo')+
  tit('O que o Semp aprendeu')+'<div style="'+L+'"><div><b style="font-size:15px;font-weight:500;display:block">Vídeo às 20h vende 3× mais que post</b><small style="font-size:13px;color:var(--mute)">a Agenda já usa isso</small></div></div>'+
  tit('Posts · do melhor para o pior')+post(IC[1],'Vídeo · Óculos solar #13','sex 14/11 · 4 vendas · 6 pedidos','G$ 480.000')+post(IC[0],'Story · Óculos solar Kazwini','qua 12/11 · 3 vendas','G$ 360.000')+post(IC[2],'Post · Óculos de leitura #15','seg 10/11 · 1 venda','G$ 60.000')+ig}
 const box=document.createElement('div');box.innerHTML=h;
 [...v.children].forEach(e=>{if(e!==top&&e!==cr&&!e.contains(top))e.remove()});top.after(box)}"""
def tira(pg,nome,sel=None):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/rs_%s.png'%nome;pg.screenshot(path=f,full_page=True);im=Image.open(f)
  y=0
  if sel: y=int(pg.evaluate("s=>{const d=[...document.querySelectorAll('#v-mkt details.mkDt')].find(x=>/Resultados/.test(x.textContent));return Math.max(0,(d.getBoundingClientRect().top+scrollY-200)*2)}",sel))
  return im.crop((0,y,780,min(im.height,y+1700)))
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(34),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True);pg.evaluate("()=>{const d=[...document.querySelectorAll('#v-mkt details.mkDt')].find(x=>/Resultados/.test(x.textContent));d.open=true}");w(300)
    q.append(('HOJE · dobra no Marketing','vazia, uma frase',tira(pg,'h'+n,'r')));b.close()
    for cheio,t,s in ((False,'PROPOSTA · hoje (sem posts)','tela vazia: ícone + frase + explicação'),(True,'PROPOSTA · com posts','números do mês · o que aprendeu · posts')):
      b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True);pg.evaluate(JS,[cheio,BAR,[SV(c) for c in CICLO],SV(BAR,40)]);w(300);q.append((t,s,tira(pg,('c' if cheio else 'v')+n)));b.close()
    quadro('esboco_semp_resultados_%s.jpg'%n,esc,q)
