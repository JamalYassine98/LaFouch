# S392 · esboços 58a–58g: e-mails da La Fouch para o cliente no padrão de luxo (Hoje × Proposta, um arquivo por e-mail). Nada implementado.
import json,base64,html,sys
sys.path.insert(0,'/home/claude/lafouch/work/s349')
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
import comum;comum.OUT='/home/claude/lafouch/work/s391/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
H=json.load(open('/tmp/s391/emails.json'));HJ={e['arq'][:3]:e for e in H}
ic='data:image/png;base64,'+base64.b64encode(open('/home/claude/catalogo/icon-192.png','rb').read()).decode()
V='#8d3a69';T='#1d1418';S='#6b5f66';LN='#eadfe6';SE="Georgia,'Times New Roman',serif";SA="Arial,Helvetica,sans-serif"
def molde(titulo,corpo,rodape='',es=False):
    return ('<!doctype html><html><body style="margin:0;background:#fbf7fa;font-family:'+SA+';padding:28px 14px 22px">'
      '<div style="max-width:440px;margin:0 auto;background:#fff;border-radius:22px;padding:34px 26px 30px">'
      '<div style="text-align:center"><img src="'+ic+'" width="46" height="46" alt="La Fouch" style="border-radius:12px"><div style="font:500 12px '+SA+';letter-spacing:.24em;color:'+V+';margin-top:10px">LA FOUCH</div></div>'
      '<div style="height:1px;background:'+LN+';margin:22px 0 26px"></div>'
      '<h1 style="font:500 27px/1.22 '+SE+';color:'+T+';margin:0 0 14px;text-align:center">'+titulo+'</h1>'+corpo+'</div>'
      '<p style="max-width:440px;margin:16px auto 0;font:12px/1.6 '+SA+';color:#8a7d84;text-align:center">'+(rodape+'<br>' if rodape else '')+'La Fouch · Ciudad del Este, Paraguay · <a href="#" style="color:#8a7d84">lafouch.com</a></p></body></html>')
P=lambda t:'<p style="font:15px/1.6 '+SA+';color:'+S+';margin:0 0 18px;text-align:center">'+t+'</p>'
B=lambda t:'<p style="text-align:center;margin:26px 0 0"><a href="#" style="display:inline-block;padding:15px 34px;border-radius:999px;background:'+V+';color:#fff;font:600 15px '+SA+';text-decoration:none">'+t+'</a></p>'
LK=lambda t:'<p style="text-align:center;margin:16px 0 0"><a href="#" style="font:14px '+SA+';color:'+V+';text-decoration:underline">'+t+'</a></p>'
I=lambda t:'<i style="color:'+V+'">'+t+'</i>'
PQ=lambda t:'<p style="font:12.5px/1.6 '+SA+';color:#8a7d84;margin:22px 0 0;text-align:center">'+t+'</p>'
def codigo(c):
    return '<div style="border-top:1px solid '+LN+';border-bottom:1px solid '+LN+';padding:20px 0;margin:6px 0 0;text-align:center;font:500 38px/1 '+SE+';letter-spacing:.24em;color:'+T+';padding-left:.24em">'+c+'</div>'
def cartao(tit,cod,val,cheio=True):
    bg,fg,sub,bd=('#2b1a2a','#fff','#d9c3d0','#2b1a2a') if cheio else ('#fff',T,S,LN)
    return ('<div style="border-radius:18px;background:'+bg+';border:1px solid '+bd+';padding:22px 22px 20px;margin:8px 0 0"><div style="font:500 11px '+SA+';letter-spacing:.24em;color:'+sub+'">LA FOUCH</div>'
      '<div style="font:500 24px/1.2 '+SE+';color:'+fg+';margin:10px 0 14px">'+tit+'</div><div style="height:1px;background:'+('#4a3447' if cheio else LN)+'"></div>'
      '<div style="font:500 21px '+SE+';letter-spacing:.14em;color:'+fg+';margin:14px 0 6px">'+cod+'</div><div style="font:12.5px '+SA+';color:'+sub+'">'+val+'</div></div>')
