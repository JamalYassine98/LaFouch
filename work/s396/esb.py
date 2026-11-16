import json,base64,html,sys
sys.path.insert(0,'/home/claude/lafouch/work/s349')
from playwright.sync_api import sync_playwright
from PIL import Image
import comum;comum.OUT='/home/claude/lafouch/work/s396/'
L=json.load(open('/tmp/s396/e.json'));lg='data:image/png;base64,'+base64.b64encode(open('/home/claude/catalogo/media/email/logo.png','rb').read()).decode();T='/tmp/s396/'
def cabe(a): return ('<div style="padding:14px 16px 12px;border-bottom:1px solid #e6e1e4;background:#fff"><div style="font:600 19px Arial;color:#1d1418;line-height:1.3">'+html.escape(a)+'</div><div style="display:flex;gap:10px;align-items:center;margin-top:12px"><div style="width:38px;height:38px;border-radius:50%;background:#8d3a69;color:#fff;font:600 17px Arial;display:flex;align-items:center;justify-content:center">L</div><div><div style="font:600 14px Arial;color:#1d1418">La Fouch</div><div style="font:12px Arial;color:#6b5f66">nao-responda@lafouch.com · para mim</div></div></div></div>')
def foto(pg,e,arq):
    pg.set_content('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#fff">'+cabe(e['assunto'])+'<iframe id="f" style="border:0;width:100%;display:block" scrolling="no"></iframe></body></html>')
    pg.evaluate("(h)=>new Promise(r=>{const f=document.querySelector('#f');f.onload=()=>{f.style.height=(f.contentDocument.documentElement.scrollHeight+8)+'px';r()};f.srcdoc=h})",e['html'].replace('https://lafouch.com/media/email/logo.png',lg));pg.wait_for_timeout(250);pg.screenshot(path=arq,full_page=True)
def iguala(a,b):
    A,B=Image.open(a).convert('RGB'),Image.open(b).convert('RGB');h=max(A.size[1],B.size[1])
    for im,f in ((A,a),(B,b)):
        N=Image.new('RGB',(im.size[0],h),'#ffffff');N.paste(im,(0,0));N.save(f)
def nota(pg,txt,arq):
    pg.set_content('<body style="margin:0;background:#fff;font:15px/1.5 Arial;color:#6b5f66"><div style="padding:110px 34px;text-align:center">'+txt+'</div></body>');pg.screenshot(path=arq,full_page=True)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':390,'height':120},device_scale_factor=2)
    # Hoje do 60a: o cartão na tela de pagamento, antes de pagar (foto real da tela, do esboço 59a)
    H=Image.open('/tmp/s395/a_h.png').convert('RGB');H.save(T+'ah.png');foto(pg,L[0],T+'ap.png');iguala(T+'ah.png',T+'ap.png')
    nota(pg,'Hoje não existe um e-mail separado.<br><br>O cartão da amiga aparece junto com o do cliente, na mesma hora.',T+'bh.png');foto(pg,L[1],T+'bp.png');iguala(T+'bh.png',T+'bp.png');b.close()
comum.prancha('60a-email-cartao-depois-da-entrega.jpg','Esboço 60a · e-mail · o cartão chega depois da entrega',['Hoje: o cartão aparece na tela de pagamento, antes de o cliente pagar.','Proposta: some das telas; quando você marca o pedido como entregue, o cliente recebe este e-mail. Um presente só, um botão só, sem código à vista.'],T+'ah.png',T+'ap.png')
comum.prancha('60b-email-presente-para-amiga.jpg','Esboço 60b · e-mail · o cartão da amiga, uns dias depois',['Hoje: o cartão da amiga vem colado ao do cliente.','Proposta (minha recomendação): sai sozinho, cerca de 7 dias depois da entrega, quando a pessoa já usou os óculos.'],T+'bh.png',T+'bp.png')
