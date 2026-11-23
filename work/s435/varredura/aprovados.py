# Os APROVADOS de 22–23/11 aplicados por cima da base (regra 10: toda proposta leva todos os aprovados). Uma função só: aplica(pg).
# 80 trilho 140C (todas as barras) + alinhado às margens da linha (83 v3) · 81 botões (principal .go · pequeno .mini · perigo vermelho)
# · 82 campos em linha fina (a busca fica) · 83 sem texto que explica · 84 ícones traço 1,6 · 85 aviso que fica = linha com ponto.
_b=open('/home/claude/lafouch/work/s435/barras/esboco_80.py').read();VIRA=_b[_b.index('VIRA=r"""')+9:_b.index('"""',_b.index('VIRA=r"""')+9)]
_t=open('/home/claude/lafouch/work/s435/varredura/esboco_83.py').read();TIRA=_t[_t.index('TIRA=r"""')+9:_t.index('"""',_t.index('TIRA=r"""')+9)]
_a=open('/home/claude/lafouch/work/s435/varredura/avisos/esboco_85.py').read();FICA=_a[_a.index('FICA=r"""')+9:_a.index('"""',_a.index('FICA=r"""')+9)]
LINHA=open('/home/claude/lafouch/work/s435/varredura/esboco_82.py').read().split("LINHA='")[1].split("'\n")[0].replace('.in{','.in:not([placeholder^=Buscar]){').replace('.in,','.in:not([placeholder^=Buscar]),')
EXPL=[l.split(' | ')[1] for l in open('/home/claude/lafouch/work/s435/varredura/TEXTOS-EXPLICATIVOS.md') if l.startswith('| EXPLICA')]
BOT=r"""()=>{document.querySelectorAll('.fx418P,.pd418P').forEach(b=>{b.className='go'});document.querySelectorAll('.btn-sc,.b75,.up75,.impBp').forEach(b=>{b.className='mini';b.style.setProperty('gap','8px');b.style.setProperty('display','inline-flex');b.style.setProperty('align-items','center');b.style.setProperty('justify-content','center');b.style.setProperty('white-space','nowrap');b.style.setProperty('flex','0 0 auto')})}"""
ICO=r"""()=>{document.querySelectorAll('.view svg[stroke], .view svg [stroke-width], .view svg').forEach(s=>{if(s.getAttribute('stroke-width'))s.setAttribute('stroke-width','1.6')})}"""
ALIN=r"""()=>{document.querySelectorAll('.ajS .trk').forEach(t=>{const s=t.closest('.ajS'),r=s.querySelector('.ajR').getBoundingClientRect(),q=t.getBoundingClientRect();t.style.setProperty('margin-left',(r.left-q.left)+'px','important');t.style.setProperty('width',r.width+'px','important');const o=t.querySelector('.trkB.on'),th=t.querySelector('.trkTh');if(o&&th)th.style.cssText='width:'+o.offsetWidth+'px!important;transform:none!important;left:'+o.offsetLeft+'px!important'})}"""
# 89a (dono 23/11 08:05: "no claro a bolinha está muito laranja"): bolinha de atenção tem cor própria (--ptw). No escuro = --warn;
# no claro, --warn é escurecido para TEXTO ler bem (#8a5a00, fica laranja-marrom); a bolinha não é texto e vem sempre com a frase, então usa amarelo-ouro.
PTW=':root{--ptw:var(--warn)}html[data-tema="claro"]{--ptw:#e0ac00}@media (prefers-color-scheme:light){html:not([data-tema="escuro"]){--ptw:#e0ac00}}'
FICA=FICA.replace("w?'var(--warn)'","w?'var(--ptw)'")

# 84 (aprovado 23/11 00:15): nenhum emoji na tela (no app) — tira o emoji dos textos, um lugar só.
SEMEMOJI=r"""()=>{const re=/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]\uFE0F?\s*/gu;const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(re.test(n.nodeValue)){re.lastIndex=0;n.nodeValue=n.nodeValue.replace(re,'')}}}"""

# CORES PADRONIZADAS (IDEIAS 10, dono aprovou 23/11 10:52; bolinha 11:06): tudo sai da cor oficial #943d6f (CMYK C47 M91 Y29 K8).
# Por enquanto SÓ o tema CLARO (a família não define o escuro — perguntar). Saem #a2447c, #8a2f66, os degradês (cupCard) e o vinho solto.
# CORES (dono 23/11 11:25: 'mantém o design que construímos; a ÚNICA coisa que muda é a cor pela cor oficial do logo'):
# só a COR DA MARCA troca (#a2447c / #8a2f66 / #8d3a69 / degradês → #943d6f). Fundos, cinzas e avisos ficam como no design aprovado.
# No escuro, letra/link da marca = a mesma cor oficial clareada (marca + 40% branco #bf8ba9), porque o #943d6f puro não se lê no fundo escuro.
_CL='--accent:#943d6f;--bar:#943d6f;--accent-fg:#943d6f;--accent-soft:#f6eff3'
_ES='--accent:#943d6f;--bar:#943d6f;--accent-fg:#bf8ba9;--accent-soft:#2a1a22'
CORES=('html:not([data-tema="claro"]){'+_ES+'}html[data-tema="claro"]{'+_CL+'}'
       '@media (prefers-color-scheme:light){html:not([data-tema="escuro"]){'+_CL+'}}.cupCard{background:#943d6f!important}')

