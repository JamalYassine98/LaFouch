# S245 · TODO o app no design atualizado (S241 + S244) com as descrições novas, curtas, de cada tela. Celular e computador. Um arquivo por tela.
import os, subprocess, sys, time, textwrap, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
s41 = open(A + '../s241/gera.py').read(); j = s41.index('CSS = """') + 9; C241 = s41[j: s41.index('"""', j)]
CSS = C241 + """
.view #btnAdd,.view .mini:not(.ghost){color:#fff!important;-webkit-text-fill-color:#fff}
@media (min-width:1100px){
 .view>.top{justify-content:flex-start!important;gap:18px!important;align-items:flex-start!important}
 .view>.top>div:first-child{flex:0 1 auto!important}
 /* Inventário (S244) */
 #v-estoque{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:36px}
 #v-estoque>*{grid-column:1 / -1}#v-estoque>#eTabs{grid-column:1;grid-row:3}
 #v-estoque>#kpisE{grid-column:2;grid-row:3;display:flex!important;gap:34px;align-items:center;margin:0!important;align-self:center}
 #v-estoque>#kpisE .kpi[hidden],#v-estoque>#kpisE .kpi[style*="none"]{display:none!important}
 #v-estoque>#kpisE .kpi{display:flex;flex-direction:row;align-items:baseline;gap:10px;padding:0!important;min-height:0!important;background:none!important;box-shadow:none!important;border:0!important;width:auto!important}
 #v-estoque>#kpisE .kpi>*:nth-child(n+3){display:none}#v-estoque>#kpisE .kpi .lbl{margin:0;order:2}
 #v-estoque>.main{grid-row:6}#v-estoque #listCard>.col>div:first-child{max-width:none!important;width:100%!important}
 /* Caixa: duas colunas, as duas com cartão */
 #v-caixa{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:20px 28px;align-items:start}
 #v-caixa>.top{grid-column:1 / -1}#v-caixa>.cxSaldo{grid-column:1;grid-row:2 / span 6;background:var(--panel)!important;padding:20px 22px!important}#v-caixa>*:not(.top):not(.cxSaldo){grid-column:2}
 /* telas feitas de cartões empilhados: duas colunas, nada pela metade */
 #v-dia,#v-desp,#v-dash,#v-fx,#v-notif,#v-hist{column-count:2;column-gap:28px}
 #v-dia>*,#v-desp>*,#v-dash>*,#v-fx>*,#v-notif>*,#v-hist>*{break-inside:avoid;margin-bottom:16px}
 #v-dia>.top,#v-desp>.top,#v-dash>.top,#v-fx>.top,#v-notif>.top,#v-hist>.top,#v-dash>*:first-child{column-span:all}
 #v-ajustes .card:has(.ajS){column-count:2;column-gap:36px;column-rule:1px solid var(--line)}#v-ajustes .ajS{break-inside:avoid}
 #v-vendas .main>*:first-child,#v-clientes>input,#v-ped>input{max-width:none!important}
}
"""
DESC={'vendas':'Escolha a peça e venda.','caixa':'O dinheiro da loja, por moeda.','ped':'Pedidos que chegaram pelo site.','clientes':'Quem compra na loja e no atacado.','hist':'Todas as vendas, dia por dia.','fx':'Cotação do dia e trocas de moeda.','desp':'Contas do mês e quanto cada venda separa.','notif':'O que precisa de você agora.','ajustes':'Aparelho, loja, site e segurança.'}
JSD="d=>{const v=[...document.querySelectorAll('.view')].find(e=>e.getBoundingClientRect().width);const id=v.id.replace('v-','');if(!d[id])return;let c=v.querySelector('.top .crumb');if(!c){const h=v.querySelector('h1');if(!h)return;c=document.createElement('div');c.className='crumb';h.insertAdjacentElement('afterend',c)}if(id=='ped'){const b=c.querySelector('button');c.textContent=d[id]+' ';if(b)c.appendChild(b)}else c.textContent=d[id]}"
NOME={'inicio':'Início','estoque':'Inventário','vendas':'Catálogo','caixa':'Caixa','ped':'Pedidos online','clientes':'Clientes','hist':'Histórico','dash':'Números','dia':'Dia','fx':'Câmbio','desp':'Despesas','notif':'Pendências','ajustes':'Ajustes'}
def folha(nome, tit, sub, pecas, vertical=False, larg=62):
    lin = textwrap.wrap(sub, larg) if sub else []
    if vertical: Wt = max(p[2].width for p in pecas) + 80; Ht = 130 + 36 * len(lin) + sum(p[2].height + 70 for p in pecas)
    else: Wt = sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80; Ht = 170 + 36 * len(lin) + max(p[2].height for p in pecas) + 40
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(36, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 86 + m * 36), ln, font=F(25), fill='#5b4a56')
    x, y = 40, 106 + 36 * len(lin)
    for rot, cor, im in pecas:
        d.text((x, y), rot, font=F(26, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5')
        if vertical: y += im.height + 70
        else: x += im.width + 40
    B.save(A + 's245_%s.jpg' % nome, quality=84)
srv=subprocess.Popen([sys.executable,'-m','http.server','8831','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1);rel={}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for arq,W,H,sc in (('pc',1366,768,'light'),('celular',390,844,'light'),('pc_escuro',1366,768,'dark'),('celular_escuro',390,844,'dark')):
        telas=list(NOME) if sc=='light' else ['inicio','estoque','caixa','dash'];im={}
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,color_scheme=sc,is_mobile=W<700,has_touch=W<1100,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:60]));pg.goto('http://localhost:8831/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(700)
            if modo=='prop': pg.add_style_tag(content=CSS)
            for v in telas:
                pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(1000)
                if modo=='prop': pg.evaluate(JSD,DESC);pg.wait_for_timeout(250);rel[arq+'|'+v]=pg.evaluate("()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.getBoundingClientRect().width);let mx=0;v.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&r.top<innerHeight)mx=Math.max(mx,r.right)});const vr=v.getBoundingClientRect();return [document.documentElement.scrollWidth>innerWidth+1,Math.round(100*(mx-vr.left)/vr.width)]}")
                p='/tmp/s245_%s_%s_%s.png'%(arq,v,modo);pg.screenshot(path=p);x=Image.open(p).convert('RGB');im[v,modo]=x.resize((int(x.width*820/x.height),820)) if W<1100 else x.resize((1200,int(x.height*1200/x.width)))
            c.close()
        for v in telas: folha('%s_%s'%(arq,v),'App · %s · %s'%(NOME[v],arq.replace('_',' ').replace('pc','computador')),('Descrição nova: “%s”'%DESC[v]) if v in DESC else '',[('HOJE','#b42318',im[v,'hoje']),('PROPOSTA','#1f8a4c',im[v,'prop'])],vertical=W>=1100,larg=62 if W<1100 else 90)
        print(arq,'feito',len(telas),'erros',er[:1],flush=True)
finally: srv.terminate()
print('estouram largura:',[k for k,v in rel.items() if v[0]]);print('PC: quanto da largura a 1ª tela usa (%):',{k.split('|')[1]:v[1] for k,v in rel.items() if k.startswith('pc|')})
