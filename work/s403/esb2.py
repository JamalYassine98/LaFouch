# S403 · esboços do site 68a (status Cliente VIP em Minha conta), 68c (novidades 48 h antes), 68d (reserva de 24 h), 68g (escada nas Cartões), 68h (inscrição sem o cupom de boas-vindas).
# Site real (cópia do kit), celular, tema claro; só injeta o que muda. Nada implementado.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import comum,comum2,pago,pag,kit;comum.OUT='/home/claude/lafouch/work/s403/'
from playwright.sync_api import sync_playwright
T='/tmp/s403/';NOAN='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}'
CSS=""".vst{max-width:300px;margin:0 auto 18px;border-radius:16px;background:#17121a;background-image:linear-gradient(135deg,#2b2330 0%,#17121a 55%,#0c090e 100%);padding:6px;color:#fff}
.vst>div{border:1px solid rgba(214,178,116,.75);border-radius:11px;padding:14px 16px 12px}.vst small{display:block;font:500 12.5px Inter,system-ui,sans-serif;letter-spacing:.14em;color:#c9bfc6}
.vst strong{display:block;font:500 24px/1.2 Fraunces,Georgia,serif;color:#e9d3a6;margin:6px 0 2px}.vst em{display:block;font:italic 15px Fraunces,Georgia,serif;color:#fff}
.vst ul{list-style:none;margin:12px 0 0;padding:10px 0 0;border-top:1px solid rgba(214,178,116,.4)}.vst li{font:14px/1.5 Inter,system-ui,sans-serif;color:#e6dde2;padding:3px 0}.vst li i{font-style:normal;color:#d6b274;margin-right:8px}
.vip1{position:absolute;top:8px;left:8px;z-index:3;padding:4px 9px;border-radius:999px;background:#17121a;border:1px solid rgba(214,178,116,.7);color:#e9d3a6;font:600 12px Inter,system-ui,sans-serif;letter-spacing:.06em}
.vipn{margin:-4px 2px 12px;font:13.5px/1.5 Inter,system-ui,sans-serif;color:#6b5f66}.vipn b{color:#8a6a33;font-weight:600}
.esc{display:flex;margin:4px 0 10px}.esc>div{flex:1;text-align:center}.esc i{display:block;width:34px;height:34px;box-sizing:border-box;margin:0 auto 6px;border-radius:50%;font:600 15px/30px Inter,system-ui,sans-serif;font-style:normal;border:2px solid #8d3a69;color:#8d3a69}
.esc i.ok{background:#8d3a69;color:#fff;line-height:34px;border:0}.esc i.no{border:1px solid #d9cbd3;color:#9a8b93;line-height:32px}.esc b{display:block;font:500 17px Fraunces,Georgia,serif;color:#1d1418}.esc span{display:block;font:12.5px Inter,system-ui,sans-serif;color:#6b5f66}
.esd{text-align:center}.esd p{font:13.5px/1.5 Inter,system-ui,sans-serif;color:#6b5f66;margin:6px 0 0}"""
def par(nome,abre,depois,H=844,prep=None):
    res=[]
    for k in (0,1):
        b,pg,w=abre();pg.add_style_tag(content=NOAN+CSS);w(300)
        if prep: pg.evaluate(prep);w(700)
        if k:
            for d in depois: pg.evaluate(d);w(400)
        pg.set_viewport_size({'width':390,'height':H});w(400);res.append(comum.olho(pg));pg.screenshot(path=T+nome+('_p' if k else '_h')+'.png');b.close()
    print(nome,'falhas novas:',sorted(res[1]-res[0])[:4])
