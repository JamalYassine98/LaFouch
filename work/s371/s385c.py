# S385c: (teste) contorno do corpo também calculado por conta (caminho de curvas M/C/L/Z), sem perguntar ao navegador
f='/home/claude/catalogo/js/lf-site.js';s=open(f,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:60]);s=s.replace(a,b)
tr(" const tA=window.__lfCamt?tabA(L):tab(A,'a'+L.toFixed(1)),tB=tab(body,'b'),",
   """ const tabD=(d,k)=>{let t=TB[k];if(t)return t;const X=[],Y=[],tk=d.match(/[MCLZ]|-?\\d*\\.?\\d+/g)||[];let i=0,c='',x=0,y=0,x0=0,y0=0;const nx=()=>parseFloat(tk[i++]);
   while(i<tk.length){if(/[MCLZ]/.test(tk[i]))c=tk[i++];if(c==='M'){x=x0=nx();y=y0=nx();X.push(x);Y.push(y);c='L'}else if(c==='L'){x=nx();y=nx();X.push(x);Y.push(y)}else if(c==='C'){const a=nx(),b=nx(),e=nx(),g=nx(),h=nx(),j=nx();for(let s2=1;s2<=96;s2++){const u=s2/96,w=1-u;X.push(w*w*w*x+3*w*w*u*a+3*w*u*u*e+u*u*u*h);Y.push(w*w*w*y+3*w*w*u*b+3*w*u*u*g+u*u*u*j)}x=h;y=j}else if(c==='Z'){if(x!==x0||y!==y0){X.push(x0);Y.push(y0)}x=x0;y=y0;c=''}else i++}
   const n0=X.length,C=new Float32Array(n0);for(let q2=1;q2<n0;q2++)C[q2]=C[q2-1]+Math.hypot(X[q2]-X[q2-1],Y[q2]-Y[q2-1]);const Lt=C[n0-1],m=Math.max(120,Math.ceil(Lt*2)),P=new Float32Array((m+1)*2);let j2=1;
   for(let q2=0;q2<=m;q2++){const u=Lt*q2/m;while(j2<n0-1&&C[j2]<u)j2++;const dd=C[j2]-C[j2-1],g=dd>0?(u-C[j2-1])/dd:0;P[2*q2]=X[j2-1]+(X[j2]-X[j2-1])*g;P[2*q2+1]=Y[j2-1]+(Y[j2]-Y[j2-1])*g}return TB[k]={L:Lt,n:m,P:P}};
 const bd0=window.__lfCamt?(body.getAttribute('d')||''):'',tA=window.__lfCamt?tabA(L):tab(A,'a'+L.toFixed(1)),tB=(bd0&&!/[^MCLZ\\d\\s.,-]/.test(bd0))?tabD(bd0,'b'):tab(body,'b'),""")
open(f,'w',encoding='utf8').write(s);print('ok')
