# S408 · esboços 77a–77d (17/11 13:12, estratégia do presente aprovada): presente só depois da peça paga, lista até o valor dela,
# OFERTA não libera mas pode ser presente, VIP com "Só para VIP" no topo e presente até 20% mais caro. Site real (cópia do kit), celular. Nada implementado.
E=open('/home/claude/lafouch/work/s407/esb3.py').read();exec(E[:E.index('with sync_'+'playwright() as pw')])
comum.OUT='/home/claude/lafouch/work/s408/';T='/tmp/s408/'
CSS+=""".gsel{margin:-6px 4px 14px;font:13.5px/1.5 Inter,system-ui,sans-serif;color:#6b5f66}.gsel b{color:#1d1418}
.vsec{margin:0 0 8px}.vsec h4{font:500 20px Fraunces,Georgia,serif;color:#1d1418;margin:0 4px 4px}.vsec h4 i{font-style:normal;color:#a9854a;margin-right:6px}.vsec p{font:13px/1.5 Inter,system-ui,sans-serif;color:#6b5f66;margin:0 4px 10px}
.vg{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}.vip1{position:absolute;top:8px;left:8px;z-index:3;padding:4px 9px;border-radius:999px;background:#17121a;border:1px solid rgba(214,178,116,.7);color:#e9d3a6;font:600 12px Inter,system-ui,sans-serif;letter-spacing:.06em}
.gh{font:500 20px Fraunces,Georgia,serif;color:#1d1418;margin:6px 4px 4px}"""
# aba Exclusivo no modo presente, com a lista ajustada à peça paga (lim), OFERTA marcada; VIP: seção "Só para VIP" no topo
GIFTTAB="""(o)=>{const g=document.getElementById('grid');const hdr=document.querySelector('.exh');const ex=document.querySelector('.exo');if(ex)ex.innerHTML=o.txt;ex.className='gsel';
 [...g.querySelectorAll('.card')].forEach(c=>{const p=c.querySelector('.pr');const m=/([\\d.]+)/.exec(c.dataset.pz||'');const v=+(c.dataset.pz||0);if(!v){c.style.display='none';return}if(v>o.lim){c.style.display='none';return}p.innerHTML='<span class="gp">✦ De presente</span>'});
 if(o.vip){const s=document.createElement('div');s.className='vsec';s.innerHTML='<h4><i>✦</i>Só para VIP</h4><p>Chegaram agora; para todos, em 2 dias.</p>';const vg=document.createElement('div');vg.className='vg';
  [...g.querySelectorAll('.card')].slice(0,2).forEach(c=>{const k=c.cloneNode(true);k.style.display='';k.querySelector('.pr').textContent=c.dataset.pt;k.querySelectorAll('.fav,[data-fav]').forEach(x=>x.remove());k.style.position='relative';const t=document.createElement('span');t.className='vip1';t.textContent='✦ Só para VIP';k.appendChild(t);vg.appendChild(k)});
  s.appendChild(vg);const h=document.createElement('div');h.className='gh';h.textContent='Seu presente';s.appendChild(h);hdr.after(s)}const bd=document.querySelector('.top .bd,#bagbtn .n,#bagbtn b');if(bd)bd.textContent='1'}"""
# antes de trocar os preços, guarda o preço de cada card
PRECOS="()=>{[...document.querySelectorAll('#grid .card')].forEach(c=>{const p=c.querySelector('.pr');if(!p)return;const t=p.textContent.trim();const m=/R\\$\\s*([\\d.]+)/.exec(t);c.dataset.pt=t;c.dataset.pz=m?m[1].replace(/\\./g,''):''})}"
TOPO="()=>{const h=document.querySelector('.exh');const sc=document.getElementById('vscr');h.scrollIntoView({block:'start'});const hb=document.querySelector('.top').getBoundingClientRect().bottom;const fl=hb+18-h.getBoundingClientRect().top;if(sc)sc.scrollTop-=fl;window.scrollBy(0,-Math.max(0,hb+18-h.getBoundingClientRect().top))}"
# carrinho só com peça em OFERTA
OF="""()=>{const c=document.querySelector('#layer .ci');c.querySelector('.cit small').textContent='KIT3C · OFERTA';const cf=document.querySelector('#layer .cupf');const d=document.createElement('div');d.className='exc';d.innerHTML='<span style="color:#6b5f66"><i>✦</i>Você tem um presente especial</span>';cf.parentNode.insertBefore(d,cf);cf.remove();
 const n=document.createElement('p');n.className='exn';n.textContent='O presente vale na compra de uma peça fora da OFERTA. Ele continua guardado.';document.querySelector('#layer .cl').appendChild(n)}"""
# trocou a peça paga por uma mais barata: o presente sai, com aviso
SAI="""()=>{const c=document.querySelector('#layer .ci');const pc=[...document.querySelectorAll('#grid .card')].find(x=>/AC1055/.test(x.textContent));if(pc)c.querySelector('img').src=pc.querySelector('img').currentSrc||pc.querySelector('img').src;c.querySelector('.cit small').textContent='AC1055';c.querySelector('.cit b').textContent='Armação acetato redonda';c.querySelector('.pu').textContent='R$ 75 por unidade';c.querySelector('.cis .pr').textContent='R$ 75';
 const x=document.querySelector('#layer .exc');x.innerHTML='<span><i>✦</i>Você tem um presente especial</span><button type="button" class="tr">Escolher</button>';const n=document.createElement('p');n.className='exn';n.innerHTML='A peça de presente SL2210 saiu do carrinho: o presente vale até o valor do óculos que você compra (R$ 75). <a href="#">Escolher outro presente ›</a>';document.querySelector('#layer .cl').appendChild(n);const t=document.querySelector('#layer .cs-t b');if(t)t.textContent='R$ 75'}"""
