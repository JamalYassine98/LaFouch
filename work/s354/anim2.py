# S354 · esboço 44 (v2 do 43, pedido do dono 15/11 18:12: animação bonita + proteção contra toque errado): GRUPO ENTRE OS ATALHOS DO INÍCIO — animação de JUNTAR (43a) e de DESFAZER (43b). App real, celular.
# O ícone do grupo é o ícone próprio do par que o app já tem (grpIcoPar) e o nome é o sugerido (grpNomeSugerido). Quadros lado a lado + MP4 (sem GIF).
# Curva de luxo: entra cubic-bezier(.16,1,.3,1), sem passar do ponto. Juntar 0,9 s no total; desfazer 0,6 s. Nada implementado.
import sys,os,subprocess;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s354/';T='/tmp/s354/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
A,Bq='giro','prec'
PREP="""a=>{const [A,B]=a;const q=id=>document.querySelector('#v-inicio .tl[data-id="'+id+'"]');const ta=q(A),tb=q(B);if(!ta||!tb)return 'sem atalho';tb.scrollIntoView({block:'center',behavior:'instant'});
 const E=window.__E={A,B,ta,tb,nome:window.__gns(A,B)||'Grupo',ico:window.__gip(A,B,24),orig:tb.innerHTML,na:ta.querySelector('.tn').textContent,nb:tb.querySelector('.tn').textContent};
 E.grp='<span class="ti">'+E.ico+'</span><span class="tn">'+E.nome+'</span><span class="tp">'+E.na+' · '+E.nb+'</span>';
 const st=document.createElement('style');st.textContent='#v-inicio .tl{will-change:transform}.esAlvo{}.esLev{position:relative;z-index:5;box-shadow:0 14px 34px rgba(0,0,0,.45)!important}';document.head.appendChild(st);return [E.nome,E.ico.length]}"""
# p de 0 a 1 · juntar
JUNTA="""p=>{const E=window.__E,ta=E.ta,tb=E.tb;const cl=x=>Math.min(1,Math.max(0,x));const ease=x=>1-Math.pow(1-cl(x),4);const io=x=>{x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};const seg=(a,b)=>ease((p-a)/(b-a));const lin=(a,b)=>cl((p-a)/(b-a));
 if(!E.r){E.r=1;E.ra=ta.getBoundingClientRect();E.rb=tb.getBoundingClientRect();const ia=ta.querySelector('.ti'),ib=tb.querySelector('.ti');E.ia=ia.getBoundingClientRect();E.ib=ib.getBoundingClientRect();
  const f=document.createElement('span');f.className='ti';f.innerHTML=ia.innerHTML;f.style.cssText='position:fixed;left:'+E.ia.left+'px;top:'+E.ia.top+'px;width:'+E.ia.width+'px;height:'+E.ia.height+'px;display:grid;place-items:center;z-index:30;pointer-events:none;color:'+getComputedStyle(ia.querySelector('svg')||ia).color;document.body.appendChild(f);E.f=f;ia.style.visibility='hidden';
  const cx=E.ib.left+E.ib.width/2,cy=E.ib.top+E.ib.height/2;const R=30,C=2*Math.PI*R;E.C=C;const an=document.createElement('div');an.style.cssText='position:fixed;left:'+(cx-40)+'px;top:'+(cy-40)+'px;width:80px;height:80px;z-index:29;pointer-events:none';
  an.innerHTML='<svg viewBox="0 0 80 80" width="80" height="80" style="overflow:visible"><circle cx="40" cy="40" r="'+R+'" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'" transform="rotate(-90 40 40)"/></svg>';an.style.color=getComputedStyle(ia.querySelector('svg')||ia).color;document.body.appendChild(an);E.an=an;
  const par=document.createElement('span');par.className='ti';par.innerHTML=E.ico;par.style.cssText='position:fixed;left:'+E.ib.left+'px;top:'+E.ib.top+'px;width:'+E.ib.width+'px;height:'+E.ib.height+'px;display:grid;place-items:center;z-index:31;pointer-events:none;opacity:0;color:'+getComputedStyle(ia.querySelector('svg')||ia).color;document.body.appendChild(par);E.par=par;E.ibEl=ib}
 const lev=seg(0,.12),via=io(lin(.12,.42)),anel=lin(.42,.64),fun=io(lin(.64,.84)),fim=seg(.84,1);
 // o atalho de origem: levanta, e a "casca" some enquanto o ícone viaja
 ta.classList.toggle('esLev',p>0&&p<.3);ta.style.transform='scale('+(1+.05*lev-.08*via)+')';ta.style.opacity=String(1-via);
 const ox=14,tx=(E.ib.left-ox)-E.ia.left,ty=E.ib.top-E.ia.top,arco=-18*Math.sin(Math.PI*via);
 E.f.style.transform='translate('+(tx*via+ox*fun)+'px,'+(ty*via+arco)+'px) scale('+(1+.12*lev-.12*via-.25*fun)+')';E.f.style.opacity=String(1-fun);
 // o alvo: o ícone abre espaço, o anel se desenha (tempo de confirmar), depois os dois se fundem no ícone do par
 E.ibEl.style.transform='translateX('+(ox*via-ox*fun)+'px) scale('+(1-.25*fun)+')';E.ibEl.style.opacity=String(1-fun);
 E.an.querySelector('circle').setAttribute('stroke-dashoffset',String(E.C*(1-anel)));E.an.style.transform='scale('+(1+.22*fun)+')';E.an.style.opacity=String(p<.42?0:1-fun);
 E.par.style.opacity=String(fun);E.par.style.transform='scale('+(.8+.2*fun)+')';
 const tn=tb.querySelector('.tn'),tp=tb.querySelector('.tp');const meio=lin(.64,.84);
 if(meio>=.5&&!E.troc){E.troc=1;tn.textContent=E.nome;if(tp)tp.textContent=E.na+' · '+E.nb}
 const ot=Math.abs(meio-.5)*2;if(p>=.64){tn.style.opacity=String(ot);tn.style.transform='translateY('+((meio<.5?1:-1)*(1-ot)*4)+'px)';if(tp)tp.style.opacity=String(ot)}
 if(p>=.84&&!E.flip){E.flip=1;E.ibEl.innerHTML=E.ico;E.ibEl.style.transform='';E.ibEl.style.opacity='1';E.par.remove();E.f.remove();E.an.remove();const ts=[...document.querySelectorAll('#v-inicio .tl')].filter(x=>x!==ta);const antes=ts.map(x=>x.getBoundingClientRect());ta.style.display='none';E.ts=ts;E.d=ts.map((x,i)=>{const n=x.getBoundingClientRect();return [antes[i].left-n.left,antes[i].top-n.top]})}
 if(E.flip){E.ts.forEach((x,i)=>{x.style.transform='translate('+E.d[i][0]*(1-fim)+'px,'+E.d[i][1]*(1-fim)+'px)'})}
 return p}"""
