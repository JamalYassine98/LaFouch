# ARGUS · o medidor de família (Parte 4) — UM só, com as regras 13–17 do CLAUDE.md, que valem para app e site:
#  L1 um eixo por bloco · L2 mesma linha (ícone e texto pelo centro) · L3 espaços só 8/16/24/32/48 · L4 o texto cabe (não quebra nem corta)
#  · toque ≥ 44 px · "+" de adicionar redondo · mesma função = mesma aparência (família inteira, em TODAS as telas)
#  · números (G$ 25.000 · US$ 3,79 · 18/11) · cores só da paleta oficial · poucos tamanhos de letra · ícones com um traço só
#  · movimento: uma curva e um tempo, e nada se mexe com "reduzir movimento" · mesmo verbo para a mesma ação · tela vazia = ícone + frase + explicação
# Mede o que APARECE (o desenho visível, 1 px). Cada achado diz a regra, a tela e a peça.
import re, collections
COLETA = r"""()=>{
 const vw=innerWidth,out={pecas:[],linhas:[],botoes:[],trans:[],vazios:[],paleta:[],secoes:[]};
 const vis=e=>{const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return false;for(let p=e;p&&p.nodeType==1;p=p.parentElement){const c=getComputedStyle(p);if(c.display=='none'||c.visibility=='hidden'||+c.opacity==0)return false}return true};
 const own=e=>[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim();
 const cv=document.createElement('i');document.body.appendChild(cv);const rgb=v=>{cv.style.color='';cv.style.color=v;return getComputedStyle(cv).color};
 const rs=getComputedStyle(document.documentElement);for(let i=0;i<rs.length;i++){const k=rs[i];if(k.startsWith('--')){const v=rs.getPropertyValue(k).trim();if(/^#|^rgb|^hsl/.test(v))out.paleta.push(rgb(v))}}cv.remove();
 const sy=scrollY;
 for(const e of document.querySelectorAll('body *')){
  if(e.closest('svg')&&e.tagName.toLowerCase()!='svg')continue;if(!vis(e))continue;
  const c=getComputedStyle(e),r=e.getBoundingClientRect(),t=own(e),tag=e.tagName.toLowerCase();
  if(c.transitionDuration&&c.transitionDuration.split(',').some(d=>parseFloat(d)>0.01))out.trans.push([c.transitionDuration,c.transitionTimingFunction,(e.className&&e.className.baseVal===undefined?String(e.className):'').slice(0,30)]);
  if(t){const rg=document.createRange();const tops=new Set();for(const n of e.childNodes)if(n.nodeType==3&&n.textContent.trim()){rg.selectNodeContents(n);for(const q of rg.getClientRects())if(q.width>0.5)tops.add(Math.round(q.top))}
   out.pecas.push({t:t.slice(0,80),x:r.left,y:r.top+sy,w:r.width,h:r.height,fs:c.fontSize,fw:c.fontWeight,ff:c.fontFamily.split(',')[0].replace(/["']/g,''),cor:c.color,ls:c.letterSpacing,tt:c.textTransform,
    linhas:Math.max(1,tops.size),corta:(e.scrollWidth>e.clientWidth+1&&/(hidden|clip)/.test(c.overflow+c.overflowX))||c.textOverflow=='ellipsis'&&e.scrollWidth>e.clientWidth+1,fora:r.right>vw+1||r.left<-1,
    nowrap:c.whiteSpace=='nowrap',tag,umalinha:tag=='h1'||!!e.closest('button,[role=button],a[href]')&&(()=>{const b=e.closest('button,[role=button],a[href]');return b.getBoundingClientRect().width>=vw*0.6||b.getBoundingClientRect().height<56})(),secao:tag!='button'&&parseFloat(c.fontSize)<=13&&c.textTransform=='uppercase'&&parseFloat(c.letterSpacing)>0.5,titulo:tag=='h1'})}
  const toc=e.matches('button,a[href],[data-act],[role=button],input:not([type=hidden]),select')&&!(e.parentElement&&e.parentElement.closest('button,a[href],[role=button]'));
  if(toc&&!e.closest('#mainnav,nav')){const tx=(e.getAttribute('aria-label')||e.innerText||'').replace(/\s+/g,' ').trim();
   const larga=r.width>=vw*0.6;const svg=e.querySelector('svg');const sr=svg&&vis(svg)?svg.getBoundingClientRect():null;
   const tit=[...e.querySelectorAll('b,strong,span,div')].find(x=>own(x)&&vis(x));const tr=tit?tit.getBoundingClientRect():null;
   (larga?out.linhas:out.botoes).push({t:tx.slice(0,60),x:r.left,y:r.top+sy,w:r.width,h:r.height,raio:parseFloat(c.borderTopLeftRadius)||0,borda:parseFloat(c.borderTopWidth)||0,fundo:c.backgroundColor,
    ic:sr?[sr.left,sr.top+sy,sr.width,sr.height,getComputedStyle(svg).strokeWidth]:null,tx:tr?[tr.left,tr.top+sy,tr.width,tr.height,getComputedStyle(tit).fontSize,getComputedStyle(tit).fontWeight]:null,
    pai:(()=>{for(let q=e.parentElement;q&&q!=document.body;q=q.parentElement){const n=[...q.querySelectorAll('button,a[href],[data-act],[role=button]')].filter(x=>vis(x)&&x.getBoundingClientRect().width>=vw*0.6).length;if(n>=2){q.__argusId=q.__argusId||('b'+Math.random().toString(36).slice(2,8));return q.__argusId}}return ''})(),txt:tx})}
  if(tag=='svg'&&r.width>=16&&!e.closest('#mainnav,nav'))out.pecas.push({t:'',icone:1,x:r.left,y:r.top+sy,w:r.width,h:r.height,traco:c.strokeWidth});
 }
 for(const v of document.querySelectorAll('.lfVazio'))if(vis(v))out.vazios.push({ic:!!v.querySelector('svg'),b:!!v.querySelector('b'),s:!!v.querySelector('span')});
 for(const e of document.querySelectorAll('body *')){if(!vis(e)||e.closest('.lfVazio,#mainnav,nav,button,a,[data-act],[role=button],label'))continue;const t=own(e);if(!/^(Nenhum|Nenhuma|Nada)\b/.test(t)||t.length>=90||t.includes(' · '))continue;   // tela vazia é a FRASE solta, não o resumo de uma linha ("nenhuma no ar · …")
  const sec=e.parentElement&&e.parentElement.closest('section,.view,.cnt');const lista=sec&&[...sec.querySelectorAll('button,[data-act]')].some(x=>vis(x)&&x.getBoundingClientRect().width>=vw*0.6);if(!lista)out.vazios.push({solto:t.slice(0,60)})}
 // L3: em todo bloco cujos filhos vêm um embaixo do outro (mesma margem esquerda), o espaço entre um e o próximo
 const vis2=e=>{const r=e.getBoundingClientRect();return r.width>1&&r.height>1&&getComputedStyle(e).display!='none'};
 const V=document.querySelector('.view:not([hidden])')||document.body;
 const BLOCO='section,div,ul,ol,li,p,h1,h2,h3,form,fieldset,details,table,button,a';
 for(const q of [V,...V.querySelectorAll('*')]){if(q.closest('svg,#mainnav,nav,button,a,[data-act],[role=button]'))continue;if(q.getBoundingClientRect().width<vw*0.6)continue;
  const k=[...q.children].filter(e=>vis2(e)&&e.matches(BLOCO)&&e.getBoundingClientRect().height>=24);if(k.length<2)continue;
  const R=k.map(e=>e.getBoundingClientRect());let pilha=true;for(let i=1;i<R.length;i++)if(R[i].top<R[i-1].bottom-1||Math.abs(R[i].left-R[0].left)>2){pilha=false;break}
  if(!pilha)continue;for(let i=1;i<R.length;i++)out.secoes.push([R[i-1].bottom+sy,R[i].top+sy,(k[i].className&&k[i].className.baseVal===undefined?String(k[i].className):k[i].tagName).slice(0,24)||k[i].tagName])}
 return out}"""
