# S350: esboços pedidos pelo dono em 15/11 16:54 — 36 janelas do grupo (Cancelar/Desfazer no centro, sem "Adicionar botão"); 37 botões cinzas
# ("Restaurar padrão", "Voltar para hoje"); 38 Dashboard único (Dia | Mês) no lugar de Dashboard + Resumo; 39 Pagamento no padrão de luxo.
# App real, celular, escuro e claro; um arquivo por tela; olho sem achado novo. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s350/';T='/tmp/s350/'
from playwright.sync_api import sync_playwright
so=sys.argv[1:] 
def quer(n): return not so or n in so
def patch(pg):  # expõe a janela "Novo grupo" (hoje só abre arrastando um botão da barra sobre outro)
    def h(r):
        b=r.fetch().text().replace("function grpNovoAbre(a, b) {","window.__gna=function(a,b){return grpNovoAbre(a,b)};function grpNovoAbre(a, b) {",1);r.fulfill(body=b,content_type='application/javascript')
    pg.context.route('**/app.js*',h)
def abreP(pw,tela,esc):
    W,H,TQ,dpr=ap.TAM['celular'];b=pw.chromium.launch(executable_path=ap.kit.EXE,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=dpr,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark' if esc else 'light',service_workers='block')
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort());c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");pg=c.new_page();patch(pg)
    pg.goto('http://localhost:%d/index.html#test'%ap.kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(1000)
    if tela!='inicio': pg.evaluate("t=>window.__LF.setView(t)",tela);pg.wait_for_timeout(800)
    return b,pg,pg.wait_for_timeout
TOCA="rx=>{const b=[...document.querySelectorAll('button')].filter(e=>e.offsetParent&&new RegExp(rx).test(e.innerText.trim())).pop();if(!b)return 'sem';b.click();return 'ok'}"
def par(pw,nome,titulo,sub,prep,muda,esc,tema,abre=None,css=''):
    fs=[];oo=[]
    for prop in (0,1):
        b,pg,w=(abre or (lambda pw,e: ap.abre(pw,'inicio',e)))(pw,esc);prep(pg,w);w(1500)
        if prop:
            oo.append(olho(pg))
            if css: pg.add_style_tag(content=css)
            print('   ',str(pg.evaluate(muda))[:120]);w(500)
            for i in ('esD','esF','esM'):
                try: pg.evaluate(TRKP,i)
                except Exception: pass
            w(400)
        p=T+'%s_%d_%d.png'%(nome[:6],esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
    print(nome,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
    prancha('%s-%s.jpg'%(nome,tema),titulo+' · tema '+tema,sub,*fs)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        if quer('36'):
            par(pw,'36a-app-novo-grupo','App · janela "Novo grupo"',['Hoje: "Cancelar" fica encostado à esquerda.','Proposta: "Cancelar" no centro, embaixo do botão principal.'],
              lambda pg,w:(pg.evaluate("()=>window.__gna('estoque','vendas')"),w(900)),
              "()=>{const c=document.querySelector('.modal-box [data-act=grpFecha]');c.style.alignSelf='center';return 'ok'}",esc,tema,abre=lambda pw,e:abreP(pw,'inicio',e))
            par(pw,'36b-app-grupo','App · janela "Grupo"',['Hoje: bloco "Adicionar botão" com 17 botões; "Desfazer o grupo" encostado à esquerda.','Proposta: sem o bloco (para pôr uma tela no grupo, arrasta-se o atalho do Início até o grupo, como já funciona); "Desfazer o grupo" no centro.'],
              lambda pg,w:(pg.evaluate("()=>window.__gna('estoque','vendas')"),w(700),pg.evaluate("()=>window.__LF.ACT.grpCria()"),w(1200),pg.evaluate("()=>{const L=window.__LF;const g=(L.S.grupos||[])[0];L.ACT.grpGerir(g.id);return g.id}"),w(900)),
              "()=>{const m=document.querySelector('[data-act=grpDesfazer]').closest('.modal-box');const a=m.querySelector('.gadd');if(a){const l=a.previousElementSibling;if(l&&l.classList.contains('lbl'))l.remove();a.remove()}const d=m.querySelector('[data-act=grpDesfazer]');d.style.alignSelf='center';return m.getBoundingClientRect().height|0}",esc,tema,abre=lambda pw,e:abreP(pw,'inicio',e))
        if quer('37'):
            LK="e=>{e.className='pdLink';e.style.cssText='min-height:44px;padding:0 8px;color:var(--fg);font-size:15px;font-weight:500;text-decoration:underline;text-underline-offset:4px;text-decoration-color:var(--line)'}"
            par(pw,'37a-app-inicio-restaurar-padrao','App · Início, no fim da página',['Hoje: "Restaurar padrão" aparece como botão cinza do sistema (sem o estilo do app).','Proposta: o mesmo comando como link de texto do app, com área de toque de 44 px.'],
              lambda pg,w:(pg.evaluate("()=>{const L=window.__LF;L.S.inicioFant=true;L.render()}"),w(900),pg.evaluate("()=>{const b=document.querySelector('[data-act=inicioReset]');if(b){b.scrollIntoView({block:'center'});return 'ok'}return 'sem botão'}"),w(500)),
              "()=>{const b=document.querySelector('[data-act=inicioReset]');if(!b)return 'sem botão';(%s)(b);return 'ok'}"%LK,esc,tema)
            par(pw,'37b-app-dashboard-voltar-para-hoje','App · Dashboard num dia anterior',['Hoje: "Voltar para hoje" aparece como botão cinza do sistema.','Proposta: o mesmo comando como link de texto do app, ao lado da data.'],
              lambda pg,w:(pg.evaluate("()=>window.__LF.setView('dia')"),w(900),pg.evaluate("()=>{const b=[...document.querySelectorAll('#v-dia button')].find(e=>e.offsetParent&&/^[‹<]$/.test(e.innerText.trim()));if(b)b.click();return !!b}"),w(900),pg.evaluate("()=>scrollTo(0,0)")),
              "()=>{const b=document.querySelector('[data-act=daytoday]');if(!b)return 'sem botão';(%s)(b);return 'ok'}"%LK,esc,tema)

TRK="""(a)=>{const [nomes,sel,id]=a;const t=document.createElement('div');t.className='trk';t.id=id;t.setAttribute('role','group');t.innerHTML='<span class="trkTh"></span>'+nomes.map((n,i)=>'<button type="button" class="trkB'+(i===sel?' on':'')+'" aria-pressed="'+(i===sel)+'">'+n+'</button>').join('');window.__trk=window.__trk||{};window.__trk[id]=t;return 1}"""
TRKP="""id=>{const t=document.getElementById(id),o=t.querySelector('.on'),h=t.querySelector('.trkTh');const r=o.getBoundingClientRect(),p=t.getBoundingClientRect();h.style.transition='none';h.style.width=r.width+'px';h.style.transform='translateX('+(r.left-p.left-3)+'px)';return r.width|0}"""
M35=open('/home/claude/lafouch/work/s349/e6_dashboard.py').read();CSS35=M35.split('CSS="""')[1].split('"""')[0];MUDA35=M35.split('MUDA="""')[1].split('"""')[0].replace('\\\\','\\')
CSS39=""".sum.esSum{display:flex!important;flex-direction:column;align-items:center;gap:4px;padding:18px 0 20px!important;border:0!important;border-bottom:1px solid var(--line)!important;background:none!important}
.sum.esSum>*{text-align:center}.sum.esSum .esTot{font:400 40px/1.1 var(--display);color:var(--fg);letter-spacing:-.01em}.sum.esSum .esCap{color:var(--mute);font-size:13px}
#payB .lbl{margin-top:6px}#payB .trk{flex:none}.esTx{align-self:flex-start;background:none;border:0;min-height:44px;padding:0 2px;color:var(--mute);font:500 14px inherit;text-decoration:underline;text-underline-offset:4px;text-decoration-color:var(--line)}
.esHt{color:var(--mute);font-size:13px;margin-top:6px}"""
MUDA39="""()=>{const P=document.getElementById('payB');const su=document.querySelector('#sumB .sum');const tx=(su.innerText||'').replace(/\\s+/g,' ').trim();const tot=(tx.match(/G\\$ [0-9.]+/)||[''])[0];const cap=tx.replace(tot,'').trim();
 su.classList.add('esSum');su.innerHTML='<span class="esCap">'+cap+'</span><span class="esTot">'+tot+'</span>';
 const f=document.getElementById('formaChips'),m=document.getElementById('moedas');f.replaceWith(window.__trk.esF);m.replaceWith(window.__trk.esM);
 const cli=document.getElementById('cliPickB'),mix=document.getElementById('pagMixB');P.insertBefore(cli,mix);
 const ex=document.querySelector('#pmExtra .chip');if(ex){ex.className='esTx';ex.textContent='+ Receber parte em outra moeda'}
 const go=document.getElementById('sgo');go.scrollIntoView({block:'end'});scrollTo(0,0);return [tot,cap]}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        if quer('38'):
            par(pw,'38a-app-dashboard-dia','App · Dashboard (o dia)',['Hoje: existem duas telas com os mesmos números — "Dashboard" (o dia, com um resumo do mês no fim) e "Resumo" (o mês).','Proposta: UMA tela "Dashboard" com o trilho Dia | Mês. Aqui, o Dia; o bloco repetido "Números do mês" sai.'],
              lambda pg,w:(pg.evaluate("()=>window.__LF.setView('dia')"),w(1200)),
              "()=>{const v=document.getElementById('v-dia');const t=v.querySelector('.top');t.querySelector('.crumb').textContent='O dia e o mês da loja.';t.after(window.__trk.esD);window.__trk.esD.style.margin='4px 0 16px';const c3=v.querySelector('.famC3');if(c3)c3.remove();return !!c3}",esc,tema,
              abre=lambda pw,e:(lambda r:(r[1].evaluate(TRK,[['Dia','Mês'],0,'esD']),r)[1])(ap.abre(pw,'inicio',e)),css='')
            par(pw,'38b-app-dashboard-mes','App · Dashboard (o mês)',['Hoje: a tela do mês chama "Resumo ▾" e tem um menu para Dinheiro, Giro e Preços (que já têm atalho próprio no Início).','Proposta: é o Mês do mesmo Dashboard, já com os 3 números aprovados (esboço 35); o nome "Resumo" e o menu saem.'],
              lambda pg,w:(pg.evaluate("()=>window.__LF.setView('dash')"),w(4200)),
              "()=>{const r=("+MUDA35+")();const v=document.getElementById('v-dash');const hd=v.querySelector('.dHd');const per=hd.querySelector('.dHdP');const top=document.createElement('div');top.className='top';top.innerHTML='<div><h1>Dashboard</h1><div class=\"crumb\">O dia e o mês da loja.</div></div>';hd.before(top);if(per){const cs=getComputedStyle(per);per.style.cssText='background:none;border:0;color:'+cs.color+';font:'+cs.font+';min-height:44px;padding:0;display:inline-flex;align-items:center;gap:6px;flex:none';top.appendChild(per)}hd.remove();top.after(window.__trk.esD);window.__trk.esD.style.margin='4px 0 12px';return r}",esc,tema,
              abre=lambda pw,e:(lambda r:(r[1].evaluate(TRK,[['Dia','Mês'],1,'esD']),r)[1])(ap.abre(pw,'inicio',e)),css=CSS35)
        if quer('39'):
            def prep39(pg,w):
                pg.evaluate("()=>window.__LF.setView('vendas')");w(800);pg.evaluate("()=>document.querySelector('#vRows .pcard[data-ref]').click()");w(1000);pg.evaluate(TOCA,'^Vender');w(1100);pg.evaluate("()=>document.querySelector('[data-act=cartopen]').click()");w(900);pg.evaluate(TOCA,'Confirmar pedido');w(1200)
                pg.evaluate(TRK,[['Dinheiro','Pix','Débito','Crédito'],0,'esF']);pg.evaluate(TRK,[['G$ Guarani','R$ Real','US$ Dólar'],0,'esM'])
            par(pw,'39-app-pagamento-luxo','App · Pagamento',['Hoje: total pequeno no canto, 4 botões soltos de pagamento (em 2 linhas) e 3 de moeda, cliente antes de tudo.','Proposta: o total em destaque, pagamento e moeda cada um num trilho único (arrastável), cliente depois do valor; a taxa da maquininha aparece embaixo do trilho só quando ela é escolhida.'],
              prep39,MUDA39,esc,tema,css=CSS39)
