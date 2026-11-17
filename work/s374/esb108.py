# S374 · esboço 108 (dono 17/11 18:06: Despesas no padrão de luxo, fiel ao app = mesmo desenho do Caixa: rótulo versalete, linhas finas, total). Inclui o 106.
# base: esboço 106 (dono 17/11 18:02): "na aba de Despesas fica feio aparecer duas vezes a despesa".
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
LUX=r"""()=>{const v=document.getElementById('v-desp');const k=v.querySelector('section.kpis');const pg=[...v.querySelectorAll('section.card')].find(c=>/^\s*Por grupo/.test(c.textContent));
 const tot=k.querySelector('#tmTot').textContent,pc=k.querySelector('#tmPeca').textContent,hint=k.querySelector('.hint').textContent.replace(/^para pagar as contas · /,'');
 const bar=pg.querySelector('.bar').outerHTML;const rows=[...pg.querySelectorAll('.nav .cell')].map(c=>{const cor=c.querySelector('.sp').style.background;const [n,val]=c.textContent.split(' · ');
  return '<div class="cxL"><span><i style="display:inline-block;width:9px;height:9px;border-radius:3px;background:'+cor+';margin-right:10px;vertical-align:1px"></i>'+n+'</span><b style="font-size:16px;font-weight:600">'+val+'</b></div>'}).join('');
 const h='<section class="cxSaldo" aria-label="Contas do mês"><div class="cxLb">Contas do mês</div><div style="margin:12px 0 6px">'+bar+'</div>'+rows+'<div class="cxL"><span style="font-weight:600">Total por mês</span><b>'+tot+'</b></div>'+
  '<div class="cxL" style="border-bottom:0"><span>Cada peça vendida separa<small>'+hint+'</small></span><b style="color:var(--warn)">'+pc+'</b></div></section>';
 k.insertAdjacentHTML('beforebegin',h);const st=document.createElement('style');st.textContent='.view section.cxSaldo{box-shadow:none!important}';document.head.appendChild(st);k.remove();pg.remove();return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k_,nm,rola in (('a','topo',"()=>scrollTo({top:0,behavior:'instant'})"),('b','contas',"()=>{const e=document.querySelector('#v-desp .ecF');scrollTo({top:e.getBoundingClientRect().top+scrollY-160,behavior:'instant'})}")):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate("()=>window.__LF.setView('desp')");w(1300)
                if prop: print('avisos',pg.evaluate(JS),pg.evaluate(LUX));w(300)
                pg.evaluate(rola);w(300)
                oo.append(olho(pg));p=T+'d106_%s_%d_%d.png'%(k_,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k_,tema,'novos:',novos(oo[0],oo[1]))
            prancha('108%s-app-despesas-%s-%s.jpg'%(k_,nm,tema),'App · Despesas · %s · luxo · tema %s'%('topo' if k_=='a' else 'contas',tema),
              ['Hoje: dois cartões de números + cartão "Por grupo" com legenda + "Contas para pagar" repetindo contas dos grupos.',
               'Proposta (igual ao Caixa): "CONTAS DO MÊS" com a barra, uma linha fina por grupo, o total em destaque e quanto cada peça separa, num bloco só, sem sombra (no claro a sombra parecia uma borda encostando no texto). Sem conta repetida (106): o aviso fica na frase de baixo e o círculo marca como paga.'],*fs)
