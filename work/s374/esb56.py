# S374 · esboço 56 (lote 8 aprovado em 15/11, falta o voo da ficha): abrir uma peça no Catálogo com o voo feito por transform/clip-path.
# Hoje: fundo e foto animam left/top/width/height (o navegador refaz a página a cada quadro). Proposta: mesma trajetória, só
# transform (foto, escala igual nos dois lados = não estica) e clip-path (fundo e a moldura branca). Quadros 0/120/250/380 ms + medida no celular lento.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;T='/tmp/s374/';OUT='/home/claude/lafouch/work/s374/'
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
PROP="""()=>{const ori=Element.prototype.animate;const px=v=>parseFloat(v);
 Element.prototype.animate=function(k,o){if(!Array.isArray(k)||k.length!==2||!('left' in k[0])||!(this.classList.contains('lfVoa')||this.classList.contains('lfFundo')))return ori.call(this,k,o);
  const a=k[0],b=k[1],A={x:px(a.left),y:px(a.top),w:px(a.width),h:px(a.height)},B={x:px(b.left),y:px(b.top),w:px(b.width),h:px(b.height)};
  // a camada fica no tamanho MAIOR (fim ao abrir, começo ao voltar); só transform e clip-path mudam
  const G=B.w*B.h>=A.w*A.h?B:A;Object.assign(this.style,{left:G.x+'px',top:G.y+'px',width:G.w+'px',height:G.h+'px',transformOrigin:'0 0'});
  const ra=a.borderRadius||'8px',rb=b.borderRadius||'8px';
  const q=R=>{const s=Math.max(R.w/G.w,R.h/G.h);const ix=(G.w-R.w/s)/2,iy=(G.h-R.h/s)/2;
    return {transform:'translate('+(R.x+R.w/2-G.w*s/2)+'px,'+(R.y+R.h/2-G.h*s/2)+'px) scale('+s+')',clip:'inset('+iy+'px '+ix+'px '+iy+'px '+ix+'px round '+((px(ra)||8)/s)+'px)'}};
  if(this.classList.contains('lfFundo')){const ins=R=>'inset('+(R.y-G.y)+'px '+(G.x+G.w-R.x-R.w)+'px '+(G.y+G.h-R.y-R.h)+'px '+(R.x-G.x)+'px round ';
    return ori.call(this,[{clipPath:ins(A)+ra+')'},{clipPath:ins(B)+rb+')'}],o)}
  const qa=q(A),qb=q(B);this.style.left='0px';this.style.top='0px';this.style.borderRadius='0';
  return ori.call(this,[{transform:qa.transform,clipPath:qa.clip},{transform:qb.transform,clipPath:qb.clip}],o)};
 return 1}"""
CLICA="""()=>{const c=[...document.querySelectorAll('#v-vendas .pcard[data-ref]')].find(c=>{const i=c.querySelector('.pbox img');return i&&i.complete&&c.getBoundingClientRect().top>150});c.scrollIntoView({block:'center',behavior:'instant'});return c.getAttribute('data-ref')}"""
QUADRO="""t=>{document.getAnimations().forEach(a=>{try{a.pause();a.currentTime=t}catch(e){}});return document.getAnimations().length}"""
MEDE="""()=>new Promise(r=>{const c=[...document.querySelectorAll('#v-vendas .pcard[data-ref]')].find(c=>{const i=c.querySelector('.pbox img');return i&&i.complete&&c.getBoundingClientRect().top>150});
 let n=0,t0=0,maior=0,ult=0;const f=t=>{if(!t0)t0=t;if(ult)maior=Math.max(maior,t-ult);ult=t;n++;if(t-t0<380)requestAnimationFrame(f);else r([n,Math.round(maior)])};c.click();requestAnimationFrame(f)})"""
def abre(pw,esc,prop):
    b,pg,w=ap.abre(pw,'vendas',esc);w(1800)
    if prop: pg.evaluate(PROP)
    return b,pg,w
with sync_playwright() as pw:
    med={}
    for prop in (0,1):
        rs=[]
        for k in range(3):
            b,pg,w=abre(pw,True,prop);pg.evaluate(CLICA);w(500);cdp=pg.context.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4});rs.append(pg.evaluate(MEDE));b.close()
        med[prop]=rs;print('medida',prop,rs)
    for esc,tema in ((True,'escuro'),(False,'claro')):
        lin=[]
        for prop in (0,1):
            fs=[]
            for t in (0,120,250,380):
                b,pg,w=abre(pw,esc,prop);pg.evaluate(CLICA);w(500)
                pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-vendas .pcard[data-ref]')].find(c=>{const i=c.querySelector('.pbox img');return i&&i.complete&&c.getBoundingClientRect().top>150});c.click()}");w(40)
                pg.evaluate(QUADRO,t);w(120);p=T+'v_%d_%d_%d.png'%(esc,prop,t);pg.screenshot(path=p);fs.append(p);b.close()
            lin.append(fs)
        ims=[[Image.open(x).convert('RGB').resize((390,844)) for x in l] for l in lin];g=30;W=g+4*(390+g)
        sub=['Hoje: a foto e o fundo crescem mudando posição e tamanho; o celular refaz a página inteira a cada quadro (no celular lento, trava).',
             'Proposta: o mesmo caminho e o mesmo tempo (0,38 s), mas a foto cresce por escala igual nos dois lados (não estica) e o fundo abre por recorte.',
             'Na tela fica igual. Medido no celular simulado 4× mais lento, 3 vezes: quadros em 0,38 s — hoje %s · proposta %s; maior parada — hoje %s ms · proposta %s ms. Diferença pequena: a parada maior é montar a ficha, igual nos dois.'%(
               '/'.join(str(x[0]) for x in med[0]),'/'.join(str(x[0]) for x in med[1]),'/'.join(str(x[1]) for x in med[0]),'/'.join(str(x[1]) for x in med[1]))]
        _d=ImageDraw.Draw(Image.new('RGB',(4,4)));ns=[]
        for l in sub:
            a_=''
            for q in l.split(' '):
                if _d.textlength((a_+' '+q).strip(),font=F(22))>W-2*g and a_: ns.append(a_);a_=q
                else: a_=(a_+' '+q).strip()
            ns.append(a_)
        top=90+len(ns)*32+20;S=Image.new('RGB',(W,top+2*(50+844+g)+40),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,30),'App · Catálogo › abrir uma peça (voo da ficha) · tema '+tema,font=F(36,True),fill='#1d1418')
        for i,l in enumerate(ns): d.text((g,90+i*32),l,font=F(22),fill='#55484f')
        y=top
        for i,(row,r) in enumerate(zip(ims,('HOJE','PROPOSTA'))):
            d.text((g,y),r+'   ·   0 ms        120 ms        250 ms        380 ms',font=F(28,True),fill='#8d3a69' if i else '#1d1418');y+=44
            for j,im in enumerate(row): x=g+j*(390+g);S.paste(im,(x,y));d.rectangle([x-1,y-1,x+390,y+844],outline='#cfc6cb')
            y+=844+g+10
        S.save(OUT+'56-app-voo-da-ficha-%s.jpg'%tema,quality=86);print(' 56',tema,S.size)
