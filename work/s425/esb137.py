# S425 · esboços 137 (botões fora do padrão + pendentes) (varredura dos padrões de luxo): antes × depois, sobre a base aprovada (132, 133a/b, 134).
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
CASOS=[
 ('a','icones-redondos','Botões de ícone (sino e Ações do caixa)',D['caixa-movimentos'],
  '#sino,#cxIc{border-radius:50%!important}',[],
  'Hoje: o "+" é redondo, mas o sino e o botão "Ações do caixa" são quadrados de canto arredondado.',
  'Depois: todos os botões de ícone redondos, do mesmo tamanho e traço (um só conjunto, regra T).'),
 ('b','ficha-icones','Inventário › ficha (Voltar, Editar e Ficha 4/6)',D['inventario-ficha'],
  '#v-estoque .tab.ibtn{border-radius:50%!important}#v-estoque .fiBtn{position:relative}#v-estoque .fiBtn::after{content:"";position:absolute;inset:-9px -4px}',[],
  'Hoje: Voltar e Editar em quadrados; a pílula "Ficha 4/6" tem 26 px e o toque fica apertado.',
  'Depois: Voltar e Editar redondos como o "+"; "Ficha 4/6" com o mesmo desenho, mas a área de toque cresce por fora (invisível) até 44 px.'),
 ('c','reservas-dias','Reservas › Próximos 30 dias',D['reservas-30dias']+["()=>{const e=document.querySelector('[data-act=fluxod]');e&&e.scrollIntoView({block:'center'})}"],
  '',["()=>(%s)('#v-dash .tabs:has([data-act=fluxod])')"%SEGJ],
  'Hoje: 30 / 60 / 90 dias em três quadrados soltos.',
  'Depois: a escolha de dois lados (P4), igual a Paraguaio/Estrangeiro e ao G$/R$/US$ do Livre para você.'),
 ('d','novo-acesso','Atacado › Novo acesso',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataNovo()"],
  '.ljJn input.in,.ljJn select.in,.ljJn textarea.in{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}',
  ["""()=>{const t=document.querySelector('.ata418T');if(!t||t.dataset.b137)return;t.dataset.b137=1;const bs=[...t.querySelectorAll('button')];const on=bs.findIndex(b=>b.classList.contains('on')||b.getAttribute('aria-pressed')==='true');const sub=bs.map(b=>(b.querySelector('small,span:last-child')||{}).textContent||'');t.className='catbar3';t.style.cssText='display:flex;gap:0';bs.forEach((b,i)=>{const nm=(b.querySelector('b')||b).textContent.trim();b.className='cb3'+(i==Math.max(on,0)?' on':'');b.style.cssText='flex:1;border-radius:999px;min-height:40px';b.textContent=nm});t.insertAdjacentHTML('afterend','<div class="hint" style="margin:6px 0 0">'+sub[Math.max(on,0)]+'</div>')}"""],
  'Hoje: "Lojista fixo" e "Visitante" em dois cartões; Buscar cliente, tabela e "O que vê" em caixas.',
  'Depois: "Lojista fixo | Visitante" na escolha de dois lados, com "não vence" / "vence em 3 dias" embaixo (P4); campos em linha fina (P3).'),
 ('e','precos-corrigir','Preços › preços para corrigir',D['precos-corrigir']+["()=>{const e=document.querySelector('.pcUsa');e&&e.scrollIntoView({block:'center'})}"],
  '.pcUsa,.pcLi button{border:4px solid transparent!important;box-shadow:inset 0 0 0 1px var(--line)!important;background-clip:padding-box!important;min-height:44px!important;background:none!important;border-radius:999px!important;color:var(--fg)!important;font-weight:600!important;padding:0 16px!important}',[],
  'Hoje: "Usar G$ …" e "Informar" em caixas.',
  'Depois: pílula neutra, a mesma dos outros botões secundários (como "% Oferta").'),
 ('f','marketing-lembrete','Marketing › Post › "Me lembra às 20h"',D['marketing-post']+["()=>{const e=document.getElementById('mkLemb');e&&e.scrollIntoView({block:'center'})}"],
  '#mkLemb{border:4px solid transparent!important;box-shadow:inset 0 0 0 1px var(--line)!important;background-clip:padding-box!important;min-height:44px!important;background:none!important;border-radius:999px!important;color:var(--fg)!important;font-weight:600!important;padding:0 16px!important;width:auto!important;display:block!important;margin:8px auto 0!important}',[],
  'Hoje: "Me lembra às 20h" numa barra em caixa da largura toda.',
  'Depois: pílula neutra (botão secundário), centralizada.'),
 ('g','vitrine','Giro › Vitrine da semana',D['giro-vitrine'],
  '#v-dash .g99 input{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}button[data-act=vitLug]{display:block!important;width:100%!important;min-height:52px!important;border-radius:14px!important;border:1.5px solid var(--accent)!important;background:none!important;color:var(--accent-fg)!important;font-weight:700!important;margin-top:12px!important;padding:0!important}div:has(>button[data-act=vitLug]){display:block!important}',[],
  'Hoje: campo em caixa e "Salvar" num quadrado pequeno ao lado.',
  'Depois: campo em linha fina (P3) e "Salvar" como o principal de sempre (contorno rosa, largura toda).'),
 ('h','conferir-caixa','Caixa › Conferir o caixa',D['caixa-conferir'],
  'button[data-act=ccfechar]{display:none!important}.ljJn input.in,.ljJn input{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}',["""()=>{document.querySelectorAll('input:not([type=checkbox]):not([type=radio]),select').forEach(i=>{let c=i.parentElement;while(c&&c!==document.body&&getComputedStyle(c).position!=='fixed')c=c.parentElement;if(!c||c===document.body)return;[['background','none'],['border','0'],['border-bottom','1px solid var(--line2)'],['border-radius','0'],['box-shadow','none'],['padding-left','0']].forEach(q=>i.style.setProperty(q[0],q[1],'important'))})}"""],
  'Hoje: valores em caixas e "Fechar" escrito embaixo.',
  'Depois: valores em linha fina (P3); sem "Fechar" — fecha arrastando ou tocando fora (regra dos formulários).'),
 ('i','novo-objetivo','Caixa › Novo objetivo',D['caixa-novo-objetivo'],
  '.ljJn input,.ljJn select{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}',["""()=>{document.querySelectorAll('input:not([type=checkbox]):not([type=radio]),select').forEach(i=>{let c=i.parentElement;while(c&&c!==document.body&&getComputedStyle(c).position!=='fixed')c=c.parentElement;if(!c||c===document.body)return;[['background','none'],['border','0'],['border-bottom','1px solid var(--line2)'],['border-radius','0'],['box-shadow','none'],['padding-left','0']].forEach(q=>i.style.setProperty(q[0],q[1],'important'))})}""","""()=>{document.querySelectorAll('button').forEach(b=>{if(/^Guardar objetivo$/.test(b.textContent.trim()))b.textContent='Salvar'})}"""],
  'Hoje: "Guardar objetivo"; campos em caixas.',
  'Depois: "Salvar", o mesmo verbo dos outros formulários (W); campos em linha fina (P3).'),
 ('j','criar-lote','Atacado › Lotes (vazio)',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('lot')"],
  '#ataCorpo .ataMais{display:block!important;margin:16px auto 0!important;color:var(--accent-fg)!important;font-weight:600!important;text-align:center}',[],
  'Hoje: "+ Criar lote" em texto branco, encostado à esquerda.',
  'Depois: "+ Criar lote" em texto rosa, centralizado (link sozinho) — os "+" dentro do conteúdo ficam em texto rosa; o "+" redondo é só ao lado do título.'),
 ('k','carrinho','Catálogo › Carrinho e Pagamento',D['catalogo-pagamento']+["()=>{const e=document.querySelector('.esTx');e&&e.scrollIntoView({block:'center'})}"],
  '.esTx{color:var(--accent-fg)!important;font-weight:600!important;display:block;margin:8px auto 0!important}',[],
  'Hoje: "+ Receber parte em outra moeda" em texto comum.',
  'Depois: em texto rosa, como os outros "+" dentro do conteúdo ("+ Adicionar outra peça" já é assim).'),
 ('l','dashboard-moeda','Dashboard › moeda dos valores',D['dash-semana'],
  '',["""()=>{const l=[...document.querySelectorAll('#v-dash .cxLb,#v-dash .lbl')].find(x=>/^ESTA SEMANA$|^Esta semana$/i.test(x.textContent.trim()));if(!l||document.querySelector('[data-b137m]'))return;const m=(__LF.S.dMoeda||'pyg');const w=document.createElement('div');w.setAttribute('data-b137m','1');w.style.cssText='display:flex;align-items:center;justify-content:space-between';l.parentElement.insertBefore(w,l);w.appendChild(l);l.style.margin='0';w.insertAdjacentHTML('beforeend','<div class="catbar3" style="display:flex;gap:0;width:150px"><button class="cb3'+(m=='pyg'?' on':'')+'" style="flex:1;border-radius:999px;min-height:34px">G$</button><button class="cb3'+(m=='brl'?' on':'')+'" style="flex:1;border-radius:999px;min-height:34px">R$</button><button class="cb3'+(m=='usd'?' on':'')+'" style="flex:1;border-radius:999px;min-height:34px">US$</button></div>');const sg=w.lastElementChild;const W=document.querySelector('.wrap');const cs=getComputedStyle(W);const R=W.getBoundingClientRect().right-parseFloat(cs.paddingRight);sg.style.marginRight=(sg.getBoundingClientRect().right-R).toFixed(1)+'px';const lq=l.getBoundingClientRect(),sq=sg.getBoundingClientRect();sg.style.transform='translateY('+(((lq.top+lq.bottom)/2)-((sq.top+sq.bottom)/2)).toFixed(1)+'px)'}"""],
  'Hoje: tocar num valor troca a moeda (G$ → R$ → US$), mas nada na tela mostra isso.',
  'Depois: a escolha G$ | R$ | US$ à vista ao lado de "ESTA SEMANA", igual ao "Livre para você" das Reservas (P4 + W: o botão diz o que faz).'),
]
with sync_playwright() as pw:
  for k,nome,tit,ps,css,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abcdefghijkl')]:
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
      prancha('137%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
