from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
    pg.on('console',lambda m: print(m.text[:400]) if 'SC' in m.text else None)
    pg.add_init_script("""(()=>{var o=window.scrollTo;window.scrollTo=function(){if(window.__dbg)console.log('SC scrollTo',JSON.stringify([...arguments]),new Error().stack.split('\\n').slice(2,5).join(' | '));return o.apply(this,arguments)};
      var e=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(){if(window.__dbg)console.log('SC sIV',this.className,new Error().stack.split('\\n').slice(2,4).join(' | '));return e.apply(this,arguments)};
      addEventListener('scroll',()=>{if(window.__dbg)console.log('SC y',Math.round(scrollY),document.documentElement.className)})})()""")
    pg.goto('http://localhost:8767/?logo2=1');pg.wait_for_timeout(2500)
    pg.evaluate("window.scrollTo(0,600)");pg.wait_for_timeout(500)
    pg.evaluate("document.querySelector(\"[data-open='GR3340']\").click()");pg.wait_for_timeout(1500)
    pg.evaluate("window.__dbg=1");pg.locator('.top .logo').first.tap();pg.wait_for_timeout(1500)
