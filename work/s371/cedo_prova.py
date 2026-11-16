# S385: prova do modo de teste — 1ª visita o leitor NÃO é preparado antes (arquivo ainda não guardado); 2ª visita ele é preparado na abertura, antes de "Começar". Leitor de verdade, 4× lento.
import sys,json,subprocess,time
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8916','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
try:
  with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted','t_semmp':'1'});cdp=pg.context.new_cdp_session(pg);cdp.send('Network.enable');cdp.send('Network.setBlockedURLs',{'urls':['https://*','wss://*']});  # sem rota do Playwright: rota desliga a memória do navegador, e a prova precisa dela
    cdp.send('Emulation.setCPUThrottlingRate',{'rate':4});pg.add_init_script("sessionStorage.setItem('lf_ni','1')");w=pg.wait_for_timeout
    for vis in (1,2):
        pg.goto('http://localhost:8916/?medir=1&camt=1');w(4000);pg.evaluate("()=>window.__lfGzAbre()");w(6000)
        print('visita',vis,'| na abertura, antes de Começar: preparado antes =',pg.evaluate("()=>window.__lfCedo||0"))
        pg.click('#gzcom');t0=time.time()
        while time.time()-t0<70 and json.loads(pg.evaluate(base.S))['f']!='teste': w(300)
        w(10000);tx=pg.evaluate("()=>document.querySelector('#lfmed').textContent").split('\n')
        print('   fase',json.loads(pg.evaluate(base.S))['f'],'| trabalhador',pg.evaluate("()=>window.__lfCam&&[window.__lfCam.fora,window.__lfCam.del,Math.round(window.__lfCam.lms||0)]"),'| falhou',pg.evaluate("()=>!!window.__lfWkFalhou"))
        print('   ',' / '.join(tx[1:6])[:330]);print('   ',' / '.join(tx[8:12])[:330])
    print('erros',[e for e in er if 'net::' not in e and 'Failed to load' not in e and 'XNNPACK' not in e][:3]);b.close()
finally: srv.terminate()
