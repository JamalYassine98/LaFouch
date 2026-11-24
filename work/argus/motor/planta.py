# ARGUS · a PLANTA de uma tela (Parte 1). A planta é o que o dono aprovou, guardado por dentro:
#  · as peças que APARECEM (texto, caixa, letra, cor, fundo, borda, desenho do ícone) — pelo que se vê, não pelo nome do código;
#  · nos dois temas do app; os dados (cenário), o relógio, o caminho até a tela e o nome dela;
#  · as LIGAÇÕES: o que cada toque faz (sai para outra tela, abre ali, abre a janela de baixo, nada) — gravado tocando de verdade.
# Planta só vale com a linha de aprovação na lista viva (docs/FALTA-APROVAR-15-11.md). Ajuste aprovado → a anterior vai para
# work/obsoletos/argus-plantas/ (só a última aprovada vale).
import os, sys, json, re, time, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A)); sys.path.insert(0, os.path.join(A, 'motor'))
import abrir, loja, aparelhos
P_APP = os.path.join(A, 'plantas', 'app'); LISTA = os.path.join(R, 'docs', 'FALTA-APROVAR-15-11.md')
COLETA = r"""()=>{
 const IH=innerHeight,sx=scrollX,sy=scrollY,out=[];
 const tr=c=>!c||c=='transparent'||/rgba\(.*,\s*0\)$/.test(c);
 const vis=e=>{const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return false;for(let p=e;p&&p.nodeType==1;p=p.parentElement){const c=getComputedStyle(p);if(c.display=='none'||c.visibility=='hidden'||+c.opacity==0)return false}return true};
 const own=e=>[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim();
 const n1=v=>Math.round(v*10)/10;
 const geo=s=>[...s.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse')].map(x=>x.tagName.toLowerCase()+':'+['d','cx','cy','r','rx','ry','x','y','x1','y1','x2','y2','width','height','points'].filter(a=>x.hasAttribute(a)).map(a=>a+'='+x.getAttribute(a).replace(/-?\d*\.?\d+/g,m=>String(n1(+m)))).join(',')).join('|');
 for(const e of document.querySelectorAll('body *')){
  if(e.closest('#tt,.bx,[data-argus]'))continue;
  const tag=e.tagName.toLowerCase();if(tag=='script'||tag=='style')continue;
  if(e.closest('svg')&&tag!='svg')continue;
  if(!vis(e))continue;
  const c=getComputedStyle(e),r=e.getBoundingClientRect(),t=tag=='svg'?'':own(e);
  const fundo=!tr(c.backgroundColor)?c.backgroundColor:'',borda=parseFloat(c.borderTopWidth)||parseFloat(c.borderBottomWidth)?c.borderTopWidth+' '+c.borderTopColor+' / '+c.borderBottomWidth+' '+c.borderBottomColor:'';
  if(!t&&tag!='svg'&&!fundo&&!borda&&!(tag=='input'||tag=='textarea'||tag=='img'))continue;
  const p={tipo:tag=='svg'?'icone':t?'texto':(tag=='input'||tag=='textarea')?'campo':tag=='img'?'imagem':'caixa',
   texto:t||(tag=='input'||tag=='textarea'?(e.placeholder||e.value||''):''),caixa:[n1(r.left+sx),n1(r.top+sy),n1(r.width),n1(r.height)],
   cor:c.color,fundo,borda,raio:c.borderRadius!='0px'?c.borderRadius:'',
   letra:t||tag=='input'?[c.fontSize,c.fontWeight,c.fontFamily.split(',')[0].replace(/["']/g,'').trim(),c.letterSpacing,c.textTransform]:null,
   fixo:/fixed|sticky/.test(c.position)||!!e.closest('nav')};
  if(tag=='svg')p.icone={geo:geo(e),traco:c.strokeWidth,cor:c.stroke!='none'?c.stroke:c.color};
  out.push(p)}
 return out}"""
TITULO = "()=>{const h=[...document.querySelectorAll('h1')].find(e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2&&getComputedStyle(e).visibility!='hidden'});const v=(window.__LF&&__LF.S&&__LF.S.view)||'';return (h?h.textContent.replace(/\\s+/g,' ').trim():'')+' ['+v+']'}"  # nome da tela = título + a tela em que o app diz estar (o Início não tem título)
TOCAVEIS = r"""()=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;for(let p=e;p&&p.nodeType==1;p=p.parentElement){const c=getComputedStyle(p);if(c.display=='none'||c.visibility=='hidden'||+c.opacity==0)return false}return true};
 const L=[...document.querySelectorAll('button,a[href],[data-act],[role=button],summary,input[type=checkbox],select')].filter(e=>vis(e)&&!e.closest('nav,#mainnav,#nvBar,aside')&&!(e.parentElement&&e.parentElement.closest('button,a[href],[data-act],[role=button]')));
 return L.map((e,i)=>({i,nome:(e.getAttribute('aria-label')||e.textContent||e.value||'').replace(/\s+/g,' ').trim().slice(0,60),act:e.getAttribute('data-act')||'',id:e.getAttribute('data-id')||'',tag:e.tagName.toLowerCase()}))}"""
TOCA = r"""(k)=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;for(let p=e;p&&p.nodeType==1;p=p.parentElement){const c=getComputedStyle(p);if(c.display=='none'||c.visibility=='hidden'||+c.opacity==0)return false}return true};
 const L=[...document.querySelectorAll('button,a[href],[data-act],[role=button],summary,input[type=checkbox],select')].filter(e=>vis(e)&&!e.closest('nav,#mainnav,#nvBar,aside')&&!(e.parentElement&&e.parentElement.closest('button,a[href],[data-act],[role=button]')));
 const e=L[k];if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});
 window.__ant={h:document.documentElement.scrollHeight,fixos:[...document.querySelectorAll('body *')].filter(x=>getComputedStyle(x).position=='fixed'&&vis(x)).length,exp:e.getAttribute('aria-expanded'),sec:(e.closest('section')||{}).className||''};
 e.click();return 1}"""
