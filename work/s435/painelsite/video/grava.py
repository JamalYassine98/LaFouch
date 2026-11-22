# Esboço 58e (S435, 22/11 02:00) — efeitos do destaque em vídeo: HOJE (cascata + respiração 3,4 s + inclinação 3D + reflexo; slide "virar")
# × PROPOSTA (cascata + respiração lenta ~10 s / 2,5% + fade longo; sem inclinação e sem reflexo). Site real (cópia de teste do kit).
import sys,os,json,glob,shutil,subprocess;sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.argv=sys.argv[:1];import kit
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/painelsite/video/'
kit.prep_site();kit.serve(kit.SITE,kit.PS);U='http://localhost:%d/?kit=1'%kit.PS
REFS='SL2210,SL2250,SL2255,GR3340'
CSS_PROP="""@keyframes rsp{50%{scale:1.025;translate:0 -.5%}}.stage[data-fx~=resp] img.pf,.stage[data-fx~=resp] .sli.on{animation-duration:10s!important}
.stage .sli{transition:opacity 1.6s cubic-bezier(.4,0,.2,1)!important}"""
def grava(nome,cfg,css=None,mexe=False):
  d='/tmp/v58_'+nome;shutil.rmtree(d,ignore_errors=True)
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',record_video_dir=d,record_video_size={'width':390,'height':844})
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("try{localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cfg',%r);sessionStorage.setItem('lf_ni','1')}catch(e){}"%json.dumps(cfg))
    if css: c.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s)})"%css)
    pg=c.new_page();pg.goto(U);pg.wait_for_timeout(5000)
    if mexe:
      bx=pg.evaluate("()=>{const r=document.getElementById('stage').getBoundingClientRect();return [r.left,r.top,r.width,r.height]}")
      for k in range(40):
        x=bx[0]+bx[2]*(0.2+0.6*((k%20)/19 if (k//20)%2==0 else 1-(k%20)/19));y=bx[1]+bx[3]*0.5
        pg.evaluate("p=>{const s=document.getElementById('stage');s.dispatchEvent(new PointerEvent('pointermove',{clientX:p[0],clientY:p[1],bubbles:true}))}",[x,y]);pg.wait_for_timeout(60)
      pg.wait_for_timeout(3000)
    else: pg.wait_for_timeout(5400)
    v=pg.video.path();c.close();b.close()
  return v
hoje=grava('hoje',{'ativo':True,'dmodo':'slide','slide':REFS,'sanim':'flip','efx':'cascata,resp,incl,refl'},mexe=True)
prop=grava('prop',{'ativo':True,'dmodo':'slide','slide':REFS,'sanim':'fade','efx':'cascata,resp'},CSS_PROP)
print(hoje,prop)
# lado a lado com títulos
f=O+'esboco_58e_efeitos.mp4'
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',hoje,'-i',prop,'-filter_complex',
 "[0:v]scale=390:844,pad=410:904:10:60:color=0x11141a,drawtext=text='HOJE · 4 efeitos (inclina com o dedo, reflexo, slide que vira)':fontcolor=white:fontsize=12:x=12:y=20[a];"
 "[1:v]scale=390:844,pad=410:904:10:60:color=0x11141a,drawtext=text='PROPOSTA · entrada suave · respiração lenta · fade longo':fontcolor=white:fontsize=12:x=12:y=20[b];[a][b]hstack=inputs=2,format=yuv420p[o]",
 '-map','[o]','-c:v','libx264','-preset','veryfast','-crf','23','-t','10',f],check=True)
print('ok',f)
