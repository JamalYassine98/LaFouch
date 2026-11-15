# S349 · esboço 35: DASHBOARD com 3 NÚMEROS na frente (Vendido, Lucro livre, Meta do mês) + o aviso do que fazer; o resto vira linhas que abrem.
# App real: os números e os textos são os da própria tela (só mudam de lugar). Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
from playwright.sync_api import sync_playwright
CSS=""".esLs{background:var(--panel2);border:1px solid var(--line);border-radius:18px;padding:4px 16px;display:flex;flex-direction:column}
.esLn{display:flex;align-items:center;gap:12px;min-height:56px;padding:8px 0;border:0;border-top:1px solid var(--line);background:none;width:100%;text-align:left;color:var(--fg);font:inherit}
.esLn:first-child{border-top:0}.esLn .g{flex:1;min-width:0}.esLn b{display:block;font-weight:600;font-size:15px}.esLn small{display:block;color:var(--mute);font-size:13px;margin-top:2px}.esLn i{font-style:normal;color:var(--mute);font-size:18px}
.esTit{font:600 12px/1 inherit;letter-spacing:.08em;color:var(--mute);margin:22px 2px 10px}#dtabBody .kpis.es3 .kpi>b{font-size:26px!important;line-height:1.2!important;display:block}#dtabBody .kpis.es3 .kpi .mtBar{margin:10px 0 8px}
@media(min-width:900px){#dtabBody .kpis.es3{grid-template-columns:repeat(3,minmax(0,1fr))!important}}"""
MUDA="""()=>{const B=document.getElementById('dtabBody');const ks=B.querySelector('section.kpis');const k=[...ks.querySelectorAll(':scope>.kpi')];const txt=e=>(e.innerText||'').replace(/\\s+/g,' ').trim();
 const vend=k[0],sep=k[1],luc=k[2],dol=k[3];const tot=(txt(vend.querySelector('.hint')).match(/G\\$ [0-9.]+/)||[''])[0];const resto=txt(vend.querySelector('.hint')).replace(/^≈ G\\$ [0-9.]+ · /,'');
 const sepv=(sep.querySelector('b').innerText.split('\\n')[0]||'').trim();
 vend.querySelector('b').textContent=tot;vend.querySelector('.hint').textContent=resto;
 const mt=B.querySelector('.mtCard');const mk=document.createElement('div');mk.className='kpi';const big=mt.querySelector('.paBig'),bar=mt.querySelector('.mtBar'),meta=txt(mt.querySelector('.paMt span:last-child'));
 mk.innerHTML='<div class="lbl">Meta do mês</div><b>'+txt(big)+'</b>';mk.appendChild(bar.cloneNode(true));mk.insertAdjacentHTML('beforeend','<div class="hint">'+meta+'</div>');
 ks.classList.add('es3');sep.remove();dol.remove();ks.appendChild(mk);
 const cards=[...B.querySelectorAll(':scope>section.card')].filter(c=>!c.classList.contains('mtCard'));const nota=B.querySelector('.note.n-ok,.note.n-bad,.note.n-warn');
 const linhas=[['Separar das vendas',sepv+' · '+txt(sep.querySelector('.hint'))]];cards.forEach(c=>{const h=c.querySelector('h2');if(!h)return;const hi=c.querySelector('.hint');linhas.push([txt(h),hi?txt(hi).split(/[.;:]/)[0].split(' ').slice(0,9).join(' '):''])});
 const ls=document.createElement('section');ls.className='esLs';ls.innerHTML=linhas.map(l=>'<button type="button" class="esLn"><span class="g"><b>'+l[0]+'</b>'+(l[1]?'<small>'+l[1]+'</small>':'')+'</span><i>›</i></button>').join('');
 const t1=document.createElement('div');t1.className='esTit';t1.textContent='O QUE FAZER AGORA';const t2=document.createElement('div');t2.className='esTit';t2.textContent='DETALHES';
 const n2=nota?nota.cloneNode(true):null;cards.forEach(c=>c.remove());mt.remove();
 if(n2){ks.after(t1);t1.after(n2);n2.after(t2)}else ks.after(t2);t2.after(ls);return [linhas.length,!!n2,document.scrollingElement.scrollHeight]}"""
with sync_playwright() as pw:
    for apn,pc in (('celular',False),('pc',True)):
        for esc,tema in ((True,'escuro'),(False,'claro')):
            fs=[];oo=[];al=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'dash',esc,apn);w(2600);al.append(pg.evaluate("()=>document.scrollingElement.scrollHeight"))
                if prop: oo.append(olho(pg));pg.add_style_tag(content=CSS);r=pg.evaluate(MUDA);al[1]=r[2];print('   linhas, aviso, altura:',r);w(600)
                p=T+'ds_%s_%d_%d.png'%(apn,esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
            print('dashboard',apn,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]),'· altura',al)
            prancha('35-%s-dashboard-3-numeros-%s.jpg'%(apn,tema),'App · %sDashboard · tema %s'%('Computador · ' if pc else '',tema),
              ['Hoje: 4 blocos com até 3 valores cada (uma moeda por linha) e depois 5 cartões abertos; página de %d px.'%al[0],'Proposta: 3 números na frente (Vendido, Lucro livre, Meta do mês), o aviso do que fazer e o resto em linhas que abrem; página de %d px.'%al[1]],*fs,pc=pc)
