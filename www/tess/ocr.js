/* Interface compatível com tesseract.js, usando o leitor local (tess/ocr-worker.js). */
(function(){
  var base=(document.currentScript&&document.currentScript.src||'').replace(/[^\/]*$/,'');
  function hasSimd(){try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]))}catch(e){return false}}
  function createWorker(){return new Promise(function(ok,no){
    var w,id=0,pend={};
    try{w=new Worker(base+'ocr-worker.js')}catch(e){no({code:'noworker',message:String(e)});return}
    function failAll(m){for(var k in pend){pend[k].no({code:'ocr',message:m})}pend={}}
    w.onmessage=function(e){var p=pend[e.data.id];if(!p)return;delete pend[e.data.id];e.data.ok?p.ok(e.data):p.no({code:'ocr',message:e.data.err})};
    w.onerror=function(e){failAll(e&&e.message||'worker')};
    function call(m,tr){return new Promise(function(a,b){var i=++id;pend[i]={ok:a,no:b};m.id=i;w.postMessage(m,tr||[])})}
    var tm=setTimeout(function(){failAll('timeout');try{w.terminate()}catch(e){}},30000);
    call({t:'init',core:base+(hasSimd()?'core-simd.js':'core.js'),lang:base+'eng-data.wasm'}).then(function(){clearTimeout(tm);
      ok({setParameters:function(p){return call({t:'params',p:p})},
        recognize:function(cv,opt){return new Promise(function(a,b){var go=function(bl){bl.arrayBuffer().then(function(ab){call({t:'rec',png:ab,tsv:!!(opt&&opt.tsv)},[ab]).then(function(r){a({data:{text:r.text||'',tsv:r.tsv||''}})},b)},b)};
          if(cv.toBlob)cv.toBlob(function(bl){bl?go(bl):b({code:'img'})},'image/png');else go(cv)})},
        terminate:function(){w.terminate()}})},function(e){clearTimeout(tm);no(e)})})}
  var shared=null;
  var T=window.TesseractLocal={createWorker:function(){return createWorker()},
    recognize:function(img){shared=shared||createWorker();return shared.then(function(w){return w.recognize(img)})}};
  if(!window.Tesseract)window.Tesseract={createWorker:function(){return createWorker()},recognize:function(img){return T.recognize(img)}};
})();
