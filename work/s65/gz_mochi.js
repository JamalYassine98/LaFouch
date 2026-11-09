  /* 09/11 S54–S64 (aprovados): "Descubra o seu grau" = consulta com o Mochi.
     Celular a 40 cm, sem óculos. Quadro com 9 frases do maior para o menor; o Mochi aponta a frase da frente e, a cada "Consigo ler",
     puxa o quadro para cima. Onde a pessoa trava, ele traz a lente (o quadro todo cresce no tamanho que ela leria com aquele grau) e
     vai subindo a lente até a pessoa ler a bula (última frase); confere uma lente mais fraca, como o médico. A letra do quadro tem tamanho
     fixo: o "Texto grande" do site não mexe nela. O Mochi é vivo: respira, pisca, reage e passeia por zonas livres (nunca em cima do texto
     nem dos botões). Sem desfoque falso; aviso de miopia/astigmatismo/multifocal; não substitui o oftalmologista. */
  (function(){
    var T=function(x){return LFI.tr(x)},ES=LFI.lang==='es',RM=matchMedia('(prefers-reduced-motion: reduce)');
    var Z={el:null,st:null,tm:0,v:null,cv:null,fa:null,d:0,rosto:0,fase:''};
    var gf=function(x){return '+'+(+x).toFixed(2)},gn=function(s){return parseFloat(String(s).replace(',','.'))||0};
    var gfala=function(x){return (ES?'más ':'mais ')+(+x).toFixed(2).replace('.',',')};
    function meu(){try{return localStorage.getItem('lf_meugr')||''}catch(_){return ''}}
    function mudo(){try{return localStorage.getItem('lf_gzmudo')==='1'}catch(_){return false}}
    var SPK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
    var MUT='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M16 9l5 6M21 9l-5 6"/></svg>';
    var BK='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
@@RIG@@
    /* ---------- voz (áudios gravados quando houver; senão a voz mais natural do celular) ---------- */
    var VZ={m:null,a:null};try{fetch('/media/voz/'+(ES?'es':'pt')+'/lista.json',{cache:'force-cache'}).then(function(r){return r.ok?r.json():null}).then(function(j){VZ.m=j}).catch(function(){})}catch(_){}
    function falaArq(t){if(!VZ.m)return false;var ps=t.split(/(?<=[.!?…])\s+/).map(function(x){return x.trim()}).filter(Boolean),fs=[];for(var i=0;i<ps.length;i++){var f=VZ.m[ps[i]];if(!f)return false;fs.push(f)}
      var k=0,toca=function(){if(k>=fs.length||!Z.el)return;var a=VZ.a=new Audio('/media/voz/'+(ES?'es':'pt')+'/'+fs[k++]);a.onended=toca;a.play().catch(function(){})};if(VZ.a)try{VZ.a.pause()}catch(_){}toca();return true}
    function fala(h){var b=Z.el&&Z.el.querySelector('#gzbal'),t=String(h).replace(/<[^>]+>/g,'');if(b){b.classList.remove('on');setTimeout(function(){if(!Z.el)return;b.innerHTML=h;b.classList.add('on')},120)}
      if(Z.m)Z.m.fala(Math.min(3600,500+t.length*45));Z.ocup=Date.now()+Math.min(7000,900+t.length*60);
      if(VZ.a)try{VZ.a.pause()}catch(_){}try{speechSynthesis.cancel();if(mudo()||!t)return;if(falaArq(t))return;var u=new SpeechSynthesisUtterance(t.replace(/\+(\d)[.,](\d\d)/g,function(m,a,b){return gfala(a+'.'+b)}));u.lang=ES?'es-ES':'pt-BR';
        var vs=speechSynthesis.getVoices().filter(function(v){return v.lang&&v.lang.toLowerCase().indexOf(ES?'es':'pt')===0}),nota=function(v){return (/natural|neural|online|premium|enhanced|google/i.test(v.name)?4:0)+(!v.localService?2:0)+((ES?/419|PY|AR|MX|US/:/BR/).test(v.lang)?1:0)};vs.sort(function(a,b){return nota(b)-nota(a)});if(vs.length)u.voice=vs[0];u.rate=1;speechSynthesis.speak(u)}catch(_){}}
    var DIT={};function diz(k,t,forte){var n=Date.now();if(!forte){if(DIT[k]&&n-DIT[k]<10000)return;if(n<(Z.ocup||0))return}DIT[k]=n;fala(t)}
    /* ---------- quadro: 9 frases, tamanhos fixos ---------- */
    var LS=[T('Bom dia!'),T('A casa é azul.'),T('O café está pronto.'),T('Ligue para a farmácia.'),T('O ônibus passa às oito.'),T('Leia a receita com calma.'),T('O jornal fala do tempo.'),T('Tome 1 comprimido ao dia.'),T('Agite antes de usar.')];
    var FS=[22,19,16.5,14.5,12.6,11,9.6,8.4,7.3];
    /* quem lê até a frase k (sem óculos, a 40 cm) costuma precisar deste grau; e o tamanho de letra equivalente a cada grau */
    var GK=[3,2.5,2,1.75,1.5,1.25,1,.75,0],GS=[[0,7.3],[.75,8.4],[1,9.6],[1.25,11],[1.5,12.6],[1.75,14.5],[2,16.5],[2.5,19],[3,22],[3.5,25.5],[4,29.5]];
    function escala(g){if(!g)return 1;for(var i=1;i<GS.length;i++){if(g<=GS[i][0]){var a=GS[i-1],b=GS[i];return (a[1]+(b[1]-a[1])*(g-a[0])/(b[0]-a[0]))/7.3}}return GS[GS.length-1][1]/7.3}
    function zoom(){var z=parseFloat(document.body.style.zoom)||1;return z}
    /* ---------- tela ---------- */
    function cam(){if(Z.tm){clearTimeout(Z.tm);Z.tm=0}if(Z.st){Z.st.getTracks().forEach(function(t){t.stop()});Z.st=null}}
    var INERT=[];
    function trava(on){if(on){INERT=[].slice.call(document.body.children).filter(function(e){return e!==Z.el&&!e.matches('.top,script,style')&&!e.hasAttribute('inert')});INERT.forEach(function(e){e.setAttribute('inert','')})}else{INERT.forEach(function(e){e.removeAttribute('inert')});INERT=[]}}
    function fecha(dePop){if(!Z.el)return;cam();clearTimeout(Z.tc);Z.fase='';try{speechSynthesis.cancel()}catch(_){}if(VZ.a)try{VZ.a.pause()}catch(_){}var e=Z.el;Z.el=null;Z.m=null;document.documentElement.classList.remove('gzon');trava(false);
      var fim=function(){e.remove()};if(!RM.matches&&e.animate){var a=e.animate([{transform:'none'},{transform:'translateX(100%)'}],{duration:260,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});a.onfinish=fim}else fim();
      if(!dePop&&history.state&&history.state.lfo==='gw'){window.__lfGzBack=1;try{history.back()}catch(_){window.__lfGzBack=0}}}
    window.__lfGzFecha=function(){fecha(true)};
    if(window.__lfPop)window.__lfPop.unshift(function(e){if(window.__lfGzBack){window.__lfGzBack=0;e.__lfStop=1;return}if(Z.el){e.__lfStop=1;fecha(true)}});
    function abre(de){if(Z.el)return;DIT={};Z.ocup=0;
      de=de||(window.__lfTela?window.__lfTela():T('Voltar'));try{if(!document.documentElement.classList.contains('ppop'))scrollTo({top:0,left:0,behavior:'instant'})}catch(_){}
      var e=Z.el=document.createElement('div');e.id='gw';e.setAttribute('role','dialog');e.setAttribute('aria-label',T('Descubra o seu grau'));
      var z=zoom();e.style.zoom=z!==1?String(1/z):'';e.style.setProperty('--gz',z);
      e.innerHTML='<div class="gzhd"><button type="button" class="gzbk" data-gz="x">'+BK+'<span>'+esc(de)+'</span></button><span class="gzdi" id="gzdi" hidden></span><button type="button" class="gzmu" data-gz="mudo" aria-label="'+T('Som')+'">'+(mudo()?MUT:SPK)+'</button></div>'+
        '<div class="gzstg" id="gzstg"><div class="gzbal" id="gzbal"></div><div class="gzc" id="gzc"></div>'+
        '<div class="gzjan" id="gzjan" hidden><div class="gzfita" id="gzfita"></div></div><div class="gzfr" id="gzfr"><i id="gztag"></i></div>'+
        '<div class="gzbt" id="gzbt" hidden><button type="button" class="gzgo" data-gz="sim">'+T('Consigo ler')+'</button><button type="button" class="gzgo o" data-gz="nao">'+T('Não consigo')+'</button></div></div>';
      document.body.appendChild(e);document.documentElement.classList.add('gzon');trava(true);
      /* S56: entra já opaca, deslizando da direita (nunca transparente por cima da página) */
      if(!RM.matches&&e.animate)e.animate([{transform:'translateX(100%)'},{transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});
      try{history.pushState(Object.assign({},history.state||{},{lfo:'gw'}),'',location.href)}catch(_){}
      Z.m=MOCHI($('gzstg'),0,0);Z.m.el.style.opacity=0;addEventListener('resize',lay);intro()}
    function q(s){return Z.el&&Z.el.querySelector(s)}
    /* ---------- posições (recalculadas em qualquer tamanho de tela) ---------- */
    var L={};
    function lay(){if(!Z.el)return;var s=q('#gzstg'),W=s.clientWidth,H=Math.max(460,Z.el.clientHeight-q('.gzhd').offsetHeight);s.style.height=H+'px';
      var k=W<350?.74:W<400?.86:.95;L.k=k;var me=Z.m&&Z.m.el;if(me){me.style.width=(132*k)+'px';me.style.height=(110*k)+'px'}
      var bal=q('#gzbal'),bh=Math.max(64,bal.offsetHeight);L.top=bh+22;
      L.wl=Math.round(120*k+6);L.ww=W-L.wl-10;var bt=q('#gzbt'),bth=bt.offsetHeight||124;L.gap=Math.round(104*k);
      L.wh=Math.max(190,Math.min(330,H-L.top-bth-L.gap-14));var j=q('#gzjan');j.style.left=L.wl+'px';j.style.top=L.top+'px';j.style.width=L.ww+'px';j.style.height=L.wh+'px';
      bt.style.top=(L.top+L.wh+L.gap)+'px';
      var fr=q('#gzfr');fr.style.left=(L.wl-9)+'px';fr.style.top=(L.top-9)+'px';fr.style.width=(L.ww+18)+'px';fr.style.height=(L.wh+18)+'px';
      L.mid=L.top+L.wh/2;
      L.Z={ponto:[L.wl+22-6-166*k,L.mid-70*k],z1:[W-118*k-4,L.top-101*k+5],z3:[Math.max(L.wl,W/2-66*k),L.top+L.wh+L.gap-101*k-6],z4:[L.wl+L.ww*.5,L.top-46*k],intro:[2,6]};
      centra(true)}
    function vaiA(z,modo,cb){var m=Z.m,p=L.Z[z];if(!m||!p)return;m.el.style.zIndex=z==='z4'?2:6;
      if(RM.matches||modo==='ja'){m.pos(p[0],p[1]);cb&&cb();return}
      if(modo==='puff'){teleporta(p,cb);return}if(modo==='rola'){rola(p,cb);return}
      m.pula(p[0],p[1],700,Math.max(30,Math.abs(p[1]-m.y)*.3),cb)}
    function puff(cx,cy){var s=q('#gzstg');if(!s)return;for(var i=0;i<12;i++){var p=document.createElement('div');p.className='gzpuff';var r=12+Math.random()*16,a=i/12*Math.PI*2;p.style.cssText='left:'+(cx-r/2)+'px;top:'+(cy-r/2)+'px;width:'+r+'px;height:'+r+'px';s.appendChild(p);
      (function(p,a){var an=p.animate([{transform:'translate(0,0) scale(.3)',opacity:.95},{transform:'translate('+Math.cos(a)*52+'px,'+Math.sin(a)*42+'px) scale(1.3)',opacity:0}],{duration:700,easing:'cubic-bezier(.2,.8,.3,1)'});an.onfinish=function(){p.remove()}})(p,a)}}
    function centro(){var m=Z.m;return [m.x+66*L.k,m.y+60*L.k]}
    function teleporta(p,cb){var m=Z.m,c=centro();puff(c[0],c[1]);m.el.animate([{opacity:1},{opacity:0}],{duration:150,fill:'forwards'});
      setTimeout(function(){if(!Z.m)return;m.pos(p[0],p[1]);var d=centro();puff(d[0],d[1]);m.el.animate([{opacity:0},{opacity:1}],{duration:200,fill:'forwards'});m.amassa(.7,1.25);setTimeout(function(){m.amassa(1.12,.88)},130);setTimeout(function(){m.amassa(1,1)},280);cb&&cb()},260)}
    function rola(p,cb){var m=Z.m,t=m.el.querySelector('.tilt'),x0=m.x,y0=m.y,t0=performance.now(),dir=p[0]>x0?1:-1,dur=850;t.style.transition='none';
      var f=function(n){if(!Z.m)return;var k=Math.min(1,(n-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;m.pos(x0+(p[0]-x0)*e,y0+(p[1]-y0)*e-Math.sin(Math.PI*k)*14);t.style.transform='rotate('+(dir*360*e)+'deg)';
        if(k<1)requestAnimationFrame(f);else{t.style.transform='';setTimeout(function(){t.style.transition=''},30);m.amassa(1.12,.88);setTimeout(function(){m.amassa(1,1)},180);cb&&cb()}};requestAnimationFrame(f)}
    function cantarola(){var s=q('#gzstg'),c=centro();if(!s)return;['♪','♫','♪'].forEach(function(x,i){setTimeout(function(){if(!Z.el)return;var n=document.createElement('div');n.className='gznota';n.textContent=x;n.style.left=(c[0]+10+i*8)+'px';n.style.top=(c[1]-50*L.k)+'px';s.appendChild(n);
      var an=n.animate([{transform:'translate(0,0)',opacity:0},{transform:'translate(6px,-14px)',opacity:1,offset:.3},{transform:'translate(-4px,-40px)',opacity:0}],{duration:1400,easing:'ease-out'});an.onfinish=function(){n.remove()}},i*350)});Z.m.inclina(6);setTimeout(function(){Z.m&&Z.m.inclina(-6)},400);setTimeout(function(){Z.m&&Z.m.inclina(0)},800)}
    /* ---------- quadro ---------- */
    function monta(){var f=q('#gzfita'),z=zoom();f.innerHTML=LS.map(function(t,i){return '<div class="gzl" id="gzl'+i+'"><b aria-hidden="true">✓</b><span>'+esc(t)+'</span></div>'}).join('');lente(0,true)}
    function lente(g,ja){Z.g=g;var e=escala(g);LS.forEach(function(t,i){var l=q('#gzl'+i);if(l)l.style.fontSize=(FS[i]*e)+'px'});var fr=q('#gzfr'),tg=q('#gztag');
      if(g){fr.classList.add('on');tg.textContent=gf(g);if(!ja&&tg.animate)tg.animate([{transform:'translateX(-50%) scale(1.35)'},{transform:'translateX(-50%) scale(1)'}],{duration:320,easing:'cubic-bezier(.3,1.8,.5,1)'})}else fr.classList.remove('on');
      setTimeout(function(){centra()},ja?0:620)}
    function centra(ja){var f=q('#gzfita'),l=q('#gzl'+Z.at);if(!f||!l)return;if(ja)f.style.transition='none';f.style.top=(L.wh/2-(l.offsetTop+l.offsetHeight/2))+'px';if(ja){void f.offsetTop;f.style.transition=''}
      for(var i=0;i<LS.length;i++){var x=q('#gzl'+i);if(x)x.classList.toggle('hl',i===Z.at)}}
    function aponta(){var m=Z.m;if(!m)return;m.vara(1);m.bracos(-35,0);m.estica(10,RM.matches?0:350);setTimeout(function(){Z.m&&Z.m.toca()},420)}
    function puxa(cb){var m=Z.m;m.vara(0);m.bracos(-120,-40);m.amassa(.94,1.06);setTimeout(function(){if(!Z.m)return;m.amassa(1.05,.95);Z.at++;centra()},180);setTimeout(function(){if(!Z.m)return;m.amassa(1,1);m.bracos(-35,40);cb&&cb()},520)}
    /* ---------- passos ---------- */
    function modo(teste){q('#gzc').hidden=teste;q('#gzjan').hidden=!teste;q('#gzbt').hidden=!teste;q('#gzbal').classList.toggle('t',!!teste);if(!teste)q('#gzfr').classList.remove('on');lay()}
    function conteudo(h){var c=q('#gzc');c.innerHTML=h;if(!RM.matches&&c.animate)c.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'})}
    function entra(){var m=Z.m;vaiA('intro','ja');m.el.style.opacity=1;var c=centro();if(!RM.matches){puff(c[0],c[1]);m.inclina(-25);m.amassa(.55,1.35);setTimeout(function(){m.inclina(8);m.amassa(1.18,.84)},140);setTimeout(function(){m.inclina(0);m.amassa(1,1)},320)}m.cara('f');m.espelho()}
    function intro(){Z.fase='intro';cam();modo(false);
      conteudo('<div class="gzeb">'+T('DESCUBRA O SEU GRAU')+'</div><h2>'+T('Descubra o grau do seu óculos de leitura em 1 minuto')+'</h2>'+
        '<div class="gzav"><p>'+T('Serve só para ler de perto.')+'</p><p><b>'+T('Não funciona')+'</b> '+T('para miopia, astigmatismo ou multifocal — nesses casos o certo é a receita do oftalmologista.')+'</p><p class="mu">'+T('Não substitui a consulta.')+'</p></div>'+
        '<button type="button" class="gzgo" data-gz="comeca">'+T('Começar')+'</button>');
      setTimeout(function(){if(!Z.m)return;entra();Z.m.acena(6);fala(T('Oi! Eu sou o Mochi. Este teste é para óculos de leitura. Se você tem miopia, astigmatismo ou usa multifocal, ele não vai servir para você.'))},360)}
    function prep(){Z.fase='prep';medir();var m=Z.m;m.cara('n');
      conteudo('<div class="gzeb">'+T('PREPARANDO')+'</div><h2>'+T('Tire os óculos e segure o celular a 40 cm')+'</h2><p class="gzp">'+T('Um palmo e meio do rosto. Lente de contato pode ficar.')+'</p>');
      fala(T('Faz como eu: tire os óculos…'));m.bracos(154,40);var o=m.el.querySelector('.ocl');
      setTimeout(function(){if(!Z.m)return;o.style.transition='transform .45s cubic-bezier(.3,1.4,.5,1),opacity .3s';o.style.transform='translateY(-26px) rotate(-8deg)';o.style.opacity=.15},400);
      setTimeout(function(){if(!Z.m)return;o.style.transform='';o.style.opacity=1;m.bracos(-35,40);m.pisca();fala(T('…e segure o celular a 40 centímetros, um palmo e meio.'))},1700);
      Z.tc=setTimeout(teste,4200)}
    function teste(){if(!Z.el)return;Z.fase='teste';Z.at=0;Z.g=0;Z.falhou={};Z.okLente=0;modo(true);monta();
      vaiA('ponto','pula',function(){aponta();pergunta(true)})}
    function pergunta(primeira){var m=Z.m;if(!m)return;m.ocioso=true;m.olha(1,.2);var t=Z.at;
      if(primeira)fala(T('Consegue ler a frase aqui na minha frente, sem esforço?'));
      else if(Z.g&&t===LS.length-1)fala(T('Com a lente')+' '+gf(Z.g)+'. '+T('Consegue ler a última frase?'));
      else if(t>=6)diz('miuda',T('E esta, mais miudinha?'),true);else diz('e'+t,T('E esta?'),true)}
    /* às vezes, entre uma frase e outra, ele dá um passeio (nunca enquanto espera o toque) */
    function passeio(cb){if(RM.matches||Math.random()<.55){cb();return}var z=['z1','z3','z4'][Math.floor(Math.random()*3)],m=Z.m;m.vara(0);
      vaiA(z,z==='z4'?'puff':z==='z3'?'rola':'pula',function(){if(!Z.m)return;if(z==='z3')cantarola();else if(z==='z4')m.olha(-1,.8);else{m.inclina(8);setTimeout(function(){Z.m&&Z.m.inclina(0)},700)}
        setTimeout(function(){if(!Z.m)return;m.el.style.zIndex=6;m.olha(-1,.4);vaiA('ponto','pula',cb)},1300)})}
    function responde(sim){var m=Z.m;if(!m||Z.fase!=='teste'||Z.ocupado)return;Z.ocupado=true;m.ocioso=false;var t=Z.at,ult=t===LS.length-1;setTimeout(function(){Z.ocupado=false},700);
      if(sim){var l=q('#gzl'+t);if(l)l.classList.add('ok');m.cara('f');m.sim();setTimeout(function(){Z.m&&Z.m.cara('n')},500);
        if(ult){if(!Z.g){semNecessidade();return}
          /* leu a bula com esta lente: confere uma mais fraca se ainda não testou */
          var mf=Math.round((Z.g-.25)*4)/4;if(mf>=.75&&!Z.falhou[mf]&&!Z.conf){Z.conf=1;Z.okLente=Z.g;setTimeout(function(){if(!Z.m)return;fala(T('Isso! Agora confiro uma um pouco mais fraca, como o médico faz.'));resetLinhas();lente(mf);setTimeout(function(){if(!Z.m)return;aponta();pergunta()},900)},500);return}
          setTimeout(function(){resultado(Z.g)},600);return}
        setTimeout(function(){puxa(function(){passeio(function(){aponta();pergunta()})})},300);return}
      /* não consegue */
      m.nao();if(Z.conf){setTimeout(function(){resultado(Z.okLente)},900);return}
      if(Z.g)Z.falhou[Z.g]=1;
      var g;if(!Z.g){var k=t-1;g=k>=0?Math.max(.75,GK[k]-.5):3}else g=Math.round((Z.g+.25)*4)/4;
      if(g>4){setTimeout(consulte,900);return}
      fala(Z.g?T('Vou trocar por uma mais forte…'):T('Hmm… tudo bem! É aqui que a lente entra.'));m.vara(0);
      setTimeout(function(){buscaLente(g,function(){aponta();pergunta()})},Z.g?600:1300)}
    function resetLinhas(){for(var i=0;i<LS.length;i++){var l=q('#gzl'+i);if(l)l.classList.remove('ok')}Z.at=LS.length-1;centra()}
    function buscaLente(g,cb){var m=Z.m;if(RM.matches||Z.g){lente(g);m.espelho();setTimeout(cb,700);return}
      var fr=q('#gzfr'),W=q('#gzstg').clientWidth;rola([W+20,m.y],function(){if(!Z.m)return;fr.classList.add('voa');var sg=true,loop=function(){if(!Z.m||!sg)return;var h=m.mao(),s=q('#gzstg').getBoundingClientRect(),z=zoom()*(1/zoom());fr.style.transform='translate('+(h[0]-s.left-(L.wl-9)+6)+'px,'+(h[1]-s.top-(L.top-9)-40)+'px) scale(.28) rotate(-6deg)';requestAnimationFrame(loop)};loop();
        m.bracos(-35,-30);rola([L.Z.ponto[0]+10,L.Z.ponto[1]-70*L.k],function(){sg=false;if(!Z.m)return;m.bracos(-35,10);fr.classList.remove('voa');fr.style.transform='';lente(g);m.cara('f');m.espelho();m.amassa(1.08,.92);setTimeout(function(){if(!Z.m)return;m.amassa(1,1);m.cara('n');vaiA('ponto','pula',cb)},700)})})}
    /* ---------- resultados ---------- */
    function fimTeste(){cam();Z.fase='res';var m=Z.m;m.vara(0);modo(false);vaiA('intro',RM.matches?'ja':'pula')}
    function avisos(){return '<div class="gzav"><p><b>'+T('Serve para:')+'</b> '+T('ler de perto — livro, celular, cardápio, costura.')+'</p><p><b>'+T('Não serve para:')+'</b> '+T('ver de longe ou dirigir.')+'</p>'+
      '<p><b>'+T('Miopia:')+'</b> '+T('óculos de leitura não corrigem. Se lê bem de perto sem óculos, não precisa deles.')+'</p><p><b>'+T('Astigmatismo:')+'</b> '+T('o óculos de leitura pronto não corrige. Pode até ajudar, mas o ideal é um óculos feito com a sua receita.')+'</p>'+
      '<p><b>'+T('Multifocal:')+'</b> '+T('é feito sob medida numa ótica, com receita. Este teste não consegue medir.')+'</p><p class="mu"><b>'+T('Não substitui o oftalmologista.')+'</b> '+T('Procure um se tiver dor de cabeça ao ler, visão dupla, um olho bem pior que o outro ou se a visão mudou de repente.')+'</p></div>'}
    function confete(){if(RM.matches)return;var s=q('#gzstg'),C=['#8d3a69','#f3d6e4','#f2b24c','#7fc4a4'];for(var i=0;i<40;i++){var c=document.createElement('div');c.className='gzcf';c.style.left=(30+Math.random()*(s.clientWidth-60))+'px';c.style.top='120px';c.style.background=C[i%4];s.appendChild(c);
      (function(c){var an=c.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+((Math.random()-.5)*170)+'px,'+(260+Math.random()*220)+'px) rotate('+(Math.random()*720)+'deg)',opacity:0}],{duration:1800+Math.random()*900,easing:'cubic-bezier(.2,.6,.4,1)'});an.onfinish=function(){c.remove()}})(c)}}
    function resultado(G){fimTeste();Z.G=G;Z.g=G;var m=Z.m,lo=gf(Math.max(.75,G-.25)),hi=gf(Math.min(4,G+.25));
      conteudo('<div class="gzeb">'+T('SEU GRAU PARA COMEÇAR')+'</div><div class="gzrs"><div class="gzres">'+gf(G)+'</div><p class="gzp">'+T('Com a lente')+' '+gf(G)+' '+T('você leu até a última frase.')+'<br>'+T('Faixa provável:')+' '+lo+' '+T('a')+' '+hi+'</p></div>'+
        '<p class="gzp" style="text-align:center;margin-top:14px">'+T('Quer escolher outro?')+'</p>'+
        '<div class="gzaj"><button type="button" class="gzpm" data-gz="menos" aria-label="'+T('Menos grau')+'">−</button><div><b id="gzgv">'+gf(G)+'</b><small id="gzgl">'+T('sugerido')+'</small></div><button type="button" class="gzpm" data-gz="mais" aria-label="'+T('Mais grau')+'">+</button></div>'+
        '<p class="gzp" style="text-align:center;font-size:13.5px;margin-top:6px">'+T('Na dúvida entre dois graus, fique com o menor.')+'</p>'+
        '<button type="button" class="gzgo" data-gz="ver" id="gzver">'+T('Ver óculos de leitura')+' '+gf(G)+'</button><button type="button" class="gzgo o" data-gz="guarda">'+T('Guardar meu grau')+'</button>'+avisos());
      setTimeout(function(){if(!Z.m)return;confete();m.cara('f');m.bracos(-130,-50);m.espelho();fala(T('Pronto! O grau que mais combina com você é')+' '+gf(G)+'.');setTimeout(function(){Z.m&&Z.m.acena(6)},800);setTimeout(function(){if(!Z.m)return;m.cara('n');m.ocioso=true},3500)},500)}
    function semNecessidade(){fimTeste();conteudo('<div class="gzeb">'+T('RESULTADO')+'</div><h2>'+T('Você leu até a letra de bula sem óculos')+'</h2>'+
        '<div class="gzav"><p>'+T('Por enquanto você não precisa de óculos de leitura.')+'</p><p>'+T('Se você usa óculos para longe (miopia), para ler o mais simples é tirar os seus óculos. Para longe e perto com um óculos só, o certo é um multifocal, feito numa ótica com receita.')+'</p></div>'+
        '<button type="button" class="gzgo o" data-gz="inicio">'+T('Voltar ao início')+'</button>');
      setTimeout(function(){if(!Z.m)return;Z.m.cara('f');Z.m.acena(4);fala(T('Boa notícia: você lê bem de perto sem óculos!'));setTimeout(function(){if(Z.m){Z.m.cara('n');Z.m.ocioso=true}},2500)},500)}
    function consulte(){fimTeste();conteudo('<div class="gzeb">'+T('RESULTADO')+'</div><h2>'+T('Nem com a lente mais forte ficou fácil')+'</h2><p class="gzp">'+T('Os óculos de leitura prontos vão até +4.00. Para não chutar um grau, o melhor é consultar um oftalmologista.')+'</p>'+
        '<button type="button" class="gzgo" data-gz="comeca">'+T('Tentar de novo')+'</button><button type="button" class="gzgo o" data-gz="inicio">'+T('Voltar ao início')+'</button>');
      setTimeout(function(){if(!Z.m)return;Z.m.nao();fala(T('Para não chutar um grau, vale consultar um oftalmologista.'))},500)}
    /* ---------- câmera: só confere a distância de 40 cm (nada é gravado) ---------- */
    function chip(t,ok){var c=q('#gzdi');if(!c)return;c.hidden=false;c.textContent=t;c.classList.toggle('ok',!!ok)}
    function medir(){if(Z.st)return;if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){chip(T('Segure a 40 cm'));return}
      var v=Z.v=document.createElement('video');v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');
      navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'user',width:{ideal:640},height:{ideal:480}}}).then(function(s){if(!Z.el){s.getTracks().forEach(function(t){t.stop()});return}Z.st=s;v.srcObject=s;var p=v.play();if(p&&p.catch)p.catch(function(){});
        (window.__lfFakeFa?Promise.resolve(window.__lfFakeFa):faLoad()).then(function(fa){Z.fa=fa;laco()},function(){chip(T('Segure a 40 cm'))})},function(){chip(T('Segure a 40 cm'))})}
    var hist=[],med=function(a){var s=a.slice().sort(function(x,y){return x-y});return s[Math.floor(s.length/2)]};
    function laco(){if(!Z.el||!Z.st)return;var v=Z.v,fa=Z.fa;if(!v.videoWidth){Z.tm=setTimeout(laco,250);return}
      var W=320,H=Math.round(W*v.videoHeight/v.videoWidth),cv=Z.cv||(Z.cv=document.createElement('canvas'));cv.width=W;cv.height=H;cv.getContext('2d').drawImage(v,0,0,W,H);
      fa.detectSingleFace(cv,new fa.TinyFaceDetectorOptions({inputSize:224,scoreThreshold:.4})).withFaceLandmarks(!FA.full).then(function(r){if(!Z.el||!Z.st)return;var n=Date.now();
        if(r&&r.landmarks){var P=r.landmarks.positions,c=function(a,b){var x=0,y=0;for(var i=a;i<=b;i++){x+=P[i].x;y+=P[i].y}return [x/(b-a+1),y/(b-a+1)]},e1=c(36,41),e2=c(42,47),ipd=Math.hypot(e1[0]-e2[0],e1[1]-e2[1]);
          var f=(W/2)/Math.tan(31*Math.PI/180),d=f*6.3/ipd;hist.push(d);if(hist.length>5)hist.shift();Z.d=med(hist);Z.rosto=n;
          if(Z.d>47){chip(T('Chegue um pouco mais perto'));if(Z.fase==='teste')diz('perto',T('Chegue o celular um pouquinho mais perto, a 40 centímetros.'))}
          else if(Z.d<33){chip(T('Afaste um pouco'));if(Z.fase==='teste')diz('longe',T('Afaste um pouquinho o celular, para uns 40 centímetros.'))}
          else chip('40 cm ✓',true)}
        else if(n-(Z.rosto||0)>2000)chip(T('Não vejo o seu rosto'));
        Z.tm=setTimeout(laco,350)},function(){Z.tm=setTimeout(laco,600)})}
    function perto(g){var G=navGraus(),b='',d=1e9;G.forEach(function(x){var k=Math.abs(gn(x)-g);if(k<d-1e-9){d=k;b=x}});return b}
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-gzopen],[data-gz]');if(!t)return;
      if(t.hasAttribute('data-gzopen')){e.preventDefault();e.stopPropagation();var dw=$('drw');
        /* S56: pelo menu, o menu fecha por completo (e o histórico assenta) antes de a tela do grau entrar */
        if(dw&&dw.classList.contains('on')){var de=window.__lfTela?window.__lfTela():T('Início');var x=document.querySelector('#drw .dsc[data-dclose],#drw [data-dclose]');if(x)x.click();var n=0,esp=function(){if(n++<25&&(dw.classList.contains('on')||(history.state&&history.state.lfo==='drw'))){setTimeout(esp,60);return}setTimeout(function(){abre(de)},300)};setTimeout(esp,60)}else abre();return}
      if(!Z.el||!Z.el.contains(t))return;e.preventDefault();var k=t.getAttribute('data-gz');
      if(Z.m&&(k==='sim'||k==='nao')){var r=t.getBoundingClientRect();Z.m.olhaPara(r.left+r.width*.6,r.top+r.height/2)}
      if(k==='x'){fecha();return}
      if(k==='mudo'){try{localStorage.setItem('lf_gzmudo',mudo()?'0':'1')}catch(_){}t.innerHTML=mudo()?MUT:SPK;if(mudo()){try{speechSynthesis.cancel()}catch(_){}if(VZ.a)try{VZ.a.pause()}catch(_){}}return}
      if(k==='comeca'){prep();return}
      if(k==='sim'){responde(true);return}if(k==='nao'){responde(false);return}
      if(k==='inicio'){fecha();setTimeout(function(){var l=document.querySelector('.top .logo');if(l)l.click()},300);return}
      if(k==='mais'||k==='menos'){Z.g=Math.max(.75,Math.min(4,Z.g+(k==='mais'?.25:-.25)));var gv=$('gzgv'),gl=$('gzgl'),vb=$('gzver');if(gv)gv.textContent=gf(Z.g);if(gl)gl.textContent=Z.g===Z.G?T('sugerido'):T('Sugerido: ')+gf(Z.G);if(vb)vb.textContent=T('Ver óculos de leitura')+' '+gf(Z.g);if(Z.m){Z.m.sim()}return}
      if(k==='guarda'){var gg=Z.g;try{localStorage.setItem('lf_meugr',gf(gg))}catch(_){}fecha();toast(T('Grau guardado')+': '+gf(gg));try{if(st.tipo==='grau'&&document.documentElement.classList.contains('ppop')&&!prodOpen){st.fgr=perto(gg);drawGrid()}gzFaixa();}catch(_){}return}
      if(k==='ver'){var g=Z.g;fecha();var go=function(){st.fgr=perto(g);navAbreCat('grau')};if(prodOpen)navApos(go);else go();return}},true);
    window.__LFGZ={Z:Z,escala:escala,L:L};
