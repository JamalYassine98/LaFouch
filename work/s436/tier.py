# S436 — "tier list" das famílias de botões: cada fila = uma família; à esquerda as caras de HOJE (recortes reais), à direita o PADRÃO recomendado.
import sys,os,re,json,collections;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
H='/home/claude/lafouch/work/verif/';O='/home/claude/lafouch/work/s436/';T='/tmp/s436/';os.makedirs(T,exist_ok=True)
EXTRA=eval(re.search(r'^EXTRA=(\[.*\])$',open(H+'estilos.py').read(),re.M).group(1))
PASSOS=dict(C);PASSOS.update({k:v for k,v in EXTRA})
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00'};return 1}"
ESC=os.environ.get('ESC','1')=='1'
F=json.load(open(H+'inv/atual/familias2.json'))
ORDEM=['volta','sai','linha','dobra','mais','maistx','prin','sec','perigo','desfaz','icone','escolha','opcao','passo','chave','valor','cartao','mostra','titulo','fechar']
NOME={'volta':'Voltar ‹','sai':'Link ›','linha':'Linha que abre','dobra':'Dobra ⌄','mais':'Adicionar +','maistx':'"+" em texto','prin':'Principal','sec':'Secundário','perigo':'Perigo','desfaz':'Desfazer','icone':'Ícone redondo','escolha':'Escolha','opcao':'Opção de janela','passo':'Passo − / +','chave':'Liga / desliga','valor':'Número tocável','cartao':'Cartão de peça','mostra':'Mostrar mais','titulo':'Título','fechar':'Fechar / ×'}
# variantes de hoje: uma por cara diferente (máx. 6), guardando quantos botões usam cada uma
VAR=collections.defaultdict(list)
for k in ORDEM:
  c=collections.OrderedDict()
  for x in F.get(k,[]):
    key=(x['cara'],x['fs'])
    if key not in c: c[key]=[x,0]
    c[key][1]+=1
  VAR[k]=sorted(c.values(),key=lambda v:-v[1])[:6]
