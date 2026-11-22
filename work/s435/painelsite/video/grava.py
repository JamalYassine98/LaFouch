# Esboço 58e v4 (S435, 22/11 02:15) — destaque do site em vídeo, HOJE × PROPOSTA, no destaque que o cliente vê (#hdst).
# PROPOSTA (aprovada a ideia 22/11 02:11): um só movimento —
#  1) a foto surge já em respiração como uma versão minúscula e borrada da MESMA foto enquadrada (nunca cartão branco, nunca pisca);
#  2) a foto final aparece por cima e fica nítida (fusão), sem recomeçar o movimento;
#  3) respiração num só sentido: 3% em 10 s; cada produto fica 10 s;
#  4) troca: a foto que sai continua se movendo enquanto some e a nova já entra em movimento (fusão 1,4 s);
#  5) uma curva e um tempo para tudo: cubic-bezier(.4,0,.2,1), 1,4 s.
# Simulação numa cópia de teste do site (kit); o "como fazer" de verdade vai ao SITE.
import sys,os,json,shutil,subprocess;sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.argv=sys.argv[:1];import kit
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/painelsite/video/'
kit.prep_site();kit.serve(kit.SITE,kit.PS);U='http://localhost:%d/?kit=1'%kit.PS
DUR=23000
CUR='cubic-bezier(.4,0,.2,1)';T='1.4s'

