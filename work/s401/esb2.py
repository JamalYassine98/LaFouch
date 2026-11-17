# S401 · esboços 63d (cédula no formulário "Complete seus dados", logo depois de criar a conta) e 63e (teclado no iPhone). Site real (cópia do kit), celular, tema claro. Nada implementado.
import sys,io;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit')
import comum2,comum,kit;comum.OUT='/home/claude/lafouch/work/s401/'
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
T='/tmp/s401/';F=comum.F
# só na CÓPIA do kit: uma porta para abrir o formulário (no site ele aparece depois de criar a conta, o que exige o servidor de login)
f=kit.SITE+'/js/lf-site.js';s=io.open(f,encoding='utf8').read()
if '__cf=' not in s: io.open(f,'w',encoding='utf8').write(s.replace('function contaForm(volta){','window.__cf=function(v){contaForm(v)};function contaForm(volta){',1))
P="""()=>{const d=document.getElementById('cfd'),l=document.querySelector('label[for=cfd]');const s=document.createElement('div');s.className='cfdoc';s.innerHTML='<button type="button" class="on">Cédula</button><button type="button">RUC</button>';const lb=document.createElement('span');lb.className='cfl';lb.textContent='Documento';l.parentNode.insertBefore(lb,l);l.parentNode.insertBefore(s,l);l.textContent='Número da cédula';d.value='4.567.890';d.placeholder='1.234.567'}"""
def teclado(w,h):
    K=Image.new('RGB',(w,h),'#d1d4d9');d=ImageDraw.Draw(K);rows=[['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']];kh=(h-40)//4;kw=(w-4*12)//3
    for r,row in enumerate(rows):
        for c,t in enumerate(row):
            x=12+c*(kw+12);y=14+r*(kh+6)
            if t: d.rounded_rectangle([x,y,x+kw,y+kh-6],radius=10,fill='#ffffff');tw=d.textlength(t,font=F(40));d.text((x+(kw-tw)/2,y+kh/2-30),t,font=F(40),fill='#1d1418')
    return K
def cadastro(pw):
    b,pg,w=comum2.site(pw,extra="localStorage.setItem('lf_conta',JSON.stringify({nac:'py',pais:'py'}))");pg.evaluate("()=>window.__cf(false)");w(1500)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}')
    print('nac:',pg.evaluate("()=>document.getElementById('cfa2').value"))
    pg.locator('#cfd').click();pg.keyboard.type('4567890',delay=20);w(300);pg.evaluate("()=>{document.activeElement.blur();document.getElementById('cfd').scrollIntoView({block:'center'})}");w(400);return b,pg,w
def pagar(pw):
    b,pg,w=comum2.site(pw)
    pg.evaluate("()=>document.querySelector('#grid .card .open, .card .open, .hc .open, [data-ref]').click()");w(1400)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].find(e=>/Comprar/i.test(e.innerText||''));x&&x.click()}");w(1300)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().width>0).find(e=>/^Finalizar compra$/i.test((e.innerText||'').trim()));if(x)x.click();else document.querySelector('#bagbtn').click()}");w(1500)
    for k in ('prosseguir','irpag'):
        pg.evaluate("(k)=>{const x=document.querySelector('#layer [data-cta='+k+']');x&&x.click()}",k);w(1300)
    pg.evaluate("()=>{const x=document.querySelector('#layer [data-cta=pg][data-v=alias]');x&&x.click()}");w(1200)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}')
    pg.locator('#ppz').click();pg.keyboard.type('983123456',delay=15);pg.locator('#ppd').click();pg.keyboard.type('4567890',delay=15);w(300);return b,pg,w
with sync_playwright() as pw:
    b,pg,w=cadastro(pw);oh=comum.olho(pg);print('63d hoje:',pg.evaluate("()=>[document.getElementById('cfd').value,document.querySelector('label[for=cfd]').textContent]"));pg.screenshot(path=T+'d_h.png');b.close()
    b,pg,w=cadastro(pw);pg.evaluate(P);w(300);pg.evaluate("()=>document.getElementById('cfd').scrollIntoView({block:'center'})");w(300);op=comum.olho(pg);pg.screenshot(path=T+'d_p.png');b.close();print('63d falhas novas:',sorted(op-oh)[:4])
    KH=600
    b,pg,w=pagar(pw);pg.evaluate("()=>{const d=document.getElementById('ppd');d.focus();d.scrollIntoView({block:'center'})}");w(400);pg.screenshot(path=T+'e_h0.png');b.close()
    b,pg,w=pagar(pw);pg.set_viewport_size({'width':390,'height':844-300});w(400);pg.evaluate("()=>{const d=document.getElementById('ppd');d.focus();d.scrollIntoView({block:'center'})}");w(400);pg.screenshot(path=T+'e_p0.png');b.close()
    kb=teclado(780,KH)
    A=Image.open(T+'e_h0.png').convert('RGB');A.paste(kb,(0,A.size[1]-KH));A.save(T+'e_h.png')
    Pm=Image.open(T+'e_p0.png').convert('RGB');C=Image.new('RGB',(780,1688),'#fff');C.paste(Pm,(0,0));C.paste(kb,(0,1688-KH));C.save(T+'e_p.png')
comum.prancha('63d-site-complete-seus-dados-cedula.jpg','Esboço 63d · Site · Complete seus dados (depois de criar a conta)',['Hoje: a cédula 4567890 ganha um traço e vira "456789-0", como se fosse RUC.','Proposta: o mesmo seletor Cédula | RUC que já está no pagamento; a cédula fica com pontos e sem traço.'],T+'d_h.png',T+'d_p.png')
comum.prancha('63e-site-teclado-no-iphone.jpg','Esboço 63e · Site · Pagamento · teclado no iPhone',['Hoje (iPhone): a tela não encolhe e o teclado cobre "Confirmar e pagar". No Android isso já foi corrigido.','Proposta: no iPhone a tela também encolhe até o teclado e o botão fica acima dele.'],T+'e_h.png',T+'e_p.png')
