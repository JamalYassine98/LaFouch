# S228 · APP: nova estrutura (5 lugares) desenhada em cima das telas reais + S226 (topo compacto, toque 44+).  python3 estrutura.py
import os, sys, subprocess, time, textwrap, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'; sys.path.insert(0, A + '../s226')
import prop as P226
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
IC2={'Site':'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zm0 0h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18','Clientes':P226.IC['Clientes']}
JS226=P226.JS.replace(json.dumps(P226.IC, ensure_ascii=False), json.dumps(IC2, ensure_ascii=False)).replace("b.textContent=/conta/.test(s)?'Ver contas':/sem custo|peça/.test(s)?'Ver peças':/preço/.test(s)?'Ver preços'","b.style.width='auto';b.style.paddingInline='14px';b.textContent=/preço/.test(s)?'Ver preços':/sem custo|peça/.test(s)?'Ver peças':/conta/.test(s)?'Ver contas'")
CSS=P226.CSS+"""
.lfSeg{display:flex;background:color-mix(in srgb,var(--line) 55%,transparent);border-radius:14px;padding:4px;gap:4px;margin:2px 0 14px}
.lfSeg button{flex:1;min-height:44px;border:0;border-radius:11px;background:transparent;font:600 15px Inter,system-ui,sans-serif;color:var(--muted,#6b5a66);display:flex;align-items:center;justify-content:center;gap:8px}
.lfSeg button.on{background:var(--panel);color:var(--tx,inherit);box-shadow:0 1px 4px rgba(0,0,0,.12)}
.lfSeg button.on{color:#8d3a69}
.lfT{margin:4px 0 14px!important;display:flex;gap:22px;border-bottom:1px solid var(--line);overflow-x:auto}
.lfT{flex-wrap:nowrap!important}
.lfT .chip{min-height:44px;white-space:nowrap;background:none!important;border:0!important;border-radius:0!important;padding:0 2px!important;box-shadow:none!important;flex:0 0 auto}
.view button.mini,.view .btn-sc,.view button[data-act]{white-space:nowrap}
.lfMais{display:flex;justify-content:center;margin:14px 0}
.lfNuvem{display:inline-flex;align-items:center;gap:6px;font:500 12px Inter,system-ui,sans-serif;color:var(--muted,#6b5a66);margin:0 0 10px}
.lfNuvem i{width:8px;height:8px;border-radius:9px;background:#1f8f4e;display:inline-block}
"""
NAVI=['M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z','M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 9l8-4.5M12 12v9M12 12L4 7.5','M4 20V10m6 10V4m6 16v-7m4 7H2','M3 7h18v12H3zM3 11h18M7 15h3','M5 12h.01M12 12h.01M19 12h.01']
JSX=r"""(tela)=>{const Q=s=>document.querySelector(s),pc=matchMedia('(min-width:1100px) and (hover:hover) and (pointer:fine)').matches;
 const nav=[...document.querySelectorAll('#mainnav>.mn')],NI=__NAVI__,NL=pc?['Início','Produtos','Vendas','Dinheiro']:['Início','Produtos','Vendas','Dinheiro','Mais'];
 const base=nav.filter(b=>b.dataset.id);base.forEach((b,i)=>{if(i<NL.length){b.lastElementChild.textContent=NL[i];b.querySelector('.mi').innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(i==4?3:1.8)+'" stroke-linecap="round" stroke-linejoin="round"><path d="'+NI[i]+'"/></svg>'}b.classList.remove('on')});
 const at={inicio:0,pv:1,pc:1,vendas:2,dinheiro:3,mais:4,site:pc?-2:4,clientes:pc?-3:4,pend:-1}[tela];if(at>=0&&base[at])base[at].classList.add('on');
 if(pc){const ex=[...document.querySelectorAll('#mainnav>.mn')].filter(b=>!b.dataset.id);if(tela=='site'&&ex[0])ex[0].classList.add('on');if(tela=='clientes'&&ex[1])ex[1].classList.add('on')}
 const v=[...document.querySelectorAll('.view')].find(e=>e.getBoundingClientRect().width),top=v.querySelector('.top'),h1=v.querySelector('h1'),cr=v.querySelector('.crumb');
 const seg=(a)=>{const d=document.createElement('div');d.className='lfSeg';d.innerHTML='<button class="'+(a==0?'on':'')+'">Vender</button><button class="'+(a==1?'on':'')+'">Cuidar do estoque</button>';return d};
 const tabs=(ns)=>{const d=document.createElement('div');d.className='nav lfT';d.innerHTML=ns.map((n,i)=>'<button class="chip'+(i?'':' on')+'" type="button">'+n+'</button>').join('');const c=d.firstChild;c.style.borderBottom='2px solid #8d3a69';c.style.color='#8d3a69';c.style.borderRadius='0';return d};
 const apos=(el,n)=>el.parentNode.insertBefore(n,el.nextSibling);
 if(tela=='pv'){h1.textContent='Produtos';cr.textContent='Toque na peça, escolha a variante e finalize.';apos(top,seg(0))}
 if(tela=='pc'){h1.textContent='Produtos';cr.textContent='Estoque, custo, fotos e preço de cada peça.';apos(top,seg(1));const t=Q('#eTabs');if(t)t.style.display='none'}
 if(tela=='vendas'){const t=document.createElement('div');t.className='top';t.innerHTML='<div><h1 style="margin:0">Vendas</h1><div class="crumb">O que vendeu, quanto sobrou e o que fazer</div></div>';v.insertBefore(t,v.firstChild);apos(t,tabs(['Hoje','Semana','Mês','Ano']))}
 if(tela=='dinheiro'){h1.textContent='Dinheiro';apos(top,tabs(['Caixa','Contas a pagar','Câmbio']))}
 if(tela=='pend'){h1.textContent='Pendências';cr.textContent='Tudo o que precisa de você, num lugar só';const n=document.createElement('div');n.className='lfNuvem';n.innerHTML='<i></i>Tudo salvo na nuvem';apos(top,n)}
 if(tela=='inicio'){const g=v.querySelector('.tgrid');[...g.children].forEach((k,i)=>{if(i>3)k.style.display='none'});g.style.gridTemplateColumns='repeat(4,1fr)';const m=document.createElement('div');m.className='lfMais';m.innerHTML='<button class="mini ghost" type="button">Ver tudo em Mais ›</button>';apos(g,m);const gc=v.querySelector('.guardC');if(gc){const t=[...gc.querySelectorAll('*')].find(e=>e.children.length==0&&/Guardião/.test(e.textContent));if(t)t.textContent=t.textContent.replace('Guardião','Pendências')}}
 if(tela=='mais'){h1.textContent='Mais';const row=[...v.querySelectorAll('button,[data-act],li,a')].find(e=>/^\s*Impressora/.test(e.textContent.trim()));const lista=row&&row.parentNode;if(lista){[['Clientes','e atacado'],['Site','Pedidos, mensagens, visitas']].forEach(([a,b])=>{const c=row.cloneNode(true);const tx=[...c.querySelectorAll('*')].filter(e=>e.children.length==0&&e.textContent.trim());if(tx[0])tx[0].textContent=a;if(tx[1])tx[1].textContent=b;const sv=c.querySelector('svg');if(sv)sv.innerHTML='<path d="'+(a=='Site'?'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zm0 0h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18':'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0')+'"/>';lista.insertBefore(c,lista.firstChild)})}}
 if(tela=='site'){h1.textContent='Site';cr.innerHTML='Pedidos, mensagens e visitas da loja online';const s=v.querySelector('.pdSeg');apos(top,tabs(['Pedidos','Mensagens','Visitas','Loja']));const z=v.querySelector('.lfVazio');if(z){const b=document.createElement('div');b.style.cssText='text-align:center;margin-top:10px';b.innerHTML='<button class="mini" type="button">Abrir a loja online</button>';z.appendChild(b)}}
 if(tela=='clientes'){const t=top.querySelector('.tabs');[...t.children].forEach((k,i)=>{if(i)k.style.display='none'});apos(top,tabs(['Clientes','Atacado','Lotes','Cartões']))}
}""".replace('__NAVI__',json.dumps(NAVI))
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def folha(nome, tit, sub, pecas, vertical=False):
    lin = textwrap.wrap(sub, 60 if not vertical else 110)
    if vertical: Wt = max(p[2].width for p in pecas) + 80; Ht = 130 + 36 * len(lin) + sum(p[2].height + 70 for p in pecas)
    else: Wt = sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80; Ht = 170 + 36 * len(lin) + max(p[2].height for p in pecas) + 40
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(38, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 88 + m * 36), ln, font=F(26), fill='#5b4a56')
    x, y = 40, 108 + 36 * len(lin)
    for rot, cor, im in pecas:
        d.text((x, y), rot, font=F(27, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5')
        if vertical: y += im.height + 70
        else: x += im.width + 40
    B.save(A + 's228_%s.jpg' % nome, quality=85); print('ok', nome, flush=True)
# (chave, tela real de hoje, título, explicação)
T=[('inicio','inicio','1 · Início enxuto','Só o que pede ação, o vendido hoje e 4 atalhos; o resto fica em Mais. A barra passa a ter Início · Produtos · Vendas · Dinheiro · Mais.'),
   ('pv','vendas','2 · Produtos › Vender (era Catálogo)','Uma lista só. A chave no topo troca entre vender e cuidar do estoque, sem perder a busca nem o lugar.'),
   ('pc','estoque','3 · Produtos › Cuidar do estoque (era Inventário)','A mesma lista, mostrando estoque, custo e o que falta corrigir.'),
   ('vendas','dia','4 · Vendas (Dia + Histórico + Números)','Uma tela com o período no topo: Hoje · Semana · Mês · Ano.'),
   ('dinheiro','caixa','5 · Dinheiro (Caixa + Despesas + Câmbio)','Três abas no mesmo lugar.'),
   ('pend','notif','6 · Pendências (Guardião + Notificações + sino)','Uma caixa só, aberta pelo sino; botões dizem o que abrem; sinal único da nuvem.'),
   ('site','ped','7 · Site (Pedidos + Mensagens + Visitas + Loja)','Tudo o que vem do site em abas; a tela vazia explica o próximo passo.'),
   ('clientes','clientes','8 · Clientes (com Atacado, Lotes e Cartões)','Abas no lugar de 4 botões soltos; um só botão de novo cliente.'),
   ('mais','ajustes','9 · Mais','Clientes, Site e os Ajustes num lugar.')]
LOTES=[('celular','celular 390',390,844,[t[0] for t in T]),('pc2560','computador 2560×1440',2560,1440,['inicio','pc','vendas'])]
srv=subprocess.Popen([sys.executable,'-m','http.server','8808','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for arq,rot,W,H,quais in LOTES:
        im={}
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,is_mobile=W<700,has_touch=W<1100,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',rota)
            pg=c.new_page();pg.goto('http://localhost:8808/index.html#test');pg.wait_for_function('window.__LF',timeout=15000);pg.wait_for_timeout(700)
            if modo=='prop': pg.add_style_tag(content=CSS);pg.evaluate(JS226)
            for k,real,tit,sub in T:
                if k not in quais: continue
                pg.evaluate("v=>window.__LF.setView(v)",real);pg.wait_for_timeout(1300)
                if modo=='prop': pg.evaluate(JSX,k);pg.wait_for_timeout(700)
                p='/tmp/s228_%s_%s_%s.png'%(arq,k,modo);pg.screenshot(path=p);x=Image.open(p).convert('RGB')
                im[k,modo]=x.resize((int(x.width*900/x.height),900)) if W<1100 else x.resize((1400,int(x.height*1400/x.width)))
            c.close()
        for k,real,tit,sub in T:
            if k in quais: folha('%s_%s'%(arq,k),'App · %s · %s'%(tit,rot),sub,[('HOJE','#b42318',im[k,'hoje']),('PROPOSTA','#1f8a4c',im[k,'prop'])],vertical=W>=1100)
finally: srv.terminate()
