import json,subprocess
R=json.load(open('/tmp/s410_R.json'));F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';O='/home/claude/lafouch/work/s410/'
def corte(m,out,vel=1.0):
    r=R[m];a=r['ini']/1000+0.2;d=(r['fim']-r['ini'])/1000;lab={'h':'HOJE','p':'PROPOSTA'}[m]
    vf=f"crop=190:200:200:320,scale=570:600:flags=lanczos,setpts={1/vel}*PTS,drawtext=fontfile={F}:text='{lab}':x=20:y=20:fontsize=34:fontcolor=0x8d3a69"
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(a),'-t',str(d),'-i',r['v'],'-vf',vf,'-r','30','-an',out],check=True)
for v,suf,t in ((1.0,'','velocidade normal'),(0.4,'_lento','câmera lenta (0,4x)')):
    corte('h','/tmp/h%s.mp4'%suf,v);corte('p','/tmp/p%s.mp4'%suf,v)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i','/tmp/h%s.mp4'%suf,'-i','/tmp/p%s.mp4'%suf,'-filter_complex',"[0][1]hstack=inputs=2,pad=iw:ih+60:0:0:white,drawtext=fontfile=%s:text='%s':x=(w-text_w)/2:y=h-46:fontsize=30:fontcolor=0x555555"%(F,t),'-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','/tmp/hp%s.mp4'%suf],check=True)
open('/tmp/lista.txt','w').write("file '/tmp/hp.mp4'\nfile '/tmp/hp_lento.mp4'\n")
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','/tmp/lista.txt','-c','copy',O+'104-mochi-mao-depois-do-braco.mp4'],check=True)
