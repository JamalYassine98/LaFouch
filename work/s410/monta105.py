import json,subprocess,glob
from PIL import Image,ImageDraw,ImageFont
Fn='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';O='/home/claude/lafouch/work/s410/'
TIT={1:'Cena 1 - aproxima e PARA quando embaça',2:'Cena 2 - vai até bem perto sem parar (não embaça)'}
for c in (1,2):
    R=json.load(open('/tmp/s410_c%d.json'%c))
    vf=(f"pad=iw:ih+110:0:110:white,drawtext=fontfile={Fn}:text='HOJE':x=20:y=62:fontsize=30:fontcolor=0x8d3a69,"
        f"drawtext=fontfile={Fn}:text='PROPOSTA':x=410:y=62:fontsize=30:fontcolor=0x8d3a69,drawtext=fontfile={Fn}:text='{TIT[c]}':x=20:y=16:fontsize=26:fontcolor=0x333333")
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(R['t']+0.25),'-t','17','-i',R['v'],'-vf',vf,'-r','30','-an','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','/tmp/c%d.mp4'%c],check=True)
open('/tmp/l105.txt','w').write("file '/tmp/c1.mp4'\nfile '/tmp/c2.mp4'\n")
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','/tmp/l105.txt','-c','copy',O+'105-mochi-aproxime-meio-termo.mp4'],check=True)
