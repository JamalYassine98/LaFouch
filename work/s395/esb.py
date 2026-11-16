# S395 · esboços 59a–59e (dono, 16/11 18:37 e 18:47): tela de pagamento sem o cartão de desconto, transferência com passo a passo,
# botão do comprovante claro e no tempo certo; dados do cliente: Cédula × RUC e teclado sem tampar o botão. Site real (cópia do kit), celular, tema claro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import pag,comum2,comum;comum.OUT='/home/claude/lafouch/work/s395/'
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
T='/tmp/s395/';F=comum.F
CSS=""".zpas{margin:18px 18px 0;padding:0 0 10px 22px;font:14.5px/1.55 Inter,system-ui,sans-serif;color:#3a2f35}.zpas li{margin:0 0 6px;padding-left:4px}.zpas li::marker{color:#8d3a69;font-weight:600}
.cfdoc{display:flex;gap:10px;margin:6px 0 10px}.cfdoc button{flex:1;min-height:48px;border-radius:14px;border:1px solid #e3d6dd;background:#fff;font:500 15px Inter,system-ui,sans-serif;color:#3a2f35}.cfdoc button.on{border-color:#8d3a69;background:#f8eef4;color:#8d3a69;font-weight:600}"""
P_TRF="""()=>{const o=document.getElementById('pkok');const px=o.querySelector('#pxcard');px&&px.remove();const zc=o.querySelector('.zc'),zm=zc.querySelector('.zm');
 const ol=document.createElement('ol');ol.className='zpas';ol.innerHTML='<li>Abra o app do seu banco e escolha <b>Transferir por alias</b>.</li><li>Tipo de alias: <b>Celular</b>. Cole o número abaixo.</li><li>Digite o <b>valor exato</b> e confirme.</li>';zc.insertBefore(ol,zc.firstChild);
 const tt=[...zc.querySelectorAll('.zr')].find(r=>/Titular/.test(r.textContent));if(tt)tt.querySelector('b').textContent='Jamal Ali Yassine · Banco Familiar';
 zm.innerHTML='<p class="zl m" style="display:block;margin:0">Depois de transferir, volte para esta tela.</p>';o.querySelector('.zs').innerHTML='<span class="spn"></span><span>Aguardando sua transferência…</span>'}"""
P_TRF2="""()=>{const o=document.getElementById('pkok');const za=o.querySelector('.za');const a=za.querySelector('a.zA');const l=document.createElement('label');l.className='zA';l.innerHTML='<span>Já transferi</span>'+(a.querySelector('svg')?a.querySelector('svg').outerHTML:'');za.insertBefore(l,a)}"""
P_JAN="""()=>{const d=document.createElement('div');d.className='dlgb';d.id='dlgb';d.innerHTML='<div class="dlg" role="dialog"><h3>Enviar comprovante</h3><p>Envie a foto ou o print do comprovante da transferência. Conferimos e confirmamos o seu pedido.</p><div class="dlga"><button type="button" class="dc">Agora não</button><button type="button" class="dk">Escolher foto</button></div></div>';document.body.appendChild(d)}"""
P_PIX="""()=>{const o=document.getElementById('pkok');const px=o.querySelector('#pxcard');px&&px.remove();const j=o.querySelector('#pgcl span');if(j)j.textContent='Já paguei'}"""
def cheia(pg,arq,H=None):
    h=H or pg.evaluate("()=>{const o=document.getElementById('pkok');return o?Math.max(844,o.scrollHeight+4):844}");pg.set_viewport_size({'width':390,'height':int(h)});pg.wait_for_timeout(350);pg.screenshot(path=arq);return int(h)
def teclado(w,h):
    K=Image.new('RGB',(w,h),'#d7d9de');d=ImageDraw.Draw(K);rows=[['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']];kh=(h-40)//4;kw=(w-4*12)//3
    for r,row in enumerate(rows):
        for c,t in enumerate(row):
            x=12+c*(kw+12);y=14+r*(kh+6)
            if t: d.rounded_rectangle([x,y,x+kw,y+kh-6],radius=12,fill='#ffffff');tw=d.textlength(t,font=F(40));d.text((x+(kw-tw)/2,y+kh/2-30),t,font=F(40),fill='#1d1418')
    return K
