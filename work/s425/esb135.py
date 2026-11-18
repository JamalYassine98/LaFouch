# S425 · esboços rápidos 135 (varredura dos padrões de luxo): antes × depois, sobre a base aprovada (132, 133a/b, 134).
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
CASOS=[
 ('a','despesas','Despesas',D['despesas-conta'],
  '.view section.col>.g99{'+SEMCX+';border-top:1px solid var(--line2)!important;border-bottom:1px solid var(--line2)!important}',
  [plus('button.nv73','Nova despesa'),CAB],
  'Hoje: "+ Nova" em pílula e mais baixa que o título; "Aluguel da loja" num cartão.',
  'Depois: "+" redondo (igual a Inventário e Clientes) no centro da linha do título (P1 + regra 2); as contas da loja em linhas finas, sem cartão.'),
 ('b','caixa-objetivos','Caixa › Objetivos da loja',D['caixa-movimentos']+["()=>scrollTo(0,420)"],
  '.view section.obCard{'+SEMCX+';border-top:1px solid var(--line2)!important;padding-top:14px!important}.obCard .paMt h2{font-size:11px!important;letter-spacing:.14em!important;text-transform:uppercase;color:var(--mute)!important;font-weight:600!important;font-family:inherit!important;white-space:nowrap;margin-right:auto!important}.obCard>.hint{margin:2px 0 0!important}html body section.card:has(.note.n-bad),html body .phgrid:has(.note.n-bad),html body .phgrid .col:has(.note.n-bad){'+SEMCX+'}html body div.note.n-bad{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:16px 0 0!important;color:var(--bad)!important;text-align:left}html body div.note.n-bad .esLn{display:block!important;margin:6px auto 0!important;text-align:center}.view section.card.col:has(>h2):not(.obCard){'+SEMCX+';border-top:1px solid var(--line2)!important;padding-top:16px!important;margin-top:16px!important}.view section.card.col:has(>h2):not(.obCard)>h2{font-size:11px!important;letter-spacing:.14em!important;text-transform:uppercase;color:var(--mute)!important;font-weight:600!important;font-family:inherit!important;margin-bottom:4px!important}.view section.card.col:has(>h2):not(.obCard) .sl{border-bottom:1px solid var(--line2);padding:10px 0!important;margin:0!important;min-height:44px;align-items:center}',
  ["""()=>{const c=document.querySelector('.obCard');if(!c)return;const b=[...c.querySelectorAll('button')].find(x=>/Novo objetivo/.test(x.textContent));const h=c.querySelector('.paMt');if(b&&h){b.className='pl78';b.style.cssText='margin:0 0 0 12px;width:40px;height:40px';b.setAttribute('aria-label','Novo objetivo');b.innerHTML='%s';h.style.cssText+=';display:flex;align-items:center;gap:8px';const g=h.querySelector('.hint');if(g)h.after(g);h.appendChild(b)};document.querySelectorAll('.view>.note.n-bad').forEach(n=>{[['background','none'],['border','0'],['border-radius','0'],['box-shadow','none'],['padding','16px 0 0'],['margin','0']].forEach(q=>n.style.setProperty(q[0],q[1],'important'))})}"""%MAIS,CAB],
  'Hoje: "Objetivos da loja" e "Movimentos" em cartões; o aviso do caixa numa caixa vermelha; a pílula "+ Novo objetivo" grande.',
  'Depois: tudo sem cartão; títulos em versalete; "+" redondo ao lado de Objetivos (P1); o aviso vira frase vermelha com o link centralizado embaixo; Movimentos em linhas finas.'),
 ('c','atacado','Atacado › Lojistas',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('loj')"],
  '#ataTabs{margin-bottom:0!important}#ataCorpo{padding-top:32px!important;margin-top:0!important}#ataCorpo .ataVz{text-align:center!important;font-weight:700;color:var(--fg)!important;padding:0!important;margin:8px 0 0!important}#ataCorpo .ataNt{text-align:center!important;margin:6px 24px 0!important;color:var(--sub)!important}',
  [plus("button[data-act=ataNovo]","Novo acesso"),CAB,"""()=>{const c=document.getElementById('ataCorpo');if(!c||c.querySelector('[data-ic]'))return;c.insertAdjacentHTML('afterbegin','<div data-ic style="display:flex;justify-content:center;color:var(--accent-fg)"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></div>');const v=c.querySelector('.ataVz');if(v)v.textContent='Nenhum lojista ainda'}"""],
  'Hoje: pílula "+ Novo acesso" fora do centro do título; 63 px das abas até o conteúdo; tela vazia com uma frase no centro e outra à esquerda.',
  'Depois: "+" redondo no centro do título (P1); 32 px das abas ao conteúdo (aprovado); tela vazia igual a Clientes: ícone, frase e explicação, tudo no centro (P5).'),
 ('d','giro','Giro › dobras',D['giro-parado'],
  '.g99{'+SEMCX+'}.g99 section.card.fxF{'+SEMCX+';border-bottom:1px solid var(--line2)!important}.g99 section.card.fxF:first-of-type{border-top:1px solid var(--line2)!important}.g99 .fxH{padding:12px 0!important}',
  [],
  'Hoje: Lista de compras, Vitrine, Retorno e Curva ABC dentro de um cartão (linhas 17 px para dentro da margem).',
  'Depois: as 4 em linhas finas na margem da tela, sem cartão (abrem no ⌄ como hoje).'),
 ('e','retirada','Caixa › Retirada do dono',D['caixa-retirar'],LIN,[SEG],
  'Hoje: moeda em 3 pílulas soltas; Valor e "Para quê" em caixas.',
  'Depois: moeda na escolha de dois lados (igual a Paraguaio/Estrangeiro, P4); campos em linha fina (P3).'),
 ('f','troca','Câmbio › Registrar troca',D['cambio-troca'],LIN,[SEG],
  'Hoje: De e Para em 3 pílulas soltas cada; valores em caixas.',
  'Depois: De e Para na escolha de dois lados (P4); valores em linha fina (P3).'),
 ('g','pendencias','Pendências',D['pendencias'],
  '#v-pend section.card,.view section.card[style*=border-left]{'+SEMCX+';border-left:0!important;border-bottom:1px solid var(--line2)!important;padding-top:12px!important;padding-bottom:12px!important}',
  ["""()=>{document.querySelectorAll('.view section.card[style*=border-left] button').forEach(b=>{b.style.cssText+=';background:none!important;border:0!important;color:var(--accent-fg)!important;padding:0 0 0 12px!important;min-height:44px;min-width:56px;font-weight:600;text-align:right';if(!/›/.test(b.textContent))b.textContent=b.textContent.trim()+' ›'})}"""],
  'Hoje: cada pendência num cartão com faixa colorida e um botão em pílula ("Ver conta", "Conferir").',
  'Depois: linhas finas; a ação vira texto rosa com › na margem da direita; a cor de alerta fica só no texto do prazo.'),
 ('h','precos','Preços',D['precos'],
  '.view .cntL b,.view [class*=kp] b,.view .kpi b,.view b[style*=Fraunces]{font-family:inherit!important}#v-prec .k2 b,#v-prec .k2v{font-family:inherit!important}',
  ["""()=>{document.querySelectorAll('.view b').forEach(b=>{b.textContent=b.textContent.replace(/\\b1 dias\\b/,'1 dia')});document.querySelectorAll('.view *').forEach(e=>{const f=getComputedStyle(e).fontFamily;if(/Fraunces|Georgia/.test(f)&&!e.matches('h1,h1 *,.ttl,.ttl *')&&e.getBoundingClientRect().top>200)e.style.setProperty('font-family','Roboto, system-ui, sans-serif','important')})}"""],
  'Hoje: números do resumo na letra de título (serifada); "Black Friday em 1 dias".',
  'Depois: números na letra do texto, como no Dashboard (T); "Black Friday em 1 dia" (W).'),
]
with sync_playwright() as pw:
  for k,nome,tit,ps,css,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abcdefgh')]:
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
        oo.append(olho(pg));aa.append(len(pg.evaluate(A2)));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'olho novos:',novos(oo[0],oo[1]),'alin hoje/depois:',aa,flush=True)
      prancha('135%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
