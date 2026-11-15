# S313: implementa as telas de pagamento aprovadas (esboço critica-*.jpg, 14/11/2026) no site.
import re
R='/home/claude/catalogo/'
f=R+'js/lf-site.js'; s=open(f,encoding='utf-8').read()
def troca(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:70]); s=s.replace(a,b)
SETA='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
# --- tela de pagar (a função ativa)
troca("""    var timer=resLeft(e)>0&&e.est==='pagar'?'<div class="cdx" id="cdx"><small>Sua peça está reservada por</small><b id="cdxt">--:--</b><i><u id="cdxb"></u></i><small>Depois disso ela volta para o site.</small></div>':'';
    var fim='<input type="file" id="pgf" accept="image/*" hidden>'+
      '<a class="vend" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(LFI.lang==='es'?'¡Hola! Tengo una duda sobre el pago de mi pedido '+e.cod:'Olá! Tenho uma dúvida sobre o pagamento do meu pedido '+e.cod)+'"><span>Falar com um vendedor</span></a>'+
      (e.px?pxHtml(e.px):'<div id="pxcard"></div>')+
      '<button type="button" class="pgs" data-pkconta>Pagar depois (continua em Minha conta)</button>'+
      '<button type="button" class="pgx" data-cta="pkcanc">Cancelar pedido</button>'+
      '<p class="tm">""",
"""    /* S313 (14/11/2026, esboço aprovado): topo só com o logo; uma ação cheia; contagem numa linha; comprovante com 1 min; o resto em "Mais opções" */
    var timer=resLeft(e)>0&&e.est==='pagar'?'<div class="cdx" id="cdx"><small>Reservada para você por</small><b id="cdxt">--:--</b><i><u id="cdxb"></u></i></div>':'';
    var jap='<div class="pgcl" id="pgcl" hidden><label class="pyL" for="pgf" id="pgbtn">Já paguei · enviar comprovante</label></div>';
    var fim='<input type="file" id="pgf" accept="image/*" hidden>'+
      (e.px?pxHtml(e.px):'<div id="pxcard"></div>')+
      '<div class="pyX"><button type="button" class="pyXh" data-pymais aria-expanded="false"><span>Mais opções</span>"""+SETA+"""</button><div class="pyXb" id="pyXb" hidden>'+
      '<button type="button" class="pgs" data-pkconta>Pagar depois</button>'+
      '<a class="vend" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(LFI.lang==='es'?'¡Hola! Tengo una duda sobre el pago de mi pedido '+e.cod:'Olá! Tenho uma dúvida sobre o pagamento do meu pedido '+e.cod)+'"><span>Falar com um vendedor</span></a>'+
      '<button type="button" class="pgx" data-cta="pkcanc">Cancelar pedido</button></div></div>'+
      '<p class="tm">""")
troca("""      '<div class="pgq" id="pgq"></div><button type="button" class="pgc" data-pgcopy>Copiar código PIX</button>'+
      '<div class="pgau"><span class="spn"></span><span>Esperando o PIX… confirmamos sozinhos, não precisa mandar nada</span></div>'+
      '<div class="pgcl" id="pgcl" hidden>'+LFI.tr('Pagou e ainda não confirmou?')+'<br><label for="pgf">'+LFI.tr('Envie o comprovante')+'</label></div>'+fim).className='pgw0';""",
"""      '<div class="pyc"><button type="button" class="pyP" data-pgcopy>Copiar código PIX</button><p class="pyh m">Cole no app do seu banco, em “Pix copia e cola”.</p><p class="pyh d">Ou copie o código e cole no app do seu banco.</p>'+
      '<div class="pyq"><p class="pyh m">Pagando por outro aparelho? Leia o QR:</p><p class="pyh d">Abra o app do seu banco e leia o QR:</p><div class="pgq" id="pgq"></div></div></div>'+
      '<div class="pgau"><span class="spn"></span><span>Confirmamos sozinhos assim que o PIX chegar</span></div>'+jap+fim).className='pgw0 py';""")