ACHA="""(b)=>{const L=[...document.querySelectorAll('button,[role=button],a[href],[data-act]')].filter(e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>2&&r.height>2&&c.visibility!='hidden'&&+c.opacity>0.05});const t=b.txt;const e=L.find(e=>(e.dataset.act||'')==b.act&&(e.innerText||e.getAttribute('aria-label')||e.title||'').trim().replace(/\\s+/g,' ').slice(0,40).startsWith(t))||L.find(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').startsWith(t));if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}"""
# padrão recomendado: desenhado com as cores e letras do próprio app
PAD={
 'volta':'<button class="pz" style="font-size:12px;font-weight:600;letter-spacing:1.68px;color:var(--mute);display:inline-flex;gap:6px;align-items:center;min-height:44px"><span style="font-size:16px;font-weight:400">‹</span>DINHEIRO</button>',
 'sai':'<button class="pz" style="color:var(--accent-fg);font-weight:600;font-size:15px;min-height:44px">Reservas ›</button>',
 'linha':'<div class="pz" style="width:340px;display:flex;align-items:center;justify-content:space-between;min-height:64px;border-bottom:1px solid var(--line2)"><span><b style="display:block;font-size:16px;font-weight:500">Aluguel da loja</b><small style="color:var(--mute);font-size:13px">vence dia 10</small></span><span style="display:flex;gap:12px;align-items:center"><b style="font-size:15px">G$ 2.500.000</b><i style="font-style:normal;color:var(--mute);font-size:20px">›</i></span></div>',
 'dobra':'<div class="pz" style="width:340px;display:flex;align-items:center;justify-content:space-between;min-height:64px;border-bottom:1px solid var(--line2)"><span><b style="display:block;font-size:16px;font-weight:500">Próximos 30 dias</b><small style="color:var(--mute);font-size:13px">saldo e contas</small></span><i style="font-style:normal;color:var(--mute);font-size:16px">⌄</i></div>',
 'mais':'<button class="pz" style="width:44px;height:44px;border-radius:50%;border:1px solid var(--line2);font-size:22px;font-weight:300;color:var(--fg)">+</button>',
 'maistx':'<button class="pz" style="color:var(--fg);font-size:15px;min-height:44px">+ Nova despesa</button>',
 'prin':'<button class="pz" style="width:340px;min-height:52px;border-radius:14px;border:1.5px solid var(--accent);color:var(--accent-fg);font-weight:600;font-size:16px">Salvar</button>',
 'sec':'<button class="pz" style="width:340px;min-height:52px;border-radius:14px;border:1px solid var(--line2);color:var(--fg);font-weight:500;font-size:16px">Mandar ao fornecedor</button>',
 'perigo':'<button class="pz" style="width:340px;min-height:52px;border-radius:14px;border:1.5px solid var(--bad);color:var(--bad);font-weight:600;font-size:16px">Esvaziar carrinho</button>',
 'desfaz':'<div class="pz" style="width:340px;display:flex;justify-content:space-between;align-items:center;min-height:52px;padding:0 16px;border-radius:14px;background:var(--panel2,var(--panel));box-shadow:0 6px 20px rgba(0,0,0,.25)"><span style="font-size:15px">Retirada removida</span><b style="color:var(--accent-fg);font-size:15px">Desfazer</b></div>',
 'icone':'<button class="pz" style="width:44px;height:44px;border-radius:50%;border:1px solid var(--line2);color:var(--fg);display:flex;align-items:center;justify-content:center">ICO</button>',
 'escolha':'<div class="pz" style="width:340px;display:flex;padding:3px;border-radius:12px;background:color-mix(in srgb,var(--fg) 4%,transparent)"><span style="flex:1;text-align:center;line-height:42px;border-radius:9px;background:var(--panel);box-shadow:0 1px 2px rgba(0,0,0,.18);font-size:14px;font-weight:500">Dia</span><span style="flex:1;text-align:center;line-height:42px;font-size:14px;color:var(--mute)">Semana</span><span style="flex:1;text-align:center;line-height:42px;font-size:14px;color:var(--mute)">Mês</span></div>',
 'opcao':'<div class="pz" style="width:340px;display:flex;justify-content:space-between;align-items:center;min-height:56px;border-bottom:1px solid var(--line2)"><span><b style="display:block;font-size:16px;font-weight:500;color:var(--accent-fg)">Este mês</b><small style="color:var(--mute);font-size:13px">1 a 19 de novembro</small></span><span style="color:var(--accent-fg)">✓</span></div>',
 'passo':'<div class="pz" style="display:flex;align-items:center;gap:16px"><button style="width:44px;height:44px;border-radius:50%;border:1px solid var(--line2);color:var(--fg);font-size:20px">−</button><b style="font-size:16px;min-width:24px;text-align:center">2</b><button style="width:44px;height:44px;border-radius:50%;border:1px solid var(--line2);color:var(--fg);font-size:20px">+</button></div>',
 'chave':'<div class="pz" style="width:340px;display:flex;justify-content:space-between;align-items:center;min-height:56px;border-bottom:1px solid var(--line2)"><span style="font-size:16px">No site</span><span style="width:48px;height:28px;border-radius:14px;background:var(--accent);position:relative"><i style="position:absolute;right:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff"></i></span></div>',
 'valor':'<button class="pz" style="display:inline-flex;align-items:baseline;gap:8px"><b style="font-size:26px">G$ 1.289.500</b><small style="color:var(--mute);font-size:12px">US$ · R$</small></button>',
 'mostra':'<button class="pz" style="color:var(--fg);font-size:15px;min-height:44px">Mostrar mais 30 ⌄</button>',
 'titulo':'<h1 class="pz" style="font-family:Fraunces,Georgia,serif;font-size:28px;font-weight:500;margin:0">Reservas</h1>',
 'fechar':'<div class="pz" style="width:340px;height:60px;border-radius:24px 24px 0 0;background:var(--panel);display:flex;justify-content:center;padding-top:10px"><span style="width:36px;height:4px;border-radius:2px;background:var(--line2)"></span></div>',
}
PNOTA={'volta':'versalete acima do título','sai':'rosa, termina em ›','linha':'linha fina · valor e › à direita','dobra':'linha fina · ⌄ à direita','mais':'+ redondo 44 px ao lado do título','maistx':'branco, sem sublinhado','prin':'1 por janela · contorno rosa · 52 px','sec':'contorno fino · 52 px','perigo':'vermelho · pede confirmação','desfaz':'no aviso de baixo','icone':'círculo 44 px · contorno fino','escolha':'barra deslizante C','opcao':'linha fina · ✓ na escolhida','passo':'− e + redondos 44 px','chave':'chave à direita da linha','valor':'número + moedas pequenas ao lado','cartao':'como hoje (foto, nome, preço)','mostra':'texto + ⌄ (abre no lugar)','titulo':'não é botão','fechar':'sai: fecha arrastando a alça'}
def abre(pw,tela):
  b,pg,w=ap.abre(pw,'inicio',ESC,base=False);w(300);pg.evaluate(LM)
  for x in PASSOS.get(tela,[]):
    try: pg.evaluate(x)
    except Exception: pass
    w(800)
  return b,pg,w
