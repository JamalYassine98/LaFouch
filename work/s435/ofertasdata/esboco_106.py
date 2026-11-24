# Esboço 106 (S435, 24/11 00:45) — OFERTAS DA DATA (dono 24/11 00:36–00:39): o Semp e o Titan SEMPRE põem ofertas nas datas (nunca 'não precisa');
# de 3 a 6, e elas fazem sentido com o tema — Mães: femininas · Pais: masculinas · Natal: para presentear (unissex, as que mais vendem) ·
# Ano Novo/verão: solares · Black Friday: todas, primeiro as paradas. Cada oferta diz o porquê; o Titan confere a margem; dura a data; loja e site;
# de/por honesto (94). Base: 103 v3 aprovado (tela da data) + aprovados.py. Peças REAIS do catálogo de teste (nome com o público); os % são do
# Titan em ilustração (no teste o preço já está abaixo do mínimo).
exec(open('/home/claude/lafouch/work/s435/lote99/esboco_103.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0])
O='/home/claude/lafouch/work/s435/ofertasdata/'
_fim=fim
def fim(pg,b,n):
  pg.add_style_tag(content='#mainnav{display:none!important}')
  confere(pg,n);pg.screenshot(path='/tmp/s106.png',full_page=True);b.close()
  im=Image.open('/tmp/s106.png');im.load();im=im.copy();return im.crop((0,0,im.width,min(im.height,2300)))
PEGA="""()=>[...document.querySelectorAll('.pcard')].map(c=>{const t=c.innerText.split('\\n').map(s=>s.trim()).filter(Boolean);const i=c.querySelector('img');return [t[0]||'',t.find(x=>/^G\\$/.test(x))||'',i?i.src:'']}).filter(x=>x[2]&&x[1])"""
def pecas(pw):
  b,pg,w=ap.abre(pw,'vendas',True,'celular',base=True);w(1200)
  pg.evaluate("()=>{for(let i=0;i<6;i++)window.scrollBy(0,3000)}");w(800)
  L=pg.evaluate(PEGA);b.close();return L
OFJ=r"""const OFR=(img,t,pr,por,s,pc)=>'<div style="display:flex;align-items:center;gap:16px;min-height:80px;border-bottom:1px solid var(--line2)"><span style="flex:0 0 64px;height:48px;border-radius:10px;overflow:hidden;background:#fff;display:grid;place-items:center"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain"></span><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500;white-space:nowrap;overflow:hidden">'+t+'</b><small style="display:block;margin-top:2px;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small><small style="display:block;margin-top:2px;font-size:13px;white-space:nowrap"><s style="color:var(--mute)">'+pr+'</s> · <b style="font-weight:600">'+por+'</b></small></span><span style="font-size:15px;color:var(--mute);white-space:nowrap">'+pc+'</span></div>';"""
def data(nome,per,cupom,kit,ofs,n):
  linhas="+".join("OFR(%r,%r,%r,%r,%r,%r)"%o for o in ofs)
  return ("TOP('Temática',%r,%r,1)+"%(nome,per)+
   "'<div style=\"display:flex;align-items:center;gap:16px;min-height:64px;margin-top:16px;border-bottom:1px solid var(--line2)\"><span style=\"flex:1;min-width:0\"><b style=\"display:block;font-size:16px;font-weight:500\">Liga sozinho</b><small style=\"display:block;font-size:13px;color:var(--mute)\">"+per+"</small></span><button type=\"button\" class=\"lkTx on\">pausar</button></div>'+"
   "T('O que o cliente recebe')+LUXO("+cupom+")+KIT("+kit+")+"
   "T('Ofertas da data · %d')+'<div style=\"display:flex;align-items:center;gap:12px;min-height:56px;border-bottom:1px solid var(--line2)\"><i style=\"flex:none;width:8px;height:8px;border-radius:50%%;background:var(--ok)\"></i><span style=\"flex:1;min-width:0;font-size:15px\">O Titan conferiu as %d<small style=\"display:block;font-size:13px;color:var(--mute)\">margem segura · valem na loja e no site</small></span></div>'+"%(len(ofs),len(ofs))+linhas+
   "+'<div style=\"margin-top:16px\">'+LN('','Custo estimado','cupons, kits e ofertas','G$ 1.120.000','')+'</div>'")
def t106(pw,esc,corpo,n):
  b,pg,w=base(pw,esc);html=pg.evaluate("()=>{"+H+JS+S3B+KC+OFJ+open("/home/claude/lafouch/work/s435/varredura/cartao_luxo.js").read().split("\n",3)[3]+"return '<div class=\"e49\">'+"+corpo+"+'</div>'}");pagina(pg,html);w(600)
  A2.aplica(pg);w(300)
  pg.evaluate("()=>{document.querySelectorAll('.e49 b').forEach(e=>{if(getComputedStyle(e).whiteSpace!='nowrap')return;let f=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>e.clientWidth+1&&f>11){f-=.5;e.style.fontSize=f+'px'}})}");w(200)
  return fim(pg,b,n)
import re
with sync_playwright() as pw:
  P=pecas(pw)
  f=lambda rx:[p for p in P if re.search(rx,p[0],re.I)]
  dd=lambda L:[p for i,p in enumerate(L) if p[0] not in [q[0] for q in L[:i]]]
  fem=dd(f('feminin'))[:4];uni=dd(f('unissex'))[:2]+dd(f('solar'))[:2]
  pr=lambda p:p[1];por=lambda p,d:'G$ '+format(int(int(p[1].replace('G$','').replace('.','').strip())*(1-d)/1000)*1000,',').replace(',','.')
  MAE=[(p[2],p[0],pr(p),por(p,.1),'feminina · Dia das Mães','−10%') for p in fem]
  NAT=[(p[2],p[0],pr(p),por(p,.1),('unissex · para presentear' if re.search('unissex',p[0],re.I) else 'solar · das que mais vendem'),'−10%') for p in uni]
  print(len(P),[m[1] for m in MAE],[m[1] for m in NAT])
  CN="{tema:'natal',rot:'CUPOM DE NATAL',pct:'10%',tit:'na conta de todo cliente cadastrado',nome:'NOME DO CLIENTE',val:'ATÉ 25/12',mt:8}"
  CM="{tema:'maes',rot:'DIA DAS MÃES',pct:'10%',tit:'na conta de todo cliente cadastrado',nome:'NOME DO CLIENTE',val:'ATÉ 15/05',mt:8}"
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_106_ofertas_da_data_%s.jpg'%n,[('PROPOSTA · Natal',n+' · ofertas para presentear',t106(pw,esc,data('Natal','01/12 a 25/12',CN,"'Kit de Natal','estojo, flanela e líquido','40'",NAT,'n'),'Natal')),
       ('PROPOSTA · Dia das Mães',n+' · ofertas femininas',t106(pw,esc,data('Dia das Mães','01/05 a 15/05',CM,"'Kit Dia das Mães','estojo floral, flanela e cartão','0'",MAE,'m'),'Mães'))])
for n_,f_ in REL: print(n_,f_)
