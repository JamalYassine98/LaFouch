import subprocess,sys,time
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8807','-d','/home/claude/lafouch/www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();pg.goto('http://localhost:8807/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(700)
    for v in ('vendas','estoque','dia','caixa','ped','clientes','notif','inicio'):
        pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(700)
        print('==',v,pg.evaluate("""v=>{const e=document.querySelector('#v-'+v);const t=e.querySelector('.top')||e.firstElementChild;const kids=[...e.children].slice(0,7).map(k=>k.tagName+(k.id?'#'+k.id:'')+'.'+String(k.className).split(' ').slice(0,2).join('.')+'['+k.children.length+']');return (t?t.outerHTML.replace(/<svg[\\s\\S]*?<\\/svg>/g,'<svg/>').slice(0,420):'')+'\\n   FILHOS '+kids.join(' | ')}""",v))
    print(pg.evaluate("""()=>{const e=document.querySelector('#v-inicio');return [...e.querySelectorAll('*')].filter(k=>getComputedStyle(k).display=='grid').map(k=>k.tagName+'#'+k.id+'.'+k.className+'['+k.children.length+'] '+(k.firstElementChild?k.firstElementChild.className:'')).slice(0,6).join(' || ')}"""))
    print(pg.evaluate("document.querySelector('#eTabs').outerHTML.replace(/<svg[\\s\\S]*?<\\/svg>/g,'<svg/>').slice(0,500)"))
    print(pg.evaluate("document.querySelector('#mainnav .mn').outerHTML.slice(0,400)"))
finally: srv.terminate()
