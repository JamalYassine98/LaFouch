# Janela Vídeo do Semp — tocar no vídeo abre em TELA CHEIA, como story (pedido do dono 20/11 13:43–13:47).
# Celular, escuro e claro: 1 janela (toca no vídeo) · 2 tela cheia tocando (barra de tempo, som, Postar agora) · 3 fechou: volta ao quadro.
import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
JS3=re.search(r'JS=r"""(.*?)"""',open(O+'p3.py').read(),re.S).group(1)
LUXO=re.search(r'LUXO=r"""(.*?)"""',open(O+'janela.py').read(),re.S).group(1)
TOQUE=r"""()=>{const j=[...document.querySelectorAll('.mkCrJn')].pop();const q=[...j.querySelectorAll('svg path')].find(p=>p.getAttribute('d')==='M7 4l13 8-13 8z').closest('span');
 const r=q.getBoundingClientRect();const m=document.createElement('div');m.style.cssText='position:fixed;left:'+(r.left+r.width/2-30)+'px;top:'+(r.top+r.height/2-30)+'px;width:60px;height:60px;border-radius:50%;background:rgba(243,192,220,.35);box-shadow:0 0 0 2px rgba(243,192,220,.8);z-index:99999;pointer-events:none';document.body.appendChild(m)}"""
CHEIA=r"""(foto)=>{const j=[...document.querySelectorAll('.mkCrJn')].pop();const ac='#f3c0dc';
 const t=document.createElement('div');t.style.cssText='position:fixed;inset:0;z-index:99999;background:linear-gradient(180deg,#2a1f26,#0f0c0e);color:#fff;font-family:inherit';
 t.innerHTML=
 // barra de tempo no topo (5 partes do roteiro), som e alça para fechar
 '<div style="position:absolute;top:12px;left:16px;right:16px;display:flex;gap:4px">'+[1,1,.45,0,0].map(p=>'<span style="flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.28);overflow:hidden"><i style="display:block;height:100%;width:'+(p*100)+'%;background:#fff"></i></span>').join('')+'</div>'+
 '<div style="position:absolute;top:28px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:rgba(255,255,255,.8)"><span>Detalhe · 6 de 15 s</span><span style="display:flex;align-items:center;gap:6px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M3 10v4h3l7 5V5L6 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>Verão leve</span></div>'+
 // o comercial em tela cheia (quadro do momento: Detalhe — a haste de perto)
 '<div style="position:absolute;top:96px;left:0;right:0;text-align:center;font:600 26px/1 Georgia,serif;letter-spacing:.24em;color:#f3c0dc">CHEGOU</div>'+
 '<img src="'+foto+'" style="position:absolute;left:24px;right:24px;top:220px;width:calc(100% - 48px);height:240px;object-fit:contain;background:#fff;border-radius:16px">'+
 '<div style="position:absolute;top:500px;left:0;right:0;text-align:center;font-size:34px;font-weight:700;line-height:1">G$ 60.000</div>'+
 '<div style="position:absolute;top:552px;left:0;right:0;text-align:center;font:500 15px/1 Georgia,serif;letter-spacing:.24em;color:#f3c0dc">LA FOUCH</div>'+
 // embaixo: a mesma ação da janela
 '<div style="position:absolute;left:16px;right:16px;bottom:32px"><div style="text-align:center;font-size:13px;color:rgba(255,255,255,.7);margin-bottom:16px">toque para pausar · arraste para baixo para voltar</div>'+
 '<div style="min-height:52px;border-radius:999px;border:1px solid '+ac+';display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:600;color:'+ac+';background:rgba(0,0,0,.25)">Postar agora</div></div>';
 document.body.appendChild(t)}"""
def tira(pg,nome):
  pg.wait_for_timeout(500);f='/tmp/tc_%s.png'%nome;pg.screenshot(path=f);return Image.open(f)
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+170),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(34),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,130));d.rectangle([x-1,129,x+780,130+im.height],outline=(90,90,100))
  S.save(O+arq,quality=86);print('ok',arq,S.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    for i,(t,s) in enumerate([('1 · toca no vídeo','o quadro da janela'),('2 · tela cheia, como story','vê o comercial como o cliente vê'),('3 · arrastou para baixo','volta ao quadro, na mesma janela')]):
      b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True)
      ft=pg.evaluate("()=>{const i=document.querySelector('#v-mkt .mkSt img');return i?i.src:''}")
      pg.locator('#v-mkt button[data-cria=video]').first.click();w(1500);pg.evaluate(JS3,ft);w(200);pg.evaluate(LUXO,False);w(200)
      if i==0: pg.evaluate(TOQUE)
      if i==1: pg.evaluate(CHEIA,ft)
      q.append((t,s,tira(pg,str(i)+n)));b.close()
    quadro('esboco_semp3_telacheia_%s.jpg'%n,esc,q)
