# S374 · 64d: vídeo SÓ da animação (abrir e fechar "Contas, taxas e meta" e "Preços para corrigir"), quadro a quadro a 60 por segundo
# (cada quadro é a animação parada no tempo exato: o vídeo mostra a curva como ela é, sem perder quadros da gravação).
import sys,os,subprocess,shutil;sys.argv=[sys.argv[0]]
src=open('/home/claude/lafouch/work/s374/esb64.py').read().split('with sync_playwright')[0];exec(src)
D=T+'q64v/';shutil.rmtree(D,ignore_errors=True);os.makedirs(D)
n=[0]
def foto(pg,clip):
    pg.screenshot(path=D+'f%04d.png'%n[0],clip=clip);n[0]+=1
def passo(pg,fx,dur,clip,abre=True):
    ok=pg.evaluate("f=>{const h=document.querySelector('.fx64[data-fx='+f+'] .fxH');if(!h)return [...document.querySelectorAll('.fx64')].map(s=>s.dataset.fx).join(',')||'nenhum';h.click();return 'ok'}",fx);print('  passo',fx,ok);pg.wait_for_timeout(16)
    pg.evaluate("()=>document.getAnimations().forEach(a=>{try{a.pause();a.currentTime=0}catch(e){}})")
    for k in range(0,int(dur*60/1000)+2):
        t=k*1000/60;pg.evaluate("t=>document.getAnimations().forEach(a=>{try{a.currentTime=t}catch(e){}})",t);foto(pg,clip)
    pg.evaluate("()=>document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}})")
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True);w(1200);tela(pg,w,1);pg.add_style_tag(content='#v-dash{padding-bottom:900px}');w(200)
    pg.evaluate("()=>{const s=document.querySelector('.fx64[data-fx=abp]');window.scrollTo({top:s.getBoundingClientRect().top+scrollY-300,behavior:'instant'})}");w(500);print('  topo',pg.evaluate("()=>Math.round(document.querySelector('.fx64[data-fx=abp]').getBoundingClientRect().top)"))
    clip={'x':0,'y':0,'width':390,'height':844}
    for i in range(30): foto(pg,clip)
    passo(pg,'cfg',460,clip)
    for i in range(45): foto(pg,clip)
    passo(pg,'cfg',320,clip,False)
    for i in range(25): foto(pg,clip)
    passo(pg,'abp',460,clip)
    for i in range(45): foto(pg,clip)
    passo(pg,'abp',320,clip,False)
    for i in range(30): foto(pg,clip)
    b.close()
out=OUT+'64d-app-so-a-animacao-60fps-escuro.mp4'
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','60','-i',D+'f%04d.png','-vf','scale=780:-2','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',out])
# câmera lenta (4x) só da abertura
sl=OUT+'64e-app-abertura-camera-lenta-4x-escuro.mp4'
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','15','-start_number','28','-i',D+'f%04d.png','-frames:v','40','-vf','scale=780:-2','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',sl])
print(n[0],os.path.getsize(out),os.path.getsize(sl))
