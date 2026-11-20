# Janela Vídeo do Semp — onde cada toque leva (pedido do dono 20/11 13:30). Celular, escuro e claro, 5 quadros:
# 1 aberta · 2 Outro jeito (outra combinação) · 3 Música ⌄ aberta · 4 Por que estas peças ⌄ aberta · 5 Postar agora (gravando → compartilhar do celular)
import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
src=open(O+'janela.py').read()
JS3=re.search(r'JS=r"""(.*?)"""',open(O+'p3.py').read(),re.S).group(1)
LUXO=re.search(r'LUXO=r"""(.*?)"""',src,re.S).group(1)
# estados (o que muda depois do toque); tudo dentro da mesma janela
OUTRO=r"""()=>{const j=[...document.querySelectorAll('.mkCrJn')].pop();
 const q=[...j.querySelectorAll('div')].find(d=>d.textContent.trim()==='CHEGOU');q.textContent='NOVIDADE';
 const sub=[...j.querySelectorAll('small')].find(s=>/combinação nova/.test(s.textContent));sub.textContent='tendência · Óculos solar #13 · 2ª combinação do dia';
 const L=[['0–1,5 s','Gancho','a haste de perto, antes da peça inteira'],['1,5–5 s','A peça','meia volta do giro, rápida'],['5–8 s','Detalhe','a lente contra a luz'],['8–12 s','Por que comprar','proteção UV · época de sol'],['12–15 s','Preço e fechamento','G$ 60.000 · Veja no site']];
 const rows=[...j.querySelectorAll('span')].filter(s=>/^\d.*s$/.test(s.textContent.trim())).map(s=>s.parentNode);
 rows.forEach((r,i)=>{r.querySelector('b').textContent=L[i][1];r.querySelector('small').textContent=L[i][2]});
 const b=[...j.querySelectorAll('button')].find(x=>x.textContent==='Outro jeito');b.style.boxShadow='0 0 0 2px currentColor inset'}"""
def dobra(titulo,html):
  return r"""()=>{const j=[...document.querySelectorAll('.mkCrJn')].pop();const d=[...j.querySelectorAll('b')].find(b=>b.textContent.startsWith('"""+titulo+r"""')).closest('div[style*="min-height"]');
 d.querySelector('span:last-child').textContent='⌃';const box=document.createElement('div');box.innerHTML='"""+html+r"""';d.after(box);
 const c=j.querySelector('.ljCorpo');setTimeout(()=>{c.scrollTop=d.offsetTop-80;j.scrollTop=d.offsetTop-80},50)}"""
LIN="<div style=\"display:flex;align-items:center;justify-content:space-between;min-height:48px;border-bottom:1px solid var(--line2);padding-left:16px\"><span style=\"font-size:15px\">%s</span><span style=\"font-size:13px;color:var(--mute)\">%s</span></div>"
MUS=dobra('Música',''.join(LIN%x for x in [('Verão leve ✓','escolhida pelo Semp'),('Noite elegante','calma'),('Batida da cidade','rápida'),('Sem música','para pôr o áudio no Instagram')]))
LIN2="<div style=\"min-height:56px;border-bottom:1px solid var(--line2);padding:8px 0 8px 16px\"><div style=\"font-size:15px\">%s</div><div style=\"font-size:13px;color:var(--mute)\">%s</div></div>"
WHY=dobra('Por que estas peças',''.join(LIN2%x for x in [('Óculos solar #13','31 vendidas em 30 dias · época de sol'),('Óculos solar Kazwini de tr90 feminino','24 vendidas em 30 dias · época de sol'),('Óculos solar Ray-Ban de metal masculino','22 vendidas em 30 dias · época de sol')]))
POSTA=r"""()=>{window.__LF.loadMsg(true,'Gravando o vídeo (15 s)')}"""
def tira(pg,nome):
  pg.wait_for_timeout(600);f='/tmp/toq_%s.png'%nome;pg.screenshot(path=f);return Image.open(f)
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+170),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(34),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,130));d.rectangle([x-1,129,x+780,130+im.height],outline=(90,90,100))
  S.save(O+arq,quality=86);print('ok',arq,S.size)
ESTADOS=[('1 · abre por cima','tocou em Vídeo (Criar ou sugestão do Semp)',None),
 ('2 · Outro jeito','o Semp troca cenas e quadro ali mesmo',OUTRO),
 ('3 · Música ⌄','abre ali: trocar a trilha ou sem música',MUS),
 ('4 · Por que estas peças ⌄','abre ali: as 3 peças e o motivo',WHY),
 ('5 · Postar agora','grava 15 s e abre o compartilhar do celular',POSTA)]
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    for t,s,js in ESTADOS:
      b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True)
      ft=pg.evaluate("()=>{const i=document.querySelector('#v-mkt .mkSt img');return i?i.src:''}")
      pg.locator('#v-mkt button[data-cria=video]').first.click();w(1500);pg.evaluate(JS3,ft);w(200);pg.evaluate(LUXO,False);w(200)
      if js: pg.evaluate(js);w(300)
      q.append((t,s,tira(pg,t[:1]+n)));b.close()
    quadro('esboco_semp3_toques_%s.jpg'%n,esc,q)
