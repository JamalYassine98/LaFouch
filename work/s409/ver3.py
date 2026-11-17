exec(open('ver.py').read().split("if __name__")[0])
import copy
with sync_playwright() as pw:
    b,pg,log=abre(pw)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#home .hc[data-open]')].find(e=>/KIT3C/.test(e.textContent));x&&x.click()}");pg.wait_for_timeout(1600)
    print('peça KIT3C selinho:',pg.evaluate("()=>{const a=document.querySelector('#layer .acup');return a?a.textContent:null}"))
    pg.evaluate("()=>{const a=document.querySelector('#layer .acup');a&&a.scrollIntoView({block:'center'})}");pg.wait_for_timeout(300);pg.screenshot(path=T+'G_peca.png')
    b.close()
    # Favoritos
    b,pg,log=abre(pw)
    pg.evaluate("()=>{localStorage.setItem('lf_fav',JSON.stringify({KIT3C:1,SL2210:1}));}");pg.reload();pg.wait_for_timeout(2500)
    pg.evaluate("()=>document.querySelector('#bagbtn').click()");pg.wait_for_timeout(1200);pg.evaluate("()=>{const t=document.querySelector('[data-ctab=fav]');t&&t.click()}");pg.wait_for_timeout(900)
    print('fav selinhos:',pg.evaluate("()=>[...document.querySelectorAll('#layer .fvi .fsl')].map(x=>x.textContent)"));pg.screenshot(path=T+'H_fav.png');b.close()
    # sem cartão: nada de selinho, nada de Exclusivo, carrinho sem sugestão e sem "Tem um código?"
    b,pg,log=abre(pw,{'ok':True,'cupons':[],'guardados':0,'indicacoes':0,'escada':{'deg':1,'feitas':0,'tot':1},'vip':0})
    print('sem cartão:',pg.evaluate("()=>[!!document.querySelector('#home .exs')]"))
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#home .hc[data-open]')].find(e=>/KIT3C/.test(e.textContent));x&&x.click()}");pg.wait_for_timeout(1500)
    print('  selinho peça',pg.evaluate("()=>!!document.querySelector('#layer .acup')"))
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].find(e=>/Comprar/i.test(e.innerText||''));x&&x.click()}");pg.wait_for_timeout(1200)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().width>0).find(e=>/^Finalizar compra$/i.test((e.innerText||'').trim()));x&&x.click()}");pg.wait_for_timeout(1300)
    print('  carrinho',pg.evaluate("()=>[!!document.querySelector('#layer .exc'),!!document.querySelector('#layer .cupf'),/Leve 2|Tem um código/.test(document.querySelector('#layer').innerText)]"));pg.screenshot(path=T+'I_carrinho_sem.png');b.close()
    # Natal + cupom do evento pelo link
    M=copy.deepcopy(MEUS);M['cupons']=[]
    b,pg,log=abre(pw,M,'natal')
    pg.evaluate("()=>{localStorage.setItem('lf_cup',JSON.stringify({cod:'NAVIDAD10',pct:10,tipo:'ev',fim:1767000000000,min:0,tema:'natal'}))}");pg.reload();pg.wait_for_timeout(2500);pg.evaluate("()=>document.documentElement.setAttribute('data-ev','natal')");pg.wait_for_timeout(500)
    pg.evaluate("()=>{const a=document.querySelector('#home .exs [data-exc]');a&&a.click()}");pg.wait_for_timeout(1800);pg.screenshot(path=T+'J_natal.png')
    print('natal exh',pg.evaluate("()=>{const h=document.querySelector('#vitrine .exh');return h?h.innerText.slice(0,80):null}"))
    b.close()
    # VIP: reserva de 3 horas no pagamento
    b,pg,log=abre(pw)
    pg.evaluate("()=>{const n=Date.now();localStorage.setItem('lf_ped',JSON.stringify([{id:'kitped1',cod:'4821',ts:n,total:650000,pagar:0,brl:489.93,ent:'loja',pag:'pix',est:'pagar',rx:n+3*3600e3,rd:0,vip:true,itens:[{ref:'SL2210',nome:'Óculos',q:1,cor:''}]}]))}")
    pg.reload();pg.wait_for_timeout(2000)
    pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");pg.wait_for_timeout(900)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer [data-mct]')].find(b=>/Pedidos/i.test(b.innerText||''));t&&t.click()}");pg.wait_for_timeout(800)
    pg.evaluate("()=>{const e=document.querySelector('[data-id=kitped1]');e&&e.click()}");pg.wait_for_timeout(1500)
    print('VIP reserva',pg.evaluate("()=>{const c=document.getElementById('cdx');return c?c.innerText:null}"));pg.evaluate("()=>{const c=document.getElementById('cdx');c&&c.scrollIntoView({block:'center'})}");pg.screenshot(path=T+'K_vip.png')
    print('erros',[x for x in log if 'ERR_FAILED' not in x][:5]);b.close()
    # cadastro com Cédula | RUC
    b,pg,log=abre(pw)
    pg.evaluate("()=>{const c=JSON.parse(localStorage.getItem('lf_conta'));c.nac='py';localStorage.setItem('lf_conta',JSON.stringify(c))}");pg.reload();pg.wait_for_timeout(2000)
    pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");pg.wait_for_timeout(900)
    pg.evaluate("()=>{const t=document.querySelector('#layer [data-cta=conta]');t&&t.click()}");pg.wait_for_timeout(1200)
    print('cadastro',pg.evaluate("()=>[!!document.getElementById('cfdt'),document.getElementById('cfdt')&&document.getElementById('cfdt').hidden,(document.getElementById('cfdl')||{}).textContent]"))
    pg.evaluate("()=>{const d=document.getElementById('cfdt');d&&d.scrollIntoView({block:'center'})}");pg.screenshot(path=T+'L_cadastro.png');print('erros',[x for x in log if 'ERR_FAILED' not in x][:5]);b.close()
