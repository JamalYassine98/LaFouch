# S208 esboço: posição do "Últimas unidades" (3 ideias, cada uma num arquivo)
import sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
BASE=""".card .ph>.stk.u,.hc .hci>.hstk{display:none!important}
.ux{display:inline-flex;align-items:center;gap:6px;font:800 11px Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#d32f2f;white-space:nowrap}
.ux i{width:7px;height:7px;border-radius:50%;background:currentColor;flex:none;animation:uxp 1.6s ease-in-out infinite}
@keyframes uxp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.8)}}
:root[data-theme="dark"] .ux{color:#ff6b6b}
.hc .ux{font-size:11px!important;letter-spacing:.08em!important}.hc .ux.b,.hc .ux.c{font-size:10px!important}.hc .ux.b{letter-spacing:.01em!important;max-width:calc(100% - 20px)}"""
IDEIAS={
 '1':("Abaixo da foto","linha vermelha entre a foto e o nome, sem fundo; nunca encosta nos óculos",
   BASE+".ux.a{margin:8px 0 2px}",
   "(t)=>{document.querySelectorAll('.card .ph>.stk.u,.hc .hci>.hstk').forEach(s=>{const c=s.closest('.card,.hc');if(c.querySelector('.ux'))return;const u=document.createElement('span');u.className='ux a';u.innerHTML='<i></i>'+t(s.textContent);const inf=c.querySelector('.info')||c.querySelector('.hn');inf.parentNode===c.querySelector('.open')||inf.classList.contains('info')?inf.insertBefore(u,inf.firstChild):inf.parentNode.insertBefore(u,inf)})}"),
 '2':("Etiqueta vermelha no canto de cima","fundo vermelho, letra branca, canto superior esquerdo da foto (longe dos óculos)",
   BASE+".ux.b{position:absolute;top:10px;left:10px;z-index:4;max-width:calc(100% - 62px);background:#d32f2f;color:#fff!important;padding:4px 8px;border-radius:7px;font-size:10.5px;text-transform:none;letter-spacing:.01em;box-shadow:0 2px 8px rgba(211,47,47,.25)}.ph,.hci{position:relative}",
   "(t)=>{document.querySelectorAll('.card .ph>.stk.u,.hc .hci>.hstk').forEach(s=>{const p=s.parentNode;if(p.querySelector('.ux'))return;const u=document.createElement('span');u.className='ux b';u.innerHTML='<i></i>'+t(s.textContent);p.appendChild(u)})}"),
 '3':("Na linha do preço","texto vermelho ao lado do preço; a foto fica limpa",
   BASE+".ux.c{margin-left:8px;font-size:10px}.card .pr,.hc .hp{display:inline-flex!important;align-items:center;flex-wrap:wrap;gap:2px}",
   "(t)=>{document.querySelectorAll('.card .ph>.stk.u,.hc .hci>.hstk').forEach(s=>{const c=s.closest('.card,.hc'),pr=c.querySelector('.pr,.hp');if(!pr||c.querySelector('.ux'))return;const u=document.createElement('span');u.className='ux c';u.innerHTML='<i></i>'+t(s.textContent);pr.appendChild(u)})}"),
}
TR="(x)=>x.trim()"
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def tira(pw,ideia,W,H,url,dark,zoom,alvo,out,mob=True):
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=mob,has_touch=mob,locale='es-PY',service_workers='block',color_scheme='dark' if dark else 'light')
    c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_zoom','%d');%s"%(zoom,"localStorage.setItem('lf_theme',JSON.stringify('dark'));" if dark else ''))
    c.route('**/*',rota);pg=c.new_page();pg.goto('http://localhost:8811/'+url);pg.wait_for_timeout(3500)
    if dark: pg.evaluate("()=>document.documentElement.setAttribute('data-theme','dark')")
    css,js=IDEIAS[ideia][2],IDEIAS[ideia][3]
    pg.add_style_tag(content=css);pg.evaluate(js.replace('(t)=>{','()=>{const t=%s;'%TR));pg.wait_for_timeout(600)
    el=pg.evaluate_handle("(s)=>{const u=[...document.querySelectorAll('.ux')].find(x=>x.closest(s));return u?u.closest(s):null}",alvo)
    pg.evaluate("(e)=>e&&e.scrollIntoView({block:'center'})",el);pg.wait_for_timeout(700)
    el.as_element().screenshot(path=out);b.close()
F=lambda s,bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
with sync_playwright() as pw:
  for k,(tit,sub,_,_) in IDEIAS.items():
    P=[('Catálogo · celular · claro','?r=armazones',390,844,0,0,'.card',True),('Catálogo · celular · escuro','?r=armazones',390,844,1,0,'.card',True),('Catálogo · letra maior','?r=armazones',390,844,0,2,'.card',True),('Início · carrossel','',390,844,0,0,'.hc',True),('PC 1440','?r=armazones',1440,900,0,0,'.card',False)]
    ims=[]
    for i,(rot,url,W,H,dk,z,al,mob) in enumerate(P):
      o='/tmp/s208_%s_%d.png'%(k,i);tira(pw,k,W,H,url,dk,z,al,o,mob);ims.append((rot,Image.open(o).convert('RGB')))
    h=760;ims=[(r,im.resize((int(im.width*h/im.height),h))) for r,im in ims]
    Wt=sum(im.width for _,im in ims)+40*(len(ims)+1);B=Image.new('RGB',(Wt,h+260),'#ece6ea');d=ImageDraw.Draw(B)
    d.text((40,30),'S208 · Ideia %s — %s'%(k,tit),font=F(52,1),fill='#2a1a28');d.text((40,100),sub,font=F(30),fill='#6b5d67')
    x=40
    for r,im in ims: d.text((x,170),r,font=F(26,1),fill='#8d3a69');B.paste(im,(x,215));x+=im.width+40
    B.save('/home/claude/lafouch/work/s208/ideia%s.jpg'%k,quality=88)
print('ok')
