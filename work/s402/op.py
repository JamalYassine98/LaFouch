# S402 · folha 67a com as 3 opções do cartão de aniversário (adaptado de work/s398/ev.py)
# S399 · esboço 62: os cartões de evento, um por temática do site (a cor é a da temática). Folha só de cartões, em tamanho de leitura.
import json,base64,sys
sys.path.insert(0,'/home/claude/lafouch/work/s349')
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
import comum
L=json.load(open('/tmp/s402/op.json'));T='/tmp/s402/';u=lambda f:'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode()
M='/home/claude/catalogo/media/email/';LG={'https://lafouch.com/media/email/'+f:u(M+f) for f in ('cartao-ouro.png','cartao-vinho.png','cartao-ev-anonovo.png')}
h='<body style="margin:0;background:#fbf7fa;font-family:Arial"><div style="display:grid;grid-template-columns:1fr 1fr;gap:26px 22px;padding:24px 22px 28px">'+''.join('<div><div style="font:600 14px Arial;color:#1d1418;margin:0 0 2px 4px">'+e['n']+'</div>'+e['html']+'</div>' for e in L)+'</div></body>'
for k,v in LG.items(): h=h.replace(k,v)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':690,'height':200},device_scale_factor=2);pg.set_content(h);pg.wait_for_timeout(300);pg.screenshot(path=T+'ev.png',full_page=True);b.close()
im=Image.open(T+'ev.png').convert('RGB');w,hh=im.size;g=40;S=Image.new('RGB',(w+2*g,hh+266),'#f1eef0');d=ImageDraw.Draw(S)
d.text((g,34),'Esboço 67a · cartão de aniversário do Cliente VIP · 3 opções',font=comum.F(40,True),fill='#1d1418')
for i,l in enumerate(['Só para o Cliente VIP: 10%, válido por 30 dias a partir do aniversário, sem código à vista.','O confete fino de pontinhos é o que diferencia o aniversário dos outros cartões.','Recomendo a A: é da família preta do VIP, a quem o presente pertence.']): d.text((g,100+i*36),l,font=comum.F(25),fill='#55484f')
S.paste(im,(g,226));d.rectangle([g-1,225,g+w,226+hh],outline='#cfc6cb');S.save('/home/claude/lafouch/work/s402/67a-cartao-aniversario-opcoes.jpg',quality=88);print(S.size)
