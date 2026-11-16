# S388 (dono 16/11 15:55 "aprovo suas propostas, implementar"): a claridade passa a ser medida no trabalhador ao lado (mesma região e mesma conta); o fio principal não copia mais a imagem da câmera quando o trabalhador está em uso
f='/home/claude/catalogo/js/lf-site.js';s=open(f,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:70]);s=s.replace(a,b)
tr("fazLuz=!(Z.mp||wkOk)||Z.lzN%4===1;","wkLuz=wkOk&&!!Z.wk.luz,fazLuz=!(Z.mp||wkOk)||(Z.lzN%4===1&&!wkLuz);")
tr("        if(wkOk){var my=++Z.wk.id,st0=Z.st,wk0=Z.wk;",
   """        if(wkOk){var my=++Z.wk.id,st0=Z.st,wk0=Z.wk;
          /* S388: claridade do meio da imagem (mesma região de sempre: 60% × 70%), 1 a cada 4 medições, calculada no trabalhador */
          if(wkLuz&&Z.lzN%4===1)try{createImageBitmap(v,Math.round(VW*.2),Math.round(VH*.15),Math.round(VW*.6),Math.round(VH*.7),{resizeWidth:48,resizeHeight:Math.max(8,Math.round(48*(VH*.7)/(VW*.6))),resizeQuality:'low'}).then(function(b2){if(Z.wk!==wk0||Z.st!==st0){try{b2.close()}catch(_){}return}wk0.w.postMessage({t:'luz',bm:b2},[b2])},function(){})}catch(_){}""")
tr("w.onmessage=function(e2){var c=Z.wk&&Z.wk.cb;if(e2.data.t==='r'&&c)c(e2.data)};",
   "w.onmessage=function(e2){var c=Z.wk&&Z.wk.cb;if(e2.data.t==='luz'){if(Z.wk&&Z.wk.w===w&&Z.el&&Z.st&&e2.data.lu!=null){var lu=window.__lfFakeLum!=null?window.__lfFakeLum:e2.data.lu;window.__lfLuT=e2.data.lu;Z.lum=Z.lum==null?lu:Z.lum*.6+lu*.4;if(Z.fase==='teste'&&!Z.luzP){Z.lzT++;if(escuro())Z.lzE++}}return}if(e2.data.t==='r'&&c)c(e2.data)};")
tr("Z.wk={w:w,ok:true,del:d.del,id:0};","Z.wk={w:w,ok:true,del:d.del,id:0,luz:!!d.luz};")
open(f,'w',encoding='utf8').write(s)
g='/home/claude/catalogo/lfx/mp/mp-trab.js';t=open(g,encoding='utf8').read()
a="self.postMessage({t:'ok',del:del})";assert t.count(a)==1;t=t.replace(a,"self.postMessage({t:'ok',del:del,luz:typeof OffscreenCanvas!=='undefined'})")
a="  if(d.t==='img'){";assert t.count(a)==1
t=t.replace(a,"""  /* S388: claridade média de um recorte pequeno do meio da imagem (nada é guardado) */
  if(d.t==='luz'){var lu=null;try{var b=d.bm,c=self.__cl||(self.__cl=new OffscreenCanvas(b.width,b.height));if(c.width!==b.width||c.height!==b.height){c.width=b.width;c.height=b.height}
      var x=c.getContext('2d',{willReadFrequently:true});x.drawImage(b,0,0);var p=x.getImageData(0,0,b.width,b.height).data,sm=0,nn=0;for(var k=0;k<p.length;k+=4){sm+=p[k]*.299+p[k+1]*.587+p[k+2]*.114;nn++}lu=nn?sm/nn:null}catch(_){lu=null}
    try{d.bm.close()}catch(_){}self.postMessage({t:'luz',lu:lu});return}
"""+a)
t=t.replace("/* S384 (16/11/2026) — MODO DE TESTE (?camt=1): a leitura","/* S384/S386 (16/11/2026): a leitura")
open(g,'w',encoding='utf8').write(t);print('ok')
