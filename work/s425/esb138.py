# S425 · esboços 138 (padrão único das escolhas = .trk do Pagamento; pílulas secundárias finas) (botões fora do padrão + pendentes) (varredura dos padrões de luxo): antes × depois, sobre a base aprovada (132, 133a/b, 134).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C);comum.OUT='/home/claude/lafouch/work/s425/';T='/tmp/s425/';os.makedirs(T,exist_ok=True)
A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
MAIS='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
# cabeçalho: ação no centro da linha do título (regra 2)
CAB="""()=>{const v=[...document.querySelectorAll('.view')].find(x=>x.getBoundingClientRect().height);if(!v)return;v.querySelectorAll('h1').forEach(h=>{const row=h.closest('.top,.grpTop,[class*=Top]')||h.parentElement.parentElement;if(!row)return;const b=[...row.querySelectorAll(':scope button,:scope>div>button')].filter(x=>x.getBoundingClientRect().height&&x.getBoundingClientRect().left>innerWidth/2).pop();if(!b)return;b.style.marginTop='0';b.style.transform='none';const r=document.createRange();r.selectNodeContents(h);const q=[...r.getClientRects()][0];const bq=b.getBoundingClientRect();b.style.transform='translateY('+(((q.top+q.bottom)/2)-((bq.top+bq.bottom)/2)).toFixed(1)+'px)'})}"""
def plus(sel,label):
  return """()=>{document.querySelectorAll('%s').forEach(b=>{b.className='pl78';b.style.cssText='margin:0';b.setAttribute('aria-label','%s');b.innerHTML='%s'})}"""%(sel,label,MAIS)
