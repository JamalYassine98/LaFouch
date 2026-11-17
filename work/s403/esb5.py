# S403 · esboços 70a–70e (pedido do dono 17/11 10:57): nome embaixo de "Minha conta" para todos; menu do VIP sem perder "Meus pedidos";
# reserva do VIP sem a linha que tira a atenção; reserva cancelada que abre para baixo (quadros da animação). Nada implementado.
E=open('esb2.py').read();exec(E[:E.index('with sync_'+'playwright() as pw')])
from PIL import Image,ImageDraw
NOME="""(a)=>{const h=[...document.querySelectorAll('#layer h1,#layer h2,#layer h3')].find(e=>/Minha conta/.test(e.textContent));const p=document.createElement('p');p.style.cssText='margin:-4px 0 14px;font:500 14px Inter,system-ui,sans-serif;color:#6b5f66';p.innerHTML=a[0]+(a[1]?'<span style="color:#a9854a;margin:0 6px">·</span><span style="color:#8a6a33;font-weight:600">✦ Cliente VIP</span>':'');const par=h.parentNode;if(getComputedStyle(par).display.includes('flex'))par.parentNode.insertBefore(p,par.nextSibling);else h.parentNode.insertBefore(p,h.nextSibling)}"""
COMUM={'ok':True,'guardados':0,'indicacoes':0,'nome':'María González','cupons':[{'cod':'LF-7K2M','tipo':'px','pct':10,'estado':'ok','fim':1805000000000,'usado':False,'nome':'María González','max':1}]}
ABRE="()=>{document.querySelector('.top .ib').click()}"
MV="""()=>{const v=document.getElementById('dav');v.style.boxShadow='0 0 0 2px #fbf7fa,0 0 0 3.5px #b8935a';document.getElementById('dacn').innerHTML='Olá, María <em style="display:inline!important;font:600 13px Inter,system-ui,sans-serif;font-style:normal;color:#8a6a33;margin-left:6px;vertical-align:1px">✦ Cliente VIP</em>'}"""
R3="""()=>{const c=document.getElementById('cdx');c.innerHTML='<span><em style="font-style:normal;color:#a9854a;margin-right:6px">✦</em>Reserva VIP até</span><span class="zk"><b>13:40</b></span>';const f=c.nextElementSibling;if(f&&f.classList.contains('zf'))f.remove()}"""
CAN="""(k)=>{const e=document.querySelector('[data-id=kitped1]');const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(/Pedido cancelado/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace('Pedido cancelado','Reserva cancelada')}
 e.style.flexWrap='wrap';e.style.position='relative';const d=document.createElement('div');d.style.cssText='flex-basis:100%;overflow:hidden';
 d.innerHTML='<div style="border-top:1px solid #eee6ea;margin-top:12px;padding-top:10px;font:13.5px/1.55 Inter,system-ui,sans-serif;color:#6b5f66">A reserva terminou antes do pagamento. Nada foi cobrado e as peças voltaram para o site.<div style="margin-top:8px"><a href="#" style="display:inline-flex;align-items:center;min-height:44px;color:#8d3a69;font-weight:600;text-decoration:underline">Ver as peças ›</a></div></div>';
 e.appendChild(d);const H=d.scrollHeight;const ez=t=>1-Math.pow(1-t,3);d.style.height=(H*ez(k))+'px';d.firstChild.style.opacity=Math.max(0,(k-.25)/.75);d.firstChild.style.transform='translateY('+(-8*(1-ez(k)))+'px)';
 const ch=document.createElement('span');ch.textContent='›';ch.style.cssText='position:absolute;right:16px;top:44px;font:22px Inter,system-ui,sans-serif;color:#8a7d84;transform:rotate('+(90*ez(k))+'deg)';e.appendChild(ch)}"""
def par2(nome,abre,depois,H=844,prep=None):
    res=[]
    for k in (0,1):
        b,pg,w=abre();pg.add_style_tag(content=NOAN+CSS);w(300)
        if prep: pg.evaluate(prep);w(700)
        if k:
            for d in depois: pg.evaluate(d[0],d[1]) if isinstance(d,tuple) else pg.evaluate(d);w(400)
        pg.set_viewport_size({'width':390,'height':H});w(400);res.append(comum.olho(pg));pg.screenshot(path=T+nome+('_p' if k else '_h')+'.png');b.close()
    print(nome,'falhas novas:',sorted(res[1]-res[0])[:4])
