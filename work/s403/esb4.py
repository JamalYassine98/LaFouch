# S403 · esboço 69d (menu: entrada da conta do Cliente VIP, sutil). Pedido do dono 17/11 10:46. Nada implementado.
E=open('esb2.py').read();exec(E[:E.index('with sync_playwright')])
ABRE="()=>{document.querySelector('.top .ib').click()}"
MV="""()=>{const v=document.getElementById('dav');v.style.boxShadow='0 0 0 2px #fbf7fa,0 0 0 3.5px #b8935a';document.getElementById('dacs').innerHTML='<em style="display:inline!important;font-style:normal;color:#8a6a33;font-weight:600">✦ Cliente VIP</em> · Minha conta ›'}"""
with sync_playwright() as pw:
    par('m',lambda:comum2.site(pw),[MV],844,prep=ABRE)
P('69d-site-menu-conta-vip.jpg','Esboço 69d · Site · Menu · entrada da conta do Cliente VIP',['Hoje: "Olá, María · Minha conta · Meus pedidos ›", igual para todos.','Proposta: no mesmo lugar, um fio dourado em volta da letra e "✦ Cliente VIP" em dourado no começo da linha de baixo. Sem cartão e sem entrada nova no menu.'],T+'m_h.png',T+'m_p.png')
