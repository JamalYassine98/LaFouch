/* S428 esboço MENU refinado (dono 18/11 18:30 "vamos elaborar"): no cartão da conta sai o "Olá," — fica o nome (primeiro + último)
   — e sai o círculo cheio com a letra. Duas variantes (pela porta da cópia de teste): A (porta 8001) = ícone fino de pessoa num círculo
   de fio, centralizado (cinza sem conta, rosa com conta — o estado fica visível); B (porta 8002) = sem ícone, só o nome. Deslogado não muda. VIP continua. Vai por cima do menu v3 aprovado. */
(function(){
  var V='A';/* 18/11 19:14: dono escolheu A; a B saiu de cena (regra SÓ A ÚLTIMA VERSÃO) */
  var s=document.createElement('style');
  s.textContent=V==='A'?'html body #drw .dacc>span#dav{background:transparent!important;border:1px solid var(--ln2);color:var(--mu)!important;padding:0!important;box-sizing:border-box}html body #drw .dacc.lflog>span#dav{border-color:color-mix(in srgb,var(--ac) 45%,transparent);color:var(--ac)!important}':'html body .dacc.lfsemav #dav{display:none!important}';
  document.head.appendChild(s);
  var ICO='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>';
  function nome(){try{var c=JSON.parse(localStorage.getItem('lf_conta')||'null');var a=localStorage.getItem('lf_auth');if(!c||!c.nome||!a)return '';var p=String(c.nome).trim().split(/\s+/);return p.length>1?p[0]+' '+p[p.length-1]:p[0]}catch(_){return ''}}
  function aj(){var n=document.getElementById('dacn'),av=document.getElementById('dav'),card=n&&n.closest('.dacc');if(!n||!card)return;var nm=nome();
    card.classList.toggle('lflog',!!nm);if(V==='B')card.classList.toggle('lfsemav',!!nm);
    if(!nm||!/^(Olá|Hola),/.test(n.firstChild&&n.firstChild.nodeType===3?n.firstChild.nodeValue:'')){return}
    n.firstChild.nodeValue=nm;if(V==='A'&&av&&av.innerHTML.indexOf('<svg')<0)av.innerHTML=ICO;if(V==='B')card.classList.add('lfsemav')}
  var t=0;new MutationObserver(function(){if(t)return;t=requestAnimationFrame(function(){t=0;(aj)()})}).observe(document.body,{childList:true,subtree:true,characterData:true});aj();
})();
