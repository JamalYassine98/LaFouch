# S395: telas de pagamento (transferência e PIX) — Hoje com o cartão de desconto como o cliente vê
import sys,json;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
kit.prep_site();kit.serve(kit.SITE,kit.PS)
def abre(pw,pag,minutos=0):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    def rota(r):
        u=r.request.url
        if u.startswith('http://localhost'): return r.continue_()
        if 'firestore.googleapis.com' in u and r.request.method=='POST': return r.fulfill(status=200,content_type='application/json',body='{}')
        return r.abort()
    c.route('**/*',rota)
    c.add_init_script("""(()=>{const n=Date.now();localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);
      localStorage.setItem('lf_ped',JSON.stringify([{id:'kitped1',cod:'4821',ts:n,total:650000,pagar:649990,brl:489.93,ent:'loja',pag:%r,est:'pagar',rx:n+30*60000,rd:0,px:{pct:10,cod:'LF-7K2M',tipo:'px',estado:'pendente'},itens:[{ref:'SL2210',nome:'Óculos de sol Hexagonal',q:1,cor:''}]}]));
      try{sessionStorage.setItem('lf_ni','1')}catch(e){}})()"""%(kit.CONTA,kit.AUTH,pag))
    pg=c.new_page();w=pg.wait_for_timeout;pg.clock.install();pg.goto('http://localhost:8811/?kit=1');w(1500)
    pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");w(900)
    pg.evaluate("()=>{if(!document.querySelector('[data-id=kitped1]')){const t=[...document.querySelectorAll('#layer button,#layer [data-mct]')].find(b=>/Pedidos/i.test(b.innerText||''));t&&t.click()}}");w(700)
    pg.evaluate("()=>{const e=document.querySelector('[data-id=kitped1]');e&&e.click()}");w(1200)
    if minutos: pg.clock.fast_forward(int(minutos*60000)+1500);w(700)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}');w(300)
    return b,pg,w
if __name__=='__main__':
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b,pg,w=abre(pw,'alias',0.2);pg.screenshot(path='/tmp/s395/alias_hoje.png',full_page=False)
        print(pg.evaluate("()=>{const o=document.getElementById('pkok');return [o.scrollHeight,o.clientHeight,o.innerHTML.replace(/<svg.*?<\\/svg>/g,'').slice(0,2600)]}"));b.close()