# desfazer: parte do estado final do juntar
DESF="""p=>{const E=window.__E,ta=E.ta,tb=E.tb;const ease=x=>1-Math.pow(1-Math.min(1,Math.max(0,x)),4);const seg=(a,b)=>ease((p-a)/(b-a));
 if(!E.u){E.u=1;E.ts.forEach(x=>x.style.transform='');const ts=E.ts;const antes=ts.map(x=>x.getBoundingClientRect());ta.style.display='';ta.style.opacity='0';ta.style.transform='';ta.classList.remove('esLev');ta.querySelector('.ti').style.visibility='';E.d2=ts.map((x,i)=>{const n=x.getBoundingClientRect();return [antes[i].left-n.left,antes[i].top-n.top]});E.ra2=ta.getBoundingClientRect();E.rb2=tb.getBoundingClientRect()}
 const abre=seg(0,.55),sai=seg(.2,1);E.ts.forEach((x,i)=>{x.style.transform='translate('+E.d2[i][0]*(1-abre)+'px,'+E.d2[i][1]*(1-abre)+'px)'});
 if(p>=.2&&!E.dest){E.dest=1;tb.innerHTML=E.orig}
 const dx=(E.rb2.left-E.ra2.left)*(1-sai),dy=(E.rb2.top-E.ra2.top)*(1-sai);ta.style.transform='translate('+dx+'px,'+dy+'px) scale('+(.6+.4*sai)+')';ta.style.opacity=String(sai);return p}"""
