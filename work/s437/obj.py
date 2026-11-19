exec(open('/home/claude/lafouch/work/s437/esb.py').read())
import json
c=json.load(open('/tmp/c142.json'))['b']
B="()=>{const s=document.createElement('style');s.textContent=%s;document.head.appendChild(s)}"%json.dumps(c[0])
HD="(()=>{const h=[...document.querySelectorAll('#v-caixa h2, #v-caixa .cxLb, #v-caixa .lbl')].find(x=>/objetivos da loja/i.test(x.textContent)&&x.getBoundingClientRect().height);return h})()"
JA="()=>{const h="+HD+";if(!h)return;const P=(k,v)=>h.style.setProperty(k,v,'important');P('font-size','17px');P('letter-spacing','0');P('text-transform','none');P('font-weight','600');P('color','var(--fg)');h.textContent='Objetivos da loja'}"
JB="()=>{const h="+HD+";if(!h)return;const sec=h.parentElement;const b=[...sec.querySelectorAll('button')].find(x=>x.textContent.trim()=='+'||x.getAttribute('aria-label')&&/objetivo/i.test(x.getAttribute('aria-label')));if(!b)return;const P=(k,v)=>b.style.setProperty(k,v,'important');P('width','32px');P('height','32px');P('min-width','32px');P('min-height','32px');P('font-size','18px');P('position','relative');const s=document.createElement('style');s.textContent='.objT44::after{content:\"\";position:absolute;inset:-6px}';document.head.appendChild(s);b.classList.add('objT44')}"
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';fs=[]
    for k,js in (('hoje',[]),('b',[B]),('A',[B,JA]),('B',[B,JB])):
      b,pg,w=abre(pw,esc,C['caixa-acoes'][:1])
      for j in js: pg.evaluate(j);w(200)
      pg.evaluate('()=>{const h='+HD+';if(h)h.setAttribute("data-obj","1")}')
      fs.append(foto(pg,'[data-obj]','obj_%s_%s'%(k,n)));b.close()
    # recorta a parte dos Objetivos
    quadro('esboco_objetivos_%s.jpg'%n,esc,[('HOJE','OBJETIVOS 16 px',fs[0]),('142b','versalete 12 px + "+" 44 px',fs[1]),('A · subtítulo','"Objetivos da loja" 17 px + "+" 44 px',fs[2]),('B · "+" menor','versalete 12 px + "+" 32 px (toque 44)',fs[3])])
