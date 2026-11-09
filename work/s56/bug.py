from playwright.sync_api import sync_playwright
exec(open('/home/claude/lafouch-projeto/work/s46/nav.py').read().split('CEN=')[0])
# o que está por cima de cada botão da ajuda do grau, e se o fundo aparece
J="""()=>{const g=document.getElementById('gw');if(!g)return 'SEM TELA';const r=g.getBoundingClientRect();const cs=getComputedStyle(g);
 const bs=[...g.querySelectorAll('button')].filter(b=>b.offsetWidth).map(b=>{const q=b.getBoundingClientRect(),x=q.left+q.width/2,y=q.top+q.height/2,e=document.elementFromPoint(x,y);return (b.dataset.gz||b.className)+':'+(e&&(b===e||b.contains(e))?'ok':'TAPADO por '+(e?(e.id||e.className||e.tagName):'nada'))});
 const veu=[...document.body.children].filter(e=>e.style&&/2147483000/.test(e.style.zIndex)).length;
 return 'top='+Math.round(r.top)+' h='+Math.round(r.height)+' bg='+cs.backgroundColor+' op='+cs.opacity+' veus='+veu+' scrollY='+Math.round(scrollY)+' | '+bs.join(' ')}"""
CEN=[('Início→menu→grau',[M,item('Descubra o seu grau')]),
 ('Catálogo→menu→grau',["document.querySelector('a[href=\"#vitrine\"]').click()",M,item('Descubra o seu grau')]),
 ('Peça→menu→grau',["document.querySelector(\"[data-open='GR3340']\").click()",M,item('Descubra o seu grau')]),
 ('Início rolado→menu→grau',["scrollTo(0,900)",M,item('Descubra o seu grau')]),
 ('grau→menu→grau',[M,item('Descubra o seu grau'),M,item('Descubra o seu grau')]),
]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for nome,acts in CEN:
        for vel in [1200,150]:
            pg=b.new_page(viewport={'width':360,'height':600},is_mobile=True,has_touch=True,locale='pt-BR');pg.on('pageerror',lambda e:print('ERR',e))
            pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
            for a in acts:
                try: pg.evaluate(a)
                except Exception as e: print('  falhou',a[:30],str(e)[:60])
                pg.wait_for_timeout(vel)
            pg.wait_for_timeout(1500)
            print(nome,'(rápido)' if vel<500 else '','→',pg.evaluate(J))
            pg.screenshot(path='/home/claude/lafouch-projeto/work/s56/b_%s_%d.png'%(nome.replace('→','-').replace(' ',''),vel))
            pg.close()
