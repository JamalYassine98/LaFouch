// ARGUS · o mundo parado (o MESMO no simulador e no Android): o relógio no mesmo dia e hora da loja de teste (__T0__ = a hora em ms)
// e o sorteio (Math.random) sempre na mesma sequência — enfeites sorteados (estrelinhas do Natal) saem iguais toda vez.
(()=>{if(window.__argusRelogio)return;window.__argusRelogio=1;const R=Date,O=__T0__-R.now();class D extends R{constructor(...a){a.length?super(...a):super(R.now()+O)}static now(){return R.now()+O}};window.Date=D;try{sessionStorage.setItem('lf_ni','1')}catch(e){}})();
(()=>{if(window.__argusSorte)return;window.__argusSorte=1;let s=20261124;Math.random=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})();
