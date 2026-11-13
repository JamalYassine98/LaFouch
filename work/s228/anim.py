# S228 · padrão de movimento único (site e app) — protótipo: lê toda animação viva e ajusta. Vídeo HOJE × PROPOSTA, quadros e fluidez.  python3 anim.py
import os, sys, subprocess, time, glob, shutil, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
# 3 tempos (0,2 · 0,32 · 0,48 s), 1 curva, animação sem fim só para "carregando"; toque responde na hora
MOV = r"""(()=>{const E='cubic-bezier(.2,.8,.2,1)';function liga(){const st=document.createElement('style');st.textContent='button:active,a:active,[data-act]:active,.card:active,.pcard:active{transform:scale(.975)!important;transition:transform .08s ease-out!important}';document.head.appendChild(st);
 const t=()=>{try{document.getAnimations().forEach(a=>{if(a.__lf||!a.effect)return;a.__lf=1;const c=a.effect.getComputedTiming(),n=(a.animationName||'')+'';if(c.iterations===Infinity){if(!/spin|rot|gira|load|carreg|sk|shm/i.test(n))a.effect.updateTiming({iterations:2});return}
  const d=+c.duration||0;if(!d)return;const nd=d<=240?200:d<=420?320:d<=760?480:d;a.effect.updateTiming({duration:nd,easing:E})})}catch(_){}requestAnimationFrame(t)};requestAnimationFrame(t)}
 if(document.head)liga();else document.addEventListener('DOMContentLoaded',liga)})();"""
