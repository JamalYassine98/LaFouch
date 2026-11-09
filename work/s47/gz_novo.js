    /* 09/11 S47 + S47b + S47c (aprovados): medida de verdade. Mede o ponto mais perto em que a letra fica nítida (sem óculos), 2 vezes
       (3 se ficarem diferentes). Só vale a distância onde a pessoa PARA: o vai e vem e o movimento rápido são ignorados. Sem desfoque falso.
       Aviso no começo (não serve para miopia, astigmatismo e multifocal); um toque só ("Começar"); nítido a menos de 25 cm = tela de miopia.
       O guia de voz reage ao que a pessoa faz (frases curtas, não repete em menos de 10 s, não fala por cima). */
    var FRASE=function(){return T('Para ler bem de perto, o olho precisa focar. Depois dos 40 anos esse foco vai ficando mais longe, e o óculos de leitura traz ele de volta.')};
    var DIT={};
    function diz(k,t,forte){var n=Date.now();if(!forte){if(DIT[k]&&n-DIT[k]<10000)return;if(n<(Z.ocup||0))return}DIT[k]=n;Z.ocup=n+Math.min(7000,900+t.length*60);fala(t)}
    function avisos(){return '<div class="gzav"><p><b>'+T('Serve para:')+'</b> '+T('ler de perto — livro, celular, cardápio, costura.')+'</p><p><b>'+T('Não serve para:')+'</b> '+T('ver de longe ou dirigir.')+'</p>'+
      '<p><b>'+T('Miopia:')+'</b> '+T('óculos de leitura não corrigem. Se lê bem de perto sem óculos, não precisa deles.')+'</p><p><b>'+T('Astigmatismo:')+'</b> '+T('o óculos de leitura pronto não corrige. Pode até ajudar, mas o ideal é um óculos feito com a sua receita.')+'</p>'+
      '<p><b>'+T('Multifocal:')+'</b> '+T('é feito sob medida numa ótica, com receita. Este teste não consegue medir.')+'</p><p class="mu"><b>'+T('Não substitui o oftalmologista.')+'</b> '+T('Procure um se tiver dor de cabeça ao ler, visão dupla, um olho bem pior que o outro ou se a visão mudou de repente.')+'</p></div>'}
    function passo1(){cam();DIT={};Z.ocup=0;Z.fase='intro';
      tela('<div class="gzeb">'+T('DESCUBRA O SEU GRAU')+'</div><h2>'+T('Descubra o grau do seu óculos de leitura em 1 minuto')+'</h2>'+
        '<div class="gzav"><p>'+T('Serve só para ler de perto.')+'</p><p><b>'+T('Não funciona')+'</b> '+T('para miopia, astigmatismo ou multifocal — nesses casos o certo é a receita do oftalmologista.')+'</p><p class="mu">'+T('Não substitui a consulta.')+'</p></div>'+
        '<button type="button" class="gzgo" data-gz="comeca">'+T('Começar')+'</button>',
        T('Este teste é para óculos de leitura. Se você tem miopia, astigmatismo ou usa multifocal, ele não vai servir para você.'))}
    function prep(){cam();Z.fase='prep';Z.hist=[];Z.b0=null;Z.ms=[];Z.k=1;Z.semcam=false;Z.rosto=0;Z.sr=0;Z.d=0;Z.dir=0;Z.rev=[];
      tela('<div class="gzeb">'+T('PREPARANDO')+'</div><h2>'+T('Se usa óculos, tire agora')+'</h2><p class="gzp">'+T('Lente de contato pode ficar. Depois, segure o celular bem perto do rosto, a um palmo.')+'</p>'+
        '<div class="gzrg" id="gzrg" style="--p:0"><b id="gzrn">3</b></div><p class="gzp" style="text-align:center">'+T('Começa sozinho quando encontrar o seu rosto.')+'</p><div class="gzst" id="gzst"><i></i><span>'+T('Procurando o seu rosto…')+'</span></div>',
        T('Se você usa óculos, tire agora. Lente pode ficar. Depois, segure o celular bem perto do rosto, a um palmo.'));
      Z.ocup=Date.now()+6500;Z.t0=Date.now();medir();conta()}
    function conta(){if(!Z.el||Z.fase!=='prep')return;var s=(Date.now()-Z.t0)/1000,r=Z.el.querySelector('#gzrg'),n=Z.el.querySelector('#gzrn'),f=Math.max(0,Math.ceil(4-s));
      if(n)n.textContent=f?String(f):'✓';if(r)r.style.setProperty('--p',Math.min(1,s/4).toFixed(3));
      if(s>=4&&(Z.semcam||(Z.rosto&&Date.now()-Z.rosto<800))){if(Z.semcam)manual();else mede(1);return}
      if(s>=10&&!Z.rosto&&!Z.semcam)diz('rosto',T('Não estou vendo o seu rosto. Deixe a câmera de cima livre e olhe para a tela.'));
      Z.tc=setTimeout(conta,150)}
    function semCam(){Z.semcam=true;if(Z.fase==='med'||Z.fase==='anal')manual()}
    function medir(){Z.semcam=false;
      if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){semCam();return}
      var v=Z.v=document.createElement('video');v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');
      navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'user',width:{ideal:640},height:{ideal:480}}}).then(function(s){if(!Z.el){s.getTracks().forEach(function(t){t.stop()});return}Z.st=s;v.srcObject=s;var p=v.play();if(p&&p.catch)p.catch(function(){});
        faLoad().then(function(fa){Z.fa=fa;laco()},function(){semCam()})},function(){semCam()})}
    var med=function(a){var s=a.slice().sort(function(x,y){return x-y});return s[Math.floor(s.length/2)]};
    function laco(){if(!Z.el||!Z.st)return;var v=Z.v,fa=Z.fa;if(!v.videoWidth){Z.tm=setTimeout(laco,200);return}
      var W=480,H=Math.round(W*v.videoHeight/v.videoWidth),cv=Z.cv||(Z.cv=document.createElement('canvas'));cv.width=W;cv.height=H;cv.getContext('2d').drawImage(v,0,0,W,H);
      fa.detectSingleFace(cv,new fa.TinyFaceDetectorOptions({inputSize:320,scoreThreshold:.4})).withFaceLandmarks(!FA.full).then(function(r){if(!Z.el||!Z.st)return;var n=Date.now();
        if(r&&r.landmarks){var P=r.landmarks.positions,dd=function(a,b){return Math.hypot(P[a].x-P[b].x,P[a].y-P[b].y)},c=function(a,b){var x=0,y=0;for(var i=a;i<=b;i++){x+=P[i].x;y+=P[i].y}return [x/(b-a+1),y/(b-a+1)]},e1=c(36,41),e2=c(42,47),ipd=Math.hypot(e1[0]-e2[0],e1[1]-e2[1]);
          var f=(W/2)/Math.tan(31*Math.PI/180),d=f*6.3/ipd;
          var ear=((dd(37,41)+dd(38,40))/(2*dd(36,39))+(dd(43,47)+dd(44,46))/(2*dd(42,45)))/2,brow=((P[19].y-P[37].y)*-1+(P[24].y-P[44].y)*-1)/2/ipd;
          Z.rosto=n;Z.sr=0;Z.hist.push({t:n,d:d,ear:ear,brow:brow});Z.hist=Z.hist.filter(function(h){return n-h.t<4000})}
        else if(!Z.sr)Z.sr=n;
        try{analisa()}catch(_){}
        Z.tm=setTimeout(laco,120)},function(){Z.tm=setTimeout(laco,400)})}
    /* o que a pessoa está fazendo com o celular */
    function leitura(){var n=Date.now(),H=Z.hist,o={d:Z.d,v:0,par:false,dpar:0,vv:false,aperta:false,rosto:!!Z.rosto&&n-Z.rosto<900};if(!H.length)return o;
      var u=H[H.length-1];o.d=Z.d=med(H.slice(-3).map(function(h){return h.d}));
      var a=null;for(var i=H.length-1;i>=0;i--){if(u.t-H[i].t>=450){a=H[i];break}}o.v=a?(o.d-a.d)/((u.t-a.t)/1000):0;
      if(Math.abs(o.v)>6){var s=o.v>0?1:-1;if(Z.dir&&s!==Z.dir)Z.rev.push(n);Z.dir=s}Z.rev=Z.rev.filter(function(t){return n-t<3000});o.vv=Z.rev.length>=2;
      var j=H.filter(function(h){return n-h.t<=1500}),ds=j.map(function(h){return h.d});o.par=o.rosto&&j.length>=5&&n-j[0].t>1100&&(Math.max.apply(0,ds)-Math.min.apply(0,ds))<3.5;o.dpar=o.par?med(ds):0;
      if(!Z.b0&&H.length>=8)Z.b0={ear:med(H.map(function(h){return h.ear})),brow:med(H.map(function(h){return h.brow}))};
      if(Z.b0){var k=H.slice(-5);o.aperta=med(k.map(function(h){return h.ear}))<Z.b0.ear*.82||med(k.map(function(h){return h.brow}))<Z.b0.brow*.88}
      return o}
    function tags(L){var sg=Z.el&&Z.el.querySelector('#gzsig');if(!sg)return;var h=L.map(function(x){return '<span'+(x[1]?' class="w"':'')+'>'+esc(x[0])+'</span>'}).join('');if(sg._h!==h){sg.innerHTML=h;sg._h=h}}
    function barra(d){var b=Z.el&&Z.el.querySelector('#gzbi'),c=Z.el&&Z.el.querySelector('#gzcmv');if(b)b.style.width=Math.max(3,Math.min(100,(d-15)/(80-15)*100)).toFixed(1)+'%';if(c)c.textContent=d?Math.round(d)+' cm':'—'}
    function analisa(){if(!Z.el)return;var n=Date.now(),o=leitura();
      if(Z.fase==='prep'){var s=Z.el.querySelector('#gzst');if(s&&o.rosto){s.classList.add('ok');s.querySelector('span').textContent=T('Rosto encontrado')+' · '+Math.round(o.d)+' cm'}return}
      if(Z.fase!=='med'&&Z.fase!=='anal')return;
      if(!o.rosto){if(Z.sr&&n-Z.sr>2000){tags([[T('Não estou vendo o seu rosto'),1]]);diz('rosto',T('Não estou vendo o seu rosto. Deixe a câmera de cima livre.'))}return}
      barra(o.d);
      if(Z.fase==='anal'){Z.am.push(o.d);var p=Math.min(1,(n-Z.ta)/2000),r=Z.el.querySelector('#gzrg'),q=Z.el.querySelector('#gzrn');
        if(Math.abs(o.d-Z.da)>6&&!o.par){mede(Z.k,true);diz('cont',T('Pode continuar afastando até ficar nítido.'),true);return}
        if(r)r.style.setProperty('--p',p.toFixed(3));if(q)q.textContent=String(Math.max(1,Math.ceil(2-(n-Z.ta)/1000)));
        var ck=Z.el.querySelector('#gzck');if(ck){var h='<div class="ok"><b>✓</b>'+T('Distância firme')+' · '+Math.round(o.d)+' cm</div>'+(o.aperta?'<div class="w"><b>!</b>'+T('Tente relaxar os olhos')+'</div>':'<div class="ok"><b>✓</b>'+T('Olhos relaxados')+'</div>');if(ck._h!==h){ck.innerHTML=h;ck._h=h}}
        if(p>=1)registra(med(Z.am));return}
      /* medindo */
      if(Z.sub==='perto'){var lim=Z.k>1&&Z.ms.length?Math.min(35,Z.ms[Z.ms.length-1]*.7):35;
        if(o.d<=lim){Z.sub='afasta';Z.dmin=o.d;Z.pd=0;var h2=Z.el.querySelector('h2');if(h2)h2.textContent=T('Afaste devagar até as letras ficarem nítidas');diz('afasta',T('Isso. Agora afaste devagar. Quando as letras ficarem nítidas, toque em “Ficou nítido”.'),true)}
        else if(n-Z.ts>2500)diz('aprox',Z.k>1?T('Aproxime o celular do rosto primeiro.'):T('Aproxime o celular do rosto, a um palmo.'));
        tags([[T('Aproxime do rosto')]]);return}
      Z.dmin=Math.min(Z.dmin,o.d);var L=[];
      if(o.vv){Z.uvv=n;L.push([T('Vai e vem percebido — esperando parar'),1]);diz('vaivem',T('Sem pressa. Esse vai e vem é normal. Pare onde ficou mais fácil de ler.'))}
      else if(o.v>15){L.push([T('Mais devagar'),1]);diz('rapido',T('Um pouquinho mais devagar.'))}
      else if(o.v>1.5&&o.v<=7){if(!Z.dv0)Z.dv0=n;if(!Z.devagar&&n-Z.dv0>1000){Z.devagar=true;diz('devagar',T('Isso, devagar…'))}L.push([T('Afastando devagar — ótimo')])}
      else Z.dv0=0;
      if(o.aperta){L.push([T('Olhos apertados'),1]);diz('olhos',T('Tente não apertar os olhos. Deixe o rosto relaxado e a letra aparecer sozinha.'))}
      tags(L);
      if(o.par){if(!Z.pd)Z.pd=n;
        if(o.dpar>=62&&n-Z.pd>1200){longe(true);return}
        if(Z.espera){analisar(o.dpar);return}
        if(n-Z.pd>2500&&o.dpar>=Z.dmin+8&&n-(Z.uvv||0)>1500&&!o.aperta){analisar(o.dpar);return}
        if(n-Z.pd>8000)diz('toque',T('Se as letras já estão nítidas, é só tocar em “Ficou nítido”.'))}
      else Z.pd=0;
      if(Z.espera&&n-Z.espera>3000)analisar(o.d)}
    function cab(k){var t=Math.max(2,Z.ms.length+1,k);return '<div class="gzeb">'+T('MEDIDA')+' '+k+' '+T('DE')+' '+t+'</div>'}
    function mede(k,volta){Z.fase='med';Z.k=k;Z.sub=volta?'afasta':'perto';Z.ts=Date.now();Z.devagar=volta?true:false;Z.dv0=0;Z.pd=0;Z.espera=0;Z.dmin=volta?Z.d:1e9;Z.rev=[];Z.dir=0;
      if(!volta&&k===1&&Z.d&&Z.d<=35){Z.sub='afasta';Z.dmin=Z.d}
      tela(cab(k)+'<h2>'+(Z.sub==='perto'?T('Aproxime o celular do rosto'):T('Afaste devagar até as letras ficarem nítidas'))+'</h2>'+
        '<div class="gzbx"><div class="gztx pq">'+esc(FRASE())+'</div></div>'+
        '<div class="gzbar"><i id="gzbi"></i></div><div class="gzcm"><span>15 cm</span><b id="gzcmv">—</b><span>80 cm</span></div><div class="gzsig" id="gzsig"></div>'+
        '<button type="button" class="gzgo" data-gz="nitido">'+T('Ficou nítido')+'</button><button type="button" class="gzgo o gzsm" data-gz="longe">'+T('Mesmo longe não consigo ler')+'</button>');
      if(volta)return;
      if(k===1){if(Z.sub==='afasta')diz('afasta',T('Agora afaste o celular devagar. Quando as letras ficarem nítidas, toque em “Ficou nítido”.'),true);else diz('aprox',T('Aproxime o celular do rosto, a um palmo.'),true)}
      else if(k===2)diz('m2',T('Agora mais uma vez, para ter certeza. Aproxime o celular do rosto e afaste de novo até ficar nítido.'),true);
      else diz('m3',T('As duas medidas ficaram diferentes. Vamos fazer mais uma: aproxime e afaste de novo.'),true)}
    function analisar(d){Z.fase='anal';Z.ta=Date.now();Z.da=d||Z.d;Z.am=[];Z.espera=0;
      tela('<div class="gzeb">'+T('ANALISANDO')+'</div><h2>'+T('Segure parado onde está')+'</h2><div class="gzrg" id="gzrg" style="--p:0"><b id="gzrn">2</b><small>'+T('segundos')+'</small></div><div class="gzck" id="gzck"></div>'+
        (Z.ms.length?'':'<p class="gzp" style="text-align:center;margin-top:12px">'+T('Depois, mais uma vez para confirmar.')+'</p>'),'');
      diz('segura',T('Segure parado…'),true)}
    function registra(d){Z.ms.push(d);
      if(d<25){miopia(d);return}
      if(Z.ms.length<2){mede(2);return}
      var gs=Z.ms.map(grauDe),best=null;for(var i=0;i<gs.length;i++)for(var j=i+1;j<gs.length;j++){var z=Math.abs(gs[i]-gs[j]);if(!best||z<best.z-1e-9)best={z:z,i:i,j:j}}
      if(best.z<=.5+1e-9){var G=Math.floor(((gs[best.i]+gs[best.j])/2)*4+1e-9)/4;resultado(Math.max(.25,G),[Z.ms[best.i],Z.ms[best.j]]);return}
      if(Z.ms.length<3){mede(3);return}
      instavel()}
    function grauDe(dcm){/* ponto próximo: o olho foca 1/d; para ler a 40 cm com folga, guarda metade disso */var A=100/Math.max(15,dcm),g=2.5-A/2;g=Math.round(g*4)/4;return Math.max(.25,Math.min(4,g))}
    function resultado(G,ds,aprox,man){cam();Z.fase='res';Z.G=G;Z.g=G;Z.man=false;var lo=gf(Math.max(.25,G-.25)),hi=gf(Math.min(4,G+.25));
      var por=aprox?T('Mesmo com o braço esticado ficou difícil. Comece com este grau e, se ainda estiver fraco, prove um mais forte.'):man?T('Pela distância que você escolheu.'):T('Medido')+' '+ds.length+' '+T('vezes')+': '+ds.map(function(x){return Math.round(x)}).join(T(' e '))+' cm';
      tela('<div class="gzeb">'+T('SEU GRAU PARA COMEÇAR')+'</div><div class="gzrs"><div class="gzres">'+gf(G)+'</div><p class="gzp">'+por+'<br>'+T('Faixa provável:')+' '+lo+' '+T('a')+' '+hi+'</p></div>'+
        '<p class="gzp" style="text-align:center;margin-top:14px">'+T('Quer escolher outro?')+'</p>'+
        '<div class="gzaj"><button type="button" class="gzpm" data-gz="menos" aria-label="'+T('Menos grau')+'">−</button><div><b id="gzgv">'+gf(G)+'</b><small id="gzgl">'+T('sugerido')+'</small></div><button type="button" class="gzpm" data-gz="mais" aria-label="'+T('Mais grau')+'">+</button></div>'+
        '<p class="gzp" style="text-align:center;font-size:13.5px;margin-top:6px">'+T('A tela não consegue mostrar como você vai enxergar com o óculos. Na dúvida entre dois graus, fique com o menor.')+'</p>'+
        '<button type="button" class="gzgo" data-gz="ver" id="gzver">'+T('Ver óculos de leitura')+' '+gf(G)+'</button><button type="button" class="gzgo o" data-gz="guarda">'+T('Guardar meu grau')+'</button>'+avisos(),
        T('Pronto. Para começar, o grau que mais combina com você é ')+gf(G)+'.')}
    function longe(braco){resultado(2.5,[],true);if(braco)fala(T('Parece que precisou esticar o braço todo. Para começar, o grau que mais combina com você é ')+gf(2.5)+'.')}
    function miopia(d){cam();Z.fase='res';
      tela('<div class="gzeb">'+T('RESULTADO')+'</div><h2>'+T('Você lê bem de perto sem óculos')+'</h2><p class="gzp">'+T('As letras ficaram nítidas a')+' '+Math.round(d)+' cm'+T(' — típico de miopia.')+'</p>'+
        '<div class="gzav"><p>'+T('Óculos de leitura não vão ajudar você. Para ler, o mais simples é tirar os seus óculos.')+'</p><p>'+T('Para ver longe e perto com um óculos só, o certo é um multifocal, feito numa ótica com a receita do oftalmologista.')+'</p></div>'+
        '<button type="button" class="gzgo o" data-gz="inicio">'+T('Voltar ao início')+'</button>',
        T('Boa notícia: você lê bem de perto sem óculos. Óculos de leitura não são para você.'))}
    function instavel(){cam();Z.fase='res';
      tela('<div class="gzeb">'+T('RESULTADO')+'</div><h2>'+T('O resultado não ficou firme')+'</h2><p class="gzp">'+T('As três medidas ficaram bem diferentes entre si, então não vamos chutar um grau. Vale consultar um oftalmologista.')+'</p>'+
        '<button type="button" class="gzgo" data-gz="comeca">'+T('Tentar de novo')+'</button><button type="button" class="gzgo o" data-gz="inicio">'+T('Voltar ao início')+'</button>',
        T('As medidas ficaram bem diferentes entre si. Para não chutar um grau, vale consultar um oftalmologista.'))}
    function manual(){cam();Z.fase='man';
      tela('<div class="gzeb">'+T('SEM CÂMERA')+'</div><h2>'+T('Afaste devagar até as letras ficarem nítidas')+'</h2><div class="gzbx"><div class="gztx pq">'+esc(FRASE())+'</div></div><p class="gzp" style="margin-top:14px">'+T('Onde ficou nítido?')+'</p>'+
        [[20,'Bem perto do rosto'],[32,'Um palmo e meio'],[42,'Dois palmos'],[55,'Braço quase esticado'],[65,'Braço esticado']].map(function(x){return '<button type="button" class="gzgo o gzsm" data-gzd="'+x[0]+'">'+T(x[1])+'</button>'}).join('')+
        '<button type="button" class="gzgo o gzsm" data-gz="longe">'+T('Mesmo longe não consigo ler')+'</button>',
        T('A câmera não abriu, sem problema. Afaste o celular devagar e me diga onde as letras ficaram nítidas.'))}
