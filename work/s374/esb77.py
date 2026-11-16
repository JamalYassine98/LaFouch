# S374 · esboço 77 (dono 16/11 18:43–18:48: "Conta atacadista e clientes, os dois" — refazer o design inteiro). Substitui o 76.
# CLIENTES · lista: um cartão só com linhas (como Ajustes): iniciais num círculo fino, nome, "balcão · cliente fiel · última 16/11", ›.
# FICHA: topo com iniciais (anel rosa fino), nome grande e "balcão · cliente fiel"; 2 atalhos redondos (WhatsApp verde, Avisar);
# DADOS num cartão de linhas (rótulo à esquerda, campo sem caixa à direita); 1 principal "Salvar"; ATACADO = linha
# "Conta atacadista · Ativa ›" (abre a janela); COMPRAS em linhas; "Remover cliente" centralizado (perigo em texto).
# CONTA ATACADISTA (janela): topo igual ao da ficha · APARELHOS (em uso 0 de 3; limite = um seletor − 3 + de 44 px) · ACESSO (chave
# "Pode trocar de aparelho" com a frase do estado certo — hoje diz "Desligado" com a chave ligada) · MOEDA = controle de 3 partes
# (como o Tema) · "Lotes de atacado ›" texto · principal "Enviar convite pelo WhatsApp" · no fim, centralizados: "Pausar conta" (neutro) e
# "Cancelar conta" (perigo), cada um com a frase do que faz.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
SEED="""()=>{const S=window.__LF.S;S.cliNext=S.cliNext||1;const n=[['Ana Lima','0981555111'],['Bruno Rojas','0972333444'],['Carla Benítez','0985111222'],['Diego Gómez','0991777888']];
 n.forEach((x,i)=>S.clientes.push({id:S.cliNext++,nome:x[0],tel:x[1],ruc:'',obs:'',email:i==0?'ana@ex.com':'',ts:Date.now()-i*86400000,orig:'balcao'}));
 const ids=S.clientes.map(c=>c.id);S.sales.slice(0,6).forEach((s,i)=>s.cliId=ids[i%2]);window.__LF.setView('clientes')}"""
CSS="""
.av77{flex:none;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:13px;font-weight:600;color:var(--accent-fg);letter-spacing:.02em}
.av77.g{width:64px;height:64px;font-size:20px;border:1.5px solid var(--accent)}
.gp77{background:var(--panel);border:1px solid var(--line);border-radius:18px;overflow:hidden}
.rw77{display:flex;align-items:center;gap:12px;padding:6px 16px;min-height:56px;width:100%;background:none;border:0;border-top:1px solid var(--line);font:inherit;color:var(--fg);text-align:left}
.gp77>.rw77:first-child{border-top:0}
.rw77 .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.rw77 .tx b{font-weight:600;font-size:15.5px}.rw77 .tx small{color:var(--mute);font-size:12.5px}
.rw77 .ch{color:var(--mute);font-size:18px}.rw77 .vl{font-weight:600;white-space:nowrap}.f77{color:var(--ok)}
.rw77 label{flex:none;width:92px;color:var(--mute);font-size:13px}
.rw77 input,.rw77 select{flex:1;min-width:0;height:44px;background:none;border:0;color:var(--fg);font:inherit;font-size:15px;text-align:right;padding:0;outline:none}
.rw77 input::placeholder{color:var(--mute)}
.lb77{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:var(--sub);margin:18px 4px 8px}
.hd77{display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px 0 4px;text-align:center}
.hd77 h2{margin:4px 0 0;font-size:22px;font-weight:600;font-family:inherit}.hd77 small{color:var(--mute);font-size:13px}
.qa77{display:flex;justify-content:center;gap:28px;margin:14px 0 4px}
.qa77 button{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;font:inherit;font-size:12.5px;color:var(--sub)}
.qa77 i{width:48px;height:48px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-style:normal;color:var(--fg)}
.qa77 svg{width:20px;height:20px}
.go77{width:100%;min-height:50px;border-radius:999px;border:1px solid var(--accent);background:none;color:var(--accent-fg);font:inherit;font-weight:600;font-size:16px;margin-top:16px}
.dz77{display:flex;flex-direction:column;align-items:center;gap:2px;margin-top:22px}
.dz77 button{background:none;border:0;font:inherit;font-weight:600;min-height:44px;color:var(--fg)}.dz77 button.r{color:var(--bad,#e07a7a)}.dz77 small{color:var(--mute);font-size:12px;margin:-8px 0 10px}
.x77{position:absolute;right:14px;top:14px;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:none;color:var(--fg);font-size:20px}
.cf77{position:relative;padding:18px 16px 20px!important}
.sg77{display:flex;background:var(--panel2);border:1px solid var(--line);border-radius:999px;padding:3px;margin:0 16px 14px}
.sg77 button{flex:1;min-height:40px;border:0;background:none;border-radius:999px;font:inherit;font-weight:600;color:var(--mute)}.sg77 button.on{background:var(--panel);color:var(--fg);box-shadow:0 1px 3px rgba(0,0,0,.25)}
.st77{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:999px;height:44px}
.st77 button{width:44px;height:42px;border:0;background:none;color:var(--fg);font-size:18px}.st77 b{min-width:24px;text-align:center}
.tg77{flex:none;width:52px;height:32px;border-radius:999px;background:var(--accent);position:relative}.tg77::after{content:'';position:absolute;right:3px;top:3px;width:26px;height:26px;border-radius:50%;background:#fff}
.lk77{background:none;border:0;font:inherit;font-weight:600;color:var(--accent-fg);min-height:44px;padding:0 4px}
.cp77 .tx b{font-weight:500}
#v-clientes .lkGo{color:var(--accent-fg)!important;font-weight:600}
"""
WA='<svg viewBox="0 0 24 24" fill="#25d366"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.6.4 0 .1 0 .7-.2 1.3z"/></svg>'
BELL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>'
JS_LISTA=r"""()=>{const S=window.__LF.S,l=document.getElementById('cliList');const ini=n=>String(n||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
 const rows=[...l.querySelectorAll('[data-act=cliab]')].map(b=>{const c=S.clientes.find(x=>String(x.id)===b.dataset.id);const fiel=/FIEL/.test(b.textContent);const ult=(b.textContent.match(/última ([\d/]+)/)||[])[1];
   return '<button type="button" class="rw77"><span class="av77">'+ini(c.nome)+'</span><span class="tx"><b>'+c.nome+'</b><small>balcão'+(fiel?' · <span class="f77">cliente fiel</span>':'')+(ult?' · última '+ult:'')+'</small></span><span class="ch">›</span></button>'}).join('');
 l.outerHTML='<div class="gp77">'+rows+'</div>';return 1}"""
