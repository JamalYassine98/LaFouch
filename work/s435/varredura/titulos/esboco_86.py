# Esboço 86 (S435, 23/11 00:35) — VARREDURA · parte 5 · TÍTULOS E LINHAS. Medido no app de hoje (coleta.py):
# · títulos de tela (h1): 1 desenho só (Fraunces 28) — OK, fica.
# · rótulos de seção em MAIÚSCULAS: 5 desenhos (peso 600/700, espaço entre letras 0,6/1,44/1,61/1,68 px, letra 11,5/12) e cores diferentes
#   (rosa em Ajustes, cinza no resto) → UM rótulo: 12 px, peso 600, espaço .14em, cinza (aprovado 37b, 21/11: rótulos cinza).
# · linhas de lista: 14 alturas (44 a 109 px) e o texto principal em 8 tamanhos/pesos → UMA linha: título 16 px peso 500, frase 13 px cinza;
#   altura 56 (uma linha de texto) ou 64 (título + frase) — múltiplos de 8 (L3). Números grandes (valores) ficam como dado.
# · v2 (dono 00:43: 'está usando modelos antigos'): Ajustes no estado APROVADO (22/11 01:28 + 21:56 + 46): só Contas ligadas (Instagram ·
#   Cópias e nuvem) e Este aparelho (Impressora · Tema · Segurança · Sons e avisos · Atualização); saem Marca, Site, Pedidos do site, Preços,
#   Pagamento automático e o bloco Loja. (aprovados.ajustes)
# · subtítulo 'Aparelho, loja, site e segurança.' sai (descrição inútil, mesma regra do 70/54/83).
# · Despesas leva o aprovado 79: 'Salário' vira 'Dia a dia do dono'; sai 'Provisão de imprevistos' (a caixinha substitui) → contas G$ 4.000.000,
#   cada peça separa G$ 21.390 (4.000.000 ÷ 187). Histórico: a frase da linha não pode quebrar (L4) → 'lucro' no lugar de 'lucro livre'.
# · L4: frase de linha nunca quebra nem corta — a letra da frase desce até caber (uma função só); 'informe o valor' → 'sem valor'.
# · "Voltar no tempo ›" (seta quebrando) já resolvido no 83. Proposta leva TODOS os aprovados (aprovados.py: 80–85).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import ap,aprovados
sys.path.insert(0,'/home/claude/lafouch/work/kit');import mede as M
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
AJ=r"""()=>{document.querySelectorAll('.ajS').forEach(s=>{const t=(s.querySelector('.ajR b')||{}).textContent||'';if(/^Preços$/.test(t.trim()))s.remove()});document.querySelectorAll('#v-ajustes *').forEach(e=>{if(e.children.length<4&&/^(Preço automático|Contas, taxas e meta)/.test(e.textContent.trim())){const r=e.closest('.swrow,.fxH,section,.ajS,div');r&&r.remove()}})}"""
DESP=r"""()=>{const v=document.getElementById('v-desp');const W=document.createTreeWalker(v,NodeFilter.SHOW_TEXT);let n,L=[];while(n=W.nextNode())L.push(n);
 L.forEach(t=>{const x=t.textContent.trim();if(x=='Salário')t.textContent=t.textContent.replace('Salário','Dia a dia do dono');if(x=='G$ 4.200.000')t.textContent='G$ 4.000.000';if(x=='G$ 22.460')t.textContent='G$ 21.390';if(/informe o valor/.test(t.textContent))t.textContent=t.textContent.replace('informe o valor','sem valor')});
 L.filter(t=>t.textContent.trim()=='Imprevistos').forEach(t=>{let r=t.parentElement,k=0;while(r&&k<6&&!(getComputedStyle(r).borderBottomWidth!='0px'&&r.getBoundingClientRect().width>250)){r=r.parentElement;k++}if(r&&k<6&&r.id!='v-desp')r.remove()});
 const bar=[...v.querySelectorAll('*')].find(e=>e.children.length>=5&&e.getBoundingClientRect().height<14&&e.getBoundingClientRect().width>250);if(bar){bar.lastElementChild.remove();[...bar.children].forEach(c=>{const w=parseFloat(c.style.width);if(w)c.style.width=(w*4.2/4.0)+'%';else c.style.flexGrow=1})}}"""
