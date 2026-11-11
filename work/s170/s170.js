/* ESBOÇO S170: animação leve do tema no destaque + selo do tema nos cards */
(function(){
  var SELO={natal:'Regalo ideal',anonovo:'Año nuevo',maes:'Para mamá',pais:'Para papá',bf:'Black Friday',halloween:'Halloween'};
  var MO='<svg viewBox="0 0 34 16"><path d="M17 5c1-2 2-2 3 0 3-3 8-4 14-1-3 0-5 2-5 5-2-2-5-2-7 1-1-1-3-1-5 0-2-3-5-3-7-1 0-3-2-5-5-5 6-3 11-2 14 1 1-2 2-2 3 0z"/></svg>';
  function r(a,b){return a+Math.random()*(b-a)}
  function fx(){
    var ev=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'');
    var hd=document.querySelector('#home .hd');if(!ev||!hd||hd.querySelector('.evfx'))return;
    var c=document.createElement('div');c.className='evfx';var W=hd.offsetWidth,H=hd.offsetHeight,h='',i;
    function cai(cls,n,t0,t1){for(i=0;i<n;i++)h+='<i class="'+cls+'" style="left:'+r(0,98)+'%;--t:'+r(t0,t1)+'px;--d:'+r(7,12)+'s;--a:-'+r(0,10)+'s;--dx:'+r(-30,30)+'px;--h:'+(H+40)+'px;--r:'+r(-180,180)+'deg"></i>'}
    function pis(n,cor,t0,t1){for(i=0;i<n;i++)h+='<i class="br" style="left:'+r(3,95)+'%;top:'+r(4,90)+'%;--t:'+r(t0,t1)+'px;--d:'+r(1.8,3.2)+'s;--a:'+r(0,3)+'s;--c:'+cor+'"></i>'}
    if(ev==='natal')cai('fl',14,3,6);
    if(ev==='maes')cai('pt',10,7,11);
    if(ev==='anonovo')pis(10,document.documentElement.getAttribute('data-ev')==='anonovo-n'?'#f1dcae':'#c9a86a',8,14);
    if(ev==='pais')pis(6,'#e0b878',7,11);
    if(ev==='bf')h='<i class="sh"></i>';
    if(ev==='halloween'){h+='<i class="mo" style="--w:'+W+'px;--y0:'+H*.12+'px;--y1:'+H*.30+'px;--s:1;--d:5.5s;--a:.4s">'+MO+'</i>';h+='<i class="mo" style="--w:'+W+'px;--y0:'+H*.30+'px;--y1:'+H*.14+'px;--s:.7;--d:6.5s;--a:1.6s">'+MO+'</i>'}
    c.innerHTML=h;hd.insertBefore(c,hd.firstChild);
    setTimeout(function(){c.classList.add('fim')},window.__evfxFim||10000);
  }
  function selo(){
    var ev=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'');if(!SELO[ev])return;
    document.querySelectorAll('#home .hc .hci').forEach(function(x,k){if(k>3||x.querySelector('.evse'))return;if(getComputedStyle(x).position==='static')x.style.position='relative';var s=document.createElement('span');s.className='evse';s.textContent=SELO[ev];x.appendChild(s)});
  }
  function vai(){fx();selo()}
  if(document.readyState==='complete')setTimeout(vai,800);else addEventListener('load',function(){setTimeout(vai,800)});
  new MutationObserver(function(){setTimeout(vai,300)}).observe(document.documentElement,{attributes:true,attributeFilter:['data-ev']});
})();