VERBOS = [('Salvar', 'Guardar', 'Gravar'), ('Apagar', 'Excluir', 'Remover', 'Deletar'), ('Adicionar', 'Novo', 'Nova', 'Criar', 'Cadastrar'), ('Voltar', 'Retornar'), ('Editar', 'Alterar', 'Mudar')]
ESP = (0, 8, 16, 24, 32, 48)
def _cor_ok(c, pal):
    if c in pal: return True
    m = re.match(r'rgba?\((\d+), (\d+), (\d+)', c or '')
    return bool(m) and any(p.startswith('rgb(%s, %s, %s' % m.groups()) or p.startswith('rgba(%s, %s, %s' % m.groups()) for p in pal)
def mede_tela(nome, d, reduzido=False):
    """Regras de UMA tela. d = COLETA. Devolve [(regra, tela, peça, detalhe)]."""
    A = []; ad = lambda r, p, x='': A.append((r, nome, p, x))
    pal = set(d['paleta']) | {'rgb(255, 255, 255)', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 0)'}
    for p in d['pecas']:
        if p.get('icone'): continue
        if p['corta']: ad('L4 texto cortado', p['t'])
        if p['fora']: ad('L4 sai da tela', p['t'])
        if p['linhas'] > 1 and (p['titulo'] or p['secao'] or p.get('umalinha')): ad('L4 texto quebrou a linha', p['t'], '%d linhas' % p['linhas'])
        for m in re.finditer(r'G\$ ?(\d[\d.,]*)', p['t']):
            v = m.group(1)
            if (re.search(r'\d{4,}', v) and '.' not in v) or ',' in v: ad('número fora do padrão (G$ 25.000)', p['t'], m.group(0))
        for m in re.finditer(r'(US|R)\$ ?(\d[\d.,]*)', p['t']):
            if re.search(r'\.\d{2}$', m.group(2)): ad('número fora do padrão (US$ 3,79)', p['t'], m.group(0))
        if re.search(r'\b\d{4}-\d{2}-\d{2}\b', p['t']): ad('data fora do padrão (18/11)', p['t'])
        if not _cor_ok(p['cor'], pal): ad('cor fora da paleta oficial', p['t'], p['cor'])
    for l in d['linhas']:
        if l['h'] < 43.5: ad('toque menor que 44 px', l['t'], '%.0f px' % l['h'])
        if l['ic'] and l['tx']:
            ci = l['ic'][1] + l['ic'][3] / 2; ct = l['y'] + l['h'] / 2
            if abs(ci - ct) > 2: ad('L2 ícone fora do centro da linha', l['t'], '%.1f px' % (ci - ct))
    eixos = collections.defaultdict(list)
    for l in d['linhas']:
        if l['tx'] and l['pai']: eixos[(l['pai'], bool(l['ic']))].append((l['tx'][0], l['t']))
    for k, L in eixos.items():
        xs = collections.Counter(round(x) for x, _ in L)
        if len(L) > 1 and len(xs) > 1:
            base = xs.most_common(1)[0][0]
            for x, t in L:
                if abs(x - base) > 1: ad('L1 fora do eixo do bloco', t, '%+.0f px' % (x - base))
    for b in d['botoes'] + d['linhas']:
        t = b['txt']
        if re.match(r'^\+\s*\S', t) or (t == '+' and b['raio'] < b['h'] / 2 - 1): ad('"+" de adicionar não é o redondo', t, '%.0f×%.0f, cantos %.0f' % (b['w'], b['h'], b['raio']))
        if b in d['botoes'] and b['h'] < 43.5 and b['w'] < 43.5 and t: ad('toque menor que 44 px', t, '%.0f×%.0f' % (b['w'], b['h']))
    for fim_ant, ini, nm in d['secoes']:
        g = round(ini - fim_ant)
        if g > 0 and min(abs(g - e) for e in ESP) > 1: ad('L3 espaço fora de 8/16/24/32/48', nm, '%d px' % g)
    if reduzido:
        for k in sorted({(x[0], x[1], x[2]) for x in d['trans']}): ad('mexe com "reduzir movimento" ligado', '%s %s' % (k[0], k[1]), k[2])
    for v in d['vazios']:
        if v.get('solto'): ad('tela vazia sem ícone + frase + explicação', v['solto'])
        elif not (v['ic'] and v['b'] and v['s']): ad('tela vazia incompleta', '')
    return A
