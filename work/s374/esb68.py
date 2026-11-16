# S374 · esboço 68 (dono 16/11 14:56 "essa lista ta poluida demais"; 15:23 "Sim quero esboço", Mandar ao fornecedor FICA).
# Lista de compras limpa: linha de 2 andares (nome numa linha · "Tem 9 · ~7 dias"), agrupada por tipo, grau só em etiqueta,
# só os 5 mais urgentes + "ver os 14 ›", sem a caixa "Sobrando" (vira título "Sobrando · 2 · US$ 21"), parágrafo → "como calcula ›".
# Junto com o 67 (botões): 1 principal "Marcar como pedido", "Mandar ao fornecedor" secundária neutra, Oferta › texto rosa, − n + num seletor.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
exec(open('/home/claude/lafouch/work/s374/esb67.py').read().split('def tela')[0].split('CSS67=')[1].join(['CSS67=','']) if False else '')
CSS67=open('/home/claude/lafouch/work/s374/esb67.py').read().split('CSS67="""')[1].split('"""')[0].replace('#v-dash [data-act=lcEnvia]{display:none!important}\n','#v-dash [data-act=lcEnvia],')
CSS68=CSS67+"""
#v-dash .l68,#v-dash .l68 *,#v-dash .g68{text-align:left!important}
#v-dash .l68{display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}
#v-dash .l68:first-of-type{border-top:0}
#v-dash .l68 .n{display:flex;align-items:flex-start;flex-wrap:wrap;gap:6px;min-width:0;font-size:15px;color:var(--fg)}
#v-dash .l68 .n span{min-width:0;line-height:1.3}
#v-dash .l68 .n .lcG{flex:none}
#v-dash .l68 small{display:block;color:var(--mute);font-size:12.5px;margin-top:3px}
#v-dash .l68 small .lcSo{color:var(--warn)}#v-dash .l68 small.vira{color:var(--bad,#e07a7a)}
#v-dash .g68{font-size:12.5px;color:var(--sub);margin:12px 0 2px;font-weight:600}
#v-dash .s68{display:flex;justify-content:space-between;align-items:baseline;text-align:left!important;font-size:11.5px;letter-spacing:.12em;color:var(--sub)!important;margin:20px 0 4px;text-transform:uppercase;font-weight:600}
#v-dash .s68 b{letter-spacing:0;color:var(--warn);font-size:13px}
#v-dash .t68{color:var(--accent-fg);font-weight:600;background:none;border:0;padding:10px 0;font:inherit;font-weight:600;min-height:44px}
#v-dash .t68::after{content:' ›'}
#v-dash .v68{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-weight:600}
#v-dash .c68{display:flex;justify-content:flex-start;margin:-4px 0 2px}
"""
JS68=r"""()=>{const card=document.querySelector('#lcCard');if(!card)return 'sem card';
 const hint=card.querySelector(':scope>.hint');if(hint){const c=document.createElement('div');c.className='c68';c.innerHTML='<button class="t68" type="button">como calcula</button>';hint.replaceWith(c)}
 const sob=card.querySelector('.lcSobTop');let sobV='';if(sob){sobV=sob.querySelector(':scope>b').textContent;sob.remove()}
 const info=r=>{const sp=r.children[1];const tipo=(sp.querySelector('.hint')||{}).textContent||'';const g=sp.querySelector('.lcG');
   let nome='';sp.childNodes.forEach(n=>{if(n.nodeType==3)nome+=n.textContent});nome=nome.trim();
   const sm=[...sp.querySelectorAll('small')].map(s=>s.textContent).join(' · ');return {tipo:tipo.split('·')[0].trim(),g:g?g.outerHTML:'',nome,sm,sp}};
 let n=0;
 card.querySelectorAll('.lcSec').forEach(h=>{const sp=h.nextElementSibling;if(!sp||!sp.classList.contains('split'))return;const t=h.textContent.split('·')[0].trim();const tot=sp.children.length;
   const s68=document.createElement('div');s68.className='s68';s68.innerHTML='<span>'+t+' · '+tot+'</span>'+(/Sobrando/i.test(t)&&sobV?'<b>'+sobV+'</b>':'');h.replaceWith(s68);
   const rows=[...sp.children];const box=document.createElement('div');let last='';
   rows.forEach((r,i)=>{const x=info(r);const tem=(x.sm.match(/Tem \d+/)||[''])[0];const dias=(x.sm.match(/~\d+ dias/)||[''])[0];
     const so=(x.sm.match(/Sobra \d+/)||[''])[0];const vira=/virar parada/.test(x.sm);
     const d=document.createElement('div');d.className='l68';if(i>=5&&!/Sobrando/i.test(t))d.style.display='none';
     if(i<5&&x.tipo!==last){const g=document.createElement('div');g.className='g68';g.textContent=x.tipo;box.appendChild(g);last=x.tipo}
     const lado=r.querySelector('.lcQ')||r.querySelector('.lcV');
     d.innerHTML=r.children[0].outerHTML+'<div style="min-width:0"><div class="n"><span>'+x.nome+'</span>'+x.g+'</div><small>'+[tem,so?'<b class="lcSo">'+so+'</b>':'',dias?(so?'acaba em ':'')+dias:''].filter(Boolean).join(' · ')+'</small>'+(vira?'<small class="vira">vai virar parada</small>':'')+'</div>';
     if(lado.classList.contains('lcV')){const v=document.createElement('div');v.className='v68';v.innerHTML=lado.innerHTML;d.appendChild(v)}else d.appendChild(lado);
     box.appendChild(d);n++});
   sp.replaceWith(box);
   if(tot>5&&!/Sobrando/i.test(t)){const c=document.createElement('div');c.className='c68';c.innerHTML='<button class="t68" type="button">ver os '+tot+'</button>';box.after(c)}});
 return n}"""
def tela(pg,w):
    pg.evaluate("()=>{const L=window.__LF;L.S.dTab='giro';L.S.dfold={rep:true,vit:true};L.setView('dash')}");w(1500)
PARTES=[('a-topo','#lcCard','Lista de compras · começo',-110),('b-fim','[data-act=lcPedir]','Lista de compras · sobrando e ações',-560)]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,sel,tit,off in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(900);tela(pg,w)
                if prop: pg.add_style_tag(content=CSS68);print('  js',pg.evaluate(JS68));w(300)
                pg.evaluate("([s,o])=>{const e=document.querySelector(s);scrollTo(0,e.getBoundingClientRect().top+scrollY+o)}",[sel,off if not (prop==0 and nome=='a-topo') else -110]);w(350)
                oo.append(olho(pg));p=T+'g68_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('68%s-app-giro-lista-limpa-%s.jpg'%(nome,tema),'App · Giro › Lista de compras limpa · %s · tema %s'%(tit,tema),
              ['Hoje: cada peça ocupa 4–5 linhas (tipo, classe, Ideal, Tem, dias), texto centralizado, caixa "Sobrando" repetida, parágrafo no topo, as 14 peças sempre abertas.',
               'Proposta: 2 andares por peça (nome, até 2 linhas · "Tem 9 · ~7 dias"), agrupado por tipo, grau só na etiqueta, 5 mais urgentes + "ver os 14 ›", Sobrando com o valor no título, "como calcula ›". Botões do 67; "Mandar ao fornecedor" fica.'],*fs)