DEPOIS = r"""(k)=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;for(let p=e;p&&p.nodeType==1;p=p.parentElement){const c=getComputedStyle(p);if(c.display=='none'||c.visibility=='hidden'||+c.opacity==0)return false}return true};
 const a=window.__ant||{};const fx=[...document.querySelectorAll('body *')].filter(x=>getComputedStyle(x).position=='fixed'&&vis(x));
 const jan=fx.filter(x=>{const r=x.getBoundingClientRect();return r.bottom>=innerHeight-2&&r.width>=innerWidth*0.6&&r.height>=innerHeight*0.2&&!x.closest('nav,#mainnav,#nvBar')});
 const j=jan[jan.length-1];const tj=j?((j.querySelector('h1,h2,h3,b')||{}).textContent||'').replace(/\s+/g,' ').trim().slice(0,60):'';
 return {h:document.documentElement.scrollHeight,dh:document.documentElement.scrollHeight-(a.h||0),janela:fx.length>(a.fixos||0)&&j?tj:null}}"""
PERIGO_NOME = re.compile(r'\b(apagar|excluir|remover|vender|salvar|publicar|enviar|confirmar|pagar|sair|desfazer|limpar|zerar|baixar|importar|restaurar|cancelar|lixeira)\b', re.I)  # verbo inteiro no nome do botão
PERIGO_ACAO = re.compile(r'^(del|apag|exclu|remov|vend|salv|pub|envi|pag|sair|limp|zer|restaur|cancel|import)', re.I)  # começo da ação (data-act)
def _abre_tela(pw, tela, tema, porta, aparelho=aparelhos.DONO):
    b, pg = abrir.abre(pw, aparelho=aparelho, tema=tema, cenario=tela['cenario'], porta=porta)
    for js in tela['passos']: pg.evaluate(js); pg.wait_for_timeout(1000)
    pg.wait_for_timeout(500); return b, pg
def ligacoes(pw, tela, porta):
    """Toca de verdade em cada botão da tela (reabrindo a tela antes de cada toque) e anota o que acontece."""
    b, pg = _abre_tela(pw, tela, 'escuro', porta); tit0 = pg.evaluate(TITULO); L = pg.evaluate(TOCAVEIS); b.close(); out = []
    for t in L:
        if PERIGO_NOME.search(t['nome']) or PERIGO_ACAO.search(t['act']): out.append(dict(t, faz='não tocado (perigo)')); continue
        b, pg = _abre_tela(pw, tela, 'escuro', porta)
        if not pg.evaluate(TOCA, t['i']): b.close(); out.append(dict(t, faz='não achado')); continue
        pg.wait_for_timeout(1000); d = pg.evaluate(DEPOIS, t['i']); tit = pg.evaluate(TITULO); b.close()
        if tit and tit != tit0: faz = 'sai para: ' + tit
        elif d['janela'] is not None: faz = 'abre a janela de baixo: ' + d['janela']
        elif d['dh'] > 8: faz = 'abre ali'
        else: faz = 'nada'
        out.append(dict(t, faz=faz))
    return tit0, out
def grava(pw, id_, tela, porta=None, aprovacao=None, com_ligacoes=True):
    """tela = {'nome', 'passos', 'cenario'} · porta = cópia de esboço (None = app de hoje) · aprovacao = trecho da linha na lista viva."""
    os.makedirs(P_APP, exist_ok=True)
    pl = {'id': id_, 'tela': tela['nome'], 'passos': tela['passos'], 'cenario': tela['cenario'], 'data': loja.DATA,
          'aparelho': aparelhos.DONO, 'aprovacao': aprovacao, 'temas': {}}
    for tema in aparelhos.MODOS['app']['tema']:
        b, pg = _abre_tela(pw, tela, tema, porta)
        pl['temas'][tema] = {'titulo': pg.evaluate(TITULO), 'pecas': pg.evaluate(COLETA)}
        f = os.path.join(P_APP, '%s_%s.jpg' % (id_, tema)); pg.screenshot(path='/tmp/_pl.png', full_page=True); b.close()
        from PIL import Image; Image.open('/tmp/_pl.png').convert('RGB').save(f, quality=82)
    if com_ligacoes: pl['titulo'], pl['ligacoes'] = ligacoes(pw, tela, porta)
    return pl
def caminho(id_): return os.path.join(P_APP, id_ + '.json')
def salva(pl):
    """Guarda a planta; se já existe uma com o mesmo id, a anterior vai para work/obsoletos (só a última vale)."""
    if os.path.exists(caminho(pl['id'])): substitui(pl['id'])
    json.dump(pl, open(caminho(pl['id']), 'w'), ensure_ascii=False, indent=1)
def substitui(id_):
    d = os.path.join(R, 'work', 'obsoletos', 'argus-plantas', '%s_%s' % (id_, time.strftime('%Y%m%d-%H%M%S'))); os.makedirs(d, exist_ok=True)
    for f in os.listdir(P_APP):
        if f == id_ + '.json' or f.startswith(id_ + '_'): shutil.move(os.path.join(P_APP, f), os.path.join(d, f))
    return d
def valida(pl):
    """'aprovada' só com o trecho da aprovação achado na lista viva; sem aprovação = 'pendente' (não trava nem libera nada)."""
    if not pl.get('aprovacao'): return 'pendente'
    return 'aprovada' if pl['aprovacao'] in open(LISTA, encoding='utf-8').read() else 'INVÁLIDA (aprovação não está na lista viva)'
