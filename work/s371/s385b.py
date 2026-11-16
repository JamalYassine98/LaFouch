# S385b: (teste) tabela do contorno do corpo guardada uma vez para todas as Mochis da página; lista de 400 pontos do corpo tirada da tabela (sem novas perguntas ao navegador)
f='/home/claude/catalogo/js/lf-site.js';s=open(f,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:60]);s=s.replace(a,b)
tr("const TB=filSet.tb||(filSet.tb={}),","const TB=window.__lfCamt?(window.__lfTB||(window.__lfTB={})):(filSet.tb||(filSet.tb={})),")
tr("if(!filSet.bs){filSet.bs=[];for(let k=0;k<400;k++){const u=Lb*k/400,p=body.getPointAtLength(u);filSet.bs.push([u,p.x,p.y])}}",
   "if(!filSet.bs){if(window.__lfCamt&&window.__lfBS)filSet.bs=window.__lfBS;else{filSet.bs=[];for(let k=0;k<400;k++){const u=Lb*k/400,p=window.__lfCamt?pto(tB,u):body.getPointAtLength(u);filSet.bs.push([u,p.x,p.y])}if(window.__lfCamt)window.__lfBS=filSet.bs}}")
open(f,'w',encoding='utf8').write(s);print('ok')