TOAST="""t=>{document.querySelectorAll('.lfa-toast').forEach(e=>e.remove());if(!t)return;const b=document.createElement('div');b.className='lfa-toast b';b.setAttribute('role','status');b.innerHTML='<div style="flex:1"><b>'+t+'</b></div><button type="button" class="pdLink" style="font-weight:700;min-height:44px;padding:0 6px">Desfazer</button>';document.body.appendChild(b)}"""
def abre(pw,esc):
    b=pw.chromium.launch(executable_path=ap.kit.EXE,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark' if esc else 'light',service_workers='block')
    def h(r):
        u=r.request.url
        if not u.startswith('http://localhost'): return r.abort()
        if 'app.js' in u:
            t=r.fetch().text().replace("function grpChave(a, b) {","window.__gip=function(a,b,p){return grpIcoPar(a,b,p)};window.__gns=function(a,b){return grpNomeSugerido(a,b)};function grpChave(a, b) {",1);return r.fulfill(body=t,content_type='application/javascript')
        r.continue_()
    c.route('**/*',h);c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%ap.kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(2600);return b,pg,pg.wait_for_timeout
def tira(nome,titulo,sub,qs,rots):
    ims=[Image.open(q).convert('RGB').resize((390,844)) for q in qs];g=24;W=g+len(ims)*(390+g);S=Image.new('RGB',(W,150+844+g+40),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,22),titulo,font=F(30,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,66+i*28),l,font=F(19),fill='#55484f')
    for i,(im,r) in enumerate(zip(ims,rots)):
        x=g+i*(390+g);d.text((x,128),r,font=F(18,True),fill='#8d3a69');S.paste(im,(x,158));d.rectangle([x-1,157,x+390,158+844],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome,S.size)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w=abre(pw,esc);print('  ',pg.evaluate(PREP,[A,Bq]));w(300)
        qs=[]
        for i,p in enumerate((0,.1,.3,.56,.74,1)):
            pg.evaluate(JUNTA,p)
            if p==1: pg.evaluate(TOAST,'Grupo criado')
            w(250);q=T+'j_%d_%d.png'%(esc,i);pg.screenshot(path=q);qs.append(q)
        nome=pg.evaluate("()=>window.__E.nome")
        tira('44a-app-inicio-juntar-atalhos-v2-%s.jpg'%tema,'App · Início · juntar dois atalhos num grupo · tema '+tema,['O ícone sai do atalho e viaja em arco até o outro; os dois ficam lado a lado enquanto um anel se fecha em volta (0,3 s para desistir); então se fundem no ícone do par e o nome troca ("%s").'%nome,'Contra toque errado: só começa segurando 0,4 s; só junta se ficar em cima do alvo até o anel fechar; soltar antes cancela; depois de criado, o aviso "Desfazer" fica 5 s.'],qs,['1 · parado','2 · segurou (0,4 s): levanta','3 · o ícone viaja até o outro','4 · o anel se fecha: confirmar','5 · os dois se fundem','6 · grupo pronto'])
        if esc:
            for k in range(28):
                pass
        pg.evaluate(TOAST,'');qs=[]
        for i,p in enumerate((0,.35,.7,1)):
            if p>0: pg.evaluate(DESF,p)
            if p==1: pg.evaluate("()=>{const E=window.__E;E.ta.style.transform='';E.ta.style.opacity='';E.ts.forEach(x=>x.style.transform='')}")
            w(250);q=T+'u_%d_%d.png'%(esc,i);pg.screenshot(path=q);qs.append(q)
        tira('44b-app-inicio-desfazer-grupo-%s.jpg'%tema,'App · Início · desfazer o grupo · tema '+tema,['Em "Gerenciar grupo › Desfazer o grupo": o botão do grupo se abre e cada atalho volta ao seu lugar; 0,6 s.','O mesmo movimento vale para o grupo Dashboard (Reservas, Giro e Preços voltam a ser atalhos soltos).'],qs,['1 · grupo','2 · abre espaço','3 · o atalho volta','4 · como era antes'])
        b.close()
    # filme (escuro): juntar e desfazer, 30 quadros/s
    b,pg,w=abre(pw,True);pg.evaluate(PREP,[A,Bq]);n=0
    def qd():
        global n;pg.screenshot(path=T+'f_%03d.png'%n);n+=1
    for k in range(12): qd()
    for k in range(46): pg.evaluate(JUNTA,k/45);qd()
    pg.evaluate(TOAST,'Grupo criado')
    for k in range(30): qd()
    pg.evaluate(TOAST,'')
    for k in range(19): pg.evaluate(DESF,max(.001,k/18));qd()
    pg.evaluate("()=>{const E=window.__E;E.ta.style.transform='';E.ta.style.opacity='';E.ts.forEach(x=>x.style.transform='')}")
    for k in range(24): qd()
    b.close()
subprocess.run(['ffmpeg','-v','error','-y','-framerate','30','-i',T+'f_%03d.png','-vf','scale=390:844','-pix_fmt','yuv420p','-movflags','+faststart',OUT+'44-juntar-e-desfazer-grupo-v2.mp4'],check=True);print('  filme',n,'quadros')
