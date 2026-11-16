# S370 (16/11/2026 06:46, "Aprovado, pode implementar também"): fluidez da Mochi no site de verdade — o mesmo do vídeo aprovado (work/s370/video.py),
# com duas proteções a mais: (1) a boca pelo volume só liga se o áudio do aparelho já estiver liberado (senão, boca pelo relógio como hoje — o som nunca depende disso);
# (2) sem som nenhum a boca fica fechada; com a voz do próprio celular (sem gravação) segue o relógio.
import sys
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf8').read()
V=open('/home/claude/lafouch/work/s370/video.py',encoding='utf8').read();G1=open('/home/claude/lafouch/work/s256/video.py',encoding='utf8').read()
ns={};exec('TROCAS = ['+G1.split('TROCAS = [')[1].split('\n]\n')[0]+'\n]',ns);TROCAS=[t for t in ns['TROCAS'] if 'dur=dur||520' not in t[0] and 'window.__lfSemSom' not in t[1]]
ns2={};exec('TROCAS=[]\nTROCAS+=['+V.split('TROCAS+=[')[1].split('\n]\n')[0]+'\n]',ns2);TROCAS+=[t for t in ns2['TROCAS'] if 'const ab=' not in t[0] and 'Z.m.fala(' not in t[0]]
NOVO=V.split('NOVO=r"""')[1].split('"""')[0]
a="if(!a._an){const AC=window.AudioContext||window.webkitAudioContext;M._ac=M._ac||new AC();const sr=M._ac.createMediaElementSource(a);a._an=M._ac.createAnalyser();a._an.fftSize=512;sr.connect(a._an);a._an.connect(M._ac.destination)}\n   if(M._ac.state==='suspended')M._ac.resume();"
b="const AC0=window.__lfAc;if(!a._an){if(!AC0||AC0.state!=='running')return false;const sr=AC0.createMediaElementSource(a);a._an=AC0.createAnalyser();a._an.fftSize=512;sr.connect(a._an);a._an.connect(AC0.destination)}else if(!AC0||AC0.state!=='running')return false;"
assert a in NOVO;NOVO=NOVO.replace(a,b)
TROCAS+=[("const ab=(k++%3)!==2;","const ab=M.rel?(k++%3)!==2:false;"),
 ("if(my===FID&&Z.m&&!PZ.on)Z.m.fala(","if(my===FID&&Z.m&&!PZ.on)(Z.m.falaVol(a))||(Z.m.rel=1,0)||Z.m.fala("),
 ("var feito=false,fim=function(){if(feito||id!==FID)return;feito=true;","var feito=false,fim=function(){if(feito||id!==FID)return;feito=true;if(Z.m)Z.m.rel=0;"),
 ("u.onstart=boca;","u.onstart=function(){if(Z.m)Z.m.rel=1;boca()};"),
 ("    function naIntro(){return !!(Z.m&&Z.fase==='intro'&&!Z.vaiCom)}","    /* S370: o analisador de volume (para a boca) só existe depois de um toque da pessoa e só é usado se estiver rodando */\n    function acToca(){try{var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;window.__lfAc=window.__lfAc||new AC();if(window.__lfAc.state==='suspended')window.__lfAc.resume()}catch(_){}}\n    function naIntro(){return !!(Z.m&&Z.fase==='intro'&&!Z.vaiCom)}"),
 ("if(t&&t.getAttribute('data-gz')==='mudo'&&Z.bloq){e.preventDefault();e.stopPropagation();somLibera();return}if(!t)return;","if(t&&t.getAttribute('data-gz')==='mudo'&&Z.bloq){e.preventDefault();e.stopPropagation();somLibera();return}if(!t)return;acToca();"),
]
i=s.index(" M.pula=function(nx,ny,dur,alt,fim){");j=s.index(" M.desliza=function",i);s=s[:i]+"/* S370 (aprovado em vídeo, 16/11): olhar que volta sozinho, boca pelo volume da voz e salto com tempo e altura pela distância */\n"+NOVO+s[j:]
for x,y in TROCAS:
    n=s.count(x);assert n==1,(n,x[:70]);s=s.replace(x,y)
x="M.pisca=function(){";assert s.count(x)==1;s=s.replace(x,"(function mo(){setTimeout(()=>{if(!el.isConnected)return;if(!M.fal&&q('.pup').style.transform.indexOf('(0px')>=0)M.olhaVai((Math.random()-.5)*1.1,(Math.random()-.4)*.7,900);mo()},4000+Math.random()*3000)})();"+x)
open(p,'w',encoding='utf8').write(s);print('ok',len(TROCAS),'trocas')
