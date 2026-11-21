# Esboço 40 (S435, 21/11) — câmera do giro: "Câmera reta" (sensor, em graus) e "Peça reta" (pela imagem). Pedido do dono 20/11 23:29.
import os,sys;os.chdir('/home/claude/lafouch/work/estudio-camera')
exec(open('/home/claude/lafouch/work/s435/giro/hoje.py').read().split("\nif __name__=='__main__':")[0])
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/giro/'
IT=[['reto','Câmera reta'],['firme','Celular parado'],['luz','Luz do fundo'],['peca','Peça no prato'],['preta','Peça reta'],['dist','Distância'],['meio','Peça no meio'],['altura','Altura da câmera'],['costura','Fundo sem costura'],['foco','Foco na peça'],['folga','Folga nas bordas']]
FIXA=r"""(a)=>{const o=document.getElementById('estCam');const IT=a.it,E=a.e;
 const lista=()=>IT.map(x=>{const v=E.ok[x[0]];return '<span class="'+(v===1?'ok':v===0?'ruim':'nao')+'"><i aria-hidden="true"></i>'+x[1]+'</span>'}).join('');
 const desenha=()=>{const vf=o.querySelector('.ecVf'),W=vf.clientWidth,H=vf.clientHeight,G='#2fe08f',Y='#e9b04a',B='rgba(255,255,255,.85)';
  let sv='';const ang=E.cam||0,cx=W/2,cy=H/2,rad=ang*Math.PI/180;
  // horizonte: as duas pontas giram com a inclinação real do celular (centro da imagem)
  const ponta=(d1,d2)=>{const x1=cx+Math.cos(rad)*d1,y1=cy+Math.sin(rad)*d1,x2=cx+Math.cos(rad)*d2,y2=cy+Math.sin(rad)*d2;return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(ang?Y:G)+'" stroke-width="2.5"/>'};
  sv+=ponta(-W*.44,-W*.30)+ponta(W*.30,W*.44);
  if(ang){sv+='<line x1="'+W*.06+'" y1="'+cy+'" x2="'+W*.2+'" y2="'+cy+'" stroke="'+B+'" stroke-width="1" stroke-dasharray="4 4"/><line x1="'+W*.8+'" y1="'+cy+'" x2="'+W*.94+'" y2="'+cy+'" stroke="'+B+'" stroke-width="1" stroke-dasharray="4 4"/>';
   sv+='<text x="'+(W*.94)+'" y="'+(cy+Math.sin(rad)*W*.44-10)+'" fill="'+Y+'" font-size="15" font-weight="700" text-anchor="end" font-family="system-ui,Roboto">'+Math.abs(ang).toFixed(0)+'°</text>'}
  // meio (como hoje)
  sv+='<line x1="'+cx+'" y1="'+H*.06+'" x2="'+cx+'" y2="'+H*.16+'" stroke="'+B+'" stroke-width="2"/><line x1="'+cx+'" y1="'+H*.84+'" x2="'+cx+'" y2="'+H*.94+'" stroke="'+B+'" stroke-width="2"/>';
  sv+='<path d="M'+(cx-7)+' '+H*.06+' L'+cx+' '+(H*.06+10)+' L'+(cx+7)+' '+H*.06+'Z" fill="'+G+'"/><path d="M'+(cx-7)+' '+H*.94+' L'+cx+' '+(H*.94-10)+' L'+(cx+7)+' '+H*.94+'Z" fill="'+G+'"/>';
  // peça reta: topo de cada lado da armação (medido na caixa de cada lente)
  if(E.pecaY){const yl=E.pecaY[0]*H,yr=E.pecaY[1]*H,xl=E.pecaY[2]*W,xr=E.pecaY[3]*W;const c=Math.abs(yl-yr)>3?Y:G;
   sv+='<line x1="'+(xl-34)+'" y1="'+yl+'" x2="'+(xl+34)+'" y2="'+yl+'" stroke="'+c+'" stroke-width="3"/><line x1="'+(xr-34)+'" y1="'+yr+'" x2="'+(xr+34)+'" y2="'+yr+'" stroke="'+c+'" stroke-width="3"/>';
   sv+='<line x1="'+(xl+34)+'" y1="'+yl+'" x2="'+(xr-34)+'" y2="'+yl+'" stroke="'+c+'" stroke-width="1.5" stroke-dasharray="5 5"/>';
   if(c===Y)sv+='<path d="M'+(xr+44)+' '+(yr)+' V'+(yl)+' M'+(xr+38)+' '+(yl+8)+' L'+(xr+44)+' '+yl+' L'+(xr+50)+' '+(yl+8)+'" stroke="'+Y+'" stroke-width="2.5" fill="none"/>'}
  let g=vf.querySelector('.ecGuias');if(g&&g.innerHTML!==g._sv){const t=document.createElement('div');t.innerHTML='<svg>'+g.innerHTML+'</svg>';const el=[...t.firstChild.children];el.slice(0,4).forEach(x=>x.remove());el.filter(x=>x.tagName=='path'&&/Z$/.test(x.getAttribute('d')||'')).forEach(x=>x.remove());t.firstChild.querySelectorAll('circle').forEach(c=>c.setAttribute('fill',G));t.firstChild.querySelectorAll('[stroke]').forEach(c=>{if(c.getAttribute('stroke')!==B)c.setAttribute('stroke',G)});g.setAttribute('viewBox','0 0 '+W+' '+H);g.innerHTML=t.firstChild.innerHTML+sv;g._sv=g.innerHTML}
  const l=o.querySelector('.ecLista'),h=lista();if(l&&l.innerHTML!==l._h){l.innerHTML=h;l._h=l.innerHTML}
  const f=o.querySelector('.ecFrase');if(f){const b=f.querySelector('b')||f;if(b.textContent!==E.frase){b.textContent=E.frase}f.classList.toggle('ok',!!E.verde)}};
 desenha();new MutationObserver(()=>desenha()).observe(o,{subtree:true,childList:true,characterData:true})}"""
