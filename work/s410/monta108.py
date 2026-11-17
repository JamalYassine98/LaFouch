import json,subprocess,glob
R=json.load(open('/tmp/s410_b.json'));Fn='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';O='/home/claude/lafouch/work/s410/'
def hd(t):return (f"pad=iw:ih+110:0:110:white,drawtext=fontfile={Fn}:text='HOJE':x=20:y=62:fontsize=30:fontcolor=0x8d3a69,drawtext=fontfile={Fn}:text='PROPOSTA':x=410:y=62:fontsize=30:fontcolor=0x8d3a69,drawtext=fontfile={Fn}:text='{t}':x=20:y=16:fontsize=24:fontcolor=0x333333")
for k,t,ini,dur in (('nao','Se estiver difícil... → Não consigo brilha',R['nao']-1,9),('com','É só tocar em Começar → Começar brilha',R['com']-1,8)):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(ini),'-t',str(dur),'-i',R['v'],'-vf',hd(t),'-r','30','-an','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','/tmp/b_%s.mp4'%k],check=True)
    subprocess.run('rm -f /tmp/bf_%s_*.png; ffmpeg -loglevel error -i /tmp/b_%s.mp4 -vf fps=4 /tmp/bf_%s_%%02d.png'%(k,k,k),shell=True)
open('/tmp/l108.txt','w').write("file '/tmp/b_nao.mp4'\nfile '/tmp/b_com.mp4'\n")
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','/tmp/l108.txt','-c','copy',O+'108-mochi-botao-citado-brilha.mp4'],check=True)
