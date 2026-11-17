# S409 · aplica no site (catalogo) os esboços aprovados dos cupons e cartões (17/11/2026, "implementar tudo"). Cada troca confere o lugar exato.
import io, re, sys
SITE = '/home/claude/catalogo/'
JS = SITE + 'js/lf-site.js'
t = io.open(JS, encoding='utf8').read()
if 'S409 (17/11/2026, "implementar tudo" do dono)' in t:
    sys.exit('já aplicado')
def troca(a, b, n=1):
    global t
    c = t.count(a)
    assert c == n, (c, a[:90])
    t = t.replace(a, b)

# 1. carrinho: as peças aparecem com o preço normal (o desconto fica só na linha de baixo — 74a/71c)
i = t.index("'+(function(){if(!st.cup||descVale()!=='cup')return '<div class=\"pu\"><span>'+fmtL(p,1)+'</span> <span>'+LFI.tr('por unidade')+'</span></div>';")
j = t.index("})()+'</div><div class=\"cif\">", i)
t = t[:i] + "'+'<div class=\"pu\"><span>'+fmtL(p,1)+'</span> <span>'+LFI.tr('por unidade')+'</span></div>'+" + t[j + 5:]
troca("(st.cup&&descVale()==='cup'&&cupPeca(p).d>0?LFI.fmtD(LFI.pv(p.n-cupPeca(p).d)*st.cart[k]):fmtL(p,st.cart[k]))", "fmtL(p,st.cart[k])")
# 2. página da peça (83): no lugar do "Aceita cupom" para todos, o selinho "Cupom disponível" só para quem tem um cartão que vale nela
troca("'<span class=\"acup\">'+CUPI+LFI.tr('Aceita cupom')+'</span>'", "'<span class=\"acup fsl\">'+LFI.tr('Cupom disponível')+'</span>'")
# 3. Favoritos (81f): o mesmo selinho ao lado do preço
troca("<div class=\"pu\"><span>'+fmtL(p,1)+'</span></div></div>'+\n      '<div class=\"fva\">", "<div class=\"pu\"><span>'+fmtL(p,1)+'</span>'+(aceitaCup(p)?'<span class=\"fsl\">'+LFI.tr('Cupom disponível')+'</span>':'')+'</div></div>'+\n      '<div class=\"fva\">")
# 4. inscrição nas novidades (68h): sem o cupom de boas-vindas e sem a janela
troca(";cupFn({acao:'bv',email:em.trim(),tel:(getConta()||{}).tel||'',lang:LFI.lang}).then(function(b){if(b&&b.ok&&b.cupom)bvMostra(b.cupom)},function(){})", "")
# 5. reserva do Cliente VIP (70c): o site manda o telefone; o servidor diz se é VIP (3 horas)
troca("resCall('reservar',id,resItens(doc.itens),null,{pag:pag})", "resCall('reservar',id,resItens(doc.itens),null,{pag:pag,tel:c.tel||''})")
troca("rxo={rx:rr.exp,rd:(rr.agora||Date.now())-Date.now()}", "rxo={rx:rr.exp,rd:(rr.agora||Date.now())-Date.now(),vip:!!rr.vip}", 2)
troca("rx:rxo?rxo.rx:0,rd:rxo?rxo.rd:0,", "rx:rxo?rxo.rx:0,rd:rxo?rxo.rd:0,vip:!!(rxo&&rxo.vip),", 2)
troca("var timer=resLeft(e)>0&&e.est==='pagar'?'<div class=\"zr\" id=\"cdx\">",
      "var timer=resLeft(e)>0&&e.est==='pagar'&&e.vip?'<div class=\"zr\" id=\"cdx\"><span><em class=\"zvip\">✦</em>'+LFI.tr('Reserva VIP até')+'</span><span class=\"zk\"><b>'+new Date(e.rx-(e.rd||0)).toLocaleTimeString(LFI.lang==='es'?'es-PY':'pt-BR',{hour:'2-digit',minute:'2-digit'})+'</b></span></div>':resLeft(e)>0&&e.est==='pagar'?'<div class=\"zr\" id=\"cdx\">")
# 6. Minha conta › Pedidos (70d/70e): reserva vencida ou cancelada antes de pagar = linha limpa que abre para baixo
troca("if(o.cancelado)n={est:'cancelado'}", "if(o.cancelado)n={est:'cancelado',fp:!!o.pago||e.est==='pago'}")
troca("h=L.length?L.map(function(e){var meta=new Date(e.ts).toLocaleDateString('pt-BR')+' · '+(e.pag==='pix'?'PIX':e.pag==='alias'?'Banco Familiar':'')+' · '+(e.ent==='delivery'?'Delivery':'Retirada');",
      "h=L.length?L.map(function(e){var meta=new Date(e.ts).toLocaleDateString('pt-BR')+' · '+(e.pag==='pix'?'PIX':e.pag==='alias'?'Banco Familiar':'')+' · '+(e.ent==='delivery'?'Delivery':'Retirada');\n        /* S409 (70d/70e): reserva cancelada ou vencida antes do pagamento */if(window.__lfRcz&&((e.est==='cancelado'&&!e.fp)||(e.est==='pagar'&&e.rx&&Date.now()>e.rx-(e.rd||0))))return window.__lfRcz(e,meta);")
