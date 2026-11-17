# S410 · ESBOÇO: "a mão chega depois do braço" (follow-through). Braço dobra de leve na ponta quando gira e endireita com mola.
# python3 edita.py <lf-site.js>   (só em CÓPIA até o dono aprovar e dizer "implementar")
import sys,subprocess
p=sys.argv[1];s=open(p,encoding='utf8').read()
def troca(a,b,n=1):
    global s;c=s.count(a);assert c==n,('achei %d× (esperava %d): '%(c,n))+a[:90];s=s.replace(a,b)
# 1) forma do braço com dobra b (graus na ponta): cada ponto gira em volta do ombro proporcional a (x/L)^1.7
troca("const ARMP=L=>`M0 -10 C${L*.45} -11 ${L-2} -8.5 ${L} -1 C${L+1.5} 5 ${L-4} 9 ${L-9} 8.5 C${L*.45} 8 ${L*.2} 10 0 10 Z`;",
 "const BEND=(x,y,L,b)=>{if(!b||x<=0)return [x,y];const t=b*Math.PI/180*Math.pow(Math.min(1.2,x/L),1.7),c=Math.cos(t),s=Math.sin(t);return [x*c-y*s,x*s+y*c]};\n"
 "const BSTR=(d,L,b)=>{if(!b)return d;const n=d.match(/-?\\d*\\.?\\d+/g);let k=0;const o=[];for(let i=0;i+1<n.length;i+=2){const r=BEND(+n[i],+n[i+1],L,b);o.push(r[0].toFixed(2),r[1].toFixed(2))}return d.replace(/-?\\d*\\.?\\d+/g,()=>o[k++])};\n"

 "const ARMP0=L=>`M0 -10 C${L*.45} -11 ${L-2} -8.5 ${L} -1 C${L+1.5} 5 ${L-4} 9 ${L-9} 8.5 C${L*.45} 8 ${L*.2} 10 0 10 Z`;\nconst ARMP=(L,b)=>BSTR(ARMP0(L),L,b);")
troca("const ARMH=L=>`M${L*.35} -5 Q${L*.62} -6.5 ${L*.8} -3.5`,ARMHF=L=>`M${L*.42} -5 Q${L*.66} -6.5 ${L*.84} -3.5`;",
 "const ARMH=(L,b)=>BSTR(`M${L*.35} -5 Q${L*.62} -6.5 ${L*.8} -3.5`,L,b),ARMHF=(L,b)=>BSTR(`M${L*.42} -5 Q${L*.66} -6.5 ${L*.84} -3.5`,L,b);")
# 2) desenho do braço recebe a dobra
troca("function armSet(lado,ang,L,fE){const c=lado<0?'e':'d',B=N['aB'+c],F=N['aF'+c],T=armT(lado,ang),p=ARMP(L);",
 "function armSet(lado,ang,L,fE,bd){bd=Math.round((bd||0)*2)/2;const c=lado<0?'e':'d',B=N['aB'+c],F=N['aF'+c],T=armT(lado,ang),p=ARMP(L,bd);")
troca("if(B._p!==p){SA(B.firstChild,'d',p);SA(B.lastChild,'d',ARMH(L));const t=F.firstChild;SA(t.children[0],'d',p);SA(t.children[1],'d',p);SA(t.children[2],'d',ARMHF(L));",
 "if(B._p!==p){SA(B.firstChild,'d',p);SA(B.lastChild,'d',ARMH(L,bd));const t=F.firstChild;SA(t.children[0],'d',p);SA(t.children[1],'d',p);SA(t.children[2],'d',ARMHF(L,bd));")
troca("filSet(lado,ang,L,op<.5)}","filSet(lado,ang,L,op<.5,bd)}")
# 3) contorno de junção com o corpo usa a mesma forma dobrada
troca("function filSet(lado,ang,L,vis){","function filSet(lado,ang,L,vis,bd){bd=bd||0;")
troca("const key=ang.toFixed(1)+'|'+L.toFixed(1);","const key=ang.toFixed(1)+'|'+L.toFixed(1)+'|'+bd;")
troca("SA(A,'d',ARMP(L).replace(","SA(A,'d',ARMP(L,bd).replace(")
troca("const tabA=L=>{const k='A'+L.toFixed(1);","const tabA=L=>{const k='A'+L.toFixed(1)+'|'+bd;")
troca("ln(-8,-10);ln(0,-10);cb(0,-10,L*.45,-11,L-2,-8.5,L,-1);","ln(-8,-10);ln(0,-10);cb(0,-10,L*.45,-11,L-2,-8.5,L,-1);")
troca("ln(-8,10);ln(-8,-10);\n   const n0=X.length,","ln(-8,10);ln(-8,-10);if(bd)for(let i=0;i<X.length;i++){const r=BEND(X[i],Y[i],L,bd);X[i]=r[0];Y[i]=r[1]}\n   const n0=X.length,")
troca("tab(A,'a'+L.toFixed(1))","tab(A,'a'+L.toFixed(1)+'|'+bd)")
# 4) a dobra segue a velocidade do braço (vale também nos gestos): a ponta atrasa e depois alcança com mola
troca("armSet(-1,ae,Le,fE);armSet(1,ad,Ld,fD);",
 "const BD=S.bd||(S.bd={e:0,we:0,d:0,wd:0,pe:ae,pd:ad});for(const [c,a] of [['e',ae],['d',ad]]){const w='w'+c,pr='p'+c,vel=(a-BD[pr])/Math.max(1,dt);BD[pr]=a;if(RM.matches){BD[c]=0;BD[w]=0;continue}const pn=N._pon||(N._pon=q('.pon')),cv=c==='d'&&pn&&pn.style.opacity==='1',alvo=cv?0:Math.max(-16,Math.min(16,-vel*3.2));for(let i=0;i<Math.round(dt)||i<1;i++){BD[w]+=(alvo-BD[c])*.22;BD[w]*=.62;BD[c]+=BD[w]}if(Math.abs(BD[c])<.25&&Math.abs(BD[w])<.05)BD[c]=0}\n   armSet(-1,ae,Le,fE,BD.e);armSet(1,ad,Ld,fD,BD.d);")
open(p,'w',encoding='utf8').write(s)
r=subprocess.run(['node','-e',"new (require('vm').Script)(require('fs').readFileSync('%s','utf8'))"%p],capture_output=True,text=True);assert r.returncode==0,r.stderr[-400:];print('ok')
