from playwright.sync_api import sync_playwright
J="""()=>{window.__hid=0;window.__max=0;var f=()=>{var n=[...document.querySelectorAll('img.lfq0')].filter(i=>{var r=i.getBoundingClientRect();return r.width>0&&r.bottom>0&&r.top<innerHeight}).length;if(n>window.__max)window.__max=n;if(n)window.__hid++;requestAnimationFrame(f)};f()}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,locale='pt-BR');pg=ctx.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)))
    pg.goto('http://localhost:8768/?sim=2');pg.wait_for_timeout(3500)
    pg.reload();pg.evaluate(J);pg.wait_for_timeout(600);a=pg.evaluate("[window.__hid,window.__max]")
    pg.evaluate("window.__hid=0;window.__max=0");pg.wait_for_timeout(2500);b2=pg.evaluate("[window.__hid,window.__max]")
    print('1º recarregar: quadros com foto escondida',a,'| depois que a nuvem troca o endereço',b2,'| fotos em blob',pg.evaluate("[...document.querySelectorAll('#home img')].filter(i=>/^blob/.test(i.src)).length"),er)
