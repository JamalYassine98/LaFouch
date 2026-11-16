# S374 · esboço 64 (dono 16/11 11:54): Giro e preços › Preços no padrão de luxo + abrir/fechar como na Apple.
# Muda: (1) "Preço automático" 1 vez só (era 3: linha que abre, cartão com a chave e faixa de estado);
# (2) Pré-graduados entram no Contador (sai o bloco "Pré-graduados · preço fixo"); (3) uma frase só para "esta semana"
# (a decisão das tabelas e o "nenhum ajuste" não se contradizem mais); (4) a meta entra em "Contas, taxas e meta";
# (5) os blocos abrem DENTRO do próprio cartão, a altura cresce suave (0,38 s, curva da Apple), a seta gira, o conteúdo sobe 6 px.
# Saídas: 64a (tela inteira Hoje × Proposta, claro/escuro), 64b (quadros da animação), 64c (vídeo MP4 curto). App real, dados de teste.
import sys,os,subprocess,glob;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;T='/tmp/s374/';OUT='/home/claude/lafouch/work/s374/'
import kit
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
PREP="""()=>{const L=window.__LF,S=L.S;S.pAuto=S.pAuto||{};S.pAuto.on=true;S.dTab='prec';S.dfold={pau:true,cfg:true,pgr:true,abp:false};L.setView('dash');return !!S.pAuto.on}"""
CSS="""
.fx64{padding:0!important;overflow:hidden}
.fx64>.fxH{display:flex;justify-content:space-between;align-items:center;gap:8px;width:100%;text-align:left;background:none;border:0;padding:16px 18px;color:inherit;min-height:56px;font:inherit;cursor:pointer}
.fx64>.fxH b{display:block;font-size:16px;font-weight:600}.fx64>.fxH small{display:block;color:var(--mute);font-size:13.5px;margin-top:3px}
.fx64>.fxH i{font-style:normal;font-size:20px;color:var(--mute);transition:transform .38s cubic-bezier(.32,.72,0,1);display:inline-block}
.fx64.on>.fxH i{transform:rotate(180deg)}
.fx64>.fxB{height:0;overflow:hidden}
.fx64>.fxB>.fxI{padding:0 18px 18px;opacity:0;transform:translateY(-6px)}
.fx64>.fxB .card{background:none!important;box-shadow:none!important;border:0!important;padding:14px 0 0!important;margin:0!important;border-top:1px solid var(--line2,var(--line))!important;border-radius:0!important}
.pa64{display:flex;align-items:center;gap:14px}
"""
PROP="""()=>{const B=document.getElementById('dtabBody');const kids=[...B.children];const txt=e=>(e.innerText||'').trim();
 const cnt=B.querySelector('.cnt');const paCard=document.getElementById('paCard');const paEst=B.querySelector('.paEst');
 const meta=kids.find(e=>/^Lucro do mês/.test(txt(e)));const semana=kids.find(e=>/^Esta semana/.test(txt(e)));
 const iP=kids.findIndex(e=>/^Pré-graduados/.test(txt(e))),iA=kids.findIndex(e=>/^Preços para corrigir/.test(txt(e))),iC=kids.findIndex(e=>/^Contas, taxas e meta/.test(txt(e)));
 const corpo=(a,b)=>kids.slice(a+1,b<0?kids.length:b);
 const pgr=corpo(iP,iA),abp=corpo(iA,iC),cfg=corpo(iC,-1);const V=document.getElementById('v-dash');let sib=B.nextElementSibling;const extra=[];while(sib){if(sib.matches('section.card'))extra.push(sib);sib=sib.nextElementSibling}
 const resumo=e=>{const s=e&&e.querySelector('[data-act=dfold] .hint');return s?s.textContent:''};
 const rA=resumo(kids[iA]),rP=resumo(kids[iP]);
 // (2) Pré-graduados no Contador: mais uma linha em "Para decidir"
 const D=cnt.querySelector('.cntD');const tpl=[...D.querySelectorAll('.cntL')].pop();const pl=tpl.cloneNode(true);pl.className='cntL';
 pl.querySelector('b').textContent='Pré-graduados · preço por linha';pl.querySelector('small').textContent=(rP||'Econômica G$ 25.000 · Luxo G$ 100.000')+' · o contador confere a margem';
 const em=pl.querySelector('em');if(em)em.textContent='ajustar';const ac=pl.querySelector('.lxT,[data-act]');
 const ult=D.querySelector('.cntB');D.insertBefore(pl,ult||null);
 // (1) Preço automático uma vez: só o cartão com a chave, com o estado e a semana na mesma frase
 const sm=paCard.querySelector('small');const on=/ligado/.test(sm.textContent)&&!/desligado/.test(sm.textContent);
 sm.textContent=on?'ligado · revisa toda segunda · nenhum preço mudou nesta semana':'desligado · você define os preços à mão';
 const fold=(id,tit,sub,els)=>{const s=document.createElement('section');s.className='card fx64';s.dataset.fx=id;s.innerHTML='<button type="button" class="fxH" aria-expanded="false"><span><b>'+tit+'</b><small>'+sub+'</small></span><i aria-hidden="true">⌄</i></button><div class="fxB"><div class="fxI"></div></div>';
  const I=s.querySelector('.fxI');els.forEach(e=>I.appendChild(e));return s};
 // (4) a meta dentro de "Contas, taxas e meta"
 const fA=fold('abp','Preços para corrigir',rA||'nenhum',abp);
 const fC=fold('cfg','Contas, taxas e meta','contas do mês, formas de pagamento e a meta',[meta].concat(cfg).concat(extra).filter(Boolean));
 const lbl=kids.find(e=>e.classList.contains('lbl'));
 B.innerHTML='';[cnt,lbl,paCard,fA,fC].filter(Boolean).forEach(e=>B.appendChild(e));
 // (5) abrir como na Apple
 const EZ='cubic-bezier(.32,.72,0,1)';
 B.querySelectorAll('.fx64').forEach(s=>{s.querySelector('.fxH').onclick=()=>{const b=s.querySelector('.fxB'),I=s.querySelector('.fxI'),ab=!s.classList.contains('on');const h=I.scrollHeight;
  s.classList.toggle('on',ab);s.querySelector('.fxH').setAttribute('aria-expanded',ab);
  b.animate([{height:(ab?0:h)+'px'},{height:(ab?h:0)+'px'}],{duration:ab?380:260,easing:EZ,fill:'forwards'});
  I.animate([{opacity:ab?0:1,transform:'translateY('+(ab?-6:0)+'px)'},{opacity:ab?1:0,transform:'translateY('+(ab?0:-6)+'px)'}],{duration:ab?380:200,easing:EZ,fill:'forwards',delay:ab?40:0})}});
 const nosso=e=>e.classList.contains('cnt')||e.classList.contains('lbl')||e.id==='paCard'||e.classList.contains('fx64');
 const mv=()=>{[...B.children].forEach(e=>{if(!nosso(e))fC.querySelector('.fxI').appendChild(e)});let x=B.nextElementSibling;while(x){const n=x.nextElementSibling;if(x.matches('section.card'))fC.querySelector('.fxI').appendChild(x);x=n}};new MutationObserver(mv).observe(B,{childList:true});new MutationObserver(mv).observe(V,{childList:true});
 return [!!meta,!!semana,pgr.length,abp.length,cfg.length,on]}"""
