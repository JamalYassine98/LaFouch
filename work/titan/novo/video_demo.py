# Vídeo: o Titan (protótipo com a ficha do esboço 62) conferindo Preços › Regras no app real, com a autoprova.
import sys,os,glob,shutil,subprocess,re
ARGV=sys.argv[:]
sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,kit
sys.path.insert(0,'/home/claude/lafouch/work/titan/fichas');from fichas import FICHAS
src=open('/home/claude/lafouch/work/titan/fichas/roda.py').read()
ACHA=re.search(r'ACHA=r"""(.*?)"""',src,re.S).group(1);ESTRAGA=re.search(r'ESTRAGA=r"""(.*?)"""',src,re.S).group(1)
from playwright.sync_api import sync_playwright
F=[f for f in FICHAS if f['n']=='62'][0]
D='/tmp/vid';shutil.rmtree(D,ignore_errors=True);os.makedirs(D)
CSS="""#tt{position:fixed;left:12px;right:12px;bottom:96px;z-index:99999;background:rgba(20,22,30,.96);border:1px solid #c2577f;border-radius:14px;padding:12px 14px;color:#fff;font:600 15px Inter,system-ui;box-shadow:0 8px 30px rgba(0,0,0,.5)}
#tt small{display:block;font-weight:400;color:#aab;font-size:13px;margin-top:2px}.bx{position:fixed;z-index:99998;border:3px solid;border-radius:8px;pointer-events:none}
.bx i{position:absolute;left:-3px;top:-24px;font:600 12px Inter,system-ui;font-style:normal;padding:2px 6px;border-radius:6px;color:#fff;white-space:nowrap;max-width:360px;overflow:hidden;text-overflow:ellipsis}"""
SAY="""([a,b])=>{let t=document.getElementById('tt');if(!t){const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);t=document.createElement('div');t.id='tt';document.body.appendChild(t)}t.innerHTML=a+(b?'<small>'+b+'</small>':'')}"""%CSS
BOX="""([pc,cor,lab])=>{document.querySelectorAll('.bx').forEach(x=>x.remove());const own=e=>[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent).join('').replace(/\\s+/g,' ').trim();
 const all=[...document.querySelectorAll('body *')].filter(e=>!e.closest('nav,#tt'));const e=all.find(e=>{const r=e.getBoundingClientRect();return r.width>2&&(pc.exato?own(e)==pc.t:own(e).includes(pc.t))});if(!e)return 0;
 let L=e,p=e;for(let i=0;i<8&&p.parentElement;i++){p=p.parentElement;if(p.getBoundingClientRect().height>110)break;L=p}
 L.scrollIntoView({block:'center',behavior:'instant'});setTimeout(()=>{const r=L.getBoundingClientRect();const b=document.createElement('div');b.className='bx';b.style.cssText+=';left:'+(r.left-4)+'px;top:'+(r.top-4)+'px;width:'+(r.width+8)+'px;height:'+(r.height+8)+'px;border-color:'+cor;
 b.innerHTML='<i style="background:'+cor+'">'+lab+'</i>';document.body.appendChild(b)},300);return 1}"""
with sync_playwright() as pw:
  b=kit.sim.navegador(pw)
  c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme='dark',locale='pt-BR',has_touch=True,is_mobile=True,service_workers='block',bypass_csp=True,record_video_dir=D,record_video_size={'width':390,'height':844})
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
  pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);w=pg.wait_for_timeout;w(1200)
  say=lambda a,b='':pg.evaluate(SAY,[a,b])
  say('TITAN · antes de publicar','vai conferir Preços › Regras contra o esboço 62 aprovado');w(2600)
  say('1 · Abrindo pelo caminho','Início › Preços');pg.evaluate("()=>__LF.inicioGo('prec')");w(1800)
  say('1 · Abrindo pelo caminho','Início › Preços › Regras');pg.evaluate("()=>{const b=document.querySelector('[data-act=tiAbre][data-id=regras]');b&&b.click()}");w(1800)
  pg.evaluate(BOX,[{'t':'Regras','exato':1},'#4fbf7f','tela certa: Regras ✓']);say('2 · Confere se é a tela certa','o título é “Regras” ✓');w(2200)
  # autoprova
  pc={'t':'CADA VENDA COBRE'};say('3 · Se testa antes','estraga de propósito o título “CADA VENDA COBRE”…');pg.evaluate(BOX,[pc,'#e6b450','vou estragar']);w(1600)
  pg.evaluate(ESTRAGA,pc);out=pg.evaluate(ACHA,{'pecas':[pc],'ausente':[]})
  pg.evaluate(BOX,[{'t':'X','exato':1},'#e5484d','estraguei'])
  say('3 · Se testa antes','pegou o estrago ✓ — a rodada vale' if out else 'NÃO pegou — a rodada não vale');w(2400)
  pg.evaluate("()=>{const b=document.querySelector('[data-act=tiAbre][data-id=regras]');__LF.inicioGo('prec');setTimeout(()=>{document.querySelector('[data-act=tiAbre][data-id=regras]').click()},400)}");w(1600);pg.evaluate("()=>document.querySelectorAll('.bx').forEach(x=>x.remove())")
  say('4 · Compara peça por peça','com o que o esboço 62 aprovou');w(1600)
  res=pg.evaluate(ACHA,{'pecas':F['pecas'],'ausente':[]});bad={p:m for p,m in res}
  n=0
  for pc in F['pecas']:
    m=bad.get(pc['t'])
    if m and m.startswith('NÃO ACHOU'):m='não é como o aprovado (texto da linha diferente)'
    if m:m=re.sub(r'valor \S+ não está na linha','valor não está à direita como no aprovado',m)
    ok=pg.evaluate(BOX,[pc,'#e5484d' if m else '#4fbf7f',(pc['t']+' · '+m) if m else pc['t']+' ✓'])
    if not ok:
      alt={'IVA':'IVA','Colchão':'Colchão','Cotação nos preços':'Cotação nos preços','Vendas por mês':'Vendas','Seu jeito de cobrar':'jeito'}.get(pc['t'],pc['t'])
      pg.evaluate(BOX,[{'t':alt},'#e5484d',pc['t']+' · '+(m or '')])
    if m:n+=1
    say('4 · Compara peça por peça',(pc['t']+': '+m) if m else pc['t']+' igual ao aprovado ✓');w(1500 if m else 900)
  pg.evaluate("()=>document.querySelectorAll('.bx').forEach(x=>x.remove())");pg.evaluate("()=>scrollTo(0,0)")
  say('5 · Resultado: TRAVA a publicação','%d de %d peças diferentes do esboço 62 · vai para a APP com as fotos'%(n,len(F['pecas'])));w(3500)
  v=pg.video.path();c.close();b.close()
out='/home/claude/lafouch/work/titan/novo/video_titan_conferindo_regras.mp4'
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',v,'-c:v','libx264','-preset','veryfast','-pix_fmt','yuv420p','-movflags','+faststart',out]);print(out,n)
