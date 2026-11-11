# S114 (esboço): aro da lente com a mesma proporção em qualquer celular — canto proporcional ao tamanho e vidro que distorce igual nos dois sentidos
import sys;p=sys.argv[1];s=open(p).read()
def R(a,b):
    global s
    assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
R("    var PIN='';function pinMapa(){if(PIN)return PIN;try{var c=document.createElement('canvas');c.width=125;c.height=150;var x=c.getContext('2d'),d=x.createImageData(125,150);\n      for(var j=0;j<150;j++)for(var i=0;i<125;i++){var u=(i/124)*2-1,v=(j/149)*2-1,k=.5*(u*u+v*v),o=(j*125+i)*4;d.data[o]=128+u*k*127;d.data[o+1]=128+v*k*127;d.data[o+2]=128;d.data[o+3]=255}x.putImageData(d,0,0);PIN=c.toDataURL()}catch(_){}return PIN}",
"""    var PIN='',PINa=0;function pinMapa(w,h){var a=(w&&h)?w/h:125/150;if(PIN&&Math.abs(a-PINa)<.02)return PIN;try{var CW=150,CH=Math.max(40,Math.round(150/a)),c=document.createElement('canvas');c.width=CW;c.height=CH;var x=c.getContext('2d'),d=x.createImageData(CW,CH);
      /* S114: o mapa acompanha a forma da lente — o vidro empurra a imagem o mesmo tanto para os lados e para cima/baixo (antes esticava mais na horizontal nas lentes largas) */
      for(var j=0;j<CH;j++)for(var i=0;i<CW;i++){var u=(i/(CW-1))*2-1,v=(j/(CH-1))*2-1,ux=u*a,k=(ux*ux+v*v)/(a*a+1),o=(j*CW+i)*4;d.data[o]=128+(ux/a)*k*127;d.data[o+1]=128+v*k*127;d.data[o+2]=128;d.data[o+3]=255}x.putImageData(d,0,0);PIN=c.toDataURL();PINa=a}catch(_){}return PIN}""")
R("fr.style.height=(L.wh+16)+'px';hastes(L.ww+16,L.wh+16);",
  "fr.style.height=(L.wh+16)+'px';hastes(L.ww+16,L.wh+16);\n      /* S114: canto do aro proporcional ao tamanho da lente (antes 74 px fixos: na tela baixa a lente virava pílula) */var rr=Math.round(Math.min(L.ww+16,L.wh+16)*.22);fr.style.borderRadius=rr+'px';fr.querySelectorAll('.gza').forEach(function(e){e.style.borderRadius=rr+'px'});fr.querySelectorAll('.gzv').forEach(function(e){e.style.borderRadius=Math.max(0,rr-9)+'px'});var pm2=pinMapa(L.ww,L.wh);if(pm2&&$('gzpinm'))$('gzpinm').setAttribute('href',pm2);")
open(p,'w').write(s);print('ok')
