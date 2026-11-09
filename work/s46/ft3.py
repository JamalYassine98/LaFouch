from playwright.sync_api import sync_playwright
# conta "piscadas": foto que já estava aparecendo e voltou a esconder (do início do carregamento)
I="""(()=>{window.__pis=[];var vis=new WeakMap(),t0=performance.now();var f=()=>{document.querySelectorAll('#home img, #grid img').forEach(i=>{var r=i.getBoundingClientRect();if(!(r.width>0&&r.bottom>0&&r.top<innerHeight))return;var on=i.complete&&i.naturalWidth>0&&!i.classList.contains('lfq0')&&getComputedStyle(i).opacity>0.5;var was=vis.get(i);if(was&&!on)window.__pis.push((i.getAttribute('src')||'').slice(-24)+' t:'+Math.round(performance.now()-t0));vis.set(i,on)});requestAnimationFrame(f)};requestAnimationFrame(f)})()"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for run in range(4):
        ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,locale='pt-BR');ctx.add_init_script(I);pg=ctx.new_page()
        pg.goto('http://localhost:8768/?sim=2');pg.wait_for_timeout(4000);a=pg.evaluate('window.__pis.length')
        pg.reload();pg.wait_for_timeout(4000)
        print('rodada',run+1,'| 1ª visita piscadas:',a,'| recarregar piscadas:',pg.evaluate('window.__pis'))
        ctx.close()
