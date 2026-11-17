# S400 · site: pagamento/checkout 59a–59g e Minha conta › Cartões 61i (aprovados em 17/11/2026 06:23). Troca exata, com conferência.
import io
p='js/lf-site.js';t=io.open(p,encoding='utf8').read()
def tr(a,b,n=1):
    global t
    assert t.count(a)==n,(t.count(a),a[:90]);t=t.replace(a,b)
# ---------- 59a/59b/59c pagamento ----------
# sem cartão de desconto na tela; o pedido ainda avisa o servidor (cartão pendente = marca do pedido), agora com o nome
tr("cupFn({acao:'proxima',pid:id,tel:c.tel||'',email:c.email||'',lang:LFI.lang}).then(function(j){if(j&&j.ok&&j.cupom){var L3=lsG('lf_ped',[]);L3.forEach(function(e){if(e.id===id){e.px=j.cupom;if(j.amiga)e.am=j.amiga}});lsS('lf_ped',L3);var pc=document.getElementById('pxcard');if(pc)pc.outerHTML=pxHtml(j.cupom)}},function(){});",
   "/* S400 (17/11, esboços 59a–59f): o cartão de desconto NÃO aparece mais em tela nenhuma do pagamento; o presente chega por e-mail depois da entrega */cupFn({acao:'proxima',pid:id,tel:c.tel||'',email:c.email||'',nome:c.nome||'',lang:LFI.lang}).then(function(){},function(){});")
tr("      (e.px?pxHtml(e.px):'<div id=\"pxcard\"></div>')+\n","")
tr("""var jap='<div id="pgcl" hidden><label class="zA" for="pgf" id="pgbtn"><span>Já paguei, enviar comprovante</span>'+SETA+'</label></div>';""",
   """var jap='<div id="pgcl" hidden><label class="zA" for="pgf" id="pgbtn"><span>Enviar comprovante</span>'+SETA+'</label></div>';""")
a=t[t.index("    else pkTela(cab+'<div class=\"zc\">'+L('Valor exato'"):t.index("    pzTopo();\n    if(pix){var code=pixCode")]
b="""    else pkTela(cab+'<div class="zc"><ol class="zpas"><li>'+LFI.tr('Abra o app do seu banco e escolha <b>Transferir por alias</b>.')+'</li><li>'+LFI.tr('Tipo de alias: <b>Celular</b>. Cole o número abaixo.')+'</li><li>'+LFI.tr('Digite o <b>valor exato</b> e confirme.')+'</li></ol>'+L('Valor exato','Gs. '+mil(vg),String(Math.round(vg)))+L('Alias (celular)',ITAU.alias,ITAU.alias)+L('Titular',ITAU.titular+' · Banco Familiar')+timer+
      /* S400 (esboços 59a/59b): passo a passo em 3 linhas; sem botão ao abrir; depois de 2 min o aviso muda e aparece "Enviar comprovante" */'<div class="zm"><p class="zl m" style="display:block;margin:0">Depois de transferir, volte para esta tela.</p></div></div>'+
      '<div class="zs"><span class="spn"></span><span>Aguardando sua transferência…</span></div><div class="za">'+jap+fim).className='pgw0 py pz';
"""
t=t.replace(a,b)
a=t[t.index("    /* S313 (dono, 14/11): \"Já paguei · enviar comprovante\" aparece 1 min depois do pedido"):t.index("    resRelogio(id);\n    pkPoll(id,function(o){\n      if(o.cancelado){pedSet(id,{est:'cancelado'});pkStop();pkTela(PK_LOGO+'<h2 style=\"animation-delay:0s\">Pedido cancelado pela loja")]
b="""    /* S400 (17/11, esboços 59b/59c): 2 minutos depois do pedido, PIX e transferência fazem o mesmo — o aviso passa a dizer que a confirmação
       está demorando e aparece a linha "Enviar comprovante" (entra com o movimento suave e o brilho dourado do S320) */
    {var pgW=Math.max(0,120000-(Date.now()-(+e.ts||Date.now())));clearTimeout(window.__pgclT);window.__pgclT=setTimeout(function(){var x=$('pgcl'),o=$('pkok');if(!x||!o)return;var z=o.querySelector('.zs');if(z)z.innerHTML='<span class="spn"></span><span>'+LFI.tr(pix?'A confirmação está demorando mais que o normal. Se você já pagou, envie o comprovante.':'A confirmação está demorando mais que o normal. Se você já transferiu, envie o comprovante.')+'</span>';if(pgW>0)x.classList.add('zin');x.hidden=false},pgW)}
"""
t=t.replace(a,b)
# ---------- 59f pago sem cartão da amiga e sem opinião; 59g opinião em Minha conta › Pedidos depois da entrega ----------
a=t[t.index("  var _pkOk=pkOk;pkOk=function(id,o){_pkOk(id,o);\n    var poe=function(am)"):t.index("  /* Minha conta › Cartões: contador embaixo do cartão da amiga */")]
t=t.replace(a,"  /* S400 (17/11, esboço 59f): a tela de pedido pago não mostra mais cartão nenhum (o convite para indicar vai por e-mail 2 semanas depois da entrega) */\n")
tr("function opBloco(id){var e=pedGet(id),o=$('pkok');if(!e||!o||o.querySelector('.opd'))return;",
   "function opBloco(id){var e=pedGet(id),o=$('pkok');/* S400 (esboços 59f/59g): a opinião só é pedida depois que a loja marca o pedido como ENTREGUE */if(!e||!e.entregue||!o||o.querySelector('.opd'))return;")
