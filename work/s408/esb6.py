# S408 · esboços 81d/81e (17/11 14:10): ao lado do preço, mas bem mais leve (sem etiqueta, sem negrito). Nada implementado.
E=open('/home/claude/lafouch/work/s408/esb5.py').read();exec(E[:E.index('with sync_'+'playwright() as pw')])
CSS+=".fvl,.fvl span{display:inline!important}.fvl{margin-left:6px;font:400 13px Inter,system-ui,sans-serif}"
D="""(v)=>{[...document.querySelectorAll('#layer .fvi')].forEach(r=>{const k=r.querySelector('.cit small').textContent.trim();if(v[k]){const s=document.createElement('span');s.className='fvl';s.style.color='#8a6a33';s.textContent='· '+v[k][0]+' com cartão';r.querySelector('.pu span').after(s)}})}"""
F="""(v)=>{[...document.querySelectorAll('#layer .fvi')].forEach(r=>{const k=r.querySelector('.cit small').textContent.trim();if(v[k]){const s=document.createElement('span');s.className='fvl';s.style.color='#6b5f66';s.innerHTML='<i style="font-style:normal;color:#a9854a">✦</i> '+v[k][0];r.querySelector('.pu span').after(s)}})}"""
with sync_playwright() as pw:
    for n,f in (('d',D),('e',F)):
        b,pg,w=abre();oh=comum.olho(pg);b.close()
        b,pg,w=abre();pg.evaluate(f,V);w(400);op=comum.olho(pg);pg.screenshot(path=T+'o%s.png'%n);b.close();print(n,'falhas novas:',sorted(op-oh)[:4])
comum.ROT=('ANTES (79)','OPÇÃO D');comum.prancha2('81d-site-favoritos-opcao-d.jpg','Esboço 81d · Site · Favoritos · opção D: texto fino ao lado do preço',['Sem etiqueta e sem negrito: "· R$ 90 com cartão" em dourado discreto, do mesmo tamanho do preço.'],T+'f_p.png',T+'od.png')
comum.ROT=('ANTES (79)','OPÇÃO E');comum.prancha2('81e-site-favoritos-opcao-e.jpg','Esboço 81e · Site · Favoritos · opção E: só o valor, em cinza (o mais leve)',['Só "✦ R$ 90" em cinza ao lado do preço; a estrelinha dourada é o único toque de cor.'],T+'f_p.png',T+'oe.png')
