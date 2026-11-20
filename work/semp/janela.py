# Janela de baixo de luxo (ideia do S435, pergunta do dono 20/11 12:43–12:44) — exemplo: a janela Vídeo do Semp (parte 3).
# Hoje (janela real) × Proposta (mesma janela com o acabamento novo), celular escuro/claro + PC.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');sys.path.insert(0,'/home/claude/lafouch/work/semp')
import ap,re
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
JS3=re.search(r'JS=r"""(.*?)"""',open(O+'p3.py').read(),re.S).group(1)
LUXO=r"""(pc)=>{const j=[...document.querySelectorAll('.mkCrJn')].pop(),bk=document.querySelector('.ljBk');
// 1) fundo: a tela de trás fica desfocada, não só escura
bk.style.backdropFilter='blur(14px) saturate(120%)';bk.style.webkitBackdropFilter='blur(14px)';bk.style.background='rgba(0,0,0,.28)';
// 2) altura fixa: "grande" = sobe até 56 px do topo (no PC: painel no centro, 560 de largura)
if(pc){j.style.cssText+=';left:50%;right:auto;top:72px;bottom:auto;transform:translateX(-50%);width:560px;max-height:calc(100vh - 144px);border-radius:22px'}
else{j.style.top='56px';j.style.height='calc(100vh - 56px)';j.style.maxHeight='none'}
// 3) topo e botão: os do padrão aprovado (título à esquerda, UM botão de ação embaixo — 142d); só o 'Me lembra' deixa de ser um 2º botão
const ac=getComputedStyle(j.querySelector('#mkPost')).color;
// 4) "Me lembra" deixa de ser um 2º botão grande: vira o link rosa centralizado embaixo do botão (família Link, igual aos links do fim da ficha: "Vender no Catálogo ›")
const lm=j.querySelector('#mkLemb');const ln=document.createElement('div');
const lk=[...document.querySelectorAll('a,button,span')].find(e=>/›\s*$/.test(e.textContent)&&getComputedStyle(e).color===ac);
ln.style.cssText='text-align:center;min-height:48px;display:flex;align-items:center;justify-content:center;margin-top:8px;font-size:15px;font-weight:600;color:'+ac;
ln.textContent='Me lembrar às 20h';lm.replaceWith(ln);
// 5) legenda em linha fina (campo 149c), sem caixa
const tx=j.querySelector('#mkTx');tx.style.cssText+=';border:0;border-bottom:1px solid var(--line2);border-radius:0;background:none;padding:8px 0;min-height:120px;box-shadow:none';
const lb=document.createElement('div');lb.textContent='Legenda';lb.style.cssText='font-size:13px;color:var(--mute);margin-top:24px';tx.before(lb);
// 6) escolha de idioma leve: mesmas larguras, sem sombra
const idi=j.querySelector('#mkIdi');idi.style.cssText+=';background:none;border:1px solid var(--line2);box-shadow:none';
j.querySelectorAll('#mkIdi .trkB').forEach(b=>{b.style.flex='1'});
j.querySelector('.ljCorpo').style.padding='16px 16px 32px';
}"""
def foto(pg,nome,w,h):
  pg.wait_for_timeout(500);f='/tmp/jan_%s.png'%nome;pg.screenshot(path=f);a=Image.open(f)
  if w>500: return a
  pg.evaluate("()=>{const j=[...document.querySelectorAll('.mkCrJn')].pop();[j,j.querySelector('.ljCorpo')].forEach(e=>{e.scrollTop=e.scrollHeight})}");pg.wait_for_timeout(400)
  f2='/tmp/jan_%s_b.png'%nome;pg.screenshot(path=f2);b=Image.open(f2)
  S=Image.new('RGB',(a.width,a.height*2+40),(90,90,100));S.paste(a,(0,0));S.paste(b,(0,a.height+40));return S
def quadro(arq,esc,q,lar):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(lar+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(lar+g);d.text((x,24),t,font=F(36),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+im.width,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    for fase in ('hoje','prop'):
      b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True)
      ft=pg.evaluate("()=>{const i=document.querySelector('#v-mkt .mkSt img');return i?i.src:''}")
      pg.locator('#v-mkt button[data-cria=video]').first.click();w(1500);pg.evaluate(JS3,ft);w(300)
      if fase=='prop': pg.evaluate(LUXO,False)
      q.append(foto(pg,fase+n,390,844));b.close()
    quadro('esboco_janela_luxo_celular_%s.jpg'%n,esc,[('HOJE · acabamento atual','em cima: começo · embaixo: fim rolado',q[0]),('PROPOSTA · padrão aprovado (142d)','um botão + link · campos em linha · fundo desfocado',q[1])],780)
