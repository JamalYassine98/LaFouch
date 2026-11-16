# S369: Mochi no computador, partes 2 e 3 (aprovado 13/11; "implemente" do dono em 16/11 01:34). Edita catalogo/js/lf-site.js.
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf-8').read()
def tr(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:70])
    s=s.replace(a,b)
# 1) ajudas
tr("    function naIntro(){return !!(Z.m&&Z.fase==='intro'&&!Z.vaiCom)}",
"""    /* S369 (16/11, aprovado em 13/11): no computador o teste é a 60 cm ("um braço"), com a letra na proporção da distância (60 cm = 2x a de 30 cm; com webcam vale de 45 a 75 cm),
       sem a segunda medida, e o resultado é mostrado como estimativa. kb = reconhecimento silencioso do iPhone/iPad (tamanho real do ponto da tela; os outros aparelhos usam o valor médio). */
    function kbAparelho(){try{var u=navigator.userAgent,ip=/iPhone|iPod/.test(u),pad=/iPad/.test(u)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);if(!ip&&!pad)return 1;
      var w=Math.min(screen.width,screen.height),mm=ip?((window.devicePixelRatio||2)>=3?.166:.156):(w===744?.156:.192);return Math.min(1.25,Math.max(1,.188/mm))}catch(_){return 1}}
    function kLetra(){return (Z.kd||1)*(Z.kb||1)}
    function dLo(){return Z.pc?45:20}function dHi(){return Z.pc?75:38}
    function chipDist(){return T(Z.pc?'Fique a 60 cm':'Segure a 30 cm')}
    function falaSeq(a,cb){var i=0,fase=Z.fase;(function w(){if(!Z.m||Z.fase!==fase)return;if(i>=a.length){cb&&cb();return}fala(a[i++],w)})()}
    function distOk(){return Z.d>=dLo()&&Z.d<=dHi()}
    function ajustaDist(cb){if(!Z.pc||Z.semCam||!Z.st||!Z.d||Date.now()-(Z.rosto||0)>1500||distOk()){cb();return}
      fala(T(Z.d>dHi()?'Chegue um pouquinho mais perto da tela.':'Afaste-se um pouquinho da tela.'),function(){var t0=Date.now();(function w(){if(!Z.m||Z.fase!=='prep')return;if(distOk()||Date.now()-t0>5000){cb();return}Z.tc=setTimeout(w,250)})()})}
    function naIntro(){return !!(Z.m&&Z.fase==='intro'&&!Z.vaiCom)}""")
# 2) estado
tr("function intro(){Z.fase='intro';Z.vaiCom=0;","function intro(){Z.pc=ehPc();Z.kb=kbAparelho();Z.kd=1;Z.fase='intro';Z.vaiCom=0;")
tr("var m=Z.m;if(!m)return;Z.fase='cam';Z.dir=0;","var m=Z.m;if(!m)return;Z.pc=ehPc();Z.kb=kbAparelho();Z.fase='cam';Z.dir=0;")
tr("function teste(){if(!Z.el)return;Z.el.scrollTop=0;Z.fase='teste';","function teste(){if(!Z.el)return;Z.kd=Z.pc?Math.min(75,Math.max(45,(Z.st&&Z.d&&Date.now()-(Z.rosto||0)<3000)?Z.d:60))/30:1;Z.el.scrollTop=0;Z.fase='teste';")
# 3) letra
tr("if(l)l.style.fontSize=(FS[i]*e)+'px'});cabe(Z.at)","if(l)l.style.fontSize=(FS[i]*e*kLetra())+'px'});cabe(Z.at)")
tr("cx.font=(FS[8]*escala(GS[GS.length-1][0]))+'px '","cx.font=(FS[8]*escala(GS[GS.length-1][0])*kLetra())+'px '")
tr("l1.style.fontSize=FS[3]+'px'","l1.style.fontSize=(FS[3]*kLetra())+'px'")
# 4) etiqueta e limites
tr("chip(T('Segure a 30 cm'))","chip(chipDist())",4)
tr("if(Z.d>38)chip(Math.round(Z.d)+' cm',false,true);else if(Z.d<20)chip(Math.round(Z.d)+' cm');","if(Z.d>dHi())chip(Math.round(Z.d)+' cm',false,true);else if(Z.d<dLo())chip(Math.round(Z.d)+' cm');")
tr("return a.every(function(x){return x[1]>LIM})}","return a.every(function(x){return x[1]>(Z.pc?79:LIM)})}")
# 5) falas e textos
tr("fala(T('Posso usar a câmera?')+' '+T('É só para medir a distância do celular até o seu rosto.')+' '+T('Nada é gravado.')+' '+T('Se preferir, a gente faz sem.'),function(){if(Z.m&&Z.fase==='cam'&&!Z.escolheu)Z.m.ocioso=true})})}",
   "var fimC=function(){if(Z.m&&Z.fase==='cam'&&!Z.escolheu)Z.m.ocioso=true};if(Z.pc)falaSeq([T('Posso usar a câmera?'),T('É só para medir a distância da tela até o seu rosto.'),T('Nada é gravado.')+' '+T('Se preferir, a gente faz sem.')],fimC);else fala(T('Posso usar a câmera?')+' '+T('É só para medir a distância do celular até o seu rosto.')+' '+T('Nada é gravado.')+' '+T('Se preferir, a gente faz sem.'),fimC)})}")