# 7. pedido com o presente especial: a peça de presente vai no pedido (pres:true) e o servidor confere (presente.js)
troca("if(!retry&&descVale()==='cup'&&st._cupOk!==id)", "if(!retry&&(descVale()==='cup'||(window.__lfPres&&__lfPres.ativo()))&&st._cupOk!==id)")
troca("total:Math.round(bruto()),desc:Math.round(cupInfo().d)", "total:Math.round(bruto()+(window.__lfPres&&__lfPres.ativo()?__lfPres.n():0)),desc:Math.round(window.__lfPres&&__lfPres.ativo()?__lfPres.n():cupInfo().d)")
troca("st.cart[k])}})},DV==='cup'&&st.cup?{cup:st.cup.cod,cupd:CI.d}:{})})();",
      "st.cart[k])}}).concat(window.__lfPres?__lfPres.item():[])},window.__lfPres&&__lfPres.ativo()?{cup:st.cup.cod,cupd:__lfPres.n()}:DV==='cup'&&st.cup?{cup:st.cup.cod,cupd:CI.d}:{})})();")
# 8. cadastro (63d): Cédula | RUC também no "Seus dados" (mesmo seletor do pagamento; prefixo cf)
troca("'<label class=\"cfl\" for=\"cfd\" id=\"cfdl\">'+nacInfo(nac).d+'</label><input class=\"field\" id=\"cfd\" inputmode=\"'+(NAC[nac]?'numeric':'text')+'\" autocomplete=\"off\" placeholder=\"'+nacInfo(nac).ph+'\" value=\"'+esc(maskDoc(nac,c.doc))+'\">'",
      "(function(){var tp=docTipo('cf',c);return '<div id=\"cfdt\"'+(nac==='py'?'':' hidden')+'><span class=\"cfl\">'+LFI.tr('Documento')+'</span><div class=\"cfdoc\" role=\"group\" aria-label=\"'+LFI.tr('Documento')+'\"><button type=\"button\" data-doct=\"ced\" data-p=\"cf\" class=\"'+(tp==='ruc'?'':'on')+'\" aria-pressed=\"'+(tp!=='ruc')+'\">'+LFI.tr('Cédula')+'</button><button type=\"button\" data-doct=\"ruc\" data-p=\"cf\" class=\"'+(tp==='ruc'?'on':'')+'\" aria-pressed=\"'+(tp==='ruc')+'\">RUC</button></div></div>'+'<label class=\"cfl\" for=\"cfd\" id=\"cfdl\">'+docRot(nac,tp)+'</label><input class=\"field\" id=\"cfd\" inputmode=\"'+(NAC[nac]?'numeric':'text')+'\" autocomplete=\"off\" placeholder=\"'+docPh(nac,tp)+'\" value=\"'+esc(maskDoc(nac,c.doc,tp))+'\">'})()")
troca("var nac=$('cfa2').value,doc=docNorm(nac,g('cfd'));", "var nac=$('cfa2').value,cftp=docTipo('cf',getConta()||{}),doc=docNorm(nac,g('cfd'),cftp);")
troca("var nc={nome:nome,nac:nac,doc:doc,", "var nc={nome:nome,nac:nac,doc:doc,docT:nac==='py'?cftp:'',")
troca("if(t.id==='cfd'){var nc=$('cfa2').value;maskCampo(t,function(v){return maskDoc(nc,v)})}", "if(t.id==='cfd'){var nc=$('cfa2').value,ctp=docTipo('cf',getConta()||{});maskCampo(t,function(v){return maskDoc(nc,v,ctp)})}")
troca("if(t.id==='cfa2'){cfpyUpd();var n=nacInfo(t.value),fd=$('cfd');$('cfdl').textContent=n.d;fd.placeholder=n.ph;fd.inputMode=NAC[t.value]?'numeric':'text';fd.value=maskDoc(t.value,fd.value);",
      "if(t.id==='cfa2'){cfpyUpd();var n=nacInfo(t.value),fd=$('cfd'),ctp=docTipo('cf',getConta()||{}),dt=$('cfdt');if(dt)dt.hidden=t.value!=='py';$('cfdl').textContent=docRot(t.value,ctp);fd.placeholder=docPh(t.value,ctp);fd.inputMode=NAC[t.value]?'numeric':'text';fd.value=maskDoc(t.value,fd.value,ctp);")
# 9. o bloco novo (cartões, Exclusivo, carrinho, folha de troca, Minha conta, menu, iPhone) — no mesmo escopo das funções do site
bl = io.open('/home/claude/lafouch/work/s409/bloco.js', encoding='utf8').read()
bl = bl.replace("    window.__lfCardHtml=cardHtml;", "    window.__lfCardHtml=cardHtml;\n    window.__lfPres={ativo:function(){return presAtivo()},n:function(){return presN()},item:function(){if(!presAtivo())return [];var p=find(st.pres.ref);return [{ref:p.ref,nome:p.nome,q:1,cor:(p.cores&&p.cores.length>1)?corNome(p,st.pres.cor||0):'',grau:'',preco:0,pres:true,cd:0,l2:0,pv:LFI.tr('Grátis')}]}};\n    cupPecaHtml=function(){return ''}; /* a página da peça usa o selinho (83); nada de \"código\" */")
ancora = "var _cupA=cupAplica;cupAplica=function(cod,cb){var q=new URLSearchParams(location.search).get('t');_cupA(cod,function(j){if(j&&j.ok&&j.cupom&&j.cupom.tipo==='am'&&q&&String(q).toUpperCase()===String(cod).toUpperCase())amSurpresa();if(cb)cb(j)})};"
troca(ancora, ancora + '\n' + bl)
io.open(JS, 'w', encoding='utf8').write(t)
# CSS no index.html
H = SITE + 'index.html'
h = io.open(H, encoding='utf8').read()
css = io.open('/home/claude/lafouch/work/s409/estilo.css', encoding='utf8').read()
if '<style id="s409">' not in h:
    assert h.count('</head>') == 1
    h = h.replace('</head>', '<style id="s409">' + css + '</style>\n</head>')
io.open(H, 'w', encoding='utf8').write(h)
print('ok', len(t))
