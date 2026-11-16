# S395: abre o site real (cópia do kit) no celular, com conta SEM telefone e SEM documento, e leva até o passo de pagamento do carrinho
import sys,os,json;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
kit.prep_site();kit.serve(kit.SITE,kit.PS)
CONTA=json.dumps({'nome':'María González','email':'maria@exemplo.com','nac':'py','ends':[{'nome':'Casa','cidade':'Ciudad del Este','dep':'Alto Paraná','end':'Calle Los Lapachos 123','ref':'portão verde'}]})
def site(pw,W=390,H=844,extra=''):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    def rota(r):
        u=r.request.url
        if u.startswith('http://localhost'): return r.continue_()
        if 'firestore.googleapis.com' in u and r.request.method=='POST': return r.fulfill(status=200,content_type='application/json',body='{}')
        return r.abort()
    c.route('**/*',rota)
    c.add_init_script("(()=>{localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);try{sessionStorage.setItem('lf_ni','1')}catch(e){};%s})()"%(CONTA,kit.AUTH,extra))
    pg=c.new_page();w=pg.wait_for_timeout;pg.goto('http://localhost:8811/?kit=1');w(1800);return b,pg,w