def ctx(pw,nome,video=True):
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  kw=dict(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
  if video:
    d='/tmp/v58_'+nome;shutil.rmtree(d,ignore_errors=True);kw.update(record_video_dir=d,record_video_size={'width':390,'height':844})
  c=b.new_context(**kw)
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
  c.add_init_script("try{localStorage.setItem('lf_lang','pt');sessionStorage.setItem('lf_ni','1')}catch(e){}")
  return b,c

# rodízio: o site troca a cada 6 s; na proposta cada produto fica 10 s (uma respiração inteira)
def gira(ms): return "(function(){var si=window.setInterval;window.setInterval=function(f,t){if(t===6000)t=%d;return si.apply(this,[f,t].concat([].slice.call(arguments,2)))}})();"%ms

# 1ª passada: a versão minúscula (40 px) de cada foto JÁ ENQUADRADA — no site real ela vem pronta junto com o catálogo
def miniaturas():
  with sync_playwright() as pw:
    b,c=ctx(pw,'mini',video=False);c.add_init_script(gira(1500));pg=c.new_page();pg.goto(U)
    M={}
    for k in range(40):
      M.update(pg.evaluate("""()=>{const o={},b=document.querySelector('#hdst [data-open]'),im=document.querySelector('#hdst .hdi img');
        if(b&&im&&im.complete&&im.naturalWidth&&/^blob:/.test(im.src)&&!im.classList.contains('lfq0')){const w=40,h=Math.max(1,Math.round(40*im.naturalHeight/im.naturalWidth)),cv=document.createElement('canvas');cv.width=w;cv.height=h;cv.getContext('2d').drawImage(im,0,0,w,h);o[b.getAttribute('data-open')]=[cv.toDataURL('image/jpeg',.7),im.naturalWidth+'/'+im.naturalHeight]}return o}"""))
      pg.wait_for_timeout(250)
    c.close();b.close()
  return M

def proposta_js(M):
  css=("#hdst .hdi>img,#hdst .hdi>.p58q{grid-area:1/1}"
   "#hdst .hdi>img{opacity:0!important;transition:none!important;animation:none!important;transform:none!important}"
   "#hdst .hdi.out>img{transform:none!important}"
   "#hdst .hdi>img.p58ok{opacity:1!important;transition:opacity %s %s!important;animation:p58r 10s %s forwards!important}"
   "#hdst .hdi>.p58q{width:86%%;max-height:330px;background:center/contain no-repeat;filter:blur(10px);opacity:0;transition:opacity %s %s;animation:p58r 10s %s forwards;pointer-events:none}"
   "#hdst .hdi>.p58q.on{opacity:1}#hdst .hdi>.p58q.fim{opacity:0}"
   "#hdst .hdi>.p58g{position:absolute;background:center/contain no-repeat;margin:0;pointer-events:none;z-index:2;opacity:1;transition:opacity %s %s;animation:p58r 10s %s forwards}"
   "#hdst .hdi>.p58g.sai{opacity:0}"
   "@keyframes p58r{from{scale:1;translate:0 0}to{scale:1.03;translate:0 -.6%%}}")%(T,CUR,CUR,T,CUR,CUR,T,CUR,CUR)
  return gira(10000)+r"""
window.__p58=1;var P58M=%s;(function go(){if(!document.documentElement||!document.head){return setTimeout(go,5)}
document.documentElement.setAttribute('data-ev','bf');var st=document.createElement('style');st.textContent=%s;document.head.appendChild(st);
var hdAtual=null,t0=0,ult=null,k0=null,tk=0,vis=null;
function sai(g){g.classList.add('sai');setTimeout(function(){g.remove()},1500)}function poeQ(hd,ref){if(!P58M[ref])return;var q=document.createElement('div');q.className='p58q';q.style.cssText='background-image:url('+P58M[ref][0]+');aspect-ratio:'+P58M[ref][1];hd.insertBefore(q,hd.firstChild);atraso(q,t0);requestAnimationFrame(function(){requestAnimationFrame(function(){q.classList.add('on')})})}
function atraso(el,t){el.style.animationDelay=(-(performance.now()-t)/1000)+'s'}
setInterval(function(){var hd=document.querySelector('#hdst .hdi');if(!hd)return;var bt=hd.closest('[data-open]')||hd,ref=bt.getAttribute('data-open');
 if(hd!==hdAtual){var antigo=vis;hdAtual=hd;t0=performance.now();
  if(antigo&&antigo._r&&antigo._snap){var r0=antigo._r,g=document.createElement('div');g.style.backgroundImage='url('+antigo._snap+')';g.className='p58g';
   g.style.cssText='left:'+r0[0]+'px;top:'+r0[1]+'px;width:'+r0[2]+'px;height:'+r0[3]+'px;background-image:url("'+antigo._snap+'")';
   atraso(g,antigo._t0);hd.appendChild(g);
   hd._ghost=g;setTimeout(function(){if(hd._ghost===g)sai(g)},3000)}
  poeQ(hd,ref);
  vis=null}
 var im=hd.querySelector('img');if(!im)return;if(!vis&&!hd.querySelector('.p58q'))poeQ(hd,ref);
 var pronto=im.complete&&im.naturalWidth&&!im.classList.contains('lfq0')&&/^blob:/.test(im.src||'');
 if(im!==ult||im.src!==k0){ult=im;k0=im.src;tk=performance.now()}
 if(pronto&&performance.now()-tk>350&&performance.now()-t0>700&&!im.classList.contains('p58ok')){try{var cv=document.createElement('canvas');cv.width=im.naturalWidth;cv.height=im.naturalHeight;cv.getContext('2d').drawImage(im,0,0);im._snap=cv.toDataURL('image/png')}catch(e){}im._t0=t0;atraso(im,t0);im.classList.add('p58ok');vis=im;if(hd._ghost){var gg=hd._ghost;hd._ghost=null;sai(gg)}var q2=hd.querySelector('.p58q');if(q2)setTimeout(function(){q2.classList.add('fim');setTimeout(function(){q2.remove()},1500)},1400)}
 if(vis===im&&im.offsetWidth>4)im._r=[im.offsetLeft,im.offsetTop,im.offsetWidth,im.offsetHeight];
},30)})()"""%(json.dumps(M),json.dumps(css))

def grava(nome,js=None):
  with sync_playwright() as pw:
    b,c=ctx(pw,nome)
    if js: c.add_init_script(js)
    pg=c.new_page();pg.goto(U);pg.wait_for_timeout(DUR)
    v=pg.video.path();c.close();b.close()
  return v

if __name__=='__main__':
  M=miniaturas();print('miniaturas',len(M))
  hoje=grava('hoje');prop=grava('prop',proposta_js(M))
  f=O+'esboco_58e_efeitos.mp4'
  subprocess.run(['ffmpeg','-y','-loglevel','error','-i',hoje,'-i',prop,'-filter_complex',
   "[0:v]scale=390:844,pad=410:904:10:60:color=0x11141a,drawtext=text='HOJE · pisca ao abrir · zoom rápido · troca passa pelo branco':fontcolor=white:fontsize=12:x=12:y=20[a];"
   "[1:v]scale=390:844,pad=410:904:10:60:color=0x11141a,drawtext=text='PROPOSTA · surge borrada e fica nítida · respira 3%% em 10 s · troca em fusão':fontcolor=white:fontsize=12:x=12:y=20[b];[a][b]hstack=inputs=2,format=yuv420p[o]",
   '-map','[o]','-c:v','libx264','-preset','veryfast','-crf','23','-t',str(DUR/1000-0.5),f],check=True)
  print('ok',f)
