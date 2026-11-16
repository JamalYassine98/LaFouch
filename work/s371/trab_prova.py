# S384: prova do modo de teste ?camt=1 com o leitor de rosto DE VERDADE (sem rosto na câmera de mentira): o trabalhador liga, recebe imagens e responde; compara as travadas com o modo normal.
import sys,json,subprocess,time
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8915','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
try:
  with sync_playwright() as p:
    for modo in ('normal','camt'):
        b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted','t_semmp':'1'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        cdp=pg.context.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
        pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.goto('http://localhost:8915/?medir=1'+('&camt=1' if modo=='camt' else ''));w=pg.wait_for_timeout;w(4000);pg.evaluate("()=>window.__lfGzAbre()");w(3000);pg.click('#gzcom');t0=time.time()
        while time.time()-t0<70 and json.loads(pg.evaluate(base.S))['f']!='teste': w(300)
        w(12000);tx=pg.evaluate("()=>document.querySelector('#lfmed').textContent").split('\n')
        print('==',modo,'| fase',json.loads(pg.evaluate(base.S))['f'],'| etiqueta',json.loads(pg.evaluate(base.S))['chip'],'| trabalhador',pg.evaluate("()=>window.__lfCam&&[window.__lfCam.fora,window.__lfCam.del,Math.round(window.__lfCam.lms||0)]"),'| falhou',pg.evaluate("()=>!!window.__lfWkFalhou"))
        print('   ',' / '.join(tx[1:6])[:300]);print('   ',' / '.join(tx[8:13])[:420]);print('    erros',[e for e in er if 'net::' not in e and 'Failed to load' not in e and 'XNNPACK' not in e][:3]);b.close()
finally: srv.terminate()