with sync_playwright() as pw:
    O={}
    # 59a transferência ao abrir · 59b depois de 2 min + janela
    b,pg,w=pag.abre(pw,'alias',0.2);O['a_h']=comum.olho(pg);hh=cheia(pg,T+'a_h.png');b.close()
    b,pg,w=pag.abre(pw,'alias',0.2);pg.add_style_tag(content=CSS);pg.evaluate(P_TRF);w(300);O['a_p']=comum.olho(pg);cheia(pg,T+'a_p.png',hh);
    pg.evaluate(P_TRF2);w(200);cheia(pg,T+'b_h0.png',hh);pg.evaluate(P_JAN);w(400);O['b_p']=comum.olho(pg);pg.screenshot(path=T+'b_p.png');b.close()
    b,pg,w=pag.abre(pw,'alias',3);O['b_h']=comum.olho(pg);cheia(pg,T+'b_h.png',hh);b.close()
    # 59c PIX
    b,pg,w=pag.abre(pw,'pix',2);O['c_h']=comum.olho(pg);hp=cheia(pg,T+'c_h.png');b.close()
    b,pg,w=pag.abre(pw,'pix',2);pg.evaluate(P_PIX);w(300);O['c_p']=comum.olho(pg);cheia(pg,T+'c_p.png',hp);b.close()
    # 59d documento · 59e teclado
    def passo(prop):
        b,pg,w=comum2.site(pw)
        pg.evaluate("()=>document.querySelector('#grid .card .open, .card .open, .hc .open, [data-ref]').click()");w(1400)
        pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].find(e=>/Comprar/i.test(e.innerText||''));x&&x.click()}");w(1300)
        pg.evaluate("()=>{const x=[...document.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().width>0).find(e=>/^Finalizar compra$/i.test((e.innerText||'').trim()));if(x)x.click();else document.querySelector('#bagbtn').click()}");w(1500)
        pg.evaluate("()=>{[...document.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().width>0&&/^Continuar comprando$/i.test((e.innerText||'').trim())&&!e.closest('#layer')).forEach(e=>0)}")
        for k in ('prosseguir','irpag'):
            pg.evaluate("(k)=>{const x=document.querySelector('#layer [data-cta='+k+']');x&&x.click()}",k);w(1300)
        pg.evaluate("()=>{const x=document.querySelector('#layer [data-cta=pg][data-v=alias]');x&&x.click()}");w(1200)
        pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}'+CSS)
        pg.evaluate("()=>{const z=document.getElementById('ppz');if(z){z.value='983 123 456';z.dispatchEvent(new Event('input',{bubbles:true}))}const d=document.getElementById('ppd');d.value='4567890';d.dispatchEvent(new Event('input',{bubbles:true}));d.scrollIntoView({block:'center'})}");w(500)
        if prop: pg.evaluate("()=>{const d=document.getElementById('ppd'),l=document.getElementById('ppdl');const s=document.createElement('div');s.className='cfdoc';s.innerHTML='<button type=\"button\" class=\"on\">Cédula</button><button type=\"button\">RUC</button>';const lb=document.createElement('label');lb.className='cfl';lb.textContent='Documento';l.parentNode.insertBefore(lb,l);l.parentNode.insertBefore(s,l);l.textContent='Número da cédula';d.value='4.567.890';d.placeholder='1.234.567';const r=document.getElementById('pprw');if(r)r.hidden=true;d.scrollIntoView({block:'center'})}");w(400)
        return b,pg,w
    b,pg,w=passo(0);O['d_h']=comum.olho(pg);print('campos hoje:',pg.evaluate("()=>[document.getElementById('ppd').value,(document.getElementById('ppdl')||{}).textContent,!!document.getElementById('ppz')]"));pg.screenshot(path=T+'d_h.png')
    # teclado: hoje a tela não encolhe — o teclado cobre a parte de baixo
    KH=300*2;pg.evaluate("()=>{const d=document.getElementById('ppd');d.focus();d.scrollIntoView({block:'center'})}");w(300);pg.screenshot(path=T+'e_h0.png');b.close()
    b,pg,w=passo(1);O['d_p']=comum.olho(pg);pg.screenshot(path=T+'d_p.png');b.close()
    b,pg,w=passo(1);pg.set_viewport_size({'width':390,'height':844-300});w(400);pg.evaluate("()=>{const d=document.getElementById('ppd');d.focus();d.scrollIntoView({block:'center'})}");w(400);pg.screenshot(path=T+'e_p0.png');b.close()
    kb=teclado(780,KH)
    A=Image.open(T+'e_h0.png').convert('RGB');A.paste(kb,(0,A.size[1]-KH));A.save(T+'e_h.png')
    Pm=Image.open(T+'e_p0.png').convert('RGB');C=Image.new('RGB',(780,1688),'#fff');C.paste(Pm,(0,0));C.paste(kb,(0,1688-KH));C.save(T+'e_p.png')
    for k in 'abcd': print(k,'falhas novas do olho:',sorted(O[k+'_p']-O[k+'_h'])[:4])
comum.prancha('59a-site-pagar-transferencia-ao-abrir.jpg','Esboço 59a · Site · Transferência · ao abrir',['Hoje: sem explicar como transferir; o botão do comprovante já aparece; embaixo, o cartão de desconto antes de pagar.','Proposta: passo a passo em 3 linhas, banco junto do titular, "Aguardando sua transferência…", sem botão e sem cartão.'],T+'a_h.png',T+'a_p.png')
comum.prancha('59b-site-pagar-transferencia-comprovante.jpg','Esboço 59b · Site · Transferência · depois de 2 minutos',['Hoje: "Já transferi, enviar comprovante" abre a galeria direto.','Proposta: a linha "Já transferi" aparece depois de 2 min; o toque abre esta janela, que explica o que enviar.'],T+'b_h.png',T+'b_p.png')
comum.prancha('59c-site-pagar-pix.jpg','Esboço 59c · Site · PIX',['Hoje: o cartão "10% na próxima compra" aparece antes de pagar.','Proposta: sem o cartão (o cliente recebe por e-mail depois); a linha vira só "Já paguei".'],T+'c_h.png',T+'c_p.png')
comum.prancha('59d-site-dados-cedula-ou-ruc.jpg','Esboço 59d · Site · Pagamento · documento do paraguaio',['Hoje: um campo só, "Cédula ou RUC"; a cédula 4567890 vira "456789-0", como se fosse RUC.','Proposta: o cliente escolhe Cédula ou RUC; cada um com o seu formato (cédula 4.567.890 · RUC 1234567-8 com o dígito conferido).'],T+'d_h.png',T+'d_p.png')
comum.prancha('59e-site-dados-teclado.jpg','Esboço 59e · Site · Pagamento · com o teclado aberto',['Hoje: o teclado cobre "Confirmar e pagar"; para ver o botão o cliente aperta voltar e o que digitou some.','Proposta: a tela encolhe junto com o teclado e o botão fica logo acima dele; o que foi digitado fica guardado.'],T+'e_h.png',T+'e_p.png')
