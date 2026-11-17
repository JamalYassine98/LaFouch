# S408 · esboços 80a–80g (17/11 13:52): Favoritos em cada temática — linha do cartão pessoal em dourado; linha do cupom do evento na cor de destaque da temática. Nada implementado.
E=open('/home/claude/lafouch/work/s408/esb3.py').read();exec(E[:E.index('with sync_'+'playwright() as pw')])
P=comum.prancha
TEMAS=[('','sem evento',''),('natal','Natal','Natal'),('halloween','Halloween','Halloween'),('maes','Dia das Mães','Dia das Mães'),('pais','Dia dos Pais','Dia dos Pais'),('anonovo-d','Ano-Novo','Ano-Novo'),('bf','Black Friday','Black Friday')]
LIN2="""(ev)=>{const row=document.querySelector('#layer .fvi');const bg=getComputedStyle(row).backgroundColor;const m=bg.match(/\\d+/g).map(Number);const esc=(m[0]*.299+m[1]*.587+m[2]*.114)<128;
 const ouro=esc?'#e9d3a6':'#8a6a33';const ac=getComputedStyle(document.documentElement).getPropertyValue('--ac').trim()||'#8d3a69';
 const hx=c=>{const r=c.replace('#','');return [0,2,4].map(i=>parseInt(r.substr(i,2),16))};const L=a=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(a[0])+.7152*f(a[1])+.0722*f(a[2])};
 const cr=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};let A=hx(ac);let n=0;while(cr(A,m)<4.5&&n<40){A=A.map(v=>Math.round(v*.94));n++}const ac2='#'+A.map(v=>v.toString(16).padStart(2,'0')).join('');
 const V={KIT3C:['✦ R$ 90 com o seu cartão',ouro]};if(ev)V.SL2210=['✦ R$ 86 com o cupom do evento',ac2];else V.SL2210=['✦ R$ 86 com o seu cartão',ouro];
 [...document.querySelectorAll('#layer .fvi')].forEach(r=>{const k=r.querySelector('.cit small').textContent.trim();if(V[k]){const s=document.createElement('span');s.className='fvc';s.textContent=V[k][0];s.style.color=V[k][1];r.querySelector('.pu').appendChild(s)}});return [esc,ac,ac2,+cr(hx(ouro),m).toFixed(2),+cr(A,m).toFixed(2)]}"""
def abre2(ev):
    b,pg,w=comum2.site(pw,extra=FAV+(";document.documentElement.setAttribute('data-ev','%s')"%ev if ev else ''))
    if ev: pg.evaluate("(e)=>document.documentElement.setAttribute('data-ev',e)",ev);w(400)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}'+CSS);pg.evaluate(ABRE);w(1500);pg.evaluate(TAB);w(1000);return b,pg,w
with sync_playwright() as pw:
    for i,(ev,nome,cup) in enumerate(TEMAS):
        b,pg,w=abre2(ev);oh=comum.olho(pg);pg.screenshot(path=T+'v%d_h.png'%i);b.close()
        b,pg,w=abre2(ev);print(nome,pg.evaluate(LIN2,cup));w(400);op=comum.olho(pg);pg.screenshot(path=T+'v%d_p.png'%i);b.close();print('  falhas novas:',sorted(op-oh)[:4])
        P('80%s-site-favoritos-%s.jpg'%('abcdefg'[i],(ev or 'sem-evento').split('-')[0]),'Esboço 80%s · Site · Favoritos · %s'%('abcdefg'[i],nome),['Hoje: só o preço normal.','Proposta: cartão pessoal = linha dourada'+('; cupom do evento = linha na cor de destaque de '+nome+' (escurecida quando preciso, para ler bem)' if ev else ' (sem evento, só cartões pessoais)')+'. Valores de exemplo.'],T+'v%d_h.png'%i,T+'v%d_p.png'%i)
