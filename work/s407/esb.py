# S407 · esboços 74a–74c (pedido do dono 17/11 12:36): como o cartão entra no carrinho e como TROCAR de cartão no carrinho. Site real (cópia do kit), celular; só injeta o que muda. Nada implementado.
E=open('/home/claude/lafouch/work/s405/esb.py').read();exec(E[:E.index('def par3(')])
comum.OUT='/home/claude/lafouch/work/s407/';T='/tmp/s407/'
CSS+="""#layer .exc{margin:-8px 0 -6px}.exc .tr{min-height:44px;padding:0 0 0 14px;border:0;background:none;color:#8d3a69;font:600 14px Inter,system-ui,sans-serif;text-decoration:underline}
.shb{position:fixed;inset:0;background:rgba(29,20,24,.42);z-index:9998}.sh{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#fff;border-radius:22px 22px 0 0;padding:10px 18px 20px;box-shadow:0 -10px 30px rgba(0,0,0,.12)}
.sh .gr{width:40px;height:5px;border-radius:9px;background:#e3d7dd;margin:0 auto 12px}.sh h3{font:500 22px Fraunces,Georgia,serif;color:#1d1418;margin:0 0 4px}.sh>p{font:13.5px/1.5 Inter,system-ui,sans-serif;color:#6b5f66;margin:0 0 12px}
.sh label{display:flex;align-items:center;gap:12px;min-height:60px;padding:8px 12px;border:1px solid #eee3e8;border-radius:14px;margin:0 0 8px}.sh label.on{border:2px solid #8d3a69;padding:7px 11px}
.sh .ch{flex:none;width:46px;height:30px;border-radius:6px;border:1px solid rgba(214,178,116,.6)}.sh .v{background:linear-gradient(135deg,#55234a,#1f0d1a)}.sh .p{background:linear-gradient(135deg,#2b2330,#0c090e)}.sh .z{background:#f6eff2;border:1px dashed #cdb9c5}
.sh .tx{flex:1;min-width:0}.sh .tx b{display:block;font:600 14.5px Inter,system-ui,sans-serif;color:#1d1418}.sh .tx small{display:block;font:12.5px/1.4 Inter,system-ui,sans-serif;color:#6b5f66;margin-top:2px}.sh .tx em{font-style:normal;display:inline-block;margin-left:6px;padding:1px 7px;border-radius:99px;background:#f3ece0;color:#7a5a2a;font:600 11.5px Inter,system-ui,sans-serif;vertical-align:1px}
.sh .vl{flex:none;font:600 14.5px Inter,system-ui,sans-serif;color:#1f8f4e}.sh .rd{flex:none;width:20px;height:20px;border-radius:50%;border:2px solid #cdb9c5;box-sizing:border-box}.sh label.on .rd{border:6px solid #8d3a69}
.sh .ok{display:block;width:100%;min-height:50px;margin-top:6px;border:0;border-radius:999px;background:#8d3a69;color:#fff;font:600 16px Inter,system-ui,sans-serif}"""
AP="""(o)=>{const c=document.querySelector('#layer .cupf');const d=document.createElement('div');d.className='exc';d.innerHTML='<span><i>✦</i>'+o.t+'</span><span style="display:flex;align-items:center"><span style="font-weight:600;color:#1f8f4e">'+o.v+'</span><button type="button" class="tr">Trocar</button></span>';if(c){c.parentNode.insertBefore(d,c);c.remove()}else{const x=document.querySelector('#layer .exc');x.replaceWith(d)}const t=document.querySelector('#layer .cs-t b');if(t)t.textContent=o.tot}"""
SH="""()=>{const b=document.createElement('div');b.className='shb';document.body.appendChild(b);const s=document.createElement('div');s.className='sh';
 const r=(cls,ch,t,sm,v,on,tag)=>'<label class="'+(on?'on':'')+'"><span class="ch '+ch+'"></span><span class="tx"><b>'+t+(tag?'<em>'+tag+'</em>':'')+'</b><small>'+sm+'</small></span><span class="vl">'+v+'</span><span class="rd"></span></label>';
 s.innerHTML='<div class="gr"></div><h3>Cartão desta compra</h3><p>Vale um cartão por compra. Os outros continuam guardados para a próxima.</p>'+
  r('','v','Cartão presente 15%','até 14/03/2027','− R$ 15',0,'Maior desconto')+r('','v','Cartão presente 10%','vence primeiro, em 02/02','− R$ 10',1,'')+r('','p','Presente especial','leve outro óculos','Escolher peça',0,'')+r('','z','Não usar cartão agora','todos ficam guardados','',0,'')+'<button type="button" class="ok">Usar este cartão</button>';
 document.body.appendChild(s)}"""
SEL="()=>{const l=[...document.querySelectorAll('.sh label')];l.forEach(x=>x.classList.remove('on'));l[0].classList.add('on')}"
def par4(nome,depois,H=844):
    b,pg,w=carrinho(pw);pg.add_style_tag(content=CSS);pg.set_viewport_size({'width':390,'height':H});w(300);oh=comum.olho(pg);pg.screenshot(path=T+nome+'_h.png')
    for d in depois: pg.evaluate(d[0],d[1]) if isinstance(d,tuple) else pg.evaluate(d);w(400)
    op=comum.olho(pg);pg.screenshot(path=T+nome+'_p.png');b.close();print(nome,'falhas novas:',sorted(op-oh)[:5])
with sync_playwright() as pw:
    par4('a',[(AP,{'t':'Cartão de 10% aplicado','v':'− R$ 10','tot':'R$ 90'})])
    par4('b',[(AP,{'t':'Cartão de 10% aplicado','v':'− R$ 10','tot':'R$ 90'}),SH,SEL])
    par4('c',[(AP,{'t':'Cartão de 15% aplicado','v':'− R$ 15','tot':'R$ 85'})])
P=comum.prancha
import shutil;shutil.copy(T+'a_p.png',T+'b_h.png');shutil.copy(T+'b_p.png',T+'c_h.png')
P('74a-site-carrinho-cartao-aplicado-trocar.jpg','Esboço 74a · Site · Carrinho · cartão aplicado, com "Trocar"',['Hoje: "Tem um código?" — o cliente digita o código.','Proposta: o cartão entra sozinho (veio da Exclusivo) ou com um toque em "Usar" (65e). Na linha do desconto, "Trocar" abre a escolha do cartão.'],T+'a_h.png',T+'a_p.png')
comum.ROT=('ANTES DO TOQUE','DEPOIS DE "TROCAR"');comum.prancha2('74b-site-carrinho-escolher-cartao.jpg','Esboço 74b · Site · Carrinho · escolher o cartão desta compra',['Abre uma folha por baixo, sem sair do carrinho. Cada cartão mostra quanto desconta NESTA compra; o maior vem primeiro, marcado "Maior desconto".','Também dá para escolher o presente especial ou não usar cartão agora (todos ficam guardados). Vale um cartão por compra.'],T+'b_h.png',T+'b_p.png')
comum.ROT=('ESCOLHENDO','DEPOIS DE "USAR ESTE CARTÃO"');comum.prancha2('74c-site-carrinho-cartao-trocado.jpg','Esboço 74c · Site · Carrinho · cartão trocado',['O carrinho volta com o cartão novo e o total já atualizado.','O cartão de 10% volta a ficar guardado e aparece em Minha conta › Cartões. Valores de exemplo.'],T+'c_h.png',T+'c_p.png')
