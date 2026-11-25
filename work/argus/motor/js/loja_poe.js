// ARGUS · põe a loja de teste no armazenamento do app (o caminho de verdade de um usuário), antes de o app abrir
async ([k,ls,big])=>{localStorage.clear();localStorage.setItem(k,JSON.stringify(ls));
 await new Promise((ok,no)=>{const r=indexedDB.open('lafouch-fotos',2);r.onupgradeneeded=()=>{const d=r.result;['fotos','hq','estado'].forEach(n=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n)})};
  r.onsuccess=()=>{const d=r.result;const t=d.transaction('estado','readwrite');const o=t.objectStore('estado');if(big)o.put(big,'big');else o.delete('big');t.oncomplete=()=>{d.close();ok()};t.onerror=()=>no(t.error)};r.onerror=()=>no(r.error)});return 1}
