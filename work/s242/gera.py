# S242 · app: (1) computador usando a tela inteira (duas colunas), (2) UM catálogo só — Produtos, (3) Site integrado ao app. Sobre as telas reais + acabamento S241.
import os, subprocess, sys, time, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'; sys.path.insert(0, A + '../s241')
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
src = open(A + '../s241/gera.py').read(); CSS241 = src[src.index('CSS = """') + 9: src.index('"""', src.index('CSS = """') + 9)]
OLHO = open(A + '../kit/olho.js').read()
CSS = CSS241 + """
@media (min-width:1100px){
 /* Caixa: saldo à esquerda, objetivos e ações à direita */
 #v-caixa{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:20px 28px;align-items:start}
 #v-caixa>.top{grid-column:1 / -1}#v-caixa>.cxSaldo{grid-column:1;grid-row:2 / span 6}#v-caixa>*:not(.top):not(.cxSaldo){grid-column:2}
 /* Ajustes: a lista ocupa duas colunas */
 #v-ajustes .card:has(.ajS){column-count:2;column-gap:36px;column-rule:1px solid var(--line)}#v-ajustes .ajS{break-inside:avoid}
 /* Produtos: lista à esquerda, ficha da peça à direita, sem trocar de tela */
 #v-estoque.lf2{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:8px 24px;align-items:start}
 #v-estoque.lf2>*{grid-column:1}#v-estoque.lf2>.lfFicha{grid-column:2;grid-row:1 / span 9;position:sticky;top:22px}
 #v-estoque.lf2 #kpisE{grid-template-columns:repeat(2,minmax(0,220px))}
}
.lfFicha{background:var(--panel);border-radius:20px;padding:18px;box-shadow:0 1px 2px rgba(42,31,39,.05),0 8px 24px -18px rgba(42,31,39,.25);display:flex;flex-direction:column;gap:12px}
.lfFicha img{width:100%;aspect-ratio:4/3;object-fit:contain;background:#fff;border-radius:14px}
.lfFicha h3{font:500 20px Fraunces,Georgia,serif;margin:0}
.lfFicha .l{display:flex;justify-content:space-between;font:500 14.5px Inter,system-ui,sans-serif;padding:8px 0;border-top:1px solid var(--line)}
.lfFicha .l span{opacity:.65;font-weight:400}
.lfFicha .bt{display:flex;gap:8px}.lfFicha .bt button{flex:1;min-height:46px;border-radius:999px;font:600 15px Inter,system-ui,sans-serif;border:1px solid color-mix(in srgb,currentColor 22%,transparent);background:transparent;color:inherit}
.lfFicha .bt button.p{background:#8d3a69;border-color:#8d3a69;color:#fff}
.lfVd{position:absolute;right:8px;bottom:8px;width:40px;height:40px;border-radius:999px;background:#8d3a69;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(141,58,105,.35)}
.view #btnAdd,.view .mini:not(.ghost){color:#fff!important;-webkit-text-fill-color:#fff}
.lfSite{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px}
@media (min-width:1100px){.lfSite{grid-template-columns:repeat(4,1fr)}}
.lfSite .c{background:var(--panel);border-radius:20px;padding:16px;box-shadow:0 1px 2px rgba(42,31,39,.05),0 8px 24px -18px rgba(42,31,39,.25);min-height:108px;display:flex;flex-direction:column;gap:4px}
.lfSite .c small{font:600 12px Inter,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;opacity:.65}
.lfSite .c b{font:600 24px Inter,system-ui,sans-serif;font-variant-numeric:tabular-nums}
.lfSite .c span{font:400 13px Inter,system-ui,sans-serif;opacity:.7;margin-top:auto}
.lfSite .w{grid-column:1 / -1;min-height:0;flex-direction:row;align-items:center;justify-content:space-between;font:500 15px Inter,system-ui,sans-serif}
"""
PROD = """()=>{const v=document.querySelector('#v-estoque');v.querySelector('h1').textContent='Produtos';const cr=v.querySelector('.crumb');if(cr)cr.textContent='Um catálogo só: vender, estoque, custo e fotos de cada peça';
 const cs=[...new Set([...v.querySelectorAll('#listCard img')].filter(i=>i.getBoundingClientRect().width>60).map(i=>i.closest('button,[data-act],[data-id]')||i.parentElement.parentElement))].filter(Boolean);document.querySelectorAll('#mainnav .mn').forEach(b=>{if(b.dataset.id=='vendas')b.style.display='none';if(b.dataset.id=='estoque')b.lastElementChild.textContent='Produtos'});cs.slice(0,40).forEach(c=>{if(c.querySelector('.lfVd'))return;c.style.position='relative';const b=document.createElement('span');b.className='lfVd';b.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 11.5a2 2 0 0 0 2 1.5h7.6a2 2 0 0 0 2-1.5L21 7H6"/></svg>';c.appendChild(b)});
 if(innerWidth>=1100&&cs[1]){v.classList.add('lf2');const c=cs[1],im=c.querySelector('img'),t=(c.textContent||'').replace(/\\s+/g,' ').trim();const f=document.createElement('aside');f.className='lfFicha';f.innerHTML='<img src="'+im.src+'"><h3>'+t.slice(0,44)+'</h3><div class="l">Preço<span>G$ 25.000</span></div><div class="l">Em estoque<span>9 · 2 cores</span></div><div class="l">No site<span>publicada</span></div><div class="bt"><button class="p">Vender</button><button>Editar</button></div>';v.appendChild(f)}}"""
