# SÓ PARA GRAVAR ESBOÇO (nas duas cópias): sorteios em ordem fixa, para Hoje e Proposta falarem a mesma frase na mesma hora.
import sys;p=sys.argv[1];s=open(p,encoding='utf8').read()
a="do{i=Math.floor(Math.random()*a.length)}while(i===FU[k]);";assert s.count(a)==1;s=s.replace(a,"i=((FU[k]==null?-1:FU[k])+1)%a.length;")
b="for(i=l.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=l[i];l[i]=l[j];l[j]=x}";assert s.count(b)==1;s=s.replace(b,"")
open(p,'w',encoding='utf8').write(s);print('det ok')
