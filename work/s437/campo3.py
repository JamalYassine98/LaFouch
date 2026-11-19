# Campo B3: texto a 8 px da linha (pedido 19/11 14:38)
# Campo de escrever B2 (aprovado B 19/11 14:30 + ajuste: cursor e exemplo no mesmo eixo)
exec(open('/home/claude/lafouch/work/s437/esb.py').read())
exec(open('/home/claude/lafouch/work/s437/campo.py').read().split('def caso2')[0].split('import json')[1])
B2=r"""()=>{if(!document.getElementById('cB2')){const s=document.createElement('style');s.id='cB2';s.textContent=`
input,textarea{caret-color:var(--accent)!important}
.view input:focus,.view textarea:focus,.view select:focus,.ljJn input:focus,.fjJn input:focus,.modal-box input:focus,.modal-box textarea:focus{outline:none!important;box-shadow:none!important;border-bottom-color:var(--accent)!important}
.rw77:has(>input),.docF{align-items:baseline!important}.rw77:focus-within{border-bottom-color:var(--accent)!important}
.rw77 input{text-align:left!important}`;document.head.appendChild(s)}}"""
CAR=r"""(prop)=>{document.getElementById('fkC')?.remove();const i=[...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden])')].find(x=>x.getBoundingClientRect().height);if(!i)return;i.focus();const r=i.getBoundingClientRect(),c=getComputedStyle(i),fs=parseFloat(c.fontSize),h=Math.round(fs*1.35);
 const m=document.createElement('canvas').getContext('2d');m.font=c.font;const tw=m.measureText(i.value||i.placeholder).width;
 const x=c.textAlign=='right'?r.right-1:r.left+parseFloat(c.paddingLeft)-(prop?2:0);
 if(prop&&c.textAlign!='right'){i.style.setProperty('text-indent','0','important')}
 const d=document.createElement('div');d.id='fkC';d.style.cssText=`position:absolute;z-index:99999;left:${x}px;top:${r.top+window.scrollY+parseFloat(c.paddingTop)+(r.height-parseFloat(c.paddingTop)-parseFloat(c.paddingBottom)-h)/2}px;width:2px;height:${h}px;border-radius:1px;background:${prop?'var(--accent)':c.caretColor}`;document.body.appendChild(d)}"""
B3=r"""()=>{if(!document.getElementById('cB3')){const s=document.createElement('style');s.id='cB3';s.textContent=`
.view select,.ljJn select,.fjJn select,.modal-box select,.view input.in,.ljJn input.in,.fjJn input.in,.modal-box input.in,.rw77 input,.docF input{height:44px!important;box-sizing:border-box!important;padding-top:17px!important;padding-bottom:0!important}

.rw77{min-height:0!important;padding:12px 0 0!important}`;document.head.appendChild(s)}document.querySelectorAll('select').forEach(e=>{[['-webkit-appearance','none'],['appearance','none'],['background-image',`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%238b9bb0' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`],['background-repeat','no-repeat'],['background-position','right 4px top calc(50% + 8px)'],['padding-left','0'],['padding-right','24px']].forEach(q=>e.style.setProperty(q[0],q[1],'important'))});document.querySelectorAll('.rw77').forEach(e=>{if(!e.querySelector('input'))return;[['min-height','0'],['padding-top','12px'],['padding-bottom','0']].forEach(q=>e.style.setProperty(q[0],q[1],'important'))})}"""
def caso3(nome,tela,passo,h,p):
  with sync_playwright() as pw:
    for esc in (True,False):
      n='escuro' if esc else 'claro';fs=[];ks=[]
      for fase in ('hoje','prop'):
        b,pg,w=abre(pw,esc,C[passo])
        pg.evaluate(J);pg.evaluate(B2)
        if fase=='prop': pg.evaluate(B3)
        w(400)
        ks.append(set((x['r'],x['ex'][0][:20]) for x in pg.evaluate(A2)))
        pg.evaluate(CAR,fase=='prop');w(200)
        fs.append(foto(pg,'input','%s4_%s_%s'%(nome,fase,n)));b.close()
      print(nome,n,'alinhamento novo:',sorted(ks[1]-ks[0]) or 'nenhum','| resolvidos:',len(ks[0]-ks[1]))
      quadro('esboco_%s_%s.jpg'%(nome,n),esc,[('APROVADO · '+tela,h,fs[0]),('PROPOSTA · '+tela,p,fs[1])])
caso3('campo3_despesa','Nova despesa','despesas-nova','texto longe da linha (17–24 px)','texto a 8 px da linha, mesma altura de toque')
caso3('campo3_cliente','Novo cliente','clientes-novo','texto longe da linha (17–24 px)','texto a 8 px da linha, mesma altura de toque')
caso3('campo3_retirada','Retirada','caixa-retirar','texto longe da linha (17–24 px)','texto a 8 px da linha, mesma altura de toque')
caso3('campo3_pagamento','Pagamento','catalogo-pagamento','texto longe da linha (17–24 px)','texto a 8 px da linha, mesma altura de toque')
