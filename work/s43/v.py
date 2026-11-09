from playwright.sync_api import sync_playwright
import glob,subprocess
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for k,u in (('hoje','?sim=1'),('novo','?sim=1&fix=1')):
        ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR',record_video_dir='v_'+k,record_video_size={'width':390,'height':844})
        pg=ctx.new_page();pg.goto('http://localhost:8768/'+u);pg.wait_for_timeout(3200)
        er=[];pg.on('pageerror',lambda e:er.append(str(e)))
        pg.reload();pg.wait_for_timeout(3200);print(k,er,pg.evaluate("document.querySelectorAll('#home .hc').length"));ctx.close()
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
o=[]
for k,l in (('hoje','HOJE'),('novo','PROPOSTA')):
    f=glob.glob('v_%s/*.webm'%k)[0]
    subprocess.run(['ffmpeg','-loglevel','error','-y','-ss','3.3','-t','3','-i',f,'-vf',"fps=30,drawbox=y=0:w=iw:h=36:color=black@0.75:t=fill,drawtext=fontfile=%s:text='%s · atualizar a página':x=10:y=9:fontsize=16:fontcolor=white"%(F,l),'-c:v','libx264','-preset','veryfast','-pix_fmt','yuv420p','c_%s.mp4'%k],check=True);o.append('c_%s.mp4'%k)
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',o[0],'-i',o[1],'-filter_complex','[0:v]pad=iw+10:ih:0:0:color=gray[a];[a][1:v]hstack,setpts=1.6*PTS','-c:v','libx264','-preset','veryfast','-pix_fmt','yuv420p','S43_atualizar.mp4'],check=True)
