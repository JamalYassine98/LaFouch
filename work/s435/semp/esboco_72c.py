# Esboço 72c (S435, 22/11 16:20) — janela do POST e o POST em si com cara de luxo (dono 16:12: 'a janela não tá luxuosa e o post tem
# cara de simples'; 16:15 'Sim' à proposta). Base: a janela real (mkCria, .ljJn) + acabamento aprovado das janelas do Semp (20/11:
# um botão só, linha fina, fundo desfocado, sem 'Me lembra').
# JANELA: o post ocupa a largura inteira e é o protagonista; ESTILO troca deslizando o post (3 pontos + nome); idioma em texto
# (PT · ES · PT+ES, o escolhido em destaque, sem barra); 'Por que esta peça ⌄'; legenda em linha fina com 'Outro texto' (era Versão A/B);
# 'Postar agora'. Saem: as 2 barras, as 3 bolinhas de cor, a caixa da legenda.
# POST: 3 estilos que o Semp alterna — Editorial (claro, muito espaço), Noite (vinho), Detalhe (a peça bem de perto). Nome pequeno em
# letra serifada espaçada, preço discreto numa linha, logo pequeno embaixo; WhatsApp e endereço saem da imagem (vão para a legenda/perfil).
# No app de teste as fotos são DESENHOS (o real usa a foto do Estúdio). Peça real: Leitura Kazwini de acetato masculino, G$ 25.000 · R$ 21.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s430/comparador');import ap,compara
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
REL=[]
def confere(pg,n):
  r=pg.evaluate(compara.COLETA);T={'L':r['L'],'sob':{tuple(sorted(x)) for x in r['sob']}};f=compara.falhas(T);REL.append((n,[(k[0],' / '.join(e['nome'] for e in v)) for k,v in f.items()]))
POST=r"""(a)=>{const [img,st,W]=a;const H=W*1.25,u=W/360;
 const nm='LEITURA KAZWINI · ACETATO';const pr='G$ 25.000 · R$ 21';
 const base='position:relative;width:'+W+'px;height:'+H+'px;overflow:hidden;font-family:Georgia,serif;';
 const logo=(c)=>'<div style="position:absolute;left:0;right:0;bottom:'+18*u+'px;text-align:center;color:'+c+';font-size:'+9*u+'px;letter-spacing:.42em">LA FOUCH</div>';
 if(st=='ed') return '<div style="'+base+'background:#f3eee8"><img src="'+img+'" style="position:absolute;left:12%;top:16%;width:76%;height:46%;object-fit:contain"><div style="position:absolute;left:0;right:0;top:68%;text-align:center;color:#2a2226"><div style="font-size:'+10*u+'px;letter-spacing:.28em">'+nm+'</div><div style="width:'+24*u+'px;height:1px;background:#b9a99e;margin:'+12*u+'px auto"></div><div style="font-family:system-ui;font-size:'+9*u+'px;letter-spacing:.12em;color:#7d6f68">'+pr+'</div></div>'+logo('#9a8a80')+'</div>';
 if(st=='noite') return '<div style="'+base+'background:radial-gradient(60% 45% at 50% 40%,#4a2a3a,#1d0f17 75%)"><div style="position:absolute;left:18%;right:18%;top:56%;height:'+10*u+'px;border-radius:50%;background:rgba(0,0,0,.45);filter:blur('+6*u+'px)"></div><img src="'+img+'" style="position:absolute;left:14%;top:20%;width:72%;height:40%;object-fit:contain;filter:drop-shadow(0 '+8*u+'px '+14*u+'px rgba(0,0,0,.5))"><div style="position:absolute;left:0;right:0;top:69%;text-align:center;color:#efe3da"><div style="font-size:'+10*u+'px;letter-spacing:.28em">'+nm+'</div><div style="width:'+24*u+'px;height:1px;background:#a98a96;margin:'+12*u+'px auto"></div><div style="font-family:system-ui;font-size:'+9*u+'px;letter-spacing:.12em;color:#c9b3bd">'+pr+'</div></div>'+logo('#a98a96')+'</div>';
 return '<div style="'+base+'background:#e9e3dc"><img src="'+img+'" style="position:absolute;left:-55%;top:-10%;width:210%;height:120%;object-fit:contain"><div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(20,12,16,.78))"></div><div style="position:absolute;left:'+24*u+'px;bottom:'+46*u+'px;color:#f4ece6"><div style="font-size:'+22*u+'px;line-height:1.15">Acetato que<br>dura anos.</div><div style="font-family:system-ui;font-size:'+9*u+'px;letter-spacing:.16em;margin-top:'+10*u+'px;color:#e2d2c9">'+nm+' · '+pr+'</div></div>'+logo('#d9c7bd')+'</div>'}"""
def img_peca(pg):
  pg.evaluate("()=>__LF.setView('estoque')");pg.wait_for_timeout(900)
  src=pg.evaluate("()=>{const c=[...document.querySelectorAll('.pcard')].find(c=>/Kazwini de acetato masculino/.test(c.innerText));return c.querySelector('img').src}")
  import urllib.parse
  t=urllib.parse.unquote(src.split(',',1)[1]).replace('<rect width="400" height="300" fill="#fff"/>','')  # a foto do Estúdio vem tratada, sem fundo
  return 'data:image/svg+xml;charset=utf-8,'+urllib.parse.quote(t)
