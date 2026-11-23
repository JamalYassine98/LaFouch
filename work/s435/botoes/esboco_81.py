# Esboço 81 (S435, 22/11 23:30) — FAMÍLIA "botão de ação" = 3 tipos pelo PAPEL (dono 23:27–23:28 "pode ser"):
# PRINCIPAL (largura toda; fecha a tarefa; no máximo 1 por tela/janela; 'Salvar' é sempre este) = o .go do padrão aprovado (telas de
# referência Pagamento 142t / Carrinho 142s, 18/11) · PEQUENO (pílula; ação de apoio dentro de uma linha/bloco) = o .mini ·
# PERIGO (vermelho cheio, letra branca, com 'Voltar' embaixo — regra 15).
# Inventário 1 (inventario_botoes.jpg): 6 desenhos — .go · .fx418P · .mini · .btn-sc · .b75 · .impBp — + o vermelho de 'Apagar em todos'
# que hoje sai NEUTRO (a regra .btn cobre o estilo na linha). Saem .fx418P/.pd418P, .btn-sc, .b75/.up75, .impBp e o estilo na linha.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
RED='<button type="button" class="go" style="background:#c0392b!important;border-color:#c0392b!important;color:#fff!important">%s</button><button type="button" class="lkTx" style="display:block;margin:8px auto 0;min-height:44px;font-weight:600;color:var(--fg)">Voltar</button>'
HOJE=[('Principal','.go · Carrinho','<button class="go">Ir para o pagamento</button>'),('Principal','.fx418P · Caixa › Retirar','<button class="fx418P">Retirar</button>'),
      ('Pequeno','.mini · Caixa','<button class="mini">Conferir caixa</button>'),('Pequeno','.btn-sc · Ajustes › Cópias','<button class="btn-sc">Exportar</button>'),
      ('Pequeno','.b75 · Ajustes › Atualização','<button class="b75">Buscar atualização</button>'),('Pequeno','.impBp · Ajustes › Impressora','<button class="impBp">Procurar impressora</button>'),
      ('Perigo','vermelho na linha · Apagar em todos','<button class="btn lfa-pr" style="width:100%;background:#c0392b;border:1.5px solid #c0392b;color:#fff">Apagar em todos</button>')]
PROP=[('Principal','vira o .go','<button class="go">Ir para o pagamento</button>'),('Principal','vira o .go','<button class="go">Retirar</button>'),
      ('Pequeno','vira o .mini','<button class="mini">Conferir caixa</button>'),('Pequeno','vira o .mini','<button class="mini">Exportar</button>'),
      ('Pequeno','vira o .mini','<button class="mini">Buscar atualização</button>'),('Pequeno','vira o .mini','<button class="mini">Procurar impressora</button>'),
      ('Perigo','vermelho de verdade + Voltar',RED%'Apagar em todos')]
def tela(pw,esc,L,base):
  b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=base);w(700)
  html=''.join('<div style="margin:0 0 24px;min-height:96px"><div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)">%s</div><div style="font-size:12px;color:var(--mute);margin:2px 0 10px">%s</div>%s</div>'%v for v in L)
  pg.evaluate("h=>{const d=document.createElement('div');d.id='inv';d.style.cssText='position:fixed;inset:0;z-index:999;overflow:auto;background:var(--bg);padding:24px 16px';d.innerHTML=h;document.body.appendChild(d)}",html);w(600)
  h=pg.evaluate("()=>document.getElementById('inv').scrollHeight");pg.set_viewport_size({'width':390,'height':max(844,h)});w(400)
  pg.screenshot(path='/tmp/i.png');b.close();return Image.open('/tmp/i.png').convert('RGB')
with sync_playwright() as pw:
  for esc in (True,False):
    a=tela(pw,esc,HOJE,False);p=tela(pw,esc,PROP,True)
    F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',28);H=max(a.height,p.height)
    o=Image.new('RGB',(a.width+p.width+90,H+90),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o);fg=(210,210,215) if esc else (50,45,48)
    d.text((30,24),'HOJE · 6 desenhos',font=F,fill=fg);d.text((a.width+60,24),'PROPOSTA · 3 tipos pelo papel',font=F,fill=(141,58,105))
    o.paste(a,(30,80));o.paste(p,(a.width+60,80));o.save('esboco_81_familia_botoes_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print(o.size)
