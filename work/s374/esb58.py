# S374 · esboço 58 (aprovado como ideia em 15/11, AUDITORIA item 8): telas compridas com blocos fechados, como no Giro.
# 58a Despesas (4.116 px) · 58b Histórico (5.771 px). Tela inteira, Hoje × Proposta na mesma escala.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;T='/tmp/s374/';OUT='/home/claude/lafouch/work/s374/'
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
FOLD="""(t,h)=>'<button type="button" style="display:flex;justify-content:space-between;align-items:center;gap:8px;width:100%;text-align:left;background:none;border:0;padding:14px;color:inherit;min-height:48px"><span style="min-width:0"><b style="font-size:15px">'+t+'</b><span class="hint" style="display:block;margin:2px 0 0">'+h+'</span></span><span aria-hidden="true" style="font-size:20px;color:var(--mute)">⌄</span></button>'"""
DESP="""()=>{const FOLD="""+FOLD+""";let n=0;
 document.querySelectorAll('#v-desp .card.cdel').forEach(c=>{const chk=c.querySelector('.chk');const nome=(c.querySelector('.paga-nome')||c.querySelector('b')||{}).textContent||'';const tag=(c.querySelector('.cell')||{}).textContent||'';
  const v=(c.querySelector('input[data-in=exp]')||{}).value||'';const dia=(c.querySelector('input[data-exd]')||{}).value||'';
  c.innerHTML='';c.style.padding='6px 14px';const r=document.createElement('div');r.style.cssText='display:flex;align-items:center;gap:10px;min-height:48px';
  if(chk)r.appendChild(chk);const tx=document.createElement('div');tx.style.cssText='flex:1;min-width:0';tx.innerHTML='<b'+(chk&&chk.classList.contains('on')?' class="paga-nome"':'')+'>'+nome+'</b><span class="hint" style="display:block;margin:2px 0 0">'+tag+(dia?' · vence dia '+dia:'')+'</span>';r.appendChild(tx);
  const val=document.createElement('b');val.style.cssText='font-variant-numeric:tabular-nums;white-space:nowrap';val.textContent='G$ '+v;r.appendChild(val);const ch=document.createElement('span');ch.setAttribute('aria-hidden','true');ch.style.cssText='font-size:20px;color:var(--mute)';ch.textContent='⌄';r.appendChild(ch);c.appendChild(r);n++});
 document.querySelectorAll('#v-desp .card.col').forEach(c=>{const t=(c.innerText||'').trim().split('\\n')[0];
  if(/^Imprevistos do mês/.test(t)){c.innerHTML=FOLD('Imprevistos do mês','O que aconteceu fora do previsto · registrar');c.style.padding='0';n++}
  if(/^Nova despesa/.test(t)){c.innerHTML=FOLD('+ Nova despesa','Água, luz, aluguel… fixa ou variável');c.style.padding='0';n++}});
 return n}"""
HIST="""()=>{const FOLD="""+FOLD+""";const ds=[...document.querySelectorAll('#v-hist .pcard[data-act=opendia]')];const hoje=new Date();hoje.setHours(0,0,0,0);const lim=new Date(hoje);lim.setDate(lim.getDate()-((lim.getDay()+6)%7)-7);
 const gs=new Map();const fmt=n=>'G$ '+Math.round(n).toLocaleString('de-DE');
 ds.forEach(d=>{const id=d.getAttribute('data-id');const dt=new Date(id+'T00:00:00');if(dt>=lim)return;const seg=new Date(dt);seg.setDate(seg.getDate()-((seg.getDay()+6)%7));const k=seg.toISOString().slice(0,10);
  const v=+((d.innerText.match(/G\\$ ([\\d.]+)/)||['','0'])[1].replace(/\\./g,''));const nv=+((d.innerText.match(/(\\d+) venda/)||['','0'])[1]);
  if(!gs.has(k))gs.set(k,{seg,v:0,n:0,dias:0,el:d});const g=gs.get(k);g.v+=v;g.n+=nv;g.dias++;if(g.el!==d)d.remove()});
 gs.forEach(g=>{const dom=new Date(g.seg);dom.setDate(dom.getDate()+6);const f=x=>String(x.getDate()).padStart(2,'0')+'/'+String(x.getMonth()+1).padStart(2,'0');
  const c=document.createElement('div');c.className='card';c.style.padding='0';c.innerHTML=FOLD('Semana '+f(g.seg)+' a '+f(dom),fmt(g.v)+' · '+g.n+' venda(s) · '+g.dias+' dia(s)');g.el.replaceWith(c)});
 return [ds.length,gs.size]}"""
