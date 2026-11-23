# Esboço 84 (S435, 23/11 00:15) — VARREDURA · parte 3 · ÍCONES E EMOJIS. Levantamento no código (src/*.js):
# · 55 ícones de linha desenhados com 9 grossuras de traço (2 · 1.9 · 1.8 · 1.7 · 1.6 · 2.2 · 2.8 · 3 · sem grossura = padrão do lugar);
# · 54 emojis/símbolos em 190 usos — na tela (💳 Aguardando pagamento, 🧾 Conferir comprovante, 👤 Assumido, 🔔 Peça voltou, 🎄🔒⏸ nos
#   Cartões, ✓/✕ soltos) e nas MENSAGENS que vão ao cliente (😊 no WhatsApp, 🛒🧾 nas notificações).
# Regra 17: "um conjunto de ícones". Proposta: (1) UM traço para todo ícone de linha — 1,6 (fino, de luxo; o vazio lfVazio já usa 1,2 grande);
# (2) na TELA, emoji sai: estado vira a cor do estado (regra 17) e, se precisar, o ícone de linha do conjunto; (3) nas MENSAGENS ao cliente,
# no máximo 1 emoji discreto no fim (como as legendas da Madë) — a decidir pelo dono.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
L=json.load(open('icones.json'))
def grade(prop):
  return ''.join('<div style="display:flex;flex-direction:column;align-items:center;gap:4px;width:56px"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round">%s</svg><small style="font-size:10px;color:var(--mute)">%s</small></div>'%('1.6' if prop else (x['sw'] if x['sw']!='?' else '2'),x['p'],'1,6' if prop else x['sw']) for x in L[:48])
EST=r"""(o)=>{const R=(ic,t,s,c)=>'<div style="display:flex;align-items:center;gap:14px;min-height:56px;border-bottom:1px solid var(--line2)">'+(ic||'')+'<span style="flex:1"><b style="display:block;font-size:15px;font-weight:500'+(c?';color:'+c:'')+'">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span></div>';
 const sv=p=>'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none">'+p+'</svg>';
 return o?R(sv('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'),'Aguardando pagamento','pedido 1043 · PIX','var(--warn)')+R(sv('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>'),'Conferir comprovante','pedido 1044','var(--warn)')+R(sv('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>'),'Assumido por você','Liberar ›','')+R(sv('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21h4"/>'),'Peça voltou','avise quem esperava','')
 :R('','💳 Aguardando pagamento','pedido 1043 · PIX','var(--warn)')+R('','🧾 Conferir comprovante','pedido 1044','var(--warn)')+R('','👤 Você assumiu este pedido','Liberar','')+R('','🔔 Peça voltou — avise quem esperava','','')}"""
def tela(pw,esc,prop):
  b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=prop);w(600)
  est=pg.evaluate(EST,prop)
  h='<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:0 0 12px">Ícones do app · %s</div><div style="display:flex;flex-wrap:wrap;gap:10px 2px">%s</div>'%('um traço só · 1,6' if prop else '9 grossuras diferentes',grade(prop))
  h+='<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:28px 0 4px">Pedidos · estados %s</div>'%('ícone e cor do estado' if prop else 'com emoji')+est
  h+='<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:28px 0 8px">Mensagem ao cliente (WhatsApp)</div><div style="font-size:14px;line-height:1.5;padding:12px 14px;border-radius:12px;background:var(--panel2)">'+('Olá, Maria. A peça SL2201 que você esperava chegou à La Fouch. ✨' if prop else 'Olá, Maria! A peça SL2201 que você queria já chegou na La Fouch. 😊')+'</div>'
  pg.evaluate("h=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:999;overflow:auto;background:var(--bg);padding:24px 16px';d.id='inv';d.innerHTML=h;document.body.appendChild(d)}",h);w(500)
  hh=pg.evaluate("()=>document.getElementById('inv').scrollHeight");pg.set_viewport_size({'width':390,'height':max(844,hh)});w(300)
  pg.screenshot(path='/tmp/i.png');b.close();return Image.open('/tmp/i.png').convert('RGB')
with sync_playwright() as pw:
  for esc in (True,False):
    a=tela(pw,esc,False);p=tela(pw,esc,True);F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',28)
    o=Image.new('RGB',(a.width+p.width+90,max(a.height,p.height)+90),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o)
    d.text((30,24),'HOJE',font=F,fill=(150,150,155));d.text((a.width+60,24),'PROPOSTA · um conjunto, um traço, sem emoji na tela',font=F,fill=(141,58,105))
    o.paste(a,(30,80));o.paste(p,(a.width+60,80));o.save('esboco_84_icones_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print(o.size)
