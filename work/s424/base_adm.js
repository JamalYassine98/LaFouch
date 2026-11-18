/* S424: simula o MODO ADMINISTRADOR nas duas cópias (o site está desligado para clientes; o dono vê o catálogo com a barra do administrador) */
(function(){var tira=function(){var m=document.getElementById('manut');if(m)m.remove();document.documentElement.style.overflow=''};tira();new MutationObserver(tira).observe(document.body,{childList:true});setInterval(tira,300)})();
window.__admDg='Diagnóstico · catálogo lido 13:06:45 · 19 peças na nuvem · 18 no site · conferido — · último envio do app 18/11 13:05:58';
