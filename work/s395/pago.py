# S397: tela "Obrigado pela preferência" (pedido pago) e Minha conta › Cartões, no site real (cópia do kit), com respostas de mentira do servidor
import sys,json;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
kit.prep_site();kit.serve(kit.SITE,kit.PS)
MEUS={'ok':True,'cupons':[{'cod':'LF-7K2M','tipo':'px','pct':10,'estado':'ok','fim':1805000000000,'usado':False},{'cod':'AMIGA-9H3LQ5','tipo':'am','pct':10,'estado':'ok','fim':1826000000000,'usado':False,'amigas':1,'ganhos':1,'porMes':5},{'cod':'LF-3T8X','tipo':'px','pct':10,'estado':'ok','fim':1806000000000,'usado':False}]}
def abre(pw,tela,est='pagar'):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    def rota(r):
        u=r.request.url
        if u.startswith('http://localhost'): return r.continue_()
        if 'firestore.googleapis.com' in u and 'reservas/kitped1' in u: return r.fulfill(status=200,content_type='application/json',body=json.dumps({'fields':{'pago':{'booleanValue':True},'tok':{'stringValue':'LF-4821'}}}))
        if 'firestore.googleapis.com' in u and r.request.method=='POST': return r.fulfill(status=200,content_type='application/json',body='{}')
        if 'cloudfunctions.net/cupom' in u: return r.fulfill(status=200,content_type='application/json',headers={'access-control-allow-origin':'*'},body=json.dumps(MEUS))
        return r.abort()
    c.route('**/*',rota)
    c.add_init_script("""(()=>{const n=Date.now();localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);
      localStorage.setItem('lf_ped',JSON.stringify([{id:'kitped1',cod:'4821',ts:n,total:650000,pagar:649990,brl:489.93,ent:'loja',pag:'pix',est:%r,tok:'LF-4821',rx:n+30*60000,rd:0,px:{pct:10,cod:'LF-7K2M',tipo:'px',estado:'pendente'},am:{pct:10,cod:'AMIGA-9H3LQ5',tipo:'am',estado:'pendente'},itens:[{ref:'SL2210',nome:'Óculos de sol Hexagonal',q:1,cor:''}]}]));
      try{sessionStorage.setItem('lf_ni','1')}catch(e){}})()"""%(kit.CONTA,kit.AUTH,est))
    pg=c.new_page();w=pg.wait_for_timeout;pg.goto('http://localhost:8811/?kit=1');w(1500)
    pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");w(900)
    if tela=='pago':
        pg.evaluate("()=>{if(!document.querySelector('[data-id=kitped1]')){const t=[...document.querySelectorAll('#layer button,#layer [data-mct]')].find(b=>/Pedidos/i.test(b.innerText||''));t&&t.click()}}");w(700)
        pg.evaluate("()=>{const e=document.querySelector('[data-id=kitped1]');e&&e.click()}");w(6500)
    elif tela=='pedidos':
        pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer [data-mct]')].find(b=>/Pedidos/i.test(b.innerText||''));t&&t.click()}");w(2500)
    else:
        pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer [data-mct]')].find(b=>/Cart[õo]es/i.test(b.innerText||''));t&&t.click()}");w(3500)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}');w(400)
    return b,pg,w
if __name__=='__main__':
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b,pg,w=abre(pw,'pago');pg.screenshot(path='/tmp/s395/pago_h.png');print('PAGO',pg.evaluate("()=>{const o=document.getElementById('pkok');return o?[o.scrollHeight,o.innerHTML.replace(/<svg.*?<\\/svg>/g,'').replace(/style=\"[^\"]*\"/g,'').slice(0,1700)]:null}"));b.close()
        b,pg,w=abre(pw,'cartoes');pg.screenshot(path='/tmp/s395/cart_h.png');print('CART',pg.evaluate("()=>{const o=document.getElementById('mtj');return o?[o.scrollHeight,o.innerHTML.replace(/<svg.*?<\\/svg>/g,'').replace(/style=\"[^\"]*\"/g,'').slice(0,2200)]:[...document.querySelectorAll('#layer button')].map(b=>b.innerText).slice(0,14)}"));b.close()
