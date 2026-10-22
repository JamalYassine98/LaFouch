/* Leitor de texto local (Tesseract compilado para WebAssembly), sem internet. */
var M=null,api=null;
function reply(id,o){o.id=id;postMessage(o)}
onmessage=async function(e){var d=e.data;
  try{
    if(d.t==='init'){
      importScripts(d.core);
      M=await TesseractCore({});
      var r=await fetch(d.lang);if(!r.ok)throw new Error('dicionário '+r.status);
      M.FS.writeFile('./eng.traineddata',new Uint8Array(await r.arrayBuffer()));
      api=new M.TessBaseAPI();
      if(api.Init(null,'eng',1)===-1)throw new Error('init');
      reply(d.id,{ok:true});
    }else if(d.t==='params'){
      for(var k in d.p)api.SetVariable(k,String(d.p[k]));
      reply(d.id,{ok:true});
    }else if(d.t==='rec'){
      M.FS.writeFile('/input',new Uint8Array(d.png));
      if(api.SetImageFile(1,0)===1)throw new Error('imagem');
      api.Recognize(null);
      var tsv='';try{if(d.tsv&&api.GetTSVText)tsv=api.GetTSVText(0)}catch(e2){}reply(d.id,{ok:true,text:api.GetUTF8Text(),tsv:tsv});
    }
  }catch(err){reply(d.id,{ok:false,err:String(err&&err.message||err)})}
};
