# Inventário 1 da FAMÍLIA "barra de escolha" (pedido do dono 22/11 22:58: "como é que ta a família de barras deslizantes?").
# Cada barra é desenhada com a marcação REAL do app (classe e filhos iguais ao src/) e o CSS real; mesmas 3 opções para comparar.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
B=lambda cls,ops,on=0,extra='':''.join('<button type="button" class="%s%s"%s>%s</button>'%(cls,(' on' if i==on else ''),extra,o) for i,o in enumerate(ops))
O3=['Para mim','Loja','Pessoal']
V=[('1 · .trk (trilho que arrasta)','Pagamento, Câmbio, Ajustes, Estúdio, Faixas… (13 arquivos)','<div class="trk" role="group"><span class="trkTh"></span>'+B('trkB',O3)+'</div>'),
   ('2 · .sg418','Retirada do dono (moeda) · Câmbio (trocar de / receber em)','<div class="sg418" role="group">'+B('',O3)+'</div>'),
   ('3 · .catbar3','Clientes (nacionalidade) · Loja online','<div class="catbar3" role="group">'+B('',O3)+'</div>'),
   ('4 · .catbar3.impSeg','Impressora (conexão)','<div class="catbar3 impSeg" role="group">'+B('',O3)+'</div>'),
   ('5 · .tmseg','Ajustes › Tema (Auto · Claro · Escuro)','<div class="tmseg" role="group">'+B('',O3)+'</div>'),
   ('6 · .adSeg','Adicionar (Aguardando cadastro · Dar entrada) — a que usei errado no 79','<div class="adSeg" role="tablist">'+B('',O3)+'</div>'),
   ('7 · #sortChips (chips)','Inventário › Filtros › Ordem','<div id="sortChips2" class="chips">'+B('chip',O3)+'</div>'),
   ('8 · .pdSeg.lfAbas (abas)','Pedidos (situação) — é ABA, outra família','<div class="pdSeg lfAbas" role="group">'+B('',O3)+'</div>')]
def tela(pw,esc):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(600)
  html=''.join('<div style="margin:0 0 24px"><div style="font-size:15px;font-weight:600;color:var(--fg)">%s</div><div style="font-size:12px;color:var(--mute);margin:2px 0 8px">%s</div>%s</div>'%v for v in V)
  pg.evaluate("""h=>{const d=document.createElement('div');d.id='inv';d.style.cssText='position:fixed;inset:0;z-index:999;overflow:auto;background:var(--bg);padding:24px 16px';d.innerHTML=h;document.body.appendChild(d);
    const t=d.querySelector('.trk'),o=t.querySelector('.trkB.on'),th=t.querySelector('.trkTh');th.style.cssText='width:'+o.offsetWidth+'px!important;transform:translateX('+(o.offsetLeft-3)+'px)!important;left:3px!important';
    const sc=document.getElementById('sortChips2');sc.id='sortChips';window.__ladosCabe&&window.__ladosCabe(d)}""",html);w(800)
  h=pg.evaluate("()=>document.getElementById('inv').scrollHeight");pg.set_viewport_size({'width':390,'height':max(844,h)});w(500)
  pg.screenshot(path='/tmp/i.png');b.close();return Image.open('/tmp/i.png').convert('RGB')
with sync_playwright() as pw:
  a=tela(pw,True);c=tela(pw,False)
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',30)
o=Image.new('RGB',(a.width+c.width+90,max(a.height,c.height)+90),(17,20,26));d=ImageDraw.Draw(o)
d.text((30,24),'INVENTÁRIO 1 · família "barra de escolha" · escuro',font=F,fill=(200,200,205));d.text((a.width+60,24),'claro',font=F,fill=(200,200,205))
o.paste(a,(30,80));o.paste(c,(a.width+60,80));o.save('inventario_barras.jpg',quality=86);print(o.size)
