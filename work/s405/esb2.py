# S405 · esboços 72a (Minha conta › Cartões no Natal) e 72b (cada tipo de cartão: sem evento × Natal). Nada implementado.
E=open('/home/claude/lafouch/work/s403/esb2.py').read();exec(E[:E.index('with sync_'+'playwright() as pw')])
import json,base64,os
comum.OUT='/home/claude/lafouch/work/s405/';T='/tmp/s405/'
L=json.load(open(T+'c2.json'))
def dados(h):
    for f in os.listdir('/home/claude/catalogo/media/email/'):
        if f.startswith('cartao-'): h=h.replace('https://lafouch.com/media/email/'+f,'data:image/png;base64,'+base64.b64encode(open('/home/claude/catalogo/media/email/'+f,'rb').read()).decode())
    return h
M={'ok':True,'guardados':0,'indicacoes':0,'nome':'María González','cupons':[{'cod':'LF-7K2M','tipo':'px','pct':10,'estado':'ok','fim':1805000000000,'usado':False,'nome':'María González','max':1},{'cod':'LF-9V3T','tipo':'vip','pct':20,'estado':'ok','fim':1810000000000,'usado':False,'nome':'María González','max':1}]}
NATAL="()=>{document.documentElement.setAttribute('data-ev','natal')}"
TROCA="""(a)=>{const b=document.getElementById('mtj');const cs=[...b.querySelectorAll('.mtc')].filter(c=>c.querySelector('.lxc'));
 const px=cs.find(c=>/CARTÃO PRESENTE/.test(c.textContent));if(px)px.querySelector('.lxc').outerHTML='<div class="lxc">'+a[1]+'</div>';
 const ev=document.createElement('div');ev.className='mtc';ev.innerHTML='<div class="lxc">'+a[0]+'</div>';ev.appendChild(cs[0].querySelector('.mtl').cloneNode(true));b.insertBefore(ev,b.firstChild)}"""
def cart():
    pago.MEUS=M;b,pg,w=pago.abre(pw,'cartoes');pg.evaluate(NATAL);w(600);return b,pg,w
with sync_playwright() as pw:
    b,pg,w=cart();pg.add_style_tag(content=NOAN);pg.set_viewport_size({'width':390,'height':1300});w(400);oh=comum.olho(pg);pg.screenshot(path=T+'n_h.png');b.close()
    b,pg,w=cart();pg.add_style_tag(content=NOAN);pg.set_viewport_size({'width':390,'height':1300});w(300);pg.evaluate(TROCA,[dados(L[0][2]).replace('font:500 11px Arial','font:500 12.5px Inter,Arial'),dados(L[1][2]).replace('font:500 11px Arial','font:500 12.5px Inter,Arial')]);w(600);op=comum.olho(pg);pg.screenshot(path=T+'n_p.png');b.close();print('72a falhas novas:',sorted(op-oh)[:4])
    br=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=br.new_page(viewport={'width':760,'height':400},device_scale_factor=2)
    cel=lambda h:'<td style="width:50%;padding:6px 12px 14px;vertical-align:top">'+(dados(h) if h else '<div style="height:150px;display:flex;align-items:center;justify-content:center;font:italic 15px Georgia,serif;color:#9a8b93">só existe no evento</div>')+'</td>'
    h='<table style="width:100%;border-collapse:collapse"><tr><td style="font:700 15px Arial;color:#1d1418;padding:8px 12px">SEM EVENTO</td><td style="font:700 15px Arial;color:#1f5c3a;padding:8px 12px">NO NATAL</td></tr>'+''.join('<tr><td colspan="2" style="font:600 14px Arial;color:#6b5f66;padding:10px 12px 0">'+x[0]+'</td></tr><tr>'+cel(x[1])+cel(x[2])+'</tr>' for x in L)+'</table>'
    pg.set_content('<body style="margin:0;background:#fff;padding:8px">'+h+'</body>');pg.wait_for_timeout(500);pg.screenshot(path=T+'tipos.png',full_page=True);br.close()
P('72a-site-minha-conta-cartoes-no-natal.jpg','Esboço 72a · Site · Minha conta › Cartões no Natal',['Hoje: no Natal, os cartões continuam vinho e preto; o cupom do evento fica à parte.','Proposta: durante o evento, os cartões vestem a temática; o canto diz o tipo ("CUPOM DO EVENTO", "CARTÃO PRESENTE") e a linha de baixo diz "de Natal". O VIP continua preto e dourado.'],T+'n_h.png',T+'n_p.png')
from PIL import Image,ImageDraw
im=Image.open(T+'tipos.png').convert('RGB');g=40;S=Image.new('RGB',(im.size[0]+2*g,im.size[1]+220),'#f1eef0');d=ImageDraw.Draw(S)
d.text((g,34),'Esboço 72b · Cada tipo de cartão: sem evento × no Natal',font=comum.F(40,True),fill='#1d1418')
for i,l in enumerate(['Todos vestem a temática enquanto o evento durar, no site e no e-mail enviado nesses dias.','O canto sempre diz o tipo do cartão. Exceções: VIP (preto e dourado, é o status) e','aniversário (confete, o dia é do cliente). Valores, nomes e validades de exemplo.']): d.text((g,92+i*32),l,font=comum.F(24),fill='#55484f')
S.paste(im,(g,200));S.save(comum.OUT+'72b-cartoes-cada-tipo-no-natal.jpg',quality=88);print(S.size)
