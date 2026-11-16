# S380 (16/11/2026 10:41, "implementar ponto 3 e placa de vídeo"): (3) o site continua encolhendo abaixo de 325 px de largura útil; (1.2) a medição da câmera tenta a placa de vídeo e cai para o processador se não der.
h='/home/claude/catalogo/index.html';t=open(h,encoding='utf8').read()
a="k=Math.max(.8,Math.min(1.4,w/406))";assert t.count(a)==1
t=t.replace(a,"k=Math.max(.5,Math.min(1.4,w/406))/* S380: o piso era .8 (325 px); com a letra do Android grande o Chrome novo encolhe a largura útil para 240 px ou menos e o site saía do quadro */")
open(h,'w',encoding='utf8').write(t)
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf8').read()
a="        return V.FaceLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:base+'face_landmarker.task',delegate:'CPU'},runningMode:'IMAGE',numFaces:1,outputFacialTransformationMatrixes:true})})"
assert s.count(a)==1
b="""        /* S380 (aprovado 16/11 10:38): a leitura do rosto tenta a placa de vídeo (bem mais leve para o processador, que é quem desenha a tela); se o aparelho não deixar criar,
           ou se ela falhar 3 vezes seguidas ao medir, volta sozinha para o processador, como era */
        var op=function(d){return {baseOptions:{modelAssetPath:base+'face_landmarker.task',delegate:d},runningMode:'IMAGE',numFaces:1,outputFacialTransformationMatrixes:true}},cpu=function(){MP.del='CPU';return V.FaceLandmarker.createFromOptions(fs,op('CPU'))};
        if(window.__lfMpCpu)return cpu();
        return V.FaceLandmarker.createFromOptions(fs,op('GPU')).then(function(lm){MP.del='GPU';var d0=lm.detect.bind(lm),fal=0,troca=null,pediu=0;
          lm.detect=function(x){if(troca)return troca.detect(x);try{var r=d0(x);fal=0;return r}catch(e){if(++fal>=3&&!pediu){pediu=1;cpu().then(function(c){troca=c},function(){})}throw e}};return lm},cpu)})"""
s=s.replace(a,b);open(p,'w',encoding='utf8').write(s);print('ok')
