# Inventário 1 do BOTÃO DE AÇÃO: cada botão com a classe REAL do app de hoje (sem base) e o mesmo texto, para comparar o desenho.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
V=[('1 · .go','Carrinho, Pagamento, Salvar no site','<button type="button" class="go">Salvar</button>'),
   ('2 · .fx418P','Caixa › Retirar, Câmbio › Registrar troca, Objetivo','<button type="button" class="fx418P">Salvar</button>'),
   ('3 · .mini','Conferir caixa, Conectar à nuvem, + Novo objetivo','<button type="button" class="mini">Salvar</button>'),
   ('4 · .btn-sc','Ajustes › Cópias (Exportar · Importar)','<button type="button" class="btn-sc">Salvar</button>'),
   ('5 · .b75','Ajustes › Atualização, Sons (aviso de teste)','<button type="button" class="b75">Salvar</button>'),
   ('6 · .impBp','Ajustes › Impressora','<button type="button" class="impBp">Salvar</button>'),
   ('7 · vermelho (estilo na linha)','Apagar foto em todos','<button type="button" class="btn lfa-pr" style="width:100%;background:#c0392b;border:1.5px solid #c0392b;color:#fff">Apagar</button>')]
def tela(pw,esc):
  b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=False);w(700)
  html=''.join('<div style="margin:0 0 28px"><div style="font-size:15px;font-weight:600;color:var(--fg)">%s</div><div style="font-size:12px;color:var(--mute);margin:2px 0 10px">%s</div>%s</div>'%v for v in V)
  pg.evaluate("h=>{const d=document.createElement('div');d.id='inv';d.className='view';d.style.cssText='position:fixed;inset:0;z-index:999;overflow:auto;background:var(--bg);padding:24px 16px';d.innerHTML=h;document.body.appendChild(d)}",html);w(600)
  h=pg.evaluate("()=>document.getElementById('inv').scrollHeight");pg.set_viewport_size({'width':390,'height':max(844,h)});w(400)
  pg.screenshot(path='/tmp/i.png');b.close();return Image.open('/tmp/i.png').convert('RGB')
with sync_playwright() as pw:
  a=tela(pw,True);c=tela(pw,False)
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',28)
o=Image.new('RGB',(a.width+c.width+90,max(a.height,c.height)+90),(17,20,26));d=ImageDraw.Draw(o)
d.text((30,24),'INVENTÁRIO 1 · botão de ação (app de hoje) · escuro',font=F,fill=(210,210,215));d.text((a.width+60,24),'claro',font=F,fill=(210,210,215))
o.paste(a,(30,80));o.paste(c,(a.width+60,80));o.save('inventario_botoes.jpg',quality=86);print(o.size)
