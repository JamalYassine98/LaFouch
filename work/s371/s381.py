# S381 (16/11/2026 11:08, "Implementar correções"): distância pelo lado maior da imagem; o quadro de leitura manda; medição mais leve quando a distância está estável; medidor mostra câmera, leitor e distância.
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:80]);s=s.replace(a,b)
# C1 distância: o ângulo da câmera (31° de meia abertura) vale para o lado MAIOR da imagem; em celular a imagem costuma vir em pé (720×1280) e a conta pela largura dava ~0,56 da distância real
tr("ok=mn>5&&mn/mx>.8,di=ok?(a+b)/2:mx,f2=(VW/2)/Math.tan(31*Math.PI/180);","ok=mn>5&&mn/mx>.8,di=ok?(a+b)/2:mx,f2=(Math.max(VW,VH)/2)/Math.tan(31*Math.PI/180);/* S381: lado maior (imagem em pé no celular) */")
tr("var f=(W/2)/Math.tan(31*Math.PI/180);poeMedida(f*6.3/ipd,false)}","var f=(Math.max(W,H)/2)/Math.tan(31*Math.PI/180);poeMedida(f*6.3/ipd,false)}")
# C2 resultado: o quadro de leitura manda; o ponto próximo só confirma (até 0,25). Se discordar, vale o quadro com a faixa de ±0,25 e o ponto próximo não aparece
tr("if(pp){var pv=Math.max(.25,pp.pp);if(!pp.ok){lo=gf(Math.min(G,pv));hi=gf(Math.max(G,pv));G=Math.min(G,pv)}}","/* S381 (aprovado 16/11 10:31): o quadro de leitura manda. Ponto próximo que não combina (diferença maior que 0,25) é deixado de lado — antes ele puxava a sugestão para o menor (caso do dono: quadro +2.50, sugerido +0.25) */if(pp&&!pp.ok)pp=null;")
# C3 medição mais leve: no quadro de leitura, com as 3 últimas medidas iguais (até 2 cm) e dentro da faixa, mede 1 vez por segundo e com recorte menor; fora disso (mexeu, saiu da faixa, ponto próximo) continua como era
tr("if(Z.mp){var VW=v.videoWidth,VH=v.videoHeight,bx=Z.bx,sx=0,sy=0,sw=VW,sh=VH,S2=640;","if(Z.mp){var VW=v.videoWidth,VH=v.videoHeight,bx=Z.bx,sx=0,sy=0,sw=VW,sh=VH,S2=640,u3=hist10.slice(-3),calmo=Z.fase==='teste'&&u3.length===3&&Math.max.apply(null,u3)-Math.min.apply(null,u3)<=2&&u3[2]>=dLo()&&u3[2]<=dHi()&&Date.now()-(Z.rosto||0)<2500;")
tr("S2=Math.min(512,Math.round(lado))}","S2=Math.min(calmo?320:512,Math.round(lado))}")
tr("        else{Z.bx=null;if(n-(Z.rosto||0)>2000)chip(T('Não vejo o seu rosto'))}\n        Z.tm=setTimeout(laco,350);return}","        else{Z.bx=null;if(n-(Z.rosto||0)>2000)chip(T('Não vejo o seu rosto'))}\n        try{window.__lfCam={w:VW,h:VH,del:MP.del||'?',d:Z.d,ms:calmo?1000:350}}catch(_){}\n        Z.tm=setTimeout(laco,calmo?1000:350);return}")
# C4 medidor
tr("+'\\naparelho: '+(navigator.hardwareConcurrency||'?')","+(window.__lfCam?'\\ncâmera '+window.__lfCam.w+'×'+window.__lfCam.h+' · leitor '+(window.__lfCam.del==='GPU'?'placa de vídeo':window.__lfCam.del==='CPU'?'processador':'?')+' · mede a cada '+(window.__lfCam.ms/1000)+' s\\ndistância lida '+(window.__lfCam.d?Math.round(window.__lfCam.d)+' cm':'—'):'')+'\\naparelho: '+(navigator.hardwareConcurrency||'?')")
open(p,'w',encoding='utf8').write(s);print('ok')
