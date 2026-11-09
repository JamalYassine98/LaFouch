#!/bin/bash
# cria cópia de teste do site em /tmp/$1 com seeds de teste (graus por cor e fm/mr) e serve na porta $2
D=/tmp/$1; pkill -f "http.server $2" ; rm -rf $D && cp -r /home/claude/catalogo $D && rm -rf $D/.git
python3 - "$D" <<'P'
import sys
p=sys.argv[1]+'/js/lf-site.js';j=open(p).read()
old="{ref:'GR3350',gen:'u',nome:'Óculos de leitura transparente',tipo:'grau',n:115000,cor:'#cfd6dc',raio:8,aviso:'',tag:'GRAU',rosto:['redondo', 'oval', 'coracao'],mat:'Acetato',med:[50, 21, 145],foto:'/media/i/b95b382e346d.jpg',cores:['#cfd6dc']}"
new="{lib:1,fc:['/media/i/b95b382e346d.jpg','/media/i/b0ce33cc336d.jpg'],cn:['Transparente','Preto'],gr:['+1.00','+1.50','+2.00','+2.75','+3.00'],gq:[3,2,2,4,1],gc:['3,-,2,4,0','-,2,-,0,1'],ref:'GR3350',gen:'u',nome:'Óculos de leitura transparente',tipo:'grau',n:115000,cor:'#cfd6dc',raio:8,aviso:'',tag:'GRAU',rosto:['redondo', 'oval', 'coracao'],mat:'Acetato',med:[50, 21, 145],foto:'/media/i/b95b382e346d.jpg',cores:['#cfd6dc','#1d1d1f']}"
j=j.replace(old,new)
import re
for m in re.finditer(r"\{ref:'([A-Z0-9]+)',",j[:20000]): pass
# todos os produtos do seed ganham fm='' e mr='' (como o app novo manda), alguns com formato
FM={'GR3340':'Quadrado','GR3350':'Quadrado','GR3345':'Retangular','SL2295':'Aviador','BR44140':'Gatinho','AC1050':'Quadrado','SL2210':'Hexagonal'}
MR={'BR44140':'Kazwini'}
def rep(m):
    r=m.group(1);return "{ref:'%s',fm:'%s',mr:'%s',"%(r,FM.get(r,''),MR.get(r,''))
j=re.sub(r"\{ref:'([A-Z0-9]+)',",rep,j,count=0)
j=j.replace('function syncProds(docs){',"P.forEach(function(p){if(p.fm!=null||p.mr!=null){var nn=lfnNomes(p);p.nome=nn.tit;p.ds=nn.ds}});/*TESTE*/function syncProds(docs){",1)
open(p,'w').write(j)
P
cd $D && (setsid nohup python3 -m http.server $2 >/dev/null 2>&1 < /dev/null &) ; sleep 1; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:$2/
