# simula o celular do dono: index.html ANTIGO (o da v532, antes do Pagamento de luxo) com o app.js e o style.css novos
import sys,subprocess,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,kit
from playwright.sync_api import sync_playwright
velho=subprocess.run(['git','show','HEAD~1:www/index.html'],cwd='/home/claude/lafouch',capture_output=True,text=True).stdout
print('index antigo tem nav no formaChips:', 'class="nav" id="formaChips"' in velho)
TOCA="rx=>{const b=[...document.querySelectorAll('button')].filter(e=>e.offsetParent&&new RegExp(rx).test(e.innerText.trim())).pop();if(!b)return 'sem';b.click();return 1}"
with sync_playwright() as pw:
    W,H,TQ,dpr=ap.TAM['celular'];b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=dpr,is_mobile=True,has_touch=True,color_scheme='dark',service_workers='block')
    c.route('**/index.html*',lambda r:r.fulfill(body=velho,content_type='text/html'))
    pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)));pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=15000);pg.wait_for_timeout(1000)
    pg.evaluate("()=>window.__LF.setView('vendas')");pg.wait_for_timeout(800);pg.evaluate("()=>document.querySelector('#vRows .pcard[data-ref]').click()");pg.wait_for_timeout(1200);pg.evaluate(TOCA,'^Vender');pg.wait_for_timeout(1500)
    print(pg.evaluate("()=>{const q=s=>document.querySelector(s);const r=e=>{const x=e.getBoundingClientRect();return [Math.round(x.width),Math.round(x.height)]};return {forma:q('#formaChips').className,th:r(q('#formaChips .trkTh')),thM:r(q('#moedas .trkTh')),cliDepois:!!(q('#recIn').compareDocumentPosition(q('#cliPickB'))&4),mais:!!q('#pagMais')&&q('#pagMais').offsetParent!==null,tx:!!q('#formaTx')}}"),er)
    pg.screenshot(path='/tmp/gt/velho.png');b.close()
