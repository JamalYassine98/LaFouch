# S343: esboços pedidos pelo dono — (1) tela ATACADO do app (hoje = painel do site em Mensagens › Atacado); (2) CAPA do grupo "Loja e estoque".
# Telas reais (kit do painel e app real), blocos montados com as classes e cores do próprio app. Escuro e claro, celular. Nada implementado.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.path.insert(0,'/home/claude/lafouch/work/s321');import painel,base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s343/';T='/tmp/s330/'
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
    except Exception as e: return set()
CSS=""".esB{display:flex;flex-direction:column;gap:14px;margin-top:6px}.esC{background:var(--panel2);border:1px solid var(--line);border-radius:18px;padding:16px;display:flex;flex-direction:column;gap:2px}
.esC h2{margin:0 0 6px;font:400 19px/1.2 var(--display);color:var(--fg)}.esC .esS{color:var(--mute);font-size:13px;margin:-4px 0 8px}
.esR{display:flex;align-items:center;gap:12px;min-height:52px;padding:8px 0;border-top:1px solid var(--line);background:none;border-left:0;border-right:0;border-bottom:0;width:100%;text-align:left;color:var(--fg);font:inherit}
.esR:first-of-type{border-top:0}.esR b{display:block;font-weight:600;font-size:15px}.esR small{display:block;color:var(--mute);font-size:13px;margin-top:2px}.esR .g{flex:1;min-width:0}.esR i{font-style:normal;color:var(--mute);font-size:18px}
.esR .n{min-width:22px;height:22px;border-radius:11px;background:var(--pri-bd);color:var(--pri);font-size:12px;font-weight:700;display:grid;place-items:center;padding:0 6px}
.esV{align-self:flex-start;margin-top:8px;background:none;border:0;padding:8px 0;min-height:44px;color:var(--pri);font:600 14px inherit}"""
R=lambda t,s,n='':'<button type="button" class="esR"><span class="g"><b>%s</b><small>%s</small></span>%s<i>›</i></button>'%(t,s,('<span class="n">%s</span>'%n) if n else '')
ATACADO='<div class="top"><div><h1>Atacado</h1><div class="crumb">Lojistas, lotes e pedidos em quantidade.</div></div><button type="button" class="pgAc">+ Novo acesso</button></div><div class="esB">'+\
 '<section class="esC"><h2>Pedidos e mensagens</h2>'+R('Óptica Sol','Quer 20 peças · há 2 h','1')+R('Visión Centro','Pediu orçamento de 60 armações · ontem')+'</section>'+\
 '<section class="esC"><h2>Lojistas</h2>'+R('Óptica Sol','Conta ativa · 2 de 3 aparelhos')+R('Visitante','Acesso de 3 dias · vence amanhã')+'<button type="button" class="esV">Ver todos os lojistas ›</button></section>'+\
 '<section class="esC"><h2>Lotes</h2>'+R('Lote Kazwini','Aberto · 3 lojas · vence em 5 dias')+'<button type="button" class="esV">+ Criar lote</button></section>'+\
 '<section class="esC"><h2>Tabela e envio</h2>'+R('Preços de atacado','Ver a tabela como o lojista vê')+R('Enviar catálogo a um lojista','Link com os preços de atacado')+'</section></div>'
CAPA='<div class="top"><div><h1>Loja e estoque</h1><div class="crumb">Vender e cuidar das peças.</div></div></div><div class="esB">'+\
 '<section class="esC"><h2>Catálogo</h2><div class="esS">Escolha a peça e venda.</div>'+R('470 peças à venda','Varejo · G$')+R('Vendido hoje','3 vendas · G$ 147.500')+'<button type="button" class="esV">Abrir o Catálogo ›</button></section>'+\
 '<section class="esC"><h2>Inventário</h2><div class="esS">Cadastro, estoque e preço de cada peça.</div>'+R('Preço a corrigir','Peças com preço abaixo do piso','15')+R('24 para fotografar','Peças sem foto no Estúdio')+R('Reposição','Fornecedores com pedido aberto')+'<button type="button" class="esV">Abrir o Inventário ›</button></section></div>'
GRUPO="()=>{const L=window.__LF;L.S._gn={a:'estoque',b:'vendas'};L.ACT.grpCria()}"
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        # 1) Atacado: hoje = painel (Mensagens › Atacado)
        b,pg,w,_=painel.abre(pw,esc);painel.vai(pg,'msg');pg.evaluate("()=>{const x=[...document.querySelectorAll('#v_msg button')].find(e=>/^Atacado$/.test(e.innerText.trim()));x&&x.click()}");w(700)
        a=T+'at_h_%d.png'%esc;pg.screenshot(path=a);b.close()
        b,pg,w=base.abre(pw,'clientes',esc);o0=olho(pg);pg.add_style_tag(content=CSS)
        pg.evaluate("h=>{const v=document.getElementById('v-clientes');v.innerHTML=h;const n=[...document.querySelectorAll('#mainnav .mn')];n.forEach(x=>x.classList.remove('on'))}",ATACADO);w(500)
        p=T+'at_p_%d.png'%esc;pg.screenshot(path=p);o1=olho(pg);alt=pg.evaluate("()=>[document.scrollingElement.scrollHeight,innerHeight]");b.close()
        print('atacado',tema,'achados novos em relação à tela Clientes:',sorted(o1-o0) or 'nenhum','· altura',alt)
        prancha('21-app-atacado-%s.jpg'%tema,'App · tela Atacado · tema '+tema,['Hoje: o atalho Atacado abre o painel do site (Mensagens › Atacado).','Proposta: uma tela do próprio app com tudo do atacado (dados de exemplo).'],a,p)
        # 2) capa do grupo
        b,pg,w=base.abre(pw,'inicio',esc);pg.evaluate(GRUPO);w(1200);pg.evaluate("()=>window.__LF.setView('vendas')");w(1000);o0=olho(pg)
        a=T+'cp_h_%d.png'%esc;pg.screenshot(path=a);pg.add_style_tag(content=CSS)
        pg.evaluate("h=>{const v=document.getElementById('v-vendas');v.innerHTML=h;const g=document.querySelector('#grpTabs .gtRw');if(g){g.querySelectorAll('.on').forEach(x=>x.classList.remove('on'))}}",CAPA);w(500)
        p=T+'cp_p_%d.png'%esc;pg.screenshot(path=p);o1=olho(pg);b.close()
        print('capa',tema,'achados novos:',sorted(o1-o0) or 'nenhum')
        prancha('22-app-capa-do-grupo-%s.jpg'%tema,'App · grupo "Loja e estoque" · tema '+tema,['Hoje: tocar no grupo abre direto uma das telas (aqui, o Catálogo).','Proposta: a CAPA do grupo — o resumo de cada tela e a entrada para ela (dados de exemplo).'],a,p)
