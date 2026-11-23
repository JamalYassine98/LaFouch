/* PINTURA (só no esboço) · IDEIAS 09q · a família de botões no acabamento do Comprar P1 suave, aplicada no site.
   Uma regra num lugar só: a cor --lfc (cor do logo suave #7f5773; nos eventos, a cor do evento) e 4 papéis:
   - PRINCIPAL: --lfc cheio, letra branca Inter 500 13 px, espaço .18em, caixa alta, 48 px; sem brilho, sombra, degradê, verde.
     Ícone só onde diz para onde vai (WhatsApp, câmera), 16 px antes da palavra. Comprar: só a palavra.
   - SECUNDÁRIO: fio de 1 px e letra --lfc, mesma forma e letra.
   - COMPACTO: 32 px, letra 11 px (dentro de cartão/linha).
   - LINK: texto --lfc, frase normal, com › (dentro de frase, sublinhado fino).
   Não mudam (pedido do dono): Cancelar pedido (aprovado v3), Continuar com Google, Sair da conta, Excluir minha conta,
   Cédula/RUC, rodapé (aprovado no 08). */
(function(){
 var H='html body:not(#_a):not(#_b) ';
 var PRIN=['.bb.p','.btn.w','.cs-b','.gzgo','.rzg','.btn.p.ic','a.p.lx44:not([data-cmpclear])','#lojista','#manut .btn'];
 var SEC=['.p1','a.s.lx44'];
 var COMP_CHEIO=['[data-cmpopen]','.cmpc .btn.p'];
 var COMP_FIO=['.gsb'];
 var LINK=['.p2','.cs-c','.lfgf','a.mp:not(.lfft a)','.cfx','.soall','.gzbk','.ajbk','.navb','.vback','[data-pzvolta]','[data-pgc2]'];
 var COM_ICONE=['.rzg','.btn.p.ic','#lojista','#manut .btn'];
 function sel(L,x){return L.map(function(s){return H+s+(x||'')}).join(',')}
 var LET='font:500 13px/1 var(--body)!important;letter-spacing:.18em!important;text-transform:uppercase!important;white-space:nowrap!important;';
 var FORMA='border-radius:999px!important;box-shadow:none!important;transform:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;transition:background-color .3s,color .3s!important;';
 var css=
  /* UMA cor (a da marca); o resto sai dela: toque, mouse e o acetinado (aprovado 23/11 10:23). Esboço: window.__lfcor */
  ':root{--lfc:'+(window.__lfcor||'#7f5773')+'}:root[data-ev]{--lfc:var(--ac)}'+
  ':root{--lfc2:color-mix(in srgb,var(--lfc) 86%,#000);--lfc3:color-mix(in srgb,var(--lfc) 92%,#fff);'+
  '--lfcetim:radial-gradient(130% 220% at 50% 35%,color-mix(in srgb,var(--lfc) 88%,#fff) 0%,var(--lfc) 52%,color-mix(in srgb,var(--lfc) 91%,#000) 100%);'+
  '--lfcetim2:radial-gradient(130% 220% at 50% 35%,color-mix(in srgb,var(--lfc2) 88%,#fff) 0%,var(--lfc2) 52%,color-mix(in srgb,var(--lfc2) 91%,#000) 100%)}'+
  /* principal */
  sel(PRIN)+'{'+FORMA+LET+'background:var(--lfcetim)!important;color:#fff!important;border:0!important;height:48px!important;min-height:48px!important;padding:0 24px!important}'+
  sel(PRIN,':active')+'{background:var(--lfcetim2)!important}'+
  '@media (hover:hover){'+sel(PRIN,':hover')+'{background:var(--lfc3)!important}}'+
  /* ícones: só WhatsApp e câmera, finos, antes da palavra */
  sel(PRIN.filter(function(x){return COM_ICONE.indexOf(x)<0}),' svg')+','+H+'.bb.p em,'+H+'.bb.p small,'+H+'.bb.p .shn,'+H+'.btn.w svg{display:none!important}'+
  sel(COM_ICONE,' svg')+'{display:inline-block!important;width:16px!important;height:16px!important;order:-1!important;flex:none!important}'+
  sel(COM_ICONE,' svg *')+'{stroke-width:1.4!important}'+
  /* foco: no toque sem anel (o site foca o Finalizar sozinho); no teclado do PC, anel fino na cor */
  '@media (hover:none){'+sel(PRIN.concat(SEC),':focus')+','+sel(PRIN.concat(SEC),':focus-visible')+'{outline:none!important}}'+
  '@media (hover:hover){'+sel(PRIN.concat(SEC),':focus-visible')+'{outline:1px solid var(--lfc)!important;outline-offset:3px!important}}'+
  /* Mapa: as duas saídas em caixa alta não cabem lado a lado → uma embaixo da outra, largura toda (L4: nunca quebra nem sai) */
  H+'.minf .mbt{display:flex!important;flex-direction:column!important;gap:8px!important}'+H+'.minf .mbt a{width:100%!important}'+
  /* quantidade ao lado do Comprar: mesma altura e linha, fio fino */
  H+'.buyrow{align-items:center!important}'+H+'.buyrow .mq{height:48px!important;border:1px solid #d9cfd5!important;background:none!important}'+H+'.buyrow .mq b{font-weight:500!important;font-size:16px!important}'+
  /* secundário */
  sel(SEC)+'{'+FORMA+LET+'background:transparent!important;color:var(--lfc)!important;border:0!important;box-shadow:inset 0 0 0 1px var(--lfc)!important;height:48px!important;min-height:48px!important;padding:0 24px!important}'+
  /* compacto */
  sel(COMP_CHEIO.concat(COMP_FIO))+'{'+FORMA+LET+'font-size:11px!important;letter-spacing:.16em!important;height:32px!important;min-height:32px!important;padding:0 14px!important;border:0!important}'+
  sel(COMP_CHEIO)+'{background:var(--lfcetim)!important;color:#fff!important}'+
  /* cartão estreito do Comparar: espaço da letra menor para caber sem encostar (L4) */
  H+'.cmpc .btn.p{letter-spacing:.08em!important;padding:0 10px!important}'+
  sel(COMP_FIO)+'{background:transparent!important;color:var(--lfc)!important;box-shadow:inset 0 0 0 1px var(--lfc)!important}'+
  /* aviso de confirmação: como aprovado na v3 (vermelho cheio em cima, "Voltar" link embaixo) */
  H+'.dlga{flex-direction:column!important;align-items:stretch!important;gap:8px!important;height:auto!important}'+
  H+'.dlga .dk{order:1!important;width:100%!important;height:48px!important;border-radius:999px!important;box-shadow:none!important;background:#b3261e!important;color:#fff!important;font:500 15px/1 var(--body)!important;display:flex!important;align-items:center!important;justify-content:center!important}'+
  H+'.dlga .dc{order:2!important;margin:0 auto!important;display:flex!important;background:none!important;border:0!important;box-shadow:none!important;color:#141414!important;font:500 15px/1 var(--body)!important;min-height:44px!important;align-items:center!important}'+
  /* links */
  sel(LINK)+'{background:none!important;background-image:none!important;border:0!important;box-shadow:none!important;color:var(--lfc)!important;text-decoration:none!important}'+
  sel(LINK,' *')+'{color:var(--lfc)!important}'+
  H+'p a[href*="termos"],'+H+'p a[href*="privacidade"]{color:var(--lfc)!important;text-decoration:underline!important;text-decoration-thickness:1px!important;text-underline-offset:3px!important}';
 var s=document.createElement('style');s.id='pinta12';s.textContent=css;(document.head||document.documentElement).appendChild(s);
})();
