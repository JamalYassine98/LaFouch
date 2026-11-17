# S408 · esboços 78a–78g (pedido do dono 17/11 13:23): aba Exclusivo de presentes em cada temática, com "✦ De presente" EM CIMA da peça. Nada implementado.
E=open('/home/claude/lafouch/work/s408/esb.py').read();exec(E[:E.index('with sync_'+'playwright() as pw')])
import json,base64
L=json.load(open('/tmp/s405/c.json'))  # cartões do 71e (mesma ordem de TEMAS abaixo)
U2=lambda f:'data:image/png;base64,'+base64.b64encode(open('/home/claude/catalogo/media/email/'+f,'rb').read()).decode()
TEMAS=[('','sem evento','preto'),('natal','Natal','natal'),('halloween','Halloween','halloween'),('maes','Dia das Mães','maes'),('pais','Dia dos Pais','pais'),('anonovo-d','Ano-Novo','anonovo'),('bf','Black Friday','bf')]
CSS+=""".card .gpt{position:absolute;top:10px;left:10px;z-index:4;padding:4px 10px;border-radius:999px;background:#17121a;color:#e9d3a6;font:600 12.5px Inter,system-ui,sans-serif;letter-spacing:.04em;border:1px solid rgba(214,178,116,.6)}"""
CARD="""(o)=>{const h=document.querySelector('.exh');const t=document.createElement('div');t.innerHTML=o.html;const c=t.firstChild;c.style.margin='0 0 18px';c.style.maxWidth='none';h.replaceWith(c);c.classList.add('exh');
 [...document.querySelectorAll('#grid .card')].forEach(k=>{if(k.style.display==='none')return;k.querySelectorAll('.sel1,.edb,.evse').forEach(x=>x.style.display='none');const pr=k.querySelector('.pr');if(pr)pr.style.display='none';k.style.position='relative';const s=document.createElement('span');s.className='gpt';s.textContent='✦ De presente';s.style.background=o.pb;s.style.color=o.pc;s.style.borderColor=o.pf;k.appendChild(s);const f=k.querySelector('.fav');if(f){const kr=k.getBoundingClientRect(),fr=f.getBoundingClientRect(),sr=s.getBoundingClientRect();const bw=parseFloat(getComputedStyle(k).borderLeftWidth)||0;s.style.top=(fr.top-kr.top-bw+fr.height/2-sr.height/2)+'px';s.style.left=(kr.right-fr.right-bw+8)+'px'}})}"""
PAL={'preto':['#17121a','#e9d3a6','rgba(214,178,116,.6)'],'natal':['#1f5c3a','#ffd9a0','rgba(255,217,160,.6)'],'halloween':['#2a1530','#f08a3c','rgba(226,113,29,.75)'],'maes':['#a83a64','#ffe9f0','rgba(255,209,223,.7)'],'pais':['#1e2f4d','#e0b878','rgba(224,184,120,.65)'],'anonovo':['#f6f2ea','#8d703e','rgba(168,133,74,.85)'],'bf':['#111111','#ffffff','rgba(225,29,72,.95)']}
def dados(h):
    for f in os.listdir('/home/claude/catalogo/media/email/'):
        if f.startswith('cartao-'): h=h.replace('https://lafouch.com/media/email/'+f,U2(f))
    return h.replace('font:500 11px Arial','font:500 12.5px Inter,Arial')
def abre(ev):
    b,pg,w=comum2.site(pw,extra=("document.documentElement.setAttribute('data-ev','%s')"%ev if ev else ''))
    if ev: pg.evaluate("(e)=>document.documentElement.setAttribute('data-ev',e)",ev);w(400)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}'+CSS);pg.evaluate('(a)=>{window.__lgo=a[0];window.__lgn=a[1]}',[U('/home/claude/catalogo/media/email/cartao-ouro.png'),U('/home/claude/catalogo/media/email/cartao-ev-natal.png')]);return b,pg,w
with sync_playwright() as pw:
    for i,(ev,nome,pk) in enumerate(TEMAS):
        b,pg,w=abre(ev);pg.evaluate(VIT);w(1600);pg.set_viewport_size({'width':390,'height':1300});w(300);pg.evaluate("()=>{const g=document.getElementById('grid');g.scrollIntoView({block:'start'});window.scrollBy(0,-170)}");w(300);oh=comum.olho(pg);pg.screenshot(path=T+'t%d_h.png'%i);b.close()
        b,pg,w=abre(ev);pg.evaluate(VIT);w(1600);pg.evaluate(PRECOS);pg.evaluate(ABA2,2);w(300)
        pg.evaluate(GIFTTAB,{'lim':100,'vip':0,'txt':'Escolha 1 presente <b>até R$ 100</b>, o valor do óculos no seu carrinho. Peças em OFERTA também podem ser presente.'});w(300)
        p=PAL[pk];pg.evaluate(CARD,{'html':dados(L[i]['h']),'pb':p[0],'pc':p[1],'pf':p[2]});w(400)
        pg.evaluate("()=>{[...document.querySelectorAll('#grid .card .gp')].forEach(x=>x.closest('.pr')&&(x.closest('.pr').style.display='none'))}")
        pg.set_viewport_size({'width':390,'height':1300});w(300);pg.evaluate(TOPO.replace(".exh",".exh"));w(300);op=comum.olho(pg);pg.screenshot(path=T+'t%d_p.png'%i);b.close();print(nome,'falhas novas:',sorted(op-oh)[:4])
        P('78%s-site-exclusivo-presente-%s.jpg'%('abcdefg'[i],(ev or 'sem-evento').split('-')[0]),'Esboço 78%s · Site · Aba Exclusivo de presentes · %s'%('abcdefg'[i],nome),['Hoje: catálogo comum'+(' na temática '+nome if ev else ' (sem evento)')+'.','Proposta: o cartão do presente na cor da temática (71e); "✦ De presente" EM CIMA de cada peça, alinhado com o coração e um pouco mais para dentro, nas cores da temática; só peças até o valor do óculos pago (R$ 100).'],T+'t%d_h.png'%i,T+'t%d_p.png'%i)
