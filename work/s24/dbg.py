from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
    pg.on('console',lambda m: print('C:',m.text) if 'DBG' in m.text else None)
    pg.add_init_script("addEventListener('popstate',e=>console.log('DBG pop',JSON.stringify(e.state),location.pathname),true)")
    pg.goto('http://localhost:8767/');pg.wait_for_timeout(2500)
    pg.evaluate("document.querySelector('#sbtn,[aria-label=Buscar]').click()");pg.wait_for_timeout(800)
    pg.evaluate("(()=>{var i=document.querySelector('#sov input');i.value='leitura';i.dispatchEvent(new Event('input',{bubbles:true}))})()");pg.wait_for_timeout(800)
    pg.evaluate("document.querySelector('#sov [data-open]').click()");pg.wait_for_timeout(1500)
    print(pg.evaluate("[history.length,JSON.stringify(history.state)]"))
    pg.go_back();pg.wait_for_timeout(1500)
    print(pg.evaluate("[location.pathname,document.getElementById('sov').className,JSON.stringify(history.state)]"))
