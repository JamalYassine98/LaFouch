# S318: implementa o desenho aprovado em 14/11/2026 23:00 (esboços work/s316): tela de pagar em linhas de recibo (PIX e transferência), voltar "‹ Minha conta",
# ajuda em linha, QR grande no computador e toque para ampliar no celular, pedido tocável com "Cancelar" dentro em Minha conta.
R='/home/claude/catalogo/'
f=R+'js/lf-site.js'; s=open(f,encoding='utf-8').read()
def troca(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
SETA='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'
VOLTA='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
a=s.index("    /* S313 (14/11/2026, esboço aprovado): topo só com o logo; uma ação cheia; contagem numa linha; comprovante com 1 min; o resto em \"Mais opções\" */")
b=s.index("    if(pix){var code=pixCode(e.brl,'LF'+e.cod);e.code=code;loadQr()",a)
novo = r"""    /* S318 (14/11/2026 23:00, esboços work/s316 aprovados): linhas de recibo (rótulo à esquerda, valor à direita) no lugar do total gigante; uma ação cheia;
       o fio dourado é a reserva; voltar "‹ Minha conta" no padrão do site; comprovante e ajuda em linhas; cancelar foi para Minha conta › Pedidos */
    var L=function(r,v,cp){return '<div class="zr"><span>'+r+'</span><span class="zk"><b>'+esc(v)+'</b>'+(cp!=null?'<button type="button" data-pgc2="'+esc(cp)+'">Copiar</button>':'')+'</span></div>'};
    var timer=resLeft(e)>0&&e.est==='pagar'?'<div class="zr" id="cdx"><span>Reservada para você por</span><span class="zk"><b id="cdxt">--:--</b></span></div><div class="zf"><i id="cdxb"></i></div>':'';
    var SETA='"""+SETA+r"""';
    var jap='<div id="pgcl" hidden><label class="zA" for="pgf" id="pgbtn"><span>Já paguei, enviar comprovante</span>'+SETA+'</label></div>';
    var fim='<input type="file" id="pgf" accept="image/*" hidden>'+
      '<a class="zA" target="_blank" rel="noopener" href="https://wa.me/'+NUM_LOJA+'?text='+encodeURIComponent(LFI.lang==='es'?'¡Hola! Tengo una duda sobre el pago de mi pedido '+e.cod:'Olá! Tenho uma dúvida sobre o pagamento do meu pedido '+e.cod)+'"><span>Precisa de ajuda? Fale com a loja</span>'+SETA+'</a></div>'+
      (e.px?pxHtml(e.px):'<div id="pxcard"></div>')+
      '<p class="tm">Ao pagar, você confirma a compra e aceita os <a href="/termos.html" target="_blank" rel="noopener">Termos e Condições</a>.</p></div>';
    var cab=pzBar()+'<div class="zw"><h2 style="animation-delay:0s">'+(pix?'Pague com PIX':'Transferência Banco Familiar')+'</h2><p class="zn"><span>Pedido</span> '+esc(e.cod||'')+'</p>'+(e.teste?'<div class="pgt">MODO TESTE</div>':'');
    if(pix)pkTela(cab+'<div class="zc"><div class="zG"><div class="zE">'+L('Valor',brl(e.brl))+timer+
      '<div class="zm"><p class="zl d">Prefere copiar? Cole no app do banco, em “Pix copia e cola”.</p><button type="button" class="zP" data-pgcopy>Copiar código PIX</button><p class="zl m">Cole no app do seu banco, em “Pix copia e cola”. O valor já vai no código.</p></div></div>'+
      '<div class="zQ"><span class="zqt m">Vai pagar por outro aparelho? Leia o QR com o app do banco.</span><button type="button" class="zqb" data-pzqr aria-label="Ampliar o QR"><span class="pgq" id="pgq"></span></button><span class="zqt d">Abra o app do seu banco no celular e leia o QR.</span></div></div></div>'+
      '<div class="zs"><span class="spn"></span><span>Confirmamos sozinhos assim que o PIX chegar.</span></div><div class="za">'+jap+fim).className='pgw0 py pz';
    else pkTela(cab+'<div class="zc">'+L('Valor exato','Gs. '+mil(vg),String(Math.round(vg)))+L('Alias (celular)',ITAU.alias,ITAU.alias)+L('Titular',ITAU.titular)+timer+
      (TRF_AUTO?'':'<div class="zm"><label class="zP" for="pgf" id="pgbtn">Já transferi, enviar comprovante</label><p class="zl m" style="display:block">Transfira o valor exato pelo app do seu banco e envie o comprovante aqui.</p></div>')+'</div>'+
      (TRF_AUTO?'<div class="zs"><span class="spn"></span><span>Confirmamos sozinhos assim que a transferência chegar.</span></div><div class="za">'+jap.replace('Já paguei, enviar comprovante','Já transferi, enviar comprovante'):'<div class="zs"><span>Confirmamos o pedido assim que conferirmos o comprovante.</span></div><div class="za">')+fim).className='pgw0 py pz';
    pzTopo();
"""
s=s[:a]+novo+s[b:]
# o relógio agora pinta o fio (a classe de "último minuto" vai também no fio)
troca("c.classList.toggle('lvx',s<=60)};","c.classList.toggle('lvx',s<=60);if(b&&b.parentNode)b.parentNode.classList.toggle('lvx',s<=60)};")
# barra de voltar padrão + medidas do topo
troca("  function compZap(e){","""  /* S318: voltar no padrão do site (igual ao "‹ Início" da página da peça); nas telas de pagamento leva a Minha conta › Pedidos */
  function pzBar(){return '<div class="zb"><button type="button" data-pzvolta>"""+VOLTA+"""<span>Minha conta</span></button></div>'}
  function pzTopo(){var o=$('pkok'),t=document.querySelector('.top');if(!o||!t)return;var bb=o.querySelector('.zb');o.style.setProperty('--pzt',Math.round(t.getBoundingClientRect().bottom)+'px');o.style.setProperty('--pzb',(bb?Math.round(bb.getBoundingClientRect().height):0)+'px')}
  window.addEventListener('resize',function(){if($('pkok'))pzTopo()});
  document.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-pzvolta],[data-pzqr]');if(!t)return;
    if(t.hasAttribute('data-pzqr')){var q=t.closest('.zQ');if(q)q.classList.toggle('big');return}
    var po=$('pkok');if(po){pkStop();po.remove()}document.documentElement.classList.remove('lock');closeLayer();minhaConta('peds')});
  function compZap(e){""")
# reserva encerrada e comprovante enviado ganham a barra
troca("""    pkTela(PK_LOGO+'<h2 style="animation-delay:0s">Reserva encerrada</h2>""","""    pkTela(pzBar()+PK_LOGO+'<h2 style="animation-delay:0s">Reserva encerrada</h2>""")
troca("""<button type="button" class="pyL s" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0 py'}""","""<button type="button" class="pyL s" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0 py';pzTopo()}""")
troca("""    pkTela(PK_LOGO+'<div class="pyk">""","""    pkTela(pzBar()+PK_LOGO+'<div class="pyk">""")
troca("""<button type="button" class="pyL" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0 py';""","""<button type="button" class="pyL" data-pkfim>Voltar ao catálogo</button></div>').className='pkw0 py';pzTopo();""")
# Minha conta › Pedidos: pedido que espera pagamento = cartão tocável com "›" e "Cancelar" dentro
troca("""      h=L.length?L.map(function(e){return '<button type="button" class="cfp" data-cta="ped" data-id="'+esc(e.id)+'"><span><b>Pedido '+esc(e.cod)+(e.teste?' · teste':'')+'</b><small>'+new Date(e.ts).toLocaleDateString('pt-BR')+' · '+(e.pag==='pix'?'PIX':e.pag==='alias'?'Banco Familiar':'')+' · '+(e.ent==='delivery'?'Delivery':'Retirada')+(e.est==='pago'?' · Código '+esc(e.tok||('LF-'+e.cod)):'')+'</small></span><em class="'+(e.est==='pago'?'ok':e.est==='cancelado'?'er':'')+'">'+estLabel(e)+'</em></button>'}).join(''):""",
"""      h=L.length?L.map(function(e){var meta=new Date(e.ts).toLocaleDateString('pt-BR')+' · '+(e.pag==='pix'?'PIX':e.pag==='alias'?'Banco Familiar':'')+' · '+(e.ent==='delivery'?'Delivery':'Retirada');
        /* S318: quem ainda não pagou toca no pedido para pagar e tem um "Cancelar" pequeno dentro do cartão (fora da área de toque de pagar) */
        if(e.est==='pagar'||e.est==='recusado')return '<div class="cfw"><button type="button" class="cfp cfq" data-cta="ped" data-id="'+esc(e.id)+'"><span class="cf1"><b>Pedido '+esc(e.cod)+(e.teste?' · teste':'')+'</b><span class="cfe"><em>'+estLabel(e)+'</em><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span></span><small>'+meta+'</small></button><button type="button" class="cfk" data-cta="pkcanc" data-id="'+esc(e.id)+'">Cancelar</button></div>';
        return '<button type="button" class="cfp" data-cta="ped" data-id="'+esc(e.id)+'"><span><b>Pedido '+esc(e.cod)+(e.teste?' · teste':'')+'</b><small>'+meta+(e.est==='pago'?' · Código '+esc(e.tok||('LF-'+e.cod)):'')+'</small></span><em class="'+(e.est==='pago'?'ok':e.est==='cancelado'?'er':'')+'">'+estLabel(e)+'</em></button>'}).join(''):""")
troca("else if(a==='pkcanc'){dlgAbre(","else if(a==='pkcanc'){var pci=t.getAttribute('data-id');if(pci)window.__pgid=pci;dlgAbre(")
troca("closeLayer();toast('Pedido cancelado.');if(logado())minhaConta()}","closeLayer();toast('Pedido cancelado.');if(logado())minhaConta('peds')}")
open(f,'w',encoding='utf-8').write(s)

f=R+'index.html'; h=open(f,encoding='utf-8').read()
css = r"""
/*S318 pagamento em linhas de recibo (14/11/2026)*/
#pkok.py{padding-top:calc(var(--pzt,74px) + var(--pzb,0px) + 26px)}
#pkok .zb{position:fixed;left:0;right:0;top:var(--pzt,74px);z-index:2;display:flex;align-items:center;padding:12px 16px 12px 14px;background:var(--bg);border-bottom:1px solid var(--ln);box-sizing:border-box;zoom:calc(1/var(--z,1))}
#pkok .zb button{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:10px 6px 10px 2px;background:none;border:0;border-radius:10px;color:var(--ac);font:600 16px Inter,system-ui,sans-serif;cursor:pointer}
#pkok.pz{display:block;text-align:left;padding-left:22px;padding-right:22px;padding-bottom:28px}
#pkok.pz .zw{max-width:400px;margin:0 auto}
#pkok.pz h2{font-size:28px;line-height:1.15;margin:0;text-align:left}
#pkok .zn{margin:6px 0 20px;font:400 14px/1.3 Inter,system-ui,sans-serif;color:var(--mu);font-variant-numeric:tabular-nums}
#pkok .zc{background:var(--pn);border:1px solid var(--ln);border-radius:22px;overflow:hidden}
#pkok .zr{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:54px;padding:0 18px;border-top:1px solid var(--ln);font:400 14.5px/1.3 Inter,system-ui,sans-serif;color:var(--mu)}
#pkok .zc>.zr:first-child,#pkok .zE>.zr:first-child{border-top:0}
#pkok .zr b{font:600 15.5px/1.3 Inter,system-ui,sans-serif;color:var(--tx);font-variant-numeric:tabular-nums;text-align:right;overflow-wrap:anywhere}
#pkok .zr .zk{display:inline-flex;align-items:center;gap:12px}
#pkok .zr button{flex:none;min-height:44px;min-width:44px;padding:0;background:none;border:0;color:var(--ac);font:600 14px Inter,system-ui,sans-serif;cursor:pointer;text-align:right}
#pkok .zf{height:2px;background:var(--ln2)}
#pkok .zf i{display:block;height:100%;width:100%;background:#e6a64c;transition:width 1s linear}
#pkok .zf.lvx i{background:#c0392b}
#pkok #cdx.lvx b{color:#c0392b}
#pkok .zm{padding:18px}
#pkok .zP{display:flex;align-items:center;justify-content:center;width:100%;min-height:54px;margin:0;padding:0 16px;border:0;border-radius:16px;background:#1f8f4e;color:#fff;font:600 16px Inter,system-ui,sans-serif;letter-spacing:.01em;cursor:pointer;box-sizing:border-box;text-align:center}
#pkok .zl{margin:10px 0 0;font:400 13px/1.4 Inter,system-ui,sans-serif;color:var(--mu)}
#pkok .zl.d,#pkok .zqt.d{display:none}
#pkok .zQ{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 18px;border-top:1px solid var(--ln);font:400 14.5px/1.35 Inter,system-ui,sans-serif;color:var(--mu)}
#pkok .zqb{flex:none;padding:0;border:0;background:none;cursor:zoom-in;line-height:0}
#pkok .zQ .pgq{display:block;margin:0;min-height:0}
#pkok .zQ .pgq svg{width:92px;height:92px;border-radius:8px;background:#fff;display:block}
#pkok .zQ.big{flex-direction:column}
#pkok .zQ.big .zqb{cursor:zoom-out}
#pkok .zQ.big .pgq svg{width:240px;height:240px}
#pkok .zs{display:flex;align-items:center;gap:10px;margin:16px 2px 6px;font:400 13.5px/1.35 Inter,system-ui,sans-serif;color:var(--mu)}
#pkok .zs .spn{width:14px;height:14px;border-width:2px}
#pkok .zA{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:52px;padding:0 2px;border-top:1px solid var(--ln);color:var(--tx);font:500 15px Inter,system-ui,sans-serif;text-decoration:none;cursor:pointer}
#pkok .za>.zA:last-child{border-bottom:1px solid var(--ln)}
#pkok .zA svg{color:var(--mu);flex:none}
#pkok.pz .tm{margin:14px 2px 0;text-align:left}
@media (min-width:800px) and (hover:hover){#pkok.pz .zw{max-width:720px}#pkok .zG{display:grid;grid-template-columns:300px 1fr}#pkok .zQ{order:-1;flex-direction:column;justify-content:center;padding:26px 20px;border-top:0;border-right:1px solid var(--ln);text-align:center}#pkok .zQ .pgq svg,#pkok .zQ.big .pgq svg{width:232px;height:232px;border-radius:10px}#pkok .zqb{cursor:default}#pkok .zE{display:flex;flex-direction:column}#pkok .zE .zm{margin-top:auto}#pkok .zl.m,#pkok .zqt.m{display:none}#pkok .zl.d{display:block;margin:0 0 10px}#pkok .zqt.d{display:block;font-size:13px}#pkok .zG .zP{background:none;color:#14713c;border:1.5px solid #1f8f4e}}
/*S318 Minha conta › Pedidos: pedido que espera pagamento*/
.cfw{position:relative;margin-top:8px}
.cfw .cfp.cfq{display:block;margin-top:0;cursor:pointer}
.cfq .cf1{display:flex;align-items:center;justify-content:space-between;gap:10px}
.cfq .cf1 b{white-space:nowrap}
.cfq .cfe{display:inline-flex;align-items:center;gap:6px;flex:none}
.cfq .cfe svg{color:var(--mu);margin-right:-4px}
.cfq small{margin-top:6px;padding-right:84px}
.cfw .cfk{position:absolute;right:14px;bottom:0;min-height:44px;padding:0 4px 0 14px;background:none;border:0;color:var(--mu);font:500 12px Inter,system-ui,sans-serif;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;cursor:pointer}
"""
k="@media (prefers-reduced-motion:reduce){#pkok .pyXb>*{animation:none}#pkok .pyXh svg{transition:none}}"
assert h.count(k)==1; h=h.replace(k,k+css); open(f,'w',encoding='utf-8').write(h)

f=R+'js/lf-i18n.js'; t=open(f,encoding='utf-8').read()
ES={'Valor':'Valor','Valor exato':'Valor exacto','Titular':'Titular','Copiar':'Copiar','Copiado ✓':'Copiado ✓','Minha conta':'Mi cuenta','O valor já vai no código.':'El valor ya va en el código.',
'Cole no app do seu banco, em “Pix copia e cola”. O valor já vai no código.':'Pegalo en la app de tu banco, en “Pix copia e cola”. El valor ya va en el código.',
'Prefere copiar? Cole no app do banco, em “Pix copia e cola”.':'¿Preferís copiar? Pegalo en la app del banco, en “Pix copia e cola”.',
'Vai pagar por outro aparelho? Leia o QR com o app do banco.':'¿Vas a pagar desde otro dispositivo? Leé el QR con la app del banco.',
'Abra o app do seu banco no celular e leia o QR.':'Abrí la app de tu banco en el celular y leé el QR.',
'Confirmamos sozinhos assim que o PIX chegar.':'Confirmamos solos apenas llegue el PIX.','Confirmamos sozinhos assim que a transferência chegar.':'Confirmamos solos apenas llegue la transferencia.',
'Confirmamos o pedido assim que conferirmos o comprovante.':'Confirmamos el pedido apenas verifiquemos el comprobante.',
'Já paguei, enviar comprovante':'Ya pagué, enviar comprobante','Já transferi, enviar comprovante':'Ya transferí, enviar comprobante',
'Transfira o valor exato pelo app do seu banco e envie o comprovante aqui.':'Transferí el valor exacto desde la app de tu banco y enviá el comprobante acá.',
'Precisa de ajuda? Fale com a loja':'¿Necesitás ayuda? Hablá con la tienda','Transferência Banco Familiar':'Transferencia Banco Familiar','Cancelar':'Cancelar','Alias (celular)':'Alias (celular)','Código copiado ✓':'Código copiado ✓'}
add=''.join("'%s':'%s',"%(k.replace("'","\\'"),v.replace("'","\\'")) for k,v in ES.items() if ("'"+k+"':") not in t)
k="'Pague com PIX':'Paga con PIX',"; t=t.replace(k,k+add,1); open(f,'w',encoding='utf-8').write(t)
print('ok',len(add))
