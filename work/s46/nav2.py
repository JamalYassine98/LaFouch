from playwright.sync_api import sync_playwright
W="""()=>{const L=document.getElementById('layer');const pop=[...document.querySelectorAll('.sec.pop')].map(e=>e.id).join(',');return location.pathname+' | '+(L&&L.innerHTML.trim()?'peça':'')+' painel:'+pop+(document.getElementById('gw')?' AJUDA':'')+(document.getElementById('drw').classList.contains('on')?' MENU':'')+' back:'+(([...document.querySelectorAll('.sec.pop [data-vback], .sec.pop .ajbk, .sec.pop .pbar button, #gw .gzbk')].map(e=>e.innerText.trim()).filter(Boolean)[0])||'—')}"""
M="document.querySelector('[data-dopen],#mbtn,.bar [aria-label*=enu]').click()"
def item(t): return "[...document.querySelectorAll('#drw nav a')].find(a=>a.textContent.trim().startsWith('%s')).click()"%t
CEN=[('Peça→menu→Leitura',["document.querySelector(\"[data-open='GR3340']\").click()",M,item('Leitura')]),('Catálogo→peça→menu→grau',["document.querySelector('a[href=\"#vitrine\"]').click()","document.querySelector(\"#grid [data-open]\").click()",M,item('Descubra o seu grau')]),('grau→menu→Atacado',[M,item('Descubra o seu grau'),M,item('Atacado')]),
#('Início→menu→Atacado',[M,item('Atacado')]),
 ('Catálogo→menu→Atacado',["document.querySelector('a[href=\"#vitrine\"]').click()",M,item('Atacado')]),
 ('Catálogo→menu→Como comprar',["document.querySelector('a[href=\"#vitrine\"]').click()",M,item('Como comprar')]),
 ('Início→menu→Leitura→menu→Atacado',[M,item('Leitura'),M,item('Atacado')]),
 ('Peça→menu→Atacado',["document.querySelector(\"[data-open='GR3340']\").click()",M,item('Atacado')]),
 ('Catálogo→Peça→menu→Atacado',["document.querySelector('a[href=\"#vitrine\"]').click()","document.querySelector(\"#grid [data-open]\").click()",M,item('Atacado')]),
 ('Início→menu→Descubra o seu grau',[M,item('Descubra o seu grau')]),
 ('Catálogo→menu→Descubra o seu formato',["document.querySelector('a[href=\"#vitrine\"]').click()",M,item('Descubra o seu formato')]),
]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for nome,acts in CEN:
        pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
        for a in acts: pg.evaluate(a);pg.wait_for_timeout(1100)
        out=['  na tela: '+pg.evaluate(W)]
        for k in range(3):
            try: pg.go_back(timeout=2500);pg.wait_for_timeout(1000);out.append('  voltar %d: '%(k+1)+pg.evaluate(W))
            except Exception: out.append('  voltar %d: SAIU DO SITE'%(k+1));break
        print('##',nome);print('\n'.join(out));pg.close()
