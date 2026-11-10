# S92 (esboço): o toque do cliente corta a fala com suavidade e segue na hora. Uso: python3 s92.py <lf-site.js>
import sys;p=sys.argv[1];s=open(p).read()
def R(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]);s=s.replace(a,b)
# rig: cada movimento novo cancela o anterior (sem dois pulos brigando)
R("M.flutua=function(nx,ny,dur,fim){const x0=M.x,y0=M.y,t1=performance.now();","M.mv=0;M.para=function(){M.mv++};M.flutua=function(nx,ny,dur,fim){const tk=++M.mv,x0=M.x,y0=M.y,t1=performance.now();")
R("const f=n=>{let t=Math.min(1,(n-t1)/dur),c=1.5,","const f=n=>{if(tk!==M.mv)return;let t=Math.min(1,(n-t1)/dur),c=1.5,")
R("M.pula=function(nx,ny,dur,alt,fim){dur=dur||700;alt=alt==null?40:alt;const x0=M.x,y0=M.y;M.amassa(1.12,.86);\n  setTimeout(()=>{M.amassa(.9,1.12);","M.pula=function(nx,ny,dur,alt,fim){dur=dur||700;alt=alt==null?40:alt;const tk=++M.mv,x0=M.x,y0=M.y;M.amassa(1.12,.86);\n  setTimeout(()=>{if(tk!==M.mv)return;M.amassa(.9,1.12);")
R("   const f=n=>{let t=Math.min(1,(n-t1)/dur),e=ease(t);","   const f=n=>{if(tk!==M.mv)return;let t=Math.min(1,(n-t1)/dur),e=ease(t);")
# corta: a voz some em 0,15 s; nada do que ele ia fazer depois acontece
R("    /* toque enquanto ele fala: vale assim que ele terminar a frase (a fala nunca é cortada) */",
"""    /* S92: só o toque do cliente corta a fala — a voz some em 0,15 s e o que ele ia fazer depois da frase é esquecido */
    function corta(){Z.depoisFala=null;Z.pend=null;if(!Z.falando)return;FID++;Z.falando=false;Z.ocup=0;var a=VZ.a;VZ.a=null;/* a próxima fala não pausa de supetão a que está sumindo */
      if(a&&!a.paused){var v0=a.volume,t0=performance.now();(function f(){var k=Math.min(1,(performance.now()-t0)/150);try{a.volume=v0*(1-k)}catch(_){}if(k<1)requestAnimationFrame(f);else try{a.pause()}catch(_){}})()}
      try{speechSynthesis.cancel()}catch(_){}if(Z.m)Z.m.calou();var bt=q('#gzbt');if(bt)bt.classList.remove('esp')}
    /* toque enquanto ele fala: vale assim que ele terminar a frase (só no teste de leitura) */""")
R("function comeca(bt){if(Z.fase==='intro'){if(Z.vaiCom)return;Z.vaiCom=1;clearTimeout(Z.ti);apos(camera,bt);return}camera()}",
  "function comeca(bt){if(Z.fase==='intro'){if(Z.vaiCom)return;Z.vaiCom=1;clearTimeout(Z.ti)}corta();camera()}")
# volta natural: guarda o ponteiro (3 cliques rápidos), desvira e pula para o canto enquanto o cartão novo entra
R("m.paraGesto();m.ocioso=false;m.estica(0,0);m.vara(0);m.bracos(-35,40);m.vira(1);",
  "m.paraGesto();m.ocioso=false;m.para();if(m.ponOn&&!RM.matches){m.estica(0,180,true);setTimeout(function(){Z.m&&Z.fase!=='intro'&&Z.m.vara(0)},200)}else m.vara(0);m.bracos(-35,40);m.vira(1);")
R("liga(st);apos(function(){prep(T('Obrigado!'))})},\n        function(){if(!Z.el||Z.fase!=='camw')return;apos(semCam)})}",
  "liga(st);corta();prep(T('Obrigado!'))},\n        function(){if(!Z.el||Z.fase!=='camw')return;corta();semCam()})}")
R("t.classList.add('gd');apos(k==='camsim'?camSim:semCam);return}","t.classList.add('gd');corta();(k==='camsim'?camSim:semCam)();return}")
R("apos(k==='luzok'?luzOk:function(){Z.escuro=1;luzFim()},t);return}","corta();(k==='luzok'?luzOk:function(){Z.escuro=1;luzFim()})();return}")
R("apos(function(){if(Z.fase!=='pp')return;if(k==='nemb')","corta();(function(){if(Z.fase!=='pp')return;if(k==='nemb')")
R("ppMede(function(d){ppRes(ppConta(d))})},t);return}","ppMede(function(d){ppRes(ppConta(d))})})();return}")
# nessas etapas os botões não ficam clarinhos enquanto ele fala (pode tocar a qualquer hora)
R("fala(T('Está um pouquinho escuro.')+' '+T('Vá para um lugar mais iluminado: com pouca luz a gente lê pior.'),null,true)","fala(T('Está um pouquinho escuro.')+' '+T('Vá para um lugar mais iluminado: com pouca luz a gente lê pior.'))",2)
R("Z.m&&Z.fase==='pp'&&fala(f,null,true)","Z.m&&Z.fase==='pp'&&fala(f)")
# a corrente de frases cortada não continua sozinha na próxima frase
R("var k=0,toca=function(){if(!Z.el)return;","var k=0,my=FID,toca=function(){if(!Z.el||my!==FID)return;")
open(p,'w').write(s);print('ok')
