# S347: ESBOÇO em vídeo dos lotes B (janelas e telas) e C (listas, toques, carregando) das animações do app: HOJE × LUXO lado a lado,
# app real no simulador (tema escuro). Nada é implementado: o "luxo" é injetado só na gravação.
import sys,os,re,subprocess,shutil;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base,kit
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s347/';T='/tmp/s347/'
src=open('/home/claude/lafouch/work/s329/filme.py').read()
TAP=re.search(r'TAP="""(.*?)"""',src,re.S).group(1);ROT=re.search(r'ROT="""(.*?)"""',src,re.S).group(1)
C='cubic-bezier(.16,1,.3,1)'
# B: uma curva só (sem passar do ponto) em toda janela, folha, barra e troca de tela; fechar mais rápido que abrir
LUXO_B="()=>{const s=document.createElement('style');s.textContent='*,*::before,*::after{animation-timing-function:%s!important;transition-timing-function:%s!important}.ebBar:not(.in){transition-duration:.22s!important;transform:translateY(calc(100%% + 120px))!important}';document.head.appendChild(s);return 1}"%(C,C)
# C: a cascata dos atalhos toca UMA vez (não repete ao voltar ao Início); toque afunda em 0,08 s; desenho de tela vazia em 0,6 s
LUXO_C="()=>{const s=document.createElement('style');s.textContent='*,*::before,*::after{animation-timing-function:%s!important;transition-timing-function:%s!important}button:active,.tl:active{transform:scale(.97)!important;transition:transform .08s!important}.lfVazio svg *{animation-duration:.6s!important}';document.head.appendChild(s);let n=0;const o=new MutationObserver(()=>{});window.__casOff=()=>{const t=document.createElement('style');t.textContent='#v-inicio .tl,#v-inicio .hero,#v-inicio>*{animation:none!important}';document.head.appendChild(t)};return 1}"%(C,C)
SHARE="()=>{const e=[...document.querySelectorAll('#v-vendas button')].filter(e=>e.offsetParent&&/ompartilh/i.test(e.getAttribute('aria-label')||''))[0];e&&e.click()}"
FILT="()=>{const x=[...document.querySelectorAll('#v-estoque button')].find(b=>/Filtros e ordem/.test(b.getAttribute('aria-label')||''));x&&x.click()}"
def roda(pw,lote,luxo,quadros=False):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);d=T+lote+('l' if luxo else 'h')
    if not quadros: shutil.rmtree(d,ignore_errors=True)
    kw=dict(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark')
    if not quadros: kw.update(record_video_dir=d,record_video_size={'width':780,'height':1688})
    c=b.new_context(**kw);c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    pg=c.new_page();w=pg.wait_for_timeout;pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);w(900)
    if luxo: pg.evaluate(LUXO_B if lote=='b' else LUXO_C)
    pg.evaluate(ROT,'LUXO' if luxo else 'HOJE')
    js=lambda s,e=1400:(pg.evaluate(s),w(e))
    fs=[]
    def tira(n,clip):
        for i in range(n): p=T+'q%s_%d_%d.png'%(lote,luxo,i);pg.screenshot(path=p,clip=clip);fs.append(p)
    if lote=='b':
        js("()=>window.__LF.setView('estoque')",1500)
        if quadros:
            pg.evaluate(FILT);tira(7,{'x':0,'y':330,'width':390,'height':514});b.close();return fs
        js(FILT,1700);js("()=>{const c=document.getElementById('filtCancel');c&&c.click()}",1300)       # folha Filtros abre e fecha
        js("()=>window.__LF.setView('vendas')",1500);js("()=>document.getElementById('cjAj').click()",1700);js("()=>{const e=document.querySelector('.lfaBg,.sheetBg,[data-close]');const x=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/^Cancelar$/.test(b.innerText.trim()));x&&x.click()}",1300)  # Ajustes do catálogo
        js(SHARE,1500);js("()=>document.querySelector('#ebBar .ebX').click()",1300)                             # barra de escolher peças
        js("()=>{const c=[...document.querySelectorAll('#vRows .pcard[data-ref]')][0];c&&c.click()}",1800);js("()=>history.back()",1500)  # ficha da peça abre e volta
        js("()=>window.__LF.setView('caixa')",1500);js("()=>window.__LF.setView('inicio')",1500)             # troca de tela
    else:
        if luxo: pg.evaluate("()=>window.__casOff&&0")
        js("()=>window.__LF.setView('inicio')",1600)
        if quadros:
            pg.evaluate("()=>window.__LF.setView('ped')");w(900)
            if luxo: pg.evaluate("()=>window.__casOff()")
            pg.evaluate("()=>window.__LF.setView('inicio')");tira(7,{'x':0,'y':300,'width':390,'height':460});b.close();return fs
        js("()=>window.__LF.setView('ped')",2000)                                                              # tela com desenho de vazio
        if luxo: pg.evaluate("()=>window.__casOff()")
        js("()=>window.__LF.setView('inicio')",1700)                                                           # volta ao Início: cascata repete (hoje) × não repete (luxo)
        js("()=>window.__LF.setView('clientes')",2000);js("()=>window.__LF.setView('inicio')",1700)
        t=pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-inicio .tl')][1];const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}")
        for k in range(3): pg.mouse.move(*t);pg.mouse.down();w(380);pg.mouse.move(t[0]+160,t[1]+260);pg.mouse.up();w(700)   # toque: afunda
    v=pg.video.path();c.close();b.close();return v
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30)
with sync_playwright() as pw:
    for lote,nome in (('b','lote-b-janelas'),('c','lote-c-listas')):
        vh=roda(pw,lote,False);vl=roda(pw,lote,True);qh=roda(pw,lote,False,True);ql=roda(pw,lote,True,True)
        subprocess.run(['ffmpeg','-y','-loglevel','error','-ss','1.2','-i',vh,'-ss','1.2','-i',vl,'-filter_complex','[0:v]crop=iw/2:ih/2:0:0,scale=540:-2[a];[1:v]crop=iw/2:ih/2:0:0,scale=540:-2[b];[a][b]hstack=inputs=2','-an','-c:v','libx264','-preset','veryfast','-crf','27','-pix_fmt','yuv420p',OUT+nome+'.mp4'],check=True)
        ims=[[Image.open(p) for p in qh],[Image.open(p) for p in ql]];w0,h0=ims[0][0].size;w1,h1=w0//2,h0//2
        S=Image.new('RGB',(160+7*(w1+10),2*(h1+16)+20),'#f1eef0');d=ImageDraw.Draw(S)
        for r,(lin,nm,cor) in enumerate(zip(ims,('HOJE','LUXO'),('#1d1418','#8d3a69'))):
            y=16+r*(h1+16);d.text((18,y+h1//2-16),nm,font=F,fill=cor)
            for k,im in enumerate(lin): S.paste(im.resize((w1,h1)),(150+k*(w1+10),y))
        S.save(OUT+nome+'-quadros.jpg',quality=84);print(nome,os.path.getsize(OUT+nome+'.mp4'),S.size)
