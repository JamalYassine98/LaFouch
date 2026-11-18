# S425 · esboços 136 (ajustes do estudo de função + Nova despesa) (varredura dos padrões de luxo): antes × depois, sobre a base aprovada (132, 133a/b, 134).
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
CASOS=[
 ('a','ficha-dobras','Inventário · ficha (Lucro real e De onde vem o preço)',D['inventario-ficha']+["()=>scrollTo(0,99999)"],
  '#v-estoque details.lrcard>summary,#v-estoque details.cntP>summary{list-style:none!important;display:flex!important;align-items:center!important;gap:10px}#v-estoque details.lrcard>summary::-webkit-details-marker,#v-estoque details.cntP>summary::-webkit-details-marker{display:none}#v-estoque details>summary>.b136{margin-left:2px;margin-right:-4.5px;display:flex;color:var(--sub);transition:transform .2s}#v-estoque details[open]>summary>.b136{transform:rotate(180deg)}',
  ["""()=>{document.querySelectorAll('#v-estoque details.lrcard>summary,#v-estoque details.cntP>summary').forEach(s=>{if(s.querySelector('.b136'))return;if(s.parentElement.classList.contains('cntP')){const b=s.querySelector('b');const t=s.firstChild;if(t&&t.nodeType==3)t.textContent=t.textContent.replace(/\\s*·\\s*$/,'');if(b){b.style.marginLeft='auto';}}s.insertAdjacentHTML('beforeend','<span class="b136">CHEV</span>');const v=s.querySelector('b:last-of-type');if(v&&s.parentElement.classList.contains('lrcard'))v.style.marginLeft='auto'})}""".replace('CHEV',CHEV)],
  'Hoje: "Lucro real" e "De onde vem o preço" abrem no lugar, mas mostram um triângulo ▶ (ou nada).',
  'Depois: pela regra dos links (abre no lugar = "⌄"), as duas linhas ganham o "⌄" na margem da direita, que gira ao abrir; o valor fica antes dele, alinhado à direita.'),
 ('b','fornecedores-lixeira','Inventário › Fornecedores › lixeira',D['inventario-fornecedores']+["()=>document.querySelector('#lotView .trash').click()"],
  '',
  ["""()=>{const s=document.querySelector('#lotView>section.card');if(s){[...s.querySelectorAll('button')].forEach(b=>{if(/^(Sim, remover|Cancelar)/.test(b.textContent.trim()))b.closest('div').style.display='none'});[...s.children].forEach(c=>{if(/^Remover o lote/.test((c.innerText||'').trim()))c.style.display='none'})}if(window.__lfConfirma)__lfConfirma({k:'s136',t:'Remover o lote?',q:'Kazwini · Pré-graduados (leitura)',d:'400 peças · US$ 200,00',f:'As 57 peças já detalhadas continuam no estoque, só ficam sem lote.',b:'Remover',fn:function(){}})}"""],
  'Hoje: tocar na lixeira abre a pergunta DENTRO da compra ("Remover o lote…?" com "Sim, remover" e "Cancelar").',
  'Depois: a mesma janela de confirmação única do resto do app (aprovada no 111/S418): o que vai ser removido, a frase do que acontece e o botão vermelho "Remover"; fecha arrastando ou tocando fora (= cancelar).'),
 ('c','em-estoque','Inventário › "Em estoque (filtro)"',["()=>__LF.setView('estoque')"],
  '',
  ["""()=>{const l=document.querySelector('#kCont .lbl');if(l&&/›/.test(l.textContent))l.innerHTML=l.textContent.replace(/\\s*›\\s*$/,'')+' <span style="display:inline-block;transform:rotate(90deg)">›</span>'}"""],
  'Hoje: "EM ESTOQUE (FILTRO) ›" — tocar abre a contagem do estoque AQUI MESMO, mas o "›" diz que vai para outra tela.',
  'Depois: "EM ESTOQUE (FILTRO) ⌄" — o símbolo de abrir no lugar (regra dos links). Nada mais muda.'),
 ('d','nova-despesa','Despesas › Nova despesa',D['despesas-nova'],
  '#v-desp section.fxF[data-fx=nova]{position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:901!important;max-width:640px;margin:0 auto!important;max-height:90vh;overflow:auto;background:var(--panel)!important;border:0!important;border-radius:22px 22px 0 0!important;padding:8px 16px 16px!important;box-shadow:0 -10px 40px rgba(0,0,0,.3)!important}#v-desp section.fxF[data-fx=nova]::before{content:"";display:block;width:44px;height:5px;border-radius:3px;background:var(--line);margin:0 auto 10px}#v-desp section.fxF[data-fx=nova] .fxH svg,#v-desp section.fxF[data-fx=nova] .fxH>i{display:none!important}body:has(#v-desp section.fxF[data-fx=nova].on)::after{content:"";position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:900}#v-desp section.fxF[data-fx=nova] *:not(input):not(select):not(button):not(svg):not(path){padding-left:0!important;padding-right:0!important;margin-left:0!important;margin-right:0!important}#v-desp section.fxF[data-fx=nova] .fxH{padding-left:0!important;padding-right:0!important}#v-desp section.fxF[data-fx=nova] input,#v-desp section.fxF[data-fx=nova] select{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}html:has(#v-desp section.fxF[data-fx=nova].on),body:has(#v-desp section.fxF[data-fx=nova].on){overflow:hidden!important}',
  ["()=>{const e=document.querySelector('#v-desp section.fxF[data-fx=nova]');if(e){e.setAttribute('aria-modal','true');e.setAttribute('role','dialog');const b=[...e.querySelectorAll('button')].find(x=>/^Adicionar$/.test(x.textContent.trim()));if(b){b.textContent='Salvar';[['display','block'],['width','100%'],['min-height','52px'],['border-radius','14px'],['border','1.5px solid var(--accent)'],['background','none'],['color','var(--accent-fg)'],['font-weight','700'],['font-size','16px'],['margin','16px 0 0']].forEach(q=>b.style.setProperty(q[0],q[1],'important'))}}}"],
  'Hoje: "+" abre o formulário Nova despesa DENTRO da página, no meio da lista.',
  'Depois: pela regra dos formulários, abre na janela de baixo, com a tela atrás escurecida; campos em linha fina (P3); um único principal "Salvar" (no lugar da pílula "Adicionar"); fecha arrastando ou tocando fora ("Sair sem salvar?" se já digitou algo).'),
]
with sync_playwright() as pw:
  for k,nome,tit,ps,css,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abcd')]:
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
      prancha('136%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
