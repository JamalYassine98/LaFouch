(()=>{const r=document.documentElement,b=document.getElementById('evbar'),t=document.querySelector('.top');
const st=document.createElement('style');st.textContent=
"html.v5[data-ev]:has(#layer .scrim.pg) #evbar{position:fixed;top:0;left:0;right:0}"+
"html.v5[data-ev]:has(#layer .scrim.pg) .top{top:calc(var(--evh,0px) - .5px)!important}"+
"html.v5[data-ev]:has(#layer .scrim.pg) body{padding-top:var(--evh,0px)}"+
"html.v5 body #layer .scrim.pg{top:calc(var(--hth2,64px) - 1px)!important}"+
"html.v5[data-ev] body #layer .scrim.pg{top:calc(var(--hth2,64px) + var(--evh,0px) - 1.5px)!important}";
document.head.appendChild(st);
const set=()=>{const z=parseFloat(getComputedStyle(document.body).zoom)||1;
 r.style.setProperty('--evh',(b&&getComputedStyle(b).display!=='none'?parseFloat(getComputedStyle(b).height):0)+'px');
 if(t)r.style.setProperty('--hth2',(t.getBoundingClientRect().height/z)+'px')};
set();if(window.ResizeObserver){b&&new ResizeObserver(set).observe(b);t&&new ResizeObserver(set).observe(t)}addEventListener('resize',set)})()
