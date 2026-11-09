from playwright.sync_api import sync_playwright
exec(open('s46/nav.py').read().split('CEN=')[0])
V="document.querySelector('.sec.pop [data-vback]').click()"
LOGO="document.querySelector('.top .logo').click()"
BK="history.back()"
CEN=[('Formato→‹Início→menu→grau',[M,item('Descubra o seu formato'),V,M,item('Descubra o seu grau')]),
 ('Formato→logo→menu→grau',[M,item('Descubra o seu formato'),LOGO,M,item('Descubra o seu grau')]),
 ('Formato→voltar→menu→grau',[M,item('Descubra o seu formato'),BK,M,item('Descubra o seu grau')]),
 ('Formato→menu→grau',[M,item('Descubra o seu formato'),M,item('Descubra o seu grau')]),
 ('menu→Como comprar',[M,item('Como comprar')]),
 ('menu→Dúvidas',[M,item('Dúvidas')]),
 ('menu→Guia',[M,item('Guia')]),
]
J="""()=>{const pop=[...document.querySelectorAll('.sec.pop')].map(e=>e.id).join(',');const bks=[...document.querySelectorAll('.sec.pop [data-vback], .sec.pop .ajbk, .sec.pop .rzb, #gw .gzbk')].filter(e=>e.offsetWidth>0).map(e=>e.className.split(' ').pop()+':'+e.innerText.trim());return location.pathname+' painel:'+pop+(document.getElementById('gw')?' AJUDA':'')+' botões:'+JSON.stringify(bks)}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for nome,acts in CEN:
        pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');pg.on('pageerror',lambda e:print('ERR',e))
        pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
        print('##',nome)
        for a in acts:
            try: pg.evaluate(a)
            except Exception as e: print('  falhou',a[:40],str(e)[:80])
            pg.wait_for_timeout(1200)
        print('  ',pg.evaluate(J))
        pg.close()