JS_FICHA=r"""(ic)=>{const S=window.__LF.S,c=S.clientes[0],sec=document.querySelector('#v-clientes section.card');const ini=String(c.nome).split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
 const comp=[...sec.querySelectorAll('.sl')].slice(-3).map(r=>{const sp=r.querySelector('span');const tit=sp.childNodes[0].textContent,sm=(sp.querySelector('small')||{}).textContent||'';return '<div class="rw77 cp77"><span class="tx"><b>'+sm+'</b><small>'+tit+'</small></span><span class="vl">'+r.querySelector('b').textContent+'</span></div>'}).join('');
 sec.className='card col cf77';sec.innerHTML='<button class="x77" aria-label="Fechar">×</button><div class="hd77"><span class="av77 g">'+ini+'</span><h2>'+c.nome+'</h2><small>balcão · <span class="f77">cliente fiel</span> · desde 16/11</small></div>'+
  '<div class="qa77"><button><i>'+ic[0]+'</i>WhatsApp</button><button><i>'+ic[1]+'</i>Avisar</button></div>'+
  '<div class="lb77">Dados</div><div class="gp77">'+[['Nome',c.nome],['Telefone',c.tel],['E-mail',c.email],['Documento','','RUC 80012345-6'],['Tabela','Público'],['Observação','','opcional']].map(r=>'<div class="rw77"><label>'+r[0]+'</label><input value="'+r[1]+'" placeholder="'+(r[2]||'')+'"></div>').join('')+'</div>'+
  '<button class="go77">Salvar</button>'+
  '<div class="lb77">Atacado</div><div class="gp77"><button class="rw77"><span class="tx"><b>Conta atacadista</b><small>catálogo com preço de atacado</small></span><span class="vl f77">Ativa</span><span class="ch">›</span></button></div>'+
  '<div class="lb77">Compras · 3</div><div class="gp77">'+comp+'</div>'+
  '<div class="dz77"><button class="r">Remover cliente</button></div>';return 1}"""
