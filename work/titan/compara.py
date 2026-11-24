# TITAN · comparador peça por peça (ESBOCO, 24/11/2026; aprovado pelo dono 07:40 — substitui a comparação foto × foto no app)
# Abre a MESMA tela duas vezes, ao vivo: o app real e o app "como foi aprovado" (gabarito), e compara cada peça:
# posição, tamanho, letra, cor, fundo, borda. Diz o que falta, o que sobra e o que está diferente, com quantos px.
import sys,json
sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from PIL import Image,ImageDraw,ImageFont
PECAS=r"""()=>{
 const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2||r.bottom<0||r.top>innerHeight)return false;const c=getComputedStyle(e);return c.visibility!='hidden'&&+c.opacity>0.05};
 const own=e=>[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim();
 const out=[],cont={};
 for(const e of document.querySelectorAll('body *')){
  if(!vis(e))continue;const t=own(e);const tag=e.tagName.toLowerCase();
  const peca=t||tag=='svg'||tag=='img'||tag=='input'||tag=='textarea'||tag=='select';
  const caixa=!t&&(()=>{const c=getComputedStyle(e);return (c.borderTopWidth!='0px'&&c.borderTopStyle!='none')||(c.backgroundColor!='rgba(0, 0, 0, 0)'&&c.backgroundColor!='transparent')})();
  if(!peca&&!caixa)continue;
  if(tag!='svg'&&e.closest('svg'))continue;
  const r=e.getBoundingClientRect(),c=getComputedStyle(e);
  let viz='';if(!t){let p=e.parentElement;for(let i=0;i<3&&p&&!viz;i++){viz=(p.textContent||'').replace(/\s+/g,' ').trim().slice(0,24);p=p.parentElement}}
  const nome=(t||(e.getAttribute('aria-label')||'')||(tag+(viz?' ~'+viz:''))).slice(0,48);
  const k=(caixa?'□':'')+tag+'|'+nome;cont[k]=(cont[k]||0)+1;
  out.push({k:k+'#'+cont[k],nome,tag,x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),
   fs:c.fontSize,fw:c.fontWeight,ff:c.fontFamily.split(',')[0].replace(/"/g,''),cor:c.color,fundo:c.backgroundColor,borda:c.borderTopWidth+' '+c.borderTopColor,raio:c.borderTopLeftRadius,caixa});
 }
 return out}"""
ESTILO=['fs','fw','ff','cor','fundo','borda','raio']
def pecas(pg):return {p['k']:p for p in pg.evaluate(PECAS)}
def diferencas(real,gab,tol=2):
  D=[];dy0=0
  for k,g in sorted(gab.items(),key=lambda kv:(kv[1]['y'],kv[1]['x'])):
    if k not in real:D.append(('falta',k,g,None,''));continue
    r=real[k];m=[];dy=r['y']-g['y']
    for a in ('x','w','h'):
      if abs(r[a]-g[a])>tol:m.append('%s %d→%d'%(a,r[a],g[a]))
    if abs(dy-dy0)>tol:m.append('y %d→%d (desloca %+d)'%(r['y'],g['y'],dy0-dy))
    dy0=dy
    for a in ESTILO:
      if r[a]!=g[a]:m.append('%s %s→%s'%(a,r[a],g[a]))
    if m:D.append(('muda',k,g,r,'; '.join(m)))
  for k,r in real.items():
    if k not in gab:D.append(('sobra',k,None,r,''))
  return D
def relatorio(nome,imr,img,D,out):
  # imagem: HOJE (real) | APROVADO (gabarito), diferenças marcadas em vermelho
  W,H=imr.size;o=Image.new('RGB',(W*2+60,H+70),(24,26,32));o.paste(imr,(20,60));o.paste(img,(W+40,60))
  d=ImageDraw.Draw(o);F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',26)
  d.text((20,16),'HOJE · '+nome,font=F,fill=(235,235,240));d.text((W+40,16),'APROVADO (gabarito)',font=F,fill=(235,235,240))
  s=imr.size[0]/412
  for tipo,k,g,r,_ in D:
    if r and tipo!='falta':x,y,w,h=r['x'],r['y'],r['w'],r['h'];d.rectangle([20+x*s,60+y*s,20+(x+w)*s,60+(y+h)*s],outline=(255,60,60),width=3)
    if g:x,y,w,h=g['x'],g['y'],g['w'],g['h'];d.rectangle([W+40+x*s,60+y*s,W+40+(x+w)*s,60+(y+h)*s],outline=(255,60,60),width=3)
  o.save(out,quality=82)
def tela(pw,nome,v,passos,esc=True,out='.'):
  R={}
  for base in (False,True):
    b,pg,w=ap.abre(pw,v,esc,'celular',base=base);w(900)
    for js in passos:pg.evaluate(js);w(1300)
    R[base]=(pecas(pg),None);f='/tmp/tc_%d.png'%base;pg.screenshot(path=f);R[base]=(R[base][0],Image.open(f).convert('RGB'));b.close()
  D=diferencas(R[False][0],R[True][0])
  relatorio(nome,R[False][1],R[True][1],D,'%s/titan_%s_%s.jpg'%(out,nome.replace(' ','_'),'esc' if esc else 'cla'))
  return D
