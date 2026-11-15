# S340: esboços das correções dos defeitos já citados (painel no escuro; barra "Toque nas peças"; cabeçalho do grupo no painel).
# Telas reais (kit do painel e app real), um arquivo por tela, HOJE × PROPOSTA. App em escuro e claro. Nada implementado.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.path.insert(0,'/home/claude/lafouch/work/s321');import painel,base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s340/';T='/tmp/s330/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
def prancha(nome,titulo,sub,a,b):
    ims=[Image.open(a),Image.open(b)];w,h=ims[0].size;g=40;top=250;S=Image.new('RGB',(g+2*(w+g),top+h+g),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(40,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,94+i*36),l,font=F(25),fill='#55484f')
    for i,(im,r) in enumerate(zip(ims,('HOJE','PROPOSTA'))):
        x=g+i*(w+g);d.text((x,196),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome)
def olho(pg):
    try: return set(str((f['r'],f.get('ex'))) for f in (pg.evaluate(OLHO) or []))
    except Exception as e: return set(['erro olho '+str(e)[:60]])
SHARE="()=>{const e=[...document.querySelectorAll('#v-vendas button')].filter(e=>e.offsetParent&&/ompartilh/i.test(e.getAttribute('aria-label')||''))[0];e&&e.click()}"
GRUPO="()=>{const L=window.__LF;L.S._gn={a:'estoque',b:'vendas'};L.ACT.grpCria()}"
P_BARRA=".ebBar .ebN{white-space:normal!important;line-height:1.25}.ebBar:not(.in){transform:translateY(calc(100% + 120px))!important;visibility:hidden;transition:transform .3s cubic-bezier(.4,0,.2,1),visibility 0s .3s!important}"
with sync_playwright() as pw:
    # 1) painel · Ajustes · escuro
    fs=[]
    for prop in (() if os.environ.get('SO20') else (0,1)):
        b,pg,w,_=painel.abre(pw,True);painel.vai(pg,'cfg')
        if prop: pg.add_style_tag(content=':root{--card:var(--s1)}');w(300)
        p=T+'e_cfg_%d.png'%prop;pg.screenshot(path=p);fs.append(p);b.close()
    if not os.environ.get('SO20'): prancha('17-painel-ajustes-escuro.jpg','Painel do site · Ajustes · tema escuro',['Hoje: 7 linhas brancas com letra clara e "Sair" branco.','Proposta: a cor de cartão do painel (a mesma correção vale para a Vitrine).'],*fs)
    for esc,tema in ((True,'escuro'),(False,'claro')):
        # 2) barra aberta  3) barra fechada
        for passo,nome,tit,sub in () if os.environ.get('SO20') else ((0,'18-app-barra-aberta','App · Catálogo · compartilhar sem peça escolhida',['Hoje: a frase passa por baixo do botão "Enviar bonito ›".','Proposta: a frase quebra em 2 linhas e nunca entra embaixo do botão.']),
                                   (1,'19-app-barra-fechada','App · depois de tocar no × da barra',['Hoje: a barra só desce um pouco e fica por cima do menu de baixo.','Proposta: fechou, saiu da tela; o menu volta inteiro. Sair do Catálogo também fecha.'])):
            fs=[];ach=[]
            for prop in (0,1):
                b,pg,w=base.abre(pw,'inicio',esc);pg.evaluate(GRUPO);w(1200);pg.evaluate("()=>window.__LF.setView('vendas')");w(1000)
                if prop: pg.add_style_tag(content=P_BARRA)
                pg.evaluate(SHARE);w(900)
                if passo: pg.evaluate("()=>document.querySelector('#ebBar .ebX').click()");w(900)
                p=T+'e_b%d_%d_%d.png'%(passo,esc,prop);pg.screenshot(path=p);fs.append(p);ach.append(olho(pg));b.close()
            print(nome,tema,'achados novos:',sorted(ach[1]-ach[0]) or 'nenhum');prancha('%s-%s.jpg'%(nome,tema),tit+' · tema '+tema,sub,*fs)
        # 4) Atacado pelo Início com o grupo criado
        fs=[];ach=[]
        for prop in (0,1):
            b,pg,w=base.abre(pw,'inicio',esc);pg.evaluate(GRUPO);w(1200)
            pg.evaluate("()=>{const t=[...document.querySelectorAll('#v-inicio .tl')].find(e=>/Atacado/.test(e.innerText));t&&t.click()}");w(2200)
            if prop:
                pg.evaluate("()=>{const g=document.getElementById('grpTabs'),f=document.getElementById('lojaFrame');const h=g?g.getBoundingClientRect().height+parseFloat(getComputedStyle(g).marginBottom||0)+parseFloat(getComputedStyle(g).marginTop||0):0;if(g){g.hidden=true;g.style.display='none'};if(f)f.style.height=(f.getBoundingClientRect().height+h)+'px'}");w(500)
            p=T+'e_a_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);ach.append(olho(pg));b.close()
        print('20-atacado',tema,'achados novos:',sorted(ach[1]-ach[0]) or 'nenhum')
        prancha('20-app-atacado-sem-cabecalho-do-grupo-%s.jpg'%tema,'App · Início → Atacado · tema '+tema,['Hoje: aparece o cabeçalho do grupo "Loja e estoque" com "Catálogo" marcado.','Proposta: o painel não é do grupo, então abre sem esse cabeçalho. (No simulador o painel fica em branco.)'],*fs)