def familia_inteira(telas):
    """Regra 13: mesma função = mesma aparência em TODAS as telas. telas = {nome: COLETA}. Devolve achados."""
    A = []; fam = collections.defaultdict(collections.Counter); onde = collections.defaultdict(dict)
    for nome, d in telas.items():
        for p in d['pecas']:
            if p.get('icone'): fam['ícone (traço)'][p['traco']] += 1; onde['ícone (traço)'].setdefault(p['traco'], nome); continue
            k = 'título da tela' if p['titulo'] else 'rótulo de seção' if p['secao'] else None
            if k: s = (p['fs'], p['fw'], p['ff'], p['ls'], p['tt']); fam[k][s] += 1; onde[k].setdefault(s, '%s · %s' % (nome, p['t']))
        for l in d['linhas']:
            if l['tx']: s = (l['tx'][4], l['tx'][5]); fam['título de linha'][s] += 1; onde['título de linha'].setdefault(s, '%s · %s' % (nome, l['t']))
            fam['altura de linha'][round(l['h'])] += 1; onde['altura de linha'].setdefault(round(l['h']), '%s · %s' % (nome, l['t']))
        for b in d['botoes']:
            if b['txt'] == '+' or re.match(r'^\+', b['txt']): s = (round(b['w']), round(b['h']), round(b['raio'])); fam['botão +'][s] += 1; onde['botão +'].setdefault(s, '%s · %s' % (nome, b['txt']))
        for t, f in [(x[0], x[1]) for x in d['trans']]: fam['movimento (tempo e curva)'][(t, f)] += 1; onde['movimento (tempo e curva)'].setdefault((t, f), nome)
    for k, c in fam.items():
        if len(c) > 1:
            base = c.most_common(1)[0][0]
            for s, n in c.items():
                if s != base: A.append(('família: %s com jeito diferente' % k, onde[k][s], str(s), 'o comum é %s' % (base,)))
    verbos = collections.defaultdict(set)
    for nome, d in telas.items():
        for b in d['botoes'] + d['linhas']:
            w = re.sub(r'^[+\s]+', '', b['txt']).split(' ')[0].capitalize()
            for g in VERBOS:
                if w in g: verbos[g].add((w, nome))
    for g, s in verbos.items():
        ws = {w for w, _ in s}
        if len(ws) > 1: A.append(('verbos diferentes para a mesma ação', ', '.join(sorted(ws)), '; '.join('%s em %s' % x for x in sorted(s)[:4]), ''))
    tam = collections.Counter(p['fs'] for d in telas.values() for p in d['pecas'] if not p.get('icone'))
    raros = [f for f, n in tam.items() if n <= 2]
    if raros: A.append(('tamanho de letra usado só 1–2 vezes no app', ', '.join(sorted(raros)), 'tamanhos em uso: %d' % len(tam), ''))
    return A