SITE = """()=>{const v=document.querySelector('#v-onl');v.innerHTML='<div class="top"><div><h1>Site</h1><div class="crumb">A loja online por dentro do app — sem abrir outra janela</div></div></div><div class="lfSite"><div class="c"><small>Pedidos</small><b>2</b><span>1 para separar</span></div><div class="c"><small>Mensagens</small><b>3</b><span>1 de atacado</span></div><div class="c"><small>Visitas hoje</small><b>148</b><span>12 no teste da Mochi</span></div><div class="c"><small>Vitrine</small><b>16</b><span>peças publicadas</span></div><div class="c w">Destaque da semana<span>Solar hexagonal negro ›</span></div><div class="c w">Temática<span>Natal em 41 dias ›</span></div><div class="c w">Ajustes do site<span>frete, PIX, idioma ›</span></div><div class="c w">Abrir a loja como o cliente vê<span>›</span></div></div>'}"""
def folha(nome, tit, sub, pecas, vertical=False, larg=62):
    lin = textwrap.wrap(sub, larg)
    if vertical: Wt = max(p[2].width for p in pecas) + 80; Ht = 130 + 36 * len(lin) + sum(p[2].height + 70 for p in pecas)
    else: Wt = sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80; Ht = 170 + 36 * len(lin) + max(p[2].height for p in pecas) + 40
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(36, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 86 + m * 36), ln, font=F(25), fill='#5b4a56')
    x, y = 40, 106 + 36 * len(lin)
    for rot, cor, im in pecas:
        d.text((x, y), rot, font=F(26, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5')
        if vertical: y += im.height + 70
        else: x += im.width + 40
    B.save(A + 's242_%s.jpg' % nome, quality=85); print('ok', nome, flush=True)
T={'caixa':('caixa',None,'Caixa no computador','Duas colunas: o dinheiro à esquerda, objetivos e ações à direita. A tela deixa de ficar pela metade.'),
   'ajustes':('ajustes',None,'Ajustes no computador','A lista ocupa as duas colunas da tela.'),
   'produtos':('estoque',PROD,'Produtos (um catálogo só)','Catálogo e Inventário viram uma lista: cada cartão mostra preço e estoque e tem o botão de vender. No computador a ficha abre ao lado, sem trocar de tela.'),
   'site':('onl',SITE,'Site integrado','O painel do site vira uma tela do app: pedidos, mensagens, visitas e vitrine em cartões; o resto em linhas que abrem dentro do app.')}
LOTES=[('pc',1366,768,'light',['caixa','ajustes','produtos','site']),('pc_escuro',1366,768,'dark',['produtos']),('pc2560',2560,1440,'light',['caixa','produtos']),('celular',390,844,'light',['produtos','site'])]
srv=subprocess.Popen([sys.executable,'-m','http.server','8827','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for arq,W,H,sc,telas in LOTES:
        im={}
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,color_scheme=sc,is_mobile=W<700,has_touch=W<1100,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:70]));pg.goto('http://localhost:8827/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(700)
            if modo=='prop': pg.add_style_tag(content=CSS)
            for k in telas:
                real,js,_,_=T[k];pg.evaluate("v=>window.__LF.setView(v)",real);pg.wait_for_timeout(1200)
                if modo=='prop' and js: pg.evaluate(js);pg.wait_for_timeout(500)
                est=pg.evaluate("document.documentElement.scrollWidth>innerWidth+1")
                p='/tmp/s242_%s_%s_%s.png'%(arq,k,modo);pg.screenshot(path=p);x=Image.open(p).convert('RGB');im[k,modo]=x.resize((int(x.width*900/x.height),900)) if W<1100 else x.resize((1300,int(x.height*1300/x.width)))
                if modo=='prop': print(arq,k,'largura estourada:',est,'erros',er[:1])
            c.close()
        for k in telas: folha('%s_%s'%(arq,k),'App · %s · %s'%(T[k][2],arq.replace('_',' ').replace('pc2560','computador 2560').replace('pc','computador')),T[k][3],[('HOJE','#b42318',im[k,'hoje']),('PROPOSTA','#1f8a4c',im[k,'prop'])],vertical=W>=1100,larg=62 if W<1100 else 100)
finally: srv.terminate()
