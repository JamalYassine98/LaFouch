/* PINTURA (só no esboço) · IDEIAS 09 v3 parte 2: a família de botões aplicada no site inteiro.
   Uma regra num lugar só: 4 papéis × 3 tamanhos. Padrão de luxo: pílula La Fouch, sem sombra, sem degradê,
   sem ícone dentro (ícone só na Marca: Google), letra do corpo 15 px 500 com leve espaçamento, mesma altura.
   - VINHO (var(--ac), vira a cor do evento): só o caminho do dinheiro: Comprar · Prosseguir · Finalizar.
   - PRETO cheio: a ação da tela (Começar, Iniciar sessão, Salvar, Solicitar orçamento, Abrir a câmera, Comparar…).
   - SECUNDÁRIO: contorno preto 1 px (Ver modelo, Abrir no Google Maps, Sair da conta, Sincronizar).
   - LINK: texto preto com › (sublinhado só dentro de frase).
   - PERIGO: vermelho (cheio no aviso, texto na conta). "Voltar" embaixo vira link. */
(function(){
 var VAR=window.__b9v||'v3';  /* 09e: a = vinho liso · b = degradê só no dinheiro · c = degradê em todo principal */
 var DEG='linear-gradient(120deg,color-mix(in srgb,var(--ac) 72%,#000),var(--ac) 60%,color-mix(in srgb,var(--ac) 82%,#fff))';
 var H='html body:not(#_a):not(#_b) ';  /* vence as pinturas anteriores (que usam #layer) sem depender da ordem */
 var VINHO=['.bb.p','.cartp .btn.cs-b','.btn.w[data-cadfin]'];  /* seletores mais fortes que os do PRETO (.btn.w) */
 var PRETO=['.btn.w','.acc .cs-b','.gzgo','.rzg','.btn.p','a.p.lx44','#lojista'];
 var SEC=['.p1','a.s.lx44','.gsb'];  /* Sair da conta e Excluir minha conta: não mexer (dono 23/11 07:46) */
 var LINK=['[data-pgc2]','.p2','.cs-c','.lfgf','a.mp:not(.lfft a)','.cfx','.dc','.soall','.gzbk','.ajbk','.pgback'];
 var GRANDE=['.bb.p','.cs-b','[data-cadfin]','.btn.w','#lojista','.dk.dr'];
 var COMPACTO=['[data-cmpopen]','.gsb','.cmpc .btn.p'];  /* Ver este modelo mora no cartão do Comparar = Compacto */  /* Copiar (PIX) virou link: o número nunca quebra */
 function sel(L,x){return L.map(function(s){return H+s+(x||'')}).join(',')}
 var BASE='border-radius:999px!important;box-shadow:none!important;background-image:none!important;font:500 15px/1 var(--body)!important;letter-spacing:.02em!important;text-transform:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;white-space:nowrap!important;transition:background-color .2s,color .2s,opacity .2s!important;';
 var css=
  /* forma e letra iguais para todos os botões da família */
  sel(VINHO.concat(PRETO,SEC,['.dk.dr']))+'{'+BASE+'height:48px!important;min-height:48px!important;padding:0 24px!important}'+
  /* sem ícone dentro (só a Marca tem) */
  (VAR==='v3'?sel(VINHO.concat(PRETO,SEC,['.dk.dr']),' svg')+','+sel(VINHO.concat(PRETO,SEC,['.dk.dr']),' img')+','+sel(VINHO.concat(PRETO,SEC,['.dk.dr']),' i')+'{display:none!important}':
   /* identidade: os ícones voltam (carrinho, câmera, WhatsApp), na cor do texto */
   sel(VINHO.concat(PRETO,SEC),' svg')+'{display:inline-block!important;width:18px!important;height:18px!important;flex:none!important}')+
  /* Comprar: sai o brilho e o carrinho de dentro; o valor fica na mesma letra */
  (VAR==='v3'?H+'.bb.p em,':'')+H+'.bb.p .shn{display:none!important}'+H+'.bb.p small{font:inherit!important;opacity:.85!important}'+
  /* papéis */
  sel(PRETO)+'{background:'+(VAR==='a'?'var(--ac)':VAR==='c'?DEG:'#141414')+'!important;color:#fff!important;border:0!important}'+
  sel(VINHO)+'{background:'+(VAR==='b'||VAR==='c'?DEG:'var(--ac)')+'!important;color:#fff!important;border:0!important}'+
  sel(SEC)+'{background:transparent!important;color:#141414!important;border:1px solid #141414!important}'+
  H+'.dk.dr{background:#b3261e!important;color:#fff!important;border:0!important}'+
  /* toque: escurece de leve, igual em todos */
  sel(VINHO.concat(PRETO,['.dk.dr']),':active')+'{filter:brightness(.92)!important}'+
  sel(SEC,':active')+'{background:rgba(20,20,20,.06)!important}'+
  /* tamanhos: Grande = largura toda; Compacto = 32 (área de toque por fora) */
  sel(GRANDE)+'{width:100%!important;max-width:none!important}'+
  sel(COMPACTO)+'{height:32px!important;min-height:32px!important;padding:0 12px!important;font-size:14px!important;width:auto!important}'+
  /* Mapa: os dois Médios lado a lado no cartão; se não cabem, a letra do par diminui (L4), não quebra */
  H+'a.p.lx44,'+H+'a.s.lx44{padding:0 16px!important;font-size:14px!important}'+
  /* foco: no toque não aparece anel (o site foca o Finalizar sozinho); no teclado do PC fica o anel preto */
  '@media (hover:none){'+sel(VINHO.concat(PRETO,SEC,['.dk.dr']),':focus')+','+sel(VINHO.concat(PRETO,SEC,['.dk.dr']),':focus-visible')+'{outline:none!important;box-shadow:none!important}}'+
  '@media (hover:hover){'+sel(VINHO.concat(PRETO,SEC,['.dk.dr']),':focus-visible')+'{outline:2px solid #141414!important;outline-offset:2px!important}}'+
  /* Comparar mora na barra preta: o principal inverte (branco com texto preto), mesma forma */
  H+'[data-cmpopen]{'+BASE+'background:#fff!important;color:#141414!important;border:0!important}'+
  /* links: texto preto, sem fundo, sem borda */
  sel(LINK)+'{background:none!important;background-image:none!important;border:0!important;box-shadow:none!important;color:#141414!important;font:500 15px/1 var(--body)!important;letter-spacing:.02em!important;text-decoration:none!important;padding:0!important;min-height:44px!important;height:auto!important;width:auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:0!important}'+
  /* confirmação: o vermelho em cima, "Voltar" embaixo (regra 15) */
  H+'.dlga{flex-direction:column!important;align-items:stretch!important;gap:8px!important;height:auto!important}'+H+'.dlga .dk{order:1!important;width:100%!important}'+H+'.dlga .dc{order:2!important;margin:0 auto!important;display:flex!important}'+
  H+'.cs-c{margin:8px auto 0!important;display:flex!important}'+
  /* link dentro de frase: sublinhado fino, preto */
  H+'a[href*="termos"]:not(.lfft a),'+H+'a[href*="privacidade"]:not(.lfft a){color:#141414!important;text-decoration:underline!important;text-underline-offset:3px!important;text-decoration-thickness:1px!important;font-weight:400!important}'+
  /* rodapé (aprovado no 08): fica como está, só o link sai do vinho */
  H+'.lfft a.mp{color:#141414!important}'+
  /* voltar do topo da tela: preto */
  H+'.navb,'+H+'.vback,'+H+'.pgback *,'+H+'[data-pzvolta],'+H+'[data-pzvolta] *,'+H+'.gzbk *{color:#141414!important;background:none!important}'+
  /* Cédula/RUC: não mexer (não foi pedido) */
  /* seta › de linha: cinza (aprovado no 61) */
  H+'.rzr{color:var(--mu)!important}'+
  '';
 /* 09f · "Pílula La Fouch" (estudo de luxo: Cartier, Chanel, Dior, Van Cleef, Rare Beauty): a marca fala pela LETRA, não por enfeite.
    Rótulo em caixa alta pequena com espaço largo (o mesmo das etiquetas "DESTAQUE DA SEMANA" do site), peso 500, 52 px.
    A cor da marca fica reservada ao que leva ao dinheiro (como o vermelho da Cartier): Comprar · Prosseguir · Finalizar ·
    Abrir a câmera · Solicitar orçamento, em degradê vinho sutil. O resto: preto. Secundário: fio de 1 px. Ícones ficam. */
 if(VAR==='f'){
  var DIN=VINHO.concat(['.rzg','.btn.p.ic','#lojista']);
  var TODOS=DIN.concat(PRETO,SEC);
  var ROT='text-transform:uppercase!important;font:500 13px/1 var(--body)!important;letter-spacing:.14em!important;';
  css+=sel(TODOS)+'{'+ROT+'}'+
   sel(VINHO.concat(PRETO,SEC).filter(function(x){return COMPACTO.indexOf(x)<0}))+'{height:52px!important;min-height:52px!important}'+
   sel(COMPACTO)+'{font-size:11px!important;letter-spacing:.12em!important}'+
   sel(DIN)+'{background:'+DEG+'!important;color:#fff!important;border:0!important}'+
   sel(DIN,' svg')+'{width:16px!important;height:16px!important}'+
   H+'.bb.p small{font:inherit!important;letter-spacing:inherit!important;opacity:.85!important}'+
   sel(TODOS)+'{transition:filter .3s,background-color .3s!important}';
 }
 var s=document.createElement('style');s.id='pinta11';s.textContent=css;
 (document.head||document.documentElement).appendChild(s);
})();
