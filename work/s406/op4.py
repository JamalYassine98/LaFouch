# S406 · monta a prancha 73 (opções do cartão de Halloween sobre o fundo da temática do site)
import json,base64,os,sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import comum
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
L=json.load(open('/tmp/s406/op4.json'))
def dados(h):
    for f in os.listdir('/home/claude/catalogo/media/email/'):
        if f.startswith('cartao-'): h=h.replace('https://lafouch.com/media/email/'+f,'data:image/png;base64,'+base64.b64encode(open('/home/claude/catalogo/media/email/'+f,'rb').read()).decode())
    for n in ('branco','rose','champ'): h=h.replace('https://lafouch.com/media/email/LOGO-'+n,'data:image/png;base64,'+base64.b64encode(open('/tmp/s406/logo-'+n+'.png','rb').read()).decode())
    return h
h=''.join('<div style="padding:12px 14px 18px"><div style="font:600 14px Arial;color:#55484f;margin:0 0 6px 4px">'+n+'</div>'+dados(x)+'</div>' for n,x in L)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':760,'height':400},device_scale_factor=2)
    pg.set_content('<body style="margin:0;background:#fbf7fa"><div style="display:grid;grid-template-columns:1fr 1fr;padding:10px">'+h+'</div></body>');pg.wait_for_timeout(400);pg.screenshot(path='/tmp/s406/op4.png',full_page=True);b.close()
im=Image.open('/tmp/s406/op4.png').convert('RGB');g=40;S=Image.new('RGB',(im.size[0]+2*g,im.size[1]+230),'#f1eef0');d=ImageDraw.Draw(S)
d.text((g,34),'Esboço 73d · Cor do logo no cartão padrão da La Fouch',font=comum.F(40,True),fill='#1d1418')
for i,l in enumerate(['O dourado do logo (#d6b274) puxa para o laranja em cima do vinho. Os cartões de evento seguem a temática;','este é o da loja, então o logo precisa parecer o logo. Base: opção A (vinho do site); o fio também fica rosé, sem dourado.','1 branco · 2 rosé claro · 3 champanhe · 4 o cartão vira claro e o logo fica vinho, como no site.']): d.text((g,94+i*34),l,font=comum.F(24),fill='#55484f')
S.paste(im,(g,210));S.save('/home/claude/lafouch/work/s406/73d-cartao-la-fouch-cor-do-logo.jpg',quality=88);print(S.size)