tr("prep(T('Tudo bem, sem problema!')+' '+T('Vamos sem a câmera: segure o celular a uns 30 centímetros, um palmo.'))}",
   "prep(Z.pc?[T('Tudo bem, sem problema!'),T('Vamos sem a câmera: fique a um braço da tela, uns 60 centímetros.')]:T('Tudo bem, sem problema!')+' '+T('Vamos sem a câmera: segure o celular a uns 30 centímetros, um palmo.'))}")
tr("<h2>'+T('Tire os óculos e segure o celular a 30 cm')+'</h2><p class=\"gzp\">'+T('Um palmo do rosto. Lente de contato pode ficar.')+'</p>'",
   "<h2>'+T(Z.pc?'Tire os óculos e fique a 60 cm da tela':'Tire os óculos e segure o celular a 30 cm')+'</h2><p class=\"gzp\">'+T(Z.pc?'Um braço até a tela. Lente de contato pode ficar.':'Um palmo do rosto. Lente de contato pode ficar.')+'</p>'")
tr("if(pre)fala(pre,ini);else ini();","if(pre&&pre.pop)falaSeq(pre,ini);else if(pre)fala(pre,ini);else ini();")
tr("fala(T('…e segure o celular a 30 centímetros, um palmo.'),function(){Z.tc=setTimeout(teste,700)})",
   "fala(T(Z.pc?'…e fique a 60 centímetros da tela, um braço.':'…e segure o celular a 30 centímetros, um palmo.'),function(){ajustaDist(function(){Z.tc=setTimeout(teste,700)})})")
tr("var f=T('Segure a um palmo e me diga de novo.');if(!Z.bracoDisse){Z.bracoDisse=1;f=T('Você afastou o celular para conseguir ler — isso é sinal de vista cansada.')+' '+f}\n      fala(f,function(){Z.qt=Date.now();espera()},true)}",
   "var f=T(Z.pc?'Chegue um pouquinho mais perto da tela.':'Segure a um palmo e me diga de novo.'),fimB=function(){Z.qt=Date.now();espera()};\n      if(!Z.bracoDisse){Z.bracoDisse=1;var f1=T(Z.pc?'Você se afastou da tela para conseguir ler — isso é sinal de vista cansada.':'Você afastou o celular para conseguir ler — isso é sinal de vista cansada.');if(Z.pc){fala(f1,function(){if(Z.m&&Z.fase==='teste')fala(f,fimB,true)},true);return}f=f1+' '+f}\n      fala(f,fimB,true)}")
# 6) sem segunda medida no computador
tr("function fimQuadro(G){if(!Z.m)return;if(Z.semCam||","function fimQuadro(G){if(!Z.m)return;if(Z.pc||Z.semCam||")
# 7) resultado como estimativa
tr("(esc0?'<p class=\"gzp gzlz\">'+T('Feito com pouca luz — pode ter saído um pouco mais forte.')+'</p>':'')+'</div>'+",
   "(esc0?'<p class=\"gzp gzlz\">'+T('Feito com pouca luz — pode ter saído um pouco mais forte.')+'</p>':'')+(Z.pc?'<p class=\"gzp gzest\">'+T('No computador este resultado é uma estimativa.')+' '+T('Para confirmar, faça o teste no celular.')+'</p>':'')+'</div>'+")
