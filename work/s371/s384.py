# S384 (16/11/2026 12:32, dono: "quero testar primeiro"): MODO DE TESTE ?camt=1 — a medição da câmera roda num trabalhador ao lado (lfx/mp/mp-trab.js). Sem o parâmetro nada muda.
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:90]);s=s.replace(a,b)
# liga: no modo de teste tenta o trabalhador; se não der, segue o caminho normal
tr("      (window.__lfFakeMp?Promise.resolve(window.__lfFakeMp):mpLoad()).then(function(lm){Z.mp=lm;vai()},function(){});",
   "      if(CAMT&&!window.__lfFakeMp&&window.Worker&&window.createImageBitmap)wkLiga().then(vai,function(){mpLoad().then(function(lm){Z.mp=lm;vai()},function(){})});\n      else (window.__lfFakeMp?Promise.resolve(window.__lfFakeMp):mpLoad()).then(function(lm){Z.mp=lm;vai()},function(){});")
tr("    function laco(){if(!Z.el||!Z.st)return;var v=Z.v,fa=Z.fa;if(!v.videoWidth||(!Z.mp&&!fa)){Z.tm=setTimeout(laco,250);return}",
"""    /* S384 — modo de teste (?camt=1): a leitura do rosto num trabalhador ao lado. wkLiga cria e prepara; wkFalha desliga e volta ao leitor normal */
    var CAMT=false;try{CAMT=/[?&]camt=1/.test(location.search)||sessionStorage.getItem('lf_camt')==='1';if(CAMT)sessionStorage.setItem('lf_camt','1')}catch(_){}
    function wkLiga(){return new Promise(function(ok,no){if(Z.wk&&Z.wk.ok){ok();return}try{var base=new URL(FAB+'mp/',document.baseURI).href,w=new Worker(base+'mp-trab.js'),t=setTimeout(function(){try{w.terminate()}catch(_){}no(new Error('tempo'))},25000);
      w.onmessage=function(e){var d=e.data;if(d.t==='ok'){clearTimeout(t);Z.wk={w:w,ok:true,del:d.del,id:0};MP.del=d.del;w.onmessage=function(e2){var c=Z.wk&&Z.wk.cb;if(e2.data.t==='r'&&c)c(e2.data)};ok()}else if(d.t==='erro'){clearTimeout(t);try{w.terminate()}catch(_){}no(new Error(d.m))}};
      w.onerror=function(){clearTimeout(t);try{w.terminate()}catch(_){}no(new Error('trab'))};w.postMessage({t:'ini',base:base})}catch(e){no(e)}})}
    function wkFalha(){if(Z.wk){try{clearTimeout(Z.wk.to);Z.wk.w.terminate()}catch(_){}Z.wk=null}window.__lfWkFalhou=1;if(!Z.mp)mpLoad().then(function(lm){Z.mp=lm},function(){})}
    function laco(){if(!Z.el||!Z.st)return;var v=Z.v,fa=Z.fa,wkOk=!!(Z.wk&&Z.wk.ok);if(!v.videoWidth||(!Z.mp&&!fa&&!wkOk)){Z.tm=setTimeout(laco,250);return}""")
tr("      if(Z.mp){var VW=v.videoWidth,VH=v.videoHeight,","      if(Z.mp||wkOk){var VW=v.videoWidth,VH=v.videoHeight,")
a="""        var W2=bx?S2:Math.min(640,VW),H2=bx?S2:Math.round(W2*VH/VW),c2=Z.cv2||(Z.cv2=document.createElement('canvas'));c2.width=W2;c2.height=H2;c2.getContext('2d').drawImage(v,sx,sy,sw,sh,0,0,W2,H2);
        Z.mpk=sw/W2;var r=null;try{r=Z.mp.detect(c2)}catch(_){r=null}var P=r&&r.faceLandmarks&&r.faceLandmarks[0],n=Date.now();
        if(P&&P.length>=478){"""
b="""        var W2=bx?S2:Math.min(640,VW),H2=bx?S2:Math.round(W2*VH/VW);Z.mpk=sw/W2;
        var proc=function(P){var n=Date.now();
        if(P&&P.length>=478){"""
tr(a,b)
a="""        else{Z.bx=null;if(n-(Z.rosto||0)>2000)chip(T('Não vejo o seu rosto'))}
        try{window.__lfCam={w:VW,h:VH,del:MP.del||'?',d:Z.d,ms:350}}catch(_){}
        Z.tm=setTimeout(laco,350);return}"""
b="""        else{Z.bx=null;if(n-(Z.rosto||0)>2000)chip(T('Não vejo o seu rosto'))}
        try{window.__lfCam={w:VW,h:VH,del:MP.del||'?',d:Z.d,ms:350,fora:!!(Z.wk&&Z.wk.ok),lms:Z.wk&&Z.wk.ms}}catch(_){}
        Z.tm=setTimeout(laco,350)};
        if(wkOk){var my=++Z.wk.id,st0=Z.st,wk0=Z.wk;
          createImageBitmap(v,Math.round(sx),Math.round(sy),Math.round(sw),Math.round(sh),{resizeWidth:W2,resizeHeight:H2,resizeQuality:'medium'}).then(function(bm){
            if(!Z.el||Z.st!==st0||Z.wk!==wk0){try{bm.close()}catch(_){}return}
            wk0.cb=function(d){if(d.id!==my)return;clearTimeout(wk0.to);if(!Z.el||Z.st!==st0)return;if(d.erro){wkFalha();proc(null);return}var P=null;if(d.P){P=[];for(var i=0;i<478;i++)P.push({x:d.P[2*i],y:d.P[2*i+1]})}wk0.ms=d.ms;proc(P)};
            wk0.to=setTimeout(function(){if(Z.wk!==wk0)return;wkFalha();if(Z.el&&Z.st===st0)proc(null)},8000);wk0.w.postMessage({t:'img',id:my,bm:bm},[bm])},
            function(){wkFalha();if(Z.el&&Z.st===st0)Z.tm=setTimeout(laco,350)});return}
        var c2=Z.cv2||(Z.cv2=document.createElement('canvas'));c2.width=W2;c2.height=H2;c2.getContext('2d').drawImage(v,sx,sy,sw,sh,0,0,W2,H2);
        var r=null;try{r=Z.mp.detect(c2)}catch(_){r=null}proc(r&&r.faceLandmarks&&r.faceLandmarks[0]);return}"""
tr(a,b)
tr("+' · leitor '+(window.__lfCam.del==='GPU'?'placa de vídeo':window.__lfCam.del==='CPU'?'processador':'?')+","+' · leitor '+(window.__lfCam.del==='GPU'?'placa de vídeo':window.__lfCam.del==='CPU'?'processador':'?')+(window.__lfCam.fora?' · AO LADO (teste)'+(window.__lfCam.lms?' '+Math.round(window.__lfCam.lms)+' ms':''):window.__lfWkFalhou?' · teste falhou, voltou ao normal':'')+")
open(p,'w',encoding='utf8').write(s);print('ok')
