# Semp · parte 2 — conversa Semp ↔ Guardião (IDEIA, fora da fila). Pendências real; Hoje × Proposta (fechada · aberta) e Histórico com filtro.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
COMUM=r"""
const v=document.getElementById('v-notif');const c0=v.querySelector('section.card');const lb0=v.querySelector('.lbl');
const card=(html,flex)=>{const s=c0.cloneNode(false);if(!flex){s.style.display='block'}s.innerHTML=html;return s};
const lbl=(t,cor)=>{const d=lb0.cloneNode(false);d.textContent=t;d.style.color=cor||'var(--mute)';return d};
const lk=(t)=>'<button type="button" class="btn-sc p" style="min-height:44px;font-weight:600;text-align:right;background:none!important;border:0!important;color:var(--accent-fg)!important;padding:0 0 0 12px!important;white-space:nowrap">'+t+'</button>';
const conv=(ls)=>'<div style="margin:8px 0 0">'+ls.map(([q,h,t])=>'<div style="padding:8px 0"><div style="font-size:13px;color:var(--mute)"><b style="color:var(--fg,inherit);font-weight:600">'+q+'</b> · '+h+'</div><div style="font-size:15px;line-height:1.4;margin-top:2px">'+t+'</div></div>').join('')+'</div>';
const C1=[['Semp','08:02','Solar polarizado está em alta: buscas no site subindo e Google subindo há 3 semanas. A distribuidora tem a US$ 4,20. Proponho comprar 12.'],
 ['Guardião','08:03','Com o dólar da loja a G$ 6.600 e o preço de venda de hoje, a margem fica boa. Mas 12 deixam a reserva de repor no limite: sugiro 10.'],
 ['Semp','08:03','De acordo: 10.']];
const dec=(aberta)=>card('<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div style="min-width:0"><b style="font-size:15px">Comprar solar polarizado · 10 un.</b><div class="hint" style="margin:2px 0 0">o Semp sugeriu · o Guardião ajustou de 12 para 10</div></div>'+lk('Pedir ›')+'</div>'+(aberta?conv(C1):'')+'<div style="font-size:15px;font-weight:600;color:var(--accent-fg);min-height:44px;display:flex;align-items:center">'+(aberta?'Fechar a conversa ⌃':'Ver a conversa ⌄')+'</div>');
const dec2=()=>card('<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div style="min-width:0"><b style="font-size:15px">Oferta do Óculos de leitura #15</b><div class="hint" style="margin:2px 0 0">o Guardião pediu · o Semp agendou sex às 20h</div></div>'+lk('Ver ›')+'</div><div style="font-size:15px;font-weight:600;color:var(--accent-fg);min-height:44px;display:flex;align-items:center">Ver a conversa ⌄</div>');
"""
PEND=r"""(aberta)=>{"""+COMUM+r"""
const ref=lb0;ref.parentNode.insertBefore(lbl('Semp e Guardião · para decidir · 2','var(--accent-fg)'),ref);
ref.parentNode.insertBefore(dec(aberta),ref);ref.parentNode.insertBefore(dec2(),ref);
ref.style.marginTop='32px'}"""
HIST=r"""(prop)=>{"""+COMUM+r"""
const h=[...v.querySelectorAll('.lbl')].find(x=>/hist/i.test(x.textContent));
if(prop){const seg=document.createElement('div');seg.setAttribute('role','tablist');seg.style.cssText='display:flex;border:1px solid var(--line2);border-radius:999px;padding:4px;margin:8px 0 8px';
 ['Tudo','Semp','Guardião'].forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.style.cssText='flex:1;min-height:40px;border:0;border-radius:999px;font:600 15px/1 inherit;color:'+(i==1?'var(--fg,#fff)':'var(--mute)')+';background:'+(i==1?'var(--line2)':'none');seg.appendChild(b)});
 h.insertAdjacentElement('afterend',seg);
 const c=card('<b style="font-size:15px">Comprar solar polarizado · 10 un.</b><div class="hint" style="margin:2px 0 0">você pediu à distribuidora · 20/11 08:10</div>'+conv(C1));
 seg.insertAdjacentElement('afterend',c);
 const c2=card('<b style="font-size:15px">Oferta do Óculos de leitura #15</b><div class="hint" style="margin:2px 0 0">agendado sex às 20h · 20/11 07:55</div>'+conv([['Guardião','07:54','Óculos de leitura #15 está parado. O degrau de oferta do preço automático já pode entrar.'],['Semp','07:55','Agendei o post da oferta para sexta às 20h, o horário em que mais gente vê.']]));
 c.insertAdjacentElement('afterend',c2);
 [...v.querySelectorAll('section.card')].filter(x=>/Margem da loja subiu/.test(x.textContent)).forEach(x=>x.remove())}
window.scrollTo(0,h.getBoundingClientRect().top+scrollY-120)}"""
def foto(pg,nome,topo):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/semp2_%s.png'%nome;pg.screenshot(path=f,full_page=True);im=Image.open(f)
  y=0 if topo else max(0,int(pg.evaluate("()=>scrollY")*2))
  return im.crop((0,y,780,min(im.height,y+1900)))
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(36),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    for fase,arg in (('hoje',None),('fechada',False),('aberta',True)):
      b,pg,w=ap.abre(pw,'notif',esc,'celular',base=True)
      if arg is not None: pg.evaluate(PEND,arg);w(300)
      q.append(foto(pg,fase+n,True));b.close()
    quadro('esboco_semp2_pendencias_%s.jpg'%n,esc,[('HOJE · Pendências','só o Guardião',q[0]),('PROPOSTA · Pendências','decisão do Semp já conferida',q[1]),('PROPOSTA · conversa aberta','⌄ abre ali mesmo',q[2])])
    q=[]
    for fase,arg in (('hhoje',False),('hprop',True)):
      b,pg,w=ap.abre(pw,'notif',esc,'celular',base=True);pg.evaluate(HIST,arg);w(400);q.append(foto(pg,fase+n,False));b.close()
    quadro('esboco_semp2_historico_%s.jpg'%n,esc,[('HOJE · Pendências › Histórico','só avisos',q[0]),('PROPOSTA · Histórico','as conversas, com filtro',q[1])])