tr("function estLabel(e){return {pagar:'Aguardando pagamento',comp:'Comprovante em análise',pago:'Pago · reservado',",
   "function estLabel(e){if(e.est==='pago'&&e.entregue)return 'Entregue';return {pagar:'Aguardando pagamento',comp:'Comprovante em análise',pago:'Pago · reservado',")
tr("var L=lsG('lf_ped',[]).filter(function(e){return e.est==='pagar'||e.est==='comp'||e.est==='recusado'});if(!L.length)return;",
   "var L=lsG('lf_ped',[]).filter(function(e){return e.est==='pagar'||e.est==='comp'||e.est==='recusado'||(e.est==='pago'&&!e.entregue&&Date.now()-(+e.ts||0)<120*864e5)});if(!L.length)return;")
tr("if(o.cancelado)n={est:'cancelado'};else if(o.pago)n={est:'pago',tok:o.tok||e.tok||''};if(n){pedSet(e.id,n);return 1}return 0}",
   "if(o.cancelado)n={est:'cancelado'};else if(o.pago&&e.est!=='pago')n={est:'pago',tok:o.tok||e.tok||''};if(o.pago&&o.entregue&&!o.cancelado)n=Object.assign(n||{},{entregue:true});if(n){pedSet(e.id,n);return 1}return 0}")
tr("""<em class="'+(e.est==='pago'?'ok':e.est==='cancelado'?'er':'')+'">'+estLabel(e)+'</em></button>'}).join(''):'<div class="note">Você ainda não fez nenhum pedido.</div>';
      pedAtualiza()}""",
   """<em class="'+(e.est==='pago'?'ok':e.est==='cancelado'?'er':'')+'">'+estLabel(e)+'</em></button>'+(e.est==='pago'&&e.entregue?'<button type="button" class="cfx" data-cta="pedaval" data-id="'+esc(e.id)+'" style="display:block;min-height:44px;margin:2px 0 10px;padding:0 2px;text-align:left">Avaliar a compra ›</button>':'')}).join(''):'<div class="note">Você ainda não fez nenhum pedido.</div>';
      pedAtualiza()}""")
tr("    else if(a==='ped'){var id=t.getAttribute('data-id');var po=$('pkok');if(po)po.remove();closeLayer();pkAbre(id)}",
   "    else if(a==='ped'){var id=t.getAttribute('data-id');var po=$('pkok');if(po)po.remove();closeLayer();pkAbre(id)}\n    else if(a==='pedaval'){var idv=t.getAttribute('data-id');var pov=$('pkok');if(pov)pov.remove();closeLayer();pkAbre(idv);setTimeout(function(){var q=document.querySelector('#pkok .opd');if(q)try{q.scrollIntoView({block:'start',behavior:'smooth'})}catch(_){q.scrollIntoView()}},500)}")
# ---------- 59d Cédula | RUC · 59e o digitado fica guardado ----------
tr("function maskDoc(nac,txt){if(!NAC[nac])return String(txt||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,20);var d=digs(txt);",
   "function maskDoc(nac,txt,tp){if(!NAC[nac])return String(txt||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,20);var d=digs(txt);\n    /* S400 (esboço 59d): paraguaio escolhe Cédula ou RUC; a cédula não leva traço (antes 4567890 virava 456789-0) */if(nac==='py'&&tp!=='ruc'){d=d.slice(0,8);return d.replace(/(\\d)(?=(\\d{3})+$)/g,'$1.')}")