def prancha2(nome,titulo,sub,a,b,ha,hb):
    # tela inteira cortada em colunas (1.500 px de tela cada), Hoje em cima e Proposta embaixo, mesma escala
    k=0.6;CH=1800;g=40;gc=24
    def cols(p):
        im=Image.open(p).convert('RGB');im=im.resize((int(im.width*k),int(im.height*k)));n=-(-im.height//CH)
        return [im.crop((0,i*CH,im.width,min(im.height,(i+1)*CH))) for i in range(n)]
    A=cols(a);B=cols(b);cw=A[0].width;larg=max(1500,g+max(len(A),len(B))*(cw+gc))
    _d=ImageDraw.Draw(Image.new('RGB',(4,4)));ns=[]
    for l in ' '.join(sub).split('|'):
        a_=''
        for q in l.split(' '):
            if _d.textlength((a_+' '+q).strip(),font=F(25))>larg-2*g and a_: ns.append(a_);a_=q
            else: a_=(a_+' '+q).strip()
        ns.append(a_)
    sub=ns
    top=96+len(sub)*36+30;S=Image.new('RGB',(max(larg,1500),top+2*(70+CH)+2*g),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,34),titulo,font=F(40,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,96+i*36),l,font=F(25),fill='#55484f')
    y=top
    for i,(L,r) in enumerate(((A,'HOJE · %d px de tela (continua da esquerda para a direita)'%ha),(B,'PROPOSTA · %d px de tela'%hb))):
        d.text((g,y),r,font=F(32,True),fill='#8d3a69' if i else '#1d1418');y+=56
        for j,im in enumerate(L):
            x=g+j*(cw+gc);S.paste(im,(x,y));d.rectangle([x-1,y-1,x+im.width,y+im.height],outline='#cfc6cb')
        y+=CH+g
    S=S.crop((0,0,S.width,y));S.save(OUT+nome,quality=86);print(' ',nome,S.size)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,tela,js,tit,sub in (('58a-app-despesas-blocos-fechados','desp',DESP,'App · Despesas com as contas fechadas',['Hoje: cada conta abre com campo de valor, dia, Salvar, lixeira e duas notas; "Imprevistos" e "Nova despesa" ficam sempre abertos.','|Proposta: cada conta é uma linha (pagar ✓ · nome · tipo e vencimento · valor ⌄); tocar abre a edição como hoje. Imprevistos e Nova','despesa viram linhas que abrem. Total, "cada peça separa", Contas para pagar e Por grupo ficam como estão.']),
                                     ('58b-app-historico-semanas-fechadas','hist',HIST,'App · Histórico com as semanas fechadas',['Hoje: todos os dias do mês, um cartão grande por dia.','|Proposta: esta semana e a passada ficam abertas como hoje; as semanas anteriores viram uma linha (total · vendas · dias ⌄) que abre os dias dela.'])):
            fs=[];hs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,tela,esc);w(1800)
                if prop: oo.append(olho(pg));print('  ',pg.evaluate(js));w(600)
                hs.append(pg.evaluate("()=>document.documentElement.scrollHeight"));oo.append(olho(pg));pg.evaluate("()=>scrollBy(0,700)");w(300);oo[-1]|=olho(pg);pg.evaluate("()=>scrollTo(0,0)");w(200)
                p=T+'%s_%d_%d.png'%(nome[:3],esc,prop);pg.add_style_tag(content='#mainnav,#sidenav{visibility:hidden!important}');w(100);pg.screenshot(path=p,full_page=True);fs.append(p);b.close()
            print(nome,tema,'altura',hs,'achados novos:',novos(oo[0]|oo[1],oo[2]))
            prancha2('%s-%s.jpg'%(nome,tema),tit+' · tema '+tema,sub,fs[0],fs[1],hs[0],hs[1])
