# S349 · esboço 34: DESFAZER no lugar de "tem certeza?". Exemplo real: excluir um produto na ficha do Inventário.
# Hoje: lápis → lixeira → caixa "Excluir este produto?" → "Sim, excluir". Proposta: a lixeira já exclui e aparece o aviso do app com "Desfazer" (o mesmo aviso que já existe em "Foto na lixeira").
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
from playwright.sync_api import sync_playwright
LIXO="""()=>{const d=document.getElementById('detail');const lap=[...d.querySelectorAll('button')].find(e=>e.offsetParent&&/ditar/i.test(e.getAttribute('aria-label')||e.title||''))||[...d.querySelectorAll('button')].filter(e=>e.offsetParent&&!e.innerText.trim()&&e.querySelector('svg')).pop();if(!lap)return 'sem lápis';lap.click();return 'lápis'}"""
LIXO2="()=>{const l=document.querySelector('.edLixo');if(!l)return 'sem lixeira';l.scrollIntoView({block:'center'});l.click();return 'lixeira'}"
TOAST="""()=>{const sv=(document.querySelector('.edLixo svg')||{}).outerHTML||'';return sv}"""
POE="""sv=>{const b=document.createElement('div');b.className='lfa-toast b';b.setAttribute('role','status');b.innerHTML='<span class="lfa-ic">'+sv+'</span><div style="flex:1"><b>Produto excluído</b><div class="cd" style="--cd:5s;animation-play-state:paused"></div></div><button type="button" class="pdLink" style="font-weight:700;min-height:44px;min-width:44px;padding:0 6px;display:inline-flex;align-items:center">Desfazer</button>';document.body.appendChild(b);return b.getBoundingClientRect().top|0}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w=ap.abre(pw,'estoque',esc);o0=olho(pg);pg.query_selector_all('#v-estoque .pcard')[2].click();w(1500)
        print('  ',pg.evaluate(LIXO));w(900);print('  ',pg.evaluate(LIXO2));w(900)
        sv=pg.evaluate(TOAST)
        print('  ',pg.evaluate("()=>{const a=document.getElementById('edLixoAviso');if(!a)return 'sem pergunta';a.scrollIntoView({block:'center'});return a.innerText.replace(/\\s+/g,' ').slice(0,160)}"));w(700)
        hoje=T+'df_%d_h.png'%esc;pg.screenshot(path=hoje);o0|=olho(pg);b.close()
        b,pg,w=ap.abre(pw,'estoque',esc);w(600)
        pg.evaluate("()=>{const c=document.querySelectorAll('#v-estoque #rows .pcard')[2];if(c)c.remove();const k=document.getElementById('k1');if(k)k.textContent='461';[...document.querySelectorAll('#v-estoque *')].forEach(e=>{if(e.children.length===0&&/^470 peças/.test(e.textContent.trim()))e.textContent=e.textContent.replace('470','461')});const k2=document.getElementById('k2');if(k2)k2.textContent='15'}");w(300);print('   aviso em y =',pg.evaluate(POE,sv));w(600)
        p=T+'df_%d_p.png'%esc;pg.screenshot(path=p);o1=olho(pg);b.close()
        print('desfazer',tema,'achados novos:',novos(o0,o1))
        prancha('34-app-desfazer-%s.jpg'%tema,'App · Inventário · excluir um produto · tema '+tema,
          ['Hoje: a lixeira abre a pergunta "Excluir este produto?" e é preciso tocar em "Sim, excluir".','Proposta: a lixeira exclui na hora, volta para a lista e o aviso fica 5 segundos com "Desfazer".'],hoje,p)
