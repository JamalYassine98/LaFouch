# S436 esboço 16 (v2, 20/11): Hoje = app real com o ESTADO real de uma peça incompleta que está no site;
# Proposta = a mesma tela com a chave desligada, dizendo o que falta, e a marca "Peça de teste". Passa pelo comparador (regra 11).
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');sys.path.insert(0,'/home/claude/lafouch/work/s436')
import ap,compara_app as cmp;from telas import C
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s436/banco/v2/'
PX='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
# estado: a 1ª peça do Inventário com foto em todas as cores, com estoque, no site, SEM formato e SEM medidas
ESTADO="""(px)=>{const L=window.__LF,S=L.S;L.setView('estoque');const ref='BR44118';window.__r16=ref;
 S.items.filter(i=>i.ref===ref).forEach(i=>{if(!S.fotos[ref+'|'+i.cor])S.fotos[ref+'|'+i.cor]=px;delete i.med;if(i.qty<1)i.qty=1});
 if(S.attr&&S.attr[ref]){delete S.attr[ref].formato}
 S.site=S.site||{};S.site[ref]=1;if(S.siteFora)delete S.siteFora[ref];L.render();return [ref,L.siteCheck(ref).ok]}"""
PROP="""()=>{const b=document.getElementById('edSite');const h=b.querySelector('.hint');h.textContent='falta formato e medidas';h.style.color='var(--warn)';
 const s=b.querySelector('.scSw');s.classList.remove('on');s.setAttribute('aria-checked','false');
 const sub=[...document.querySelectorAll('#detail .crumb')].find(x=>x.getBoundingClientRect().height);
 const t=document.createElement('div');t.className=sub.className;t.textContent='Peça de teste';t.style.color='var(--warn)';sub.insertAdjacentElement('afterend',t);return [sub.tagName,sub.className,sub.textContent]}"""
REL={}
def abre(pw,esc,apar,prop):
  b,pg,w=ap.abre(pw,'inicio',esc,apar,base=True)
  r=pg.evaluate(ESTADO,PX);w(400)
  pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-estoque .pcard[data-ref]')].find(x=>x.dataset.ref===window.__r16);e.scrollIntoView({block:'center',behavior:'instant'});e.click()}");w(900)
  x=pg.evaluate(PROP) if prop else None;w(400)
  return b,pg,w,r,x
with sync_playwright() as pw:
  for apar in ('celular','tablet','pc'):
    for esc in (True,False):
      n=apar+'_'+('escuro' if esc else 'claro');col={}
      for fase in ('hoje','hoje2','prop'):
        b,pg,w,r,x=abre(pw,esc,apar,fase=='prop')
        pg.evaluate("()=>scrollTo({top:0,behavior:'instant'})");w(400);col[fase]=cmp.coleta(pg)
        if fase!='hoje2':
          pg.evaluate("()=>{const e=document.getElementById('edSite'),t=[...document.querySelectorAll('#detail .crumb')].find(x=>x.getBoundingClientRect().height);const top=Math.min(t.getBoundingClientRect().top,e.getBoundingClientRect().top)+scrollY;scrollTo({top:top-150,behavior:'instant'})}");w(600)
          pg.screenshot(path=O+'f_%s_%s.png'%(fase,n))
        if fase=='prop': print(n,r,x)
        b.close()
      D=cmp.difere(col['hoje'],col['prop'],col['hoje2']);REL[n]=cmp.texto(D)
json.dump(REL,open(O+'comparador.json','w'),ensure_ascii=False,indent=1)
from PIL import Image,ImageDraw,ImageFont
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30);G=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
DIF=['O que muda (tudo o que o comparador achou):','1. Linha nova "Peça de teste" embaixo do subtítulo — amarelo de atenção, mesma letra do subtítulo.','2. Chave "No site": ligada → desligada (peça incompleta não vai ao site; tocar não liga enquanto faltar dado).','3. Frase da chave: "aparece no catálogo online · 3 cores" → "falta formato e medidas", em amarelo.','    Mais de 2 faltando: "falta formato, medidas e mais 2" (cabe numa linha).','4. O que está abaixo da linha nova desce 24 px. Nada mais muda.']
TAB=['No tablet o comparador achou falhas que JÁ EXISTEM hoje (não são deste esboço): "Ficha 5/6" e "Preço" saem','da tela e a coluna de 152 px quebra o subtítulo e a frase da chave em 2 linhas. Fica anotado para conserto próprio.']
for apar in ('celular','tablet','pc'):
  for n,bg,fg in (('escuro',(14,17,22),(235,235,240)),('claro',(250,248,250),(30,30,36))):
    a=Image.open(O+'f_hoje_%s_%s.png'%(apar,n));p=Image.open(O+'f_prop_%s_%s.png'%(apar,n))
    if apar=='celular': a=a.resize((a.width//2*1,a.height//2*1)) if False else a;
    linhas=DIF+(TAB if apar=='tablet' else []);rod=40+30*len(linhas)
    if apar=='pc':
      c=Image.new('RGB',(a.width+40,a.height*2+250+rod),bg);d=ImageDraw.Draw(c)
      d.text((20,16),'HOJE · Inventário › ficha (PC) — peça sem formato e sem medidas está no site',font=F,fill=fg);c.paste(a,(20,70))
      d.text((20,a.height+90),'PROPOSTA — a chave desliga e diz o que falta · marca de teste',font=F,fill=fg);c.paste(p,(20,a.height+144));y=a.height*2+170
    else:
      c=Image.new('RGB',(a.width*2+60,a.height+130+rod),bg);d=ImageDraw.Draw(c)
      d.text((20,16),'HOJE · Inventário › ficha (%s)'%apar,font=F,fill=fg);d.text((20,58),'peça sem formato e sem medidas está no site',font=G,fill=(150,150,160))
      d.text((a.width+40,16),'PROPOSTA',font=F,fill=fg);d.text((a.width+40,58),'a chave desliga e diz o que falta · marca de teste',font=G,fill=(150,150,160))
      c.paste(a,(20,110));c.paste(p,(a.width+40,110));y=a.height+130
    for k,l in enumerate(linhas): d.text((20,y+30*k),l,font=G,fill=fg if k==0 else (150,150,160))
    c.save('/home/claude/lafouch/work/s436/banco/esboco16_ficha_%s_%s.jpg'%(apar,n),quality=86)
for n,l in REL.items():
  print('==',n,len(l));[print('  ',x[:200]) for x in l]
