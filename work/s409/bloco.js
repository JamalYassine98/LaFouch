
  /* ============ S409 (17/11/2026, "implementar tudo" do dono) — cupons e cartões no site inteiro ============
     Esboços aprovados: 65b/66b/65c/71d/71e/77b/77c/78 (aba Exclusivo) · 66a (prateleira) · 65e/66e/71a–71c/74a–74c/75a–75c/76a/77a/77d (carrinho)
     · 66g/68g/69a/70a/70d/70e (Minha conta) · 70b (menu) · 70c (reserva VIP) · 68c (novidades VIP) · 81f/83 (selinho "Cupom disponível")
     · 73f (logo branco no cartão da loja) · sai o "Tem um código?", o "Leve 2" e o cupom de boas-vindas.
     REGRA DO DONO: o servidor confere tudo (functions/presente.js); aqui o site só mostra e monta o pedido. */
  (function(){
    var OURO='#8a6a33';
    /* ---------- cartões do cliente (os mesmos de Minha conta › Cartões) ---------- */
    st.cards=lsG('lf_cards',null);if(st.cards&&!logado())st.cards=null;
    st.pres=lsG('lf_pres',null);
    function cardsCarrega(forca){if(!logado()){st.cards=null;lsS('lf_cards',null);return Promise.resolve(null)}
      if(!forca&&st.cards&&Date.now()-(st.cards.ts||0)<10*60000)return Promise.resolve(st.cards);
      return cupFn({acao:'meus'}).then(function(j){if(!j||!j.ok)return null;
        st.cards={ts:Date.now(),L:(j.cupons||[]).filter(function(c){return c.estado==='ok'&&!c.usado&&c.tipo!=='am'&&c.tipo!=='bv'}),vip:+j.vip||0,escada:j.escada||null,nome:j.nome||''};
        lsS('lf_cards',st.cards);try{excPinta()}catch(_){}return st.cards},function(){return null})}
    window.__lfCards=cardsCarrega;
    function ehVip(){return !!(st.cards&&st.cards.vip)}
    function meusCards(){var L=((st.cards&&st.cards.L)||[]).slice();if(st.cup&&st.cup.tipo==='ev'&&!L.some(function(x){return x.cod===st.cup.cod}))L.unshift(st.cup);return L}
    /* o cartão vale nesta peça? (OFERTA nunca; o % não pode furar o piso: cmx) */
    function cVale(c,p){if(!c||!p||p.aviso==='Esgotado'||isOf(p)||c.tipo==='pe')return false;return (+p.cmx||0)>=(+c.pct||0)}
    function cardPara(p){return meusCards().filter(function(c){return cVale(c,p)})[0]||null}
    /* cartão da aba Exclusivo: o escolhido em Minha conta › Cartões; no evento, o cupom da temática; fora, o que vence primeiro */
    function excCard(){var L=meusCards();if(!L.length)return null;if(st.excCod){var x=L.filter(function(c){return c.cod===st.excCod})[0];if(x)return x}
      var ev=L.filter(function(c){return c.tipo==='ev'})[0];if(ev)return ev;return L.slice().sort(function(a,b){return (a.fim||9e15)-(b.fim||9e15)})[0]}
    function descDe(c,p){return cVale(c,p)?Math.floor(p.n*c.pct/100/1000)*1000:0}
    /* sai o "Leve 2" (ordem do dono, 17/11): nenhum desconto da 2ª peça */
    l2Info=function(){return {n:0,d:0,dD:0,por:{}}};
    /* "Cupom disponível" (81f/83): só para quem tem um cartão que vale nesta peça */
    aceitaCup=function(p){return !!cardPara(p)};

    /* ---------- presente especial: a peça de presente fica fora do carrinho pago (st.pres) ---------- */
    function presAtivo(){return !!(st.pres&&st.cup&&st.cup.tipo==='pe'&&find(st.pres.ref))}
    function presN(){var p=st.pres&&find(st.pres.ref);return p?p.n:0}
    function pagas(){return Object.keys(st.cart).filter(function(k){var p=find(k);return p&&!isOf(p)&&p.aviso!=='Esgotado'})}
    function presLista(){var c=getConta()||{};return cupFn({acao:'presentes',pagas:pagas(),tel:c.tel||''}).then(function(j){var R={};((j&&j.refs)||[]).forEach(function(r){R[r]=1});st._presRefs=R;st._presOk=!!(j&&j.ok);st._presLim=j&&j.lim||0;return j},function(){st._presRefs={};return null})}
    function presTira(motivo){if(!st.pres)return;var r=st.pres.ref;st.pres=null;lsS('lf_pres',null);st._presSaiu=motivo?{ref:r,m:motivo}:null}
    /* confere o presente quando o carrinho muda (o servidor confere de novo no pedido) */
    function presConfere(){if(!st.pres)return Promise.resolve();if(!st.cup||st.cup.tipo!=='pe'){presTira();return Promise.resolve()}
      if(!pagas().length){presTira('paga');return Promise.resolve()}
      return presLista().then(function(){if(st.pres&&st._presRefs&&!st._presRefs[st.pres.ref]){presTira('valor');try{bag(true)}catch(_){}}})}

    /* ---------- desenho do cartão (o mesmo do e-mail e de Minha conta) ---------- */
    var EVP={natal:['#1f5c3a','linear-gradient(135deg,#2a7049 0%,#1f5c3a 55%,#143d27 100%)','rgba(255,217,160,.6)','#ffd9a0','#fff','#d3e3d8','cartao-ev-natal.png','Natal'],
      maes:['#a83a64','linear-gradient(135deg,#c2507b 0%,#a83a64 55%,#8a2c50 100%)','rgba(255,209,223,.7)','#ffd1df','#fff','#ffe9f0','cartao-ev-maes.png','Dia das Mães'],
      pais:['#1e2f4d','linear-gradient(135deg,#2b4169 0%,#1e2f4d 55%,#131f35 100%)','rgba(224,184,120,.65)','#e0b878','#fff','#c6cfdd','cartao-ev-pais.png','Dia dos Pais'],
      anonovo:['#f6f2ea','linear-gradient(135deg,#fffdf8 0%,#f3ecdf 60%,#e9dcc3 100%)','rgba(168,133,74,.85)','#8d703e','#1f1d1a','#66625a','cartao-ev-anonovo.png','Ano-Novo'],
      bf:['#111','linear-gradient(135deg,#242424 0%,#111111 60%,#000000 100%)','rgba(225,29,72,.95)','#fff','#fff','#c9c9c9','cartao-ev-bf.png','Black Friday'],
      halloween:['#2a1530','linear-gradient(135deg,#5a2f72 0%,#2a1530 55%,#160c1a 100%)','rgba(226,113,29,.75)','#f08a3c','#f3e9f5','#cdbcd3','cartao-ev-halloween.png','Halloween']};
    var TMP={vinho:['#3a1830','linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%)','rgba(214,178,116,.6)','#e9d3a6','#fff','#d9c3d0','cartao-branco.png'],
      preto:['#17121a','linear-gradient(135deg,#2b2330 0%,#17121a 55%,#0c090e 100%)','rgba(214,178,116,.75)','#e9d3a6','#fff','#c9bfc6','cartao-ouro.png']};
    function evSite(){var e=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'');return EVP[e]?e:''}
    function paleta(c){var ev=evSite();
      if(c.tipo==='ev'||(c.tipo==='pe'&&ev))return EVP[c.tema&&EVP[c.tema]?c.tema:ev]||TMP.vinho; /* cupom do evento e presente especial vestem a temática (62/71e) */
      if(c.tipo==='vip'||c.tipo==='pe'||c.tipo==='ani')return TMP.preto;return TMP.vinho}
    function cardHtml(c,nome,cls){var T=paleta(c),pe=c.tipo==='pe',ev=c.tipo==='ev',vip=c.tipo==='vip',ani=c.tipo==='ani',evn=T[7]||'';
      var rot=ev?LFI.tr('CUPOM DO EVENTO'):pe?(evn&&c.tipo==='pe'&&evSite()?LFI.tr(evn).toUpperCase():LFI.tr('PRESENTE ESPECIAL')):vip?LFI.tr('CARTÃO VIP'):ani?LFI.tr('FELIZ ANIVERSÁRIO'):c.tipo==='fiel'?LFI.tr('CLIENTE FIEL'):LFI.tr('CARTÃO PRESENTE');
      var num=pe?LFI.tr('Na compra de um,')+'<br>'+LFI.tr('leve outro de presente'):c.pct+'%';
      var tit=pe?(evn&&evSite()?LFI.tr('presente de')+' '+LFI.tr(evn):LFI.tr('vale para uma compra')):ev?LFI.tr('de desconto')+(evn?' · '+LFI.tr(evn):''):ani?LFI.tr('presente de aniversário'):vip&&c.max>1?LFI.tr('em')+' '+c.max+' '+LFI.tr('compras'):vip?LFI.tr('na sua próxima compra'):LFI.tr('na próxima compra');
      var fundo=ani?'background:'+T[0]+';background:radial-gradient(circle at 30% 40%,rgba(214,178,116,.26) 0 1.1px,transparent 1.7px) 0 0/34px 34px,'+T[1]:'background:'+T[0]+';background-image:'+T[1];
      return '<div class="lxc'+(cls?' '+cls:'')+'" style="border-radius:16px;'+fundo+';padding:6px"><div style="border:1px solid '+T[2]+';border-radius:11px;padding:15px 16px 13px">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><img src="/media/email/'+T[6]+'" width="82" height="13" alt="La Fouch"><span style="font:500 12.5px Inter,Arial;letter-spacing:.14em;color:'+T[5]+';text-align:right">'+esc(rot)+'</span></div>'+
        '<div style="font:500 '+(pe?'24px/1.2':'42px/1')+' Fraunces,Georgia,serif;color:'+T[3]+';margin:'+(pe?'16px 0 4px':'18px 0 2px')+'">'+num+'</div><div style="font:italic 16px/1.3 Fraunces,Georgia,serif;color:'+T[4]+'">'+tit+'</div>'+
        '<div style="height:1px;background:'+T[2]+';opacity:.6;margin:14px 0 9px"></div><div style="display:flex;justify-content:space-between;font:500 12.5px Inter,Arial;letter-spacing:.04em;white-space:nowrap;color:'+T[5]+'"><span style="overflow:hidden;text-overflow:ellipsis;margin-right:10px">'+esc(ev?LFI.tr('PARA TODOS'):String(c.nome||nome||'').toUpperCase())+'</span><span>'+(c.fim?LFI.tr('ATÉ')+' '+cupData(c.fim):'')+'</span></div></div></div>'}
    window.__lfCardHtml=cardHtml;

    /* ---------- aba Exclusivo (st.tipo='exc') ---------- */
    var _lista=lista;lista=function(){var r;
      if(st.tipo!=='exc'){r=_lista();return vipFiltra(r)}
      var c=excCard(),sv=st.tipo;st.tipo='todos';r=_lista();st.tipo=sv;r=vipFiltra(r);if(!c)return [];
      if(c.tipo==='pe'){var R=st._presRefs||{};return r.filter(function(p){return R[p.ref]})}
      return r.filter(function(p){return cVale(c,p)})};
    /* novidades 48 h antes (68c): peça com vipAte no futuro só aparece para o Cliente VIP */
    function vipSo(p){return +p.vipAte>Date.now()}
    function vipFiltra(r){return ehVip()?r:r.filter(function(p){return !vipSo(p)})}
    var _cat5=cat5;cat5=function(){return vipFiltra(_cat5())};
    function excSai(){var v=$('vitrine');if(!v)return;[].forEach.call(v.querySelectorAll('.exh,.exo2,.vsec'),function(x){x.remove()});v.classList.remove('excm')}
    function excPinta(){var v=$('vitrine'),g=$('grid');if(!v||!g)return;if(st.tipo!=='exc'){if(v.classList.contains('excm'))excSai();return}
      var c=excCard();if(!c){st.tipo='todos';excSai();return}
      v.classList.add('excm');[].forEach.call(v.querySelectorAll('.exh,.exo2,.vsec'),function(x){if(x.parentNode!==g.parentNode)x.remove()});
      var h=g.parentNode.querySelector('.exh');if(!h){h=document.createElement('div');h.className='exh';g.parentNode.insertBefore(h,g)}
      var nm=(st.cards&&st.cards.nome)||(getConta()||{}).nome||'',hh=cardHtml(c,nm);if(h._h!==hh){h._h=hh;h.innerHTML=hh}
      var o=g.parentNode.querySelector('.exo2');if(!o){o=document.createElement('p');o.className='exo2';g.parentNode.insertBefore(o,g)}
      var tx;if(c.tipo==='pe'){var lim=st._presLim?LFI.fmtD(LFI.pv(st._presLim)):'';tx=!pagas().length?LFI.tr('Coloque no carrinho o óculos que você vai comprar; depois escolha aqui o seu presente.'):LFI.tr('Escolha 1 presente')+(lim?' <b>'+LFI.tr('até')+' '+lim+'</b>':'')+', '+LFI.tr(ehVip()?'com a vantagem de Cliente VIP.':'o valor do óculos no seu carrinho.')+' '+LFI.tr('Peças em OFERTA também podem ser presente.')}
      else tx=LFI.tr('Os preços abaixo já estão com o desconto.');if(o.innerHTML!==tx)o.innerHTML=tx;
      /* VIP (77c): "Só para VIP" no topo, com as novidades antes de todos */
      var vs=g.parentNode.querySelector('.vsec'),VL=ehVip()?P.filter(function(p){return vipSo(p)&&p.aviso!=='Esgotado'}).slice(0,4):[];
      if(VL.length){if(!vs){vs=document.createElement('div');vs.className='vsec';g.parentNode.insertBefore(vs,o)}var vh='<h4><i>✦</i>'+LFI.tr('Só para VIP')+'</h4><p>'+LFI.tr('Chegaram agora; para todos, em 2 dias.')+'</p><div class="hg vg">'+VL.map(function(p){return card5(p,0,'vip')}).join('')+'</div>'+(c.tipo==='pe'?'<div class="gh">'+LFI.tr('Seu presente')+'</div>':'');if(vs._h!==vh){vs._h=vh;vs.innerHTML=vh}}else if(vs)vs.remove();
      [].forEach.call(g.querySelectorAll('.card'),function(k){var bt=k.querySelector('[data-open]'),ref=bt&&bt.getAttribute('data-open'),p=ref&&find(ref);if(!p)return;
        k.querySelectorAll('.sel1,.edb,.evse').forEach(function(x){x.style.display='none'});var pr=k.querySelector('.pr');
        if(c.tipo==='pe'){if(pr)pr.style.display='none';if(!k.querySelector('.gpt')){var s=document.createElement('span');s.className='gpt';s.textContent='✦ '+LFI.tr('De presente');k.appendChild(s);gptAlinha(k,s)}}
        else if(pr&&!pr.querySelector('s')){var d=descDe(c,p);if(d>0)pr.innerHTML='<s>'+LFI.fmtD(LFI.pv(p.n))+'</s>'+LFI.fmtD(LFI.pv(p.n-d))}})}
    /* selo do presente alinhado com o coração (78a–78g): mesma altura e mesma distância da borda */
    function gptAlinha(k,s){var f=k.querySelector('.fav');if(!f)return;var kr=k.getBoundingClientRect(),fr=f.getBoundingClientRect(),sr=s.getBoundingClientRect();if(!kr.width)return;var bw=parseFloat(getComputedStyle(k).borderLeftWidth)||0;
      s.style.top=(fr.top-kr.top-bw+fr.height/2-sr.height/2)+'px';s.style.left=(kr.right-fr.right-bw+8)+'px'}
    var _dg=drawGrid;drawGrid=function(){_dg.apply(this,arguments);try{excPinta()}catch(e){console.error('exc',e)}};
    function excAbre(cod){if(cod)st.excCod=cod;var c=excCard();if(!c)return;st.tipo='exc';st.gen='';st.col='';st.rosto='';try{addDlgClose()}catch(_){}closeLayer();
      var go=function(){try{drawGen();drawChips();drawFaces()}catch(_){}drawGrid();try{goTo('vitrine')}catch(_){var v=$('vitrine');if(v)v.scrollIntoView()}
        setTimeout(function(){drawGrid();var h=document.querySelector('#vitrine .exh'),sc=$('vscr');if(h){var hb=(document.querySelector('.top')||{getBoundingClientRect:function(){return {bottom:0}}}).getBoundingClientRect().bottom,fl=hb+18-h.getBoundingClientRect().top;if(fl>0){if(sc)sc.scrollTop-=fl;window.scrollBy(0,-fl)}}},450)};
      if(c.tipo==='pe')presLista().then(function(){setTimeout(go,30)});else setTimeout(go,60)}
    window.__lfExc=excAbre;
    /* peça vinda da Exclusivo: o cartão entra sozinho (66e); no modo presente, o toque escolhe o presente */
    document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#grid [data-open]');if(!b||st.tipo!=='exc')return;var c=excCard(),ref=b.getAttribute('data-open');
      if(c&&c.tipo==='pe'){e.preventDefault();e.stopPropagation();if(!pagas().length){toast(LFI.tr('Primeiro coloque no carrinho o óculos que você vai comprar.'));return}
        if(!st._presRefs||!st._presRefs[ref])return;cupGuarda(c);st.pres={ref:ref,cor:0};lsS('lf_pres',st.pres);toast(LFI.tr('Presente escolhido')+' ✓');setTimeout(function(){bag()},150);return}
      st._excRef=ref},true);
    function viaExc(ref){if(!st.cup){var c=excCard(),p=find(ref);if(c&&c.tipo!=='pe'&&cVale(c,p)&&st.cart[ref]){cupGuarda(c);st.cup.auto=1;lsS('lf_cup',st.cup);try{drawBag()}catch(_){}}}}
    var _add=add;add=function(ref){var v=st.tipo==='exc'||st._excRef===ref;_add.apply(this,arguments);if(v)viaExc(ref);if(st.pres)presConfere()};
    /* o botão "Comprar" da peça (data-addm) põe no carrinho por outro caminho: confere logo depois */
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-addm]');if(!t)return;var ref=t.getAttribute('data-addm'),v=st.tipo==='exc'||st._excRef===ref;setTimeout(function(){if(v)viaExc(ref);if(st.pres)presConfere()},60)},true);
    /* prateleira "Exclusivo" no Início (66a): a 1ª, igual às outras, a palavra em dourado, preços já com o desconto */
    var _hd=homeDraw;homeDraw=function(){_hd.apply(this,arguments);try{excPrat()}catch(e){console.error('excPrat',e)}};
    function excPrat(){var H=$('home');if(!H)return;var o=H.querySelector('.exs');if(o){o.nextElementSibling&&o.nextElementSibling.classList.contains('hg')&&o.nextElementSibling.remove();o.remove()}
      var c=excCard();if(!c||c.tipo==='pe')return;var L=cat5().filter(function(p){return cVale(c,p)}).slice(0,8);if(!L.length)return;
      var h1=H.querySelector('.hsh.hsh1');if(!h1)return;var s=document.createElement('div');s.className='hsh hsh1 exs';s.innerHTML='<h2 class="h2" style="color:'+OURO+'">'+LFI.tr('Exclusivo')+'</h2><a href="#vitrine" data-exc>'+LFI.tr('Ver todos')+' ›</a>';
      var g=document.createElement('div');g.className='hg';g.setAttribute('data-hsec','exc');g.innerHTML=L.map(function(p){return card5(p,0,'exc')}).join('');
      [].forEach.call(g.querySelectorAll('.hc'),function(b,i){var p=L[i],hp=b.querySelector('.hp'),d=descDe(c,p);if(hp&&d>0)hp.innerHTML='<s>'+LFI.fmtD(LFI.pv(p.n))+'</s>'+LFI.fmtD(LFI.pv(p.n-d))});
      h1.parentNode.insertBefore(s,h1);h1.parentNode.insertBefore(g,h1)}
    /* novidades do VIP marcadas "Só para VIP" no Início (68c) */
    function vipMarca(){if(!ehVip())return;[].forEach.call(document.querySelectorAll('#home .hc[data-open]'),function(b){var p=find(b.getAttribute('data-open'));if(p&&vipSo(p)&&!b.querySelector('.vip1')){var s=document.createElement('span');s.className='vip1';s.textContent='✦ '+LFI.tr('Só para VIP');b.appendChild(s)}})}
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-exc]');if(!a)return;e.preventDefault();e.stopPropagation();excAbre()},true);
    /* sair da Exclusivo: qualquer filtro do catálogo (menu, chips) volta ao catálogo comum */
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-mf]');if(t&&st.tipo==='exc')setTimeout(excPinta,0)},false);

    /* ---------- carrinho (65e, 66e, 71a–71c, 74a, 76a, 77a, 77d) ---------- */
    function linha(ic,txt,dir,cls){return '<div class="exc'+(cls?' '+cls:'')+'"><span><i>'+ic+'</i>'+txt+'</span>'+(dir?'<span class="exd">'+dir+'</span>':'')+'</div>'}
    cupHtml=function(dd){var L=meusCards(),tb=dd?'':'<button type="button" class="tr" data-cartroca>'+LFI.tr('Trocar')+'</button>',h='';
      if(presAtivo())return linha('✦',LFI.tr('Presente especial aplicado'),tb);
      if(st.cup&&st.cup.tipo==='pe'){var so=!pagas().length&&Object.keys(st.cart).length;
        h=linha('✦',LFI.tr('Você tem um presente especial'),so||dd?'':'<button type="button" class="tr" data-presesc>'+LFI.tr('Escolher')+'</button>',so?'apag':'');
        if(so&&!dd)h+='<p class="exn">'+LFI.tr('O presente vale na compra de uma peça fora da OFERTA. Ele continua guardado.')+'</p>';
        if(st._presSaiu&&!dd){var pp=find(st._presSaiu.ref);h+='<p class="exn">'+LFI.tr('A peça de presente')+' '+esc(pp?pp.ref:'')+' '+LFI.tr('saiu do carrinho')+(st._presSaiu.m==='valor'?': '+LFI.tr('o presente vale até o valor do óculos que você compra.'):'.')+' <a href="#" data-presesc>'+LFI.tr('Escolher outro presente')+' ›</a></p>'}
        return h}
      if(st.cup){var ci=cupInfo(),n=cupConta(),nm=st.cup.tipo==='ev'?LFI.tr('Cupom do evento')+' · '+st.cup.pct+'%':LFI.tr('Cartão de')+' '+st.cup.pct+'%';
        if(ci.d>0){h=linha('✦',nm+' '+LFI.tr('aplicado')+(n.a<n.n?' · '+n.a+' '+LFI.tr(n.a===1?'peça':'peças'):''),'<b class="exv">−'+LFI.fmtD(ci.dD)+'</b>'+tb);
          if(st.cup.auto&&!dd)h+='<p class="exn">'+LFI.tr('O seu cartão entrou sozinho porque a peça veio da Exclusivo.')+' <a href="#" data-cupguarda>'+LFI.tr('Guardar para outra compra')+' ›</a></p>';return h}
        return linha('✦',nm,tb)+(dd?'':'<p class="exn">'+LFI.tr('Nenhuma peça deste carrinho aceita o cartão (OFERTA ou limite da peça). Ele continua guardado.')+'</p>')}
      if(L.length&&!dd){var Lv=L.filter(function(x){return x.tipo==='pe'||valorNesta(x)>0}).sort(function(a,b){return valorNesta(b)-valorNesta(a)}),c=Lv.filter(function(x){return x.tipo!=='pe'})[0]||Lv[0];if(!c)return '';return c.tipo==='pe'?linha('✦',LFI.tr('Você tem um presente especial'),pagas().length?'<button type="button" class="tr" data-presesc>'+LFI.tr('Escolher')+'</button>':'',pagas().length?'':'apag')+(pagas().length||!Object.keys(st.cart).length?'':'<p class="exn">'+LFI.tr('O presente vale na compra de uma peça fora da OFERTA. Ele continua guardado.')+'</p>')
        :linha('✦',LFI.tr('Você tem um cartão de')+' '+c.pct+'%','<button type="button" class="tr" data-cupusar2="'+esc(c.cod)+'">'+LFI.tr('Usar')+'</button>')}
      return ''};
    /* peça de presente dentro do carrinho (76a): como as outras; no lugar do preço "✦ De presente"; subtotal riscado e "Grátis" */
    function presRow(){var p=find(st.pres.ref);if(!p)return '';return '<div class="ci cipres"><div class="cimg">'+vis(p,7)+'</div><div class="cit"><small>'+p.ref+'</small><b>'+esc(p.nome)+'</b><div class="pu"><span class="gfk2">✦ '+LFI.tr('De presente')+'</span></div></div><div class="cif"><div class="cia"><button type="button" class="crl" data-presx>'+LFI.tr('Remover')+'</button></div><div class="cis"><small>'+LFI.tr('Subtotal')+'</small><div class="pr"><s>'+LFI.fmtD(LFI.pv(p.n))+'</s><span class="gfr">'+LFI.tr('Grátis')+'</span></div></div></div><button class="crm" data-presx aria-label="'+LFI.tr('Remover')+'"><span class="crx">×</span></button></div>'}
    var _bag9=bag;bag=function(re,pop){_bag9(re,pop);try{var pn=document.querySelector('#layer .cartp');if(!pn)return;
        if(presAtivo()&&!pn.querySelector('.cipres')){var it=pn.querySelectorAll('.ci:not(.fvi)'),u=it[it.length-1];if(u)u.insertAdjacentHTML('afterend',presRow());var cn=pn.querySelector('.cn');if(cn){var nq=qtd()+1;cn.textContent='· '+nq+' '+LFI.tr(nq===1?'item':'itens')}}
        [].forEach.call(pn.querySelectorAll('.ci:not(.fvi):not(.cipres)'),function(ci){var r=ci.querySelector('.cit small'),p=r&&find(r.textContent.trim());if(p&&st.cup&&st.cup.tipo!=='pe'&&isOf(p)&&!ci.querySelector('.lfof')){var pu=ci.querySelector('.pu');if(pu)pu.insertAdjacentHTML('afterend','<span class="lfof">'+LFI.tr('Em OFERTA: o cartão não vale nesta peça.')+'</span>')}})}catch(e){console.error('bag409',e)}};
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-cupusar2],[data-cupguarda],[data-presesc],[data-presx],[data-cartroca],[data-shok],[data-shx],[data-shc]');if(!t)return;e.preventDefault();
      if(t.hasAttribute('data-cupusar2')){var c=meusCards().filter(function(x){return x.cod===t.getAttribute('data-cupusar2')})[0];if(c){cupGuarda(c);bag(true)}}
      else if(t.hasAttribute('data-cupguarda')){cupTira();presTira();bag(true);toast(LFI.tr('Cartão guardado para outra compra'))}
      else if(t.hasAttribute('data-presesc')){var pe=meusCards().filter(function(x){return x.tipo==='pe'})[0];if(pe){cupGuarda(pe);st._presSaiu=null;excAbre(pe.cod)}}
      else if(t.hasAttribute('data-presx')){presTira();bag(true)}
      else if(t.hasAttribute('data-cartroca'))shAbre();
      else if(t.hasAttribute('data-shc')){var L2=document.querySelectorAll('.sh label');[].forEach.call(L2,function(x){x.classList.toggle('on',x===t)});shNota()}
      else if(t.hasAttribute('data-shx'))shFecha();
      else if(t.hasAttribute('data-shok')){var on=document.querySelector('.sh label.on'),cod=on&&on.getAttribute('data-cod');shFecha();
        if(!cod){cupTira();presTira();bag(true);return}
        var c2=meusCards().filter(function(x){return x.cod===cod})[0];if(!c2)return;
        if(c2.tipo==='pe'){if(!presAtivo()){cupGuarda(c2);excAbre(c2.cod)}return}
        presTira();cupGuarda(c2);bag(true)}},true);
    /* folha "Cartão desta compra" (74b/75a/75c): um cartão por compra; cada um mostra quanto desconta NESTA compra */
    function valorNesta(c){if(c.tipo==='pe')return -1;var d=0;Object.keys(st.cart).forEach(function(k){d+=descDe(c,find(k))*st.cart[k]});return d}
    function shAbre(){shFecha(true);var L=meusCards().slice(),cur=st.cup&&st.cup.cod;
      L.sort(function(a,b){return valorNesta(b)-valorNesta(a)});var maior=L.filter(function(c){return valorNesta(c)>0})[0],prim=L.filter(function(c){return c.fim}).sort(function(a,b){return a.fim-b.fim})[0];
      var ch=function(c){var T=paleta(c);return '<span class="ch" style="background:'+T[0]+';background-image:'+T[1]+';border-color:'+T[2]+'"></span>'};
      var r=L.map(function(c){var v=valorNesta(c),nm=c.tipo==='pe'?LFI.tr('Presente especial'):c.tipo==='ev'?LFI.tr('Cupom do evento')+' '+c.pct+'%':c.tipo==='vip'?LFI.tr('Cartão VIP')+' '+c.pct+'%':LFI.tr('Cartão presente')+' '+c.pct+'%';
        var sub=c.tipo==='pe'?LFI.tr('leve outro óculos'):(prim&&prim.cod===c.cod&&L.length>1?LFI.tr('vence primeiro, em')+' '+cupData(c.fim).replace(/\/\d{4}$/,''):c.fim?LFI.tr('até')+' '+cupData(c.fim):'');
        var dir=c.tipo==='pe'?(presAtivo()?LFI.tr('Em uso'):LFI.tr('Escolher peça')):v>0?'− '+LFI.fmtD(LFI.pv(v)):LFI.tr('não vale aqui');
        return '<label data-shc data-cod="'+esc(c.cod)+'" class="'+(c.cod===cur?'on':'')+'">'+ch(c)+'<span class="tx"><b>'+esc(nm)+(maior&&maior.cod===c.cod&&L.length>1?'<em>'+LFI.tr('Maior desconto')+'</em>':'')+'</b><small>'+esc(sub)+'</small></span><span class="vl'+(v>0||c.tipo==='pe'?'':' no')+'">'+dir+'</span><span class="rd"></span></label>'}).join('')+
        '<label data-shc data-cod="" class="'+(cur?'':'on')+'"><span class="ch z"></span><span class="tx"><b>'+LFI.tr('Não usar cartão agora')+'</b><small>'+LFI.tr('todos ficam guardados')+'</small></span><span class="vl"></span><span class="rd"></span></label>';
      var b=document.createElement('div');b.className='shb';b.setAttribute('data-shx','');var s=document.createElement('div');s.className='sh';s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');s.setAttribute('aria-label',LFI.tr('Cartão desta compra'));
      s.innerHTML='<div class="gr"></div><h3>'+LFI.tr('Cartão desta compra')+'</h3><p>'+LFI.tr('Vale um cartão por compra. Os outros continuam guardados para a próxima.')+'</p>'+r+'<p class="nt" hidden></p><button type="button" class="ok" data-shok>'+LFI.tr('Usar este cartão')+'</button>';
      document.body.appendChild(b);document.body.appendChild(s);requestAnimationFrame(function(){b.classList.add('on');s.classList.add('on')});shNota()}
    function shNota(){var s=document.querySelector('.sh');if(!s)return;var on=s.querySelector('label.on'),cod=on&&on.getAttribute('data-cod'),c=cod&&meusCards().filter(function(x){return x.cod===cod})[0],nt=s.querySelector('.nt'),ok=s.querySelector('.ok');
      ok.textContent=c&&c.tipo==='pe'&&!presAtivo()?LFI.tr('Escolher a peça de presente'):LFI.tr(cod?'Usar este cartão':'Continuar sem cartão');
      if(presAtivo()&&(!c||c.tipo!=='pe')){var p=find(st.pres.ref);nt.hidden=false;nt.textContent=LFI.tr('Trocando, a peça de presente')+' ('+(p?p.ref:'')+') '+LFI.tr('sai do carrinho. O presente continua guardado.')}else nt.hidden=true}
    function shFecha(ja){[].forEach.call(document.querySelectorAll('.sh,.shb'),function(x){x.remove()})}
    /* o carrinho muda: o presente é conferido de novo (pode sair, 77d) */
    ['data-inc','data-dec','data-rm'].forEach(function(a){document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('['+a+']')&&st.pres)setTimeout(function(){presConfere().then(function(){try{if(document.querySelector('#layer .cartp'))bag(true)}catch(_){}})},60)})});

    /* ---------- Minha conta (70a, 69a) e menu (70b) ---------- */
    function contaNome(){var p=document.querySelector('#layer .scrim[data-accn="Minha conta"] aside h2');if(!p||p.parentNode.parentNode.querySelector('.mcnm'))return;var c=getConta()||{};if(!c.nome)return;
      var d=document.createElement('p');d.className='mcnm';d.innerHTML=esc(c.nome)+(ehVip()?'<span class="mcd">·</span><span class="mcv">✦ '+LFI.tr('Cliente VIP')+'</span>':'');p.parentNode.parentNode.insertBefore(d,p.parentNode.nextSibling)}
    function vipMenu(){var n=$('dacn'),a=$('dav');if(!n||!a)return;var on=ehVip()&&logado();a.classList.toggle('vipav',on);var x=n.querySelector('.dvip');if(on&&!x){x=document.createElement('em');x.className='dvip';x.textContent='✦ '+LFI.tr('Cliente VIP');n.appendChild(x)}else if(!on&&x)x.remove()}
    new MutationObserver(function(){try{contaNome();vipMenu();vipMarca()}catch(_){}}).observe(document.body,{childList:true,subtree:true});

    /* ---------- Minha conta › Cartões (61i + 66g + 68g + 73f) ---------- */
    mtjCarrega=function(){var b=document.getElementById('mtj');if(!b)return;cupFn({acao:'meus'}).then(function(j){var b2=document.getElementById('mtj');if(!b2)return;
      if(!j||!j.ok){b2.innerHTML='<div class="note">'+LFI.tr(j&&j.motivo==='sessao'?'Sua sessão terminou. Entre de novo para ver seus cartões.':'Não deu para carregar seus cartões agora.')+'</div>';return}
      st.cards={ts:Date.now(),L:(j.cupons||[]).filter(function(c){return c.estado==='ok'&&!c.usado&&c.tipo!=='am'&&c.tipo!=='bv'}),vip:+j.vip||0,escada:j.escada||null,nome:j.nome||''};lsS('lf_cards',st.cards);
      var L=j.cupons||[];st._mtj=L;var nomeC=String(j.nome||(getConta()||{}).nome||'').toUpperCase(),am=L.filter(function(c){return c.tipo==='am'&&c.estado==='ok'})[0],P2=L.filter(function(c){return c.tipo!=='am'&&c.tipo!=='bv'});
      var uso=excCard(),em=uso&&P2.some(function(c){return c.cod===uso.cod})?uso.cod:'';P2.sort(function(a,b){return (b.cod===em)-(a.cod===em)});
      var h=P2.length?P2.map(function(c){var podeU=c.estado==='ok'&&!c.usado,est=c.usado||c.estado==='usado'?LFI.tr('Usado'):c.cod===em?LFI.tr('Em uso na aba Exclusivo'):c.estado==='ok'?LFI.tr('Disponível'):c.estado==='vencido'?LFI.tr('Vencido'):c.estado==='cedo'?LFI.tr('Ainda não começou'):LFI.tr('Indisponível');
        return '<div class="mtc"'+(podeU?'':' style="opacity:.62"')+'>'+cardHtml(c,nomeC,'mtx')+'<div class="mtl"><span>'+LFI.tr('Estado')+': <b>'+est+'</b></span>'+(podeU&&c.cod!==em?'<button type="button" class="cfx" data-mtusar="'+esc(c.cod)+'" style="min-height:44px;padding:0 14px">'+LFI.tr(em?'Usar este':'Usar agora')+'</button>':'')+'</div></div>'}).join(''):(am||j.guardados?'':'<div class="note">'+LFI.tr('Você ainda não tem cartões. Eles chegam por e-mail depois que você recebe a sua compra.')+'</div>');
      if(j.guardados)h+='<p class="note" style="margin:10px 2px 18px">'+(j.guardados===1?LFI.tr('Você tem 1 presente guardado.'):LFI.tr('Você tem')+' '+j.guardados+' '+LFI.tr('presentes guardados.'))+' '+LFI.tr(P2.some(function(c){return c.estado==='ok'&&!c.usado})?'Ele chega quando este cartão for usado ou vencer.':'Ele chega por e-mail em alguns dias.')+'</p>';
      if(am){var e=j.escada||{deg:1,feitas:0,tot:1},PZ=[['10%','1 indicação'],['15%','mais 3'],['Presente','mais 5']];
        var deg=PZ.map(function(x,i){var ok=i<e.deg-1,cur=i===e.deg-1;return '<div><i class="'+(ok?'ok':cur?'':'no')+'">'+(ok?'✓':i+1)+'</i><b>'+(ok?LFI.tr(x[0]):'?')+'</b><span>'+LFI.tr(x[1])+'</span></div>'}).join('');
        var bo='';for(var i=0;i<e.tot;i++)bo+='<span class="bo'+(i<e.feitas?' on':'')+'"></span>';var falta=e.tot-e.feitas;
        h+='<div class="mtc"><div class="amct" style="margin-top:0"><div><span style="font-weight:600;color:#1d1418">'+LFI.tr('Presenteie alguém especial')+'</span><b></b></div><div><span>'+LFI.tr('A pessoa ganha 10% na primeira compra. Quando ela comprar, você avança na escada.')+'</span><b></b></div>'+
          '<div class="esc">'+deg+'</div><div class="esd"><div>'+bo+'</div><p>'+(falta===1?LFI.tr('Falta 1 indicação'):LFI.tr('Faltam')+' '+falta+' '+LFI.tr('indicações'))+' '+LFI.tr('para o próximo presente, que é surpresa.')+'</p></div><a class="amwa" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(amMsg(am.cod))+'">'+LFI.tr('Enviar pelo WhatsApp')+'</a></div></div>'}
      b2.innerHTML=h},function(){})};
    /* "Usar este" / "Usar agora" em Minha conta › Cartões: troca o cartão em uso e leva à aba Exclusivo (66g) */
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-mtusar]');if(!t)return;e.preventDefault();var cod=t.getAttribute('data-mtusar'),c=(st._mtj||[]).filter(function(x){return x.cod===cod})[0];if(!c)return;
      st.excCod=cod;if(st.cup&&st.cup.cod!==cod){presTira();cupTira()}if(c.tipo!=='pe')cupGuarda(c);else cupGuarda(c);excAbre(cod)},true);

    /* ---------- Minha conta › Pedidos: reserva cancelada que abre para baixo (70d/70e) ---------- */
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-rcz]');if(!t)return;e.preventDefault();e.stopPropagation();var w=t.parentNode,d=w.querySelector('.rcd'),abre=!w.classList.contains('on');w.classList.toggle('on',abre);t.setAttribute('aria-expanded',abre);
      if(!d)return;var mv=Element.prototype.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches;if(!mv){d.hidden=!abre;return}
      if(abre){d.hidden=false;var H=d.scrollHeight;d.animate([{height:'0px',opacity:0},{height:H+'px',opacity:1}],{duration:350,easing:'cubic-bezier(.32,.72,0,1)'});d.firstChild&&d.firstChild.animate&&d.firstChild.animate([{transform:'translateY(-8px)',opacity:0},{transform:'none',opacity:1}],{duration:350,delay:60,easing:'cubic-bezier(.32,.72,0,1)',fill:'backwards'})}
      else{var H2=d.scrollHeight,a=d.animate([{height:H2+'px',opacity:1},{height:'0px',opacity:0}],{duration:300,easing:'cubic-bezier(.32,.72,0,1)'});a.onfinish=function(){d.hidden=true}}},true);
    window.__lfRcz=function(e,meta){return '<div class="rcw"><button type="button" class="cfp rcz" data-rcz aria-expanded="false"><span><b>Pedido '+esc(e.cod)+(e.teste?' · teste':'')+'</b><small>'+meta+'</small></span><span class="rce"><em class="er">'+LFI.tr('Reserva cancelada')+'</em><i class="rcs" aria-hidden="true">›</i></span></button><div class="rcd" hidden><div>'+LFI.tr(e.est==='cancelado'?'A reserva foi cancelada antes do pagamento. Nada foi cobrado e as peças voltaram para o site.':'A reserva terminou antes do pagamento. Nada foi cobrado e as peças voltaram para o site.')+'<a href="#vitrine" data-mf="tipo:todos" data-close>'+LFI.tr('Ver as peças')+' ›</a></div></div></div>'};

    /* ---------- iPhone: com o teclado aberto, o campo e o botão ficam acima dele (63e) ---------- */
    if(window.visualViewport&&/iP(hone|ad|od)/.test(navigator.userAgent)){var kb=function(){var vv=visualViewport,k=Math.max(0,innerHeight-vv.height-vv.offsetTop);document.documentElement.style.setProperty('--kb',k+'px');document.documentElement.classList.toggle('kbon',k>80);
        var f=document.activeElement;if(k>80&&f&&/INPUT|TEXTAREA|SELECT/.test(f.tagName)&&f.closest('#layer')){try{f.scrollIntoView({block:'center'})}catch(_){}}};visualViewport.addEventListener('resize',kb);visualViewport.addEventListener('scroll',kb)}

    /* ---------- começa ---------- */
    if(st.cup&&st.cup.tipo==='bv')cupTira(); /* o cupom de boas-vindas acabou (17/11) */
    if(logado())cardsCarrega().then(function(){try{if($('home'))homeDraw()}catch(_){}});
    if(typeof contaBtn==='function'){var _cb9=contaBtn;contaBtn=function(){var r=_cb9.apply(this,arguments);try{if(logado()&&!st.cards)cardsCarrega(true).then(function(){try{if($('home'))homeDraw()}catch(_){}});else{st.cards=null;lsS('lf_cards',null)}}catch(_){}return r}}
  })();
