# S431 · esboços 142: correções do que a revisão achou (por cima da base inteira)
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C);comum.OUT='/home/claude/lafouch/work/s431/';T='/tmp/s431/';os.makedirs(T,exist_ok=True)
A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00'};return 1}"
ORD="""()=>{document.querySelectorAll('.sg418').forEach(s=>{const bs=[...s.querySelectorAll('button')];const us=bs.find(b=>b.textContent.trim()=='US$'),rs=bs.find(b=>b.textContent.trim()=='R$');if(us&&rs&&us.compareDocumentPosition(rs)&Node.DOCUMENT_POSITION_FOLLOWING)s.insertBefore(rs,us);const th=s.querySelector('.trkTh'),on=s.querySelector('button.on')||bs[0];if(th&&on){th.style.setProperty('left',on.offsetLeft+'px','important');th.style.setProperty('width',on.offsetWidth+'px','important')}})}"""
CASOS=[
 ('a','guardiao','Guardião (aprovado 132) alinhado',D['guardiao'],
  '.ljJn:has(.cxSaldo) .ljCorpo>.col{padding-left:0!important;padding-right:0!important}.ljJn:has(.cxSaldo) .cxL button{padding-right:0!important;padding-left:0!important;text-align:right!important;justify-content:flex-end!important;min-width:0!important;position:relative!important}.ljJn:has(.cxSaldo) .cxL button::after{content:"";position:absolute;inset:-10px -12px}',[],
  'Hoje (132 aprovado): linhas 16 px para dentro do título; "Conferir ›"/"Ver ›" terminam antes do ✓.',
  'Depois: tudo começa na margem do título "Guardião" e termina na mesma margem à direita (regras 1 e 3).'),
 ('b','caixa-versalete','Caixa (aprovado 135b) — versaletes do mesmo tamanho',D['caixa-movimentos']+["()=>{const e=[...document.querySelectorAll('#v-caixa h2')].find(x=>/Objetivos/.test(x.textContent));e&&e.scrollIntoView({block:'center'})}"],
  '#v-caixa h2,#v-caixa .cxLb{font-size:12px!important;letter-spacing:1.68px!important}',[],
  'Hoje (135b aprovado): "OBJETIVOS DA LOJA" maior (16 px) que "NO CAIXA AGORA" (12 px) e "MOVIMENTOS" (11 px).',
  'Depois: os três versaletes do Caixa no mesmo tamanho e espaçamento (12 px), regra T.'),
 ('c','lotes-vazio','Atacado › Lotes vazio (aprovado 135c)',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('lot')"],
  '#ataCorpo .ataMais{display:block!important;margin:16px auto 0!important;text-decoration:none!important;color:var(--fg)!important}',
  ["""()=>{const ic={'Nenhum lote':'<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>','Nenhuma mensagem':'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'};document.querySelectorAll('.ataVz,.view svg').forEach(()=>{});const v=[...document.querySelectorAll('.view')].find(x=>x.getBoundingClientRect().height);if(!v)return;const t=v.textContent;const k=Object.keys(ic).find(x=>t.includes(x));if(!k)return;const s=[...v.querySelectorAll('svg')].find(x=>x.getBoundingClientRect().width>40);if(s&&!s.dataset.i142){s.dataset.i142=1;s.setAttribute('viewBox','0 0 24 24');s.innerHTML=ic[k]}}"""],
  'Hoje (135c): tela vazia centralizada, mas "+ Criar lote" à esquerda e sublinhado; o ícone é de pessoa (de cliente) também em Lotes e Mensagens.',
  'Depois: "+ Criar lote" centralizado com o resto, sem sublinhado; ícone de cada assunto (caixa para Lotes, balão para Mensagens). Na Tabela sai o ícone (ela não é tela vazia).'),
 ('d','editar-produto','Inventário › Editar produto (aprovado 134d)',D['inventario-editar'],
  '.modal-box:has(#edSalvar) h2{font-family:inherit!important;font-size:18px!important;font-weight:600!important}.edMais>summary{list-style:none!important}.edMais>summary::-webkit-details-marker{display:none}.edMais>summary::marker{content:""}',
  ["()=>{const b=document.getElementById('edSalvar');if(b)b.textContent='Salvar';const s=document.querySelector('.edMais>summary');if(s&&!s.dataset.c142){s.dataset.c142=1;s.textContent=s.textContent.trim()+' ⌄'}}"],
  'Hoje (134d): título "Editar produto" com serifa (as outras janelas não); botão "Salvar alterações"; "▸ MAIS DETALHES" com triângulo.',
  'Depois: título na letra das janelas (como "Novo cliente", "Nova despesa"); um "Salvar" (regra dos formulários); "MAIS DETALHES ⌄" (abre no lugar).'),
 ('e','carrinho-mais','Carrinho › "+ Adicionar outra peça" (grupo do 141)',D['catalogo-carrinho']+["()=>{const e=document.getElementById('cartSlot');e&&e.scrollIntoView({block:'center'})}"],
  '#cartSlot{text-decoration:none!important;align-self:flex-start!important;margin-left:0!important;padding-left:0!important;text-align:left!important}',[],
  'Hoje: "+ Adicionar outra peça" centralizado e sublinhado — diferente do "+ Receber parte em outra moeda" aprovado no 141.',
  'Depois: igual ao 141 — branco, sem sublinhado, encostado à esquerda.'),
 ('f','retirada-ordem','Caixa › Retirada (aprovado 135e) — ordem das moedas',D['caixa-retirar'],'',[ORD],
  'Hoje (135e): G$ · US$ · R$. No resto do app (Pagamento, Livre para você, Dashboard): G$ · R$ · US$.',
  'Depois: G$ · R$ · US$ em todo lugar (regra N). Vale também para Registrar troca (De/Para).'),
 ('g','troca-linhas','Câmbio › Registrar troca (aprovado 135f) — linhas e ordem',[LM]+D['cambio-troca'],
  '',[ORD,"""()=>{document.querySelectorAll('.fjJn .cxL input,.ljJn .cxL input').forEach(i=>{[['border-bottom','0'],['padding-right','0'],['text-align','right'],['background','none']].forEach(q=>i.style.setProperty(q[0],q[1],'important'))})}"""],
  'Hoje (135f): a linha fina fica só embaixo do número (meia largura) e o número não termina na margem; moedas G$ · US$ · R$.',
  'Depois: a linha atravessa a linha inteira (nome à esquerda, valor na margem direita, P3); moedas G$ · R$ · US$.'),

 ('h','pagamento','Catálogo › Pagamento',D['catalogo-pagamento']+["()=>{const e=document.getElementById('pisoSt');e&&e.scrollIntoView({block:'center'})}"],
  '#vSaleCard{background:none!important;border:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important;border-radius:0!important}#payB input.in{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}#pisoSt{background:none!important;padding:0!important;border-radius:0!important}',[],
  'Hoje: a tela inteira dentro de um cartão; "Valor recebido" e "Cliente" em caixas; aviso numa caixa vermelha.',
  'Depois: sem o cartão (como o Dashboard e a ficha aprovada 134); campos em linha fina (P3); aviso como frase vermelha (como o aviso do Caixa, 135b).'),
 ('i','carrinho','Catálogo › Carrinho',D['catalogo-carrinho'],
  '#cartCard{background:none!important;border:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important;border-radius:0!important}',[],
  'Hoje: o carrinho inteiro dentro de um cartão.',
  'Depois: sem o cartão, como as outras telas aprovadas; o resto igual (inclui o 142e).'),
 ('j','peca','Catálogo › Peça',D['catalogo-peca'],
  '#vDetail{background:none!important;border:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important;border-radius:0!important}#vDetail .pl.pick{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;padding-left:0!important}#vDetail .vbar.vsale{background:none!important;border:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}#vDetail .vbar button:not(.go){border-radius:50%!important;background:none!important;border:1px solid var(--line)!important}',[],
  'Hoje: a peça dentro de um cartão; o grau numa caixa rosa; "−"/"+" quadrados numa caixa.',
  'Depois: sem cartão; o grau em linha fina (escolhido = letra firme); "−"/"+" redondos como o "+" de adicionar; sem caixa em volta do Vender.'),
 ('k','nova-despesa','Despesas › Nova despesa (aprovado 136d) — campo tocado',D['despesas-nova'],
  'input:focus,select:focus,textarea:focus{outline:none!important;box-shadow:none!important;border-bottom-color:var(--accent-fg)!important}',["()=>{const i=[...document.querySelectorAll('input')].find(x=>x.getBoundingClientRect().height&&/Nome/.test(x.placeholder));if(i){i.focus();i.style.setProperty('border-bottom','1px solid var(--accent-fg)','important')}}"],
  'Hoje: ao tocar num campo aparece um retângulo rosa de canto reto (o resto do app não tem caixa).',
  'Depois: o campo tocado só deixa a linha fina rosa — vale para todos os campos do app.'),
 ('l','trocas-desfazer','Câmbio › Últimas trocas — "Desfazer"',[LM]+D['cambio-trocas'],
  '.fjCorpo .sl .btn-sc.p{color:var(--accent-fg)!important;background:none!important;border:0!important;padding-right:0!important}',[],
  'Hoje: "Desfazer" em branco; no Caixa › Movimentos o mesmo "Desfazer" é rosa.',
  'Depois: rosa em todo lugar (C: rosa = ação; W: mesma ação, mesma cara), encostado na margem.'),
 ('m','cambio-site','Câmbio › Preços no site — botão',[LM]+D['cambio-site'],
  '.fjJn .mini.ghost{border-radius:14px!important;border-color:var(--sec-bd)!important;width:100%!important}',[],
  'Hoje: "Atualizar preços do site agora" em pílula redonda, só do tamanho do texto.',
  'Depois: o botão secundário de sempre (cantos 14, contorno fino, largura toda), como "% Oferta".'),
 ('n','cabecalho','Giro, Preços e Reservas — título e subtítulo',D['giro-abc'][:1],
  '#v-dash .dHdS{margin-top:-16px!important}',[],
  'Hoje: Giro, Preços e Reservas deixam ~40 px entre o título e a frase de baixo; Atacado, Clientes, Pendências e Catálogo deixam ~4 px.',
  'Depois: a mesma distância em todas as telas (regra 9). Vale para Giro, Preços, Reservas, Dashboard.'),
 ('o','aberto-recuo','Giro / Reservas — conteúdo aberto (⌄)',D['reservas-para-onde'],
  '#v-dash .fxB,#v-dash .fxI{padding-left:0!important;padding-right:0!important;margin-left:0!important;margin-right:0!important}#v-dash .fxI section.card{padding-left:0!important;padding-right:0!important}',[],
  'Hoje: o que abre com ⌄ entra recuado ~34 px (Giro: Lista de compras, Retorno, Curva ABC; Reservas: Ver para onde vai, Próximos 30 dias).',
  'Depois: começa na mesma margem do resto (regra 3).'),
 ('p','marketing-post','Marketing › Post',D['marketing-post'],
  '.mkWhy{background:none!important;padding:0!important;border-radius:0!important}.ljJn textarea{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}',[],
  'Hoje: "Por que estas peças" numa caixa rosa e o texto do post numa caixa.',
  'Depois: "Por que estas peças" como texto (sem caixa) e o texto do post em linha fina (P3).'),
 ('q','adicionar','Inventário › Adicionar (aprovado 134c)',D['inventario-novo'],
  '#addMenuB{background:none!important;border:0!important;border-radius:0!important}#addMenuB .adRow{padding-left:0!important;border-bottom:1px solid var(--line2)!important}',[],
  'Hoje (134c): "Chegou mercadoria" e "Preencher à mão" dentro de uma caixa.',
  'Depois: as duas linhas sem caixa, em linha fina com o ›, como as outras listas.'),
 ('r','novo-acesso-texto','Atacado › Novo acesso — "O que vê"',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataNovo()"],'',
  ["()=>{const i=[...document.querySelectorAll('.ljJn input')].find(x=>/O que v/.test(x.placeholder));if(i)i.placeholder='Códigos que vê (vazio = tudo)'}"],
  'Hoje: a frase de dentro do campo "O que vê…" fica cortada ("vazio = tud").',
  'Depois: frase mais curta que cabe: "Códigos que vê (vazio = tudo)".'),
]
with sync_playwright() as pw:
  for k,nome,tit,ps,css,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abcdefghijklmnopqr')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[];aa=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(300)
        for x in ps:
          try: pg.evaluate(x)
          except Exception: pass
          w(1000)
        if prop:
          if css: pg.add_style_tag(content=css)
          w(200)
          for x in js:
            try: pg.evaluate(x)
            except Exception as e: print('ERR js',k,str(e)[:100])
            w(300)
          w(400)
        oo.append(olho(pg));al=pg.evaluate(A2);aa.append(len(al));(prop and al and print('   alin',k,[(x['r'],x['ex']) for x in al][:6]));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'olho novos:',novos(oo[0],oo[1]),'alin hoje/depois:',aa,flush=True)
      prancha('142%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