JS_ATA=r"""()=>{const S=window.__LF.S,c=Object.values(S.ataContas)[0];const jn=[...document.querySelectorAll('.ljJn')].pop();jn.querySelector('.ljHd b').textContent='Conta atacadista';
 const ini=String(c.nome).split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();const co=jn.querySelector('.ljCorpo');
 co.innerHTML='<div style="padding:0 16px 20px"><div class="hd77"><span class="av77 g">'+ini+'</span><h2>'+c.nome+'</h2><small>Cliente associado · <span class="f77">Ativa</span> · não vence · Atacado 1K</small></div>'+
  '<div class="lb77">Aparelhos</div><div class="gp77"><div class="rw77"><span class="tx"><b>Em uso</b><small>ainda não entrou de nenhum aparelho</small></span><span class="vl">0 de 3</span></div><div class="rw77"><span class="tx"><b>Limite</b></span><span class="st77"><button>−</button><b>3</b><button>+</button></span></div></div>'+
  '<div class="lb77">Acesso</div><div class="gp77"><div class="rw77"><span class="tx"><b>Pode trocar de aparelho</b><small>Ligado: ele troca sozinho, até o limite</small></span><span class="tg77"></span></div></div>'+
  '<div class="lb77">Moeda que ele vê primeiro</div><div class="sg77" style="margin:0"><button class="on">US$</button><button>Gs.</button><button>R$</button></div>'+
  '<div style="margin-top:12px"><button class="lk77">Lotes de atacado ›</button></div>'+
  '<button class="go77">Enviar convite pelo WhatsApp</button>'+
  '<div class="dz77"><button>Pausar conta</button><small>o catálogo some; nada é apagado; volta com 1 toque</small><button class="r">Cancelar conta</button><small>apaga o acesso; para voltar, novo convite</small></div></div>';return 1}"""
def abre(pw,esc,qual,prop):
    b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate(SEED);w(800)
    if prop: pg.add_style_tag(content=CSS)
    if qual=='lista':
        if prop: pg.evaluate(JS_LISTA)
    elif qual.startswith('ficha'):
        pg.evaluate("()=>{const S=window.__LF.S;window.__LF.ACT.ataConta(S.clientes[0].id)}");w(600);pg.evaluate("()=>{document.querySelectorAll('.ljJn,.ljBk').forEach(e=>e.remove());document.body.classList.remove('folhaAberta');const t=document.getElementById('lfToast');if(t)t.remove()}")
        pg.evaluate("()=>{const S=window.__LF.S;window.__LF.ACT.cliab(S.clientes[0].id)}");w(700)
        if prop: pg.evaluate(JS_FICHA,[WA,BELL])
    else:
        pg.evaluate("()=>{const S=window.__LF.S;window.__LF.ACT.ataConta(S.clientes[0].id)}");w(1200)
        if prop: pg.evaluate(JS_ATA)
    w(400);return b,pg,w
import os
PARTES=[('a-lista','lista',None),('b-ficha-topo','ficha','top'),('c-ficha-fim','ficha2','fim'),('d-atacado-topo','ata','top'),('e-atacado-fim','ata2','fim')]
if os.environ.get('SO'): PARTES=[x for x in PARTES if x[0] in os.environ['SO'].split(',')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,qual,pos in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=abre(pw,esc,qual,prop)
                if pos=='fim':
                    if qual=='ficha2': pg.evaluate("()=>scrollTo({top:99999,behavior:'instant'})")
                    else: pg.evaluate("()=>{const c=[...document.querySelectorAll('.ljJn')].pop();const s=c.querySelector('.ljCorpo');(s.scrollHeight>s.clientHeight?s:c).scrollTop=99999}")
                    w(400)
                oo.append(olho(pg));p=T+'k77_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('77%s-app-clientes-novo-design-%s.jpg'%(nome,tema),'App · Clientes e Conta atacadista · novo design · %s · tema %s'%(nome[2:].replace('-',' '),tema),
              ['Hoje: lista em cartões soltos com selos de 10 px; ficha = formulário de caixas + 4 botões empilhados (2 principais, emoji, cápsula verde); janela do atacado com botões cheios rosa e salmão, − e + de 24 px, moedas em cápsulas e a frase "Desligado" com a chave ligada.',
               'Proposta: listas em cartão de linhas (como Ajustes), iniciais num círculo fino · ficha com topo, 2 atalhos (WhatsApp, Avisar), dados em linhas, 1 principal "Salvar", "Conta atacadista · Ativa ›" · janela: seções em linhas, limite − 3 +, chave com a frase certa, moeda em 3 partes, "Enviar convite" principal, Pausar/Cancelar no fim, centralizados.'],*fs)
