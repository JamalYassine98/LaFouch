# S370: monta o vídeo Hoje (em cima) × Proposta (embaixo), com o som da PROPOSTA. Sincronia pelo clarão preto gravado antes de abrir a consulta.
import json,subprocess,re,os,sys
A=os.path.dirname(os.path.abspath(__file__))+'/';R=json.load(open('/tmp/s370_R.json'));LG=(sys.argv[1:] or ['pt'])[0]
def clarao(v):
    r=subprocess.run(['ffmpeg','-hide_banner','-i',v,'-vf','blackdetect=d=0.04:pix_th=0.12','-an','-f','null','-'],capture_output=True,text=True).stderr
    m=re.findall(r'black_start:([\d.]+)',r);assert m,r[-300:];return float(m[0])
for x in R: x['tv']=clarao(x['v']);x['ini']=x['tv']+(x['ta']-x['tf'])/1000-0.4;x['dur']=(x['tz']-x['ta'])/1000+0.4
D=max(x['dur'] for x in R);P=R[1];FT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
import glob
TAM={os.path.getsize(f):f for f in glob.glob(P['dir']+'/media/voz/%s/*.mp3'%LG)}
ins=['-ss','%.3f'%R[0]['ini'],'-i',R[0]['v'],'-ss','%.3f'%R[1]['ini'],'-i',R[1]['v']];af=[];n=0
for e in P['al']:
    t=(e['t']-P['ta'])/1000+0.4
    if t<0: continue
    arq=TAM.get(e.get('sz')) if e['f'].startswith('blob:') else P['dir']+e['f']
    if not arq: print('sem arquivo para',e);continue
    ins+=['-i',arq];af.append('[%d:a]adelay=%d|%d[a%d]'%(n+2,int(t*1000),int(t*1000),n));n+=1
CR='crop=700:620:400:80'
fc=("[0:v]%s,tpad=stop_mode=clone:stop_duration=6,pad=720:690:10:60:color=0xece6ea,drawtext=text='HOJE':fontfile=%s:fontsize=24:fontcolor=0xb42318:x=12:y=24[h];"%(CR,FT)+
    "[1:v]%s,tpad=stop_mode=clone:stop_duration=6,pad=720:690:10:60:color=0xece6ea,drawtext=text='PROPOSTA (o som é desta)':fontfile=%s:fontsize=24:fontcolor=0x1f8a4c:x=12:y=24[p];[h][p]vstack[v];"%(CR,FT)+
    ';'.join(af)+';'+''.join('[a%d]'%i for i in range(n))+'amix=inputs=%d:normalize=0[a]'%n)
out=A+'s370_mochi_fluidez_hoje_x_proposta_%s.mp4'%LG
subprocess.run(['ffmpeg','-y','-loglevel','error']+ins+['-filter_complex',fc,'-map','[v]','-map','[a]','-t','%.2f'%D,'-c:v','libx264','-pix_fmt','yuv420p','-crf','24','-r','30','-c:a','aac','-b:a','128k','-movflags','+faststart',out],check=True)
print('ok',round(D,1),'s',os.path.getsize(out)//1024,'kB',[round(x['tv'],2) for x in R])
# quadros para conferir: o salto até o código (proposta) e a boca
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',out,'-vf',"fps=4,scale=290:-2,tile=8x4",'-frames:v','1','-ss','24','/tmp/gt/s370_quadros.jpg'],check=False)
