# S391: fotografa cada e-mail (como chega no celular, 390 px) — "como é hoje", um arquivo por e-mail
import json,base64,html
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
L=json.load(open('/tmp/s391/emails.json'));ic='data:image/png;base64,'+base64.b64encode(open('/home/claude/catalogo/icon-192.png','rb').read()).decode()
OUT='/home/claude/lafouch/work/s391/'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':390,'height':120},device_scale_factor=2)
    for e in L:
        corpo=e['html'].replace('https://lafouch.com/icon-192.png',ic)
        pg.set_content('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#fff;font-family:Roboto,Arial,sans-serif"><div style="padding:14px 16px 12px;border-bottom:1px solid #e6e1e4"><div style="font:600 19px Arial;color:#1d1418;line-height:1.3">'+html.escape(e['assunto'])+'</div><div style="display:flex;gap:10px;align-items:center;margin-top:12px"><div style="width:38px;height:38px;border-radius:50%;background:#8d3a69;color:#fff;font:600 17px Arial;display:flex;align-items:center;justify-content:center">L</div><div><div style="font:600 14px Arial;color:#1d1418">La Fouch</div><div style="font:12px Arial;color:#6b5f66">nao-responda@lafouch.com · para mim</div></div></div></div><iframe id="f" style="border:0;width:100%;display:block" scrolling="no"></iframe></body></html>')
        pg.evaluate("(h)=>new Promise(r=>{const f=document.querySelector('#f');f.onload=()=>{const d=f.contentDocument;if(!d.body.style.margin&&!/<body/i.test(h))d.body.style.margin='12px 16px';f.style.height=(d.documentElement.scrollHeight+8)+'px';r()};f.srcdoc=h})",corpo);pg.wait_for_timeout(300)
        t='/tmp/s391/'+e['arq']+'.png';pg.screenshot(path=t,full_page=True)
        im=Image.open(t).convert('RGB');w,h=im.size;g=36;tit='Como é hoje · e-mail da La Fouch para o cliente';sub=e['quando']
        d0=ImageDraw.Draw(Image.new('RGB',(4,4)));ls=[];a=''
        for q in sub.split(' '):
            if d0.textlength((a+' '+q).strip(),font=F(24))>w and a: ls.append(a);a=q
            else: a=(a+' '+q).strip()
        ls.append(a);cab=g+44+len(ls)*34+18
        S=Image.new('RGB',(w+2*g,cab+h+g),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,g),tit,font=F(29,True),fill='#1d1418')
        for i,l in enumerate(ls): d.text((g,g+46+i*34),l,font=F(24),fill='#55484f')
        S.paste(im,(g,cab));d.rectangle([g-1,cab-1,g+w,cab+h],outline='#cfc6cb');S.save(OUT+e['arq']+'.jpg',quality=88);print(e['arq'],S.size)
    b.close()
