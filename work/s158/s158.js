/* S158 esboço: animações suaves da compra (só demonstração) */
(function(){
var css=document.createElement('style');css.textContent=
'@media (prefers-reduced-motion:no-preference){'+
'.cartp.s58in .cph,.cartp.s58in .stp,.cartp.s58in .ci,.cartp.s58in .cs{animation:s58up .42s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*70ms)}'+
'@keyframes s58up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}'+
'.qty span{display:inline-block;min-width:18px;text-align:center;overflow:hidden}.qty span.up{animation:s58nu .26s ease}.qty span.dn{animation:s58nd .26s ease}'+
'@keyframes s58nu{from{transform:translateY(60%);opacity:0}to{transform:none;opacity:1}}@keyframes s58nd{from{transform:translateY(-60%);opacity:0}to{transform:none;opacity:1}}'+
'.ci.s58out{animation:s58out .34s ease forwards;overflow:hidden}@keyframes s58out{0%{opacity:1;max-height:220px}40%{opacity:0;transform:translateX(16px);max-height:220px}100%{opacity:0;max-height:0;padding:0;margin:0;border-width:0}}'+
'.cs-b{transition:background .25s,color .25s,transform .12s!important}.cs-b.s58p{transform:scale(.97)}'+
'.cs-c,.crl{transition:color .2s}.cs-c:hover,.crl:hover{color:#8d3a69!important}'+
'#bagbtn.s58b{animation:s58b .5s cubic-bezier(.3,1.6,.5,1)}@keyframes s58b{0%{transform:none}35%{transform:scale(1.22) rotate(-6deg)}100%{transform:none}}'+
'.s58t{position:fixed;left:50%;bottom:36px;transform:translateX(-50%);z-index:9999;display:flex;gap:14px;align-items:center;background:#2a1f27;color:#fff;border-radius:999px;padding:13px 22px;font:500 15px var(--body);box-shadow:0 12px 30px rgba(0,0,0,.2);animation:s58t .35s cubic-bezier(.2,.8,.2,1)}.s58t a{color:#f2c6dc;text-decoration:none;font-weight:600}'+
'@keyframes s58t{from{opacity:0;transform:translate(-50%,24px)}to{opacity:1;transform:translate(-50%,0)}}'+
'}';
document.head.appendChild(css);
function fmt(v){return 'R$ '+v}
function conta(el,de,ate){var t0=performance.now(),D=380;function f(t){var k=Math.min(1,(t-t0)/D);k=1-Math.pow(1-k,3);el.textContent=fmt(Math.round(de+(ate-de)*k));if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function total(){var s=0;document.querySelectorAll('.cartp .ci:not(.s58out)').forEach(function(ci){var u=+ci.querySelector('.pu span').textContent.replace(/\D/g,''),q=+ci.querySelector('.qty span').textContent;s+=u*q;var p=ci.querySelector('.cis .pr');var ant=+p.textContent.replace(/\D/g,'');if(ant!==u*q)conta(p,ant,u*q)});
 var t=document.querySelector('.cartp .cs-t b'),a=+t.textContent.replace(/\D/g,'');conta(t,a,s);var sb=document.querySelector('.cartp .cs-r span:last-child');if(sb)conta(sb,+sb.textContent.replace(/\D/g,''),s)}
window.__s58entra=function(){var c=document.querySelector('.cartp');if(!c)return;c.classList.add('s58in');var i=0;c.querySelectorAll('.cph,.stp,.ci,.cs').forEach(function(e){e.style.setProperty('--i',i++)})};
document.addEventListener('click',function(e){var b=e.target.closest('.cartp [data-inc],.cartp [data-dec],.cartp [data-rm]');if(!b)return;e.stopPropagation();e.preventDefault();
 var ci=b.closest('.ci');if(b.dataset.rm){ci.classList.add('s58out');setTimeout(function(){ci.remove();total()},340);return}
 var s=ci.querySelector('.qty span'),q=+s.textContent+(b.dataset.inc?1:-1);if(q<1)return;s.classList.remove('up','dn');void s.offsetWidth;s.textContent=q;s.classList.add(b.dataset.inc?'up':'dn');total()},true);
document.addEventListener('mousedown',function(e){var b=e.target.closest('.cs-b');if(b)b.classList.add('s58p')},true);
document.addEventListener('mouseup',function(){document.querySelectorAll('.s58p').forEach(function(b){b.classList.remove('s58p')})},true);
window.__s58add=function(){var b=document.getElementById('bagbtn');b.classList.remove('s58b');void b.offsetWidth;b.classList.add('s58b');var t=document.createElement('div');t.className='s58t';t.innerHTML='Adicionado <a href="#">Ver carrinho ›</a>';document.body.appendChild(t);setTimeout(function(){t.remove()},2600)};
})();
