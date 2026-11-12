import sys,io
from playwright.sync_api import sync_playwright
from PIL import Image
css=open('/tmp/k/mochi_mod.css').read()
HARN="""window.__vt=0;performance.now=()=>window.__vt;const _q=[];window.requestAnimationFrame=f=>{_q.push(f);return _q.length};window.cancelAnimationFrame=()=>{};window.__step=(ms)=>{window.__vt+=ms;const q=_q.splice(0);q.forEach(f=>{try{f(window.__vt)}catch(e){}})};"""
def quadros(codef,gesto,tempos,scale=3):
    code=open(codef).read();out=[]
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':380,'height':260},device_scale_factor=scale)
        pg.set_content('<style>'+css+'*{transition:none!important}</style><body style="margin:0;background:#8d3a69"><div id=stg style="position:relative;width:380px;height:260px"></div></body>')
        pg.add_script_tag(content=HARN);pg.add_script_tag(content=code)
        pg.evaluate("g=>{window.M=MOCHI(document.getElementById('stg'),110,25);for(let i=0;i<40;i++)__step(33);M.gesto(g)}",gesto);t=0
        for tt in tempos:
            while t<tt: pg.evaluate("__step(33.33)");t+=0.0333
            out.append(Image.open(io.BytesIO(pg.screenshot())).convert('RGB'))
        b.close()
    return out