# a cor da marca escrita solta no CSS do app (32× #8d3a69, 9× #8a2f66, 8× #a2447c…) também troca — um passo só, regra por regra.
CORLIT=r"""()=>{const M=[[/#8d3a69|#a2447c|#8a2f66|#b4528a|rgb\(141, 58, 105\)|rgb\(162, 68, 124\)|rgb\(138, 47, 102\)/gi,'#943d6f'],[/#e08bc0|#f3c0dc/gi,'#bf8ba9'],[/#f3e1ec/gi,'#f6eff3']];
 const tr=t=>M.reduce((a,[r,v])=>a.replace(r,v),t);
 for(const sh of document.styleSheets){let R;try{R=sh.cssRules}catch(e){continue}
  for(let i=0;i<R.length;i++){const t=R[i].cssText,n=tr(t);if(n!==t){try{sh.deleteRule(i);sh.insertRule(n,i)}catch(e){}}}}
 document.querySelectorAll('[style]').forEach(e=>{const t=e.getAttribute('style'),n=tr(t);if(n!==t)e.setAttribute('style',n)})}"""

def aplica(pg):
  pg.add_style_tag(content=LINHA);pg.add_style_tag(content=PTW);pg.add_style_tag(content=CORES);pg.evaluate(CORLIT)
  pg.evaluate(TIRA,EXPL);pg.evaluate(FICA);pg.evaluate(BOT);pg.evaluate(ICO);pg.evaluate(SEMEMOJI)
  pg.evaluate(VIRA,'.tmseg,.sg418,.catbar3,.adSeg,#sortChips,#fFaixas');pg.wait_for_timeout(300);pg.evaluate(ALIN);pg.wait_for_timeout(200)

# AJUSTES no estado APROVADO (22/11 01:28 'cada ajuste mora na tela do assunto' + 21:56 Marca só no Marketing + 46 sem Preços/Pagamento
# automático): Ajustes = só gerais — CONTAS LIGADAS: Instagram · Cópias e nuvem · ESTE APARELHO: Impressora · Tema · Segurança · Sons e avisos ·
# Atualização. Saem Marca, Site, Pedidos do site, Preços (e Preço automático / Contas, taxas e meta), Pagamento automático, e o bloco LOJA.
AJUSTES_CSS='#v-ajustes .ajS[data-k=marca],#v-ajustes .ajS[data-k=site],#v-ajustes .ajS[data-k=ped],#v-ajustes .ajS[data-k=preco],#v-ajustes .ajS[data-k=pa],#v-ajustes .ajS[data-k=pauto],#v-ajustes .paCard,#v-ajustes .fxF{display:none!important}'
AJUSTES_JS=r"""()=>{const v=document.getElementById('v-ajustes');if(!v)return;
 v.querySelectorAll('.ajBl').forEach(b=>{const t=b.querySelector('.ajBt');if(t&&/^loja$/i.test(t.textContent.trim()))b.style.setProperty('display','none','important')});
 const c=[...v.querySelectorAll('*')].find(e=>e.children.length==0&&/^Aparelho, loja, site e segurança/.test(e.textContent.trim()));c&&c.remove();
 [...v.querySelectorAll('*')].filter(e=>e.children.length==0&&/^Versão [\d.]+$/.test(e.textContent.trim())&&!e.closest('.ajS')).forEach(e=>e.remove());
 const bk=v.querySelector('.ajS[data-k=bk]');if(bk&&!v.querySelector('.ajS[data-k=ig]')){const ig=bk.cloneNode(true);ig.dataset.k='ig';ig.querySelectorAll('.ajB,.ajBi').forEach(x=>x.remove());
  ig.querySelector('.ajR b').textContent='Instagram';const r=ig.querySelector('.ajRes');if(r){r.textContent='não ligado';r.classList.remove('al');r.querySelectorAll('.ajPt').forEach(x=>x.remove());r.style.color='var(--mute)'}
  const s=ig.querySelector('.ajIc svg');if(s)s.innerHTML='<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>';bk.parentNode.insertBefore(ig,bk)}}"""
def ajustes(pg):
  pg.add_style_tag(content=AJUSTES_CSS);pg.evaluate(AJUSTES_JS);pg.wait_for_timeout(200)
