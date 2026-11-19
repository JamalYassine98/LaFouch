exec(open('prova.py').read().split("with sync_playwright")[0])
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
FIX=r"""()=>{const c=document.getElementById('c_cfg');if(c&&c.classList.contains('p207x')){c.hidden=false;c.classList.remove('p207x');const l=document.querySelector('.p207l.cfg [data-lin=c_cfg]');l&&l.remove();const bx=document.querySelector('.p207l.cfg');bx&&c.parentNode.insertBefore(c,bx)}}"""
fs=[]
with sync_playwright() as pw:
  for fase in ('hoje','prop'):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark')
    c.route('**/*',rota);pg=c.new_page();pg.goto('https://lafouch.com/admin.html?aba=cfg&app=2');pg.wait_for_timeout(1500)
    pg.evaluate("()=>{document.querySelectorAll('main.page').forEach(m=>m.hidden=m.id!=='v_cfg');const l=document.getElementById('login')||document.querySelector('#lg,.login');document.querySelectorAll('#lg,#login,.lgw').forEach(e=>e.hidden=true);const sh=document.getElementById('shell');if(sh)sh.hidden=false;document.getElementById('tgl').className='tg';document.getElementById('onl').textContent='O site está fora do ar';document.getElementById('onl2').textContent='Os visitantes veem a mensagem de aviso.';dispatchEvent(new Event('resize'))}");pg.wait_for_timeout(500)
    if fase=='prop': pg.evaluate(FIX);pg.wait_for_timeout(300)
    f='/tmp/pn_%s.png'%fase;pg.screenshot(path=f);fs.append(f);b.close()
ims=[Image.open(f).convert('RGB') for f in fs];w,h=ims[0].size;S=Image.new('RGB',(40+2*(w+40),h+150),(17,20,26));d=ImageDraw.Draw(S)
for i,(t,s) in enumerate((('HOJE · painel com o site DESLIGADO','o interruptor some (vira linha sem nome)'),('PROPOSTA · conserto','o cartão "Site fora do ar" + interruptor fica sempre no topo'))):
  x=40+i*(w+40);d.text((x,24),t,font=F(34),fill=(235,235,240));d.text((x,72),s,font=F(24),fill=(140,150,165));S.paste(ims[i],(x,120))
S.save('/home/claude/lafouch/work/site-painel/esboco_painel_interruptor.jpg',quality=90);print('ok')
