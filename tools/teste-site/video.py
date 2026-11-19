# S428: vídeo curto do SITE REAL (hoje × proposta) no tamanho do Xiaomi 13T do dono — abre o menu, rola até o fim, volta e fecha.
# uso: python3 video.py <saida>   (hoje em http://127.0.0.1:8000, proposta em :8001)
import sys, os, json, glob, shutil
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# mesma conta de teste e mesmos bloqueios da análise (copiados de analise.py)
CONTA = json.dumps({'nome': 'Maria González', 'email': 'maria@exemplo.com', 'tel': '+595 983 000 000', 'nac': 'py', 'doc': '1234567',
                    'ends': [{'nome': 'Casa', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Calle Los Lapachos 123'}]})
AUTH = json.dumps({'uid': 'kit', 'idToken': 'kit', 'refresh': 'kit', 'exp': 9e15, 'ev': True, 'email': 'maria@exemplo.com'})
INIT = ("try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','0');"
        "localStorage.setItem('lf_conta',%s);localStorage.setItem('lf_auth',%s)}catch(e){}" % (json.dumps(CONTA), json.dumps(AUTH)))
BLOQ = ('identitytoolkit', 'securetoken', 'google-analytics', 'googletagmanager', 'recaptcha', 'southamerica-east1-')
W, H = 386, 858
with sync_playwright() as pw:
    b = pw.chromium.launch(args=['--no-sandbox'])
    for versao, porta in (('hoje', 8000), ('prop', 8001)):
        tmp = os.path.join(OUT, 'tmp_' + versao)
        c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=True, has_touch=True, locale='pt-BR', service_workers='block',
                          record_video_dir=tmp, record_video_size={'width': W, 'height': H})
        c.add_init_script(INIT); c.route('**/*', lambda r: r.abort() if any(x in r.request.url for x in BLOQ) else r.continue_())
        pg = c.new_page(); pg.goto('http://127.0.0.1:%d/' % porta, wait_until='load', timeout=60000); pg.wait_for_timeout(4000)
        pg.tap('#mnb', force=True); pg.wait_for_timeout(2500)
        for k in range(10):
            pg.evaluate("()=>{const p=document.querySelector('#drw .dpn');p.scrollBy({top:90,behavior:'smooth'})}"); pg.wait_for_timeout(350)
        pg.wait_for_timeout(1500)
        pg.evaluate("()=>{document.querySelector('#drw .dpn').scrollTo({top:0,behavior:'smooth'})}"); pg.wait_for_timeout(1800)
        fecha = '#mnb' if versao == 'prop' else '#drw [data-dclose]'
        pg.tap(fecha, force=True); pg.wait_for_timeout(2200)
        v = pg.video.path(); c.close()
        shutil.move(v, os.path.join(OUT, versao + '.webm')); shutil.rmtree(tmp, ignore_errors=True)
        print('ok', versao, flush=True)
    b.close()
