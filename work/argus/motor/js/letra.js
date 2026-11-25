// ARGUS · a letra grande do celular imitada no simulador DO JEITO DO ANDROID (aprovado 25/11 08:13): cada tamanho de letra que o
// app escreve no CSS cresce na mesma proporção, ANTES de o app desenhar a tela (motor/abrir.py põe este código no fim do <head>,
// depois de todo o CSS da página). Serve ao app e ao site. As regras do app continuam valendo: se o app desce a letra porque não cabe (data-cabe), ela desce na hora.
(f)=>{if(window.__argusLetra)return 1;window.__argusLetra=f;
 const px=v=>{const m=/^(-?[\d.]+)px$/.exec((v||'').trim());return m?parseFloat(m[1]):null};
 const escala=st=>{const v=st.getPropertyValue('font-size');if(!v)return;const n=px(v),pr=st.getPropertyPriority('font-size');
  if(n!=null)st.setProperty('font-size',(n*f).toFixed(2)+'px',pr);else if(/px/.test(v)&&/^(calc|clamp|min|max)\(/.test(v.trim()))st.setProperty('font-size','calc('+v+' * '+f+')',pr)};
 const anda=rs=>{for(const r of rs){if(r.style)escala(r.style);if(r.cssRules)anda(r.cssRules)}};
 const feitas=new WeakSet(),folha=s=>{if(!s||feitas.has(s))return;try{anda(s.cssRules);feitas.add(s)}catch(e){}};   // cada folha de estilo cresce uma vez
 for(const s of document.styleSheets)folha(s);
 // folhas que chegam depois (<style> no corpo ou posto pelo código, <link> que termina de carregar) também crescem
 const novas=()=>{for(const s of document.styleSheets)folha(s)};document.addEventListener('load',e=>{if(e.target&&e.target.tagName==='LINK')novas()},true);
 const b=document.createElement('style');b.textContent=':root{font-size:'+(16*f)+'px}';document.head.prepend(b);   // a letra de base (16 px) também cresce
 const inl=()=>{for(const e of document.querySelectorAll('[style*="font-size"]')){const v=e.style.fontSize;if(e.dataset.argusLt===v)continue;const n=px(v);if(n==null)continue;   // letra escrita direto na peça
  const nv=(n*f).toFixed(2)+'px';e.dataset.argusLt=nv;e.style.setProperty('font-size',nv,e.style.getPropertyPriority('font-size'))}};
 inl();new MutationObserver(()=>{novas();inl()}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['style']});return 1}
