# S408 · esboços 81a–81c (17/11 14:06): Favoritos — a linha "✦ R$ 90 com o seu cartão" polui; 3 jeitos mais leves. Nada implementado.
E=open('/home/claude/lafouch/work/s408/esb3.py').read();exec(E[:E.index('with sync_'+'playwright() as pw')])
import shutil,inspect
exec(inspect.getsource(comum.prancha).replace("def prancha(","def prancha2(").replace("('HOJE','PROPOSTA')","ROT"),comum.__dict__)
CSS+=".fvp{display:inline-block;margin-left:8px;padding:1px 8px;border-radius:99px;background:#f3ece0;color:#7a5a2a;font:600 12px Inter,system-ui,sans-serif;vertical-align:1px}.fvs{color:#a9854a;margin-left:6px;font-size:14px}.fvt{font:13px/1.5 Inter,system-ui,sans-serif;color:#6b5f66;margin:-4px 2px 12px}.fvt i{font-style:normal;color:#a9854a}"
V={'KIT3C':['R$ 90','10%'],'SL2210':['R$ 86','10%']}
A="""(v)=>{[...document.querySelectorAll('#layer .fvi')].forEach(r=>{const k=r.querySelector('.cit small').textContent.trim();if(v[k]){const s=document.createElement('span');s.className='fvp';s.textContent='✦ '+v[k][0]+' com cartão';r.querySelector('.pu span').after(s)}})}"""
B="""(v)=>{[...document.querySelectorAll('#layer .fvi')].forEach(r=>{const k=r.querySelector('.cit small').textContent.trim();if(v[k]){const s=document.createElement('span');s.className='fvs';s.textContent='✦';s.setAttribute('aria-label','vale o seu cartão');r.querySelector('.pu span').after(s)}});const t=document.createElement('p');t.className='fvt';t.innerHTML='<i>✦</i> O seu cartão de 10% vale nas peças marcadas.';const f=document.querySelector('#layer .fvi');f.parentNode.insertBefore(t,f)}"""
C="""(v)=>{[...document.querySelectorAll('#layer .fvi')].forEach(r=>{const k=r.querySelector('.cit small').textContent.trim();if(v[k]){const s=document.createElement('span');s.className='fvp';s.textContent='✦ −'+v[k][1];r.querySelector('.pu span').after(s)}})}"""
with sync_playwright() as pw:
    for n,f in (('a',A),('b',B),('c',C)):
        b,pg,w=abre();oh=comum.olho(pg);b.close()
        b,pg,w=abre();pg.evaluate(f,V);w(400);op=comum.olho(pg);pg.screenshot(path=T+'o%s.png'%n);b.close();print(n,'falhas novas:',sorted(op-oh)[:4])
comum.ROT=('ANTES (79)','OPÇÃO A');comum.prancha2('81a-site-favoritos-opcao-a.jpg','Esboço 81a · Site · Favoritos · opção A: na mesma linha do preço',['Antes: uma linha a mais, dourada, embaixo do preço.','A: sem linha nova — uma etiqueta pequena ao lado do preço: "✦ R$ 90 com cartão".'],T+'f_p.png',T+'oa.png')
comum.ROT=('ANTES (79)','OPÇÃO B');comum.prancha2('81b-site-favoritos-opcao-b.jpg','Esboço 81b · Site · Favoritos · opção B: só a estrelinha (recomendo)',['Antes: uma linha a mais em cada peça.','B: só um ✦ dourado ao lado do preço; uma frase no topo explica: "O seu cartão de 10% vale nas peças marcadas". O mais limpo; o valor exato aparece no carrinho.'],T+'f_p.png',T+'ob.png')
comum.ROT=('ANTES (79)','OPÇÃO C');comum.prancha2('81c-site-favoritos-opcao-c.jpg','Esboço 81c · Site · Favoritos · opção C: só o percentual',['Antes: uma linha a mais em cada peça.','C: etiqueta pequena "✦ −10%" ao lado do preço.'],T+'f_p.png',T+'oc.png')