tr("function docNorm(nac,txt){if(!NAC[nac]){",
   "function docNorm(nac,txt,tp){if(nac==='py'&&tp){var dp=String(txt||'').replace(/\\D/g,'');if(tp==='ruc')return rucNorm(txt);return /^\\d{5,8}$/.test(dp)?dp:''}if(!NAC[nac]){")
a=t[t.index("    if(so!=='falta'||!c.doc)h+='<label class=\"cfl\" for=\"'+p+'a2\">'+LFI.tr('Nacionalidade')"):t.index("    return h}\n  function rucDV(n)")]
b="""    /* S400 (17/11, esboços 59d/59e): Documento = Cédula | RUC para o paraguaio; o que a pessoa digita fica guardado (st.pf) e volta ao redesenhar o passo */
    var G=(st.pf&&st.pf[p])||{};if(G.a2)nac=G.a2;var tp=docTipo(p,c),py=nac==='py';
    if(so!=='falta'||!c.doc)h+='<label class="cfl" for="'+p+'a2">'+LFI.tr('Nacionalidade')+'</label>'+cdd(p+'a2',LFI.tr('Nacionalidade'),nac,nacItems(),'Buscar nacionalidade')+
      '<div id="'+p+'dt"'+(py?'':' hidden')+'><span class="cfl">'+LFI.tr('Documento')+'</span><div class="cfdoc" role="group" aria-label="'+LFI.tr('Documento')+'"><button type="button" data-doct="ced" data-p="'+p+'" class="'+(tp==='ruc'?'':'on')+'" aria-pressed="'+(tp!=='ruc')+'">'+LFI.tr('Cédula')+'</button><button type="button" data-doct="ruc" data-p="'+p+'" class="'+(tp==='ruc'?'on':'')+'" aria-pressed="'+(tp==='ruc')+'">RUC</button></div></div>'+
      '<label class="cfl" for="'+p+'d" id="'+p+'dl">'+docRot(nac,tp)+'</label><input class="field" id="'+p+'d" inputmode="'+(NAC[nac]?'numeric':'text')+'" autocomplete="off" placeholder="'+docPh(nac,tp)+'" value="'+esc(G.d!=null?G.d:maskDoc(nac,c.doc||'',tp))+'">';
    /* o RUC opcional de antes saiu: quem quer a factura com nome escolhe RUC acima (o campo fica escondido só para o código antigo que o procura) */
    h+='<div id="'+p+'rw" hidden></div>';
"""
t=t.replace(a,b)
tr("""placeholder="'+esc(fnEx(pais))+'" value="'+esc(c.telTxt||'')+'"></div>""","""placeholder="'+esc(fnEx(pais))+'" value="'+esc(((st.pf&&st.pf[p])||{}).z!=null?st.pf[p].z:(c.telTxt||''))+'"></div>""",2)
tr("  function rucDV(n){","""  function docTipo(p,c){var G=(st.pf&&st.pf[p])||{};return G.tp||((c&&(c.docT==='ruc'||/-\\d$/.test(c.doc||'')&&(c.nac||'py')==='py'))?'ruc':'ced')}
  function docRot(nac,tp){return nac==='py'?LFI.tr(tp==='ruc'?'Número do RUC':'Número da cédula'):nacInfo(nac).d}
  function docPh(nac,tp){return nac==='py'?(tp==='ruc'?'1234567-8':'1.234.567'):nacInfo(nac).ph}
  function pfG(p,k,v){st.pf=st.pf||{};st.pf[p]=st.pf[p]||{};st.pf[p][k]=v}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-doct]');if(!b)return;var p=b.getAttribute('data-p'),tp=b.getAttribute('data-doct'),d=$(p+'d');pfG(p,'tp',tp);
    [].forEach.call(b.parentNode.children,function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
    var l=$(p+'dl');if(l)l.textContent=docRot('py',tp);if(d){d.placeholder=docPh('py',tp);d.value=maskDoc('py',d.value,tp);pfG(p,'d',d.value);d.classList.remove('bad');try{d.focus()}catch(_){}}});
  function rucDV(n){""")
