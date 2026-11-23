# Esboço 83 (S435, 23/11 00:00) — VARREDURA DE LUXO · parte 2 · TEXTOS EXPLICATIVOS. Levantamento: 90 textos fixos (.hint) no app —
# 65 EXPLICAM como funciona, 17 são de tela VAZIA, 8 são AVISO (lista: TEXTOS-EXPLICATIVOS.md). Regra proposta (a mesma do dono para
# Marketing/Preços, 22/11 14:46 "tira essas descrições inúteis"): o que EXPLICA sai da tela; VAZIO fica no padrão lfVazioHtml; AVISO fica curto.
# v2 (dono 00:00): a barra do Tema na proposta estava errada → a proposta inclui o aprovado 80 (todas as barras no trilho 140C).
# v3 (dono 00:02): o trilho do Tema não estava alinhado → aberto dentro de uma linha, ele ocupa as MESMAS margens da linha (do ícone à seta), L1.
# Inclui o achado do 82: "Voltar no tempo ›" com a seta quebrando → vira linha de lugar (título · frase curta · › na mesma linha).
import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
_v=open('/home/claude/lafouch/work/s435/barras/esboco_80.py').read();VIRA=_v[_v.index('VIRA=r"""')+9:_v.index('"""',_v.index('VIRA=r"""')+9)]
LINHA=open('esboco_82.py').read().split("LINHA='")[1].split("'\n")[0].replace('.in{','.in:not([placeholder^=Buscar]){').replace('.in,','.in:not([placeholder^=Buscar]),')
EXPL=[l.split(' | ')[1] for l in open('TEXTOS-EXPLICATIVOS.md') if l.startswith('| EXPLICA')]
TIRA=r"""L=>{const nrm=s=>s.replace(/\s+/g,' ').trim();document.querySelectorAll('.hint,.crumb,.mu').forEach(h=>{const t=nrm(h.textContent);if(L.some(x=>t.startsWith(nrm(x).slice(0,40))))h.remove()});
 document.querySelectorAll('.view .crumb').forEach(c=>{if(/^Quem compra/.test(c.textContent))c.remove()})}"""
VNT=r"""()=>{const e=[...document.querySelectorAll('button,a,div')].find(x=>/^Voltar no tempo/.test(x.textContent.trim())&&x.children.length<=4&&x.getBoundingClientRect().height<120&&x.getBoundingClientRect().height>30);if(!e)return 0;
 e.outerHTML='<div style="display:flex;align-items:center;gap:16px;min-height:60px;border-bottom:1px solid var(--line2);text-align:left"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Voltar no tempo</b><small style="display:block;font-size:13px;color:var(--mute)">mudanças guardadas neste aparelho</small></span><span style="color:var(--mute);font-size:18px">›</span></div>';return 1}"""
def cena(pw,esc,prop,k):
  v={'bk':'ajustes','tema':'ajustes','upd':'ajustes','cli':'clientes'}[k]
  b,pg,w=ap.abre(pw,v,esc,'celular',base=prop);w(900)
  if v=='ajustes': pg.locator('.ajS[data-k="%s"] .ajR'%k).click();w(900)
  if prop:
    pg.add_style_tag(content=LINHA);pg.evaluate(TIRA,EXPL);w(200);pg.evaluate(VIRA,'.tmseg,.sg418,.catbar3,.adSeg,#sortChips,#fFaixas');w(300)
    pg.evaluate("()=>{document.querySelectorAll('.ajS .trk').forEach(t=>{const s=t.closest('.ajS'),r=s.querySelector('.ajR').getBoundingClientRect(),q=t.getBoundingClientRect();t.style.setProperty('margin-left',(r.left-q.left)+'px','important');t.style.setProperty('width',r.width+'px','important');const o=t.querySelector('.trkB.on'),th=t.querySelector('.trkTh');th.style.cssText='width:'+o.offsetWidth+'px!important;transform:none!important;left:'+o.offsetLeft+'px!important'})}");w(300)
    if k=='bk': pg.evaluate(VNT);w(200)
    if k=='cli': pg.evaluate("()=>{const v=document.getElementById('v-clientes');const h=[...v.querySelectorAll('*')].find(e=>/^Nenhum cliente ainda/.test(e.textContent.trim())&&e.children.length<4);if(h){const ic='<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8\"/>';h.outerHTML='<div style=\"margin-top:32px\">'+window.lfVazioHtml(ic,'Nenhum cliente ainda','Entram sozinhos com os pedidos do site, ou pelo + do título.')+'</div>'}}");w(2500)
  if v=='ajustes': pg.evaluate("k=>document.querySelector('.ajS[data-k=\"'+k+'\"]').scrollIntoView({block:'start'})",k);w(400)
  pg.add_style_tag(content='#mainnav{display:none!important}');pg.screenshot(path='/tmp/c.png');b.close();return Image.open('/tmp/c.png').convert('RGB')
CENAS=[('bk','Ajustes › Cópias e nuvem'),('tema','Ajustes › Tema'),('upd','Ajustes › Atualização'),('cli','Clientes (vazio)')]
with sync_playwright() as pw:
  for esc in (True,False):
    F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',26);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',20)
    P=[(t,cena(pw,esc,False,k),cena(pw,esc,True,k)) for k,t in CENAS]
    W=P[0][1].width//2;H=P[0][1].height//2
    o=Image.new('RGB',(len(P)*(2*W+40)+40,H+120),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o);fg=(210,210,215) if esc else (50,45,48)
    for i,(t,a,p) in enumerate(P):
      x=30+i*(2*W+40);d.text((x,16),t,font=F,fill=fg);d.text((x,58),'HOJE',font=F2,fill=(150,140,145));d.text((x+W+10,58),'PROPOSTA · sem texto que explica',font=F2,fill=(141,58,105))
      o.paste(a.resize((W,H)),(x,90));o.paste(p.resize((W,H)),(x+W+10,90))
    o.save('esboco_83_textos_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print(o.size)
