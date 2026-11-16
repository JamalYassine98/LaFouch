# 66d: vídeo só da animação da lista abrindo no Contador (quadro a quadro, 60 por segundo)
import sys,os,subprocess,shutil;sys.argv=[sys.argv[0]]
src=open('/home/claude/lafouch/work/s374/esb66.py').read().split('PARTES=')[0];exec(src)
D=T+'q66v/';shutil.rmtree(D,ignore_errors=True);os.makedirs(D);n=[0]
def foto(pg): pg.screenshot(path=D+'f%04d.png'%n[0]);n[0]+=1
def passo(pg,dur):
    pg.evaluate("()=>document.querySelector('[data-x66]').closest('.cntL').click()");pg.wait_for_timeout(16)
    pg.evaluate("()=>document.getAnimations().forEach(a=>{try{a.pause();a.currentTime=0}catch(e){}})")
    for k in range(0,int(dur*60/1000)+2):
        pg.evaluate("t=>document.getAnimations().forEach(a=>{try{a.currentTime=t}catch(e){}})",k*1000/60);foto(pg)
    pg.evaluate("()=>document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}})")
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True);w(1200);tela(pg,w,1);pg.evaluate(ABRE);w(300);pg.add_style_tag(content=CSS65);pg.evaluate(JS65);w(300)
    pg.add_style_tag(content=CSS66);pg.evaluate(JS66);w(400)
    pg.evaluate("()=>{const e=document.querySelector('.cntD');window.scrollTo({top:e.getBoundingClientRect().top+scrollY-40,behavior:'instant'})}");w(400)
    for i in range(30): foto(pg)
    passo(pg,460)
    for i in range(50): foto(pg)
    passo(pg,320)
    for i in range(30): foto(pg)
    b.close()
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','60','-i',D+'f%04d.png','-vf','scale=780:-2','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',OUT+'66d-app-precos-lista-abre-60fps-escuro.mp4'])
print(n[0])
