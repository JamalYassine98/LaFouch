# 149cam-G: guias na própria imagem (meio, distância, altura, nível) por cima do 149cam-F — pedido do dono 19:13
exec(open('funciona.py').read().split("with sync_playwright() as pw:")[0])
G=r"""(a)=>{const o=document.getElementById('estCam'),vf=o.querySelector('.ecVf'),v=o.querySelector('video');const W=vf.clientWidth,H=vf.clientHeight;
 const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;const x=c.getContext('2d');x.drawImage(v,0,0);const d=x.getImageData(0,0,c.width,c.height).data;
 let x0=1e9,x1=-1,y0=1e9,y1=-1;for(let yy=0;yy<c.height;yy+=3)for(let xx=0;xx<c.width;xx+=3){const i=(yy*c.width+xx)*4;if(.3*d[i]+.59*d[i+1]+.11*d[i+2]<70){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(yy<y0)y0=yy;if(yy>y1)y1=yy}}
 const s=Math.max(W/c.width,H/c.height),ox=(W-c.width*s)/2,oy=(H-c.height*s)/2;const B={l:ox+x0*s,r:ox+x1*s,t:oy+y0*s,b:oy+y1*s};const cx=(B.l+B.r)/2,cy=(B.t+B.b)/2,lg=(B.r-B.l)/W;
 const okM=Math.abs(cx/W-.5)<.07,okD=lg>.36&&lg<.62||a.forca,okA=Math.abs(cy/H-.5)<.12,okN=true;
 const G='#3ecf7a',Y='#e0b44c',Wh='rgba(255,255,255,.85)',col=k=>k?G:Y;
 const z1=W*.5-W*.31,z2=W*.5+W*.31,i1=W*.5-W*.18,i2=W*.5+W*.18;
 let sv=`<svg width="${W}" height="${H}" style="position:absolute;inset:0;z-index:7;pointer-events:none" fill="none" stroke-linecap="round">`;
 /* nível: linha do horizonte inteira, fina */
 sv+=`<line x1="${W*.06}" y1="${H/2}" x2="${W*.2}" y2="${H/2}" stroke="${col(okN)}" stroke-width="2"/><line x1="${W*.8}" y1="${H/2}" x2="${W*.94}" y2="${H/2}" stroke="${col(okN)}" stroke-width="2"/>`;
 /* meio: linha vertical do centro + marca do centro da peça */
 sv+=`<line x1="${W/2}" y1="${H*.06}" x2="${W/2}" y2="${H*.16}" stroke="${Wh}" stroke-width="2"/><line x1="${W/2}" y1="${H*.84}" x2="${W/2}" y2="${H*.94}" stroke="${Wh}" stroke-width="2"/>`;
 sv+=`<path d="M${cx-7} ${H*.06} L${cx} ${H*.06+10} L${cx+7} ${H*.06}" fill="${col(okM)}" stroke="none"/><path d="M${cx-7} ${H*.94} L${cx} ${H*.94-10} L${cx+7} ${H*.94}" fill="${col(okM)}" stroke="none"/>`;
 if(!okM){const dir=cx<W/2?-1:1,ax=W/2+dir*40;sv+=`<path d="M${W/2+dir*14} ${H*.11} H${ax} M${ax-dir*8} ${H*.11-7} L${ax} ${H*.11} L${ax-dir*8} ${H*.11+7}" stroke="${Y}" stroke-width="3"/>`}
 /* distância: faixa onde as pontas da peça devem ficar (de cada lado) */
 [[i1,z1],[i2,z2]].forEach(p=>{const a1=Math.min(p[0],p[1]),a2=Math.max(p[0],p[1]);sv+=`<path d="M${a1} ${H*.74} V${H*.78} H${a2} V${H*.74}" stroke="${col(okD)}" stroke-width="2"/>`});
 sv+=`<line x1="${B.l}" y1="${H*.7}" x2="${B.l}" y2="${H*.8}" stroke="${col(okD)}" stroke-width="3"/><line x1="${B.r}" y1="${H*.7}" x2="${B.r}" y2="${H*.8}" stroke="${col(okD)}" stroke-width="3"/>`;
 /* altura: marca na borda do centro da peça em relação à linha do horizonte */
 sv+=`<circle cx="${W*.13}" cy="${cy}" r="5" fill="${col(okA)}" stroke="none"/><circle cx="${W*.87}" cy="${cy}" r="5" fill="${col(okA)}" stroke="none"/>`;
 sv+='</svg>';vf.insertAdjacentHTML('beforeend',sv);return {okM,okD,okA,lg:Math.round(lg*100),cx:Math.round(cx/W*100)}}"""
with sync_playwright() as pw:
  def tira(W,H,est,nome,dx=0,guias=True):
    b,pg=abre(pw,W,H);pg.evaluate("d=>window.__fkDx=d",dx);cam(pg);pg.wait_for_timeout(600)
    pg.evaluate(JS,{'e':est,'it':ITENS});pg.wait_for_timeout(300)
    if guias: print(nome,pg.evaluate(G,{'forca':False}))
    f='/tmp/camG_%s.png'%nome;pg.screenshot(path=f);b.close();return f
  Em=dict(EST['conf']);Em['ok']=dict(Em['ok'],luz=1,meio=0,foco=1);Em['frase']='Vire o celular um pouco para a esquerda'
  quadro('/home/claude/lafouch/work/estudio-camera/esboco_149camG_deitado.jpg',[
    ('HOJE · 149cam-F (aprovado agora)','lista e frase; nada na imagem',tira(844,390,Em,'h',-260,False)),
    ('PROPOSTA · peça fora do meio','guias na imagem: amarelo onde está errado + seta',tira(844,390,Em,'m',-260)),
    ('PROPOSTA · tudo certo','todas as guias verdes',tira(844,390,EST['pronto'],'ok',0))],False)