def linha(a,b,forte=False):
    return '<tr><td style="padding:12px 0;border-bottom:1px solid '+LN+';font:'+('600 ' if forte else '')+'14.5px '+SA+';color:'+(T if forte else S)+'">'+a+'</td><td style="padding:12px 0;border-bottom:1px solid '+LN+';text-align:right;white-space:nowrap;font:500 '+('19px ' if forte else '15.5px ')+SE+';color:'+T+'">'+b+'</td></tr>'
PR={
 '57a':('58a-email-codigo-de-confirmacao','Código de confirmação',molde('Confirme seu '+I('e-mail'),P('Olá, Maria. Use este código para concluir sua conta:')+codigo('482915')+PQ('Vale por 10 minutos. Se não foi você, ignore este e-mail.'))),
 '57b':('58b-email-cartao-de-boas-vindas','Cartão de boas-vindas',molde('Bem-vinda à '+I('La Fouch'),P('Seu presente para a primeira compra:')+cartao('10% na primeira compra','BV-7K2M9Q','Vale até 16/12/2026 · em lafouch.com e na loja')+B('Usar agora')+PQ('Um código por compra. Não soma com OFERTA nem com “Leve 2”: vale o maior desconto.'))),
 '57c':('58c-email-cliente-fiel','Cliente fiel + cartão da amiga',molde('Obrigada por '+I('voltar'),P('Você é cliente fiel. Seu presente para a próxima compra:')+cartao('10% na próxima compra','FIEL-4T8XW2','Vale até 16/12/2026 · em lafouch.com e na loja')+B('Usar agora')+'<div style="height:1px;background:'+LN+';margin:28px 0 22px"></div>'+P('E um para compartilhar: sua amiga ganha 10% na primeira compra e você ganha outro cartão.')+cartao('10% para sua amiga','AMIGA-9H3LQ5','Vale até 16/12/2026',False)+LK('Enviar para uma amiga')+PQ('Um código por compra. Não soma com OFERTA nem com “Leve 2”: vale o maior desconto.'))),
 '57d':('58d-email-voltou-ao-estoque','Voltou ao estoque',molde('Voltou ao '+I('estoque'),P('A peça que você pediu para avisar está disponível de novo:')+'<div style="border-top:1px solid '+LN+';border-bottom:1px solid '+LN+';padding:18px 0;text-align:center"><div style="font:500 20px/1.3 '+SE+';color:'+T+'">Armação acetato preta</div><div style="font:13px '+SA+';color:'+S+';margin-top:6px;letter-spacing:.06em">GR3340</div></div>'+B('Ver a peça')+PQ('Avisamos uma vez só, como você pediu.'))),
 '57e':('58e-email-novidades','Novidades',molde('Chegou a coleção de '+I('verão'),P('Novos solares e armações já estão no site. Venha ver antes que acabem.')+B('Ver em lafouch.com'),'Você recebe este e-mail porque se inscreveu nas novidades. <a href="#" style="color:#8a7d84">Não quero mais receber</a>')),
 '57f':('58f-email-codigo-do-atacado','Código do atacado (espanhol)',molde('Tu código '+I('mayorista'),P('Usá este código para entrar al catálogo mayorista:')+codigo('479088')+PQ('Vale por 10 minutos. Si no fuiste vos, ignorá este e-mail.'))),
}
PED=molde('Recebemos seu '+I('pedido'),P('Olá, Maria. Guardamos suas peças por 30 minutos enquanto você paga.')+'<div style="text-align:center;font:13px '+SA+';color:'+S+';letter-spacing:.06em;margin:0 0 6px">PEDIDO 7K2M9Q · 16/11/2026</div>'
  +'<table style="width:100%;border-collapse:collapse;border-top:1px solid '+LN+'">'+linha('Armação acetato preta GR3340 · 1 un.','R$ 95')+linha('Solar quadrado tartaruga · 1 un.','R$ 140')+linha('Entrega · Ciudad del Este','Grátis')+linha('Total','R$ 235',True)+'</table>'
  +'<p style="text-align:center;font:14px '+SA+';color:'+S+';margin:18px 0 0">Pagamento: <b style="color:'+T+'">PIX · aguardando</b></p>'+B('Ver meu pedido e pagar')+LK('Falar com a loja no WhatsApp'))
