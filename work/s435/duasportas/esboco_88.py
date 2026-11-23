# Esboço 88 (S435, 23/11 01:15) — CADASTRO COM DUAS PORTAS (dono 01:05: "bidirecional: foto do Estúdio primeiro e a haste ali, ou o produto
# primeiro e depois a foto"). Base: aprovados 44 (Preencher à mão em linhas, passo 2 cores) e 45 (a peça com foto nasce no Estúdio; código que
# já existe → as cores entram nela) + 64 (ficha: "Fotografar no Estúdio ›") + 86 (um rótulo: 12 px, 600, .14em) + 84 (traço 1,6).
# Mudanças: (1) "Preencher à mão" vale para QUALQUER peça; o botão vira "Continuar · cores" (no passo 2 não entra foto);
# (2) passo 2 "Cores": cada cor entra "sem foto"; "No site" mostra que a cor só entra no site quando tiver foto (regra que já existe);
# (3) Estúdio: a peça cadastrada à mão aparece em "Faltam fotos" ("TS1234 · cadastrada à mão · 1 cor sem foto");
# (4) ler a haste no Estúdio reconhece a peça ("já cadastrada · 1 cor sem foto") e grava o giro na cor. Um cadastro só, um código só.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
R86=lambda s:s.replace("font-size:11px;font-weight:700;letter-spacing:.14em","font-size:12px;font-weight:600;letter-spacing:.14em").replace('stroke-width="1.9"','stroke-width="1.6"').replace('stroke-width="1.8"','stroke-width="1.6"').replace('stroke-width="2"','stroke-width="1.6"')
s44=R86(open('/home/claude/lafouch/work/s435/cadastro/esboco_44.py').read()).rsplit("\nwith sync_playwright() as pw:",1)[0]
s44=s44.replace("BOT('Continuar · cores e fotos')","BOT('Continuar · cores')").replace("<b style=\"display:block;font-size:20px;margin:4px 0 2px\">Cores e fotos</b>","<b style=\"display:block;font-size:20px;margin:4px 0 2px\">Cores</b>")
s44=s44.replace("a foto vem pelo Estúdio","fotografar no Estúdio").replace("mostrar esta peça no site","só as cores com foto")
NS={};exec(s44,NS)
s45=R86(open('/home/claude/lafouch/work/s435/fluxo/esboco_45.py').read()).rsplit("\nwith sync_playwright() as pw:",1)[0]
s45=s45.replace("LB('Faltam fotos · 24')+'<section class=\"nvLista\">'+","LB('Faltam fotos · 25')+'<section class=\"nvLista\">'+ROW('','TS1234 · Armação redonda','cadastrada à mão · 1 cor sem foto','<small style=\"display:flex;margin-top:4px\">'+MK('Frente',0)+MK('3/4',0)+MK('Giro',0)+'</small>')+")
s45=s45.replace("LB('Em andamento · 3')+'<section class=\"nvLista\">'+\n ROW(R[0][0],'TS1234 · peça nova','aberta · 2 cores gravadas · continuar')+","LB('Em andamento · 2')+'<section class=\"nvLista\">'+")
s45=s45.replace("<div class=\"ljHd\"><b>BR44118</b>","<div class=\"ljHd\"><b>TS1234</b>")
s45=s45.replace("Armação Gucci de metal feminino</b><small style=\"color:var(--mute);font-size:13px\">já cadastrada · 3 cores com foto","Armação redonda</b><small style=\"color:var(--mute);font-size:13px\">já cadastrada à mão · 1 cor sem foto")
s45=s45.replace("overflow:hidden;background:#fff\"><img src=\"'+R[2][0]+'\" style=\"width:100%;height:100%;object-fit:contain\">","overflow:hidden;background:var(--panel2);display:grid;place-items:center;color:var(--mute);font-size:11px\">sem foto")
s45=s45.replace("As cores que você gravar entram nesta peça. Uma cor que já tem giro é trocada pela nova.","O giro entra em C1 · Preto.")
NS2={};exec(s45,NS2)
sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import aprovados as A
MARCA="""()=>{document.querySelectorAll('.modal-box *').forEach(e=>{if([...e.children].filter(c=>c.tagName=='BUTTON').length==4&&/Armação/.test(e.textContent)&&/Solar/.test(e.textContent))e.classList.add('adSeg')})}"""
for N in (NS,NS2):
  _o=N['shot'];N['shot']=(lambda o:lambda pg,n:(pg.evaluate(MARCA),A.aplica(pg),o(pg,n))[2])(_o)
_ab=ap.abre
ap.abre=lambda pw,v,e,d,base=False:_ab(pw,v,ESC,d,base=base)
for ESC in (True,False):
  with sync_playwright() as pw:
    Q=[('1 · Preencher à mão','qualquer peça · "Continuar · cores"',NS['tela'](pw,'p1_p')),('2 · Cores','cada cor entra sem foto',NS['tela'](pw,'p2_p')),
       ('3 · Estúdio','a peça aparece em "Faltam fotos"',NS2['estudio'](pw)),('4 · Ler a haste','o Estúdio reconhece a peça',NS2['janela'](pw,'existe'))]
  F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',30);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',22)
  W=Q[0][2].width;H=max(q[2].height for q in Q)
  o=Image.new('RGB',(len(Q)*(W+30)+30,H+120),(17,20,26));d=ImageDraw.Draw(o)
  for i,(t,s,im) in enumerate(Q):
    x=30+i*(W+30);d.text((x,18),t,font=F,fill=(141,58,105));d.text((x,62),s,font=F2,fill=(170,160,165));o.paste(im,(x,100))
  o.save('/home/claude/lafouch/work/s435/duasportas/esboco_88_duas_portas_%s.jpg'%('escuro' if ESC else 'claro'),quality=86);print(o.size)
  