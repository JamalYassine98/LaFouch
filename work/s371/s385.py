# S385: no modo de teste ?camt=1 — (1) leitor de rosto preparado na abertura; (2) contorno do braço calculado por conta
f='/home/claude/catalogo/js/lf-site.js';s=open(f,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:60]);s=s.replace(a,b)
tr("var CAMT=false;try{CAMT=/[?&]camt=1/.test(location.search)||sessionStorage.getItem('lf_camt')==='1';if(CAMT)sessionStorage.setItem('lf_camt','1')}catch(_){}",
   "var CAMT=false;try{CAMT=/[?&]camt=1/.test(location.search)||sessionStorage.getItem('lf_camt')==='1';if(CAMT)sessionStorage.setItem('lf_camt','1')}catch(_){}window.__lfCamt=CAMT;")
tr("    function wkLiga(){return new Promise(function(ok,no){",
   """    /* S385 (teste): prepara o leitor na abertura — só se o arquivo já está guardado no aparelho ou a rede é Wi-Fi/cabo */
    function wkCedo(){if(window.__lfFakeMp||!window.Worker||!window.createImageBitmap||(Z.wk&&Z.wk.ok)||wkLiga.p)return;var vai=function(){window.__lfCedo=1;wkLiga().catch(function(){})},c=navigator.connection;
      if(c&&!c.saveData&&(c.type==='wifi'||c.type==='ethernet')){vai();return}
      try{fetch(new URL(FAB+'mp/face_landmarker.task',document.baseURI).href,{cache:'only-if-cached',mode:'same-origin'}).then(function(r){if(r&&r.ok)vai()},function(){})}catch(_){}}
    function wkLiga(){if(wkLiga.p)return wkLiga.p;var p=wkLiga0();wkLiga.p=p;var fim=function(){if(wkLiga.p===p)wkLiga.p=null};p.then(fim,fim);return p}
    function wkLiga0(){return new Promise(function(ok,no){""")
tr("    function intro(){Z.pc=ehPc();","    function intro(){if(CAMT)wkCedo();Z.pc=ehPc();")
tr("(window.__lfCam.fora?' · AO LADO (teste)'","(window.__lfCam.fora?' · AO LADO (teste)'+(window.__lfCedo?' · preparado antes':'')")
tr("const tA=tab(A,'a'+L.toFixed(1)),",
   """const tabA=L=>{const k='A'+L.toFixed(1);let t=TB[k];if(t)return t;const X=[],Y=[],ln=(x,y)=>{X.push(x);Y.push(y)},cb=(a,b,c,d,e,g,h,i)=>{for(let j=1;j<=64;j++){const u=j/64,w=1-u,p=w*w*w,q2=3*w*w*u,r2=3*w*u*u,z=u*u*u;ln(p*a+q2*c+r2*e+z*h,p*b+q2*d+r2*g+z*i)}};
   ln(-8,-10);ln(0,-10);cb(0,-10,L*.45,-11,L-2,-8.5,L,-1);cb(L,-1,L+1.5,5,L-4,9,L-9,8.5);cb(L-9,8.5,L*.45,8,L*.2,10,0,10);ln(-8,10);ln(-8,-10);
   const n0=X.length,C=new Float32Array(n0);for(let i=1;i<n0;i++)C[i]=C[i-1]+Math.hypot(X[i]-X[i-1],Y[i]-Y[i-1]);const Lt=C[n0-1],m=Math.max(120,Math.ceil(Lt*2)),P=new Float32Array((m+1)*2);let j=1;
   for(let i=0;i<=m;i++){const u=Lt*i/m;while(j<n0-1&&C[j]<u)j++;const d=C[j]-C[j-1],g=d>0?(u-C[j-1])/d:0;P[2*i]=X[j-1]+(X[j]-X[j-1])*g;P[2*i+1]=Y[j-1]+(Y[j]-Y[j-1])*g}return TB[k]={L:Lt,n:m,P:P}};
 const tA=window.__lfCamt?tabA(L):tab(A,'a'+L.toFixed(1)),""")
open(f,'w',encoding='utf8').write(s);print('ok')