def tira(pw,rot,E,nome,prop=True):
  b,pg=abre2(pw,844,390);pg.evaluate("r=>window.__fkRot=r",rot)
  pg.evaluate("()=>__LF.setView('estoque')");pg.wait_for_timeout(800)
  pg.evaluate("()=>{const i=[...document.querySelectorAll('.pcard img')].find(x=>/^data:image\\/svg/.test(x.src));window.__fkImg=i&&i.src}")
  pg.evaluate("()=>__LF.inicioGo('est')");pg.wait_for_timeout(1500)
  pg.evaluate("()=>{const b=document.querySelector('[data-i=\"0\"]');b&&b.click()}");pg.wait_for_timeout(5000)
  if prop: pg.evaluate(FIXA,{'it':IT,'e':E});pg.wait_for_timeout(700)
  f='/tmp/gr_%s.png'%nome;pg.screenshot(path=f);b.close();im=Image.open(f);im.load();return im.copy()
OK={k:1 for k,_ in IT}
with sync_playwright() as pw:
  q=[('HOJE · peça 4° torta, celular 3° torto','a lista não vê nenhuma das duas (só deitado × em pé)',tira(pw,4,None,'h',False)),
     ('PROPOSTA · celular torto','sensor em graus · horizonte inclinado + "3°"',tira(pw,0,dict(ok=dict(OK,reto=0),cam=3,frase='Endireite o celular: 3° para a direita',verde=0),'c')),
     ('PROPOSTA · peça torta no prato','um lado da armação mais alto · seta',tira(pw,4,dict(ok=dict(OK,preta=0),cam=0,pecaY=[.405,.465,.37,.63],frase='Endireite a armação no prato: o lado direito está baixo',verde=0),'p')),
     ('PROPOSTA · tudo reto','as duas guias verdes · pode gravar',tira(pw,0,dict(ok=OK,cam=0,pecaY=[.42,.42,.37,.63],frase='Tudo certo · pode gravar',verde=1),'ok'))]
  g=40;w,h=q[0][2].size;S=Image.new('RGB',(w+2*g,len(q)*(h+150)+g),(17,20,26));d=ImageDraw.Draw(S);y=g
  for t,s,im in q:
    d.text((g,y),t,font=F(34),fill=(235,235,240));d.text((g,y+46),s,font=F(22),fill=(140,150,165));S.paste(im,(g,y+100));d.rectangle([g-1,y+99,g+w,y+100+h],outline=(90,90,100));y+=h+150
  S.save(O+'esboco_40_camera_reta_peca_reta_deitado.jpg',quality=88);print('ok')
def tira2(pw,prop,nome):
  b,pg=abre2(pw,390,844);pg.evaluate("()=>window.__fkRot=0")
  pg.evaluate("()=>__LF.setView('estoque')");pg.wait_for_timeout(800)
  pg.evaluate("()=>{const i=[...document.querySelectorAll('.pcard img')].find(x=>/^data:image\\/svg/.test(x.src));window.__fkImg=i&&i.src}")
  pg.evaluate("()=>__LF.inicioGo('est')");pg.wait_for_timeout(1500)
  pg.evaluate("()=>{const b=document.querySelector('[data-i=\"0\"]');b&&b.click()}");pg.wait_for_timeout(5000)
  if prop: pg.evaluate(r"""()=>{const o=document.getElementById('estCam');const f=()=>{const l=o.querySelector('.ecLista');if(!l)return;const sp=[...l.children];if(sp[0]&&/Celular deitado/.test(sp[0].textContent)){sp[0].lastChild.textContent='Câmera reta';const n=sp[3].cloneNode(true);n.lastChild.textContent='Peça reta';sp[3].after(n)}};f();new MutationObserver(f).observe(o,{subtree:true,childList:true})}""");pg.wait_for_timeout(700)
  f='/tmp/ge_%s.png'%nome;pg.screenshot(path=f);b.close();im=Image.open(f);im.load();return im.copy()
with sync_playwright() as pw:
  q=[('HOJE · em pé','"Deite o celular"',tira2(pw,False,'h')),('PROPOSTA · em pé','igual a hoje: em pé só pede para deitar (sem lista)',tira2(pw,True,'p'))]
  g=40;w,h=q[0][2].size;S=Image.new('RGB',(g+2*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,110));d.rectangle([x-1,109,x+w,110+h],outline=(90,90,100))
  S.save(O+'esboco_40_camera_reta_peca_reta_empe.jpg',quality=88);print('ok2')
