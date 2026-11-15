# S343 v2 (pedido do dono 15/11 15:17): (1) ATACADO como parte do app, DIVIDIDO em abas (uma coisa por vez); (2) GRUPO = interface NOVA
# que junta as duas telas numa só (Inventário + Catálogo → "Loja e estoque"), com todas as funções alinhadas. App real, escuro e claro. Nada implementado.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.path.insert(0,'/home/claude/lafouch/work/s321');import painel,base
from playwright.sync_api import sync_playwright
exec(open('/home/claude/lafouch/work/s343/esb.py').read().split("GRUPO=")[0].split("ATACADO=")[0])  # prancha, olho, CSS, R
OUT='/home/claude/lafouch/work/s343/'
CSS2=CSS+""".esT{margin:10px 0 14px}.esT button{min-width:48px;min-height:44px}.esC{padding:6px 16px}.esC .esR:first-child{border-top:0}.esVz{color:var(--mute);font-size:13px;padding:2px 2px 0}
.pcard small.esK{display:block;color:var(--mute);font-size:12px;font-weight:400;margin-top:2px}.esAl{display:flex;justify-content:space-between;align-items:center;min-height:44px;padding:0 2px;margin:2px 0 8px;background:none;border:0;width:100%;color:var(--fg);font:inherit;font-size:14px}.esAl b{color:var(--pri);font-weight:600}"""
ABAS="""a=>{const [nomes,sel,bdg]=a;const m=document.createElement('div');m.className='lfAbas esT';m.id='esTabs';m.setAttribute('role','group');
 m.innerHTML=nomes.map((n,i)=>'<button type="button" class="'+(i===sel?'on':'')+'" aria-pressed="'+(i===sel)+'">'+n+(bdg&&bdg[i]?' <em class="bdg">'+bdg[i]+'</em>':'')+'</button>').join('');window.__esT=m;return 1}"""
LINHA="""()=>{try{window.lfLinhaAbas('esTabs','.on')}catch(e){};const m=document.getElementById('esTabs'),o=m.querySelector('.on'),l=m.querySelector('.lfLinha');if(l&&o){const r=o.getBoundingClientRect(),p=m.getBoundingClientRect();l.style.transition='none';l.style.left=(r.left-p.left)+'px';l.style.width=r.width+'px'}return !!l}"""
def atacado(pg,w,aba):
    conteudo=['<section class="esC">'+R('Óptica Sol','Quer 20 peças · há 2 h','1')+R('Visión Centro','Pediu orçamento de 60 armações · ontem')+'</section><div class="esVz">Mensagens e pedidos de lojistas que chegam pelo site.</div>',
              '','<section class="esC">'+R('Lote Kazwini','Aberto · 3 lojas · vence em 5 dias')+R('Lote Acetatos','Aberto · 1 loja · vence em 12 dias')+'</section><button type="button" class="esV">+ Criar lote</button>'][aba]
    pg.evaluate(ABAS,[['Mensagens','Lojistas','Lotes','Tabela'],aba])
    pg.evaluate("h=>{const v=document.getElementById('v-clientes');v.innerHTML='<div class=\"top\"><div><h1>Atacado</h1><div class=\"crumb\">Lojistas, lotes e pedidos em quantidade.</div></div><button type=\"button\" class=\"pgAc\">+ Novo acesso</button></div>';v.appendChild(window.__esT);v.insertAdjacentHTML('beforeend',h);document.querySelectorAll('#mainnav .mn').forEach(x=>x.classList.remove('on'))}",conteudo);w(300);pg.evaluate(LINHA);w(300)
