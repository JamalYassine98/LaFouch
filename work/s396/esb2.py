import json,base64,html,sys
sys.path.insert(0,'/home/claude/lafouch/work/s349')
from playwright.sync_api import sync_playwright
from PIL import Image
import comum;comum.OUT='/home/claude/lafouch/work/s396/'
L=json.load(open('/tmp/s396/e2.json'));lg='data:image/png;base64,'+base64.b64encode(open('/home/claude/catalogo/media/email/logo.png','rb').read()).decode();T='/tmp/s396/'
E=open('/home/claude/lafouch/work/s396/esb.py').read();exec(E[E.index('def cabe'):E.index('with sync_playwright')])
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':390,'height':120},device_scale_factor=2)
    for e in L:
        nota(pg,e['hoje'],T+'h.png');foto(pg,e,T+'p.png');iguala(T+'h.png',T+'p.png')
        comum.prancha(e['arq']+'.jpg','Esboço '+e['arq'][:3]+' · e-mail · '+e['nome'],e['sub'],T+'h.png',T+'p.png')
    b.close()
