import sys,io;sys.path.insert(0,'/tmp/k');import quadro
from playwright.sync_api import sync_playwright
from PIL import Image
def ad(gesto,tempos,scale=3,code='/tmp/k/mochi_mod_fil.js'):
    code=open(code).read();out=[]
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':380,'height':260},device_scale_factor=scale)
        pg.set_content('<style>'+quadro.css+'*{transition:none!important}</style><body style="margin:0;background:#8d3a69"><div id=stg style="position:relative;width:380px;height:260px"></div></body>')
        pg.add_script_tag(content=quadro.HARN);pg.add_script_tag(content=code)
        pg.evaluate("g=>{window.M=MOCHI(document.getElementById('stg'),110,25);for(let i=0;i<40;i++)__step(33);if(g)M.gesto(g)}",gesto);t=0
        for tt in tempos:
            while t<tt: pg.evaluate("__step(33.33)");t+=0.0333
            sh=lambda:Image.open(io.BytesIO(pg.screenshot())).convert('RGB')
            pg.evaluate("()=>document.getAnimations().forEach(a=>a.pause())");d=sh();pg.evaluate("()=>document.querySelectorAll('.filE,.filD').forEach(g=>g.style.display='none')");a=sh()
            pg.evaluate("()=>document.querySelectorAll('.filE,.filD').forEach(g=>g.style.display='')");pg.evaluate("()=>document.getAnimations().forEach(a=>a.play())");out.append((a,d))
        b.close()
    return out
