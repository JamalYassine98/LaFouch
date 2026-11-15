# S320: mostra a entrada suave da linha "Já paguei, enviar comprovante" (aparece 1 min depois do pedido). Quadros lado a lado + MP4, tela real do site.
import sys,os,subprocess,glob;sys.path.insert(0,'/home/claude/lafouch/work/s308');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
T='/tmp/s320/';OUT='/home/claude/lafouch/work/s320/'
for f in glob.glob(T+'q*.png'): os.remove(f)
with sync_playwright() as pw:
    b,pg,w=base.abre(pw,minutos=0.5)
    print('antes:',pg.evaluate("()=>document.getElementById('pgcl').hidden"))
    for i in range(8): pg.screenshot(path=T+'q%03d.png'%i,clip={'x':0,'y':430,'width':390,'height':414})
    pg.clock.fast_forward(31000)
    for i in range(8,46): pg.screenshot(path=T+'q%03d.png'%i,clip={'x':0,'y':430,'width':390,'height':414})
    print('depois:',pg.evaluate("()=>[document.getElementById('pgcl').hidden,document.getElementById('pgcl').className,document.getElementById('pkok').scrollHeight,document.getElementById('pkok').clientHeight]"))
    OLHO=open('/home/claude/lafouch/work/kit/olho.js').read();w(2500);print('olho depois:',[ (f['r'],f.get('ex')) for f in (pg.evaluate(OLHO) or [])])
    b.close()
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','12','-i',T+'q%03d.png','-c:v','libx264','-crf','22','-pix_fmt','yuv420p','-vf','scale=780:-2:flags=lanczos','-movflags','+faststart',OUT+'comprovante-aparece.mp4'],check=True)
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',26)
qs=[7,9,11,14,20,44];ims=[Image.open(T+'q%03d.png'%i) for i in qs];w0,h0=ims[0].size
S=Image.new('RGB',(20+len(ims)*(w0+20),h0+90),'#f1eef0');d=ImageDraw.Draw(S)
for k,(im,r) in enumerate(zip(ims,['antes','entra','','','brilho','assentou'])):
    x=20+k*(w0+20);d.text((x,24),r,font=F,fill='#8d3a69');S.paste(im,(x,70))
S.save(OUT+'comprovante-aparece-quadros.jpg',quality=86);print(os.path.getsize(OUT+'comprovante-aparece.mp4'))
