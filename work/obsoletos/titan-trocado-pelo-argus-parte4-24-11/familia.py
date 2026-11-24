# TITAN · medidor de família (ESBOCO, 24/11/2026; aprovado pelo dono 07:40 — substitui os medidores que olham cada peça sozinha)
# Junta o que tem a MESMA função em todas as telas (título, frase de baixo do título, rótulo de seção, linha de lista, "+" de adicionar,
# janela, número grande, quadros de uma fileira) e exige que sejam iguais, e que sigam as regras 14–17 do CLAUDE.md.
COLETA=r"""()=>{
 const V=document.querySelector('.view:not([hidden])')||document.body,IH=innerHeight;
 const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2||r.bottom<0||r.top>IH)return false;const c=getComputedStyle(e);return c.visibility!='hidden'&&+c.opacity>0.05&&c.display!='none'};
 const own=e=>[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim();
 const R=e=>{const r=e.getBoundingClientRect();return {x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),b:Math.round(r.bottom)}};
 const st=e=>{const c=getComputedStyle(e);return {fs:parseFloat(c.fontSize),fw:c.fontWeight,ff:c.fontFamily.split(',')[0].replace(/"/g,''),lh:parseFloat(c.lineHeight)||parseFloat(c.fontSize)*1.25,tt:c.textTransform,raio:c.borderTopLeftRadius}};
 const nLin=rs=>{const q=[...rs].filter(x=>x.width>1&&x.height>1).sort((a,b)=>a.top-b.top);let n=0,fundo=-1e9;for(const x of q){if(x.top>=fundo-2){n++;fundo=x.bottom}else fundo=Math.max(fundo,x.bottom)}return n};
 const out={titulos:[],frases_titulo:[],rotulos:[],linhas:[],add:[],janelas:[],numeros:[],quebrados:[],fileiras:[]};
 // janelas (por cima da tela)
 const caixas=[];
 for(const e of document.querySelectorAll('body *')){const c=getComputedStyle(e);if(c.position!='fixed')continue;if(!vis(e))continue;const r=R(e);if(e.closest('nav,.tabbar,header'))continue;
  if(r.h>=IH-4&&r.w>=innerWidth-4){const k=[...e.querySelectorAll('*')].filter(x=>vis(x)&&R(x).w>=300&&R(x).h>=120&&R(x).h<IH-4).sort((a,b)=>R(b).h*R(b).w-R(a).h*R(a).w)[0];if(k)caixas.push(k)}
  else if(r.w>=300&&r.h>=120)caixas.push(e)}
 for(const e of caixas){const r=R(e);
  const bts=[...e.querySelectorAll('button,[role=button]')].filter(vis).map(b=>own(b)||b.getAttribute('aria-label')||'');
  out.janelas.push({r,ih:IH,fechar:bts.filter(t=>/^(Fechar|×|✕|x)$/i.test(t.trim())),texto:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,30)})}
 const raiz=out.janelas.length?null:V;
 const area=raiz||document.body;
 const h1=[...area.querySelectorAll('h1')].filter(vis);
 for(const h of h1){const s=st(h),r=R(h);out.titulos.push({t:own(h)||h.textContent.trim().slice(0,30),r,...s});
  // frase logo abaixo do título (regra do dono 24/11: sai)
  for(const e of area.querySelectorAll('*')){if(!vis(e)||e.closest('button'))continue;const t=own(e);if(!t||t.length<8)continue;const q=R(e),s2=st(e);
   if(q.y>r.b-2&&q.y<r.b+26&&s2.tt!='uppercase'&&Math.abs(q.x-r.x)<6&&s2.fs<16)out.frases_titulo.push({t,r:q})}}
 // botão de adicionar ao lado do título
 for(const b of area.querySelectorAll('button,[role=button]')){if(!vis(b))continue;const t=(own(b)||b.textContent||'').trim();const q=R(b);
  const perto=h1.some(h=>{const r=R(h);return Math.abs((q.y+q.h/2)-(r.y+r.h/2))<20&&q.x>r.x+40});
  if(perto&&(/^\+/.test(t)||/adicionar|novo|nova/i.test(b.getAttribute('aria-label')||'')))out.add.push({t,r:q,raio:getComputedStyle(b).borderTopLeftRadius})}
 for(const e of area.querySelectorAll('*')){if(!vis(e))continue;const t=own(e);if(!t)continue;const s=st(e),q=R(e);
  if(s.tt=='uppercase'&&s.fs<=13&&!e.closest('button')&&!/‹/.test(e.textContent))out.rotulos.push({t,r:q,...s});
  if(/^(G\$|US\$|R\$)\s?[\d.,]+$|^[\d.,]+%?$/.test(t)&&s.fs>=20)out.numeros.push({t,r:q,...s});
  // texto que quebrou (regra L4): mais de uma linha onde não pode
  const rg=document.createRange();const tn=[...e.childNodes].find(n=>n.nodeType==3&&n.textContent.trim());rg.selectNodeContents(tn||e);const linhas=nLin(rg.getClientRects());
  const cartaoPeca=!!e.closest('[data-ref],.pcCard,.pcard');if(linhas>=(cartaoPeca?3:2)&&t.length>3&&s.fs<=17&&!(getComputedStyle(e).textAlign=='center'&&q.w>=250)&&!e.closest('p,.hint,[contenteditable],textarea,.empty,[class*=vazio]'))out.quebrados.push({t:t.slice(0,40),r:q,linhas});
  // linha de lista: texto dentro de uma faixa larga de 44–80 px
  let p=e.parentElement,lin=null;for(let i=0;i<4&&p;i++){const pr=R(p);if(pr.w>=300&&pr.h>=44&&pr.h<=84){lin=p;break}p=p.parentElement}
  const bt=e.closest('button');const aba=bt&&bt.parentElement&&[...bt.parentElement.children].filter(x=>x.tagName=='BUTTON'&&Math.abs(R(x).y-R(bt).y)<4).length>=3;
  const fora=aba||e.closest('nav,.tabbar,[role=tablist],h1,h2,.bb,.botnav')||/^[›⌄‹+×]$/.test(t)||t.length<2;
  if(lin&&!fora&&s.tt!='uppercase'&&!/^(G\$|US\$|R\$)/.test(t)&&!e.closest('button.ic')&&q.x<R(lin).x+R(lin).w*0.45&&(q.x+q.w)<R(lin).x+R(lin).w-40){const pr=R(lin);out.linhas.push({t:t.slice(0,30),r:q,lin:pr,...s,papel:'?',lid:lin.dataset.tl||(lin.dataset.tl=Math.random().toString(36).slice(2,8))})}}
 const porLinha={};for(const l of out.linhas)(porLinha[l.lid]=porLinha[l.lid]||[]).push(l);
 out.linhas=[];for(const id in porLinha){const g=porLinha[id].sort((a,b)=>a.r.y-b.r.y||a.r.x-b.r.x);const tit=g.reduce((m,l)=>l.fs>m.fs?l:m,g[0]);tit.papel='titulo';out.linhas.push(tit);
  for(const l of g){if(l===tit)continue;if(l.r.y>=tit.r.y+tit.r.h-4&&Math.abs(l.r.x-tit.r.x)<8){l.papel='frase';out.linhas.push(l)}}}
 // fileiras: irmãos com o mesmo topo e mesma largura (quadros) — o conteúdo de dentro tem de cair na mesma altura
 for(const p of area.querySelectorAll('*')){const ks=[...p.children].filter(vis);if(ks.length<2)continue;const rs=ks.map(R);
  const grupos={};rs.forEach((r,i)=>{if(r.w<60||r.h<60)return;(grupos[r.y]=grupos[r.y]||[]).push(i)});
  for(const y in grupos){const g=grupos[y].filter(i=>!ks[i].matches('[data-ref],.pcCard,.pcard')&&!ks[i].querySelector('[data-ref]'));if(g.length<2)continue;if(new Set(g.map(i=>rs[i].w)).size>1)continue;
   const perfil=g.map(i=>{const k=ks[i];return [...k.querySelectorAll('*')].filter(e=>vis(e)&&own(e)).map(e=>{const q=R(e);return {t:own(e).slice(0,16),dy:q.y-rs[i].y,h:q.h}})});
   // compara o n-ésimo elemento de cada quadro
   const n=Math.min(...perfil.map(a=>a.length));const dif=[];for(let j=0;j<n;j++){const ys=perfil.map(a=>a[j].dy);if(Math.max(...ys)-Math.min(...ys)>2)dif.push({j,ys,ex:perfil.map(a=>a[j].t)})}
   const contagem=perfil.map(a=>a.length);
   if(dif.length||new Set(contagem).size>1)out.fileiras.push({y:+y,n:g.length,dif:dif.slice(0,3),contagem})}}
 out.voltas=[...area.querySelectorAll('button,a,[role=button],[data-act]')].filter(e=>vis(e)&&/^‹\s*\S/.test((e.textContent||'').trim())&&R(e).y<IH*0.6&&!e.parentElement.closest('button,a,[role=button],[data-act]')).map(e=>({t:e.textContent.replace(/\s+/g,' ').trim().slice(0,24),r:R(e)})).filter((v,i,a)=>a.findIndex(w=>Math.abs(w.r.y-v.r.y)<6)==i);
 out.trilhas=[...area.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length>=2&&/›/.test(own(e)+[...e.children].map(c=>c.textContent).join(''))&&R(e).y<IH*0.5&&R(e).h<40&&[...e.children].length<=5&&!e.closest('button')&&/^[^›]+›[^›]+/.test(e.textContent.replace(/\s+/g,' ').trim())).map(e=>e.textContent.replace(/\s+/g,' ').trim().slice(0,40));
 out.grandes=[...area.querySelectorAll('*')].filter(e=>vis(e)&&own(e)&&parseFloat(getComputedStyle(e).fontSize)>=22&&R(e).y<IH*0.55&&own(e).length>1&&!/^(G\$|US\$|R\$|[\d.,%]+)/.test(own(e))).map(e=>({t:own(e).slice(0,24),fs:parseFloat(getComputedStyle(e).fontSize)}));
 out.mais_largo=[...area.querySelectorAll('button')].filter(b=>{if(!vis(b))return false;const t=(b.textContent||'').trim();const c=getComputedStyle(b);const caixa=(c.borderTopWidth!='0px'&&c.borderTopStyle!='none')||(c.backgroundColor!='rgba(0, 0, 0, 0)'&&c.backgroundColor!='transparent');return /^\+\s*\S/.test(t)&&caixa&&!/›\s*$/.test(t)}).map(b=>({t:b.textContent.trim().slice(0,24),r:R(b)}));
 out.blocos=[];for(const e of area.querySelectorAll('div,span,small,p,li,a,button,label')){if(!vis(e)||e.closest('p,.hint,textarea,nav,.tabbar,[data-ref],.pcCard'))continue;const ks=[...e.children];if(!ks.length||ks.some(k=>!/^(SPAN|B|SMALL|I|EM|STRONG)$/.test(k.tagName)))continue;const t=e.textContent.replace(/\s+/g,' ').trim();if(t.length<8)continue;const rg=document.createRange();rg.selectNodeContents(e);const tops={size:nLin(rg.getClientRects())};
   const inline=ks.every(k=>/^inline/.test(getComputedStyle(k).display));
   if(inline&&tops.size>=2&&parseFloat(getComputedStyle(e).fontSize)<=17)out.blocos.push({t:t.slice(0,44),linhas:tops.size});
   // linha de base: pedaços na mesma linha com fundo do texto diferente
   const pedacos=[...e.childNodes].filter(n=>(n.textContent||'').trim().length>1).map(n=>{const r2=document.createRange();r2.selectNodeContents(n);const q=[...r2.getClientRects()].filter(x=>x.width>1);return q.length==1?q[0]:null}).filter(Boolean);
   const sobrepoe=pedacos.length>=2&&pedacos.every(a=>pedacos.every(b=>a.top<b.bottom-2&&b.top<a.bottom-2));
   if(sobrepoe){const bs=pedacos.map(x=>x.bottom);const hs=pedacos.map(x=>x.height);if(Math.max(...bs)-Math.min(...bs)>2.5&&Math.max(...hs)-Math.min(...hs)>2)out.blocos.push({t:t.slice(0,44),base:Math.round(Math.max(...bs)-Math.min(...bs))})}}
 return out}"""
