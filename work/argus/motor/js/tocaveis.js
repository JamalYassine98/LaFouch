// ARGUS · a lista do que se pode tocar (nome que aparece, ação, ordem)
()=>window.__argus.tocaveis().map((e,i)=>({i,nome:window.__argus.nome(e),act:e.getAttribute('data-act')||'',id:e.getAttribute('data-id')||'',tag:e.tagName.toLowerCase()}))
