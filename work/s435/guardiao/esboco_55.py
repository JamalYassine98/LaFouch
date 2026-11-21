# Esboço 55 (S435, 21/11 18:20) — desconto do Guardião no Vender (dono 17:54; Guardião dono do preço, aprovado 18:03).
# No Carrinho, embaixo de cada peça, uma linha discreta do Guardião com os dois limites reais (pisoPeca: piso = com margem boa,
# saída = sem prejuízo) e, embaixo do total, o desconto possível da venda inteira. O aviso de "abaixo da trava" no pagamento continua.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s430/comparador');import ap,compara
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/guardiao/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
REL=[]
def confere(pg,n):
  r=pg.evaluate(compara.COLETA);T={'L':r['L'],'sob':{tuple(sorted(x)) for x in r['sob']}};f=compara.falhas(T);REL.append((n,[(k[0],' / '.join(e['nome'] for e in v)) for k,v in f.items()]))
def carrinho(pw,prop,esc=True):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(1200)
  def add(ref):
    pg.evaluate("(r)=>{const c=[...document.querySelectorAll('#v-vendas .pcard')];const k=c.find(x=>x.textContent.includes(r))||c[1];k.click()}",ref);w(1300)
    pg.evaluate("()=>{const b=[...document.querySelectorAll('button.go')].find(e=>/Vender/.test(e.textContent));b&&b.click()}");w(1300)
  add('Óculos de leitura de acetato');pg.evaluate("()=>document.querySelector('.c54Mais').click()");w(1200)
  pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-vendas .pcard')];const k=c.find(x=>/Óculos solar #13/.test(x.textContent));k&&k.click()}");w(1300)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('button.go')].find(e=>/Vender/.test(e.textContent));b&&b.click()}");w(1300)
  pg.add_style_tag(content='#nvBar{display:none!important}')
  if prop:
    pg.evaluate(r"""()=>{const S=__LF.S,gs=n=>'G$ '+Math.round(n).toLocaleString('pt-BR');
     const ln=[...document.querySelectorAll('#cartCard .c54L')];let tot=0,min=0;
     ln.forEach(l=>{const r=(l.textContent.match(/[A-Z]{2}\d{3,6}/)||[])[0];const it=S.items.find(i=>i.ref===r&&i.qty>0);if(!it)return;const p=__LF.pisoPeca(it);
       tot+=p.lista;const bom=p.piso<p.lista,semP=p.saida<p.lista;min+=bom?p.piso:(semP?p.saida:p.lista);
       const pct=v=>Math.round((1-v/p.lista)*100)+'%';
       const t=bom?['até '+pct(p.piso)+' com margem · '+gs(p.piso),'var(--ok,#4fbf7f)']:semP?['até '+pct(p.saida)+' sem prejuízo · '+gs(p.saida),'var(--warn,#e0b44c)']:['sem desconto · já abaixo do custo','var(--bad,#e5484d)'];
       const im=l.querySelector('img');const x0=im?im.getBoundingClientRect().right-l.getBoundingClientRect().left+16:80;
       l.insertAdjacentHTML('afterend','<div style="font-size:13px;margin:-4px 0 0;padding:0 0 16px '+x0+'px;color:'+t[1]+';border-bottom:1px solid var(--line2)">Guardião: '+t[0]+'</div>');l.style.setProperty('border-bottom','0','important')});
     const T=[...document.querySelectorAll('#cartCard *')].find(e=>e.children.length==0&&/^Total$/.test(e.textContent.trim()));
     const bloco=T.parentElement;bloco.insertAdjacentHTML('beforeend','<div style="font-size:14px;color:var(--mute);margin-top:8px;text-align:center">Pode dar até '+gs(tot-min)+' nesta venda</div>')}""");w(500)
  confere(pg,'Carrinho '+('proposta' if prop else 'hoje'));pg.screenshot(path='/tmp/c55.png');x=Image.open('/tmp/c55.png').copy();b.close();return x
def quadro(arq,esc,q):
  g=40;w=max(i.width for _,_,i in q);h=max(i.height for _,_,i in q);S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=fg);d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+im.width,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_55_desconto_vender_%s.jpg'%n,esc,[('HOJE · Carrinho','o limite só aparece depois de digitar um valor menor',carrinho(pw,0,esc)),('PROPOSTA · Carrinho','o Guardião diz quanto pode dar, antes de cobrar',carrinho(pw,1,esc))])
for n,f in REL: print(n,len(f),f[:4])
