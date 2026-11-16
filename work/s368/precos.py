# S368 · esboço 52 (v2, no padrão de luxo — pedido do dono 16/11 01:09): PREÇOS com menos poluição (pedido do dono, 16/11 01:02). Em "Para decidir esta semana" as linhas "Atacado X com margem N%"
# (uma por peça e por tabela) viram UMA linha por tabela. App real, celular, claro e escuro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s368/'
from playwright.sync_api import sync_playwright
CSS="""#v-dash .cnt.lx .cntG{gap:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
#v-dash .cnt.lx .cntK{background:none!important;border:0!important;border-radius:0!important;padding:16px 4px!important;gap:4px}
#v-dash .cnt.lx .cntK:nth-child(odd){border-right:1px solid var(--line)!important;padding-right:14px!important}#v-dash .cnt.lx .cntK:nth-child(even){padding-left:16px!important}
#v-dash .cnt.lx .cntK:nth-child(n+3){border-top:1px solid var(--line)!important}
#v-dash .cnt.lx .cntK small{font-size:13px}#v-dash .cnt.lx .cntK b{font:400 28px/1.15 var(--display);letter-spacing:-.01em}
#v-dash .cnt.lx .cntD{background:none!important;border:0!important;box-shadow:none!important;padding:8px 0 0!important;border-radius:0!important}
#v-dash .cnt.lx .cntD .lbl{margin:10px 0 2px}
#v-dash .cnt.lx .cntL{padding:16px 0;gap:14px;flex-wrap:nowrap;border-top:1px solid var(--line)}#v-dash .cnt.lx .cntD .lbl+.cntL{border-top:0}
#v-dash .cnt.lx .cntL>span.cntI{display:none}#v-dash .cnt.lx .cntL>div{flex:1;min-width:0}
#v-dash .cnt.lx .cntL b{font-weight:500;font-size:15px;display:block}#v-dash .cnt.lx .cntL small{display:block;color:var(--mute);font-size:13px;margin-top:2px}
#v-dash .cnt.lx .cntV,#v-dash .cnt.lx .lxT{background:none;border:0;min-height:44px;min-width:44px;padding:0 2px;color:var(--accent-fg)!important;font:500 14px inherit;text-decoration:underline;text-underline-offset:4px;white-space:nowrap;flex:none}
#v-dash .cnt.lx .lxT.m{color:var(--mute)!important;text-decoration-color:var(--line)}
#v-dash .cnt.lx .cntB{justify-content:center;gap:22px;margin-top:6px}#v-dash .cnt.lx .cntD .cntB{flex-direction:column;align-items:stretch;gap:4px;margin-top:14px}#v-dash .cnt.lx .cntD .cntB .lxT{align-self:center}"""
MUDA="""()=>{const D=document.querySelector('#v-dash .cntD');const L=[...D.querySelectorAll('.cntL')];const g={},pa={};
 L.forEach(l=>{const b=l.querySelector('b').innerText.trim(),s=l.querySelector('small').innerText.trim();
  const m=/^Atacado (\\S+) com margem (-?\\d+)%/.exec(b);
  if(m){const tab=s.split(' · ')[0];if(!g[tab]){g[tab]={n:0,min:999,l:l}}else l.remove();g[tab].n++;g[tab].min=Math.min(g[tab].min,+m[2]);return}
  const k=/^(Subir|Oferta|Volta ao preço) /.exec(b);if(k){const t=k[1];if(!pa[t]){pa[t]={n:0,l:l,mot:s.split(' · ')[0]}}else l.remove();pa[t].n++}});
 Object.keys(g).forEach(t=>{const x=g[t];x.l.querySelector('b').textContent='Tabela '+t+': '+x.n+(x.n===1?' peça':' peças')+' com margem baixa';x.l.querySelector('small').textContent='abaixo de 10% · a menor está em '+x.min+'%';const v=x.l.querySelector('.cntV');if(v){v.textContent='ajustar tabela';v.style.minHeight='44px';v.style.minWidth='44px'}});
 Object.keys(pa).forEach(t=>{const x=pa[t];if(x.n<2)return;const nome={Subir:'Subir '+x.n+' preços',Oferta:'Pôr '+x.n+' peças em oferta','Volta ao preço':x.n+' peças voltam ao preço'}[t];x.l.querySelector('b').textContent=nome;x.l.querySelector('small').textContent=x.mot;const em=x.l.querySelector('em');if(em)em.textContent='';});
 document.querySelector('#v-dash .cnt').classList.add('lx');
 [...document.querySelectorAll('#v-dash .cnt .cntB button')].forEach(b=>{if(b.classList.contains('go'))return;b.className='lxT m'});
 Object.keys(pa).forEach(t=>{const x=pa[t];if(x.n<2)return;const em=x.l.querySelector('em');if(em){const k=document.createElement('button');k.type='button';k.className='lxT';k.textContent='ver um por um';em.replaceWith(k)}});
 const um=[...D.querySelectorAll('.cntB button')].find(b=>/Ver um por um/.test(b.textContent));if(um)um.remove();
 const ac=D.querySelector('.cntB .go');if(ac&&pa.Subir)ac.textContent='Aceitar os '+pa.Subir.n+' preços';
 const n=D.querySelectorAll('.cntL').length;const lb=D.querySelector('.lbl');lb.textContent=lb.textContent.replace(/· \\d+/,'· '+n);return [L.length,n,Object.keys(g),Object.keys(pa)]}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[];al=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);pg.evaluate("()=>{const L=window.__LF;L.S.dTab='prec';L.setView('dash')}");w(1800)
            if prop: pg.add_style_tag(content=CSS);print('   ',pg.evaluate(MUDA));w(400)
            al.append(pg.evaluate("()=>document.scrollingElement.scrollHeight"))
            pg.evaluate("()=>{const d=document.querySelector('#v-dash .cnt');d.scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-20)}");w(300)
            p=T+'prc_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);o=olho(pg);pg.evaluate('()=>scrollBy(0,500)');w(300);o|=olho(pg);oo.append(o);b.close()
        print('preços',tema,'achados novos:',novos(oo[0],oo[1]),'alturas',al)
        prancha('52-app-precos-luxo-%s.jpg'%tema,'App · Preços no padrão de luxo · tema '+tema,
          ['Hoje: uma linha para cada peça — cada preço a subir e cada peça de cada tabela de atacado (página de %d px).'%al[0],'Proposta: uma linha por ASSUNTO, no padrão do Pagamento — números sem caixa, linhas finas, ações como texto e um só botão principal (%d px).'%al[1]],*fs)