def quadros(pw,ks):
    fs=[]
    for i,k in enumerate(ks):
        b,pg,w=pago.abre(pw,'pedidos','cancelado');pg.add_style_tag(content=NOAN+CSS);w(300);pg.evaluate(CAN,k);w(300)
        r=pg.evaluate("()=>{const e=document.querySelector('[data-id=kitped1]').getBoundingClientRect();return [e.left,e.top,e.width,e.height]}")
        f=T+'q%d.png'%i;pg.screenshot(path=f,clip={'x':0,'y':r[1]-14,'width':390,'height':240});fs.append(f)
        if k==1: o=comum.olho(pg)
        if k==0: o0=comum.olho(pg)
        b.close()
    print('quadros falhas novas (aberto vs fechado):',sorted(o-o0)[:4]);return fs
with sync_playwright() as pw:
    par2('na',cart(COMUM),[(NOME,['María González',0])],900)
    par2('mv',lambda:comum2.site(pw),[MV],844,prep=ABRE)
    par2('rv',lambda:pag.abre(pw,'pix',0.2),[R3],844,prep=VCX)
    par2('kc',lambda:pago.abre(pw,'pedidos','cancelado'),[(CAN,0)],844)
    Q=quadros(pw,[0,.35,.7,1])
P('70a-site-minha-conta-nome-do-cliente.jpg','Esboço 70a · Site · Minha conta · nome do cliente (todos)',['Hoje: só o título "Minha conta".','Proposta: o nome do cliente embaixo de "Minha conta", para todos, do mesmo jeito do 69a. Quem não é VIP vê só o nome (aqui); o VIP vê o nome e "✦ Cliente VIP" (69a).'],T+'na_h.png',T+'na_p.png')
P('70b-site-menu-conta-vip.jpg','Esboço 70b · Site · Menu · conta do Cliente VIP (refaz o 69d)',['Hoje: "Olá, María" e "Minha conta · Meus pedidos ›".','Proposta: "Meus pedidos" continua; o "✦ Cliente VIP" pequeno, em dourado, vai ao lado do nome, e um fio dourado envolve a letra.'],T+'mv_h.png',T+'mv_p.png')
P('70c-site-pagamento-reserva-vip.jpg','Esboço 70c · Site · Pagamento · reserva do VIP (refaz o 69b)',['Hoje: "Reservada para você por" com o relógio de 30 minutos.','Proposta: sai a linha extra que tirava a atenção do pagamento. Na própria linha da reserva: "✦ Reserva VIP até 13:40". O botão do PIX continua o destaque da tela.'],T+'rv_h.png',T+'rv_p.png')
P('70d-site-pedidos-reserva-cancelada.jpg','Esboço 70d · Site · Minha conta › Pedidos · reserva cancelada, fechada (refaz o 69c)',['Hoje: "Pedido cancelado".','Proposta: a linha fica limpa — só "Reserva cancelada" e uma setinha. Os detalhes aparecem quando o cliente toca (quadros no 70e).'],T+'kc_h.png',T+'kc_p.png')
# 70e: quadros da animação lado a lado (sem GIF)
ims=[Image.open(f).convert('RGB') for f in Q];w,h=ims[0].size;g=30;S=Image.new('RGB',(g+len(ims)*(w+g),h+250),'#f1eef0');d=ImageDraw.Draw(S)
d.text((g,26),'Esboço 70e · Site · Pedidos · tocar na reserva cancelada abre para baixo',font=comum.F(34,True),fill='#1d1418')
d.text((g,80),'Quadros a 0 · 0,12 · 0,24 · 0,35 s. A caixa cresce com uma curva suave (começa rápido e desacelera, como no iPhone); o texto aparece',font=comum.F(22),fill='#55484f')
d.text((g,110),'devagar, descendo 8 px, e a setinha gira para baixo. Tocar de novo fecha do mesmo jeito. Quem pediu menos movimento no aparelho vê abrir sem animação.',font=comum.F(22),fill='#55484f')
for i,(im,r) in enumerate(zip(ims,['FECHADO','ABRINDO','QUASE','ABERTO'])):
    x=g+i*(w+g);d.text((x,170),r,font=comum.F(26,True),fill='#8d3a69' if i==3 else '#1d1418');S.paste(im,(x,214));d.rectangle([x-1,213,x+w,214+h],outline='#cfc6cb')
S.save(comum.OUT+'70e-site-pedidos-reserva-cancelada-abrindo.jpg',quality=88);print(S.size)
