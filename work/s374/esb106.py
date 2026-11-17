# S374 · esboço 106 (dono 17/11 18:02): "na aba de Despesas fica feio aparecer duas vezes a despesa".
# Hoje: "Contas para pagar" (Contas de casa, Luz, Contador + "Marcar como paga") e, embaixo, as mesmas contas de novo nos grupos.
# Proposta: sai o cartão "Contas para pagar". Cada conta aparece uma vez só, no seu grupo; a que venceu ou vence logo mostra o aviso
# na frase de baixo (vermelho se venceu, amarelo se vence em até 7 dias) e o círculo da linha marca como paga (já faz isso hoje).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
JS=r"""()=>{const v=document.getElementById('v-desp');const card=[...v.querySelectorAll('section.card,.card')].find(c=>/^\s*Contas para pagar/.test(c.textContent));if(!card)return 0;
 const avisos={};[...card.querySelectorAll('.esLn,.sl,div')].forEach(()=>{});
 const linhas=card.innerText.split('\n').map(s=>s.trim()).filter(Boolean);
 for(let i=0;i<linhas.length;i++){const n=linhas[i];const m=linhas[i+1]||'';if(/venceu|vence em|vence hoje/i.test(m))avisos[n]=m.replace(/\s*·\s*informe o valor desta fatura/,' · informe o valor')}
 card.remove();let k=0;
 v.querySelectorAll('.ecF').forEach(r=>{const nm=r.querySelector('.ecNm b').textContent.trim();if(avisos[nm]){const sm=r.querySelector('.ecNm small');sm.innerHTML='<span style="color:'+(/venceu/.test(avisos[nm])?'var(--bad)':'var(--warn)')+'">'+avisos[nm].split(' · ')[0]+'</span>'+(avisos[nm].includes(' · ')?' · '+avisos[nm].split(' · ').slice(1).join(' · '):'');k++}});return k}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k_,nm,rola in (('a','topo',"()=>scrollTo({top:0,behavior:'instant'})"),('b','contas',"()=>{const e=document.querySelector('#v-desp .ecF');scrollTo({top:e.getBoundingClientRect().top+scrollY-160,behavior:'instant'})}")):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate("()=>window.__LF.setView('desp')");w(1300)
                if prop: print('avisos',pg.evaluate(JS));w(300)
                pg.evaluate(rola);w(300)
                oo.append(olho(pg));p=T+'d106_%s_%d_%d.png'%(k_,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k_,tema,'novos:',novos(oo[0],oo[1]))
            prancha('106%s-app-despesas-%s-%s.jpg'%(k_,nm,tema),'App · Despesas · %s · cada conta uma vez · tema %s'%('topo' if k_=='a' else 'contas',tema),
              ['Hoje: "Contas para pagar" mostra Contas de casa, Luz e Contador — e as mesmas contas aparecem de novo embaixo, nos grupos.',
               'Proposta: sai "Contas para pagar"; cada conta aparece uma vez, no grupo dela, com o aviso na frase de baixo (vermelho = venceu, amarelo = vence logo). O círculo da linha marca como paga.'],*fs)