troca("""      '<div class="pgcl" id="pgcl" hidden>'+LFI.tr('Pagou e ainda não confirmou?')+'<br><label for="pgf">'+LFI.tr('Envie o comprovante')+'</label></div>'+fim).className='pgw0';
    if(pix){var code=pixCode(e.brl,'LF'+e.cod);e.code=code;loadQr().then(function(){var q=$('pgq');if(q&&window.LFqr)q.innerHTML=LFqr.svg(code,240)}).catch(function(){var q=$('pgq');if(q)q.innerHTML='<div class="pgw">Não consegui desenhar o QR. Use o botão "Copiar código PIX".</div>'})}
    window.__pgcode=pix?pixCode(e.brl,'LF'+e.cod):'';
    /* S197: o comprovante só aparece depois de 10 min sem a confirmação automática */
    /* 13/11: Banco Familiar também confirma sozinho pelo e-mail do banco; o comprovante só depois de 10 min */
    {var pgW=!pix&&!TRF_AUTO?0:Math.max(0,600000-""",
"""      jap+fim).className='pgw0 py';
    if(pix){var code=pixCode(e.brl,'LF'+e.cod);e.code=code;loadQr().then(function(){var q=$('pgq');if(q&&window.LFqr)q.innerHTML=LFqr.svg(code,240)}).catch(function(){var q=$('pgq');if(q)q.innerHTML='<div class="pgw">Não consegui desenhar o QR. Use o botão "Copiar código PIX".</div>'})}
    window.__pgcode=pix?pixCode(e.brl,'LF'+e.cod):'';
    /* S313 (dono, 14/11): "Já paguei · enviar comprovante" aparece 1 min depois do pedido (antes 10 min); na transferência sem robô, na hora */
    {var pgW=!pix&&!TRF_AUTO?0:Math.max(0,60000-""")
# --- reserva encerrada
a=s.index("  function resExpirou(id){"); b=s.index("  function resRenova(id){")
s=s[:a]+"""  function resExpirou(id){
    /* S313: a ação cheia recupera a venda; quem já pagou envia o comprovante aqui mesmo (antes ia para o WhatsApp) */
    pedSet(id,{rx:0,venc:1});window.__pgid=id;
    pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Reserva encerrada</h2><div class="pkt" style="animation-delay:.1s"><span>Passaram os 30 minutos e a peça voltou para o site. Se ainda estiver disponível, você pode reservar de novo.</span></div><div class="pkb py" style="animation-delay:.3s"><button type="button" class="pyP" data-pkrenova="'+esc(id)+'">Reservar de novo</button><label class="pyL" for="pgf" id="pgbtn">Já paguei · enviar comprovante</label><input type="file" id="pgf" accept="image/*" hidden><button type="button" class="pyL s" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0 py'}
"""+s[b:]
# --- comprovante enviado
troca("""    pkTela(PK_LOGO+'<div class="pkc"><div class="pks"></div></div><h2 style="animation-delay:0s">Comprovante enviado</h2><div class="pkt" style="animation-delay:.1s"><span>A loja está conferindo o seu pagamento. Esta tela atualiza sozinha e você também pode acompanhar em Minha conta.</span></div><div class="pkb" style="animation-delay:.3s"><button type="button" data-pkfim>Voltar ao catálogo</button></div>'+(pedGet(id)?compZap(pedGet(id)):'')).className='pkw0';""",
"""    /* S313: final calmo — ✓ parado, número do pedido, uma saída só (o WhatsApp só aparece se o envio falhar, em enviarComp) */
    var pc=pedGet(id)||{};
    pkTela(PK_LOGO+'<div class="pyk"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.500 4.500L19 7.500"/></svg></div><h2 style="animation-delay:0s">Comprovante enviado</h2>'+(pc.cod?'<p class="pyn"><span>Pedido</span> '+esc(pc.cod)+'</p>':'')+'<div class="pkt" style="animation-delay:.1s"><span>'+(pc.venc?'Vamos conferir o seu pagamento e avisar aqui e em Minha conta. Pode sair desta tela.':'Vamos conferir o seu pagamento e avisar aqui e em Minha conta. Pode sair desta tela: sua peça continua reservada.')+'</span></div><div class="pkb py" style="animation-delay:.3s"><button type="button" class="pyL" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0 py';""")
