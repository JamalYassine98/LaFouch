# S353: ESTADOS do Pagamento no padrão de luxo (esboço 39 aprovado) — Crédito (taxa), Troco, Duas moedas, Abaixo do piso + cliente; celular, tablet e PC.
# Cada estado é montado no app REAL (toca nos botões de verdade) e só depois recebe o desenho novo. Claro e escuro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s353/';T='/tmp/s353/'
from playwright.sync_api import sync_playwright
so=sys.argv[1:]
S350=open('/home/claude/lafouch/work/s350/esb.py').read()
TRK=S350.split('TRK="""')[1].split('"""')[0];TRKP=S350.split('TRKP="""')[1].split('"""')[0];CSS39=S350.split('CSS39="""')[1].split('"""')[0]
TOCA="rx=>{const b=[...document.querySelectorAll('button')].filter(e=>e.offsetParent&&new RegExp(rx).test(e.innerText.trim())).pop();if(!b)return 'sem';b.click();return 'ok'}"
CSS=CSS39+"""@media(min-width:700px){#vSaleCard{max-width:560px;margin-left:auto;margin-right:auto}}"""
MUDA="""()=>{const P=document.getElementById('payB');const su=document.querySelector('#sumB .sum');const tx=(su.innerText||'').replace(/\\s+/g,' ').trim();const tot=(tx.match(/G\\$ [0-9.]+/)||[''])[0];const cap=tx.replace(tot,'').trim();
 su.classList.add('esSum');su.innerHTML='<span class="esCap">'+cap+'</span><span class="esTot">'+tot+'</span>';
 const f=document.getElementById('formaChips'),m=document.getElementById('moedas');const fi=[...f.children].findIndex(x=>x.classList.contains('on')),mi=[...m.children].findIndex(x=>x.classList.contains('on'));const ft=[...f.children].map(x=>x.innerText.trim());
 const mk=(nomes,sel,id)=>{const t=document.createElement('div');t.className='trk';t.id=id;t.innerHTML='<span class="trkTh"></span>'+nomes.map((n,i)=>'<button type="button" class="trkB'+(i===sel?' on':'')+'">'+n+'</button>').join('');return t};
 const tf=mk(['Dinheiro','Pix','Débito','Crédito'],fi,'esF');f.replaceWith(tf);const tx2=(ft[fi]||'').match(/(\\d+)%/);if(tx2)tf.insertAdjacentHTML('afterend','<div class="esHt">A maquininha cobra '+tx2[1]+'% desta venda.</div>');
 if(m.offsetParent!==null||m.children.length){const tm=mk([...m.children].map(x=>x.innerText.trim()),Math.max(0,mi),'esM');m.replaceWith(tm)}
 const cli=document.getElementById('cliPickB'),mix=document.getElementById('pagMixB');if(cli&&mix)P.insertBefore(cli,mix);
 document.querySelectorAll('#pmExtra .chip.add').forEach(ex=>{ex.className='esTx';ex.textContent='+ Receber parte em outra moeda'});
 document.querySelectorAll('#payB .nav').forEach(n=>{const cs=[...n.querySelectorAll('.chip')];if(cs.length>=2&&cs.length<=4&&cs.every(c=>c.innerText.trim().length<14)){const i=cs.findIndex(c=>c.classList.contains('on'));const t=mk(cs.map(c=>c.innerText.trim()),Math.max(0,i),'esX'+Math.random().toString(36).slice(2,6));n.replaceWith(t)}});
 return [tot,fi,mi,document.querySelectorAll('#payB .trk').length]}"""
POS="""()=>{document.querySelectorAll('#payB .trk').forEach(t=>{const o=t.querySelector('.on'),h=t.querySelector('.trkTh');if(!o)return;const r=o.getBoundingClientRect(),p=t.getBoundingClientRect();h.style.transition='none';h.style.width=r.width+'px';h.style.transform='translateX('+(r.left-p.left-3)+'px)'})}"""
def ate(pg,w):
    pg.evaluate("()=>window.__LF.setView('vendas')");w(800);pg.evaluate("()=>document.querySelector('#vRows .pcard[data-ref]').click()");w(1000);pg.evaluate(TOCA,'^Vender');w(1100);pg.evaluate("()=>document.querySelector('[data-act=cartopen]').click()");w(900);pg.evaluate(TOCA,'Confirmar pedido');w(1200)
def credito(pg,w): pg.evaluate(TOCA,'crédito');w(900)
def troco(pg,w):
    pg.evaluate("()=>{const i=document.getElementById('recIn');i.value='50.000';i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))}");w(1000)
def duas(pg,w): pg.evaluate(TOCA,'Outra moeda');w(1000)
def real(pg,w): pg.evaluate(TOCA,'^R\\$ Real');w(900)
EST=[('a-credito','maquininha de crédito',credito,'a taxa fica numa linha embaixo do trilho, só quando a maquininha é escolhida'),('b-troco','cliente pagou com mais (troco)',troco,'o troco aparece logo abaixo do valor recebido'),
     ('c-duas-moedas','parte em outra moeda',duas,'a segunda moeda entra como mais uma linha, com o mesmo trilho'),('d-em-reais','recebido em reais',real,'o trilho da moeda mostra a escolhida; o equivalente em guaranis fica embaixo do valor')]
with sync_playwright() as pw:
    for apn,pc in (('celular',False),('tablet',False),('pc',True)):
        if so and apn not in so: continue
        for nome,desc,prep,nota in EST:
            if apn!='celular' and nome not in ('a-credito','c-duas-moedas'): continue
            for esc,tema in ((True,'escuro'),(False,'claro')):
                fs=[];oo=[]
                for prop in (0,1):
                    b,pg,w=ap.abre(pw,'inicio',esc,apn);ate(pg,w);prep(pg,w);pg.evaluate("()=>{const c=document.getElementById('vSaleCard');c&&c.scrollIntoView({block:'start'});scrollBy(0,-70)}");w(500)
                    if prop:
                        o=olho(pg);pg.evaluate('()=>scrollBy(0,300)');w(300);o|=olho(pg);pg.evaluate('()=>scrollBy(0,-300)');w(300);oo.append(o)
                        pg.add_style_tag(content=CSS);r=pg.evaluate(MUDA);pg.evaluate(POS);w(500)
                        if esc: print('   ',apn,nome,r)
                    p=T+'%s_%s_%d_%d.png'%(apn[:3],nome[:1],esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
                print('39%s'%nome,apn,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
                prancha('39%s-%s-pagamento-%s.jpg'%(nome,apn,tema),'App · %sPagamento · %s · tema %s'%({'celular':'','tablet':'Tablet · ','pc':'Computador · '}[apn],desc,tema),['Hoje: o mesmo estado na tela atual.','Proposta (padrão do esboço 39): '+nota+'.'],*fs,pc=pc)
