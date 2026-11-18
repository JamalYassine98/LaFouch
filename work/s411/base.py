# S411 · conferência das SOBRAS no site e no app REAIS (cópias exatas do que está publicado: catalogo main e www/ da v559),
# navegando só pelos toques na tela. Fora do alcance desta máquina: internet (fontes do Google, nuvem, Firebase).
import subprocess,sys,time,os,json
from playwright.sync_api import sync_playwright
T='/tmp/s411/';os.makedirs(T,exist_ok=True)
def serve(d,p):
    return subprocess.Popen([sys.executable,'-m','http.server',str(p),'-d',d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
def abre(pw,url,W=390,H=844,ls=None,lang='pt-BR'):
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=W<700,has_touch=W<700,locale=lang,service_workers='block')
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    if ls: c.add_init_script('(()=>{'+''.join('localStorage.setItem(%r,%r);'%(k,v) for k,v in ls.items())+'})()')
    pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:200]))
    pg.goto(url);pg.wait_for_timeout(3000);return b,pg,er