P=comum.prancha
# ---- 68a: Minha conta › Cartões do Cliente VIP
VIP={'ok':True,'guardados':0,'indicacoes':0,'nome':'Carlos Benítez','cupons':[{'cod':'LF-9V3T','tipo':'vip','pct':20,'estado':'ok','fim':1810000000000,'usado':False,'nome':'Carlos Benítez','max':1}]}
ST="""()=>{const b=document.getElementById('mtj');const d=document.createElement('div');d.className='vst';d.innerHTML='<div><small>SEU STATUS</small><strong>Cliente VIP</strong><em>desde novembro de 2026</em><ul><li><i>✦</i>Novidades 48 horas antes</li><li><i>✦</i>Reserva de 24 horas</li><li><i>✦</i>Atendimento prioritário no WhatsApp</li><li><i>✦</i>Presente no seu aniversário</li></ul></div>';b.insertBefore(d,b.firstChild)}"""
# ---- 68g: escada nas Cartões (cliente comum com o convite para indicar; 1 indicação já feita no degrau do 15%)
AMI={'ok':True,'guardados':0,'indicacoes':2,'nome':'María González','cupons':[{'cod':'LF-7K2M','tipo':'px','pct':10,'estado':'ok','fim':1805000000000,'usado':False,'nome':'María González','max':1},{'cod':'AMIGA-9H3LQ5','tipo':'am','pct':10,'estado':'ok','fim':1826000000000,'usado':False,'amigas':2,'ganhos':1,'porMes':5}]}
ESC="""()=>{const a=document.querySelector('#mtj .amct');const rs=[...a.children].filter(e=>e.tagName==='DIV');rs[1].querySelector('span').textContent='A pessoa ganha 10% na primeira compra. Quando ela comprar, você avança na escada.';
 rs[2].outerHTML='<div class="esc"><div><i class="ok">✓</i><b>10%</b><span>1 indicação</span></div><div><i>2</i><b>?</b><span>mais 3</span></div><div><i class="no">3</i><b>?</b><span>mais 5</span></div></div>';
 const r3=[...a.children].filter(e=>e.tagName==='DIV')[3];const bo=(on)=>'<span style="display:inline-block;flex:none;width:11px;height:11px;border-radius:50%;margin:0 4px;'+(on?'background:#8d3a69':'border:1px solid #cdb9c5')+'"></span>';r3.outerHTML='<div class="esd" style="display:block"><div style="display:flex;justify-content:center">'+bo(1)+bo(0)+bo(0)+'</div><p>Faltam 2 indicações para o próximo presente, que é surpresa.</p></div>'}"""
def cart(m):
    def f():
        pago.MEUS=m;return pago.abre(pw,'cartoes')
    return f
# ---- 68c: Início · Novidades com as peças que o VIP vê antes
NOV="""()=>{const h=document.querySelector('.hsh.hsh1'),g=h.nextElementSibling;[...g.querySelectorAll('.hc')].slice(0,2).forEach(c=>{c.style.position='relative';const s=document.createElement('span');s.className='vip1';s.textContent='✦ Só para VIP';c.appendChild(s)});
 const n=document.createElement('p');n.className='vipn';n.innerHTML='<b>✦ Antes de todos:</b> as 2 primeiras chegam para todos em 2 dias.';h.parentNode.insertBefore(n,g)}"""
VER="()=>{const h=document.querySelector('.hsh.hsh1');h.scrollIntoView({block:'start'});window.scrollBy(0,-130)}"
# ---- 68d: tela de pagamento com a reserva de 24 h
RES="""()=>{const c=document.getElementById('cdx');c.innerHTML='<span>Reservada para você até</span><span class="zk"><b>amanhã, 10:24</b></span>';const f=c.nextElementSibling;if(f&&f.classList.contains('zf'))f.outerHTML='<p class="vipn" style="margin:6px 0 10px"><b>✦ Cliente VIP:</b> sua reserva é de 24 horas.</p>'}"""
VCX="()=>{const c=document.getElementById('cdx');c&&c.scrollIntoView({block:'center'})}"
# ---- 68h: inscrição nas novidades por e-mail
def news(bv):
    def f():
        b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
        c=b.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
        def rota(r):
            u=r.request.url
            if u.startswith('http://localhost'): return r.continue_()
            H={'access-control-allow-origin':'*'}
            if 'cloudfunctions.net/novidades' in u: return r.fulfill(status=200,content_type='application/json',headers=H,body='{"ok":true}')
            if 'cloudfunctions.net/cupom' in u: return r.fulfill(status=200,content_type='application/json',headers=H,body=json.dumps({'ok':True,'cupom':{'cod':'BV-4K2M','pct':5,'tipo':'bv','estado':'ok','fim':1766000000000}} if bv else {'ok':True}))
            if 'firestore.googleapis.com' in u and r.request.method=='POST': return r.fulfill(status=200,content_type='application/json',body='{}')
            return r.abort()
        c.route('**/*',rota);c.add_init_script("(()=>{localStorage.setItem('lf_lang','pt');try{sessionStorage.setItem('lf_ni','1')}catch(e){}})()")
        pg=c.new_page();w=pg.wait_for_timeout;pg.goto('http://localhost:8811/?kit=1');w(1800)
        pg.evaluate("()=>{document.getElementById('hnf').scrollIntoView({block:'center'});document.querySelector('[data-nm=em]').click()}");w(400)
        pg.fill('#hnem','maria@exemplo.com');pg.evaluate("()=>document.querySelector('[data-news=em]').click()");w(1500)
        pg.evaluate("()=>{const f=document.getElementById('hnf');f.scrollIntoView({block:'center'})}");w(300);return b,pg,w
    return f
