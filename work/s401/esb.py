# S401 · monta as pranchas dos e-mails 63a–63c (mesmo método do work/s398/esb.py)
import json,base64,html,sys
sys.path.insert(0,'/home/claude/lafouch/work/s349')
from playwright.sync_api import sync_playwright
from PIL import Image
import comum;comum.OUT='/home/claude/lafouch/work/s401/'
L=json.load(open('/tmp/s401/e.json'));T='/tmp/s401/';T8='/tmp/s398/'
u=lambda f:'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode()
LG={'https://lafouch.com/media/email/logo.png':u('/home/claude/catalogo/media/email/logo.png'),'https://lafouch.com/media/email/cartao-ouro.png':u('/home/claude/catalogo/media/email/cartao-ouro.png'),'https://lafouch.com/media/email/cartao-vinho.png':u('/home/claude/catalogo/media/email/cartao-vinho.png')}
ANT={'60a':'/home/claude/lafouch/work/s396/60a-email-cartao-depois-da-entrega.jpg','60b':'/home/claude/lafouch/work/s396/60b-email-presente-para-amiga.jpg','60c':'/home/claude/lafouch/work/s396/60c-email-sua-amiga-comprou.jpg','60e':'/home/claude/lafouch/work/s396/60e-email-cliente-fiel.jpg'}
E=open('/home/claude/lafouch/work/s396/esb.py').read();exec(E[E.index('def cabe'):E.index('with sync_playwright')].replace("e['html'].replace('https://lafouch.com/media/email/logo.png',lg)","troca(e['html'])"))
def troca(h):
    for k,v in LG.items(): h=h.replace(k,v)
    return h
def antes(k,arq):
    # o lado "antes" = a PROPOSTA do esboço anterior (metade direita da prancha), para comparar logo e cartão
    im=Image.open(ANT[k]).convert('RGB');w,h=im.size;x0=40+780+40;px=im.load()
    br=lambda y:all(min(px[x0+400,y+d])>=250 for d in range(6));y0=next(y for y in range(120,700) if br(y))
    im.crop((x0,y0,x0+780,h-41)).save(arq)
import inspect
exec(inspect.getsource(comum.prancha).replace("def prancha(","def prancha2(").replace("('HOJE','PROPOSTA')","ROT"),comum.__dict__)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':390,'height':120},device_scale_factor=2)
    for e in L:
        if e['hoje']: antes(e['hoje'],T+'h.png')
        else: nota(pg,e['nota'],T+'h.png')
        foto(pg,e,T+'p.png');iguala(T+'h.png',T+'p.png')
        comum.ROT=('ANTES ('+e['hoje']+')','AGORA') if e['hoje'] else ('HOJE','PROPOSTA');comum.prancha2(e['arq']+'.jpg','Esboço '+e['arq'][:3]+' · e-mail · '+e['nome'],e['sub'],T+'h.png',T+'p.png')
    b.close()
