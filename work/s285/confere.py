import subprocess, sys, time, json
from playwright.sync_api import sync_playwright
from PIL import Image
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8895', '-d', '/home/claude/lafouch/www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1); ims = []
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
        for sc in ('light', 'dark'):
            c = b.new_context(viewport={'width': 390, 'height': 844}, color_scheme=sc, is_mobile=True, has_touch=True, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:120])); pg.goto('http://localhost:8895/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_function('window.__vt && window.__vt.pronto()'); pg.wait_for_timeout(700)
            def foto(): pg.screenshot(path='/tmp/s285.png'); ims.append(Image.open('/tmp/s285.png').convert('RGB'))
            print(sc, 'no começo:', pg.evaluate("window.__vt.log().length"), 'linhas')
            r = pg.evaluate("""()=>{const S=window.__LF.S,V=window.__vt;V.registra();
              const nomeAntes=(S.pnome||{}).SL2201||'';S.pnome=S.pnome||{};S.pnome.SL2201='Aviador novo';const n1=V.registra();
              const it=S.items.filter(i=>i.ref==='SL2201');const cAntes=it.map(i=>i.custo);it.forEach(i=>i.custo=(+i.custo||1)+0.5);const n2=V.registra();
              S.pprice=S.pprice||{};const pAntes=JSON.stringify(S.pprice.SL2201||null);S.pprice.SL2201={novo:65000,ant:60000};window.__LF.render();const n3=V.registra();const n3b=V.registra();
              it[0].qty=(+it[0].qty||0)-1;const n4=V.registra();
              return {n:[n1,n2,n3,n3b,n4],nomeAntes,cAntes,pAntes,log:V.log().slice(-4).map(e=>e.k+':'+JSON.stringify(e.de).slice(0,30)+'→'+JSON.stringify(e.para).slice(0,30))}}"""); print(sc, json.dumps(r, ensure_ascii=False)[:600])
            pg.evaluate("window.__LF.setView('ajustes')"); pg.wait_for_timeout(700); pg.evaluate("[...document.querySelectorAll('#ajGrp .ajS')].find(e=>e.textContent.includes('Cópias e nuvem')).querySelector('.ajR').click()"); pg.wait_for_timeout(700)
            print(sc, 'entrada em Ajustes:', pg.evaluate("(()=>{const e=document.querySelector('.vtE');return e?e.textContent.trim().slice(0,60)+' · '+Math.round(e.getBoundingClientRect().height)+'px':'não achei'})()"))
            pg.evaluate("document.querySelector('.vtE').click()"); pg.wait_for_timeout(900); foto(); print(sc, 'janela:', pg.evaluate("[...document.querySelectorAll('.vtL')].map(e=>e.textContent.replace(/\\s+/g,' ').trim().slice(0,70)).join(' | ')")[:420])
            pg.evaluate("[...document.querySelectorAll('.vtL')].find(e=>/custo/.test(e.textContent)).click()"); pg.wait_for_timeout(500); foto(); print(sc, 'uma mudança:', pg.evaluate("document.querySelector('.vtC').textContent.replace(/\\s+/g,' ').trim().slice(0,330)"))
            pg.evaluate("document.querySelector('.vtB').click()"); pg.wait_for_timeout(900)
            print(sc, 'depois de restaurar o custo:', pg.evaluate("window.__LF.S.items.filter(i=>i.ref==='SL2201').map(i=>i.custo)"), '(antes:', r['cAntes'], ') · linhas agora', pg.evaluate("window.__vt.log().length"))
            pg.evaluate("[...document.querySelectorAll('.vtL')].find(e=>/estoque/.test(e.textContent)).click()"); pg.wait_for_timeout(500); print(sc, 'estoque:', pg.evaluate("[!!document.querySelector('.vtB'), document.querySelector('.vtC').textContent.replace(/\\s+/g,' ').trim().slice(-150)]"))
            pg.evaluate("document.querySelector('[data-vt=x]').click()"); pg.wait_for_timeout(300); pg.evaluate("[...document.querySelectorAll('.vtL')].find(e=>/nome/.test(e.textContent)).click()"); pg.wait_for_timeout(400); pg.evaluate("document.querySelector('.vtB').click()"); pg.wait_for_timeout(700); print(sc, 'nome restaurado:', pg.evaluate("(window.__LF.S.pnome||{}).SL2201||''") == r['nomeAntes'])
            pg.evaluate("[...document.querySelectorAll('.vtL')].find(e=>/preço/.test(e.textContent)).click()"); pg.wait_for_timeout(400); pg.evaluate("document.querySelector('.vtB').click()"); pg.wait_for_timeout(700); print(sc, 'preço restaurado:', pg.evaluate("JSON.stringify(window.__LF.S.pprice.SL2201||null)"), 'esperado', r['pAntes'], '· tela:', pg.evaluate("(document.querySelector('.vtC')||{textContent:''}).textContent.replace(/\\s+/g,' ').slice(0,160)"))
            pg.reload(); pg.wait_for_function('window.__vt && window.__vt.pronto()'); pg.wait_for_timeout(800); print(sc, 'depois de recarregar:', pg.evaluate("window.__vt.log().length"), 'linhas · erros', er[:3]); c.close()
finally: srv.terminate()
B = Image.new('RGB', (400 * len(ims), 854), 'white')
for i, im in enumerate(ims): B.paste(im, (i * 400, 0))
B = B.resize((B.width * 3 // 5, B.height * 3 // 5)); B.save('/tmp/s285.jpg', quality=82)
