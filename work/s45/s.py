exec(open('r.py').read().split('def nova(b):')[0])
X='''
.gzst{display:flex;gap:8px;align-items:center;justify-content:center;margin-top:10px;color:var(--mu);font-size:14px}.gzst i{width:8px;height:8px;border-radius:50%;background:#3aa76d;box-shadow:0 0 0 4px #3aa76d22}
.sig{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:10px}.sig span{font-size:13px;color:var(--tx);border:1px solid var(--ln);border-radius:999px;padding:5px 10px;background:var(--pn)}
.sug{font:700 13px Inter;letter-spacing:.12em;color:var(--ac);text-align:center;margin-top:14px}
'''
TXT='O café da manhã fica pronto às sete. Depois, ligue para a farmácia e confirme o horário da entrega.'
def tx(bl):return '<div class="bx" style="padding:22px 20px"><div style="font:400 20px/1.6 Georgia,serif;color:#222;filter:blur(%spx)">%s</div></div>'%(bl,TXT)
def aj(g,lab):return '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px"><div class="gb2">−</div><div style="text-align:center"><div style="font:700 40px Inter">'+g+'</div><div style="color:var(--mu);font-size:13px">'+lab+'</div></div><div class="gb2">+</div></div>'
cc=lambda t:'<div class="cc" style="font-size:16px;position:fixed">'+MIC+'<span>'+t+'</span>'+SPK+'</div>'
TELAS={
'1':BK+'<h2>Segure o celular como você costuma ler</h2><p>Leia a frase. A câmera observa a distância e o seu rosto; nada é gravado.</p>'+tx(2.6)+'<div class="gzst"><i></i>Observando…</div>'+aj('+1.00','grau')+'<button class="go">Leio bem</button>'+cc('Olá! Segure o celular como você costuma ler e tente ler a frase. Eu vou ajustando o grau para você.'),
'2':BK+'<h2>Segure o celular como você costuma ler</h2><p>Leia a frase. A câmera observa a distância e o seu rosto; nada é gravado.</p>'+tx(0)+'<div class="sug">GRAU SUGERIDO</div>'+'<div class="sig"><span>Afastou o celular · 54 cm</span><span>Apertou os olhos</span></div>'+aj('+1.75','sugerido pela câmera')+'<button class="go">Leio bem</button>'+cc('Percebi que você afastou o celular e apertou os olhos. Sugiro mais um e setenta e cinco.'),
'3':BK+'<h2>Segure o celular como você costuma ler</h2><p>Leia a frase. A câmera observa a distância e o seu rosto; nada é gravado.</p>'+tx(0)+'<div class="sug" style="color:var(--mu)">VOCÊ ESCOLHEU</div>'+'<div class="sig"><span>Sugerido: +1.75</span></div>'+aj('+2.00','ajustado por você')+'<button class="go">Leio bem</button>'+cc('Mais dois. Toque em “Leio bem” quando estiver confortável.'),
'4':BK+'<div class="eb">SEU GRAU PARA COMEÇAR</div><div style="font:700 64px Inter;margin:6px 0 4px">+2.00</div><p style="font-size:16px">A câmera sugeriu +1.75 e você preferiu +2.00. Para a sua idade costuma ficar entre +1.75 e +2.25.</p><button class="go">Ver óculos de leitura +2.00</button><button class="go o">Guardar meu grau</button><p style="font-size:13.5px;margin-top:16px">É uma indicação, não um exame. Procure um oftalmologista se tiver dor de cabeça, visão dupla ou se um olho enxerga bem pior que o outro.</p>'+cc('Pronto! O seu grau para começar é mais dois.')}
def nova(b):
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2500);pg.add_style_tag(content=CSS+X+'#gw{padding-bottom:120px}');return pg
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for k,h in TELAS.items():
        pg=nova(b);pg.evaluate("h=>{document.body.insertAdjacentHTML('beforeend','<div id=gw>'+h+'</div>')}",h);pg.wait_for_timeout(400);pg.screenshot(path=k+'.png')
from PIL import Image,ImageDraw,ImageFont
B='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
L=[('1','1 · Começa: lendo e observando'),('2','2 · Câmera sugere o grau'),('3','3 · Cliente ajusta à vontade'),('4','4 · Resultado')]
ims=[Image.open(f+'.png') for f,_ in L];W=sum(i.width for i in ims)+40*5;H=ims[0].height+150
c=Image.new('RGB',(W,H),'#efe9ee');d=ImageDraw.Draw(c);d.text((40,24),'S45 · Uma tela, um botão: a câmera sugere e o cliente ajusta',fill='#3a1f36',font=ImageFont.truetype(B,40))
x=40
for im,(f,t) in zip(ims,L): d.text((x,90),t,fill='#7b2d6b',font=ImageFont.truetype(B,28));c.paste(im,(x,140));x+=im.width+40
c.save('S45_um_botao.png');c.resize((W//3,H//3)).save('prev.png')