RAF="""()=>{window.__f=[];let l=performance.now();const t=n=>{window.__f.push(n-l);l=n;window.__r=requestAnimationFrame(t)};window.__r=requestAnimationFrame(t)}"""
FIM="""()=>{cancelAnimationFrame(window.__r);const f=window.__f.slice(2);const n=f.length;const lent=f.filter(x=>x>34).length;return {quadros:n,pior:Math.round(Math.max(...f)),travadas:lent}}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1',shell=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','8809','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
SITE=[('abrir o menu',lambda pg:pg.evaluate("document.querySelector('#mnb').click()"),1300),('fechar o menu',lambda pg:pg.keyboard.press('Escape'),1100),('ir ao catálogo',lambda pg:pg.evaluate("location.href='?r=tienda'"),3000),('abrir uma peça',lambda pg:pg.evaluate("document.querySelector('#grid .card .open').click()"),1500),('voltar',lambda pg:pg.go_back(),1400)]
navb=lambda i:(lambda pg:pg.evaluate("i=>document.querySelectorAll('#mainnav .mn')[i].click()",i))
APP=[('Início → Catálogo',navb(1),1300),('Catálogo → Inventário',navb(2),1300),('abrir a ficha',lambda pg:pg.evaluate("(document.querySelector('#v-estoque .pcard, #v-estoque [data-act][data-id]')||{click(){}}).click()"),1500),('voltar',lambda pg:pg.go_back(),1300),('Inventário → Caixa',navb(3),1300),('abrir o sino',lambda pg:pg.evaluate("document.querySelector('#sino').click()"),1300)]
res={}
def abre(b,qual,modo,video=None,dpr=1):
    kw=dict(viewport={'width':390,'height':844},device_scale_factor=dpr,is_mobile=True,has_touch=True,locale='es-PY',service_workers='block')
    if video: kw.update(record_video_dir=video,record_video_size={'width':390,'height':844})
    c=b.new_context(**kw);c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");
    if modo=='prop': c.add_init_script(MOV)
    c.route('**/*',rota);pg=c.new_page()
    if qual=='site': pg.goto('http://localhost:8811/');pg.wait_for_timeout(2600)
    else: pg.goto('http://localhost:8809/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(1000)
    return c,pg
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for qual,passos in (('site',SITE),('app',APP)):
        # 1 fluidez com processador 4x lento
        for modo in ('hoje','prop'):
            c,pg=abre(b,qual,modo);cdp=c.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
            for nome,ac,ms in passos:
                if nome=='ir ao catálogo': ac(pg);pg.wait_for_timeout(ms);continue
                pg.evaluate(RAF);pg.wait_for_timeout(120);ac(pg);pg.wait_for_timeout(ms);res['%s|%s|%s'%(qual,nome,modo)]=pg.evaluate(FIM)
            c.close()
        # 2 vídeo
        vs=[]
        for modo in ('hoje','prop'):
            d='/tmp/s228v_%s_%s'%(qual,modo);shutil.rmtree(d,ignore_errors=True);c,pg=abre(b,qual,modo,video=d)
            for nome,ac,ms in passos: ac(pg);pg.wait_for_timeout(ms+500)
            c.close();vs.append(glob.glob(d+'/*.webm')[0])
        subprocess.run(['ffmpeg','-y','-loglevel','error','-ss','2.2','-i',vs[0],'-ss','2.2','-i',vs[1],'-filter_complex',"[0:v]pad=iw+20:ih+60:0:60:color=0xece6ea,drawtext=text='HOJE':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=30:fontcolor=0xb42318:x=20:y=14[a];[1:v]pad=iw:ih+60:0:60:color=0xece6ea,drawtext=text='PROPOSTA':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=30:fontcolor=0x1f8a4c:x=20:y=14[b];[a][b]hstack",'-c:v','libx264','-pix_fmt','yuv420p','-crf','24',A+'s228_movimento_%s.mp4'%qual])
        # 3 quadros lado a lado de uma transição (site: abrir uma peça · app: Catálogo → Inventário)
        linhas=[]
        for modo in ('hoje','prop'):
            c,pg=abre(b,qual,modo)
            if qual=='site': pg.goto('http://localhost:8811/?r=tienda');pg.wait_for_timeout(2600);ac=SITE[3][1]
            else: navb(1)(pg);pg.wait_for_timeout(1300);ac=navb(2)
            t0=time.time();ac(pg);qs=[]
            for k in range(6):
                p='/tmp/s228q.png';pg.screenshot(path=p);qs.append((int((time.time()-t0)*1000),Image.open(p).convert('RGB').resize((234,506))));pg.wait_for_timeout(35)
            linhas.append((modo,qs));c.close()
        B=Image.new('RGB',(80+6*254,150+2*600),'#ece6ea');d=ImageDraw.Draw(B);d.text((40,28),'%s · %s · quadro a quadro'%('Site' if qual=='site' else 'App','abrir uma peça' if qual=='site' else 'Catálogo → Inventário'),font=F(34,1),fill='#2a1a28');d.text((40,78),'Mesma curva e 3 tempos em tudo; o toque responde na hora. (tempos aproximados: o simulador é mais lento que o celular)',font=F(20),fill='#5b4a56')
        for i,(modo,qs) in enumerate(linhas):
            y=130+i*600;d.text((40,y),'HOJE' if modo=='hoje' else 'PROPOSTA',font=F(26,1),fill='#b42318' if modo=='hoje' else '#1f8a4c')
            for k,(ms,im) in enumerate(qs): B.paste(im,(40+k*254,y+40));d.text((40+k*254,y+550),'%d ms'%ms,font=F(18),fill='#5b4a56')
        B.save(A+'s228_movimento_%s_quadros.jpg'%qual,quality=85);print('ok',qual,flush=True)
finally: srv.terminate()
json.dump(res,open(A+'fluidez2.json','w'),ensure_ascii=False,indent=1)
ks=sorted(set(k.rsplit('|',1)[0] for k in res))
for k in ks: h,p=res[k+'|hoje'],res[k+'|prop'];print('%-34s pior quadro %4d → %4d ms · travadas %d → %d'%(k,h['pior'],p['pior'],h['travadas'],p['travadas']))
