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

def aplica(pg):
  pg.add_style_tag(content=LINHA);pg.add_style_tag(content=PTW)
  pg.evaluate(TIRA,EXPL);pg.evaluate(FICA);pg.evaluate(BOT);pg.evaluate(ICO)
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
