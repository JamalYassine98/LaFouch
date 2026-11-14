import subprocess, sys, time, glob, json, os
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8841', '-d', '/tmp/cf'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox']); pg = b.new_page(); pg.goto('http://localhost:8841/pg/vazio.html'); pg.add_script_tag(url='http://localhost:8841/pg/conferir.js')
        for p in sorted(glob.glob('/tmp/cf/fr/*.jpg')):
            n = os.path.basename(p)
            r = pg.evaluate("""async n=>{const im=new Image();im.src='/fr/'+n;await im.decode();const c=document.createElement('canvas');c.width=640;c.height=360;const x=c.getContext('2d',{willReadFrequently:true});const emPe=im.width<im.height;
              if(emPe){x.fillStyle='#000';x.fillRect(0,0,640,360);x.drawImage(im,0,0,im.width,im.height,(640-360*im.width/im.height)/2,0,360*im.width/im.height,360)}else x.drawImage(im,0,0,640,360);
              const m=medeQuadro(x.getImageData(0,0,640,360)),r=confereGiro(m,{emPe:emPe,mexe:0});return r.itens.filter(i=>i.ok!==true).map(i=>i.id+(i.ok===null?'?':'✗')).join(' ')+'  →  '+r.frase}""", n)
            print(n.ljust(14), r)
finally: srv.terminate()