def janela(pw,esc):
  b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True);w(800);im=img_peca(pg);pg.evaluate("()=>__LF.inicioGo('mkt')");w(1000)
  [x for x in pg.query_selector_all('#v-mkt button') if (x.inner_text() or '').strip()=='Post'][0].click(); w(1500)
  W=pg.evaluate("()=>document.querySelector('.ljJn').clientWidth")
  post=pg.evaluate(POST,[im,'ed',W])
  pg.evaluate(r"""(a)=>{const [post]=a;const j=document.querySelector('.ljJn');j.querySelector('.ljHd b').textContent='Seg · Post · 20h';
   const bk=document.querySelector('.ljBk');if(bk){bk.style.backdropFilter='blur(12px)'}
   const L='display:flex;align-items:center;gap:16px;min-height:56px;border-bottom:1px solid var(--line2)';
   const opc=(t,on)=>'<span style="font-size:15px;'+(on?'color:var(--fg);font-weight:600':'color:var(--mute)')+'">'+t+'</span>';
   j.querySelector('.ljCorpo').innerHTML=
    '<div style="margin:8px 0 0;overflow:hidden">'+post+'</div>'+
    '<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin:16px 0 8px"><i style="width:6px;height:6px;border-radius:50%;background:var(--fg)"></i><i style="width:6px;height:6px;border-radius:50%;background:var(--line2)"></i><i style="width:6px;height:6px;border-radius:50%;background:var(--line2)"></i><span style="font-size:13px;color:var(--mute);margin-left:8px">Editorial · deslize para Noite e Detalhe</span></div>'+
    '<div style="'+L+'"><span style="flex:1;font-size:16px">Idioma</span><span style="display:flex;gap:16px">'+opc('PT')+opc('ES')+opc('PT+ES',1)+'</span></div>'+
    '<div style="'+L+'"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Por que esta peça</b><small style="display:block;font-size:13px;color:var(--mute)">a que mais vende · 27 no mês</small></span><span style="color:var(--mute);font-size:18px">⌄</span></div>'+
    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin:24px 0 4px"><span style="font-size:13px;color:var(--mute)">Legenda</span><span style="font-size:14px;color:var(--accent-fg);font-weight:600">Outro texto</span></div>'+
    '<div style="font-size:16px;line-height:1.5;padding:4px 0 12px;border-bottom:1px solid var(--line2)">Leitura Kazwini de acetato. Leve, firme, feito para durar.<br>G$ 25.000 · R$ 21 · reserve pelo WhatsApp.</div>'+
    '<button type="button" class="go" style="margin-top:24px">Postar agora</button>';
   j.querySelector('.ljCorpo').scrollTop=0}""",[post])
  w(600);confere(pg,'Janela '+('escuro' if esc else 'claro'));pg.screenshot(path='/tmp/jc%d.png'%esc)
  pg.evaluate("()=>{document.querySelector('.ljJn .ljCorpo').scrollTop=99999}");w(300);pg.screenshot(path='/tmp/jd%d.png'%esc)
  posts=[]
  for st in ('ed','noite','det'):
    pg.evaluate("(h)=>{const d=document.createElement('div');d.id='pp';d.style.cssText='position:fixed;left:0;top:0;z-index:99999';d.innerHTML=h;const o=document.getElementById('pp');if(o)o.remove();document.body.appendChild(d)}",pg.evaluate(POST,[im,st,360]))
    w(200);pg.locator('#pp').screenshot(path='/tmp/pp_%s.png'%st);posts.append(Image.open('/tmp/pp_%s.png'%st).copy())
  b.close();return Image.open('/tmp/jc%d.png'%esc).copy(),Image.open('/tmp/jd%d.png'%esc).copy(),posts
def quadro(arq,q,esc=True):
  g=40;W=g+sum(im.width+g for _,_,im in q);H=max(im.height for _,_,im in q)
  S=Image.new('RGB',(W,H+150),(17,20,26));d=ImageDraw.Draw(S);x=g
  for t,s,im in q:
    d.text((x,24),t,font=F(36),fill=(235,235,240));d.text((x,72),s,font=F(24),fill=(140,150,165));S.paste(im,(x,120));d.rectangle([x-1,119,x+im.width,120+im.height],outline=(90,90,100));x+=im.width+g
  S.save(O+arq,quality=88);print('ok',arq,S.size)
if __name__=='__main__':
 with sync_playwright() as pw:
  j1,j2,P=janela(pw,True);k1,k2,_=janela(pw,False)
  quadro('esboco_72c_janela_post.jpg',[('PROPOSTA · janela do Post','o post é o protagonista · escuro',j1),('rolando','um botão só',j2),('PROPOSTA · claro','',k1)])
  quadro('esboco_72c_estilos_post.jpg',[('Editorial','claro · muito espaço',P[0]),('Noite','vinho · a peça em luz',P[1]),('Detalhe','a peça bem de perto · uma frase',P[2])])
 for n,f in REL: print(n,len(f),f[:5])
