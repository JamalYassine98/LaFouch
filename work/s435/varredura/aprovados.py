# Os APROVADOS de 22–23/11 aplicados por cima da base (regra 10: toda proposta leva todos os aprovados). Uma função só: aplica(pg).
# 80 trilho 140C (todas as barras) + alinhado às margens da linha (83 v3) · 81 botões (principal .go · pequeno .mini · perigo vermelho)
# · 82 campos em linha fina (a busca fica) · 83 sem texto que explica · 84 ícones traço 1,6 · 85 aviso que fica = linha com ponto.
_b=open('/home/claude/lafouch/work/s435/barras/esboco_80.py').read();VIRA=_b[_b.index('VIRA=r"""')+9:_b.index('"""',_b.index('VIRA=r"""')+9)]
_t=open('/home/claude/lafouch/work/s435/varredura/esboco_83.py').read();TIRA=_t[_t.index('TIRA=r"""')+9:_t.index('"""',_t.index('TIRA=r"""')+9)]
_a=open('/home/claude/lafouch/work/s435/varredura/avisos/esboco_85.py').read();FICA=_a[_a.index('FICA=r"""')+9:_a.index('"""',_a.index('FICA=r"""')+9)]
LINHA=open('/home/claude/lafouch/work/s435/varredura/esboco_82.py').read().split("LINHA='")[1].split("'\n")[0].replace('.in{','.in:not([placeholder^=Buscar]){').replace('.in,','.in:not([placeholder^=Buscar]),')
EXPL=[l.split(' | ')[1] for l in open('/home/claude/lafouch/work/s435/varredura/TEXTOS-EXPLICATIVOS.md') if l.startswith('| EXPLICA')]
BOT=r"""()=>{document.querySelectorAll('.fx418P,.pd418P').forEach(b=>{b.className='go'});document.querySelectorAll('.btn-sc,.b75,.up75,.impBp').forEach(b=>{b.className='mini';b.style.setProperty('gap','8px');b.style.setProperty('display','inline-flex');b.style.setProperty('align-items','center');b.style.setProperty('justify-content','center')})}"""
ICO=r"""()=>{document.querySelectorAll('.view svg[stroke], .view svg [stroke-width], .view svg').forEach(s=>{if(s.getAttribute('stroke-width'))s.setAttribute('stroke-width','1.6')})}"""
ALIN=r"""()=>{document.querySelectorAll('.ajS .trk').forEach(t=>{const s=t.closest('.ajS'),r=s.querySelector('.ajR').getBoundingClientRect(),q=t.getBoundingClientRect();t.style.setProperty('margin-left',(r.left-q.left)+'px','important');t.style.setProperty('width',r.width+'px','important');const o=t.querySelector('.trkB.on'),th=t.querySelector('.trkTh');if(o&&th)th.style.cssText='width:'+o.offsetWidth+'px!important;transform:none!important;left:'+o.offsetLeft+'px!important'})}"""
def aplica(pg):
  pg.add_style_tag(content=LINHA)
  pg.evaluate(TIRA,EXPL);pg.evaluate(FICA);pg.evaluate(BOT);pg.evaluate(ICO)
  pg.evaluate(VIRA,'.tmseg,.sg418,.catbar3,.adSeg,#sortChips,#fFaixas');pg.wait_for_timeout(300);pg.evaluate(ALIN);pg.wait_for_timeout(200)
