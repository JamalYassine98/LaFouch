# Esboço 81c (S435, 22/11 23:40) — janela 'Apagar esta foto?' no padrão de luxo (dono 23:37: "só não gostei da aba apagar a foto").
# Hoje (src/97-sync2.js:706 __fotoApagaPede): título em fonte própria, texto corrido com negrito, caixa azul 'Lixeira' com emoji/ícone,
# dois botões iguais. Proposta: a janela de baixo de sempre (título da janela), a FOTO da peça que vai sair (o que se apaga fica claro),
# linhas finas (Some de · Lixeira), botão de PERIGO vermelho (81) e 'Voltar' embaixo (regra 15). Sem caixa colorida, sem emoji.
# Foto REAL do catálogo de teste (GR3345). Dados reais: lixeira 0 de 10, 7 dias.
import sys,base64;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
FOTO='data:image/jpeg;base64,'+base64.b64encode(open('/home/claude/catalogo/dados/f/GR3345_2249431960.jpg','rb').read()).decode()
def cena(pw,esc,prop):
  b,pg,w=ap.abre(pw,'estoque',esc,'celular',base=prop);w(900)
  pg.evaluate("()=>{window.__LF.S.syncOn=true;window.__fotoApagaPede('GR3345|C1')}");w(1200)
  if prop:
    pg.evaluate("""f=>{const R=(a,v)=>'<div style="display:flex;align-items:center;gap:16px;min-height:52px;border-bottom:1px solid var(--line2)"><span style="flex:1;color:var(--mute);font-size:15px">'+a+'</span><span style="font-size:15px;white-space:nowrap">'+v+'</span></div>';
      const box=document.querySelector('[data-act=fotoapaga]').parentNode;
      box.innerHTML='<b style="display:block;font-size:20px;font-weight:600;margin:0 0 16px">Apagar esta foto?</b>'+
       '<div style="display:flex;align-items:center;gap:16px;padding:0 0 16px;border-bottom:1px solid var(--line2)"><img src="'+f+'" style="width:88px;height:88px;object-fit:contain;background:#fff;border-radius:12px;flex:none"><span><b style="display:block;font-size:16px;font-weight:500">GR3345 · C1</b><small style="font-size:13px;color:var(--mute)">Armação de acetato</small></span></div>'+
       R('Some de','todos os aparelhos')+R('Lixeira','fica 7 dias · 0 de 10')+
       '<button type="button" class="go" style="width:100%;margin-top:24px;background:#c0392b!important;border-color:#c0392b!important;color:#fff!important">Apagar em todos</button>'+
       '<button type="button" class="lkTx" style="display:block;margin:8px auto 0;min-height:44px;font-weight:600;color:var(--fg);background:none;border:0">Voltar</button>';}""",FOTO);w(600)
  pg.add_style_tag(content='#mainnav{display:none!important}');pg.screenshot(path='/tmp/f.png');b.close();return Image.open('/tmp/f.png').convert('RGB')
with sync_playwright() as pw:
  for esc in (True,False):
    a=cena(pw,esc,False);p=cena(pw,esc,True)
    F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',28);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',22)
    o=Image.new('RGB',(a.width+p.width+90,a.height+110),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o)
    d.text((30,20),'HOJE · Apagar esta foto?',font=F,fill=(150,150,155));d.text((a.width+60,20),'PROPOSTA · a foto que sai, linhas finas, perigo + Voltar',font=F,fill=(141,58,105))
    o.paste(a,(30,90));o.paste(p,(a.width+60,90));o.save('esboco_81c_apagar_foto_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print(o.size)
