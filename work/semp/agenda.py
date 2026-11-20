# Semp · setor AGENDA (Marketing › Agenda) — IDEIA, fora da fila (pedido do dono 20/11 15:16).
# Hoje = onde a agenda mora hoje (Marketing › Plano da semana + Datas que vêm aí) × Proposta = tela própria "Agenda", feita pelo Semp.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
# por que o Semp pôs cada post (um motivo por linha; as peças e horários são os reais do plano)
POR={'post|YS8801':'Óculos solar #13 · em alta','status|SL2210':'Óculos solar Kazwini · tendência','carr|SL2201,YS8815,SP57765,SP58110':'4 peças do foco do mês','story|SP61200':'Óculos de leitura #15 · chegou','video|SP60627,BR44118,BR44120':'3 peças · comercial de 15 s','post|SP59002':'Leitura de acetato · oferta do Guardião'}
JS=r"""(POR)=>{const v=document.getElementById('v-mkt');const secs=[...v.querySelectorAll('.mkSec')];const R=getComputedStyle(secs[0]).color;
 const top=v.querySelector('.top');top.querySelector('h1').textContent='Agenda';
 const cr=v.querySelector('.nvVs');cr.lastChild.textContent='Marketing';
 // + redondo ao lado do título (regra 15): pôr um post à mão
 top.style.cssText+=';display:flex;align-items:center;justify-content:space-between';
 const mais=document.createElement('button');mais.type='button';mais.setAttribute('aria-label','Pôr um post');mais.style.cssText='width:44px;height:44px;border-radius:50%;border:1px solid var(--line2);background:none;color:inherit;font-size:24px;line-height:1;display:flex;align-items:center;justify-content:center';mais.textContent='+';top.appendChild(mais);
 const pis=[...v.querySelectorAll('.mkPi')];const feitos=v.querySelectorAll('.mkPi .mkCk.on').length;
 pis.forEach(p=>{const b=p.querySelector('.mkPb');const k=b.dataset.cria+'|'+b.dataset.refs;const s=b.querySelector('small');s.textContent=POR[k]||s.textContent;
  });
 const dts=[...(v.querySelector('.split')||{querySelectorAll:()=>[]}).querySelectorAll('.sl')].map(x=>x.outerHTML).join('');
 const tit=(t)=>'<div class="mkSec" style="margin:32px 0 8px">'+t+'</div>';
 const hint='<div style="font-size:13px;color:var(--mute);margin:4px 0 0">o Semp monta toda segunda · conferido com o Guardião</div>';
 const box=document.createElement('div');
 box.innerHTML=hint+tit('Esta semana · '+feitos+' de '+pis.length+' feitos');
 pis.forEach(p=>box.appendChild(p));
 const dob=document.createElement('div');dob.innerHTML=tit('Datas que vêm aí')+'<div class="split">'+dts+'</div>'+
  '<div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;border-bottom:1px solid var(--line2);margin-top:24px"><div><b style="font-size:16px;font-weight:500;display:block">Próxima semana</b><small style="font-size:13px;color:var(--mute)">o Semp monta na segunda, 24/11</small></div><span style="color:var(--mute);font-size:18px">⌄</span></div>';
 [...v.children].forEach(e=>{if(e!==top&&e!==cr&&!e.contains(top))e.remove()});
 top.after(box);box.after(dob)}"""
def tira(pg,nome):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/ag_%s.png'%nome;pg.screenshot(path=f,full_page=True);im=Image.open(f);return im.crop((0,0,780,im.height))
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(36),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    for fase in ('hoje','prop'):
      b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True)
      if fase=='hoje':
        pg.evaluate("()=>{const s=[...document.querySelectorAll('#v-mkt .mkSec')].find(x=>/plano/i.test(x.textContent));window.scrollTo(0,s.getBoundingClientRect().top+scrollY-140)}")
        pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');w(300);f='/tmp/ag_h%s.png'%n;pg.screenshot(path=f,full_page=True)
        y=int(pg.evaluate("()=>scrollY")*2);im=Image.open(f);im=im.crop((0,y,780,min(im.height,y+1900)))
      else:
        pg.evaluate(JS,POR);w(400);im=tira(pg,fase+n)
      q.append(im);b.close()
    quadro('esboco_semp_agenda_%s.jpg'%n,esc,[('HOJE · dentro do Marketing','Plano da semana + Datas',q[0]),('PROPOSTA · Marketing › Agenda','tela própria, feita pelo Semp',q[1])])
