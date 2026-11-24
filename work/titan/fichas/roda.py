# Roda as fichas do gabarito novo numa tela (app real, ou --base = gabarito final antigo) e diz o que falha.
import sys,os,json,re
ARGV=sys.argv[:]
sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from fichas import FICHAS
from playwright.sync_api import sync_playwright
ACHA=r"""(f)=>{
 const vw=innerWidth, vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;let s=getComputedStyle(e);if(s.visibility=='hidden'||+s.opacity==0)return false;for(let p=e;p;p=p.parentElement){const c=getComputedStyle(p);if(c.display=='none')return false}return true};
 const own=e=>[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim();
 const txt=e=>e.textContent.replace(/\s+/g,' ').trim();
 const all=[...document.querySelectorAll('body *')].filter(e=>!e.closest('nav,.tabbar,[class*=bnav]'));
 const linha=e=>{let p=e,best=e;for(let i=0;i<8&&p.parentElement;i++){p=p.parentElement;const r=p.getBoundingClientRect();if(r.height>110)break;best=p}return best};
 const tr=c=>!c||c=='transparent'||/rgba\(.*, 0\)$/.test(c);const pageBg=[document.body,document.documentElement].map(x=>getComputedStyle(x).backgroundColor).find(c=>!tr(c));
 const fundo=e=>{for(let p=e;p&&p!=document.body;p=p.parentElement){if(p.matches('.view,.wrap,main'))break;const bg=getComputedStyle(p).backgroundColor;if(!tr(bg)&&bg!=pageBg&&p.getBoundingClientRect().height>40)return p.className||p.tagName}return null};
 const out=[];
 for(const pc of f.pecas){
  const cand=all.filter(e=>vis(e)&&(!pc.topo||e.getBoundingClientRect().top<320)&&(pc.exato?own(e)==pc.t:own(e).includes(pc.t)||(own(e)==''&&txt(e).includes(pc.t)&&e.children.length<=2&&txt(e).length<pc.t.length+60)));
  if(!cand.length){out.push([pc.t,pc.precisa?'SEM DADOS no simulador ('+pc.precisa+') — não deu para conferir':'NÃO ACHOU (ou o texto da linha não é só "'+pc.t+'")']);continue}
  const e=cand[0],r=e.getBoundingClientRect(),L=linha(e),R=L.getBoundingClientRect(),err=[];
  if(pc.icone=='acima'){const ic=[...document.querySelectorAll('svg')].filter(s=>{const q=s.getBoundingClientRect();return vis(s)&&q.bottom<=r.top+2&&q.bottom>r.top-160&&q.left<r.right&&q.right>r.left});if(!ic.length)err.push('sem ícone acima')}
  else if(pc.icone){const ic=[...L.querySelectorAll('svg')].filter(s=>vis(s)&&s.getBoundingClientRect().right<=r.left+2);if(!ic.length)err.push('sem ícone à esquerda')}
  if(pc.valor){const re=new RegExp(pc.valor);const v=[...L.querySelectorAll('*')].filter(x=>vis(x)&&re.test(own(x)||(x.children.length==0?txt(x):'')));
    if(!v.length)err.push('valor '+pc.valor+' não está na linha');else{const vr=v[0].getBoundingClientRect();if(vr.left+vr.width/2<R.left+R.width/2)err.push('valor não está à direita')}}
  if(pc.sem_fundo){const fb=fundo(e);if(fb)err.push('dentro de cartão ('+String(fb).slice(0,30)+')')}
  if(err.length)out.push([pc.t,err.join(' · ')]);
 }
 for(const a of (f.ausente||[]))if(all.some(e=>vis(e)&&own(e)==a))out.push([a,'devia ter saído e está na tela']);
 return out}"""
ESTRAGA=r"""(pc)=>{const vw=innerWidth, vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;for(let p=e;p;p=p.parentElement){const c=getComputedStyle(p);if(c.display=='none'||c.visibility=='hidden')return false}return true};
 const own=e=>[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim();const txt=e=>e.textContent.replace(/\s+/g,' ').trim();
 const all=[...document.querySelectorAll('body *')].filter(e=>!e.closest('nav,.tabbar,[class*=bnav]'));
 const cand=all.filter(e=>vis(e)&&(!pc.topo||e.getBoundingClientRect().top<320)&&(pc.exato?own(e)==pc.t:own(e).includes(pc.t)||(own(e)==''&&txt(e).includes(pc.t)&&e.children.length<=2&&txt(e).length<pc.t.length+60)));
 if(!cand.length)return;const e=cand[0];
 let L=e,p=e;for(let i=0;i<8&&p.parentElement;i++){p=p.parentElement;if(p.getBoundingClientRect().height>110)break;L=p}
 if(pc.icone=='acima'){const r=e.getBoundingClientRect();document.querySelectorAll('svg').forEach(s=>{const q=s.getBoundingClientRect();if(q.bottom<=r.top+2&&q.bottom>r.top-160&&q.left<r.right&&q.right>r.left)s.remove()})}
 else if(pc.icone)L.querySelectorAll('svg').forEach(s=>s.remove());
 else if(pc.sem_fundo){let c=e;while(c.parentElement&&c.getBoundingClientRect().height<=60)c=c.parentElement;c.style.setProperty('background','#2a2a33','important')}
 else cand.forEach(x=>x.childNodes.forEach(n=>{if(n.nodeType==3)n.textContent='X'}));}"""
base='--base' in ARGV;so=[a for a in ARGV[1:] if not a.startswith('--')]
res={}
with sync_playwright() as pw:
 for f in FICHAS:
  if so and f['tela'] not in so[0].split(','):continue
  b,pg,w=ap.abre(pw,f['view'],True,'celular',base=base);w(900)
  for js in f['passos']:
   try:pg.evaluate(js)
   except Exception as e:pass
   w(1400)
  arg={'pecas':f['pecas'],'ausente':f.get('ausente',[])}
  out=pg.evaluate(ACHA,arg)
  if '--prova' in ARGV:
   # PROVA DO TITAN: estraga de propósito cada peça que passou; a ficha TEM de apontar essa peça
   ruins=[]
   for pc in f['pecas']:
    if any(x[0]==pc['t'] for x in out):continue
    pg.evaluate(ESTRAGA,pc)
    if not any(x[0]==pc['t'] for x in pg.evaluate(ACHA,arg)):ruins.append(pc['t'])
   print('  prova: '+('todas as peças estragadas foram vistas' if not ruins else 'NÃO VIU: '+', '.join(ruins)))
  b.close()
  res[f['tela']]=out
  print(('OK  ' if not out else 'FALHA ')+f['tela']+' ('+f['n']+')');[print('   -',p,':',m) for p,m in out]
json.dump(res,open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'resultado_%s.json'%('base' if base else 'app')),'w'),ensure_ascii=False,indent=1)
