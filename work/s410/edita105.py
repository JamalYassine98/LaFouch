# S410 · ESBOÇO 107: etapa "aproxime" em meio-termo — PARAR o celular mede sozinho; o botão Embaçou continua; vale o que vier primeiro.
# Textos aprovados pelo dono 17/11 17:59. Só em CÓPIA até "implementar".  python3 edita105.py <lf-site.js>
import sys,subprocess
p=sys.argv[1];s=open(p,encoding='utf8').read()
def troca(a,b):
    global s;assert s.count(a)==1,'achei %d×: %s'%(s.count(a),a[:80]);s=s.replace(a,b)
troca("var f=T('Agora uma última coisa: aproxime o celular devagar e toque em Embaçou quando as letras começarem a embaçar.'),fz=T('Agora uma última coisa: aproxime o celular devagar e toque quando as letras começarem a embaçar.');\n      setTimeout(function(){Z.m&&Z.fase==='pp'&&fala(f,null,null,fz)},500);",
 "var f1=T('Agora vou ver de quão perto você consegue ler. Aproxime o celular do rosto bem devagar, sem parar de ler as letras.'),f2=T('Quando as letras começarem a embaçar, pare o celular ali, ou me avise apertando o botão Embaçou.');\n"
 "      setTimeout(function(){Z.m&&Z.fase==='pp'&&fala(f1,function(){if(Z.m&&Z.fase==='pp'&&!Z.ppTrava){ppMostra();fala(f2)}})},500);Z.ppD0=null;ppEsconde();clearTimeout(Z.ppMt);Z.ppMt=setTimeout(function(){if(Z.fase==='pp')ppMostra()},14000);")
# parado: já aproximou 5 cm ou mais desde o começo e o último 2 s varia até 1,2 cm (passados 2,5 s da etapa) → mede ali
troca("if(a.length&&nn-(Z.rosto||0)<900&&Math.max.apply(null,a)<=15){",
 "if(a.length&&Z.ppD0==null)Z.ppD0=Math.max.apply(null,a);var b2=(Z.hd||[]).filter(function(x){return nn-x[0]<2000}).map(function(x){return x[1]});"
 "if(Z.ppD0!=null&&nn-Z.ppT0>2500&&b2.length>=5&&nn-(Z.rosto||0)<900&&Math.max.apply(null,b2)-Math.min.apply(null,b2)<=1.2&&med(b2)<=Z.ppD0-5&&med(b2)>15){ppTrava(med(b2));return}\n        "
 "if(a.length&&nn-(Z.rosto||0)<900&&Math.max.apply(null,a)<=15){")
troca("if(bl){bl.innerHTML=T('Pronto, medi! Pode afastar o celular.');bl.classList.add('on')}",
 "if(bl){bl.innerHTML=d==null?T('Não embaçou? Tudo bem, já medi.'):T('Pronto, medi! Pode afastar o celular.');bl.classList.add('on')}")
# balão não pode bater no quadro: reserva a altura da fala mais comprida da etapa ANTES de montar o quadro (o quadro desce o necessário e não pula depois)
troca("function ppIni(G,n){var m=Z.m;if(!m)return;if(Z.lupa){Z.lupa=0;q('#gzfita').classList.remove('lupa');lay()}",
 "function ppIni(G,n){var m=Z.m;if(!m)return;if(Z.lupa){Z.lupa=0;q('#gzfita').classList.remove('lupa')}"
 "(function(){var bl=q('#gzbal');if(!bl)return;var o=bl.innerHTML,mh=0;bl.style.minHeight='';[T('Agora vou ver de quão perto você consegue ler. Aproxime o celular do rosto bem devagar, sem parar de ler as letras.'),T('Quando as letras começarem a embaçar, pare o celular ali, ou me avise apertando o botão Embaçou.')].forEach(function(t){bl.innerHTML=t;mh=Math.max(mh,bl.offsetHeight)});bl.innerHTML=o;bl.style.minHeight=mh+'px'})();lay();")
# o quadro desceu: a Mochi desce junto (desliza até o lugar novo) e só então aponta a frase
troca("botoes('pp');\n      if(Z.longe)volta();else{m.modo='trab';aponta()}","botoes('pp');\n      if(Z.longe)volta();else{m.modo='trab';var pq=L.Z.ponto;if(pq&&(Math.abs(m.x-pq[0])>2||Math.abs(m.y-pq[1])>2))m.flutua(pq[0],pq[1],420,aponta);else aponta()}")
troca("function ppFim(pp){if(Z.fase!=='pp')return;","function ppFim(pp){if(Z.fase!=='pp')return;var bl0=q('#gzbal');if(bl0)bl0.style.minHeight='';")
troca("bt.style.top=(L.top+L.wh+L.gap)+'px';","bt.style.top=(L.top+L.wh+(Z.fase==='pp'?24:L.gap))+'px';")
# botão logo abaixo do quadro (24 px) e com entrada animada: sobe com mola + dois halos suaves; a Mochi olha para ele
troca("    /* o toque (ou a conclusão automática) trava o botão",
 "    function ppCss(){if(document.getElementById('lfppcss'))return;var st=document.createElement('style');st.id='lfppcss';st.textContent='#gzbt.ppesc{opacity:0;transform:translateY(18px) scale(.94);pointer-events:none}';document.head.appendChild(st)}\n"
 "    function ppEsconde(){ppCss();var bt=q('#gzbt');if(!bt)return;bt.classList.add('ppesc');Z.ppVis=0}\n"
 "    function ppMostra(){var bt=q('#gzbt');if(!bt||Z.ppVis)return;Z.ppVis=1;clearTimeout(Z.ppMt);bt.classList.remove('ppesc');var b=bt.querySelector('.gzgo');if(b){b.disabled=false;b.style.opacity=''}\n"
 "      if(RM.matches||!bt.animate)return;bt.animate([{opacity:0,transform:'translateY(18px) scale(.94)'},{opacity:1,transform:'translateY(-3px) scale(1.02)',offset:.65},{opacity:1,transform:'none'}],{duration:620,easing:'cubic-bezier(.22,1,.36,1)'});\n"
 "      if(b&&b.animate)b.animate([{boxShadow:'0 0 0 0 rgba(141,58,105,.6)'},{boxShadow:'0 0 0 20px rgba(141,58,105,0)'}],{duration:1100,delay:560,iterations:2,easing:'cubic-bezier(.2,.7,.3,1)'});\n"
 "      if(Z.m&&Z.m.olhaVai)Z.m.olhaVai(.3,1,1400)}\n"
 "    /* o toque (ou a conclusão automática) trava o botão")
troca("function ppTrava(d){if(Z.fase!=='pp'||Z.ppTrava)return;Z.ppTrava=1;clearInterval(Z.ppT);","function ppTrava(d){if(Z.fase!=='pp'||Z.ppTrava)return;Z.ppTrava=1;clearInterval(Z.ppT);clearTimeout(Z.ppMt);var bq=q('#gzbt');if(bq)bq.classList.remove('ppesc');Z.ppVis=1;")
open(p,'w',encoding='utf8').write(s)
r=subprocess.run(['node','-e',"new (require('vm').Script)(require('fs').readFileSync('%s','utf8'))"%p],capture_output=True,text=True);assert r.returncode==0,r.stderr[-400:];print('ok')
