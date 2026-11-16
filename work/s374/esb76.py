# S374 · esboço 76 (dono 16/11 18:37 "Clientes") — aba 9 da padronização dos botões, Clientes.
# Proposta: "Atacado ›" e "Cartões ›" em texto rosa · lista: nome na letra do app (hoje serifada), sem os selos de 10 px
# (BALCÃO, FIEL) — viram texto na linha de baixo ("balcão · cliente fiel", fiel em verde) — e "›" à direita ·
# ficha: 1 principal ("Salvar", contorno rosa) · "Avisar cliente" e "Conversar no WhatsApp" = secundárias neutras (o ícone do
# WhatsApp continua verde) · "Conta atacadista ›" em texto rosa, sem o emoji · × com 44 px.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
SEED="""()=>{const S=window.__LF.S;S.cliNext=S.cliNext||1;const n=[['Ana Lima','0981555111'],['Bruno Rojas','0972333444'],['Carla Benítez','0985111222'],['Diego Gómez','0991777888']];
 n.forEach((x,i)=>S.clientes.push({id:S.cliNext++,nome:x[0],tel:x[1],ruc:'',obs:'',email:i==0?'ana@ex.com':'',ts:Date.now()-i*86400000,orig:'balcao'}));
 const ids=S.clientes.map(c=>c.id);S.sales.slice(0,6).forEach((s,i)=>s.cliId=ids[i%2]);window.__LF.setView('clientes')}"""
CSS76="""
#v-clientes .lkGo{color:var(--accent-fg)!important;font-weight:600}
#v-clientes #cliList .card b{font-family:inherit!important;font-weight:600!important}
#v-clientes .c76{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 10px}
#v-clientes .c76 .ch{grid-row:1/4;grid-column:2;color:var(--mute);font-size:18px}
#v-clientes .c76 .f{color:var(--ok)}
#v-clientes [data-act=cliavisa]{border-color:var(--line)!important;color:var(--fg)!important}
#v-clientes a.chip[href*=wa]{background:none!important;border:1px solid var(--line)!important;color:var(--fg)!important;border-radius:999px;font-weight:600}
#v-clientes a.chip[href*=wa] svg{color:#25d366}
#v-clientes [data-act=ataConta]{border:0!important;background:none!important;color:var(--accent-fg)!important;font-weight:600;justify-content:flex-start!important;text-align:left;padding:10px 0!important;min-height:44px}
#v-clientes [data-act=clifecha]{min-height:44px!important;width:44px!important;border-radius:999px!important;background:none!important;border:1px solid var(--line)!important}
"""
JS76=r"""()=>{const v=document.getElementById('v-clientes');
 v.querySelectorAll('#cliList [data-act=cliab]').forEach(c=>{const b=c.querySelector('b');const ps=[...b.querySelectorAll('.pdPill')].map(p=>p.textContent.trim().toLowerCase());b.querySelectorAll('.pdPill').forEach(p=>p.remove());
   const h=[...c.querySelectorAll('.hint')];if(h[0]&&ps.length){const t=ps.map(x=>x==='fiel'?'<span class="f">cliente fiel</span>':x).join(' · ');h[0].innerHTML=t+' · '+h[0].innerHTML}
   c.classList.add('c76');const ch=document.createElement('span');ch.className='ch';ch.textContent='›';c.appendChild(ch)});
 const a=v.querySelector('[data-act=ataConta]');if(a)a.textContent='Conta atacadista ›';return 1}"""
PARTES=[('a-lista',0,'Lista'),('b-ficha',1,'Ficha do cliente')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,fi,tit in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate(SEED);w(800)
                if fi: pg.evaluate("()=>{const S=window.__LF.S;window.__LF.ACT.cliab(S.clientes[0].id)}");w(700)
                if prop: pg.add_style_tag(content=CSS76);pg.evaluate(JS76);w(300)
                if fi: pg.evaluate("()=>{const e=document.querySelector('#v-clientes [data-act=clisave]');scrollTo({top:e.getBoundingClientRect().top+scrollY-330,behavior:'instant'})}");w(300)
                oo.append(olho(pg));p=T+'c76_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('76%s-app-clientes-botoes-%s.jpg'%(nome,tema),'App · Clientes › botões (aba 9) · %s · tema %s'%(tit,tema),
              ['Hoje: "Atacado ›" e "Cartões ›" brancos; nomes na letra serifada com selos de 10 px (BALCÃO, FIEL); na ficha 2 botões principais ("Salvar" e "Avisar cliente"), "🏬 Conta Atacadista" com emoji, WhatsApp em cápsula verde.',
               'Proposta: links rosa · nome na letra do app, selos viram texto ("balcão · cliente fiel") e "›" · 1 principal ("Salvar") · "Avisar cliente" e WhatsApp em contorno neutro (ícone verde) · "Conta atacadista ›" texto rosa · × 44 px.'],*fs)
