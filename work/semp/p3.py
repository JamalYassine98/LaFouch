# Semp · parte 3 — gerador de vídeos (IDEIA, fora da fila). Janela "Vídeo" real do Marketing; Hoje × Proposta, escuro e claro.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
JS=r"""(foto)=>{const j=[...document.querySelectorAll('.mkCrJn')].pop();const C=j.querySelector('.ljCorpo');
const lb=getComputedStyle(j.querySelector('.mkWhy b')).color;
const L='display:flex;align-items:center;gap:16px;min-height:56px;border-bottom:1px solid var(--line2)';
const wb=getComputedStyle(j.querySelector('.mkWhy b'));const sec=t=>'<div style="font-size:'+wb.fontSize+';font-weight:'+wb.fontWeight+';color:'+lb+';margin:24px 0 8px">'+t+'</div>';
const lin=(a,t,s)=>'<div style="'+L+'"><span style="width:56px;flex:none;font-size:13px;color:var(--mute);font-variant-numeric:tabular-nums">'+a+'</span><div style="min-width:0;flex:1"><b style="font-size:15px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small></div></div>';
const dob=(t,s)=>'<div style="'+L+'"><div style="min-width:0;flex:1"><b style="font-size:15px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small></div><span style="color:var(--mute);font-size:18px">⌄</span></div>';
const quadro='<div style="width:128px;height:228px;flex:none;border-radius:12px;overflow:hidden;position:relative;background:linear-gradient(180deg,#2a1f26,#0f0c0e);box-shadow:0 0 0 1px var(--line2)">'+
 '<div style="position:absolute;top:18px;left:0;right:0;text-align:center;font:600 13px/1 Georgia,serif;letter-spacing:.2em;color:#f3c0dc">CHEGOU</div>'+
 '<img src="'+foto+'" style="position:absolute;left:8px;right:8px;top:70px;width:112px;height:72px;object-fit:contain;background:#fff;border-radius:6px">'+
 '<div style="position:absolute;bottom:26px;left:0;right:0;text-align:center;font:700 15px/1 inherit;color:#fff">G$ 60.000</div>'+
 '<div style="position:absolute;bottom:10px;left:0;right:0;text-align:center;font:500 10px/1 Georgia,serif;letter-spacing:.18em;color:#f3c0dc">LA FOUCH</div>'+
 '<div style="position:absolute;top:148px;left:0;right:0;display:flex;justify-content:center"><span style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M7 4l13 8-13 8z"/></svg></span></div></div>';
const topo='<div style="display:flex;gap:16px;align-items:flex-start">'+quadro+'<div style="min-width:0;flex:1;padding-top:4px"><b style="font-size:16px;font-weight:600;display:block">Comercial de 15 s</b><small style="font-size:13px;color:var(--mute);display:block;margin-top:4px">tendência · Óculos solar #13</small><small style="font-size:13px;color:var(--mute);display:block;margin-top:8px">diferente dos últimos 30 vídeos</small><button type="button" class="mini" style="margin-top:16px;width:100%">Outro jeito</button></div></div>';
const rot=sec('Roteiro do Semp')+
 lin('0–1,5 s','Gancho','giro rápido e "Chegou"')+
 lin('1,5–5 s','A peça','volta inteira do giro 360°, devagar')+
 lin('5–8 s','Detalhe','a haste de perto, cortada do giro')+
 lin('8–12 s','Por que comprar','em alta: 31 vendidas em 30 dias')+
 lin('12–15 s','Preço e fechamento','G$ 60.000 · Veja no site');
const mus=dob('Música · trilha livre do app','cortes no ritmo · sai também sem música');
const why=dob('Por que estas peças','Óculos solar #13 · Kazwini · Ray-Ban de metal');
// saem: Elegante|Rápido|Oferta (o Semp escolhe) e Versão A|B (vira "Outro jeito"); "Por que estas peças" vira dobra
j.querySelector('#mkEsl').nextElementSibling.remove();j.querySelector('#mkEsl').remove();
j.querySelector('#mkVer').remove();j.querySelector('.mkWhy').remove();
const box=document.createElement('div');box.innerHTML=topo+rot+mus+why;C.insertBefore(box,C.firstChild);
const ml=j.querySelector('.mkLin');ml.style.marginTop='24px';
const idi=j.querySelector('#mkIdi');idi.style.width='100%';idi.style.flex='1';
}"""
def foto(pg,nome):
  pg.wait_for_timeout(300);f='/tmp/semp3_%s.png'%nome;pg.screenshot(path=f);
  return Image.open(f).crop((0,0,780,1688))
def tela_cheia(pg,nome):
  h=pg.evaluate("()=>{const j=[...document.querySelectorAll('.mkCrJn')].pop();j.style.maxHeight='none';j.style.height='auto';const c=j.querySelector('.ljCorpo');c.style.maxHeight='none';c.style.overflow='visible';return Math.ceil(j.scrollHeight+(document.querySelector('#v-mkt .nvVs')||{getBoundingClientRect:()=>({bottom:140})}).getBoundingClientRect().bottom+20)}")
  pg.set_viewport_size({'width':390,'height':max(844,h+20)});pg.wait_for_timeout(600)
  print(nome,h,pg.evaluate("()=>Math.round([...document.querySelectorAll('.mkCrJn')].pop().getBoundingClientRect().top)"))
  f='/tmp/semp3_%s.png'%nome;pg.screenshot(path=f);return Image.open(f)
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
      ft=pg.evaluate("()=>{const i=document.querySelector('#v-mkt .mkSt img');return i?i.src:''}")
      pg.locator('#v-mkt button[data-cria=video]').first.click();w(1500)
      if fase=='prop': pg.evaluate(JS,ft);w(400)
      q.append(tela_cheia(pg,fase+n));b.close()
    quadro('esboco_semp3_video_%s.jpg'%n,esc,[('HOJE · Marketing › Vídeo','você escolhe o estilo e a versão',q[0]),('PROPOSTA · Vídeo do Semp','roteiro de comercial · nunca repete',q[1])])