UNE="""()=>{const L=window.__LF,S=L.S,v=document.getElementById('v-vendas');const q=s=>v.querySelector(s);
 q('.top h1').textContent='Loja e estoque';const cr=q('.top .crumb');if(cr)cr.textContent='Vender e cuidar das peças no mesmo lugar.';
 const add=document.getElementById('btnAdd').cloneNode(true);add.removeAttribute('id');const tp=q('.top');tp.appendChild(add);add.style.cssText='margin:0 0 0 8px;flex:none';
 const m=document.createElement('div');m.className='lfAbas esT';m.id='esTabs';m.innerHTML='<button type="button" class="on" aria-pressed="true">Peças</button><button type="button" aria-pressed="false">Fornecedores <em class="bdg">1</em></button><button type="button" aria-pressed="false">Reposição</button>';tp.parentNode.insertBefore(m,tp.nextSibling);
 const mc=tp.querySelector('.mcBtn'),bx=v.querySelector('.cjBx');if(mc&&bx){bx.insertBefore(mc,bx.firstChild);mc.className='ic0 cjIc'}
 const est={};(S.items||[]).forEach(it=>{if(it&&it.ref)est[it.ref]=(est[it.ref]||0)+(+it.qty||0)});
 v.querySelectorAll('#vRows .pcard[data-ref]').forEach(c=>{const b=c.querySelector('b');if(b&&!c.querySelector('.esK'))b.insertAdjacentHTML('afterend','<small class="esK">'+c.dataset.ref+' · '+(est[c.dataset.ref]||0)+' em estoque</small>')});
 const g=document.getElementById('grpTabs');if(g){g.hidden=true;g.style.display='none'}
 const lista=document.getElementById('vListCard')||document.getElementById('vRows').parentNode;lista.insertAdjacentHTML('beforebegin','<button type="button" class="esAl"><span>16 referências · 15 preços a corrigir</span><b>Ver ›</b></button>');return 1}"""
GRUPO="()=>{const L=window.__LF;L.S._gn={a:'estoque',b:'vendas'};L.ACT.grpCria()}"
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w,_=painel.abre(pw,esc);painel.vai(pg,'msg');pg.evaluate("()=>{const x=[...document.querySelectorAll('#v_msg button')].find(e=>/^Atacado$/.test(e.innerText.trim()));x&&x.click()}");w(700)
        hoje=T+'a2_h_%d.png'%esc;pg.screenshot(path=hoje);b.close()
        for aba,nm,sub in ((0,'mensagens',['Hoje: o atalho Atacado abre o painel do site numa janela.','Proposta: tela do próprio app, dividida em abas — aqui, só as mensagens e pedidos.']),(2,'lotes',['Hoje: os lotes ficam em Clientes › Lotes; as mensagens, no painel.','Proposta: a aba Lotes da mesma tela Atacado.'])):
            b,pg,w=base.abre(pw,'clientes',esc);o0=olho(pg);pg.add_style_tag(content=CSS2);atacado(pg,w,aba)
            p=T+'a2_p_%d_%d.png'%(esc,aba);pg.screenshot(path=p);o1=olho(pg);b.close()
            print('atacado',nm,tema,'achados novos:',sorted(o1-o0) or 'nenhum')
            prancha('23-app-atacado-%s-%s.jpg'%(nm,tema),'App · Atacado › %s · tema %s'%(nm.capitalize(),tema),sub,hoje,p)
        b,pg,w=base.abre(pw,'inicio',esc);pg.evaluate(GRUPO);w(1200);pg.evaluate("()=>window.__LF.setView('vendas')");w(1000);o0=olho(pg)
        a=T+'g2_h_%d.png'%esc;pg.screenshot(path=a);pg.add_style_tag(content=CSS2);print('  une:',pg.evaluate(UNE));w(300);pg.evaluate(LINHA);w(400)
        p=T+'g2_p_%d.png'%esc;pg.screenshot(path=p);o1=olho(pg);b.close()
        print('grupo',tema,'achados novos:',sorted(o1-o0) or 'nenhum')
        prancha('24-app-grupo-tela-unica-%s.jpg'%tema,'App · grupo Inventário + Catálogo = uma tela só · tema '+tema,['Hoje: o grupo só põe as duas telas em abas (Inventário | Catálogo).','Proposta: UMA tela com as funções das duas: buscar, vender (+), estoque de cada peça, + Adicionar, Fornecedores e Reposição.'],a,p)
