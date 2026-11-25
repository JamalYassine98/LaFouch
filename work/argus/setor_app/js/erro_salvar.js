// ARGUS · setor App · estado "erro ao salvar": o aparelho recusa guardar (como um celular sem espaço). O app tem de avisar.
(()=>{if(!/index\.html$|\/$/.test(location.pathname))return;   // só no app (a loja de teste entra antes, por outra página)
 const ls=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('lafouch'))throw new Error('QuotaExceededError (Argus)');return ls.apply(this,arguments)};
 const op=indexedDB.open.bind(indexedDB);indexedDB.open=function(){const r=op.apply(null,arguments);r.addEventListener('success',()=>{const d=r.result;const t=d.transaction.bind(d);d.transaction=function(s,m){if(m==='readwrite')throw new Error('Argus: gravação recusada');return t(s,m)}});return r}})()
