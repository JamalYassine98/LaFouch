import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
IC_EST='<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'
IC_ACE='<path d="M4 7h16v10H4z"/><path d="M8 7V5h8v2"/>'
def tela(pw,esc,prop):
  b,pg,w=ap.abre(pw,'estoque',esc,'celular',base=True);w(600)
  if prop:
    # 2 fotos tratadas esperando cadastro (mesmo número do selo do '+' no aprovado 58h)
    pg.evaluate("()=>{const S=window.__LF.S;S.estPend=[{id:'a',ts:Date.now(),t:'',n:''},{id:'b',ts:Date.now(),t:'',n:''}]}")
  pg.evaluate("()=>document.getElementById('btnAdd').click()");w(900)
  if prop:
    cls=pg.evaluate("()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length==0&&x.textContent.trim()=='13');return e?e.className+'|'+getComputedStyle(e).backgroundColor:''}")
    print('selo',cls)
    pg.evaluate("""([ie,ia])=>{const seta='<svg class="adSeta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
      const sv=p=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
      const n=window.__LF.S.estPend.length;
      const selo='<b style="min-width:22px;height:22px;padding:0 7px;border-radius:99px;background:rgb(221,51,51);color:#fff;font-size:12px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums">'+n+'</b>';
      document.getElementById('addPhotoB').innerHTML='';
      const m=document.getElementById('addMenuB');
      m.innerHTML='<button class="adRow" type="button">'+sv(ie)+'<span>Completar peça do Estúdio</span>'+selo+seta+'</button>'+
        m.querySelector('#addToLote').outerHTML+
        '<button class="adRow" type="button">'+sv(ia)+'<span>Acessório</span>'+seta+'</button>';
    }""",[IC_EST,IC_ACE]);w(500)
  f='p%d%d.png'%(esc,prop);pg.screenshot(path=f);b.close();return f
with sync_playwright() as pw:
  fs=[tela(pw,1,0),tela(pw,1,1),tela(pw,0,1)]
ims=[Image.open(f) for f in fs];W,H=ims[0].size
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',30);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',24)
out=Image.new('RGB',(W*3+80,H+150),(247,243,238));d=ImageDraw.Draw(out)
tt=[('HOJE','escuro'),('PROPOSTA 65d · janela Adicionar','escuro'),('PROPOSTA 65d','claro')]
for i,(im,(a,c)) in enumerate(zip(ims,tt)):
  x=20+i*(W+20);out.paste(im,(x,130));d.text((x,30),a,font=F,fill=(141,58,105) if i else (90,90,90));d.text((x,75),c,font=F2,fill=(110,100,105))
out.save('esboco_65d_janela_adicionar.jpg',quality=88);print('ok')