tr("if(d){var nac=$(p+'a2').value,dv=d.value.trim();if(dv||obr){var dn=docNorm(nac,dv);if(!dn){cfErro(nacInfo(nac).d+(NAC[nac]?' inválido. Confira os números.':': digite o número (letras e números, mínimo 4).'),p+'d');return null}o.nac=nac;o.doc=dn}}",
   "if(d){var nac=$(p+'a2').value,dv=d.value.trim(),tp=nac==='py'?docTipo(p,c):'';if(dv||obr){var dn=docNorm(nac,dv,tp);if(!dn){cfErro(nac==='py'?LFI.tr(tp==='ruc'?'RUC inválido. Confira o número e o dígito depois do traço.':'Cédula inválida. Confira os números.'):nacInfo(nac).d+(NAC[nac]?' inválido. Confira os números.':': digite o número (letras e números, mínimo 4).'),p+'d');return null}o.nac=nac;o.doc=dn;if(nac==='py'){o.docT=tp;o.ruc=tp==='ruc'?dn:''}}}")
tr("else if(r)o.ruc=rucNorm((($(p+'d')||{}).value)||'')||'';\n    return o}","else if(r)o.ruc=rucNorm((($(p+'d')||{}).value)||'')||'';\n    if(st.pf)delete st.pf[p];return o}")
tr("var p=m[1],n=nacInfo(t.value),fd=$(p+'d'),rw0=$(p+'rw');if(rw0)rw0.hidden=t.value!=='py';if(fd){$(p+'dl').textContent=n.d;fd.placeholder=n.ph;fd.inputMode=NAC[t.value]?'numeric':'text';fd.value=maskDoc(t.value,fd.value)}",
   "var p=m[1],n=nacInfo(t.value),fd=$(p+'d'),dt0=$(p+'dt'),tp0=docTipo(p,contaNorm(getConta())||{});pfG(p,'a2',t.value);if(dt0)dt0.hidden=t.value!=='py';if(fd){$(p+'dl').textContent=docRot(t.value,tp0);fd.placeholder=docPh(t.value,tp0);fd.inputMode=NAC[t.value]?'numeric':'text';fd.value=maskDoc(t.value,fd.value,tp0);pfG(p,'d',fd.value)}")
tr("if(m)fnVivo(t,m[1]+'p',m[1]+'zh');var m2=/^(mp|pp)d$/.exec(t.id);if(m2)maskCampo(t,function(v){return maskDoc($(m2[1]+'a2').value,v)})});",
   "if(m){fnVivo(t,m[1]+'p',m[1]+'zh');pfG(m[1],'z',t.value)}var m2=/^(mp|pp)d$/.exec(t.id);if(m2){maskCampo(t,function(v){return maskDoc($(m2[1]+'a2').value,v,docTipo(m2[1],contaNorm(getConta())||{}))});pfG(m2[1],'d',t.value)}});")
