// ARGUS · lê a loja do jeito que o app guarda: localStorage (estado leve) + IndexedDB 'lafouch-fotos' › 'estado' › 'big' (listas grandes)
async (k)=>{if(window.__LF&&__LF.salvarAgora)__LF.salvarAgora();await new Promise(r=>setTimeout(r,800));
 const big=await new Promise((ok,no)=>{const r=indexedDB.open('lafouch-fotos',2);r.onsuccess=()=>{const d=r.result;const g=d.transaction('estado','readonly').objectStore('estado').get('big');g.onsuccess=()=>{d.close();ok(g.result||null)};g.onerror=()=>no(g.error)};r.onerror=()=>no(r.error)});
 return {ls:JSON.parse(localStorage.getItem(k)||'null'),big}}