troca("""pkComp(id)},function(){if(btn)btn.textContent='Não deu para enviar. Tente de novo.';toast(""",
"""pkComp(id)},function(){if(btn){btn.textContent='Não deu para enviar. Tente de novo.';var pz=pedGet(id),oz=$('pkok');if(pz&&oz&&!oz.querySelector('.pgwa'))btn.insertAdjacentHTML('afterend',compZap(pz))}toast(""")
# --- "Mais opções" abre/fecha
troca("  /*/CONTA*/\n  /* eventos */\n","""  /*/CONTA*/
  /* S313: "Mais opções" da tela de pagar (abre e fecha no lugar) */
  document.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-pymais]');if(!t)return;var b=$('pyXb');if(!b)return;var ab=b.hidden;b.hidden=!ab;t.setAttribute('aria-expanded',ab?'true':'false');if(ab)setTimeout(function(){try{b.lastElementChild.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(_){}},60)});
  /* eventos */
""")
open(f,'w',encoding='utf-8').write(s)

# --- CSS
f=R+'index.html'; h=open(f,encoding='utf-8').read()
css="""
/*S313 pagamento de luxo (14/11/2026): topo só com o logo, uma ação cheia, contagem calma, "Mais opções"*/
body:has(#pkok.py) .top :is(#mnb,#contabtn,#sbtn,#bagbtn){visibility:hidden}
#pkok.py{justify-content:safe center}
#pkok.py>*{flex-shrink:0}
#pkok.py .pkl{display:none}
#pkok.py .cdx{border:0;padding:0;margin:2px auto 16px;display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;gap:0 7px}
#pkok.py .cdx small{display:inline;font-size:14px;margin:0}
#pkok.py .cdx b{display:inline;font-size:15px;font-weight:600;letter-spacing:.02em;margin:0}
#pkok.py .cdx i{flex:0 0 100%;height:2px;max-width:150px;margin:10px auto 0;border-radius:2px}
#pkok .pyc{box-sizing:border-box;width:100%;max-width:320px;background:var(--pn);border:1px solid var(--ln);border-radius:26px;padding:20px;box-shadow:0 24px 50px -34px rgba(70,25,50,.5);display:flex;flex-direction:column;align-items:center;gap:12px}
#pkok .pyP,#pkok .pkb .pyP{display:flex;align-items:center;justify-content:center;width:100%;min-height:54px;margin:0;padding:0 18px;border:0;border-radius:16px;background:#1f8f4e;color:#fff;font:600 16px Inter,system-ui,sans-serif;letter-spacing:.01em;text-decoration:none;box-shadow:0 10px 24px -14px rgba(31,143,78,.9);cursor:pointer;box-sizing:border-box}
#pkok .pyh{margin:0;font-size:13px;line-height:1.4;color:var(--mu);text-align:center}
#pkok .pyh.d{display:none}
#pkok .pyq{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;padding-top:14px;border-top:1px solid var(--ln)}
#pkok .pyq .pgq{margin:0;min-height:0}
#pkok .pyq .pgq svg{width:140px;height:140px;border-radius:8px}
#pkok.py .pgau{margin:18px auto 2px;max-width:300px}
#pkok.py .pgcl{margin:0}
#pkok .pyL,#pkok .pkb .pyL{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin:0;padding:0 12px;background:none;border:0;color:var(--tx);font:500 15px Inter,system-ui,sans-serif;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px;cursor:pointer}
#pkok .pyL.s,#pkok .pkb .pyL.s{font-size:14px;color:var(--mu)}
#pkok .pyX{width:100%;max-width:320px;margin:10px auto 0;display:flex;flex-direction:column;align-items:center}
#pkok .pyXh{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;background:none;border:0;color:var(--mu);font:600 14px Inter,system-ui,sans-serif;cursor:pointer}
#pkok .pyXh svg{margin-top:2px;transition:transform .36s cubic-bezier(.16,1,.3,1)}
#pkok .pyXh[aria-expanded=true] svg{transform:rotate(180deg)}
#pkok .pyXb{width:100%;display:flex;flex-direction:column;align-items:center}
#pkok .pyXb[hidden]{display:none}
#pkok .pyXb>*{position:relative;display:flex;align-items:center;justify-content:center;width:100%;max-width:none;height:auto;min-height:50px;margin:0;padding:0 18px;background:none;border:0;border-radius:0;color:var(--mu);font:600 14px Inter,system-ui,sans-serif;text-decoration:none;box-sizing:border-box;animation:pyin .36s cubic-bezier(.16,1,.3,1) both}
#pkok .pyXb>*:nth-child(2){animation-delay:.04s}
#pkok .pyXb>*:nth-child(3){animation-delay:.08s}
#pkok .pyXb>*:before{content:"";position:absolute;top:0;left:50%;width:120px;margin-left:-60px;height:1px;background:var(--ln2)}
#pkok .pyXb>.pgx{color:#c0392b}
@keyframes pyin{from{opacity:0;transform:translateY(-6px)}}
#pkok .pkb.py{display:flex;flex-direction:column;align-items:center;gap:6px;max-width:300px}
#pkok .pkb.py .pyP{margin-bottom:10px}
#pkok .pyn{margin:2px 0 10px;font-size:14px;letter-spacing:.04em;color:var(--mu);font-variant-numeric:tabular-nums}
#pkok .pyk{width:64px;height:64px;border-radius:50%;border:1.5px solid #1f8f4e;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:#1f8f4e}
@media (min-width:800px) and (hover:hover){#pkok .pyq{order:-1;border-top:0;padding-top:0;padding-bottom:14px;border-bottom:1px solid var(--ln)}#pkok .pyq .pgq svg{width:220px;height:220px}#pkok .pyh.m{display:none}#pkok .pyh.d{display:block}}
@media (prefers-reduced-motion:reduce){#pkok .pyXb>*{animation:none}#pkok .pyXh svg{transition:none}}
"""
k=".pgsub{text-align:center;color:var(--mu);font-size:13px;margin:-2px 0 10px}"
assert h.count(k)==1; h=h.replace(k,k+css); open(f,'w',encoding='utf-8').write(h)