CR={}
with sync_playwright() as pw:
  por=collections.defaultdict(list)
  for k in ORDEM:
    for i,(x,n) in enumerate(VAR[k]): por[x['tela']].append((k,i,x))
  for tela,L in por.items():
    b,pg,w=abre(pw,tela)
    for k,i,x in L:
      r=pg.evaluate(ACHA,{'act':x['act'],'txt':x['txt'][:18]});w(200)
      if not r: continue
      r=pg.evaluate(ACHA,{'act':x['act'],'txt':x['txt'][:18]})
      pad=8;cl={'x':max(0,r[0]-pad),'y':max(0,r[1]-pad),'width':min(r[2]+2*pad,390-max(0,r[0]-pad)),'height':min(r[3]+2*pad,300)}
      cl['height']=min(cl['height'],844-cl['y'])
      if cl['width']<6 or cl['height']<6: continue
      f=T+'h_%s_%d.png'%(k,i)
      try: pg.screenshot(path=f,clip=cl);CR[(k,i)]=f
      except Exception as e: print('pulei',k,x['txt'][:20])
    b.close()
  # padrão
  b,pg,w=abre(pw,'inicio')
  ico=pg.evaluate("()=>{const s=document.querySelector('#sino svg');return s?s.outerHTML:''}")
  for k in ORDEM:
    if k=='cartao': continue
    pg.evaluate("h=>{let d=document.getElementById('pzBox');if(!d){d=document.createElement('div');d.id='pzBox';d.style.cssText='position:fixed;left:0;top:0;width:390px;padding:16px 24px;z-index:9999;background:var(--bg)';document.body.appendChild(d)}d.innerHTML=h;d.querySelectorAll('button').forEach(b=>{b.style.background=b.style.background||'none';if(!b.style.border)b.style.border='0';b.style.font=b.style.font||'';b.style.fontFamily='inherit'})}",PAD[k].replace('ICO',ico))
    w(150);r=pg.evaluate("()=>{const e=document.querySelector('#pzBox .pz');const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}")
    f=T+'p_%s.png'%k;pg.screenshot(path=f,clip={'x':r[0]-8,'y':r[1]-8,'width':r[2]+16,'height':r[3]+16});CR[(k,'p')]=f
  b.close()
json.dump({'%s|%s'%k:v for k,v in CR.items()},open(T+'cr.json','w'))
# ---- a lista em filas ----
Fn=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
BG=(17,20,26) if ESC else (244,241,244);FG=(235,235,240) if ESC else (30,22,28);MU=(140,150,165)
def fila(k):
  hs=[(Image.open(CR[(k,i)]).convert('RGB'),n) for i,(x,n) in enumerate(VAR[k]) if (k,i) in CR]
  p=Image.open(CR[(k,'p')]).convert('RGB') if (k,'p') in CR else None
  if k=='cartao' and hs: p=hs[0][0]
  def caber(im,mw,mh):
    s=min(1,mw/im.width,mh/im.height);return im.resize((int(im.width*s),int(im.height*s)))
  hs=[(caber(im,330,150),n) for im,n in hs if im.height>=28];p=caber(p,480,170) if p else None
  alt=max([im.height for im,_ in hs]+[p.height if p else 0,90])+70
  W=2400;S=Image.new('RGB',(W,alt),BG);d=ImageDraw.Draw(S)
  d.rectangle([0,0,300,alt],fill=(141,58,105));d.text((20,alt//2-36),NOME[k],font=Fn(30,True),fill='white');d.text((20,alt//2+6),'%d botões'%len(F.get(k,[])),font=Fn(22),fill='white')
  x=330
  for j2,(im,n) in enumerate(hs):
    if x+im.width>1840:
      d.text((x,alt//2-12),'+%d'%(len(hs)-j2),font=Fn(24,True),fill=MU);break
    S.paste(im,(x,40));d.text((x,8),'%d×'%n,font=Fn(22,True),fill=MU);x+=im.width+30
  d.line([1860,10,1860,alt-10],fill=(141,58,105),width=3)
  if p: S.paste(p,(1890,40));d.text((1890,8),'PADRÃO',font=Fn(22,True),fill=(228,106,168))
  d.text((1890,alt-30),PNOTA[k],font=Fn(20),fill=MU)
  d.line([0,alt-1,W,alt-1],fill=(60,60,70))
  return S
partes=[ORDEM[:7],ORDEM[7:14],ORDEM[14:]]
for j,P in enumerate(partes):
  fs=[fila(k) for k in P];W=2400;Hh=110+sum(f.height for f in fs)
  S=Image.new('RGB',(W,Hh),BG);d=ImageDraw.Draw(S)
  d.text((20,24),'Famílias de botões %d/3 — HOJE (quantos botões usam cada cara) × PADRÃO recomendado   [%s]'%(j+1,'escuro' if ESC else 'claro'),font=Fn(34,True),fill=FG)
  y=100
  for f in fs: S.paste(f,(0,y));y+=f.height
  S.save(O+'148-familias-%d-%s.jpg'%(j+1,'escuro' if ESC else 'claro'),quality=90);print('ok',j+1)
