// ARGUS · põe a loja de teste no armazenamento do app (o caminho de verdade de um usuário), antes de o app abrir.
// Antes, apaga tudo o que o app guardou (como um aparelho novo): no Android emulado o mesmo app abre várias vezes, e uma escolha
// guardada de uma tela (ex.: a aba de Pedidos) não pode passar para a próxima — no simulador cada abertura já é um aparelho novo.
async ([k,ls,big])=>{localStorage.clear();sessionStorage.clear();localStorage.setItem(k,JSON.stringify(ls));
 await new Promise((ok,no)=>{const r=indexedDB.open('lafouch-fotos',2);r.onupgradeneeded=()=>{const d=r.result;['fotos','hq','estado'].forEach(n=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n)})};
  r.onsuccess=()=>{const d=r.result,ns=[...d.objectStoreNames];const t=d.transaction(ns,'readwrite');ns.forEach(n=>t.objectStore(n).clear());if(big)t.objectStore('estado').put(big,'big');t.oncomplete=()=>{d.close();ok()};t.onerror=()=>no(t.error)};r.onerror=()=>no(r.error)});return 1}