# --- espanhol
f=R+'js/lf-i18n.js'; t=open(f,encoding='utf-8').read()
ES={'Reservada para você por':'Reservada para vos por','Copiar código PIX':'Copiar código PIX','Cole no app do seu banco, em “Pix copia e cola”.':'Pegalo en la app de tu banco, en “Pix copia e cola”.','Ou copie o código e cole no app do seu banco.':'O copiá el código y pegalo en la app de tu banco.','Pagando por outro aparelho? Leia o QR:':'¿Pagás desde otro dispositivo? Leé el QR:','Abra o app do seu banco e leia o QR:':'Abrí la app de tu banco y leé el QR:','Confirmamos sozinhos assim que o PIX chegar':'Confirmamos solos apenas llegue el PIX','Já paguei · enviar comprovante':'Ya pagué · enviar comprobante','Mais opções':'Más opciones','Pagar depois':'Pagar después','Reserva encerrada':'Reserva finalizada','Passaram os 30 minutos e a peça voltou para o site. Se ainda estiver disponível, você pode reservar de novo.':'Pasaron los 30 minutos y la pieza volvió al sitio. Si sigue disponible, podés reservarla de nuevo.','Reservar de novo':'Reservar de nuevo','Comprovante enviado':'Comprobante enviado','Pedido':'Pedido','Vamos conferir o seu pagamento e avisar aqui e em Minha conta. Pode sair desta tela.':'Vamos a verificar tu pago y avisarte acá y en Mi cuenta. Podés salir de esta pantalla.','Vamos conferir o seu pagamento e avisar aqui e em Minha conta. Pode sair desta tela: sua peça continua reservada.':'Vamos a verificar tu pago y avisarte acá y en Mi cuenta. Podés salir de esta pantalla: tu pieza sigue reservada.','Pague o valor exato, com os centavos':'Pagá el valor exacto, con los centavos','Enviando…':'Enviando…','Não deu para enviar. Tente de novo.':'No se pudo enviar. Intentá de nuevo.'}
add=''.join("'%s':'%s',"%(k.replace("'","\\'"),v.replace("'","\\'")) for k,v in ES.items() if ("'"+k+"':") not in t)
k="'Pague com PIX':'Paga con PIX',"; assert t.count(k)>=1; t=t.replace(k,k+add,1); open(f,'w',encoding='utf-8').write(t)
print('ok',len(add))
