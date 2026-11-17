# S410 · ESBOÇO 105: etapa "aproxime" em meio-termo — PARAR o celular mede sozinho; o botão Embaçou continua; vale o que vier primeiro.
# Textos aprovados pelo dono 17/11 17:59. Só em CÓPIA até "implementar".  python3 edita105.py <lf-site.js>
import sys,subprocess
p=sys.argv[1];s=open(p,encoding='utf8').read()
def troca(a,b):
    global s;assert s.count(a)==1,'achei %d×: %s'%(s.count(a),a[:80]);s=s.replace(a,b)
troca("var f=T('Agora uma última coisa: aproxime o celular devagar e toque em Embaçou quando as letras começarem a embaçar.'),fz=T('Agora uma última coisa: aproxime o celular devagar e toque quando as letras começarem a embaçar.');\n      setTimeout(function(){Z.m&&Z.fase==='pp'&&fala(f,null,null,fz)},500);",
 "var f1=T('Agora vou ver de quão perto você consegue ler. Aproxime o celular do rosto bem devagar, sem parar de ler as letras.'),f2=T('Quando as letras começarem a embaçar, pare o celular ali, ou me avise apertando o botão Embaçou.');\n"
 "      setTimeout(function(){Z.m&&Z.fase==='pp'&&fala(f1,function(){Z.m&&Z.fase==='pp'&&!Z.ppTrava&&fala(f2)})},500);Z.ppD0=null;")
# parado: já aproximou 5 cm ou mais desde o começo e o último 2 s varia até 1,2 cm (passados 2,5 s da etapa) → mede ali
troca("if(a.length&&nn-(Z.rosto||0)<900&&Math.max.apply(null,a)<=15){",
 "if(a.length&&Z.ppD0==null)Z.ppD0=Math.max.apply(null,a);var b2=(Z.hd||[]).filter(function(x){return nn-x[0]<2000}).map(function(x){return x[1]});"
 "if(Z.ppD0!=null&&nn-Z.ppT0>2500&&b2.length>=5&&nn-(Z.rosto||0)<900&&Math.max.apply(null,b2)-Math.min.apply(null,b2)<=1.2&&med(b2)<=Z.ppD0-5&&med(b2)>15){ppTrava(med(b2));return}\n        "
 "if(a.length&&nn-(Z.rosto||0)<900&&Math.max.apply(null,a)<=15){")
troca("if(bl){bl.innerHTML=T('Pronto, medi! Pode afastar o celular.');bl.classList.add('on')}",
 "if(bl){bl.innerHTML=d==null?T('Não embaçou? Tudo bem, já medi.'):T('Pronto, medi! Pode afastar o celular.');bl.classList.add('on')}")
open(p,'w',encoding='utf8').write(s)
r=subprocess.run(['node','-e',"new (require('vm').Script)(require('fs').readFileSync('%s','utf8'))"%p],capture_output=True,text=True);assert r.returncode==0,r.stderr[-400:];print('ok')
