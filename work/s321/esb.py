# S321: esboços do app (telas reais, tema escuro e claro): Pedidos com as abas padrão do app e Compartilhar legível com um botão cheio. Hoje × Proposta, um arquivo por tela e por tema.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s321/';T='/tmp/s321/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
# as 49 regras que usam cores que NÃO existem no app (--card, --mu, --ac…) caem no branco; a correção é dar a essas cores o valor das cores reais do app
APELIDOS=":root{--card:var(--panel2);--card2:var(--panel);--mu:var(--mute);--mut:var(--mute);--muted:var(--mute);--ac:var(--accent-fg);--acc:var(--accent-fg);--tx:var(--fg);--text:var(--fg);--soft:var(--accent-soft)}"
ABAS=".s21t{display:flex;gap:22px;position:relative;border-bottom:1px solid var(--line);margin:2px 0 14px;overflow:visible;padding:0;background:none;border-radius:0}.s21t button{flex:none;min-height:44px;padding:10px 0;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;color:var(--sub);font-size:15px;font-weight:500;display:inline-flex;align-items:center;gap:7px}.s21t button.on{color:var(--accent-fg);font-weight:500}.s21t button b{background:none!important;padding:0!important;font-size:13px;font-weight:500;color:var(--mute)}.s21t i.lfLinha{position:absolute;bottom:-1px;height:2px;border-radius:2px;background:var(--accent)}"
LINHA="(sel)=>{const c=document.querySelector(sel),o=c.querySelector('button.on'),i=document.createElement('i');i.className='lfLinha';c.appendChild(i);const a=c.getBoundingClientRect(),b=o.getBoundingClientRect();i.style.left=(b.left-a.left)+'px';i.style.width=b.width+'px'}"
PED="()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);const c=document.querySelector('.pdSeg');c.className='s21t';c.id='s21p';(%s)('#s21p');return 'ok'}"%(ABAS,LINHA)
COMP="()=>{const s=document.createElement('style');s.textContent=%r+%r+'.s185G button{background:var(--panel2)!important;border:1px solid var(--line)!important;color:var(--fg)!important;padding:12px!important}.s185G button.on{border-color:var(--accent)!important;background:var(--accent-soft)!important}.s185G small{color:var(--mute)!important}.s21go{border:0!important;background:linear-gradient(135deg,#b4528a,#a2447c 55%%,#7d3361)!important;color:#fff!important;box-shadow:0 6px 16px rgba(162,68,124,.35)!important}';document.head.appendChild(s);const c=document.querySelector('.s185Seg');c.className='s21t';c.id='s21c';(%s)('#s21c');document.querySelectorAll('.s185G b').forEach(b=>{b.textContent=b.textContent.replace(/^[^A-Za-zÀ-ú]+/,'')});const g=[...document.querySelectorAll('.ebJn button')].find(b=>/Enviar no/.test(b.innerText));if(g)g.classList.add('s21go');return 'ok'}"%(APELIDOS,ABAS,LINHA)
def comp(pg,w):
    pg.click('#cjSh');w(600);pg.evaluate("()=>{[...document.querySelectorAll('#v-vendas .pcard')].slice(1,2).forEach(x=>x.click())}");w(500);pg.evaluate("()=>{const g=document.querySelector('.ebGo');g&&g.click()}");w(1300)
def tela(pw,qual,escuro,prop):
    b,pg,w=base.abre(pw,'ped' if qual=='ped' else 'vendas',escuro)
    if qual=='comp': comp(pg,w)
    if prop: print('  inj:',pg.evaluate(PED if qual=='ped' else COMP));w(500)
    p=T+'%s_%d_%d.png'%(qual,escuro,prop);pg.screenshot(path=p)
    # contraste do texto dos botões da janela/abas (mínimo 4,5)
    r=pg.evaluate("""(q)=>{const lum=c=>{const m=c.match(/[\\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2])};
      const fundo=e=>{for(let x=e;x;x=x.parentElement){const b=getComputedStyle(x).backgroundColor,m=b.match(/[\\d.]+/g);if(m&&(m.length<4||+m[3]>.5))return b}return 'rgb(255,255,255)'};
      return [...document.querySelectorAll(q)].filter(e=>e.offsetParent).map(e=>{const a=lum(getComputedStyle(e).color),b=lum(fundo(e));return (e.innerText||'').trim().slice(0,18)+' '+((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(1)})}""",'.s185G b,.s185G small,.s185Seg button,#s21c button,#s21p button,.pdSeg button' )
    b.close();return p,r
def prancha(nome,titulo,sub,cols):
    ims=[Image.open(p) for p,_ in cols];w,h=ims[0].size;g=40;top=250;W=g+len(ims)*(w+g);H=top+h+g
    S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(44,True),fill='#1d1418');d.text((g,98),sub,font=F(27),fill='#55484f')
    for i,(im,(p,r)) in enumerate(zip(ims,cols)):
        x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome)
with sync_playwright() as pw:
    for qual,tit,sub in (('ped','Pedidos online','As três situações viram as abas padrão do app (as mesmas de Produtos · Fornecedores · Reposição).'),
                         ('comp','Compartilhar','Tudo legível; "Tipo de envio" nas abas padrão; opções sem emoji; um botão cheio.')):
        for esc,tema in ((True,'escuro'),(False,'claro')):
            a,ra=tela(pw,qual,esc,0);b,rb=tela(pw,qual,esc,1);print(qual,tema,'contraste hoje:',ra,'| proposta:',rb)
            prancha('%s-%s.jpg'%('1-pedidos' if qual=='ped' else '2-compartilhar',tema),tit+' · tema '+tema,sub,[(a,'HOJE'),(b,'PROPOSTA')])