with sync_playwright() as pw:
    par('a',cart(VIP),[ST],1000)
    par('g',cart(AMI),[ESC],1000,prep="()=>{const a=document.querySelector('#mtj .amct');a&&a.scrollIntoView({block:'center'})}")
    par('c',lambda:comum2.site(pw),[NOV],844,prep=VER)
    par('d',lambda:pag.abre(pw,'pix',0.2),[RES],844,prep=VCX)
    # 68h: hoje com o cupom de boas-vindas, proposta sem
    b,pg,w=news(True)();oh=comum.olho(pg);pg.screenshot(path=T+'h_h.png');b.close()
    b,pg,w=news(False)();op=comum.olho(pg);pg.screenshot(path=T+'h_p.png');b.close();print('h falhas novas:',sorted(op-oh)[:4])
P('68a-site-minha-conta-status-vip.jpg','Esboço 68a · Site · Minha conta › Cartões · status Cliente VIP',['Hoje: o VIP vê só o cartão de 20%, igual a qualquer cartão.','Proposta: no topo, o status "Cliente VIP desde …" com as 4 vantagens (preto e dourado, igual ao cartão). O status não vence; some só se você tirar no app.'],T+'a_h.png',T+'a_p.png')
P('68g-site-minha-conta-escada-indicacoes.jpg','Esboço 68g · Site · Minha conta › Cartões · escada das indicações',['Hoje: 3 bolinhas das metas antigas.','Proposta: os 3 degraus (10% → 15% → presente) e as bolinhas só do degrau atual; o contador recomeça a cada degrau e a escada inteira recomeça depois do presente.'],T+'g_h.png',T+'g_p.png')
P('68c-site-inicio-novidades-vip.jpg','Esboço 68c · Site · Início · Novidades para o VIP (48 h antes)',['Hoje: todos veem as novidades ao mesmo tempo.','Proposta: o VIP logado vê as peças novas 48 horas antes, marcadas "Só para VIP", e uma linha diz quando chegam para todos. Quem não é VIP não vê essas peças.'],T+'c_h.png',T+'c_p.png')
P('68d-site-pagamento-reserva-24h-vip.jpg','Esboço 68d · Site · Pagamento · reserva de 24 horas do VIP',['Hoje: reserva de 30 minutos com o relógio para todos.','Proposta: para o VIP, a reserva vale 24 horas — sai o relógio e entra o horário ("até amanhã, 10:24") com a linha "Cliente VIP". Os outros clientes continuam com 30 min.'],T+'d_h.png',T+'d_p.png')
P('68h-site-inscricao-sem-cupom-boas-vindas.jpg','Esboço 68h · Site · Inscrição nas novidades por e-mail',['Hoje: depois de se inscrever abre a janela "Bem-vinda à La Fouch!" com o cupom de 5%.','Proposta (aprovado tirar o cupom): fica só a confirmação no próprio rodapé; nenhuma janela e nenhum cupom.'],T+'h_h.png',T+'h_p.png')
