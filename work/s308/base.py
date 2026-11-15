# S308: base comum — abre a tela REAL de pagamento do site (cópia do kit) num pedido de teste, com relógio controlado.
import sys,os,json;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
kit.prep_site();kit.serve(kit.SITE,kit.PS)
def abre(pw,minutos=0,comp=False,W=390,H=844,pag='pix'):
    mob=W<700
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=2 if mob else 1,is_mobile=mob,has_touch=mob,locale='pt-BR')
    def rota(r):
        u=r.request.url
        if u.startswith('http://localhost'): return r.continue_()
        if 'firestore.googleapis.com' in u and r.request.method=='POST': return r.fulfill(status=200,content_type='application/json',body='{}')
        return r.abort()
    c.route('**/*',rota)
    c.add_init_script("""(()=>{const n=Date.now();localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);
      localStorage.setItem('lf_ped',JSON.stringify([{id:'kitped1',cod:'LF-4821',ts:n,total:650000,brl:489.93,ent:'retirada',pag:%r,est:'pagar',rx:n+30*60000,rd:0,itens:[{ref:'SL2210',nome:'Óculos de sol Hexagonal',q:1,cor:''}]}]));
      try{sessionStorage.setItem('lf_ni','1')}catch(e){}})()"""%(kit.CONTA,kit.AUTH,pag))
    pg=c.new_page();w=pg.wait_for_timeout
    pg.clock.install();pg.goto('http://localhost:8811/?kit=1');w(1500)
    pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");w(900)
    pg.evaluate("()=>{if(!document.querySelector('[data-id=kitped1]')){const t=[...document.querySelectorAll('#layer button,#layer [data-mct]')].find(b=>/Pedidos/i.test(b.innerText||''));t&&t.click()}}");w(700)
    pg.evaluate("()=>{const e=document.querySelector('[data-id=kitped1]');e&&e.click()}");w(1200)
    if minutos: pg.clock.fast_forward(int(minutos*60000)+1500);w(700)
    if comp:
        from PIL import Image;Image.new('RGB',(600,900),(245,245,245)).save('/tmp/s308/comp.png')
        pg.set_input_files('#pgf','/tmp/s308/comp.png');w(2500)
    return b,pg,w