def cabe(assunto):
    return ('<div style="padding:14px 16px 12px;border-bottom:1px solid #e6e1e4;background:#fff"><div style="font:600 19px Arial;color:#1d1418;line-height:1.3">'+html.escape(assunto)+'</div><div style="display:flex;gap:10px;align-items:center;margin-top:12px"><div style="width:38px;height:38px;border-radius:50%;background:#8d3a69;color:#fff;font:600 17px Arial;display:flex;align-items:center;justify-content:center">L</div><div><div style="font:600 14px Arial;color:#1d1418">La Fouch</div><div style="font:12px Arial;color:#6b5f66">nao-responda@lafouch.com · para mim</div></div></div></div>')
def foto(pg,assunto,corpo,arq):
    pg.set_content('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#fff">'+cabe(assunto)+'<iframe id="f" style="border:0;width:100%;display:block" scrolling="no"></iframe></body></html>')
    pg.evaluate("(h)=>new Promise(r=>{const f=document.querySelector('#f');f.onload=()=>{const d=f.contentDocument;if(!/<body/i.test(h))d.body.style.margin='12px 16px';f.style.height=(d.documentElement.scrollHeight+8)+'px';r()};f.srcdoc=h})",corpo);pg.wait_for_timeout(250);pg.screenshot(path=arq,full_page=True)
def iguala(a,b):
    A,Bm=Image.open(a).convert('RGB'),Image.open(b).convert('RGB');h=max(A.size[1],Bm.size[1])
    for im,f in ((A,a),(Bm,b)):
        N=Image.new('RGB',(im.size[0],h),'#ffffff');N.paste(im,(0,0));N.save(f)
AS={'57a':'482915 é o seu código da La Fouch','57b':'Bem-vinda à La Fouch: 10% na primeira compra','57c':'Seu presente de cliente fiel: 10% na próxima compra','57d':'Voltou: Armação acetato preta GR3340','57e':'Chegou a coleção de verão','57f':'479088 es tu código de La Fouch'}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':390,'height':120},device_scale_factor=2)
    for k,(arq,nome,prop) in PR.items():
        e=HJ[k];foto(pg,e['assunto'],e['html'].replace('https://lafouch.com/icon-192.png',ic),'/tmp/s391/h.png');foto(pg,AS[k],prop,'/tmp/s391/p.png');iguala('/tmp/s391/h.png','/tmp/s391/p.png')
        comum.prancha(arq+'.jpg','Esboço '+arq[:3]+' · e-mail · '+nome,['Hoje: '+e['quando'].lower()+'.','Proposta: mesmo conteúdo no padrão da marca — logo, título serifado com a palavra em vinho, fios finos, um botão principal.'],'/tmp/s391/h.png','/tmp/s391/p.png')
    pg.set_content('<body style="margin:0;background:#fff;font:15px Arial;color:#6b5f66"><div style="padding:120px 30px;text-align:center">Hoje este e-mail não existe.<br><br>O cliente só vê o pedido na tela do site.</div></body>');pg.screenshot(path='/tmp/s391/h.png',full_page=True)
    foto(pg,'Recebemos seu pedido 7K2M9Q',PED,'/tmp/s391/p.png');iguala('/tmp/s391/h.png','/tmp/s391/p.png')
    comum.prancha('58g-email-pedido-recebido.jpg','Esboço 58g · e-mail NOVO · pedido recebido',['Hoje: não existe; o cliente só vê o pedido na tela do site.','Proposta: resumo do pedido com as peças, o total, o estado do pagamento e um botão para voltar ao pedido.'],'/tmp/s391/h.png','/tmp/s391/p.png')
    b.close()