def tab(o):
    def f():
        b,pg,w=site(pw);pg.evaluate(VIT);w(1600);pg.evaluate(PRECOS);pg.evaluate(ABA2,2);w(300);pg.evaluate(GIFTTAB,o);w(400);pg.set_viewport_size({'width':390,'height':1300});w(300);pg.evaluate(TOPO);w(300);return b,pg,w
    return f
def hoje_tab():
    b,pg,w=site(pw);pg.evaluate(VIT);w(1600);pg.evaluate(ABA2,2);w(300);pg.set_viewport_size({'width':390,'height':1300});w(300);pg.evaluate(TOPO);w(300);return b,pg,w
with sync_playwright() as pw:
    b,pg,w=hoje_tab();oh=comum.olho(pg);pg.screenshot(path=T+'b_h.png');b.close()
    b,pg,w=tab({'lim':100,'vip':0,'txt':'Escolha 1 presente <b>até R$ 100</b>, o valor do óculos no seu carrinho. Peças em OFERTA também podem ser presente.'})();op=comum.olho(pg);pg.screenshot(path=T+'b_p.png');b.close();print('77b falhas novas:',sorted(op-oh)[:4])
    b,pg,w=tab({'lim':120,'vip':1,'txt':'Como Cliente VIP, o seu presente pode valer <b>até R$ 120</b> (20% a mais que o óculos no seu carrinho).'})();op=comum.olho(pg);pg.screenshot(path=T+'c_p.png');b.close();print('77c falhas novas:',sorted(op-oh)[:4])
    b,pg,w=carrinho(pw);pg.add_style_tag(content=CSS);pg.set_viewport_size({'width':390,'height':844});w(300);oh=comum.olho(pg);pg.screenshot(path=T+'a_h.png');pg.evaluate(OF);w(400);op=comum.olho(pg);pg.screenshot(path=T+'a_p.png');b.close();print('77a falhas novas:',sorted(op-oh)[:4])
    b,pg,w=carrinho(pw);pg.add_style_tag(content=CSS);pg.set_viewport_size({'width':390,'height':844});w(300)
    for d in [GIFT,APR,VCL]: pg.evaluate(d[0],d[1]) if isinstance(d,tuple) else pg.evaluate(d);w(300)
    pg.evaluate(GR);w(300);oh=comum.olho(pg);pg.screenshot(path=T+'d_h.png');pg.evaluate("()=>{const c=[...document.querySelectorAll('#layer .ci')];c[1].remove();const cn=document.querySelector('#layer .cn');if(cn)cn.textContent='· 1 item'}");pg.evaluate(SAI);w(400);op=comum.olho(pg);pg.screenshot(path=T+'d_p.png');b.close();print('77d falhas novas:',sorted(op-oh)[:4])
import shutil;shutil.copy(T+'b_h.png',T+'c_h.png')
P=comum.prancha
P('77a-site-carrinho-so-oferta-presente.jpg','Esboço 77a · Site · Carrinho · só peça em OFERTA',['Hoje: nada diz quando o presente pode ser usado.','Proposta: peça em OFERTA não libera o presente. A linha mostra que ele existe (sem botão) e o aviso explica; o presente continua guardado.'],T+'a_h.png',T+'a_p.png')
P('77b-site-exclusivo-presente-ate-o-valor.jpg','Esboço 77b · Site · Aba Exclusivo · presentes até o valor do óculos pago',['Antes (71d/66d): todas as peças apareciam como presente.','Proposta: depois que o óculos pago está no carrinho, só aparecem peças de valor até o dele (aqui, R$ 100), dentro do piso. Peças em OFERTA também podem ser presente.'],T+'b_h.png',T+'b_p.png')
P('77c-site-exclusivo-vip-presente.jpg','Esboço 77c · Site · Aba Exclusivo do Cliente VIP',['Antes: a mesma aba para todos.','Proposta: para o VIP, "Só para VIP" no topo (novidades 48 h antes); embaixo, o presente pode valer até 20% a mais que o óculos pago (aqui, até R$ 120), sempre dentro do piso.'],T+'c_h.png',T+'c_p.png')
comum.ROT=('COM O PRESENTE','TROCOU POR UM ÓCULOS MAIS BARATO');comum.prancha2('77d-site-carrinho-presente-sai.jpg','Esboço 77d · Site · Carrinho · o óculos pago ficou mais barato que o presente',['O cliente trocou o óculos pago (R$ 100) por um de R$ 75; o presente (R$ 95) passou do limite.','A peça de presente sai do carrinho com um aviso claro e o link para escolher outro presente; o presente continua guardado. Valores de exemplo.'],T+'d_h.png',T+'d_p.png')
