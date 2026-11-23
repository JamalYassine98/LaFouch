# Esboço 85 (S435, 23/11 00:25) — VARREDURA · parte 4 · AVISOS E CAIXAS COLORIDAS. Levantamento no código:
# · 3 jeitos de avisar: (1) .note em CAIXA dentro da tela — 4 cores e 4 desenhos (n-bad com caixa, n-warn sem caixa, n-info azul, n-ok), 91 usos;
#   (2) lfToast embaixo, acima da barra (116 usos; aprovado v613/v614: cor pelo tipo, um chão só); (3) popErr EM CIMA, caixa vermelha com × (57 usos).
# Regra 17: "carregando/erro/sem internet/salvo iguais em todo lugar". Proposta: DOIS tipos só —
#  A · AVISO QUE PASSA = o lfToast de sempre (acima da barra, cor pelo tipo), agora com ação opcional à direita ("Desfazer"); o popErr de cima SAI
#      (o erro também passa por aqui, tipo 'erro'). Ex. do 81: "Foto na lixeira · Desfazer".
#  B · AVISO QUE FICA (até resolver) = uma LINHA fina com o ponto da cor do tipo à esquerda, frase curta e a ação › — sem caixa colorida.
# Base: app real (Caixa: .note n-bad "O dinheiro em caixa está abaixo…"; popErr real; lfToast real) + aprovados (80 trilho, 81 botões, 82 campos, 83 textos, 84 ícones).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
_e=open('/home/claude/lafouch/work/s435/varredura/esboco_83.py').read()
LINHA=open('/home/claude/lafouch/work/s435/varredura/esboco_82.py').read().split("LINHA='")[1].split("'\n")[0].replace('.in{','.in:not([placeholder^=Buscar]){').replace('.in,','.in:not([placeholder^=Buscar]),')
FICA=r"""()=>{document.querySelectorAll('.note').forEach(n=>{const bad=n.classList.contains('n-bad'),w=n.classList.contains('n-warn'),ok=n.classList.contains('n-ok');const cor=bad?'var(--bad)':w?'var(--warn)':ok?'var(--ok)':'var(--accent-fg)';
 const a=n.querySelector('a,button');const at=a?a.textContent.replace(/›+/g,'').trim():'';const t=n.cloneNode(true);t.querySelectorAll('a,button').forEach(x=>x.remove());
 let tx=t.textContent.replace(/\s+/g,' ').trim();if(/abaixo do que deveria/.test(tx))tx='Caixa abaixo do separado';
 n.outerHTML='<div style="display:flex;align-items:center;gap:12px;min-height:60px;border-bottom:1px solid var(--line2);margin:0 0 8px"><i style="flex:none;width:8px;height:8px;border-radius:50%;background:'+cor+'"></i><span style="flex:1;min-width:0;font-size:15px">'+tx+'</span>'+(at?'<span style="color:var(--accent-fg);font-size:15px;font-weight:600;white-space:nowrap">'+at.replace(/^Ver o que falta repor$/,'Ver o que falta')+' ›</span>':'')+'</div>'})}"""
TIRA=_e[_e.index('TIRA=r"""')+9:_e.index('"""',_e.index('TIRA=r"""')+9)]
EXPL=[l.split(' | ')[1] for l in open('/home/claude/lafouch/work/s435/varredura/TEXTOS-EXPLICATIVOS.md') if l.startswith('| EXPLICA')]
def caixa(pw,esc,prop):
  b,pg,w=ap.abre(pw,'caixa',esc,'celular',base=prop);w(1000)
  if prop: pg.add_style_tag(content=LINHA);pg.evaluate(TIRA,EXPL);pg.evaluate(FICA);w(300)
  pg.evaluate("()=>{const n=document.querySelector('.note')||[...document.querySelectorAll('div')].find(d=>/Caixa abaixo/.test(d.textContent)&&d.children.length<4);n&&n.scrollIntoView({block:'center'})}");w(300)
  pg.add_style_tag(content='#mainnav{display:none!important}');pg.screenshot(path='/tmp/a.png');b.close();return Image.open('/tmp/a.png').convert('RGB')
def passa(pw,esc,prop):
  b,pg,w=ap.abre(pw,'estoque',esc,'celular',base=prop);w(900)
  if prop:
    pg.evaluate("()=>{window.__LF.lfToast('Foto na lixeira','ok');const e=document.getElementById('lfToast');e.innerHTML='<span>Foto na lixeira</span><button type=\"button\" style=\"margin-left:16px;background:none;border:0;color:inherit;font:inherit;font-weight:700;text-decoration:underline;text-underline-offset:3px\">Desfazer</button>';e.style.setProperty('display','flex','important');e.style.setProperty('align-items','center','important');e.style.setProperty('justify-content','space-between','important');e.style.setProperty('gap','16px','important')}");w(700)
  else:
    pg.evaluate("""()=>{const e=document.createElement('div');e.id='popErr';e.setAttribute('role','alert');e.style.cssText='position:fixed;left:50%;top:max(16px,env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:200;width:min(92vw,520px);background:var(--badbg);color:var(--bad);border:1px solid var(--bad);border-radius:12px;padding:12px 44px 12px 14px;font-size:14px;line-height:1.4;box-shadow:0 8px 24px rgba(0,0,0,.25)';e.innerHTML='<span>Sem internet para conferir o código. Confira de novo quando a internet voltar.</span><button style=\"position:absolute;right:8px;top:6px;width:32px;height:32px;border:0;background:transparent;font-size:22px;color:inherit\">×</button>';document.body.appendChild(e)}""");w(300)
  pg.add_style_tag(content='#mainnav .mn,#mainnav .mn *{color:var(--mute)!important}');pg.screenshot(path='/tmp/b.png');b.close();return Image.open('/tmp/b.png').convert('RGB')
def erro(pw,esc):
  b,pg,w=ap.abre(pw,'estoque',esc,'celular',base=True);w(900)
  pg.evaluate("()=>window.__LF.lfToast('Sem internet para conferir o código','erro')");w(700)
  pg.screenshot(path='/tmp/c.png');b.close();return Image.open('/tmp/c.png').convert('RGB')
with sync_playwright() as pw:
  for esc in (True,False):
    F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',26);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',20)
    Q=[('Caixa · aviso que FICA','HOJE · caixa colorida',caixa(pw,esc,False)),('','PROPOSTA · linha com o ponto da cor',caixa(pw,esc,True)),
       ('Aviso que PASSA','HOJE · erro em cima, com ×',passa(pw,esc,False)),('','PROPOSTA · erro embaixo, igual a todos',erro(pw,esc)),('','PROPOSTA · com ação (Desfazer)',passa(pw,esc,True))]
    W=Q[0][2].width//2;H=Q[0][2].height//2
    o=Image.new('RGB',(len(Q)*(W+16)+40,H+110),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o);fg=(210,210,215) if esc else (50,45,48)
    for i,(t,s,im) in enumerate(Q):
      x=20+i*(W+16);d.text((x,14),t,font=F,fill=fg);d.text((x,52),s,font=F2,fill=(141,58,105) if 'PROP' in s else (150,140,145));o.paste(im.resize((W,H)),(x,84))
    o.save('esboco_85_avisos_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print(o.size)
