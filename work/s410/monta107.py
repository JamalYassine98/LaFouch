import json,subprocess,glob
from PIL import Image,ImageDraw,ImageFont
R=json.load(open('/tmp/s410_t.json'));Fn='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';O='/home/claude/lafouch/work/s410/'
def hd(t):return (f"pad=iw:ih+110:0:110:white,drawtext=fontfile={Fn}:text='HOJE':x=20:y=62:fontsize=30:fontcolor=0x8d3a69,drawtext=fontfile={Fn}:text='PROPOSTA':x=410:y=62:fontsize=30:fontcolor=0x8d3a69,drawtext=fontfile={Fn}:text='{t}':x=20:y=16:fontsize=26:fontcolor=0x333333")
a=R['tpv']-7
subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(a),'-t','26','-i',R['v'],'-vf',hd('Fim do 1º teste e começo do 2º'),'-r','30','-an','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','/tmp/t107.mp4'],check=True)
# acha a entrada do botão na proposta (faixa do botão fica escura)
subprocess.run('rm -f /tmp/z_*.png; ffmpeg -loglevel error -i /tmp/t107.mp4 -vf fps=10 /tmp/z_%03d.png',shell=True)
fs=sorted(glob.glob('/tmp/z_*.png'));te=None
for i,f in enumerate(fs):
    if i<95: continue
    im=Image.open(f).convert('L').crop((400,690,775,780));px=list(im.get_flattened_data())
    if sum(1 for p in px if p<120)>3000: te=i/10;break
print('botão entra em',te)
subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(a+te-0.8),'-t','3.2','-i',R['v'],'-vf',hd('Câmera lenta: o botão Embaçou aparecendo')+',setpts=2.8*PTS','-r','30','-an','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','/tmp/t107l.mp4'],check=True)
open('/tmp/l107.txt','w').write("file '/tmp/t107.mp4'\nfile '/tmp/t107l.mp4'\n")
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','/tmp/l107.txt','-c','copy',O+'107-mochi-aproxime-meio-termo.mp4'],check=True)
json.dump({'te':te},open('/tmp/te.json','w'))
