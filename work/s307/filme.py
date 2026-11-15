# S307: vídeo simples de COMO É HOJE a tela de pagamento (PIX) do site: 0 min, 10 min (link do comprovante), comprovante enviado, 30 min (reserva encerrada).
# Telas reais do site (cópia do kit), relógio adiantado no simulador; nada vai para produção.
import sys,os,glob,shutil,subprocess,json,time;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.prep_site();kit.serve(kit.SITE,kit.PS)
OUT='/tmp/s307';vd=OUT+'/vid';shutil.rmtree(vd,ignore_errors=True);os.makedirs(vd)
FAIXA="""(t)=>{let d=document.getElementById('s307');if(!d){d=document.createElement('div');d.id='s307';d.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#111;color:#fff;font:600 15px/1.35 system-ui,sans-serif;padding:12px 16px 14px;text-align:center';document.body.appendChild(d)}d.innerHTML=t}"""
def roda(pw,cenas,nome):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    d=vd+'/'+nome;os.makedirs(d)
    c=b.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',record_video_dir=d,record_video_size={'width':780,'height':1688})
    def rota(r):
        u=r.request.url
        if u.startswith('http://localhost'): return r.continue_()
        if 'firestore.googleapis.com' in u and r.request.method=='POST': return r.fulfill(status=200,content_type='application/json',body='{}')
        return r.abort()
    c.route('**/*',rota)
    c.add_init_script("""(()=>{const n=Date.now();localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);
      localStorage.setItem('lf_ped',JSON.stringify([{id:'kitped1',cod:'LF-4821',ts:n,total:650000,brl:489.93,ent:'retirada',pag:'pix',est:'pagar',rx:n+30*60000,rd:0,itens:[{ref:'SL2210',nome:'Óculos de sol Hexagonal',q:1,cor:''}]}]));
      try{sessionStorage.setItem('lf_ni','1')}catch(e){}})()"""%(kit.CONTA,kit.AUTH))
    pg=c.new_page();w=pg.wait_for_timeout
    pg.clock.install()
    pg.goto('http://localhost:8811/?kit=1');w(1500)
    cenas(pg,w)
    v=pg.video.path();c.close();b.close();return v
def abre(pg,w):
    pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");w(900)
    ok=pg.evaluate("""()=>{let e=document.querySelector('[data-id=kitped1]');if(!e){const t=[...document.querySelectorAll('#layer button,#layer [data-mct]')].find(b=>/Pedidos/i.test(b.innerText||''));t&&t.click()}return !!e}""");w(700)
    pg.evaluate("()=>{const e=document.querySelector('[data-id=kitped1]');e&&e.click()}");w(1200)
def foto(pg,n): pg.screenshot(path=OUT+'/'+n+'.png')
def c1(pg,w):
    abre(pg,w)
    pg.evaluate(FAIXA,'HOJE · PIX · 0 min<br><span style="font-weight:400">O site espera o PIX sozinho. Sem botão de comprovante.</span>');w(4200);foto(pg,'1_0min')
    pg.clock.fast_forward(10*60000+2000);w(600)
    pg.evaluate("()=>{const x=document.getElementById('pgcl');x&&x.scrollIntoView({block:'center'})}")
    pg.evaluate(FAIXA,'10 min sem confirmar<br><span style="font-weight:400">Só agora aparece “Envie o comprovante”.</span>');w(4500);foto(pg,'2_10min')
    pg.set_input_files('#pgf',OUT+'/comp.png');w(2500)
    pg.evaluate(FAIXA,'Cliente enviou o comprovante<br><span style="font-weight:400">A peça fica segura até você conferir no app.</span>');w(4500);foto(pg,'3_enviado')
def c2(pg,w):
    abre(pg,w)
    pg.clock.fast_forward(30*60000+3000);w(900)
    pg.evaluate(FAIXA,'Não enviou nada até o prazo<br><span style="font-weight:400">Reserva encerrada. Quem já pagou só tem o WhatsApp.</span>');w(5000);foto(pg,'4_prazo')
from PIL import Image;Image.new('RGB',(600,900),(245,245,245)).save(OUT+'/comp.png')
with sync_playwright() as pw:
    v1=roda(pw,c1,'a');v2=roda(pw,c2,'b')
for i,v in enumerate((v1,v2)):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss','2.6','-i',v,'-an','-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-r','25','-vf','scale=540:-2:flags=lanczos',OUT+'/p%d.mp4'%i],check=True)
open(OUT+'/l.txt','w').write("file 'p0.mp4'\nfile 'p1.mp4'\n")
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',OUT+'/l.txt','-c','copy','-movflags','+faststart',OUT+'/pagamento-hoje.mp4'],check=True)
print(os.path.getsize(OUT+'/pagamento-hoje.mp4'))
