# S329: ESBOÇO em vídeo do lote A das animações do app (abas e seletores): HOJE × LUXO lado a lado, app real no simulador (tema escuro). Nada é implementado: o "luxo" é injetado só na gravação.
# Luxo = a linha anda com transform na curva de luxo (0,36 s, sem passar do ponto) e o conteúdo entra do lado da aba tocada (22 px + aparecer, 0,36 s), no lugar da entrada genérica da tela.
import sys,os,subprocess,glob,shutil;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base,kit
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s329/';T='/tmp/s329/'
LUXO="""()=>{const C='cubic-bezier(.16,1,.3,1)';
  const st=document.createElement('style');st.textContent='.lfPill{transition-timing-function:'+C+'!important;transition-duration:.36s!important}#eTabs .lfPill{display:none!important}';document.head.appendChild(st);
  const an=Element.prototype.animate;
  Element.prototype.animate=function(kf,op){
    if(this.classList&&this.classList.contains('lfLinha')&&Array.isArray(kf)&&kf.length===2&&kf[0].left!=null){
      const x0=parseFloat(kf[0].left),w0=parseFloat(kf[0].width),x1=parseFloat(kf[1].left),w1=parseFloat(kf[1].width);
      this.style.transformOrigin='0 50%';
      return an.call(this,[{transform:'translateX('+(x0-x1)+'px) scaleX('+(w0/w1)+')'},{transform:'none'}],{duration:360,easing:C});}
    return an.call(this,kf,op)};
  let de=0;
  document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.lfAbas>button,#eTabs>.chip');if(!b)return;const c=b.parentElement,bs=[...c.querySelectorAll('button')],on=c.querySelector('.on,[aria-pressed=true]');
    const dir=bs.indexOf(b)>=bs.indexOf(on)?1:-1,id=c.id;
    const vai=()=>{const c2=document.getElementById(id);if(!c2)return;document.getAnimations().forEach(a=>{if(a.animationName==='lfEntra'||a.animationName==='lfSobe')try{a.cancel()}catch(_){}});
      let alvo=[];if(id==='fnAbas'){const p=c2.closest('.fnBar');for(let n=p&&p.nextElementSibling;n;n=n.nextElementSibling)alvo.push(n)}else{let p=c2;while(p.parentElement&&!p.parentElement.classList.contains('view'))p=p.parentElement;for(let n=p.nextElementSibling;n;n=n.nextElementSibling)alvo.push(n)}
      alvo.forEach(n=>{try{an.call(n,[{opacity:0,transform:'translateX('+(22*dir)+'px)'},{opacity:1,transform:'none'}],{duration:360,easing:C})}catch(_){}})};
    setTimeout(vai,0);requestAnimationFrame(()=>requestAnimationFrame(vai))},true);return 'ok'}"""
TAP="""(sel)=>{const e=document.querySelector(sel);if(!e)return false;const r=e.getBoundingClientRect();let d=document.getElementById('tapd');if(!d){d=document.createElement('div');d.id='tapd';d.style.cssText='position:fixed;z-index:99999;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:rgba(243,192,220,.35);border:2px solid rgba(243,192,220,.9);pointer-events:none;transition:opacity .35s';document.body.appendChild(d)}d.style.left=(r.left+r.width/2)+'px';d.style.top=(r.top+r.height/2)+'px';d.style.opacity='1';setTimeout(()=>{d.style.opacity='0'},260);return true}"""
ROT="""(t)=>{let d=document.getElementById('rot');if(!d){d=document.createElement('div');d.id='rot';d.style.cssText='position:fixed;left:0;right:0;top:0;z-index:99998;background:'+(t==='LUXO'?'#8d3a69':'#2a3441')+';color:#fff;font:700 15px/30px system-ui,sans-serif;text-align:center;letter-spacing:.08em';document.body.appendChild(d)}d.textContent=t}"""
def roda(pw,luxo,quadros=False):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    d=T+('vl' if luxo else 'vh')
    if not quadros: shutil.rmtree(d,ignore_errors=True)
    kw=dict(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark')
    if not quadros: kw.update(record_video_dir=d,record_video_size={'width':780,'height':1688})
    c=b.new_context(**kw);c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    pg=c.new_page();w=pg.wait_for_timeout;pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);w(900)
    if luxo: pg.evaluate(LUXO)
    pg.evaluate(ROT,'LUXO' if luxo else 'HOJE')
    def toca(sel,espera=1500):
        pg.evaluate(TAP,sel);w(230);pg.evaluate("s=>document.querySelector(s).click()",sel);w(espera)
    pg.evaluate("window.__LF.setView('estoque')");w(1500)
    if quadros:
        pg.evaluate(TAP,'#eTabL');w(230);pg.evaluate("document.querySelector('#eTabL').click()")
        fs=[]
        for i in range(7): p=T+'q_%d_%d.png'%(luxo,i);pg.screenshot(path=p,clip={'x':0,'y':150,'width':390,'height':330});fs.append(p)
        b.close();return fs
    toca('#eTabL');toca('#eTabR');toca('#eTabP')
    pg.evaluate("window.__LF.setView('ped')");w(1500);toca('#pdTabs [data-id=sep]');toca('#pdTabs [data-id=ent]');toca('#pdTabs [data-id=novo]')
    pg.evaluate("window.__LF.setView('estoque')");w(1200)
    pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-estoque .pcard')];(c[1]||c[0]).click()}");w(1200);pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-estoque .pcard')].filter(x=>x.offsetParent);c[0].click()}");w(1500)
    pg.evaluate("()=>{const t=document.getElementById('fnAbas');t&&t.scrollIntoView({block:'start'});window.scrollBy(0,-120)}");w(700)
    toca('#fnAbas [data-id=his]');toca('#fnAbas [data-id=pre]');toca('#fnAbas [data-id=est]')
    v=pg.video.path();c.close();b.close();return v
with sync_playwright() as pw:
    vh=roda(pw,False);vl=roda(pw,True);qh=roda(pw,False,True);ql=roda(pw,True,True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-ss','1.2','-i',vh,'-ss','1.2','-i',vl,'-filter_complex','[0:v]crop=iw/2:ih/2:0:0,scale=540:-2[a];[1:v]crop=iw/2:ih/2:0:0,scale=540:-2[b];[a][b]hstack=inputs=2','-an','-c:v','libx264','-preset','veryfast','-crf','25','-pix_fmt','yuv420p','-r','30','-movflags','+faststart',OUT+'lote-a-abas.mp4'],check=True)
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30)
ims=[[Image.open(p) for p in qh],[Image.open(p) for p in ql]];w0,h0=ims[0][0].size
S=Image.new('RGB',(160+7*(w0+12),2*(h0+16)+20),'#f1eef0');d=ImageDraw.Draw(S)
for r,(lin,nome,cor) in enumerate(zip(ims,('HOJE','LUXO'),('#1d1418','#8d3a69'))):
    y=16+r*(h0+16);d.text((18,y+h0//2-16),nome,font=F,fill=cor)
    for k,im in enumerate(lin): S.paste(im,(150+k*(w0+12),y))
S.save(OUT+'lote-a-abas-quadros.jpg',quality=84);print(os.path.getsize(OUT+'lote-a-abas.mp4'),S.size)