REGRA=r"""()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>30&&r.height>8&&e.offsetParent};
 document.querySelectorAll('.view:not([hidden]) *').forEach(e=>{if(!vis(e)||e.children.length>2)return;const c=getComputedStyle(e);const up=c.textTransform=='uppercase'||(e.classList.contains('ajBt'));if(up&&!e.closest('.nvVs,button,a')&&e.textContent.trim().length<40){e.style.setProperty('font-size','12px','important');e.style.setProperty('font-weight','600','important');e.style.setProperty('letter-spacing','.14em','important');e.style.setProperty('color','var(--mute)','important')}});
 document.querySelectorAll('.view:not([hidden]) *').forEach(e=>{if(!vis(e))return;const c=getComputedStyle(e),r=e.getBoundingClientRect();if(!(parseFloat(c.borderBottomWidth)>=1&&parseFloat(c.borderTopWidth)==0&&r.width>300&&r.height>=40&&r.height<=110&&e.children.length>=1))return;
  const b=e.querySelector('b,strong');if(b&&parseFloat(getComputedStyle(b).fontSize)<=17){b.style.setProperty('font-size','16px','important');b.style.setProperty('font-weight','500','important')}
  const sm=e.querySelector('small,.hint,.ajRes');const dois=!!(e.querySelector('small')&&e.querySelector('small').textContent.trim());
  e.style.setProperty('min-height',(dois?64:56)+'px','important');e.style.setProperty('box-sizing','border-box','important')})}"""
REL=[]
def cena(pw,esc,prop,v):
  b,pg,w=ap.abre(pw,v,esc,'celular',base=prop);w(1000)
  if prop:
    aprovados.aplica(pg)
    if v=='ajustes': aprovados.ajustes(pg)
    if v=='desp': pg.evaluate(DESP);w(300)
    if v=='hist': pg.evaluate("()=>{document.querySelectorAll('#v-hist small, #v-hist .hint, #v-hist span, #v-hist div').forEach(e=>{if(e.children.length==0&&/lucro livre/.test(e.textContent))e.textContent=e.textContent.replace('lucro livre','lucro')});document.querySelectorAll('#v-hist *').forEach(e=>{if(e.children.length<=3&&/· 1 outro ·/.test(e.textContent)&&e.children.length==0)e.textContent=e.textContent.replace(' 1 outro ·','')})}");w(300)
    pg.evaluate(REGRA);w(400)
    pg.evaluate("()=>{document.querySelectorAll('.view:not([hidden]) *').forEach(e=>{const c=getComputedStyle(e);let f=parseFloat(c.fontSize);if(f>13.5||!e.textContent.trim()||e.closest('button.go,.trk'))return;if([...e.children].some(k=>getComputedStyle(k).display=='block'))return;const lh=parseFloat(c.lineHeight)||f*1.35;let g=0;while((e.getBoundingClientRect().height>lh*1.5||e.scrollWidth>e.clientWidth+1)&&f>10.5&&g<12){f-=.5;g++;e.style.setProperty('font-size',f+'px','important')}})}");w(200)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  a,_=M.percorre(pg,None);REL.append((v,'prop' if prop else 'hoje',[(k[0],x['d'][:50]) for k,x in a.items()]))
  pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}");w(300)
  pg.screenshot(path='/tmp/t.png');b.close();return Image.open('/tmp/t.png').convert('RGB')
CENAS=[('ajustes','Ajustes'),('caixa','Caixa'),('hist','Resultados › Histórico'),('desp','Despesas')]
with sync_playwright() as pw:
  for esc in (True,False):
    F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',26);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',20)
    P=[(t,cena(pw,esc,False,v),cena(pw,esc,True,v)) for v,t in CENAS]
    W=P[0][1].width//2;H=P[0][1].height//2
    o=Image.new('RGB',(len(P)*(2*W+40)+40,H+120),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o);fg=(210,210,215) if esc else (50,45,48)
    for i,(t,a,p) in enumerate(P):
      x=30+i*(2*W+40);d.text((x,16),t,font=F,fill=fg);d.text((x,58),'HOJE',font=F2,fill=(150,140,145));d.text((x+W+10,58),'PROPOSTA · um rótulo, uma linha',font=F2,fill=(141,58,105))
      o.paste(a.resize((W,H)),(x,90));o.paste(p.resize((W,H)),(x+W+10,90))
    o.save('esboco_86_titulos_linhas_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print(o.size)
for r in REL: print(r)