# ---------- 61i Minha conta › Cartões ----------
a=t[t.index("    var L=j.cupons||[];st._mtj=L;b2.innerHTML=L.length?L.map(function(c){var podeU="):t.index("  /* S367: pergunta antes de usar o cupom (Minha conta › Cartões) */")]
b="""    /* S400 (17/11, esboço 61i): cartão de luxo SEM o código à vista ("Usar agora" aplica sozinho), presentes guardados e o convite para indicar com as metas */
    var L=j.cupons||[];st._mtj=L;var es=LFI.lang==='es',nomeC=String(j.nome||(getConta()||{}).nome||'').toUpperCase(),am=L.filter(function(c){return c.tipo==='am'&&c.estado==='ok'})[0],P=L.filter(function(c){return c.tipo!=='am'});
    var bola=function(on){return '<i style="display:inline-block;width:11px;height:11px;border-radius:50%;margin:0 5px 0 0;'+(on?'background:#8d3a69':'border:1px solid #cdb9c5')+'"></i>'};
    var card=function(c){var vip=c.tipo==='vip',T=vip?['#17121a','linear-gradient(135deg,#2b2330 0%,#17121a 55%,#0c090e 100%)','rgba(214,178,116,.75)','#c9bfc6']:['#3a1830','linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%)','rgba(214,178,116,.6)','#d9c3d0'];
      var rot=LFI.tr(vip?'CARTÃO VIP':c.tipo==='fiel'?'CLIENTE FIEL':'CARTÃO PRESENTE'),tit=c.tipo==='bv'?LFI.tr('na primeira compra'):vip&&c.max>1?LFI.tr('em')+' '+c.max+' '+LFI.tr('compras'):vip?LFI.tr('na sua próxima compra'):LFI.tr('na próxima compra');
      return '<div class="lxc" style="max-width:300px;margin:0 auto;border-radius:16px;background:'+T[0]+';background-image:'+T[1]+';padding:6px"><div style="border:1px solid '+T[2]+';border-radius:11px;padding:15px 16px 13px">'+
        '<div style="display:flex;justify-content:space-between;align-items:center"><img src="/media/email/cartao-ouro.png" width="82" height="13" alt="La Fouch"><span style="font:500 12.5px Inter,Arial;letter-spacing:.14em;color:'+T[3]+'">'+rot+'</span></div>'+
        '<div style="font:500 42px/1 Fraunces,Georgia,serif;color:#e9d3a6;margin:18px 0 2px">'+c.pct+'%</div><div style="font:italic 16px/1.3 Fraunces,Georgia,serif;color:#fff">'+tit+'</div>'+
        '<div style="height:1px;background:rgba(214,178,116,.4);margin:14px 0 9px"></div><div style="display:flex;justify-content:space-between;font:500 12.5px Inter,Arial;letter-spacing:.04em;white-space:nowrap;color:'+T[3]+'"><span style="overflow:hidden;text-overflow:ellipsis;margin-right:10px">'+esc(String(c.nome||'').toUpperCase()||nomeC)+'</span><span>'+(c.fim?LFI.tr('ATÉ')+' '+cupData(c.fim):'')+'</span></div></div></div>'};
    var n=+j.indicacoes||0,falta=n<3?3-n:n<5?5-n:0;
    var prog=n?(n===1?LFI.tr('1 pessoa indicada já comprou.'):n+' '+LFI.tr('pessoas indicadas já compraram.'))+(falta?' '+(falta===1?LFI.tr('Falta 1 para o seu próximo presente.'):LFI.tr('Faltam')+' '+falta+' '+LFI.tr('para o seu próximo presente.')):''):LFI.tr('Ninguém que você indicou comprou ainda.');
    b2.innerHTML=(P.length?P.map(function(c){var podeU=c.estado==='ok'&&!c.usado;var est=c.usado||c.estado==='usado'?LFI.tr('Usado'):c.estado==='ok'?LFI.tr('Disponível'):c.estado==='vencido'?LFI.tr('Vencido'):c.estado==='cedo'?LFI.tr('Ainda não começou'):LFI.tr('Indisponível');
      return '<div class="mtc"'+(podeU?'':' style="opacity:.62"')+'>'+card(c)+'<div class="mtl"><span>'+LFI.tr('Estado')+': <b>'+est+'</b></span>'+(podeU?'<button type="button" class="cfx" data-cupsim="'+esc(c.cod)+'" style="min-height:44px;padding:0 14px">'+LFI.tr('Usar agora')+'</button>':'')+'</div></div>'}).join(''):(am||j.guardados?'':'<div class="note">'+LFI.tr('Você ainda não tem cartões. Eles chegam por e-mail depois que você recebe a sua compra.')+'</div>'))+
      (j.guardados?'<p class="note" style="margin:10px 2px 18px">'+(j.guardados===1?LFI.tr('Você tem 1 presente guardado.'):LFI.tr('Você tem')+' '+j.guardados+' '+LFI.tr('presentes guardados.'))+' '+LFI.tr(P.some(function(c){return c.estado==='ok'&&!c.usado})?'Ele chega quando este cartão for usado ou vencer.':'Ele chega por e-mail em alguns dias.')+'</p>':'')+
      (am?'<div class="mtc"><div class="amct" style="margin-top:0"><div><span style="font-weight:600;color:#1d1418">'+LFI.tr('Presenteie alguém especial')+'</span><b></b></div><div><span>'+LFI.tr('A pessoa ganha 10% na primeira compra. Quando ela comprar, você também ganha um presente.')+'</span><b></b></div>'+
        '<div><span>'+bola(n>=1)+bola(n>=2)+bola(n>=3)+'</span><b></b></div><div><span>'+prog+'</span><b></b></div><a class="amwa" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(amMsg(am.cod))+'">'+LFI.tr('Enviar pelo WhatsApp')+'</a></div></div>':'')},function(){})}
"""
t=t.replace(a,b)
io.open(p,'w',encoding='utf8').write(t)

# nota: a troca do telefone vale só para perfilCampos (id p+'z'); a 1ª ocorrência (cfz, outro formulário) foi devolvida ao original depois.