def regras(T):
  """T = {tela: coleta}. Devolve {tela: [achados]} com regra e o que fazer."""
  from collections import Counter
  A={k:[] for k in T}
  def moda(vals):return Counter(vals).most_common(1)[0][0] if vals else None
  # títulos: um desenho só
  ts=[(k,t) for k,c in T.items() for t in c['titulos']]
  g=lambda t,p:t['r']['x'] if p=='x' else t[p]
  for prop in ('fs','fw','ff','x'):
    m=moda([g(t,prop) for _,t in ts])
    for k,t in ts:
      if g(t,prop)!=m:A[k].append(('título fora da família','%s: %s (família: %s)'%(prop,g(t,prop),m),t['t']))
  for k,c in T.items():
    if len(c['titulos'])>1:A[k].append(('dois títulos na tela (regra 16)',' · '.join(t['t'] for t in c['titulos']),''))
    for f in c['frases_titulo']:A[k].append(('frase de baixo do título (dono 24/11: sai)',f['t'],''))
    for a in c['add']:
      redondo=a['raio'] in ('50%','999px') or (a['raio'].endswith('px') and float(a['raio'][:-2])>=a['r']['h']/2-1)
      if a['t'] not in ('+','') or a['r']['w']!=a['r']['h']:A[k].append(('"+" de adicionar não é o redondo (regra 15)','"%s" %dx%d'%(a['t'],a['r']['w'],a['r']['h']),''))
    for j in c['janelas']:
      if abs(j['r']['b']-j['ih'])>2:A[k].append(('janela não é a de baixo (regra 15)','janela "%s" de %d a %d px (tela %d)'%(j['texto'],j['r']['y'],j['r']['b'],j['ih']),''))
      if j['fechar']:A[k].append(('janela com Fechar/× (regra 15)',', '.join(j['fechar']),j['texto']))
    if len(c.get('voltas',[]))>1:A[k].append(('dois "‹ voltar" na tela (regra 16)',' · '.join(v['t'] for v in c['voltas']),''))
    for t in c.get('trilhas',[]):A[k].append(('trilha de caminho além do "‹ voltar" (regra 16)',t,''))
    if len(c.get('grandes',[]))>1 and not c['janelas']:A[k].append(('mais de um título grande (regra 16)',' · '.join('%s (%gpx)'%(g['t'],g['fs']) for g in c['grandes']),''))
    ja=set(a['t'] for a in c['add'])
    for b in c.get('mais_largo',[]):
      if b['t'] in ja:continue
      A[k].append(('"+" em botão largo — adicionar é o "+" redondo (regra 15)','"%s" %dx%d'%(b['t'],b['r']['w'],b['r']['h']),''))
    vistos=set(q['t'] for q in c['quebrados'])
    for bl in c.get('blocos',[]):
      if 'linhas' in bl and bl['t'][:40] not in vistos:A[k].append(('texto quebrou em %d linhas (L4)'%bl['linhas'],bl['t'],''))
      if 'base' in bl:A[k].append(('fora da mesma linha de base (L2)','%d px · %s'%(bl['base'],bl['t']),''))
    for q in c['quebrados']:A[k].append(('texto quebrou em %d linhas (L4)'%q['linhas'],q['t'],''))
    for f in c['fileiras']:A[k].append(('fileira desalinhada (L2)','%d quadros em y=%d; alturas de dentro: %s'%(f['n'],f['y'],'; '.join('%s→%s'%(d['ex'],d['ys']) for d in f['dif']) or 'conteúdo diferente %s'%f['contagem']),''))
  # linhas de lista: valores aprovados no 86 v2 (título 16/500 · frase 13/400)
  APROV={'titulo':(16,'500'),'frase':(13,'400')}
  for k,c in T.items():
    vist=set()
    for l in c['linhas']:
      fs,fw=APROV[l['papel']]
      if (abs(l['fs']-fs)>0.6 or l['fw']!=fw) and l['t'] not in vist:vist.add(l['t']);A[k].append(('%s de linha fora do 86'%l['papel'],'%s/%s (aprovado %s/%s)'%(l['fs'],l['fw'],fs,fw),l['t']))
  ns=[(k,n) for k,c in T.items() for n in c['numeros']]
  m=moda([n['ff'] for _,n in ns])
  for k,n in ns:
    if n['ff']!=m:A[k].append(('número grande em outra letra (regra 17)','%s (família: %s)'%(n['ff'],m),n['t']))
  return A
