# S383 (continuação): a emenda do braço com o corpo (filSet) media o desenho ponto a ponto a cada quadro em que um braço se move — 16% do processador na chegada e no preparo.
# Agora os pontos do braço e do corpo são medidos uma vez e guardados (tabela), e o resultado de cada ângulo já calculado é reaproveitado. O desenho que sai é o mesmo.
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:90]);s=s.replace(a,b)
tr("const key=ang.toFixed(1)+'|'+L.toFixed(1);if(G._k===key)return;G._k=key;\n",
   "const key=ang.toFixed(1)+'|'+L.toFixed(1);if(G._k===key)return;G._k=key;\n const RC=filSet.rc||(filSet.rc=new Map()),kk=lado+'|'+key;if(RC.has(kk)){G.innerHTML=RC.get(kk);return}\n")
tr(" const La=A.getTotalLength(),Lb=body.getTotalLength(),n=90,r=2.6;const aP=t=>toS(A.getPointAtLength(((t%La)+La)%La)),bP=t=>body.getPointAtLength(((t%Lb)+Lb)%Lb);",
   """ /* S383: tabela de pontos do caminho (medida uma vez por forma) + interpolação — sem pedir ponto ao navegador a cada amostra */
 const TB=filSet.tb||(filSet.tb={}),tab=(path,k)=>{let t=TB[k];if(!t){const Lt=path.getTotalLength(),m=Math.max(240,Math.ceil(Lt*4)),P=new Float32Array((m+1)*2);for(let i=0;i<=m;i++){const p=path.getPointAtLength(Lt*i/m);P[2*i]=p.x;P[2*i+1]=p.y}t=TB[k]={L:Lt,n:m,P:P}}return t},
  pto=(t,u)=>{u=((u%t.L)+t.L)%t.L;const f=u/t.L*t.n,i=Math.min(t.n,Math.floor(f)),g=f-i,j=Math.min(t.n,i+1),P=t.P;return {x:P[2*i]+(P[2*j]-P[2*i])*g,y:P[2*i+1]+(P[2*j+1]-P[2*i+1])*g}};
 const tA=tab(A,'a'+L.toFixed(1)),tB=tab(body,'b'),La=tA.L,Lb=tB.L,n=90,r=2.6;const aP=t=>toS(pto(tA,t)),bP=t=>pto(tB,t);""")
tr(" G.innerHTML=h}"," if(RC.size>900)RC.clear();RC.set(kk,h);G.innerHTML=h}")
open(p,'w',encoding='utf8').write(s);print('ok')
