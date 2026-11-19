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
 const d=document.createElement('div');d.id='fkC';d.style.cssText=`position:absolute;z-index:99999;left:${x}px;top:${r.top+window.scrollY+(r.height-h)/2}px;width:2px;height:${h}px;border-radius:1px;background:${prop?'var(--accent)':c.caretColor}`;document.body.appendChild(d)}"""
def caso3(nome,tela,passo,h,p):
  with sync_playwright() as pw:
    for esc in (True,False):
      n='escuro' if esc else 'claro';fs=[];ks=[]
      for fase in ('hoje','prop'):
        b,pg,w=abre(pw,esc,C[passo])
        if fase=='prop': pg.evaluate(J);pg.evaluate(B2);w(400)
        else: pg.evaluate(J);w(300)  # hoje = B já aprovado
        ks.append(set((x['r'],x['ex'][0][:20]) for x in pg.evaluate(A2)))
        pg.evaluate(CAR,fase=='prop');w(200)
        fs.append(foto(pg,'input','%s3_%s_%s'%(nome,fase,n)));b.close()
      print(nome,n,'alinhamento novo:',sorted(ks[1]-ks[0]) or 'nenhum','| resolvidos:',len(ks[0]-ks[1]))
      quadro('esboco_%s_%s.jpg'%(nome,n),esc,[('B APROVADO · '+tela,h,fs[0]),('PROPOSTA · '+tela,p,fs[1])])
caso3('campo2_despesa','Nova despesa','despesas-nova','cursor solto, caixa ao tocar','cursor rosa colado no exemplo; linha rosa')
caso3('campo2_cliente','Novo cliente','clientes-novo','cursor no fim, nome fora da linha','cursor antes do exemplo; mesma linha')
caso3('campo2_retirada','Retirada','caixa-retirar','cursor solto, caixa ao tocar','cursor rosa colado no exemplo; linha rosa')
caso3('campo2_pagamento','Pagamento','catalogo-pagamento','cursor solto, caixa ao tocar','cursor rosa colado no valor; linha rosa')
