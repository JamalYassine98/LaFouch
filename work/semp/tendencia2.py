# Semp · tendência refinada (aprovado 20/11 15:30): aponta o MODELO, onde comprar em CDE (cadastradas e não cadastradas),
# e cruza com o Inventário: não tem → onde comprar · tem e tem estoque → postar · tem pouco → repor.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
TELA=r"""([ref,estado])=>{const L0=window.__LF,S=L0.S;const v=document.getElementById('v-mkt');const R=getComputedStyle(v.querySelector('.mkSec')).color;
 const foto=(S.fotos&&Object.entries(S.fotos).find(([k])=>k.startsWith(ref+'|'))||[])[1]||(document.querySelector('#v-mkt .mkSt img')||{}).src;
 const nome=estado==='nao'?'Gatinho polarizado':L0.pubNome(ref);
 const qtd=S.items.filter(i=>i.ref===ref).reduce((a,i)=>a+(+i.qty||0),0);
 const top=v.querySelector('.top');top.querySelector('h1').textContent=nome;const cr=v.querySelector('.nvVs');cr.lastChild.textContent='Mercado';
 const LN='display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:56px;border-bottom:1px solid var(--line2);padding:8px 0';
 const lin=(t,s,a)=>'<div style="'+LN+'"><div style="min-width:0;flex:1"><b style="font-size:15px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute);display:block">'+s+'</small></div>'+(a?'<span style="flex:none;font-size:15px;font-weight:600;color:'+R+'">'+a+'</span>':'')+'</div>';
 const tit=t=>'<div class="mkSec" style="margin:32px 0 8px">'+t+'</div>';
 let h='<div style="font-size:13px;color:var(--mute);margin:4px 0 0">tendência · subindo há 3 semanas</div>'+
  '<div style="margin-top:16px;border-radius:16px;overflow:hidden;background:#fff;height:200px;display:flex;align-items:center;justify-content:center"><img src="'+foto+'" style="max-width:88%;max-height:88%;object-fit:contain"></div>';
 if(estado==='nao'){
  h+='<div style="font-size:13px;color:var(--mute);text-align:center;margin-top:8px">fotos de referência · só dentro do app</div>'+
   lin('Modelo','gatinho · acetato · lente polarizada UV400','Confirmar')+
   tit('Você tem?')+lin('Não tem nenhum parecido','o Semp comparou com as fotos do Inventário')+
   tit('Onde comprar em CDE · 2')+
   lin('Do seu cadastro · cadastrada','US$ 4,20 · Microcentro, CDE · caixa com 12','Mapa')+
   lin('Achada no Instagram · não cadastrada','US$ 3,90 · Microcentro, CDE','Mapa')+
   '<div style="display:flex;justify-content:flex-end;margin-top:8px"><span style="font-size:15px;font-weight:600;color:'+R+'">Cadastrar a nova ›</span></div>'+
   tit('O Guardião diz')+lin('Vale comprar até US$ 6','sugestão 10 un. · cabe no caixa e na reserva de repor')+
   '<button type="button" class="go" style="width:100%;margin-top:24px">Pedir à distribuidora</button>';
 }else if(estado==='tem'){
  h+=tit('Você tem?')+lin('Sim · '+qtd+' em estoque','o Semp achou no Inventário pela foto e pelo código')+
   tit('O Semp sugere')+lin('Postar hoje às 20h','está em alta e você tem estoque · não precisa comprar')+
   '<button type="button" class="go" style="width:100%;margin-top:24px">Criar o post</button>';
 }else{
  h+=tit('Você tem?')+lin('Sim · só '+qtd+' em estoque','vai acabar logo, com a tendência subindo')+
   tit('O Guardião diz')+lin('Repor 12 un.','cabe no caixa · pedir na distribuidora de sempre')+
   '<button type="button" class="go" style="width:100%;margin-top:24px">Repor</button>';
 }
 const box=document.createElement('div');box.innerHTML=h;
 [...v.children].forEach(e=>{if(e!==top&&e!==cr&&!e.contains(top))e.remove()});top.after(box)}"""
def tira(pg,nome):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/t2_%s.png'%nome;pg.screenshot(path=f,full_page=True);im=Image.open(f);return im.crop((0,0,780,im.height))
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(34),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
ESTADOS=[('YS8801','nao','1 · você NÃO tem','modelo · onde comprar em CDE'),('YS8801','tem','2 · você TEM e tem estoque','não manda comprar · sugere postar'),('YM7790','pouco','3 · você tem POUCO','sugere repor, com a quantidade')]
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    for ref,est,t,s in ESTADOS:
      b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True);pg.evaluate(TELA,[ref,est]);w(400);q.append((t,s,tira(pg,est+n)));b.close()
    quadro('esboco_semp_tendencia2_%s.jpg'%n,esc,q)