def tela(pg,w,prop):
    pg.evaluate(PREP);w(1300)
    if prop:
        pg.add_style_tag(content=CSS);print('   prop',pg.evaluate(PROP));w(500)
        print('   soltos',pg.evaluate("()=>{const B=document.getElementById('dtabBody'),I=B.querySelector('.fx64[data-fx=cfg] .fxI');let n=0;[...B.children].forEach(e=>{if(!e.classList.contains('cnt')&&!e.classList.contains('lbl')&&e.id!=='paCard'&&!e.classList.contains('fx64')){I.appendChild(e);n++}});return n}"));w(200)
def cols(p,k=0.6,CH=1800):
    im=Image.open(p).convert('RGB');im=im.resize((int(im.width*k),int(im.height*k)));n=-(-im.height//CH)
    return [im.crop((0,i*CH,im.width,min(im.height,(i+1)*CH))) for i in range(n)]
def prancha64(nome,titulo,sub,a,b,ha,hb):
    A=cols(a);B=cols(b);cw=A[0].width;g=40;gc=24;CH=1800;larg=max(1500,g+max(len(A),len(B))*(cw+gc))
    _d=ImageDraw.Draw(Image.new('RGB',(4,4)));ns=[]
    for l in sub:
        a_=''
        for q in l.split(' '):
            if _d.textlength((a_+' '+q).strip(),font=F(25))>larg-2*g and a_: ns.append(a_);a_=q
            else: a_=(a_+' '+q).strip()
        ns.append(a_)
    top=96+len(ns)*36+30;S=Image.new('RGB',(larg,top+2*(70+CH)+2*g),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,34),titulo,font=F(40,True),fill='#1d1418')
    for i,l in enumerate(ns): d.text((g,96+i*36),l,font=F(25),fill='#55484f')
    y=top
    for i,(L,r) in enumerate(((A,'HOJE · %d px de tela (continua da esquerda para a direita)'%ha),(B,'PROPOSTA · %d px de tela (blocos fechados; abrem como na Apple)'%hb))):
        d.text((g,y),r,font=F(32,True),fill='#8d3a69' if i else '#1d1418');y+=56
        for j,im in enumerate(L): x=g+j*(cw+gc);S.paste(im,(x,y));d.rectangle([x-1,y-1,x+im.width,y+im.height],outline='#cfc6cb')
        y+=CH+g
    S=S.crop((0,0,S.width,y));S.save(OUT+nome,quality=86);print(' ',nome,S.size)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];hs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(1200);tela(pg,w,prop)
            oo.append(olho(pg));pg.evaluate("()=>scrollBy(0,900)");w(300);oo[-1]|=olho(pg);pg.evaluate("()=>scrollTo(0,0)");w(200)
            hs.append(pg.evaluate("()=>document.documentElement.scrollHeight"));pg.add_style_tag(content='#mainnav,#sidenav{visibility:hidden!important}');w(100)
            p=T+'p64_%d_%d.png'%(esc,prop);pg.screenshot(path=p,full_page=True);fs.append(p);b.close()
        print('64a',tema,'altura',hs,'achados novos:',novos(oo[0],oo[1]))
        prancha64('64a-app-precos-luxo-%s.jpg'%tema,'App · Giro e preços › Preços no padrão de luxo · tema '+tema,
          ['Hoje: "Preço automático" aparece 3 vezes (linha que abre, cartão com a chave e faixa de estado); os pré-graduados têm um bloco à parte ("preço fixo"); "Esta semana: nenhum ajuste" aparece junto de "Para decidir esta semana · 3"; a meta fica fora de "Contas, taxas e meta"; cada bloco abre num cartão separado, de uma vez.',
           'Proposta: um cartão só de Preço automático (chave + estado + semana na mesma frase); os pré-graduados viram uma linha do Contador; a meta entra em "Contas, taxas e meta"; os blocos abrem dentro do próprio cartão, com a altura crescendo suave, a seta girando e o conteúdo subindo 6 px (veja 64b e o vídeo 64c).'],fs[0],fs[1],hs[0],hs[1])
        # 64b: quadros da animação (abrir "Contas, taxas e meta")
        qs=[]
        for t in (0,120,240,380):
            b,pg,w=ap.abre(pw,'inicio',esc);w(1200);tela(pg,w,1)
            pg.evaluate("()=>{const s=document.querySelector('.fx64[data-fx=cfg]');s.scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-120)}");w(300)
            pg.evaluate("()=>document.querySelector('.fx64[data-fx=cfg] .fxH').click()");w(30)
            pg.evaluate("t=>document.getAnimations().forEach(a=>{try{a.pause();a.currentTime=t}catch(e){}})",t);w(120)
            p=T+'a64_%d_%d.png'%(esc,t);pg.screenshot(path=p);qs.append(p);b.close()
        ims=[Image.open(x).convert('RGB').resize((390,844)) for x in qs];g=30;W=g+4*(390+g);S=Image.new('RGB',(W,330+844+g),'#f1eef0');d=ImageDraw.Draw(S)
        d.text((g,30),'App · abrir um bloco como na Apple · tema '+tema,font=F(36,True),fill='#1d1418')
        for i,l in enumerate(['Tocar em "Contas, taxas e meta": o cartão cresce no lugar (0,38 s, curva da Apple), os de baixo descem junto,','a seta gira e o conteúdo aparece subindo 6 px. Fechar faz o caminho de volta em 0,26 s. "Menos movimento" no celular: abre direto.']): d.text((g,90+i*32),l,font=F(22),fill='#55484f')
        for i,(im,r) in enumerate(zip(ims,('0 ms','120 ms','240 ms','380 ms'))):
            x=g+i*(390+g);d.text((x,250),r,font=F(28,True),fill='#8d3a69');S.paste(im,(x,300));d.rectangle([x-1,299,x+390,300+844],outline='#cfc6cb')
        S.save(OUT+'64b-app-abrir-como-apple-quadros-%s.jpg'%tema,quality=86);print('  64b',tema)
    # 64c: vídeo curto (escuro)
    vd=T+'vid64/';subprocess.run(['rm','-rf',vd]);os.makedirs(vd)
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark',service_workers='block',record_video_dir=vd,record_video_size={'width':780,'height':1688})
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
    c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF');w=pg.wait_for_timeout;w(1200)
    tela(pg,w,1);w(900)
    for y in range(0,700,20): pg.evaluate("y=>scrollTo(0,y)",y);w(25)
    w(700);pg.evaluate("()=>{const s=document.querySelector('.fx64[data-fx=cfg]');s.scrollIntoView({block:'start',behavior:'smooth'})}");w(900)
    pg.evaluate("()=>scrollBy({top:-140,behavior:'smooth'})");w(700)
    pg.evaluate("()=>document.querySelector('.fx64[data-fx=cfg] .fxH').click()");w(1500)
    for k in range(18): pg.evaluate("()=>scrollBy(0,22)");w(30)
    w(900);pg.evaluate("()=>document.querySelector('.fx64[data-fx=cfg]').scrollIntoView({block:'start',behavior:'smooth'})");w(900)
    pg.evaluate("()=>document.querySelector('.fx64[data-fx=cfg] .fxH').click()");w(1100)
    print('   video',pg.evaluate("()=>[...document.querySelectorAll('.fx64')].map(s=>s.dataset.fx)"))
    pg.evaluate("()=>{const h=document.querySelector('.fx64[data-fx=abp] .fxH');h&&h.click()}");w(1500)
    pg.evaluate("()=>{const h=document.querySelector('.fx64[data-fx=abp] .fxH');h&&h.click()}");w(1000)
    c.close();b.close()
    wb=glob.glob(vd+'*.webm')[0]
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',wb,'-ss','1.6','-vf','scale=780:-2','-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',OUT+'64c-app-precos-abrir-como-apple-escuro.mp4'])
    print('  64c',os.path.getsize(OUT+'64c-app-precos-abrir-como-apple-escuro.mp4'))
