# Esboço 52 parte 1 (S435, 21/11 13:55) — desfazer "Giro e preços" (aprovado 13:48). Parte 1: Início sem a família ·
# Inventário com o estado do estoque (valor a custo + "Parados e sobrando ›") · tela Parados e sobrando.
# Base: app real (dados de teste) + aprovados (37 ícones cinza, 48b Inventário sem abas e "+" com selo, 149s, 99/100).
# Conferência: a coleta do comparador único (work/s430/comparador/compara.py: COLETA/falhas) em cada quadro Hoje × Proposta.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s430/comparador');import ap
import compara
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/giroprecos/'
H=open('/home/claude/lafouch/work/s435/selo/esboco_49.py').read();H=H[H.index('H=r"""')+6:H.index('"""',H.index('H=r"""')+6)]
REL=[]
def confere(pg,nome):
  r=pg.evaluate(compara.COLETA);T={'L':r['L'],'sob':{tuple(sorted(x)) for x in r['sob']}}
  f=compara.falhas(T);REL.append((nome,[(k[0],' / '.join(e['nome'] for e in v)) for k,v in f.items()]));return f
def shot(pg,n):
  f='/tmp/e52_%s.png'%n;pg.screenshot(path=f);x=Image.open(f);x.load();return x.copy()
INV48=r"""()=>{document.getElementById('eTabs').style.setProperty('display','none','important');[...document.querySelectorAll('#kpisE .kpi')].filter(k=>/Lotes pendentes/.test(k.textContent)).forEach(k=>k.remove());
 const b=document.querySelector('button[aria-label="Adicionar"]');b.style.position='relative';b.insertAdjacentHTML('beforeend','<i style="position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center;padding:0 5px">2</i>')}"""
def inicio(pw,prop):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(900);pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  if prop: pg.evaluate(r"""()=>{const f=()=>{[...document.querySelectorAll('#v-inicio *')].filter(e=>e.children.length==0&&e.textContent.trim()=='Giro e preços').forEach(e=>{const r=e.closest('button,a,.iniL,.nvL,li,[data-id]');if(r)r.remove()})};f();new MutationObserver(f).observe(document.body,{childList:true,subtree:true})}""");w(500)
  confere(pg,'Início '+('proposta' if prop else 'hoje'));x=shot(pg,'ini%d'%prop);b.close();return x
def inventario(pw,prop):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(700);pg.add_style_tag(content='#nvBar{display:none!important}')
  pg.evaluate(INV48);w(300)
  if prop: pg.evaluate(r"""()=>{const k=document.getElementById('kpisE');k.style.setProperty('display','none','important');
   // o "caminho" estático (Grupo Pré-graduados › Grau › Formato › Referência) vira o resumo da loja; o nº de peças fica só na linha da lista (segue o filtro)
   const c=document.getElementById('crumb');c.textContent='16 referências · US$ 420 a custo';
   const ST='display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2);color:var(--fg);font:inherit;text-align:left;padding:10px 0;margin:16px 0';
   k.insertAdjacentHTML('afterend','<button type="button" class="pa52" style="'+ST+'"><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">Parados e sobrando</b><small style="font-size:13px;color:var(--mute)">41% do investido sem vender há 60+ dias</small></span><b style="font-size:16px;font-weight:600;color:var(--warn,#e0b44c);font-variant-numeric:tabular-nums">US$ 172</b><i style="font-style:normal;font-size:20px;color:var(--mute)">›</i></button>')}""");w(400)
  confere(pg,'Inventário '+('proposta' if prop else 'hoje'));x=shot(pg,'inv%d'%prop);b.close();return x
def parados(pw):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  html=pg.evaluate("()=>{"+H+r"""const R=(t,s,v,c)=>'<div style="display:flex;align-items:center;gap:16px;min-height:80px;border-bottom:1px solid var(--line2)"><span style="flex:0 0 64px;height:48px;border-radius:10px;background:var(--panel2);display:grid;place-items:center">'+SV(IC.lote)+'</span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><b style="font-size:16px;font-weight:600;color:'+c+';font-variant-numeric:tabular-nums">'+v+'</b><span style="color:var(--accent-fg);font-size:14px;font-weight:600">Oferta ›</span></span></div>';
   return '<div class="e49">'+TOP('Inventário','Parados e sobrando','O que está sem vender ou acima do ideal',0)+
    LBL('Parado 60+ dias · 1','US$ 172')+R('Lote Kazwini','343 un. · 430 dias sem venda','US$ 172','var(--warn,#e0b44c)')+
    LBL('Sobrando · 0')+'<div style="color:var(--mute);font-size:14px;padding:16px 0;border-bottom:1px solid var(--line2)">Nada acima do ideal agora.</div></div>'}""")
  pg.evaluate(r"""(h)=>{const v=document.getElementById('v-grp');const f=()=>{if(!v.querySelector('.e49'))v.innerHTML=h};f();new MutationObserver(f).observe(v,{childList:true})}""",html);w(500)
  confere(pg,'Parados e sobrando proposta');x=shot(pg,'par');b.close();return x
def quadro(arq,q):
  g=40;w=max(i.width for _,_,i in q);h=max(i.height for _,_,i in q);S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+im.width,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_52a_inicio.jpg',[('HOJE · Início','com "Giro e preços"',inicio(pw,0)),('PROPOSTA · Início','sem "Giro e preços"',inicio(pw,1))])
  quadro('esboco_52b_inventario.jpg',[('HOJE · Inventário (com 48b)','sem o estado do estoque',inventario(pw,0)),('PROPOSTA · Inventário','sem os números grandes · resumo embaixo do título',inventario(pw,1)),('PROPOSTA · Parados e sobrando ›','as duas listas, cada uma com "Oferta ›"',parados(pw))])
 json.dump(REL,open(O+'conferencia_52.json','w'),ensure_ascii=False,indent=1)
 for n,f in REL: print(n,len(f),f[:6])
