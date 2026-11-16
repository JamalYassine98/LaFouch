# S383 (continuação): respiração e sombra da Mochi avançam em 12 passos por meia volta (passos de ~0,1 px, invisíveis) em vez de redesenhar o boneco 60 vezes por segundo;
# e a amostra de claridade da câmera (uma 2ª cópia da imagem a cada medição) passa a ser tirada a cada 4 medições. A medição da distância continua a cada 0,35 s, igual.
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:80]);s=s.replace(a,b)
tr(".mochi .resp{transform-origin:60px 124px;animation:resp 4s ease-in-out infinite}",".mochi .resp{transform-origin:60px 124px;animation:resp 4s steps(12,end) infinite}")
tr(".mochi .sombra{transform-origin:60px 125px;animation:somb 4s ease-in-out .15s infinite}",".mochi .sombra{transform-origin:60px 125px;animation:somb 4s steps(12,end) .15s infinite}")
a="      var W=320,H=Math.round(W*v.videoHeight/v.videoWidth),cv=Z.cv||(Z.cv=document.createElement('canvas'));cv.width=W;cv.height=H;var cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(v,0,0,W,H);\n      /* S89 D: brilho do meio da imagem (nada é gravado) */\n      try{var dd="
b="      /* S383: a cópia da imagem para medir a claridade é feita a cada 4 medições quando o leitor de rosto novo está em uso (ele não precisa dela); o leitor antigo usa essa cópia sempre */\n      Z.lzN=(Z.lzN||0)+1;var W=320,H=Math.round(W*v.videoHeight/v.videoWidth),cv=Z.cv||(Z.cv=document.createElement('canvas')),fazLuz=!Z.mp||Z.lzN%4===1;if(fazLuz){cv.width=W;cv.height=H;var cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(v,0,0,W,H)}\n      /* S89 D: brilho do meio da imagem (nada é gravado) */\n      if(fazLuz)try{var dd="
tr(a,b)
open(p,'w',encoding='utf8').write(s);print('ok')
