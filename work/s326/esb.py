# S326: (1) Preços sem emoji nos controles e nas linhas; (2) Compartilhar: botão principal no padrão B1 do app (contorno rosa, regra do dono de 08/11) × o cheio publicado na v520. App real, Hoje × Proposta.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s326/';T='/tmp/s326/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
IC={'⬆':'<path d="M12 19V5M6 11l6-6 6 6"/>','⬇':'<path d="M12 5v14M6 13l6 6 6-6"/>','🖤':'<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z"/>','📦':'<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'}
PRECOS="""(IC)=>{const v=document.querySelector('.view:not([hidden])');
  v.querySelectorAll('.cntB button').forEach(b=>{b.textContent=b.textContent.replace(/^[^A-Za-zÀ-ú]+/,'')});
  v.querySelectorAll('.cntL>span').forEach(s=>{const k=Object.keys(IC).find(x=>s.textContent.includes(x));if(!k)return;s.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[k]+'</svg>';s.style.cssText='display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;border:1px solid var(--line);color:var(--sub);flex:none'});return 'ok'}"""
B1="()=>{const s=document.createElement('style');s.textContent='#ebEnv.ebEnv{background:none!important;box-shadow:none!important;border:1px solid var(--pri-bd)!important;color:var(--pri)!important}';document.head.appendChild(s);return 'ok'}"
def atalho(pg,w,n): pg.evaluate("n=>{const t=[...document.querySelectorAll('#v-inicio .tl')].find(b=>b.innerText.trim().split('\\n')[0]===n);t.scrollIntoView({block:'center'});t.click()}",n);w(1500)
def tela(pw,qual,escuro,prop):
    if qual=='precos':
        b,pg,w=base.abre(pw,'inicio',escuro);atalho(pg,w,'Preços')
        if prop: print('  inj:',pg.evaluate(PRECOS,IC));w(400)
    else:
        b,pg,w=base.abre(pw,'vendas',escuro);pg.click('#cjSh');w(600);pg.evaluate("()=>{[...document.querySelectorAll('#v-vendas .pcard')].slice(1,2).forEach(x=>x.click())}");w(500);pg.evaluate("()=>{const g=document.querySelector('.ebGo');g&&g.click()}");w(1300)
        if prop: print('  inj:',pg.evaluate(B1));w(400)
    p=T+'%s_%d_%d.png'%(qual,escuro,prop);pg.screenshot(path=p)
    ach=set(map(str,pg.evaluate(open('/home/claude/lafouch/work/kit/centro.js').read())))|set(str((f['r'],f.get('ex'))) for f in (pg.evaluate(open('/home/claude/lafouch/work/kit/olho.js').read()) or []))
    b.close();return p,ach
def prancha(nome,titulo,sub,cols):
    ims=[Image.open(p) for p,_ in cols];w,h=ims[0].size;g=40;top=250;W=g+len(ims)*(w+g);H=top+h+g
    S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(44,True),fill='#1d1418');d.text((g,98),sub,font=F(27),fill='#55484f')
    for i,(im,(p,r)) in enumerate(zip(ims,cols)):
        x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        a,fa=tela(pw,'precos',esc,0);b,fb=tela(pw,'precos',esc,1);print('precos',tema,'achados novos:',sorted(fb-fa) or 'nenhum')
        prancha('7-precos-%s.jpg'%tema,'Preços · tema '+tema,'Sem emoji: botões só com texto; nas linhas, ícone de traço fino no lugar do emoji.',[(a,'HOJE'),(b,'PROPOSTA')])
        a,fa=tela(pw,'comp',esc,0);b,fb=tela(pw,'comp',esc,1)
        prancha('8-compartilhar-botao-%s.jpg'%tema,'Compartilhar · botão principal · tema '+tema,'Publicado ontem: cheio. Sua regra de 08/11: todo botão principal em contorno rosa fino (como "Começar", "Aceitar tudo").',[(a,'PUBLICADO (cheio)'),(b,'REGRA DE 08/11 (contorno)')])
