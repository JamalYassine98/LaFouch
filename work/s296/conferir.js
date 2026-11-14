/* LaFouch · conferência antes de gravar o giro (S296). Mede um quadro da câmera (ImageData 640×360, celular deitado) e devolve números;
   quem decide "está bom / o que fazer" é confereGiro(). Sem rede, sem biblioteca. Calibrado com os vídeos de teste do dono (14/11/2026). */
function medeQuadro(img){
  var W=img.width,H=img.height,d=img.data,L=new Float32Array(W*H),i,x,y;
  for(i=0;i<W*H;i++)L[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];
  function med(a){a.sort(function(p,q){return p-q});return a.length?a[a.length>>1]:0}
  /* parede do fundo: faixa de cima, no meio */
  var am=[];for(y=Math.round(H*.06);y<H*.3;y+=2)for(x=Math.round(W*.35);x<W*.65;x+=2)am.push(L[y*W+x]);
  var parede=med(am),desv=0;for(i=0;i<am.length;i++)desv+=Math.abs(am[i]-parede);desv/=am.length||1;
  /* costuras e quinas: colunas escuras de cima a baixo na faixa de cima */
  var cost=[],y0=Math.round(H*.05),y1=Math.round(H*.34);
  for(x=2;x<W-2;x++){var s=0,n=0,esc=0;for(y=y0;y<y1;y+=2){var v=L[y*W+x];s+=v;n++;if(v<parede*.74)esc++}if(esc/n>.6)cost.push(x)}
  var ehC=new Uint8Array(W);cost.forEach(function(c){for(var k=-4;k<=4;k++)if(c+k>=0&&c+k<W)ehC[c+k]=1});
  /* borda de trás do prato: onde a imagem clareia de cima para baixo (parede cinza → prato claro), fora das costuras */
  var bs=[],fs=[];for(x=Math.round(W*.08);x<W*.92;x+=6){if(ehC[x])continue;var mg=0,my=-1;for(y=Math.round(H*.22);y<H*.8;y++){var g=L[(y+3)*W+x]-L[(y-3)*W+x];if(g>mg){mg=g;my=y}}if(my>0&&mg>7){bs.push(my);fs.push(mg)}}
  var borda=bs.length>10?med(bs.slice()):-1;
  /* peça: o que é ESCURO E FINO em relação ao que está em volta (hastes, aros, armação clara). Paredes, prato e sombras são manchas largas e ficam de fora.
     Conta em meia resolução: "fechamento" (máximo e depois mínimo numa janela de 15 pontos) menos a própria imagem. */
  var w=W>>1,h=H>>1,S=new Float32Array(w*h),A=new Float32Array(w*h),B=new Float32Array(w*h),R=7,k;
  for(y=0;y<h;y++)for(x=0;x<w;x++)S[y*w+x]=(L[2*y*W+2*x]+L[2*y*W+2*x+1]+L[(2*y+1)*W+2*x]+L[(2*y+1)*W+2*x+1])/4;
  function passa(src,dst,mx,hor){for(var yy=0;yy<h;yy++)for(var xx=0;xx<w;xx++){var m=mx?-1:1e9;for(var t=-R;t<=R;t++){var a=hor?Math.min(w-1,Math.max(0,xx+t)):xx,b=hor?yy:Math.min(h-1,Math.max(0,yy+t)),vv=src[b*w+a];if(mx?vv>m:vv<m)m=vv}dst[yy*w+xx]=m}}
  passa(S,A,1,1);passa(A,B,1,0);passa(B,A,0,1);passa(A,B,0,0);
  var M=new Uint8Array(w*h);for(y=1;y<h-1;y++)for(x=1;x<w-1;x++)if(!ehC[2*x]&&B[y*w+x]-S[y*w+x]>parede*.085)M[y*w+x]=1;
  /* junta os pontos em pedaços ligados; joga fora o que é do cenário: riscos que encostam em cima ou nos lados do quadro (quinas da tenda, borda do prato, cabo) */
  var rot=new Int32Array(w*h),ped=[],pilha=new Int32Array(w*h),np_=0;
  for(i=0;i<w*h;i++){if(!M[i]||rot[i])continue;np_++;var t=0;pilha[t++]=i;rot[i]=np_;var c={a:0,x0:w,x1:0,y0:h,y1:0};
    while(t){var p=pilha[--t],xx=p%w,yy=(p-xx)/w;c.a++;if(xx<c.x0)c.x0=xx;if(xx>c.x1)c.x1=xx;if(yy<c.y0)c.y0=yy;if(yy>c.y1)c.y1=yy;
      for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var x2=xx+dx,y2=yy+dy;if(x2<0||y2<0||x2>=w||y2>=h)continue;var p2=y2*w+x2;if(M[p2]&&!rot[p2]){rot[p2]=np_;pilha[t++]=p2}}}
    c.cen=(c.y0<=h*.1)||c.y1>=h-3||c.x0<=2||c.x1>=w-3||((c.y1-c.y0)>h*.2&&(c.x1-c.x0)<w*.05);ped.push(c)}
  var bons=ped.filter(function(c){return !c.cen&&c.a>=25}).sort(function(a,b){return b.a-a.a}),peca=null,cortada=ped.some(function(c){return c.cen&&c.a>w*h*.01&&c.y0>h*.12&&(c.x1-c.x0)>w*.2&&(c.y1-c.y0)>h*.08});
  if(bons.length&&bons[0].a>w*h*.008&&(bons[0].x1-bons[0].x0)>w*.12){var s0=bons[0],ex=(s0.x1-s0.x0)*.25+6,ey=(s0.y1-s0.y0)*.35+6,bx={x0:s0.x0,x1:s0.x1,y0:s0.y0,y1:s0.y1,n:0};
    bons.forEach(function(c){var mx=(c.x0+c.x1)/2,my=(c.y0+c.y1)/2;if(mx>s0.x0-ex&&mx<s0.x1+ex&&my>s0.y0-ey&&my<s0.y1+ey){bx.x0=Math.min(bx.x0,c.x0);bx.x1=Math.max(bx.x1,c.x1);bx.y0=Math.min(bx.y0,c.y0);bx.y1=Math.max(bx.y1,c.y1);bx.n+=c.a}});
    peca={x0:2*bx.x0,x1:2*bx.x1+1,y0:2*bx.y0,y1:2*bx.y1+1,n:bx.n};
    /* nitidez: média dos 5% contornos mais fortes dentro da caixa, relativa ao tom da parede */
    var gs=[];for(y=Math.max(2,peca.y0);y<=Math.min(H-3,peca.y1);y++)for(x=Math.max(2,peca.x0);x<=Math.min(W-3,peca.x1);x++){if(ehC[x])continue;var gg=Math.abs(L[y*W+x+1]-L[y*W+x-1])+Math.abs(L[(y+1)*W+x]-L[(y-1)*W+x]);if(gg>parede*.06)gs.push(gg)}
    gs.sort(function(a,b){return b-a});var nq=Math.max(1,Math.round(gs.length*.05)),sn=0;for(i=0;i<nq;i++)sn+=gs[i];peca.nit=gs.length?sn/nq/parede:0}
  return {W:W,H:H,parede:parede,desv:desv/Math.max(1,parede),cost:cost,borda:borda,peca:peca,cortada:cortada}
}

