# S354 · esboço 43: GRUPO ENTRE OS ATALHOS DO INÍCIO — animação de JUNTAR (43a) e de DESFAZER (43b). App real, celular.
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
 const st=document.createElement('style');st.textContent='#v-inicio .tl{will-change:transform}.esAlvo{outline:2px solid var(--accent-fg,#f0a8cf);outline-offset:-2px}.esLev{position:relative;z-index:5;box-shadow:0 14px 34px rgba(0,0,0,.45)!important}';document.head.appendChild(st);return [E.nome,E.ico.length]}"""
# p de 0 a 1 · juntar
JUNTA="""p=>{const E=window.__E,ta=E.ta,tb=E.tb;const ease=x=>1-Math.pow(1-Math.min(1,Math.max(0,x)),4);const seg=(a,b)=>ease((p-a)/(b-a));
 if(!E.r){E.ra=ta.getBoundingClientRect();E.rb=tb.getBoundingClientRect();E.r=1}
 if(E.fim){return 'fim'}
 const lev=seg(0,.18),vai=seg(.18,.6),fun=seg(.6,.82),dx=(E.rb.left-E.ra.left)*vai,dy=(E.rb.top-E.ra.top)*vai;
 ta.classList.toggle('esLev',p>0);ta.style.transform='translate('+dx+'px,'+dy+'px) scale('+(1+.06*lev-.5*fun)+')';ta.style.opacity=String(1-fun);
 tb.classList.toggle('esAlvo',p>.19&&p<.9);
 if(p>=.6&&!E.troc){E.troc=1;tb.innerHTML=E.grp}
 if(p>=.6){const ic=tb.querySelector('.ti');ic.style.transform='scale('+(.7+.3*fun)+')';ic.style.opacity=String(.3+.7*fun)}
 if(p>=.82&&!E.flip){E.flip=1;const ts=[...document.querySelectorAll('#v-inicio .tl')].filter(x=>x!==ta);const antes=ts.map(x=>x.getBoundingClientRect());ta.style.display='none';E.ts=ts;E.d=ts.map((x,i)=>{const n=x.getBoundingClientRect();return [antes[i].left-n.left,antes[i].top-n.top]})}
 if(E.flip){const q=seg(.82,1);E.ts.forEach((x,i)=>{x.style.transform='translate('+E.d[i][0]*(1-q)+'px,'+E.d[i][1]*(1-q)+'px)'})}
 return p}"""
# desfazer: parte do estado final do juntar
DESF="""p=>{const E=window.__E,ta=E.ta,tb=E.tb;const ease=x=>1-Math.pow(1-Math.min(1,Math.max(0,x)),4);const seg=(a,b)=>ease((p-a)/(b-a));
 if(!E.u){E.u=1;E.ts.forEach(x=>x.style.transform='');const ts=E.ts;const antes=ts.map(x=>x.getBoundingClientRect());ta.style.display='';ta.style.opacity='0';ta.style.transform='';ta.classList.remove('esLev');E.d2=ts.map((x,i)=>{const n=x.getBoundingClientRect();return [antes[i].left-n.left,antes[i].top-n.top]});E.ra2=ta.getBoundingClientRect();E.rb2=tb.getBoundingClientRect()}
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
        for i,p in enumerate((0,.12,.25,.72,1)):
            pg.evaluate(JUNTA,p)
            if p==1: pg.evaluate(TOAST,'Grupo criado')
            w(250);q=T+'j_%d_%d.png'%(esc,i);pg.screenshot(path=q);qs.append(q)
        nome=pg.evaluate("()=>window.__E.nome")
        tira('43a-app-inicio-juntar-atalhos-%s.jpg'%tema,'App · Início · juntar dois atalhos num grupo · tema '+tema,['Segurar um atalho e arrastar sobre outro. O grupo nasce ali, com o ícone próprio do par e o nome sugerido ("%s"); 0,9 s no total, sem passar do ponto.'%nome,'Sem janela para dar nome: o aviso oferece "Desfazer" e o nome se muda em "Gerenciar grupo".'],qs,['1 · parado','2 · segurou: o atalho levanta','3 · arrastando: o alvo acende','4 · soltou: os dois viram um','5 · grupo pronto'])
        if esc:
            for k in range(28):
                pass
        pg.evaluate(TOAST,'');qs=[]
        for i,p in enumerate((0,.35,.7,1)):
            if p>0: pg.evaluate(DESF,p)
            if p==1: pg.evaluate("()=>{const E=window.__E;E.ta.style.transform='';E.ta.style.opacity='';E.ts.forEach(x=>x.style.transform='')}")
            w(250);q=T+'u_%d_%d.png'%(esc,i);pg.screenshot(path=q);qs.append(q)
        tira('43b-app-inicio-desfazer-grupo-%s.jpg'%tema,'App · Início · desfazer o grupo · tema '+tema,['Em "Gerenciar grupo › Desfazer o grupo": o botão do grupo se abre e cada atalho volta ao seu lugar; 0,6 s.','O mesmo movimento vale para o grupo Dashboard (Reservas, Giro e Preços voltam a ser atalhos soltos).'],qs,['1 · grupo','2 · abre espaço','3 · o atalho volta','4 · como era antes'])
        b.close()
    # filme (escuro): juntar e desfazer, 30 quadros/s
    b,pg,w=abre(pw,True);pg.evaluate(PREP,[A,Bq]);n=0
    def qd():
        global n;pg.screenshot(path=T+'f_%03d.png'%n);n+=1
    for k in range(12): qd()
    for k in range(28): pg.evaluate(JUNTA,k/27);qd()
    pg.evaluate(TOAST,'Grupo criado')
    for k in range(30): qd()
    pg.evaluate(TOAST,'')
    for k in range(19): pg.evaluate(DESF,max(.001,k/18));qd()
    pg.evaluate("()=>{const E=window.__E;E.ta.style.transform='';E.ta.style.opacity='';E.ts.forEach(x=>x.style.transform='')}")
    for k in range(24): qd()
    b.close()
subprocess.run(['ffmpeg','-v','error','-y','-framerate','30','-i',T+'f_%03d.png','-vf','scale=390:844','-pix_fmt','yuv420p','-movflags','+faststart',OUT+'43-juntar-e-desfazer-grupo.mp4'],check=True);print('  filme',n,'quadros')
