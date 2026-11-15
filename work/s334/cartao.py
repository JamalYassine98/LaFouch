# S334: foto do cartão "Atualização do app" com o APK novo pronto (app real, estado simulado), escuro e claro.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
from PIL import Image
ims=[]
with sync_playwright() as pw:
    for esc in (True,False):
        b,pg,w=base.abre(pw,'ajustes',esc)
        pg.evaluate("()=>{const A=window.__apk.estado;A.n=525;A.tam=18500000;A.est='pronto';const L=window.__LF;L.S.ajAberta='upd';L.render()}");w(1200)
        pg.evaluate("()=>{const c=document.getElementById('updCard');c&&c.scrollIntoView({block:'center'})}");w(500)
        tem=pg.evaluate("()=>{const c=document.getElementById('updCard');const r=c&&c.getBoundingClientRect();return r?[r.left,r.top,r.width,r.height]:null}")
        p='/tmp/s330/card_%d.png'%esc;pg.screenshot(path=p);print(esc,tem);ims.append(Image.open(p));b.close()
S=Image.new('RGB',(ims[0].width*2+30,ims[0].height),'#f1eef0');S.paste(ims[0],(0,0));S.paste(ims[1],(ims[0].width+30,0));S.save('/home/claude/lafouch/work/s334/cartao-atualizacao-apk.jpg',quality=86)
S.resize((S.width//2,S.height//2)).save('/tmp/s330/card.jpg',quality=80)