SEG="""()=>{document.querySelectorAll('.sg418').forEach(s=>{s.classList.add('catbar3');s.style.cssText+=';display:flex;gap:0';[...s.children].forEach(b=>{b.classList.add('cb3');b.style.cssText+=';flex:1;border-radius:999px'})})}"""
LIN="""input.in,select.in,.view input:not([type=checkbox]):not([type=radio]),.ljJn input:not([type=checkbox]):not([type=radio]){background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}"""
SEMCX="""background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important"""
CHEV='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00'};return 1}"
SEGJ="""(sel)=>{document.querySelectorAll(sel).forEach(s=>{if(s.dataset.b137)return;s.dataset.b137=1;s.classList.add('catbar3');s.style.cssText+=';display:flex;gap:0;background:'+getComputedStyle(document.querySelector('.catbar3')||s).backgroundColor;[...s.children].forEach(b=>{b.classList.add('cb3');if(b.getAttribute('aria-pressed')==='true'||b.classList.contains('on'))b.classList.add('on');b.style.cssText+=';flex:1;border-radius:999px;min-height:40px'})})}"""
TRK="""(a)=>{const [sel,h,w]=a;document.querySelectorAll(sel).forEach(s=>{if(s.dataset.t138)return;s.dataset.t138=1;const bs=[...s.children].filter(b=>b.tagName=='BUTTON');let on=bs.findIndex(b=>b.classList.contains('on')||b.getAttribute('aria-pressed')==='true');if(on<0)on=0;s.classList.add('trk');const P=(e,k,v)=>e.style.setProperty(k,v,'important');[['display','flex'],['gap','0'],['padding','3px'],['background','var(--panel2)'],['border','1px solid var(--line)'],['border-radius','14px'],['position','relative'],['box-shadow','none']].forEach(q=>P(s,q[0],q[1]));if(w){P(s,'flex','none');P(s,'width',w)}bs.forEach((b,i)=>{b.classList.add('trkB');b.classList.toggle('on',i==on);[['flex','1'],['background','transparent'],['border','0'],['box-shadow','none'],['border-radius','11px'],['min-height',h],['height',h],['margin','0'],['font-weight','400'],['font-size','15px'],['color',i==on?'var(--fg)':'var(--mute)'],['position','relative'],['z-index','1'],['display','flex'],['align-items','center'],['justify-content','center'],['text-align','center'],['padding','0 4px']].forEach(q=>P(b,q[0],q[1]))});const th=document.createElement('span');th.className='trkTh';s.prepend(th);const r=bs[on];P(th,'left',r.offsetLeft+'px');P(th,'width',r.offsetWidth+'px');P(th,'transform','none')})}"""
def trk(sel,h='42px',w=''): return "()=>(%s)(%r)"%(TRK,[sel,h,w])
SEC="background:transparent!important;background-image:none!important;border:1px solid var(--sec-bd)!important;border-radius:14px!important;box-shadow:none!important;color:var(--fg)!important;font-weight:600!important;min-height:44px!important;padding:0 16px!important"
L_JS="""()=>{const l=[...document.querySelectorAll('#v-dash .cxLb,#v-dash .lbl')].find(x=>/^ESTA SEMANA$|^Esta semana$/i.test(x.textContent.trim()));if(!l||document.querySelector('[data-b137m]'))return;const m=(__LF.S.dMoeda||'pyg');const lc=getComputedStyle(l),lh=l.getBoundingClientRect().height;const w=document.createElement('div');w.setAttribute('data-b137m','1');w.style.cssText='display:flex;align-items:center;justify-content:space-between;overflow:visible;height:'+lh+'px;margin:'+lc.marginTop+' 0 '+lc.marginBottom;l.parentElement.insertBefore(w,l);w.appendChild(l);l.style.margin='0';w.insertAdjacentHTML('beforeend','<div class="d138"><button class="'+(m=='pyg'?'on':'')+'">G$</button><button class="'+(m=='brl'?'on':'')+'">R$</button><button class="'+(m=='usd'?'on':'')+'">US$</button></div>');(@TRK@)(['.d138','30px','150px']);const sg=w.lastElementChild;const W=document.querySelector('.wrap');const cs=getComputedStyle(W);const R=W.getBoundingClientRect().right-parseFloat(cs.paddingRight);sg.style.marginRight=(sg.getBoundingClientRect().right-R).toFixed(1)+'px';document.head.insertAdjacentHTML('beforeend','<style>.d138 .trkB::after{content:"";position:absolute;inset:-7px 0}</style>')}""".replace('@TRK@',TRK)
CASOS=[
 ('c','reservas','Reservas › Próximos 30 dias e Livre para você',D['reservas-30dias']+["()=>{const e=document.querySelector('[data-act=fluxod]');e&&e.scrollIntoView({block:'center'})}"],
  '',[trk('#v-dash .tabs:has([data-act=fluxod])'),trk('.lv418M','32px','auto')],
  'Hoje: 30/60/90 dias em três quadrados soltos; G$/R$/US$ do "Livre para você" em pílula rosa.',
  'Depois: as duas no mesmo controle do Pagamento e do Marketing (fundo cinza, a marca cinza desliza).'),
 ('d','novo-acesso','Atacado › Novo acesso',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataNovo()"],
  '.ljJn input.in,.ljJn select.in,.ljJn textarea.in{background:none!important}.ljJn select.in{-webkit-appearance:none!important;appearance:none!important;background-image:url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2718%27 height=%2718%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238b9bb0%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E\")!important;background-repeat:no-repeat!important;background-position:right 0 center!important;padding-right:24px!important}.ljJn input.in,.ljJn select.in,.ljJn textarea.in{background-color:transparent!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}',
  ["""()=>{const t=document.querySelector('.ata418T');if(!t||t.dataset.b138)return;t.dataset.b138=1;const bs=[...t.querySelectorAll('button')];const on=Math.max(0,bs.findIndex(b=>b.classList.contains('on')||b.getAttribute('aria-pressed')==='true'));const sub=bs.map(b=>(b.querySelector('small,span:last-child')||{}).textContent||'');t.className='ata418T';t.style.cssText='';bs.forEach((b,i)=>{const nm=(b.querySelector('b')||b).textContent.trim();b.className=i==on?'on':'';b.style.cssText='';b.textContent=nm});t.insertAdjacentHTML('afterend','<div class="hint" style="margin:6px 0 0">'+sub[on]+'</div>')}""",trk('.ata418T'),"""()=>{const s=document.querySelector('.ljJn select');const o=[...document.querySelectorAll('.ljJn input')].find(i=>/O que v/.test(i.placeholder));if(s&&o&&o.nextElementSibling!==s)o.insertAdjacentElement('afterend',s)}"""],
  'Hoje: "Lojista fixo" e "Visitante" em dois cartões; campos em caixas.',
  'Depois: "Lojista fixo | Visitante" na escolha (padrão C), com "não vence"/"vence em 3 dias" embaixo; campos em linha fina; a tabela (Óptica) desce para baixo de "O que vê", na mesma margem.'),
 ('e','precos-corrigir','Preços › preços para corrigir',D['precos-corrigir']+["()=>{const e=document.querySelector('.pcUsa');e&&e.scrollIntoView({block:'center'})}"],
  '.pcUsa,.pcLi button{'+SEC+'}',[],
  'Hoje: "Usar G$ …" e "Informar" em caixas cheias.',
  'Depois: botão secundário de sempre — contorno fino de 1 px, sem fundo.'),
 ('f','marketing-lembrete','Marketing › Post › "Me lembra às 20h"',D['marketing-post']+["()=>{const e=document.getElementById('mkLemb');e&&e.scrollIntoView({block:'center'})}"],
  '#mkLemb{'+SEC+';width:100%!important}',[],
  'Hoje: "Me lembra às 20h" numa barra cheia.',
  'Depois: botão secundário de sempre (contorno fino, largura toda, como está hoje).'),
 ('l','dashboard-moeda','Dashboard › moeda dos valores',D['dash-semana'],
  '',[L_JS],
  'Hoje: tocar num valor troca a moeda (G$ → R$ → US$), mas nada na tela mostra isso.',
  'Depois: G$ | R$ | US$ pequeno ao lado de "ESTA SEMANA", no mesmo controle do Pagamento (discreto).'),
 ('m','retirada','Caixa › Retirada do dono (aprovado 135e)',D['caixa-retirar'],
  '',[trk('.sg418')],
  'Hoje (aprovado 135e): moedas na pílula escura com borda rosa.',
  'Depois: mesmo controle do Pagamento. Vale também para 135f (Registrar troca).'),
 ('o','cliente-nac','Clientes › Novo cliente (Paraguaio/Estrangeiro)',D['clientes-novo'],
  '',[trk('.catbar3')],
  'Hoje: Paraguaio/Estrangeiro na pílula escura com borda rosa.',
  'Depois: mesmo controle do Pagamento (vale para todos os catbar3: cliente, impressora…).'),
]
with sync_playwright() as pw:
  for k,nome,tit,ps,css,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'cdeflmo')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[];aa=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(300)
        for x in ps:
          try: pg.evaluate(x)
          except Exception as e: pass
          w(1000)
        if prop:
          if css: pg.add_style_tag(content=css)
          w(200)
          for x in js:
            try: pg.evaluate(x)
            except Exception as e: print('ERR js',k,str(e)[:100])
            w(250)
          w(400)
        oo.append(olho(pg));al=pg.evaluate(A2);aa.append(len(al));(prop and al and print('   alin',k,[(x['r'],x['ex']) for x in al]));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'olho novos:',novos(oo[0],oo[1]),'alin hoje/depois:',aa,flush=True)
      prancha('138%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