/* Decide, a partir das medidas (média dos últimos quadros), o que está certo e o que fazer. Cada item: {id, nome, ok (true/false/null = não deu para conferir), fazer}.
   A peça deve estar DE FRENTE para a câmera na hora de conferir. */
function confereGiro(m,ex){
  ex=ex||{};var it=[],p=m.peca,W=m.W,H=m.H,add=function(id,nome,ok,fazer){it.push({id:id,nome:nome,ok:ok,fazer:ok===false?fazer:''})};
  add('deitado','Celular deitado',ex.emPe?false:true,'Deite o celular');
  add('firme','Celular parado',ex.mexe==null?null:ex.mexe<1.2,'O celular está mexendo: apoie ou prenda melhor');
  add('luz','Luz do fundo',m.parede>=120&&m.desv<.05,m.parede<120?'Falta luz: aumente a luz da caixa':'Fundo manchado: tire sombras e reflexos de trás da peça');
  if(!p){add('peca','Peça no prato',m.cortada?false:null,m.cortada?'A peça está saindo do quadro ou encostada numa costura: afaste o celular e centralize':'Coloque a peça no prato, de frente para a câmera');return fim(it)}
  var larg=(p.x1-p.x0)/W,cx=(p.x0+p.x1)/2/W,zona=[(cx-.75*larg)*W,(cx+.75*larg)*W];
  add('peca','Peça no prato',true,'');
  add('dist','Distância',larg>=.45&&larg<=.58,larg<.45?'Aproxime o celular (a peça está pequena)':'Afaste um pouco o celular (a peça gira e precisa de folga)');
  add('meio','Peça no meio do quadro',Math.abs(cx-.5)<=.05,cx<.5?'Vire o celular um pouco para a esquerda (a peça está à esquerda)':'Vire o celular um pouco para a direita (a peça está à direita)');
  var r=m.borda>0?(m.borda-p.y0)/Math.max(1,p.y1-p.y0):null;
  add('altura','Altura da câmera',r==null?null:(r>=.45&&r<=.85),r!=null&&r<.45?'Câmera alta: abaixe o celular até quase a altura da peça':'Câmera baixa demais: suba um pouco o celular');
  var dentro=m.cost.filter(function(c){return c>zona[0]&&c<zona[1]}).length;
  add('costura','Fundo sem costura atrás da peça',dentro===0,'Costura da tenda atrás do caminho da peça: cubra com a cartolina branca');
  add('foco','Foco na peça',p.nit>=.6,'Fora de foco: toque e segure na peça para travar o foco');
  add('folga','Folga nas bordas',zona[0]>W*.02&&zona[1]<W*.98&&p.y0>H*.06&&p.y1<H*.97,'Sem folga: a peça vai sair do quadro quando girar; afaste o celular');
  return fim(it);
  function fim(it){var ruim=it.filter(function(i){return i.ok===false}),nao=it.filter(function(i){return i.ok===null});
    return {itens:it,tudo:!ruim.length&&!nao.length,frase:ruim.length?ruim[0].fazer:(nao.length?(nao[0].id==='peca'?'Coloque a peça no prato, de frente para a câmera':'Conferindo…'):'Tudo certo · pode gravar')}}
}
if(typeof module!=='undefined')module.exports={medeQuadro:medeQuadro,confereGiro:confereGiro};
