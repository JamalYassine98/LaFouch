# Esboço 87 (S435, 23/11 01:05) — VARREDURA · parte 6 · PÍLULAS ▾ (dono 22/11 23:49: "as pílulas formato, material e gênero estão na pílula
# errada, analisar a família"). Achado: a pílula ▾ aparece em 2 lugares — (1) Inventário › Preencher à mão (Formato ▾ · Material ▾ · Gênero ▾):
# JÁ resolvido no aprovado 44 (passo 1 em LINHAS: "Formato · Redondo · sugerido ›"), esboço work/s435/cadastro/esboco_44b_passo1_modelo.jpg;
# (2) Ajustes › Sons e avisos: cartões com interruptor + pílula do som ▾ + botão ▶ redondo (src/97-push.js avLinha), emoji por tipo.
# Regra 16: escolher numa lista = TAREFA (janela de baixo). Proposta (2): cada aviso vira UMA LINHA (título + som escolhido como frase ·
# interruptor à direita); tocar na linha abre a janela "Som" com os 11 sons em linhas de bolinha, cada uma com ▶ para ouvir, e Salvar.
# Conteúdo aberto dentro da linha ocupa as mesmas margens da linha (83 v3); 'Enviar aviso de teste' = botão pequeno (81).
# Saem: cartões, pílula ▾, ▶ redondo solto, emojis (84), texto que explica (83). Proposta no estado aprovado (aprovados.py).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import ap,aprovados
sys.path.insert(0,'/home/claude/lafouch/work/kit');import mede as M
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
SONS=['Sino','Caixa registradora','Campainha','Suave','Moeda','Pop','Marimba','Cristal','Harpa','Gota','Sem som']
LIN=r"""()=>{const s=document.querySelector('.ajS[data-k=av]');const card=s.querySelector('#avisosCard')||s;const G=[['Pedidos do site',[['Pedido novo','Caixa registradora',1],['Comprovante enviado','Sino',1],['Pagamento aprovado','Moeda',1],['Cliente cancelou','Suave',1]]],['Estoque e dinheiro',[['Peça voltou','Suave',1],['Dólar barato','Sem som',0]]]];
 const L=(t,v,on)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute)">'+v+'</small></span><label class="sw"><input type="checkbox"'+(on?' checked':'')+'><i></i></label></div>';
 const box=document.createElement('div');box.innerHTML=G.map(g=>'<div style="font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:16px 0 0">'+g[0]+'</div>'+g[1].map(x=>L(x[0],x[1],x[2])).join('')).join('');
 [...card.children].forEach(c=>{if(!/Silêncio|Testar|teste/i.test(c.textContent))c.style.display='none'});card.querySelectorAll('.card,section,.avcard,.swrow').forEach(x=>{if(x!==card){x.style.setProperty('background','none','important');x.style.setProperty('border','0','important');x.style.setProperty('border-bottom','1px solid var(--line2)','important');x.style.setProperty('border-radius','0','important');x.style.setProperty('padding-left','0','important');x.style.setProperty('padding-right','0','important')}});card.prepend(box);const r=s.querySelector('.ajR').getBoundingClientRect(),q=card.getBoundingClientRect();card.style.setProperty('margin-left',(r.left-q.left)+'px','important');card.style.setProperty('width',r.width+'px','important');card.querySelectorAll('.b75,.mini').forEach(b=>{b.style.setProperty('width','auto','important');b.style.setProperty('padding','0 20px','important');b.style.setProperty('align-self','flex-start','important')});card.style.setProperty('background','none','important');card.style.setProperty('border','0','important');card.style.setProperty('padding','0','important')}"""
def sons(pw,esc,prop):
  b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=prop);w(900)
  pg.locator('.ajS[data-k="av"] .ajR').click();w(900)
  if prop: aprovados.aplica(pg);aprovados.ajustes(pg);pg.evaluate(LIN);w(400)
  pg.evaluate("()=>document.querySelector('.ajS[data-k=\"av\"]').scrollIntoView({block:'start'})");w(400)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  a,_=M.percorre(pg,None);print('sons',prop,[(k[0],x['d'][:50]) for k,x in a.items()])
  pg.evaluate("()=>document.querySelector('.ajS[data-k=\"av\"]').scrollIntoView({block:'start'})");w(300)
  pg.screenshot(path='/tmp/s.png');b.close();return Image.open('/tmp/s.png').convert('RGB')
def janela(pw,esc):
  b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=True);w(900)
  pg.locator('.ajS[data-k="av"] .ajR').click();w(700);aprovados.aplica(pg);aprovados.ajustes(pg);pg.evaluate(LIN);w(300)
  pg.evaluate("()=>document.querySelector('.ajS[data-k=\"av\"]').scrollIntoView({block:'start'})");w(300)
  pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
  pg.evaluate("""L=>{const j=[...document.querySelectorAll('.ljJn')].pop();j.querySelector('.ljHd b').textContent='Som · Pedido novo';const c=j.querySelector('.ljCorpo')||j;
   const pl='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14l11-7z"/></svg>';
   c.innerHTML=L.map(n=>'<div class="pxL" role="radio" aria-checked="'+(n=='Caixa registradora')+'" style="min-height:52px"><i class="pxR" aria-hidden="true"></i><span style="flex:1;font-size:15px">'+n+'</span>'+(n=='Sem som'?'':'<button type="button" aria-label="Ouvir '+n+'" style="width:44px;height:44px;border:0;background:none;color:var(--mute);display:grid;place-items:center">'+pl+'</button>')+'</div>').join('')+'<button type="button" class="go" style="width:100%;margin-top:16px">Salvar</button>'}""",SONS);w(700)
  pg.screenshot(path='/tmp/j.png');b.close();return Image.open('/tmp/j.png').convert('RGB')
with sync_playwright() as pw:
  for esc in (True,False):
    F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',26);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',20)
    Q=[('Ajustes › Sons e avisos','HOJE · cartões, pílula com seta, play solto',sons(pw,esc,False)),('','PROPOSTA · uma linha por aviso',sons(pw,esc,True)),('','PROPOSTA · tocar na linha: janela Som',janela(pw,esc))]
    W=Q[0][2].width//2;H=Q[0][2].height//2
    o=Image.new('RGB',(len(Q)*(W+16)+40,H+110),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o);fg=(210,210,215) if esc else (50,45,48)
    for i,(t,s,im) in enumerate(Q):
      x=20+i*(W+16);d.text((x,14),t,font=F,fill=fg);d.text((x,52),s,font=F2,fill=(141,58,105) if 'PROP' in s else (150,140,145));o.paste(im.resize((W,H)),(x,84))
    o.save('esboco_87_sons_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print(o.size)