tr("T('Pronto! O grau que mais combina com você é')+' '+gf(G)+'.',function(){if(!Z.m)return;Z.m.acena(6);setTimeout(function(){if(!Z.m)return;m.cara('n');m.ocioso=true},1500)})},500)}",
   "T('Pronto! O grau que mais combina com você é')+' '+gf(G)+'.',function(){if(!Z.m)return;var fimR=function(){if(!Z.m)return;Z.m.acena(6);setTimeout(function(){if(!Z.m)return;m.cara('n');m.ocioso=true},1500)};if(Z.pc&&Z.fase==='res')fala(T('No computador este resultado é uma estimativa.')+' '+T('Para confirmar, faça o teste no celular.'),fimR);else fimR()})},500)}")
# 8) a Mochi vai ao código QR, aponta e volta ao Começar (vídeo v3 aprovado, work/s218/s220_mochi_qr_v3.mp4)
tr("    function chamaComecar(){var m=Z.m,b=q('#gzcom'),s=q('#gzstg');if(!naIntro()||!b)return;if(Z.falando){Z.ti=setTimeout(chamaComecar,400);return}",
"""    function qrVai(volta){var m=Z.m,c=q('.lxqr'),qe=c&&c.querySelector('.q svg')?c.querySelector('.q'):null;if(!naIntro()||!qe||RM.matches){if(c)c.classList.add('on');volta();return}
      var x0=m.x,y0=m.y,e=m.el.getBoundingClientRect(),C=c.getBoundingClientRect(),Q=qe.getBoundingClientRect(),nx=x0+(C.right+14-e.left),ny=y0+(Q.top+Q.height/2-e.height*.55-e.top);
      if(C.right+14+e.width>innerWidth-4||Q.bottom>innerHeight){c.classList.add('on');volta();return}
      var regressa=function(){if(!naIntro())return;fala(T('…ou seguimos aqui, como preferir.'));m.vara(0);m.pula(x0,y0,760,70,function(){if(!naIntro())return;m.vara(1);Z.ti=setTimeout(function(){var w=function(){if(!naIntro())return;if(Z.falando){Z.ti=setTimeout(w,300);return}volta()};w()},350)})};
      fala(T('Este teste fica melhor no celular.'),function(){if(!naIntro())return;fala(T('Aponte a câmera para este código…'),function(){Z.ti=setTimeout(regressa,500)});setTimeout(function(){naIntro()&&m.toca()},500)});
      Z.ti=setTimeout(function(){if(!naIntro())return;m.vara(0);m.pula(nx,ny,760,70,function(){if(!naIntro())return;m.vara(1);m.mira(18,34,420);m.olhaPara(Q.left+Q.width/2,Q.top+Q.height/2);
        setTimeout(function(){if(!naIntro())return;var g=m.el.querySelector('.luva');if(!g)return;var G=g.getBoundingClientRect(),Q2=qe.getBoundingClientRect(),ex=Q2.right-10-(G.left+G.width/2),ey=Q2.top+Q2.height/2-(G.top+G.height/2);if(Math.abs(ex)+Math.abs(ey)>2)m.flutua(m.x+ex,m.y+ey,220)},520)});
        setTimeout(function(){c.classList.add('on')},420)},500)}
    function chamaComecar(ja){var m=Z.m,b=q('#gzcom'),s=q('#gzstg');if(!naIntro()||!b)return;if(Z.falando){Z.ti=setTimeout(function(){chamaComecar(ja)},400);return}
      if(Z.pc&&!ja&&q('.lxqr')){qrVai(function(){chamaComecar(1)});return}""")
# o cartão do código só surge quando ela pula até ele (como no vídeo aprovado); se a pessoa tocar em Começar antes, não faz falta
tr("e.innerHTML=window.LFqr.svg(location.href.split('#')[0]);setTimeout(function(){d.classList.add('on')},RM.matches?0:900)};","e.innerHTML=window.LFqr.svg(location.href.split('#')[0]);if(RM.matches||mudo())d.classList.add('on');else setTimeout(function(){d.classList.add('on')},60000)};")
open(p,'w',encoding='utf-8').write(s);print('ok')
